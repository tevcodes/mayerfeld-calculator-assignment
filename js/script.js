const display = document.querySelector("[data-display]");
const keypad = document.querySelector("[data-keypad]");

if (!display || !keypad) {
  throw new Error("Calculator display or keypad was not found.");
}

const operatorButtons = keypad.querySelectorAll("[data-operator]");

const ERROR_TEXT = "Error";
const PRECISION = 12; 

const OPERATIONS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
};

let currentValue;   
let previousValue;   
let pendingOperator; 
let startNewNumber;  
let hasError;

function resetState() {
  currentValue = "0";
  previousValue = null;
  pendingOperator = null;
  startNewNumber = false;
  hasError = false;
}

resetState();

function evaluate() {
  const result = OPERATIONS[pendingOperator](previousValue, Number(currentValue));

  if (!Number.isFinite(result)) { 
    resetState();
    hasError = true;
    currentValue = ERROR_TEXT;
    return;
  }
  currentValue = String(Number(result.toPrecision(PRECISION)));
}

function inputDigit(digit) {
  if (hasError) resetState();

  if (startNewNumber || currentValue === "0") {
    currentValue = digit;
    startNewNumber = false;
  } else {
    currentValue += digit;
  }
}

function chooseOperator(operator) {
  if (hasError) return;

  if (pendingOperator !== null && !startNewNumber) {
    evaluate();
    if (hasError) return;
  }
  previousValue = Number(currentValue);
  pendingOperator = operator;
  startNewNumber = true;
}

const ACTIONS = {
  clear: resetState,

  delete() {
    if (hasError || startNewNumber) return; 
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
    if (currentValue === "-") currentValue = "0";
  },

  decimal() {
    if (hasError) resetState();
    if (startNewNumber) {
      currentValue = "0.";
      startNewNumber = false;
    } else if (!currentValue.includes(".")) {
      currentValue += ".";
    }
  },

  equals() {
   
    if (hasError || pendingOperator === null || startNewNumber) return;
    evaluate();
    pendingOperator = null;
    previousValue = null;
    startNewNumber = true;
  },
};

function render() {
  display.textContent = currentValue;
  display.classList.toggle("is-error", hasError);

  for (const button of operatorButtons) {
    const isPending = startNewNumber && button.dataset.operator === pendingOperator;
    button.classList.toggle("is-active", isPending);
  }
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { number, operator, action } = button.dataset;

  if (number !== undefined) inputDigit(number);
  else if (operator !== undefined) chooseOperator(operator);
  else if (Object.hasOwn(ACTIONS, action)) ACTIONS[action]();
  else return;

  render();
});

render();
