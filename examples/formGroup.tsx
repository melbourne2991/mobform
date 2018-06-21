/**
 * Form Usage
 */
import * as React from "react";
import { FormGroupState, FieldState, Validators, FormGroup } from "../src";
import { trace } from "mobx";
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

const formGroupState = new FormGroupState({
  name: "basicForm"
});

@observer
export class FormGroupExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    console.log("Rerender!");
    trace();

    return (
      <FormGroup formGroupState={formGroupState}>
        <TextInputField fieldState={firstNameFieldState} />
        <TextInputField fieldState={lastNameFieldState} />
        <div>Form valid: {`${formGroupState.valid}`}</div>
        <div>
          Field values: <code>{`${JSON.stringify(formGroupState.value)}`}</code>
        </div>
      </FormGroup>
    );
  }
}
