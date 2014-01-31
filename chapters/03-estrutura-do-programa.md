# Estrutura do Programa

Este é o ponto onde nós começamos a fazer coisas que podem realmente ser chamadas *programação*. Nós vamos expandir nosso domínio da linguagem JavaScript, para além dos substantivos e fragmentos de sentenças que nós vimos anteriormente, para o ponto onde poderemos realmente expressar algo mais significativo.

## Expressões e Afirmações

No capítulo anterior, nós criamos alguns valores e então aplicamos operadores para então obter novos valores. Criar valores desta forma é uma parte essencial de todo programa JavaScript, mas isso é somente uma parte. Um fragmento de código que produz um valor é chamado de *expressão*. Todo valor que é escrito literalmente (como `22` ou `"psychoanalysis"`) é uma expressão. Uma expressão entre parênteses é também uma expressão, e também um operador binário aplicado a duas expressões, ou um unário aplicado a uma.

Isso mostra parte da beleza da interface baseada na linguagem. Expressões podem ser encadeadas de forma muito semelhante das sub-frases usadas na liguagem humana - uma sub-frase pode conter sua própria sub-frase, e assim por diante. Isto nos permite combinar expressções para expressar arbitrariamente computações complexas.

Se uma expressão corresponde a um fragmento de sentença, uma *afirmação*, no JavaScript, corresponde a uma frase completa em linguagem humana. Um programa é simplesmente uma lista de afirmações.

O tipo mais simples de afirmação é uma expressão com um ponto e vírgula depois dela. Este é o programa:

```javascript

1;
!false;

```

É um programa inútil, entretanto. Uma expressão pode ser apenas para produzir um valor, que pode então ser usado para fechar a expressão. Uma declaração vale por si só, e só equivale a alguma coisa, se ela afeta em algo. Ela pode mostrar algo na tela - que conta como mudar algo - ou pode mudar internamente o stato da máquina de uma forma que vai afetar outras declarações que irão vir. Estas mudanças são chamadas *efeitos colaterais*. As afirmações nos exemplos anterios somente produzem o valor `1` e `true` e então imediatamente os jogam fora novamente. Não deixam nenhuma impressão no mundo. Quando executamos o programa, nada acontece.

## Ponto e vírgula

Em alguns casos, o JavaScript permite que você omita o ponto e vírgula no fim de uma declaração. Em outros casos, ele deve estar lá, ou coisas estranhas irão acontecer. As regras para quando ele pode ser seguramente omitido são um pouco complexas e propensas a erro. Neste livro, todas as declarações que precisam de ponto e vírgula vão sempre terminar com um. Eu recomendo a você fazer o mesmo em seus programas, ao menos até que você aprenda mais sobre as sutilezas envolvidas em retirar o ponto e vírgula.

## Variáveis

Como um programa mantém um estado interno? Como ele se lembra das coisas? Nós vimos como produzir novos valores com valores antigos, mas isso não altera os valores antigos, e o valor novo deve ser imediatamente usado ou vai ser dissipado. Para pegar e guardar valores, o JavaScript fornece um coisa chamada *variável*.

```javascript

var caught = 5 * 5;

```

E isso nos dá um segundo tipo de declaração. A palavra especial (*palavra-chave*) `var` indica que esta sentença vai definir uma variável. Ela é seguida pelo nome da variável e, se nós queremos dá-la imediatamente um valor, por um operador `=` e uma expressão.

A declaração anterior criou uma variável chamada `caught` e usou-a para armazenar o valor que foi produzido pela multiplicação 5 por 5.

Depois de uma variável ter sido definida, seu nome pode ser usado como uma expressão. O valor como uma expressão é o valor atual mantido pela variável. Aqui temos um exemplo:

```javascript

var ten = 10;
console.log(ten * ten);
// 100

```

Nomes de variáveis podem ser quase qualquer palavra, menos as reservadas para palavras-chave (como `var`). Não pode haver espaços incluídos. Dígitos podem também ser parte dos nomes de variáveis - `catch22` é um nome válido, por exemplo - mas um nome não pode iniciar com um dígito. O nome de uma variável não pode incluir pontuação, exceto pelos caracteres `$` e `_`.

