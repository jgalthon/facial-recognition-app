import React from 'react'
import background from './pages/images/generic-background.jpg';
import { Container, Navbar, Nav } from 'react-bootstrap';

const FaceUINavbar = () => {
  return (
    <>
  <Navbar className="homeNav" variant="dark" style={{backgroundImage: `url(${background})`}}>
    <Container>
    {/* <Navbar.Brand href="#home">😁</Navbar.Brand> */}
        <Nav className="me-auto">
        <Nav.Link className='homeLink' href="/">Home</Nav.Link>
        
        </Nav>
    </Container>
  </Navbar>

</>
  )
}

export default FaceUINavbar