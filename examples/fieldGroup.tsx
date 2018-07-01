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

const fieldGroupState = new FieldGroupState({
  name: "basicForm"
});

@observer
export class FieldGroupExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div>
        <FieldGroup fieldGroupState={fieldGroupState}>
          <TextInputField fieldState={firstNameFieldState} />
          <TextInputField fieldState={lastNameFieldState} />
          <div>Form valid: {`${fieldGroupState.valid}`}</div>
          <div>
            Field values:
            <code>{`${JSON.stringify(fieldGroupState.value)}`}</code>
          </div>
        </FieldGroup>
      </div>
    );
  }
}
