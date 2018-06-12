import { createIndexPage } from "./util/createIndexPage";
import { BasicExample } from "./basic";
import { FormGroupExample } from "./formGroup";
import { FormattersAndParsersExample } from "./formattersAndParsers";
import { AsyncValidationExample } from "./asyncValidation";
import { NestedFormGroupsExample } from "./nestedFormGroups";

createIndexPage({
  "/basic": BasicExample,
  "/formGroups": FormGroupExample,
  "/formattersAndParsers": FormattersAndParsersExample,
  "/asyncValidation": AsyncValidationExample,
  "/nestedFormGroups": NestedFormGroupsExample
});
