# O Modelo de Objeto do Documento

{{quote {author: "Friedrich Nietzsche", title: "Beyond Good and Evil", chapter: true}

Too bad! Same old story! Once you've finished building your house you notice you've accidentally learned something that you really should have known—before you started.

quote}}

{{figure {url: "img/chapter_picture_14.jpg", alt: "Illustration showing a tree with letters, pictures, and gears hanging on its branches", chapter: "framed"}}}

{{index drawing, parsing}}

Quando você abre uma página web, seu navegador recupera o texto ((HTML)) da página e o analisa, da mesma forma que nosso parser do [Capítulo ?](language#parsing) analisava programas. O navegador constrói um modelo da ((estrutura)) do documento e usa esse modelo para desenhar a página na tela.

{{index "live data structure"}}

Essa representação do ((documento)) é um dos brinquedos que um programa JavaScript tem disponível em sua ((sandbox)). É uma ((estrutura de dados)) que você pode ler ou modificar. Ela funciona como uma estrutura de dados _ao vivo_: quando é modificada, a página na tela é atualizada para refletir as mudanças.

## Estrutura do documento

{{index [HTML, structure]}}

Você pode imaginar um documento HTML como um conjunto aninhado de ((caixa))s. Tags como `<body>` e `</body>` envolvem outras ((tag))s, que por sua vez contêm outras tags ou ((texto)). Aqui está o documento de exemplo do [capítulo anterior](browser):

```{lang: html, sandbox: "homepage"}
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

Esta página tem a seguinte estrutura:

{{figure {url: "img/html-boxes.svg", alt: "Diagram showing an HTML document as a set of nested boxes. The outer box is labeled 'html' and contains two boxes labeled 'head' and 'body'. Inside those are further boxes, with some of the innermost boxes containing the document's text.", width: "7cm"}}}

{{indexsee "Document Object Model", DOM}}

A estrutura de dados que o navegador usa para representar o documento segue essa forma. Para cada caixa, existe um objeto, com o qual podemos interagir para descobrir coisas como qual tag HTML ele representa e quais caixas e texto ele contém. Essa representação é chamada de _Modelo de Objeto do Documento_, ou _((DOM))_ para abreviar.

{{index "documentElement property", "head property", "body property", "html (HTML tag)", "body (HTML tag)", "head (HTML tag)"}}

A vinculação global `document` nos dá acesso a esses objetos. Sua propriedade `documentElement` se refere ao objeto representando a tag `<html>`. Como todo documento HTML tem um cabeçalho e um corpo, ele também tem propriedades `head` e `body` apontando para esses elementos.

## Árvores

{{index [nesting, "of objects"]}}

Pense nas ((árvores sintáticas)) do [Capítulo ?](language#parsing) por um momento. Suas estruturas são notavelmente similares à estrutura do documento de um navegador. Cada _((nó))_ pode se referir a outros nós, _filhos_, que por sua vez podem ter seus próprios filhos. Essa forma é típica de estruturas aninhadas, onde elementos podem conter subelementos que são similares a eles mesmos.

{{index "documentElement property", [DOM, tree]}}

Chamamos uma estrutura de dados de _((árvore))_ quando ela tem uma estrutura ramificada, sem ((ciclo))s (um nó não pode conter a si mesmo, direta ou indiretamente), e uma única _((raiz))_ bem definida. No caso do DOM, `document.documentElement` serve como a raiz.

{{index sorting, ["data structure", "tree"], "syntax tree"}}

Árvores aparecem muito em ciência da computação. Além de representar estruturas recursivas como documentos HTML ou programas, elas são frequentemente usadas para manter ((conjunto))s ordenados de dados, pois elementos geralmente podem ser encontrados ou inseridos mais eficientemente em uma árvore do que em um array plano.

{{index "leaf node", "Egg language"}}

Uma árvore típica tem diferentes tipos de ((nó))s. A árvore sintática da [linguagem Egg](language) tinha identificadores, valores e nós de aplicação. Nós de aplicação podem ter filhos, enquanto identificadores e valores são _folhas_, ou nós sem filhos.

{{index "body property", [HTML, structure]}}

O mesmo vale para o DOM. Nós de _((elemento))s_, que representam tags HTML, determinam a estrutura do documento. Eles podem ter ((nó filho))s. Um exemplo de tal nó é `document.body`. Alguns desses filhos podem ser ((nós folha)), como pedaços de ((texto)) ou nós de ((comentário)).

{{index "text node", element, "ELEMENT_NODE code", "COMMENT_NODE code", "TEXT_NODE code", "nodeType property"}}

Cada objeto de nó DOM tem uma propriedade `nodeType`, que contém um código (número) que identifica o tipo do nó. Elementos têm o código 1, que também é definido como a propriedade constante `Node.ELEMENT_NODE`. Nós de texto, representando uma seção de texto no documento, recebem o código 3 (`Node.TEXT_NODE`). Comentários têm o código 8 (`Node.COMMENT_NODE`).

Outra forma de visualizar nossa ((árvore)) do documento é a seguinte:

{{figure {url: "img/html-tree.svg", alt: "Diagram showing the HTML document as a tree, with arrows from parent nodes to child nodes", width: "8cm"}}}

As folhas são nós de texto, e as setas indicam relacionamentos pai-filho entre nós.

{{id standard}}

## O padrão

{{index "programming language", [interface, design], [DOM, interface]}}

Usar códigos numéricos crípticos para representar tipos de nó não é algo muito ao estilo do JavaScript. Mais adiante neste capítulo, veremos que outras partes da interface do DOM também parecem desajeitadas e estranhas. Isso é porque a interface do DOM não foi projetada apenas para JavaScript. Em vez disso, ela tenta ser uma interface neutra em relação à linguagem que pode ser usada em outros sistemas também — não apenas para HTML, mas também para ((XML)), que é um formato de ((dados)) genérico com uma sintaxe similar ao HTML.

{{index consistency, integration}}

Isso é lamentável. Padrões são frequentemente úteis. Mas neste caso, a vantagem (consistência entre linguagens) não é tão convincente. Ter uma interface que é devidamente integrada com a linguagem que você está usando economizará mais tempo do que ter uma interface familiar entre linguagens.

{{index "array-like object", "NodeList type"}}

Como exemplo dessa integração precária, considere a propriedade `childNodes` que nós de elemento no DOM possuem. Essa propriedade contém um objeto semelhante a um array, com uma propriedade `length` e propriedades rotuladas por números para acessar os nós filhos. Mas é uma instância do tipo `NodeList`, não um array real, então não possui métodos como `slice` e `map`.

{{index [interface, design], [DOM, construction], "side effect"}}

Depois há problemas simplesmente causados por design ruim. Por exemplo, não há como criar um novo nó e imediatamente adicionar filhos ou ((atributo))s a ele. Em vez disso, você precisa primeiro criá-lo e depois adicionar filhos e atributos um por um, usando efeitos colaterais. Código que interage pesadamente com o DOM tende a ficar longo, repetitivo e feio.

{{index library}}

Mas essas falhas não são fatais. Como JavaScript nos permite criar nossas próprias ((abstração))ões, é possível projetar formas melhoradas de expressar as operações que estamos realizando. Muitas bibliotecas destinadas à programação em navegadores vêm com tais ferramentas.

## Navegando pela árvore

{{index pointer}}

Nós DOM contêm uma riqueza de ((link))s para outros nós próximos. O diagrama a seguir ilustra isso:

{{figure {url: "img/html-links.svg", alt: "Diagram that shows the links between DOM nodes. The 'body' node is shown as a box, with a 'firstChild' arrow pointing at the 'h1' node at its start, a 'lastChild' arrow pointing at the last paragraph node, and 'childNodes' arrow pointing at an array of links to all its children. The middle paragraph has a 'previousSibling' arrow pointing at the node before it, a 'nextSibling' arrow to the node after it, and a 'parentNode' arrow pointing at the 'body' node.", width: "6cm"}}}

{{index "child node", "parentNode property", "childNodes property"}}

Embora o diagrama mostre apenas um link de cada tipo, cada nó tem uma propriedade `parentNode` que aponta para o nó do qual faz parte, se houver. Da mesma forma, cada nó de elemento (tipo 1) tem uma propriedade `childNodes` que aponta para um ((objeto semelhante a array)) contendo seus filhos.

{{index "firstChild property", "lastChild property", "previousSibling property", "nextSibling property"}}

Em teoria, você poderia se mover para qualquer lugar na árvore usando apenas esses links de pai e filho. Mas JavaScript também dá acesso a vários links de conveniência adicionais. As propriedades `firstChild` e `lastChild` apontam para os primeiros e últimos elementos filhos, ou têm o valor `null` para nós sem filhos. Da mesma forma, `previousSibling` e `nextSibling` apontam para nós adjacentes, que são nós com o mesmo pai que aparecem imediatamente antes ou depois do próprio nó. Para um primeiro filho, `previousSibling` será null, e para um último filho, `nextSibling` será null.

{{index "children property", "text node", element}}

Existe também a propriedade `children`, que é como `childNodes` mas contém apenas filhos de elemento (tipo 1), não outros tipos de nós filhos. Isso pode ser útil quando você não está interessado em nós de texto.

{{index "talksAbout function", recursion, [nesting, "of objects"]}}

Ao lidar com uma estrutura de dados aninhada como esta, funções recursivas são frequentemente úteis. A função a seguir varre um documento em busca de ((nós de texto)) contendo uma string dada e retorna `true` quando encontra um:

{{id talksAbout}}

```{sandbox: "homepage"}
function talksAbout(node, string) {
  if (node.nodeType == Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      if (talksAbout(child, string)) {
        return true;
      }
    }
    return false;
  } else if (node.nodeType == Node.TEXT_NODE) {
    return node.nodeValue.indexOf(string) > -1;
  }
}

