# Manipulando eventos

> Você tem o poder sobre sua mente e não sobre eventos externos. Perceba isso e você encontrara resistência.

> `Marcus Aurelius, Meditations`

Alguns programas funcionam com entradas direta do usuário, tais como a interação de mouse e teclado. O tempo e a ordem de tal entrada não pode ser previsto com antecedência. Isso requer uma abordagem diferente para controlar o fluxo do que utilizamos até agora.

## Os manipuladores de eventos

Imaginem uma interface onde a única maneira de descobrir se uma tecla está sendo pressionada é ler o estado atual dessa tecla. Para ser capaz de reagir às pressões de teclas você teria que ler constantemente o estado da tecla antes que ela fique liberado novamente. Seria perigoso executar outros cálculos demoradas pois você poderia perder alguma tecla.

É assim que tal atributo foi tratado em máquinas primitivas. A um passo para o hardware, o sistema operacional deve notificar qual a tecla pressionada e colocá-lo em uma fila. Um programa pode então verificar periodicamente a fila para novos eventos e reagir ao encontrar.

É claro que ha sempre uma responsabilidade de verificar a fila e executá-las várias vezes, isso é necessário porque ha uma latência entre a pressão da tecla e a leitura da fila pelo programa com isso o software pode sentir que não esta tendo resposta. Esta abordagem é chamada de `polling`. A maioria dos programadores tentam evitar essa abordagem sempre que possível.

O melhor mecanismo para o sistema subjacente é dar ao nosso código a chance de reagir a eventos que ocorrerem. Os browsers podem fazer isto por que nos permite registrar funções como manipuladores para eventos específicos.

````html
<p>Click this document to activate the handler.</p>
<script>
  addEventListener("click", function() {
    console.log("You clicked!");
  });
</script>
````

A função `addEventListener` registra seu segundo argumento sempre que o evento descrito por seu primeiro argumento é chamado.

## Eventos e nós do DOM

Cada navegador tem seu manipulador de eventos registrado em um contexto. Quando você chamar `addEventListener` como mostramos anteriormente você estara chamando um método em todo `window` no navegador o escopo global é equivalente ao objeto `window`. Cada elemento DOM tem seu próprio método `addEventListener` que permite ouvir eventos especificamente para cada elemento.

````html
<button>Click me</button>
<p>No handler here.</p>
<script>
  var button = document.querySelector("button");
  button.addEventListener("click", function() {
    console.log("Button clicked.");
  });
</script>
````

O exemplo atribuiu um manipulador para um nó de botão. Assim quando existir um clique no botão o manipulador sera executado, enquanto no resto do documento não.

Dar a um nó um atributo `onclick` tem um efeito similar. Mas um nó tem apenas um atributo `onclick` para que você possa registrar apenas um manipulador por nó para que você não substitua acidentalmente um manipulador que já foi registrado. O método `addEventListener` permite que você adicione vários manipuladores.

O método `removeEventListener` quando chamado com argumentos é semelhante ao `addEventListener`, mas ele remove o manipulador que foi registrado.

````html
<button>Act-once button</button>
<script>
  var button = document.querySelector("button");
  function once() {
    console.log("Done.");
    button.removeEventListener("click", once);
  }
  button.addEventListener("click", once);
</script>
````

Ele é capaz de cancelar um registro de manipulador de uma função, precisamos dar-lhe um nome para que possamos utilizar tanto para `addEventListener` quanto para `removeEventListener`.

## Os objetos de evento

Embora tenhamos ignorado os exemplos anteriores as funções manipuladoras de eventos são passados ​​via argumento e chamamos de objeto de evento. Este objeto nos dá informações adicionais sobre o evento. Por exemplo, se queremos saber qual botão do mouse que foi pressionado podemos observar as propriedades do objeto de evento.

````html
<button>Click me any way you want</button>
<script>
  var button = document.querySelector("button");
  button.addEventListener("mousedown", function(event) {
    if (event.which == 1)
      console.log("Left button");
    else if (event.which == 2)
      console.log("Middle button");
    else if (event.which == 3)
      console.log("Right button");
  });
</script>
````

As informações armazenadas em um objeto de evento são diferentes dependendo do tipo de evento. Vamos discutir vários tipos mais adiante neste capítulo. Propriedade de tipo do objeto sempre detém uma cadeia que identifica o evento(por exemplo, `"click"` ou `"mousedown"`).

## Propagação

Os manipuladores de eventos registrados em nós também receberão alguns eventos que ocorrem nos filhos. Se um botão dentro de um parágrafo é clicado manipuladores de eventos no parágrafo também vai receber o evento `click`.

