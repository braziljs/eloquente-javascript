# Manipulando Eventos

{{quote {author: "Marcus Aurelius", title: Meditations, chapter: true}

You have power over your mind—not outside events. Realize this, and you will find strength.

quote}}

{{index stoicism, "Marcus Aurelius", input, timeline}}

{{figure {url: "img/chapter_picture_15.jpg", alt: "Illustration showing a Rube Goldberg machine involving a ball, a see-saw, a pair of scissors, and a hammer, which affect each other in a chain reaction that turns on a lightbulb.", chapter: "framed"}}}

Alguns programas trabalham com entrada direta do usuário, como ações de mouse e teclado. Esse tipo de entrada não está disponível antecipadamente, como uma estrutura de dados bem organizada — ela chega pedaço por pedaço, em tempo real, e o programa deve responder a ela conforme acontece.

## Manipuladores de eventos

{{index polling, button, "real-time"}}

Imagine uma interface onde a única forma de descobrir se uma tecla no ((teclado)) está sendo pressionada é ler o estado atual daquela tecla. Para poder reagir a pressionamentos de tecla, você teria que constantemente ler o estado da tecla para pegá-la antes que fosse solta. Seria perigoso realizar outras computações que consumam tempo, já que você poderia perder um pressionamento de tecla.

Algumas máquinas primitivas lidam com entrada assim. Um passo acima disso é o hardware ou sistema operacional notar o pressionamento de tecla e colocá-lo em uma fila. Um programa pode então verificar periodicamente a fila em busca de novos eventos e reagir ao que encontrar lá.

{{index responsiveness, "user experience"}}

Claro, o programa precisa lembrar de verificar a fila, e fazer isso com frequência, porque qualquer tempo entre a tecla ser pressionada e o programa notar o evento fará com que o software pareça não responsivo. Essa abordagem é chamada de _((polling))_. A maioria dos programadores prefere evitá-la.

{{index "callback function", "event handling"}}

Um mecanismo melhor é o sistema notificar ativamente o código quando um evento ocorre. Navegadores fazem isso nos permitindo registrar funções como _manipuladores_ para eventos específicos.

```{lang: html}
<p>Click this document to activate the handler.</p>
<script>
  window.addEventListener("click", () => {
    console.log("You knocked?");
  });
</script>
```

{{index "click event", "addEventListener method", "window object", [browser, window]}}

A vinculação `window` se refere a um objeto embutido fornecido pelo navegador. Ele representa a janela do navegador que contém o documento. Chamar seu método `addEventListener` registra o segundo argumento para ser chamado sempre que o evento descrito pelo primeiro argumento ocorrer.

## Eventos e nós DOM

{{index "addEventListener method", "event handling", "window object", browser, [DOM, events]}}

Cada manipulador de evento do navegador é registrado em um contexto. No exemplo anterior, chamamos `addEventListener` no objeto `window` para registrar um manipulador para toda a janela. Tal método também pode ser encontrado em elementos DOM e alguns outros tipos de objetos. Ouvintes de eventos são chamados apenas quando o evento acontece no contexto do objeto no qual foram registrados.

```{lang: html}
<button>Click me</button>
<p>No handler here.</p>
<script>
  let button = document.querySelector("button");
  button.addEventListener("click", () => {
    console.log("Button clicked.");
  });
</script>
```

{{index "click event", "button (HTML tag)"}}

Esse exemplo anexa um manipulador ao nó do botão. Cliques no botão fazem esse manipulador rodar, mas cliques no resto do documento não.

{{index "onclick attribute", encapsulation}}

Dar a um nó um atributo `onclick` tem um efeito similar. Isso funciona para a maioria dos tipos de eventos — você pode anexar um manipulador através do atributo cujo nome é o nome do evento com `on` na frente.

Mas um nó pode ter apenas um atributo `onclick`, então você pode registrar apenas um manipulador por nó dessa forma. O método `addEventListener` permite que você adicione qualquer número de manipuladores, o que significa que é seguro adicionar manipuladores mesmo se já houver outro manipulador no elemento.

{{index "removeEventListener method"}}

O método `removeEventListener`, chamado com argumentos similares a `addEventListener`, remove um manipulador.

```{lang: html}
<button>Act-once button</button>
<script>
  let button = document.querySelector("button");
  function once() {
    console.log("Done.");
    button.removeEventListener("click", once);
  }
  button.addEventListener("click", once);
</script>
```

{{index [function, "as value"]}}

A função passada para `removeEventListener` deve ser o mesmo valor de função dado a `addEventListener`. Quando você precisa cancelar o registro de um manipulador, vai querer dar à função manipuladora um nome (`once`, no exemplo) para poder passar o mesmo valor de função para ambos os métodos.

## Objetos de evento

{{index "button property", "event handling"}}

Embora tenhamos ignorado isso até agora, funções manipuladoras de evento recebem um argumento: o _((objeto de evento))_. Esse objeto contém informações adicionais sobre o evento. Por exemplo, se quisermos saber _qual_ ((botão do mouse)) foi pressionado, podemos olhar a propriedade `button` do objeto de evento.

```{lang: html}
<button>Click me any way you want</button>
<script>
  let button = document.querySelector("button");
  button.addEventListener("mousedown", event => {
    if (event.button == 0) {
      console.log("Left button");
    } else if (event.button == 1) {
      console.log("Middle button");
    } else if (event.button == 2) {
      console.log("Right button");
    }
  });
</script>
```

