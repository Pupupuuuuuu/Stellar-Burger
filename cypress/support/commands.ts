/// <reference types="cypress" />
import { SELECTORS } from './selectors';

Cypress.Commands.add('initializeIntercepts', () => {
  cy.intercept('GET', '/api/ingredients',    { fixture: 'ingredients' }).as('ingredients');
  cy.intercept('GET', '/api/auth/user',      { fixture: 'user'       }).as('user');
  cy.intercept('GET', '/api/orders/all',     { fixture: 'user-orders'}).as('user-orders');
  cy.intercept('GET', '/api/feeds',          { fixture: 'feeds'      }).as('feeds');
  cy.intercept('POST','/api/orders',         { fixture: 'order'      }).as('order');
});

Cypress.Commands.add('signInThroughUI', () => {
  cy.intercept('POST','/api/auth/login',{ fixture:'user' }).as('login');
  cy.visit('/login');

  cy.get('input[name="email"]').clear();
  cy.get('input[name="email"]').type('test@example.com');

  cy.get('input[name="password"]').clear();
  cy.get('input[name="password"]').type('password123');

  cy.get('button[type="submit"]').click();
  cy.wait('@login');
});

Cypress.Commands.add('openFirstIngredient', () =>
  cy.get(SELECTORS.MENU_INGREDIENT).first().click()
);
Cypress.Commands.add('insertFirstIngredient', () =>
  cy.get(SELECTORS.MENU_INGREDIENT).first().find('button').click()
);
Cypress.Commands.add('insertLastIngredient', () =>
  cy.get(SELECTORS.MENU_INGREDIENT).last().find('button').click()
);

Cypress.Commands.add('dismissIngredientModal', () =>
  cy.get(SELECTORS.MODAL).find('button').click()
);
Cypress.Commands.add('expectModalNotExists', () =>
  cy.get(SELECTORS.MODAL).should('not.exist')
);

Cypress.Commands.add('expectConstructorToBeEmpty', () => {
  cy.get(SELECTORS.CONSTRUCTOR_BREAD_TOP).should('not.exist');
  cy.get(SELECTORS.CONSTRUCTOR_COMPONENT).should('be.visible').and('contain.text', 'Выберите начинку');
  cy.get(SELECTORS.CONSTRUCTOR_BREAD_BOTTOM).should('not.exist');
});
