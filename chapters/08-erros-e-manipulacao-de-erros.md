# Erros e manipulação de erros

> "A depuração é duas vezes mais difícil do que escrever o código pela primeiro vez. Portanto, se você escrever um código o quanto inteligentemente  possível, por definição, você não é inteligente o suficiente para depurá-lo."
>
> `Brian Kernighan e PJ Plauger, Os elementos do estilo de programação`

> ---

> "Yuan-Ma havia escrito um pequeno programa onde utilizou muitas variáveis globais e atalhos de má qualidade. Um estudante lendo perguntou: Você nos advertiu contra tais técnicas, mas acabo encontrá-las em seu programa. Como pode isso? O mestre disse: Não há necessidade de se buscar uma mangueira de água, quando a casa não está em chamas."
>
> `Mestre Yuan-Ma, O Livro de Programação`


Um programa são pensamentos cristalizadas. Às vezes, esses pensamentos estão confusos. Outras vezes, os erros são introduzidos ao converter esse pensamento em código. De qualquer forma o resultado será um programa falho.

Falhas em um programa são considerados como bugs. Bugs podem ser erros causado pelo programador ou problemas em outros sistemas que na qual o programa interage. Alguns erros podem ser detectados facilmente, enquanto outros são sutis e pode permanecer escondido em um sistema por anos.

Muitas vezes, os problemas vem a tona apenas quando um programa encontra em um estado em que o programador originalmente não considerou. Às vezes tais situações são inevitáveis. Quando o usuário é solicitado a inserir sua idade e tipos inválidos são inseridos, isso pode colocar o nosso programa em uma situação difícil. A situação tem que ser esperada e manipulados de alguma forma.

## Erros do programador

Quando se trata de erros do programador o nosso objectivo é simples. Queremos encontrá-los e corrigi-los. Tais erros podem variar entre erros simples que faz o computador reclamar assim que ele tenta executar o nosso programa ou erros sutis causado por uma compreensão errada da logica do programa levando a resultados incorretos em apenas algumas situações específicas. Esse último tipo de erros pode levar semanas para ter um diagnostico.

O nível de ajuda que as línguagens oferece para encontrar tais erros varia. Isso não é nenhuma surpresa, JavaScript está no "quase não ajuda em nada" final dessa escala. Algumas línguagens quer saber os tipos de todas as suas variáveis e expressões antes mesmo de executar; esse programa pode dizer-lhe imediatamente quando um tipo é usado de forma inconsistente. JavaScript considera os tipos somente na execução do programa e mesmo assim ele permite que você faça algumas coisas visivelmente absurdas sem dar nenhum tipo aviso, como por exemplo: `x = true "macaco" *`.

Há algumas coisas que o JavaScript não se queixam. Mas escrever um programa que é sintaticamente incorreto faz com que ele nem execute, disparando um erro imediatamente. Existem outras coisas como, chamar algo que não é uma função ou procurar uma propriedade em um valor indefinido, isso causará um erro a ser relatado somente quando o programa entrar em execução e encontrar uma ação sem sentido.

Mas muitas vezes, um cálculo absurdo simplesmente pode produzir um NaN (não um número) ou um valor indefinido. E o programa continua alegremente convencido de que está fazendo algo correto. O erro vai se manifestar somente mais tarde, depois que o valor falso passou por várias funções. Não que isso venha desencadear um erro em tudo, mas silenciosamente pode causar no programa uma saída errada. Encontrar a fonte de tais problemas podem ser considerados como difíceis.

O processo de encontrar erros(bugs) nos programas é chamado de depuração.

# Modo estrito

JavaScript pode ser feito de uma forma mais rigorosa, permitindo que o modo seja estrito. Isso é feito colocando uma string "use strict" na parte superior de um arquivo ou no corpo de uma função. Veja um exemplo:

````js
function canYouSpotTheProblem() {
  "use strict";
  for (counter = 0; counter < 10; counter++)
    console.log("Happy happy");
}

canYouSpotTheProblem();
// → ReferenceError: counter is not defined
````

Normalmente, quando você esquece de colocar `var` na frente de sua variável como acontece no contador do exemplo, o JavaScript cria uma variável global para utiliza-la, no entando no modo estrito um erro é relatado. Isto é muito útil. Porém deve-se notar que isso não funciona quando a variável em questão já existe como uma variável global, isso é apenas para atribuição ou criação.

Outra mudança no modo estrito é que esta ligação tem o valor undefined para funções que não são chamadas como métodos. Ao fazer tal chamada fora do modo estrito a referencia do objeto é do escopo global. Então, se você acidentalmente chamar um método ou um construtor incorretamente no modo estrito, JavaScript produzirá um erro assim que ele tentar ler algo com isso ao invés de seguir trabalhando feliz com a criação e leitura de variáveis globais no objeto global.

Por exemplo, considere o seguinte código que chama um construtor sem a nova palavra-chave na qual seu objeto não vai se referir a um objeto recém-construído:

````js
function Person(name) { this.name = name; }
var ferdinand = Person("Ferdinand"); // oops
console.log(name);
// → Ferdinand
````

