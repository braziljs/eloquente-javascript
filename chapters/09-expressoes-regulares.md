Capítulo 9

# Expressões Regulares

> "Algumas pessoas, quando confrontadas com um problema, pensam "Eu sei, terei que usar expressões regulares." Agora elas têm dois problemas.
>
> — Jamie Zawinski

> "Yuan-Ma disse, 'Quando você serra contra o sentido da madeira, muita força será necessária. Quando você programa contra o sentido do problema, muito código será necessário'
>
> — Mestre Yuan-Ma, The Book of Programming

A maneira como técnicas e convenções de programação sobrevivem e se disseminam, ocorrem de um modo caótico, evolucionário. Não é comum que a mais agradável e brilhante vença, mas sim aquelas que combinam bem com o trabalho e o nicho, por exemplo, sendo integradas com outra tecnologia de sucesso.

Neste capítulo, discutiremos uma dessas tecnologias, expressões regulares. Expressões regulares são um modo de descrever padrões em um conjunto de caracteres. Eles formam uma pequena linguagem à parte, que é incluída no JavaScript (assim como em várias outras linguagens de programação e ferramentas).

Expressões regulares são ao mesmo tempo, extremamente úteis e estranhas. Conhecê-las apropriadamente facilitará muito vários tipos de processamento de textos. Mas a sintaxe utilizada para descrevê-las é ridiculamente enigmática. Além disso, a interface do JavaScript para elas é um tanto quanto desajeitada.

----

## Notação

Uma expressão regular é um objeto. Ele pode ser construído com o construtor RegExp ou escrito como um valor literal, encapsulando o padrão com o caractere barra ('/').

```js
var expReg1 = new RegExp("abc");
var expReg2 = /abc/;
```

Este objeto representa um padrão, que no caso é uma letra "a" seguida de uma letra "b" e depois um "c".

Ao usar o construtor RegExp, o padrão é escrito como um texto normal, de modo que as regras normais se aplicam para barras invertidas. Na segunda notação, usamos barras para delimitar o padrão. Alguns outros caracteres, como sinais de interrogação (?) e sinais de soma (+), são usados como marcadores especiais em expressões regulares, e precisam ser precedidos por uma barra invertida, para representarem o caractere original e não o comando de expressão regular.

```js
var umMaisum = /1 \+ 1/;
```

Saber exatamente quais caracteres devem ser escapados com uma barra invertida em uma expressão regular exige que você saiba todos os caracteres especiais e seus significados na sintaxe de expressões regulares. Por enquanto, pode não parecer fácil saber todos, então, se tiver dúvidas, escape todos os caracteres que não sejam letras e números ou um espaço em branco.

## Testando por correspondências

Expressões regulares possuem vários métodos. O mais simples é test, onde dado um determinado texto, ele retorna um booleano que informa se o padrão fornecido na expressão foi encontrado nesse texto.

```js
console.log( /abc/.test("abcde") );
// → true
console.log( /abc/.test("12345") );
// → false
```

Uma expressão regular que contenha apenas caracteres simples, representa essa mesma sequência de caracteres. Se "abc" existe em qualquer lugar (não apenas no início) do texto testado, o resultado será verdadeiro.

## Encontrando um conjunto de caracteres

Saber quando uma _string_contém "abc" pode muito bem ser feito usando a função indexOf. A diferença das expressões regulares é que elas permitem padrões mais complexos de busca.

Digamos que queremos achar qualquer número. Em uma expressão regular, colocar um conjunto de caracteres entre colchetes ("[]") faz com que a expressão ache qualquer dos caracteres dentro dos colchetes.

A expressão abaixo, acha todas as strings que contem um dígito numérico.

```js
console.log( /[0123456789]/.test("ano 1992") );
// → true
console.log( /[0-9]/.test("ano 1992") );
// → true
```

Dentro de colchetes, um hífen ("-") entre dois caracteres pode ser usado para indicar um conjunto entre dois caracteres. Uma vez que os códigos de caracteres Unicode de "0" a "9" contém todos os dígitos (códigos 48 a 57), [0-9] encontrará qualquer dígito.

Existem alguns grupos de caracteres de uso comum, que já possuem atalhos incluídos na sintaxe de expressões regulares. Dígitos são um dos conjuntos que você pode escrever usando um atalho, barra invertida seguida de um "d" minúsculo (\d), com o mesmo significado que [0-9].

	- \d	caracteres numéricos
	- \w	caracteres alfanuméricos ("letras")
	- \s	espaços em branco (espaço, tabs, quebras de linha e similares)
	- \D	caracteres que não são dígitos
	- \W	caracteres não alfanuméricos
	- \S	caracteres que não representam espaços
	- . (ponto)	todos os caracteres, exceto espaços

Para cada um dos atalhos de conjuntos de caracteres, existe uma variação em letra maiúscula que significa o exato oposto.

Então você pode registrar um formato de data e hora como "30/01/2003 15:20" com a seguinte expressão:

