# JavaScript e o Navegador

{{quote {author: "Tim Berners-Lee", title: "The World Wide Web: A Very Short Personal History", chapter: true}

The dream behind the web is of a common information space in which we communicate by sharing information. Its universality is essential: the fact that a hypertext link can point to anything, be it personal, local or global, be it draft or highly polished.

quote}}

{{index "Berners-Lee, Tim", "World Wide Web", HTTP, [JavaScript, "history of"], "World Wide Web"}}

{{figure {url: "img/chapter_picture_13.jpg", alt: "Illustration showing a telephone switchboard", chapter: "framed"}}}

Os próximos capítulos deste livro discutirão navegadores web. Sem ((navegador))es, não haveria JavaScript — ou se houvesse, ninguém jamais teria prestado atenção nele.

{{index decentralization, compatibility}}

A tecnologia web tem sido descentralizada desde o início, não apenas tecnicamente, mas também na forma como evoluiu. Vários fabricantes de navegadores adicionaram novas funcionalidades de forma improvisada e às vezes mal pensada, as quais foram então — às vezes — adotadas por outros, e finalmente estabelecidas em ((padrões)).

Isso é tanto uma bênção quanto uma maldição. Por um lado, é empoderador não ter uma entidade central controlando um sistema, mas tê-lo sendo melhorado por diversas partes trabalhando em ((colaboração)) frouxa (ou ocasionalmente, hostilidade aberta). Por outro lado, a forma desordenada como a web foi desenvolvida significa que o sistema resultante não é exatamente um exemplo brilhante de ((consistência)) interna. Algumas partes são francamente confusas e mal projetadas.

## Redes e a Internet

((Rede))s de computadores existem desde os anos 1950. Se você colocar cabos entre dois ou mais computadores e permitir que eles enviem dados de um lado para outro através desses cabos, você pode fazer todo tipo de coisas maravilhosas.

Se conectar duas máquinas no mesmo prédio nos permite fazer coisas maravilhosas, conectar máquinas por todo o planeta deve ser ainda melhor. A tecnologia para começar a implementar essa visão foi desenvolvida nos anos 1980, e a rede resultante é chamada de _((internet))_. Ela correspondeu à sua promessa.

Um computador pode usar essa rede para enviar bits a outro computador. Para que qualquer ((comunicação)) efetiva surja desse envio de bits, os computadores em ambos os lados devem saber o que os bits devem representar. O significado de qualquer sequência de bits depende inteiramente do tipo de coisa que está tentando expressar e do mecanismo de ((codificação)) usado.

{{index [network, protocol]}}

Um _((protocolo)) de rede_ descreve um estilo de comunicação sobre uma ((rede)). Existem protocolos para enviar e-mail, para buscar e-mail, para compartilhar arquivos, e até para controlar computadores que foram infectados por software malicioso.

{{indexsee "HyperText Transfer Protocol", HTTP}}

O _Protocolo de Transferência de Hipertexto_ (((HTTP))) é um protocolo para recuperar ((recurso))s nomeados (pedaços de informação, como páginas web ou imagens). Ele especifica que o lado que faz a requisição deve começar com uma linha como esta, nomeando o recurso e a versão do protocolo que está tentando usar:

```{lang: http}
GET /index.html HTTP/1.1
```

Existem muito mais regras sobre como o requisitante pode incluir mais informações na ((requisição)) e como o outro lado, que retorna o recurso, empacota seu conteúdo. Veremos o HTTP com um pouco mais de detalhe no [Capítulo ?](http).

{{index layering, stream, ordering}}

A maioria dos protocolos é construída sobre outros protocolos. O HTTP trata a rede como um dispositivo semelhante a um fluxo no qual você pode colocar bits e fazer com que cheguem ao destino correto na ordem correta. Fornecer essas garantias sobre o envio primitivo de dados que a rede oferece já é um problema bastante complicado.

{{index TCP}}

{{indexsee "Transmission Control Protocol", TCP}}

