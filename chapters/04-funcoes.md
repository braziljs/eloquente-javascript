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

http://eloquentjavascript.net/2nd_edition/preview/03_functions.html#p_DBlUpIUwg8