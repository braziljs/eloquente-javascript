# Valores, Tipos e Operadores

> Abaixo da parte superficial da máquina, o programa se movimenta. Sem esforço, ele se expande e se contrai. Com grande harmonia, os elétrons se espalham e se reagrupam. As formas no monitor são como ondulações na água. A essência permanece invisível por baixo.
>
> — Master Yuan-Ma, The Book of Programming

Dentro do mundo do computador, há somente dados. Você pode ler, modificar e criar novos dados, entretanto, qualquer coisa que não seja um dado simplesmente não existe. Todos os dados são armazenados em longas sequências de bits e são, fundamentalmente, parecidos.

Bits podem ser qualquer tipo de coisa representada por dois valores, normalmente descritos como zeros e uns. Dentro do computador, eles representam formas tais como uma carga elétrica alta ou baixa, um sinal forte ou fraco ou até um ponto na superfície de um CD que possui ou não brilho. Qualquer pedaço de informação pode ser reduzido a uma sequência de zeros e uns e, então, representados por bits.

Como um exemplo, pense sobre a maneira que o número 13 pode ser armazenado em bits. A forma usual de se fazer esta analogia é a forma de escrevermos números decimais, mas ao invés de 10 dígitos, temos apenas 2. E, ao invés de o valor de um dígito aumentar dez vezes sobre o dígito após ele, o valor aumenta por um fator 2. Estes são os bits que compõem o número treze, com o valor dos dígitos mostrados abaixo deles:

Como um exemplo, pense em como você poderia mostrar o número 13 em bits. Isso funciona da mesma forma na qual você escreve números decimais, mas ao invés de usar 10 dígitos diferentes, você possui apenas dois dígitos, sendo que o peso de cada bit aumenta em um fator de 2, começando da direita para a esquerda. Estes são os bits que compõem o número 13, com os pesos de cada dígito mostrados abaixo deles:

```
  0   0   0   0   1   1   0   1
128  64  32  16   8   4   2   1
```

Então, este é o número binário 00001101, ou 8 + 4 + 1, que equivale a 13.

## Valores

Imagine um mar de bits, um oceano deles. Um computador moderno possui mais de trinta bilhões de bits em seu armazenamento volátil de dados. Já em armazenamento de dados não voláteis, sendo eles o disco rígido ou algo equivalente, tende a ter uma ordem de magnitude ainda maior.

![Bit Sea](../img/bit-sea.png)

Para que seja possível trabalhar com tais quantidades de bits sem ficar perdido, você pode separá-los em partes que representam pedaços de informação. No ambiente JavaScript, essas partes são chamadas de _valores_. Embora todos os valores sejam compostos por bits, cada valor exerce um papel diferente e todo valor possui um tipo que determina o seu papel. Existem seis tipos básicos de valores no JavaScript: números, strings, Booleanos, objetos, funções e valores indefinidos.

Para criar um valor, você deve simplesmente invocar o seu nome. Isso é bastante conveniente, pois você não precisa de nenhum material extra para construí-los e muito menos ter que pagar algo por eles. Você só chama por ele e pronto, você o tem. É claro que eles não são criados do ar. Todo valor precisa estar armazenado em algum lugar e, se você quiser usar uma quantidade enorme deles ao mesmo tempo, você pode acabar ficando sem bits. Felizmente, esse é um problema apenas se você precisa deles simultaneamente. A medida que você não utiliza um valor, ele será dissipado, fazendo que que seus bits sejam reciclados, disponibilizando-os para serem usados na construção de outros novos valores.

Esse capítulo introduz os elementos que representam os átomos dos programas JavaScript, que são os simples tipos de valores e os operadores que podem atuar sobre eles.

## Números

Valores do tipo _número_ são, sem muitas surpresas, valores numéricos. Em um programa JavaScript, eles são escritos assim:

```js
13
```

Coloque isso em um programa e isso fará com que padrões de bits referentes ao número 13 sejam criados e passe a existir dentro da memória do computador.

O JavaScript utiliza um número fixo de bits, mais precisamente 64 deles, para armazenar um único valor numérico. Existem apenas algumas maneiras possíveis que você pode combinar esses 64 bits, ou seja, a quantidade de números diferentes que podem ser representados é limitada. Para um valor _N_ de dígitos decimais, a quantidade de números que pode ser representada é _10^N_ [TODO: arrumar exponencial]. De forma similar, dado 64 dígitos binários, você pode representar 2⁶⁴ número diferentes, que é aproximadamente 18  quintiliões (o número 18 com 18 zeros após ele). Isso é muito.

Isto é muito. Números exponenciais tem o hábito de ficarem grandes. Já foi o tempo que as memórias eram pequenas e as pessoas tendiam a usar grupos de 8 ou 16 bits para representar estes números. Era fácil de acidentalmente "transbordarem" estes pequenos números. Hoje, temos o luxo de somente se preocupar quando realmente lidamos com números astronômicos.

