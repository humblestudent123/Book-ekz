import React, { useState, useMemo, useRef, useEffect } from "react";
import "./App.css";

// ===== Пример данных =====
const SAMPLE_BOOKS = [
  // ... (оставь свои книги как было)
  // Я оставил данные из твоего предыдущего сообщения:
  {
    id: 1,
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    year: 1866,
    genres: ["Роман", "Криминальный жанр", "Психологический реализм"],
    tags: ["Психология", "Философия", "Нигилизм"],
    description:
      "Бедный студент Раскольников убивает старуху-процентщицу, чтобы проверить свою теорию о «праве сильной личности», но муки совести разрушают его.",
    content:
      "Это пример текста книги. Здесь будет полноценное содержимое... " +
      "Повтори и расширяй по желанию. ".repeat(80),
  },
  {
    id: 2,
    title: "1984",
    author: "Джордж Оруэлл",
    year: 1949,
    genres: ["Антиутопия", "Политическая сатира"],
    tags: ["Тоталитаризм", "Пропаганда", "Контроль"],
    description:
      "Мрачное будущее под властью тоталитарного режима, где «Большой Брат» всегда наблюдает.",
    content: "Пример содержимого книги 1984. ".repeat(60),
  },
  // добавь остальные как в твоём файле...
];

// ===== Утилиты =====
function paginateText(text = "", approxCharsPerPage = 1200) {
  // Разбиваем текст по словам, формируем страницы по приблизительной длине,
  // но не ломаем слова/предложения слишком грубо.
  const words = text.split(/\s+/);
  const pages = [];
  let cur = "";

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    // если добавление слова не превысит лимит — добавляем
    if ((cur + " " + w).length <= approxCharsPerPage || cur.length === 0) {
      cur = (cur + " " + w).trim();
    } else {
      pages.push(cur);
      cur = w;
    }
  }
  if (cur.length) pages.push(cur);
  // если слишком мало страниц — всё равно вернуть минимум 1
  return pages.length ? pages : [text];
}

function computeRecommendations(baseId, books, topK = 4) {
  // заглушка — в реальности у тебя уже есть функция, можно её использовать
  // здесь просто пустой массив (ты уже используешь реальную функцию выше)
  return [];
}

