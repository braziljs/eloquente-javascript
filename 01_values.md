# Valores, Tipos, e Operadores

> Sob a superfície da máquina, o programa se move. Sem esforço, se expande e se contrai. Em grande harmonia, elétrons se espalham e se reagrupam. As formas no monitor são nada mais que ondulações na água. A essência permanece invisível abaixo.
>
> — Master Yuan-Ma, The Book of Programming

![Mar de bits](img/chapter_picture_1.jpg)

Dentro do mundo do computador, só existem dados. Você pode ler dados, modificar dados, criar novos dados — mas aquilo que não é dado não pode ser mencionado. Todos esses dados são armazenados como longas sequências de bits e são assim fundamentalmente iguais.

_Bits_ são quaisquer tipos de coisas com dois valores possíveis, geralmente descritos como zeros e uns. Dentro do computador, eles tomam formas como uma carga elétrica alta ou baixa, um sinal forte ou fraco, ou um ponto na superfície de um CD que tem brilho ou não. Qualquer pedaço de informação pode ser reduzido a uma sequência de zeros e unse, portanto, representado em bits.

Por exemplo, podemos expressar o número 13 em bits. Funciona do mesmo jeito como uma representação decimal mas ao invés de 10 dígitos diferentes, você tem apenas dois e o peso de cada um aumenta por um fator de 2, da direita para a esquerda. Estes são os bits que formam o número 13, com o peso de cada um logo abaixo:

```{lang: null}
   0   0   0   0   1   1   0   1
 128  64  32  16   8   4   2   1
```

Então, este é o número binário 00001101, ou 8 + 4 + 1, ou 13.

## Valores

Imagine um mar de bits — um oceano deles. Um típico computador moderno tem mais de 30 bilhões de bits em sua memória volátil. A memória não-volátil (o disco rígido ou equivalente) tende a ter algumas ordens de magnitude a mais.

Para podermos trabalhar com quantidades tão altas de bits sem nos perdermos, precisamos separá-los em blocos que representam pedaços de informação. Em um ambiente JavaScript, esses blocossão chamados de _valores_. Embora todos os valores sejam feitos de bits, eles têm diferentes papeis. Cada valor tem um _tipo_ que determina seu papel. Alguns valores são números, alguns são pedaços de texto, alguns são funções, e por aí vai.

### Garbage collection

Para criar um valor, você deve simplesmente invocar o seu nome. Isso é bastante conveniente. Você não precisa reunir nenhum material extra ou pagar por eles. Você apenas chama por ele e _woosh_, você o tem. Eles realmente não são criados do nada, claro. Cada valor tem que ser armazenado em algum lugar e se você quiser usar uma quantidade enorme deles ao mesmo tempo, você pode ficar sem memória. Felizmente, esse é um problema apenas se você precisar de todos simultaneamente. Assim que você não usar mais um valor, ele irá sumir, deixando para trás seus bits para serem reciclados como material de construção para a próxima geração de valores.

Esse capítulo introduz os átomos dos programas JavaScript, isto é, os tipos simples de valores e os operadores que podem agir em tais valores.

## Números

Valores do tipo _número_ são, sem surpresa, valores numéricos. Em um programa JavaScript, eles são escritos dessa forma:

```
13
```

Use isso em um programa e isso fará com que o padrão em bits para o número 13 passe a existir dentro da memória do computador.

O JavaScript usa um número limitado de bits, mais especificamente 64 deles, para guardar um único valor numérico. Existem apenas alguns poucos padrões que você pode fazer com 64 bits, o que significa que a quantidade de números diferentes que podem ser representados é limitada. Para um dígito decimal _N_, a quantidade de números que podem ser representados é de 10<sup>n</sup>. Da mesma forma, dados 64 dígitos binários, você pode representar 2<sup>64</sup> números diferentes, o que é mais ou menos 18 quintilhões (um 18 com 18 zeros depois dele). É muita coisa. 

A memória do computador costumava ser muito menor, e as pessoas tendiam a usar grupos de 8 ou 16 bits para representar os números. Era muito fácil de ultrapassar acidentalmente esses números -  para conseguir um número que não se encaixava na quantidade de bits dada. Hoje, mesmo computadores que cabem no seu bolso tem muita memória disponível, então você é livre para usar blocos de 64-bits, e você só vai precisar se preocupar com espaço quando lidar com números realmente astronômicos.