```js
var dataHora = /\d\d\/\d\d\/\d\d\d\d \d\d:\d\d/;
console.log( dataHora.test("30/01/2003 15:20") );
// → true
console.log( dataHora.test("30/jan/2003 15:20") );
// → false
```

Parece confuso, certo? Muitas barras invertidas, sujando a expressão, que dificultam compreender qual o padrão procurado. Mas é assim mesmo o trabalho com expressões regulares.

Estes marcadores de categoria também podem ser usados dentro de colchetes, então [\d.] significa qualquer dígito ou ponto.

Para "inverter" um conjunto de caracteres, buscar tudo menos o que você escreveu no padrão, um cento circunflexo ("^") é colocado no início do colchete de abertura.

```js
var naoBinario = /[^01]/;
console.log( naoBinario.test("01101") );
// → false
console.log( naoBinario.test("01201") );
// → true
```

## Partes repetidas em um padrão

Já aprendemos a encontrar um dígito, mas o que realmente queremos é encontrar um número, uma sequência de um ou mais dígitos.

Quando se coloca um sinal de mais ("+") depois de algo em uma expressão regular, indicamos que pode existir mais de um. Então /\d+/ encontra um ou mais dígitos.

```js
console.log( /'\d+'/.test("'123'") );
// → true
console.log( /'\d+'/.test("''") );
// → false
console.log( /'\d*'/.test("'123'") );
// → true
console.log( /'\d*'/.test("''") );
// → true
```

O asterisco ("*") tem um significado similar, mas também permite não encontrar o padrão. Então, algo com um asterisco depois não impede um padrão de ser achado, apenas retornando zero resultados.

Uma interrogação ("?") define uma parte do padrão de busca como "opcional", o que significa que ele pode ocorrer zero ou uma vez. Neste exemplo, é permitido que ocorra o caractere "u", mas o padrão também é encontrado quando ele está ausente.

```js
var neighbor = /neighbou?r/;
console.log(neighbor.test("neighbour"));
// → true
console.log(neighbor.test("neighbor"));
// → true
```

Para permitir que um padrão ocorra um número definido de vezes, chaves ("{}") são usadas. Colocando {4} depois de um elemento do padrão, mostra que ele deve ocorrer 4 vezes, exatamente. Da mesma maneira, {2,4} é utilizado para definir que ele deve aparecer no mínimo 2 vezes e no máximo 4.

Segue outra versão do padrão mostrado acima, de data e hora. Ele permite, dias com um dígito, mês e hora como números e mais legível:

```js
var dataHora = /\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}/;
console.log( dataHora.test("30/1/2003 8:45") );
// → true
```

Também é possível deixar em aberto o número mínimo ou máximo de ocorrências, omitindo o número correspondente. Então {,5} significa que deve ocorrer de 0 até 5 vezes e {5,} significa que deve ocorrer cinco ou mais vezes.

## Agrupando subexpressões

Para usar um operador como "*" ou "+" em mais de um caractere de de uma vez, é necessário o uso de parênteses. Um pedaço de uma expressão regular que é delimitado por parênteses conta como uma única unidade, assim como os operadores aplicados a esse pedaço delimitado.

```js
var cartoonCrying = /boo+(hoo+)+/i;
console.log( cartoonCrying.test("Boohoooohoohooo") );
// → true
```

O terceiro "+" se aplica a todo grupo (hoo+), encontrando uma ou mais sequências como essa.

O "i" no final da expressão do exemplo acima faz com que a expressão regular seja case-insensitive, permitindo-a encontrar a letra maiúscula "B" na _string_dada, mesmo que a descrição do padrão tenha sido feita em letras minúsculas.

## Resultados e grupos

O método test é a maneira mais simples de encontrar correspondências de uma expressão regular. Ela apenas informa se foi encontrado algo e mais nada. Expressões regulares também possuem o método exec (executar), que irá retornar null quando nenhum resultado for encontrado, e um objeto com informações se encontrar.

```js
var match = /\d+/.exec("one two 100");
console.log(match);
// → ["100"]
console.log(match.index);
// → 8
```

Valores _string_possuem um método que se comporta de maneira semelhante.

```js
console.log("one two 100".match(/\d+/));
// → ["100", index: 8, input: "one two 100"]
```

Um objeto retornado pelo método exec ou match possui um index de propriedades que informa aonde na _string_o resultado encontrado se inicia. Além disso, o objeto se parece (e de fato é) um array de strings, onde o primeiro elemento é a _string_que foi achada, no exemplo acima, a sequência de dígitos numéricos.

Quando uma expressão regular contém expressões agrupadas entre parênteses, o texto que corresponde a esses grupos também aparece no array. O primeiro elemento sempre é todo o resultado, seguido pelo resultado do primeiro grupo entre parênteses, depois o segundo grupo e assim em diante.

```js
var textoCitado = /'([^']*)'/;
console.log( textoCitado.exec("'ela disse adeus'") );
// → ["'ela disse adeus'", "ela disse adeus", index: 0, input: "'ela disse adeus'"]
```

Quando um grupo não termina sendo achado (se por exemplo, possui um sinal de interrogação depois dele), seu valor no array de resultado será undefined. Do mesmo modo, quando um grupo é achado várias vezes, apenas o último resultado encontrado estará no array.

