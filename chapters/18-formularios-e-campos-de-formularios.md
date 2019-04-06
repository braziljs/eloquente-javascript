### Capítulo 18

# Formulários e Campos de Formulários

> Em inglês: 

>"I shall this very day, at Doctor’s feast,My bounden service duly pay thee.But one thing! — For insurance’ sake, I pray thee,Grant me a line or two, at least.Mephistopheles, in Goethe's Faust"

> — Mephistopheles, in Goethe's Faust

# Formulários e Campos de Formulário

Formulários foram  introduzidos brevemente no [capítulo anterior](./17-http.md) como uma forma de apresentar informações 
fornecidas pelo usuário através do HTTP. Eles foram projetados para uma web pré-javaScript, atribuindo essa interação  com o servidor sempre fazendo a navegação para uma nova página.

Mas  os seus elementos  são  parte do DOM como o resto da página, e os elementos DOM representam campos 
de formulários suportados um número de propriedades e eventos que não são presente em outros elementos. Esses tornam possíveis para inspecionar e controlar os campos _inputs_ com programas JavaScript e fazem coisas como adicionar funcionalidades para um formulário tradicional ou usam formulários e campos  como  blocos de construção  em aplicações JavaScript.

## Campos

Um formulário web consiste em qualquer número de campos `input` agrupados em uma tag `<form>`. O HTML permite que um número de diferentes estilos de campos, que vão desde simples on/off checkboxes para drop-down menus e campos de texto. Este livro não vai tentar discutir de forma abrangente todos os tipos de campos, mas nós podemos iniciar com a visão geral.

Muitos tipos de campos usam a tag `<input>`. Essa tag é um tipo de atributo usado para estilos do campo. Estes são alguns tipos de `<input>` comumente usados:

|||
|:--|:--|
| **text** | Um campo de texto em uma única linha |
| **password** | O mesmo que o campo de texto, mas esconde o texto que é digitado |
| **checkbox** | Um modificador on/off |
| **radio** | Campo de múltipla escolha |
| **file** | Permite que o usuário escolha um arquivo de seu computador |

Os campos de formulários não aparecem necessariamente em uma tag `<form>`. Você pode colocá-los em qualquer lugar. Esses campos não podem ser apresentados (somente em um formulário como um todo), mas ao retornar para o _input_ com JavaScript, muitas vezes não querem submeter campos de qualquer maneira.

```html
  <p><input type="text" value="abc">(text)</p>
  <p><input type="password" value="abc">(password)</p>
  <p><input type="checkbox" checked>(checkbox)</p>
  <p><input type="radio" value="A" name="choice">
     <input type="radio" value="B" name="choice" checked>
     <input type="radio" value="C" name="choice">(radio)</p>
  <p><input type="file" checked> (file)</p>
```
A interface JavaScript de tais elementos se diferem com o tipo dos elementos. Nós vamos passar por cima de cada um deles no final do capítulo.

Campos de texto de várias linhas têm a sua própria tag `<textarea>`, principalmente porque quando é usando um atributo para especificar um valor de várias linhas poderia ser inicialmente estranho. A tag `<textarea>` requer um texto que é usado entre as duas tags `</textarea>`, ao invés de utilizar o texto no atributo value.

```html
<textarea>
   um
   dois
   três
</textarea>
```
Sempre que o valor de um campo de formulário é modificado, ele dispara um evento "change".

## Focus

Diferentemente da maioria dos elementos em um documento HTML, campos de formulário podem obter o foco do teclado. Quando clicado, ou ativado de alguma outra forma, eles se tornam o elemento ativo no momento, o principal  destinatário de entrada do teclado.

Se o documento tem um campo de texto, o campo é focado quando texto é digitado. Outros campos respondem diferente ao evento de teclado. Por exemplo, um menu `<select>` vai para uma opção que contém o texto que o usuário digitou e responde às teclas de seta, movendo sua seleção para cima e para baixo.

