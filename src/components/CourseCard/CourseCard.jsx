import { memo } from 'react';
import PropTypes from 'prop-types';
import { GENRE_LABELS } from '../../genres';
import './CourseCard.css';

function CourseCard({
  course,
  isFavorite = false,
  progress = 0,
  onSelect,
  onToggleFavorite,
}) {
  const progressPercent = course.lessons
    ? Math.min(Math.round((Number(progress || 0) / course.lessons) * 100), 100)
    : 0;

  return (
    <article
      className="course-card"
      data-testid="course-card"
      data-course-id={course.id}
      data-category={course.category}
    >
      {onToggleFavorite ? (
        <button
          className={`course-card__favorite ${isFavorite ? 'is-active' : ''}`}
          type="button"
          aria-label={isFavorite ? 'Убрать курс из избранного' : 'Добавить курс в избранное'}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(course)}
        >
          {isFavorite ? 'В избранном' : 'В избранное'}
        </button>
      ) : null}

      <button className="course-card__media" type="button" onClick={() => onSelect(course)}>
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/logo192.png';
          }}
        />
      </button>

      <div className="course-card__content">
        <span className="course-card__category">{GENRE_LABELS[course.category] || course.category}</span>
        <h3>{course.title}</h3>
        <p>{course.author}</p>

        <div className="course-card__meta" aria-label="Параметры курса">
          <span>{course.lessons} уроков</span>
          <span>{course.duration}</span>
          <span>Рейтинг {course.rating}</span>
        </div>

        {progressPercent > 0 ? (
          <div className="course-card__progress" aria-label={`Прогресс ${progressPercent}%`}>
            <span style={{ width: `${progressPercent}%` }} />
          </div>
        ) : null}

        <button className="course-card__details" type="button" onClick={() => onSelect(course)}>
          Подробнее
        </button>
      </div>
    </article>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    lessons: PropTypes.number.isRequired,
    duration: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
  isFavorite: PropTypes.bool,
  progress: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func,
};

export default memo(CourseCard);
