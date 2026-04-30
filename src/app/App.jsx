import { Route, Routes } from 'react-router-dom';
import Layout from '../layout/Layout';
import BookPage from '../pages/BookPage/BookPage';
import Library from '../pages/Library/Library';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Library />} />
        <Route path="book/:id" element={<BookPage />} />
      </Route>
    </Routes>
  );
}
