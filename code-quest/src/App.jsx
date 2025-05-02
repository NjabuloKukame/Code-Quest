import React, { useState } from "react";
import { Link } from "react-router";
import { useDarkMode } from "./components/DarkMode";
import Header from "./components/Header";
import Modal from "./components/Modal";
import lightBackgroundImage from "./assets/code-quest-light-mode.jpg";
import darkBackgroundImage from "./assets/code-quest-dark-mode.jpg";
import "./App.css";

function App() {

  const { darkMode } = useDarkMode();
  const [showModal, setShowModal] = useState(false);

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

        <div className="content-container">
          <h1 className="content-title">Welcome To <br /> Code Quest</h1>

          <div className="content-description-container">
            <p className="content-description">
              Embark on an interactive journey <br /> to master coding. 
              Explore <br /> challenges, learn new skills, and <br />
              level up your expertise.
            </p>
          </div>

          

          
          <div className="start-button" onClick={() => setShowModal(true)} >Start</div>

        </div>
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default App;
