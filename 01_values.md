{{meta {docid: values}}}

# Valores, Tipos, e Operadores

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

> Sob a superfície da máquina, o programa se move. Sem esforço, se expande e se contrai. Em grande harmonia, elétrons se espalham e se reagrupam. As formas no monitor são nada mais que ondulações na água. A essência permanece invisível abaixo.
>
> — Master Yuan-Ma, The Book of Programming

quote}}

{{index "Yuan-Ma", "Book of Programming"}}

{{figure {url: "img/chapter_picture_1.jpg", alt: "Mar de bits", chapter: framed}}}

{{index "binary data", data, bit, memory}}

Dentro do mundo do computador, só existem dados. Você pode ler dados, modificar dados, criar novos dados — mas aquilo que não é dado não pode ser mencionado. Todos esses dados são armazenados como longas sequências de bits e são assim fundamentalmente iguais.

{{index CD, signal}}

_Bits_ são quaisquer tipos de coisas com dois valores possíveis, geralmente descritos como zeros e uns. Dentro do computador, eles tomam formas como uma carga elétrica alta ou baixa, um sinal forte ou fraco, ou um ponto na superfície de um CD que tem brilho ou não. Qualquer pedaço de informação pode ser reduzido a uma sequência de zeros e unse, portanto, representado em bits.

{{index "binary number", radix, "decimal number"}}

Por exemplo, podemos expressar o número 13 em bits. Funciona do mesmo jeito como uma representação decimal mas ao invés de 10 dígitos diferentes, você tem apenas dois e o peso de cada um aumenta por um fator de 2, da direita para a esquerda. Estes são os bits que formam o número 13, com o peso de cada um logo abaixo:

```{lang: null}
   0   0   0   0   1   1   0   1
 128  64  32  16   8   4   2   1
```

Então, este é o número binário 00001101, ou 8 + 4 + 1, ou 13.

## Valores

{{index memory, "volatile data storage", "hard drive"}}

Imagine um mar de bits — um oceano deles. Um típico computador moderno tem mais de 30 bilhões de bits em sua memória volátil. A memória não-volátil (o disco rígido ou equivalente) tende a ter algumas ordens de magnitude a mais.

Para podermos trabalhar com quantidades tão altas de bits sem nos perdermos, precisamos separá-los em blocos que representam pedaços de informação. Em um ambiente JavaScript, esses blocos são chamados de _valores_. Embora todos os valores sejam feitos de bits, eles têm diferentes papeis. Cada valor tem um _tipo_ que determina seu papel. Alguns valores são números, alguns são pedaços de texto, alguns são funções, e por aí vai.

{{index "garbage collection"}}

Para criar um valor, você deve simplesmente invocar o seu nome. Isso é bastante conveniente. Você não precisa reunir nenhum material extra ou pagar por eles. Você apenas chama por ele e _woosh_, você o tem. Eles realmente não são criados do nada, claro. Cada valor tem que ser armazenado em algum lugar e se você quiser usar uma quantidade enorme deles ao mesmo tempo, você pode ficar sem memória. Felizmente, esse é um problema apenas se você precisar de todos simultaneamente. Assim que você não usar mais um valor, ele irá sumir, deixando para trás seus bits para serem reciclados como material de construção para a próxima geração de valores.

Esse capítulo introduz os átomos dos programas JavaScript, isto é, os tipos simples de valores e os operadores que podem agir em tais valores.

## Números

{{index syntax, number, [number, notation]}}

Valores do tipo _número_ são, sem surpresa, valores numéricos. Em um programa JavaScript, eles são escritos dessa forma:

```
13
```

{{index "binary number"}}

Use isso em um programa e isso fará com que o padrão em bits para o número 13 passe a existir dentro da memória do computador.

{{index [number, representation], bit}}

O JavaScript usa um número limitado de bits, mais especificamente 64 deles, para guardar um único valor numérico. Existem apenas alguns poucos padrões que você pode fazer com 64 bits, o que significa que a quantidade de números diferentes que podem ser representados é limitada. Para um dígito decimal _N_, a quantidade de números que podem ser representados é de 10^n^. Da mesma forma, dados 64 dígitos binários, você pode representar 2^64^ números diferentes, o que é mais ou menos 18 quintilhões (um 18 com 18 zeros depois dele). É muita coisa. 

