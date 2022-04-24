import image from './images/WIN_20220414_13_05_14_Pro.jpg'
import { Card, Container } from 'react-bootstrap';

const Retrieve = () => {
  return (
    <div className='background mt-5'>
      <Container className='cardContainer'>
        <div className="card-no-border">
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Img variant="top mb-3" src={image} />
              <Card.Text className='text'>First Name: Joel</Card.Text>
              <Card.Text className='text'>Last Name: Green</Card.Text>
              <Card.Text className='text'>Gender: Male</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Container>
      
    </div>
  )
};

export default Retrieve;