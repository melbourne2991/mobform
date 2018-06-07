/**
 * Basic Usage
 */
import * as React from "react";
import { FormState, FieldState, Validators } from "../src";
import { observer } from "mobx-react";

/**
 * A state enabled text input we created earlier.
 */
import { TextInputField } from "./components/TextInputField";

export interface AppState {
  formState: FormState;
}

const textInputFieldState = new FieldState({
  name: "firstName",
  initialValue: "Jim",
  validators: [
    Validators.Required(),
    Validators.MinLength(5),
    Validators.MaxLength(20)
  ]
});

@observer
export class BasicExample extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      formState: new FormState()
    };
  }

  render() {
    return <TextInputField fieldState={textInputFieldState} />;
  }
}
