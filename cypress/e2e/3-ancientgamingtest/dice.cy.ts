/// <reference types="cypress" />

describe('dice loads correctly', () => {
    it('visits the correct url', () => {
        cy.intercept(
            {
                method: 'GET',
                path: 'https://api-staging.csgoroll.com/graphql?operationName=DiceBets',
            },
            {
                data: [],
            },
        )
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
        cy.get('[data-cy="value"]').contains("12.00")
    })
    it('clears bet amount and restores it to 1', () => {
        cy.get('[data-test="clear"]').click()
        cy.get('[data-cy="value"]').contains("0")
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