# JavaScript e o Navegador

> "O navegador é um ambiente realmente hostil de programação."
>
> - Douglas Crockford, The JavaScript Programming Language (video lecture)

A próxima parte deste livro vai falar sobre os navegadores web. Sem os navegadores, não existiria JavaScript. E mesmo se existisse, ninguém daria atenção a ele.

A tecnologia web, desde de o início, é descentralizada não apenas tecnicamente mas também na maneira que se evolui. Vários fornecedores de navegador tem adicionado funcionalidades *ad-hoc* e muita das vezes tem sido de maneiras mal pensadas, que acabam sendo adotadas por outros e finalmente viram um padrão.  

Isso é igualmente a uma benção e uma maldição. Por outro lado, isso reforça a não existência de uma particição central controlando um sistema mas o mesmo vem sendo melhorado por várias partes trabalhando com pouca colaboração (ou, ocasionalmente com franca hostilidade). Sendo assim a forma casual que a Web foi desenvolvida significa que o sistema resultante não é exatamente um brilhante exemplo interno de consistência. De fato, algumas partes são completamente bagunçadas e confusas.

## Redes e a Internet

Redes de computador existem desde 1950. Se você colocar cabos entre dois ou mais computadores e permitir que eles enviem dados um para o outro por estes cabos, você pode fazer todo tipo de coisas maravilhosas.

Se conectando duas máquinas no mesmo prédio permite que nós façamos coisas incríveis, conectando máquinas por todo o planeta deve ser ainda melhor. A tecnologia para começar a implementação desta visão foi desenvolvida em meados de 1980, e a rede resultante é chamada de *Internet*. Ela tem vivido desde a sua promessa.

Um computador pode usar essa rede para enviar bits para outro computador. Para qualquer comunicação efetiva nascida desse envio de bits, os computadores em ambas as pontas devem conhecer qual a representação de cada bit. O significado de cada sequência de bits depende inteiramente do tipo de coisa que está tentando se expressar e o mecanismo de codificação usado.

Um *protocolo de rede* descreve um estilo de comunicação em uma rede. Existem protocolos para mandar email, para receber email, para transferir arquivos, e até mesmo para controlar computadores que foram infectados por softwares maliciosos.

Por exemplo, um simples protocolo de chat deve consistir em um computador enviando os bits que representam o texto "CHAT?" para outra máquina, e o outro respondendo "OK!" para confirmar que o protocolo foi entendido. Eles podem então proceder e enviar um para o outro `strings` de texto, ler o texto enviado um para o outro pela rede, e mostrar o que eles receberam nas suas telas.

A maioria dos protocolos são feitos em cima de outros protocolos. Nosso exemplo de protocolo de chat considera a rede como um tipo de dispositivo de *stream*, no qual você pode enviar bits e recebê-los com destino correto e na ordem correta. Assegurar essas coisas atualmente é um problema técnico bastante difícil.

O TCP (Protocolo de Controle de Transmissão) é um protocolo que resolve este problema. Todos os aparelhos conectados na Internet "falam" ele, e a maioria da comunicação na Internet é feita através dele.

Uma conexão TCP funciona da seguinte maneira: um computador deve estar esperando, ou *ouvindo*, outros computadores que irão começar a falar com ele. Para ser capaz de escutar por diferentes tipos de comunicação ao mesmo tempo em uma única máquina, cada *ouvinte* tem um número (chamado de **porta**) associado a ele. A maioria dos protocolos especificam qual porta deve ser usada por padrão. Por exemplo, quando nós queremos mandar um email usando o protocolo SMTP, a máquina pelo qual enviaremos deve estar escutando na porta 25.

Outro computador pode então estabelecer uma conexão se conectando na máquina alvo usando o número correto da porta. Se a máquina alvo pode ser encontrada e estiver escutando esta porta, a conexão vai ser criada com sucesso. O computador ouvinte é chamado de servidor, e o computador que está se conectando é chamado de cliente.

Uma conexão atua como um encanamento de via dupla pelo qual bits podem ser transitados às máquinas nas duas extremidades contendo dados. Uma vez que os bits tenham sido transmitidos com sucesso, eles podem ser lidos novamente pela máquina do outro lado. Isso é um modelo conveniente. Você pode dizer que o TCP fornece uma abstração de uma rede.

