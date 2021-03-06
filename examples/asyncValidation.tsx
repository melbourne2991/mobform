/**
 * Async Validation
 */
import * as React from "react";
import { FieldState, validator, Validators } from "../src";
import { observer } from "mobx-react";

/**
 * A state enabled text input we created earlier.
 */
import { TextInputField } from "./components/TextInputField";

function someAsyncCall(): Promise<boolean> {
  return new Promise(resolve => setTimeout(() => resolve(false), 500));
}

const firstNameFieldState = new FieldState<string>({
  name: "firstName",
  initialValue: "Jim",
  validators: [
    Validators.required(),

    /**
     * Return a promise from the validator function
     */
    validator("asyncValidation", () => {
      return someAsyncCall();
    })
  ]
});

@observer
export class AsyncValidationExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div>
        <TextInputField fieldState={firstNameFieldState} />
        {firstNameFieldState.validating && "Validating..."}
        An async error:
        {firstNameFieldState.error.get("asyncValidation") && "I am an error."}
      </div>
    );
  }
}
