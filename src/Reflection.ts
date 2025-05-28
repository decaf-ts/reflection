import {
  ClassDecoratorsList,
  DecoratorMetadata,
  FullPropertyDecoratorList,
  PropertyDecoratorList,
} from "./types";
import { ReflectionKeys } from "./constants";
import { isEqual } from "./equality";

/**
 * @description A utility class for handling reflection metadata in TypeScript
 * @summary Namespace class holding reflection API that provides functionality to handle reflection metadata, type checking, and decorator management
 * @param {string} annotationPrefix - The prefix used to filter decorators in various methods
 * @param {object} target - The target object or class to retrieve metadata from
 * @param {string|symbol} propertyName - The name of the property to retrieve metadata for
 * @param {boolean} [ignoreType] - Whether to ignore type metadata in certain operations
 * @param {boolean} [recursive] - Whether to recursively traverse the prototype chain
 * @param {DecoratorMetadata[]} [accumulator] - Used to accumulate metadata during recursive operations
 * @class Reflection
 * @example
 * // Get all property decorators with a specific prefix
 * const model = new MyClass();
 * const decorators = Reflection.getAllPropertyDecorators(model, 'prefix');
 *
 * // Check if a value matches a specific type
 * const isString = Reflection.checkTypes(value, ['string']);
 *
 * // Get all properties of an object including inherited ones
 * const props = Reflection.getAllProperties(obj, true);
 *
 * // Get class decorators with a specific prefix
 * const classDecorators = Reflection.getClassDecorators('prefix', myClassInstance);
 *
 * // Get property type from decorator
 * const propType = Reflection.getTypeFromDecorator(model, 'propertyName');
 * @mermaid
 * sequenceDiagram
 *   participant Client
 *   participant Reflection
 *   participant ReflectAPI
 *
 *   Client->>Reflection: getAllPropertyDecorators(model, prefix)
 *   Reflection->>Reflection: getPropertyDecorators(prefix, model, propKey)
 *   Reflection->>ReflectAPI: getMetadataKeys(target, propertyName)
 *   ReflectAPI-->>Reflection: keys[]
 *   Reflection->>ReflectAPI: getMetadata(key, target, propertyName)
 *   ReflectAPI-->>Reflection: metadata
 *   Reflection-->>Client: decorators
 */
export class Reflection {
  private constructor() {}

  /**
   * @description Checks if a value matches a specified type name
   * @summary Utility function to verify if a value's type matches the provided type name
   * @param {unknown} value - The value to check the type of
   * @param {string} acceptedType - The type name to check against
   * @return {boolean} Returns true if the value matches the accepted type, false otherwise
   */
  private static checkType(value: unknown, acceptedType: string) {
    if (typeof value === acceptedType.toLowerCase()) return true;
    if (typeof value === "undefined") return false;
    if (typeof value !== "object") return false;
    return (
      (value as object).constructor &&
      (value as object).constructor.name.toLowerCase() ===
        acceptedType.toLowerCase()
    );
  }

  /**
   * @description Checks if a value matches any of the specified type names
   * @summary Utility function to verify if a value's type matches any of the provided type names
   * @param {unknown} value - The value to check the type of
   * @param {string[]} acceptedTypes - Array of type names to check against
   * @return {boolean} Returns true if the value matches any of the accepted types, false otherwise
   */
  static checkTypes(value: unknown, acceptedTypes: string[]) {
    return !acceptedTypes.every((t) => !this.checkType(value, t));
  }

