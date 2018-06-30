import { ValidationStrategy } from "./types";

export const Default: ValidationStrategy = {
  onChange() {
    if (this.touched) {
      this.validate();
    }
  },

  onBlur() {
    this.validate();
  }
};

export const Manual: ValidationStrategy = {
  onChange() {},
  onBlur() {}
};
