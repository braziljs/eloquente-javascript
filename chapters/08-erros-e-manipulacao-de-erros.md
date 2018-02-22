# Bugs e manipulação de erros

> “Debugar é duas vezes mais difícil do que escrever código. Portanto, se você escrever código da maneira mais inteligente possível, por definição, você não é inteligente o suficiente para debugá-lo.”
> — Brian Kernighan and P.J. Plauger, The Elements of Programming Style

> Yuan-Ma havia escrito um pequeno programa onde utilizou muitas variáveis globais e atalhos que faziam a qualidade do seu código inferior. Lendo o programa, um estudante perguntou: “Você nos avisou para não usar essas técnicas e mesmo assim as encontro no seu programa. Como pode isso?”. O mestre respondeu: “Não há necessidade de se buscar uma mangueira de água quando a casa não está em chamas.”
> — Master Yuan-Ma, The Book of Programming

Programas são pensamentos “cristalizados”. Algumas vezes, esses pensamentos são confusos e erros podem ser inseridos quando convertemos pensamentos em código, resultando em um programa com falhas.

Falhas em um programa são normalmente chamadas de *bugs*, e podem ser causadas por erros inseridos pelo programador ou problemas em outros sistemas que a aplicação interage. Alguns *bugs* são imediatamente aparentes, enquanto outros são sutis e podem ficar escondidos em um sistema por anos.

Muitas vezes os problemas aparecem quando um programa executa de uma forma que o programador não considerou originalmente. Às vezes, tais situações são inevitáveis. Quando o usuário insere um dado inválido, isso faz com que a aplicação fique em uma situação difícil. Tais situações devem ser antecipadas e tratadas de alguma maneira.

## Erros do programador

O nosso objetivo é simples quando se trata de erros do programador. Devemos encontrá-los e corrigi-los. Tais erros podem variar entre erros simples que faz o computador reclamar assim que ele tenta executar o programa ou erros sutis causado por uma compreensão errada da lógica do programa levando a resultados incorretos, podendo ser constante ou em apenas algumas condições específicas. Esse último tipo de erros pode levar semanas para ter um diagnóstico correto.

O nível de ajuda que as linguagens oferecem para encontrar os erros variam bastante. Isso não é nenhuma surpresa pois o JavaScript está no "quase não ajuda em nada" no final dessa escala. Algumas linguagens exigem os tipos de todas as suas variáveis e expressões antes mesmo de executar; isso dá a possibilidade do programa nos dizer imediatamente quando um tipo é usado de forma incorreta.
JavaScript considera os tipos somente na execução do programa e mesmo assim ele permite que você faça algumas coisas visivelmente absurdas sem dar nenhum tipo de aviso como por exemplo: `x = true "macaco" *`.

Há algumas coisas que o JavaScript não se queixa. Mas escrever um programa que é sintaticamente incorreto faz com que ele nem execute e dispare um erro imediatamente.
Existem outras coisas como, chamar algo que não é uma função ou procurar uma propriedade em um valor indefinido, isso causa um erro a ser relatado somente quando o programa entrar em execução e encontrar essa ação que não tem sentido.

Mas muitas das vezes um cálculo absurdo pode simplesmente produzir um `NaN` (não um número) ou um valor indefinido. O programa irá continuar alegremente convencido de que está fazendo algo correto. O erro vai se manifestar somente mais tarde, depois que o valor falso passou por várias funções. Não que isso venha desencadear um erro em tudo, mas isso pode silenciosamente causar uma série de saídas erradas. Encontrar a fonte de tais problemas são considerados difíceis.

O processo de encontrar erros (bugs) nos programas é chamado de depuração.

# Modo estrito

JavaScript pode ser feito de uma forma mais rigorosa, permitindo que o modo seja estrito. Para obter esse modo basta inserir uma string `"use strict"` na parte superior de um arquivo ou no corpo de uma função. Veja o exemplo:

````js
function canYouSpotTheProblem() {
  "use strict";
  for (counter = 0; counter < 10; counter++)
    console.log("Happy happy");
}

