# Expressões Regulares

{{quote {author: "Jamie Zawinski", chapter: true}

> "Algumas pessoas, quando confrontadas com um problema, pensam "Eu sei, terei que usar expressões regulares." Agora elas têm dois problemas.
>
> — Jamie Zawinski

quote}}

{{index "Zawinski, Jamie"}}

{{if interactive

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

> "Yuan-Ma disse, 'Quando você serra contra o sentido da madeira, muita força será necessária. Quando você programa contra o sentido do problema, muito código será necessário'
>
> — Mestre Yuan-Ma, The Book of Programming

quote}}

if}}

{{figure {url: "img/chapter_picture_9.jpg", alt: "A railroad diagram", chapter: "square-framed"}}}

{{index evolution, adoption, integration}}

A maneira como técnicas e convenções de programação sobrevivem e se disseminam, ocorrem de um modo caótico, evolucionário. Não é comum que a mais agradável e brilhante vença, mas sim aquelas que funcionam bem com o nicho ou as que aparentam ser integradas com outra tecnologia de sucesso.

{{index "domain-specific language"}}

Neste capítulo, discutiremos uma dessas tecnologias, expressões regulares. Expressões regulares são um modo de descrever padrões nos dados de uma _string_. Eles formam uma pequena linguagem à parte, que inclui JavaScript e várias outras linguagens e sistemas.

{{index [interface, design]}}

Expressões regulares são ao mesmo tempo, estranhas e extremamente úteis. Sua sintaxe é enigmática é a interface que o JavaScript oferece para elas é desajeitada. Mas elas são uma ferramenta poderosa utilizada para inspecionar e processar _strings_. A compreensão adequada das expressões regulares fará de você um programador mais eficaz.

---

## Criando uma Expressão Regular

{{index ["regular expression", creation], "RegExp class", "literal expression", "slash character"}}

Uma expressão regular é um tipo de objeto. Ele pode ser construído com o construtor _RegExp_ ou escrito como um valor literal, encapsulando o padrão com o caractere barra ('/').

```js
let re1 = new RegExp("abc");
let re2 = /abc/;
```

Ambos os objetos acima representam o mesmo padrão: um caractere `a` seguido de um caractere `b` e depois de um caractere `c`.

{{index ["backslash character", "in regular expressions"], "RegExp class"}}

Ao usarmos o construtor `RegExp`, o padrão é escrito como uma _string_ normal, de modo que as regras normais se aplicam para barras invertidas.

{{index ["regular expression", escaping], [escaping, "in regexps"], "slash character"}}

A segunda notação, onde o padrão está entre barras, trata as barras invertidas de maneira um pouco diferente. Primeiro, como uma barra encerra o padrão, é necessário colocarmos uma barra invertida antes de inserirmos qualquer barra que queremos que faça parte do padrão. Além disso, as barras invertidas que não pertencem a códigos de caracteres especiais (como `\n`) serão preservadas ao invés de serem ignoradas, pois fazem parte de _strings_ e alteram o significado do padrão. Alguns caracteres, como sinais de interrogação (`?`) e sinais de soma (`+`), possuem um significado especial em expressões regulares e devem ser precedidos por barras invertidas para representarem o próprio caractere, e não o comando de expressão regular.

```js
let eighteenPlus = /eighteen\+/;
```

## Teste de correspondências

{{index matching, "test method", ["regular expression", methods]}}

Expressões regulares possuem vários métodos. O mais simples é o `test`. Se você o passa como uma _string_, ele retorna um booleano que informa se a _string_ mantém uma correspondência do padrão na expressão.

```js
console.log(/abc/.test("abcde"));
// → true
console.log(/abc/.test("abxde"));
// → false
```

{{index pattern}}

Uma ((expressão regular)) que contenha apenas caracteres simples, representa essa mesma sequência de caracteres. Se "abc" existe em qualquer lugar (não apenas no início), `test` retornará verdadeiro.

## Encontrando um conjunto de caracteres

{{index "regular expression", "indexOf method"}}

Saber quando uma _string_ contém "abc" pode muito bem ser feito usando a função `indexOf`. A diferença das expressões regulares é que elas nos permite usar padrões mais complexos.

Digamos que queremos encontrar qualquer número. Em uma expressão regular, colocar um conjunto de caracteres entre colchetes (`[]`) faz com que a expressão encontre qualquer dos caracteres dentro dos colchetes.

Ambas as expressões abaixo encontram todas as _strings_ que contem um dígito numérico.

```js
console.log(/[0123456789]/.test("in 1992"));
// → true
console.log(/[0-9]/.test("in 1992"));
// → true
```

{{index "hyphen character"}}

Dentro de colchetes, um hífen (`-`) entre dois caracteres pode ser usado para indicar um conjunto de caracteres, onde a ordem é determinada pelo número _Unicode_ do caractere. Os caracteres de `0` a `9` contém todos os dígitos (códigos 48 a 57), então `[0-9]` e encontra qualquer dígito.

{{index [whitespace, matching], "alphanumeric character", "period character"}}

Existem alguns grupos de caracteres de uso comum, que já possuem atalhos inclusos. Dígitos são um deles: (`\d`), que possui o mesmo significado que `[0-9]`.

{{index "newline character", [whitespace, matching]}}

{{table {cols: [1, 5]}}}

    - \d	caracteres numéricos
    - \w	caracteres alfanuméricos ("letras")
    - \s	espaços em branco (espaço, tabs, quebras de linha e similares)
    - \D	caracteres que não são dígitos
    - \W	caracteres não alfanuméricos
    - \S	caracteres que não representam espaços
    - . (ponto)	todos os caracteres, exceto espaços

Então você pode registrar um formato de data e hora como `30/01/2003 15:20` com a seguinte expressão:

```js
let dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/;
console.log(dateTime.test("01-30-2003 15:20"));
// → true
console.log(dateTime.test("30-jan-2003 15:20"));
// → false
```

{{index ["backslash character", "in regular expressions"]}}

Parece confuso, certo? Muitas barras invertidas sujando a expressão e dificultando compreender qual é o padrão procurado. Veremos mais a frente uma versão melhorada desta expressão.

{{index [escaping, "in regexps"], "regular expression", set}}

Estes marcadores de categoria também podem ser usados dentro de colchetes, então `[\d.]` significa qualquer dígito ou caractere de ponto final. Mas o próprio ponto final, entre colchetes, perde seu significado especial. O mesmo vale para outros caracteres especiais, como `+`.

