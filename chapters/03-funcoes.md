# Funções

> "As pessoas pensam que a ciência da computação é a arte dos gênios, mas a realidade atual é o oposto, são somente pessoas fazendo coisas dependendo uns dos outros, como um muro de pequenas pedras."
>
> - Donald Knuth

Você viu valores de funções, e como chamá-las. Funções são o "pão com manteiga" da programação JavaScript. O conceito de envolver um pedaço do programa em um valor tem várias serventias. Isto é uma ferramenta para estruturar programas maiores, para reduzir a repetição, associando nomes com sub-programas, e isolando estes sub-programas entre eles.

A mais óbvia aplicação das função é a definição de um novo vocabulário. ??? Creating new words left and right in regular, human-language prose is usually bad style. In programming, it is indispensable. ???

Um adulto típico que fala a língua inglesa tem em torno de 20 mil palavras em seu vocabulário. Poucas linguagens de programação têm consigo 20 mil conceitos embutidos. E o vocabulário que está disponível tende a ser mais precisamente definido, e então menos flexível, que as palavras da linguagens falada. Assim, frequentemente temos que adicionar algo do nosso próprio vocabulário para evitar a nossa repetição.

## Definindo Uma Função

Uma definição de função é somente uma definição normal de variável onde o valor dado a variável passa a ser uma função. Por exemplo, isso define a variável `square` para se referir a uma função que produz o quadrado do número dado:

```js

var square = function (x) {
	return x * x;
};

console.log(square(12));
// 144

```

Uma função é criada por uma expressão que começa com a palavra-chave `function`. Funções tem um conjunto de parâmetros (neste caso, somente `x`), e um "corpo", contendo as declarações que são executadas quando a função é chamada. Estas declarações devem sempre estar envoltas entre chaves, mesmo quando o corpo consiste em apenas uma simples declaração (como no exemplo).

Uma função pode ter múltiplos parâmetros, ou nenhum.

```js

var makeNoise = function () {
	console.log("Pling!");
};

makeNoise();
//Pling!

var power = function (base, exponent) {
	var result = 1;
	for (var count = 0; count < exponent; count++)
		result *= base;

	return result;
};

console.log(power(2, 10));
// 1024

```

Algumas funções produzem um valor, como as funções `power` e `square` vistas acima, e algumas não, como a `makeNoise` (que somente tem um efeito secundário). Uma declaração `return` é usada para determinar o valor que retorna da função. Quando o controle passa por esta declaração, imediatamente ele pula para fora da função atual e retorna o valor para o código que chamou a função. A palavra-chave `returned` sem uma expressão após ela vai retornar `undefined`.

## Parâmetros e Escopos

Os parâmetros de uma função comportam-se como variáveis - mas aquelas que são utilizadas para declarar um valor inicial pelo chamador da função, não o código da função em si.

Uma propriedade muito importante das funções é que variáveis criadas dentro das funções, incluindo seus parâmetros, são *locais* à função. Isso significa, por exemplo, que a variável `result` no exemplo `power` vai ser novamente criada toda vez que a função for chamada, e suas encarnações separadas não interferem umas com as outras.

Essa "senso de localidade" das variáveis se aplica somente aos parâmetros e as variáveis declaradas com a palavra-chave `var` dentro do corpo da função. É possível acessar variáveis *globais* (não-locais) dentro de uma função, contanto que você não tenha declarado uma variável local com o mesmo nome.

O código seguinte demonstra isto. Ele define (e chama) duas funções que ambas atribuem um valor à variável `x`. No primeiro declaramos a variável como local e depois mudamos somente a variável local. No segundo não declaramos `x` localmente, e portanto, as referências ao `x` dentro dele irão se referir a variável global `x` definida no início do exemplo.

```js

var x = "outside";

var f1 = function () {
	var x = "inside f1";
};
f1();
console.log(x);
// outside

var f2 = function () {
	x = "inside f2";
};
f2();
console.log(x);
// inside f2

```

