Capítulo 9

# Expressões Regulares

Algumas pessoas, quando confrontadas com um problema, pensam "Eu sei, terei que usar expressões regulares." Agora elas têm dois problemas
Jamie Zawinski

Yuan-Ma disse, "Quando você serra contra o sentido da madeira, muita força será necessária. Quando você programa contra o sentido do problema, muito código será necessário"
Mestre Yuan-Ma, The Book of Programming

A maneira como técnicas e convenções de programação sobrevivem e se disseminam, ocorrem de um modo caótico, evolucionário. Não é comum que o mais agradável e brilhante vença, mas sim aquelas que combinam bem com o trabalho e o nicho, por exemplo, sendo integradas com outra tecnologia de sucesso.

Neste capítulo, discutiremos uma dessas tecnologias, expressões regulares. Expressões regulares são um modo de descrever padrões em um conjunto de caracteres. Eles formam uma pequena linguagem à parte, que é incluída no Javascript (assim como em várias outras linguagens de programação e ferramentas) .

Expressões regulares são ao mesmo tempo, extremamente úteis e estranhas. Conhecê-las apropiadamente irá facilitar muito vários tipos de processamento de textos. Mas a sintaxe utilizada para descreve-las é ridiculamente enigmática. Alem disso, a interface do Javascript para elas é um tanto quanto desajeitada.

----

## Notação

Uma expressão regular é um objeto. Ele pode ser construído com o construtor RegExp ou escrito como um valor literal, encapsulando o padrão em com o caracter barra ('/') .

```
var expReg1 = new RegExp("abc");
var expReg2 = /abc/;
```
Este objeto representa um padrão, que no caso é uma letra "a" seguida de uma letra "b" e depois um "c".

Ao usar o construtor RegExp, o padrão é escrito como um texto normal, de modo que as regras normais se aplicam para barras invertidas. Na segunda notação, usamos barras para delimitar o padrão. Alguns outros caracteres, como sinais de interrogação (?) e sinais de soma (+), são usados como marcadores especias em expressões regulares, e precisam ser precedidos por uma barra invertida, para representarem o caractere original e não o comando de expressão regular.

```
var umMaisum = /1 \+ 1/;
```

Saber exatamente quais caracteres devem ser escapados com uma barra invertida em uma expressão reguar exige que você saiba todos os caracteres especiais e seus significados na sintaxe de expressões regulares. Por enquando, pode não parecer fácil saber todos, então, se tiver dúvidas, escape todos os caracteres que não sejam letras e números ou um espaço em branco.

## Testando por correspondências

Expressões regulares possuem vários métodos. O mais simples é test, onde dado um determinado texto, ele retorna um booleano que informa se o padrão fornecido na expressão foi encontrado nesse texto.

```
console.log( /abc/.test("abcde") );
// → true
console.log( /abc/.test("12345") );
// → false
```

Uma expressão regular que contenha apenas caracteres simples, representa essa mesma sequência de caracteres. Se "abc" existe em qualquer lugar (não apenas no início) do texto testado, o resultado será verdadeiro.

## Encontrando um conjunto de caracteres

Saber quando uma string contém "abc" pode muito bem ser feito usando a função indexOf. A diferença das expressões regulares é que elas permitem padrões mais complexos de busca.

Digamos que queremos achar qualquer número. Em uma expressão egular, colocar um conjunto de caracteres entre colchetes ("[]") faz com que a expressão ache qualquer dos caracteres dentro dos colchetes.

A expressão abaixo, acha todas as strings que contem um dígito numérico.

```
console.log( /[0123456789]/.test("ano 1992") );
// → true
console.log( /[0-9]/.test("ano 1992") );
// → true
```

Dentro de colchetes, um hífen ("-") entre dois caracteres pode ser usado para indicar um conjunto entre dois caracteres. Uma vez que os códigos de caracteres Unicode de "0" a "9" contém todos os dígitos (códigos 48 a 57), [0-9] encontrará qualquer dígito.

