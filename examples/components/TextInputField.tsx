import * as React from "react";
import { withFieldProps, FSFieldProps } from "../../src";

/**
 * Create a state enabled field
 */
export const TextInputField: React.SFC<FSFieldProps<string>> = withFieldProps(
  ({ validate, value, onChange, error }) => {
    return (
      <div>
        <input
          type={"text"}
          value={value}
          onBlur={validate}
          onChange={e => onChange(e.target.value)}
        />

        <div style={{ color: "red" }}>
          <div>{error.get("required") && "This field is required"}</div>
          <div>{error.get("minLength") && "Not long enough"}</div>
        </div>
      </div>
    );
  }
);
