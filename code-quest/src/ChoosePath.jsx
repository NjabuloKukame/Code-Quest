import React from 'react';
import './ChoosePath.css';
import { useNavigate } from 'react-router';

function ChoosePath() {
  const navigate = useNavigate();

  const handlePathSelect = (language) => {
    navigate(`/game/${language.toLowerCase()}`);
  };

  return (
    <div className="choose-path">
      <h2>Choose Your Path</h2>
      <p>Select a language to begin your Code Quest journey.</p>
      <div className="path-options">
        {['HTML', 'CSS', 'JavaScript', 'All'].map((lang) => (
          <button
            key={lang}
            onClick={() => handlePathSelect(lang)}
            className="path-button"
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChoosePath;
