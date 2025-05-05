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

  // Show confetti for 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 7000);
    return () => clearTimeout(timer); // Cleanup
  }, []);

  // Check if the state is available
  if (!state) return <p>Session data missing.</p>;

  const { timeTaken, attempts, hintsUsed, total, language } = state;

  const minutes = Math.floor(timeTaken / 60000);
  const seconds = Math.floor((timeTaken % 60000) / 1000);

  // Achievements based on time taken, attempts, hints used, and total challenges
  const achievements = [];

  if (timeTaken < 30000) {
    achievements.push("🚀 You're a Cheetah! (Finished in under 30s)");
  } else if (timeTaken < 60000) {
    achievements.push("⏱ Quick Thinker! (Finished in under a minute)");
  } else if (timeTaken < 180000) {
    achievements.push(
      "🧘 Chill Coder! (Took your time and did it under 3 min)"
    );
  } else {
    achievements.push(
      "🐢 Slow and Steady! (Took over 3 minutes, but made it!)"
    );
  }

  if (attempts === 0) {
    achievements.push("🎯 One Shot Wonder! (No incorrect attempts)");
  } else if (attempts <= 2) {
    achievements.push("👌 Steady Hands! (Less than 3 incorrect attempts)");
  } else if (attempts >= 5) {
    achievements.push("😤 Never Give Up! (Tried 5+ times but you got there!)");
  } else if (attempts >= 10) {
    achievements.push(
      "🧗‍♂️ Climbing the Walls! (10+ incorrect attempts, but you made it!)"
    );
  }

  if (hintsUsed === 0) {
    achievements.push("🧠 Perfectionist! (Used no hints)");
  } else if (hintsUsed <= 2) {
    achievements.push("💡 Clever Solver! (Used only a few hints)");
  } else if (hintsUsed <= 5) {
    achievements.push("😅 Hint Goblin! (You really liked those hints!)");
  } else if (hintsUsed <= 8) {
    achievements.push("🧐 Hint Hoarder! (You used a lot... strategically?)");
  } else if (hintsUsed <= 10) {
    achievements.push(
      "🧙‍♂️ Hint Wizard! (Used many hints, but made it through!)"
    );
  } else if (hintsUsed <= 12) {
    achievements.push("📚 Hint Addict! (Were you reading the whole book?)");
  } else {
    achievements.push(
      "😂 Hint Monster! (You unlocked every hint... and then some!)"
    );
  }

  if (total >= 9) {
    achievements.push("🏋️ Heavy Lifter! (Completed a long challenge set)");
  } else if (total <= 3) {
    achievements.push(
      "🍬 Snack-Sized Win! (Short and sweet 3 question challenge completed)"
    );
  }

  // Function to retry the same quiz
  const retrySameQuiz = () => {
    navigate(`/game/${language}`, {
      state: {
        retry: true,
      },
    });
  };

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

      {achievements.length > 0 && (
        <div className="achievement-box">
          <h2>🏆 Achievements</h2>
          <ul>
            {achievements.map((achieve, idx) => {
              const emoji = achieve.slice(0, 2); 
              const restText = achieve.slice(2).trim(); 
              const [title, rawDesc] = restText.split(" (");
              const description = rawDesc ? rawDesc.replace(")", "") : "";

              return (
                <li className="achievement-item" key={idx}>
                  <span className="achievement-emoji">{emoji}</span>
                  <div className="achievement-text">
                    <strong className="achievement-title">{title}</strong>
                    {description && (
                      <div className="achievement-desc">{description}</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="complete-buttons">
        <button onClick={retrySameQuiz}>Retry Same Quiz</button>

        <button onClick={() => navigate("/choose-path")}>
          Choose Different Language
        </button>
      </div>
    </div>
  );
}

export default GameComplete;
