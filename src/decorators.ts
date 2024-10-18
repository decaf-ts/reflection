import "reflect-metadata";

/**
 * @summary Holds all possible decorators
 * @description alias for {@link MethodDecorator} or {@link PropertyDecorator} or {@link ClassDecorator}
 * @typedef V any
 * @typedef CustomDecorator<V>
 *
 * @memberOf module:reflection.decorators
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type CustomDecorator<V> = MethodDecorator &
  ClassDecorator &
  PropertyDecorator;

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
export function metadata<V>(key: string, value: V): CustomDecorator<V> {
  return (
    target: object,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) => {
    if (descriptor) {
      Reflect.defineMetadata(key, value, descriptor.value); // method
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return <TFunction extends Function, Y>(
    target: TFunction | object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y>
  ) => {
    for (const decorator of decorators) {
      if (target instanceof Function && !descriptor) {
        (decorator as ClassDecorator)(target);
        continue;
      }
      (decorator as MethodDecorator | PropertyDecorator)(
        target,
        propertyKey as string | symbol,
        descriptor as TypedPropertyDescriptor<Y>
      );
    }
  };
}
