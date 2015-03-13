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
profunda sobre Node e seus módulos embutidos.

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


