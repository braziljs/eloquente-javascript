Chapter 4 - Link original: http://eloquentjavascript.net/2nd_edition/preview/04_data.html

# Estrutura de dados: Object e Array

> Em duas ocasiões, me perguntaram, "Ora, Mr. Babbage, se você colocar em uma calculadora números errados, poderá trazer resultados corretos?" [...] Eu não sou capaz de compreender o tipo de confusão de ideias que poderia provocar tal questão.

> -- <cite>Charles Babbage, Passages from the Life of a Philosopher (Passagens da vida de um filósofo) (1864)</cite>

Números, Booleanos e strings são os tijolos usados para construir as estruturas de dados. Mas você não pode construir uma casa com um único tijolo. Objetos nos permitem agrupar valores -- incluindo outros objetos --, e assim construir estruturas mais complexas.

Os programas que construímos até agora têm sido seriamente dificultados pelo fato de que eles só estavam operando com tipos de dados simples. Este capítulo irá adicionar uma compreensão básica de estruturas de dados para o seu kit de ferramentas. Ao final dele, você vai conhecer programação o suficiente para começar a escrever programas significativos.

O capítulo vai funcionar mais ou menos como um exemplo realista de programação, introduzindo conceitos que se aplicam ao problema em questão. O código de exemplo, muitas vezes, será construído sobre as funções e variáveis ​​que foram introduzidas no início do texto.

## O weresquirrel

De vez em quando, geralmente entre oito e dez da noite, Jaques transforma-se em um pequeno roedor peludo com uma cauda espessa.

Por um lado, Jaques está bastante contente que ele não tem licantropia clássica. Transformando-se em um esquilo tende a causar menos problemas do que se transformando em um lobo. Em vez de ter de se preocupar em comer acidentalmente o vizinho (que seria estranho), ele se preocupa com o que está sendo comido pelo gato do vizinho. Depois de duas ocasiões em que ele acordou em um galho fino precariamente na copa de um carvalho, nu e desorientado, ele tomou a trancar as portas e janelas de seu quarto à noite, e colocar algumas nozes no chão para manter-se ocupado.

![The weresquirrel](../img/weresquirrel.svg)

Isto cuida dos problemas do gato e do carvalho. Mas Jaques ainda sofre com sua condição. As ocorrências irregulares da transformação fazem-no suspeitar de que pode haver algum gatilho que faz com que elas aconteçam. Por um tempo, ele acreditava que isso só acontecia nos dias em que ele havia tocado em árvores. Então ele parou de fazer isso por completo, e evitando até mesmo passar perto delas. Mas o problema persistiu.

Mudando para uma abordagem mais científica, Jaques quer começar a manter um registo diário das coisas que ele fez naquele dia, e se ele acabou mudando de forma. Usando esses dados em sua própria vida, ele espera ser capaz de diminuir as condições que desencadeiam as transformações.

A primeira coisa que ele fará será criar uma estrutura de dados para armazenar essas informações.

## Conjuntos de dados

Para trabalhar com um trecho de dados digitais, primeiro teremos que encontrar uma maneira de representá-los na memória de nossa máquina. Dizer, como um exemplo muito simples, que queremos para representar uma coleção de números.

Poderíamos ser criativos com *strings* - strings podem ter qualquer comprimento, assim você pode usar muitos dados em uma - e usar o "2 3 5 7 11" como a nossa representação. Mas isso é estranho. Você teria que, de alguma forma, extrair os dígitos e convertê-los de volta para número para acessá-los.

Felizmente, JavaScript fornece um tipo de dados especificamente para armazenar sequências de valores. Ele é chamado de *array*, e está escrito como uma lista de valores entre colchetes, separados por vírgulas.

```javascript
var listOfNumbers = [2, 3, 5, 7, 11];
console.log(listOfNumbers[1]);
// → 3
console.log(listOfNumbers[1 - 1]);
// → 2
```

A notação para a obtenção de elementos dentro de uma matriz também usa colchetes. Um par de colchetes, imediatamente após uma expressão, com uma expressão dentro deles, vai procurar o elemento da expressão à esquerda que corresponde ao índice determinado pela expressão entre parênteses.

