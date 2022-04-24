import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Capture from "./pages/Capture";
import Retrieve from "./pages/Retrieve";
import NotFound from "./pages/NotFound";
import FaceUINavbar from "./Navbar";


function App() {
  React.useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.removeItem('imageUri');
    }
    return () => {
    }
  }, [])
  
  return (
    <>
      <FaceUINavbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/retrieve" element={<Retrieve />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
