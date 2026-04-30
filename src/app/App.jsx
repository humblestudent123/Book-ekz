import { Routes, Route } from 'react-router-dom';
import Library from '../pages/Library/Library';
import BookPage from '../pages/BookPage/BookPage';
import Layout from '../layout/Layout';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Library />} />
        <Route path="/book/:id" element={<BookPage />} />
      </Route>
    </Routes>
  );
}