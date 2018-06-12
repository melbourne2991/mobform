# Mobform

Typescript first Form/Field state & validation, powered by MobX and inspired by Angular forms.

## Installation

`npm install --save mobform` or `yarn add mobform`

MobX and React are peer dependencies and will need to be installed separately.

## Basic usage

### Concepts

Mobform can be broken down into three parts.

#### FieldStates

The core of the library. It is a container for field values as well an interface for exposing
onChange, and validation and field reset methods.

#### FormStates

Provide a way to group fields to check their validity and get their values.

#### Validators

Exactly what they sound like, sync or async functions for validating a field's value.

### Creating a state-enabled field component

To create a state-enabled field we use the `withFieldProps` helper, this
helper takes a function and provides a number of methods and values derived from the field state that we are required to implement for
mobform to work properly.

Most of these are probably self explanatory but to clarify:

- `value` is the value that the user will see in the input.
- `validate()` is a function that triggers validation - in the example below we are validating onBlur (when the browser focus leaves the input)
- `onChange(value)` is a function that takes the updated value, if we don't call this nothing will change.
- `error` is an ES6 Map of errors tracked by our validators.

_Under the hood `withFieldProps` wraps the component in another component which allows for fields to be automatically removed and added to the form state using the context API._

```tsx
import { withFieldProps, FSFieldProps } from "mobform";

/**
 * Create a state enabled field
 */
export const TextInputField: React.SFC<FSFieldProps<string>> = withFieldProps(
  ({ validate, value, onChange, error, valid }) => {
    return (
      <div>
        <input
          type={"text"}
          value={value}
          onBlur={validate}
          onChange={e => onChange(e.target.value)}
        />

        {!valid && (
          <div style={{ color: "red" }}>
            <div>{error.get("required") && "This field is required"}</div>
            <div>{error.get("minLength") && "Not long enough"}</div>
          </div>
        )}
      </div>
    );
  }
);
```

### Using a state-enabled field component

Once we have our mobform enabled field we can pass a field state to it.

```tsx
/**
 * Basic Usage
 */
import * as React from "react";
import { FieldState, Validators } from "mobform";
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
```

The fieldState exposes the value of the field, any errors flagged on that field as well an api for manpulating its state (eg: resetting the field). For example if we wanted to display the value of the field alongside the input we could do this:

```tsx
  render() {
    return  (
      <div>
        <TextInputField fieldState={firstNameFieldState} />;
        {firstNameFieldState.value}
      </div>
    )
  }
```

## Validation

Mobform comes with a few basic Validators out of the box.
To use them you add them to the validators array when creating a fieldstate:

```tsx
const firstNameFieldState = new FieldState({
  name: "firstName",
  initialValue: "Jim",
  validators: [
    Validators.required(),
    Validators.minLength(5),
    Validators.maxLength(20)
  ]
});
```

The name of the validator eg: `minLength` will correspond with the key in the error map.
If the length of the input was 3, the minLength validator would return false and we would be able to query the map and find the error flag is set to true:

```tsx
firstNameFieldState.error.get("minLength"); // true
```

### Custom validators

Creating custom validators is pretty straightforward, it's probably easier to show how one of the built-in validators is implemented:

```tsx
import { validator } from "mobform";

const minLength = (minLength: number) =>
  validator("minLength", (value: string) => {
    return value.length >= minLength;
  });
```

What we have here is a factory function that takes configuration for the validator and then returns the configured validator (created with the `validator` helper). The first argument we pass to this helper is the errorKey which we use to look up errors on `fieldState.error`.

You are also able to return a promise from the validator function if you need to do any kind of async validation.
`FieldState` exposes a `.validating` property so you can display a spinner while waiting for a result from the validator.

### Parsers and Formatters

FieldStates actually maintain two separate values internally. One is the **viewValue** - this is the value that is visible to the user and is the `value` exposed via the `withFieldProps` helper, the other is the **modelValue** (fieldState.value is an alias for fieldState.modelValue). The model value is the actual data represented by the view value.

An example of this might be a date. The user may enter a string eg: `10/02/1990`, however given this represents a date we would like to store this data as a date and not as a string.

To do this we can provide our fieldState with a **parser**, which would convert the string to a Date object:

`User Input -> Parser -> Validator -> Update modelValue with parsed ViewValue`

The problem is we still would still like to be able to set the field programatically, so we also need a way to convert
a date object to a string (for example, when prepopulating a form). This is where **formatters** come in:

`Programattically change fieldState value -> Formatter -> Update viewValue with formatted modelValue`

This way when we set the value: `fieldState.value = new Date()`, the view value will be updated correctly.

Below is an example of using parsers/formatters with momentjs for a date input:

```tsx
/**
 * Formatter and Parsers Usage
 */
import * as React from "react";
import { FieldState, Validators, validator } from "mobform";
import { observer } from "mobx-react";
import * as moment from "moment";

/**
 * A state enabled text input we created earlier.
 */
import { DateInputField } from "./components/DateInputField";

const dateOfBirthFieldState = new FieldState<Date, string>({
  name: "dateOfBirth",
  initialValue: undefined,
  validators: [
    Validators.required(),

    /**
     * Create a custom validator for our date.
     * See the customValidators example for more information
     */
    validator("dateFormat", (value: Date, viewValue: string) => {
      value;
      return moment(viewValue, "DD-MM-YYYY", true).isValid();
    })
  ],
  transform: {
    formatter: date => {
      if (date) {
        return moment(date).format("DD-MM-YYYY");
      }

      return "";
    },
    parser: str => {
      if (str) {
        return moment(str, "DD-MM-YYYY").toDate();
      }

      return undefined;
    }
  }
});

@observer
export class FormattersAndParsersExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div>
        <DateInputField fieldState={dateOfBirthFieldState} />
        <div>
          JS Date (parsed from user input):
          {dateOfBirthFieldState.value &&
            dateOfBirthFieldState.value.toString()}
        </div>
      </div>
    );
  }
}
```
