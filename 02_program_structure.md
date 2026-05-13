# Estrutura do Programa

{{quote {author: "_why", title: "Why's (Poignant) Guide to Ruby", chapter: true}

And my heart glows bright red under my filmy, translucent skin and they have to administer 10cc of JavaScript to get me to come back. (I respond well to toxins in the blood.) Man, that stuff will kick the peaches right out your gills!

quote}}

{{index why, "Poignant Guide"}}

{{figure {url: "img/chapter_picture_2.jpg", alt: "Illustration showing a number of tentacles holding chess pieces", chapter: framed}}}

Neste capítulo, começaremos a fazer coisas que podem realmente ser chamadas de _programação_. Expandiremos nosso domínio da linguagem JavaScript além dos substantivos e fragmentos de frases que vimos até agora, até o ponto em que podemos expressar prosa significativa.

## Expressões e instruções

{{index grammar, [syntax, expression], [code, "structure of"], grammar, [JavaScript, syntax]}}

No [Capítulo ?](values), criamos valores e aplicamos operadores a eles para obter novos valores. Criar valores dessa forma é a substância principal de qualquer programa JavaScript. Mas essa substância precisa ser enquadrada em uma estrutura maior para ser útil. É isso que abordaremos neste capítulo.

{{index "literal expression", [parentheses, expression]}}

Um fragmento de código que produz um valor é chamado de _((expressão))_. Todo valor escrito literalmente (como `22` ou `"psychoanalysis"`) é uma expressão. Uma expressão entre parênteses também é uma expressão, assim como um ((operador binário)) aplicado a duas expressões ou um ((operador unário)) aplicado a uma.

{{index [nesting, "of expressions"], "human language"}}

Isso mostra parte da beleza de uma interface baseada em linguagem. Expressões podem conter outras expressões de forma similar a como subfrases em linguagens humanas são aninhadas — uma subfrase pode conter suas próprias subfrases, e assim por diante. Isso nos permite construir expressões que descrevem computações arbitrariamente complexas.

{{index statement, semicolon, program}}

Se uma expressão corresponde a um fragmento de frase, uma _instrução_ JavaScript corresponde a uma frase completa. Um programa é uma lista de instruções.

{{index [syntax, statement]}}

O tipo mais simples de instrução é uma expressão com um ponto e vírgula depois dela. Este é um programa:

```
1;
!false;
```

É um programa inútil, porém. Uma ((expressão)) pode se contentar em apenas produzir um valor, que pode então ser usado pelo código que a envolve. No entanto, uma ((instrução)) existe por si só, então se ela não afetar o mundo, é inútil. Ela pode exibir algo na tela, como com `console.log`, ou mudar o estado da máquina de uma forma que afetará as instruções que vêm depois dela. Essas mudanças são chamadas de _((efeito colateral))_. As instruções no exemplo anterior apenas produzem os valores `1` e `true` e depois os jogam fora imediatamente. Isso não deixa nenhuma impressão no mundo. Quando você executa esse programa, nada observável acontece.

{{index "programming style", "automatic semicolon insertion", semicolon}}

Em alguns casos, JavaScript permite que você omita o ponto e vírgula no final de uma instrução. Em outros casos, ele precisa estar lá, ou a próxima ((linha)) será tratada como parte da mesma instrução. As regras para quando ele pode ser omitido com segurança são um tanto complexas e propensas a erros. Então, neste livro, toda instrução que precisa de um ponto e vírgula sempre terá um. Recomendo que você faça o mesmo, pelo menos até ter aprendido mais sobre as sutilezas dos pontos e vírgulas ausentes.

## Bindings

{{indexsee variable, binding}}
{{index [syntax, statement], [binding, definition], "side effect", [memory, organization], [state, in binding]}}

Como um programa mantém um estado interno? Como ele lembra coisas? Vimos como produzir novos valores a partir de valores antigos, mas isso não muda os valores antigos, e o novo valor precisa ser usado imediatamente ou se dissipará novamente. Para capturar e manter valores, JavaScript fornece uma coisa chamada _binding_, ou _variável_.

```
let caught = 5 * 5;
```

{{index "let keyword"}}

Isso nos dá um segundo tipo de ((instrução)). A palavra especial (_((palavra-chave))_) `let` indica que esta frase vai definir um binding. Ela é seguida pelo nome do binding e, se quisermos imediatamente lhe dar um valor, por um operador `=` e uma expressão.

O exemplo cria um binding chamado `caught` e o usa para agarrar o número que é produzido pela multiplicação de 5 por 5.

