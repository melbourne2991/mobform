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

  // Cache is used for string references.
  cache: FormObject<any>[];
  name: string;
  parent: FormObject<any>;

  constructor({ name, fields = [] }: FieldGroupConfig) {
    this.name = name;
    this.fields = observable([]);
    this.cache = fields;
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
  async validate() {
    const result = await Promise.all(
      this.fields.map(field => field.validate())
    );

    return result.every(result => result);
  }

  findFieldByName(name: string, cache?: boolean) {
    let arr = cache ? this.cache : this.fields;
    return arr.find(field => field.name === name);
  }

  getFormObjectFromRef<T>(fieldRef: FormObject<T> | string) {
    const fieldState =
      typeof fieldRef === "string"
        ? this.findFieldByName(fieldRef, true)
        : fieldRef;

    if (!fieldState) {
      throw new Error(`Could not find field with fieldRef: ${fieldRef}`);
    }

    return fieldState;
  }

  @action
  addField<T>(formObject: FormObject<T>) {
    this.fields.push(formObject);
    formObject.parent = this;
  }

  @action
  removeField<T>(formObject: FormObject<T>) {
    delete formObject.parent;
    this.fields = this.fields.filter(_field => {
      return _field !== formObject;
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
