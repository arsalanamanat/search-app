
describe('Seach App Tests', () => {

  beforeEach(() => {
    cy.visit('/')
  })


  it('visits the app root url and validate necessary elements are visible', () => {

    cy.get('.container > :nth-child(1)').contains('Search Engine Application').should('be.visible')
    cy.get('.search-container > :nth-child(1) > h1').contains('Search cities').should('be.visible')
    cy.get('.search-container :nth-child(2) > h1').contains('Search books').should('be.visible')

    cy.get(':nth-child(1) > .search-bar > #search').should('be.visible')
    cy.get(':nth-child(2) > .search-bar > #search').should('be.visible')

  })


  it('Ensures that no data is returned when MINIMUM_QUERY_LENGTH < 3 ', () => {

    cy.get(':nth-child(1) > .search-bar > #search').should('be.visible').clear().type('sa')
    cy.get('.is-warning').should('be.visible').contains('At least 3 are required to complete the search!')
    cy.get(':nth-child(2) > .search-bar > #search').should('be.visible').clear().type('sa')
    cy.get(':nth-child(2) > .search-bar > .is-warning').should('be.visible').contains('At least 3 are required to complete the search!')

  })

  it('Ensures that no data is returned when the value does not exists in dataset', () => {    

    cy.get(':nth-child(1) > .search-bar > #search').should('be.visible').clear().type('saaa')
    cy.get('span').should('be.visible').contains('No results Found')
    cy.get(':nth-child(2) > .search-bar > #search').should('be.visible').clear().type('daaa')
    cy.get('span').should('be.visible').contains('No results Found')

  })


  it('Ensures that it should return correct data when input is correct', () => {    

    cy.get(':nth-child(1) > .search-bar > #search').should('be.visible').clear().type('san francisco')
    cy.get('.result').should('be.visible').contains('san francisco')
    cy.get(':nth-child(2) > .search-bar > #search').should('be.visible').clear().type('don')
    cy.get('span').should('be.visible').contains('Don Quixote Miguel De Cervantes')

  })
})
