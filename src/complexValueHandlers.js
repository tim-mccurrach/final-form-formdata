/*
 * All complex values are just appended. This is not
 * suitable for all situation. For example objects
 * will be serialized to become "[Object object]".
 */
export const appendAll = (fieldName, value, formData, fieldNames) => {
	formData.append(fieldName, value);
};

/*
 *Blobs (including Files) are added, but all other objects are ignored.
 */
export const onlyAcceptBlobs = (fieldName, value, formData, fieldNames) => {
	if (value instanceof Blob) {
		formData.append(fieldName, value);
	}
};

//TODO: Complete traverseObjects
/*
 * This complexValueHandler recursively calls itself until it
 * reaches a primative value.
 */
//export const traverseObjects = (fieldName, value, formData, fieldNames) => {};