Este comportamento ajuda a prevenir interferências acidentais entre funções. Se todas as variáveis estiverem compartilhadas por todo o programa, teria que haver um enorme esforço, em todos os programas, até mesmo os mais ínfimos, para garantir que nenhum nome estivesse sendo usado duas vezes. E se você reusasse o nome de uma variável, iria perceber estranhos efeitos, com código confuso e não relacionado ao valor de sua variável. Tratando as variáveis como existentes apenas na localidade dentro da função, a linguagem torna muito mais fácil de ler e entender as funções como pequenos universos, sem muitas ações a distância para complicar as coisas.

## Escopo Aninhado

No JavaScript, a distinção não é somente entre variáveis *globais* e *locais*. Na realidade, existem graus de localidade. Funções podem ser criadas em qualquer lugar dentro do programa, incluindo dentro de outras funções.

Por exemplo, esta função sem sentido tem duas funções dentro dela:

```js

var landscape = function () {
	var result = "";
	var flat = function (size) {
		for (var count = 0; count < size; count++)
			result += "_";
	};
	var moutain = function (size) {
		result += "/";
		for (var count = 0; count < size; count++)
			result += "/";
			for (var count = 0; count < size; count++)
				result += "'";
			result += "\\";
	};

	flat(3);
	moutain(4);
	flat(6);
	moutain(1);
	flat(1);
	return result
};

console.log(landscape());
// ___/''''\______/'\_

```
As funções `flat` e `moutain` podem "ver" a variável chamada `result`, desde que elas estejam dentro da função que define `result`. Mas elas não podem ver as variáveis `count` uma da outra, somente a sua própria, pois estão exteriores a cada uma. O ambiente fora da função não vê qualquer de suas variáveis definidas dentro de `landscape`.

Em resumo, cada escopo local pode também ver o escopo local em que estiver dentro. O conjunto de variáveis dentro de uma função é determinado pelo lugar que essa função está no texto do programa. Todas as variáveis de blocos "em volta" de uma definição de função estão visíveis, que significa ambas as variáveis de corpos de funções ao seu redor e em níveis mais altos do programa. Essa abordagem para variáveis visíveis é chamado escopo lexical.

Pessoas com experiência com outras linguagens de programação devem experar que qualquer bloco de código (entre chaves) produzem um novo ambiente local. Mas no JavaScript, funções são as únicas coisas que criam um novo escopo. Você está autorizado a usar blocos de instalação livre:

```js

var something = 1;
{
	var something = 2;
	// Faça algo com a variável something
}
// Fora do bloco novamente

```

Mas a `something` dentro do bloco se refere a mesma variável que a fora do bloco. Na realidade, embora blocos como este sejam permitidos, eles são úteis somente para agrupar o corpo de uma declaração `if` ou um loop. 

Se você acha isso estranho, você não está sozinho. A próxima versão do JavaScript vai introduzir a palavra-chave `let`, que funciona como `var`, mas cria uma variável que é local ao bloco que a contém, não a *função* que a contém.

## Funções Como Valores

Normalmente, variáveis de função simplismente atuam como nomes para um específico pedaço do programa. Elas são definidas uma vez, e nunca mudam. Isso torna fácil a confusão entre a função e seu nome.

Mas os dois são diferentes. Um valor de função pode fazer todas as coisas que outros valores podem fazer - você pode usá-lo em todo tipo de expressão, não somente chamá-lo. É possível armazenar um valor em um novo local, ou passá-lo como um argumento para uma função, e por ai vai. Similarmente, uma variável que contém uma função continua sendo uma variável regular, e pode ser atribuída com um novo valor.

```js

var launchMissiles = function (value) {
	missileSystem.launch("now");
};
if (safeMode)
	launchMissiles = function (value) {/* não faz nada */};

```

No capítulo 5, nós vamos discutir as maravilhosas coisas que podem ser feitas passando valores de função para outras funções.

