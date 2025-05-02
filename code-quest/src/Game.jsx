import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { useDarkMode } from "./components/DarkMode";
import Editor from "@monaco-editor/react";
import "react-toastify/dist/ReactToastify.css";
import quizData from "./QuizData.json";
import "./Game.css";

function Game() {
  const { darkMode } = useDarkMode();
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
        <div className={`monaco-container ${darkMode ? "dark" : "light"}`}>
          <Editor
            height="100%"
            language={challenge?.language?.toLowerCase() || "html"}
            theme={darkMode ? "vs-dark" : "light"}
            value={userCode}
            onChange={(value) => setUserCode(value || "")}
            options={{
                fontSize: 18,
                fontFamily: "Montserrat",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                scrollbar: {
                  vertical: "auto", 
                  horizontal: "auto",
                  verticalScrollbarSize: 0,
                  horizontalScrollbarSize: 0
                }
              }}
          />
        </div>
        <div className="button-container">
          <button
            className="hint-btn"
            onClick={() => toast.info(challenge.hint || "No hint available")}
          >
            Hint
          </button>
          <button className="submit-button">Submit</button>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnHover={false}
      />
    </div>
  );
}

export default Game;
