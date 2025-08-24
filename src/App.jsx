import { useState } from "react";
import Loader from "./components/Loader";
import Login from "./components/Login";
import LessonsList from "./components/LessonsList";
import LessonModal from "./components/LessonModal";
import api from "./api";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);

  const handleLogin = async (matriculation) => {
    try {
      setLoading(true);

      // 1. Login → pega token
      const { data: loginData } = await api.post("/login", { matriculation });
      const token = loginData.token;
      setToken(token);

      const authHeaders = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // 2. User info
      const { data: userRes } = await api.get(
        `/user/${matriculation}`,
        authHeaders
      );
      const userData = userRes.data;
      setUser(userData);

      // 3. Progress
      const { data: progressRes } = await api.get(
        `/student/progress/${matriculation}`,
        authHeaders
      );
      setProgress(progressRes.data);

      // 4. Lessons
      const { data: lessonsRes } = await api.get(
        `/lessons/${matriculation}`,
        authHeaders
      );
      setLessons(lessonsRes.data || []);
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Não foi possível realizar o login");
    } finally {
      setLoading(false);
    }
  };

  const refreshLessons = async () => {
    if (!user || !token) return;
    try {
      const { data: lessonsRes } = await api.get(
        `/lessons/${user.matriculation}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLessons(lessonsRes.data || []);
    } catch (err) {
      console.error("Erro ao atualizar lições:", err);
    }
  };

  if (!user) {
    return (
      <div className="app-container">
        <Login onLogin={handleLogin} />
        {loading && <Loader />}
      </div>
    );
  }

  const firstNameRaw = user.name.split(" ")[0];
  const firstName = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1).toLowerCase();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          Bem-vindo, <span>{firstName}</span> 👋
        </h1>
      </header>

      {/* Módulos */}
      <main className="cards-container">
        {progress.map((modulo, idx) => (
          <div key={idx} className="card">
            <div className="progress-circle">
              <svg className="progress-ring">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#3f3f46"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={
                    2 * Math.PI * 40 * (1 - Number(modulo.percentage) / 100)
                  }
                  strokeLinecap="round"
                />
              </svg>
              <span className="progress-text">
                {parseFloat(modulo.percentage).toFixed(0)}%
              </span>
            </div>
            <h2>{modulo.name}</h2>
          </div>
        ))}
      </main>

      {/* Lições */}
      <section className="lessons-section">
        <h2>Lições Disponíveis</h2>
        <LessonsList
          lessons={lessons}
          onSelectLesson={(lesson) => setCurrentLesson(lesson)}
        />
      </section>

      {currentLesson && (
        <LessonModal
          lesson={currentLesson}
          token={token}
          matriculation={user.matriculation}
          onClose={() => setCurrentLesson(null)}
          onCompleted={() => {
            setCurrentLesson(null);
            refreshLessons();
          }}
        />
      )}
    </div>
  );
}
