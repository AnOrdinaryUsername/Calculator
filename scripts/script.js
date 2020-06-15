'use strict';
/**
 * Records the amount of chars on calculator display.
 */
class CharCounter {
  /** @param {number} count The counter to store chars. */
  constructor(count) {
    /** @private {number} */
    this.count = count;
  }

  /** @param {string} str The string added to the display.
    * @return {number} */
  incrementCount(str) {
    return this.count += str.length;
  }

  /** @return {number} */
  decrementCount() {
    return this.count -= 1;
  }

  /** @return {void} */
  resetCount() {
    this.count = 0;
  }

  /** @return {boolean} */
  maxChars() {
    return (this.count >= 12);
  }
}

const clearDisplay = (object) => {
  document.querySelector('.results').textContent = '';
  object.resetCount();
};

const deleteLastChar = (object) => {
  const number = document.querySelector('.results').textContent;
  document.querySelector('.results').textContent = number.slice(0, -1);
  object.decrementCount();
};

const removeCharButtons = (object) => {
  document.querySelector('#clear').addEventListener('click', function(e) {
    clearDisplay(object);
    e.stopPropagation();
  });

  document.querySelector('#delete').addEventListener('click', function(e) {
    deleteLastChar(object);
    e.stopPropagation();
  });
};

const denkoIsPresent = () => {
  return (document.querySelector('.results').textContent === '(´・ω・`)');
};

const calculatorErrorMessage = () => {
  const msg = document.querySelector('.results').textContent;
  return (msg === 'ERR:SYNTAX' || msg === 'ERR:DIVIDE BY 0' ||
          msg === 'ERR:UNSUPPORTED');
};

const adjustTextStyle = () => {
  const display = document.querySelector('.results');
  display.setAttribute('style',
      'text-align: end; font-size: 6rem; padding: 1rem;');
};

const resetTextStyle = () => {
  const display = document.querySelector('.results');
  display.removeAttribute('style');
};

const updateDisplay = (object, string) => {
  if (object.maxChars()) return;

  const existingChar = document.querySelector('.results').textContent;
  document.querySelector('.results').textContent =
          existingChar.concat('', string);

  object.incrementCount(string);
};

const checkParentheses = (object) => {
  const string = document.querySelector('.results').textContent;
  // Filter out everything besides parentheses using a regex
  const newStr = string.replace(/[^()]/g, '');

  if (newStr === '') updateDisplay(object, '(');
  else if (newStr[newStr.length - 1] === '(') updateDisplay(object, ')');
  else if (newStr[newStr.length - 1] === ')') updateDisplay(object, '(');
};

const operationButtons = (object) => {
  document.querySelector('.buttons-wrapper').addEventListener('click',
      function(e) {
        if (e.target.tagName == 'DIV') return;
        if (denkoIsPresent() || calculatorErrorMessage()) clearDisplay(object);

        adjustTextStyle();
        const button = e.target.id;

        if (!isNaN(button)) {
          const numberButton = Array.from({length: 10}, (v, i) => i);

          const index = parseInt(button);
          updateDisplay(object, `${numberButton[index]}`);
          return;
        }

        switch (button) {
          case 'decimal':
            updateDisplay(object, '.');
            break;
          case 'parentheses':
            // Quick note, parentheses has a different function from the rest
            checkParentheses(object);
            break;
          case 'squared':
            updateDisplay(object, '^2');
            break;
          case 'reciprocal':
            updateDisplay(object, '^-1');
            break;
          case 'exponent':
            updateDisplay(object, '^');
            break;
          case 'addition':
            updateDisplay(object, '+');
            break;
          case 'subtraction':
            updateDisplay(object, '-');
            break;
          case 'sq-rt':
            updateDisplay(object, String.fromCharCode(0x221A));
            break;
          case 'division':
            updateDisplay(object, String.fromCharCode(0x00F7));
            break;
          case 'multiplication':
            updateDisplay(object, '*');
            break;
        }
      });
};

// Check if beginning of string is any symbol besides square-root or negative,
// end of string is a math symbol, string has an unfinished bracket, or
// string is empty, and then output the appropriate boolean value
const syntaxError = (string) => {
  const firstChar = string[0];

  switch (firstChar) {
    case '+':
    case '-':
    case '*':
    case '÷':
    case '^':
      return true;
  }

  return ( ( isNaN(string[string.length - 1]) &&
          string[string.length - 1] !== ')' ) ||
          string[string.length - 2] === '(' || string === '');
};

// Unsupported operations are limited to only multiplication between parentheses
const unsupportedError = (string) => {
  // Check for number followed by open parenthesis (e.g. '3(' )
  const numberOpenParen = string.match(/\d[(]/g, '');
  // Check for closed parenthesis followed by number (e.g. ')3; )
  const closeParenNumber = string.match(/\)[0-9]/g, '');

  return (numberOpenParen !== null || closeParenNumber !== null) ? true : false;
};

const computeResultButton = (object) => {
  document.querySelector('#compute').addEventListener('click', function(e) {
    const string = document.querySelector('.results').textContent;

    clearDisplay(object);
    e.stopPropagation();

    // Check for division by 0
    if (string.includes('÷0')) {
      resetTextStyle();
      updateDisplay(object, 'ERR:DIVIDE BY 0');
      return;
    } else if (syntaxError(string)) {
      resetTextStyle();
      updateDisplay(object, 'ERR:SYNTAX');
      return;
    } else if (unsupportedError(string)) {
      resetTextStyle();
      updateDisplay(object, 'ERR:UNSUPPORTED');
      return;
    }

    // Parser provided by Jison (https://zaa.ch/jison/).
    // More details at how to get the parse file at bottom of jison.js file.
    updateDisplay(object, compute.parse(string));
  });
};

const main = () => {
  const INIT = 0;
  const displayScreen = new CharCounter(INIT);

  removeCharButtons(displayScreen);
  operationButtons(displayScreen);
  computeResultButton(displayScreen);
};

main();
