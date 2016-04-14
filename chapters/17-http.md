# HTTP

> O sonho por trás da Web é o de um espaço comum de informações no qual podemos nos comunicar compartilhando informações. Sua universalidade é essencial. O fato de que um link pode apontar para qualquer coisa, seja ela pessoal, local ou global, seja ela um rascunho ou algo refinado.

> — Tim Berners-Lee, The World Wide Web: A very short personal history

O _Hypertext Transfer Protocol_, já mencionado no [capítulo 12](./12-javascript-e-o-navegador.md), é o mecanismo no qual dados são requisitados e entregues na _World Wide Web_. Esse capítulo descreve o protocolo com mais detalhes e explica como o JavaScript executado no navegador tem acesso a ele.

## O Protocolo

Se você digitar _eloquentjavascript.net/17_http.html_ na barra de endereços do seu navegador, ele irá, primeiramente, procurar o endereço do servidor associado ao domínio _eloquentjavascript.net_ e, em seguida, tentar abrir uma conexão TCP com ele na porta 80, a porta padrão para tráfego HTTP. Se o servidor existir e aceitar a conexão, o navegador enviará algo parecido com:

```
GET /17_http.html HTTP/1.1
Host: eloquentjavascript.net
User-Agent: Your browser's name
```

Então, por meio da mesma conexão, o servidor responde.

```
HTTP/1.1 200 OK
Content-Length: 65585
Content-Type: text/html
Last-Modified: Wed, 09 Apr 2014 10:48:09 GMT

<!doctype html>
... the rest of the document
```

O navegador participa da resposta após a linha em branco e a mostra como um documento HTML.

A informação enviada pelo cliente é chamada de requisição (_request_) e inicia com essa linha:

```
GET /17_http.html HTTP/1.1
```

A primeira palavra é o _método_ da requisição. `GET` significa que queremos acessar o recurso em questão. Outros métodos comuns são `DELETE` para deletar um recurso, `PUT` para substituí-lo e `POST` para enviar uma informação. Note que o servidor não é obrigado a processar todas as requisições que receber. Se você acessar um website aleatório e fizer uma requisição `DELETE` em sua página principal, ele provavelmente irá recusar essa ação.

