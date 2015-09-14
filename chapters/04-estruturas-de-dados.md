# Estrutura de dados: Object e Array

> Em duas ocasiões me perguntaram, "Ora, Mr. Babbage, se você colocar em uma máquina números errados, poderá trazer resultados corretos?" [...] Eu não sou capaz de compreender o tipo de confusão de ideias que poderia provocar tal questão.

> - Charles Babbage, Passages from the Life of a Philosopher (1864)

Números, Booleanos e _strings_ são os tijolos usados para construir as estruturas de dados. Mas você não pode construir uma casa com um único tijolo. Objetos nos permitem agrupar valores - incluindo outros objetos - juntos e assim construir estruturas mais complexas.

Os programas que construímos até agora têm sido seriamente dificultados pelo fato de que eles só estavam operando com tipos de dados simples. Este capítulo irá adicionar uma compreensão básica de estruturas de dados para o seu kit de ferramentas. Ao final dele, você vai saber o suficiente para começar a escrever programas úteis.

O capítulo vai funcionar mais ou menos de um exemplo realista de programação, introduzindo conceitos que se aplicam ao problema em questão. O código de exemplo, muitas vezes, será construído sobre as funções e variáveis ​​que foram introduzidas no início do texto.

## O esquilo-lobo

De vez em quando, geralmente entre às oito e dez da noite, Jaques se transforma em um pequeno roedor peludo com uma cauda espessa.

Por um lado, Jaques está tão contente que ele não tem licantropia clássica. Transformando-se em um esquilo tende a causar menos problemas do que se transformando em um lobo. Em vez de ter de se preocupar em comer acidentalmente o vizinho (que seria estranho), ele se preocupa em ser comido pelo gato do vizinho. Depois de duas ocasiões em que ele acordou em um galho fino precariamente na copa de um carvalho, nu e desorientado, ele resolveu trancar as portas e janelas de seu quarto à noite, e colocar algumas nozes no chão para manter-se ocupado.

![The weresquirrel](../img/weresquirrel.png)

Isto cuida dos problemas do gato e do carvalho. Mas Jaques ainda sofre com sua condição. As ocorrências irregulares da transformação fazem-no suspeitar de que pode haver algum gatilho que faz com que elas aconteçam. Por um tempo, ele acreditava que isso só acontecia nos dias em que ele havia tocado em árvores. Então ele parou de fazer isso por completo, e evitando até mesmo passar perto delas. Mas o problema persistiu.

Mudando para uma abordagem mais científica, Jaques quer começar a manter um registo diário das coisas que ele faz e se ele acabou mudando de forma. Com esses dados ele espera ser capaz de diminuir as condições que desencadeiam as transformações.

A primeira coisa que ele fará será criar um conjunto de dados para armazenar essas informações.

## Conjuntos de dados

Para trabalhar com um pedaço de dados digitais, teremos primeiro que encontrar uma maneira de representá-los na memória de nossa máquina. Dizer, como um exemplo muito simples, que queremos representar uma coleção de números: 2, 3, 5, 7 e 11.

Poderíamos ser criativos com _strings_ - afinal, _strings_ podem ter qualquer comprimento, assim você pode colocar muitos dados nelas - e usar o "2 3 5 7 11" como a nossa representação. Mas isso é estranho. Você teria que, de alguma forma, extrair os dígitos e convertê-los de volta para número para acessá-los.

Felizmente, JavaScript fornece um tipo de dados especificamente para armazenar sequências de valores. Ele é chamado de _array_, e é escrito como uma lista de valores entre colchetes, separados por vírgulas.

```js
var listOfNumbers = [2, 3, 5, 7, 11];
console.log(listOfNumbers[1]);
// → 3
console.log(listOfNumbers[1 - 1]);
// → 2
```

A notação para a obtenção de elementos dentro de uma matriz também usa colchetes. Um par de colchetes, imediatamente após uma expressão, com uma expressão dentro deles, vai procurar o elemento da expressão à esquerda que corresponde ao índice determinado pela expressão entre colchetes.

