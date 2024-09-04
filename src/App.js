import React, { useState } from 'react';
import './App.css';
import { QuizApp } from "./QuizApp/QuizApp";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialScore, setInitialScore] = useState(0);
  const [initialQuestionId, setInitialQuestionId] = useState(0);

  const handleStartQuiz = () => {
    setIsLoading(true);
    fetch('http://10.255.249.200:5000/startquiz')
      .then(response => response.json())
      .then(data => {
        setSessionId(data.session_id);
        setInitialScore(data.score);
        setInitialQuestionId(data.question_id);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching session ID:', error);
        setIsLoading(false);
      });
  };

  return (
    <div className="App" style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#333', textAlign: 'center', margin: '0 0 20px', fontSize: '24px' }}>Quiz App</h1>
      {sessionId && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '12px', color: '#666' }}>
          Session ID: {sessionId}
        </div>
      )}
      <div className="quiz-container">
        {!sessionId && !isLoading && (
          <div className="landing-page">
            <h2>Welcome to the Quiz!</h2>
            <p>Click the button below to start your quiz.</p>
            <button onClick={handleStartQuiz} className="start-quiz-btn">Start Quiz</button>
          </div>
        )}
        {isLoading && <div>Loading...</div>}
        {sessionId && (
          <QuizApp 
            sessionId={sessionId} 
            initialQuestionId={initialQuestionId} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