Mas se tanto o parágrafo e o botão tem um manipulador o manipulador mais específico é o do botão e sera chamado primeiro. O evento foi feito para propagar para o exterior a partir do nó onde aconteceu ate o nó pai do nó raiz do documento. Finalmente depois de todos os manipuladores registrados em um nó específico tiveram sua vez manipuladores registrados em todo `window` tem a chance de responder ao evento.

A qualquer momento um manipulador de eventos pode chamar o método `stopPropagation` para evitar que os manipuladores mais acima possam receberem o evento. Isso pode ser útil quando por exemplo, se você tem um botão dentro de outro elemento clicável e você não quer o clique no botão aconteça se houver algum compartamento de clique no elemento exterior.

O exemplo a seguir registra manipuladores `"mousedown"` em ambos no botão e no parágrafo e em torno dele. Quando clicado com o botão direito do mouse o manipulador do botão chama `stopPropagation`, o que impedirá o manipulador no parágrafo de executar. Quando o botão é clicado com outro botão do mouse os dois manipuladores são executados.

````html
<p>A paragraph with a <button>button</button>.</p>
<script>
  var para = document.querySelector("p");
  var button = document.querySelector("button");
  para.addEventListener("mousedown", function() {
    console.log("Handler for paragraph.");
  });
  button.addEventListener("mousedown", function(event) {
    console.log("Handler for button.");
    if (event.which == 3)
      event.stopPropagation();
  });
</script>
````

A maioria dos objetos de evento tem uma propriedade de destino que se refere ao nó onde eles se originaram. Você pode usar essa propriedade para garantir que você não está lidando com algo que acidentalmente propagou a partir de um nó que você não queira lidar.

Também é possível usar uma propriedade de destino para lançar uma ampla rede para um tipo específico de evento. Por exemplo, se você tem um nó que contém uma longa lista de botões, pode ser mais conveniente registrar um único manipulador de clique para o nó do exterior e que ele use a propriedade de destino para descobrir se um botão foi clicado, ao invés de se registrar manipuladores individuais sobre todos os botões.

 ````html
<button>A</button>
<button>B</button>
<button>C</button>
<script>
  document.body.addEventListener("click", function(event) {
    if (event.target.nodeName == "BUTTON")
      console.log("Clicked", event.target.textContent);
  });
</script>
 ````

## Ações padrão

Muitos eventos têm sua ação padrão que lhes estão associados. Se você clicar em um link você será levado para outra página. Se você pressionar a seta para baixo o navegador vai rolar a página para baixo. Se você clicar com o botão direito você tera um menu e assim por diante.

Para a maioria dos tipos de eventos, os manipuladores de eventos de JavaScript são chamados antes do comportamento padrão. Se o condutor não quer que o comportamento normal aconteça pode simplesmente chamar o método `preventDefault` no objeto de evento.

Isso pode ser usado para implementar seus próprios atalhos de teclado ou menus. Ele também pode ser utilizado para interferir como um comportamento desagradavelmente que os utilizadores não esperam. Por exemplo aqui está um link que não podem ser clicável:

````html
<a href="https://developer.mozilla.org/">MDN</a>
<script>
  var link = document.querySelector("a");
  link.addEventListener("click", function(event) {
    console.log("Nope.");
    event.preventDefault();
  });
</script>
````

Tente não fazer tais coisas, a menos que você tem uma boa razão para isso. Para as pessoas que usam sua página isso pode ser desagradável quando o comportamento que eles esperam são quebrados.

Dependendo do navegador alguns eventos não podem ser interceptados. No Chrome por exemplo, os atalhos de teclado para fechar a aba atual (Ctrl- W ou Command-W) não pode ser manipulado por JavaScript.

## Evento de tecla

Quando uma tecla do teclado é pressionado, o seu browser dispara um evento `"keydown"` quando ele é liberado um evento de `"keyup"` é emitido.

````html
<p>This page turns violet when you hold the V key.</p>
<script>
  addEventListener("keydown", function(event) {
    if (event.keyCode == 86)
      document.body.style.background = "violet";
  });
  addEventListener("keyup", function(event) {
    if (event.keyCode == 86)
      document.body.style.background = "";
  });
</script>
````

O evento `"keydown"` é acionado não só quando a tecla fisicamente é empurrada para baixo.
Quando uma tecla é pressionada e mantida o evento é disparado novamente toda vez que se repete a tecla. Por exemplo se você quiser aumentar a aceleração de um personagem do jogo quando uma tecla de seta é pressionado e diminuido somente quando a tecla é liberada você tem que ter cuidado para não aumentá-lo novamente toda vez que se repete a tecla ou vai acabar com os valores involuntariamente enormes.