{{index "event type", "type property"}}

A informação armazenada em um objeto de evento difere por tipo de evento. (Discutiremos diferentes tipos mais adiante no capítulo.) A propriedade `type` do objeto sempre contém uma string identificando o evento (como `"click"` ou `"mousedown"`).

## Propagação

{{index "event propagation", "parent node"}}

{{indexsee bubbling, "event propagation"}}

{{indexsee propagation, "event propagation"}}

Para a maioria dos tipos de eventos, manipuladores registrados em nós com filhos também receberão eventos que acontecem nos filhos. Se um botão dentro de um parágrafo é clicado, manipuladores de evento no parágrafo também verão o evento de clique.

{{index "event handling"}}

Mas se tanto o parágrafo quanto o botão tiverem um manipulador, o manipulador mais específico — o do botão — tem vez primeiro. Diz-se que o evento _propaga_ para fora a partir do nó onde aconteceu para o nó pai daquele nó e daí para a raiz do documento. Finalmente, depois que todos os manipuladores registrados em um nó específico tiveram sua vez, manipuladores registrados na ((janela)) inteira recebem a chance de responder ao evento.

{{index "stopPropagation method", "click event"}}

A qualquer momento, um manipulador de evento pode chamar o método `stopPropagation` no objeto de evento para impedir que manipuladores mais acima recebam o evento. Isso pode ser útil quando, por exemplo, você tem um botão dentro de outro elemento clicável e não quer que cliques no botão ativem o comportamento de clique do elemento externo.

{{index "mousedown event", "pointer event"}}

O exemplo a seguir registra manipuladores `"mousedown"` tanto em um botão quanto no parágrafo ao redor dele. Quando clicado com o botão direito do mouse, o manipulador do botão chama `stopPropagation`, que impedirá o manipulador do parágrafo de rodar. Quando o botão é clicado com outro ((botão do mouse)), ambos os manipuladores rodarão.

```{lang: html}
<p>A paragraph with a <button>button</button>.</p>
<script>
  let para = document.querySelector("p");
  let button = document.querySelector("button");
  para.addEventListener("mousedown", () => {
    console.log("Handler for paragraph.");
  });
  button.addEventListener("mousedown", event => {
    console.log("Handler for button.");
    if (event.button == 2) event.stopPropagation();
  });
</script>
```

{{index "event propagation", "target property"}}

A maioria dos objetos de evento tem uma propriedade `target` que se refere ao nó onde se originaram. Você pode usar essa propriedade para garantir que não está acidentalmente manipulando algo que propagou de um nó que você não quer manipular.

Também é possível usar a propriedade `target` para lançar uma rede ampla para um tipo específico de evento. Por exemplo, se você tem um nó contendo uma longa lista de botões, pode ser mais conveniente registrar um único manipulador de clique no nó externo e usar a propriedade `target` para descobrir se um botão foi clicado, em vez de registrar manipuladores individuais em todos os botões.

```{lang: html}
<button>A</button>
<button>B</button>
<button>C</button>
<script>
  document.body.addEventListener("click", event => {
    if (event.target.nodeName == "BUTTON") {
      console.log("Clicked", event.target.textContent);
    }
  });
</script>
```

## Ações padrão

{{index scrolling, "default behavior", "event handling"}}

Muitos eventos têm uma ação padrão. Se você clicar em um ((link)), será levado ao destino do link. Se pressionar a seta para baixo, o navegador rolará a página para baixo. Se clicar com o botão direito, verá um menu de contexto. E assim por diante.

{{index "preventDefault method"}}

Para a maioria dos tipos de eventos, os manipuladores de evento JavaScript são chamados _antes_ que o comportamento padrão ocorra. Se o manipulador não quiser que esse comportamento normal aconteça, tipicamente porque já cuidou de manipular o evento, ele pode chamar o método `preventDefault` no objeto de evento.

{{index expectation}}

Isso pode ser usado para implementar seus próprios atalhos de ((teclado)) ou ((menu de contexto)). Também pode ser usado para interferir de forma desagradável no comportamento que os usuários esperam. Por exemplo, aqui está um link que não pode ser seguido:

```{lang: html}
<a href="https://developer.mozilla.org/">MDN</a>
<script>
  let link = document.querySelector("a");
  link.addEventListener("click", event => {
    console.log("Nope.");
    event.preventDefault();
  });
</script>
```

{{index usability}}

Tente não fazer coisas assim sem uma razão realmente boa. Será desagradável para as pessoas que usam sua página quando o comportamento esperado é quebrado.

Dependendo do navegador, alguns eventos não podem ser interceptados de forma alguma. No Chrome, por exemplo, o atalho de ((teclado)) para fechar a aba atual ([ctrl]{keyname}-W ou [command]{keyname}-W) não pode ser manipulado por JavaScript.

## Eventos de tecla

{{index keyboard, "keydown event", "keyup event", "event handling"}}

Quando uma tecla no teclado é pressionada, seu navegador dispara um evento `"keydown"`. Quando ela é solta, você recebe um evento `"keyup"`.

```{lang: html, focus: true}
<p>This page turns violet when you hold the V key.</p>
<script>
  window.addEventListener("keydown", event => {
    if (event.key == "v") {
      document.body.style.background = "violet";
    }
  });
  window.addEventListener("keyup", event => {
    if (event.key == "v") {
      document.body.style.background = "";
    }
  });
</script>
```

