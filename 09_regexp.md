# Expressões Regulares

{{quote {author: "Jamie Zawinski", chapter: true}

Algumas pessoas, quando confrontadas com um problema, pensam 'Eu sei, vou usar expressões regulares.' Agora elas têm dois problemas.

quote}}

{{index "Zawinski, Jamie"}}

{{if interactive

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

Quando você corta contra o veio da madeira, muita força é necessária. Quando você programa contra o veio do problema, muito código é necessário.

quote}}

if}}

{{figure {url: "img/chapter_picture_9.jpg", alt: "Illustration of a railroad system representing the syntactic structure of regular expressions", chapter: "square-framed"}}}

{{index evolution, adoption, integration}}

((Ferramenta))s e técnicas de programação sobrevivem e se espalham de maneira caótica e evolutiva. Nem sempre são as melhores ou mais brilhantes que vencem, mas sim aquelas que funcionam bem o suficiente dentro do nicho certo ou que acontecem de estar integradas com outra tecnologia bem-sucedida.

{{index "domain-specific language"}}

Neste capítulo, discutirei uma dessas ferramentas, _((expressões regulares))_. Expressões regulares são uma maneira de descrever ((padrão))es em dados de *string*. Elas formam uma linguagem pequena e separada que faz parte do JavaScript e de muitas outras linguagens e sistemas.

{{index [interface, design]}}

Expressões regulares são ao mesmo tempo terrivelmente estranhas e extremamente úteis. Sua sintaxe é críptica e a interface de programação que o JavaScript fornece para elas é desajeitada. Mas são uma ((ferramenta)) poderosa para inspecionar e processar *strings*. Entender adequadamente expressões regulares fará de você um programador mais eficiente.

## Criando uma expressão regular

{{index ["regular expression", creation], "RegExp class", "literal expression", "slash character"}}

Uma expressão regular é um tipo de objeto. Ela pode ser construída com o construtor `RegExp` ou escrita como um valor literal envolvendo um padrão em caracteres de barra (`/`).

```
let re1 = new RegExp("abc");
let re2 = /abc/;
```

Ambos os objetos de expressão regular representam o mesmo ((padrão)): um caractere _a_ seguido de um _b_ seguido de um _c_.

{{index ["backslash character", "in regular expressions"], "RegExp class"}}

Ao usar o construtor `RegExp`, o padrão é escrito como uma *string* normal, então as regras usuais se aplicam para barras invertidas.

{{index ["regular expression", escaping], [escaping, "in regexps"], "slash character"}}

A segunda notação, onde o padrão aparece entre caracteres de barra, trata barras invertidas de forma um pouco diferente. Primeiro, como uma barra encerra o padrão, precisamos colocar uma barra invertida antes de qualquer barra que queiramos que seja _parte_ do padrão. Além disso, barras invertidas que não fazem parte de códigos de caracteres especiais (como `\n`) serão _preservadas_, em vez de ignoradas como são em *strings*, e mudam o significado do padrão. Alguns caracteres, como interrogações e sinais de mais, têm significados especiais em expressões regulares e devem ser precedidos por uma barra invertida se pretendem representar o próprio caractere.

```
let aPlus = /A\+/;
```

## Testando correspondências

{{index matching, "test method", ["regular expression", methods]}}

Objetos de expressão regular possuem vários métodos. O mais simples é `test`. Se você passar uma *string*, ele retornará um ((booleano)) dizendo se a *string* contém uma correspondência do padrão na expressão.

```
console.log(/abc/.test("abcde"));
// → true
console.log(/abc/.test("abxde"));
// → false
```

{{index pattern}}

Uma ((expressão regular)) consistindo apenas de caracteres não-especiais simplesmente representa aquela sequência de caracteres. Se _abc_ ocorre em qualquer lugar na *string* contra a qual estamos testando (não apenas no início), `test` retornará `true`.

## Conjuntos de caracteres

{{index "regular expression", "indexOf method"}}

Descobrir se uma *string* contém _abc_ poderia ser feito igualmente com uma chamada a `indexOf`. Expressões regulares são úteis porque nos permitem descrever ((padrão))es mais complicados.

Digamos que queremos encontrar qualquer ((número)). Em uma expressão regular, colocar um ((conjunto)) de caracteres entre colchetes faz com que aquela parte da expressão corresponda a qualquer um dos caracteres entre os colchetes.

Ambas as expressões a seguir correspondem a todas as *strings* que contêm um ((dígito)):

```
console.log(/[0123456789]/.test("in 1992"));
// → true
console.log(/[0-9]/.test("in 1992"));
// → true
```

{{index "hyphen character"}}

Dentro de colchetes, um hífen (`-`) entre dois caracteres pode ser usado para indicar um ((intervalo)) de caracteres, onde a ordenação é determinada pelo número ((Unicode)) do caractere. Os caracteres 0 a 9 ficam um ao lado do outro nessa ordenação (códigos 48 a 57), então `[0-9]` cobre todos eles e corresponde a qualquer ((dígito)).

{{index [whitespace, matching], "alphanumeric character", "period character"}}

Vários grupos comuns de caracteres têm seus próprios atalhos embutidos. Dígitos são um deles: `\d` significa a mesma coisa que `[0-9]`.

{{index "newline character", [whitespace, matching]}}

{{table {cols: [1, 5]}}}

| `\d`    | Qualquer caractere de ((dígito))
| `\w`    | Um caractere alfanumérico ("((caractere de palavra))")
| `\s`    | Qualquer caractere de espaço em branco (espaço, tab, nova linha e similares)
| `\D`    | Um caractere que _não_ é um dígito
| `\W`    | Um caractere não-alfanumérico
| `\S`    | Um caractere que não é espaço em branco
| `.`     | Qualquer caractere exceto nova linha

Você poderia corresponder a um formato de ((data)) e ((hora)) como 01-30-2003 15:20 com a seguinte expressão:

```
let dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/;
console.log(dateTime.test("01-30-2003 15:20"));
// → true
console.log(dateTime.test("30-jan-2003 15:20"));
// → false
```

{{index ["backslash character", "in regular expressions"]}}

