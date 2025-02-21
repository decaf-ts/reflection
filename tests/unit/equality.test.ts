import { isEqual } from "../../src";

describe("equality", () => {
  // Simple cases
  it("handles simple equality", () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual("a", "a")).toBe(true);
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
  });

  it("handles simple inequality", () => {
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual("a", "b")).toBe(false);
    expect(isEqual(true, false)).toBe(false);
    expect(isEqual(null, undefined)).toBe(false);
  });

  it("handles NaN", () => {
    expect(isEqual(NaN, NaN)).toBe(true);
  });

  it("handles +0 and -0", () => {
    expect(isEqual(0, -0)).toBe(false);
    expect(isEqual(-0, -0)).toBe(true);
    expect(isEqual(+0, +0)).toBe(true);
  });

  // Date objects
  it("handles Date objects", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-01-01");
    const date3 = new Date("2023-01-02");
    expect(isEqual(date1, date2)).toBe(true);
    expect(isEqual(date1, date3)).toBe(false);
  });

  // RegExp objects
  it("handles RegExp objects", () => {
    expect(isEqual(/abc/, /abc/)).toBe(true);
    expect(isEqual(/abc/, /def/)).toBe(false);
    expect(isEqual(/abc/g, /abc/i)).toBe(false);
  });

  // Error objects
  it("handles Error objects", () => {
    const error1 = new Error("test");
    const error2 = new Error("test");
    const error3 = new Error("different");
    const error4 = new TypeError("test");
    expect(isEqual(error1, error2)).toBe(true);
    expect(isEqual(error1, error3)).toBe(false);
    expect(isEqual(error1, error4)).toBe(false);
  });

  // Array objects
  it("handles Array objects", () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(isEqual([1, 2, 3], [1, 2, 3, 4])).toBe(false);
  });

  // Map objects
  it("handles Map objects", () => {
    const map1 = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    const map2 = new Map([
      ["b", 2],
      ["a", 1],
    ]);
    const map3 = new Map([
      ["a", 1],
      ["b", 3],
    ]);
    expect(isEqual(map1, map2)).toBe(true);
    expect(isEqual(map1, map3)).toBe(false);
  });

  // Set objects
  it("handles Set objects", () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([3, 2, 1]);
    const set3 = new Set([1, 2, 4]);
    expect(isEqual(set1, set2)).toBe(true);
    expect(isEqual(set1, set3)).toBe(false);
  });

  // TypedArray objects
  it("handles TypedArray objects", () => {
    const arr1 = new Int32Array([1, 2, 3]);
    const arr2 = new Int32Array([1, 2, 3]);
    const arr3 = new Int32Array([1, 2, 4]);
    expect(isEqual(arr1, arr2)).toBe(true);
    expect(isEqual(arr1, arr3)).toBe(false);
  });

  it("handles typed arrays of different lengths", () => {
    const arr1 = new Int32Array([1, 2, 3]);
    const arr2 = new Int32Array([1, 2, 3, 4]);
    expect(isEqual(arr1, arr2)).toBe(false);
  });

  it("handles arrays of different lengths", () => {
    expect(isEqual([1, 2, 3], [1, 2, 3, 4])).toBe(false);
  });

  it("handles objects with different number of keys", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2, c: 3 };
    expect(isEqual(obj1, obj2)).toBe(false);
  });

  it("handles maps of different sizes", () => {
    const map1 = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    const map2 = new Map([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
    expect(isEqual(map1, map2)).toBe(false);
  });

  it("handles sets of different sizes", () => {
    const set1 = new Set([1, 2]);
    const set2 = new Set([1, 2, 3]);
    expect(isEqual(set1, set2)).toBe(false);
  });

  // Regular objects
  it("handles regular objects", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 2, a: 1 };
    const obj3 = { a: 1, b: 3 };
    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
  });

  // Objects with Symbol properties
  it("handles objects with Symbol properties", () => {
    const sym1 = Symbol("test");
    const sym2 = Symbol("test");
    const obj1 = { [sym1]: 1 };
    const obj2 = { [sym1]: 1 };
    const obj3 = { [sym2]: 1 };
    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
  });

  // Nested objects
  it("handles nested objects", () => {
    const nested1 = { a: 1, b: { c: 2, d: [3, 4] } };
    const nested2 = { a: 1, b: { c: 2, d: [3, 4] } };
    const nested3 = { a: 1, b: { c: 2, d: [3, 5] } };
    expect(isEqual(nested1, nested2)).toBe(true);
    expect(isEqual(nested1, nested3)).toBe(false);
  });

  // Property ignoring
  it("handles property ignoring", () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 3, c: 3 };
    expect(isEqual(obj1, obj2)).toBe(false);
    expect(isEqual(obj1, obj2, "b")).toBe(true);
  });

  // Mixed types
  it("handles mixed types", () => {
    expect(isEqual({ a: 1, b: "2", c: true }, { a: 1, b: "2", c: true })).toBe(
      true
    );
    expect(isEqual({ a: 1, b: "2", c: true }, { a: 1, b: 2, c: true })).toBe(
      false
    );
  });

  // Edge cases
  it("handles edge cases", () => {
    expect(isEqual({}, {})).toBe(true);
    expect(isEqual([], [])).toBe(true);

    const invalidDate1 = new Date("Invalid Date");
    const invalidDate2 = new Date("Invalid Date");
    expect(isEqual(invalidDate1, invalidDate2)).toBe(true);

    const validDate = new Date();
    expect(isEqual(invalidDate1, validDate)).toBe(false);
  });

  it("handles functions", () => {
    const func1 = () => {};
    const func2 = () => {};
    expect(isEqual(func1, func1)).toBe(true);
    expect(isEqual(func1, func2)).toBe(false);
  });

  it("handles nested objects with symbols", () => {
    const symbol1 = Symbol("test");
    const symbol2 = Symbol("test");
    const obj1 = { a: { [symbol1]: 1 } };
    const obj2 = { a: { [symbol1]: 1 } };
    const obj3 = { a: { [symbol2]: 1 } };
    expect(isEqual(obj1, obj2)).toBe(true);
    expect(isEqual(obj1, obj3)).toBe(false);
  });

  it("handles objects with different prototype chains", () => {
    class A {}
    class B {}
    expect(isEqual(new A(), new B())).toBe(false);
  });
});
