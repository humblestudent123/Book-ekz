const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3100',
    specPattern: 'tests/cypress/e2e/**/*.cy.js',
    supportFile: false,
    screenshotsFolder: 'tests/cypress/artifacts/screenshots',
    videosFolder: 'tests/cypress/artifacts/videos',
    video: false,
    viewportWidth: 1280,
    viewportHeight: 900,
  },
});
