function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var TYPES = ["undefined", "number", "string", "boolean", "bigint", "symbol"];
export var valueIsSimple = function valueIsSimple(value) {
  return TYPES.includes(_typeof(value)) || value instanceof Number || value instanceof String || value instanceof Boolean || value === null;
};
export var fieldHasRegisteredChild = function fieldHasRegisteredChild(fieldName, fieldNames) {
  var targetFieldName = "".concat(fieldName, ".");
  var length = targetFieldName.length;
  return fieldNames.some(function (testFieldName) {
    return testFieldName.substring(0, length) === targetFieldName;
  });
};