{{index "repeating key"}}

Apesar do nome, `"keydown"` dispara não apenas quando a tecla é fisicamente pressionada. Quando uma tecla é pressionada e mantida, o evento dispara novamente toda vez que a tecla _repete_. Às vezes você precisa ter cuidado com isso. Por exemplo, se você adicionar um botão ao DOM quando uma tecla é pressionada e removê-lo quando a tecla é solta, pode acidentalmente adicionar centenas de botões quando a tecla é mantida pressionada por mais tempo.

{{index "key property"}}

O exemplo anterior observa a propriedade `key` do objeto de evento para ver sobre qual tecla o evento é. Essa propriedade contém uma string que, para a maioria das teclas, corresponde ao que pressionar aquela tecla digitaria. Para teclas especiais como [enter]{keyname}, ela contém uma string que nomeia a tecla (`"Enter"`, neste caso). Se você segura [shift]{keyname} enquanto pressiona uma tecla, isso também pode influenciar o nome da tecla — `"v"` se torna `"V"`, e `"1"` pode se tornar `"!"`, se é isso que pressionar [shift]{keyname}-1 produz no seu teclado.

{{index "modifier key", "shift key", "control key", "alt key", "meta key", "command key", "ctrlKey property", "shiftKey property", "altKey property", "metaKey property"}}

Teclas modificadoras como [shift]{keyname}, [ctrl]{keyname}, [alt]{keyname} e [meta]{keyname} ([command]{keyname} no Mac) geram eventos de tecla assim como teclas normais. Ao procurar combinações de teclas, você também pode descobrir se essas teclas estão pressionadas olhando as propriedades `shiftKey`, `ctrlKey`, `altKey` e `metaKey` dos eventos de teclado e mouse.

```{lang: html, focus: true}
<p>Press Control-Space to continue.</p>
<script>
  window.addEventListener("keydown", event => {
    if (event.key == " " && event.ctrlKey) {
      console.log("Continuing!");
    }
  });
</script>
```

{{index "button (HTML tag)", "tabindex attribute", [DOM, events]}}

