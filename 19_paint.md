{{meta {load_files: ["code/chapter/19_paint.js"], zip: "html include=[\"css/paint.css\"]"}}}

# Projeto: Um Editor de Pixel Art

{{quote {author: "Joan Miró", chapter: true}

Olho para as muitas cores diante de mim. Olho para minha tela em branco. Então, tento aplicar cores como palavras que formam poemas, como notas que formam música.

quote}}

{{index "Miró, Joan", "drawing program example", "project chapter"}}

{{figure {url: "img/chapter_picture_19.jpg", alt: "Illustration showing a mosaic of black tiles, with jars of other tiles next to it", chapter: "framed"}}}

O material dos capítulos anteriores lhe dá todos os elementos necessários para construir uma ((aplicação web)) básica. Neste capítulo, faremos exatamente isso.

{{index [file, image]}}

Nossa ((aplicação)) será um programa de ((desenho)) de ((pixel))s que permite modificar uma imagem pixel por pixel manipulando uma visão ampliada dela, mostrada como uma grade de quadrados coloridos. Você pode usar o programa para abrir arquivos de imagem, rabiscar neles com o mouse ou outro dispositivo apontador e salvá-los. É assim que ele vai parecer:

{{figure {url: "img/pixel_editor.png", alt: "Screenshot of the pixel editor interface, with a grid of colored pixels at the top and a number of controls, in the form of HTML fields and buttons, below that", width: "8cm"}}}

Pintar em um computador é ótimo. Você não precisa se preocupar com materiais, ((habilidade)) ou talento. É só começar a borrar e ver onde você chega.

## Componentes

{{index drawing, "select (HTML tag)", "canvas (HTML tag)", component}}

A interface da aplicação mostra um grande elemento `<canvas>` no topo, com vários ((campo))s de formulário abaixo dele. O usuário desenha na ((imagem)) selecionando uma ferramenta em um campo `<select>` e depois clicando, ((tocando)) ou ((arrastando)) sobre o canvas. Existem ((ferramenta))s para desenhar pixels individuais ou retângulos, para preencher uma área e para selecionar uma ((cor)) da imagem.

{{index [DOM, components]}}

Vamos estruturar a interface do editor como vários _((componente))s_, objetos que são responsáveis por uma parte do DOM e que podem conter outros componentes dentro de si.

{{index [state, "of application"]}}

O estado da aplicação consiste na imagem atual, na ferramenta selecionada e na cor selecionada. Vamos configurar as coisas para que o estado viva em um único valor e os componentes da interface sempre baseiem sua aparência no estado atual.

Para ver por que isso é importante, vamos considerar a alternativa — distribuir partes do estado pela interface. Até certo ponto, isso é mais fácil de programar. Podemos simplesmente colocar um ((campo de cor)) e ler seu valor quando precisarmos saber a cor atual.

Mas então adicionamos o ((seletor de cor)) — uma ferramenta que permite clicar na imagem para selecionar a cor de um determinado pixel. Para manter o campo de cor mostrando a cor correta, essa ferramenta precisaria saber que o campo de cor existe e atualizá-lo sempre que escolher uma nova cor. Se você adicionar outro lugar que torne a cor visível (talvez o cursor do mouse pudesse mostrá-la), teria que atualizar seu código de mudança de cor para manter isso sincronizado também.

{{index modularity}}

Na prática, isso cria um problema onde cada parte da interface precisa saber sobre todas as outras partes, o que não é muito modular. Para aplicações pequenas como a deste capítulo, isso pode não ser um problema. Para projetos maiores, pode se tornar um verdadeiro pesadelo.

Para evitar esse pesadelo por princípio, vamos ser rigorosos sobre o _((fluxo de dados))_. Existe um estado, e a interface é desenhada com base nesse estado. Um componente da interface pode responder a ações do usuário atualizando o estado, momento em que os componentes têm a chance de se sincronizar com este novo estado.

{{index library, framework}}

Na prática, cada ((componente)) é configurado de forma que, quando recebe um novo estado, ele também notifica seus componentes filhos, na medida em que precisem ser atualizados. Configurar isso é um pouco trabalhoso. Tornar isso mais conveniente é o principal ponto de venda de muitas bibliotecas de programação para navegador. Mas para uma aplicação pequena como esta, podemos fazer sem tal infraestrutura.

{{index [state, transitions]}}

Atualizações ao estado são representadas como objetos, que chamaremos de _((ações))_. Componentes podem criar tais ações e _((despachar))_-las — dá-las a uma função central de gerenciamento de estado. Essa função calcula o próximo estado, após o que os componentes da interface se atualizam para este novo estado.

{{index [DOM, components]}}

Estamos pegando a tarefa confusa de rodar uma ((interface de usuário)) e aplicando ((estrutura)) a ela. Embora as partes relacionadas ao DOM ainda estejam cheias de ((efeito colateral))s, elas são sustentadas por uma espinha dorsal conceitualmente simples: o ciclo de atualização de estado. O estado determina a aparência do DOM, e a única forma de eventos DOM mudarem o estado é despachando ações ao estado.

{{index "data flow"}}

Existem _muitas_ variantes desta abordagem, cada uma com seus próprios benefícios e problemas, mas a ideia central é a mesma: mudanças de estado devem passar por um único canal bem definido, não acontecer em todo lugar.

{{index "dom property", [interface, object]}}

