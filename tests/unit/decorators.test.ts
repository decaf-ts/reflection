import { metadata } from "../../src";
import SpyInstance = jest.SpyInstance;
import { apply } from "../../src";

describe("decorators", () => {
  describe("@metadata", () => {
    const key = "key",
      value = "value";

    @metadata(key, value)
    class ClassMetadataTest {}

    class StaticMethodMetadataTest {
      @metadata(key, value)
      public static test() {}
    }

    class MethodMetadataTest {
      @metadata(key, value)
      public test() {}
    }

    class PropertyMetadataTest {
      @metadata(key, value)
      test: string = "";
    }

    it("should enhance class with expected metadata", () => {
      const metadata = Reflect.getMetadata(key, ClassMetadataTest);
      expect(metadata).toEqual(value);
    });

    it("should enhance method with expected metadata", () => {
      const metadata = Reflect.getMetadata(key, StaticMethodMetadataTest.test);
      expect(metadata).toEqual(value);
    });

    it("should enhance instance method with expected metadata", () => {
      const instance = new MethodMetadataTest();
      const metadata = Reflect.getMetadata(key, instance.test);
      expect(metadata).toEqual(value);
    });

    it("should enhance instance property with expected metadata", () => {
      const instance = new PropertyMetadataTest();
      const metadata = Reflect.getMetadata(key, instance, "test");
      expect(metadata).toEqual(value);
    });
  });

  describe("@apply", () => {
    class TestDecorators {
      static dec1() {
        return (
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          target: object,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          propertyKey?: string | symbol | unknown,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          descriptor?: PropertyDescriptor
        ) => {};
      }
      static dec2() {
        return (
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          target: object,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          propertyKey?: string | symbol | unknown,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          descriptor?: PropertyDescriptor
        ) => {};
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

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
      jest.restoreAllMocks();

      mockDec1 = jest.spyOn(TestDecorators, "dec1");
      mockDec2 = jest.spyOn(TestDecorators, "dec2");
    });

    it("applies multiple decorators to a class", () => {
      @apply(TestDecorators.dec1(), TestDecorators.dec2())
      class TestClass {
        constructor() {}
      }

      expect(mockDec1).toHaveBeenCalledTimes(1);
      expect(mockDec1).toHaveBeenCalledTimes(1);
    });

    it("applies multiple decorators to a property (if initialized)", () => {
      class TestProperty {
        @apply(TestDecorators.dec1(), TestDecorators.dec2())
        prop?: string = undefined;
        constructor() {}
      }
      new TestProperty();
      expect(mockDec1).toHaveBeenCalledTimes(1);
      expect(mockDec1).toHaveBeenCalledTimes(1);
    });

    it("applies multiple decorators to a property", () => {
      class TestMethod {
        constructor() {}
        @apply(TestDecorators.dec1(), TestDecorators.dec2())
        doSomething() {}
      }

      new TestMethod().doSomething();
      expect(mockDec1).toHaveBeenCalledTimes(1);
      expect(mockDec1).toHaveBeenCalledTimes(1);
    });
  });
});
