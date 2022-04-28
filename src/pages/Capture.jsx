
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Container } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import * as axios from 'axios'
const Capture = () => {

  var axios = require('axios');
  var FormData = require('form-data');

  const fistNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const genderRef = useRef(null);

  const [validation,setValidation]=useState(false);


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

  
  const uploadData = () => {
    if(fistNameRef.current.value.length===0||lastNameRef.current.value.length===0||genderRef.current.value.length===0){
      alert("All Feild Must Contain Data");


      return;
    }

    let file = dataURLtoFile(imageUri, `${lastNameRef.current.value}-${fistNameRef.current.value}.jpeg`);
    var data = new FormData();
    data.append('recfile', file);
    data.append('first_name',fistNameRef.current.value);
    data.append('last_name',lastNameRef.current.value );
    data.append('gender', genderRef.current.value );
    var requestOptions = {
      method: 'POST',
      body: data,
      redirect: 'follow'
    };
    
    fetch("https://polar-cove-18785.herokuapp.com/file/upload", requestOptions)
      .then(response => response.json())
      .then(result =>{
        console.log(result)
        navigate("/");
      })
      .catch(error => console.log('error', error));
  }

  const navigate = useNavigate();
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const image = window.localStorage.getItem('imageUri');
    if (image) {
      setImageUri(image);
    }
    if (!image) {
      navigate("/");
    }
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
              <form>
                <Form.Control ref={fistNameRef} className='mb-3' type="text" placeholder="First Name" name="first_name" />
                <Form.Control ref={lastNameRef} className='mb-3' type="text" placeholder="Last Name" name="last_name" />
                <Form.Control ref={genderRef} className='mb-3' type="text" placeholder="Gender" name="gender" />
                <Button onClick={uploadData} className='btn btn-success'>Capture</Button>
              </form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  )
};


export default Capture;