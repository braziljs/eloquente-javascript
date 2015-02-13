## Projeto - Website de compartilhamento de habilidades

Uma reunião de compartilhamento de habilidades é um evento onde as pessoas com um interesse comum se juntam e dão pequenas apresentações informais sobre coisas que eles sabem. Em uma reunião de compartilhamento de habilidade de jardinagem alguém pode explicar como cultivar um Aipo. Ou em um grupo de compartilhamento de habilidades orientadas para a programação você poderia aparecer e dizer a todos sobre Node.js.

Tais meetups muitas vezes também chamados grupos de usuários quando eles estão falando sobre computadores. Isso é uma ótima maneira de aprofundar o seu horizonte e aprender sobre novos desenvolvimentos ou simplesmente reunir pessoas com interesses semelhantes. Muitas cidades grandes têm um meetup JavaScript. Eles são tipicamente livre para assistir e eu visitei uma que é amigável e acolhedora.

Neste último capítulo do projeto, o nosso objetivo é a criação de um site para gerenciar estas conversas dadas em um encontro de compartilhamento de habilidade. Imagine um pequeno grupo de pessoas que se encontra regularmente no escritório de um dos membros para falar sobre Monociclo. O problema é que quando um organizador de alguma reunião anterior se mudar para outra cidade, ninguém se apresentara para assumir esta tarefa. Queremos um sistema que permite que os participantes proponha e discuta as negociações entre si sem um organizador central.

