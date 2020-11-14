function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import { getIn } from "final-form";
import { appendAll } from "./complexValueHandlers";
import { valueIsSimple, fieldHasRegisteredChild } from "./utils";
var arrayRegex = /(.*)\.\d+$/;

var appendFormData = function appendFormData(fieldName, value, formData, fieldNames, handleComplexValues) {
  if (valueIsSimple(value)) {
    if (arrayRegex.test(fieldName)) {
      // items in arrays should be appended in the correct order
      // at the moment this only works because getRegisteredFields
      // list field arrays in the correct order. It feels wrong
      // to rely on an implementation detail such as this.
      // TODO: replace this with a more robust approach!!
      formData.append(fieldName.replace(arrayRegex, "$1"), value);
    } else {
      formData.append(fieldName, value);
    }
  } else if (_typeof(value) === "object" && fieldHasRegisteredChild(fieldName, fieldNames)) {
    return;
  } else if (value instanceof Array) {
    value.forEach(function (item) {
      appendFormData(fieldName, item, formData, fieldNames, handleComplexValues);
    });
  } else {
    handleComplexValues(fieldName, value, formData, fieldNames);
  }
};

var convertToFormData = function convertToFormData(onSubmit) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    handleComplexValues: appendAll
  };

  var decoratedOnSubmit = function decoratedOnSubmit(values, api, callback) {
    var formData = new FormData();
    var fieldNames = api.getRegisteredFields();
    fieldNames.forEach(function (fieldName) {
      var value = getIn(values, fieldName);
      appendFormData(fieldName, value, formData, fieldNames, config.handleComplexValues);
    });
    return onSubmit(formData, api, callback);
  };

  return decoratedOnSubmit;
};

export default convertToFormData;