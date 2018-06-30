import { FieldGroupState } from "./FieldGroup";
import { FieldState } from "./index";

export type FieldGroupContextValue = FieldOptions & {
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
  validationStrategy?: ValidationStrategy;
}

export interface FieldGroupConfig {
  name: string;
}

export interface FieldGroupContextProps {
  parent?: FieldGroupContextValue;
}

export type FieldGroupProps = FieldGroupContextProps;

export type FieldProps<V, P = {}> = P &
  FieldOptions & {
    fieldState: FieldState<any, V>;
  };

export type FieldOptions = {
  disableResetOnUnmount?: boolean;
  disableRemoveFromParentOnUnmount?: boolean;
};

export type ValidatorFn<V> = (viewValue: V) => Promise<boolean> | boolean;

export interface ValidationStrategy {
  onChange?: (this: FieldState<any>) => void;
  onBlur?: (this: FieldState<any>) => void;
}
