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

A interface através da qual o Javascript pode fazer requisições HTTP é chamada <i>XMLHttpRequest</i> (note a capitalização inconsistente). Ela foi elaborada pela Microsoft, para seu browser Internet Explorer, no final da decada de 90. Naquele tempo, o formato de arquivo XML era muito popular no mundo de softwares corporativos, um mundo no qual a Microsoft se sentia em casa. De fato, tal formato era tão popular que o acrônimo XML foi acrescentado no inicio do nome de uma interface para HTTP, a qual não tinha nenhuma relação com o XMh

O nome não é completamente sem sentido, porém. A interface permite você analisar documentos de resposta como XML, caso queira. Misturar dois conceitos distintos (fazer a requisição e analizar a resposta) em uma unica coisa é uma terrível abordagem, naturalmente, mas aceitável.

Quando a interface <i>XMLHttpRequest</i> foi adicionada ao Internet Explorer, foi permitido às pessoas fazerem coisas com Javascript que eram bem complicadas anteriormente. Por exemplo, websites comecaram a mostrar lista de sugestões enquanto o usuário digitava algo em um campo de texto. O Script mandaria o texto para o servidor através de HTTP enquanto o usuário digitava. O servidor, que possuia um banco de dados com possiveis entradas, compararia as entradas do banco com as entradas parciais digitadas e enviaria de volta possiveis combinacoes para mostrar ao usuário. Isso era considerado espetacular - pessoas estavam acostumadas a aguardar por um completo carregamento de pagina para cada interação com o website.

O outro browser significante daquela epoca, Mozilla (depois Firefox), não queria ser deixado para trás. Para permitir aos usuários fazer tarefas de forma similar em seu browser, Mozilla copiou a interface, incluindo o controverso nome. A proxima geracao de browsers seguiu este exemplo, e atualmente <i>XMLHttpRequest</i> e a interface padrão <i>de facto</i>.

Enviando uma requisição

Para fazer uma simples requisição, criamos um objeto de requisição com o construtor <i>XMLHttpRequest</i> e chamamos seus métodos open e send.

```js
var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", false);
req.send(null);
console.log(req.responseText);// → Esse é o conteudo de data.txt
```

O método open configura a requisição. Neste caso, nós escolhemos fazer uma requisição GET para o arquivo example/data.txt. URLs que não começam com um nome de protocolo (como http:) são relativos, o que significa que elas são interpretados relativamente ao documento corrente. Quando as URLs começam com uma barra (/), elas substituem o caminho corrente, que e a parte depois do nome do servidor. Quando não, a parte anterior ao caminho corrente e incluindo sua última barra são colocados em frente à URL relativa.

Após abrir a requisição, pode-se mandar ela com o método send. O argumento para o envio é o corpo do request. Para requisições GET, pode-se passar null. Se o terceiro argumento para o open foi falso, o método send irá retornar apenas após a resposta de nossa requisição ser recebida. Podemos ler a propriedade responseText do objeto request para compreender o corpo da resposta.

A outra informação incluída na resposta pode também ser extraída deste objeto. O código de status é acessível através da propriedade status, e o texto legível é acessível através da propriedade statusText. Cabeçalhos podem ser lidos com getResponseHeader.

```js
var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", false);
req.send(null);
console.log(req.status, req.statusText);
// → 200 OK
console.log(req.getResponseHeader("content-type"));
// → text/plain
```

O browser irá automaticamente adicionar alguns cabeçalhos do request como "Host" e aqueles necessários para o servidor descobrir o tamanho do corpo. Mas você pode adicionar seus próprios cabeçalhos com o método setRequestHeader. Isto é necessário apenas para usos avançados e requer a cooperação do servidor o qual você está comunicando - Um servidor é livre para ignorar cabeçalhos que ele não saiba manusear.

Requisições Assíncronas

Nos exemplos que nós vimos, a requisição finaliza quando a chamada ao método send retorna. Isto é conveniente pois significa que propriedades como responseText são disponibilizadas imediatamente. Mas também significa que nosso programa é suspenso enquanto o browser e o servidor estão comunicando. Quando a conexão é ruim, o servidor lento ou o arquivo é muito grande, o processo pode demorar um bom tempo. Em um cenário pior, como nenhum manipulador de evento pode ser disparado enquanto nosso programa está suspenso, todo o documento ficará irresponsível.

