import { Routes, Route } from 'react-router-dom';
import Library from '../pages/Library/Library';
import BookPage from '../pages/BookPage/BookPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Library />} />
      <Route path="/book/:id" element={<BookPage />} />
    </Routes>
  );
}