Podemos controlar focus do JavaScript com os métodos _focus_ e _blur_. O primeiro modifica o foco do elemento que é chamado no DOM, e do segundo remove o focus. O valor no `document.activeElement` corresponde atualmente ao elemento focado.

```html
<input type="text">
```
```javascript
  document.querySelector("input").focus();
  console.log(document.activeElement.tagName);
  // → INPUT
  document.querySelector("input").blur();
  console.log(document.activeElement.tagName);
  // → BODY
```
Para algumas páginas, espera-se que o usuário interaja com um campo de formulário imediatamente. JavaScript pode ser usado para ser dá um focus nesse campo quando o documento é carregado, mas o HTML também fornece o atributo  `autofocus`, que faz o mesmo efeito, mas permite  que o navegador saiba o que estamos tentando realizar. Isso faz com que seja possível o navegador desativar o comportamento quando não é o caso, por exemplo, quando o usuário tem focado em outra coisa.

```html
<input type="text" autofocus>
```
Navegadores tradicionais também permitem que  o usuário mova o foco através do documento pressionando a tecla [Tab]. Nós podemos influenciar a ordem na qual os elementos recebem o focus com o atributo `tabindex`. Seguindo o exemplo do documento vai pular o foco do input text para o botão OK em vez de passar em primeiro pelo link de help.

```html
<input type="text" tabindex=1> <a href=".">(help)</a>
<button onclick="console.log('ok')" tabindex=2>OK</button>
```
Por padrão, a maioria dos tipos de elementos HTML não podem ser focado. Mas você pode adicionar um atributo `tabindex` a qualquer elemento, o que tornará focalizável.

## Campos desativados

Todos o campos dos formulários podem ser desabilitados por meio do seu atributo `disabled`, que também existe como uma propriedade no elemento do objeto DOM.

```html
  <button>I'm all right</button>
  <button disabled>I'm out</button>
```
Campos desabilitados não podem ser focalizados ou alterados, e  ao contrário de campos ativos, eles ficam cinza e desbotado. 

Quando um programa está sendo processado quando uma ação causada por algum botão ou outro controle, que poderia requerer comunicação com o servidor e assim levar um tempo, pode ser uma boa ideia para desabilitar o controle até que a ação termine. Dessa forma, quando o usuário fica impaciente e clica novamente, eles não vão acidentalmente repetir a sua ação.

## Formulários Como um Todo

Quando o campo é contido em um elemento `<form>`, elemento DOM deve estar em uma propriedade `<form>` que faz a ligação por trás do fomulário com o elemento DOM. O elemento `<form>`, tem uma propriedade chamada _elements_ que contém uma coleção de array-like dos campos internos dentro dele.

O atributo `name` de um campo de formulário determina como seu valor será identificado quando o formulário é enviado. Ele também pode ser usado como um nome de propriedade quando acessar _elements_ de propriedades do formulário, que atua tanto como um objeto array-like (acessível pelo número) e um map (acessível pelo nome).

```html
  <form action="example/submit.html">
    Name: <input type="text" name="name"><br>
    Password: <input type="password" name="password"><br>
    <button type="submit">Log in</button>
  </form>
```  

```javascript  
var form = document.querySelector("form");
console.log(form.elements[1].type);
// → password
console.log(form.elements.password.type);
// → password
 console.log(form.elements.name.form == form);
// → true
```
Um botão com um atributo type do submit, quando pressionado, faz com que o formulário seja enviado. Pressionando Enter quando um campo de formulário é focado tem alguns efeitos.

O envio de um formulário normalmente significa que o navegador navega para a página indicada pelo atributo `action`, utilizando uma requisição _GET_ ou _POST_. Mas Antes que isso aconteça, um evento "submit" é disparado. Esse evento pode ser manipulado pelo JavaScript, e o manipulador pode impedir o comportamento padrão chamando 
`preventDefault` no objeto evento.

```html
<form action="example/submit.html">
  Value: <input type="text" name="value">
  <button type="submit">Save</button>
</form>
```