Estes índices começam em zero, não um. Assim, o primeiro elemento pode ser lido com `ListOfNumbers[0]`. Se você não tem um *background* de programação, isso pode levar algum tempo para se acostumar. Contagem baseada em zero tem uma longa tradição em tecnologia, e desde que essa convenção é constantemente seguida (o que ela é, em JavaScript), ela funciona muito bem.

## Propriedades

=====================


We’ve seen a few suspicious-looking expressions like myString.length (to get the length of a string) and Math.max (the maximum function) in past examples. These access properties of another value. In the first case, the length property of the value in myString. In the second, the property named max in the Math object (which is a collection of mathematics-related values and functions).

Almost all JavaScript values have properties. The exceptions are null and undefined. If you try to access a property on one of these non-values, you get an error.

null.length;
// → TypeError: Cannot read property 'length' of null
Arrays also have a length property, holding the amount of elements in the array. In fact, the elements in the array are also accessed through properties. Both value.index and value[index] access a property on value. The difference is in how index is interpreted. When using a dot, the part after the dot (which must be a valid variable name) directly names the property. When using square brackets, the index is treated as an expression that is evaluated to get the property name. Whereas value.index fetches the property named “index”, value[index] tries to get the value of the variable named index, and uses that as the property name.

So if you know that the property you are interested in is called “length”, you say value.length. If you want to extract the property named by the value held in the variable i, you say value[i]. And finally, if you want to access a property named “0” or “John Doe” (property names can be any string), these are not valid variable names, so you are forced to use square brackets, as in value[0] or value["John Doe"], even though you know the precise name of the property in advance.

Methods

Both string and array objects contain, in addition to the length property, a number of properties that refer to function values.

var doh = "Doh";
console.log(typeof doh.toUpperCase);
// → function
console.log(doh.toUpperCase());
// → DOH
Every string has a toUpperCase property. When called, it will return a copy of the string, in which all letters have been converted to uppercase. There is also toLowerCase. You can guess what that does.

Interestingly, even though the call to toUpperCase does not pass any arguments, the function does somehow have access to the string "Doh", the value of which it is a property. How this works precisely is described in Chapter 6.

Properties that contain functions are generally called methods of the value they belong to. As in “toUpperCase is a method of a string”.

This example demonstrates some methods that array objects have:

var mack = [];
mack.push("Mack");
mack.push("the", "Knife");
console.log(mack);
// → ["Mack", "the", "Knife"]
console.log(mack.join(" "));
// → Mack the Knife
console.log(mack.pop());
// → Knife
console.log(mack);
// → ["Mack", "the"]
The push method can be used to add values to the end of an array. The pop method does the opposite. It removes the value at the end of the array and returns it. An array of strings can be flattened to a single string with the join method. The argument given to join determines the text that is glued between the array’s elements.

Objects

Back to the weresquirrel. A set of daily log entries can be represented as an array. But the entries do not consist of just a number or a string—each entry needs to store a list of activities, and a boolean value that indicates whether Jaques turned into a squirrel. A practical representation needs to group these values together into a single value, and then put such grouped values into the array of entries.

Values of the type object are arbitrary collections of properties, that we can add properties to (and remove properties from) as we please. One way to create an object is by using a curly brace notation:

var day1 = {
  squirrel: false,
  events: ["work", "touched tree", "pizza", "running",
           "television"]
};
console.log(day1.squirrel);
// → false
console.log(day1.wolf);
// → undefined
day1.wolf = false;
console.log(day1.wolf);
// → false
Inside of the curly braces we can give a list of properties, written as a name followed by a colon and an expression that provides a value for the property. Spaces and line breaks are again not significant. When an object spans multiple lines, indenting it like we’ve been indenting blocks of code helps readability. Properties whose names are not valid variable names or valid numbers have to be quoted.

var descriptions = {
  work: "Went to work",
  "touched tree": "Touched a tree"
};
It is possible to assign a value to a property expression with the ‘=’ operator. This will replace the property’s value if it already existed, or create a new property on the object if it didn’t.

Reading a property that doesn’t exist will produce the value undefined.

To briefly come back to our tentacle model of variable bindings—property bindings are similar. They grasp values, but other variables and properties might be holding on to the same values. So now you may start thinking of objects as octopuses with any number of tentacles, each of which has a name inscribed on it.

