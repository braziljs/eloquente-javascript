# Funções

> “As pessoas pensam que Ciência da Computação é a arte de gênios. Na realidade é o oposto, são várias pessoas fazendo coisas que dependem uma das outras, como um muro de pequenas pedras.”
> — Donald Knuth

Você já viu valores de funções como `alert`, e como invocá-las. Funções são essenciais na programação JavaScript. O conceito de encapsular uma parte do programa em um valor tem vários usos. É uma ferramenta usada para estruturar aplicações de larga escala, reduzir repetição de código, associar nomes a subprogramas e isolar esses subprogramas uns dos outros.

A aplicação mais óbvia das funções é quando queremos definir novos vocabulários. Criar novas palavras no nosso dia a dia geralmente não é uma boa ideia, porém em programação é indispensável.

Um adulto típico tem por volta de 20.000 palavras em seu vocabulário. Apenas algumas linguagens de programação possuem 20.000 conceitos embutidos, sendo que o vocabulário que se tem disponível tende a ser bem definido e, por isso, menos flexível do que a linguagem usada por humanos. Por isso, normalmente temos que adicionar conceitos do nosso próprio vocabulário para evitar repetição.

## Definindo Uma Função

Uma definição de função nada mais é do que uma definição normal de uma variável, na qual o valor recebido pela variável é uma função. Por exemplo, o código a seguir define uma variável `square` que se refere a uma função que retorna o quadrado do número dado:

```js
var square = function(x) {
  return x * x;
};

console.log(square(12));
// → 144
```

Uma função é criada por meio de uma expressão que se inicia com a palavra-chave `function`. Funções podem receber uma série de parâmetros (nesse caso, somente `x`) e um "corpo", contendo as declarações que serão executadas quando a função for invocada. O "corpo" da função deve estar sempre envolvido por chaves, mesmo quando for formado por apenas uma simples declaração (como no exemplo anterior).

Uma função pode receber múltiplos parâmetros ou nenhum parâmetro. No exemplo a seguir, `makeNoise` não recebe nenhum parâmetro, enquanto `power` recebe dois:

```js
var makeNoise = function() {
  console.log("Pling!");
};

makeNoise();
// → Pling!

var power = function(base, exponent) {
  var result = 1;
  for (var count = 0; count < exponent; count++)
    result *= base;
  return result;
};

console.log(power(2, 10));
// → 1024
```

Algumas funções produzem um valor, como as funções `power` e `square` acima, e outras não, como no exemplo de `makeNoise`, que produz apenas um “efeito colateral”. A declaração `return` é usada para determinar o valor de retorno da função. Quando o controle de execução interpreta essa declaração, ele sai imediatamente do contexto da função atual e disponibiliza o valor retornado para o código que invocou a função. A palavra-chave `return` sem uma expressão após, irá fazer com que o retorno da função seja `undefined`.

## Parâmetros e Escopos

Os parâmetros de uma função comportam-se como variáveis regulares. Seu valor inicial é informado por quem invocou a função e não pelo código da função em si.

Uma propriedade importante das funções é que variáveis definidas dentro do "corpo" delas, incluindo seus parâmetros, são *locais* à própria função. Isso significa, por exemplo, que a variável `result` no exemplo `power` será criada novamente toda vez que a função for invocada, sendo que as diferentes execuções não interferem umas nas outras.

Essa característica de localidade das variáveis se aplica somente aos parâmetros e às variáveis que forem declaradas usando a palavra-chave `var` dentro do "corpo" de uma função. Variáveis declaradas fora do contexto de alguma função são chamadas de *globais* (não locais), pois elas são visíveis em qualquer parte da aplicação. É possível acessar variáveis *globais* dentro de qualquer função, contanto que você não tenha declarado uma variável local com o mesmo nome.

O código a seguir demonstra esse conceito. Ele define e executa duas funções em que ambas atribuem um valor à variável `x`. A primeira função `f1` declara a variável como local e então muda apenas seu valor. Já a segunda função `f2` não declara `x` localmente, portanto sua referência a `x` está associada à variável global `x` definida no topo do exemplo:

```js
var x = "outside";

var f1 = function() {
  var x = "inside f1";
};
f1();
console.log(x);
// → outside

var f2 = function() {
  x = "inside f2";
};
f2();
console.log(x);
// → inside f2
```

