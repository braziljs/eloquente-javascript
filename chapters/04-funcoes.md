# Funções

Um programa muitas vezes precisa fazer a mesma coisa em diferentes lugares. Repetir todas as declarações necessárias a todo tempo é entediante e propenso a erros. Seria melhor colocarmos elas em um unico lugar, para o programa poder acessá-las sempre que necessário. É para isso que as funções foram criadas: Elas são códigos "enlatados" que o programa pode acessar sempre que quiser. Colocar uma string na tela requere algumas declarações, mas quando nós temos a função `print` nós podemos simplesmente escrever `print("Alex")` e terminar logo com isso.

Ver funções simplesmente como pedaços enlatados de código não seria justo. Quando necessárias, elas podem atuar como funções puras, algoritmos, vias indiretas, abstrações, decisões, módulos, continuações, estruturas de dados, e muito mais. Conseguir usar funções efetivamente é uma habilidade necessária para qualquer tipo de programação séria. Esse capítulo provê uma introdução sobre esse assunto, o  [capitulo 6] discute as sutilezas das funções mais profundamente.

## Funções puras

Funções puras, para começar, são as chamadas funções que aprendemos nas aulas de matemática, que eu espero que você tenha feito em algum momento de sua vida. Calcular o co-seno ou o valor absoluto de um número é uma função pura de um argumento. Adição é uma função pura de 2 argumentos.

A definição de uma função pura é que ela sempre retorna o mesmo valor quando recebe o mesmo argumento, e não possui efeitos colaterais. Elas recebem um argumento, retornam um valor baseado nesse argumento e apenas isso, não interferem em nada mais.

Em JavaScript, adição é um operador, mas ela poderia ser envolta em uma função como esta (e por mais sem sentido que isso pareça, nós iremos passar por situações que isso será muito util):

```javascript
function add(a,b){
	return a + b;
}
show ( add(2,2) );
```

`add` é o nome da função. `a` e `b` são os nomes dos argumentos. `return a + b;` é o corpo da função.

A palavra-chave `function` é **sempre** usada quando se cria uma nova função. Quando seguida por um nome, a função resultante será armazenada nesse nome. Depois do nome da função, vem a lista de argumentos, e finalmente o corpo da função. Diferente do `while` e do `if`, chaves {}  para abrir e fechar uma função são sempre obrigatórias.

A palavra chave `return`, seguida por uma expressão, é usada para determinar o valor que a função retorna. Quando a função chega em algum comando `return`, ela imediatamente é interrompida e retorna o valor contido no `return` em que ela chegou. O comando `return` sem uma declaração após ele, irá fazer com que a função retorne `undefined`.

O corpo da função pode, obviamente, ter mais que uma declaração nele. Aqui está uma função para calcular expoentes (expoentes positivos e inteiros):

```javascript
function calcExpo(base,expoente) {
	var resultado = 1;
	for (var count = 0; count < expoente;count++)
		resultado *= base;
	return resultado;
}
show ( calcExpo(2,10) );
```

Se você resolveu o [exercicio 2.2], esta técnica para calcular expoentes deve parecer familiar.

Criar uma variável( `resultado` ) e atualizar ela são efeitos colaterais. Mas eu não disse que funções puras não tinham efeitos colaterais?

Uma variável criada dentro de uma função existe somente dentro desta função.
Isso é conveniente, pois o programador não precisa criar um nome diferente para cada variavel que ele usa em um programa. Como `resultado` existe somente dentro de `calcExpo`, as mudanças nessa variável somente existem até a função retornar algo, e da perspectiva do código que chama essa função, não existem efeitos colaterais.

---------------
>Escreva uma função chamada `absolute`, que retorna o valor absoluto de um número que será dado como argumento. O valor absoluto de um número negativo é a sua versão positiva, e o valor absolute de um número positivo (ou zero) é ele mesmo.

Solução:

```javascript
function absolute(numero) {
	if (numero < 0)
		return -number;
	else
		return number;
}
show ( absolute(-144) );

```
------------------

