
export const loginSuccess = () => {
  changeLanguage();
  visitBase();
  cy.get('input[name=email]').type('frank@gmail.com');
  cy.get('input[name=password]').type('Hold@123456');
  cy.get('button[type=submit]').click();
  cy.get('.create-project-home').should('be.visible');
}

export const logout = () => {
  cy.get('svg[data-icon=user-circle]').invoke('show').click();
  cy.contains('Logout').click();
}

export const changeLanguage = () => {
  visitBase();
  cy.get('#dropdownMenuLink.nav-link').click();
  cy.contains('English').click();
}

export const visitBase = () => {
  cy.visit('http://3.112.38.145');
  cy.url().should('include', 'login');
}

export const navTemplate = () => {
  visitBase();
  changeLanguage();
  loginSuccess();
  cy.contains('Templates').click();
  cy.get('.slider-menu-item').children().should('contain', 'Masking').and('contain', 'Dictionary');
}