console.log(talksAbout(document.body, "book"));
// → true
```

{{index "nodeValue property"}}

A propriedade `nodeValue` de um nó de texto contém a string de texto que ele representa.

## Encontrando elementos

{{index [DOM, querying], "body property", "hard-coding", [whitespace, "in HTML"]}}

Navegar por esses ((link))s entre pais, filhos e irmãos é frequentemente útil. Mas se quisermos encontrar um nó específico no documento, alcançá-lo começando em `document.body` e seguindo um caminho fixo de propriedades é uma má ideia. Fazer isso incorpora suposições em nosso programa sobre a estrutura precisa do documento — uma estrutura que você pode querer mudar depois. Outro fator complicante é que nós de texto são criados mesmo para os espaços em branco entre nós. A tag `<body>` do documento de exemplo não tem apenas três filhos (`<h1>` e dois elementos `<p>`), mas sete: esses três, mais os espaços antes, depois e entre eles.

{{index "search problem", "href attribute", "getElementsByTagName method"}}

Se quisermos obter o atributo `href` do link naquele documento, não queremos dizer algo como "Pegue o segundo filho do sexto filho do corpo do documento". Seria melhor se pudéssemos dizer "Pegue o primeiro link no documento". E podemos.

```{sandbox: "homepage"}
let link = document.body.getElementsByTagName("a")[0];
console.log(link.href);
```

{{index "child node"}}

Todos os nós de elemento têm um método `getElementsByTagName`, que coleta todos os elementos com o nome de tag dado que são descendentes (filhos diretos ou indiretos) daquele nó e os retorna como um ((objeto semelhante a array)).

{{index "id attribute", "getElementById method"}}

Para encontrar um _único_ nó específico, você pode dar a ele um atributo `id` e usar `document.getElementById` em vez disso.

```{lang: html}
<p>My ostrich Gertrude:</p>
<p><img id="gertrude" src="img/ostrich.png"></p>

