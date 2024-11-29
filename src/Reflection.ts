import { DecoratorMetadata } from "./types";
import { ReflectionKeys } from "./constants";
import { isEqual } from "./equality";

/**
 * @summary Namespace class holding reflection API
 * @description holds the functionality to handle reflection metadata
 *
 * @class Reflection
 * @static
 *
 * @memberOf module:reflection
 */
export class Reflection {
  private constructor() {}

  /**
   * @summary Util function to check a type according to a typeName
   *
   * @param {any} value
   * @param {string} acceptedType
   *
   * @return {boolean} true for a match, false otherwise
   *
   * @static
   */
  private static checkType(value: unknown, acceptedType: string) {
    if (typeof value === acceptedType) return true;
    if (typeof value !== "object") return false;
    return (
      (value as object).constructor &&
      (value as object).constructor.name.toLowerCase() ===
        acceptedType.toLowerCase()
    );
  }

  /**
   * @summary Util function to check a type according multiple possibilities
   *
   * @param {unknown} value
   * @param {string[]} acceptedTypes
   * @return {boolean} true if any is a match, false otherwise
   *
   * @static
   */
  static checkTypes(value: unknown, acceptedTypes: string[]) {
    return !acceptedTypes.every((t) => !this.checkType(value, t));
  }

  /**
   * @summary evaluates the type metadata vs the value type
   *
   * @param {any} value
   * @param {string | string[] | {name: string}} types
   *
   * @static
   */
  static evaluateDesignTypes(
    value: unknown,
    types: string | string[] | { name: string }
  ) {
    switch (typeof types) {
      case "string":
        return this.checkType(value, types);
      case "object":
        if (Array.isArray(types)) return this.checkTypes(value, types);
        return true;
      case "function":
        if (types.name && types.name !== "Object")
          return this.checkType(value, types.name);
        return true;
      default:
        return true;
    }
  }

  /**
   * @summary Retrieves all properties of an object
   * @description
   *  - and of all its prototypes if {@param climbTree} until it reaches {@param stopAt} (or ends the prototype chain)
   *
   * @param {Record<string, unknown>} obj
   * @param {boolean} [climbTree] default to true
   * @param {string} [stopAt] defaults to 'Object'
   *
   * @static
   */
  static getAllProperties(
    obj: Record<string, unknown>,
    climbTree = true,
    stopAt = "Object"
  ) {
    const allProps: string[] = [];
    let curr: Record<string, unknown> = obj;

    const keepAtIt = function () {
      if (!climbTree) return;
      const prototype = Object.getPrototypeOf(curr);
      if (!prototype || prototype.constructor.name === stopAt) return;
      curr = prototype;
      return curr;
    };

    do {
      const props = Object.getOwnPropertyNames(curr);
      props.forEach(function (prop) {
        if (allProps.indexOf(prop) === -1) allProps.push(prop);
      });
    } while (keepAtIt());
    return allProps;
  }

  /**
   * @summary Util function to retrieve the Class decorators
   * @param {string} annotationPrefix
   * @param {object} target
   *
   * @static
   */
  static getClassDecorators(
    annotationPrefix: string,
    target: object
  ): { key: string; props: unknown }[] {
    const keys: string[] = Reflect.getOwnMetadataKeys(target.constructor);

    return keys
      .filter((key) => key.toString().startsWith(annotationPrefix))
      .reduce((values: { key: string; props: unknown }[], key) => {
        // get metadata value
        const currValues = {
          key: key.substring(annotationPrefix.length),
          props: Reflect.getMetadata(key, target.constructor),
        };
        return values.concat(currValues);
      }, []);
  }

  /**
   * @summary Retrieves the decorators for an object's properties prefixed by {@param prefixes}
   *
   * @param {M} model
   * @param {string[]} prefixes
   *
   * @static
   */
  static getAllPropertyDecorators<M extends object>(
    model: M,
    ...prefixes: string[]
  ): Record<string, DecoratorMetadata[]> | undefined {
    if (!prefixes || !prefixes.length) return;

    function pushOrCreate(
      accum: Record<string, DecoratorMetadata[]>,
      key: string,
      decorators: DecoratorMetadata[]
    ): void {
      if (!decorators || !decorators.length) return;
      if (!accum[key]) accum[key] = [];
      accum[key].push(...decorators);
    }

    return Object.getOwnPropertyNames(model).reduce(
      (accum: Record<string, never> | undefined, propKey) => {
        prefixes.forEach((p, index) => {
          const decorators: {
            prop: string;
            decorators: DecoratorMetadata[];
          } = this.getPropertyDecorators(p, model, propKey, index !== 0);
          if (!accum) accum = {};
          pushOrCreate(accum, propKey, decorators.decorators);
        });
        return accum;
      },
      undefined
    );
  }

