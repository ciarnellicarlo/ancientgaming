/// <reference types="cypress" />

describe('dice loads correctly', () => {
    it('intercepts bets and visits dice', () => {
        cy.intercept('GET', 'https://api-staging.csgoroll.com/graphql?operationName=DiceBets*', (req) => {
            req.reply( res => {
                for(let i = 0; i < res.body.data.diceBets.edges.length; i++) {
                    res.body.data.diceBets.edges[i].node.amount = ""
                    res.body.data.diceBets.edges[i].node.id = ""
                    res.body.data.diceBets.edges[i].node.createdAt = ""
                    res.body.data.diceBets.edges[i].node.choice = ""
                    res.body.data.diceBets.edges[i].node.profit = ""
                    res.body.data.diceBets.edges[i].node.user = ""
                    res.body.data.diceBets.edges[i].node.roll = ""
                }
            })
          }).as('BetsApi')
        cy.visit("https://csgoroll-www-master-h7r4kpopga-uc.a.run.app/dice", {
            auth: {
              username: 'ancient',
              password: 'things',
            }
          })
    })
})

describe('betting buttons work correctly', () => {
    it('gets and clicks on the bet buttons', () => {
        cy.get('[data-test="plus-1"]').click()
        cy.get('[data-test="plus-10"]').click()
        cy.get('[data-test="x2"]').click()
        cy.get('[data-test="1-div-2"]').click()
    })
    it('updates total bet amount element', () => {
        cy.get('[data-test="profit-on-win"]').children().children('[data-cy="value"]').contains('12.00')
    })
    it('clears bet amount', () => {
        cy.get('[data-test="clear"]').click()
        cy.get('[data-test="profit-on-win"]').children().children('[data-cy="value"]').contains('0.00')
        cy.get('[data-test="plus-1"]').click()
    })
    it('restores bet amount to 1', () => {
        cy.get('[data-test="plus-1"]').click()
    })
})

describe('clicking choice label changes value', () => {
    it('checks content of choice label', () => {
        cy.get('[data-test="choice-label"]').contains("Under")
        cy.contains('[data-test="choice-label"]', 'Over').should('not.exist')
    })
    it('clicks on choice label', () => {
        cy.get('[data-test="choice-label"]').click()
    })
    it('checks if content of choice label changes', () => {
        cy.get('[data-test="choice-label"]').contains("Over")
        cy.contains('[data-test="choice-label"]', 'Under').should('not.exist')
    })
})

describe('drag and drop slider changes input values', () => {
    it('checks input content', () => {
        cy.get('[data-test="threshold"]').should('have.value', '52.49')
        cy.get('[data-test="multiplier"]').should('have.value', '2')
        cy.get('[data-test="chance"]').should('have.value', '47.5')
    })

    it('gets and drags the handle', () => {
        cy.get('.handle')
        .trigger('mousedown', { which: 1, pageX: 200, pageY: 600 })
        .trigger('mousemove', { which: 1, pageX: 420, pageY: 600 })
        .trigger('mouseup')
    })

    it('checks whether input content changed', () => {
        cy.get('[data-test="threshold"]').should('not.have.value', '52.49')
        cy.get('[data-test="multiplier"]').should('not.have.value', '2')
        cy.get('[data-test="chance"]').should('not.have.value', '47.5')
    })
})

describe('updating rolls count in spray mode updates button text', () => {
    it('gets and clicks spray button', () => {
        cy.get('[data-test="mode-batch"]').click()
    })
    it('checks if content of dice button is 2', () => {
        cy.get('.btn-roll').children().contains("ROLL 2 TIMES")
    })
    it('changes rolls input to 3', () => {
        cy.get('[data-test="rolls-per-click"]').clear().type('3')
    })
    it('checks if content of dice button is 3', () => {
        cy.get('.btn-roll').children().contains("ROLL 3 TIMES")
    })
})

describe('bet list is empty', () => {
    it('confirms bet list is empty and results to no profit', () => {
        cy.get('tbody')
        .children('tr')
        .within(() => {
            cy.get('td').eq(0).should('be.empty')
            cy.get('td').eq(1).children('span').should('be.empty')
            cy.get('td').eq(2).should('be.empty')
            cy.get('td').eq(3).children().children('[data-cy="value"]').should('be.empty')
            cy.get('td').eq(6).should('be.empty')
            cy.get('td').eq(7).children().children('[data-cy="value"]').should('have.text', '0.00')
        })
    })
})