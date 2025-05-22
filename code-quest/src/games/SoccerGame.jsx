import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../components/DarkMode";
import Editor from "@monaco-editor/react";
import "./SoccerGame.css";
import SoccerBall from "../assets/soccerball.png";
import GoalKeeper from "../assets/goalkeeper.png";

function SoccerGame() {
  const { darkMode } = useDarkMode();
  const [userCSS, setUserCSS] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const styleTagRef = useRef(null);

  // const runUserCSS = () => {
  //   let existingStyle = document.getElementById("user-style");
  
  //   if (existingStyle) {
  //     existingStyle.innerHTML = userCSS;
  //   } else {
  //     const style = document.createElement("style");
  //     style.id = "user-style";
  //     style.innerHTML = userCSS;
  //     document.head.appendChild(style);
  //   }
  // };
  

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
    </>
  );
}

export default SoccerGame;
