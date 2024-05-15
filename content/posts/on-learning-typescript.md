+++
title = 'On Learning Typescript'
date = 2024-05-05T18:15:03+02:00
series = "Web Development"
tags = ["TypeScript", "Frontend Masters"]
summary = "Summarizing what TypeScript is after finishing the TypeScript path of Frontend Masters. The topics range from tsc and tsconfig.json options, types, interfaces and classes to type guards and type theory. Working with the different types TypeScript offers can be a tremendous task at first, but with tremendousness comes huge power too. This is the first deep dive into a language I have already fallen in love with."
+++

## [Table of Contents]

1. [What is tsc?](#1-what-is-tsc)
2. [A First Glance at tsconfig.json](#2-a-first-glance-at-tsconfigjson)
3. [Types, Interfaces, Classes](#3-types-interfaces-classes)
4. [About Types in Detail](#4-about-types-in-detail)
5. [On Type Casting and Type Guards](#5-on-type-casting-and-type-guards)
6. [On Type Theory and Type Variance](#6-on-type-theory-and-type-variance)
7. [A Return to tsconfig.json](#7-a-return-to-tsconfigjson)

## 1. What is tsc?

TypeScript is really just **JavaScript with types**. On the other hand however, this _with types_ makes it a whole lot different. Therefore the main difference between the two is that JavaScript is a dynamically typed, whereas TypeScript is a statically typed language. At least during development. Because **at runtime** TypeScript **really is just JavaScript** without any of the additional features.

The reason behind this is that before we could run TypeScript in the browser, we must compile it to regular JavaScript, so that the browser can understand and run it. Here comes **tsc**, the **TypeScript Compiler** and **CLI tool** that makes this work for us. Technically the TypeScript Compiler is more like a transpiler. Compilers (like _gcc_) translate a language to another language, while transpilers (like _Babel_) translate to a different version of the same language. But I will refer to this as compilation throughout this article.

So if it all comes down to regular JavaScript, are types useful at all? For sure, because they still catch errors, and at compile time, not runtime. Also, TypeScript is the language that allows tools, e. g. IDEs like VS Code to analyze the code and provide better insights and auto completion among other features.

TypeScript can be installed running `npm i -g typescript`. This lets us use `tsc` in the terminal. Run `tsc --version` to check whether it works.

Now we can make a `hello.ts` file and fill it with some basic content.

```ts
let hello: string = "hello, world";

console.log(hello);
```

Then run `tsc hello.ts` to compile it to regular JavaScript. This creates a `hello.js` file in the same folder as `hello.ts`. As we can see in the `hello.js` file all type information was omitted during compilation.

It can be specified exactly what output file tsc should create using the `--outFile <filename>.js` option or specify the folder of all emitted files with the `--outDir <folder>` option, or set the target JavaScript language version with the `--target <version>` (e. g. ES6, ES2020) compiler flag. In case of older JS versions, our TypeScript files can't use JS features that are not present in the target language version.

When we run `tsc`, the TypeScript compiler automatically looks for a `tsconfig.json` file in the current directory, and if it doesn't find one, it keeps looking for it in the directory tree. We can manually provide a path for a `tsconfig` file using the `--project <path/tsconfig.json>` flag.

## 2. A First Glance at tsconfig.json

So, let's talk about this `tsconfig.json` before diving deeper into the language itself. An example `tsconfig.json` would look like this:

```json
{
	"include": ["src/**/*.ts"],
	"compilerOptions": {
		"target": "ES6",
		"module": "esnext",
		"outDir": "./dist"
	}
}
```

We can see that some options look the same as the flags we provided earlier for tsc. The `target` option lets us specify the language version that we want our `.ts` files to compile to.

The `module` options let us specify if we want to use ESModules or CommonJS modules. The most important ones are:

- `commonjs`: emits everything in the module system named and assumes that everything can be successfully imported - this option is no longer recommended.
- `nodenext`: for Node applications, supports ES modules and CJS modules side by side, currently identical to node16.
- `esnext`: currently identical to es2022, supports `import.meta` and `import * as alias from "module"` from es2020 and top-level `await` from es2022.

The `outDir` option lets us specify where we want to emit our compiled `.js` files, usually it is the `dist` folder. With the `include` option we can tell TypeScript what files to compile. There is a corresponding `exlude` option, if we want to exlude files from being compiled.

We will talk about the `tsconfig.json` in more detail at the end of this article, because the other options wouldn't make much sense before gaining a better understanding of the language itself.

## 3. Types, Interfaces, Classes

In TypeScript we can use type annotations to explicitly tell what type our variables, functions, etc. have. To understand what types are, we should look into what **primitive and basic types** TypeScript have. These will be our building blocks later on.

We already saw one primitive type, `string`, earlier on, and also saw what a type annotation is. Basically, we can use `: type` after almost anything in our code. The most used primitive and basic types are:

- **strings** --> `: string`
- **numbers** --> `: number`
- **booleans** --> `: boolean`
- **null** --> `: null`
- **arrays** --> `: [1, 2, 3]` OR `: number[]` OR `Array<number>`
- **tuples** (arrays with a fixed number of elements) --> `: [number, string]`
- **any** (when we don't know what type our variable or function will be, but still want to use methods on it that might exist at runtime) --> `: any`
- **unknown** (when we don't know what type our variable or function will be, but unlike any, we can't use any arbitrary methods on it until we are sure of its type, e. g. with type guards) --> `: unknown`
- **void** (no type at all, when we know a function will not return a value) --> `: void`
- **never** (when a function always throws an exception or never returns) --> `: never`

When we don't explicitly say in our code what type something has, TypeScript will infer types according to its best knowledge. Let's see how this **type inference** works. For example, if we have the following code:

```ts
const x = 12;
```

As we assigned a number to this variable, TypeScript will infer the type `number` to `x`. When we have different options, TypeScript will infer the types as union or intersect types, until it can make a closer guess. This works at development time, while we are still writing our code. So we can easily check if we've missed something, if TypeScript tells us something is `any` or `undefined` when it shouldn't be. We will talk about types in more detail in the next section.

Before getting into types in detail however, let's look at the other core features of TypeScript that help us structure the shape of our code, our data and our objects. The first one, that is absent in JavaScript, is the interface. **Interfaces** are almost like classes, although there are a couple important differences. So, in the following paragraphs we'll look at the similarities and differences between interfaces, classes and abstract classes with examples.

**Interfaces** are a TypeScript feature, meaning they are compile-time only and like types, are **not present at runtime**. Interfaces are contracts that tell the **rules of implenentation**. Interfaces are **open**, which means we can modify them later without touching the original code. An interface looks like this:

```ts
interface Philosopher {
	name: string;
	publications: Array<string>;
	argueWithoutObviousLogicalErrors: () => boolean;
}
```

We can extend an interface using the `extends` keyword:

```ts
interface AnalyticPhilosopher extends Philosopher {
	advancedMathematicalKnowledge: boolean;
}
```

We can also implement an interface using the `implements` keyword:

```ts
class ContemporaryPhilosopher implements Philosopher {
	name;
	publications;

	constructor(name: string, publications: Array<string>) {
		this.name = name;
		this.publications = publications;
	}
	argueWithoutObviousLogicalErrors(): boolean {
		if (Math.floor(Math.random() * 10) <= 5) {
			return true;
		} else {
			return false;
		}
	}
}
```

Or we could simply implement our interface for a variable, like the following:

```ts
const geniusPhilosopher: AnalyticPhilosopher = {
    name: "Saul Kripke",
    publications: ["Naming and Necessity", "Outline of a Theory of Truth"],
    argueWithoutObviousLogicalErrors() {
    if (Math.floor(Math.random() * 1) <= 5) {
        return true;
    } else {
        return true;
    },
    advancedMathematicalKnowledge: true,
};
```

Interface are open and can be re-opened like below:

```ts
interface Philosopher {
	name: string;
	publications: Array<string>;
	argueWithoutObviousLogicalErrors: () => boolean;
}

interface Philosopher {
	advancedMathematicalKnowledge: boolean;
}
```

This is called **declaration merging**. When TypeScript compiles this code, it will merge all interface declarations of the same name into one interface.

In contrast, **classes** and **abstract classes** are native JavaScript features which means that they are still present at runtime. A class is both a contract and the implementation of a factory. Under the hood it is basically an object with methods. Classes work the same as in JavaScript. We have already seen a class example above.

Now, abstract classes are **classes without the implementation details**. We could say, that interfaces and abstract classes can be used to achieve the same thing. With some caveats, of course. Abstract classes can implement methods, while interfaces can't. Also, classes are obliged to implement methods, but abstract classes are not. An abstract class can only be a parent class and cannot be extended, but it can implement multiple interfaces. This is what an abstract class looks like:

```ts
abstract class Person {
	public abstract name: string;
}

class Philosopher extends Person {
	public name: `Martin${any}` = "Martin Heidegger";
}
```

Properties by default are public, meaning they are accessible outside of the class using an object of the class. We can set interface and class properties as private, so that they are visible only to that class using the following syntax:

```ts
class TypescriptArticle {
	private _author;
	numberOfChapters;

	constructor(author: string, numberOfChapters: number) {
		this._author = author;
		this.numberOfChapters = numberofChapters;
	}
}
```

Keep in mind, that private properties are not part of the prototypal inheritance model, therefore they aren't inherited by subclasses. However, we have seen above that TypeScript only runs compile time, so these properties won't really be private at runtime. If we want to **set** some **properties as private**, it is better to use the native JavaScript syntax for it, like this:

```ts
class TypescriptArticle {
	#author;
	numberOfChapters;

	constructor(author: string, numberOfChapters: number) {
		this.#author = author;
		this.numberOfChapters = numberofChapters;
	}
}
```

This way we can be sure that our private properties stay private at runtime. If we want to declare variables that should be public but should not be changed, we can use the `readonly` keyword like this:

```ts
class TypescriptArticle {
	readonly author;
	numberOfChapters;

	constructor(author: string, numberOfChapters: number) {
		this.author = author;
		this.numberOfChapters = numberofChapters;
	}
}

let article = new TypescriptArticle("John Wick", 5);
article.numberOfChapters = 10;
article.author = "Someone else"; //This will show an error.
```

This means that the **readonly property cannot change its value** after initialization.

## 4. About Types in Detail

A close relative to an interface would be a type alias. **Type aliases** are types that we define ourselves. We can add a different name to primitive types or create our own type from a union type, for example, that we would reuse multiple times. An example for a type alias:

```ts
type Article = {
	id: number;
	title: string;
	author: string;
	content: string;
};

const newArticle: Article = {
	id: 151,
	title: "My First Article",
	author: "John Wick",
	content: "I stabbed three man with a pencil once.",
};

console.log(newArticle);
```

Another example with a type alias for a function:

```ts
type DoMath = (x: number, y: number) => number;

const add: DoMath = (x, y) => x + y;

console.log("Result:", add(1, 2)); // "Result: 3"
```

The biggest difference between types, type aliases and interfaces is that **a type cannot be reopened**, meanwhile **an interface is extensible**.

I've already mentioned **union types**, so let's talk about these next, starting with an example:

```ts
function getArticleId(id: number | string) {
	console.log(id);
}
```

We can see that a union type is declared with the usage of the `|` operator that separates each type. Logically, this means that our variable can be either type of `string` OR type of `number`, but cannot be anything else. The union of two types is really the intersection of the two sets, so we can only use properties and methods present on both types. So in the above example, if we tried to use the `toUpperCase()` method on `id`, it would show an error. That's why it is good practice to use type guards when working with union types.

We have seen what union types are. There are also **intersection types**, these are declared with the `&` operator. The main difference with union types is that intersection types merge several types into one. See the following example:

```ts
interface Square {
    height: number;
    width: number;
};

interface Circle {
    radius: number;
};

type UnidentifiedGeometricForm = Square & Circle;

let newObject: UnidentifiedGeometricForm = {
    height: 15;
    width: 15;
    radius: 15;
};
```

An intersection type `A` is composed of multiple types (`B, C`) and type `A` must be a member of both `B` and `C` at the same time, otherwise it won't compile.

We can define **literal types**, that are specific (literal) strings or numbers, etc. Take a look at the following example:

```ts
let taskStatus: "pending" | "approved" | "rejected";
```

This is pretty straightforward. But we can also define **template literal types**, which are a union of string literal types. We will soon see how they allow us to build wonderful types. A template literal type looks like this:

```ts
type familyName = "Heidegger" | "Buber";

type fullName = `Martin ${familyName}`;
```

We can see that the `fullName` type is a union of the strings _Martin Heidegger_ and _Martin Buber_.

A big topic when speaking of types are generics. **Generics** allow us to create placeholder types which will get replaced on execution. A basic example of a generic type would be:

```ts
function identity<T>(arg: T): T {
	return arg;
}

let output1 = identity<string>("welcome");
let output2 = identity<number>(5);

console.log(output1); // "welcome"
console.log(output2); // 5
```

When writing more complex functions, we can also use **multiple generics**, as it can be seen here:

```ts
function getProperty<T, K extends keyof T>(o: T, key: K): T[K] {
	return o.key;
}

let person = { name: "Ludwig Wittgenstein", profession: "philosopher" };
let newName: string = getProperty(person, "name");

console.log(newName); // "Ludwig Wittgenstein"
```

We can use **generics with interfaces** as the following code shows:

```ts
interface GenericTransformation<T, U> {
	(input: T): U;
}

function uppercase(input: string): string {
	return input.toUpperCase();
}

let uppercaseThis: GenericTransformation<string, string> = uppercase;

console.log(uppercaseThis("hello")); // "HELLO"
```

Of course, the same **applies to types and classes**.

Next, let's look at **conditional types**. To implement logic in our types, we can use the same syntax as with conditional expressions in JavaScript. This is useful when we have to manage user inputs where we might not know what type the input would be. This is what a conditional type looks like:

```ts
interface Person {
	name: string;
}

interface Philosopher extends Person {
	profession: "philosopher";
}

type IsBoolean = Philosopher extends Person ? boolean : never; // Type of IsBoolean is boolean

type IsNever = string extends Person ? boolean : never; // Type of IsNever is never
```

We can also use conditional types to narrow down the possible actual types of a generic type.

```ts
type ExtractIdType<T> = T extends (id: string | number) ? T["id"] : never;

interface NumericId {
    id: number
};

interface BooleanId {
    id: boolean
};

type NumericIdType = ExtractIdType<NumericId>; // Type of NumericIdType is number
type BooleanIdType = ExtractIdType<BooleanId>; // Type of BooleanIdType is never
```

We can use a more concide syntax with **conditional types** when it comes to **type inference**. The `infer` keyword let's us create a new generic type that we can utilize.

```ts
type ExtractSubjectType<T> = T extends { subject: infer U }
	? T["subject"]
	: never;

interface EpistemologySubject {
	subject: "epistemology";
}

type Epistemology = ExtractSubjectType<EpistemologySubject>; // Type of Epistemology is the string literal "epistemology"
```

**Mapped types** are yet another harder to grasp part of TypeScript. A mapped type is a generic type in which we use the `keyof` keyword to iterate through keys to create a type. This way we can easily create copies of types and modify those copies at once. Let's see it in action:

```ts
type Options<T> = {
	[P in keyof T]: boolean;
};

type Features = {
	darkMode: () => void;
};

type FeatureOptions = Options<Features>; // darkMode() returns a boolean inside FeatureOptions
```

We can easily **remap the keys of some type** using mapped types as we can see in the following example:

```ts
type Getter<T> = {
    [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];

interface Person {
    name: string;
    age: number;
};

type GetPerson = Getter<Person>; // Type GetPerson has two functions: getName: () => string and getAge: () => number
```

We can use **indexed access types** to look up a specific property on another type. The indexing type is itself a type, so we can use unions, `keyof`, or other types entirely. Let's take a look at the examples below:

```ts
type Person = { name: string; age: number; employed: boolean };

type Age = Person["age"]; // Type of Age is number

type Attributes = Person[keyof Person]; // Type of Attributes is string | number | boolean
```

Before wrapping up this section, let's talk about TypeScript's predefined **utility types**. We'll look at three of them, `Required`, `Pick` and `Record`, but there are, of course, many more. `Required<Type>` constructs a type that sets all properties of the type required. First, create a type with optional properties on it. _Creating types or classes with optional properties is not good practice because it can lead to bad performance giving the JavaScript VM much more work to do_. Then we can use `Required<Type>` to set all properties required.

```ts
type Antagonist {
    name?: string;
    game?: string;
};

const first: Antagonist = { name: "Thaos Ix Arkannon" }; // Seems okay

const second: Required<Antagonist> = { name: "Thaos Ix Arkannon" }; // Error: property game is missing, but required
```

`Pick<Type>` constructs a new type by picking a set of properties (string literals) from the original type.

```ts
interface Antagonist {
	name: string;
	movie: string;
	game: string;
}

type GameAntagonist = Pick<Antagonist, "name" | "game">;

const gameAntagonistExample: GameAntagonist = {
	name: "Thaos Ix Arkannon",
	game: "Pillars of Eternity",
};
```

`Record<Keys, Type>` constructs ab object type with property keys of `Keys` and property values of `Type` when we want to map the values of one type to another type. It works as follows:

```ts
type GameInfo {
    genre: string;
    released: number;
};

type GameTitle = "PillarsofEternity" | "DiscoElysium";

const games: Record<GameTitle, GameInfo> = {
    PillarsofEternity: { genre: "RPG", released: 2015 },
    DiscoElysium: { genre: "RPG", released: 2019 }
};
```

For more utility types, [check out the documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html).

## 5. On Type Casting and Type Guards

**Type casting** allows us to convert the type of a value to another type, so that different operations can be done with it. To understand type casting, first we must understand the **type hierarchy**. There are different kinds of types: top types, supertypes, subtypes and bottom types. The only **top types** in TypeScript are `unknown` and `any`, the only **bottom type** is `never`. Top types are on the top, bottom types are on the bottom of our type tree. This means that all types are subtypes of `unknown` and `any`, but `unknown` and `any` are not subtypes of any other type. `nothing` is a subtype of every type, but nothing is a subtype of `nothing`. Supertypes are like parent classes. `string` is the supertype of a string literal, and string literals are all subtypes of `string`.

Casting can be done in two directions: up and down. **Upcasting** means we reconvert a value's type as its supertype, also called **type widening**. See the following example:

```ts
interface Person {
	name: string;
}

interface Employee extends Person {
	employedAt: string;
}

const employedPerson: Employee = {
	name: "John Wick",
	employedAt: "Russian mafia",
};

const retiredPerson: Person = employedPerson; // retiredPerson doesn't have an employedAt property
```

The process of converting the value as its subtype is called **downcasting** or **type narrowing**. For this we can use the `as` operator, as follows:

```ts
let input = document.querySelector("input") as HTMLInputElement;
let inputValue = input.value; // input is of type HTMLInputElement, therefore it has a value property
```

But we cannot always use `as` to downcast our values, for example with **generics** or the `keyof` operator. In these cases we can use the `satisfies` operator, as follows:

```ts
interface Person {
	name: string;
}

interface Employee extends Person {
	employedAt: string;
}

const employedPerson = {
	name: "John Wick",
	employedAt: "Russian mafia",
} satisfies Employee;
```

However, `satisfies` will not attempt to widen our value, it is not actually casting. It is useful when we want to check our values against an expected supertype **without casting them**.

Okay, we now a basic understanding of how the type system works. But how can we check if a value is of type something and not something else before we, say, return a value. Here come **type guards**, another important topic in TypeScript.

**Type guards**, as the name implies, are used to validate your types mostly combined with conditional logic. This way we can have a more solid control flow using the type system. Next, let's look at some type guard examples to grasp the concept. The `typeof` type guards are exceptionally useful when working with union types, as can be seen below:

```ts
function getArticleId(id: number | string) {
	if (typeof id === "string") {
		console.log(id.toUpperCase()); // id is string
	} else {
		console.log(id); //id is number
	}
}
```

Or we could write a type guard function that we can reuse later on, as in the following example:

```ts
function isNumber(x: any): x is number {
	return typeof x === "number";
}

function printIdIfValid(id: any) {
	if (isNumber(id)) {
		console.log(id);
	} else {
		console.log("Not a valid id.");
	}
}
```

If we for some reason use optional parameters, there is a `!` **non-null assertion operator** to short circuit the nullability.

```ts
interface Person {
	name: string;
	email: string;
}

function getPerson(p?: Person) {
	let pName = p.name; // Error: p is possibly undefined
	let pMail = p!.email; // No error
}
```

## 6. On Type Theory and Type Variance

Type theory is a close relative to set theory developed by Frege, Russell and Zermelo, though nowadays it is mostly associated with Church's lamda calculus. Now, I'm no expert on lamda calculus, but there is still one topic in type theory we must talk about in relation to TypeScript, and that topic is type variance.

In the following examples we will see how different kinds of type variances can be present in our code, and how it might be advantageous to know about them. Let's start with **covariance**. Covariance means that if `T extends U`, then `F<T> extends F<U>`. Objects are covariant over their property types, class constructors are covariant over their instance types and functions are covariant over their return types.

```ts
type Covariant<T> = () => T;

function covariance<U, T extends U>(
	arg1: T,
	arg2: U,
	arg3: Covariant<T>,
	arg4: Covariant<U>
) {
	arg2 = arg1; // It's okay
	arg1 = arg2; // Error: not assignable

	arg4 = arg3; // It's okay
	arg3 = arg4; // Error: not assignable
}
```

In contrast, **contravariance** means that if `T extends U` then `F<U> extends F<T>`. Objects are contravariant over their key types, class constructors are contravariant over their construct parameter types and functions are contravariant over their parameter types.

```ts
type Contravariant<T> = (t: T) => void;

function contravariance<U, T extends U>(
	arg1: T,
	arg2: U,
	arg3: Contravariant<T>,
	arg4: Contravariant<U>
) {
	arg2 = arg1; // It's okay
	arg1 = arg2; // Error: not assignable

	arg4 = arg3; // Error: not assignable
	arg3 = arg4; // It's okay
}
```

Now, **invariance** means that `F<T>` is neither covariant nor contravariant over `T`, the type parameters are not assignable in either direction. For example function types that return the same type as their parameter are invariant.

```ts
type Invariant<T> = (t: T) => T;

function invariance<U, T extends U>(
	arg1: T,
	arg2: U,
	arg3: Invariant<T>,
	arg4: Invariant<U>
) {
	arg2 = arg1; // It's okay
	arg1 = arg2; // Error: not assignable

	arg4 = arg3; // Error: not assignable
	arg3 = arg4; // Error: not assignable
}
```

On the other hand, **bivariance** means that `F<T>` is both covariant and contravariant over `T`, the type parameters are assignable in both direction. Method types are bivariant over their parameter types when `strictFunctionTypes` is disabled in `tsconfig.json`. Bivariance is generally avoidable.

```ts
type Bivariant<T> = { foo(t: T): void };

function bivariance<U, T extends U>(
	arg1: T,
	arg2: U,
	arg3: Bivariant<T>,
	arg4: Bivariant<U>
) {
	arg2 = arg1; // It's okay
	arg1 = arg2; // Error: not assignable

	arg4 = arg3; // It's okay
	arg3 = arg4; // It's okay
}
```

So, wrap up why this is important. First of all, variance is a central part of the object-oriented programming paradigm, essential to working with classes or types. Variance is useful when dealing with types that are neither identical nor unrelated to each other. In these cases the order of the assignment matters: assigning one value to the other is fine, but in reverse it doesn't work. So, variance measures how the assignability of a given generic correlates with the assignability between instances of type parameters. We could call this variance over type parameters. The question is, if we have `F<T>` and `F<U>`, which can be assigned to which? Variance answers this question.

Then there are **variance helpers** from TypeScript version 5 and above, that will let the compiler skip many steps, thus saving precious time, and help us catch errors sooner. Variance helpers let us state our intentions for a type to be and remain of a specific variant. The helper `out` states that the type must be and remain covariant, and the helper `in` states that the type must be and remain contravariant. Let's look at some examples:

```ts
type Covariant<out T> = () => T;

type Covariant<in T> = () => T; // Error: not assignable as implied by variance annotation

type Contravariant<in T> = (t: T) => void;

type Contravariant<out T> = (t: T) => void; // Error: not assignable as implied by variance annotation
```

## 7. A Return to tsconfig.json

Now that we understand the ins and outs of the type system, let's check the different settings in the `tsconfig.json` for a more **thorough type checking**. This can help us streamline our development experience with the continuous inclusion of different flags. For example when migrating our JavaScript codebase to TypeScript, applying all flags at once can be overwhelming and counterproductive. So let's look at an example `tsconfig.json` with the different rules applied.

```json
{
	"include": ["src/**/*.ts"],
	"compilerOptions": {
		"target": "ES6",
		"module": "esnext",
		"outDir": "./dist",
		"strictNullChecks": true,
		"strictPropertyInitialization": true,
		"strictFunctionTypes": true,
		"noImplicitAny": true,
		"noImplicitThis": true,
		"noImplicitOverride": true,
		"useUnknownInCatchVariables": true
	}
}
```

When `strictNullChecks` is set to `true`, TypeScript will raise an error if any variables can have an implicit null or undefined type. When `strictPropertyInitialization` is set to `true`, TypeScript will raise an error when a class property is declared but is not initialized or not set in the constructor. When `strictFunctionTypes` is set to `true`, functions will be checked more correctly and stop bivariance in functions by default. This does not apply to methods, only to functions using the `function` syntax.

When no type annotation is used, TypeScript will fall back to `any`, that effectively means no errors. With `noImplicitAny` enabled, TypeScript will throw an error when a type is an inferred, implicit `any`. When `noImplicitThis` is enabled, TypeScript will throw an error when a `this` expression has an implicit `any` type. `noImplicitOverride` will issue an error when a subclass have a modified function from the parent class that should override the parent function unless we use the `override` keyword before the function explicitly. This let's us catch these kind of errors during development. Now, let's look at the following code snippet:

```ts
try {
	// Your function here...
} catch (err: unknown) {
	if (err instanceof Error) {
		console.log(err.message);
	}
}
```

When `useUnknownInCatchVariables` is set to `true`, we don't have to tell the `catch` function explicitly, that `err` is `unknown`, so our error handling `catch` functions can be more concise. Of course, there are more flags to use, and the [official TSConfig Reference](https://www.typescriptlang.org/tsconfig/) is a great resource for this.

We could also just set `"strict": true` to enable all (more than the above examples) type checking features. However, when upgrading TypeScript to a newer version with additional strict rules, this could lead to new errors in our code.

We can link together different `tsconfig` files with the `extends` parameter. This will inherit the options from the `tsconfig.json` it refers to. But we can apply additional rules for a part of our codebase. See the following example:

```json
{
	"extends": "./tsconfig",
	"compilerOptions": {
		"removeComments": true
	}
}
```

In addition to the options defined in our parent `tsconfig.json` this applies the `"removeComments"` flag. When we run `tsc` inside this folder, the output directory will stay the same, but emitted `.js` files will contain no comments present in our `.ts` files of this folder.

There is still a lot to cover with TypeScript, like the type declaration files and the DefinitelyTyped library or using TypeScript with React or Svelte. So, next time we will take a look at TypeScript in practice.
