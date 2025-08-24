import React from "react";
import "../App.css";

export default function Loader({ text = "Carregando..." }) {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
}
