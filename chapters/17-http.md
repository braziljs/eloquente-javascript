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

A primeira palavra é o metodo do 'request'. GET significa que nós queremos obter o uma determinada informação. Outros metodos comuns são DELETE, para deletar alguma informação, PUT para substitui-la e POST para enviar uma informação. Fique atento para o fato de que o servidor não precisa, necessáriamente, executar todo pedido que recebe. Se você for for a um site qualquer e executar um 'request' de DELETE de sua página principal, este 'request' provavelmente será recusado.

A parte após o nome do metodo é o caminho do recurso que o 'request' se aplica. Na hipótese mais simples, o recurso é simplesmente um arquivo no servidor, mas o protocolo (HTTP) não requer que o recurso seja necessáriamente um arquivo. Um recurso pode ser qualquer coisa passível de ser transferida como um arquivo. Muitos servidores geram respostas na medida em que são solicitados. Por exemplo, se você abrir twitter.com/marinjnjh, o servidor irá procurar em sua base de dados por um usuário chamado marijnjh, e se achar um, irá gerar a página de perfil para esse usuário.

Após o caminho do recurso, a primeira linha do 'request' menciona o HTTP/1.1 para indicar a versão do protocolo HTTP que está sendo usada.

A resposta do servidor começará com a versão sendo usada também, seguida pelo status da resposta do servidor,primeiro na forma de um código de status da resposta e em seguda por um texto legível.

```sh

HTTP/1.1 200 OK

```

Códigos de Status começando com 2 indicam que o 'request' foi bem sucedido. Códigos que começam com 4 significam que alguma coisa deu errado com o 'request'. 404 é provavelmente o código de resposta HTTP mais famoso e significa que o recurso procurado não foi encontrado. Códigos que começam 5 significam que um erro aconteceu no servidor e que a culpa não é do 'request'.

A primeira linha do 'request' ou da resposta pode ser seguida por qualquer número de cabeçalhos. Estas são as linhas no formulário "nome:valor" que especificam informações extras sobre o 'request' ou sobre a resposta. Estes cabeçalhos são parte do exemplo de resposta a seguir:

```sh

Content-Length: 65585
Content-Type: text/html
Last-Modified: Wed, 09 Apr 2014 10:48:09 GMT

```

Este trecho nos mostra o tamanho e o tipo da resposta. Neste caso, é um cocumento de HTML com 65.585 bytes. Ele mostra também quando foi a última vez que o documento foi modificado.

Na maior parta, o cliente ou servidor decidem quais cabeçalhos incluir em um 'request' ou resposta, apesar de alguns serem obrigatórios. Por exemplo, o cabeçalho do Host, que especifica o hostname, deve ser incluído em um 'request' porque um servidor pode estar servindo múltiplos hostnams em um mesmo endereço de IP, e sem este cabeçalho, o servidor não saberá qual host o cliente está tentando conversar.

Após os cabeçalhos, ambos 'requests' e respostas podem incluir uma linha em branco, seguida pelo corpo, que contém os dados que estão sendo enviados.Os métodos GET e DELETE não enviam qualquer tipo de dado, mas PUT e POST enviam. De maneira semelhante, alguns tipos de resposta, como respostas de erro, também não precisam de um corpo.


###Navegadores e o HTTP

Como vimos no exemplo, o navegador irá fazer um 'request' quando submetermos uma URL na barra de endereços. Quando a página de HTML  originada faz referências a outros arquivos, como imagens ou arquivos de Javascript, estes são buscados também.

Um website moderadamente complicado pode ter fácilmente algo em torno de 10 a 200 recursos. Para conseguir pegar estes recursos rápidamente, os navegadores irão realizar diversos 'requests' simultaneamente, ao invés de esperar pelo retorno da resposta de cada 'request' feito. Tais documentos são sempre pegos utilizando o método GET para os pedidos.

###Páginas de HTML

Páginas de HTML podem incluir formulários, que permitem que o usuário preencha informações e as envie para o servidor. Este é um exemplo de formulário:

```html
<form method="GET" action="example/message.html">
  <p>Nome: <input type="text" name="name"></p>
  <p>Mensagem:<br><textarea name="message"></textarea></p>
  <p><button type="submit">Enviar</button></p>
</form>

```
Este código descreve um formulário com dois campos:um pequeno, que solicita um nome, e um maior, que solicita que o usuário escreva uma mensagem. Quando você clica no botão  'Enviar', a informação nestes campos será codificada em uma "String" de pesquisa. Quando o método do elemento é GET (ou o método é omitido), esta "String" de pesquisa é colocada em uma URL de ação e o navegador fará um 'request' com esta URL.


```sh
GET /example/message.html?name=Jean&message=Yes%3F HTTP/1.1
```
O começo desta 'String' de pesquisa é indicado por um ponto de interrogação. Após este ponto, seguem os pares nomes e valores, que correspondem ao campo 'Nome' nos elementos do  formulário e o conteúdo destes elementos, respectivamente. Um caractere de concatenação ('&') é usado para separar os pares.

A mensagem codificada na URL anterior é "Yes?", mesmo que o ponto de exclamação seja substituído por um código estranho. Alguns caracteres em "Strings" de pesquisa precisam ser escapados. O ponto de interrogação é um um destes e é representado como "%3F". Parace ser uma regra não escrita que cada formato precisa de sua própria maneira de escapar caracteres. Este formato, chamado de Codificação de URL, usa um caractere de percentual (%) seguido por dois digítos hexadecimais para codificar o código do caractere. Neste caso, o 3F, que significa 63 em notação decimal, é o código que referencia o ponto de exclamação. O JavaScript confere as funções encodeURIComponent e decodeURIComponent para codificar e decodificar este formato.

```js

console.log(encodeURIComponent("Hello & goodbye"));
// → Hello%20%26%20goodbye
console.log(decodeURIComponent("Hello%20%26%20goodbye"));
// → Hello & goodbye

```
Se nós mudarmos o método do atributo do formulário de HTML no exemplo que vimos antes para POST, o 'request' de HTTP feito para enviar o formulário irá usar POST e usará a 'String' de pesquisa no corpo do 'request', ao inves de adicioná-lo a URL.

```sh
POST /example/message.html HTTP/1.1
Content-length: 24
Content-type: application/x-www-form-urlencoded

name=Jean&message=Yes%3F
```

Por convenção, o método GET é usado para 'requests' que não possuem efeitos colateriais, como ao fazer pesquisas.'Requests' que mudam algo no servidor, como aqueles que criam uma nova conta ou postam uma mensagem, devem ser expressados com outros métodos, como o POST. Softwares do lado do cliente, como navegadores, sabem que não devem fazer 'requests' POST cegamente, mas farão, implicitamente, 'requests' GET para, por exemplo, pré-carregar recursos que acreditam ser necessários no curto-prazo.

O próximo capítulo irá retornar a formulários e irá abordar como nós podemos desenvolve-los com JavaScript.

###XMLHttpRequest

The interface through which browser JavaScript can make HTTP requests is called XMLHttpRequest (note the inconsistent capitalization). It was designed by Microsoft, for its Internet Explorer browser, in the late 1990s. During this time, the XML file format was very popular in the world of business software, a world where Microsoft has always been at home. In fact, it was so popular that the acronym XML was tacked onto the front of the name of an interface for HTTP, which is in no way tied to XML.

The name isn’t completely nonsensical, though. The interface allows you to parse response documents as XML if you want. Confusing two distinct concepts (making a request and parsing the response) into a single thing is terrible design, of course, but so it goes.

When the XMLHttpRequest interface was added to Internet Explorer, it allowed people to do things with JavaScript that had been very hard before. For example, websites started showing lists of suggestions when the user was typing something into a text field. The script would send the text to the server over HTTP as the user typed. The server, which had some database of possible inputs, would match the database entries against the partial input and send back possible completions to show the user. This was considered spectacular—people were used to waiting for a full page reload for every interaction with a website.

