# Escopo de Variável JavaScript e Hoisting Explicado

#### Artigo traduzido. Postado originalmente em [JavaScript.is(Sexy)](http://javascriptissexy.com/javascript-variable-scope-and-hoisting-explained/) em 31/01/2013

Neste artigo, nós vamos aprender sobre escopo de variáveis e hoisting (hasteamento) no JavaScript e tudo sobre as idiosscincrasias (pecularidades) de ambos.

É imperativo que nós temos entendimento de como o escopo de variável e o hasteamento de variável funciona no JavaScript. Estes conceitos podem parecer simples, mas não são. Há algumas importantes sutilezas que nós devemos entender, se nós quisermos ser desenvolvedores JavaScript bem sucedidos.

##Escopo de Variável
	
Um escopo de variável é o contexto em que a variável existe. Ele especifica onde e se você pode acessar uma variável.

Variáveis tem ou um escopo local ou um escopo global.

##Variáveis Locais (Escopo Nível-Função [Function-Level])
	
Ao contrário da maioria das linguagens de programação, o JavaScript não tem um escopo em nível de bloco (escopo de variável envolvido por chaves); como alternativa, no JavaScript temos escopo por nível-função. Variáveis declaradas dentro de uma função são variáveis locais e são somente acessíveis dentro desta função ou por funções dentro da função. Veja meu post de [Closures](http://javascriptissexy.com/javascript-closures-in-lovely-detail/) para saber mais em como acessar variáveis em funções exteriores a partir de funções interiores.

Demonstração de Escopo de Nível-Função

```javascript

	var name = "Richard";

	function showName () {
		var name = "Jack"; //variável local; somente acessível na função showName
		console.log (name); //Jack
	}

	console.log (name); //Richard: a variável global

```

Sem Escopo Bloqueado por Nível

```javascript

	var name = "Richard";
	//o bloco neste condicional if não cria um contexto para a variável name
	if (name) {
		name = "Jack"; //este name é a variável global name e será mudada para "Jack" aqui
		console.log (name);	//Jack: ainda como variável global
	}

	//Aqui, a variável name é a mesma variável global name, mas ela foi mudada no condicional if
	console.log (name); //Jack

```

### Se você não declarar suas variáveis locais, os problemas estarão próximos

Sempre declare suas variáveis locais antes de usá-las. Na verdade, você deve usar o [JSHint](http://www.jshint.com/) para verificar seu código e checar erros de sintaxe e guias de estilo. Aqui está o problema em não declarar variáveis locais:

```javascript
	
//Se você não declarar suas variáveis locais com a palavra chave var, 
elas se tornam parte do escopo global
var name = "Michael Jackson";

function showCelebrityName () {
	console.log (name);
}

function showOrdinaryPersonName () {
	name = "Johnny Evers"; //note a ausência da palavra chave var, 
tornando esta variável global
	console.log (name);
}

showCelebrityName (); //Michael Jackson

//name não é uma variável local, ele simplesmente muda a variável global name
showOrdinaryPersonName (); //Johnny Evers

//A variável global é agora Johnny Evers, não mais Michael Jackson
showCelebrityName (); //Johnny Evers

//A solução é declarar sua variável local com a palavra chave var
function showOrdinaryPersonName () {
	var name = "Johnny Evers"; 
       //Agora name é sempre uma variável local e não irá sobrescrever a variável global
	console.log (name);
}

```

### Variáveis locais têm prioridade sobre variáveis globais nas funções

Se você declarar uma variável global e uma variável local com o mesmo nome, a variável local terá prioridade quando você tentar usá-la dentro de uma função (escopo local):

```javascript
		
	var name = "Paul";

	function users () {
		//Aqui, a variável name é local e prevalece sobre a mesma variável name no escopo global
		var name = "Jack";

		//A busca por name começa aqui dentro da função antes de tentar enxergar fora da função no escopo global
		console.log (name);
	}

	users (); //Jack

```

## Variáveis Globais

Todas as variáveis declaradas fora de uma função estão no escopo global. No navegador, que é onde estamos interessados como desenvolvedores front-end, o contexto global ou escopo é o objeto window (ou o documento HTML inteiro).

- Qualquer variável declarada ou inicializada fora de uma função é uma variável global, e estará portanto disponível para toda a aplicação. Por exemplo:

```javascript

//Para declarar uma variável global, você pode utilizar qualquer dos seguintes métodos:
var myName = "Richard";

//ou mesmo
firstName = "Richard";

//ou
var name;
name;

```

É importante notar que todas as variáveis globais são anexadas no objeto window. Então, todas as variáveis globais que nós declaramos podem ser acessadas pelo object window como assim:

```javascript

console.log(window.myName); //Richard;

//ou
console.log("myName" in window); //true
console.log("firstName" in window); //true

```

- Se uma variável é inicializada (atribuída com um valor) sem primeiro ser declarada com a palavra chave var, ela é automaticamente adicionada ao contexto global sendo assim portanto uma variável global:

```javascript

function showAge() {
	//age é uma variável global porque ela não foi declarada com a palavra chave var dentro da função
	age = 90;
	console.log(age); 
}

//age está no contexto global, então está disponível aqui, também
console.log(age); //90

```

Demonstração de variáveis que estão no Escopo Global mesmo que pareça o contrário

```javascript

//Ambas variáveis firstName estão no escopo global, mesmo que a segunda esteja dentro do bloco {}
var firstName = "Richard";
{
	var firstName = "Bob";
}

//Para reiterar: JavaScript não tem escopo por nível de bloco

//A segunda declaração ou firstName simplesmente redeclara e sobrescreve a primeira
console.log (firstName); //Bob

```

Outro exemplo:

```javascript

for (var i = 1; i <= 10; i += 1) {
	console.log (i); //imprimi 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
}

//A variável é uma variável global e está acessível na seguinte função com o último valor que lhe foi atribuído acima
function aNumber () {
	console.log (i);
}

//A variável i na função aNumber abaixo é a variável global i que foi alterada no loop acima. Seu último valor foi 11, determinado antes da saída do loop
aNumber (); //11

```

### Variáveis setTimeout são executadas no Escopo Global
Note que todas as funções setTimeout são executadas no escopo global. Isso é um pouco complicado, considere isto:

```javascript

//O uso do objeto "this" dentro da função setTimeout se refere ao objeto Window, não ao myObj

var highValue = 200;
var constantVal = 2;
var myObj = {
	highValue: 20,
	constantVal: 5,
	calculateIt: function () {
		setTimeout (function () {
			console.log(this.constantVal * this.highValue);
		}, 2000);
	}
} 

//O objeto "this" na função setTimeout usou as variáveis globais highValue e constantVal, porque o "this" na função setTimeout se refere ao objeto global window, não ao meu objeto myObj como poderíamos esperar

myObj.calculateIt(); //400

//Este é um ponto importante a ser lembrado!

```

###Não polua o Escopo Global

Se você quiser ser um mestre JavaScript, o que certamente você quer ser (caso contrário você estaria assistindo 'Honey Boo Boo' agora), você tem que saber que é importante evitar a criação de muitas variáveis no escopo global, tal como isto:

```javascript

//Estas duas variáveis estão no escopo global e elas não deveriam estar aqui
var firstName, lastName;

function fullName () {
	console.log ("Full name: " + firstName + " " + lastName);
}

```

Este é o código melhorado e a maneira correta de se evitar poluir o escopo global

```javascript

//Declare as variáveis dentro da função onde serão variáveis locais
function fullName () {
	var firstName = "Michael", lastName = "Jackson";

	console.log("Full Name: " + firstName + " " + lastName);
}

```

Neste exemplo, a função fullName está no escopo global.



## Hasteamento de Variáveis (Variable Hoisting)

Todas declarações de variáveis são hasteadas (levantadas e declaradas) no topo da função, se definida dentro da função, ou no topo do contexto global, se usada fora de uma função.

É importante saber que somente declarações de variáveis são hasteadas ao topo, não a inicialização de variáveis ou atribuições (quando para uma variável é atribuído um valor).

Exemplo de Hasteamento de Variável:

```javascript

function showName () {
	console.log ("First Name: " + name);
	var name = "Ford";
	console.log ("Last Name: " + name);
}

showName ();
//First Name: undefined
// Last Name: Ford

//A razão para a primeira impressão ser undefined é que a variável local name foi hasteada ao topo da função
//Isto significa que ela é a variável local que foi chamada na primeira vez
//Veja como o código realmente é processado pela engine (motor) JavaScript

function showName () {
	var name; //name é hasteada (note que está indefinida (undefined) até este ponto, até que a atribuição aconteça abaixo)
	console.log ("First Name: " + name); //First Name: undefined

	name = "Ford"; //é atribuído um valor a name

	//Agora name é Ford
	console.log ("Last Name: " + name); //Last Name: Ford
}

```

### Declaração de Função Sobrescreve Declaração de Variável Quando Hasteada

Ambas declarações de funções e variáveis são hasteadas para o topo do escopo que as contém. Declaração de função tem prioridade sobre declaração de variável (mas não tem sobre atribuição de variável). Como foi dito acima, atribuição de variável não é hasteada, e nem atribuição de função. Como um lembrete, isto é uma atribuição de função: var myFunction = function () {}
Aqui temos um exemplo básico para demonstração:

```javascript

//variável e função, ambas são nomeadas "myName"
var myName;
function myName () {
	console.log ("Rich");
}

//A declaração da função sobrescreve a variável name
console.log (typeof myName); //function

```

```javascript

//Mas neste exemplo, a atribuição da variável sobrescreve a declaração da função
var myName = "Richard"; //Isso é a atribuição de variável (inicialização) que sobrescreve a declaração da função

function myName () {
	console.log ("Rich");
}

console.log (typeof myName); //string

```

É importante notar que as expressões de função, como o exemplo abaixo, não são hasteadas

```javascript

var myName = function () {
	console.log ("Rich");
}

```

No modo estrito, é um erro se você atribuir a uma variável um valor antes de declarar a variável. É uma ótima prática sempre declarar suas variáveis