{{index "square brackets", inversion, "caret character"}}

Para "inverter" um conjunto de caracteres e buscar tudo menos o que você escreveu no padrão, você pode colocar um acento circunflexo (`^`) após abrir colchetes.

```js
let notBinary = /[^01]/;
console.log(notBinary.test("1100100010100110"));
// → false
console.log(notBinary.test("1100100010200110"));
// → true
```

## Partes repetidas em um padrão

{{index ["regular expression", repetition]}}

Agora nós já sabemos como encontrar um dígito, mas e se o que queremos é encontrar um número, uma sequência de um ou mais dígitos?

{{index "plus character", repetition, `+ operator`}}

Quando colocamos um sinal de mais (`+`) depois de algo em uma expressão regular, indicamos que pode existir mais de um. Então `/\d+/` encontra um ou mais dígitos.

```js
console.log(/'\d+'/.test("'123'"));
// → true
console.log(/'\d+'/.test("''"));
// → false
console.log(/'\d*'/.test("'123'"));
// → true
console.log(/'\d*'/.test("''"));
// → true
```

{{index "* operator", asterisk}}

O asterisco (`*`) tem um significado similar, mas também permite não encontrar o padrão. Então, algo colocado com um asterisco depois dele, não impede um padrão de ser achado, ele apenas retornará zero resultados se não conseguir encontrar algum texto adequado.

{{index "British English", "American English", "question mark"}}

Uma interrogação (`?`) define uma parte do padrão de busca como "opcional", o que significa que ele pode ocorrer zero vezes ou apenas uma vez. No exemplo a seguir, é permitido que ocorra o caractere `u`, mas o padrão também é encontrado quando ele está ausente.

```js
let neighbor = /neighbou?r/;
console.log(neighbor.test("neighbour"));
// → true
console.log(neighbor.test("neighbor"));
// → true
```

{{index repetition, [braces, "in regular expression"]}}

Para permitir que um padrão ocorra um número definido de vezes, use chaves (`{}`). Colocando `{4}` depois de um elemento do padrão, requer que ele ocorra exatamente 4 vezes. Da mesma maneira, `{2,4}` é utilizado para definir que ele deve aparecer no mínimo 2 vezes e no máximo 4.

{{id date_regexp_counted}}

Aqui está outra versão do padrão de data e hora que permite dias, meses e horas com um ou mais dígitos. Também são mais legíveis:

```js
let dateTime = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime.test("1-30-2003 8:45"));
// → true
```

Também é possível deixar em aberto o número mínimo ou máximo de ocorrências, omitindo o número após a vírgula. Então `{5,}` significa que deve ocorrer cinco ou mais vezes.

## Agrupando subexpressões

{{index ["regular expression", grouping], grouping, [parentheses, "in regular expressions"]}}

Para usar um operador como `*` ou `+` em mais de um caractere por vez, é necessário o uso de parênteses. Um pedaço de uma expressão regular que é delimitado por parênteses conta como uma única unidade, assim como os operadores aplicados a esse pedaço delimitado.

```js
let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohoooohoohooo"));
// → true
```

{{index crying}}

O primeiro e segundo caractere `+` aplicam-se apenas ao segundo `o` em `boo hoo`, respectivamente. O terceiro `+` se aplica a todo grupo (`hoo+`), combinando uma ou mais sequências como essa.

{{index "case sensitivity", capitalization, ["regular expression", flags]}}

O "i" no final da expressão do exemplo acima faz com que a expressão regular seja _case-insensitive_, permitindo-a encontrar a letra maiúscula `B` na _string_ dada, mesmo que a descrição do padrão tenha sido feita em letras minúsculas.

## Resultados e grupos

{{index ["regular expression", grouping], "exec method", [array, "RegExp match"]}}

O método `test` é a maneira mais simples de encontrar correspondências de uma expressão regular. Ela apenas informa se foi encontrado algo e nada mais. Expressões regulares também possuem o método `exec` (executar), que irá retornar `null` quando nenhum resultado for encontrado, e um objeto com informações se encontrar.

```js
let match = /\d+/.exec("one two 100");
console.log(match);
// → ["100"]
console.log(match.index);
// → 8
```

{{index "index property", [string, indexing]}}

Um objeto retornado pelo método _exec_ possui um index de propriedades que informa aonde na _string_ o resultado encontrado se inicia. Além disso, o objeto parece (e de fato é) um _array_ de _strings_, cujo primeiro elemento é a _string_ que foi encontrada. No exemplo anterior, esta é a sequência de dígitos que estávamos procurando.

{{index [string, methods], "match method"}}

Valores _string_ possuem um método que se comporta de maneira semelhante.

```js
console.log("one two 100".match(/\d+/));
// → ["100"]
```

{{index grouping, "capture group", "exec method"}}

Quando uma expressão regular contém expressões agrupadas entre parênteses, o texto que corresponde a esses grupos também aparece no _array_. O primeiro elemento sempre é todo o resultado, seguido pelo resultado do primeiro grupo entre parênteses, depois o segundo grupo e assim em diante.

```js
let quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));
// → ["'hello'", "hello"]
```

{{index "capture group"}}

Quando um grupo não termina sendo achado (se por exemplo, possui um sinal de interrogação depois dele), seu valor no array de resultado será undefined. Do mesmo modo, quando um grupo é achado várias vezes, apenas o último resultado encontrado estará no array.

```js
console.log(/bad(ly)?/.exec("bad"));
// → ["bad", undefined]
console.log(/(\d)+/.exec("123"));
// → ["123", "3"]
```

{{index "exec method", ["regular expression", methods], extraction}}

Grupos podem ser muito úteis para extrair partes de uma _string_. Por exemplo, podemos querer não apenas verificar quando uma _string_ contém uma data, mas também extraí-la, e construir um objeto que a representa. Se adicionarmos parênteses em volta do padrão de dígitos, poderemos selecionar a data no resultado da função `exec`.

Mas antes, um pequeno desvio, na qual discutiremos a maneira integrada de representar os valores de data e hora em JavaScript.

## O tipo _Data_

{{index constructor, "Date class"}}

O JavaScript possui uma classe padrão para representar datas, ou melhor, pontos no tempo. Ele é chamado `Date`. Se você simplesmente criar uma data usando `new`, terá a data e hora atual.

```js
console.log(new Date());
// → Mon Nov 13 2017 16:19:11 GMT+0100 (CET)
```

