# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\playwright\e2e\library.spec.js >> Library page >> shows the library catalog with books and user controls
- Location: tests\playwright\e2e\library.spec.js:9:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/library", waiting until "load"

```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Library page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.addInitScript(() => window.localStorage.clear());
> 6  |     await page.goto('/library');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  7  |   });
  8  | 
  9  |   test('shows the library catalog with books and user controls', async ({ page }) => {
  10 |     await expect(page).toHaveURL(/\/library$/);
  11 |     await expect(page.getByTestId('search-input')).toBeVisible();
  12 |     await expect(page.getByTestId('genre-filter')).toHaveValue('all');
  13 | 
  14 |     const cards = page.getByTestId('book-card');
  15 |     await expect(cards.first()).toBeVisible();
  16 |     await expect(cards.first()).toHaveAttribute('data-book-id', /^\d+$/);
  17 |     await expect(cards.first()).toHaveAttribute('data-genres', /.+/);
  18 |   });
  19 | 
  20 |   test('filters books by genre and resets through All genres option', async ({ page }) => {
  21 |     await page.getByTestId('genre-filter').selectOption('antiutopia');
  22 | 
  23 |     const cards = page.getByTestId('book-card');
  24 |     await expect(cards).toHaveCount(2);
  25 | 
  26 |     const genres = await cards.evaluateAll((items) => items.map((item) => item.dataset.genres));
  27 |     expect(genres.every((genreList) => genreList.includes('antiutopia'))).toBe(true);
  28 | 
  29 |     const ids = await cards.evaluateAll((items) => items.map((item) => item.dataset.bookId));
  30 |     expect(ids).toEqual(['2', '5']);
  31 | 
  32 |     await expect(page.getByTestId('reset-filters')).toHaveCount(0);
  33 |     await page.getByTestId('genre-filter').selectOption('all');
  34 |     await expect(page.getByTestId('genre-filter')).toHaveValue('all');
  35 |     expect(await cards.count()).toBeGreaterThan(2);
  36 |   });
  37 | });
  38 | 
```