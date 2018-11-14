# Node.js

> "Um estudante perguntou ‘Os programadores de antigamente usavam somente
máquinas simples e nenhuma linguagem de programação, mas mesmo assim eles
construíram lindos programas. Por que nós usamos máquinas complicadas e
linguagens de programação?’. Fu-Tzu respondeu ‘Os construtores de antigamente
usaram somente varas e barro, mas mesmo assim eles construíram lindas cabanas."
> `Mestre Yuan-Ma, The Book of Programming`

Até agora você vem aprendendo e usando a linguagem JavaScript num único
ambiente: o navegador. Esse capítulo e o próximo vão introduzir brevemente você
ao Node.js, um programa que permite que você aplique suas habilidades de
JavaScript fora do navegador. Com isso, você pode construir desde uma ferramenta
de linha de comando até servidores HTTP dinâmicos.

Esses capítulos visam te ensinar conceitos importantes nos quais o Node.js foi
construído, e também te dar informação suficiente para escrever alguns programas
úteis. Esses capítulos não detalham completamente o funcionamento do Node.

Você vem executando o código dos capítulos anteriores diretamente nessas
páginas, pois eram pura e simplesmente JavaScript ou foram escritos para o
navegador, porém os exemplos de códigos nesse capítulo são escritos para o Node
e não vão rodar no navegador.

Se você quer seguir em frente e rodar os códigos desse capítulo, comece indo em
http://nodejs.org e seguindo as instruções de instalação para o seu sistema
operacional. Guarde também esse site como referência para uma documentação mais
profunda sobre Node e seus módulos integrados.

## Por Trás dos Panos

Um dos problemas mais difíceis em escrever sistemas que se comunicam através de
uma rede é administrar a entrada e saída — ou seja, ler escrever dados na rede,
num disco rígido, e outros dispositivos. Mover os dados desta forma consome
tempo, e planejar isso de forma inteligente pode fazer uma enorme diferença
na velocidade em que um sistema responde ao usuário ou às requisições da rede.

A maneira tradicional de tratar a entrada e saída é ter uma função, como
`readfile`, que começa a ler um arquivo e só retorna quando o arquivo foi
totalmente lido. Isso é chamado _I/O_ síncrono (I/O quer dizer input/output ou
entrada/saída).

Node foi inicialmente concebido para o propósito de tornar a assincronicidade I/O
mais fácil e conveniente. Nós já vimos interfaces síncronas antes, como o objeto
`XMLHttpRequest` do navegador, discutido no Capítulo 17. Uma interface
assíncrona permite que o script continue executando enquanto ela faz seu trabalho
e chama uma função de _callback_ quando está finalizada. Isso é como Node faz
todo seu I/O.

JavaScript é ideal para um sistema como Node. É uma das poucas linguagens de
programação que não tem uma maneira embutida de fazer I/O. Dessa forma,
JavaScript poderia encaixar-se bastante na abordagem excêntrica do Node para
o I/O sem acabar ficando com duas interfaces inconsistentes. Em 2009, quando
Node foi desenhado, as pessoas já estavam fazendo I/O baseado em funções de
_callback_ no navegador, então a comunidade em volta da linguagem estava
acostumada com um estilo de programação assíncrono.

## Assincronia

Eu vou tentar ilustrar I/O síncrono contra I/O assíncrono com um pequeno
exemplo, onde um programa precisa buscar recursos da Internet e então fazer
algum processamento simples com o resultado dessa busca.

Em um ambiente síncrono, a maneira óbvia de realizar essa tarefa é fazer uma
requisição após outra. Esse método tem a desvantagem de que a segunda requisição
só será realizada após a primeira ter finalizado. O tempo total de execução será
no mínimo a soma da duração das duas requisições. Isso não é um uso eficaz da
máquina, que vai estar inativa por boa parte do tempo enquanto os dados são
transmitidos através da rede.

A solução para esse problema, num sistema síncrono, é iniciar _threads_ de
controle. (Dê uma olhada no Capítulo 14 para uma discussão sobre _threads_.) Uma
segunda _thread_ poderia iniciar a segunda requisição, e então ambas as
_threads_ vão esperar os resultados voltarem, e após a ressincronização elas vão
combinar seus resultados.

No seguinte diagrama, as linhas grossa representam o tempo que o programa gastou
em seu processo normal, e as linhas finas representam o tempo gasto esperando
pelo I/O. Em um modelo síncrono, o tempo gasto pelo I/O faz parte da linha do
tempo de uma determinada _thread_ de controle. Em um modelo assíncrono, iniciar
uma ação de I/O causa uma divisão na linha do tempo, conceitualmente falando. A
_thread_ que iniciou o I/O continua rodando, e o I/O é finalizado juntamente à
ela, chamando uma função de _callback_ quando é finalizada.

