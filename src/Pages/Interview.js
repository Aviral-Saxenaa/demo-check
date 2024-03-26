import React, { useState, useEffect, useRef } from 'react';

const CameraStream = () => {
 const videoRef = useRef(null);
 const isMountedRef = useRef(false);

 useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
 }, []);

 useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (isMountedRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error(error);
        alert('Error accessing the camera. Please check your browser permissions and try again.');
      }
    };

    getCameraStream();
 }, []);

 return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '100vh', backgroundColor: 'blue', background: `
      repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(242, 242, 242, 0.3) 50px, rgba(242, 242, 242, 0.3) 51px),
      repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(242, 242, 242, 0.3) 50px, rgba(242, 242, 242, 0.3) 51px),
      #5813EA`, }}>
      <div style={{ position: 'relative', width: '900px', height: '800px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <div className="video-container" style={{ position: 'relative', width: '1000px', height: '100%', overflow: 'hidden', }}>
          <video
            ref={videoRef}
            width={900} // Adjust width/height as needed
            height={800} // Adjust width/height as needed
            muted
            autoPlay
            style={{
              borderRadius: '5%', // Make the video circular
              objectFit: 'cover', // Ensure video fills the container
              position: 'absolute',
              top: 50,
              left: 0,
              transform: 'translate(0%, 0%)',
              borderColor: 'yellow', borderWidth: '5px'
            }}
          />
          <div className="text-overlay" style={{ position: 'absolute', top: '87%', left: '50%', transform: 'translate(-50%, -50%)', color: 'yellow', fontSize: '20px', fontWeight: 800, textShadow: '1px 1px 1px rgba(14,1,0,1)', border: '2px solid white', padding: '5px',backgroundColor:'#000',borderRadius:'10px',paddingInline:'20px' }}>
  <span style={{ color: 'yellow' }}>Don't take stress! </span>
  <span style={{ color: 'red' }}>Be Relax</span>
</div>
          <div className="top-div" style={{ backgroundColor: '#0a1626', width: '100%', textAlign: 'center', color: 'white', padding: '10px 0', position: 'absolute', top:50, left: 0, transform: 'translate(-0%, -0%)', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'yellow', fontSize: '20px', fontWeight: 500, }}>AI INTERVIEW </span>
          <div style={{width:'25%',backgroundColor:'grey',height: '1px',alignSelf:'center',margin:'10px'}}></div>
           <div>
            // ------------ Question Span ------------------
           <span style={{ color: 'white', fontSize: '30px', fontWeight: 500, textShadow: '1px 1px 1px rgba(14,1,0,1)', }}>Q) What is use of usestate in React? </span>
           </div>
          </div>
        </div>
      </div>
    </div>
 );
};

export default CameraStream;
