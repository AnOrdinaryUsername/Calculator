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
  return (msg === 'ERR:SYNTAX' || msg === 'ERR:DIVIDE BY 0');
};

const adjustTextStyle = () => {
  const display = document.querySelector('.results');
  display.style.textAlign = 'end';
  display.style.fontSize = '6rem';
  display.style.padding = '1rem';
};

const resetTextStyle = () => {
  const display = document.querySelector('.results');
  display.style.removeProperty('text-align');
  display.style.removeProperty('font-size');
  display.style.removeProperty('padding');
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
        } else if (isNaN(button)) {
          if (button === 'decimal') updateDisplay(object, '.');
          // Quick note, parentheses has a different function from the rest
          else if (button === 'parentheses') checkParentheses(object);
          else if (button === 'squared') updateDisplay(object, '^2');
          else if (button === 'reciprocal') updateDisplay(object, '^-1');
          else if (button === 'exponent') updateDisplay(object, '^');
          else if (button === 'addition') updateDisplay(object, '+');
          else if (button === 'subtraction') updateDisplay(object, '-');
          else if (button === 'sq-rt') {
            updateDisplay(object, String.fromCharCode(0x221A));
          } else if (button === 'division') {
            updateDisplay(object, String.fromCharCode(0x00F7));
          } else if (button === 'multiplication') {
            updateDisplay(object, '*');
          }
        }
      });
};

const calculateOperations = (...charArray) => {

};

const computeResultButton = (object) => {
  document.querySelector('#compute').addEventListener('click', function(e) {
    const string = document.querySelector('.results').textContent;
    const newString = string.replace(/[/^]/g, '**');

    clearDisplay(object);
    e.stopPropagation();

    if (isNaN(newString[newString.length - 1]) || newString === '') {
      resetTextStyle();
      updateDisplay(object, 'ERR:SYNTAX');
    } else {
      const charArray = newString.split('');
      updateDisplay(object, calculateOperations(charArray));
    }
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