Assim, a falsa chamada para Person foi bem sucessida, mas retornou um valor indefinido e criou uma variável global. No modo estrito, o resultado é diferente.

````js
"use strict";
function Person(name) { this.name = name; }
// Oops, forgot 'new'
var ferdinand = Person("Ferdinand");
// → TypeError: Cannot set property 'name' of undefined
````

Somos imediatamente informados de que algo está errado. Isso é útil.

Existe mais coisas no modo estrito. Ele não permite dar a uma função vários parâmetros com o mesmo nome e remove certas características da linguagem totalmente problemática.

Em suma, colocando um "use strict" no topo do seu programa não irá causar frustações mas vai ajudar a detectar problemas.

## Testando

A linguagem não vai nos ajudar muito para encontrar erros, nós vamos ter que encontrá-los da maneira mais difícil: executando o programa e analisando se o comportamento esta correto.

Fazer sempre testes manualmente uma maneira insana de conduzir-se. Felizmente é possível muitas das vezes escrever um segundo programa que automatiza o teste do seu programa atual.

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

Vamos escrever um programa para verificar se a nossa implementação do objeto `Vetor` funciona como esperado. Então, cada vez que mudarmos a implementação, acompanhe com a execução do programa de teste de modo que podemos estarmos razoavelmentes confiantes de que nós não quebramos nada. Quando adicionarmos funcionalidades extras (por exemplo, um novo método) no objeto `Vector`, nós também devemos adicionarmos testes para o novo recurso.

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

Escrevendo testes como este tende a parecer um pouco repetitivo e um código estranho. Felizmente existem opções de software que ajudam a construir e executar coleções de testes(suites de teste), fornecendo uma linguagem(na forma de funções e métodos) adequados para expressar testes e emitindo informações informativo quando um teste falhar. Isto é chamados de estruturas de teste.

## Depuração

Quando você percebe que há algo errado com o seu programa porque ele se comporta mal ou produz erros o próximo passo é descobrir qual é o problema.

Às vezes é óbvio. A mensagem de erro vai apontar para uma linha específica de seu programa, e se você olhar para a descrição do erro e para linha de código, muitas vezes você vai entender o problema.

Mas nem sempre. Às vezes a linha que desencadeou o problema é simplesmente o primeiro lugar onde um valor falso foi produzido e que em outros lugares foi usado de forma inválida ou vezes não há nenhuma mensagem de erro, apenas um resultado inválido. Se você tentou resolver os exercícios nos capítulos anteriores você provavelmente já experimentou tais situações.

O exemplo seguinte tenta converter um número inteiro para uma cadeia em qualquer base (decimal, binário, e assim por diante), escolhendo repetidamente o último dígito e, em seguida, dividindo-se o número para se livrar deste dígito. Mas a saída insana produzida sugere que ele tem um bug.

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

Mesmo se você já viu o problema e fingiu por um momento que você não viu. Sabemos que o nosso programa não está funcionando corretamente, e queremos descobrir o porquê.

Este é o lugar onde você deve resistir à tentação de começar a fazer mudanças aleatórias para o código. Em vez disso pense, analise o que está acontecendo e chegue a uma teoria de por que isso pode estar acontecendo. Então faça observações adicionais para testar esta teoria ou se você ainda não tem uma teoria, faça observações adicionais que podem ajudá-lo.

Colocar algumas chamadas console.log estratégicas para o programa é uma boa maneira de obter informações adicionais sobre o que o programa está fazendo. Neste caso queremos tomar `n` os valores de 13, 1 e em seguida 0. Vamos escrever o seu valor no início do loop.

````
13
1.3
0.13
0.013
…
1.5e-323
````

Certo. Dividindo 13 por 10 não produz um número inteiro. Em vez de `n / = base` o que nós realmente queremos é `n = Math.floor (n / base)` de modo que o número está devidamente deslocando-se para a direita.

Uma alternativa ao uso console.log é usar os recursos de depurador do seu browser. Navegadores modernos vêm com a capacidade de definir um ponto de interrupção em uma linha específica de seu código. Isso fará com que a execução do programa faz uma pausa a cada vez que a linha com o ponto de interrupção é atingido e permitem que você inspecione os valores das variáveis nesse ponto. Eu não vou entrar em detalhes aqui pois depuradores diferem de navegador para navegador, mas vale a pena olhar as ferramentas de desenvolvimento do seu navegador e pesquisar na web para obter mais informações. Outra maneira de definir um ponto de interrupção é incluir uma declaração no depurador(que consiste em simplesmente em uma palavra-chave) em seu programa. Se as ferramentas de desenvolvedor do seu navegador estão ativos, o programa fará uma pausa sempre que ele atinge essa declaração, e você será capaz de inspecionar o seu estado.

## Propagação de erros

Nem todos os problemas podem ser evitados pelo programador, infelizmente. Se o seu programa se comunica com o mundo externo, de qualquer forma há uma chance da entrada ser inválida ou outros sistemas que ele tenta se comunicar estarem quebrados ou inacessíveis.

