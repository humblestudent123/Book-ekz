export const STORAGE_KEYS = {
  favoriteBooks: 'favorite-books',
  favoriteCourses: 'favorite-courses',
  readingPages: 'reading-pages',
  courseProgress: 'course-progress',
  openedBooks: 'opened-books',
  recentBooks: 'recent-books',
  recentCourses: 'recent-courses',
};

export const readJsonFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJsonToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can be unavailable in private mode; the UI still works in memory.
  }
};

export const normalizeId = (id) => String(id);

export const toggleId = (ids, id) => {
  const safeIds = Array.isArray(ids) ? ids : [];
  const normalizedId = normalizeId(id);

  return safeIds.some((itemId) => normalizeId(itemId) === normalizedId)
    ? safeIds.filter((itemId) => normalizeId(itemId) !== normalizedId)
    : [...safeIds, id];
};

export const moveIdToFront = (ids, id, limit = 8) => {
  const normalizedId = normalizeId(id);
  const safeIds = Array.isArray(ids) ? ids : [];
  const withoutCurrent = safeIds.filter((itemId) => normalizeId(itemId) !== normalizedId);

  return [id, ...withoutCurrent].slice(0, limit);
};

export const getBookCategories = (book) => {
  if (!book) return [];

  const categories = [
    book.category,
    ...(Array.isArray(book.categories) ? book.categories : []),
    ...(Array.isArray(book.genres) ? book.genres : []),
  ].filter(Boolean);

  return [...new Set(categories)];
};

export const getCourseCategories = (course) => (course?.category ? [course.category] : []);

export const hasSharedCategory = (leftCategories, rightCategories) => {
  const rightSet = new Set(rightCategories);
  return leftCategories.some((category) => rightSet.has(category));
};

export const getRelatedCourses = (book, courses, limit = 6) => {
  const bookCategories = getBookCategories(book);

  return courses
    .filter((course) => hasSharedCategory(bookCategories, getCourseCategories(course)))
    .slice(0, limit);
};

export const getRelatedBooks = (course, books, limit = 6) => {
  const courseCategories = getCourseCategories(course);

  return books
    .filter((book) => hasSharedCategory(courseCategories, getBookCategories(book)))
    .slice(0, limit);
};

const getItemsByIds = (items, ids) => {
  const byId = new Map(items.map((item) => [normalizeId(item.id), item]));
  return (Array.isArray(ids) ? ids : [])
    .map((id) => byId.get(normalizeId(id)))
    .filter(Boolean);
};

const collectCategories = (items, getCategories) => [
  ...new Set(items.flatMap((item) => getCategories(item))),
];

export const getPersonalCourseRecommendations = ({
  books,
  courses,
  recentBookIds,
  favoriteBookIds,
  limit = 6,
}) => {
  const sourceBooks = [
    ...getItemsByIds(books, recentBookIds),
    ...getItemsByIds(books, favoriteBookIds),
  ];
  const preferredCategories = collectCategories(sourceBooks, getBookCategories);

  const byCategory = courses.filter((course) =>
    hasSharedCategory(preferredCategories, getCourseCategories(course))
  );

  return (byCategory.length ? byCategory : [...courses].sort((a, b) => b.rating - a.rating)).slice(
    0,
    limit
  );
};

export const getPersonalBookRecommendations = ({
  books,
  courses,
  recentCourseIds,
  favoriteBookIds,
  limit = 6,
}) => {
  const recentCourses = getItemsByIds(courses, recentCourseIds);
  const preferredCategories = collectCategories(recentCourses, getCourseCategories);
  const favoriteSet = new Set((favoriteBookIds || []).map(normalizeId));

  const byCategory = books.filter((book) =>
    hasSharedCategory(preferredCategories, getBookCategories(book))
  );

  return (byCategory.length
    ? byCategory
    : books.filter((book) => !favoriteSet.has(normalizeId(book.id)))
  ).slice(0, limit);
};