```javascript
  var form = document.querySelector("form");
  form.addEventListener("submit", function(event) {
    console.log("Saving value", form.elements.value.value);
    event.preventDefault();
  });
```
Interceptar eventos _submit_ em JavaScript tem vários usos. Podemos escrever código para verificar se o valores que o usuário digitou faz sentido imediatamente mostrar uma mensagem de erro, em vez de enviar o formulário. Ou nós podemos desabilitar o modo regular de enviar o formulário por completo, como no exemplo anterior, temos o nosso programa que manipula o `input`, possivelmente usando _XMLHttRequest_ para enviá-lo para um servidor sem recarregar a página.

## Campos de Texto

Campos criados pela tag `<input>` com um tipo de text ou password, bem como uma tag `textarea`, compartilha uma interface comum. Seus elementos DOM tem uma propriedade de valor que mantém o seu conteúdo atual como um valor de string. A definição dessa propriedade para outra sequência altera o conteúdo dos campos.

As propriedades `selectionEnd e `selectionEnd` de campos de texto nos dão informações sobre o curso e seleção do texto. Quando não temos nada selecionado, estas duas propriedades tem o mesmo número o que indica a posição do cursor. Por exemplo, 0 indica o início do texto, e 10 indica o curso está após o décimo caractere. Quando uma parte do campo é selecionada as duas propriedades serão diferentes, nos dando o final e inicio do texto selecionado. Essas propriedades também podem ser gravadas como valores.


Como exemplo, imagine que você está escrevendo um artigo sobre Khasekhemwy, mas tem alguns problemas para soletrar o seu nome. As seguintes linhas de código até a tag `<textarea>`  com um manipulador de eventos que, quando você pressionar F2, a string "Khasekhemwy" é inserida para você. 

`< textarea > < / textarea >`

```javascript
  var textarea = document.querySelector("textarea");
  textarea.addEventListener("keydown", function(event) {
    // The key code for F2 happens to be 113
    if (event.keyCode == 113) {
      replaceSelection(textarea, "Khasekhemwy");
      event.preventDefault();
    }
  });
  function replaceSelection(field, word) {
    var from = field.selectionStart, to = field.selectionEnd;
    field.value = field.value.slice(0, from) + word +
                  field.value.slice(to);
    // Put the cursor after the word
    field.selectionStart = field.selectionEnd =
      from + word.length;
  }

```

A função `replaceSelection` substitui a parte selecionada de um campo de texto com a palavra dada e em seguida,
move o cursor depois que a palavra de modo que o usuário pode continuar a escrever.

O evento altera um campo de texto e não dispara cada vez que algo é digitado. Em vez disso, ele é acionado 
quando o campo perde o foco após o seu conteúdo foi alterado. Para responder imediatamente a mudanças em um campo de texto você deve registrar um manipulador para o evento "input" em vez disso, que é acionado para cada vez que o usuário
digitar um caractere, exclui do texto, ou de outra forma manipula o conteúdo do campo.

O exemplo a seguir mostra um campo de texto e um contador que mostra o comprimento atual do texto inserido:


`< input type="text" > length: < span id="length" >0< / span >`

```javascript
  var text = document.querySelector("input");
  var output = document.querySelector("#length");
  text.addEventListener("input", function() {
    output.textContent = text.value.length;
  });
```

## Checkboxes e radio buttons

Um Checkbox é uma alternância binária simples. Seu valor pode ser extraído ou alterado por meio de sua 
propriedade checked, que tem um valor booleano.


`<input type="checkbox" id="purple">` 
`<label for="purple">Make this page purple</label>`

```javascript  
var checkbox = document.querySelector("#purple");
   checkbox.addEventListener("change", function() {
   document.body.style.background =
   checkbox.checked ? "mediumpurple" : "";
});
```

A tag `<label>` é usada para associar uma parte de texto com um campo de entrada. Seu atributo deverá acessar o 
id do campo. Clicando no label irá ativar o campo, que se concentra nele e alterna o seu valor quando é um 
checkbox ou button radio.

Um radio button é semelhante a um checkbox, mas está implicitamente ligado a outros radio buttons com o mesmo
atributo de nome, de modo que apenas um deles pode estar ativo a qualquer momento.

Color:

```html
<input type="radio" name="color" value="mediumpurple"> Purple
<input type="radio" name="color" value="lightgreen"> Green
<input type="radio" name="color" value="lightblue"> Blue
```

```javascript

