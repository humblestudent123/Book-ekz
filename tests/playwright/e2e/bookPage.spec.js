const { test, expect } = require('@playwright/test');

test.describe('Book page navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto('/library');
  });

  test('opens a book page from the library and returns back to the catalog', async ({ page }) => {
    await page.locator('[data-testid="book-card"][data-book-id="5"]').first().click();

    await expect(page).toHaveURL(/\/library\/book\/5$/);
    await expect(page.locator('.book-page')).toBeVisible();
    await expect(page.locator('.book-info h1')).not.toBeEmpty();
    await expect(page.getByTestId('open-reader')).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/library$/);
    await expect(page.getByTestId('book-card').first()).toBeVisible();
  });
});
