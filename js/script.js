const display = document.querySelector("[data-display]");
const keypad = document.querySelector("[data-keypad]");

if (!display || !keypad) {
  throw new Error("Calculator display or keypad was not found.");
}

// Calculator State Variables
let currentValue = "0";
let previousValue = null;
let currentOperator = null;
let shouldResetScreen = false;

// Function to update the screen
function updateDisplay() {
  display.textContent = currentValue;
}
// Handle number button clicks
function handleNumber(value) {
  if (currentValue === "0" || shouldResetScreen){
    currentValue = value;
    shouldResetScreen = false;
  } else{
    currentValue += value;
  }
  updateDisplay();
}

// Basic Math Functions
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) return "Error";
  return a / b;
}

// Operate dispatcher
function operate(operator, a, b){
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case '+': return add(a, b);
    case '-': return subtract(a, b);
    case '*': return multiply(a, b);
    case '/': return divide(a, b);
    default: return b;
  }
}

function handleOperator(value) {
  if (currentOperator !== null && !shouldResetScreen) {
    previousValue = String(operate(currentOperator, previousValue, currentValue));
    currentValue = previousValue;
    updateDisplay();
  } else {
    previousValue = currentValue;
  }

  currentOperator = value;
  shouldResetScreen = true;
}

function handleAction(value) {
  if (value === "clear") {
    currentValue = "0";
    previousValue = null;
    currentOperator = null;
    shouldResetScreen = false;
    updateDisplay();
  }
  else if (value === "equals") {
    if (currentOperator === null || previousValue === null) return;

    currentValue = String(operate(currentOperator, previousValue, currentValue));
    currentOperator = null;
    previousValue = null;
    shouldResetScreen = true;
    updateDisplay();
  }
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !keypad.contains(button)) return;

  const { number, operator, action } = button.dataset;

  if (number !== undefined) handleNumber(number);
  else if (operator !== undefined) handleOperator(operator);
  else if (action !== undefined) handleAction(action);
});
