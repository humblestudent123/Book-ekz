const fs = require('fs');
const path = require('path');

const booksPath = path.join(__dirname, '..', 'data', 'book-features.json');
const coursesPath = path.join(__dirname, '..', 'data', 'courses.json');

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

let booksCache;
let coursesCache;

function getBooks() {
  if (!booksCache) booksCache = loadJson(booksPath);
  return booksCache;
}

function getCourses() {
  if (!coursesCache) coursesCache = loadJson(coursesPath);
  return coursesCache;
}

function computeRecommendations({ favoriteIds = [], limit = 8 }) {
  const books = getBooks();
  const courses = getCourses();
  const favSet = new Set((favoriteIds || []).map(Number).filter(Number.isFinite));
  const favoriteBooks = books.filter((b) => favSet.has(b.id));

  const genreWeights = new Map();
  const tagWeights = new Map();

  for (const fb of favoriteBooks) {
    for (const g of fb.genres || []) {
      genreWeights.set(g, (genreWeights.get(g) || 0) + 2);
    }
    for (const t of fb.tags || []) {
      const key = String(t).toLowerCase();
      tagWeights.set(key, (tagWeights.get(key) || 0) + 1);
    }
  }

  const scored = books
    .filter((b) => !favSet.has(b.id))
    .map((b) => {
      let score = 0;
      for (const g of b.genres || []) {
        score += genreWeights.get(g) || 0;
      }
      for (const t of b.tags || []) {
        score += tagWeights.get(String(t).toLowerCase()) || 0;
      }
      if (b.isPopular) score += 1.5;
      if (b.isNew) score += 1;
      if (b.featured) score += 0.75;
      if (favoriteBooks.length === 0) {
        score += (b.isPopular ? 2 : 0) + (b.featured ? 1.5 : 0) + (b.isNew ? 1 : 0);
      }
      return { id: b.id, score };
    })
    .sort((a, b) => b.score - a.score || a.id - b.id);

  const bookIds = scored.slice(0, Math.max(1, Math.min(limit, scored.length))).map((s) => s.id);

  const topGenres = [...genreWeights.entries()].sort((a, b) => b[1] - a[1]).map(([g]) => g);
  const courseRanked = [...courses].sort((a, b) => {
    const scoreA = (a.relatedGenres || []).filter((g) => topGenres.includes(g)).length;
    const scoreB = (b.relatedGenres || []).filter((g) => topGenres.includes(g)).length;
    return scoreB - scoreA || String(a.id).localeCompare(String(b.id));
  });

  return {
    bookIds,
    courses: courseRanked.slice(0, 3),
    computeMs: 0,
  };
}

module.exports = { computeRecommendations, getBooks, getCourses };