{{index "Date class"}}

Também é possível criar um objeto para uma hora específica

```js
console.log(new Date(2009, 11, 9));
// → Wed Dec 09 2009 00:00:00 GMT+0100 (CET)
console.log(new Date(2009, 11, 9, 12, 59, 59, 999));
// → Wed Dec 09 2009 12:59:59 GMT+0100 (CET)
```

{{index "zero-based counting", [interface, design]}}

O JavaScript utiliza uma convenção onde a numeração dos meses se inicia em zero (então Dezembro é 11), mas os dias iniciam-se em um. É bem confuso e bobo, então, tenha cuidado.

Os últimos quatro argumentos (horas, minutos, segundos e milissegundos) são opcionais, e assumem o valor de zero se não forem fornecidos.

{{index "getTime method"}}

Internamente, objetos do tipo data são armazenados como o número de milissegundos desde o início de 1970, no fuso horário UTC. Ele segue uma convenção definida pela "hora do _Unix_", que foi inventada nessa época. Você pode usar números negativos para tempos anteriores a 1970. Usar o método `getTime` em uma data retorna esse número, e ele é bem grande, como deve imaginar.

```js
console.log(new Date(2013, 11, 19).getTime());
// → 1387407600000
console.log(new Date(1387407600000));
// → Thu Dec 19 2013 00:00:00 GMT+0100 (CET)
```

{{index "Date.now function", "Date class"}}

Quando fornecemos apenas um argumento ao construtor do `Date`, ele é tratado como se fosse um número de milissegundos. Você pode obter a contagem atual de milissegundos criando um novo objeto `Date` usando o método `getTime` ou chamando a função `Date.now`.

{{index "getFullYear method", "getMonth method", "getDate method", "getHours method", "getMinutes method", "getSeconds method", "getYear method"}}

{{index "capture group", "getDate method", [parentheses, "in regular expressions"]}}

Objetos `Date` possuem métodos como `getFullYear`, `getMonth`, `getDate`, `getHours`, `getMinutes` e `getSeconds` para extrair seus componentes. Além de `getFullYear`, também há `getYear` que retorna o ano menos 1900 (98 ou 119) o que é quase inútil.

Então agora, ao colocarmos parênteses em volta das partes que nos interessam, podemos facilmente extrair uma data de uma _string_.

```js
function getDate(string) {
	let [_, month, day, year] = /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
	return new Date(year, month - 1, day);
}
console.log(getDate("1-30-2003"));
// → Thu Jan 30 2003 00:00:00 GMT+0100 (CET)
```

{{index destructuring, "underscore character"}}

O `_` (underline) é ignorado e usado apenas para pular o elemento completo de correspondência no _array_ retornado por `exec`.

## Limites de palavra e _string_

{{index matching, ["regular expression", boundary]}}

Infelizmente, a função `getDate` acima também irá extrair a data absurda `00-1-3000` da _string_ `100-1-30000`, um resultado pode acontecer em qualquer lugar da _string_ fornecida, então, nesse caso, vai encontrar no segundo caractere e terminar no penúltimo.

{{index boundary, "caret character", "dollar sign"}}

Se quisermos nos assegurar que a busca seja em todo a _string_, podemos adicionar os marcadores `^` e `$`. O acento circunflexo corresponde ao início da _string_ fornecida, enquanto a sifrão corresponde ao final dela. Então `/^\d+$/` encontra apenas em uma _string_ feita de um ou mais dígitos, `/^!/` encontra qualquer _string_ que começa com sinal de exclamação e `/x^/` não corresponde a nenhuma _string_ (não pode haver um x antes do início da _string_).

{{index "word boundary", "word character"}}

Se, por outro lado, queremos ter certeza que a data inicia e termina no limite da palavra, usamos o marcador `\b`. Um limite de palavra pode ser no início ou fim de uma _string_ ou qualquer ponto nela em que tenha um caractere de palavra de um lado e um caractere que não seja uma palavra de outro (como em `\w`).

```js
console.log(/cat/.test("concatenate"));
// → true
console.log(/\bcat\b/.test("concatenate"));
// → false
```

{{index matching}}

Note que esses marcadores de limite não cobrem nenhum caractere real, eles apenas asseguram que a expressão regular corresponda apenas quando uma certa condição for mantida no lugar onde ele aparece no padrão.

## Padrões de escolha

{{index branching, ["regular expression", alternatives], "farm example"}}

Digamos que queremos saber se um pedaço do texto contém não apenas um número, mas um número seguido por uma das palavras "porco", "vaca", "galinha" ou seus plurais também.

Podemos escrever três expressões regulares, e testar cada uma, mas existe uma maneira mais simples. O caractere pipe (`|`) indica uma opção entre o padrão à esquerda ou a direita. Então podemos fazer:

```js
let animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
console.log(animalCount.test("15 pigs"));
// → true
console.log(animalCount.test("15 pigchickens"));
// → false
```

{{index [parentheses, "in regular expressions"]}}

Parênteses podem ser usados para limitar a que parte do padrão que o pipe (`|`) se aplica, e você pode colocar vários desses operadores lado a lado para expressar uma escolha entre mais de dois padrões.

## O mecanismo de correspondência

{{index ["regular expression", matching], [matching, algorithm], "search problem"}}

Conceitualmente, quando usamos `exec` ou `test`, o mecanismo de expressão regular busca uma correspondência em sua _string_, tentando corresponder à expressão do início da _string_ primeiro, depois do segundo caractere e assim por diante, até encontrar uma correspondência ou chegar ao fim da _string_. Ele retornará a primeira correspondência que pode ser encontrada ou não encontrará nenhuma correspondência.

{{index ["regular expression", matching], [matching, algorithm]}}

Para fazer a correspondência atual, o mecanismo trata a expressão regular como um diagrama de fluxo. Este é o diagrama para a expressão do conjunto de animais do exemplo anterior:

{{figure {url: "img/re_pigchickens.svg", alt: "Visualization of /\b\d+ (pig|cow|chicken)s?\b/"}}}

{{index traversal}}

Uma _string_ corresponde à expressão se um caminho do início (esquerda) até o final (direita) do diagrama puder ser encontrado, com uma posição inicial e final correspondente, de modo que cada vez que passar em uma caixa, verificamos que a posição atual na sequência corresponde ao elemento descrito nela, e, para os elementos que correspondem caracteres reais (menos os limites de palavra), continue no fluxo das caixas.