Essa expressão regular parece completamente horrível, não é? Metade dela são barras invertidas, produzindo um ruído de fundo que dificulta identificar o ((padrão)) real expresso. Veremos uma versão um pouco melhorada dessa expressão [mais adiante](regexp#date_regexp_counted).

{{index [escaping, "in regexps"], "regular expression", set}}

Esses códigos de barra invertida também podem ser usados dentro de ((colchetes)). Por exemplo, `[\d.]` significa qualquer dígito ou um caractere de ponto. O ponto em si, entre colchetes, perde seu significado especial. O mesmo vale para outros caracteres especiais, como o sinal de mais (`+`).

{{index "square brackets", inversion, "caret character"}}

Para _inverter_ um conjunto de caracteres — isto é, expressar que você quer corresponder a qualquer caractere _exceto_ os do conjunto — você pode escrever um caractere circunflexo (`^`) após o colchete de abertura.

```
let nonBinary = /[^01]/;
console.log(nonBinary.test("1100100010100110"));
// → false
console.log(nonBinary.test("0111010112101001"));
// → true
```

## Caracteres internacionais

{{index internationalization, Unicode, ["regular expression", internationalization]}}

Devido à implementação inicial simplista do JavaScript e ao fato de que essa abordagem simplista foi mais tarde consolidada como comportamento ((padrão)), as expressões regulares do JavaScript são bastante limitadas em relação a caracteres que não aparecem na língua inglesa. Por exemplo, no que diz respeito às expressões regulares do JavaScript, um "((caractere de palavra))" é apenas um dos 26 caracteres do alfabeto latino (maiúsculo ou minúsculo), dígitos decimais e, por algum motivo, o caractere sublinhado. Coisas como _é_ ou _β_, que são definitivamente caracteres de palavra, não correspondem a `\w` (e _correspondem_ a `\W` maiúsculo, a categoria de não-palavra).

{{index [whitespace, matching]}}

Por um estranho acidente histórico, `\s` (espaço em branco) não tem esse problema e corresponde a todos os caracteres que o padrão Unicode considera espaço em branco, incluindo coisas como o ((espaço não-quebrável)) e o ((separador de vogais mongol)).

{{index "character category", [Unicode, property]}}

É possível usar `\p` em uma expressão regular para corresponder a todos os caracteres aos quais o padrão Unicode atribui uma dada propriedade. Isso nos permite corresponder a coisas como letras de uma maneira mais cosmopolita. Porém, novamente devido à compatibilidade com os padrões originais da linguagem, estes são reconhecidos apenas quando se coloca um caractere `u` (de ((Unicode))) após a expressão regular.

{{table {cols: [1, 5]}}}

| `\p{L}`             | Qualquer letra
| `\p{N}`             | Qualquer caractere numérico
| `\p{P}`             | Qualquer caractere de pontuação
| `\P{L}`             | Qualquer não-letra (P maiúsculo inverte)
| `\p{Script=Hangul}` | Qualquer caractere do script dado (veja [Capítulo ?](higher_order#scripts))

Usar `\w` para processamento de texto que pode precisar lidar com texto não-inglês (ou até texto inglês com palavras emprestadas como "cliché") é um risco, pois não tratará caracteres como "é" como letras. Embora tendam a ser um pouco mais verbosos, os grupos de propriedades `\p` são mais robustos.

```{test: never}
console.log(/\p{L}/u.test("α"));
// → true
console.log(/\p{L}/u.test("!"));
// → false
console.log(/\p{Script=Greek}/u.test("α"));
// → true
console.log(/\p{Script=Arabic}/u.test("α"));
// → false
```

{{index "Number function"}}

Por outro lado, se você está correspondendo números para fazer algo com eles, frequentemente quer `\d` para dígitos, pois converter caracteres numéricos arbitrários em um número JavaScript não é algo que uma função como `Number` pode fazer por você.

## Repetindo partes de um padrão

{{index ["regular expression", repetition]}}

Agora sabemos como corresponder a um único dígito. E se quisermos corresponder a um número inteiro — uma ((sequência)) de um ou mais ((dígito))s?

{{index "plus character", repetition, "+ operator"}}

Quando você coloca um sinal de mais (`+`) após algo em uma expressão regular, isso indica que o elemento pode se repetir mais de uma vez. Assim, `/\d+/` corresponde a um ou mais caracteres de dígito.

```
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

O asterisco (`*`) tem um significado semelhante, mas também permite que o padrão corresponda zero vezes. Algo com um asterisco depois nunca impede que um padrão corresponda — ele simplesmente corresponderá zero instâncias se não encontrar nenhum texto adequado.

{{index "British English", "American English", "question mark"}}

Uma interrogação (`?`) torna uma parte de um padrão _((opcional))_, significando que pode ocorrer zero vezes ou uma vez. No exemplo a seguir, o caractere _u_ é permitido mas o padrão também corresponde quando ele está ausente:

```
let neighbor = /neighbou?r/;
console.log(neighbor.test("neighbour"));
// → true
console.log(neighbor.test("neighbor"));
// → true
```

{{index repetition, [braces, "in regular expression"]}}

Para indicar que um padrão deve ocorrer um número preciso de vezes, use chaves. Colocar `{4}` após um elemento, por exemplo, exige que ocorra exatamente quatro vezes. Também é possível especificar um ((intervalo)) dessa forma: `{2,4}` significa que o elemento deve ocorrer pelo menos duas vezes e no máximo quatro vezes.

{{id date_regexp_counted}}

Aqui está outra versão do padrão de ((data)) e ((hora)) que permite tanto ((dígito))s simples quanto duplos para dias, meses e horas. Também é um pouco mais fácil de decifrar.

```
let dateTime = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime.test("1-30-2003 8:45"));
// → true
```

Você também pode especificar ((intervalo))s abertos ao usar chaves, omitindo o número após a vírgula. Por exemplo, `{5,}` significa cinco ou mais vezes.

## Agrupando subexpressões

{{index ["regular expression", grouping], grouping, [parentheses, "in regular expressions"]}}

Para usar um operador como `*` ou `+` em mais de um elemento por vez, você deve usar parênteses. Uma parte de uma expressão regular entre parênteses conta como um único elemento para os operadores que a seguem.

```
let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohoooohoohooo"));
// → true
```

{{index crying}}

O primeiro e o segundo `+` se aplicam apenas ao segundo `o` em `boo` e `hoo`, respectivamente. O terceiro `+` se aplica a todo o grupo `(hoo+)`, correspondendo a uma ou mais sequências assim.

{{index "case sensitivity", capitalization, ["regular expression", flags]}}

O `i` no final da expressão no exemplo torna essa expressão regular insensível a maiúsculas e minúsculas, permitindo que corresponda ao _B_ maiúsculo na *string* de entrada, mesmo que o padrão em si seja todo minúsculo.

## Correspondências e grupos

{{index ["regular expression", grouping], "exec method", [array, "RegExp match"]}}

O método `test` é a maneira absolutamente mais simples de corresponder uma expressão regular. Ele diz apenas se correspondeu e nada mais. Expressões regulares também possuem um método `exec` (executar) que retornará `null` se nenhuma correspondência foi encontrada e retornará um objeto com informações sobre a correspondência caso contrário.

```
let match = /\d+/.exec("one two 100");
console.log(match);
// → ["100"]
console.log(match.index);
// → 8
```

{{index "index property", [string, indexing]}}

Um objeto retornado de `exec` tem uma propriedade `index` que nos diz _onde_ na *string* a correspondência bem-sucedida começa. Fora isso, o objeto parece (e de fato é) um *array* de *strings*, cujo primeiro elemento é a *string* que foi correspondida. No exemplo anterior, esta é a sequência de ((dígito))s que procurávamos.

{{index [string, methods], "match method"}}

Valores de *string* têm um método `match` que se comporta de forma semelhante.

```
console.log("one two 100".match(/\d+/));
// → ["100"]
```

{{index grouping, "capture group", "exec method"}}

Quando a expressão regular contém subexpressões agrupadas com parênteses, o texto que correspondeu a esses grupos também aparecerá no *array*. A correspondência inteira é sempre o primeiro elemento. O próximo elemento é a parte correspondida pelo primeiro grupo (aquele cujo parêntese de abertura vem primeiro na expressão), depois o segundo grupo, e assim por diante.

```
let quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));
// → ["'hello'", "hello"]
```

{{index "capture group"}}

Quando um grupo não é correspondido de forma alguma (por exemplo, quando seguido por uma interrogação), sua posição no *array* de saída conterá `undefined`. Quando um grupo é correspondido múltiplas vezes (por exemplo, quando seguido por um `+`), apenas a última correspondência acaba no *array*.

```
console.log(/bad(ly)?/.exec("bad"));
// → ["bad", undefined]
console.log(/(\d)+/.exec("123"));
// → ["123", "3"]
```

Se você quiser usar parênteses puramente para agrupamento, sem que apareçam no *array* de correspondências, pode colocar `?:` após o parêntese de abertura.

```
console.log(/(?:na)+/.exec("banana"));
// → ["nana"]
```

{{index "exec method", ["regular expression", methods], extraction}}

Grupos podem ser úteis para extrair partes de uma *string*. Se não queremos apenas verificar se uma *string* contém uma ((data)), mas também extraí-la e construir um objeto que a represente, podemos envolver parênteses ao redor dos padrões de dígitos e extrair diretamente a data do resultado de `exec`.

Mas primeiro faremos um breve desvio para discutir a maneira embutida de representar valores de data e ((hora)) em JavaScript.

## A classe Date

{{index constructor, "Date class"}}

O JavaScript tem uma classe `Date` padrão para representar ((data))s, ou melhor, pontos no ((tempo)). Se você simplesmente criar um objeto date usando `new`, obtém a data e hora atuais.

```{test: no}
console.log(new Date());
// → Fri Feb 02 2024 18:03:06 GMT+0100 (CET)
```

{{index "Date class"}}

Você também pode criar um objeto para um momento específico.

```
console.log(new Date(2009, 11, 9));
// → Wed Dec 09 2009 00:00:00 GMT+0100 (CET)
console.log(new Date(2009, 11, 9, 12, 59, 59, 999));
// → Wed Dec 09 2009 12:59:59 GMT+0100 (CET)
```

{{index "zero-based counting", [interface, design]}}

O JavaScript usa uma convenção onde os números dos meses começam em zero (então dezembro é 11), mas os números dos dias começam em um. Isso é confuso e ridículo. Tome cuidado.

Os últimos quatro argumentos (horas, minutos, segundos e milissegundos) são opcionais e considerados zero quando não fornecidos.

{{index "getTime method", timestamp}}

*Timestamps* são armazenados como o número de milissegundos desde o início de 1970, no fuso horário UTC. Isso segue uma convenção estabelecida pelo "((tempo Unix))", que foi inventado por volta daquela época. Você pode usar números negativos para tempos antes de 1970. O método `getTime` em um objeto date retorna esse número. É grande, como você pode imaginar.

```
console.log(new Date(2013, 11, 19).getTime());
// → 1387407600000
console.log(new Date(1387407600000));
// → Thu Dec 19 2013 00:00:00 GMT+0100 (CET)
```

{{index "Date.now function", "Date class"}}

Se você der ao construtor `Date` um único argumento, esse argumento é tratado como tal contagem de milissegundos. Você pode obter a contagem de milissegundos atual criando um novo objeto `Date` e chamando `getTime` nele ou chamando a função `Date.now`.

{{index "getFullYear method", "getMonth method", "getDate method", "getHours method", "getMinutes method", "getSeconds method", "getYear method"}}

Objetos Date fornecem métodos como `getFullYear`, `getMonth`, `getDate`, `getHours`, `getMinutes` e `getSeconds` para extrair seus componentes. Além de `getFullYear` há também `getYear`, que dá o ano menos 1900 (como `98` ou `125`) e é em grande parte inútil.

{{index "capture group", "getDate method", [parentheses, "in regular expressions"]}}

Colocando parênteses ao redor das partes da expressão que nos interessam, podemos agora criar um objeto date a partir de uma *string*.

```
function getDate(string) {
  let [_, month, day, year] =
    /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
  return new Date(year, month - 1, day);
}
console.log(getDate("1-30-2003"));
// → Thu Jan 30 2003 00:00:00 GMT+0100 (CET)
```

{{index destructuring, "underscore character"}}

A *binding* sublinhado (`_`) é ignorada e usada apenas para pular o elemento de correspondência completa no *array* retornado por `exec`.

## Limites e look-ahead

{{index matching, ["regular expression", boundary]}}

Infelizmente, `getDate` também extrairá uma data da *string* `"100-1-30000"`. Uma correspondência pode acontecer em qualquer lugar na *string*, então neste caso, ela simplesmente começará no segundo caractere e terminará no penúltimo.

{{index boundary, "caret character", "dollar sign"}}

Se quisermos forçar que a correspondência abranja toda a *string*, podemos adicionar os marcadores `^` e `$`. O circunflexo corresponde ao início da *string* de entrada, enquanto o cifrão corresponde ao final. Assim, `/^\d+$/` corresponde a uma *string* consistindo inteiramente de um ou mais dígitos, `/^!/` corresponde a qualquer *string* que comece com ponto de exclamação, e `/x^/` não corresponde a nenhuma *string* (não pode haver um `x` antes do início da *string*).

{{index "word boundary", "word character"}}

Há também um marcador `\b` que corresponde a _limites de palavra_, posições que têm um caractere de palavra de um lado e um caractere não-palavra do outro. Infelizmente, estes usam o mesmo conceito simplista de caracteres de palavra que `\w` e, portanto, não são muito confiáveis.

Note que esses marcadores de limite não correspondem a nenhum caractere real. Eles apenas impõem que uma dada condição se mantenha no lugar onde aparecem no padrão.

{{index "look-ahead"}}

Testes de _look-ahead_ fazem algo semelhante. Eles fornecem um padrão e farão a correspondência falhar se a entrada não corresponder àquele padrão, mas não avançam a posição de correspondência. São escritos entre `(?=` e `)`.

```
console.log(/a(?=e)/.exec("braeburn"));
// → ["a"]
console.log(/a(?! )/.exec("a b"));
// → null
```

O `e` no primeiro exemplo é necessário para corresponder, mas não faz parte da *string* correspondida. A notação `(?! )` expressa um look-ahead _negativo_. Isso corresponde apenas se o padrão entre parênteses _não_ corresponder, fazendo com que o segundo exemplo corresponda apenas a caracteres `a` que não tenham um espaço depois deles.

## Padrões de escolha

{{index branching, ["regular expression", alternatives], "farm example"}}

Digamos que queremos saber se um trecho de texto contém não apenas um número, mas um número seguido de uma das palavras _pig_, _cow_ ou _chicken_, ou qualquer uma de suas formas plurais.

Poderíamos escrever três expressões regulares e testá-las em sequência, mas há uma maneira mais elegante. O caractere ((pipe)) (`|`) denota uma ((escolha)) entre o padrão à sua esquerda e o padrão à sua direita. Podemos usá-lo em expressões como esta:

```
let animalCount = /\d+ (pig|cow|chicken)s?/;
console.log(animalCount.test("15 pigs"));
// → true
console.log(animalCount.test("15 pugs"));
// → false
```

{{index [parentheses, "in regular expressions"]}}

Parênteses podem ser usados para limitar a parte do padrão à qual o operador pipe se aplica, e você pode colocar múltiplos desses operadores lado a lado para expressar uma escolha entre mais de duas alternativas.

## A mecânica da correspondência

{{index ["regular expression", matching], [matching, algorithm], "search problem"}}

Conceitualmente, quando você usa `exec` ou `test`, o motor de expressão regular procura uma correspondência na sua *string* tentando corresponder a expressão primeiro a partir do início da *string*, depois a partir do segundo caractere, e assim por diante até encontrar uma correspondência ou alcançar o final da *string*. Ele retornará a primeira correspondência encontrada ou falhará em encontrar qualquer correspondência.

{{index ["regular expression", matching], [matching, algorithm]}}

Para fazer a correspondência real, o motor trata uma expressão regular como um ((diagrama de fluxo)). Este é o diagrama para a expressão de animais do exemplo anterior:

{{figure {url: "img/re_pigchickens.svg", alt: "Railroad diagram that first passes through a box labeled 'digit', which has a loop going back from after it to before it, and then a box for a space character. After that, the railroad splits in three, going through boxes for 'pig', 'cow', and 'chicken'. After those it rejoins, and goes through a box labeled 's', which, being optional, also has a railroad that passes it by. Finally, the line reaches the accepting state."}}}

{{index traversal}}

Se conseguirmos encontrar um caminho do lado esquerdo do diagrama ao lado direito, nossa expressão corresponde. Mantemos uma posição atual na *string* e, toda vez que passamos por uma caixa, verificamos que a parte da *string* após nossa posição atual corresponde àquela caixa.

{{id backtracking}}

## Retrocesso

{{index ["regular expression", backtracking], "binary number", "decimal number", "hexadecimal number", "flow diagram", [matching, algorithm], backtracking}}

A expressão regular `/^([01]+b|[\da-f]+h|\d+)$/` corresponde a um número binário seguido de um `b`, um número hexadecimal (isto é, base 16, com as letras `a` a `f` representando os dígitos 10 a 15) seguido de um `h`, ou um número decimal regular sem caractere de sufixo. Este é o diagrama correspondente:

{{figure {url: "img/re_number.svg", alt: "Railroad diagram for the regular expression '^([01]+b|\\d+|[\\da-f]+h)$'"}}}

{{index branching}}

Ao corresponder essa expressão, o ramo superior (binário) frequentemente será tentado mesmo que a entrada não contenha um número binário. Ao corresponder a *string* `"103"`, por exemplo, fica claro apenas no `3` que estamos no ramo errado. A *string* _corresponde_ à expressão, apenas não ao ramo em que estamos atualmente.

{{index backtracking, "search problem"}}

Então o motor _retrocede_. Ao entrar em um ramo, ele lembra sua posição atual (neste caso, no início da *string*, logo após a primeira caixa de limite no diagrama) para que possa voltar e tentar outro ramo se o atual não funcionar. Para a *string* `"103"`, após encontrar o caractere `3`, o motor começa a tentar o ramo para números hexadecimais, que falha novamente porque não há um `h` após o número. Então tenta o ramo de números decimais. Esse se encaixa, e uma correspondência é reportada.

{{index [matching, algorithm]}}

O motor para assim que encontra uma correspondência completa. Isso significa que, se múltiplos ramos poderiam potencialmente corresponder a uma *string*, apenas o primeiro (ordenado por onde os ramos aparecem na expressão regular) é usado.

O retrocesso também acontece para operadores de ((repetição)) como + e `*`. Se você corresponder `/^.*x/` contra `"abcxe"`, a parte `.*` primeiro tentará consumir toda a *string*. O motor então perceberá que precisa de um `x` para corresponder ao padrão. Como não há `x` após o final da *string*, o operador asterisco tenta corresponder um caractere a menos. Mas o motor não encontra um `x` após `abcx` também, então retrocede novamente, correspondendo o operador asterisco apenas a `abc`. _Agora_ ele encontra um `x` onde precisa e reporta uma correspondência bem-sucedida das posições 0 a 4.

{{index performance, complexity}}

É possível escrever expressões regulares que farão _muito_ retrocesso. Esse problema ocorre quando um padrão pode corresponder a um trecho de entrada de muitas maneiras diferentes. Por exemplo, se ficarmos confusos ao escrever uma expressão regular de número binário, podemos acidentalmente escrever algo como `/([01]+)+b/`.

{{figure {url: "img/re_slow.svg", alt: "Railroad diagram for the regular expression '([01]+)+b'",width: "6cm"}}}

{{index "inner loop", [nesting, "in regexps"]}}

Se isso tentar corresponder a uma longa série de zeros e uns sem um caractere _b_ no final, o motor primeiro percorre o *loop* interno até ficar sem dígitos. Então percebe que não há `b`, então retrocede uma posição, percorre o *loop* externo uma vez e desiste novamente, tentando retroceder do *loop* interno mais uma vez. Ele continuará tentando toda rota possível através desses dois *loops*. Isso significa que a quantidade de trabalho _dobra_ com cada caractere adicional. Para apenas algumas dezenas de caracteres, a correspondência resultante levará praticamente uma eternidade.

## O método replace

{{index "replace method", "regular expression"}}

Valores de *string* possuem um método `replace` que pode ser usado para substituir parte da *string* por outra *string*.

```
console.log("papa".replace("p", "m"));
// → mapa
```

{{index ["regular expression", flags], ["regular expression", global]}}

O primeiro argumento também pode ser uma expressão regular, caso em que a primeira correspondência da expressão regular é substituída. Quando uma opção `g` (de _global_) é adicionada após a expressão regular, _todas_ as correspondências na *string* serão substituídas, não apenas a primeira.

```
console.log("Borobudur".replace(/[ou]/, "a"));
// → Barobudur
console.log("Borobudur".replace(/[ou]/g, "a"));
// → Barabadar
```

{{index grouping, "capture group", "dollar sign", "replace method", ["regular expression", grouping]}}

O verdadeiro poder de usar expressões regulares com `replace` vem do fato de que podemos nos referir a grupos correspondidos na *string* de substituição. Por exemplo, digamos que temos uma *string* grande contendo nomes de pessoas, um nome por linha, no formato `Sobrenome, Nome`. Se quisermos trocar esses nomes e remover a vírgula para obter o formato `Nome Sobrenome`, podemos usar o seguinte código:

```
console.log(
  "Liskov, Barbara\nMcCarthy, John\nMilner, Robin"
    .replace(/(\p{L}+), (\p{L}+)/gu, "$2 $1"));