![Control flow for synchronous and asynchronous I/O](http://eloquentjavascript.net/img/control-io.svg)

Uma outra maneira de mostrar essa diferença é que essa espera para que o I/O
finalize é implícita no modelo síncrono, enquanto que é explícita no assíncrono.
Mas assincronia é uma faca de dois gumes. Ela faz com que expressivos programas
que seguem uma linha reta se tornem mais estranhos.

No capítulo 17, eu já mencionei o fato de que todos esses _callbacks_ adicionam
um pouco de ruído e rodeios para um programa. Se esse estilo de assincronia é
uma boa ideia ou não, em geral isso pode ser discutido. De qualquer modo, levará
algum tempo para se acostumar.

Mas para um sistema baseado em JavaScript, eu poderia afirmar que esse estilo de
assincronia com callback é uma escolha sensata. Uma das forças do JavaScript é
sua simplicidade, e tentar adicionar múltiplas _threads_ de controle poderia
causar uma grande complexidade. Embora os _callbacks_ não tendem a ser códigos
simples, como conceito, eles são agradavelmente simples e ainda assim poderosos
o suficiente para escrever servidores web de alta performance.

## O Comando Node

Quando Node.js está instalado em um sistema, ele disponibiliza um programa
chamado `node`, que é usado para executar arquivos JavaScript. Digamos que
você tenha um arquivo chamado `ola.js`, contendo o seguinte código:

```javascript
var mensagem = "Olá mundo";
console.log(mensagem);
```

Você pode então rodar `node` a partir da linha de comando para executar o
programa:

```
$ node ola.js
Olá mundo
```

O método `console.log` no Node tem um funcionamento bem parecido ao do
navegador. Ele imprime um pedaço de texto. Mas no Node, o texto será impresso
pelo processo padrão de saída, e não no console JavaScript do navegador.

Se você rodar `node` sem especificar nenhum arquivo, ele te fornecerá um
_prompt_ no qual você poderá escrever códigos JavaScript e ver o resultado
imediatamente.

```
$ node
> 1 + 1
2
> [-1, -2, -3].map(Math.abs)
[1, 2, 3]
> process.exit(0)
$
```

A variável `process`, assim como a variável `console`, está disponível
globalmente no Node. Ela fornece várias maneiras de inspecionar e manipular o
programa atual. O método `exit` finaliza o processo e pode receber um código
de saída, que diz ao programa que iniciou `node` (nesse caso, a linha de
comando) se o programa foi completado com sucesso (código zero) ou se encontrou
algum erro (qualquer outro código).

Para encontrar os argumentos de linha de comando recebidos pelo seu script, você
pode ler `process.argv`, que é um _array_ de _strings_. Note que também
estarão inclusos o nome dos comandos `node` e o nome do seu script, fazendo
com que os argumentos comecem na posição 2. Se `showargv.js` contém somente
o _statement_ `console.log(process.argv)`, você pode rodá-lo dessa forma:

```
$ node showargv.js one --and two
["node", "/home/braziljs/showargv.js", "one", "--and", "two"]
```

Todas as variáveis JavaScript globais, como `Array`, `Math` and
`JSON`, estão presentes também no ambiente do Node. Funcionalidades
relacionadas ao navegador, como `document` e `alert` estão ausentes.

O objeto global do escopo, que é chamado `window` no navegador, passa a ser
`global` no Node, que faz muito mais sentido.

## Módulos
Além de algumas variáveis que mencionei, como `console`e `process`, Node
também colocou pequenas funcionalidades no escopo global. Se você quiser acessar
outras funcionalidades embutidas, você precisa pedir esse módulo ao sistema.

O sistema de módulo CommonJS, baseado na função `require`, estão descritos
no Capítulo 10. Esse sistema é construído em Node e é usado para carregar desde
módulos integrados até bibliotecas transferidas, ou até mesmo, arquivos que
fazem parte do seu próprio programa.

Quando `require` é chamado, Node tem que transformar a string recebida em
um arquivo real a ser carregado. Nomes de caminhos que começam com "/", "./", ou
"../" são resolvidos relativamente ao atual caminho do módulo, aonde "./"
significa o diretório corrente, "../" para um diretório acima, e "/" para a raiz
do sistema de arquivos. Então se você solicitar por `"./world/world"` do
arquivo `/home/braziljs/elife/run.js`, Node vai tentar carregar o arquivo
`/home/braziljs/elife/world/world.js`. A extensão `.js` pode ser
omitida.

Quando uma _string_ recebida pelo `require` não parece ter um caminho
relativo ou absoluto, fica implícito que ela se refere a um módulo integrado ou
que está instalado no diretório `node_modules`. Por exemplo,
`require(fs)` disponibilizará o módulo de sistema de arquivos integrado ao
Node, `require("elife")` vai tentar carregar a biblioteca encontrada em
`node_modules/elife`. A maneira mais comum de instalar bibliotecas como
essas é usando NPM, que em breve nós vamos discutir.

Para ilustrar o uso do `require`, vamos configurar um projeto simples que
consiste de dois arquivos. O primeiro é chamado `main.js`, que define um
script que pode ser chamado da linha de comando para alterar uma _string_.

```javascript
var garble = require("./garble");

// O índice 2 possui o valor do primeiro parâmetro da linha de comando
var parametro = process.argv[2];

console.log(garble(parametro));
```

O arquivo `garble.js` define uma biblioteca para alterar string, que pode
ser usada tanto da linha de comando quanto por outros scripts que precisam ter
acesso direto a função de alterar.

```javascript
module.exports = function(string) {
  return string.split("").map(function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) + 5);
  }).join("");
}
```

Lembre-se que substituir `module.exports`, ao invés de adicionar propriedades
à ele, nos permite exportar um valor específico do módulo. Nesse caso, nós
fizemos com que o resultado ao requerer nosso arquivo `garble` seja a
própria função de alterar.

A função separa a _string_ recebida em dois caracteres únicos separando a
_string_ vazia e então substituindo cada caractere cujo código é cinco pontos
maior. Finalmente, o resultado é reagrupado novamente numa _string_.

Agora nós podemos chamar nossa ferramenta dessa forma:

```
$ node main.js JavaScript
Of{fXhwnuy
```

## Instalando com NPM

NPM, que foi brevemente discutido no Capítulo 10, é um repositório online de
módulos JavaScript, muitos deles escritos para Node. Quando você instala o Node
no seu computador, você também instala um programa chamado `npm`, que fornece
uma interface conveniente para esse repositório.

Por exemplo, um módulo que você vai encontrar na NPM é `figlet`, que pode
converter texto em _ASCII art_—desenhos feitos de caracteres de texto. O trecho
a seguir mostra como instalar e usar esse módulo:

```
$ npm install figlet
npm GET https://registry.npmjs.org/figlet
npm 200 https://registry.npmjs.org/figlet
npm GET https://registry.npmjs.org/figlet/-/figlet-1.0.9.tgz
npm 200 https://registry.npmjs.org/figlet/-/figlet-1.0.9.tgz
figlet@1.0.9 node_modules/figlet
$ node
> var figlet = require("figlet");
> figlet.text("Hello world!", function(error, data) {
    if (error)
      console.error(error);
    else
      console.log(data);
  });
  _   _      _ _                            _     _ _
 | | | | ___| | | ___   __      _____  _ __| | __| | |
 | |_| |/ _ \ | |/ _ \  \ \ /\ / / _ \| '__| |/ _` | |
 |  _  |  __/ | | (_) |  \ V  V / (_) | |  | | (_| |_|
 |_| |_|\___|_|_|\___/    \_/\_/ \___/|_|  |_|\__,_(_)
```

Depois de rodar `npm install`, NPM já vai ter criado um diretório chamado
`node_modules`. Dentro desse diretório haverá um outro diretório chamado
`figlet`, que vai conter a biblioteca. Quando rodamos `node` e
chamamos `require("figlet")`, essa biblioteca é carregada, e nós podemos
chamar seu método `text` para desenhar algumas letras grandes.

Talvez de forma inesperada, ao invés de retornar a string que faz crescer as
letras, `figlet.text` têm uma função de _callback_ que passa o resultado
para ela. Ele também passa outro parâmetro no _callback_, `error`, que vai
possuir um objeto de erro quando alguma coisa sair errada ou nulo se tudo
ocorrer bem.

Isso é um padrão comum em Node. Renderizar alguma coisa com `figlet` requer
a biblioteca para ler o arquivo que contém as formas das letras. Lendo esse
arquivo do disco é uma operação assíncrona no Node, então `figlet.text`não
pode retornar o resultado imediatamente. Assincronia é, de certa forma,
infecciosa—qualquer função que chamar uma função assincronamente precisa se
tornar assíncrona também.

Existem muito mais coisas no NPM além de `npm install`. Ele pode ler
arquivos `package,json`, que contém informações codificadas em JSON sobre
o programa ou biblioteca, como por exemplo outras bibliotecas que depende.
Rodar `npm install` em um diretório que contém um arquivo como esse vai
instalar automaticamente todas as dependências, assim como as dependências das
dependências. A ferramenta `npm` também é usada para publicar bibliotecas
para o repositório NPM online de pacotes para que as pessoas possam encontrar,
transferir e usá-los.

Esse livro não vai abordar detalhes da utilização do NPM. Dê uma olhada em
npmjs.org para uma documentação mais detalhada e para uma maneira simples de
procurar por bibliotecas.

## O módulo de arquivos de sistema

Um dos módulos integrados mais comuns que vêm com o Node é o módulo `"fs"`,
que significa _file system_. Esse módulo fornece funções para o trabalho com
arquivos de diretórios.

Por exemplo, existe uma função chamada `readFile`, que lê um arquivo e então
chama um _callback_ com o conteúdo desse arquivo.

```javascript
var fs = require("fs");
fs.readFile("file.txt", "utf8", function(error, text) {
    if (error)
        throw error;
    console.log("The file contained:", text);
});
```

O segundo argumento passado para `readFile` indica a codificação de caracteres
usada para decodificar o arquivo numa _string_. Existem muitas maneiras de
codificar texto em informação binária, mas a maioria dos sistemas modernos usam
UTF-8 para codificar texto, então a menos que você tenha razões para acreditar
que outra forma de codificação deve ser usada, passar "utf8" ao ler um arquivo de
texto é uma aposta segura. Se você não passar uma codificação, o Node vai
assumir que você está interessado na informação binária e vai te dar um objeto
`Buffer` ao invés de uma _string_. O que por sua vez, é um objeto
_array-like_ que contém números representando os _bytes_ nos arquivos.

```javascript
var fs = require("fs");
fs.readFile("file.txt", function(error, buffer) {
  if (error)
    throw error;
  console.log("The file contained", buffer.length, "bytes.",
              "The first byte is:", buffer[0]);
});
```

Uma função similar, `writeFile`, é usada para escrever um arquivo no disco.

```javascript
var fs = require("fs");
fs.writeFile("graffiti.txt", "Node was here", function(err) {
  if (err)
    console.log("Failed to write file:", err);
  else
    console.log("File written.");
});
```

Aqui, não foi necessário especificar a codificação de caracteres, pois a função
`writeFile` assume que recebeu uma _string_ e não um objeto `Buffer`, e
então deve escrever essa _string_ como texto usando a codificação de caracteres
padrão, que é UTF-8.

O módulo `"fs"` contém muitas outras funções úteis: `readdir` que vai
retornar os arquivos em um diretório como um _array_ de _strings_, `stat`
vai buscar informação sobre um arquivo, `rename` vai renomear um arquivo,
`unlink` vai remover um arquivo, e assim por diante. Veja a documentação em
nodejs.org para especificidades.

Muitas das funções em `"fs"` vêm com variantes síncronas e assíncronas. Por
exemplo, existe uma versão síncrona de `readFile` chamada
`readFileSync`.

```javascript
var fs = require("fs");
console.log(fs.readFileSync("file.txt", "utf8"));
```

Funções síncronas requerem menos formalismo na sua utilização e podem ser úteis
em alguns scripts, onde a extra velocidade oferecida pela assincronia _I/O_ é
irrelevante. Mas note que enquanto tal operação síncrona é executada, seu
programa fica totalmente parado. Se nesse período ele deveria responder ao
usuário ou a outras máquinas na rede, ficar preso com um _I/O_ síncrono pode
acabar produzindo atrasos inconvenientes.

## O Módulo HTTP

Outro principal é o `"http"`. Ele fornece funcionalidade para rodar
servidores HTTP e realizar requisições HTTP.

Isso é tudo que você precisa para rodar um simples servidor HTTP:

```javascript
var http = require("http");
var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<h1>Hello!</h1><p>You asked for <code>" +
                 request.url + "</code></p>");
  response.end();
});
server.listen(8000);
```

Se você rodar esse script na sua máquina, você pode apontar seu navegador para o
endereço http://localhost:8000/hello para fazer uma requisição no seu servidor.
Ele irá responder com uma pequena página HTML.

A função passada como um argumento para `createServer` é chamada toda vez
que um cliente tenta se conectar ao servidor. As variáveis `request` e
`response` são os objetos que representam a informação que chega e sai. A
primeira contém informações sobre a requisição, como por exemplo a propriedade
`url`, que nos diz em qual URL essa requisição foi feita.

Para enviar alguma coisa de volta, você chama métodos do objeto `response`.
O primeiro, `writeHead`, vai escrever os cabeçalhos de resposta (veja o
Capítulo 17). Você define o código de status (200 para "OK" nesse caso) e um
objeto que contém valores de cabeçalho. Aqui nós dizemos ao cliente que
estaremos enviando um documento HTML de volta.

Em seguida, o corpo da resposta (o próprio documento) é enviado com
`response.write`. Você pode chamar esse método quantas vezes você quiser
para enviar a resposta peça por peça, possibilitando que a informação seja
transmitida para o cliente assim que ela esteja disponível. Finalmente,
`response.end` assina o fim da resposta.

A chamada de `server.listen`  faz com que o servidor comece a esperar por
conexões na porta 8000. Por isso você precisa se conectar a _localhost:8000_, ao
invés de somente _localhost_ (que deveria usar a porta 80, por padrão), para se
comunicar com o servidor.

Para parar de rodar um script Node como esse, que não finaliza automaticamente
pois está aguardando por eventos futuros (nesse caso, conexões de rede), aperte
Ctrl+C.

Um servidor real normalmente faz mais do que o que nós vimos no exemplo
anterior—ele olha o método da requisição (a propriedade `method`) para ver
que ação o cliente está tentando realizar e olha também a URL da requisição para
descobrir que recurso essa ação está executando. Você verá um servidor mais
avançado daqui a pouco neste capítulo.

Para agir como um _cliente HTTP_, nós podemos usar a função `request` no
módulo `"http"`.

```javascript
var http = require("http");
var request = http.request({
  hostname: "eloquentjavascript.net",
  path: "/20_node.html",
  method: "GET",
  headers: {Accept: "text/html"}
}, function(response) {
  console.log("Server responded with status code",
              response.statusCode);
});
request.end();
```

O primeiro parâmetro passado para `request` configura a requisição, dizendo
pro Node qual o servidor que ele deve se comunicar, que caminho solicitar
daquele servidor, que método usar, e assim por diante. O segundo parâmetro é a
função que deverá ser chamada quando uma resposta chegar. É informado um objeto
que nos permite inspecionar a resposta, para descobrir o seu código de status,
por exemplo.

Assim como o objeto `response` que vimos no servidor, o objeto `request`
nos permite transmitir informação na requisição com o método `write` e
finalizar a requisição com o método `end`. O exemplo não usa `write`
porque requisições `GET` não devem conter informação no corpo da requisição.

Para fazer requisições para URLs HTTP seguras (HTTPS), o Node fornece um pacote
chamado `https`, que contém sua própria função `request`, parecida a
`http.request`.

## Streams

Nós já vimos dois exemplos de _streams_ em HTTP—são, consecutivamente, o
objeto de resposta no qual o servidor pode escrever e o objeto de requisição que
foi retornado do `http.request`.

_Strams_ de gravação são um conceito amplamente usado nas interfaces Node.
Todos os _streams_ de gravação possuem um método `write`, que pode receber
uma _string_ ou um objeto `Buffer`. Seus métodos `end`
fecham a transmissão e, se passado um parâmetro, também vai escrever alguma
informação antes de fechar. Ambos métodos podem receber um _callback_ como um
parâmetro adicional, que eles vão chamar ao fim do escrever ou fechar a
transmissão.

É possível criar _streams_ de gravação que apontam para um arquivo com a função
`fs.createWritebleStram`. Então você pode usar o método `write` no
objeto resultante para escrever o arquivo peça por peça, ao invés de escrever
tudo de uma só vez com o `fs.writeFile`.

_Streams_ de leitura são um pouco mais fechados. Em ambos a variável
`request` que foi passada para a função de _callback_ do servidor HTTP e a
variável `response` para o cliente HTTP são _streams_ de leitura. (Um
servidor lê os pedidos e então escreve as respostas, enquanto que um cliente
primeiro escreve um pedido e então lê a resposta.) Para ler de um *stream*
usamos manipuladores de eventos, e não métodos.

Objetos que emitem eventos no Node têm um método chamado `on` que é similar
ao método `addEventListener` no navegador. Você dá um nome de evento e então
uma função, e isso irá registrar uma função para ser chamada toda vez que um
dado evento ocorrer.

_Streams_ de leitura possuem os eventos `"data"` e `"end"`. O primeiro é
acionado sempre que existe alguma informação chegando, e o segundo é chamado
sempre que a _stream_ chega ao fim. Esse modelo é mais adequado para um
_streamming_ de dados, que pode ser imediatamente processado, mesmo quando todo
documento ainda não está disponível. Um arquivo pode ser lido como uma _stream_
de leitura usando a função `fs.createReadStream`.

O seguinte código cria um servidor que lê o corpo da requisição e o devolve em
caixa alta para o cliente via _stream_:

```javascript
var http = require("http");
http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  request.on("data", function(chunk) {
    response.write(chunk.toString().toUpperCase());
  });
  request.on("end", function() {
    response.end();
  });
}).listen(8000);
```

A variável `chunk` enviada para o manipulador de dados será um `Buffer` binário,
que nós podemos converter para uma _string_ chamando `toString` nele, que vai
decodificá-lo usando a codificação padrão (UTF-8).

O seguinte trecho de código, se rodado enquanto o servidor que transforma letras
em caixa alta estiver rodando, vai enviar uma requisição para esse servidor e
retornar a resposta que obtiver:

```javascript
var http = require("http");
var request = http.request({
  hostname: "localhost",
  port: 8000,
  method: "POST"
}, function(response) {
  response.on("data", function(chunk) {
    process.stdout.write(chunk.toString());
  });
});
request.end("Hello server");
```

O exemplo escreve no `process.stdout` (a saída padrão de processos, como uma
_stream_ de escrita) ao invés de usar `console.log`. Nós não podemos usar
`console.log` porque isso adicionaria uma linha extra depois de cada pedaço de
texto escrito, o que é adequado no nosso exemplo.

## Um servidor de arquivos simples

Vamos combinar nossas novas descobertas sobre servidores HTTP e conversas sobre
sistema de arquivos e criar uma ponte entre eles: um servidor HTTP que permite
acesso remoto ao sistema de arquivos. Um servidor desse tipo possui diversos
usuários. Ele permite que aplicações web guardem e compartilhem dados ou dá
direito para um determinado grupo de pessoas compartilhar muitos arquivos.

Quando lidamos com arquivos de recursos HTTP, os métodos HTTP `GET`, `PUT` e
`DELETE` podem ser usados, respectivamente, para ler, escrever e apagar esses
arquivos. Nós vamos interpretar o caminho na requisição como o caminho do
arquivo referido por aquela requisição.

Provavelmente nós não queremos compartilhar todo nosso sistema de arquivos, então
nós vamos interpretar esses caminhos como se começassem no diretório de trabalho
do servidor, que é o diretório no qual ele começou. Se eu rodar o servidor de
`/home/braziljs/public/` (ou `C:\Users\braziljs\public\` no Windows), então a
requisição por `/file.txt` deve ser referir a `/home/braziljs/public/file.txt` (
ou `C:\Users\braziljs\public\file.txt`).

Nós vamos construir um programa peça por peça, usando um objeto chamado
`methods` para guardar as funções que tratam os vários métodos HTTP.

```javascript
var http = require("http"), fs = require("fs");