Programas simples ou programas que são executados somente sob a sua supervisão pode dar ao luxo de simplesmente desistir quando esse problema ocorre. Você vai olhar para o problema e tentar novamente. Aplicações "reais" por outro lado espera-se que nunca falhe. Às vezes a maneira correta é tirar a má entrada rapidamente para que o programe continue funcionando. Em outros casos é melhor informar ao usuário o que deu errado para depois desistir. Mas em qualquer situação o programa tem de fazer algo rapidamente em resposta ao problema.

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

Isto é uma boa estratégia. Agora qualquer código que chamar a função `promptNumber` deve verificar se um número real foi lido, e na falha deve de alguma forma deve-se recuperar preencheendo com um valor padrão ou poderia retornar um valor especial para o seu chamador indicando que ele não conseguiu fazer o que foi solicitado.

Em muitas situações, principalmente quando os erros são comuns e o chamador deve explicitamente tê-las em conta, retornar um valor especial é uma forma perfeita para indicar um erro. Mas essa maneira no entanto tem suas desvantagens. Em primeiro lugar, como a função pode retornar todos os tipos possíveis de valores? Para tal função, é difícil encontrar um valor especial que pode ser distinguido a partir de um resultado válido.

O segundo problema com o retorno de valores especiais é que isso pode levar a um código muito confuso. Se um pedaço de código chamaa função `promptNumber` 10 vezes, tem que verificar 10 vezes se nulo foi devolvido. E se a sua resposta ao encontrar nulo é simplesmente retornar nulo, o chamador por sua vez tem que verificar e assim por diante.

## Exceções

Quando uma função não pode prosseguir normalmente, o que gostaríamos de fazer é simplesmente parar o que estamos fazendo e saltar imediatamente de volta para um lugar que saiba lidar com o problema. Isto é o que faz o tratamento de exceção.

As exceções são um mecanismo que torna possível para o código que é executado com problema levantar(ou lançar) uma exceção, que nada mais é que um simples um valor. Levantando uma exceção lembra um pouco um retorno super-carregada a partir de uma função: ele salta para fora não apenas da função atual mas também fora de todo o caminho de seus interlocutores, para a primeira chamada que iniciou a execução atual. Isto é chamado de desenrolamento da pilha. Você pode se lembrar da pilha de chamadas de função que foi mencionado no Capítulo 3. Uma exceção zumbe abaixo desta pilha, jogando fora todos os contextos de chamadas que ele encontra.

Se exceções fossem sempre ampliadas até ao fundo da pilha, não seria muito útil. Eles apenas fornecem uma nova maneira de explodir o seu programa. Seu poder reside no fato de que você pode definir "obstáculos" ao longo da pilha para capturar a exceção, como é o zoom para baixo. Depois você pode fazer alguma coisa com ele no qual após o ponto em que a exceção foi pego o programa continua em execução.

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

A palavra-chave `throw` é usada para gerar uma exceção. Para tratar uma excessão basta envolver um pedaço de código em um bloco try, seguido pela palavra-chave catch. Quando o código no bloco try causa uma exceção a ser lançada, o bloco catch é chamado. O nome da variável (entre parênteses) após captura será vinculado ao valor de exceção. Após o termino do bloco `catch` ou do bloco `try` o controle prossegue sob toda a instrução `try/catch`.

Neste caso, usamos o construtor de erro para lançar o nosso valor de exceção. Este é um construtor JavaScript normal que cria um objeto com uma propriedade de mensagem. Em ambientes de JavaScript modernos instâncias deste construtor também coletam informações sobre a pilha de chamadas que existia quando a exceção foi criado, o chamado rastreamento de pilha. Esta informação é armazenada na propriedade da pilha e pode ser útil ao tentar depurar um problema: ela nos diz a função precisa de onde ocorreu o problema e que outras funções levou até a chamada que falhou.

Note-se que se olharmos para função ignoramos completamente a possibilidade de que `promptDirection` pode conter erros. Esta é a grande vantagem de tratamento de erros - código de manipulação de erro é necessário apenas no ponto em que ocorre o erro e no ponto em que ela é tratada. As funções no meio pode perder tudo sobre ele.

Bem, quase lá...

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

Como que o `body` gera uma exceção? Nesse caso, a chamada para `withContext` será jogado fora da pilha pela exceção, e o contexto nunca será definido de volta para o seu valor antigo.


O `try` tem mais uma declaração. Eles podem ser seguidos por um `finally`
Eles podem ser seguidos por um bloco `finally` com ou sem o bloco `catch`.
O bloco `finally` significa "não importa o que aconteça, executar este código depois de tentar executar o código no bloco try".
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

Note-se que não temos mais o resultado do `context` para armazenar(o que queremos voltar) em uma variável. Mesmo se sair diretamente do bloco try o último bloco será executado. Então podemos fazer isso de um jeito mais seguro:

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

Mesmo que a função chamada de `withContext` explodiu,  `withContext` ainda limpo devidamente a variável `context`.