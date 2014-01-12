# Mais Mágicas do AngularJS para Turbinar sua Webapp

#### Postado originalmente em [yearofmoo.com](http://www.yearofmoo.com/2012/10/more-angularjs-magic-to-supercharge-your-webapp.html)

<img src="https://docs.google.com/drawings/d/1-Z1hUfyu3Bdm5urTlwgtSXVbl1-NAyYBYxp3TXJRpfQ/pub?w=958&amp;h=491">

### Abram caminho para outro incrível artigo que abrange mais sobre AngularJS

Devido a popularidade do artigo anterior, [Use AngularJS para Potencializar suas Aplicações Web](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web), eu decidi cobrir mais sobre AngularJS e o fazer **simples e fácil** para todos os desenvolvedores experimentá-lo. **AngularJS é uma ferramenta incrível**, mas muito das funcionalidades avançadas estão **profundamente escondidas na documentação** e outras estão **muito complicadas para se aprender diretamente**. AngularJS é também relativamente novo e como resultado existem várias particularidades a serem descobertas e divulgadas.

Este artigo vai cobrir mais sobre as **jóias escondidas do AngularJS e introduzir novos truques e métodos de desenvolvimento para turbinar sua aplicação AngularJS**. Por favor leia adiante se você deseja se tornar um **AngularJS web guru** :)

# Tabela de Conteúdo

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

# Sobre Este Artigo

Este artigo é uma sequência do anterior entitulado [Use AngularJS para Potencializar suas Aplicações Web](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web). Para aqueles de vocês que ainda não leram o artigo, certifique-se de primeiramente absorvê-lo completamente antes de mergulhar neste. Todos os tópicos neste artigo são baseados nos tópicos e no conhecimento introduzino no anterior, então dê uma olhada nele.

Para clarear um pouco as coisas, no artigo anterior o primeiro módulo carregado pelo AngularJS foi como o seguinte ( a variável **App** será muito usada neste artigo):

```javascript

// você pode retirar o item do array ngResource se você quiser
var App = angular.module('YOUR_APP_NAME', ['ngResource']);

```

AngularJS é grande e oferece muitas funcionalidades que ainda devem ser descobertas pela comunidade dos desenvolvedores. Não muito sobre funcionalidades escondidas, mas sobre a maneira de se usar estas funcionalidades que ainda não foram totalmente cobertas por ninguém na internet. Este artigo vai mais além. Vamos introduzir vários truques avançados e segredos que você pode usar para fazer sua aplicação AngularJS sempre mais insana que já é.

# AngularJS e o Internet Explorer

Antes de investigarmos mais sobre as mágicas do AngularJS, algumas informações sobre o Internet Explorer devem ser cobertas.

Não é recomendado que o **IE6 e IE7** sejam usados em aplicações AngularJS. A falta de suporte a **tags personalizadas** e **eventos por mudança de hash** tornam a aplicação em si muito inchada e lenta. Apesar de termos algum suporte a eles, o AngularJS é recomendado somente para ser usado com navegadores de qualidade como (Chrome, Firefox, IE8+, Safari e Opera). Esforce em evitar o uso do AngularJS com IE6 e IE7 e tudo vai estar bem.

AngularJS menciona que o uso de tags personalizadas é suportada no IE8 e é notado que o Angular trabalha bem com IE8 quando usado qualquer tag personalizada. Eu não creio completamente que o IE8 respeita tags personalizadas visto que um arquivo especial HTML5 é necessário para fazer tags HTML5 funcionarem no IE8. Portanto você vai precisar de definir cada uma das tags personalizads que vai usar no início do seu arquivo (`document.createElement('ng-pluralize')`, `document.createElement('ng-view')`, etc...). Então se você quiser trabalhar usando tags personalizadas ou se você quiser evitar IE8 também, então somente continue usando as tags HTML/HTML5 regulares e tudo funcionará bem.

> [Click aqui para ler mais sobre compatibilidade do IE com AngularJS](http://docs.angularjs.org/guide/ie)

# Data Binding e mudanças de $scope

Data binding funciona repercutindo os valores contidos na variável `$scope` para o DOM usando várias abordagens. Se de forma direta com as chaves `{{ someValue }}`, ou com um atributo usando um modelo *binding*, o AngularJS é projetado para fazer isto bem e fazer isto rapidamente.

O AngularJS manipula as mudanças no $scope <strike>com uma abordagem *poll e watch* mas isto não é exatamente o que você espera que um polling seja</strike> **se um eventor maior ocorrer dentro da aplicação, e então, uma vez ocorrido o evento, uma operação *digest* é emitida e o escopo atualizado**. A variável do AngularJS `$scope` atua como um grande armazenamento chave/valor que é percorrido internamente <strike>em um intervalo timeout</strike>, e comparado a seu antigo valor cada vez que uma *digestão* ocorre. Se existir uma alteração do valor comparado com seu valor antigo, então o Angular dispara uma evento de alteração e renderiza o DOM necessário para manipulação, renderizando o binding baseado no valor da variável. Estes **eventos maiores** que o AngularJS presta atenção são eventos input do usuário (**mouse**, **keyboard**, **etc...**), qualquer tipo importante de evento do browser (*timeout*, *blur*, *etc...*), e quando qualquer dado retornado é assim feito pelo servidor (**chamadas $http**, **download de templates**, **etc...**). Isto é o porque quando algo acontece fora do código Angular (um plugin de terceiros faz algo, ou quando a URL é manualmente alterada) uma chamada direta ao `$scope.$apply()` deve ser feita para informar ao AngularJS para reconhecer a mudança (tudo sobre isto será explicado com mais detalhes posteriormente).

O melhor sobre isso tudo é que o Angular não é ganancioso e somente roda quando tem que rodar, então se sua webpage está inativa por um processo em segundo plano, ao menos que você implemente algo para iterar conjuntamente, o Angular **não vai** disparar qualquer chamada *digest*.

Você deve estar pensando que qualquer aplicação que é <strike>constantemente</strike> **periodicamente** checada sobre o mesmo dado de novo e de novo deverá tornar-se lenta muito facilmente, mas não. O AngularJS executa **extraordinariamente bem em comparação a outros frameworks JavaScript MVC** e esta mesma **abordagem "suja" de verificação** é muito comum com outros tipos de programas como os **video games**.

> [Clique aqui para encontrar mais sobre isto no **StackOverflow.com**](http://stackoverflow.com/questions/9682092/databinding-in-angularjs/9693933#9693933)
> [Click aqui para encontrar mais na documentação.](http://docs.angularjs.org/guide/concepts#runtime)

# Escope Raiz e Extendendo Membros do Escopo

