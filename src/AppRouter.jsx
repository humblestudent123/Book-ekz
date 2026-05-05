import { Route, Routes } from 'react-router-dom';
import App from './app/App';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/library/*" element={<App root="library" />} />
      <Route path="/courses/*" element={<App root="courses" />} />
    </Routes>
  );
}
