/**
 * Basic Usage
 */
import * as React from "react";
import { FieldState, Validators } from "../src";
import { observer } from "mobx-react";

/**
 * A state enabled text input we created earlier.
 */
import { TextInputField } from "./components/TextInputField";

const firstNameFieldState = new FieldState({
  name: "firstName",
  initialValue: "Jim",
  validators: [
    Validators.required(),
    Validators.minLength(5),
    Validators.maxLength(20)
  ]
});

@observer
export class BasicExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return <TextInputField fieldState={firstNameFieldState} />;
  }
}
