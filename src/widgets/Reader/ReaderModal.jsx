import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import '../Reader/ReaderModal.css';

const QUOTES_STORAGE_KEY = 'quotes';

const readQuotes = () => {
  try {
    const savedQuotes = localStorage.getItem(QUOTES_STORAGE_KEY);
    return savedQuotes ? JSON.parse(savedQuotes) : {};
  } catch {
    return {};
  }
};

const formatDate = (date) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

export default function ReaderModal({
  book,
  pages,
  pageIndex,
  onClose,
  nextPage,
  prevPage,
  goToPage,
}) {
  const modalRef = useRef(null);
  const safePages = Array.isArray(pages) ? pages : [];
  const safePageIndex = safePages.length
    ? Math.min(Math.max(pageIndex, 0), safePages.length - 1)
    : 0;

  const [inputPage, setInputPage] = useState(String(safePageIndex + 1));
  const [showQuotesList, setShowQuotesList] = useState(false);
  const [selectionText, setSelectionText] = useState('');
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [quotes, setQuotes] = useState(readQuotes);

  const currentBookQuotes = useMemo(() => quotes[book.id] || [], [book.id, quotes]);

  useEffect(() => {
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    setInputPage(String(safePageIndex + 1));
  }, [safePageIndex]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selectedText = window.getSelection()?.toString().trim();

      if (!selectedText) {
        setShowAddBtn(false);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const handleMouseUp = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0 || !modalRef.current) {
      setShowAddBtn(false);
      return;
    }

    const selectedText = selection.toString().trim();

    if (!selectedText) {
      setShowAddBtn(false);
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const modalRect = modalRef.current.getBoundingClientRect();

    setSelectionText(selectedText);
    setBtnPos({
      x: Math.min(rect.right - modalRect.left + 8, modalRect.width - 50),
      y: Math.max(rect.bottom - modalRect.top + 8, 10),
    });
    setShowAddBtn(true);
  };

  const handleAddQuote = () => {
    if (!selectionText) return;

    const newQuote = {
      text: selectionText,
      date: formatDate(new Date()),
      page: safePageIndex + 1,
    };

    setQuotes((prev) => ({
      ...prev,
      [book.id]: [...(prev[book.id] || []), newQuote],
    }));

    setSelectionText('');
    setShowAddBtn(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleDeleteQuote = (quoteIndex) => {
    setQuotes((prev) => ({
      ...prev,
      [book.id]: (prev[book.id] || []).filter((_, index) => index !== quoteIndex),
    }));
  };

  const submitPage = () => {
    const pageNumber = Number(inputPage);

    if (!Number.isFinite(pageNumber) || pageNumber < 1 || pageNumber > safePages.length) {
      setInputPage(String(safePageIndex + 1));
      return;
    }

    goToPage(pageNumber - 1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      submitPage();
    }
  };

  const modal = (
    <div className="reader-overlay" onClick={onClose} data-testid="reader-overlay">
      <div
        ref={modalRef}
        className="reader-modal black-theme"
        data-testid="reader-modal"
        onClick={(event) => event.stopPropagation()}
        onMouseUp={handleMouseUp}
      >
        <button
          className="reader-close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          data-testid="close-reader"
        >
          ×
        </button>

        <div className="reader-header">
          <strong>{book.title}</strong>

          <div className="reader-book-info">
            <div className="reader-book-meta">
              {book.author} · {book.year}
            </div>

            <button
              className="quotes-toggle-btn"
              type="button"
              onClick={() => setShowQuotesList((prev) => !prev)}
            >
              {showQuotesList ? 'Скрыть цитаты' : 'Показать цитаты'}
            </button>
          </div>
        </div>

        <div className="reader-content">
          <div className="reader-page">
            {safePages.length ? safePages[safePageIndex] : 'Нет содержания для чтения.'}
          </div>
        </div>

        <div className="reader-controls">
          <button
            type="button"
            onClick={prevPage}
            disabled={safePageIndex === 0}
            data-testid="prev-page"
          >
            ←
          </button>

          <div className="reader-progress">
            Стр.
            <input
              data-testid="reader-page-input"
              type="number"
              min="1"
              max={Math.max(safePages.length, 1)}
              value={inputPage}
              onChange={(event) => setInputPage(event.target.value)}
              onBlur={submitPage}
              onKeyDown={handleKeyDown}
              className="reader-page-input"
            />
            / {safePages.length || 1}
          </div>

          <button
            type="button"
            onClick={nextPage}
            disabled={!safePages.length || safePageIndex >= safePages.length - 1}
            data-testid="next-page"
          >
            →
          </button>
        </div>

        {showQuotesList && (
          <div className="quotes-list-overlay" onClick={() => setShowQuotesList(false)}>
            <div className="quotes-list" onClick={(event) => event.stopPropagation()}>
              <h3>Цитаты</h3>

              {currentBookQuotes.length ? (
                currentBookQuotes.map((quote, index) => (
                  <div key={`${quote.date}-${index}`} className="quote-item">
                    <div className="quote-date">
                      {quote.date}
                      {quote.page ? ` · стр. ${quote.page}` : ''}
                    </div>

                    <div className="quote-row">
                      <span className="quote-text">{quote.text}</span>

                      <button
                        className="quote-delete-btn"
                        type="button"
                        onClick={() => handleDeleteQuote(index)}
                        aria-label="Удалить цитату"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Нет цитат</p>
              )}
            </div>
          </div>
        )}

        {showAddBtn && (
          <button
            className="add-quote-btn"
            type="button"
            onClick={handleAddQuote}
            style={{ left: btnPos.x, top: btnPos.y }}
            aria-label="Добавить цитату"
          >
            +
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

ReaderModal.propTypes = {
  book: PropTypes.object.isRequired,
  pages: PropTypes.array.isRequired,
  pageIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  prevPage: PropTypes.func.isRequired,
  goToPage: PropTypes.func.isRequired,
};
