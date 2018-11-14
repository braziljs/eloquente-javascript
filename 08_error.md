{{meta {load_files: ["code/chapter/08_error.js"]}}}

# Bugs and Errors

{{quote {author: "Brian Kernighan and P.J. Plauger", title: "The Elements of Programming Style", chapter: true}

Debugging is twice as hard as writing the code in the first place.
Therefore, if you write the code as cleverly as possible, you are, by
definition, not smart enough to debug it.

quote}}

{{figure {url: "img/chapter_picture_8.jpg", alt: "Picture of a collection of bugs", chapter: framed}}}

{{index "Kernighan, Brian", "Plauger, P.J.", debugging, "error handling"}}

Flaws in computer programs are usually called _((bug))s_. It makes
programmers feel good to imagine them as little things that just
happen to crawl into our work. In reality, of course, we put them
there ourselves.

If a program is crystallized thought, you can roughly categorize bugs
into those caused by the thoughts being confused and those caused by
mistakes introduced while converting a thought to code. The former
type is generally harder to diagnose and fix than the latter.

## Language

{{index parsing, analysis}}

Many mistakes could be pointed out to us automatically by the
computer, if it knew enough about what we're trying to do. But here
JavaScript's looseness is a hindrance. Its concept of bindings and
properties is vague enough that it will rarely catch ((typo))s before
actually running the program. And even then, it allows you to do some
clearly nonsensical things without complaint, such as computing
`true * "monkey"`.

{{index [syntax, error], [property, access]}}

There are some things that JavaScript does complain about. Writing a
program that does not follow the language's ((grammar)) will
immediately make the computer complain. Other things, such as calling
something that's not a function or looking up a property on an
((undefined)) value, will cause an error to be reported when the
program tries to perform the action.

{{index NaN, error}}

But often, your nonsense computation will merely produce `NaN` (not a
number) or an undefined value, while the program happily continues,
convinced that it's doing something meaningful. The mistake will
manifest itself only later, after the bogus value has traveled through
several functions. It might not trigger an error at all but silently
cause the program's output to be wrong. Finding the source of such
problems can be difficult.

The process of finding mistakes—bugs—in programs is called
_((debugging))_.

## Strict mode

{{index "strict mode", [syntax, error], function}}

{{indexsee "use strict", "strict mode"}}

JavaScript can be made a _little_ stricter by enabling _strict
mode_. This is done by putting the string `"use strict"` at the top of
a file or a function body. Here's an example:

```{test: "error \"ReferenceError: counter is not defined\""}
function canYouSpotTheProblem() {
  "use strict";
  for (counter = 0; counter < 10; counter++) {
    console.log("Happy happy");
  }
}

canYouSpotTheProblem();
// → ReferenceError: counter is not defined
```

{{index "let keyword", [binding, global]}}

Normally, when you forget to put `let` in front of your binding, as
with `counter` in the example, JavaScript quietly creates a global
binding and uses that. In strict mode, an ((error)) is reported
instead. This is very helpful. It should be noted, though, that this
doesn't work when the binding in question already exists as a global
binding. In that case, the loop will still quietly overwrite the value
of the binding.

{{index "this binding", "global object", undefined, "strict mode"}}

Another change in strict mode is that the `this` binding holds the
value `undefined` in functions that are not called as ((method))s.
When making such a call outside of strict mode, `this` refers to the
global scope object, which is an object whose properties are the
global bindings. So if you accidentally call a method or constructor
incorrectly in strict mode, JavaScript will produce an error as soon
as it tries to read something from `this`, rather than happily writing
to the global scope.

For example, consider the following code, which calls a
((constructor)) function without the `new` keyword so that its `this`
will _not_ refer to a newly constructed object:

```
function Person(name) { this.name = name; }
let ferdinand = Person("Ferdinand"); // oops
console.log(name);
// → Ferdinand
```

{{index error}}

