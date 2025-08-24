import { useState } from "react";
import api from "../api";
import "./LessonModal.css";

export default function LessonModal({ lesson, token, matriculation, onClose, onCompleted }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/lessons/questions/${lesson.lesson_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(data.data || []);
    } catch (err) {
      console.error("Erro ao buscar questões:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLesson = async () => {
    try {
      setLoading(true);
      await api.post(
        "/student/frequency",
        {
          matriculation,
          lessonId: lesson.lesson_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onCompleted();
      onClose();
    } catch (err) {
      console.error("Erro ao registrar frequência:", err);
      alert("Erro ao registrar a lição.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{lesson.lesson_name}</h2>

        {/* Loader no modal */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p className="loading-text">Carregando...</p>
          </div>
        )}

        {!loading && questions.length === 0 && !confirming && (
          <button className="primary-btn" onClick={fetchQuestions}>
            Realizar lição
          </button>
        )}

        {!loading && questions.length > 0 && !confirming && (
          <div className="questions-list">
            {questions.map((q, idx) => (
              <div key={q.id} className="question-block">
                <p className="question">{idx + 1}. {q.question}</p>
                <ul className="answers">
                  {q.answers.map((ans) => (
                    <li
                      key={ans.number}
                      className={`answer ${
                        ans.number === q.right ? "correct" : ""
                      }`}
                    >
                      <strong>{ans.number}.</strong> {ans.answer}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button className="primary-btn" onClick={() => setConfirming(true)}>
              Confirmar realização
            </button>
          </div>
        )}

        {!loading && confirming && (
          <div className="confirm-block">
            <p>Você confirma a realização da lição?</p>
            <div className="confirm-actions">
              <button className="secondary-btn" onClick={() => setConfirming(false)}>Cancelar</button>
              <button className="primary-btn" onClick={handleConfirmLesson}>Sim, confirmar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