## Notação Por Declaração

Existe uma forma ligeiramente mais curta para dizer "`var x = function...`". A palavra-chave `function` também pode ser usada no início da declaração, para produzir uma instrução de declaração da função.

```js

function square (x) {
	return x * x;
}

```

Isso define a variável `square` e a aponta para a determinada função. Até ai tudo bem. Há uma sutileza com esta forma de definição de função:

```js

console.log("The future says: ", future());

function future() {
	return "Nós CONTINUAMOS não tendo carros voadores."
}

```

Estas definições não fazem parte do fluxo de controle de cima para baixo. Elas são conceitualmente movidas para o topo, e podem ser usadas por todo o código no mesmo escopo. Isso algumas vezes é útil, pois permite que você coloque o código interessante no topo, e continue usando as definições de funções abaixo.

O que acontece quando você coloca uma definição de função dentro de um bloco condicional `if`, ou um loop? Bom, não faça isso. Direfentes plataformas JavaScript (nos navegadores) tem tradicionalmente feito coisas diferentes nesta situação, e o último padrão realmente proibe isto. Então, se você quiser que seus programas sejam consistentes, somente use essa forma de instruções por definição de função no bloco externo de uma função ou programa.

```js

function example () {
	function a () {} // Okay
	if (something) {
		function b () {} // Danger!
	}
}

```

## A Pilha de Chamadas

Acredito que vai ser útil dar uma olhada mais de perto na maneira como o controle flui através das funções. Aqui temos um simples programa fazendo algumas chamadas de funções:

```js

function greet (who) {
	console.log("Hello" + who);
}
greet("Harry");
console.log("Bye");

```

Uma *corrida* neste programa vai ser mais ou menos assim: A chamada a `greet` faz com que o controle pule para o início desta função (linha 2), que chama `console.log` (uma função embutida do navegador), permitindo que ele assuma o controle. Isso eventualmente termina, e o controle retorna para a linha 2. Nós chegamos no fim da função `greet`, então retornamos de volta ao lugar em que a chamamos, na linha 4. A linha após a chamada de `console.log()` novamente. Nós podemos mostrar o fluxo de controle esquematicamente assim:

```

top
   greet
        console.log
   greet
top
   console.log
top

```

Tendo função, quando retorna, voltar ao local da chamada, o computador deve lembrar-se do contexto que a função foi chamada. Em um caso, `console.log` pulou para a função `greet`. Em outro caso, ele pularia para o fim do programa.

O lugar onde este contexto é armazenado é o *call stack* (pilha de chamada). Toda vez que uma função é chamada, o contexto atual é colocado no topo desta "pilha" de contextos. Quando a função retorna, ela pega o topo do contexto desta pilha, e o usa para continuar a execução.

Essa pilha requer espaço da memória para ser armazenada. Quando ela aumenta demais, o computador vai enviar uma mensagem como "out of stack space" (fora do espaço da pilha) ou "too much recursion" (muitas recursões). O código seguinte ilustra isso - ele pergunta ao computador uma questão realmente difícil, que causa um infinito vai e vem entre duas funções. Ou melhor, isso vai ser infinito, se nós temos uma pilha infinita. Como é finita, ela vai ficar sem espaço e "explodir a pilha".

```js

function chicken () {
	return egg();
}
function egg () {
	return chicken();
}
console.log(chicken() + " came first.");

```

## Argumentos Opcionais

O código seguinte é permitido e executa sem problemas:

```js

alert("Hello", "Good Evening", "How do you do?");

```

A função `alert` oficialmente aceita somente um argumento. No entanto, quando você a chama assim, ela não reclama. Ela simplesmente ignora os outros argumentos e lhe mostra "Hello".

O JavaScript é extremamente tolerante sobre a quantidade de argumentos que você passa a uma função. Se você passa muitos, os extras são ignorados. Se você passar poucos, as variáveis para os parâmetros faltantes simplesmente receberão o valor `undefined`.