So the bogus call to `Person` succeeded but returned an undefined
value and created the global binding `name`. In strict mode, the
result is different.

```{test: "error \"TypeError: Cannot set property 'name' of undefined\""}
"use strict";
function Person(name) { this.name = name; }
let ferdinand = Person("Ferdinand"); // forgot new
// → TypeError: Cannot set property 'name' of undefined
```

We are immediately told that something is wrong. This is helpful.

Fortunately, constructors created with the `class` notation will
always complain if they are called without `new`, making this less of
a problem even in non-strict mode.

{{index parameter, [binding, naming], "with statement"}}

Strict mode does a few more things. It disallows giving a function
multiple parameters with the same name and removes certain problematic
language features entirely (such as the `with` statement, which is so
wrong it is not further discussed in this book).

{{index debugging}}

In short, putting `"use strict"` at the top of your program rarely
hurts and might help you spot a problem.

## Types

Some languages want to know the types of all your bindings and
expressions before even running a program. They will tell you right
away when a type is used in an inconsistent way. JavaScript considers
types only when actually running the program, and even there often
tries to implicitly convert values to the type it expects, so it's not
much help.

Still, types provide a useful framework for talking about programs. A
lot of mistakes come from being confused about the kind of value that
goes into or comes out of a function. If you have that information
written down, you're less likely to get confused.

You could add a comment like the following before the `goalOrientedRobot`
function from the previous chapter to describe its type:

```
// (VillageState, Array) → {direction: string, memory: Array}
function goalOrientedRobot(state, memory) {
  // ...
}
```

There are a number of different conventions for annotating JavaScript
programs with types.

One thing about types is that they need to introduce their own
complexity to be able to describe enough code to be useful. What do
you think would be the type of the `randomPick` function that returns
a random element from an array? You'd need to introduce a _((type
variable))_, _T_, which can stand in for any type, so that you can
give `randomPick` a type like `([T]) → T` (function from an array of
*T*s to a *T*).

{{index "type checking", TypeScript}}

{{id typing}}

