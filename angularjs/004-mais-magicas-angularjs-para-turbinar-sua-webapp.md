# Mais Mágicas do AngularJS para Turbinar sua Webapp

#### Postado originalmente em [yearofmoo.com](http://www.yearofmoo.com/2012/10/more-angularjs-magic-to-supercharge-your-webapp.html)

<img src="https://docs.google.com/drawings/d/1-Z1hUfyu3Bdm5urTlwgtSXVbl1-NAyYBYxp3TXJRpfQ/pub?w=958&amp;h=491">

### Abram caminho para outro incrível artigo que abrange mais sobre AngularJS

Devido a popularidade do artigo anterior, [Use AngularJS para Potencializar suas Aplicações Web](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web), eu decidi cobrir mais sobre AngularJS e o fazer **simples e fácil** para todos os desenvolvedores experimentá-lo. **AngularJS é uma ferramenta incrível**, mas muito das funcionalidades avançadas estão **profundamente escondidas na documentação** e outras estão **muito complicadas para se aprender diretamente**. AngularJS é também relativamente novo e como resultado existem várias particularidades a serem descobertas e divulgadas.

Este artigo vai cobrir mais sobre as **jóias escondidas do AngularJS e introduzir novos truques e métodos de desenvolvimento para turbinar sua aplicação AngularJS**. Por favor leia adiante se você deseja se tornar um **AngularJS web guru** :)

## Tabela de Conteúdo

01. [Sobre este artigo]()
02. [AngularJS e o Internet Explorer]()
03. [Data Binding e mudanças de $scope]()
04. [Escope Raiz e Extendendo Membros do Escopo]()
05. [$apply, $digest e $$phase]()
06. [Comunicação entre Serviços e Controladores]()
07. [Funcionalidades Adicionais dos Controladores e Rotas]()
08. [Você deve usar Serviços Personalizados]()
09. [Show, Hide, Cloak e Init]()
10. [Capturando Erros]()
11. [Mais sobre Loops]()
12. [Mantendo Controle sobre Path/URL]()
13. [Filtros e Filtros Personalizados]()
14. [Mais sobre Diretivas]()
15. [Formulários e Validação de Formulários]()
16. [Internacionalização e Localização]()
17. [Como funcionam as Promises]()
18. [Includes e Views HTML personalizadas]()
19. [Templates inline]()
20. [Como ter certeza que suas Diretivas vão rodar depois do seu Escopo estar pronto]()
21. [Mais truques Angular HTML]()
22. [Conclusão]()

## Sobre Este Artigo

Este artigo é uma sequência do anterior entitulado [Use AngularJS para Potencializar suas Aplicações Web](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web). Para aqueles de vocês que ainda não leram o artigo, certifique-se de primeiramente absorvê-lo completamente antes de mergulhar neste. Todos os tópicos neste artigo são baseados nos tópicos e no conhecimento introduzino no anterior, então dê uma olhada nele.

Para clarear um pouco as coisas, no artigo anterior o primeiro módulo carregado pelo AngularJS foi como o seguinte ( a variável **App** será muito usada neste artigo):

```javascript

// você pode retirar o item do array ngResource se você quiser
var App = angular.module('YOUR_APP_NAME', ['ngResource']);

```

AngularJS é grande e oferece muitas funcionalidades que ainda devem ser descobertas pela comunidade dos desenvolvedores. Não muito sobre funcionalidades escondidas, mas sobre a maneira de se usar estas funcionalidades que ainda não foram totalmente cobertas por ninguém na internet. Este artigo vai mais além. Vamos introduzir vários truques avançados e segredos que você pode usar para fazer sua aplicação AngularJS sempre mais insana que já é.

## AngularJS e o Internet Explorer