// → Barbara Liskov
//   John McCarthy
//   Robin Milner
```

O `$1` e `$2` na *string* de substituição se referem aos grupos entre parênteses no padrão. `$1` é substituído pelo texto que correspondeu ao primeiro grupo, `$2` pelo segundo, e assim por diante, até `$9`. A correspondência inteira pode ser referenciada com `$&`.

{{index [function, "higher-order"], grouping, "capture group"}}

É possível passar uma função — em vez de uma *string* — como segundo argumento de `replace`. Para cada substituição, a função será chamada com os grupos correspondidos (assim como a correspondência inteira) como argumentos, e seu valor de retorno será inserido na nova *string*.

Aqui está um exemplo:

```
let stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
  amount = Number(amount) - 1;
  if (amount == 1) { // só restou um, remover o 's'
    unit = unit.slice(0, unit.length - 1);
  } else if (amount == 0) {
    amount = "no";
  }
  return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\p{L}+)/gu, minusOne));
// → no lemon, 1 cabbage, and 100 eggs
```

Este código pega uma *string*, encontra todas as ocorrências de um número seguido de uma palavra alfanumérica e retorna uma *string* que tem uma unidade a menos de cada quantidade.

O grupo `(\d+)` acaba como o argumento `amount` da função, e o grupo `(\p{L}+)` é vinculado a `unit`. A função converte `amount` para um número — o que sempre funciona, pois correspondeu a `\d+` anteriormente — e faz alguns ajustes caso reste apenas um ou zero.

## Ganância

{{index greed, "regular expression"}}

Podemos usar `replace` para escrever uma função que remove todos os ((comentário))s de um trecho de ((código)) JavaScript. Aqui está uma primeira tentativa:

```{test: wrap}
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

