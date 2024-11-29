/**
 * @summary Type for decorator metadata
 * @memberOf module:reflection.decorators
 */
export type DecoratorMetadata<T = Record<string, unknown>> = {
  key: string;
  props: T;
};
