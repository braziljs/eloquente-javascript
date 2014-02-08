# Simples Guia Passo-a-Passo Para Desenvolvedores Front-End Iniciarem Com Node.js, Express, Jade e MongoDB

### Configure uma Aplicação *Full Stack JavaScript* e a tenha funcionando em 30 minutos. Faça-a conversar com seu banco de dados em outros 30.

#### Artigo Traduzido. Veja o original [aqui](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/).

> [Você pode encontrar/forkar este tutorial e todo o projeto de exemplo no Github.](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/)

## Introdução

Existem aproximadamente cem milhões de tutorials na web para obter um "Hello World!" com Node.js. Isto é ótimo! Isto é especialmente bom se seu objetivo é comprimentar o mundo e depois abandonar sua carreira na web e passar o resto da sua vida como um jóquei, ou qualquer outra coisa. Isto realmente não descreve muitos de nós, então vamos olhar por mais tutoriais.

Em minha experiência, o "próximo nível" de tutoriais que achamos estão 30 níveis acima destes. Vamos de um "Hello World" para uma construção de um sistema inteiro de blog com comentários. Isto também é ótimo, mas muitas vezes estes tutoriais assumem que o leitor tem um sólido conhecimento básico, e então eles soltam um monte de funções sobre você de uma só vez. Eu aprendo melhor fazendo um monte de etapas intermediárias, menores, e não acho que sou o único.

Eu não sou o único, certo?

Bom, boa notícia a todos! Eu li e fiz muitos tutoriais, até que as coisas finalmente funcionaram. Tenho um projeto web rodando que usa Node.js, o framework Express, o pré-processador de HTML chamado Jade e o MongoDB para os dados. Sou capaz de ler e escrever a partid do banco de dados. A partir disso, o céu é o limite.

Aqui está o acordo: Vou mostrar à você como pegar todas essas coisas e configurá-las. Vou assumir que você é um desenvolvedor front-end que conhece o suficiente de HTML5/CSS3/JavaScript para que eu não tenha que explicá-los.

Seu aplicativo vai ficar bonito, vai se conectar com um DB (banco de dados), ele vai obter alguns resultados, e vai fazer coisas com estes resultados. E por diversão também vamos fazê-lo salvar dados no DB. Através de tudo isso, eu irei explicar o que o código faz, e como escrevê-lo, ao invés de somente fornecer a você funções massantes para olhar. Vamos partir de nada instalado, para uma aplicação que manipula banco de dados em uma linguagem que você compreende totalmente, e a fundação necessária para construir funcionalidades adicionais para sua app. E vamos fazer isso aproximadamente em 60 minutos entre instalação e codificação. Isso é impressionante? Sugiro que sim.

Vamos lá!

## Parte 1 - 15 minutos de instalação

