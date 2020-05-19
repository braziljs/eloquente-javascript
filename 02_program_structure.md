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

Se uma expressão corresponde à um fragmento de expressão, uma _declaração_ JavaScript
corresponde à uma expressão completa. Um programa é uma lista de declarações.

{{index [syntax, statement]}}

A declaração mais simples é uma expressão com um ponto e vírgula após ela. Isso é um programa:

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

Em alguns casos, JavaScript te permite omitir o ponto e vírgula ao final de uma declaração. 
Em outros casos, ele tem que estar ali, ou a próxima ((linha)) será tratada como parte da mesma declaração. 
As regras para quando for seguro omití-lo são de alguma forma complexas e passíveis de erro. 
Então, nesse livro, toda declaração que necessitar de um ponto e vírgula sempre receberá um. 
Eu recomento você fazer o mesmo, pelo menos até você aprender mais sobre a sutileza das ausências do ponto e vírgula.

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
capturar o número que é produzido pela multiplicação 5 por 5.

Após uma ligação ser definida, seu nome pode ser usado como uma
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

Você deveria imaginar ligações como tentáculos, ao invés de caixas.
Elas não _contêm_ valores; elas _pegam_ eles—duas ligações podem se referir ao
mesmo valor. Um programa pode acessar apenas os valores que ainda possui referência. 
Quando você necessita lembrar de algo, você produz um tentáculo para se agarrar a isso
ou você reatribui um de seus tentáculos existentes à isso.

Vamos observar para um outro exemplo. Para se lembrar o número de dólares que
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

Uma única declaração pode definir múltiplas ligações. A
definição de ser separada por vírgulas.

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

Considere um programa que exibe todos ((numero(s) ímpare(s))) de 0 à 12. Uma
forma de escrevê-lo é a seguinte:

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

Ela funciona, mas a ideia de escrever um programa é fazer algo
_menos_ trabalhoso, não mais. Se nós precisássemos todos os números ímpares menores que 1,000,
essa abordagem seria impraticável. O que precisamos é uma forma de executar um pedaçõ de código
multiplas vezes. Essa forma de controle de fluxo é chamada de _((loop))_.

{{figure {url: "img/controlflow-loop.svg", alt: "Controle de fluxo em loop",width: "4cm"}}}

{{index [syntax, statement], "counter variable"}}

O controle de fluxo em loop nos permite retornar à algum ponto no programa
onde estávamos antes e repití-lo com nosso atual estado do programa. Se
nós combinarmos isso com uma ligação que conta, poderíamos fazer algo assim:

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

Uma ((declaração)) começando com a palavra-chave `while` cria um loop. A
palavra `while` é seguida por uma ((expressão)) em parênteses e
então uma declaração, muito parecido com `if`. O loop continua acessando aquela
declaração enquanto a expreção produzir um valor que retorna `true`
quando convertido para Booleano.

{{index [state, in binding], [binding, as state]}}

A ligação `number` demonstra a forma como uma ((ligação)) pode rastrear o
progresso do programa. Toda vez que o loop repetir, `number` recebe um
valor que é 2 à mais que seu estado anterior. No início de toda repetição,
é comparado o número 12 para decidir se o trabalho do programa está concluído.

{{index exponentiation}}

Como um exemplo que atualmente faz algo útil, nós podemos agora escrever um
programa que calcula e exibe o valor de 2^10^ (2 pela 10ª potência). 
Nós usamos duas ligações: uma para rastrear o resulta e uma para contar
com qual frequência nós temos que múltiplicar esse resultado por 2. O loop testa
se a segunda ligação já atingiu 19 e, se não, atualiza ambas ligações.

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