// ===== Компоненты =====
function BookCard({ book, onSelect }) {
  return (
    <div className="book-card" onClick={() => onSelect(book)}>
      <h3>{book.title}</h3>
      <p>
        {book.author} · {book.year}
      </p>
      <div style={{ marginTop: "10px" }}>
        {book.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  return (
    <div className="search-bar">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск по названию, автору или тегам..."
      />
    </div>
  );
}

// ===== Основной компонент =====
export default function App() {
  const [books] = useState(SAMPLE_BOOKS);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [genreFilter, setGenreFilter] = useState("Все");
  const [showCount, setShowCount] = useState(6);

  // Reader states
  const [isReading, setIsReading] = useState(false);
  const [readingPage, setReadingPage] = useState(0);
  const [pages, setPages] = useState([]);

  const scrollRef = useRef(null);

  // Фильтрация книг
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (genreFilter !== "Все" && !b.genres.includes(genreFilter)) return false;
      if (!q) return true;
      const hay = b.title + " " + b.author + " " + b.tags.join(" ") + " " + b.description;
      return hay.toLowerCase().includes(q);
    });
  }, [books, query, genreFilter]);

  const visibleBooks = useMemo(() => filtered.slice(0, Math.max(showCount, 6)), [filtered, showCount]);

  // Скролл для подгрузки (левый блок)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
        setShowCount((prev) => Math.min(prev + 6, filtered.length));
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [filtered.length]);

  // Пересоздаём страницы при открытии читалки (или при смене selected)
  useEffect(() => {
    if (isReading && selected) {
      const raw = selected.content || selected.description || "";
      const p = paginateText(raw, 1000); // около 1000 символов на страницу — можно изменить
      setPages(p);
      setReadingPage(0);
    }
  }, [isReading, selected]);

  // Управление клавишами в читалке
  useEffect(() => {
    if (!isReading) return;
    function onKey(e) {
      if (e.key === "Escape") {
        setIsReading(false);
      } else if (e.key === "ArrowRight") {
        setReadingPage((p) => Math.min(p + 1, pages.length - 1));
      } else if (e.key === "ArrowLeft") {
        setReadingPage((p) => Math.max(p - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isReading, pages.length]);

  // Список жанров
  const genres = useMemo(() => {
    const setG = new Set();
    books.forEach((b) => b.genres.forEach((g) => setG.add(g)));
    return ["Все", ...Array.from(setG)];
  }, [books]);

  // Рекомендации (твой реальный код можно тут оставить)
  const recommendations = useMemo(() => {
    if (!selected) return [];
    // если у тебя есть computeRecommendations выше — используй её
    // я оставляю заглушку: будут книги с ближайшими id (настроить можно)
    const recs = books.filter((b) => b.id !== selected.id).slice(0, 4);
    return recs;
  }, [selected, books]);

  // Reader actions
  const openReader = () => {
    if (!selected) return;
    setIsReading(true);
  };
  const closeReader = () => {
    setIsReading(false);
  };
  const nextPage = () => setReadingPage((p) => Math.min(p + 1, pages.length - 1));
  const prevPage = () => setReadingPage((p) => Math.max(p - 1, 0));

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header-title">Books — интерфейс и рекомендации</h1>
        <SearchBar query={query} setQuery={setQuery} />
      </header>

      <div className="main-grid">
        <section>
          <div className="filters">
            <label>Жанр:</label>
            <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
              {genres.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            <div style={{ marginLeft: "auto", opacity: 0.7 }}>Найдено: {filtered.length}</div>
          </div>

          <div className="books-scroll" ref={scrollRef}>
            <div className="books-grid">
              {visibleBooks.map((book) => (
                <BookCard key={book.id} book={book} onSelect={setSelected} />
              ))}
            </div>
          </div>
        </section>

        <aside className="sidebar">
          {selected ? (
            <>
              <h2>{selected.title}</h2>
              <div className="meta">
                {selected.author} · {selected.year}
              </div>
              <div className="description">{selected.description}</div>

              <div className="rec-block">
                <h3>Рекомендации</h3>

                {recommendations.length === 0 ? (
                  <p style={{ opacity: 0.7 }}>Нет похожих книг.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {recommendations.map((r) => (
                      <div key={r.id} className="rec-item" onClick={() => setSelected(r)}>
                        <div className="rec-item-title">{r.title}</div>
                        <div className="rec-item-author">{r.author}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button className="reset-btn" onClick={() => setSelected(null)}>
                  Сбросить
                </button>

                <button
                  className="reset-btn"
                  style={{ background: "#222", border: "1px solid #555" }}
                  onClick={openReader}
                >
                  Читать
                </button>
              </div>
            </>
          ) : (
            <div style={{ opacity: 0.7, fontSize: "14px" }}>
              Выберите книгу, чтобы увидеть детали и рекомендации.
            </div>
          )}
        </aside>
      </div>

      <footer className="footer">
        Подсказки: подключите реальное API, добавьте метрики популярности и поведенческие данные.
      </footer>

      {/* ===== Reader Modal (не fullscreen, тёмная тема) ===== */}
      {isReading && selected && (
        <div className="reader-overlay" onClick={closeReader}>
          <div
            className="reader-modal black-theme"
            onClick={(e) => e.stopPropagation()} // не закрываем при клике по модалке
            role="dialog"
            aria-modal="true"
          >
            <button className="reader-close" onClick={closeReader} aria-label="Закрыть">
              ✕
            </button>

            <div className="reader-header">
              <div>
                <strong>{selected.title}</strong>
                <div style={{ opacity: 0.8, fontSize: 13 }}>
                  {selected.author} · {selected.year}
                </div>
              </div>
            </div>

            <div className="reader-content">
              {pages.length > 0 ? (
                <div className="reader-page">{pages[readingPage]}</div>
              ) : (
                <div className="reader-page">Нет содержания для чтения.</div>
              )}
            </div>

            <div className="reader-controls">
              <button onClick={prevPage} disabled={readingPage === 0}>
                ← Предыдущая
              </button>

              <div className="reader-progress">
                Стр. {Math.min(readingPage + 1, pages.length)} / {pages.length || 1}
              </div>

              <button onClick={nextPage} disabled={readingPage >= pages.length - 1}>
                Следующая →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
