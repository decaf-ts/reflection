import "reflect-metadata";

/**
 * @description Decorator that assigns metadata to a class, method, or property
 * @summary Creates a decorator that attaches metadata to the target using Reflect.defineMetadata
 * @template V - The type of the metadata value
 * @param {string} key - The key under which the metadata is stored
 * @param {V} value - The metadata value to be associated with the key
 * @return {Function} A decorator function that can be applied to classes, methods, or properties
 * @function metadata
 * @category Decorators
 */
export function metadata<V>(key: string, value: V) {
  return (
    target: object,
    propertyKey?: string | symbol | unknown,
    descriptor?: PropertyDescriptor
  ) => {
    if (descriptor && typeof descriptor.value === "function") {
      Reflect.defineMetadata(key, value, descriptor.value as object); // method
    } else if (propertyKey) {
      Reflect.defineMetadata(
        key,
        value,
        target,
        propertyKey as string | symbol
      ); // property
    } else {
      Reflect.defineMetadata(key, value, target); // class
    }
  };
}

/**
 * @description Decorator factory that applies multiple decorators to a single target
 * @summary Creates a composite decorator that applies multiple decorators in sequence
 * @param {Array<ClassDecorator | MethodDecorator | PropertyDecorator>} decorators - Array of decorators to apply
 * @return {Function} A decorator function that applies all provided decorators to the target
 * @function apply
 * @category Decorators
 */
export function apply(
  ...decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator>
) {
  return (
    target: object,
    propertyKey?: string | symbol | unknown,
    descriptor?: PropertyDescriptor
  ) => {
    for (const decorator of decorators) {
      if (target instanceof Function && !descriptor) {
        (decorator as ClassDecorator)(target);
        continue;
      }
      (decorator as MethodDecorator | PropertyDecorator)(
        target,
        propertyKey as string | symbol,
        descriptor as TypedPropertyDescriptor<unknown>
      );
    }
  };
}
