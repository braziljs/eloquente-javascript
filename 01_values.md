{{meta {docid: values}}}

# Valores, Tipos e Operadores

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

Below the surface of the machine, the program moves. Without effort, it expands and contracts. In great harmony, electrons scatter and regroup. The forms on the monitor are but ripples on the water. The essence stays invisibly below.

quote}}

{{index "Yuan-Ma", "Book of Programming"}}

{{figure {url: "img/chapter_picture_1.jpg", alt: "Illustration of a sea of dark and bright dots (bits) with islands in it", chapter: framed}}}

{{index "binary data", data, bit, memory}}

No mundo do computador, existem apenas dados. Você pode ler dados, modificar dados, criar novos dados — mas aquilo que não são dados não pode ser mencionado. Todos esses dados são armazenados como longas sequências de bits e, portanto, são fundamentalmente semelhantes.

{{index CD, signal}}

_Bits_ são qualquer tipo de coisa com dois valores, geralmente descritos como zeros e uns. Dentro do computador, eles assumem formas como uma carga elétrica alta ou baixa, um sinal forte ou fraco, ou um ponto brilhante ou opaco na superfície de um CD. Qualquer pedaço de informação discreta pode ser reduzido a uma sequência de zeros e uns e, assim, representado em bits.

{{index "binary number", "decimal number"}}

Por exemplo, podemos expressar o número 13 em bits. Isso funciona da mesma forma que um número decimal, mas em vez de 10 ((dígito))s diferentes, temos apenas 2, e o peso de cada um aumenta por um fator de 2 da direita para a esquerda. Aqui estão os bits que compõem o número 13, com os pesos dos dígitos mostrados abaixo deles:

```{lang: null}
   0   0   0   0   1   1   0   1
 128  64  32  16   8   4   2   1
```

Esse é o número binário 00001101. Seus dígitos diferentes de zero representam 8, 4 e 1, e somam 13.

## Valores

{{index [memory, organization], "volatile data storage", "hard drive"}}

Imagine um mar de bits — um oceano deles. Um computador moderno típico tem mais de 100 bilhões de bits em seu armazenamento volátil de dados (memória de trabalho). O armazenamento não volátil (o disco rígido ou equivalente) tende a ter ainda algumas ordens de magnitude a mais.

Para poder trabalhar com tais quantidades de bits sem se perder, nós os separamos em pedaços que representam partes de informação. Em um ambiente JavaScript, esses pedaços são chamados de _((valor))es_. Embora todos os valores sejam feitos de bits, eles desempenham papéis diferentes. Cada valor tem um ((tipo)) que determina seu papel. Alguns valores são números, alguns valores são pedaços de texto, alguns valores são funções, e assim por diante.

{{index "garbage collection"}}

Para criar um valor, você precisa simplesmente invocar seu nome. Isso é conveniente. Você não precisa juntar material de construção para seus valores ou pagar por eles. Você apenas chama por um, e _whoosh_, você o tem. Claro, valores não são realmente criados do nada. Cada um precisa ser armazenado em algum lugar, e se você quiser usar um número gigantesco deles ao mesmo tempo, pode ficar sem memória no computador. Felizmente, isso é um problema apenas se você precisar de todos simultaneamente. Assim que você não usar mais um valor, ele se dissipará, deixando para trás seus bits para serem reciclados como material de construção para a próxima geração de valores.

O restante deste capítulo introduz os elementos atômicos dos programas JavaScript, isto é, os tipos simples de valores e os operadores que podem agir sobre esses valores.

## Números

{{index [syntax, number], number, [number, notation]}}

Valores do tipo _number_ são, sem surpresa, valores numéricos. Em um programa JavaScript, eles são escritos da seguinte forma:

```
13
```

{{index "binary number"}}

Usar isso em um programa fará com que o padrão de bits para o número 13 passe a existir dentro da memória do computador.

{{index [number, representation], bit}}

JavaScript usa um número fixo de bits, 64 deles, para armazenar um único valor numérico. Existem apenas tantos padrões que você pode fazer com 64 bits, o que limita a quantidade de números diferentes que podem ser representados. Com _N_ ((dígito))s decimais, você pode representar 10^N^ números. De forma similar, dados 64 dígitos binários, você pode representar 2^64^ números diferentes, o que é cerca de 18 quintilhões (um 18 com 18 zeros depois). Isso é muito.

