![Banner](./workdocs/assets/Banner.png)
## Decaf-ts' Reflection

A comprehensive TypeScript reflection library that provides utilities for metadata manipulation, type checking, and decorator management. The library enables runtime type inspection, deep object comparison, and advanced decorator operations, making it easier to build type-safe applications with enhanced runtime capabilities.


![Licence](https://img.shields.io/github/license/decaf-ts/reflection.svg?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/decaf-ts/reflection?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/decaf-ts/reflection?style=plastic)

[![Build & Test](https://github.com/decaf-ts/reflection/actions/workflows/nodejs-build-prod.yaml/badge.svg)](https://github.com/decaf-ts/reflection/actions/workflows/nodejs-build-prod.yaml)
[![CodeQL](https://github.com/decaf-ts/reflection/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/decaf-ts/reflection/actions/workflows/codeql-analysis.yml)[![Snyk Analysis](https://github.com/decaf-ts/reflection/actions/workflows/snyk-analysis.yaml/badge.svg)](https://github.com/decaf-ts/reflection/actions/workflows/snyk-analysis.yaml)
[![Pages builder](https://github.com/decaf-ts/reflection/actions/workflows/pages.yaml/badge.svg)](https://github.com/decaf-ts/reflection/actions/workflows/pages.yaml)
[![.github/workflows/release-on-tag.yaml](https://github.com/decaf-ts/reflection/actions/workflows/release-on-tag.yaml/badge.svg?event=release)](https://github.com/decaf-ts/reflection/actions/workflows/release-on-tag.yaml)

![Open Issues](https://img.shields.io/github/issues/decaf-ts/reflection.svg)
![Closed Issues](https://img.shields.io/github/issues-closed/decaf-ts/reflection.svg)
![Pull Requests](https://img.shields.io/github/issues-pr-closed/decaf-ts/reflection.svg)
![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

![Forks](https://img.shields.io/github/forks/decaf-ts/reflection.svg)
![Stars](https://img.shields.io/github/stars/decaf-ts/reflection.svg)
![Watchers](https://img.shields.io/github/watchers/decaf-ts/reflection.svg)

![Node Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbadges%2Fshields%2Fmaster%2Fpackage.json&label=Node&query=$.engines.node&colorB=blue)
![NPM Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbadges%2Fshields%2Fmaster%2Fpackage.json&label=NPM&query=$.engines.npm&colorB=purple)

Documentation available [here](https://decaf-ts.github.io/reflection/)

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


## How to Use

- [Initial Setup](./workdocs/tutorials/For%20Developers.md#_initial-setup_)
- [Installation](./workdocs/tutorials/For%20Developers.md#installation)

### Basic Setup

Before using the reflection library, you need to ensure that you have the necessary TypeScript configuration:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    // other options...
  }
}
```

Then import the library:

```typescript
import { Reflection, metadata, apply, isEqual, ReflectionKeys } from '@decaf-ts/reflection';
```

### Reflection Class Examples

#### Type Checking with checkType

Description: Validate that a value matches an expected type at runtime.

```typescript
import { Reflection } from '@decaf-ts/reflection';

const reflection = new Reflection();

// Check if a value is a string
const value = "Hello, world!";
const isString = reflection.checkType(value, String); // Returns true

// Check if a value is a number
const num = 42;
const isNumber = reflection.checkType(num, Number); // Returns true

// Check if a value is an instance of a class
class Person {
  constructor(public name: string) {}
}
const person = new Person("John");
const isPerson = reflection.checkType(person, Person); // Returns true
```

#### Type Checking with checkTypes

Description: Validate that a value matches any of the expected types at runtime.

```typescript
import { Reflection } from '@decaf-ts/reflection';

const reflection = new Reflection();

// Check if a value is either a string or a number
const value1 = "Hello";
const value2 = 42;

const isStringOrNumber1 = reflection.checkTypes(value1, [String, Number]); // Returns true
const isStringOrNumber2 = reflection.checkTypes(value2, [String, Number]); // Returns true
const isStringOrNumber3 = reflection.checkTypes(true, [String, Number]); // Returns false
```

#### Getting All Properties with getAllProperties

Description: Retrieve all properties of an object, including those in the prototype chain.

```typescript
import { Reflection } from '@decaf-ts/reflection';

const reflection = new Reflection();

class BaseClass {
  baseProperty = 'base';

  baseMethod() {
    return 'base method';
  }
}

class DerivedClass extends BaseClass {
  derivedProperty = 'derived';

  derivedMethod() {
    return 'derived method';
  }
}

const instance = new DerivedClass();

// Get all properties including those from the prototype chain
const allProps = reflection.getAllProperties(instance, true);
console.log(allProps); 
// Output includes: 'baseProperty', 'baseMethod', 'derivedProperty', 'derivedMethod'

// Get only own properties
const ownProps = reflection.getAllProperties(instance, false);
console.log(ownProps); 
// Output includes only: 'baseProperty', 'derivedProperty'
```

#### Getting Class Decorators

Description: Retrieve decorators applied to a class that match a specific prefix.

```typescript
import { Reflection, metadata } from '@decaf-ts/reflection';

const reflection = new Reflection();

// Define some decorators
const EntityDecorator = metadata('entity', { name: 'User' });
const ValidateDecorator = metadata('validate', { required: true });

// Apply decorators to a class
@EntityDecorator
@ValidateDecorator
class User {
  id: number;
  name: string;
}

// Get all decorators with 'entity' prefix
const entityDecorators = reflection.getClassDecorators('entity', User);
console.log(entityDecorators);
// Output: [{ key: 'entity', props: { name: 'User' } }]
```

#### Getting Property Decorators

Description: Retrieve decorators applied to a property that match a specific prefix.

```typescript
import { Reflection, metadata } from '@decaf-ts/reflection';

const reflection = new Reflection();

// Define some property decorators
const ColumnDecorator = metadata('column', { type: 'varchar' });
const ValidateDecorator = metadata('validate', { required: true });

class User {
  @ColumnDecorator
  @ValidateDecorator
  name: string;
}

// Get all decorators with 'column' prefix for the 'name' property
const columnDecorators = reflection.getPropertyDecorators('column', User, 'name');
console.log(columnDecorators);
// Output: [{ key: 'column', props: { type: 'varchar' } }]
```

### Decorator Utilities Examples

#### Using the metadata Decorator

Description: Create and apply a decorator that attaches metadata to a class, method, or property.

```typescript
import { metadata } from '@decaf-ts/reflection';

// Create a decorator for marking a class as an entity
const Entity = (name: string) => metadata('entity', { name });

// Create a decorator for marking a property as a column
const Column = (options: { type: string, nullable?: boolean }) => 
  metadata('column', options);

// Apply decorators
@Entity('users')
class User {
  @Column({ type: 'int', nullable: false })
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;
}

// The metadata can later be retrieved using Reflection methods
```

#### Using the apply Decorator

Description: Apply multiple decorators to a single target in a single decorator.

```typescript
import { apply, metadata } from '@decaf-ts/reflection';

// Create individual decorators
const Required = metadata('validate', { required: true });
const MaxLength = (length: number) => metadata('validate', { maxLength: length });
const Email = metadata('validate', { isEmail: true });

// Create a composite decorator using apply
const ValidEmail = apply(
  Required,
  MaxLength(100),
  Email
);

class User {
  // Apply multiple validations with a single decorator
  @ValidEmail
  email: string;
}

// This is equivalent to:
// @Required
// @MaxLength(100)
// @Email
// email: string;
```

### Deep Equality Comparison Example

#### Using isEqual for Object Comparison

Description: Compare two objects deeply to determine if they are equal, with the ability to ignore specific properties.

```typescript
import { isEqual } from '@decaf-ts/reflection';

// Compare primitive values
console.log(isEqual(1, 1)); // true
console.log(isEqual('hello', 'hello')); // true
console.log(isEqual(1, '1')); // false (different types)

// Compare objects
const obj1 = { name: 'John', age: 30 };
const obj2 = { name: 'John', age: 30 };
const obj3 = { name: 'Jane', age: 30 };

console.log(isEqual(obj1, obj2)); // true
console.log(isEqual(obj1, obj3)); // false

// Compare with ignored properties
const user1 = { id: 1, name: 'John', createdAt: new Date('2023-01-01') };
const user2 = { id: 2, name: 'John', createdAt: new Date('2023-02-01') };

// Compare ignoring 'id' and 'createdAt'
console.log(isEqual(user1, user2, 'id', 'createdAt')); // true

// Compare complex structures
const complex1 = {
  data: [1, 2, 3],
  metadata: new Map([['key1', 'value1']]),
  date: new Date('2023-01-01')
};

const complex2 = {
  data: [1, 2, 3],
  metadata: new Map([['key1', 'value1']]),
  date: new Date('2023-01-01')
};

console.log(isEqual(complex1, complex2)); // true
```

### Working with ReflectionKeys

Description: Use the predefined metadata keys for accessing type information.

```typescript
import { ReflectionKeys, metadata } from '@decaf-ts/reflection';
import 'reflect-metadata';

// Define a class with a property
class User {
  name: string;
}

// Access the type metadata
const typeMetadata = Reflect.getMetadata(ReflectionKeys.TYPE, User.prototype, 'name');
console.log(typeMetadata === String); // true (if emitDecoratorMetadata is enabled)

// Define a custom decorator that uses ReflectionKeys
function TypedProperty() {
  return (target: any, propertyKey: string) => {
    const type = Reflect.getMetadata(ReflectionKeys.TYPE, target, propertyKey);
    console.log(`Property ${propertyKey} has type: ${type.name}`);
  };
}

class Product {
  @TypedProperty()
  price: number;
}
// Output: "Property price has type: Number"
```

### Advanced Use Cases

#### Building a Simple Validation System

Description: Create a validation system using reflection and decorators.

```typescript
import { Reflection, metadata, apply } from '@decaf-ts/reflection';

// Create validation decorators
const Required = metadata('validate', { required: true });
const MinLength = (min: number) => metadata('validate', { minLength: min });
const MaxLength = (max: number) => metadata('validate', { maxLength: max });
const Email = metadata('validate', { isEmail: true });

// Create a validator class
class Validator {
  private reflection = new Reflection();

  validate(instance: any): { isValid: boolean, errors: string[] } {
    const errors: string[] = [];
    const constructor = instance.constructor;

    // Get all properties with validation decorators
    const decoratedProps = this.reflection.getAllPropertyDecorators(constructor, ['validate']);

    for (const propName in decoratedProps) {
      const value = instance[propName];
      const validators = decoratedProps[propName];

      for (const validator of validators) {
        const props = validator.props as Record<string, any>;

        // Check required
        if (props.required && (value === undefined || value === null || value === '')) {
          errors.push(`${propName} is required`);
        }

        // Skip other validations if value is not present
        if (value === undefined || value === null) continue;

        // Check minLength
        if (props.minLength && typeof value === 'string' && value.length < props.minLength) {
          errors.push(`${propName} must be at least ${props.minLength} characters`);
        }

        // Check maxLength
        if (props.maxLength && typeof value === 'string' && value.length > props.maxLength) {
          errors.push(`${propName} must be at most ${props.maxLength} characters`);
        }

        // Check email
        if (props.isEmail && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${propName} must be a valid email address`);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Use the validation system
class User {
  @Required
  id: number;

  @apply(Required, MinLength(3), MaxLength(50))
  name: string;

  @apply(Required, Email)
  email: string;
}

const validator = new Validator();

// Valid user
const validUser = new User();
validUser.id = 1;
validUser.name = "John Doe";
validUser.email = "john@example.com";
console.log(validator.validate(validUser)); 
// { isValid: true, errors: [] }

// Invalid user
const invalidUser = new User();
invalidUser.name = "Jo";
invalidUser.email = "not-an-email";
console.log(validator.validate(invalidUser));
// { 
//   isValid: false, 
//   errors: [
//     'id is required',
//     'name must be at least 3 characters',
//     'email must be a valid email address'
//   ] 
// }
```


### Related

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=decaf-ts&repo=decaf-ts)](https://github.com/decaf-ts/decaf-ts)

### Social

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/decaf-ts/)




#### Languages

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ShellScript](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)

## Getting help

If you have bug reports, questions or suggestions please [create a new issue](https://github.com/decaf-ts/ts-workspace/issues/new/choose).

## Contributing

I am grateful for any contributions made to this project. Please read [this](./workdocs/98-Contributing.md) to get started.

## Supporting

The first and easiest way you can support it is by [Contributing](./workdocs/98-Contributing.md). Even just finding a typo in the documentation is important.

Financial support is always welcome and helps keep both me and the project alive and healthy.

So if you can, if this project in any way. either by learning something or simply by helping you save precious time, please consider donating.

## License

This project is released under the [LGPL License](./LICENSE.md).

By developers, for developers...