A parte antes do operador `|` corresponde a duas barras seguidas de qualquer número de caracteres que não sejam nova linha. A parte para comentários de múltiplas linhas é mais complexa. Usamos `[^]` (qualquer caractere que não esteja no conjunto vazio de caracteres) como uma maneira de corresponder a qualquer caractere. Não podemos simplesmente usar um ponto aqui porque comentários de bloco podem continuar em uma nova linha, e o caractere ponto não corresponde a caracteres de nova linha.

Mas a saída da última linha parece ter dado errado. Por quê?

{{index backtracking, greed, "regular expression"}}

A parte `[^]*` da expressão, como descrevi na seção sobre retrocesso, primeiro tentará corresponder o máximo possível. Se isso fizer a próxima parte do padrão falhar, o motor volta um caractere e tenta novamente de lá. No exemplo, o motor primeiro tenta corresponder todo o restante da *string* e então volta de lá. Ele encontrará uma ocorrência de `*/` após voltar quatro caracteres e corresponder a isso. Não é isso que queríamos — a intenção era corresponder a um único comentário, não ir até o final do código e encontrar o final do último comentário de bloco.

Por causa desse comportamento, dizemos que os operadores de repetição (`+`, `*`, `?` e `{}`) são _((gananciosos))_, significando que correspondem o máximo possível e retrocedem a partir daí. Se você colocar uma ((interrogação)) após eles (`+?`, `*?`, `??`, `{}?`), eles se tornam não-gananciosos e começam correspondendo o mínimo possível, correspondendo mais apenas quando o padrão restante não se encaixa na correspondência menor.