```js
console.log(/bad(ly)?/.exec("bad"));
// → ["bad", undefined]
console.log(/(\d)+/.exec("123"));
// → ["123", "3"]
```

Grupos podem ser muito úteis para extrair partes de uma string. Por exemplo, podemos não querer apenas verificar quando uma _string_contém uma data, mas também extraí-la, e construir um objeto que a representa. Se adicionarmos parênteses em volta do padrão de dígitos, poderemos selecionar a data no resultado da função exec.

Mas antes, um pequeno desvio.

## O tipo _data_

O JavaScript possui um objeto padrão para representar datas, ou melhor, pontos no tempo. Ele é chamado _Date_. Se você simplesmente criar uma data usando _new_, terá a data e hora atual.

```js
console.log( new Date() );
// → Fri Feb 21 2014 09:39:31 GMT-0300 (BRT)
```

Também é possível criar um objeto para uma hora específica

```js
console.log( new Date(2014, 6, 29) );
// → Tue Jul 29 2014 00:00:00 GMT-0300 (BRT)
console.log( new Date(1981, 6, 29, 18, 30, 50) );
// → Wed Jul 29 1981 18:30:50 GMT-0300 (BRT)
```

O JavaScript utiliza uma convenção onde a numeração dos meses se inicia em zero (então Dezembro é 11), mas os dias iniciam-se em um. É bem confuso, então, tenha cuidado.

Os últimos quatro argumentos (horas, minutos, segundos e milissegundos) são opcionais, e assumem o valor de zero se não forem fornecidos.

Internamente, objetos do tipo data são armazenados como o número de milissegundos desde o início de 1970. Usar o método _getTime_ em uma data retorna esse número, e ele é bem grande, como deve imaginar.

```js
console.log( new Date(2014, 2, 21).getTime() );
// → 1395370800000
console.log( new Date( 1395370800000 ) );
// → Fri Mar 21 2014 00:00:00 GMT-0300 (BRT)
```

Quando fornecemos apenas um argumento ao construtor do _Date_, ele é tratado como se fosse um número de milissegundos.

Objetos _Date_ possuem métodos como _getFullYear_ (_getYear_ retorna apenas os inúteis dois últimos dígitos do ano), _getMonth_, _getDate_, _getHours_, _getMinutes_ e _getSeconds_  para extrair os componentes da data.

Então agora, ao colocar parênteses em volta das partes que nos interessam, podemos facilmente extrair uma data de uma _string_.

```js
function buscaData(string) {
  var dateTime = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
  var match = dateTime.exec(string);
  return new Date( Number(match[3]), Number(match[2] ), Number(match[1]) );
}
console.log( buscaData("21/1/2014") );
// → Fri Feb 21 2014 00:00:00 GMT-0300 (BRT)
```

## Limites de palavra e _string_

A função _buscaData_ acima irá extrair facilmente a data de um texto como "100/1/30000", um resultado pode acontecer em qualquer lugar da _string_ fornecida, então, nesse caso, vai encontrar no segundo caractere e terminar no último

Se quisermos nos assegurar que a busca seja em todo o texto, podemos adicionar os marcadores  "^" e "$". O primeiro acha o início da _string_ fornecida e o segundo o final dela. Então /^\d+$/ encontra apenas em uma _string_ feita de um ou mais dígitos, /^!/ encontra qualquer _string_ que começa com sinal de exclamação e /x^/ não acha nada (o início de uma _string_ não pode ser depois de um caractere).

Se, por outro lado, queremos ter certeza que a data inicia e termina no limite da palavra, usamos o marcador \b. Um limite de palavra é um ponto onde existe um caractere de um lado e um caractere que não seja de palavra de outro.

```js
console.log( /cat/.test("concatenate") );
// → true
console.log( /\bcat\b/.test("concatenate") );
// → false
```

Note que esses marcadores de limite não cobrem nenhum caractere real, eles apenas asseguram que o padrão de busca irá achar algo na posição desejada, informada nos marcadores.

## Alternativas

Agora, queremos saber se um pedaço do texto contém não apenas um número, mas um número seguido por uma das palavras "porco", "vaca", "galinha" ou seus plurais também.

Podemos escrever três expressões regulares, e testar cada uma, mas existe uma maneira mais simples. O caractere pipe ("|") indica uma opção entre o padrão à esquerda ou a direita. Então podemos fazer:

```js
var contagemAnimal = /\b\d+ (porco|vaca|galinha)s?\b/;
console.log( contagemAnimal.test("15 porcos") );
// → true
console.log( contagemAnimal.test("15 porcosgalinhas") );
// → false
```

Parênteses podem ser usados para limitar a que parte do padrão que o pipe ("|") se aplica, e você pode colocar vários desses operadores lado a lado para expressar uma escolha entre mais de dois padrões.

## O mecanismo de procura

![O mecanismo de procura](../img/re_porcogalinhas.svg)