Portanto, se tentarmos combinar `the 3 pigs` da posição 4, nosso progresso através do fluxograma ficaria assim:

-   Na posição 4, existe um limite de palavra, então passamos a primeira caixa;
-   Ainda na posição 4, encontramos um dígito, então também podemos passar a segunda caixa;
-   Na posição 5, poderíamos voltar para antes da segunda caixa (dígitos), ou avançar através da caixa que contém um único caractere de espaço. Há um espaço aqui, não um dígito, por isso escolhemos o segundo caminho;
-   Estamos agora na posição 6 (o início de `pigs`) e na divisão entre três caminhos do diagrama. Nós não temos `cow` ou `chicken` aqui, mas nós temos `pig`, por isso tomamos esse caminho;
-   Na posição 9, depois da divisão em três caminhos, poderíamos também ignorar o "s" e ir direto para o limite da palavra, ou achar o "s" primeiro. Existe um "s", não um limite de palavra, então passamos a caixa "s";
-   Estamos na posição 10 (final da string) e só podemos achar um limite de palavra. O fim de uma _string_ conta como um limite de palavra, de modo que passamos através da última caixa e combinamos com sucesso a _string_.

{{id backtracking}}

## Retrocedendo

{{index ["regular expression", backtracking], "binary number", "decimal number", "hexadecimal number", "flow diagram", [matching, algorithm], backtracking}}

A expressão regular `/\b([01]+b|\d+|[\da-f]h)\b/` encontra um número binário seguido por um `b`, um número decimal, sem um caractere de sufixo, ou um número hexadecimal (de base 16, com as letras `a` a `f` para os algarismos de 10 a 15), seguido por um `h`. Este é o diagrama equivalente:

{{figure {url: "img/re_number.svg", alt: "Visualization of /\b([01]+b|\d+|[\da-f]+h)\b/"}}}

{{index branching}}

Ao buscar esta expressão, muitas vezes o ramo superior será percorrido, mesmo que a entrada não contenha realmente um número binário. Quando busca a _string_ `103`, é apenas no `3` que torna-se claro que estamos no local errado. A _string_ é buscada não apenas no ramo que se está executando.

{{index backtracking, "search problem"}}

É o que acontece se a expressão retroage. Quando entra em um ramo, ela guarda em que ponto aconteceu (nesse caso, no início da _string_, na primeira caixa do diagrama), então ela retrocede e tenta outro ramo do diagrama se o atual não encontra nenhum resultado. Então para a _string_ `103`, após encontrar o caractere `3`, ela tentará o segundo ramo do número decimal. E este, encontra um resultado.

{{index [matching, algorithm]}}

Quando mais de um ramo encontra um resultado, o primeiro (na ordem em que foi escrito na expressão regular) será considerado.

Retroceder acontece também, de maneiras diferentes, quando buscamos por operadores repetidos. Se buscarmos `/^._x/` em `abcxe`, a parte `._` tentará achar toda a _string_. Depois, tentará achar apenas o que for seguido de um `x`, e não existe um `x` no final da _string_. Então ela tentará achar desconsiderando um caractere, e outro, e outro. Quando acha o "x", sinaliza um resultado com sucesso, da posição 0 até 4.

{{index performance, complexity}}

É possível escrever expressões regulares que fazem muitos retrocessos. O Problema ocorre quando um padrão encontra um pedaço da _string_ de entrada de muitas maneiras. Por exemplo, se confundimos e escrevemos nossa expressão regular para achar binários e números assim `/([01]+)+b/`.

{{figure {url: "img/re_slow.svg", alt: "Visualization of /([01]+)+b/",width: "6cm"}}}

{{index "inner loop", [nesting, "in regexps"]}}

Ela tentará achar séries de zeros sem um `b` após elas, depois irá percorrer o circuito interno até passar por todos os dígitos. Quando perceber que não existe nenhum `b`, retorna uma posição e passa pelo caminho de fora mais uma vez, e de novo, retrocedendo até o circuito interno mais uma vez. Continuará tentando todas as rotas possíveis através destes dois _loops_, em todos os caracteres. Para _strings_ mais longas o resultado demorará praticamente para sempre.

## O método _replace_

{{index "replace method", "regular expression"}}

_Strings_ possuem o método `replace`, que pode ser usado para substituir partes da _string_ com outra _string_.

```js
console.log("papa".replace("p", "m"));
// → mapa
```

{{index ["regular expression", flags], ["regular expression", global]}}

O primeiro argumento também pode ser uma expressão regular; nesse caso, a primeira correspondência da expressão regular será substituída. Quando a opção `g` ("global") é adicionada à expressão regular, todas as correspondências na string serão substituídas, não apenas a primeira.

```js
console.log("Borobudur".replace(/[ou]/, "a"));
// → Barobudur
console.log("Borobudur".replace(/[ou]/g, "a"));
// → Barabadar
```

{{index [interface, design], argument}}

Teria sido sensato se a escolha entre substituir uma correspondência ou todas as correspondências fosse feita por meio de um argumento adicional `replace`, ou fornecendo um método diferente `replaceAll`. Mas infelizmente a escolha depende de uma propriedade de expressão regular.

{{index grouping, "capture group", "dollar sign", "replace method", ["regular expression", grouping]}}

A verdadeira utilidade do uso de expressões regulares com o método `replace` é a opção de fazer referências aos grupos combinados através da _string_. Por exemplo, se temos uma _string_ longa com nomes de pessoas, uma por linha, no formato "Lastname, Name" e queremos trocar essa ordem e remover a vírgula, para obter o formato "Name Lastname", podemos usar o seguinte código:

```js
console.log(
	"Liskov, Barbara\nMcCarthy, John\nWadler, Philip".replace(
		/(\w+), (\w+)/g,
		"$2 $1"
	)
);
// → Barbara Liskov
//   John McCarthy
//   Philip Wadler
```

O `$1` e `$2` na _string_ de substituição referem-se as partes entre parênteses no padrão. `$1` será substituído pelo texto encontrado no primeiro grupo entre parênteses e `$2` pelo segundo, e assim em diante, até `$9`. A correspondência inteira pode ser referenciada com `$&`.

{{index [function, "higher-order"], grouping, "capture group"}}

Também é possível passar uma função, em vez de uma _string_ no segundo argumento do método `replace`. Para cada substituição, a função será chamada com os grupos encontrados (bem como toda a correspondência) como argumentos, e o valor retornado pela função será inserido na nova _string_.

