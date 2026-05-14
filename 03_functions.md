# Funções

{{quote {author: "Donald Knuth", chapter: true}

People think that computer science is the art of geniuses but the actual reality is the opposite, just many people doing things that build on each other, like a wall of mini stones.

quote}}

{{index "Knuth, Donald"}}

{{figure {url: "img/chapter_picture_3.jpg", alt: "Illustration of fern leaves with a fractal shape, bees in the background", chapter: framed}}}

{{index function, [code, "structure of"]}}

Funções são uma das ferramentas mais centrais na programação JavaScript. O conceito de envolver um pedaço de programa em um valor tem muitos usos. Nos dá uma forma de estruturar programas maiores, reduzir repetição, associar nomes a subprogramas e isolar esses subprogramas uns dos outros.

A aplicação mais óbvia de funções é definir novo ((vocabulário)). Criar novas palavras em prosa é geralmente mau estilo, mas em programação é indispensável.

{{index abstraction, vocabulary}}

Falantes adultos típicos de inglês têm cerca de 20.000 palavras em seu vocabulário. Poucas linguagens de programação vêm com 20.000 comandos embutidos. E o vocabulário que _está_ disponível tende a ser definido de forma mais precisa, e portanto menos flexível, que na linguagem humana. Portanto, _temos_ que introduzir novas palavras para evitar verbosidade excessiva.

## Definindo uma função

{{index "square example", [function, definition], [binding, definition]}}

Uma definição de função é um binding regular onde o valor do binding é uma função. Por exemplo, este código define `square` para se referir a uma função que produz o quadrado de um dado número:

```
const square = function(x) {
  return x * x;
};

console.log(square(12));
// → 144
```

{{indexsee "curly braces", braces}}
{{index [braces, "function body"], block, [syntax, function], "function keyword", [function, body], [function, "as value"], [parentheses, arguments]}}

Uma função é criada com uma expressão que começa com a palavra-chave `function`. Funções têm um conjunto de _((parâmetro))s_ (neste caso, apenas `x`) e um _corpo_, que contém as instruções que devem ser executadas quando a função é chamada. O corpo de uma função criada dessa forma deve sempre estar envolvido em chaves, mesmo quando consiste em apenas uma única ((instrução)).

{{index "roundTo example"}}

Uma função pode ter múltiplos parâmetros ou nenhum parâmetro. No exemplo a seguir, `makeNoise` não lista nenhum nome de parâmetro, enquanto `roundTo` (que arredonda `n` para o múltiplo mais próximo de `step`) lista dois:

```
const makeNoise = function() {
  console.log("Pling!");
};

makeNoise();
// → Pling!

const roundTo = function(n, step) {
  let remainder = n % step;
  return n - remainder + (remainder < step / 2 ? 0 : step);
};

console.log(roundTo(23, 10));
// → 20
```

{{index "return value", "return keyword", undefined}}

Algumas funções, como `roundTo` e `square`, produzem um valor, e outras não, como `makeNoise`, cujo único resultado é um ((efeito colateral)). Uma instrução `return` determina o valor que a função retorna. Quando o controle encontra tal instrução, ele imediatamente salta para fora da função atual e dá o valor retornado ao código que chamou a função. Uma palavra-chave `return` sem uma expressão após ela fará a função retornar `undefined`. Funções que não têm uma instrução `return`, como `makeNoise`, similarmente retornam `undefined`.

{{index parameter, [function, application], [binding, "from parameter"]}}

Parâmetros de uma função se comportam como bindings regulares, mas seus valores iniciais são dados pelo _chamador_ da função, não pelo código na própria função.

## Bindings e escopos

{{indexsee "top-level scope", "global scope"}}
{{index "var keyword", "global scope", [binding, global], [binding, "scope of"]}}

Cada binding tem um _((escopo))_, que é a parte do programa na qual o binding é visível. Para bindings definidos fora de qualquer função, bloco ou módulo (veja [Capítulo ?](modules)), o escopo é o programa inteiro — você pode se referir a tais bindings onde quiser. Estes são chamados de _globais_.

{{index "local scope", [binding, local]}}

Bindings criados para ((parâmetro))s de funções ou declarados dentro de uma função podem ser referenciados apenas naquela função, então são conhecidos como bindings _locais_. Toda vez que a função é chamada, novas instâncias desses bindings são criadas. Isso fornece algum isolamento entre funções — cada chamada de função age em seu próprio pequeno mundo (seu ambiente local) e frequentemente pode ser entendida sem saber muito sobre o que está acontecendo no ambiente global.

{{index "let keyword", "const keyword", "var keyword"}}

