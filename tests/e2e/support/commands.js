// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add("checkReloadSuccess", () => {
  const url = Cypress.config().testUrl;
  cy.route('GET', `${url}/api/protocol/check`).as('checkProtocol');
  cy.reload()
    .wait('@checkProtocol', { timeout: 20000 })
    .then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
})

Cypress.Commands.add("loginSuccess", () => {
  const url = Cypress.config().testUrl;
  cy.server();
  cy.route('GET', `${url}/api/protocol/check`).as('checkProtocol');
  cy.visit(Cypress.config().testUrl)
    .wait('@checkProtocol', { timeout: 20000 })
    .then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  cy.url().should('include', 'login');
  cy.changeENLanguage();
  cy.route('GET', `${url}/api/projects`).as('getProjects');
  cy.get('input[name=email]').type('frank@gmail.com');
  cy.get('input[name=password]').type('Hold@123456');
  cy.get('form').submit()
    .wait('@getProjects', { timeout: 20000 })
    .then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  cy.get('.create-project-home').should('be.visible');
})

Cypress.Commands.add("changeENLanguage", () => {
  const url = Cypress.config().testUrl;
  cy.route('GET', `${url}/api/language/en`).as('getLanguage');
  cy.get('#dropdownMenuLink.nav-link').click();
  cy.contains('English').click().wait('@getLanguage', { timeout: 20000 })
  .then((xhr) => {
    expect(xhr.status).to.equal(200);
  });
})

Cypress.Commands.add("navigateTemplate", () => {
  cy.loginSuccess();
  const url = Cypress.config().testUrl;
  cy.route('GET', `${url}/api/template/fetch/1`).as('getTemplate');
  cy.contains('Templates').click()
    .wait('@getTemplate', { timeout: 20000 })
    .then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  cy.url().should('include', 'template');
  cy.get('.slider-menu-item').children().should('contain', 'Masking').and('contain', 'Dictionary');
})

Cypress.Commands.add("checkEllipsisText", (name) => {
  cy.contains(name)
    .should('have.css', 'overflow', 'hidden')
    .and('have.css', 'text-overflow', 'ellipsis')
    .and('have.css', 'white-space', 'nowrap');
})