A memória do computador costumava ser muito menor, e as pessoas tendiam a usar grupos de 8 ou 16 bits para representar os números. Era muito fácil de ultrapassar acidentalmente esses números -  para conseguir um número que não se encaixava na quantidade de bits dada. Hoje, mesmo computadores que cabem no seu bolso tem muita memória disponível, então você é livre para usar blocos de 64-bits, e você só vai precisar se preocupar com espaço quando lidar com números realmente astronômicos.

{{index sign, "floating-point number", "fractional number", "sign bit"}}

Entretanto, nem todos os números inteiros menores do que 18 quintilhões cabem em um número no JavaScript. Os bits também armazenam números negativos, e um desses bits indica o sinal do número. Um grande problema é que números não inteiros também precisam ser representados. 
Para isso, alguns dos bits são usados para armazenar a posição do ponto decimal. Então, o maior número inteiro que pode ser armazenado está por volta de 9 quatrilhões (15 zeros) - que ainda é extremamente grande.

{{index [number, notation]}}

Números fracionários são escritos usando um ponto:

```
9.81
```

{{index exponent, "scientific notation", [number, notation]}}

Para números muito grandes ou pequenos, você também pode usar notação científica adicionando um "e" (de "expoente") seguido pelo valor do expoente:

```
2.998e8
```

Isso é 2.998 x 10^⁸^ = 299,800,000.

{{index pi, [number, "precision of"], "floating-point number"}}

Cálculos com números inteiros menores que os 9 quadrilhões mencionados anteriormente, serão sempre precisos. Infelizmente, cálculos com número fracionários normalmente não são. Assim como π (pi) não pode ser expresso de forma precisa por uma quantidade finita de dígitos decimais, muitos números perdem sua precisão quando existem apenas 64 bits disponíveis para armazená-los. Isso é vergonhoso, mas causa problemas reais apenas em situações específicas. O importante é estar ciente disso e tratar números fracionários como aproximações e não como valores precisos.

### Aritmética

{{index syntax, operator, "binary operator", arithmetic, addition, multiplication}}

A principal coisa a se fazer com números são cálculos aritméticos. Operações aritméticas como adição ou multiplicação recebem dois valores numéricos e produzem um novo número a partir deles. É assim que eles se parecem no JavaScript:

```
100 + 4 * 11
```

{{index [operator, application], asterisk, "plus character", "* operator", "+ operator"}}

Os símbolos `+` e `*` são chamados de _operadores_. O primeiro se refere à adição, e o segundo à multiplicação. Colocar um operador entre dois valores irá aplicá-lo a esses valores e produzirá um novo valor.

{{index grouping, parentheses, precedence}}

Mas esse exemplo significa "adicione 4 e 100, e multiplique o resultado por 11," ou a multiplicação é feita antes da adição? Como você deve ter adivinhado, a multiplicação acontece antes. Mas como na matemática, você pode mudar isso envolvendo a adição em parênteses:

```
(100 + 4) * 11
```

{{index "dash character", "slash character", division, subtraction, minus, "- operator", "/ operator"}}

Para subtração, há o operador `-`, e a divisão pode ser feita com o operador `/`.

Quando os operadores aparecem juntos sem parênteses, a ordem em que eles serão aplicados é determinada pela _precedência_ deles. O exemplo mostra que a multiplicação ocorre antes da adição. O operador `/` possui a mesma precedência que `*`. Da mesma forma, os operadores `+` e `-` possuem a mesma precedência. Quando múltiplos operadores de mesma precedência aparecem próximos uns aos outros, como por exemplo em `1 - 2 + 1`, eles são aplicados da esquerda para a direita: `(1 - 2) + 1`.

Essas regras de precedência não são algo que você deve se preocupar. Quando estiver em dúvida, apenas adicione parênteses.

{{index "modulo operator", division, "remainder operator", "% operator"}}

Existe mais um operador aritmético, que talvez você não reconheça imediatamente. O símbolo `%` é usado para representar a operação de _resto_. `X % Y` é o resto da divisão de `X` por `Y`. Por exemplo, `314 % 100` produz `14` e `144 % 12` produz `0`. A precedência do operador resto é a mesma da multiplicação e divisão. Você também verá com frequência esse operador sendo chamado de _modulo_.

### Números especiais

{{index [number, "special values"]}}

Existem três valores especiais no JavaScript que são considerados números mas não se comportam como números normais.

{{index infinity}}

