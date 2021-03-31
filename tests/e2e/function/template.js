export const ignoreStringMasking = () => {
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
}

export const openMaskingPopup = (templateName) => {
  cy.contains(templateName)
    .parent('div').parent('td').parent('tr')
    .within(() => {
      cy.get('td').eq(6).find('button').click();
    })
  cy.get('label').contains('Masking')
    .parent('.md-field')
    .children('.md-input')
    .click();
}