O exemplo anterior nos atentou para a propriedade `keyCode` do objeto de evento. Isto é como você pode identificar qual tecla está sendo pressionada ou solta. Infelizmente não é sempre óbvio traduzir o código numérico para uma tecla.

Para as teclas de letras e números, o código da tecla associado será o código de caracteres Unicode associado as letras maiúsculas ou número impresso na tecla. O método `charCodeAt` que pertence a propriedade `String` nos dá uma maneira de encontrar este código.

````javascript
console.log("Violet".charCodeAt(0));
// → 86
console.log("1".charCodeAt(0));
// → 49
````

Outras teclas têm códigos previsíveis. A melhor maneira de encontrar os códigos que você precisa é geralmente experimentar o registo de um manipulador de eventos de tecla que registra os códigos de chave que ela recebe quando pressionado a tecla que você está interessado.

Teclas modificadoras como Shift, Ctrl, Alt e Command(do Mac) geram eventos de teclas apenas como teclas normais. Mas quando se olha para as combinações de teclas, você também pode descobrir se essas teclas são pressionadas verificando as propriedades de eventos `shiftKey`, `ctrlKey`, `altKey` e `metakey` tanto para teclado quanto para mouse.

````html
<p>Press Ctrl-Space to continue.</p>
<script>
  addEventListener("keydown", function(event) {
    if (event.keyCode == 32 && event.ctrlKey)
      console.log("Continuing!");
  });
</script>
````

Os eventos de `"keydown"` e `"keyup"` dão informações sobre a tecla física que está sendo pressionado. Mas e se você está interessado no texto que está sendo digitado?
Conseguir o texto a partir de códigos de tecla é estranho.
Em vez disso existe um outro evento `"keypress"` que é acionado logo após `"keydown"`(repetido junto com `"keydown"` quando a tecla é solta) mas apenas para as teclas que produzem entrada de caracteres. A propriedade `charCode` no objeto do evento contém um código que pode ser interpretado como um código de caracteres `Unicode`. Podemos usar a função `String.fromCharCode` para transformar esse código em uma verdadeira cadeia de caracteres simples.

````html
<p>Focus this page and type something.</p>
<script>
  addEventListener("keypress", function(event) {
    console.log(String.fromCharCode(event.charCode));
  });
</script>
````

O nó `DOM` onde um evento de tecla se origina depende do elemento que tem o foco quando a tecla for pressionada. Nós normais não podem ter o foco(a menos que você de um atributo `tabindex`) o focu ocorre normalmente para os nós links, botões e campos de formulário. Voltaremos a formar campos no Capítulo 18. Quando nada em particular tem foco `document.body` é o um dos principais eventos dos destinos principais.

## Evento de mouse

Pressionar o botão do mouse também provoca uma série de eventos para ser emitido. O `"mousedown"` e `"mouseup"` são semelhantes aos `"keydown"` e  `"keyup"` e são acionados quando o botão é pressionado e liberado. Estes irão acontecer no DOM que estão abaixo do ponteiro do mouse quando o evento ocorrer.

Após o evento de `"mouseup"` um evento `"click"` é acionado no nó mais específico que continha tanto ao pressionar e liberar o botão. Por exemplo se eu pressionar o botão do mouse em um parágrafo e em seguida, movo o ponteiro para outro parágrafo e solto o botão o evento de "click" acontecerá em ambos parágrafos.

Se dois cliques acontecem juntos um evento de `"dblclick"`(clique duplo) é emitido também após o segundo evento de clique.

Para obter informações precisas sobre o local onde aconteceu um evento do mouse você pode olhar para as suas propriedades `pageX` e `pageY`, que contêm as coordenadas do evento(em pixels) em relação ao canto superior esquerdo do documento.

A seguir veja a implementação de um programa de desenho primitivo. Toda vez que você clique no documento ele acrescenta um ponto sob o ponteiro do mouse. Veja o Capítulo 19 um exemplo de programa de desenho menos primitivo.

````html
<style>
  body {
    height: 200px;
    background: beige;
  }
  .dot {
    height: 8px; width: 8px;
    border-radius: 4px; /* rounds corners */
    background: blue;
    position: absolute;
  }
</style>
<script>
  addEventListener("click", function(event) {
    var dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = (event.pageX - 4) + "px";
    dot.style.top = (event.pageY - 4) + "px";
    document.body.appendChild(dot);
  });
