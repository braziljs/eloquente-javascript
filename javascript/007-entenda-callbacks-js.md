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

Sendo a função callback uma função normal quando é executada, nós podemos passar parâmetros para ela. Nós podemos passar qualquer propriedade da função que a contém (ou propriedades globais) como parâmetros para as funções callback. No exemplo seguinte, vamos passar *options* como um parâmetro  para a função callback. Vamos passar uma variável e uma variável local:

```javascript

// Variável global
var generalLastName = "Clinton";

function getInput ( options, callback ) {
	allUserData.push( options );

	// Passando a variável global generalLastName 
	// para a função callback
	callback( generalLastName, options );
}

```

### Assegure-se que o Callback é uma Função Antes de Executá-lo

Sempre é prudente verificar se a função callback passada no parâmetro é de fato uma função, antes de chamá-la. Tmabém é uma boa prática criar uma função callback opcional.

Vamos refatorar a função `getInput` do exemplo anterior para assegurarmos que estas verificações estão sendo feitas.

```javascript

function getInput ( options, callback ) {
	allUserData.push( options );

	// Verificando que a função é um callback
	if ( typeof callback === "function" ) {
		// Chame-a, desde que seja confirmado que é uma função
		callback( options );
	}
}

```

Sem essa verificação, se a função `getInput` for chamada sem a função callback como um parâmetro ou ao invés da função uma *não função* for passada, nosso código vai resultar em um erro de execução.

### Problema Quando Usado Método com o Objeto `this` como Callback

Quando a função callback é um método que usa o objeto `this`, nós temos que modificar como nós executamos a função callback para preservar o contexto do objeto `this`. Ou então, o objeto `this` vai apontar para o objeto global `window`, se o callback for passado como uma função global. Ou também pode apontar para o objeto do método que o contém.

Vamos explorar isso no código:

```javascript

// Define um objeto com algumas propriedades e um método
// Vamos depois passar o método como uma função callback para outra função
var clientData = {
	id: 094545,
	fullName: "Not Set",
	// setUserName é um método do objeto clientData
	setUserName: function ( firstName, lastName ) {
		// isto se ferete a propriedade fullName do objeto clientData
		this.fullName = firstName + " " + lastName;
	}
}

function getUserInput ( firstName, lastName, callback ) {
	// Faz outras coisas para validar firstName/lastName aqui

	// Agora salvando os nomes
	callback( firstName, lastName );
}

```

No código seguinte, quando `clientData.setUserName` é executado, `this.fullName` não vai configurar a propriedade `fullName` no objeto `clientData`. Ao invés disso, irá configurar `fullName` no objeto `window`, sendo getUserInput uma função global. Isto acontece porque o objeto `this` na função global aponta para o objeto `window`.

```javascript

getUserInput( "Barack", "Obama", clientData.setUserName );

console.log( clientData.fullName ); // Not set

// A propriedade fullName foi inicializada no objeto window
console.log( window.fullName ); // Barack Obama

```

Use a Função `call` ou `apply` para Preservar o `this`

Nós podemos consertar este problema anterior usando as funções `call` ou `apply` (nós vamos discutir sobre isto em um post completo posteriormente). Por agora, saiba que toda função no JavaScript tem dois métodos: `call` e `apply`. E estes métodos são usados para configurar o objeto `this` dentro da função e passar argumentos as funções.

`call` pega o valor a ser usado como o objeto `this` dentro da função como o primeiro parâmetro, e os argumentos remanescentes a serem passados para a função são passados individualmente (separados por vírgulas, é claro). O primeiro parâmetro da função `apply` é também o valor a ser usado como o objeto `this` dentro da função, enquanto o último parâmetro é um array de valores (ou o objeto *arguments*) para se passar para a função.

Isto soa complexo, mas vamos ver o quão fácil é de se usar `call` e `apply`. Para eliminar o prolbmea do exemplo prévio, vamos usar a função apply:

```javascript

// Note que nós adicionamos um parâmetro extra para
// o objeto callback, chamado "callbackObj"
function getUserInput ( firstName, lastName, callback, callbackObj ) {
	// Faz outras coisas para validar o nome aqui

	// O uso da função apply abaixo vai configurar
	// o objeto this para ser callbackObj
	callback.apply( callbackObj, [firstName, lastName] );
}

```