O primeiro índice de um _array_ é o zero, e não um. Assim, o primeiro elemento pode ser lido como: `listOfNumbers[0]`. Se você não tem experiência com a programação, isso pode levar algum tempo para se acostumar. Contagem baseada em zero tem uma longa tradição na tecnologia, e desde que essa convenção é constantemente seguida (o que ela é, em JavaScript), ela funciona muito bem.

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

Para variáveis binárias (boolean), o coeficiente phi (ϕ) fornece uma boa medida de correlação, e é relativamente fácil de calcular. Primeiro temos uma matriz n, que indica o número de vezes que foram observadas as várias combinações das duas variáveis. Por exemplo, poderíamos tomar o evento de comer pizza, e colocar isso em uma tabela como esta:

![Comendo Pizza x transformar-se em esquilo](https://rawgit.com/ericdouglas/eloquente-javascript/master/img/pizza-squirrel.svg)

A partir de uma tal tabela (n), o coeficiente de phi (φ) pode ser calculado pela seguinte fórmula.

```math
ϕ =
n11n00 - n10n01
√ n1•n0•n•1n•0
```

A notação n01 indica o número de ocorrências na qual a primeira variável (squirrelness) é falsa (0) e a segunda variável (pizza) é verdadeira (1). Nesse exemplo, n01 é igual a 9.

O valor n1• se refere à soma de todas as ocorrências em que a primeira variável é verdadeira, que no caso do exemplo da tabela é 5. Da mesma forma, n•0 se refere à soma de todas as ocorrências na qual a segunda variável é falsa.

Portanto, para a tabela de pizzas, a parte de cima da divisão da linha (o dividendo) seria 1×76 - 4×9 = 40, e a parte de baixo (o divisor) seria a raiz quadrada de 5×85×10×80, ou √340000. Esse cálculo nos resulta em ϕ ≈ 0.069, o que é um valor bem pequeno. Comer pizza parece não ter influência nas transformações.

## Correlação em computação

No JavaScript, podemos representar uma tabela dois por dois usando um array com quatro elementos (`[76, 9, 4, 1]`). Podemos também usar outras formas de representações, como por exemplo um array contendo dois arrays com dois elementos cada (`[[76, 9], [4, 1]]`) ou até um objeto com propriedades nomeadas de `"11"` e `"01"`. Entretanto, a maneira mais simples e que faz com que seja mais fácil acessar os dados é utilizando um array com quatro elementos. Nós iremos interpretar os índices do array como elementos binários de dois bits, onde o dígito a esquerda (mais significativo) se refere à variável do esquilo, e o dígito a direita (menos significativo) se refere à variável do evento. Por exemplo, o número binário `10` se refere ao caso no qual Jacques se tornou um esquilo, mas o evento não ocorreu (por exemplo "pizza"). Isso aconteceu quatro vezes, e já que o número binário `10` é equivalente ao número 2 na notação decimal, iremos armazenar esse valor no índice 2 do array.

Essa é a função que calcula o coeficiente ϕ de um array desse tipo:

```js
function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}

console.log(phi([76, 9, 4, 1]));
// → 0.068599434
```

Essa é simplesmente uma tradução direta da fórmula de ϕ para o JavaScript. `Math.sqrt` é a função que calcula a raiz quadrada, fornecida pelo objeto `Math` que é padrão do JavaScript. Temos que somar dois campos da tabela para encontrar valores como n1•, pois a soma das linhas ou colunas não são armazenadas diretamente em nossa estrutura de dados.

Jacques manteve seu diário por três meses. O conjunto de dados resultante está disponível no ambiente de código desse capítulo e está armazenado na variável `JOURNAL` e em um [arquivo](http://eloquentjavascript.net/code/jacques_journal.js) que pode ser baixado.

Para extrair uma tabela dois por dois de um evento específico desse diário, devemos usar um loop para percorrer todas as entradas e ir adicionando quantas vezes o evento ocorreu em relação às transformações de esquilo.

```js
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
```

A função `hasEvent` testa se uma entrada contém ou não o evento em questão. Os arrays possuem um método `indexOf` que procura o valor informado no array (nesse exemplo o nome do evento), e retorna o índice onde ele foi encontrado ou -1 se não for. Portanto, se a chamada de `indexOf` não retornar -1, sabemos que o evento foi encontrado.

O corpo do loop em `tableFor`, descobre qual caixa da tabela cada entrada do diário pertence, verificando se essa entrada contém o evento específico e se o evento ocorreu juntamente com um incidente de esquilo. O loop adiciona uma unidade no número contido no array que corresponde a essa caixa na tabela.

Agora temos as ferramentas necessárias para calcular correlações individuais. O único passo que falta é encontrar a correlação para cada tipo de evento que foi armazenado e verificar se algo se sobressai. Como podemos armazenar essas correlações assim que as calculamos?

## Objetos como mapas

Uma maneira possível é armazenar todas as correlações em um array, usando objetos com propriedades `name` (nome) e `value` (valor). Porém, isso faz com que o acesso às correlações de um evento seja bastante trabalhoso: você teria que percorrer por todo o array para achar o objeto com o `name` certo. Poderíamos encapsular esse processo de busca em uma função e mesmo assim iríamos escrever mais código e o computador iria trabalhar mais do que o necessário.

Uma maneira melhor seria usar as propriedades do objeto nomeadas com o tipo do evento. Podemos usar a notação de colchetes para acessar e ler as propriedades e, além disso, usar o operador `in` para testar se tal propriedade existe.

```js
var map = {};
function storePhi(event, phi) {
  map[event] = phi;
}

storePhi("pizza", 0.069);
storePhi("touched tree", -0.081);
console.log("pizza" in map);
// → true
console.log(map["touched tree"]);
// → -0.081
```

Um _mapa_ é uma maneira de associar valores de um domínio (nesse caso nomes de eventos) com seus valores correspondentes em outro domínio (nesse caso coeficientes ϕ).

Existem alguns problemas que podem ser gerados usando objetos dessa forma, os quais serão discutidos no [capítulo 6](./06-a-vida-secreta-dos-objetos.md). Por enquanto, não iremos nos preocupar com eles.

E se quiséssemos apenas encontrar os eventos nos quais armazenamos um coeficiente? Diferentemente de um array, as propriedades não formam uma sequência previsível, impossibilitando o uso de um `for` loop normal. Entretanto, o JavaScript fornece uma construção de loop específica para percorrer as propriedades de um objeto. Esse loop é parecido com o loop `for` e se distingue pelo fato de utilizar a palavra `in`.

```js
for (var event in map)
  console.log(“The correlation for ‘” + event +
              “’ is “ + map[event]);
// → The correlation for ‘pizza’ is 0.069
// → The correlation for ‘touched tree’ is -0.081
```

## A análise final

Para achar todos os tipos de eventos que estão presentes no conjunto de dados, nós simplesmente processamos cada entrada e percorremos usando um loop por todos os eventos presentes. Mantemos um objeto chamado `phis` que contém os coeficientes de correlações para todos os tipos de eventos que nós vimos até agora. A partir do momento em que encontramos um tipo que ainda não está presente no objeto `phis`, calculamos o valor de sua correlação e então adicionamos ao objeto.

```js
function gatherCorrelations(journal) {
  var phis = {};
  for (var entry = 0; entry < journal.length; entry++) {
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
```

Vamos ver o que retorna.

```js
for (var event in correlations)
  console.log(event + ": " + correlations[event]);
// → carrot:   0.0140970969
// → exercise: 0.0685994341
// → weekend:  0.1371988681
// → bread:   -0.0757554019
// → pudding: -0.0648203724
// and so on...
```

A grande maioria das correlações tendem a zero. Comer cenouras, pão ou pudim aparentemente não ativam a transformação de esquilo-lobo. Entretanto, acontecem mais frequentemente aos finais de semana. Vamos filtrar os resultados para mostrar apenas as correlações que são maiores do que 0.1 ou menores do que -0.1.

```js
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
```

A-ha! Existem dois fatores nos quais a correlação é mais forte que a dos outros. Comer amendoins tem um forte efeito positivo na chance de se transformar em um esquilo, enquanto escovar os dentes tem um significante efeito negativo.

Interessante. Vamos tentar uma coisa.

```js
for (var i = 0; i < JOURNAL.length; i++) {
  var entry = JOURNAL[i];
  if (hasEvent("peanuts", entry) &&
     !hasEvent("brushed teeth", entry))
    entry.events.push("peanut teeth");
}
console.log(phi(tableFor("peanut teeth", JOURNAL)));
// → 1
```

Está bem evidente! O fenômeno ocorre precisamente quando Jacques come amendoins e não escova os dentes. Se ele não fosse preguiçoso em relação à higiene bucal, ele não sequer teria reparado nesse problema que o aflige.

Sabendo disso, Jacques simplesmente para de comer amendoins e descobre que isso coloca um fim em suas transformações.

Tudo ficou bem com Jacques por um tempo. Entretanto, alguns anos depois ele perdeu seu emprego e eventualmente foi forçado a trabalhar em um circo, onde suas performances como _O Incrível Homem-Esquilo_ se baseavam em encher sua boca com pasta de amendoim antes de cada apresentação. Em um dia de sua pobre existência, Jacques não conseguiu se transformar de volta em sua forma humana e fugiu do circo, desapareceu pela floresta e nunca mais foi visto.

## Further arrayology [TODO]

Antes de finalizar esse capítulo, gostaria de introduzir alguns outros conceitos relacionados a objetos. Começaremos com alguns métodos geralmente úteis dos arrays.

Vimos no [início do capítulo](http://eloquentjavascript.net/04_data.html#array_methods) os métodos `push` e `pop`, os quais adicionam e removem elementos no final do array. Os métodos correspondentes para adicionar e remover itens no início do array são chamados `unshift` e `shift`.

```js
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
```

O programa anterior gerencia uma lista de tarefas. Você pode adicionar tarefas no final da lista chamando `rememberTo("eat")` e, quando estiver preparado para realizar alguma tarefa, você chama `whatIsNext()` para pegar (e remover) o primeiro item da lista. A função `urgentlyRememberTo` também adiciona uma tarefa, porém, ao invés de adicionar no final da lista, a adiciona no início.

O método `indexOf` tem um irmão chamado `lastIndexOf`, que começa a pesquisa de um dado elemento pelo final do array ao invés de começar pelo início.

```js
console.log([1, 2, 3, 2, 1].indexOf(2));
// → 1
console.log([1, 2, 3, 2, 1].lastIndexOf(2));
// → 3
```

Ambos `indexOf` e `lastIndexOf` recebem um segundo argumento opcional que indica onde iniciar a pesquisa.

Outro método fundamental é o `slice`, que recebe um índice de início e outro de parada, retornando um array que contém apenas os elementos contidos no intervalo desses índices. O índice de início é inclusivo e o de parada é exclusivo.

```js
console.log([0, 1, 2, 3, 4].slice(2, 4));
// → [2, 3]
console.log([0, 1, 2, 3, 4].slice(2));
// → [2, 3, 4]
```

Quando o índice de parada não é informado, o `slice` irá pegar todos os elementos após o índice de início. Strings também possuem o método `slice` com um comportamento similar.

O método `concat` pode ser usado para juntar arrays, parecido com o que o operador `+` faz com as strings. O exemplo a seguir mostra ambos `concat` e `slice` em ação, recebendo um array e um índice como argumento e retornando um novo array que é uma cópia do array original, exceto pelo fato de que o elemento no índice informado foi removido.

```js
function remove(array, index) {
  return array.slice(0, index)
    .concat(array.slice(index + 1));
}
console.log(remove(["a", "b", "c", "d", "e"], 2));
// → ["a", "b", "d", "e"]
```

# Strings e suas propriedades

Podemos ler propriedades como `length` e `toUpperCase` de strings. Porém, caso tente adicionar uma nova propriedade, ela não será adicionada.

```js
var myString = "Fido";
myString.myProperty = "value";
console.log(myString.myProperty);
// → undefined
```

Valores do tipo string, number e Boolean não são objetos e por isso, mesmo com o fato da linguagem não reclamar, quando tentamos adicionar novas propriedades, elas não são armazenadas. Os valores são imutáveis e não podem ser alterados.

Mesmo assim, esses tipos possuem propriedades "nativas". Toda string possui uma série de métodos. Provavelmente, alguns dos mais úteis são `slice` e `indexOf`, os quais são parecidos com os métodos de array que possuem o mesmo nome.

```js
console.log("coconuts".slice(4, 7));
// → nut
console.log("coconut".indexOf("u"));
// → 5
```

Uma diferença é que o `indexOf` das strings pode receber uma string contendo mais de um caractere, enquanto o método correspondente no array procura apenas por um único elemento.

```js
console.log("one two three".indexOf("ee"));
// → 11
```

O método `trim` remove todos os espaços vazios (espaços, linhas, tabs e caracteres similares) do começo e do fim de uma string.

```js
console.log("  okay \n ".trim());
// → okay
```

Já vimos a propriedade `length` das strings. Para acessar caracteres individuais de uma string, podemos usar o método `charAt` recebendo propriedades numéricas, da mesma forma que você faria com um array.

```js
var string = "abc";
console.log(string.length);
// → 3
console.log(string.charAt(0));
// → a
console.log(string[1]);
// → b
```

## O Objeto Arguments

Sempre que uma função é invocada, uma variável especial chamada `arguments` é adicionada ao ambiente no qual o corpo da função executa. Essa variável se refere a um objeto que contém todos os argumentos passados à função. Lembre-se de que no JavaScript você pode passar mais (ou menos) argumentos para uma função, independentemente do número de parâmetros que foi declarado.

```js
function noArguments() {}
noArguments(1, 2, 3); // This is okay
function threeArguments(a, b, c) {}
threeArguments(); // And so is this
```

O objeto `arguments` possui a propriedade `length` que nos informa o número de argumentos que realmente foi passado à função. Além disso, contém uma propriedade (0, 1, 2, etc) para cada argumento.

Se isso soa como um array para você, você está certo. Esse objeto é muito parecido com um array, porém, infelizmente, ele não possui nenhum dos métodos de array (como `slice` ou `indexOf`). Portanto, é um pouco mais difícil de se usar do que um array de verdade.

```js
function argumentCounter() {
  console.log(“You gave me”, arguments.length, “arguments.”);
}
argumentCounter(“Straw man”, “Tautology”, “Ad hominem”);
// → You gave me 3 arguments.
```

Algumas funções podem receber qualquer número de argumentos, como no caso de `console.log`. Esses tipos de funções normalmente percorrem por todos os valores em seu objeto `arguments`, e podem ser usadas para criar interfaces extremamente agradáveis. Por exemplo, lembre-se quando criamos as entradas no diário do Jacques.

```js
addEntry([“work”, “touched tree”, “pizza”, “running”,
          “television”], false);
```

Devido ao fato de que essa função irá ser executada muitas vezes, poderíamos criar uma alternativa mais simples.

```js
function addEntry(squirrel) {
  var entry = {events: [], squirrel: squirrel};
  for (var i = 1; i < arguments.length; i++)
    entry.events.push(arguments[i]);
  journal.push(entry);
}
addEntry(true, “work”, “touched tree”, “pizza”,
         “running”, “television”);
```

Essa versão lê o primeiro argumento (`squirrel`) da forma normal e depois percorre o resto dos argumentos (o loop pula o primeiro argumento, iniciando no índice 1) juntando-os em um array.

## O Objeto Math

Como vimos anteriormente, `Math` é uma caixa de ferramentas com funções relacionadas a números, tais como `Math.max` (máximo), `Math.min` (mínimo) e `Math.sqrt` (raiz quadrada).

O objeto `Math` é usado como um _container_ para agrupar uma série de funcionalidades relacionadas. Existe apenas um único objeto `Math` e, na maioria das vezes, ele não é útil quando usado como valor. Mais precisamente, ele fornece um _namespace_ (espaço nominal) para que todas essas funções e valores não precisem ser declaradas como variáveis globais.

Possuir muitas variáveis globais "polui" o _namespace_. Quanto mais nomes são usados, mais prováveis são as chances de acidentalmente sobrescrever o valor de uma variável. Por exemplo, é provável que você queira chamar algo de `max` em um de seus programas. Sabendo que no JavaScript a função nativa `max` está contida de forma segura dentro do objeto `Math`, não precisamos nos preocupar em sobrescrevê-la.

Muitas linguagens irão parar você ou, ao menos, avisá-lo quando tentar definir uma variável com um nome que já está sendo usado.  Como o JavaScript não faz isso, tenha cuidado.

De volta ao objeto `Math`. Caso precise realizar cálculos trigonométricos, `Math` pode ajudá-lo. Ele contém `cos` (coseno), `sin` (seno) e `tan` (tangente), tanto quanto suas funções inversas `aos`, `asin` e `atan` respectivamente. O número π (pi), ou pelo menos a aproximação que é possível ser representada através de um número no JavaScript, está disponível como `Math.PI`. (Existe uma tradição antiga na programação de escrever os nomes de valores constantes em caixa alta).

```js
function randomPointOnCircle(radius) {
  var angle = Math.random() * 2 * Math.PI;
  return {x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)};
}
console.log(randomPointOnCircle(2));
// → {x: 0.3667, y: 1.966}
```

Se senos e cosenos não são algo que seja muito familiar para você, não se preocupe. Quando eles forem usados no [Capítulo 13](./13-document-object-model.md) desse livro, eu lhe explicarei.

O exemplo anterior usa `Math.random`. Essa é uma função que retorna um número "pseudo-aleatório" entre zero (incluído) e um (excluído) toda vez que você a chama.

```js
console.log(Math.random());
// → 0.36993729369714856
console.log(Math.random());
// → 0.727367032552138
console.log(Math.random());
// → 0.40180766698904335
```

Embora os computadores sejam deterministas (sempre reagem da mesma maneira quando são usados os mesmos dados de entrada), é possível fazer com que produzam números que pareçam ser aleatórios. Para fazer isso, a máquina mantém um número (ou uma variedade deles) armazenado em seu estado interno. Toda vez que um número aleatório é requisitado, ela executa algumas complicadas computações deterministas nesse estado interno e então retorna parte do resultado dessas computações. A máquina também utiliza os resultados para mudar o seu próprio estado interno, fazendo com que seja produzido um próximo número “aleatório” diferente.

Se quisermos um número aleatório inteiro, ao invés de um número fracionário, podemos usar `Math.floor` (que arredonda o número para o menor valor inteiro mais próximo) no resultado de `Math.random`.

```js
console.log(Math.floor(Math.random() * 10));
// → 2
```

Multiplicar o número aleatório por dez resulta em um número que seja maior ou igual a zero e menor do que dez. Devido ao fato de que `Math.floor` arredonda o valor para baixo, essa expressão irá produzir, com chances iguais, qualquer número de zero a nove.

Também existem as funções `Math.ceil` (para arredondar o valor para o maior número inteiro mais próximo) e `Math.round` (para arredondar o valor para o número inteiro mais próximo).

## O objeto global

O escopo global (o espaço no qual as variáveis globais residem), também pode ser abordado como um objeto no JavaScript. Cada variável global é representada como uma propriedade desse objeto. Nos navegadores, o objeto do escopo global é armazenado na variável `window`.

```js
var myVar = 10;
console.log("myVar" in window);
// → true
console.log(window.myVar);
// → 10
```

## Resumo

Objetos e arrays (que são tipos específicos de objeto) fornecem maneiras de agrupar uma conjunto de valores em um único valor. Conceitualmente, ao invés de tentar carregar e manter todas as coisas individualmente em nossos braços, eles nos permitem colocar todas as coisas relacionadas dentro de uma bolsa e carregá-las.

Com excessão de `null` e `undefined`, a maioria dos valores no JavaScript possuem propriedades e são acessadas usando `value.propName` ou `value["propName"]`. Objetos tendem a usar nomes para suas propriedades e armazenam mais o menos uma quantidade fixa delas. Por outro lado, os Arrays normalmente contêm quantidades variáveis de valores conceitualmente iguais e usam números (iniciando do zero) como os nomes de suas propriedades.

Existem algumas propriedades nos arrays, como `length` e uma série de métodos. Métodos são funções que são armazenadas em propriedades e, normalmente, atuam no valor nas quais elas são propriedade.

Objetos podem também ser usados como mapas, associando valores com seus nomes. O operador `in` pode ser usado para verificar se um objeto contém a propriedade com o nome informado. A mesma palavra-chave pode ser usada em um loop `for` (`for (var name in object)`) para percorrer todas as propriedades do objeto.

### Exercícios

http://eloquentjavascript.net/04_data.html#h_TcUD2vzyMe
