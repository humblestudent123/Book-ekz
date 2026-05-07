import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import BookCard from '../../entities/book/BookCard';
import CourseCard from '../CourseCard/CourseCard';
import { useLibraryState } from '../../context/LibraryContext';
import {
  getPersonalBookRecommendations,
  getPersonalCourseRecommendations,
  normalizeId,
} from '../../utils/recommendations';
import './PersonalRecommendations.css';

function PersonalRecommendations({ books, courses, onSelectBook, onSelectCourse }) {
  const {
    favoriteBookIds,
    favoriteCourseIds,
    recentBookIds,
    recentCourseIds,
    courseProgress,
    toggleCourseFavorite,
  } = useLibraryState();

  const favoriteCourseSet = useMemo(
    () => new Set((favoriteCourseIds || []).map(normalizeId)),
    [favoriteCourseIds]
  );

  const recommendedCourses = useMemo(
    () =>
      getPersonalCourseRecommendations({
        books,
        courses,
        recentBookIds,
        favoriteBookIds,
        limit: 3,
      }),
    [books, courses, favoriteBookIds, recentBookIds]
  );

  const recommendedBooks = useMemo(
    () =>
      getPersonalBookRecommendations({
        books,
        courses,
        recentCourseIds,
        favoriteBookIds,
        limit: 3,
      }),
    [books, courses, favoriteBookIds, recentCourseIds]
  );

  return (
    <section className="shelf-section personal-recommendations">
      <div className="shelf-section__header">
        <div>
          <h2>Персональные рекомендации</h2>
          <p>Подборка учитывает последние просмотры, избранное и совпадение категорий.</p>
        </div>
      </div>

      <div className="personal-recommendations__grid">
        <div className="personal-recommendations__column">
          <h3>Курсы по вашим книгам</h3>
          {recommendedCourses.length ? (
            <div className="courses-grid courses-grid--compact">
              {recommendedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isFavorite={favoriteCourseSet.has(normalizeId(course.id))}
                  progress={Number(courseProgress?.[course.id] || 0)}
                  onSelect={onSelectCourse}
                  onToggleFavorite={(item) => toggleCourseFavorite(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">Откройте книгу, чтобы получить точнее подборку.</div>
          )}
        </div>

        <div className="personal-recommendations__column">
          <h3>Книги после курсов</h3>
          {recommendedBooks.length ? (
            <div className="books-grid books-grid--compact">
              {recommendedBooks.map((book) => (
                <BookCard key={book.id} book={book} onSelect={onSelectBook} />
              ))}
            </div>
          ) : (
            <div className="empty-state">Откройте курс, чтобы увидеть связанные книги.</div>
          )}
        </div>
      </div>
    </section>
  );
}

PersonalRecommendations.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectBook: PropTypes.func.isRequired,
  onSelectCourse: PropTypes.func.isRequired,
};

export default memo(PersonalRecommendations);
