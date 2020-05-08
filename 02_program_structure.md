# Estrutura do Programa

{{quote {author: "_why", title: "Guia (Pungente) para Ruby do Why", chapter: true}

>E meu coração brilha vívido vermelho sob minha pele transparente, translúcida e eles têm que administrar 10cc
de JavaScript para me fazer voltar. 
(Eu respondo bem à toxinas em meu sangue.) Cara, essa coisa vai chutar os pêssegos para fora de suas brânquias!

quote}}

{{index why, "Poignant Guide"}}

{{figure {url: "img/chapter_picture_2.jpg", alt: "Imagem de tentáculos segurando objetos", chapter: framed}}}

Nesse capítulo, nós vamos começar a fazer coisas que podem realmente serem chamadas _programação_. 
Nós vamos expandir nosso domínio da linguagem JavaScript para além dos fragmentos de 
nomes e frases que nós vimos até agora, até o ponto onde poderemos expressar uma prosa significativa.

## Expressões e declarações

{{index grammar, [syntax, expression], [code, "structure of"], grammar, [JavaScript, syntax]}}

No [Capítulo 1](values), nós fizemos valores e aplicamos operadores a eles para obtermos novos valores. 
Criando valores como esses é a essência de qualquer programa JavaScript. 
Mas essa essência deve ser enquadrada em uma estrutura maior para ser útil. Então é isso que abordaremos a seguir.

{{index "literal expression", [parentheses, expression]}}

Um fragmento de código que produz um valor é chamado de
_((expressão))_. Todo valor que é escrito literalmente (assim como `22`
ou `"psicanálise"`) é uma expressão. Uma expressão entre
parênteses também é uma expressão, assim como um ((operador binário))
aplicado à duas expressões ou um ((operador unário)) aplicado à uma.

{{index [nesting, "of expressions"], "human language"}}

Isso mostra parte da beleza de uma interface baseada em linguagem.
Expressões podem conter outras expressões de forma similar à como subfrases 
na linguagem humana são aninhadas.—uma subfrase pode conter sua própria subfrase, e assim por diante. 
Isso nos permite criar expressões que descrevem cálculos arbitráriamente complexos.

{{index statement, semicolon, program}}

Se uma expressão corresponde à um fragmento de expressãot, uma _declaração_ JavaScript
corresponde à uma expressão completa. Um programa é uma lista de declarações.

{{index [syntax, statement]}}

A declaração mais simples é uma expressão com um ponto-e-vírgula após ela. Isso é um programa:

```
1;
!false;
```

É um programa inútil, entretanto. Uma ((expressão)) pode se contentar apenas por produzir um valor, 
que pode então ser usado pelo código anexo. Uma ((declaração)) se sustenta sozinha, 
então ela se equivale a algo apenas se afetar o mundo. 
Ela poderia exibir algo na tela— que conta enquanto muda o mundo— ou poderia alterar o 
estado interno da máquina de uma forma que irá afetar as declarações que vierem depois dela. 
Essas mudanças são chamadas _((efeito(s) colateral))is_. 
As declarações no exemplo anterior apenas produz os valores `1` e `true` e então, imediatamente, os joga fora. 
Isso não deixa nenhuma impressão no mundo. Quando você executar esse programa, nada observável acontece.

{{index "programming style", "automatic semicolon insertion", semicolon}}

Em alguns casos, JavaScript te permite omitir o ponto-e-vírgula ao final de uma declaração. 
Em outros casos, ele tem que estar ali, ou a próxima ((linha)) será tratada como parte da mesma declaração. 
As regras para quando for seguro omití-lo seão de alguma forma complexas e passíveis de erro. 
Então, nesse livro, toda declaração que necessitar de um pont-e-vírgula sempre receberá um. 
Eu recomento você fazer o mesmo, pelo menos até você aprender mais sobre a sutileza das ausências do ponto-e-vírgula.

## Ligações/Variáveis

{{indexsee variable, binding}}
{{index [syntax, statement], [binding, definition], "side effect", [memory, organization], [state, in binding]}}

Como um programa mantém um estado interno? Como ele se lembra das coisas?
Nós vimos como produzir novos valores à partir de valores antigos,
mas isso não altera os valores antigos, e o novo valor deve ser
imediatamente usado ou irá se dissipar novamente. Para capturar e manter valores,
JavaScript nos dá uma coisa chamada de _ligação_, ou _variável_:

```
let caught = 5 * 5;
```

{{index "let keyword"}}

