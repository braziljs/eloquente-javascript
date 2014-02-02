# Entenda Funções Callback no JavaScript e Use-as

#### Artigo traduzido. Postado originalmente em [JavaScript.is(Sexy)](http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them) em 04/03/2013

**Aprenda Funções JavaScript de Ordem Superior - Funções Callback**

No JavaScript, funções são objetos de primeira classe, isso significa que funções podem ser usadas similarmente aos objetos, desde que elas sejam de fato objetos: Elas podem ser "armazenadas em variáveis, criadas dentro de funções e retornadas de uma função".

Por funções serem objetos de primeira classe, nós podemos usar funções callback no JavaScript. No resto deste artigo nós vamos aprender tudo sobre funções callback. Funções callback são provavelmente a mais ampla técnica de programação funcional usada no JavaScript, e elas estão, literalmente, em cada pedaço de código JavaScript e jQuery, mesmo que elas ainda sejam um mistério para muitos desenvolvedores JavaScript. Você vai aprender como usá-las após ler este artigo.

**Funções Callback** são derivadas de um paradigma de programação chamado programação funcional. Em um estágio simples e fundamental, programação funcional é o de funções como argumentos. Programação funcional era, e continua sendo, porém em menor grau atualmente, vista como uma técnica esotérica de programadores mestres e especialmente treinados.

Felizmente, as técnicas da programação funcional foram elucidadas, de forma que meros mortais como eu e você consigamos entendê-las e usá-las com facilidade. Uma das técnicas chefe na programação funcional é a função callback. Como você vai ler em breve, implementar funcções callback é tão fácil quanto passar variáveis regulares como argumentos de funções. Esta técnica é tão fácil que eu me pergunto por que ela é normalmente abordada apenas em tópicos avançados do JavaScript.

## O que é um Callback ou Funções de Ordem Superior?

Uma função callback, também conhecida como função de ordem superior, é uma função que é passada para outra função (vamos chamar essa outra função de "otherFunction") como um parâmetro, e a função callback é chamada (executada) dentro de *otherFunction*. Uma função callback é essencialmente um padrão (uma solução estabelecida para um problema comum), e portanto, o uso de funções callback é também conhecido como um padrão callback.

Aqui um simples e comum uso de uma função callback no jQuery:

```javascript

// Note que o item no paramêtro do método click é uma função,
// não uma variável. Este item é uma função callback
$( "#btn_1" ).click(function () {
	alert( "Btn 1 Clicked" );
});

```

Como você pode ver no exemplo anterior, nós passamos uma função como um parâmetro ao método click. E o método click vai chamar (ou executar) a função callback que nós passamos a ele. Este é um uso típico de funções callback no JavaScript, e de fato, amplamente utilizado no jQuery.

Aqui outro exemplo clássico de funções callback em JavaScript básico:

```javascript

var friends = [ 'Mike', 'Stacy', 'Andy', 'Rick' ];

friends.forEach(function ( eachName, index ) {
	console.log( index + 1 + ". " + eachName );
	// 1. Mike, 2. Stacy, 3. Andy, 4. Rick
});

```

Novamente, note a maneira que nós passamos uma função anônima (uma função sem um nome) para o método `forEach()` como um parâmetro.

Até agora, nós passamos funções anônimas como parâmetros para outras funções ou métodos. Vamos entender agora como callbacks trabalham antes de olharmos para exemplos mais concretos e começar a fazer nossas próprias funções callback.

## Como Funções Callback Trabalham?

Pelo de funções serem objetos de primeira classe no JavaScript, nós podemos tratar as funções como objetos, podendo então passar funções como variáveis e retorná-las nas funções e as usar em outras funções. Quando nós passamos uma função callback como um argumento para outra função, estamos passando somente a definição da função. Não estamos executando a função no parâmetro. Nós não estamos passando a função com o par de parênteses de execução como fazemos quando executamos uma função.

E uma vez que uma função contenha um callback em seu parâmetro como uma definição de função, ela pode executar este callback a qualquer hora. Isso permite que executemos funções callback em qualquer ponto da função que as contém.

É importante notar que a função callback não é executada imediatamente. Ela "called back" (chama de volta, por isso o nome) em algum ponto específico do corpo da função que a contém. Por isso o nosso primeiro exemplo com jQuery ficou assim:

```javascript

// A função anônima não é executada no parâmetro
// O item é um função callback
$( "#btn_1" ).click(function () {
	alert( "Btn 1 Clicked" );
});

```

A função anônima vai ser chamada posteriormente dentro da função body. Mesmo sem um nome, ela pode ser acessada depois pelo objeto *arguments* pela função que a contém.

### Funções Callback são Closures

Quando nós passamos uma função callback como um argumento para outra função, o callback é executado em algum lugar dentro do corpo da função que a contém somente se o callback tiver sido definido nesta função. Isto significa que o callback é essencialmente um closure. Leia este post mais detalhado, [Entenda Closures no JavaScript com Facilidade](https://github.com/eoop/traduz-ai/blob/master/javascript/004-entenda-closures-no-javaScript-com-facilidade.md) para conhecer mais sobre Closures.

Como sabemos, closures tem acesso ao escopo da função que o contém, então a função callback pode acessar as variáveis da função que a contém, e até mesmo variáveis do escopo global.

## Princípios Básicos Quando Implementamos Funções Callback

Funções callback são simples, mas existem alguns príncipios básicos quando as implementamos e devemos estar familiarizados com eles antes de construirmos e usar nossas próprias funções callback.

### Use Funções Nomeadas OU Funções Anônimas como Callbacks

No exemplo anterior de jQuery e no exemplo acima "forEach" de funções callback, nós usamos funções anônimas que foram definidas no parâmetro da função que as contém. Este é um padrão comum de uso de funções callback. Outro padrão popular de uso das funções callback é o de declarar uma função nomeada e passar o nome deta função como o parâmetro. Então:

```javascript

// variável global
var allUserData = [];

// função genérica logStuff que imprimi no console
function logStuff ( userData ) {
	if ( typeof userData === "string" ) {
		console.log( userData );
	} else if ( typeof userData === "object" ) {
		for ( var item in userData ) {
			console.log( item + ": " + userData[ item ] );
		}
	}
}

// Uma função que pega 2 parâmetros, o último uma função callback
function getInput ( options, callback ) {
	allUserData.push( options );
	callback( options );
}

// Quando nós chamamos a função getInput, nós passamos
// logStuff como um parâmetro. Então logStuff vai ser 
// a função que será chamada de volta (ou executada)
// dentro da função getInput
getInput( { name: "Rich", speciality: "JavaScript" }, logStuff );
// name: Rich
// speciality: JavaScript

```

### Passando Parâmetros para Funções Callback

