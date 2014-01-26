# Protótipos Javascript em uma Linguagem Simples

#### Artigo traduzido. Postado originalmente em [JavaScript.is(Sexy)](http://javascriptissexy.com/javascript-prototype-in-plain-detailed-language/) em 25/01/2013

**Protótipo** é um conceito fundamental que todo desenvolvedor JavaScript deve entender, e este post tem o objetivo de explicar o `prototype` JavaScript em uma linguagem simples e detalhada. Se você não entender o `prototype` JavaScript depois de ler este post, por favor coloque suas dúvidas nos comentários abaixo, eu vou pessoalmente responder todas as questões.

Para entender o `prototype` em JavaScript você deve entender os objetos JavaScript. Se você não está familiar com os objetos, você deve ler meu post [Objetos JavaScript em detalhe](https://github.com/eoop/traduz-ai/blob/master/javascript/002-objetos-js-em-detalhe.md#objetos-javascript-em-detalhe). Igualmente, saber que uma *propriedade* é uma simples variável definida dentro de uma função.

Existem dois conceitos inter-relacionados com `prototype` no JavaScript:

**01** . Primeiro, existe uma **propriedade `prototype`** em toda função JavaScript (ela é vazia por padrão), e você anexa propriedades e métodos a essa propriedade `prototype` quando você quer implementar herança. Note que esta propriedade `prototype` não é enumerável: ela não está acessível em um loop for/in. Mas o Firefox, e a maioria das versões do Safari e Chrome, tem uma "pseudo" propriedade `__proto__` (de forma alternativa) que lhe permite acessar uma propriedade `prototype` de um objeto. Você provavelmente nunca vai usar esta pseudo propriedade `__proto__`, mas sabe que ela existe e é simplesmente uma forma de acessar uma propriedade `prototype` de um objeto em alguns navegadores.

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

**02** . O segundo conceito com `prototype` no JavaScript é o **atributo `prototype`**. Pense no atributo `prototype` como uma característica do objeto; esta característica nos informa o objeto "pai". Em simples palavras: um atributo `prototype` de um objeto aponta para o objeto "pai" - o objeto do qual foram herdadas as propriedades. O atributo `prototype` é normalmente referenciado como *objeto prototype*, e ele é configurado automaticamente quando você cria um novo objeto. Esclarecendo sobre isso: todo objeto herda propriedades de algum outro objeto, e este outro objeto é a propriedade prototype ou "pai". (Você pode pensar sobre o **atributo prototype** como uma linhagem ou o "pai"). No código acima, o `prototype` de `newObj` é `PrintStuff.prototype`

Nota: Todos os objetos têm atributos como propriedades de objetos têm atributos. E os atributos do objeto são: `prototype`, `class` e `extensible`. É este atributo `prototype` que vamos discutir neste segundo exemplo.

Note também que a "pseudo" propriedade `__proto__` contém um objeto prototype (o objeto pai que ela herda seus métodos e propriedades).

## Uma nota importante

**Construtor**

Antes de continuarmos, vamos rapidamente examinar o construtor. Um **construtor** é uma função usada para inicializar novos objetos, e você usa a palavra `new` para chamar o construtor.

Por exemplo:

```javascript

function Account () {
	
}

// Este é o uso do construtor Account para criar
// um objeto userAccount
var userAccount = new Account();

```

Além disso, todos objetos que herdam de outro objeto também herdam uma propriedade `constructor`. E esta propriedade `constructor` é simplismente uma propriedade (como qualquer variável) que detém nossa indicação ao construtor do objeto.

```javascript

// O construtor neste exemplo é Object()
var myObj = new Object();

// e se depois você quiser encontrar o construtor de myObj
console.log(myObj.constructor); // Object()

// Outro exemplo: Account() é o construtor
var userAccount = new Account();

// Encontra o construtor do objeto userAccount
console.log(userAccount.constructor); // Account()

```

## Atributo prototype de Objetos Criados com new Object() ou Objetos Literais

Todos os objetos criados com objetos literais e com o construtor `Object` herdam de `Object.prototype`. Portanto, `Object.prototype` é o atributo `prototype` (ou o objeto prototype) de todos objetos criados com `new Object` ou com `{}`. `Object.prototype` não herda nenhum método ou propriedade de outro objeto.

```javascript

// O objeto userAccount herda de Object e, como tal,
// seu atributo prototype é Object.prototype
var userAccount = new Object();

// Este exemplo demonstra o uso de um objeto literal para criar o objeto userAccount;
// O objeto userAccount herda de Object; entretanto, seu atributo prototype é
// o Object.prototype como o objeto userAccount acima.
var userAccount = { name: "Mike" };

```

**Atributo Prototype de Objetos Criados com uma Função Construtora**

Objetos criados com a palavra-chave `new` e qualquer outro construtor além do construtor `Object()`, pegam seu prototype da função construtora.

Por exemplo:

```javascript

function Account () {
	
}

var userAccount = new Account()
// userAccount inicializa com o construtor Account()
// e portanto seu atributo prototype (ou objeto prototype)
// é Account.prototype

```

Similarmente, qualquer array como `var myArray = new Array()`, pege seu prototype de `Array.prototype` e ele herda as propriedades de `Array.prototype`.

Então, temos duas formas gerais que um atributo prototype de um objeto é configurado quando um objeto é criado:

**1** . Se um objeto é criado com um objeto literal (`var newObj = {}`), ele herda as propriedades do `Object.prototype` e nós dizemos que seu objeto prototype (ou atributo prototype) é `Object.prototype`.

**2** . Se um objeto é criado a partir de uma função construtora como `new Object()`, `new Fruit()` ou `new QualquerCoisa()`, ele herda do construtor `Object()`, `Fruit()`, `QualquerCoisa()`. Por exemplo, com uma função como `Fruit()`, cada vez que criarmos uma nova instância de Fruit (`var aFruit = new Fruit()`), o novo prototype da instância será atribuído ao prototype vindo do construtor Fruit, que é `Fruit.prototype`. Qualquer objeto que for criado com `new Array()` vai ter `Array.prototype` como seu prototype. Qualquer objeto criado com o construtor Object (`como var anObj = new Object()`) herda de `Object.prototype`.

É importante conhecer que na ECMAScript 5, você pode criar objetos com um método `Object.create()` que permite que você configure novos `object.prototype` para os objetos. Nós vamos cobrir sobre ECMAScript em outro post.

## Por que Prototype é Importante e Quando ele é Usado?

Estas são duas importantes maneiras em que o `prototype` é usado no JavaScript, como vimos acima:

**1** . **Propriedade Prototype: Herança baseada em protótipos**
