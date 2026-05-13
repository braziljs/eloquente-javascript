{{meta {load_files: ["code/scripts.js", "code/chapter/05_higher_order.js", "code/intro.js"], zip: "node/html"}}}

# Funções de Ordem Superior

{{quote {author: "C.A.R. Hoare", title: "1980 ACM Turing Award Lecture", chapter: true}

{{index "Hoare, C.A.R."}}

There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies.

quote}}

{{figure {url: "img/chapter_picture_5.jpg", alt: "Illustration showing letters and hieroglyphs from different scripts—Latin, Greek, Arabic, ancient Egyptian, and others", chapter: true}}}

{{index "program size"}}

Um programa grande é um programa custoso, e não apenas pelo tempo que leva para construir. Tamanho quase sempre envolve ((complexidade)), e complexidade confunde programadores. Programadores confusos, por sua vez, introduzem erros (_((bug))s_) em programas. Um programa grande então fornece muito espaço para esses bugs se esconderem, tornando-os difíceis de encontrar.

{{index "summing example"}}

Vamos voltar brevemente aos dois últimos programas de exemplo na introdução. O primeiro é autocontido e tem seis linhas.

```
let total = 0, count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}
console.log(total);
```

O segundo depende de duas funções externas e tem uma linha.

```
console.log(sum(range(1, 10)));
```

Qual tem mais chance de conter um bug?

{{index "program size"}}

Se contarmos o tamanho das definições de `sum` e `range`, o segundo programa também é grande — até maior que o primeiro. Mas ainda assim, eu argumentaria que é mais provável que esteja correto.

{{index [abstraction, "with higher-order functions"], "domain-specific language"}}

Isso porque a solução é expressa em um ((vocabulário)) que corresponde ao problema sendo resolvido. Somar um intervalo de números não é sobre loops e contadores. É sobre intervalos e somas.

As definições desse vocabulário (as funções `sum` e `range`) ainda envolverão loops, contadores e outros detalhes incidentais. Mas porque estão expressando conceitos mais simples que o programa como um todo, são mais fáceis de acertar.

## Abstração

No contexto da programação, esses tipos de vocabulários são geralmente chamados de _((abstração))s_. Abstrações nos dão a capacidade de falar sobre problemas em um nível mais alto (ou mais abstrato), sem nos desviar com detalhes desinteressantes.

{{index "recipe analogy", "pea soup"}}

Como analogia, compare essas duas receitas de sopa de ervilha. A primeira vai assim:

{{quote

Coloque 1 xícara de ervilhas secas por pessoa em um recipiente. Adicione água até as ervilhas estarem bem cobertas. Deixe as ervilhas de molho na água por pelo menos 12 horas. Retire as ervilhas da água e coloque-as em uma panela. Adicione 4 xícaras de água por pessoa. Cubra a panela e mantenha as ervilhas cozinhando em fogo brando por duas horas. Pegue meia cebola por pessoa. Corte-a em pedaços com uma faca. Adicione às ervilhas. Pegue um talo de salsão por pessoa. Corte-o em pedaços com uma faca. Adicione às ervilhas. Pegue uma cenoura por pessoa. Corte-a em pedaços. Com uma faca! Adicione às ervilhas. Cozinhe por mais 10 minutos.

quote}}

E esta é a segunda receita:

{{quote

Por pessoa: 1 xícara de ervilhas secas partidas, 4 xícaras de água, meia cebola picada, um talo de salsão e uma cenoura.

Deixe as ervilhas de molho por 12 horas. Cozinhe em fogo brando por 2 horas. Pique e adicione os vegetais. Cozinhe por mais 10 minutos.

quote}}

{{index vocabulary}}

A segunda é mais curta e mais fácil de interpretar. Mas você precisa entender mais algumas palavras relacionadas à culinária, como _de molho_, _fogo brando_, _picar_, e, suponho, _vegetal_.

Ao programar, não podemos contar que todas as palavras de que precisamos estarão nos esperando no dicionário. Assim, podemos cair no padrão da primeira receita — detalhar os passos precisos que o computador deve realizar, um por um, cegos aos conceitos de nível mais alto que eles expressam.

{{index abstraction}}

