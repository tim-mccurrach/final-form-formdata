import { valueIsSimple, fieldHasRegisteredChild } from "../src/utils";

describe("valueIsSimple", () => {
	test.each([
		0,
		1,
		2.45,
		NaN,
		Infinity,
		"",
		"foo",
		true,
		false,
		undefined,
		null,
		BigInt(123),
		Symbol(),
		Symbol("foo"),
	])("Check simple values return true (%s)", (value) => {
		const result = valueIsSimple(value);
		expect(result).toBe(true);
	});

	test("Check Blobs return false", () => {
		const file = new File(["a picture"], "test.png", { type: "image/png" });
		expect(valueIsSimple(file)).toBe;
	});

	test("Check primative object wrappers return true", () => {
		const boolTrue = new Boolean(true);
		const boolFalse = new Boolean(false);
		const num = new Number(123);
		const str = new String("foo");
		expect(valueIsSimple(boolTrue)).toBe(true);
		expect(valueIsSimple(boolFalse)).toBe(true);
		expect(valueIsSimple(num)).toBe(true);
		expect(valueIsSimple(str)).toBe(true);
	});

	test.each([{}, [], [1], [1, 2, 3], { a: 1 }])(
		"Check 'complex' values return false",
		(value) => {
			const result = valueIsSimple(value);
			expect(result).toBe(false);
		}
	);
});

const fieldNames = ["foo.bar", "foo.bar.0", "foo.bar.1", "foo", "foo.baz"];

describe("fieldHasRegisteredChild", () => {
	test("Check when field does have child", () => {
		expect(fieldHasRegisteredChild("foo", fieldNames)).toBe(true);
		expect(fieldHasRegisteredChild("foo.bar", fieldNames)).toBe(true);
	});
	test("Check when field doesn't have child", () => {
		expect(fieldHasRegisteredChild("foo.baz", fieldNames)).toBe(false);
		expect(fieldHasRegisteredChild("foo.bar.0", fieldNames)).toBe(false);
	});
});