Nossos ((componente))s serão ((classe))s conformando a uma interface. Seu construtor recebe um estado — que pode ser o estado completo da aplicação ou algum valor menor se não precisar de acesso a tudo — e usa isso para construir uma propriedade `dom`. Este é o elemento DOM que representa o componente. A maioria dos construtores também receberá alguns outros valores que não mudam ao longo do tempo, como a função que podem usar para ((despachar)) uma ação.

{{index "syncState method"}}

Cada componente tem um método `syncState` que é usado para sincronizá-lo com um novo valor de estado. O método recebe um argumento, o estado, que é do mesmo tipo que o primeiro argumento de seu construtor.

## O estado

{{index "Picture class", "picture property", "tool property", "color property"}}

O estado da aplicação será um objeto com propriedades `picture`, `tool` e `color`. A imagem é em si um objeto que armazena a largura, altura e conteúdo de pixels da imagem. Os ((pixel))s são armazenados em um único array, linha por linha, de cima para baixo.

```{includeCode: true}
class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  draw(pixels) {
    let copy = this.pixels.slice();
    for (let {x, y, color} of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}
```

{{index "side effect", "persistent data structure"}}

Queremos poder tratar uma imagem como um valor ((imutável)), por razões às quais voltaremos mais adiante no capítulo. Mas também precisamos às vezes atualizar um monte de pixels de uma vez. Para poder fazer isso, a classe tem um método `draw` que espera um array de pixels atualizados — objetos com propriedades `x`, `y` e `color` — e cria uma nova imagem com esses pixels sobrescritos. Este método usa `slice` sem argumentos para copiar o array de pixels inteiro — o início do slice é padrão 0, e o fim é padrão o comprimento do array.

{{index "Array constructor", "fill method", ["length property", "for array"], [array, creation]}}

O método `empty` usa duas funcionalidades de array que não vimos antes. O construtor `Array` pode ser chamado com um número para criar um array vazio do comprimento dado. O método `fill` pode então ser usado para preencher este array com um valor dado. Estes são usados para criar um array no qual todos os pixels têm a mesma cor.

{{index "hexadecimal number", "color component", "color field", "fillStyle property"}}

Cores são armazenadas como strings contendo ((código de cor))s ((CSS)) tradicionais compostos por um ((sinal de hash)) (`#`) seguido por seis dígitos hexadecimais (base 16) — dois para o componente ((vermelho)), dois para o componente ((verde)) e dois para o componente ((azul)). Esta é uma forma um tanto críptica e inconveniente de escrever cores, mas é o formato que o campo de entrada de cor HTML usa, e pode ser usado na propriedade `fillStyle` de um contexto de desenho canvas, então para as formas como usaremos cores neste programa, é prático o suficiente.

{{index black}}

Preto, onde todos os componentes são zero, é escrito `"#000000"`, e ((rosa)) brilhante se parece com `"#ff00ff"`, onde os componentes vermelho e azul têm o valor máximo de 255, escrito `ff` em ((dígitos)) hexadecimais (que usam _a_ a _f_ para representar dígitos 10 a 15).

{{index [state, transitions]}}

Vamos permitir que a interface ((despache)) ((ações)) como objetos cujas propriedades sobrescrevem as propriedades do estado anterior. O campo de cor, quando o usuário o muda, poderia despachar um objeto como `{color: field.value}`, a partir do qual esta função de atualização pode calcular um novo estado.

{{index "updateState function"}}

```{includeCode: true}
function updateState(state, action) {
  return {...state, ...action};
}
```

{{index "period character"}}

Este padrão, no qual ((spread)) de objeto é usado para primeiro adicionar as propriedades de um objeto existente e então sobrescrever algumas delas, é comum em código JavaScript que usa objetos ((imutáveis)).

## Construção de DOM

{{index "createElement method", "elt function", [DOM, construction]}}

Uma das principais coisas que componentes de interface fazem é criar estrutura DOM. Novamente não queremos usar os métodos verbosos do DOM diretamente para isso, então aqui está uma versão ligeiramente expandida da função `elt`:

```{includeCode: true}
function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}
```

{{index "setAttribute method", "attribute", "onclick property", "click event", "event handling"}}

