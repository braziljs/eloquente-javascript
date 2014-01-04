# Objetos JavaScript em Detalhe
### Artigo traduzido. Postado originalmente em JavaScript.is(Sexy) http://javascriptissexy.com/javascript-objects-in-detail/ - 27/01/2013

O núcleo mais utilizado e mais básico do JavaScript é o Object. O JavaScript tem um tipo complexo de dado, o tipo Object, e tem cinco tipos de dados simples: Number, String, Boolean, Undefined e Null. Note que estes tipos simples (primitivos) de dados são imutáveis, eles não podem ser alterados, enquanto os objetos podem.

### **O que é um Objeto**
Um objeto é uma lista não ordenada de tipos primitivos de dados (e as vezes uma referência a outros tipos de dados) que são armazenados em pares nome-valor. Cada item na lista é chamado 'propriedade' (funcções são chamadas de 'métodos') e cada nome de propriedade deve ser único e pode ser uma string ou um número.

Aqui um simples objeto:

```javascript
var meuPrimeiroObjeto = { 
	primeiroNome: "Richard",
	autorFavorito: "Conrad" 
}; 
```

Reiterando: Pense que um objeto é uma lista que contém itens e que cada item (uma propriedade) na lista é armazenada por um par nome-valor. Os nomes das propriedades no exemplo acima são primeiroNome e autorFavorito, e os valores para cada um "Richard" e "Conrad".

O nome das propriedades podem ser uma string ou um número, mas se for um número, ele deve ser acessado com o uso de colchetes. Veja no exemplo abaixo sobre esta notação, onde temos outro exemplo de objetos com números sendo o nome da propriedade.

```javascript
var grupoDeIdade = { 30: "criança", 100: "muito velho"};

console.log(grupoDeIdade.30) // Isso vai lançar um erro

// Assim é como você vai acessar o valor da propriedade 30, para que retorne o valor "criança"
console.log(grupoDeIdade["30"]); //criança 

// É melhor evitar usar números como nomes de propriedades.
```

Como um desenvolvedor JavaScript você frequentemente irá usar os tipos de dados Object, na maioria das vezes para armazenar dados e para criar seus próprios métodos e funções.


### **Tipos de Dados por Referência e Tipos Primitivos de Dados**
Uma das principais diferenças entre os tipos de dados por referência e os tipos primitivos de dados é que os os dados por referência não são armazenados diretamente na variável como um valor primitivo é. Por exemplo:

```javascript
// O tipo primitivo de dado é armazenado como um valor
var pessoa = "Kobe";
var outraPessoa = pessoa; //outraPessoa = valor de pessoa
pessoa = "Bryant"; // valor de pessoa agora mudado

console.log(outraPessoa); // Kobe
console.log(pessoa); // Bryant
```

É interessante notarmos que mesmo que pessoa agora tenha como valor "Bryant", a variável outraPessoa continua retendo o antigo valor que pessoa tinha.

Compare o dado primitivo salvo-como-valor demonstrado acima, com o salvo-como-referência por objetos:

```javascript
var pessoa = {name: "Kobe"};
var outraPessoa = pessoa;
pessoa.name = "Bryant";

console.log(outraPessoa.name);	// Bryant
console.log(pessoa.name); 			// Bryant
```

Neste exemplo, nós copiamos o objeto pessoa para outraPessoa, mas por causa do valor em pessoa estar armazenado como uma referência e não como um valor atual, quando nós mudamos a propriedade pessoa.name para "Bryant" a variável outraPessoa refletiu a mudança pois nunca armazenou o uma cópia do valor atual das propriedades de pessoa, somente uma referência.


### **Propriedades de Dados têm atributos**
Cada propriedade dos dados (propriedades dos objetos que armazenam dados) não tem somente os pares nome-valor, mas também 3 atributos (os 3 atributos são definidos como true por padrão):

- **Atributo configurável**: especifica se a propriedade pode ser deletada ou mudada.
- **Enumerável**: especifica se a propriedade pode ser retornada em um loop for/in. 
- **Editável**: especifica se a propriedade pode ser alterada.


### **Criando Objetos**
Estes são os dois meios comuns de se criar objetos:

### 1. **Objetos Literais**
O mais comum e, de fato, mais fácil modo de criar objetos é através dos objetos literais como descrito aqui:

