// AppRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import App from './app/App';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/library" element={<App />} /> {/* App.jsx со всеми стилями */}
    </Routes>
  );
}