A principal diferença entre esta versão e a que usamos no [Capítulo ?](game#domdisplay) é que ela atribui _propriedades_ a nós DOM, não _atributos_. Isso significa que não podemos usá-la para definir atributos arbitrários, mas _podemos_ usá-la para definir propriedades cujo valor não é uma string, como `onclick`, que pode ser definido como uma função para registrar um manipulador de evento de clique.

{{index "button (HTML tag)"}}

Isso permite este estilo conveniente para registrar manipuladores de eventos:

```{lang: html}
<body>
  <script>
    document.body.appendChild(elt("button", {
      onclick: () => console.log("click")
    }, "The button"));
  </script>
</body>
```

## O canvas

O primeiro componente que vamos definir é a parte da interface que exibe a imagem como uma grade de caixas coloridas. Este componente é responsável por duas coisas: mostrar uma imagem e comunicar ((eventos de ponteiro)) nessa imagem ao resto da aplicação.

{{index "PictureCanvas class", "callback function", "scale constant", "canvas (HTML tag)", "mousedown event", "touchstart event", [state, "of application"]}}

Portanto, podemos defini-lo como um componente que só sabe sobre a imagem atual, não o estado completo da aplicação. Porque ele não sabe como a aplicação funciona no geral, não pode despachar ((ações)) diretamente. Em vez disso, ao responder a eventos de ponteiro, ele chama uma função de callback fornecida pelo código que o criou, que tratará as partes específicas da aplicação.

```{includeCode: true}
const scale = 10;

class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }
}
```

{{index "syncState method", efficiency}}

Desenhamos cada pixel como um quadrado de 10 por 10, conforme determinado pela constante `scale`. Para evitar trabalho desnecessário, o componente mantém registro de sua imagem atual e só faz um redesenho quando `syncState` recebe uma nova imagem.

{{index "drawPicture function"}}

A função de desenho real define o tamanho do canvas com base na escala e no tamanho da imagem e o preenche com uma série de quadrados, um para cada pixel.

```{includeCode: true}
function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}
```

{{index "mousedown event", "mousemove event", "button property", "buttons property", "pointerPosition function"}}

Quando o botão esquerdo do mouse é pressionado enquanto o mouse está sobre o canvas da imagem, o componente chama o callback `pointerDown`, dando-lhe a posição do pixel que foi clicado — em coordenadas da imagem. Isso será usado para implementar a interação do mouse com a imagem. O callback pode retornar outra função de callback para ser notificada quando o ponteiro é movido para um pixel diferente enquanto o botão está pressionado.

```{includeCode: true}
PictureCanvas.prototype.mouse = function(downEvent, onDown) {
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);
  if (!onMove) return;
  let move = moveEvent => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener("mousemove", move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  this.dom.addEventListener("mousemove", move);
};

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {x: Math.floor((pos.clientX - rect.left) / scale),
          y: Math.floor((pos.clientY - rect.top) / scale)};
}
```

{{index "getBoundingClientRect method", "clientX property", "clientY property"}}

Como sabemos o tamanho dos ((pixel))s e podemos usar `getBoundingClientRect` para encontrar a posição do canvas na tela, é possível converter de coordenadas de eventos do mouse (`clientX` e `clientY`) para coordenadas da imagem. Estas são sempre arredondadas para baixo para que se refiram a um pixel específico.

{{index "touchstart event", "touchmove event", "preventDefault method"}}

Com eventos de toque, temos que fazer algo semelhante, mas usando eventos diferentes e nos certificando de chamar `preventDefault` no evento `"touchstart"` para prevenir ((deslizamento)).

```{includeCode: true}
PictureCanvas.prototype.touch = function(startEvent,
                                         onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;
  let move = moveEvent => {
    let newPos = pointerPosition(moveEvent.touches[0],
                                 this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };
  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};
```

{{index "touches property", "clientX property", "clientY property"}}

Para eventos de toque, `clientX` e `clientY` não estão disponíveis diretamente no objeto do evento, mas podemos usar as coordenadas do primeiro objeto de toque na propriedade `touches`.

## A aplicação

Para tornar possível construir a aplicação peça por peça, vamos implementar o componente principal como um invólucro ao redor de um canvas de imagem e um conjunto dinâmico de ((ferramenta))s e ((controle))s que passamos ao seu construtor.

Os _controles_ são os elementos de interface que aparecem abaixo da imagem. Eles serão fornecidos como um array de construtores de ((componente))s.

{{index "br (HTML tag)", "flood fill", "select (HTML tag)", "PixelEditor class", dispatch}}

As _ferramentas_ fazem coisas como desenhar pixels ou preencher uma área. A aplicação mostra o conjunto de ferramentas disponíveis como um campo `<select>`. A ferramenta atualmente selecionada determina o que acontece quando o usuário interage com a imagem com um dispositivo apontador. O conjunto de ferramentas disponíveis é fornecido como um objeto que mapeia os nomes que aparecem no campo dropdown para funções que implementam as ferramentas. Tais funções recebem uma posição na imagem, um estado atual da aplicação e uma função `dispatch` como argumentos. Elas podem retornar uma função de manipulador de movimento que é chamada com uma nova posição e um estado atual quando o ponteiro se move para um pixel diferente.

```{includeCode: true}
class PixelEditor {
  constructor(state, config) {
    let {tools, controls, dispatch} = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
    });
    this.controls = controls.map(
      Control => new Control(state, config));
    this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                   ...this.controls.reduce(
                     (a, c) => a.concat(" ", c.dom), []));
  }
  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}
```

O manipulador de ponteiro dado a `PictureCanvas` chama a ferramenta atualmente selecionada com os argumentos apropriados e, se isso retornar um manipulador de movimento, o adapta para também receber o estado.

{{index "reduce method", "map method", [whitespace, "in HTML"], "syncState method"}}

Todos os controles são construídos e armazenados em `this.controls` para que possam ser atualizados quando o estado da aplicação muda. A chamada a `reduce` introduz espaços entre os elementos DOM dos controles. Dessa forma, eles não parecem tão apertados juntos.

{{index "select (HTML tag)", "change event", "ToolSelect class", "syncState method"}}

O primeiro controle é o menu de seleção de ((ferramenta)). Ele cria um elemento `<select>` com uma opção para cada ferramenta e configura um manipulador de evento `"change"` que atualiza o estado da aplicação quando o usuário seleciona uma ferramenta diferente.

```{includeCode: true}
class ToolSelect {
  constructor(state, {tools, dispatch}) {
    this.select = elt("select", {
      onchange: () => dispatch({tool: this.select.value})
    }, ...Object.keys(tools).map(name => elt("option", {
      selected: name == state.tool
    }, name)));
    this.dom = elt("label", null, "🖌 Tool: ", this.select);
  }
  syncState(state) { this.select.value = state.tool; }
}
```

{{index "label (HTML tag)"}}

Ao envolver o texto do rótulo e o campo em um elemento `<label>`, dizemos ao navegador que o rótulo pertence àquele campo, para que você possa, por exemplo, clicar no rótulo para focar o campo.

{{index "color field", "input (HTML tag)"}}

Também precisamos poder mudar a cor, então vamos adicionar um controle para isso. Um elemento HTML `<input>` com um atributo `type` de `color` nos dá um campo de formulário especializado em selecionar cores. O valor de tal campo é sempre um código de cor CSS no formato `"#RRGGBB"` (vermelho, verde e azul, dois dígitos por cor). O navegador mostrará uma interface de ((seletor de cor)) quando o usuário interagir com ele.

{{if book

Dependendo do navegador, o seletor de cor pode parecer assim:

{{figure {url: "img/color-field.png", alt: "Screenshot of color field", width: "6cm"}}}

if}}

{{index "ColorSelect class", "syncState method"}}

Este ((controle)) cria tal campo e o conecta para ficar sincronizado com a propriedade `color` do estado da aplicação.

```{includeCode: true}
class ColorSelect {
  constructor(state, {dispatch}) {
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({color: this.input.value})
    });
    this.dom = elt("label", null, "🎨 Color: ", this.input);
  }
  syncState(state) { this.input.value = state.color; }
}
```

## Ferramentas de desenho

Antes de podermos desenhar qualquer coisa, precisamos implementar as ((ferramenta))s que controlarão a funcionalidade de eventos de mouse ou toque no canvas.

{{index "draw function"}}

A ferramenta mais básica é a ferramenta de desenho, que muda qualquer ((pixel)) que você clicar ou tocar para a cor atualmente selecionada. Ela despacha uma ação que atualiza a imagem para uma versão na qual o pixel apontado recebe a cor atualmente selecionada.

```{includeCode: true}
function draw(pos, state, dispatch) {
  function drawPixel({x, y}, state) {
    let drawn = {x, y, color: state.color};
    dispatch({picture: state.picture.draw([drawn])});
  }
  drawPixel(pos, state);
  return drawPixel;
}
```

A função chama imediatamente a função `drawPixel` mas também a retorna para que seja chamada novamente para pixels recém-tocados quando o usuário arrasta ou ((desliza)) sobre a imagem.

{{index "rectangle function"}}

Para desenhar formas maiores, pode ser útil criar ((retângulo))s rapidamente. A ((ferramenta)) `rectangle` desenha um retângulo entre o ponto onde você começa a ((arrastar)) e o ponto para o qual arrasta.

```{includeCode: true}
function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({x, y, color: state.color});
      }
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawRectangle(start);
  return drawRectangle;
}
```

{{index "persistent data structure", [state, persistence]}}

Um detalhe importante nesta implementação é que ao arrastar, o retângulo é redesenhado na imagem a partir do estado _original_. Dessa forma, você pode aumentar e diminuir o retângulo novamente enquanto o cria, sem os retângulos intermediários ficando na imagem final. Esta é uma das razões pelas quais objetos de imagem ((imutáveis)) são úteis — veremos outra razão mais adiante.

Implementar o ((preenchimento)) é um pouco mais complexo. Esta é uma ((ferramenta)) que preenche o pixel sob o ponteiro e todos os pixels adjacentes que têm a mesma cor. "Adjacente" significa diretamente adjacente horizontal ou verticalmente, não diagonalmente. Esta imagem ilustra o conjunto de ((pixel))s coloridos quando a ferramenta de preenchimento é usada no pixel marcado:

{{figure {url: "img/flood-grid.svg", alt: "Diagram of a pixel grid showing the area filled by a flood fill operation", width: "6cm"}}}

{{index "fill function"}}

Curiosamente, a forma como faremos isso se parece um pouco com o código de busca de caminhos do [Capítulo ?](robot). Enquanto aquele código buscava em um grafo para encontrar uma rota, este código busca em uma grade para encontrar todos os pixels "conectados". O problema de manter o rastreamento de um conjunto ramificado de possíveis rotas é semelhante.

```{includeCode: true}
const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
                {dx: 0, dy: -1}, {dx: 0, dy: 1}];

function fill({x, y}, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{x, y, color: state.color}];
  let visited = new Set();
  for (let done = 0; done < drawn.length; done++) {
    for (let {dx, dy} of around) {
      let x = drawn[done].x + dx, y = drawn[done].y + dy;
      if (x >= 0 && x < state.picture.width &&
          y >= 0 && y < state.picture.height &&
          !visited.has(x + "," + y) &&
          state.picture.pixel(x, y) == targetColor) {
        drawn.push({x, y, color: state.color});
        visited.add(x + "," + y);
      }
    }
  }
  dispatch({picture: state.picture.draw(drawn)});
}
```

O array de pixels desenhados funciona como a ((lista de trabalho)) da função. Para cada pixel alcançado, temos que ver se algum pixel adjacente tem a mesma cor e não foi já pintado. O contador do loop fica atrás do comprimento do array `drawn` conforme novos pixels são adicionados. Quaisquer pixels à frente dele ainda precisam ser explorados. Quando ele alcança o comprimento, não restam pixels inexplorados, e a função termina.

{{index "pick function"}}

A ((ferramenta)) final é um ((seletor de cor)), que permite apontar para uma cor na imagem para usá-la como a cor de desenho atual.

```{includeCode: true}
function pick(pos, state, dispatch) {
  dispatch({color: state.picture.pixel(pos.x, pos.y)});
}
```

{{if interactive

Agora podemos testar nossa aplicação!

```{lang: html}
<div></div>
<script>
  let state = {
    tool: "draw",
    color: "#000000",
    picture: Picture.empty(60, 30, "#f0f0f0")
  };
  let app = new PixelEditor(state, {
    tools: {draw, fill, rectangle, pick},
    controls: [ToolSelect, ColorSelect],
    dispatch(action) {
      state = updateState(state, action);
      app.syncState(state);
    }
  });
  document.querySelector("div").appendChild(app.dom);
</script>
```

if}}

## Salvando e carregando

{{index "SaveButton class", "drawPicture function", [file, image]}}

Quando tivermos desenhado nossa obra-prima, vamos querer salvá-la para depois. Devemos adicionar um botão para ((baixar)) a imagem atual como arquivo de imagem. Este ((controle)) fornece esse botão:

```{includeCode: true}
class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt("button", {
      onclick: () => this.save()
    }, "💾 Save");
  }
  save() {
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png"
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  syncState(state) { this.picture = state.picture; }
}
```

{{index "canvas (HTML tag)"}}

O componente mantém o rastreamento da imagem atual para que possa acessá-la ao salvar. Para criar o arquivo de imagem, ele usa um elemento `<canvas>` no qual desenha a imagem (em uma escala de um pixel por pixel).

{{index "toDataURL method", "data URL"}}

O método `toDataURL` em um elemento canvas cria uma URL que usa o esquema `data:`. Diferente de URLs `http:` e `https:`, URLs de dados contêm o recurso inteiro na URL. Elas geralmente são muito longas, mas nos permitem criar links funcionais para imagens arbitrárias, aqui mesmo no navegador.

{{index "a (HTML tag)", "download attribute"}}

Para realmente fazer o navegador baixar a imagem, então criamos um elemento de ((link)) que aponta para esta URL e tem um atributo `download`. Tais links, quando clicados, fazem o navegador mostrar um diálogo de salvar arquivo. Adicionamos esse link ao documento, simulamos um clique nele e o removemos novamente. Você pode fazer muita coisa com tecnologia de ((navegador)), mas às vezes a forma de fazer é bastante estranha.

{{index "LoadButton class", control, [file, image]}}

E fica pior. Também vamos querer poder carregar arquivos de imagem existentes em nossa aplicação. Para isso, novamente definimos um componente de botão.

```{includeCode: true}
class LoadButton {
  constructor(_, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => startLoad(dispatch)
    }, "📁 Load");
  }
  syncState() {}
}

function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch)
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}
```

{{index [file, access], "input (HTML tag)"}}

Para acessar um arquivo no computador do usuário, precisamos que o usuário selecione o arquivo através de um campo de entrada de arquivo. Mas não queremos que o botão de carregar pareça um campo de entrada de arquivo, então criamos o campo de entrada de arquivo quando o botão é clicado e então fingimos que esse campo de entrada de arquivo foi clicado.

{{index "FileReader class", "img (HTML tag)", "readAsDataURL method", "Picture class"}}

Quando o usuário selecionou um arquivo, podemos usar `FileReader` para acessar seu conteúdo, novamente como uma ((URL de dados)). Essa URL pode ser usada para criar um elemento `<img>`, mas como não podemos acessar diretamente os pixels em tal imagem, não podemos criar um objeto `Picture` a partir dela.

```{includeCode: true}
function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () => dispatch({
        picture: pictureFromImage(image)
      }),
      src: reader.result
    });
  });
  reader.readAsDataURL(file);
}
```

{{index "canvas (HTML tag)", "getImageData method", "pictureFromImage function"}}

Para acessar os pixels, devemos primeiro desenhar a imagem em um elemento `<canvas>`. O contexto do canvas tem um método `getImageData` que permite a um script ler seus ((pixel))s. Então, uma vez que a imagem está no canvas, podemos acessá-la e construir um objeto `Picture`.

```{includeCode: true}
function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt("canvas", {width, height});
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let {data} = cx.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}
```

Vamos limitar o tamanho das imagens a 100 por 100 pixels, já que qualquer coisa maior vai parecer _enorme_ em nossa exibição e pode desacelerar a interface.

{{index "getImageData method", color, transparency}}

A propriedade `data` do objeto retornado por `getImageData` é um array de componentes de cor. Para cada pixel no retângulo especificado pelos argumentos, ela contém quatro valores que representam os componentes vermelho, verde, azul e _((alfa))_ da cor do pixel, como números entre 0 e 255. A parte alfa representa opacidade — quando é 0, o pixel é totalmente transparente, e quando é 255, é totalmente opaco. Para nosso propósito, podemos ignorá-la.

{{index "hexadecimal number", "toString method"}}

Os dois dígitos hexadecimais por componente, como usados em nossa notação de cor, correspondem precisamente ao intervalo de 0 a 255 — dois dígitos de base 16 podem expressar 16^2^ = 256 números diferentes. O método `toString` dos números pode receber uma base como argumento, então `n.toString(16)` produzirá uma representação em string em base 16. Temos que nos certificar de que cada número ocupe dois dígitos, então a função auxiliar `hex` chama `padStart` para adicionar um 0 inicial quando necessário.

Agora podemos carregar e salvar! Resta apenas mais um recurso antes de terminarmos.

## Histórico de desfazer

{{index "persistent data structure", [state, "of application"]}}

Metade do processo de edição é cometer pequenos erros e corrigi-los, então um recurso importante em um programa de desenho é um ((histórico de desfazer)).

Para poder desfazer mudanças, precisamos armazenar versões anteriores da imagem. Como as imagens são valores ((imutáveis)), isso é fácil. Mas requer um campo adicional no estado da aplicação.

{{index "done property"}}

Vamos adicionar um array `done` para manter versões anteriores da ((imagem)). Manter esta propriedade requer uma função de atualização de estado mais complicada que adiciona imagens ao array.

{{index "doneAt property", "historyUpdateState function", "Date.now function"}}

Não queremos armazenar _toda_ mudança — apenas mudanças que estejam separadas por uma certa quantidade de ((tempo)). Para poder fazer isso, vamos precisar de uma segunda propriedade, `doneAt`, para rastrear o momento em que armazenamos pela última vez uma imagem no histórico.

```{includeCode: true}
function historyUpdateState(state, action) {
  if (action.undo == true) {
    if (state.done.length == 0) return state;
    return {
      ...state,
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0
    };
  } else if (action.picture &&
             state.doneAt < Date.now() - 1000) {
    return {
      ...state,
      ...action,
      done: [state.picture, ...state.done],
      doneAt: Date.now()
    };
  } else {
    return {...state, ...action};
  }
}
```

{{index "undo history"}}

Quando a ação é uma ação de desfazer, a função pega a imagem mais recente do histórico e a torna a imagem atual. Ela define `doneAt` como zero para que a próxima mudança seja garantida de armazenar a imagem de volta no histórico, permitindo que você reverta para ela outra vez se quiser.

Caso contrário, se a ação contém uma nova imagem e a última vez que armazenamos algo foi há mais de um segundo (1000 milissegundos), as propriedades `done` e `doneAt` são atualizadas para armazenar a imagem anterior.

{{index "UndoButton class", control}}

O ((componente)) do botão de desfazer não faz muito. Ele despacha ações de desfazer quando clicado e se desabilita quando não há nada para desfazer.

```{includeCode: true}
class UndoButton {
  constructor(state, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => dispatch({undo: true}),
      disabled: state.done.length == 0
    }, "⮪ Undo");
  }
  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
}
```

## Vamos desenhar

{{index "PixelEditor class", "startState constant", "baseTools constant", "baseControls constant", "startPixelEditor function"}}

Para configurar a aplicação, precisamos criar um estado, um conjunto de ((ferramenta))s, um conjunto de ((controle))s e uma função de ((despacho)). Podemos passá-los ao construtor `PixelEditor` para criar o componente principal. Como vamos precisar criar vários editores nos exercícios, primeiro definimos algumas variáveis.

```{includeCode: true}
const startState = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
  done: [],
  doneAt: 0
};

const baseTools = {draw, fill, rectangle, pick};

const baseControls = [
  ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton
];

function startPixelEditor({state = startState,
                           tools = baseTools,
                           controls = baseControls}) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    }
  });
  return app.dom;
}
```

{{index "destructuring binding", "= operator", [property, access]}}

Ao desestruturar um objeto ou array, você pode usar `=` após um nome de variável para dar à variável um ((valor padrão)), que é usado quando a propriedade está faltando ou contém `undefined`. A função `startPixelEditor` faz uso disso para aceitar um objeto com várias propriedades opcionais como argumento. Se você não fornecer uma propriedade `tools`, por exemplo, `tools` será vinculada a `baseTools`.

É assim que colocamos um editor real na tela:

```{lang: html, startCode: true}
<div></div>
<script>
  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

{{if interactive

Vá em frente e desenhe algo.

if}}

## Por que isso é tão difícil?

A tecnologia de navegador é incrível. Ela fornece um poderoso conjunto de blocos de construção de interface, formas de estilizá-los e manipulá-los, e ferramentas para inspecionar e depurar suas aplicações. O software que você escreve para o ((navegador)) pode ser executado em quase todo computador e celular do planeta.

Ao mesmo tempo, a tecnologia de navegador é ridícula. Você precisa aprender um grande número de truques bobos e fatos obscuros para dominá-la, e o modelo de programação padrão que ela fornece é tão problemático que a maioria dos programadores prefere cobri-lo com várias camadas de ((abstração)) em vez de lidar com ele diretamente.

{{index standard, evolution}}

Embora a situação esteja definitivamente melhorando, ela o faz principalmente na forma de mais elementos sendo adicionados para resolver deficiências — criando ainda mais ((complexidade)). Um recurso usado por um milhão de websites não pode realmente ser substituído. Mesmo que pudesse, seria difícil decidir pelo que deveria ser substituído.

{{index "social factors", "economic factors", history}}

A tecnologia nunca existe no vácuo — somos limitados por nossas ferramentas e pelos fatores sociais, econômicos e históricos que as produziram. Isso pode ser irritante, mas é geralmente mais produtivo tentar construir um bom entendimento de como a realidade técnica _existente_ funciona — e por que ela é do jeito que é — do que se revoltar contra ela ou esperar por outra realidade.

Novas ((abstrações)) _podem_ ser úteis. O modelo de componentes e a convenção de ((fluxo de dados)) que usei neste capítulo é uma forma rudimentar disso. Como mencionado, existem bibliotecas que tentam tornar a programação de interface de usuário mais agradável. No momento da escrita, [React](https://reactjs.org/) e [Svelte](https://svelte.dev/) são escolhas populares, mas existe toda uma indústria artesanal de tais frameworks. Se você está interessado em programar aplicações web, recomendo investigar alguns deles para entender como funcionam e quais benefícios fornecem.

## Exercícios

Ainda há espaço para melhorias em nosso programa. Vamos adicionar mais alguns recursos como exercícios.

### Atalhos de teclado

{{index "keyboard bindings (exercise)"}}

Adicione ((atalhos de teclado)) à aplicação. A primeira letra do nome de uma ferramenta seleciona a ferramenta, e [ctrl]{keyname}-Z ou [command]{keyname}-Z ativa o desfazer.

{{index "PixelEditor class", "tabindex attribute", "elt function", "keydown event"}}

Faça isso modificando o componente `PixelEditor`. Adicione uma propriedade `tabIndex` de 0 ao elemento `<div>` que o envolve para que ele possa receber ((foco)) do teclado. Note que a _propriedade_ correspondente ao _atributo_ `tabindex` é chamada `tabIndex`, com um I maiúsculo, e nossa função `elt` espera nomes de propriedades. Registre os manipuladores de eventos de tecla diretamente nesse elemento. Isso significa que você precisa clicar, tocar ou ir com tab até a aplicação antes de poder interagir com ela pelo teclado.

{{index "ctrlKey property", "metaKey property", "control key", "command key"}}

Lembre-se de que eventos de teclado têm propriedades `ctrlKey` e `metaKey` (para [command]{keyname} no Mac) que você pode usar para ver se essas teclas estão pressionadas.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  // A classe PixelEditor original. Estenda o construtor.
  class PixelEditor {
    constructor(state, config) {
      let {tools, controls, dispatch} = config;
      this.state = state;

      this.canvas = new PictureCanvas(state.picture, pos => {
        let tool = tools[this.state.tool];
        let onMove = tool(pos, this.state, dispatch);
        if (onMove) {
          return pos => onMove(pos, this.state, dispatch);
        }
      });
      this.controls = controls.map(
        Control => new Control(state, config));
      this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                     ...this.controls.reduce(
                       (a, c) => a.concat(" ", c.dom), []));
    }
    syncState(state) {
      this.state = state;
      this.canvas.syncState(state.picture);
      for (let ctrl of this.controls) ctrl.syncState(state);
    }
  }

  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

if}}

{{hint

{{index "keyboard bindings (exercise)", "key property", "shift key"}}

A propriedade `key` de eventos para teclas de letras será a letra minúscula em si, se [shift]{keyname} não estiver pressionado. Não estamos interessados em eventos de tecla com [shift]{keyname} aqui.

{{index "keydown event"}}

Um manipulador `"keydown"` pode inspecionar seu objeto de evento para ver se corresponde a algum dos atalhos. Você pode obter automaticamente a lista de primeiras letras do objeto `tools` para que não precise escrevê-las manualmente.

{{index "preventDefault method"}}

Quando o evento de tecla corresponde a um atalho, chame `preventDefault` nele e ((despache)) a ação apropriada.

hint}}

### Desenho eficiente

{{index "efficient drawing (exercise)", "canvas (HTML tag)", efficiency}}

Durante o desenho, a maior parte do trabalho que nossa aplicação faz acontece em `drawPicture`. Criar um novo estado e atualizar o resto do DOM não é muito caro, mas repintar todos os pixels no canvas é bastante trabalho.

{{index "syncState method", "PictureCanvas class"}}

Encontre uma forma de tornar o método `syncState` de `PictureCanvas` mais rápido redesenhando apenas os pixels que realmente mudaram.

{{index "drawPicture function", compatibility}}

Lembre-se de que `drawPicture` também é usada pelo botão de salvar, então se você a modificar, certifique-se de que as mudanças não quebrem o uso antigo ou crie uma nova versão com um nome diferente.

{{index "width property", "height property"}}

Note também que mudar o tamanho de um elemento `<canvas>`, definindo suas propriedades `width` ou `height`, o limpa, tornando-o inteiramente transparente novamente.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  // Mude este método
  PictureCanvas.prototype.syncState = function(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  };

  // Você pode querer usar ou mudar isso também
  function drawPicture(picture, canvas, scale) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    let cx = canvas.getContext("2d");

    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

if}}

{{hint

{{index "efficient drawing (exercise)"}}

Este exercício é um bom exemplo de como estruturas de dados ((imutáveis)) podem tornar o código _mais rápido_. Como temos tanto a imagem antiga quanto a nova, podemos compará-las e redesenhar apenas os pixels que mudaram de cor, economizando mais de 99 por cento do trabalho de desenho na maioria dos casos.

{{index "drawPicture function"}}

Você pode escrever uma nova função `updatePicture` ou fazer `drawPicture` receber um argumento extra, que pode ser undefined ou a imagem anterior. Para cada ((pixel)), a função verifica se uma imagem anterior foi passada com a mesma cor nessa posição e pula o pixel quando esse for o caso.

{{index "width property", "height property", "canvas (HTML tag)"}}

Como o canvas é limpo quando mudamos seu tamanho, você também deve evitar tocar em suas propriedades `width` e `height` quando a imagem antiga e a nova têm o mesmo tamanho. Se forem diferentes, o que acontecerá quando uma nova imagem foi carregada, você pode definir a variável que guarda a imagem antiga como `null` depois de mudar o tamanho do canvas porque não deve pular nenhum pixel depois de mudar o tamanho do canvas.

hint}}

### Círculos

{{index "circles (exercise)", dragging}}

Defina uma ((ferramenta)) chamada `circle` que desenha um círculo preenchido quando você arrasta. O centro do círculo fica no ponto onde o gesto de arrastar ou toque começa, e seu ((raio)) é determinado pela distância arrastada.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  function circle(pos, state, dispatch) {
    // Seu código aqui
  }

  let dom = startPixelEditor({
    tools: {...baseTools, circle}
  });
  document.querySelector("div").appendChild(dom);
</script>
```

if}}

