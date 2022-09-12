const sampleFunc = require("../sample");

describe("sample tests", () => {
  test("print hello world", () => {
    var result = sampleFunc();
    expect(result).toBe("hello world");
  });
});
