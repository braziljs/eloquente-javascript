{{meta {}}}

# HTTP e Formulários

{{quote {author: "Tim Berners-Lee", chapter: true}

O que frequentemente era difícil para as pessoas entenderem sobre o design era que não havia nada além de URLs, HTTP e HTML. Não havia um computador central 'controlando' a web, nenhuma rede única na qual esses protocolos funcionavam, nem mesmo uma organização em algum lugar que 'administrava' a Web. A Web não era uma 'coisa' física que existia em um certo 'lugar'. Era um 'espaço' no qual informações podiam existir.

quote}}

{{index "Fielding, Roy"}}

{{figure {url: "img/chapter_picture_18.jpg", alt: "Illustration showing a web sign-up form on a parchment scroll", chapter: "framed"}}}

{{index [browser, environment]}}

O Protocolo de Transferência de Hipertexto, introduzido no [Capítulo ?](browser#web), é o mecanismo pelo qual dados são solicitados e fornecidos na ((World Wide Web)). Este capítulo descreve o ((protocolo)) em mais detalhes e explica a forma como o JavaScript do navegador tem acesso a ele.

## O protocolo

{{index "IP address"}}

Se você digitar _eloquentjavascript.net/18_http.html_ na ((barra de endereço)) do seu navegador, o ((navegador)) primeiro procura o ((endereço)) do servidor associado a _eloquentjavascript.net_ e tenta abrir uma ((conexão)) ((TCP)) com ele na ((porta)) 80, a porta padrão para tráfego ((HTTP)). Se o ((servidor)) existir e aceitar a conexão, o navegador pode enviar algo assim:

```{lang: http}
GET /18_http.html HTTP/1.1
Host: eloquentjavascript.net
User-Agent: Your browser's name
```

Então o servidor responde, através da mesma conexão.

```{lang: http}
HTTP/1.1 200 OK
Content-Length: 87320
Content-Type: text/html
Last-Modified: Fri, 13 Oct 2023 10:05:41 GMT

<!doctype html>
... the rest of the document
```

O navegador pega a parte da ((resposta)) após a linha em branco, seu _corpo_ (não confundir com a tag HTML `<body>`), e a exibe como um documento ((HTML)).

{{index HTTP}}

A informação enviada pelo cliente é chamada de _((requisição))_. Ela começa com esta linha:

```{lang: http}
GET /18_http.html HTTP/1.1
```

{{index "DELETE method", "PUT method", "GET method", [method, HTTP]}}

A primeira palavra é o _método_ da ((requisição)). `GET` significa que queremos _obter_ o recurso especificado. Outros métodos comuns são `DELETE` para deletar um recurso, `PUT` para criá-lo ou substituí-lo, e `POST` para enviar informações a ele. Note que o ((servidor)) não é obrigado a realizar toda requisição que recebe. Se você chegar a um site qualquer e dizer para ele `DELETE` sua página principal, ele provavelmente vai recusar.

{{index [path, URL], GitHub, [file, resource]}}

A parte após o nome do método é o caminho do _((recurso))_ ao qual a requisição se aplica. No caso mais simples, um recurso é simplesmente um arquivo no ((servidor)), mas o protocolo não exige que seja. Um recurso pode ser qualquer coisa que possa ser transferida _como se_ fosse um arquivo. Muitos servidores geram as respostas que produzem dinamicamente. Por exemplo, se você abrir [_https://github.com/marijnh_](https://github.com/marijnh), o servidor procura em seu banco de dados um usuário chamado "marijnh", e se encontrar um, gerará uma página de perfil para esse usuário.

Após o caminho do recurso, a primeira linha da requisição menciona `HTTP/1.1` para indicar a ((versão)) do ((protocolo)) ((HTTP)) que está usando.

Na prática, muitos sites usam HTTP versão 2, que suporta os mesmos conceitos da versão 1.1, mas é muito mais complicado para poder ser mais rápido. Os navegadores automaticamente mudam para a versão de protocolo apropriada ao falar com um determinado servidor, e o resultado de uma requisição é o mesmo independentemente de qual versão é usada. Como a versão 1.1 é mais direta e mais fácil de experimentar, usaremos essa para ilustrar o protocolo.

{{index "status code"}}

A ((resposta)) do servidor começará com uma versão também, seguida pelo status da resposta, primeiro como um código de status de três dígitos e depois como uma string legível por humanos.

```{lang: http}
HTTP/1.1 200 OK
```

{{index "200 (HTTP status code)", "error response", "404 (HTTP status code)"}}

Códigos de status que começam com 2 indicam que a requisição teve sucesso. Códigos que começam com 4 significam que houve algo errado com a ((requisição)). O código de status HTTP mais famoso é provavelmente 404, que significa que o recurso não pôde ser encontrado. Códigos que começam com 5 significam que um erro aconteceu no ((servidor)) e a requisição não é culpada.

{{index HTTP}}

{{id headers}}

A primeira linha de uma requisição ou resposta pode ser seguida por qualquer número de _((cabeçalhos))_. Estas são linhas na forma `nome: valor` que especificam informações extras sobre a requisição ou resposta. Estes cabeçalhos faziam parte da ((resposta)) de exemplo:

```{lang: null}
Content-Length: 87320
Content-Type: text/html
Last-Modified: Fri, 13 Oct 2023 10:05:41 GMT
```

{{index "Content-Length header", "Content-Type header", "Last-Modified header"}}

Isso nos diz o tamanho e o tipo do documento de resposta. Neste caso, é um documento HTML de 87.320 bytes. Também nos diz quando aquele documento foi modificado pela última vez.

O cliente e o servidor são livres para decidir quais ((cabeçalhos)) incluir em suas ((requisições)) ou ((respostas)). Mas alguns deles são necessários para que as coisas funcionem. Por exemplo, sem um cabeçalho `Content-Type` na resposta, o navegador não saberá como exibir o documento.

{{index "GET method", "DELETE method", "PUT method", "POST method", "body (HTTP)"}}

Após os cabeçalhos, tanto requisições quanto respostas podem incluir uma linha em branco seguida por um corpo, que contém o documento real sendo enviado. Requisições `GET` e `DELETE` não enviam dados junto, mas requisições `PUT` e `POST` sim. Alguns tipos de resposta, como respostas de erro, também não requerem um corpo.

## Navegadores e HTTP

{{index HTTP, [file, resource]}}

Como vimos, um ((navegador)) fará uma requisição quando digitamos uma ((URL)) em sua ((barra de endereço)). Quando a página HTML resultante referencia outros arquivos, como ((imagem))ns e arquivos JavaScript, eles também serão recuperados.

{{index parallelism, "GET method"}}

Um ((website)) moderadamente complexo pode facilmente incluir de 10 a 200 ((recursos)). Para poder buscá-los rapidamente, os navegadores fazem várias requisições `GET` simultaneamente, em vez de esperar pelas respostas uma de cada vez.

Páginas HTML podem incluir _((formulários))_, que permitem ao usuário preencher informações e enviá-las ao servidor. Este é um exemplo de um formulário:

```{lang: html}
<form method="GET" action="example/message.html">
  <p>Name: <input type="text" name="name"></p>
  <p>Message:<br><textarea name="message"></textarea></p>
  <p><button type="submit">Send</button></p>
</form>
```

{{index form, "method attribute", "GET method"}}

Este código descreve um formulário com dois ((campo))s: um pequeno pedindo um nome e um maior para escrever uma mensagem. Quando você clica no ((botão)) Enviar, o formulário é _submetido_, o que significa que o conteúdo de seus campos é empacotado em uma requisição HTTP e o navegador navega para o resultado dessa requisição.

Quando o atributo `method` do elemento `<form>` é `GET` (ou é omitido), a informação no formulário é adicionada ao final da URL `action` como uma _((string de consulta))_. O navegador pode fazer uma requisição para esta URL:

```{lang: null}
GET /example/message.html?name=Jean&message=Yes%3F HTTP/1.1
```

{{index "ampersand character"}}

O ((ponto de interrogação)) indica o fim da parte do caminho da URL e o início da consulta. Ele é seguido por pares de nomes e valores, correspondendo ao atributo `name` nos elementos de campo do formulário e ao conteúdo desses elementos, respectivamente. Um caractere "e comercial" (`&`) é usado para separar os pares.

{{index [escaping, "in URLs"], "hexadecimal number", "encodeURIComponent function", "decodeURIComponent function"}}

A mensagem real codificada na URL é "Yes?" mas o ponto de interrogação é substituído por um código estranho. Alguns caracteres em strings de consulta precisam ser escapados. O ponto de interrogação, representado como `%3F`, é um deles. Parece haver uma regra não escrita de que cada formato precisa de sua própria forma de escapar caracteres. Esta, chamada _((codificação URL))_, usa um ((sinal de porcentagem)) seguido por dois dígitos hexadecimais (base 16) que codificam o código do caractere. Neste caso, 3F, que é 63 em notação decimal, é o código de um caractere de ponto de interrogação. JavaScript fornece as funções `encodeURIComponent` e `decodeURIComponent` para codificar e decodificar este formato.

```
console.log(encodeURIComponent("Yes?"));
// → Yes%3F
console.log(decodeURIComponent("Yes%3F"));
// → Yes?
```

{{index "body (HTTP)", "POST method"}}

Se mudarmos o atributo `method` do formulário HTML no exemplo que vimos anteriormente para `POST`, a requisição ((HTTP)) feita para submeter o ((formulário)) usará o método `POST` e colocará a ((string de consulta)) no corpo da requisição em vez de adicioná-la à URL.

```{lang: http}
POST /example/message.html HTTP/1.1
Content-length: 24
Content-type: application/x-www-form-urlencoded

name=Jean&message=Yes%3F
```

Requisições `GET` devem ser usadas para requisições que não têm ((efeito colateral))s, mas simplesmente pedem informações. Requisições que mudam algo no servidor, por exemplo criando uma nova conta ou postando uma mensagem, devem ser expressas com outros métodos, como `POST`. Software do lado do cliente, como um navegador, sabe que não deve fazer requisições `POST` cegamente, mas frequentemente faz requisições `GET` implicitamente — para pré-buscar um recurso que acredita que o usuário precisará em breve, por exemplo.

Voltaremos a formulários e como interagir com eles a partir de JavaScript [mais adiante no capítulo](http#forms).

{{id fetch}}

## Fetch

{{index "fetch function", "Promise class", [interface, module]}}

A interface através da qual o JavaScript do navegador pode fazer requisições HTTP é chamada `fetch`.

```{test: no}
fetch("example/data.txt").then(response => {
  console.log(response.status);
  // → 200
  console.log(response.headers.get("Content-Type"));
  // → text/plain
});
```

{{index "Response class", "status property", "headers property"}}

Chamar `fetch` retorna uma promise que se resolve para um objeto `Response` contendo informações sobre a resposta do servidor, como seu código de status e seus cabeçalhos. Os cabeçalhos são envolvidos em um objeto semelhante a `Map` que trata suas chaves (os nomes dos cabeçalhos) sem distinção entre maiúsculas e minúsculas, porque os nomes de cabeçalhos não devem ser sensíveis a maiúsculas. Isso significa que `headers.get("Content-Type")` e `headers.get("content-TYPE")` retornarão o mesmo valor.

Note que a promise retornada por `fetch` se resolve com sucesso mesmo se o servidor respondeu com um código de erro. Ela também pode ser rejeitada se houver um erro de rede ou se o ((servidor)) ao qual a requisição foi endereçada não puder ser encontrado.

{{index [path, URL], "relative URL"}}

O primeiro argumento para `fetch` é a URL que deve ser requisitada. Quando essa ((URL)) não começa com um nome de protocolo (como _http:_), ela é tratada como _relativa_, o que significa que é interpretada em relação ao documento atual. Quando começa com uma barra (/), ela substitui o caminho atual, que é a parte após o nome do servidor. Quando não começa, a parte do caminho atual até e incluindo seu último ((caractere de barra)) é colocada na frente da URL relativa.

{{index "text method", "body (HTTP)", "Promise class"}}

Para acessar o conteúdo real de uma resposta, você pode usar seu método `text`. Como a promise inicial é resolvida assim que os cabeçalhos da resposta são recebidos e porque a leitura do corpo da resposta pode demorar mais, isso novamente retorna uma promise.

```{test: no}
fetch("example/data.txt")
  .then(resp => resp.text())
  .then(text => console.log(text));
// → This is the content of data.txt
```

{{index "json method"}}

Um método similar, chamado `json`, retorna uma promise que se resolve para o valor que você obtém ao analisar o corpo como ((JSON)) ou rejeita se não for JSON válido.

{{index "GET method", "body (HTTP)", "DELETE method", "method property"}}

Por padrão, `fetch` usa o método `GET` para fazer sua requisição e não inclui um corpo de requisição. Você pode configurá-lo diferentemente passando um objeto com opções extras como segundo argumento. Por exemplo, esta requisição tenta deletar `example/data.txt`:

```{test: no}
fetch("example/data.txt", {method: "DELETE"}).then(resp => {
  console.log(resp.status);
  // → 405
});
```

{{index "405 (HTTP status code)"}}

O código de status 405 significa "método não permitido", a forma de um servidor HTTP dizer "receio que não posso fazer isso".

{{index "Range header", "body property", "headers property"}}

Para adicionar um corpo de requisição para uma requisição `PUT` ou `POST`, você pode incluir uma opção `body`. Para definir cabeçalhos, há a opção `headers`. Por exemplo, esta requisição inclui um cabeçalho `Range`, que instrui o servidor a retornar apenas parte de um documento.

```{test: no}
fetch("example/data.txt", {headers: {Range: "bytes=8-19"}})
  .then(resp => resp.text())
  .then(console.log);
// → the content
```

O navegador adicionará automaticamente alguns ((cabeçalhos)) de requisição, como "Host" e aqueles necessários para o servidor descobrir o tamanho do corpo. Mas adicionar seus próprios cabeçalhos é frequentemente útil para incluir coisas como informações de autenticação ou para dizer ao servidor qual formato de arquivo você gostaria de receber.

{{id http_sandbox}}

## Sandboxing HTTP

{{index sandbox, [browser, security]}}

Fazer requisições ((HTTP)) em scripts de páginas web levanta preocupações sobre ((segurança)) novamente. A pessoa que controla o script pode não ter os mesmos interesses que a pessoa em cujo computador ele está rodando. Mais especificamente, se eu visitar _themafia.org_, não quero que seus scripts possam fazer uma requisição para _mybank.com_, usando informações de identificação do meu navegador, com instruções para transferir todo meu dinheiro.

Por essa razão, os navegadores nos protegem proibindo scripts de fazer requisições HTTP para outros ((domínios)) (nomes como _themafia.org_ e _mybank.com_).

{{index "Access-Control-Allow-Origin header", "cross-domain request"}}

Isso pode ser um problema irritante ao construir sistemas que querem acessar vários domínios por razões legítimas. Felizmente, ((servidores)) podem incluir um ((cabeçalho)) assim em sua ((resposta)) para indicar explicitamente ao navegador que está tudo bem a requisição vir de outro domínio:

```{lang: null}
Access-Control-Allow-Origin: *
```

## Apreciando o HTTP

{{index client, HTTP, [interface, HTTP]}}

Ao construir um sistema que requer ((comunicação)) entre um programa JavaScript rodando no ((navegador)) (lado do cliente) e um programa em um ((servidor)) (lado do servidor), existem várias formas diferentes de modelar essa comunicação.

{{index [network, abstraction], abstraction}}

Um modelo comumente usado é o de _((chamadas de procedimento remoto))_. Neste modelo, a comunicação segue os padrões de chamadas de função normais, exceto que a função está na verdade rodando em outra máquina. Chamá-la envolve fazer uma requisição ao servidor que inclui o nome da função e argumentos. A resposta a essa requisição contém o valor retornado.

Ao pensar em termos de chamadas de procedimento remoto, HTTP é apenas um veículo para comunicação, e você provavelmente escreverá uma camada de abstração que o esconda inteiramente.

{{index "media type", "document format", [method, HTTP]}}

Outra abordagem é construir sua comunicação ao redor do conceito de ((recursos)) e métodos ((HTTP)). Em vez de um procedimento remoto chamado `addUser`, você usa uma requisição `PUT` para `/users/larry`. Em vez de codificar as propriedades desse usuário em argumentos de função, você define um formato de documento JSON (ou usa um formato existente) que represente um usuário. O corpo da requisição `PUT` para criar um novo recurso é então tal documento. Um recurso é buscado fazendo uma requisição `GET` para a URL do recurso (por exemplo, `/users/larry`), que novamente retorna o documento representando o recurso.

Esta segunda abordagem facilita o uso de alguns dos recursos que o HTTP fornece, como suporte para cache de recursos (manter uma cópia de um recurso no cliente para acesso rápido). Os conceitos usados em HTTP, que são bem projetados, podem fornecer um conjunto útil de princípios para projetar sua interface de servidor.

## Segurança e HTTPS

{{index "man-in-the-middle", security, HTTPS, [network, security]}}

Dados viajando pela internet tendem a seguir um caminho longo e perigoso. Para chegar ao seu destino, eles precisam passar por qualquer coisa, desde hotspots Wi-Fi de cafeterias até redes controladas por várias empresas e estados. Em qualquer ponto ao longo de sua rota, eles podem ser inspecionados ou até modificados.

{{index tampering}}

Se é importante que algo permaneça secreto, como a ((senha)) de sua conta de ((email)), ou que chegue ao seu destino sem modificação, como o número da conta para a qual você transfere dinheiro pelo site do seu banco, HTTP simples não é bom o suficiente.

{{index cryptography, encryption}}

{{indexsee "Secure HTTP", HTTPS, [browser, security]}}

O protocolo ((HTTP)) seguro, usado para ((URL))s que começam com _https://_, envolve o tráfego HTTP de uma forma que torna mais difícil ler e adulterar. Antes de trocar dados, o cliente verifica que o servidor é quem ele diz ser pedindo a ele que prove que possui um ((certificado)) criptográfico emitido por uma autoridade certificadora que o navegador reconhece. Em seguida, todos os dados passando pela ((conexão)) são criptografados de uma forma que deve prevenir espionagem e adulteração.

Assim, quando funciona corretamente, ((HTTPS)) impede que outras pessoas se passem pelo website com o qual você está tentando falar _e_ bisbilhotem sua comunicação. Não é perfeito, e houve vários incidentes onde HTTPS falhou por causa de certificados forjados ou roubados e software defeituoso, mas é _muito_ mais seguro que HTTP simples.

{{id forms}}

## Campos de formulário

Formulários foram originalmente projetados para a web pré-JavaScript para permitir que websites enviassem informações submetidas pelo usuário em uma requisição HTTP. Este design assume que a interação com o servidor sempre acontece navegando para uma nova página.

{{index [DOM, fields]}}

No entanto, os elementos de formulário fazem parte do DOM, como o resto da página, e os elementos DOM que representam ((campo))s de formulário suportam uma série de propriedades e eventos que não estão presentes em outros elementos. Estes tornam possível inspecionar e manipular tais campos de entrada com programas JavaScript e fazer coisas como adicionar nova funcionalidade a um formulário ou usar formulários e campos como blocos de construção em uma aplicação JavaScript.

{{index "form (HTML tag)"}}

Um formulário web consiste em qualquer número de ((campo))s de entrada agrupados em uma tag `<form>`. HTML permite vários estilos diferentes de campos, variando de checkboxes simples liga/desliga a menus drop-down e campos para entrada de texto. Este livro não tentará discutir todos os tipos de campos de forma abrangente, mas vamos começar com uma visão geral aproximada.

{{index "input (HTML tag)", "type attribute"}}

Muitos tipos de campos usam a tag `<input>`. O atributo `type` desta tag é usado para selecionar o estilo do campo. Estes são alguns tipos `<input>` comumente usados:

{{index "password field", checkbox, "radio button", "file field"}}

{{table {cols: [1,5]}}}

| `text`     | Um ((campo de texto)) de linha única
| `password` | Igual a `text` mas esconde o texto digitado
| `checkbox` | Um interruptor liga/desliga
| `color`    | Uma cor
| `date`     | Uma data do calendário
| `radio`    | (Parte de) um campo de ((múltipla escolha))
| `file`     | Permite ao usuário escolher um arquivo de seu computador

{{index "value attribute", "checked attribute", "form (HTML tag)"}}

Campos de formulário não precisam necessariamente aparecer dentro de uma tag `<form>`. Você pode colocá-los em qualquer lugar na página. Tais campos sem formulário não podem ser ((submetidos)) (apenas um formulário inteiro pode), mas ao responder a entrada com JavaScript, frequentemente não queremos submeter nossos campos normalmente de qualquer forma.

```{lang: html}
<p><input type="text" value="abc"> (text)</p>
<p><input type="password" value="abc"> (password)</p>
<p><input type="checkbox" checked> (checkbox)</p>
<p><input type="color" value="orange"> (color)</p>
<p><input type="date" value="2023-10-13"> (date)</p>
<p><input type="radio" value="A" name="choice">
   <input type="radio" value="B" name="choice" checked>
   <input type="radio" value="C" name="choice"> (radio)</p>
<p><input type="file"> (file)</p>
```

{{if book

Os campos criados com este código HTML se parecem com isto:

{{figure {url: "img/form_fields.png", alt: "Screenshot showing various types of input tags", width: "4cm"}}}

if}}

A interface JavaScript para tais elementos difere com o tipo do elemento.

{{index "textarea (HTML tag)", "text field"}}

Campos de texto multilinha têm sua própria tag, `<textarea>`, principalmente porque usar um atributo para especificar um valor inicial multilinha seria estranho. A tag `<textarea>` requer uma tag de fechamento `</textarea>` correspondente e usa o texto entre essas duas, em vez do atributo `value`, como texto inicial.

```{lang: html}
<textarea>
one
two
three
</textarea>
```

{{index "select (HTML tag)", "option (HTML tag)", "multiple choice", "drop-down menu"}}

Finalmente, a tag `<select>` é usada para criar um campo que permite ao usuário selecionar entre várias opções predefinidas.

```{lang: html}
<select>
  <option>Pancakes</option>
  <option>Pudding</option>
  <option>Ice cream</option>
</select>
```

{{if book

Tal campo se parece com isto:

{{figure {url: "img/form_select.png", alt: "Screenshot showing a select field", width: "4cm"}}}

if}}

{{index "change event"}}

Sempre que o valor de um campo de formulário muda, ele dispara um evento `"change"`.

## Foco

{{index keyboard, focus}}

{{indexsee "keyboard focus", focus}}

Diferente da maioria dos elementos em documentos HTML, campos de formulário podem receber _((foco)) do teclado_. Quando clicados, movidos com [tab]{keyname}, ou ativados de alguma outra forma, eles se tornam o elemento atualmente ativo e o receptor de ((entrada)) do teclado.

{{index "option (HTML tag)", "select (HTML tag)"}}

Assim, você pode digitar em um ((campo de texto)) apenas quando ele está com foco. Outros campos respondem diferentemente a eventos de teclado. Por exemplo, um menu `<select>` tenta se mover para a opção que contém o texto que o usuário digitou e responde às teclas de seta movendo sua seleção para cima e para baixo.

{{index "focus method", "blur method", "activeElement property"}}

Podemos controlar o ((foco)) a partir de JavaScript com os métodos `focus` e `blur`. O primeiro move o foco para o elemento DOM no qual é chamado, e o segundo remove o foco. O valor em `document.activeElement` corresponde ao elemento atualmente com foco.

```{lang: html}
<input type="text">
<script>
  document.querySelector("input").focus();
  console.log(document.activeElement.tagName);
  // → INPUT
  document.querySelector("input").blur();
  console.log(document.activeElement.tagName);
  // → BODY
</script>
```

{{index "autofocus attribute"}}

Para algumas páginas, espera-se que o usuário queira interagir com um campo de formulário imediatamente. JavaScript pode ser usado para dar ((foco)) a este campo quando o documento é carregado, mas HTML também fornece o atributo `autofocus`, que produz o mesmo efeito enquanto deixa o navegador saber o que estamos tentando alcançar. Isso dá ao navegador a opção de desabilitar o comportamento quando não é apropriado, como quando o usuário colocou o foco em outra coisa.

{{index "tab key", keyboard, "tabindex attribute", "a (HTML tag)"}}

Navegadores permitem que o usuário mova o foco pelo documento pressionando [tab]{keyname} para mover para o próximo elemento focalizável, e [shift-tab]{keyname} para voltar ao elemento anterior. Por padrão, os elementos são visitados na ordem em que aparecem no documento. É possível usar o atributo `tabindex` para mudar esta ordem. O exemplo de documento a seguir permitirá que o foco pule do campo de texto para o botão OK, em vez de passar pelo link de ajuda primeiro:

```{lang: html, focus: true}
<input type="text" tabindex=1> <a href=".">(help)</a>
<button onclick="console.log('ok')" tabindex=2>OK</button>
```

{{index "tabindex attribute"}}

Por padrão, a maioria dos tipos de elementos HTML não pode receber foco. Você pode adicionar um atributo `tabindex` a qualquer elemento para torná-lo focalizável. Um `tabindex` de 0 torna um elemento focalizável sem afetar a ordem de foco.

## Campos desabilitados

{{index "disabled attribute"}}

Todos os ((campo))s de ((formulário)) podem ser _desabilitados_ através de seu atributo `disabled`. É um ((atributo)) que pode ser especificado sem valor — o fato de estar presente já desabilita o elemento.

```{lang: html}
<button>I'm all right</button>
<button disabled>I'm out</button>
```

Campos desabilitados não podem receber ((foco)) ou ser alterados, e os navegadores os fazem parecer cinza e desbotados.

{{if book

{{figure {url: "img/button_disabled.png", alt: "Screenshot of a disabled button", width: "3cm"}}}

if}}

{{index "user experience"}}

Quando um programa está no processo de tratar uma ação causada por algum ((botão)) ou outro controle que pode requerer comunicação com o servidor e, portanto, demorar um pouco, pode ser uma boa ideia desabilitar o controle até que a ação termine. Dessa forma, quando o usuário fica impaciente e clica novamente, não repete acidentalmente sua ação.

## O formulário como um todo

{{index "array-like object", "form (HTML tag)", "form property", "elements property"}}

Quando um ((campo)) está contido em um elemento `<form>`, seu elemento DOM terá uma propriedade `form` ligando de volta ao elemento DOM do formulário. O elemento `<form>`, por sua vez, tem uma propriedade chamada `elements` que contém uma coleção semelhante a um array dos campos dentro dele.

{{index "elements property", "name attribute"}}

O atributo `name` de um campo de formulário determina a forma como seu valor será identificado quando o formulário for ((submetido)). Ele também pode ser usado como nome de propriedade ao acessar a propriedade `elements` do formulário, que age tanto como um objeto semelhante a array (acessível por número) quanto como um ((mapa)) (acessível por nome).

```{lang: html}
<form action="example/submit.html">
  Name: <input type="text" name="name"><br>
  Password: <input type="password" name="password"><br>
  <button type="submit">Log in</button>
</form>
<script>
  let form = document.querySelector("form");
  console.log(form.elements[1].type);
  // → password
  console.log(form.elements.password.type);
  // → password
  console.log(form.elements.name.form == form);
  // → true
</script>
```

{{index "button (HTML tag)", "type attribute", submit, "enter key"}}

Um botão com um atributo `type` de `submit` irá, quando pressionado, fazer com que o formulário seja submetido. Pressionar [enter]{keyname} quando um campo de formulário está com foco tem o mesmo efeito.

{{index "submit event", "event handling", "preventDefault method", "page reload", "GET method", "POST method"}}

Submeter um ((formulário)) normalmente significa que o ((navegador)) navega para a página indicada pelo atributo `action` do formulário, usando uma requisição `GET` ou `POST`. Mas antes que isso aconteça, um evento `"submit"` é disparado. Você pode tratar este evento com JavaScript e prevenir este comportamento padrão chamando `preventDefault` no objeto do evento.

```{lang: html}
<form>
  Value: <input type="text" name="value">
  <button type="submit">Save</button>
</form>
<script>
  let form = document.querySelector("form");
  form.addEventListener("submit", event => {
    console.log("Saving value", form.elements.value.value);
    event.preventDefault();
  });
</script>
```

{{index "submit event", validation}}

Interceptar eventos `"submit"` em JavaScript tem vários usos. Podemos escrever código para verificar se os valores que o usuário inseriu fazem sentido e imediatamente mostrar uma mensagem de erro em vez de submeter o formulário. Ou podemos desabilitar a forma regular de submeter o formulário inteiramente, como no exemplo, e ter nosso programa tratando a entrada, possivelmente usando `fetch` para enviá-la a um servidor sem recarregar a página.

## Campos de texto

{{index "value attribute", "input (HTML tag)", "text field", "textarea (HTML tag)", [DOM, fields], [interface, object]}}

Campos criados por tags `<textarea>`, ou tags `<input>` com tipo `text` ou `password`, compartilham uma interface comum. Seus elementos DOM têm uma propriedade `value` que contém seu conteúdo atual como um valor de string. Definir esta propriedade para outra string muda o conteúdo do campo.

{{index "selectionStart property", "selectionEnd property"}}

As propriedades `selectionStart` e `selectionEnd` dos ((campo de texto))s nos dão informações sobre o ((cursor)) e a ((seleção)) no ((texto)). Quando nada está selecionado, essas duas propriedades contêm o mesmo número, indicando a posição do cursor. Por exemplo, 0 indica o início do texto, e 10 indica que o cursor está após o 10º ((caractere)). Quando parte do campo está selecionada, as duas propriedades serão diferentes, nos dando o início e o fim do texto selecionado. Como `value`, essas propriedades também podem ser escritas.

{{index Khasekhemwy, "textarea (HTML tag)", keyboard, "event handling"}}

Imagine que você está escrevendo um artigo sobre Khasekhemwy, último faraó da Segunda Dinastia, mas tem alguma dificuldade em soletrar seu nome. O código a seguir conecta uma tag `<textarea>` com um manipulador de eventos que, quando você pressiona F2, insere a string "Khasekhemwy" para você.

```{lang: html}
<textarea></textarea>
<script>
  let textarea = document.querySelector("textarea");
  textarea.addEventListener("keydown", event => {
    if (event.key == "F2") {
      replaceSelection(textarea, "Khasekhemwy");
      event.preventDefault();
    }
  });
  function replaceSelection(field, word) {
    let from = field.selectionStart, to = field.selectionEnd;
    field.value = field.value.slice(0, from) + word +
                  field.value.slice(to);
    // Colocar o cursor após a palavra
    field.selectionStart = from + word.length;
    field.selectionEnd = from + word.length;
  }
</script>
```

{{index "replaceSelection function", "text field"}}

A função `replaceSelection` substitui a parte atualmente selecionada do conteúdo de um campo de texto pela palavra dada e então move o ((cursor)) para após essa palavra para que o usuário possa continuar digitando.

{{index "change event", "input event"}}

O evento `"change"` para um ((campo de texto)) não é disparado toda vez que algo é digitado. Em vez disso, ele é disparado quando o campo perde o ((foco)) após seu conteúdo ter sido alterado. Para responder imediatamente a mudanças em um campo de texto, você deve registrar um manipulador para o evento `"input"`, que é disparado toda vez que o usuário digita um caractere, deleta texto ou de outra forma manipula o conteúdo do campo.

O exemplo a seguir mostra um campo de texto e um contador exibindo o comprimento atual do texto no campo:

```{lang: html}
<input type="text"> length: <span id="length">0</span>
<script>
  let text = document.querySelector("input");
  let output = document.querySelector("#length");
  text.addEventListener("input", () => {
    output.textContent = text.value.length;
  });
</script>
```

## Checkboxes e botões de rádio

{{index "input (HTML tag)", "checked attribute"}}

Um campo de ((checkbox)) é um interruptor binário. Seu valor pode ser extraído ou alterado através de sua propriedade `checked`, que contém um valor booleano.

```{lang: html}
<label>
  <input type="checkbox" id="purple"> Make this page purple
</label>
<script>
  let checkbox = document.querySelector("#purple");
  checkbox.addEventListener("change", () => {
    document.body.style.background =
      checkbox.checked ? "mediumpurple" : "";
  });
</script>
```

{{index "for attribute", "id attribute", focus, "label (HTML tag)", labeling}}

A tag `<label>` associa um trecho do documento a um ((campo)) de entrada. Clicar em qualquer lugar no rótulo ativará o campo, que o foca e alterna seu valor quando é um checkbox ou botão de rádio.

{{index "input (HTML tag)", "multiple-choice"}}

Um ((botão de rádio)) é semelhante a um checkbox, mas está implicitamente ligado a outros botões de rádio com o mesmo atributo `name` para que apenas um deles possa estar ativo a qualquer momento.

```{lang: html}
Color:
<label>
  <input type="radio" name="color" value="orange"> Orange
</label>
<label>
  <input type="radio" name="color" value="lightgreen"> Green
</label>
<label>
  <input type="radio" name="color" value="lightblue"> Blue
</label>
<script>
  let buttons = document.querySelectorAll("[name=color]");
  for (let button of Array.from(buttons)) {
    button.addEventListener("change", () => {
      document.body.style.background = button.value;
    });
  }
</script>
```

{{index "name attribute", "querySelectorAll method"}}

Os ((colchetes)) na consulta CSS dada a `querySelectorAll` são usados para corresponder atributos. Ela seleciona elementos cujo atributo `name` é `"color"`.

## Campos de seleção

{{index "select (HTML tag)", "multiple-choice", "option (HTML tag)"}}

Campos de seleção são conceitualmente similares a botões de rádio — eles também permitem ao usuário escolher entre um conjunto de opções. Mas onde um botão de rádio coloca o layout das opções sob nosso controle, a aparência de uma tag `<select>` é determinada pelo navegador.

{{index "multiple attribute", "drop-down menu"}}

Campos de seleção também têm uma variante mais parecida com uma lista de checkboxes do que com botões de rádio. Quando recebe o atributo `multiple`, uma tag `<select>` permitirá ao usuário selecionar qualquer número de opções, em vez de apenas uma opção. Enquanto um campo de seleção regular é desenhado como um controle _drop-down_, que mostra as opções inativas apenas quando você o abre, um campo com `multiple` habilitado mostra múltiplas opções ao mesmo tempo, permitindo ao usuário habilitá-las ou desabilitá-las individualmente.

{{index "option (HTML tag)", "value attribute"}}

Cada tag `<option>` tem um valor. Este valor pode ser definido com um atributo `value`. Quando isso não é dado, o ((texto)) dentro da opção contará como seu valor. A propriedade `value` de um elemento `<select>` reflete a opção atualmente selecionada. Para um campo `multiple`, porém, esta propriedade não significa muito, pois dará o valor de apenas _uma_ das opções atualmente selecionadas.

{{index "select (HTML tag)", "options property", "selected attribute"}}

As tags `<option>` para um campo `<select>` podem ser acessadas como um objeto semelhante a array através da propriedade `options` do campo. Cada opção tem uma propriedade chamada `selected`, que indica se aquela opção está atualmente selecionada. A propriedade também pode ser escrita para selecionar ou deselecionar uma opção.

{{index "multiple attribute", "binary number"}}

Este exemplo extrai os valores selecionados de um campo de seleção `multiple` e os usa para compor um número binário a partir de bits individuais. Mantenha [ctrl]{keyname} (ou [command]{keyname} em um Mac) pressionado para selecionar múltiplas opções.

```{lang: html}
<select multiple>
  <option value="1">0001</option>
  <option value="2">0010</option>
  <option value="4">0100</option>
  <option value="8">1000</option>
</select> = <span id="output">0</span>
<script>
  let select = document.querySelector("select");
  let output = document.querySelector("#output");
  select.addEventListener("change", () => {
    let number = 0;
    for (let option of Array.from(select.options)) {
      if (option.selected) {
        number += Number(option.value);
      }
    }
    output.textContent = number;
  });
</script>
```

## Campos de arquivo

{{index file, "hard drive", "filesystem", security, "file field", "input (HTML tag)"}}

Campos de arquivo foram originalmente projetados como uma forma de ((enviar)) arquivos da máquina do usuário através de um formulário. Em navegadores modernos, eles também fornecem uma forma de ler tais arquivos a partir de programas JavaScript. O campo age como uma espécie de porteiro. O script não pode simplesmente começar a ler arquivos privados do computador do usuário, mas se o usuário selecionar um arquivo em tal campo, o navegador interpreta essa ação como significando que o script pode ler o arquivo.

Um campo de arquivo normalmente se parece com um botão rotulado com algo como "escolher arquivo" ou "procurar", com informações sobre o arquivo escolhido ao lado.

```{lang: html}
<input type="file">
<script>
  let input = document.querySelector("input");
  input.addEventListener("change", () => {
    if (input.files.length > 0) {
      let file = input.files[0];
      console.log("You chose", file.name);
      if (file.type) console.log("It has type", file.type);
    }
  });
</script>
```

{{index "multiple attribute", "files property"}}

A propriedade `files` de um elemento de ((campo de arquivo)) é um objeto semelhante a ((array)) (novamente, não um array real) contendo os arquivos escolhidos no campo. É inicialmente vazio. A razão de não haver simplesmente uma propriedade `file` é que campos de arquivo também suportam um atributo `multiple`, que torna possível selecionar múltiplos arquivos ao mesmo tempo.

{{index "File type"}}

Os objetos em `files` têm propriedades como `name` (o nome do arquivo), `size` (o tamanho do arquivo em bytes, que são blocos de 8 bits) e `type` (o tipo de mídia do arquivo, como `text/plain` ou `image/jpeg`).

{{index ["asynchronous programming", "reading files"], "file reading", "FileReader class"}}

{{id filereader}}

O que ele não tem é uma propriedade que contenha o conteúdo do arquivo. Acessar isso é um pouco mais complicado. Como ler um arquivo do disco pode levar tempo, a interface é assíncrona para evitar congelar a janela.

```{lang: html}
<input type="file" multiple>
<script>
  let input = document.querySelector("input");
  input.addEventListener("change", () => {
    for (let file of Array.from(input.files)) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        console.log("File", file.name, "starts with",
                    reader.result.slice(0, 20));
      });
      reader.readAsText(file);
    }
  });
</script>
```

{{index "FileReader class", "load event", "readAsText method", "result property"}}

A leitura de um arquivo é feita criando um objeto `FileReader`, registrando um manipulador de evento `"load"` para ele, e chamando seu método `readAsText`, dando-lhe o arquivo que queremos ler. Uma vez que o carregamento termina, a propriedade `result` do leitor contém o conteúdo do arquivo.

{{index "error event", "FileReader class", "Promise class"}}

`FileReader`s também disparam um evento `"error"` quando a leitura do arquivo falha por qualquer razão. O objeto de erro em si acabará na propriedade `error` do leitor. Esta interface foi projetada antes de promises se tornarem parte da linguagem. Você poderia envolvê-la em uma promise assim:

```
function readFileText(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.addEventListener(
      "load", () => resolve(reader.result));
    reader.addEventListener(
      "error", () => reject(reader.error));
    reader.readAsText(file);
  });
}
```

## Armazenando dados no lado do cliente

{{index "web application"}}

Páginas ((HTML)) simples com um pouco de JavaScript podem ser um ótimo formato para "((mini aplicações))" — pequenos programas auxiliares que automatizam tarefas básicas. Conectando alguns ((campo))s de formulário com manipuladores de eventos, você pode fazer qualquer coisa, desde converter entre centímetros e polegadas até computar senhas a partir de uma senha mestra e um nome de website.

{{index persistence, [binding, "as state"], [browser, storage]}}

Quando tal aplicação precisa lembrar de algo entre sessões, você não pode usar variáveis JavaScript — essas são descartadas toda vez que a página é fechada. Você poderia configurar um servidor, conectá-lo à internet, e ter sua aplicação armazenando algo lá (veremos como fazer isso no [Capítulo ?](node)). Mas isso é muito trabalho e complexidade extra. Às vezes é suficiente apenas manter os dados no ((navegador)).

{{index "localStorage object", "setItem method", "getItem method", "removeItem method"}}

O objeto `localStorage` pode ser usado para armazenar dados de uma forma que sobrevive a ((recarregamento de página))s. Este objeto permite arquivar valores de string sob nomes.

```
localStorage.setItem("username", "marijn");
console.log(localStorage.getItem("username"));
// → marijn
localStorage.removeItem("username");
```

{{index "localStorage object"}}

Um valor em `localStorage` permanece até ser sobrescrito ou removido com `removeItem`, ou o usuário limpar seus dados locais.

{{index security}}

Sites de diferentes ((domínios)) recebem compartimentos de armazenamento diferentes. Isso significa que dados armazenados em `localStorage` por um determinado website podem, em princípio, ser lidos (e sobrescritos) apenas por scripts nesse mesmo site.

{{index "localStorage object"}}

Navegadores impõem um limite no tamanho dos dados que um site pode armazenar em `localStorage`. Essa restrição, junto com o fato de que encher os ((discos rígidos)) das pessoas com lixo não é realmente lucrativo, impede o recurso de ocupar muito espaço.

{{index "localStorage object", "note-taking example", "select (HTML tag)", "button (HTML tag)", "textarea (HTML tag)"}}

O código a seguir implementa uma aplicação rústica de anotações. Ela mantém um conjunto de notas nomeadas e permite ao usuário editar notas e criar novas.

```{lang: html, startCode: true}
Notes: <select></select> <button>Add</button><br>
<textarea style="width: 100%"></textarea>

<script>
  let list = document.querySelector("select");
  let note = document.querySelector("textarea");

  let state;
  function setState(newState) {
    list.textContent = "";
    for (let name of Object.keys(newState.notes)) {
      let option = document.createElement("option");
      option.textContent = name;
      if (newState.selected == name) option.selected = true;
      list.appendChild(option);
    }
    note.value = newState.notes[newState.selected];

    localStorage.setItem("Notes", JSON.stringify(newState));
    state = newState;
  }
  setState(JSON.parse(localStorage.getItem("Notes")) ?? {
    notes: {"shopping list": "Carrots\nRaisins"},
    selected: "shopping list"
  });

  list.addEventListener("change", () => {
    setState({notes: state.notes, selected: list.value});
  });
  note.addEventListener("change", () => {
    let {selected} = state;
    setState({
      notes: {...state.notes, [selected]: note.value},
      selected
    });
  });
  document.querySelector("button")
    .addEventListener("click", () => {
      let name = prompt("Note name");
      if (name) setState({
        notes: {...state.notes, [name]: ""},
        selected: name
      });
    });
</script>
```

{{index "getItem method", JSON, "?? operator", "default value"}}

O script obtém seu estado inicial a partir do valor `"Notes"` armazenado em `localStorage` ou, se estiver faltando, cria um estado de exemplo que tem apenas uma lista de compras. Ler um campo que não existe do `localStorage` retornará `null`. Passar `null` para `JSON.parse` fará com que ele analise a string `"null"` e retorne `null`. Assim, o operador `??` pode ser usado para fornecer um valor padrão em uma situação como esta.

O método `setState` garante que o DOM esteja mostrando um determinado estado e armazena o novo estado no `localStorage`. Manipuladores de eventos chamam esta função para mover para um novo estado.

{{index [object, creation], property, "computed property"}}

A sintaxe `...` no exemplo é usada para criar um novo objeto que é um clone do antigo `state.notes`, mas com uma propriedade adicionada ou sobrescrita. Ela usa a sintaxe de ((spread)) para primeiro adicionar as propriedades do objeto antigo e depois definir uma nova propriedade. A notação de ((colchetes)) no literal de objeto é usada para criar uma propriedade cujo nome é baseado em algum valor dinâmico.

{{index "sessionStorage object", [browser, storage]}}

Existe outro objeto, semelhante a `localStorage`, chamado `sessionStorage`. A diferença entre os dois é que o conteúdo de `sessionStorage` é esquecido no final de cada _((sessão))_, que para a maioria dos navegadores significa sempre que o navegador é fechado.

## Resumo

Neste capítulo, discutimos como o protocolo HTTP funciona. Um _cliente_ envia uma requisição, que contém um método (geralmente `GET`) e um caminho que identifica um recurso. O _servidor_ então decide o que fazer com a requisição e responde com um código de status e um corpo de resposta. Tanto requisições quanto respostas podem conter cabeçalhos que fornecem informações adicionais.

A interface através da qual o JavaScript do navegador pode fazer requisições HTTP é chamada `fetch`. Fazer uma requisição se parece com isto:

```
fetch("/18_http.html").then(r => r.text()).then(text => {
  console.log(`The page starts with ${text.slice(0, 15)}`);
});
```

Navegadores fazem requisições `GET` para buscar os recursos necessários para exibir uma página web. Uma página também pode conter formulários, que permitem que informações inseridas pelo usuário sejam enviadas como uma requisição para uma nova página quando o formulário é submetido.

HTML pode representar vários tipos de campos de formulário, como campos de texto, checkboxes, campos de múltipla escolha e seletores de arquivo. Tais campos podem ser inspecionados e manipulados com JavaScript. Eles disparam o evento `"change"` quando alterados, disparam o evento `"input"` quando texto é digitado, e recebem eventos de teclado quando têm foco do teclado. Propriedades como `value` (para campos de texto e select) ou `checked` (para checkboxes e botões de rádio) são usadas para ler ou definir o conteúdo do campo.

Quando um formulário é submetido, um evento `"submit"` é disparado nele. Um manipulador JavaScript pode chamar `preventDefault` nesse evento para desabilitar o comportamento padrão do navegador. Elementos de campos de formulário também podem ocorrer fora de uma tag de formulário.

Quando o usuário selecionou um arquivo de seu sistema de arquivos local em um campo de seleção de arquivo, a interface `FileReader` pode ser usada para acessar o conteúdo deste arquivo a partir de um programa JavaScript.

Os objetos `localStorage` e `sessionStorage` podem ser usados para salvar informações de uma forma que sobrevive a recarregamentos de página. O primeiro objeto salva os dados para sempre (ou até o usuário decidir limpá-los), e o segundo os salva até que o navegador seja fechado.

## Exercícios

### Negociação de conteúdo

{{index "Accept header", "media type", "document format", "content negotiation (exercise)"}}

Uma das coisas que o HTTP pode fazer é chamada _negociação de conteúdo_. O cabeçalho de requisição `Accept` é usado para dizer ao servidor que tipo de documento o cliente gostaria de obter. Muitos servidores ignoram este cabeçalho, mas quando um servidor conhece várias formas de codificar um recurso, ele pode olhar este cabeçalho e enviar a que o cliente preferir.

{{index "MIME type"}}

A URL [_https://eloquentjavascript.net/author_](https://eloquentjavascript.net/author) é configurada para responder com texto simples, HTML ou JSON, dependendo do que o cliente pedir. Esses formatos são identificados pelos _((tipo de mídia))s_ padronizados `text/plain`, `text/html` e `application/json`.

{{index "headers property", "fetch function"}}

Envie requisições para buscar todos os três formatos deste recurso. Use a propriedade `headers` no objeto de opções passado para `fetch` para definir o cabeçalho chamado `Accept` para o tipo de mídia desejado.

Finalmente, tente pedir o tipo de mídia `application/rainbows+unicorns` e veja qual código de status isso produz.

{{if interactive

```{test: no}
// Seu código aqui.
```

if}}

{{hint

{{index "content negotiation (exercise)"}}

Baseie seu código nos exemplos de `fetch` [anteriores no capítulo](http#fetch).

{{index "406 (HTTP status code)", "Accept header"}}

Pedir um tipo de mídia falso retornará uma resposta com código 406, "Not acceptable", que é o código que um servidor deve retornar quando não pode atender ao cabeçalho `Accept`.

hint}}

### Uma bancada de JavaScript

{{index "JavaScript console", "workbench (exercise)"}}

Construa uma interface que permita aos usuários digitar e executar pedaços de código JavaScript.

{{index "textarea (HTML tag)", "button (HTML tag)", "Function constructor", "error message"}}

Coloque um botão ao lado de um campo `<textarea>` que, quando pressionado, usa o construtor `Function` que vimos no [Capítulo ?](modules#eval) para envolver o texto em uma função e chamá-la. Converta o valor de retorno da função, ou qualquer erro que ela gere, em uma string e exiba-o abaixo do campo de texto.

{{if interactive

```{lang: html, test: no}
<textarea id="code">return "hi";</textarea>
<button id="button">Run</button>
<pre id="output"></pre>

<script>
  // Seu código aqui.
</script>
```

if}}

{{hint

{{index "click event", "mousedown event", "Function constructor", "workbench (exercise)"}}

Use `document.querySelector` ou `document.getElementById` para acessar os elementos definidos em seu HTML. Um manipulador de eventos para `"click"` ou `"mousedown"` no botão pode obter a propriedade `value` do campo de texto e chamar `Function` nele.

{{index "try keyword", "exception handling"}}

Certifique-se de envolver tanto a chamada a `Function` quanto a chamada ao seu resultado em um bloco `try` para poder capturar as exceções que ele produz. Neste caso, realmente não sabemos que tipo de exceção estamos procurando, então capture tudo.

{{index "textContent property", output, text, "createTextNode method", "newline character"}}

A propriedade `textContent` do elemento de saída pode ser usada para preenchê-lo com uma mensagem de string. Ou, se quiser manter o conteúdo antigo, crie um novo nó de texto usando `document.createTextNode` e adicione-o ao elemento. Lembre-se de adicionar um caractere de nova linha ao final para que nem toda a saída apareça em uma única linha.

hint}}

### Jogo da Vida de Conway

{{index "game of life (exercise)", "artificial life", "Conway's Game of Life"}}

O Jogo da Vida de Conway é uma ((simulação)) simples que cria "vida" artificial em uma ((grade)), cada célula da qual está viva ou morta. A cada ((geração)) (turno), as seguintes regras são aplicadas:

* Qualquer ((célula)) viva com menos de duas ou mais de três ((vizinhas)) vivas morre.

* Qualquer célula viva com duas ou três vizinhas vivas sobrevive para a próxima geração.

* Qualquer célula morta com exatamente três vizinhas vivas se torna uma célula viva.

Um _vizinho_ é definido como qualquer célula adjacente, incluindo diagonalmente adjacentes.

{{index "pure function"}}

Note que essas regras são aplicadas à grade inteira de uma vez, não um quadrado de cada vez. Isso significa que a contagem de vizinhos é baseada na situação no início da geração, e mudanças acontecendo em células vizinhas durante esta geração não devem influenciar o novo estado de uma determinada célula.

{{index "Math.random function"}}

Implemente este jogo usando qualquer ((estrutura de dados)) que achar apropriada. Use `Math.random` para popular a grade com um padrão aleatório inicialmente. Exiba-o como uma grade de campos de ((checkbox)), com um ((botão)) ao lado para avançar para a próxima ((geração)). Quando o usuário marca ou desmarca os checkboxes, suas mudanças devem ser incluídas ao calcular a próxima geração.

{{if interactive

```{lang: html, test: no}
<div id="grid"></div>
<button id="next">Next generation</button>

<script>
  // Seu código aqui.
</script>
```

if}}

{{hint

{{index "game of life (exercise)"}}

Para resolver o problema de ter as mudanças conceitualmente acontecendo ao mesmo tempo, tente ver a computação de uma ((geração)) como uma ((função pura)), que recebe uma ((grade)) e produz uma nova grade que representa o próximo turno.

Representar a matriz pode ser feito com um único array de largura x altura elementos, armazenando valores linha por linha, então, por exemplo, o terceiro elemento na quinta linha é (usando indexação baseada em zero) armazenado na posição 4 x _largura_ + 2. Você pode contar ((vizinhos)) vivos com dois loops aninhados, iterando sobre coordenadas adjacentes em ambas as dimensões. Tome cuidado para não contar células fora do campo e para ignorar a célula no centro, cujos vizinhos estamos contando.

{{index "event handling", "change event"}}

Garantir que mudanças nos ((checkboxes)) tenham efeito na próxima geração pode ser feito de duas formas. Um manipulador de eventos poderia notar essas mudanças e atualizar a grade atual para refleti-las, ou você poderia gerar uma grade nova a partir dos valores nos checkboxes antes de calcular o próximo turno.

Se você optar por manipuladores de eventos, pode querer anexar ((atributos)) que identifiquem a posição que cada checkbox corresponde para que seja fácil descobrir qual célula mudar.

{{index drawing, "table (HTML tag)", "br (HTML tag)"}}

Para desenhar a grade de checkboxes, você pode usar um elemento `<table>` (veja [Capítulo ?](dom#exercise_table)) ou simplesmente colocá-los todos no mesmo elemento e colocar elementos `<br>` (quebra de linha) entre as linhas.

hint}}