{{hint

{{index "circles (exercise)", "rectangle function"}}

Você pode se inspirar na ferramenta `rectangle`. Como naquela ferramenta, você vai querer continuar desenhando na imagem _inicial_, em vez da imagem atual, quando o ponteiro se move.

Para descobrir quais pixels colorir, você pode usar o ((Teorema de Pitágoras)). Primeiro descubra a distância entre a posição atual do ponteiro e a posição inicial pegando a raiz quadrada (`Math.sqrt`) da soma do quadrado (`x ** 2`) da diferença em coordenadas x e do quadrado da diferença em coordenadas y. Depois percorra um quadrado de pixels ao redor da posição inicial, cujos lados tenham pelo menos o dobro do ((raio)), e colora aqueles que estão dentro do raio do círculo, novamente usando a fórmula de Pitágoras para calcular sua ((distância)) do centro.

Certifique-se de não tentar colorir pixels que estão fora dos limites da imagem.

hint}}

### Linhas corretas

{{index "proper lines (exercise)", "line drawing"}}

Este é um exercício mais avançado que os três anteriores, e vai exigir que você projete uma solução para um problema não trivial. Certifique-se de ter bastante tempo e ((paciência)) antes de começar a trabalhar neste exercício, e não desanime com falhas iniciais.

{{index "draw function", "mousemove event", "touchmove event"}}