<script>
  let ostrich = document.getElementById("gertrude");
  console.log(ostrich.src);
</script>
```

{{index "getElementsByClassName method", "class attribute"}}

Um terceiro método similar é `getElementsByClassName`, que, assim como `getElementsByTagName`, busca através dos conteúdos de um nó de elemento e recupera todos os elementos que têm a string dada em seu atributo `class`.

## Alterando o documento

{{index "side effect", "removeChild method", "appendChild method", "insertBefore method", [DOM, construction], [DOM, modification]}}

Quase tudo sobre a estrutura de dados do DOM pode ser alterado. A forma da árvore do documento pode ser modificada alterando relacionamentos pai-filho. Nós têm um método `remove` para removê-los de seu nó pai atual. Para adicionar um nó filho a um nó de elemento, podemos usar `appendChild`, que o coloca no final da lista de filhos, ou `insertBefore`, que insere o nó dado como primeiro argumento antes do nó dado como segundo argumento.

```{lang: html}
<p>One</p>
<p>Two</p>
<p>Three</p>

<script>
  let paragraphs = document.body.getElementsByTagName("p");
  document.body.insertBefore(paragraphs[2], paragraphs[0]);
</script>
```

Um nó pode existir no documento em apenas um lugar. Assim, inserir o parágrafo _Three_ na frente do parágrafo _One_ irá primeiro removê-lo do final do documento e depois inseri-lo na frente, resultando em _Three_/_One_/_Two_. Todas as operações que inserem um nó em algum lugar irão, como ((efeito colateral)), fazer com que ele seja removido de sua posição atual (se tiver uma).

{{index "insertBefore method", "replaceChild method"}}

O método `replaceChild` é usado para substituir um nó filho por outro. Ele recebe como argumentos dois nós: um novo nó e o nó a ser substituído. O nó substituído deve ser um filho do elemento no qual o método é chamado. Note que tanto `replaceChild` quanto `insertBefore` esperam o nó _novo_ como seu primeiro argumento.

## Criando nós

{{index "alt attribute", "img (HTML tag)", "createTextNode method"}}

Digamos que queremos escrever um script que substitua todas as ((imagem))s (`tags <img>`) no documento pelo texto contido em seus atributos `alt`, que especifica uma representação textual alternativa da imagem. Isso envolve não apenas remover as imagens, mas também adicionar um novo nó de texto para substituí-las.

```{lang: html}
<p>The <img src="img/cat.png" alt="Cat"> in the
  <img src="img/hat.png" alt="Hat">.</p>

<p><button onclick="replaceImages()">Replace</button></p>

<script>
  function replaceImages() {
    let images = document.body.getElementsByTagName("img");
    for (let i = images.length - 1; i >= 0; i--) {
      let image = images[i];
      if (image.alt) {
        let text = document.createTextNode(image.alt);
        image.parentNode.replaceChild(text, image);
      }
    }
  }
</script>
```

{{index "text node"}}

Dado uma string, `createTextNode` nos dá um nó de texto que podemos inserir no documento para fazê-lo aparecer na tela.

{{index "live data structure", "getElementsByTagName method", "childNodes property"}}

O loop que percorre as imagens começa do final da lista. Isso é necessário porque a lista de nós retornada por um método como `getElementsByTagName` (ou uma propriedade como `childNodes`) é _ao vivo_. Ou seja, ela é atualizada conforme o documento muda. Se começássemos do início, remover a primeira imagem faria a lista perder seu primeiro elemento, de forma que na segunda vez que o loop se repetisse, quando `i` fosse 1, ele pararia porque o comprimento da coleção agora também é 1.

{{index "slice method"}}

Se você quer uma coleção _sólida_ de nós, em oposição a uma ao vivo, pode converter a coleção em um array real chamando `Array.from`.

```
let arrayish = {0: "one", 1: "two", length: 2};
let array = Array.from(arrayish);
console.log(array.map(s => s.toUpperCase()));
// → ["ONE", "TWO"]
```

{{index "createElement method"}}

Para criar nós de ((elemento)), você pode usar o método `document.createElement`. Esse método recebe um nome de tag e retorna um novo nó vazio do tipo dado.

{{index "Popper, Karl", [DOM, construction], "elt function"}}

{{id elt}}

O exemplo a seguir define uma utilidade `elt`, que cria um nó de elemento e trata o restante de seus argumentos como filhos daquele nó. Essa função é então usada para adicionar uma atribuição a uma citação.

```{lang: html}
<blockquote id="quote">
  No book can ever be finished. While working on it we learn
  just enough to find it immature the moment we turn away
  from it.
</blockquote>

<script>
  function elt(type, ...children) {
    let node = document.createElement(type);
    for (let child of children) {
      if (typeof child != "string") node.appendChild(child);
      else node.appendChild(document.createTextNode(child));
    }
    return node;
  }

  document.getElementById("quote").appendChild(
    elt("footer", "—",
        elt("strong", "Karl Popper"),
        ", preface to the second edition of ",
        elt("em", "The Open Society and Its Enemies"),
        ", 1950"));
