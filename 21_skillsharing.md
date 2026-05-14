{{meta {code_links: ["code/skillsharing.zip"]}}}

# Projeto: Website de Compartilhamento de Habilidades

{{quote {author: "Margaret Fuller", chapter: true}

Se você tem conhecimento, deixe que outros acendam suas velas nele.

quote}}

{{index "skill-sharing project", meetup, "project chapter"}}

{{figure {url: "img/chapter_picture_21.jpg", alt: "Illustration showing two unicycles leaned against a mailbox", chapter: "framed"}}}

Um encontro de _((compartilhamento de habilidades))_ é um evento onde pessoas com um interesse em comum se reúnem e fazem pequenas apresentações informais sobre coisas que conhecem. Em um encontro de compartilhamento de habilidades sobre ((jardinagem)), alguém pode explicar como cultivar ((aipo)). Ou em um grupo de compartilhamento de habilidades sobre programação, você poderia aparecer e contar às pessoas sobre Node.js.

Neste capítulo final de projeto, nosso objetivo é configurar um ((website)) para gerenciar ((palestra))s dadas em um encontro de compartilhamento de habilidades. Imagine um pequeno grupo de pessoas se reunindo regularmente no escritório de um dos membros para falar sobre ((monociclo)). O organizador anterior dos encontros se mudou para outra cidade, e ninguém se ofereceu para assumir essa tarefa. Queremos um sistema que permita aos participantes propor e discutir palestras entre si sem um organizador ativo.

