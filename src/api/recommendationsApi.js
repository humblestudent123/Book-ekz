const DEFAULT_BASE = 'http://localhost:4000';

export function getRecommendationsApiBase() {
  const raw = process.env.REACT_APP_RECOMMENDATIONS_API_URL || DEFAULT_BASE;
  return String(raw).replace(/\/$/, '');
}

export async function fetchRecommendations(favoriteIds, options = {}) {
  const base = getRecommendationsApiBase();
  const url = `${base}/api/recommendations`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ favoriteIds: favoriteIds || [], limit: 8 }),
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Рекомендации: ${res.status} ${text || res.statusText}`);
  }

  return res.json();
}
