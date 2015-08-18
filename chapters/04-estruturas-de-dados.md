# Estrutura de dados: Object e Array

> Em duas ocasiões, me perguntaram, "Ora, Mr. Babbage, se você colocar em uma calculadora números errados, poderá trazer resultados corretos?" [...] Eu não sou capaz de compreender o tipo de confusão de ideias que poderia provocar tal questão.

> - Charles Babbage, Passages from the Life of a Philosopher (Passagens da vida de um filósofo) (1864)

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