Bindings declarados com `let` e `const` são de fato locais ao _((bloco))_ em que são declarados, então se você criar um desses dentro de um loop, o código antes e depois do loop não pode "vê-lo". No JavaScript pré-2015, apenas funções criavam novos escopos, então bindings no estilo antigo, criados com a palavra-chave `var`, são visíveis em toda a função em que aparecem — ou em todo o escopo global, se não estiverem em uma função.

```
let x = 10;   // global
if (true) {
  let y = 20; // local ao bloco
  var z = 30; // também global
}
```

{{index [binding, visibility]}}

Cada ((escopo)) pode "olhar para fora" no escopo ao seu redor, então `x` é visível dentro do bloco no exemplo. A exceção é quando múltiplos bindings têm o mesmo nome — nesse caso, o código pode ver apenas o mais interno. Por exemplo, quando o código dentro da função `halve` se refere a `n`, ele está vendo seu _próprio_ `n`, não o `n` global.

```
const halve = function(n) {
  return n / 2;
};

let n = 10;
console.log(halve(100));
// → 50
console.log(n);
// → 10
```

{{id scoping}}

## Escopo aninhado

{{index [nesting, "of functions"], [nesting, "of scope"], scope, "inner function", "lexical scoping"}}

JavaScript distingue não apenas bindings globais e locais. Blocos e funções podem ser criados dentro de outros blocos e funções, produzindo múltiplos graus de localidade.

{{index "landscape example"}}

Por exemplo, esta função — que exibe os ingredientes necessários para fazer uma porção de homus — tem outra função dentro dela:

```
const hummus = function(factor) {
  const ingredient = function(amount, unit, name) {
    let ingredientAmount = amount * factor;
    if (ingredientAmount > 1) {
      unit += "s";
    }
    console.log(`${ingredientAmount} ${unit} ${name}`);
  };
  ingredient(1, "can", "chickpeas");
  ingredient(0.25, "cup", "tahini");
  ingredient(0.25, "cup", "lemon juice");
  ingredient(1, "clove", "garlic");
  ingredient(2, "tablespoon", "olive oil");
  ingredient(0.5, "teaspoon", "cumin");
};
```

{{index [function, scope], scope}}

O código dentro da função `ingredient` pode ver o binding `factor` da função externa, mas seus bindings locais, como `unit` ou `ingredientAmount`, não são visíveis na função externa.

O conjunto de bindings visíveis dentro de um bloco é determinado pelo lugar daquele bloco no texto do programa. Cada escopo local também pode ver todos os escopos locais que o contêm, e todos os escopos podem ver o escopo global. Essa abordagem à visibilidade de bindings é chamada de _((escopo léxico))_.

## Funções como valores

{{index [function, "as value"], [binding, definition]}}

Um binding de função geralmente atua simplesmente como um nome para um pedaço específico do programa. Tal binding é definido uma vez e nunca alterado. Isso torna fácil confundir a função e seu nome.

{{index [binding, assignment]}}

Mas os dois são diferentes. Um valor de função pode fazer todas as coisas que outros valores podem — você pode usá-lo em ((expressões)) arbitrárias, não apenas chamá-lo. É possível armazenar um valor de função em um novo binding, passá-lo como argumento para uma função, e assim por diante. Similarmente, um binding que contém uma função ainda é apenas um binding regular e pode, se não for constante, receber um novo valor, assim:

```{test: no}
let launchMissiles = function() {
  missileSystem.launch("now");
};
if (safeMode) {
  launchMissiles = function() {/* não faz nada */};
}
```

{{index [function, "higher-order"]}}

No [Capítulo ?](higher_order), discutiremos as coisas interessantes que podemos fazer passando valores de função para outras funções.

## Notação de declaração

{{index [syntax, function], "function keyword", "square example", [function, definition], [function, declaration]}}

Existe uma forma ligeiramente mais curta de criar um binding de função. Quando a palavra-chave `function` é usada no início de uma instrução, funciona de forma diferente:

```{test: wrap}
function square(x) {
  return x * x;
}
```

{{index future, "execution order"}}

Isso é uma _declaração_ de função. A instrução define o binding `square` e o aponta para a função dada. É ligeiramente mais fácil de escrever e não requer um ponto e vírgula após a função.

Há uma sutileza com essa forma de definição de função.

```
console.log("The future says:", future());

function future() {
  return "You'll never have flying cars";
}
```