É uma habilidade útil, em programação, perceber quando você está trabalhando em um nível de abstração muito baixo.

## Abstraindo repetição

{{index [array, iteration]}}

Funções simples, como as vimos até agora, são uma boa forma de construir abstrações. Mas às vezes ficam aquém.

{{index "for loop"}}

É comum um programa fazer algo um certo número de vezes. Você pode escrever um ((loop)) `for` para isso, assim:

```
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

Podemos abstrair "fazer algo _N_ vezes" como uma função? Bem, é fácil escrever uma função que chama `console.log` _N_ vezes.

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

Não precisamos passar uma função predefinida para `repeat`. Frequentemente, é mais fácil criar um valor de função na hora.

```
let labels = [];
repeat(5, i => {
  labels.push(`Unit ${i + 1}`);
});
console.log(labels);
// → ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"]
```

{{index "loop body", [braces, body], [parentheses, arguments]}}

Isso é estruturado um pouco como um loop `for` — primeiro descreve o tipo de loop e depois fornece um corpo. No entanto, o corpo agora é escrito como um valor de função, que está envolvido nos parênteses da chamada a `repeat`. É por isso que precisa ser fechado com a chave de fechamento _e_ o parêntese de fechamento. Em casos como este exemplo, onde o corpo é uma única expressão pequena, você também pode omitir as chaves e escrever o loop em uma única linha.

## Funções de ordem superior

{{index [function, "higher-order"], [function, "as value"]}}

Funções que operam sobre outras funções, seja recebendo-as como argumentos ou retornando-as, são chamadas de _funções de ordem superior_. Como já vimos que funções são valores regulares, não há nada particularmente notável no fato de que tais funções existem. O termo vem da ((matemática)), onde a distinção entre funções e outros valores é levada mais a sério.

{{index abstraction}}

Funções de ordem superior nos permitem abstrair sobre _ações_, não apenas valores. Elas vêm em várias formas. Por exemplo, podemos ter funções que criam novas funções.

```
function greaterThan(n) {
  return m => m > n;
}
let greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));
// → true
```

Também podemos ter funções que mudam outras funções.

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

Existe um método de array embutido, `forEach`, que fornece algo como um loop `for`/`of` como uma função de ordem superior.

```
["A", "B"].forEach(l => console.log(l));
// → A
// → B
```

{{id scripts}}

## Conjunto de dados de scripts

Uma área onde funções de ordem superior brilham é processamento de dados. Para processar dados, precisamos de alguns dados de exemplo reais. Este capítulo usará um ((conjunto de dados)) sobre scripts — ((sistemas de escrita)) como Latim, Cirílico ou Árabe.

Lembra do ((Unicode)), o sistema que atribui um número a cada caractere em linguagem escrita, do [Capítulo ?](values#unicode)? A maioria desses caracteres está associada a um script específico. O padrão contém 140 scripts diferentes, dos quais 81 ainda estão em uso hoje e 59 são históricos.

Embora eu só consiga ler fluentemente caracteres latinos, aprecio o fato de que pessoas estão escrevendo textos em pelo menos 80 outros sistemas de escrita, muitos dos quais eu nem reconheceria. Por exemplo, aqui está uma amostra de escrita manual em ((tâmil)):

{{figure {url: "img/tamil.png", alt: "A line of verse in Tamil handwriting. The characters are relatively simple, and neatly separated, yet completely different from Latin."}}}

{{index "SCRIPTS dataset"}}

O ((conjunto de dados)) de exemplo contém algumas informações sobre os 140 scripts definidos no Unicode. Está disponível no [sandbox de codificação](https://eloquentjavascript.net/code#5) para este capítulo[ ([_https://eloquentjavascript.net/code#5_](https://eloquentjavascript.net/code#5))]{if book} como o binding `SCRIPTS`. O binding contém um array de objetos, cada um dos quais descreve um script.


```{lang: "json"}
{
  name: "Coptic",
  ranges: [[994, 1008], [11392, 11508], [11513, 11520]],
  direction: "ltr",
  year: -200,
  living: false,
  link: "https://en.wikipedia.org/wiki/Coptic_alphabet"
}
```

Tal objeto nos diz o nome do script, os intervalos Unicode atribuídos a ele, a direção em que é escrito, o tempo de origem (aproximado), se ainda está em uso e um link para mais informações. A direção pode ser `"ltr"` para esquerda para direita, `"rtl"` para direita para esquerda (a forma como texto árabe e hebraico são escritos) ou `"ttb"` para cima para baixo (como na escrita mongol).

{{index "slice method"}}

A propriedade `ranges` contém um array de ((intervalo))s de caracteres Unicode, cada um dos quais é um array de dois elementos contendo um limite inferior e um limite superior. Quaisquer códigos de caracteres dentro desses intervalos são atribuídos ao script. O ((limite)) inferior é inclusivo (o código 994 é um caractere copta) e o limite superior é não inclusivo (o código 1008 não é).

## Filtrando arrays

{{index [array, methods], [array, filtering], "filter method", [function, "higher-order"], "predicate function"}}

Se quisermos encontrar os scripts no conjunto de dados que ainda estão em uso, a seguinte função pode ser útil. Ela filtra os elementos de um array que não passam em um teste.

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

A função usa o argumento chamado `test`, um valor de função, para preencher uma "lacuna" na computação — o processo de decidir quais elementos coletar.

{{index "filter method", "pure function", "side effect"}}

Note como a função `filter`, em vez de deletar elementos do array existente, constrói um novo array com apenas os elementos que passam no teste. Esta função é _pura_. Ela não modifica o array que lhe é dado.

Como `forEach`, `filter` é um método de array ((padrão)). O exemplo definiu a função apenas para mostrar o que ela faz internamente. De agora em diante, a usaremos assim:

```
console.log(SCRIPTS.filter(s => s.direction == "ttb"));
// → [{name: "Mongolian", …}, …]
```

{{id map}}

## Transformando com map

{{index [array, methods], "map method"}}

Digamos que temos um array de objetos representando scripts, produzido ao filtrar o array `SCRIPTS` de alguma forma. Queremos um array de nomes, que é mais fácil de inspecionar.

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

## Resumindo com reduce

{{index [array, methods], "summing example", "reduce method"}}

Outra coisa comum de se fazer com arrays é calcular um único valor a partir deles. Nosso exemplo recorrente, somar uma coleção de números, é um exemplo disso. Outro exemplo é encontrar o script com mais caracteres.

{{indexsee "fold", "reduce method"}}

{{index [function, "higher-order"], "reduce method"}}

A operação de ordem superior que representa esse padrão é chamada de _reduce_ (às vezes também chamada de _fold_). Ela constrói um valor tomando repetidamente um único elemento do array e combinando-o com o valor atual. Ao somar números, você começaria com o número zero e, para cada elemento, adicionaria ao total.

Os parâmetros de `reduce` são, além do array, uma função de combinação e um valor inicial. Esta função é um pouco menos direta que `filter` e `map`, então observe-a de perto:

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

{{index "reduce method", "SCRIPTS dataset"}}

O método de array padrão `reduce`, que naturalmente corresponde a esta função, tem uma conveniência adicional. Se seu array contiver pelo menos um elemento, você pode omitir o argumento `start`. O método pegará o primeiro elemento do array como seu valor inicial e começará a reduzir a partir do segundo elemento.

```
console.log([1, 2, 3, 4].reduce((a, b) => a + b));
// → 10
```

{{index maximum, "characterCount function"}}

Para usar `reduce` (duas vezes) para encontrar o script com mais caracteres, podemos escrever algo assim:

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

A função `characterCount` reduz os intervalos atribuídos a um script somando seus tamanhos. Note o uso de desestruturação na lista de parâmetros da função redutora. A segunda chamada a `reduce` então usa isso para encontrar o maior script comparando repetidamente dois scripts e retornando o maior.

O script Han tem mais de 89.000 caracteres atribuídos a ele no padrão Unicode, tornando-o de longe o maior sistema de escrita no conjunto de dados. Han é um script às vezes usado para texto chinês, japonês e coreano. Essas línguas compartilham muitos caracteres, embora tendam a escrevê-los de forma diferente. O Consórcio Unicode (baseado nos EUA) decidiu tratá-los como um único sistema de escrita para economizar códigos de caracteres. Isso é chamado de _unificação Han_ e ainda deixa algumas pessoas muito irritadas.

## Composabilidade

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

Há mais alguns bindings, e o programa é quatro linhas mais longo, mas ainda é muito legível.

{{index "average function", composability, [function, "higher-order"], "filter method", "map method", "reduce method"}}

{{id average_function}}

As abstrações que essas funções fornecem realmente brilham quando você precisa _compor_ operações. Como exemplo, vamos escrever código que encontra o ano médio de origem para scripts vivos e mortos no conjunto de dados.

```
function average(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

console.log(Math.round(average(
  SCRIPTS.filter(s => s.living).map(s => s.year))));
// → 1165
console.log(Math.round(average(
  SCRIPTS.filter(s => !s.living).map(s => s.year))));
// → 204
```

Como você pode ver, os scripts mortos no Unicode são, em média, mais antigos que os vivos. Essa não é uma estatística terrivelmente significativa ou surpreendente. Mas espero que você concorde que o código usado para calculá-la não é difícil de ler. Você pode vê-lo como um pipeline: começamos com todos os scripts, filtramos os vivos (ou mortos), pegamos os anos desses, calculamos a média e arredondamos o resultado.

Você definitivamente também poderia escrever essa computação como um grande ((loop)).

```
let total = 0, count = 0;
for (let script of SCRIPTS) {
  if (script.living) {
    total += script.year;
    count += 1;
  }
}
console.log(Math.round(total / count));
// → 1165
```

No entanto, é mais difícil ver o que estava sendo computado e como. E como resultados intermediários não são representados como valores coerentes, seria muito mais trabalhoso extrair algo como `average` em uma função separada.

{{index efficiency, [array, creation]}}

Em termos do que o computador realmente está fazendo, essas duas abordagens também são bastante diferentes. A primeira construirá novos arrays ao executar `filter` e `map`, enquanto a segunda computa apenas alguns números, fazendo menos trabalho. Geralmente você pode se dar ao luxo da abordagem legível, mas se estiver processando arrays enormes e fazendo isso muitas vezes, o estilo menos abstrato pode valer a velocidade extra.

## Strings e códigos de caracteres

{{index "SCRIPTS dataset"}}

Um uso interessante desse conjunto de dados seria descobrir qual script um trecho de texto está usando. Vamos percorrer um programa que faz isso.

Lembre-se de que cada script tem um array de intervalos de códigos de caracteres associados a ele. Dado um código de caractere, poderíamos usar uma função como esta para encontrar o script correspondente (se houver):

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

O método `some` é outra função de ordem superior. Ele recebe uma função de teste e lhe diz se essa função retorna verdadeiro para qualquer um dos elementos no array.

{{id code_units}}

Mas como obtemos os códigos de caracteres em uma string?

No [Capítulo ?](values) mencionei que ((string))s JavaScript são codificadas como uma sequência de números de 16 bits. Estes são chamados de _((unidades de código))_. Um código de ((caractere)) ((Unicode)) supostamente caberia em tal unidade (o que lhe dá um pouco mais de 65.000 caracteres). Quando ficou claro que isso não seria suficiente, muitas pessoas relutaram em usar mais memória por caractere. Para resolver essas preocupações, ((UTF-16)), o formato também usado pelas strings JavaScript, foi inventado. Ele descreve a maioria dos caracteres comuns usando uma única unidade de código de 16 bits, mas usa um par de duas unidades para outros.

{{index error}}

UTF-16 é geralmente considerado uma má ideia hoje. Parece quase intencionalmente projetado para provocar erros. É fácil escrever programas que fingem que unidades de código e caracteres são a mesma coisa. E se sua linguagem não usa caracteres de duas unidades, isso parecerá funcionar perfeitamente. Mas assim que alguém tentar usar tal programa com alguns ((caracteres chineses)) menos comuns, ele quebra. Felizmente, com o advento dos ((emoji)), todos começaram a usar caracteres de duas unidades, e o fardo de lidar com tais problemas é mais justamente distribuído.

{{index [string, length], [string, indexing], "charCodeAt method"}}

Infelizmente, operações óbvias em strings JavaScript, como obter seu comprimento através da propriedade `length` e acessar seu conteúdo usando colchetes, lidam apenas com unidades de código.

```{test: no}
// Dois caracteres emoji, cavalo e sapato
let horseShoe = "🐴👟";
console.log(horseShoe.length);
// → 4
console.log(horseShoe[0]);
// → (Meio-caractere inválido)
console.log(horseShoe.charCodeAt(0));
// → 55357 (Código do meio-caractere)
console.log(horseShoe.codePointAt(0));
// → 128052 (Código real do emoji de cavalo)
```

{{index "codePointAt method"}}

O método `charCodeAt` do JavaScript lhe dá uma unidade de código, não um código de caractere completo. O método `codePointAt`, adicionado depois, dá um caractere Unicode completo, então poderíamos usá-lo para obter caracteres de uma string. Mas o argumento passado a `codePointAt` ainda é um índice na sequência de unidades de código. Para percorrer todos os caracteres em uma string, ainda precisaríamos lidar com a questão de se um caractere ocupa uma ou duas unidades de código.

{{index "for/of loop", character}}

No [capítulo anterior](data#for_of_loop), mencionei que um loop `for`/`of` também pode ser usado em strings. Assim como `codePointAt`, esse tipo de loop foi introduzido em um momento em que as pessoas estavam agudamente cientes dos problemas com UTF-16. Quando você o usa para percorrer uma string, ele lhe dá caracteres reais, não unidades de código.

```
let roseDragon = "🌹🐉";
for (let char of roseDragon) {
  console.log(char);
}
// → 🌹
// → 🐉
```

Se você tem um caractere (que será uma string de uma ou duas unidades de código), pode usar `codePointAt(0)` para obter seu código.

## Reconhecendo texto

{{index "SCRIPTS dataset", "countBy function", [array, counting]}}

Temos uma função `characterScript` e uma forma de percorrer caracteres corretamente. O próximo passo é contar os caracteres que pertencem a cada script. A seguinte abstração de contagem será útil aqui:

```{includeCode: strip_log}
function countBy(items, groupName) {
  let counts = [];
  for (let item of items) {
    let name = groupName(item);
    let known = counts.find(c => c.name == name);
    if (!known) {
      counts.push({name, count: 1});
    } else {
      known.count++;
    }
  }
  return counts;
}

console.log(countBy([1, 2, 3, 4, 5], n => n > 2));
// → [{name: false, count: 2}, {name: true, count: 3}]
```

A função `countBy` espera uma coleção (qualquer coisa sobre a qual possamos iterar com `for`/`of`) e uma função que computa um nome de grupo para um dado elemento. Ela retorna um array de objetos, cada um dos quais nomeia um grupo e lhe diz o número de elementos que foram encontrados naquele grupo.

{{index "find method"}}

Ela usa outro método de array, `find`, que percorre os elementos do array e retorna o primeiro para o qual uma função retorna verdadeiro. Retorna `undefined` quando não encontra tal elemento.

{{index "textScripts function", "Chinese characters"}}

Usando `countBy`, podemos escrever a função que nos diz quais scripts são usados em um trecho de texto.

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

A função primeiro conta os caracteres por nome, usando `characterScript` para atribuir-lhes um nome e recorrendo à string `"none"` para caracteres que não fazem parte de nenhum script. A chamada `filter` descarta a entrada para `"none"` do array resultante, já que não estamos interessados nesses caracteres.

{{index "reduce method", "map method", "join method", [array, methods]}}

Para poder calcular ((porcentagem))ns, primeiro precisamos do número total de caracteres que pertencem a um script, que podemos calcular com `reduce`. Se não encontrarmos tais caracteres, a função retorna uma string específica. Caso contrário, ela transforma as entradas de contagem em strings legíveis com `map` e então as combina com `join`.

## Resumo

Poder passar valores de função para outras funções é um aspecto profundamente útil de JavaScript. Nos permite escrever funções que modelam computações com "lacunas" nelas. O código que chama essas funções pode preencher as lacunas fornecendo valores de função.

Arrays fornecem uma série de métodos de ordem superior úteis. Você pode usar `forEach` para percorrer os elementos de um array. O método `filter` retorna um novo array contendo apenas os elementos que passam na ((função predicado)). Você pode transformar um array passando cada elemento por uma função usando `map`. Pode usar `reduce` para combinar todos os elementos de um array em um único valor. O método `some` testa se algum elemento corresponde a uma dada função predicado, enquanto `find` encontra o primeiro elemento que corresponde a um predicado.

## Exercícios

### Achatamento

{{index "flattening (exercise)", "reduce method", "concat method", [array, flattening]}}

Use o método `reduce` em combinação com o método `concat` para "achatar" um array de arrays em um único array que tem todos os elementos dos arrays originais.

{{if interactive

```{test: no}
let arrays = [[1, 2, 3], [4, 5], [6]];
// Seu código aqui.
// → [1, 2, 3, 4, 5, 6]
```
if}}

### Seu próprio loop

{{index "your own loop (example)", "for loop"}}

Escreva uma função de ordem superior `loop` que forneça algo como uma instrução de loop `for`. Ela deve receber um valor, uma função de teste, uma função de atualização e uma função de corpo. A cada iteração, ela deve primeiro executar a função de teste no valor atual do loop e parar se retornar `false`. Então deve chamar a função de corpo, dando a ela o valor atual, e finalmente chamar a função de atualização para criar um novo valor e recomeçar do início.

Ao definir a função, você pode usar um loop regular para fazer o loop de fato.

{{if interactive

```{test: no}
// Seu código aqui.

loop(3, n => n > 0, n => n - 1, console.log);
// → 3
// → 2
// → 1
```

if}}

### Everything

{{index "predicate function", "everything (exercise)", "every method", "some method", [array, methods], "&& operator", "|| operator"}}

Arrays também têm um método `every` análogo ao método `some`. Este método retorna `true` quando a função dada retorna `true` para _todos_ os elementos no array. De certa forma, `some` é uma versão do operador `||` que age sobre arrays, e `every` é como o operador `&&`.

Implemente `every` como uma função que recebe um array e uma função predicado como parâmetros. Escreva duas versões, uma usando um loop e uma usando o método `some`.

{{if interactive

```{test: no}
function every(array, test) {
  // Seu código aqui.
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

Assim como o operador `&&`, o método `every` pode parar de avaliar mais elementos assim que encontrar um que não corresponda. Então a versão baseada em loop pode saltar para fora do loop — com `break` ou `return` — assim que encontrar um elemento para o qual a função predicado retorna `false`. Se o loop chegar ao fim sem encontrar tal elemento, sabemos que todos os elementos corresponderam e devemos retornar `true`.

Para construir `every` em cima de `some`, podemos aplicar as _((leis de De Morgan))_, que dizem que `a && b` é igual a `!(!a || !b)`. Isso pode ser generalizado para arrays, onde todos os elementos no array correspondem se não há nenhum elemento no array que não corresponda.

hint}}

