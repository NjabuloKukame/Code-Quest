import { useNavigate } from "react-router";
import React from "react";
import "./Modal.css";

function Modal({ onClose }) {
  const navigate = useNavigate();

  const handleUnderstand = () => {
    onClose();
    navigate("/choose-path");
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation(); 
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={handleContentClick}>
        <h2>Welcome to Code Quest!</h2>
        <p>
          This game will test your HTML, CSS, and JavaScript skills. You can
          play in sequence or choose a specific path after this screen. You will 
          then be presented with a series of questions. Each question will have a
          puzzle you will need to complete to advance to the next question. 
        </p>
        <button className="modal-btn" onClick={handleUnderstand}>
          I Understand
        </button>
      </div>
    </div>
  );
}

export default Modal;
