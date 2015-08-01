# Funções de ordem superior

> "Tzu-li e Tzu-ssu estavam se gabando do tamanho dos seus últimos programas. _Duzentas mil linhas_, disse Tzu-li, _sem contar os comentários!_ Tzu-ssu repondeu, _Pss, o meu já é quase um milhão de linhas_. Mestre Yuan-Ma disse, _Meu melhor programa tinha quinhentas linhas_. Ouvindo isso os alunos ficaram admirados."
>
> - Mestre Yuan-Ma, _The Book of Programming_

>"Existem duas maneiras de construir o design de um software: um jeito é deixá-lo tão simples de tal forma que não há nenhuma deficiência e a outra maneira é tão complicada que obviamente não haverá deficiências óbvias."
>
> - C.A.R. Hoare, _1980 ACM Turing Award Lecture_

Um programa grande é um programa custoso, e não necessariamente devido ao tempo que leva para construir. Tamanho quase sempre envolve uma complexidade e complexidade confunde os programadores. Programadores confusos tendem a criar erros (bugs) no programa. Um programa grande tem a possibilidade de esconder bugs que são difíceis de serem encontrados.

Vamos rapidamente abordar dois exemplos que foram citados na introdução.
O primeiro contém um total de 6 linhas.

```js
var total = 0, count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}
console.log(total);
```

O segundo necessita de duas funções externas e é escrito em apenas uma linha.

`console.log(sum(range(1, 10)));`

Qual é mais propenso a erros?

Se medirmos o tamanho das definições de `sum` e `range`, o segundo programa também será grande - até maior do que o primeiro. Mesmo assim, eu diria que ele é o mais provável a estar correto.

A razão dele possivelmente ser o mais correto, é que a solução é expressa em um vocabulário que corresponde ao problema que está sendo resolvido. Somar um intervalo de números não se trata de laços de repetição e contadores. Trata-se de intervalos e somas.

As definições desse vocabulário (as funções `sum` e `range`) ainda assim terão que lidar com laços de repetição, contadores e outros detalhes secundários. No entanto, devido ao fato de representarem conceitos mais simples, elas acabam sendo mais fáceis de se entender.

## Abstração

No contexto da programação esse tipo de vocabulário é geralmente expressado pelo termo abstrações. Abstrações escondem detalhes e nos dá a habilidade de falar sobre problemas em alto nível (mais abstrato).

Isto é uma analogia que compara duas receitas de sopa de ervilha:

> "Coloque 1 copo de ervilha por pessoa num recipiente. Adicione água até as ervilhas ficarem cobertas. Deixa as ervilhas na água por no mínimo 12 horas. Tire as ervilhas da água e coloque-as numa panela. Adicione 4 copos de água por pessoa. Cubra a panela e deixe-as cozinhando por duas horas. Pegue meia cebola por pessoa, corte em pedaços, adicione às ervilhas. Pegue um talo de aipo por pessoa, corte em pedaços e adicione às ervilhas. Pegue uma cenoura por pessoa, corte em pedaços! Adicione às ervilhas. Cozinhe por 10 minutos".

E a segunda receita:

> "Para uma pessoa: 1 copo de ervilha, meia cebola, um talo de aipo e uma cenoura."
Embeba as ervilhas por 12 horas, ferva por 2 horas em 4 copos de água (por pessoa). Pique e adicione os vegetais. Deixe cozinhar por mais 10 minutos".

A segunda é bem menor e mais fácil de interpretar. Mas ela necessita de um conhecimento maior sobre algumas palavras relacionadas à cozinhar como: embeber, ferva, pique e vegetais.

Quando programamos não podemos contar com todas as palavras do dicionário para expressar o que precisamos. Assim cairemos no primeiro padrão de receita - onde damos cada comando que o computador tem que realizar, um por um, ocultando os conceitos de alto níveis que se expressam.

Perceber quando um conceito implora para ser abstraído em uma nova palavra é um costume que tem de virar algo natural quando programamos.

## Abstraindo `Array` transversal

Funções, como vimos anteriormente, são boas maneiras para se criar abstrações. Mas algumas vezes elas ficam aquém.

