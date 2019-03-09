{{meta {load_files: ["code/scripts.js", "code/chapter/05_higher_order.js", "code/intro.js"], zip: "node/html"}}}

# Funções de ordem superior

{{if interactive

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

Tzu-li e Tzu-ssu estavam se gabando do tamanho de seus programas mais recentes. "Duzentas mil linhas", disse Tzu-li, "não contando comentários!" Tzu-ssu respondeu, "Pssh, o meu é quase *um milhão* de linhas já." Master Yuan-Ma disse, "Meu melhor programa tem quinhentas linhas." Ouvindo isso, Tzu-li e Tzu-ssu foram iluminados.

quote}}

if}}

{{quote {author: "C.A.R. Hoare", title: "Palestra do Prêmio ACM Turing de 1980", chapter: true}

{{index "Hoare, C.A.R."}}

Existem duas maneiras de construir um design de software: Uma maneira é torná-lo tão simples que obviamente não há deficiências, e a outra maneira é torná-lo tão complicado que não há deficiências óbvias.

quote}}

{{figure {url: "img/chapter_picture_5.jpg", alt: "Cartas de roteiros diferentes", chapter: true}}}

{{index "program size"}}

Um programa grande é um programa caro, e não apenas pelo tempo que leva para construir. O tamanho quase sempre envolve ((complexidade)) e a complexidade confunde os programadores. Programadores confusos, por sua vez, introduzem erros (_((bug))s_) nos programas. Um programa grande fornece muito espaço para esses bugs se esconderem, tornando-os difíceis de encontrar.

{{index "summing example"}}

Vamos brevemente voltar aos dois últimos programas de exemplo na introdução. O primeiro é independente e tem seis linhas de comprimento.

```
let total = 0, count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}
console.log(total);
```

O segundo depende de duas funções externas e é uma linha longa.

```
console.log(sum(range(1, 10)));
```

Qual deles é mais provável de conter um bug?

{{index "program size"}}

Se contarmos o tamanho das definições de `sum` e `range`, o segundo programa também é grande - até maior que o primeiro. Mas ainda assim, eu diria que é mais provável que esteja correto.

{{index [abstraction, "with higher-order functions"], "domain-specific language"}}

É mais provável que esteja correto porque a solução é expressa em um ((vocabulário)) que corresponde ao problema que está sendo resolvido. Somando um intervalo de números não é sobre loops e contadores. É sobre intervalos e somas.

As definições deste vocabulário (as funções `sum` e` range`) ainda envolverão loops, contadores e outros detalhes incidentais. Mas como eles estão expressando conceitos mais simples que o programa como um todo, eles são mais fáceis de acertar.

## Abstração

No contexto da programação, esses tipos de vocabulários são geralmente chamados de _((abstrações))_. As abstrações ocultam detalhes e nos dão a capacidade de falar sobre problemas em um nível mais alto (ou mais abstrato).

{{index "recipe analogy", "pea soup"}}

Como analogia, compare estas duas receitas de sopa de ervilhas. O primeiro é assim:

{{quote

Coloque 1 xícara de ervilhas secas por pessoa em um recipiente. Adicione a água até que as ervilhas estejam bem cobertas. Deixe as ervilhas na água por pelo menos 12 horas. Retire as ervilhas da água e coloque-as em uma panela. Adicione 4 xícaras de água por pessoa. Cubra a panela e mantenha as ervilhas fervendo por duas horas. Tome meia cebola por pessoa. Corte em pedaços com uma faca. Adicione às ervilhas. Tome um talo de aipo por pessoa. Corte em pedaços com uma faca. Adicione às ervilhas. Tome uma cenoura por pessoa. Corte em pedaços. Com uma faca! Adicione às ervilhas. Cozinhe por mais 10 minutos.

quote}}

E esta é a segunda receita:

{{quote

Por pessoa: 1 xícara de ervilhas secas, metade de uma cebola picada, um talo de aipo e uma cenoura.

Mergulhe as ervilhas por 12 horas. Cozinhe por 2 horas em 4 xícaras de água (por pessoa). Pique e adicione legumes. Cozinhe por mais 10 minutos.

quote}}

{{index vocabulary}}

O segundo é mais curto e mais fácil de interpretar. Mas você precisa entender algumas palavras relacionadas à culinária, como _mergulhar_, _cozinhar_, _picar_ e, eu acho que, _legumes_.

