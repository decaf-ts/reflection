/**
 * @description Type definition for storing decorator metadata
 * @summary Represents the structure of metadata associated with decorators, containing a key and properties
 * @template T - Type of the properties object, defaults to Record<string, unknown>
 * @typedef {Object} DecoratorMetadata
 * @property {string} key - The identifier key for the decorator
 * @property {T} props - The properties/configuration of the decorator
 * @memberOf module:reflection
 */
export type DecoratorMetadata<T = Record<string, unknown>> = {
  key: string;
  props: T;
};

/**
 * @description List of class-level decorators with their properties
 * @summary Array type representing a collection of class decorators, each with a key and associated properties
 * @typedef {Array<Object>} ClassDecoratorsList
 * @property {string} key - The identifier key for the decorator
 * @property {unknown} props - The properties/configuration of the decorator
 * @memberOf module:reflection
 */
export type ClassDecoratorsList = { key: string; props: unknown }[];

/**
 * @description Type definition for mapping property names to their decorators
 * @summary Record type that associates property names with arrays of decorator metadata
 * @typedef {Object} PropertyDecoratorList
 * @property {DecoratorMetadata[]} [propertyName] - Array of decorator metadata for each property
 * @memberOf module:reflection
 */
export type PropertyDecoratorList = Record<string, DecoratorMetadata[]>;

/**
 * @description Type definition for the complete decorator information of a property
 * @summary Record type that represents the full decorator metadata for a property, including its name and all associated decorators
 * @typedef {Object} FullPropertyDecoratorList
 * @property {DecoratorMetadata[]} [propertyName] - Array of decorator metadata for each property
 * @memberOf module:reflection
 */
export type FullPropertyDecoratorList = Record<string, DecoratorMetadata[]>;
