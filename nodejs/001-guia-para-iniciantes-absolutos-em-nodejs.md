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

// Lendo o conteúdo do arquivo para a memória
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



```