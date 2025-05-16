import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DarkModeProvider } from "./components/DarkMode.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import ChoosePath from "./ChoosePath.jsx";
import Game from "./Game.jsx"; 
import GameComplete from "./GameComplete.jsx"; 
import CodePlay from "./CodePlay.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/choose-path" element={<ChoosePath />} />
          <Route path="/code-play" element={<CodePlay />} />
          <Route path="/game/:language" element={<Game />} />
          <Route path="/game-complete" element={<GameComplete />} />

        </Routes>
      </Router>
    </DarkModeProvider>
  </StrictMode>
);
