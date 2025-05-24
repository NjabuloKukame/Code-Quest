import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import "../GameComplete.css";

function CodePlayGameComplete() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  if (!state) return <p>Session data missing.</p>;

  const {
    timeTaken,
    attempts,
    hintsUsed,
    resetCount = 0,
    charCount = 0,
    gameName,
  } = state;

  const minutes = Math.floor(timeTaken / 60000);
  const seconds = Math.floor((timeTaken % 60000) / 1000);

  const achievements = [];

  // TIME ACHIEVEMENTS
  if (timeTaken < 30000) {
    achievements.push("🚀 Speed Demon! (Finished in under 30 seconds)");
  } else if (timeTaken < 60000) {
    achievements.push("⚡ Fast Finisher! (Under a minute)");
  } else if (timeTaken < 180000) {
    achievements.push("🐢 Thoughtful Player! (Under 3 minutes)");
  } else {
    achievements.push("⏳ Determined Mind! (Over 3 minutes)");
  }

  // ATTEMPT ACHIEVEMENTS
  if (attempts === 0) {
    achievements.push("🎯 Flawless Victory! (No incorrect attempts)");
  } else if (attempts <= 3) {
    achievements.push("🔄 Quick Learner! (3 or fewer retries)");
  } else if (attempts <= 7) {
    achievements.push("🛠 Resilient Coder! (Kept going)");
  } else {
    achievements.push("🔥 Unbreakable! (Took a beating but finished)");
  }

  // HINT USAGE ACHIEVEMENTS
  if (hintsUsed === 0) {
    achievements.push("🧠 Pure Instincts! (No hints used)");
  } else if (hintsUsed <= 2) {
    achievements.push("💡 Occasional Peek! (Used 1-2 hints)");
  } else if (hintsUsed <= 5) {
    achievements.push("📖 Strategic Thinker! (Used a few hints wisely)");
  } else {
    achievements.push("👀 Full Vision! (Relied heavily on hints)");
  }

  // RESET ACHIEVEMENTS
  if (resetCount === 0) {
    achievements.push("🧼 One & Done! (No resets used)");
  } else if (resetCount <= 2) {
    achievements.push("🔁 Steady Hands! (Reset once or twice)");
  } else if (resetCount <= 5) {
    achievements.push("🔄 Mr./Ms. Retry! (Reset a few times)");
  } else {
    achievements.push("♻️ Persistent Soul! (Lots of resets, never gave up)");
  }

  // CHARACTER COUNT ACHIEVEMENTS
  if (charCount < 50) {
    achievements.push("✂️ Tiny Tinkerer! (Under 50 characters)");
  } else if (charCount <= 150) {
    achievements.push("⚖️ Efficient Coder! (150 characters or fewer)");
  } else if (charCount <= 300) {
    achievements.push("📝 Verbose but Clean! (150 – 300 characters)");
  } else {
    achievements.push("📜 Master of Detail! (Over 300 characters of code)");
  }

  const handleReplay = () => {
    navigate(`/code-play/${gameName}`, {
      state: { retry: true },
    });
  };

  return (
    <div className="game-complete-container">
      {showConfetti && <Confetti width={width} height={height} />}
      <h1>🎉 Challenge Complete!</h1>

      <p>
        You completed the <strong>{gameName}</strong>!
      </p>

      <div className="stats-box">
        <p>
          <strong>⏱ Time Taken:</strong> {minutes}m {seconds}s
        </p>
        <p>
          <strong>🚫 Incorrect Attempts:</strong> {attempts}
        </p>
        <p>
          <strong>💡 Hints Used:</strong> {hintsUsed}
        </p>
        <p>
          <strong>🔁 Resets Used:</strong> {resetCount}
        </p>
        <p>
          <strong>🔡 Character Count:</strong> {charCount}
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
        <button onClick={handleReplay}>Replay This Game</button>
        <button onClick={() => navigate("/code-play")}>
          Choose Another Challenge
        </button>
      </div>
    </div>
  );
}

export default CodePlayGameComplete;