A memória dos computadores costumava ser muito menor, e as pessoas tendiam a usar grupos de 8 ou 16 bits para representar seus números. Era fácil acidentalmente causar _((overflow))_ em números tão pequenos — acabar com um número que não cabia no número dado de bits. Hoje, até computadores que cabem no seu bolso têm memória de sobra, então você é livre para usar blocos de 64 bits e só precisa se preocupar com overflow ao lidar com números verdadeiramente astronômicos.

{{index sign, "floating-point number", "sign bit"}}

Nem todos os números inteiros menores que 18 quintilhões cabem em um número JavaScript, no entanto. Esses bits também armazenam números negativos, então um bit indica o sinal do número. Uma questão maior é representar números não inteiros. Para fazer isso, alguns dos bits são usados para armazenar a posição do ponto decimal. O número inteiro máximo real que pode ser armazenado está mais na faixa de 9 quadrilhões (15 zeros) — o que ainda é agradavelmente enorme.

{{index [number, notation], "fractional number"}}

Números fracionários são escritos usando um ponto:

```
9.81
```

{{index exponent, "scientific notation", [number, notation]}}

Para números muito grandes ou muito pequenos, você também pode usar notação científica adicionando um _e_ (de _expoente_), seguido do expoente do número.

```
2.998e8
```

Isso é 2,998 × 10^8^ = 299.800.000.

{{index pi, [number, "precision of"], "floating-point number"}}

Cálculos com números inteiros (também chamados de _((inteiro))s_) que são menores que os 9 quadrilhões mencionados são garantidamente sempre precisos. Infelizmente, cálculos com números fracionários geralmente não são. Assim como π (pi) não pode ser expresso com precisão por um número finito de dígitos decimais, muitos números perdem alguma precisão quando apenas 64 bits estão disponíveis para armazená-los. Isso é uma pena, mas causa problemas práticos apenas em situações específicas. O importante é estar ciente disso e tratar números digitais fracionários como aproximações, não como valores precisos.

### Aritmética

{{index [syntax, operator], operator, "binary operator", arithmetic, addition, multiplication}}

A principal coisa a se fazer com números é aritmética. Operações aritméticas como adição ou multiplicação pegam dois valores numéricos e produzem um novo número a partir deles. Aqui está como elas se parecem em JavaScript:

```{meta: "expr"}
100 + 4 * 11
```

{{index [operator, application], asterisk, "plus character", "* operator", "+ operator"}}

Os símbolos `+` e `*` são chamados de _operadores_. O primeiro representa adição e o segundo representa multiplicação. Colocar um operador entre dois valores o aplicará a esses valores e produzirá um novo valor.

{{index grouping, parentheses, precedence}}

Este exemplo significa "some 4 e 100, e multiplique o resultado por 11", ou a multiplicação é feita antes da adição? Como você deve ter adivinhado, a multiplicação acontece primeiro. Como na matemática, você pode mudar isso envolvendo a adição em parênteses.

```{meta: "expr"}
(100 + 4) * 11
```

{{index "hyphen character", "slash character", division, subtraction, minus, "- operator", "/ operator"}}

Para subtração, existe o operador `-`. Divisão pode ser feita com o operador `/`.

Quando operadores aparecem juntos sem parênteses, a ordem em que são aplicados é determinada pela _((precedência))_ dos operadores. O exemplo mostra que a multiplicação vem antes da adição. O operador `/` tem a mesma precedência que `*`. Da mesma forma, `+` e `-` têm a mesma precedência. Quando múltiplos operadores com a mesma precedência aparecem lado a lado, como em `1 - 2 + 1`, eles são aplicados da esquerda para a direita: `(1 - 2) + 1`.

Não se preocupe demais com essas regras de precedência. Quando tiver dúvida, apenas adicione parênteses.

{{index "modulo operator", division, "remainder operator", "% operator"}}

Existe mais um operador aritmético, que você pode não reconhecer imediatamente. O símbolo `%` é usado para representar a operação de _resto_. `X % Y` é o resto da divisão de `X` por `Y`. Por exemplo, `314 % 100` produz `14`, e `144 % 12` dá `0`. A precedência do operador resto é a mesma da multiplicação e divisão. Você também verá frequentemente esse operador referido como _módulo_.

### Números especiais

{{index [number, "special values"], infinity}}

