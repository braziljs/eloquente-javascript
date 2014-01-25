# Protótipos Javascript em uma Linguagem Simples

#### Artigo traduzido. Postado originalmente em [JavaScript.is(Sexy)](http://javascriptissexy.com/javascript-prototype-in-plain-detailed-language/) em 25/01/2013

**Protótipo** é um conceito fundamental que todo desenvolvedor JavaScript deve entender, e este post tem o objetivo de explicar o `prototype` JavaScript em uma linguagem simples e detalhada. Se você não entender o `prototype` JavaScript depois de ler este post, por favor coloque suas dúvidas nos comentários abaixo, eu vou pessoalmente responder todas as questões.

Para entender o `prototype` em JavaScript você deve entender os objetos JavaScript. Se você não está familiar com os objetos, você deve ler meu post [Objetos JavaScript em detalhe](https://github.com/eoop/traduz-ai/blob/master/javascript/002-objetos-js-em-detalhe.md#objetos-javascript-em-detalhe). Igualmente, saber que uma *propriedade* é uma simples variável definida dentro de uma função.

Existem dois conceitos inter-relacionados com `prototype` no JavaScript:

**01** . Primeiro, existe uma **propriedade `prototype`** em toda função JavaScript (ela é vazia por padrão), e você anexa propriedades e métodos a essa propriedade `prototype` quando você quer implementar herança. Note que esta propriedade `prototype` não é enumerável: ela não está acessível em um loop for/in. Mas o Firefox, e a maioria das versões do Safari e Chrome, tem uma "pseudo" propriedade `_proto_` (de forma alternativa) que lhe permite acessar uma propriedade `prototype` de um objeto. Você provavelmente nunca vai usar esta pseudo propriedade `_proto_`, mas sabe que ela existe e é simplesmente uma forma de acessar uma propriedade `prototype` de um objeto em alguns navegadores.

A propriedade `prototype` é usada primariamente para herança: você adiciona métodos e propriedades dentro de uma propriedade `prototype` de uma função para tornar estes métodos e propriedades disponíveis para instâncias desta função.

Aqui temos um exemplo simples de herança com a propriedade `prototype` (mais sobre herança depois):

```javascript

function PrintStuff (myDocuments) {
	this.documents = myDocuments;
}

// Nós adicionamos o método print() para a propriedade prototype de PrintStuff
// então outras instâncias (objetos) podem herdá-la
PrintStuff.prototype.print = function () {
	console.log(this.documents);
};

// Cria um novo objeto com o construtor PrintStuff(), então permitindo
// que este novo objeto de herde métodos e propriedades de PrintStuff
var newObj = new PrintStuff("Eu sou um novo Objeto e eu posso imprimir.");

// newObj herda todas as propriedades e métodos, incluindo o método print,
// da função PrintStuff. Agora newObj pode chamar print diretamente, mesmo
// nunca tendo criado um método print() nele.
newObj.print(); // Eu sou um novo Objeto e eu posso imprimir.

```