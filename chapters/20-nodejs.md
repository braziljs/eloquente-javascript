# Node.js

> "Um estudante perguntou ‘Os programadores de antigamente usavam somente
máquinas simples e nenhuma linguagem de programação, mas mesmo assim eles
construiram lindos programas. Por que nós usamos máquinas complicadas e
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

Um dos problemas mais difícies em escrever sistemas que se comunicam através de
uma rede é administrar a entrada e saída — ou seja, ler escrever dados na rede,
num disco rígido, e outros dispositivos. Mover os dados desta forma consome
tempo, e planejar isso de forma inteligente pode fazer uma enorme diferença
na velocidade em que um sistema responde ao usuário ou às requisições da rede.

A maneira tradicional de tratar a entrada e saída é ter uma função, como
```readfile```, que começa a ler um arquivo e só retorna quando o arquivo foi
totalmente lido. Isso é chamado *I/O* síncrono (I/O quer dizer input/output ou
entrada/saída).

Node foi inicialmente concebido para o propósito de tornar a assincroneidade I/O
mais fácil e conveniente. Nós já vimos interfaces síncronas antes, como o objeto
```XMLHttpRequest``` do navegador, discutodo no Capítulo 17. Uma interface
asíncrona permite que o script continue executando enquanto ela faz seu trabalho
e chama uma função de *callback* quando está finalizada. Isso é como Node faz
todo seu I/O.

JavaScript é ideal para um sistema como Node. É uma das poucas linguagens de
programação que não tem uma maneira embutida de fazer I/O. Dessa forma,
JavaScript poderia encaixar-se bastante na abordagem excêntrica do Node para
o I/O sem acabar ficando com duas interfaces inconsistentes. Em 2009, quando
Node foi desenhado, as pessoas já estavam fazendo I/O baseado em funções de
*callback* no navegador, então a comunidade em volta da linguagem estava acostumada
com um estilo de programação assíncrono.

## Assincronia

Eu vou tentar ilustrar I/O síncrono contra I/O assíncrono com um pequeno
exemplo, onde um programa precisa buscar rescursos da Internet e então fazer
algum processamento simples com o resultado dessa busca.

Em um ambiente síncrono, a maneira óbvia de realizar essa tarefa é fazer uma
requisição após outra. Esse método tem a desvatangem de que a segunda requisição
só será realizada após a primeira ter finalizado. O tempo total de execução será
no mínimo a soma da duração das duas requisições. Isso não é um uso eficaz da
máquina, que vai estar inativa por boa parte do tempo enquanto os dados são
transmitidos através rede.

A solução para esse problema, num sistema síncrono, é iniciar *threads* de
controle. (Dê uma olhada no Capítulo 14 para uma discussão sobre *threads*.) Uma
sebgunda *thread* poderia iniciar a segunda requisição, e então ambas as
*threads* vão esperar os resultados voltarem, e após a resincronização elas vão
combinar seus resultados.

No seguinte diagrama, as linhas grossa representam o tempo que o programa gastou
em seu processo normal, e as linhas finas representam o tempo gasto esperando
pelo I/O. Em um modelo síncrono, o tempo gasto pelo I/O faz parte da linha do
tempo de uma determinada *thread* de controle. Em um modelo assíncrono, iniciar
uma ação de I/O causa uma divisão na linha do tempo, conceitualmente falando. A
*thread* que iniciou o I/O continua rodando, e o I/O é finalizado juntamente à
ela, chamando uma função de *callback* quando é finalizada.

