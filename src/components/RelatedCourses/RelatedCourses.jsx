import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import CourseCard from '../CourseCard/CourseCard';
import { getRelatedCourses, normalizeId } from '../../utils/recommendations';

function RelatedCourses({
  book,
  courses,
  favoriteCourseIds = [],
  progressById = {},
  onSelectCourse,
  onToggleFavorite,
}) {
  const relatedCourses = useMemo(() => getRelatedCourses(book, courses), [book, courses]);
  const favoriteIds = useMemo(
    () => new Set((favoriteCourseIds || []).map(normalizeId)),
    [favoriteCourseIds]
  );

  return (
    <section className="shelf-section related-section">
      <div className="shelf-section__header">
        <div>
          <h2>Связанные курсы</h2>
          <p>Подборка строится по категории открытой книги.</p>
        </div>
      </div>

      {relatedCourses.length ? (
        <div className="courses-grid">
          {relatedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isFavorite={favoriteIds.has(normalizeId(course.id))}
              progress={Number(progressById?.[course.id] || 0)}
              onSelect={onSelectCourse}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">Для этой категории курсы пока не добавлены.</div>
      )}
    </section>
  );
}

RelatedCourses.propTypes = {
  book: PropTypes.object.isRequired,
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
  favoriteCourseIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  progressById: PropTypes.object,
  onSelectCourse: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func,
};

export default memo(RelatedCourses);