Funções puras possuem 2 propriedades legais. É fácil pensar sobre elas, e elas são fáceis de usar.

##### Corrigir
Se uma função é pura, uma chamada a ela pode ser vista como uma coisa a ela mesma. Quando você não está certo se ela está funcionando corretamente, você pode testar ela chamando ela diretamente do console, que é simples, pois não depende de nenhum contexto. É facil fazer esses testes automaticamente - para escrever um programa que testa uma função específica. Funções não-puras podem retornar diferentes valores baseados em diferentes fatores, e possuem efeitos colaterais que podem ser difíceis de testar e pensar sobre eles. 

#### /Corrigir

Como funções puras são auto-suficientes, elas se provam comumente mais uteis e relevantes em mais situação do que as funções não-puras. Olhe `show`, por exemplo. A utilidade dessa função depende da presença de um lugar especial na tela para imprimir um resultado. Se esse lugar especial não estiver lá, a função é inútil. Nós podemos imaginar uma função relacionada, vamos chamá-la de `format`, que pega um valor como um argumento e retorna uma string que representa esse valor. Essa função é util em mais situações que `show`.

Claro, `format` não resolve o mesmo problema que `show`, e nenhuma função pura irá resolver esse problema, porque um efeito colateral é necessário. Em muitos casos, funções não-puras são exatamente o que você precisa. Em outros casos, um problema pode ser solucionado com uma função pura, mas a função não-pura equivalente é mais conveniente ou eficiente.

Porém, quando algo pode ser facilmente expressado em uma função pura, escreva dessa forma. Mas nunca se sinta culpado em escrever funções não-puras.

## Funções de efeitos colaterais

Funções com efeitos colaterais não possuem o comando `return`. Se nenhum comando de `return` é encontrado, a função retorna `undefined`.

```javascript
function exclamar(mensagem) {
	alert(mensagem + "!!");
}

exclamar("Ei");
```

## Argumentos

Os nomes de argumentos de uma função são disponiveis como variáveis dentro delas. Elas farão referência a valores dos argumentos da função que está sendo chamada com eles, e como normal variáveis criadas dentro de uma função, elas não existem fora dela. Além do ambiente de desenvolvimento geral, existem pequenos ambientes locais de desenvolvimentos criados em chamadas de funções. Quando procurando por uma variável dentro de uma função, o ambiente local é checado primeiro, e somente se essa variável não existir, o ambiente geral é checado. Isso faz com que seja possível para variáveis dentro de funções "ocultarem" as variáveis do ambiente geral que possuem o mesmo nome.

```javascript
function alertIsPrint (value) {
	var alert = print;
	alert(value);
}

alertIsPrint("Troglodites"); //Dentro da função, o alerta funcionará como print.
alert("Fora da função, funciono normalmente!");
```

As variáveis nesse ambiente local são somente visiveis para o código dentro da função. Se essa função chama outra função, a nova função chamada não vê as variáveis que estão dentro da primeira função:

```javascript
var variable = "top-level";

function mostrarVariavel() {
	print("dentro de mostrarVariavel, o valor de variable é: '" + variable + "'.");
}

function teste() {
	var variable = "local";
	print("Dentro de teste, o valor de variable é: '" + variable + "'.");
}

teste();
```

No entanto, e este é fenômeno misterioso mas extremamente útil, quando uma função é definida *dentro* de outra função, o ambiente local dela será baseado no ambiente local da função que cerca ela, em vez do ambiente geral.

```javascript
var variable = "top-level";

function funcaoParente() {
	var variable = "local";
	function funcaoFilha() {
		print(variable);
	}

	childFunction();
}

parentFunction();
```

O que isso nos mostra é que quais variáveis são visiveis dentro de uma função é determinado pelo lugar da função na escrita do programa. Todas as variáveis que são definidas 'acima' da definição de uma função são visiveis por ela, que significam ambas aquelas nos corpos de funções que cercam ela, e aquelas no ambiente geral do programa. Esse estudo sobre visibilidade de variáveis é chamado de **lexical scoping**.

## Bloco de código

