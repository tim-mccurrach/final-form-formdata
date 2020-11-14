import { appendAll, onlyAcceptBlobs } from "../src/complexValueHandlers";

describe("appendAll", () => {
	test("check values are appended", () => {
		const formData = { append: jest.fn() };
		const objToAdd = { a: 1, b: 2 };

		appendAll("foo", "bar", formData);
		appendAll("bar", objToAdd, formData);

		expect(formData.append).toHaveBeenNthCalledWith(1, "foo", "bar");
		expect(formData.append).toHaveBeenNthCalledWith(2, "bar", objToAdd);
	});
});

describe("onlyAcceptBlobs", () => {
	test("check non-Blob objects are ignored", () => {
		const formData = { append: jest.fn() };
		const objToAdd = { a: 1, b: 2 };

		onlyAcceptBlobs("foo", "bar", formData);
		onlyAcceptBlobs("bar", objToAdd, formData);

		expect(formData.append).toHaveBeenCalledTimes(0);
	});

	test("files are added", () => {
		const formData = { append: jest.fn() };
		const file = new File(["a picture"], "test.png", { type: "image/png" });
		onlyAcceptBlobs("foo", file, formData);
		expect(formData.append).toHaveBeenCalledTimes(1);
		expect(formData.append).toHaveBeenCalledWith("foo", file);
	});
});
