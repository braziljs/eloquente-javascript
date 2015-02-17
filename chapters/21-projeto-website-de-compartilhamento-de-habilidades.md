## Projeto - Website de compartilhamento de habilidades

Uma reunião de compartilhamento de habilidades é um evento onde as pessoas com um interesse comum se juntam e dão pequenas apresentações informais sobre coisas que eles sabem. Em uma reunião de compartilhamento de habilidade de jardinagem alguém pode explicar como cultivar um Aipo. Ou em um grupo de compartilhamento de habilidades orientadas para a programação você poderia aparecer e dizer a todos sobre Node.js.

Tais meetups muitas vezes também chamados grupos de usuários quando eles estão falando sobre computadores. Isso é uma ótima maneira de aprofundar o seu horizonte e aprender sobre novos desenvolvimentos ou simplesmente reunir pessoas com interesses semelhantes. Muitas cidades grandes têm um meetup JavaScript. Eles são tipicamente livre para assistir e eu visitei uma que é amigável e acolhedora.

Neste último capítulo do projeto, o nosso objetivo é a criação de um site para gerenciar estas palestras dadas em um encontro de compartilhamento de habilidade. Imagine um pequeno grupo de pessoas que se encontra regularmente no escritório de um dos membros para falar sobre Monociclo. O problema é que quando um organizador de alguma reunião anterior se mudar para outra cidade, ninguém se apresentara para assumir esta tarefa. Queremos um sistema que permite que os participantes proponha e discuta as palestras entre si sem um organizador central.

