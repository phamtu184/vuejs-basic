import {navTemplate} from '../function/base'
describe('Template test', () => {
  const templateName = 'This is a template name';
  let id = 0;
  beforeEach(() => {
    navTemplate();
    cy.server();
  })

  it('Add template', () => {
    cy.route('POST', 'http://3.112.38.145/api/template/create').as('addTemplate');
    cy.get('button[name=upload]').click();
    cy.get('.md-field').first().next().type(templateName);
    cy.get('.md-dialog button').first().next().click().wait('@addTemplate', { timeout: 20000 })
    .then((xhr) => {
      id = xhr.response.body.data.id;
      cy.log(JSON.stringify(xhr.response.body))
    });
    cy.contains(templateName).should('be.visible');
  })
  it('Delete template', () => {
    // cy.route('POST', 'http://3.112.38.145/api/template/delete').as('deleteTemplate');
    // cy.route('GET', 'http://3.112.38.145/api/template/usage/' + id).as('getTemplate');
    cy.contains(templateName).click();
    cy.get('button[name=delete]').click()
    // .wait('@deleteTemplate', { timeout: 20000 }).then((xhr) => {
    //   cy.log(JSON.stringify(xhr.response.body))
    // });
    cy.get('.md-dialog button').first().next().click();
  })

})