Quando programamos, não podemos confiar que todas as palavras que precisamos estão esperando por nós no dicionário. Assim, podemos cair no padrão da primeira receita - descobrir os passos precisos que o computador deve executar, um por um, cegos aos conceitos de alto nível que expressam.

{{index abstraction}}

É uma habilidade útil, em programação, perceber quando você está trabalhando com um nível de abstração muito baixo.

## Repetição Abstrata

{{index [array, iteration]}}

Funções simples, como as vimos até agora, são uma boa maneira de construir abstrações. Mas às vezes eles entram em colapso.

{{index "for loop"}}

É comum que um programa faça algo por um determinado número de vezes. Você pode escrever um `for` ((loop)) para isso, assim:

```
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

Podemos abstrair "fazendo algo _N_ vezes" como uma função? Bem, é fácil escrever uma função que chama `console.log` _N_ vezes.

```
function repeatLog(n) {
  for (let i = 0; i < n; i++) {
    console.log(i);
  }
}
```

{{index [function, "higher-order"], loop, [function, "as value"]}}

{{indexsee "higher-order function", "function, higher-order"}}

Mas e se quisermos fazer algo diferente de registrar os números? Como "fazer algo" pode ser representado como uma função e funções são apenas valores, podemos passar nossa ação como um valor de função.

```{includeCode: "top_lines: 5"}
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log);
// → 0
// → 1
// → 2
```

Nós não temos que passar uma função pré-definida para `repeat`. Geralmente, é mais fácil criar um valor de função no local.

```
let labels = [];
repeat(5, i => {
  labels.push(`Unit ${i + 1}`);
});
console.log(labels);
// → ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"]
```

{{index "loop body", [braces, body], [parentheses, arguments]}}

Isto é estruturado um pouco como um loop `for` - primeiro descreve o tipo de loop e, em seguida, fornece um corpo. No entanto, o corpo agora está escrito como um valor de função, que é colocado entre parênteses da chamada para `repeat`. É por isso que ele deve ser fechado com a chave _e_ o parêntese de fechamento. Em casos como este exemplo, onde o corpo é uma expressão pequena e única, você também pode omitir as chaves e escrever o loop em uma única linha.

## Funções de ordem superior

{{index [function, "higher-order"], [function, "as value"]}}

As funções que operam em outras funções, tomando-as como argumentos ou retornando-as, são chamadas de funções de ordem superior. Como já vimos que as funções são valores regulares, não há nada particularmente notável sobre o fato de que tais funções existem. O termo vem da ((matemática)), onde a distinção entre funções e outros valores é levada mais a sério.

{{index abstraction}}

Funções de ordem superior nos permitem abstrair as _ações_, não apenas os valores. Elas vêm em várias formas. Por exemplo, podemos ter funções que criam novas funções.

```
function greaterThan(n) {
  return m => m > n;
}
let greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));
// → true
```

E podemos ter funções que mudam outras funções.

```
function noisy(f) {
  return (...args) => {
    console.log("calling with", args);
    let result = f(...args);
    console.log("called with", args, ", returned", result);
    return result;
  };
}
noisy(Math.min)(3, 2, 1);
// → calling with [3, 2, 1]
// → called with [3, 2, 1] , returned 1
```

Podemos até escrever funções que fornecem novos tipos de ((fluxo de controle)).

```
function unless(test, then) {
  if (!test) then();
}