Artist's representation of an object
To cut off such a leg—removing a property from an object—the delete operator can be used. This is a unary operator that, when applied to a property access expression, will remove the named property from the object. (Which is not a very common thing to do in practice, but it is allowed.)

var anObject = {left: 1, right: 2};
console.log(anObject.left);
// → 1
delete anObject.left;
console.log(anObject.left);
// → undefined
console.log("left" in anObject);
// → false
console.log("right" in anObject);
// → true
The binary in operator, when applied to a string and an object, returns a boolean value that indicates whether that object has that property. The difference between setting a property to undefined and actually deleting it is that, in the first case, the object still has the property (it just doesn’t have a very interesting value), whereas in the second case the property is no longer present and in will return false.

Arrays, then, are just a kind of objects specialized for storing sequences of things. If you evaluate typeof [1, 2], this produces "object". I guess you can see them as long, flat octopuses with all their arms in a neat row, labeled with numbers.

Artist's representation of an array
The desired representation of Jaques’ journal is thus an array of objects.

var journal = [
  {events: ["work", "touched tree", "pizza",
            "running", "television"],
   squirrel: false},
  {events: ["work", "ice cream", "cauliflower",
            "lasagna", "touched tree", "brushed teeth"],
   squirrel: false},
  {events: ["weekend", "cycling", "break",
            "peanuts", "beer"],
   squirrel: true},
  /* and so on... */
];
Mutability

We will get to actual programming real soon now, I promise. But first, a little more theory.

We’ve seen that object values can be modified. The types of values discussed in earlier chapters are all immutable—it is impossible to change an existing value of those types. You can combine them and derive new values from them, but when you take a specific string value, that value will always remain the same. The text inside it cannot be changed. With objects, on the other hand, the content of a value can be modified by changing its properties.

When we have two numbers, 120 and 120, they can, whether they refer to the same physical bits or not, be considered the precise same number. With objects, there is a difference between having two references to the same object and having two different objects that contain the same properties. Consider the following code:

var object1 = {value: 10};
var object2 = object1;
var object3 = {value: 10};

console.log(object1 == object2);
// → true
console.log(object1 == object3);
// → false

object1.value = 15;
console.log(object2.value);
// → 15
console.log(object3.value);
// → 10
object1 and object2 are two variables grasping the same value. There is only one actual object, which is why changing object1 also changes the value of object2. The variable object3 points to another object, which initially contains the same properties as object1 but lives a separate life.

JavaScript’s == operator, when comparing objects, will return true only if both values given to it are the precise same value. Comparing different object with identical contents will give false. There is no “deep” comparison operation built into JavaScript, but it is possible to write it yourself.

The lycanthrope’s log

So Jaques starts up his JavaScript interpreter, and sets up the environment he needs to keep his journal.

var journal = [];

function addEntry(events, didITurnIntoASquirrel) {
  journal.push({
    events: events,
    squirrel: didITurnIntoASquirrel
  });
}
And then, every evening at ten—or sometimes the next morning, after climbing down from the top shelf of his bookcase—the day is recorded.

addEntry(["work", "touched tree", "pizza", "running",
          "television"], false);
addEntry(["work", "ice cream", "cauliflower", "lasagna",
          "touched tree", "brushed teeth"], false);
addEntry(["weekend", "cycling", "break", "peanuts",
          "beer"], true);
Once he has enough data points, he intends to compute the correlation between the squirrelification and each of the day events he recorded, and hopefully learn something useful from those correlations.

Correlation is a measure of dependence between variables (“variables” in the statistical sense, not the JavaScript sense). It is usually expressed in a coefficient that ranges from -1 to 1. Zero correlation means the variables are not related, whereas a correlation of one indicates that the two are perfectly related—if you know one, you also know the other. Minus one also means that the variables are perfectly related, but that they are opposite to each other—when one of them is true, the other is false.

For binary (boolean) variables, the phi coefficient provides a good measure of correlation, and is relatively easy to compute. First we need a matrix n, which indicates the number of times the various combinations of the two variables were observed. For example, we could take the event of eating pizza, and put that in a table like this:

Eating pizza versus turning into a squirrel
From such a table (n), the phi coefficient (ϕ) can be computed by the following formula.