No [capítulo anterior](./04-estrutura-de-ordem-superior), esse tipo de `loop` apareceu várias vezes:

```js
var array = [1, 2, 3];
for (var i = 0; i < array.length; i++) {
  var current = array[i];
  console.log(current);
}
```

O que ele diz é: "Para cada elemento do array, registre no `console`". Mas utiliza um jeito redundante que envolve uma variável contadora, uma checagem do tamanho do `array` e a declaração de uma variável extra para pegar o elemento atual. Deixando de lado a monstruosidade do código, ele também nos dá espaço para possíveis erros: Podemos reusar a variável `i`, digitar errado `length` como `lenght`, confundir as variáveis `i` e `current` e por aí vai.

Então vamos tentar abstrair isso em uma nova função. Consegue pensar em alguma forma?

É trivial escrever uma função que passa sobre um `array` e chama `console.log` para cada elemento:

```js
function logEach(array) {
  for (var i = 0; i < array.length; i++)
    console.log(array[i]);
}
```

Mas e se quisermos fazer algo diferente do que apenas registrar os elementos? Uma vez que "fazer alguma coisa" pode ser representado com uma função e as funções são apenas valores, podemos passar nossas ações como um valor para a função.

```js
function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}

forEach(["Wampeter", "Foma", "Granfalloon"], console.log);
// → Wampeter
// → Foma
// → Granfalloon
```

Normalmente você não irá passar uma função predefinida para o `forEach`, mas ela será criada localmente dentro da função.

```js
var numbers = [1, 2, 3, 4, 5], sum = 0;
forEach(numbers, function(number) {
  sum += number;
});
console.log(sum);
// → 15
```

Isso parece muito com um `loop` clássico, com o seu corpo escrito como um bloco logo abaixo. No entanto o corpo está dentro do valor da função, bem como esta dentro dos parênteses da chamada de `forEach`. É por isso que precisamos fechar com chave e parêntese.

Nesse padrão, podemos simplificar o nome da variável (`number`) pelo elemento atual, ao invés de simplesmente ter que buscá-lo fora do `array` manualmente.

De fato, não precisamos definir um método `forEach`. Ele esta disponível como um método padrão em `arrays`. Quando um `array` é fornecido para o método agir sobre ele, o `forEach` espera apenas um argumento obrigatório: a função a ser executada para cada elemento.

Para ilustrar o quão útil isso é, vamos lembrar da função que vimos no [capítulo anterior](./04-estrutura-de-ordem-superior), onde continha dois `arrays` transversais.

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
```

Trabalhando com `forEach` faz parecer levemente menor e bem menos confuso.

``` js
function gatherCorrelations(journal) {
  var phis = {};
  journal.forEach(function(entry) {
    entry.events.forEach(function(event) {
      if (!(event in phis))
        phis[event] = phi(tableFor(event, journal));
    });
  });
  return phis;
}
```

## Funções de ordem superior

Funções que operam em outras funções, seja ela apenas devolvendo argumentos, são chamadas de funções de ordem superior. Se você concorda com o fato de que as funções são valores normais, não há nada de notável sobre o fato de sua existência. O termo vem da matemática onde a distinção entre funções e outros valores é levado mais a sério.

Funções de ordem superior nos permitem abstrair as ações. Elas podem serem de diversas formas. Por exemplo, você pode ter funções que criam novas funções.

```js
function greaterThan(n) {
  return function(m) { return m > n; };
}
var greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));
// → true
```
E você pode ter funções que alteram outras funções.

```js
function noisy(f) {
  return function(arg) {
    console.log("calling with", arg);
    var val = f(arg);
    console.log("called with", arg, "- got", val);
    return val;
  };
}
noisy(Boolean)(0);
// → calling with 0
// → called with 0 - got false
```

Você pode até escrever funções que fornecem novos tipos de fluxos de controles.

```js
function unless(test, then) {
  if (!test) then();
}
function repeat(times, body) {
  for (var i = 0; i < times; i++) body(i);
}

