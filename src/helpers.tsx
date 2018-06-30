import * as React from "react";

import {
  ValidatorFn,
  Validator,
  InternalFieldProps,
  FieldProps,
  FieldGroupContextProps
} from "./types";

import { withFormContext } from "./FieldGroup";

import { observer } from "mobx-react";

export function withKey<V>(validator: Validator<V>, key: string): Validator<V> {
  return {
    key,
    test: validator.test
  };
}

// Takes a validator or a validatorFn
export const validator = function<V>(
  key: string,
  fn: ValidatorFn<V> | Validator<V>
): Validator<V> {
  const _validator = typeof fn === "function" ? fn : (fn as Validator<V>).test;

  return {
    key,
    test: (value: V) => {
      if (isEmpty(value)) {
        return true;
      }

      return _validator(value);
    }
  };
};

export function connectedField<P, V>(
  Component: React.ComponentType<P & InternalFieldProps<V>>
) {
  const ObserverComponent = observer(Component);

  return observer(
    withFormContext(
      observer(
        class extends React.Component<
          FieldProps<V, P> & FieldGroupContextProps
        > {
          constructor(props: FieldProps<V, P> & FieldGroupContextProps) {
            super(props);
          }

          componentWillUnmount() {
            this.props.parent.state.removeField(this.props.fieldState);
          }

          componentDidMount() {
            this.props.parent.state.addField(this.props.fieldState);
          }

          render() {
            const rest = this.props;

            return (
              <ObserverComponent {...rest} fieldState={this.props.fieldState} />
            );
          }
        }
      )
    )
  );
}

export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value.length === 0;
}