</script>
```

{{if book

É assim que o documento resultante fica:

{{figure {url: "img/blockquote.png", alt: "Rendered picture of the blockquote with attribution", width: "8cm"}}}

if}}

## Atributos

{{index "href attribute", [DOM, attributes]}}

Alguns ((atributo))s de elemento, como `href` para links, podem ser acessados através de uma propriedade de mesmo nome no objeto ((DOM)) do elemento. Esse é o caso para a maioria dos atributos padrão comumente usados.

{{index "data attribute", "getAttribute method", "setAttribute method", attribute}}

HTML permite que você defina qualquer atributo que quiser em nós. Isso pode ser útil porque permite armazenar informações extras em um documento. Para ler ou alterar atributos personalizados, que não estão disponíveis como propriedades regulares de objeto, você deve usar os métodos `getAttribute` e `setAttribute`.

```{lang: html}
<p data-classified="secret">The launch code is 00000000.</p>
<p data-classified="unclassified">I have two feet.</p>

<script>
  let paras = document.body.getElementsByTagName("p");
  for (let para of Array.from(paras)) {
    if (para.getAttribute("data-classified") == "secret") {
      para.remove();
    }
  }
</script>
```

É recomendado prefixar os nomes de tais atributos inventados com `data-` para garantir que não conflitem com nenhum outro atributo.

{{index "getAttribute method", "setAttribute method", "className property", "class attribute"}}

Existe um atributo comumente usado, `class`, que é uma ((palavra-chave)) na linguagem JavaScript. Por razões históricas — algumas implementações antigas de JavaScript não conseguiam lidar com nomes de propriedade que coincidissem com palavras-chave — a propriedade usada para acessar esse atributo é chamada `className`. Você também pode acessá-lo por seu nome real, `"class"`, com os métodos `getAttribute` e `setAttribute`.

## Layout

{{index layout, "block element", "inline element", "p (HTML tag)", "h1 (HTML tag)", "a (HTML tag)", "strong (HTML tag)"}}

Você pode ter notado que diferentes tipos de elementos são dispostos de maneira diferente. Alguns, como parágrafos (`<p>`) ou cabeçalhos (`<h1>`), ocupam toda a largura do documento e são renderizados em linhas separadas. Estes são chamados de elementos de _bloco_. Outros, como links (`<a>`) ou o elemento `<strong>`, são renderizados na mesma linha que o texto ao redor. Tais elementos são chamados de elementos _inline_.

{{index drawing}}

Para qualquer documento, navegadores são capazes de calcular um layout, que dá a cada elemento um tamanho e posição baseados em seu tipo e conteúdo. Esse layout é então usado para realmente desenhar o documento.

{{index "border (CSS)", "offsetWidth property", "offsetHeight property", "clientWidth property", "clientHeight property", dimensions}}

O tamanho e posição de um elemento podem ser acessados a partir do JavaScript. As propriedades `offsetWidth` e `offsetHeight` fornecem o espaço que o elemento ocupa em _((pixel))s_. Um pixel é a unidade básica de medida no navegador. Tradicionalmente corresponde ao menor ponto que a tela pode desenhar, mas em displays modernos, que podem desenhar pontos _muito_ pequenos, isso pode não ser mais o caso, e um pixel do navegador pode abranger múltiplos pontos do display.

Da mesma forma, `clientWidth` e `clientHeight` fornecem o tamanho do espaço _dentro_ do elemento, ignorando a largura da borda.

```{lang: html}
<p style="border: 3px solid red">
  I'm boxed in
</p>

<script>
  let para = document.body.getElementsByTagName("p")[0];
  console.log("clientHeight:", para.clientHeight);
  // → 19
  console.log("offsetHeight:", para.offsetHeight);
  // → 25
</script>
```

{{if book

Dar uma borda a um parágrafo faz com que um retângulo seja desenhado ao redor dele.

{{figure {url: "img/boxed-in.png", alt: "Rendered picture of a paragraph with a border", width: "8cm"}}}

if}}

{{index "getBoundingClientRect method", position, "pageXOffset property", "pageYOffset property"}}

{{id boundingRect}}

A forma mais eficaz de encontrar a posição precisa de um elemento na tela é o método `getBoundingClientRect`. Ele retorna um objeto com propriedades `top`, `bottom`, `left` e `right`, indicando as posições em pixels dos lados do elemento em relação ao canto superior esquerdo da tela. Se você quiser posições em pixels relativas ao documento inteiro, deve adicionar a posição de rolagem atual, que pode ser encontrada nas vinculações `pageXOffset` e `pageYOffset`.

{{index "offsetHeight property", "getBoundingClientRect method", drawing, laziness, performance, efficiency}}

Calcular o layout de um documento pode ser bastante trabalhoso. No interesse da velocidade, motores de navegador não recalculam imediatamente o layout de um documento toda vez que você o altera, mas esperam o máximo que podem antes de fazê-lo. Quando um programa JavaScript que alterou o documento termina de executar, o navegador terá que calcular um novo layout para desenhar o documento alterado na tela. Quando um programa _pede_ a posição ou tamanho de algo lendo propriedades como `offsetHeight` ou chamando `getBoundingClientRect`, fornecer essa informação também requer calcular um ((layout)).

{{index "side effect", optimization, benchmark}}

Um programa que alterna repetidamente entre ler informações de layout do DOM e alterar o DOM força muitos cálculos de layout e consequentemente rodará muito devagar. O código a seguir é um exemplo disso. Ele contém dois programas diferentes que constroem uma linha de caracteres _X_ com 2.000 pixels de largura e medem o tempo que cada um leva.

```{lang: html, test: nonumbers}
<p><span id="one"></span></p>
<p><span id="two"></span></p>