repeat(3, function(n) {
  unless(n % 2, function() {
    console.log(n, "is even");
  });
});
// → 0 is even
// → 2 is even
```

As regras de escopo léxico que discutimos no [capítulo 3](./03-funcoes.md) trabalham a nosso favor quando usamos funções dessa maneira. No exemplo acima, a variável `n` é um parâmetro da função externa. Mas como as funções internas estão dentro do ambiente externo, podemos usar a variável `n`. Os "corpos" de tais funções internas podem acessar as variáveis que estão em torno delas. Eles podem desempenhar um papel similar aos blocos `{}` usados em `loops` e expressões codicionais. Uma diferença importante é que variáveis declaradas dentro das funções internas não podem ser acessadas fora da função. Isso geralmente é algo bom.

## Passando argumentos

A função `noisy` declarada abaixo envolve seu argumento em outra função, isso gera uma grave deficiência.

```js
function noisy(f) {
  return function(arg) {
    console.log("calling with", arg);
    var val = f(arg);
    console.log("called with", arg, "- got", val);
    return val;
  };
}
```

Se `f` receber mais de um parâmetro, apenas o primeiro parâmetro será passado para ele. Podemos adicionar outros argumentos para a função interna (`arg1`, `arg2`, assim por diante) e passar elas para `f`, mas mesmo assim isso não deixaria explícito uma quantidade de parâmetros exatos. Essa solução limita algumas informações de `f` como por exemplo `arguments.length`. Nunca saberemos a quantidade exata de argumentos que foi passada.

Para esse tipo de situação, funções em Javascript possuem um método chamado `apply`. O método `apply` recebe um array (ou um `array` de `objeto`) de argumentos que é enviado para função que esta sendo chamada.

```js
function transparentWrapping(f) {
  return function() {
    return f.apply(null, arguments);
  };
}
```

Particularmente essa função é inútil, mas nos mostra o padrão que estamos interessados, a função que retorna irá passar todos os argumentos dados para `f`. Ela faz isso apenas passando seus próprios argumentos para o `apply`. O primeiro argumento do `apply` definimos como `null` mas isto pode ser usado para simular uma chamada de método. Iremos voltar a ver isto novamente no próximo capítulo.

## JSON

Funções de ordem superior que aplicam uma função de alguma forma para os elementos de um `array` são bastante usadas em JavaScript. O método`forEach` é uma função mais primitiva. Existe outras variantes disponíveis como métodos em `arrays`. Para acostumarmos com eles vamos brincar com um outro conjunto de dados.

Há alguns anos alguém juntou um monte de arquivos e montou um livro sobre a história do nome da minha família (Haverbeke que significa Oatbrook). Abri-o na esperança de encontrar cavaleiros, piratas, e alquimistas mas o livro acaba por ser principalmente de agricultores de flamengos. Para minha diversão extrai uma informação sobre os meus antepassados e coloquei em um formato legível por um computador.

O arquivo que eu criei se parece mais ou menos assim:

```js
[
  {"name": "Emma de Milliano", "sex": "f",
   "born": 1876, "died": 1956,
   "father": "Petrus de Milliano",
   "mother": "Sophia van Damme"},
  {"name": "Carolus Haverbeke", "sex": "m",
   "born": 1832, "died": 1905,
   "father": "Carel Haverbeke",
   "mother": "Maria van Brussel"},
  … and so on
]
```

Este formato é chamado de JSON (pronuncia-se "Jason") que significa JavaScript Object Notation. Json é amplamente utilizado como armazenamento de dados e como um formato de comunicação na Web.

Json se escreve semelhatemente como `arrays` e objetos em Javascript mas com algumas restrições.
Todos os nomes das propriedades devem ficar entre aspas e serem apenas expressões de dados simples; é permitido chamadas de funções, variáveis ou qualquer coisa que envolva um cálculo real. Comentários não são permitidos.

JavaScript nos fornece duas funções `JSON.stringify` e `JSON.parse`, que convertem dados para outro formato. O primeiro recebe um valor em JavaScript e retorna um string codificada em JSON. A segunda obtém uma `string` e converte-a para um valor de código.

```js
var string = JSON.stringify({name: "X", born: 1980});
console.log(string);
// → {"name":"X","born":1980}
console.log(JSON.parse(string).born);
// → 1980
```

O variável `ANCESTRY_FILE` esta disponível na `sandbox` neste capítulo para download no site, onde contém o conteúdo do meu arquivo `JSON` como uma `string`. Vamos decodificá-lo e ver quantas pessoas contém.

```js
var ancestry = JSON.parse(ANCESTRY_FILE);
console.log(ancestry.length);
// → 39
```

## Filtrando um array

Para encontrar um conjunto de pessoas nos dados ancestrais que eram  jovens em 1924 a seguinte função pode ser útil. Ele filtra os elementos em uma matriz que não passa de apenas um teste condicional.

```js
function filter(array, test) {
  var passed = [];
  for (var i = 0; i < array.length; i++) {
    if (test(array[i]))
      passed.push(array[i]);
  }
  return passed;
}