E é exatamente isso que queremos neste caso. Fazendo o asterisco corresponder o menor trecho de caracteres que nos leve a um `*/`, consumimos um comentário de bloco e nada mais.

```{test: wrap}
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1 + 1
```

Muitos ((bug))s em programas de ((expressão regular)) podem ser rastreados ao uso não intencional de um operador ganancioso onde um não-ganancioso funcionaria melhor. Ao usar um operador de ((repetição)), prefira a variante não-gananciosa.

## Criando objetos RegExp dinamicamente

{{index ["regular expression", creation], "underscore character", "RegExp class"}}

Em alguns casos, você pode não saber o ((padrão)) exato que precisa corresponder quando está escrevendo seu código. Digamos que quer testar o nome do usuário em um trecho de texto. Você pode montar uma *string* e usar o ((construtor)) `RegExp` nela.

```
let name = "harry";
let regexp = new RegExp("(^|\\s)" + name + "($|\\s)", "gi");
console.log(regexp.test("Harry is a dodgy character."));
// → true
```

{{index ["regular expression", flags], ["backslash character", "in regular expressions"]}}

Ao criar a parte `\s` da *string*, precisamos usar duas barras invertidas porque estamos escrevendo em uma *string* normal, não em uma expressão regular delimitada por barras. O segundo argumento do construtor `RegExp` contém as opções para a expressão regular — neste caso, `"gi"` para global e insensível a maiúsculas.