A desvantagem disso é que possivelmente - e provavelmente - você vai passar um número errado de argumentos de forma acidental para as funções... e ninguém vai alertá-lo sobre isso.

A vantagem é que este comportamento pode ser usado para uma função que pega estes argumentos "opcionais". Por exemplo, esta versão de `power` pode ser chamada ou com 2 argumentos ou com um simples argumento, em que neste caso o expoente é dois, e a função se comporta como `square`.

```js

function power (base, expoent) {
	if (expoent == undefined)
		expoent = 2;

	var result = 1;
	for (var count = 0; count < expoent; count++)
		result *= base;

	return result;
}

console.log(power(4));
// 16
console.log(power(4, 3));
// 64

```

No próximo capítulo, nós vamos ver uma forma em que o corpo de uma função pode pegar a lista exata de argumentos que foi passado. Isso é útil pois torna possível para a função aceitar qualquer número de argumentos. `console.log` faz uso disso - ela retorna todos os valores dados.

```js

console.log("R", 2, "D", 2);
// R 2 D 2

```

## Closure

A habilidade de tratar funções como valores, combinado com o fato que variáveis locais são "recriadas" todas as vezes que a função é chamada, traz à tona uma questão interessante. O que acontece com as variáveis locais quando a chamada de função que as criou não está mais ativa? O código seguinte ilustra isso:

```js

function wrapValue (n) {
	var localVariable = n;
	return function () { return localVariable };
}

var wrap1 = wrapValue(1);
var wrap2 = wrapValue(2);
console.log(wrap1());
// 1
console.log(wrap2());
// 2

```

Quando `wrapValue` é chamada, ela cria uma variável local que armazena este parâmetro, e então retorna uma função que retorna essa variável local. Isso é permitido, e funciona como você esperaria - a variável sobrevive. De fato, instâncias múltiplas da variável podem estar vivas ao mesmo tempo, que é outra boa ilustração do conceito de que variáveis locais realmente são recriadas para toda chamada - chamadas diferentes não podem sobrepor outras variáveis locais.

Essa característica, nos torna capazes de referenciar uma instância específica de variáveis locais em uma função que as engloba, isso é chamado *closure*. Uma função que "fecha sobre" variáveis locais é chamada uma *closure*. Este comportamento não somente o liberta da preocupação sobre a vida das variáveis, como também permite usos criativos de valores da função.

Com uma pequena mudança, podemos tornar a função exemplo em uma forma de criar funções que multiplicam por uma quantidade arbitrária:

```js

function multiplier (factor) {
	return function (number) {
		return number * factor;
	};
}

var twice = multiplier(2);
console.log(twice(5));
// 10

```

A variável local explícita do exemplo `wrapNumber` não é necessária, pois um parâmetro é ele mesmo uma variável local.

Pensar sobre programas dessa forma requer um certo exercício. Um bom modelo mental é pensar a palavra-chave `function` como "congelando" o código em seu corpo, e envolvendo-o dentro de um pacote (valor). Então quando você lê `return function (...) {...}`, há um pedaço de computação sendo congelada para uso posterior, e um manipulador para esta computação será retornado.

Esta computação congelada é retornada de `multiplier` e armazenada na variável `twice`. A última linha do exemplo então chama o valor nesta variável, fazendo com que o código envolto (`return number * factor;`) finalmente seja ativado. Ele continua tendo acesso à variável `factor` da chamada `multiplier` que o criou, e em adição ele tem acesso ao argumento que nós passamos a ele, 5, através do parâmetro `number`.

## Recursão

É perfeitamente possível para uma função chamar a si própria. Uma função que chama a si mesma é denominada *recursiva*. Recursão permite a algumas funções serem escritas de uma forma divertida. Por exemplo, esta implementação alternativa de `power`:

```js

function power (base, exponent) {
	if (exponent == 0)
		return 1;
	else
		return base * power(base, exponent - 1);
}

console.log(power(2, 3));

```

