import React from 'react';
import './HomePage.scss';
import heroImage from '../assets/read.png'; // твоя картинка

const HomePage = () => {
  return (
    <div className="home">
      <div className="hero">
        <img src={heroImage} alt="Hero" className="hero-image" />
        <div className="hero-text">
          <h1>ReadNext</h1>
          <p>Познавние начинается с удивления</p>
          <a href="/books" className="btn-primary">Перейти к книгам</a>
        </div>
      </div>

      <section className="features">
        <div className="feature-card">
          <h3>Онлайн библиотека</h3>
          <p>Читай книги прямо в браузере</p>
        </div>
        <div className="feature-card">
          <h3>Добавляй свои книги</h3>
          <p>Управляй контентом через админку</p>
        </div>
        <div className="feature-card">
          <h3>Умный поиск</h3>
          <p>Находи книги по автору, жанру и названию</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;