Essa é a segunda forma de ((declaração)). A palavra especial
(_((paravra-chave))_) `let` indica que essa declaração irá definir
uma ligação. É seguida pelo nome da ligação e, se quisermos
imediatamente definir um valor, por um operador `=` e uma expressão.

A declaração anterior cria uma ligação chamada `caught` e a usa para
capturar o numero que é produzido pela multiplicação 5 por 5.

Após uma ligação ser definira, seu nome pode ser usado como uma
((expressão)). O valor de tal expressão é o valor que a ligação atualmente mantém
Aqui está um exemplo:

```
let ten = 10;
console.log(ten * ten);
// → 100
```

{{index "= operator", assignment, [binding, assignment]}}

Quando uma ligação aponta para um valor, não significa que ela está amarrada àquele valor
para sempre. O operador `=` pode ser usado a qualquer momento em
ligações existentes para desconectá-las de seu valor atual e apontá-las
para um novo.

```
let mood = "light";
console.log(mood);
// → light
mood = "dark";
console.log(mood);
// → dark
```

{{index [binding, "model of"], "tentacle (analogy)"}}

Você deveria imaginar ligações como tentáculos, invés de caixas.
Elas não _contém_ valores; elas _pegam_ eles—duas ligações podem se referir ao
mesmo valor. Um programa pode acessar apenas os valores que ainda possui referência. 
Quando você necessita lembrar de algo, você produz um tentáculo para se agarrar a isso
ou você reatribui um de seus tentáculos existentes à isso.

Vamos observar para um outro exemplo. Para se lembrar o numero de dólares que
Luigi ainda deve à você, você cria uma ligação. E então ele te paga
$35, você atribui à essa ligação o novo valor.

```
let luigisDebt = 140;
luigisDebt = luigisDebt - 35;
console.log(luigisDebt);
// → 105
```

{{index undefined}}

Quando você define uma ligação sem atribur um valor à ela, o tentáculo
não possui nada para agarrar, então ele termina vazio. Se você perguntar pelo
valor de uma ligação vazia, você irá receber o valor `undefined`.

{{index "let keyword"}}

Uma única declaração pode definir multiplas ligações. A
definição de ser separada por vígulas.

```
let one = 1, two = 2;
console.log(one + two);
// → 3
```

As palavras `var` e `const` também podem ser usadas para criar ligações,
de uma forma similar ao `let`.

```
var name = "Ayda";
const greeting = "Hello ";
console.log(greeting + name);
// → Hello Ayda
```

{{index "var keyword"}}

O primeiro, `var` (abreviação para "variável"), é a forma como as ligações
eram declaradas no JavaScript pre-2015. Eu irei precisar como ela difere de `let`
no [próximo capítulo](functions). Por enquanto,
se lembre que elas básicamente fazem a mesma coisa, mas nós raramente a usaremos nesse livro
porque ela possui algumas propriedades confusas.

{{index "const keyword", naming}}

A palavra `const` significa _((constante))_. Ela define uma ligação constante,
a qual aponta para um mesmo valor pelo tempo que ela viver. Isso é útil para ligações
que dão nome para um valor para que você possa se referenciar a ele posteriormente.

## Nomes das ligações/variáveis

{{index "underscore character", "dollar sign", [binding, naming]}}

Nomes de ligações podem ser qualquer palavra. Dígitos podem ser parte do nome da ligação
—`catch22` é um nome válido, por exemplo— mas o nome não deve começar com um dígito.
O nome de uma ligação pode incluir sinal de dólar (`$`) ou
underlines (`_`) mas nenhuma outra pontuação ou carácter especial.

{{index [syntax, identifier], "implements (reserved word)", "interface (reserved word)", "package (reserved word)", "private (reserved word)", "protected (reserved word)", "public (reserved word)", "static (reserved word)", "void operator", "yield (reserved word)", "enum (reserved word)", "reserved word", [binding, naming]}}

Palavras com significado especial, assim como `let`, são _((palavra-chave))s_, e
elas não devem ser usadas como nomes de ligações. Também existem uma quantidade de palavras
que são "reservadas para uso" em ((futuras)) versões do
JavaScript, que também não podem ser usadas como nomes de ligações. A lista completa
de palavras-chave e palavras reservadas é um tanto longa.

```{lang: "text/plain"}
break case catch class const continue debugger default
delete do else enum export extends false finally for
function if implements import interface in instanceof let
new package private protected public return static super
switch this throw true try typeof var void while with yield
```