Esse comportamento ajuda a prevenir interferências acidentais entre funções. Se todas as variáveis fossem compartilhadas por toda a aplicação, seria muito trabalhoso garantir que o mesmo nome não fosse utilizado em duas situações com propósitos diferentes. Além disso, se fosse o caso de reutilizar uma variável com o mesmo nome, talvez você pudesse se deparar com efeitos estranhos de códigos que alteram o valor da sua variável. Assumindo que variáveis locais existem apenas dentro do contexto da função, a linguagem torna possível ler e entender funções como “pequenos universos”, sem termos que nos preocupar com o código da aplicação inteira de uma só vez.

## Escopo Aninhado

O JavaScript não se distingue apenas pela diferenciação entre variáveis *locais* e *globais*. Funções também podem ser criadas dentro de outras funções, criando vários níveis de “localidades”.

Por exemplo, a função `landscape` possui duas funções, `flat` e `mountain`, declaradas dentro do seu corpo:

```js
var landscape = function() {
  var result = "";
  var flat = function(size) {
    for (var count = 0; count < size; count++)
      result += "_";
  };
  var mountain = function(size) {
    result += "/";
    for (var count = 0; count < size; count++)
      result += "'";
    result += "\\";
  };

  flat(3);
  mountain(4);
  flat(6);
  mountain(1);
  flat(1);
  return result;
};

console.log(landscape());
// → ___/''''\______/'\_
```

As funções `flat` e `mountain` podem “ver” a variável `result` porque elas estão dentro do mesmo escopo da função que as definiu. Entretanto, elas não conseguem ver a variável `count` uma da outra (somente a sua própria), pois elas estão definidas em escopos diferentes. O ambiente externo à função `landscape` não consegue ver as variáveis definidas dentro de `landscape`.

Em resumo, cada escopo local pode também ver todos os escopos locais que o contêm. O conjunto de variáveis visíveis dentro de uma função é determinado pelo local onde aquela função está escrita na aplicação. Todas as variáveis que estejam em blocos ao redor de definições de funções, são visíveis aos corpos dessas funções e também àqueles que estão no mesmo nível. Essa abordagem em relação à visibilidade de variáveis é chamada de *escopo léxico*.

Pessoas com experiência em outras linguagens de programação podem talvez esperar que qualquer bloco de código entre chaves produza um novo “ambiente local”. Entretanto, no JavaScript, as funções são as únicas coisas que podem criar novos escopos. Também é permitido a utilização de “blocos livres”:

```js
var something = 1;
{
  var something = 2;
  // Do stuff with variable something...
}
// Outside of the block again...
```

Entretanto, a variável `something` dentro do bloco faz referência à mesma variável fora do bloco. Na realidade, embora blocos como esse sejam permitidos, eles são úteis somente para agrupar o corpo de uma declaração condicional `if` ou um laço de repetição.

Se você acha isso estranho, não se preocupe, pois não está sozinho. A próxima versão do JavaScript vai introduzir a palavra-chave `let`, que funcionará como `var`, mas criará uma variável que é local ao *bloco* que a contém e não à *função* que a contém.

## Funções Como Valores

As variáveis de função, normalmente, atuam apenas como nomes para um pedaço específico de um programa. Tais variáveis são definidas uma vez e nunca se alteram. Isso faz com que seja fácil confundir a função com seu próprio nome.

Entretanto, são duas coisas distintas. Um valor de função pode fazer todas as coisas que outros valores podem fazer - você pode usá-lo em expressões arbitrárias e não apenas invocá-la. É possível armazenar um valor de função em um novo local, passá-lo como argumento para outra função e assim por diante. Não muito diferente, uma variável que faz referência a uma função continua sendo apenas uma variável regular e pode ser atribuída a um novo valor, como mostra o exemplo abaixo:

```js
var launchMissiles = function(value) {
  missileSystem.launch("now");
};

if (safeMode)
  launchMissiles = function(value) {/* do nothing */};
```

No capítulo 5, nós vamos discutir as coisas maravilhosas que podem ser feitas quando passamos valores de função para outras funções.

## Notação Por Declaração

Existe uma maneira mais simples de expressar “`var square = function…`”. A palavra-chave `function` também pode ser usada no início da declaração, como demonstrado abaixo:

```js
function square(x) {
  return x * x;
}
```