Pessoas que tem experiência com outras linguagens podem esperar que um bloco de código (entre chaves) também produz um novo ambiente local. Não em JavaScript. Funções são as únicas coisas que criam novos escopos. É permitido que você use blocos como esse..

#Este exercício e sua explicação estão erradas. Corrigir.

```javascript
var algumacoisa = 1;
{
	var algumacoisa = 2;
	print ("Dentro: " + algumacoisa);
}

print ("Fora: " + algumacoisa);
```
... mas `algumacoisa` dentro do bloco se refere a mesma variável que está fora do bloco. De fato, embora blocos como este são permitidos, eles são completamente sem sentido.

## Closure

Aqui está um caso que pode te surpreender:

```javascript
var variable = "top-level";
function funcaoParente(){
	var variable = "local";
	function funcaoFilha(){
		print(variable);
	}

	return funcaoFilha();
}

var filha = funcaoParente();
filha();
```

`funcaoParente` retorna sua própria função interna, e o código no final chama essa função. Mesmo que `funcaoParente` ja tenha sido parado de executar a esse ponto, o ambiente local onde `variable` tem o valor `local` ainda existe, e `funcaoFilha` ainda usa ele. Esse fenômeno é chamado de **closure**.

## Lexical Scoping

Além de fazer com que seja fácil de ver em qual parte do programa uma variável estará disponível apenas olhando a forma da escrita, "lexical scoping" também nos permite "sintetizar" funções. Usando algumas variáveis de uma função que a cerca, uma função filha pode ser feita para fazer diferentes coisas. Imagine que precisamos de algumas funções diferentes porem similares , uma que adiciona 2 ao seu argumento, outra que adiciona 5, e por aí vai.

```javascript
function makeAddFunction(amount) {
	function add(number){
		return number + amount;
	}
	return add;
}


var addDois = makeAddFunction(2);
var addCinco = makeAddFunction(5);
show ( addDois(1) + addCinco(1) );
```

Para mergulhar de cabeça nisso, você deve considerar funções para não apenas empacotar calculos, mas sim ambientes. Funções de ambiente geral apenas são executas no ambiente geral, isso é óbvio. Mas uma função definida dentro de outra preserva acesso ao ambiente que existiu naquela função no momento que ela foi definida.

Assim, a função `add` no exemplo acima, que é criada quando a função `makeAddFunction` é chamada, captura um ambiente em que `amount` tem um certo valor. Ela "empacota" esse ambiente, junto com o cálculo `return number + amount`, em um valor, que é então retornado pela função de fora.

Quando essa função de fora ( `addDois` ou `addCinco` ) é chamada, um novo ambiente - no qual a variável `number` tem valor - é criado, como um sub-ambiente do ambiente capturado anteriormente (no qual `amount` tem valor). Esses dois valores são então adicionados, e o resultado é retornado.

## Recursividade

Em cima do fato que diferentes funções podem ter variáveis com o mesmo nome sem interferir uma com a outra, essas regras de escopo também permitem funções a chamar *elas mesmas* sem entrar em conflito. Uma função que chama a si própria é chamada de **recursiva**. Recursão permite algumas definições interessantes. Olhe para esta versão da função `calcExpo` de antes:

```javascript
function calcExpo(base,expoente) {
	if (expoente == 0)
		return 1;
	else
		return base * calcExpo(base, expoente -1);
}
```

Essa é uma definição bem próxima do jeito que os matemática definem a exponenciação, e pra mim, ela parece muito melhor que a versão anterior. É como se fosse um loop, mas sem `while`, `for`, ou mesmo um efeito colateral a ser visto. Chamando ela mesma, a função produz o mesmo efeito.

Porém, existe um problema importante: Na maioria dos browsers, essa nova versão é cerca de 10 vezes mais lenta que a primeira. Em JavaScript, rodar um loop é muito mais rápido que chamar uma função várias vezes.

## Perfomance x Elegância

O dilema de velocidade *versus* elegância é muito interessante. E não ocorre somente quando decidindo usar ou não a recursividade. Em muitas situações, uma solução elegânte, intuitiva, e muitas vezes mais fácil, pode ser substituida por uma solução mais feia e difícil, porém mais rápida.