O código anterior funciona, embora a função seja definida _abaixo_ do código que a usa. Declarações de função não fazem parte do fluxo de controle regular de cima para baixo. Elas são conceitualmente movidas para o topo de seu escopo e podem ser usadas por todo o código nesse escopo. Isso às vezes é útil porque oferece a liberdade de ordenar o código de uma forma que pareça mais clara, sem se preocupar em ter que definir todas as funções antes que sejam usadas.

## Arrow functions

{{index function, "arrow function"}}

Existe uma terceira notação para funções, que parece muito diferente das outras. Em vez da palavra-chave `function`, ela usa uma seta (`=>`) composta por um sinal de igual e um caractere de maior-que (não confundir com o operador maior-ou-igual, que é escrito `>=`):

```{test: wrap}
const roundTo = (n, step) => {
  let remainder = n % step;
  return n - remainder + (remainder < step / 2 ? 0 : step);
};
```

{{index [function, body]}}

A seta vem _após_ a lista de parâmetros e é seguida pelo corpo da função. Expressa algo como "esta entrada (os ((parâmetro))s) produz este resultado (o corpo)".

{{index [braces, "function body"], "square example", [parentheses, arguments]}}

Quando há apenas um nome de parâmetro, você pode omitir os parênteses ao redor da lista de parâmetros. Se o corpo for uma única expressão em vez de um ((bloco)) entre chaves, essa expressão será retornada pela função. Então, estas duas definições de `square` fazem a mesma coisa:

```
const square1 = (x) => { return x * x; };
const square2 = x => x * x;
```

{{index [parentheses, arguments]}}

Quando uma arrow function não tem parâmetros, sua lista de parâmetros é apenas um conjunto vazio de parênteses.

```
const horn = () => {
  console.log("Toot");
};
```

{{index verbosity}}

Não há razão profunda para ter tanto arrow functions quanto expressões `function` na linguagem. Além de um detalhe menor, que discutiremos no [Capítulo ?](object), elas fazem a mesma coisa. Arrow functions foram adicionadas em 2015, principalmente para tornar possível escrever pequenas expressões de função de forma menos verbosa. Nós as usaremos frequentemente no [Capítulo ?](higher_order).

{{id stack}}

## A pilha de chamadas

{{indexsee stack, "call stack"}}
{{index "call stack", [function, application]}}

A forma como o controle flui através de funções é um pouco envolvente. Vamos dar uma olhada mais de perto. Aqui está um programa simples que faz algumas chamadas de função:

```
function greet(who) {
  console.log("Hello " + who);
}
greet("Harry");
console.log("Bye");
```

{{index ["control flow", functions], "execution order", "console.log"}}

Uma execução desse programa vai aproximadamente assim: a chamada a `greet` faz o controle saltar para o início dessa função (linha 2). A função chama `console.log`, que toma o controle, faz seu trabalho, e então retorna o controle para a linha 2. Lá, ele alcança o final da função `greet`, então retorna ao lugar que a chamou — linha 4. A linha seguinte chama `console.log` novamente. Após isso retornar, o programa alcança seu fim.

Poderíamos mostrar o fluxo de controle esquematicamente assim:

```{lang: null}
fora de função
  em greet
    em console.log
  em greet
fora de função
  em console.log
fora de função
```

{{index "return keyword", [memory, call stack]}}

Como uma função tem que saltar de volta ao lugar que a chamou quando retorna, o computador deve lembrar o contexto de onde a chamada aconteceu. Em um caso, `console.log` tem que retornar à função `greet` quando termina. No outro caso, retorna ao final do programa.

O lugar onde o computador armazena esse contexto é a _((pilha de chamadas))_. Toda vez que uma função é chamada, o contexto atual é armazenado no topo dessa pilha. Quando uma função retorna, ela remove o contexto do topo da pilha e usa esse contexto para continuar a execução.

{{index "infinite loop", "stack overflow", recursion}}

Armazenar essa pilha requer espaço na memória do computador. Quando a pilha cresce demais, o computador falhará com uma mensagem como "out of stack space" ou "too much recursion". O código a seguir ilustra isso fazendo ao computador uma pergunta realmente difícil que causa um vaivém infinito entre duas funções. Ou melhor, _seria_ infinito se o computador tivesse uma pilha infinita. Como está, ficaremos sem espaço, ou "estouraremos a pilha".

```{test: no}
function chicken() {
  return egg();
}
function egg() {
  return chicken();
}
console.log(chicken() + " came first.");
// → ??
```

## Argumentos Opcionais

{{index argument, [function, application]}}

O código a seguir é permitido e executa sem nenhum problema:

```
function square(x) { return x * x; }
console.log(square(4, true, "hedgehog"));
// → 16
```

