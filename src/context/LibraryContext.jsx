import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  moveIdToFront,
  readJsonFromStorage,
  STORAGE_KEYS,
  toggleId,
  writeJsonToStorage,
} from '../utils/recommendations';

const LibraryContext = createContext(null);
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

const usePersistentState = (key, fallback) => {
  const [value, setValue] = useState(() => readJsonFromStorage(key, fallback));

  useEffect(() => {
    writeJsonToStorage(key, value);
  }, [key, value]);

  useEffect(() => {
    const syncValue = () => setValue(readJsonFromStorage(key, fallback));

    window.addEventListener('storage', syncValue);
    window.addEventListener('focus', syncValue);

    return () => {
      window.removeEventListener('storage', syncValue);
      window.removeEventListener('focus', syncValue);
    };
  }, [fallback, key]);

  return [value, setValue];
};

export function LibraryProvider({ children }) {
  const [favoriteBookIds, setFavoriteBookIds] = usePersistentState(
    STORAGE_KEYS.favoriteBooks,
    EMPTY_ARRAY
  );
  const [favoriteCourseIds, setFavoriteCourseIds] = usePersistentState(
    STORAGE_KEYS.favoriteCourses,
    EMPTY_ARRAY
  );
  const [readingPages, setReadingPages] = usePersistentState(
    STORAGE_KEYS.readingPages,
    EMPTY_OBJECT
  );
  const [courseProgress, setCourseProgress] = usePersistentState(
    STORAGE_KEYS.courseProgress,
    EMPTY_OBJECT
  );
  const [openedBooks, setOpenedBooks] = usePersistentState(
    STORAGE_KEYS.openedBooks,
    EMPTY_OBJECT
  );
  const [recentBookIds, setRecentBookIds] = usePersistentState(
    STORAGE_KEYS.recentBooks,
    EMPTY_ARRAY
  );
  const [recentCourseIds, setRecentCourseIds] = usePersistentState(
    STORAGE_KEYS.recentCourses,
    EMPTY_ARRAY
  );

  const toggleBookFavorite = useCallback((bookId) => {
    setFavoriteBookIds((prev) => toggleId(prev, bookId));
  }, [setFavoriteBookIds]);

  const toggleCourseFavorite = useCallback((courseId) => {
    setFavoriteCourseIds((prev) => toggleId(prev, courseId));
  }, [setFavoriteCourseIds]);

  const recordBookView = useCallback((bookId) => {
    setRecentBookIds((prev) => moveIdToFront(prev, bookId));
  }, [setRecentBookIds]);

  const recordCourseView = useCallback((courseId) => {
    setRecentCourseIds((prev) => moveIdToFront(prev, courseId));
  }, [setRecentCourseIds]);

  const incrementOpenedBook = useCallback((bookId) => {
    setOpenedBooks((prev) => ({
      ...(prev || {}),
      [bookId]: ((prev || {})[bookId] || 0) + 1,
    }));
  }, [setOpenedBooks]);

  const setCourseLessonProgress = useCallback((courseId, completedLessons) => {
    setCourseProgress((prev) => ({
      ...(prev || {}),
      [courseId]: completedLessons,
    }));
  }, [setCourseProgress]);

  const value = useMemo(
    () => ({
      favoriteBookIds: Array.isArray(favoriteBookIds) ? favoriteBookIds : [],
      favoriteCourseIds: Array.isArray(favoriteCourseIds) ? favoriteCourseIds : [],
      readingPages: readingPages || {},
      setReadingPages,
      courseProgress: courseProgress || {},
      openedBooks: openedBooks || {},
      recentBookIds: Array.isArray(recentBookIds) ? recentBookIds : [],
      recentCourseIds: Array.isArray(recentCourseIds) ? recentCourseIds : [],
      toggleBookFavorite,
      toggleCourseFavorite,
      recordBookView,
      recordCourseView,
      incrementOpenedBook,
      setCourseLessonProgress,
    }),
    [
      courseProgress,
      favoriteBookIds,
      favoriteCourseIds,
      incrementOpenedBook,
      openedBooks,
      readingPages,
      recentBookIds,
      recentCourseIds,
      recordBookView,
      recordCourseView,
      setCourseLessonProgress,
      setReadingPages,
      toggleBookFavorite,
      toggleCourseFavorite,
    ]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

LibraryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLibraryState = () => {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error('useLibraryState must be used inside LibraryProvider');
  }

  return context;
};
