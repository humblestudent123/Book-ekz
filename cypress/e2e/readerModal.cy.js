describe('Reader modal', () => {
  beforeEach(() => {
    cy.visit('/library/book/5', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('opens the reader, changes pages and closes the modal', () => {
    cy.get('[data-testid="open-reader"]').click();
    cy.get('[data-testid="reader-modal"]', { timeout: 10000 }).should('be.visible');

    // На первой странице кнопка назад выключена, а вперед доступна.
    cy.get('[data-testid="reader-page-input"]').should('have.value', '1');
    cy.get('[data-testid="prev-page"]').should('be.disabled');
    cy.get('[data-testid="next-page"]').should('not.be.disabled').click();

    cy.get('[data-testid="reader-page-input"]').should('have.value', '2');
    cy.get('[data-testid="prev-page"]').should('not.be.disabled').click();
    cy.get('[data-testid="reader-page-input"]').should('have.value', '1');

    cy.get('[data-testid="close-reader"]').click();
    cy.get('[data-testid="reader-modal"]').should('not.exist');
  });
});
