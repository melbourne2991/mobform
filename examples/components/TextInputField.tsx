import * as React from "react";
import { connectedField, FieldProps } from "../../src";

/**
 * Create a state enabled field
 */
export const TextInputField: React.SFC<FieldProps<string>> = connectedField(
  ({ fieldState }) => {
    const { viewValue, error, onChange, onBlur, valid } = fieldState;

    return (
      <div>
        <input
          type={"text"}
          value={viewValue}
          onBlur={onBlur}
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
