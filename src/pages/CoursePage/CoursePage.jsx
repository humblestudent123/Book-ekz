import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RelatedBooks from '../../components/RelatedBooks/RelatedBooks';
import { useLibraryState } from '../../context/LibraryContext';
import { SAMPLE_BOOKS as booksCatalog } from '../../data';
import { COURSES as coursesCatalog } from '../../data/courses';
import { GENRE_LABELS } from '../../genres';
import { buildCourseLessons } from '../../utils/courseContent';
import { normalizeId } from '../../utils/recommendations';
import './CoursePage.css';

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const learningRef = useRef(null);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const {
    favoriteCourseIds,
    courseProgress,
    toggleCourseFavorite,
    recordCourseView,
    setCourseLessonProgress,
  } = useLibraryState();

  const course = useMemo(
    () => coursesCatalog.find((item) => String(item.id) === String(id)),
    [id]
  );

  const courseLessons = useMemo(() => (course ? buildCourseLessons(course) : []), [course]);
  const completedLessons = course
    ? Math.min(Number(courseProgress?.[course.id] || 0), course.lessons)
    : 0;
  const progressPercent = course?.lessons
    ? Math.round((completedLessons / course.lessons) * 100)
    : 0;
  const currentLessonIndex = courseLessons.length
    ? Math.min(completedLessons, courseLessons.length - 1)
    : 0;
  const currentLesson = courseLessons[currentLessonIndex];
  const isCourseCompleted = course ? completedLessons >= course.lessons : false;
  const isFavorite = course
    ? favoriteCourseIds.some((courseId) => normalizeId(courseId) === normalizeId(course.id))
    : false;
  const isAnswerCorrect =
    currentLesson?.quiz && selectedAnswer === currentLesson.quiz.correctIndex;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    if (course) {
      recordCourseView(course.id);
    }
  }, [course, recordCourseView]);

  useEffect(() => {
    setIsLearningOpen(false);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  }, [id]);

  const openBookPreview = useCallback(
    (book) => {
      navigate(`/library/book/${book.id}`);
    },
    [navigate]
  );

  const toggleFavorite = useCallback(() => {
    if (course) {
      toggleCourseFavorite(course.id);
    }
  }, [course, toggleCourseFavorite]);

  const openLearning = useCallback(() => {
    if (!course) return;

    setIsLearningOpen(true);
    window.setTimeout(() => {
      learningRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }, [course]);

  const completeCurrentLesson = useCallback(() => {
    if (!course) return;

    setCourseLessonProgress(course.id, Math.min(completedLessons + 1, course.lessons));
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  }, [completedLessons, course, setCourseLessonProgress]);

  const resetProgress = useCallback(() => {
    if (course) {
      setCourseLessonProgress(course.id, 0);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    }
  }, [course, setCourseLessonProgress]);

  if (!course) {
    return (
      <div className="course-page">
        <div className="book-not-found">Курс не найден.</div>
      </div>
    );
  }

  return (
    <div className="course-page">
      <div className="course-bg" style={{ backgroundImage: `url(${course.image})` }} />

      <div className="course-layout">
        <div className="course-cover">
          <img src={course.image} alt={course.title} decoding="async" fetchPriority="high" />
        </div>

        <div className="course-info">
          <Link className="course-back-link" to="/courses">
            Все курсы
          </Link>

          <span className="course-category">{GENRE_LABELS[course.category] || course.category}</span>
          <h1>{course.title}</h1>

          <h3 className="course-author">
            <span>Автор:</span>
            {course.author}
          </h3>

          <div className="course-meta">
            <span>{course.lessons} уроков</span>
            <span>{course.duration}</span>
            <span>Рейтинг {course.rating}</span>
          </div>

          <p className="course-description">{course.description}</p>

          <div className="course-progress-panel">
            <div className="course-progress-panel__top">
              <span>Прогресс курса</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="course-progress-track">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <p>
              Завершено {completedLessons} из {course.lessons} уроков
            </p>
          </div>

          <div className="book-actions">
            <button
              className="read-btn"
              type="button"
              onClick={openLearning}
              data-testid="course-progress-action"
              disabled={isCourseCompleted}
            >
              {isCourseCompleted
                ? 'Курс завершен'
                : completedLessons > 0
                  ? 'Продолжить курс'
                  : 'Начать курс'}
            </button>

            <button
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              type="button"
              onClick={toggleFavorite}
            >
              {isFavorite ? 'В избранном' : 'В избранное'}
            </button>

            {completedLessons > 0 ? (
              <button className="secondary-btn" type="button" onClick={resetProgress}>
                Сбросить прогресс
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {isLearningOpen && currentLesson ? (
        <section className="course-learning" ref={learningRef} data-testid="course-learning">
          <div className="course-learning__header">
            <div>
              <span className="course-learning__eyebrow">
                Урок {currentLessonIndex + 1} из {course.lessons}
              </span>
              <h2>{currentLesson.title}</h2>
            </div>
            <strong>{progressPercent}%</strong>
          </div>

          <div className="course-learning__grid">
            <article className="course-learning__panel">
              <h3>Теория</h3>
              {currentLesson.theory.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>

            <article className="course-learning__panel course-learning__panel--practice">
              <h3>Практика</h3>
              <p>{currentLesson.practice}</p>
            </article>

            <article className="course-learning__panel course-learning__panel--quiz">
              <h3>Тест</h3>
              <p>{currentLesson.quiz.question}</p>

              <div className="course-quiz" role="radiogroup" aria-label="Ответ на тест">
                {currentLesson.quiz.options.map((option, optionIndex) => (
                  <button
                    key={option}
                    className={`course-quiz__option ${
                      selectedAnswer === optionIndex ? 'is-selected' : ''
                    } ${
                      isAnswerChecked && optionIndex === currentLesson.quiz.correctIndex
                        ? 'is-correct'
                        : ''
                    } ${
                      isAnswerChecked &&
                      selectedAnswer === optionIndex &&
                      optionIndex !== currentLesson.quiz.correctIndex
                        ? 'is-wrong'
                        : ''
                    }`}
                    type="button"
                    role="radio"
                    aria-checked={selectedAnswer === optionIndex}
                    onClick={() => {
                      setSelectedAnswer(optionIndex);
                      setIsAnswerChecked(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {isAnswerChecked ? (
                <div className={`course-quiz__feedback ${isAnswerCorrect ? 'is-correct' : 'is-wrong'}`}>
                  {isAnswerCorrect
                    ? currentLesson.quiz.explanation
                    : 'Пока не совсем. Вернитесь к теории и выберите более точный вариант.'}
                </div>
              ) : null}

              <div className="course-learning__actions">
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => setIsAnswerChecked(true)}
                  disabled={selectedAnswer === null}
                >
                  Проверить тест
                </button>

                <button
                  className="read-btn"
                  type="button"
                  onClick={completeCurrentLesson}
                  disabled={!isAnswerChecked || !isAnswerCorrect}
                >
                  Далее
                </button>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <div className="course-page__recommendations">
        <RelatedBooks course={course} books={booksCatalog} onSelectBook={openBookPreview} />
      </div>
    </div>
  );
}
