import { Route, Routes } from 'react-router-dom';
import App from './app/App';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/library/*" element={<App />} />
    </Routes>
  );
}