Uma _string_ corresponde à expressão se um caminho do início (esquerda) até o final (direita) do diagrama puder ser encontrado, com uma posição inicial e final correspondente, de modo que cada vez que passar em uma caixa, verificamos que a posição atual na sequência corresponde ao elemento descrito nela, e, para os elementos que correspondem caracteres reais (menos os limites de palavra), continue no fluxo das caixas.

Então se encontrarmos "the 3 pigs" existe uma correspondência entre as posições 4 (o dígito "3") e 10 (o final da string).

- Na posição 4, existe um limite de palavra, então passamos a primeira caixa
- Ainda na posição 4, encontramos um dígito, então ainda podemos passar a primeira caixa.
- Na posição 5, poderíamos voltar para antes da segunda caixa (dígitos), ou avançar através da caixa que contém um único caractere de espaço. Há um espaço aqui, não um dígito, por isso escolhemos o segundo caminho.
- Estamos agora na posição 6 (o início de "porcos") e na divisão entre três caminhos do diagrama. Nós não temos "vaca" ou "galinha" aqui, mas nós temos "porco", por isso tomamos esse caminho.
- Na posição 9, depois da divisão em três caminhos, poderíamos também ignorar o "s" e ir direto para o limite da palavra, ou achar o "s" primeiro. Existe um "s", não um limite de palavra, então passamos a caixa de "s".
- Estamos na posição 10 (final da string) e só podemos achar um limite de palavra. O fim de uma _string_ conta como um limite de palavra, de modo que passamos a última caixa e achamos com sucesso a busca.

O modo como o mecanismo de expressões regulares do JavaScript trata uma busca em uma _string_ é simples. Começa no início da _string_ e tenta achar um resultado nela. Nesse casso, existe um limite de palavra aqui, então passamos pela primeira caixa, mas não existe um dígito, então ele falha na segunda caixa. Continua no segundo caractere da _string_ e tenta novamente. E assim continua, até encontrar um resultado ou alcançar o fim da _string_ e concluir que não encontrou nenhum resultado

## Retrocedendo

A expressão regular /\b([01]+b|\d+|[\da-f]h)\b/ encontra um número binário seguido por um "b", um número decimal, sem um caractere de sufixo, ou um número hexadecimal (de base 16, com as letras "a" a "f" para os algarismos de 10 a 15), seguido por um "h". Este é o diagrama equivalente:

http://eloquentJavaScript.net/2nd_edition/preview/img/re_number.svg

Ao buscar esta expressão, muitas vezes o ramo superior será percorrido, mesmo que a entrada não contenha realmente um número binário. Quando busca a _string_ "103", é apenas no "3" que torna-se claro que estamos no local errado. A expressão é buscada não apenas no ramo que se está executando.

É o que acontece se a expressão retroage. Quando entra em um ramo, ela guarda em que ponto aconteceu (nesse caso, no início da _string_, na primeira caixa do diagrama), então ela retrocede e tenta outro ramo do diagrama se o atual não encontra nenhum resultado. Então para a _string_ "103", após encontrar o caractere "3", ela tentará o segundo ramo, teste de número decimal. E este, encontra um resultado.

Quando mais de um ramo encontra um resultado, o primeiro (na ordem em que foi escrito na expressão regular) será considerado.

Retroceder acontece também, de maneiras diferentes, quando buscamos por operadores repetidos. Se buscarmos /^.*x/  em "abcxe", a parte ".*" tentará achar toda a _string_. Depois, tentará achar apenas o que for seguido de um "x", e não existe um "x" no final da _string_. Então ela tentará achar desconsiderando um caractere, e outro, e outro. Quando acha o "x", sinaliza um resultado com sucesso, da posição 0 até 4.

É possível escrever expressões regulares que fazem muitos retrocessos. O Problema ocorre quando um padrão encontra um pedaço da _string_ de entrada de muitas maneiras. Por exemplo, se confundimos e escrevemos nossa expressão regular para achar binários e números assim /([01]+)+b/.

http://eloquentJavaScript.net/2nd_edition/preview/img/re_slow.svg

Ela tentará achar séries de zeros sem um "b" após elas, depois irá percorrer o circuito interno até passar por todos os dígitos. Quando perceber que não existe nenhum "b", retorna uma posição e passa pelo caminho de fora mais uma vez, e de novo, retrocedendo até o circuito interno mais uma vez. Continuará tentando todas as rotas possíveis através destes dois _loops_, em todos os caracteres. Para _strings_ mais longas o resultado demorará praticamente para sempre.


## O método _replace_

_Strings_ possuem o método _replace_, que pode ser usado para substituir partes da _string_ com outra _string_

```js
console.log("papa".replace("p", "m"));
// → mapa
```

O primeiro argumento também pode ser uma expressão regular, que na primeira ocorrência de correspondência será substituída.

```js
console.log("Borobudur".replace(/[ou]/, "a"));
// → Barobudur
console.log("Borobudur".replace(/[ou]/g, "a"));
// → Barabadar
```

Quando a opção "g" ("global") é adicionada à expressão, todas as ocorrências serão substituídas, não só a primeira.