Essa é uma forma muito próxima que os matemáticos definem a exponenciação, e indiscutivelmente define o conceito de uma forma mais elegante que uma variação de loop faz. A função chama a si mesma múltiplas vezes com diferentes argumentos para alcançar a múltiplicação repetida.

Temos um problema importante: Em implementações típicas no JavaScript, esta segunda versão é aproximadamente dez vezes mais lenta que a primeira. Rodar sobre um simples loop é muito mais barato que chamar uma função inúmeras vezes. Em cima disso, usando um expoente suficientemente grande para esta função pode fazer com que a pilha transborde.

O dilema da velocidade versus a elegância é interessante. Quase todo programa pode ser feito mais rápido, tornando-o maior e mais complicado. Você pode ver isso como um tipo de disputa entre amigabilidade para homens ou máquinas.

No caso da função `power` anterior, o não elegante versão (loop) é ainda sim simples e fácil de ser lida. Não tem muito sentido trocá-lo pela versão recursiva. Muitas vezes, porém, os conceitos que um programa está lidando são tão complexos que dar mais eficiência ao invés de fazer programas mais simples se torna uma escolha atrativa.

A regra básica, que tem sido repetida por muitos programadores e com a qual eu concordo plenamente, é não se preocupar com eficiência até que você saiba com certeza que o programa está muito lento. Quando isso acontecer, encontre quais partes estão gastando maior tempo, e comece a trocar elegância por eficiência nestas partes.

Claro, a regra anterior não significa que vamos ignorar performance completamente. Em muitos casos, como na função `power`, não ganhamos muita simplicidade pela abordagem "elegante". Em outros casos, um programador experiente pode ver imediatamente que uma abordagem simples nunca vai ser rápida o suficiente.

A razão por eu estar salientando isso é que surpreendentemente muitos programadores iniciantes focam inicialmente em eficiência, mesmo nos mais pequenos detalhes. O resultado são programas maiores, mais complicados e as vezes menos corretos, que demoram mais para serem escritos do que equivalentes mais simples e que rodam somente um pouco mais rápidos.

Porém, recursão não é sempre uma alternativa menos eficiente para fazer loops. Alguns problemas são muito mais fáceis de resolver com recursão do que com loops. A maioria destes problemas requerem exploração ou processamento de vários "branches" (ramificações), cada um dos quais pode ramificar-se de novo em mais ramos.

Considere este quebra-cabeça: Iniciando com o número 1 e repetidamente adicionando 5 ou multiplicando por 3, uma infinita quantidade de números pode ser produzida. Como você pode escrever uma função que, dado um número, tente achar a sequência de adições e multiplicações que produzem este número?

Por exemplo, o número 13 pode ser alcançado primeiramente multiplicando por 3 e depois adicionando 5 duas vezes. O número 15 não pode ser alcançado de nenhuma forma.

Aqui uma solução recursiva:

```js

function findSolution (goal) {
	function find (start, history) {
		if (start == goal)
			return history;
		else if (start > goal)
			return null;
		else
			return find(start + 5, "(" + history + " + 5)") ||
				   find(start * 3. "(" + history + " * 3");
	}
	return find(1, "1");
}

console.log(findSolution(24));
// (((1 * 3) + 5) * 3)

```

Note que não é necessário encontrar uma sequência mais curta de operações - ela é satisfeita quando encontra qualquer sequência.

Eu não espero necessariamente que você veja como isso funcione imediatamente. Mas vamos trabalho nisso, pois é um grande exercício para o pensamento recursivo.

A função interior `find` faz a recursão real. Ela pega dois argumentos, o número atual e a string que registra como chegamos neste número, e retorna ou uma string que mostra como chegar no número esperado, ou `null`.

