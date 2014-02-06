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

http://eloquentjavascript.net/2nd_edition/preview/03_functions.html#p_N7xZ5k5OET