Mas e se o nome for `"dea+hl[]rd"` porque nosso usuário é um adolescente ((nerd))? Isso resultaria em uma expressão regular sem sentido que não corresponderá ao nome do usuário.

{{index ["backslash character", "in regular expressions"], [escaping, "in regexps"], ["regular expression", escaping]}}

Para contornar isso, podemos adicionar barras invertidas antes de qualquer caractere que tenha significado especial.

```
let name = "dea+hl[]rd";
let escaped = name.replace(/[\\[.+*?(){|^$]/g, "\\$&");
let regexp = new RegExp("(^|\\s)" + escaped + "($|\\s)",
                        "gi");
let text = "This dea+hl[]rd guy is super annoying.";
console.log(regexp.test(text));
// → true
```

## O método search

{{index ["regular expression", methods], "indexOf method", "search method"}}

Embora o método `indexOf` em *strings* não possa ser chamado com uma expressão regular, existe outro método, `search`, que espera uma expressão regular. Como `indexOf`, ele retorna o primeiro índice no qual a expressão foi encontrada, ou -1 quando não foi encontrada.

```
console.log("  word".search(/\S/));
// → 2
console.log("    ".search(/\S/));
// → -1
```

Infelizmente, não há como indicar que a correspondência deve começar em um dado deslocamento (como podemos com o segundo argumento de `indexOf`), o que seria frequentemente útil.

## A propriedade lastIndex

{{index "exec method", "regular expression"}}

O método `exec` similarmente não fornece uma maneira conveniente de começar a busca a partir de uma dada posição na *string*. Mas fornece uma maneira *in*conveniente.

{{index ["regular expression", matching], matching, "source property", "lastIndex property"}}

Objetos de expressão regular possuem propriedades. Uma dessas propriedades é `source`, que contém a *string* a partir da qual a expressão foi criada. Outra propriedade é `lastIndex`, que controla, em algumas circunstâncias limitadas, onde a próxima correspondência começará.

{{index [interface, design], "exec method", ["regular expression", global]}}

Essas circunstâncias são que a expressão regular deve ter a opção global (`g`) ou sticky (`y`) habilitada, e a correspondência deve acontecer através do método `exec`. Novamente, uma solução menos confusa teria sido simplesmente permitir que um argumento extra fosse passado a `exec`, mas confusão é uma característica essencial da interface de expressões regulares do JavaScript.

```
let pattern = /y/g;
pattern.lastIndex = 3;
let match = pattern.exec("xyzzy");
console.log(match.index);
// → 4
console.log(pattern.lastIndex);
// → 5
```

{{index "side effect", "lastIndex property"}}

Se a correspondência foi bem-sucedida, a chamada a `exec` atualiza automaticamente a propriedade `lastIndex` para apontar após a correspondência. Se nenhuma correspondência foi encontrada, `lastIndex` é redefinido para 0, que também é o valor que tem em um objeto de expressão regular recém-construído.

A diferença entre as opções global e sticky é que, quando sticky está habilitada, a correspondência só terá sucesso se começar diretamente em `lastIndex`, enquanto com global, ela buscará adiante por uma posição onde uma correspondência possa começar.

```
let global = /abc/g;
console.log(global.exec("xyz abc"));
// → ["abc"]
let sticky = /abc/y;
console.log(sticky.exec("xyz abc"));
// → null
```

{{index bug}}

Ao usar um valor de expressão regular compartilhado para múltiplas chamadas `exec`, essas atualizações automáticas na propriedade `lastIndex` podem causar problemas. Sua expressão regular pode estar acidentalmente começando em um índice deixado por uma chamada anterior.

```
let digit = /\d/g;
console.log(digit.exec("here it is: 1"));
// → ["1"]
console.log(digit.exec("and now: 1"));
// → null
```

{{index ["regular expression", global], "match method"}}

Outro efeito interessante da opção global é que ela muda o funcionamento do método `match` em *strings*. Quando chamado com uma expressão global, em vez de retornar um *array* semelhante ao retornado por `exec`, `match` encontrará _todas_ as correspondências do padrão na *string* e retornará um *array* contendo as *strings* correspondidas.

```
console.log("Banana".match(/an/g));
// → ["an", "an"]
```

Portanto, tenha cuidado com expressões regulares globais. Os casos em que são necessárias — chamadas a `replace` e lugares onde você quer usar `lastIndex` explicitamente — são tipicamente as situações onde você quer usá-las.

{{index "lastIndex property", "exec method", loop}}

Uma coisa comum a fazer é encontrar todas as correspondências de uma expressão regular em uma *string*. Podemos fazer isso usando o método `matchAll`.

```
let input = "A string with 3 numbers in it... 42 and 88.";
let matches = input.matchAll(/\d+/g);
for (let match of matches) {
  console.log("Found", match[0], "at", match.index);
}
// → Found 3 at 14
//   Found 42 at 33
//   Found 88 at 40
```

{{index ["regular expression", global]}}

Este método retorna um *array* de *arrays* de correspondência. A expressão regular passada a `matchAll` _deve_ ter `g` habilitado.

{{id ini}}
## Analisando um arquivo INI

{{index comment, "file format", "enemies example", "INI file"}}

Para concluir o capítulo, veremos um problema que exige ((expressões regulares)). Imagine que estamos escrevendo um programa para coletar automaticamente informações sobre nossos inimigos da ((internet)). (Na verdade, não escreveremos esse programa aqui, apenas a parte que lê o arquivo de ((configuração)). Desculpe.) O arquivo de configuração se parece com isto:

```{lang: "null"}
searchengine=https://duckduckgo.com/?q=$1
spitefulness=9.7

; comentários são precedidos por ponto e vírgula...
; cada seção diz respeito a um inimigo individual
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

As regras exatas desse formato — que é um formato de arquivo amplamente usado, geralmente chamado de arquivo _INI_ — são as seguintes:

- Linhas em branco e linhas começando com ponto e vírgula são ignoradas.

- Linhas entre `[` e `]` iniciam uma nova ((seção)).

- Linhas contendo um identificador alfanumérico seguido de um caractere `=` adicionam uma configuração à seção atual.

- Qualquer outra coisa é inválida.

Nossa tarefa é converter uma *string* como esta em um objeto cujas propriedades armazenem *strings* para configurações escritas antes do primeiro cabeçalho de seção e subobjetos para seções, com esses subobjetos armazenando as configurações da seção.

{{index "carriage return", "line break", "newline character"}}

Como o formato precisa ser processado ((linha)) por linha, dividir o arquivo em linhas separadas é um bom começo. Vimos o método `split` no [Capítulo ?](data#split). Alguns sistemas operacionais, porém, usam não apenas um caractere de nova linha para separar linhas, mas um caractere de retorno de carro seguido de uma nova linha (`"\r\n"`). Dado que o método `split` também aceita uma expressão regular como argumento, podemos usar uma expressão regular como `/\r?\n/` para dividir de uma maneira que permita tanto `"\n"` quanto `"\r\n"` entre linhas.

```{startCode: true}
function parseINI(string) {
  // Começar com um objeto para armazenar os campos de nível superior
  let result = {};
  let section = result;
  for (let line of string.split(/\r?\n/)) {
    let match;
    if (match = line.match(/^(\w+)=(.*)$/)) {
      section[match[1]] = match[2];
    } else if (match = line.match(/^\[(.*)\]$/)) {
      section = result[match[1]] = {};
    } else if (!/^\s*(;|$)/.test(line)) {
      throw new Error("Line '" + line + "' is not valid.");
    }
  };
  return result;
}