Seria melhor se essa opção fosse feita através de outro argumento, em vez de usar a opção própria de uma expressão regular. (Este é um exemplo de falha na sintaxe do JavaScript)

A verdadeira utilidade do uso de expressões regulares com o método _replace_ é a opção de fazer referências aos grupos achados através da expressão. Por exemplo, se temos uma _string_ longa com nomes de pessoas, uma por linha, no formato "Sobrenome, Nome" e queremos trocar essa ordem e remover a vírgula, para obter o formato "Nome Sobrenome", podemos usar o seguinte código:

```js
console.log("Hopper, Grace\nMcCarthy, John\nRitchie, Dennis".replace(/([\w ]+), ([\w ]+)/g, "$2 $1"));
// → Grace Hopper
//   John McCarthy
//   Dennis Ritchie
```

O "$1" e "$2" na _string_ de substituição referem-se as partes entre parênteses no padrão. "$1" será substituído pelo texto achado no primeiro grupo entre parênteses e "$2" pelo segundo, e assim em diante, até "$9".

Também é possível passar uma função, em vez de uma _string_ no segundo argumento do método _replace_. Para cada substituição, a função será chamada com os grupos achados (assim como o padrão) como argumentos, e o valor retornado pela função será inserido na nova _string_.

Segue um exemplo simples:

```js
var s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)\b/g, function(str) {
  return str.toUpperCase();
}));
// → the CIA and FBI
```

E outro exemplo:

```js
var stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
  amount = Number(amount) - 1;
  if (amount == 1) // only one left, remove the 's'
	unit = unit.slice(0, unit.length - 1);
  else if (amount == 0)
	amount = "no";
  return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\w+)/g, minusOne));
// → no lemon, 1 cabbage, and 100 eggs
```

Ele pega a _string_, acha todas as ocorrências de um número seguido por uma palavra alfanumérica e retorna uma nova _string_ onde cada achado é diminuído em um.

O grupo (\d+) finaliza o argumento da função e o (\w+) limita a unidade. A função converte o valor em um número, desde que achado, \d+ faz ajustes caso exista apenas um ou zero esquerda.

## Quantificador / Greed

É simples usar o método _replace_ para escrever uma função que remove todos os comentários de um pedaço de código JavaScript. Veja uma primeira tentativa

```js
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[\w\W]*\*\//g, "");
}
console.log(stripComments("1 + /* 2 */3"));
// → 1 + 3
console.log(stripComments("x = 10;// ten!"));
// → x = 10;
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1  1
```

A parte [\w\W] é uma maneira (feia) de encontrar qualquer caractere. Lembre-se que um ponto não encontra um caractere de quebra de linha / linha nova. Comentários podem conter mais de uma linha, então não podemos usar um ponto aqui. Achar algo que seja ou não um caractere de palavra, irá encontrar todos os caracteres possíveis.

Mas o resultado do último exemplo parece errado. Porque?

A parte ".*" da expressão, como foi escrita na seção "Retrocedendo", acima, encontrará primeiro tudo que puder e depois, se falhar, volta atrás e tenta mais uma vez a partir daí. Nesse caso, primeiro procuramos no resto da _string_ e depois continuamos a partir daí. Encontrará uma ocorrência de "*/" depois volta quatro caracteres e acha um resultado. Isto não era o que desejávamos, queríamos um comentário de uma linha, para não ir até o final do código e encontrar o final do último comentário.

Existem duas variações de operadores de repetição em expressões regulares ('+', '*', e '{}'). Por padrão, eles quantificam, significa que eles encontram o que podem e retrocedem a partir daí. Se você colocar uma interrogação depois deles, eles se tornam _non_greedy_, e começam encontrando o menor grupo possível e o resto que não contenha o grupo menor.

E é exatamente o que queremos nesse caso. Com o asterisco encontramos os grupos menores que tenham "*/" no fechamento, encontramos um bloco de comentários e nada mais.

```js
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[\w\W]*?\*\//g, "");
}
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1 + 1
```

## Criando objetos RegExp dinamicamente

Existem casos onde você pode não saber o padrão exato que você precisa quando escreve seu código. Digamos que você queira buscar o nome de um usuário em um pedaço de texto e colocá-lo entre caracteres "_" para destacá-lo. O nome será fornecido apenas quando o programa estiver sendo executado, então não podemos usar a notação de barras para criar nosso padrão.

Mas podemos construir uma _string_ e usar o construtor _RegExp_ para isso. Por exemplo:

```js
var name = "harry";
var text = "Harry is a suspicious character.";
var regexp = new RegExp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// → _Harry_ is a suspicious character.
```

Ao criar os marcos de limite "\b, usamos duas barras invertidas, porque estamos escrevendo-os em uma _string_ normal, não uma expressão regular com barras. As opções (global e case-insensitive) para a expressão regular podem ser inseridas como segundo argumento para o construtor RegExp.

Mas e se o nome for "dea+hl[]rd" porque o usuário é um adolescente nerd? Isso irá gerar uma falsa expressão regular, por conter caracteres comando, que irá gerar um resultado estranho