var buttons = document.getElementsByName("color");
function setColor(event) {
  document.body.style.background = event.target.value;
}
for (var i = 0; i < buttons.length; i++)
  buttons[i].addEventListener("change", setColor);
```
O método `document.getElementsByName` nos dá todos os elementos com um determinado atributo name. O exemplo faz 
um loop sobre aqueles (com um loop regular for , não forEach, porque a coleção retornada não é uma matriz real)
e registra um manipulador de eventos para cada elemento. Lembre-se que os eventos de objetos  tem uma propriedade
target referindo-se ao elemento que disparou o evento. Isso é muitas vezes útil para manipuladores de eventos 
como este, que será chamado em diferentes elementos e precisa de alguma forma de acessar o target atual.

##Campos Select

Os campos select são conceitualmente similares aos radio buttons, eles também permitem que o usuário escolha a
partir de um conjunto de opções. Mas onde um botão de opção coloca a disposição das opções sob o nosso controle,
a aparência de uma tag `<select>`  é determinada pelo browser.

Campos select também têm uma variante que é mais parecido com uma lista de checkboxes, em vez de radio 
boxes. Quando dado o atributo múltiplo, um `<select>` tag vai permitir que o usuário selecione qualquer número 
de opções, em vez de apenas uma única opção.

```html

<select multiple>
  <option>Pancakes</option>
  <option>Pudding</option>
  <option>Ice cream</option>
</select>

```

Isto, na maioria dos navegadores, mostra-se diferente do que um campo select não-múltiplo, que é comumente desenhado 
como um controle _drop-down_ que mostra as opções somente quando você abrir.

O atributo _size_ da tag `<select>`  é usada para definir o número de opções que são visíveis ao mesmo tempo, 
o que lhe dá o controle sobre a aparência do _drop-down_. Por exemplo, 
definir o atributo _size_ para "3" fará com que o campo mostre três linhas, se ele tem a opção de `multiple` habilitado 
ou não.

Cada tag `<option>`  tem um valor. Este valor pode ser definido com um atributo de value, mas quando isso não for dado,
o texto dentro do `option` irá contar como o valor do `option`.
O valor da propriedade de um elemento `<select>` reflete a opção selecionada no momento. Para um campo `multiple`, porém,
esta propriedade não significa muito, uma vez que vai possuir o valor apenas uma das opções escolhidas no momento.

As tags `<option>` de um campo `<select>` pode ser acessada como um objeto de array-like através de opções
propriedade do campo. Cada opção tem uma propriedade chamada selected, o que indica se essa opção for selecionada.
A propriedade também pode ser escrita para marcar ou desmarcar uma opção.

O exemplo a seguir extrai os valores selecionados a partir de um campo de seleção múltiplo e as utiliza para compor
um número binário de bits individuais. Segure Ctrl (ou Comand no Mac) para selecionar várias opções.

```html
<select multiple>
  <option value="1">0001</option>
  <option value="2">0010</option>
  <option value="4">0100</option>
  <option value="8">1000</option>
</select> = <span id="output">0</span>
```

```javascript
  var select = document.querySelector("select");
  var output = document.querySelector("#output");
  select.addEventListener("change", function() {
    var number = 0;
    for (var i = 0; i < select.options.length; i++) {
      var option = select.options[i];
      if (option.selected)
        number += Number(option.value);
    }
    output.textContent = number;
  });
