/**
 * @summary Type for decorator metadata
 * @memberOf reflection
 */
export type DecoratorMetadata<T = Record<string, any>> = {
  key: string;
  props: T;
};