ϕ = 	
n11n00 - n10n01
√ n1•n0•n•1n•0
Where n01 indicates the number of measurements where the first measurement (pizza) is false (0), and the second (squirrelness) is true (1), so 4 in this case. n1• refers to the sum of all measurements where the first variable is true, which is 10 in the above table.

So for the pizza table, the part above the division line (dividend) would be 1×76 - 9×4 = 40, and the part below it (divisor) would be the square root of 10×80×5×85 = √340000. The actual coefficient then becomes about 0.069, which is tiny, and thus likely to be random noise. Eating pizza does not appear to have influence on the transformations.

Computing correlation

We can represent a two-by-two table with a four-element array ([76, 9, 4, 1]). Other representations are possible, such as an array containing two two-element arrays ([[76, 9], [4, 1]]), or an object with property names like "11" and "01", but the flat array is straightforward enough, and makes the expressions that access the table pleasantly short. We’ll interpret the indices to the array as two-bit binary numbers, where the 1 component (the second digit) refers to event variable, and the 2 component (the first digit) refers to the squirrel variable. I.e. 2 is written in binary as 10, meaning it refers to the field where the event (say, pizza) is true, but Jaques did not turn into a squirrel.

This is the function that computes a phi coefficient from such an array:

function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}

console.log(phi([76, 9, 4, 1]));
// → 0.068599434
This is simply a less elegant notation for the phi formula. Math.sqrt is the square root function, as provided by the Math object in a standard JavaScript environment. We have to sum two fields from the table to get fields like n1•, because the sums of rows or columns are not stored directly in our data structure.

Jaques kept his journal for three months. The resulting data set is available in the coding sandbox for this chapter, where it is stored in the JOURNAL variable, as well as in a downloadable file.

To extract a two-by-two table for a specific event from this journal, we must loop over all the entries and tally the frequencies with which the event occurs in relation to squirrel transformations.

function hasEvent(event, entry) {
  return entry.events.indexOf(event) != -1;
}

function tableFor(event, journal) {
  var table = [0, 0, 0, 0];
  for (var i = 0; i < journal.length; i++) {
    var entry = journal[i], index = 0;
    if (hasEvent(event, entry)) index += 1;
    if (entry.squirrel) index += 2;
    table[index] += 1;
  }
  return table;
}

console.log(tableFor("pizza", JOURNAL));
// → [76, 9, 4, 1]
The hasEvent function makes it easier (and more readable) to test whether an entry contains a given event. Arrays have an indexOf method that tries to find the given value (in this case, the event name) in the array, and returns the index at which it was found—or -1 when it was not found. So testing whether result of the call indexOf is not -1 will only produce true when the event is found in this entry.

The body of the loop in tableFor figures out in which of the four boxes this entry falls by adding 1 and 2 to an index variable depending on whether this entry contains the event it is interested in and whether it corresponds to a squirrel incident. It then adds one to the number in the table that corresponds to this box.

We now have the tools we need to compute individual correlations. The only step remaining is to find a correlation for all the types of events that were recorded, and see if anything stands out. But first, another short theoretical interruption.

Objects as maps

How do we store a set of correlations, each labeled with a string? We could store them all in an array, using objects with name and value properties. But that makes looking up the number for a given event name somewhat cumbersome—you’d have to loop over the whole array to find the object with the right name. Such a thing could be wrapped in a function, but we would still be writing more code, and the computer would be doing more work, than necessary.

The solution, obviously, is to use object properties named after the event types. We can use the computed property access notation to create and read the properties, and the in operator to test whether a given property exists.

var ages = {};
function storeAge(name, age) {
  ages[name] = age;
}

storeAge("Larry", 58);
storeAge("Simon", 55);
console.log("Larry" in ages);
// → true
console.log(ages["Simon"]);
// → 55
There are a few potential problems with using objects like this, which we will discuss in Chapter 6, but for the time being, we won’t worry about those.

What if we want to find all the people whose ages we have stored? The properties don’t form a predictable series, like they would in an array. JavaScript provides a loop construct specifically for going over the properties of an object. It looks a little like a normal for loop, but distinguishes itself by the use of the word in.

for (var name in ages)
  console.log(name + " is " + ages[name] + " years old");
// → Larry is 58 years old
// → Simon is 55 years old
So if we create a big object whose properties are named by the events they refer to, and hold the correlation coefficients for those events, we can uses for/in loop to further inspect them.

