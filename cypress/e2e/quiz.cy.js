import mockQuestions from '../fixtures/mockQuestions';


describe('Quiz App E2E', () => {
  beforeEach(() => {
    //Stub the API request for starting the quiz
    cy.intercept('GET', '/api', { 
      statusCode: 200,
      body: mockQuestions,
    }).as('getQuiz')
    
    //Visit the app
    cy.visit('/');
  });

  it('should start the quiz and navigate through questions', () => {
    //start quiz
    cy.get('[data-testid="start-quiz-button"]').click();

    //While questions are loading, check for spinner
    cy.get('[data-testid="quiz-loading-spinner"]').should('exist');

    //Wait for questions
    cy.wait(1000);

    //Check for the first question
    cy.get('h2').contains(mockQuestions[0].question).should('exist');

    //Simulate answering the question. We know the first question is "What is the capital of France?"
    cy.get('button').contains('Paris').click();

    //Quiz moves to the next question
    cy.get('h2').contains(mockQuestions[1].question).should('exist');

    //Simulate answering the question. We know the second question is "What is 2 + 2?"
    cy.get('button').contains('4').click();

    //Quiz is complete
    cy.get('[data-test="quiz-completion"]').should('exist');
    cy.get('data-test="quiz-score"]').should('exist').contains(`Your score is 2/${mockQuestions.length}`);    
  });

  //This is testing if user can take the test again after completing it
  it('should restart the quiz when the "Take New Quiz" button is clicked', () => {
    //start quiz
    cy.get('[data-testid="start-quiz-button"]').click();

    //Simulate answering the first question
    cy.get('button').contains('Paris').click();
    cy.get('button').contains('4').click();

    //Quiz is complete
    cy.get('[data-test="quiz-completion"]').should('exist');

    //Restart the quiz
    cy.get('[data-testid="restart-quiz-button"]').click();

    //Check that the quiz has restarted
    cy.get('h2').contains(mockQuestions[0].question).should('exist');
  });

  //Handing the error case
  it('should display an error message if the API call fails', () => {
    //Intercept the API to get questions and simulate an error.
    cy.intercept('GET', '/api/questions/random', {
      statusCode: 500,
      body: 'Internal Server Error',
    }).as('getQuizFail');

    //start quiz
    cy.get('[data-testid="start-quiz-button"]').click();

    //Wait for the API call to fail
    cy.wait('@getQuizFail');

    //Check for error message
    cy.get('[data-testid="quiz-error-message"]').should('exist').contains('Error loading quiz questions');
  });

});