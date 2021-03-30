import {loginSuccess} from '../function/base'

describe('Table test', () => {

  beforeEach(() => {
    loginSuccess();
  })
  it('Nav table page', () => {
    cy.get('.md-card').first().click();
    cy.get('.slider-menu-item').first().next().should('contain', 'Tables').click();
  })

})