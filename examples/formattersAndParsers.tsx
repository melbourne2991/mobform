/**
 * Formatter and Parsers Usage
 */
import * as React from "react";
import { FieldState, Validators, validator } from "../src";
import { observer } from "mobx-react";
import * as moment from "moment";

/**
 * A state enabled text input we created earlier.
 */
import { DateInputField } from "./components/DateInputField";

const requiredValidator = Validators.required();

const dateOfBirthFieldState = new FieldState<Date, string>({
  name: "dateOfBirth",
  initialValue: undefined,
  validators: [
    Validators.required(),

    /**
     * Create a custom validator for our date.
     * See the customValidators example for more information
     */
    validator("dateFormat", async (value: Date, viewValue: string) => {
      const emptyValue = !(await requiredValidator.test(value, viewValue));
      if (emptyValue) return true;

      return moment(viewValue, "DD-MM-YYYY", true).isValid();
    })
  ],
  transform: {
    formatter: date => {
      if (date) {
        return moment(date).format("DD-MM-YYYY");
      }

      return "";
    },
    parser: str => {
      if (str) {
        return moment(str, "DD-MM-YYYY").toDate();
      }

      return undefined;
    }
  }
});

@observer
export class FormattersAndParsersExample extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div>
        <DateInputField fieldState={dateOfBirthFieldState} />
        <div>
          JS Date (parsed from user input):
          {dateOfBirthFieldState.value &&
            dateOfBirthFieldState.value.toString()}
        </div>
      </div>
    );
  }
}
