import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import '../App.css';

const BookPage = lazy(() => import('../pages/BookPage/BookPage'));
const Library = lazy(() => import('../pages/Library/Library'));
const StaticPage = lazy(() => import('../pages/StaticPage/StaticPage'));

function RouteFallback() {
  return (
    <div className="route-fallback" aria-live="polite">
      Загрузка...
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Library />} />
          <Route path="book/:id" element={<BookPage />} />
          <Route path="about" element={<StaticPage pageKey="about" />} />
          <Route path="help" element={<StaticPage pageKey="help" />} />
          <Route path="docs" element={<StaticPage pageKey="docs" />} />
          <Route path="pricing" element={<StaticPage pageKey="pricing" />} />
          <Route path="privacy" element={<StaticPage pageKey="privacy" />} />
          <Route path="dmca" element={<StaticPage pageKey="dmca" />} />
          <Route path="publish" element={<StaticPage pageKey="publish" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