When the types of a program are known, it is possible for the computer
to _check_ them for you, pointing out mistakes before the program is
run. There are several JavaScript dialects that add types to the
language and check them. The most popular one is called
[TypeScript](https://www.typescriptlang.org/). If you are interested
in adding more rigor to your programs, I recommend you give it a try.

In this book, we'll continue using raw, dangerous, untyped JavaScript
code.

## Testing

{{index "test suite", "run-time error", automation, testing}}

If the language is not going to do much to help us find mistakes,
we'll have to find them the hard way: by running the program and
seeing whether it does the right thing.

Doing this by hand, again and again, is a really bad idea. Not only is
it annoying, it also tends to be ineffective since it takes too much
time to exhaustively test everything every time you make a change.

Computers are good at repetitive tasks, and testing is the ideal
repetitive task. Automated testing is the process of writing a program
that tests another program. Writing tests is a bit more work than
testing manually, but once you've done it, you gain a kind of
superpower: it takes you only a few seconds to verify that your
program still behaves properly in all the situations you wrote tests
for. When you break something, you'll immediately notice, rather than
randomly running into it at some later time.

{{index "toUpperCase method"}}

Tests usually take the form of little labeled programs that verify
some aspect of your code. For example, a set of tests for the
(standard, probably already tested by someone else) `toUpperCase`
method might look like this:

```
function test(label, body) {
  if (!body()) console.log(`Failed: ${label}`);
}

test("convert Latin text to uppercase", () => {
  return "hello".toUpperCase() == "HELLO";
});
test("convert Greek text to uppercase", () => {
  return "Χαίρετε".toUpperCase() == "ΧΑΊΡΕΤΕ";
});
test("don't convert case-less characters", () => {
  return "مرحبا".toUpperCase() == "مرحبا";
});
```

{{index "domain-specific language"}}

Writing tests like this tends to produce rather repetitive, awkward
code. Fortunately, there exist pieces of software that help you build
and run collections of tests (_((test suites))_) by providing a
language (in the form of functions and methods) suited to expressing
tests and by outputting informative information when a test fails.
These are usually called _((test runners))_.

{{index "persistent data structure"}}

Some code is easier to test than other code. Generally, the more
external objects that the code interacts with, the harder it is to set
up the context in which to test it. The style of programming shown in
the [previous chapter](robot), which uses self-contained persistent
values rather than changing objects, tends to be easy to test.

## Debugging

{{index debugging}}

Once you notice there is something wrong with your program
because it misbehaves or produces errors, the next step is to figure
out _what_ the problem is.

Sometimes it is obvious. The ((error)) message will point at a
specific line of your program, and if you look at the error
description and that line of code, you can often see the problem.

{{index "run-time error"}}

But not always. Sometimes the line that triggered the problem is
simply the first place where a flaky value produced elsewhere gets
used in an invalid way. If you have been solving the ((exercises)) in
earlier chapters, you will probably have already experienced such
situations.

{{index "decimal number", "binary number"}}

The following example program tries to convert a whole number to a
string in a given base (decimal, binary, and so on) by repeatedly
picking out the last ((digit)) and then dividing the number to get rid
of this digit. But the strange output that it currently produces
suggests that it has a ((bug)).

```
function numberToString(n, base = 10) {
  let result = "", sign = "";
  if (n < 0) {
    sign = "-";
    n = -n;
  }
  do {
    result = String(n % base) + result;
    n /= base;
  } while (n > 0);
  return sign + result;
}
console.log(numberToString(13, 10));
// → 1.5e-3231.3e-3221.3e-3211.3e-3201.3e-3191.3e-3181.3…
```

{{index analysis}}

Even if you see the problem already, pretend for a moment that you
don't. We know that our program is malfunctioning, and we want to find
out why.

{{index "trial and error"}}

This is where you must resist the urge to start making random changes
to the code to see whether that makes it better. Instead, _think_. Analyze
what is happening and come up with a ((theory)) of why it might be
happening. Then, make additional observations to test this theory—or,
if you don't yet have a theory, make additional observations to help
you come up with one.

{{index "console.log", output, debugging, logging}}

Putting a few strategic `console.log` calls into the program is a good
way to get additional information about what the program is doing. In
this case, we want `n` to take the values `13`, `1`, and then `0`.
Let's write out its value at the start of the loop.

```{lang: null}
13
1.3
0.13
0.013
…
1.5e-323
```

{{index rounding}}

_Right_. Dividing 13 by 10 does not produce a whole number. Instead of
`n /= base`, what we actually want is `n = Math.floor(n / base)` so
that the number is properly "shifted" to the right.

{{index "JavaScript console", "debugger statement"}}

An alternative to using `console.log` to peek into the program's
behavior is to use the _debugger_ capabilities of your browser.
Browsers come with the ability to set a _((breakpoint))_ on a specific
line of your code. When the execution of the program reaches a line
with a breakpoint, it is paused, and you can inspect the values of
bindings at that point. I won't go into details, as debuggers differ
from browser to browser, but look in your browser's ((developer
tools)) or search the Web for more information.

Another way to set a breakpoint is to include a `debugger` statement
(consisting of simply that keyword) in your program. If the
((developer tools)) of your browser are active, the program will pause
whenever it reaches such a statement.

## Error propagation

{{index input, output, "run-time error", error, validation}}

Not all problems can be prevented by the programmer, unfortunately. If
your program communicates with the outside world in any way, it is
possible to get malformed input, to become overloaded with work, or to
have the network fail.

{{index "error recovery"}}

If you're programming only for yourself, you can afford to just ignore
such problems until they occur. But if you build something that is
going to be used by anybody else, you usually want the program to do
better than just crash. Sometimes the right thing to do is take the
bad input in stride and continue running. In other cases, it is better
to report to the user what went wrong and then give up. But in either
situation, the program has to actively do something in response to the
problem.

