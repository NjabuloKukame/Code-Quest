import { useDarkMode } from "./components/DarkMode";
import { useEffect } from "react";
import Header from "./components/Header";
import lightBackgroundImage from "./assets/code-play-light-bg.jpg";
import darkBackgroundImage from "./assets/code-play-dark-bg.jpg";
import darkCodePlayImage from "./assets/code-play-dark.png";
import lightCodePlayImage from "./assets/code-play-light.png";
import "./App.css";
import "./CodePlay.css";

function CodePlay() {
  const { darkMode } = useDarkMode();

  // useEffect to add a class to the body when the component mounts
  useEffect(() => {
    document.body.classList.add("code-play-body");

    return () => {
      document.body.classList.remove("code-play-body");
    };
  }, []);

  return (
    <>
      <div className="app-body">
        <img
          src={darkMode ? darkBackgroundImage : lightBackgroundImage}
          alt={
            darkMode
              ? "Dark Mode Background Image"
              : "Light Mode Background Image"
          }
          className="background-image"
        />

        <div className="header-container">
          <Header />
        </div>

        <div className="code-play-container">
          <div className="code-play-banner">
            <img
              src={lightCodePlayImage}
              alt={
                darkMode
                  ? "Dark Mode Background Image"
                  : "Light Mode Background Image"
              }
              className="banner-image"
            />
            <div className="banner-text">
              <h1 className="banner-title">Welcome to Code Play 🕹️</h1>
              <p className="banner-description">
                Unleash your creativity and sharpen your coding skills through
                interactive <br /> mini-games! Each challenge is a playful
                puzzle where your CSS <br /> or JavaScript knowledge brings the
                game to life. <br />
                Complete tasks, experiment freely, and learn in a fun, visual
                way. Ready to code, play, and win?
              </p>
            </div>
          </div>

          <div className="challenges-container">

            <h2 className="challenges-title">Challenges</h2>

            <div className="challenges-card-container">

                <div className="challenges-card">
                    <img src={lightBackgroundImage} alt="" className="challenge-thumbnail"/>
                    <h4 className="challenge-card-title">Score A Goal</h4>
                    <p className="challenge-card-description">Use CSS Or JS to Animate The Ball Into The Net</p>
                </div>
                
                
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default CodePlay;
