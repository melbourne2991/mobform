import { observable, computed, action, ObservableMap, runInAction } from "mobx";
import * as ValidationStrategies from "./ValidationStrategies";

import {
  ValidatorFn,
  Validator,
  FormObject,
  FieldStateConfig,
  ValidationStrategy
} from "./types";

export class FieldState<T, V = T> implements FormObject<T> {
  @observable modelValue: T;
  @observable viewValue: V;
  @observable initialValue: T;

  @observable dirty: boolean;
  @observable touched: boolean;
  @observable valid: boolean;
  @observable validating: boolean;

  @observable validationEnabled: boolean;

  @observable error: ObservableMap<string, boolean>;
  @observable validators: ObservableMap<string, ValidatorFn<V>>;

  name: string;
  parent: FormObject<any>;
  validationStrategy: ValidationStrategy;

  private config: FieldStateConfig<T, V>;

  constructor(config: FieldStateConfig<T, V>) {
    this.name = config.name;
    this.config = config;
    this.validators = observable.map(
      mapValidatorConfig(this.config.validators) || []
    );
    this.initialValue = this.config.initialValue;

    this.validationStrategy =
      this.config.validationStrategy || ValidationStrategies.Default;

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
    this.dirty = true;

    this.validationStrategy.onChange.call(this);
  };

  @action
  onBlur = () => {
    this.touched = true;

    this.validationStrategy.onBlur.call(this);
  };

  @action
  validate = async () => {
    this.validating = true;

    const results = await Promise.all(
      Array.from(this.validators).map(
        ([key, test]: [string, ValidatorFn<V>]) => {
          return new Promise<{ key: string; valid: boolean }>(async resolve => {
            const valid = await test(this.viewValue);

            resolve({
              key,
              valid
            });
          });
        }
      )
    );

    runInAction(() => {
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
        this.modelValue = this.parseValue();
      }

      this.validating = false;
    });

    return this.valid;
  };

  private parseValue(): T {
    if (this.config.transform && this.config.transform.parser) {
      return this.config.transform.parser(this.viewValue);
    }

    return (this.viewValue as any) as T;
  }

  private formatValue(): V {
    if (this.config.transform && this.config.transform.formatter) {
      return this.config.transform.formatter(this.modelValue as T);
    }

    return (this.modelValue as any) as V;
  }
}

function mapValidatorConfig(
  validators: Validator<any>[]
): [string, ValidatorFn<any>][] {
  return validators.map(validator => {
    return [validator.key, validator.test] as [string, ValidatorFn<any>];
  });
}