<script>
  function time(name, action) {
    let start = Date.now(); // Tempo atual em milissegundos
    action();
    console.log(name, "took", Date.now() - start, "ms");
  }

  time("naive", () => {
    let target = document.getElementById("one");
    while (target.offsetWidth < 2000) {
      target.appendChild(document.createTextNode("X"));
    }
  });
  // → naive took 32 ms

  time("clever", function() {
    let target = document.getElementById("two");
    target.appendChild(document.createTextNode("XXXXX"));
    let total = Math.ceil(2000 / (target.offsetWidth / 5));
    target.firstChild.nodeValue = "X".repeat(total);
  });
  // → clever took 1 ms
</script>
```

## Estilos

{{index "block element", "inline element", style, "strong (HTML tag)", "a (HTML tag)", underline}}

Vimos que diferentes elementos HTML são desenhados de formas diferentes. Alguns são exibidos como blocos, outros inline. Alguns adicionam estilo — `<strong>` torna seu conteúdo ((negrito)), e `<a>` o torna azul e sublinhado.

{{index "img (HTML tag)", "default behavior", "style attribute"}}

A forma como uma tag `<img>` mostra uma imagem ou uma tag `<a>` faz um link ser seguido quando clicado está fortemente ligada ao tipo do elemento. Mas podemos alterar o estilo associado a um elemento, como a cor do texto ou o sublinhado. Aqui está um exemplo que usa a propriedade `style`:

```{lang: html}
<p><a href=".">Normal link</a></p>
<p><a href="." style="color: green">Green link</a></p>
```

{{if book

O segundo link ficará verde em vez da cor de link padrão:

{{figure {url: "img/colored-links.png", alt: "Rendered picture of a normal blue link and a styled green link", width: "2.2cm"}}}

if}}

{{index "border (CSS)", "color (CSS)", CSS, "colon character"}}

Um atributo de estilo pode conter uma ou mais _((declaração))ões_, que são uma propriedade (como `color`) seguida por dois-pontos e um valor (como `green`). Quando há mais de uma declaração, elas devem ser separadas por ((ponto e vírgula))s, como em `"color: red; border: none"`.

{{index "display (CSS)", layout}}

Muitos aspectos do documento podem ser influenciados pela estilização. Por exemplo, a propriedade `display` controla se um elemento é exibido como bloco ou como elemento inline.

```{lang: html}
This text is displayed <strong>inline</strong>,
<strong style="display: block">as a block</strong>, and
<strong style="display: none">not at all</strong>.
```

{{index "hidden element"}}

A tag `block` ficará em sua própria linha, já que ((elementos de bloco)) não são exibidos inline com o texto ao redor. A última tag não é exibida de forma alguma — `display: none` impede que um elemento apareça na tela. Esta é uma forma de esconder elementos. Frequentemente é preferível a removê-los do documento inteiramente, porque torna fácil revelá-los novamente mais tarde.

{{if book

{{figure {url: "img/display.png", alt: "Different display styles", width: "4cm"}}}

if}}

{{index "color (CSS)", "style attribute"}}

Código JavaScript pode manipular diretamente o estilo de um elemento através da propriedade `style` do elemento. Essa propriedade contém um objeto que tem propriedades para todas as propriedades de estilo possíveis. Os valores dessas propriedades são strings, nas quais podemos escrever para alterar um aspecto particular do estilo do elemento.

```{lang: html}
<p id="para" style="color: purple">
  Nice text
</p>

<script>
  let para = document.getElementById("para");
  console.log(para.style.color);
  para.style.color = "magenta";
</script>
```

{{index "camel case", capitalization, "hyphen character", "font-family (CSS)"}}

Alguns nomes de propriedades de estilo contêm hífens, como `font-family`. Como tais nomes de propriedade são estranhos de trabalhar em JavaScript (você teria que escrever `style["font-family"]`), os nomes das propriedades no objeto `style` para tais propriedades têm seus hífens removidos e as letras após eles capitalizadas (`style.fontFamily`).

## Estilos em cascata

{{index "rule (CSS)", "style (HTML tag)"}}

{{indexsee "Cascading Style Sheets", CSS}}
{{indexsee "style sheet", CSS}}

O sistema de estilos para HTML é chamado de _((CSS))_, de _Cascading Style Sheets_ (Folhas de Estilo em Cascata). Uma _folha de estilo_ é um conjunto de regras sobre como estilizar elementos em um documento. Ela pode ser escrita dentro de uma tag `<style>`.

```{lang: html}
<style>
  strong {
    font-style: italic;
    color: gray;
  }
</style>
<p>Now <strong>strong text</strong> is italic and gray.</p>
```

{{index "rule (CSS)", "font-weight (CSS)", overlay}}

O _((cascata))_ no nome se refere ao fato de que múltiplas regras são combinadas para produzir o estilo final de um elemento. No exemplo, o estilo padrão para tags `<strong>`, que lhes dá `font-weight: bold`, é sobreposto pela regra na tag `<style>`, que adiciona `font-style` e `color`.

{{index "style (HTML tag)", "style attribute"}}

Quando múltiplas regras definem um valor para a mesma propriedade, a regra lida mais recentemente obtém uma ((precedência)) maior e vence. Por exemplo, se a regra na tag `<style>` incluísse `font-weight: normal`, contradizendo a regra padrão de `font-weight`, o texto seria normal, _não_ negrito. Estilos em um atributo `style` aplicado diretamente ao nó têm a precedência mais alta e sempre vencem.

{{index uniqueness, "class attribute", "id attribute"}}

É possível direcionar coisas além de nomes de ((tag)) em regras CSS. Uma regra para `.abc` se aplica a todos os elementos com `"abc"` em seu atributo `class`. Uma regra para `#xyz` se aplica ao elemento com um atributo `id` de `"xyz"` (que deve ser único dentro do documento).