Isso é uma *declaração de função*. Ela define a variável `square` e faz com que ela referencie a função em questão. Até agora tudo bem, porém existe uma pequena diferença nessa maneira de definir uma função.

```js
console.log("The future says:", future());

function future() {
  return "We STILL have no flying cars.";
}
```

O exemplo acima funciona, mesmo sabendo que a função foi definida *após* o código que a executa. Isso ocorre porque as declarações de funções não fazem parte do fluxo normal de controle, que é executado de cima para baixo. Elas são conceitualmente movidas para o topo do escopo que as contém e podem ser usadas por qualquer código no mesmo escopo. Isso pode ser útil em algumas situações, porque nos permite ter a liberdade de ordenar o código de uma maneira que seja mais expressiva, sem nos preocuparmos muito com o fato de ter que definir todas as funções antes de usá-las.

O que acontece quando definimos uma declaração de função dentro de um bloco condicional (`if`) ou um laço de repetição? Bom, não faça isso. Diferentes plataformas JavaScript usadas em diferentes navegadores têm tradicionalmente feito coisas diferentes nessas situações, e a última versão basicamente proíbe essa prática. Se você deseja que seu programa se comporte de forma consistente, use somente essa forma de definição de função no bloco externo de uma outra função ou programa.

```js
function example() {
  function a() {} // Okay
  if (something) {
    function b() {} // Danger!
  }
}
```

## A Pilha de Chamadas

Será muito útil observarmos como o fluxo de controle flui por meio das execuções das funções. Aqui, temos um simples programa fazendo algumas chamadas de funções:

```js
function greet(who) {
  console.log("Hello " + who);
}
greet("Harry");
console.log("Bye");
```

A execução desse programa funciona da seguinte forma: a chamada à função `greet` faz com que o controle pule para o início dessa função (linha 2). Em seguida, é invocado `console.log` (uma função embutida no navegador), que assume o controle, faz seu trabalho e então retorna o controle para a linha 2 novamente. O controle chega ao fim da função `greet` e retorna para o local onde a função foi invocada originalmente (linha 4). Por fim, o controle executa uma nova chamada a `console.log`.

Podemos representar o fluxo de controle, esquematicamente, assim:

```
top
   greet
        console.log
   greet
top
   console.log
top
```

Devido ao fato de que a função deve retornar ao local onde foi chamada após finalizar a sua execução, o computador precisa se lembrar do contexto no qual a função foi invocada originalmente. Em um dos casos, `console.log` retorna o controle para a função `greet`. No outro caso, ela retorna para o final do programa.

O local onde o computador armazena esse contexto é chamado de _call stack_ (pilha de chamadas). Toda vez que uma função é invocada, o contexto atual é colocado no topo dessa "pilha" de contextos. Quando a função finaliza sua execução, o contexto no topo da pilha é removido e utilizado para continuar o fluxo de execução.

O armazenamento dessa pilha de contextos necessita de espaço na memória do computador. Quando a pilha começar a ficar muito grande, o computador reclamará com uma mensagem do tipo _out of stack space_ (sem espaço na pilha) ou _too much recursion_ (muitas recursões). O código a seguir demonstra esse problema fazendo uma pergunta muito difícil para o computador, que resultará em um ciclo infinito de chamadas entre duas funções. Se o computador tivesse uma pilha de tamanho infinito, isso poderia ser possível, no entanto, eventualmente chegaremos ao limite de espaço e explodiremos a "pilha".

```js
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

O código abaixo é permitido e executa sem problemas:

```js
alert("Hello", "Good Evening", "How do you do?");
```

A função `alert`, oficialmente, aceita somente um argumento. No entanto, quando você a chama assim, ela não reclama. Ela simplesmente ignora os outros argumentos e lhe mostra o seu "Hello".

O JavaScript é extremamente tolerante com a quantidade de argumentos que você passa para uma função. Se você passar mais argumentos que o necessário, os extras serão ignorados. Se você passar menos argumentos, os parâmetros faltantes simplesmente receberão o valor `undefined`.

A desvantagem disso é que, possivelmente - e provavelmente - você passará um número errado de argumentos, de forma acidental, para as funções e nada irá alertá-lo sobre isso.

A vantagem é que esse comportamento pode ser usado em funções que aceitam argumentos opcionais. Por exemplo, a versão seguinte de `power` pode ser chamada com um ou dois argumentos. No caso de ser invocada com apenas um argumento, ela assumirá o valor 2 para o expoente e a função se comportará com um expoente ao quadrado.

```js
function power(base, exponent) {
  if (exponent == undefined)
    exponent = 2;
  var result = 1;
  for (var count = 0; count < exponent; count++)
    result *= base;
  return result;
}

