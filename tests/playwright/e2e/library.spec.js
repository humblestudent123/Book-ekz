const { test, expect } = require('@playwright/test');

test.describe('Library page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto('/library');
  });

  test('shows the library catalog with books and user controls', async ({ page }) => {
    await expect(page).toHaveURL(/\/library$/);
    await expect(page.getByTestId('search-input')).toBeVisible();
    await expect(page.getByTestId('genre-filter')).toHaveValue('all');

    const cards = page.getByTestId('book-card');
    await expect(cards.first()).toBeVisible();
    await expect(cards.first()).toHaveAttribute('data-book-id', /^\d+$/);
    await expect(cards.first()).toHaveAttribute('data-genres', /.+/);
  });

  test('filters books by genre and resets through All genres option', async ({ page }) => {
    await page.getByTestId('genre-filter').selectOption('antiutopia');

    const cards = page.getByTestId('book-card');
    await expect(cards).toHaveCount(2);

    const genres = await cards.evaluateAll((items) => items.map((item) => item.dataset.genres));
    expect(genres.every((genreList) => genreList.includes('antiutopia'))).toBe(true);

    const ids = await cards.evaluateAll((items) => items.map((item) => item.dataset.bookId));
    expect(ids).toEqual(['2', '5']);

    await expect(page.getByTestId('reset-filters')).toHaveCount(0);
    await page.getByTestId('genre-filter').selectOption('all');
    await expect(page.getByTestId('genre-filter')).toHaveValue('all');
    expect(await cards.count()).toBeGreaterThan(2);
  });
});
