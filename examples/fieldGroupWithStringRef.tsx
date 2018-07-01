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

const emailFieldState = new FieldState({
  name: "email",
  initialValue: "",
  validators: [Validators.required()]
});

const fieldGroupState = new FieldGroupState({
  name: "basicForm",
  fields: [firstNameFieldState, lastNameFieldState, emailFieldState]
});

@observer
export class FieldGroupStringRefExample extends React.Component<
  {},
  { showFields: boolean }
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      showFields: false
    };
  }

  render() {
    return (
      <div>
        <FieldGroup fieldGroupState={fieldGroupState}>
          <TextInputField fieldState={"firstName"} />
          <TextInputField fieldState={"lastName"} />
          <div>Form valid: {`${fieldGroupState.valid}`}</div>
          <div>
            Field values:
            <code>{`${JSON.stringify(fieldGroupState.value)}`}</code>
          </div>

          <button
            onClick={() =>
              this.setState({ showFields: !this.state.showFields })
            }
          >
            Toggle field
          </button>

          {this.state.showFields && <TextInputField fieldState={"email"} />}

          <button onClick={() => fieldGroupState.validate()}>Validate</button>
        </FieldGroup>
      </div>
    );
  }
}
