# Valores, Tipos e Operadores

> Abaixo da parte superficial da máquina, o programa se movimenta. Sem esforço, ele se expande e se contrai. Com grande harmonia, os elétrons se espalham e se reagrupam. As formas no monitor são como ondulações na água. A essência permanece invisível por baixo.
>
> — Master Yuan-Ma, The Book of Programming

Dentro do mundo do computador, há somente dados. Você pode ler, modificar e criar novos dados, entretanto, qualquer coisa que não seja um dado simplesmente não existe. Todos os dados são armazenados em longas sequências de bits e são, fundamentalmente, parecidos.

Bits podem ser qualquer tipo de coisa representada por dois valores, normalmente descritos como zeros e uns. Dentro do computador, eles representam formas tais como uma carga elétrica alta ou baixa, um sinal forte ou fraco ou até um ponto na superfície de um CD que possui brilho ou não. Qualquer pedaço de informação pode ser reduzido a uma sequência de zeros e uns e, então, representados por bits.

Como um exemplo, pense sobre a maneira que o número 13 pode ser armazenado em bits. A forma usual de se fazer esta analogia é a forma de escrevermos números decimais, mas ao invés de 10 dígitos, temos apenas 2. E, ao invés de o valor de um dígito aumentar dez vezes sobre o dígito após ele, o valor aumenta por um fator de 2. Estes são os bits que compõem o número treze, com o valor dos dígitos mostrados abaixo deles:

```
  0   0   0   0   1   1   0   1
128  64  32  16   8   4   2   1
```

Assim, este é o número binário 00001101, ou 8 + 4 + 1, que equivale a 13.

## Valores

Imagine um mar de bits, um oceano deles. Um computador moderno possui mais de trinta bilhões de bits em seu armazenamento volátil de dados. Já em armazenamento de dados não voláteis, sendo eles o disco rígido ou algo equivalente, tende a ter uma ordem de magnitude ainda maior.

![Bit Sea](../img/bit-sea.png)

Para que seja possível trabalhar com tais quantidades de bits sem ficar perdido, você pode separá-los em partes que representam pedaços de informação. No ambiente JavaScript, essas partes são chamadas de _valores_. Embora todos os valores sejam compostos por bits, cada valor exerce um papel diferente e todo valor possui um tipo que determina o seu papel. Existem seis tipos básicos de valores no JavaScript: números, strings, Booleanos, objetos, funções e valores indefinidos.

Para criar um valor, você deve simplesmente invocar o seu nome. Isso é bastante conveniente, pois você não precisa de nenhum material extra para construí-los e muito menos ter que pagar algo por eles. Você só chama por ele e pronto, você o tem. É claro que eles não são criados do nada. Todo valor precisa estar armazenado em algum lugar e, se você quiser usar uma quantidade enorme deles ao mesmo tempo, você pode acabar ficando sem bits. Felizmente, esse é um problema apenas se você precisa deles simultaneamente. A medida que você não utiliza um valor, ele será dissipado, fazendo com que seus bits sejam reciclados, disponibilizando-os para serem usados na construção de outros novos valores.

Esse capítulo introduz os elementos que representam os átomos dos programas JavaScript, que são os simples tipos de valores e os operadores que podem atuar sobre eles.

## Números

Valores do tipo _número_ são, sem muitas surpresas, valores numéricos. Em um programa JavaScript, eles são escritos assim:

```js
13
```

Coloque isso em um programa e isso fará com que padrões de bits referentes ao número 13 sejam criados e passe a existir dentro da memória do computador.

O JavaScript utiliza um número fixo de bits, mais precisamente 64 deles, para armazenar um único valor numérico. Existem apenas algumas maneiras possíveis que você pode combinar esses 64 bits, ou seja, a quantidade de números diferentes que podem ser representados é limitada. Para um valor _N_ de dígitos decimais, a quantidade de números que pode ser representada é _10^N_ [TODO: arrumar exponencial]. De forma similar, dado 64 dígitos binários, você pode representar 2⁶⁴ número diferentes, que é aproximadamente 18  quintilhões (o número 18 com 18 zeros após ele). Isso é muito.