![](http://i.imgur.com/2rIVEWv.png)

Assim como no capítulo anterior, o código neste capítulo é escrito em Node.js, e executá-lo diretamente em uma página HTML é improvável que funcione. O código completo para o projeto pode ser baixado [aqui](eloquentjavascript.net/code/skillsharing.zip).

#### Projeto

Há uma parte do servidor para este projeto escrito em Node.js e uma parte do cliente escrito para o browser. O servidor armazena os dados do sistema e fornece-o para o cliente. Ela também serve os arquivos HTML e JavaScript que implementam o sistema do lado do cliente.

O servidor mantém uma lista de conversas propostas para a próxima reunião e o cliente mostra esta lista. Cada palestra tem um nome do apresentador, um título, um resumo e uma lista de comentários associados. O cliente permite que os usuários proponha novas conversações(adicionando-os à lista), exclua as negociações, e comente sobre as negociações existentes. Sempre que o usuário faz tal mudança o cliente faz uma solicitação HTTP para informar para o servidor o que fazer.

![](http://eloquentjavascript.net/img/skillsharing.png)

O aplicativo será configurada para mostrar uma exibição em tempo real das atuais conversações propostas e seus comentários. Sempre que alguém apresentar uma nova conversa ou adiciona um comentário, todas as pessoas que têm a página aberta no navegador deve ver a mudança imediatamente. Isto coloca um pouco de um desafio, pois não há caminho para um servidor web abrir uma conexão com um cliente nem há uma boa maneira de saber o que os clientes está olhando atualmente no site.

Uma solução comum para este problema é chamado de `long polling`, que passa a ser uma das motivações para o projeto ser em Node.

#### Long polling

Para ser capaz de se comunicar imediatamente com um cliente que algo mudou precisamos de uma conexão com esses clientes. Desde navegadores não tradicionais, geralmente os dispositivos por trás bloqueiam de qualquer maneira tais conexões aceitas pelo cliente, toda essa ligação deve ser feita via servidor, o que não é muito prático.

Nós podemos mandar o cliente abrir a conexão e mantê-la de modo que o servidor possa usá-la para enviar informações quando for preciso.

Uma solicitação HTTP permite apenas um fluxo simples de informações, onde o cliente envia a solicitação e o servidor devolve uma única resposta. Há uma tecnologia chamada soquetes web, suportado pelos navegadores modernos o que torna possível abrir as ligações para a troca de dados arbitrária. É um pouco difícil usá-las corretamente.

Neste capítulo vamos utilizar uma técnica relativamente simples, `long polling`, onde os clientes continuamente pediram ao servidor para obter novas informações usando solicitações HTTP e o servidor simplesmente barrara sua resposta quando ele não tem nada de novo para relatar.

Enquanto o cliente torna-se constantemente um `long polling` aberto, ele ira receber informações do servidor imediatamente. Por exemplo, se Alice tem o nosso aplicativo de compartilhamento de habilidade aberta em seu navegador, o navegador terá feito um pedido de atualizações e estara a espera de uma resposta a esse pedido. Quando Bob submeter uma palestra sobre a `extrema Downhill Monociclo` o servidor vai notificar que Alice está esperando por atualizações e enviar essas informações sobre a nova conversa como uma resposta ao seu pedido pendente. Navegador de Alice receberá os dados e atualizara a tela para mostrar a conversa.

Para evitar que as conexões excedam o tempo limite(sendo anulado por causa de uma falta de atividade), podemos definir uma técnica que normalmente define um tempo máximo para cada pedido do `long polling`; após esse tempo o servidor irá responder de qualquer maneira, mesmo que ele não tem nada a relatar, e o cliente inicia um novo pedido. Reiniciar o pedido periodicamente torna a técnica mais robusta a qual permite aos clientes se recuperarem de falhas de conexão temporárias ou de problemas no servidor.

Um servidor que esta ocupado usando `long polling` pode ter milhares de pedidos em espera com conexões TCP em aberto. Node torna fácil de gerenciar muitas conexões sem criar uma thread separada de controle para cada uma, sendo assim uma boa opção para esse sistema.

#### Interface HTTP

Antes de começarmos a comunicar servidor e cliente, vamos pensar sobre o ponto em que se tocam: a interface HTTP sobre as quais eles se comunicam.

Vamos basear nossa interface em JSON e como vimos no servidor de arquivos a partir do capítulo 20; vamos tentar fazer um bom uso de métodos HTTP. A interface é centrado em torno do path `/talks`. `Paths` que não começam com `/talks` serão usado para servir arquivos estáticos como: código HTML, JavaScript, que implementam o sistema do lado do cliente.

A solicitação do tipo GET para `/talks` devolve um documento JSON como este:

```json
{"serverTime": 1405438911833,
 "talks": [{"title": "Unituning",
            "presenter": "Carlos",
            "summary": "Modifying your cycle for extra style",
            "comment": []}]}
```

O campo `serverTime` vai ser usado para fazer sondagem de `long polling`. Voltarei a isso mais tarde.

Para criar um novo talk é preciso uma solicitação do tipo PUT para a URL `/talks/unituning/`, onde após a segunda barra é o título da palestra. O corpo da solicitação PUT deve conter um objeto JSON que tem o apresentador e o sumário como propriedade do corpo da solicitação.

O títulos da palestra pode conter espaços e outros caracteres que podem não aparecerem normalmente em um URL, a `string` do título deve ser codificado com a função `encodeURIComponent` ao construir a URL.

```js
console.log("/talks/" + encodeURIComponent("How to Idle"));
// → /talks/How%20to%20Idle
```

O pedido de criação de uma palestra é parecido com isto:

```js
PUT /talks/How%20to%20Idle HTTP/1.1
Content-Type: application/json
Content-Length: 92

{"presenter": "Dana",
 "summary": "Standing still on a unicycle"}
```

Essas URLs também suportam requisições GET para recuperar a representação do JSON de uma palestra ou DELETE para solicitações de exclusão de uma palestra.

Adicionando um comentário a uma conversa é feito com uma solicitação POST para uma URL `/talks/Unituning/comments` com um objeto JSON que tem o autor e a mensagem como propriedades do corpo da solicitação.

```js
POST /talks/Unituning/comments HTTP/1.1
Content-Type: application/json
Content-Length: 72

{"author": "Alice",
 "message": "Will you talk about raising a cycle?"}
```

Para apoio ao `long polling`, pedidos GET para `/talks` podem incluir um parâmetro de consulta chamado `changesSince`, ele sera usado para indicar que o cliente está interessado em atualizações que aconteceram desde de um determinado tempo. Quando existem tais mudanças eles são imediatamente devolvidos. Quando não há a resposta é adiada até que algo aconteça ou até que um determinado período de tempo(vamos usar 90 segundos) for decorrido.

O tempo deve ser indicado em números em milissegundos decorridos desde do início de 1970, o mesmo tipo de número que é retornado por `Date.now()`. Para garantir que ele recebe todas as atualizações e não recebe a mesma atualização mais de uma vez o cliente deve passar o tempo da última informação recebida do servidor. O relógio do servidor pode não ser exatamente sincronizado com o relógio do cliente e mesmo se fosse seria impossível para o cliente saber a hora exata em que o servidor enviou uma resposta porque a transferência de dados através de rede leva um tempo.

Esta é a razão da existência da propriedade `serverTime` em respostas enviadas a pedidos GET para `/talks`. Essa propriedade diz ao cliente o tempo preciso do servidor em que os dados recebidos foram criados. O cliente pode então simplesmente armazenar esse tempo e passá-los no seu próximo pedido de `polling` para certificar de que ele recebe exatamente as atualizações que não tenha visto antes.

```js
GET /talks?changesSince=1405438911833 HTTP/1.1

(time passes)

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 95

{"serverTime": 1405438913401,
 "talks": [{"title": "Unituning",
            "deleted": true}]}
```

Quando a palestra for alterada, criada recentemente ou tem um comentário adicional; a representação completa da palestra estara incluída na próxima resposta de solicitação na busca do cliente. Quando a conversa é excluída somente o seu título e a propriedade excluído estão incluídos. O cliente pode então adicionar as negociações com títulos que não tenha visto antes de sua exibição, atualização fala que já estava mostrando, e remover aquelas que foram excluídas.

O protocolo descrito neste capítulo não ira fazer qualquer controle de acesso. Todos podem comentar, modificar fala, e até mesmo excluí-los. Uma vez que a Internet está cheia de arruaceiros colocando um tal sistema on-line sem proteção adicional é provável que acabe em um desastre.

Uma solução simples seria colocar o sistema de proxy reverso por trás, o que é um servidor HTTP que aceita conexões de fora do sistema e os encaminha para servidores HTTP que estão sendo executados localmente. O proxy pode ser configurado para exigir um nome de usuário e senha, você pode ter certeza de que somente os participantes do grupo de compartilhamento de habilidade teram essa senha.

#### O serviço


Vamos começar a escrever código do lado do servidor. O código desta seção é executado em Node.js.

#### Roteamento

O nosso servidor irá utilizar `http.createServer` para iniciar um servidor de HTTP. Na função que lida com um novo pedido, iremos distinguir entre os vários tipos de solicitações(conforme determinado pelo método e o `path`) que suportamos. Isso pode ser feito com uma longa cadeia de `if` mas há uma maneira mais agradável.

As rotas é um componente que ajuda a enviar uma solicitação através de uma função. Você pode dizer para as rotas que os pedidos combine com um caminho usando expressão regular `/^\/talks\/([^\/]+)$/`(que corresponde a `/talks/` seguido pelo título) para ser tratado por uma determinada função. Isso pode ajudar a extrair as partes significativas de um `path`, neste caso o título da palestra, que estara envolto entre os parênteses na expressão regular, após disto é passado para o manipulador de função.

Há uma série de bons pacotes de roteamento na NPM mas vamos escrever um nós mesmos para ilustrar o princípio.

Este é router.js que exigirá mais tarde do nosso módulo de servidor:

```js
var Router = module.exports = function() {
  this.routes = [];
};

Router.prototype.add = function(method, url, handler) {
  this.routes.push({method: method,
                    url: url,
                    handler: handler});
};

Router.prototype.resolve = function(request, response) {
  var path = require("url").parse(request.url).pathname;

  return this.routes.some(function(route) {
    var match = route.url.exec(path);
    if (!match || route.method != request.method)
      return false;

    var urlParts = match.slice(1).map(decodeURIComponent);
    route.handler.apply(null, [request, response]
                                .concat(urlParts));
    return true;
  });
};
```

O módulo exporta o construtor de `Router`. Um objeto de `Router` permite que novos manipuladores sejam registados com o método `add` e resolver os pedidos com o método `resolve`.

Este último irá retornar um `booleano` que indica se um manipulador foi encontrado. Há um método no conjunto de rotas que tenta as rotas um de cada vez(na ordem em que elas foram definidos) e retorna a verdadeira quando alguma for correspondida.

As funções de manipulação são chamadas com os objetos de solicitação e resposta. Quando a expressão regular que corresponde a URL contém algum grupo, as `string` que correspondem são passadas para o manipulador como argumentos extras. Essas seqüências tem que ser URL decodificada tendo a URL codificada assim `%20-style code`.

#### Servindo arquivos

Quando um pedido não corresponde a nenhum dos tipos de solicitação que esta definidos em nosso `router` o servidor deve interpretá-lo como sendo um pedido de um arquivo que esta no diretório público. Seria possível usar o servidor de arquivos feito no Capítulo 20 para servir esses arquivos; nenhuma destas solicitações sera do tipo `PUT` e `DELETE`, nós gostaríamos de ter recursos avançados como suporte para armazenamento em cache. Então vamos usar um servidor de arquivo estático a partir de uma NPM.

Optei por `ecstatic`. Este não é o único tipo de servidor NPM, mas funciona bem e se encaixa para nossos propósitos. O módulo de `ecstatic` exporta uma função que pode ser chamado com um objeto de configuração para produzir uma função de manipulação de solicitação. Nós usamos a opção `root` para informar ao servidor onde ele devera procurar pelos arquivos. A função do manipulador aceita solicitação e resposta através de parâmetros e pode ser passado diretamente para `createServer` onde é criado um servidor que serve apenas arquivos. Primeiro verificamos se a solicitações não ha nada de especial, por isso envolvemos em uma outra função.

```js
var http = require("http");
var Router = require("./router");
var ecstatic = require("ecstatic");

var fileServer = ecstatic({root: "./public"});
var router = new Router();

http.createServer(function(request, response) {
  if (!router.resolve(request, response))
    fileServer(request, response);
}).listen(8000);
```

`response` e `respondJSON` serão funções auxiliaras utilizadas em todo o código do server para ser capaz de enviar as respostas com uma única chamada de função.

```js
function respond(response, status, data, type) {
  response.writeHead(status, {
    "Content-Type": type || "text/plain"
  });
  response.end(data);
}

function respondJSON(response, status, data) {
  respond(response, status, JSON.stringify(data),
          "application/json");
}
```