Após um binding ter sido definido, seu nome pode ser usado como uma ((expressão)). O valor de tal expressão é o valor que o binding mantém no momento. Aqui está um exemplo:

```
let ten = 10;
console.log(ten * ten);
// → 100
```

{{index "= operator", assignment, [binding, assignment]}}

Quando um binding aponta para um valor, isso não significa que está amarrado a esse valor para sempre. O operador `=` pode ser usado a qualquer momento em bindings existentes para desconectá-los de seu valor atual e fazê-los apontar para um novo:

```
let mood = "light";
console.log(mood);
// → light
mood = "dark";
console.log(mood);
// → dark
```

{{index [binding, "model of"], "tentacle (analogy)"}}

Você deve imaginar bindings como tentáculos em vez de caixas. Eles não _contêm_ valores; eles os _agarram_ — dois bindings podem se referir ao mesmo valor. Um programa pode acessar apenas os valores aos quais ainda tem uma referência. Quando você precisa lembrar de algo, você ou faz crescer um tentáculo para segurá-lo ou reacopla um dos seus tentáculos existentes a ele.

Vejamos outro exemplo. Para lembrar o número de dólares que Luigi ainda lhe deve, você cria um binding. Quando ele paga $35 de volta, você dá a esse binding um novo valor.

```
let luigisDebt = 140;
luigisDebt = luigisDebt - 35;
console.log(luigisDebt);
// → 105
```

{{index undefined}}

Quando você define um binding sem lhe dar um valor, o tentáculo não tem nada para agarrar, então termina no ar. Se você pedir o valor de um binding vazio, obterá o valor `undefined`.

{{index "let keyword"}}

Uma única instrução `let` pode definir múltiplos bindings. As definições devem ser separadas por vírgulas:

```
let one = 1, two = 2;
console.log(one + two);
// → 3
```

As palavras `var` e `const` também podem ser usadas para criar bindings, de forma similar a `let`.

```
var name = "Ayda";
const greeting = "Hello ";
console.log(greeting + name);
// → Hello Ayda
```

{{index "var keyword"}}

A primeira delas, `var` (abreviação de "variable"), é a forma como bindings eram declarados no JavaScript pré-2015, quando `let` ainda não existia. Voltarei à forma precisa como difere de `let` no [próximo capítulo](functions). Por enquanto, lembre-se de que ela faz basicamente a mesma coisa, mas raramente a usaremos neste livro porque se comporta de forma estranha em algumas situações.

{{index "const keyword", naming}}

A palavra `const` significa _((constante))_. Ela define um binding constante, que aponta para o mesmo valor enquanto existir. Isso é útil para bindings que apenas dão um nome a um valor para que você possa facilmente se referir a ele depois.

## Nomes de bindings

{{index "underscore character", "dollar sign", [binding, naming]}}

Nomes de binding podem ser qualquer sequência de uma ou mais letras. Dígitos podem fazer parte de nomes de binding — `catch22` é um nome válido, por exemplo — mas o nome não pode começar com um dígito. Um nome de binding pode incluir cifrões (`$`) ou sublinhados (`_`), mas nenhuma outra pontuação ou caractere especial.

{{index [syntax, identifier], "implements (reserved word)", "interface (reserved word)", "package (reserved word)", "private (reserved word)", "protected (reserved word)", "public (reserved word)", "static (reserved word)", "void operator", "yield (reserved word)", "enum (reserved word)", "reserved word", [binding, naming]}}

Palavras com significado especial, como `let`, são _((palavra-chave))s_ e não podem ser usadas como nomes de binding. Há também uma série de palavras que são "reservadas para uso" em versões ((futuro))s do JavaScript, que também não podem ser usadas como nomes de binding. A lista completa de palavras-chave e palavras reservadas é bastante longa:

```{lang: "null"}
break case catch class const continue debugger default
delete do else enum export extends false finally for
function if implements import interface in instanceof let
new package private protected public return static super
switch this throw true try typeof var void while with yield
```

{{index [syntax, error]}}

Não se preocupe em memorizar essa lista. Quando criar um binding produzir um erro de sintaxe inesperado, verifique se você está tentando definir uma palavra reservada.

## O ambiente

{{index "standard environment", [browser, environment]}}

A coleção de bindings e seus valores que existem em um dado momento é chamada de _((ambiente))_. Quando um programa inicia, esse ambiente não está vazio. Ele sempre contém bindings que fazem parte do ((padrão)) da linguagem e, na maioria das vezes, também possui bindings que fornecem formas de interagir com o sistema ao redor. Por exemplo, em um navegador, existem funções para interagir com o site atualmente carregado e para ler entrada de ((mouse)) e ((teclado)).