## A Web

A *World Wide Web* (não ser confundida com a Internet como um todo) é um conjunto de protocolos e formatos que nos permite visitar páginas web em um navegador. A parte "Web" no nome se refere ao fato destas páginas serem facilmente ligadas umas nas outras, e então se ligarem em uma grande malha onde os usuários podem se mover através desta.

Para adicionar conteúdo na Web, tudo que você precisa fazer é conectar uma máquina a Internet, e deixá-la escutando na porta 80, usando o *Hypertext Transfer Protocol* (HTTP). Este protocolo permite outros computadores requisitarem documentos na rede.

Cada documento na Web é nomeado por um *Universal Resource Locator* (URL), que se parece com algo assim:

```
http://eloquentjavascript.net/12_browser.html
|     |                      |               |
protocolo      servidor        caminho (path)
```

A primeira parte nos diz que esta URL usa o protocolo HTTP (ao contrário, por exemplo, do HTTP encriptado, que deve ser `https://`). Então vem a parte que identifica de qual servidor nós estamos requisitando o documento. Por último temos a string de caminho que identifica o documento específico (ou *resource*) que estamos interessados.

Cada máquina conectada com a Internet recebe um *endereço IP* único, que se parece com `37.187.37.82`. Você pode usar isso diretamente como parte da URL. Porém listas de números mais ou menos aleatórios são difíceis de lembrar e estranho de se digitar, então ao invés disso você pode registrar um *nome de domínio* para apontar para uma máquina específica ou conjunto de máquinas. Eu registrei *eloquentjavascript.net* para apontar para o endereço IP da máquina que eu controlo e posso então usar o nome do domínio para servir páginas da web.

Se você digitar a URL anterior na barra de endereços do seu navegador, ela vai tentar retornar e mostrar o documento dessa URL. Primeiro, seu navegador tem que encontrar qual endereço *eloquentjavascript.net* se refere. Então, usando o protocolo HTTP, ele faz a conexão ao servidor neste endereço e pergunta pelo documento */12_browser.html*.

Vamos ver com mais detalhes sobre o protocolo HTTP no capítulo 17.

## HTML

HTML, que significa *Hypertext Markup Language (Linguagem de marcação de hipertexto)*, é o formato de documento usado para as páginas web. Um documento HTML contém texto, bem como *tags* que fornecem estrutura para esse texto, descrevendo coisas como links, parágrafos e cabeçalhos.

Um documento HTML simples, se parece  com este:

```html
  <!doctype html>
  <html>
    <head>
      <title>My home page</title>
    </head>
    <body>
      <h1>My home page</h1>
      <p>Hello, I am Marijn and this is my home page.</p>
      <p>I also wrote a book! Read it
        <a href="http://eloquentjavascript.net">here</a>.</p>
    </body>
  </html>
```

As *tags*, definidas entre os sinais de menor e maior que (< e >), fornecem informações sobre a estrutura do documento. O conteúdo restante é apenas texto puro.

O documento começa com `<!doctype html>`, que diz ao navegador para interpretá-lo como HTML *moderno* (HTML5), ao invés de outras versões que foram usadas no passado.

Documentos HTML possuem um `head` (cabeça) e um `body` (corpo). O `head` contém informações *sobre* o documento, o `body` contém o documento em si. Neste caso, nós primeiro declaramos que o título do documento é *"My home page"* e em seguida, declaramos o `body` contendo um cabeçalho (`<h1>`, que significa *"heading 1"* - As *tags* de `<h2>` a `<h6>` produzem cabeçalhos menores) e dois parágrafos (`<p>`). 

*Tags* aparecem em diversas formas. Um elemento, como o `<body>`, um parágrafo ou um link, começa com uma *tag* de abertura como em  `<p>` e termina com uma *tag* de fechamento como em `</p>`. Algumas *tags* de abertura, como aquela para o link (`<a>`), contém informações extra na forma de pares `nome="valor"`. Estes são chamados de *atributos*. Nesse caso, o destino do link é indicado pelo atributo `href="http://eloquentjavascript.net"`, onde `href` significa "*hypertext reference*" (referência de hipertexto).

Alguns tipos de *tags* não englobam conteúdo e assim não necessitam de uma *tag* de fechamento. Um exemplo seria `<img src="http://example.com/image.jpg">`, que irá mostrar a imagem encontrada na URL informada no atributo `src`.