Na maioria dos navegadores, quando você seleciona a ((ferramenta)) `draw` e arrasta rapidamente pela imagem, não obtém uma linha fechada. Em vez disso, obtém pontos com espaços entre eles porque os eventos `"mousemove"` ou `"touchmove"` não dispararam rápido o suficiente para atingir cada ((pixel)).

Melhore a ferramenta `draw` para fazê-la desenhar uma linha completa. Isso significa que você tem que fazer a função manipuladora de movimento lembrar a posição anterior e conectá-la à atual.

Para fazer isso, já que os pixels podem estar a uma distância arbitrária, você terá que escrever uma função geral de desenho de linha.

Uma linha entre dois pixels é uma cadeia conectada de pixels, tão reta quanto possível, indo do início ao fim. Pixels diagonalmente adjacentes contam como conectados. Uma linha inclinada deve parecer com a imagem da esquerda, não a imagem da direita.

{{figure {url: "img/line-grid.svg", alt: "Diagram of two pixelated lines, one light, skipping across pixels diagonally, and one heavy, with all pixels connected horizontally or vertically", width: "6cm"}}}

Finalmente, se temos código que desenha uma linha entre dois pontos arbitrários, podemos também usá-lo para definir uma ferramenta `line`, que desenha uma linha reta entre o início e o fim de um arraste.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  // A ferramenta de desenho antiga. Reescreva isso.
  function draw(pos, state, dispatch) {
    function drawPixel({x, y}, state) {
      let drawn = {x, y, color: state.color};
      dispatch({picture: state.picture.draw([drawn])});
    }
    drawPixel(pos, state);
    return drawPixel;
  }

  function line(pos, state, dispatch) {
    // Seu código aqui
  }

  let dom = startPixelEditor({
    tools: {draw, line, fill, rectangle, pick}
  });
  document.querySelector("div").appendChild(dom);
