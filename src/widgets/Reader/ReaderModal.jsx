import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import '../Reader/ReaderModal.css';

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

  const [inputPage, setInputPage] = useState(pageIndex + 1);

  const [showQuotesList, setShowQuotesList] = useState(false);

  const [selectionText, setSelectionText] = useState('');
  const [showAddBtn, setShowAddBtn] = useState(false);

  const [btnPos, setBtnPos] = useState({
    x: 0,
    y: 0,
  });

  const [quotes, setQuotes] = useState(() => {
    const savedQuotes = localStorage.getItem('quotes');

    return savedQuotes ? JSON.parse(savedQuotes) : {};
  });

  // Сохраняем цитаты
  useEffect(() => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }, [quotes]);

  // Обновляем номер страницы в input
  useEffect(() => {
    setInputPage(pageIndex + 1);
  }, [pageIndex]);

  // Если выделение пропало — скрываем кнопку
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (!selectedText) {
        setShowAddBtn(false);
      }
    };

    document.addEventListener(
      'selectionchange',
      handleSelectionChange
    );

    return () => {
      document.removeEventListener(
        'selectionchange',
        handleSelectionChange
      );
    };
  }, []);

  // Показываем кнопку добавления цитаты
  const handleMouseUp = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      setShowAddBtn(false);
      return;
    }

    const selectedText = selection.toString().trim();

    if (!selectedText) {
      setShowAddBtn(false);
      return;
    }

    const range = selection.getRangeAt(0);

    const rect = range.getBoundingClientRect();
    const modalRect =
      modalRef.current.getBoundingClientRect();

    setSelectionText(selectedText);

    setBtnPos({
      x: Math.min(
        rect.right - modalRect.left + 8,
        modalRect.width - 50
      ),

      y: Math.max(
        rect.bottom - modalRect.top + 8,
        10
      ),
    });

    setShowAddBtn(true);
  };

  // Добавление цитаты
  const handleAddQuote = () => {
    if (!selectionText) return;

    const now = new Date();

    const formattedDate = `
${now.getDate().toString().padStart(2, '0')}.
${(now.getMonth() + 1)
  .toString()
  .padStart(2, '0')}.
${now.getFullYear()}

${now.getHours().toString().padStart(2, '0')}:
${now.getMinutes().toString().padStart(2, '0')}:
${now.getSeconds().toString().padStart(2, '0')}
`.replace(/\s/g, '');

    const newQuote = {
      text: selectionText,
      date: formattedDate,
    };

    setQuotes((prev) => ({
      ...prev,

      [book.id]: [
        ...(prev[book.id] || []),
        newQuote,
      ],
    }));

    setSelectionText('');
    setShowAddBtn(false);

    window.getSelection().removeAllRanges();
  };

  // Удаление цитаты
  const handleDeleteQuote = (quoteIndex) => {
    setQuotes((prev) => ({
      ...prev,

      [book.id]: (prev[book.id] || []).filter(
        (_, index) => index !== quoteIndex
      ),
    }));
  };

  // Изменение input страницы
  const handleInputChange = (event) => {
    setInputPage(event.target.value);
  };

  // Переход по Enter
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return;

    const pageNumber = Number(inputPage);

    const isValidPage =
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= pages.length;

    if (isValidPage) {
      goToPage(pageNumber - 1);
    }
  };

  return (
    <div
      className="reader-overlay"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="reader-modal black-theme"
        onClick={(event) => event.stopPropagation()}
        onMouseUp={handleMouseUp}
      >
        {/* Кнопка закрытия */}
        <button
          className="reader-close"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Верхняя панель */}
        <div className="reader-header">
          <strong>{book.title}</strong>

          <div className="reader-book-info">
            <div className="reader-book-meta">
              {book.author} · {book.year}
            </div>

            <button
              className="quotes-toggle-btn"
              onClick={() =>
                setShowQuotesList((prev) => !prev)
              }
            >
              {showQuotesList
                ? 'Скрыть цитаты'
                : 'Показать цитаты'}
            </button>
          </div>
        </div>

        {/* Контент */}
        <div className="reader-content">
          {pages.length > 0 ? (
            <div className="reader-page">
              {pages[pageIndex]}
            </div>
          ) : (
            <div className="reader-page">
              Нет содержания для чтения.
            </div>
          )}
        </div>

        {/* Навигация */}
        <div className="reader-controls">
          <button
            onClick={prevPage}
            disabled={pageIndex === 0}
          >
            ←
          </button>

          <div className="reader-progress">
            Стр.

            <input
              type="number"
              min="1"
              max={pages.length}
              value={inputPage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="reader-page-input"
            />

            / {pages.length}
          </div>

          <button
            onClick={nextPage}
            disabled={
              pageIndex >= pages.length - 1
            }
          >
            →
          </button>
        </div>

        {/* Модалка цитат */}
        {showQuotesList && (
          <div
            className="quotes-list-overlay"
            onClick={() =>
              setShowQuotesList(false)
            }
          >
            <div
              className="quotes-list"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <h3>Цитаты</h3>

              {quotes[book.id]?.length ? (
                quotes[book.id].map(
                  (quote, index) => (
                    <div
                      key={index}
                      className="quote-item"
                    >
                      {quote.date && (
                        <div className="quote-date">
                          {quote.date}
                        </div>
                      )}

                      <div className="quote-row">
                        <span className="quote-text">
                          {quote.text}
                        </span>

                        <button
                          className="quote-delete-btn"
                          onClick={() =>
                            handleDeleteQuote(index)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p>Нет цитат</p>
              )}
            </div>
          </div>
        )}

        {/* Кнопка добавления цитаты */}
        {showAddBtn && (
          <button
            className="add-quote-btn"
            onClick={handleAddQuote}
            style={{
              left: btnPos.x,
              top: btnPos.y,
            }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
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