Aqui está um pequeno exemplo:

```js
let s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)\b/g, (str) => str.toUpperCase()));
// → the CIA and FBI
```

E outro exemplo mais interessante:

```js
let stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
	amount = Number(amount) - 1;
	if (amount == 1)
		// only one left, remove the 's'
		unit = unit.slice(0, unit.length - 1);
	else if (amount == 0) amount = "no";
	return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\w+)/g, minusOne));
// → no lemon, 1 cabbage, and 100 eggs
```

Ele pega a _string_, encontra todas as ocorrências de um número seguido por uma palavra alfanumérica e retorna uma nova _string_ onde em cada ocorrência é diminuído por um.

O grupo `\d+` finaliza o argumento _amount_ da função e o `\w+` limita a unidade. A função converte o valor em um número, desde que encontrado, `\d+` faz ajustes caso reste apenas um ou zero.

## Quantificador / Greed

{{index greed, "regular expression"}}

É possível usar o método `replace` para escrever uma função que remove todos os comentários de um pedaço de código JavaScript. Veja uma primeira tentativa:

```js
function stripComments(code) {
	return code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
}
console.log(stripComments("1 + /* 2 */3"));
// → 1 + 3
console.log(stripComments("x = 10;// ten!"));
// → x = 10;
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1  1
```

{{index "period character", "slash character", "newline character", "empty set", "block comment", "line comment"}}

A parte antes do operador ou corresponde a dois caracteres de barra seguidos por qualquer número de caracteres que não sejam de nova linha. A parte dos comentários em várias linhas é mais envolvente. Usamos `[^]` (qualquer caractere que não esteja no conjunto vazio de caracteres) como uma forma de corresponder a qualquer caractere. Não podemos simplesmente usar um ponto final aqui porque os comentários de bloco podem continuar em uma nova linha e o caractere de ponto final não corresponde a caracteres de uma nova linha.

Mas o resultado da última linha parece errado. Por quê?

{{index backtracking, greed, "regular expression"}}

A parte `[^]*` da expressão, como foi escrita na seção "Retrocedendo", acima, encontrará primeiro tudo que puder e depois, se falhar, volta atrás e tenta mais uma vez a partir daí. Nesse caso, primeiro tentamos combinar no resto da _string_ e depois continuamos a partir daí. Ele encontrará uma ocorrência de `*/` depois volta quatro caracteres e acha um resultado. Isto não era o que desejávamos, queríamos um comentário de uma linha, para não ir até o final do código e encontrar o final do último comentário do bloco.

Devido a esse comportamento, dizemos que os operadores de repetição em expressões regulares (`+`, `\*`, e `{}`) são gananciosos. Por padrão, eles quantificam, significa que eles encontram o que podem e retrocedem a partir daí. Se você colocar uma interrogação depois deles, eles se tornam _non_greedy_, e começam encontrando o menor grupo possível e o resto que não contenha o grupo menor.

E é exatamente o que queremos nesse caso. Com o asterisco encontramos os grupos menores que tenham `\*/` no fechamento, encontramos um bloco de comentários e nada mais.

```js
function stripComments(code) {
	return code.replace(/\/\/.*|\/\*[\w\W]*?\*\//g, "");
}
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1 + 1
```

Muitos bugs em programas de expressão regular podem ser rastreados até o uso não intencional de um operador ganancioso, onde um _non_greedy_ funcionaria melhor. Ao usar um operador de repetição, considere a variante _non_greedy_ primeiro.

## Criando objetos RegExp dinamicamente

{{index ["regular expression", creation], "underscore character", "RegExp class"}}

Existem casos onde você pode não saber o padrão exato que você precisa quando escreve seu código. Digamos que você queira buscar o nome de um usuário em um pedaço de texto e colocá-lo entre caracteres `\_` para destacá-lo. O nome será fornecido apenas quando o programa estiver sendo executado, então não podemos usar a notação de barras para criar nosso padrão.

Mas podemos construir uma _string_ e usar o construtor _RegExp_ para isso. Por exemplo:

```js
let name = "harry";
let text = "Harry is a suspicious character.";
let regexp = new RegExp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// → _Harry_ is a suspicious character.
```

{{index ["regular expression", flags], ["backslash character", "in regular expressions"]}}

Ao criar os marcos de limite `\b`, usamos duas barras invertidas, porque estamos escrevendo-os em uma _string_ normal, não uma expressão regular com barras. O segundo argumento para o _RegExp_ construtor contém as opções com a expressão regular - neste caso, o `gi` para global não diferencia maiúsculas de minúsculas.

Mas e se o nome for `dea+hl[]rd` porque o nosso usuário é um adolescente nerd? Isso irá gerar uma falsa expressão regular, por conter caracteres comando, que irá gerar um resultado estranho.

{{index ["backslash character", "in regular expressions"], [escaping, "in regexps"], ["regular expression", escaping]}}

Para contornar isso, adicionamos contrabarras antes de qualquer caractere que tenha um significado especial.

```js
let name = "dea+hl[]rd";
let text = "This dea+hl[]rd guy is super annoying.";
let escaped = name.replace(/[\\[.+*?(){|^$]/g, "\\$&");
let regexp = new RegExp("\\b" + escaped + "\\b", "gi");
console.log(text.replace(regexp, "_$&_"));
// → This _dea+hl[]rd_ guy is super annoying.
```

## O método _search_

{{index ["regular expression", methods], "indexOf method", "search method"}}

O método _indexOf_ em _strings_ não pode ser chamado com uma expressão regular. Mas existe um outro método, _search_, que espera como argumento uma expressão regular. Por exemplo, o _indexOf_ que retorna o índice do primeiro resultado encontrado ou `-1` se não encontra.

```js
console.log("  word".search(/\S/));
// → 2
console.log("    ".search(/\S/));
// → -1
```

Infelizmente, não existe um modo de indicar onde a busca deve começar, com um índice (como o segundo argumento de `indexOf`), o que seria muito útil.

## A propriedade _lastIndex_

{{index "exec method", "regular expression"}}

O método `exec` também não possui um modo conveniente de iniciar a busca a partir de uma determinada posição. Mas ele fornece um método não muito prático.

{{index ["regular expression", matching], matching, "source property", "lastIndex property"}}

Expressões regulares possuem propriedades (como `source` que contém a _string_ que originou a expressão). Uma dessas propriedades, `lastIndex`, controla, em algumas circunstâncias, onde a busca começará.