## Funções

{{indexsee "application (of functions)", [function, application]}}
{{indexsee "invoking (of functions)", [function, application]}}
{{indexsee "calling (of functions)", [function, application]}}
{{index output, function, [function, application], [browser, environment]}}

Muitos dos valores fornecidos no ambiente padrão têm o tipo _((função))_. Uma função é um pedaço de programa envolvido em um valor. Tais valores podem ser _aplicados_ para executar o programa envolvido. Por exemplo, em um ambiente de navegador, o binding `prompt` contém uma função que mostra um pequeno ((diálogo)) pedindo entrada do usuário. Ela é usada assim:

```
prompt("Enter passcode");
```

{{figure {url: "img/prompt.png", alt: "A prompt dialog that says 'enter passcode'", width: "8cm"}}}

{{index parameter, [function, application], [parentheses, arguments]}}

Executar uma função é chamado de _invocar_, _chamar_ ou _aplicar_ a função. Você pode chamar uma função colocando parênteses após uma expressão que produz um valor de função. Geralmente você usará diretamente o nome do binding que contém a função. Os valores entre os parênteses são dados ao programa dentro da função. No exemplo, a função `prompt` usa a string que lhe damos como o texto a mostrar na caixa de diálogo. Valores dados a funções são chamados de _((argumento))s_. Funções diferentes podem precisar de um número ou tipos diferentes de argumentos.

A função `prompt` não é muito usada na programação web moderna, principalmente porque você não tem controle sobre a aparência do diálogo resultante, mas pode ser útil em programas de brinquedo e experimentos.

## A função console.log

{{index "JavaScript console", "developer tools", "Node.js", "console.log", output, [browser, environment]}}

Nos exemplos, usei `console.log` para exibir valores. A maioria dos sistemas JavaScript (incluindo todos os navegadores web modernos e o Node.js) fornece uma função `console.log` que escreve seus argumentos em _algum_ dispositivo de saída de texto. Nos navegadores, a saída vai para o ((console JavaScript)). Essa parte da interface do navegador está oculta por padrão, mas a maioria dos navegadores a abre quando você pressiona F12 ou, em um Mac, [command]{keyname}-[option]{keyname}-I. Se isso não funcionar, procure nos menus por um item chamado Developer Tools ou similar.

{{if interactive

Ao executar os exemplos (ou seu próprio código) nas páginas deste livro, a saída de `console.log` será mostrada após o exemplo, em vez de no console JavaScript do navegador.

```
let x = 30;
console.log("the value of x is", x);
// → the value of x is 30
```

if}}

{{index [object, property], [property, access]}}

