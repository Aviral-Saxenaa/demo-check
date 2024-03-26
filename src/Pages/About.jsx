import React, { useState, useEffect,useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const About = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening
  } = useSpeechRecognition();
  

  
  const [listeningTimeout, setListeningTimeout] = useState(null);

  useEffect(() => {
    if (!browserSupportsContinuousListening) {
      return;
    }

    if (listening) {
      const timeout = setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 10000); // Stop listening after 30 seconds
      setListeningTimeout(timeout);
    } else {
      clearTimeout(listeningTimeout);
    }

    // Clean up timeout on component unmount
    return () => clearTimeout(listeningTimeout);
  }, [listening, browserSupportsContinuousListening]);

  const startListening = () => {
    if (browserSupportsContinuousListening) {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(error => console.error(error));
  }, []);
  
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={startListening}>Start</button>
      <button onClick={stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>

      <div>
      <video ref={videoRef} width={400} height={300} muted autoPlay />
    </div>
    </div>
  );
};

export default About;