console.log(parseINI(`
name=Vasilis
[address]
city=Tessaloniki`));
// → {name: "Vasilis", address: {city: "Tessaloniki"}}
```

{{index "parseINI function", parsing}}

O código percorre as linhas do arquivo e constrói um objeto. Propriedades no topo são armazenadas diretamente nesse objeto, enquanto propriedades encontradas em seções são armazenadas em um objeto de seção separado. A *binding* `section` aponta para o objeto da seção atual.

Há dois tipos de linhas significativas — cabeçalhos de seção ou linhas de propriedade. Quando uma linha é uma propriedade regular, ela é armazenada na seção atual. Quando é um cabeçalho de seção, um novo objeto de seção é criado e `section` é definido para apontar para ele.

{{index "caret character", "dollar sign", boundary}}

Note o uso recorrente de `^` e `$` para garantir que a expressão corresponda à linha inteira, não apenas parte dela. Omitir esses resulta em código que funciona na maior parte, mas se comporta de forma estranha para certas entradas, o que pode ser um *bug* difícil de rastrear.

{{index "if keyword", assignment, ["= operator", "as expression"]}}

O padrão `if (match = string.match(...))` faz uso do fato de que o valor de uma expressão de ((atribuição)) (`=`) é o valor atribuído. Você frequentemente não tem certeza de que sua chamada a `match` terá sucesso, então só pode acessar o objeto resultante dentro de uma declaração `if` que testa isso. Para não quebrar a cadeia agradável de formas `else if`, atribuímos o resultado da correspondência a uma *binding* e imediatamente usamos essa atribuição como o teste da declaração `if`.

{{index [parentheses, "in regular expressions"]}}

Se uma linha não é um cabeçalho de seção nem uma propriedade, a função verifica se é um comentário ou uma linha vazia usando a expressão `/^\s*(;|$)/` para corresponder a linhas que contêm apenas espaço em branco, ou espaço em branco seguido de ponto e vírgula (tornando o restante da linha um comentário). Quando uma linha não corresponde a nenhuma das formas esperadas, a função lança uma exceção.

## Unidades de código e caracteres

Outro erro de design que foi padronizado nas expressões regulares do JavaScript é que, por padrão, operadores como `.` ou `?` trabalham com unidades de código (como discutido no [Capítulo ?](higher_order#code_units)), não caracteres reais. Isso significa que caracteres compostos por duas unidades de código se comportam de maneira estranha.

```
console.log(/🍎{3}/.test("🍎🍎🍎"));
// → false
console.log(/<.>/.test("<🌹>"));
// → false
console.log(/<.>/u.test("<🌹>"));
// → true
```

O problema é que o 🍎 na primeira linha é tratado como duas unidades de código, e `{3}` é aplicado apenas à segunda unidade. Da mesma forma, o ponto corresponde a uma única unidade de código, não às duas que compõem o ((emoji)) da rosa.

Você deve adicionar a opção `u` (Unicode) à sua expressão regular para fazê-la tratar tais caracteres adequadamente.

```
console.log(/🍎{3}/u.test("🍎🍎🍎"));
// → true
```

{{id summary_regexp}}

## Resumo

Expressões regulares são objetos que representam padrões em *strings*. Elas usam sua própria linguagem para expressar esses padrões.

{{table {cols: [1, 5]}}}

| `/abc/`     | Uma sequência de caracteres
| `/[abc]/`   | Qualquer caractere de um conjunto
| `/[^abc]/`  | Qualquer caractere _não_ em um conjunto
| `/[0-9]/`   | Qualquer caractere em um intervalo
| `/x+/`      | Uma ou mais ocorrências do padrão `x`
| `/x+?/`     | Uma ou mais ocorrências, não-ganancioso
| `/x*/`      | Zero ou mais ocorrências
| `/x?/`      | Zero ou uma ocorrência
| `/x{2,4}/`  | Duas a quatro ocorrências
| `/(abc)/`   | Um grupo
| `/a|b|c/`   | Qualquer um de vários padrões
| `/\d/`      | Qualquer caractere de dígito
| `/\w/`      | Um caractere alfanumérico ("caractere de palavra")
| `/\s/`      | Qualquer caractere de espaço em branco
| `/./`       | Qualquer caractere exceto nova linha
| `/\p{L}/u`  | Qualquer caractere de letra
| `/^/`       | Início da entrada
| `/$/`       | Fim da entrada
| `/(?=a)/`   | Um teste de look-ahead

Uma expressão regular tem um método `test` para testar se uma dada *string* a corresponde. Ela também tem um método `exec` que, quando uma correspondência é encontrada, retorna um *array* contendo todos os grupos correspondidos. Tal *array* tem uma propriedade `index` que indica onde a correspondência começou.

*Strings* têm um método `match` para corresponder contra uma expressão regular e um método `search` para buscar por uma, retornando apenas a posição inicial da correspondência. Seu método `replace` pode substituir correspondências de um padrão por uma *string* de substituição ou função.

Expressões regulares podem ter opções, que são escritas após a barra de fechamento. A opção `i` torna a correspondência insensível a maiúsculas e minúsculas. A opção `g` torna a expressão _global_, o que, entre outras coisas, faz com que o método `replace` substitua todas as instâncias em vez de apenas a primeira. A opção `y` torna uma expressão sticky, o que significa que ela não buscará adiante e pulará parte da *string* ao procurar uma correspondência. A opção `u` ativa o modo Unicode, que habilita a sintaxe `\p` e corrige diversos problemas em torno do tratamento de caracteres que ocupam duas unidades de código.

Expressões regulares são uma ((ferramenta)) afiada com um cabo estranho. Elas simplificam algumas tarefas tremendamente, mas podem rapidamente se tornar incontroláveis quando aplicadas a problemas complexos. Parte de saber como usá-las é resistir à vontade de tentar encaixar nelas coisas que elas não conseguem expressar de forma limpa.

## Exercícios

{{index debugging, bug}}

É quase inevitável que, no decorrer do trabalho com esses exercícios, você ficará confuso e frustrado com algum comportamento inexplicável de ((expressão regular)). Às vezes ajuda inserir sua expressão em uma ferramenta online como [_debuggex.com_](https://www.debuggex.com) para ver se sua visualização corresponde ao que você pretendia e ((experimentar)) como ela responde a várias *strings* de entrada.

### Golfe de regexp

{{index "program size", "code golf", "regexp golf (exercise)"}}

_Golfe de código_ é um termo usado para o jogo de tentar expressar um programa particular no menor número de caracteres possível. Da mesma forma, _golfe de regexp_ é a prática de escrever a expressão regular mais curta possível para corresponder a um dado padrão e _apenas_ aquele padrão.

{{index boundary, matching}}

Para cada um dos itens a seguir, escreva uma ((expressão regular)) para testar se o padrão dado ocorre em uma *string*. A expressão regular deve corresponder apenas a *strings* contendo o padrão. Quando sua expressão funcionar, veja se consegue torná-la menor.

 1. _car_ e _cat_
 2. _pop_ e _prop_
 3. _ferret_, _ferry_ e _ferrari_
 4. Qualquer palavra terminando em _ious_
 5. Um caractere de espaço em branco seguido de um ponto, vírgula, dois-pontos ou ponto e vírgula
 6. Uma palavra com mais de seis letras
 7. Uma palavra sem a letra _e_ (ou _E_)

Consulte a tabela no [resumo do capítulo](regexp#summary_regexp) para ajuda. Teste cada solução com algumas *strings* de teste.

{{if interactive
```
// Preencha as expressões regulares