var methods = Object.create(null);

http.createServer(function(request, response) {
  function respond(code, body, type) {
    if (!type) type = "text/plain";
    response.writeHead(code, {"Content-Type": type});
    if (body && body.pipe)
      body.pipe(response);
    else
      response.end(body);
  }
  if (request.method in methods)
    methods[request.method](urlToPath(request.url),
                            respond, request);
  else
    respond(405, "Method " + request.method +
            " not allowed.");
}).listen(8000);
```

Isso vai começar um servidor que apenas retorna erro 405 nas respostas, que é o
código usado para indicar que dado método não está sendo tratado pelo servidor.

A função `respond` é passada para as funções que tratam os vários métodos e agem
como _callback_ para finalizar a requisição. Isso carrega um código de status
do HTTP, um corpo e opcionalmente um tipo conteúdo como argumentos. Se o valor
passado para o corpo é um _stream_ de leitura, ele terá um método `pipe`, que
será usado para encaminhar uma _stream_ de leitura para uma _stream_ de escrita.
Caso contrário, assumimos que o corpo será `null` (não há corpo) ou uma _string_
é passada diretamente para o método `end` da resposta.

Para obter um caminho de uma URL em uma requisição, a função `urlToPath` usa o
módulo "`url`" embutido no Node para parsear a URL. Ela pega o nome do caminho,
que será algo parecido a `/file.txt`, o decodifica para tirar os códigos de
escape (como `%20` e etc), e coloca um único ponto para produzir um caminho
relativo ao diretório atual.

```javascript
function urlToPath(url) {
  var path = require("url").parse(url).pathname;
  return "." + decodeURIComponent(path);
}
```

É provável que você esteja preocupado com a segurança da função `urlToPath`,
e você está certo, deve se preocupar mesmo. Nós vamos retornar a ela nos
exercícios.

Nós vamos fazer com que o método `GET` retorne uma lista de arquivos quando
lermos um diretório e retornar o conteúdo do arquivo quando lermos um arquivo
regular.

Uma questão delicada é que tipo de cabeçalho `Content-Type` nós devemos
adicionar quando retornar um conteúdo de um arquivo. Tendo em vista que esses
arquivos podem ser qualquer coisa, nosso servidor não pode simplesmente retornar
o mesmo tipo para todos eles. Mas o NPM pode ajudar com isso. O pacote `mime`
(indicadores de tipo de conteúdo como `text/plain` também são chamados
_MIME types_) sabe o tipo adequado de um grande número de extensões de arquivos.

Se você rodar o seguinte comando `npm` no diretório aonde o script do servidor
está, você estará apto a usar `require("mime")` para acessar essa biblioteca:

```javascript
$ npm install mime
npm http GET https://registry.npmjs.org/mime
npm http 304 https://registry.npmjs.org/mime
mime@1.2.11 node_modules/mime
```

Quando um arquivo requisitado não existe, o código de erro HTTP adequado a ser
retornado é 404. Nós vamos usar `fs.stat`, que obtém informações sobre um
arquivo, para saber se o arquivo existe e/ou se é um diretório.

```javascript
methods.GET = function(path, respond) {
  fs.stat(path, function(error, stats) {
    if (error && error.code == "ENOENT")
      respond(404, "File not found");
    else if (error)
      respond(500, error.toString());
    else if (stats.isDirectory())
      fs.readdir(path, function(error, files) {
        if (error)
          respond(500, error.toString());
        else
          respond(200, files.join("\n"));
      });
    else
      respond(200, fs.createReadStream(path),
              require("mime").lookup(path));
  });
};
```

Como ele pode levar um bom tempo para encontrar o arquivo no disco, `fs.stat` é
assíncrono. Quando o arquivo não existe, `fs.stat` vai passar um objeto de erro
com `"ENOENT"` em uma propriedade chamada `code` para o seu _callback_. Isso
seria muito bom se o Node definisse diferentes subtipos de `Error` para
diferentes tipos de erros, mas ele não o faz. Ao invés disso, Node coloca um
código obscuro, inspirado no sistema Unix lá.

Nós vamos reportar qualquer erro que não esperamos com o código de status 500,
que indica que o problema está no servidor, ao contrário dos códigos que começam
com 4 (como o 404), que se referem a requisições ruins. Existem algumas
situações nas quais isso não totalmente preciso, mas para um programa pequeno de
exemplo como esse, deverá ser bom o suficiente.

O objeto `status` retornado pelo `fs.stat` nos diz uma porção de coisas sobre um
arquivo, tais como tamanho (propriedade `size`) e sua data de modificação
(propriedade `mtime`). Nosso interesse aqui é saber se isso é um diretório ou um
arquivo regular, e quem nos diz isso é o método `isDirectory`.

Nós usamos `fs.readdir` para ler a lista de arquivos em um diretório e, ainda em
outro callback, retornar o resultado para o usuário. Para arquivos comuns, nós
criamos uma _stream_ de leitura com o `fs.createReadStream` e passamos ela ao
`respond`, junto com o tipo de conteúdo que o módulo `"mime"` nos deu para esse
nome de arquivo.

O código que trata as requisições de `DELETE` é um pouco mais simples.

```javascript
methods.DELETE = function(path, respond) {
  fs.stat(path, function(error, stats) {
    if (error && error.code == "ENOENT")
      respond(204);
    else if (error)
      respond(500, error.toString());
    else if (stats.isDirectory())
      fs.rmdir(path, respondErrorOrNothing(respond));
    else
      fs.unlink(path, respondErrorOrNothing(respond));
  });
};
```

Você deve estar se perguntando porque tentar deletar um arquivo inexistente
retornar um status 204, e não um erro. Quando o arquivo que será deletado não
existe, você pode dizer que o objetivo da requisição já foi cumprido. O padrão
HTTP recomenda que as pessoas façam requisições _idempotentes_, o que significa
que independente da quantidade de requisições, elas não devem produzir um
resultado diferente.

```javascript
function respondErrorOrNothing(respond) {
  return function(error) {
    if (error)
      respond(500, error.toString());
    else
      respond(204);
  };
}
```

Quando uma resposta HTTP não contém nenhum dado, o status 204 ("_no content_")
pode ser usado para indicar isso. Tendo em vista que a gente precisa construir
_callbacks_ que reportam um erro ou retornam uma resposta 204 em diferentes
situações, eu escrevi uma função chamada `respondErrorOrNothing` que cria esse
_callback_.

Aqui está a função que trata as requisições `PUT`:

```javascript
methods.PUT = function(path, respond, request) {
  var outStream = fs.createWriteStream(path);
  outStream.on("error", function(error) {
    respond(500, error.toString());
  });
  outStream.on("finish", function() {
    respond(204);
  });
  request.pipe(outStream);
};
```

Aqui, nós não precisamos checar se o arquivo existe - se ele existe, nós
simplesmente sobrescrevemos ele. Novamente nós usamos `pipe` para mover a
informação de um _stream_ de leitura para um de escrita, nesse caso de uma
requisição para um arquivo. Se a criação do _stream_ falhar, um evento `"error"`
é disparado e reportado na nossa resposta. Quando a informação for transferida
com sucesso, `pipe` vai fechar ambos _streams_, o que vai disparar o evento
`"finish"` no _stream_ de escrita. Quando isso acontecer, nós podemos reportar
sucesso na nossa resposta para o cliente com um status 204.

O script completo para o servidor está disponível em
[eloquentjavascript.net/code/file_server.js](http://eloquentjavascript.net/code/file_server.js).
Você pode fazer o download e rodá-lo com Node pra começar seu próprio servidor
de arquivos. E é claro, você pode modificá-lo e extendê-lo para resolver os
exercícios desse capítulo ou para experimentar.

A ferramente de linha de comando `curl`, amplamente disponível em sistemas Unix,
pode ser usada para fazer requisições HTTP. A sessão a seguir é um rápido teste
do nosso servidor. Note que `-X` é usado para para escolher o método da
requisição e `-d` é usado para incluir o corpo da requisição.

```bash
$ curl http://localhost:8000/file.txt
File not found
$ curl -X PUT -d hello http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
hello
$ curl -X DELETE http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
File not found