Para contornar isso, adicionamos contrabarras antes de qualquer caractere que não confiamos. Adicionar contrabarras antes de qualquer caractere alfabético é uma má idéia, porque coisas como "\b" ou "\n" possuem significado para uma expressão regular. Mas escapar tudo que não for alfanumérico ou espaço é seguro.

```js
var name = "dea+hl[]rd";
var text = "This dea+hl[]rd guy is quite annoying.";
var escaped = name.replace(/[^\w\s]/g, "\\$&");
var regexp = new RegExp("\\b(" + escaped + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// → This _dea+hl[]rd_ guy is quite annoying.
```

O marcador "$&" na _string_ de substituição age como se fosse "$1", mas será substituído em dodos os resultados ao invés do grupo encontrado.

## O método _search_

O método _indexOf_ em _strings_ não pode ser invocado com uma expressão regular. Mas existe um outro método, _search_, que espera como argumento uma expressão regular, e como o _indexOf_, retorna o índice do primeiro resultado encontrado ou -1 se não encontra.

```js
console.log("  word".search(/\S/));
// → 2
console.log("    ".search(/\S/));
// → -1
```

Infelizmente, não existe um modo de indicar onde a busca deve começar, com um índice (como o segundo argumento de _indexOf_), o que seria muito útil.

## A propriedade _lastIndex_

O método _exec_ também não possui um modo conveniente de iniciar a busca a partir de uma determinada posição. Mas ele fornece um método não muito prático.

Expressões regulares possuem propriedades (como _source_ que contém a _string_ que originou a expressão). Uma dessas propriedades, _lastIndex_, controla, em algumas circunstâncias, onde a busca começará.

Essas circunstâncias são que a expressão regular precisa ter a opção "global" (g) habilitada e precisa ser no método _exec_. Novamente, deveria ser da mesma maneira que permitir um argumento extra para o método _exec_, mas coesão não é uma característica que define a sintaxe de expressões regulares em JavaScript

```js
var pattern = /y/g;
pattern.lastIndex = 3;
var match = pattern.exec("xyzzy");
console.log(match.index);
// → 4
console.log(pattern.lastIndex);
// → 5
```

A propriedade _lastIndex_ é atualizada ao ser executada após encontrar algo. Quando não encontra nada, _lastIndex_ é definida como zero, que também é o valor quando uma nova expressão é construída.

Quando usada uma expressão regular global para múltiplas chamadas ao método _exec_, esta mudança da propriedade _lastIndex_ pode causar problemas, sua expressão pode iniciar por acidente em um índice deixado na ultima vez que foi executada.

Outro efeito interessante da opção global é que ela muda a maneira como o método _match_ funciona em uma _string_. Quando chamada com uma expressão global, em vez de retornar um array semelhante ao retornado pelo _exec_, _match_ encontrará todos os resultados do padrão na _string_ e retornará um array contendo todas as _strings_ encontradas.

```js
console.log("Banana".match(/an/g));
// → ["an", "an"]
```

Então tenha cuidado com expressões regulares globais. Os casos em que são necessárias - chamadas para substituir e lugares onde você deseja usar explicitamente _lastIndex_ - normalmente são os únicos lugares onde você deseja utilizá-las.

Um padrão comum é buscar todas as ocorrências de um padrão em uma _string_, com acesso a todos os grupos encontrados e ao índice onde foram encontrados, usando _lastIndex_ e _exec_.

```js
var input = "A text with 3 numbers in it... 42 and 88.";
var re = /\b(\d+)\b/g;
var match;
while (match = re.exec(input))
  console.log("Found", match[1], "at", match.index);
// → Found 3 at 12
//   Found 42 at 31
//   Found 88 at 38
```

Usa-se o fato que o valor de uma expressão de definição ('=') é o valor assinalado. Então usando-se `match = re.exec(input)` como a condição no bloco `while`, podemos buscar no início de cada iteração.

## Analisando um arquivo .ini

Agora vamos ver um problema real que pede por uma expressão regular. Imagine que estamos escrevendo um programa que coleta informação automaticamente da internet dos nossos inimigos. (Não vamos escrever um programa aqui, apenas a parte que lê o arquivo de configuração, desculpe desapontá-los). Este arquivo tem a seguinte aparência:

```
searchengine=http://www.google.com/search?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; these are sections, concerning individual enemies
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[gargamel]
fullname=Gargamel
type=evil sorcerer
outputdir=/home/marijn/enemies/gargamel
```

As regras exatas desse formato (que é um formato muito usado, chamado arquivo .ini) são as seguintes:

- Linhas em branco e linhas iniciadas com ponto e vírgula são ignoradas.
- Linhas entre colchetes "[ ]" iniciam uma nova seção.
- Linhas contendo um identificador alfanumérico seguido por um caractere = adicionam uma configuração à seção atual.
- Qualquer outra coisa é inválida.

Nossa tarefa é converter uma _string_ como essa em um _array_ de objetos, cada uma com um nome e um _array_ de pares nome/valor. Precisaremos de um objeto para cada seção e outro para as configurações de seção.