Se passarmos true como terceiro argumento para o método open, a requisição é assíncrona. Isto significa que podemos chamar o método send, a única coisa que acontece imediatamente é que a requisição fica agendada para ser enviada. Nosso programa pode continuar e o browser cuidará do envio e do recebimento dos dados em segundo plano.

Mas enquanto a requisição está sendo executada, nós não podemos acessar a resposta. É necessário um mecanismo que notifique o usuário quando os dados estiverem disponíveis.

Para isso, precisamos ouvir o evento "load" na requisição do objeto.

```js
var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", true);
req.addEventListener("load", function() {
  console.log("Done:", req.status);
});
req.send(null);
```

Assim como o uso do <i>requestAnimationFrame</i> no Capítulo 15, isto força a utilização de um estilo assíncrono de programação, encapsulando as coisas que precisam ser feitas após a requisição em uma função e preparando para que ela seja chamada no momento apropriado. Nós voltaremos nesse assunto posteriormente.

Recuperando Dados XML

Quando o recurso recuperado por um objeto <i>XMLHttpRequest</i> é um documento XML, a propriedade responseXML do objeto terá uma representação recuperada deste documento XML. Esta representação funciona de forma parecida ao DOM discutido no Capitulo 13, exceto que a representação não possui funcionalidades específicas de HTML como a propriedade style. O objeto que responseXML se referencia corresponde ao objeto documento. Sua propriedade documentElement se refere a tag externa do documento XML. No seguinte documento (example/fruit.xml), tal propriedade seria a tag <fruit>:

<fruits>
  <fruit name="banana" color="yellow"/>
  <fruit name="lemon" color="yellow"/>
  <fruit name="cherry" color="red"/>
</fruits>
Podemos recuperar tal arquivo da seguinte forma:

```js
var req = new XMLHttpRequest();
req.open("GET", "example/fruit.xml", false);
req.send(null);
console.log(req.responseXML.querySelectorAll("fruit").length);
// → 3
```
Documentos XML podem ser usados para trocar informação estruturada com o servidor. Suas tags-formulário aninhadas dentro de outras tags específicas capaz de armazenar a maioria dos tipos de dados, ou ao menos melhor que em arquivos de texto puro. A interface DOM é um pouco trabalhosa para extrair informação e, documentos XML tendem a ser verbosos. Normalmente é uma idéia melhor comunicar usando dados JSON, o qual é muito mais fácil de ler e escrever, tanto para programas quanto para humanos. 

```js
var req = new XMLHttpRequest();
req.open("GET", "example/fruit.json", false);
req.send(null);
console.log(JSON.parse(req.responseText));
// → {banana: "yellow", lemon: "yellow", cherry: "red"}
```

HTTP <i>sandboxing</i>
Executar requisições HTTP através de scripts em uma página web levanta mais uma vez questões sobre segurança. A pessoa que controla o script pode não ter os mesmos interesses que a pessoa do computador o qual o script está executando. Mais especificamente, se eu visitar themafia.org, eu não quero que seus scripts façam uma requisição para mybank.com, utilizando informações de identificação do browser, com instruções para transferir todo meu dinheiro para alguma conta da máfia.

É possível para websites se protegerem eles mesmos contra tais ataques, mas isso requer esforço, e muitos websites falham neste ponto. Por esta razão, browsers protegem o usuário desabilitando scripts de fazerem requisições HTTP para outro domínio (nomes como themafia.org e mybank.com).

Isto pode ser um problema irritante quando criando sistemas que querem acessar vários domínios por razões legitimas. Felizmente, servidores podem incluir um cabeçalho como esse em sua resposta para explicitamente indicar aos browsers que é permitido requisições de outro domínio:

Access-Control-Allow-Origin: *

Abstraindo Requisições

No Capítulo 10, em nossa implementação do módulo AMD, nós usamos uma função hipotética chamada <i>backgroundReadFile</i>. Ela recebeu um caminho de arquivo e uma função e chamou esta função com o conteúdo do arquivo quando ele acabou de ser recuperado. Aqui um exemplo de uma implementação desta função:

```js
function backgroundReadFile(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.addEventListener("load", function() {
    if (req.status < 400)
      callback(req.responseText);
  });
  req.send(null);
}
```

Essa simples abstração torna mais fácil usar <i>XMLHttpRequest</i> para simples requisições GET. Se você está escrevendo um programa que precisa fazer requisições HTTP, é uma boa idéia usar uma função helper para que você não acabe repetindo o esquisito padrão <i>XMLHttpRequest</i> por todo o código.

O nome da função argumento, <i>callback</i>, é um termo normalmente usado para descrever funções como essa. Uma função <i>callback</i> é fornecida a outro código para prover a este código uma forma de "ser chamado" mais tarde.

Não é difícil escrever sua função de utilidades HTTP, adaptada a o que sua aplicação está fazendo. A função anterior apenas faz requisições GET e não nos dá controle sobre os cabeçalhos ou o corpo da requisição. Você pode escrever outra variação da função para requisições POST ou uma mais genérica que suporta vários tipos de requisição. Muitas bibliotecas Javascript também fornecem funções <i>wrappers</i> para <i>XMLHttpRequest</i>.

O principal problema com a função <i>wrapper</i> anterior é sua manipulação de falhas. Quando a requisição retorna um código de status que indica um erro (400 para cima), a função não faz nada. Isso pode ser admitido, em algumas circunstâncias, mas imagine nós colocarmos um indicador de "carregando" na página para demonstrar que estamos recuperando informação. Se a requisição falhar por causa de queda do servidor ou a conexão ser interrompida, a página simplesmente permanecerá em seu estado, demonstrando de forma errada como se estivesse executando algo. O usuário irá esperar por algum instante, ficar impaciente, e por fim considerar o site problemático.

Nós também devemos ter uma opção de ser notificado quando a requisição falhar para que possamos tomar uma ação apropriada. Por exemplo, podemos remover a mensagem "carregando" e informar ao usuário que algo errado aconteceu.

Manusear erro em código assíncrono é ainda mais traiçoeiro que manusear erro em código síncrono. O motivo é que 
normalmente temos que procrastinar parte de nosso trabalho o colocando em uma função <i>callback</i>, o escopo de um bloco try se torna sem sentido. No seguinte código, a exceção não será pega porque a chamada para backgroundReadFile retorna imediatamente. O controle então deixa o bloco <i>try</i>, e a função que foi determinada não será chamada até mais tarde.

```js
try {
  backgroundReadFile("example/data.txt", function(text) {
    if (text != "expected")
      throw new Error("That was unexpected");
  });
} catch (e) {
  console.log("Hello from the catch block");
}
```

Para manusear requisições que falharam, temos que permitir uma função adicional para ser passada para nosso <i>wrapper</i>
e o chamar quando a requisição falhar. Alternativamente, podemos usar a convenção de que caso a requisição falhe, um argumento adicional descrevendo o problema é passado à chamada regular da função <i>callback</i>. Segue um exemplo:

```js
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
```

Nós adicionamos uma função manipuladora para o evento "error", o qual será sinalizado quando a requisição falhar por completo. Nós também chamamos a função de <i>callback </i> com um argumento de erro quando a requisição completa com um código de status que indica um erro.

O código usando getURL deve então checar se um erro aconteceu e, caso encontre um, tratá-lo.

getURL("data/nonsense.txt", function(content, error) {
  if (error != null)
    console.log("Failed to fetch nonsense.txt: " + error);
  else
    console.log("nonsense.txt: " + content);
});

Isto não funciona quando se trata de exceções. Ao encadear várias ações assíncronas, uma exceção em qualquer ponto da cadeia permanecerá (ao menos que você encapsule cada função de tratamento em seu próprio bloco try/catch) no topo da cadeia e abortará a sequencia de ações.

Promises

Para projetos complexos, escrever código assíncrono no tradicional estilo de <i>callbacks</i> é difícil de ser feito corretamente. É fácil de esquecer a checagem de um erro ou permitir uma exceção não esperada para encerrar o programa de forma abrupta. Além disso, alterações para corrigir tratamento de erros precisam fluir através de múltiplas funções <i>callbacks</i> e blocos <i>catch</i> são tediosos de se criar.

