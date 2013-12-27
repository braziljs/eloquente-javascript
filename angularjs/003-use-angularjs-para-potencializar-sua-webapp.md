# Use AngularJS para Potencializar suas Aplicações Web

* **Postado originalmente em [yearofmoo.com](http://www.yearofmoo.com/2012/08/use-angularjs-to-power-your-web-application.html)**
* **data de postagem da tradução:**

<img src="https://docs.google.com/drawings/d/1-Z1hUfyu3Bdm5urTlwgtSXVbl1-NAyYBYxp3TXJRpfQ/pub?w=958&amp;h=491">

### AngularJS é um verdadeiro e incrível método de desenvolver aplicações com JavaScript.

AngularJS, criado pela Google, é um *bem-organizado*, *bem-testado*, versátil, *poderoso* e *flexível* framework JavaScript MVC para construção de *ricas aplicações client-side*. Você continua precisando de ter um *server-side backend*, mas a maioria da lógica da interação do usuário será delegada ao client-side. Isso inclui coisas como *envio de formulários* que são manipulados via *AJAX*, *validações de modelo*, *manipulação de templates* e *ligação de dados* (data-binding). Se estas coisas são estranhas para você então leia adiante e veja como você pode se beneficiar por construir aplicações web de forma bem *mais radical*.

### Última Atualização
Esta página foi primariamente publicada em *15 de Agosto de 2012* e foi atualizada em *29 de Outubro de 2012*.

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Tabela de Conteúdo

01. [Sobre este artigo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#sobre-este-artigo)
02. [Aplicações Web (não websites)](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#aplica%C3%A7%C3%B5es-web-n%C3%A3o-websites)
03. [Então como isso funciona?](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#ent%C3%A3o-como-isso-funciona)
04. [Começando](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#come%C3%A7ando)
05. [Módulos](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#m%C3%B3dulos)
06. [Bindings, Expressões e Mágica do Angular](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#bindings-express%C3%B5es-e-m%C3%A1gica-do-angular)
07. [Injeção de Dependências](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#inje%C3%A7%C3%A3o-de-depend%C3%AAncias)
08. [Rotas](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#rotas)
09. [Controladores e Escopo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#controladores-e-escopo)
10. [Serviços](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#servi%C3%A7os)
11. [Modelos](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#modelos)
12. [Diretivas](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#diretivas)
13. [Filtros](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#filtros)
14. [Modo HTML5](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#modo-html5)
15. [Usando Angular com outro framework JavaScript/bibliotecas](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#usando-angular-com-outro-framework-javascriptbibliotecas)
16. [Usando .json como um sufixo URL para operações de modelo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#usando-json-como-um-sufixo-url-para-opera%C3%A7%C3%B5es-de-modelo)
17. [Daqui para frente](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#daqui-para-frente)
18. [Segundo artigo sobre AngularJS](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#segundo-artigo-sobre-angularjs)

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Sobre este artigo

Este artigo descreve brevemente para que o Angular pode ser usado e o básico de como funciona. O artigo cobre **controladores e escopo**, **serviços**, **modelos**, **templates**, **diretivas**, **filtros**, **módulos**, e **configurações**.

Este artigo também explica como o Angular pode ser usado com **MooTools** e **jQuery** em harmonia.

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Aplicações Web (não websites)

Quando você decide construir um website usando angular **a maior questão para se perguntar** é que este é um site que requer HTML válido ou é uma aplicação web que concentra mais na funcionalidade do que na marcação. Angular trabalha com **código HTML modelado** e **dados JSON**. O maior impacto da abordagem de como o Angular, e todos outros frameworks client-side MVC, lidam com sua lógica é que a estrutura e os dados são projetados para serem separados um do outro.

Isto resulta em templates (HTML) e dados (que é buscado como JSON) vinculados para prover um ambiente de trabalho e página web interativa.

Portanto a marcação buscada no servidor é **sem sentido sem o Angular** analisar e você **precisa de ter um cliente que suporta JavaScript**. Deste modo, os mecanismos de busca precisam trabalhar mais para ter uma representação completa dos dados -- então por enquanto **não é uma boa ideia usar Angular se você estiver fazendo um website que depende de mecanismos de busca para funcionar.** Então se você for construir uma **aplicação web**, **admin website** ou **single-page** website você terá uma grande ferramenta para fazer este trabalho. 

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Então como isso funciona?

O Angular trabalha **separando a lógica da aplicação a partir dos dados** no *client-side* e estruturando uma aplicação web client-side com o uso de **diretivas**, **filtros**, **bindings** (ligação) e **operações específicas de binding**. Controladores, Serviços e Modelos são usados para colar toda a lógica e as operações com dados. Como mencionado, dado e lógica são separados então isso significa que seus dados (**a parte dinâmica**), seu template HTML (**a parte estática**), e sua lógica (**os controladores e marcadores de ligação**) trabalham conjuntamente para fazer o trabalho da aplicação. A melhor coisa é que toda a parte não dinâmica pode ser cacheada por bastante tempo e suas respostas dinâmicas são pequenas. Isto é ótimo para cachear as respostas server-side e **reduz enormemente a quantidade de trabalho que o servidor terá que fazer para gerar as respostas HTML**. De fato se você pensar sobre isso, a maioria dos dados buscados para uma página HTML são redundantes... então por que não fazê-los 100% estáticos? O Angular faz isso e faz muito bem.

Como qualquer outra arquitetura MVC, **os caminhos URL são roteados pelos controladores** e os parâmetros estão acessíveis com um método controlador. O Angular também **fornece suporte para recursos (modelos)** e isso faz um bom trabalho reduzindo a quantidade de código requerido para o modelo padronizado de código para consultar o servidor. Isto também **reduz a quantidade de código requerido para manipular DOM bindings com dados e elementos HTML**.

**Uma vez que a página é lida**, Angular faz essa mágica construindo-a com **vários componentes**. Vamos olhar o que eles são.

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Começando

Configure seu site e inclua o Angular dentro do seu **código HTML com uma tag script JavaScript** para incluir a biblioteca no site. **É melhor que o Angular seja importado antes de todas outras bibliotecas e códigos**.

```html

<!-- Configure isso como uma tag HTML na sua aplicação -->
<script type="text/javascript" src="/path/to/angular/angular.js"></script>
<script type="text/javascript" src="/path/to/angular/angular-resource.js"></script>

```

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Módulos

Módulos são usados para **encapsular completamente todo o código angular de sua aplicação em um ponto de entrada**. As mais recentes construções do angular **incluem suporte a módulos** que são como namespacing misturados com **injeção de dependência (DI - direct injection)** e **error trapping**. Versões antigas do Angular não incluem isso. Temos vários artigos de blogs, videos e demos desatualizados que estão ensinando como usar uma versão antiga do Angular. Desta maneira confundirá quando configurarmos a aplicação com o download de uma versão mais recente do Angular.

Módulos são usados então sua aplicação (como discretas partes de sua aplicação) podem ser separadas em partes distintas que podem ser carregadas e executadas em ordens diferentes. Então você pode ter um módulo de diretivas que pode estar configurado para rodar antes que o módulo UI o seja, assegurando assim que sua aplicação resultante DOM esteja na forma adequada para seu código UI seja executado.

A primeira coisa que você precisa fazer quando configura sua aplicação Angular é seguir seu layout principal do arquivo (estou assumindo que você já inclui o angular no seu website como uma tag script JavaScript).

```html

<!-- Coloque isto como a tag HTML na sua aplicação -->
<html ng-app="YOUR_APP_NAME">

```

Você pode também usar outras variantes no seu HTML para configurar o nome da sua app, mas eu sinto que os atributos dos dados HTML5 são o caminho a ser seguido.

Depois, inclua um novo arquivo javascript no seu website e ponha este código:

```javascript

var App = angular.module('YOUR_APP_NAME', ['ngResource']);

```

Isto vai criar um módulo global para sua app onde você pode criar **rotas**, **modelos**, **filtros** e **diretivas**. A variável **App** é acessível através da sua aplicação e o array de definição **['ngResource']** define todos os outros módulos e dependências que deverão ser carregados previamente a este módulo recém ativado. Neste caso **ngResource** é um módulo adicional que define funcionalidade para criação de recursos (modelos) no Angular.

Qualquer modelo adicional pode ser definido usando a mesma sintaxe, mas **você deve definir o nome do módulo de forma diferente de qualquer outro módulo que já tenha sido definido**. Se você criar outro módulo com o mesmo nome então não vai funcionar (ou o módulo anterior não vai funcionar ao invés). Se você deseja fazer um novo módulo ativo depois do módulo da aplicação principal, então apenas defina o novo módulo e configure o nome do módulo da aplicação como dependência. 

Tenha em mente que um módulo **pode facilmente quebrar** (se há código errôneo nele), e módulos são projetados para conter seus próprios erros, então encontrar um error pode ser difícil já que você pode ficar com uma página vazia.

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Bindings, Expressões e Mágica do Angular

Bindings são muio muito poderosos. Eles reduzem drasticamente a quantidade de código HTML requisitado e também separam completamente a lógica da aplicação dos dados. O Angular vem com expressões que são separadas de suas marcações gerais HTML e vinculam-se ao alcance de uma variável, que é onde ocorre a ligação dos dados. Isto envolve **data binding**, **two-way data binding**, **condicionais**, **for in e foreach loops**, **model binding** e por ai vai.

Aqui temos um exemplo que lista todos os registros em uma lista ordenada e nós podemos fazer da seguinte forma (**isso é o que expressões angular são):

```html

<div class="records" ng-repeat="record in records | orderBy:orderProp">
	<h5> {{ record.title }} </h5>
</div>

```

O bloco interno (a tag h5) vai ser repetida para cada registro encontrado entre os registros do objeto (que está à parte da variável $scope). Finalmente o **orderBy:orderProp** especifíca que propriedade (neste caso o *title*) pode ser usado para ordenar os registros.

E o JavaScript para configurar os dados é como o seguinte **(este é o data binding)**:

```javascript

$scope.records = [{ title : 'one' }, { title : 'two' }, { title : 'three' }];

```

Tudo o que falta é o controlador (**isto vai ser coberto mais tarde neste artigo**). A beleza sobre esta abordagem é que (como você pode ver) o dado (o Modelo) é **100% isolado da marcação** (o View) e os dados podem ser recuperados e armazenados em cache a partir de uma fonte externa, ao ser manipulado e ajustado por um controlador lógico.

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Injeção de Dependências

**Injeção de Dependências (dependency injection - DI)** é, no Angular, o método de organizar quais componentes, módulos e variáveis serão carregados para várias partes da sua aplicação. É um pouco confuso no começo, mas realmente deixam as coisas mais organizadas e faz com que os testes sejam mais fáceis. Todos seus componentes dentro da aplicação são injetados dentro dos seus **controladores**, **configurações de módulo**, **diretivas**, **filtros**, **resources** e **rotas**. Aqui temos um exemplo de injeção de dependências para um controlador:

```javascript

var Ctrl = function ($scope, $http, $location) {
	// agora você pode usar qualquer das variáveis injetadas

	// para mudar a URL depois de algo acontecer então você pode usar $location
	$location.path('/path/to/new/page');
}

// e agora a injeção das variáveis
Ctrl.$inject = ['$scope', '$http', '$location'];

```

O **benefício da DI** é que você pode **isolar totalmente** todos os serviços, controladores, resources, diretivas e filtros dentro de seus próprios ambientes sem variáveis globais. Isto torna os **testes muito fáceis**. Também facilita a ordenação entre blocos de código, onde uma vez que uma dependência em particular tenha sido injetada, então é garantido que esteja lá para uso dentro do próximo bloco de código.

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Rotas

Rotas são usadas para mapear qual caminho está ligado a qual controlador. Quando você acessa uma URL (clicando em um link ou colocando na URL), o Angular vai **primeiro checar e ver se isto está definido** e, se não, então vai **delegar o evendo para uma página padrão** (acessa uma página html normalmente) ou **não faz nada** (se for uma URL com #). Isso é bom pois você não tem que gerenciar qualquer mudança de URL nas rotas do Angular.

Rotas são definidas diretamente do módulo da aplicação com a seguinte sintaxe. **NOTE:** Caminhos de rota não tem nada a ver com hashbangs (**você pode alternar hashbangs ligado ou desligado através do modo HTML5**).

```javascript

App.config(['$routeProvider', function($routes) {
	
	$route.when('/', {
			templateUrl : '/templates/home.html',
			controller : HomeCtrl
		});

	$route.when('/register', {
			templateUrl : '/templates/register.html',
			controller : RegisterCtrl
		});

	$routes.otherwise({
			redirectTo : '/'
		});
}]);

```

Você deve ser capaz de **criar rotas em qualquer lugar no código da sua app** -- isto é bom quando você cria controladores em arquivos JavaScript separados que incluem suas próprias rotas. 

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Controladores e Escopo

Controladores são onde a lógica da aplicação acontece. Plugins, Widgets e código DOM específico **não deve ser incluso aqui pois isso é destinado as diretivas**. Primeiro, comece configurando o controlador (cada função controladora é basicamente a ação em si).

```javascript

var SomeCtrl = function ($scope, $http, $location) {
	$scope.value = 'some value';
};
SomeCtrl.$inject = ['$scope', '$http', '$location'];

```

O **$scope** é especificamente onde o controlador é conectado na sua página web. E qualquer propriedade configurada para a variável $scope vai então ser disponibilizada na suá página. Aqui um exemplo colocando uma ligação (binding) no HTML e então configurando esta propriedade com *scope*.

```html

<div class="header"> {{ title }} </div>

```

Agora aqui o JavaScript:

```javascript

$scope.title = 'this is awesome';

```

Agora o DOM vai ser atualizado e seu código HTML vai parecer com isso:

```html

<div class="header">this is awesome</div>

```

Mais informações na parte das diretivas.

#### Para quando os dados da sua variável $scope muda, mas o Angular não percebe isso.

Algumas vezes o Angular não informa quando você muda uma propriedade em sua variável $scope, então neste caso você deve forçar o Angular a fazer esta mudança.

Tente rodar estes métodos:

```javascript

// vamos dizer que você tenha <div> {{ someVar }} </div> dentro do HTML
$scope.someVar = 'value';

// se um 'scope digestion' já está acontecendo, então ele irá ser pego e você não terá 
// que chamar o método $scope.$apply()
if (!$scope.$$phase) { // isto é usado para prevenir uma sobreposição do scope digestion
	$scope.$apply(); // isto vai iniciar o reconhecimento do Angular da mudança
}

```

Assegure-se de ler mais sobre isto no artigo *More AngularJS Magic to Superchange your Webapp*, que entra em mais detalhes sobre como *digest* e *apply* ligam as mudanças corretamente.

> [Click aqui para ler mais sobre $apply e $digest e veja o artigo](http://www.yearofmoo.com/2012/10/more-angularjs-magic-to-supercharge-your-webapp.html#apply-digest-and-phase)

#### $rootScope

Todo dado **$scope** é herdado da variável $rootScope, então se você quiser **compartilhar código reusável através de todos seus objetos $scope em todos seus controladores então você pode fazer isto configurando propriedades na variável $rootScope**.

```javascript

App.run(['$rootScope', function ($rootScope) {
	$rootScope.sharedFunction = function () { ... };
}]);

```

#### Controladores

Finalmente, aqui temos duas maneiras de registrar um controlador para a aplicação:

**Incluindo o Controlador dentro da aplicação HTML**
Um controlador pode ser configurado usando uma diretiva Angular dentro de uma tag HTML.

```html

<div ng-controller="SomeCtrl"> ... </div>

```

**Atribua um Controlador para ser parte de uma rota**
Você também pode definir uma rota e especificar o controlador que irá manipular a requisição:

```javascript

$routes.when('/some/path', {
	controller : Ctrl,
	templateUrl : '/templates/controller.html'
});

```

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Serviços

Serviços no Angular é uma abordagem incrível para abstrair código e funcionalidades compartilhadas pela sua aplicação. Ele liga diretamente para o recurso de injeção de dependência que o Angular fornece e pode ser usado diretamente à parte do objeto módulo.

```javascript

App.factory('myService', ['myOtherService', '$location', function (myOtherService, $location) {
	return function (input) {
		// faã algo com o input usando os objetos myOtherService ou $location
		return input;
	};
}]);

// use o serviço dentro do controlador
var HomeCtrl = function ($scope, myService) {
	var input = '123';
	input = myService(input);
};
HomeCtrl.$inject = ['$scope', 'myService'];

// use o serviço de uma diretiva
App.directive('myDirective', ['myService', function (myService) {
	return {
		link: function ($scope, element, attrs) {
			var input = '123';
			input = myService(input);
		}
	}
}]);

``` 

O **myService** é fornecido dentro do controlador como uma função (ou objeto dependendo de como a declaração do serviço retorna) e pode ser usado diretamente. A coisa legal é que há um ponto de entrada para o serviço e isso significa que pode ser testado facilmente.

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Modelos

Modelos são usados da mesma forma que são usados em **Rails** ou em qualquer outro **MVC framework**. Eles são também definidos da mesma maneira que os **serviços** angular são bem como são injetados na aplicação. Todas operações regulares *getter* e *setter* para propriedades de modelo existem e todas **operações RESTful** são definidas e acessam o servidor backend para fazer operações de armazenamento. Sua aplicação no lado do servidor precisa ser codificada para manusear cada operação REST para cada modelo (**POST create, GET show, GET index, PUT/PATCH update, DELETE destroy**).

Aqui temos como você define um modelo em Angular:

```javascript

App.factory('ModelName', ['$resource', function ($resource) {
	$resource.url('/path/to/model/controller/:id', {
		id: '@id', // isto liga o ID do modelo com o parâmetro da URL
	}, {
		query : { method : 'GET', isArray : true }, // isto também pode ser chamado index 
		save : { method : 'PUT' }, // este é o método update
		create : { method : 'POST' },
		destroy : { method : 'DELETE' }
	}
}]);

```

Isto vai criar um modelo chamado **ModelName** com as ações REST **query, show, save, create e destroy**, todas voltadas para **/path/to/model/controller/:id**. O parâmetro **:id** é somente usado para **get, save e destroy** as chamadas REST. Quando um valor :id não está presente então isso não vai ser usado na URL e o Angular vai tirar as barras e espaços em branco da URL, então efetivamente você vai ter uma URL como **/path/to/model/controller** para as chamadas REST como as **query** e **create** (que é como REST espera que seja). Todas as ações definidas podem ser chamadas diretamente a partid do modelo, mas em ordem de ter acesso ao modelo como uma variável você deve incluir isso como uma injeção de dependência:

```javascript

var SomeCtrl = function ($scope, $http, $location, ModelName) {
	// agora você pode usar ModelName para fazer suas coisas	
};
SomeCtrl.$inject = ['$scope', '$http', '$location', 'ModelName'];

``` 

Uma vez que você tenha acesso ao modelo, você pode chamar todas as ações que você definiu bem como algumas outras. Aqui alguns exemplos:

```javascript

// lista todos os registros na página
var results = ModelName.query({ search : 'all' }, onSucessFn, onFailureFn);

// pegando um registro específico
var record = ModelName.get({ id : 123 }, onSucessFn, onFailureFn); // onSucessFn and onFailureFn são callbacks opcionais onde você pode adicionar uma resposta personalizada

// cria um novo registro ModelName
var record = new ModelName();

// atualiza o registro
record.someAttr = 'someValue';
record.$save();

// ou se você preferir enviar seus dados de uma forma diferente
ModelName.save({
	id : record.id
}, {
	somePostObject : {
		attr1 : 'value',
		attr2 : 'value2'
	}
});

// destroi o registro (e inclui um token)
record.destroy({ token : record.token });

```

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Diretivas

Diretivas Angular são minúsculos ganchos comportamentais que **ligam seu HTML com seus plugins e com qualquer bloco de código isolado dentro da sua aplicação.** Elas são projetadas não para mudar a lógico dos controladores ou modelos, mas **para ajudar na construção da página web**. Portanto, são perfeitas para **plugins, validadores, propriedades dinâmicas do texto** (tais como ajustes de intercionalização e localização). Aqui vemos como usá-las.

Primeiro defina a diretiva dentro da sua aplicação JavaScript:

```javascript

angular.directive('myDirective', function ($compile) {
	return {
		templateUrl : '/path/to/some/template.html', // (opcional) os conteúdos deste template podem ser baixados e dentro do elemento
		replace : true, // se querem ou não substituir os dados internos dentro do elemento
		link : function ($scope, $element, attributes) { // aqui é onde acontece a mágica
			$scope.title = '...';
		}
	};
});

```

Agora quando o Angular vê uma tag HTML que contém **my-directive** como um atributo (com ou sem um valor), então isto vai baixar um template e executar a função link. Você pode também definir o **template html** diretamente e pode criar sua própria função de compilação que faz todo o trabalho de uma vez. A variável **$scope** dentro da função link é a variável de escopo do controlador que contém a diretiva. Esta á uma poderosa maneira de compartilhar dados entre os controladores e a diretiva como também para comunicar-se entre cada um deles. 

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Filtros

Filtros são operações reutilizáveis que podem estar inseridas diretamente dentro de *binding operations* (operações de ligação) para ajustar dados de uma forma. Alguns exemplos incluem **paginação, ajuste de idioma, papel e filtragem de dados específicos da sessão**.

```javascript

App.filter('myUppercase', function (data) {
	for (var i = 0; i < data.length; i += 1) {
		data[i].title = data[i].title.toUpperCase();
	}
	return data;
});

```

Este filtro então pode ser usado dentro de uma expressão Angular:

```html

<div ng-repeat="for record in records | filter:myUppercase">...</div>

```

Ou pode ser usado diretamente dentro de seu código JavaScript com a função **$filter**.

```javascript

// assegure-se de injetar o objeto $filter
var values = ['one', 'two', 'three'];
values = $filter('myUppercase')(values);

```

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Modo HTML5

O modo HTML5 permite para sua app Angular usar histórico HTML5 dentro do sistema de roteamento e então graciosamente degradar a sua funcionalidade para suporte de hash se o navegador não suportar histórico HTML5. O fragmente seguinte de código permite o histórico HTML5 dentro da sua aplicação Angular (ela é desativada por padrão).

```javascript

App.config(['$locationProvider', function ($location) {
	$location.html5mode(true); // agora não haverá uma hashbang dentro de URLs para browsers que suportam histórico HTML5
}]);

```

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Usando Angular com outro framework JavaScript/bibliotecas

Angular usa JQLite para fazer a manipulação básica DOM e não depende de jQuery.

#### Usando Angular com jQuery

jQuery trabalha bem com Angular. Somente **inclua-o antes de incluir o Angular dentro de sua aplicação web** e o Angular vai usar seu jQuery incluso ao invés do JQLite.

#### Usando Angular com MooTools

MooTools também trabalha bem, mas há alguns problemas quando acessamos elementos. Você vai precisar criar seu próprio seletor *dollar-style* (ou sobrescrever o existente). Também, certifique-se de **incluir o MooTools dentro da sua aplicação depois do Angular ter sido incluso**.

```javascript

var $moo = function (element) {
	if (typeOf(element) != 'element' && element.length >= 1) {
		element = element[0];
	}
	if (element) {
		return document.id(element);
	}
};

```

Isto faz o Angular funcionar com MooTools; esteja certo de usar o método **$moo** cada vez antes de acessar um elemento que fora fornecido por um controlador ou diretiva do Angular. A função dolar duplo (**$$**) não é afetada, mas chama o método **$moo** antes de você usar o **$$** para acessar um elemento diretamente (desde que um elemento fornecido do Angular possa ser um array e que possa bagunçar as coisas).

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Usando .json como um sufixo URL para operações de modelo



##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Daqui para frente

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)

### Segundo artigo sobre AngularJS

##### [⬆ para o topo](https://github.com/eoop/traduz-ai/blob/master/angularjs/003-use-angularjs-para-potencializar-sua-webapp.md#use-angularjs-para-potencializar-suas-aplica%C3%A7%C3%B5es-web)
