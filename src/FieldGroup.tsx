import * as React from "react";
import { observable, computed, action, trace } from "mobx";
import { observer } from "mobx-react";

import {
  FormObject,
  FieldGroupContextProps,
  FieldGroupContextValue
} from "./types";

@observer
export class FieldGroupComponent extends React.Component<
  { fieldGroupState: FieldGroupState } & FieldGroupContextProps
> {
  constructor(
    props: { fieldGroupState: FieldGroupState } & FieldGroupContextProps
  ) {
    super(props);
  }

  componentWillUnmount() {
    this.props.parent.removeField(this.props.fieldGroupState);
  }

  componentDidMount() {
    this.props.parent.addField(this.props.fieldGroupState);
  }

  render() {
    return (
      <FSContext.Provider value={this.props.fieldGroupState} {...this.props} />
    );
  }
}

export class FieldGroupState
  implements FormObject<{ [fieldName: string]: any }> {
  @observable fields: FormObject<any>[];
  name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
    this.fields = observable([]);
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
    console.log("valid");
    trace();

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

const FSContext = React.createContext<FieldGroupContextValue>(
  new FieldGroupState({ name: "root" })
);

export const withFormContext = function withFormContext<P>(
  Component: React.ComponentType<P & FieldGroupContextProps>
): React.SFC<P> {
  return (props: P) => {
    return (
      <FSContext.Consumer>
        {(value: FieldGroupContextValue) => (
          <Component parent={value} {...props} />
        )}
      </FSContext.Consumer>
    );
  };
};

export const FieldGroup = withFormContext(FieldGroupComponent);
