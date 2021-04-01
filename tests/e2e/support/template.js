Cypress.Commands.add("routeTemplate", () => {
  const url = Cypress.config().testUrl;
  cy.server();
  cy.route('POST', `${url}/api/template/create`).as('addTemplate');
  // cy.route('GET', `${url}/api/protocol/check`).as('checkProtocol');
  cy.route('POST', `${url}/api/template`).as('editTemplate');
  cy.route('POST', `${url}/api/template/delete`).as('deleteTemplate');
  cy.route('POST', `${url}/api/template/usage`).as('getTemplate');
})

Cypress.Commands.add("addTemplate", (templateName, templateId) => {
  cy.get('button[name=upload]').click();
  cy.get('.md-field').first().next().type(templateName);
  templateId && cy.get('.md-field').first().type(templateId);
  cy.get('.md-dialog button')
    .contains('OK')
    .click()
    .wait('@addTemplate', { timeout: 20000 })
    .then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  cy.contains(templateName).should('be.visible');
  cy.checkReloadSuccess();
  cy.contains(templateName).should('be.visible');
})

Cypress.Commands.add("changeTemplateName", (templateName, changeName) => {
  cy.contains(templateName)
    .parent('div').parent('td').parent('tr')
    .within(() => {
      cy.get('td').eq(6).click();
    })
  cy.get('.md-field').first().next().children('input').clear().type(changeName);
  cy.get('.md-dialog button')
    .contains('OK')
    .click()
    .wait('@editTemplate', { timeout: 20000 })
    .then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  cy.contains(changeName).should('be.visible');
  cy.checkReloadSuccess();
  cy.contains(changeName).should('be.visible');
})

Cypress.Commands.add("openMaskingPopup", (templateName) => {
  cy.contains(templateName)
    .parent('div').parent('td').parent('tr')
    .within(() => {
      cy.get('td').eq(6).find('button').click();
    })
  cy.get('label').contains('Masking')
    .parent('.md-field')
    .children('.md-input')
    .click();
})

Cypress.Commands.add("ignoreStringMasking", () => {
  cy.get('label').contains('Masking')
    .parent('.md-field')
    .children('.md-input')
    .click();
  cy.get('select').first().children('option').should((el) => {
    const value = ['Text', 'Integer', 'Float', 'Dictionary', 'Segment'];
    expect(el).to.have.length(5);
    for (let i = 0 ; i<value.length; i++) {
      expect(el.eq(i)).to.contain(value[i]);
    }
  })
  cy.get('button').contains('ADD').click();
  cy.get('.value').children('input[type=text]').clear();
  cy.get('.editor-content')
    .find('button')
    .last()
    .should('be.disabled');
  
  for(let i =0; i< 15; i++){
    cy.get('button').contains('ADD').click();
  }
  cy.get('button').contains('ADD').should('not.be.visible');
})