![Control flow for synchronous and asynchronous I/O](http://eloquentjavascript.net/img/control-io.svg)

Uma outra maneira de mostrar essa diferença é que essa espera para que o I/O
finalize é implícita no modelo síncrono, enquanto que é explícita no assíncrono.
Mas assincronia é uma faca de dois gumes. Ela faz com que expressivos programas
que seguem uma linha reta se tornem mais estranhos.

No capítulo 17, eu já mensionei o fato de que todos esses *callbacks* adicionam
um pouco de ruído e rodeios para um programa. Se esse estilo de assincronia é
uma boa ideia ou não, em geral isso pode ser discutido. De qualquer modo, levará
algum tempo para se acostumar.

Mas para um sistema baseado em JavaScript, eu poderia afirmar que esse estilo de
assincronia com callback é uma escolha sensata. Uma das forças do JavaScript é
sua simplicidade, e tentar adicionar múltiplas *threads* de controle poderia
causar uma grande complexidade. Embora os *callbacks* não tendem a ser códigos
simples, como conceito, eles são agradavelmente simples e ainda assim poderosos
o suficiente para escrever servidores web de alta perfomance.

## O Comando Node

Quando Node.js está instalado em um sistema, ele disponibiliza um programa
chamado ```node```, que é usado para executar arquivos JavaScript. Digamos que
você tenha um arquivo chamado ```ola.js```, contendo o seguinte código:
```javascript
var mensagem = "Olá mundo";
console.log(mensagem);
```

Você pode então rodar ```node``` a partir da linha de comando para executar o
programa:

```
$ node ola.js
Olá mundo
```

O método ```console.log``` no Node tem um funcionamento bem parecido ao do
navegador. Ele imprime um pedaço de texto. Mas no Node, o texto será impresso
pelo processo padrão de saída, e não no console JavaScript do navegador.

Se você rodar ```node``` sem especificar nenhum arquivo, ele te fornecerá um
*prompt* no qual você poderá escrever códigos JavaScript e ver o resultado
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

A variável ```process```, assim como a variável ```console```, está disponível
globalmente no Node. Ela fornece várias maneiras de inspecionar e manipular o
programa atual. O método ```exit``` finaliza o processo e pode receber um código
de sáida, que diz ao programa que iniciou ```node``` (nesse caso, a linha de
comando) se o programa foi completado com sucesso (código zero) ou se encontrou
algum erro (qualquer outro código).

Para encontrar os argumentos de linha de comando recebidos pelo seu script, você
pode ler ```process.argv```, que é um *array* de *strings*. Note que também
estarão inclusos o nome dos comandos ```node``` e o nome do seu script, fazendo
com que os argumentos começem na posição 2. Se ```showargv.js``` contém somente
o *statement* ```console.log(process.argv)```, você pode rodá-lo dessa forma:

```
$ node showargv.js one --and two
["node", "/home/braziljs/showargv.js", "one", "--and", "two"]
```

Todas as variáveis JavaScript globais, como ```Array```, ```Math``` and
```JSON```, estão presentes também no ambiente do Node. Funcionalidades
relacionadas ao navegador, como ```document``` e ```alert``` estão ausentes.

O objeto global do escopo, que é chamado ```window``` no navegador, passa a ser
```global``` no Node, que faz muito mais sentido.

## Módulos
Além de algumas variáveis que mencionei, como ```console```e ```process```, Node
também colocou pequenas funcionalidades no escopo global. Se você quiser acessar
outras funcionalidades embutidas, você precisa pedir esse módulo ao sistema.

O sistema de módulo CommonJS, baseado na função ```require```, estão descritos
no Capítulo 10. Esse sistema é construído em Node e é usado para carregar desde
módulos integrados até bibliotecas transferidas, ou até mesmo, arquivos que
fazem parte do seu próprio programa.

Quando ```require``` é chamado, Node tem que transformar a string recebida em
um arquivo real a ser carregado. Nomes de caminhos que começam com "/", "./", ou
"../" são resolvidos relativamente ao atual caminho do módulo, aonde "./"
significa o diretório corrente, "../" para um diretório acima, e "/" para a raiz
do sistema de arquivos. Então se você solicitar por ```"./world/world"``` do
arquivo ```/home/braziljs/elife/run.js```, Node vai tentar carregar o arquivo
```/home/braziljs/elife/world/world.js```. A extensão ```.js``` pode ser
omitida.

Quando uma *string* recebida pelo ```require``` não parece ter um caminho
relativo ou absoluto, fica implícito que ela se refere a um módulo integrado ou
que está instalado no diretório ```node_modules```do. Por exemplo,
```require(fs)``` disponibilizará o módulo de sistema de arquivos integrado ao
Node, ```require("elife")``` vai tentar carregar a biblioteca encontrada em
```node_modules/elife```. A maneira mais comum de instalar bibliotecas como
essas é usando NPM, que em breve nós vamos discutir.

Para ilustrar o uso do ```require```, vamos configurar um projeto simples que
consiste de dois arquivos. O primeiro é chamado ```main.js```, que define um
script que pode ser chamado da linha de comando para alterar uma *string*.

```javascript
var garble = require("./garble");

// O índice 2 possui o valor do primeiro parâmetro da linha de comando
var parametro = process.argv[2];

console.log(garble(parametro));
```

O arquivo ```garble.js``` define uma biblioteca para alterar string, que pode
ser usada tanto da linha de comando quanto por outrs scripts que precisam ter
acesso direto a função de alterar.

```javascript
module.exports = function(string) {
  return string.split("").map(function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) + 5);
  }).join("");
}
```

Lembre-se que substituir ```module.exports```, ao invés de adicionar propiedades
à ele, nos permite exportar um valor específico do módulo. Nesse caso, nós
fizemos com que o resultado ao requerir nosso arquivo ```garble``` seja a
própria função de alterar.

A função separa a *string* recebida em dois caracteres únicos separando a
*string* vazia e então substituindo cada caracter cujo código é cinco pontos
maior. Finalmente, o resultado é reagrupado novamente numa *string*.

Agora nós podemos chamar nossa ferramenta dessa forma:
```
$ node main.js JavaScript
Of{fXhwnuy
```

## Instalando com NPM

NPM, que brevemente discutido no Capítulo 10, é um repositório online de módulos
JavaScript, muitos deles escritos para Node. Quando você instala o Node no seu
computador, você também instala um programa chamado ```npm```, que fornece uma
interface conveniente para esse repositório.

Por exemplo, um módulo que você vai encontrar na NPM é ```figlet```, que pode
converter texto em *ASCII art*—desenhos feitos de caracteres de texto. O trecho
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

Depois de rodar ```npm install```, NPM já vai ter criado um diretório chamado
```node_modules```. Dentro desse diretório haverá um outro diretório chamado
```figlet```, que vai conter qa biblioteca. Quando rodamos ```node``` e
chamamos ```require("figlet")```, essa biblioteca é carregada, e nós podemos
chamar seu método ```text``` para desenhar algumas letras grandes.

Talvez de forma inesperada, ao invés de retornar a string que faz crescer as
letras, ```figlet.text``` têm uma função de *callback* que passa o resultado
para ela. Ele também passa outro parâmetro no *callback*, ```error```, que vai
possuir um objeto de erro quando alguma coisa sair errada ou nulo se tudo
ocorrer bem.

Isso é um padrão comum em Node. Renderizar alguma coisa com ```figlet``` requer
a biblioteca para ler o arquivo que contém as formas das letras. Lendo esse
arquivo do disco é uma operação assíncrona no Node, então ```figlet.text```não
pode retornar o resultado imediatamente. Assincronia é, de certa forma,
infecciosa—qualquer função que chamar uma função assincronamente precisa se
tornar assíncrona também.

Existem muito mais coisas no NPM além de ```npm install```. Ele pode ler
arquivos ```package,json```, que contém informações codificadas em JSON sobre
o programa ou biblioteca, como por exemplo outras bibliotecas que depende.
Rodar ```npm install``` em um diretório que contém um arquivo como esse vai
instalar automaticamente todas as dependencias, assim como as dependencias das
dependencias. A ferramenta ```npm``` também é usada para publicar bibliotecas
para o repositório NPM online de pacotes para que as pessoas possam encontrar,
transferir e usá-los.

Esse livro não vai abordar detalhes da utilização do NPM. Dê uma olhada em
npmjs.org para uma documentação mais detalhada e para uma maneira simples de
procurar por bibliotecas.