canYouSpotTheProblem();
// → ReferenceError: counter is not defined
````

Normalmente, quando você esquece de colocar `var` na frente de sua variável como acontece no exemplo, o JavaScript cria uma variável global para utilizá-la, no entanto no modo estrito um erro é relatado. Isto é muito útil. Porém deve-se notar que isso não funciona quando a variável em questão já existe como uma variável global, isso é apenas para atribuição ou criação.

Outra mudança no modo estrito é que esta ligação tem o valor `undefined` para funções que não são chamadas como métodos. Ao fazer tal chamada fora do modo estrito a referência do objeto é do escopo global. Então se você acidentalmente chamar um método ou um construtor incorretamente no modo estrito o JavaScript produzirá um erro assim que ele tentar ler algo com isso ao invés de seguir trabalhando normalmente com a criação e leitura de variáveis globais no objeto global.

Por exemplo, considere o seguinte código que chama um construtor sem a nova palavra-chave, na qual seu objeto não vai se referir a um objeto recém-construído:

````js
function Person(name) { this.name = name; }
var ferdinand = Person("Ferdinand"); // oops
console.log(name);
// → Ferdinand
````

Assim, a falsa chamada para `Person` foi bem sucedida, mas retornou um valor indefinido e criou uma variável global. No modo estrito, o resultado é diferente.

````js
"use strict";
function Person(name) { this.name = name; }
// Oops, forgot 'new'
var ferdinand = Person("Ferdinand");
// → TypeError: Cannot set property 'name' of undefined
````

Somos imediatamente informados de que algo está errado. Isso é útil.

Existe mais coisas no modo estrito. Ele não permite dar a uma função vários parâmetros com o mesmo nome e remove totalmente certas características problemáticas da linguagem.

Em suma, colocando um `"use strict"` no topo do seu programa não irá causar frustrações mas vai ajudar a detectar problemas.

## Testando

A linguagem não vai nos ajudar muito a encontrar erros, nós vamos ter que encontrá-los da maneira mais difícil: executando o programa e analisando se o comportamento está correto.

Fazer sempre testes manualmente é uma maneira insana de conduzir-se. Felizmente é possível muitas das vezes escrever um segundo programa que automatiza o teste do seu programa atual.

Como por exemplo, vamos construir um objeto `Vector`:

````js
function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
````

Vamos escrever um programa para verificar se a nossa implementação do objeto `Vector` funciona como o esperado. Então cada vez que mudarmos a implementação o programa de teste é executado, de modo que fiquemos razoavelmente confiantes de que nós não quebramos nada. Quando adicionarmos uma funcionalidade extra (por exemplo, um novo método) no objeto `Vector`, também devemos adicionar testes para o novo recurso.

````js
function testVector() {
  var p1 = new Vector(10, 20);
  var p2 = new Vector(-10, 5);
  var p3 = p1.plus(p2);

  if (p1.x !== 10) return "fail: x property";
  if (p1.y !== 20) return "fail: y property";
  if (p2.x !== -10) return "fail: negative x property";
  if (p3.x !== 0) return "fail: x from plus";
  if (p3.y !== 25) return "fail: y from plus";
  return "everything ok";
}
console.log(testVector());
// → everything ok
````

Escrevendo testes como este tende a parecer um pouco repetitivo e um código estranho. Felizmente existem opções de software que ajudam a construir e executar coleções de testes (suites de teste), fornecendo uma linguagem (na forma de funções e métodos) adequada para expressar os testes e emitir informações informativas de quando um teste falhou. Isto é chamados de estruturas de teste.

## Depuração

Você consegue perceber que há algo errado com o seu programa quando ele está se comportando mal ou produzindo erros; o próximo passo é descobrir qual é o problema.

Às vezes é óbvio. A mensagem de erro vai apontar para a linha específica; e se você olhar para a descrição do erro e para linha de código muitas vezes você irá entender o problema.

