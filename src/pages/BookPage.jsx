import { useParams, useNavigate } from 'react-router-dom';
import booksCatalog from '../books.json';
import './BookPage.css';

export default function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = booksCatalog.find((b) => String(b.id) === id);

  if (!book) {
    return <div className="book-page">Книга не найдена</div>;
  }

  return (
    <div className="book-page">

      <div className="book-bg" style={{ backgroundImage: `url(${book.cover})` }} />

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="book-layout">

        {/* ОБЛОЖКА */}
        <div className="book-cover">
          <img src={book.cover} alt={book.title} />
        </div>

        {/* ИНФА */}
        <div className="book-info">
          <h1>{book.title}</h1>
          <h3>{book.author}</h3>

          {/* МЕТА */}
          <div className="book-meta">
            <span>{book.year || '—'} год</span>
            <span>{book.pages || '—'} стр.</span>
          </div>

          {/* ЖАНРЫ */}
          <div className="book-genres">
            {(book.genres || []).map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>

          {/* ОПИСАНИЕ */}
          <p className="book-description">
            {book.description || "Описание отсутствует"}
          </p>

          {/* КНОПКИ */}
          <div className="book-actions">
            <button className="read-btn">
              Читать
            </button>

            <button className="secondary-btn">
              В избранное
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}