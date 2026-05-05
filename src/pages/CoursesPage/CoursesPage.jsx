import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CatalogTabs from '../../components/CatalogTabs/CatalogTabs';
import PersonalRecommendations from '../../components/PersonalRecommendations/PersonalRecommendations';
import SearchBar from '../../components/SearchBar/SearchBar';
import SkeletonGrid from '../../components/SkeletonGrid/SkeletonGrid';
import { useLibraryState } from '../../context/LibraryContext';
import { COURSES as coursesCatalog } from '../../data/courses';
import { SAMPLE_BOOKS as booksCatalog } from '../../data';
import { GENRE_LABELS } from '../../genres';
import { useDebounce } from '../../hooks/useDebounce';
import CourseList from '../../widgets/CourseList/CourseList';
import logo from '../../assets/ReadNext-logo.png';
import './CoursesPage.css';

const getCourseSearchText = (course) =>
  [
    course.title,
    course.author,
    course.duration,
    course.lessons,
    course.rating,
    course.description,
    GENRE_LABELS[course.category] || course.category,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

export default function CoursesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const debouncedQuery = useDebounce(query, 300);

  const {
    favoriteCourseIds,
    courseProgress,
    toggleCourseFavorite,
  } = useLibraryState();

  const courses = coursesCatalog;
  const books = booksCatalog;

  useEffect(() => {
    const timerId = window.setTimeout(() => setIsLoading(false), 180);
    return () => window.clearTimeout(timerId);
  }, []);

  const categoryOptions = useMemo(
    () =>
      Object.entries(GENRE_LABELS).filter(([category]) =>
        courses.some((course) => course.category === category)
      ),
    [courses]
  );

  const openCoursePreview = useCallback(
    (course) => {
      navigate(`/courses/${course.id}`);
    },
    [navigate]
  );

  const openBookPreview = useCallback(
    (book) => {
      navigate(`/library/book/${book.id}`);
    },
    [navigate]
  );

  const handleToggleFavorite = useCallback(
    (course) => {
      toggleCourseFavorite(course.id);
    },
    [toggleCourseFavorite]
  );

  const filteredCourses = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesQuery =
        !normalizedQuery || getCourseSearchText(course).includes(normalizedQuery);
      const matchesCategory =
        selectedCategory === 'all' || course.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [courses, debouncedQuery, selectedCategory]);

  const topCourses = useMemo(
    () => [...courses].sort((a, b) => b.rating - a.rating).slice(0, 6),
    [courses]
  );

  const favoriteCourses = useMemo(() => {
    const favoriteSet = new Set((favoriteCourseIds || []).map(String));
    return courses.filter((course) => favoriteSet.has(String(course.id)));
  }, [courses, favoriteCourseIds]);

  const isFiltering = debouncedQuery.trim().length > 0 || selectedCategory !== 'all';

  return (
    <div className="library-container courses-page">
      <header className="header">
        <div className="header-bar">
          <div className="logo-block">
            <img src={logo} alt="ReadNext" className="logo" />
          </div>
          <CatalogTabs />
          <SearchBar
            query={query}
            setQuery={setQuery}
            placeholder="Курс, тема или автор"
          />
        </div>

        <section className="hero-banner courses-page__hero">
          <div className="hero-banner__content">
            <div className="hero-banner__text">
              <span className="hero-banner__eyebrow">Образовательные траектории</span>
              <h1>Курсы для чтения, практики и роста</h1>
              <p>
                Сохраняйте курсы, отслеживайте прогресс и переходите от книги к обучению
                по той же категории.
              </p>
            </div>
          </div>
        </section>

        <section className="catalog-toolbar" aria-label="Фильтры курсов">
          <label className="toolbar-field" htmlFor="course-category-filter">
            <span>Категория</span>
            <select
              id="course-category-filter"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              data-testid="course-category-filter"
            >
              <option value="all">Все категории</option>
              {categoryOptions.map(([category, label]) => (
                <option key={category} value={category}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </section>
      </header>

      <main className="main-grid">
        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : isFiltering ? (
          <CourseList
            title="Результаты поиска"
            courses={filteredCourses}
            onSelect={openCoursePreview}
            favoriteCourseIds={favoriteCourseIds}
            progressById={courseProgress}
            onToggleFavorite={handleToggleFavorite}
            emptyMessage="По этим условиям курсы не найдены."
          />
        ) : (
          <>
            <PersonalRecommendations
              books={books}
              courses={courses}
              onSelectBook={openBookPreview}
              onSelectCourse={openCoursePreview}
            />

            <CourseList
              title="Лучшие курсы"
              description="Высокий рейтинг и темы, которые хорошо дополняют книжный каталог."
              courses={topCourses}
              onSelect={openCoursePreview}
              favoriteCourseIds={favoriteCourseIds}
              progressById={courseProgress}
              onToggleFavorite={handleToggleFavorite}
            />

            <CourseList
              title="Избранные курсы"
              courses={favoriteCourses}
              onSelect={openCoursePreview}
              favoriteCourseIds={favoriteCourseIds}
              progressById={courseProgress}
              onToggleFavorite={handleToggleFavorite}
              emptyMessage="Вы еще не добавили курсы в избранное."
            />

            <CourseList
              title="Все курсы"
              courses={courses}
              onSelect={openCoursePreview}
              favoriteCourseIds={favoriteCourseIds}
              progressById={courseProgress}
              onToggleFavorite={handleToggleFavorite}
            />
          </>
        )}
      </main>
    </div>
  );
}