Entretanto, nem todos os números inteiros menores do que 18 quintilhões cabem em um número no JavaScript. Os bits também armazenam números negativos, e um desses bits indica o sinal do número. Um grande problema é que números não inteiros também precisam ser representados. 
Para isso, alguns dos bits são usados para armazenar a posição do ponto decimal. Então, o maior número inteiro que pode ser armazenado está por volta de 9 quatrilhões (15 zeros) - que ainda é extremamente grande.

Números fracionários são escritos usando um ponto:

```
9.81
```

Para números muito grandes ou pequenos, você também pode usar notação científica adicionando um "e" (de "expoente") seguido pelo valor do expoente:

```
2.998e8
```

Isso é 2.998 x 10<sup>⁸</sup> = 299800000.

Cálculos com números inteiros menores que os 9 quadrilhões mencionados anteriormente, serão sempre precisos. Infelizmente, cálculos com número fracionários normalmente não são. Assim como π (pi) não pode ser expresso de forma precisa por uma quantidade finita de dígitos decimais, muitos números perdem sua precisão quando existem apenas 64 bits disponíveis para armazená-los. Isso é vergonhoso, mas causa problemas reais apenas em situações específicas. O importante é estar ciente disso e tratar números fracionários como aproximações e não como valores precisos.

### Aritmética

The main thing to do with numbers is arithmetic. Arithmetic operations
such as addition or multiplication take two number values and produce
a new number from them. Here is what they look like in JavaScript:

A principal coisa a se fazer com números são cálculos aritméticos. Operações aritméticas como adição ou multiplicação recebem dois valores numéricos e produzem um novo número a partir deles. É assim que eles se parecem no JavaScript:

```
100 + 4 * 11
```

Os símbolos `+` e `*` são chamados de _operadores_. O primeiro se refere à adição, e o segundo à multiplicação. Colocar um operador entre dois valores irá aplicá-lo a esses valores e produzirá um novo valor.

Mas esse exemplo significa "adicione 4 e 100, e multiplique o resultado por 11," ou a multiplicação é feita antes da adição? Como você deve ter adivinhado, a multiplicaçào acontece antes. Mas como na matemática, você pode mudar isso envolvendo a adiçào em parênteses:

```
(100 + 4) * 11
```

Para subtração, há o operador `-`, e a divisão pode ser feita com o operador `/`.

When operators appear together without parentheses, the order in which
they are applied is determined by the _((precedence))_ of the
operators. The example shows that multiplication comes before
addition. The `/` operator has the same precedence as `*`. Likewise
for `+` and `-`. When multiple operators with the same precedence
appear next to each other, as in `1 - 2 + 1`, they are applied left to
right: `(1 - 2) + 1`.

These rules of precedence are not something you should worry about.
When in doubt, just add parentheses.

{{index "modulo operator", division, "remainder operator", "% operator"}}

There is one more arithmetic operator, which you might not immediately
recognize. The `%` symbol is used to represent the _remainder_
operation. `X % Y` is the remainder of dividing `X` by `Y`. For
example, `314 % 100` produces `14`, and `144 % 12` gives `0`.
Remainder's precedence is the same as that of multiplication and
division. You'll also often see this operator referred to as _modulo_.

### Special numbers

{{index [number, "special values"]}}

There are three special values in JavaScript that are considered
numbers but don't behave like normal numbers.

{{index infinity}}

The first two are `Infinity` and `-Infinity`, which represent the
positive and negative infinities. `Infinity - 1` is still `Infinity`,
and so on. Don't put too much trust in infinity-based computation,
though. It isn't mathematically sound, and it will quickly lead to our
next special number: `NaN`.

{{index NaN, "not a number", "division by zero"}}

`NaN` stands for "not a number", even though it _is_ a value of the
number type. You'll get this result when you, for example, try to
calculate `0 / 0` (zero divided by zero), `Infinity - Infinity`, or
any number of other numeric operations that don't yield a meaningful
result.

## Strings

{{indexsee "grave accent", backtick}}

{{index syntax, text, character, [string, notation], "single-quote character", "double-quote character", "quotation mark", backtick}}

The next basic data type is the _((string))_. Strings are used to
represent text. They are written by enclosing their content in quotes:

```
`Down on the sea`
"Lie on the ocean"
'Float on the ocean'
```