console.log(filter(ancestry, function(person) {
  return person.born > 1900 && person.born < 1925;
}));
// → [{name: "Philibert Haverbeke", …}, …]
```

Este utiliza o argumento chamado de `test` como um valor de função para preencher uma "lacuna" na computação. A função de `test` é chamado para cada elemento e o seu valor de retorno determina se um elemento é incluído na matriz retornada.

Três pessoas no arquivo estavam vivas e jovens em 1924: meu avô, minha avó e minha tia-avó.

Observe que a função `filter` em vez de apagar os elementos do `array` ela constrói um novo com apenas os elementos que passaram no teste. Esta função é primitiva e não modifica o `array` dado.

Assim como `forEach`, `filter` é um método padrão de `arrays`. O exemplo abaixo define uma função só para mostrar o que ele faz internamente. A partir de agora vamos utiliza-la assim:

```js
console.log(ancestry.filter(function(person) {
  return person.father == "Carel Haverbeke";
}));
// → [{name: "Carolus Haverbeke", …}]
```

## Transformando com map

Digamos que temos um `array` de objetos que representam pessoas produzidos atravéz da filtragem do `array` de ancestrais. Mas queremos um `array` com os nomes o que é mais fácil de ler.

A método `map` transforma um `array` atravez da aplicação de uma função para todos os seus elementos e constrói um novo `array`
através dos valores devolvidos. O novo `array` terá o mesmo tamanho do `array` enviado mas seu conteúdo vai ser mapeado para um novo formato através da função.

```js
function map(array, transform) {
  var mapped = [];
  for (var i = 0; i < array.length; i++)
    mapped.push(transform(array[i]));
  return mapped;
}

var overNinety = ancestry.filter(function(person) {
  return person.died - person.born > 90;
});
console.log(map(overNinety, function(person) {
  return person.name;
}));
// → ["Clara Aernoudts", "Emile Haverbeke",
//    "Maria Haverbeke"]
```

Curiosamente as pessoas que eram jovens na década de 1920 e que viveram pelo menos até aos 90 anos de idade são as mesmas três pessoas que vimos antes, o que acaba de ser a geração mais recente do meu conjunto de dados. Eu acho que a medicina já percorreu um longo caminho.

Assim como `forEach` e `filter`, `map` também é um método padrão de `arrays`.

## Resumindo com reduce

Outro padrão na computação em `arrays` é calcular todos elementos e trasforma-los em apenas um. No nosso exemplo atual a soma do nosso intervalo de números é um exemplo disso. Se quisermos encontrar uma pessoa pelo ano de nascimento no conjunto dos nossos dados teremos que usar esse padrão.

`Reduce` representa uma operação de ordem superior (diminui o tamanho do `array`). A redução do `array` é relizado atravez da interação de cada elemento. A soma começa com zero e a cada elemento é combinado a soma atual adicionado com o novo valor.

Os parâmetros que a função `reduce` necessita são: o `array`, um valor inicial e uma função para combinação. Esta função é menos simples do que o `filter` e `map` por isso observe com muita atenção.

```js
function reduce(array, combine, start) {
  var current = start;
  for (var i = 0; i < array.length; i++)
    current = combine(current, array[i]);
  return current;
}

