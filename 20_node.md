{{meta {code_links: ["code/file_server.mjs"]}}}

# Node.js

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

Um estudante perguntou: 'Os programadores de antigamente usavam apenas máquinas simples e nenhuma linguagem de programação, mas mesmo assim faziam programas bonitos. Por que usamos máquinas complicadas e linguagens de programação?' Fu-Tzu respondeu: 'Os construtores de antigamente usavam apenas gravetos e argila, mas mesmo assim faziam cabanas bonitas.'

quote}}

{{index "Yuan-Ma", "Book of Programming"}}

{{figure {url: "img/chapter_picture_20.jpg", alt: "Illustration showing a telephone pole with a tangle of wires going in all directions", chapter: "framed"}}}

{{index "command line"}}

Até agora, usamos a linguagem JavaScript em um único ambiente: o navegador. Este capítulo e o [próximo](skillsharing) apresentarão brevemente o ((Node.js)), um programa que permite aplicar suas habilidades de JavaScript fora do navegador. Com ele, você pode construir qualquer coisa, desde pequenas ferramentas de linha de comando até ((servidor))es HTTP que alimentam ((website))s dinâmicos.

Estes capítulos visam ensinar os principais conceitos que o Node.js usa e dar informações suficientes para escrever programas úteis para ele. Eles não tentam ser um tratamento completo, ou mesmo detalhado, da plataforma.

{{if interactive

Enquanto você podia executar o código dos capítulos anteriores diretamente nestas páginas, porque era JavaScript puro ou escrito para o navegador, os exemplos de código neste capítulo são escritos para Node e geralmente não rodarão no navegador.

if}}