console.log(power(4));
// → 16
console.log(power(4, 3));
// → 64
```

No [próximo capítulo](./04-estruturas-de-dados.md), veremos uma maneira de acessar a lista que contém todos os argumentos que foram passados para uma função. Isso é útil, pois torna possível uma função aceitar qualquer número de argumentos. Por exemplo, `console.log` tira proveito disso, imprimindo todos os valores que foram passados.

```js
console.log("R", 2, "D", 2);
// → R 2 D 2
```

## Closure

A habilidade de tratar funções como valores, combinada com o fato de que variáveis locais são recriadas toda vez que uma função é invocada; isso traz à tona uma questão interessante.

O que acontece com as variáveis locais quando a função que as criou não está mais ativa?

O código a seguir mostra um exemplo disso. Ele define uma função `wrapValue` que cria uma variável local e retorna uma função que acessa e retorna essa variável.

```js
function wrapValue(n) {
  var localVariable = n;
  return function() { return localVariable; };
}

var wrap1 = wrapValue(1);
var wrap2 = wrapValue(2);
console.log(wrap1());
// → 1
console.log(wrap2());
// → 2
```

Isso é permitido e funciona como você espera: a variável ainda pode ser acessada. Várias instâncias da variável podem coexistir, o que é uma boa demonstração do conceito de que variáveis locais são realmente recriadas para cada nova chamada, sendo que as chamadas não interferem nas variáveis locais umas das outras.

A funcionalidade capaz de referenciar uma instância específica de uma variável local após a execução de uma função é chamada de _closure_. Uma função que _closes over_ (fecha sobre) variáveis locais é chamada de _closure_.

Esse comportamento faz com que você não tenha que se preocupar com o tempo de vida das variáveis, como também permite usos criativos de valores de função.

Com uma pequena mudança, podemos transformar o exemplo anterior, possibilitando a criação de funções que se multiplicam por uma quantidade arbitrária.

```js
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

var twice = multiplier(2);
console.log(twice(5));
// → 10
```

A variável explícita `localVariable` do exemplo na função `wrapValue` não é necessária, pois o parâmetro em si já é uma variável local.

Pensar em programas que funcionam dessa forma requer um pouco de prática. Um bom modelo mental é pensar que a palavra-chave `function` "congela" o código que está em seu corpo e o envolve em um pacote (o valor da função). Quando você ler `return function(...) {...}`, pense como se estivesse retornando um manipulador que possibilita executar instruções computacionais que foram "congeladas" para um uso posterior.

No exemplo, `multiplier` retorna um pedaço de código "congelado" que fica armazenado na variável `twice`. A última linha do exemplo chama o valor armazenado nessa variável, fazendo com que o código "congelado" (`return number * factor;`) seja executado. Ele continua tendo acesso à variável `factor` que foi criada na chamada de `multiplier` e, além disso, tem acesso ao argumento que foi passado a ele (o valor 5) por meio do parâmetro `number`.

## Recursão

É perfeitamente aceitável uma função invocar a si mesma, contanto que se tenha cuidado para não sobrecarregar a pilha de chamadas. Uma função que invoca a si mesma é denominada *recursiva*. A recursividade permite que as funções sejam escritas em um estilo diferente. Veja neste exemplo uma implementação alternativa de `power`:

```js
function power(base, exponent) {
  if (exponent == 0)
    return 1;
  else
    return base * power(base, exponent - 1);
}