Em razão de fazer isso, é realizado 3 ações. Se o número atual é o número esperado, o histórico atual é uma forma de encontrar o objetivo, então ele é simplesmente retornado. Se o número atual é maior que o esperado, não há sentido em continuar explorando o histórico, desde que ambas as possibilidades farão o número ainda maior. E finalmente, se nós estamos abaixo do objetivo, a função tenta todos os caminhos possíveis que iniciam do número atual, chamando-o duas vezes, uma para ambos os próximos passos permitidos. Se a primeira chamada retorna algo que não é `null`, ela é retornada. De outra forma, a segunda chamada é retornada (independetemente se ela produz uma string ou null).

Como essa simples função produz o efeito que estamos procurando? Vamos ver as chamadas à `find` que são feitas quando buscamos por uma solução para o número 13:

```

find(1, "1")
  find(6, "(1 + 5)")
    find(11, "((1 + 5) + 5)")
      find(16, "(((1 + 5) + 5) + 5)")
        too big
      find(33, "(((1 + 5) + 5) * 3)")
        too big
    find(18, "((1 + 5) * 3)")
      too big
  find(3, "(1 * 3)")
    find(8, "((1 * 3) + 5)")
      find(13, "(((1 * 3) + 5) + 5)")
        found!

```

A indentação sugere a profundidade da pilha de chamadas. A primeira chamada a `find` chama `find` duas vezes, para explorar as soluções que começam com `(1 + 5)` e `(1 * 3)`. A primeira chamada falha para encontrar a solução que começa com `(1 + 5)` - usando recursão, ela explora todas as soluções que produzem um número menor que o número esperado. Então, ela retorna `null`, e o operador `||` causa a chamada que explora `(1 * 3)` e a faz acontecer. Esta teve mais sorte, sua primeira chamada recursiva, através de *outra* chamada recursiva, encontrou o número procurado 13. Então, uma string é retornada, e cada um dos operadores `||` no intermédio da chamada nos mostram a sequência, que é a nossa solução.

## Funções Crescentes

Existem duas formas mais ou menos naturais para as funções serem introduzidas nos programas.

A primeira é que você se encontra escrevendo código muito parecido muitas vezes. Nós queremos evitar isso - ter mais código significa mais espaço para erros acontecerem, e mais material para ser lido por pessoas tentando entender o programa. Então pegamos a funcionalidade repetida, encontramos um bom nome para isso, e a colocamos dentro de uma função.

A segunda forma é que você precisa de alguma funcionalidade que você ainda não escreveu, e isso soa como necessidade de uma função própria. Você vai começar nomeando a função, e então escrever seu corpo. Você pode até escrever primeiro outro pedaço de código que já usa a função, antes de criar a função em si.

A dificuldade de se encontrar um bom nome para uma função é um bom indicativo de quão claro está um conceito o qual você tenta envolver. Vamos ver um exemplo.

Nós queremos escrever um programa que imprime dois números, a quantidade de vacas e galinhas em uma fazenda, com as palavras `Cows` e `Chickens` depois deles, e zeros inseridos antes de ambos os números para que estes sempre sejam números de três digitos.

```

007 Cows
011 Chickens

```

Bom, isso claramente é uma função com dois argumentos. Vamos codar.

```js

function printFarmInventory(cows, chickens) {
  var cowString = String(cows);
  while (cowString.length < 3)
    cowString = "0" + cowString;
  console.log(cowString + " Cows");
  var chickenString = String(chickens);
  while (chickenString.length < 3)
    chickenString = "0" + chickenString;
  console.log(chickenString + " Chickens");
}
printFarmInventory(7, 11);

```

Adicionando `.length` depois do valor de uma string vai nos fornecer o comprimento desta string. Então, o loop `while` continua colocando zeros na frente do número de strings até que tenha no mínimo 3 caracteres de comprimento.

Missão cumprida! Mas quando iriamos enviar o código a ele (juntamente com uma fatura pesada é claro), o fazendeiro ligou e disse que começou a criar porcos (pigs), e se poderíamos extender o software para também imprimir `pigs`.

