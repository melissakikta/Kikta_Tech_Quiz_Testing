//Cypress test for the Quiz component
//Test checks if the Quiz component is rendered correctly

//import React from "react";
import { mount } from 'cypress/react18';
import Quiz from "../../client/src/components/Quiz";
import * as questionApi from '../../client/src/services/questionApi';
import mockQuestions from '../fixtures/mockQuestions';


describe('<Quiz /> Component', () => {
  //Before each test, stub the getQuestions API call
  beforeEach(() => {
    cy.stub(questionApi, 'getQuestions').resolves(mockQuestions);
  });

  it('renders the start screen initially', () => {
    mount(<Quiz />);
    //verify that the start screen is rendered
    cy.get('button').contains('Start Quiz').should('exist');
  });

  it('starts the quiz and shows a loading spinner until questions load', () => {
    //Delay the API response to simulate loading
    cy.stub(questionApi, 'getQuestions').callsFake(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockQuestions);
        }, 1000);
      });
    });
  
    mount(<Quiz />);
    
    //Click the start button
    cy.get('button').contains('Start Quiz').click();
    
    //Verify that the loading spinner is displayed
    cy.get('.spinner-borader').should('exist');

    //Check for first question
    cy.wait(1100); //wait is longer than delay in API response
    cy.get('h2').contains(mockQuestions[0].question).should('exist');
  });

  it('handles answer selection and proceeds through questions', () => {
  mount(<Quiz />);

    //start the quiz
    cy.get('button').contains('Start Quiz').click();

    //first question should render after API call resolves (no delay)
    cy.get('h2').contains(mockQuestions[0].question).should('exist');

    //simulate clicking the correct answer
    cy.get('button')
      .contains('1') //first answer button
      .click();

    //the quiz should now move to the next question
    cy.get('h2').contains(mockQuestions[1].question).should('exist');

    //simulate clicking the correct answer
    cy.get('button')
      .contains('4') //second answer button
      .click();

    //2 mock questions, so the quiz should now be complete
    cy.get('h2').contains('Quiz Complete').should('exist');

    cy.get('alert')
    .contains(`Your score is 2/${mockQuestions.length}`)
    .should('exist');
  });

  it('restarts the quiz when the "Take New Quiz" button is clicked', () => {
    mount(<Quiz />);
  
    //start the quiz
    cy.get('button').contains('Start Quiz').click();
  
    //simulate clicking the correct answer
    cy.get('button').contains('1').click(); //first answer button
    cy.get('button').contains('2').click(); //second answer button
  
    //the quiz should now be complete
    cy.get('h2').contains('Quiz Complete').should('exist');
  
    //click the "Take New Quiz" button
    cy.get('button').contains('Take New Quiz').click();
  
    //the quiz should now be back at the start screen
    cy.get('button').contains('Start Quiz').should('exist');
  });
});