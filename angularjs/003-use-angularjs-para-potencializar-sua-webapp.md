# Use AngularJS para Potencializar suas Aplicações Web

* **Postado originalmente em [yearofmoo.com](http://www.yearofmoo.com/2012/08/use-angularjs-to-power-your-web-application.html)**
* **data de postagem da tradução:** 

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
05. [Módulos]()
06. [Bindings, Expressões e Mágica do Angular]()
07. [Injeção de Dependências]()
08. [Rotas]()
09. [Controladores e Escopo]()
10. [Serviçõs]()
11. [Modelos]()
12. [Diretivas]()
13. [Filtros]()
14. [Modo HTML5]()
15. [Usando Angular com outro framework JavaScript/bibliotecas]()
16. [Usando .json como um sufixo URL para operações de modelo]()
17. [Daqui para frente]()
18. [Segundo artigo sobre AngularJS]()

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