console.log(reduce([1, 2, 3, 4], function(a, b) {
  return a + b;
}, 0));
// → 10
```

O padrão do método `reduce` corresponde a uma função e tem uma conveniência adicional. Se o `array` conter apenas um elemento você não precisa enviar um valor inicial, o método irá pegar o primeiro elemento do array como valor inicial, começando a redução a partir do segundo.

Para usar o `reduce` e encontrar o meu mais antigo ancestral, podemos escrever algo parecido com isto:

```js
console.log(ancestry.reduce(function(min, cur) {
  if (cur.born < min.born) return cur;
  else return min;
}));
// → {name: "Pauwels van Haverbeke", born: 1535, …}
```

## Composição

Considere como escreveriamos o exemplo anterior (encontrar a pessoa mais velha) caso não existisse a função `reduce` em ordem superior. O código não ficaria tão ruim.

```js
var min = ancestry[0];
for (var i = 1; i < ancestry.length; i++) {
  var cur = ancestry[i];
  if (cur.born < min.born)
    min = cur;
}
console.log(min);
// → {name: "Pauwels van Haverbeke", born: 1535, …}
```

Existem algumas variáveis sendo criadas e atribuídas e no fim o código tem duas linhas a mais, se tornando um código mas fácil de entender.

Funções de ordem superior começa ser útil quando você precisa compor funções. Como exemplo vamos escrever um código que encontra a média de idade para os homens e para as mulheres no conjunto de dados.

```js
function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}
function age(p) { return p.died - p.born; }
function male(p) { return p.sex == "m"; }
function female(p) { return p.sex == "f"; }

console.log(average(ancestry.filter(male).map(age)));
// → 61.67
console.log(average(ancestry.filter(female).map(age)));
// → 54.56
```

É um pouco bobo termos que definir `plus`("mais" da matemática) como uma função. Operadores em JavaScript são diferentes de funções, não são valores, então não podemos passar nenhum argumento.)

Ao invés de juntar toda a lógica requerida num `loop` gigante, podemos decompor em conceitos que estamos interessados como: sexo, idade calculada e média de números. Podemos aplicá-las uma por uma para obter o resultado que estamos procurando.

Escrever um código limpo é fabuloso. Infelizmente essa clareza tem um custo.

## O Custo

No mundo dos códigos elegantes e lindos arco-íris, vive um monstro mal que estraga os prazeres chamado de ineficiência.

Um programa que processa um `array` é mais elegante e expressa em uma seqüência de etapas que são separadas para que cada processo faça algo com o `array` e produza um novo `array`. Mas a construção de todos esses `arrays` intermediários é um pouco custoso.

Passar uma função para `forEach` e deixar que o método cuide da iteração para os nós é conveniente e fácil de ler. Porém chamadas de funções em JavaScript são custosas comparadas com blocos simples de `loop`.

Adicionar camadas de abstrações entre as coisas cruas que o computador está fazendo e os conceitos que estamos trabalhando, faz com que a máquina realize seu trabalho mais rápido. Esta não é uma lei de ferro, exitem linguagens de programação que tem melhor suporte para a construção de abstrações sem adição de ineficiências, até mesmo em JavaScript, um programador experiente pode encontrar maneiras de escrever um código abstrato e rápido. Mas é um problema que é muito visto.

Existem várias técnicas que ajudam a esclarecer o código. Elas adicionam camadas entre as coisas cruas que o computador está fazendo com os conceitos que estamos trabalhando e faz com que a máquina trabalhe mais rápido. Isso não é uma lei inescapável -- existem linguagens de programação que possuem um melhor suporte para construir aplicações sem adicionar ineficiências, e ainda em JavaScript, um programador experiente pode encontrar jeitos de escrever códigos relativamente abstratos que ainda são rápidos, porém é um problema frequente.

Felizmente muitos computadores são extremamente rápidos e se você estiver processando uma coleção de dados ou fazendo alguma coisa que acontece no tempo de escala humano (digamos, apenas uma vez ou toda vez que o usuário clica em um botão), então não importa se você escreveu aquela linda solução que leva meio milissegundo ou a solução super otimizada que leva um décimo de um milisegundo.

É útil saber de vez em quando quanto tempo leva um trecho de código para executar. Se vocês têm um `loop` dentro de um `loop` (diretamente, ou através de um `loop` externo chamando uma função que executa um `loop` interno), o código dentro do `loop` interno acaba rodando x número de vezes, onde N é o número de vezes que o `loop` de fora repete e M o número de vezes que o `loop` interno repete. Se esse `loop` interno conter outro `loop` que realize P voltas seu bloco rodará `M x N x P` vezes e assim por diante. Isto pode adicionar muitas operações. Quando um programa é lento o problema muitas das vezes pode estar atribuída a apenas uma pequena parte do código que fica dentro de um circuito interno.

## O pai do pai do pai do pai

Meu avô, Philibert Haverbeke está incluído nos dados do arquivo. Como exemplo final eu quero saber quem é o meu mais antigo ancestral no arquivo, (Pauwels van Haverbeke), e se possível descobrir teoricamente quanto de DNA compartilho com ele.

Para ser capaz de fazer uma busca pelo nome de um pai para um objeto real que representa uma pessoa, primeiramente precisamos construirmos um objeto que associa os nomes com as pessoas.

```js
var byName = {};
ancestry.forEach(function(person) {
  byName[person.name] = person;
});