Mas nem sempre é assim. Às vezes a linha que desencadeou o problema é simplesmente o primeiro lugar onde um valor falso foi produzido e que em outros lugares foi usado de uma forma incorreta ou as vezes não há nenhuma mensagem de erro, apenas um resultado inválido. Se você tentou resolver os exercícios nos capítulos anteriores você provavelmente já experimentou tais situações.

O exemplo seguinte tenta converter um número inteiro para uma cadeia em qualquer base (decimal, binário, e assim por diante), para se livrar do último dígito escolhemos o último dígito repetidamente e em seguida dividimos. Mas a saída produzida sugere que ele tem um bug.

````js
function numberToString(n, base) {
  var result = "", sign = "";
  if (n < 0) {
    sign = "-";
    n = -n;
  }
  do {
    result = String(n % base) + result;
    n /= base;
  } while (n > 0);
  return sign + result;
}
console.log(numberToString(13, 10));
// → 1.5e-3231.3e-3221.3e-3211.3e-3201.3e-3191.3e-3181.3…
````

Mesmo se você já viu o problema e fingiu por um momento que você não viu. Sabemos que o nosso programa não está funcionando corretamente e queremos descobrir o porquê.

Esta é a hora onde você deve resistir à tentação de começar a fazer mudanças aleatórias no código. Em vez disso pense, analise o que está acontecendo e chegue a uma teoria de por que isso pode estar acontecendo. Então faça observações adicionais para testar esta teoria ou se você ainda não tem uma teoria, faça observações adicionais que podem ajudá-lo.

Colocar algumas chamadas `console.log` estratégicas no programa é uma boa maneira de obter informações adicionais sobre o que o programa está fazendo. Neste caso queremos tomar os `n` valores de 13, 1 até 0. Vamos descrever o seu valor no início do loop.

````
13
1.3
0.13
0.013
…
1.5e-323
````

Certo. Dividindo 13 por 10 não produz um número inteiro. Em vez de `n / = base` o que nós realmente queremos é `n = Math.floor (n / base)` de modo que o número está devidamente deslocando-se para a direita.

Uma alternativa para o uso do `console.log` é usar os recursos de depuração do seu browser. Navegadores modernos vêm com a capacidade de definir um ponto de interrupção em uma linha específica de seu código. Isso fará com que a execução do programa faz uma pausa a cada vez que a linha com o ponto de interrupção é atingido. Isso permite que você inspecione os valores das variáveis nesse ponto. Eu não vou entrar em detalhes aqui pois depuradores diferem de navegador para navegador, mas vale a pena olhar as ferramentas de desenvolvimento do seu navegador e pesquisar na web para obter mais informações. Outra maneira de definir um ponto de interrupção é incluir uma declaração no depurador (que consiste em simplesmente em uma palavra-chave) em seu programa. Se as ferramentas de desenvolvedor do seu navegador estão ativos, o programa fará uma pausa sempre que ele atingir esta declaração e você será capaz de inspecionar o seu estado.

## Propagação de erros

Infelizmente nem todos os problemas podem ser evitados pelo programador. Se o seu programa se comunica com o mundo externo de qualquer forma há uma chance da entrada de outros sistemas estarem inválidos ou a comunicação estar quebrada ou inacessível.

Programas simples ou programas que são executados somente sob a sua supervisão pode se dar ao luxo de simplesmente desistir quando esse problema ocorre. Você vai olhar para o problema e tentar novamente. Aplicações "reais" por outro lado espera que nunca falhe. Às vezes a maneira correta é tirar a má entrada rapidamente para que o programe continue funcionando. Em outros casos é melhor informar ao usuário o que deu de errado para depois desistir. Mas em qualquer situação o programa tem de fazer algo rapidamente em resposta ao problema.

Digamos que você tenha uma função `promptInteger` que pede para o usuário um número inteiro e retorna-o. O que ele deve retornar se a entradas do usuário for incorreta?

Uma opção é fazê-lo retornar um valor especial. Escolhas comuns são valores nulos e indefinido.