Com a função  `apply` configurada corretamente para o objeto `this`, nós podemos agora executar corretamente o callback e ter a propriedade `fullName` corretamente atualizada no objeto clientData:

```javascript

// Nós passamos o método clientData.setUserName e o objeto
// clientData como parâmetros. O objeto clientData vai ser
// usado pela função apply para configurar o objeto this
getUserInput( "Barack", "Obama", clientData.setUserName, clientData );

// a propriedade fullName em clientData foi corretamente configurada
console.log( clientData.fullName ); // Barack Obama

```

Nós também poderíamos ter usado a função `call`, mas neste caso a função apply que foi a escolhida.

### Chamadas a Múltiplas Funções Callback

Nós podemos passar mais que uma função callback dentro do parâmetro de uma função, da mesma forma que podemos passar mais que uma variável. Aqui temos um exemplo clássico com a função AJAX do jQuery:

```js

function successCallback () {
	// Faz algo antes de enviar
}

function successCallback () {
	// Faz algo se receber uma mensagem de sucesso
}

function completeCallback () {
	// Faz algo após a conclusão
}

function errorCallback () {
	// Faz algo se receber um erro
}

$.ajax({
	url      : "http://fiddle.jshell.net/favicon.png",
	success  : successCallback,
	complete : completeCallback,
	error    : errorCallback
});

```

## "Callback Hell" (Inferno de Callback): Problema e Solução

Na execução de código assíncrono, que é uma simples execução de código em qualquer ordem, algumas vezes é comum termos várias camadas de funções callback assim como o código seguinte. O código confuso abaixo é chamado de *callback hell* por causa da dificuldade de seguirmos o código pelos múltiplos callbacks. Eu peguei este exemplo do node-mongodb-native, um controlador de MongoDB para Node.js. **O exemplo deste código abaixo é somente para demonstração:**

```js

var p_client = new Db('integration_tests_20', new Server("127.0.0.1", 27017, {}), {'pk':CustomPKFactory});
p_client.open(function(err, p_client) {
    p_client.dropDatabase(function(err, done) {
        p_client.createCollection('test_custom_key', function(err, collection) {
            collection.insert({'a':1}, function(err, docs) {
                collection.find({'_id':new ObjectID("aaaaaaaaaaaa")}, function(err, cursor) {
                    cursor.toArray(function(err, items) {
                        test.assertEquals(1, items.length);

                        // Vamos fechar o db =P
                        p_client.close();
                    });
                });
            });
        });
    });
});

```

Você não gostaria de encontrar este problema frequentemente em seu código, mas quando você encontrar - e você vai, algumas vezes - aqui temos duas soluções para este problema.

**1** . Nomeie suas funções e declare-as passando somente o nome da função como um callback, ao invés de definir uma função anônima no parâmetro da função principal.

**2** . Modularidade: Separe seu código em módulos, assim você pode exportar uma seção do código que faz um trabalho em particular. Então você poderá importar o módulo dentro de toda sua aplicação.

## Construindo Suas Próprias Funções Callback

Agora que você entendeu completamente (eu penso que sim, se não isto é uma pequena releitura) tudo sobre **funções callback** no JavaScript e viu que o uso de funções callback é simples porém muito poderoso, você deve olhar para seu próprio código para verificar oportunidades de usar as funções callback, pois elas vão permitir que você:

* Não repita código (DRY - Don't Repeat Yourself - Não se repita)
* Implemente melhores abstrações onde você pode ter funções mais genéricas que são versáteis (podem lidar com todos os tipos de funcionalidades)
* Tenha uma melhor mantenabilidade
* Tenha um código mais legível
* Tenha mais funções especializadas

É bastante fácil criar nossas próprias funções callback. No exemplo seguinte, você pode criar uma função para fazer todo o trabalho: recupera o dado do usuário, cria um poema genérico com o dado e comprimenta o usuário. Isto seria uma função confusa usando declarações if/else e, mesmo assim, seria muito limitada e incapaz de realizar outras funcionalidades que o aplicativo pode precisar fazer com os dados do usuário.

