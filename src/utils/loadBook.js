const countReplacementChars = (text) => (text.match(/\uFFFD/g) || []).length;

export const loadBookText = async (url, options = {}) => {
  if (!url) {
    throw new Error('Не указан путь к тексту книги');
  }

  const response = await fetch(encodeURI(url), {
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить книгу: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const decode = (encoding) => new TextDecoder(encoding).decode(buffer);

  const utf8Text = decode('utf-8');
  const windows1251Text = decode('windows-1251');

  return countReplacementChars(utf8Text) <= countReplacementChars(windows1251Text)
    ? utf8Text
    : windows1251Text;
};