Nós podemos claro. Mas antes de entrar no processo de copiar e colar estas quatro linhas mais uma vez, vamos parar e reconsiderar. Deve existir uma forma melhor. Aqui a primeira tentativa:

```js

function printZeroPaddedWithLabel(number, label) {
  var numberString = String(number);
  while (numberString.length < 3)
    numberString = "0" + numberString;
  console.log(numberString + " " + label);
}

function printFarmInventory(cows, chickens, pigs) {
  printZeroPaddedWithLabel(cows, "Cows");
  printZeroPaddedWithLabel(chickens, "Chickens");
  printZeroPaddedWithLabel(pigs, "Pigs");
}

printFarmInventory(7, 11, 3);

```

Funcionou! Mas este nome, `printZeroPaddedWithLabel` é um pouco estranho. Ele funde três coisas - printing, zero-padding e adding a label - em uma simples função.

Ao invés de ressaltar a parte repetida do programa destacado, vamos tentar escolher outro conceito. Podemos fazer melhor:

```js

function zeroPad(number, width) {
  var string = String(number);
  while (string.length < width)
    string = "0" + string;
  return string;
}

function printFarmInventory(cows, chickens, pigs) {
  console.log(zeroPad(cows, 3) + " Cows");
  console.log(zeroPad(chickens, 3) + " Chickens");
  console.log(zeroPad(pigs, 3) + " Pigs");
}

printFarmInventory(7, 16, 3);

```

`zeroPad` tem um belo e óbvio nome, que torna fácil para qualquer um ler o código e saber o que ele faz. E ele é útil em mais situações do que somente neste programa específico. Por exemplo, você pode usá-lo para imprimir belas tabelas alinhadas com números.

Quão esperta e versátil nossa função é? Nós podemos escrever qualquer coisa desde uma função extremamente simples que apenas formata um número para ter três caracteres de largura, até um complicado sistema de formatação de números fracionários, números negativos, alinhamento de pontos, formatação com diferentes caracteres e por ai vai...

Um princípio útil é não adicionar inteligência a menos que você tenha certeza absoluta que irá precisar. Pode ser tentador escrever "estruturas" gerais para cada pouco de funcionalidade que você se deparar. Resista a isso. Você não terá nenhum trabalho feito, e você vai acabar escrevendo um monte de código que ninguém nunca vai usar.

## Funções e Efeitos Colaterais

Funções podem ser dividas em aquelas que são chamadas pelos seus efeitos colaterais e aquelas que são chamadas pelo seu valor de retorno. (Embora também seja definitivamente possível de ter ambos efeitos colaterais e retorno de um valor.)

A primeira função auxiliar no exemplo da fazenda, `printZeroPaddedWithLabel`, é chamada pelo seu efeito colateral (ela imprimi uma linha). A segunda, `zeroPad`, é chamada pelo seu valor de retorno. Não é coincidência que a segunda é útil em mais situações que a primeira. Funções que criam valores são mais fáceis de ser combinadas em novas formas do que realizando diretamente um efeito colateral.

Uma função *pura* é um tipo específico de *função de produção de valor* que não somente não tem efeitos colaterias, como também não depende de efeitos colaterais de outro código - por exemplo, ela não lê variáveis que são ocasionalmente mudadas por outro código. Uma função pura tem a agradável propriedade que, quando chamada com os mesmos argumentos, ela sempre produz os mesmos valores (e não faz nada mais). Isso a torna fácil de ser pensada - uma chamada a ela pode ser mentalmente substituída por seu resultado, sem alterar o significado do código. Quando você não tem certeza se uma função está funcionando corretamente, você pode testá-la simplesmente chamando-a e sabendo que se ela funciona neste contexto, ela vai funcionar em qualquer contexto. Função impuras devem retornar valores diferentes baseado em vários tipos de valores e têm efeitos colaterais que podem ser difíceis de testar e pensar sobre.

