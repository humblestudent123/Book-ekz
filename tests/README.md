# Testing structure

All E2E test infrastructure lives inside this directory.

```text
tests/
  scripts/
    run-with-app.cjs
  cypress/
    cypress.config.js
    e2e/
      library.cy.js
      bookPage.cy.js
      readerModal.cy.js
  playwright/
    playwright.config.js
    e2e/
      library.spec.js
      bookPage.spec.js
      readerModal.spec.js
```

## Install

```bash
npm install
npm run cypress:install
npm run playwright:install
```

`npm install` installs all npm packages. The install scripts download browser binaries when the local cache is empty.

## Run all E2E tests

```bash
npm run e2e
```

This runs Cypress first and then Playwright. The test app server uses `http://localhost:3100`, so it does not collide with a regular dev server on `3000`.

## Run one test runner

```bash
npm run e2e:cypress
npm run e2e:playwright
```

Interactive modes:

```bash
npm run e2e:cypress:open
npm run e2e:playwright:open
```

## Coverage

- Library page: catalog visibility, search control, genre filter, and correct genre results.
- Book page: navigation from the catalog to a book page and browser back navigation.
- Reader modal: opening the reader, page navigation, and closing the modal.
