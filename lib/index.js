var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { observable, computed } from "mobx";
import * as React from "react";
import { observer } from "mobx-react";
var FormState = /** @class */ (function () {
    function FormState() {
        this.fields = [];
    }
    Object.defineProperty(FormState.prototype, "valid", {
        get: function () {
            return this.fields.every(function (field) {
                return field.valid;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormState.prototype, "fieldValues", {
        get: function () {
            var fieldMap = {};
            this.fields.forEach(function (field) {
                fieldMap[field.name] = field.modelValue;
            });
            return fieldMap;
        },
        enumerable: true,
        configurable: true
    });
    FormState.prototype.addField = function (fieldState) {
        this.fields.push(fieldState);
    };
    FormState.prototype.removeField = function (fieldState) {
        fieldState.reset();
        this.fields = this.fields.filter(function (_field) {
            return _field !== fieldState;
        });
    };
    __decorate([
        observable
    ], FormState.prototype, "fields", void 0);
    __decorate([
        computed
    ], FormState.prototype, "valid", null);
    __decorate([
        computed
    ], FormState.prototype, "fieldValues", null);
    return FormState;
}());
export { FormState };
var FSContext = React.createContext(new FormState());
export var withFormContext = function wthFormContext(Component) {
    return function (props) {
        return (React.createElement(FSContext.Consumer, null, function (value) { return React.createElement(Component, __assign({ parent: value }, props)); }));
    };
};
export var FSForm = function (_a) {
    var formState = _a.formState, props = __rest(_a, ["formState"]);
    return React.createElement(FSContext.Provider, __assign({ value: formState }, props));
};
export function withFieldProps(Component) {
    return observer(withFormContext(observer(/** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(props) {
            return _super.call(this, props) || this;
        }
        class_1.prototype.componentWillUnmount = function () {
            this.props.parent.removeField(this.props.fieldState);
        };
        class_1.prototype.componentDidMount = function () {
            this.props.parent.addField(this.props.fieldState);
        };
        class_1.prototype.render = function () {
            var props = __rest(this.props, []);
            return (React.createElement(Component, __assign({}, props, { value: this.props.fieldState.viewValue, onChange: this.props.fieldState.onChange, validate: this.props.fieldState.validate, valid: this.props.fieldState.valid, error: this.props.fieldState.error })));
        };
        return class_1;
    }(React.Component)))));
}
var FieldState = /** @class */ (function () {
    function FieldState(config) {
        var _this = this;
        this.onChange = function (value) {
            _this.viewValue = value;
            if (_this.validationEnabled) {
                _this.validate();
            }
            _this.dirty = true;
        };
        this.validate = function () {
            // enable validation on change
            _this.validationEnabled = true;
            var testValue = _this.parseValue();
            _this.valid = Object.keys(_this.config.validators).every(function (key) {
                var validatorFn = _this.config.validators[key];
                var result = validatorFn(testValue);
                if (result === false) {
                    _this.error[key] = true;
                }
                else {
                    _this.error[key] = false;
                }
                return result;
            });
            if (_this.valid) {
                _this.modelValue = _this.viewValue;
            }
            return _this.valid;
        };
        this.name = config.name;
        this.config = config;
        this.config.validators = this.config.validators || {};
        this.reset();
    }
    FieldState.prototype.reset = function () {
        this.valid = true;
        this.dirty = false;
        this.viewValue = this.config.initialValue;
        this.modelValue = this.config.initialValue;
        this.error = {};
    };
    FieldState.prototype.updateValue = function (modelValue) {
        this.modelValue = modelValue;
        if (this.config.transform && this.config.transform.formatter) {
            this.viewValue = this.config.transform.formatter(modelValue);
        }
        else {
            this.viewValue = modelValue;
        }
    };
    FieldState.prototype.parseValue = function () {
        if (this.config.transform && this.config.transform.parser) {
            return this.config.transform.parser(this.viewValue);
        }
        return this.viewValue;
    };
    __decorate([
        observable
    ], FieldState.prototype, "modelValue", void 0);
    __decorate([
        observable
    ], FieldState.prototype, "viewValue", void 0);
    __decorate([
        observable
    ], FieldState.prototype, "dirty", void 0);
    __decorate([
        observable
    ], FieldState.prototype, "valid", void 0);
    __decorate([
        observable
    ], FieldState.prototype, "error", void 0);
    return FieldState;
}());
export { FieldState };
//# sourceMappingURL=index.js.map