Várias tentativas de solucionar esse problema têm sido feitas com abstrações extras. Uma das mais bem sucedidas é chamada de <i>promises</i>. <i>Promises</i> encapsulam uma ação assíncrona em um objeto, que pode ser passado e instruído a fazer algo quando a ação finalizar ou falhar. Essa interface está definida para ser parte da próxima versão da linguagem Javascript mas já pode ser usada em forma de biblioteca.

A interface de <i>promises</i> não pode ser chamada de intuitiva, mas ela é poderosa. Esse capítulo irá apenas brevemente o descrever. Você pode encontrar uma documentação mais minunciosa em www.promisejs.org.

Para criar um objeto <i>promise</i>, nós chamamos um construtor <i>Promise</i>, passando uma função que inicia a ação assíncrona. O construtor chama esta função, passando dois argumentos, os quais são tambem funções. A primeira deve ser chamada quando a ação terminar com sucesso, e a segunda quando ela falhar.

Mais uma vez, segue nosso <i>wrapper</i> para requisições GET, dessa vez retornando uma <i>promise</i>. Nos simplesmente a chamaremos de <i>get</i> desta vez.

```js
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
```

Note que a interface da função em si é agora bem mais simples. Você passa uma URL, e ela retorna uma <i>promise</i>. Essa <i>promise</i> age como um manipulador. Ela agora tem um método <i>then</i> que pode ser chamado com duas funções: uma para o caso de sucesso e outra para o caso de falha.

```js
get("example/data.txt").then(function(text) {
  console.log("data.txt: " + text);
}, function(error) {
  console.log("Failed to fetch data.txt: " + error);
});
```

No entanto, essa é apenas outra forma de expressar a mesma coisa que já haviamos expressado. E apenas quando você precisa encadear ações juntas que as <i>promises</i> fazem uma diferenca significante.

A chamada ao método <i>then</i> produz uma nova <i>promise</i>, a qual o resultado (o valor passado para o manipulador em caso de sucesso) depende do valor de retorno da primeira função que passamos para o <i>then</i>. Essa função pode retornar outra <i>promise</i> para indicar que mais tarefas assincronas estão sendo executadas. Neste caso, a própria<i>promise</i> retornado pelo <i>then</i> IRA esperar pela <i>promise</i> retornada pela função manipuladora, obtendo sucesso ou falhando com o mesmo valor quando for resolvida. Quando a função manipuladora retornar um valor que não seja uma <i>promise</i>, a <i>promise</i> retornada pelo <i>then</i> imediatamente retorna com sucesso com tal valor como seu resultado.

Isso significa que você pode usar <i>then</i> para transformar o resultado de uma <i>promise</i>. Por exemplo, o codigo a seguir retorna uma <i>promise</i> a qual o resultado é o conteudo de uma dada URL, montado como JSON:

```js
function getJSON(url) {
  return get(url).then(JSON.parse);
}
```

A última chamada ao <i>then</i> não especificou um manipulador de falhas. Isso é permitido. O erro sera passado para a <i>promise</i> retornada pelo <i>then</i>, a qual é exatamente o que nós queremos - <i>getJSON</i> não sabe o que fazer quando algo acontece errado, mas provavelmente seu chamador sabe.

Como um exemplo que demonstra o uso de <i>promises</i>, nós iremos construir um programa que carrega um numero de arquivos JSON do servidor e, enquanto isso é feito, mostra o carregamento de palavras. Os arquivos JSON contem informações sobre pessoas, com links para arquivos que representam outras pessoas em propriedades como pai, mãe ou esposa.

Nós queremos recuperar o nome da mãe da esposa de example/bert.json. E caso algo errado ocorra, nós queremos remover o texto de carregamento e mostrar uma mensagem de erro no lugar. Segue um exemplo de como isso é feito com <i>promises</i>:

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
O programa acima é relativamente compacto e legivel. O método <i>catch</i> é similar ao <i>then</i>, exceto que ele apenas espera um manipulador de falha e entao passa pelo resultado não modificado em caso de sucesso. Assim como a clausula <i>catch</i> para uma bloco <i>try</i>, o controle seguirá seu fluxo normal após a falha ser capturada. Desta forma, o derradeiro <i>then</i>, o qual remove a mensagem de carregamento, será sempre executado, mesmo que algum erro ocorra.