The other significant browser at that time, Mozilla (later Firefox), did not want to be left behind. To allow people to do similarly neat things in its browser, Mozilla copied the interface, including the bogus name. The next generation of browsers followed this example, and today XMLHttpRequest is a de facto standard interface.

Sending a request

To make a simple request, we create a request object with the XMLHttpRequest constructor and call its open and send methods.

var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", false);
req.send(null);
console.log(req.responseText);
// → This is the content of data.txt
The open method configures the request. In this case, we choose to make a GET request for the example/data.txt file. URLs that don’t start with a protocol name (such as http:) are relative, which means that they are interpreted relative to the current document. When they start with a slash (/), they replace the current path, which is the part after the server name. When they do not, the part of the current path up to and including its last slash character is put in front of the relative URL.

After opening the request, we can send it with the send method. The argument to send is the request body. For GET requests, we can pass null. If the third argument to open was false, send will return only after the response to our request was received. We can read the request object’s responseText property to get the response body.

The other information included in the response can also be extracted from this object. The status code is accessible through the status property, and the human-readable status text is accessible through statusText. Headers can be read with getResponseHeader.

var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", false);
req.send(null);
console.log(req.status, req.statusText);
// → 200 OK
console.log(req.getResponseHeader("content-type"));
// → text/plain
Header names are case-insensitive. They are usually written with a capital letter at the start of each word, such as “Content-Type”, but “content-type” and “cOnTeNt-TyPe” refer to the same header.

The browser will automatically add some request headers, such as “Host” and those needed for the server to figure out the size of the body. But you can add your own headers with the setRequestHeader method. This is needed only for advanced uses and requires the cooperation of the server you are talking to—a server is free to ignore headers it does not know how to handle.

Asynchronous Requests

In the examples we saw, the request has finished when the call to send returns. This is convenient because it means properties such as responseText are available immediately. But it does mean that our program is suspended as long as the browser and server are communicating. When the connection is bad, the server is slow, or the file is big, that might take quite a while. Worse, because no event handlers can fire while our program is suspended, the whole document will become unresponsive.

If we pass true as the third argument to open, the request is asynchronous. This means that when we call send, the only thing that happens right away is that the request gets scheduled to be sent. Our program can continue, and the browser will take care of the sending and receiving of data in the background.

But as long as the request is running, we won’t be able to access the response. We need a mechanism that will notify us when the data is available.

For this, we must listen for the "load" event on the request object.

var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", true);
req.addEventListener("load", function() {
  console.log("Done:", req.status);
});
req.send(null);
Just like the use of requestAnimationFrame in Chapter 15, this forces us to use an asynchronous style of programming, wrapping the things that have to be done after the request in a function and arranging for that to be called at the appropriate time. We will come back to this later.

Fetching XML Data

When the resource retrieved by an XMLHttpRequest object is an XML document, the object’s responseXML property will hold a parsed representation of this document. This representation works much like the DOM discussed in Chapter 13, except that it doesn’t have HTML-specific functionality like the style property. The object that responseXML holds corresponds to the document object. Its documentElement property refers to the outer tag of the XML document. In the following document (example/fruit.xml), that would would be the <fruits> tag:

<fruits>
  <fruit name="banana" color="yellow"/>
  <fruit name="lemon" color="yellow"/>
  <fruit name="cherry" color="red"/>
</fruits>
We can retrieve such a file like this:

var req = new XMLHttpRequest();
req.open("GET", "example/fruit.xml", false);
req.send(null);
console.log(req.responseXML.querySelectorAll("fruit").length);
// → 3
XML documents can be used to exchange structured information with the server. Their form—tags nested inside other tags—lends itself well to storing most types of data, or at least better than flat text files. The DOM interface is rather clumsy for extracting information, though, and XML documents tend to be verbose. It is often a better idea to communicate using JSON data, which is easier to read and write, both for programs and for humans.

var req = new XMLHttpRequest();
req.open("GET", "example/fruit.json", false);
req.send(null);
console.log(JSON.parse(req.responseText));
// → {banana: "yellow", lemon: "yellow", cherry: "red"}
HTTP sandboxing