![](http://i.imgur.com/2rIVEWv.png)

Assim como no capítulo anterior, o código neste capítulo é escrito em Node.js, e executá-lo diretamente em uma página HTML é improvável que funcione. O código completo para o projeto pode ser baixado [aqui](eloquentjavascript.net/code/skillsharing.zip).

#### Projeto

Há uma parte do servidor para este projeto escrito em Node.js e uma parte do cliente escrito para o browser. O servidor armazena os dados do sistema e fornece para o cliente. Ela também serve os arquivos HTML e JavaScript que implementam o sistema do lado do cliente.

O servidor mantém uma lista de palestras propostas para a próxima reunião e o cliente mostra esta lista. Cada palestra tem um nome do apresentador, um título, um resumo e uma lista de comentários dos participantes. O cliente permite que os usuários proponha novas palestras(adicionando a lista), exclua as palestras, e comente sobre as palestras existentes. Sempre que o usuário faz tal mudança o cliente faz uma solicitação HTTP para informar para o servidor o que fazer.

![](http://eloquentjavascript.net/img/skillsharing.png)

O aplicativo será configurada para mostrar uma exibição em tempo real das atuais palestras propostas e seus comentários. Sempre que alguém apresentar uma nova palestra ou adiciona um comentário, todas as pessoas que têm a página aberta no navegador deve ver a mudança imediatamente. Isto coloca um pouco de um desafio, pois não há `path` para um servidor web abrir uma conexão com um cliente nem há uma boa maneira de saber o que os clientes está olhando atualmente no site.

Uma solução comum para este problema é chamado de `long polling`, que passa a ser uma das motivações para o projeto ser em Node.

#### Long polling

Para ser capaz de se comunicar imediatamente com um cliente que algo mudou precisamos de uma conexão com esses clientes. Desde navegadores não tradicionais, geralmente os dispositivos por trás bloqueiam de qualquer maneira tais conexões aceitas pelo cliente, toda essa ligação deve ser feita via servidor, o que não é muito prático.

Nós podemos mandar o cliente abrir a conexão e mantê-la de modo que o servidor possa usá-la para enviar informações quando for preciso.

Uma solicitação HTTP permite apenas um fluxo simples de informações, onde o cliente envia a solicitação e o servidor devolve uma única resposta. Há uma tecnologia chamada soquetes web, suportado pelos navegadores modernos o que torna possível abrir as ligações para a troca de dados arbitrária. É um pouco difícil usá-las corretamente.

Neste capítulo vamos utilizar uma técnica relativamente simples, `long polling`, onde os clientes continuamente pediram ao servidor para obter novas informações usando solicitações HTTP e o servidor simplesmente barrara sua resposta quando ele não tem nada de novo para relatar.

Enquanto o cliente torna-se constantemente um `long polling` aberto, ele ira receber informações do servidor imediatamente. Por exemplo, se Alice tem o nosso aplicativo de compartilhamento de habilidade aberta em seu navegador, o navegador terá feito um pedido de atualizações e estara a espera de uma resposta a esse pedido. Quando Bob submeter uma palestra sobre a `extrema Downhill Monociclo` o servidor vai notificar que Alice está esperando por atualizações e enviar essas informações sobre a nova palestra como uma resposta ao seu pedido pendente. Navegador de Alice receberá os dados e atualizara a tela para mostrar a palestra.

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

Adicionando um comentário a uma palestra é feito com uma solicitação POST para uma URL `/talks/Unituning/comments` com um objeto JSON que tem o autor e a mensagem como propriedades do corpo da solicitação.

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

Quando a palestra for alterada, criada recentemente ou tem um comentário adicional; a representação completa da palestra estara incluída na próxima resposta de solicitação na busca do cliente. Quando a palestra é excluída somente o seu título e a propriedade excluído estão incluídos. O cliente pode então adicionar as palestras com títulos que não tenha visto antes de sua exibição, atualização fala que já estava mostrando, e remover aquelas que foram excluídas.

O protocolo descrito neste capítulo não ira fazer qualquer controle de acesso. Todos podem comentar, modificar fala, e até mesmo excluí-los. Uma vez que a Internet está cheia de arruaceiros colocando um tal sistema on-line sem proteção adicional é provável que acabe em um desastre.

Uma solução simples seria colocar o sistema de proxy reverso por trás, o que é um servidor HTTP que aceita conexões de fora do sistema e os encaminha para servidores HTTP que estão sendo executados localmente. O proxy pode ser configurado para exigir um nome de usuário e senha, você pode ter certeza de que somente os participantes do grupo de compartilhamento de habilidade teram essa senha.

#### O serviço


Vamos começar a escrever código do lado do servidor. O código desta seção é executado em Node.js.

#### Roteamento

O nosso servidor irá utilizar `http.createServer` para iniciar um servidor de HTTP. Na função que lida com um novo pedido, iremos distinguir entre os vários tipos de solicitações(conforme determinado pelo método e o `path`) que suportamos. Isso pode ser feito com uma longa cadeia de `if` mas há uma maneira mais agradável.

As rotas é um componente que ajuda a enviar uma solicitação através de uma função. Você pode dizer para as rotas que os pedidos combine com um `path` usando expressão regular `/^\/talks\/([^\/]+)$/`(que corresponde a `/talks/` seguido pelo título) para ser tratado por uma determinada função. Isso pode ajudar a extrair as partes significativas de um `path`, neste caso o título da palestra, que estara envolto entre os parênteses na expressão regular, após disto é passado para o manipulador de função.

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

#### Recursos de palestras

O servidor mantém as palestras que têm sido propostas em um objeto chamado `talks`, cujos nomes são propriedades de títulos de um `talk`. Estes serão expostos como recursos HTTP sob `/talks/[title]` e por isso precisamos adicionar manipuladores ao nosso roteador que implementara vários métodos que podem serem utilizados pelo os clientes.

O manipulador de solicitações serve uma única resposta, quer seja alguns dados do tipo `JSON` da palestra, uma resposta de 404 ou um erro.

```js
var talks = Object.create(null);

router.add("GET", /^\/talks\/([^\/]+)$/,
           function(request, response, title) {
  if (title in talks)
    respondJSON(response, 200, talks[title]);
  else
    respond(response, 404, "No talk '" + title + "' found");
});
```

A exclusão de um `talk` é feito para remove-lo do objeto palestras.

```js
router.add("DELETE", /^\/talks\/([^\/]+)$/,
           function(request, response, title) {
  if (title in talks) {
    delete talks[title];
    registerChange(title);
  }
  respond(response, 204, null);
});
```

A função `registerChange` que iremos definir; notifica alterações enviando uma solicitação de log polling ou simplemente espera.

Para ser capaz de obter facilmente o conteúdo do `body` de uma solicitação de  `JSON` codificado teremos que definir uma função chamada `readStreamAsJSON` que lê todo o conteúdo de um `stream`, analisa o `JSON` e em seguida chama uma função de retorno.

```js
function readStreamAsJSON(stream, callback) {
  var data = "";
  stream.on("data", function(chunk) {
    data += chunk;
  });
  stream.on("end", function() {
    var result, error;
    try { result = JSON.parse(data); }
    catch (e) { error = e; }
    callback(error, result);
  });
  stream.on("error", function(error) {
    callback(error);
  });
}
```

Um manipulador que precisa ler respostas JSON é o manipulador PUT que é usado para criar novas palestras. Nesta `request` devemos verificar se os dados enviados tem um apresentador e propriedades de sumárias, ambos so tipo strings. Quaisquer dados que vêm de fora do sistema pode conter erros e nós não queremos corromper o nosso modelo de dados interno ou mesmo travar quando os pedidos ruins entrarem.

Se os dados se parece válido o manipulador armazena um objeto que representa uma nova palestra no objeto, possivelmente substituindo uma palestra existente com este título e mais uma vez chama `registerChange`.

```js
router.add("PUT", /^\/talks\/([^\/]+)$/,
           function(request, response, title) {
  readStreamAsJSON(request, function(error, talk) {
    if (error) {
      respond(response, 400, error.toString());
    } else if (!talk ||
               typeof talk.presenter != "string" ||
               typeof talk.summary != "string") {
      respond(response, 400, "Bad talk data");
    } else {
      talks[title] = {title: title,
                      presenter: talk.presenter,
                      summary: talk.summary,
                      comments: []};
      registerChange(title);
      respond(response, 204, null);
    }
  });
});
```

Para adicionar um comentário a uma palestra, funciona de forma semelhante. Usamos `readStreamAsJSON` para obter o conteúdo do pedido, validar os dados resultantes e armazená-los como um comentário quando for válido.

```js
router.add("POST", /^\/talks\/([^\/]+)\/comments$/,
           function(request, response, title) {
  readStreamAsJSON(request, function(error, comment) {
    if (error) {
      respond(response, 400, error.toString());
    } else if (!comment ||
               typeof comment.author != "string" ||
               typeof comment.message != "string") {
      respond(response, 400, "Bad comment data");
    } else if (title in talks) {
      talks[title].comments.push(comment);
      registerChange(title);
      respond(response, 204, null);
    } else {
      respond(response, 404, "No talk '" + title + "' found");
    }
  });
});
```

Ao tentar adicionar um comentário a uma palestra inexistente é claro que devemos retornar um erro 404.

#### Apoio a long polling

O aspecto mais interessante do servidor é a parte que trata de `long polling`. Quando uma requisição GET chega para `/talks` pode ser um simples pedido de todas as palestras ou um pedido de atualização com um parâmetro `changesSince`.

Haverá várias situações em que teremos que enviar uma lista de palestra para o cliente de modo que primeiro devemos definir uma pequena função auxiliar que atribuira um campo `servertime` para tais respostas.

```js
function sendTalks(talks, response) {
  respondJSON(response, 200, {
    serverTime: Date.now(),
    talks: talks
  });
}
```

O manipulador precisa olhar para os parâmetros de consulta da URL do pedido para ver se um parâmetro `changesSince` foi dado. Se você entregar a `url` para o módulo da função `parse` teremos um segundo argumento que sera `true`; também teremos que analisar parte por parte de uma URL. Se o objeto que ele retornou tem uma propriedade `query` matemos o outro objeto que mapeia os parâmetros de nomes para os valores.

```js
router.add("GET", /^\/talks$/, function(request, response) {
  var query = require("url").parse(request.url, true).query;
  if (query.changesSince == null) {
    var list = [];
    for (var title in talks)
      list.push(talks[title]);
    sendTalks(list, response);
  } else {
    var since = Number(query.changesSince);
    if (isNaN(since)) {
      respond(response, 400, "Invalid parameter");
    } else {
      var changed = getChangedTalks(since);
      if (changed.length > 0)
         sendTalks(changed, response);
      else
        waitForChanges(since, response);
    }
  }
});
```

Quando o parâmetro `changesSince` não é enviado, o manipulador simplesmente acumula uma lista de todas as palestras e retorna.

Caso contrário o parâmetro `changeSince` tem que ser verificado primeiro para certificar de que é um número válido. A função `getChangedTalks` a ser definido em breve retorna uma matriz de palestras que mudaram desde um determinado tempo. Se retornar um `array` vazio significa que o servidor ainda não tem nada para armazenar no objeto de resposta e enviar de volta para o cliente(usando `waitForChanges`), o que pode também ser respondida em um momento posterior.

```js
var waiting = [];

function waitForChanges(since, response) {
  var waiter = {since: since, response: response};
  waiting.push(waiter);
  setTimeout(function() {
    var found = waiting.indexOf(waiter);
    if (found > -1) {
      waiting.splice(found, 1);
      sendTalks([], response);
    }
  }, 90 * 1000);
}
```

O método `splice` é utilizado para cortar um pedaço de uma matriz. Você dá um índice e uma série de elementos para transforma a matriz removendo o restante do elementos após o índice dado. Neste caso nós removemos um único elemento o objeto que controla a resposta de espera cujo índice encontramos chamando `indexOf`. Se você passar argumentos adicionais para `splice` seus valores serão inseridas na matriz na posição determinada substituindo os elementos removidos.

Quando um objeto de resposta é armazenado na matriz de espera o tempo de espera é ajustado imediatamente. Passados 90 segundos o tempo limite vê se o pedido está ainda à espera e se for, envia uma resposta vazia e remove a espera a partir da matriz.

Para ser capaz de encontrar exatamente essas palestras que foram alterados desde um determinado ponto no tempo precisamos acompanhar o histórico de alterações. Registrando uma mudança com `registerChange` podemos escutar as mudança juntamente com o tempo atual em um `array` chamado de `waiting`. Quando ocorre uma alteração isso significa que há novos dados, então todos os pedidos em espera podem serem respondidos imediatamente.

```js
var changes = [];

function registerChange(title) {
  changes.push({title: title, time: Date.now()});
  waiting.forEach(function(waiter) {
    sendTalks(getChangedTalks(waiter.since), waiter.response);
  });
  waiting = [];
}
```

Finalmente `getChangedTalks` podera usar a matriz de mudanças para construir uma série de palestras alteradas,incluindo no objetos uma propriedade de `deleted` para as palestras que não existem mais. Ao construir essa matriz `getChangedTalks` tem de garantir que ele não incluiu a mesma palestra duas vezes; isso pode acontecer se houver várias alterações em uma palestra desde o tempo dado.

```js
function getChangedTalks(since) {
  var found = [];
  function alreadySeen(title) {
    return found.some(function(f) {return f.title == title;});
  }
  for (var i = changes.length - 1; i >= 0; i--) {
    var change = changes[i];
    if (change.time <= since)
      break;
    else if (alreadySeen(`change.title))
      continue;
    else if (change.title in talks)
      found.push(talks[change.title]);
    else
      found.push({title: change.title, deleted: true});
  }
  return found;
}
```

Aqui concluimos o código do servidor. Executando o programa definido até agora você vai ver um servidor rodando na porta `8000` que serve arquivos do subdiretório `public` ao lado de uma interface de gerenciamento de palestras sob a URL `/talks`.

#### O cliente

A parte do cliente é onde vamos gerenciar as palestras, basicamente isso consiste em três arquivos: uma página HTML, uma folha de estilo e um arquivo JavaScript.

#### HTML

Servir arquivos com o nome de `index.html` é uma convenção amplamente utilizado para servidores web quando uma solicitação é feita diretamente para um `path` que corresponde a um diretório. O módulo de um servidor de arquivos que usamos, `ecstatic`, suporta esta convenção. Quando um pedido é feito para o `path` `/` o servidor procura pelo arquivo em `./public/index.html`(`./public` é a raiz que especificamos) e retorna esse arquivo se for encontrado.

Se quisermos uma página para mostrar quando um navegador está apontado para o nosso servidor, devemos coloca-la em `public/index.html`. Esta é a maneira que o nosso arquivo `index` começa:

```html
<!doctype html>

