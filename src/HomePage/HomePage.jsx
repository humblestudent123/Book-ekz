import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.scss';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-page__content">
        <img 
          className="home-page__logo" 
          src="../logo.png" 
          alt="ReadNext" 
        />

        <div className="home-page__buttons">
          <button
            className="home-page__button home-page__button--primary"
            onClick={() => navigate('/library')}
          >
            Перейти
          </button>

        <div className="home-page__buttons">
          <a 
            href="https://github.com/humblestudent123/Book-ekz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="home-page__button home-page__button--secondary"
          >
            GitHub
          </a>
        </div>

        </div>
      </div>
    </div>
  );
}