import {
  observable,
  computed,
  action,
  ObservableMap,
  configure,
  runInAction
} from "mobx";
import * as React from "react";
import { observer } from "mobx-react";

import {
  ValidatorFn,
  Validator,
  InternalFieldProps,
  FieldProps,
  FieldGroupContextProps,
  FormObject,
  FieldStateConfig
} from "./types";

import { withFormContext } from "./FieldGroup";

if (process.env.MOBFORM_DEVELOPMENT) {
  configure({ enforceActions: true });
}

export * from "./types";
export { Validators } from "./Validators";
export { FieldGroup, FieldGroupState } from "./FieldGroup";

// Takes a validator or a validatorFn
export const validator = function<T, V>(
  key: string,
  fn: ValidatorFn<T, V> | Validator<T, V>
): Validator<T, V> {
  const _validator =
    typeof fn === "function" ? fn : (fn as Validator<T, V>).test;
  return {
    key,
    test: _validator
  };
};

export function withFieldProps<P, F>(
  Component: React.ComponentType<P & InternalFieldProps<F>>
) {
  const ObserverComponent = observer(Component);

  return observer(
    withFormContext(
      observer(
        class extends React.Component<
          FieldProps<F, P> & FieldGroupContextProps
        > {
          constructor(props: FieldProps<F, P> & FieldGroupContextProps) {
            super(props);
          }

          componentWillUnmount() {
            this.props.parent.removeField(this.props.fieldState);
          }

          componentDidMount() {
            this.props.parent.addField(this.props.fieldState);
          }

          render() {
            const rest = this.props;

            return (
              <ObserverComponent
                {...rest}
                value={this.props.fieldState.viewValue}
                onChange={this.props.fieldState.onChange}
                validate={this.props.fieldState.validate}
                valid={this.props.fieldState.valid}
                error={this.props.fieldState.error}
              />
            );
          }
        }
      )
    )
  );
}

export class FieldState<T, V = T> implements FormObject<T> {
  @observable modelValue: V | T;
  @observable viewValue: V | T;
  @observable initialValue: V | T;

  @observable dirty: boolean;
  @observable touched: boolean;
  @observable valid: boolean;
  @observable validating: boolean;

  @observable validationEnabled: boolean;

  @observable error: ObservableMap<string, boolean>;
  @observable validators: ObservableMap<string, ValidatorFn<any, any>>;

  name: string;

  private config: FieldStateConfig<T, V>;

  constructor(config: FieldStateConfig<T, V>) {
    this.name = config.name;
    this.config = config;
    this.validators = observable.map(
      mapValidatorConfig(this.config.validators) || []
    );
    this.initialValue = this.config.initialValue;

    this.reset();
  }

  @action
  reset() {
    this.valid = true;
    this.dirty = false;
    this.validating = false;
    this.touched = false;
    this.modelValue = this.initialValue;
    this.viewValue = this.formatValue();
    this.error = observable.map();
  }

  @computed
  get value(): T {
    return this.modelValue as T;
  }

  set value(newValue: T) {
    this.modelValue = newValue;
    this.viewValue = this.formatValue();
  }

  @computed
  get invalid() {
    return !this.valid;
  }

  @computed
  get pristine() {
    return !this.dirty;
  }

  @computed
  get untouched() {
    return !this.touched;
  }

  @action
  onChange = async (value: V) => {
    this.viewValue = value;

    if (this.validationEnabled) {
      await this.validate();
    }

    this.dirty = true;
  };

  @action
  validate = async () => {
    this.touched = true;
    this.validating = true;

    const testValue = this.parseValue();

    const results = await Promise.all(
      Array.from(this.validators).map(
        ([key, test]: [string, ValidatorFn<any, any>]) => {
          return new Promise<{ key: string; valid: boolean }>(async resolve => {
            const valid = await test(testValue as T, this.viewValue);

            resolve({
              key,
              valid
            });
          });
        }
      )
    );

    runInAction(() => {
      // enable validation on change
      this.validationEnabled = true;

      let fieldValid = true;

      results.forEach(result => {
        if (result.valid === false) {
          fieldValid = false;
          this.error.set(result.key, true);
        } else {
          this.error.set(result.key, false);
        }

        return result.valid;
      });

      this.valid = fieldValid;

      if (this.valid) {
        this.modelValue = testValue;
      }

      this.validating = false;
    });

    return this.valid;
  };

  private parseValue(): T {
    if (this.config.transform && this.config.transform.parser) {
      return this.config.transform.parser(this.viewValue as V);
    }

    return this.viewValue as T;
  }

  private formatValue(): V {
    if (this.config.transform && this.config.transform.formatter) {
      return this.config.transform.formatter(this.modelValue as T);
    }

    return this.modelValue as V;
  }
}

export function withKey<T, V>(
  validator: Validator<T, V>,
  key: string
): Validator<T, V> {
  return {
    key,
    test: validator.test
  };
}

function mapValidatorConfig(
  validators: Validator<any, any>[]
): [string, ValidatorFn<any, any>][] {
  return validators.map(validator => {
    return [validator.key, validator.test] as [string, ValidatorFn<any, any>];
  });
}
