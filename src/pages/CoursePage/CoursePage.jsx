import { useCallback, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RelatedBooks from '../../components/RelatedBooks/RelatedBooks';
import { useLibraryState } from '../../context/LibraryContext';
import { COURSES as coursesCatalog } from '../../data/courses';
import { SAMPLE_BOOKS as booksCatalog } from '../../data';
import { GENRE_LABELS } from '../../genres';
import { normalizeId } from '../../utils/recommendations';
import './CoursePage.css';

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const completedLessons = course
    ? Math.min(Number(courseProgress?.[course.id] || 0), course.lessons)
    : 0;
  const progressPercent = course?.lessons
    ? Math.round((completedLessons / course.lessons) * 100)
    : 0;

  const isFavorite = course
    ? favoriteCourseIds.some((courseId) => normalizeId(courseId) === normalizeId(course.id))
    : false;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    if (course) {
      recordCourseView(course.id);
    }
  }, [course, recordCourseView]);

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

  const markNextLesson = useCallback(() => {
    if (!course) return;
    setCourseLessonProgress(course.id, Math.min(completedLessons + 1, course.lessons));
  }, [completedLessons, course, setCourseLessonProgress]);

  const resetProgress = useCallback(() => {
    if (course) {
      setCourseLessonProgress(course.id, 0);
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
              onClick={markNextLesson}
              data-testid="course-progress-action"
              disabled={completedLessons >= course.lessons}
            >
              {completedLessons > 0 ? 'Следующий урок' : 'Начать курс'}
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

      <div className="course-page__recommendations">
        <RelatedBooks course={course} books={booksCatalog} onSelectBook={openBookPreview} />
      </div>
    </div>
  );
}