Não há necessidade de se sentir mal ao escrever função impuras, nem começar uma guerra santa e limpar todos os códigos impuros. Efeitos colaterais são úteis também. Não existe uma forma pura de escrever um `console.log`, por exemplo, e o `console.log` é certamente útil. Algumas operações também podem ser mais caras quando feitas sem efeitos colaterais, quando todo os dados envolvidos precisam ser copiados, ao invés de modificados.

## Resumo

Este capítulo ensinou a você como escrever suas próprias funções. A `function keyword`, quando usada como uma expressão, pode criar um valor de função. Quando usada como uma declaração, pode ser usada para declarar uma variável e dar a ela uma função como valor.

```js

// Create a function and immediately call it
(function (a) { console.log(a + 2); })(4);
// → 6

// Declare f to be a function
function f(a, b) {
  return a * b * 3.5;
}

```
Um aspecto chave no entendimento das funções é entender os escopos locais. Parâmetros e variáveis declaradas dentro de uma função são locais a função, recriados todas as vezes que a função é chamada, e não visíveis do lado de fora. Funções declaradas dentro de outras funções têm acesso ao escopo das funções exteriores.

Separando as tarefas diferentes seu programa executa diferentes funções e isso é útil. Você não precisa de repetir a si mesmo várias vezes, e quando alguém tentar ler seu programa, ele poderá ter o mesmo papel que capítulos e seções de um texto normal.

## Exercícios

### Mínimo

The previous chapter introduced the standard function Math.min that returns its smallest argument. We can do that ourselves now. Write a function min that takes two arguments and returns their minimum.

```js
// Your code here.

console.log(min(0, 10));
// → 0
console.log(min(0, -10));
// → -10
```

T> If you have trouble putting braces and parentheses in the right place to get a valid function definition, start by copying one of the examples in this chapter and modifying it.
T>
T> A function may contain multiple return statements.

### Recursion

We’ve seen that % (the remainder operator) can be used to test whether a number is even or odd by using % 2 to check whether it’s divisible by two. Here’s another way to define whether a positive whole number is even or odd:

* Zero is even.

* One is odd.

* For any other number N, its evenness is the same as N - 2.

Define a recursive function isEven corresponding to this description. The function should accept a number parameter and return a Boolean.

Test it on 50 and 75. See how it behaves on -1. Why? Can you think of a way to fix this?

```js
// Your code here.

console.log(isEven(50));
// → true
console.log(isEven(75));
// → false
console.log(isEven(-1));
// → ??
```

T> Your function will likely look somewhat similar to the inner `find` function in the recursive `findSolution` example in this chapter, with an `if/else if/else` chain that tests which of the three cases applies. The final else, corresponding to the third case, makes the recursive call. Each of the branches should contain a return statement or in some other way arrange for a specific value to be returned.
T>
T> When given a negative number, the function will recurse again and again, passing itself an ever more negative number, thus getting further and further away from returning a result. It will eventually run out of stack space and abort.

### Bean counting

You can get the Nth character, or letter, from a string by writing `"string".charAt(N)`, similar to how you get its length with `"s".length`. The returned value will be a string containing only one character (for example, `"b"`). The first character has position zero, which causes the last one to be found at position `string.length - 1`. In other words, a two-character string has length 2, and its characters have positions 0 and 1.

Write a function countBs that takes a string as its only argument and returns a number that indicates how many uppercase “B” characters are in the string.

Next, write a function called `countChar` that behaves like `countBs`, except it takes a second argument that indicates the character that is to be counted (rather than counting only uppercase "B" characters). Rewrite `countBs` to make use of this new function.

```js
// Your code here.

console.log(countBs("BBC"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4
```

T> A loop in your function will have to look at every character in the string by running an index from zero to one below its length (< string.length). If the character at the current position is the same as the one the function is looking for, it adds 1 to a counter variable. Once the loop has finished, the counter can be returned.
T>
T> Take care to make all the variables used in the function local to the function by using the var keyword.