The final analysis

To find all the types of events that are present in the data set, we simply process each entry in turn, and then loop over the events in that entry. We keep an object phis that has correlation coefficients for all the event types we have seen so far. Whenever we run across a type that we didn’t see before—that isn’t in the phis object yet—we compute its correlation and add it to the object.

function gatherCorrelations(journal) {
  var phis = {};
  for (var entry = 0; entry < journal.length; ++entry) {
    var events = journal[entry].events;
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      if (!(event in phis))
        phis[event] = phi(tableFor(event, journal));
    }
  }
  return phis;
}

var correlations = gatherCorrelations(JOURNAL);
console.log(correlations.pizza);
// → 0.068599434
Let us see what came out.

for (var event in correlations)
  console.log(event + ": " + correlations[event]);
// → carrot:   0.0140970969
// → exercise: 0.0685994341
// → weekend:  0.1371988681
// → bread:   -0.0757554019
// → pudding: -0.0648203724
// and so on...
Most correlations seem to lie close to zero. Eating carrots, bread, or pudding apparently does not trigger squirrel-lycanthropy. It does seem to occur somewhat more often on weekends. Let’s filter the results to only show correlations greater than 0.1 (or smaller than -0.1).

for (var event in correlations) {
  var correlation = correlations[event];
  if (correlation > 0.1 || correlation < -0.1)
    console.log(event + ": " + correlation);
}
// → weekend:        0.1371988681
// → brushed teeth: -0.3805211953
// → candy:          0.1296407447
// → work:          -0.1371988681
// → spaghetti:      0.2425356250
// → reading:        0.1106828054
// → peanuts:        0.5902679812
A-ha! There are two factors whose correlation is clearly stronger than the others. Eating peanuts has a strong positive effect on the chance of turning into a squirrel, whereas brushing his teeth has a significant negative effect.

Interesting. Let us try something.

for (var i = 0; i < JOURNAL.length; i++) {
  var entry = JOURNAL[i];
  if (hasEvent("peanuts", entry) &&
     !hasEvent("brushed teeth", entry))
    entry.events.push("peanut teeth");
}
console.log(phi(tableFor("peanut teeth", JOURNAL)));
// → 1
Well, that’s unmistakable! The phenomenon occurs precisely then when Jaques eats peanuts and fails to brush his teeth. If only he wasn’t such a slob about dental hygiene, he’d never even have noticed his affliction.

Having found this result, Jaques simply stopped eating peanuts altogether, and found that this completely put an end to his transformations.

All was well for a while, but a few years later, he lost his job. Things went downhill, and he was forced to take employment with a circus, performing as The Incredible Squirrelman by stuffing his mouth with peanut butter before every show. One day, fed up with this depressing, pitiful existence, Jaques failed to change back into his human form, hopped through a crack in the circus tent, and vanished into the forest. He has not been seen again.

Further arrayology

Before finishing up this chapter, I want to introduce you to a few more object-related concepts. We’ll start by introducing some generally useful array methods.

We saw push and pop, which add and remove elements at the end of an array, earlier in this chapter. The corresponding methods for adding and removing things to the start of an array are called unshift and shift.

var todoList = [];
function rememberTo(task) {
  todoList.push(task);
}
function whatIsNext() {
  return todoList.shift();
}
function urgentlyRememberTo(task) {
  todoList.unshift(task);
}
The above program manages lists of tasks. You add tasks to its end by calling rememberTo("eat"), and then when you are ready to do something, you call whatIsNext() to get (and remove) the front item on the list. The urgentlyRememberTo function also adds a task, but it adds it to the front instead of the back of the list.

Another very fundamental method is slice, which takes a start and an end index, and returns an array that has only the elements between those indices. The start index is inclusive, the end index exclusive.

console.log([0, 1, 2, 3, 4].slice(2, 4));
// → [2, 3]
console.log([0, 1, 2, 3, 4].slice(2));
// → [2, 3, 4]
When the end index is not given, slice will take all of the elements after the start index. Strings, by the way, also have a slice method, which has a similar effect.

To glue arrays together, similar to what the ‘+’ operator does for strings, their concat method can be used. This example function takes an array and an index, and returns a new array that is the input array, but with the element at the given index missing.

