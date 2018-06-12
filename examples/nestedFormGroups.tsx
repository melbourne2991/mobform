/**
 * Form Usage
 */
import * as React from "react";
import { FormGroupState, FieldState, Validators, FormGroup } from "../src";
import { observer } from "mobx-react";

/**
 * A state enabled text input we created earlier.
 */
import { TextInputField } from "./components/TextInputField";

const firstNameFieldStateA = new FieldState({
  name: "formA-firstName",
  initialValue: "Jim",
  validators: [Validators.required()]
});

const lastNameFieldStateA = new FieldState({
  name: "formB-lastName",
  initialValue: "Smith",
  validators: [Validators.required()]
});

const firstNameFieldStateB = new FieldState({
  name: "formA-firstName",
  initialValue: "Jim",
  validators: [Validators.required()]
});

const lastNameFieldStateB = new FieldState({
  name: "formB-lastName",
  initialValue: "Smith",
  validators: [Validators.required()]
});

const parentFormState = new FormGroupState({
  name: "parentForm"
});

const childFormStateA = new FormGroupState({
  name: "childFormA"
});

const childFormStateB = new FormGroupState({
  name: "childFormB"
});

@observer
export class NestedFormGroupsExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <FormGroup formGroupState={parentFormState}>
        <FormGroup formGroupState={childFormStateA}>
          <TextInputField fieldState={firstNameFieldStateA} />
          <TextInputField fieldState={lastNameFieldStateA} />
          <div>Form valid: {`${childFormStateA.valid}`}</div>
          <div>
            Field values:{" "}
            <code>{`${JSON.stringify(childFormStateA.value)}`}</code>
          </div>
        </FormGroup>

        <FormGroup formGroupState={childFormStateB}>
          <TextInputField fieldState={firstNameFieldStateB} />
          <TextInputField fieldState={lastNameFieldStateB} />
          <div>Form valid: {`${childFormStateB.valid}`}</div>
          <div>
            Field values:{" "}
            <code>{`${JSON.stringify(childFormStateB.value)}`}</code>
          </div>
        </FormGroup>

        <div>Parent Form valid: {`${parentFormState.valid}`}</div>
        <div>
          Parent Form Field values:{" "}
          <code>{`${JSON.stringify(parentFormState.value)}`}</code>
        </div>
      </FormGroup>
    );
  }
}
