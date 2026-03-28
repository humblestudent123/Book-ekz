import React from 'react';
import { useReader } from './useReader';
import './reader.css';

export const Reader = ({ book }) => {
  const {
    containerRef,
    progress,
    settings,
    updateSettings,
    handleScroll,
    minutesLeft,
  } = useReader(book.id, book.text);

  return (
    <div className={`reader ${settings.theme}`}>
      
      {/* 🔝 Панель */}
      <div className="reader-header">
        <span>{progress.toFixed(0)}%</span>
        <span>Осталось ~{minutesLeft} мин</span>
      </div>

      {/* 📖 Текст */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="reader-content"
        style={{
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
        }}
      >
        {book.text}
      </div>

      {/* ⚙️ Настройки */}
      <div className="reader-controls">
        <button onClick={() => updateSettings({ fontSize: settings.fontSize + 2 })}>
          A+
        </button>
        <button onClick={() => updateSettings({ fontSize: settings.fontSize - 2 })}>
          A-
        </button>

        <button onClick={() => updateSettings({ theme: 'dark' })}>
          Dark
        </button>
        <button onClick={() => updateSettings({ theme: 'light' })}>
          Light
        </button>
        <button onClick={() => updateSettings({ theme: 'sepia' })}>
          Sepia
        </button>
      </div>
    </div>
  );
};