```javascript
// Este é um objeto vazio inicializado usando a notação de objeto literal
var meusLivros = {};

// Este é um objeto com 4 itens, novamente usando a forma de objeto literal
var manga = {
	cor: "amarelo",
	forma: "redonda",
	doce: 8,
	quantoDoceEuSou: function () {
		console.log("Hmm Hmm Bom!");
	}
};
```

### 2. **Objeto Construtor**
O segundo meio mais comum de criar objetos é com o construtor "Object". Um construtor é uma função usada para inicializar novos objetos, e você usa a palavra-chave `new` para chamar o construtor.

```javascript
var manga = new Object();
manga.cor = "amarelo";
manga.forma = "redonda";
manga.doce = 8;
manga.quantoDoceEuSou = function () {
	console.log("Hmm Hmm Bom!");
}
```

Mesmo você podendo usar algumas palavras reservadas como `for` para nomear propriedades em seus objetos, é totalmente aconselhável que você **NÃO** faça isso.

Objetos podem conter qualquer outro tipo de dados, incluindo Numbers, Arrays e também outros objetos.


### **Padrões Práticos para Criação de Objetos**
Para simples objetos que podem ser usados somente uma vez na sua aplicação para guardar dados, os dois métodos apresentados acima podem ser suficientes para a criação de objetos.

Imagine que você tenha uma aplicação que mostre frutas e os detalhes sobre cada uma delas. Todas as frutas na sua aplicação tem estas propriedades: cor, forma, doçura, custo e uma função mostrarNome. Isso seria muito tedioso e improdutivo de escrever todo o tempo que você quisesse criar um novo objeto fruta.

```javascript
var frutaManga = {
	cor: "amarelo",
	doce: 8,
	nomeFruta: "Manga",
	nativaDe: ["America do Sul", "America Central"],

	mostrarNome: function () {
		console.log("Esta é " + this.nomeFruta);
	},
	nativeTo: function () {
		this.nativaDe.forEach(function (cadaPais) {
			console.log("Nasce em:" + cadaPais);
		});
	}
}
```

Se você tiver 10 frutas, você vai ter que adicionar o mesmo código 10 vezes. E o que acontece se você tiver que mudar o código da função nativaDe? Você terá que fazer a alteração em 10 locais diferentes. Agora extrapolando isto para a adição de objetos para membros de um website rapidamente você percebe que a maneira que nós criamos os objetos de longe não é a ideal para se criar instâncias, especialmente quando estamos desenvolvendo grandes aplicações.

Para resolver este problema de repetição, os engenheiros de software inventaram padrões (soluções para problemas repetitivos e comuns) para o desenvolvimento de aplicações mais eficientes e simplificadas.

Aqui temos 2 padrões comuns para criação de objetos. Se você terminou o curso "Como Aprender JavaScript Corretamente", você viu nas lições em Codecademy que utilizavam este primeiro padrão frequentemente:


### 1. **Padrão Construtor para Criação de Objetos**

```javascript
function Fruta (aCor, aDocura, oNomeDaFruta, aTerraNativa) {
	this.cor = aCor;
	this.docura = aDocura;
	this.nomeFruta = oNomeDaFruta;
	this.terraNativa = aTerraNativa;

	this.mostrarNome = function () {
		console.log("Isso é um(a) " + this.nomeFruta);
	}

	this.nativaDe = function () {
		this.terraNativa.forEach(function (cadaPais) {
			console.log("Originária de: " + cadaPais);
		});
	}
} 
```

Com este padrão, é muito fácil de criar vários tipos de frutas. Assim:

```javascript
var frutaManga = new Fruta ("Amarela", 8, "Manga", ["América do Sul","América Central","Oeste da África"]);
frutaManga.mostrarNome();	// Isso é um(a) Manga
frutaManga.nativaDe();	

// Originária de: América do Sul
// Originária de: América Central
// Originária de: Oeste da África

var frutaAbacaxi = new Fruta ("Marrom", 5, "Abacaxi", ["Estados Unidos"]);
frutaAbacaxi.mostrarNome();		//Isso é um(a) Abacaxi
```

Se você tiver que alterar a função mostrarNome, você somente precisa fazer isso em um local. O padrão encapsula todas as funcionalidades e características das frutas apenas fazendo uma simples função Fruta com herança.