Definimos `square` com apenas um ((parâmetro)). No entanto, quando a chamamos com três, a linguagem não reclama. Ela ignora os argumentos extras e calcula o quadrado do primeiro.

{{index undefined}}

JavaScript é extremamente tolerante quanto ao número de argumentos que você pode passar para uma função. Se você passar muitos, os extras são ignorados. Se passar poucos, os parâmetros faltantes recebem o valor `undefined`.

A desvantagem disso é que é possível — provável, até — que você acidentalmente passe o número errado de argumentos para funções. E ninguém lhe dirá sobre isso. A vantagem é que você pode usar esse comportamento para permitir que uma função seja chamada com diferentes números de argumentos. Por exemplo, esta função `minus` tenta imitar o operador `-` agindo sobre um ou dois argumentos:

```
function minus(a, b) {
  if (b === undefined) return -a;
  else return a - b;
}

console.log(minus(10));
// → -10
console.log(minus(10, 5));
// → 5
```

{{id roundTo}}
{{index "optional argument", "default value", parameter, ["= operator", "for default value"] "roundTo example"}}

Se você escrever um operador `=` após um parâmetro, seguido de uma expressão, o valor dessa expressão substituirá o argumento quando ele não for fornecido. Por exemplo, esta versão de `roundTo` torna seu segundo argumento opcional. Se você não o fornecer ou passar o valor `undefined`, ele terá como padrão o valor um:

```{test: wrap}
function roundTo(n, step = 1) {
  let remainder = n % step;
  return n - remainder + (remainder < step / 2 ? 0 : step);
};

console.log(roundTo(4.5));
// → 5
console.log(roundTo(4.5, 2));
// → 4
```

{{index "console.log"}}

