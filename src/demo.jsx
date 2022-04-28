import { useEffect, useRef, useState } from "react"
import * as faceapi from "face-api.js";
const canvas = require('canvas');




const Demo=()=>{
    const imgRef=useRef();
    const [arrayOfPerson,setArrayOfPerson]=useState([]);

    
    const useFaceApi=async()=>{
      let data= await canvas.loadImage("https://polar-cove-18785.herokuapp.com/file/1651020280228-any-name-Channing-Tatum.jpg");
      console.log(data);
      let img= await faceapi.bufferToImage(data);
      console.log(img);
      const detections = await faceapi.detectAllFaces(
        img.src,
        new faceapi.TinyFaceDetectorOptions()
      );
      
      console.log(detections);
    }


  
    // Call to the api
    const getAllPersons=()=>{
        let requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        fetch("https://polar-cove-18785.herokuapp.com/person", requestOptions).then(response=>response.json()).then(result=>{
          setArrayOfPerson(result)
        })
        .catch(error => console.log('error', error));
    }

    useEffect(()=>{
        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]).then(useFaceApi)

    },[])
    return(
        <img crossOrigin="anonymous" ref={imgRef} src="https://polar-cove-18785.herokuapp.com/file/1651020280228-any-name-Channing-Tatum.jpg"/>
    )
}

export default  Demo;