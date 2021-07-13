Capítulo 9

# Expressões Regulares

> "Algumas pessoas, quando confrontadas com um problema, pensam "Eu sei, terei que usar expressões regulares." Agora elas têm dois problemas.
>
> — Jamie Zawinski

> "Yuan-Ma disse, 'Quando você serra contra o sentido da madeira, muita força será necessária. Quando você programa contra o sentido do problema, muito código será necessário'
>
> — Mestre Yuan-Ma, The Book of Programming

A maneira como técnicas e convenções de programação sobrevivem e se disseminam, ocorrem de um modo caótico, evolucionário. Não é comum que a mais agradável e brilhante vença, mas sim aquelas que funcionam bem com o nicho ou as que aparentam ser integradas com outra tecnologia de sucesso.

Neste capítulo, discutiremos uma dessas tecnologias, expressões regulares. Expressões regulares são um modo de descrever padrões nos dados de uma *string*. Eles formam uma pequena linguagem à parte, que inclui JavaScript e várias outras linguagens e sistemas.

Expressões regulares são ao mesmo tempo, estranhas e extremamente úteis. Sua sintaxe é enigmática é a interface que o
JavaScript oferece para elas é desajeitada. Mas elas são uma ferramenta poderosa utilizada para inspecionar e processar *strings*. A compreensão adequada das expressões regulares fará de você um programador mais eficaz.  

----

## Criando uma Expressão Regular

Uma expressão regular é um tipo de objeto. Ele pode ser construído com o construtor *RegExp* ou escrito como um valor literal, encapsulando o padrão com o caractere barra ('/').

```js
let re1 = new RegExp("abc");
let re2 = /abc/;
```

Ambos os objetos acima representam o mesmo padrão: um caractere "a" seguido de um caractere "b" e depois de um caractere "c".

Ao usarmos o construtor *RegExp*, o padrão é escrito como uma *string* normal, de modo que as regras normais se aplicam para barras invertidas.

A segunda notação, onde o padrão está entre barras, trata as barras invertidas de maneira um pouco diferente. Primeiro, como uma barra encerra o padrão, é necessário colocarmos uma barra invertida antes de inserirmos qualquer barra que queremos que faça parte do padrão. Além disso, as barras invertidas que não pertencem a códigos de caracteres especiais (como \n) serão preservadas ao invés de serem ignoradas, pois fazem parte de *strings* e alteram o significado do padrão. Alguns caracteres, como sinais de interrogação (?) e sinais de soma (+), possuem um significado especial em expressões regulares e devem ser precedidos por barras invertidas para representarem o próprio caractere, e não o comando de expressão regular.

```js
let eighteenPlus = /eighteen\+/;
```

## Teste de correspondências

Expressões regulares possuem vários métodos. O mais simples é o *test*. Se você o passa como uma *string*, ele retorna um booleano que informa se a *string* mantém uma correspondência do padrão na expressão.

```js
console.log( /abc/.test("abcde") );
// → true
console.log( /abc/.test("12345") );
// → false
```

Uma expressão regular que contenha apenas caracteres simples, representa essa mesma sequência de caracteres. Se "abc" existe em qualquer lugar (não apenas no início), *test* retornará verdadeiro.

## Encontrando um conjunto de caracteres

Saber quando uma *string* contém "abc" pode muito bem ser feito usando a função *indexOf*. A diferença das expressões regulares é que elas nos permite usar padrões mais complexos.

Digamos que queremos encontrar qualquer número. Em uma expressão regular, colocar um conjunto de caracteres entre colchetes ("[]") faz com que a expressão encontre qualquer dos caracteres dentro dos colchetes.

Ambas as expressões abaixo encontram todas as *strings* que contem um dígito numérico.

```js
console.log( /[0123456789]/.test("ano 1992") );
// → true
console.log( /[0-9]/.test("ano 1992") );
// → true
```

Dentro de colchetes, um hífen ("-") entre dois caracteres pode ser usado para indicar um conjunto de caracteres, onde a ordem é determinada pelo número *Unicode* do caractere. Os caracteres de "0" a "9" contém todos os dígitos (códigos 48 a 57), então [0-9] e encontra qualquer dígito.

Existem alguns grupos de caracteres de uso comum, que já possuem atalhos inclusos na sintaxe de expressões regulares. Dígitos são um dos conjuntos que você pode escrever usando um atalho, barra invertida seguida de um "d" minúsculo (\d), com o mesmo significado que [0-9].

	- \d	caracteres numéricos
	- \w	caracteres alfanuméricos ("letras")
	- \s	espaços em branco (espaço, tabs, quebras de linha e similares)
	- \D	caracteres que não são dígitos
	- \W	caracteres não alfanuméricos
	- \S	caracteres que não representam espaços
	- . (ponto)	todos os caracteres, exceto espaços


Então você pode registrar um formato de data e hora como "30/01/2003 15:20" com a seguinte expressão:

```js
let dataHora = /\d\d\/\d\d\/\d\d\d\d \d\d:\d\d/;
console.log( dataHora.test("30/01/2003 15:20") );
// → true
console.log( dataHora.test("30/jan/2003 15:20") );
// → false
```

