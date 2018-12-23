{{meta {load_files: ["code/chapter/08_error.js"]}}}

# Bugs e erros

{{quote {author: "Brian Kernighan and P.J. Plauger", title: "The Elements of Programming Style", chapter: true}

Depurar é duas vezes mais difícil que escrever o código da primeira vez.
Portanto, se você escrever o código mais inteligente possível, por definição,
você não é inteligente o suficiente para depurá-lo.

quote}}

{{figure {url: "img/chapter_picture_8.jpg", alt: "Figura de uma coleção de bugs", chapter: framed}}}

{{index "Kernighan, Brian", "Plauger, P.J.", debugging, "error handling"}}

Falhas em programas de computador são geralmente chamadas de _((bug))s_. Isso faz
os programadores se sentirem bem imaginando eles como pequenas coisas que apenas
acontecem no nosso trabalho. Na realidade, é claro, nós os colocamos 
lá nós mesmos.

Se um programa é um pensamento cristalizado, você pode grosseiramente categorizar os bugs
naqueles causados por pensamentos confusos e aqueles causados por
erros introduzidos ao converter um pensamento em código. O primeiro
tipo é geralmente mais difícil de diagnosticar e consertar que o último.

## Linguagem

{{index parsing, analysis}}

Muitos erros poderiam ser apontados para nós automaticamente pelo
computador, se ele soubesse realmente o que estamos tentando fazer. Mas aqui
a liberdade do JavaScript é um obstáculo. Seu conceito de atribuições e
propriedades é vago o suficiente para raramente identificar ((erros de digitação)) antes
de realmente executar o programa. E até, permite que você faça algumas
coisas claramente sem sentido sem objeção, como o cálculo
`true * "monkey"`.

{{index syntax}}

Existem algumas coisas que o Javascript incomoda. Escrever um
programa que não segue a ((gramática)) da linguagem vai
fazer o computador imediatamente reclamar. Outras coisas, como chamar
algo que não é uma função ou acessar uma ((propriedade)) em um
valor que esteja ((indefinido)), vai causar um erro quando o
programa tentar executar a ação.

{{index NaN, error}}

Mas algumas vezes, seus cálculos absurdos vão resultar apenas `NaN` (not a
number) ou um valor undefined (indefinido), enquanto o programa alegrente continua,
convencido que está fazendo alguma coisa importante. O erro se
manifestará só mais tarde, depois que o valor falso viajou através  
de várias funções. Isso pode não desencadear um erro mas silenciosamente
fazer com que a saída do programa esteja errada. Encontrar a fonte de tais
pode ser difícil.

O processo de encontrar erros ou bugs em programas é chamado de
_((debugging))_.

## Mode estrito

{{index "strict mode", syntax, function}}

{{indexsee "use strict", "strict mode"}}

JavaScript pode ser um _pouco_ mais rigoroso habilitando-se o _modo estrito_ ou 
_strict mode_. Isto é feito colocando-se a string `"use strict"` no início de
um arquivo ou do corpo de uma função. Aqui está um exemplo:

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

Normalmente, quando você esquece de colocar `let` na frente da sua declaração, como
com `counter` no exemplo, JavaScript silenciosamente cria uma declaração
global e usa isso. No modo estrito ao contrário, um ((erro)) é lançado.
Isso é muito útil. Deve-se notar, porém, que isso
não funciona quando a declaração em questão já existe como uma declaração
global. Nesse caso, o loop irá silenciosamente sobreescrever o valor
da declaração.

{{index this, "global object", undefined, "strict mode"}}

Outra mudança no modo estrito é que o `this` possui o
valor `undefined` nas funções que não são chamadas como ((métodos)).
Quando fazer tal chamada fora do modo estrito, `this` refere-se ao
escopo do objeto global, que é um objeto cuja as propriedades são as
variáveis globais. Então se você acidentalmente chmar um método ou construtor
incorretamente no modo estrito, o JavaScript irá lançar um erro assim
que tentar ler algo de `this`, ao invés de simplesmenete escrever
no escopo global.

Por exemplo, considere o código a seguir, o qual chama um
((construtor)) sem a palavra-chave `new` de modo que seu `this`
_não_ irá se referir ao objeto recem criado:

