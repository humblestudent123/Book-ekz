import { useState, useEffect, useMemo, useCallback } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import BookList from '../../widgets/BookList/BookList';
import ReaderModal from '../../widgets/Reader/ReaderModal';
import { SAMPLE_BOOKS as booksCatalog } from '../../data';
import '../../App.css';
import logo from '../../assets/ReadNext-logo.png';
import { useDebounce } from '../../hooks/useDebounce';
import { loadBookText } from '../../utils/loadBook';
import { useNavigate } from 'react-router-dom';
import { GENRE_LABELS } from '../../genres'; 



const PAGE_CHARS = 1000;
const ALL_GENRE = 'Все';
const DEFAULT_VISIBLE_COUNT = '';




const paginateText = (text, approxCharsPerPage = PAGE_CHARS) => {
  if (!text) return [''];

  
  const words = text.split(/\s+/);
  const pages = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).length <= approxCharsPerPage || current.length === 0) {
      current = `${current} ${word}`.trim();
    } else {
      pages.push(current);
      current = word;
    }
  }

  if (current) pages.push(current);

  return pages.length ? pages : [text];
};

const getPreferredGenres = (books, readingPages, openedBooks) => {
  const scoreByGenre = new Map();

  books.forEach((book) => {
    const progressScore = Number(readingPages[book.id] || 0);
    const openedScore = Number(openedBooks[book.id] || 0) * 3;
    const totalScore = progressScore + openedScore;

    book.genres.forEach((genre) => {
      scoreByGenre.set(genre, (scoreByGenre.get(genre) || 0) + totalScore);
    });
  });

  return Array.from(scoreByGenre.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);
};

const getPopularityScore = (book, openedBooks, readingPages) => {
  const opens = Number(openedBooks[book.id] || 0) * 100;
  const progress = Number(readingPages[book.id] || 0) * 10;
  const metadata = (book.tags?.length || 0) * 4 + (book.genres?.length || 0) * 3;
  return opens + progress + metadata + Number(book.year || 0) / 1000;
};