Os dois primeiros são `Infinity` e `-Infinity`, que representam os infinitos positivo e negativo. `Infinity - 1` continua sendo `Infinity`, e por aí vai. Entretanto, não confie muito em cálculos baseados no valor infinito. Esse valor não é matematicamente sólido e rapidamente nos levará ao próximo número especial: `NaN`.

{{index NaN, "not a number", "division by zero"}}

`NaN` significa “_not a number_” (não é um número), embora ele seja um valor do tipo número. Você receberá esse valor como resultado quando, por exemplo, tentar calcular `0 / 0` (zero dividido por zero), `Infinity - Infinity` ou então realizar quaisquer outras operações numéricas que não resultem em um número significativo.

## Strings

{{indexsee "grave accent", backtick}}

{{index syntax, text, character, [string, notation], "single-quote character", "double-quote character", "quotation mark", backtick}}

O próximo tipo básico de dado é a _String_. _Strings_ são usadas para representar texto. Elas são escritas envolvendo o seu conteúdo entre aspas.

```
`Down on the sea`
"Lie on the ocean"
'Float on the ocean'
```

Você pode usar aspas simples, aspas duplas ou crases para sinalizar strings, contanto que os símbolos usados no começo e no final da string sejam iguais.

{{index "line break", "newline character"}}

