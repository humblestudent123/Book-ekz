import { Routes, Route } from 'react-router-dom';
import Library from './Library';
import BookPage from '../pages/BookPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Library />} />
      <Route path="/book/:id" element={<BookPage />} />
    </Routes>
  );
}