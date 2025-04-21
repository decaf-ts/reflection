import SpyInstance = jest.SpyInstance;
import { Reflection, ReflectionKeys } from "../../src";
const KEY = "KEY";
const TEST_KEY = `TEST_${KEY}`;
const TEST_VAL = `TEST_VAL`;
class TestDecorators {
  static classDec() {
    return (
      target: object,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      propertyKey?: string | symbol | unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      descriptor?: PropertyDescriptor
    ) => {
      Reflect.defineMetadata(TEST_KEY, TEST_VAL, target);
    };
  }

  static dec1() {
    return (
      target: object,
      propertyKey?: string | symbol | unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      descriptor?: PropertyDescriptor
    ) => {
      Reflect.defineMetadata(
        TEST_KEY,
        TEST_VAL,
        target,
        propertyKey as string | symbol
      );
    };
  }
  static dec2() {
    return (
      target: object,
      propertyKey?: string | symbol | unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      descriptor?: PropertyDescriptor
    ) => {
      Reflect.defineMetadata(
        TEST_KEY + "2",
        TEST_VAL + "2",
        target,
        propertyKey as string | symbol
      );
    };
  }
}

let mockDec1: SpyInstance<
  (
    target: object,
    propertyKey?: unknown,
    descriptor?: PropertyDescriptor
  ) => void,
  [],
  any
>;
let mockDec2: SpyInstance<
  (
    target: object,
    propertyKey?: unknown,
    descriptor?: PropertyDescriptor
  ) => void,
  [],
  any
>;

describe("Reflections", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();

    mockDec1 = jest.spyOn(TestDecorators, "dec1");
    mockDec2 = jest.spyOn(TestDecorators, "dec2");
  });

  it("Calls decorators with inheritance", () => {
    class GrandParent {
      @TestDecorators.dec1()
      prop1?: string = undefined;

      @TestDecorators.dec1()
      prop0?: string = undefined;

      constructor() {}
    }

    class Parent extends GrandParent {
      @TestDecorators.dec2()
      prop2?: string = undefined;

      constructor() {
        super();
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class Child extends Parent {
      @TestDecorators.dec2()
      prop3?: string = undefined;

      @TestDecorators.dec2()
      prop0?: string = undefined;

      constructor() {
        super();
      }
    }

    expect(mockDec1).toHaveBeenCalledTimes(2);
    expect(mockDec2).toHaveBeenCalledTimes(3);
  });

  it("Properly retrieves decorators", () => {
    class GrandParent {
      @TestDecorators.dec1()
      prop1?: string = undefined;

      @TestDecorators.dec1()
      prop0?: string = undefined;

      constructor() {}
    }

    class Parent extends GrandParent {
      @TestDecorators.dec2()
      prop2?: string = undefined;

      constructor() {
        super();
      }
    }

    @TestDecorators.dec1()
    class Child extends Parent {
      @TestDecorators.dec2()
      prop3?: string = undefined;

      @TestDecorators.dec2()
      prop0?: string = undefined;

      constructor() {
        super();
      }
    }

    const grandparent = new GrandParent();
    const parent = new Parent();
    const child = new Child();

    const childProps = Reflection.getAllProperties(
      child as Record<any, any>,
      false
    );
    const allProps = Reflection.getAllProperties(
      child as Record<any, any>,
      true
    );

    expect(childProps).toEqual(expect.arrayContaining(Object.keys(child)));
    const allKeys = new Set([
      ...Object.keys(grandparent),
      ...Object.keys(parent),
      ...Object.keys(child),
    ]);
    expect(allProps).toEqual(expect.arrayContaining(Array.from(allKeys)));

    const prefix = TEST_KEY.substring(0, TEST_KEY.length - KEY.length);

    const classDecorators = Reflection.getClassDecorators(prefix, child);

    expect(classDecorators.length).toEqual(1);
    expect(classDecorators[0].key).toEqual(KEY);
    expect(classDecorators[0].props).toEqual(TEST_VAL);

    const propDecorators0 = Reflection.getPropertyDecorators(
      prefix,
      child,
      "prop0"
    );
    const propDecorators1 = Reflection.getPropertyDecorators(
      prefix,
      child,
      "prop1"
    );
    const propDecorators2 = Reflection.getPropertyDecorators(
      prefix,
      child,
      "prop2"
    );
    const propDecorators3 = Reflection.getPropertyDecorators(
      prefix,
      child,
      "prop3"
    );

    expect(propDecorators0).toEqual(
      expect.objectContaining({
        prop: "prop0",
        decorators: [
          {
            key: ReflectionKeys.TYPE,
            props: expect.anything(),
          },
          {
            key: KEY + "2",
            props: TEST_VAL + "2",
          },
          {
            key: KEY,
            props: TEST_VAL,
          },
        ],
      })
    );
    expect(propDecorators1).toEqual(
      expect.objectContaining({
        prop: "prop1",
        decorators: [
          {
            key: ReflectionKeys.TYPE,
            props: expect.anything(),
          },
          {
            key: KEY,
            props: TEST_VAL,
          },
        ],
      })
    );
    expect(propDecorators2).toEqual(
      expect.objectContaining({
        prop: "prop2",
        decorators: [
          {
            key: ReflectionKeys.TYPE,
            props: expect.anything(),
          },
          {
            key: KEY + "2",
            props: TEST_VAL + "2",
          },
        ],
      })
    );
    expect(propDecorators3).toEqual(
      expect.objectContaining({
        prop: "prop3",
        decorators: [
          {
            key: ReflectionKeys.TYPE,
            props: expect.anything(),
          },
          {
            key: KEY + "2",
            props: TEST_VAL + "2",
          },
        ],
      })
    );

    const decs0 = Reflection.getAllPropertyDecorators(child, prefix);
    expect(decs0).toEqual(
      expect.objectContaining({
        prop0: [
          {
            key: ReflectionKeys.TYPE,
            props: expect.anything(),
          },
          {
            key: KEY + "2",
            props: TEST_VAL + "2",
          },
          {
            key: KEY,
            props: TEST_VAL,
          },
        ],
        prop1: [
          {
            key: ReflectionKeys.TYPE,
            props: expect.anything(),
          },
          {
            key: KEY,
            props: TEST_VAL,
          },
        ],
        prop2: [
          {
            key: ReflectionKeys.TYPE,
            props: expect.anything(),
          },
          {
            key: KEY + "2",
            props: TEST_VAL + "2",
          },
        ],
        prop3: [
          {
            key: ReflectionKeys.TYPE,
            props: expect.anything(),
          },
          {
            key: KEY + "2",
            props: TEST_VAL + "2",
          },
        ],
      })
    );

    const type = Reflection.getTypeFromDecorator(child, "prop0");
    expect(type).toEqual(String.name);

    expect(
      Reflection.evaluateDesignTypes(undefined, ["String", "number"])
    ).toBe(false);
    expect(Reflection.evaluateDesignTypes(undefined, "undefined")).toBe(true);
    expect(Reflection.evaluateDesignTypes("test", ["String", "number"])).toBe(
      true
    );
    expect(Reflection.evaluateDesignTypes(10, ["String", "number"])).toBe(true);
    expect(
      Reflection.evaluateDesignTypes(function test() {}, ["String", "number"])
    ).toBe(false);
    const fn = jest.fn();
    expect(Reflection.evaluateDesignTypes(10, fn)).toBe(false);
    expect(Reflection.evaluateDesignTypes(child, Child.name)).toBe(true);
  });
});
