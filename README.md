# Mobform

Typescript first Form/Field state & validation, powered by MobX and inspired by Angular forms.

## Features

- Validation (sync or async)
- Parsing and formatting of values
- Resetting fields
- Naming of fields
- Grouping of fields
- Auto remove/add of fields from state depending on whether the component is present.
- Custom components (it's up to the library consumer to implement their own state-enabled components).

## Installation

`npm install --save @mobform/mobform` / `yarn add @mobform/mobform`

MobX and React are peer dependencies and will need to be installed separately.

## Examples

- Creating a state-enabled field (todo)
- Using a state-enabled field (todo)
- Grouping fields (todo)
- Resetting field groups (todo)
- Validation (todo)
- Async validation (todo)
- Conditional validation (todo)
- Formatters and parsers (todo)
- Use with react-bootstrap (todo)
- Use with material-ui (todo)
- Full form/app example (todo)

## Basic usage

### Concepts

Mobform can be broken down into three parts.

#### FieldStates

A container for field values as well an interface for exposing
onChange, validation and field reset methods.

#### FieldGroupStates

Provides a way to group fields to check their validity and get their values.

#### Validators

Sync or async functions for validating a field's value.

### Creating a state-enabled field component

To create a state-enabled field we use the `withFieldProps` helper, this
helper takes a function and provides a number of methods and values derived from the field state that we are required to implement for
mobform to work properly.

Most of these are probably self explanatory but to clarify:

- `value` is the value that the user will see in the input.
- `validate()` is a function that triggers validation - in the example below we are validating onBlur (when the browser focus leaves the input)
- `onChange(value)` is a function that takes the updated value, if we don't call this nothing will change.
- `error` is an ES6 Map of errors tracked by our fieldState.

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

## FieldGroups

FieldGroups allow us to group fields together so they are easier to manage.
Nesting a Field component inside an FieldGroup component will automatically add that field to the FieldGroup's FieldGroupState (via React's context API).

We can then query the FieldGroupState to check if the form as a whole is valid, as well as get the values of all the fields with `FieldGroupState.value` which will give us an object that looks like this: `{<fieldName>: <fieldValue>}`.

Forms can also be nested - the name of the form will be a key in the parent form's `.value` object.

```tsx
/**
 * Form Usage
 */
import * as React from "react";
import { FieldGroupState, FieldState, Validators, FieldGroup } from "mobform";
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

const FieldGroupState = new FieldGroupState({
  name: "basicForm"
});

@observer
export class FieldGroupExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <FieldGroup FieldGroupState={FieldGroupState}>
        <TextInputField fieldState={firstNameFieldState} />
        <TextInputField fieldState={lastNameFieldState} />
        <div>Form valid: {`${FieldGroupState.valid}`}</div>
        <div>Field values: {`${JSON.stringify(FieldGroupState.value)}`}</div>
      </FieldGroup>
    );
  }
}
```

## Parsers and Formatters

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

## Api Reference

### FieldState

#### Constructor

```
const fieldState = new FieldState<T, V>({
  name: string,
  initialValue: T,
  transform?: {
    formatter: (modelValue: T) => V,
    parser: (viewValue: V) => T
  },
  validators?: Validator[]
});
```

#### Instance

```
FieldState<T, V> {
  valid: boolean;
  invalid: boolean;
  dirty: boolean;
  pristine: boolean;
  touched: boolean;
  untouched: boolean;
  validating: boolean;

  // Alias for model value
  value: T;

  // The "real" value
  modelValue: T;

  // The value seen by the user - "the rendered value";
  viewValue: V;

  // The value that the field will be set to when reset() is called
  initialValue: T;

  validators: ObservableMap<string, Validator>;
  error: ObservableMap<string, boolean>;

  name: string;

  // Updates the view value
  onChange(newValue: V): void;

  // Resets field back to initialValue and back to a valid state
  reset(): void;

  // Parses view value and runs validation
  // if validation passes it will commit the new value to the model value.
  async validate(): boolean;
}
```

## FieldGroupState

#### Constructor

```
const FieldGroupState = new FieldGroupState({
  name: string
});
```

#### Instance

```
 FieldGroupState {
  // The fields currently in the form's context (child components)
  fields: FieldState<any>[];

  // valid / pristine / untouched etc will only be true if ALL of the fields
  // are in this state as well.

  valid: boolean;
  invalid: boolean;
  dirty: boolean;
  pristine: boolean;
  touched: boolean;
  untouched: boolean;
  validating: boolean;

  // Calls reset on all of it's fields (including nested FieldGroups).
  reset(): void

  // If you are using the React helpers you will probably never need these.
  // The withFieldProps wrapper component calls these in react lifecycle methods
  // to remove and add fields dynamically.
  //
  // A form object is an interface that both FieldGroups and FieldStates conform to.
  addField<T>(formObject: FormObject<T>): void;
  removeField<T>(formObject: FormObject<T>): void;
 }
```

## Validators

Exposes a set of already-made validators for convenience. They are all exposed
as factory functions which take arguments for configuration.

```
Validators.required(): Validator
Validators.minLength(minLength: number): Validator
Validators.maxLength(maxLength: number): Validator
Validators.pattern(pattern: RegExp): Validator
```

## withFieldProps()

A HOC for creating stateful field components.
Where `V` is the view value (eg: string for a text input) and `P` are other props.

```
  const StateEnabledComponent: React.SFC<FieldProps<V, P>> = withFieldProps<P, V>(Component)
```

## validator()

The validator helper creates a validator (basically just an object with a validator
function and an errorKey). The object returned by validator() can be passed into a fieldState's `Validator[]` array.

The validator function is passed the parsed "model" value (T) as well as the current view value (V).
In most cases the validation will be performed on the modelValue however at times it may be necessary to validate the view value (see the formattersAndParsers example).

```
validator<T, V>(errorKey: string, (value: T, viewValue: V) => boolean | Promise<boolean>): Validator
```

## withKey()

Takes a validator and an error key to override the default key.
This can come in handy when using something like `Validators.pattern`
where you may have more than one pattern validator which require different error messages.

```
  withKey(validator: Validator, errorKey: string): Validator
```
