
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const Capture = () => {
  const navigate = useNavigate();
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const image = window.localStorage.getItem('imageUri');

    if(image) {
      setImageUri(image);

    } 
    if(!image)
    {
      navigate("/");
    }
  }, [])


  return (
    <div className='background mt-5'>
      <Container className='cardContainer'>
        <div className="card-no-border">
          <Card style={{ width: '18rem' }}>
            <div className='mt-3'>
              {imageUri ? <Card.Img className='rounded' variant="top" src={imageUri} /> : null}
            </div>
            <Card.Body>
              <Form.Control className='mb-3' type="text" placeholder="First Name" />
              <Form.Control className='mb-3' type="text" placeholder="Last Name" />
              <Form.Control className='mb-3' type="text" placeholder="Gender" />
              <Button className='btn btn-success'>Capture</Button>
            </Card.Body>
          </Card>
        </div>
      </Container>     
    </div>   
  )
};


export default Capture;