  /**
   * @description Evaluates if a value matches the specified type metadata
   * @summary Compares a value against type metadata to determine if they match
   * @param {unknown} value - The value to evaluate
   * @param {string | string[] | {name: string}} types - Type metadata to check against, can be a string, array of strings, or an object with a name property
   * @return {boolean} Returns true if the value matches the type metadata, false otherwise
   */
  static evaluateDesignTypes(
    value: unknown,
    types: string | string[] | { name: string }
  ) {
    switch (typeof types) {
      case "string":
        return this.checkType(value, types);
      case "object":
        if (Array.isArray(types)) return Reflection.checkTypes(value, types);
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
   * @description Retrieves all properties of an object
   * @summary Collects all property names from an object, optionally including those from its prototype chain
   * @param {Record<string, unknown>} obj - The object to retrieve properties from
   * @param {boolean} [climbTree=true] - Whether to crawl up the prototype chain
   * @param {string} [stopAt="Object"] - The constructor name at which to stop climbing the prototype chain
   * @return {string[]} An array of all property names found in the object
   */
  static getAllProperties(
    obj: Record<string, unknown>,
    climbTree: boolean = true,
    stopAt: string = "Object"
  ) {
    const allProps = new Set<string>();
    let curr: Record<string, unknown> = obj;

    const keepAtIt = function () {
      if (!climbTree) return;
      const prototype = Object.getPrototypeOf(curr);
      if (!prototype || prototype.constructor.name === stopAt) return;
      curr = prototype;
      return curr;
    };

    do {
      Object.getOwnPropertyNames(curr).forEach((prop) => allProps.add(prop));
    } while (keepAtIt());

    return Array.from(allProps);
  }

  /**
   * @description Retrieves all class decorators with a specific prefix
   * @summary Utility function to extract class-level decorators that start with a given prefix
   * @param {string} annotationPrefix - The prefix to filter decorators by
   * @param {object} target - The class instance to retrieve decorators from
   * @return {ClassDecoratorsList} An array of objects containing decorator keys and their properties
   */
  static getClassDecorators(
    annotationPrefix: string,
    target: object
  ): ClassDecoratorsList {
    const keys: string[] = Reflect.getOwnMetadataKeys(target.constructor);
    const result: ClassDecoratorsList = [];

    for (const key of keys) {
      if (key.startsWith(annotationPrefix)) {
        result.push({
          key: key.slice(annotationPrefix.length),
          props: Reflect.getMetadata(key, target.constructor),
        });
      }
    }

    return result;
  }

  /**
   * @description Retrieves all property decorators with specific prefixes for an object
   * @summary Collects all decorators for an object's properties that start with any of the provided prefixes
   * @template M - Type of the model object
   * @param {M} model - The object to retrieve property decorators from
   * @param {string[]} prefixes - Array of prefixes to filter decorators by
   * @return {Record<string, DecoratorMetadata[]> | undefined} A record mapping property names to their decorators, or undefined if none found
   */
  static getAllPropertyDecorators<M extends object>(
    model: M,
    ...prefixes: string[]
  ): PropertyDecoratorList | undefined {
    if (!prefixes || prefixes.length === 0) return undefined;

    const result: PropertyDecoratorList = {};
    const properties = Object.getOwnPropertyNames(model);

    for (const propKey of properties) {
      for (let i = 0; i < prefixes.length; i++) {
        const decorators = Reflection.getPropertyDecorators(
          prefixes[i],
          model,
          propKey,
          i !== 0
        );
        if (decorators.decorators.length > 0) {
          if (!result[propKey]) {
            result[propKey] = [];
          }
          result[propKey].push(...decorators.decorators);
        }
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }

  /**
   * @description Uses metadata to discover the type of a property from its decorator
   * @summary Extracts the type information from a property's decorator metadata
   * @param {object} model - The object containing the property
   * @param {string | symbol} propKey - The key of the property to get the type for
   * @return {string | undefined} The type name of the property, or undefined if not found or if the type is Function
   */
  static getTypeFromDecorator(
    model: object,
    propKey: string | symbol
  ): string | undefined {
    const decorators: PropertyDecoratorList = Reflection.getPropertyDecorators(
      ReflectionKeys.TYPE,
      model,
      propKey,
      false
    );
    if (!decorators || !decorators.decorators) return;

    const typeDecorator: DecoratorMetadata =
      decorators.decorators.shift() as DecoratorMetadata;
    const name = typeDecorator.props
      ? (typeDecorator.props.name as string)
      : undefined;
    return name !== "Function" ? name : undefined;
  }

  /**
   * @description Retrieves all decorators for a specific property
   * @summary Utility function to extract property-level decorators that start with a given prefix, with options for recursive prototype chain traversal
   * @param {string} annotationPrefix - The prefix to filter decorators by
   * @param {object} target - The object containing the property
   * @param {string | symbol} propertyName - The name of the property to retrieve decorators for
   * @param {boolean} [ignoreType=false] - Whether to ignore the TYPE metadata key
   * @param {boolean} [recursive=true] - Whether to climb the prototype chain looking for more decorators
   * @param {DecoratorMetadata[]} [accumulator] - Used internally to accumulate decorators during recursive calls
   * @return {FullPropertyDecoratorList} An object containing the property name and its decorators
   * @mermaid
   * sequenceDiagram
   *   participant Client
   *   participant Reflection
   *   participant InnerFunction
   *   participant ReflectAPI
   *
   *   Client->>Reflection: getPropertyDecorators(prefix, target, propName)
   *   Reflection->>InnerFunction: getPropertyDecoratorsForModel(prefix, target, propName)
   *   InnerFunction->>ReflectAPI: getMetadataKeys(target, propertyName)
   *   ReflectAPI-->>InnerFunction: keys[]
   *   InnerFunction->>ReflectAPI: getMetadata(key, target, propertyName)
   *   ReflectAPI-->>InnerFunction: metadata
   *   InnerFunction-->>Reflection: {prop, decorators}
   *
   *   alt recursive && not Object.prototype
   *     Reflection->>Reflection: getPropertyDecorators(prefix, prototype, propName, true, recursive, result.decorators)
   *   else
   *     Reflection->>Reflection: trim(result.decorators)
   *   end
   *
   *   Reflection-->>Client: {prop, decorators}
   */
  static getPropertyDecorators(
    annotationPrefix: string,
    target: object,
    propertyName: string | symbol,
    ignoreType: boolean = false,
    recursive = true,
    accumulator?: DecoratorMetadata[]
  ): FullPropertyDecoratorList {
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
        prop: result.prop as any,
        decorators: trim(result.decorators),
      };
    }

    // We choose to ignore type here, because in inheritance the expected type is from the lowest child class
    return Reflection.getPropertyDecorators(
      annotationPrefix,
      Object.getPrototypeOf(target.constructor),
      propertyName,
      true,
      recursive,
      result.decorators
    );
  }
}
