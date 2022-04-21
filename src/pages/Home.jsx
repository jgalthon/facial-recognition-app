import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { FaCircle, FaTimes } from "react-icons/fa";
import { Col, Container, Row, Image } from "react-bootstrap";

import pic from "./images/huston-wilson-WyDr1KFS23Y-unsplash.jpg";

const Home = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const colorRef = useRef(null);

  const [imageUri, setImageUri] = useState(null);
  const [hasValidImage, setHasValidImage] = useState(false);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 200, height: 200 },
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const paintToCanvas = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");

    const width = 200;
    const height = 200;
    photo.width = width;
    photo.height = height;

    return setInterval(() => {
      let color = colorRef.current;

      ctx.drawImage(video, 0, 0, width, height);
      let pixels = ctx.getImageData(0, 0, width, height);
    }, 200);
  };

  const captureImage = () => {
    let photo = photoRef.current;

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

  useEffect(() => {
    getVideo();
  }, [videoRef]);

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
            <div className="d-flex justify-content-center overflow-auto roundedImageBorder">
                <video
                      className="rounded-circle"
                      ref={videoRef}
                      onCanPlay={() => paintToCanvas()}
                    ></video>
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
            ref={photoRef}
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
