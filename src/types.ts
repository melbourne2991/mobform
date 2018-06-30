import { FieldGroupState } from "./FieldGroup";
import { FieldState } from "./index";

export type FieldGroupContextValue = {
  state: FieldGroupState;
};

export interface FormObject<T> {
  parent?: FormObject<any>;
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

export type ValidatorFactory<V> = (...params: any[]) => Validator<V>;

export type Validator<V> = {
  key: string;
  test: ValidatorFn<V>;
};

export type ValidatorConfig<V> = Validator<V>[];

export interface FieldStateConfig<T, V> {
  name: string;

  transform?: {
    parser: (viewValue: V) => T;
    formatter: (modelValue: T) => V;
  };

  initialValue: T;

  validators?: ValidatorConfig<V>;
}

export interface FieldGroupContextProps {
  parent: FieldGroupContextValue;
}

export type FieldGroupProps = FieldGroupContextProps;

export type FieldProps<V, P = {}> = P & InternalFieldProps<V>;

export type InternalFieldProps<V> = {
  fieldState: FieldState<any, V>;
};

export type ValidatorFn<V> = (viewValue: V) => Promise<boolean> | boolean;
