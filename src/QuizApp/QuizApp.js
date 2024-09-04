import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

export function QuizApp() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [answerState, setAnswerState] = useState(null);

    useEffect(() => {
        // In a real app, you'd fetch these from an API
        const fetchedQuestions = [
            {
                question: "In the song \u201cThe Ultimate Showdown of Ultimate Destiny\u201d who is the only one to survive the battle?",
                options: ["2004", "2005", "2006", "2007"],
                correctAnswer: "2006"
            },
            {
                question: "The \“To Love-Ru\” Manga was started in what year?",
                options: ["2004", "2005", "2006", "2007"],
                correctAnswer: "2006"
            },
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctAnswer: "Paris"
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Mars", "Venus", "Jupiter", "Saturn"],
                correctAnswer: "Mars"
            },
            // Add 8 more questions here to make it 10 in total
        ];
        setQuestions(fetchedQuestions);
    }, []);

    const handleAnswerClick = (selectedAnswer) => {
        setSelectedAnswer(selectedAnswer);
        const correct = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);
        setAnswerState('answered');

        setTimeout(() => {
            if (correct) {
                setScore(score + 1);
            }

            const nextQuestion = currentQuestionIndex + 1;
            if (nextQuestion < questions.length) {
                setCurrentQuestionIndex(nextQuestion);
                setSelectedAnswer(null);
                setIsCorrect(false);
                setAnswerState(null);
            } else {
                setShowScore(true);
            }
        }, 2000); // Keep the 2-second delay
    };

    return (
        <div className="quiz-container">
            {showScore ? (
                <div className="score-section">
                    You scored {score} out of {questions.length}
                </div>
            ) : (
                <>
                    <div className="question-section">
                        <div className="question-count">
                            <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
                        </div>
                        <div className="question-text">{questions[currentQuestionIndex]?.question}</div>
                    </div>
                    <div className="answer-section">
                        {questions[currentQuestionIndex]?.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerClick(option)}
                                className={`
                                    ${selectedAnswer === option ? 'selected' : ''}
                                    ${answerState === 'answered' && option === questions[currentQuestionIndex].correctAnswer ? 'correct flash-green' : ''}
                                    ${answerState === 'answered' && selectedAnswer === option && !isCorrect ? 'incorrect flash-red' : ''}
                                `}
                                disabled={answerState !== null}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QuizApp />
    </React.StrictMode>
);

// Add this CSS to your styles.css file
/*
.quiz-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
}

.question-section {
    margin-bottom: 20px;
}

.question-count {
    margin-bottom: 10px;
}

.question-text {
    font-size: 18px;
    font-weight: bold;
}

.answer-section {
    display: flex;
    flex-direction: column;
}

button {
    margin: 5px 0;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background-color: #e0e0e0;
}

button.selected {
    background-color: #d4edda;
}

button.correct {
    background-color: #28a745;
    color: white;
}

button.flash-green {
    animation: flash-green 1s;
}

button.flash-red {
    animation: flash-red 1s;
}

@keyframes flash-green {
    0% {
        background-color: #28a745;
    }
    50% {
        background-color: #c6f4d6;
    }
    100% {
        background-color: #28a745;
    }
}

@keyframes flash-red {
    0% {
        background-color: #dc3545;
    }
    50% {
        background-color: #f8d7da;
    }
    100% {
        background-color: #dc3545;
    }
}
*/