```

A primeira requisição feita para o arquivo `file.txt` falha pois o arquivo ainda
não existe. A requisição `PUT` cria o arquivo, para que então a próxima
requisição consiga encontrá-lo com sucesso. Depois de deletar o arquivo com uma
requisição `DELETE`, o arquivo passa a não ser encontrado novamente.

## Tratamento de erros
No código para o servidor de arquivos, existem seis lugares aonde nós estamos
explicitando exceções de rota que nós não sabemos como tratá-los como respostas
de erro. Como exceções são passadas como argumentos e, portanto, não são
automaticamente propagadas para os _callbacks_, elas precisam ser tratadas a
todo momento de forma explícita. Isso acaba completamente com a vantagem de
tratamento de exceções, isto é, a habilidade de centralizar o tratamento das
condições de falha.

O que acontece quando alguma coisa _joga_ uma exceção em seu sistema? Como não
estamos usando nenhum bloco `try`, a exceção vai propagar para o topo da pilha
de chamada. No Node, isso aborta o programa e escreve informações sobre a
exceção (incluindo um rastro da pilha) no programa padrão de _stream_ de erros.

Isso significa que nosso servidor vai colidir sempre que um problema for
encontrado no código do próprio servidor, ao contrário dos problemas
assíncronos, que são passados como argumentos para os _callbacks_. Se nós
quisermos tratar todas as exceções _levantadas_ durante o tratamento de uma
requisição, para ter certeza que enviamos uma resposta, precisamos adicionar
blocos de `try/catch` para todos os _callbacks_.

Isso é impraticável. Muitos programas em Node são escritos para fazer o menor
uso possível de exceções, assumindo que se uma exceção for _levantada_,
aconteceu algo que o programa não conseguiu resolver, e colidir é a resposta
certa.

Outra abordagem é usar promessas, que foram introduzidas no Capítulo 17.
Promessas capturam as exceções _levantadas_ por funções de _callback_ e propagam
elas como falhas. É possível carregar uma biblioteca de promessa no Node e
usá-la para administrar seu controle assíncrono. Algumas bibliotecas Node
fazem integração com as promessas, mas as vezes é trivial envolvê-las. O
excelente módulo `"promise"` do NPM contém uma função chamada `denodeify`, que
converte uma função assíncrona como a `fs.readFile` para uma função de retorno
de promessa.

```javascript
var Promise = require("promise");
var fs = require("fs");