```

##Campo Arquivo (Campo File)

Os campos de arquivo - (file), foram originalmente concebidos como uma maneira de fazer upload de arquivos de uma máquina 
do navegador através de um formulário. Em navegadores modernos, eles também fornecem uma maneira de ler esses 
arquivos a partir de programas de JavaScript. O campo atua como uma forma de porteiro). 
O script não pode simplesmente começar a ler arquivos privados do computador do usuário, mas se o usuário seleciona 
um arquivo em tal campo, o navegador interpreta que a ação no sentido de que o script pode ler o arquivo.

Um campo _file_ geralmente parece um botão rotulado com algo como "escolha o arquivo" ou "procurar", com informações
sobre o arquivo escolhido ao lado dele.

```html
<input type="file">
```

```javascript
  var input = document.querySelector("input");
  input.addEventListener("change", function() {
    if (input.files.length > 0) {
      var file = input.files[0];
      console.log("You chose", file.name);
      if (file.type)
        console.log("It has type", file.type);
    }
  });
```
A propriedade `files` de um elemento campo file é um objeto de array-like (novamente, não um array autêntico) 
que contém os arquivos escolhidos no campo. É inicialmente vazio. A razão não é simplesmente uma propriedade de 
arquivo é que os campos file também suportam um atributo múltiplo, o que torna possível selecionar vários arquivos ao mesmo tempo.

Objetos na propriedade files têm propriedades como name (o nome do arquivo), size (o tamanho do arquivo em bytes),
e type (o tipo de mídia do arquivo, como text/plain ou image/jpeg).

O que ele não tem é uma propriedade que contém o conteúdo do arquivo. Como  é um pouco mais complicado. 
Desde a leitura de um arquivo do disco pode levar tempo, a interface terá de ser assíncrona para evitar 
o congelamento do documento. Você pode pensar o construtor _FileReader_ como sendo semelhante a _XMLHttpRequest_, mas para arquivos.

```html
<input type="file" multiple>
```

```javascript
  var input = document.querySelector("input");
  input.addEventListener("change", function() {
    Array.prototype.forEach.call(input.files, function(file) {
      var reader = new FileReader();
      reader.addEventListener("load", function() {
        console.log("File", file.name, "starts with",
                    reader.result.slice(0, 20));
      });
      reader.readAsText(file);
    });
  });
```
A leitura de um arquivo é feita através da criação de um objeto _FileReader_, registrando um manipulador de eventos
"load"  para ele, e chamando seu método _readAsText_, dando-lhe o arquivo para leitura. Uma vez finalizado o 
carregamento,a propriedade de leitura _result_ tem o conteúdo do arquivo. O exemplo usa `Array.prototype.forEach`
para iterar o array, uma vez em um loop (laço) normal, seria estranho obter os objetos _file_ e _read_  a partir de um manipulador
de eventos. As variáveis poderiam compartilhar todas as iterações do loop.

_FileReaders_ também aciona um evento "error" ao ver o arquivo falhar por algum motivo. O próprio objeto de erro 
vai acabar na propriedade de "error" de leitura. Se você não quer lembrar dos detalhes de mais uma interface 
assíncrona inconsistente, você pode envolvê-lo em uma _Promise_ (ver [Capítulo 17](./17-http.md)) como este:

```javascript

function readFile(file) {
  return new Promise(function(succeed, fail) {
    var reader = new FileReader();
    reader.addEventListener("load", function() {
      succeed(reader.result);
    });
    reader.addEventListener("error", function() {
      fail(reader.error);
    });
    reader.readAsText(file);
  });
}