export default function Library() {
  const books = booksCatalog;
  
  const navigate = useNavigate();
  const [currentReadingBook, setCurrentReadingBook] = useState(null);
  const [favoriteBooks, setFavoriteBooks] = useState(() => {
  const saved = localStorage.getItem('favorite-books');
  return saved ? JSON.parse(saved) : [];
  });
  const [query, setQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState(ALL_GENRE);
  const [visibleCountInput] = useState(DEFAULT_VISIBLE_COUNT);
  const [bookPages, setBookPages] = useState({});
  const [readingPages, setReadingPages] = useState(() => {
    const saved = localStorage.getItem('reading-pages');
    return saved ? JSON.parse(saved) : {};
  });
  const [openedBooks, setOpenedBooks] = useState(() => {
    const saved = localStorage.getItem('opened-books');
    return saved ? JSON.parse(saved) : {};
  });

  const debouncedQuery = useDebounce(query, 300);



  

const filteredBooks = useMemo(() => {
  const q = debouncedQuery.trim().toLowerCase();

  return books.filter((book) => {
    const matchGenre =
      genreFilter === ALL_GENRE || book.genres.includes(genreFilter);

    const matchQuery =
      !q ||
      book.title?.toLowerCase().includes(q) ||
      book.author?.toLowerCase().includes(q) ||
      (book.tags ?? []).join(' ').toLowerCase().includes(q);

    return matchGenre && matchQuery;
  });
}, [books, debouncedQuery, genreFilter]);




const searchableBooks = useMemo(() => {
  const q = debouncedQuery.trim().toLowerCase();

  return books.filter((book) => {
    const title = book.title?.toLowerCase() || '';
    const author = book.author?.toLowerCase() || '';
    const tags = (Array.isArray(book.tags) ? book.tags : [])
      .join(' ')
      .toLowerCase();

    const matchQuery =
      !q ||
      title.includes(q) ||
      author.includes(q) ||
      tags.includes(q);

    return matchQuery;
  });
}, [books, debouncedQuery]);


books.forEach(b => {
  console.log('BOOK CHECK:', b.id, b.title, Array.isArray(b.genres));
});


















  const visibleBooks = useMemo(() => {
    const parsed = Number(visibleCountInput);
    if (!visibleCountInput || Number.isNaN(parsed) || parsed <= 0) {
      return filteredBooks;
    }

    return filteredBooks.slice(0, parsed);
  }, [filteredBooks, visibleCountInput]);

  const genres = useMemo(() => {
    const setG = new Set();
    books.forEach((book) => book.genres.forEach((genre) => setG.add(genre)));
    return [ALL_GENRE, ...Array.from(setG)];
  }, [books]);

  const preferredGenres = useMemo(
    () => getPreferredGenres(books, readingPages, openedBooks),
    [books, readingPages, openedBooks]
  );


const newBooks = useMemo(() => {
  return books.filter((b) => b.isNew);
}, [books]);



const recommendedBooks = useMemo(() => {
  return books.filter((b) => b.featured);
}, [books]);

const popularBooks = useMemo(() => {
  return books.filter((b) => b.isPopular);
}, [books]);


const favoriteBooksList = useMemo(() => {
  return books.filter((book) =>
    favoriteBooks.includes(book.id)
  );
}, [books, favoriteBooks]);



  const readingPage = currentReadingBook ? (readingPages[currentReadingBook.id] ?? 0) : 0;

  const pages = useMemo(() => {
    return currentReadingBook
      ? (bookPages[currentReadingBook.id] ?? [])
      : [];
  }, [currentReadingBook, bookPages]);

  const nextPage = useCallback(() => {
    if (!currentReadingBook) return;

    const bookId = currentReadingBook.id;
    const max = Math.max((pages?.length ?? 1) - 1, 0);

    setReadingPages((prev) => ({
      ...prev,
      [bookId]: Math.min((prev[bookId] ?? 0) + 1, max)
    }));
  }, [currentReadingBook, pages.length]);

  const prevPage = useCallback(() => {
    if (!currentReadingBook) return;

    const bookId = currentReadingBook.id;

    setReadingPages((prev) => ({
      ...prev,
      [bookId]: Math.max((prev[bookId] ?? 0) - 1, 0)
    }));
  }, [currentReadingBook]);

  const goToPage = useCallback((pageNum) => {
    if (!currentReadingBook) return;
    const clamped = Math.min(Math.max(pageNum, 0), pages.length - 1);
    setReadingPages((prev) => ({ ...prev, [currentReadingBook.id]: clamped }));
  }, [currentReadingBook, pages.length]);


  
  const openReader = useCallback(async (book) => {
    if (!book) return;

    let content = book.content;

    try {
      if (typeof content === 'string' && content.endsWith('.txt')) {
        content = await loadBookText(content);
      }
    } catch {
      content = 'Ошибка загрузки книги';
    }

    const paginated = paginateText(content, PAGE_CHARS);

    setBookPages((prev) => ({
      ...prev,
      [book.id]: paginated
    }));

    setReadingPages((prev) => ({
      ...prev,
      [book.id]: prev[book.id] ?? 0
    }));

    setOpenedBooks((prev) => ({
      ...prev,
      [book.id]: (prev[book.id] || 0) + 1
    }));

    setCurrentReadingBook({ ...book, content });
  }, []);





  const toggleFavorite = (bookId) => {
  setFavoriteBooks((prev) => {
    if (prev.includes(bookId)) {
      return prev.filter((id) => id !== bookId);
    }

    return [...prev, bookId];
  });
};




  useEffect(() => {
  console.log("ALL BOOKS:", books.length);
}, []);

useEffect(() => {
  console.log("FILTERED:", filteredBooks.length);
}, [filteredBooks]);

console.log(
  books.map(b => ({
    id: b.id,
    title: b.title,
    genres: b.genres
  }))
);






  useEffect(() => {
    const onKey = (event) => {
      switch (event.key) {
        case 'Escape':
          setCurrentReadingBook(null);
          setCurrentReadingBook(null);
          break;
        case 'ArrowRight':
          nextPage();
          break;
        case 'ArrowLeft':
          prevPage();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentReadingBook, pages.length]);

  useEffect(() => {
    localStorage.setItem('reading-pages', JSON.stringify(readingPages));
  }, [readingPages]);

  useEffect(() => {
    localStorage.setItem('opened-books', JSON.stringify(openedBooks));
  }, [openedBooks]);


  useEffect(() => {
  localStorage.setItem(
    'favorite-books',
    JSON.stringify(favoriteBooks)
  );
}, [favoriteBooks]);



const toolbar = (
  <div className="catalog-toolbar">
    <label className="toolbar-field">
      <span>Жанр</span>
      <select value={genreFilter} onChange={(event) => setGenreFilter(event.target.value)}>
        {genres.map((genreKey) => {
          if (genreKey === ALL_GENRE) {
            return (
              <option key={genreKey} value={genreKey}>
                {ALL_GENRE}
              </option>
            );
          }

   
          const label = GENRE_LABELS[genreKey] || genreKey;
          return (
            <option key={genreKey} value={genreKey}>
              {label}
            </option>
          );
        })}
      </select>
    </label>
  </div>
);

const isSearching = debouncedQuery.trim().length > 0;


  return (
    <div className="library-container">
      <header className="header">
        <div className="header-bar">
          <div className="logo-block">
            <img src={logo} alt="ReadNext Logo" className="logo" />
          </div>

          <SearchBar query={query} setQuery={setQuery} />
        </div>

        <section className="hero-banner">
          <div className="hero-banner__content">
            <div className="hero-banner__text">
              <span className="hero-banner__eyebrow">Твоя домашняя читалка</span>
              <p>
                Подборки теперь разбиты на блоки: персональные рекомендации, новинки,
                популярное и полный каталог.
              </p>
            </div>
          </div>
        </section>
      </header>

<main className="main-grid">

  {isSearching && (
    <BookList
      title={debouncedQuery.trim() ? "Результаты поиска" : "Весь каталог"}
      books={filteredBooks}
      onSelect={(book) => navigate(`/book/${book.id}`)}
      action={toolbar}
    />
  )}

  {!isSearching && (
    <>
      <BookList
        title="Рекомендации"
        books={recommendedBooks}
        onSelect={(book) => navigate(`/book/${book.id}`)}
      />

      <BookList
        title="Избранное"
        books={favoriteBooksList}
        onSelect={(book) => navigate(`/book/${book.id}`)}
        emptyMessage="Ты ещё не добавил книги в избранное."
      />

      <BookList
        title="Новинки"
        books={newBooks}
        onSelect={(book) => navigate(`/book/${book.id}`)}
      />

      <BookList
        title="Популярное"
        books={popularBooks}
        onSelect={(book) => navigate(`/book/${book.id}`)}
      />


      <BookList
        title="Весь каталог"
        books={filteredBooks}
        onSelect={(book) => navigate(`/book/${book.id}`)}
        action={toolbar}
      />
    </>
  )}

</main>

      {currentReadingBook && (
        <ReaderModal
          book={currentReadingBook}
          pages={pages}
          pageIndex={readingPage}
          onClose={() => setCurrentReadingBook(null)}
          nextPage={nextPage}
          prevPage={prevPage}
          goToPage={goToPage}
        />
      )}
    </div>
  );
}