Existem alguns grupos de caracetes de uso comum, que já possuem atalhos incluídos na sintaxe de expressões regulares. Dígitos são um dos conjuntos que você pode escrever usando um atalho, barra invertida seguida de um "d" minúsculo (\d), com o mesmo significado que [0-9].

	- \d	caracteres numéricos
	- \w	caracteres alfanuméricos ("letras”)
	- \s	espaços em branco (espaço, tabs, quebras de linha e similares)
	- \D	caracteres que não são dígitos
	- \W	caracteres não alfanuméricos
	- \S	caracteres que não representam espaços
	- . (ponto)	todos os caracteres, exceto espaços


Para cada um dos atalhos de conjuntos de caracteres, existe uma variação em letra maiúscula que significa o exato oposto.

Então você pode registrar um formato de data e hora como “30/01/2003 15:20” com a seguinte expressão:

```
var dataHora = /\d\d\/\d\d\/\d\d\d\d \d\d:\d\d/;
console.log( dataHora.test("30/01/2003 15:20") );
// → true
console.log( dataHora.test("30/jan/2003 15:20") );
// → false
```

Parece confuso, certo? Muitas barras invertidas, sujando a expressão, que dificultam compreender qual o padrão procurado. Mas é assim mesmo o  trabalho com expressões regulares.

Estes marcadores d ecategoria também podem ser usados dentro de colchetes, então [\d\i] significa qualquer dígito ou ponto.

Para "inverter" um conjunto de caracteres, buscar tudo menos o que você escreveu no padrão, um cento circunflexo ("^") é colocado no início do colchete de abertura.

```
var naoBinario = /[^01]/;
console.log( naoBinario.test("01101") );
// → false
console.log( naoBinario.test("01201") );
// → true
```

## Partes repetidas em um pattern

Já aprendemos a encontrar um dígito, mas o que realmente queremos é encontrar um número, uma sequencia de um ou mais dígitos.

Quando se coloca um sinal de mais ("+") depois de algo em uma expressão regular, indicamos que pode existir mais de um. Então /\d+/ encontra um ou mais dígitos.

```
console.log( /'\d+'/.test("'123'") );
// → true
console.log( /'\d+'/.test("''") );
// → false
console.log( /'\d*'/.test("'123'") );
// → true
console.log( /'\d*'/.test("''") );
// → true
```

O asterisco ("*") tem um significado similar, mas também permite não encontrar o padrão. Entao, algo com um asterisco depois nao impede um padrão de ser achado, penas retornando zero resultados.

Uma interrogação ("?") define uma parte do padrão de busca como "opcional", o que significa que ele pode ocorrer zero ou mais vezes. Neste exemplo, é permitido  que ocorra o caracter "u", mas o padrão também é encontrado quando ele está ausente. 

```
var neighbor = /neighbou?r/;
console.log(neighbor.test("neighbour"));
// → true
console.log(neighbor.test("neighbor"));
// → true
```

Para permitir que um padrão ocorra um número defido de vezes, chaves ("{}") são usadas. Colocando {4} depois de um elemento do padrão, mostra que ele deve ocorrer 4 vezes, exatamente. Da mesma maneira, {2,4} é utilizado para definir que ele deve aparecer no mínimo 2 vezes e no máximo 4.

Segue outro versão do padrão mostrado acima, de data e hora. Ele permite, dias com um dígito, mês e hora como números e mais legível:

```
var dataHora = /\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}/;
console.log( dataHora.test("30/1/2003 8:45") );
// → true
```

Também é possível deixar em aberto o número mínimo ou máximo de ocorrencias, omitindo o número correspondente. Então {,5} significa que deve ocorrer de 0 até 5 vezes e {5,} significa que deve ocorrer cinco ou mais vezes.

## Agrupando sub-expressões

Para usar um operador como "*" ou "+" em mais de um caracter de de uma vez, é necessário o uso de parenteses. Um pedaço de uma expressão regular que é delimitado por parenteses conta como uma única unidade, assim como os operadores aplicados a esse pedaço delimitado.

```
var cartoonCrying = /boo+(hoo+)+/i;
console.log( cartoonCrying.test("Boohoooohoohooo") );
// → true
```

O terceiro "+" se aplica a todo grupo (hoo+), encontrando uma ou mais sequências como essa.

O "i" no final da expressãodo exemplo acima maz com que a expressão regular seja  case-insensitive, permitindo-a encontrar a letra maiúscula "B" na string dada, mesmo que a descrição do padrão tenha sido feita em letras minúsculas.

## Resultados e grupos

O método test é a maneira mais simples de encontrar correspondencias de uma expressão regular. Ela apenas informa se foi encontrado algo, e mais nada. Expressões regulares também possuem o método exec (executar), que irá retornar null quando nenhum resultado for encontrado, e um objeto com informações se encontrar.

```
var match = /\d+/.exec("one two 100");
console.log(match);
// → ["100"]
console.log(match.index);
// → 8
```

Valores string possuem um método que se comporta de maneira semelhante.

```
console.log("one two 100".match(/\d+/));
// → ["100", index: 8, input: "one two 100"] 
```

An object returned from exec or match has an index property that tells us where in the string the successful match started. Otherwise, the object looks like (and in fact is) an array of strings, whose first element is the string that was matched—in the example above, that is the sequence of digits that we were looking for.

Um objeto retornado pelo método exec ou match possui um index de propriedades que informa aonde na string o resultado encontrado se inicia. Além disso, o objeto se parece (e de fato é) um array de strings, onde o primeiro elemento é a string que foi achada, no exemplo acima, a sequência de dígitos numéricos.

Quando uma expressão regular contém expressões agrupadas entre parenteses, o texto que corresponde a esses grupos também aparece no array. O primeiro elemento sempre é todo o resultado, seguido pelo resultado do primeiro grupo entre parenteses, depois o segundo grupo e assim em diante.

```
var textoCitado = /'([^']*)'/;
console.log( textoCitado.exec("'ela disse adeus'") );
// → ["'ela disse adeus'", "ela disse adeus", index: 0, input: "'ela disse adeus'"] 
```

Quando um grupo não termina sendo achado (se por exemplo, possui um sinal de interrogação depois dele), seu valor no array de resultado será undefined. Do mesmo modo, quando um grupo é achado várias vezes, apenas o último resultado encontrado estará no array.

```
console.log(/bad(ly)?/.exec("bad"));
// → ["bad", undefined]
console.log(/(\d)+/.exec("123"));
// → ["123", "3"]
```

Grupos podem ser muito úteis para extrair partes de uma string. Po exemplo, podemos não querer apenas verificar quando uma stringo contém uma data, mas também extraí-la, e contruir um obejeto que a representa. Se adicionarmos parenteses em volta do padrão de dígitos, poderemos selecionar a data no resultado da função exec.

Mas antes, um pequeno desvio.

## The date type

JavaScript has a standard object type for representing dates—or rather, points in time. It is called Date. If you simply create a date object using new, you get the current date and time.

```
console.log(new Date());
// → Wed Dec 04 2013 14:24:57 GMT+0100 (CET)
```

You can also create an object for a specific time.

```
console.log(new Date(2009, 11, 9));
// → Wed Dec 09 2009 00:00:00 GMT+0100 (CET)
console.log(new Date(2009, 11, 9, 12, 59, 59, 999));
// → Wed Dec 09 2009 12:59:59 GMT+0100 (CET)
```
JavaScript uses a convention where month numbers start at zero (so December is 11), yet day numbers start at one. This is extremely confusing and silly, so be careful.

The last four arguments (hours, minutes, seconds, and milliseconds) are optional, and taken to be zero when not given.

Internally, times are stored as the number of milliseconds since the start of 1970. The getTime method on a date returns this number. It is quite big, as you can imagine.

```
console.log(new Date(2013, 11, 19).getTime());
// → 1387407600000
console.log(new Date(1387407600000));
// → Thu Dec 19 2013 00:00:00 GMT+0100 (CET)
```
When giving the Date constructor a single argument, that argument is treated as such a millisecond number.

Date objects provide methods like getFullYear (getYear gets you the useless two-digit version), getMonth, getDate, getHours, getMinutes, and getSeconds to extract their components.

So now, by putting parentheses around the parts that we are interested in, we can easily extract a date from a string.

```
function findDate(string) {
  var dateTime = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
  var match = dateTime.exec(string);
  return new Date(Number(match[3]), Number(match[2]),
                  Number(match[1]));
}
console.log(findDate("30/1/2003"));
// → Sun Mar 02 2003 00:00:00 GMT+0100 (CET)
```

## Word and string boundaries

The findDate function above will also happily extract a date from a string like "100/1/30000"—a match may happen anywhere in the string, so in this case it’ll just start at the second character and end at the one-but-last.

If we want to enforce that the match must span the whole string, we can add the markers ‘^’ and ‘$’. The first matches the start of the input string, and the second the end. So /^\d+$/ matches a string consisting only of one or more digits, /^!/ matches any string that starts with an exclamation sign, and /x^/ does not match anything (the start of a string can not be after a character).

If, on the other hand, we just want to make sure the date starts and ends on a word boundary, we can use the marker \b. A word boundary is a point that has a word character on one side, and a non-word character on the other.

```
console.log(/cat/.test("concatenate"));
// → true
console.log(/\bcat\b/.test("concatenate"));
// → false
```

Note that these boundary markers don’t “cover” any actual characters, they just enforce that the pattern only matches when a certain condition holds at the place where they appear.

## Alternatives

Next, we want to know whether a piece of text contains not only a number, but a number followed by one of the words “pig”, “cow”, or “chicken”, or their plural forms.

We could write three regular expressions, and test them in turn, but there is a nicer way. The pipe character (|) denotes a choice between the pattern to its left and the pattern to its right. So I can say this:

```
var animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
console.log(animalCount.test("15 pigs"));
// → true
console.log(animalCount.test("15 pigchickens"));
// → false
```

Parentheses can be used to limit the part of the pattern that the pipe operator applies to, and you can put multiple such operators next to each other to express a choice between more than two patterns.

## The mechanics of matching

http://eloquentjavascript.net/2nd_edition/preview/img/re_pigchickens.svg

A string matches the expression if a path from the start (left) to the end (right) of the diagram can be found, with a corresponding start and end position in the string, such that every time we go through a box, we verify that our current position in the string corresponds to the element described by the box and, for elements that match actual characters (which the word boundaries do not), move our position forward.

So if we match "the 3 pigs" there is a match between positions 4 (the digit “3”) and 10 (the end of the string).

	At position 4, there is a word boundary, so we can move past the first box.

	Still at position 4, we find a digit, so we can also move past the second box.

	At position 5, we could go back to before the second (digit) box, or move forward through the box that holds a single space character. There is a space here, not a digit, so we choose the second path.

	We are now at position 6 (the start of “pigs”) and at the three-way branch in the diagram. We don’t see “cow” or “chicken” here, but we do see “pig”, so we take that branch.

	At position 9, after the three-way branching, we could either skip the “s” box and go straight to the final word boundary, or first match an “s”. There is an “s” character here, not a word boundary, so we go through the “s” box.

	We’re at position 10 (end of the string) and can only match a word boundary. The end of a string counts as a word boundary, so we go through the last box and have successfully matched this string.

The way the regular expression engine present in a JavaScript system will conceptually look for a match in a string is simple. It starts at the start of the string and tries a match there. In this case, there is a word boundary there, so it’d get past the first box, but there is no digit, so it’d fail at the second box. Then it moves on to the second character in the string, and tries there. And so on, until it finds a match, or reaches the end of the string and decides that there really is no match.

## Backtracking

The regular expression /\b([01]+b|\d+|[\da-f]h)\b/ matches either a binary number followed by a “b”, a regular decimal number without suffix character, or a hexadecimal number (base 16, with the letters “a” to “f” standing for the digits 10 to 15) followed by an “h”. This is the corresponding diagram:

http://eloquentjavascript.net/2nd_edition/preview/img/re_number.svg

When matching this expression, it will often happen that the top (binary) branch is entered although the input does not actually contain a binary number. When matching the string "103", it is only at the “3” that it becomes clear that we are in the wrong branch. The string does match the expression, just not the branch we are currently in.

What happens then is that the matcher backtracks. When entering a branch, it remembers where it was when it entered the current branch (in this case, at the start of the string, just past the first boundary box in the diagram), so that it can go back and try another branch if the current one does not work out. So for the string "103", after encountering the “3” character, it will start trying the decimal (second) branch. This one matches, so a match is reported after all.

When more than one branch matches, the first one (in the order in which the branches appear in the expression) will be taken.

Backtracking also happens, in slightly different forms, when matching repeat operators. If you match /^.*x/ against "abcxe", the .* part will first try to match the whole string. It’ll then realize that it can only match when it is followed by an “x”, and there is no “x” past the end of the string. So it tries to match one character less. And then another character less. And now it finds an “x” where it needs it, and reports a successful match from position 0 to 4.

It is possible to write regular expressions that will do a lot of backtracking. The problem occurs when a pattern can match a piece of input in a lot of ways. For example, if we get confused while writing our binary-number regexp and accidentally write something like /([01]+)+b/.

http://eloquentjavascript.net/2nd_edition/preview/img/re_slow.svg

If that tries to match some long series of zeroes and ones without a “b” character after them, it will first go through the inner loop until it runs out of digits. Then it notices there is no “b”, so it backtracks one position, goes through the outer loop once, and give up again, backtracking out of the inner loop once more. It will continue to try every possible route through these two loops, which means the amount of work it needs to do doubles with each additional character. For a few dozen characters, the resulting match will already take practically forever.

## The replace method

String values have a replace method, which can be used to replace parts of the string with another string.

```
console.log("papa".replace("p", "m"));
// → mapa
```

The first argument can also be a regular expression, in which case the first match of the regular expression is replaced.

```
console.log("Borobudur".replace(/[ou]/, "a"));
// → Barobudur
console.log("Borobudur".replace(/[ou]/g, "a"));
// → Barabadar
```

When a “g” option (for “global”) is added to the regular expression, all matches in the string will be replaced, not just the first.

It would have been more sensible if this choice was made through an addition argument to replace, rather than through a property of the regular expression we pass it. (This is one of the poor interface choices that surround JavaScript regular expressions.)

The real power of using regular expressions with replace comes from the fact that we can refer back to the matched groups in the expression. For example, say we have a big string containing the names of people, one name per line, in the format Lastname, Firstname. If we want to swap these names and remove the comma to get a simple Firstname Lastname format, we can use the following code:

```
console.log(
  "Hopper, Grace\nMcCarthy, John\nRitchie, Dennis"
    .replace(/([\w ]+), ([\w ]+)/g, "$2 $1"));
// → Grace Hopper
//   John McCarthy
//   Dennis Ritchie
```

The $1 and $2 in the replacement string refer to the parenthesized parts in the pattern. $1 is replaced by the text that matched against the first pair of parentheses, $2 by the second, and so on, up to $9.

It is also possible to pass a function, rather than a string, as the second argument to replace. For each replacement, the function will be called with the matched groups (as well as the whole match) as arguments, and the value it returns will be inserted into the new string.

Here’s a simple example:

```
var s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)\b/g, function(str) {
  return str.toUpperCase();
}));
// → the CIA and FBI
```

And here’s another one:

```
var stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
  amount = Number(amount) - 1;
  if (amount == 1) // only one left, remove the 's'
    unit = unit.slice(0, unit.length - 1);
  else if (amount == 0)
    amount = "no";
  return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\w+)/g, minusOne));
// → no lemon, 1 cabbage, and 100 eggs
```

This takes a string, finds all occurrences of a number followed by an alphanumeric word, and returns a string wherein every such occurrence is decremented by one.

The (\d+) group ends up as the amount argument to the function, and the (\w+) group gets bound to unit. The function converts the amount to a number—which always works, since it matched \d+—and makes some adjustments in case there is only one or zero left.

## Greed

It isn’t hard to use replace to write a function that removes all comments from a piece of JavaScript code. Here is the first attempt:

```
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[\w\W]*\*\//g, "");
}
console.log(stripComments("1 + /* 2 */3"));
// → 1 + 3
console.log(stripComments("x = 10;// ten!"));
// → x = 10;
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1  1
```

The [\w\W] part is an (ugly) way to match any character. Remember that a dot will not match a newline character. Block comments can continue on a new line, so we can’t use a dot here. Matching something that is either a word character or not a word character will match all possible characters.

But the output of the last example appears to have gone wrong. Why?

The .* part of the expression, as I described in the section on backtracking, will first match as much as it can, and then, if that causes the part of the pattern after it to fail, move back one match at a time and try from there. In this case, we are first matching the whole rest of the string, and then moving back from there. It will find an occurrence of */ after going back four characters, and match that. This is not what we wanted—the intention was to match a single comment, not to go all the way to the end of the code and find the end of the last block comment.

There are two variants of the repetition operators in regular expressions (‘+’, ‘*’, and ‘{}’). By default, they are greedy, meaning they match as much as they can and backtrack back from there. If you put a question mark after them, they become non-greedy, and start by matching as little as possible, and only matching more then the remaining pattern does not fit with the smaller match.

And that is exactly what we want in this case. By having the star match the smallest stretch of characters that brings us to a */ closing marker, we consume one block comment, and nothing more.

```
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[\w\W]*?\*\//g, "");
}
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1 + 1
```

## Dynamically creating RegExp objects

There are cases where you might not know the exact pattern you need to match against when you are writing your code. Say you want to look for the user’s name in a piece of text, and enclose it in underscore characters to make it stand out. The name is only known when the program is actually running, so we can not use the slash-based notation.

But we can build up a string and use the RegExp constructor on that. For example:

```
var name = "harry";
var text = "Harry is a suspicious character.";
var regexp = new RegExp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// → _Harry_ is a suspicious character.
```

When creating the \b boundary markers, we have to use two backslashes, because we are writing them in a normal string, not a slash-enclosed regular expression. The options (global and case-insensitive) for the regular expression can be given as a second argument to the RegExp constructor.

But what if the name is "dea+hl[]rd" because our user is a nerdy teenager? That would cause us to produce a bogus regular expression, which will cause unexpected results.

To work around this, we can add backslashes before any character that we don’t trust. Adding backslashes before alphabetic characters is a bad idea, because things like \b and \n have a special meaning. But escaping everything that’s not alphanumeric or whitespace is safe.

```
var name = "dea+hl[]rd";
var text = "This dea+hl[]rd guy is quite annoying.";
var escaped = name.replace(/[^\w\s]/g, "\\$&");
var regexp = new RegExp("\\b(" + escaped + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// → This _dea+hl[]rd_ guy is quite annoying.
```

The $& placeholder in the replacement string acts similar to $1, but will be replaced by the whole match, rather than a matched group.

## The search method

The indexOf method on strings can not be called with a regular expression. But there is another method, search, which does expect a regular expression, and, like indexOf returns the first index on which the expression was found, or -1 when it wasn’t found.

```
console.log("  word".search(/\S/));
// → 2
console.log("    ".search(/\S/));
// → -1
```

Unfortunately, there is no way to indicate that the match should start at a given offset (as with the second argument to indexOf), which would often be very useful.

## The lastIndex property

The exec method also does not provide a convenient way to start searching from a given position in the string. But it does provide an inconvenient way.

Regular expression objects have properties (such as source, which contains the string that expression was created from). One such property, lastIndex, controls, in some limited circumstances, where the next match will start.

Those circumstances are that the regular expression must have the “global” (g) option enabled, and the match must happen through the exec method. Again, the same way would have been to just allow an extra argument to be passed to exec, but sanity is not a defining characteristic of JavaScript’s regular expression interface.

```
var pattern = /y/g;
pattern.lastIndex = 3;
var match = pattern.exec("xyzzy");
console.log(match.index);
// → 4
console.log(pattern.lastIndex);
// → 5
```

The lastIndex property is updated by the call to exec to point after the match, when the match was successful. When no match was found, lastIndex is set back to zero, which is also the value it has in a newly constructed regular expression object.

When using a global regular expressions value for multiple exec calls, this changing of the lastIndex property can cause problems—your regular expression might be accidentally starting at an index that was left over from a previous call.

Another interesting effect of the global option is that changes the way the match method on strings works. When called with a global expression, instead of returning an array similar to that returned by exec, match will find all matches of the pattern in the string, and return an array containing the matched strings.

```
console.log("Banana".match(/an/g));
// → ["an", "an"]
```

So be cautious with global regular expressions. The cases where they are necessary—calls to replace and places where you want to explicitly use lastIndex—are typically the only places where you want to use them.

A common pattern is to scan through all occurrences of a pattern in a string, with full access to matched groups and the index property, by using lastIndex and exec.

```
var input = "A text with 3 numbers in it... 42 and 88.";
var re = /\b(\d+)\b/g;
var match;
while (match = re.exec(input))
  console.log("Found", match[1], "at", match.index);
// → Found 3 at 12
//   Found 42 at 31
//   Found 88 at 38
```

This makes use of the fact that the value of an assignment (‘=’) expression is the assigned value. So by using match = re.exec(input) as the condition in the while statement, we both perform the match at the start of each iteration, save its result in a variable, and stop looping when no more matches are found.

## Parsing an ini file

Now let’s look at a real problem that calls for regular expressions. Imagine we are writing a program to automatically harvest information about our enemies from the Internet. (We will not actually write that program here, just the part that reads the configuration file. Sorry to disappoint.) This file looks like this:

```
searchengine=http://www.google.com/search?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; these are sections, concerning individual enemies
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[gargamel]
fullname=Gargamel
type=evil sorcerer
outputdir=/home/marijn/enemies/gargamel
```

The exact rules for this format (which is actually a widely used format, usually called an .ini file) are as follows:

	Blank lines and lines starting with semicolons are ignored.

	Lines wrapped in [ and ] start a new section.

	Lines containing an alphanumeric identifier followed by an = character add a setting to the current section.

	Anything else is invalid.

Our task is to convert a string like this into an array of objects, each with a name property and an array of name/value pairs. We’ll need one such object for each section and one for the section-less settings.

Since the format has to be processed line by line, splitting it up into separate lines is a good start. We’ve used the split method once before for this, as string.split("\n"). Some operating systems, however, use not just a newline character to separate lines but a carriage return character followed by a newline ("\r\n").

Given that the split method of strings also allows a regular expression as its argument, we can split on a regular expression like /\r?\n/ to split in a way that allows both "\n" and "\r\n" between lines.

```
function parseINI(string) {
  var categories = [];
  function newCategory(name) {
    var cat = {name: name, fields: []};
    categories.push(cat);
    return cat;
  }
  var currentCategory = newCategory("TOP");

  string.split(/\r?\n/).forEach(function(line) {
    var match;
    if (/^\s*(;.*)?$/.test(line))
      return;
    else if (match = line.match(/^\[(.*)\]$/))
      currentCategory = newCategory(match[1]);
    else if (match = line.match(/^(\w+)=(.*)$/))
      currentCategory.fields.push({name: match[1],
                                   value: match[2]});
    else
      throw new Error("Line '" + line + "' is invalid.");
  });

  return categories;
}
```

The code goes over every line in the file. It keeps a “current category” object, and when it finds a normal directive, it adds it to this object. When it encounters a line that starts a new category, it replaces the current category with a new one, to which subsequent directives will get added. Finally, it returns an array containing all the categories it came across.

Note the recurring use of ^ and $ to make sure the expression matches the whole line, not just part of it. Leaving these out is a common mistake, which results in code that mostly works but behaves strangely for some input.

The expression /^\s*(;.*)?$/ can be used to test for lines that can be ignored. Do you see how it works? The part between the parentheses will match comments, and the ? after that will make sure it also matches lines with only whitespace.

The pattern if (match = string.match(...)) is similar to the trick where I used an assignment as the condition for while before. You usually aren’t sure that your expression will match. But you only want to do something with the resulting match array if it not null, so you need to test for that first. To not break the pleasant chain of if forms, we can assign this result to a variable as the test for if and do the matching and the testing in a single line.

## International characters

Due to an initial simplistic implementation and the fact that this simplistic approach was later set in stone as standard behavior, JavaScript’s regular expressions are rather dumb about characters that do not appear in the English language. For example “word” characters, in this context, actually means the 26 characters in the Latin alphabet, their upper-case variants, and, for some reason, the underscore character. Things like “é” or “β”, which most definitely are word characters, will not match \w (and will match upper-case \W).

Through strange historical accident, \s (whitespace) is different, and will match all characters that the Unicode standard considers whitespace, such as a non-breaking space or a Mongolian vowel separator.

Some regular expression implementations in other programming languages have syntax to match specific Unicode character categories, such as all uppercase letters, all punctuation, control characters, or similar. There are plans to add support to this to JavaScript, but they unfortunately look like they won’t be realized in the near future.

## Summary

Regular expressions are objects that represent patterns in strings. They use their own syntax for expressing these patterns.

	/abc/	Sequence of characters
	/[abc]/	Any character from a set of characters
	/[^abc]/	Any character not in a set of characters
	/[0-9]/	Any character in a range of characters
	/x+/	One or more occurrences of a pattern
	/x+?/	One or more occurrences, non-greedy
	/x*/	Zero or more occurrences
	/x?/	Zero or one occurrence
	/x{2,4}/	Between two and four occurrences
	/(abc)+/	Grouping
	/a|b|c/	Alternative patterns
	/\d/	Digit characters
	/\w/	Alphanumeric characters (“word characters”)
	/\s/	Whitespace characters
	/./	All characters except newlines
	/\b/	Word boundary
	/^/	Start of input
	/$/	End of input

A regular expression has a method test to test whether a given string matches it, and a method exec which, when a match is found, returns an array containing all matched groups and an index property that indicates where the match started.

Strings have a match method to match them against a regular expression, and a search method to search for one. Their replace method can replace matches of a pattern with a replacement string. Alternatively, a function can be passed that builds up a replacement based on the match text and matched groups.

Regular expressions can have options (flags), which are written after the closing slash. The ‘i’ option makes the match case-insensitive, and the ‘g’ flag makes the expression global which, among other things, causes the replace method to replace all instances instead of just the first.

The RegExp constructor can be used to create a regular expression value from a string.

Regular expressions are a sharp tool with an awkward handle. They’ll simplify some simple tasks tremendously, but quickly become unmanageable when applied to more complex tasks. Knowing when to use them is useful. Part of knowing how to use them is knowing when to give up on them and switch to a more explicit approach.

## Exercises

It is almost unavoidable that, in the course of working on these, you will be confused and frustrated by some regular expression’s inexplicable behavior. What sometimes helps is entering your expression into an online tool like debuggex.com, to see whether its visualization corresponds to what you intended, and to quickly see how it responds to various input strings.

## Regex golf

“Code golf” is a term used for the game of trying to express a particular program in as few characters as possible. Similarly, regex golf is the practice of writing as tiny a regular expression as possible to match a given pattern (and only that pattern).

Write regular expressions that tests whether any of the sub-strings given occur in a string. The regular expression should match only strings containing one the sub-strings described. Do not worry about word boundaries unless explicitly mentioned. When your expression works, see if you can make it any smaller.

	“car” and “cat”
	“pop” and “prop”
	“ferret”, “ferry”, and “ferrari”
	Any word ending in “ious”
	A whitespace character followed by a dot, comma, colon, or semicolon
	A word longer than 6 letters
	A word without the letter “e”

Refer back to the table in the chapter summary to quickly look something up. Test each solution out with a few test strings.

```
// Fill in the regular expressions

verify(/.../,
       ["my car", "bad cats"],
       ["camper", "high art"]);

verify(/.../,
       ["pop culture", "mad props"],
       ["plop"]);

verify(/.../,
       ["ferret", "ferry", "ferrari"],
       ["ferrum", "transfer A"]);

verify(/.../,
       ["how delicious", "spacious room"],
       ["ruinous", "consciousness"]);

verify(/.../,
       ["bad punctuation ."],
       ["escape the dot"]);

verify(/.../,
       ["hottentottententen"],
       ["no", "hotten totten tenten"]);

verify(/.../,
       ["red platypus", "wobbling nest"],
       ["earth bed", "learning ape"]);


function verify(regexp, yes, no) {
  // Ignore unfinished tests
  if (regexp.source == "...") return;
  yes.forEach(function(s) {
    if (!regexp.test(s))
      console.log("Failure to match '" + s + "'");
  });
  no.forEach(function(s) {
    if (regexp.test(s))
      console.log("Unexpected match for '" + s + "'");
  });
}
```

## Quoting style

Imagine you have written a text, and used single quotation marks throughout. Now you want to replace all those that actually quote a piece of text with double quotes, but not the ones used in contractions like “aren’t”.

Think of a pattern that distinguishes these two kind of quote usage and craft a call to the replace method that does the proper replacement.

```
var text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
console.log(text.replace(/A/, "B"));
// → "I'm the cook," he said, "it's my job."
```

display hints

The most obvious solution is to only replace quotes that are not surrounded by two word characters. The first expression that comes to mind is /\W'\W/, but you need to be careful to handle the start and end of the string correctly. This can be done by using the ‘^’ and ‘$’ markers, as in /(\W|^)'(\W|$)/.

### Numbers again

Series of digits can be matched by the pleasantly simple regular expression /\d+/.

Write an expression that matches (only) JavaScript-style numbers. That means it must support an optional minus or plus sign in front of the number, the decimal dot, and exponent notation—5e-3 or 1E10—with again an optional sign in front of the exponent.

```
// Fill in this regular expression.
var number = /^...$/;

// Tests:
["1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4",
 "1e+12"].forEach(function(s) {
  if (!number.test(s))
    console.log("Failed to match '" + s + "'");
});
["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5",
 "."].forEach(function(s) {
  if (number.test(s))
    console.log("Incorrectly accepted '" + s + "'");
});
```

display hints
First, do not forget the backslash in front of the dot.

Matching the optional sign in front of the number, as well as in front of the exponent, can be done with [+\-]? or (+|-|) (plus, minus, or nothing).

The more complicated part of the exercise is probably the problem of matching both "5." and ".5" without also matching ".". For this, I’ve found the best solution is to use the ‘|’ operator to separate the two cases out—either one or more digits optionally followed by a dot and zero or more digits, or a dot followed by one or more digits.

Finally, to make the “e” case-insensitive, either add an “i” option to the regular expression, or use [eE].