</script>
````

As propriedades `clientX` e `clientY` são semelhantes aos `pageX` e `pageY` mas em relação à parte do documento que está sendo rolado. Estes podem ser úteis quando se compara a coordena do mouse com as coordenadas retornados por `getBoundingClientRect` que também retorna coordenadas relativas da `viewport`.

## Movimento do mouse

Toda vez que o ponteiro do mouse se move, um eventos de `"mousemove"` é disparado. Este evento pode ser usado para controlar a posição do mouse. Uma situação comum em que isso é útil é ao implementar algum tipo de funcionalidade de arrastar o mouse.

O exemplo a seguir exibe um programa com uma barra e configura os manipuladores de eventos para que ao arrastar para a esquerda ou direita a barra se torna mais estreita ou mais ampla:

````html
<p>Drag the bar to change its width:</p>
<div style="background: orange; width: 60px; height: 20px">
</div>
<script>
  var lastX; // Tracks the last observed mouse X position
  var rect = document.querySelector("div");
  rect.addEventListener("mousedown", function(event) {
    if (event.which == 1) {
      lastX = event.pageX;
      addEventListener("mousemove", moved);
      event.preventDefault(); // Prevent selection
    }
  });

  function moved(event) {
    if (event.which != 1) {
      removeEventListener("mousemove", moved);
    } else {
      var dist = event.pageX - lastX;
      var newWidth = Math.max(10, rect.offsetWidth + dist);
      rect.style.width = newWidth + "px";
      lastX = event.pageX;
    }
  }
</script>
````

Note que o controlador `"mousemove"` é registrado no `window`. Mesmo que o mouse vai para fora da barra durante o redimensionamento nós ainda queremos atualizar seu tamanho e parar de arrastar somente quando o mouse é liberado.

Sempre que o ponteiro do mouse entra ou sai de um nó um evento de `"mouseover"` ou `"mouseout"` é disparado. Esses dois eventos podem ser usados entre outras coisas, para criar efeitos de foco, mostrando um denominado algo quando o mouse está sobre um determinado elemento.

Infelizmente não é tão simples de ativar a criação de um tal efeito com `"mouseover"` e acabar com ela em `"mouseout"`. Quando o mouse se move a partir de um nó em um dos seus filhos `"mouseout"` é acionado no nó pai, embora o mouse não chegou a deixar extensão do nó. Para piorar as coisas esses eventos se propagam assim como outros eventos, portanto você também receberá eventos `"mouseout"` quando o mouse deixa um dos nós filhos do nó em que o manipulador é registrado.

Para contornar este problema, podemos usar a propriedade `relatedTarget` dos objetos de eventos criados por esses eventos. Ele garante que no caso de `"mouseover"` o elemento que o ponteiro do mouse passou antes e no caso do `"mouseout"` o elemento que o ponteiro do mouse ira passar. Nós queremos mudar o nosso efeito `hover` apenas quando o `relatedTarget` está fora do nosso nó de destino. Neste caso é que este evento realmente representa um cruzamento de fora para dentro do nó(ou ao contrário).

````html
<p>Hover over this <strong>paragraph</strong>.</p>
<script>
  var para = document.querySelector("p");
  function isInside(node, target) {
    for (; node != null; node = node.parentNode)
      if (node == target) return true;
  }
  para.addEventListener("mouseover", function(event) {
    if (!isInside(event.relatedTarget, para))
      para.style.color = "red";
  });
  para.addEventListener("mouseout", function(event) {
    if (!isInside(event.relatedTarget, para))
      para.style.color = "";
  });
</script>
````

A função `isInside` percorre os links pai do nó até ele atingir o topo do documento(quando nulo) ou encontrar o pai que está procurando.

Devo acrescentar que um efeito hover como isso pode ser muito mais facilmente alcançado utilizando o pseudo selector em CSS `:hover` como o exemplo a seguir mostra. Mas quando o seu efeito hover envolve fazer algo mais complexo do que apenas mudar um estilo no nó de destino, você deve usar o truque com os eventos de `"mouseover"` e `"mouseout"`.

````html
<style>
  p:hover { color: red }
</style>
<p>Hover over this <strong>paragraph</strong>.</p>
````

## Evento de rolagem

Sempre que um elemento é rolado um evento de `"scroll"` é disparado sobre ele. Isto tem vários usos como saber o que o usuário está olhando(para desativar animações fora da tela ou o envio de relatórios de espionagem para o seu quartel general) ou apresentar alguma indicação de progresso(por destacar parte de uma tabela de conteúdo ou que mostra um número de página).