repeat(3, n => {
  unless(n % 2 == 1, () => {
    console.log(n, "is even");
  });
});
// → 0 is even
// → 2 is even
```

{{index [array, methods], [array, iteration], "forEach method"}}

Existe um método de array, `forEach`, que fornece algo como um loop `for`/`of` como uma função de ordem superior.

```
["A", "B"].forEach(l => console.log(l));
// → A
// → B
```

## Conjunto de dados de script

Uma área onde as funções de ordem superior brilham é o processamento de dados. Para processar dados, precisaremos de alguns dados reais. Este capítulo usará um ((conjunto de dados)) sobre scripts -((sistemas de escrita)) como latim, cirílico ou árabe.

Lembra do ((Unicode)) do [Chapter ?](values#unicode), o sistema que atribui um número a cada caractere na linguagem escrita? A maioria desses caracteres está associada a um script específico. O padrão contém 140 scripts diferentes - 81 ainda estão em uso hoje e 59 são históricos.

Embora eu possa ler fluentemente apenas caracteres latinos, eu aprecio o fato de que as pessoas estão escrevendo textos em pelo menos 80 outros sistemas de escrita, muitos dos quais eu nem reconheceria. Por exemplo, aqui está uma amostra da caligrafia ((tâmil)):

{{figure {url: "img/tamil.png", alt: "Caligrafia tâmil"}}}

{{index "SCRIPTS data set"}}

O ((conjunto de dados)) do exemplo contém algumas informações sobre os 140 scripts definidos em Unicode. Está disponível em [coding sandbox](https://eloquentjavascript.net/code#5) para este capítulo[([_https://eloquentjavascript.net/code#5_](https://eloquentjavascript.net/code#5))]{if book} vinculado a `SCRIPTS`. Este vínculo contém um array de objetos, cada um dos quais descreve um script.

```{lang: "application/json"}
{
  name: "Coptic",
  ranges: [[994, 1008], [11392, 11508], [11513, 11520]],
  direction: "ltr",
  year: -200,
  living: false,
  link: "https://en.wikipedia.org/wiki/Coptic_alphabet"
}
```

Esse objeto nos informa o nome do script, os intervalos Unicode atribuídos a ele, a direção na qual ele é gravado, o tempo (aproximado) de origem, se ele ainda está em uso e um link para mais informações. A direção pode ser `"ltr"` da esquerda para a direita, `"rtl"` da direita para a esquerda (como o texto árabe e hebraico são escritos), ou `"ttb"` de cima para baixo (como na escrita mongol).

{{index "slice method"}}

A propriedade `ranges` contém um array de ((intervalo))s de caracteres Unicode, cada um dos quais é um array de dois elementos contendo um limite inferior e um limite superior. Quaisquer códigos de caracteres dentro destes intervalos são atribuídos ao script. O ((limite)) inferior é inclusivo (o código 994 é um caractere Cóptico), e o limite superior é não inclusivo (o código 1008 não é).

## Filtrando Arrays

{{index [array, methods], [array, filtering], "filter method", [function, "higher-order"], "predicate function"}}

Para encontrar os scripts no conjunto de dados que ainda estão em uso, a seguinte função pode ser útil. Ela filtra os elementos de um array que não passam em um teste.

```
function filter(array, test) {
  let passed = [];
  for (let element of array) {
    if (test(element)) {
      passed.push(element);
    }
  }
  return passed;
}

console.log(filter(SCRIPTS, script => script.living));
// → [{name: "Adlam", …}, …]
```

{{index [function, "as value"], [function, application]}}

A função usa o argumento chamado `test`, um valor de função, para preencher uma "lacuna" no cálculo - o processo de decidir quais elementos coletar.

{{index "filter method", "pure function", "side effect"}}

Note como a função `filter`, ao invés de deletar elementos do array existente, constrói um novo array com apenas os elementos que passam no teste. Esta função é _pura_. Ela não modifica o array que lhe é dado.

Como o `forEach`, o `filter` é um método de array ((padrão)). O exemplo definiu a função apenas para mostrar o que ela faz internamente. A partir de agora, vamos usá-la assim:

```
console.log(SCRIPTS.filter(s => s.direction == "ttb"));
// → [{name: "Mongolian", …}, …]
```

{{id map}}

## Transformando com map

{{index [array, methods], "map method"}}

Digamos que temos um array de objetos representando scripts, produzidos pela filtragem do array `SCRIPTS` de alguma forma. Mas nós queremos um array de nomes, que é mais fácil de inspecionar.

{{index [function, "higher-order"]}}

O método `map` transforma um array aplicando uma função a todos os seus elementos e construindo um novo array a partir dos valores retornados. O novo array terá o mesmo comprimento que o array de entrada, mas seu conteúdo terá sido _mapeado_ para uma nova forma pela função.

```
function map(array, transform) {
  let mapped = [];
  for (let element of array) {
    mapped.push(transform(element));
  }
  return mapped;
}