Já que o formato precisa ser processado linha a linha, dividir em linhas separadas é um bom começo. Usamos o método _split_ antes para isso, _string.split("\n")_. Entretanto alguns sistemas operacionais não usam apenas um caractere de nova linha para separar linhas, mas um caractere de retorno seguido por um de nova linha ("_\r\n_").

Desse modo o método _split_ ,em uma expressão regular com _/\r?\n/_ permite separar os dois modos, com "_\n_"e "_\r\n_" enre linhas.

```js
function parseINI(texto) {
  var categorias = [];
  function novaCategoria(nome) {
	var categ = {nome: nome, fields: []};
	categorias.push(categ);
	return categ;
  }
  var categoriaAtual = novaCategoria("TOP");

  texto.split(/\r?\n/).forEach(function(linha) {
	var encontrados;
	if (/^\s*(;.*)?$/.test(linha))
	  return;
	else if (encontrados = linha.encontrados(/^\[(.*)\]$/))
	  categoriaAtual = novaCategoria(encontrados[1]);
	else if (encontrados = linha.encontrados(/^(\w+)=(.*)$/))
	  categoriaAtual.fields.push({nome: encontrados[1],
								   value: encontrados[2]});
	else
	  throw new Error("Linha '" + linha + "' is invalid.");
  });

  return categorias;
}
```

O código percorre cada linha no arquivo. Ele mantém um objeto "categoria atual", e quando encontra um diretiva normal, adiciona ela ao objeto. Quando encontra uma linha que inicia uma nova categoria, ela troca a categoria atual pela nova, para adicionar as diretivas seguintes. Finalmente, retorna um _array_ contendo todas as categorias que encontrou.

Observe o uso recorrente de _ˆ_ e _$_ para certificar-se que a expressão busca em toda a linha, não apenas em parte dela. Esquecer isso é um erro comum, que resulta um código que funciona mas retorna resultados estranhos para algumas entradas.

A expressão _/^\s*(;.*)?$/_ pode ser usada para testar linhas que podem ser ignoradas. Entende como funciona? A parte entre parênteses irá encontrar comentários e o _?_ depois certificará que também encontrará linhas apenas com espaços em branco.

O padrão _if (encontrados = texto.match(...))_ é parecido com o truque que foi usado como definição do _while_ antes. Geralmente não temos certeza se a expressão encontrará algo. Mas você só deseja fazer algo com o resultado se ele não for nulo, então você precisa testar ele antes. Para não quebrar a agradável sequencia de _ifs_ podemos definir o resultado a uma variável para o teste, e fazer a busca e testes em uma única linha.

## Caracteres internacionais

Devido a uma implementação inicial simplista e o fato que esta abordagem simplista mais tarde foi gravada em pedra como comportamento padrão, expressões regulares do JavaScript são um pouco estúpidas sobre caracteres que não parecem na língua inglesa. Por exemplo, "caracteres palavra", nesse contexto, atualmente significam apenas os 26 caracteres do alfabeto latino. Coisas como "é" ou "β", que definitivamente são caracteres de palavras, não encontrarão resultados com _\w_ (e serão encontradas com o marcador de letras maiúsculas _\W_).

Devido a um estranho acidente histórico, _\s_ (espaço em branco) é diferente, e irá encontrar todos os caracteres que o padrão Unicode considera como espaço em branco, como espaços sem quebra ou o separador de vogais do alfabeto Mongol.

Algumas implementações de expressões regulares em outras linguagens de programação possuem uma sintaxe para buscar conjuntos específicos de caracteres Unicode, como todas as maiúsculas, todos de pontuação, caracteres de controle ou semelhantes. Existem planos para adicionar esse suporte ao JavaScript, mas infelizmente parece que isso não acontecerá tão cedo.

## Uma ou mais ocorrências do padrão

Expressões regulares são objetos que representam padrões em _strings_. Eles usam sua própria sintaxe para expressar esses padrões.

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

Uma expressão regular possui um método _test_ para testar quando um padrão é encontrado em uma _string_, um método _exec_ que quando encontra um resultado retorna um _array_ com todos os grupos encontrados e uma propriedade _index_ que indica onde o resultado inicia.

_Strings_ possuem um método _match_ para testá-las contra uma expressão regular e um método _search_ para buscar por um resultado. O método _replace_  pode substituir resultados encontrados por um padrão. Como alternativa, uma função pode ser passada para montar o texto que será substituído de acordo com que foi achado.

Expressões regulares podem ter opções configuradas (_flags_), que são escritas após o fechamento da barra. A opção "_i_" faz a busca sem se importar se é maiúscula ou minúscula, a opção "_g_" faz a busca global, que, entre outras coisas, faz o método _replace_ substituir todas as ocorrências, em vez de só a primeira.

O construtor _RegExp_ pode ser usado para criar uma expressão regular dinâmica a partir de uma _string_.

Expressões regulares são uma ferramenta precisa mas com um manuseio estranho. Elas simplificarão muito algumas tarefas simples, mas rapidamente se tornarão inviáveis quando aplicadas a tarefas mais complexas. Saber quando usá-las é útil. Parte do conhecimento de saber __quando__ usá-las é o conhecimento de saber __como__ usá-las e quando desistir do seu uso e procurar uma abordagem mais simples.