Notas: 
- Uma propriedade herdada é definida na propriedade *prototype* do objeto. Por exemplo: `algumObjeto.prototype.primeiroNome = "John";`


- Uma propriedade própria é definida diretamente no objeto, por exemplo:

```javascript

// Vamos criar um objeto primeiro
var umaManga = new Fruta();

// Agora nós vamos definir a propriedade mangaSabor 
// diretamente no objeto umaManga, sendo essa uma 
// propriedade particular de umaManga, não uma propriedade herdada.

umaManga.mangaSabor = "algum valor";
```

- Para acessar uma propriedade de um objeto, nós podemos usar meuObjeto.nomePropriedade, por exemplo:

```javascript
console.log(umaManga.mangaSabor);	// "algum valor"
```


- Para invocar um método de um objeto, nós usamos meuObjeto.nomeDoMetodo(), por exemplo:

```javascript
// Primeiro vamos adicionar um método
umaManga.imprimiCoisas = function () { return "Imprimindo"; }

// Agora vamos invocar o método imprimiCoisas
umaManga.imprimiCoisas();
```


### 2. **Padrão Prototípico para Criação de Objetos**

Antes de discutirmos sobre o Padrão Prototípico, você entender sobre protótipos no JavaScript. Se você não conhece, leia este post [JavaScript Prototype in Plain, Detailed Language] (http://javascriptissexy.com/javascript-prototype-in-plain-detailed-language/)

```javascript
function Fruta () {

}

Fruta.prototype.cor = "Amarelo";
Fruta.prototype.docura = 7;
Fruta.prototype.nomeDaFruta = "Fruta Genérica";
Fruta.prototype.terraNativa = "USA";

Fruta.prototype.mostrarNome = function () {
	console.log("Isso é um(a): " + this.nomeDaFruta);
}

Fruta.prototype.nativaDe = function () {
	console.log("Originária de: " + this.terraNativa);
}
```

E assim é como nós chamamos o construtor Fruta() neste padrão prototípico:

```javascript
var frutaManga = new Fruta();

frutaManga.mostrarNome();   // "Fruta Genérica"
frutaManga.nativaDe();		// "Originária de: USA"
```

### Leituras Adicionais

Para uma completa discussão sobre estes dois padrões e uma explicação minunciosa de como cada um funciona e as desvantagens de cada um, leia o capítulo 6 de *Professional JavaScript for Web Developers*. Você também irá aprender qual padrão Zakas recomenda como o melhor para se usar. (Dica: não é nenhum dos dois acima).


### **Como Acessar Propriedades em um Objeto**
Os dois caminhos primários para acessar as propriedades de um objeto são com a notação com ponto e com a notação com colchete.

#### 1. **Notação com Ponto**

```javascript
// Nós temos usado muito a notação com ponto nos exemplos acima, aqui temos outro exemplo novamente:

var livro = {titulo: "Caminhos para Ir", paginas: 280, marcador1: "Pagina 20"};

// Para acessas as propriedades do objeto livro com notação com ponto, você deve fazer isso:
console.log(livro.titulo);	// Caminhos para Ir
console.log(livro.paginas);	// 280
``` 

#### 2. **Notação com Colchete**

```javascript
// Para acessar as propriedades do objeto livro com a notação com colchetes, você deve fazer isso:
console.log(livro["titulo"]);	// Caminhos para Ir
console.log(livro["paginas"]);	// 280

// Ou, no caso de você ter o nome da propriedade em uma variável
var tituloDoLivro = "titulo";
console.log(livro[tituloDoLivro]);	// Caminhos para Ir
console.log(livro["marcador" + 1]);	// Pagina 20
``` 

Caso você acesse uma propriedade de um objeto que não exista o resultado retornado será *undefined*.


### Propriedades Próprias e Herdadas

Objetos tem propriedades herdadas e propriedades próprias. As próprias foram definidas no próprio objeto, enquanto as propriedades herdadas foram herdadas do objeto protótipo do construtor (outro objeto).

Para saber se uma propriedade existe em um objeto (ou como herança ou como própria), você usa o operador *in*:

```javascript
// Crie um novo objeto escola com a propriedade nomeEscola
var escola = { nomeEscola: "MIT" }; 

// Imprimi true porque nomeEscola é uma propriedade própria do objeto escola
console.log("nomeEscola" in escola);	// true

// Imprimi false porque nós não definimos a propriedade tipoEscola no objeto escola, e nem adicionamos esta propriedade ao objeto protótipo Object.prototype
console.log("tipoEscola" in escola);	// false

// Imprimi true porque o objeto escola herda o método toString de Object.prototype
console.log("toString" in escola);	// true
```

### hasOwnProperty

Para saber se um objeto possui uma propriedade em específico como propriedade própria, você pode usar o método *hasOwnProperty*. Este método é muito útil pois de tempos em tempos você precisa enumerar um objeto e você quer somente as propriedades próprias, e não as herdadas.

```javascript
// Crie um novo objeto escola com a propriedade nomeEscola
var escola = { nomeEscola: "MIT" };

// Imprimi true porque nomeEscola é um método próprio do objeto escola
console.log(escola.hasOwnProperty("nomeEscola"));	// true

// Imprimi false porque o objeto escola herda o método toString de 
// Object.prototype, portanto toString não é uma propriedade própria do objeto escola
console.log(escola.hasOwnProperty("toString"));
```

### Acessando e Enumerando Propriedades nos Objetos

Para acessar propriedades enumeráveis (próprias e herdadas) nos objetos, você deve usar o loop for/in ou um loop for geral.

```javascript
// Crie um novo objeto escola com 3 propriedades: nomeEscola, aprovadoEscola e localEscola
var escola = { nomeEscola: "MIT", aprovadoEscola: true, localEscola: "Massachusetts" };

// Use do loop for/in para acessar as propriedades no objeto escola
for (var cadaItem in escola) {
	console.log(cadaItem);	// Imprimi nomeEscola, aprovadoEscola, localEscola
}
```

### Acessando Propriedades Herdadas

Propriedades herdadas de *Object.prototype* não são enumeráveis, então o loop for/in não as mostra. Entretanto, propriedades herdadas que são enumeráveis são reveladas na iteração do loop for/in. Por exemplo:

```javascript
// Use o loop for/in para acessar as propriedades no objeto escola
for (var cadaItem in escola) {
	console.log(cadaItem);	// Imprimi nomeEscola, aprovadoEscola, localEscola
}

// Crie uma nova função EnsinoSuperior em que o objeto escola irá herdar dela

/*	NOTA: Como Wilson (um leitor atento) corretamente apontou no seu comentário, a propriedade nivelEnsino não é exatamente herdada pelos objetos que usam o construtor EnsinoSuperior; ao invez disso, a propriedade nivelEnsino é criada como uma nova propriedade em cada objeto que usar o construtor EnsinoSuperior. A razão para que a propriedade não fora herdada é que nós usamos a palavra chave "this" para definir a propriedade
*/

function EnsinoSuperior () {
	this.nivelEnsino = "Universidade";
}

// Implemente a herança com o construtor EnsinoSuperior
var escola = new EnsinoSuperior();
escola.nomeEscola = "MIT"; 
escola.aprovadoEscola = true;
escola.localEscola = "Massachusetts";


// Use o loop for/in para acessar as propriedas do objeto escola
for (var cadaItem in escola) {
	console.log(cadaItem);	// Imprimi nivelEnsino, nomeEscola, aprovadoEscola e localEscola
}
```

No último exemplo, note que a propriedade nivelEnsino que definimos na função EnsinoSuperior é listada nas propriedades do objeto escola, mesmo nivelEnsino sendo uma propriedade herdada.


### Atributo Prototype dos Objetos e Propriedade Prototype

O atributo prototype e a propriedade prototype de um objeto são conceitos criticamente importantes de se entender no JavaScript. Leia meu post [JavaScript Prototype in Plain, Detailed Language](http://javascriptissexy.com/javascript-prototype-in-plain-detailed-language/), para mais informações.


### Deletando Propriedades de um Objeto

Para deletar uma propriedade de um objeto, usamos o operador *delete*. Você não pode deletar propriedades que são herdadas, nem propriedades cujo os atributos estão definidos para configuração. Você deve deletar as propriedades herdadas no objeto protótipo (onde as propriedades foram definidas). Você também não pode deletar propriedades do objeto global, as quais foram declaradas sem a palavra-chave var.

O operador delete retorna true se a remoção acontecer com sucesso, e, surpreendentemente, ele também retorna true se a propriedade a ser deletada não existe ou se a propriedade não pode ser deletada.

Estes exemplos ilustram isso:

```javascript
var listaNatal = { mike: "Livro", jason: "blusa" }
delete listaNatal.mike;		// deletou a propriedade mike

for (var pessoas in listaNatal) {
	console.log(pessoas);
}

// Imprimi somente jason
// A propriedade mike foi deletada

delete listaNatal.toString;		// retorna true, mas toString não foi deletado pois é um método herdado

// Aqui nós chamamos o método toString e ele funciona muito bem - não foi deletado
listaNatal.toString();		// "[object Object]"

// Você pode deletar uma propriedade de uma instância se a propriedade é uma propriedade própria dela. Por exemplo, nós podemos deletar a propriedade nivelEnsino do objeto escola que criamos acima, pois a nivelEnsino é definido nesta instância. Nós usamos a palavra-chave "this" para definir a propriedade quando nós declaramos a função EnsinoSuperior. Nós não definimos a propriedade nivelEnsino no protótipo da função EnsinoSuperior

console.log(escola.hasOwnProperty("nivelEnsino"));	// true

// nivelEnsino é uma propriedade própria de escola, então nós podemos deletá-la
delete escola.nivelEnsino;		// true

// A propriedade nivelEnsino foi deletada da instância escola
console.log(escola.nivelEnsino);	// undefined

// Mas a propriedade nivelEnsino ainda continua na função EnsinoSuperior
var novaEscola = new EnsinoSuperior ();
console.log(novaEscola.nivelEnsino);	//Universidade

// Se nós definirmos uma propriedade no protótipo da função EnsinoSuperior, como esta propriedade nivelEnsino2:
EnsinoSuperior.prototype.nivelEnsino2 = "Universidade 2";

// Então a propriedade nivelEnsino2 nas instâncias de EnsinoSuperior não serão propriedades próprias

// A propriedade nivelEnsino2 não é uma propriedade própria da instância escola
console.log(escola.hasOwnProperty("nivelEnsino2"));		//false
console.log(escola.nivelEnsino2);	// Universidade 2

// Vamos tentar deletar a propriedade herdada nivelEnsino2
delete escola.nivelEnsino2;		// true	(sempre retorna true, como falado anteriormente)

// A propriedade herdada nivelEnsino2 não foi deletada
console.log(escola.nivelEnsino2);	// Universidade 2
```


### Serializar e Desserializar Objetos

Para transferir seus objetos via HTTP ou convertê-los para uma string, você precisa de serializá-los (converter para string); você pode usar a função JSON.stringify para serializar seus objetos. Note que quando usado antes da ECMAScript 5, você deve usar a popular biblioteca json2 (de Douglas Crockford) para obter a função JSON.stringify. Ela é padronizada/nativa na ECMAScript 5.	

Para desserializar seu objeto (convertê-lo para um objeto a partir de uma string), você deve usar a função JSON.parse da mesma biblioteca json2. Esta função também é nativa na ECMAScript 5.

Exemplos de JSON.stringify:

```javascript
var listaNatal = { mike:"Livro", jason:"blusa", chelsea:"iPad" }
JSON.stringify (listaNatal);
// Imprimi esta string
// "{"mike":"Livro","jason":"blusa","chels":"iPad"}"  

// Para imprimir o objeto com formatação, adicione "null" e "4" como parâmetros
/* 
"{
    "mike": "Livro",
    "jason": "blusa",
    "chelsea": "iPad"
}"
*/

/* Exemplos JSON.parse */

// A seguir temos uma string JSON, então não podemos acessar suas propriedades com a notação de pontos (como listaNatal.mike)
var listaNatalString = '{"mike":"Livro","jason":"Blusa","chelsea":"iPad"}';

// Vamos converter para um objeto
var listaNatalObjeto = JSON.parse (listaNatalString);

// Agora que temos um objeto, vamos usar a notação com pontos
console.log(listaNatalObjeto.mike);	// Livro
```


Para uma cobertura mais detalhada de Objetos JavaScript, incluindo as adições na ECMAScript 5 para tratar objetos, leia o capítulo 6 de O Guia Definitivo JavaScript 6ª edição.