console.log(byName["Philibert Haverbeke"]);
// → {name: "Philibert Haverbeke", …}
```
Agora o problema não é totalmente simples como conseguir as propriedades dos pais e ir contando quantos levam até chegar a Pauwels. Existem vários casos de família onde três pessoas casaram com seus primos segundos (pequenos vilarejos tem essas coisas). Isso faz com que ramificações da família se reencontrem em certos lugares, o que significa que eu compartilho mais de 1/2G com essa pessoa, usaremos G como número para gerações, cada geração se divide os genes em dois.

Uma maneira razoável de pensar sobre este problema é olhar para ele como sendo análogo ao reduzir um `array` para um único valor, por valores que combinam várias vezes da esquerda para a direita. Neste caso nós também queremos condensar a nossa estrutura de dados para um único valor mas de uma forma que segue as linhas da família. O formato dos dados é a de uma árvore genealógica em vez de uma lista plana.

A maneira que nós queremos reduzir é através da forma de cálculo de um valor para uma determinada pessoa combinando os valores de seus ancestrais. Isso pode ser feito de uma forma recursiva: se estamos interessados ​​em uma pessoa A, temos que calcular os valores para os pais de A que por sua vez obriga-nos a calcular o valor para os avós de A e assim por diante. A princípio isso iria exigir-mos a olhar para um número infinito de pessoas, ja que o nosso conjunto de dados é finito, temos que parar em algum lugar. Vamos definir um valor padrão para nossa função de redução, para pessoas que não estão nos dados. No nosso caso esse valor é simplesmente zero, pressupondo de que as pessoas que não estão na lista não compartilham o DNA do ancestral que estamos olhando.

Dado uma função para uma pessoa que combina valores de dois pais e um valor zero usado por pessoas desconhecidas, a função `reduceAncestors` calcula o valor da árvore da família.

```js
function reduceAncestors(person, f, defaultValue) {
  function valueFor(person) {
    if (person == null)
      return defaultValue;
    else
      return f(person, valueFor(byName[person.mother]),
                       valueFor(byName[person.father]));
  }
  return valueFor(person);
}
```

A função interna (`valueFor`) lida com apenas uma pessoa. Através da magica da recursividade ela pode chamar a si mesma para lidar com o pai e com a mãe. Os resultados junto com o objeto da pessoa em si, são passados para `f` na qual devolve o valor real para essa pessoa.

Podemos então usar isso para calcular a quantidade de DNA que meu avô compartilhou com Pauwels van Haverbeke e depois dividir por quatro.

```js
function sharedDNA(person, fromMother, fromFather) {
  if (person.name == "Pauwels van Haverbeke")
    return 1;
  else
    return (fromMother + fromFather) / 2;
}
var ph = byName["Philibert Haverbeke"];
console.log(reduceAncestors(ph, sharedDNA, 0) / 4);
// → 0.00049
```

A pessoa com o nome Pauwels van Haverbeke obviamente compartilhada 100 por cento de seu DNA com Pauwels van Haverbeke (não existem pessoas que compartilham o mesmo nome no conjunto de dados), então a função retorna 1 para ele. Todas as outras pessoas compartilham a média dos montantes que os seus pais possuem.

Assim estatisticamente falando, eu compartilho cerca de 0,05 por cento do DNA de uma pessoa do século 16. Deve-se notar que este é só uma aproximação estatística e não uma quantidade exata. É um número bastante pequeno mas dado a quantidade de material genético que carregamos (cerca de 3 bilhões de pares de bases), ainda existe algum aspecto na minha máquina biológica que se originou de Pauwels.

Nós também poderiamos ter calculado esse número sem depender de `reduceAncestors`. Mas separando a abordagem geral (condensação de uma árvore de família) a partir do caso específico (computação do DNA compartilhado) podemos melhorar a clareza do código permitindo reutilizar a parte abstrata do programa para outros casos. Por exemplo, o seguinte código encontra a porcentagem de antepassados ​​conhecidos para uma determinada pessoa que viveu no século 70:

```js
function countAncestors(person, test) {
  function combine(person, fromMother, fromFather) {
    var thisOneCounts = test(person);
    return fromMother + fromFather + (thisOneCounts ? 1 : 0);
  }
  return reduceAncestors(person, combine, 0);
}
function longLivingPercentage(person) {
  var all = countAncestors(person, function(person) {
    return true;
  });
  var longLiving = countAncestors(person, function(person) {
    return (person.died - person.born) >= 70;
  });
  return longLiving / all;
}
console.log(longLivingPercentage(byName["Emile Haverbeke"]));
// → 0.145
```

Tais números não são levados muito a sério, uma vez que o nosso conjunto de dados contém uma coleção bastante arbitrária de pessoas. Mas o código ilustra o fato de que `reduceAncestors` dá-nos uma peça útil para trabalhar o vocabulário da estrutura de dados de uma árvore genealógica.

## Binding

O método `bind` esta disponível em todas as funções, ele basicamente insiste em criar uma nova função que irá chamar a função original mas com alguns dos argumentos já fixados.

O código a seguir mostra um exemplo de `bind` em uso. Ele define uma função `isInSet` que nos diz se uma pessoa está em um determinado conjunto de `string`. Ao chamar `filer` ele seleciona os objetos pessoa cujos nomes estão em um conjunto específico. Ele pode escrever uma expressão de função que faz  chamada para `isInSet` enviando nosso conjunto como primeiro argumento parcial da função `isInSet`.

```js
var theSet = ["Carel Haverbeke", "Maria van Brussel",
              "Donald Duck"];