function remove(array, index) {
  return array.slice(0, index)
    .concat(array.slice(index + 1));
}
console.log(remove([1, 2, 3, 4, 5], 2));
// → [1, 2, 4, 5]
The arguments object

Whenever a function is called, a special “magic” variable named arguments is added to the environment in which the function body runs. This variable refers to an object that holds all of the arguments passed to the function. Remember that in JavaScript you are allowed to pass more—or less—arguments to a function than the amount of parameters the function itself declares.

function noArguments() {}
noArguments(1, 2, 3); // This is okay
function threeArguments(a, b, c) {}
threeArguments(); // And so is this
The arguments object has a length property that tells us the amount of arguments that were really passed to the function. It also has a property for each argument, named 0, 1, 2, and so on.

If that sounds a lot like an array to you, you’re right, it is a lot like an array. But this object, unfortunately, does not have any array methods (like slice or indexOf), so it is a little harder to use than a real array.

function argumentCounter() {
  console.log("You gave me", arguments.length,
              "arguments.");
}
argumentCounter("Straw man", "Tautology", "Ad hominem");
// → You gave me 3 arguments.
Some functions can take any number of arguments, like console.log does. These typically loop over the values in their arguments object. They can be used to create very pleasant interfaces. For example, the entries to Jaques’ journal were created with calls like this:

addEntry(["work", "touched tree", "pizza", "running",
          "television"], false);
Since he is going to be calling this function a lot, we could create a slightly nicer alternative:

function addEntry(squirrel) {
  var entry = {events: [], squirrel: squirrel};
  for (var i = 1; i < arguments.length; i++)
    entry.events.push[arguments[i]];
  journal.push(entry);
}
addEntry(true, "work", "touched tree", "pizza",
         "running", "television");
This reads its first argument (squirrel) in the normal way, and then goes over the rest of the arguments (the loop starts at index 1, skipping the first) to gather them into an array.

The Math object

As we’ve seen, Math is a grab-bag of number-related utility functions, such Math.max (maximum), Math.min (minimum), and Math.sqrt (square root).

In the case of Math, an object is used simply as a container to group a bunch of related functionality. There is only one math object, and it is almost never useful as a value. Rather, it provides a namespace, so that all these functions and values do not have to be global variables.

Having too many global variables “pollutes” the namespace. The more names have been taken, the more likely you are to accidentally overwrite the value of some variable. For example, it is not a far shot to want to name something max in one of our programs.

Many languages will stop you, or at least warn you, when you are defining a variable with a name that is already taken. JavaScript does neither, so be careful.

Back to the Math object. If you need to do trigonometry, Math can help. It contains cos (cosine), sin (sine), tan (tangent), acos, asin, and atan functions. The number π (pi)—or at least the closest approximation that fits in a JavaScript number—is available as Math.PI (there is an old programming tradition of writing the names of constant values in all caps).

function randomPointOnCircle(radius) {
  var angle = Math.random() * 2 * Math.PI;
  return {x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)};
}
console.log(randomPointOnCircle(2));
// → {x: 0.3667, y: 1.966}
If sines and cosines are not something you are very familiar with, don’t worry, this book won’t go into any complicated math.

The example above uses Math.random. This is a function that returns a new pseudo-random number between zero (inclusive) and one (exclusive) every time you call it.

console.log(Math.random());
// → 0.36993729369714856
console.log(Math.random());
// → 0.727367032552138
console.log(Math.random());
// → 0.40180766698904335
Through computers are deterministic machines—they always react in the same way to the input they receive—it is possible to have them produce numbers that appear random. To do this, the machine keeps a number (or a bunch of numbers) that, every time a random number is asked for, it performs some complicated deterministic computations on. It then returns a part of the result of those computations, and also uses their outcome to change its internal number, so that the next random number produced will be different.

If we want a whole random number instead of a fractional one, we can use Math.floor on the result of Math.random.

console.log(Math.floor(Math.random() * 10));
// → 2
Multiplying the random number by ten gives us a number greater than or equal to zero, and below ten. Math.floor rounds down to the nearest whole number, so it will produce (with equal chance) any of the numbers 0, 1, 2, up to 9.

There are also Math.ceil (ceiling, rounding up to a whole number) and Math.round (to the nearest whole number).

