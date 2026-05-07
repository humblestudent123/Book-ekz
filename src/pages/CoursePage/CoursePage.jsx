import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLibraryState } from '../../context/LibraryContext';
import { COURSES as coursesCatalog } from '../../data/courses';
import { GENRE_LABELS } from '../../genres';
import { buildCourseLessons } from '../../utils/courseContent';
import { normalizeId } from '../../utils/recommendations';
import './CoursePage.css';

export default function CoursePage() {
  const { id } = useParams();
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  const [lessonStep, setLessonStep] = useState('theory');
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

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
    ? Math.min(Math.max(activeLessonIndex, 0), courseLessons.length - 1)
    : 0;
  const currentLesson = courseLessons[currentLessonIndex];
  const isCourseCompleted = course ? completedLessons >= course.lessons : false;
  const isFavorite = course
    ? favoriteCourseIds.some((courseId) => normalizeId(courseId) === normalizeId(course.id))
    : false;
  const hasAnswered = selectedAnswer !== null;
  const isAnswerCorrect =
    currentLesson?.quiz && selectedAnswer === currentLesson.quiz.correctIndex;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id, isLearningOpen, lessonStep, currentLessonIndex]);

  useEffect(() => {
    if (course) {
      recordCourseView(course.id);
    }
  }, [course, recordCourseView]);

  useEffect(() => {
    setIsLearningOpen(false);
    setLessonStep('theory');
    setActiveLessonIndex(0);
    setSelectedAnswer(null);
  }, [id]);

  const toggleFavorite = useCallback(() => {
    if (course) {
      toggleCourseFavorite(course.id);
    }
  }, [course, toggleCourseFavorite]);

  const openLearning = useCallback(() => {
    if (!course || isCourseCompleted) return;

    setIsLearningOpen(true);
    setLessonStep('theory');
    setActiveLessonIndex(Math.min(completedLessons, courseLessons.length - 1));
    setSelectedAnswer(null);
  }, [completedLessons, course, courseLessons.length, isCourseCompleted]);

  const goToQuiz = useCallback(() => {
    setLessonStep('quiz');
    setSelectedAnswer(null);
  }, []);

  const selectLesson = useCallback((lessonIndex) => {
    setActiveLessonIndex(lessonIndex);
    setLessonStep('theory');
    setSelectedAnswer(null);
  }, []);

  const completeCurrentLesson = useCallback(() => {
    if (!course || !isAnswerCorrect) return;

    const nextProgress = Math.min(
      Math.max(completedLessons, currentLessonIndex + 1),
      course.lessons
    );

    setCourseLessonProgress(course.id, nextProgress);
    setActiveLessonIndex(Math.min(currentLessonIndex + 1, course.lessons - 1));
    setLessonStep('theory');
    setSelectedAnswer(null);
  }, [completedLessons, course, currentLessonIndex, isAnswerCorrect, setCourseLessonProgress]);

  const resetProgress = useCallback(() => {
    if (course) {
      setCourseLessonProgress(course.id, 0);
      setIsLearningOpen(false);
      setLessonStep('theory');
      setActiveLessonIndex(0);
      setSelectedAnswer(null);
    }
  }, [course, setCourseLessonProgress]);

  if (!course) {
    return (
      <div className="course-page">
        <div className="book-not-found">Курс не найден.</div>
      </div>
    );
  }

  if (isLearningOpen && currentLesson) {
    return (
      <div className="course-study-page">
        <header className="course-study-header">
          <button
            className="course-study-back"
            type="button"
            data-testid="course-study-back"
            onClick={() => setIsLearningOpen(false)}
          >
            К описанию курса
          </button>

          <div className="course-study-header__meta">
            <span>{course.title}</span>
            <strong>{progressPercent}%</strong>
          </div>
        </header>

        <main className="course-study-shell" data-testid="course-learning">
          <div className="course-study-progress">
            <span style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="course-study-topline">
            <span>
              Урок {currentLessonIndex + 1} из {course.lessons}
            </span>
            <span>{lessonStep === 'theory' ? 'Теория' : 'Тест'}</span>
          </div>

          <div className="course-study-layout">
            <aside className="course-lesson-nav" aria-label="Темы курса">
              <div className="course-lesson-nav__header">
                <h2>Темы курса</h2>
                <span>{course.lessons} уроков</span>
              </div>

              <div className="course-lesson-nav__list">
                {courseLessons.map((lesson, lessonIndex) => {
                  const isCurrent = lessonIndex === currentLessonIndex;
                  const isCompleted = lessonIndex < completedLessons;

                  return (
                    <button
                      key={lesson.id}
                      className={`course-lesson-nav__item ${isCurrent ? 'is-current' : ''} ${
                        isCompleted ? 'is-completed' : ''
                      }`}
                      type="button"
                      data-testid="course-lesson-item"
                      aria-current={isCurrent ? 'step' : undefined}
                      onClick={() => selectLesson(lessonIndex)}
                    >
                      <span>{lessonIndex + 1}</span>
                      <strong>{lesson.title.replace(/^\d+\.\s*/, '')}</strong>
                    </button>
                  );
                })}
              </div>
            </aside>

            {lessonStep === 'theory' ? (
              <section className="course-study-card" data-testid="course-theory-step">
                <h1>{currentLesson.title}</h1>
                <div className="course-study-content">
                  {currentLesson.theory.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="course-study-practice">
                  <h2>Практика перед тестом</h2>
                  <p>{currentLesson.practice}</p>
                </div>

                <div className="course-study-actions">
                  <button
                    className="read-btn"
                    type="button"
                    onClick={goToQuiz}
                    data-testid="course-next-step"
                  >
                    Далее
                  </button>
                </div>
              </section>
            ) : (
              <section className="course-study-card" data-testid="course-quiz-step">
                <h1>Тест по уроку</h1>
                <p className="course-study-question">{currentLesson.quiz.question}</p>

                <div className="course-quiz" role="radiogroup" aria-label="Ответ на тест">
                  {currentLesson.quiz.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      className={`course-quiz__option ${
                        selectedAnswer === optionIndex ? 'is-selected' : ''
                      } ${
                        hasAnswered && optionIndex === currentLesson.quiz.correctIndex
                          ? 'is-correct'
                          : ''
                      } ${
                        hasAnswered &&
                        selectedAnswer === optionIndex &&
                        optionIndex !== currentLesson.quiz.correctIndex
                          ? 'is-wrong'
                          : ''
                      }`}
                      type="button"
                      data-testid="course-quiz-option"
                      role="radio"
                      aria-checked={selectedAnswer === optionIndex}
                      disabled={hasAnswered}
                      onClick={() => setSelectedAnswer(optionIndex)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {hasAnswered ? (
                  <div className={`course-quiz__feedback ${isAnswerCorrect ? 'is-correct' : 'is-wrong'}`}>
                    {isAnswerCorrect
                      ? currentLesson.quiz.explanation
                      : 'Ответ неверный. Правильный вариант подсвечен зеленым, перечитайте теорию и попробуйте следующий урок внимательнее.'}
                  </div>
                ) : null}

                <div className="course-study-actions">
                  <button className="secondary-btn" type="button" onClick={() => setLessonStep('theory')}>
                    Назад к теории
                  </button>

                  {hasAnswered ? (
                    <button
                      className="read-btn"
                      type="button"
                      onClick={completeCurrentLesson}
                      data-testid="course-complete-lesson"
                      disabled={!isAnswerCorrect}
                    >
                      {currentLessonIndex + 1 >= course.lessons ? 'Завершить курс' : 'Следующий урок'}
                    </button>
                  ) : null}
                </div>
              </section>
            )}
          </div>
        </main>
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
    </div>
  );
}