<title>Skill Sharing</title>
<link rel="stylesheet" href="skillsharing.css">

<h1>Skill sharing</h1>

<p>Your name: <input type="text" id="name"></p>

<div id="talks"></div>
```

Ele define o título do documento e inclui uma folha de estilo que define alguns estilos, adicionei uma borda em torno de palestras. Em seguida ele adiciona um `input` de nome. É esperado que o usuário coloque seu nome para que ele possa ser redirecionado para observação das palestras.

O elemento `<div>` com o `id` "talks" conterá a lista atual de todas as palestras. O script preenche a lista quando recebe as palestras do servidor.

Segue o formulário que é usado para criar uma nova palestra:

```html
<form id="newtalk">
  <h3>Submit a talk</h3>
  Title: <input type="text" style="width: 40em" name="title">
  <br>
  Summary: <input type="text" style="width: 40em" name="summary">
  <button type="submit">Send</button>
</form>
```

Um script irá adicionar um manipulador de eventos de `"submit"`  para este formulário, a partir do qual ele pode fazer a solicitação HTTP que informa ao servidor sobre a palestra.

Em seguida, vem um bloco bastante misterioso, que tem seu estilo de exibição definido como `none`, impedindo que ele apareça na página. Você consegue adivinhar para o que é?

```html
<div id="template" style="display: none">
  <div class="talk">
    <h2>{{title}}</h2>
    <div>by <span class="name">{{presenter}}</span></div>
    <p>{{summary}}</p>
    <div class="comments"></div>
    <form>
      <input type="text" name="comment">
      <button type="submit">Add comment</button>
      <button type="button" class="del">Delete talk</button>
    </form>
  </div>
  <div class="comment">
    <span class="name">{{author}}</span>: {{message}}
  </div>
