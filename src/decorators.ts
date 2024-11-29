import "reflect-metadata";

/**
 * @summary Decorator that assigns metadata to the class/method using the
 * specified `key`.
 *
 * @param {string} key a value defining the key under which the metadata is stored
 * @param {any} value metadata to be associated with `key`
 *
 * @function metadata
 *
 * @memberOf module:reflection.decorators
 */
export function metadata<V>(key: string, value: V) {
  return (
    target: object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<unknown>
  ) => {
    if (descriptor) {
      Reflect.defineMetadata(key, value, descriptor.value as object); // method
    } else if (propertyKey) {
      Reflect.defineMetadata(key, value, target, propertyKey); // property
    } else {
      Reflect.defineMetadata(key, value, target); // class
    }
  };
}

/**
 * @summary Decorator that assigns metadata to the class/method using the specified `key`.
 *
 * @param {Array<ClassDecorator | MethodDecorator | PropertyDecorator>} decorators a value defining the key under which the metadata is stored
 *
 * @function apply
 *
 * @memberOf module:reflection.decorators
 */
export function apply(
  ...decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator>
) {
  return (target: object, propertyKey?: any, descriptor?: any) => {
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
