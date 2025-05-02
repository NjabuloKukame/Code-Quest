import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import quizData from "./QuizData.json";
import "./Game.css";

function Game() {
  const { language } = useParams();
  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userCode, setUserCode] = useState("");

  useEffect(() => {
    const formattedLang = language.toUpperCase();
    if (formattedLang === "ALL") {
      const allChallenges = Object.values(quizData).flat();
      setChallenges(allChallenges);
    } else {
      setChallenges(quizData[formattedLang] || []);
    }
  }, [language]);

  useEffect(() => {
    if (challenges.length > 0) {
      setUserCode(challenges[currentChallenge]?.starterCode || "");
    }
  }, [challenges, currentChallenge]);

  const challenge = challenges[currentChallenge];

  return (
    <div className="game-container">
      {/* Left Panel */}
      <div className="challenge-panel">
        {challenge ? (
          <>
            <div className="level-label">Level {challenge.id}</div>
            <h2>{challenge.title}</h2>
            <p>{challenge.description}</p>

            <div className="preview-box">
              <div className="preview-label">Preview</div>
              <div
                className="preview-output"
                dangerouslySetInnerHTML={{ __html: userCode }}
              />
            </div>
          </>
        ) : (
          <p>Loading challenges...</p>
        )}
      </div>

      {/* Right Panel */}
      <div className="editor-panel">
        <div className="editor-label">Editor</div>
        <textarea
          className="code-editor"
          placeholder="Write your code here..."
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
        />
        <div className="button-container">
          <button className="hint-btn">Hint</button>
          <button className="submit-button">Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Game;