Parece confuso, certo? Muitas barras invertidas sujando a expressão e dificultando compreender qual é o padrão procurado. Veremos mais a frente uma versão melhorada desta expressão.

Estes marcadores de categoria também podem ser usados dentro de colchetes, então [\d.] significa qualquer dígito ou caractere de ponto final. Mas o próprio ponto final, entre colchetes, perde seu significado especial. O mesmo vale para outros caracteres especiais, como +.

Para "inverter" um conjunto de caracteres e buscar tudo menos o que você escreveu no padrão, você pode colocar um acento circunflexo ("^") após abrir colchetes.

```js
let naoBinario = /[^01]/;
console.log( naoBinario.test("01101") );
// → false
console.log( naoBinario.test("01201") );
// → true
```

## Partes repetidas em um padrão

Agora nós já sabemos como encontrar um dígito, mas e se o que queremos é encontrar um número, uma sequência de um ou mais dígitos?

Quando colocamos um sinal de mais ("+") depois de algo em uma expressão regular, indicamos que pode existir mais de um. Então /\d+/ encontra um ou mais dígitos.

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

O asterisco ("*") tem um significado similar, mas também permite não encontrar o padrão. Então, algo colocado com um asterisco depois dele, não impede um padrão de ser achado, ele apenas retornará zero resultados se não conseguir encontrar algum texto adequado.

Uma interrogação ("?") define uma parte do padrão de busca como "opcional", o que significa que ele pode ocorrer zero vezes ou apenas uma vez. No exemplo a seguir, é permitido que ocorra o caractere "u", mas o padrão também é encontrado quando ele está ausente.

```js
var neighbor = /neighbou?r/;
console.log(neighbor.test("neighbour"));
// → true
console.log(neighbor.test("neighbor"));
// → true
```

Para permitir que um padrão ocorra um número definido de vezes, use chaves ("{}"). Colocando {4} depois de um elemento do padrão, requer que ele ocorra exatamente 4 vezes. Da mesma maneira, {2,4} é utilizado para definir que ele deve aparecer no mínimo 2 vezes e no máximo 4.

Aqui está outra versão do padrão de data e hora que permite dias, meses e horas com um ou mais dígitos. Também são mais legíveis:

```js
let dataHora = /\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}/;
console.log( dataHora.test("30/1/2003 8:45") );
// → true
```

Também é possível deixar em aberto o número mínimo ou máximo de ocorrências, omitindo o número após a vírgula. Então {5,} significa que deve ocorrer cinco ou mais vezes.

## Agrupando subexpressões

Para usar um operador como "*" ou "+" em mais de um caractere por vez, é necessário o uso de parênteses. Um pedaço de uma expressão regular que é delimitado por parênteses conta como uma única unidade, assim como os operadores aplicados a esse pedaço delimitado.

```js
let cartoonCrying = /boo+(hoo+)+/i;
console.log( cartoonCrying.test("Boohoooohoohooo") );
// → true
```

O terceiro e segundo "+" aplicam-se apenas ao segundo *o* em *boo hoo*, respectivamente.  O terceiro "+" se aplica a todo grupo (hoo+), combinando uma ou mais sequências como essa.

O "i" no final da expressão do exemplo acima faz com que a expressão regular seja case-insensitive, permitindo-a encontrar a letra maiúscula "B" na *string* dada, mesmo que a descrição do padrão tenha sido feita em letras minúsculas.

## Resultados e grupos

O método *test* é a maneira mais simples de encontrar correspondências de uma expressão regular. Ela apenas informa se foi encontrado algo e nada mais. Expressões regulares também possuem o método *exec* (executar), que irá retornar *null* quando nenhum resultado for encontrado, e um objeto com informações se encontrar.

```js
let match = /\d+/.exec("one two 100");
console.log(match);
// → ["100"]
console.log(match.index);
// → 8
```
Um objeto retornado pelo método *exec* possui um index de propriedades que informa aonde na *string* o resultado encontrado se inicia. Além disso, o objeto parece (e de fato é) um *array* de *strings*, cujo primeiro elemento é a *string* que foi encontrada. No exemplo anterior, esta é a sequência de dígitos que estávamos procurando.

Valores *string* possuem um método que se comporta de maneira semelhante.

```js
console.log("one two 100".match(/\d+/));
// → ["100"]
```

Quando uma expressão regular contém expressões agrupadas entre parênteses, o texto que corresponde a esses grupos também aparece no *array*. O primeiro elemento sempre é todo o resultado, seguido pelo resultado do primeiro grupo entre parênteses, depois o segundo grupo e assim em diante.

```js
let textoCitado = /'([^']*)'/;
console.log( textoCitado.exec("ela disse 'olá'") );
// → ["'olá'", "olá"]
```

Quando um grupo não termina sendo achado (se por exemplo, possui um sinal de interrogação depois dele), seu valor no array de resultado será undefined. Do mesmo modo, quando um grupo é achado várias vezes, apenas o último resultado encontrado estará no array.

