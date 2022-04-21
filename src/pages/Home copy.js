import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { FaCircle, FaTimes } from 'react-icons/fa';
import pic from './images/huston-wilson-WyDr1KFS23Y-unsplash.jpg';

const Home = () => {

    const videoRef = useRef(null);
    const photoRef = useRef(null);
  const stripRef = useRef(null);
  const colorRef = useRef(null);

    const getVideo = () => {
        navigator.mediaDevices
        .getUserMedia({
            video: {width: 100, height: 100}
        }).then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error(err);
        })
    }

    const paintToCanvas = () => {
        let video = videoRef.current;
        let photo = photoRef.current;
        let ctx = photo.getContext("2d");
    
        const width = 320;
        const height = 240;
        photo.width = width;
        photo.height = height;
    
        return setInterval(() => {
          let color = colorRef.current;
    
          ctx.drawImage(video, 0, 0, width, height);
          let pixels = ctx.getImageData(0, 0, width, height);
    
          color.style.backgroundColor = `rgb(${pixels.data[0]},${pixels.data[1]},${
            pixels.data[2]
          })`;
          color.style.borderColor = `rgb(${pixels.data[0]},${pixels.data[1]},${
            pixels.data[2]
          })`;
        }, 200);
      };

    const captureImage =() => { 
        let photo = photoRef.current;
    let strip = stripRef.current;
        
    const data = photo.toDataURL("image/jpeg");

    console.warn(data);
    const link = document.createElement("a");
    link.href = data;
    link.setAttribute("download", "myWebcam");
    link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
    strip.insertBefore(link, strip.firstChild);
     }

    useEffect(() => {
        getVideo();
    }, [videoRef]);

  return (
    <>
        <div className="container">
            <div className='row'>
                <h1 className='heading'>
                    Data Retriever
                </h1>
                <p>
                    Retrieve your data today
                </p>
                <div className="nav">
                        {/* <Link className='btn btn-success' to="/capture">
                            Capture
                        </Link> */}
                        <button className='btn btn-success' onClick={captureImage}>Capture</button>
                        <Link className='btn btn-light' to="/retrieve">
                            Retrieve
                        </Link>
                </div>
            </div>

            <div className='video'>
                <div className='camera'>
                    <video className='rounded-circle' ref={videoRef} onCanPlay={() => paintToCanvas()}></video>
                </div>
                <FaCircle color='#24F103'/>
                <FaTimes color='red'/>

            </div>
            <div>
        <canvas ref={photoRef} className="photo" />
        <div className="photo-booth">
          <div ref={stripRef} className="strip" />
        </div>      
            </div>


            {/* <div>
                <img src={pic} width="30%" height="20%" alt="description"/>
            </div> */}
        </div>
    </>
  )
};

export default Home;