Making HTTP requests in web page scripts once again raises concerns about security. The person who controls the script might not have the same interests as the person on whose computer it is running. More specifically, if I visit themafia.org, I do not want its scripts to be able to make a request to mybank.com, using identifying information from my browser, with instructions to transfer all my money to some random mafia account.

It is possible for websites to protect themselves against such attacks, but that requires effort, and many websites fail to do it. For this reason, browsers protect us by disallowing scripts to make HTTP requests to other domains (names such as themafia.org and mybank.com).

This can be an annoying problem when building systems that want to access several domains for legitimate reasons. Fortunately, servers can include a header like this in their response to explicitly indicate to browsers that it is okay for the request to come from other domains:

Access-Control-Allow-Origin: *
Abstracting requests

In Chapter 10, in our implementation of the AMD module system, we used a hypothetical function called backgroundReadFile. It took a filename and a function and called that function with the contents of the file when it had finished fetching it. Here’s a simple implementation of that function:

function backgroundReadFile(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.addEventListener("load", function() {
    if (req.status < 400)
      callback(req.responseText);
  });
  req.send(null);
}
This simple abstraction makes it easier to use XMLHttpRequest for simple GET requests. If you are writing a program that has to make HTTP requests, it is a good idea to use a helper function so that you don’t end up repeating the ugly XMLHttpRequest pattern all through your code.

The function argument’s name, callback, is a term that is often used to describe functions like this. A callback function is given to other code to provide that code with a way to “call us back” later.

It is not hard to write your HTTP utility function, tailored to what your application is doing. The previous one does only GET requests and doesn’t give us control over the headers or the request body. You could write another variant for POST requests or a more generic one that supports various kinds of requests. Many JavaScript libraries also provide wrappers for XMLHttpRequest.

The main problem with the previous wrapper is its handling of failure. When the request returns a status code that indicates an error (400 and up), it does nothing. This might be okay, in some circumstances, but imagine we put a “loading” indicator on the page to indicate that we are fetching information. If the request fails because the server crashed or the connection is briefly interrupted, the page will just sit there, misleadingly looking like it is doing something. The user will wait for a while, get impatient, and consider the site uselessly flaky.

We should also have an option to be notified when the request fails so that we can take appropriate action. For example, we could remove the “loading” message and inform the user that something went wrong.

Error handling in asynchronous code is even trickier than error handling in synchronous code. Because we often need to defer part of our work, putting it in a callback function, the scope of a try block becomes meaningless. In the following code, the exception will not be caught because the call to backgroundReadFile returns immediately. Control then leaves the try block, and the function it was given won’t be called until later.

try {
  backgroundReadFile("example/data.txt", function(text) {
    if (text != "expected")
      throw new Error("That was unexpected");
  });
} catch (e) {
  console.log("Hello from the catch block");
}
To handle failing requests, we have to allow an additional function to be passed to our wrapper and call that when a request goes wrong. Alternatively, we can use the convention that if the request fails, an additional argument describing the problem is passed to the regular callback function. Here’s an example:

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
We have added a handler for the "error" event, which will be signaled when the request fails entirely. We also call the callback function with an error argument when the request completes with a status code that indicates an error.

Code using getURL must then check whether an error was given and, if it finds one, handle it.

getURL("data/nonsense.txt", function(content, error) {
  if (error != null)
    console.log("Failed to fetch nonsense.txt: " + error);
  else
    console.log("nonsense.txt: " + content);
});
This does not help when it comes to exceptions. When chaining several asynchronous actions together, an exception at any point of the chain will still (unless you wrap each handling function in its own try/catch block) land at the top level and abort your chain of actions.

Promises

For complicated projects, writing asynchronous code in plain callback style is hard to do correctly. It is easy to forget to check for an error or to allow an unexpected exception to cut the program short in a crude way. Additionally, arranging for correct error handling when the error has to flow through multiple callback functions and catch blocks is tedious.

