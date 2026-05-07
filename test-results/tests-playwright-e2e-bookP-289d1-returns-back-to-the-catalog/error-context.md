# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\playwright\e2e\bookPage.spec.js >> Book page navigation >> opens a book page from the library and returns back to the catalog
- Location: tests\playwright\e2e\bookPage.spec.js:9:3

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
  3  | test.describe('Book page navigation', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.addInitScript(() => window.localStorage.clear());
> 6  |     await page.goto('/library');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  7  |   });
  8  | 
  9  |   test('opens a book page from the library and returns back to the catalog', async ({ page }) => {
  10 |     await page.locator('[data-testid="book-card"][data-book-id="5"]').first().click();
  11 | 
  12 |     await expect(page).toHaveURL(/\/library\/book\/5$/);
  13 |     await expect(page.locator('.book-page')).toBeVisible();
  14 |     await expect(page.locator('.book-info h1')).not.toBeEmpty();
  15 |     await expect(page.getByTestId('open-reader')).toBeVisible();
  16 | 
  17 |     await page.goBack();
  18 |     await expect(page).toHaveURL(/\/library$/);
  19 |     await expect(page.getByTestId('book-card').first()).toBeVisible();
  20 |   });
  21 | });
  22 | 
```