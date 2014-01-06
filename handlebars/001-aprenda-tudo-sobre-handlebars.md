# Aprenda Tudo sobre Handlebars.js Templating JavaScript

### Originalmente postado em [JavaScript.is.Sexy](http://javascriptissexy.com/handlebars-js-tutorial-learn-everything-about-handlebars-js-javascript-templating/#Handlebarsjs_with_Backbonejs_jQuery_Emberjs_and_Meteorjs) - 18/02/2013

**Este é um tutorial sobre Handlebars.js e uma referência ao Handlebars.js** <br><br>

Este é um tutorial completo, e de fato uma referência, sobre templates Handlebars.js e, principalmente, templates JavaScript. Handlebars.js é um motor de templates no lado do cliente (pode ser usado no servidor também). É uma biblioteca JavaScript que você inclui em sua página da mesma maneira que você inclui qualquer arquivo .js. E com isso, você pode adicionar templates para sua página HTML que vão ser parseados e interpolados (valores de propriedades inseridos no lugar) com valores dos dados que você passou na função Handlebars.js.

Como funciona: Handlebars.js é um compilador escrito com JavaScript que pega qualquer HTML e expressão Handlebars e compila para uma função JavaScript. Esta função JavaScript derivada recebe um parâmetro, um objeto - seus dados - e retorna uma string com o HTML e os valores das propriedades do objeto inseridos dentro do HTML. Então, você acaba com um string (HTML) que tem valores de propriedades dos objetos inseridos em lugares relevantes, e insere a string na página.

#### Eu tenho que usar um motor de templates JavaScript? Se sim, por que?

Sim. Se você desenvolve ou planeja desenvolver aplicações JavaScript, você deve usar um sistema de templates JavaScript no lado do cliente para manter seu JavaScript e seu HTML suficientemente dissociado, que vai permitir que você gerencie seus arquivos HTML e JS de forma segura e fácil.