O contador poderia também ter iniciado em `1` e chegado por `<= 10`,
mas por razões que se tornarão aparentes no
but for reasons that will become apparent in [Chapter
?](data#array_indexing), é uma boa idéoa se acostumar a contrar à partir do 0.

{{index "loop body", "do loop", ["control flow", loop]}}

Um loop `do` é uma estrutura de controle similar ao loop `while`. Ele
difere apenas em um ponto: umm loop `do` sempre executa seu corpo pelos menos
uma vez, e começa testando se deveria parar apenas depois da primeira execução.
Para refletir isso, o teste aparece após o corpo do loop.

```
let yourName;
do {
  yourName = prompt("Who are you?");
} while (!yourName);
console.log(yourName);
```

{{index [Boolean, "conversion to"], "! operator"}}

Esse programa irá forçar você a inserir um nome. Irá perguntar novamente e
novamente, até receber algo que não seja uma _string_ vazia. Aplicando o
operador `!` irá converter um valor para o tipo Booleano antes de negá-lo, e
todas as string exceto `""` é convertida para `true`. Isso significa que o loop
continua rodando até você fornecer um nome não-vazio.

## Identação do código

{{index [code, "structure of"], [whitespace, indentation], "programming style"}}

Nos exemplos, eu tenho adicionado espaços à frente das declarações isso
faz parte de uma declaração ainda maior. Esses espaços não são obrigatórios-o computador
irá aceitar muito bem o programa sem eles. De fato, mesmo as quebra de ((linhas))
nos programas são opcionais. Você poderia escrever um programa como
uma longa e única linha se você desejar.

O papel dessa ((identação)) dentro dos ((blocos)) é fazer a estrutura
do código se destacar. No código onde novos blocos são abertos dentro de outros blocos,
pode se tonar difícil de perceber onde um bloco termina e o outro começa.
Com a identação apropriada, a forma visual de um programa corresponde à forma dos blocos dentro dele.
Eu gosto de usar dois espaços para cada abertura bloco aberto, mas gostos diferem-algumas pessoas usam
quatro espaços, e algumas usam ((caracter tab)). O mais importante é que cada novo bloco adicione
a mesma quantidade de espaço.

```
if (false != true) {
  console.log("That makes sense.");
  if (1 < 2) {
    console.log("No surprise there.");
  }
}
```

A maior parte dos programas ((editores)) de código[ (inclusive o usado nesse livro)]{if
interactive} vai ajudar identando automaticamente as novas linhas com o espaçamento apropriado.

## For Loops

{{index [syntax, statement], "while loop", "counter variable"}}

Muitos loops seguem o padrão mostrado nos exemplos do `while`. Primeiro
uma ligação _"counter"_ é criada para rastrear o progresso do loop. Então
vem o loop `while`, normalmente com uma expressão de teste que checa se o _counter_
atingiu o valor final. No fim do corpo do loop, o _counter_ é atualizado para rastrear o progresso.

{{index "for loop", loop}}

Pelo fato desse padrão ser tão comum, JavaScript e linguagens similares
fornecem uma forma mais compreensível e ligeiramente mais curta, o loop `for`.

```
for (let number = 0; number <= 12; number = number + 2) {
  console.log(number);
}
// → 0
// → 2
//   … etcetera
```

{{index ["control flow", loop], state}}

Esse programa é exatamente equivalente ao exemplo [anterior](program_structure#loops) exibindo-número-ímpar.
A única alteração é que as ((declarações)) que estão relacionadas ao
"estado" do loop estão agrupados juntos, após o `for`.

{{index [binding, as state], [parentheses, statement]}}

Os parênteses após a palavra-chave `for` deve conter dois
((ponto-e-vírgula)). A parte antes do primeiro ponto-e-vírgula _inicializa_ o,
normalmente definindo uma ligação. A segunda parte é a
((expressão)) que _checa_ se o loop deve continuar. A parte final
_atualiza_ o estado do loop após cada iteração. Na maioria dos casos,
isso é mais curto e claro que a contrução `while`.

{{index exponentiation}}

Esse é o código que computa 2^10^ usando `for` ao invés de `while`::

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

Ter uma condição do loop produzindo `false` não é a única forma
que um loop pode sinalizar. Existe uma declaração especial chamada `break` que possui
o efeito de imediatamente saltar para fora do loop.

Esse programa ilustra a declaração `break`. Ela procura o primeiro número que é
simultaneamente maior ou igual à 20 e divisivel por 7.

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

Usando o operador resto (`%`) é uma forma fácil de testar se o número é 
divisivel por outro número. Se for, o resto da divisão é zero.

{{index "for loop"}}

A contrução `for` no exemplo não possui a parte que checa
pelo fim do loop. Isso significa que o loop nunca irá parar
a menos que a declaração interna `break` seja executada.

Se você remover a declaração `break` ou você acidentamente escreveu
uma condição final que sempre produz `true`, seu programa ficará
preso em um _((loop infinito))_. Um programa preso em um loop infinito
nunca terminará a execução, o que normalmente é uma coisa ruim.

{{if interactive

Se você crear um loop infinito em um dos exemplos nessas páginas,
você normalmente será questionado se quer finalizar o script após alguns segundos.
Se isso falhar, você terá que fechar a aba que você está trabalhando,
ou em alguns navegadores fechar todo o navegador, para recomeçar.

if}}

{{index "continue keyword"}}

A palavra-chave `continue` é similar ao `break`, ao influenciar o progresso
de um loop. Quando `continue` é encontrado no corpo de um loop,
comanda um salto para fora do corpo e continua com a próxima iteração do loop.
control jumps out of the body and continues with the loop's next
iteration.

## Atualizando ligações resumidamente

{{index assignment, "+= operator", "-= operator", "/= operator", "*= operator", [state, in binding], "side effect"}}

Especialmente quando ao usar um loop, o programa com frequência necessita "atualizar" a ligação
para receber o valor baseado no valor anterior da ligação.

```{test: no}
counter = counter + 1;
```
JavaScript fornece um atalho para isso

```{test: no}
counter += 1;
```
Atalhos similares funcionam para muitos outros operadores, assim como `result *= 2`
para dobrar `result` ou `conter -= 1` para contar regressivamente.

Isso nos permite abreviar um pouco mais nossos exemplos de contagem.

```
for (let number = 0; number <= 12; number += 2) {
  console.log(number);
}
```

{{index "++ operator", "-- operator"}}

Para `counter += 1` e `counter -= 1`, existe ainda uma forma
equivalente, mais curta: `counter++` e `counter--`.

## Enviando um valor com *switch*

{{index [syntax, statement], "conditional execution", dispatch, ["if keyword", chaining]}}

Não é incomum um código se parece com isso:

```{test: no}
if (x == "value1") action1();
else if (x == "value2") action2();
else if (x == "value3") action3();
else defaultAction();
```

{{index "colon character", "switch keyword"}}

Exsite uma construção chamada `switch` que tem a inteção de expressar
o envio de uma forma mai direta. Infelizmente, a sintaxe que o JavaScritp usa para isso
(que é herdada das linhas de linguagem de programação C/Java)
é de alguma forma estranha -uma corrente de declarações `if` talvez 
seria melhor apresentável. Aqui está um exemplo:

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

Você poderia inserir quantos rótulos de `case` quiser dentro de um bloco aberto por `switch`.  
O programa irá iniciar a execução no rótulo que corresponde ao valor que foi dado ao `switch`,
ou pelo `default` e nenhuma combinação de valores for encontrada. Ele irá continuar executando,
mesmo através de outros rótulos, até encontrar uma declaração `break`. Em alguns casos,
assim como o caso `sunny` no exemplo, ele pode ser usado para compartilhar algum código entre _"cases"_
(ele retorna _"going outside"_ para ambos os climas _"sunny"_ e _"cloudy"_).
Mas cuidado-é fácil se esquecer de tal `break`, o que irá fazer o programa executar código que você
não deseja que exetcute.

## Capitalização

{{index capitalization, [binding, naming], [whitespace, syntax]}}

Nomes de ligações não podem conter espaços, mesmo assim usar multiplas palavras
é um facilitador para descrever claramente o que as ligações representam.
Isso é claramente uma decisão sua nomear uma ligação com várias palarvas:

```{lang: null}
fuzzylittleturtle
fuzzy_little_turtle
FuzzyLittleTurtle
fuzzyLittleTurtle
```

{{index "camel case", "programming style", "underscore character"}}

O primeiro estilo pode tornar díficil de ler. Eu particularmente 
prefiro o visual dos underlines, embora esse estilo seja penoso para digitat.
As funções ((padrões)) JavaScript, e a maior parte dos programadores JavaScript,
seguem o último estilo-eles 
underscores, though that style is a little painful to type. The
((standard)) JavaScript functions, and most JavaScript programmers,
follow the bottom style—they escrevem com a primeira letra maiúscula todas as palavras
exceto a primeira.
Não é dificil se acostumar com coisas pequenas como essa, e o código com estilos de nomes
mistos podem se tornar duros de ser ler, então seguimos essa ((conveção)).

{{index "Number function", constructor}}

Em poucos casos, como a função `Number`, a primeira letra de uma ligação também é maiúscula.
Isso é feito para marcar essa função como contrutora. O que é uma função construtora ficará mais claro no
[Capítulo ](object#constructors). Por enquanto, a coisa mais importante é não se incomodar
com essa aparente falta de ((consistência)).

## Comentários

{{index readability}}

Frequentemente, códigos brutos não transmitem toda a informação que você quer
que um programa transmita para um leitor humano, ou eles transmitem de uma forma criptografada
que pessoas podem não entender. Outras vezes, você poderia apenas
desejar incluir alguns pensamentos relacionados como parte de seu programa.
É para isso que _((comentário))s_ são feitos.

{{index "slash character", "line comment"}}

Um comentário é um pedaço de texto que faz parte do programa mas é
completamente ignorado pelo computador. JavaScript possui duas formas de escrever
comentários. Escrever um comentário se única linha, você pode usar dois carácteres de barra
(`//`) e então o texto de comentário após elas.

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

Um comentário `//` vai apenas até o final da linha. Uma seção de texto
entre `/*` e `*/` será ignorado em sua totalidade, independentemente se
possui quebras de linha. Isso é útil para se adicionar blocos de informação sobre um arquivo
ou um pedaço de programa.

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

Você sabe agora que um programa é construido por declarações, as quais
algumas vezes possuem mais declarações. Declarações tendem a conter
expressões, os quais podem ser contruidos de expressões menores.

Colocar declarações após outra declaração the dá um programa que é
executado do topo para baixo. Você pode introduzir alterações no clontrole de fluxo
ao utilizar declarações condicionais (`if`, `else`, e `switch`) e loops (`while`, `do`, e `for`)

Ligações podem ser usadas para arquivar pedaços de dados sob nome, e elas são
úteis para rastrear estados em seu programa. O ambiente é o conjunto de ligações
que são definidas. Sistemas JavaScript sempre coloca um número de ligações padrões úteis
em seu ambiente.

Funções são valores especiais que encapsulam um pedaço de programa. Você
pode invocá-las ao escrever `functionName(argument1, argument2)`. Assim
a chamada de função é uma expressão e pode produzir um valor.

## Exercícios

{{index exercises}}

Se você não tem certeza como testar suas soluções para os exercícios, consulte o
[Introduction](intro).

Cada exercício começa com a descrição do problema. Leia essa descrição e tente resolvê-lo.
Se você tiver problemas, considere a leitura das dicas
[após o exercício]{if interactive}[no [fim do livro](dicas)]{if book}. 
Soluções completas para os exercícios não estão inclusas nesse livro, mas podem ser encontradas
online no [_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code#2).
Se você deseja aprender algo dos exercícios, Eu recomendo consultar as soluções
apenas após ter resolvido o exercício, ou pelo menos após tê-lo atacado 
com força e por tempo suficiente a ponto de ter uma leve dor de cabeça.

### Triângulo com Loop

{{index "triangle (exercise)"}}

Escreva um ((loop)) que faça sete chamadas ao `console.log` para exibir o
triângulo a seguir:

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
Pode ser útil saber que você pode descobrir o comprimento da string ao escrever
`.length` após ela.

```
let abc = "abc";
console.log(abc.length);
// → 3
```

{{if interactive

A maioria dos exercícios contém um pedaço de código que você pode modificar para solucionar
o exercício. Lembre-se que você pode clicar os blocos e código e editá-los.

```
// Your code here.
```
if}}

{{hint

{{index "triangle (exercise)"}}

Você pode começar com um programa que imprima os números 1 à 7, que
você pode derivar ao fazer umas poucas modificações ao 
you can derive by making a few modifications to the [exemplo de impressão de números ímpares](program_structure#loops) 
dado anteriormente no capítulo, onde o loop `for` foi introduzido.

Agora considere a equivalência entre números e strings de caractéres de cerquilha.
Você pode ir de 1 à 2 ao adicionar ' (`+= 1`). Você pode ir de `"#"` para `"##"`
ao adicionar um caracter (`+= "#"`). Desse modo, sua solução pode estar
próxima do programa de impressão de número.

hint}}

### FizzBuzz

{{index "FizzBuzz (exercise)", loop, "conditional execution"}}

Escreva um programa que usa `console.log` para imprimir todos os números de 1 à 100,
com duas exceções. Para números divisíveis por 3, imprima `"Fizz"` ao invés de um número,
e para os números divisíveis por 5 (e não 3), imprima `"Buzz"`.

Quando conseguir fazer isso, modifique seu programa para imprimir `"FizzBuzz"`
para números que são divisíveis por ambos 3 e 5 (e continue imprimindo `"Fizz"` ou `"Buzz"` para números divisíveis 
por apenas um deles).

(Isso é na realidade uma ((questão de entrevista)) que eliminou uma porcentagem  
significante de candidatos à programadores. Então se você resolvê-lo, seu valor no mercado de trabalho
acabou de subir).

{{if interactive
```
// Your code here.
```
if}}

{{hint

{{index "FizzBuzz (exercise)", "remainder operator", "% operator"}}

Exeminar os números é claramente um trabalho para um loop, e selecionar o que
imprimir é uma questão de execução condicional. Lembre-se do truque de usar o
operador resto (`%`) para checar se um número é divisivel por outro (possui um resto de zero).

Na primeira versão, existem três possíveis saídas para cada número,
então você irá criar uma cadeia de `if`/`else if`/`else`.

{{index "|| operator", ["if keyword", chaining]}}

A segunda versão do programa possui uma solução direta e uma inteligente.
A solução simples consiste em adicionar outro "ramo" condicional para
precisamente testar a condição dada. Para a solução inteligente, construir uma _string_
contendo a palavra ou palavras para saída e impressão dessa palavra ou número se não for uma palavra,
potencialmente fazendo um bom uso do operador `||`.


hint}}

### Tabuleiro de Xadrez

{{index "chessboard (exercise)", loop, [nesting, "of loops"], "newline character"}}

Escreva um programa que cria uma _string_ que representa uma grade 8x8,
usando caracteres _newline_ para separar as linhas. À cada posição da grade
existe um espaço ou um carácter "#". Os caracteres deverão formar um tabuleiro de xadrez.

Passando essa _string_ ao `console.log` deve exibir algo assim:

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

Quando você tem um programa que gera esse padrão, defina uma
ligação `size = 8` e altere o programa para que ele funcione para qualquer `tamanho`,
resultando em uma grade com a largura e altura informada.

{{if interactive
```
// Your code here.
```
if}}

{{hint

{{index "chess board (exercise)"}}

Você pode construir a _string_ ao iniciando por uma vazia (`""`) e
repetidamente adicionando characters. Um caracter _newline_ é escrito com `"\n"`.

{{index [nesting, "of loops"], [braces, "block"]}}

Para trabalhar com duas ((dimensões)), você irá precisar de um ((loop)) dentro de um loop.
Coloque chaves em volta do corpo de embos os loops para tornar fácil de identificar
onde eles começam e terminam. Tente identar apropriadamente o corpo dos loops.
A ordem dos loops deve seguir a order que nós contruimos a _string_ 
(linha por lina, esquerda para direita, de cima para baixo).
Então o loop externo cuida das linhas, e o loop interno cuida dos caractéres da linha.

{{index "counter variable", "remainder operator", "% operator"}}

Você irá precisar de duas ligações para rastrear seu progresso. Para saber se deve
coloar um espaço ou uma cerquilha na posição dada, você poderia testar se a soma
dos dois contadores é ímpar (`%2`).

Terminando a linha ao adiconar um caracter _newline_ deve acontecer após a
linha ter sido construida, então faça isso após o loop interno mas dentro do loop externo.

hint}}
