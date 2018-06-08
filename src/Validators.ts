import { validator } from "./";

const required = () =>
  validator("required", (value: any, viewValue: string) => {
    console.log(viewValue.length);
    return !!value && !!viewValue.length;
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
  const regexp =
    typeof pattern === "string" ? new RegExp(pattern, "g") : pattern;

  return validator("pattern", (value: string) => {
    return regexp.test(value);
  });
};

export const Validators = {
  required,
  minLength,
  maxLength,
  pattern
};