Quando uma variável aponta para um valor, isso não significa que estará ligada ao valor para sempre. O operador `=` pode ser usado a qualquer hora em variáveis existentes para desconectá-las de seu valor atual e então apontá-las para um novo:

```javascript

var mood = "light";
console.log(mood);
// ligth
mood = "dark";
console.log(mood);
// dark

```

Você deve imaginar variáveis como tentáculos, ao invés de caixas. Elas não *contém* valores; elas os *agarram* - duas variáveis podem referenciar o mesmo valor. Somente os valores que o programa mantém tem o poder de ser acessado por ele. Quando você precisa de lembrar de algo, você aumenta o tentáculo para segurar ou recoloca um de seus tentáculos existentes para fazer isso.

Quando você define uma variável sem fornecer um valor a ela, o tentáculo fica conceitualmente no ar - ele não tem nada para segurar. Quando você pergunta por um valor em um lugar vazio, você recebe o valor `undefined`.

![Polvo](../img/octopus.jpg)

Um exemplo. Para lembrar da quantidade de dólares que Luigi ainda lhe deve, você cria uma variável. E então quando ele lhe paga 35 dólares, você dá a essa variável um novo valor.

```javascript

var luigisDebt = 140;
luigisDebt = luigisDebt - 35;
console.log(luigisDebt);
// 105

```

## Palavras-chave e Palavras Reservadas

Nomes que tem um significado especial, como `var`, não podem ser usados como nomes de variáveis. Estes são chamados *keywords* (palavras-chave). Existe também um número de palavras que são "reservadas para uso" em futuras versões do JavaScript. Estas também não são oficialmente autorizadas a serem utilizadas como nomes de variáveis, embora alguns ambientes JavaScript as permitam. A lista completa de palavras-chave e palavras reservadas é bastante longa:

`break` `case` `catch` `continue` `debugger` `default` `delete` `do` `else` `false` `finally` `for` `function` `if` `implements` `in` `instanceof` `interface` `let` `new` `null` `package` `private` `protected` `public` `return` `static` `switch` `throw` `true` `try` `typeof` `var` `void` `while` `with` `yield` `this`

Não se preocupe em memorizá-las, mas lembre-se que este pode ser o problema quando algo não funcionar como o esperado.

## O Ambiente

A coleção de variáveis e seus valores que existem em um determinado tempo é chamado de `environment` (ambiente). Quando um programa inicia, o ambiente não está vazio. Ele irá conter no mínimo o número de variáveis que fazem parte do padrão da linguagem. E na maioria das vezes haverá um conjunto adicional de variáveis que fornecem maneiras de interagir com o sistema envolvido. Por exemplo, em um navegador, existem variáveis que apontam para funcionalidades que permitem a você inspecionar e influenciar no atual carregamento do website, e ler a entrada do mouse e teclado da pessoa que está usando o navegador.

## Funções

Muitos dos valores fornecidos no ambiente padrão são do tipo *function* (função). Uma função é um pedaço de programa envolvido por um valor. Este valor pode ser aplicado, a fim de executar o programa envolvido. Por exemplo, no ambiente do navegador, a variável `alert` detém uma função que mostra uma pequena caixa de diálogo com uma mensagem. É usada assim:

```javascript

alert("Bom dia!");

```

