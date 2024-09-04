import React, { useState, useEffect } from 'react';
import './styles.css';

// Utility function to decode HTML entities
function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

function UsernamePopup({ onSubmit }) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onSubmit(username.trim());
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Enter Your Username</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <button type="submit">Start Quiz</button>
                </form>
            </div>
        </div>
    );
}

export function QuizApp() {
    const [sessionId, setSessionId] = useState(null);
    const [username, setUsername] = useState(null);
    const [question, setQuestion] = useState(null);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerState, setAnswerState] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(1); // Start from 1
    const [apiCorrectAnswer, setApiCorrectAnswer] = useState(null);
    const [finalScore, setFinalScore] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [hasInitialQuestion, setHasInitialQuestion] = useState(false);

    const startQuiz = async (enteredUsername) => {
        try {
            const response = await fetch(`http://10.255.249.200:5000/startquiz?username=${encodeURIComponent(enteredUsername)}`);
            const data = await response.json();
            setSessionId(data.session_id);
            setUsername(enteredUsername);
        } catch (error) {
            console.error('Error starting quiz:', error);
        }
    };

    const fetchQuestion = async () => {
        if (!sessionId) return;

        try {
            const response = await fetch(`http://10.255.249.200:5000/question?session_id=${sessionId}`);
            const data = await response.json();
            if (data.score !== undefined && data.username !== undefined) {
                setShowScore(true);
                setFinalScore(data.score);
                setLeaderboard(data.leaderboard || []);
                setQuestion(null);
            } else {
                // Decode the question data
                const decodedData = {
                    ...data,
                    question: decodeHTMLEntities(data.question),
                    answers: data.answers.map(decodeHTMLEntities)
                };
                setQuestion(decodedData);
                setHasInitialQuestion(true);
            }
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    useEffect(() => {
        if (sessionId && username) {
            fetchQuestion();
        }
    }, [sessionId, username]);

    const handleAnswerClick = async (selectedAnswer) => {
        if (answerState !== null) return;

        setSelectedAnswer(selectedAnswer);
        setAnswerState('answered');

        try {
            const response = await fetch(`http://10.255.249.200:5000/answer?session_id=${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer: selectedAnswer }),
            });
            const data = await response.json();
            
            const decodedCorrectAnswer = decodeHTMLEntities(data.correct_answer);
            setApiCorrectAnswer(decodedCorrectAnswer);
            setAnswerState(data.correct ? 'correct' : 'incorrect');

            setTimeout(() => {
                setSelectedAnswer(null);
                setAnswerState(null);
                setApiCorrectAnswer(null);
                setQuestionNumber(prevNumber => prevNumber + 1);
                fetchQuestion(); // This will fetch the next question
            }, 2000);
        } catch (error) {
            console.error('Error submitting answer:', error);
            setAnswerState(null);
        }
    };

    if (!sessionId || !username) {
        return <UsernamePopup onSubmit={startQuiz} />;
    }

    if (showScore) {
        return (
            <div className="quiz-container">
                <div className="session-info">
                    <p>Session ID: {sessionId}</p>
                    <p>Username: {username}</p>
                </div>
                <div className="score-section">
                    {username}, you scored {finalScore} / 10
                </div>
                <div className="leaderboard-section">
                    <h2>Leaderboard</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map(([user, score], index) => (
                                <tr key={index} className={user === username ? 'current-user' : ''}>
                                    <td>{index + 1}</td>
                                    <td>{user}</td>
                                    <td>{score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (!question) return <div>Loading...</div>;

    return (
        <div className="quiz-container">
            <div className="session-info">
                <p>Session ID: {sessionId}</p>
                <p>Username: {username}</p>
            </div>
            <div className="question-section">
                <div className="question-count">
                    <span>Question {questionNumber}</span>/10
                </div>
                <div className="question-text">{question.question}</div>
            </div>
            <div className="answer-section">
                {question.answers.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerClick(option)}
                        className={`
                            ${selectedAnswer === option ? 'selected' : ''}
                            ${answerState !== null && option === apiCorrectAnswer ? 'correct flash-green' : ''}
                            ${answerState === 'incorrect' && selectedAnswer === option ? 'incorrect flash-red' : ''}
                        `}
                        disabled={answerState !== null}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <React.StrictMode>
//         <QuizApp />
//     </React.StrictMode>
// );
