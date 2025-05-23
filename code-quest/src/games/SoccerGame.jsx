import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../components/DarkMode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Editor from "@monaco-editor/react";
import "./SoccerGame.css";
import SoccerBall from "../assets/soccerball.png";
import GoalKeeper from "../assets/goalkeeper.png";

function SoccerGame() {
  const { darkMode } = useDarkMode();
  const [userCSS, setUserCSS] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const styleTagRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("soccer-game-body");

    return () => {
      document.body.classList.remove("soccer-game-body");
    };
  }, []);

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
    const ball = document.querySelector(".ball");
    if (ball) {
      ball.style = ""; 
      ball.classList.remove("animated-ball"); 
      void ball.offsetWidth; 
      ball.classList.add("ball");
    }
  };

  const handleRunClick = () => {
    if (!isRunning) {
      injectCSS(userCSS);
      setIsRunning(true);
  
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
                <img src={GoalKeeper} alt="Goalkeeper" className="keeper-image" />
              </div>
              <img src={SoccerBall} alt="Soccer Ball Image" className="ball"/>
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
              onChange={(value) => setUserCSS(value || "")}
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
            <button>Hint</button>
            <button>Submit</button>

          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} pauseOnHover={false} />
    </>
  );
}

export default SoccerGame;
