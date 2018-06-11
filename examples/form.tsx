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

const formState = new FormState({
  name: "basicForm"
});

@observer
export class FormExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <FSForm formState={formState}>
        <TextInputField fieldState={firstNameFieldState} />
        <TextInputField fieldState={lastNameFieldState} />
        <div>Form valid: {`${formState.valid}`}</div>
        <div>Field values: {`${JSON.stringify(formState.value)}`}</div>
      </FSForm>
    );
  }
}