Se você quiser acompanhar e executar o código neste capítulo, precisará instalar o Node.js versão 18 ou superior. Para isso, vá a [_https://nodejs.org_](https://nodejs.org) e siga as instruções de instalação para seu sistema operacional. Você também pode encontrar mais ((documentação)) do Node.js lá.

## Contexto

{{index responsiveness, input, [network, speed]}}

Ao construir sistemas que se comunicam pela rede, a forma como você gerencia entrada e ((saída)) — ou seja, a leitura e escrita de dados na rede e no ((disco rígido)) — pode fazer uma grande diferença em quão rápido um sistema responde ao usuário ou a requisições de rede.

{{index ["asynchronous programming", "in Node.js"]}}

Em tais programas, programação assíncrona é frequentemente útil. Ela permite que o programa envie e receba dados de e para múltiplos dispositivos ao mesmo tempo sem complicado gerenciamento de threads e sincronização.

{{index "programming language", "Node.js", standard}}

Node foi inicialmente concebido para tornar a programação assíncrona fácil e conveniente. JavaScript se presta bem a um sistema como Node. É uma das poucas linguagens de programação que não tem uma forma embutida de fazer entrada e saída. Assim, JavaScript pôde se encaixar na abordagem bastante excêntrica do Node para programação de rede e sistema de arquivos sem acabar com duas interfaces inconsistentes. Em 2009, quando Node estava sendo projetado, as pessoas já estavam fazendo programação baseada em callbacks no navegador, então a ((comunidade)) em torno da linguagem estava acostumada a um estilo de programação assíncrona.

## O comando node

{{index "node program"}}

Quando o ((Node.js)) é instalado em um sistema, ele fornece um programa chamado `node`, que é usado para executar arquivos JavaScript. Digamos que você tenha um arquivo `hello.js`, contendo este código:

```
let message = "Hello world";
console.log(message);
```

Você pode então executar `node` a partir da ((linha de comando)) assim para executar o programa:

```{lang: null}
$ node hello.js
Hello world
```

{{index "console.log"}}

O método `console.log` no Node faz algo similar ao que faz no navegador. Ele imprime um texto. Mas no Node, o texto irá para o fluxo de ((saída padrão)) do processo em vez de para o ((console JavaScript)) de um navegador. Quando executar `node` a partir da linha de comando, isso significa que você vê os valores registrados em seu ((terminal)).

{{index "node program", "read-eval-print loop"}}

Se você executar `node` sem dar a ele um arquivo, ele fornece um prompt no qual você pode digitar código JavaScript e imediatamente ver o resultado.

```{lang: null}
$ node
> 1 + 1
2
> [-1, -2, -3].map(Math.abs)
[1, 2, 3]
> process.exit(0)
$
```

{{index "process object", "global scope", [binding, global], "exit method", "status code"}}

A variável `process`, assim como a variável `console`, está disponível globalmente no Node. Ela fornece várias formas de inspecionar e manipular o programa atual. O método `exit` encerra o processo e pode receber um código de status de saída, que diz ao programa que iniciou o `node` (neste caso, o shell da linha de comando) se o programa completou com sucesso (código zero) ou encontrou um erro (qualquer outro código).

{{index "command line", "argv property"}}

Para encontrar os argumentos de linha de comando passados ao seu script, você pode ler `process.argv`, que é um array de strings. Note que ele também inclui o nome do comando `node` e o nome do seu script, então os argumentos reais começam no índice 2. Se `showargv.js` contém a instrução `console.log(process.argv)`, você poderia executá-lo assim:

```{lang: null}
$ node showargv.js one --and two
["node", "/tmp/showargv.js", "one", "--and", "two"]
```

{{index [binding, global]}}

Todas as variáveis globais ((padrão)) do JavaScript, como `Array`, `Math` e `JSON`, também estão presentes no ambiente do Node. Funcionalidades relacionadas ao navegador, como `document` ou `prompt`, não estão.

## Módulos

{{index "Node.js", "global scope", "module loader"}}

Além das variáveis que mencionei, como `console` e `process`, o Node coloca poucas variáveis adicionais no escopo global. Se você quiser acessar funcionalidades embutidas, tem que pedir ao sistema de módulos.

{{index "require function"}}

Node começou usando o sistema de módulos ((CommonJS)), baseado na função `require`, que vimos no [Capítulo ?](modules#commonjs). Ele ainda usará este sistema por padrão quando você carregar um arquivo `.js`.

{{index "import keyword", "ES modules"}}

Mas hoje, Node também suporta o sistema de módulos ES mais moderno. Quando o nome de um arquivo de script termina em `.mjs`, ele é considerado como tal módulo, e você pode usar `import` e `export` nele (mas não `require`). Usaremos módulos ES neste capítulo.

{{index [path, "filesystem"], "relative path", resolution}}

Ao importar um módulo — seja com `require` ou `import` — o Node tem que resolver a string dada para um ((arquivo)) real que possa carregar. Nomes que começam com `/`, `./` ou `../` são resolvidos como arquivos, relativos ao caminho do módulo atual. Aqui, `.` representa o diretório atual, `../` o diretório acima, e `/` a raiz do sistema de arquivos. Se você pedir `"./graph.mjs"` do arquivo `/tmp/robot/robot.mjs`, o Node tentará carregar o arquivo `/tmp/robot/graph.mjs`.

{{index "node_modules directory", directory}}

Quando uma string que não parece um caminho relativo ou absoluto é importada, assume-se que ela se refere a um módulo embutido ou a um módulo instalado em um diretório `node_modules`. Por exemplo, importar de `"node:fs"` lhe dará o módulo embutido de sistema de arquivos do Node. Importar `"robot"` pode tentar carregar a biblioteca encontrada em `node_modules/robot/`. É comum instalar tais bibliotecas usando ((NPM)), ao qual voltaremos em um momento.

{{index "import keyword", "Node.js", "garble example"}}

Vamos montar um pequeno projeto consistindo de dois arquivos. O primeiro, chamado `main.mjs`, define um script que pode ser chamado da ((linha de comando)) para inverter uma string.

```
import {reverse} from "./reverse.mjs";

// O índice 2 contém o primeiro argumento real da linha de comando
let argument = process.argv[2];

console.log(reverse(argument));
```

{{index reuse, "Array.from function", "join method"}}

O arquivo `reverse.mjs` define uma biblioteca para inverter strings, que pode ser usada tanto por esta ferramenta de linha de comando quanto por outros scripts que precisem de acesso direto a uma função de inversão de strings.

```
export function reverse(string) {
  return Array.from(string).reverse().join("");
}
```

{{index "export keyword", "ES modules", [interface, module]}}

Lembre-se de que `export` é usado para declarar que uma variável é parte da interface do módulo. Isso permite que `main.mjs` importe e use a função.

Podemos agora chamar nossa ferramenta assim:

```{lang: null}
$ node main.mjs JavaScript
tpircSavaJ
```

## Instalando com NPM

{{index NPM, "Node.js", "npm program", library}}

NPM, introduzido no [Capítulo ?](modules#modules_npm), é um repositório online de ((módulo))s JavaScript, muitos dos quais são escritos especificamente para Node. Quando você instala Node no seu computador, também obtém o comando `npm`, que pode usar para interagir com este repositório.

{{index "ini package"}}

O principal uso do NPM é ((baixar)) pacotes. Vimos o pacote `ini` no [Capítulo ?](modules#modules_ini). Podemos usar NPM para buscar e instalar esse pacote em nosso computador.

```{lang: null}
$ npm install ini
added 1 package in 723ms

$ node
> const {parse} = require("ini");
> parse("x = 1\ny = 2");
{ x: '1', y: '2' }
```

{{index "require function", "node_modules directory", "npm program"}}

Após executar `npm install`, o ((NPM)) terá criado um diretório chamado `node_modules`. Dentro desse diretório haverá um diretório `ini` que contém a ((biblioteca)). Você pode abri-lo e olhar o código. Quando importamos `"ini"`, esta biblioteca é carregada, e podemos chamar sua propriedade `parse` para analisar um arquivo de configuração.

Por padrão, NPM instala pacotes sob o diretório atual em vez de em um lugar central. Se você está acostumado com outros gerenciadores de pacotes, isso pode parecer incomum, mas tem vantagens — coloca cada aplicação em controle total dos pacotes que instala e torna mais fácil gerenciar versões e limpar ao remover uma aplicação.

### Arquivos de pacote

{{index "package.json", dependency}}

Após executar `npm install` para instalar algum pacote, você encontrará não apenas um diretório `node_modules` mas também um arquivo chamado `package.json` em seu diretório atual. É recomendado ter tal arquivo para cada projeto. Você pode criá-lo manualmente ou executar `npm init`. Este arquivo contém informações sobre o projeto, como seu nome e ((versão)), e lista suas dependências.

A simulação do robô do [Capítulo ?](robot), como modularizada no exercício do [Capítulo ?](modules#modular_robot), pode ter um arquivo `package.json` assim:

```{lang: "json"}
{
  "author": "Marijn Haverbeke",
  "name": "eloquent-javascript-robot",
  "description": "Simulation of a package-delivery robot",
  "version": "1.0.0",
  "main": "run.mjs",
  "dependencies": {
    "dijkstrajs": "^1.0.1",
    "random-item": "^1.0.0"
  },
  "license": "ISC"
}
```

{{index "npm program", tool}}

Quando você executa `npm install` sem nomear um pacote para instalar, NPM instalará as dependências listadas em `package.json`. Quando você instala um pacote específico que ainda não está listado como dependência, NPM o adicionará a `package.json`.

### Versões

{{index "package.json", dependency, evolution}}

Um arquivo `package.json` lista tanto a ((versão)) do próprio programa quanto as versões de suas dependências. Versões são uma forma de lidar com o fato de que ((pacote))s evoluem separadamente, e código escrito para funcionar com um pacote como ele existia em um momento pode não funcionar com uma versão posterior e modificada do pacote.

{{index compatibility}}

NPM exige que seus pacotes sigam um esquema chamado _((versionamento semântico))_, que codifica algumas informações sobre quais versões são _compatíveis_ (não quebram a interface antiga) no número da versão. Uma versão semântica consiste em três números separados por pontos, como `2.3.0`. Toda vez que nova funcionalidade é adicionada, o número do meio deve ser incrementado. Toda vez que a compatibilidade é quebrada, de forma que código existente que usa o pacote pode não funcionar com a nova versão, o primeiro número deve ser incrementado.

{{index "caret character"}}

Um caractere de circunflexo (`^`) na frente do número da versão para uma dependência em `package.json` indica que qualquer versão compatível com o número dado pode ser instalada. Por exemplo, `"^2.3.0"` significaria que qualquer versão maior ou igual a 2.3.0 e menor que 3.0.0 é permitida.

{{index publishing}}

O comando `npm` também é usado para publicar novos pacotes ou novas versões de pacotes. Se você executar `npm publish` em um ((diretório)) que tem um arquivo `package.json`, ele publicará um pacote com o nome e versão listados no arquivo JSON no registro. Qualquer pessoa pode publicar pacotes no NPM — embora apenas sob um nome de pacote que não esteja em uso ainda, já que não seria bom se pessoas aleatórias pudessem atualizar pacotes existentes.

Este livro não vai entrar em mais detalhes do uso do ((NPM)). Consulte [_https://npmjs.com_](https://npmjs.com) para mais documentação e uma forma de pesquisar pacotes.

## O módulo de sistema de arquivos

{{index directory, "node:fs package", "Node.js", [file, access]}}

Um dos módulos embutidos mais usados no Node é o módulo `node:fs`, que significa _((sistema de arquivos))_. Ele exporta funções para trabalhar com arquivos e diretórios.

{{index "readFile function", "callback function"}}

Por exemplo, a função chamada `readFile` lê um arquivo e depois chama um callback com o conteúdo do arquivo.

```
import {readFile} from "node:fs";
readFile("file.txt", "utf8", (error, text) => {
  if (error) throw error;
  console.log("The file contains:", text);
});
```

{{index "Buffer class"}}

O segundo argumento para `readFile` indica a _((codificação de caracteres))_ usada para decodificar o arquivo em uma string. Existem várias formas pelas quais ((texto)) pode ser codificado em dados ((binários)), mas a maioria dos sistemas modernos usa ((UTF-8)). A menos que você tenha razões para acreditar que outra codificação é usada, passe `"utf8"` ao ler um arquivo de texto. Se você não passar uma codificação, o Node assumirá que você está interessado nos dados binários e lhe dará um objeto `Buffer` em vez de uma string. Este é um objeto ((semelhante a array)) que contém números representando os bytes (pedaços de dados de 8 bits) nos arquivos.

```
import {readFile} from "node:fs";
readFile("file.txt", (error, buffer) => {
  if (error) throw error;
  console.log("The file contained", buffer.length, "bytes.",
              "The first byte is:", buffer[0]);
});
```

{{index "writeFile function", "filesystem", [file, access]}}

Uma função semelhante, `writeFile`, é usada para escrever um arquivo no disco.

```
import {writeFile} from "node:fs";
writeFile("graffiti.txt", "Node was here", err => {
  if (err) console.log(`Failed to write file: ${err}`);
  else console.log("File written.");
});
```

{{index "Buffer class", "character encoding"}}

Aqui não foi necessário especificar a codificação — `writeFile` assumirá que, quando recebe uma string para escrever, em vez de um objeto `Buffer`, deve escrevê-la como texto usando sua codificação de caracteres padrão, que é ((UTF-8)).

{{index "node:fs package", "readdir function", "stat function", "rename function", "unlink function"}}

O módulo `node:fs` contém muitas outras funções úteis: `readdir` lhe dará os arquivos em um ((diretório)) como um array de strings, `stat` recuperará informações sobre um arquivo, `rename` renomeará um arquivo, `unlink` removerá um, e assim por diante. Veja a documentação em [_https://nodejs.org_](https://nodejs.org) para detalhes.

{{index ["asynchronous programming", "in Node.js"], "Node.js", "error handling", "callback function"}}

A maioria destas recebe uma função de callback como último parâmetro, que chamam com um erro (o primeiro argumento) ou com um resultado bem-sucedido (o segundo). Como vimos no [Capítulo ?](async), existem desvantagens neste estilo de programação — a maior delas sendo que o tratamento de erros se torna verboso e propenso a erros.

{{index "Promise class", "node:fs/promises package"}}

O módulo `node:fs/promises` exporta a maioria das mesmas funções que o módulo antigo `node:fs`, mas usa promises em vez de funções de callback.

```
import {readFile} from "node:fs/promises";
readFile("file.txt", "utf8")
  .then(text => console.log("The file contains:", text));
```

{{index "synchronous programming", "node:fs package", "readFileSync function"}}

Às vezes você não precisa de assincronicidade e ela só atrapalha. Muitas das funções em `node:fs` também têm uma variante síncrona, que tem o mesmo nome com `Sync` adicionado ao final. Por exemplo, a versão síncrona de `readFile` é chamada `readFileSync`.

```
import {readFileSync} from "node:fs";
console.log("The file contains:",
            readFileSync("file.txt", "utf8"));
```

{{index optimization, performance, blocking}}

Note que enquanto tal operação síncrona está sendo realizada, seu programa é parado inteiramente. Se ele deveria estar respondendo ao usuário ou a outras máquinas na rede, ficar preso em uma ação síncrona pode produzir atrasos incômodos.

## O módulo HTTP

{{index "Node.js", "node:http package", [HTTP, server]}}

Outro módulo central é chamado `node:http`. Ele fornece funcionalidade para executar um ((servidor)) HTTP.

{{index "listening (TCP)", "listen method", "createServer function"}}

Isso é tudo que é preciso para iniciar um servidor HTTP:

```
import {createServer} from "node:http";
let server = createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(`
    <h1>Hello!</h1>
    <p>You asked for <code>${request.url}</code></p>`);
  response.end();
});
server.listen(8000);
console.log("Listening! (port 8000)");
```

{{index port, localhost}}

Se você executar este script em sua própria máquina, pode apontar seu navegador para [_http://localhost:8000/hello_](http://localhost:8000/hello) para fazer uma requisição ao seu servidor. Ele responderá com uma pequena página HTML.

{{index "createServer function", HTTP}}

A função passada como argumento para `createServer` é chamada toda vez que um cliente se conecta ao servidor. As variáveis `request` e `response` são objetos representando os dados de entrada e de saída. O primeiro contém informações sobre a ((requisição)), como sua propriedade `url`, que nos diz para qual URL a requisição foi feita.

Quando você abre aquela página no seu navegador, ele envia uma requisição para seu próprio computador. Isso faz a função do servidor ser executada e enviar de volta uma resposta, que você pode então ver no navegador.

{{index "200 (HTTP status code)", "Content-Type header", "writeHead method"}}

Para enviar algo ao cliente, você chama métodos no objeto `response`. O primeiro, `writeHead`, escreverá os ((cabeçalhos)) da ((resposta)) (veja [Capítulo ?](http#headers)). Você dá a ele o código de status (200 para "OK" neste caso) e um objeto que contém valores de cabeçalhos. O exemplo define o cabeçalho `Content-Type` para informar ao cliente que estaremos enviando de volta um documento HTML.

{{index "writable stream", "body (HTTP)", stream, "write method", "end method"}}

Em seguida, o corpo real da resposta (o próprio documento) é enviado com `response.write`. Você pode chamar este método múltiplas vezes se quiser enviar a resposta pedaço por pedaço — por exemplo, para transmitir dados ao cliente conforme se tornam disponíveis. Finalmente, `response.end` sinaliza o fim da resposta.

{{index "listen method"}}

A chamada a `server.listen` faz com que o ((servidor)) comece a esperar por conexões na ((porta)) 8000. É por isso que você tem que se conectar a _localhost:8000_ para falar com este servidor, em vez de apenas _localhost_, que usaria a porta padrão 80.

{{index "Node.js", "kill process"}}

Quando você executa este script, o processo simplesmente fica lá esperando. Quando um script está ouvindo eventos — neste caso, conexões de rede — `node` não sairá automaticamente quando chegar ao final do script. Para fechá-lo, pressione [ctrl]{keyname}-C.

{{index [method, HTTP]}}

Um ((servidor)) web real geralmente faz mais do que o do exemplo — ele olha o ((método)) da requisição (a propriedade `method`) para ver que ação o cliente está tentando realizar e olha a ((URL)) da requisição para descobrir em qual recurso esta ação está sendo realizada. Veremos um servidor mais avançado [mais adiante neste capítulo](node#file_server).

{{index "node:http package", "request function", "fetch function", [HTTP, client]}}

O módulo `node:http` também fornece uma função `request` que pode ser usada para fazer requisições HTTP. No entanto, ela é muito mais trabalhosa de usar do que `fetch`, que vimos no [Capítulo ?](http). Felizmente, `fetch` também está disponível no Node como uma variável global. A menos que você queira fazer algo muito específico, como processar o documento de resposta pedaço por pedaço conforme os dados chegam pela rede, eu recomendo usar `fetch`.

## Streams

{{index "Node.js", stream, "writable stream", "callback function", ["asynchronous programming", "in Node.js"], "write method", "end method", "Buffer class"}}

O objeto de resposta no qual o servidor HTTP podia escrever é um exemplo de um objeto de _stream gravável_, que é um conceito amplamente usado no Node. Tais objetos têm um método `write` ao qual pode ser passada uma string ou um objeto `Buffer` para escrever algo no stream. Seu método `end` fecha o stream e opcionalmente recebe um valor para escrever no stream antes de fechar. Ambos os métodos também podem receber um callback como argumento adicional, que chamarão quando a escrita ou o fechamento tiver terminado.

{{index "createWriteStream function", "writeFile function", [file, stream]}}

É possível criar um stream gravável que aponta para um arquivo com a função `createWriteStream` do módulo `node:fs`. Você pode então usar o método `write` no objeto resultante para escrever o arquivo pedaço por pedaço, em vez de de uma só vez, como com `writeFile`.

{{index "createServer function", "request function", "event handling", "readable stream"}}

_((Stream))s de leitura_ são um pouco mais complexos. O argumento `request` para o callback do servidor HTTP é um stream de leitura. Ler de um stream é feito usando manipuladores de eventos em vez de métodos.

{{index "on method", "addEventListener method"}}

Objetos que emitem eventos no Node têm um método chamado `on` que é similar ao método `addEventListener` no navegador. Você dá a ele um nome de evento e depois uma função, e ele registrará aquela função para ser chamada sempre que o evento dado ocorrer.

{{index "createReadStream function", "data event", "end event", "readable stream"}}

((Stream))s de leitura têm eventos `"data"` e `"end"`. O primeiro é disparado toda vez que dados chegam, e o segundo é chamado quando o stream chega ao fim. Este modelo é mais adequado para dados _streaming_ que podem ser imediatamente processados, mesmo quando o documento inteiro ainda não está disponível. Um arquivo pode ser lido como um stream de leitura usando a função `createReadStream` de `node:fs`.

{{index "upcasing server example", capitalization, "toUpperCase method"}}

Este código cria um ((servidor)) que lê corpos de requisição e os transmite de volta ao cliente como texto todo em maiúsculas:

```
import {createServer} from "node:http";
createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"});
  request.on("data", chunk =>
    response.write(chunk.toString().toUpperCase()));
  request.on("end", () => response.end());
}).listen(8000);
```

{{index "Buffer class", "toString method"}}

O valor `chunk` passado ao manipulador de dados será um `Buffer` binário. Podemos convertê-lo em uma string decodificando-o como caracteres codificados em UTF-8 com seu método `toString`.

O código a seguir, quando executado com o servidor de maiúsculas ativo, enviará uma requisição àquele servidor e exibirá a resposta que recebe:

```
fetch("http://localhost:8000/", {
  method: "POST",
  body: "Hello server"
}).then(resp => resp.text()).then(console.log);
// → HELLO SERVER
```

{{id file_server}}

## Um servidor de arquivos

{{index "file server example", "Node.js", [HTTP, server]}}

Vamos combinar nosso conhecimento recém-adquirido sobre ((servidores)) HTTP e trabalho com o ((sistema de arquivos)) para criar uma ponte entre os dois: um servidor HTTP que permite ((acesso remoto)) a um sistema de arquivos. Tal servidor tem todos os tipos de usos — permite que aplicações web armazenem e compartilhem dados, ou pode dar a um grupo de pessoas acesso compartilhado a um conjunto de arquivos.

{{index [path, URL], "GET method", "PUT method", "DELETE method", [file, resource]}}

Quando tratamos arquivos como ((recurso))s HTTP, os métodos HTTP `GET`, `PUT` e `DELETE` podem ser usados para ler, escrever e deletar os arquivos, respectivamente. Interpretaremos o caminho na requisição como o caminho do arquivo ao qual a requisição se refere.

{{index [path, "filesystem"], "relative path"}}

Provavelmente não queremos compartilhar todo nosso sistema de arquivos, então interpretaremos esses caminhos como começando no diretório de trabalho do servidor, que é o diretório no qual ele foi iniciado. Se eu executasse o servidor a partir de `/tmp/public/` (ou `C:\tmp\public\` no Windows), então uma requisição para `/file.txt` deveria se referir a `/tmp/public/file.txt` (ou `C:\tmp\public\file.txt`).

{{index "file server example", "Node.js", "methods object", "Promise class"}}

Construiremos o programa pedaço por pedaço, usando um objeto chamado `methods` para armazenar as funções que tratam os vários métodos HTTP. Manipuladores de método são funções `async` que recebem o objeto de requisição como argumento e retornam uma promise que resolve para um objeto que descreve a resposta.

```{includeCode: ">code/file_server.mjs"}
import {createServer} from "node:http";

const methods = Object.create(null);

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request).catch(error => {
    if (error.status != null) return error;
    return {body: String(error), status: 500};
  }).then(({body, status = 200, type = "text/plain"}) => {
    response.writeHead(status, {"Content-Type": type});
    if (body?.pipe) body.pipe(response);
    else response.end(body);
  });
}).listen(8000);

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`
  };
}
```

{{index "405 (HTTP status code)"}}

Isso inicia um servidor que apenas retorna respostas de erro 405, que é o código usado para indicar que o servidor se recusa a tratar um determinado método.

{{index "500 (HTTP status code)", "error handling", "error response"}}

Quando a promise de um manipulador de requisição é rejeitada, a chamada `catch` traduz o erro em um objeto de resposta, se já não for um, para que o servidor possa enviar de volta uma resposta de erro para informar ao cliente que falhou ao tratar a requisição.

{{index "200 (HTTP status code)", "Content-Type header"}}

O campo `status` da descrição da resposta pode ser omitido, caso em que o padrão é 200 (OK). O tipo de conteúdo, na propriedade `type`, também pode ser deixado de fora, caso em que assume-se que a resposta é texto simples.

{{index "end method", "pipe method", stream}}

Quando o valor de `body` é um ((stream de leitura)), ele terá um método `pipe` que podemos usar para encaminhar todo o conteúdo de um stream de leitura para um ((stream gravável)). Se não for, assume-se que é `null` (sem corpo), uma string, ou um buffer, e é passado diretamente ao método `end` da ((resposta)).

{{index [path, URL], "urlPath function", "URL class", parsing, [escaping, "in URLs"], "decodeURIComponent function", "startsWith method"}}

Para descobrir qual caminho de arquivo corresponde a uma URL de requisição, a função `urlPath` usa a classe embutida `URL` (que também existe no navegador) para analisar a URL. Este construtor espera uma URL completa, não apenas a parte que começa com a barra que obtemos de `request.url`, então damos a ele um nome de domínio falso para preencher. Ele extrai seu pathname, que será algo como `"/file.txt"`, decodifica para se livrar dos códigos de escape estilo `%20`, e o resolve relativo ao diretório de trabalho do programa.

```{includeCode: ">code/file_server.mjs"}
import {resolve, sep} from "node:path";

const baseDirectory = process.cwd();

function urlPath(url) {
  let {pathname} = new URL(url, "http://d");
  let path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory &&
      !path.startsWith(baseDirectory + sep)) {
    throw {status: 403, body: "Forbidden"};
  }
  return path;
}
```

Assim que você configura um programa para aceitar requisições de rede, tem que começar a se preocupar com ((segurança)). Neste caso, se não formos cuidadosos, é provável que acidentalmente exponhamos todo nosso ((sistema de arquivos)) à rede.

Caminhos de arquivo são strings no Node. Para mapear tal string para um arquivo real, há uma quantidade não trivial de interpretação acontecendo. Caminhos podem, por exemplo, incluir `../` para se referir a um diretório pai. Uma fonte óbvia de problemas seriam requisições para caminhos como `/../secret_file`.

{{index "node:path package", "resolve function", "cwd function", "process object", "403 (HTTP status code)", "sep binding", ["backslash character", "as path separator"], "slash character"}}

Para evitar tais problemas, `urlPath` usa a função `resolve` do módulo `node:path`, que resolve caminhos relativos. Ela então verifica que o resultado está _abaixo_ do diretório de trabalho. A função `process.cwd` (onde `cwd` significa _diretório de trabalho atual_) pode ser usada para encontrar este diretório de trabalho. A variável `sep` do pacote `node:path` é o separador de caminho do sistema — uma barra invertida no Windows e uma barra normal na maioria dos outros sistemas. Quando o caminho não começa com o diretório base, a função lança um objeto de resposta de erro, usando o código de status HTTP indicando que o acesso ao recurso é proibido.

{{index "file server example", "Node.js", "GET method", [file, resource]}}

Vamos configurar o método `GET` para retornar uma lista de arquivos ao ler um ((diretório)) e para retornar o conteúdo do arquivo ao ler um arquivo regular.

{{index "media type", "Content-Type header", "mime-types package"}}

Uma questão complicada é que tipo de cabeçalho `Content-Type` devemos definir ao retornar o conteúdo de um arquivo. Como esses arquivos podem ser qualquer coisa, nosso servidor não pode simplesmente retornar o mesmo tipo de conteúdo para todos eles. ((NPM)) pode nos ajudar novamente aqui. O pacote `mime-types` (indicadores de tipo de conteúdo como `text/plain` também são chamados de _((tipo MIME))s_) conhece o tipo correto para um grande número de ((extensões de arquivo)).

{{index "npm program"}}

O seguinte comando `npm`, no diretório onde o script do servidor está, instala uma versão específica de `mime`:

```{lang: null}
$ npm install mime-types@2.1.0
```

{{index "404 (HTTP status code)", "stat function", [file, resource]}}

Quando um arquivo solicitado não existe, o código de status HTTP correto a retornar é 404. Usaremos a função `stat`, que procura informações sobre um arquivo, para descobrir tanto se o arquivo existe quanto se é um ((diretório)).

```{includeCode: ">code/file_server.mjs"}
import {createReadStream} from "node:fs";
import {stat, readdir} from "node:fs/promises";
import {lookup} from "mime-types";

methods.GET = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return {status: 404, body: "File not found"};
  }
  if (stats.isDirectory()) {
    return {body: (await readdir(path)).join("\n")};
  } else {
    return {body: createReadStream(path),
            type: lookup(path)};
  }
};
```

{{index "createReadStream function", ["asynchronous programming", "in Node.js"], "error handling", "ENOENT (status code)", "Error type", inheritance}}

Porque tem que acessar o disco e, portanto, pode demorar um pouco, `stat` é assíncrono. Como estamos usando promises em vez do estilo de callback, tem que ser importado de `node:fs/promises` em vez de diretamente de `node:fs`.

Quando o arquivo não existe, `stat` lançará um objeto de erro com uma propriedade `code` de `"ENOENT"`. Esses códigos um tanto obscuros, inspirados no ((Unix)), são como você reconhece tipos de erro no Node.

{{index "Stats type", "stat function", "isDirectory method"}}

O objeto `stats` retornado por `stat` nos diz várias coisas sobre um ((arquivo)), como seu tamanho (propriedade `size`) e sua ((data de modificação)) (propriedade `mtime`). Aqui estamos interessados na questão de se ele é um ((diretório)) ou um arquivo regular, que o método `isDirectory` nos diz.

{{index "readdir function"}}

Usamos `readdir` para ler o array de arquivos em um ((diretório)) e retorná-lo ao cliente. Para arquivos normais, criamos um stream de leitura com `createReadStream` e retornamos isso como o corpo, junto com o tipo de conteúdo que o pacote `mime` nos dá para o nome do arquivo.

{{index "Node.js", "file server example", "DELETE method", "rmdir function", "unlink function"}}

O código para tratar requisições `DELETE` é ligeiramente mais simples.

```{includeCode: ">code/file_server.mjs"}
import {rmdir, unlink} from "node:fs/promises";

methods.DELETE = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return {status: 204};
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return {status: 204};
};
```

{{index "204 (HTTP status code)", "body (HTTP)"}}

Quando uma ((resposta)) ((HTTP)) não contém nenhum dado, o código de status 204 ("sem conteúdo") pode ser usado para indicar isso. Como a resposta à exclusão não precisa transmitir nenhuma informação além de se a operação foi bem-sucedida, isso é uma coisa sensata a retornar aqui.

{{index idempotence, "error response"}}

Você pode estar se perguntando por que tentar deletar um arquivo inexistente retorna um código de sucesso em vez de um erro. Quando o arquivo sendo deletado não está lá, você poderia dizer que o objetivo da requisição já foi cumprido. O padrão ((HTTP)) nos encoraja a tornar requisições _idempotentes_, o que significa que fazer a mesma requisição múltiplas vezes produz o mesmo resultado que fazê-la uma vez. De certa forma, se você tenta deletar algo que já se foi, o efeito que estava tentando criar foi alcançado — a coisa não está mais lá.

{{index "file server example", "Node.js", "PUT method"}}

Este é o manipulador para requisições `PUT`:

```{includeCode: ">code/file_server.mjs"}
import {createWriteStream} from "node:fs";

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}

methods.PUT = async function(request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return {status: 204};
};
```

{{index overwriting, "204 (HTTP status code)", "error event", "finish event", "createWriteStream function", "pipe method", stream}}

Não precisamos verificar se o arquivo existe desta vez — se existir, simplesmente sobrescreveremos. Novamente usamos `pipe` para mover dados de um stream de leitura para um gravável, neste caso da requisição para o arquivo. Mas como `pipe` não é escrito para retornar uma promise, temos que escrever um wrapper, `pipeStream`, que cria uma promise em torno do resultado de chamar `pipe`.

{{index "error event", "finish event"}}

Quando algo dá errado ao abrir o arquivo, `createWriteStream` ainda retornará um stream, mas esse stream disparará um evento `"error"`. O stream da requisição também pode falhar — por exemplo, se a rede cair. Então conectamos os eventos `"error"` de ambos os streams para rejeitar a promise. Quando `pipe` termina, ele fechará o stream de saída, o que faz disparar um evento `"finish"`. É nesse ponto que podemos resolver a promise com sucesso (retornando nada).

{{index download, "file server example", "Node.js"}}

O script completo para o servidor está disponível em [_https://eloquentjavascript.net/code/file_server.mjs_](https://eloquentjavascript.net/code/file_server.mjs). Você pode baixá-lo e, depois de instalar suas dependências, executá-lo com Node para iniciar seu próprio servidor de arquivos. E, é claro, você pode modificá-lo e estendê-lo para resolver os exercícios deste capítulo ou para experimentar.

{{index "body (HTTP)", "curl program", [HTTP, client], [method, HTTP]}}

A ferramenta de linha de comando `curl`, amplamente disponível em sistemas do tipo ((Unix)) (como macOS e Linux), pode ser usada para fazer ((requisições)) HTTP. A sessão a seguir testa brevemente nosso servidor. A opção `-X` é usada para definir o método da requisição, e `-d` é usada para incluir um corpo de requisição.

```{lang: null}
$ curl http://localhost:8000/file.txt
File not found
$ curl -X PUT -d CONTENT http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
CONTENT
$ curl -X DELETE http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
File not found
```

A primeira requisição para `file.txt` falha pois o arquivo ainda não existe. A requisição `PUT` cria o arquivo, e eis que a próxima requisição o recupera com sucesso. Depois de deletá-lo com uma requisição `DELETE`, o arquivo está novamente ausente.

## Resumo

{{index "Node.js"}}

Node é um sistema agradável e pequeno que nos permite executar JavaScript em um contexto fora do navegador. Foi originalmente projetado para tarefas de rede para desempenhar o papel de um nó em uma rede, mas se presta a todos os tipos de tarefas de scripting. Se escrever JavaScript é algo que você gosta, automatizar tarefas com Node pode funcionar bem para você.

NPM fornece pacotes para tudo que você possa imaginar (e algumas coisas que provavelmente nunca imaginaria), e permite que você busque e instale esses pacotes com o programa `npm`. Node vem com vários módulos embutidos, incluindo o módulo `node:fs` para trabalhar com o sistema de arquivos e o módulo `node:http` para executar servidores HTTP.

Toda entrada e saída no Node é feita de forma assíncrona, a menos que você use explicitamente uma variante síncrona de uma função, como `readFileSync`. Node originalmente usava callbacks para funcionalidades assíncronas, mas o pacote `node:fs/promises` fornece uma interface baseada em promises para o sistema de arquivos.

## Exercícios

### Ferramenta de busca

{{index grep, "search problem", "search tool (exercise)"}}

Em sistemas ((Unix)), existe uma ferramenta de linha de comando chamada `grep` que pode ser usada para buscar rapidamente em arquivos por uma ((expressão regular)).

Escreva um script Node que possa ser executado a partir da ((linha de comando)) e age de forma semelhante ao `grep`. Ele trata seu primeiro argumento de linha de comando como uma expressão regular e trata quaisquer argumentos adicionais como arquivos para buscar. Ele deve exibir os nomes de qualquer arquivo cujo conteúdo corresponda à expressão regular.

Quando isso funcionar, estenda-o para que, quando um dos argumentos for um ((diretório)), ele busque em todos os arquivos naquele diretório e seus subdiretórios.

{{index ["asynchronous programming", "in Node.js"], "synchronous programming"}}

Use funções de sistema de arquivos assíncronas ou síncronas como achar melhor. Configurar as coisas para que múltiplas ações assíncronas sejam solicitadas ao mesmo tempo pode acelerar um pouco as coisas, mas não muito, já que a maioria dos sistemas de arquivos só pode ler uma coisa de cada vez.

{{hint

{{index "RegExp class", "search tool (exercise)"}}

Seu primeiro argumento de linha de comando, a ((expressão regular)), pode ser encontrado em `process.argv[2]`. Os arquivos de entrada vêm depois disso. Você pode usar o construtor `RegExp` para ir de uma string para um objeto de expressão regular.

{{index "readFileSync function"}}

Fazer isso sincronamente, com `readFileSync`, é mais direto, mas se você usar `node:fs/promises` para obter funções que retornam promises e escrever uma função `async`, o código fica semelhante.

{{index "stat function", "statSync function", "isDirectory method"}}

Para descobrir se algo é um diretório, você pode novamente usar `stat` (ou `statSync`) e o método `isDirectory` do objeto stats.

{{index "readdir function", "readdirSync function"}}

Explorar um diretório é um processo ramificado. Você pode fazê-lo usando uma função recursiva ou mantendo um array de trabalho (arquivos que ainda precisam ser explorados). Para encontrar os arquivos em um diretório, você pode chamar `readdir` ou `readdirSync`. Note a capitalização estranha — as funções de sistema de arquivos do Node são vagamente baseadas em funções padrão do Unix, como `readdir`, que são todas minúsculas, mas então adiciona `Sync` com uma letra maiúscula.

Para ir de um nome de arquivo lido com `readdir` para um nome de caminho completo, você tem que combiná-lo com o nome do diretório, seja colocando `sep` de `node:path` entre eles ou usando a função `join` do mesmo pacote.

hint}}

### Criação de diretório

{{index "file server example", "directory creation (exercise)", "rmdir function"}}

Embora o método `DELETE` em nosso servidor de arquivos seja capaz de deletar diretórios (usando `rmdir`), o servidor atualmente não fornece nenhuma forma de _criar_ um ((diretório)).

{{index "MKCOL method", "mkdir function"}}

Adicione suporte para o método `MKCOL` ("make collection"), que deve criar um diretório chamando `mkdir` do módulo `node:fs`. `MKCOL` não é um método HTTP amplamente usado, mas existe para este mesmo propósito no padrão _((WebDAV))_, que especifica um conjunto de convenções sobre HTTP que o tornam adequado para criar documentos.

```{hidden: true, includeCode: ">code/file_server.mjs"}
import {mkdir} from "node:fs/promises";

methods.MKCOL = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    await mkdir(path);
    return {status: 204};
  }
  if (stats.isDirectory()) return {status: 204};
  else return {status: 400, body: "Not a directory"};
};
```

{{hint

{{index "directory creation (exercise)", "file server example", "MKCOL method", "mkdir function", idempotency, "400 (HTTP status code)"}}

Você pode usar a função que implementa o método `DELETE` como modelo para o método `MKCOL`. Quando nenhum arquivo é encontrado, tente criar um diretório com `mkdir`. Quando um diretório existe naquele caminho, você pode retornar uma resposta 204 para que requisições de criação de diretório sejam idempotentes. Se um arquivo não-diretório existe aqui, retorne um código de erro. O código 400 ("bad request") seria apropriado.

hint}}

### Um espaço público na web

{{index "public space (exercise)", "file server example", "Content-Type header", website}}

Como o servidor de arquivos serve qualquer tipo de arquivo e inclui o cabeçalho `Content-Type` correto, você pode usá-lo para servir um website. Dado que este servidor permite que qualquer pessoa delete e substitua arquivos, isso resultaria em um tipo interessante de website: um que pode ser modificado, melhorado e vandalizado por qualquer pessoa que dedique tempo para fazer a requisição HTTP correta.

Escreva uma página ((HTML)) básica que inclua um arquivo JavaScript simples. Coloque os arquivos em um diretório servido pelo servidor de arquivos e abra-os no seu navegador.

Em seguida, como exercício avançado ou até um ((projeto de fim de semana)), combine todo o conhecimento que adquiriu deste livro para construir uma interface mais amigável para modificar o website — de _dentro_ do website.

Use um ((formulário)) HTML para editar o conteúdo dos arquivos que compõem o website, permitindo ao usuário atualizá-los no servidor usando requisições HTTP, como descrito no [Capítulo ?](http).

Comece tornando apenas um único arquivo editável. Depois faça com que o usuário possa selecionar qual arquivo editar. Use o fato de que nosso servidor de arquivos retorna listas de arquivos ao ler um diretório.

{{index overwriting}}

Não trabalhe diretamente no código exposto pelo servidor de arquivos, pois se você cometer um erro, é provável que danifique os arquivos lá. Em vez disso, mantenha seu trabalho fora do diretório acessível publicamente e copie-o para lá ao testar.

{{hint

{{index "file server example", "textarea (HTML tag)", "fetch function", "relative path", "public space (exercise)"}}

Você pode criar um elemento `<textarea>` para conter o conteúdo do arquivo que está sendo editado. Uma requisição `GET`, usando `fetch`, pode recuperar o conteúdo atual do arquivo. Você pode usar URLs relativos como _index.html_, em vez de [_http://localhost:8000/index.html_](http://localhost:8000/index.html), para se referir a arquivos no mesmo servidor que o script em execução.

{{index "form (HTML tag)", "submit event", "PUT method"}}

Então, quando o usuário clicar em um botão (você pode usar um elemento `<form>` e evento `"submit"`), faça uma requisição `PUT` para a mesma URL, com o conteúdo do `<textarea>` como corpo da requisição, para salvar o arquivo.

{{index "select (HTML tag)", "option (HTML tag)", "change event"}}

Você pode então adicionar um elemento `<select>` que contenha todos os arquivos no diretório raiz do servidor adicionando elementos `<option>` contendo as linhas retornadas por uma requisição `GET` para a URL `/`. Quando o usuário selecionar outro arquivo (um evento `"change"` no campo), o script deve buscar e exibir aquele arquivo. Ao salvar um arquivo, use o nome de arquivo atualmente selecionado.

hint}}