```{lang: "css"}
.subtle {
  color: gray;
  font-size: 80%;
}
#header {
  background: blue;
  color: white;
}
/* elementos p com id main e com classes a e b */
p#main.a.b {
  margin-bottom: 20px;
}
```

{{index "rule (CSS)"}}

A regra de ((precedência)) que favorece a regra definida mais recentemente se aplica apenas quando as regras têm a mesma _((especificidade))_. A especificidade de uma regra é uma medida de quão precisamente ela descreve os elementos correspondentes, determinada pelo número e tipo (tag, classe ou ID) de aspectos do elemento que ela requer. Por exemplo, uma regra que direciona `p.a` é mais específica do que regras que direcionam `p` ou apenas `.a` e, portanto, teria precedência sobre elas.

{{index "direct child node"}}

A notação `p > a {…}` aplica os estilos dados a todas as tags `<a>` que são filhos diretos de tags `<p>`. Da mesma forma, `p a {…}` se aplica a todas as tags `<a>` dentro de tags `<p>`, sejam eles filhos diretos ou indiretos.

## Seletores de consulta

{{index complexity, CSS, "domain-specific language", [DOM, querying]}}

Não usaremos folhas de estilo muito neste livro. Entendê-las é útil ao programar no navegador, mas são complexas o suficiente para justificar um livro separado. A principal razão pela qual introduzi a sintaxe de _((seletor))_ — a notação usada em folhas de estilo para determinar a quais elementos um conjunto de estilos se aplica — é que podemos usar essa mesma minilinguagem como uma forma eficaz de encontrar elementos DOM.

{{index "querySelectorAll method", "NodeList type"}}

O método `querySelectorAll`, que é definido tanto no objeto `document` quanto em nós de elemento, recebe uma string de seletor e retorna um `NodeList` contendo todos os elementos que ele corresponde.

```{lang: html}
<p>And if you go chasing
  <span class="animal">rabbits</span></p>
<p>And you know you're going to fall</p>
<p>Tell 'em a <span class="character">hookah smoking
  <span class="animal">caterpillar</span></span></p>
<p>Has given you the call</p>

<script>
  function count(selector) {
    return document.querySelectorAll(selector).length;
  }
  console.log(count("p"));           // Todos os elementos <p>
  // → 4
  console.log(count(".animal"));     // Classe animal
  // → 2
  console.log(count("p .animal"));   // Animal dentro de <p>
  // → 2
  console.log(count("p > .animal")); // Filho direto de <p>
  // → 1
</script>
```

{{index "live data structure"}}

Ao contrário de métodos como `getElementsByTagName`, o objeto retornado por `querySelectorAll` _não_ é ao vivo. Ele não mudará quando você alterar o documento. Ainda não é um array real, porém, então você precisa chamar `Array.from` se quiser tratá-lo como um.

{{index "querySelector method"}}

O método `querySelector` (sem a parte `All`) funciona de forma similar. Este é útil se você quer um único elemento específico. Ele retornará apenas o primeiro elemento correspondente, ou `null` quando nenhum elemento corresponder.

{{id animation}}

## Posicionamento e animação

{{index "position (CSS)", "relative positioning", "top (CSS)", "left (CSS)", "absolute positioning"}}

A propriedade de estilo `position` influencia o layout de forma poderosa. Ela tem um valor padrão de `static`, significando que o elemento fica em seu lugar normal no documento. Quando é definida como `relative`, o elemento ainda ocupa espaço no documento, mas agora as propriedades de estilo `top` e `left` podem ser usadas para movê-lo em relação àquele lugar normal. Quando `position` é definida como `absolute`, o elemento é removido do fluxo normal do documento — ou seja, ele não ocupa mais espaço e pode se sobrepor a outros elementos. Suas propriedades `top` e `left` podem ser usadas para posicioná-lo absolutamente em relação ao canto superior esquerdo do elemento envolvente mais próximo cuja propriedade `position` não seja `static`, ou em relação ao documento se nenhum elemento envolvente assim existir.

{{index [animation, "spinning cat"]}}

Podemos usar isso para criar uma animação. O documento a seguir exibe uma imagem de um gato que se move em uma ((elipse)):

```{lang: html, startCode: true}
<p style="text-align: center">
  <img src="img/cat.png" style="position: relative">
</p>
<script>
  let cat = document.querySelector("img");
  let angle = Math.PI / 2;
  function animate(time, lastTime) {
    if (lastTime != null) {
      angle += (time - lastTime) * 0.001;
    }
    cat.style.top = (Math.sin(angle) * 20) + "px";
    cat.style.left = (Math.cos(angle) * 200) + "px";
    requestAnimationFrame(newTime => animate(newTime, time));
  }
  requestAnimationFrame(animate);
</script>
```

{{if book

A seta cinza mostra o caminho ao longo do qual a imagem se move.

{{figure {url: "img/cat-animation.png", alt: "A diagram showing a picture of a cat with a circular arrow indicating its motion", width: "8cm"}}}

if}}

{{index "top (CSS)", "left (CSS)", centering, "relative positioning"}}

Nossa imagem está centralizada na página e tem `position` definida como `relative`. Atualizaremos repetidamente os estilos `top` e `left` dessa imagem para movê-la.

{{index "requestAnimationFrame function", drawing, animation}}

{{id animationFrame}}

O script usa `requestAnimationFrame` para agendar a função `animate` para rodar sempre que o navegador estiver pronto para repintar a tela. A própria função `animate` chama `requestAnimationFrame` novamente para agendar a próxima atualização. Quando a janela (ou aba) do navegador está ativa, isso causará atualizações a uma taxa de cerca de 60 por segundo, o que tende a produzir uma animação de boa aparência.

{{index timeline, blocking}}

