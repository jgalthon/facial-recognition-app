import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState, useCallback } from "react";
// import { FaCircle, FaTimes } from "react-icons/fa";
import { Col, Container, Row /*, Image */} from "react-bootstrap";
import * as faceapi from "face-api.js";
// import pic from "./images/huston-wilson-WyDr1KFS23Y-unsplash.jpg";

const Home = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const videoHeight = 200;
  const videoWidth = 200;
  const canvasRef = useRef(null);
  const photoRef = useRef(null);
  // const colorRef = useRef(null);

  const [imageUri, setImageUri] = useState(null);
  // const [hasValidImage, setHasValidImage] = useState(false);
  


  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 200, height: 200},
      })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        const playPromise = video.play()
        if (playPromise !== undefined) {
            playPromise.then(_ => {})
          }
          handleVideoOnPlay();
      })
      .catch((err) => {
        console.error(err);
      });
      
  };

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
  }, []);

  const handleVideoOnPlay = () => {
    let video = videoRef.current;
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        const displaySize = {
            width: videoWidth,
            height: videoHeight
        }

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi.detectAllFaces(videoRef.current,
          new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        // console.log(detections);
        canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        // canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        // canvasRef && canvasRef.current && faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
        // console.log(detections);
      }
    }, 200)
  }
   

  // const handleVideoOnPlay = () => {
  //   let video = videoRef.current;
  //   // let canvas = canvasRef.current;
  //   setInterval( async () => {
  //     canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
  //     const displaySize = {
  //       width: video.width,
  //       height: video.height
  //     }
  //     faceapi.matchDimensions(canvasRef.current, displaySize);
  //     const detection = await faceapi.detectAllFaces(
  //       videoRef.current,
  //       new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
  //     canvasRef.current.getContext('2d').clearRect(0, 0, video.width, video.height);
  //     faceapi.draw.drawFaceLandmarks(canvasRef.current, detection)
  //   }, 200)
  // }

  const paintToCanvas = () => {
    let video = videoRef.current;
    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    const width = 200;
    const height = 200;
    canvas.width = width;
    canvas.height = height;
    // video.width = width;
    // video.height = height;

    return setInterval( () => {
      // let color = colorRef.current;

      ctx.drawImage(video, 0, 0, width, height);
      // let pixels = ctx.getImageData(0, 0, width, height);
    }, 200);
  };

  const captureImage = () => {
    let photo = canvasRef.current;

    const data = photo.toDataURL("image/jpeg");
    setImageUri(data);
    window.localStorage.setItem("imageUri", data);
    navigate("/capture");
  };

  // function usePhotoGallery () {
  //      const photo = captureImage.data;

  //      return {
  //          photo,
  //      };
  // }

  const navigateToRetrieve = () => {
    navigate("/retrieve");
  };

  // useEffect(() => {
  //   getVideo();
  // }, [videoRef]);


  return (
    <>
    
      <Container className="" style={{
          marginTop: '50px'
      }}>
        <Row>
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <h1 className="heading">Data Retriever</h1>
            <p>Retrieve your data today</p>

            <div className="nav">
              <button className="btn btn-success" onClick={captureImage}>
                Capture
              </button>
              <button className="btn btn-light" onClick={navigateToRetrieve}>
                Retrieve
              </button>
            </div>
          </Col>
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex justify-content-center roundedImageBorder">
            {/* <div className="d-flex justify-content-center overflow-auto roundedImageBorder"> */}
                <video
                  className="rounded-circle"
                  ref={videoRef}
                  onCanPlay={() => paintToCanvas()}
                  //onPlay = {handleVideoOnPlay()}
                ></video>
                <canvas
                  className="rounded-circle position-absolute translate middle"
                  ref={canvasRef}
                  // style={{ display: "none" }}
                  width={videoWidth}
                  height={videoHeight}
                ></canvas>
              {/* <Image className="roundedImage" roundedCircle src={pic} alt="description"/> */}
            </div>
          </Col>
        </Row>

        {/* <Row >
            <Col className="d-flex flex-column justify-content-center align-items-center">
                <div className="video">
                  <div className="camera">
                    <video
                      className="rounded-circle"
                      ref={videoRef}
                      onCanPlay={() => paintToCanvas()}
                    ></video>
                  </div>
                  <Row>
                      <Col className="d-flex flex-column justify-content-center align-items-center">
                        {hasValidImage ?<FaCircle color="#24F103" /> : <FaTimes color="red" />}
                      </Col>
                  </Row>
                </div>
            </Col>
        </Row> */}

        <div>
          <canvas
            // ref={canvasRef}
            className="photo"
            style={{ display: "none" }}
          />
          {imageUri ? <img src={imageUri} alt="" /> : null}
          {/* <div className="photo-booth">
                    <div ref={stripRef} className="strip" />
                    </div>       */}
        </div>
      </Container>
    </>
  );
};

export default Home;