```
É possível ler apenas parte de um arquivo chamando _slice_ sobre ele e passando o resultado (uma chamada de um objeto _blob_) 
para o leitor de arquivos.

##Armazenamento de dados Cliente-side

Páginas simples em HTML com um pouco de JavaScript pode ser um ótimo meio para "mini aplicativos" programas 
auxiliares -Pequenos ajudantes que automatizam coisas cotidianas. Ao ligar alguns campos de formulário com os
manipuladores de eventos, você pode fazer qualquer coisa, desde a conversão entre graus Celsius e Fahrenheit 
às senhas de computação de uma senha mestra e um nome de site.

Quando tal aplicativo precisa lembrar-se de algo entre as sessões, você não pode usar variáveis JavaScript uma 
vez que aqueles são jogados fora a cada vez que uma página é fechada. Você pode 
configurar um servidor, conectar-se à Internet, e ter o seu aplicativo de armazenamento de alguma coisa lá. 
Vamos ver como fazer isso no capítulo 20. Mas isso adiciona um monte de trabalho extra e complexidade.
Às vezes é suficiente apenas para manter os dados no navegador. Mas como?

Você pode armazenar dados de string data de uma forma que ainda continue ao recarregar a página, colocando-o no
objeto localStorage. Este objeto permite-lhe apresentar valores de strings sob nomes (também strings), como neste exemplo:

```javascript
localStorage.setItem("username", "marijn");
console.log(localStorage.getItem("username"));
// → marijn
localStorage.removeItem("username");
```
Um valor em localStorage continua na página até que seja substituído, ele é removido com removeItem, ou o usuário
apaga seus dados locais.

Sites de domínios diferentes obtém diferentes espaços de armazenamento. Isso significa que os dados armazenados 
em localStorage por um determinado site pode, a princípio,  ser lido (e sobrescritos) por scripts desse mesmo site.

Os navegadores também impor um limite para o tamanho dos dados de um site pode armazenar em localStorage, 
tipicamente na ordem de poucos megabytes. Esta restrição, juntamente com o fato de encher os discos rígidos 
das pessoas com lixo não é realmente viável, impede esse recurso de ocupar muito espaço.

O código a seguir implementa uma simples aplicação de anotações. Ele mantém notas do usuário como um objeto, 
associando títulos de notas com strings de conteúdo. Este objeto é codificado como JSON e armazenados em 
localStorage. O usuário pode selecionar uma nota de um campo `<select>` e mudar o texto  da nota em um `<textarea>`.
A nota pode ser adicionado clicando em um botão.

Notes: 

```html
<select id="list"></select>
<button onclick="addNote()">new</button><br>
<textarea id="currentnote" style="width: 100%; height: 10em">
</textarea>
```

```javascript
  var list = document.querySelector("#list");
  function addToList(name) {
    var option = document.createElement("option");
    option.textContent = name;
    list.appendChild(option);
  }

  // Initialize the list from localStorage
  var notes = JSON.parse(localStorage.getItem("notes")) ||
              {"shopping list": ""};
  for (var name in notes)
    if (notes.hasOwnProperty(name))
      addToList(name);

  function saveToStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  var current = document.querySelector("#currentnote");
  current.value = notes[list.value];

  list.addEventListener("change", function() {
    current.value = notes[list.value];
  });
  current.addEventListener("change", function() {
    notes[list.value] = current.value;
    saveToStorage();
  });

  function addNote() {
    var name = prompt("Note name", "");
    if (!name) return;
    if (!notes.hasOwnProperty(name)) {
      notes[name] = "";
      addToList(name);
      saveToStorage();
    }
    list.value = name;
    current.value = notes[name];
  }