The global object

The global scope also acts as an object. In browsers, this object is stored in the window variable. All global variables act as properties of this object.

var myVar = 10;
console.log(window.hasOwnProperty("myVar"));
// → true
console.log(window.myVar);
// → 10
Summary

Objects and arrays provide ways to group several values into a single value. Conceptually, this allows us to put a bunch of related things in a bag, and run around with the bag, instead of trying to wrap our arms around all of the individual things and trying to hold on to them.

Most values in JavaScript have properties (the exceptions being null and undefined). Properties are accessed using value.propName or value["propName"]. Objects tend to use names for their properties, and store a more or less fixed set of them. Arrays, on the other hand, usually contain varying amounts of conceptually identical values, and use numbers (staring from 0) as the names of their properties.

There are some named properties in arrays, such as length and a number of methods. Methods are functions that live in properties and (usually) act on the value they are a property of.

Exercises

Congratulations. You now know enough JavaScript fundamentals to write useful programs.

The sum of a range

The introduction of this book alluded to this program as a nice way to compute the sum of a range of numbers:

console.log(sum(range(1, 10)));
Write a range function that takes two arguments, start and end, and returns an array containing all the numbers from start up to (and including) end.

Next, write a sum function that takes an array of numbers, and returns the sum of these numbers. Run the above program and see whether it does indeed return 55.

As a bonus assignment, modify your range function to take an optional third argument that indicates the “step” value used to build up the array. If not given, it moves by steps of one, corresponding to the old behavior. The call range(1, 10, 2) should return [1, 3, 5, 7, 9]. Make sure it also works with negative step values—so that range(5, 2, -1) produces [5, 4, 3, 2].

// Your code here.

console.log(sum(range(1, 10)));
// → 55
console.log(range(5, 2, -1));
// → [5, 4, 3, 2]
Reversing an array

Arrays have a method reverse, which will change the array by inverting the order in which its elements appear. For this exercise, write two functions, reverseArray and reverseArrayInPlace. The first, reverseArray, takes an array as argument and produces a new array that has the same elements in the inverse order. The second, reverseArrayInPlace does what the reverse method does—it modifies the array given as argument in order to reverse its elements.

Thinking back to the notes about side effects and pure functions in the previous chapter, which variant do you expect to be useful in more situations? Which one is more efficient?

// Your code here.

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
var arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
A list

Objects, by being generic blobs of values, can be used to build all sorts of data structures. An common data structure is the list (not to be confused with the array). A list is a set of objects, with the first object holding a reference (in a property) to the second, the second to the third, and so on.

var list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null
    }
  }
};
A nice thing about lists is that they can share parts of their structure. For example, if I create two new values {value: 0, rest: list} and {value: -1, rest: list} (with list referring to the variable defined above), they are both independant lists, but they share the structure that makes up their last three elements. In addition, the original list is also still a valid three-element list.

Write a function arrayToList that builds up a data structure like the one above when given [1, 2, 3] as argument, and a listToArray function that produces an array from a list. Also write the helper functions prepend, which takes an element and a list, and creates a new list that adds the element to the front of the input list, and nth, which takes a list and a number, and returns the element at the given position in the list, or undefined when there is no such element.

If you hadn’t already, also write a recursive version of nth.

// Your code here.

console.log(arrayToList([1, 2]));
// → {value: 1, rest: {value: 2, rest: null}}
console.log(listToArray(arrayToList([1, 2, 3])));
// → [1, 2, 3]
console.log(prepend(1, prepend(2, null)));
// → {value: 1, rest: {value: 2, rest: null}}
console.log(nth(arrayToList([1, 2, 3]), 1));
// → 2
Deep comparison

The ‘==’ operator compares objects by identity. Sometimes, you would prefer to compare the values of their actual properties.

Write a function deepEqual that takes two values, and returns true only if they are the same value, or objects with the same properties whose values are equal, when compared with a recursive call to deepEqual.

To find out whether to compare something by identity (use the ‘===’ operator for that) or by looking at its properties, you can test whether applying the typeof operator on it produces "object". But you have to take one silly exception into account, because (through a historical accident), typeof null also produces "object".

// Your code here.

var obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(
  deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
⬅ ⬆ ➡