```js
console.log(/bad(ly)?/.exec("bad"));
// → ["bad", undefined]
console.log(/(\d)+/.exec("123"));
// → ["123", "3"]
```

Grupos podem ser muito úteis para extrair partes de uma *string*. Por exemplo, podemos querer não apenas verificar quando uma *string* contém uma data, mas também extraí-la, e construir um objeto que a representa. Se adicionarmos parênteses em volta do padrão de dígitos, poderemos selecionar a data no resultado da função *exec*.

Mas antes, um pequeno desvio, na qual discutiremos a maneira integrada de representar os valores de data e hora em JavaScript.

## O tipo *data*

O JavaScript possui uma classe padrão para representar datas, ou melhor, pontos no tempo. Ele é chamado *Date*. Se você simplesmente criar uma data usando *new*, terá a data e hora atual.

```js
console.log( new Date() );
// → Mon Nov 13 2017 16:19:11 GMT+0300 (BRT)
```

Também é possível criar um objeto para uma hora específica

```js
console.log( new Date(2014, 6, 29) );
// → Tue Jul 29 2014 00:00:00 GMT-0300 (BRT)
console.log( new Date(1981, 6, 29, 18, 30, 50) );
// → Wed Jul 29 1981 18:30:50 GMT-0300 (BRT)
```

O JavaScript utiliza uma convenção onde a numeração dos meses se inicia em zero (então Dezembro é 11), mas os dias iniciam-se em um. É bem confuso e bobo, então, tenha cuidado.

Os últimos quatro argumentos (horas, minutos, segundos e milissegundos) são opcionais, e assumem o valor de zero se não forem fornecidos.

Internamente, objetos do tipo data são armazenados como o número de milissegundos desde o início de 1970, no fuso horário UTC. Ele segue uma convenção definida pela "hora do Unix", que foi inventada nessa época. Você pode usar números negativos para tempos anteriores a 1970. Usar o método *getTime* em uma data retorna esse número, e ele é bem grande, como deve imaginar.

```js
console.log( new Date(2014, 2, 21).getTime() );
// → 1395370800000
console.log( new Date( 1395370800000 ) );
// → Fri Mar 21 2014 00:00:00 GMT-0300 (BRT)
```

Quando fornecemos apenas um argumento ao construtor do *Date*, ele é tratado como se fosse um número de milissegundos. Você pode obter a contagem atual de milissegundos criando um novo objeto *Date* usando o método *getTime* ou chamando a função *Date.now*.

Objetos *Date* possuem métodos como *getFullYear*, *getMonth*, *getDate*, *getHours*, *getMinutes* e *getSeconds* para extrair seus componentes. Além de *getFullYear*, também há *getYear* que retorna o ano menos 1900 (98 ou 119) o que é quase inútil.

Então agora, ao colocarmos parênteses em volta das partes que nos interessam, podemos facilmente extrair uma data de uma *string*.

```js
function buscaData(string) {
  let [_, month, day, year] = 
  /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(string);
  return new Date(year, month -1, day);
}
console.log( buscaData("21/1/2014") );
// → Fri Feb 21 2014 00:00:00 GMT-0300 (BRT)
```
O _ (underline) é ignorado e usado apenas para pular o elemento completo de correspondência no *array* retornado por *exec*.

## Limites de palavra e *string*

Infelizmente, a função *buscaData* acima também irá extrair a data absurda 00-1-3000 da *string* "100-1-30000", um resultado pode acontecer em qualquer lugar da *string* fornecida, então, nesse caso, vai encontrar no segundo caractere e terminar no penúltimo.

Se quisermos nos assegurar que a busca seja em todo a *string*, podemos adicionar os marcadores  "^" e "$". O acento circunflexo corresponde ao início da *string* fornecida, enquanto a sifrão  corresponde ao final dela. Então /^\d+$/ encontra apenas em uma *string* feita de um ou mais dígitos, /^!/ encontra qualquer *string* que começa com sinal de exclamação e /x^/ não corresponde a nenhuma *string* (não pode haver um x antes do início da *string*).

Se, por outro lado, queremos ter certeza que a data inicia e termina no limite da palavra, usamos o marcador \b. Um limite de palavra pode ser no início ou fim de uma *string* ou qualquer ponto nela em que tenha um caractere de palavra de um lado e um caractere que não seja uma palavra de outro (como em \w).

```js
console.log( /cat/.test("concatenate"));
// → true
console.log( /\bcat\b/.test("concatenate"));
// → false
```

Note que esses marcadores de limite não cobrem nenhum caractere real, eles apenas asseguram que a expressão regular corresponda apenas quando uma certa condição for mantida no lugar onde ele aparece no padrão.

## Padrões de escolha

Digamos que queremos saber se um pedaço do texto contém não apenas um número, mas um número seguido por uma das palavras "porco", "vaca", "galinha" ou seus plurais também.

Podemos escrever três expressões regulares, e testar cada uma, mas existe uma maneira mais simples. O caractere pipe ( | ) indica uma opção entre o padrão à esquerda ou a direita. Então podemos fazer:

