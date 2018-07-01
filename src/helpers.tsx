import * as React from "react";

import {
  ValidatorFn,
  Validator,
  FieldProps,
  FieldGroupContextProps,
  InternalFieldProps
} from "./types";

import { withFormContext } from "./FieldGroup";

import { observer } from "mobx-react";
import { FieldState } from "./FieldState";

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
  Component: React.ComponentType<P & InternalFieldProps<V, P>>
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

          private shouldResetOnUnmount() {
            return !(
              this.props.disableResetOnUnmount ||
              (this.props.parent && this.props.parent.disableResetOnUnmount)
            );
          }

          private shouldRemoveFromParentOnUnmount() {
            return !(
              this.props.disableRemoveFromParentOnUnmount ||
              (this.props.parent &&
                this.props.parent.disableRemoveFromParentOnUnmount)
            );
          }

          private fieldState(): FieldState<any, V> {
            if (typeof this.props.fieldState === "string") {
              if (!this.props.parent) {
                throw new Error(
                  "Passing a string to a connected field requires the field to be nested inside a field group."
                );
              }

              return this.props.parent.state.getFormObjectFromRef(
                this.props.fieldState
              ) as FieldState<any, V>;
            }

            return this.props.fieldState as FieldState<any, V>;
          }

          componentWillUnmount() {
            this.props.parent.disableResetOnUnmount;

            if (this.shouldResetOnUnmount()) {
              this.fieldState().reset();
            }

            if (this.shouldRemoveFromParentOnUnmount) {
              this.props.parent.state.removeField(this.fieldState());
            }
          }

          componentDidMount() {
            if (this.props.parent) {
              this.props.parent.state.addField(this.fieldState());
            }
          }

          render() {
            const rest = this.props;

            return (
              <ObserverComponent {...rest} fieldState={this.fieldState()} />
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
