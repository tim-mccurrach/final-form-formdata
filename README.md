## final-form-formData

A decorator to convert submitted `final-form` data into `formData`.

[![npm](https://img.shields.io/npm/v/final-form-formdata?style=flat-square)](https://www.npmjs.com/package/final-form-formdata)
[![GitHub](https://img.shields.io/github/license/tim-mccurrach/final-form-formdata)](https://github.com/tim-mccurrach/final-form-formdata/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/tim-mccurrach/final-form-formdata/branch/main/graph/badge.svg)](https://codecov.io/gh/tim-mccurrach/final-form-formdata)

### Motivation

`final-form` stores it's state just as a normal javascript object. This would normally be serialized into JSON before being sent to the backend. However there are a few situations where other formats may be required.

-   File uploads require `multi-part/formdata` (`Files` are not JSON serializable). Whilst it is possible to handle file uploads separately, there are plenty of situations where it is preferable to submit your files and form-data as a single request.
-   If you are updating your front-end, and your backend is expecting `multi-part/formdata` this allows you to update front-end and back-end independently.

### Installation

```
npm install final-form-formdata
```

### Basic Usage

Simply wrap your `onSubmit` function with `convertToFormData` and instead of recieving the raw values from `final-form`, your onSubmit data will recieve a `formData` instance. e.g.

```
import {convertToFormData} from "final-form-formdata"

// for final-form
const formDataOnSubmit(onSubmit)
const form = createForm({ onSubmit: formDataOnSubmit })

//for react-final-form
const myForm = () => (
	<Form
	    onSubmit={convertToFormData(onSubmit)}
	    ...
	/>
)
```

There is an optional config argument explained further below. When you send the data, make sure you remember to set your `content-type` request header to `"multipart/form-data"`.

### Under the hood

FormData is made up of an entry list where each entry is a key/value pair consisting of only `USVString`s or `Blob`s. All other types are converted. You can have multiple values with the same key (forming an array). Since `final-form` field values can be equal to anything, this leaves open the problem of how complex data-types are serialised into `FormData` entries.

`final-form-formdata` serializes the data according to the following rules:

1.  All registered fields are added as an entry, where the key is equal to the field name, and the value is the value of the field.
2.  Primative data-types are just added as is (since they will be converted into a sensible string representation of their value).
3.  Objects (including arrays) that have a registered sub-field will be ignored, since their children will make up their own entries.
4.  If a fields value is an array, then each element in the array is added with the same key. `FieldArray`s are dealt with in the same fashion. If an elements value is non-primative, rule 5 is applied when adding the entry.
5.  For values not covered by the rules 2-3, we defer to the `handleComplexValues` function.

### `config`

config accepts one value, `handleComplexValues` which deals with non-primative data types.

For example:

```
const applyFilenames = (fieldName, value, formData, fieldNames) => {
    if (typeof value === 'object' && "filename" in value) {
    	formData.append(fieldName, value.file, value.filename)
    }
}

const decoratedOnSubmit = convertToFormData(onSubmit, applyFilenames)

const myForm = () => (
	<Form
	    onSubmit={decoratedOnSubmit}
	    ...
	/>
)

```

Two complex value handlers are exported with the library:

-   `appendAll`: all values are just added as an entry
-   `onlyAcceptBlobs`: `Blob`s (including `File`s) are added, but all other objects are ignored.

The default value is `acceptAll`, but you can of course write your own.

### Testing

Note that this uses the `FormData` interface, some old testing frameworks may not support this. You can either mock the function, use a polyfill or use a more up to date test runner.

### Contributions

Contributions are most welcome :) Please submit a PR or open an issue to discuss
