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

## Quando usar templates JS e por que Handlebars.js?

Temos alguns casos específicos de uso para motores de template JavaScript.

#### Quando usar um motor de template JavaScript?

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
*

## Visão geral sobre Handlebars.js

## Comparando um projeto não handlebars com um projeto handlebars.js

## Aprenda a sintaxe Handlebars.js

## Auxiliares Handlebars.js embutidos (condicionais e loops)

## Auxiliares Personalizados Handlebars.js

## 4 maneiras de carregar/adicionar templates

## Handlebars.js com Backbone.js, jQuery, Ember.js e Meteor.js