Embora nomes de binding não possam conter ((caractere ponto)), `console.log` tem um. Isso porque `console.log` não é um binding simples, mas uma expressão que recupera a propriedade `log` do valor mantido pelo binding `console`. Descobriremos exatamente o que isso significa no [Capítulo ?](data#properties).

{{id return_values}}
## Valores de retorno

{{index [comparison, "of numbers"], "return value", "Math.max function", maximum}}

Mostrar uma caixa de diálogo ou escrever texto na tela é um _((efeito colateral))_. Muitas funções são úteis por causa dos efeitos colaterais que produzem. Funções também podem produzir valores, caso em que não precisam ter um efeito colateral para ser úteis. Por exemplo, a função `Math.max` recebe qualquer quantidade de argumentos numéricos e retorna o maior.

```
console.log(Math.max(2, 4));
// → 4
```

{{index [function, application], minimum, "Math.min function"}}

Quando uma função produz um valor, diz-se que ela _retorna_ esse valor. Qualquer coisa que produz um valor é uma ((expressão)) em JavaScript, o que significa que chamadas de função podem ser usadas dentro de expressões maiores. No código a seguir, uma chamada a `Math.min`, que é o oposto de `Math.max`, é usada como parte de uma expressão de soma:

```
console.log(Math.min(2, 4) + 100);
// → 102
```

O [Capítulo ?](functions) explicará como escrever suas próprias funções.

## Fluxo de controle

{{index "execution order", program, "control flow"}}

Quando seu programa contém mais de uma ((instrução)), as instruções são executadas como se fossem uma história, de cima para baixo. Por exemplo, o programa a seguir tem duas instruções. A primeira pede ao usuário um número, e a segunda, que é executada após a primeira, mostra o ((quadrado)) desse número:

```
let theNumber = Number(prompt("Pick a number"));
console.log("Your number is the square root of " +
            theNumber * theNumber);
```

{{index [number, "conversion to"], "type coercion", "Number function", "String function", "Boolean function", [Boolean, "conversion to"]}}

A função `Number` converte um valor para um número. Precisamos dessa conversão porque o resultado de `prompt` é um valor de string, e queremos um número. Existem funções similares chamadas `String` e `Boolean` que convertem valores para esses tipos.

Aqui está a representação esquemática bastante trivial do fluxo de controle em linha reta:

{{figure {url: "img/controlflow-straight.svg", alt: "Diagram showing a straight arrow", width: "4cm"}}}

## Execução condicional

{{index Boolean, ["control flow", conditional]}}

Nem todos os programas são estradas retas. Podemos, por exemplo, querer criar uma estrada ramificada onde o programa toma o caminho adequado com base na situação em questão. Isso é chamado de _((execução condicional))_.

{{figure {url: "img/controlflow-if.svg", alt: "Diagram of an arrow that splits in two, and then rejoins again",width: "4cm"}}}

{{index [syntax, statement], "Number function", "if keyword"}}

A execução condicional é criada com a palavra-chave `if` em JavaScript. No caso simples, queremos que algum código seja executado se, e somente se, uma certa condição for verdadeira. Podemos, por exemplo, querer mostrar o quadrado da entrada apenas se a entrada for realmente um número:

```{test: wrap}
let theNumber = Number(prompt("Pick a number"));
if (!Number.isNaN(theNumber)) {
  console.log("Your number is the square root of " +
              theNumber * theNumber);
}
```

Com essa modificação, se você digitar "parrot", nenhuma saída é mostrada.

{{index [parentheses, statement]}}

A palavra-chave `if` executa ou pula uma instrução dependendo do valor de uma expressão booleana. A expressão decisória é escrita após a palavra-chave, entre parênteses, seguida pela instrução a executar.

{{index "Number.isNaN function"}}

A função `Number.isNaN` é uma função padrão do JavaScript que retorna `true` apenas se o argumento que recebe for `NaN`. A função `Number` retorna `NaN` quando você lhe dá uma string que não representa um número válido. Assim, a condição se traduz como "a menos que `theNumber` não seja um número, faça isso".

{{index grouping, "{} (block)", [braces, "block"]}}

A instrução após o `if` está envolvida em chaves (`{` e `}`) neste exemplo. As chaves podem ser usadas para agrupar qualquer número de instruções em uma única instrução, chamada de _((bloco))_. Você também poderia tê-las omitido neste caso, já que contêm apenas uma única instrução, mas para evitar ter que pensar se são necessárias, a maioria dos programadores JavaScript as usa em toda instrução envolvida como esta. Seguiremos essa convenção na maior parte deste livro, exceto pela ocasional instrução de uma linha.

```
if (1 + 1 == 2) console.log("It's true");
// → It's true
```

{{index "else keyword"}}

Frequentemente você não terá apenas código que executa quando uma condição é verdadeira, mas também código que lida com o outro caso. Esse caminho alternativo é representado pela segunda seta no diagrama. Você pode usar a palavra-chave `else`, junto com `if`, para criar dois caminhos de execução separados e alternativos:

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

Se você tiver mais de dois caminhos para escolher, pode "encadear" múltiplos pares `if`/`else` juntos. Aqui está um exemplo:

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

O programa primeiro verificará se `num` é menor que 10. Se for, ele escolhe esse caminho, mostra `"Small"` e termina. Se não for, ele toma o caminho `else`, que por sua vez contém um segundo `if`. Se a segunda condição (`< 100`) for verdadeira, isso significa que o número é pelo menos 10 mas menor que 100, e `"Medium"` é mostrado. Se não for, o segundo e último caminho `else` é escolhido.

O esquema para esse programa se parece com algo assim:

{{figure {url: "img/controlflow-nested-if.svg", alt: "Diagram showing arrow that splits in two, with on the branches splitting again, before all branches rejoin again", width: "4cm"}}}

{{id loops}}
## Loops while e do

Considere um programa que exibe todos os ((números pares)) de 0 a 12. Uma forma de escrever isso é a seguinte:

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

Isso funciona, mas a ideia de escrever um programa é fazer _menos_ trabalho, não mais. Se precisássemos de todos os números pares menores que 1.000, essa abordagem seria inviável. O que precisamos é de uma forma de executar um trecho de código múltiplas vezes. Essa forma de fluxo de controle é chamada de _((loop))_.

{{figure {url: "img/controlflow-loop.svg", alt: "Diagram showing an arrow to a point which has a cyclic arrow going back to itself and another arrow going further", width: "4cm"}}}

{{index [syntax, statement], "counter variable"}}

O fluxo de controle de loop nos permite voltar a algum ponto no programa onde estávamos antes e repeti-lo com nosso estado atual do programa. Se combinarmos isso com um binding que conta, podemos fazer algo assim:

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

Uma ((instrução)) começando com a palavra-chave `while` cria um loop. A palavra `while` é seguida por uma ((expressão)) entre parênteses e depois uma instrução, assim como `if`. O loop continua entrando nessa instrução enquanto a expressão produzir um valor que resulte em `true` quando convertido para booleano.

{{index [state, in binding], [binding, as state]}}

O binding `number` demonstra a forma como um ((binding)) pode acompanhar o progresso de um programa. Toda vez que o loop se repete, `number` recebe um valor que é 2 a mais que seu valor anterior. No início de cada repetição, ele é comparado com o número 12 para decidir se o trabalho do programa está terminado.

{{index exponentiation}}

Como um exemplo que realmente faz algo útil, agora podemos escrever um programa que calcula e mostra o valor de 2^10^ (2 elevado à 10ª potência). Usamos dois bindings: um para acompanhar nosso resultado e um para contar quantas vezes multiplicamos esse resultado por 2. O loop testa se o segundo binding já atingiu 10 e, se não, atualiza ambos os bindings.

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

O contador também poderia ter começado em `1` e verificado `<= 10`, mas por razões que ficarão aparentes no [Capítulo ?](data#array_indexing), é uma boa ideia se acostumar a contar a partir de 0.

{{index "** operator"}}

Note que JavaScript também tem um operador para exponenciação (`2 ** 10`), que você usaria para calcular isso em código real — mas isso teria arruinado o exemplo.

{{index "loop body", "do loop", ["control flow", loop]}}

Um loop `do` é uma estrutura de controle similar ao loop `while`. Difere apenas em um ponto: um loop `do` sempre executa seu corpo pelo menos uma vez, e começa a testar se deve parar apenas após essa primeira execução. Para refletir isso, o teste aparece após o corpo do loop:

```
let yourName;
do {
  yourName = prompt("Who are you?");
} while (!yourName);
console.log("Hello " + yourName);
```

{{index [Boolean, "conversion to"], "! operator"}}

Este programa forçará você a inserir um nome. Ele perguntará repetidamente até obter algo que não seja uma string vazia. Aplicar o operador `!` converterá um valor para o tipo booleano antes de negá-lo, e todas as strings exceto `""` se convertem para `true`. Isso significa que o loop continua rodando até que você forneça um nome não vazio.

## Indentando Código

{{index [code, "structure of"], [whitespace, indentation], "programming style"}}

Nos exemplos, tenho adicionado espaços na frente de instruções que fazem parte de alguma instrução maior. Esses espaços não são necessários — o computador aceitará o programa perfeitamente sem eles. Na verdade, até as ((quebras de linha)) em programas são opcionais. Você poderia escrever um programa como uma única linha longa se quisesse.

O papel dessa ((indentação)) dentro de ((bloco))s é fazer a estrutura do código se destacar para leitores humanos. Em código onde novos blocos são abertos dentro de outros blocos, pode se tornar difícil ver onde um bloco termina e outro começa. Com indentação adequada, a forma visual de um programa corresponde à forma dos blocos dentro dele. Gosto de usar dois espaços para cada bloco aberto, mas gostos variam — algumas pessoas usam quatro espaços, e algumas usam ((caractere de tabulação)). O importante é que cada novo bloco adicione a mesma quantidade de espaço.

```
if (false != true) {
  console.log("That makes sense.");
  if (1 < 2) {
    console.log("No surprise there.");
  }
}
```

A maioria dos ((editor))es de código[ (incluindo o deste livro)]{if interactive} ajudará indentando automaticamente novas linhas na quantidade adequada.

## Loops for

{{index [syntax, statement], "while loop", "counter variable"}}

Muitos loops seguem o padrão mostrado nos exemplos de `while`. Primeiro um binding "contador" é criado para acompanhar o progresso do loop. Depois vem um loop `while`, geralmente com uma expressão de teste que verifica se o contador atingiu seu valor final. No final do corpo do loop, o contador é atualizado para acompanhar o progresso.

{{index "for loop", loop}}

Como esse padrão é tão comum, JavaScript e linguagens similares fornecem uma forma ligeiramente mais curta e mais abrangente, o loop `for`:

```
for (let number = 0; number <= 12; number = number + 2) {
  console.log(number);
}
// → 0
// → 2
//   … etcetera
```

{{index ["control flow", loop], state}}

Este programa é exatamente equivalente ao [exemplo anterior](program_structure#loops) de impressão de números pares. A única mudança é que todas as ((instruções)) que são relacionadas ao "estado" do loop estão agrupadas juntas após `for`.

{{index [binding, as state], [parentheses, statement]}}

Os parênteses após uma palavra-chave `for` devem conter dois ((ponto e vírgula))s. A parte antes do primeiro ponto e vírgula _inicializa_ o loop, geralmente definindo um binding. A segunda parte é a ((expressão)) que _verifica_ se o loop deve continuar. A parte final _atualiza_ o estado do loop após cada iteração. Na maioria dos casos, isso é mais curto e claro que uma construção `while`.

{{index exponentiation}}

Este é o código que calcula 2^10^ usando `for` em vez de `while`:

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

Fazer a condição do loop produzir `false` não é a única forma de um loop terminar. A instrução `break` tem o efeito de imediatamente saltar para fora do loop que a envolve. Seu uso é demonstrado no programa a seguir, que encontra o primeiro número que é tanto maior ou igual a 20 quanto divisível por 7:

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

Usar o operador resto (`%`) é uma forma fácil de testar se um número é divisível por outro número. Se for, o resto da divisão é zero.

{{index "for loop"}}

A construção `for` no exemplo não tem uma parte que verifica o final do loop. Isso significa que o loop nunca parará a menos que a instrução `break` dentro dele seja executada.

Se você removesse essa instrução `break` ou acidentalmente escrevesse uma condição final que sempre produz `true`, seu programa ficaria preso em um _((loop infinito))_. Um programa preso em um loop infinito nunca terminará de executar, o que geralmente é uma coisa ruim.

{{if interactive

Se você criar um loop infinito em um dos exemplos nestas páginas, geralmente será perguntado se quer parar o script após alguns segundos. Se isso falhar, você terá que fechar a aba em que está trabalhando para se recuperar.

if}}

{{index "continue keyword"}}

A palavra-chave `continue` é similar a `break` no sentido de que influencia o progresso de um loop. Quando `continue` é encontrado em um corpo de loop, o controle salta para fora do corpo e continua com a próxima iteração do loop.

## Atualizando bindings sucintamente

{{index assignment, "+= operator", "-= operator", "/= operator", "*= operator", [state, in binding], "side effect"}}

Especialmente ao fazer loops, um programa frequentemente precisa "atualizar" um binding para manter um valor baseado no valor anterior desse binding.

```{test: no}
counter = counter + 1;
```

JavaScript fornece um atalho para isso:

```{test: no}
counter += 1;
```

Atalhos similares funcionam para muitos outros operadores, como `result *= 2` para dobrar `result` ou `counter -= 1` para contar para baixo.

Isso nos permite encurtar ainda mais nosso exemplo de contagem:

```
for (let number = 0; number <= 12; number += 2) {
  console.log(number);
}
```

{{index "++ operator", "-- operator"}}

Para `counter += 1` e `counter -= 1`, existem equivalentes ainda mais curtos: `counter++` e `counter--`.

## Despachando com um valor usando switch

{{index [syntax, statement], "conditional execution", dispatch, ["if keyword", chaining]}}

Não é incomum que código tenha esta aparência:

```{test: no}
if (x == "value1") action1();
else if (x == "value2") action2();
else if (x == "value3") action3();
else defaultAction();
```

{{index "colon character", "switch keyword"}}

Existe uma construção chamada `switch` que se destina a expressar tal "despacho" de forma mais direta. Infelizmente, a sintaxe que JavaScript usa para isso (que herdou da linhagem de linguagens C/Java) é um tanto desajeitada — uma cadeia de instruções `if` pode parecer melhor. Aqui está um exemplo:

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

Você pode colocar quantas etiquetas `case` quiser dentro do bloco aberto por `switch`. O programa começará a executar na etiqueta que corresponde ao valor que `switch` recebeu, ou em `default` se nenhum valor correspondente for encontrado. Ele continuará executando, mesmo através de outras etiquetas, até encontrar uma instrução `break`. Em alguns casos, como o caso `"sunny"` no exemplo, isso pode ser usado para compartilhar código entre casos (ele recomenda ir para fora tanto para tempo ensolarado quanto nublado). Mas tenha cuidado — é fácil esquecer tal `break`, o que fará o programa executar código que você não quer que seja executado.

## Capitalização

{{index capitalization, [binding, naming], [whitespace, syntax]}}

Nomes de binding não podem conter espaços, mas muitas vezes é útil usar múltiplas palavras para descrever claramente o que o binding representa. Essas são basicamente suas opções para escrever um nome de binding com várias palavras:

```{lang: null}
fuzzylittleturtle
fuzzy_little_turtle
FuzzyLittleTurtle
fuzzyLittleTurtle
```

{{index "camel case", "programming style", "underscore character"}}

O primeiro estilo pode ser difícil de ler. Gosto bastante da aparência dos sublinhados, embora esse estilo seja um pouco doloroso de digitar. As funções ((padrão)) do JavaScript, e a maioria dos programadores JavaScript, seguem o último estilo — capitalizam cada palavra exceto a primeira. Não é difícil se acostumar com coisas pequenas assim, e código com estilos de nomeação mistos pode ser irritante de ler, então seguimos essa ((convenção)).

{{index "Number function", constructor}}

Em alguns casos, como na função `Number`, a primeira letra de um binding também é capitalizada. Isso foi feito para marcar essa função como um construtor. Ficará claro o que é um construtor no [Capítulo ?](object#constructors). Por enquanto, o importante é não se incomodar com essa aparente falta de ((consistência)).

## Comentários

{{index readability}}

Frequentemente, código bruto não transmite toda a informação que você quer que um programa transmita para leitores humanos, ou o transmite de forma tão críptica que as pessoas podem não entendê-lo. Em outros momentos, você pode querer incluir alguns pensamentos relacionados como parte do seu programa. É para isso que servem os _((comentário))s_.

{{index "slash character", "line comment"}}

Um comentário é um pedaço de texto que faz parte de um programa mas é completamente ignorado pelo computador. JavaScript tem duas formas de escrever comentários. Para escrever um comentário de uma linha, você pode usar dois caracteres de barra (`//`) e depois o texto do comentário após eles:

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

Um comentário `//` vai apenas até o final da linha. Uma seção de texto entre `/*` e `*/` será ignorada em sua totalidade, independentemente de conter quebras de linha. Isso é útil para adicionar blocos de informação sobre um arquivo ou trecho de programa:

```
/*
  I first found this number scrawled on the back of an old
  notebook. Since then, it has often dropped by, showing up in
  phone numbers and the serial numbers of products that I've
  bought. It obviously likes me, so I've decided to keep it.
*/
const myNumber = 11213;
```

## Resumo

Agora você sabe que um programa é construído a partir de instruções, que por sua vez às vezes contêm mais instruções. Instruções tendem a conter expressões, que por sua vez podem ser construídas a partir de expressões menores.

Colocar instruções uma após a outra lhe dá um programa que é executado de cima para baixo. Você pode introduzir perturbações no fluxo de controle usando instruções condicionais (`if`, `else` e `switch`) e de loop (`while`, `do` e `for`).

Bindings podem ser usados para arquivar pedaços de dados sob um nome, e são úteis para acompanhar estado em seu programa. O ambiente é o conjunto de bindings que são definidos. Sistemas JavaScript sempre colocam uma série de bindings padrão úteis em seu ambiente.

Funções são valores especiais que encapsulam um pedaço de programa. Você pode invocá-las escrevendo `functionName(argument1, argument2)`. Tal chamada de função é uma expressão e pode produzir um valor.

## Exercícios

{{index exercises}}

Se você não tem certeza de como testar suas soluções para os exercícios, consulte a [introdução](intro).

Cada exercício começa com uma descrição do problema. Leia essa descrição e tente resolver o exercício. Se tiver problemas, considere ler as dicas [após o exercício]{if interactive}[no [final do livro](hints)]{if book}. Você pode encontrar soluções completas para os exercícios online em [_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code#2). Se quiser aprender algo com os exercícios, recomendo olhar as soluções apenas depois de ter resolvido o exercício, ou pelo menos depois de tê-lo atacado tempo e esforço suficientes para ter uma leve dor de cabeça.

### Fazendo um triângulo com loop

{{index "triangle (exercise)"}}

Escreva um ((loop)) que faça sete chamadas a `console.log` para exibir o seguinte triângulo:

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

Pode ser útil saber que você pode encontrar o comprimento de uma string escrevendo `.length` após ela.

```
let abc = "abc";
console.log(abc.length);
// → 3
```

{{if interactive

A maioria dos exercícios contém um trecho de código que você pode modificar para resolver o exercício. Lembre-se de que você pode clicar em blocos de código para editá-los.

```
// Seu código aqui.
```
if}}

{{hint

{{index "triangle (exercise)"}}

Você pode começar com um programa que imprime os números de 1 a 7, que pode derivar fazendo algumas modificações no [exemplo de impressão de números pares](program_structure#loops) dado anteriormente no capítulo, onde o loop `for` foi introduzido.

Agora considere a equivalência entre números e strings de caracteres cerquilha. Você pode ir de 1 para 2 adicionando 1 (`+= 1`). Você pode ir de `"#"` para `"##"` adicionando um caractere (`+= "#"`). Assim, sua solução pode seguir de perto o programa de impressão de números.

hint}}

### FizzBuzz

{{index "FizzBuzz (exercise)", loop, "conditional execution"}}

Escreva um programa que use `console.log` para imprimir todos os números de 1 a 100, com duas exceções. Para números divisíveis por 3, imprima `"Fizz"` em vez do número, e para números divisíveis por 5 (e não por 3), imprima `"Buzz"` em vez do número.

Quando isso estiver funcionando, modifique seu programa para imprimir `"FizzBuzz"` para números que são divisíveis por ambos 3 e 5 (e ainda imprimir `"Fizz"` ou `"Buzz"` para números divisíveis por apenas um deles).

(Isso é na verdade uma ((pergunta de entrevista)) que supostamente elimina uma porcentagem significativa de candidatos a programador. Então se você resolveu, seu valor no mercado de trabalho acabou de subir.)

{{if interactive
```
// Seu código aqui.
```
if}}

{{hint

{{index "FizzBuzz (exercise)", "remainder operator", "% operator"}}

Percorrer os números é claramente um trabalho de loop, e selecionar o que imprimir é uma questão de execução condicional. Lembre-se do truque de usar o operador resto (`%`) para verificar se um número é divisível por outro número (tem resto zero).

Na primeira versão, há três resultados possíveis para cada número, então você terá que criar uma cadeia `if`/`else if`/`else`.

{{index "|| operator", ["if keyword", chaining]}}

A segunda versão do programa tem uma solução direta e uma engenhosa. A solução simples é adicionar outro "ramo" condicional para testar precisamente a condição dada. Para a solução engenhosa, construa uma string contendo a palavra ou palavras a serem exibidas e imprima essa palavra ou o número se não houver palavra, potencialmente fazendo bom uso do operador `||`.

hint}}

### Tabuleiro de xadrez

{{index "chessboard (exercise)", loop, [nesting, "of loops"], "newline character"}}

Escreva um programa que cria uma string que representa uma grade 8×8, usando caracteres de nova linha para separar linhas. Em cada posição da grade há um espaço ou um caractere "#". Os caracteres devem formar um tabuleiro de xadrez.

Passar essa string para `console.log` deve mostrar algo assim:

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

Quando tiver um programa que gera esse padrão, defina um binding `size = 8` e mude o programa para que funcione para qualquer `size`, produzindo uma grade da largura e altura fornecidas.

{{if interactive
```
// Seu código aqui.
```
if}}

{{hint

{{index "chess board (exercise)"}}

Você pode construir a string começando com uma vazia (`""`) e repetidamente adicionando caracteres. Um caractere de nova linha é escrito `"\n"`.

{{index [nesting, "of loops"], [braces, "block"]}}

Para trabalhar com duas ((dimensões)), você precisará de um ((loop)) dentro de um loop. Coloque chaves ao redor dos corpos de ambos os loops para facilitar ver onde começam e terminam. Tente indentar adequadamente esses corpos. A ordem dos loops deve seguir a ordem em que construímos a string (linha por linha, da esquerda para a direita, de cima para baixo). Então o loop externo lida com as linhas, e o loop interno lida com os caracteres em uma linha.

{{index "counter variable", "remainder operator", "% operator"}}

Você precisará de dois bindings para acompanhar seu progresso. Para saber se deve colocar um espaço ou um cerquilha em uma dada posição, você pode testar se a soma dos dois contadores é par (`% 2`).

Terminar uma linha adicionando um caractere de nova linha deve acontecer após a linha ter sido construída, então faça isso após o loop interno mas dentro do loop externo.

hint}}
