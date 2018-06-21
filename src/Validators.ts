import { validator } from "./";

const required = () =>
  validator("required", (value: any, viewValue: string) => {
    value;
    return !isUndefined(viewValue);
  });

const min = (minNumber: number) =>
  validator("min", (value: string | number) => {
    return getNum(value) >= minNumber;
  });

const max = (maxNumber: number) =>
  validator("min", (value: string | number) => {
    return getNum(value) <= maxNumber;
  });

const minLength = (minLength: number) =>
  validator("minLength", (value: string) => {
    return value.length >= minLength;
  });

const maxLength = (maxLength: number) =>
  validator("maxLength", (value: string) => {
    return value.length <= maxLength;
  });

const pattern = (pattern: RegExp | string) => {
  const regexp = typeof pattern === "string" ? new RegExp(pattern) : pattern;

  return validator("pattern", (value: string) => {
    return regexp.test(value);
  });
};

/**
 * Sourced from Angular:
 * https://github.com/angular/angular/blob/6.0.5/packages/forms/src/validators.ts#L121-L130
 */
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

const email = () => {
  return validator("email", pattern(EMAIL_REGEXP));
};

function getNum(value: string | number) {
  if (isUndefined(value)) {
    return true;
  }

  const parsedVal = typeof value === "string" ? parseFloat(value) : value;
  return parsedVal;
}

function isUndefined(value: any): boolean {
  return value === null || value === undefined || value.length === 0;
}

export const Validators = {
  min,
  max,
  required,
  minLength,
  maxLength,
  pattern,
  email
};
