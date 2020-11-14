const TYPES = ["undefined", "number", "string", "boolean", "bigint", "symbol"];

export const valueIsSimple = (value) => {
  return (
    TYPES.includes(typeof value) ||
    value instanceof Number ||
    value instanceof String ||
    value instanceof Boolean ||
    value === null
  );
};

export const fieldHasRegisteredChild = (fieldName, fieldNames) => {
  const targetFieldName = `${fieldName}.`;
  const length = targetFieldName.length;
  return fieldNames.some(
    (testFieldName) => testFieldName.substring(0, length) === targetFieldName
  );
};
