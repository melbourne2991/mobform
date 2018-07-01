import { createIndexPage } from "./util/createIndexPage";
import { BasicExample } from "./basic";
import { FieldGroupExample } from "./fieldGroup";
import { FieldGroupStringRefExample } from "./fieldGroupWithStringRef";
import { FormattersAndParsersExample } from "./formattersAndParsers";
import { AsyncValidationExample } from "./asyncValidation";
import { NestedFieldGroupsExample } from "./nestedFieldGroups";

createIndexPage({
  "/basic": BasicExample,
  "/FieldGroups": FieldGroupExample,
  "/FieldGroupsWithStringRef": FieldGroupStringRefExample,
  "/formattersAndParsers": FormattersAndParsersExample,
  "/asyncValidation": AsyncValidationExample,
  "/nestedFieldGroups": NestedFieldGroupsExample
});