let rtlScripts = SCRIPTS.filter(s => s.direction == "rtl");
console.log(map(rtlScripts, s => s.name));
// → ["Adlam", "Arabic", "Imperial Aramaic", …]
```

Como `forEach` e `filter`, `map` é um método de array padrão.

## Compactação com reduce

{{index [array, methods], "summing example", "reduce method"}}

Outra coisa comum a fazer com arrays é calcular um único valor a partir deles. Nosso exemplo recorrente, somando uma coleção de números, é um exemplo disso. Outro exemplo é encontrar o script com mais caracteres.

{{indexsee "fold", "reduce method"}}

{{index [function, "higher-order"], "reduce method"}}

A operação de ordem superior que representa esse padrão é chamada _reduce_ (às vezes também chamada _fold_). Ela constrói um valor tomando repetidamente um único elemento do array e combinando-o com o valor atual. Ao somar números, você deve começar com o número zero e, para cada elemento, adicionar isso à soma.

Os parâmetros do `reduce` são, além do array, uma função de combinação e um valor inicial. Esta função é um pouco menos simples que `filter` e `map`, então dê uma olhada nela:

```
function reduce(array, combine, start) {
  let current = start;
  for (let element of array) {
    current = combine(current, element);
  }
  return current;
}

console.log(reduce([1, 2, 3, 4], (a, b) => a + b, 0));
// → 10
```

{{index "reduce method", "SCRIPTS data set"}}

O método padrão `reduce` do array, que naturalmente corresponde a esta função, tem uma conveniência adicionada. Se seu array contém pelo menos um elemento, você pode deixar de lado o argumento `start`. O método tomará o primeiro elemento do array como seu valor inicial e começará a reduzir no segundo elemento.

```
console.log([1, 2, 3, 4].reduce((a, b) => a + b));
// → 10
```

{{index maximum, "characterCount function"}}

Para usar o `reduce` (duas vezes) para encontrar o script com mais caracteres, podemos escrever algo assim:

```
function characterCount(script) {
  return script.ranges.reduce((count, [from, to]) => {
    return count + (to - from);
  }, 0);
}