{{index "promptInteger function", validation}}

Say you have a function `promptInteger` that asks the user for a whole
number and returns it. What should it return if the user inputs
"orange"?

{{index null, undefined, "return value", "special return value"}}

One option is to make it return a special value. Common choices for
such values are `null`, `undefined`, or -1.

```{test: no}
function promptNumber(question) {
  let result = Number(prompt(question));
  if (Number.isNaN(result)) return null;
  else return result;
}

console.log(promptNumber("How many trees do you see?"));
```

Now any code that calls `promptNumber` must check whether an actual
number was read and, failing that, must somehow recover—maybe by
asking again or by filling in a default value. Or it could again
return a special value to _its_ caller to indicate that it failed to
do what it was asked.

{{index "error handling"}}

In many situations, mostly when ((error))s are common and the caller
should be explicitly taking them into account, returning a special
value is a good way to indicate an error. It does, however, have its
downsides. First, what if the function can already return every
possible kind of value? In such a function, you'll have to do
something like wrap the result in an object to be able to distinguish
success from failure.

```
function lastElement(array) {
  if (array.length == 0) {
    return {failed: true};
  } else {
    return {element: array[array.length - 1]};
  }
}
```

{{index "special return value", readability}}

The second issue with returning special values is that it can lead to
awkward code. If a piece of code calls `promptNumber` 10 times,
it has to check 10 times whether `null` was returned. And if its
response to finding `null` is to simply return `null` itself, callers
of the function will in turn have to check for it, and so on.

## Exceptions

{{index "error handling"}}

When a function cannot proceed normally, what we would _like_ to do is
just stop what we are doing and immediately jump to a place that knows
how to handle the problem. This is what _((exception handling))_ does.

{{index ["control flow", exceptions], "raising (exception)", "throw keyword", "call stack"}}