```
function Person(name) { this.name = name; }
let ferdinand = Person("Ferdinand"); // oops
console.log(name);
// → Ferdinand
```

{{index error}}

Então a chamada falsa para `Pessoa` ocorreu mas retornou um valor 
indefinido e criou uma variável global `name`. No modo estrito, o 
resultado é outro.

```{test: "error \"TypeError: Cannot set property 'name' of undefined\""}
"use strict";
function Person(name) { this.name = name; }
let ferdinand = Person("Ferdinand"); // esquecido new
// → TypeError: Cannot set property 'name' of undefined
```

Nos somos avisados imediatamente que algo está errado. Isso é útil.

Felizmente, os contrutores criados com a notação `class` vão
sempre reclamar se eles são chamados sem `new`, fazendo isso menos
problemático mesmo não utilizando o modo estrito.
a problem even in non-strict mode.

{{index parameter, [binding, naming], "with statement"}}

O mode estrito faz mais algumas coisas. Não permite passar a uma função 
vários parâmetros com o mesmo nome e remove certos problemas
caraterísticos da linguagem ao todo (como a declaração `with`, que é tão
errado que não é mais discutido neste livro).

{{index debugging}}

Em resumo, colocando `"use strict"` no começo do seu programa raramente
dói e pode ajudá-lo a indentificar um problema.

## Tipos

Algumas linguagens querem saber os tipos de todas as suas variáveis e
expressões antes mesmo de executar um programa. Elas vão te dizer 
imediatamente quando um tipo é usado de forma inconsistente. JavaScript considera
os tipos apenas quando realmente executa o programa, e as vezes até mesmo
tenta converter implicitamente valores para o tipo esperado, portanto não é
grande ajuda.

Ainda assim, os tipos fornecem uma estrutura útil falando de programas. Muitos
erros surgem ao você ficar confuso sobre que tipo de valor 
entra ou sai de uma função. Se você tiver essa informação
escrita, é menos provável que você fique confuso.

Voce poderia adicionar um comentário como o seguinte antes da função
`goalOrientedRobot` do capítulo anterior para descrever seu tipo:

```
// (VillageState, Array) → {direction: string, memory: Array}
function goalOrientedRobot(state, memory) {
  // ...
}
```

Existem muitas convenções diferentes para anotar programas em JavaScript
com tipos.

Algo sobre os tipos é que eles introduzem sua própria
complexidade para poder descrever o código o suficiente para ser útil. O que 
você acha que seria o tipo da função `ramdomPick` que retorna
um elemento aleatório de uma array? Você precisaria passar uma _((variável
tipo))_, _T_, que pode ser de qualquer tipo, de modo que você pode
passar a `randomPick` um tipo como `([T]) → T` (função de um array de
*T*s para um *T*).

{{index "type checking", TypeScript}}

{{id typing}}

