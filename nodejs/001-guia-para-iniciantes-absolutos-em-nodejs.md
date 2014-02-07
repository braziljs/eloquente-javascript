# Guia Para Iniciantes Absolutos em Node.js

#### Artigo traduzido de *blog.modulus.io*. Confira o texto original [aqui](http://blog.modulus.io/absolute-beginners-guide-to-nodejs).

Não existe uma escassez de tutoriais para Node.js, mas a maioria deles cobrem usos e casos específicos, ou tópicos que somente aplicáveis se você já tiver um conhecimento prático do Node. Eu vejo vários comentários que se parecem com coisas do tipo: "Eu fiz o download do node, agora o que fazer?" Este tutorial responde esta questão e explica como iniciar bem do princípio.

## O que é Node.js?

Muitos iniciantes em Node tem a dúvida de o quê exatamente ele é, e a descrição em [nodejs.org](http://nodejs.org/) definitivamente não ajuda.

Uma coisa importante de se perceber é que o Node não é um servidor web. Por ele próprio, não se tem nada. Ele não funciona como o Apache. Não existe um arquivo de configuração onde você o aponta para seus arquivos html. Se você quer que o Node seja um servidor HTTP, você tem que escrever um servidor HTTP (com a ajuda das bibliotecas incluídas). O Node.js é somente outra forma de executar código em seu computador. Ele é simplesmente um *JavaScript runtime* (ambiente de execução de código JavaScript).

## Instalando o Node.js

Node.js é muito simples de ser instalado. Se você estiver usando Windows ou Mac, os instaladores estão disponíveis na [página de download](http://nodejs.org/download).

## Já tenho o Node instalado, e agora o que fazer?

Uma vez instalado, agora você tem acesso a um novo comando chamado `node`. Você pode usar o comando `node` de duas formas diferentes. A primeira é sem argumentos. Isto irá abrir um shell interativo (REPL: read-eval-print-loop), onde você pode executar código JavaScript puro.

```sh

$ node
> console.log('Hello World');
Hello World
undefined

```

No exemplo acima eu digitei `console.log('Hello World')` dentro do shell e apertei enter. O Node vai então executar o código e nós podemos ver nossa mensagem registrada. Ele também imprimi `undefined` pelo fato de sempre mostrar o valor de retorno de cada comando, e `console.log` não retorna nada.

A outra forma de rodar o Node é fornecendo a ele um arquivo JavaScript para execução. Isto será na maioria das vezes a maneira como você irá utilizá-lo.

`hello.js`
```js

console.log('Hello World');

```

```sh

$ node hello.js
Hello World

```

Neste exemplo, eu movi o comando `console.log()` para dentro de um arquivo e então passei este arquivo para o comando node como um argumento. O Node então roda o JavaScript contido neste arquivo e imprimi "Hello World".

## Fazendo Algo Útil

Rodar código JavaScript é divertido e tal, mas não é muito útil. Ai é onde o Node.js também inclui um poderoso conjunto de [bibliotecas](http://nodejs.org/api/) (módulos) para se fazer coisas reais. No primeiro exemplo eu vou abrir um arquivo de registros e analisá-lo.

`example-log.txt`
```

2013-08-09T13:50:33.166Z A 2
2013-08-09T13:51:33.166Z B 1
2013-08-09T13:52:33.166Z C 6
2013-08-09T13:53:33.166Z B 8
2013-08-09T13:54:33.166Z B 5

```

O que esses dados registrados significam não importa, mas basicamente cada mensagem contém uma data, uma letra e um valor. Eu quero somar os valores para cada letra.

A primeira coisa que nós precisamos fazer é ler o conteúdo do arquivo.

`my-parser.js`
```js

// Carregando o módulo fs (filesystem)
var fs = require('fs');

// Leia o conteúdo do arquivo para a memória
fs.readFile('example-log.txt', function ( err, loData ) {
	
	// Se um erro ocorrer, será lançada uma
	// exceção, e a aplicação irá ser encerrada
	if ( err ) throw err;

	// logData é um Buffer, converta-o para string
	var text = loData.toString();
});

```

Felizmente o Node.js faz a entrada e saída (I/O) do arquivo facilmente com o módulo embutido [filesystem](http://nodejs.org/api/fs.html) (`fs`). O módulo `fs` tem uma função chamada [readFIle](http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback) que pega o caminho de um arquivo e um callback. O callback vai ser invocado quando o arquivo for lido por completo. O dado do arquivo vem na forma de um [Buffer](http://nodejs.org/api/buffer.html), que é basicamente um array de bytes. Nós podemos convertê-lo para uma string usando a função [`toString()`](http://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end).

Agora vamos adicionar o *parsing* (analisador).

`my-parser.js`
```js

// Carregando o módulo fs (filesystem)
var fs = require('fs');

// Leia o conteúdo do arquivo para a memória
fs.readFile('example-log.txt', function ( err, logData ) {
	
	// Se um erro ocorrer, será lançada uma
	// exceção, e a aplicação irá ser encerrada
	if ( err ) throw err;

	// logData é um Buffer, converta para string
	var text = logData.toString();

	var results = {};

	// Quebrando o arquivo em linhas
	var lines = text.split( '\n' );

	lines.forEach(function ( line ) {
		var parts = line.split( ' ' );
		var letter = parts[ 1 ];
		var count = parseInt( parts[ 2 ] );

		if ( !results[ letter ] ) {
			results[ letter ] = 0;
		}

		results[ letter ] += parseInt( count );
	});

	console.log( results );
	// { A: 2, B: 14, C: 6 }
});

```

Agora vamos passar este arquivo como um argumento para o comando `node` e ele vai imprimir o resultado e sair.

```sh

$ node my-parser.js
{ A: 2, B: 14, C: 6 }

```

Eu uso muito o Node.js para scripts como este. É uma alternativa muito mais simples e poderosa que os scripts bash.

## Callbacks Assíncronos

Como você viu no exemplo anterior, o padrão típico do Node.js é o uso de callbacks assíncronos. Basicamente você está dizendo a ele para fazer algo e quando isso estiver terminado ele irá chamar sua função (callback). Isto porque o Node é de *thread* única. Enquanto você está esperando pelo disparo do callback, o Node pode fazer outras coisas ao invés de bloquear até que a requisição esteja terminada.

Isso é especialmente importante para servidores web. Isto é muito comum em aplicações web modernas para acessar banco de dados. Enquanto você espera pelo retorno do banco de dados, o Node pode processar mais requisições. Isso permite que você manipule milhares de conexões conjuntas com pequenos acréscimos, comparado a criar uma thread separada para cada conexão.

## Fazendo Algo Útil - Servidor HTTP

Como disse anteriormente, o Node não faz nada por si só. Um dos módulos embutidos tornam a criação de [servidores HTTP](http://nodejs.org/api/http.html#http_http_createserver_requestlistener) simples muito fácil, que é o [exemplo na página inicial do Node.js](http://nodejs.org/).

`my-web-server.js`
```js

var http = require('http');

http.createServer(function ( req, res ) { // req = requisição, res = resposta
	
	res.writeHead( 200, { 'Content-Type': 'text/plain' } );
	res.end( 'Hello World\n' );
}).listen( 8080 );

console.log( 'Servidor rodando na porta 8080' );

```

Quando eu digo básico, quero dizer básico mesmo. Este não é um servidor HTTP completo. Ele não pode servir qualquer arquivo HTML ou de imagem. De fato, não importa sua requisição, ela vai retornar 'Hello World'. No entanto, você pode rodar isto e verá em seu navegador no endereço `http://localhost:8080` o texto "Hello World".

```sh

$ node my-web-server.js

```

Você pode ter percebido uma coisa diferente agora. Sua aplicação node.js não fechou. Isto acontece pois você criou um servidor e sua aplicação node vai continuar rodando e respondendo as requisições até que você mesmo mate o processo.

Se você quiser ter um servidor web completo, você terá que fazer este trabalho. Você deve checar o que foi requisitado, ler os arquivos apropriados e enviar o conteúdo de volta. Pessoas já fizeram estr trabalho duro para você.

## Fazendo Algo Útil - Express

[Express](http://expressjs.com/) é um framework que torna a criação de sites normais muito simples. A primeira coisa que você tem que fazer é instalá-lo. Juntamente com o comando `node`, você também tem acesso a um comando chamado `npm`. Esta ferramenta permite que você acesse uma enorme coleção de módulos criados pela comunidade, e um deles é o Express.

```sh

$ cd /my/app/location
$ npm install express

```

Quando você instala um módulo, ele vai ser colado em uma pasta chamada *node_modules* dentro do diretório da sua aplicação. Você pode agora "require" (requisitar) este módulo como um módulo embutido. Vamos criar um arquivo estático básico usando o Express.

`my-static-file-server.js`
```js

var express = require('express');
	app = express();

app.use(express.static(__dirname + '/public'));

app.listen(8080);

```
```sh

$ node my-static-file-server.js

```

Agora você tem um servidor de arquivos estáticos bastante eficiente. Tudo que você colocar dentro da pasta `/public` vai ser requisitado pode agora ser requisitado pelo seu navegador e será mostrado. HTML, imagens, enfim, tudo. Por exemplo, se você colocar uma imagem chamada `my-image.png` dentro da pasta `public`, você pode acessá-la usando seu navegador no endereço `http://localhost:8080/my-image.png`. Claro que o Express tem muito muito outros recursos, mas você pode olhá-los a medida que continua desenvolvendo.

## NPM

Nós usamos um pouco o [NPM](https://npmjs.org/) nas seções anteriores, mas eu quero enfatizar o quão importante esta ferramenta se faz no desenvolvimento para Node.js. Existem milhares de módulos disponíveis que resolvem quase todos os problemas típicos que você encontra. Lembre-se de checar o NPM antes de re-inventar a roda. Não é inédito para uma aplicação Node ter dezenas de dependências.

No exemplo anterior nós instalamos o Express manualmente. Se você tiver muitas dependências, essa não será uma forma muito interessante de instalá-las. É por isso que o NPM faz uso do arquivo `package.json`.

`package.json`.
```js

{
	"name" : "MyStaticServer",
	"version" : "0.0.1",
	"dependencies" : {
		"express" : "3.3.x"
	}
}

```

Um arquivo [`package.json`](https://npmjs.org/doc/files/package.json.html) contém um resumo da sua aplicação. Existem vários campos disponíveis, sendo este apenas o mínimo. A seção *dependencies* (dependências) descreve o nome e a versão dos módulos que você gostaria de instalar. Neste caso eu vou aceitar qualquer versão do Express 3.3. Você pode listar quantas dependências quiser nesta seção. 

Agora, ao invés de instalar cada dependência em separado, nós podemos rodar um simples comando e instalar todas elas.

```sh

$ npm install

```

Quando você roda este comando, o npm vai verificar na pasta atual pelo arquivo `package.json`. Se ele encontrar um, então irá instalar cada dependência listada.

## Organização do Código

