import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import ReactMarkdown from "react-markdown";

const GeminiInterview = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(languages.length).fill(''));
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [languageFeedback, setLanguageFeedback] = useState({});

  // Define language options and their respective question sets
  const languages = [
    { name: "React", questions: [
      { question: "What is the purpose of the useState hook in React?", answered: false, score: 0, feedback: '' },
      { question: "Explain the concept of props in React components.", answered: false, score: 0, feedback: '' },
      { question: "Describe the lifecycle methods of a React component.", answered: false, score: 0, feedback: '' }
    ]},
    { name: "Next.js", questions: [
      { question: "What is Next.js and what problem does it solve?", answered: false, score: 0, feedback: '' },
      { question: "How do you create dynamic routes in Next.js?", answered: false, score: 0, feedback: '' },
      { question: "Explain the advantages of server-side rendering in Next.js.", answered: false, score: 0, feedback: '' }
    ]},
    // Add more language options and their questions as needed
  ];

  useEffect(() => {
    if (isInterviewComplete) {
      generateOverallFeedback();
    }
  }, [isInterviewComplete]);

  const handleAnswer = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = transcript;
    setAnswers(updatedAnswers);
    resetTranscript();
    if (currentQuestionIndex < languages.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsInterviewComplete(true);
    }
  };

  async function generateOverallFeedback() {
    setGeneratingFeedback(true);
    try {
      const allAnswers = languages.map((language, index) => ({
        language: language.name,
        answers: language.questions.map((question, qIndex) => answers[index * languages[0].questions.length + qIndex])
      }));

      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY",
        method: "post",
        data: {
          contents: allAnswers.flatMap(language =>
            language.answers.map((answer, qIndex) => ({
              parts: [{
                text: `As a ${language.language} expert, how would you rate the following answer to the question: ${language.questions[qIndex].question}? Answer: ${answer}`
              }]
            }))
          )
        },
      });

      // Handle response to get score and feedback for each question
      const languageFeedback = {};
      languages.forEach((language, index) => {
        languageFeedback[language.name] = {};
        language.questions.forEach((question, qIndex) => {
          const score = parseInt(response.data.candidates[index * languages[0].questions.length + qIndex].content.parts[0].text.match(/(\d+)/)?.[1] || 0);
          const feedbackText = score >= 4 ? "Excellent answer!" : score >= 3 ? "Good answer!" : "Consider reviewing relevant concepts.";
          languageFeedback[language.name][question.question] = { score, feedback: feedbackText };
        });
      });
      setLanguageFeedback(languageFeedback);
    } catch (error) {
      console.error("Error generating feedback:", error);
    } finally {
      setGeneratingFeedback(false);
    }
  }

  function startInterview() {
    setCurrentQuestionIndex(0);
    resetTranscript(); // Reset transcript for the first question
    SpeechRecognition.startListening({ continuous: true });
  }

  return (
    <>
      <div className="bg-white h-screen p-3">
        <h1 className="text-3xl text-center">Interview</h1>
        {!isInterviewComplete && (
          <div className="mt-4">
            <button onClick={startInterview} disabled={listening}>
              Start Interview
            </button>
          </div>
        )}
        {currentQuestionIndex < languages.length && (
          <div className="mt-4">
            <h2>{languages[currentQuestionIndex].questions[currentQuestionIndex % languages[0].questions.length].question}</h2>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <p>{transcript}</p>
            <button onClick={handleAnswer} disabled={!listening}>
              Submit Answer
            </button>
            {generatingFeedback && <p>Generating feedback...</p>}
          </div>
        )}
        {isInterviewComplete && (
          <>
            <div className="mt-4 text-center">
              <h2>Interview Complete!</h2>
              <p>Your total score: {totalScore} out of {languages.length * languages[0].questions.length * 5}</p>
            </div>
            <div className="mt-4">
              <h2>Question Feedback</h2>
              {Object.entries(languageFeedback).map(([language, feedback]) => (
                <div key={language}>
                  <h3>{language}</h3>
                  <ul>
                    {Object.entries(feedback).map(([question, { score, feedback }]) => (
                      <li key={question}>
                        <b>{question}</b><br />
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GeminiInterview;