O exemplo a seguir desenha uma barra de progresso no canto superior direito do documento e atualiza enchendo quando é rolada para baixo:

````html
<style>
  .progress {
    border: 1px solid blue;
    width: 100px;
    position: fixed;
    top: 10px; right: 10px;
  }
  .progress > div {
    height: 12px;
    background: blue;
    width: 0%;
  }
  body {
    height: 2000px;
  }
</style>
<div class="progress"><div></div></div>
<p>Scroll me...</p>
<script>
  var bar = document.querySelector(".progress div");
  addEventListener("scroll", function() {
    var max = document.body.scrollHeight - innerHeight;
    var percent = (pageYOffset / max) * 100;
    bar.style.width = percent + "%";
  });
</script>
````

Um elemento com uma posição fixa é muito parecido com um elemento de posição absoluta, mas ambos impedem a rolagem junto com o resto do documento. O efeito é fazer com que nossa barra de progresso pare no canto. Dentro dele existe outro elemento que é redimensionada para indicar o progresso atual. Usamos `%` em vez de `px` como unidade, definimos a largura de modo que quando o elemento é dimensionado em relação ao conjunto da barra.

A variável `innerHeight` nos dá a altura de `window`, devemos subtrair do total altura de sua rolagem para não ter rolagem quando você chegar no final do documento.(Há também uma `innerWidth` que acompanha o  `innerHeight`.) Ao dividir `pageYOffset` a posição de rolagem atual menos posição de deslocamento máximo multiplicando por 100 obtemos o percentual da barra de progresso .

Chamando `preventDefault` em um evento de rolagem não impede a rolagem de acontecer. Na verdade o manipulador de eventos é chamado apenas após da rolagem ocorrer.

## Evento de foco

Quando um elemento entra em foco o navegador dispara um evento de `"focus"` nele. Quando se perde o foco um eventos de `"blur"` é disparado.

Ao contrário dos eventos discutidos anteriormente, esses dois eventos não se propagam. Um manipulador em um elemento pai não é notificado quando um filho ganha ou perde o foco do elemento.

O exemplo a seguir exibe um texto de ajuda para o campo de texto que possui o foco no momento:

````html
<p>Name: <input type="text" data-help="Your full name"></p>
<p>Age: <input type="text" data-help="Age in years"></p>
<p id="help"></p>
<script>
  var help = document.querySelector("#help");
  var fields = document.querySelectorAll("input");
  for (var i = 0; i < fields.length; i++) {
    fields[i].addEventListener("focus", function(event) {
      var text = event.target.getAttribute("data-help");
      help.textContent = text;
    });
    fields[i].addEventListener("blur", function(event) {
      help.textContent = "";
    });
  }
</script>
````

O objeto `window` recebe os eventos de `"focus"` e `"blur"` quando o usuário move-se para outra aba ou janela do navegador a qual o documento esta sendo mostrado.

## Evento de load

Quando uma página termina de carregar o evento `"load"` é disparado no `window` e no objeto `body` da página. Isso é muitas vezes usado para programar ações de inicialização que exigem que todo o documento tenha sido construído.

Lembre-se que o conteúdo de tags `<script>` é executado imediatamente
quando o tag é encontrada. As vezes a tag `<script>` é processada antes do carregamento total da página e ela necessita de algum conteúdo que ainda não foi carregado.

Elementos como imagens e tags de script carregam arquivo externo e tem um
evento de `"load"` para indica que os arquivos que eles fazem referência foram carregados.
Eles são como os eventos de `focus` e não se propagam.

Quando uma página é fechada ou navegação é colocado em segundo plano um evento de `"beforeunload"` é acionado. O uso principal deste evento é para evitar que o usuário perca o trabalho acidentalmente por fechar um documento.
Prevenir que a página seja fechada não é feito com o método `preventDefault`.
Ele é feito através do envio de uma `string` a partir do manipulador. A
seqüência será usado em uma caixa de diálogo que pergunta ao usuário se ele quer permanecer na página ou deixá-la.
Este mecanismo garante que um usuário seja capaz de deixar a página, mesmo se estiver executado um script malicioso que prefere mantê-los para sempre, a fim de forçá-los a olhar para alguns anúncios que leva alguns segundos.

## Cronograma do Script de execução

Há várias coisas que podem causar a inicialização da execução de um script. A leitura de um tag `<script>` é um exemplo disto. Um disparo de eventos é outra. No capítulo 13 discutimos a função `requestAnimationFrame` que agenda uma função a ser chamada antes de redesenhar a próxima página. Essa é mais uma forma em que um script pode começar a correr.

