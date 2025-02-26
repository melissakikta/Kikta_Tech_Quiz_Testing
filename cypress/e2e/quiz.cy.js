// import mockQuestions from '../fixtures/mockQuestions';


describe('Quiz App E2E', () => {
  beforeEach(() => {
    
    //Visit the app
    cy.visit('/');
  });

  it('should start the quiz and load a question', () => {
    //Click the start button
    cy.get('button').contains('Start Quiz').click();

    //Check for the first question
    cy.get('h2').should('not.be.empty');
    
  });

  it('Work through all questions', () => {

    //start the quiz
    cy.get('button').contains('Start Quiz').click();

    //first question should render after API call resolves (no delay)
    cy.get('h2').should('not.be.empty');

    //simulate clicking the correct answer
    for (let i = 0; i < 10; i++) {
      cy.get('button').contains('1').click();
    }

    //2 mock questions, so the quiz should now be complete
    cy.get('h2').contains('Quiz Complete').should('exist');

    cy.get('div')
    .contains('Your score:')
    .should('exist');
  });

  //This is testing if user can take the test again after completing it
  it('should restart the quiz when the "Take New Quiz" button is clicked', () => {
    //start quiz
    cy.get('button').contains('Start Quiz').click();


    //Check for the first question
    cy.get('h2').should('not.be.empty');

    //simulate clicking the correct answer
    for (let i = 0; i < 10; i++) {
      cy.get('button').contains('1').click();
    }

    // //the quiz should now be complete
    cy.get('h2').contains('Quiz Complete').should('exist');
  
    // //click the "Take New Quiz" button
    cy.get('button').contains('Take New Quiz').click();
  });

});