````js
function promptNumber(question) {
  var result = Number(prompt(question, ""));
  if (isNaN(result)) return null;
  else return result;
}

console.log(promptNumber("How many trees do you see?"));
````

Isto é uma boa estratégia. Agora qualquer código que chamar a função `promptNumber` deve verificar se um número real foi lido, e na falha deve de alguma forma recuperar preenchendo um valor padrão ou retornando um valor especial para o seu chamador indicando que ele não conseguiu fazer o que foi solicitado.

Em muitas situações, principalmente quando os erros são comuns e o chamador deve explicitamente tê-las em conta, retornaremos um valor especial, é uma forma perfeita para indicar um erro. Mas essa maneira no entanto tem suas desvantagens. Em primeiro lugar, como a função pode retornar todos os tipos possíveis de valores? Para tal função é difícil encontrar um valor especial que pode ser distinguido a partir de um resultado válido.

O segundo problema é com o retorno de valores especiais, isso pode levar a um código muito confuso. Se um pedaço de código chama a função `promptNumber` 10 vezes, teremos que verificar 10 vezes se nulo foi devolvido. E se a sua resposta ao encontrar nulo é simplesmente retornar nulo, o chamador por sua vez tem que verificar assim por diante.

## Exceções

Quando uma função não pode prosseguir normalmente, o que gostaríamos de fazermos é simplesmente parar o que esta sendo feito e saltar imediatamente de volta para o lugar onde devemos lidar com o problema. Isto é o que faz o tratamento de exceção.

As exceções são um mecanismo que torna possível parar o código que é executado com problema disparando (ou lançar) uma exceção que nada mais é que um simples valor. Levantando uma exceção lembra um pouco um retorno super carregado a partir de uma função: ele salta para fora não apenas da função atual mas também fora de todo o caminho de seus interlocutores para a primeira chamada que iniciou a execução atual. Isto é chamado de desenrolamento do `stack`. Você pode se lembrar das chamadas de função do `stack` que foi mencionado no Capítulo 3. Uma exceção é exibida no `stack` indicando todos os contextos de chamadas que ele encontrou.

Se as exceções tivessem um `stack` de uma forma ampliada não seria muito útil. Eles apenas fornecem uma nova maneira de explodir o seu programa. Seu poder reside no fato de que você pode definir "obstáculos" ao longo do seu `stack` para capturar a exceção. Depois você pode fazer alguma coisa com ele no ponto em que a exceção foi pega para que o programa continua em execução.

Aqui está um exemplo:

````js
function promptDirection(question) {
  var result = prompt(question, "");
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new Error("Invalid direction: " + result);
}

function look() {
  if (promptDirection("Which way?") == "L")
    return "a house";
  else
    return "two angry bears";
}

try {
  console.log("You see", look());
} catch (error) {
  console.log("Something went wrong: " + error);
}
````

A palavra-chave `throw` é usada para gerar uma exceção. Para tratar uma exceção basta envolver um pedaço de código em um bloco `try`, seguido pela palavra-chave `catch`. Quando o código no bloco `try` causa uma exceção a ser lançada o bloco `catch` é chamado. O nome da variável (entre parênteses) após captura será vinculado ao valor de exceção. Após o término do bloco `catch` ou do bloco `try` o controle prossegue sob toda a instrução `try/catch`.

Neste caso usaremos o construtor de erro para lançar o nosso valor de exceção. Este é um construtor JavaScript normal que cria um objeto com uma propriedade de mensagem. Em ambientes de JavaScript modernos instâncias deste construtor também coletam informações para o `stack` e sobre chamadas que existia quando a exceção foi criado, o chamado `stack` de rastreamento. Esta informação é armazenada na propriedade do `stack` e pode ser útil ao tentar depurar um problema: ela nos diz a função precisa de onde ocorreu o problema e que outras funções que levou até a chamada onde ocorreu a falha.

