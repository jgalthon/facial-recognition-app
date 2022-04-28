import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState, useCallback } from "react";
import { Col, Container, Row } from "react-bootstrap";
import * as faceapi from "face-api.js";

const VIDEO_HEIGHT = 200;
const VIDEO_WIDTH = 200;

const Home = () => {




  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const faceDetectionRef = useRef(null);

  const [imageUri, setImageUri] = useState(null);
  const [isWebcamDisabled, setIsWebcamDisabled] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);


  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])


  const stopVideo = () => {
    const video = videoRef.current;
    video.srcObject.getTracks().forEach(function (track) {
      track.stop();
    });
    videoRef.current.srcObject = null;
    clearInterval(intervalRef.current)
  }



  const handleVideoOnPlay = useCallback(() => {
    const video = videoRef.current;
    const canvas = faceapi.createCanvasFromMedia(video);
    const displaySize = {
      width: VIDEO_WIDTH,
      height: VIDEO_HEIGHT
    };


    canvas.classList.add('position-absolute');
    video.insertAdjacentElement('afterend', canvas);
    faceapi.matchDimensions(canvas, displaySize);
    intervalRef.current = setInterval(async () => {

      const detections = await faceapi.detectAllFaces(video,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      // console.log(detections);
      if (detections.length > 0) {
        faceDetectionRef.current = true
      } else {
        faceDetectionRef.current = false
      }
    }, 1000)
  }, [])





  const getVideo = useCallback(() => {

    navigator.mediaDevices
      .getUserMedia({
        video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT },
      })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play()?.then(_ => {
          handleVideoOnPlay();
        })?.catch(error => {
          alert(error)
        })
      })
      .catch((error) => {
        alert("Unable to capture WebCam.");
        setIsWebcamDisabled(true)
      });

  }, [handleVideoOnPlay]);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(getVideo());
    }
    loadModels();
  }, [getVideo]);



  const paintToCanvas = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    return setInterval(() => {
      canvas.getContext("2d").drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    }, 200);
  };

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const captureImage = () => {


    if (isWebcamDisabled) {
      alert("Unable to capture WebCam.");
      return;
    }
    if (!faceDetectionRef.current) {
      alert("Face not detected.");
      return;
    }

    setBtnDisabled(true)

    let photo = canvasRef.current;

    const data = photo.toDataURL("image/jpeg");


    setImageUri(data);
    window.localStorage.setItem("imageUri", data);
    let image = window.localStorage.getItem('imageUri');
    // Validation function 
    validationFunction(image)
  };

  const validationFunction = (image) => {
    console.log("Validation Called");
    let file = dataURLtoFile(image, "Temp.png")
    let validationFormData = new FormData();
    validationFormData.append("recfile", file);
    let requestOptions = {
      method: 'POST',
      body: validationFormData,
      redirect: 'follow'
    };
    fetch("https://polar-cove-18785.herokuapp.com/retrieve/upload", requestOptions).then(response => response.json())
      .then(result => {
        console.log(result);
        if (result === null) {
          stopVideo()
          navigate("/retrieve")

        } else {
          alert("This person is already registered")
          setBtnDisabled(false)
        }
      })
      .catch(error => console.log('error', error));
      getVideo();
  }




  const retrieveImage = () => {
    if (isWebcamDisabled) {
      alert("Unable to capture WebCam.");
      return;
    }
    if (!faceDetectionRef.current) {
      alert("Face not detected.");
      return;
    }
    let photo = canvasRef.current;
    const data = photo.toDataURL("image/jpeg");
    stopVideo()
    setImageUri(data);
    window.localStorage.setItem("imageUri", data);
    navigate("/retrieve");
  };

  return (
    <>
      <Container className="" style={{ marginTop: '50px' }}>
        <Row>
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <h1 className="heading">Data Retriever</h1>
            <p>Retrieve your data today</p>

            <div className="nav">
              {
                 ! btnDisabled ?
                  <div>
                    <button className="btn btn-success" disabled={btnDisabled} onClick={() => captureImage()}>
                      Capture
                    </button>
                    <button className="btn btn-light" disabled={btnDisabled} onClick={() => retrieveImage()}>
                      Retrieve
                    </button>
                  </div>
                  :
                  <div>Loading</div>
              }


            </div>
          </Col>
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex justify-content-center roundedImageBorder"
              style={{ position: 'relative' }}>
              <video
                className="app__videoFeed rounded-circle position-absolute"
                ref={videoRef}
                onCanPlay={() => paintToCanvas()}
                style={{ top: 10 }}>

              </video>
            </div>
          </Col>
        </Row>
        <div>
          <canvas
            className="rounded-circle position-absolute"
            ref={canvasRef}
            style={{
              position: 'relative',
              display: 'none'
            }}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
          />
          {imageUri ? <img src={imageUri} style={{ display: 'none' }} alt="" /> : null}
        </div>
      </Container>
    </>
  );
};

export default Home;
