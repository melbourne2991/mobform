/// <reference types="react" />
import * as React from "react";
export declare type Validators<T> = {
    [validatorName: string]: (value: T) => boolean;
};
export interface FieldStateConfig<T, V> {
    name: string;
    transform?: {
        parser?: (viewValue: V) => T;
        formatter?: (modelValue: T) => V;
    };
    initialValue: T;
    validators?: Validators<T>;
}
export declare type FSContextValue = FormState;
export interface FormContextProps {
    parent: FSContextValue;
}
export interface FSFieldProps {
    fieldState: FieldState<any>;
}
export interface FieldProps<T> {
    onChange: (value: T) => void;
    validate: () => void;
    value: T;
    valid: boolean;
    error: {
        [validatorName: string]: boolean;
    };
}
export declare class FormState {
    fields: FieldState<any>[];
    constructor();
    readonly valid: boolean;
    readonly fieldValues: {};
    addField(fieldState: FieldState<any>): void;
    removeField(fieldState: FieldState<any>): void;
}
export declare const withFormContext: <P>(Component: React.ComponentType<P & FormContextProps>) => React.StatelessComponent<P>;
export declare const FSForm: React.SFC<{
    formState: FormState;
}>;
export declare function withFieldProps<P>(Component: React.ComponentType<P & FieldProps<any>>): React.StatelessComponent<FSFieldProps>;
export declare class FieldState<T, V = T> {
    modelValue: V | T;
    viewValue: V | T;
    dirty: boolean;
    valid: boolean;
    validationEnabled: boolean;
    error: {
        [validatorName: string]: boolean;
    };
    name: string;
    private config;
    constructor(config: FieldStateConfig<T, V>);
    reset(): void;
    onChange: (value: V) => void;
    updateValue(modelValue: T): void;
    parseValue(): T | V;
    validate: () => boolean;
}