You can use single quotes, double quotes, or backticks to mark
strings, as long as the quotes at the start and the end of the string
match.

{{index "line break", "newline character"}}

Almost anything can be put between quotes, and JavaScript will make a
string value out of it. But a few characters are more difficult. You
can imagine how putting quotes between quotes might be hard.
_Newlines_ (the characters you get when you press Enter) may only be
included without escaping when the string is quoted with backticks
(`` ` ``).

{{index [escaping, "in strings"], "backslash character"}}

To make it possible to include such characters in a string, the
following notation is used: whenever a backslash (`\`) is found inside
quoted text, it indicates that the character after it has a special
meaning. This is called _escaping_ the character. A quote that is
preceded by a backslash will not end the string but be part of it.
When an `n` character occurs after a backslash, it is interpreted as a
newline. Similarly, a `t` after a backslash means a ((tab character)).
Take the following string:

```
"This is the first line\nAnd this is the second"
```

The actual text contained is this:

```{lang: null}
This is the first line
And this is the second
```

There are, of course, situations where you want a backslash in a
string to be just a backslash, not a special code. If two backslashes
follow each other, they will collapse together, and only one will be
left in the resulting string value. This is how the string "_A newline
character is written like `"`\n`"`._" can be expressed:

```
"A newline character is written like \"\\n\"."
```

{{id unicode}}

{{index [string, representation], Unicode, character}}

Strings, too, have to be modeled as a series of bits to be able to
exist inside the computer. The way JavaScript does this is based on
the _((Unicode))_ standard. This standard assigns a number to
virtually every character you would ever need, including characters
from Greek, Arabic, Japanese, Armenian, and so on. If we have a number
for every character, a string can be described by a sequence of
numbers.

{{index "UTF-16", emoji}}

And that's what JavaScript does. But there's a complication:
JavaScript's representation uses 16 bits per string element, which can
describe up to 2^16^ different characters. But Unicode defines more
characters than that—about twice as many, at this point. So some
characters, such as many emoji, take up two "character positions" in
JavaScript strings. We'll come back to this in [Chapter
?](higher_order#code_units).

{{index "+ operator", concatenation}}

Strings cannot be divided, multiplied, or subtracted, but the `+`
operator _can_ be used on them. It does not add, but it
_concatenates_—it glues two strings together. The following line will
produce the string `"concatenate"`:

```
"con" + "cat" + "e" + "nate"
```

String values have a number of associated functions (_methods_) that
can be used to perform other operations on them. We'll come back to
these in [Chapter ?](data#methods).

{{index interpolation, backtick}}

Strings written with single or double quotes behave very much the
same—the only difference is in which type of quote you need to escape
inside of them. Backtick-quoted strings, usually called _((template
literals))_, can do a few more tricks. Apart from being able to span
lines, they can also embed other values.

```
`half of 100 is ${100 / 2}`
```

When you write something inside `${}` in a template literal, its
result will be computed, converted to a string, and included at that
position. The example produces "_half of 100 is 50_".

## Unary operators

{{index operator, "typeof operator", type}}

Not all operators are symbols. Some are written as words. One example
is the `typeof` operator, which produces a string value naming the
type of the value you give it.

```
console.log(typeof 4.5)
// → number
console.log(typeof "x")
// → string
```

{{index "console.log", output, "JavaScript console"}}

{{id "console.log"}}

We will use `console.log` in example code to indicate that we want to
see the result of evaluating something. More about that in the [next
chapter](program_structure).

{{index negation, "- operator", "binary operator", "unary operator"}}

The other operators we saw all operated on two values, but `typeof`
takes only one. Operators that use two values are called _binary_
operators, while those that take one are called _unary_ operators. The
minus operator can be used both as a binary operator and as a unary
operator.

```
console.log(- (10 - 2))
// → -8
```

## Boolean values

{{index Boolean, operator, true, false, bit}}

It is often useful to have a value that distinguishes between only two
possibilities, like "yes" and "no" or "on" and "off". For this
purpose, JavaScript has a _Boolean_ type, which has just two values:
true and false, which are written as those words.

### Comparison

{{index comparison}}

Here is one way to produce Boolean values:

```
console.log(3 > 2)
// → true
console.log(3 < 2)
// → false
```

{{index [comparison, "of numbers"], "> operator", "< operator", "greater than", "less than"}}

The `>` and `<` signs are the traditional symbols for "is greater
than" and "is less than", respectively. They are binary operators.
Applying them results in a Boolean value that indicates whether they
hold true in this case.

Strings can be compared in the same way.

```
console.log("Aardvark" < "Zoroaster")
// → true
```

{{index [comparison, "of strings"]}}

The way strings are ordered is roughly alphabetic, but not really what
you'd expect to see in a dictionary: uppercase letters are always
"less" than lowercase ones, so `"Z" < "a"`, and nonalphabetic
characters (!, -, and so on) are also included in the ordering. When
comparing strings, JavaScript goes over the characters from left to
right, comparing the ((Unicode)) codes one by one.

{{index equality, ">= operator", "<= operator", "== operator", "!= operator"}}

Other similar operators are `>=` (greater than or equal to), `<=`
(less than or equal to), `==` (equal to), and `!=` (not equal to).

```
console.log("Itchy" != "Scratchy")
// → true
console.log("Apple" == "Orange")
// → false
```

{{index [comparison, "of NaN"], NaN}}

There is only one value in JavaScript that is not equal to itself, and
that is `NaN` ("not a number").

```
console.log(NaN == NaN)
// → false
```

`NaN` is supposed to denote the result of a nonsensical computation,
and as such, it isn't equal to the result of any _other_ nonsensical
computations.

### Logical operators

{{index reasoning, "logical operators"}}

There are also some operations that can be applied to Boolean values
themselves. JavaScript supports three logical operators: _and_, _or_,
and _not_. These can be used to "reason" about Booleans.

{{index "&& operator", "logical and"}}

The `&&` operator represents logical _and_. It is a binary operator,
and its result is true only if both the values given to it are true.

```
console.log(true && false)
// → false
console.log(true && true)
// → true
```

{{index "|| operator", "logical or"}}

The `||` operator denotes logical _or_. It produces true if either of
the values given to it is true.

```
console.log(false || true)
// → true
console.log(false || false)
// → false
```

{{index negation, "! operator"}}

_Not_ is written as an exclamation mark (`!`). It is a unary operator
that flips the value given to it—`!true` produces `false` and `!false`
gives `true`.

{{index precedence}}

When mixing these Boolean operators with arithmetic and other
operators, it is not always obvious when parentheses are needed. In
practice, you can usually get by with knowing that of the operators we
have seen so far, `||` has the lowest precedence, then comes `&&`,
then the comparison operators (`>`, `==`, and so on), and then the
rest. This order has been chosen such that, in typical expressions
like the following one, as few parentheses as possible are necessary:

```
1 + 1 == 2 && 10 * 10 > 50
```

{{index "conditional execution", "ternary operator", "?: operator", "conditional operator", "colon character", "question mark"}}

The last logical operator I will discuss is not unary, not binary, but
_ternary_, operating on three values. It is written with a question
mark and a colon, like this:

```
console.log(true ? 1 : 2);
// → 1
console.log(false ? 1 : 2);
// → 2
```

This one is called the _conditional_ operator (or sometimes just
_ternary_ operator since it is the only such operator in the
language). The value on the left of the question mark "picks" which of
the other two values will come out. When it is true, it chooses the
middle value, and when it is false, the value on the right.

## Empty values

{{index undefined, null}}

There are two special values, written `null` and `undefined`, that are
used to denote the absence of a _meaningful_ value. They are
themselves values, but they carry no information.

Many operations in the language that don't produce a meaningful value
(you'll see some later) yield `undefined` simply because they have to
yield _some_ value.

The difference in meaning between `undefined` and `null` is an accident
of JavaScript's design, and it doesn't matter most of the time. In the cases
where you actually have to concern yourself with these values, I
recommend treating them as mostly interchangeable.

## Automatic type conversion

{{index NaN, "type coercion"}}

In the Introduction, I mentioned that JavaScript goes out of its way
to accept almost any program you give it, even programs that do odd
things. This is nicely demonstrated by the following expressions:

```
console.log(8 * null)
// → 0
console.log("5" - 1)
// → 4
console.log("5" + 1)
// → 51
console.log("five" * 2)
// → NaN
console.log(false == 0)
// → true
```

{{index "+ operator", arithmetic, "* operator", "- operator"}}

When an operator is applied to the "wrong" type of value, JavaScript
will quietly convert that value to the type it needs, using a set of
rules that often aren't what you want or expect. This is called
_((type coercion))_. The `null` in the first expression becomes `0`,
and the `"5"` in the second expression becomes `5` (from string to
number). Yet in the third expression, `+` tries string concatenation
before numeric addition, so the `1` is converted to `"1"` (from number
to string).

{{index "type coercion", [number, "conversion to"]}}

When something that doesn't map to a number in an obvious way (such as
`"five"` or `undefined`) is converted to a number, you get the value
`NaN`. Further arithmetic operations on `NaN` keep producing `NaN`, so
if you find yourself getting one of those in an unexpected place, look
for accidental type conversions.

{{index null, undefined, [comparison, "of undefined values"], "== operator"}}

When comparing values of the same type using `==`, the outcome is easy
to predict: you should get true when both values are the same, except
in the case of `NaN`. But when the types differ, JavaScript uses a
complicated and confusing set of rules to determine what to do. In
most cases, it just tries to convert one of the values to the other
value's type. However, when `null` or `undefined` occurs on either
side of the operator, it produces true only if both sides are one of
`null` or `undefined`.

```
console.log(null == undefined);
// → true
console.log(null == 0);
// → false
```

That behavior is often useful. When you want to test whether a value
has a real value instead of `null` or `undefined`, you can compare it
to `null` with the `==` (or `!=`) operator.

{{index "type coercion", [Boolean, "conversion to"], "=== operator", "!== operator", comparison}}

But what if you want to test whether something refers to the precise
value `false`? The rules for converting strings and numbers to Boolean
values state that `0`, `NaN`, and the empty string (`""`) count as
`false`, while all the other values count as `true`. Because of this,
expressions like `0 == false` and `"" == false` are also true. When
you do _not_ want any automatic type conversions to happen, there are
two additional operators: `===` and `!==`. The first tests whether a
value is _precisely_ equal to the other, and the second tests whether
it is not precisely equal. So `"" === false` is false as expected.

I recommend using the three-character comparison operators defensively to
prevent unexpected type conversions from tripping you up. But when you're
certain the types on both sides will be the same, there is no problem with
using the shorter operators.

### Short-circuiting of logical operators

{{index "type coercion", [Boolean, "conversion to"], operator}}

The logical operators `&&` and `||` handle values of different types
in a peculiar way. They will convert the value on their left side to
Boolean type in order to decide what to do, but depending on the
operator and the result of that conversion, they will return either the
_original_ left-hand value or the right-hand value.

{{index "|| operator"}}

The `||` operator, for example, will return the value to its left when
that can be converted to true and will return the value on its right
otherwise. This has the expected effect when the values are Boolean,
and does something analogous for values of other types.

```
console.log(null || "user")
// → user
console.log("Agnes" || "user")
// → Agnes
```

{{index "default value"}}

We can use this functionality as a way to fall back on a default
value. If you have a value that might be empty, you can put `||` after
it with a replacement value. If the initial value can be converted to
false, you'll get the replacement instead.

{{index "&& operator"}}

The `&&` operator works similarly, but the other way around. When the
value to its left is something that converts to false, it returns that
value, and otherwise it returns the value on its right.

Another important property of these two operators is that the part to
their right is evaluated only when necessary. In the case of `true ||
X`, no matter what `X` is—even if it's a piece of program that does
something _terrible_—the result will be true, and `X` is never
evaluated. The same goes for `false && X`, which is false and will
ignore `X`. This is called _((short-circuit evaluation))_.

{{index "ternary operator", "?: operator", "conditional operator"}}

The conditional operator works in a similar way. Of the second and
third value, only the one that is selected is evaluated.

## Summary

We looked at four types of JavaScript values in this chapter: numbers,
strings, Booleans, and undefined values.

Such values are created by typing in their name (`true`, `null`) or
value (`13`, `"abc"`). You can combine and transform values with
operators. We saw binary operators for arithmetic (`+`, `-`, `*`, `/`,
and `%`), string concatenation (`+`), comparison (`==`, `!=`, `===`,
`!==`, `<`, `>`, `<=`, `>=`), and logic (`&&`, `||`), as well as
several unary operators (`-` to negate a number, `!` to negate
logically, and `typeof` to find a value's type) and a ternary operator
(`?:`) to pick one of two values based on a third value.

This gives you enough information to use JavaScript as a pocket
calculator, but not much more. The [next
chapter](program_structure) will start tying
these expressions together into basic programs.