</div>
```

Criar estruturas de DOM complicadas com JavaScript produz código feio. Você pode tornar o código um pouco melhor através da introdução de funções auxiliares como a função `elt` do capítulo 13, mas o resultado ainda vai ficar pior do que no HTML, que pode ser pensado como uma linguagem de domínio específico para expressar estruturas DOM.

Para criar uma estrutura DOM para as palestras, o nosso programa vai definir um sistema de `templates` simples, que utiliza estruturas DOM escondidos incluídos no documento para instanciar novas estruturas DOM, substituindo os espaços reservados entre chaves duplas para os valores de uma palestra específica.

Por fim, o documento HTML inclui um arquivo de `script` que contém o código do lado do cliente.

```html
<script src="skillsharing_client.js"></script>
```

#### O inicio

A primeira coisa que o cliente tem que fazer quando a página é carregada é pedir ao servidor um conjunto atual de palestras. Uma vez que estamos indo fazer um monte de solicitações `HTTP`, vamos novamente definir um pequeno invólucro em torno `XMLHttpRequest`, que aceita um objeto para configurar o pedido, bem como um callback para chamar quando o pedido for concluído.

```js
function request(options, callback) {
  var req = new XMLHttpRequest();
  req.open(options.method || "GET", options.pathname, true);
  req.addEventListener("load", function() {
    if (req.status < 400)
      callback(null, req.responseText);
    else
      callback(new Error("Request failed: " + req.statusText));
  });
  req.addEventListener("error", function() {
    callback(new Error("Network error"));
  });
  req.send(options.body || null);
}
```

O pedido inicial mostra as palestras que recebe na tela e inicia o processo de `long polling` chamando `waitForChanges`.

```js
var lastServerTime = 0;

