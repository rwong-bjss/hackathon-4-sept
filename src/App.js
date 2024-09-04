import './App.css';
import {QuizApp} from "./QuizApp/QuizApp";

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#333', textAlign: 'center', margin: '0 0 20px', fontSize: '24px' }}>Quiz App</h1>
      <div className="quiz-container">
        <QuizApp />
      </div>
    </div>
  );
}

export default App;