{{index [interface, design], "exec method", ["regular expression", global]}}

Essas circunstâncias são que a expressão regular precisa ter a opção "global" (g) ou sticky (y) habilitada no método `exec`. Novamente, deveria ser da mesma maneira que permitir um argumento extra para o método `exec`, mas coesão não é uma característica que define a sintaxe de expressões regulares em JavaScript.

```js
let pattern = /y/g;
pattern.lastIndex = 3;
let match = pattern.exec("xyzzy");
console.log(match.index);
// → 4
console.log(pattern.lastIndex);
// → 5
```

{{index "side effect", "lastIndex property"}}

Se a correspondência for bem-sucedida, a chamada para `exec` atualiza automaticamente a propriedade `lastIndex` para apontar após a correspondência. Se nenhuma correspondência for encontrada, `lastIndex` é zerado, o que também é o valor que possui um objeto de expressão regular recém-construído.

A diferença entre as opções _global_ e _sticky_ é que, quando _sticky_ está habilitado, a correspondência será bem-sucedida apenas se começar diretamente em _lastIndex_, enquanto que com _global_, ela procurará adiante por uma posição onde uma correspondência possa começar.

```js
let global = /abc/g;
console.log(global.exec("xyz abc"));
// → ["abc"]
let sticky = /abc/y;
console.log(sticky.exec("xyz abc"));
// → null
```

{{index bug}}

Ao usar um valor de expressão regular compartilhado para várias chamadas `exec`, essas atualizações automáticas da propriedade _lastIndex_ podem causar problemas. Sua expressão regular pode estar acidentalmente iniciando no índice que sobrou de uma chamada anterior.

```js
let digit = /\d/g;
console.log(digit.exec("here it is: 1"));
// → ["1"]
console.log(digit.exec("and now: 1"));
// → null
```

{{index ["regular expression", global], "match method"}}

Outro efeito interessante da opção _global_ é que ela muda a maneira como o método de correspondência funciona nas strings. Quando chamado com uma expressão global, em vez de retornar uma _array_ semelhante àquela retornada por `exec`, `match` encontrará todas as correspondências do padrão na _string_ e retornará uma _array_ contendo as strings correspondentes.

```js
console.log("Banana".match(/an/g));
// → ["an", "an"]
```

Então tenha cuidado com expressões regulares globais. Use-as nos casos em que são necessárias, como em `replace` ou em lugares onde você deseja usar explicitamente o _lastIndex_ que normalmente são os únicos lugares que você pode querer utilizá-las.

## Loop sobre correspondências

{{index "lastIndex property", "exec method", loop}}

Um padrão comum é buscar todas as ocorrências de um padrão em uma _string_, com acesso a todos os grupos encontrados e ao índice onde foram encontrados, usando _lastIndex_ e `exec`.

```js
let input = "A string with 3 numbers in it... 42 and 88.";
let number = /\b\d+\b/g;
let match;
while ((match = number.exec(input))) {
	console.log("Found", match[0], "at", match.index);
}
// → Found 3 at 14
//   Found 42 at 33
//   Found 88 at 40
```

{{index "while loop", ["= operator", "as expression"], [binding, "as state"]}}

Usa-se o fato que o valor de uma expressão de definição (`=`) é o valor assinalado. Então usando-se `match = re.exec(input)` como a condição no bloco `while`, podemos buscar no início de cada iteração.

{{id ini}}

## Analisando um arquivo .ini

{{index comment, "file format", "enemies example", "INI file"}}

Para concluir o capítulo, veremos agora um problema real que exige o uso de expressões regulares. Imagine que estamos escrevendo um programa que coleta informação automaticamente da internet dos nossos inimigos. (Não vamos escrever um programa aqui, apenas a parte que lê o arquivo de configuração, desculpe desapontá-los). Este arquivo tem a seguinte aparência:

```js
searchengine=https://duckduckgo.com/?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; each section concerns an individual enemy
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[davaeorn]
fullname=Davaeorn
type=evil wizard
outputdir=/home/marijn/enemies/davaeorn
```

{{index grammar}}

As regras exatas desse formato (que é um formato muito usado, chamado arquivo .ini) são as seguintes:

-   Linhas em branco e linhas iniciadas com ponto e vírgula são ignoradas;
-   Linhas entre colchetes `[]` iniciam uma nova seção;
-   Linhas contendo um identificador alfanumérico seguido por um caractere = adicionam uma configuração à seção atual;
-   Qualquer outra coisa é inválida.

Nossa tarefa é converter uma _string_ como essa em um _array_ de objetos, cada uma com um nome e um _array_ de pares nome/valor. Precisaremos de um objeto para cada seção e outro para as configurações de seção.

{{index "carriage return", "line break", "newline character"}}

Já que o formato precisa ser processado linha a linha, dividir em linhas separadas é um bom começo. Nos vimos o método `split` no capítulo 4. Entretanto alguns sistemas operacionais não usam apenas um caractere de nova linha para separar linhas, mas um caractere de retorno seguido por um de nova linha (`_\r\n_`). Desse modo o método `split` ,em uma expressão regular com `/\r?\n/` permite separar os dois modos, com `\n` e `\r\n` entre linhas.

```js
function parseINI(string) {
  // Start with an object to hold the top-level fields
  let result = {};
  let section = result;
  string.split(/\r?\n/).forEach(line => {
    let match;
    if (match = line.match(/^(\w+)=(.*)$/)) {
      section[match[1]] = match[2];
    } else if (match = line.match(/^\[(.*)\]$/)) {
      section = result[match[1]] = {};
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error("Line '" + line + "' is not valid.");
    }
  });
  return result;
}

console.log(parseINI(`
name=Vasilis
[address]
city=Tessaloniki`));
// → {name: "Vasilis", address: {city: "Tessaloniki"}}
}
```

{{index "parseINI function", parsing}}

O código percorre as linhas do arquivo e constrói um objeto. As propriedades na parte superior são armazenadas diretamente nesse objeto, enquanto as propriedades encontradas nas seções são armazenadas em um objeto de seção separado. A `section` de conexão aponta para o objeto da seção atual.

Existem dois tipos de linhas significativas - cabeçalhos de seção ou linhas de propriedade. Quando uma linha é uma propriedade regular, ela é armazenada na seção atual. Quando é um cabeçalho de seção, um novo objeto de seção é criado e a `section` é definida para apontar para ele.