console.log(power(2, 3));
// → 8
```

Essa é a maneira mais próxima da forma como os matemáticos definem a exponenciação, descrevendo o conceito de uma forma mais elegante do que a variação que usa um laço de repetição. A função chama a si mesma várias vezes com diferentes argumentos para alcançar a multiplicação repetida.

Entretanto, há um grave problema: em implementações típicas no JavaScript, a versão recursiva é aproximadamente dez vezes mais lenta do que a variação que utiliza um laço de repetição. Percorrer um laço de repetição simples é mais rápido do que invocar uma função múltiplas vezes.

O dilema velocidade versus elegância é bastante interessante. Você pode interpretá-lo como uma forma de transição gradual entre acessibilidade para humanos e máquina. Praticamente todos os programas podem se tornar mais rápidos quando se tornam maiores e mais complexos, cabendo ao desenvolvedor decidir qual o balanço ideal entre ambos.

No caso da [versão anterior](#argumentos-opcionais) da implementação de `power`, a versão menos elegante (usando laço de repetição) é bem simples e fácil de ser lida, não fazendo sentido substituí-la pela versão recursiva. Porém, frequentemente lidamos com aplicações mais complexas e sacrificar um pouco a eficiência para tornar o código mais legível e simples acaba se tornando uma escolha atrativa.

A regra básica que tem sido repetida por muitos programadores e com a qual eu concordo plenamente, é não se preocupar com eficiência até que você saiba, com certeza, que o programa está muito lento. Quando isso acontecer, encontre quais partes estão consumindo maior tempo de execução e comece a trocar elegância por eficiência nessas partes.

É evidente que essa regra não significa que se deva ignorar a performance completamente. Em muitos casos, como na função `power`, não há muitos benefícios em usar a abordagem mais elegante. Em outros casos, um programador experiente pode identificar facilmente, que uma abordagem mais simples nunca será rápida o suficiente.

A razão pela qual estou enfatizando isso é que, surpreendentemente, muitos programadores iniciantes focam excessivamente em eficiência até nos menores detalhes. Isso acaba gerando programas maiores, mais complexos e muitas vezes menos corretos, que demoram mais tempo para serem escritos e, normalmente, executam apenas um pouco mais rapidamente do que as variações mais simples e diretas.

Porém, muitas vezes a recursão não é uma alternativa menos eficiente do que um laço de repetição. É muito mais simples resolver alguns problemas com recursão do que com laços de repetição. A maioria desses problemas envolve exploração ou processamento de várias ramificações, as quais podem se dividir em novas ramificações e assim por diante.

Considere este quebra-cabeça: iniciando com o número 1 e repetidamente adicionando 5 ou multiplicando por 3, uma infinita quantidade de novos números pode ser produzida. Como você implementaria uma função que, dado um número, tenta achar a sequência de adições e multiplicações que produzem esse número? Por exemplo, o número 13 pode ser produzido multiplicando-se por 3 e adicionando-se 5 duas vezes. Já o número 15 não pode ser produzido de nenhuma forma.

Aqui está uma solução recursiva:

```js
function findSolution(target) {
  function find(start, history) {
    if (start == target)
      return history;
    else if (start > target)
      return null;
    else
      return find(start + 5, “(“ + history + “ + 5)”) ||
             find(start * 3, “(“ + history + “ * 3)”);
  }
  return find(1, “1”);
}

console.log(findSolution(24));
// → (((1 * 3) + 5) * 3)
```

Note que esse programa não necessariamente encontra a menor sequência de operações. Ele termina sua execução quando encontra a primeira solução possível.

Eu não espero que você entenda como isso funciona imediatamente, mas vamos analisar o exemplo, pois é um ótimo exercício para entender o pensamento recursivo.

A função interna `find` é responsável pela recursão. Ela recebe dois argumentos (o número atual e uma string que registra como chegamos a esse número) e retorna uma string que mostra como chegar no número esperado ou `null`.

Para fazer isso, a função executa uma entre três ações possíveis. Se o número atual é o número esperado, o histórico atual reflete uma possível sequência para alcançar o número esperado, então ele é simplesmente retornado. Se o número atual é maior que o número esperado, não faz sentido continuar explorando o histórico, já que adicionar ou multiplicar o número atual gerará um número ainda maior. Por fim, se nós tivermos um número menor do que o número esperado, a função tentará percorrer todos os caminhos possíveis que iniciam do número atual, chamando ela mesma duas vezes, uma para cada próximo passo que seja permitido. Se a primeira chamada retornar algo que não seja `null`, ela é retornada. Caso contrário, a segunda chamada é retornada, independentemente se ela produzir string ou `null`.

Para entender melhor como essa função produz o resultado que estamos esperando, vamos analisar todas as chamadas a `find` que são feitas quando procuramos a solução para o número 13.

```
find(1, “1”)
  find(6, “(1 + 5)”)
    find(11, “((1 + 5) + 5)”)
      find(16, “(((1 + 5) + 5) + 5)”)
        too big
      find(33, “(((1 + 5) + 5) * 3)”)
        too big
    find(18, “((1 + 5) * 3)”)
      too big
  find(3, “(1 * 3)”)
    find(8, “((1 * 3) + 5)”)
      find(13, “(((1 * 3) + 5) + 5)”)
        found!