Claro, você pode usar [JSDOM](https://github.com/tmpvar/jsdom), ou pode usar templates no lado do servidor e enviar seus arquivos HTML via HTTP. Mas eu recomendo templates no lado do cliente porque isso é mais rápido que templates no servidor e fornece a forma mais fácil de criar e manter seus templates.

Acrescentando, quase todos os frameworks JavaScript front-end usam um motor de templates JavaScript, então você eventualmente usa template JavaScript, se você sempre usa um framework front-end ou backend.

> ## Tópicos neste post
> 
> * [Quando usar templates JS e por que Handlebars.js?](https://github.com/eoop/traduz-ai/blob/master/handlebars/001-aprenda-tudo-sobre-handlebars.md#quando-usar-templates-js-e-por-que-handlebarsjs)
> * [Visão geral sobre Handlebars.js](https://github.com/eoop/traduz-ai/blob/master/handlebars/001-aprenda-tudo-sobre-handlebars.md#vis%C3%A3o-geral-sobre-handlebarsjs)
> * [Comparando um projeto não handlebars com um projeto handlebars.js](https://github.com/eoop/traduz-ai/blob/master/handlebars/001-aprenda-tudo-sobre-handlebars.md#comparando-um-projeto-n%C3%A3o-handlebars-com-um-projeto-handlebarsjs)
> * [Aprenda a sintaxe Handlebars.js](https://github.com/eoop/traduz-ai/blob/master/handlebars/001-aprenda-tudo-sobre-handlebars.md#aprenda-a-sintaxe-handlebarsjs)
> * [Auxiliares Handlebars.js embutidos (condicionais e loops)](https://github.com/eoop/traduz-ai/blob/master/handlebars/001-aprenda-tudo-sobre-handlebars.md#auxiliares-handlebarsjs-embutidos-condicionais-e-loops)
> * [Auxiliares Personalizados Handlebars.js](https://github.com/eoop/traduz-ai/blob/master/handlebars/001-aprenda-tudo-sobre-handlebars.md#auxiliares-personalizados-handlebarsjs)
> * [4 maneiras de carregar/adicionar templates](https://github.com/eoop/traduz-ai/blob/master/handlebars/001-aprenda-tudo-sobre-handlebars.md#4-maneiras-de-carregaradicionar-templates)
> * [Handlebars.js com Backbone.js, jQuery, Ember.js e Meteor.js](https://github.com/eoop/traduz-ai/blob/master/handlebars/001-aprenda-tudo-sobre-handlebars.md#handlebarsjs-com-backbonejs-jquery-emberjs-e-meteorjs)

## Quando Usar Templates JS e por que Handlebars.js?

Temos alguns casos específicos de uso para motores de template JavaScript.

#### Quando Usar um Motor de Template JavaScript?

Você deve usar um motor de template JavaScript como Handlebars.js quando:

* Sempre que você usar um framework front-end JavaScript como Backbone.js, Ember.js, e similares. a maioria dos frameworks JavaScript front-end dependem de motores de template.
* A View da aplicação (a página HTML ou porções desta) vão ser atualizadas frequentemente, especilamente como um resultado de mudanças dos dados ou do servidor por meio de uma API REST ou a partir de dados do cliente.
* Você tem múltiplas tecnologias que dependem de seus dados a partir do servidor e você quer que todas elas processem os mesmos dados.
* Sua aplicação tem muita interatividade e é muito responsiva.
* Você está desenvolvendo uma aplicação web single page com múltiplas views.
* Você deseja gerenciar facilmente seu conteúdo HTML; você não quer que seu código JavaScript contenha importantes marcações HTML:
	```javascript
	shoesData.forEach (function (eachShoe) {
		// note a confusão entre HTML e JavaScript; é tedioso para acompanhar:
		theHTMLListOfShoes += '<li class="shoes">' + '<a href="/' + eachShow.name.toLowerCase() + '">' + eachShow.name + ' -- Price: ' + eachShoe.price + '</a></li>';
	});
	return theHTMLListOfShoes;

	```

#### Por que Handlebars.js (dos 8 ou mais motores template)?

Previsivelmente, temos muitos motores client-side (no lado do cliente) de templates JavaScript, mas nós vamos focar somente no Handlebars.js neste tutorial, visto que este é o melhor de todos. Alguns outros motores de template dignos são Underscore.js, Mustache.js, EJS e Dust.js.

Handlebars.js é uma extensão da linguagem de templates JavaScript Mustache; ele susbstitiu o Mustache.js.

Por que usar Handlebars.js? Aqui alguns motivos:

* Handlebars é um dos mais avançados (pré-compiladores e similares), rico de recurso e popular entre todos os motores de templates JavaScript, e tem a comunidade mais ativa.
* Handlebars é um motor de templates *logic-less*, que significa que há pouca ou nenhuma lógica em seus modelos que estão na página HTML. O mais importante uso de Handlebars, e qualquer motor de templates, é manter suas páginas HTML simples e limpas e desacopla-las de arquivos JavaScript lógicos, e o Handlebars cumpre esta proposta bem. Em adição, Dust.js é também um motor de templates *logic-less* e uma [digna alternativa](http://engineering.linkedin.com/frontend/client-side-templating-throwdown-mustache-handlebars-dustjs-and-more) para o Handlebars.js.
* Além disso, os frameworks JavaScript de última geração **Meteor.js** e **Derby.js**, que vamos cobrir nos próximos posts, são esperados para se tornarem *mainstream* nos meses seguintes, e ambos usam Handlebars.js. Para ser claro: Meteor.js usa Handlebars.js e Derby.js usa uma "sintaxe de template muito baseada no Handlebars". E **Ember.js usa Handlebars**, também.

	Enquanto Backbone.js é embalado com motor de templates Underscore.js, é super fácil usar Handlebars.js com o Backbone.js.

	Portanto, a experiência e conhecimento que você vai ganhar aprendendo Hanblebars.js agora vai ser muito valiosa, se você usa, ou planeja usar, qualquer framework JS.

Sucintamente, aprender Handlebars.js agora é um investimento e uma escolha sábia: você vai programar de forma mais eficaz agora e vai adaptar-se facilmente aos frameworks JS de amanhã e das próximas semanas e meses.


## Visão Geral Sobre Handlebars.js

Agora que vimos como usar o Handlebars em uma simples aplicação, vamos estudá-lo em detalhe.

### Como o Handlebars.js Funciona?

Como descrito na introdução: Handlebars.js é um compildar feito em JavaScript que pega qualquer HTML e expressão Handlebars e o compila para uma função JavaScript. Esta função JavaScript derivada então pega um parâmetro, um objeto - seu dado - e retorna uma string HTML com o valor da propriedade do objeto inserida (interpolada) dentro do HTML. Então, você termina com uma string (HTML) que tem o valor a partir da propriedade do objeto inserida nos lugares relevantes, e você insere a string na página.

Isto soa mais complicado do que é, vamos olhar mais de perto.

### As 3 Partes Principais dos Templates Handlebars

Para usar Handlebars, primeiro você liga o arquivo Handlebars.js no bloco *head* da sua página HTML, como se faz com jQuery ou qualquer arquivo .js... Então temos 3 partes do código que você usa para templates Handlebars:

1. **Expressões Handlebars.js**
	Expressões Handlebars são compostas de expressões Handlebars e qualquer conteúdo HTML ou expressões Handlebars dentro dentro da expressão (se a expressão é um bloco).

	Uma simples expressão Handlebars é escrita dessa forma (onde "conteudo" pode ser uma variável ou uma função *helper* com - ou sem - parâmetros:

	```html

	{{ conteudo }}

	```

	Ou assim, no caso de bloco de expressões Handlebars (que nós vamos discutir em detalhe depois):

	```html

	{{#each}}
		Conteúdo HTML e outras expressões Handlebars vão aqui.
	{{/each}}

	```

	Abaixo é uma expressão Handlebars com HTML. A variável *nomeCliente* é a propriedade que vai ser interpolada (seu valor vai ser inserido no lugar) pela função Handlebars.compile:

	```html

	<div> Name: {{ nomeCliente }} </div>
	
	```

	A saída vai ser a seguinte (se a variável nomeCliente tiver o valor "Richard"):

	Richard

	Desque que você tenha que passar a expressão Handlebars (com qualquer HTML contido) para a função Handlebars.compile, uma tag `script` é usada para anexar cada template Handlebars quando eles estão na página HTML. Na verdade, a tag `script` não é necessária quando um template está no próprio arquivo HTML, mas é necessário quando o template Handlebars está junto com outro template Handlebars e outro conteúdo HTML.

	**- Script Tag**

	Templates Handlebars são embutidos nas tags `script` (onde as propriedades `type` das tags scripts são configuradas como `text/x-handlebars-template`). A tag script é similara tag script que você usa normalmente para incluir JavaScript na página HTML, exceto pelo atributo `type` que é diferente. Você recupera o conteúdo do HTML a partir da tag script e o passa para o compilador Handlebars.

	Aqui temos um exemplo da tag `script` do Handlebars:

	```html

	<script id="header" type="text/x-handlebars-template">
		<div> Name: {{ headerTitle }}</div>
	</script>
	
	```

2. **Dados (ou Contexto)**

	A segunda parte do código no template Handlebars é o dado que você quer mostrar na página. Você passa seus dados como um objeto (um objeto regular JavaScript) para a função Handlebars. O *dado-objeto* é chamado de contexto. E este objeto pode ser composto de arrays, strings, números, outros objetos, ou uma combinação de todos eles.

	Se o dado-objeto tem um array de objetos, você pode usar a função auxiliar Handlebars `each` (mais sobre auxiliares depois) para iterar o array, e o contexto atual é configurado para cada item dentro do array.

	Aqui temos exemplos de configuração de objetos e como iterá-los com um template Handlebars.

	- Objeto com array de objetos.

	```javascript

	// O objeto customers tem um array de objetos que vamos passar para o Handlebars:
	var theData = {
		customers: [
			{
				firstName: "Michael", 
				lastName: "Alexander", 
				age: 20
			},
			{
				firstName: "John",
				lastName: "Allen",
				age: 29
			}
		]
	};

	```

	Você pode usar o *auxiliar each* para iterar o objeto customer assim:

	```html

	<script id="header" type="text/x-handlebars-template">
		{{#each customers}} // note a referência ao objeto customers
			<li> {{ firstName }} {{ lastName }} </li>
		{{/each}}
	</script>

	```

	Ou, uma vez que passamos o objeto customers como um array de objetos, nós podemos usar uma declaração de bloco auxiliar (mais sobre blocos auxiliares depois) como esta e referenciar o *customers* diretamente:

	```html

	<script id="header" type="text/x-handlebars-template">
		{{#customers}}
			<li> {{ firstName }}  {{ lastName }} </li>
		{{/customers}}
	</script>

	```

	- Objeto com Strings

	```javascript

	var theData = {
		headerTitle: "Shop Page",
		weekDay: "Wednesday"
	};

	<script id="header" type="text/x-handlebars-template">
		<div> {{ headerTitle }} </div>
		Today is {{ weekDay }}
	</script>

	```

3. **Função de Compilação do Handlebars**

## Comparando um projeto não handlebars com um projeto handlebars.js

## Aprenda a sintaxe Handlebars.js

## Auxiliares Handlebars.js embutidos (condicionais e loops)

## Auxiliares Personalizados Handlebars.js

## 4 maneiras de carregar/adicionar templates

## Handlebars.js com Backbone.js, jQuery, Ember.js e Meteor.js