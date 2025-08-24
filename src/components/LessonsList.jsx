import "./LessonsList.css";

export default function LessonsList({ lessons, onSelectLesson }) {
  return (
    <div className="lessons-container">
      {lessons.map((lesson) => (
        <div
          key={lesson.lesson_id}
          className={`lesson-card ${lesson.isWatched ? "watched" : ""}`}
          onClick={!lesson.isWatched ? () => onSelectLesson(lesson) : undefined}
          style={{ cursor: lesson.isWatched ? "default" : "pointer" }}
        >
          <img
            src={lesson.lesson_thumbnail_url}
            alt={lesson.lesson_name}
            className="lesson-thumb"
          />
          <div className="lesson-info">
            <h3>{lesson.lesson_name}</h3>
            <p>{lesson.discipline}</p>
            <span className="status">
              {lesson.isWatched ? "✅ Assistido" : "⏳ Pendente"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
