import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const questions = [
 'What is React?',
 'What is JSX?',
 'What is a component in React?'
];

const Interview = () => {
 const [questionIndex, setQuestionIndex] = useState(0);
 const [userAnswer, setUserAnswer] = useState('');
 const [answers, setAnswers] = useState([]);
 const [isListening, setIsListening] = useState(false);
 const [timer, setTimer] = useState(10);

 const { transcript, resetTranscript } = useSpeechRecognition();

 useEffect(() => {
    // This effect runs once after the initial render
    setQuestionIndex(0);
 }, []); // Empty dependency array ensures this effect runs only once

 useEffect(() => {
    if (questionIndex < questions.length) {
      setIsListening(true);
      SpeechRecognition.startListening({ continuous: false });
      const countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
 }, [questionIndex]);

 useEffect(() => {
    if (timer === 0) {
      setIsListening(false);
      SpeechRecognition.stopListening();
      setUserAnswer(transcript);
      resetTranscript();
      setQuestionIndex(questionIndex + 1);
      setTimer(10);
      // Store the answer immediately after capturing it
      if (questionIndex < questions.length) {
        setAnswers(prevAnswers => [...prevAnswers, { question: questions[questionIndex - 1], answer: userAnswer }]);
      }
    }
 }, [timer]);

 const handleFinish = async () => {
    // Ensure all answers are stored before making the API call
    const allAnswers = [...answers, { question: questions[questionIndex - 1], answer: userAnswer }];
    setAnswers(allAnswers);

    // Construct the prompt for the Gemini API
    const prompt = allAnswers.map(({ question, answer }) => `Question: ${question}, Answer: ${answer}`).join(', ');
    console.log(`Prompt for Gemini API: ${prompt}`);

    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyC4L594j7cxkZW7nZA3JfVFKvc1eOQ1lvs",
      method: "post",
      data: {
        contents: [{
          parts: [{
            text: `Please rate the following interview: ${prompt}`
          }]
        }]
      },
    });
    console.log(response.data);
 };

 return (
    <div>
      {questionIndex < questions.length ? (
        <>
          <h2>{questions[questionIndex]}</h2>
          <p>{transcript}</p>
          <p>Time left: {timer}</p>
        </>
      ) : (
        <p>Interview completed!</p>
      )}
      <button onClick={() => setQuestionIndex(0)}>Start Interview</button>
      {questionIndex === questions.length && (
        <button onClick={handleFinish}>Finish Interview</button>
      )}
    </div>
 );
};

export default Interview;
