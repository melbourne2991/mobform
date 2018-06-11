import { createIndexPage } from "./util/createIndexPage";
import { BasicExample } from "./basic";
import { FormExample } from "./form";
import { FormattersAndParsersExample } from "./formattersAndParsers";
import { AsyncValidationExample } from "./asyncValidation";
import { NestedFormsExample } from "./nestedForms";

createIndexPage({
  "/basic": BasicExample,
  "/form": FormExample,
  "/formattersAndParsers": FormattersAndParsersExample,
  "/asyncValidation": AsyncValidationExample,
  "/nestedForms": NestedFormsExample
});