No caso de `calcExpo` acima, a versão deselegante continua sendo simples e fácil de entender. Não há porque usar a recursividade nesse caso. Muitas vezes, embora,  os conceitos que um programa está lidando se tornam tão complexos que compensa trocar um pouco de eficiência para manter o programa mais direto.

A regra básica, seguida por muitos programadores, e a qual eu também recomendo, é a de não se preocupar com eficiência até o seu programa se provar muito lento. Quando esse momento chegar, procure as partes que o deixam lento, e comece a trocar elegância por eficiência nessas partes.

Claro, a regra acima não significa que você deve ignorar completamente a perfomance do seu programa. Em muitos casos, como a função `calcExpo`, não é ganha muita simplicidade com a versão 'elegante'. Em outros casos, um programador experiente pode ver logo de cara que uma versão mais simples nunca irá ser rápida o suficiente.

A razão de qual eu estou entrando a fundo nesse assunto é que muitos programadores focam fanaticamente na eficiência, até mesmo nos pequenos detalhes. O resultado é um programa maior, mais complicado, e muitas vezes menos correto, que demoram mais para serem feitos do que suas versões mais diretas e elegântes, e muitas vezes o ganho de perfomance é muito pouco.

## Voltando a recursividade

Bom, eu estava falando sobre recursividade. Um conceito muito relatado a recursão é algo chamado de "stack". Quando uma função é chamada, o controle é dado ao corpo da função. Quando a função termina de ser executada, o controle é dado de volta ao código que chamou a função, e é continuado. Enquanto o corpo da função é executado, o computador precisa lembrar do contexto em que a função foi chamada, para que ele possa continuar a executar o programa normalmente depois. O lugar em que esse contexto é armazenado, se chama "stack".

O fato de se chamar "stack" tem a ver com o fato de que, como nós vimos, o corpo de uma função pode chamar novamente outra função. Sempre que uma função é chamada, outro contexto tem que ser armazenado. Você pode visualizar isso como uma pilha de contextos. Sempre que uma função é chamada, o contexto atual é jogado no topo da pilha. Quando a função retorna algo, o contexto no topo é tirado da pilha e resumido.

Essa pilha requere um espaço na memória do computador parar ser armazenada. Quando essa pilha fica muito grande, o computador irá mostrar uma mensagem como "Sem espaço para a pilha", ou "muita recursão". Isso é algo para se ter em mente quando escrevendo funções recursivas.

```javascript
function galinha(){
	return ovo();
}

function ovo(){
	return galinha();
}

print (galinha() + "veio primeiro.");
```

Além de demonstrar uma interessante maneira de escrever um programa "quebrado", esse exemplo mostra que a função não precisa se chamar diretamente para ser recursiva. Se a função chama outra função que (direta ou indiretamente) chama a primeira, isso ainda é recursividade.

Recursividade não é sempre uma alternativa menos eficiente aos loops. Alguns problemas são muito mais fáceis de resolver com recursão do que com loops. Muitas vezes esses são problemas que requerem explorar ou processar diversas ramificações, cada uma com a qual pode se ramificar denovo.

Considere esse quebra-cabeça: Começando do número 1 e repetidamente adicionando 5 ou multiplicando por 3, um amontoado infinito de números podem ser produzidos. Como você escreveria uma função que, dado um número, tenta achar a sequencia de adições e multiplicações que produzem esse número?

Por exemplo: o número 13 pode ser encontrado multiplicando 1 por 3, e então adicionando 5 duas vezes. O número 15 não pode ser encontrado de maneira alguma.

Aqui está a solução:

```javascript
function findSequence(goal) {
	function find(start,history) {
		if (start == goal)
			return history;
		else if (start > goal)
			return null;
		else
			return find(start + 5, "(" + history + " + 5)"  ) || 
			find (start * 3, "(" + history + " *3)");
	}

	return find(1,"1");
}

print ( findSequence(24) );

```