request({pathname: "talks"}, function(error, response) {
  if (error) {
    reportError(error);
  } else {
    response = JSON.parse(response);
    displayTalks(response.talks);
    lastServerTime = response.serverTime;
    waitForChanges();
  }
});
```

A variável `lastServerTime` é usado para controlar o tempo da última atualização que foi recebido do servidor. Após o pedido inicial as palestras exibidas pelo cliente corresponde ao tempo em que a resposta das palestras foi devolvida pelo servidor. Assim a propriedade `serverTime` incluído na resposta, fornece um valor inicial apropriado para `lastServerTime`.

Quando a solicitação falhar nós não queremos ter que a nossa página não faça nada sem explicação. Assim definimos uma função simples chamada de `reportError` que pelo menos irá mostra ao usuário uma caixa de diálogo que lhes diz que algo deu errado.

```js
function reportError(error) {
  if (error)
    alert(error.toString());
}
```

A função verifica se existe um erro real, ele irá alerta somente quando houver um. Dessa forma podemos também passar diretamente esta função para solicitar pedidos onde podemos ignorar a resposta. Isso garante que, se a solicitação falhar, o erro é relatado para o usuário.

#### Resultados das palestras

Para ser capaz de atualizar a visualização das palestras quando as mudanças acontecem, o cliente deve manter a par das palestras que ele está mostrando. Dessa forma quando uma nova versão de uma palestra que já está na tela vem, a palestra pode ser substituído (no local) com a sua forma atualizada. Da mesma forma, quando a informação que vem de uma palestra está a ser eliminada, o elemento DOM pode ser removido direto do documento.

A função `displayTalks` é usada tanto para construir a tela inicial e atualizá-la quando algo muda. Ele vai usar o objeto `shownTalks`, que associa os títulos da palestras com os nós DOM para lembrar das palestras que tem atualmente na tela.

```js
var talkDiv = document.querySelector("#talks");
var shownTalks = Object.create(null);

