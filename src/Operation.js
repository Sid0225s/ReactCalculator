import { Actions } from "./App";

export default function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: Actions.CHOOSE_OP, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}
