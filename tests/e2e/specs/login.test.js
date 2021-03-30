import {loginSuccess, visitBase} from '../function/base'

describe('Login test', () => {
  it('Login fail - wrong password', () => {
    visitBase();
    cy.get('input[name=email]').type('frank@gmail.com');
    cy.get('input[name=password]').type('123456');
    cy.get('button[type=submit]').click();
  })

  it('Login success - right email, password', () => {
    loginSuccess();
  })
})