Você pode pensar na interface de <i>promise</i> como uma implementacao de sua própria linguagem para controle de fluxo assincrono. As chamadas extras de métodos e funções de expressão necessarias para atingir a tarefa fazem o codigo parecer meio esquisito mas não mais esquisito se fosse necessario tratar todas excecoes na forma tradicional.

Apreciando o HTTP

Ao construir um sistema que requer comunicação entre um Javascript rodando no browser (lado cliente) e um programa em um servidor (lado servidor), existem varias maneiras diferentes de modelar essa comunicação.

Um modelo comumente usado é o de chamadas de procedimentos remotos. Neste modelo, a comunicação segue o padrão de chamadas normais de função, exceto pelo fato de que a função esta sendo executada em outra máquina. Esta chamada envolve a execução de uma requisão para o servidor que inclui o nome da função e seus argumentos. A resposta para essa requisição contém o valor retornado.

Ao pensar em termos de chamadas de procedimentos remotos, HTTP é apenas o veículo da comunicação, e você provavelmente escreverá uma camada de abstração que o esconda completamente.

Outra abordagem é estruturar sua comunicação em torno do conceito de recursos e métodos HTTP. Ao invés de um procedimento remoto chamado <i>addUser</i>, utilizar uma requisição PUT para /users/larry. Ao invés de codificar tais propriedades do usuário nos argumentos da função, você define um formato de documento ou usa um formato existente que represente um usuário. O corpo da requisição PUT para criar um novo recurso é, em seguida, simplesmente como um documento. Um recurso é preenchido por requisições GET à URL do recurso (por exemplo /user/larry), o qual retorna o documento que representa o recurso.

Esta segunda abordagem torna mais fácil utilizar os recursos providos pelo HTTP, como suporte para recursos de <i>caching</i> (mantendo uma cópia no lado do cliente). Isso também ajuda na coerência de sua interface uma vez que recursos são mais fáceis de serem compreendidos que um punhado de funções.

Segurança e HTTPS

Envio de dados pela Internet tendem a seguir uma longa, perigosa estrada. Para chegar ao seu destino, a informação pode viajar por variados ambientes desde redes wifi de cafeterias até redes controladas por várias empresas e estados. Em qualquer ponto, a informação pode ser inspecionada ou até modificada.

Se for importante que algo se mantenha secreto, como a senha de sua conta de email, ou que chegue ao seu destino de forma inalterada, como o número da conta que você irá transferir dinheiro através do site de seu banco, o simples protocolo HTTP não é bom o suficiente.

O protocolo HTTP seguro, o qual as URLS começam com https://, encapsula o tráfego HTTP de forma que dificulta sua leitura e alteração. Primeiramente, o cliente verifica se o servidor é quem ele diz ser solicitando que o servidor prove que possui um certificado criptografico concedido por uma autoridade certificadora que o browser reconheça. Posteriormente, toda informação a ser trafegada pela conexão é criptografada de forma que ela seja protegida de espionagem e violação.

Desta forma, quando funciona corretamente, HTTPS previne ambas situações onde alguem se passa pelo website que você estava tentando se comunicar e quando alguem está vigiando sua comunicação. O protocolo não é perfeito, e vários incidentes foram causados onde o HTTPS falhou por causa de certificado forjado ou roubado e software corrompido. Mesmo assim, HTTP simples é fácil de ser burlado enquanto que burlar HTTPS requer um certo esforço que apenas grandes entidades como empresas governamentais ou sofisticadas organizações criminosas estão dispostas a gastar.

Sumário

Neste capítulo nós vimos que o HTTP é um protocolo para acessar recursos através da Internet. Um cliente envia uma requisição, a qual contém um método (normalmente GET) e um caminho que identifica um recurso. O servidor então decide o que fazer com a requisição e responde com um código de status e um corpo de resposta. Ambos requisição e resposta podem conter cabeçalhos, provendo informação adicional.

Browsers fazem requisições GET para recuperar o recurso necessário para montar uma página. Uma página pode conter formulários, o que permite que informações inseridas pelo usuário sejam enviadas juntas com a requisição quando o formulário é submetido. Você aprenderá mais sobre este assunto no próximo capítulo.

