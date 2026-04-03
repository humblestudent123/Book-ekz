import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.scss';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>Добро пожаловать в библиотеку</h1>
      <button onClick={() => navigate('/library')}>Перейти</button>
    </div>
  );
}