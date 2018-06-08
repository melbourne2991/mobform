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

configure({ enforceActions: true });

export { Validators } from "./Validators";

export type Validator<T, V> = [string, ValidatorFn<T, V>];

export type ValidatorConfig<T, V> = Validator<T, V>[];

export interface FieldStateConfig<T, V> {
  name: string;

  transform?: {
    parser?: (viewValue: V) => T;
    formatter?: (modelValue: T) => V;
  };

  initialValue: T;

  validators?: ValidatorConfig<T, V>;
}

export type FSContextValue = FormState;

export interface FormContextProps {
  parent: FSContextValue;
}

export interface FSFieldProps<V> {
  fieldState: FieldState<any, V>;
}

export interface InternalFieldProps<T> {
  onChange: (value: T) => void;
  validate: () => void;
  value: T;
  valid: boolean;
  error: ObservableMap<string, boolean>;
}

export type ValidatorFn<T, V> = (value: T, viewValue: V) => Promise<boolean>;

export const validatorFn = function<T, V>(
  fn: (value: T, viewValue: V) => boolean | Promise<boolean>
): ValidatorFn<T, V> {
  return (value: T, viewValue: V) => {
    const result = fn(value, viewValue);

    if ((result as Promise<boolean>).then) {
      return result as Promise<boolean>;
    }

    return Promise.resolve(result);
  };
};

export type SyncValidator<T, V> = (value: T, viewValue: V) => boolean;
export type ValidatorLikeFn<T, V> = ValidatorFn<T, V> | SyncValidator<T, V>;

export const validator = function<T, V>(
  key: string,
  fn: ValidatorLikeFn<T, V>
): Validator<T, V> {
  return [key, validatorFn(fn)];
};

export class FormState {
  @observable fields: FieldState<any>[];

  constructor() {
    this.fields = [];
  }

  @computed
  get valid(): boolean {
    return this.fields.every(field => {
      return field.valid;
    });
  }

  @computed
  get fieldValues() {
    const fieldMap = {};

    this.fields.forEach(field => {
      fieldMap[field.name] = field.modelValue;
    });

    return fieldMap;
  }

  @action
  addField(fieldState: FieldState<any>) {
    this.fields.push(fieldState);
  }

  @action
  removeField(fieldState: FieldState<any>) {
    fieldState.reset();
    this.fields = this.fields.filter(_field => {
      return _field !== fieldState;
    });
  }
}

const FSContext = React.createContext<FSContextValue>(new FormState());

export const withFormContext = function wthFormContext<P>(
  Component: React.ComponentType<P & FormContextProps>
): React.SFC<P> {
  return (props: P) => {
    return (
      <FSContext.Consumer>
        {(value: FSContextValue) => <Component parent={value} {...props} />}
      </FSContext.Consumer>
    );
  };
};

export const FSForm: React.SFC<{ formState: FormState }> = ({
  formState,
  ...props
}) => {
  return <FSContext.Provider value={formState} {...props} />;
};

export function withFieldProps<P, F>(
  Component: React.ComponentType<P & InternalFieldProps<F>>
) {
  const ObserverComponent = observer(Component);

  return observer(
    withFormContext(
      observer(
        class extends React.Component<FSFieldProps<F> & FormContextProps> {
          constructor(props: FSFieldProps<F> & FormContextProps) {
            super(props);
          }

          componentWillUnmount() {
            this.props.parent.removeField(this.props.fieldState);
          }

          componentDidMount() {
            this.props.parent.addField(this.props.fieldState);
          }

          render() {
            const { ...props } = this.props;
            return (
              <ObserverComponent
                {...props}
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

export class FieldState<T, V = T> {
  @observable modelValue: V | T;
  @observable viewValue: V | T;

  @observable dirty: boolean;
  @observable valid: boolean;

  @observable validationEnabled: boolean;

  @observable error: ObservableMap<string, boolean>;
  @observable validators: ObservableMap<string, ValidatorFn<any, any>>;

  name: string;

  private config: FieldStateConfig<T, V>;

  constructor(config: FieldStateConfig<T, V>) {
    this.name = config.name;
    this.config = config;
    this.validators = observable.map(this.config.validators || []);

    this.reset();
  }

  @action
  reset() {
    this.valid = true;
    this.dirty = false;

    this.modelValue = this.config.initialValue;
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

  @action
  onChange = async (value: V) => {
    this.viewValue = value;

    if (this.validationEnabled) {
      await this.validate();
    }

    this.dirty = true;
  };

  @action
  updateValue(modelValue: T) {
    this.modelValue = modelValue;

    if (this.config.transform && this.config.transform.formatter) {
      this.viewValue = this.config.transform.formatter(modelValue);
    } else {
      this.viewValue = modelValue;
    }
  }

  @action
  validate = async () => {
    const testValue = this.parseValue();

    const results = await Promise.all(
      Array.from(this.validators).map(
        ([name, validatorFn]: Validator<any, any>) => {
          return new Promise<{ name: string; valid: boolean }>(
            async resolve => {
              const valid = await validatorFn(testValue as T, this.viewValue);

              resolve({
                name,
                valid
              });
            }
          );
        }
      )
    );

    runInAction(() => {
      // enable validation on change
      this.validationEnabled = true;

      this.valid = results.every(result => {
        if (result.valid === false) {
          this.error.set(result.name, true);
        } else {
          this.error.set(result.name, false);
        }

        return result.valid;
      });

      if (this.valid) {
        this.modelValue = testValue;
      }
    });

    return this.valid;
  };

  parseValue(): T {
    if (this.config.transform && this.config.transform.parser) {
      return this.config.transform.parser(this.viewValue as V);
    }

    return this.viewValue as T;
  }

  formatValue(): V {
    if (this.config.transform && this.config.transform.formatter) {
      return this.config.transform.formatter(this.modelValue as T);
    }

    return this.modelValue as V;
  }
}

export function withKey<T, V>(validator: Validator<T, V>, key: string) {
  return {
    ...validator,
    name: key
  };
}
