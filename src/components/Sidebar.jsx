import React from 'react';
import PropTypes from 'prop-types';

export default function Sidebar({
  selected,
  setSelected,
  recommendations,
  reset,
  openReader 
}) {
  if (!selected) return (
    <aside className="sidebar">
      <div style={{ opacity: 0.7, fontSize: "14px" }}>
        Выберите книгу, чтобы увидеть детали и рекомендации.
      </div>
    </aside>
  );

  const { title, author, year, description } = selected;

  return (
    <aside className="sidebar">
      <h2>{title}</h2>
      <div className="meta">{author} · {year}</div>
      <div className="description">{description}</div>

      {/* рекомендации */}
      <div className="rec-block">
        <h3>Рекомендации</h3>
        {recommendations.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Нет похожих книг.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recommendations.map(r => (
              <div key={r.id} className="rec-item" onClick={() => setSelected(r)}>
                <div className="rec-item-title">{r.title}</div>
                <div className="rec-item-author">{r.author}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* кнопки */}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button className="reset-btn" onClick={reset}>Сбросить</button>
        {/* исправленная строка */}
        <button
          className="reset-btn"
          style={{ background: '#222', border: '1px solid #555' }}
          onClick={openReader}
        >
          Читать
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  selected: PropTypes.object,
  setSelected: PropTypes.func.isRequired,
  recommendations: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  openReader: PropTypes.func.isRequired,
};
