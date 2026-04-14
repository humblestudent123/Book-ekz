export const loadBookText = async (url) => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to load book: ${res.status}`);
    }

    const buffer = await res.arrayBuffer();

    const decode = (encoding) =>
      new TextDecoder(encoding).decode(buffer);

    let text = decode('utf-8');

    if (text.includes('�')) {
      text = decode('windows-1251');
    }

    return text;
  } catch (error) {
    console.error('loadBookText error:', error);
    return 'Ошибка загрузки книги';
  }
};