console.log(SCRIPTS.reduce((a, b) => {
  return characterCount(a) < characterCount(b) ? b : a;
}));
// → {name: "Han", …}
```

A função `characterCount` reduz os intervalos atribuídos a um script pela soma de seus tamanhos. Observe o uso da desestruturação na lista de parâmetros da função redutora. A segunda chamada para `reduce` então usa isso para encontrar o maior script, comparando repetidamente dois scripts e retornando o maior.

O script Han tem mais de 89.000 caracteres atribuídos a ele no padrão Unicode, tornando-o de longe o maior sistema de escrita do conjunto de dados. Han é um script (às vezes) usado para textos chineses, japoneses e coreanos. Esses idiomas compartilham muitos caracteres, embora tendam a escrevê-los de forma diferente. O Unicode Consortium (baseado nos EUA) decidiu tratá-los como um único sistema de escrita para salvar códigos de caracteres. Isso é chamado de _unificação Han_ e ainda deixa algumas pessoas muito irritadas.

## Composição

{{index loop, maximum}}

Considere como teríamos escrito o exemplo anterior (encontrar o maior script) sem funções de ordem superior. O código não é muito pior.

```{test: no}
let biggest = null;
for (let script of SCRIPTS) {
  if (biggest == null ||
      characterCount(biggest) < characterCount(script)) {
    biggest = script;
  }
}
console.log(biggest);
// → {name: "Han", …}
```

Há mais algumas vinculações, e o programa tem mais quatro linhas. Mas ainda é muito legível.

{{index "average function", composability, [function, "higher-order"], "filter method", "map method", "reduce method"}}

{{id average_function}}

Funções de ordem superior começam a brilhar quando você precisa _compor_ operações. Como exemplo, vamos escrever um código que encontre o ano médio de origem para scripts vivos e mortos no conjunto de dados.

```
function average(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

console.log(Math.round(average(
  SCRIPTS.filter(s => s.living).map(s => s.year))));
// → 1188
console.log(Math.round(average(
  SCRIPTS.filter(s => !s.living).map(s => s.year))));
// → 188
```

Então os scripts mortos em Unicode são, em média, mais velhos que os vivos. Esta não é uma estatística terrivelmente significativa ou surpreendente. Mas espero que você concorde que o código usado para calculá-lo não é difícil de ler. Você pode vê-lo como um pipeline: nós começamos com todos os scripts, filtramos os vivos (ou mortos), tiramos os anos deles, medimos a média deles e arredondamos o resultado.

Você poderia definitivamente também escrever este cálculo como um grande ((loop)).

```
let total = 0, count = 0;
for (let script of SCRIPTS) {
  if (script.living) {
    total += script.year;
    count += 1;
  }
}
console.log(Math.round(total / count));
// → 1188
```
Mas é mais difícil ver o que estava a ser calculado e como. E porque os resultados intermediários não são representados como valores coerentes, seria muito mais trabalho extrair algo como `média` em uma função separada.

{{index efficiency, [array, creation]}}

Em termos do que o computador está realmente fazendo, estas duas abordagens também são bastante diferentes. A primeira irá construir novos arrays ao rodar `filter` e `map`, enquanto a segunda calcula apenas alguns números, fazendo menos trabalho. Você pode normalmente usar a abordagem legível, mas se você está processando arrays enormes, e fazendo muitas vezes, o estilo menos abstrato pode valer a pena pela velocidade extra.

## Strings e códigos de caracteres

{{index "SCRIPTS data set"}}

Um uso do conjunto de dados seria descobrir qual script um pedaço de texto está usando. Vamos passar por um programa que faz isso.

Lembre-se que cada script tem um array de intervalos de código de caracteres associados a ele. Portanto, dado um código de caracteres, podemos usar uma função como esta para encontrar o script correspondente (se houver):

{{index "some method", "predicate function", [array, methods]}}

```{includeCode: strip_log}
function characterScript(code) {
  for (let script of SCRIPTS) {
    if (script.ranges.some(([from, to]) => {
      return code >= from && code < to;
    })) {
      return script;
    }
  }
  return null;
}

console.log(characterScript(121));
// → {name: "Latin", …}
```

O método `some` é outra função de ordem superior. Faz exame de uma função do teste e diz-lhe se essa função retorna verdadeiro para alguns dos elementos na disposição.

{{id code_units}}

Mas como é que arranjamos os códigos de caracteres em uma string?

No [Capítulo ?](values) eu mencionei que ((string))s JavaScript são codificadas como uma sequência de números de 16 bits. Estes são chamados de _((unidade de código))s_. Um código de ((caractere)) ((Unicode)) era inicialmente suposto caber dentro de tal unidade (o que lhe dá um pouco mais de 65.000 caracteres). Quando ficou claro que isso não seria suficiente, muitas pessoas se recusaram a usar mais memória por caractere. Para resolver essas preocupações, ((UTF-16)), o formato usado pelas strings JavaScript, foi inventado. Ele descreve os caracteres mais comuns usando uma única unidade de código de 16 bits, mas usa um par de duas dessas unidades para outras.

{{index error}}

O UTF-16 é geralmente considerado uma má ideia hoje. Parece quase intencionalmente concebido para convidar erros. É fácil escrever programas que fingem que as unidades de código e os caracteres são a mesma coisa. E se a sua linguagem não usa caracteres de duas unidades, isso parecerá funcionar muito bem. Mas assim que alguém tenta usar tal programa com alguns menos comuns ((caracteres chineses)), ele quebra. Felizmente, com o advento do ((emoji)), todos começaram a usar caracteres de duas unidades, e o fardo de lidar com tais problemas é mais justamente distribuído.

{{index [string, length], [string, indexing], "charCodeAt method"}}

Infelizmente, operações óbvias em strings JavaScript, como obter seu comprimento através da propriedade `length` e acessar seu conteúdo usando colchetes, lidam apenas com unidades de código.

```{test: no}
// Dois caracteres emoji, cavalo e sapato
let horseShoe = "🐴👟";
console.log(horseShoe.length);
// → 4
console.log(horseShoe[0]);
// → (Caractere do meio inválido)
console.log(horseShoe.charCodeAt(0));
// → 55357 (Código do caractere do meio)
console.log(horseShoe.codePointAt(0));
// → 128052 (Código atual para emoji de cavalo)
```

{{index "codePointAt method"}}

O método `charCodeAt` do JavaScript lhe dá uma unidade de código, não um código de caracteres completo. O método `codePointAt`, adicionado mais tarde, dá um caractere Unicode completo. Então nós poderíamos usar isso para obter caracteres de uma string. Mas o argumento passado para `codePointAt` ainda é um índice na sequência de unidades de código. Então, para executar todos os caracteres em uma string, nós ainda precisamos lidar com a questão de se um caractere ocupa uma ou duas unidades de código.

{{index "for/of loop", character}}

No [capítulo anterior](data#for_of_loop), eu mencionei que um loop `for`/`of` também pode ser usado em strings. Como o `codePointAt`, este tipo de loop foi introduzido em um momento em que as pessoas estavam bem cientes dos problemas com UTF-16. Quando você o usa para fazer um loop sobre uma string, ele lhe dá caracteres reais, não unidades de código.

```
let roseDragon = "🌹🐉";
for (let char of roseDragon) {
  console.log(char);
}
// → 🌹
// → 🐉
```
Se você tem um caractere (que será uma string de uma ou duas unidades de código), você pode usar `codePointAt(0)` para obter seu código.

## Reconhecendo o texto

{{index "SCRIPTS data set", "countBy function", [array, counting]}}

Nós temos uma função `characterScript` e uma maneira de fazer um loop correto sobre os caracteres. O próximo passo é contar os caracteres que pertencem a cada script. A seguinte abstração de contagem será útil aqui:

```{includeCode: strip_log}
function countBy(items, groupName) {
  let counts = [];
  for (let item of items) {
    let name = groupName(item);
    let known = counts.findIndex(c => c.name == name);
    if (known == -1) {
      counts.push({name, count: 1});
    } else {
      counts[known].count++;
    }
  }
  return counts;
}

console.log(countBy([1, 2, 3, 4, 5], n => n > 2));
// → [{name: false, count: 2}, {name: true, count: 3}]
```

A função `countBy` espera uma coleção (qualquer coisa que nós podemos fazer loop com `for`/`of`) e uma função que calcula um nome de grupo para um determinado elemento. Ele retorna um array de objetos, cada um dos quais nomeia um grupo e informa o número de elementos que foram encontrados nesse grupo.

{{index "findIndex method", "indexOf method"}}

Ele usa outro método de array - o `findIndex`. Este método é um pouco como `indexOf`, mas ao invés de procurar por um valor específico, ele encontra o primeiro valor para o qual a função retorna `true`. Como `indexOf`, ele retorna -1 quando nenhum desses elementos é encontrado.

{{index "textScripts function", "Chinese characters"}}

Usando `countBy`, podemos escrever a função que nos diz quais scripts são usados em um pedaço de texto.

```{includeCode: strip_log, startCode: true}
function textScripts(text) {
  let scripts = countBy(text, char => {
    let script = characterScript(char.codePointAt(0));
    return script ? script.name : "none";
  }).filter(({name}) => name != "none");

  let total = scripts.reduce((n, {count}) => n + count, 0);
  if (total == 0) return "No scripts found";

  return scripts.map(({name, count}) => {
    return `${Math.round(count * 100 / total)}% ${name}`;
  }).join(", ");
}

console.log(textScripts('英国的狗说"woof", 俄罗斯的狗说"тяв"'));
// → 61% Han, 22% Latin, 17% Cyrillic
```

{{index "characterScript function", "filter method"}}

A função primeiro conta os caracteres pelo nome e usa `characterScript` para atribuir-lhes um nome, retornando a string `"none"` para caracteres que não fazem parte de nenhum script. A chamada `filter` remove a entrada `"none"` do array resultante, já que não estamos interessados nesses caracteres.

{{index "reduce method", "map method", "join method", [array, methods]}}

Para podermos calcular ((porcentagem)), precisamos primeiro do número total de caracteres que pertencem a um script, que podemos calcular com `reduce`. Se tais caracteres não forem encontrados, a função retorna uma string específica. Caso contrário, ela transforma as entradas de contagem em strings legíveis com `map` e então as combina com `join`.

## Resumo

Ser capaz de passar valores de funções para outras funções é um aspecto profundamente útil do JavaScript. Permite-nos escrever funções que modelam cálculos com "lacunas" nelas. O código que chama essas funções pode preencher as lacunas, fornecendo valores de função.

Arrays fornecem uma série de métodos úteis de ordem superior. Você pode usar o `forEach` para fazer um loop sobre os elementos de um array. O método `filter` retorna um novo array contendo apenas os elementos que passam pela ((função predicada)). Transformar um array colocando cada elemento através de uma função é feito com `map`. Você pode usar `reduce` para combinar todos os elementos de um array em um único valor. O método `some` testa se qualquer elemento corresponde a uma determinada função predicada. E o `findIndex` encontra a posição do primeiro elemento que corresponde a um predicado.

## Exercícios

### Achatamento

{{index "flattening (exercise)", "reduce method", "concat method", [array, flattening]}}

Use o método `reduce` em combinação com o método `concat` para "achatar" um array de arrays em um único array que tenha todos os elementos dos arrays originais.

{{if interactive

```{test: no}
let arrays = [[1, 2, 3], [4, 5], [6]];
// O seu código aqui.
// → [1, 2, 3, 4, 5, 6]
```
if}}

### Seu próprio loop

{{index "your own loop (example)", "for loop"}}

Escreva uma função de ordem superior `loop` que fornece algo como uma instrução de loop `for`. É preciso um valor, uma função de teste, uma função de atualização e uma função estrutural. Cada iteração, primeiro executa a função de teste sobre o valor do loop atual e para se este retornar falso. Depois chama a função estrutural, dando-lhe o valor atual. Finalmente, ele chama a função de atualização para criar um novo valor e começa desde o início.

Ao definir a função, você pode usar um loop regular para fazer o looping real.

{{if interactive

```{test: no}
// O seu código aqui.

loop(3, n => n > 0, n => n - 1, console.log);
// → 3
// → 2
// → 1
```

if}}

### Todos

{{index "predicate function", "everything (exercise)", "every method", "some method", [array, methods], "&& operator", "|| operator"}}

Análogo ao método `some`, arrays também têm um método `every`. Este retorna `true` quando a função dada retorna verdadeiro para _todos_ os elementos do array. De certa forma, `some` é uma versão do operador `||` que atua em arrays, e `every` é como o operador `&&`.

Implemente `every` como uma função que usa um array e uma função predicada como parâmetros. Escreva duas versões, uma usando um loop e outra usando o método `some`.

{{if interactive

```{test: no}
function every(array, test) {
  // O seu código aqui.
}

console.log(every([1, 3, 5], n => n < 10));
// → true
console.log(every([2, 4, 16], n => n < 10));
// → false
console.log(every([], n => n < 10));
// → true
```

if}}

{{hint

{{index "everything (exercise)", "short-circuit evaluation", "return keyword"}}

Como o operador `&&`, o método `every` pode parar de avaliar elementos adicionais assim que encontrar um que não corresponda. Assim, a versão baseada em loop pode saltar para fora do loop - com `break` ou `return` - assim que ele for executado em um elemento para o qual a função predicada retorna `false`. Se o loop for executado até o fim sem encontrar tal elemento, nós sabemos que todos os elementos coincidem e devemos retornar `true`.

Para compilar `every` em cima de `some`, podemos aplicar as  _((leis de De Morgan))_, que declara que `a && b` é igual a `!(!a || !b)`. Isso pode ser generalizado para arrays, onde todos os elementos no array correspondem se não houver nenhum elemento no array que não corresponda.

hint}}

### Direção de escrita dominante

{{index "SCRIPTS data set", "direction (writing)", "groupBy function", "dominant direction (exercise)"}}

Escreva uma função que calcula a direção de escrita dominante numa cadeia de texto. Lembre-se que cada objeto script tem uma propriedade `direction` que pode ser `"ltr"`(esquerda para direita), `"rtl"`(direita para esquerda), ou `"ttb"`(de cima para baixo).

{{index "characterScript function", "countBy function"}}

A direção dominante é a direção da maioria dos caracteres que têm um script associado a eles. As funções `characterScript` e `countBy` definidas anteriormente no capítulo são provavelmente úteis aqui.

{{if interactive

```{test: no}
function dominantDirection(text) {
  // O seu código aqui.
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl
```
if}}

{{hint

{{index "dominant direction (exercise)", "textScripts function", "filter method", "characterScript function"}}

Sua solução pode se parecer muito com a primeira metade do exemplo `textScripts`. Você novamente tem que contar caracteres por um critério baseado no `characterScript` e então filtrar a parte do resultado que se refere a caracteres desinteressantes (sem script).

{{index "reduce method"}}

Encontrar a direção com a maior contagem de caracteres pode ser feito com `reduce`. Se não estiver claro como, consulte o exemplo anterior no capítulo, aqui `reduce` foi usado para encontrar o script com mais caracteres.

hint}}