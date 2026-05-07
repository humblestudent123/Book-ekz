describe('Courses catalog and learning flow', () => {
  beforeEach(() => {
    cy.visit('/courses', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('shows courses, filters by category and opens a course page', () => {
    cy.location('pathname').should('eq', '/courses');

    cy.get('[data-testid="search-input"]').should('be.visible');
    cy.get('[data-testid="course-category-filter"]').should('be.visible').and('have.value', 'all');
    cy.get('[data-testid="course-card"]').should('have.length.greaterThan', 0);

    cy.get('[data-testid="course-category-filter"]').select('frontend');
    cy.get('[data-testid="course-card"]').should('have.length', 2);
    cy.get('[data-testid="course-card"]').each(($card) => {
      expect($card.attr('data-category')).to.eq('frontend');
    });

    cy.get('[data-testid="course-card"][data-course-id="frontend-react"]')
      .contains('Подробнее')
      .click();

    cy.location('pathname').should('eq', '/courses/frontend-react');
    cy.get('.course-page').should('be.visible');
    cy.get('[data-testid="course-progress-action"]').should('contain', 'Начать курс');
  });

  it('opens a clean lesson page, checks quiz immediately and saves progress', () => {
    cy.visit('/courses/frontend-react', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.get('[data-testid="course-progress-action"]').click();
    cy.get('.course-page').should('not.exist');
    cy.get('[data-testid="course-learning"]').should('be.visible');
    cy.get('[data-testid="course-theory-step"]').should('be.visible');
    cy.get('[data-testid="course-lesson-item"]').eq(1).click();
    cy.get('[data-testid="course-lesson-item"]').eq(1).should('have.attr', 'aria-current', 'step');
    cy.get('[data-testid="course-theory-step"] h1').should('contain', '2.');

    cy.get('[data-testid="course-next-step"]').click();
    cy.get('[data-testid="course-quiz-step"]').should('be.visible');
    cy.get('[data-testid="course-quiz-option"]').first().click();

    cy.get('.course-quiz__feedback').should('be.visible').and('have.class', 'is-correct');
    cy.get('[data-testid="course-complete-lesson"]').should('not.be.disabled').click();

    cy.get('[data-testid="course-theory-step"]').should('be.visible');
    cy.window().then((win) => {
      const progress = JSON.parse(win.localStorage.getItem('course-progress'));
      expect(progress['frontend-react']).to.eq(2);
    });

    cy.get('[data-testid="course-study-back"]').click();
    cy.get('.course-page').should('be.visible');
    cy.get('.course-progress-panel').should('contain', '2');
  });
});
