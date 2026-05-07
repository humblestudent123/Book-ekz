const { test, expect } = require('@playwright/test');

test.describe('Courses catalog and learning flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto('/courses');
  });

  test('shows courses, filters by category and opens a course page', async ({ page }) => {
    await expect(page).toHaveURL(/\/courses$/);
    await expect(page.getByTestId('search-input')).toBeVisible();
    await expect(page.getByTestId('course-category-filter')).toHaveValue('all');
    await expect(page.getByTestId('course-card').first()).toBeVisible();

    await page.getByTestId('course-category-filter').selectOption('frontend');

    const cards = page.getByTestId('course-card');
    await expect(cards).toHaveCount(2);

    const categories = await cards.evaluateAll((items) => items.map((item) => item.dataset.category));
    expect(categories.every((category) => category === 'frontend')).toBe(true);

    await page
      .locator('[data-testid="course-card"][data-course-id="frontend-react"]')
      .getByRole('button', { name: 'Подробнее' })
      .click();

    await expect(page).toHaveURL(/\/courses\/frontend-react$/);
    await expect(page.locator('.course-page')).toBeVisible();
    await expect(page.getByTestId('course-progress-action')).toContainText('Начать курс');
  });

  test('opens a clean lesson page, checks quiz immediately and saves progress', async ({ page }) => {
    await page.goto('/courses/frontend-react');

    await page.getByTestId('course-progress-action').click();
    await expect(page.locator('.course-page')).toHaveCount(0);
    await expect(page.getByTestId('course-learning')).toBeVisible();
    await expect(page.getByTestId('course-theory-step')).toBeVisible();
    await page.getByTestId('course-lesson-item').nth(1).click();
    await expect(page.getByTestId('course-lesson-item').nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('[data-testid="course-theory-step"] h1')).toContainText('2.');

    await page.getByTestId('course-next-step').click();
    await expect(page.getByTestId('course-quiz-step')).toBeVisible();
    await page.getByTestId('course-quiz-option').first().click();

    await expect(page.locator('.course-quiz__feedback')).toBeVisible();
    await expect(page.locator('.course-quiz__feedback')).toHaveClass(/is-correct/);
    await expect(page.getByTestId('course-complete-lesson')).toBeEnabled();
    await page.getByTestId('course-complete-lesson').click();

    await expect(page.getByTestId('course-theory-step')).toBeVisible();

    const progress = await page.evaluate(() => JSON.parse(window.localStorage.getItem('course-progress')));
    expect(progress['frontend-react']).toBe(2);

    await page.getByTestId('course-study-back').click();
    await expect(page.locator('.course-page')).toBeVisible();
    await expect(page.locator('.course-progress-panel')).toContainText('2');
  });
});
