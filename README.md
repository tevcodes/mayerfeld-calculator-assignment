# mayerfeld-calculator-assignment

# Calculator

A team calculator project. HTML/CSS and JS are built in parallel, so this
document defines the contract between them.

## Who owns what

| File             | Owner          | Notes                                    |
| ---------------- | -------------- | ---------------------------------------- |
| `css/styles.css` | Design         | Free to restyle anything not listed below |
| `js/script.js`   | Logic team     | Free to change anything not listed below  |
| `index.html`     | Shared         | Any change is a contract change: say so in the PR |

## The contract (do not rename or remove without telling the other side)

### JS hooks (data attributes)

| Attribute       | Where                  | Meaning                                        |
| --------------- | ---------------------- | ---------------------------------------------- |
| `data-display`  | the `<output>`         | Where the current value is shown               |
| `data-keypad`   | the keypad `<div>`     | Container for click delegation                 |
| `data-number`   | digit buttons          | Value is the digit: `"0"`-`"9"`                |
| `data-operator` | operator buttons       | Value is the computable operator: `+ - * /`    |
| `data-action`   | other buttons          | One of `clear`, `delete`, `decimal`, `equals`  |

The button's visible text (`÷`, `×`, `−`) is presentation only. Use the
`data-*` value in logic.

### State classes (JS toggles them, design styles them)

| Class       | Applied to                      | When                                  |
| ----------- | ------------------------------- | ------------------------------------- |
| `.is-active`| the pending operator button     | After an operator is pressed, until the next number |
| `.is-error` | the display                     | Divide by zero or any invalid result  |

## Rules

- JS selects by `data-*` attributes only, never by styling classes.
- CSS styles by classes only, never by `data-*` attributes.
- Work on a branch and open a PR. Don't commit directly to `main`.

## Running it

Open `index.html` in a browser. No build step.
