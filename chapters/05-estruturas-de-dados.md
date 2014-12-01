Chapter 4 - Link original: http://eloquentjavascript.net/2nd_edition/preview/04_data.html

# Estrutura de dados: Object e Array

> Em duas ocasiões, me perguntaram, "Ora, Mr. Babbage, se você colocar em uma calculadora números errados, poderá trazer resultados corretos?" [...] Eu não sou capaz de compreender o tipo de confusão de ideias que poderia provocar tal questão.

> -- <cite>Charles Babbage, Passages from the Life of a Philosopher (Passagens da vida de um filósofo) (1864)</cite>

Números, Booleanos e strings são os tijolos usados para construir as estruturas de dados. Mas você não pode construir uma casa com um único tijolo. Objetos nos permitem agrupar valores -- incluindo outros objetos --, e assim construir estruturas mais complexas.

Os programas que construímos até agora têm sido seriamente dificultados pelo fato de que eles só estavam operando com tipos de dados simples. Este capítulo irá adicionar uma compreensão básica de estruturas de dados para o seu kit de ferramentas. Ao final dele, você vai conhecer programação o suficiente para começar a escrever programas significativos.

O capítulo vai funcionar mais ou menos como um exemplo realista de programação, introduzindo conceitos que se aplicam ao problema em questão. O código de exemplo, muitas vezes, será construído sobre as funções e variáveis ​​que foram introduzidas no início do texto.

## O weresquirrel (O esquilo-lobo)

De vez em quando, geralmente entre oito e dez da noite, Jaques transforma-se em um pequeno roedor peludo com uma cauda espessa.

Por um lado, Jaques está bastante contente que ele não tem licantropia clássica. Transformando-se em um esquilo tende a causar menos problemas do que se transformando em um lobo. Em vez de ter de se preocupar em comer acidentalmente o vizinho (que seria estranho), ele se preocupa com o que está sendo comido pelo gato do vizinho. Depois de duas ocasiões em que ele acordou em um galho fino precariamente na copa de um carvalho, nu e desorientado, ele tomou a trancar as portas e janelas de seu quarto à noite, e colocar algumas nozes no chão para manter-se ocupado.