</script>
```

if}}

{{hint

{{index "proper lines (exercise)", "line drawing"}}

O problema de desenhar uma linha pixelada é que na verdade são quatro problemas semelhantes mas ligeiramente diferentes. Desenhar uma linha horizontal da esquerda para a direita é fácil — você itera sobre as coordenadas x e colore um pixel a cada passo. Se a linha tem uma inclinação leve (menos de 45 graus ou ¼π radianos), você pode interpolar a coordenada y ao longo da inclinação. Você ainda precisa de um pixel por posição _x_, com a posição _y_ desses pixels determinada pela inclinação.

Mas assim que sua inclinação ultrapassa 45 graus, você precisa trocar a forma como trata as coordenadas. Agora você precisa de um pixel por posição _y_, já que a linha sobe mais do que vai para o lado. E então, quando você ultrapassa 135 graus, tem que voltar a iterar sobre as coordenadas x, mas da direita para a esquerda.

Na verdade, você não precisa escrever quatro loops. Como desenhar uma linha de _A_ a _B_ é o mesmo que desenhar uma linha de _B_ a _A_, você pode trocar as posições inicial e final para linhas que vão da direita para a esquerda e tratá-las como indo da esquerda para a direita.

Então você precisa de dois loops diferentes. A primeira coisa que sua função de desenho de linha deve fazer é verificar se a diferença entre as coordenadas x é maior que a diferença entre as coordenadas y. Se for, esta é uma linha mais horizontalizada, e se não, uma mais verticalizada.

{{index "Math.abs function", "absolute value"}}

Certifique-se de comparar os valores _absolutos_ das diferenças _x_ e _y_, que você pode obter com `Math.abs`.

{{index "swapping bindings"}}

Uma vez que sabe ao longo de qual ((eixo)) estará iterando, pode verificar se o ponto inicial tem uma coordenada maior ao longo desse eixo que o ponto final e trocá-los se necessário. Uma forma sucinta de trocar os valores de duas variáveis em JavaScript usa ((atribuição por desestruturação)) assim:

```{test: no}
[start, end] = [end, start];
```

{{index rounding}}

Então você pode calcular a ((inclinação)) da linha, que determina a quantidade que a coordenada no outro eixo muda para cada passo que você dá ao longo do eixo principal. Com isso, pode rodar um loop ao longo do eixo principal enquanto também rastreia a posição correspondente no outro eixo, e pode desenhar pixels a cada iteração. Certifique-se de arredondar as coordenadas do eixo não principal, já que provavelmente serão fracionárias e o método `draw` não responde bem a coordenadas fracionárias.

hint}}