A parte após o nome do método é o caminho do recurso ao qual a requisição está sendo aplicada. No caso mais simples, um recurso é simplesmente um arquivo no servidor, entretanto, o protocolo não requer que o recurso seja necessariamente um arquivo. Um recurso pode ser qualquer coisa que possa ser transferida _como se fosse_ um arquivo. Muitos servidores geram as respostas na medida em que são solicitados. Por exemplo, se você acessar [twitter.com/marijnjh](https://twitter.com/marijnjh), o servidor irá procurar em seu banco de dados por um usuário chamado _marijnjh_ e, se encontrá-lo, irá gerar a página de perfil desse usuário.

Após o caminho do recurso, a primeira linha da requisição menciona `HTTP/1.1` para indicar a versão do protocolo HTTP que está sendo usada.

A resposta do servidor irá iniciar também com a versão, seguida pelo _status_ da resposta, representado primeiramente por um código de três dígitos e, em seguida, por um texto legível.

```
HTTP/1.1 200 OK
```

Os _status code_ (códigos de _status_) que iniciam com o número 2 indicam que a requisição foi bem-sucedida. Códigos que começam com 4, indicam que houve algum problema com a requisição. O código de resposta HTTP provavelmente mais famoso é o 404, que significa que o recurso solicitado não foi encontrado. Códigos que começam com 5 indicam que houve um erro no servidor e que a culpa não é da requisição.

A primeira linha de uma requisição ou resposta pode ser seguida por qualquer quantidade de _headers_ (cabeçalhos). Eles são representados por linhas na forma de "nome: valor" que especificam informações extra sobre a requisição ou resposta. Os _headers_ abaixo fazem parte do exemplo de resposta usado anteriormente:

```
Content-Length: 65585
Content-Type: text/html
Last-Modified: Wed, 09 Apr 2014 10:48:09 GMT
```

Eles nos informam o tamanho e o tipo do documento da resposta. Nesse caso, é um documento HTML com 65.585 bytes. Além disso, ele nos mostra quando foi a última vez que o documento foi modificado.

Na maioria das vezes, o cliente ou o servidor decidem quais _headers_ serão incluídos em uma requisição ou resposta, apesar de alguns serem obrigatórios. Por exemplo, o _header_ `Host`, que especifica o _hostname_, deve ser incluído na requisição pois o servidor pode estar servindo múltiplos _hostnames_ em um mesmo endereço IP e, sem esse _header_, o servidor não saberá qual _host_ o cliente está tentando se comunicar.

Após os _headers_, tanto as requisições quanto as respostas podem incluir uma linha em branco seguida por um _body_ (corpo), que contém os dados que estão sendo enviados. As requisições `GET` e `DELETE` não enviam nenhum tipo dado, mas `PUT` e `POST` enviam. De maneira similar, alguns tipos de resposta, como respostas de erro, não precisam de um _body_.

## Navegadores e o HTTP

Como vimos no exemplo anterior, o navegador irá fazer uma requisição quando submetermos uma URL na barra de endereços. Quando a página HTML resultante faz referências a outros arquivos como imagens e arquivos JavaScript, eles também são requisitados.

Um website razoavelmente complicado pode facilmente ter algo em torno de dez a duzentos recursos. Para ser capaz de buscá-los rapidamente, ao invés de esperar pelo retorno das respostas de cada requisição feita, os navegadores fazem várias requisições simultaneamente. Tais documentos são sempre requisitados usando requisições `GET`.

Páginas HTML podem incluir _formulários_, que permitem ao usuário preencher e enviar informações para o servidor. Esse é um exemplo de um formulário:

```html
<form method="GET" action="example/message.html">
  <p>Name: <input type="text" name="name"></p>
  <p>Message:<br><textarea name="message"></textarea></p>
  <p><button type="submit">Send</button></p>
</form>
```

Esse código descreve um formulário com dois campos: um campo menor que solicita um nome e um campo maior que solicita que o usuário escreva uma mensagem. Quando você clicar no botão _Send_ (enviar), a informação contida nos campos serão convertidas em uma _query string_. Quando o método do atributo do elemento `<form>` for `GET` (ou o método for omitido), a _query string_ é associada à URL contida em `action` e o navegador executa a requisição `GET` para essa URL.

```
GET /example/message.html?name=Jean&message=Yes%3F HTTP/1.1
```

O início de uma _query string_ é indicado por um ponto de interrogação seguido por pares de nomes e valores, correspondendo ao atributo `name` de cada campo do formulário e seus respectivos valores. O caractere `&` é usado para separar os pares.

A mensagem codificada na URL anterior é "Yes?", mesmo que o ponto de interrogação tenha sido substituído por um código estranho. Alguns caracteres nas _query strings_ precisam ser escapados. O ponto de interrogação, representado como `%3F`, é um desses casos. Parece haver uma regra não escrita de que cada formato necessita ter sua própria forma de escapar caracteres. Esse formato que está sendo usado é chamado de _URL encoding_ e utiliza o sinal de porcentagem seguido por dois dígitos hexadecimais que representam o código daquele caractere. Nesse caso, o 3F significa 63 na notação decimal, que é o código do caractere de interrogação. O JavaScript fornece as funções `encodeURIComponent` e `decodeURIComponent` para codificar e decodificar esse formato.

```js
console.log(encodeURIComponent("Hello & goodbye"));
// → Hello%20%26%20goodbye
console.log(decodeURIComponent("Hello%20%26%20goodbye"));
// → Hello & goodbye
```

Se alterarmos o método do atributo do formulário HTML no exemplo anterior para `POST`, a requisição HTTP que será feita para enviar o formulário irá usar o método `POST` e a _query string_ será adicionada ao corpo da requisição, ao invés de ser colocada diretamente na URL.

```
POST /example/message.html HTTP/1.1
Content-length: 24
Content-type: application/x-www-form-urlencoded

name=Jean&message=Yes%3F
```

Por convenção, o método `GET` é usado para requisições que não produzem efeitos colaterais, tais como fazer uma pesquisa. Requisições que alteram alguma coisa no servidor, como criar uma nova conta ou postar uma nova mensagem, devem ser expressadas usando outros métodos, como `POST`. Aplicações _client-side_, como os navegadores, sabem que não devem fazer requisições `POST` cegamente, mas frequentemente farão requisições `GET` implícitas para, por exemplo, pré-carregar um recurso que ele acredita que o usuário irá precisar no curto prazo.

O [próximo capítulo](./18-formularios-e-campos-de-formularios.md) irá retomar o assunto formulários e explicará como podemos desenvolvê-los usando JavaScript.

## XMLHttpRequest

A interface pela qual o JavaScript do navegador pode fazer requisições HTTP é chamada de `XMLHttpRequest` (observe a forma inconsistente de capitalização). Ela foi elaborada pela Microsoft, para o seu navegador Internet Explorer, no final dos anos 90. Naquela época, o formato de arquivo XML era _muito_ popular no contexto dos softwares corporativos, um mundo no qual sempre foi a casa da Microsoft. O formato era tão popular que o acrônimo XML foi adicionado ao início do nome de uma interface para o HTTP, a qual não tinha nenhuma relação com o XML.

Mesmo assim, o nome não é completamente sem sentido. A interface permite que você analise os documentos de resposta como XML, caso queira. Combinar dois conceitos distintos (fazer uma requisição e analisar a resposta) em uma única coisa é com certeza um péssimo design.

Quando a interface `XMLHttpRequest` foi adicionada ao Internet Explorer, foi permitido às pessoas fazerem coisas com JavaScript que eram bem difíceis anteriormente. Por exemplo, websites começaram a mostrar listas de sugestões enquanto o usuário digitava algo em um campo de texto. O script mandava o texto para o servidor usando HTTP enquanto o usuário estivesse digitando. O servidor, que tinha um banco de dados com possíveis entradas, comparava as possíveis entradas com a entrada parcial digitada pelo usuário, enviando de volta possíveis combinações de resultados para mostrar ao usuário. Isso era considerado espetacular, pois as pessoas estavam acostumadas a aguardar por uma atualização completa da página para cada interação com o website.

O outro navegador relevante naquela época, chamado Mozilla (mais tarde Firefox), não queria ficar para trás. Para permitir que as pessoas pudessem fazer coisas similares em seu navegador, eles copiaram a interface, incluindo o controverso nome. A próxima geração de navegadores seguiram esse exemplo e, por isso, a interface `XMLHttpRequest` é um padrão atualmente.

## Enviando uma requisição

Para fazer uma simples requisição, criamos um objeto de requisição com o construtor `XMLHttpRequest` e chamamos os seus métodos `open` e `send`.

```js
var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", false);
req.send(null);
console.log(req.responseText);
// → This is the content of data.txt
```

O método `open` configura a requisição. Nesse caso, escolhemos fazer uma requisição `GET` para o arquivo _example/data.txt_. As URLs que não começam com um nome de protocolo (como por exemplo _http:_) são relativas, ou seja, são interpretadas em relação ao documento atual. Quando elas iniciam com uma barra (/), elas substituem o caminho atual, que é a parte após o nome do servidor. No caso de não iniciarem com uma barra, a parte do caminho em questão até (e incluindo) a ultima barra é colocada em frente à URL relativa.

Após abrir a requisição, podemos enviá-la usando o método `send`. O argumento a ser enviado é o corpo da requisição. Para requisições `GET`, podemos passar `null`. Se o terceiro argumento passado para `open` for `false`, o método `send` irá retornar apenas depois que a resposta da nossa requisição for recebida. Podemos ler a propriedade `responseText` do objeto da requisição para acessar o corpo da resposta.

As outras informações incluídas na resposta também podem ser extraídas desse objeto. O _status code_ (código de status) pode ser acessado por meio da propriedade `status` e a versão legível em texto do _status_ pode ser acessada por meio da propriedade `statusText`. Além disso, os cabeçalhos podem ser lidos com `getResponseHeader`.

```js
var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", false);
req.send(null);
console.log(req.status, req.statusText);
// → 200 OK
console.log(req.getResponseHeader("content-type"));
// → text/plain
```

Os nomes dos cabeçalhos são _case-insensitive_ (não faz diferença entre letras maiúsculas e minúsculas). Eles são normalmente escritos com letra maiúscula no início de cada palavra, como por exemplo "Content-Type". Entretanto, as respectivas variações "content-type" e "cOnTeNt-TyPe" fazem referência ao mesmo cabeçalho.

O navegador irá automaticamente adicionar alguns cabeçalhos da requisição, tais como "Host" e outros necessários para o servidor descobrir o tamanho do corpo da requisição. Mesmo assim, você pode adicionar os seus próprios cabeçalhos usando o método `setRequestHeader`. Isso é necessário apenas para usos avançados e requer a cooperação do servidor ao qual você está se comunicando (o servidor é livre para ignorar cabeçalhos que ele não sabe lidar).

## Requisições Assíncronas

Nos exemplos que vimos, a requisição finaliza quando a chamada ao método `send` retorna. Isso é conveniente pois significa que as propriedades como `responseText` ficam disponíveis imediatamente. Por outro lado, o nosso programa fica aguardando enquanto o navegador e o servidor estão se comunicando. Quando a conexão é ruim, o servidor lento ou o arquivo é muito grande, o processo pode demorar um bom tempo. Ainda pior, devido ao fato de que nenhum manipulador de evento pode ser disparado enquanto nosso programa está aguardando, todo o documento ficará não responsivo.

Se passarmos `true` como terceiro argumento para `open`, a requisição é _assíncrona_. Isso significa que quando chamar o método `send`, a única coisa que irá acontecer imediatamente é o agendamento da requisição que será enviada. Nosso programa pode continuar a execução e o navegador irá ser responsável por enviar e receber os dados em segundo plano.

Entretanto, enquanto a requisição estiver sendo executada, nós não podemos acessar a resposta. É necessário um mecanismo que nos avise quando os dados estiverem disponíveis.

Para isso, precisamos escutar o evento `"load"` no objeto da requisição.

```js
var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", true);
req.addEventListener("load", function() {
  console.log("Done:", req.status);
});
req.send(null);
```

Assim como o uso de `requestAnimationFrame` no [Capítulo 15](./15-projeto-plataforma-de-jogo), essa situação nos obriga a usar um estilo assíncrono de programação, encapsulando as coisas que precisam ser executadas após a requisição em uma função e preparando-a para que possa ser chamada no momento apropriado. Voltaremos nesse assunto [mais a frente](@TODO:adicionar-link).

## Recuperando Dados XML

Quando o recurso recebido pelo objeto `XMLHttpRequest` é um documento XML, a propriedade `responseXML` do objeto irá conter uma representação desse documento. Essa representação funciona de forma parecida com o DOM, discutida no [Capítulo 13](./13-document-object-model.md), exceto que ela não contém funcionalidades específicas do HTML, como por exemplo a propriedade `style`. O objeto contido em `responseXML` corresponde ao objeto do documento. Sua propriedade `documentElement` se refere à _tag_ mais externa do documento XML. No documento a seguir (_example/fruit.xml_), essa propriedade seria a _tag_ `<fruits>`:

```html
<fruits>
  <fruit name="banana" color="yellow"/>
  <fruit name="lemon" color="yellow"/>
  <fruit name="cherry" color="red"/>
</fruits>
```

Podemos recuperar esse arquivo da seguinte forma:

```js
var req = new XMLHttpRequest();
req.open("GET", "example/fruit.xml", false);
req.send(null);
console.log(req.responseXML.querySelectorAll("fruit").length);
// → 3
```

Documentos XML podem ser usados para trocar informações estruturadas com o servidor. Sua forma (_tags_ dentro de outras _tags_) faz com que seja fácil armazenar a maioria dos tipos de dados, sendo uma alternativa melhor do que usar um simples arquivo de texto. Entretanto, extrair informações da interface DOM é um pouco trabalhoso e os documentos XML tendem a ser verbosos. Normalmente é uma ideia melhor se comunicar usando dados JSON, os quais são mais fáceis de ler e escrever tanto para programas quanto para humanos.

```js
var req = new XMLHttpRequest();
req.open("GET", "example/fruit.json", false);
req.send(null);
console.log(JSON.parse(req.responseText));
// → {banana: "yellow", lemon: "yellow", cherry: "red"}
```

## HTTP _Sandboxing_

Fazer requisições HTTP usando _scripts_ em uma página web levanta preocupações em relação à segurança. A pessoa que controla o _script_ pode não ter os mesmos interesses que a pessoa do computador o qual o _script_ está executando. Mais especificamente, se eu visitar _themafia.org_, eu não quero que seus _scripts_ possam fazer requisições para _mybank.com_, usando informações de identificação do meu navegador, com instruções para transferir todo meu dinheiro para alguma conta da máfia.

É possível que websites se protejam desses tipos de ataques, porém, é preciso muito esforço e muitos websites falham ao fazê-lo. Por essa razão, os navegadores nos protegem não permitindo que _scripts_ façam requisições HTTP para outros domínios (nomes como _themafia.org_ e _mybank.com_).

Isso pode ser um problema irritante quando construímos sistemas que queiram acessar diferentes domínios por razões legítimas. Felizmente, servidores podem incluir um cabeçalho como esse em sua resposta para indicar explicitamente aos navegadores que é permitido requisições que venham de outros domínios:

```
Access-Control-Allow-Origin: *
```

## Abstraindo Requisições

No [Capítulo 10](./10-modulos.md), em nossa implementação do módulo AMD, usamos uma função hipotética chamada `backgroundReadFile`. Ela recebia um nome de arquivo e uma função e, após o carregamento do arquivo, chamava a função com o conteúdo recuperado. Aqui está uma implementação simples dessa função:

```js
function backgroundReadFile(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.addEventListener("load", function() {
    if (req.status < 400)
      callback(req.responseText);
  });
  req.send(null);
}
```

Essa simples abstração torna mais fácil usar `XMLHttpRequest` para fazer simples requisições `GET`. Se você está escrevendo um programa que precisa fazer requisições HTTP, é uma boa ideia usar uma função auxiliar para que você não acabe repetindo o esquisito padrão `XMLHttpRequest` por todo o seu código.

O nome da função argumento (`callback`) é um termo frequentemente usado para descrever funções como essa. Uma função _callback_ é fornecida para outro código de forma que possa "ser chamada" mais tarde.

Não é difícil escrever uma função utilitária HTTP adaptada para o que sua aplicação está fazendo. A função anterior apenas faz requisições `GET` e não nos dá controle sobre os cabeçalhos ou sobre o corpo da requisição. Você pode escrever outra variação da função para requisições `POST` ou uma versão genérica que suporte vários tipos de requisições. Muitas bibliotecas JavaScript também fornecem funções _wrappers_ para `XMLHttpRequest`.

O principal problema com a função _wrapper_ anterior é sua capacidade de lidar com falhas. Quando a requisição retorna um código de _status_ que indica um erro (400 para cima), ela não faz nada. Isso pode ser aceitável em algumas circunstâncias, mas imagine que colocamos na página um indicador de "carregando" para dizer que estamos carregando informação. Se a requisição falhar por causa de queda do servidor ou a conexão for interrompida, a página irá apenas manter o seu estado, parecendo que está fazendo alguma coisa. O usuário irá esperar um tempo, ficar impaciente e, por fim, considerar que o site é problemático.

Nós também devemos ter uma opção de ser notificado quando a requisição falhar para que possamos tomar uma ação apropriada. Por exemplo, podemos remover a mensagem "carregando" e informar ao usuário que algo errado aconteceu.

Manipular erros em código assíncrono é ainda mais trabalhoso do que manipulá-los em código síncrono. Frequentemente, adiamos parte do nosso trabalho colocando-o em uma função _callback_ e, por isso, o escopo de um bloco `try` acaba não fazendo sentido. No código a seguir, a exceção _não_ será capturada pois a chamada à função `backgroundReadFile` retorna imediatamente. O controle de execução então sai do bloco `try` e a função que foi fornecida não será chamada até um momento posterior.

```js
try {
  backgroundReadFile("example/data.txt", function(text) {
    if (text != "expected")
      throw new Error("That was unexpected");
  });
} catch (e) {
  console.log("Hello from the catch block");
}
```

Para lidar com requisições que falharam, precisamos permitir que uma função adicional seja passada para nosso _wrapper_ e chamá-la quando ocorrer algo errado. Alternativamente, podemos usar a convenção de que, caso a requisição falhar, um argumento adicional descrevendo o problema é passado para a chamada regular da função _callback_. Segue um exemplo:

```js
function getURL(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.addEventListener("load", function() {
    if (req.status < 400)
      callback(req.responseText);
    else
      callback(null, new Error("Request failed: " +
                               req.statusText));
  });
  req.addEventListener("error", function() {
    callback(null, new Error("Network error"));
  });
  req.send(null);
}
```

Adicionamos um manipulador para o evento de `"error"` (erro), o qual será sinalizado quando a requisição falhar por completo. Também chamamos a função _callback_ com um argumento de erro quando a requisição finaliza com um código de _status_ que indica um erro.

O código que utiliza `getUrl` deve, então, verificar se um erro foi fornecido e, caso tenha sido, tratá-lo.

```js
getURL("data/nonsense.txt", function(content, error) {
  if (error != null)
    console.log("Failed to fetch nonsense.txt: " + error);
  else
    console.log("nonsense.txt: " + content);
});
```

Isso não funciona quando se trata de exceções. Ao encadear várias ações assíncronas, uma exceção em qualquer ponto da cadeia ainda irá (a não ser que você envolva cada função em seu próprio bloco `try`/`catch`) chegar ao topo e abortar a sequência de ações.

## _Promises_

Para projetos complicados, escrever código assíncrono usando o estilo de _callbacks_ é difícil de ser feito corretamente. É fácil esquecer de verificar um erro ou permitir que uma exceção inesperada encerre a execução do programa. Além disso, lidar com erros quando os mesmos devem ser passados por um fluxo de múltiplas funções _callback_ e blocos _catch_ é tedioso.

Já foram feitas várias tentativas para resolver esse problema usando abstrações adicionais. Uma das mais bem-sucedidas é chamada de _promises_. _Promises_ encapsulam uma ação assíncrona em um objeto, que pode ser passado e instruído a fazer certas coisas quando a ação finalizar ou falhar. Essa interface está definida para ser parte da próxima versão da linguagem JavaScript, mas já pode ser usada em forma de biblioteca.

A interface para usar _promises_ não é muito intuitiva, mas é poderosa. Esse capítulo irá brevemente descrevê-la. Você pode encontrar mais informações em [promisejs.org](http://www.promisejs.org)

Para criar um objeto _promise_, chamamos o construtor `Promise` passando uma função que inicia a ação assíncrona. O construtor chama essa função passando dois argumentos, os quais também são funções. A primeira função deve ser chamada quando a ação terminar com sucesso e a segunda quando ela falhar.

Mais uma vez, segue nosso _wrapper_ para requisições `GET`, dessa vez retornando uma _promise_. Nós vamos apenas chamá-lo de `get` dessa vez.

```js
function get(url) {
  return new Promise(function(succeed, fail) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", function() {
      if (req.status < 400)
        succeed(req.responseText);
      else
        fail(new Error("Request failed: " + req.statusText));
    });
    req.addEventListener("error", function() {
      fail(new Error("Network error"));
    });
    req.send(null);
  });
}
```

Note que a interface da função em si é bem mais simples. Você passa uma URL e ela retorna uma _promise_. Essa _promise_ atua como um manipulador do resultado da requisição. Ela possui um método `then` que pode ser chamado com duas funções: uma para tratar o sucesso e outra para tratar a falha.

```js
get("example/data.txt").then(function(text) {
  console.log("data.txt: " + text);
}, function(error) {
  console.log("Failed to fetch data.txt: " + error);
});
```

Até agora, isso é apenas outra forma de expressar a mesma coisa que já havíamos expressado. É apenas quando você precisa encadear ações que as _promises_ fazem uma diferença significativa.

Chamar o método `then` produz uma nova _promise_, a qual o resultado (o valor passado ao manipulador em caso de sucesso) depende do valor de retorno da primeira função fornecida ao `then`. Essa função pode retornar outra _promise_ para indicar que mais tarefas assíncronas estão sendo executadas. Nesse caso, a _promise_ retornada pelo `then` irá esperar pela _promise_ retornada pela função manipuladora, obtendo sucesso ou falhando com o mesmo valor quando for resolvida. Quando a função manipuladora retornar uma valor que não seja uma _promise_, a _promise_ retornada pelo `then` imediatamente retorna com sucesso usando esse valor como seu resultado.

Isso significa que você pode usar `then` para transformar o resultado de uma _promise_. Por exemplo, o código a seguir retorna uma _promise_ a qual o resultado é o conteúdo de uma dada URL representada como JSON:

```js
function getJSON(url) {
  return get(url).then(JSON.parse);
}
```

A última chamada ao `then` não especificou um manipulador para falhas. Isso é permitido. O erro será passado para a _promise_ retornada pelo `then`, que é exatamente o que queremos — `getJSON` não sabe o que fazer quando algo der errado mas, esperançosamente, a função que o chamou sabe.

Como um exemplo que demonstra o uso de _promises_, iremos construir um programa que carrega um número de arquivos JSON do servidor e, enquanto isso é feito, mostra a palavra "carregando". Os arquivos JSON contêm informações sobre pessoas, com links para arquivos que representam outras pessoas em condições como `father`, `mother` ou `spouse` (pai, mãe ou cônjuge).

Nós queremos recuperar o nome da mãe do cônjuge de _example/bert.json_ e, se algo der errado, remover o texto "carregando" e mostrar uma mensagem de erro. Segue uma forma de como isso pode ser feito usando _promises_:

```js
<script>
  function showMessage(msg) {
    var elt = document.createElement("div");
    elt.textContent = msg;
    return document.body.appendChild(elt);
  }

  var loading = showMessage("Loading...");
  getJSON("example/bert.json").then(function(bert) {
    return getJSON(bert.spouse);
  }).then(function(spouse) {
    return getJSON(spouse.mother);
  }).then(function(mother) {
    showMessage("The name is " + mother.name);
  }).catch(function(error) {
    showMessage(String(error));
  }).then(function() {
    document.body.removeChild(loading);
  });
</script>
```

O programa acima é relativamente compacto e legível. O método `catch` é similar ao `then`, exceto que ele espera um manipulador de erro como argumento e passará pelo resultado sem alterá-lo em caso de sucesso. Muito parecido com o `catch` em um bloco `try`, o controle de execução irá continuar normalmente depois que a falha é capturada. Dessa forma, o `then` que executa ao final e é responsável por remover a mensagem de "carregando", é sempre executado, mesmo se algo der errado.

Você pode pensar na interface de _promise_ como uma implementação de uma linguagem própria para o controle de fluxo assíncrono. As chamadas adicionais de métodos e expressões de funções fazem com que o código pareça um pouco estranho, mas não tão estranhos quanto se tivéssemos que lidar com todos os erros nós mesmos.

## Apreciando o HTTP

Quando estamos construindo um sistema que requer comunicação entre um programa executando JavaScript no navegador (_client-side_) e um programa em um servidor (_server-side_), existem várias maneiras diferentes de modelar essa comunicação.

Um modelo bastante usado é o de _chamadas de procedimentos remotos_. Nesse modelo, a comunicação segue o padrão de chamadas normais de função, exceto pelo fato de que a função está sendo executada em outra máquina. Essa chamada envolve fazer uma requisição ao servidor, incluindo o nome da função e seus argumentos. A resposta para essa requisição contém o valor retornado.

Quando estiver pensando sobre chamadas de procedimentos remotos, o HTTP é apenas um veículo para a comunicação, e você provavelmente escreverá uma camada de abstração para escondê-la.

Outra abordagem é construir sua comunicação em torno do conceito de recursos e métodos HTTP. Ao invés de um procedimento remoto chamado `addUser`, utilizar uma requisição `PUT` para `/users/larry`. Ao invés de passar as propriedades daquele usuário como argumentos da função, você define um formato de documento ou usa um formato existente que represente um usuário. O corpo da requisição `PUT` para criar um novo recurso é simplesmente tal documento. Um recurso pode ser acessado por meio de uma requisição `GET` para a URL do recurso (por exemplo, `/user/larry`), o qual retorna o documento que representa tal recurso.

Essa segunda abordagem torna mais fácil utilizar as funcionalidades que o HTTP fornece, como suporte para _cache_ de recursos (mantendo uma cópia no lado do cliente). Além disso, ajuda na coerência de sua interface, visto que os recursos são mais fáceis de serem compreendidos do que um monte de funções.

## Segurança e HTTPS

Dados que trafegam pela Internet tendem a seguir uma longa e perigosa estrada. Para chegar ao seu destino, a informação passa por vários ambientes desde redes Wi-Fi em cafeterias até redes controladas por várias empresas e estados. Em qualquer ponto dessa rota, os dados podem ser inspecionados e, até mesmo, modificados.

Se for importante que algo seja secreto, como a senha da sua conta de email, ou que chegue ao destino final sem ser modificado, como o número da conta que você irá transferir dinheiro por meio do site do seu banco, usar simplesmente HTTP não é bom o suficiente.

O protocolo HTTP seguro, o qual as URLs começam com _https://_, encapsula o tráfego HTTP de forma que dificulta a leitura e alteração. Primeiramente, o cliente verifica se o servidor é de fato quem ele diz ser, obrigando-o a provar que possui um certificado criptográfico emitido por uma autoridade certificadora que o navegador reconheça. Por fim, todos os dados que trafegam pela conexão são criptografados de forma que assegure que eles estejam protegidos contra espionagem e violação.

Por isso, quando funciona corretamente, o HTTPs previne ambas situações onde alguém finja ser o website ao qual você estava tentando se comunicar e quando alguém está vigiando sua comunicação. O protocolo não é perfeito e já houveram vários incidentes onde o HTTPs falhou por causa de certificados forjados, roubados e software corrompido. Mesmo assim, é trivial burlar o HTTP simples, enquanto que burlar o HTTPs requer um certo nível de esforço que apenas estados ou organizações criminosas sofisticadas estão dispostas a fazer.

## Resumo

Vimos nesse capítulo que o HTTP é um protocolo para acessar recursos usando a Internet. O _cliente_ envia uma requisição, a qual contém um método (normalmente `GET`) e um caminho que identifica o recurso. O _servidor_ então decide o que fazer com a requisição e responde com um código de _status_ e o corpo da resposta. Tanto requisições quanto respostas podem conter _headers_ (cabeçalhos) que fornecem informação adicional.

Navegadores fazem requisições `GET` para acessar recursos necessários para mostrar uma página web. Uma página pode também conter formulários, os quais permitem que informações inseridas pelo usuário sejam enviadas juntas com a requisição quando o formulário é submetido. Você aprenderá mais sobre esse assunto no [próximo capítulo](./18-formularios-e-campos-de-formularios.md).

A interface na qual o JavaScript do navegador pode fazer requisições HTTP é chamada `XMLHttpRequest`. Você normalmente pode ignorar o "XML" do nome (mas mesmo assim precisa digitá-lo). Existem duas formas em que a interface pode ser usada. A primeira forma é síncrona, bloqueando toda a execução até que a requisição finalize. A segunda é assíncrona, precisando usar um manipulador de eventos para avisar que a resposta chegou. Em quase todos os casos é preferível usar a forma assíncrona. Fazer uma requisição é algo parecido com o código a seguir:

```js
var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", true);
req.addEventListener("load", function() {
  console.log(req.status);
});
req.send(null);
```

Programação assíncrona é traiçoeira. _Promises_ são interfaces que tornam a programação assíncrona um pouco mais fácil, ajudando a rotear condições de erro e exceções para os manipuladores corretos e abstraindo muitos elementos repetitivos e suscetíveis a erro presentes nesse estilo de programação.

## Exercícios

### Negociação de conteúdo

Uma das coisas que o HTTP pode fazer, mas que não discutimos nesse capítulo, é chamada de _negociação de conteúdo_. O cabeçalho `Accept` de uma requisição pode ser usado para dizer ao servidor qual o tipo de documento que o cliente gostaria de receber. Muitos servidores ignoram esse cabeçalho, mas quando o servidor sabe como converter um recurso de várias formas, ele pode olhar esse cabeçalho e enviar a forma que o cliente prefere.

A URL [_eloquentjavascript.net/author_](eloquentjavascript.net/author) é configurada para responder tanto com formato simples de texto quanto com HTML ou JSON, dependendo de como o cliente solicita. Esses formatos são identificados pelos _tipos de mídia_ `text/plain`, `text/html` e `application/json`.

Envie requisições para recuperar todos os três formatos desse recurso. Use o método `setRequestHeader` do seu objeto `XMLHttpRequest` para definir o valor do cabeçalho chamado `Accept` para um dos tipos de mídia descritos acima. Certifique-se de configurar o cabeçalho _após_ chamar o método `open` e antes de chamar o método `send`.

Por fim, tente solicitar pelo tipo de mídia `application/rainbows+unicorns` e veja o que acontece.

```js
// Your code here.
```

**Dicas:**

Veja os vários exemplos que usam `XMLHttpRequest` nesse capítulo, para ter uma ideia de como são as chamadas de métodos que envolvem fazer uma requisição. Você pode usar uma requisição síncrona (informando `false` como o terceiro parâmetro para `open`), se preferir.

Solicitar por um tipo de mídia inexistente, fará com que a resposta seja retornada com o código 406, _"Not acceptable"_ (Não aceitável), que é o código que o servidor deve retornar quando ele não pode satisfazer o cabeçalho `Accept`.

### Esperando por múltiplas _promises_

O construtor _Promise_, possui um método chamado `all` que, quando fornecido um _array_ de _promises_, retorna uma _promise_ que aguarda a finalização de todas as _promises_ do array. O método `all`, então, finaliza com sucesso, gerando um _array_ com os valores dos resultados. Se qualquer uma das _promises_ do _array_ falhar, a _promise_ retornada pelo `all` também falha, recebendo o valor de falha da _promise_ que falhou inicialmente.

Tente implementar algo parecido com isso usando uma função normal chamada `all`.

Observe que depois que a _promise_ é resolvida (obtendo sucesso ou falhado), ela não pode ter sucesso ou falhar novamente, ignorando as chamadas às funções posteriores que tentam resolvê-la. Isso pode facilitar a maneira que você manipula as falhas em sua _promise_.

```js
function all(promises) {
  return new Promise(function(success, fail) {
    // Your code here.
  });
}

// Test code.
all([]).then(function(array) {
  console.log("This should be []:", array);
});
function soon(val) {
  return new Promise(function(success) {
    setTimeout(function() { success(val); },
               Math.random() * 500);
  });
}
all([soon(1), soon(2), soon(3)]).then(function(array) {
  console.log("This should be [1, 2, 3]:", array);
});
function fail() {
  return new Promise(function(success, fail) {
    fail(new Error("boom"));
  });
}
all([soon(1), fail(), soon(3)]).then(function(array) {
  console.log("We should not get here");
}, function(error) {
  if (error.message != "boom")
    console.log("Unexpected failure:", error);
});
```

**Dicas:**

A função passada ao construtor `Promise` terá que chamar o método `then` para cada uma das _promises_ do _array_ fornecido. Quando uma delas obtiver sucesso, duas coisas precisam acontecer. O valor resultante precisa ser armazenado na posição correta em um _array_ de resultados e devemos, também, verificar se essa foi a última _promise_ pendente, finalizando nossa própria _promise_ caso tenha sido.

O último pode ser feito usando um contador, que é inicializado com o valor do tamanho do _array_ fornecido e do qual subtraímos uma unidade cada vez que uma _promise_ for bem-sucedida. No momento em que o contador chega ao valor zero, terminamos. Certifique-se de lidar com a situação em que o _array_ fornecido é vazio e, consequentemente, nenhuma _promise_ será resolvida.

Tratar falhas requer um pouco mais de esforço, mas acaba sendo extremamente simples. Basta passar, para cada _promise_ do _array_, a função que lida com a falha da _promise_ responsável por encapsular as _promises_ do array, de forma que uma falha em qualquer uma delas, irá disparar a falha para a _promise_ encapsuladora.