There have been a lot of attempts to solve this with extra abstractions. One of the more successful ones is called promises. Promises wrap an asynchronous action in an object, which can be passed around and told to do certain things when the action finishes or fails. This interface is set to become part of the next version of the JavaScript language but can already be used as a library.

The interface for promises isn’t entirely intuitive, but it is powerful. This chapter will only roughly describe it. You can find a more thorough treatment at www.promisejs.org.

To create a promise object, we call the Promise constructor, giving it a function that initializes the asynchronous action. The constructor calls that function, passing it two arguments, which are themselves functions. The first should be called when the action finishes successfully, and the second should be called when it fails.

Once again, here is our wrapper for GET requests, this time returning a promise. We’ll simply call it get this time.

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
Note that the interface to the function itself is now a lot simpler. You give it a URL, and it returns a promise. That promise acts as a handle to the request’s outcome. It has a then method that you can call with two functions: one to handle success and one to handle failure.

get("example/data.txt").then(function(text) {
  console.log("data.txt: " + text);
}, function(error) {
  console.log("Failed to fetch data.txt: " + error);
});
So far, this is just another way to express the same thing we already expressed. It is only when you need to chain actions together that promises make a significant difference.

Calling then produces a new promise, whose result (the value passed to success handlers) depends on the return value of the first function we passed to then. This function may return another promise to indicate that more asynchronous work is being done. In this case, the promise returned by then itself will wait for the promise returned by the handler function, succeeding or failing with the same value when it is resolved. When the handler function returns a nonpromise value, the promise returned by then immediately succeeds with that value as its result.

This means you can use then to transform the result of a promise. For example, this returns a promise whose result is the content of the given URL, parsed as JSON:

function getJSON(url) {
  return get(url).then(JSON.parse);
}
That last call to then did not specify a failure handler. This is allowed. The error will be passed to the promise returned by then, which is exactly what we want—getJSON does not know what to do when something goes wrong, but hopefully its caller does.

As an example that shows the use of promises, we will build a program that fetches a number of JSON files from the server and, while it is doing that, shows the word loading. The JSON files contain information about people, with links to files that represent other people in properties such as father, mother, or spouse.

We want to get the name of the mother of the spouse of example/bert.json. And if something goes wrong, we want to remove the loading text and show an error message instead. Here is how that might be done with promises:

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
The resulting program is relatively compact and readable. The catch method is similar to then, except that it only expects a failure handler and will pass through the result unmodified in case of success. Much like with the catch clause for the try statement, control will continue as normal after the failure is caught. That way, the final then, which removes the loading message, is always executed, even if something went wrong.

You can think of the promise interface as implementing its own language for asynchronous control flow. The extra method calls and function expressions needed to achieve this make the code look somewhat awkward but not remotely as awkward as it would look if we took care of all the error handling ourselves.

Appreciating HTTP

When building a system that requires communication between a JavaScript program running in the browser (client-side) and a program on a server (server-side), there are several different ways to model this communication.

A commonly used model is that of remote procedure calls. In this model, communication follows the patterns of normal function calls, except that the function is actually running on another machine. Calling it involves making a request to the server that includes the function’s name and arguments. The response to that request contains the returned value.

When thinking in terms of remote procedure calls, HTTP is just a vehicle for communication, and you will most likely write an abstraction layer that hides it entirely.

Another approach is to build your communication around the concept of resources and HTTP methods. Instead of a remote procedure called addUser, you use a PUT request to /users/larry. Instead of encoding that user’s properties in function arguments, you define a document format or use an existing format that represents a user. The body of the PUT request to create a new resource is then simply such a document. A resource is fetched by making a GET request to the resource’s URL (for example /user/larry), which returns the document representing the resource.

This second approach makes it easier to use some of the features that HTTP provides, such as support for caching resources (keeping a copy on the client side). It can also help the coherence of your interface since resources are easier to reason about than a jumble of functions.

Security and HTTPS