A interface na qual o Javascript do browser pode fazer requisições HTTP é chamado <i>XMLHttpRequest</i>. Você pode ignorar o "XML" do nome (mas mesmo assim precisa digitá-lo). Existem duas formas nas quais ele pode ser usado - síncrono, onde o processo bloqueia tudo até que a requisição termine, e assíncrono, o qual requer um manuseador de evento para avisar que a resposta chegou. Em quase todos os casos, assíncrono é preferido. Fazer uma requisição é algo parecido com o código a seguir:

```js
var req = new XMLHttpRequest();
req.open("GET", "example/data.txt", true);
req.addEventListener("load", function() {
  console.log(req.statusCode);
});
req.send(null);
```

Programação assíncrona é traiçoeira. <i>Promises</i> são interfaces que tornam a programação assíncrona mais fácil ajudando 
a rotear condições de erro e exceções para o manuseador correto e abstraindo alguns elementos repetitivos e tendentes a erro neste estilo de programação.

Exercícios

Negociação de conteúdo

Uma das coisas que HTTP pode fazer mas que não discutimos neste capítulo ainda é chamada negociação de conteúdo. O cabeçalho <i>Accept</i> de uma requisição pode ser usado para dizer ao servidor que tipo de documento o cliente gostaria de receber. Muitos servidores ignoram este cabeçalho, mas quando um servidor sabe de várias maneiras como codificar um recurso, ele pode olhar este cabeçalho e enviar aquele que o cliente prefere.

A URL eloquentjavascript.net/author é configurada para responder tanto como texto plano, HTML ou JSON, dependendo de como o cliente solicita. Estes formatos são identificados pelos tipos de mídia padronizados text/plain, text/html e application/json.

Envie requisições para recuperar os tres formatos deste recurso. Use o método <i>setRequestHeader</i> de seu objeto <i>XMLHttpRequest</i> para definir o valor do cabeçalho chamado <i>Accept</i> para um dos tipos de mídia fornecidos anteriormente. Certifique-se de definir o valor do cabeçalho após chamar o método <i>open</i> mas antes de chamar o método <i>send</i>.

Por último, tente recuperar o tipo de mídia application/rainbows+unicorns e veja o que acontece.

// Seu código aqui

Para trabalhar com múltiplos promises utilizamos um método chamado <i>all</i> que, dado um array de <i>promises</i>, retorna uma <i>promise</i> que espera por todos os <i>promises</i> do array acabarem. Se obtiver sucesso, resultará em um array com os valores resultantes. Se qualquer das <i>promises</i> do array falhar, a <i>promise</i> retornada pelo <i>all</i> falhará também (com o valor de falha da <i>promise</i> que falhou).

Tente implementar algo assim por sua conta com uma função chamada <i>all</i>.

Observe que após um <i>promise</i> ser resolvida (tendo sucesso ou mesmo falhado), ela pode ter sucesso ou falhar de novo, e outras chamadas para as funções que resolvem isso são ignoradas. Isto pode simplificar a maneira que você manuseia falhas em sua <i>promise</i>.

```js
function all(promises) {
  return new Promise(function(success, fail) {
    // Your code here.
  });
}

// Testar código
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
```

Dicas

A função passada ao construtor <i>Promise</i> terá que chamar <i>then</i> em cada dos <i>promises</i> do array dado. Quando um deles obtêm sucesso, duas coisas precisam acontecer: O valor resultante precisa ser armazenado na posição correta de um array resultante, e devemos checar se este foi o ultimo <i>promise</i> pendente e terminar nossa própria <i>promise</i> caso tenha sido.

O último pode ser resolvido com um contador, o qual é iniciado com a largura do array de entrada do qual nos subtraimos 1 toda vez que um <i>promise</i> obtem sucesso. Quando o contador atingir 0, encerramos. Garanta que o array de entrada esteja vazio (e portanto, nenhuma <i>promise</i> jamais irá resolver) em conta.

Manusear falhas requer alguns esforços mas se torna extremamente simples. Apenas passe a função de falha para o <i>promise</i> responsável por encapsular aos <i>promises</i> do array de forma que uma falha em um deles dispare a falha para o <i>promise</i> encapsulador.
