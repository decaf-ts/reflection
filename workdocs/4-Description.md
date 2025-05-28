## Description

The Reflection library is a powerful utility package for TypeScript applications that enhances runtime type inspection and metadata manipulation capabilities. Built on top of the `reflect-metadata` API, it provides a comprehensive set of tools for working with TypeScript's type system at runtime.

### Core Components

#### Reflection Class
The central component of the library is the `Reflection` class, which provides methods for:

- **Type Checking**: Validate values against expected types at runtime with `checkType` and `checkTypes` methods
- **Property Inspection**: Retrieve all properties of an object, including those in the prototype chain with `getAllProperties`
- **Decorator Management**: Access and manipulate class and property decorators with methods like `getClassDecorators`, `getAllPropertyDecorators`, and `getPropertyDecorators`
- **Type Extraction**: Extract type information from decorators with `getTypeFromDecorator`

#### Decorator Utilities
The library includes decorator factory functions that simplify working with metadata:

- **metadata**: A versatile decorator factory that attaches metadata to classes, methods, or properties
- **apply**: A utility for applying multiple decorators to a single target in sequence

#### Deep Equality Comparison
The `isEqual` function provides sophisticated deep equality checking between any two values with support for:

- Primitive types with special handling for edge cases like NaN and +0/-0
- Complex objects including Arrays, Maps, Sets, Dates, RegExp, and Error objects
- TypedArrays with byte-by-byte comparison
- Property exclusion through the optional `propsToIgnore` parameter

#### Type Definitions
The library defines several TypeScript types to provide structure for working with decorators and metadata:

- **DecoratorMetadata**: Represents metadata associated with decorators
- **ClassDecoratorsList**: Collection of class decorators
- **PropertyDecoratorList**: Maps property names to their decorators
- **FullPropertyDecoratorList**: Complete decorator information for properties

### Integration with TypeScript Ecosystem

The Reflection library is designed to work seamlessly with TypeScript's type system and the `reflect-metadata` API. It enhances TypeScript's compile-time type checking with runtime validation capabilities, making it an essential tool for building robust, type-safe applications.

### Use Cases

- **Runtime Type Validation**: Verify that values conform to expected types during program execution
- **Framework Development**: Build frameworks that leverage TypeScript's type system at runtime
- **Object Comparison**: Perform deep equality checks between complex objects
- **Metadata-Driven Architecture**: Create systems that use metadata to drive behavior

Please follow the Contributing guide or the developer's guide to contribute to this library. All help is appreciated.

Technical documentation can be found [here](https://decaf-ts.github.io/reflection/)
