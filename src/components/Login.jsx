import { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [matriculation, setMatriculation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (matriculation.trim()) {
      onLogin(matriculation);
    } else {
      alert("Digite sua matrícula!");
    }
  };

  return (
    <div className="login-container fade-in">
      <h1 className="login-title">Circuito da Visão</h1>
      <p className="login-subtitle">Digite sua matrícula para continuar</p>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Matrícula"
          value={matriculation}
          onChange={(e) => setMatriculation(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
}