### Direção de escrita dominante

{{index "SCRIPTS dataset", "direction (writing)", "groupBy function", "dominant direction (exercise)"}}

Escreva uma função que calcule a direção de escrita dominante em uma string de texto. Lembre-se de que cada objeto de script tem uma propriedade `direction` que pode ser `"ltr"` (esquerda para direita), `"rtl"` (direita para esquerda) ou `"ttb"` (cima para baixo).

{{index "characterScript function", "countBy function"}}

A direção dominante é a direção da maioria dos caracteres que têm um script associado a eles. As funções `characterScript` e `countBy` definidas anteriormente no capítulo provavelmente são úteis aqui.

{{if interactive

```{test: no}
function dominantDirection(text) {
  // Seu código aqui.
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl
```
if}}

{{hint

{{index "dominant direction (exercise)", "textScripts function", "filter method", "characterScript function"}}

Sua solução pode se parecer muito com a primeira metade do exemplo `textScripts`. Você novamente precisa contar caracteres por um critério baseado em `characterScript` e então filtrar a parte do resultado que se refere a caracteres desinteressantes (sem script).

{{index "reduce method"}}

Encontrar a direção com a maior contagem de caracteres pode ser feito com `reduce`. Se não estiver claro como, consulte o exemplo anterior no capítulo, onde `reduce` foi usado para encontrar o script com mais caracteres.

hint}}
