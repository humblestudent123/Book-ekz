import { useEffect, useState, useRef } from 'react';

const WORDS_PER_MINUTE = 200;

export const useReader = (bookId, text) => {
  const containerRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(`reader-settings`);
    return saved
      ? JSON.parse(saved)
      : {
          fontSize: 18,
          theme: 'dark',
          fontFamily: 'serif',
        };
  });

  useEffect(() => {
    const saved = localStorage.getItem(`book-${bookId}-progress`);
    if (saved && containerRef.current) {
      containerRef.current.scrollTop = Number(saved);
    }
  }, [bookId]);

  const handleScroll = () => {
    const el = containerRef.current;
    const scrollTop = el.scrollTop;
    const height = el.scrollHeight - el.clientHeight;

    const percent = (scrollTop / height) * 100;

    setProgress(percent);

    localStorage.setItem(`book-${bookId}-progress`, scrollTop);
  };

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('reader-settings', JSON.stringify(updated));
  };

  const words = text.split(/\s+/).length;
  const minutesLeft = Math.max(
    1,
    Math.round((words * (1 - progress / 100)) / WORDS_PER_MINUTE)
  );

  return {
    containerRef,
    progress,
    settings,
    updateSettings,
    handleScroll,
    minutesLeft,
  };
};