describe('Library page', () => {
  beforeEach(() => {
    cy.visit('/library', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('shows the library catalog with books and user controls', () => {
    cy.location('pathname').should('eq', '/library');

    // Проверяем базовую точку входа пользователя: поиск, фильтр и карточки книг.
    cy.get('[data-testid="search-input"]').should('be.visible');
    cy.get('[data-testid="genre-filter"]').should('be.visible').and('have.value', 'all');
    cy.get('.book-card').should('have.length.greaterThan', 0);

    cy.get('[data-testid="book-card"]').first().should(($card) => {
      expect($card.attr('data-book-id')).to.match(/^\d+$/);
      expect($card.attr('data-genres')).to.not.equal('');
    });
  });

  it('filters books by genre and shows only matching cards', () => {
    // antiutopia есть у книг 1984 и 451 градус по Фаренгейту.
    cy.get('[data-testid="genre-filter"]').select('antiutopia');

    cy.get('[data-testid="book-card"]').should('have.length', 2);
    cy.get('[data-testid="book-card"]').each(($card) => {
      expect($card.attr('data-genres')).to.include('antiutopia');
    });

    cy.get('[data-testid="book-card"]').then(($cards) => {
      const ids = [...$cards].map((card) => card.dataset.bookId);
      expect(ids).to.deep.equal(['2', '5']);
    });

    cy.get('[data-testid="reset-filters"]').should('not.exist');
    cy.get('[data-testid="genre-filter"]').select('all');
    cy.get('[data-testid="genre-filter"]').should('have.value', 'all');
    cy.get('[data-testid="book-card"]').should('have.length.greaterThan', 2);
  });
});