verify(/.../,
       ["my car", "bad cats"],
       ["camper", "high art"]);

verify(/.../,
       ["pop culture", "mad props"],
       ["plop", "prrrop"]);

verify(/.../,
       ["ferret", "ferry", "ferrari"],
       ["ferrum", "transfer A"]);

verify(/.../,
       ["how delicious", "spacious room"],
       ["ruinous", "consciousness"]);

verify(/.../,
       ["bad punctuation ."],
       ["escape the period"]);

verify(/.../,
       ["Siebentausenddreihundertzweiundzwanzig"],
       ["no", "three small words"]);

verify(/.../,
       ["red platypus", "wobbling nest"],
       ["earth bed", "bedrøvet abe", "BEET"]);


function verify(regexp, yes, no) {
  // Ignorar exercícios inacabados
  if (regexp.source == "...") return;
  for (let str of yes) if (!regexp.test(str)) {
    console.log(`Failure to match '${str}'`);
  }
  for (let str of no) if (regexp.test(str)) {
    console.log(`Unexpected match for '${str}'`);
  }
}
```

if}}

### Estilo de citação

{{index "quoting style (exercise)", "single-quote character", "double-quote character"}}

Imagine que você escreveu uma história e usou aspas simples ao longo do texto para marcar trechos de diálogo. Agora quer substituir todas as aspas de diálogo por aspas duplas, mantendo as aspas simples usadas em contrações como _aren't_.

{{index "replace method"}}

Pense em um padrão que distinga esses dois tipos de uso de aspas e construa uma chamada ao método `replace` que faça a substituição adequada.

{{if interactive
```{test: no}
let text = "'I'm the cook,' he said, 'it's my job.'";
// Altere esta chamada.
console.log(text.replace(/A/g, "B"));
// → "I'm the cook," he said, "it's my job."
```
if}}

{{hint

{{index "quoting style (exercise)", boundary}}

A solução mais óbvia é substituir apenas aspas com um caractere não-letra em pelo menos um lado — algo como `/\P{L}'|'\P{L}/u`. Mas você também precisa levar em conta o início e o final da linha.

{{index grouping, "replace method", [parentheses, "in regular expressions"]}}

Além disso, você deve garantir que a substituição também inclua os caracteres que foram correspondidos pelo padrão `\P{L}` para que não sejam descartados. Isso pode ser feito envolvendo-os em parênteses e incluindo seus grupos na *string* de substituição (`$1`, `$2`). Grupos que não foram correspondidos serão substituídos por nada.

hint}}

### Números novamente

{{index sign, "fractional number", [syntax, number], minus, "plus character", exponent, "scientific notation", "period character"}}

Escreva uma expressão que corresponda apenas a ((número))s no estilo JavaScript. Ela deve suportar um sinal de menos _ou_ mais opcional na frente do número, o ponto decimal e notação de expoente — `5e-3` ou `1E10` — novamente com um sinal opcional na frente do expoente. Também note que não é necessário haver dígitos antes ou depois do ponto, mas o número não pode ser apenas um ponto. Ou seja, `.5` e `5.` são números JavaScript válidos, mas um ponto sozinho não é.

{{if interactive
```{test: no}
// Preencha esta expressão regular.
let number = /^...$/;

// Testes:
for (let str of ["1", "-1", "+15", "1.55", ".5", "5.",
                 "1.3e2", "1E-4", "1e+12"]) {
  if (!number.test(str)) {
    console.log(`Failed to match '${str}'`);
  }
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5",
                 ".5.", "1f5", "."]) {
  if (number.test(str)) {
    console.log(`Incorrectly accepted '${str}'`);
  }
}
```

if}}

{{hint

{{index ["regular expression", escaping], ["backslash character", "in regular expressions"]}}

Primeiro, não esqueça a barra invertida antes do ponto.

Corresponder ao ((sinal)) opcional na frente do ((número)), assim como na frente do ((expoente)), pode ser feito com `[+\-]?` ou `(\+|-|)` (mais, menos ou nada).

{{index "pipe character"}}

A parte mais complicada do exercício é o problema de corresponder tanto `"5."` quanto `".5"` sem também corresponder a `"."`. Para isso, uma boa solução é usar o operador `|` para separar os dois casos — ou um ou mais dígitos opcionalmente seguidos de um ponto e zero ou mais dígitos _ou_ um ponto seguido de um ou mais dígitos.

{{index exponent, "case sensitivity", ["regular expression", flags]}}

Finalmente, para tornar o _e_ insensível a maiúsculas, adicione uma opção `i` à expressão regular ou use `[eE]`.

hint}}