  /**
   * @summary gets the prop type from the decorator
   * @description uses the metadata to discover the type of the object stored under model[proKey]
   *
   * @param {any} model
   * @param {string | symbol} propKey
   * @return {string | undefined}
   *
   * @static
   */
  static getTypeFromDecorator(
    model: object,
    propKey: string | symbol
  ): string | undefined {
    const decorators: { prop: string | symbol; decorators: unknown[] } =
      this.getPropertyDecorators(ReflectionKeys.TYPE, model, propKey, false);
    if (!decorators || !decorators.decorators) return;

    const typeDecorator: DecoratorMetadata =
      decorators.decorators.shift() as DecoratorMetadata;
    const name = typeDecorator.props
      ? (typeDecorator.props.name as string)
      : undefined;
    return name !== "Function" ? name : undefined;
  }

  /**
   * @summary Util function to retrieve the decorators for the provided Property
   *
   * @param {string} annotationPrefix
   * @param {object} target
   * @param {string | symbol} propertyName
   * @param {boolean} [ignoreType] defaults to false. decides if the {@link ReflectionKeys.TYPE} is ignored or not
   * @param {boolean} [recursive] defaults to true. decides if it should climb the prototypal tree searching for more decorators on that property
   * @param {DecoratorMetadata[]} [accumulator] used when recursive is true, to cache decorators while it climbs the prototypal tree
   */
  static getPropertyDecorators(
    annotationPrefix: string,
    target: object,
    propertyName: string | symbol,
    ignoreType: boolean = false,
    recursive = true,
    accumulator?: DecoratorMetadata[]
  ): { prop: string; decorators: DecoratorMetadata[] } {
    const getPropertyDecoratorsForModel = function (
      annotationPrefix: string,
      target: object,
      propertyName: string | symbol,
      ignoreType: boolean = false,
      accumulator?: DecoratorMetadata[]
    ): { prop: string; decorators: DecoratorMetadata[] } {
      // get info about keys that used in current property
      const keys: string[] = Reflect.getMetadataKeys(target, propertyName);
      const decorators: DecoratorMetadata[] = keys
        // filter your custom decorators
        .filter((key) => {
          if (ignoreType) return key.toString().startsWith(annotationPrefix);
          return (
            key === ReflectionKeys.TYPE ||
            key.toString().startsWith(annotationPrefix)
          );
        })
        .reduce((values, key) => {
          // get metadata value.
          const currValues = {
            key:
              key !== ReflectionKeys.TYPE
                ? key.substring(annotationPrefix.length)
                : key,
            props: Reflect.getMetadata(key, target, propertyName),
          };
          return values.concat(currValues);
        }, accumulator || []);

      return {
        prop: propertyName.toString(),
        decorators: decorators,
      };
    };

    const result: { prop: string; decorators: DecoratorMetadata[] } =
      getPropertyDecoratorsForModel(
        annotationPrefix,
        target,
        propertyName,
        ignoreType,
        accumulator
      );

    const trim = function (items: DecoratorMetadata[]) {
      const cache: Record<string, DecoratorMetadata> = {};
      return items.filter((item: DecoratorMetadata) => {
        if (item.key in cache) {
          if (!isEqual(item.props, cache[item.key]))
            console.log(
              `Found a similar decorator for the ${item.key} property` +
                `of a ${target.constructor.name} model but with different attributes.` +
                "The original one will be kept"
            );
          return false;
        }

        cache[item.key.toString()] = item.props as DecoratorMetadata;
        return true;
      });
    };

    if (!recursive || Object.getPrototypeOf(target) === Object.prototype) {
      return {
        prop: result.prop,
        decorators: trim(result.decorators),
      };
    }

    // We choose to ignore type here, because in inheritance the expected type is from the lowest child class
    return this.getPropertyDecorators(
      annotationPrefix,
      Object.getPrototypeOf(target.constructor),
      propertyName,
      true,
      recursive,
      result.decorators
    );
  }
}