var readFile = Promise.denodeify(fs.readFile);
readFile("file.txt", "utf8").then(function(content) {
  console.log("The file contained: " + content);
}, function(error) {
  console.log("Failed to read file: " + error);
});
```

A título de comparação, eu escrevi uma outra versão do servidor de arquivos
baseado em promessas, que você pode encontrar em
[eloquentjavascript.net/code/file_server_promises.js](http://eloquentjavascript.net/code/file_server_promises.js).
Essa versão é um pouco mais clara pois as funções podem retornar seus
resultados, ao invés de ter que chamar _callbacks_, e a rota de exceções está
implícito, ao invés de explícito.

Eu vou mostrar algumas linhas do servidor de arquivos baseado em promessas para
ilustrar a diferença no estilo de programação.

O objeto `fsp` que é usado por esse código contém estilos de promessas variáveis
para determinado número de funções `fs`, envolvidas por `Promise.denodeify`. O
objeto retornado, com propriedades `code` e `body`, vai se tornar o resultado
final de uma cadeia de promessas, e vai ser usado para determinar que tipo de
resposta vamos mandar pro cliente.

```javascript
methods.GET = function(path) {
  return inspectPath(path).then(function(stats) {
    if (!stats) // Does not exist
      return {code: 404, body: "File not found"};
    else if (stats.isDirectory())
      return fsp.readdir(path).then(function(files) {
        return {code: 200, body: files.join("\n")};
      });
    else
      return {code: 200,
              type: require("mime").lookup(path),
              body: fs.createReadStream(path)};
  });
};

