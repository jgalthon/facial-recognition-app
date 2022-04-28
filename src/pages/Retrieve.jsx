import { useNavigate } from "react-router-dom";
import { Card, Container } from 'react-bootstrap';
import * as faceapi from "face-api.js";
import { useEffect, useState } from 'react';

const Retrieve = () => {

 
  const navigate = useNavigate();
  const [imageUri, setImageUri] = useState(null);
  const [lastName,setLastName]=useState("loading");
  const [firstName,setFirstName]=useState("loading");
  const [gender,setGender]=useState("loading")

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

  useEffect(() => {
    const image = window.localStorage.getItem('imageUri');
    if (image) {
      setImageUri(image);
    }
    if (!image) {
      navigate("/");
    }
    // Load Face Api
    let file=dataURLtoFile(image,"Temp.png")
    let formdata = new FormData();
    formdata.append("recfile", file);

    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://polar-cove-18785.herokuapp.com/retrieve/upload", requestOptions).then(response => response.json())
      .then(result =>{
        if(result!=null){
          setFirstName(result.result.matched.first_name)
          setLastName(result.result.matched.last_name)
          setGender(result.result.matched.gender)
        } 
        else{
          setFirstName("Not Found")
          setLastName("Not Found")
          setGender("Not Found")
        }
         
      })
      .catch(error => console.log('error', error));
  }, [])

  return (
    <div className='background mt-5'>
      <Container className='cardContainer'>
        <div className="card-no-border">
          <Card style={{ width: '18rem' }}>
            <div className='mt-3'>
              {imageUri ? <Card.Img className='rounded' variant="top" type="file" src={imageUri} /> : null}
            </div>
            <Card.Body>
              {/* <Card.Text> */}
                <div className="row d-flex justify-content-center">
                  <div className="col-6">
                    LastName:
                  </div>
                  <div className="col-6">
                    {lastName} 
                  </div>
                  <div className="col-6">
                    FirstName:
                  </div>
                  <div className="col-6">
                    {firstName}
                  </div>
                  <div className="col-6">
                  Gender:
                  </div>
                  <div className="col-6">
                    {gender}
                  </div>
                </div>
              {/* </Card.Text> */}
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  )
};

export default Retrieve;