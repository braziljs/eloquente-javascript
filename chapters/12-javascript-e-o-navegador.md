# Chapter 12 - JavaScript and the Browser
# Capítulo 12 - JavaScript e o Navegador

> "The browser is a really hostile programming environment."
> "O navegador é um ambiente realmente hostil de programação."
>
> - Douglas Crockford, The JavaScript Programming Language (video lecture)
> - Douglas Crockford, The JavaScript Programming Language (palestra)

The next part of this book will talk about web browsers. Without web browsers, there would be no JavaScript. And even if there were, no one would ever have paid any attention to it.

A próxima parte deste livro vai falar sobre navegadores web. Sem os navegadores, não existiria JavaScript. E mesmo se existisse, ninguém daria atenção a ele.

Web technology has, from the start, been decentralized, not just technically but also in the way it has evolved. Various browser vendors have added new functionality in ad-hoc and sometimes poorly thought out ways, which then sometimes ended up being adopted by others and finally set down as a standard.

A tecnologia web, desde o início, é descentralizada, não apenas tecnicamente mas também na forma que evolui. Vários fornecedores de navegador tem adicionado funcionalidades *ad-hoc* e as vezes maneiras mal pensadas, que então são adotadas por outros e finalmente viram um padrão.  

This is both a blessing and a curse. On the one hand, it is empowering to not have a central party control a system but have it be improved by various parties working in loose collaboration (or, occasionally, open hostility). On the other hand, the haphazard way in which the Web was developed means that the resulting system is not exactly a shining example of internal consistency. In fact, some parts of it are downright messy and confusing.

Isso é igualmente uma benção e uma maldição. Por um lado, isso reforça a não existência de uma particição central controlando um sistema mas tendo este sendo melhorado por várias partes trabalhando com pouca colaboração (ou, ocasionalmente, franca hostilidade). Por outro lado, a forma casual que a Web foi desenvolvida significa que o sistema resultante não é exatamente um brilhante exemplo interno de consistência. De fato, algumas partes são completamente bagunçadas e confusas.

## Networks and the Internet
## Redes e a Internet

Computer networks have been around since the 1950s. If you put cables between two or more computers and allow them to send data back and forth through these cables, you can do all kinds of wonderful things.

Redes de computador existem desde 1950. Se você colocar cabos entre dois ou mais computadores e permitir que eles enviem dados um para o outro por estes cabos, você pode fazer todo tipo de coisas maravilhosas.

If connecting two machines in the same building allows us to do wonderful things, connecting machines all over the planet should be even better. The technology to start implementing this vision was developed in the 1980s, and the resulting network is called the *Internet*. It has lived up to its promise.

Se conectando duas máquinas no mesmo prédio permite que nós façamos coisas incríveis, conectando máquinas por todo o planeta deve ser ainda melhor. A tecnologia para começar a implementação desta visão foi desenvolvida em meados de 1980, e a rede resultante é chamada de *Internet*. Ela tem vivido desde a sua promessa.

A computer can use this network to spew bits at another computer. For any effective communication to arise out of this bit-spewing, the computers at both ends must know what the bits are supposed to represent. The meaning of any given sequence of bits depends entirely on the kind of thing that it is trying to express and on the encoding mechanism used.

Um computador pode usar essa rede para lançar bits para outro computador. Para qualquer comunicação efetiva nascida desse lançamento de bits, os computadores em ambas as pontas devem conhecer qual a representação de cada bit. O significado de cada sequência de bits depende inteiramente do tipo de coisa que está tentando se expressar e o mecanismo de codificação usado.

A *network protocol* describes a style of communication over a network. There are protocols for sending email, for fetching email, for sharing files, or even for controlling computers that happen to be infected by malicious software.

Um *protocolo de rede* descreve um estilo de comunicação em uma rede. Existem protocolos para mandar email, para receber email, para transferir arquivos, e até para controlar computadores que foram infectados por softwares maliciosos.

For example, a simple chat protocol might consist of one computer sending the bits that represent the text “CHAT?” to another machine and the other responding with “OK!” to confirm that it understands the protocol. They can then proceed to send each other strings of text, read the text sent by the other from the network, and display whatever they receive on their screens.