function displayTalks(talks) {
  talks.forEach(function(talk) {
    var shown = shownTalks[talk.title];
    if (talk.deleted) {
      if (shown) {
        talkDiv.removeChild(shown);
        delete shownTalks[talk.title];
      }
    } else {
      var node = drawTalk(talk);
      if (shown)
        talkDiv.replaceChild(node, shown);
      else
        talkDiv.appendChild(node);
      shownTalks[talk.title] = node;
    }
  });
}
```

Construir a estrutura DOM para as palestras serão feitas usando os `templates` que foram incluídas no documento HTML. Primeiro temos que definir `instantiateTemplate` que verifica e preenche com um `template`.

O parâmetro `name` é o nome do `template`. Para buscar o elemento de `templates`, buscamos um elemento cujo nome da classe corresponda ao nome do `template` que é filho do elemento com ID "template". Usando o método `querySelector` facilita essa busca. Temos `templates` nomeados como "talk" e "comment" na página HTML.

```js
function instantiateTemplate(name, values) {
  function instantiateText(text) {
    return text.replace(/\{\{(\w+)\}\}/g, function(_, name) {
      return values[name];
    });
  }
  function instantiate(node) {
    if (node.nodeType == document.ELEMENT_NODE) {
      var copy = node.cloneNode();
      for (var i = 0; i < node.childNodes.length; i++)
        copy.appendChild(instantiate(node.childNodes[i]));
      return copy;
    } else if (node.nodeType == document.TEXT_NODE) {
      return document.createTextNode(
               instantiateText(node.nodeValue));
    }
  }

  var template = document.querySelector("#template ." + name);
  return instantiate(template);
}
```

O método `cloneNode` que tem em todos os nós DOM, cria uma cópia de um nó. Ele não copia os nós filhos do nó a menos que `true` é dada como primeiro argumento. A função instancia recursivamente uma cópia do `template` preenchendo onde o `template` deve aparecer.

O segundo argumento para `instantiateTemplate` deve ser um objecto cujas propriedades deve ser `strings` com os mesmos atributos que estão presente no `teplate`. Um espaço reservado como `{{title}}` será substituído com o valor da propriedade de valor do atributo `title`.

Esta é uma abordagem básica para a implementação de `template`, mas é suficiente para implementar o `drawTalk`.

```js
function drawTalk(talk) {
  var node = instantiateTemplate("talk", talk);
  var comments = node.querySelector(".comments");
  talk.comments.forEach(function(comment) {
    comments.appendChild(
      instantiateTemplate("comment", comment));
  });

  node.querySelector("button.del").addEventListener(
    "click", deleteTalk.bind(null, talk.title));

  var form = node.querySelector("form");
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    addComment(talk.title, form.elements.comment.value);
    form.reset();
  });
  return node;
}
```

Depois de instanciar o `template` de "talk" há várias coisas que precisam ser remendadas. Em primeiro lugar os comentários têm de ser preenchidos pelo `template` "comments" e anexando os resultados no nó com a class "commnets". Em seguida, os manipuladores de eventos tem que anexar um botão que apaga a palestra e um formulário que adiciona um novo comentário.

#### Atualizando o servidor

Os manipuladores de eventos registrados pela `drawTalk` chamam o a função `deleteTalk` e `addComment` para executar as ações reais necessários para excluir uma conversa ou adicionar um comentário. Estes terão de construirem URLs que se referem as palestras com um determinado título, para o qual se define a função auxiliar de `talkURL`.

```js
function talkURL(title) {
  return "talks/" + encodeURIComponent(title);
}
```

A função `deleteTalk` dispara uma requisição DELETE e informa o erro quando isso falhar.

```js
function deleteTalk(title) {
  request({pathname: talkURL(title), method: "DELETE"},
          reportError);
}
```

Adicionar um comentário requer a construção de uma representação JSON dos comentários e delegar que seja parte de um pedido POST.

```js
function addComment(title, comment) {
  var comment = {author: nameField.value, message: comment};
  request({pathname: talkURL(title) + "/comments",
           body: JSON.stringify(comment),
           method: "POST"},
          reportError);
}
```

A variável `nameField` é usado para definir a propriedade o autor do comentário, é uma referência do campo `<input>` na parte superior da página que permite que o usuário especifique o seu nome. Nós também inserimos o nome no `localStorage` para que ele não tem que ser preenchido novamente a cada vez que a página é recarregada.

```js
var nameField = document.querySelector("#name");