function isInSet(set, person) {
  return set.indexOf(person.name) > -1;
}

console.log(ancestry.filter(function(person) {
  return isInSet(theSet, person);
}));
// → [{name: "Maria van Brussel", …},
//    {name: "Carel Haverbeke", …}]
console.log(ancestry.filter(isInSet.bind(null, theSet)));
// → … same result
```

A chamada usando `bind` retorna uma função que chama `isInSet` com `theset` sendo o primeiro argumento seguido por todos os demais argumentos indicados pela função vinculada.

O primeiro argumento onde o exemplo passa `null` é utilizado para as chamadas de método semelhante ao primeiro argumento aplicado. Eu vou descrever isso com mais detalhes no próximo capítulo.

## Sumário

A possibilidade de passar funções como argumento para outras funções não é apenas um artifício aleatório, mas sim um aspecto muito útil em JavaScript. Ela nos permitem escrever cálculos com "lacunas" sendo ela uma função e permite ao código que execute essa função para preencher as lacunas providenciando os valores que faltam para descreverem os cálculos.

`Arrays` fornece um grande número de funções de ordem superior como o método `forEach` para fazer algo com cada elemento de um array, `map` para construir um novo array onde cada elemento é colocado através de uma função e `reduce` para combinar todos os elementos de um array em um valor único.

Funções têm o método `apply` que pode ser usado para chamar um `array` especificando seus argumentos. Elas também possuem um método `bind` que é usado para criar uma versão parcial da função que foi aplicada.

## Exercícios

### Juntando

Use o método `reduce` juntamente com o método `concat` para juntar um `array` de `arrays` em um único `array` que tem todos os elementos de entrada do `array`.

```js
var arrays = [[1, 2, 3], [4, 5], [6]];
// Your code here.
// → [1, 2, 3, 4, 5, 6]
```

### Diferença de idade entre mãe e filho

Usando os dados de exemplo definidos neste capítulo calcule a diferença de idade média entre mães e filhos (a idade da mãe quando a criança nasce). Você pode usar a função `average` definida anteriormente neste capítulo.

Note que nem todas as mães mencionadas no conjunto de dados estão presentes no `array`. O objeto `byName` facilita a busca por um objeto pessoa através de seu nome. Esse método pode ser útil agora.

```js
function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

