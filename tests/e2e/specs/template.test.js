import 'cypress-file-upload';
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

  it('Delete used template', () => {
    const name = 'Template' + Date.now();
    let idTemplate = Date.now();
    cy.addTemplate(name, idTemplate);
    cy.checkEllipsisText(name);
    cy.get('ul li a.nav-link').first().children().contains('Projects').click()
      .wait('@fetchProjects', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('.row .my-column .md-card').then(el => {
      if (el.length > 0) {
        cy.get(el.eq(0)).click()
          .wait('@fetchProjectDb', { timeout: 20000 }).then((xhr) => {
            expect(xhr.status).to.equal(200);
          });
      } else {
        //create new project
      }
    });
    cy.get('button .md-ripple div').contains('DB').then(el => {
      if (el.hasClass('md-active')) {

      } else {
        cy.get(el).click();
      }
    });
    cy.get('.slider-menu-item').contains('Tables').click()
      .wait('@fetchTable', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('button .md-ripple div').contains('columns').then(el => {
      if (el.length > 0) {
        cy.get(el.eq(0)).click()
          .wait('@fetchColumn', { timeout: 20000 }).then((xhr) => {
            expect(xhr.status).to.equal(200);
          });
          cy.get('button .md-ripple div').contains('Edit Params').then(col => {
            if(col.length > 0) {
              cy.get(col.eq(0)).click();
              cy.get('select.value').first().select('Template');
              cy.get('button').contains('Refresh').click()
                .wait('@fetchAllTemplate', { timeout: 20000 }).then((xhr) => {
                  expect(xhr.status).to.equal(200);
                });
              cy.get('select.template-list').select(name);
              cy.get('button .md-ripple div').contains('OK').click()
                .wait('@updateColumn', { timeout: 20000 }).then((xhr) => {
                  expect(xhr.status).to.equal(200);
                });
              cy.get('ul li a.nav-link').contains('Templates').click()
                .wait('@getTemplate', { timeout: 20000 })
                .then((xhr) => {
                  expect(xhr.status).to.equal(200);
                });
              cy.wait(100);
              cy.route('GET', `${url}/api/template/usage/` + idTemplate).as('getTemplate');
              cy.contains(name).click();
              cy.get('button[name=delete]').click()
                .wait('@getTemplate', { timeout: 20000 }).then((xhr) => {
                  expect(xhr.status).to.equal(200);
                });
              cy.contains('Are you sure you want to delete template');
              cy.contains(name);
            }
          })
      }
    })
  })

  it('Delete used templates', () => {
    const name = 'Template' + Date.now();
    let idTemplate = Date.now();
    cy.addTemplate(name, idTemplate);
    cy.checkEllipsisText(name);
    cy.get('ul li a.nav-link').first().children().contains('Projects').click()
      .wait('@fetchProjects', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('.row .my-column .md-card').then(el => {
      if (el.length > 0) {
        cy.get(el.eq(0)).click()
          .wait('@fetchProjectDb', { timeout: 20000 }).then((xhr) => {
            expect(xhr.status).to.equal(200);
          });
      } else {
        //create new project
      }
    });
    cy.get('button .md-ripple div').contains('DB').then(el => {
      if (el.hasClass('md-active')) {

      } else {
        cy.get(el).click();
      }
    });
    cy.get('.slider-menu-item').contains('Tables').click()
      .wait('@fetchTable', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('button .md-ripple div').contains('columns').then(el => {
      if (el.length > 0) {
        cy.get(el.eq(0)).click()
          .wait('@fetchColumn', { timeout: 20000 }).then((xhr) => {
            expect(xhr.status).to.equal(200);
          });
          cy.get('button .md-ripple div').contains('Edit Params').then(col => {
            if(col.length > 0) {
              cy.get(col.eq(0)).click();
              cy.get('select.value').first().select('Template');
              cy.get('button').contains('Refresh').click()
                .wait('@fetchAllTemplate', { timeout: 20000 }).then((xhr) => {
                  expect(xhr.status).to.equal(200);
                });
              cy.get('select.template-list').select(name);
              cy.get('button .md-ripple div').contains('OK').click()
                .wait('@updateColumn', { timeout: 20000 }).then((xhr) => {
                  expect(xhr.status).to.equal(200);
                });
              cy.get('ul li a.nav-link').contains('Templates').click()
                .wait('@getTemplate', { timeout: 20000 })
                .then((xhr) => {
                  expect(xhr.status).to.equal(200);
                });
              cy.wait(100);
              cy.route('GET', `${url}/api/template/usage/` + idTemplate).as('getTemplate');
              cy.get('thead').find('.md-checkbox').click();
              cy.get('button[name=delete]').click()
                .wait('@getTemplate', { timeout: 20000 }).then((xhr) => {
                  expect(xhr.status).to.equal(200);
                });
              cy.contains('Are you sure you want to delete these templates');
              cy.contains(name);
            }
          })
      }
    })
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

  it('Add 30 templates, check new page', () => {
    for (let i = 1; i <= 30; i++) {
      const name = 'Template no ' + i;
      const id = Date.now() + i;
      cy.addTemplate(name, id);
    }
    cy.route('GET', `${url}/api/template/fetch/2`).as('fetchTemplate');
    cy.addTemplate('next page template')
      .wait('@fetchTemplate', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('tr.md-table-row').should('have.length', 1);
    cy.get('button[name=left-group]').eq(1).should('have.class', 'md-primary');
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

  it('Upload dictionary success', () => {
    cy.contains('Dictionary').click()
      .wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('button[name=upload]').click();
    cy.get('input[type=file]').attachFile('../files/活性とする.csv');
    cy.contains('OK').click()
      .wait('@uploadDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.contains('活性とする.csv').should('be.visible');
    cy.reload().wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
    cy.contains('活性とする.csv').should('be.visible');
  })

  it('Cancel upload dictionary', () => {
    cy.contains('Dictionary').click()
    .wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
    cy.get('button[name=upload]').click();
    cy.get('input[type=file]').attachFile('../files/test.csv');
    cy.contains('OK').click();
    cy.contains('Cancel').click().wait(1000);
    cy.contains('Upload abort !').should('be.visible');
    cy.contains('Ok').click();
    cy.contains('test.csv').should('not.be.visible');
    cy.reload().wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
    cy.contains('test.csv').should('not.be.visible');
  })

  it('Dictionary file exist override', () => {
    cy.contains('Dictionary').click()
      .wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('button[name=upload]').click();
    cy.get('input[type=file]').attachFile('../files/活性とする.csv');
    cy.contains('OK').click()
      .wait('@uploadDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.contains('File exists !').should('be.visible');
    cy.contains('OK').click()
      .wait('@uploadDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.contains('Upload successful').should('be.visible');
    cy.contains('活性とする.csv').should('be.visible');
    cy.reload().wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
    cy.contains('活性とする.csv').should('be.visible');
  })

  it('Dictionary file exist cancel', () => {
    cy.contains('Dictionary').click()
      .wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('button[name=upload]').click();
    cy.get('input[type=file]').attachFile('../files/活性とする.csv');
    cy.contains('OK').click()
      .wait('@uploadDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.contains('File exists !').should('be.visible');
    cy.contains('Cancel').click();
    cy.contains('Upload successful').should('not.be.visible');
    cy.contains('活性とする.csv').should('be.visible');
  })

  it('Delete dictionary file', () => {
    cy.contains('Dictionary').click()
      .wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('button[name=delete]').should('not.be.visible');
    cy.contains('活性とする.csv').click();
    cy.get('button[name=delete]').should('be.visible').click();
    cy.contains('OK').click()
      .wait('@deleteDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.contains('活性とする.csv').should('not.be.visible');
    cy.reload().wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
    cy.contains('活性とする.csv').should('not.be.visible');
  })

  it('Upload 30 dictionary, check next page', () => {
    cy.contains('Dictionary').click()
      .wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    for (let i=1;i<=30;i++) {
      cy.get('button[name=upload]').click();
      cy.get('input[type=file]').attachFile(`../files/1 copy ${i}.csv`);
      cy.contains('OK').click()
        .wait('@uploadDictionary', { timeout: 20000 }).then((xhr) => {
          expect(xhr.status).to.equal(200);
        });
    }
    cy.get('tr.md-table-row').should('have.length', 1);
    cy.get('button[name=left-group]').eq(1).should('have.class', 'md-primary');
  })

  it('Delete all dictionary file', () => {
    cy.contains('Dictionary').click()
      .wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('button[name=delete]').should('not.be.visible');
    cy.get('thead').find('.md-checkbox').click();
    cy.get('button[name=delete]').should('be.visible').click();
    cy.contains('OK').click()
      .wait('@deleteDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.contains('No file found').should('be.visible');
    cy.reload().wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
    cy.contains('No file found').should('be.visible');
  })

  it('Upload dictionary file with long, japanese name', () => {
    cy.contains('Dictionary').click()
      .wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('button[name=upload]').click()
    cy.get('input[type=file]').attachFile('../files/投すー験53差7文ねぐもイ告近イり件61無いつり法再雪ケムウ依厳ホア期北縮ゃ駐話の教会ふぶぼ際欲町愛亨リ。掲ミナテシ英匿東たぴさゆ月転アヨヲ数管こ問25信号ムヨル報玉市た差抜転チ速原づや覧近整研就に。話ホルサ平写ぜす廃発ユウ質引語ぜだ販正ゃゅ教30左ヨヤヘリ議売文ヘユ効結ざレ.csv');
    cy.contains('OK').should('be.disabled');
  })

  it('Upload dictionary file with none csv extension', () => {
    cy.contains('Dictionary').click()
      .wait('@fetchDictionary', { timeout: 20000 }).then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    cy.get('button[name=upload]').click()
    cy.get('input[type=file]').attachFile('../files/sample.sql');
    cy.contains('OK').should('be.disabled');
  })

})