Todos os números abaixo de 18 quintilhões cabem no JavaScript *number*. Estes bits também armazenam números negativos, onde um destes sinais é usado para guardar o sinal do número. Uma grande questão é que números não inteiros podem ser representados. Para fazer isso, alguns bits são usados para guardar a posição do ponto decimal do número. O maior número não inteiro que pode ser armazenado está na faixa de 9 quadrilhões (15 zeros) - que continua muito grande.

Números fracionados são escritos usando o ponto:

```javascript

9.81

```

Para grandes números ou números pequenos, podemos usar a notação científica adicionando um 'e', seguido do expoente:

```javascript

2.998e8

```

Isto é 2.998 x 10⁸ = 299800000.

Cálculos com números inteiros (também chamados *integers*) menores que os mencionados 9 quadrilhões são garantidos de sempre serem precisos. Infelizmente cálculos com números fracionários não são, geralmente. Como π (pi) não pode ser precisamente expresso por uma quantidade finita de dígitos decimais, vários números perdem a precisão quando somente 64 bits estão disponíveis para armazená-los. Isto é uma vergonha, porém causa problemas somente em situações muito específicas. O importante é estar ciente disto e tratar números fracionários digitais como aproximações, não como valores precisos.

## Aritmética

A principal coisa a se fazer com números é aritmética. Operações aritméticas como adição e multiplicação pegam o valor de dois números e produzem um novo número a partir deles. Aqui vemos como eles são no JavaScript:

```javascript

100 + 4 * 11

```

Os símbolos `+` e `*` são chamados *operadores*. O primeiro representa adição, e o segundo representa multiplicação. Colocando um operador entre 2 valores faz com que se aplique o mesmo, produzindo um novo valor.

O próximo exemplo significa "adicione 4 e 100, e multiplique o resultado por 11", ou é a multiplicação feita antes da adição? Como você deve ter pensado, a multiplicação acontece primeiro. Mas, como na matemática, isto pode ser mudado envolvendo a adição com os parênteses:

```javascript

(100 + 4) * 11

```

Para subtração, este é o operador `-`, e para a divisão usamos este operador `/`.

Quando operadores aparecem juntos sem parênteses, a ordem que eles vão ser aplicados é determinada pela *precedência* dos operadores. O exemplo mostra que a multiplicação vem antes da adição. `/` tem a mesma precedência de `*`. Igualmente para `+` e `-`. Quando múltiplos operadores com a mesma precedência estão próximos uns aos outros (como em `1 - 2 + 1`), eles são aplicados da esquerda para a direita.

Estas regras de precedência não é algo que você deva se preocupar. Quando em dúvida, somente adicione parênteses.

Há mais um operador aritmético, que possivelmente é menos familiar. O símbolo `%` é usado para representar o *restante* da operação. `X % Y` é o restante da divisão de `X por Y`. Por exemplo, `314 % 100` produz `14`, e `144 % 12` nos dá `0`. A precedência deste operador é igual a da multiplicação e divisão. Você também pode ver este operador sendo referido como "módulo" (porém tecnicamente "restante" é mais preciso).

## Números Especiais

Existem 3 valores especiais no JavaScript que são considerados números, mas não comportam-se como números normais.

Os dois primeiros são `Infinity` e `-Infinity`, que são usados para representar os infinitos positivo e negativo. `Infinity - 1` continua sendo `Infinity`, e assim por diante. Mas não ponha muita confiança neste tipo de computação *baseada em infinito*, pois é uma matemática pesada, e vai rapidamente levar para nosso próximo número especial: `NaN`.

`NaN` significa "not a number" (não é um número). Você obtém isso quando declara `0 / 0` (zero dividido por zero), `Infinity - Infinity`, ou qualquer número de outra operação numérica que não produz um preciso e significante valor.

## Strings

O próximo tipo básico de dado é a *string*. Strings são usadas para representar texto. Elas são escritas delimitando seu conteúdo entre aspas:

```javascript

"Patch my boat with chewing gum"
'Monkeys wave goodbye'

```

Ambas as aspas simples e duplas podem ser usadas para marcar strings - contanto que as aspas no início e no fim da string combinem.

Quase tudo pode ser colocado entre aspas, e o JavaScript vai fazer um valor de string com isso. Mas alguns caracteres são difíceis. Você pode imaginar como colocar aspas entre aspas deve ser difícil. Novas linhas, as coisas que você obtém quando pressiona `enter`, também não podem ser colocadas entre aspas - a string tem que estar em uma linha única.

Para ser capaz de ter estes caracteres em uma string, a convenção seguinte é usada: Sempre que um barra invertida `\` é encontrada dentro do texto entre aspas, isto indica que o caracter depois desta tem um significado especial. Uma aspa precedida de uma barra invertida não vai findar a string, mas ser parte dela. Quando um caracter 'n' correr depois de uma barra invertida, será interpretado como uma nova linha. Similarmente, um 't' depois da barra invertida significa o caracter tab. Veja a string seguinte:

```
"This is the first line\nAnd this is the second"

```

O verdadeiro texto contido é:

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
