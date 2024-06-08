import React, { useState, useEffect } from 'react';
import questionsData from './data.json'; // Adjust the path if necessary
import './ImageQuestion.css'; // Create this CSS file for styling

const ImageQuestion = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questions, setQuestions] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [audioFinished, setAudioFinished] = useState(false);

  useEffect(() => {
    // Load questions data
    setQuestions(questionsData);

    // Play the question audio using Web Speech API
    if (gameStarted && questionsData[currentQuestion]) {
      const utterance = new SpeechSynthesisUtterance(questionsData[currentQuestion].question);
      utterance.onend = () => {
        setAudioFinished(true);
      };
      setAudioFinished(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [currentQuestion, gameStarted]);

  const handleImageClick = (image) => {
    if (!audioFinished) return; // Prevent clicks if audio is not finished

    if (image === questions[currentQuestion].answer) {
      if (currentQuestion < Object.keys(questions).length) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setGameOver(true);
        setGameStarted(false);
      }
    } else {
      alert('Try again!');
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setCurrentQuestion(1);
  };

  if (!gameStarted) {
    return (
      <div className="start-screen">
        <h1>Start Letters</h1>
        <button onClick={startGame} className="start-button">Play</button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="end-screen">
        <h2>Game Over</h2>
        <button onClick={startGame} className="start-button">Play Again</button>
      </div>
    );
  }

  return (
    <div className="question-container">
      <h2>{questions[currentQuestion].question}</h2>
      <div className="images-container">
        {questions[currentQuestion].images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Option ${index + 1}`}
            onClick={() => handleImageClick(image)}
            className={`image-option ${audioFinished ? '' : 'disabled'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageQuestion;
