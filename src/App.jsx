import React, { useState, useMemo } from "react";
import "./App.css";

// ===== Пример данных =====
const SAMPLE_BOOKS = [
  {
    id: 1,
    title: "The Silent Garden",
    author: "A. Ivanov",
    year: 2019,
    genres: ["Fiction", "Mystery"],
    tags: ["garden", "mystery", "family"],
    description:
      "A family returns to the ancestral garden and finds long-buried secrets. Slow-burn mystery with emotional stakes.",
  },
  {
    id: 2,
    title: "Frontend Handbook",
    author: "J. Developer",
    year: 2022,
    genres: ["Non-fiction", "Programming"],
    tags: ["react", "javascript", "web"],
    description:
      "Practical guide to modern frontend development with examples and exercises.",
  },
  {
    id: 3,
    title: "Midnight on the Lighthouse",
    author: "S. Petrova",
    year: 2016,
    genres: ["Fiction", "Thriller"],
    tags: ["lighthouse", "sea", "thriller"],
    description:
      "A tense coastal thriller where the past and present collide.",
  },
  {
    id: 4,
    title: "Learning Algorithms",
    author: "A. Smirnov",
    year: 2021,
    genres: ["Non-fiction", "Programming"],
    tags: ["ml", "algorithms", "python"],
    description:
      "Clear explanations of classic algorithms and practical machine learning recipes.",
  },
  {
    id: 5,
    title: "Garden of Echoes",
    author: "A. Ivanov",
    year: 2020,
    genres: ["Fiction", "Drama"],
    tags: ["garden", "memory", "family"],
    description:
      "Interlinked stories about memory and the places that keep them.",
  },
];

// ===== Утилиты (рекомендации) =====
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
    scores.push({
      id: b.id,
      score: cosineSim(baseVec, vectors.get(b.id)),
    });
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

  const genres = useMemo(() => {
    const setG = new Set();
    books.forEach((b) => b.genres.forEach((g) => setG.add(g)));
    return ["Все", ...Array.from(setG)];
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (genreFilter !== "Все" && !b.genres.includes(genreFilter))
        return false;

      if (!q) return true;

      const hay =
        b.title +
        " " +
        b.author +
        " " +
        b.tags.join(" ") +
        " " +
        b.description;

      return hay.toLowerCase().includes(q);
    });
  }, [books, query, genreFilter]);

  const recommendations = useMemo(() => {
    if (!selected) return [];
    const recIds = computeRecommendations(selected.id, books, 4);
    return recIds.map((id) => books.find((b) => b.id === id)).filter(Boolean);
  }, [selected, books]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1 className="header-title">Books — интерфейс и рекомендации</h1>
        <SearchBar query={query} setQuery={setQuery} />
      </header>

      {/* Main grid */}
      <div className="main-grid">
        {/* Left */}
        <section>
          <div className="filters">
            <label>Жанр:</label>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              {genres.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            <div style={{ marginLeft: "auto", opacity: 0.7 }}>
              Найдено: {filtered.length}
            </div>
          </div>

          <div className="books-grid">
            {filtered.map((b) => (
              <BookCard key={b.id} book={b} onSelect={setSelected} />
            ))}
          </div>
        </section>

        {/* Right — details */}
        <aside className="sidebar">
          {selected ? (
            <>
              <h2>{selected.title}</h2>
              <div className="meta">
                {selected.author} · {selected.year}
              </div>

              <div className="description">{selected.description}</div>

              {/* Recommendations */}
              <div className="rec-block">
                <h3>Рекомендации</h3>

                {recommendations.length === 0 ? (
                  <p style={{ opacity: 0.7 }}>Нет похожих книг.</p>
                ) : (
                  recommendations.map((r) => (
                    <div
                      key={r.id}
                      className="rec-item"
                      onClick={() => setSelected(r)}
                    >
                      <div className="rec-item-title">{r.title}</div>
                      <div className="rec-item-author">{r.author}</div>
                    </div>
                  ))
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
        Подсказки: подключите реальное API, добавьте метрики популярности и
        поведенческие данные для улучшения рекомендаций.
      </footer>
    </div>
  );
}
