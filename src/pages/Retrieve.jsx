// import { Link } from 'react-router-dom';
import background from './images/generic-background.jpg';
import image from './images/WIN_20220414_13_05_14_Pro.jpg'
import { Card } from 'react-bootstrap';

const Retrieve = () => {
  return (
    <div className='background' style={{backgroundImage: `url(${background})`}}>
      <div>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src={image} />
          <Card.Body>
            <Card.Text className='text'>Joel Green</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
};

export default Retrieve;