```js
let contagemAnimal = /\b\d+ (porco|vaca|galinha)s?\b/;
console.log( contagemAnimal.test("15 porcos") );
// → true
console.log( contagemAnimal.test("15 porcosgalinhas"));
// → false
```

Parênteses podem ser usados para limitar a que parte do padrão que o pipe ( | ) se aplica, e você pode colocar vários desses operadores lado a lado para expressar uma escolha entre mais de dois padrões.

## O mecanismo de correspondência

Conceitualmente, quando usamos *exec* ou *test*, o mecanismo de expressão regular busca uma correspondência em sua *string*, tentando corresponder à expressão do início da *string* primeiro, depois do segundo caractere e assim por diante, até encontrar uma correspondência ou chegar ao fim da *string*. Ele retornará a primeira correspondência que pode ser encontrada ou não encontrará nenhuma correspondência.

Para fazer a correspondência atual, o mecanismo trata a expressão regular como um diagrama de fluxo. Este é o diagrama para a expressão do conjunto de animais do exemplo anterior:

![O mecanismo de procura](../img/re_porcogalinhas.svg)

Uma *string* corresponde à expressão se um caminho do início (esquerda) até o final (direita) do diagrama puder ser encontrado, com uma posição inicial e final correspondente, de modo que cada vez que passar em uma caixa, verificamos que a posição atual na sequência corresponde ao elemento descrito nela, e, para os elementos que correspondem caracteres reais (menos os limites de palavra), continue no fluxo das caixas.

Portanto, se tentarmos combinar "os 3 porcos" da posição 4, nosso progresso através do fluxograma ficaria assim:

- Na posição 4, existe um limite de palavra, então passamos a primeira caixa;
- Ainda na posição 4, encontramos um dígito, então também podemos passar a segunda caixa;
- Na posição 5, poderíamos voltar para antes da segunda caixa (dígitos), ou avançar através da caixa que contém um único caractere de espaço. Há um espaço aqui, não um dígito, por isso escolhemos o segundo caminho;
- Estamos agora na posição 6 (o início de "porcos") e na divisão entre três caminhos do diagrama. Nós não temos "vaca" ou "galinha" aqui, mas nós temos "porco", por isso tomamos esse caminho;
- Na posição 9, depois da divisão em três caminhos, poderíamos também ignorar o "s" e ir direto para o limite da palavra, ou achar o "s" primeiro. Existe um "s", não um limite de palavra, então passamos a caixa "s";
- Estamos na posição 10 (final da string) e só podemos achar um limite de palavra. O fim de uma *string* conta como um limite de palavra, de modo que passamos através da última caixa e combinamos com sucesso a *string*.

## Retrocedendo

A expressão regular /\b([01]+b|\d+|[\da-f]h)\b/ encontra um número binário seguido por um "b", um número decimal, sem um caractere de sufixo, ou um número hexadecimal (de base 16, com as letras "a" a "f" para os algarismos de 10 a 15), seguido por um "h". Este é o diagrama equivalente:

![Retrocedendo](../img/re_number.svg)

Ao buscar esta expressão, muitas vezes o ramo superior será percorrido, mesmo que a entrada não contenha realmente um número binário. Quando busca a *string* "103", é apenas no "3" que torna-se claro que estamos no local errado. A *string* é buscada não apenas no ramo que se está executando.

É o que acontece se a expressão retroage. Quando entra em um ramo, ela guarda em que ponto aconteceu (nesse caso, no início da *string*, na primeira caixa do diagrama), então ela retrocede e tenta outro ramo do diagrama se o atual não encontra nenhum resultado. Então para a *string* "103", após encontrar o caractere "3", ela tentará o segundo ramo do número decimal. E este, encontra um resultado.

Quando mais de um ramo encontra um resultado, o primeiro (na ordem em que foi escrito na expressão regular) será considerado.

Retroceder acontece também, de maneiras diferentes, quando buscamos por operadores repetidos. Se buscarmos /^.*x/  em "abcxe", a parte ".*" tentará achar toda a *string*. Depois, tentará achar apenas o que for seguido de um "x", e não existe um "x" no final da *string*. Então ela tentará achar desconsiderando um caractere, e outro, e outro. Quando acha o "x", sinaliza um resultado com sucesso, da posição 0 até 4.

É possível escrever expressões regulares que fazem muitos retrocessos. O Problema ocorre quando um padrão encontra um pedaço da *string* de entrada de muitas maneiras. Por exemplo, se confundimos e escrevemos nossa expressão regular para achar binários e números assim /([01]+)+b/.

![retrocessos](../img/re_slow.svg)

Ela tentará achar séries de zeros sem um "b" após elas, depois irá percorrer o circuito interno até passar por todos os dígitos. Quando perceber que não existe nenhum "b", retorna uma posição e passa pelo caminho de fora mais uma vez, e de novo, retrocedendo até o circuito interno mais uma vez. Continuará tentando todas as rotas possíveis através destes dois *loops*, em todos os caracteres. Para *strings* mais longas o resultado demorará praticamente para sempre.