Existem três valores especiais em JavaScript que são considerados números mas não se comportam como números normais. Os dois primeiros são `Infinity` e `-Infinity`, que representam os infinitos positivo e negativo. `Infinity - 1` ainda é `Infinity`, e assim por diante. Não confie demais em computação baseada em infinito, porém. Ela não é matematicamente sólida e rapidamente levará ao próximo número especial: `NaN`.

{{index NaN, "not a number", "division by zero"}}

`NaN` significa "not a number" (não é um número), embora _seja_ um valor do tipo number. Você obterá esse resultado quando, por exemplo, tentar calcular `0 / 0` (zero dividido por zero), `Infinity - Infinity`, ou qualquer outra operação numérica que não produza um resultado significativo.

## Strings

{{indexsee "grave accent", backtick}}

{{index [syntax, string], text, character, [string, notation], "single-quote character", "double-quote character", "quotation mark", backtick}}

O próximo tipo básico de dados é a _((string))_. Strings são usadas para representar texto. Elas são escritas envolvendo seu conteúdo em aspas.

```
`Down on the sea`
"Lie on the ocean"
'Float on the ocean'
```

Você pode usar aspas simples, aspas duplas ou crases para marcar strings, desde que as aspas no início e no final da string correspondam.

{{index "line break", "newline character"}}