Data traveling over the Internet tends to follow a long, dangerous road. To get to its destination, it must hop through anything from coffee-shop wifi networks to networks controlled by various companies and states. At any point along its route it may be inspected or even modified.

If it is important that something remain secret, such as the password to your email account, or that it arrive at its destination unmodified, such as the account number you transfer money to from your bank’s website, plain HTTP is not good enough.

The secure HTTP protocol, whose URLs start with https://, wraps HTTP traffic in a way that makes it harder to read and tamper with. First, the client verifies that the server is who it claims to be by requiring that server to prove that it has a cryptographic certificate issued by a certificate authority that the browser recognizes. Next, all data going over the connection is encrypted in a way that should prevent eavesdropping and tampering.

Thus, when it works right, HTTPS prevents both the situation where someone impersonates the website you were trying to talk to and the situation where someone is snooping on your communication. It is not perfect, and there have been various incidents where HTTPS failed because of forged or stolen certificates and broken software. Still, plain HTTP is trivial to mess with, whereas breaking HTTPS requires the kind of effort that only states or sophisticated criminal organizations can hope to make.

Summary

In this chapter, we saw that HTTP is a protocol for accessing resources over the Internet. A client sends a request, which contains a method (usually GET) and a path that identifies a resource. The server then decides what to do with the request and responds with a status code and a response body. Both requests and responses may contain headers, providing additional information.

Browsers make GET requests to fetch the resources needed to display a web page. A web page may also contain forms, which allow information entered by the user to be sent along in the request made when the form is submitted. You will learn more about that in the next chapter.

The interface through which browser JavaScript can make HTTP requests is called XMLHttpRequest. You can usually ignore the “XML” part of that name (but you still have to type it). There are two ways in which it can be used—synchronous, which blocks everything until the request finishes, and asynchronous, which requires an event handler to notice that the response came in. In almost all cases, asynchronous is preferable. Making a request looks like this:

var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", true);
req.addEventListener("load", function() {
  console.log(req.statusCode);
});
req.send(null);
Asynchronous programming is tricky. Promises are an interface that makes it slightly easier by helping route error conditions and exceptions to the right handler and abstracting away some of the more repetitive and error-prone elements in this style of programming.

Exercises

Content negotiation

One of the things that HTTP can do but that we have not discussed in this chapter yet is called content negotiation. The Accept header for a request can be used to tell the server what type of document the client would like to get. Many servers ignore this header, but when a server knows of various ways to encode a resource, it can look at this header and send the one that the client prefers.

The URL eloquentjavascript.net/author is configured to respond with either plain text, HTML, or JSON, depending on what the client asks for. These formats are identified by the standardized media types text/plain, text/html, and application/json.

Send requests to fetch all three formats of this resource. Use the setRequestHeader method of your XMLHttpRequest object to set the header named Accept to one of the media types given earlier. Make sure you set the header after calling open but before calling send.

Finally, try asking for the media type application/rainbows+unicorns and see what happens.

// Your code here.
Waiting for multiple promises

The Promise constructor has an all method that, given an array of promises, returns a promise that waits for all of the promises in the array to finish. It then succeeds, yielding an array of result values. If any of the promises in the array fail, the promise returned by all fails too (with the failure value from the failing promise).

Try to implement something like this yourself as a regular function called all.

Note that after a promise is resolved (has succeeded or failed), it can’t succeed or fail again, and further calls to the functions that resolve it are ignored. This can simplify the way you handle failure of your promise.

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
The function passed to the Promise constructor will have to call then on each of the promises in the given array. When one of them succeeds, two things need to happen. The resulting value needs to be stored in the correct position of a result array, and we must check whether this was the last pending promise and finish our own promise if it was.

The latter can be done with a counter, which is initialized to the length of the input array and from which we subtract 1 every time a promise succeeds. When it reaches 0, we are done. Make sure you take the situation where the input array is empty (and thus no promise will ever resolve) into account.

Handling failure requires some thought but turns out to be extremely simple. Just pass the failure function of the wrapping promise to each of the promises in the array so that a failure in one of them triggers the failure of the whole wrapper.