Para sermos capazes de incluir os sinais de menor e maior no texto de um documento, mesmo esses possuindo um significado especial em HTML, teremos que introduzir mais uma nova forma de notação especial. Uma *tag* de abertura simples é escrita como `&lt;` ("*less than*" - menor que), e uma *tag* de fechamento é escrita como `&gt;` ("*greater than*" - maior que). Em HTML, o caractere & (o sinal de "E comercial") seguido por uma palavra e um ponto e vírgula é chamado de "entidade" (*entity*), e será substituída pelo caractere que representa.

Essa notação é parecida com a forma que as barras invertidas são utilizadas nas *strings* em JavaScript. Uma vez que esse mecanismo dá ao caractere `&` um significado especial, este tem que ser representado como `&amp;`. Dentro que um atributo, que é definido entre aspas duplas, a entidade `&quot;` pode ser usada para representar um caractere de aspas duplas.

O HTML é interpretado de uma forma notavelmente tolerante a erros. Se uma *tag* é omitida, o navegador irá inseri-la. A forma com que isto é feito foi padronizada, você pode confiar em todos os navegadores modernos para realizar tal tarefa.

O documento a seguir será tratado exatamente como o mostrado anteriormente:

```html
  <!doctype html>

  <title>My home page</title>

  <h1>My home page</h1>
  <p>Hello, I am Marijn and this is my home page.
  <p>I also wrote a book! Read it
    <a href=http://eloquentjavascript.net>here</a>.
```

As *tags* `<html>`, `<head>` e `<body>` foram retiradas. O navegador sabe que a *tag* `<title>` pertence ao `head`, e que `<h1>` pertence ao `body`. Além disso, eu não especifiquei o final dos parágrafos, o fato de começar um novo parágrafo ou fechar o documento irá implicitamente fechá-los. As aspas que envolviam o destino do link também foram retiradas.

Esse livro geralmente vai omitir as tags `<html>`, `<head>` e `<body>` dos exemplos para mantê-los curtos e  ordenados. Mas eu irei fechar as *tags* e incluir aspas nos valores de atributos.

Eu geralmente também irei omitir o *doctype*. Isso não deve ser interpretado como um incentivo a omitir declarações de *doctype*. Os navegadores frequentemente irão fazer coisas ridículas quando você esquece delas. Você deve considerá-las implicitamente presentes nos exemplos, mesmo quando elas não forem mostradas no texto.

## HTML e JavaScript

No contexto desse livro, a *tag* mais importante do HTML é `<script>`. Essa *tag* nos permite incluir trechos de JavaScript em um documento.

```html
<h1>Testing alert</h1>
<script>alert("hello!");</script>
```

Esse *script* será executado assim que a *tag* `<script>` for encontrada enquanto o navegador interpreta o HTML. A página mostrada acima irá exibir uma mensagem de alerta quando aberta. 

Incluir programas grandes diretamente no documento HTML é impraticável. A *tag* `<script>` pode receber um atributo `src` a fim de buscar um arquivo de *script* (um arquivo de texto contendo um programa em JavaScript) a partir de uma URL.

```html
<h1>Testing alert</h1>
<script src="code/hello.js"></script>
```

O arquivo `code/hello.js` incluído aqui contém o mesmo simples programa, `alert("hello!")`. Quando uma página HTML referencia outras URLs como parte de si, por exemplo um arquivo de imagem ou um *script*, os navegadores irão buscá-los imediatamente e incluí-los na página.

Uma *tag*  de *script* deve sempre ser fechada com `</script>`, mesmo quando fizer referência para um arquivo externo e não contenha nenhum código. Se você esquecer disso, o restante da página será interpretado como parte de um *script* .

Alguns atributos podem conter um programa JavaScript. A *tag* `<button>` mostrada abaixo (que aparece como um botão na página) possui um atributo `onclick`, cujo conteúdo será executado sempre que o botão for clicado.

```html
<button onclick="alert('Boom!');">DO NOT PRESS</button>
```

Perceba que eu tive que usar aspas simples para a *string* do atributo `onclick` porque aspas duplas já estão sendo usadas para envolver o valor do atributo. Eu também poderia ter usado `&quot;`, mas isso tornaria o programa difícil de ler.