![The weresquirrel](https://rawgit.com/ericdouglas/eloquente-javascript/master/img/weresquirrel.svg)

Isto cuida dos problemas do gato e do carvalho. Mas Jaques ainda sofre com sua condição. As ocorrências irregulares da transformação fazem-no suspeitar de que pode haver algum gatilho que faz com que elas aconteçam. Por um tempo, ele acreditava que isso só acontecia nos dias em que ele havia tocado em árvores. Então ele parou de fazer isso por completo, e evitando até mesmo passar perto delas. Mas o problema persistiu.

Mudando para uma abordagem mais científica, Jaques quer começar a manter um registo diário das coisas que ele fez naquele dia, e se ele acabou mudando de forma. Usando esses dados em sua própria vida, ele espera ser capaz de diminuir as condições que desencadeiam as transformações.

A primeira coisa que ele fará será criar um conjunto de dados para armazenar essas informações.

## Conjuntos de dados

Para trabalhar com um trecho de dados digitais, primeiro teremos que encontrar uma maneira de representá-los na memória de nossa máquina. Dizer, como um exemplo muito simples, que queremos para representar uma coleção de números.

Poderíamos ser criativos com *strings* - strings podem ter qualquer comprimento, assim você pode usar muitos dados em uma - e usar o "2 3 5 7 11" como a nossa representação. Mas isso é estranho. Você teria que, de alguma forma, extrair os dígitos e convertê-los de volta para número para acessá-los.

Felizmente, JavaScript fornece um tipo de dados especificamente para armazenar sequências de valores. Ele é chamado de *array*, e está escrito como uma lista de valores entre colchetes, separados por vírgulas.

```js
var listOfNumbers = [2, 3, 5, 7, 11];
console.log(listOfNumbers[1]);
// → 3
console.log(listOfNumbers[1 - 1]);
// → 2
```

A notação para a obtenção de elementos dentro de uma matriz também usa colchetes. Um par de colchetes, imediatamente após uma expressão, com uma expressão dentro deles, vai procurar o elemento da expressão à esquerda que corresponde ao índice determinado pela expressão entre parênteses.

Estes índices começam em zero, não um. Assim, o primeiro elemento pode ser lido com `ListOfNumbers[0]`. Se você não tem um *background* de programação, isso pode levar algum tempo para se acostumar. Contagem baseada em zero tem uma longa tradição em tecnologia, e desde que essa convenção é constantemente seguida (o que ela é, em JavaScript), ela funciona muito bem.

## Propriedades

Nós vimos algumas expressões de aparência suspeita, como myString.length (para obter o comprimento de uma string) e Math.max (a função máxima) em exemplos passados. Estas acessam propriedades de outros valores. No primeiro caso, a propriedade length do valor em myString. Na segunda, a propriedade nomeada max no objeto Math (que é um conjunto de funções e valores relacionados com a matemática).

Quase todos os valores de JavaScript têm propriedades. As exceções são null  e undefined. Se você tentar acessar uma propriedade em um desses _non-values_ (propriedades sem valor), você receberá um erro.

```js
null.length;
// → TypeError: Cannot read property 'length' of null
```

Arrays também tem uma propriedade length, mantendo a quantidade de elementos no array. Na verdade, os elementos no array também são acessados por meio de propriedades. Ambos value.index e value[index] acessam uma propriedade em value. A diferença está em como _index_ é interpretada. Ao usar um ponto, a parte após o ponto (que deve ser um nome de variável válido) acessa diretamente o nome da propriedade. Ao usar colchetes, o índex é tratado como uma expressão que é avaliada para obter o nome da propriedade. Considerando que value.index busca a propriedade chamada "index", value[index] tenta obter o valor da variável chamada índex, e usa isso como o nome da propriedade.

Então, se você sabe que a propriedade que você está interessado se chama "length", você diz value.length. Se você deseja extrair a propriedade nomeada pelo valor mantido na variável i, você diz value[i]. E, finalmente, se você quiser acessar uma propriedade denominada "0" ou "John Doe" (nomes de propriedade pode ser qualquer string), estes não são os nomes de variáveis válidos, então você é forçado a usar colchetes, como em value[0] ou value["John Doe"], mesmo que você saiba o nome preciso da propriedade com antecedência.

## Métodos

Objetos dos tipos `String` ou `Array` contém, além da propriedade `length`, um número de propriedades que se referem à valores de função.

```js
var doh = "Doh";
console.log(typeof doh.toUpperCase);
// → function
console.log(doh.toUpperCase());
// → DOH
```

Toda string têm uma propriedade `toUpperCase`. Quando chamada, ela irá retornar uma cópia da string, onde todas as letras serão convertidas em maiúsculas. Existe também a `toLowerCase`. Você pode adivinhar o que ela faz.

Curiosamente, mesmo que a chamada para toUpperCase não passe nenhum argumento, a função de alguma forma têm acesso à string "Doh", cujo valor é uma propriedade. Como isso funciona exatamente é descrito no [Capítulo 6 - @TODO - ADICIONAR LINK]().

As propriedades que contêm funções são geralmente chamados _métodos_ do valor a que pertencem. Tal como em "toUpperCase é um método de uma string".

Este exemplo demonstra alguns métodos que os objetos do tipo array contém:

```js
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
```

O método `push` pode ser usado para adicionar valores ao final de um array. O método `pop` faz o oposto. Ela remove o valor no final do array e retorna-o. Um array de strings pode ser _achatado_ para uma simples string com o método `join`. O argumento passado para `join` determina o texto que é usado para _colar_ os elementos do array.

## Objetos

Voltamos ao _esquilo-lobo_. Um conjunto de entradas de log diários pode ser representado como um array. Mas as entradas não são compostas por apenas um número ou uma sequência de cada entrada precisa armazenar uma lista de atividades, e um valor booleano que indica se Jaques transformou-se em um esquilo. A representação prática precisa agrupar esses valores juntos em um único valor, e em seguida, colocar esses valores agrupados em um array de entradas.

Valores do tipo _objeto_ são coleções arbitrárias de propriedades, que podem  adicionar propriedades a (e remover propriedades de) o que quisermos. Uma maneira de criar um objeto é usando uma notação com chaves:

```js
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
```

Dentro das chaves, podemos passar uma lista de propriedades, escrito como um nome seguido por dois pontos e uma expressão que fornece um valor para a propriedade. Os espaços e quebras de linha não são novamente significativos. Quando um objeto se estende por várias linhas, indentá-lo como temos vindo a indentar blocos de código ajuda na legibilidade. Propriedades cujos nomes não são válidos, nomes de variáveis ou números válidos têm de ser colocados entre aspas.

```js
var descriptions = {
  work: "Went to work",
  "touched tree": "Touched a tree"
};
```

É possível atribuir um valor a uma expressão de propriedade com o operador '='. Isso irá substituir o valor da propriedade, se ele já existia, ou criar uma nova propriedade sobre o objeto se ele não o fez.

Lendo uma propriedade que não existe irá produzir o valor undefined.

Voltando brevemente ao nosso modelo "tentáculo" de associações de variáveis - associações de propriedades são semelhantes. Eles recebem valores, mas outras variáveis e propriedades podem estar recebendo os mesmos valores. Então, agora você pode começar a pensar em objetos como polvos com qualquer número de tentáculos, cada um dos quais tem um nome inscrito nele.

![A representação artística de um objeto](https://rawgit.com/ericdouglas/eloquente-javascript/master/img/octopus-object.jpg)

Para cortar uma tal perna - removendo uma propriedade de um objeto - o operador `delete` pode ser usado. Este é um operador unário que, quando aplicado a uma expressão de acesso a propriedade, irá remover a propriedade nomeada a partir do objeto. (O que não é uma coisa muito comum de se fazer na prática, mas é permitido.)

```js
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
```

O binário no operador, quando aplicado à uma string e um objeto, return um valor booleano que indica se aquele objeto tem aquela propriedade. A diferença entre configurar uma propriedade para `undefined` e realmente excluí-la, é que, no primeiro caso, o objeto continua com a propriedade (ela simplesmente não tem um valor muito interessante), enquanto que, no segundo caso a propriedade não está mais presente e retornará `false`.

Arrays, então, são apenas um tipo de objetos especializados para armazenar sequência de coisas. Se você avaliar `typeof [1, 2]`, isto retorna `object`.  Eu acho que você pode vê-los como tentáculos longos e planos, com todas as suas armas em linha, rotuladas com números.

![A representação artística de um array](https://rawgit.com/ericdouglas/eloquente-javascript/master/img/octopus-array.jpg)

A representação desejada do jornal de Jaques é, portanto, um array de objetos.

```js
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
```

## Mutabilidade

Nós iremos chegar a programação real em breve, eu prometo. Mas, primeiro, um pouco mais de teoria.

Temos visto que os valores de objeto podem ser modificados. Os tipos de valores discutidos nos capítulos anteriores são todos imutáveis, é impossível alterar um valor existente desses tipos. Você pode combiná-los e obter novos valores a partir deles, mas quando você toma um valor específico de string, esse valor será sempre o mesmo. O texto dentro dele não pode ser alterado. Com objetos, por outro lado, o conteúdo de um valor pode ser modificado alterando as suas propriedades.

Quando temos dois números, 120 e 120, que podem, se eles se referem aos mesmos bits físicos ou não, serem considerados os mesmos números precisos. Com objetos, existe uma diferença entre ter duas referências para o mesmo objeto e tendo dois objetos diferentes que contêm as mesmas propriedades. Considere o seguinte código:

```js
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
```

object1 e object2 são duas variáveis que recebem o mesmo valor. Há apenas um objeto real, por que mudar object1 também altera o valor de object2. A variável object3 aponta para um outro objeto, que inicialmente contém as mesmas propriedades que object1 mas vive uma vida separada.

O operador `==` de JavaScript, quando se comparamos objetos, retornará verdadeiro somente se ambos os valores que lhe são atribuídas são o mesmo valor preciso. Comparando diferentes objetos com conteúdos idênticos retornará false. Não há nenhuma operação de comparação "profunda" construída em JavaScript, mas é possível você mesmo escrevê-la (que será um dos [exercícios - @TODO - ADICIONAR LINK]() no final deste capítulo).

## O log do lobisomem

Então Jaques inicia seu interpretador de JavaScript, e configura o ambiente que ele precisa para manter seu diário.

```js
var journal = [];

function addEntry(events, didITurnIntoASquirrel) {
  journal.push({
    events: events,
    squirrel: didITurnIntoASquirrel
  });
}
```

E então, todas as noites às dez ou às vezes na manhã seguinte, - depois de descer da prateleira de cima de sua estante - o seu dia é gravado.

```js
addEntry(["work", "touched tree", "pizza", "running",
          "television"], false);
addEntry(["work", "ice cream", "cauliflower", "lasagna",
          "touched tree", "brushed teeth"], false);
addEntry(["weekend", "cycling", "break", "peanuts",
          "beer"], true);
```

Uma vez que ele tem pontos de dados suficientes, ele pretende calcular a correlação entre a esquiloficação e cada um dos eventos do dia que ele gravou, e espera aprender algo útil a partir dessas correlações.

Correlação é uma medida de dependência entre variáveis ("variáveis", no sentido estatístico, e não o sentido JavaScript). É geralmente expressa em um coeficiente que varia de -1 a 1. Zero correlação significa que as variáveis não estão relacionadas, enquanto uma correlação de um indica que os dois são perfeitamente relacionados - se você conhece um, você também conhecer o outro. Menos um significa também que as variáveis são perfeitamente ligadas, mas que são opostas uma à outra, quando um deles é verdadeiro, o outro é falso.

Para variáveis binárias (boolean), o coeficiente phi fornece uma boa medida de correlação, e é relativamente fácil de calcular. Primeiro temos uma matriz n, que indica o número de vezes que foram observadas as várias combinações das duas variáveis. Por exemplo, poderíamos tomar o evento de comer pizza, e colocar isso em uma tabela como esta:

![Comendo Pizza x transformar-se em esquilo](https://rawgit.com/ericdouglas/eloquente-javascript/master/img/pizza-squirrel.svg)

A partir de uma tal tabela (n), o coeficiente de phi (φ) pode ser calculado pela seguinte fórmula.

```math
ϕ =
n11n00 - n10n01
√ n1•n0•n•1n•0
```

----

----




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
There are a few potential problems with using objects like this, which we will discuss in [Chapter 6 - @TODO - ADICIONAR LINK](), but for the time being, we won’t worry about those.

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

----
> Building up an array is most easily done by first initializing a variable to [] (a fresh, empty array) and repeatedly calling its push method to add a value. Don’t forget to return the array at the end of the function.

> Since the end boundary is inclusive, you’ll need to use the <= operator rather than simply < to check for the end of your loop.

> To check whether the optional step argument was given, either check arguments.length or compare the value of the argument to undefined. If it wasn’t given, simply set it to its default value (1) at the top of the function.

> Having range understand negative step values is probably best done by writing two separate loops—one for counting up and one for counting down—because the comparison that checks whether the loop is finished needs to be >= rather than <= when counting downward.

> It might also be worthwhile to use a different default step, namely, -1, when the end of the range is smaller than the start. That way, range(5, 2) returns something meaningful, rather than getting stuck in an infinite loop.
----

Reversing an array

Arrays have a method reverse, which will change the array by inverting the order in which its elements appear. For this exercise, write two functions, reverseArray and reverseArrayInPlace. The first, reverseArray, takes an array as argument and produces a new array that has the same elements in the inverse order. The second, reverseArrayInPlace does what the reverse method does—it modifies the array given as argument in order to reverse its elements.

Thinking back to the notes about side effects and pure functions in the [previous chapter @TODO - COLOCAR LINK](), which variant do you expect to be useful in more situations? Which one is more efficient?

// Your code here.

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
var arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]

----
> There are two obvious ways to implement reverseArray. The first is to simply go over the input array from front to back and use the unshift method on the new array to insert each element at its start. The second is to loop over the input array backward and use the push method. Iterating over an array backward requires a (somewhat awkward) for specification like (var i = array.length - 1; i >= 0; i--).

> Reversing the array in place is harder. You have to be careful not to overwrite elements that you will later need. Using reverseArray or otherwise copying the whole array (array.slice(0) is a good way to copy an array) works but is cheating.

> The trick is to swap the first and last elements, then the second and second-to-last, and so on. You can do this by looping over half the length of the array (use Math.floor to round down—you don’t need to touch the middle element in an array with an odd length) and swapping the element at position i with the one at position array.length - 1 - i. You can use a local variable to briefly hold on to one of the elements, overwrite that one with its mirror image, and then put the value from the local variable in the place where the mirror image used to be.
----

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

The resulting objects form a chain, like this:

![A linked list](https://rawgit.com/ericdouglas/eloquente-javascript/master/img/linked-list.svg)

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

----
> Building up a list is best done back to front. So arrayToList could iterate over the array backward (see previous exercise) and, for each element, add an object to the list. You can use a local variable to hold the part of the list that was built so far and use a pattern like list = {value: X, rest: list} to add an element.

> To run over a list (in listToArray and nth), a for loop specification like this can be used:

```js
> for (var node = list; node; node = node.rest) {}
```
> Can you see how that works? Every iteration of the loop, node points to the current sublist, and the body can read its value property to get the current element. At the end of an iteration, node moves to the next sublist. When that is null, we have reached the end of the list and the loop is finished.

> The recursive version of nth will, similarly, look at an ever smaller part of the “tail” of the list and at the same time count down the index until it reaches zero, at which point it can return the value property of the node it is looking at. To get the zeroeth element of a list, you simply take the value property of its head node. To get element N + 1, you take the Nth element of the list that’s in this list’s rest property.
----

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

----
> Your test for whether you are dealing with a real object will look something like typeof x == "object" && x != null. Be careful to compare properties only when both arguments are objects. In all other cases you can just immediately return the result of applying ===.

> Use a for/in loop to go over the properties. You need to test whether both objects have the same set of property names and whether those properties have identical values. The first test can be done by counting the properties in both objects and returning false if the numbers of properties are different. If they’re the same, then go over the properties of one object, and for each of them, verify that the other object also has the property. The values of the properties are compared by a recursive call to deepEqual.

> Returning the correct value from the function is best done by immediately returning false when a mismatch is noticed and returning true at the end of the function.
----