## Exercícios

É quase inevitável que, no decorrer do trabalho, você irá ficar confuso e frustado por algum comportamento estranho de uma expressão regular. O que ajuda às vezes é colocar a sua expressão em uma ferramenta online como [debuggex.com](debuggex.com), para ver se a visualização corresponde à sua intenção inicial, e rapidamente ver como ela responde à várias _strings_ diferentes.

## Regexp golf

"Golf de Código" é um termo usado para o jogo de tentar escrever um programa com o menor número de caracteres possível. Parecido, o regexp golf é a prática de escrever pequenas expressões regulares para achar um determinado padrão (e apenas esse padrão).

Escreva uma expressão regular que testa quando qualquer das _sub-strings_ dadas ocorre em um texto. A expressão regular deverá achar apenas _strings_ contendo uma das _sub-strings_ dadas. Não se preocupe com limites de palavras a não ser que seja explicitamente pedido. Quando a sua expressão funcionar, veja se consegue fazê-la menor.

	"car" e "cat"
	"pop" e "prop"
	"ferret", "ferry", e "ferrari"
	Qualquer palavra terminando em "ious"
	Um espaço em branco seguido por um ponto, vírgula, dois-pontos, ou ponto-e-vírgula
	Uma palavra com mais de seis letras
	Uma palavra sem a letra "e"

Consulte a tabela no capítulo Sumário para achar algo rapidamente.
Teste cada solução encontrada com alguns testes com _strings_.

```js
// Fill in the regular expressions

verify(/.../,
	   ["my car", "bad cats"],
	   ["camper", "high art"]);

verify(/.../,
	   ["pop culture", "mad props"],
	   ["plop"]);

verify(/.../,
	   ["ferret", "ferry", "ferrari"],
	   ["ferrum", "transfer A"]);

verify(/.../,
	   ["how delicious", "spacious room"],
	   ["ruinous", "consciousness"]);

verify(/.../,
	   ["bad punctuation ."],
	   ["escape the dot"]);

verify(/.../,
	   ["hottentottententen"],
	   ["no", "hotten totten tenten"]);

verify(/.../,
	   ["red platypus", "wobbling nest"],
	   ["earth bed", "learning ape"]);


function verify(regexp, yes, no) {
  // Ignore unfinished tests
  if (regexp.source == "...") return;
  yes.forEach(function(s) {
	if (!regexp.test(s))
	  console.log("Failure to match '" + s + "'");
  });
  no.forEach(function(s) {
	if (regexp.test(s))
	  console.log("Unexpected match for '" + s + "'");
  });
}
```

## Estilo de aspas

Imagine que você escreveu um texto e usou aspas simples por toda parte. Agora você deseja substituir todas que realmente possuem algum texto com aspas duplas, mas não as usadas em contrações de texto com _aren't).

Pense em um padrão que faça distinção entre esses dois usos de aspas e faça uma chamada que substitua apenas nos lugares apropriados.

```js
var text = "'I'm the cook,' he said, 'it's my job.'";
// Altere esta chamada
console.log(text.replace(/A/, "B"));
// → "I'm the cook," he said, "it's my job."
```

**Dicas**

A solução mais óbvia é substituir apenas as aspas que não estão cercadas de caracteres de palavra. A primeira expressão vem à mente é _/\W'\W/_, mas é preciso cuidado para lidar com o início da _string_ corretamente. Isso pode ser feito usando os marcadores "_ˆ_" e "_$_", como em _/(\W|^)'(\W|$)/_.

### Novamente números

Séries de dígitos podem ser usados pela agradável expressão regular _/\d+/_.

Escreva uma expressão que encontre (apenas) números no estilo JavaScript. Isso significa que precisa suportar um sinal de menor ou maior, opcional, na frente do número, um ponto decimal e a notação exponencial —5e-3 ou 1E10—, novamente com o sinal opcional na frente dele.

```js
// Preencha esta expressão regular
var number = /^...$/;

// Tests:
["1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4",
 "1e+12"].forEach(function(s) {
  if (!number.test(s))
	console.log("Falhou em achar '" + s + "'");
});
["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5",
 "."].forEach(function(s) {
  if (number.test(s))
	console.log("Aceitou erroneamente '" + s + "'");
});
```

Dicas

Primeiro, não esqueça da barra invertida em frente ao ponto.

Achar o sinal opcional na frente do número, como na frente do exponencial, pode ser feito com _[+\-]?_ ou _(+|-|)_ (mais, menos ou nada).

A parte mais complicada deste exercício provavelmente é a dificuldade de achar "5." e ".5"  sem achar também o ".". Para isso, achamos que a melhor solução é usar o operador "|" para separar os dois casos, um ou mais dígitos opcionalmente seguidos por um ponto e zero ou mais dígitos, ou um ponto seguido por um ou mais dígitos.

Finalmente, fazer o "e" _case-insensitive_, ou adicional a opção "i" à expressão regular ou usar "_[eE]_ ".
