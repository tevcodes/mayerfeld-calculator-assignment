const display = document.querySelector("[data-display]");
const keypad = document.querySelector("[data-keypad]");

if (!display || !keypad) {
  throw new Error("Calculator display or keypad was not found.");
}

// TODO: calculator state lives here (current input, previous value, pending operator)

function handleNumber(value) {
  console.log("Number clicked:", value);
}

function handleOperator(value) {
  console.log("Operator clicked:", value);
}

function handleAction(value) {
  // "clear" | "delete" | "decimal" | "equals"
  console.log("Action clicked:", value);
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !keypad.contains(button)) return;

  const { number, operator, action } = button.dataset;

  if (number !== undefined) handleNumber(number);
  else if (operator !== undefined) handleOperator(operator);
  else if (action !== undefined) handleAction(action);
});