Note que se olharmos para função `promptDirection` podemos ignoramos completamente a possibilidade de que ela pode conter erros. Esta é a grande vantagem do tratamento de erros - manipulação de erro no código é necessário apenas no ponto em que o erro ocorre e no ponto onde ele é tratado. Essas funções no meio pode perder tudo sobre ela.

Bem, estamos quase lá.

## Limpeza após exceções

Considere a seguinte situação: a função `withContext` quer ter certeza de que durante a sua execução, o contexto de nível superior da variável tem um valor de contexto específico. Depois que terminar ele restaura esta variável para o seu valor antigo.

````js
var context = null;

function withContext(newContext, body) {
  var oldContext = context;
  context = newContext;
  var result = body();
  context = oldContext;
  return result;
}
````

Como que o `body` gera uma exceção? Nesse caso, a chamada para `withContext` será exibido no `stack` pela exceção, e o contexto nunca será definido de volta para o seu valor antigo.

O `try` tem mais uma declaração. Eles podem ser seguidos por um `finally` com ou sem o bloco `catch`.
O bloco `finally` significa "não importa o que aconteça execute este código depois de tentar executar o código do bloco try".
Se uma função tem de limpar alguma coisa, o código de limpeza geralmente deve ser colocado em um bloco `finally`.

 ````js
 function withContext(newContext, body) {
  var oldContext = context;
  context = newContext;
  try {
    return body();
  } finally {
    context = oldContext;
  }
}
````

Note-se que não temos mais o resultado do `context` para armazenar (o que queremos voltar) em uma variável. Mesmo se sair diretamente do bloco try o último bloco será executado. Então podemos fazer isso de um jeito mais seguro:

````js
try {
  withContext(5, function() {
    if (context < 10)
      throw new Error("Not enough context!");
  });
} catch (e) {
  console.log("Ignoring: " + e);
}
// → Ignoring: Error: Not enough context!

console.log(context);
// → null
````

Mesmo que a chamada da função `withContext` explodiu,  `withContext` limpou corretamente a variável `context`.

## Captura seletiva

Quando uma exceção percorre todo o caminho até o final do `stack` sem ser pego,  ele é tratado pelo `environment`. Significa que isto é diferente entre os ambientes. Nos navegadores uma descrição do erro normalmente é escrita no console do JavaScript (alcançável através de "Ferramentas" do navegador no menu de "developer").

Erros passam muitas vezes como algo normal, isto acontece para erros do programador ou problemas que o browser não consegue manipular o erro. Uma exceção sem tratamento é uma forma razoável para indicar a um programa que ele esta quebrado e o console JavaScript em navegadores modernos terá que fornecer-lhe algumas informações no `stack` sobre quais foram as chamadas de funções quando o problema ocorreu.

Para problemas que se espera que aconteça durante o uso rotineiro chegando como uma exceção e que não seja tratada isso pode não ser uma resposta muito simpática.

Usos incorretos da linguagem como, a referência a uma variável inexistente, propriedade que tem null ou chamar algo que não é uma função também irá resultar em lançamentos de exceções. Essas exceções podem ser capturados como outra qualquer.

Quando um pedaço de código é inserido no bloco `catch`, todos nós sabemos que algo em nosso corpo `try` pode ou vai causar uma exceção. Mas nós não sabemos o que ou qual exceção que sera lançada.

O JavaScript (tem uma omissão gritante) não fornece suporte direto para a captura seletiva exceções: ou você manipula todos ou você trata de algum em específico. Isto torna muito fácil supor que a exceção que você recebe é o que você estava pensando quando escreveu o bloco `catch`.

Mas talvez não seja nenhuma das opções citadas. Alguma outra hipótese pode ser violada ou você pode ter introduzido um erro em algum lugar que está causando uma exceção. Aqui está um exemplo que tentei manter a chamada a função `promptDirection` até que ele receba uma resposta válida:

````js
for (;;) {
  try {
    var dir = promtDirection("Where?"); // ← typo!
    console.log("You chose ", dir);
    break;
  } catch (e) {
    console.log("Not a valid direction. Try again.");
  }
}
 ````