## Na caixa de areia

Executar programas baixados da internet é potencialmente perigoso. Você não sabe muito sobre as pessoas por trás da maioria dos sites que visita e elas não necessariamente são bem intencionadas. Executar programas de pessoas que tenham más intenções é como ter seu computador infectado por vírus, seus dados roubados e suas contas *hackeadas*.

Contudo, a atração da *Web* é que você pode navegar sem necessariamente confiar nas páginas que visita. Esse é o motivo pelo qual os navegadores limitam severamente as funções que um programa JavaScript pode fazer: eles não podem bisbilhotar os arquivos do seu computador ou modificar qualquer coisa que não esteja relacionada a página em que foi incorporado.

O isolamento de um ambiente de programação dessa maneira é chamado de *sandboxing*, a ideia é que o programa é inofensivo "brincando" em uma "caixa de areia". Mas você deve imaginar esse tipo específico de caixas de areia como tendo sobre si uma gaiola de grossas barras de aço, o que as torna um pouco diferentes das caixas de areia típicas de *playgrounds*.

A parte difícil do *sandboxing* é permitir que os programas tenham espaço suficiente para serem úteis e ao mesmo tempo impedi-los de fazer qualquer coisa perigosa. Várias funcionalidades úteis, como se comunicar com outros servidores ou ler o conteúdo da área de transferência, podem ser usadas para tarefas problemáticas ou invasivas à privacidade.

De vez em quando, alguém aparece com uma nova forma de burlar as limitações de um navegador e fazer algo prejudicial, variando de vazamentos de alguma pequena informação pessoal até assumir o controle total da máquina onde o navegador está sendo executado. Os desenvolvedores de navegadores respondem "tapando o buraco", e tudo está bem novamente —até que o próximo problema seja descoberto e divulgado, ao invés de ser secretamente explorado por algum governo ou máfia.

## Compatibilidade e a guerra dos navegadores

No início da web, um navegador chamado Mosaic dominava o mercado. Depois de alguns anos, quem desequilibrou a balança foi o Netscape, que por sua vez, foi derrotado pelo Internet Explorer da Microsoft. Nos momentos em que um único navegador era dominante, seus desenvolvedores se sentiam no direito de criar, unilateralmente, novas funcionalidades para a web. Como a maior parte dos usuários usava o mesmo navegador, os sites simplesmente começaram a usar esses recursos —sem se importarem com os outros navegadores.

Essa foi a idade das trevas da compatibilidade, frequentemente chamada de "guerra dos navegadores". Os desenvolvedores web não tiveram uma web unificada, mas sim duas ou três plataformas incompatíveis. Para piorar as coisas, os navegadores usados por volta de 2003 eram cheios de *bugs*, e, é claro que esses *bugs* foram diferentes para cada navegador. A vida era difícil para aqueles que escreviam páginas web.

O Mozilla Firefox, uma ramificação sem fins lucrativos do Netscape, desafiou a hegemonia do Internet Explorer no final dos anos 2000. A Microsoft não estava particularmente interessada em se manter competitiva nessa época, o Firefox levou uma parcela do mercado para longe do IE. Pela mesma época, a Google introduziu seu navegador Chrome, e o navegador Safari da Apple ganhou popularidade, levando-nos a uma situação onde existiam quatro grandes "competidores" nesse seguimento ao invés de um.

Os novos navegadores possuíam uma postura mais séria sobre a questão dos padrões e de melhores práticas de engenharia, diminuindo as incompatibilidades e *bugs*. A Microsoft, vendo sua cota de mercado se esfarelar, começou a adotar essas atitudes. Se você está começando a aprender sobre desenvolvimento web hoje, considere-se com sorte. As últimas versões da maior parte dos navegadores se comportam de uma maneira uniforme e possuem relativamente menos *bugs*.

Ainda não dá para dizer que a situação é perfeita. Algumas pessoas que usam a web estão, por motivo de inércia ou políticas corporativas, presas a navegadores antigos. Enquanto esses navegadores não "morrerem" completamente, desenvolver sites que funcionem para eles vai exigir uma grande quantidade de conhecimento "misterioso" sobre suas peculiaridades e defeitos. Este livro não tratará dessas peculiaridades. Pelo contrário, tem como objetivo apresentar um estilo de programação moderno e sensato.