Por exemplo, um simples protocolo de chat deve consistir em um computador enviando os bits que representam o texto "CHAT?" para outra máquina, e o outro respondendo "OK!" para confirmar que o protocolo foi entendido. Eles podem então proceder e enviar um para o outro strings de texto, ler o texto enviado um para o outro pela rede, e mostrar o que eles receberam nas suas telas.

Most protocols are built on top of other protocols. Our example chat protocol treats the network as a streamlike device into which you can put bits and have them arrive at the correct destination in the correct order. Ensuring those things is already a rather difficult technical problem.

A maioria dos protocolos são feitas em cima de outros protocolos. Nosso exemplo de protocolo de chat considera a rede como um tipo de dispositivo de *stream*, no qual você pode mandar bits e enviá-los para o destino correto na ordem correta. Assegurar essas coisas atualmente é um problema técnico bastante difícil.

The *Transmission Control Protocol* (TCP) is a protocol that solves this problem. All Internet-connected devices “speak” it, and most communication on the Internet is built on top of it.

O TCP (Transmission Control Protocol) é um protocolo que resolve este problema. Todos os aparelhos conectados na Internet "falam" ele, e a maioria da comunicação na Internet é feita sobre ele.

A TCP connection works as follows: one computer must be waiting, or *listening*, for other computers to start talking to it. To be able to listen for different kinds of communication at the same time on a single machine, each listener has a number (called a *port*) associated with it. Most protocols specify which port should be used by default. For example, when we want to send an email using the SMTP protocol, the machine through which we send it is expected to be listening on port 25.

Uma conexão TCP funciona da seguinte maneira: um computador deve estar esperando, ou *ouvindo*, por outros computadores que irão começar a falar com ele. Para ser capaz de escutar por diferentes tipos de comunicação ao mesmo tempo em uma simples máquina, cada *ouvinte* tem um número associado a ele, chamado *port* ou *porta*. A maioria dos protocolos especificam qual porta deve ser usada por padrão. Por exemplo, quando nós queremos mandar um email usando o protocolo SMTP, a máquina que enviaremos isso deve estar escutando na porta 25.

Another computer can then establish a connection by connecting to the target machine using the correct port number. If the target machine can be reached and is listening on that port, the connection is successfully created. The listening computer is called the *server*, and the connecting computer is called the *client*.

Outro computador pode então estabelecer uma conexão se conectando a máquina alvo usando o número correto da porta. Se a máquina alvo pode ser encontrada e estiver escutando nessa porta, a conexão vai ser criada com sucesso. O computador ouvinte é chamado de *server*, ou servidor, e o computador que está se conectando é chamado *client*, ou cliente.

Such a connection acts as a two-way pipe through which bits can flow—the machines on both ends can put data into it. Once the bits are successfully transmitted, they can be read out again by the machine on the other side. This is a convenient model. You could say that TCP provides an abstraction of the network.

Uma conexão atua como um encanamento de via dupla pelo qual bits podem ser enviados às máquinas nas duas extremidades contendo dados. Uma vez que os bits tenham sido transmitidos com sucesso, eles podem ser lidos novamente pela máquina do outro lado. Isso é um modelo conveniente. Você pode dizer que o TCP fornece uma abstração de uma rede.

## The Web
## A Web

The *World Wide Web* (not to be confused with the Internet as a whole) is a set of protocols and formats that allow us to visit web pages in a browser. The “Web” part in the name refers to the fact that such pages can easily link to each other, thus connecting into a huge mesh that users can move through.

A *World Wide Web* (não ser confundida com a Internet como um todo) é um conjunto de protocolos e formatos que nos permite visitar páginas web em um navegador. A parte "Web" no nome se refere ao fato destas páginas serem facilmente ligadas umas nas outras, e então se ligarem em uma grande malha onde os usuários podem se mover através desta.

To add content to the Web, all you need to do is connect a machine to the Internet, and have it listen on port 80, using the *Hypertext Transfer Protocol* (HTTP). This protocol allows other computers to request documents over the network.

Para adicionar conteúdo na Web, tudo que você precisa fazer é conectar uma máquina a Internet, e deixá-la escutando na porta 80, usando o *Hypertext Transfer Protocol* (HTTP). Este protocolo permite outros computadores requisitarem documentos na rede.

Each document on the Web is named by a Universal Resource Locator (URL), which looks something like this:

Cada documento na Web é nomeado por um *Universal Resource Locator* (URL), que se parece com algo assim:

```
http://eloquentjavascript.net/12_browser.html
|     |                      |               |
protocolo      servidor        caminho (path)
```

The first part tells us that this URL uses the HTTP protocol (as opposed to, for example, encrypted HTTP, which would be *https://*). Then comes the part that identifies which server we are requesting the document from. Last is a path string that identifies the specific document (or *resource*) we are interested in.

A primeira parte nos diz que esta URL usa o protocolo HTTP (ao contrário, por exemplo, do HTTP encriptado, que deve ser `https://`). Então vem a parte que identifica de qual servidor nós estamos requisitando o documento. Por último temos a string de caminho que identifica o documento específico (ou *resource*) que estamos interessados.

Each machine connected to the Internet gets a unique *IP address*, which looks something like `37.187.37.82`. You can use these directly as the server part of a URL. But lists of more or less random numbers are hard to remember and awkward to type, so you can instead register a *domain name* to point toward a specific machine or set of machines. I registered *eloquentjavascript.net* to point at the IP address of a machine I control and can thus use that domain name to serve web pages.

If you type the previous URL into your browser’s address bar, it will try to retrieve and display the document at that URL. First, your browser has to find out what address *eloquentjavascript.net* refers to. Then, using the HTTP protocol, it makes a connection to the server at that address and asks for the resource */12_browser.html*.

We will take a closer look at the HTTP protocol in Chapter 17.

## HTML

HTML, which stands for *Hypertext Markup Language*, is the document format used for web pages. An HTML document contains text, as well as *tags* that give structure to the text, describing things such as links, paragraphs, and headings.

A simple HTML document looks like this:

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

The tags, wrapped in angular brackets (< and >), provide information about the structure of the document. The other text is just plain text.

The document starts with `<!doctype html>`, which tells the browser to interpret it as *modern* HTML, as opposed to various dialects that were in use in the past.

HTML documents have a head and a body. The head contains information *about* the document, and the body contains the document itself. In this case, we first declared that the title of this document is “My home page” and then gave a document containing a heading (`<h1>`, meaning “heading 1”—`<h2>` to `<h6>` produce more minor headings) and two paragraphs (`<p>`).

Tags come in several forms. An element, such as the body, a paragraph, or a link, is started by an opening tag like `<p>` and ended by a closing tag like `</p>`. Some opening tags, such as the one for the link (`<a>`), contain extra information in the form of `name="value"` pairs. These are called *attributes*. In this case, the destination of the link is indicated with `href="http://eloquentjavascript.net"`, where href stands for “hypertext reference”.

Some kinds of tags do not enclose anything and thus do not need to be closed. An example of this would be `<img src="http://example.com/image.jpg">`, which will display the image found at the given source URL.

To be able to include angular brackets in the text of a document, even though they have a special meaning in HTML, yet another form of special notation has to be introduced. A plain opening angular bracket is written as `&lt;` (“less than”), and a closing bracket is written as `&gt;` (“greater than”). In HTML, an ampersand (&) character followed by a word and a semicolon (;) is called an *entity*, and will be replaced by the character it encodes.

This is analogous to the way backslashes are used in JavaScript strings. Since this mechanism gives ampersand characters a special meaning too, those need to be escaped as `&amp;`. Inside an attribute, which is wrapped in double quotes, `&quot;` can be used to insert an actual quote character.

HTML is parsed in a remarkably error-tolerant way. When tags that should be there are missing, the browser reconstructs them. The way in which this is done has been standardized, and you can rely on all modern browsers to do it in the same way.

The following document will be treated just like the one shown previously:

  <!doctype html>

  <title>My home page</title>

  <h1>My home page</h1>
  <p>Hello, I am Marijn and this is my home page.
  <p>I also wrote a book! Read it
    <a href=http://eloquentjavascript.net>here</a>.

The `<html>`, `<head>`, and `<body>` tags are gone completely. The browser knows that `<title>` belongs in a head, and that `<h1>` in a body. Furthermore, I am no longer explicitly closing the paragraphs since opening a new paragraph or ending the document will close them implicitly. The quotes around the link target are also gone.

This book will usually omit the `<html>`, `<head>`, and `<body>` tags from examples to keep them short and free of clutter. But I *will* close tags and include quotes around attributes.

I will also usually omit the doctype. This is not to be taken as an encouragement to omit doctype declarations. Browsers will often do ridiculous things when you forget them. You should consider doctypes implicitly present in examples, even when they are not actually shown in the text.

## HTML and JavaScript

In the context of this book, the most important HTML tag is `<script>`. This tag allows us to include a piece of JavaScript in a document.

  <h1>Testing alert</h1>
  <script>alert("hello!");</script>

Such a script will run as soon as its `<script>` tag is encountered as the browser reads the HTML. The page shown earlier will pop up an alert dialog when opened.

Including large programs directly in HTML documents is often impractical. The `<script>` tag can be given an `src` attribute in order to fetch a script file (a text file containing a JavaScript program) from a URL.

  <h1>Testing alert</h1>
  <script src="code/hello.js"></script>

The `code/hello.js` file included here contains the same simple program, `alert("hello!")`. When an HTML page references other URLs as part of itself, for example an image file or a script, web browsers will retrieve them immediately and include them in the page.

A script tag must always be closed with `</script>`, even if it refers to a script file and doesn’t contain any code. If you forget this, the rest of the page will be interpreted as part of the script.

Some attributes can also contain a JavaScript program. The `<button>` tag shown next (which shows up as a button) has an `onclick` attribute, whose content will be run whenever the button is clicked.

  <button onclick="alert('Boom!');">DO NOT PRESS</button>

Note that I had to use single quotes for the string in the `onclick` attribute because double quotes are already used to quote the whole attribute. I could also have used `&quot;`, but that’d make the program harder to read.

## In the sandbox

Running programs downloaded from the Internet is potentially dangerous. You do not know much about the people behind most sites you visit, and they do not necessarily mean well. Running programs by people who do not mean well is how you get your computer infected by viruses, your data stolen, and your accounts hacked.

Yet the attraction of the Web is that you can surf it without necessarily trusting all the pages you visit. This is why browsers severely limit the things a JavaScript program may do: it can’t look at the files on your computer or modify anything not related to the web page it was embedded in.

Isolating a programming environment in this way is called *sandboxing*, the idea being that the program is harmlessly playing in a sandbox. But you should imagine this particular kind of sandbox as having a cage of thick steel bars over it, which makes it somewhat different from your typical playground sandbox.

The hard part of sandboxing is allowing the programs enough room to be useful yet at the same time restricting them from doing anything dangerous. Lots of useful functionality, such as communicating with other servers or reading the content of the copy-paste clipboard, can also be used to do problematic, privacy-invading things.

Every now and then, someone comes up with a new way to circumvent the limitations of a browser and do something harmful, ranging from leaking minor private information to taking over the whole machine that the browser runs on. The browser developers respond by fixing the hole, and all is well again—that is, until the next problem is discovered, and hopefully publicized, rather than secretly exploited by some government or mafia.

## Compatibility and the browser wars

In the early stages of the Web, a browser called Mosaic dominated the market. After a few years, the balance had shifted to Netscape, which was then, in turn, largely supplanted by Microsoft’s Internet Explorer. At any point where a single browser was dominant, that browser’s vendor would feel entitled to unilaterally invent new features for the Web. Since most users used the same browser, websites would simply start using those features—never mind the other browsers.

This was the dark age of compatibility, often called the *browser wars*. Web developers were left with not one unified Web but two or three incompatible platforms. To make things worse, the browsers in use around 2003 were all full of bugs, and of course the bugs were different for each browser. Life was hard for people writing web pages.

Mozilla Firefox, a not-for-profit offshoot of Netscape, challenged Internet Explorer’s hegemony in the late 2000s. Because Microsoft was not particularly interested in staying competitive at the time, Firefox took quite a chunk of market share away from it. Around the same time, Google introduced its Chrome browser, and Apple’s Safari browser gained popularity, leading to a situation where there were four major players, rather than one.

The new players had a more serious attitude toward standards and better engineering practices, leading to less incompatibility and fewer bugs. Microsoft, seeing its market share crumble, came around and adopted these attitudes. If you are starting to learn web development today, consider yourself lucky. The latest versions of the major browsers behave quite uniformly and have relatively few bugs.

That is not to say that the situation is perfect just yet. Some of the people using the Web are, for reasons of inertia or corporate policy, stuck with very old browsers. Until those browsers die out entirely, writing websites that work for them will require a lot of arcane knowledge about their shortcomings and quirks. This book is not about those quirks. Rather, it aims to present the modern, sane style of web programming.