Se apenas atualizássemos o DOM em um loop, a página congelaria e nada apareceria na tela. Navegadores não atualizam seu display enquanto um programa JavaScript está rodando, nem permitem qualquer interação com a página. É por isso que precisamos de `requestAnimationFrame` — ele informa ao navegador que terminamos por agora, e ele pode prosseguir e fazer as coisas que navegadores fazem, como atualizar a tela e responder a ações do usuário.

{{index "smooth animation"}}

A função de animação recebe o ((tempo)) atual como argumento. Para garantir que o movimento do gato por milissegundo seja estável, ela baseia a velocidade na qual o ângulo muda na diferença entre o tempo atual e a última vez que a função foi executada. Se simplesmente movesse o ângulo por uma quantidade fixa por passo, o movimento engasgaria quando, por exemplo, outra tarefa pesada rodando no mesmo computador impedisse a função de rodar por uma fração de segundo.

{{index "Math.cos function", "Math.sin function", cosine, sine, trigonometry}}

{{id sin_cos}}

Mover-se em ((círculo))s é feito usando as funções trigonométricas `Math.cos` e `Math.sin`. Para aqueles que não estão familiarizados com estas, vou apresentá-las brevemente, já que as usaremos ocasionalmente neste livro.

{{index coordinates, pi}}

`Math.cos` e `Math.sin` são úteis para encontrar pontos que ficam em um círculo ao redor do ponto (0, 0) com raio 1. Ambas as funções interpretam seu argumento como a posição neste círculo, com 0 denotando o ponto no extremo direito do círculo, indo no sentido horário até que 2π (cerca de 6,28) tenha nos levado ao redor de todo o círculo. `Math.cos` diz a coordenada x do ponto que corresponde à posição dada, e `Math.sin` produz a coordenada y. Posições (ou ângulos) maiores que 2π ou menores que 0 são válidas — a rotação se repete, de modo que _a_+2π se refere ao mesmo ((ângulo)) que _a_.

{{index "PI constant"}}

Essa unidade para medir ângulos é chamada de ((radiano))s — um círculo completo é 2π radianos, similar a como são 360 graus quando medimos em graus. A constante π está disponível como `Math.PI` em JavaScript.

{{figure {url: "img/cos_sin.svg", alt: "Diagram showing the use of cosine and sine to compute coordinates. A circle with radius 1 is shown with two points on it. The angle from the right side of the circle to the point, in radians, is used to compute the position of each point by using 'cos(angle)' for the horizontal distance from the center of the circle and sin(angle) for the vertical distance.", width: "6cm"}}}

{{index "counter variable", "Math.sin function", "top (CSS)", "Math.cos function", "left (CSS)", ellipse}}

O código de animação do gato mantém um contador, `angle`, para o ângulo atual da animação e o incrementa toda vez que a função `animate` é chamada. Ele pode então usar esse ângulo para calcular a posição atual do elemento de imagem. O estilo `top` é calculado com `Math.sin` e multiplicado por 20, que é o raio vertical da nossa elipse. O estilo `left` é baseado em `Math.cos` e multiplicado por 200, de modo que a elipse é muito mais larga do que alta.

{{index "unit (CSS)"}}

Note que estilos geralmente precisam de _unidades_. Neste caso, temos que acrescentar `"px"` ao número para dizer ao navegador que estamos contando em ((pixel))s (em oposição a centímetros, "ems" ou outras unidades). Isso é fácil de esquecer. Usar números sem unidades fará com que seu estilo seja ignorado — a menos que o número seja 0, que sempre significa a mesma coisa, independentemente da unidade.

## Resumo

Programas JavaScript podem inspecionar e interferir no documento que o navegador está exibindo através de uma estrutura de dados chamada DOM. Essa estrutura de dados representa o modelo do documento pelo navegador, e um programa JavaScript pode modificá-la para alterar o documento visível.

O DOM é organizado como uma árvore, onde elementos são arranjados hierarquicamente de acordo com a estrutura do documento. Os objetos representando elementos têm propriedades como `parentNode` e `childNodes`, que podem ser usadas para navegar por essa árvore.

A forma como um documento é exibido pode ser influenciada por _estilos_, tanto anexando estilos diretamente a nós quanto definindo regras que correspondam a certos nós. Há muitas propriedades de estilo diferentes, como `color` ou `display`. Código JavaScript pode manipular o estilo de um elemento diretamente através de sua propriedade `style`.

## Exercícios

{{id exercise_table}}

### Construa uma tabela

{{index "table (HTML tag)"}}

Uma tabela HTML é construída com a seguinte estrutura de tags:

```{lang: html}
<table>
  <tr>
    <th>name</th>
    <th>height</th>
    <th>place</th>
  </tr>
  <tr>
    <td>Kilimanjaro</td>
    <td>5895</td>
    <td>Tanzania</td>
  </tr>
</table>
```

{{index "tr (HTML tag)", "th (HTML tag)", "td (HTML tag)"}}

Para cada _((linha))_, a tag `<table>` contém uma tag `<tr>`. Dentro dessas tags `<tr>`, podemos colocar elementos de célula: tanto células de cabeçalho (`<th>`) quanto células regulares (`<td>`).

Dado um conjunto de dados de montanhas, um array de objetos com propriedades `name`, `height` e `place`, gere a estrutura DOM para uma tabela que enumere os objetos. Ela deve ter uma coluna por chave e uma linha por objeto, mais uma linha de cabeçalho com elementos `<th>` no topo, listando os nomes das colunas.

Escreva isso de forma que as colunas sejam automaticamente derivadas dos objetos, pegando os nomes das propriedades do primeiro objeto nos dados.

Mostre a tabela resultante no documento adicionando-a ao elemento que tem um atributo `id` de `"mountains"`.

{{index "right-aligning", "text-align (CSS)"}}

