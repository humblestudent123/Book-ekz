const test = require('node:test');
const assert = require('node:assert/strict');
const { computeRecommendations } = require('../src/recommendEngine');

test('computeRecommendations returns book ids excluding favorites', () => {
  const { bookIds } = computeRecommendations({ favoriteIds: [1, 2], limit: 5 });
  assert.ok(Array.isArray(bookIds));
  assert.equal(bookIds.includes(1), false);
  assert.equal(bookIds.includes(2), false);
  assert.ok(bookIds.length <= 5);
});

test('computeRecommendations returns courses array', () => {
  const { courses } = computeRecommendations({ favoriteIds: [], limit: 8 });
  assert.ok(Array.isArray(courses));
  assert.ok(courses.length > 0);
});