## O método *replace*

*Strings* possuem o método *replace*, que pode ser usado para substituir partes da *string* com outra *string*.

```js
console.log("papa".replace("p", "m"));
// → mapa
```

O primeiro argumento também pode ser uma expressão regular; nesse caso,  a primeira correspondência da expressão regular será substituída. Quando a opção "g" ("global") é adicionada à expressão regular, todas as correspondências na string serão substituídas, não apenas a primeira.

```js
console.log("Borobudur".replace(/[ou]/, "a"));
// → Barobudur
console.log("Borobudur".replace(/[ou]/g, "a"));
// → Barabadar
```

Teria sido sensato se a escolha entre substituir uma correspondência ou todas as correspondências fosse feita por meio de um argumento adicional *replace*, ou fornecendo um método diferente *replaceAll*. Mas infelizmente a escolha depende de uma propriedade de expressão regular. 

A verdadeira utilidade do uso de expressões regulares com o método *replace* é a opção de fazer referências aos grupos combinados através da *string*. Por exemplo, se temos uma *string* longa com nomes de pessoas, uma por linha, no formato "Sobrenome, Nome" e queremos trocar essa ordem e remover a vírgula, para obter o formato "Nome Sobrenome", podemos usar o seguinte código:

```js
console.log("Lisvok, Barbara\nMcCarthy, John\nWadler, Phillip".replace(/([\w ]+), ([\w ]+)/g, "$2 $1"));
// → Barbara Lisvok
//   John McCarthy
//   Philip Wadler
```

O "$1" e "$2" na *string* de substituição referem-se as partes entre parênteses no padrão. "$1" será substituído pelo texto encontrado no primeiro grupo entre parênteses e "$2" pelo segundo, e assim em diante, até "$9". A correspondência inteira pode ser referenciada com $&.

Também é possível passar uma função, em vez de uma *string* no segundo argumento do método *replace*. Para cada substituição, a função será chamada com os grupos encontrados (bem como toda a correspondência) como argumentos, e o valor retornado pela função será inserido na nova *string*.

Aqui está um pequeno exemplo:

```js
let s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)\b/g,
  str => str.toUpperCase()));
// → the CIA and FBI
```

E outro exemplo mais interessante:

```js
let stock = "1 lemon, 2 cabbages, and 101 eggs";
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

Ele pega a *string*, encontra todas as ocorrências de um número seguido por uma palavra alfanumérica e retorna uma nova *string* onde em cada ocorrência é diminuído por um.

O grupo (\d+) finaliza o argumento *amount* da função e o (\w+) limita a unidade. A função converte o valor em um número, desde que encontrado, \d+ faz ajustes caso reste apenas um ou zero.

## Quantificador / Greed

É possível usar o método *replace* para escrever uma função que remove todos os comentários de um pedaço de código JavaScript. Veja uma primeira tentativa:

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

A parte antes do operador ou corresponde a dois caracteres de barra seguidos por qualquer número de caracteres que não sejam de nova linha. A parte dos comentários em várias linhas é mais envolvente. Usamos [^](qualquer caractere que não esteja no conjunto vazio de caracteres) como uma forma de corresponder a qualquer caractere. Não podemos simplesmente usar um ponto final aqui porque os comentários de bloco podem continuar em uma nova linha e o caractere de ponto final não corresponde a caracteres de uma nova linha.

Mas o resultado da última linha parece errado. Por quê?

A parte "[^]*" da expressão, como foi escrita na seção "Retrocedendo", acima, encontrará primeiro tudo que puder e depois, se falhar, volta atrás e tenta mais uma vez a partir daí. Nesse caso, primeiro tentamos combinar no resto da *string* e depois continuamos a partir daí. Ele encontrará uma ocorrência de "*/" depois volta quatro caracteres e acha um resultado. Isto não era o que desejávamos, queríamos um comentário de uma linha, para não ir até o final do código e encontrar o final do último comentário do bloco.

Devido a esse comportamento, dizemos que os operadores de repetição em expressões regulares ('+', '*', e '{}') são gananciosos. Por padrão, eles quantificam, significa que eles encontram o que podem e retrocedem a partir daí. Se você colocar uma interrogação depois deles, eles se tornam _non_greedy_, e começam encontrando o menor grupo possível e o resto que não contenha o grupo menor.

E é exatamente o que queremos nesse caso. Com o asterisco encontramos os grupos menores que tenham "*/" no fechamento, encontramos um bloco de comentários e nada mais.

```js
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[\w\W]*?\*\//g, "");
}
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1 + 1
```
Muitos bugs em programas de expressão regular podem ser rastreados até o uso não intencional de um operador ganancioso, onde um _non_greedy_ funcionaria melhor. Ao usar um operador de repetição, considere a variante _non_greedy_ primeiro.

## Criando objetos RegExp dinamicamente

Existem casos onde você pode não saber o padrão exato que você precisa quando escreve seu código. Digamos que você queira buscar o nome de um usuário em um pedaço de texto e colocá-lo entre caracteres "_" para destacá-lo. O nome será fornecido apenas quando o programa estiver sendo executado, então não podemos usar a notação de barras para criar nosso padrão.

Mas podemos construir uma _string_ e usar o construtor _RegExp_ para isso. Por exemplo:

```js
let name = "harry";
let text = "Harry is a suspicious character.";
let regexp = new RegExp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// → _Harry_ is a suspicious character.
```

Ao criar os marcos de limite "\b", usamos duas barras invertidas, porque estamos escrevendo-os em uma *string* normal, não uma expressão regular com barras. O segundo argumento para o *RegExp* construtor contém as opções com a expressão regular - neste caso, o "gi" para global não diferencia maiúsculas de minúsculas.

Mas e se o nome for "dea+hl[]rd" porque o nosso usuário é um adolescente nerd? Isso irá gerar uma falsa expressão regular, por conter caracteres comando, que irá gerar um resultado estranho.

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

O método *indexOf* em *strings* não pode ser chamado com uma expressão regular. Mas existe um outro método, *search*, que espera como argumento uma expressão regular. Por exemplo, o *indexOf* que retorna o índice do primeiro resultado encontrado ou -1 se não encontra.

```js
console.log("  word".search(/\S/));
// → 2
console.log("    ".search(/\S/));
// → -1
```

Infelizmente, não existe um modo de indicar onde a busca deve começar, com um índice (como o segundo argumento de *indexOf*), o que seria muito útil.

## A propriedade *lastIndex*

O método *exec* também não possui um modo conveniente de iniciar a busca a partir de uma determinada posição. Mas ele fornece um método não muito prático.

Expressões regulares possuem propriedades (como *source* que contém a *string* que originou a expressão). Uma dessas propriedades, *lastIndex*, controla, em algumas circunstâncias, onde a busca começará.

Essas circunstâncias são que a expressão regular precisa ter a opção "global" (g) ou sticky (y)  habilitada no método *exec*. Novamente, deveria ser da mesma maneira que permitir um argumento extra para o método *exec*, mas coesão não é uma característica que define a sintaxe de expressões regulares em JavaScript

```js
let global = /abc/g;
console.log(global.exec("xyz abc"));
// → ["abc"]
let sticky = /abc/y;
console.log(sticky.exec("xyz abc"));
// → null
```

Quando usamos uma expressão regular global para múltiplas chamadas ao método *exec*, esta mudança da propriedade *lastIndex* pode causar problemas, sua expressão pode iniciar por acidente em um índice deixado na ultima vez que foi executada.

```js
let digit = /\d/g;
console.log(digit.exec("here it is: 1"));
// → ["1"]
console.log(digit.exec("and now: 1"));
// → null
```

Outro efeito interessante da opção global é que ela muda a maneira como o método *match* funciona em uma *string*. Quando chamada com uma expressão global, em vez de retornar um array semelhante ao retornado pelo *exec*, *match* encontrará todos os resultados do padrão na *string* e retornará um array contendo todas as *strings* encontradas.

```js
console.log("Banana".match(/an/g));
// → ["an", "an"]
```

Então tenha cuidado com expressões regulares globais. Use-as nos casos em que são necessárias, como em *replace* ou em lugares onde você deseja usar explicitamente o *lastIndex* que normalmente são os únicos lugares que você pode querer utilizá-las.

## Loop sobre correpondências

Um padrão comum é buscar todas as ocorrências de um padrão em uma *string*, com acesso a todos os grupos encontrados e ao índice onde foram encontrados, usando *lastIndex* e *exec*.

```js
let input = "A string with 3 numbers in it... 42 and 88.";
let number = /\b\d+\b/g;
let match;
while (match = number.exec(input)) {
  console.log("Found", match[0], "at", match.index);
}
// → Found 3 at 14
//   Found 42 at 33
//   Found 88 at 40
```

Usa-se o fato que o valor de uma expressão de definição ('=') é o valor assinalado. Então usando-se `match = re.exec(input)` como a condição no bloco `while`, podemos buscar no início de cada iteração.

## Analisando um arquivo .ini

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

As regras exatas desse formato (que é um formato muito usado, chamado arquivo .ini) são as seguintes:

- Linhas em branco e linhas iniciadas com ponto e vírgula são ignoradas;
- Linhas entre colchetes "[ ]" iniciam uma nova seção;
- Linhas contendo um identificador alfanumérico seguido por um caractere = adicionam uma configuração à seção atual;
- Qualquer outra coisa é inválida.

Nossa tarefa é converter uma *string* como essa em um *array* de objetos, cada uma com um nome e um *array* de pares nome/valor. Precisaremos de um objeto para cada seção e outro para as configurações de seção.

Já que o formato precisa ser processado linha a linha, dividir em linhas separadas é um bom começo. Nos vimos o método *split* no capítulo 4. Entretanto alguns sistemas operacionais não usam apenas um caractere de nova linha para separar linhas, mas um caractere de retorno seguido por um de nova linha ("_\r\n_").

Desse modo o método _split_ ,em uma expressão regular com _/\r?\n/_ permite separar os dois modos, com "_\n_"e "_\r\n_" entre linhas.

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

O código percorre as linhas do arquivo e constrói um objeto. As propriedades na parte superior são armazenadas diretamente nesse objeto, enquanto as propriedades encontradas nas seções são armazenadas em um objeto de seção separado. A *section* de conexão aponta para o objeto da seção atual.

Existem dois tipos de linhas significativas - cabeçalhos de seção ou linhas de propriedade. Quando uma linha é uma propriedade regular, ela é armazenada na seção atual. Quando é um cabeçalho de seção, um novo objeto de seção é criado e a *section* é definida para apontar para ele.

Observe o uso recorrente de *ˆ* e *$* para certificar-se que a expressão busca em toda a linha, não apenas em parte dela. Esquecer isso é um erro comum, que resulta um código que funciona mas retorna resultados estranhos para algumas entradas, o que pode ser um bug difícil de encontrar.

O padrão _if (encontrados = texto.match(...))_ é parecido com o truque que foi usado como definição do *while* antes. Geralmente não temos certeza se a expressão encontrará algo. Mas você só deseja fazer algo com o resultado se ele não for nulo, então você precisa testar ele antes. Para não quebrar a agradável sequência de *else if* atribuímos o resultado da correspondência a uma conexão e imediatamente usamos essa atribuição como teste para a declaração de *if*.

Se uma linha não for um cabeçalho de seção ou uma propriedade, a função verifica se é um comentário ou uma linha vazia usando a expressão `/^\s*(;.*)?$/`. Você vê como isso funciona? A parte entre os parênteses corresponderá aos comentários e o "?" se certificará de que também corresponda às linhas que contêm apenas espaços em branco. Quando uma linha não corresponde a nenhuma das form esperadas, a função resulta em uma exceção.

## Caracteres internacionais

Devido a uma implementação inicial simplista e o fato que esta abordagem simplista mais tarde foi gravada em pedra como comportamento padrão, expressões regulares do JavaScript são um pouco estúpidas sobre caracteres que não parecem na língua inglesa. Por exemplo, "caracteres palavra", nesse contexto, atualmente significam apenas os 26 caracteres do alfabeto latino. Coisas como "é" ou "β", que definitivamente são caracteres de palavras, não encontrarão resultados com _\w_ (e serão encontradas com o marcador de letras maiúsculas _\W_).

Devido a um estranho acidente histórico, _\s_ (espaço em branco) é diferente, e irá encontrar todos os caracteres que o padrão Unicode considera como espaço em branco, como espaços sem quebra ou o separador de vogais do alfabeto Mongol.

Outro problema é que, por padrão, as expressões regulares funcionam em unidades de código, conforme discutido no Capítulo 5, e não em caracteres reais. Isso significa que os caracteres compostos por duas unidades de código se comportam de maneira estranha.

```js
console.log(/🍎{3}/.test("🍎🍎🍎"));
// → false
console.log(/<.>/.test("<🌹>"));
// → false
console.log(/<.>/u.test("<🌹>"));
// → true