O _Protocolo de Controle de Transmissão_ (TCP) é um ((protocolo)) que resolve esse problema. Todos os dispositivos conectados à internet o "falam", e a maior parte da comunicação na ((internet)) é construída sobre ele.

{{index "listening (TCP)"}}

Uma ((conexão)) TCP funciona da seguinte forma: um computador deve estar esperando, ou _escutando_, que outros computadores comecem a falar com ele. Para poder escutar diferentes tipos de comunicação ao mesmo tempo em uma única máquina, cada ouvinte tem um número (chamado de _((porta))_) associado a ele. A maioria dos ((protocolo))s especifica qual porta deve ser usada por padrão. Por exemplo, quando queremos enviar um e-mail usando o protocolo ((SMTP)), a máquina pela qual o enviamos deve estar escutando na porta 25.

Outro computador pode então estabelecer uma ((conexão)) conectando-se à máquina alvo usando o número de porta correto. Se a máquina alvo puder ser alcançada e estiver escutando naquela porta, a conexão é criada com sucesso. O computador que escuta é chamado de _((servidor))_, e o computador que se conecta é chamado de _((cliente))_.

{{index [abstraction, "of the network"]}}

Tal conexão funciona como um ((tubo)) de mão dupla por onde bits podem fluir — as máquinas em ambos os lados podem colocar dados nele. Uma vez que os bits são transmitidos com sucesso, eles podem ser lidos novamente pela máquina do outro lado. Este é um modelo conveniente. Pode-se dizer que o ((TCP)) fornece uma abstração da rede.

{{id web}}

## A Web

A _((World Wide Web))_ (que não deve ser confundida com a ((internet)) como um todo) é um conjunto de ((protocolo))s e formatos que nos permite visitar páginas web em um navegador. A palavra _Web_ se refere ao fato de que tais páginas podem facilmente se vincular umas às outras, conectando-se assim em uma enorme ((malha)) pela qual os usuários podem navegar.

Para se tornar parte da web, tudo que você precisa fazer é conectar uma máquina à ((internet)) e fazê-la escutar na porta 80 com o protocolo ((HTTP)) para que outros computadores possam pedir documentos a ela.

{{index URL}}

{{indexsee "uniform resource locator", URL}}

Cada ((documento)) na web é nomeado por um _localizador uniforme de recursos_ (URL), que se parece com algo assim:

```{lang: null}
  http://eloquentjavascript.net/13_browser.html
 |      |                      |               |
 protocolo     servidor               caminho
```

{{index HTTPS}}

