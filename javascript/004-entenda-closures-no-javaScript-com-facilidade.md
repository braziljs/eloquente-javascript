# Entenda Closures no JavaScript com Facilidade

Closures são adoráveis e muito úteis: Eles permitem aos programadores programarem criativamente, expressivamente e concisamente. Eles são usados frequentemente no JavaScript e, não importa seu nível de habilidade no JavaScript, você sem dúvidas irá encontrá-los. Claro, closures podem parecer complexos e além do seu alcance, mas depois que você ler este artigo, os closures vão ser muito mais fáceis de se entender e mais atraentes para serem usados todo os dias quando você programar em JavaScript.

Este é um artigo curto ( e doce =] ) com os detalhes dos closures no JavaScript. Você deve estar familirializado com o [Escopo de Variáveis JavaScript](https://github.com/eoop/traduz-ai/blob/master/javascript/003-escopo-de-variavel-js-e-hoisting-explicado.md#artigo-traduzido-postado-originalmente-em-javascriptissexy-em-31012013) antes de começar essa leitura adicional, porque para se entender closures você deve entender o escopo de variáveis no JavaScript.

### O que é um closure?

Um closure é uma função interior que tem acesso a variáveis de uma função exterior - cadeia de escopo. O closure tem três cadeias de escopo: ele tem acesso ao seu próprio escopo (variáveis definidas entre suas chaves), ele tem acesso as variáveis da função exterior e tem acesso as variáveis globais.

A função interior tem acesso não somente as variáveis da função exterior, mas também aos parâmetros dela. Note que a função interior não pode chamar o objeto *arguments* da função exterior, entretanto, pode chamar parâmetros da função externa diretamente.

Você cria um closure adicionando uma função dentro de outra função.

**Um Exemplo Básico de Closures no JavaScript:**

```javascript

function showName (firstName, lastName) {
	var nameIntro = "Your name is ";

	//esta função interior tem acesso as variáveis da função exterior, incluindo os parâmetros
	function makeFullName () {
		return nameIntro + firstName + " " + lastName;
	}

	return makeFullName ();
}

showName ("Michael", "Jackson"); //Your name is Michael Jackson

```

Closures são usados extensivamente no Node.js; eles são complicados no Node.js assíncrono, com arquitetura não bloqueante. Closures também são frequentemente usados no jQuery e em todo pedaço de código JavaScript que você lê.

#### Um Clássico exemplo de Closures no jQuery:

```javascript

$(function () {
	var selections = [];
	$(".niners").click(function () { //este closure tem acesso as variáveis de selections
		selections.push(this.prop ("name")); //atualiza a variável selection no escopo da função exterior
	});
});

```

## Regra dos Closures e Efeitos Colaterais

### 1. Closures tem acesso a variável das funções exteriores mesmo após o retorno da função exterior
Uma da mais importante e delicada característica dos closures é que a função interior continua tendo acesso as variáveis da função exterior mesmo após ela ter retornado. Sim, você leu corretamente. Quando funções no JavaScript executam, elas usam a mesma cadeia de escopo que estava em vigor quando foram criadas. Isso significa que mesmo depois da função exterior retornar, a função interior continua tendo acesso as variáveis da função exterior. Portanto, você pode chamar a função interior depois em seu programa. Este exemplo demonstra isso:

```javascript

function celebrityName (firstName) {
	var nameIntro = "This celebrity is ";

	//essa função interior tem acesso as variáveis da função exterior, incluindo os parâmetros
	function lastName (theLastName) {
		return nameIntro + firstName + " " + theLastName;
	}
	return lastName;
}

var mjName = celebrityName ("Michael"); 
//Nesta conjuntura, a função exterior celebrityName foi retornada

//O closure (lastName) é chamado aqui depois da função exterior ter retornado acima
//Sim, o closure continua tendo acesso as variáveis da função exterior e parâmetros
mjName ("Jackson"); //This celebrity is Michael Jackson

```

### 2. Closures armazenam referências para as variáveis da função exterior

Eles não armazenam o valor real. Closures ficam mais interessantes quando o valor da variável da função exterior muda antes que o closure seja chamado, e esta poderosa característica pode ser aproveitada de formas criativas, como este exemplo de variável privada primeiramente demonstrada por Douglas Crockford:

```javascript

function celebrityID () {
	var celebrityID = 999;
	//Nós retornamos um objeto com algumas funções interiores
	//Todas as funções interiores têm acesso as variáveis'da função exterior
	return {
		getID: function () {
			//Esta função interior vai retornar a variável celebrityID ATUALIZADA
			return celebrityID;
		},
		setID: function (theNewId) {
			//Esta função interior vai mudar a variável da função exterior a qualquer hora
			celebrityID = theNewId;
		}
	}
}

var mjID = celebrityID (); //Nesta atual conjuntura, a função exterior celebrityID já retornou
mjID.getID(); //999
mjID.setID(567); //Muda a variável da função exterior
mjID.getID(); //567 - retorna o valor atualizado da variável celebrityID  

```

### 3. Closures que deram errado

Por causa dos closures terem acesso ao valor atualizado das variáveis das funções exteriores, eles podem também conduzir a erros quando a variável da função exterior muda com um loop for. Assim:

```javascript

//Este exemplo é explicado em detalhe abaixo (logo após este bloco de código)
function celebrityIDCreator (theCelebrities) {
	var i;
	var uniqueID = 100;
	for (i = 0; i < theCelebrities.length; i += 1) {
		theCelebrities[i]["id"] = function () {
			return uniqueID + i;
		}
	}

	return theCelebrities;
}

var actionCelebs = [{name:"Stallone", id:0}, {name:"Cruise", id:0}, {name:"Willis", id:0}];

var createIdForActionCelebs = celebrityIDCreator(actionCelebs);

var stalloneID = createIdForActionCelebs[0];

console.log(stalloneID.id()); //103

```

No exemplo anterior, quando a função anônima é chamada, o valor de i é 3 (a contagem do array e então seus incrementos). O número 3 foi adicionado ao uniqueID para criar 103 para TODOS os celebrityID. Então cada posição no array retornado obteve o id = 103, ao invés do valor pretendido 100, 101, 102.

A razão para isso acontecer foi porque, assim como nós discutimos no exemplo anterior, o closure (função anônima neste exemplo) teve acesso a variável da função exemplo por referência, não por valor. Então, igual ao exemplo anteriormente mostrado onde nós acessamos o valor atualizado da variável com o closure, neste exemplo, similarmente acessamos a variável i quando ela foi alterada, depois que a função exterior rodou o loop for inteiro e retorno o último valor, que foi 103.

Para consertar este efeito colateral (bug) nos closures, você pode usar uma **Expressão de Função Imediatamente Invocada** (IIFE - immediately invoked function expression), como no exemplo seguinte:

```javascript

function celebrityIDCreator (theCelebrities) {
	var i;
	var uniqueID = 100;
	for (i = 0; i < theCelebrities.length; i += 1) {
		theCelebrities[i]["id"] = function (j) { //a variável paramétrica j é o i passado na invocação da IIFE
			return function () {
				return uniqueID + j; 
				//cada iteração do loop for passa no valor atual de i dentro desta IIFE e salva o valor correto no array
			} () //Adicionando () no fim da função, nós estamos executando-a imediatamente e retornando somente o valor de uniqueID + j, ao invés de retornar uma função
		} (i); //invocando imediatamente a função passando a variável i como um parâmetro
	}
	return theCelebrities;
}

var actionCelebs = [{name: "Stallone", id:0}, {name: "Cruise", id:0}, {name: "Willis", id:0}];

var createIdForActionCelebs = celebrityIDCreator (actionCelebs);

var stalloneID = createIdForActionCelebs [0];
console.log(stalloneID.id); //100

var cruiseID = createIdForActionCelebs [1];
console.log(cruiseID.id); //101

```