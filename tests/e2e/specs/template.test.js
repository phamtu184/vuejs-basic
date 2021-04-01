describe('Template test', () => {
  const url = Cypress.config().testUrl;
  let templateName = 'New template name ' + Date.now();
  let templateId = Date.now();
  let id = 0;

  beforeEach(() => {
    cy.navigateTemplate();
    cy.routeTemplate();
  })

  it('Add template success', () => {
    cy.get('button[name=upload]').click();
    cy.get('.md-field').first().next().type(templateName);
    cy.get('.md-dialog button').contains('OK').click().wait('@addTemplate', { timeout: 20000 })
      .then((xhr) => {
        expect(xhr.status).to.equal(200);
        id = xhr.response.body.data.id;
      });
    cy.reload()
    cy.contains(templateName).should('be.visible');
  })

  it('Add template fail', () => {
    cy.get('button[name=upload]').click();
    cy.get('.md-field').first().next().type('()*+,.\/:;<=>?^`{}~');
    cy.get('.md-dialog button').contains('OK').click().wait('@addTemplate', { timeout: 20000 })
      .then((xhr) => {
        expect(xhr.status).to.not.equal(200);
      });
    cy.contains('The name format is invalid').should('be.visible');
  })

  it('Add template success have id', () => {
    cy.addTemplate('template name', templateId);
  })

  it('Add template fail have id', () => {
    cy.get('button[name=upload]').click();
    cy.get('.md-field').first().next().type('template name');
    cy.get('.md-field').first().type('id: _;-()$#@$#@$');
    cy.get('.md-dialog button').contains('OK').click().wait('@addTemplate', { timeout: 20000 })
      .then((xhr) => {
        expect(xhr.status).to.not.equal(200);
      });
    cy.contains('The modified id format is invalid').should('be.visible');
  })

  it('Check title masking popup when add template', () => {
    cy.openMaskingPopup(templateName);
    cy.get('.header.title').should('contain', templateName);
  })

  it('Check title masking popup when edit template', () => {
    cy.get('button[name=upload]').click();
    cy.get('label').contains('Masking')
      .parent('.md-field')
      .children('.md-input')
      .click();
    cy.get('.header.title').should('contain', '');
  })

  it('Param editor add check ignore string (text, segment)', () => {
    cy.get('button[name=upload]').click();
    cy.ignoreStringMasking();
  })

  it('Param editor edit check ignore string (text, segment)', () => {
    cy.contains(templateName)
      .parent('div').parent('td').parent('tr')
      .within(() => {
        cy.get('td').eq(6).find('button').click();
      })
    cy.ignoreStringMasking();
  })

  it('Param editor ignore string input many fields', () => {
    cy.openMaskingPopup(templateName);
    for(let i = 0; i< 3; i++){
      cy.get('button').contains('ADD').click();
      cy.get('.value')
        .children('input[type=text]')
        .eq(i)
        .focus()
        .clear()
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
    cy.openMaskingPopup(templateName);
    cy.get('select').first().select('Integer');
    cy.get('select').last().select('Min Max');
    cy.get('.in-row')
      .find('input')
      .each(($el) => {
        cy.wrap($el)
          .focus()
          .clear()
          .type('9999999999999999')
          .blur()
          .should(($input) => {
            const val = $input.val()
            expect(val).to.include('2147483647');
          })
          .focus()
          .clear()
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
    const changeName = 'Modify template name ' + Date.now();
    cy.changeTemplateName(templateName, changeName)
    templateName = changeName;
  })

  it('Check template name when add name too long (has space)', () => {
    const name = 'Check template name when add name too longCheck template name when add name too longCheck template name when add name too longCheck template name when add name too long';
    cy.addTemplate(name);
    cy.checkEllipsisText(name);
  })

  it('Check template name when add name too long (no space)', () => {
    const name = 'ChecktemplatenamewhenaddnametoolongChecktemplatenamewhenaddnametoolongChecktemplatenamewhenaddnametoolongChecktemplatenamewhenaddnametoolongChecktemplatenamewhenaddnametoolong';
    cy.addTemplate(name);
    cy.checkEllipsisText(name);
  })

  it('Check template name when edit name too long (has space)', () => {
    const name = 'Check template name when add name too longCheck template name when add name too longCheck template name when add name too longCheck template name when add name too long';
    cy.changeTemplateName(templateName, name);
    templateName = name;
    cy.checkEllipsisText(name);
  })

  it('Check template name when edit name too long (no space)', () => {
    const name = 'ChecktemplatenamewhenaddnametoolongChecktemplatenamewhenaddnametoolongChecktemplatenamewhenaddnametoolongChecktemplatenamewhenaddnametoolongChecktemplatenamewhenaddnametoolong';
    cy.changeTemplateName(templateName, name);
    templateName = name;
    cy.checkEllipsisText(name);
  })

  it('Delete template', () => {
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

  it('Delete all template, check no template', () => {
    cy.get('thead').find('.md-checkbox').click();
    cy.get('button[name=delete]').click()
      .wait('@getTemplate', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('.md-dialog button').contains('OK').click()
      .wait('@deleteTemplate', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.contains('No template found').should('be.visible');
  })

})