```

A indentação reflete a profundidade da pilha de chamadas. A primeira chamada do `find` invoca a si mesma duas vezes, explorando as soluções que começam com `(1 + 5)` e `(1 * 3)`. A primeira chamada tenta achar a solução que começa com `(1 + 5)` e, usando recursão, percorre todas as possíveis soluções que produzam um número menor ou igual ao número esperado. Como ele não encontra uma solução para o número esperado, o valor `null` é retornado até retornar para a chamada inicial. Nesse momento, o operador `||` faz com que a pilha de chamadas inicie o processo de exploração pelo outro caminho `(1 * 3)`. Essa busca tem resultados satisfatórios, porque após duas chamadas recursivas acaba encontrando o número 13. Essa chamada recursiva mais interna retorna uma `string` e cada operador `||` nas chamadas intermediárias passa essa `string` adiante, retornando no final a solução esperada.

## Funções Crescentes

Existem duas razões naturais para as funções serem introduzidas nos programas.

A primeira delas é quando você percebe que está escrevendo o mesmo código várias vezes. Nós queremos evitar isso, pois quanto mais código, maiores são as chances de erros e mais linhas de código há para as pessoas lerem e entenderem o programa. Por isso, nós extraímos a funcionalidade repetida, encontramos um bom nome para ela e colocamos dentro de uma função.

A segunda razão é quando você precisa de uma funcionalidade que ainda não foi escrita e que merece ser encapsulada em uma função própria. Você começa dando um nome à função e, em seguida, escreve o seu corpo. Às vezes, você pode até começar escrevendo o código que usa a função antes mesmo de defini-la.

A dificuldade de encontrar um bom nome para uma função é um bom indicativo de quão claro é o conceito que você está tentando encapsular. Vamos analisar um exemplo.

Nós queremos escrever um programa que imprima dois números, sendo eles o número de vacas e galinhas em uma fazenda com as palavras _Cows_ (vacas) e _Chickens_ (galinhas) depois deles e algarismos zeros antes de ambos os números para que sejam sempre números de três dígitos.

```
007 Cows
011 Chickens
```

Bom, claramente, isso é uma função que exige dois argumentos. Vamos codar.

```js
function printFarmInventory(cows, chickens) {
  var cowString = String(cows);
  while (cowString.length < 3)
    cowString = “0” + cowString;
  console.log(cowString + “ Cows”);
  var chickenString = String(chickens);
  while (chickenString.length < 3)
    chickenString = “0” + chickenString;
  console.log(chickenString + “ Chickens”);
}
printFarmInventory(7, 11);
```

Adicionar `.length` após o valor de uma `string` nos fornecerá o tamanho (quantidade de caracteres) daquela `string`. Por isso, o laço de repetição `while` continua adicionando zeros no início da `string` que representa o número até que a mesma tenha três caracteres.

Missão cumprida! Porém, no momento em que iríamos enviar o código ao fazendeiro (juntamente com uma grande cobrança, é claro), ele nos ligou dizendo que começou a criar porcos, e perguntou, se poderíamos estender a funcionalidade do software para também imprimir os porcos?

É claro que podemos. Antes de entrar no processo de copiar e colar essas mesmas quatro linhas outra vez, vamos parar e reconsiderar. Deve existir uma forma melhor. Aqui está a primeira tentativa:

```js
function printZeroPaddedWithLabel(number, label) {
  var numberString = String(number);
  while (numberString.length < 3)
    numberString = “0” + numberString;
  console.log(numberString + “ “ + label);
}

function printFarmInventory(cows, chickens, pigs) {
  printZeroPaddedWithLabel(cows, “Cows”);
  printZeroPaddedWithLabel(chickens, “Chickens”);
  printZeroPaddedWithLabel(pigs, “Pigs”);
}