Exceptions are a mechanism that makes it possible for code that runs
into a problem to _raise_ (or _throw_) an exception. An exception can
be any value. Raising one somewhat resembles a super-charged return
from a function: it jumps out of not just the current function but
also its callers, all the way down to the first call that
started the current execution. This is called _((unwinding the
stack))_. You may remember the stack of function calls that was
mentioned in [Chapter ?](functions#stack). An exception zooms down
this stack, throwing away all the call contexts it encounters.

{{index "error handling", [syntax, statement], "catch keyword"}}

If exceptions always zoomed right down to the bottom of the stack,
they would not be of much use. They'd just provide a novel way to blow
up your program. Their power lies in the fact that you can set
"obstacles" along the stack to _catch_ the exception as it is zooming
down. Once you've caught an exception, you can do something with it to
address the problem and then continue to run the program.

Here's an example:

{{id look}}
```
function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new Error("Invalid direction: " + result);
}

function look() {
  if (promptDirection("Which way?") == "L") {
    return "a house";
  } else {
    return "two angry bears";
  }
}

try {
  console.log("You see", look());
} catch (error) {
  console.log("Something went wrong: " + error);
}
```

{{index "exception handling", block, "throw keyword", "try keyword", "catch keyword"}}

The `throw` keyword is used to raise an exception. Catching one is
done by wrapping a piece of code in a `try` block, followed by the
keyword `catch`. When the code in the `try` block causes an exception
to be raised, the `catch` block is evaluated, with the name in
parentheses bound to the exception value. After the `catch` block
finishes—or if the `try` block finishes without problems—the program
proceeds beneath the entire `try/catch` statement.

{{index debugging, "call stack", "Error type"}}

In this case, we used the `Error` ((constructor)) to create our
exception value. This is a ((standard)) JavaScript constructor that
creates an object with a `message` property. In most JavaScript
environments, instances of this constructor also gather information
about the call stack that existed when the exception was created, a
so-called _((stack trace))_. This information is stored in the `stack`
property and can be helpful when trying to debug a problem: it tells
us the function where the problem occurred and which functions made
the failing call.

{{index "exception handling"}}

Note that the `look` function completely ignores the possibility that
`promptDirection` might go wrong. This is the big advantage of
exceptions: error-handling code is necessary only at the point where
the error occurs and at the point where it is handled. The functions
in between can forget all about it.

Well, almost...

## Cleaning up after exceptions

{{index "exception handling", "cleaning up", ["control flow", exceptions]}}

The effect of an exception is another kind of control flow. Every
action that might cause an exception, which is pretty much every
function call and property access, might cause control to suddenly
leave your code.

This means when code has several side effects, even if its
"regular" control flow looks like they'll always all happen, an
exception might prevent some of them from taking place.

{{index "banking example"}}

Here is some really bad banking code.

```{includeCode: true}
const accounts = {
  a: 100,
  b: 0,
  c: 20
};

function getAccount() {
  let accountName = prompt("Enter an account name");
  if (!accounts.hasOwnProperty(accountName)) {
    throw new Error(`No such account: ${accountName}`);
  }
  return accountName;
}

function transfer(from, amount) {
  if (accounts[from] < amount) return;
  accounts[from] -= amount;
  accounts[getAccount()] += amount;
}
```

The `transfer` function transfers a sum of money from a given account
to another, asking for the name of the other account in the process.
If given an invalid account name, `getAccount` throws an exception.

But `transfer` _first_ removes the money from the account and _then_
calls `getAccount` before it adds it to another account. If it is
broken off by an exception at that point, it'll just make the money
disappear.

That code could have been written a little more intelligently, for
example by calling `getAccount` before it starts moving money around.
But often problems like this occur in more subtle ways. Even functions
that don't look like they will throw an exception might do so in
exceptional circumstances or when they contain a programmer mistake.

One way to address this is to use fewer side effects. Again, a
programming style that computes new values instead of changing
existing data helps. If a piece of code stops running in the middle of
creating a new value, no one ever sees the half-finished value, and
there is no problem.

{{index block, "try keyword", "finally keyword"}}

But that isn't always practical. So there is another feature that
`try` statements have. They may be followed by a `finally` block
either instead of or in addition to a `catch` block. A `finally` block
says "no matter _what_ happens, run this code after trying to run the
code in the `try` block."

```{includeCode: true}
function transfer(from, amount) {
  if (accounts[from] < amount) return;
  let progress = 0;
  try {
    accounts[from] -= amount;
    progress = 1;
    accounts[getAccount()] += amount;
    progress = 2;
  } finally {
    if (progress == 1) {
      accounts[from] += amount;
    }
  }
}
```

This version of the function tracks its progress, and if, when
leaving, it notices that it was aborted at a point where it had
created an inconsistent program state, it repairs the damage it did.

Note that even though the `finally` code is run when an exception
is thrown in the `try` block, it does not interfere with the exception.
After the `finally` block runs, the stack continues unwinding.

{{index "exception safety"}}

Writing programs that operate reliably even when exceptions pop up in
unexpected places is hard. Many people simply don't bother, and
because exceptions are typically reserved for exceptional
circumstances, the problem may occur so rarely that it is never even
noticed. Whether that is a good thing or a really bad thing depends on
how much damage the software will do when it fails.

## Selective catching

{{index "uncaught exception", "exception handling", "JavaScript console", "developer tools", "call stack", error}}

When an exception makes it all the way to the bottom of the stack
without being caught, it gets handled by the environment. What this
means differs between environments. In browsers, a description of the
error typically gets written to the JavaScript console (reachable
through the browser's Tools or Developer menu). Node.js, the
browserless JavaScript environment we will discuss in [Chapter
?](node), is more careful about data corruption. It aborts the whole
process when an unhandled exception occurs.

{{index crash, "error handling"}}

For programmer mistakes, just letting the error go through is often
the best you can do. An unhandled exception is a reasonable way to
signal a broken program, and the JavaScript console will, on modern
browsers, provide you with some information about which function calls
were on the stack when the problem occurred.

{{index "user interface"}}

For problems that are _expected_ to happen during routine use,
crashing with an unhandled exception is a terrible strategy.

{{index [function, application], "exception handling", "Error type", [binding, undefined]}}

Invalid uses of the language, such as referencing a nonexistent
binding, looking up a property on `null`, or calling something
that's not a function, will also result in exceptions being raised.
Such exceptions can also be caught.

{{index "catch keyword"}}

When a `catch` body is entered, all we know is that _something_ in our
`try` body caused an exception. But we don't know _what_ did or _which_
exception it caused.

{{index "exception handling"}}

JavaScript (in a rather glaring omission) doesn't provide direct
support for selectively catching exceptions: either you catch them all
or you don't catch any. This makes it tempting to _assume_ that the
exception you get is the one you were thinking about when you wrote
the `catch` block.

{{index "promptDirection function"}}

But it might not be. Some other ((assumption)) might be violated, or
you might have introduced a bug that is causing an exception. Here is
an example that _attempts_ to keep on calling `promptDirection`
until it gets a valid answer:

```{test: no}
for (;;) {
  try {
    let dir = promtDirection("Where?"); // ← typo!
    console.log("You chose ", dir);
    break;
  } catch (e) {
    console.log("Not a valid direction. Try again.");
  }
}
```

{{index "infinite loop", "for loop", "catch keyword", debugging}}

The `for (;;)` construct is a way to intentionally create a loop that
doesn't terminate on its own. We break out of the loop only when a
valid direction is given. _But_ we misspelled `promptDirection`, which
will result in an "undefined variable" error. Because the `catch`
block completely ignores its exception value (`e`), assuming it knows
what the problem is, it wrongly treats the binding error as indicating
bad input. Not only does this cause an infinite loop, it 
"buries" the useful error message about the misspelled binding.

As a general rule, don't blanket-catch exceptions unless it is for the
purpose of "routing" them somewhere—for example, over the network to
tell another system that our program crashed. And even then, think
carefully about how you might be hiding information.

{{index "exception handling"}}

So we want to catch a _specific_ kind of exception. We can do this by
checking in the `catch` block whether the exception we got is the one
we are interested in and rethrowing it otherwise. But how do we
recognize an exception?

We could compare its `message` property against the ((error)) message
we happen to expect. But that's a shaky way to write code—we'd be
using information that's intended for human consumption (the message)
to make a programmatic decision. As soon as someone changes (or
translates) the message, the code will stop working.

{{index "Error type", "instanceof operator", "promptDirection function"}}

Rather, let's define a new type of error and use `instanceof` to
identify it.

```{includeCode: true}
class InputError extends Error {}

function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new InputError("Invalid direction: " + result);
}
```

{{index "throw keyword", inheritance}}

The new error class extends `Error`. It doesn't define its own
constructor, which means that it inherits the `Error` constructor,
which expects a string message as argument. In fact, it doesn't define
anything at all—the class is empty. `InputError` objects behave like
`Error` objects, except that they have a different class by which we
can recognize them.

{{index "exception handling"}}

Now the loop can catch these more carefully.

```{test: no}
for (;;) {
  try {
    let dir = promptDirection("Where?");
    console.log("You chose ", dir);
    break;
  } catch (e) {
    if (e instanceof InputError) {
      console.log("Not a valid direction. Try again.");
    } else {
      throw e;
    }
  }
}
```

{{index debugging}}

This will catch only instances of `InputError` and let unrelated
exceptions through. If you reintroduce the typo, the undefined binding
error will be properly reported.

## Assertions

{{index "assert function", assertion, debugging}}

_Assertions_ are checks inside a program that verify that something is
the way it is supposed to be. They are used not to handle situations
that can come up in normal operation but to find programmer mistakes.

If, for example, `firstElement` is described as a function that should
never be called on empty arrays, we might write it like this:

```
function firstElement(array) {
  if (array.length == 0) {
    throw new Error("firstElement called with []");
  }
  return array[0];
}
```

{{index validation, "run-time error", crash, assumption}}

Now, instead of silently returning undefined (which you get when
reading an array property that does not exist), this will loudly blow
up your program as soon as you misuse it. This makes it less likely
for such mistakes to go unnoticed and easier to find their cause when
they occur.

I do not recommend trying to write assertions for every possible kind
of bad input. That'd be a lot of work and would lead to very noisy
code. You'll want to reserve them for mistakes that are easy to make
(or that you find yourself making).

## Summary

Mistakes and bad input are facts of life. An important part of
programming is finding, diagnosing, and fixing bugs. Problems can
become easier to notice if you have an automated test suite or add
assertions to your programs.

Problems caused by factors outside the program's control should
usually be handled gracefully. Sometimes, when the problem can be
handled locally, special return values are a good way to track them.
Otherwise, exceptions may be preferable.

Throwing an exception causes the call stack to be unwound until the
next enclosing `try/catch` block or until the bottom of the stack. The
exception value will be given to the `catch` block that catches it,
which should verify that it is actually the expected kind of exception
and then do something with it. To help address the unpredictable
control flow caused by exceptions, `finally` blocks can be used to
ensure that a piece of code _always_ runs when a block finishes.

## Exercises

### Retry

{{index "primitiveMultiply (exercise)", "exception handling", "throw keyword"}}

Say you have a function `primitiveMultiply` that in 20 percent of
cases multiplies two numbers and in the other 80 percent of cases raises an
exception of type `MultiplicatorUnitFailure`. Write a function that
wraps this clunky function and just keeps trying until a call
succeeds, after which it returns the result.

{{index "catch keyword"}}

Make sure you handle only the exceptions you are trying to handle.

{{if interactive

```{test: no}
class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  // Your code here.
}

console.log(reliableMultiply(8, 8));
// → 64
```
if}}

{{hint

{{index "primitiveMultiply (exercise)", "try keyword", "catch keyword", "throw keyword"}}

The call to `primitiveMultiply` should definitely happen in a `try`
block. The corresponding `catch` block should rethrow the exception
when it is not an instance of `MultiplicatorUnitFailure` and ensure
the call is retried when it is.

To do the retrying, you can either use a loop that stops only when a
call succeeds—as in the [`look` example](error#look) earlier in this
chapter—or use ((recursion)) and hope you don't get a string of
failures so long that it overflows the stack (which is a pretty safe
bet).

hint}}

### The locked box

{{index "locked box (exercise)"}}

Consider the following (rather contrived) object:

```
const box = {
  locked: true,
  unlock() { this.locked = false; },
  lock() { this.locked = true;  },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};
```

{{index "private property", "access control"}}

It is a ((box)) with a lock. There is an array in the box, but you can
get at it only when the box is unlocked. Directly accessing the
private `_content` property is forbidden.

{{index "finally keyword", "exception handling"}}

Write a function called `withBoxUnlocked` that takes a function value
as argument, unlocks the box, runs the function, and then ensures that
the box is locked again before returning, regardless of whether the
argument function returned normally or threw an exception.

{{if interactive

```
const box = {
  locked: true,
  unlock() { this.locked = false; },
  lock() { this.locked = true;  },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};

function withBoxUnlocked(body) {
  // Your code here.
}

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised:", e);
}
console.log(box.locked);
// → true
```

if}}

For extra points, make sure that if you call `withBoxUnlocked` when
the box is already unlocked, the box stays unlocked.

{{hint

{{index "locked box (exercise)", "finally keyword", "try keyword"}}

This exercise calls for a `finally` block. Your function should first
unlock the box and then call the argument function from inside a `try`
body. The `finally` block after it should lock the box again.

To make sure we don't lock the box when it wasn't already locked,
check its lock at the start of the function and unlock and lock
it only when it started out locked.

hint}}