```
O script inicializa a variável `notes` para o valor armazenado em `localStorage` ou um valor que não existe,
para objeto simples `notes` "shopping list" vazio . A leitura de um campo que não existe 
de `localStorage` será nulo. Passando nulo para `JSON.parse` irá analisar uma string "null" e retornar
_null_. Assim, o operador `||` pode ser utilizada para fornecer um valor _default_ de uma situação como esta.

Sempre que as alterações de dados de notas (quando uma nova nota é adicionado ou uma nota existente é modificada), a função `saveToStorage` é chamado para atualizar o campo de armazenamento. Se esta aplicação foi destinado a lidar com milhares de notas, em vez de muitos, isso seria muito caro, e nós teríamos que chegar a uma maneira mais complicada para armazená-los, como dar cada nota de seu próprio campo de armazenamento.

Quando o usuário adiciona uma nova nota, o código deve atualizar o campo de texto explicitamente, mesmo que o 
campo `<select>` tenha um manipulador de "change" que faz a mesma coisa. Isso é necessário porque o eventos 
"change" disparam apenas quando o usuário altera o valor do campo, e não quando um script executa.

Há um outro objeto semelhante para `LocalStorage` chamado `sessionStorage` . A diferença entre as duas é que o conteúdo de `sessionStorag` é esquecido no fim de cada sessão, o que para a maioria dos navegadores significa quando o navegador é fechado.

## Sumário

HTML pode expressar vários tipos de campos de formulário, tais como text fields, checkboxes, 
campos multiple-choice, e file pickers.

Esses campos podem ser inspecionados e manipulados com JavaScript. Eles acionam o evento "change" 
quando alterado, o evento "input" quando o texto é digitado, e vários eventos de teclado. Estes 
eventos permitem-nos a perceber quando o usuário está interagindo com os campos. Propriedades 
como value (para texto e seleção campos) ou checked (para checkboxes e radio buttons)são usados 
para ler ou definir o conteúdo do campo.

Quando um formulário é enviado, o evento "submit" dispara. Um manipulador de JavaScript pode chamar _preventDefault_ para impedir que que dispare o evento submit. Elementos de campo de formulário não precisam ser envolvidos em tags `<form>`.

Quando o usuário tenha selecionado um campo de seu sistema de arquivos local em um campo picker field, 
a interface FileReader pode ser usado para acessar o conteúdo deste arquivo a partir de um programa de JavaScript.

Os objetos _LocalStorage_ e _sessionStorage_ pode ser usado para guardar informações de uma forma que continue 
mesmo recarregando a página. O primeiro salva os dados para sempre (ou até que o usuário decida limpá-la),
e o segundo salvá-lo até que o navegador é fechado.

## Exercícios

### A JavaScript workbench 
Construa uma interface que permite que as pessoas a digitem e executem partes do código JavaScript.

Coloque um botão ao lado de um campo `<textarea>` , ao ser  pressionado, usa o construtor `Function` vimos no
Capítulo 10 para dividir o texto em uma função e chamá-lo. Converter o valor de retorno da função, ou qualquer 
erro que é elevado,em uma string e exibi-lo depois de o campo de texto.


```html
  <textarea id="code">return "hi";</textarea>
  <button id="button">Run</button>
  <pre id="output"></pre>
```  

```javascript  
  <script>
    // Your code here.
  </script>
```

Use `document.querySelector` ou `document.getElementById` para ter acesso aos elementos definidos em seu HTML.
Um manipulador de eventos para o "`click`" ou eventos no botão "`mousedown`" pode ter a propriedade value do
campo de texto e chamada `new Function` nele.

Certifique-se de envolver tanto a chamada para a `new function` e a chamada para o seu resultado em um bloco try
para que você possa capturar exceções que ela produz. Neste caso, nós realmente não sabemos que tipo de exceção
que estamos procurando, então pegar tudo.

A propriedade textContent do elemento de saída pode ser usada para preenchê-lo com uma mensagem de string.
Ou, se você quiser manter o conteúdo antigo ao redor, criar um novo nó de texto usando document.createTextNode
e anexá-lo ao elemento. Lembre-se de adicionar um caractere de nova linha até o fim, de modo que nem todas as 
saídas apareçam em uma única linha.

## Autocompletion

Estender um campo de texto para quando o usuário digitar uma lista de valores sugeridos é mostrado abaixo do 
campo. Você tem um conjunto de possíveis valores disponíveis e deve mostrar aqueles que começam com o texto que 
foi digitado. Quando uma sugestão é clicada, substitua o valor atual do campo de texto com ele.

```html
<input type="text" id="field">
<div id="suggestions" style="cursor: pointer"></div>
```

```javascript

  // Builds up an array with global variable names, like
  // 'alert', 'document', and 'scrollTo'
  var terms = [];
  for (var name in window)
    terms.push(name);

  // Your code here.

