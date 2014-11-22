# Erros e manipulação de erros

> "A depuração é duas vezes mais difícil do que escrever o código pela primeiro vez. Portanto, se você escrever o código como inteligentemente quanto possível, por definição, você não é inteligente o suficiente para depurá-lo."
>
> Brian Kernighan e PJ Plauger, Os elementos do estilo de programação

> "Yuan-Ma havia escrito um pequeno programa onde utilizou muitas variáveis globais e atalhos de má qualidade. Um estudante lendo perguntou: 'Você nos advertiu contra essas técnicas, mas acabo encontrá-las em seu programa. Como pode ser isso? O mestre disse: Não há necessidade de se buscar uma mangueira de água, quando a casa não está em chamas."
>
> Mestre Yuan-Ma, O Livro de Programação


Um programa são pensamentos cristalizadas. Às vezes, esses pensamentos estão confusos. Outras vezes, os erros são introduzidos ao converter esse pensamento em código. De qualquer forma o resultado será um programa falho.

Falhas em um programa são considerados como bugs. Bugs podem ser erros causado pelo programador ou problemas em outros sistemas que na qual o programa interage. Alguns erros podem ser detectados facilmente, enquanto outros são sutis e pode permanecer escondido em um sistema por anos.

Muitas vezes, os problemas vem a tona apenas quando um programa encontra em um estado em que o programador originalmente não considerou. Às vezes, tais situações são inevitáveis. Quando o usuário é solicitado a inserir sua idade e tipos de laranja, isso pode colocar o nosso programa em uma situação difícil. A situação tem que ser antecipado e manipulados de alguma forma. ---?

## Erros do programador

Quando se trata de erros do programador o nosso objectivo é simples. Queremos encontrá-los e corrigi-los. Tais erros podem variar entre erros simples que faz o computador reclamar assim que ele tenta executar o nosso programa ou erros sutis causado por uma compreensão errada da logica do programa levando a resultados incorretos em apenas algumas situações específicas. Esse último tipo de erros citado pode levar semanas para ter um diagnostico.

O grau de ajuda que as línguagens oferece para encontrar tais erros varia. Isso não é nenhuma surpresa, JavaScript está no "quase não ajuda em nada" final dessa escala. Algumas línguagens quer saber os tipos de todas as suas variáveis e expressões antes mesmo de executar o programa e dizer-lhe imediatamente quando um tipo é usado de forma inconsistente. JavaScript considera os tipos somente na execução do programa e mesmo assim ele permite que você faça algumas coisas visivelmente absurdas sem dar nenhum tipo aviso, como por exemplo: x = true "macaco" *.

Há algumas coisas que o JavaScript não se queixam. No entanto escrever um programa que não é sintaticamente correto dispara imediatamente um erro. Outras coisas como chamar algo que não é uma função ou procurar uma propriedade em um valor indefinido causará um erro a ser relatado quando o programa está em execução e encontra uma ação sem sentido.

Mas muitas vezes, um cálculo absurdo simplesmente pode produzir um NaN (não um número) ou o valor indefinido. E o programa continua alegremente, convencido de que está fazendo algo correto. O erro vai se manifestar somente mais tarde, depois que o valor falso passou por várias funções. Não que isso venha desencadear um erro em tudo, mas em silêncio pode causar no programa uma saída errada. Encontrar a fonte de tais problemas podem ser considerados como difíceis.

O processo de encontrar erros(bugs) nos programas é chamado de depuração.

# Modo estrito

JavaScript pode ser feito um pouco mais rigoroso, permitindo que o modo seja estrito. Isso é feito colocando uma string "use strict" na parte superior de um arquivo ou no corpo de uma função. Aqui está um exemplo:

````js
function canYouSpotTheProblem() {
  "use strict";
  for (counter = 0; counter < 10; counter++)
    console.log("Happy happy");
}

canYouSpotTheProblem();
// → ReferenceError: counter is not defined
````

Normalmente, quando você esquece de colocar `var` na frente de sua variável como acontece com o contador no exemplo, o JavaScript cria uma variável global e usa isso, no entando no modo estrito um erro é relatado. Isto é muito útil. Porém deve-se notar que isso não funciona quando a variável em questão já existe como uma variável global, isso é apenas para atribuição ou criação.

Outra mudança no modo estrito é que esta ligação tem o valor undefined em funções que não são chamadas como métodos. Ao fazer tal chamada fora do modo estrito a referencia do objeto é do escopo global. Então, se você acidentalmente chamar um método ou um construtor incorretamente no modo estrito, JavaScript produzirá um erro assim que ele tentar ler algo com isso ao invés de seguir trabalhando feliz com a criação e leitura de variáveis globais no objeto global.