É importante entender que disparo de eventos podem ocorrer a qualquer momento, quando há dois scripts em um único documento eles nunca iram correr no mesmo tempo. Se um script já está em execução os manipuladores de eventos e o pedaço de código programado em outras formas teram de esperar por sua vez. Esta é a razão pela qual um documento irá congelar quando um script é executado por um longo tempo. O navegador não pode reagir aos cliques e outros eventos dentro do documento porque ele não pode executar manipuladores de eventos até que o script atual termine sua execução.

Alguns ambientes de programação permitem que múltiplas `threads` de execução se propaguem ao mesmo tempo.

Fazer várias coisas ao mesmo tempo torna um programa mais rápido. Mas quando você tem várias ações tocando nas mesmas partes do sistema, ao mesmo tempo torna-se de uma amplitude muito difícil.

O fato de que os programas de JavaScript fazem apenas uma coisa de cada vez torna a nossa vida mais fácil. Para os casos em que você precisar realmente fazer várias coisas ao muito tempo sem o congelamento da página, os navegadores fornecem algo chamado de `web workers`. Um `web workers` é um ambiente isolado do JavaScript que funciona ao lado do principal programa de um documento e pode se comunicar com ele apenas por envio e recebimento de mensagens.

Suponha que temos o seguinte código em um arquivo chamado `code/squareworker.js`:

````javascript
addEventListener("message", function(event) {
  postMessage(event.data * event.data);
});
````

Imagine que esta multiplicação de números seja pesado e com uma computação de longa duração e queremos performance então colocamos em uma `thread` em segundo plano. Este código gera um `worker` que envia algumas mensagens e produz respostas.

````javascript
var squareWorker = new Worker("code/squareworker.js");
squareWorker.addEventListener("message", function(event) {
  console.log("The worker responded:", event.data);
});
squareWorker.postMessage(10);
squareWorker.postMessage(24);
````

A função `postMessage` envia uma mensagem o que causa um evento de `"message"` disparado ao receptor. O roteiro que criou o `worker` envia e recebe mensagens através do objeto `Worker`, ao passo que as conversações de `worker` para o script que o criou é enviado e ouvido diretamente sobre o seu âmbito global não compartilhada-se do mesmo roteiro original.

## Definindo temporizadores

A função `requestAnimationFrame` é similar à `setTimeout`. Ele agenda outra função a ser chamado mais tarde. Mas em vez de chamar a função na próximo redesenho ele espera por uma determinada quantidade de milissegundos. Esta página muda de azul para amarelo depois de dois segundos:

````html
<script>
  document.body.style.background = "blue";
  setTimeout(function() {
    document.body.style.background = "yellow";
  }, 2000);
</script>
</script>
````

Às vezes você precisa cancelar uma função que você programou. Isto é feito através do armazenamento do valor devolvido por setTimeout e logo em seguida chamando `clearTimeout`.

````javascript
var bombTimer = setTimeout(function() {
  console.log("BOOM!");
}, 500);

if (Math.random() < 0.5) { // 50% chance
  console.log("Defused.");
  clearTimeout(bombTimer);
}
````

A função `cancelAnimationFrame` funciona da mesma forma que `clearTimeout` chamando um valor retornado pelo `requestAnimationFrame` que irá cancelar esse `frame`(supondo que ele já não tenha sido chamado).

Um conjunto de funções semelhante são `setInterval` e `clearInterval` são usados ​​para definir `timers` que devem repetir a cada X milisegundos.

````javascript
var ticks = 0;
var clock = setInterval(function() {
  console.log("tick", ticks++);
  if (ticks == 10) {
    clearInterval(clock);
    console.log("stop.");
  }
}, 200);
````

## Debouncing

