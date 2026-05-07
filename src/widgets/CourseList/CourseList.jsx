import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import CourseCard from '../../components/CourseCard/CourseCard';
import { normalizeId } from '../../utils/recommendations';

function CourseList({
  title,
  description,
  courses,
  onSelect = () => {},
  action,
  favoriteCourseIds = [],
  progressById = {},
  onToggleFavorite,
  emptyMessage = 'Пока нет курсов в этом разделе.',
}) {
  const favoriteIds = useMemo(
    () => new Set((favoriteCourseIds || []).map(normalizeId)),
    [favoriteCourseIds]
  );

  return (
    <section className="shelf-section">
      <div className="shelf-section__header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {action ? <div className="shelf-section__action">{action}</div> : null}
      </div>

      {courses.length ? (
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isFavorite={favoriteIds.has(normalizeId(course.id))}
              progress={Number(progressById?.[course.id] || 0)}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">{emptyMessage}</div>
      )}
    </section>
  );
}

CourseList.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func,
  action: PropTypes.node,
  favoriteCourseIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  progressById: PropTypes.object,
  onToggleFavorite: PropTypes.func,
  emptyMessage: PropTypes.string,
};

export default memo(CourseList);
