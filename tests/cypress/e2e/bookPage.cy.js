describe('Book page navigation', () => {
  beforeEach(() => {
    cy.visit('/library', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('opens a book page from the library and returns back to the catalog', () => {
    // Пользователь выбирает конкретную книгу из каталога.
    cy.get('[data-testid="book-card"][data-book-id="5"]').first().click();

    cy.location('pathname').should('eq', '/library/book/5');
    cy.get('.book-page').should('be.visible');
    cy.get('.book-info h1').should('not.be.empty');
    cy.get('[data-testid="open-reader"]').should('be.visible');

    // Возврат браузерной кнопкой должен вернуть пользователя в библиотеку.
    cy.go('back');
    cy.location('pathname').should('eq', '/library');
    cy.get('[data-testid="book-card"]').should('have.length.greaterThan', 0);
  });
});