O `for (;;)` é a construção de um loop infinito de forma intencionalmente que não para sozinho. Nós quebramos o circuito de fora somente quando uma direção válida é fornecida. Mas a mal escrita do `promptDirection` resultará em um erro de "variável indefinida". O bloco `catch` ignora completamente o seu valor de exceção, supondo que ele sabe qual é o problema ele trata equivocadamente o erro de variável como uma indicação de má entrada. Isso não só causa um loop infinito mas também exibi uma mensagem de erro incorretamente sobre a variável que estamos usando.

Como regra geral não capturamos exceções a menos que tenha a finalidade de monitora-las em algum lugar, por exemplo através de softwares externos conectados à nossa aplicação que indica quando nossa aplicação está caída. E assim mesmo podemos pensar cuidadosamente sobre como você pode estar escondendo alguma informação.

E se quisermos pegar um tipo específico de exceção? Podemos fazer isso através da verificação no bloco catch para saber se a exceção que temos é a que queremos, dai então é so lançar a exceção novamente. Mas como que nós reconhecemos uma exceção?

Naturalmente nós poderíamos fazer uma comparação de mensagens de erros. Mas isso é uma forma instável de escrever código pois estaríamos utilizando informações que são destinadas ao consumo humano (a mensagem) para tomar uma decisão programática. Assim que alguém muda (ou traduz) a mensagem o código irá parar de funcionar.

Em vez disso, vamos definir um novo tipo de erro e usar `instanceof` para identificá-lo.

````js
function InputError(message) {
  this.message = message;
  this.stack = (new Error()).stack;
}

InputError.prototype = Object.create(Error.prototype);
InputError.prototype.name = "InputError";
````

O `prototype` é feito para derivar-se de `Error.prototype` para que `instanceof Error` retorne `true` para objetos de `InputError`. Nome a propriedade também é dada para tipos de erro padrão (`Error`, `SyntaxError`, `ReferenceError` e assim por diante) para que também se tenha uma propriedade.

A atribuição da propriedade no `stack` tenta deixar o rastreamento do objeto pelo `stacktrace` um pouco mais útil, em plataformas que suportam a criação de um objeto de erro regular pode usar a propriedade de `stack` do objeto para si próprio.

Agora `promptDirection` pode lançar um erro.

````js
function promptDirection(question) {
  var result = prompt(question, "");
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new InputError("Invalid direction: " + result);
}
````

E o loop pode ser tratado com mais cuidado.

````js
for (;;) {
  try {
    var dir = promptDirection("Where?");
    console.log("You chose ", dir);
    break;
  } catch (e) {
    if (e instanceof InputError)
      console.log("Not a valid direction. Try again.");
    else
      throw e;
  }
}
````

Isso vai pegar apenas os casos de `InputError` e através disso deixa algumas exceções independentes. Se você introduzir um erro de digitação ou um erro de variável indefinida a aplicação nos avisará.

## Asserções

As asserções são ferramentas que auxiliam na verificação da sanidade básica de erros do programador. Considere essa função auxiliar que afirma:

````js
function AssertionFailed(message) {
  this.message = message;
}
AssertionFailed.prototype = Object.create(Error.prototype);

function assert(test, message) {
  if (!test)
    throw new AssertionFailed(message);
}

function lastElement(array) {
  assert(array.length > 0, "empty array in lastElement");
  return array[array.length - 1];
}
````

Isso fornece uma maneira compacta de fazer cumprir as expectativas solicitadas para quebrar um programa se a condição descrita não for válida. Por exemplo se a função `lastElement` que busca o último elemento de uma matriz voltar indefinida para matrizes vazias caso a declaração for omitida. Buscar o último elemento de uma matriz vazia não faz muito sentido por isso é quase certeza de que um erro de programação pode acontecer.

