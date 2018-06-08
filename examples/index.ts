import { createIndexPage } from "./util/createIndexPage";
import { BasicExample } from "./basic";
import { FormExample } from "./form";
import { FormattersAndParsersExample } from "./formattersAndParsers";

createIndexPage({
  "/basic": BasicExample,
  "/form": FormExample,
  "/formattersAndParsers": FormattersAndParsersExample
});