{{index "caret character", "dollar sign", boundary}}

Observe o uso recorrente de `ˆ` e `$` para certificar-se que a expressão busca em toda a linha, não apenas em parte dela. Esquecer isso é um erro comum, que resulta um código que funciona mas retorna resultados estranhos para algumas entradas, o que pode ser um bug difícil de encontrar.

{{index "if keyword", assignment, ["= operator", "as expression"]}}

O padrão `if (match = string.match(...))` é parecido com o truque que foi usado como definição do `while` antes. Geralmente não temos certeza se a expressão encontrará algo. Mas você só deseja fazer algo com o resultado se ele não for nulo, então você precisa testar ele antes. Para não quebrar a agradável sequência de `else if` atribuímos o resultado da correspondência a uma conexão e imediatamente usamos essa atribuição como teste para a declaração de `if`.

{{index [parentheses, "in regular expressions"]}}

Se uma linha não for um cabeçalho de seção ou uma propriedade, a função verifica se é um comentário ou uma linha vazia usando a expressão `/^\s*(;.*)?$/`. Você vê como isso funciona? A parte entre os parênteses corresponderá aos comentários e o "?" se certificará de que também corresponda às linhas que contêm apenas espaços em branco. Quando uma linha não corresponde a nenhuma das form esperadas, a função resulta em uma exceção.

## Caracteres internacionais

{{index internationalization, Unicode, ["regular expression", internationalization]}}

Devido a uma implementação inicial simplista e o fato que esta abordagem simplista mais tarde foi gravada em pedra como comportamento padrão, expressões regulares do JavaScript são um pouco estúpidas sobre caracteres que não parecem na língua inglesa. Por exemplo, "caracteres palavra", nesse contexto, atualmente significam apenas os 26 caracteres do alfabeto latino. Coisas como `é` ou `β`, que definitivamente são caracteres de palavras, não encontrarão resultados com `\w` (e serão encontradas com o marcador de letras maiúsculas `\W`).

{{index [whitespace, matching]}}

Devido a um estranho acidente histórico, `\s` (espaço em branco) é diferente, e irá encontrar todos os caracteres que o padrão _Unicode_ considera como espaço em branco, como espaços sem quebra ou o separador de vogais do alfabeto Mongol.

Outro problema é que, por padrão, as expressões regulares funcionam em unidades de código, conforme discutido no Capítulo 5, e não em caracteres reais. Isso significa que os caracteres compostos por duas unidades de código se comportam de maneira estranha.

```js
console.log(/🍎{3}/.test("🍎🍎🍎"));
// → false
console.log(/<.>/.test("<🌹>"));
// → false
console.log(/<.>/u.test("<🌹>"));
// → true
```

O problema é que o emoji `🍎` na primeira linha é tratado como duas unidades de código e a `{3}` parte é aplicada apenas à segunda. Da mesma forma, o ponto corresponde a uma única unidade de código, não aos dois que compõem o emoji rosa `🌹`.

Você deve adicionar uma opção `u` (para o _Unicode_) à sua expressão regular que ele trate esses caracteres adequadamente. O comportamento incorreto permanece como padrão, infelizmente, porque alterá-lo pode causar problemas para o código existente que depende dele.

{{index "character category", [Unicode, property]}}

Embora isso tenha sido apenas padronizado e, no momento da escrita, não seja amplamente suportado ainda, é possível usar `\p` em uma expressão regular (que deve ter a opção _Unicode_ habilitada) para combinar todos os caracteres aos quais o padrão _Unicode_ atribui à determinada propriedade.

```js
console.log(/\p{Script=Greek}/u.test("α"));
// → true
console.log(/\p{Script=Arabic}/u.test("α"));
// → false
console.log(/\p{Alphabetic}/u.test("α"));
// → true
console.log(/\p{Alphabetic}/u.test("!"));
// → false
```

O _Unicode_ define várias propriedades úteis, embora encontrar aquela que você precisa nem sempre seja relevante. Você pode usar `\p{Property=Value}` para que corresponda a qualquer caractere que tenha o valor fornecido para essa propriedade. Se o nome da propriedade for deixado de fora, como em `\p{Name}`, o nome será considerado uma propriedade binária, como `Alphabetic` ou uma categoria, como `Number`.

{{id summary_regexp}}

## Sumário

Expressões regulares são objetos que representam padrões em _strings_. Eles usam sua própria sintaxe para expressar esses padrões.

{{table {cols: [1, 5]}}}

    /abc/	Sequência de caracteres
    /[abc]/	Qualquer caractere do conjunto
    /[^abc]/	Qualquer caractere que não seja do conjunto
    /[0-9]/	Qualquer caractere no intervalo de caracteres
    /x+/	Uma ou mais ocorrências do padrão
    /x+?/	Uma ou mais ocorrências do padrão, não obrigatório
    /x*/	Zero ou mais ocorrências
    /x?/	Zero ou uma ocorrência
    /x{2,4}/	Entre duas e quatro ocorrências
    /(abc)+/	Agrupamento
    /a|b|c/	Padrões alternativos
    /\d/	Caracteres dígitos
    /\w/	Caracteres alfanuméricos ("caracteres palavra")
    /\s/	caracteres espaço em branco
    /./	Todos caracteres exceto quebras de linha
    /\b/	Limite de palavra
    /^/	Início da entrada
    /$/	Final da Entrada

Uma expressão regular possui um método `test` para testar quando um padrão é encontrado em uma _string_, um método `exec` que quando encontra um resultado retorna um _array_ com todos os grupos encontrados e uma propriedade `index` que indica onde o resultado inicia.

_Strings_ possuem um método `match` para testá-las contra uma expressão regular e um método `search` para buscar por um resultado. O método `replace` pode substituir as correspondências de um padrão por uma string ou função de substituição.

Expressões regulares podem ter opções configuradas (_flags_), que são escritas após o fechamento da barra. A opção `i` faz a busca sem se importar se é maiúscula ou minúscula, a opção `g` faz a busca global, que, entre outras coisas, faz o método `replace` substituir todas as ocorrências, em vez de só a primeira. A opção `y` o torna aderente, o que significa que ele não pesquisará à frente e ignorará parte da _string_ ao procurar por uma correspondência. A opção `u` ativa o modo _Unicode_, que corrige uma série de problemas em torno do tratamento de caracteres que ocupam duas unidades de código.