printFarmInventory(7, 11, 3);
```

Funcionou! Mas o nome `printZeroPaddedWithLabel` é um pouco estranho. Ele é uma combinação de três coisas - imprimir, adicionar zeros e adicionar a label correta - em uma única função.

Ao invés de tentarmos abstrair a parte repetida do nosso programa como um todo, vamos tentar selecionar apenas um conceito.

```js
function zeroPad(number, width) {
  var string = String(number);
  while (string.length < width)
    string = “0” + string;
  return string;
}

function printFarmInventory(cows, chickens, pigs) {
  console.log(zeroPad(cows, 3) + “ Cows”);
  console.log(zeroPad(chickens, 3) + “ Chickens”);
  console.log(zeroPad(pigs, 3) + “ Pigs”);
}

printFarmInventory(7, 16, 3);
```

Ter uma função com um bom nome descritivo como `zeroPad` torna fácil para qualquer um ler e entender o código. Além disso, ele pode ser útil em outras situações, além desse programa específico. Você pode usá-lo, por exemplo, para imprimir números corretamente alinhados em uma tabela.

O quão inteligente e versátil as nossas funções deveriam ser? Nós poderíamos escrever funções extremamente simples, que apenas adicionam algarismos para que o número tenha três caracteres, até funções complicadas, para formatação de números fracionários, números negativos, alinhamento de casas decimais, formatação com diferentes caracteres e por aí vai.

Um princípio útil é não adicionar funcionalidades, a menos que você tenha certeza absoluta de que irá precisar delas. Pode ser tentador escrever soluções genéricas para cada funcionalidade com que você se deparar. Resista a essa vontade. Você não vai ganhar nenhum valor real com isso e vai acabar escrevendo muitas linhas de código que nunca serão usadas.

## Funções e Efeitos Colaterais

Funções podem ser divididas naquelas que são invocadas para produzir um efeito colateral e naquelas que são invocadas para gerar um valor de retorno (embora também seja possível termos funções que produzam efeitos colaterais e que retornem um valor).

A primeira função auxiliar no exemplo da fazenda, `printZeroPaddedWithLabel`, é invocada para produzir um efeito colateral: imprimir uma linha. A segunda versão, `zeroPad`, é chamada para produzir um valor de retorno. Não é coincidência que a segunda versão é útil em mais situações do que a primeira. Funções que criam valores são mais fáceis de serem combinadas de diferentes maneiras do que funções que produzem efeitos colaterais diretamente.

Uma função "pura" é um tipo específico de função que produz valores e que não gera efeitos colaterais, como também não depende de efeitos colaterais de outros códigos — por exemplo, ela não utiliza variáveis globais que podem ser alteradas por outros códigos. Uma função pura tem a característica de, ser sempre chamada com os mesmos argumentos, produzir o mesmo valor (e não fará nada além disso). Isso acaba fazendo com que seja fácil de entendermos como ela funciona. Uma chamada para tal função pode ser mentalmente substituída pelo seu resultado, sem alterar o significado do código. Quando você não tem certeza se uma função pura está funcionando corretamente, você pode testá-la simplesmente invocando-a. Sabendo que ela funciona nesse contexto, funcionará em qualquer outro contexto. Funções que não são "puras" podem retornar valores diferentes baseados em vários tipos de fatores e produzem efeitos colaterais que podem fazer com que seja difícil de testar e pensar sobre elas.

Mesmo assim, não há necessidade de se sentir mal ao escrever funções que não são "puras" ou começar uma "guerra santa" para eliminar códigos impuros. Efeitos colaterais são úteis em algumas situações. Não existe uma versão "pura" de `console.log`, por exemplo, e `console.log` certamente é útil. Algumas operações são também mais fáceis de se expressar de forma mais eficiente quando usamos efeitos colaterais, portanto a velocidade de computação pode ser uma boa razão para se evitar a "pureza".

## Resumo

Este capítulo ensinou a você como escrever suas próprias funções. A palavra-chave `function`, quando usada como uma expressão, pode criar um valor de função. Quando usada como uma declaração, pode ser usada para declarar uma variável e dar a ela uma função como valor.

```js
// Create a function value f
var f = function(a) {
  console.log(a + 2);
};

