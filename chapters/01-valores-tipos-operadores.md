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

Para que seja possível trabalhar com tais quantidades de bits sem ficar perdido, você pode separá-los em partes que representam pedaços de informação. No ambiente JavaScript, essas partes são chamadas de _valores_. Embora todos os valores sejam compostos por bits, cada valor exerce um papel diferente e todo valor possui um tipo que determina o seu papel. Existem seis tipos básicos de valores no JavaScript: números, _Strings_, _Booleanos_, objetos, funções e valores indefinidos.

Para criar um valor, você deve simplesmente invocar o seu nome. Isso é bastante conveniente, pois você não precisa de nenhum material extra para construí-los e muito menos ter que pagar algo por eles. Você só chama por ele e pronto, você o tem. É claro que eles não são criados do nada. Todo valor precisa estar armazenado em algum lugar e, se você quiser usar uma quantidade enorme deles ao mesmo tempo, você pode acabar ficando sem bits. Felizmente, esse é um problema apenas se você precisa deles simultaneamente. A medida que você não utiliza um valor, ele será dissipado, fazendo com que seus bits sejam reciclados, disponibilizando-os para serem usados na construção de outros novos valores.

Esse capítulo introduz os elementos que representam os átomos dos programas JavaScript, que são os simples tipos de valores e os operadores que podem atuar sobre eles.

## Números

Valores do tipo _número_ são, sem muitas surpresas, valores numéricos. Em um programa JavaScript, eles são escritos assim:

```js
13
```

Coloque isso em um programa e isso fará com que padrões de bits referentes ao número 13 sejam criados e passe a existir dentro da memória do computador.

O JavaScript utiliza um número fixo de bits, mais precisamente 64 deles, para armazenar um único valor numérico. Existem apenas algumas maneiras possíveis que você pode combinar esses 64 bits, ou seja, a quantidade de números diferentes que podem ser representados é limitada. Para um valor _N_ de dígitos decimais, a quantidade de números que pode ser representada é _10ⁿ_. De forma similar, dado 64 dígitos binários, você pode representar 2⁶⁴ número diferentes, que é aproximadamente 18  quintilhões (o número 18 com 18 zeros após ele). Isso é muito.

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

Quando os operadores aparecem juntos sem parênteses, a ordem que eles serão aplicados é determinada pela _precedência_ deles. O exemplo mostra que a multiplicação ocorre antes da adição. O operador `/` possui a mesma precedência que `*` e, de forma similar, os operadores `+` e `-` possuem a mesma precedência entre si. Quando vários operadores de mesma precedência aparecem próximos uns aos outros, como por exemplo `1 - 2 + 1`, eles são aplicados da esquerda para a direita: `(1 - 2) + 1`.

Essas regras de precedência não são coisas com as quais você deve se preocupar. Quando estiver em dúvida, apenas adicione os parênteses.

Existe mais um operador aritmético que você talvez não reconheça imediatamente. O símbolo `%` é usado para representar a operação de _resto_. `X % Y` é o resto da divisão de `X` por `Y`. Por exemplo, `314 % 100` produz `14` e `144 % 12` produz `0`. A precedência do operador resto é a mesma da multiplicação e divisão. Você ouvirá com frequência esse operador ser chamado de _modulo_ mas, tecnicamente falando, _resto_ é o termo mais preciso.

## Números Especiais

Existem três valores especiais no JavaScript que são considerados números, mas não se comportam como números normais.

Os dois primeiros são `Infinity` e `-Infinity`, que são usados para representar os infinitos positivo e negativo. O cálculo `Infinity - 1` continua sendo `Infinity`, assim como qualquer outra variação dessa conta. Entretanto, não confie muito em cálculos baseados no valor infinito, pois esse valor não é matematicamente sólido e rapidamente nos levará ao próximo número especial: `NaN`.

`NaN` é a abreviação de “_not a number_” (não é um número), mesmo sabendo que ele é um valor do tipo número. Você receberá esse valor como resultado quando, por exemplo, tentar calcular `0 / 0` (zero dividido por zero), `Infinity - Infinity` ou, então, realizar quaisquer outras operações numéricas que não resultem em um número preciso e significativo.

## _Strings_

O próximo tipo básico de dado é a _String_. _Strings_ são usadas para representar texto, e são escritas delimitando o seu conteúdo entre aspas.

```js
"Patch my boat with chewing gum"
'Monkeys wave goodbye'
```

Ambas as aspas simples e duplas podem ser usadas para representar _Strings_, contanto que as aspas abertas sejam iguais no início e no fim.