```

O problema é que o emoji 🍎 na primeira linha é tratado como duas unidades de código e a {3} parte é aplicada apenas à segunda. Da mesma forma, o ponto corresponde a uma única unidade de código, não aos dois que compõem o emoji que da rosa🌹.

Você deve adicionar uma opção "*u*" (para o *Unicode*) à sua expressão regular que ele trate esses caracteres adequadamente. O comportamento incorreto permanece como padrão, infelizmente, porque alter-lo pode causar problemas para o código existente que depende dele.

Embora isso tenha sido apenas padronizado e, no momento da escrita, não seja amplamente suportado ainda, é possível usar "*\p*" em uma expressão regular (que deve ter a opção Unicode habilitada) para combinar todos os caracteres aos quais o padrão Unicode atribui à determinada propriedade.

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

O Unicode define várias propriedades úteis, embora encontrar aquela que você precisa nem sempre seja relevante. Você pode usar `\p{Property=Value}` para que corresponda a qualquer caractere que tenha o valor fornecido para essa propriedade. Se o nome da propriedade for deixado de fora, como em `\p{Name}`, o nome será considerado uma propriedade binária, como *Alphabetic* ou uma categoria, como *Number*.


## Sumário

Expressões regulares são objetos que representam padrões em *strings*. Eles usam sua própria sintaxe para expressar esses padrões.

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

Uma expressão regular possui um método *test* para testar quando um padrão é encontrado em uma *string*, um método *exec* que quando encontra um resultado retorna um *array* com todos os grupos encontrados e uma propriedade *index* que indica onde o resultado inicia.

*Strings* possuem um método *match* para testá-las contra uma expressão regular e um método *search* para buscar por um resultado. O método *replace*  pode substituir as correspondências de um padrão por uma string ou função de substituição.

Expressões regulares podem ter opções configuradas (*flags*), que são escritas após o fechamento da barra. A opção "*i*" faz a busca sem se importar se é maiúscula ou minúscula, a opção "*g*" faz a busca global, que, entre outras coisas, faz o método *replace* substituir todas as ocorrências, em vez de só a primeira. A opção "*y*" o torna aderente, o que significa que ele não pesquisará à frente e ignorará parte da *string* ao procurar por uma correspondência. A opção "*u*"  ativa o modo Unicode, que corrige uma série de problemas em torno do tratamento de caracteres que ocupam duas unidades de código.

Expressões regulares são uma ferramenta precisa que possui um manuseio estranho. Elas simplificarão muito algumas tarefas simples, mas rapidamente se tornarão inviáveis quando aplicadas a tarefas mais complexas. Saber quando usá-las é útil. Parte do conhecimento de saber __quando__ usá-las é o conhecimento de saber __como__ usá-las e quando desistir do seu uso e procurar uma abordagem mais simples.

## Exercícios

É quase inevitável que, no decorrer do trabalho, você irá ficar confuso e frustado por algum comportamento estranho de uma expressão regular. O que ajuda às vezes é colocar a sua expressão em uma ferramenta online como [debuggex.com](debuggex.com), para ver se a visualização corresponde à sua intenção inicial, e rapidamente ver como ela responde à várias *strings* diferentes.

## Regexp golf

"*Code Golf*" é um termo usado para o jogo de tentar escrever um programa com o menor número de caracteres possível. Parecido, o *regexp golf* é a prática de escrever pequenas expressões regulares para achar um determinado padrão, e apenas esse padrão.

Para cada um dos seguintes itens, escreva uma expressão regular que testa quando qualquer das *sub-strings* dadas que ocorrem em um *string*. A expressão regular deverá achar apenas *strings* contendo uma das *sub-strings* dadas. Não se preocupe com limites de palavras a não ser que seja explicitamente pedido. Quando a sua expressão funcionar, veja se consegue fazê-la ficar menor.

	1. "car" e "cat"
	2."pop" e "prop"
	3."ferret", "ferry", e "ferrari"
	4.Qualquer palavra terminando em "ious"
	5.Um espaço em branco seguido por um ponto, vírgula, 6.dois-pontos, ou ponto-e-vírgula
	7.Uma palavra com mais de seis letras
	8.Uma palavra sem a letra "e" (ou E)

Consulte a tabela no capítulo *Sumário* para ajuda.
Teste cada solução encontrada com alguns testes com *strings*.

```js
// Fill in the regular expressions

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
       ["earth bed", "learning ape", "BEET"]);