// Declare g to be a function
function g(a, b) {
  return a * b * 3.5;
}
```

Um aspecto chave para entender funções, é entender como os escopos locais funcionam. Parâmetros e variáveis declaradas dentro de uma função são locais àquela função, recriados toda vez que a função é invocada, e não são acessíveis do contexto externo à função. Funções declaradas dentro de outras têm acesso ao escopo local das funções mais externas que as envolvem.

Separar as tarefas que a sua aplicação executa em diferentes funções, é bastante útil. Você não terá que repetir o código e as funções fazem um programa mais legível, agrupando o código em pedaços conceituais, da mesma forma que os capítulos e as seções ajudam a organizar um texto.

## Exercícios

### Mínimo

O [capítulo anterior](./02-estrutura-do-programa.md) introduziu a função `Math.min` que retorna o seu menor argumento. Nós podemos reproduzir essa funcionalidade agora. Escreva uma função `min` que recebe dois argumentos e retorna o menor deles.

```js
// Your code here.

console.log(min(0, 10));
// → 0
console.log(min(0, -10));
// → -10
```

**Dica:** Se estiver tendo problemas para colocar as chaves e os parênteses nos seus lugares corretos, para ter uma definição de uma função válida, comece copiando um dos exemplos desse capítulo e modificando-o. Uma função pode conter várias declarações de retorno (`return`).

### Recursão

Nós vimos que o `%` (operador resto) pode ser usado para testar se um número é par ou ímpar, usando `% 2` para verificar se ele é divisível por dois. Abaixo, está uma outra maneira de definir se um número inteiro positivo é par ou ímpar:

- Zero é par.
- Um é ímpar.
- Para todo outro número *N*, sua paridade é a mesma de *N - 2*.

Defina uma função recursiva `isEven` que satisfaça as condições descritas acima. A função deve aceitar um número como parâmetro e retornar um valor Booleano.

Teste-a com os valores 50 e 75. Observe como ela se comporta com o valor -1. Por quê? Você consegue pensar em uma maneira de arrumar isso?

```js
// Your code here.

console.log(isEven(50));
// → true
console.log(isEven(75));
// → false
console.log(isEven(-1));
// → ??
```

**Dica:** Sua função será semelhante à função interna `find` do exemplo recursivo `findSolution` neste capítulo, com uma cadeia de declarações `if`/`else if`/`else` que testam qual dos três casos se aplica. O `else` final, correspondente ao terceiro caso, é responsável por fazer a chamada recursiva. Cada uma das ramificações deverá conter uma declaração de retorno ou retornar um valor específico.

Quando o argumento recebido for um número negativo, a função será chamada recursivamente várias vezes, passando para si mesma um número cada vez mais negativo, afastando-se cada vez mais de retornar um resultado. Ela, eventualmente, consumirá todo o espaço em memória da pilha de chamadas e abortar.

### Contando feijões

Você pode acessar o N-ésimo caractere, ou letra, de uma `string` escrevendo `"string".charAt(N)`, similar a como você acessa seu tamanho com `"s".length`. O valor retornado será uma `string` contendo somente um caractere (por exemplo, `"b"`). O primeiro caractere está na posição zero, o que faz com que o último seja encontrado na posição `string.length -1`. Em outras palavras, uma `string` com dois caracteres possui tamanho (`length`) dois, e suas respectivas posições são `0` e `1`.

Escreva uma função `countBs` que receba uma `string` como único argumento e retorna o número que indica quantos caracteres "B", em maiúsculo, estão presentes na `string`.

Em seguida, escreva uma função chamada `countChar` que se comporta de forma parecida com `countBs`, exceto que ela recebe um segundo argumento que indica o caractere que será contado (ao invés de contar somente o caractere "B" em maiúsculo). Reescreva `countBs` para fazer essa nova funcionalidade.

```js
// Your code here.

console.log(countBs(“BBC”));
// → 2
console.log(countChar(“kakkerlak”, “k”));
// → 4
```

**Dica:** Um laço de repetição em sua função fará com que todos os caracteres na `string` sejam verificados se usarmos um índice de zero até uma unidade abaixo que seu tamanho (`< string.length`). Se o caractere na posição atual for o mesmo que a função está procurando, ele incrementará uma unidade na variável de contagem (`counter`). Quando o laço chegar ao seu fim, a variável `counter` deverá ser retornada.

Certifique-se de usar e criar variáveis locais à função, utilizando a palavra-chave `var`.
