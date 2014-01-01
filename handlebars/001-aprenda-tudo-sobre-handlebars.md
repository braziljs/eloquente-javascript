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

## Visão geral sobre Handlebars.js

## Comparando um projeto não handlebars com um projeto handlebars.js

## Aprenda a sintaxe Handlebars.js

## Auxiliares Handlebars.js embutidos (condicionais e loops)

## Auxiliares Personalizados Handlebars.js

## 4 maneiras de carregar/adicionar templates

## Handlebars.js com Backbone.js, jQuery, Ember.js e Meteor.js