Quase tudo pode ser colocado entre aspas, e o JavaScript criará um valor do tipo _String_ com isso. Entretanto alguns caracteres são mais difíceis. Você pode imaginar como deve ser difícil colocar aspas entre aspas. _Newlines_ (qos caracteres usados quando você aperta _Enter_), só podem ser incluídos sem "escapar" quando a string está envolvida em crases (`` ` ``).

{{index [escaping, "in strings"], "backslash character"}}

Para que seja possível incluir tais caracteres em uma string, a seguinte notação é utilizada: sempre que um caractere de barra invertida (`\`) for encontrado dentro de um texto entre aspas, ele indicará que o caractere seguinte possui um significado especial. Isso é chamado de _escapar_ o caractere. Uma aspa que aparece logo após uma barra invertida não será o final da _String_, mas sim parte dela. Quando um caractere `n` aparece após uma barra invertida, ele é interpretado como uma quebra de linha. Da mesma forma, um `t` após uma barra invertida significa um caractere de tabulação. Considere a seguinte string:

```
"This is the first line\nAnd this is the second"
```

O texto na verdade será:

```{lang: null}
This is the first line
And this is the second
```

Existem, com certeza, situações onde você quer que a barra invertida em uma _String_ seja apenas uma barra invertida, não um código especial. Se duas barras invertidas estiverem seguidas uma da outra, elas se anulam e apenas uma será deixada no valor da string resultante. É assim que a string “`A newline character is written like “\n”.`” pode ser representada:

```
"A newline character is written like \"\\n\"."
```

{{id unicode}}

{{index [string, representation], Unicode, character}}

Strings também devem ser modeladas como uma série de bits para poderem existir dentro do computados. A forma como o JavaScript faz isso é baseada no padrão _Unicode_. Esse padrão atribui um número para praticamente cada caractere que você pode algum dia precisar, incluindo caracteres Gregos, Arábicos, Japoneses, Armênios, etc. Se temos um número para cada caractere, uma string pode ser descrita por uma sequência de números.

{{index "UTF-16", emoji}}

E é isso que o JavaScript faz. Porém, há uma complicação: a representação do JavaScript usa 16 bits por elemento string, que pode representar até  2^16^ caracteres diferentes, enquanto o Unicode define mais caracteres do que isso — por volta do dobro, nesse momento. Então alguns caracteres, como muitos emojis, podem tomar até duas "posições de caractere" em strings JavaScript. Nós retornaremos a esse assunto no [Capítulo-?](higher_order#code_units).

{{index "+ operator", concatenation}}

_Strings_ não podem ser divididas, multiplicadas nem subtraídas, mas o operador `+` pode ser usado nelas. Ele não efetua a adição, mas sim _concatena_ — junta duas _Strings_ em uma só. O exemplo a seguir produzirá a string `"concatenate"`:

```
"con" + "cat" + "e" + "nate"
```

Os valores string tem várias funções associadas (_métodos_) que podem ser usadas para realizar outras operações neles. Voltaremos a eles no [Capítulo ?](data#methods).

{{index interpolation, backtick}}

Strings escritas com aspas duplas ou simples se comportam basicamente da mesma forma—a única diferença está em qual tipo de aspas você precisa escapar dentro delas. Strings definidas usando crases, geralmente chamadas de _template literals_, podem fazer alguns outros truques. Além de poderem ter quebras de linha, elas podem também conter outros valores.

```
`half of 100 is ${100 / 2}`
```

Quando você escreve algo dentro de `${}` em uma _template literal_, o seu resultado será computado, convertido para _String_ e incluído naquela posição. O exemplo acima resulta em "_half of 100 is 50_".

## Operadores Unários

{{index operator, "typeof operator", type}}

Nem todos os operadores são símbolos. Alguns são escritos como palavras. Um exemplo é o operador `typeof`, que produz um valor _String_ contendo o nome do tipo do valor que você está verificando.

```
console.log(typeof 4.5)
// → number
console.log(typeof "x")
// → string
```

{{index "console.log", output, "JavaScript console"}}

{{id "console.log"}}

Nós vamos usar `console.log` nos exemplos para indicar que desejamos ver o resultado de algo. Veremos mais sobre isso no [próximo capítulo](program_structure).

{{index negation, "- operator", "binary operator", "unary operator"}}

Os outros operadores que vimos operavam em dois valores, mas `typeof` espera apenas um. Operadores que usam dois valores são chamados de operadores _binários_, enquanto aqueles que recebem apenas um são chamados de operadores _unários_. O operador `-` pode ser usado tanto como binário quanto como unário.

```
console.log(- (10 - 2))
// → -8
```

## Valores Booleanos

{{index Boolean, operator, true, false, bit}}

É frequentemente útil ter um valor que distingue entre apenas duas possibilidades como, por exemplo, "sim" e "não" ou "ligado" e "desligado". Para esse propósito, o JavaScript possui o tipo _Booleano_, que tem apenas dois valores: verdadeiro e falso (`true` e `false`).

### Comparações

{{index comparison}}

Essa é uma forma de produzir valores Booleanos:

```
console.log(3 > 2)
// → true
console.log(3 < 2)
// → false
```

{{index [comparison, "of numbers"], "> operator", "< operator", "greater than", "less than"}}

Os sinais `>` e `<` são tradicionalmente símbolos para representar "é maior que" e "é menor que", respectivamente. Eles são operadores binários. Aplicar ele entre dois valores resulta em um valor _Booleano_ que indica se o resultado é verdadeiro ou falso nesse caso.

Strings podem ser comparadas da mesma forma.

```
console.log("Aardvark" < "Zoroaster")
// → true
```

{{index [comparison, "of strings"]}}

A forma na qual as _Strings_ são ordenadas é mais ou menos alfabética, mas não exatamente o que você esperaria ver em um dicionário: letras maiúsculas serão sempre “menores” que as minúsculas, então `“Z” < “a”`,  e caracteres não alfabéticos (!, -, e assim por diante) também são incluídos na ordenação. Quando compara strings, o JavaScript percorre os caracteres da esquerda para a direita, comparando o código Unicode de cada um.

{{index equality, ">= operator", "<= operator", "== operator", "!= operator"}}

Outros operadores similares são `>=` (maior que ou igual a), `<=` (menor que ou igual a), `==` (igual a), and `!=` (diferente de).

```
console.log("Itchy" != "Scratchy")
// → true
console.log("Apple" == "Orange")
// → false
```

{{index [comparison, "of NaN"], NaN}}

Existe apenas um valor no JavaScript que não é igual a ele mesmo, que é o valor `NaN` ( _"not a number"_, "não é um número" em Português).

```
console.log(NaN == NaN)
// → false
```

`NaN` é supostamente usado para indicar o resultado de alguma operação que não tenha sentido e, portanto, ele não será igual ao resultado de quaisquer _outras_ operações sem sentido.

### Operadores Lógicos

{{index reasoning, "logical operators"}}

Existem também operações que podem ser aplicadas aos valores _Booleanos_. O JavaScript dá suporte a três operadores lógicos: _and_, _or_ e _not_, que podem ser traduzidos para o português como _e_, _ou_ e _não_. Eles podem ser usados para "pensar" de forma lógica sobre _Booleanos_.

{{index "&& operator", "logical and"}}

O operador `&&` representa o valor lógico _and_ ou, em português, _e_. Ele é um operador binário, e seu resultado é apenas verdadeiro se ambos os valores dados à ele forem verdadeiros.

```
console.log(true && false)
// → false
console.log(true && true)
// → true
```

{{index "|| operator", "logical or"}}

O operador `||` indica o valor lógico _or_ ou, em português, _ou_. Ele produz um valor verdadeiro se qualquer um dos valores dados à ele for verdadeiro.

```
console.log(false || true)
// → true
console.log(false || false)
// → false
```

{{index negation, "! operator"}}

_Not_, em português _não_, é escrito usando um ponto de exclamação (`!`). Ele é um operador unário que inverte o valor que é dado à ele — `!true` produz `false` e `!false` produz `true`.

{{index precedence}}

Quando misturamos esses operadores _Booleanos_ com operadores aritméticos e outros tipos de operadores, nem sempre é óbvio quando parênteses são necessários ou não. Na prática, você normalmente não terá problemas sabendo que, dos operadores que vimos até agora, `||` possui a menor precedência, depois vem o operador `&&`, em seguida vêm os operadores de comparação (`>`, `==`, etc) e então os outros operadores. Essa ordem foi escolhida de tal forma que, em expressões típicas como o exemplo a seguir, poucos parênteses são realmente necessários:

```
1 + 1 == 2 && 10 * 10 > 50
```

{{index "conditional execution", "ternary operator", "?: operator", "conditional operator", "colon character", "question mark"}}

O último operador lógico que iremos discutir não é unário nem binário, mas _ternário_, operando em três valores. Ele é escrito usando um ponto de interrogação e dois pontos, dessa forma:

```
console.log(true ? 1 : 2);
// → 1
console.log(false ? 1 : 2);
// → 2
```

Esse operador é chamado de operador _condicional_ (ou algumas vezes apenas de _ternário_, já que é o único operador desse tipo na linguagem). O valor presente à esquerda do ponto de interrogação “seleciona” qual dos outros dois valores será retornado. Quando ele for verdadeiro, o valor do meio é escolhido e, quando for falso, o valor à direita é retornado.

## Valores vazios

{{index undefined, null}}

Existem dois valores especiais, `null` e `undefined`, que são usados para indicar a ausência de um valor com significado _relevante_. Eles são valores por si sós, mas não carregam nenhum tipo de informação.

Muitas operações na linguagem que não produzem um valor com significado (você verá alguns mais para frente) retornarão `undefined` simplesmente porque eles precisam retornar _algum_ valor.

A diferença de significado entre `undefined` e `null` é um acidente que foi criado no design do JavaScript, e não faz muita diferença na maioria das vezes. Nos casos em que você deve realmente se preocupar com esses valores, recomendo tratá-los como valores idênticos.

## Conversão Automática de Tipo

{{index NaN, "type coercion"}}

Na introdução, mencionei que o JavaScript tenta fazer o seu melhor para aceitar quase todos os programas que você fornecer, inclusive aqueles que fazem coisas bem estranhas. Isso pode ser demonstrado com as seguintes expressões:

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

Quando um operador é aplicado a um tipo de valor “errado”, o JavaScript converterá silenciosamente esse valor para o tipo que ele precisar, usando uma série de regras que muitas vezes não é o que você deseja ou espera. Esse comportamento é chamado de _coerção de tipo_. O `null` da primeira expressão se torna `0` e o `"5"` na segunda expressão se torna `5` (de string a número). Já na terceira expressão, o operador `+` tenta efetuar uma concatenação de _String_ antes de tentar executar a adição numérica e, por isso, o número `1` é convertido para `"1"` (de número para string).

{{index "type coercion", [number, "conversion to"]}}

Quando algo que não pode ser mapeado como um número de forma óbvia (tal como `"five"` ou `undefined`) é convertido para um número, você receberá o valor `NaN`. Quaisquer outras operações aritméticas realizadas com `NaN` continuam produzindo `NaN`, então se você perceber que está recebendo esse valor em algum lugar inesperado, procure por conversões de tipo acidentais.

{{index null, undefined, [comparison, "of undefined values"], "== operator"}}

Quando comparamos valores do mesmo tipo usando o operador `==`, o resultado é fácil de se prever: você deverá receber verdadeiro quando ambos os valores forem o mesmo, exceto no caso de `NaN`. Porém, quando os tipos forem diferentes, o JavaScript usa um conjunto de regras complicadas e confusas para determinar o que fazer. Na maioria dos casos, ele tenta apenas converter um dos valores para o mesmo tipo do outro valor. Entretanto, quando `null` ou `undefined` aparece em algum dos lados do operador, será produzido verdadeiro apenas se ambos os lados forem `null` ou `undefined`.

```
console.log(null == undefined);
// → true
console.log(null == 0);
// → false
```

Esse comportamento é normalmente bastante útil. Quando quiser testar se um valor possui um valor real ao invés de `null` ou `undefined`, você pode simplesmente compará-lo a `null` com o operador `==` (ou `!=`).

{{index "type coercion", [Boolean, "conversion to"], "=== operator", "!== operator", comparison}}

Mas e se você quiser testar se algo se refere ao valor preciso `false`? As regras de conversão de _Strings_ e números para valores _Booleanos_ dizem que `0`, `NaN` e strings vazias (`""`) contam como `false`, enquanto todos os outros valores contam como `true`. Por causa disso, expressões como `0 == false` e `"" == false` também retornam `true`. Quando você _não_ quer qualquer conversão automática de tipos acontecendo, existem dois outros tipos de operadores: `===` e `!==`. O primeiro testa se o valor é _precisamente_ igual ao outro, e o segundo testa se ele não é precisamente igual. Então `"" === false` é falso como esperado.

Eu recomento usar os operadores de comparação de três caracteres defensivamente, para prevenir conversões inesperadas de tipo que o farão tropeçar. Mas quando você tem certeza de que os tipos de ambos os lados serão iguais, não há problemas em usar os operadores mais curtos.

### O curto circuito dos operadores lógicos

{{index "type coercion", [Boolean, "conversion to"], operator}}

Os operadores lógicos `&&` e `||` lidam com valores de diferentes tipos de uma maneira bem peculiar. Eles irão converter o valor à sua esquerda para o tipo _Booleano_ para decidir o que fazer, mas dependendo do operador e do resultado daquela conversão, eles ou retornam o valor _original_ à esquerda, ou o valor à direita.

{{index "|| operator"}}

O operador `||`, por exemplo, irá retornar o valor à sua esquerda quando ele puder ser convertido para `true`, e retornará o valor à sua direita caso isso não ocorra. Isso tem o efeito esperado quando os valores são _Booleanos_, e faz algo análogo para valores de outros tpos.

```
console.log(null || "user")
// → user
console.log("Agnes" || "user")
// → Agnes
```

{{index "default value"}}

Podemos usar essa funcionalidade como forma de garantir um valor padrão. Se você tem um valor que pode estar vazio, você pode usar `||` após ele com um valor a ser substituído. Se o valor inicial puder ser convertido para `false`, então você receberá o valor reserva.

{{index "&& operator"}}

O operador `&&` trabalha de forma similar, mas ao contrário. Quando o valor à sua esquerda é algo que se torne `false`, ele retorna o valor e caso contrário, ele retorna o valor à sua direita.

Outra propriedade importante destes dois operadores é que a expressão à direita é avaliada somente quando necessário. No caso de `true || X`, não importa o que `X` é - mesmo que seja algo que faça uma coisa *terrível* - o resultado será verdadeiro, e `X` nunca será avaliado. O mesmo acontece para `false && X`, que é falso, e vai ignorar `X`. Isso é chamado de _avaliação de curto-circuito_.

{{index "ternary operator", "?: operator", "conditional operator"}}

O operador condicional trabalha de forma similar. Dentre o segundo e o terceiro valor, apenas o valor que é selecionado será avaliado.

## Resumo

Nós vimos quatro tipos de valores do JavaScript neste capítulo. Números, _Strings_, _Booleanos_ e valores indefinidos.

Tais valores são criados digitando seu nome (`true`, `null`) ou valores (`13`, `"abc"`). Você pode combinar e transformar valores com operadores. Nós vimos operadores binários para operações aritméticas (`+`, `-`, `*`, `/`, e `%`), para concatenação de _String_ (`+`), comparação (`==`, `!=`, `===`, `!==`, `<`, `>`, `<=`, `>=`) e lógica (`&&`, `||`), assim como alguns operadores unários (`-` para negativar um número, `!` para negar logicamente, e `typeof` para encontrar o tipo do valor) e o operador ternario (`?:`) para retornar um de dois valores, baseando-se em um terceiro valor.

Isto lhe dá informação suficiente para usar o JavaScript como uma calculadora de bolso, mas não muito mais que isso. O próximo capítulo vai começar a amarrar essas operações dentro de programas básicos.
