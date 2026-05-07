import { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import { LibraryProvider } from '../context/LibraryContext';
import Layout from '../layout/Layout';
import '../App.css';

const BookPage = lazy(() => import('../pages/BookPage/BookPage'));
const CoursePage = lazy(() => import('../pages/CoursePage/CoursePage'));
const CoursesPage = lazy(() => import('../pages/CoursesPage/CoursesPage'));
const Library = lazy(() => import('../pages/Library/Library'));
const StaticPage = lazy(() => import('../pages/StaticPage/StaticPage'));

function RouteFallback() {
  return (
    <div className="route-fallback" aria-live="polite">
      Загрузка...
    </div>
  );
}

export default function App({ root = 'library' }) {
  const isCoursesRoot = root === 'courses';

  return (
    <LibraryProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={isCoursesRoot ? <CoursesPage /> : <Library />} />
            {isCoursesRoot ? (
              <Route path=":id" element={<CoursePage />} />
            ) : (
              <>
                <Route path="book/:id" element={<BookPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="courses/:id" element={<CoursePage />} />
                <Route path="about" element={<StaticPage pageKey="about" />} />
                <Route path="help" element={<StaticPage pageKey="help" />} />
                <Route path="docs" element={<StaticPage pageKey="docs" />} />
                <Route path="pricing" element={<StaticPage pageKey="pricing" />} />
                <Route path="privacy" element={<StaticPage pageKey="privacy" />} />
                <Route path="dmca" element={<StaticPage pageKey="dmca" />} />
                <Route path="publish" element={<StaticPage pageKey="publish" />} />
              </>
            )}
          </Route>
        </Routes>
      </Suspense>
    </LibraryProvider>
  );
}

App.propTypes = {
  root: PropTypes.oneOf(['library', 'courses']),
};
