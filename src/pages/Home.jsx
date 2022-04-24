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
  // const photoRef = useRef(null);

  const [imageUri, setImageUri] = useState(null);
  const [isWebcamDisabled, setIsWebcamDisabled] = useState(false);
  


  const handleVideoOnPlay = useCallback(() => {
    const video = videoRef.current;
    const canvas= faceapi.createCanvasFromMedia(video);
    const displaySize = {
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT
    };

    canvas.classList.add('position-absolute');
    video.insertAdjacentElement('afterend', canvas);
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      console.log(detections);
    }, 5000)
  },[])





  const getVideo = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT},
      })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play()?.then(_=>{
          handleVideoOnPlay();
        })?.catch(error=> {
          alert(error)
        })
      })
      .catch((error) => {
        alert("Unable to capture WebCam.");
        setIsWebcamDisabled(true)
      });
      
  },[handleVideoOnPlay]);





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




  // console.log(videoRef.current);

   


  const paintToCanvas = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    return setInterval( () => {
      canvas.getContext("2d").drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    }, 200);
  };




  const captureImage = () => {
    if(isWebcamDisabled)
    {
      alert("Unable to capture WebCam.")
    return;  
    }

    let photo = canvasRef.current;

    const data = photo.toDataURL("image/jpeg");
    setImageUri(data);
    window.localStorage.setItem("imageUri", data);
    navigate("/capture");
  };




  const navigateToRetrieve = () => {
    isWebcamDisabled? alert("Unable to capture WebCam.") : navigate("/retrieve");
  };




  return (
    <>
      <Container className="" style={{marginTop: '50px'}}>
        <Row>
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <h1 className="heading">Data Retriever</h1>
            <p>Retrieve your data today</p>

            <div className="nav">
              <button className="btn btn-success" disabled={imageUri? true: false} onClick={captureImage}>
                Capture
              </button>
              <button className="btn btn-light" disabled={imageUri? true: false} onClick={navigateToRetrieve}>
                Retrieve
              </button>
            </div>
          </Col>
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex justify-content-center roundedImageBorder" 
            style={{position: 'relative'}}>
                <video
                  className="rounded-circle position-absolute"
                  ref={videoRef}
                  onCanPlay={() => paintToCanvas()}
                  style={{ top: 10 }}

                ></video>
            </div>
          </Col>
        </Row>
        <div>
          <canvas
                  className="rounded-circle position-absolute"
                  ref={canvasRef}
                  style={{ display: 'none' }}
                  width={VIDEO_WIDTH}
                  height={VIDEO_HEIGHT}
                />
          {imageUri ? <img src={imageUri} alt="" /> : null}
        </div>
      </Container>
    </>
  );
};

export default Home;