Por exemplo, considere o seguinte código que chama um construtor sem a nova palavra-chave na qual seu presente não vai se referir a um objeto recém-construído:

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

Modo estrito faz mais algumas coisas. Ele não permite dar a uma função vários parâmetros com o mesmo nome e remove certas características da linguagem totalmente problemática.

Em suma, colocando um "use strict" no topo do seu programa não irá afetar em nada e pode ajudar a detectar problemas.

## Testando

A linguagem não vai nos ajudar muito para encontrar erros, nós vamos ter que encontrá-los da maneira mais difícil: executando o programa e analisando se o comportamento esta correto.

Fazer isso uma e outra vez na mão é uma maneira insana de conduzir-se. Felizmente é possível muitas das vezes escrever um segundo programa que automatiza o teste do seu programa atual.

Como por exemplo, vamos construir um tipo de Vector:

````js
function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
````

Vamos escrever um programa para verificar se a nossa implementação do Vetor funciona como esperado. Então, cada vez que mudar a implementação, acompanhe com a execução do programa de teste de modo que podemos estar razoavelmente confiantes de que nós não quebramos nada. Quando adicionar funcionalidades extras (por exemplo, um novo método) com o tipo Vector, nós também devemos adicionar testes para o novo recurso.

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

Escrevendo testes como este tende a parecer um pouco repetitivo e um código estranho. Felizmente existem opções de software que ajudam a construir e executar coleções de testes(suites de teste), fornecendo uma linguagem(na forma de funções e métodos) adequados para expressar testes e emitindo informações informativo quando um teste falhar. Estes são chamados de estruturas de teste.

## Depuração

Quando você percebe que há algo errado com o seu programa porque ele se comporta mal ou produz erros o próximo passo é descobrir qual é o problema.

Às vezes é óbvio. A mensagem de erro vai apontar para uma linha específica de seu programa, e se você olhar para a descrição do erro e para linha de código, muitas vezes você pode ver o problema.

Mas nem sempre. Às vezes a linha que desencadeou o problema é simplesmente o primeiro lugar onde um valor falso foi produzido em outros lugares é usado de forma inválida. E às vezes não há nenhuma mensagem de erro em tudo-apenas um resultado inválido. Se você tentou resolver os exercícios nos capítulos anteriores, você provavelmente já experimentou tais situações.

O exemplo de programa seguinte tenta converter um número inteiro para uma cadeia em qualquer base (decimal, binário, e assim por diante), escolhendo repetidamente o último dígito e em seguida, dividindo-se o número para se livrar deste dígito. Mas a insana saída que produz atualmente sugere que ele tem um bug.

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

Mesmo se você já viu o problema e fingi por um momento que você não viu. Sabemos que o nosso programa não está funcionando corretamente, e queremos descobrir o porquê.

Este é o lugar onde você deve resistir à tentação de começar a fazer mudanças aleatórias para o código. Em vez disso pense, analise o que está acontecendo e chegue a uma teoria de por que isso pode estar acontecendo. Então faça observações adicionais para testar esta teoria ou se você ainda não tem uma teoria, faça observações adicionais que podem ajudá-lo.

Colocar algumas chamadas console.log estratégicas para o programa é uma boa maneira de obter informações adicionais sobre o que o programa está fazendo. Neste caso queremos tomar n os valores de 13, 1 e em seguida 0. Vamos escrever o seu valor no início do loop.

````
13
1.3
0.13
0.013
…
1.5e-323
````

Right. Dividindo 13 por 10 não produz um número inteiro. Em vez de `n / = base`, o que nós realmente queremos é `n = Math.floor (n / base)`, de modo que o número está devidamente "deslocado" para a direita.

Uma alternativa ao uso console.log é usar os recursos de depurador do seu browser. Navegadores modernos vêm com a capacidade de definir um ponto de interrupção em uma linha específica de seu código. Isso fará com que a execução do programa faz uma pausa a cada vez que a linha com o ponto de interrupção é atingido e permitem que você inspecione os valores das variáveis nesse ponto. Eu não vou entrar em detalhes aqui pois depuradores diferem de navegador para navegador, mas vale a pena olhar em ferramentas de desenvolvimento do seu navegador e pesquisar na web para obter mais informações. Outra maneira de definir um ponto de interrupção é incluir uma declaração depurador(que consiste em simplesmente a palavra-chave) em seu programa. Se as ferramentas de desenvolvedor do seu navegador estão ativos, o programa fará uma pausa sempre que ele atinge essa declaração, e você será capaz de inspecionar o seu estado.