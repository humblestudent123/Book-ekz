import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import App from './app/App'; // <-- твоя библиотека со всеми стилями

export default function RootRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/library/*" element={<App />} /> {/* App.jsx рендерится здесь */}
    </Routes>
  );
}