function inspectPath(path) {
  return fsp.stat(path).then(null, function(error) {
    if (error.code == "ENOENT") return null;
    else throw error;
  });
}
```

A função `inspectPath` simplesmente envolve o `fs.stat`, que trata o caso de
arquivo não encontrado. Nesse caso, nós vamos substituir a falha por um sucesso
que representa `null`. Todos os outros erros são permitidos a propagar. Quando a
promessa retornada desses manipuladores falha, o servidor HTTP responde com um
status 500.

## Resumo
Node é um sistema bem íntegro e legal que permite rodar JavaScript em um
contexto fora do navegador. Ele foi originalmente concebido para tarefas de rede
para desempenhar o papel de um _nó_ na rede. Mas ele se permite a realizar todas
as tarefas de script, e se escrever JavaScript é algo que você gosta,
automatizar tarefas de rede com Node funciona de forma maravilhosa.

O NPM disponibiliza bibliotecas para tudo que você possa imaginar (e algumas
outras coisas que você provavelmente nunca pensou), e permite que você atualize
e instale essas bibliotecas rodando um simples comando. Node também vêm com um
bom número de módulos embutidos, incluindo o módulo `"fs"`, para trabalhar com
sistema de arquivos e o `"http"`, para rodar servidores HTTP e fazer requisições
HTTP.

Toda entrada e saída no Node é feita de forma assíncrona, a menos que você
explicitamente use uma variante síncrona da função, como a `fs.readFileSync`.
Você fornece as funções de _callback_ e o Node vai chamá-las no tempo certo,
quando o _I/O_ que você solicitou tenha terminado.

## Exercícios

### Negociação de Conteúdo, novamente

No Capítulo 17, o primeiro exercício era fazer várias requisições para
[eloquentjavascript.net/author](http://eloquentjavascript.net/author), pedindo
por tipos diferentes de conteúdo passando cabeçalhos `Accept` diferentes.

Faça isso novamente usando a função `http.request` do Node. Solicite pelo menos
os tipos de mídia `text/plain`, `text/html` e `application/json`. Lembre-se que
os cabeçalhos para uma requisição podem ser passados como objetos, na
propriedade `headers` do primeiro argumento da `http.request`.

Escreva o conteúdo das respostas para cada requisição.

**Dica:**
Não se esqueça de chamar o método `end` no objeto retornado pela `http.request`
para de fato disparar a requisição.

O objeto de resposta passado ao _callback_ da `http.request` é um _stream_ de
leitura. Isso significa que ele não é muito trivial pegar todo o corpo da
resposta dele. A função a seguir lê todo o _stream_ e chama uma função de
_callback_ com o resultado, usando o padrão comum de passar qualquer erro
encontrado como o primeiro argumento do _callback_:

```javascript
function readStreamAsString(stream, callback) {
  var data = "";
  stream.on("data", function(chunk) {
    data += chunk.toString();
  });
  stream.on("end", function() {
    callback(null, data);
  });
  stream.on("error", function(error) {
    callback(error);
  });
}
```

## Corrigindo uma falha
Para um fácil acesso remoto aos arquivos, eu poderia adquirir o hábito de ter o
servidor de arquivos definido nesse capítulo na minha máquina, no diretório
`/home/braziljs/public/`. E então, um dia, eu encontro alguém que tenha
conseguido acesso a todos as senhas que eu gravei no navegador.

O que aconteceu?

Se ainda não está claro para você, pense novamente na função `urlToPath`
definida dessa forma:

```javascript
function urlToPath(url) {
  var path = require("url").parse(url).pathname;
  return "." + decodeURIComponent(path);
}
```

Agora considere o fato de que os caminhos para as funções `"fs"` podem ser
relativos-eles podem conter "../" para voltar a um diretório acima. O que
acontece quando um cliente envia uma requisição para uma dessas URLs abaixo?

```
http://myhostname:8000/../.config/config/google-chrome/Default/Web%20Data
http://myhostname:8000/../.ssh/id_dsa
http://myhostname:8000/../../../etc/passwd
```

Mudar o `urlToPath` corrige esse problema. Levando em conta o fato de que o Node
no Windows permite tanto barras quanto contrabarras para separar diretórios.

Além disso, pense no fato de que assim que você expor algum sistema _meia boca_
na internet, os _bugs_ nesse sistema podem ser usado para fazer coisas ruins
para sua máquina.

**Dicas**
Basta remover todas as recorrências de dois pontos que tenham uma barra, uma
contrabarra ou as extremidades da _string_. Usando o método `replace` com uma
expressão regular é a maneira mais fácil de fazer isso. Não se esqueça da _flag_
`g` na expressão, ou o `replace` vai substituir somente uma única instância e
as pessoas ainda poderiam incluir pontos duplos no caminho da URL a partir dessa
medida de segurança! Também tenha certeza de substituir _depois_ de decodificar
a _string_, ou seria possível despistar o seu controle que codifica pontos e
barras.

Outro caso de preocupação potencial é quando os caminhos começam com barra, que
são interpretados como caminhos absolutos. Mas por conta do `urlToPath` colocar
um ponto na frente do caminho, é impossível criar requisições que resultam em
tal caminho. Múltiplas barras numa linha, dentro do caminho, são estranhas mas
serão tratadas como uma única barra pelo sistema de arquivos.

## Criando diretórios
Embora o método `DELETE` esteja envolvido em apagar diretórios (usando
`fs.rmdir`), o servidor de arquivos não disponibiliza atualmente nenhuma maneira
de _criar_ diretórios.

Adicione suporte para o método `MKCOL`, que deve criar um diretório chamando
`fs.mkdir`. `MKCOL` não é um método básico do HTTP, mas ele existe nas normas
da _WebDAV_, que especifica um conjunto de extensões para o HTTP, tornando-o
adequado para escrever recursos, além de os ler.

**Dicas**
Você pode usar a função que implementa o método `DELETE` como uma planta baixa
para o método `MKCOL`. Quando nenhum arquivo é encontrado, tente criar um
diretório com `fs.mkdir`. Quando um diretório existe naquele caminho, você pode
retornar uma resposta 204, então as requisições de criação de diretório serão
_idempotentes_. Se nenhum diretório de arquivo existe, retorne um código de
erro. O código 400 ("_bad request_") seria o mais adequado nessa situação.

## Um espaço público na rede
Uma vez que o servidor de arquivos serve qualquer tipo de arquivo e ainda inclui
o cabeçalho `Content-Type`, você pode usá-lo para servir um website. Mas uma vez
que seu servidor de arquivos permita que qualquer um delete e sobrescreva
arquivos, seria um tipo interessante de website: que pode ser modificado,
vandalizado e destruído por qualquer um que gaste um tempo para criar a
requisição HTTP correta. Mas ainda assim, seria um website.

Escreva uma página HTML básica que inclui um simples arquivo JavaScript. Coloque
os arquivos num diretório servido pelo servidor de arquivos e abra isso no seu
navegador.

Em seguida, como um exercício avançado ou como um projeto de fim de semana,
combine todo o conhecimento que você adquiriu desse livro para construir uma
interface mais amigável pra modificar o website de dentro do website.

Use um formulário HTML (Capítulo 18) para editar os conteúdos dos arquivos que
fazem parte do website, permitindo que o usuário atualize eles no servidor
fazendo requisições HTTP como vimos no Capítulo 17.

Comece fazendo somente um único arquivo editável. Então faça de uma maneira que
o usuário escolha o arquivo que quer editar. Use o fato de que nosso servidor de
arquivos retorna uma lista de arquivos durante a leitura de um diretório.

Não trabalhe diretamente no código do servidor de arquivos, tendo em vista que
se você cometer um engano você vai afetar diretamente os arquivos que estão lá.
Ao invés disso, mantenha seu trabalho em um diretório sem acessibilidade pública
e copie ele pra lá enquanto testa.

Se seu computador está diretamente ligado a internet, sem um _firewall_,
roteador, ou outro dispositivo interferindo, você pode ser capaz de convidar um
amigo para usar seu website. Para checar, vá até
[whatismyip.com](http://www.whatismyip.com/), copie e cole o endereço de IP que
ele te deu na barra de endereço do seu navegador, e adicione `:8000` depois dele
para selecionar a porta correta. Se isso te levar ao seu website, está online
para qualquer um que quiser ver.

**Dicas**
Você pode criar um elemento `<textarea>` para conter o conteúdo do arquivo que
está sendo editado. Uma requisição `GET`, usando `XMLHttpRequest`, pode ser
usada para pegar o atual conteúdo do arquivo. Você pode usar URLs relativas como
_index.html_, ao invés de _http://localhost:8000/index.html_, para referir-se
aos arquivos do mesmo servidor que está rodando o script.

Então, quando o usuário clicar num botão (você pode usar um elemento `<form>` e
um evento `"submit"` ou um simples manipulador `"click"`), faça uma requisição
`PUT` para a mesma URL, com o conteúdo do `<textarea>` no corpo da requisição
para salvar o arquivo.

Você pode então adicionar um elemento `<select>` que contenha todos os arquivos
na raiz do servidor adicionando elementos `<option>` contendo as linhas
retornadas pela requisição `GET` para a URL /. Quando um usuário seleciona outro
arquivo (um evento `"change"` nesse campo), o script deve buscar e mostrar o
arquivo. Também tenha certeza que quando salvar um arquivo, você esteja usando
o nome do arquivo selecionado.

Infelizmente, o servidor é muito simplista para ser capaz de ler arquivos de
subdiretórios de forma confiável, uma vez que ele não nos diz se a coisa que
está sendo buscado com uma requisição `GET` é um arquivo ou um diretório. Você
consegue pensar em uma maneira de extender o servidor para solucionar isso?