A memória do computador costumava ser bem menor e, por isso, as pessoas usavam grupos de 8 ou 16 bits para representar os números. Por isso, era muito fácil extrapolar essa capacidade de armazenamento tão pequena usando números que não cabiam nesse espaço. Hoje em dia, até os computadores pessoais possuem memória suficiente, possibilitando usar grupos de 64 bits, sendo apenas necessário se preocupar em exceder o espaço quando estiver lidando com números extremamente grandes.

Entretanto, nem todos os números inteiros menores do que 18 quintilhões cabem em um número no JavaScript. Os bits também armazenam números negativos, sendo que um desses bits indica o sinal do número. Um grande problema é que números fracionários também precisam ser representados. Para fazer isso, alguns bits são usados para armazenar a posição do ponto decimal. Na realidade, o maior número inteiro que pode ser armazenado está na região de 9 quatrilhões (15 zeros), que ainda assim é extremamente grande.

Números fracionários são escritos usando um ponto.

```js
9.81
```

Para números muito grandes ou pequenos, você pode usar a notação científica adicionando um “e” (de “expoente”) seguido do valor do expoente:

```js
2.998e8
```

Isso é 2.998 x 10⁸ = 299800000.

Cálculos usando números inteiros menores que os 9 quadrilhões mencionados, serão com certeza precisos. Infelizmente, cálculos com número fracionários normalmente não são precisos. Da mesma forma que π (pi) não pode ser expresso de forma precisa por uma quantidade finita de dígitos decimais, muitos números perdem sua precisão quando existem apenas 64 bits disponíveis para armazená-los. Isso é vergonhoso, porém causa problemas apenas em algumas situações específicas. O mais importante é estar ciente dessa limitação e tratar números fracionários como aproximações e não como valores precisos.

## Aritmética

A principal coisa para se fazer com números são cálculos aritméticos. As operações como adição ou multiplicação recebem dois valores numéricos e produzem um novo número a partir deles. Elas são representadas dessa forma no JavaScript:

```js
100 + 4 * 11
```

Os símbolos `+` e `*` são chamados de _operadores_. O primeiro é referente à adição e o segundo à multiplicação. Colocar um operador entre dois valores irá aplicá-lo a esses valores e produzirá um novo valor.

O significado do exemplo anterior é “adicione 4 e 100 e, em seguida, multiplique esse resultado por 11” ou a multiplicação é realizada antes da adição? Como você deve ter pensado, a multiplicação acontece primeiro. Entretanto, como na matemática, você pode mudar esse comportamento envolvendo a adição com parênteses.

```javascript
(100 + 4) * 11
```

Para subtração existe o operador `-` e para a divisão usamos o operador `/`.

Quando os operadores aparecem juntos sem parêntesis, a ordem que eles serão aplicados é determinada pela _precedência_ deles. O exemplo mostra que a multiplicação ocorre antes da adição. O operador `/` possui a mesma precedência que `*` e, de forma similar, os operadores `+` e `-` possuem a mesma precedência entre si. Quando vários operadores de mesma precedência aparecem próximos uns aos outros, como por exemplo `1 - 2 + 1`, eles são aplicados da esquerda para a direita: `(1 - 2) + 1`.

Essas regras de precedência não são algo que você deve se preocupar. Quando estiver em dúvida, apenas adicione os parênteses.

Existe mais um operador aritmético que você talvez não reconheça imediatamente. O símbolo `%` é usado para representar a operação de _resto_. `X % Y` é o resto da divisão de `X` por `Y`. Por exemplo, `314 % 100` produz `14` e `144 % 12` produz `0`. A precedência do operador resto é a mesma da multiplicação e divisão. Você ouvirá com frequência esse operador ser chamado de _modulo_ mas, tecnicamente falando, _resto_ é o termo mais preciso.

## Números Especiais

Existem três valores especiais no JavaScript que são considerados números, mas não se comportam como números normais.

Os dois primeiros são `Infinity` e `-Infinity`, que são usados para representar os infinitos positivo e negativo. O cálculo `Infinity - 1` continua sendo `Infinity`, assim como qualquer outra variação dessa conta. Entretanto, não confie muito em cálculos baseados no valor infinito, pois esse valor não é matematicamente sólido, e rapidamente nos levará ao próximo número especial: `NaN`.

