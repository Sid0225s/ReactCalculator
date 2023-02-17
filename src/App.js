import "./App.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./Operation";

export const Actions = {
  Add: "add-digit",
  CHOOSE_OP: "choose-operation",
  Clear: "clear",
  Delete: "delete-digit",
  Eval: "evaluate",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case Actions.Add:
      if (state.overwrite) {
        return {
          ...state,
          current: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.current === "0") return { state };

      if (payload.digit === "." && state.current.includes(".")) {
        return state;
      }

      return {
        ...state,
        current: `${state.current || ""}${payload.digit}`,
      };
    case Actions.CHOOSE_OP:
      if (state.previous == null && state.current == null) {
        return state;
      }
      if (state.current == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previous == null)
        return {
          ...state,
          operation: payload.operation,
          previous: state.current,
          current: null,
        };
      return {
        ...state,
        previous: evaluate(state),
        operation: payload.operation,
        current: null,
      };

    case Actions.Clear:
      return {};
    case Actions.Delete:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          current: null,
        };
      }
      if (state.current == null) return state;
      if (state.current.length === 1) {
        return { ...state, current: null };
      }

      return {
        ...state,
        current: state.current.slice(0, -1),
      };

    case Actions.Eval:
      if (
        state.operation == null ||
        state.current == null ||
        state.previous == null
      ) {
        return {
          state,
        };
      }
      return {
        ...state,
        overwrite: true,
        previous: null,
        operation: null,
        current: evaluate(state),
      };
  }
}
function evaluate({ current, previous, operation }) {
  const prev = parseFloat(previous);
  const curr = parseFloat(current);
  if (isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "×":
      computation = prev * curr;
      break;
    case "÷":
      computation = prev / curr;
      break;
  }

  return computation.toString();
}
const IntFormat = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function format(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return IntFormat.format(integer);
  return `${IntFormat.format(integer)}.${decimal}`;
}

function App() {
  const [{ current, previous, operation }, dispatch] = useReducer(reducer, {});
  return (
    <div className="calc-grid">
      <div className="output">
        <div className="previous">
          {" "}
          {format(previous)} {operation}
        </div>
        <div className="current">{format(current)}</div>
      </div>
      <button
        className="span2"
        onClick={() => dispatch({ type: Actions.Clear })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: Actions.Delete })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="×" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />

      <button
        className="span2"
        onClick={() => dispatch({ type: Actions.Eval })}
      >
        =
      </button>
    </div>
  );
}

export default App;
