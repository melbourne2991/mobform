/**
 * Form Usage
 */
import * as React from "react";
import { FieldGroupState, FieldState, Validators, FieldGroup } from "../src";
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

const parentFormState = new FieldGroupState({
  name: "parentForm"
});

const childFormStateA = new FieldGroupState({
  name: "childFormA"
});

const childFormStateB = new FieldGroupState({
  name: "childFormB"
});

@observer
export class NestedFieldGroupsExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <FieldGroup fieldGroupState={parentFormState}>
        <FieldGroup fieldGroupState={childFormStateA}>
          <TextInputField fieldState={firstNameFieldStateA} />
          <TextInputField fieldState={lastNameFieldStateA} />
          <div>Form valid: {`${childFormStateA.valid}`}</div>
          <div>
            Field values:{" "}
            <code>{`${JSON.stringify(childFormStateA.value)}`}</code>
          </div>
        </FieldGroup>

        <FieldGroup fieldGroupState={childFormStateB}>
          <TextInputField fieldState={firstNameFieldStateB} />
          <TextInputField fieldState={lastNameFieldStateB} />
          <div>Form valid: {`${childFormStateB.valid}`}</div>
          <div>
            Field values:
            <code>{`${JSON.stringify(childFormStateB.value)}`}</code>
          </div>
        </FieldGroup>

        <div>Parent Form valid: {`${parentFormState.valid}`}</div>
        <div>
          Parent Form Field values:
          <code>{`${JSON.stringify(parentFormState.value)}`}</code>
        </div>
      </FieldGroup>
    );
  }
}