Quase tudo pode ser colocado entre aspas e o JavaScript criará um valor do tipo _String_ com o que quer que seja. Entretanto, alguns caracteres são mais difíceis. Você pode imaginar como deve ser complicado colocar aspas dentro de aspas. Além disso, os caracteres _newlines_ (quebra de linhas, usados quando você aperta _Enter_), também não podem ser colocados entre aspas. As _Strings_ devem permanecer em uma única linha.

Para que seja possível incluir tais caracteres em uma _String_, a seguinte notação é utilizada: toda vez que um caractere de barra invertida (`\`) for encontrado dentro de um texto entre aspas, ele indicará que o caractere seguinte possui um significado especial. Isso é chamado de _escapar_ o caractere. Uma aspa que se encontra logo após uma barra invertida não representará o fim da _String_ e, ao invés disso, será considerada como parte do texto dela. Quando um caractere `n` aparecer após uma barra invertida, ele será interpretado como uma quebra de linha e, de forma similar, um `t` significará um caractere de tabulação. Considere a seguinte _String_:

```js
"This is the first line\nAnd this is the second"
```

O texto na verdade será:

```
This is the first line
And this is the second
```

Existe, obviamente, situações nas quais você vai querer que a barra invertida em uma _String_ seja apenas uma barra invertida e não um código especial. Nesse caso, se duas barras invertidas estiverem seguidas uma da outra, elas se anulam e apenas uma será deixada no valor da _String_ resultante. Essa é a forma na qual a _String_ “`A newline character is written like “\n”.`” pode ser representada:

```js
"A newline character is written like \"\\n\"."
```

_Strings_ não podem ser divididas, multiplicadas nem subtraídas, entretanto, o operador `+` pode ser usado nelas. Ele não efetua a adição, mas _concatena_, ou seja, junta duas _Strings_ em uma única _String_. O próximo exemplo produzirá a _String_ `"concatenate"`:

```js
"con" + "cat" + "e" + "nate"
```

Existem outras maneiras de manipular as _Strings_, as quais serão discutidas quando chegarmos aos métodos no [Capítulo 4](./04-estruturas-de-dados.md#métodos).

## Operadores Unários

Nem todos os operadores são símbolos, sendo que alguns são escritos como palavras. Um exemplo é o operador `typeof`, que produz um valor do tipo _String_ contendo o nome do tipo do valor que você está verificando.

```js
console.log(typeof 4.5)
// → number
console.log(typeof "x")
// → string
```

Nós vamos usar `console.log` nos códigos de exemplo para indicar que desejamos ver o resultado da avaliação de algo. Quando você executar tais códigos, o valor produzido será mostrado na tela, entretanto, a forma como ele será apresentado vai depender do ambiente JavaScript que você usar para rodar os códigos.

Todos os operadores que vimos operavam em dois valores, mas `typeof` espera um único valor. Operadores que usam dois valores são chamados de operadores _binários_, enquanto que aqueles que recebem apenas um, são chamados de operadores _unários_. O operador `-` pode ser usado tanto como binário quanto como unário.

```js
console.log(- (10 - 2))
// → -8
```

## Valores _Booleanos_

Você frequentemente precisará de um valor para distinguir entre duas possibilidades, como por exemplo “sim” e “não”, ou “ligado” e “desligado”. Para isso, o JavaScript possui o tipo _Booleano_, que tem apenas dois valores: verdadeiro e falso (que são escritos como `true` e `false` respectivamente).

### Comparações

Essa é uma maneira de produzir valores _Booleanos_:

```js
console.log(3 > 2)
// → true
console.log(3 < 2)
// → false
```

Os sinais `>` e `<` são tradicionalmente símbolos para representar “é maior que” e “é menor que” respectivamente. Eles são operadores binários, e o resultado da aplicação deles é um valor _Booleano_ que indica se a operação é verdadeira nesse caso.

_Strings_ podem ser comparadas da mesma forma.

```js
console.log("Aardvark" < "Zoroaster")
// → true
```

A forma na qual as _Strings_ são ordenadas é mais ou menos alfabética. Letras maiúsculas serão sempre “menores” que as minúsculas, portanto, `“Z” < “a”` é verdadeiro. Além disso, caracteres não alfabéticos (!, -, e assim por diante) também são incluídos nessa ordenação. A comparação de fato, é baseada no padrão _Unicode_, que atribui um número para todos os caracteres que você possa precisar, incluindo caracteres do Grego, Árabe, Japonês, Tâmil e por aí vai. Possuir tais números é útil para armazenar as _Strings_ dentro do computador, pois faz com que seja possível representá-las como uma sequência de números. Quando comparamos _Strings_, o JavaScript inicia da esquerda para a direita, comparando os códigos numéricos dos caracteres um por um.

Outros operadores parecidos são `>=` (maior que ou igual a), `<=` (menor que ou igual a), `==` (igual a) e `!=` (não igual a).

```js
console.log("Itchy" != "Scratchy")
// → true
```

Existe apenas um valor no JavaScript que não é igual a ele mesmo, que é o valor `NaN`. Ele significa _“not a number”_, que em português seria traduzido como “não é um número”.

```js
console.log(NaN == NaN)
// → false
```

`NaN` é supostamente usado para indicar o resultado de alguma operação que não tenha sentido e, por isso, ele não será igual ao resultado de quaisquer _outras_ operações sem sentido.

## Operadores Lógicos

Existem também operadores que podem ser aplicados aos valores _Booleanos_. O JavaScript dá suporte a três operadores lógicos: _and_, _or_ e _not_, que podem ser traduzidos para o português como _e_, _ou_ e _não_. Eles podem ser usados para "pensar" de forma lógica sobre _Booleanos_.

O operador `&&` representa o valor lógico _and_ ou, em português, _e_. Ele é um operador binário, e seu resultado é apenas verdadeiro se ambos os valores dados à ele forem verdadeiros.

```js
console.log(true && false)
// → false
console.log(true && true)
// → true
```

O operador `||` indica o valor lógico _or_ ou, em português, _ou_. Ele produz um valor verdadeiro se qualquer um dos valores dados à ele for verdadeiro.

```js
console.log(false || true)
// → true
console.log(false || false)
// → false
```

_Not_, em português _não_, é escrito usando um ponto de exclamação (`!`). Ele é um operador unário que inverte o valor que é dado à ele. Por exemplo, `!true` produz `false` e `!false` produz `true`.

Quando misturamos esses operadores _Booleanos_ com operadores aritméticos e outros tipos de operadores, nem sempre é óbvio quando devemos usar ou não os parênteses. Na prática, você normalmente não terá problemas sabendo que, dos operadores que vimos até agora, `||` possui a menor precedência, depois vem o operador `&&`, em seguida vêm os operadores de comparação (`>`, `==`, etc) e, por último, quaisquer outros operadores. Essa ordem foi escolhida de tal forma que, em expressões típicas como o exemplo a seguir, poucos parênteses são realmente necessários:

```js
1 + 1 == 2 && 10 * 10 > 50
```

O último operador lógico que iremos discutir não é unário nem binário, mas _ternário_, operando em três valores. Ele é escrito usando um ponto de interrogação e dois pontos, como mostrado abaixo:

```js
console.log(true ? 1 : 2);
// → 1
console.log(false ? 1 : 2);
// → 2
```

Esse operador é chamado de operador _condicional_ (algumas vezes é chamado apenas de operador _ternário_, já que é o único operador desse tipo na linguagem). O valor presente à esquerda do ponto de interrogação “seleciona” qual dos outros dois valores será retornado. Quando ele for verdadeiro, o valor do meio é escolhido e, quando for falso, o valor à direita é retornado.

## Valores Indefinidos

Existem dois valores especiais, `null` e `undefined`, que são usados para indicar a ausência de um valor com significado. Eles são valores por si sós, mas não carregam nenhum tipo de informação.

Muitas operações na linguagem que não produzem um valor com significado (você verá alguns mais para frente) retornarão `undefined` simplesmente porque eles precisam retornar _algum_ valor.

A diferença de significado entre `undefined` e `null` é um acidente que foi criado no design do JavaScript, e não faz muita diferença na maioria das vezes. Nos casos em que você deve realmente se preocupar com esses valores, recomendo tratá-los como valores idênticos (vamos falar mais sobre isso em breve).

## Conversão Automática de Tipo

Na introdução, mencionei que o JavaScript tenta fazer o seu melhor para aceitar quase todos os programas que você fornecer, inclusive aqueles que fazem coisas bem estranhas. Isso pode ser demonstrado com as seguintes expressões:

```js
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

Quando um operador é aplicado a um tipo de valor “errado”, o JavaScript converterá, de forma silenciosa, esse valor para o tipo que ele desejar, usando uma série de regras que muitas vezes não é o que você deseja ou espera. Esse comportamento é chamado de _coerção de tipo_ (ou _conversão de tipo_). Portanto, na primeira expressão, `null` se torna `0` e, na segunda, a _String_ `"5"` se torna o número `5`. Já na terceira expressão, o operador `+` tenta efetuar uma concatenação de _String_ antes de tentar executar a adição numérica e, por isso, o número `1` é convertido para a _String_ `"1"`.

Quando algo que não pode ser mapeado como um número de forma óbvia (tais como `"five"` ou `undefined`) é convertido para um número, o valor `NaN` é produzido. Quaisquer outras operações aritméticas realizadas com `NaN` continuam produzindo `NaN`, portanto, quando você perceber que está recebendo esse valor em algum lugar inesperado, procure por conversões de tipo acidentais.

Quando comparamos valores do mesmo tipo usando o operador `==`, o resultado é fácil de se prever: você receberá verdadeiro quando ambos os valores forem o mesmo, exceto no caso de `NaN`. Por outro lado, quando os tipos forem diferentes, o JavaScript usa um conjunto de regras complicadas e confusas para determinar o que fazer, sendo que, na maioria dos casos, ele tenta apenas converter um dos valores para o mesmo tipo do outro valor. Entretanto, quando `null` ou `undefined` aparece em algum dos lados do operador, será produzido verdadeiro apenas se ambos os lados forem `null` ou `undefined`.

```js
console.log(null == undefined);
// → true
console.log(null == 0);
// → false
```

O último exemplo é um comportamento que normalmente é bastante útil. Quando quiser testar se um valor possui um valor real ao invés de `null` ou `undefined`, você pode simplesmente compará-lo a `null` com o operador `==` (ou `!=`).

Mas e se você quiser testar se algo se refere ao valor preciso `false`? As regras de conversão de _Strings_ e números para valores _Booleanos_ afirmam que `0`, `NaN` e _Strings_ vazias contam como `false`, enquanto todos os outros valores contam como `true`. Por causa disso, expressões como `0 == false` e `"" == false` retornam `true`. Para casos assim, onde você **não** quer qualquer conversão automática de tipos acontecendo, existem dois tipos extras de operadores: `===` e `!==`. O primeiro testa se o valor é precisamente igual ao outro, e o segundo testa se ele não é precisamente igual. Então `"" === false` é falso como esperado.

Usar os operadores de comparação de três caracteres defensivamente, para prevenir inesperadas conversões de tipo que o farão tropeçar, é algo que eu recomendo. Mas quando você tem certeza de que os tipos de ambos os lados serão iguais, ou que eles vão ser ambos `null`/`undefined`, não há problemas em usar os operadores curtos.

## O Curto-Circuito de && e ||

Os operadores lógicos `&&` e `||` tem uma maneira peculiar de lidar com valores de tipos diferentes. Eles vão converter o valor à sua esquerda para o tipo _Booleano_ a fim de decidir o que fazer, mas então, dependendo do operador e do resultado da conversão, eles ou retornam o valor à esquerda *original*, ou o valor à direita.

O operador `||` vai retornar o valor à sua esquerda quando ele puder ser convertido em `true`, caso contrário, retorna o valor à sua direita. Ele faz a coisa certa para valores _Booleanos_, e vai fazer algo análogo para valores de outros tipos. Isso é muito útil, pois permite que o operador seja usado para retornar um determinado valor predefinido.

```javascript

console.log(null || "user")
// → user
console.log("Karl" || "user")
// → Karl

```

O operador `&&` trabalha similarmente, mas ao contrário. Quando o valor à sua esquerda é algo que se torne `false`, ele retorna o valor e caso contrário, ele retorna o valor à sua direita.

Outra importante propriedade destes 2 operadores é que a expressão a sua direita é avaliada somente quando necessário. No caso de `true || X`, não importa o que `X` é - pode ser uma expressão que faça algo *terrível* - o resultado vai ser verdadeiro, e `X` nunca é avaliado. O mesmo acontece para `false && X`, que é falso, e vai ignorar `X`.

## Resumo

Nós vimos 4 tipos de valores do JavaScript neste capítulo. Números, _Strings_, _Booleanos_ e valores indefinidos.

Alguns valores são criados digitando seu nome (`true`, `null`) ou valores (13, `"abc"`). Você pode combinar e transformar valores com operadores. Nós vimos operadores binários para operações aritméticas (`+`, `-`, `*`, `/`, e `%`), um para concatenação de _String_ (`+`), comparação (`==`, `!=`, `===`, `!==`, `<`, `>`, `<=`, `>=`) e lógica (`&&`, `||`), assim como vários operadores unários (`-` para negativar um número, `!` para negar uma lógica, `typeof` para encontrar o tipo do valor) e o operador ternario (?:) para retornar um de dois valores, baseando-se em um terceiro valor.

Isto lhe dá informação suficiente para usar o JavaScript como uma calculadora de bolso, mas não muito mais. O próximo capítulo vai começar a amarrar essas operações básicas conjuntamente dentro de programas básicos.