```
O melhor evento para a atualização da lista de sugestões é "`input`", uma vez que será acionado imediatamente 
quando o conteúdo do campo é alterado.

Em seguida, um loop por meio do array de termos e ver se eles começam com a string dada. Por exemplo, você poderia chamar `indexOf` e ver se o resultado é zero. Para cada sequência correspondente, adicionar um elemento para as sugestões `<div>`. Você deve, provavelmente,  cada vez que você inicia começar vazio e atualizar as sugestões, por exemplo, definindo sua textContent para a string vazia.

Você poderia adicionar um manipulador de evento "`click`" [para cada elemento  ou adicionar um único para
fora `<div>` que prendê-los e olhar para a propriedade target do evento para descobrir qual sugestão foi 
clicada.]

Para obter o texto sugestão de um nó DOM, você pode olhar para a sua textContent ou definir um atributo para 
armazenar explicitamente o texto quando você cria o elemento.

##Conway’s Game of Life

Jogo da Vida de Conway é uma simulação simples que cria a "vida" artificial em uma grade, cada célula, 
que é ao vivo ou não. Cada geração (virar), as seguintes regras são aplicadas:

Qualquer célula viva com menos de dois ou mais de três vizinhos vivos morre.

Qualquer célula viva com dois ou três vizinhos vivos vive para a próxima geração.

Qualquer célula morta com exatamente três vizinhos vivos se torna um ce ao vivo

Um vizinho é definido como qualquer célula adjacente, inclusive na diagonal adjacentes.

Nota-se que estas regras são aplicadas a toda a rede de uma só vez, e não um quadrado de cada vez. 
Isso significa que a contagem de vizinhos baseia-se na situação no início da produção, e mudanças acontecendo
com as células vizinhas durante esta geração não deve influenciar o novo estado de uma dada célula.

Implementar este jogo usando qualquer estrutura de dados que você ache mais apropriado. Use Math.random para 
preencher a grade com um padrão aleatório inicialmente. Exibi-lo como uma grade de campos de checkboxes,
com um botão ao lado dele para avançar para a próxima geração. Quando os controlos de utilizador 
ou desmarca as checkboxes , as alterações devem ser incluídos no cálculo a próxima geração.

```html
<div id="grid"></div>
<button id="next">Next generation</button>
```

```js
<script>
  // Your code here.
</script>

```

Para resolver o problema de ter conceitualmente as alterações ocorram ao mesmo tempo, tente ver o cálculo de
uma geração como uma função pura, que tem uma grelha e produz uma nova grade que representa a curva seguinte.

Representando a grade pode ser feito em qualquer das formas mostradas nos capítulos 7 e 15. Contando vizinhos 
vivos podem ser feitas com dois loops aninhados, percorrer coordenadas adjacentes. Tome cuidado para não contar
as células fora do campo e ignorar o celular no centro, cujos vizinhos estamos contando.

Fazer alterações em check-boxes em vigor na próxima geração pode ser feito de duas maneiras. Um manipulador 
de eventos pode perceber essas alterações e atualizar a grade atual para refleti-los, ou você poderia gerar 
uma nova grade a partir dos valores nas caixas de seleção antes de calcular o próximo turno.

Se você optar utilizar  manipuladores de eventos, você pode querer anexar atributos que identificam a posição 
que cada caixa corresponde ao modo que é fácil descobrir qual célula de mudar.

Para desenhar a rede de caixas de seleção, você ou pode usar um elemento `<table>` *(olhe o [Capítulo 13](./13-document-object-model.md))* ou simplesmente colocá-los todos no mesmo elemento e colocar `<br>` (quebra de linha) elementos entre as linhas.
