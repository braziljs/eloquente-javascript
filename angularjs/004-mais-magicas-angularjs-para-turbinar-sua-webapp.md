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
>
> [Click aqui para encontrar mais na documentação.](http://docs.angularjs.org/guide/concepts#runtime)

# Escopo Raiz e Extendendo Membros do Escopo

O `$rootScope` atua como o escopo do objeto pai de todos outros objetos `$scope`. Isso significa que quando um controlador é executado então a variável `$scope` que é fornecida para ele vai ter seu conteúdo **linkado/clonado a partir do objeto `$rootScope`**. É melhor apenas pensar a variável `$scope` como uma classe filha de `$rootScope` (**`$scope` extende de `$rootScope`**). Entender isso é **útil quando você quer ter métodos especiais atribuídos a sua variável scope** para uso entre toda a sua aplicação (como as informações de sessão, flags, estados, etc...).

O exemplo seguinte é um exemplo de como você pode atribuir direntes bibliotecas ou objetos de código a sua instância `$scope`.

```javascript

App.run(['$rootScope', function ($rootScope) {
	
	// isto vai estar disponível para todas as variáveis scope
	$rootScope.includeLibraries = true;

	// este método vai estar disponível para todas as varáveis scope também
	$rootScope.include = function (libraries) {
		var scope = this;
		// atribui cada uma das bibliotecas diretamente a variável scope
		for ( var i = 0; i < libraries.length; i++ ) {
			var key = libraries[i];
			scope[key] = getLibrary( key );
		}
		return scope;
	}
}]);

```

E então dentro do seu controlador ou diretiva você pode fazer o seguinte:

```javascript

var Ctrl = function ( $scope ) {
	if ( $scope.includeLibraries ) { // uma sinalização foi configurada no objeto $rootScope
		$scope = $scope.include( ['puglin1', 'library1'] );
	}
};

Ctrl.$inject = ['$scope'];

```

Tente não configurar muitos dados dentro das variáveis `$scope` e `$rootScope`. Afinal, o AngularJS negocia com os dados do `$scope` muito muito frequentemente e você não quer sobrecarregá-lo.

# $apply, $digest e $$phase

Isso é a coisa mais importante de se saber sobre o AngularJS. Vai chegar uma hora e um local quando você vai precisar integrar uma aplicação de terceiros dentro do seu website e você vai achar que não funciona ou que estes não são vistos pelo Angular. Para fazer isto funcionar você vai precisar entender como os métodos `$digest` e `$apply` funcionam.

Toda vez que um **evento maior ocorre** em uma aplicação web que está rodando o Angular (quando uma página é carregada pela primeira vez, quando uma nova requisição AJAX é recebida, quando a URL muda, etc...) o **Angular pega a alteração e então prepara uma digestão** (que é um loop interno que é rodado sobre o membro `$scope`). Isto leva apenas poucos milisegundos, mas o Angular somente roda um processo a cada vez. Você pode manualmente iniciar este processo rodando o método `$scope.$apply()` (isso é útil para disparar atualizações quando uma aplicação de terceiros faz algo com sua página que o Angular precisa de saber). Se você configurar suas próprias *bindings* e rodar o método `$scope.$apply()` então uma exceção pode ser lançada e parar seu código (que acontece quando uma digestão está acontecendo em segundo plano). Então você precisa de estar ciente quando uma digestão estiver acontecendo checando a variável `$$phase` (isto é explicado abaixo). O método $apply roda o método `$digest` que é um método interno que dispara o Angular para consultar todos os seus métodos `$watch`.

Para pegar a **exceção $apply** você precisa ter atenção a sinalização de `$scope.$$phase` para ver se uma fase da digestão está ocorrendo em segundo plano. Se estiver ocorrendo, então você pode somente configurar os valores `$scope` diretamente e eles devem ser pegos pela digestão atual. Aqui temos um método combinado que eu uso para contornar esta situação:

```javascript

// Quando você adiciona isto a variável $rootScope,
// então se torna acessível para todas as variáveis $scope
$rootScope.$safeApply = function ( $scope, fn ) {
	fn = fn || function () {};
	if ( $scope.$$phase ) {
		// não se preocupe, o valor é definido
		// e o Angular o pega...
		fn();
	}
	else {
		// isto vai disparar e dizer ao AngularJS que
		// uma mudança ocorreu se isso estiver
		// fora de seu próprio comportamento
		$scope.$apply( fn );
	}
};

// e você pode rodar isso assim
$scope.some_value = 'value...';
$scope.$safeApply($scope, function () {
	// esta função é rodada quando o processo apply
	// está rodando ou estiver terminado
});

```

Se o evento que você deseja, mudar a URL da página, então você deve ter atenção a variável `$$phase` para ver se é **permitido** fazer esta mudança. Se uma fase da digestão estiver acontecendo, então você pode somente usar mudar a URL pela velha maneira usando `window.location`.

```javascript

// assegure-se de injetar o $scope e $location em algum lugar antes disto
var changeLocation = function ( url, force ) {
	// isso vai marcar a mudança da URL
	// use $location.path(url).replace() se você quer trocar o local ao invés
	$location.path( url );

	$scope = $scope || angular.element( document ).scope();
	if ( force || $scope.$$phase ) {
		// isto vai iniciar o Angular se for noticiada a mudança
		$scope.$apply();
	}
};

```

Isso deve garantir que a sua URL vai ser trocada, não importa o quê.

# Comunicação entre Serviços e Controladores

Sempre que você tiver um evento ocorrendo em sua aplicação que afeta todos os controladores e diretivas, é melhor usar os métodos `$emit`, `$on` e `$broadcast` fornecidos pelo AngularJS. Exemplos disso incluem permissões e mudanças de sessão (como quando um usuário desloga ou uma flag - *bandeira* - é levantada).

Quando você precisa de ter um controlador ou escopo pai, instruindo todos os controladores filhos sobre a mudança, então você pode usar o método `$broadcast`.

```javascript

// pega o escopo mais elevado
var $scope = angular.element(document).scope();

// evento logout
var logoutEvent = 'logout';
var logouArgs = ['arg'];
$scope.broadcast(logoutEvent, logoutArgs);

// evento login
var logoutEvent = 'logout';
var logouArgs = ['arg'];
$scope.$broadcast(logoutEvent, logoutArgs);

```

Então dentro do seu controlador ou diretiva faça isso:

```javascript

// no seu controlador
var Ctrl = function ($scope) {
	$scope.$on('logout', function(args) {
		alert('bye bye');
	});
	$scope.$on('login', function (args) {
		alert('hello there');
	});
};

Ctrl.$inject = ['$scope'];

// Em sua diretiva
App.directive('sessionStatus', function () {
	return function($scope, element, attrs){
		$scope.$on('login', function () {
			element('html', 'You are logged in!');
		});
		$scope.on('logout', function () {
			element('html', 'You are logged out!');
		});
	};
});

```

Você pode também disparar eventos de retorno usando o `$scope.$emit`.

```javascript

var Ctrl = function ($scope) {
	$scope.onLogoutClick = function () {
		$scope.$emit('logout');
	}
};
Ctrl.$inject = ['$scope'];

```

Usando estes métodos de comunicação entre controladores, não haverá necessidade de criar code compartilhado entre os mesmos.

# Funcionalidades Adicionais dos Controladores e Rotas

O AngularJS também vem com outros métodos menos conhecidos de manipular requisições entre controladores. Mas, antes de entrar neste assunto eu gostaria de ressaltar uma forma diferente de se criar controladores.

```javascript

App.controller('Ctrl', ['$scope', function ($scope) {
	// exatamente o mesmo resultado de se criar um controlador com uma função explícita
}]);

```

Ok então vamos aos negócios. Quando uma requisição ocorre você pode criar um ação independente da rota, que é basicamente uma função que é disparada logo antes da requisição ser enviada pra fora do controlador. Aqui um exemplo disso:

```javascript

// confira o código da rota abaixo antes de ler esta parte
var Ctrl = function ($scope, $http, argument1, argument2, argument3) {
	alert(argument1); // valor someDependency ou método toString
	alert(argument2); // "algum valor" 
	alert(argument3); // o valor response.data retornado de GET /path/to/some/url
};

Ctrl.$inject = ['$scope', '$http', 'argument1', 'argument2', 'argument3'];

// aqui é onde a mágica acontece
App.config(['$routeProvider', function ($routeProvider) {
	templateUrl: '/path/to/some/template.html',
	controller: Ctrl,
	resolve: {
		argument1: 'someDependency', // esta é uma dependência registrada e trabalha da mesma forma que a injeção de dependências faria dentro de um controlador
		argument2: function () { return 'some value'; }, // esse é resolvido instantaneamente porque não há nada acontecendo
		argument3: function () {
			return $http.get('/path/to/some/url', function (response) {
				return response.data; // isto é o que retorna como o valor do argument3
			});
		}
	}
}]);

```
# Você deve usar Serviços Personalizados

Serviços personalizados são o que fazem o angular ser muito manejável e facilmente testável.
Ao usar recurso de injeção de dependência do angular, você pode criar um serviço personalizado em qualquer lugar dentro de sua aplicação e inclui-lo em outro lugar com muita facilidade. Um exemplo comum de um serviço compartilhado, é usa-lo como um serviço `$http` especial que está adaptado para atender o seu pedido.

```javascript
App.factory('myHttp',['$http',function($http) {
  return function() {
    get : function(url, success, fail) {
      $http.get(url).success(function(response) {
        return response.data;
      }).error(fail);
    }
  };
}]);

//O serviço agora pode ser chamado 
$myHttp.get('/path', function(data) {
  alert(data);
});
```

A seguir uma demonstração de como os dados são compartilhados entre os serviços dentro do mesmo model.
```
App.factory('myFoo',['$http',function($http) {
//todas as variaveis definidas nessa area serão acessivel
//dentro de outros serviços que são definidos dentro de um mesmo módulo.
//Assim, se uma variável chamada foo, var foo = 'bar'
//então foo pode ser acessado em outro serviço. 
//Certifique-se de manter isso em mente, uma vez que é difícil de debugar.
  return foo;
}]);

App.factory('myBar',['$http',function($http) {
  var bar = 'bar2';
  return foo.toString() + bar; /// esse deve retornar bar2 ou barbar2
}]);

```
Você também pode injetar qualquer um dos seus próprios serviços em outros serviços quando criados, isso é muito util para a reutilização de código e testes.

# Show, Hide, Cloak and Init

Você irá descobrir que mostrar (show) e ocultar (hide) valores em seus templates angular pode ser dificil, pois você não pode contar com a linguagem de programação do lado do servidor para construir seu template (templates são estaticos). Aqui está um exemplo de como algo iria funcionar normalmente quando se utiliza algo como PHP.

```
<div class="session">
  <?php if($isAdmin) { ?>
    <span class="admin">Hello Admin</span>
  <?php } else { ?>
    <span class="user">Hello User</span>
  <?php } ?>
</div>

```

O mesmo efeito pode ser criando ao usar angular

```
<div class="session">
  <span class="admin" data-ng-show="isAdmin">Hello Admin</span>
  <span class="admin" data-ng-hide="isAdmin">Hello User</span>
</div>
```
Só não se esqueça de definir o valor de ligação.

```
$scope.isAdmin = true; //ou false ou seja o que for

```
Isso funciona, mas quando a página ainda está carregando (quando carregada pela primeira vez), você pode ver os dois valores ao mesmo tempo, para contornar isso, basta usar ng-clock.

```
<div class="session ng-cloak">...</div>

```
E defina o css para também:

```
.ng-cloak {
  /* Isso vai mudar para bloquear quando scope and angular estiver prontos*/  
  display:none;
}

```
Oh! E mais uma coisa. Se você deseja definir o valor isAdmin direto em seu HTML, em seguida, faça o seguinte usando o data-ng-init

```
<div class="session ng-cloak" data-ng-init="isAdmin=false;">
  <span class="admin" data-ng-show="isAdmin">Hello Admin</span>
  <span class="admin" data-ng-hide="isAdmin">Hello User</span>
</div>
```
O atributo data-ng-init é util para valores pré-definidos. A sintaxe funciona como você estivesse definindo valores diretamente em JavaScript (uma vez que usar `eval` para avaliar o texto dentro do valor do atributo).

É simplesmente fantatisco!

# Capturando Erros

Capturar erros é algo importante para a produção de aplicações. Abaixo estão várias maneiras de se fazer isso:

<strong>Capturar outras rotas (otherwise)</strong>
Apesar de ser um método util como uma pagina padrão para uma rota, é melhor reservar essa rota como seu manipulador de página 404, caso uma rota não seja reconhecida dentro de sua aplicação.

´´´
$routeProvider.when('/404',{
  controller : ErrorCtrl
});
$routeProvider.otherwise({
  redirectTo : '/404'
});
´´´
<strong>Quando sua rota falhar!</strong>
No caso de uma mudança de rota falhar(devido a um templateUrl faltar ou algo assim), então você pode capturar o evento dentro de seu alcance, fazendo o seguinte:

´´´
App.run(['$rootScope','$location',function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
    //Alterar o código para manipular o erro de alguma forma
    $location.path('/404').replace();
  });
}]);
´´´
Envolva serviços em torno de suas solicitações HTTP
No início do artigo, Eu expliquei a importancia de personalizar serviços para reutilização de código.
Quando você definir um serviço personalizado para envolver todas suas chamadas AJAX, então você poderá pegar os erros antes de serem transferidos para outras da sua aplicação.

´´´
App.factory('myHttp',['$http','$location',function($http, $location) {

  var onEmpty = function() {
    window.location = '/404';
  };

  return function() {
    get : function(url, success, fail) {
      $http.get(url).success(function(response) {
        var data = response.data;
        if(!data) {
          onEmpty();
          return;
        }
        success();
      }).error(onEmpty);
    }
  };
}]);
´´´
Certifique-se de usar somente esse método quando você acessar recursos e dados que são necessários dentro da sua aplicação (como dados JSON para uma view).
