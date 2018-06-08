/**
 * Form Usage
 */
import * as React from "react";
import { FormState, FieldState, Validators, FSForm } from "../src";
import { observer } from "mobx-react";

/**
 * A state enabled text input we created earlier.
 */
import { TextInputField } from "./components/TextInputField";

export interface AppState {
  formState: FormState;
}

const firstNameFieldState = new FieldState({
  name: "firstName",
  initialValue: "Jim",
  validators: [Validators.required()]
});

const lastNameFieldState = new FieldState({
  name: "lastName",
  initialValue: "Smith",
  validators: [Validators.required()]
});

@observer
export class FormExample extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      formState: new FormState()
    };
  }

  render() {
    return (
      <FSForm formState={this.state.formState}>
        <TextInputField fieldState={firstNameFieldState} />
        <TextInputField fieldState={lastNameFieldState} />
        <div>Form valid: {`${this.state.formState.valid}`}</div>
        <div>
          Field values: {`${JSON.stringify(this.state.formState.fieldValues)}`}
        </div>
      </FSForm>
    );
  }
}
