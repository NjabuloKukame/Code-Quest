import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintStepMap, setHintStepMap] = useState({});

  useEffect(() => {
    const formattedLang = language.toUpperCase();
    if (formattedLang === "ALL") {
      const allChallenges = Object.values(quizData)
        .flat()
        .map((challenge, index) => ({
          ...challenge,
          id: index + 1,
        }));
      setChallenges(allChallenges);
    } else {
      setChallenges(quizData[formattedLang] || []);
    }

    // Reset stats
    setStartTime(Date.now());
    setAttempts(0);
    setHintsUsed(0);
    setCurrentChallenge(0);
  }, [language]);

  useEffect(() => {
    if (challenges.length > 0) {
      setUserCode(challenges[currentChallenge]?.starterCode || "");
    }
  }, [challenges, currentChallenge]);

  const challenge = challenges[currentChallenge];

  //   Modal state
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    if (!challenge) return;

    const normalize = (str) => str.replace(/[\n\r\s]+/g, "").toLowerCase();
    const cleanedUserCode = userCode.replace(challenge.starterCode, "").trim();
    const user = normalize(cleanedUserCode);
    const solution = normalize(challenge.solution);

    if (user === solution) {
      setShowModal(true);
    } else {
      setAttempts((prev) => prev + 1);
      toast.error("Oops! That's not quite right.");
    }
  };

  const handleNext = () => {
    setShowModal(false);

    const isLastChallenge = currentChallenge === challenges.length - 1;

    if (isLastChallenge) {
      const timeTaken = Date.now() - startTime;

      navigate("/game-complete", {
        state: {
          timeTaken,
          attempts,
          hintsUsed,
          total: challenges.length,
          language,
        },
      });
    } else {
      setCurrentChallenge((prev) => prev + 1);
    }
  };

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
              <iframe
                title="preview"
                className="preview-output"
                srcDoc={
                  challenge?.language === "css"
                    ? `<html><head>
                        <style>
                          body { font-family: Montserrat, sans-serif; color: ${
                            darkMode ? "#fff" : "#000"
                          }}
                          ${userCode}
                        </style>
                      </head><body><h1>Hello World</h1><p>This is a test paragraph.</p></body></html>`
                    : challenge?.language === "javascript"
                    ? `<html><head>
                        <style>
                          body { font-family: Montserrat, sans-serif; color: ${
                            darkMode ? "#fff" : "#000"
                          }}
                        </style>
                      </head><body><script>${userCode}<\/script></body></html>`
                    : `<html><head>
                        <style>
                          body { font-family: Montserrat, sans-serif; color: ${
                            darkMode ? "#fff" : "#000"
                          }}
                        </style>
                      </head><body>${userCode}</body></html>`
                }
                sandbox="allow-scripts allow-modals"
                style={{ width: "95%", height: "fit-content", border: "none" }}
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
                horizontalScrollbarSize: 0,
              },
            }}
          />
        </div>
        <div className="button-container">
          <button
            className="hint-btn"
            onClick={() => {
              const hints = challenge.hint; 
              const hintKeys = ["hint1", "hint2", "hint3"];

             
              const currentStep = hintStepMap[challenge.id] || 0;

              if (
                currentStep < hintKeys.length &&
                hints[hintKeys[currentStep]]
              ) {
                toast.info(hints[hintKeys[currentStep]]);
               
                setHintStepMap((prevMap) => ({
                  ...prevMap,
                  [challenge.id]: currentStep + 1,
                }));

                setHintsUsed((prev) => prev + 1);
              } else {
                toast.info("No more hints available.");
              }
            }}
          >
            Hint
          </button>

          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnHover={false}
      />
      {showModal && challenge && (
        <div className="game-modal">
          <div className="game-modal-content">
            <h2>✅ Correct!</h2>
            <p>{challenge.explanation}</p>
            <button onClick={handleNext}>
              {currentChallenge === challenges.length - 1
                ? "End Quiz"
                : "Next Question"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
