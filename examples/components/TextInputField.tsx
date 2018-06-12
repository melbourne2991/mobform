import * as React from "react";
import { withFieldProps, FieldProps } from "../../src";

/**
 * Create a state enabled field
 */
export const TextInputField: React.SFC<FieldProps<string>> = withFieldProps(
  ({ validate, value, onChange, error, valid }) => {
    return (
      <div>
        <input
          type={"text"}
          value={value}
          onBlur={validate}
          onChange={e => onChange(e.target.value)}
        />

        {!valid && (
          <div style={{ color: "red" }}>
            <div>{error.get("required") && "This field is required"}</div>
            <div>{error.get("minLength") && "Not long enough"}</div>
          </div>
        )}
      </div>
    );
  }
);
