import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const questions = [
    'What is React?',
    'What is JSX?',
    'What is a component in React?'
];
const Demo = () => {
    // ---------------- AI INTERVIEW CODE [OPEN] -------------------------
    const [questionIndex, setQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [timer, setTimer] = useState(10);
    const [feedback, setFeedback] = useState('');
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [loading, setLoading] = useState(false); // State to track loading status
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

    useEffect(() => {
        // Automatically call handleFinish when all questions have been answered
        if (questionIndex === questions.length) {
            handleFinish();
        }
    }, [questionIndex]);

    const handleFinish = async () => {
        setLoading(true); // Start loading
        // Ensure all answers are stored before making the API call
        const allAnswers = [...answers, { question: questions[questionIndex - 1], answer: userAnswer }];
        setAnswers(allAnswers);

        // Construct the prompt for the Gemini API
        const prompt = allAnswers.map(({ question, answer }) => `Question: ${question}, Answer: ${answer}`).join(', ');
        console.log(`Prompt for Gemini API: ${prompt}`);

        try {
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

            // Store the feedback from the API response
            setFeedback(response.data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Stop loading
        }
    };


    // ---------------- AI INTERVIEW CODE [CLOSE] -------------------------
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
        <>
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '100vh', backgroundColor: 'blue', background: `
      repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(242, 242, 242, 0.3) 50px, rgba(242, 242, 242, 0.3) 51px),
      repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(242, 242, 242, 0.3) 50px, rgba(242, 242, 242, 0.3) 51px),
      #5813EA`,
            }}>
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
                        <div className="text-overlay" style={{ position: 'absolute', top: '87%', left: '50%', transform: 'translate(-50%, -50%)', color: 'yellow', fontSize: '20px', fontWeight: 800, textShadow: '1px 1px 1px rgba(14,1,0,1)', border: '2px solid white', padding: '5px', backgroundColor: '#000', borderRadius: '10px', paddingInline: '20px' }}>
                            <span style={{ color: 'yellow' }}>Don't take stress! </span>
                            <span style={{ color: 'red' }}>Be Relax!! 😌</span>
                        </div>
                        <div className="top-div" style={{ backgroundColor: '#0a1626', width: '100%', textAlign: 'center', color: 'white', padding: '10px 0', position: 'absolute', top: 50, left: 0, transform: 'translate(-0%, -0%)', display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'yellow', fontSize: '20px', fontWeight: 500, }}>AI INTERVIEW </span>
                            <div style={{ width: '25%', backgroundColor: 'grey', height: '1px', alignSelf: 'center', margin: '10px' }}></div>
                            <div>
                                {/* // ------------ Question Span ------------------ */}
                                {/* <span style={{ color: 'white', fontSize: '30px', fontWeight: 500, textShadow: '1px 1px 1px rgba(14,1,0,1)', }}>Q) What is use of usestate in React? </span> */}
                            </div>
                            {/* AI INTWERVIEW */}
                            {questionIndex < questions.length ? (
                                <>

                                    <span style={{ color: 'white', fontSize: '30px', fontWeight: 500, textShadow: '1px 1px 1px rgba(14,1,0,1)', }}>{questions[questionIndex]}</span>
                                    <p>{transcript}</p>
                                    <p>Time left: {timer}</p>
                                </>
                            ) : (
                                <p>Interview completed!</p>
                            )}
                            {/* <button onClick={() => setQuestionIndex(0)}>Start Interview</button> */}
                            {questionIndex === questions.length && (
                                <button onClick={handleFinish}>Finish Interview</button>
                            )}
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                feedback && <p>Feedback: {feedback}</p>
                            )}
                            {/* AI INTERVIEW CLOSED */}
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
};

export default Demo
