import { validator } from "./";
import { isEmpty } from "./helpers";
import { ValidatorFactory } from "./types";

const required: ValidatorFactory<any> = () => {
  return {
    key: "required",
    test: value => {
      return !isEmpty(value);
    }
  };
};

const min: ValidatorFactory<string | number> = (minNumber: number) =>
  validator("min", value => {
    return getNum(value) >= minNumber;
  });

const max: ValidatorFactory<string | number> = (maxNumber: number) =>
  validator("min", value => {
    return getNum(value) <= maxNumber;
  });

const minLength: ValidatorFactory<string> = (minLength: number) =>
  validator("minLength", value => {
    return value.length >= minLength;
  });

const maxLength: ValidatorFactory<string> = (maxLength: number) =>
  validator("maxLength", value => {
    return value.length <= maxLength;
  });

const pattern: ValidatorFactory<string> = (pattern: RegExp | string) => {
  const regexp = typeof pattern === "string" ? new RegExp(pattern) : pattern;

  return validator("pattern", value => {
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
  const parsedVal = typeof value === "string" ? parseFloat(value) : value;
  return parsedVal;
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