O nó DOM onde um evento de tecla se origina depende do elemento que tem ((foco)) quando a tecla é pressionada. A maioria dos nós não pode ter foco a menos que você lhes dê um atributo `tabindex`, mas coisas como ((link))s, botões e campos de formulário podem. Voltaremos a ((campos)) de formulário no [Capítulo ?](http#forms). Quando nada em particular tem foco, `document.body` funciona como o nó alvo dos eventos de tecla.

Quando o usuário está digitando texto, usar eventos de tecla para descobrir o que está sendo digitado é problemático. Algumas plataformas, notavelmente o teclado ((virtual)) em ((telefones)) ((Android)), não disparam eventos de tecla. Mas mesmo quando você tem um teclado tradicional, alguns tipos de entrada de texto não correspondem a pressionamentos de tecla de forma direta, como software de _editor de método de entrada_ (_((IME))_) usado por pessoas cujos sistemas de escrita não cabem em um teclado, onde múltiplos pressionamentos de tecla são combinados para criar caracteres.

Para notar quando algo foi digitado, elementos nos quais você pode digitar, como as tags `<input>` e `<textarea>`, disparam eventos `"input"` sempre que o usuário muda seu conteúdo. Para obter o conteúdo real que foi digitado, é melhor lê-lo diretamente do campo focado, o que discutimos no [Capítulo ?](http#forms).

## Eventos de ponteiro

Existem atualmente duas formas amplamente usadas de apontar para coisas em uma tela: mouses (incluindo dispositivos que agem como mouses, como touchpads e trackballs) e telas de toque. Estes produzem diferentes tipos de eventos.

### Cliques do mouse

{{index "mousedown event", "mouseup event", "mouse cursor"}}

Pressionar um ((botão do mouse)) faz uma série de eventos dispararem. Os eventos `"mousedown"` e `"mouseup"` são similares a `"keydown"` e `"keyup"` e disparam quando o botão é pressionado e solto. Eles acontecem nos nós DOM que estão imediatamente abaixo do ponteiro do mouse quando o evento ocorre.

{{index "click event"}}

Após o evento `"mouseup"`, um evento `"click"` dispara no nó mais específico que continha tanto o pressionamento quanto a liberação do botão. Por exemplo, se eu pressionar o botão do mouse em um parágrafo e depois mover o ponteiro para outro parágrafo e soltar o botão, o evento `"click"` acontecerá no elemento que contém ambos os parágrafos.

{{index "dblclick event", "double click"}}

Se dois cliques acontecem próximos um do outro, um evento `"dblclick"` (duplo clique) também dispara, após o segundo evento de clique.

{{index pixel, "clientX property", "clientY property", "pageX property", "pageY property", "event object"}}

Para obter informações precisas sobre o local onde um evento de mouse aconteceu, você pode olhar suas propriedades `clientX` e `clientY`, que contêm as ((coordenadas)) do evento (em pixels) relativas ao canto superior esquerdo da janela, ou `pageX` e `pageY`, que são relativas ao canto superior esquerdo do documento inteiro (que pode ser diferente quando a janela foi rolada).

{{index "border-radius (CSS)", "absolute positioning", "drawing program example"}}

{{id mouse_drawing}}

O programa a seguir implementa um aplicativo de desenho primitivo. Toda vez que você clicar no documento, ele adiciona um ponto sob o ponteiro do mouse.

```{lang: html}
<style>
  body {
    height: 200px;
    background: beige;
  }
  .dot {
    height: 8px; width: 8px;
    border-radius: 4px; /* arredonda cantos */
    background: teal;
    position: absolute;
  }
</style>
<script>
  window.addEventListener("click", event => {
    let dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = (event.pageX - 4) + "px";
    dot.style.top = (event.pageY - 4) + "px";
    document.body.appendChild(dot);
  });
</script>
```

Criaremos um aplicativo de desenho menos primitivo no [Capítulo ?](paint).

### Movimento do mouse

{{index "mousemove event"}}

Toda vez que o ponteiro do mouse se move, um evento `"mousemove"` dispara. Esse evento pode ser usado para rastrear a posição do mouse. Uma situação comum em que isso é útil é ao implementar alguma forma de funcionalidade de ((arrastar)) com o mouse.

{{index "draggable bar example"}}

Como exemplo, o programa a seguir exibe uma barra e configura manipuladores de evento para que arrastar para a esquerda ou direita nessa barra a torne mais estreita ou mais larga:

```{lang: html, startCode: true}
<p>Drag the bar to change its width:</p>
<div style="background: orange; width: 60px; height: 20px">
</div>
<script>
  let lastX; // Rastreia a última posição X observada do mouse
  let bar = document.querySelector("div");
  bar.addEventListener("mousedown", event => {
    if (event.button == 0) {
      lastX = event.clientX;
      window.addEventListener("mousemove", moved);
      event.preventDefault(); // Prevenir seleção
    }
  });

  function moved(event) {
    if (event.buttons == 0) {
      window.removeEventListener("mousemove", moved);
    } else {
      let dist = event.clientX - lastX;
      let newWidth = Math.max(10, bar.offsetWidth + dist);
      bar.style.width = newWidth + "px";
      lastX = event.clientX;
    }
  }
</script>
```

{{if book

A página resultante se parece com isto:

{{figure {url: "img/drag-bar.png", alt: "Picture of a draggable bar", width: "5.3cm"}}}

if}}

{{index "mouseup event", "mousemove event"}}

Note que o manipulador `"mousemove"` é registrado na ((janela)) inteira. Mesmo se o mouse sair da barra durante o redimensionamento, enquanto o botão estiver pressionado, ainda queremos atualizar seu tamanho.

{{index "buttons property", "button property", "bitfield"}}

Devemos parar de redimensionar a barra quando o botão do mouse é solto. Para isso, podemos usar a propriedade `buttons` (note o plural), que nos diz sobre os botões que estão atualmente pressionados. Quando é 0, nenhum botão está pressionado. Quando botões estão pressionados, o valor da propriedade `buttons` é a soma dos códigos desses botões — o botão esquerdo tem código 1, o direito 2 e o do meio 4. Com os botões esquerdo e direito pressionados, por exemplo, o valor de `buttons` será 3.

Note que a ordem desses códigos é diferente da usada por `button`, onde o botão do meio vinha antes do direito. Como mencionado, consistência não é um ponto forte da interface de programação do navegador.

### Eventos de toque

{{index touch, "mousedown event", "mouseup event", "click event"}}

O estilo de navegador gráfico que usamos foi projetado com interfaces de mouse em mente, numa época em que telas de toque eram raras. Para fazer a web "funcionar" nos primeiros telefones com tela de toque, navegadores para esses dispositivos fingiam, até certo ponto, que eventos de toque eram eventos de mouse. Se você tocar sua tela, receberá eventos `"mousedown"`, `"mouseup"` e `"click"`.

Mas essa ilusão não é muito robusta. Uma tela de toque não funciona como um mouse: ela não tem múltiplos botões, você não pode rastrear o dedo quando ele não está na tela (para simular `"mousemove"`), e permite que múltiplos dedos estejam na tela ao mesmo tempo.

Eventos de mouse cobrem interação por toque apenas em casos simples — se você adicionar um manipulador `"click"` a um botão, usuários de toque ainda poderão usá-lo. Mas algo como a barra redimensionável no exemplo anterior não funciona em uma tela de toque.

{{index "touchstart event", "touchmove event", "touchend event"}}

Existem tipos específicos de eventos disparados por interação de toque. Quando um dedo começa a tocar a tela, você recebe um evento `"touchstart"`. Quando ele é movido enquanto toca, eventos `"touchmove"` disparam. Finalmente, quando ele para de tocar a tela, você verá um evento `"touchend"`.

{{index "touches property", "clientX property", "clientY property", "pageX property", "pageY property"}}

Como muitas telas de toque podem detectar múltiplos dedos ao mesmo tempo, esses eventos não têm um único conjunto de coordenadas associado a eles. Em vez disso, seus ((objetos de evento)) têm uma propriedade `touches`, que contém um ((objeto semelhante a array)) de pontos, cada um com suas próprias propriedades `clientX`, `clientY`, `pageX` e `pageY`.

Você poderia fazer algo assim para mostrar círculos vermelhos ao redor de cada dedo tocando:

```{lang: html}
<style>
  dot { position: absolute; display: block;
        border: 2px solid red; border-radius: 50px;
        height: 100px; width: 100px; }
</style>
<p>Touch this page</p>
<script>
  function update(event) {
    for (let dot; dot = document.querySelector("dot");) {
      dot.remove();
    }
    for (let i = 0; i < event.touches.length; i++) {
      let {pageX, pageY} = event.touches[i];
      let dot = document.createElement("dot");
      dot.style.left = (pageX - 50) + "px";
      dot.style.top = (pageY - 50) + "px";
      document.body.appendChild(dot);
    }
  }
  window.addEventListener("touchstart", update);
  window.addEventListener("touchmove", update);
  window.addEventListener("touchend", update);
</script>
```

{{index "preventDefault method"}}

Frequentemente você vai querer chamar `preventDefault` em manipuladores de eventos de toque para sobrescrever o comportamento padrão do navegador (que pode incluir rolar a página ao deslizar) e para impedir que os eventos de mouse sejam disparados, para os quais você pode _também_ ter um manipulador.

## Eventos de rolagem

{{index scrolling, "scroll event", "event handling"}}

Sempre que um elemento é rolado, um evento `"scroll"` é disparado nele. Isso tem vários usos, como saber o que o usuário está vendo atualmente (para desabilitar ((animação))ões fora da tela ou enviar relatórios de ((espionagem)) para seu quartel-general maligno) ou mostrar alguma indicação de progresso (destacando parte de um índice ou mostrando um número de página).

O exemplo a seguir desenha uma ((barra de progresso)) acima do documento e a atualiza para se encher conforme você rola para baixo:

```{lang: html}
<style>
  #progress {
    border-bottom: 2px solid blue;
    width: 0;
    position: fixed;
    top: 0; left: 0;
  }
</style>
<div id="progress"></div>
<script>
  // Criar algum conteúdo
  document.body.appendChild(document.createTextNode(
    "supercalifragilisticexpialidocious ".repeat(1000)));

  let bar = document.querySelector("#progress");
  window.addEventListener("scroll", () => {
    let max = document.body.scrollHeight - innerHeight;
    bar.style.width = `${(pageYOffset / max) * 100}%`;
  });
</script>
```

{{index "unit (CSS)", scrolling, "position (CSS)", "fixed positioning", "absolute positioning", percentage, "repeat method"}}

Dar a um elemento uma `position` de `fixed` age de forma semelhante a uma posição `absolute`, mas também impede que ele role junto com o resto do documento. O efeito é fazer nossa barra de progresso ficar no topo. Sua largura é alterada para indicar o progresso atual. Usamos `%`, em vez de `px`, como unidade ao definir a largura para que o elemento seja dimensionado em relação à largura da página.

{{index "innerHeight property", "innerWidth property", "pageYOffset property"}}

A vinculação global `innerHeight` nos dá a altura da janela, que devemos subtrair da altura total rolável — você não pode continuar rolando quando atingir o final do documento. Há também um `innerWidth` para a largura da janela. Dividindo `pageYOffset`, a posição de rolagem atual, pela posição máxima de rolagem e multiplicando por 100, obtemos a porcentagem para a barra de progresso.

{{index "preventDefault method"}}

Chamar `preventDefault` em um evento de rolagem não impede que a rolagem aconteça. Na verdade, o manipulador de evento é chamado apenas _após_ a rolagem ocorrer.

## Eventos de foco

{{index "event handling", "focus event", "blur event"}}

Quando um elemento recebe ((foco)), o navegador dispara um evento `"focus"` nele. Quando ele perde o foco, o elemento recebe um evento `"blur"`.

{{index "event propagation"}}

Ao contrário dos eventos discutidos anteriormente, esses dois eventos não propagam. Um manipulador em um elemento pai não é notificado quando um elemento filho ganha ou perde foco.

{{index "input (HTML tag)", "help text example"}}

O exemplo a seguir exibe texto de ajuda para o ((campo de texto)) que atualmente tem foco:

```{lang: html}
<p>Name: <input type="text" data-help="Your full name"></p>
<p>Age: <input type="text" data-help="Your age in years"></p>
<p id="help"></p>

<script>
  let help = document.querySelector("#help");
  let fields = document.querySelectorAll("input");
  for (let field of Array.from(fields)) {
    field.addEventListener("focus", event => {
      let text = event.target.getAttribute("data-help");
      help.textContent = text;
    });
    field.addEventListener("blur", event => {
      help.textContent = "";
    });
  }
</script>
```

{{if book

Esta captura de tela mostra o texto de ajuda para o campo de idade:

{{figure {url: "img/help-field.png", alt: "Screenshot of the help text below the age field", width: "4.4cm"}}}

if}}

{{index "focus event", "blur event"}}

O objeto ((window)) receberá eventos `"focus"` e `"blur"` quando o usuário mover de ou para a aba ou janela do navegador em que o documento é mostrado.

## Evento de carregamento

{{index "script (HTML tag)", "load event"}}

Quando uma página termina de carregar, o evento `"load"` dispara no objeto window e no corpo do documento. Isso é frequentemente usado para agendar ações de ((inicialização)) que requerem que o ((documento)) inteiro tenha sido construído. Lembre-se que o conteúdo de tags `<script>` é executado imediatamente quando a tag é encontrada. Isso pode ser cedo demais, por exemplo quando o script precisa fazer algo com partes do documento que aparecem após a tag `<script>`.

{{index "event propagation", "img (HTML tag)"}}

Elementos como ((imagem))s e tags de script que carregam um arquivo externo também têm um evento `"load"` que indica que os arquivos que referenciam foram carregados. Como os eventos relacionados a foco, eventos de carregamento não propagam.

{{index "beforeunload event", "page reload", "preventDefault method"}}

Quando você fecha uma página ou navega para fora dela (por exemplo, seguindo um link), um evento `"beforeunload"` dispara. O uso principal desse evento é impedir que o usuário perca trabalho acidentalmente ao fechar um documento. Se você prevenir o comportamento padrão nesse evento _e_ definir a propriedade `returnValue` no objeto de evento como uma string, o navegador mostrará ao usuário um diálogo perguntando se ele realmente quer sair da página. Esse diálogo pode incluir sua string, mas como alguns sites maliciosos tentam usar esses diálogos para confundir pessoas a ficar em suas páginas para ver anúncios duvidosos de perda de peso, a maioria dos navegadores não os exibe mais.

{{id timeline}}

## Eventos e o loop de eventos

{{index "requestAnimationFrame function", "event handling", timeline, "script (HTML tag)"}}

No contexto do loop de eventos, como discutido no [Capítulo ?](async), manipuladores de eventos do navegador se comportam como outras notificações assíncronas. Eles são agendados quando o evento ocorre, mas devem esperar que outros scripts que estão rodando terminem antes de terem a chance de rodar.

O fato de que eventos só podem ser processados quando nada mais está rodando significa que, se o loop de eventos está preso com outro trabalho, qualquer interação com a página (que acontece através de eventos) será atrasada até que haja tempo para processá-la. Então, se você agendar trabalho demais, seja com manipuladores de evento de longa duração ou com muitos de curta duração, a página se tornará lenta e desagradável de usar.

Para casos em que você _realmente_ quer fazer algo demorado em segundo plano sem congelar a página, navegadores fornecem algo chamado _((web worker))s_. Um worker é um processo JavaScript que roda junto ao script principal, em sua própria linha do tempo.

Imagine que elevar um número ao quadrado é uma computação pesada e de longa duração que queremos realizar em uma ((thread)) separada. Poderíamos escrever um arquivo chamado `code/squareworker.js` que responde a mensagens calculando um quadrado e enviando uma mensagem de volta.

```
addEventListener("message", event => {
  postMessage(event.data * event.data);
});
```

Para evitar os problemas de ter múltiplas ((thread))s tocando os mesmos dados, workers não compartilham seu ((escopo global)) ou quaisquer outros dados com o ambiente do script principal. Em vez disso, você precisa se comunicar com eles enviando mensagens de um lado para outro.

Este código cria um worker rodando aquele script, envia algumas mensagens a ele e mostra as respostas.

```{test: no}
let squareWorker = new Worker("code/squareworker.js");
squareWorker.addEventListener("message", event => {
  console.log("The worker responded:", event.data);
});
squareWorker.postMessage(10);
squareWorker.postMessage(24);
```

{{index "postMessage method", "message event"}}

A função `postMessage` envia uma mensagem, que causará um evento `"message"` no receptor. O script que criou o worker envia e recebe mensagens através do objeto `Worker`, enquanto o worker conversa com o script que o criou enviando e ouvindo diretamente em seu ((escopo global)). Apenas valores que podem ser representados como JSON podem ser enviados como mensagens — o outro lado receberá uma _cópia_ deles, em vez do valor em si.

## Temporizadores

{{index timeout, "setTimeout function", "clearTimeout function"}}

A função `setTimeout` que vimos no [Capítulo ?](async) agenda outra função para ser chamada depois, após um dado número de milissegundos. Às vezes você precisa cancelar uma função que agendou. Pode fazer isso armazenando o valor retornado por `setTimeout` e chamando `clearTimeout` nele.

```
let bombTimer = setTimeout(() => {
  console.log("BOOM!");
}, 500);

if (Math.random() < 0.5) { // 50% de chance
  console.log("Defused.");
  clearTimeout(bombTimer);
}
```

{{index "cancelAnimationFrame function", "requestAnimationFrame function"}}

A função `cancelAnimationFrame` funciona da mesma forma que `clearTimeout`. Chamá-la com um valor retornado por `requestAnimationFrame` cancelará aquele frame (assumindo que ele ainda não tenha sido chamado).

{{index "setInterval function", "clearInterval function", repetition}}

Um conjunto similar de funções, `setInterval` e `clearInterval`, é usado para definir temporizadores que devem se repetir a cada _X_ milissegundos.

```
let ticks = 0;
let clock = setInterval(() => {
  console.log("tick", ticks++);
  if (ticks == 10) {
    clearInterval(clock);
    console.log("stop.");
  }
}, 200);
```

## Debouncing

{{index optimization, "mousemove event", "scroll event", blocking}}

Alguns tipos de eventos têm o potencial de disparar rapidamente muitas vezes seguidas, como os eventos `"mousemove"` e `"scroll"`. Ao manipular tais eventos, você deve ter cuidado para não fazer nada que consuma muito tempo, ou seu manipulador ocupará tanto tempo que a interação com o documento começará a parecer lenta.

{{index "setTimeout function"}}

Se você precisa fazer algo não trivial em tal manipulador, pode usar `setTimeout` para garantir que não está fazendo isso com muita frequência. Isso é geralmente chamado de _((debouncing))_ do evento. Existem várias abordagens ligeiramente diferentes para isso.

{{index "textarea (HTML tag)", "clearTimeout function", "keydown event"}}

Por exemplo, suponha que queremos reagir quando o usuário digitou algo, mas não queremos fazer isso imediatamente para cada evento de entrada. Quando estão ((digitando)) rápido, queremos apenas esperar até que ocorra uma pausa. Em vez de executar imediatamente uma ação no manipulador de evento, definimos um temporizador. Também limpamos o temporizador anterior (se houver) para que, quando eventos ocorrem próximos uns dos outros (mais perto do que nosso atraso do temporizador), o temporizador do evento anterior seja cancelado.

```{lang: html}
<textarea>Type something here...</textarea>
<script>
  let textarea = document.querySelector("textarea");
  let timeout;
  textarea.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => console.log("Typed!"), 500);
  });
</script>
```

{{index "sloppy programming"}}

Passar um valor indefinido para `clearTimeout` ou chamá-lo em um temporizador que já disparou não tem efeito. Assim, não precisamos ter cuidado sobre quando chamá-lo, e simplesmente o fazemos para cada evento.

{{index "mousemove event"}}

Podemos usar um padrão ligeiramente diferente se quisermos espaçar as respostas para que sejam separadas por pelo menos um certo período de ((tempo)), mas quisermos dispará-las _durante_ uma série de eventos, não apenas depois. Por exemplo, podemos querer responder a eventos `"mousemove"` mostrando as coordenadas atuais do mouse, mas apenas a cada 250 milissegundos.

```{lang: html}
<script>
  let scheduled = null;
  window.addEventListener("mousemove", event => {
    if (!scheduled) {
      setTimeout(() => {
        document.body.textContent =
          `Mouse at ${scheduled.pageX}, ${scheduled.pageY}`;
        scheduled = null;
      }, 250);
    }
    scheduled = event;
  });
</script>
```

## Resumo

Manipuladores de eventos tornam possível detectar e reagir a eventos acontecendo em nossa página web. O método `addEventListener` é usado para registrar tal manipulador.

Cada evento tem um tipo (`"keydown"`, `"focus"`, e assim por diante) que o identifica. A maioria dos eventos é chamada em um elemento DOM específico e depois propaga para os ancestrais daquele elemento, permitindo que manipuladores associados a esses elementos os tratem.

Quando um manipulador de evento é chamado, recebe um objeto de evento com informações adicionais sobre o evento. Esse objeto também tem métodos que nos permitem parar a propagação adicional (`stopPropagation`) e impedir o tratamento padrão do navegador para o evento (`preventDefault`).

Pressionar uma tecla dispara eventos `"keydown"` e `"keyup"`. Pressionar um botão do mouse dispara eventos `"mousedown"`, `"mouseup"` e `"click"`. Mover o mouse dispara eventos `"mousemove"`. Interação com tela de toque resultará em eventos `"touchstart"`, `"touchmove"` e `"touchend"`.

Rolagem pode ser detectada com o evento `"scroll"`, e mudanças de foco podem ser detectadas com os eventos `"focus"` e `"blur"`. Quando o documento termina de carregar, um evento `"load"` dispara no objeto window.

## Exercícios

### Balão

{{index "balloon (exercise)", "arrow key"}}

Escreva uma página que exiba um ((balão)) (usando o ((emoji)) de balão, 🎈). Quando você pressionar a seta para cima, ele deve inflar (crescer) 10 por cento. Quando pressionar a seta para baixo, ele deve desinflar (encolher) 10 por cento.

{{index "font-size (CSS)"}}

Você pode controlar o tamanho do texto (emojis são texto) definindo a propriedade CSS `font-size` (`style.fontSize`) no seu elemento pai. Lembre-se de incluir uma unidade no valor — por exemplo, pixels (`10px`).

Os nomes das teclas de seta são `"ArrowUp"` e `"ArrowDown"`. Certifique-se de que as teclas mudem apenas o balão, sem rolar a página.

Quando tiver isso funcionando, adicione uma funcionalidade onde, se você inflar o balão além de um certo tamanho, ele "explode". Neste caso, explodir significa que ele é substituído por um emoji 💥, e o manipulador de evento é removido (para que você não possa inflar ou desinflar a explosão).

{{if interactive

```{test: no, lang: html, focus: yes}
<p>🎈</p>

<script>
  // Seu código aqui
</script>
```

if}}

{{hint

{{index "keydown event", "key property", "balloon (exercise)"}}

Você vai querer registrar um manipulador para o evento `"keydown"` e olhar `event.key` para descobrir se a tecla de seta para cima ou para baixo foi pressionada.

O tamanho atual pode ser mantido em uma vinculação para que você possa basear o novo tamanho nele. Será útil definir uma função que atualize o tamanho — tanto a vinculação quanto o estilo do balão no DOM — para que você possa chamá-la de seu manipulador de evento, e possivelmente também uma vez ao iniciar, para definir o tamanho inicial.

{{index "replaceChild method", "textContent property"}}

Você pode mudar o balão para uma explosão substituindo o nó de texto por outro (usando `replaceChild`) ou definindo a propriedade `textContent` de seu nó pai para uma nova string.

hint}}

### Rastro do mouse

{{index animation, "mouse trail (exercise)"}}

Nos primeiros dias do JavaScript, que foi a era de ouro de ((páginas caseiras chamativas)) com muitas imagens animadas, as pessoas inventaram formas verdadeiramente inspiradoras de usar a linguagem. Uma delas foi o _rastro do mouse_ — uma série de elementos que seguiriam o ponteiro do mouse conforme você o movesse pela página.

{{index "absolute positioning", "background (CSS)"}}

Neste exercício, quero que você implemente um rastro do mouse. Use elementos `<div>` posicionados absolutamente com tamanho fixo e cor de fundo (consulte o [código](event#mouse_drawing) na seção "Cliques do Mouse" para um exemplo). Crie vários desses elementos e, quando o mouse se mover, exiba-os no rastro do ponteiro do mouse.

{{index "mousemove event"}}

Existem várias abordagens possíveis aqui. Você pode tornar seu rastro tão simples ou complexo quanto quiser. Uma solução simples para começar é manter um número fixo de elementos de rastro e percorrê-los em ciclo, movendo o próximo para a posição atual do mouse toda vez que um evento `"mousemove"` ocorre.

{{if interactive

```{lang: html, test: no}
<style>
  .trail { /* className para os elementos do rastro */
    position: absolute;
    height: 6px; width: 6px;
    border-radius: 3px;
    background: teal;
  }
  body {
    height: 300px;
  }
</style>

<script>
  // Seu código aqui.
</script>
```

if}}

{{hint

{{index "mouse trail (exercise)"}}

Criar os elementos é melhor feito com um loop. Adicione-os ao documento para fazê-los aparecer. Para poder acessá-los depois para mudar sua posição, você vai querer armazenar os elementos em um array.

{{index "mousemove event", [array, indexing], "remainder operator", "% operator"}}

Percorrê-los em ciclo pode ser feito mantendo uma ((variável contadora)) e adicionando 1 a ela toda vez que o evento `"mousemove"` dispara. O operador de resto (`% elements.length`) pode então ser usado para obter um índice de array válido para escolher o elemento que você quer posicionar durante um dado evento.

{{index simulation, "requestAnimationFrame function"}}

Outro efeito interessante pode ser alcançado modelando um sistema de ((física)) simples. Use o evento `"mousemove"` apenas para atualizar um par de vinculações que rastreiam a posição do mouse. Depois use `requestAnimationFrame` para simular os elementos de rastro sendo atraídos para a posição do ponteiro do mouse. A cada passo de animação, atualize a posição deles com base em sua posição relativa ao ponteiro (e, opcionalmente, uma velocidade armazenada para cada elemento). Descobrir uma boa forma de fazer isso fica por sua conta.

hint}}

### Abas

{{index "tabbed interface (exercise)"}}

Painéis com abas são comuns em interfaces de usuário. Eles permitem que você selecione um painel de interface escolhendo entre várias abas "saindo" acima de um elemento.

{{index "button (HTML tag)", "display (CSS)", "hidden element", "data attribute"}}

Implemente uma interface simples com abas. Escreva uma função, `asTabs`, que recebe um nó DOM e cria uma interface com abas mostrando os elementos filhos daquele nó. Ela deve inserir uma lista de elementos `<button>` no topo do nó, um para cada elemento filho, contendo texto recuperado do atributo `data-tabname` do filho. Todos menos um dos filhos originais devem ser ocultados (recebendo um estilo `display` de `none`). O nó atualmente visível pode ser selecionado clicando nos botões.

Quando isso funcionar, estenda-o para estilizar o botão da aba atualmente selecionada de forma diferente, para que seja óbvio qual aba está selecionada.

{{if interactive

```{lang: html, test: no}
<tab-panel>
  <div data-tabname="one">Tab one</div>
  <div data-tabname="two">Tab two</div>
  <div data-tabname="three">Tab three</div>
</tab-panel>
<script>
  function asTabs(node) {
    // Seu código aqui.
  }
  asTabs(document.querySelector("tab-panel"));
</script>
```

if}}

{{hint

{{index "text node", "childNodes property", "live data structure", "tabbed interface (exercise)", [whitespace, "in HTML"]}}

Uma armadilha em que você pode cair é que não pode usar diretamente a propriedade `childNodes` do nó como uma coleção de nós de aba. Por um lado, quando você adiciona os botões, eles também se tornarão nós filhos e acabarão nesse objeto porque é uma estrutura de dados ao vivo. Por outro, os nós de texto criados para os espaços em branco entre os nós também estão em `childNodes` mas não devem receber suas próprias abas. Você pode usar `children` em vez de `childNodes` para ignorar nós de texto.

{{index "TEXT_NODE code", "nodeType property"}}

Você poderia começar construindo um array de abas para ter fácil acesso a elas. Para implementar a estilização dos botões, você poderia armazenar objetos que contêm tanto o painel da aba quanto seu botão.

Recomendo escrever uma função separada para mudar abas. Você pode armazenar a aba previamente selecionada e alterar apenas os estilos necessários para ocultá-la e mostrar a nova, ou pode simplesmente atualizar o estilo de todas as abas toda vez que uma nova aba é selecionada.

Você pode querer chamar essa função imediatamente para fazer a interface começar com a primeira aba visível.

hint}}
