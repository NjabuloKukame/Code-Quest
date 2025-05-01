import { useDarkMode } from "./components/DarkMode";
import Header from "./components/Header";
import lightBackgroundImage from "./assets/code-quest-light-mode.jpg";
import darkBackgroundImage from "./assets/code-quest-dark-mode.jpg";
import "./App.css";

function App() {
  const { darkMode } = useDarkMode();
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
      </div>
    </>
  );
}

export default App;