{{index [syntax, error]}}
Não se preocupe em memorizar essa lista. Quando ao criar uma ligação poduzir o erro  
_unexpected syntax_, verifique se você está tentando definir uma palavra reservada.

## O Ambiente

{{index "standard environment", [browser, environment]}}

A coleção de ligações e seus valores que existem em um determinado momento
é chamado de _((ambiente))_. Quando um programa inicia, esse ambiente
néo é vazio. Ele sempre contém ligações que são parte da linguagem
((padrão)), e na marioria das vezes, ele também possui ligações que fornecem formas
de interagir com o sistema que o cerca. Por exempo, em um navegador, existem funções para
interagir com o website aaualmente carregado e para ler as entradas do ((mouse)) e ((teclado)).

## Funções

{{indexsee "application (of functions)", [function, application]}}
{{indexsee "invoking (of functions)", [function, application]}}
{{indexsee "calling (of functions)", [function, application]}}
{{index output, function, [function, application], [browser, environment]}}

Uma grande quantidade de valores providos no ambiente padrão possuem o tipo
_((função))_. Uma função é um pedaço do programa embrulhado em um valor.
Tais valores podem ser _aplicados_ na intenção de executar o programa embrulhado.
Por exemplo, no ambiente de um navegador, a ligação `prompt` possui uma função que exibe
uma pequena ((caixa de diálogo) solicitando ao usuário uma entrada.
Ele é usado dessa forma:

```
prompt("Enter passcode");
```

{{figure {url: "img/prompt.png", alt: "A prompt dialog", width: "8cm"}}}

{{index parameter, [function, application], [parentheses, arguments]}}

Executar uma função é chamado _invoking_, _calling_, ou _applying_ (no português: _invocar_, _chamar_ ou _aplicar_)
Você pode chamar uma função ao colocar parentêses após a expressão que produz o valor da expressão.
Normalmente você vai usar diretamente o nome da ligação que possui a função. 
Os valores entre os parênteses são dados ao programa dentro da função.
No exemplo, a função `prompt` usa a _"string"_ que fornecemos à ela como o
texto a ser exibido na caixa de diálogo. Valores dados às funções são chamados
_((argumento))s_. Diferentes funções devem precisar de uma quantidade diferente ou
diferentes tipos de argumentos.

A função `prompt` não é muito usada na programação web moderna,
principalmente porque você não tem controle sobre como visual do diálogo resultante irá parecer,
mas pode ser útil em programas de teste e experimentos.

## A função console.log

{{index "JavaScript console", "developer tools", "Node.js", "console.log", output, [browser, environment]}}

Nos exemplos, Eu usei `console.log` para saída de valores. A maioria dos sistemas JavaScript
(incluindo todos os navegadores modernos e Node.js) fornece uma função
`console.log` que escreve seus argumentos para _algum_ dispositivo de saída de texto.
Em navegadores, a saída repousa no ((console JavaScript)).
Essa parte da interface dos navegadores é escondida por padrão,
mas a maioria dos navegadores a exibem quando você pressiona F12 ou, em um Mac, 
but most browsers open it when you press F12 or, on a Mac, [command]{keyname}-[option]{keyname}-I.
Se isso não funcionar, procure através dos menus por um item chamado Ferramentas de Desenvolvedor ou similar.

{{if interactive

Quando executando os exemplos (ou seu próprio código) nas páginas desse livro,
a saída  `console.log` será mostrada após o exemplooutput will be shown after the example, ou invés do console
JavaScript do navegador.

```
let x = 30;
console.log("the value of x is", x);
// → the value of x is 30
```

if}}

{{index [object, property], [property, access]}}

Embora nomes de ligações não possam conter ((ponto-final))is,
`console.log` possui um. Isso porque `console.log` não é uma simples ligação. 
Ela é na verdade uma expressão que recupera a propriedade `log` do valor guardado pela ligação `console`.
Nós vamos descobrir exatamente o que isso significa no [Chapter ?](data#properties).

{{id return_values}}
## Retorno de valores

{{index [comparison, "of numbers"], "return value", "Math.max function", maximum}}

Exibir uma caixa de diálogo ou escever um texto na tela é um
_((efeito colateral))_. Muitas funções são uteis por causa dos efeitos colaterais
que elas produzem. Funções também podem produzir valores, nesse caso elas
não necessitam de um efeito colateral para serem uteis. Por exemplo, a
função `Math.max` recebe qualquer quantidade de argumentos numéricos e retorna
o maior.

```
console.log(Math.max(2, 4));
// → 4
```

{{index [function, application], minimum, "Math.min function"}}

Quando uma função produz um valor, dizemos que ela irá _retornar_ aquele valor.
Qualquer coisa que produz um valor é uma ((expressão)) no JavaScript,
o que significa que chamadas de funções podem ser usadas dentro de expressões maiores.
Aqui uma chamada para `Math.min`, que é o oposto de `Math.max`, é usada como 
parte de uma expressão de soma:

```
console.log(Math.min(2, 4) + 100);
// → 102
```

O [próximo capítulo](functions) explica como escrever suas próprias funções.

## Controle de fluxo

{{index "execution order", program, "control flow"}}

Quando seu programa contém mais de uma ((declaração)), as declarações
são executadas como se fossem uma história, de cima para baixo. Esse exemplo de programa
possui duas declarações. A primeira pede um número ao usuário, e a segunda,
que é executada após a primeira, exibe o ((quadrado)) daquele número.

```
let theNumber = Number(prompt("Pick a number"));
console.log("Your number is the square root of " +
            theNumber * theNumber);
```

{{index [number, "conversion to"], "type coercion", "Number function", "String function", "Boolean function", [Boolean, "conversion to"]}}

A função `Number` converte o valor para um número. Nós precisamos dessa
conversão pois o resultado da função `prompt` é um valor do tipo _string_, e nós
queremos um número. Existem funções similares chamadas `String` e `Boolean`
que convertem valores para esses tipos.

Aqui está uma representação esquemática mais comum do controle de fluxo em linha reta:

{{figure {url: "img/controlflow-straight.svg", alt: "Controle de fluxo comum", width: "4cm"}}}

## Execução condicional

{{index Boolean, ["control flow", conditional]}}

Nem todos os programas são estradas retas. Nós podemos, por exemplo, querer
criar uma estrada ramificada, onde o progama pega o ramo apropriado
baseado na situação em que se encontra. Isso é chamado de _((execução condional))_.

{{figure {url: "img/controlflow-if.svg", alt: "Controle de fluxo condicional",width: "4cm"}}}

{{index [syntax, statement], "Number function", "if keyword"}}

Execução condicional é criada com a palavra-chave `if` no JavaScript.
No simples caso, nós queremos que o código seja executado se, e somente se,
uma certa condição for atendida. Podemos, por exemplo, querer exibir o quadrado de uma entrada
apenas se a entrada for realmente um número.

```{test: wrap}
let theNumber = Number(prompt("Pick a number"));
if (!Number.isNaN(theNumber)) {
  console.log("Your number is the square root of " +
              theNumber * theNumber);
}
```

Com essa modificação, se você inserir "parrot", nenhuma saída é exibida.

{{index [parentheses, statement]}}

A palavra-chave `if` executa ou evita uma declaração dependendo do valor de uma
expressão Booleana. A expressão decisiva é escrita após a palavra-chave, entre parentêses, seguida por
uma declaração para executar.

{{index "Number.isNaN function"}}

A função `Number.isNaN` é uma função padrão do JavaScript que
retorna `true` apenas se o argumento que é dado é `NaN`. A função `Number`
retorna `NaN` quando você passa para ela uma _string_ que não representa um número válido.
Portanto, a condição é traduzida para
"a menos que `theNumber` seja _not-a-number_, faça isso".

{{index grouping, "{} (block)", [braces, "block"]}}

A declaração após o `if` é envolvido por chaves (`{` e `}`)
nesse exemplo. As chaves podem ser usadas para agrupar qualquer quantidade de declarações
em uma única declaração, chamado de _((bloco))_. Você poderia também
ter omitido elas nesse caso, desde que elas possuíssem apenas uma declaração,
mas para evitarmos termos que pensar sobre se são necessárias, a maioria dos programadores JavaScript usam elas em todos as
declarações em bloco como essa. Nós iremos seguir essa conveção nesse livro,
exceto pela ocasional declaração de linha única.

```
if (1 + 1 == 2) console.log("It's true");
// → It's true
```

{{index "else keyword"}}

Você frequentemente não vai querer um código que apenas execute quando uma condição
retornar verdadeira, mas também um código que cuida do outro caso. Esse caminho alternattivo
é representado pela segunta flecha do diagrama. Você pode usar a palava-chave `else`, junto com `if`, para criar dois caminhos
de execução, separados, alternativos.

```{test: wrap}
let theNumber = Number(prompt("Pick a number"));
if (!Number.isNaN(theNumber)) {
  console.log("Your number is the square root of " +
              theNumber * theNumber);
} else {
  console.log("Hey. Why didn't you give me a number?");
}
```

{{index ["if keyword", chaining]}}

Se você possui mais que dois caminhos para escolher, você pode "encadear" multiplos pares de`if`/`else` juntos.
Segue um exemplo:

```
let num = Number(prompt("Pick a number"));

if (num < 10) {
  console.log("Small");
} else if (num < 100) {
  console.log("Medium");
} else {
  console.log("Large");
}
```
O programa vai primeiro checar se `num` é menos que 10. Se for,
ele irá escolher essa ramificação, mostre `"Small"`, e pronto. Se não for,
ele irá pegar a ramificação do `else`, que contém um segundo `if`. Se a segunda
condição (`< 100`) for satisfeita, isso significa que o número esté entre 10 e 100, e `Medium` é exibido.
Se não, a segunda e última ramificação `else` é escolhida.

O esquema para esse programa se parece como algo assim:

{{figure {url: "img/controlflow-nested-if.svg", alt: "Nested if control flow", width: "4cm"}}}

{{id loops}}
## Loops While e Do

Consider a program that outputs all ((even number))s from 0 to 12. One
way to write this is as follows:

```
console.log(0);
console.log(2);
console.log(4);
console.log(6);
console.log(8);
console.log(10);
console.log(12);
```

{{index ["control flow", loop]}}

That works, but the idea of writing a program is to make something
_less_ work, not more. If we needed all even numbers less than 1,000,
this approach would be unworkable. What we need is a way to run a
piece of code multiple times. This form of control flow is called a
_((loop))_.

{{figure {url: "img/controlflow-loop.svg", alt: "Loop control flow",width: "4cm"}}}

{{index [syntax, statement], "counter variable"}}

Looping control flow allows us to go back to some point in the program
where we were before and repeat it with our current program state. If
we combine this with a binding that counts, we can do something like
this:

```
let number = 0;
while (number <= 12) {
  console.log(number);
  number = number + 2;
}
// → 0
// → 2
//   … etcetera
```

{{index "while loop", Boolean, [parentheses, statement]}}

A ((statement)) starting with the keyword `while` creates a loop. The
word `while` is followed by an ((expression)) in parentheses and
then a statement, much like `if`. The loop keeps entering that
statement as long as the expression produces a value that gives `true`
when converted to Boolean.

{{index [state, in binding], [binding, as state]}}

The `number` binding demonstrates the way a ((binding)) can track the
progress of a program. Every time the loop repeats, `number` gets a
value that is 2 more than its previous value. At the beginning of
every repetition, it is compared with the number 12 to decide whether
the program's work is finished.

{{index exponentiation}}

As an example that actually does something useful, we can now write a
program that calculates and shows the value of 2^10^ (2 to the 10th
power). We use two bindings: one to keep track of our result and one
to count how often we have multiplied this result by 2. The loop tests
whether the second binding has reached 10 yet and, if not, updates
both bindings.

```
let result = 1;
let counter = 0;
while (counter < 10) {
  result = result * 2;
  counter = counter + 1;
}
console.log(result);
// → 1024
```

The counter could also have started at `1` and checked for `<= 10`,
but for reasons that will become apparent in [Chapter
?](data#array_indexing), it is a good idea to get used to
counting from 0.

{{index "loop body", "do loop", ["control flow", loop]}}

A `do` loop is a control structure similar to a `while` loop. It
differs only on one point: a `do` loop always executes its body at
least once, and it starts testing whether it should stop only after
that first execution. To reflect this, the test appears after the body
of the loop.

```
let yourName;
do {
  yourName = prompt("Who are you?");
} while (!yourName);
console.log(yourName);
```

{{index [Boolean, "conversion to"], "! operator"}}

This program will force you to enter a name. It will ask again and
again until it gets something that is not an empty string. Applying
the `!` operator will convert a value to Boolean type before negating
it, and all strings except `""` convert to `true`. This means the loop
continues going round until you provide a non-empty name.

## Identação do código

{{index [code, "structure of"], [whitespace, indentation], "programming style"}}

In the examples, I've been adding spaces in front of statements that
are part of some larger statement. These spaces are not required—the computer
will accept the program just fine without them. In fact, even the
((line)) breaks in programs are optional. You could write a program as
a single long line if you felt like it.

The role of this ((indentation)) inside ((block))s is to make the
structure of the code stand out. In code where new blocks are opened
inside other blocks, it can become hard to see where one block ends
and another begins. With proper indentation, the visual shape of a
program corresponds to the shape of the blocks inside it. I like to
use two spaces for every open block, but tastes differ—some people use
four spaces, and some people use ((tab character))s. The important
thing is that each new block adds the same amount of space.

```
if (false != true) {
  console.log("That makes sense.");
  if (1 < 2) {
    console.log("No surprise there.");
  }
}
```

Most code ((editor)) programs[ (including the one in this book)]{if
interactive} will help by automatically indenting new lines the proper
amount.

## For Loops

{{index [syntax, statement], "while loop", "counter variable"}}

Many loops follow the pattern shown in the `while` examples. First a
"counter" binding is created to track the progress of the loop. Then
comes a `while` loop, usually with a test expression that checks whether the
counter has reached its end value. At the end of the loop body, the
counter is updated to track progress.

{{index "for loop", loop}}

Because this pattern is so common, JavaScript and similar languages
provide a slightly shorter and more comprehensive form, the `for`
loop.

```
for (let number = 0; number <= 12; number = number + 2) {
  console.log(number);
}
// → 0
// → 2
//   … etcetera
```

{{index ["control flow", loop], state}}

This program is exactly equivalent to the
[earlier](program_structure#loops) even-number-printing example. The
only change is that all the ((statement))s that are related to the
"state" of the loop are grouped together after `for`.

{{index [binding, as state], [parentheses, statement]}}

The parentheses after a `for` keyword must contain two
((semicolon))s. The part before the first semicolon _initializes_ the
loop, usually by defining a binding. The second part is the
((expression)) that _checks_ whether the loop must continue. The final
part _updates_ the state of the loop after every iteration. In most
cases, this is shorter and clearer than a `while` construct.

{{index exponentiation}}

This is the code that computes 2^10^ using `for` instead of `while`:

```{test: wrap}
let result = 1;
for (let counter = 0; counter < 10; counter = counter + 1) {
  result = result * 2;
}
console.log(result);
// → 1024
```

## Saindo de um Loop

{{index [loop, "termination of"], "break keyword"}}

Having the looping condition produce `false` is not the only way a
loop can finish. There is a special statement called `break` that has
the effect of immediately jumping out of the enclosing loop.

This program illustrates the `break` statement. It finds the first number
that is both greater than or equal to 20 and divisible by 7.

```
for (let current = 20; ; current = current + 1) {
  if (current % 7 == 0) {
    console.log(current);
    break;
  }
}
// → 21
```

{{index "remainder operator", "% operator"}}

Using the remainder (`%`) operator is an easy way to test whether a
number is divisible by another number. If it is, the remainder of
their division is zero.

{{index "for loop"}}

The `for` construct in the example does not have a part that checks
for the end of the loop. This means that the loop will never stop
unless the `break` statement inside is executed.

If you were to remove that `break` statement or you accidentally write
an end condition that always produces `true`, your program would get
stuck in an _((infinite loop))_. A program stuck in an infinite loop
will never finish running, which is usually a bad thing.

{{if interactive

If you create an infinite loop in one of the examples on these pages,
you'll usually be asked whether you want to stop the script after a
few seconds. If that fails, you will have to close the tab that you're
working in, or on some browsers close your whole browser, to recover.

if}}

{{index "continue keyword"}}

The `continue` keyword is similar to `break`, in that it influences
the progress of a loop. When `continue` is encountered in a loop body,
control jumps out of the body and continues with the loop's next
iteration.

## Atualizando ligações resumidamente

{{index assignment, "+= operator", "-= operator", "/= operator", "*= operator", [state, in binding], "side effect"}}

Especially when looping, a program often needs to "update" a binding
to hold a value based on that binding's previous value.

```{test: no}
counter = counter + 1;
```

JavaScript provides a shortcut for this.

```{test: no}
counter += 1;
```

Similar shortcuts work for many other operators, such as `result *= 2`
to double `result` or `counter -= 1` to count downward.

This allows us to shorten our counting example a little more.

```
for (let number = 0; number <= 12; number += 2) {
  console.log(number);
}
```

{{index "++ operator", "-- operator"}}

For `counter += 1` and `counter -= 1`, there are even shorter
equivalents: `counter++` and `counter--`.

## Enviando um valor com *switch*

{{index [syntax, statement], "conditional execution", dispatch, ["if keyword", chaining]}}

It is not uncommon for code to look like this:

```{test: no}
if (x == "value1") action1();
else if (x == "value2") action2();
else if (x == "value3") action3();
else defaultAction();
```

{{index "colon character", "switch keyword"}}

There is a construct called `switch` that is intended to express such
a "dispatch" in a more direct way. Unfortunately, the syntax
JavaScript uses for this (which it inherited from the C/Java line of
programming languages) is somewhat awkward—a chain of `if` statements
may look better. Here is an example:

```
switch (prompt("What is the weather like?")) {
  case "rainy":
    console.log("Remember to bring an umbrella.");
    break;
  case "sunny":
    console.log("Dress lightly.");
  case "cloudy":
    console.log("Go outside.");
    break;
  default:
    console.log("Unknown weather type!");
    break;
}
```

{{index fallthrough, "break keyword", "case keyword", "default keyword"}}

You may put any number of `case` labels inside the block opened by
`switch`. The program will start executing at the label that
corresponds to the value that `switch` was given, or at `default` if
no matching value is found. It will continue executing, even across
other labels, until it reaches a `break` statement. In some cases,
such as the `"sunny"` case in the example, this can be used to share
some code between cases (it recommends going outside for both sunny
and cloudy weather). But be careful—it is easy to forget such a
`break`, which will cause the program to execute code you do not want
executed.

## Capitalização

{{index capitalization, [binding, naming], [whitespace, syntax]}}

Binding names may not contain spaces, yet it is often helpful to use
multiple words to clearly describe what the binding represents. These
are pretty much your choices for writing a binding name with several
words in it:

```{lang: null}
fuzzylittleturtle
fuzzy_little_turtle
FuzzyLittleTurtle
fuzzyLittleTurtle
```

{{index "camel case", "programming style", "underscore character"}}

The first style can be hard to read. I rather like the look of the
underscores, though that style is a little painful to type. The
((standard)) JavaScript functions, and most JavaScript programmers,
follow the bottom style—they capitalize every word except the first.
It is not hard to get used to little things like that, and code with
mixed naming styles can be jarring to read, so we follow this
((convention)).

{{index "Number function", constructor}}

In a few cases, such as the `Number` function, the first letter of a
binding is also capitalized. This was done to mark this function as a
constructor. What a constructor is will become clear in [Chapter
?](object#constructors). For now, the important thing is not
to be bothered by this apparent lack of ((consistency)).

## Comentários

{{index readability}}

Often, raw code does not convey all the information you want a program
to convey to human readers, or it conveys it in such a cryptic way
that people might not understand it. At other times, you might just
want to include some related thoughts as part of your program. This is
what _((comment))s_ are for.

{{index "slash character", "line comment"}}

A comment is a piece of text that is part of a program but is
completely ignored by the computer. JavaScript has two ways of writing
comments. To write a single-line comment, you can use two slash
characters (`//`) and then the comment text after it.

```{test: no}
let accountBalance = calculateBalance(account);
// It's a green hollow where a river sings
accountBalance.adjust();
// Madly catching white tatters in the grass.
let report = new Report();
// Where the sun on the proud mountain rings:
addToReport(accountBalance, report);
// It's a little valley, foaming like light in a glass.
```

{{index "block comment"}}

A `//` comment goes only to the end of the line. A section of text
between `/*` and `*/` will be ignored in its entirety, regardless of
whether it contains line breaks. This is useful for adding blocks of
information about a file or a chunk of program.

```
/*
  I first found this number scrawled on the back of an old notebook.
  Since then, it has often dropped by, showing up in phone numbers
  and the serial numbers of products that I've bought. It obviously
  likes me, so I've decided to keep it.
*/
const myNumber = 11213;
```

## Sumário

You now know that a program is built out of statements, which
themselves sometimes contain more statements. Statements tend to
contain expressions, which themselves can be built out of smaller
expressions.

Putting statements after one another gives you a program that is
executed from top to bottom. You can introduce disturbances in the
flow of control by using conditional (`if`, `else`, and `switch`) and
looping (`while`, `do`, and `for`) statements.

Bindings can be used to file pieces of data under a name, and they are
useful for tracking state in your program. The environment is the set
of bindings that are defined. JavaScript systems always put a number
of useful standard bindings into your environment.

Functions are special values that encapsulate a piece of program. You
can invoke them by writing `functionName(argument1, argument2)`. Such
a function call is an expression and may produce a value.

## Exercícios

{{index exercises}}

If you are unsure how to test your solutions to the exercises, refer to the
[Introduction](intro).

Each exercise starts with a problem description. Read this description and try to
solve the exercise. If you run into problems, consider reading the
hints [after the exercise]{if interactive}[at the [end of the
book](hints)]{if book}. Full solutions to the exercises are
not included in this book, but you can find them online at
[_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code#2).
If you want to learn something from the exercises, I recommend looking
at the solutions only after you've solved the exercise, or at least
after you've attacked it long and hard enough to have a slight
headache.

### Triângulo com Loop

{{index "triangle (exercise)"}}

Write a ((loop)) that makes seven calls to `console.log` to output the
following triangle:

```{lang: null}
#
##
###
####
#####
######
#######
```

{{index [string, length]}}

It may be useful to know that you can find the length of a string by
writing `.length` after it.

```
let abc = "abc";
console.log(abc.length);
// → 3
```

{{if interactive

Most exercises contain a piece of code that you can modify to solve
the exercise. Remember that you can click code blocks to edit them.

```
// Your code here.
```
if}}

{{hint

{{index "triangle (exercise)"}}

You can start with a program that prints out the numbers 1 to 7, which
you can derive by making a few modifications to the [even number
printing example](program_structure#loops) given earlier in the
chapter, where the `for` loop was introduced.

Now consider the equivalence between numbers and strings of hash
characters. You can go from 1 to 2 by adding 1 (`+= 1`). You can go
from `"#"` to `"##"` by adding a character (`+= "#"`). Thus, your
solution can closely follow the number-printing program.

hint}}

### FizzBuzz

{{index "FizzBuzz (exercise)", loop, "conditional execution"}}

Write a program that uses `console.log` to print all the numbers from
1 to 100, with two exceptions. For numbers divisible by 3, print
`"Fizz"` instead of the number, and for numbers divisible by 5 (and
not 3), print `"Buzz"` instead.

When you have that working, modify your program to print `"FizzBuzz"`
for numbers that are divisible by both 3 and 5 (and still print
`"Fizz"` or `"Buzz"` for numbers divisible by only one of those).

(This is actually an ((interview question)) that has been claimed to
weed out a significant percentage of programmer candidates. So if you
solved it, your labor market value just went up.)

{{if interactive
```
// Your code here.
```
if}}

{{hint

{{index "FizzBuzz (exercise)", "remainder operator", "% operator"}}

Going over the numbers is clearly a looping job, and selecting what to
print is a matter of conditional execution. Remember the trick of
using the remainder (`%`) operator for checking whether a number is
divisible by another number (has a remainder of zero).

In the first version, there are three possible outcomes for every
number, so you'll have to create an `if`/`else if`/`else` chain.

{{index "|| operator", ["if keyword", chaining]}}

The second version of the program has a straightforward solution and a
clever one. The simple solution is to add another conditional "branch" to
precisely test the given condition. For the clever solution, build up a
string containing the word or words to output and print either this
word or the number if there is no word, potentially by making good use
of the `||` operator.

hint}}

### Tabuleiro de Xadrez

{{index "chessboard (exercise)", loop, [nesting, "of loops"], "newline character"}}

Write a program that creates a string that represents an 8×8 grid,
using newline characters to separate lines. At each position of the
grid there is either a space or a "#" character. The characters should
form a chessboard.

Passing this string to `console.log` should show something like this:

```{lang: null}
 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
```

When you have a program that generates this pattern, define a
binding `size = 8` and change the program so that it works for
any `size`, outputting a grid of the given width and height.

{{if interactive
```
// Your code here.
```
if}}

{{hint

{{index "chess board (exercise)"}}

You can build the string by starting with an empty one (`""`) and
repeatedly adding characters. A newline character is written `"\n"`.

{{index [nesting, "of loops"], [braces, "block"]}}

To work with two ((dimensions)), you will need a ((loop)) inside of a
loop. Put braces around the bodies of both loops to make it
easy to see where they start and end. Try to properly indent these
bodies. The order of the loops must follow the order in which we build
up the string (line by line, left to right, top to bottom). So the
outer loop handles the lines, and the inner loop handles the characters
on a line.

{{index "counter variable", "remainder operator", "% operator"}}

You'll need two bindings to track your progress. To know whether to
put a space or a hash sign at a given position, you could test whether
the sum of the two counters is even (`% 2`).

Terminating a line by adding a newline character must happen after the
line has been built up, so do this after the inner loop but inside the outer loop.

hint}}
