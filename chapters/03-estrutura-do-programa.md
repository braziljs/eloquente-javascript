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

`break case catch continue debugger default delete do else false finally for function if implements in instanceof interface let new null package private protected public return static switch throw true try typeof var void while with yield this`

Não se preocupe em memorizá-las, mas lembre-se que este pode ser o problema quando algo não funcionar como o esperado.

## O Ambiente

A coleção de variáveis e seus valores que existem em um determinado tempo é chamado de `environment` (ambiente). Quando um programa inicia, o ambiente não está vazio. Ele irá conter no mínimo o número de variáveis que fazem parte do padrão da linguagem. E na maioria das vezes haverá um conjunto adicional de variáveis que fornecem maneiras de interagir com o sistema envolvido. Por exemplo, em um navegador, existem variáveis que apontam para funcionalidades que permitem a você inspecionar e influenciar no atual carregamento do website, e ler a entrada do mouse e teclado da pessoa que está usando o navegador.

## Funções

Muitos dos valores fornecidos no ambiente padrão são do tipo *function* (função). Uma função é um pedaço de programa envolvido por um valor. Este valor pode ser aplicado, a fim de executar o programa envolvido. Por exemplo, no ambiente do navegador, a variável `alert` detém uma função que mostra uma pequena caixa de diálogo com uma mensagem. É usada assim:

```javascript

alert("Bom dia!");

```

[Exemplo ao vivo](http://jsfiddle.net/K3Fe3/)

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