A primeira parte nos diz que essa URL usa o ((protocolo)) HTTP (ao contrário, por exemplo, de HTTP criptografado, que seria _https://_). Em seguida vem a parte que identifica de qual ((servidor)) estamos solicitando o documento. Por último vem uma string de caminho que identifica o documento (ou _((recurso))_) em que estamos interessados.

Máquinas conectadas à internet recebem um _((endereço IP))_, um número que pode ser usado para enviar mensagens àquela máquina, e se parece com algo como `149.210.142.219` ou `2001:4860:4860::8888`. Como listas de números mais ou menos aleatórios são difíceis de lembrar e estranhas de digitar, você pode registrar um nome de _((domínio))_ para um endereço ou conjunto de endereços. Registrei _eloquentjavascript.net_ para apontar para o endereço IP de uma máquina que controlo e posso assim usar esse nome de domínio para servir páginas web.

{{index browser}}

Se você digitar essa URL na ((barra de endereço)) do seu navegador, o navegador tentará recuperar e exibir o ((documento)) naquela URL. Primeiro, seu navegador precisa descobrir a que endereço _eloquentjavascript.net_ se refere. Então, usando o protocolo ((HTTP)), ele fará uma conexão com o servidor naquele endereço e pedirá o recurso _/13_browser.html_. Se tudo correr bem, o servidor enviará de volta um documento, que seu navegador então exibirá na sua tela.

## HTML

{{index HTML}}

{{indexsee "HyperText Markup Language", HTML}}

_HTML_, que significa Linguagem de Marcação de Hipertexto, é o formato de documento usado para páginas web. Um documento HTML contém ((texto)), assim como _((tag))s_ que dão estrutura ao texto, descrevendo coisas como links, parágrafos e cabeçalhos.

Um documento HTML curto pode se parecer com isto:

```{lang: "html"}
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
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

{{if book

É assim que tal documento ficaria no navegador:

{{figure {url: "img/home-page.png", alt: "A rendered version of the home page example HTML",width: "6.3cm"}}}

if}}

{{index [HTML, notation]}}

As tags, envolvidas em ((colchetes angulares)) (`<` e `>`, os símbolos de _menor que_ e _maior que_), fornecem informações sobre a ((estrutura)) do documento. O outro ((texto)) é apenas texto simples.

{{index doctype, version}}

O documento começa com `<!doctype html>`, que diz ao navegador para interpretar a página como HTML _moderno_, em oposição a estilos obsoletos usados no passado.

{{index "head (HTML tag)", "body (HTML tag)", "title (HTML tag)", "h1 (HTML tag)", "p (HTML tag)"}}

Documentos HTML têm um cabeçalho (head) e um corpo (body). O cabeçalho contém informações _sobre_ o documento, e o corpo contém o documento em si. Neste caso, o cabeçalho declara que o título deste documento é "My home page" e que usa a codificação UTF-8, que é uma forma de codificar texto Unicode como dados binários. O corpo do documento contém um cabeçalho (`<h1>`, significando "cabeçalho 1" — `<h2>` a `<h6>` produzem subcabeçalhos) e dois ((parágrafo))s (`<p>`).

{{index "href attribute", "a (HTML tag)"}}

Tags vêm em diversas formas. Um ((elemento)), como o corpo, um parágrafo ou um link, é iniciado por uma _((tag de abertura))_ como `<p>` e terminado por uma _((tag de fechamento))_ como `</p>`. Algumas tags de abertura, como a de ((link)) (`<a>`), contêm informações extras na forma de pares `nome="valor"`. Estes são chamados de _((atributo))s_. Neste caso, o destino do link é indicado com `href="http://eloquentjavascript.net"`, onde `href` significa "referência de hipertexto".

{{index "src attribute", "self-closing tag", "img (HTML tag)"}}

Alguns tipos de ((tag))s não envolvem nada e portanto não precisam ser fechadas. A tag de metadados `<meta charset="utf-8">` é um exemplo disso.

{{index [escaping, "in HTML"]}}

Para poder incluir ((colchetes angulares)) no texto de um documento, mesmo que eles tenham um significado especial em HTML, mais uma forma de notação especial precisa ser introduzida. Um colchete angular de abertura simples é escrito como `&lt;` ("menor que"), e um de fechamento como `&gt;` ("maior que"). Em HTML, um caractere de e-comercial (`&`) seguido por um nome ou código de caractere e um ponto e vírgula (`;`) é chamado de _((entidade))_ e será substituído pelo caractere que codifica.

{{index ["backslash character", "in strings"], "ampersand character", "double-quote character"}}

Isso é análogo à forma como barras invertidas são usadas em strings JavaScript. Como esse mecanismo dá aos caracteres de e-comercial um significado especial também, eles precisam ser escapados como `&amp;`. Dentro de valores de atributos, que são envolvidos em aspas duplas, `&quot;` pode ser usado para inserir um caractere de aspas literal.

{{index "error tolerance", parsing}}

HTML é analisado de forma notavelmente tolerante a erros. Quando tags que deveriam estar lá estão faltando, o navegador as adiciona automaticamente. A forma como isso é feito foi padronizada, e você pode confiar que todos os navegadores modernos farão da mesma forma.

O documento a seguir será tratado da mesma forma que o mostrado anteriormente:

```{lang: "html"}
<!doctype html>

<meta charset=utf-8>
<title>My home page</title>

<h1>My home page</h1>
<p>Hello, I am Marijn and this is my home page.
<p>I also wrote a book! Read it
  <a href=http://eloquentjavascript.net>here</a>.
```

{{index "title (HTML tag)", "head (HTML tag)", "body (HTML tag)", "html (HTML tag)"}}

As tags `<html>`, `<head>` e `<body>` sumiram completamente. O navegador sabe que `<meta>` e `<title>` pertencem ao cabeçalho e que `<h1>` significa que o corpo começou. Além disso, não estou mais fechando explicitamente os parágrafos, já que abrir um novo parágrafo ou terminar o documento os fechará implicitamente. As aspas em torno dos valores dos atributos também foram removidas.

Este livro geralmente omitirá as tags `<html>`, `<head>` e `<body>` dos exemplos para mantê-los curtos e livres de desordem. Mas eu _vou_ fechar tags e incluir aspas em torno de atributos.

{{index browser}}

Também geralmente omitirei a declaração de ((doctype)) e de `charset`. Não tome isso como incentivo para removê-las de documentos HTML. Navegadores frequentemente farão coisas ridículas quando você as esquece. Considere o doctype e os metadados de `charset` como implicitamente presentes nos exemplos, mesmo quando não são mostrados no texto.

{{id script_tag}}

## HTML e JavaScript

{{index [JavaScript, "in HTML"], "script (HTML tag)"}}

No contexto deste livro, a tag HTML mais importante é `<script>`, que nos permite incluir um trecho de JavaScript em um documento.

```{lang: "html"}
<h1>Testing alert</h1>
<script>alert("hello!");</script>
```

{{index "alert function", timeline}}

Tal script será executado assim que sua tag `<script>` for encontrada enquanto o navegador lê o HTML. Esta página exibirá um diálogo quando aberta — a função `alert` se assemelha a `prompt`, pois abre uma pequena janela, mas apenas mostra uma mensagem sem pedir entrada.

{{index "src attribute"}}

Incluir programas grandes diretamente em documentos HTML é frequentemente impraticável. A tag `<script>` pode receber um atributo `src` para buscar um arquivo de script (um arquivo de texto contendo um programa JavaScript) de uma URL.

```{lang: "html"}
<h1>Testing alert</h1>
<script src="code/hello.js"></script>
```

O arquivo _code/hello.js_ incluído aqui contém o mesmo programa — `alert("hello!")`. Quando uma página HTML referencia outras URLs como parte de si mesma, como um arquivo de imagem ou um script, navegadores web as recuperarão imediatamente e as incluirão na página.

{{index "script (HTML tag)", "closing tag"}}

Uma tag de script deve sempre ser fechada com `</script>`, mesmo que faça referência a um arquivo de script e não contenha nenhum código. Se você esquecer disso, o restante da página será interpretado como parte do script.

{{index "relative path", dependency}}

Você pode carregar ((módulos ES)) (veja [Capítulo ?](modules#es)) no navegador dando à sua tag de script um atributo `type="module"`. Tais módulos podem depender de outros módulos usando ((URL))s relativas a si mesmos como nomes de módulo em declarações `import`.

{{index "button (HTML tag)", "onclick attribute"}}

Alguns atributos também podem conter um programa JavaScript. A tag `<button>` (que aparece como um botão) suporta um atributo `onclick`. O valor do atributo será executado sempre que o botão for clicado.

```{lang: "html"}
<button onclick="alert('Boom!');">DO NOT PRESS</button>
```

{{index "single-quote character", [escaping, "in HTML"]}}

Note que tive que usar aspas simples para a string no atributo `onclick` porque aspas duplas já estão sendo usadas para delimitar o atributo inteiro. Eu também poderia ter usado `&quot;` para escapar as aspas internas.

## Na sandbox

{{index "malicious script", "World Wide Web", browser, website, security}}

Executar programas baixados da ((internet)) é potencialmente perigoso. Você não sabe muito sobre as pessoas por trás da maioria dos sites que visita, e elas não necessariamente têm boas intenções. Executar programas de agentes maliciosos é como você tem seu computador infectado por ((vírus)), seus dados roubados e suas contas hackeadas.

No entanto, a atração da web é que você pode navegá-la sem necessariamente ((confiar)) em todas as páginas que visita. É por isso que navegadores limitam severamente as coisas que um programa JavaScript pode fazer: ele não pode olhar os arquivos no seu computador ou modificar qualquer coisa não relacionada à página web em que está incorporado.

{{index isolation}}

Isolar um ambiente de programação dessa forma é chamado de _((sandbox))_, a ideia sendo que o programa está brincando inofensivamente em uma caixa de areia. Mas você deve imaginar esse tipo particular de caixa de areia como tendo uma gaiola de barras de aço grossas sobre ela, para que os programas brincando nela não possam realmente escapar.

A parte difícil do sandboxing é permitir que programas tenham espaço suficiente para serem úteis enquanto os restringe de fazer qualquer coisa perigosa. Muitas funcionalidades úteis, como se comunicar com outros servidores ou ler o conteúdo da ((área de transferência)), também podem ser usadas para fins problemáticos que invadem a ((privacidade)).

{{index leak, exploit, security}}

De vez em quando, alguém aparece com uma nova forma de contornar as limitações de um ((navegador)) e fazer algo prejudicial, variando de vazar informações privadas menores a tomar controle da máquina inteira em que o navegador está rodando. Os desenvolvedores do navegador respondem corrigindo a falha, e tudo fica bem novamente — até que o próximo problema seja descoberto, e esperançosamente divulgado publicamente em vez de secretamente explorado por alguma agência governamental ou organização criminosa.

## Compatibilidade e as guerras dos navegadores

{{index Microsoft, "World Wide Web"}}

Nos estágios iniciais da web, um navegador chamado ((Mosaic)) dominava o mercado. Depois de alguns anos, o equilíbrio mudou para o ((Netscape)), que foi, por sua vez, amplamente suplantado pelo ((Internet Explorer)) da Microsoft. Em qualquer momento em que um único ((navegador)) era dominante, o fabricante desse navegador se sentia no direito de inventar unilateralmente novas funcionalidades para a web. Como a maioria dos usuários usava o navegador mais popular, ((sites)) simplesmente começavam a usar essas funcionalidades — sem se importar com os outros navegadores.

Essa foi a era sombria da ((compatibilidade)), frequentemente chamada de _((guerras dos navegadores))_. Desenvolvedores web ficaram com não uma web unificada, mas duas ou três plataformas incompatíveis. Para piorar as coisas, os navegadores em uso por volta de 2003 eram todos cheios de ((bug))s, e é claro que os bugs eram diferentes para cada ((navegador)). A vida era difícil para pessoas que escreviam páginas web.

{{index Apple, "Internet Explorer", Mozilla}}

O Mozilla ((Firefox)), uma ramificação sem fins lucrativos do ((Netscape)), desafiou a posição do Internet Explorer no final dos anos 2000. Como a ((Microsoft)) não estava particularmente interessada em se manter competitiva na época, o Firefox tomou grande parte de sua fatia de mercado. Mais ou menos na mesma época, o ((Google)) lançou seu navegador ((Chrome)) e o ((Safari)) da Apple ganhou popularidade, levando a uma situação em que havia quatro grandes participantes, em vez de um.

{{index compatibility}}

Os novos participantes tinham uma atitude mais séria em relação a ((padrões)) e melhores práticas de ((engenharia)), nos dando menos incompatibilidade e menos ((bug))s. A Microsoft, vendo sua participação de mercado desmoronar, adotou essas atitudes em seu navegador Edge, que substituiu o Internet Explorer. Se você está começando a aprender desenvolvimento web hoje, considere-se sortudo. As versões mais recentes dos principais navegadores se comportam de forma bastante uniforme e têm relativamente poucos bugs.

Infelizmente, com a participação de mercado do Firefox ficando cada vez menor, e o Edge se tornando apenas um invólucro em torno do núcleo do Chrome em 2018, essa uniformidade pode novamente tomar a forma de um único fornecedor — Google, dessa vez — tendo controle suficiente sobre o mercado de navegadores para impor sua ideia do que a web deveria ser ao resto do mundo.

Pelo que vale, essa longa cadeia de eventos históricos e acidentes produziu a plataforma web que temos hoje. Nos próximos capítulos, vamos escrever programas para ela.
