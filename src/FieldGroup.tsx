import * as React from "react";
import { observable, computed, action } from "mobx";
import { observer } from "mobx-react";

import {
  FormObject,
  FieldGroupProps,
  FieldGroupContextProps,
  FieldGroupContextValue,
  FieldGroupConfig
} from "./types";

@observer
export class FieldGroupComponent extends React.Component<
  { fieldGroupState: FieldGroupState } & FieldGroupProps
> {
  constructor(props: { fieldGroupState: FieldGroupState } & FieldGroupProps) {
    super(props);
  }

  componentWillUnmount() {
    this.props.parent.state.removeField(this.props.fieldGroupState);
  }

  componentDidMount() {
    this.props.parent.state.addField(this.props.fieldGroupState);
  }

  render() {
    return (
      <FSContext.Provider
        value={{
          state: this.props.fieldGroupState
        }}
        {...this.props}
      />
    );
  }
}

export class FieldGroupState
  implements FormObject<{ [fieldName: string]: any }> {
  @observable fields: FormObject<any>[];
  name: string;
  parent: FormObject<any>;

  constructor({ name }: FieldGroupConfig) {
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
    fieldState.parent = this;
  }

  @action
  removeField<T>(fieldState: FormObject<T>) {
    delete fieldState.parent;
    fieldState.reset();

    this.fields = this.fields.filter(_field => {
      return _field !== fieldState;
    });
  }
}

const FSContext = React.createContext<FieldGroupContextValue>({
  state: new FieldGroupState({ name: "root" })
});

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