nameField.value = localStorage.getItem("name") || "";

nameField.addEventListener("change", function() {
  localStorage.setItem("name", nameField.value);
});
```

O formulário na parte inferior da página propoe uma nova conversa, recebe um manipulador de evento `"submit"`. Este manipulador impede efeito padrão do evento(o que causaria um recarregamento da página) passando a ter o comportamento de limpa o formulário e dispara uma solicitação PUT para criar uma a conversa.

```js
var talkForm = document.querySelector("#newtalk");

talkForm.addEventListener("submit", function(event) {
  event.preventDefault();
  request({pathname: talkURL(talkForm.elements.title.value),
           method: "PUT",
           body: JSON.stringify({
             presenter: nameField.value,
             summary: talkForm.elements.summary.value
           })}, reportError);
  talkForm.reset();
});
```

#### Notificando mudanças

Gostaria de salientar que as várias funções que alteram o estado do pedido de criação, exclusão da palestras ou a adição de um comentário não fazem absolutamente nada para garantir que as mudanças que eles fazem seram visíveis na tela. Eles simplesmente dizem ao servidor que contam com o mecanismo de `long polling` para acionar as atualizações apropriadas para a página.

Dado o mecanismo que implementamos em nosso servidor e da maneira que definimos `displayTalks` para lidar com atualizações das palestras que já estão na página, o `long polling` é surpreendentemente simples.

```js
function waitForChanges() {
  request({pathname: "talks?changesSince=" + lastServerTime},
          function(error, response) {
    if (error) {
      setTimeout(waitForChanges, 2500);
      console.error(error.stack);
    } else {
      response = JSON.parse(response);
      displayTalks(response.talks);
      lastServerTime = response.serverTime;
      waitForChanges();
    }
  });
}
```

Esta função é chamada uma vez quando o programa inicia e em seguida continua a chamar assegurando que um pedido de `polling` está sempre ativo. Quando a solicitação falha, não podemos chamar o método `reportError` pois se o servidor cair a cada chamada uma popup iria aparecer para o usuário deixando nosso programa bem chato de usar. Em vez disso o erro é escrito no console(para facilitar a depuração) e uma outra tentativa é feita `two-and-a-half` segundos depois.

Quando o pedido for bem-sucedido os novos dados é colocado na tela e `lastServerTime` é atualizado para refletir o fato de que recebemos dados correspondentes nesse novo momento. O pedido é imediatamente reiniciado para esperar pela próxima atualização.

Se você executar o servidor e abrir duas janelas do navegador em `localhost:8000/` um ao lado do outro você pode ver que as ações que você executa em uma janela são imediatamente visíveis no outro.

## Exercícios

Os exercícios a seguir vai envolver uma modificação definida neste capítulo. Para trabalhar com elas certifique-se de baixar o [código primeiro](http://eloquentjavascript.net/code/skillsharing.zip) e ter instalado Node(nodejs.org).

#### Persistência no disco

O servidor de compartilhamento de habilidade mantém seus dados puramente na memória. Isto significa que quando ele travar ou reiniciar por qualquer motivo todas as palestras e comentários serão perdidos.

Estenda o servidor e faça ele armazenar os dados da palestra em disco, e ache uma forma automatica de recarrega os dados quando o servidor for reiniciado. Não se preocupe com performance faça o mais simples possível e que funcione.

**Dica:**

A solução mais simples que posso dar para você codificar é transformar todas as palestras em objeto JSON e coloca-las em um arquivo usando `fs.writeFile`. Já existe uma função(`registerChange`) que é chamada toda vez que temos alterações de dados no servidor. Ele pode ser estendido para escrever os novos dados no disco.

Escolha um nome para o arquivo, por exemplo `./talks.json`. Quando o servidor é iniciado ele pode tentar ler esse arquivo com `fs.readFile` e se isso for bem sucedido o servidor pode usar o conteúdo do arquivo como seus dados iniciais.

Porém cuidado, as palestras começam como um protótipo menos como um objeto para que possa ser operado normalmente. `JSON.parse` retorna objetos regulares com `Object.prototype` como sendo seu protótipo. Se você usar `JSON` como formato de arquivo você terá que copiar as propriedades do objeto retornados por `JSON.parse` em um novo objeto menos como protótipo.