[Assim como no [capítulo anterior](node), parte do código neste capítulo é escrito para Node.js, e executá-lo diretamente na página HTML que você está vendo provavelmente não funcionará.]{if interactive} O código completo do projeto pode ser ((baixado)) de [_https://eloquentjavascript.net/code/skillsharing.zip_](https://eloquentjavascript.net/code/skillsharing.zip).

## Design

{{index "skill-sharing project", persistence}}

Há uma parte _((servidor))_ neste projeto, escrita para ((Node.js)), e uma parte _((cliente))_, escrita para o ((navegador)). O servidor armazena os dados do sistema e os fornece ao cliente. Ele também serve os arquivos que implementam o sistema do lado do cliente.

{{index [HTTP, client]}}

O servidor mantém a lista de ((palestra))s propostas para o próximo encontro, e o cliente mostra essa lista. Cada palestra tem um nome de apresentador, um título, um resumo e um array de ((comentário))s associados a ela. O cliente permite que usuários proponham novas palestras (adicionando-as à lista), deletem palestras e comentem em palestras existentes. Sempre que o usuário faz tal mudança, o cliente faz uma ((requisição)) HTTP para dizer ao servidor sobre ela.

{{figure {url: "img/skillsharing.png", alt: "Screenshot of the skill-sharing website", width: "10cm"}}}

{{index "live view", "user experience", "pushing data", connection}}

A ((aplicação)) será configurada para mostrar uma visão _ao vivo_ das palestras propostas atualmente e seus comentários. Sempre que alguém, em algum lugar, submete uma nova palestra ou adiciona um comentário, todas as pessoas que têm a página aberta em seus navegadores devem imediatamente ver a mudança. Isso apresenta um pequeno desafio — não há como um servidor web abrir uma conexão com um cliente, nem há uma boa forma de saber quais clientes estão atualmente olhando um determinado website.

{{index "Node.js"}}

Uma solução comum para este problema é chamada _((long polling))_, que é uma das motivações para o design do Node.

## Long polling

{{index notification, "long polling", network, [browser, security]}}

Para poder notificar imediatamente um cliente de que algo mudou, precisamos de uma ((conexão)) com aquele cliente. Como navegadores web tradicionalmente não aceitam conexões e clientes frequentemente estão atrás de ((roteadores)) que bloqueariam tais conexões de qualquer forma, ter o servidor iniciando essa conexão não é prático.

{{index socket}}

Podemos arranjar para que o cliente abra a conexão e a mantenha por perto para que o servidor possa usá-la para enviar informações quando precisar. Mas uma requisição ((HTTP)) permite apenas um fluxo simples de informações: o cliente envia uma requisição, o servidor volta com uma única resposta, e isso é tudo. Uma tecnologia chamada _((WebSockets))_ torna possível abrir ((conexões)) para troca de dados arbitrários, mas usar tais sockets adequadamente é um tanto complicado.

Neste capítulo, usamos uma técnica mais simples, ((long polling)), onde clientes continuamente pedem ao servidor novas informações usando requisições HTTP regulares, e o servidor atrasa sua resposta quando não tem nada novo para reportar.

{{index "live view"}}

Enquanto o cliente se certificar de que constantemente tem uma requisição de polling aberta, ele receberá informações do servidor rapidamente após elas se tornarem disponíveis. Por exemplo, se Fatma tem nossa aplicação de compartilhamento de habilidades aberta em seu navegador, esse navegador terá feito uma requisição para atualizações e estará esperando uma resposta para essa requisição. Quando Iman submete uma palestra sobre Monociclo Extremo Ladeira Abaixo, o servidor notará que Fatma está esperando por atualizações e enviará uma resposta contendo a nova palestra para sua requisição pendente. O navegador de Fatma receberá os dados e atualizará a tela para mostrar a palestra.

{{index robustness, timeout}}

Para prevenir que conexões expirem (sejam abortadas por falta de atividade), técnicas de ((long polling)) geralmente definem um tempo máximo para cada requisição, após o qual o servidor responderá de qualquer forma, mesmo que não tenha nada para reportar. O cliente pode então iniciar uma nova requisição. Reiniciar periodicamente a requisição também torna a técnica mais robusta, permitindo que clientes se recuperem de falhas de ((conexão)) temporárias ou problemas no servidor.

{{index "Node.js"}}

Um servidor ocupado que está usando long polling pode ter milhares de requisições esperando, e portanto conexões ((TCP)), abertas. Node, que torna fácil gerenciar muitas conexões sem criar uma thread de controle separada para cada uma, é uma boa escolha para tal sistema.

## Interface HTTP

{{index "skill-sharing project", [interface, HTTP]}}

Antes de começarmos a projetar o servidor ou o cliente, vamos pensar no ponto onde eles se tocam: a interface ((HTTP)) pela qual se comunicam.

{{index [path, URL], [method, HTTP]}}

Usaremos ((JSON)) como formato do corpo de nossas requisições e respostas. Assim como no servidor de arquivos do [Capítulo ?](node#file_server), tentaremos fazer bom uso dos métodos e ((cabeçalhos)) HTTP. A interface é centrada no caminho `/talks`. Caminhos que não começam com `/talks` serão usados para servir ((arquivo estático))s — o código HTML e JavaScript para o sistema do lado do cliente.

{{index "GET method"}}

Uma requisição `GET` para `/talks` retorna um documento JSON assim:

```{lang: "json"}
[{"title": "Unituning",
  "presenter": "Jamal",
  "summary": "Modifying your cycle for extra style",
  "comments": []}]
```

{{index "PUT method", URL}}

Criar uma nova palestra é feito com uma requisição `PUT` para uma URL como `/talks/Unituning`, onde a parte após a segunda barra é o título da palestra. O corpo da requisição `PUT` deve conter um objeto ((JSON)) com propriedades `presenter` e `summary`.

{{index "encodeURIComponent function", [escaping, "in URLs"], [whitespace, "in URLs"]}}

Como títulos de palestras podem conter espaços e outros caracteres que normalmente não aparecem em uma URL, strings de título devem ser codificadas com a função `encodeURIComponent` ao construir tal URL.

```
console.log("/talks/" + encodeURIComponent("How to Idle"));
// → /talks/How%20to%20Idle
```

Uma requisição para criar uma palestra sobre ficar parado pode parecer algo assim:

```{lang: http}
PUT /talks/How%20to%20Idle HTTP/1.1
Content-Type: application/json
Content-Length: 92

{"presenter": "Maureen",
 "summary": "Standing still on a unicycle"}
```

Tais URLs também suportam requisições `GET` para recuperar a representação JSON de uma palestra e requisições `DELETE` para deletar uma palestra.

{{index "POST method"}}

Adicionar um ((comentário)) a uma palestra é feito com uma requisição `POST` para uma URL como `/talks/Unituning/comments`, com um corpo JSON que tem propriedades `author` e `message`.

```{lang: http}
POST /talks/Unituning/comments HTTP/1.1
Content-Type: application/json
Content-Length: 72

{"author": "Iman",
 "message": "Will you talk about raising a cycle?"}
```

{{index "query string", timeout, "ETag header", "If-None-Match header"}}

Para suportar ((long polling)), requisições `GET` para `/talks` podem incluir cabeçalhos extras que informam ao servidor para atrasar a resposta se nenhuma nova informação estiver disponível. Usaremos um par de cabeçalhos normalmente destinados a gerenciar cache: `ETag` e `If-None-Match`.

{{index "304 (HTTP status code)"}}

Servidores podem incluir um cabeçalho `ETag` ("entity tag") em uma resposta. Seu valor é uma string que identifica a versão atual do recurso. Clientes, quando requisitam aquele recurso novamente mais tarde, podem fazer uma _((requisição condicional))_ incluindo um cabeçalho `If-None-Match` cujo valor contém aquela mesma string. Se o recurso não mudou, o servidor responderá com código de status 304, que significa "não modificado", dizendo ao cliente que sua versão em cache ainda está atual. Quando a tag não corresponde, o servidor responde normalmente.

{{index "Prefer header"}}

Precisamos de algo assim, onde o cliente pode dizer ao servidor qual versão da lista de palestras ele tem, e o servidor responde apenas quando essa lista mudou. Mas em vez de retornar imediatamente uma resposta 304, o servidor deve atrasar a resposta e retornar apenas quando algo novo estiver disponível ou uma certa quantidade de tempo tiver passado. Para distinguir requisições de long polling de requisições condicionais normais, damos a elas outro cabeçalho, `Prefer: wait=90`, que diz ao servidor que o cliente está disposto a esperar até 90 segundos pela resposta.

O servidor manterá um número de versão que atualiza toda vez que as palestras mudam e usará isso como valor do `ETag`. Clientes podem fazer requisições assim para serem notificados quando as palestras mudarem:

```{lang: null}
GET /talks HTTP/1.1
If-None-Match: "4"
Prefer: wait=90

(tempo passa)

HTTP/1.1 200 OK
Content-Type: application/json
ETag: "5"
Content-Length: 295

[...]
```

{{index security}}

O protocolo descrito aqui não faz nenhum ((controle de acesso)). Qualquer pessoa pode comentar, modificar palestras e até mesmo deletá-las. (Como a internet está cheia de ((vândalos)), colocar tal sistema online sem proteção adicional provavelmente não terminaria bem.)

## O servidor

{{index "skill-sharing project"}}

Vamos começar construindo a parte do ((servidor)) do programa. O código nesta seção roda no ((Node.js)).

### Roteamento

{{index "createServer function", [path, URL], [method, HTTP]}}

Nosso servidor usará o `createServer` do Node para iniciar um servidor HTTP. Na função que trata uma nova requisição, devemos distinguir entre os vários tipos de requisição (conforme determinado pelo método e o caminho) que suportamos. Isso pode ser feito com uma longa cadeia de instruções `if`, mas há uma forma mais elegante.

{{index dispatch}}

Um _((roteador))_ é um componente que ajuda a despachar uma requisição para a função que pode tratá-la. Você pode dizer ao roteador, por exemplo, que requisições `PUT` com um caminho que corresponde à expressão regular `/^\/talks\/([^\/]+)$/` (`/talks/` seguido por um título de palestra) podem ser tratadas por uma determinada função. Além disso, ele pode ajudar a extrair as partes significativas do caminho (neste caso o título da palestra), envolvidas em parênteses na ((expressão regular)), e passá-las para a função de tratamento.

Existem vários bons pacotes de roteamento no ((NPM)), mas aqui escreveremos o nosso para ilustrar o princípio.

{{index "import keyword", "Router class", module}}

Este é `router.mjs`, que vamos posteriormente importar de nosso módulo do servidor:

```{includeCode: ">code/skillsharing/router.mjs"}
export class Router {
  constructor() {
    this.routes = [];
  }
  add(method, url, handler) {
    this.routes.push({method, url, handler});
  }
  async resolve(request, context) {
    let {pathname} = new URL(request.url, "http://d");
    for (let {method, url, handler} of this.routes) {
      let match = url.exec(pathname);
      if (!match || request.method != method) continue;
      let parts = match.slice(1).map(decodeURIComponent);
      return handler(context, ...parts, request);
    }
  }
}
```

{{index "Router class"}}

O módulo exporta a classe `Router`. Um objeto roteador permite registrar manipuladores para métodos e padrões de URL específicos com seu método `add`. Quando uma requisição é resolvida com o método `resolve`, o roteador chama o manipulador cujo método e URL correspondem à requisição e retorna seu resultado.

{{index "capture group", "decodeURIComponent function", [escaping, "in URLs"]}}

Funções de tratamento são chamadas com o valor `context` dado a `resolve`. Usaremos isso para dar a elas acesso ao estado do nosso servidor. Adicionalmente, elas recebem as strings de correspondência para quaisquer grupos que definiram em sua ((expressão regular)), e o objeto de requisição. As strings precisam ser decodificadas de URL, pois a URL bruta pode conter códigos estilo `%20`.

### Servindo arquivos

Quando uma requisição não corresponde a nenhum dos tipos de requisição definidos em nosso roteador, o servidor deve interpretá-la como uma requisição para um arquivo no diretório `public`. Seria possível usar o servidor de arquivos definido no [Capítulo ?](node#file_server) para servir tais arquivos, mas não precisamos nem queremos suportar requisições `PUT` e `DELETE` em arquivos, e gostaríamos de ter recursos avançados como suporte a cache. Vamos usar um ((servidor de arquivos estáticos)) sólido e bem testado do ((NPM)).

{{index "createServer function", "serve-static package"}}

Optei por `serve-static`. Este não é o único tal servidor no NPM, mas funciona bem e atende nossos propósitos. O pacote `serve-static` exporta uma função que pode ser chamada com um diretório raiz para produzir uma função manipuladora de requisição. A função manipuladora aceita os argumentos `request` e `response` fornecidos pelo servidor de `"node:http"`, e um terceiro argumento, uma função que ela chamará se nenhum arquivo corresponder à requisição. Queremos que nosso servidor primeiro verifique requisições que devemos tratar especialmente, conforme definido no roteador, então envolvemos isso em outra função.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
import {createServer} from "node:http";
import serveStatic from "serve-static";

function notFound(request, response) {
  response.writeHead(404, "Not found");
  response.end("<h1>Not found</h1>");
}

class SkillShareServer {
  constructor(talks) {
    this.talks = talks;
    this.version = 0;
    this.waiting = [];

    let fileServer = serveStatic("./public");
    this.server = createServer((request, response) => {
      serveFromRouter(this, request, response, () => {
        fileServer(request, response,
                   () => notFound(request, response));
      });
    });
  }
  start(port) {
    this.server.listen(port);
  }
  stop() {
    this.server.close();
  }
}
```

A função `serveFromRouter` tem a mesma interface que `fileServer`, recebendo argumentos `(request, response, next)`. Podemos usar isso para "encadear" vários manipuladores de requisição, permitindo que cada um trate a requisição ou passe a responsabilidade para o próximo manipulador. O manipulador final, `notFound`, simplesmente responde com um erro "not found".

Nossa função `serveFromRouter` usa uma convenção semelhante à do servidor de arquivos do [capítulo anterior](node) para respostas — manipuladores no roteador retornam promises que resolvem para objetos descrevendo a resposta.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
import {Router} from "./router.mjs";

const router = new Router();
const defaultHeaders = {"Content-Type": "text/plain"};

async function serveFromRouter(server, request,
                               response, next) {
  let resolved = await router.resolve(request, server)
    .catch(error => {
      if (error.status != null) return error;
      return {body: String(err), status: 500};
    });
  if (!resolved) return next();
  let {body, status = 200, headers = defaultHeaders} =
    await resolved;
  response.writeHead(status, headers);
  response.end(body);
}
```

### Palestras como recursos

As ((palestras)) que foram propostas são armazenadas na propriedade `talks` do servidor, um objeto cujos nomes de propriedade são os títulos das palestras. Adicionaremos alguns manipuladores ao nosso roteador que expõem essas como ((recursos)) HTTP sob `/talks/<título>`.

{{index "GET method", "404 (HTTP status code)" "hasOwn function"}}

O manipulador para requisições que fazem `GET` em uma única palestra deve procurar a palestra e responder com os dados JSON da palestra ou com uma resposta de erro 404.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
const talkPath = /^\/talks\/([^\/]+)$/;

router.add("GET", talkPath, async (server, title) => {
  if (Object.hasOwn(server.talks, title)) {
    return {body: JSON.stringify(server.talks[title]),
            headers: {"Content-Type": "application/json"}};
  } else {
    return {status: 404, body: `No talk '${title}' found`};
  }
});
```

{{index "DELETE method"}}

Deletar uma palestra é feito removendo-a do objeto `talks`.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
router.add("DELETE", talkPath, async (server, title) => {
  if (Object.hasOwn(server.talks, title)) {
    delete server.talks[title];
    server.updated();
  }
  return {status: 204};
});
```

{{index "long polling", "updated method"}}

O método `updated`, que definiremos [mais adiante](skillsharing#updated), notifica requisições de long polling em espera sobre a mudança.

{{index validation, input, "PUT method"}}

Um manipulador que precisa ler corpos de requisição é o manipulador `PUT`, que é usado para criar novas ((palestras)). Ele tem que verificar se os dados que recebeu têm propriedades `presenter` e `summary`, que são strings. Quaisquer dados vindos de fora do sistema podem ser sem sentido, e não queremos corromper nosso modelo de dados interno ou causar um ((crash)) quando requisições ruins chegam.

{{index "updated method"}}

Se os dados parecerem válidos, o manipulador armazena um objeto representando a nova palestra no objeto `talks`, possivelmente ((sobrescrevendo)) uma palestra existente com este título, e novamente chama `updated`.

{{index "node:stream/consumers package", JSON, "readable stream"}}

Para ler o corpo do stream de requisição, usaremos a função `json` de `"node:stream/consumers"`, que coleta os dados no stream e os analisa como JSON. Existem exportações similares chamadas `text` (para ler o conteúdo como string) e `buffer` (para lê-lo como dados binários) neste pacote. Como `json` é um nome muito genérico, a importação o renomeia para `readJSON` para evitar confusão.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
import {json as readJSON} from "node:stream/consumers";

router.add("PUT", talkPath,
           async (server, title, request) => {
  let talk = await readJSON(request);
  if (!talk ||
      typeof talk.presenter != "string" ||
      typeof talk.summary != "string") {
    return {status: 400, body: "Bad talk data"};
  }
  server.talks[title] = {
    title,
    presenter: talk.presenter,
    summary: talk.summary,
    comments: []
  };
  server.updated();
  return {status: 204};
});
```

Adicionar um ((comentário)) a uma ((palestra)) funciona de forma semelhante. Usamos `readJSON` para obter o conteúdo da requisição, validamos os dados resultantes e os armazenamos como comentário quando parecem válidos.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
router.add("POST", /^\/talks\/([^\/]+)\/comments$/,
           async (server, title, request) => {
  let comment = await readJSON(request);
  if (!comment ||
      typeof comment.author != "string" ||
      typeof comment.message != "string") {
    return {status: 400, body: "Bad comment data"};
  } else if (Object.hasOwn(server.talks, title)) {
    server.talks[title].comments.push(comment);
    server.updated();
    return {status: 204};
  } else {
    return {status: 404, body: `No talk '${title}' found`};
  }
});
```

{{index "404 (HTTP status code)"}}

Tentar adicionar um comentário a uma palestra inexistente retorna um erro 404.

### Suporte a long polling

O aspecto mais interessante do servidor é a parte que trata ((long polling)). Quando uma requisição `GET` chega para `/talks`, ela pode ser uma requisição regular ou uma requisição de long polling.

{{index "talkResponse method", "ETag header"}}

Haverá múltiplos lugares nos quais temos que enviar um array de palestras ao cliente, então primeiro definimos um método auxiliar que constrói tal array e inclui um cabeçalho `ETag` na resposta.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
SkillShareServer.prototype.talkResponse = function() {
  let talks = Object.keys(this.talks)
    .map(title => this.talks[title]);
  return {
    body: JSON.stringify(talks),
    headers: {"Content-Type": "application/json",
              "ETag": `"${this.version}"`,
              "Cache-Control": "no-store"}
  };
};
```

{{index "query string", "url package", parsing}}

O manipulador em si precisa olhar os cabeçalhos da requisição para ver se os cabeçalhos `If-None-Match` e `Prefer` estão presentes. Node armazena cabeçalhos, cujos nomes são especificados como insensíveis a maiúsculas, sob seus nomes em minúsculas.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
router.add("GET", /^\/talks$/, async (server, request) => {
  let tag = /"(.*)"/.exec(request.headers["if-none-match"]);
  let wait = /\bwait=(\d+)/.exec(request.headers["prefer"]);
  if (!tag || tag[1] != server.version) {
    return server.talkResponse();
  } else if (!wait) {
    return {status: 304};
  } else {
    return server.waitForChanges(Number(wait[1]));
  }
});
```

{{index "long polling", "waitForChanges method", "If-None-Match header", "Prefer header"}}

Se nenhuma tag foi dada ou uma tag foi dada que não corresponde à versão atual do servidor, o manipulador responde com a lista de palestras. Se a requisição é condicional e as palestras não mudaram, consultamos o cabeçalho `Prefer` para ver se devemos atrasar a resposta ou responder imediatamente.

{{index "304 (HTTP status code)", "setTimeout function", timeout, "callback function"}}

Funções de callback para requisições atrasadas são armazenadas no array `waiting` do servidor para que possam ser notificadas quando algo acontecer. O método `waitForChanges` também define imediatamente um temporizador para responder com status 304 quando a requisição esperou tempo suficiente.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
SkillShareServer.prototype.waitForChanges = function(time) {
  return new Promise(resolve => {
    this.waiting.push(resolve);
    setTimeout(() => {
      if (!this.waiting.includes(resolve)) return;
      this.waiting = this.waiting.filter(r => r != resolve);
      resolve({status: 304});
    }, time * 1000);
  });
};
```

{{index "updated method"}}

{{id updated}}

Registrar uma mudança com `updated` incrementa a propriedade `version` e acorda todas as requisições em espera.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
SkillShareServer.prototype.updated = function() {
  this.version++;
  let response = this.talkResponse();
  this.waiting.forEach(resolve => resolve(response));
  this.waiting = [];
};
```

{{index [HTTP, server]}}

Isso conclui o código do servidor. Se criarmos uma instância de `SkillShareServer` e a iniciarmos na porta 8000, o servidor HTTP resultante serve arquivos do subdiretório `public` junto com uma interface de gerenciamento de palestras sob a URL `/talks`.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
new SkillShareServer({}).start(8000);
```

## O cliente

{{index "skill-sharing project"}}

A parte do ((cliente)) do website de compartilhamento de habilidades consiste em três arquivos: uma pequena página HTML, uma folha de estilo e um arquivo JavaScript.

### HTML

{{index "index.html"}}

É uma convenção amplamente usada para servidores web tentar servir um arquivo chamado `index.html` quando uma requisição é feita diretamente a um caminho que corresponde a um diretório. O módulo de ((servidor de arquivos)) que usamos, `serve-static`, suporta essa convenção. Quando uma requisição é feita para o caminho `/`, o servidor procura o arquivo `./public/index.html` (`./public` sendo a raiz que demos a ele) e retorna esse arquivo se encontrado.

Assim, se queremos que uma página apareça quando um navegador é apontado para nosso servidor, devemos colocá-la em `public/index.html`. Este é nosso arquivo index:

```{lang: "html", includeCode: ">code/skillsharing/public/index.html"}
<!doctype html>
<meta charset="utf-8">
<title>Skill Sharing</title>
<link rel="stylesheet" href="skillsharing.css">

<h1>Skill Sharing</h1>

<script src="skillsharing_client.js"></script>
```

{{index CSS}}

Ele define o ((título)) do documento e inclui uma folha de estilo, que define alguns estilos para, entre outras coisas, garantir que haja algum espaço entre as palestras. Depois adiciona um cabeçalho no topo da página e carrega o script que contém a ((aplicação)) do lado do cliente.

### Ações

O estado da aplicação consiste na lista de palestras e no nome do usuário, e vamos armazená-lo em um objeto `{talks, user}`. Não permitimos que a interface do usuário manipule diretamente o estado ou envie requisições HTTP. Em vez disso, ela pode emitir _ações_ que descrevem o que o usuário está tentando fazer.

{{index "handleAction function"}}

A função `handleAction` recebe tal ação e a faz acontecer. Como nossas atualizações de estado são tão simples, mudanças de estado são tratadas na mesma função.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function handleAction(state, action) {
  if (action.type == "setUser") {
    localStorage.setItem("userName", action.user);
    return {...state, user: action.user};
  } else if (action.type == "setTalks") {
    return {...state, talks: action.talks};
  } else if (action.type == "newTalk") {
    fetchOK(talkURL(action.title), {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        presenter: state.user,
        summary: action.summary
      })
    }).catch(reportError);
  } else if (action.type == "deleteTalk") {
    fetchOK(talkURL(action.talk), {method: "DELETE"})
      .catch(reportError);
  } else if (action.type == "newComment") {
    fetchOK(talkURL(action.talk) + "/comments", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        author: state.user,
        message: action.message
      })
    }).catch(reportError);
  }
  return state;
}
```

{{index "localStorage object"}}

Armazenaremos o nome do usuário em `localStorage` para que possa ser restaurado quando a página é carregada.

{{index "fetch function", "status property"}}

As ações que precisam envolver o servidor fazem requisições de rede, usando `fetch`, para a interface HTTP descrita anteriormente. Usamos uma função wrapper, `fetchOK`, que garante que a promise retornada seja rejeitada quando o servidor retorna um código de erro.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function fetchOK(url, options) {
  return fetch(url, options).then(response => {
    if (response.status < 400) return response;
    else throw new Error(response.statusText);
  });
}
```

{{index "talkURL function", "encodeURIComponent function"}}

Esta função auxiliar é usada para construir uma ((URL)) para uma palestra com um determinado título.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function talkURL(title) {
  return "talks/" + encodeURIComponent(title);
}
```

{{index "error handling", "user experience", "reportError function"}}

Quando a requisição falha, não queremos que nossa página fique parada sem fazer nada sem explicação. A função chamada `reportError`, que usamos como o manipulador `catch`, mostra ao usuário um diálogo rústico para informar que algo deu errado.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function reportError(error) {
  alert(String(error));
}
```

### Renderizando componentes

{{index "renderUserField function"}}

Usaremos uma abordagem semelhante à que vimos no [Capítulo ?](paint), dividindo a aplicação em componentes. No entanto, como alguns dos componentes nunca precisam ser atualizados ou são sempre totalmente redesenhados quando atualizados, vamos defini-los não como classes mas como funções que retornam diretamente um nó DOM. Por exemplo, aqui está um componente que mostra o campo onde o usuário pode inserir seu nome:

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function renderUserField(name, dispatch) {
  return elt("label", {}, "Your name: ", elt("input", {
    type: "text",
    value: name,
    onchange(event) {
      dispatch({type: "setUser", user: event.target.value});
    }
  }));
}
```

{{index "elt function"}}

A função `elt` usada para construir elementos DOM é a que usamos no [Capítulo ?](paint).

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no, hidden: true}
function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}
```

{{index "renderTalk function"}}

Uma função semelhante é usada para renderizar palestras, que incluem uma lista de comentários e um formulário para adicionar um novo ((comentário)).

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function renderTalk(talk, dispatch) {
  return elt(
    "section", {className: "talk"},
    elt("h2", null, talk.title, " ", elt("button", {
      type: "button",
      onclick() {
        dispatch({type: "deleteTalk", talk: talk.title});
      }
    }, "Delete")),
    elt("div", null, "by ",
        elt("strong", null, talk.presenter)),
    elt("p", null, talk.summary),
    ...talk.comments.map(renderComment),
    elt("form", {
      onsubmit(event) {
        event.preventDefault();
        let form = event.target;
        dispatch({type: "newComment",
                  talk: talk.title,
                  message: form.elements.comment.value});
        form.reset();
      }
    }, elt("input", {type: "text", name: "comment"}), " ",
       elt("button", {type: "submit"}, "Add comment")));
}
```

{{index "submit event"}}

O manipulador do evento `"submit"` chama `form.reset` para limpar o conteúdo do formulário após criar uma ação `"newComment"`.

Ao criar pedaços moderadamente complexos de DOM, esse estilo de programação começa a parecer bastante confuso. Para evitar isso, as pessoas frequentemente usam uma _((linguagem de template))_, que permite escrever sua interface como um arquivo HTML com alguns marcadores especiais para indicar onde os elementos dinâmicos vão. Ou usam _((JSX))_, um dialeto não padrão de JavaScript que permite escrever algo muito próximo de tags HTML em seu programa como se fossem expressões JavaScript. Ambas as abordagens usam ferramentas adicionais para pré-processar o código antes de poder ser executado, o que evitaremos neste capítulo.

Comentários são simples de renderizar.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function renderComment(comment) {
  return elt("p", {className: "comment"},
             elt("strong", null, comment.author),
             ": ", comment.message);
}
```

{{index "form (HTML tag)", "renderTalkForm function"}}

Finalmente, o formulário que o usuário pode usar para criar uma nova palestra é renderizado assim:

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function renderTalkForm(dispatch) {
  let title = elt("input", {type: "text"});
  let summary = elt("input", {type: "text"});
  return elt("form", {
    onsubmit(event) {
      event.preventDefault();
      dispatch({type: "newTalk",
                title: title.value,
                summary: summary.value});
      event.target.reset();
    }
  }, elt("h3", null, "Submit a Talk"),
     elt("label", null, "Title: ", title),
     elt("label", null, "Summary: ", summary),
     elt("button", {type: "submit"}, "Submit"));
}
```

### Polling

{{index "pollTalks function", "long polling", "If-None-Match header", "Prefer header", "fetch function"}}

Para iniciar a aplicação, precisamos da lista atual de palestras. Como o carregamento inicial está intimamente relacionado ao processo de long polling — o `ETag` do carregamento deve ser usado ao fazer polling — escreveremos uma função que continua fazendo polling ao servidor para `/talks` e chama uma ((função de callback)) quando um novo conjunto de palestras está disponível.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
async function pollTalks(update) {
  let tag = undefined;
  for (;;) {
    let response;
    try {
      response = await fetchOK("/talks", {
        headers: tag && {"If-None-Match": tag,
                         "Prefer": "wait=90"}
      });
    } catch (e) {
      console.log("Request failed: " + e);
      await new Promise(resolve => setTimeout(resolve, 500));
      continue;
    }
    if (response.status == 304) continue;
    tag = response.headers.get("ETag");
    update(await response.json());
  }
}
```

{{index "async function"}}

Esta é uma função `async` para que iterar e esperar pela requisição seja mais fácil. Ela executa um loop infinito que, a cada iteração, recupera a lista de palestras — normalmente ou, se esta não for a primeira requisição, com os cabeçalhos incluídos que a tornam uma requisição de long polling.

{{index "error handling", "Promise class", "setTimeout function"}}

Quando uma requisição falha, a função espera um momento e depois tenta novamente. Dessa forma, se sua conexão de rede cair por um tempo e depois voltar, a aplicação pode se recuperar e continuar atualizando. A promise resolvida via `setTimeout` é uma forma de forçar a função `async` a esperar.

{{index "304 (HTTP status code)", "ETag header"}}

Quando o servidor retorna uma resposta 304, isso significa que uma requisição de long polling expirou, então a função deve simplesmente iniciar imediatamente a próxima requisição. Se a resposta é uma resposta 200 normal, seu corpo é lido como ((JSON)) e passado ao callback, e seu valor de cabeçalho `ETag` é armazenado para a próxima iteração.

### A aplicação

{{index "SkillShareApp class"}}

O componente a seguir amarra toda a interface de usuário:

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
class SkillShareApp {
  constructor(state, dispatch) {
    this.dispatch = dispatch;
    this.talkDOM = elt("div", {className: "talks"});
    this.dom = elt("div", null,
                   renderUserField(state.user, dispatch),
                   this.talkDOM,
                   renderTalkForm(dispatch));
    this.syncState(state);
  }

  syncState(state) {
    if (state.talks != this.talks) {
      this.talkDOM.textContent = "";
      for (let talk of state.talks) {
        this.talkDOM.appendChild(
          renderTalk(talk, this.dispatch));
      }
      this.talks = state.talks;
    }
  }
}
```

{{index synchronization, "live view"}}

Quando as palestras mudam, este componente redesenha todas elas. Isso é simples mas também desperdiçado. Voltaremos a isso nos exercícios.

Podemos iniciar a aplicação assim:

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function runApp() {
  let user = localStorage.getItem("userName") || "Anon";
  let state, app;
  function dispatch(action) {
    state = handleAction(state, action);
    app.syncState(state);
  }

  pollTalks(talks => {
    if (!app) {
      state = {user, talks};
      app = new SkillShareApp(state, dispatch);
      document.body.appendChild(app.dom);
    } else {
      dispatch({type: "setTalks", talks});
    }
  }).catch(reportError);
}

runApp();
```

Se você executar o servidor e abrir duas janelas do navegador para [_http://localhost:8000_](http://localhost:8000/) lado a lado, poderá ver que as ações que você realiza em uma janela são imediatamente visíveis na outra.

## Exercícios

{{index "Node.js", NPM}}

Os exercícios a seguir envolverão modificar o sistema definido neste capítulo. Para trabalhar neles, certifique-se de que você ((baixou)) o código ([_https://eloquentjavascript.net/code/skillsharing.zip_](https://eloquentjavascript.net/code/skillsharing.zip)), instalou Node ([_https://nodejs.org_](https://nodejs.org)), e instalou a dependência do projeto com `npm install`.

### Persistência em disco

{{index "data loss", persistence, [memory, persistence]}}

O servidor de compartilhamento de habilidades mantém seus dados puramente em memória. Isso significa que quando ele trava ou é reiniciado por qualquer razão, todas as palestras e comentários são perdidos.

{{index "hard drive"}}

Estenda o servidor para que ele armazene os dados de palestras em disco e recarregue automaticamente os dados quando for reiniciado. Não se preocupe com eficiência — faça a coisa mais simples que funcione.

{{hint

{{index "filesystem", "writeFile function", "updated method", persistence}}

A solução mais simples que consigo pensar é codificar o objeto `talks` inteiro como ((JSON)) e despejá-lo em um arquivo com `writeFile`. Já existe um método (`updated`) que é chamado toda vez que os dados do servidor mudam. Ele pode ser estendido para escrever os novos dados no disco.

{{index "readFile function", "JSON.parse function"}}

Escolha um nome de ((arquivo)), por exemplo `./talks.json`. Quando o servidor inicia, ele pode tentar ler esse arquivo com `readFile`, e se tiver sucesso, o servidor pode usar o conteúdo do arquivo como seus dados iniciais.

hint}}

### Reinicialização de campo de comentário

{{index "comment field reset (exercise)", template, [state, "of application"]}}

O redesenho completo de palestras funciona muito bem porque normalmente não se pode distinguir entre um nó DOM e sua substituição idêntica. Mas existem exceções. Se você começar a digitar algo no ((campo)) de comentário de uma palestra em uma janela do navegador e depois, em outra, adicionar um comentário a essa palestra, o campo na primeira janela será redesenhado, removendo tanto seu conteúdo quanto seu ((foco)).

Quando múltiplas pessoas estão adicionando comentários ao mesmo tempo, isso seria irritante. Você consegue encontrar uma forma de resolver isso?

{{hint

{{index "comment field reset (exercise)", template, "syncState method"}}

A melhor forma de fazer isso é provavelmente tornar o componente de palestra um objeto, com um método `syncState`, para que possam ser atualizados para mostrar uma versão modificada da palestra. Durante operação normal, a única forma de uma palestra ser alterada é adicionando mais comentários, então o método `syncState` pode ser relativamente simples.

A parte difícil é que quando uma lista alterada de palestras chega, temos que reconciliar a lista existente de componentes DOM com as palestras na nova lista — deletando componentes cuja palestra foi deletada e atualizando componentes cuja palestra mudou.

{{index synchronization, "live view"}}

Para fazer isso, pode ser útil manter uma estrutura de dados que armazene os componentes de palestras sob os títulos das palestras para que você possa facilmente descobrir se um componente existe para uma determinada palestra. Você pode então iterar sobre o novo array de palestras, e para cada uma delas, sincronizar um componente existente ou criar um novo. Para deletar componentes de palestras deletadas, você também terá que iterar sobre os componentes e verificar se as palestras correspondentes ainda existem.

hint}}
