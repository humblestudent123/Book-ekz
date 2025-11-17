import React, { useState, useMemo, useRef, useEffect } from "react";
import "./App.css";

// ===== Пример данных =====
const SAMPLE_BOOKS = [
  {
    id: 1,
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    year: 1866,
    genres: ["Роман", "Криминальный жанр", "Психологический реализм"],
    tags: ["Психология", "Философия", "Нигилизм"],
    description:
      "Бедный студент Раскольников убивает старуху-процентщицу, чтобы проверить свою теорию о «праве сильной личности», но муки совести разрушают его.",
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
  },
  {
    id: 3,
    title: "Улисс",
    author: "Джеймс Джойс",
    year: 1922,
    genres: ["Модернизм", "Роман (поток сознания)"],
    tags: ["Модернизм", "ЭпопеяОдногоДня"],
    description:
      "Монументальное описание одного дня из жизни дублинца Леопольда Блума.",
  },
  {
    id: 4,
    title: "Маленький принц",
    author: "Антуан де Сент-Экзюпери",
    year: 1943,
    genres: ["Философская сказка", "Повесть-притча"],
    tags: ["ФилософскаяСказка", "Дружба", "ДетствоИВзрослость"],
    description:
      "Мальчик-принц с астероида учит лётчика видеть сердцем.",
  },
  {
    id: 5,
    title: "Сто лет одиночества",
    author: "Габриэль Гарсиа Маркес",
    year: 1967,
    genres: ["Магический реализм", "Семейная сага"],
    tags: ["СемейнаяСага", "МагическийРеализм", "Одиночество"],
    description:
      "История магического и трагического рода Буэндиа в вымышленном городе Макондо.",
  },
  {
    id: 6,
    title: "Сто",
    author: "Бро",
    year: 2000,
    genres: ["Магический реализм", "Семейная сага"],
    tags: ["СемейнаяСага", "МагическийРеализм", "Одиночество"],
    description:
      "История магического и трагического рода Буэндиа в вымышленном городе Макондо.",
  },
  {
    id: 7,
    title: "Двести",
    author: "Бро2",
    year: 2123,
    genres: ["Магический реализм", "Семейная сага"],
    tags: ["СемейнаяСага", "МагическийРеализм", "Одиночество"],
    description:
      "История магического и трагического рода Буэндиа в вымышленном городе Макондо.",
  },
  {
    id: 8,
    title: "Триста",
    author: "НЕРГ",
    year: 2077,
    genres: ["Магический реализм", "Семейная сага"],
    tags: ["СемейнаяСага", "МагическийРеализм", "Одиночество"],
    description:
      "История магического и трагического рода Буэндиа в вымышленном городе Макондо.",
  },
  {
    id: 9,
    title: "Тракторист",
    author: "Владимир Вовчик",
    year: 1963,
    genres: ["Магический реализм", "Семейная сага"],
    tags: ["СемейнаяСага", "МагическийРеализм", "Одиночество"],
    description:
      "История магического и трагического рода Буэндиа в вымышленном городе Макондо.",
  },
  {
    id: 10,
    title: "Тракторист",
    author: "Владимир Вовчик",
    year: 1963,
    genres: ["Магический реализм", "Семейная сага"],
    tags: ["СемейнаяСага", "МагическийРеализм", "Одиночество"],
    description:
      "История магического и трагического рода Буэндиа в вымышленном городе Макондо.",
  },
  
];

// ===== Утилиты =====
function tokenizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function buildVocabulary(books) {
  const vocab = new Map();
  let idx = 0;
  books.forEach((b) => {
    const tokens = [
      ...tokenizeText(b.title),
      ...tokenizeText(b.description),
      ...b.tags.map((t) => t.toLowerCase()),
      ...b.genres.map((g) => g.toLowerCase()),
      ...tokenizeText(b.author),
    ];
    tokens.forEach((t) => {
      if (!vocab.has(t)) vocab.set(t, idx++);
    });
  });
  return vocab;
}

function vectorizeBook(book, vocab) {
  const vec = new Array(vocab.size).fill(0);
  const tokens = [
    ...tokenizeText(book.title),
    ...tokenizeText(book.description),
    ...book.tags.map((t) => t.toLowerCase()),
    ...book.genres.map((g) => g.toLowerCase()),
    ...tokenizeText(book.author),
  ];
  tokens.forEach((t) => {
    const i = vocab.get(t);
    if (i !== undefined) vec[i] += 1;
  });
  return vec;
}

function dot(a, b) {
  return a.reduce((s, x, i) => s + x * b[i], 0);
}

function norm(a) {
  return Math.sqrt(dot(a, a));
}

function cosineSim(a, b) {
  const na = norm(a);
  const nb = norm(b);
  if (na === 0 || nb === 0) return 0;
  return dot(a, b) / (na * nb);
}

function computeRecommendations(baseId, books, topK = 4) {
  const vocab = buildVocabulary(books);
  const vectors = new Map();
  books.forEach((b) => vectors.set(b.id, vectorizeBook(b, vocab)));

  const baseVec = vectors.get(baseId);
  if (!baseVec) return [];

  const scores = [];
  books.forEach((b) => {
    if (b.id === baseId) return;
    scores.push({ id: b.id, score: cosineSim(baseVec, vectors.get(b.id)) });
  });

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, topK).map((s) => s.id);
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

  const visibleBooks = useMemo(() => filtered, [filtered]);

  // Скролл для подгрузки
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

  // Список жанров
  const genres = useMemo(() => {
    const setG = new Set();
    books.forEach((b) => b.genres.forEach((g) => setG.add(g)));
    return ["Все", ...Array.from(setG)];
  }, [books]);

  // Рекомендации
  const recommendations = useMemo(() => {
    if (!selected) return [];
    const recIds = computeRecommendations(selected.id, books, 4);
    return recIds.map((id) => books.find((b) => b.id === id)).filter(Boolean);
  }, [selected, books]);

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
                  <div
                    key={r.id}
                    className="rec-item"
                    onClick={() => setSelected(r)}
                  >
                    <div className="rec-item-title">{r.title}</div>
                    <div className="rec-item-author">{r.author}</div>
                  </div>
                ))}
              </div>
            )}
          </div>


              <button className="reset-btn" onClick={() => setSelected(null)}>
                Сбросить
              </button>
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
    </div>
  );
}
