import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import App from './app/App';

function LegacyBookRedirect() {
  const { id } = useParams();
  return <Navigate to={`/library/book/${id}`} replace />;
}

function LegacyCourseRedirect() {
  const { id } = useParams();
  return <Navigate to={`/courses/${id}`} replace />;
}

export default function RootRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/library" replace />} />
      <Route path="/library/*" element={<App root="library" />} />
      <Route path="/courses/*" element={<App root="courses" />} />
      <Route path="/book/:id" element={<LegacyBookRedirect />} />
      <Route path="/course/:id" element={<LegacyCourseRedirect />} />
      <Route path="*" element={<Navigate to="/library" replace />} />
    </Routes>
  );
}