Note que isso não acha necessáriamente a sequencia *mais curta* de operações, o código se satifaz quando acha qualquer sequencia que sirva.

A função filha `find`, chamando a sí mesma em 2 maneira diferentes, explora tanto a possibilidade de adicionar 5 ao número atual e a de multiplicar por 3. Quando ela acha o número, ela retorna a string `history`, que é usada para registrar todas as operações que foram feitas para chegar no número. Ela também checa se o número atual é maior que a variável `goal`, porque se for, devemos parar de explorar as ramificações, senão a função não nos dará o nosso número.

O uso do operador || nesse exemplo pode ser lido como "retorne a solução achada adicionando 5 em `start`, e se falhar, retorne a solução achada multiplicando `start` por 3." Isso também poderia ser escrito de forma mais verbal deste jeito:

```javascript
else {
	var found = find(start + 5, "(" + history + " +5)" );
	if (found == null)
		found = find(start * 3, "(" + history + " *3)");
	return found;
}

```

-------

Embora definições de funções ocorrem como declarações entre o resto do programa, elas não são partes da mesma "linha do tempo":

```javascript
print("O futuro diz: ", futuro() );

function futuro(){
	return "Nós AINDA não temos carros voadores.";
}

```

O que está acontecendo é que o computador procura primeiro por todas as definições de funções, e armazena as funções associadas *antes* de executar o resto do programa. O mesmo acontece com funções que são definidas dentro de outras funções. Quando a função de fora é chamada. a primeira coisa que acontece é que todas as funções de dentro também são adicionadas ao novo ambiente.

------------------

Existe outra maneira de definir valores de funcões, que mais se assemelha a maneira que outros valores sao criados.

Quando a palavra-chaves `function` é usada em um lugar onde uma expressão é esperada, ela é tratada como uma expressão produzindo o valor de uma função. Funções criadas desta forma não precisam receber nomes (embora é permitido dar nome a elas).

```javascript
var add = function (a,b) {
	return a + b;
};

show ( add(5,5) );
```

Note o ponto e vírgula após a definição de `add`. Definições de funções normais não precisam dele, mas essa declaração tem a mesma estrutura de `var add = 22;`, e assim, requere ponto e vírgula.

Esse tipo de valor de função é chamada de função anônima, porquê ela não precisa de um nome. As vezes é sem sentido dar nome a função, como na função `makeAddFunction` que nós vimos antes:

```javascript
function makeAddFunction(amount) {
	return function(number) {
		return number + amount;
	} ;
}
```

Como a função `add` na primeira versão de `makeAddFunction` era referida a apenas uma, o nome não serve para nada e pode retornar diretamente o valor da função.

-----------------
>Escreva uma função `maiorQue`, que recebe um argumento, um número, e retorna uma função que representa um teste. Quando essa função é chamada com um só número como argumento, ela retorna um boolean:`true` se o número é maior que o número usado para criar a função de teste, e retorna `false` caso contrário.

Solução:

```javascript
function maiorQue(x) {
	return function(y) {
		return y > x;
	};
}

var maiorQueDez = maiorQue(10);
show( maiorQueDez(9) );
```

------------------

Tente o seguinte:

```javascript
alert("Olá", "Boa tarde", "Como você está?", "Adeus");
```
A função `alert` oficialmente só aceita um argumento. Ainda assim, quando você a chama desse jeito, o computador não reclama, apenas ignora os outros argumentos.

```javascript
show();
```
Você pode, aparentemente, até mesmo escapar quando passando poucos argumentos. Quando nenhum argumento é passado, o valor dentro da função é `undefined`.

No próximo capítulos, nós veremos um jeito de como o corpo de uma função pode aceitar o exato número de argumentos que nós iremos passar. Isso pode ser útil, porque permite uma função aceitar qualquer número de argumentos. `print` utiliza isso:

```javascript
print("R",2,"D",2);
```

E claro, o lado ruim disso é que possivel passar o número errados de argumentos acidentalmente para funções que esperam um número fixo deles, como `alert`, e nunca saber o que aconteceu.