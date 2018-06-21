import { ObservableMap } from "mobx";
import { FormGroupState } from "./FormGroup";
import { FieldState } from "./index";

export type FormGroupContextValue = FormGroupState;

export interface FormObject<T> {
  name: string;

  valid: boolean;
  invalid: boolean;
  dirty: boolean;
  pristine: boolean;
  touched: boolean;
  untouched: boolean;
  validating: boolean;

  value: T;
  reset: () => void;
}

export type Validator<T, V> = {
  key: string;
  test: ValidatorFn<T, V>;
};

export type ValidatorConfig<T, V> = Validator<T, V>[];

export interface FieldStateConfig<T, V> {
  name: string;

  transform?: {
    parser: (viewValue: V) => T;
    formatter: (modelValue: T) => V;
  };

  initialValue: T;

  validators?: ValidatorConfig<T, V>;
}

export interface FormGroupContextProps {
  parent: FormGroupContextValue;
}

export type FieldProps<V, P = {}> = P & {
  fieldState: FieldState<any, V>;
};

export interface InternalFieldProps<V> {
  onChange: (value: V) => void;
  validate: () => void;
  value: V;
  valid: boolean;
  error: ObservableMap<string, boolean>;
}

export type ValidatorFn<T, V> = (
  value: T,
  viewValue: V
) => Promise<boolean> | boolean;
