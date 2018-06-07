import { validator } from "./";

const Required = () =>
  validator("required", (value: any) => {
    return !!value;
  });

const MinLength = (minLength: number) =>
  validator("minLength", (value: string) => {
    return value.length >= minLength;
  });

const MaxLength = (maxLength: number) =>
  validator("maxLength", (value: string) => {
    return value.length <= maxLength;
  });

const Pattern = (pattern: RegExp | string) => {
  const regexp =
    typeof pattern === "string" ? new RegExp(pattern, "g") : pattern;

  return validator("pattern", (value: string) => {
    return regexp.test(value);
  });
};

export const Validators = {
  Required,
  MinLength,
  MaxLength,
  Pattern
};
