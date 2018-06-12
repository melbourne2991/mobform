import * as React from "react";
import { observable, computed, action } from "mobx";

import {
  FormObject,
  FormGroupContextProps,
  FormGroupContextValue
} from "./types";

export class FormGroupComponent extends React.Component<
  { formGroupState: FormGroupState } & FormGroupContextProps
> {
  constructor(
    props: { formGroupState: FormGroupState } & FormGroupContextProps
  ) {
    super(props);
  }

  componentWillUnmount() {
    this.props.parent.removeField(this.props.formGroupState);
  }

  componentDidMount() {
    this.props.parent.addField(this.props.formGroupState);
  }

  render() {
    return (
      <FSContext.Provider value={this.props.formGroupState} {...this.props} />
    );
  }
}

export class FormGroupState
  implements FormObject<{ [fieldName: string]: any }> {
  @observable fields: FormObject<any>[];
  name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
    this.fields = [];
  }

  @computed
  get validating() {
    return this.fields.some(field => {
      return field.validating;
    });
  }

  @computed
  get dirty() {
    return this.fields.some(field => {
      return field.dirty;
    });
  }

  @computed
  get pristine() {
    return !this.dirty;
  }

  @computed
  get valid(): boolean {
    return this.fields.every(field => {
      return field.valid;
    });
  }

  @computed
  get invalid() {
    return !this.valid;
  }

  @computed
  get touched() {
    return this.fields.some(field => {
      return field.touched;
    });
  }

  @computed
  get untouched() {
    return !this.touched;
  }

  @computed
  get value() {
    const fieldMap = {};

    this.fields.forEach(fieldState => {
      fieldMap[fieldState.name] = fieldState.value;
    });

    return fieldMap;
  }

  @action
  reset() {
    this.fields.forEach(fieldState => {
      fieldState.reset();
    });
  }

  @action
  addField<T>(fieldState: FormObject<T>) {
    this.fields.push(fieldState);
  }

  @action
  removeField<T>(fieldState: FormObject<T>) {
    fieldState.reset();
    this.fields = this.fields.filter(_field => {
      return _field !== fieldState;
    });
  }
}

const FSContext = React.createContext<FormGroupContextValue>(
  new FormGroupState({ name: "root" })
);

export const withFormContext = function wthFormContext<P>(
  Component: React.ComponentType<P & FormGroupContextProps>
): React.SFC<P> {
  return (props: P) => {
    return (
      <FSContext.Consumer>
        {(value: FormGroupContextValue) => (
          <Component parent={value} {...props} />
        )}
      </FSContext.Consumer>
    );
  };
};

export const FormGroup = withFormContext(FormGroupComponent);
