# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\playwright\e2e\readerModal.spec.js >> Reader modal >> opens the reader, changes pages and closes the modal
- Location: tests\playwright\e2e\readerModal.spec.js:9:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/library/book/5", waiting until "load"

```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Reader modal', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.addInitScript(() => window.localStorage.clear());
> 6  |     await page.goto('/library/book/5');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  7  |   });
  8  | 
  9  |   test('opens the reader, changes pages and closes the modal', async ({ page }) => {
  10 |     await page.getByTestId('open-reader').click();
  11 |     await expect(page.getByTestId('reader-modal')).toBeVisible();
  12 | 
  13 |     await expect(page.getByTestId('reader-page-input')).toHaveValue('1');
  14 |     await expect(page.getByTestId('prev-page')).toBeDisabled();
  15 |     await expect(page.getByTestId('next-page')).toBeEnabled();
  16 | 
  17 |     await page.getByTestId('next-page').click();
  18 |     await expect(page.getByTestId('reader-page-input')).toHaveValue('2');
  19 | 
  20 |     await page.getByTestId('prev-page').click();
  21 |     await expect(page.getByTestId('reader-page-input')).toHaveValue('1');
  22 | 
  23 |     await page.getByTestId('close-reader').click();
  24 |     await expect(page.getByTestId('reader-modal')).toHaveCount(0);
  25 |   });
  26 | });
  27 | 
```