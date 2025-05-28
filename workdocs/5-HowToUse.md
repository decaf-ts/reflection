## How to Use

- [Initial Setup](./tutorials/For%20Developers.md#_initial-setup_)
- [Installation](./tutorials/For%20Developers.md#installation)

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
