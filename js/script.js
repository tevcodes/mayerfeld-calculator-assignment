const display = document.querySelector("[data-display]");
const keypad = document.querySelector("[data-keypad]");

if (!display || !keypad) {
  throw new Error("Calculator display or keypad was not found.");
}

const operatorButtons = keypad.querySelectorAll("[data-operator]");

const ERROR_TEXT = "Error";
const PRECISION = 12; // significant digits kept in results (hides 0.1 + 0.2 noise)

const OPERATIONS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
};

// Calculator state
let currentValue;    // string being typed / shown
let previousValue;   // number | null, left operand
let pendingOperator; // "+", "-", "*", "/" | null
let startNewNumber;  // next digit replaces the display instead of appending
let hasError;

function resetState() {
  currentValue = "0";
  previousValue = null;
  pendingOperator = null;
  startNewNumber = false;
  hasError = false;
}

resetState();

// Computes previousValue (op) currentValue and puts the result in currentValue.
function evaluate() {
  const result = OPERATIONS[pendingOperator](previousValue, Number(currentValue));

  if (!Number.isFinite(result)) { // divide by zero, overflow
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

  // Chain: 2 + 3 +  -> shows 5 before taking the next operand
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
    if (hasError || startNewNumber) return; // don't edit a computed result
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
    // Needs an operator and a second operand (5 + = does nothing)
    if (hasError || pendingOperator === null || startNewNumber) return;
    evaluate();
    pendingOperator = null;
    previousValue = null;
    startNewNumber = true;
  },
};

// Single place that syncs the UI with state.
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
