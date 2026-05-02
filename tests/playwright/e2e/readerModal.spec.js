const { test, expect } = require('@playwright/test');

test.describe('Reader modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto('/library/book/5');
  });

  test('opens the reader, changes pages and closes the modal', async ({ page }) => {
    await page.getByTestId('open-reader').click();
    await expect(page.getByTestId('reader-modal')).toBeVisible();

    await expect(page.getByTestId('reader-page-input')).toHaveValue('1');
    await expect(page.getByTestId('prev-page')).toBeDisabled();
    await expect(page.getByTestId('next-page')).toBeEnabled();

    await page.getByTestId('next-page').click();
    await expect(page.getByTestId('reader-page-input')).toHaveValue('2');

    await page.getByTestId('prev-page').click();
    await expect(page.getByTestId('reader-page-input')).toHaveValue('1');

    await page.getByTestId('close-reader').click();
    await expect(page.getByTestId('reader-modal')).toHaveCount(0);
  });
});
