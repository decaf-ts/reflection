import { isEqual } from "../../src";

describe("equality", () => {
  const obj = {
    id: "id",
    prop1: 23,
    prop2: "tests",
    prop3: "asdasfsdfsda",
    prop4: "test@pdm.com",
    prop8: new Date(),
  };

  it("handles simple objects", () => {
    expect(isEqual(obj, { ...obj })).toEqual(true);
    expect(isEqual(obj, Object.assign({}, obj, { prop8: new Date() }))).toEqual(
      false
    );
  });

  it("handles omitting attributes", () => {
    const obj2 = Object.assign({}, obj, { prop1: 24 });
    expect(isEqual(obj, obj2)).toEqual(false);
    expect(isEqual(obj, obj2, "prop1")).toEqual(true);
  });

  it("handles different types", () => {
    expect(isEqual("test", 1)).toEqual(false);
  });

  it("handles arrays", () => {
    const obj2 = {
      id: "id",
      prop1: [3, 4, 5],
    };

    expect(
      isEqual(obj2, Object.assign({}, obj2, { prop1: [3, 5, 5] }))
    ).toEqual(false);
    expect(isEqual(obj2, obj2)).toEqual(true);
  });

  it("handles reordering arrays", () => {
    const obj2 = {
      id: "id",
      prop1: [3, 4, 5],
    };

    expect(
      isEqual(obj2, Object.assign({}, obj2, { prop1: [3, 5, 4] }))
    ).toEqual(false);
  });

  it("handles extra items", () => {
    const obj4 = {
      id: "id",
      prop1: "stuff",
    };

    const obj5 = Object.assign({}, obj4, { prop2: 1 });

    expect(isEqual(obj4, obj5)).toEqual(false);
    expect(isEqual(obj5, obj4)).toEqual(false);
  });
});