Quando os tipos de um programa são conhecidos, é possível para o computador
verificar eles para você, apontando erros antes do programa ser
executado. Existem vários dialetos JavaScript que adicionam tipos para a
linguagem e os verificam. O mais popular é chamado
[TypeScript](https://www.typescriptlang.org/). Se você estiver interessado
em adicionar mais rigor ao seus programas, eu recomendo que você experimente.


Neste livro, nos continuaremos utilizando o bruto, perigoso e não tipado
código JavaScript puro.

## Testando

{{index "test suite", "run-time error", automation, testing}}

Se a linguagem não vai fazer muito para nos ajudar a encontrar erros,
teremos que encontra-los da maneira mais difícil: executando o programa e 
verificando se ele fez a coisa certa.

Fazendo isso manualmente, de novo e de novo, é realmente uma má ideia. Não é apenas
irritante, mas também tende a ser ineficiente, pois leva muito
tempo para testar tudo exaustivamente sempre que você fizer uma mudança.

Computadores são bons em tarefas repetitivas, e testar é a tarefa
repetitiva ideal. Automatização de testes é o processo de escrever um programa
que testa outro programa. Escrever testes é um pouco mais trabalhoso que
testar manualmente, mas uma vez feito, você ganha uma espécie de
superpoder: leva apenas alguns segundos para verificar que seu
programa continua se comportando bem a todas as situações para as quais você escreveu
testes. Quando você quebra alguma coisa, você será avisado imediatamente, ao invés de
aleatoriamente, em algum momento depois.

{{index "toUpperCase method"}}

Testes normalmente tem a forma de pequenos programas que verificam
algum aspecto do seu código. Por exemplo, um conjunto de testes para o método
(padrão e provavelmente já testado por outra pessoa) `toUpperCase`
pode ser assim:

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

Escrever testes como este tende a produzir um código muito repetitivo
e desajeitado. Felizmente, existem softwares que ajudam você a escrever
e rodar coleções de testes (_((test suites))_) fornecendo uma
linguagem (na forma de funções e métodos) adequada para expressar
testes e gerando informações utéis quando o teste falha.
Estes são geralmente chamados de _((test runners))_.

{{index "persistent data structure"}}

Certos códigos são mais fáceis de tester que outros. Geralmente, quanto mais
objetos externos o código interage, mais difícil é configurar o contexto no qual
testá-lo. O estilo de programação mostrado no [capítulo anterior](robot), que usa valores
persistentes independentes em vez de alterar objetos, tenden a ser mais fácil de testar.

## Depuração

{{index debugging}}

Uma vez que você nota que há algo errado com o seu programa
porque ele se comporta mal ou produz erros, o próximo passo é descobrir
_qual_ é o problema.

Algumas vezes é óbvio. A mensagem de ((erro)) vai apontar para
a linha específica do seu programa, e se você olhar para a descrição
do erro e essa linha do código, você pode identificar, com frequência, o problema.

{{index "run-time error"}}

Nem sempre. Às vezes, a linha que desencadeou o problema
é simplesmente o primeiro lugar em que um valor esquisito produzido em outro lugar
é usado de maneira inválida. Se você tiver resolvido os ((exercícios)) nos
capítulos anteriores, provavelmente já terá experimentado tais
situações.

{{index "decimal number", "binary number"}}

O programa de exemplo a seguir tenta converter um número inteiro em uma
sequência de caracteres em uma determinada base (decimal, binário e assim por diante) repetidamente escolhendo o último ((dígito)) e, em seguida, dividindo o número para se livrar
desse dígito. Mas a saída estranha que ele atualmente produz
sugere que tem um ((bug)).

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

Mesmo se voce já veja o problema, finja por um momento que não.
Nos sabemos que o programa está funcionando mal e queremos descobrir
porquê.

{{index "trial and error"}}

É aqui que você deve resistir ao impulso de começar a fazer alterações
aleatórias no código para ver se isso o torna melhor. Em vez disso, _pense_ Analise
o que está acontecendo e crie uma ((teoria)) de porque isso pode estar
acontecendo. Em seguida, faça as observações adicionais para testar essa teoria - ou,
se você não ainda não tiver uma teoria, faça observações adicionais para ajudá-lo
a criar uma.

{{index "console.log", output, debugging, logging}}

Colocar algumas chamadas estratégicas de `console.log` no programa é uma boa
maneira de obter informações adicionais sobre o que o programa está fazendo. Neste
caso, queremos que `n` pegue os valores `13`, `1` e, em seguida, `0`. Vamos
escrever seu valor no início do loop.

```{lang: null}
13
1.3
0.13
0.013
…
1.5e-323
```

{{index rounding}}

_Certo_. Dividir 13 por 10 não produz um número inteiro. Ao invés de
`n /= base`, o que nós realmenten queremos é `n = Math.floor(n / base)` para
que o número seja apropriadamente arredondado para cima.

{{index "JavaScript console", "debugger statement"}}

Uma alternatia do uso de `console.log` para observar o comportamento
do programa é usar os recursos de depuração do seu navegador.
Navegadores vem com a capacidade de definir um _((breakpoint))_ em uma linha
especifica do seu código. Quando a execução do programa chega até uma linha
com um breakpoint, ela é pausada, e você pode inspecionar os valores atribuídos
naquele ponto. Eu não vou entrar em detalhes, como os depuradores diferem
de navegador para navegador, mas olhe no seu navegador ((ferramentas de
desenvolvedor)) ou pesquise na Web para obter mais informações.

Outra forma de definir um breakpoint é incluir uma declaração `debugger`
(consistindo simplesmente na palavra-chave) em seu programa. Se as
((ferramentas de desenvolvedor)) do seu navegador estiverem ativas,
o programa irá pausar sempre que atingir tal declaração.

## Propagação de erros

{{index input, output, "run-time error", error, validation}}

Nem todos os problemas podem ser evitados pelo programador, infelizmente. Se
o seu programa se comunica com o mundo externo de alguma forma, é
possível obter uma entrada malformada, sobrecarregar-se com trabalho, ou
fazer com que a rede falhe.

{{index "error recovery"}}

Se você está programando apenas para si mesmo, você pode simplesmente ignorar
tais problemas até que eles ocorram. Mas se você construir algo que
será usado por qualquer outra pessoa, você geralmente quer que o programa faça
melhor do que simplesmente travar. Às vezes, a coisa certa a fazer é pegar a
entrada incorreta no tranco e continuar executando. Em outros casos, é melhor
relatar ao usuário o que deu errado e desistir. Mas em qualquer
situação, o programa tem que ativamente fazer algo em resposta ao
problema.

{{index "promptInteger function", validation}}

Digamos que você tenha uma função `promptInteger` que solicita ao usuário um número
inteiro e o retorna. O que ela deve retornar se o usuário inserir
"laranja"?

{{index null, undefined, "return value", "special return value"}}

Uma opção é fazer retornar um valor especial. Escolhar comuns para
esses valores são  `null`, `undefined`, or -1.

```{test: no}
function promptNumber(question) {
  let result = Number(prompt(question));
  if (Number.isNaN(result)) return null;
  else return result;
}

console.log(promptNumber("How many trees do you see?"));
```

Agora qualquer código que chama `promptNumber` deve verificar se
um número real foi lido e, não sendo verdade, de alguma forma deve se recuperar - talvez
solicitando novamente ou definindo um valor padrão. Ou pode retornar novamente
um valor epecial para quem chamou para indicar que não conseguiu
fazer o que foi solicitado.

{{index "error handling"}}

Em muitas situações, principalmente quando ((erros))s são comuns e quem chama
deve expliciamente levá-los em conta, retornando um valor
especial é uma boa forma de indicar um erro. No entanto, tem suas
desvantagens. Primeiro, e se a função já puder retornar todo
o tipo possível valor? Em tal função, você terá que fazer
algo como embrulhar o resultado em um objeto para poder distinguir
sucesso de falha.

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

O segundo problema com o retorno de valores especiais é que isso pode levar a
códigos estranhos. Se uma parte do código chamar o `promptNumber` 10 vezes,
ele deve verificar 10 vezes se o valor `null` foi retornado. E se a sua
resposta para encontrar `null` é simplesmente retornar `null`, os chamadores
da função terão que checá-la, e assim por diante.

## Exceptions

{{index "error handling"}}

When a function cannot proceed normally, what we would _like_ to do is
just stop what we are doing and immediately jump to a place that knows
how to handle the problem. This is what _((exception handling))_ does.

{{index "control flow", "raising (exception)", "throw keyword", "call stack"}}

Exceptions are a mechanism that makes it possible for code that runs
into a problem to _raise_ (or _throw_) an exception. An exception can
be any value. Raising one somewhat resembles a super-charged return
from a function: it jumps out of not just the current function but
also its callers, all the way down to the first call that
started the current execution. This is called _((unwinding the
stack))_. You may remember the stack of function calls that was
mentioned in [Chapter ?](functions#stack). An exception zooms down
this stack, throwing away all the call contexts it encounters.

{{index "error handling", syntax, "catch keyword"}}

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

{{index "exception handling", "cleaning up"}}

The effect of an exception is another kind of ((control flow)). Every
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

{{index syntax, [function, application], "exception handling", "Error type"}}

Invalid uses of the language, such as referencing a nonexistent
((binding)), looking up a property on `null`, or calling something
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

{{index validation, "run-time error", crash, assumption, array}}

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

For extra points, make sure that if you call `withBoxUnlocked` when
the box is already unlocked, the box stays unlocked.

if}}

{{hint

{{index "locked box (exercise)", "finally keyword", "try keyword"}}

This exercise calls for a `finally` block. Your function should first
unlock the box and then call the argument function from inside a `try`
body. The `finally` block after it should lock the box again.

To make sure we don't lock the box when it wasn't already locked,
check its lock at the start of the function and unlock and lock
it only when it started out locked.

hint}}
