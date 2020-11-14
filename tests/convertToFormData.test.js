import { createForm } from "final-form";

import convertToFormData from "../src/convertToFormData";
import * as complexValueHandlers from "../src/complexValueHandlers";

let form;
let onSubmit;
describe("convertToFormData", () => {
  beforeEach(() => {
    onSubmit = jest.fn();
    const decoratedOnSubmit = convertToFormData(onSubmit);
    form = createForm({ onSubmit: decoratedOnSubmit });
    form.registerField("firstName", () => {}, [], { initialValue: "Tim" });
    form.registerField("lastName", () => {}, [], {
      initialValue: "McCurrach",
    });
  });

  test("check basic data is converted to formData", () => {
    form.submit();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const entries = Array.from(onSubmit.mock.calls[0][0].entries());
    expect(entries).toEqual([
      ["firstName", "Tim"],
      ["lastName", "McCurrach"],
    ]);
  });

  test("check an array is proccessed correctly", () => {
    form.registerField("foods", () => {}, [], {
      initialValue: ["chicken", "peas", "toast"],
    });
    form.submit();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const entries = Array.from(onSubmit.mock.calls[0][0].entries());
    expect(entries).toEqual([
      ["firstName", "Tim"],
      ["lastName", "McCurrach"],
      ["foods", "chicken"],
      ["foods", "peas"],
      ["foods", "toast"],
    ]);
  });

  // This is the structure a field array produced using the library
  // react-final-form-field-array would have.
  test("check a field array is processed correctly", () => {
    form.registerField("foods", () => {}, [], { initialValue: [] });
    form.registerField("foods.0", () => {}, [], {
      initialValue: "chicken",
    });
    form.registerField("foods.1", () => {}, [], { initialValue: "peas" });
    form.registerField("foods.2", () => {}, [], { initialValue: "toast" });
    form.submit();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const entries = Array.from(onSubmit.mock.calls[0][0].entries());
    expect(entries).toEqual([
      ["firstName", "Tim"],
      ["lastName", "McCurrach"],
      ["foods", "chicken"],
      ["foods", "peas"],
      ["foods", "toast"],
    ]);
  });

  test("check file upload works correctly", () => {
    form.registerField("file", () => {}, []);
    const file = new File(["foo"], "foo.txt");
    form.change("file", [file]);
    form.submit();
    expect(onSubmit).toHaveBeenCalledTimes(1);

    const entries = Array.from(onSubmit.mock.calls[0][0].entries());
    expect(entries).toEqual([
      ["firstName", "Tim"],
      ["lastName", "McCurrach"],
      ["file", file],
    ]);
  });
  test("check file upload with multiple files", () => {
    form.registerField("file", () => {}, []);
    const file1 = new File(["foo"], "foo.txt");
    const file2 = new File(["bar"], "bar.txt");
    form.change("file", [file1, file2]);
    form.submit();
    expect(onSubmit).toHaveBeenCalledTimes(1);

    const entries = Array.from(onSubmit.mock.calls[0][0].entries());
    console.log(entries);
    expect(entries).toEqual([
      ["firstName", "Tim"],
      ["lastName", "McCurrach"],
      ["file", file1],
      ["file", file2],
    ]);
  });
});

describe("convertToFormData - complexValueHandler", () => {
  test("Check with default handler", () => {
    const handler = jest.spyOn(complexValueHandlers, "appendAll");
    onSubmit = jest.fn();
    const decoratedOnSubmit = convertToFormData(onSubmit);
    form = createForm({ onSubmit: decoratedOnSubmit });
    form.registerField("firstName", () => {}, [], { initialValue: "Tim" });
    form.registerField("foods", () => {}, [], {
      initialValue: { favourite: "toast", least: "peas" },
    });

    form.submit();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]).toEqual([
      "foods",
      { favourite: "toast", least: "peas" },
      expect.anything(),
      ["firstName", "foods"],
    ]);
  });

  test("check with custom handler", () => {
    const handler = jest.fn();
    onSubmit = jest.fn();
    const decoratedOnSubmit = convertToFormData(onSubmit, {
      handleComplexValues: handler,
    });
    form = createForm({ onSubmit: decoratedOnSubmit });
    form.registerField("firstName", () => {}, [], { initialValue: "Tim" });
    form.registerField("foods", () => {}, [], {
      initialValue: { favourite: "toast", least: "peas" },
    });

    form.submit();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]).toEqual([
      "foods",
      { favourite: "toast", least: "peas" },
      expect.anything(),
      ["firstName", "foods"],
    ]);
  });
});
