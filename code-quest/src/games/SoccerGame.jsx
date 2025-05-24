import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../components/DarkMode";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import Editor from "@monaco-editor/react";
import "./SoccerGame.css";
import SoccerBall from "../assets/soccerball.png";
import GoalKeeper from "../assets/goalkeeper.png";

function SoccerGame() {
  const { darkMode } = useDarkMode();
  const [userCSS, setUserCSS] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [keeperPosition, setKeeperPosition] = useState("center");
  const styleTagRef = useRef(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [ballKey, setBallKey] = useState(0);
  const [hints, setHints] = useState([
    "You're trying to move the **ball**, so you need to target it in CSS.",
    "Try using the **`.ball`** selector in your CSS to affect the ball.",
    "To move elements, CSS properties like `position` and `transform` are useful.",
    "Use `@keyframes` to define movement, and apply it with `animation`.",
    "Try animating the ball using `transform: translateX(...)` or `left: ...`!",
  ]);
  const location = useLocation();
  const isReplay = location.state?.retry || false;

  // Add class to body on mount and remove on unmount
  useEffect(() => {
    document.body.classList.add("soccer-game-body");
    setStartTime(Date.now());

    return () => {
      document.body.classList.remove("soccer-game-body");
      removeInjectedStyles()
    };
  }, []);

  // Reset game state when replaying
  useEffect(() => {
    if (isReplay) {
      
      removeInjectedStyles(); 
      resetBall(); 
      setUserCSS(""); 
      setHintIndex(0);
      setHintsUsed(0);
      setAttempts(0);
      setResetCount(0);
      setCharCount(0);
      setStartTime(Date.now()); 
    }
  }, [isReplay])

  // Inject CSS into the document head
  const injectCSS = (css) => {
    removeInjectedStyles();
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
    styleTagRef.current = style;
  };

  const removeInjectedStyles = () => {
    if (styleTagRef.current) {
      document.head.removeChild(styleTagRef.current);
      styleTagRef.current = null;
    }
  };

  const resetBall = () => {
    removeInjectedStyles(); 
    setBallKey((prevKey) => prevKey + 1);
    setKeeperPosition("center"); 
    setIsRunning(false); 
  };

  const handleRunClick = () => {
    if (!isRunning) {
      injectCSS(userCSS);
      setIsRunning(true);

      const directions = ["left", "center", "right"];
      const randomDirection =
        directions[Math.floor(Math.random() * directions.length)];
      setKeeperPosition(randomDirection);

      setTimeout(() => {
        const ball = document.querySelector(".ball");
        const goal = document.querySelector(".goal");
        const keeper = document.querySelector(".keeper-image");

        if (!ball || !goal || !keeper) return;

        const ballRect = ball.getBoundingClientRect();
        const goalRect = goal.getBoundingClientRect();
        const keeperRect = keeper.getBoundingClientRect();

        const isCollision = (rect1, rect2) => {
          return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
          );
        };

        const ballHitsGoal = isCollision(ballRect, goalRect);
        const ballHitsKeeper = isCollision(ballRect, keeperRect);

        if (ballHitsKeeper) {
          toast.error("🧤 Saved by the keeper!");
        } else if (ballHitsGoal) {
          toast.success("⚽ Goal!");
        } else {
          toast.info("🚫 Missed!");
        }
      }, 800);
    } else {
      removeInjectedStyles();
      resetBall();
      setIsRunning(false);
      setResetCount((prev) => prev + 1);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = () => {
    const ball = document.querySelector(".ball");
    const goal = document.querySelector(".goal");
    const keeper = document.querySelector(".keeper-image");

    if (!ball || !goal || !keeper) return;

    const ballRect = ball.getBoundingClientRect();
    const goalRect = goal.getBoundingClientRect();
    const keeperRect = keeper.getBoundingClientRect();

    const isCollision = (rect1, rect2) => {
      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
    };

    const ballHitsGoal = isCollision(ballRect, goalRect);
    const ballHitsKeeper = isCollision(ballRect, keeperRect);

    if (ballHitsGoal && !ballHitsKeeper) {
      const timeTaken = Date.now() - startTime;

      navigate("/code-play-complete", {
        state: {
          timeTaken,
          attempts,
          hintsUsed,
          resetCount,
          charCount,
          gameName: "Soccer Game",
        },
      });
    } else {
      toast.error("🧱 Not a valid goal yet!");
      setAttempts((prev) => prev + 1); // TRACK ATTEMPTS
    }
  };

  const handleHintClick = () => {
    if (hintIndex < hints.length - 1) {
      toast.info(`💡 Hint ${hintIndex + 1}: ${hints[hintIndex]}`);
      setHintIndex((prev) => prev + 1);
      setHintsUsed((prev) => prev + 1);
    } else if (hintIndex === hints.length - 1) {
      toast.info(`💡 Hint ${hintIndex + 1}: ${hints[hintIndex]}`);
      toast.warning("🚫 No more hints!");
      setHintIndex((prev) => prev + 1);
      setHintsUsed((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="code-play-game-container">
        <div className="code-play-game-preview-box">
          <div className="challenge-header">Soccer Challenge</div>
          <div className="challenge-description">
            <h2>Score A Goal Using CSS</h2>
          </div>

          <div className="challenge-preview-box">
            <div className="soccer-container">
              <div className="goal">
                <img
                  src={GoalKeeper}
                  alt="Goalkeeper"
                  className={`keeper-image keeper-${keeperPosition}`}
                />
              </div>
              <img
                src={SoccerBall}
                alt="Soccer Ball Image"
                className="ball"
                key={ballKey}
              />
            </div>
          </div>
        </div>

        <div className="code-play-code-editor">
          <div className={`monaco-container ${darkMode ? "dark" : "light"}`}>
            <Editor
              height="100%"
              language={"css"}
              theme={darkMode ? "vs-dark" : "light"}
              value={userCSS}
              onChange={(value) => {
                const css = value || "";
                setUserCSS(css);
                setCharCount(css.length);
              }}
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

          <div className="code-play-buttons">
            <button onClick={handleRunClick}>
              {isRunning ? "Reset" : "Run"}
            </button>
            <button
              onClick={handleHintClick}
              disabled={hintIndex >= hints.length}
            >
              Hint
            </button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnHover={false}
      />
    </>
  );
}

export default SoccerGame;