`NaN` é a abreviação de “_not a number_” (não é um número), mesmo sabendo que ele é um valor do tipo número. Você receberá esse valor como resultado quando, por exemplo, tentar calcular `0 / 0` (zero dividido por zero), `Infinity - Infinity` ou, então, realizar quaisquer outras operações numéricas que não resultem em um número preciso e significativo.

## Strings

O próximo tipo básico de dado é a _string_. _Strings_ são usadas para representar texto, e são escritas delimitando o seu conteúdo entre aspas.

```js
"Patch my boat with chewing gum"
'Monkeys wave goodbye'
```

Ambas as aspas simples e duplas podem ser usadas para representar _strings_, contanto que as aspas abertas no início e fechadas fim sejam iguais.

Quase tudo pode ser colocado entre aspas, e o JavaScript criará um valor do tipo _string_ com o que quer que seja. Entretanto, alguns caracteres são mais difíceis. Você pode imaginar como deve ser complicado colocar aspas dentro de aspas. Além disso, os caracteres _newlines_ (quebra de linhas, usados quando você aperta _Enter_), também não podem ser colocados entre aspas. As _strings_ devem permanecer em uma única linha.

Para que seja possível incluir tais caracteres em uma _string_, a seguinte notação é utilizada: toda vez que um caractere de barra invertida (`\`) for encontrado dentro de um texto entre aspas, ele indicará que o caractere seguinte possui um significado especial. Isso é chamado de _escapar_ o caractere. Uma aspa que se encontra logo após uma barra invertida não representará o fim da _string_ e, ao invés disso, será considerada como parte do texto dela. Quando um caractere `n` aparecer após uma barra invertida, ele será interpretado como uma quebra de linha e, de forma similar, um `t` significará um caractere de tabulação. Considere a seguinte _string_:

```js
"This is the first line\nAnd this is the second"
```

O texto na verdade será:

```
This is the first line
And this is the second
```

Existe, obviamente, situações onde você quer uma barra invertida em uma string apenas como uma barra invertida. não um código especial. Se duas barras invertidas estiverem seguidas uma da outra, elas se anulam, e somente uma vai ser deixada no valor da string resultante. Assim é como a string `A newline character is written like "\n" can be written`:

```
"A newline character is written like \"\\n\"."

```

Strings não podem ser divididas, multiplicadas ou subtraídas, mas o operador `+` pode ser usado nelas. Ele não adiciona, mas concatena - ele cola duas strings unindo-as. A linha seguinte vai produzir a string `concatenate`:

```
"con" + "cat" + "e" + "nate"

```

Existem outras maneiras de manipular strings, que nós vamos discutir quando entrarmos nós métodos no capítulo 4.

## Operadores Unários

Nem todos operadores são símbolos. Alguns são palavras escritas. Um exemplo é o operador `typeof`, que produz uma string com o valor do tipo dado para fornecido para avaliação.

```javascript

console.log(typeof 4.5)
// → number
console.log(typeof "x")
// → string

```

Nós vamos usar `console.log` nos códigos exemplo para indicar que nós queremos ver o resultado da avaliação de algo. Quando você roda algum código, o valor produzido vai ser mostrado na tela - de alguma forma, dependendo do ambiente JavaScript que você usa para rodá-lo.

Os outros operadores que vimos sempre operam com 2 valores; `typeof` pega somente um. Operadores que usam 2 valores são chamados operadores *binários*, enquanto aqueles que pegam um são chamados operadores *unários*. O operador menos `-` pode ser usado como operador binário e unário.

```javascript

console.log(- (10 - 2))
// → -8

```

## Valores Booleanos

As vezes, você vai precisar de um valor que simplesmente distingue entre 2 possibilidades, "sim" ou "não", ou "ligado" e "desligado". Para isso o JavaScript tem um tipo *booleano*, que tem apenas dois valores, `true` e `false` (que são escritos com estas palavras mesmo).

### Comparações

Aqui temos uma maneira de produzir valores booleanos:

```javascript

console.log(3 > 2)
// → true
console.log(3 < 2)
// → false

```
Os sinais `>` e `<` são tradicionalmente símbolos para "é maior que" e "é menor que". Eles são operadores binários, e o resultado da aplicação deles é um valor booleano que indica se eles são verdadeiros neste caso.

Strings podem ser comparadas da mesma forma:

```javascript

console.log("Aardvark" < "Zoroaster")
// → true

```

A maneira que as strings são ordenadas é mais ou menos alfabética: Letras maiúsculas são sempre "menores" que as minúsculas, então ` "Z" < "a" ` é `true`, e caracteres não alfabéticos ('!', '-', e assim por diante) são também incluídos na ordenação. A maneira real da comparação é feita baseada no padrão *Unicode*. Este padrão atribui um número a todo caracter virtual que pode ser usado, incluindo caracteres da Grécia, Arábia, Japão, Tamil e por ai vai. Ter estes números é prático para guardar strings dentro do computador - você pode representá-los como uma sequência de números. Quando se compara strings, o JavaScript vai sobre elas da esquerda para a direita, comparando os códigos numéricos dos caracteres um por um.

Outros operadores similares são `>=` (maior que ou igual a), `<=` (menor que ou igual a), `==` (igual a) e `!=` (não igual a).

```javascript

console.log("Itchy" != "Scratchy")
// → true

```

Há somente um valor no JavaScript que não é igual a ele mesmo, que é o `NaN` (not a number).

```javascript

console.log(NaN == NaN)
// → false

```

`NaN` (not a number) supostamente define o resultado de *uma operação* sem sentido, e como tal, não será igual ao resultado de *outra operação* sem sentido.

## Operadores Lógicos

Temos também algumas operações que podem ser aplicadas aos valores booleanos. O JavaScript suporta 3 operadores lógicos: *e*, *ou* ou *não*.

O operador `&&` representa o **e** lógico. É um operador binário, e seu resultado é `true` (verdadeiro) somente se ambos os valores dados a ele forem `true`.

```javascript

console.log(true && false);
// → false

console.log(true && true);
// → true

```

O operador `||` denota ao **ou** lógico. Ele produz `true` se algum dos valores fornecidos for `true`:

```javascript

console.log(false || true);
// → true

console.log(false || false);
// → false

```

**Não** é escrito com uma exclamação `!`. É um operador unário que inverte o valor dado a ele - `!true` produz `false` e `!false` produz `true`.

Quando misturamos estes operadores booleanos com operadores aritméticos e outros operadores, não é sempre óbvio quando o parênteses é necessário. Na prática, você precisa conhecer sobre os operadores que vimos antes, e que `||` tem o mais baixo nível de precedência, seguido do `&&`, e então os operadores de comparação (`>`, `==`, e outros), e depois o resto. Sendo assim, como vemos na expressão abaixo, os parênteses poucas vezes são necessários.

```javascript

1 + 1 == 2 || 10 * 10 <= 100

```

## Valores Indefinidos

Temos dois valores especiais, `null` e `undefined`, que são usados para denotar a ausência de valores significativos. Eles são por si próprios valores, porém valores que não levam informação.

Muitas operações na linguagem que não produzem valores significativos (vamos ver algumas no próximo capítulo) vão produzir `undefined`, simplesmente porque elas tem que retornar *algum* valor.

A diferença de significado entre `undefined` e `null` é em grande parte desinteressante e um acidente no projeto do JavaScript. Nos casos que você realmente tiver que se preocupar com estes valores, eu recomendo tratá-los como substituíveis (mais sobre isso em um momento).

## Conversão Automática de Tipo

Na introdução, eu mencionei que o JavaScript não iria atrapalhá-lo e aceitaria quase qualquer coisa que você o fornecesse, mesmo quando isso é confuso e errado. Isto é muito bem demonstrado por esta expressão:

```javascript

console.log(8 * null)
// → 0
console.log("5" - 1)
// → 4
console.log("5" + 1)
// → 51
console.log("five" * 2)
// → NaN
console.log(false == 0)
// → true

```
Quando um operador é aplicado a um tipo de valor "errado", ele vai silenciosamente converter este valor para o tipo que quiser, usando um conjunto de regras que frequentemente não são as que você expera. O `null` na primeira expressão torna-se 0, o `"5"` na segunda expressão se torna `5` (de string para número), ainda na terceira expressão, o `+` tenta a concatenação de strings antes de tentar a adição numérica, o `1` é convertido em `"1"` (de número para string).

Quando algo que não pode ser mapeado como um número de forma óbvia, do tipo `"five"` ou `undefined` é convertido para um número, o valor `NaN` é produzido. Operações aritméticas com `NaN` continuam produzindo `NaN`, então se você encontrar alguns destes resultados em algum local inesperado, procure por conversões acidentais de tipo.

Quando comparamos coisas do mesmo tipo usando `==`, o resultado é bastante fácil de se prever - você vai obter `true` quando ambos os valores forem os mesmos. Mas quando os tipos diferem, o JavaScript usa um complicado e confuso conjunto de regras para determinar o que fazer. Eu não vou explicar isto precisamente, mas na maioria dos casos irá ocorrer a tentativa de conversão de um dos valores para o tipo do outro valor. Contudo, quando `null`ou `undefined`ocorrem em algum dos lados do operador, isso produzirá `true` somente se ambos os lados forem `null` ou `undefined`.

A última parte do comportamento é frequentemente muito útil. Quando você quer testar se um valor tem um valor real, em vez de ser `null` ou `undefined`, você pode simplesmente compará-lo a `null` com o operador `==` (ou `!=`).

Mas e se você quiser testar se algo se refere ao valor preciso `false`? As regras de conversão de strings e números para valores booleanos afirmam que `0`, `NaN` e empty strings contam como `false`, enquanto todos os outros valores contam como `true`. Por causa disso, expressões como `0 == false` e `"" == false` retornam `true`. Para casos assim, onde você **não** quer qualquer conversão automática de tipos acontecendo, existem dois tipos extras de operadores: `===` e `!==`. O primeiro teste se o valor é precisamente igual ao outro, e o segundo testa se ele não é precisamente igual. Então `"" === false` é falso como esperado.

Usar os operadores de comparação de três caracteres defensivamente, para prevenir inesperadas conversões de tipo que o farão tropeçar, é algo que eu recomendo. Mas quando você tem certeza de que os tipos de ambos os lados serão iguais, ou que eles vão ser ambos `null`/`undefined`, não há problemas em usar os operadores curtos.

## O Curto-Circuito de && e ||

Os operadores lógicos `&&` e `||` tem uma maneira peculiar de lidar com valores de tipos diferentes. Eles vão converter o valor à sua esquerda para o tipo booleano a fim de decidir o que fazer, mas então, dependendo do operador e do resultado da conversão, eles ou retornam o valor à esquerda *original*, ou o valor à direita.

O operador `||` vai retornar o valor à sua esquerda quando ele puder ser convertido em `true`, ou valor à sua direita caso contrário. Ele faz a coisa certa para valores booleanos, e vai fazer algo análogo para valores de outros tipos. Isso é muito útil, pois permite que o operador seja usado para voltar um determinado valor predefinido.

```javascript

console.log(null || "user")
// → user
console.log("Karl" || "user")
// → Karl

```

O operador `&&` trabalha similarmente, mas ao contrário. Quando o valor à sua esquerda é algo que se torne `false`, ele retorna o valor, e caso contrário ele retorna o valor à sua direita.

Outro importante propriedade destes 2 operadores é que a expressão a sua direita é avaliada somente quando necessário. No caso de `true || X`, não importa o que `X` é - pode ser uma expressão que faça algo *terrível* - o resultado vai ser verdadeiro, e `X` nunca é avaliado. O mesmo acontece para `false && X`, que é falso, e vai ignorar `X`.

## Resumo

Nós vimos 4 tipos de valores do JavaScript neste capítulo. Números, strings, booleanos e valores indefinidos.

Alguns valores são criados digitando seu nome (`true`, `null`) ou valores (13, `"abc"`). Eles podem ser combinados e transformados com operadores. Nós vimos operadores binários para aritmética (`+`, `-`, `*`, `/`, e `%`), um para concatenação de string (`+`), comparação (`==`, `!=`, `===`, `!==`, `<`, `>`, `<=`, `>=`) e lógica (`&&`, `||`), como também vários operadores unários (`-` para negativar um número, `!` para negar uma lógica, e `typeof` para encontrar o tipo do valor).

Isto lhe dá informação suficiente para usar o JavaScript como uma calculadora de bolso, mas não muito mais. O próximo capítulo vai começar a amarrar essas operações básicas conjuntamente dentro de programas básicos.