[JSFiddle](http://jsfiddle.net/K3Fe3/)

Executar uma função é denominado *invocando*, *chamando* ou *aplicando* uma função. A notação para fazer isso é colocar um parênteses depois de uma expressão que produza um valor de uma função. Normalmente você vai referenciar diretamente a uma variável que detém uma função. Os valores entre os parênteses são dados ao programa dentro da função. No exemplo, a função `alert` usou a string que foi dada como o texto para ser mostrado na caixa de diálogo. Valores dados a funções são chamados *argumentos*. A função `alert` precisa somente de um, mas outras funções podem precisar de diferentes quantidades ou tipos de argumentos.

## A Função `console.log`

A função `alert` pode ser útil como saída do dispositivo quando experimentada, mas clicar sempre em todas estas pequenas janelas vai lhe irritar. Nos exemplos passados, nós usamos `console.log` para retornar valores. A maioria dos sistemas JavaScript (incluindo todos os navegadores modernos e o node.js), fornecem uma função `console.log` que escrevem seus argumentos em algum texto na saída do dispositivo. Nos navegadores, a saída fica no console JavaScript, que é uma parte da interface do usuário escondida por padrão, mas que pode ser encontrada navegando no menu e encontrando um item do tipo "web console" ou "developer tools" (ferramenta do desenvolvedor), usualmente dentro do sub-menu "Tools" (ferramentas) ou "Developer" (desenvolvedor).

Quando rodamos os exemplos, ou seu próprio código, nas páginas deste livro, o `console.log` vai mostrar embaixo o exemplo, ao invés de ser no console JavaScript.

```javascript

var x = 30;
console.log("o valro de x é ", x);
// o valor de x é 30

```

Embora eu tenha afirmado que nomes de variáveis não podem conter pontos, `console.log` claramente contém um ponto. Eu não tinha mentido para você. Esta não é uma simples variável, mas na verdade uma expressão que retorna o campo `log` do valor contido na variável `console`. Nós vamos entender o que isso significa no capítulo 4.

## Retornando Valores

Mostrar uma caixa de diálogo ou escrever texto na tela é um efeito colateral. Muitas funções são úteis por causa dos efeitos que elas produzem. É também possível para uma função produzir um valor, no caso dela não ser necessário um efeito colateral. Por exemplo, temos a função `Math.max`, que pega dois números e retorna o maior entre eles:

```javascript

console.log(Math.max(2, 4));

```

Quando uma função produz um valor, é dito que ela *retorna* (return) ele. Por coisas que produzem valores sempre serem expressões no JavaScript, funções chamadas podem ser usadas como parte de uma grande expressão:

```javascript

console.log(Math.min(2, 4) + 100);

```

O próximo capítulo explica como nós podemos escrever nossas próprias funções.

## Solicitar e Confirmar

O ambiente fornecido pelos navegadores contém algumas outras funções para mostrar janelas. Você pode perguntar a um usuário uma questão "Ok/Cancel" usando `confirm`. Isto retorna um booleano: `true` se o usuário clica em OK e `false` se o usuário clica em Cancel.

```javascript

confirm("");

```

[JSFiddle](http://jsfiddle.net/4gX5m/)

`prompt` pode ser usado para criar uma questão "aberta". O primeiro argumento é a questão; o segundo é o texto que o usuário inicia. Uma linha do texto pode ser escrita dentro da janela de diálogo, e a função vai retornar isso como uma string.

```javascript

prompt("Diga-me algo que você saiba.", "...");

```

[JSFiddle](http://jsfiddle.net/bsfxA/)

Estas duas funções não são muito usadas na programação moderna para web, principalmente porque você não tem controle sobre o modo que a janela vai aparecer, mas ela são úteis para programas para brincar e experimentos.

## Fluxo de Controle

Quando seu programa contém mais que uma declaração, as declarações são executadas, previsivelmente, de cima para baixo. Como um exemplo básico, este programa tem duas declarações. A primeira pergunta ao usuário por um número, e a segunda, que é executada posteriormente, mostra o quadrado deste número:

```javascript

var theNumber = Number(prompt("Pick a number", ""));
alert("Your number is the square root de " + theNumber * theNumber);

```

A função `Number` converte o valor para um número, que nós usamos porque o resultado de `prompt` é um valor `string`, e nós queremos um número. Existem funções similares chamadas `String` e `Boolean` que convertem valores para estes tipos.

Aqui podemos ver uma representação bem trivial do fluxo de controle em linha reta:

![Linha de Fluxo de Controle](../img/controlflow_straight.png)

## Execução Condicional

Executando declarações em ordem linear não é a única opção que temos. Uma requisição comum é a execução condicional, onde nós escolhemos entre duas rotas diferentes baseado em um valor booleano.

![Fluxo de Controle If](../img/controlflow_if.png)

A execução condicional é escrita em JavaScript com a palavra-chave `if`. De forma simplificada, nós somente queremos que algum código seja executado se (`if`), e somente se, uma certa condição existir. Por exemplo, no programa anterior, nós poderíamos querer mostrar o quadrado da entrada somente se a entrada for realmente um número.

```javascript

var theNumber = Number(prompt("Digite um número", ""));
if (!isNaN(theNumber))
	alert("Seu número é a raiz quadrada de " + 
			theNumber * theNumber);

```

Com essa modificação, se você entrar com "queijo" - ou não digitar nada - nenhuma saída será retornada.

A palavra chave `if` é usada para executar ou pular uma declaração dependendo do valor da expressão booleana. Ela é sempre seguida por uma expressão entre parênteses, e então uma declaração.

A função `isNaN` é uma função padrão que retorna `true` se o argumento dado a ela é `NaN`. A função `Number` retorna `NaN` quando você fornece a ela uma string que não representa um número válido. Então, a condição expressa "salvo que `theNumber` não seja um número, faça isso".

Frequentemente você tem não apenas código que deve ser executado quando uma certa condição é verificada, mas também código que manipula outros casos, quando a condição não confere. A palavra-chave `else` pode ser usada, juntamente com `if`, para criar dois caminhos separados e paralelos que executam de acordo com suas condições:

```javascript

var theNumber = Number(prompt("Digite um número", ""));
if (!isNaN(theNumber))
	alert("Seu número é a raiz quadrada de " + 
			theNumber * theNumber);
else
	alert("Ei! Por que você não me deu um número?");
	

```

Se nós tivermos mais que dois caminhos que queremos escolher, múltiplos pares de `if`/`else` podem ser "encadeados" conjuntamente. Aqui temos um exemplo:

```javascript

var num = Number(prompt("Digite um número", "0"));

if (num < 0)
	alert("Pequeno");
else if (num < 100)
	alert("Médio");
else
	alert("Grande");

```

Este programa vai primeiramente checar se `num` é menor que 10. Se ele for, ele escolhe essa ramificação, e mostra "Pequeno", e pronto. Se não for, ele pega a ramificação `else`, que contém o segundo `if`. Se a segunda condição (`< 100`) for verdadeira, isso significa que o número está entre 10 e 100, e `Médio` será mostrado. Se não, o segundo e último `else` será escolhido.

O esquema de setas para este programa parece com algo assim:

![Fluxo de Controle do Aninhamento if](../img/controlflow_nested_if.png)

## Loops While e Do

Considere um programa que imprimi todos os numéros pares de 0 a 12. Uma forma de se escrever isto é a seguinte:

```javascript

console.log(0);
console.log(2);
console.log(4);
console.log(6);
console.log(8);
console.log(10);
console.log(12);

```

Isto funciona, mas a ideia de escrever um programa é a de fazer algo ser *menos* trabalhoso, e não mais. Se nós precisarmos de todos os números pares menores que 1.000, o programa anterior se torna impraticável. O que nós precisamos é de uma forma de repetir código - um *loop*.

![Fluxo de Controle do Loop](../img/controlflow_loop.png)

O fluxo de controle do loop nos permite voltar a um mesmo ponto do programa onde estávamos anteriormente, e repetí-lo no contexto da nossa declaração atual do programa. Se nós combinarmos isso com uma variável que conta, nós podemos fazer isso:

```javascript

var number = 0;
while (number <= 12) {
	console.log(number);
	number = number + 2;
}
// 0
// 2 
// etc...

```

Uma declaração iniciando com a palavra `while` cria um loop. A palavra `while` é seguida por uma expressão em parênteses e então uma declaração, como um `if`. O loop age continuando a executar a declaração enquanto a expressão produzir um valor que é `true`, quando convertido para o tipo booleano.


Por causa de querermos fazer duas coisas dentro do loop, imprimir o número atual e adicionar 2 a nossa variável, nós envolvemos as duas declarações com chaves `{}`. Chaves, para declarações, são similares aos parênteses para expressões, elas as agrupam, fazendo que sejam vistas como uma simples declaração.

Então, a variável `number` demonstra o caminho que a variável pode tomar no progresso do programa. Toda hora que o loop se repete, ele é incrementado por 2. Então, no início de toda repetição, ele é comparado com o número 12 para decidir se o programa terminou todo o trabalho que era pretendido a se fazer.

Como exemplo de algo realmente útil, podemos agora escrever um programa que calcula e mostra o valor de 2¹⁰ (2 elevado a décima potência). Nós usamos duas variáveis: uma para manter o registro do nosso resultado e uma para contar quantas vezes multiplicamos este resultado por 2. O loop teste se a segunda variável já atingiu 10 e então atualiza ambas variáveis.

```javascript

var result = 1;
var counter = 0;
while (counter < 10) {
	result = result * 2;
	counter = counter + 1;
}
console.log(result);
// 1024

```

O contador pode também iniciar com 1 e checar por `<= 10`, mas, por razões que vamos ver mais a frente, é uma boa ideia usar a contagem iniciando com 0.

Uma estrutura muito similar é o loop `do`. Ele difere somente em um ponto do loop `while`: ele sempre vai executar este a declaração uma vez, e somente então vai iniciar o teste e verificar se precisa pausar. Para demonstrar, o teste é escrito abaixo do corpo do loop:

```javascript

do {
	var name = prompt("Who are you?");
} while (!name) {
	console.log(name);
}

```

Isto vai forçar você a entrar com um nome, perguntando de novo e de novo até que pegue algo que não é uma string vazia. (Aplicando o operador `!` vamos converter o valor para o tipo booleano negando o mesmo, e todas as strings exceto `""` convertem em `true`).

## Indentando Código

Você deve ter notado os espaços que coloco na frente das declarações. Eles não são necessários - o computador vai aceitar o programa muito bem sem eles. De fato, as quebras de linhas nos programas também são opcionais. Você pode escrevê-las como uma linha simples se quiser. O papel da indentação dentro dos blocos é fazer com que se destaque a estrutura do código. Por causa de novos blocos poderem ser abertos dentro de outros blocos, em códigos complexos isto pode se tornar difícil de se ver onde um bloco terminar e outro inicia. Com uma indentação correta, o formato visual de um programa corresponde a forma do bloco dentro dele. Eu gosto de usar 2 espaços para cada bloco aberto, mas gostos são diferentes - algumas pessoas usam quatro espaços, e algumas usam caracteres tab.

## Loops For

Loops sempre seguem o mesmo padrão, como visto nos exemplos acima do `while`. Primeiro, uma variável "contadora" é criada. Esta variável registra o progresso do loop. Então, vem o loop `while`, que testa a expressão geralmente checando se o contador alcançou algum limite. No fim do corpo do loop, o contador é atualizado para o registro do progresso.

Por este padrão ser muito comum, o JavaScript e linguagens similares oferecem uma forma ligeiramente mais curta e compreensiva:

```javascript

for (var number = 0; number <= 12; number = number + 2)
	console.log(number);
// 0
// 2
// etc

```

Este programa é exatamente o equivalente ao exemplo anterior de *número-sempre-impresso*. A única alteração é que todas as declarações que estão relacionadas ao "estado" do loop estão agora em somente uma linha.

O parênteses após a palavra-chave `for` é obrigado a conter dois "ponto e vírgula" (`;`). A parte antes do primeiro ponto e vírgula *inicializa* o loop, normalmente definindo uma variável. A segunda parte é a expressão que *checa* se o loop vai continuar. A parte final *atualiza* o estado do loop após cada interação. Na maioria dos casos, isto é mais enxuto e limpo que uma construção `while`.

Aqui temos o código que computa 2¹⁰, usando `for` ao invés de `while`:

```javascript

var result = 1;
for (var counter = 0; counter < 10; counter = counter + 1)
  result = result * 2;
console.log(result);
//1024

```

Note que mesmo se não abrirmos um bloco com `{`, a declaraão no loop continua indentada com dois espaços para deixar claro que ela "pertence" a linha anterior a ela.

## Saindo de um Loop

Ter uma condição que produza `false` não é a única maneira que um loop pode parar. Existe uma declaração especial, `break`, que tem o efeito de pular imediatamente fora do loop em questão.

Este programa encontra o primeiro número que é maior ou igual a 20, e divisível por 7:

```javascript

for (var current = 20; ; current++) {
	if (current % 7 == 0)
		break;
}
console.log(current);
// 21

```

O truque com o operador de resto `%` é uma maneira fácil de testar se um número é divisível por outro número. Se for, o resto da divisão é zero.

A construção `for` neste exemplo não tem uma parte que checa pelo fim do loop. Isso significa que essa tarefa depende da declaração `break` dentro dela para a fazer parar.

Se a declaração `break` faltar, ou acidentalmente tivermos uma condição que sempre produz `true`, você terá o chamado *loop infinito*. Um programa rodando um loop infinito nunca vai parar de rodar, que é normalmente uma coisa ruim.

Se você criar um loop infinito em algum dos exemplos desta página, você vai ser perguntando se quer parar o script após alguns segundos. Se isso falhar, você terá que fechar a aba que você está trabalhando, ou em alguns navegadores você terá que fechar todo ele, a fim de recuperá-lo.

## Atualizando variáveis Suscintamente

Um programa, especialmente quando em loop, frequentemente precisa de "atualizar" uma variável com um valor que é baseado no valor anterior.

```javascript

counter = counter + 1;

```

O JavaScript fornece um atalho para isso:

```javascript

counter += 1;

```

Isto também funciona para várias outras operações, como `result *= 2` para dobrar `result`, ou `counter -= 1` para contar abaixo.

Isto nos permite encurtar nosso exemplo de contagem um pouco mais:

```javascript

for (var number = 0; number <= 12; number += 2)
	console.log(number);

```

Para `counter += 1` e `counter -= 1`, sempre temos um equivalente mais curto: `counter++` e `counter--`

## Enviando um Valor com `switch`

É comum para um código se parecer com algo assim:

```javascript

if (variable == "value1") action1();
else if (variable == "value2") action2();
else if (variable == "value3") action3();
else defaultAction();

```

Há um construtor chamado `switch` que visa resolver o "envio" de valores de forma mais direta. Infelizmente, a sintaxe JavaScript usada para isso (que é herdada da linha de linguagens de programação C e Java) é um pouco estranha - frequentemente uma cadeia de declarações `if` continua parecendo melhor. Aqui um exemplo:

```javascript

switch (prompt("Como está o tempo?")) {
	case "rainy":
		console.log("Lembre-se de trazer um guarda-chuva.");
		break;
	case "ensolarado":
		console.log("Vista roupas leves");
	case "nublado":
		console.log("Vá lá fora.");
		break
	default:
		console.log("Tempo desconhecido");
		break;
}

```

Dentro do bloco aberto pelo `switch`, você pode colocar qualquer número de rótulos `case`. O programa vai pular para o rótulo correspondente ao valor que `switch` fornece, ou para `default` se nenhum valor for encontrado. Então ele começa a executar as declarações aqui, e continuar a passar pelos rótulos, até que encontra uma declaração `break`. Em alguns casos, como o caso `"ensolarado"` do exemplo, podemos usá-lo para compartilhar algum código entre casos (ele recomenda *ir lá fora* para ambos os tempos "ensolarado" e "numblado"). Mas cuidado, é muito fácil se esquecer de um `break`, que vai causar ao programa a execução de código que você não gostaria de executar.

## Capitalização

Nomes de variáveis não podem conter espaços, no entanto é muito útil usar múltiplas palavras para descrever claramente o quê a variável representa. Suas escolhas para escrever nomes de variáveis com muitas palavras são como estas:

```

fuzzylittleturtle
fuzzy_little_turtle
FuzzyLittleTurtle
fuzzyLittleTurtle

```

O primeiro estilo é difícil de ler. Pessoalmente, eu gosto de usar underscores `_`, embora seja um pouco doloroso de escrever. Entretanto, o padrão das funções JavaScript, e da maioria dos programadores JavaScript, é o de seguir o último estilo - eles capitalizam toda palavra exceto a primeira. Isso não é difícil se acostumar com pequenas coisas assim, e o código com os estilos de nomes mistos pode se tornar desagrádavel para leitura, então vamos seguir esta convenção.

Em poucos casos, como a função `Number`, a primeira letra da variável é também capitalizada. Isso é feito para marcar a função como um construtor. O que um construtor é vai ser esclarecido no capítulo 6. Por agora, o importante é não ser incomodado com esta aparente falta de consistência.

## Comentários

Frequentemente, código puro não transmite todas as informações necessárias que você gostaria que tivessem para leitura de humanos, ou transmitem de forma oculta de maneira que você se preocupa se as pessoas realmente vão entendê-lo. Em outros momentos, você está apenas se sentindo poético ou quer anotar alguns pensamentos como parte de seu programa. Isto é o quê eles são e para quê os comentários existem.

Um comentário é um pedaço de texto que é parte de um programa, mas completamente ignorado pelo computador. No JavaScript temos duas maneiras de escrever comentários. Para escrever uma linha única de comentário, você pode usar dois caracteres barra ( `//` ) e então o comentário após isso.

```javascript

var accountBalance = calculateBalance(account);
// It's a green hollow where a river sings
accountBalance.adjust();
// Madly catching white tatters in the grass.
var report = new Report();
// Where the sun on the proud mountain rings:
addToReport(accountBalance, report);
// It's a little valley, foaming like light in a glass.

```

Um `// comentário` vai até o fim da linha. Uma seção de texto entre `/*` e `*/` vai ser ignorada, independentemente se ela contém quebras de linha. Isto é útil para adicionar blocos de informação sobre um arquivo ou um pedaço do programa.

```javascript

/*
 I first found this number scrawled on the back of one of
 my notebooks a few years ago. Since then, it has
 occasionally dropped by, showing up in phone numbers and
 the serial numbers of products that I bought. It
 obviously likes me, so I've decided to keep it.
*/

var theNumber = 11213;

```

## Resumo

Você agora sabe que um programa é construído de declarações, que as vezes contém mais declarações. Declarações tendem a conter expressões, que podem também ser feitas de pequenas expressões.

Colocar declarações uma embaixo da outra nos dá um programa que é executado de cima para baixo. Você pode introduzir distúrbios no fluxo de controle usando declarações condicionais (`ìf`, `else` e `swtich`) e loops (`while`, `do` e `for`).

Variáveis podem ser usadas para arquivar pedaços de dados sob um nome, e são úteis para rastrear o estado de um programa. O ambiente é o conjunto de variáveis que são definidas em um programa. O sistema JavaScript sempre coloca um número padrão de variáveis úteis dentro de seu ambiente.

Funções são valores especiais que encapsulam um pedaço de programa. Você pode invocá-las escrevendo `function Name (argument1, argument2) {}`, que é uma expressão que vai pode produzir um valor.

## Exercícios

Cada exercício começa com uma descrição de um problema. Tente lê-lo e resolvê-lo. Se você dificuldades, você pode considerar ler as dicas abaixo do exercício. As soluções completas e as dicas para os exercícios não estarão inclusas neste livro, mas serão indicadas após a apresentação dos mesmos. Se você quiser aprender algo, eu recomendo que veja as soluções somente depois que você tiver resolvido o exercício, ou pelo menos tentado resolvê-lo por um longo tempo, até que o mesmo tenha lhe provocado uma pequena dor de cabeça.

### Criando um Triângulo com Loop

Escreva um programa que faça 7 chamadas a `console.log()` para retornar o seguinte triângulo.

	#
	##
	###
	####
	#####
	######
	#######

Confira uma dica de como resolver [aqui](https://gist.github.com/eoop/8730846) e a resolução [aqui](https://gist.github.com/eoop/8730768).

### FizzBuzz