Expressões regulares são uma ferramenta precisa que possui um manuseio estranho. Elas simplificarão muito algumas tarefas simples, mas rapidamente se tornarão inviáveis quando aplicadas a tarefas mais complexas. Saber quando usá-las é útil. Parte do conhecimento de saber **quando** usá-las é o conhecimento de saber **como** usá-las e quando desistir do seu uso e procurar uma abordagem mais simples.

## Exercícios

{{index debugging, bug}}

É quase inevitável que, no decorrer do trabalho, você irá ficar confuso e frustado por algum comportamento estranho de uma expressão regular. O que ajuda às vezes é colocar a sua expressão em uma ferramenta online como [debuggex.com](debuggex.com), para ver se a visualização corresponde à sua intenção inicial, e rapidamente ver como ela responde à várias _strings_ diferentes.

## Regexp golf

{{index "program size", "code golf", "regexp golf (exercise)"}}

"_Code Golf_" é um termo usado para o jogo de tentar escrever um programa com o menor número de caracteres possível. Parecido, o `regexp golf` é a prática de escrever pequenas expressões regulares para achar um determinado padrão, e apenas esse padrão.

{{index boundary, matching}}

Para cada um dos seguintes itens, escreva uma expressão regular que testa quando qualquer das _sub-strings_ dadas que ocorrem em um _string_. A expressão regular deverá achar apenas _strings_ contendo uma das _sub-strings_ dadas. Não se preocupe com limites de palavras a não ser que seja explicitamente pedido. Quando a sua expressão funcionar, veja se consegue fazê-la ficar menor.

    1. "car" e "cat"
    2."pop" e "prop"
    3."ferret", "ferry", e "ferrari"
    4.Qualquer palavra terminando em "ious"
    5.Um espaço em branco seguido por um ponto, vírgula, 6.dois-pontos, ou ponto-e-vírgula
    7.Uma palavra com mais de seis letras
    8.Uma palavra sem a letra "e" (ou E)

Consulte a tabela no capítulo _Sumário_ para ajuda.
Teste cada solução encontrada com alguns testes com _strings_.

{{if interactive

```js
// Fill in the regular expressions

verify(/.../, ["my car", "bad cats"], ["camper", "high art"]);

verify(/.../, ["pop culture", "mad props"], ["plop", "prrrop"]);

verify(/.../, ["ferret", "ferry", "ferrari"], ["ferrum", "transfer A"]);

verify(/.../, ["how delicious", "spacious room"], ["ruinous", "consciousness"]);

verify(/.../, ["bad punctuation ."], ["escape the period"]);

verify(
	/.../,
	["Siebentausenddreihundertzweiundzwanzig"],
	["no", "three small words"]
);

verify(
	/.../,
	["red platypus", "wobbling nest"],
	["earth bed", "learning ape", "BEET"]
);

function verify(regexp, yes, no) {
	// Ignore unfinished exercises
	if (regexp.source == "...") return;
	for (let str of yes)
		if (!regexp.test(str)) {
			console.log(`Failure to match '${str}'`);
		}
	for (let str of no)
		if (regexp.test(str)) {
			console.log(`Unexpected match for '${str}'`);
		}
}
```

if}}

## Estilo de aspas

{{index "quoting style (exercise)", "single-quote character", "double-quote character"}}

Imagine que você escreveu um texto e usou aspas simples por toda parte. Agora você deseja substituir todas que realmente possuem algum texto com aspas duplas, mas não as usadas em contrações de texto com _aren't_.

{{index "replace method"}}

Pense em um padrão que faça distinção entre esses dois usos de aspas e faça uma chamada que substitua apenas nos lugares apropriados.

{{if interactive

```js
let text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
console.log(text.replace(/A/g, "B"));
// → "I'm the cook," he said, "it's my job."
```

if}}

{{hint

{{index "quoting style (exercise)", boundary}}

**Dicas**

A solução mais óbvia é substituir apenas as aspas que não estão cercadas de caracteres de palavra. A primeira expressão vem à mente é `/\W'\W/`, Mas você também deve levar em consideração o início e o fim da linha.

{{index grouping, "replace method", [parentheses, "in regular expressions"]}}

Além disso, você deve garantir que a substituição também inclua os caracteres que foram correspondidos pelo padrão `\W` para que eles não sejam eliminados. Isso pode ser feito envolvendo-os entre parênteses e incluindo seus grupos substituindo pela _string_ ( `$1`, `$2`). Os grupos que não tiverem correspondência serão substituídos por nada.

hint}}

### Novamente números

{{index sign, "fractional number", [syntax, number], minus, "plus character", exponent, "scientific notation", "period character"}}

Escreva uma expressão que encontre (apenas) números no estilo JavaScript. Isso significa que precisa suportar um sinal de menor ou maior, opcional, na frente do número, um ponto decimal e a notação exponencial `—5e-3` ou `1E10—`, novamente com o sinal opcional na frente dele. . Observe também que não é necessário que haja dígitos antes ou depois do ponto, mas o número não pode ser apenas um ponto. Assim, `.5` e `5.` são números JavaScript válidos, mas apenas o ponto não é.

{{if interactive

```js
// Preencha esta expressão regular
let number = /^...$/;

// Tests:
for (let str of [
	"1",
	"-1",
	"+15",
	"1.55",
	".5",
	"5.",
	"1.3e2",
	"1E-4",
	"1e+12",
]) {
	if (!number.test(str)) {
		console.log(`Failed to match '${str}'`);
	}
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5", "."]) {
	if (number.test(str)) {
		console.log(`Incorrectly accepted '${str}'`);
	}
}
```

if}}

{{hint

{{index ["regular expression", escaping], ["backslash character", "in regular expressions"]}}

Primeiro, não esqueça da barra invertida em frente ao ponto.

Achar o sinal opcional na frente do número, como na frente do exponencial, pode ser feito com `[+\-]?` ou `(+|-|)` (mais, menos ou nada).

{{index "pipe character"}}

A parte mais complicada deste exercício provavelmente é a dificuldade de achar `5.` e `.5` sem achar também o `.`. Para isso, achamos que a melhor solução é usar o operador `|` para separar os dois casos, um ou mais dígitos opcionalmente seguidos por um ponto e zero ou mais dígitos, ou um ponto seguido por um ou mais dígitos.

{{index exponent, "case sensitivity", ["regular expression", flags]}}

Finalmente, fazer o "e" _case-insensitive_, ou adicional a opção `i` à expressão regular ou usar `[eE]`.

hint}}