As afirmações são maneiras de certificar-se de que erros pode causar falhas e qual o ponto deste erro ao invés de valores sem sentido produzidos silenciosamente que pode acarretar problemas em uma parte do programa a qual não se tem nenhuma relação de onde ocorreu realmente.

## Resumo

Erros e má entrada acontecem. Erros de programas precisam ser encontrados e corrigidos. Eles podem tornar-se mais fácil de perceber quando se tem uma suites de testes automatizadas e asserções adicionadas em seu programa.

Problemas causados por fatores fora do controle do programa devem geralmente serem tratados normalmente. Às vezes quando o problema pode ser tratado localmente, valores de retorno especiais é um caminho sensato para monitorá-los. Caso contrário as exceções são preferíveis.

Lançar uma exceção faz com que `stack` de chamadas se desencadeie o bloco `try/catch` até a parte inferior do `stack`. O valor da exceção será capturado pelo bloco `catch` onde podemos verificar se ele é realmente do tipo de exceção esperada e em seguida fazer algo com ela. Para lidar com o fluxo de controle imprevisível causado pelas exceções, o bloco `finally` pode ser utilizado para garantir que um pedaço de código seja sempre executado.

## Exercícios

### Tente outra vez...

Digamos que você tenha uma função `primitiveMultiply` que em 50 por cento dos casos multiplica dois números e em outros 50 por cento levanta uma exceção do tipo `MultiplicatorUnitFailure`. Escreva uma função que envolva esta função `MultiplicatorUnitFailure` e simplesmente tente até que uma chamada seja bem-sucedido retornando o resultado.

Certifique-se de lidar com apenas as exceções que você está tentando manipular.

````js
function MultiplicatorUnitFailure() {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.5)
    return a * b;
  else
    throw new MultiplicatorUnitFailure();
}

function reliableMultiply(a, b) {
  // Coloque seu código aqui.
}

console.log(reliableMultiply(8, 8));
// → 64
````

**Dica**

A chamada de `primitiveMultiply` obviamente deve acontecer em um bloco `try`. 
O bloco `catch` fica responsável para relançar a exceção quando não é uma instância de `MultiplicatorUnitFailure` e garantir que a chamada é repetida quando ele é uma instância de `MultiplicatorUnitFailure`.

Para refazer o processo, você pode usar um `loop` que quebra somente quando a chamada for bem sucedida; veja os exemplos de recursão nos capítulos anteriores e faça o uso; espero que você não tenha uma grande séries de erros na função `primitiveMultiply` pois isso pode extrapolar o `stack` e entrar em loop infinito.

### A caixa trancada

Considere o seguinte objeto:

````js
var box = {
  locked: true,
  unlock: function() { this.locked = false; },

  lock: function() { this.locked = true;  },

  _content: [],

  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};
````

Isto é uma caixa com um cadeado. Dentro dela tem um `array` mas você pode obtê-lo apenas quando a caixa for desbloqueada. Não é permitido acessar a propriedade `_content` diretamente.

Escreva uma função chamada `withBoxUnlocked` que assume o valor da função que é passada por argumento para abrir esta caixa. Execute a função e em seguida garanta que a caixa está bloqueada antes de voltar novamente; não importa se o argumento da função retornou normalmente ou emitiu uma exceção.

````js
function withBoxUnlocked(body) {
  // Your code here.
}

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised:", e);
}

console.log(box.locked);
// → true
````

Para ganhar pontos extras, certifique-se de que chamou `withBoxUnlocked` quando a caixa já estava desbloqueada, pois a caixa deve sempre permanecer desbloqueada.

**Dica:**

Você provavelmente deve ter adivinhado que este exercício solicita o uso do bloco `finally`. 
Sua função deve ser destravar a caixa e em seguida chamar a função que vem de argumento dentro da função `withBoxUnlocked`. 
E no `finally` ele deve travar a caixa novamente.

Para certificar-se de que nós não bloqueamos a caixa quando ela já estava bloqueada verifique no início da função se a mesma verificação é válida para quando a caixa esta desbloqueada e para quando quisermos bloquear ela novamente.
