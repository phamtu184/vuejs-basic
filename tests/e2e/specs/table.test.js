
describe('Table test', () => {

  beforeEach(() => {
    cy.loginSuccess();
  })

  it('Nav table page', () => {
    cy.get('.md-card').first().click();
    cy.get('.slider-menu-item').first().next().should('contain', 'Tables').click();
  })

})