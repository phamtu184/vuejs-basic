import {navigateTemplate} from '../function/base';
import {ignoreStringMasking, openMaskingPopup} from '../function/template'

describe('Template test', () => {
  let templateName = 'New template' + Date.now();
  const url = Cypress.config().testUrl;
  let id = 0;
  beforeEach(() => {
    navigateTemplate();
    cy.server();
  })

  it('Add template', () => {
    cy.route('POST', `${url}/api/template/create`).as('addTemplate');
    cy.get('button[name=upload]').click();
    cy.get('.md-field').first().next().type(templateName);
    cy.get('.md-dialog button').contains('OK').click().wait('@addTemplate', { timeout: 20000 })
      .then((xhr) => {
        expect(xhr.status).to.equal(200);
        id = xhr.response.body.data.id;
      });
    cy.contains(templateName).should('be.visible');
  })

  it('Param editor add check ignore string (text, segment)', () => {
    cy.get('button[name=upload]').click();
    ignoreStringMasking();
  })

  it('Param editor edit check ignore string (text, segment)', () => {
    cy.contains(templateName)
      .parent('div').parent('td').parent('tr')
      .within(() => {
        cy.get('td').eq(6).find('button').click();
      })
    ignoreStringMasking();
  })

  it('Param editor ignore string input many fields', () => {
    openMaskingPopup(templateName);
    for(let i = 0; i< 3; i++){
      cy.get('button').contains('ADD').click();
      cy.get('.value').children('input[type=text]').eq(i).clear()
      .type(":`~!@#$%^&*()_++++++)+_)(*)*(*&*^&*^&^%%$^$##$%@#@!!~~123245:|ƯƠ<>?pươ';/..,/đãggguố iwow ợ fda 日本人faf789541613FU   中文 中文 中文  عربىعربىعربىعربىعربى  русский русский русский русский русский ภาษาไทยภาษาไทยภาษาไทยภาษาไทย")
      .blur();
    }
    cy.contains('Param is too long!').should('be.visible');
    cy.get('.editor-content')
      .children('.footer')
      .children('button')
      .last()
      .should('be.disabled');
  })

  it('Param editor integer min max check', () => {
    openMaskingPopup(templateName);
    cy.get('select').first().select('Integer');
    cy.get('select').last().select('Min Max');
    cy.get('.in-row')
      .find('input')
      .each(($el) => {
        cy.wrap($el)
          .focus()
          .type('9999999999999999')
          .blur()
          .should(($input) => {
            const val = $input.val()
            expect(val).to.include('2147483647');
          })
          .clear()
          .focus()
          .type('-9999999999999999')
          .blur()
          .should(($input) => {
            const val = $input.val()
            expect(val).to.include('-2147483648');
          })
      });
    cy.get('input[name=int-max]').focus().clear().type('123').blur();
    cy.get('input[name=int-min]').focus().clear().type('456').blur();
    cy.contains('Invalid input values').should('be.visible');
    cy.get('.editor-content')
      .children('.footer')
      .children('button')
      .last()
      .should('be.disabled');
  })

  it('Change template name', () => {
    cy.route('POST', `${url}/api/template`).as('editTemplate');
    cy.contains(templateName)
      .parent('div').parent('td').parent('tr')
      .within(() => {
        cy.get('td').eq(6).click();
      })
    templateName = 'Modify template' + Date.now();
    cy.get('.md-field').first().next().children('input').clear().type(templateName);
    cy.get('.md-dialog button').contains('OK').click().wait('@editTemplate', { timeout: 20000 })
      .then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.contains(templateName).should('be.visible');
  })

  it('Delete template', () => {
    cy.route('POST', `${url}/api/template/delete`).as('deleteTemplate');
    cy.route('GET', `${url}/api/template/usage/` + id).as('getTemplate');
    cy.contains(templateName).click();
    cy.get('button[name=delete]').click()
      .wait('@getTemplate', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('.md-dialog button').contains('OK').click()
      .wait('@deleteTemplate', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

})