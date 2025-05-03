import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import "./GameComplete.css";

function GameComplete() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer); // Cleanup
  }, []);

  if (!state) return <p>Session data missing.</p>;

  const { timeTaken, attempts, hintsUsed, total, language } = state;

  const minutes = Math.floor(timeTaken / 60000);
  const seconds = Math.floor((timeTaken % 60000) / 1000);

  return (
    <div className="game-complete-container">
      {showConfetti && <Confetti width={width} height={height} />}
      <h1>🎉 Quiz Complete!</h1>
      <p>
        You completed all <strong>{total}</strong> {language.toUpperCase()}{" "}
        challenges!
      </p>

      <div className="stats-box">
        <p>
          <strong>⏱ Time Taken:</strong> {minutes}m {seconds}s
        </p>
        <p>
          <strong>🔁 Incorrect Attempts:</strong> {attempts}
        </p>
        <p>
          <strong>💡 Hints Used:</strong> {hintsUsed}
        </p>
      </div>

      <div className="complete-buttons">
        <button onClick={() => navigate(0)}>Retry Same Quiz</button>
        <button onClick={() => navigate("/choose-path")}>
          Choose Different Language
        </button>
      </div>
    </div>
  );
}

export default GameComplete;