function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  for (let str of yes) if (!regexp.test(str)) {
    console.log(`Failure to match '${str}'`);
  }
  for (let str of no) if (regexp.test(str)) {
    console.log(`Unexpected match for '${str}'`);
  }
}
```

## Estilo de aspas

Imagine que você escreveu um texto e usou aspas simples por toda parte. Agora você deseja substituir todas que realmente possuem algum texto com aspas duplas, mas não as usadas em contrações de texto com *aren't*.

Pense em um padrão que faça distinção entre esses dois usos de aspas e faça uma chamada que substitua apenas nos lugares apropriados.

```js
let text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
console.log(text.replace(/A/g, "B"));
// → "I'm the cook," he said, "it's my job."
```

**Dicas**

A solução mais óbvia é substituir apenas as aspas que não estão cercadas de caracteres de palavra. A primeira expressão vem à mente é */\W'\W/*, Mas você também deve levar em consideração o início e o fim da linha. 

Além disso, você deve garantir que a substituição também inclua os caracteres que foram correspondidos pelo padrão"\W" para que eles não sejam eliminados. Isso pode ser feito envolvendo-os entre parênteses e incluindo seus grupos substituindo pela *string* ( $1, $2). Os grupos que não tiverem correspondência serão substituídos por nada.

### Novamente números

Séries de dígitos podem ser usados pela agradável expressão regular */\d+/*.

Escreva uma expressão que encontre (apenas) números no estilo JavaScript. Isso significa que precisa suportar um sinal de menor ou maior, opcional, na frente do número, um ponto decimal e a notação exponencial *—5e-3* ou *1E10—*, novamente com o sinal opcional na frente dele. . Observe também que não é necessário que haja dígitos antes ou depois do ponto, mas o número não pode ser apenas um ponto. Assim, *.5* e *5.* são números JavaScript válidos, mas apenas o ponto não é.

```js
// Preencha esta expressão regular
let number = /^...$/;

// Tests:
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

Dicas

Primeiro, não esqueça da barra invertida em frente ao ponto.

Achar o sinal opcional na frente do número, como na frente do exponencial, pode ser feito com _[+\-]?_ ou _(+|-|)_ (mais, menos ou nada).

A parte mais complicada deste exercício provavelmente é a dificuldade de achar "5." e ".5"  sem achar também o ".". Para isso, achamos que a melhor solução é usar o operador "|" para separar os dois casos, um ou mais dígitos opcionalmente seguidos por um ponto e zero ou mais dígitos, ou um ponto seguido por um ou mais dígitos.

Finalmente, fazer o "e" *case-insensitive*, ou adicional a opção "i" à expressão regular ou usar "*[eE]*".
