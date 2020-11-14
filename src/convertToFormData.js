import { getIn } from "final-form";

import { appendAll } from "./complexValueHandlers";
import { valueIsSimple, fieldHasRegisteredChild } from "./utils";

const arrayRegex = /(.*)\.\d+$/;

const appendFormData = (
	fieldName,
	value,
	formData,
	fieldNames,
	handleComplexValues
) => {
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
	} else if (
		typeof value === "object" &&
		fieldHasRegisteredChild(fieldName, fieldNames)
	) {
		return;
	} else if (value instanceof Array) {
		value.forEach((item) => {
			appendFormData(
				fieldName,
				item,
				formData,
				fieldNames,
				handleComplexValues
			);
		});
	} else {
		handleComplexValues(fieldName, value, formData, fieldNames);
	}
};

const convertToFormData = (
	onSubmit,
	config = { handleComplexValues: appendAll }
) => {
	const decoratedOnSubmit = (values, api, callback) => {
		const formData = new FormData();
		const fieldNames = api.getRegisteredFields();
		fieldNames.forEach((fieldName) => {
			const value = getIn(values, fieldName);
			appendFormData(
				fieldName,
				value,
				formData,
				fieldNames,
				config.handleComplexValues
			);
		});
		return onSubmit(formData, api, callback);
	};
	return decoratedOnSubmit;
};

export default convertToFormData;
