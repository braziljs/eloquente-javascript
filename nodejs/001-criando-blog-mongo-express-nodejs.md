# Criando um Blog com MongoDB, Express e Node.js

* #### Artigo original em [How to Node](http://howtonode.org/express-mongodb).
* #### [Repositório com códigos atualizados e rodando deste tutorial.](https://github.com/newbreedofgeek/tmp-nodejs-express-mongoDB-blog)

Neste artigo, espero conduzí-lo com os passos necessários para obter um sistema persistente de blogs totalmente funcional rodando em cima do Node.

As tecnologias que iremos usar serão [Node.js](http://nodejs.org/) + [Express](http://github.com/visionmedia/express) + [Mongodb](http://www.mongodb.org/), sendo todas muito animadores, rápidas e altamente escaláveis. Você também irá usar [Jade](http://jade-lang.com/) e [Stylus](http://learnboost.github.com/stylus/) para conduzir as views dos templates e estilizá-los! Vamos usar o [NPM](http://npmjs.org/) para gerenciar facilmente os pacotes e instalações necessárias.

Este artigo vai ser bastante aprofundado, então você pode querer arrumar uma caneca grande com alguma bebida de sua preferência antes de iniciar :)

## Começando / Pré-Requisitos

### MongoDB

A instalação é tão simples quanto fazer o [download do instalador aqui](http://www.mongodb.org/downloads). Para este tutorial estou usando a versão v1.8.2 no MacOSX mas qualquer versão mais recente deve funcionar. Uma vez instalado você pode somente executar `mongod` para obter uma instância local rodando.

## Node.js