O [próximo capítulo](data#rest_parameters) apresentará uma forma pela qual o corpo de uma função pode obter a lista completa de argumentos que lhe foi passada. Isso é útil porque permite que uma função aceite qualquer número de argumentos. Por exemplo, `console.log` faz isso, exibindo todos os valores que lhe são dados:

```
console.log("C", "O", 2);
// → C O 2
```

## Closure

{{index "call stack", "local binding", [function, "as value"], scope}}

A capacidade de tratar funções como valores, combinada com o fato de que bindings locais são recriados toda vez que uma função é chamada, traz uma pergunta interessante: o que acontece com bindings locais quando a chamada de função que os criou não está mais ativa?

O código a seguir mostra um exemplo disso. Ele define uma função, `wrapValue`, que cria um binding local. Então retorna uma função que acessa e retorna esse binding local.

```
function wrapValue(n) {
  let local = n;
  return () => local;
}

let wrap1 = wrapValue(1);
let wrap2 = wrapValue(2);
console.log(wrap1());
// → 1
console.log(wrap2());
// → 2
```

Isso é permitido e funciona como você esperaria — ambas as instâncias do binding ainda podem ser acessadas. Essa situação é uma boa demonstração do fato de que bindings locais são criados novamente para cada chamada, e chamadas diferentes não afetam os bindings locais uma da outra.

Esse recurso — poder referenciar uma instância específica de um binding local em um escopo envolvente — é chamado de _((closure))_. Uma função que referencia bindings de escopos locais ao seu redor é chamada de _uma_ closure. Esse comportamento não apenas o libera de ter que se preocupar com o tempo de vida dos bindings, mas também torna possível usar valores de função de formas criativas.

{{index "multiplier function"}}

Com uma pequena mudança, podemos transformar o exemplo anterior em uma forma de criar funções que multiplicam por um valor arbitrário.

```
function multiplier(factor) {
  return number => number * factor;
}

let twice = multiplier(2);
console.log(twice(5));
// → 10
```

{{index [binding, "from parameter"]}}

O binding explícito `local` do exemplo `wrapValue` não é realmente necessário, já que um parâmetro é em si um binding local.

{{index [function, "model of"]}}

Pensar sobre programas assim requer alguma prática. Um bom modelo mental é pensar em valores de função como contendo tanto o código em seu corpo quanto o ambiente em que são criados. Quando chamada, o corpo da função vê o ambiente em que foi criada, não o ambiente em que é chamada.

No exemplo anterior, `multiplier` é chamada e cria um ambiente em que seu parâmetro `factor` está vinculado a 2. O valor de função que ela retorna, que é armazenado em `twice`, lembra esse ambiente para que, quando chamado, multiplique seu argumento por 2.

## Recursão

{{index "power example", "stack overflow", recursion, [function, application]}}

É perfeitamente aceitável que uma função chame a si mesma, desde que não faça isso com tanta frequência que estoure a pilha. Uma função que chama a si mesma é chamada de _recursiva_. Recursão permite que algumas funções sejam escritas em um estilo diferente. Tome, por exemplo, esta função `power`, que faz o mesmo que o operador `**` (exponenciação):

```{test: wrap}
function power(base, exponent) {
  if (exponent == 0) {
    return 1;
  } else {
    return base * power(base, exponent - 1);
  }
}

console.log(power(2, 3));
// → 8
```

{{index loop, readability, mathematics}}

Isso é bastante próximo da forma como matemáticos definem exponenciação e descreve o conceito de forma indiscutivelmente mais clara que o loop que usamos no [Capítulo ?](program_structure). A função chama a si mesma múltiplas vezes com expoentes cada vez menores para alcançar a multiplicação repetida.

{{index [function, application], efficiency}}

No entanto, essa implementação tem um problema: em implementações típicas de JavaScript, ela é cerca de três vezes mais lenta que uma versão usando um loop `for`. Percorrer um loop simples é geralmente mais barato que chamar uma função múltiplas vezes.

{{index optimization}}

O dilema de velocidade versus ((elegância)) é interessante. Você pode vê-lo como uma espécie de contínuo entre amigabilidade para humanos e amigabilidade para máquinas. Quase qualquer programa pode ser tornado mais rápido tornando-o maior e mais complicado. O programador tem que encontrar um equilíbrio apropriado.

No caso da função `power`, uma versão inelegante (com loop) ainda é bastante simples e fácil de ler. Não faz muito sentido substituí-la por uma função recursiva. Frequentemente, porém, um programa lida com conceitos tão complexos que abrir mão de alguma eficiência para tornar o programa mais direto é útil.

{{index profiling}}

Preocupar-se com eficiência pode ser uma distração. É mais um fator que complica o design do programa, e quando você está fazendo algo que já é difícil, essa coisa extra para se preocupar pode ser paralisante.

{{index "premature optimization"}}

Portanto, você geralmente deve começar escrevendo algo que é correto e fácil de entender. Se estiver preocupado que é lento demais — o que geralmente não é, já que a maioria do código simplesmente não é executado com frequência suficiente para levar uma quantidade significativa de tempo — você pode medir depois e melhorar se necessário.

{{index "branching recursion"}}

Recursão nem sempre é apenas uma alternativa ineficiente ao loop. Alguns problemas são realmente mais fáceis de resolver com recursão do que com loops. Na maioria das vezes, são problemas que requerem explorar ou processar várias "ramificações", cada uma das quais pode se ramificar novamente em ainda mais ramificações.

{{id recursive_puzzle}}
{{index recursion, "number puzzle example"}}

Considere este quebra-cabeça: começando do número 1 e repetidamente somando 5 ou multiplicando por 3, um conjunto infinito de números pode ser produzido. Como você escreveria uma função que, dado um número, tenta encontrar uma sequência de tais adições e multiplicações que produz esse número? Por exemplo, o número 13 pode ser alcançado primeiro multiplicando por 3 e depois somando 5 duas vezes, enquanto o número 15 não pode ser alcançado de forma alguma.

Aqui está uma solução recursiva:

```
function findSolution(target) {
  function find(current, history) {
    if (current == target) {
      return history;
    } else if (current > target) {
      return null;
    } else {
      return find(current + 5, `(${history} + 5)`) ??
             find(current * 3, `(${history} * 3)`);
    }
  }
  return find(1, "1");
}

console.log(findSolution(24));
// → (((1 * 3) + 5) * 3)
```

Note que este programa não necessariamente encontra a sequência _mais curta_ de operações. Ele se satisfaz quando encontra qualquer sequência.

Tudo bem se você não ver como este código funciona imediatamente. Vamos percorrê-lo, já que é um ótimo exercício de pensamento recursivo.

A função interna `find` faz a recursão real. Ela recebe dois ((argumento))s: o número atual e uma string que registra como chegamos a esse número. Se encontra uma solução, retorna uma string que mostra como chegar ao alvo. Se não pode encontrar nenhuma solução a partir deste número, retorna `null`.

{{index null, "?? operator", "short-circuit evaluation"}}

Para fazer isso, a função realiza uma de três ações. Se o número atual é o número alvo, o histórico atual é uma forma de alcançar esse alvo, então ele é retornado. Se o número atual é maior que o alvo, não faz sentido explorar mais esse caminho porque tanto somar quanto multiplicar só tornarão o número maior, então retorna `null`. Finalmente, se ainda estamos abaixo do número alvo, a função tenta ambos os caminhos possíveis que começam do número atual, chamando a si mesma duas vezes, uma para adição e uma para multiplicação. Se a primeira chamada retorna algo que não é `null`, ele é retornado. Caso contrário, a segunda chamada é retornada, independentemente de produzir uma string ou `null`.

{{index "call stack"}}

Para entender melhor como essa função produz o efeito que estamos procurando, vejamos todas as chamadas a `find` que são feitas ao procurar uma solução para o número 13:

```{lang: null}
find(1, "1")
  find(6, "(1 + 5)")
    find(11, "((1 + 5) + 5)")
      find(16, "(((1 + 5) + 5) + 5)")
        grande demais
      find(33, "(((1 + 5) + 5) * 3)")
        grande demais
    find(18, "((1 + 5) * 3)")
      grande demais
  find(3, "(1 * 3)")
    find(8, "((1 * 3) + 5)")
      find(13, "(((1 * 3) + 5) + 5)")
        encontrado!
```

A indentação indica a profundidade da pilha de chamadas. A primeira vez que `find` é chamada, a função começa chamando a si mesma para explorar a solução que começa com `(1 + 5)`. Essa chamada recursará ainda mais para explorar _toda_ solução continuada que produza um número menor ou igual ao número alvo. Como não encontra uma que atinja o alvo, retorna `null` de volta à primeira chamada. Lá o operador `??` faz com que a chamada que explora `(1 * 3)` aconteça. Essa busca tem mais sorte — sua primeira chamada recursiva, através de _outra_ chamada recursiva, encontra o número alvo. Essa chamada mais interna retorna uma string, e cada um dos operadores `??` nas chamadas intermediárias passa essa string adiante, finalmente retornando a solução.

## Crescendo funções

{{index [function, definition]}}

Existem duas formas mais ou menos naturais de funções serem introduzidas em programas.

{{index repetition}}

A primeira ocorre quando você se encontra escrevendo código similar múltiplas vezes. Você preferiria não fazer isso, já que ter mais código significa mais espaço para erros se esconderem e mais material para ler para pessoas tentando entender o programa. Então você pega a funcionalidade repetida, encontra um bom nome para ela e a coloca em uma função.

A segunda forma é que você descobre que precisa de alguma funcionalidade que ainda não escreveu e que parece merecer sua própria função. Você começa nomeando a função e depois escreve seu corpo. Pode até começar a escrever código que usa a função antes de realmente definir a função em si.

{{index [function, naming], [binding, naming]}}

Quão difícil é encontrar um bom nome para uma função é uma boa indicação de quão claro é o conceito que você está tentando envolver. Vamos percorrer um exemplo.

{{index "farm example"}}

Queremos escrever um programa que imprime dois números: os números de vacas e galinhas em uma fazenda, com as palavras `Cows` e `Chickens` depois deles e zeros preenchidos antes de ambos os números para que sejam sempre três dígitos:

```{lang: null}
007 Cows
011 Chickens
```

Isso pede uma função de dois argumentos — o número de vacas e o número de galinhas. Vamos codificar.

```
function printFarmInventory(cows, chickens) {
  let cowString = String(cows);
  while (cowString.length < 3) {
    cowString = "0" + cowString;
  }
  console.log(`${cowString} Cows`);
  let chickenString = String(chickens);
  while (chickenString.length < 3) {
    chickenString = "0" + chickenString;
  }
  console.log(`${chickenString} Chickens`);
}
printFarmInventory(7, 11);
```

{{index ["length property", "for string"], "while loop"}}

Escrever `.length` após uma expressão de string nos dará o comprimento dessa string. Assim, os loops `while` continuam adicionando zeros na frente das strings de números até que tenham pelo menos três caracteres de comprimento.

Missão cumprida! Mas assim que estamos prestes a enviar o código ao fazendeiro (junto com uma fatura salgada), ela liga e nos diz que também começou a criar porcos, e se não poderíamos por favor estender o software para também imprimir porcos?

{{index "copy-paste programming"}}

Claro que podemos. Mas bem quando estamos no processo de copiar e colar essas quatro linhas mais uma vez, paramos e reconsideramos. Tem que haver uma forma melhor. Aqui está uma primeira tentativa:

```
function printZeroPaddedWithLabel(number, label) {
  let numberString = String(number);
  while (numberString.length < 3) {
    numberString = "0" + numberString;
  }
  console.log(`${numberString} ${label}`);
}

function printFarmInventory(cows, chickens, pigs) {
  printZeroPaddedWithLabel(cows, "Cows");
  printZeroPaddedWithLabel(chickens, "Chickens");
  printZeroPaddedWithLabel(pigs, "Pigs");
}

printFarmInventory(7, 11, 3);
```

{{index [function, naming]}}

Funciona! Mas esse nome, `printZeroPaddedWithLabel`, é um pouco desajeitado. Ele conflita três coisas — imprimir, preencher com zeros e adicionar um rótulo — em uma única função.

{{index "zeroPad function"}}

Em vez de extrair a parte repetida do nosso programa por inteiro, vamos tentar selecionar um único _conceito_:

```
function zeroPad(number, width) {
  let string = String(number);
  while (string.length < width) {
    string = "0" + string;
  }
  return string;
}

function printFarmInventory(cows, chickens, pigs) {
  console.log(`${zeroPad(cows, 3)} Cows`);
  console.log(`${zeroPad(chickens, 3)} Chickens`);
  console.log(`${zeroPad(pigs, 3)} Pigs`);
}

printFarmInventory(7, 16, 3);
```

{{index readability, "pure function"}}

Uma função com um nome bonito e óbvio como `zeroPad` torna mais fácil para alguém que lê o código descobrir o que ela faz. Tal função também é útil em mais situações do que apenas esse programa específico. Por exemplo, você poderia usá-la para ajudar a imprimir tabelas de números bem alinhadas.

{{index [interface, design]}}

Quão inteligente e versátil _deve_ ser nossa função? Poderíamos escrever qualquer coisa, desde uma função terrivelmente simples que só pode preencher um número com três caracteres de largura até um sistema generalizado e complicado de formatação de números que lida com números fracionários, números negativos, alinhamento de pontos decimais, preenchimento com diferentes caracteres, e assim por diante.

Um princípio útil é se abster de adicionar esperteza a menos que você tenha certeza absoluta de que vai precisar. Pode ser tentador escrever "((framework))s" gerais para cada pedaço de funcionalidade que encontrar. Resista a esse impulso. Você não fará nenhum trabalho real — estará muito ocupado escrevendo código que nunca usa.

{{id pure}}
## Funções e efeitos colaterais

{{index "side effect", "pure function", [function, purity]}}

Funções podem ser grosseiramente divididas naquelas que são chamadas por seus efeitos colaterais e naquelas que são chamadas por seu valor de retorno (embora também seja possível ter efeitos colaterais e retornar um valor).

{{index reuse}}

A primeira função auxiliar no ((exemplo fazenda)), `printZeroPaddedWithLabel`, é chamada por seu efeito colateral: ela imprime uma linha. A segunda versão, `zeroPad`, é chamada por seu valor de retorno. Não é coincidência que a segunda é útil em mais situações que a primeira. Funções que criam valores são mais fáceis de combinar de novas formas do que funções que diretamente realizam efeitos colaterais.

{{index substitution}}

Uma função _pura_ é um tipo específico de função produtora de valor que não apenas não tem efeitos colaterais mas também não depende de efeitos colaterais de outro código — por exemplo, não lê bindings globais cujo valor pode mudar. Uma função pura tem a propriedade agradável de que, quando chamada com os mesmos argumentos, sempre produz o mesmo valor (e não faz mais nada). Uma chamada a tal função pode ser substituída por seu valor de retorno sem mudar o significado do código. Quando você não tem certeza de que uma função pura está funcionando corretamente, pode testá-la simplesmente chamando-a e saber que se funcionar naquele contexto, funcionará em qualquer contexto. Funções não puras tendem a exigir mais estrutura para serem testadas.

{{index optimization, "console.log"}}

Ainda assim, não é preciso se sentir mal ao escrever funções que não são puras. Efeitos colaterais são frequentemente úteis. Não há como escrever uma versão pura de `console.log`, por exemplo, e `console.log` é bom de ter. Algumas operações também são mais fáceis de expressar de forma eficiente quando usamos efeitos colaterais.

## Resumo

Este capítulo ensinou como escrever suas próprias funções. A palavra-chave `function`, quando usada como expressão, pode criar um valor de função. Quando usada como instrução, pode ser usada para declarar um binding e dar a ele uma função como valor. Arrow functions são mais uma forma de criar funções.

```
// Definir f para conter um valor de função
const f = function(a) {
  console.log(a + 2);
};

// Declarar g como uma função
function g(a, b) {
  return a * b * 3.5;
}

// Um valor de função menos verboso
let h = a => a % 3;
```

Uma parte fundamental de entender funções é entender escopos. Cada bloco cria um novo escopo. Parâmetros e bindings declarados em um dado escopo são locais e não visíveis de fora. Bindings declarados com `var` se comportam de forma diferente — acabam no escopo da função mais próxima ou no escopo global.

Separar as tarefas que seu programa executa em diferentes funções é útil. Você não terá que se repetir tanto, e funções podem ajudar a organizar um programa agrupando código em partes que fazem coisas específicas.

## Exercícios

### Mínimo

{{index "Math object", "minimum (exercise)", "Math.min function", minimum}}

O [capítulo anterior](program_structure#return_values) introduziu a função padrão `Math.min` que retorna seu menor argumento. Podemos escrever uma função como essa nós mesmos agora. Defina a função `min` que recebe dois argumentos e retorna o menor deles.

{{if interactive

```{test: no}
// Seu código aqui.

console.log(min(0, 10));
// → 0
console.log(min(0, -10));
// → -10
```
if}}

{{hint

{{index "minimum (exercise)"}}

Se tiver dificuldade em colocar chaves e parênteses no lugar certo para obter uma definição de função válida, comece copiando um dos exemplos neste capítulo e modificando-o.

{{index "return keyword"}}

Uma função pode conter múltiplas instruções `return`.

hint}}

### Recursão

{{index recursion, "isEven (exercise)", "even number"}}

Vimos que podemos usar `%` (o operador resto) para testar se um número é par ou ímpar usando `% 2` para ver se é divisível por dois. Aqui está outra forma de definir se um número inteiro positivo é par ou ímpar:

- Zero é par.

- Um é ímpar.

- Para qualquer outro número _N_, sua paridade é a mesma de _N_ - 2.

Defina uma função recursiva `isEven` correspondendo a essa descrição. A função deve aceitar um único parâmetro (um número inteiro positivo) e retornar um booleano.

{{index "stack overflow"}}

Teste-a com 50 e 75. Veja como ela se comporta com -1. Por quê? Você consegue pensar em uma forma de corrigir isso?

{{if interactive

```{test: no}
// Seu código aqui.

console.log(isEven(50));
// → true
console.log(isEven(75));
// → false
console.log(isEven(-1));
// → ??
```

if}}

{{hint

{{index "isEven (exercise)", ["if keyword", chaining], recursion}}

Sua função provavelmente se parecerá um pouco com a função interna `find` no [exemplo](functions#recursive_puzzle) recursivo `findSolution` neste capítulo, com uma cadeia `if`/`else if`/`else` que testa qual dos três casos se aplica. O `else` final, correspondendo ao terceiro caso, faz a chamada recursiva. Cada um dos ramos deve conter uma instrução `return` ou de alguma outra forma garantir que um valor específico seja retornado.

{{index "stack overflow"}}

Quando receber um número negativo, a função recursará repetidamente, passando a si mesma um número cada vez mais negativo, ficando assim cada vez mais longe de retornar um resultado. Ela eventualmente ficará sem espaço na pilha e abortará.

hint}}

### Contando feijões

{{index "bean counting (exercise)", [string, indexing], "zero-based counting", ["length property", "for string"]}}

Você pode obter o *N*-ésimo caractere, ou letra, de uma string escrevendo `[N]` após a string (por exemplo, `string[2]`). O valor resultante será uma string contendo apenas um caractere (por exemplo, `"b"`). O primeiro caractere está na posição 0, o que faz com que o último seja encontrado na posição `string.length - 1`. Em outras palavras, uma string de dois caracteres tem comprimento 2, e seus caracteres estão nas posições 0 e 1.

Escreva uma função chamada `countBs` que recebe uma string como seu único argumento e retorna um número que indica quantos caracteres B maiúsculos existem na string.

Em seguida, escreva uma função chamada `countChar` que se comporta como `countBs`, exceto que recebe um segundo argumento que indica o caractere que deve ser contado (em vez de contar apenas caracteres B maiúsculos). Reescreva `countBs` para fazer uso dessa nova função.

{{if interactive

```{test: no}
// Seu código aqui.

console.log(countBs("BOB"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4
```

if}}

{{hint

{{index "bean counting (exercise)", ["length property", "for string"], "counter variable"}}

Sua função precisará de um ((loop)) que olhe cada caractere na string. Pode executar um índice de zero até um abaixo do comprimento (`< string.length`). Se o caractere na posição atual for o mesmo que o que a função está procurando, ela adiciona 1 a uma variável contadora. Uma vez que o loop tenha terminado, o contador pode ser retornado.

{{index "local binding"}}

Tome cuidado para tornar todos os bindings usados na função _locais_ à função, declarando-os adequadamente com a palavra-chave `let` ou `const`.

hint}}
