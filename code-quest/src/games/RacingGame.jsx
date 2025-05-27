import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../components/DarkMode";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import Editor from "@monaco-editor/react";
import Mercedes from "../assets/mercedes190e.png";
import Road from "../assets/road.png";
import Hills from "../assets/hills.png";
import Tree from "../assets/trees.png";
import Tesla from "../assets/Tesla.png";
import "./SoccerGame.css";
import "./RacingGame.css";

function RacingGame() {
  const { darkMode } = useDarkMode();
  const [userCSS, setUserCSS] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [teslaCarTop, setTeslaCarTop] = useState(-25);
  const [teslaCarLeft, setTeslaCarLeft] = useState(50);
  const [teslaCarScale, setTeslaCarScale] = useState(0.3);
  const [mercedesCarBottom, setMercedesCarBottom] = useState(28);
  const [mercedesCarScale, setMercedesCarScale] = useState(1);
  const styleTagRef = useRef(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const teslaRunIntervalRef = useRef(null); // Renamed for clarity
  const mercedesRunIntervalRef = useRef(null);
  const [hints, setHints] = useState([
    "You're trying to move the car, so you need to target it in CSS.",
    "Try using the `.car` selector in your CSS to affect the car.",
    "To animate movement, you'll need to use CSS properties like `position` and `transform`.",
    "`@keyframes` lets you define how the car moves — then you apply it using the `animation` property.",
    "Try using `transform: translateY(...)` or adjusting `bottom: ...` inside your keyframes to move the car down the road!",
  ]);
  const location = useLocation();
  const isReplay = location.state?.retry || false;
  const teslaCarRef = useRef(null);
  const mercedesCarRef = useRef(null);
  const treeRef = useRef(null);
  const leftGrassRef = useRef(null);
  const rightGrassRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("soccer-game-body");
    setStartTime(Date.now());

    return () => {
      document.body.classList.remove("soccer-game-body");
      removeInjectedStyles();
      if (teslaRunIntervalRef.current) {
        clearInterval(teslaRunIntervalRef.current);
      }
      if (mercedesRunIntervalRef.current) {
        clearInterval(mercedesRunIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isReplay) {
      removeInjectedStyles();
      resetGame();
      setUserCSS("");
      setHintIndex(0);
      setHintsUsed(0);
      setAttempts(0);
      setResetCount(0);
      setCharCount(0);
      setStartTime(Date.now());
    }
  }, [isReplay]);
  

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

  const isCollision = (rect1, rect2) => {
    const teslaHorizontalPadding = 15;
    const teslaVerticalPadding = 15;

    const mercedesHorizontalPadding = 15;
    const mercedesVerticalPadding = 15;

    const adjustedRect1 = {
      left: rect1.left + teslaHorizontalPadding,
      right: rect1.right - teslaHorizontalPadding,
      top: rect1.top + teslaVerticalPadding,
      bottom: rect1.bottom - teslaVerticalPadding,
    };

    const adjustedRect2 = {
      left: rect2.left + mercedesHorizontalPadding,
      right: rect2.right - mercedesHorizontalPadding,
      top: rect2.top + mercedesVerticalPadding,
      bottom: rect2.bottom - mercedesVerticalPadding,
    };

    // Check for collision
    return !(
      adjustedRect1.right < adjustedRect2.left ||
      adjustedRect1.left > adjustedRect2.right ||
      adjustedRect1.bottom < adjustedRect2.top ||
      adjustedRect1.top > adjustedRect2.bottom
    );
  };


  const stopAllAnimationsAndAlert = () => {
    if (teslaRunIntervalRef.current) {
      clearInterval(teslaRunIntervalRef.current);
      teslaRunIntervalRef.current = null;
    }
    if (mercedesRunIntervalRef.current) {
      clearInterval(mercedesRunIntervalRef.current);
      mercedesRunIntervalRef.current = null;
    }
  };

  const resetGame = () => {
    stopAllAnimationsAndAlert();
    toast.dismiss();
    setTeslaCarTop(-25);
    setTeslaCarLeft(50);
    setTeslaCarScale(0.3);
    setMercedesCarBottom(28);
    setMercedesCarScale(1);

    const mercedesCar = document.querySelector(".car");
    if (mercedesCar) {
      mercedesCar.classList.add("car-reset-animation");
      setTimeout(() => {
        mercedesCar.classList.remove("car-reset-animation");
        removeInjectedStyles();
      }, 50);
    } else {
      removeInjectedStyles();
    }

    setIsRunning(false);
    setResetCount((prev) => prev + 1);
  };

  const handleRunClick = () => {
    if (isRunning) {
      resetGame();
      return;
    }

    injectCSS(userCSS);
    setIsRunning(true);

    // Tesla's Animation Logic
    let currentTeslaTop = -25;
    const teslaStartTop = -25;
    const teslaEndTop = 35;
    const teslaTotalDistance = teslaEndTop - teslaStartTop;
    const teslaMinScale = 0.27;
    const teslaMaxScale = 0.55;
    const teslaLaneOffsets = { left: 0.48, right: 0.52, center: 0.5 };
    const teslaDirections = ["left", "right"];
    const chosenTeslaDirection =
      teslaDirections[Math.floor(Math.random() * teslaDirections.length)];
    let initialTeslaCarLeft = teslaLaneOffsets[chosenTeslaDirection] * 100;

    setTeslaCarLeft(initialTeslaCarLeft);
    setTeslaCarScale(teslaMinScale);

    teslaRunIntervalRef.current = setInterval(() => {
      currentTeslaTop += 2.5;
      setTeslaCarTop(currentTeslaTop);

      const progress = (currentTeslaTop - teslaStartTop) / teslaTotalDistance;
      const clampedProgress = Math.max(0, Math.min(1, progress));

      const newTeslaScale =
        teslaMinScale +
        (teslaMaxScale - teslaMinScale) * Math.pow(clampedProgress, 0.8);
      setTeslaCarScale(newTeslaScale);

      let newTeslaCarLeft;
      if (chosenTeslaDirection === "left") {
        const startLeft = teslaLaneOffsets.left * 100;
        const endLeft = 37;
        newTeslaCarLeft = startLeft + (endLeft - startLeft) * clampedProgress;
      } else if (chosenTeslaDirection === "right") {
        const startLeft = teslaLaneOffsets.right * 100;
        const endLeft = 62;
        newTeslaCarLeft = startLeft + (endLeft - startLeft) * clampedProgress;
      } else {
        newTeslaCarLeft = 50;
      }
      setTeslaCarLeft(newTeslaCarLeft);

      // Collision Check inside Tesla's interval
      if (teslaCarRef.current && mercedesCarRef.current) {
        const teslaRect = teslaCarRef.current.getBoundingClientRect();
        const mercedesRect = mercedesCarRef.current.getBoundingClientRect();

        if (isCollision(teslaRect, mercedesRect)) {
          stopAllAnimationsAndAlert();
          toast.error("💥 ACCIDENT! Click Reset to try again.");
          return;
        }
      }

      // End Collision Check For Tesla
      if (currentTeslaTop >= teslaEndTop) {
        clearInterval(teslaRunIntervalRef.current);
        teslaRunIntervalRef.current = null;

        if (!mercedesRunIntervalRef.current) {
          // Only if Mercedes also finished
          toast.success("🏁 Race completed successfully!");
        }
      }
    }, 100);

    //Mercedes's Animation Logic
    let currentMercedesBottom = 28;
    const mercedesEndBottom = 88;
    const mercedesTotalDistance = mercedesEndBottom - currentMercedesBottom;
    const mercedesMinScale = 0.2;
    const mercedesMaxScale = 1;

    mercedesRunIntervalRef.current = setInterval(() => {
      currentMercedesBottom += 2.5;
      setMercedesCarBottom(currentMercedesBottom);

      const progress = (currentMercedesBottom - 28) / mercedesTotalDistance;
      const clampedProgress = Math.max(0, Math.min(1, progress));

      const newMercedesScale =
        mercedesMaxScale -
        (mercedesMaxScale - mercedesMinScale) * Math.pow(clampedProgress, 0.8);
      setMercedesCarScale(newMercedesScale);

      // Collision Check (Car-to-Car) 
      if (teslaCarRef.current && mercedesCarRef.current) {
        const teslaRect = teslaCarRef.current.getBoundingClientRect();
        const mercedesRect = mercedesCarRef.current.getBoundingClientRect();

        if (isCollision(teslaRect, mercedesRect)) {
          stopAllAnimationsAndAlert();
          toast.error("💥 ACCIDENT! Click Reset to try again.");
          setIsRunning(true);
          return;
        }
      }

     
      // End Collision Check For Mercedes
      if (currentMercedesBottom >= mercedesEndBottom) {
        clearInterval(mercedesRunIntervalRef.current);
        mercedesRunIntervalRef.current = null;

        if (!teslaRunIntervalRef.current) {
          toast.success("🏁 Race completed successfully!");
        }
      }
    }, 100);
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
          gameName: "Racing Game",
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
          <div className="challenge-header">Racing Challenge</div>
          <div className="challenge-description">
            <h2>Move the Mercedes 190E Up the Road Using CSS</h2>
          </div>

          <div className="challenge-preview-box">
            <div className="race-container">
              <div className="sky"></div>
              <img src={Hills} alt="Hills" className="hills" />
              <div className="grass left-grass" ref={leftGrassRef}></div>
              <div className="grass right-grass" ref={rightGrassRef}></div>
              <div className="tree-layer">
                <img
                  src={Tree}
                  className="tree"
                  style={{ left: "0.5%", height: "70%", bottom: "5%" }}
                />
                <img
                  src={Tree}
                  className="tree"
                  style={{ left: "17%", height: "55%", bottom: "30%" }}
                />
                <img
                  src={Tree}
                  className="tree"
                  style={{ left: "29%", height: "25%", bottom: "60%" }}
                />
                <img
                  src={Tree}
                  className="tree"
                  style={{ left: "13%", height: "25%", bottom: "65%" }}
                />
                <img
                  src={Tree}
                  className="tree"
                  style={{ left: "3%", height: "23%", bottom: "65%" }}
                />

                <img
                  src={Tree}
                  className="tree"
                  style={{ left: "75%", height: "50%", bottom: "40%" }}
                />
                <img
                  src={Tree}
                  className="tree"
                  style={{ left: "65%", height: "40%", bottom: "46%" }}
                />
                <img
                  src={Tree}
                  className="tree"
                  style={{ left: "58%", height: "30%", bottom: "56%" }}
                />
                <img
                  src={Tree}
                  className="tree"
                  style={{ left: "93%", height: "20%", bottom: "69%" }}
                />
                <img
                  src={Tree}
                  className="tree"
                  style={{ left: "80%", height: "70%" }}
                />
              </div>

              <div className="road">
                <img src={Road} alt="Road" className="road-image" />
                <img
                  src={Tesla}
                  alt="Tesla"
                  className="tesla-car"
                  ref={teslaCarRef}
                  style={{
                    top: `${teslaCarTop}%`,
                    left: `${teslaCarLeft}%`,
                    transform: `translateX(-50%) scale(${teslaCarScale})`,
                    transition:
                      "top 0.1s linear, left 0.1s linear, transform 0.1s linear",
                  }}
                />
                <img
                  src={Mercedes}
                  alt="Mercedes"
                  className="car"
                  ref={mercedesCarRef}
                  style={{
                    bottom: `${mercedesCarBottom}%`, 
                    transform: `translateX(-50%) scale(${mercedesCarScale})`,
                    transition: "bottom 0.1s linear, transform 0.1s linear", 
                  }}
                />
              </div>
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

export default RacingGame;
