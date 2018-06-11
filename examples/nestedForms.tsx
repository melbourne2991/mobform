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

const parentFormState = new FormState({
  name: "parentForm"
});

const childFormStateA = new FormState({
  name: "childFormA"
});

const childFormStateB = new FormState({
  name: "childFormB"
});

@observer
export class NestedFormsExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <FSForm formState={parentFormState}>
        <FSForm formState={childFormStateA}>
          <TextInputField fieldState={firstNameFieldStateA} />
          <TextInputField fieldState={lastNameFieldStateA} />
          <div>Form valid: {`${childFormStateA.valid}`}</div>
          <div>Field values: {`${JSON.stringify(childFormStateA.value)}`}</div>
        </FSForm>

        <FSForm formState={childFormStateB}>
          <TextInputField fieldState={firstNameFieldStateB} />
          <TextInputField fieldState={lastNameFieldStateB} />
          <div>Form valid: {`${childFormStateB.valid}`}</div>
          <div>Field values: {`${JSON.stringify(childFormStateB.value)}`}</div>
        </FSForm>

        <div>Parent Form valid: {`${parentFormState.valid}`}</div>
        <div>
          Parent Form Field values: {`${JSON.stringify(parentFormState.value)}`}
        </div>
      </FSForm>
    );
  }
}