Você pode colocar quase qualquer coisa entre aspas para fazer JavaScript criar um valor de string a partir disso. Mas alguns caracteres são mais difíceis. Você pode imaginar como colocar aspas dentro de aspas pode ser complicado, já que elas parecerão o final da string. _Novas linhas_ (os caracteres que você obtém quando pressiona [enter]{keyname}) podem ser incluídas apenas quando a string está entre crases (`` ` ``).

{{index [escaping, "in strings"], ["backslash character", "in strings"]}}

Para tornar possível incluir tais caracteres em uma string, a seguinte notação é usada: uma barra invertida (`\`) dentro de texto entre aspas indica que o caractere depois dela tem um significado especial. Isso é chamado de _escapar_ o caractere. Uma aspas precedida por uma barra invertida não encerrará a string, mas fará parte dela. Quando um caractere `n` aparece após uma barra invertida, ele é interpretado como uma nova linha. Da mesma forma, um `t` após uma barra invertida significa um ((caractere de tabulação)). Considere a seguinte string:

```
"This is the first line\nAnd this is the second"
```

Este é o texto real nessa string:

```{lang: null}
This is the first line
And this is the second
```

Existem, é claro, situações em que você quer que uma barra invertida em uma string seja apenas uma barra invertida, não um código especial. Se duas barras invertidas se seguem, elas se colapsam juntas, e apenas uma ficará no valor da string resultante. É assim que a string "_Um caractere de nova linha é escrito como `"`\n`"`._" pode ser expressa:

```
"A newline character is written like \"\\n\"."
```

{{id unicode}}

{{index [string, representation], Unicode, character}}

Strings também precisam ser modeladas como uma série de bits para poder existir dentro do computador. A forma como JavaScript faz isso é baseada no padrão _((Unicode))_. Esse padrão atribui um número a virtualmente todo caractere que você possa precisar, incluindo caracteres do grego, árabe, japonês, armênio, e assim por diante. Se temos um número para cada caractere, uma string pode ser descrita por uma sequência de números. E é isso que o JavaScript faz.

{{index "UTF-16", emoji}}

Há uma complicação, porém: a representação do JavaScript usa 16 bits por elemento de string, o que pode descrever até 2^16^ caracteres diferentes. No entanto, o Unicode define mais caracteres que isso — cerca de duas vezes mais, neste momento. Então alguns caracteres, como muitos emoji, ocupam duas "posições de caractere" em strings JavaScript. Voltaremos a isso no [Capítulo ?](higher_order#code_units).

{{index "+ operator", concatenation}}

Strings não podem ser divididas, multiplicadas ou subtraídas. O operador `+` _pode_ ser usado nelas, não para somar, mas para _concatenar_ — colar duas strings juntas. A linha a seguir produzirá a string `"concatenate"`:

```{meta: "expr"}
"con" + "cat" + "e" + "nate"
```

Valores de string têm uma série de funções associadas (_métodos_) que podem ser usadas para realizar outras operações nelas. Falarei mais sobre isso no [Capítulo ?](data#methods).

{{index interpolation, backtick}}

Strings escritas com aspas simples ou duplas se comportam de forma muito semelhante — a única diferença está em qual tipo de aspas você precisa escapar dentro delas. Strings entre crases, geralmente chamadas de _((template literals))_, podem fazer mais algumas coisas. Além de poderem abranger várias linhas, elas também podem incorporar outros valores.

```{meta: "expr"}
`half of 100 is ${100 / 2}`
```

Quando você escreve algo dentro de `${}` em um template literal, seu resultado será calculado, convertido em uma string e incluído naquela posição. Este exemplo produz a string `"half of 100 is 50"`.

## Operadores unários

{{index operator, "typeof operator", type}}

Nem todos os operadores são símbolos. Alguns são escritos como palavras. Um exemplo é o operador `typeof`, que produz um valor de string nomeando o tipo do valor que você lhe dá.

```
console.log(typeof 4.5)
// → number
console.log(typeof "x")
// → string
```

{{index "console.log", output, "JavaScript console"}}

{{id "console.log"}}

Usaremos `console.log` no código de exemplo para indicar que queremos ver o resultado de avaliar algo. (Mais sobre isso no [próximo capítulo](program_structure).)

{{index negation, "- operator", "binary operator", "unary operator"}}

Os outros operadores mostrados até agora neste capítulo operavam todos sobre dois valores, mas `typeof` recebe apenas um. Operadores que usam dois valores são chamados de operadores _binários_, enquanto aqueles que recebem um são chamados de operadores _unários_. O operador menos (`-`) pode ser usado tanto como operador binário quanto como operador unário.

```
console.log(- (10 - 2))
// → -8
```

## Valores booleanos

{{index Boolean, operator, true, false, bit}}

Muitas vezes é útil ter um valor que distingue entre apenas duas possibilidades, como "sim" e "não" ou "ligado" e "desligado". Para esse propósito, JavaScript tem um tipo _Boolean_, que possui apenas dois valores, true e false, escritos como essas palavras.

### Comparação

{{index comparison}}

Aqui está uma forma de produzir valores booleanos:

```
console.log(3 > 2)
// → true
console.log(3 < 2)
// → false
```

{{index [comparison, "of numbers"], "> operator", "< operator", "greater than", "less than"}}

Os sinais `>` e `<` são os símbolos tradicionais para "é maior que" e "é menor que", respectivamente. Eles são operadores binários. Aplicá-los resulta em um valor booleano que indica se eles são verdadeiros neste caso.

Strings podem ser comparadas da mesma forma.

```
console.log("Aardvark" < "Zoroaster")
// → true
```

{{index [comparison, "of strings"]}}

A forma como strings são ordenadas é aproximadamente alfabética, mas não realmente o que você esperaria ver em um dicionário: letras maiúsculas são sempre "menores" que minúsculas, então `"Z" < "a"`, e caracteres não-alfabéticos (!, -, e assim por diante) também estão incluídos na ordenação. Ao comparar strings, JavaScript percorre os caracteres da esquerda para a direita, comparando os códigos ((Unicode)) um por um.

{{index equality, ">= operator", "<= operator", "== operator", "!= operator"}}

Outros operadores similares são `>=` (maior ou igual a), `<=` (menor ou igual a), `==` (igual a) e `!=` (diferente de).

```
console.log("Garnet" != "Ruby")
// → true
console.log("Pearl" == "Amethyst")
// → false
```

{{index [comparison, "of NaN"], NaN}}

Existe apenas um valor em JavaScript que não é igual a si mesmo, e esse é `NaN` ("not a number").

```
console.log(NaN == NaN)
// → false
```

`NaN` supostamente denota o resultado de uma computação sem sentido e, como tal, não é igual ao resultado de nenhuma _outra_ computação sem sentido.

### Operadores lógicos

{{index reasoning, "logical operators"}}

Existem também algumas operações que podem ser aplicadas a valores booleanos em si. JavaScript suporta três operadores lógicos: _e_, _ou_ e _não_. Eles podem ser usados para "raciocinar" sobre booleanos.

{{index "&& operator", "logical and"}}

O operador `&&` representa o _e_ lógico. É um operador binário, e seu resultado é verdadeiro apenas se ambos os valores dados a ele forem verdadeiros.

```
console.log(true && false)
// → false
console.log(true && true)
// → true
```

{{index "|| operator", "logical or"}}

O operador `||` denota o _ou_ lógico. Ele produz verdadeiro se qualquer um dos valores dados a ele for verdadeiro.

```
console.log(false || true)
// → true
console.log(false || false)
// → false
```

{{index negation, "! operator"}}

_Não_ é escrito como um ponto de exclamação (`!`). É um operador unário que inverte o valor dado a ele — `!true` produz `false` e `!false` produz `true`.

{{index precedence}}

Ao misturar esses operadores booleanos com aritmética e outros operadores, nem sempre é óbvio quando parênteses são necessários. Na prática, você geralmente consegue se virar sabendo que dos operadores que vimos até agora, `||` tem a menor precedência, depois vem `&&`, depois os operadores de comparação (`>`, `==`, e assim por diante), e depois o resto. Essa ordem foi escolhida de modo que, em expressões típicas como a seguinte, o mínimo de parênteses possível seja necessário:

```{meta: "expr"}
1 + 1 == 2 && 10 * 10 > 50
```

{{index "conditional execution", "ternary operator", "?: operator", "conditional operator", "colon character", "question mark"}}

O último operador lógico que veremos não é unário, nem binário, mas _ternário_, operando sobre três valores. É escrito com um ponto de interrogação e dois-pontos, assim:

```
console.log(true ? 1 : 2);
// → 1
console.log(false ? 1 : 2);
// → 2
```

Este é chamado de operador _condicional_ (ou às vezes apenas _o operador ternário_ já que é o único operador desse tipo na linguagem). O operador usa o valor à esquerda do ponto de interrogação para decidir qual dos dois outros valores "escolher". Se você escrever `a ? b : c`, o resultado será `b` quando `a` for verdadeiro e `c` caso contrário.

## Valores vazios

{{index undefined, null}}

Existem dois valores especiais, escritos `null` e `undefined`, que são usados para denotar a ausência de um valor _significativo_. Eles são valores em si, mas não carregam nenhuma informação.

Muitas operações na linguagem que não produzem um valor significativo produzem `undefined` simplesmente porque precisam produzir _algum_ valor.

A diferença de significado entre `undefined` e `null` é um acidente do design do JavaScript, e na maioria das vezes não importa. Nos casos em que você realmente precisa se preocupar com esses valores, recomendo tratá-los como praticamente intercambiáveis.

## Conversão automática de tipos

{{index NaN, "type coercion"}}

Na [introdução](intro), mencionei que JavaScript se esforça para aceitar quase qualquer programa que você lhe dá, mesmo programas que fazem coisas estranhas. Isso é bem demonstrado pelas seguintes expressões:

```
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

{{index "+ operator", arithmetic, "* operator", "- operator"}}

Quando um operador é aplicado ao tipo "errado" de valor, JavaScript converterá silenciosamente esse valor para o tipo que precisa, usando um conjunto de regras que frequentemente não são o que você quer ou espera. Isso é chamado de _((coerção de tipos))_. O `null` na primeira expressão se torna `0` e o `"5"` na segunda expressão se torna `5` (de string para número). Porém, na terceira expressão, `+` tenta concatenação de string antes de adição numérica, então o `1` é convertido para `"1"` (de número para string).

{{index "type coercion", [number, "conversion to"]}}

Quando algo que não mapeia para um número de forma óbvia (como `"five"` ou `undefined`) é convertido para um número, você obtém o valor `NaN`. Operações aritméticas subsequentes sobre `NaN` continuam produzindo `NaN`, então se você encontrar um desses em um lugar inesperado, procure por conversões de tipo acidentais.

{{index null, undefined, [comparison, "of undefined values"], "== operator"}}

Ao comparar valores do mesmo tipo usando o operador `==`, o resultado é fácil de prever: você deve obter verdadeiro quando ambos os valores são iguais, exceto no caso de `NaN`. Mas quando os tipos diferem, JavaScript usa um conjunto complicado e confuso de regras para determinar o que fazer. Na maioria dos casos, ele apenas tenta converter um dos valores para o tipo do outro valor. No entanto, quando `null` ou `undefined` aparece em qualquer lado do operador, ele produz verdadeiro apenas se ambos os lados forem `null` ou `undefined`.

```
console.log(null == undefined);
// → true
console.log(null == 0);
// → false
```

Esse comportamento é frequentemente útil. Quando você quer testar se um valor tem um valor real em vez de `null` ou `undefined`, você pode compará-lo com `null` usando o operador `==` ou `!=`.

{{index "type coercion", [Boolean, "conversion to"], "=== operator", "!== operator", comparison}}

E se você quiser testar se algo se refere ao valor preciso `false`? Expressões como `0 == false` e `"" == false` também são verdadeiras por causa da conversão automática de tipos. Quando você _não_ quer que nenhuma conversão de tipo aconteça, existem dois operadores adicionais: `===` e `!==`. O primeiro testa se um valor é _precisamente_ igual ao outro, e o segundo testa se não é precisamente igual. Assim, `"" === false` é falso, como esperado.

Recomendo usar os operadores de comparação de três caracteres defensivamente para prevenir conversões de tipo inesperadas que possam lhe causar problemas. Mas quando você tem certeza de que os tipos em ambos os lados serão os mesmos, não há problema em usar os operadores mais curtos.

### Curto-circuito de operadores lógicos

{{index "type coercion", [Boolean, "conversion to"], operator}}

Os operadores lógicos `&&` e `||` lidam com valores de diferentes tipos de uma forma peculiar. Eles converterão o valor do seu lado esquerdo para o tipo booleano para decidir o que fazer, mas dependendo do operador e do resultado dessa conversão, eles retornarão o valor _original_ do lado esquerdo ou o valor do lado direito.

{{index "|| operator"}}

O operador `||`, por exemplo, retornará o valor à sua esquerda quando esse valor puder ser convertido para verdadeiro e retornará o valor à sua direita caso contrário. Isso tem o efeito esperado quando os valores são booleanos e faz algo análogo para valores de outros tipos.

```
console.log(null || "user")
// → user
console.log("Agnes" || "user")
// → Agnes
```

{{index "default value"}}

Podemos usar essa funcionalidade como uma forma de recorrer a um valor padrão. Se você tem um valor que pode estar vazio, pode colocar `||` depois dele com um valor de substituição. Se o valor inicial puder ser convertido para falso, você obterá a substituição em vez dele. As regras para converter strings e números para valores booleanos estabelecem que `0`, `NaN` e a string vazia (`""`) contam como falso, enquanto todos os outros valores contam como verdadeiro. Isso significa que `0 || -1` produz `-1`, e `"" || "!?"` produz `"!?"`.

{{index "?? operator", null, undefined}}

O operador `??` se assemelha a `||` mas retorna o valor da direita apenas se o da esquerda for `null` ou `undefined`, não se for algum outro valor que possa ser convertido para `false`. Frequentemente, isso é preferível ao comportamento de `||`.

```
console.log(0 || 100);
// → 100
console.log(0 ?? 100);
// → 0
console.log(null ?? 100);
// → 100
```

{{index "&& operator"}}

O operador `&&` funciona de forma similar, mas ao contrário. Quando o valor à sua esquerda é algo que se converte para falso, ele retorna esse valor; caso contrário, retorna o valor à sua direita.

Outra propriedade importante desses dois operadores é que a parte à sua direita é avaliada apenas quando necessário. No caso de `true || X`, não importa o que `X` seja — mesmo que seja um pedaço de programa que faz algo _terrível_ — o resultado será verdadeiro, e `X` nunca é avaliado. O mesmo vale para `false && X`, que é falso e ignorará `X`. Isso é chamado de _((avaliação de curto-circuito))_.

{{index "ternary operator", "?: operator", "conditional operator"}}

O operador condicional funciona de forma similar. Do segundo e terceiro valores, apenas o que é selecionado é avaliado.

## Resumo

Vimos quatro tipos de valores JavaScript neste capítulo: números, strings, booleanos e valores indefinidos. Tais valores são criados digitando seu nome (`true`, `null`) ou valor (`13`, `"abc"`).

Você pode combinar e transformar valores com operadores. Vimos operadores binários para aritmética (`+`, `-`, `*`, `/` e `%`), concatenação de strings (`+`), comparação (`==`, `!=`, `===`, `!==`, `<`, `>`, `<=`, `>=`) e lógica (`&&`, `||`, `??`), bem como vários operadores unários (`-` para negar um número, `!` para negar logicamente e `typeof` para encontrar o tipo de um valor) e um operador ternário (`?:`) para escolher um de dois valores com base em um terceiro valor.

Isso lhe dá informação suficiente para usar JavaScript como uma calculadora de bolso, mas não muito mais. O [próximo capítulo](program_structure) começará a unir essas expressões em programas básicos.
