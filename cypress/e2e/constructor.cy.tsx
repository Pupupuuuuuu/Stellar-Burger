import { SELECTORS } from '../support/selectors';

describe('Конструктор', () => {
  beforeEach(() => {
    cy.initializeIntercepts();
    cy.visit('/');
    cy.wait('@ingredients');
  });

  it('Открытие ингредиента', () => {
    cy.openFirstIngredient();
    cy.get(SELECTORS.MODAL)
      .should('be.visible')
      .and('contain.text', 'Краторная булка N-200i');
    cy.dismissIngredientModal();
    cy.expectModalNotExists();
  });

  it('Закрытие кликом по оверлею', () => {
    cy.openFirstIngredient();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.expectModalNotExists();
  });

  it('Закрытие крестиком', () => {
    cy.openFirstIngredient();
    cy.get(SELECTORS.MODAL_CLOSE).click();
    cy.expectModalNotExists();
  });

  it('Оформление заказа с авторизацией', () => {
    cy.insertFirstIngredient();
    cy.insertLastIngredient();

    cy.get(SELECTORS.CONSTRUCTOR_BREAD_TOP).should('be.visible');
    cy.get(SELECTORS.CONSTRUCTOR_COMPONENT).should('be.visible');

    cy.get(SELECTORS.ORDER_BUTTON).click();
    cy.url().should('include', '/login');

    cy.signInThroughUI();

    cy.initializeIntercepts();
    cy.visit('/');
    cy.wait('@ingredients');
    cy.insertFirstIngredient();
    cy.insertLastIngredient();

    cy.get(SELECTORS.ORDER_BUTTON).click();
    cy.wait('@order').then(({ response }) => {
      const orderNumber = response!.body.order.number;
      cy.get(SELECTORS.MODAL, { timeout: 15000 }).should('be.visible');
      cy.get(SELECTORS.ORDER_NUMBER)
        .should('be.visible')
        .and('contain.text', orderNumber);
    });

    cy.dismissIngredientModal();
    cy.expectModalNotExists();
    cy.expectConstructorToBeEmpty();
  });
});