Alguns tipos de eventos têm o potencial para disparar rapidamente muitas vezes em uma linha(os eventos `"mousemove"` e `"scroll"  por exemplo). Ao manusear tais eventos, você deve ter cuidado para não fazer nada muito demorado ou seu manipulador vai ocupar tanto tempo que a interação com o documento passa a ficar lento e instável.

Se você precisa fazer algo não trivial em tal manipulador você pode usar `setTimeout` para se certificar de que você não esteja fazendo isso com muita freqüência. Isto é geralmente chamado de `debouncing` de evento. Há várias abordagens ligeiramente diferentes para isso.

No primeiro exemplo, queremos fazer algo quando o usuário digitar alguma coisa mas não quero imediatamente, para todos os eventos de tecla. Quando ele esta digitando rapidamente nós só queremos esperar até que uma pausa é feita. Em vez de realizar uma ação imediatamente no manipulador de eventos vamos definir um tempo limite em seu lugar. Nós também limpamos o tempo limite anterior(se houver), de modo que, quando ocorrer os eventos juntos(mais perto do que o nosso tempo de espera) o tempo de espera do evento anterior será cancelado.

````html
<textarea>Type something here...</textarea>
<script>
  var textarea = document.querySelector("textarea");
  var timeout;
  textarea.addEventListener("keydown", function() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      console.log("You stopped typing.");
    }, 500);
  });
</script>
````

Dando um valor indefinido para `clearTimeout` ou chamando-o em um tempo limite que já tenha demitido, ele não tera efeito. Assim não temos que ter cuidado sobre quando chamá-lo simplesmente fazemos para todos os eventos.

Podemos usar um padrão ligeiramente diferente se quisermos de respostas no espaço de modo que eles fiquem separados por pelo menos um determinado período de tempo, mas quero remove-los durante uma série de eventos e não depois. Por exemplo, podemos querer responder a eventos de `"mousemove"`, mostrando as coordenadas atuais do mouse, mas apenas a cada 250 milisegundos.

````html
<script>
  function displayCoords(event) {
    document.body.textContent =
      "Mouse at " + event.pageX + ", " + event.pageY;
  }

  var scheduled = false, lastEvent;
  addEventListener("mousemove", function(event) {
    lastEvent = event;
    if (!scheduled) {
      scheduled = true;
      setTimeout(function() {
        scheduled = false;
        displayCoords(lastEvent);
      }, 250);
    }
  });
</script>
````

## Sumário

Os manipuladores de eventos tornam possível detectar e reagir sobre eventos que não têm controle direto. O método `addEventListener` é usado para registrar esse manipulador.

Cada evento tem um tipo(`"keydown"`,  `"focus"`, e assim por diante) que o identifica. A maioria dos eventos são chamados em um elementos DOM específicos e então propagam aos ancestrais desse elemento, permitindo que manipuladores associados a esses elementos possam lidar com eles.

Quando um manipulador de eventos é chamado, é passado um objeto de evento com informações adicionais sobre o mesmo. Este objeto também tem métodos que nos permitem parar a propagação(`stopPropagation`) ou evitar a manipulação padrão do navegador do evento(`preventDefault`).

Pressionando uma tecla, eventos de `"keydown"`, `"keypress"` e  `"keyup"` são disparados. Pressionar um botão do mouse, eventos de `"mousedown"`, `"mouseup"` e `"click"` são disparados. Movendo o mouse, eventos de `"mousemove"`, `"mouseenter"` e `"mouseout"` são disparados.

A rolagem pode ser detectado com o evento de `"scroll"`, e quando a mudança de foco este eventos podem ser detectadas com o `"focus"` e `"blur"`. Quando o documento termina de carregar, um evento de `"load"` é disparado no `window`.

Apenas um pedaço de programa JavaScript pode ser executado por vez. Manipuladores de eventos e outros scripts programados tem que esperar até outros scripts terminarem antes de chegar a sua vez.

## Exercícios

#### Censores de teclado

Entre 1928 e 2013, uma lei Turca proibiu o uso das letras Q, W, X em documentos oficiais. Isso foi parte de uma iniciativa mais ampla para reprimir culturas Kurdish, essas casos ocorreram na língua utilizada por pessoas Kurdish mas não para os turcos de Istambul.

Neste exercício você esta fazendo uma coisas ridículas com a tecnologia, eu estou pedindo para você programar um campo de texto(uma tag `<input type="text">`) onde essas letras não pode ser digitada.

(Não se preocupe em copiar e colar algum exemplo.)

````html
<input type="text">
<script>
  var field = document.querySelector("input");
  // Your code here.
</script>
````

**Dica**

A solução para este exercício que envolve o impedindo do comportamento padrão dos eventos de teclas. Você pode lidar com qualquer evento `"keypress"` ou `"keydown"`. Se um dos dois tiver `preventDefault` chamado sobre ele, a tecla não aparece.

Identificar a letra digitada requer olhar o código de acesso ou propriedade `charCode` e comparar isso com os códigos para as letras que você deseja filtrar. Em `"keydown"` você não precisa se preocupar com letras maiúsculas e minúsculas, uma vez que precisa somente identificar somente a tecla pressionada. Se você decidir lidar com `"keypress"` que identifica o caráter real digitado você tem que ter certeza que você testou para ambos os casos. Uma maneira de fazer isso seria esta:

/[qwx]/i.test(String.fromCharCode(event.charCode))

[Solução](http://jsfiddle.net/saulo/mdp44yv9/1/)

#### Trilha do mouse

Nos primeiros dias de JavaScript que era a hora de home pages berrantes com lotes de imagens animadas, as pessoas viram algumas maneiras verdadeiramente inspiradoras para usar a linguagem.

Uma delas foi a "trilha do mouse" a série de imagens que viriam a seguir o ponteiro do mouse quando você muda o cursor através da página.

Neste exercício, eu quero que você implemente um rastro de mouse. Use posicionadores absolutamente ao elemento `<div>` com um tamanho fixo e com uma cor de fundo(consulte o código na seção `"mouseclick"` para um exemplo). Crie um grupo de tais elementos e quando o mouse se mover exibir a esteira do ponteiro do mouse de alguma forma.

Existem várias abordagens possíveis aqui. Você pode fazer a sua solução simples ou complexa; como você quiser. Uma solução simples para começar é manter um número fixo de elementos da fuga e percorrê-las, movendo-se o próximo a posição atual do rato cada vez que um evento `"mousemove"` ocorrer.

````html
<style>
  .trail { /* className for the trail elements */
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
  // Your code here.
</script>
````

**Dica**

Para criar os elementos o melhor é fazer um loop e anexá-las ao documento para poder exibir. Para ser capaz de poder acessar mais tarde para alterar a sua posição e armazenar os elementos da fuga em uma matriz.

Ciclismo através deles pode ser feito mantendo uma variável de contador e adicionando 1 a ela toda vez que o evento de `"mousemove"` é disparado. O operador resto(% 10) pode então ser usado para obter um índice de matriz válida para escolher o elemento que você deseja posicionar durante um determinado evento.

Outro efeito interessante pode ser alcançado por um sistema de modelagem física simples. Use o evento `"mousemove"` apenas para atualizar um par de variáveis ​​que rastreiam a posição do mouse. Em seguida, use `requestAnimationFrame` para simular os elementos de rastros sendo atraídos para a posição do ponteiro do mouse. Em cada passo de animação atualizar a sua posição com base na sua posição relativa para o ponteiro do mouse(opcionalmente programe uma velocidade que é armazenado para cada elemento). Descobrir uma boa maneira de fazer isso é com você.

[Solução](http://jsfiddle.net/saulo/eeb5d4zs/)

#### Tab

A interface com abas é um padrão comum de design. Ele permite que você selecione um painel de interface escolhendo entre uma série de abas que se destaca acima de um outro elemento.

Neste exercício você vai implementar uma interface simples com abas. Escreva uma função `asTabs` que leva um nó do DOM e cria uma interface com abas mostrando os elementos filho desse nó. Você deverá inserir uma lista de elementos `<button>` na parte superior do nó e para cada elemento filho devera conter o texto recuperado do atributo `tabname` de cada botão. Todos exceto um dos filhos originais devem ser escondidos(dando um estilo de `display: none`) atualmente os nó disponíveis podem ser selecionados com um click nos botões.

Quando funcionar você devera mudar o estilo do botão ativo.

````html
<div id="wrapper">
  <div data-tabname="one">Tab one</div>
  <div data-tabname="two">Tab two</div>
  <div data-tabname="three">Tab three</div>
</div>
<script>
  function asTabs(node) {
    // Your code here.
  }
  asTabs(document.querySelector("#wrapper"));
</script>
````

**Dica**

Uma armadilha que você provavelmente vai encontrar é que não podera usar diretamente propriedade `childNodes` do nó como uma coleção de nós na tabulação. Por um lado quando você adiciona os botões eles também se tornam nós filhos e acabam neste objeto porque é em tempo de execução. Por outro lado os nós de texto criados para o espaço em branco entre os nós também estão lá e não deve obter os seus próprios guias.

Para contornar isso vamos começar a construir uma matriz real de todos os filhos do `wrapper` que têm um `nodeType` igual a 1.

Ao registrar manipuladores de eventos sobre os botões as funções de manipulador vai precisar saber qual separador do elemento está associada ao botão. Se eles são criados em um circuito normal você pode acessar a variável de índice do ciclo de dentro da função mas não vai dar-lhe o número correto pois essa variável terá posteriormente sido alterada pelo loop.

Uma solução simples é usar o método `forEach` para criar as funções de manipulador de dentro da função passada. O índice de loop que é passado como um segundo argumento para essa função, será uma variável local normal e que não serão substituídos por novas iterações.

[Solução](http://jsfiddle.net/saulo/hjjtrh5j/)
