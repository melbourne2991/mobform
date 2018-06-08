import { createIndexPage } from "./util/createIndexPage";
import { BasicExample } from "./basic";
import { FormExample } from "./form";

createIndexPage({
  "/basic": BasicExample,
  "/form": FormExample
});