var byName = {};
ancestry.forEach(function(person) {
  byName[person.name] = person;
});

// Your code here.

// → 31.2
```

**Dica:**

Como nem todos os elementos do `array` de ascendência produz dados úteis (não podemos calcular a diferença de idade, a menos que saibamos a data de nascimento da mãe) teremos de aplicar de alguma maneira um filtro antes de chamarmos o `average`. Você pode fazer isso como primeiro passo, basta definir uma função `hasKnownMother` para uma primeira filtragem. Alternativamente você pode começar a chamar o `map` e na função de mapeamento retornar a diferença de idade ou nulo se mãe for desconhecida. Em seguida você pode chamar o `filter` para remover os elementos nulos antes de passar o `array` para o método `average`.

### O Histórico da expectativa de vida

Quando olhamos para todas as pessoas que viveram mais de 90 anos no conjunto de dados; só a última geração dos dados saiu. Vamos observar mais de perto esse fenômeno.

Calcule o resultado da média das pessoas no conjunto de dados ancestrais definidos por século. Uma pessoa é atribuída a um século pegando o ano da sua morte, dividindo por 100 e arredondando para cima com `Math.ceil(person.died / 100)`.

```js
function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

// Your code here.

// → 16: 43.5
//   17: 51.2
//   18: 52.8
//   19: 54.8
//   20: 84.7
//   21: 94
```

Para ganhar um ponto extra escreva uma função `groupBy` que abstrai a operação de agrupamento. Ele deve aceitar como argumentos um `array` e uma função que calcula o grupo para um elemento do `array` e retorna um objeto que mapeia nomes dos grupos de `arrays` e membros do grupo.

**Dica:**

A essência desse exemplo encontra-se no agrupamento dos elementos de um conjunto por aspectos de divisões do `array` de ancestrais em pequenos `arrays` com os ancestrais de cada século.

Durante o processo de agrupamento deixe um objeto que associa os nomes dos séculos (números) com os `arrays` de objetos de pessoas por idades. Já que não sabemos quais categorias iremos encontrarmos então teremos que criá-los em tempo real. Para cada pessoa depois de encontrar seu século, vamos testar se o século já foi encontrado, se não adicione um array para ele. Em seguida adicione a pessoa (ou idade) para o `array` no século apropriado.

Finalmente um `loop` `for/in` pode ser usado para escrever a média de idades para os séculos individuais.

### Todos e alguns

`Arrays` também vêm com os métodos padrões `every` (todos) e `some` (alguns). Ambos recebem uma função predicada que quando chamada com um `array` como argumento retorna `true` ou `false`. Assim como `&&` apenas retorna um valor `true` quando as expressões de ambos os lados forem verdadeiras; `every` retorna `true` quando a função predicada retorna verdadeiro para cada elemento. Eles não processam mais elementos que o necessário, como o `for` por exemplo, se algum encontrar um predicado no primeiro elemento do `array` ele não percorrerá os outros elementos após isso.

Faça duas funções, `every` and `some`, que se comporte como esses métodos, exceto se eles receberem um `array` como seu primeiro argumento ao invés de um método.


```js
// Your code here.

console.log(every([NaN, NaN, NaN], isNaN));
// → true
console.log(every([NaN, NaN, 4], isNaN));
// → false
console.log(some([NaN, 3, 4], isNaN));
// → true
console.log(some([2, 3, 4], isNaN));
// → false
```

**Dica:**

As funções podem seguir um padrão semelhante à definição de `forEach` que foi mostrado no início do capítulo a única exceção é que eles devem retornar imediatamente (com o valor à direita) quando a função predicada retorna falso ou verdadeiro. Não se esqueça de colocar uma outra instrução de retorno após o `loop`; para que a função retorne um valor correto quando atingir o final do `array`.