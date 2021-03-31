
export const loginSuccess = () => {
  visitBase();
  const url = Cypress.config().testUrl;
  cy.route('GET', `${url}/api/projects`).as('getProjects');
  cy.get('input[name=email]').type('frank@gmail.com');
  cy.get('input[name=password]').type('Hold@123456');
  cy.get('form').submit()
    .wait('@getProjects', { timeout: 20000 })
    .then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  cy.get('.create-project-home').should('be.visible');
}

export const logout = () => {
  cy.get('svg[data-icon=user-circle]').invoke('show').click();
  cy.contains('Logout').click();
  cy.url().should('include', 'login');
}

export const changeLanguage = () => {
  const url = Cypress.config().testUrl;
  cy.route('GET', `${url}/api/language/en`).as('getLanguage');
  cy.get('#dropdownMenuLink.nav-link').click();
  cy.contains('English').click().wait('@getLanguage', { timeout: 20000 })
  .then((xhr) => {
    expect(xhr.status).to.equal(200);
  });
}

export const visitBase = () => {
  const url = Cypress.config().testUrl;
  cy.server();
  cy.route('GET', `${url}/api/protocol/check`).as('checkProtocol');
  cy.visit(Cypress.config().testUrl)
    .wait('@checkProtocol', { timeout: 20000 })
    .then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  cy.url().should('include', 'login');
  changeLanguage();
}

export const navigateTemplate = () => {
  loginSuccess();
  const url = Cypress.config().testUrl;
  cy.route('GET', `${url}/api/template/fetch/1`).as('getTemplate');
  cy.contains('Templates').click()
    .wait('@getTemplate', { timeout: 20000 })
    .then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  cy.url().should('include', 'template');
  cy.get('.slider-menu-item').children().should('contain', 'Masking').and('contain', 'Dictionary');
}

export const checkEllipsisText = (name) => {
  cy.contains(name)
    .should('have.css', 'overflow', 'hidden')
    .and('have.css', 'text-overflow', 'ellipsis')
    .and('have.css', 'white-space', 'nowrap');
}