Quando tiver isso funcionando, alinhe à direita as células que contêm valores numéricos definindo sua propriedade `style.textAlign` como `"right"`.

{{if interactive

```{test: no, lang: html}
<h1>Mountains</h1>

<div id="mountains"></div>

<script>
  const MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
    {name: "Everest", height: 8848, place: "Nepal"},
    {name: "Mount Fuji", height: 3776, place: "Japan"},
    {name: "Vaalserberg", height: 323, place: "Netherlands"},
    {name: "Denali", height: 6168, place: "United States"},
    {name: "Popocatepetl", height: 5465, place: "Mexico"},
    {name: "Mont Blanc", height: 4808, place: "Italy/France"}
  ];

  // Seu código aqui
</script>
```

if}}

{{hint

{{index "createElement method", "table example", "appendChild method"}}

Você pode usar `document.createElement` para criar novos nós de elemento, `document.createTextNode` para criar nós de texto, e o método `appendChild` para colocar nós dentro de outros nós.

{{index "Object.keys function"}}

Você vai querer fazer um loop pelos nomes das chaves uma vez para preencher a linha do topo e depois novamente para cada objeto no array para construir as linhas de dados. Para obter um array de nomes de chaves do primeiro objeto, `Object.keys` será útil.

{{index "getElementById method", "querySelector method"}}

Para adicionar a tabela ao nó pai correto, você pode usar `document.getElementById` ou `document.querySelector` com `"#mountains"` para encontrar o nó.

hint}}

### Elementos por nome de tag

{{index "getElementsByTagName method", recursion}}

O método `document.getElementsByTagName` retorna todos os elementos filhos com um dado nome de tag. Implemente sua própria versão disso como uma função que recebe um nó e uma string (o nome da tag) como argumentos e retorna um array contendo todos os nós de elemento descendentes com o dado nome de tag. Sua função deve percorrer o documento por si mesma. Ela não pode usar um método como `querySelectorAll` para fazer o trabalho.

{{index "nodeName property", capitalization, "toLowerCase method", "toUpperCase method"}}

Para encontrar o nome da tag de um elemento, use sua propriedade `nodeName`. Mas note que isso retornará o nome da tag todo em maiúsculas. Use os métodos de string `toLowerCase` ou `toUpperCase` para compensar isso.

{{if interactive

```{lang: html, test: no}
<h1>Heading with a <span>span</span> element.</h1>
<p>A paragraph with <span>one</span>, <span>two</span>
  spans.</p>

<script>
  function byTagName(node, tagName) {
    // Seu código aqui.
  }

  console.log(byTagName(document.body, "h1").length);
  // → 1
  console.log(byTagName(document.body, "span").length);
  // → 3
  let para = document.querySelector("p");
  console.log(byTagName(para, "span").length);
  // → 2
</script>
```
if}}

{{hint

{{index "getElementsByTagName method", recursion}}

A solução é mais facilmente expressa com uma função recursiva, similar à [função `talksAbout`](dom#talksAbout) definida anteriormente neste capítulo.

{{index concatenation, "concat method", closure}}

Você poderia chamar `byTagname` recursivamente, concatenando os arrays resultantes para produzir a saída. Ou poderia criar uma função interna que se chama recursivamente e que tem acesso a uma vinculação de array definida na função externa, à qual ela pode adicionar os elementos correspondentes que encontra. Não esqueça de chamar a ((função interna)) uma vez a partir da função externa para iniciar o processo.

{{index "nodeType property", "ELEMENT_NODE code"}}

A função recursiva deve verificar o tipo do nó. Aqui estamos interessados apenas no tipo de nó 1 (`Node.ELEMENT_NODE`). Para tais nós, devemos fazer um loop pelos seus filhos e, para cada filho, verificar se o filho corresponde à consulta enquanto também fazemos uma chamada recursiva nele para inspecionar seus próprios filhos.

hint}}

### O chapéu do gato

{{index "cat's hat (exercise)", [animation, "spinning cat"]}}

Estenda a animação do gato definida [anteriormente](dom#animation) para que tanto o gato quanto seu chapéu (`<img src="img/hat.png">`) orbitem em lados opostos da elipse.

Ou faça o chapéu circular ao redor do gato. Ou altere a animação de alguma outra forma interessante.

{{index "absolute positioning", "top (CSS)", "left (CSS)", "position (CSS)"}}

Para facilitar o posicionamento de múltiplos objetos, você provavelmente vai querer mudar para posicionamento absoluto. Isso significa que `top` e `left` são contados em relação ao canto superior esquerdo do documento. Para evitar usar coordenadas negativas, que fariam a imagem se mover para fora da página visível, você pode adicionar um número fixo de pixels aos valores de posição.

{{if interactive

```{lang: html, test: no}
<style>body { min-height: 200px }</style>
<img src="img/cat.png" id="cat" style="position: absolute">
<img src="img/hat.png" id="hat" style="position: absolute">

<script>
  let cat = document.querySelector("#cat");
  let hat = document.querySelector("#hat");

  let angle = 0;
  let lastTime = null;
  function animate(time) {
    if (lastTime != null) angle += (time - lastTime) * 0.001;
    lastTime = time;
    cat.style.top = (Math.sin(angle) * 40 + 40) + "px";
    cat.style.left = (Math.cos(angle) * 200 + 230) + "px";

    // Suas extensões aqui.

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
</script>
```

if}}

{{hint

`Math.cos` e `Math.sin` medem ângulos em radianos, onde um círculo completo é 2π. Para um dado ângulo, você pode obter o ângulo oposto adicionando metade disso, que é `Math.PI`. Isso pode ser útil para colocar o chapéu no lado oposto da órbita.

hint}}
