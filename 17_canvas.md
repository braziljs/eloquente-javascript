{{meta {load_files: ["code/chapter/16_game.js", "code/levels.js", "code/_stop_keys.js", "code/chapter/17_canvas.js"], zip: "html include=[\"img/player.png\", \"img/sprites.png\"]"}}}

# Desenhando no Canvas

{{quote {author: "M.C. Escher", title: "cited by Bruno Ernst in The Magic Mirror of M.C. Escher", chapter: true}

Desenhar é enganar.

quote}}

{{index "Escher, M.C."}}

{{figure {url: "img/chapter_picture_17.jpg", alt: "Illustration showing an industrial-looking robot arm drawing a city on a piece of paper", chapter: "framed"}}}

{{index CSS, "transform (CSS)", [DOM, graphics]}}

Os navegadores nos oferecem diversas formas de exibir ((gráficos)). A maneira mais simples é usar estilos para posicionar e colorir elementos DOM comuns. Isso pode nos levar bem longe, como o jogo no [capítulo anterior](game) mostrou. Ao adicionar ((imagem))ns de fundo parcialmente transparentes aos nós, podemos fazê-los parecer exatamente como queremos. É até possível rotacionar ou distorcer nós com o estilo `transform`.

Mas estaríamos usando o DOM para algo para o qual ele não foi originalmente projetado. Algumas tarefas, como desenhar uma ((linha)) entre pontos arbitrários, são extremamente desajeitadas de fazer com elementos HTML comuns.

{{index SVG, "img (HTML tag)"}}

Existem duas alternativas. A primeira é baseada no DOM, mas utiliza _Scalable Vector Graphics_ (SVG) ao invés de HTML. Pense no SVG como um dialeto de marcação de ((documento))s que foca em ((forma))s ao invés de texto. Você pode incorporar um documento SVG diretamente em um documento HTML ou incluí-lo com uma tag `<img>`.

{{index clearing, [DOM graphics], [interface, canvas]}}

A segunda alternativa é chamada de _((canvas))_. Um canvas é um único elemento DOM que encapsula uma ((imagem)). Ele fornece uma interface de programação para desenhar ((forma))s no espaço ocupado pelo nó. A principal diferença entre um canvas e uma imagem SVG é que no SVG a descrição original das formas é preservada para que possam ser movidas ou redimensionadas a qualquer momento. Um canvas, por outro lado, converte as formas em ((pixel))s (pontos coloridos em uma grade) assim que são desenhadas e não lembra o que esses pixels representam. A única forma de mover uma forma em um canvas é limpar o canvas (ou a parte do canvas ao redor da forma) e redesenhá-la com a forma em uma nova posição.

## SVG

Este livro não vai entrar em detalhes sobre ((SVG)), mas explicarei brevemente como funciona. No [final do capítulo](canvas#graphics_tradeoffs), voltarei às compensações que você deve considerar ao decidir qual mecanismo de ((desenho)) é apropriado para uma determinada aplicação.

Este é um documento HTML com uma ((imagem)) SVG simples:

```{lang: html, sandbox: "svg"}
<p>Normal HTML here.</p>
<svg xmlns="http://www.w3.org/2000/svg">
  <circle r="50" cx="50" cy="50" fill="red"/>
  <rect x="120" y="5" width="90" height="90"
        stroke="blue" fill="none"/>
</svg>
```

{{index "circle (SVG tag)", "rect (SVG tag)", "XML namespace", XML, "xmlns attribute"}}

O atributo `xmlns` muda um elemento (e seus filhos) para um _namespace XML_ diferente. Esse namespace, identificado por uma ((URL)), especifica o dialeto que estamos falando no momento. As tags `<circle>` e `<rect>`, que não existem em HTML, têm significado em SVG — elas desenham formas usando o estilo e a posição especificados por seus atributos.

{{if book

O documento é exibido assim:

{{figure {url: "img/svg-demo.png", alt: "Screenshot showing an SVG image embedded in an HTML document", width: "4.5cm"}}}

if}}

{{index [DOM, graphics]}}

Essas tags criam elementos DOM, assim como tags HTML, com os quais scripts podem interagir. Por exemplo, isso muda o elemento `<circle>` para ser ((color))ido de ciano:

```{sandbox: "svg"}
let circle = document.querySelector("circle");
circle.setAttribute("fill", "cyan");
```

## O elemento canvas

{{index [canvas, size], "canvas (HTML tag)"}}

((Gráficos)) de canvas podem ser desenhados em um elemento `<canvas>`. Você pode dar a esse elemento atributos `width` e `height` para determinar seu tamanho em ((pixel))s.

Um novo canvas é vazio, o que significa que é inteiramente ((transparente)) e, portanto, aparece como espaço vazio no documento.

{{index "2d (canvas context)", "webgl (canvas context)", OpenGL, [canvas, context], dimensions, [interface, canvas]}}

A tag `<canvas>` é destinada a permitir diferentes estilos de ((desenho)). Para ter acesso a uma interface de desenho real, primeiro precisamos criar um _((contexto))_, um objeto cujos métodos fornecem a interface de desenho. Existem atualmente três estilos de desenho amplamente suportados: `"2d"` para gráficos bidimensionais, `"webgl"` para gráficos tridimensionais através da interface OpenGL, e `"webgpu"`, uma alternativa mais moderna e flexível ao WebGL.

{{index rendering, graphics, efficiency}}

Este livro não discutirá WebGL ou WebGPU — vamos nos ater a duas dimensões. Mas se você estiver interessado em gráficos tridimensionais, eu encorajo você a explorar o WebGPU. Ele fornece uma interface direta ao hardware gráfico e permite renderizar cenas complexas de forma eficiente, usando JavaScript.

{{index "getContext method", [canvas, context]}}

Você cria um ((contexto)) com o método `getContext` no elemento DOM `<canvas>`.

```{lang: html}
<p>Before canvas.</p>
<canvas width="120" height="60"></canvas>
<p>After canvas.</p>
<script>
  let canvas = document.querySelector("canvas");
  let context = canvas.getContext("2d");
  context.fillStyle = "red";
  context.fillRect(10, 10, 100, 50);
</script>
```

Depois de criar o objeto de contexto, o exemplo desenha um ((retângulo)) vermelho com 100 ((pixel))s de largura e 50 pixels de altura, com seu canto superior esquerdo nas coordenadas (10, 10).

{{if book

{{figure {url: "img/canvas_fill.png", alt: "Screenshot of a canvas with a rectangle on it", width: "2.5cm"}}}

if}}

{{index SVG, coordinates}}

Assim como em HTML (e SVG), o sistema de coordenadas que o canvas usa coloca (0, 0) no canto superior esquerdo, e o ((eixo)) y positivo vai para baixo a partir daí. Então (10, 10) está 10 pixels abaixo e à direita do canto superior esquerdo.

{{id fill_stroke}}

## Linhas e superfícies

{{index filling, stroking, drawing, SVG}}

Na interface do ((canvas)), uma forma pode ser _preenchida_, o que significa que sua área recebe uma determinada cor ou padrão, ou pode ser _traçada_, o que significa que uma ((linha)) é desenhada ao longo de sua borda. SVG usa a mesma terminologia.

{{index "fillRect method", "strokeRect method"}}

O método `fillRect` preenche um ((retângulo)). Ele recebe primeiro as ((coordenadas)) x e y do canto superior esquerdo do retângulo, depois sua largura e então sua altura. Um método similar chamado `strokeRect` desenha o ((contorno)) de um retângulo.

{{index [state, "of canvas"]}}

Nenhum dos métodos recebe parâmetros adicionais. A cor do preenchimento, espessura do traço e assim por diante não são determinados por um argumento do método, como você poderia razoavelmente esperar, mas sim por propriedades do objeto de contexto.

{{index filling, "fillStyle property"}}

A propriedade `fillStyle` controla a forma como as formas são preenchidas. Ela pode ser definida como uma string que especifica uma ((cor)), usando a notação de cor usada pelo ((CSS)).

{{index stroking, "line width", "strokeStyle property", "lineWidth property", canvas}}

A propriedade `strokeStyle` funciona de forma semelhante, mas determina a cor usada para uma linha traçada. A largura dessa linha é determinada pela propriedade `lineWidth`, que pode conter qualquer número positivo.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.strokeStyle = "blue";
  cx.strokeRect(5, 5, 50, 50);
  cx.lineWidth = 5;
  cx.strokeRect(135, 5, 50, 50);
</script>
```

{{if book

Este código desenha dois quadrados azuis, usando uma linha mais grossa para o segundo.

{{figure {url: "img/canvas_stroke.png", alt: "Screenshot showing two outlined squares", width: "5cm"}}}

if}}

{{index "default value", [canvas, size]}}

Quando nenhum atributo `width` ou `height` é especificado, como no exemplo, um elemento canvas recebe uma largura padrão de 300 pixels e altura de 150 pixels.

## Caminhos

{{index [path, canvas], [interface, design], [canvas, path]}}

Um caminho é uma sequência de ((linha))s. A interface 2D do canvas tem uma abordagem peculiar para descrever tal caminho. É feito inteiramente através de ((efeito colateral)). Caminhos não são valores que podem ser armazenados e passados. Em vez disso, se você quiser fazer algo com um caminho, faz uma sequência de chamadas de método para descrever sua forma.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  for (let y = 10; y < 100; y += 10) {
    cx.moveTo(10, y);
    cx.lineTo(90, y);
  }
  cx.stroke();
</script>
```

{{index canvas, "stroke method", "lineTo method", "moveTo method", shape}}

Este exemplo cria um caminho com vários segmentos de ((linha)) horizontais e depois o traça usando o método `stroke`. Cada segmento criado com `lineTo` começa na posição _atual_ do caminho. Essa posição é normalmente o final do último segmento, a menos que `moveTo` tenha sido chamado. Nesse caso, o próximo segmento começaria na posição passada para `moveTo`.

{{if book

O caminho descrito pelo programa anterior tem esta aparência:

{{figure {url: "img/canvas_path.png", alt: "Screenshot showing a number of vertical lines", width: "2.1cm"}}}

if}}

{{index [path, canvas], filling, [path, closing], "fill method"}}

Ao preencher um caminho (usando o método `fill`), cada ((forma)) é preenchida separadamente. Um caminho pode conter múltiplas formas — cada movimento `moveTo` inicia uma nova. Mas o caminho precisa estar _fechado_ (significando que seu início e fim estão na mesma posição) antes de poder ser preenchido. Se o caminho ainda não estiver fechado, uma linha é adicionada do seu fim ao seu início, e a forma delimitada pelo caminho completado é preenchida.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(50, 10);
  cx.lineTo(10, 70);
  cx.lineTo(90, 70);
  cx.fill();
</script>
```

Este exemplo desenha um triângulo preenchido. Note que apenas dois dos lados do triângulo são explicitamente desenhados. O terceiro, do canto inferior direito de volta ao topo, é implícito e não estaria lá se você traçasse o caminho.

{{if book

{{figure {url: "img/canvas_triangle.png", alt: "Screenshot showing a filled path", width: "2.2cm"}}}

if}}

{{index "stroke method", "closePath method", [path, closing], canvas}}

Você também pode usar o método `closePath` para fechar explicitamente um caminho adicionando um segmento de ((linha)) real de volta ao início do caminho. Este segmento _é_ desenhado ao traçar o caminho.

## Curvas

{{index [path, canvas], canvas, drawing}}

Um caminho também pode conter ((linha))s ((curva))s. Estas são, infelizmente, um pouco mais complicadas de desenhar.

{{index "quadraticCurveTo method"}}

O método `quadraticCurveTo` desenha uma curva até um determinado ponto. Para determinar a curvatura da linha, o método recebe um ((ponto de controle)) assim como um ponto de destino. Imagine este ponto de controle como _atraindo_ a linha, dando-lhe sua curva. A linha não passará pelo ponto de controle, mas sua direção nos pontos inicial e final será tal que uma linha reta naquela direção apontaria para o ponto de controle. O exemplo a seguir ilustra isso:

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(10, 90);
  // controle=(60, 10) destino=(90, 90)
  cx.quadraticCurveTo(60, 10, 90, 90);
  cx.lineTo(60, 10);
  cx.closePath();
  cx.stroke();
</script>
```

{{if book

Produz um caminho que se parece com isto:

{{figure {url: "img/canvas_quadraticcurve.png", alt: "Screenshot of a quadratic curve", width: "2.3cm"}}}

if}}

{{index "stroke method"}}

Desenhamos uma ((curva quadrática)) da esquerda para a direita, com (60, 10) como ponto de controle, e depois desenhamos dois segmentos de ((linha)) passando por aquele ponto de controle e de volta ao início da linha. O resultado se assemelha um pouco à insígnia de _((Star Trek))_. Você pode ver o efeito do ponto de controle: as linhas saindo dos cantos inferiores começam na direção do ponto de controle e depois ((curvam)) em direção ao seu alvo.

{{index canvas, "bezierCurveTo method"}}

O método `bezierCurveTo` desenha um tipo semelhante de curva. Em vez de um único ((ponto de controle)), este método tem dois — um para cada um dos pontos finais da ((linha)). Aqui está um esboço semelhante para ilustrar o comportamento de tal curva:

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(10, 90);
  // controle1=(10, 10) controle2=(90, 10) destino=(50, 90)
  cx.bezierCurveTo(10, 10, 90, 10, 50, 90);
  cx.lineTo(90, 10);
  cx.lineTo(10, 10);
  cx.closePath();
  cx.stroke();
</script>
```

Os dois pontos de controle especificam a direção em ambas as extremidades da curva. Quanto mais longe eles estiverem de seu ponto correspondente, mais a curva vai "inchar" naquela direção.

{{if book

{{figure {url: "img/canvas_beziercurve.png", alt: "Screenshot of a bezier curve", width: "2.2cm"}}}

if}}

{{index "trial and error"}}

Tais ((curva))s podem ser difíceis de trabalhar — nem sempre é claro como encontrar os ((ponto de controle))s que fornecem a ((forma)) que você está procurando. Às vezes você pode calculá-los, e às vezes terá que encontrar um valor adequado por tentativa e erro.

{{index "arc method", arc}}

O método `arc` é uma forma de desenhar uma linha que curva ao longo da borda de um círculo. Ele recebe um par de ((coordenadas)) para o centro do arco, um raio, e então um ângulo inicial e um ângulo final.

{{index pi, "Math.PI constant"}}

Esses dois últimos parâmetros possibilitam desenhar apenas parte do círculo. Os ((ângulo))s são medidos em ((radiano))s, não em ((grau))s. Isso significa que um ((círculo)) completo tem um ângulo de 2π, ou `2 * Math.PI`, que é aproximadamente 6,28. O ângulo começa a contar no ponto à direita do centro do círculo e vai no sentido horário a partir daí. Você pode usar um início de 0 e um final maior que 2π (digamos, 7) para desenhar um círculo completo.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  // centro=(50, 50) raio=40 ângulo=0 a 7
  cx.arc(50, 50, 40, 0, 7);
  // centro=(150, 50) raio=40 ângulo=0 a ½π
  cx.arc(150, 50, 40, 0, 0.5 * Math.PI);
  cx.stroke();
</script>
```

{{index "moveTo method", "arc method", [path, " canvas"]}}

A imagem resultante contém uma ((linha)) da direita do círculo completo (primeira chamada a `arc`) até a direita do quarto de ((círculo)) (segunda chamada).

{{if book

{{figure {url: "img/canvas_circle.png", alt: "Screenshot of a circle", width: "4.9cm"}}}

if}}

Como outros métodos de desenho de caminho, uma linha desenhada com `arc` é conectada ao segmento anterior do caminho. Você pode chamar `moveTo` ou iniciar um novo caminho para evitar isso.

{{id pie_chart}}

## Desenhando um gráfico de pizza

{{index "pie chart example"}}

Imagine que você acabou de conseguir um ((emprego)) na EconomiCorp, Inc. Sua primeira tarefa é desenhar um gráfico de pizza dos resultados de sua pesquisa de satisfação do ((cliente)).

A variável `results` contém um array de objetos que representam as respostas da pesquisa.

```{sandbox: "pie", includeCode: true}
const results = [
  {name: "Satisfied", count: 1043, color: "lightblue"},
  {name: "Neutral", count: 563, color: "lightgreen"},
  {name: "Unsatisfied", count: 510, color: "pink"},
  {name: "No comment", count: 175, color: "silver"}
];
```

{{index "pie chart example"}}

Para desenhar um gráfico de pizza, desenhamos várias fatias, cada uma composta por um ((arco)) e um par de ((linha))s até o centro daquele arco. Podemos calcular o ((ângulo)) ocupado por cada arco dividindo um círculo completo (2π) pelo número total de respostas e multiplicando esse número (o ângulo por resposta) pelo número de pessoas que escolheram uma determinada opção.

```{lang: html, sandbox: "pie"}
<canvas width="200" height="200"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let total = results
    .reduce((sum, {count}) => sum + count, 0);
  // Começar no topo
  let currentAngle = -0.5 * Math.PI;
  for (let result of results) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.beginPath();
    // centro=100,100, raio=100
    // do ângulo atual, sentido horário pelo ângulo da fatia
    cx.arc(100, 100, 100,
           currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    cx.lineTo(100, 100);
    cx.fillStyle = result.color;
    cx.fill();
  }
</script>
```

{{if book

Isso desenha o seguinte gráfico:

{{figure {url: "img/canvas_pie_chart.png", alt: "Screenshot showing a pie chart", width: "5cm"}}}

if}}

Mas um gráfico que não nos diz o que as fatias significam não é muito útil. Precisamos de uma forma de desenhar texto no ((canvas)).

## Texto

{{index stroking, filling, "fillStyle property", "fillText method", "strokeText method"}}

Um contexto de desenho 2D do canvas fornece os métodos `fillText` e `strokeText`. O último pode ser útil para contornar letras, mas normalmente `fillText` é o que você precisa. Ele preencherá o contorno do ((texto)) dado com o `fillStyle` atual.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.font = "28px Georgia";
  cx.fillStyle = "fuchsia";
  cx.fillText("I can draw text, too!", 10, 50);
</script>
```

Você pode especificar o tamanho, estilo e ((fonte)) do texto com a propriedade `font`. Este exemplo apenas define um tamanho de fonte e nome de família. Também é possível adicionar `italic` ou `bold` ao início da string para selecionar um estilo.

{{index "fillText method", "strokeText method", "textAlign property", "textBaseline property"}}

Os dois últimos argumentos para `fillText` e `strokeText` fornecem a posição na qual a fonte é desenhada. Por padrão, eles indicam a posição do início da linha de base alfabética do texto, que é a linha sobre a qual as letras "ficam em pé", não contando partes pendentes em letras como _j_ ou _p_. Você pode mudar a posição horizontal definindo a propriedade `textAlign` para `"end"` ou `"center"` e a posição vertical definindo `textBaseline` para `"top"`, `"middle"` ou `"bottom"`.

{{index "pie chart example"}}

Voltaremos ao nosso gráfico de pizza, e ao problema de ((rotular)) as fatias, nos [exercícios](canvas#exercise_pie_chart) no final do capítulo.

## Imagens

{{index "vector graphics", "bitmap graphics"}}

Em ((gráficos)) de computador, frequentemente se faz uma distinção entre gráficos _vetoriais_ e gráficos _bitmap_. O primeiro é o que estivemos fazendo até agora neste capítulo — especificar uma imagem dando uma descrição lógica de ((forma))s. Gráficos bitmap, por outro lado, não especificam formas reais, mas trabalham com dados de ((pixel)) (grades de pontos coloridos).

{{index "load event", "event handling", "img (HTML tag)", "drawImage method"}}

O método `drawImage` nos permite desenhar dados de ((pixel)) em um ((canvas)). Esses dados de pixel podem se originar de um elemento `<img>` ou de outro canvas. O exemplo a seguir cria um elemento `<img>` desanexado e carrega um arquivo de imagem nele. Mas o método não pode começar a desenhar a partir desta imagem imediatamente porque o navegador pode não tê-la carregado ainda. Para lidar com isso, registramos um manipulador de evento `"load"` e fazemos o desenho depois que a imagem foi carregada.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let img = document.createElement("img");
  img.src = "img/hat.png";
  img.addEventListener("load", () => {
    for (let x = 10; x < 200; x += 30) {
      cx.drawImage(img, x, 10);
    }
  });
</script>
```

{{index "drawImage method", scaling}}

Por padrão, `drawImage` desenhará a imagem em seu tamanho original. Você também pode dar dois argumentos adicionais para especificar a largura e altura da imagem desenhada, quando esses não forem os mesmos da imagem original.

Quando `drawImage` recebe _nove_ argumentos, ele pode ser usado para desenhar apenas um fragmento de uma imagem. O segundo ao quinto argumentos indicam o retângulo (x, y, largura e altura) na imagem de origem que deve ser copiado, e o sexto ao nono argumentos fornecem o retângulo (no canvas) no qual ele deve ser copiado.

{{index "player", "pixel art"}}

Isso pode ser usado para empacotar múltiplos _((sprite))s_ (elementos de imagem) em um único arquivo de imagem e então desenhar apenas a parte que você precisa. Por exemplo, esta imagem contém um personagem de jogo em múltiplas ((pose))s:

{{figure {url: "img/player_big.png", alt: "Pixel art showing a computer game character in 10 different poses. The first 8 form its running animation cycle, the 9th has the character standing still, and the 10th shows him jumping.", width: "6cm"}}}

{{index [animation, "platform game"]}}

Alternando qual pose desenhamos, podemos mostrar uma animação que parece um personagem caminhando.

{{index "fillRect method", "clearRect method", clearing}}

Para animar uma ((imagem)) em um ((canvas)), o método `clearRect` é útil. Ele se assemelha a `fillRect`, mas em vez de colorir o retângulo, o torna ((transparente)), removendo os pixels previamente desenhados.

{{index "setInterval function", "img (HTML tag)"}}

Sabemos que cada _((sprite))_, cada subimagem, tem 24 ((pixel))s de largura e 30 pixels de altura. O código a seguir carrega a imagem e então configura um intervalo (temporizador repetido) para desenhar o próximo ((quadro)):

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let img = document.createElement("img");
  img.src = "img/player.png";
  let spriteW = 24, spriteH = 30;
  img.addEventListener("load", () => {
    let cycle = 0;
    setInterval(() => {
      cx.clearRect(0, 0, spriteW, spriteH);
      cx.drawImage(img,
                   // retângulo de origem
                   cycle * spriteW, 0, spriteW, spriteH,
                   // retângulo de destino
                   0,               0, spriteW, spriteH);
      cycle = (cycle + 1) % 8;
    }, 120);
  });
</script>
```

{{index "remainder operator", "% operator", [animation, "platform game"]}}

A variável `cycle` rastreia nossa posição na animação. A cada ((quadro)), ela é incrementada e depois recortada de volta ao intervalo de 0 a 7 usando o operador de resto. Esta variável é então usada para calcular a coordenada x que o sprite para a pose atual tem na imagem.

## Transformação

{{index transformation, mirroring}}

{{indexsee flipping, mirroring}}

E se quisermos que nosso personagem ande para a esquerda em vez da direita? Poderíamos desenhar outro conjunto de sprites, é claro. Mas também poderíamos instruir o ((canvas)) a desenhar a imagem ao contrário.

{{index "scale method", scaling}}

Chamar o método `scale` fará com que qualquer coisa desenhada depois dele seja escalada. Este método recebe dois parâmetros, um para definir uma escala horizontal e um para definir uma escala vertical.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.scale(3, .5);
  cx.beginPath();
  cx.arc(50, 50, 40, 0, 7);
  cx.lineWidth = 3;
  cx.stroke();
</script>
```

{{if book

Por causa da chamada a `scale`, o círculo é desenhado três vezes mais largo e com metade da altura.

{{figure {url: "img/canvas_scale.png", alt: "Screenshot of a scaled circle", width: "6.6cm"}}}

if}}

{{index mirroring}}

O escalonamento fará com que tudo sobre a imagem desenhada, incluindo a ((largura da linha)), seja esticado ou comprimido conforme especificado. Escalar por uma quantidade negativa irá espelhar a imagem. O espelhamento acontece em torno do ponto (0, 0), o que significa que também inverterá a direção do sistema de coordenadas. Quando um escalonamento horizontal de -1 é aplicado, uma forma desenhada na posição _x_ 100 acabará no que costumava ser a posição -100.

{{index "drawImage method"}}

Para virar uma imagem, não podemos simplesmente adicionar `cx.scale(-1, 1)` antes da chamada a `drawImage`. Isso moveria nossa imagem para fora do ((canvas)), onde não será visível. Poderíamos ajustar as ((coordenadas)) dadas a `drawImage` para compensar isso desenhando a imagem na posição _x_ -50 em vez de 0. Outra solução, que não requer que o código que faz o desenho saiba sobre a mudança de escala, é ajustar o ((eixo)) em torno do qual o escalonamento acontece.

{{index "rotate method", "translate method", transformation}}

Existem vários outros métodos além de `scale` que influenciam o sistema de coordenadas para um ((canvas)). Você pode rotacionar formas desenhadas posteriormente com o método `rotate` e movê-las com o método `translate`. A coisa interessante — e confusa — é que essas transformações _se acumulam_, o que significa que cada uma acontece em relação às transformações anteriores.

{{index "rotate method", "translate method"}}

Se transladarmos por 10 pixels horizontais duas vezes, tudo será desenhado 20 pixels à direita. Se primeiro movermos o centro do sistema de coordenadas para (50, 50) e depois rotacionarmos por 20 ((grau))s (cerca de 0,1π ((radiano))s), essa rotação acontecerá _ao redor_ do ponto (50, 50).

{{figure {url: "img/transform.svg", alt: "Diagram showing the result of stacking transformations. The first diagram translates and then rotates, causing the translation to happen normally and rotation to happen around the target of the translation. The second diagram first rotates, and then translates, causing the rotation to happen around the origin and the translation direction to be tilted by that rotation.", width: "9cm"}}}

{{index coordinates}}

Mas se _primeiro_ rotacionarmos por 20 graus e _depois_ transladarmos por (50, 50), a translação acontecerá no sistema de coordenadas rotacionado e, portanto, produzirá uma orientação diferente. A ordem em que as transformações são aplicadas importa.

{{index axis, mirroring}}

Para espelhar uma imagem em torno da linha vertical em uma dada posição _x_, podemos fazer o seguinte:

```{includeCode: true}
function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}
```

{{index "flipHorizontally method"}}

Movemos o ((eixo)) y para onde queremos que nosso ((espelho)) esteja, aplicamos o espelhamento e finalmente movemos o eixo y de volta ao seu lugar adequado no universo espelhado. A imagem a seguir explica por que isso funciona:

{{figure {url: "img/mirror.svg", alt: "Diagram showing the effect of translating and mirroring a triangle", width: "8cm"}}}

{{index "translate method", "scale method", transformation, canvas}}

Isso mostra os sistemas de coordenadas antes e depois do espelhamento em torno da linha central. Os triângulos são numerados para ilustrar cada etapa. Se desenharmos um triângulo em uma posição _x_ positiva, ele estaria, por padrão, no lugar onde o triângulo 1 está. Uma chamada a `flipHorizontally` primeiro faz uma translação para a direita, o que nos leva ao triângulo 2. Depois escala, invertendo o triângulo para a posição 3. Este não é o lugar onde deveria estar, se fosse espelhado na linha dada. A segunda chamada `translate` corrige isso — ela "cancela" a translação inicial e faz o triângulo 4 aparecer exatamente onde deveria.

Agora podemos desenhar um personagem espelhado na posição (100, 0) invertendo o mundo ao redor do centro vertical do personagem.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let img = document.createElement("img");
  img.src = "img/player.png";
  let spriteW = 24, spriteH = 30;
  img.addEventListener("load", () => {
    flipHorizontally(cx, 100 + spriteW / 2);
    cx.drawImage(img, 0, 0, spriteW, spriteH,
                 100, 0, spriteW, spriteH);
  });
</script>
```

## Armazenando e limpando transformações

{{index "side effect", canvas, transformation}}

As transformações permanecem. Tudo que desenhamos depois de ((desenhar)) aquele personagem espelhado também seria espelhado. Isso pode ser inconveniente.

É possível salvar a transformação atual, fazer algum desenho e transformação, e depois restaurar a transformação antiga. Isso é normalmente a coisa correta a fazer para uma função que precisa transformar temporariamente o sistema de coordenadas. Primeiro, salvamos qualquer transformação que o código que chamou a função estava usando. Então a função faz seu trabalho, adicionando mais transformações sobre a transformação atual. Finalmente, revertemos para a transformação com a qual começamos.

{{index "save method", "restore method", [state, "of canvas"]}}

Os métodos `save` e `restore` no ((contexto)) 2D do canvas fazem esse gerenciamento de ((transformação)). Eles conceitualmente mantêm uma pilha de estados de transformação. Quando você chama `save`, o estado atual é empurrado para a pilha, e quando você chama `restore`, o estado no topo da pilha é retirado e usado como a transformação atual do contexto. Você também pode chamar `resetTransform` para redefinir completamente a transformação.

{{index "branching recursion", "fractal example", recursion}}

A função `branch` no exemplo a seguir ilustra o que você pode fazer com uma função que muda a transformação e depois chama uma função (neste caso, ela mesma), que continua desenhando com a transformação dada.

Esta função desenha uma forma semelhante a uma árvore desenhando uma linha, movendo o centro do sistema de coordenadas para o final da linha e chamando a si mesma duas vezes — primeiro rotacionada para a esquerda e depois rotacionada para a direita. Cada chamada reduz o comprimento do galho desenhado, e a recursão para quando o comprimento cai abaixo de 8.

```{lang: html}
<canvas width="600" height="300"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  function branch(length, angle, scale) {
    cx.fillRect(0, 0, 1, length);
    if (length < 8) return;
    cx.save();
    cx.translate(0, length);
    cx.rotate(-angle);
    branch(length * scale, angle, scale);
    cx.rotate(2 * angle);
    branch(length * scale, angle, scale);
    cx.restore();
  }
  cx.translate(300, 0);
  branch(60, 0.5, 0.8);
</script>
```

{{if book

O resultado é um fractal simples.

{{figure {url: "img/canvas_tree.png", alt: "Screenshot of a fractal", width: "5cm"}}}

if}}

{{index "save method", "restore method", canvas, "rotate method"}}

Se as chamadas a `save` e `restore` não estivessem lá, a segunda chamada recursiva a `branch` acabaria com a posição e rotação criadas pela primeira chamada. Ela não estaria conectada ao galho atual, mas sim ao galho mais interno e mais à direita desenhado pela primeira chamada. A forma resultante também poderia ser interessante, mas definitivamente não é uma árvore.

{{id canvasdisplay}}

## De volta ao jogo

{{index "drawImage method"}}

Agora sabemos o suficiente sobre ((desenho)) em canvas para começar a trabalhar em um sistema de ((exibição)) baseado em ((canvas)) para o ((jogo)) do [capítulo anterior](game). A nova exibição não mostrará mais apenas caixas coloridas. Em vez disso, usaremos `drawImage` para desenhar imagens que representam os elementos do jogo.

{{index "CanvasDisplay class", "DOMDisplay class", [interface, object]}}

Definimos outro tipo de objeto de exibição chamado `CanvasDisplay`, suportando a mesma interface que `DOMDisplay` do [Capítulo ?](game#domdisplay) — a saber, os métodos `syncState` e `clear`.

{{index [state, "in objects"]}}

Este objeto mantém um pouco mais de informação que `DOMDisplay`. Em vez de usar a posição de rolagem de seu elemento DOM, ele rastreia sua própria ((viewport)), que nos diz qual parte do nível estamos olhando no momento. Por fim, ele mantém uma propriedade `flipPlayer` para que, mesmo quando o jogador está parado, ele continue voltado na direção em que se moveu por último.

```{sandbox: "game", includeCode: true}
class CanvasDisplay {
  constructor(parent, level) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = Math.min(600, level.width * scale);
    this.canvas.height = Math.min(450, level.height * scale);
    parent.appendChild(this.canvas);
    this.cx = this.canvas.getContext("2d");

    this.flipPlayer = false;

    this.viewport = {
      left: 0,
      top: 0,
      width: this.canvas.width / scale,
      height: this.canvas.height / scale
    };
  }

  clear() {
    this.canvas.remove();
  }
}
```

O método `syncState` primeiro calcula uma nova viewport e depois desenha a cena do jogo na posição apropriada.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.syncState = function(state) {
  this.updateViewport(state);
  this.clearDisplay(state.status);
  this.drawBackground(state.level);
  this.drawActors(state.actors);
};
```

{{index scrolling, clearing}}

Ao contrário de `DOMDisplay`, este estilo de exibição _precisa_ redesenhar o fundo a cada atualização. Porque formas em um canvas são apenas ((pixel))s, depois de desenhá-las não há uma boa maneira de movê-las (ou removê-las). A única forma de atualizar a exibição do canvas é limpá-la e redesenhar a cena. Também podemos ter rolado, o que requer que o fundo esteja em uma posição diferente.

{{index "CanvasDisplay class"}}

O método `updateViewport` é semelhante ao método `scrollPlayerIntoView` de `DOMDisplay`. Ele verifica se o jogador está muito perto da borda da tela e move a ((viewport)) quando este é o caso.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.updateViewport = function(state) {
  let view = this.viewport, margin = view.width / 3;
  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5));

  if (center.x < view.left + margin) {
    view.left = Math.max(center.x - margin, 0);
  } else if (center.x > view.left + view.width - margin) {
    view.left = Math.min(center.x + margin - view.width,
                         state.level.width - view.width);
  }
  if (center.y < view.top + margin) {
    view.top = Math.max(center.y - margin, 0);
  } else if (center.y > view.top + view.height - margin) {
    view.top = Math.min(center.y + margin - view.height,
                        state.level.height - view.height);
  }
};
```

{{index boundary, "Math.max function", "Math.min function", clipping}}

As chamadas a `Math.max` e `Math.min` garantem que a viewport não acabe mostrando espaço fora do nível. `Math.max(x, 0)` garante que o número resultante não seja menor que zero. `Math.min` similarmente garante que um valor fique abaixo de um determinado limite.

Ao ((limpar)) a exibição, usaremos uma ((cor)) ligeiramente diferente dependendo de se o jogo foi vencido (mais clara) ou perdido (mais escura).

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.clearDisplay = function(status) {
  if (status == "won") {
    this.cx.fillStyle = "rgb(68, 191, 255)";
  } else if (status == "lost") {
    this.cx.fillStyle = "rgb(44, 136, 214)";
  } else {
    this.cx.fillStyle = "rgb(52, 166, 251)";
  }
  this.cx.fillRect(0, 0,
                   this.canvas.width, this.canvas.height);
};
```

{{index "Math.floor function", "Math.ceil function", rounding}}

Para desenhar o fundo, percorremos os blocos que são visíveis na viewport atual, usando o mesmo truque usado no método `touches` do [capítulo anterior](game#touches).

```{sandbox: "game", includeCode: true}
let otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.png";

CanvasDisplay.prototype.drawBackground = function(level) {
  let {left, top, width, height} = this.viewport;
  let xStart = Math.floor(left);
  let xEnd = Math.ceil(left + width);
  let yStart = Math.floor(top);
  let yEnd = Math.ceil(top + height);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let tile = level.rows[y][x];
      if (tile == "empty") continue;
      let screenX = (x - left) * scale;
      let screenY = (y - top) * scale;
      let tileX = tile == "lava" ? scale : 0;
      this.cx.drawImage(otherSprites,
                        tileX,         0, scale, scale,
                        screenX, screenY, scale, scale);
    }
  }
};
```

{{index "drawImage method", sprite, tile}}

Blocos que não são vazios são desenhados com `drawImage`. A imagem `otherSprites` contém as figuras usadas para elementos que não são o jogador. Ela contém, da esquerda para a direita, o bloco de parede, o bloco de lava e o sprite de uma moeda.

{{figure {url: "img/sprites_big.png", alt: "Pixel art showing three sprites: a piece of wall, made out of small white stones, a square of orange lava, and a round coin.", width: "1.4cm"}}}

{{index scaling}}

Os blocos de fundo são 20 por 20 pixels, pois usaremos a mesma escala de `DOMDisplay`. Assim, o deslocamento para blocos de lava é 20 (o valor da variável `scale`), e o deslocamento para paredes é 0.

{{index drawing, "load event", "drawImage method"}}

Não nos preocupamos em esperar a imagem de sprite carregar. Chamar `drawImage` com uma imagem que ainda não foi carregada simplesmente não fará nada. Assim, podemos falhar em desenhar o jogo corretamente nos primeiros ((quadro))s enquanto a imagem ainda está carregando, mas isso não é um problema sério. Como continuamos atualizando a tela, a cena correta aparecerá assim que o carregamento terminar.

{{index "player", [animation, "platform game"], drawing}}

O personagem ((andando)) mostrado anteriormente será usado para representar o jogador. O código que o desenha precisa escolher o ((sprite)) e a direção corretos com base no movimento atual do jogador. Os primeiros oito sprites contêm uma animação de caminhada. Quando o jogador está se movendo ao longo de um chão, ciclamos por eles com base no tempo atual. Queremos trocar de quadro a cada 60 milissegundos, então o ((tempo)) é primeiro dividido por 60. Quando o jogador está parado, desenhamos o nono sprite. Durante pulos, que são reconhecidos pelo fato de que a velocidade vertical não é zero, usamos o décimo sprite, o mais à direita.

{{index "flipHorizontally function", "CanvasDisplay class"}}

Como os ((sprite))s são ligeiramente mais largos que o objeto do jogador — 24 em vez de 16 pixels para permitir espaço para pés e braços — o método tem que ajustar a coordenada x e a largura por uma certa quantidade (`playerXOverlap`).

```{sandbox: "game", includeCode: true}
let playerSprites = document.createElement("img");
playerSprites.src = "img/player.png";
const playerXOverlap = 4;

CanvasDisplay.prototype.drawPlayer = function(player, x, y,
                                              width, height){
  width += playerXOverlap * 2;
  x -= playerXOverlap;
  if (player.speed.x != 0) {
    this.flipPlayer = player.speed.x < 0;
  }

  let tile = 8;
  if (player.speed.y != 0) {
    tile = 9;
  } else if (player.speed.x != 0) {
    tile = Math.floor(Date.now() / 60) % 8;
  }

  this.cx.save();
  if (this.flipPlayer) {
    flipHorizontally(this.cx, x + width / 2);
  }
  let tileX = tile * width;
  this.cx.drawImage(playerSprites, tileX, 0, width, height,
                                   x,     y, width, height);
  this.cx.restore();
};
```

O método `drawPlayer` é chamado por `drawActors`, que é responsável por desenhar todos os atores no jogo.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.drawActors = function(actors) {
  for (let actor of actors) {
    let width = actor.size.x * scale;
    let height = actor.size.y * scale;
    let x = (actor.pos.x - this.viewport.left) * scale;
    let y = (actor.pos.y - this.viewport.top) * scale;
    if (actor.type == "player") {
      this.drawPlayer(actor, x, y, width, height);
    } else {
      let tileX = (actor.type == "coin" ? 2 : 1) * scale;
      this.cx.drawImage(otherSprites,
                        tileX, 0, width, height,
                        x,     y, width, height);
    }
  }
};
```

Ao ((desenhar)) algo que não é o ((jogador)), olhamos seu tipo para encontrar o deslocamento do sprite correto. O bloco de ((lava)) é encontrado no deslocamento 20, e o sprite da ((moeda)) é encontrado em 40 (duas vezes `scale`).

{{index viewport}}

Temos que subtrair a posição da viewport ao calcular a posição do ator, já que (0, 0) no nosso ((canvas)) corresponde ao canto superior esquerdo da viewport, não ao canto superior esquerdo do nível. Poderíamos ter usado `translate` para isso também. De qualquer forma funciona.

{{if interactive

Este documento conecta a nova exibição a `runGame`:

```{lang: html, sandbox: game, focus: yes, startCode: true}
<body>
  <script>
    runGame(GAME_LEVELS, CanvasDisplay);
  </script>
</body>
```

if}}

{{if book

{{index [game, screenshot], [game, "with canvas"]}}

Isso conclui o novo sistema de ((exibição)). O jogo resultante se parece com algo assim:

{{figure {url: "img/canvas_game.png", alt: "Screenshot of the game as shown on canvas", width: "8cm"}}}

if}}

{{id graphics_tradeoffs}}

## Escolhendo uma interface gráfica

Quando você precisa gerar gráficos no navegador, pode escolher entre HTML simples, ((SVG)) e ((canvas)). Não existe uma abordagem _melhor_ que funcione em todas as situações. Cada opção tem pontos fortes e fracos.

{{index "text wrapping"}}

HTML simples tem a vantagem de ser simples. Ele também se integra bem com ((texto)). Tanto SVG quanto canvas permitem desenhar texto, mas eles não vão ajudá-lo a posicionar esse texto ou quebrá-lo quando ele ocupa mais de uma linha. Em uma imagem baseada em HTML, é muito mais fácil incluir blocos de texto.

{{index zooming, SVG}}

SVG pode ser usado para produzir ((gráficos)) ((nítidos)) que ficam bons em qualquer nível de zoom. Diferente de HTML, ele é projetado para desenho e é, portanto, mais adequado para esse propósito.

{{index [DOM, graphics], SVG, "event handling", ["data structure", tree]}}

Tanto SVG quanto HTML constroem uma estrutura de dados (o DOM) que representa sua imagem. Isso torna possível modificar elementos depois de serem desenhados. Se você precisa mudar repetidamente uma pequena parte de uma grande ((imagem)) em resposta ao que o usuário está fazendo ou como parte de uma ((animação)), fazer isso em um canvas pode ser desnecessariamente caro. O DOM também nos permite registrar manipuladores de eventos de mouse em cada elemento da imagem (mesmo em formas desenhadas com SVG). Você não pode fazer isso com canvas.

{{index performance, optimization, "ray tracer"}}

Mas a abordagem orientada a ((pixel))s do ((canvas)) pode ser uma vantagem ao desenhar um grande número de elementos minúsculos. O fato de que ele não constrói uma estrutura de dados, mas apenas desenha repetidamente na mesma superfície de pixels, dá ao canvas um custo menor por forma. Também existem efeitos que só são práticos com um elemento canvas, como renderizar uma cena um ((pixel)) de cada vez (por exemplo, usando um ray tracer) ou pós-processar uma imagem com JavaScript (desfocando ou distorcendo).

Em alguns casos, você pode querer combinar várias dessas técnicas. Por exemplo, você pode desenhar um ((gráfico)) com ((SVG)) ou ((canvas)), mas mostrar informações ((textuais)) posicionando um elemento HTML sobre a imagem.

{{index display}}

Para aplicações que não são exigentes, realmente não importa muito qual interface você escolha. A exibição que construímos para nosso jogo neste capítulo poderia ter sido implementada usando qualquer uma dessas três tecnologias de ((gráficos)), já que não precisa desenhar texto, lidar com interação do mouse, ou trabalhar com um número extraordinariamente grande de elementos.

## Resumo

Neste capítulo discutimos técnicas para desenhar gráficos no navegador, focando no elemento `<canvas>`.

Um nó canvas representa uma área em um documento na qual nosso programa pode desenhar. Esse desenho é feito através de um objeto de contexto de desenho, criado com o método `getContext`.

A interface de desenho 2D nos permite preencher e traçar várias formas. A propriedade `fillStyle` do contexto determina como as formas são preenchidas. As propriedades `strokeStyle` e `lineWidth` controlam a forma como as linhas são desenhadas.

Retângulos e pedaços de texto podem ser desenhados com uma única chamada de método. Os métodos `fillRect` e `strokeRect` desenham retângulos, e os métodos `fillText` e `strokeText` desenham texto. Para criar formas personalizadas, precisamos primeiro construir um caminho.

{{index stroking, filling}}

Chamar `beginPath` inicia um novo caminho. Vários outros métodos adicionam linhas e curvas ao caminho atual. Por exemplo, `lineTo` pode adicionar uma linha reta. Quando um caminho está pronto, ele pode ser preenchido com o método `fill` ou traçado com o método `stroke`.

Mover pixels de uma imagem ou outro canvas para nosso canvas é feito com o método `drawImage`. Por padrão, este método desenha a imagem fonte inteira, mas dando-lhe mais parâmetros, você pode copiar uma área específica da imagem. Usamos isso para nosso jogo copiando poses individuais do personagem do jogo de uma imagem que continha muitas dessas poses.

Transformações permitem desenhar uma forma em múltiplas orientações. Um contexto de desenho 2D tem uma transformação atual que pode ser alterada com os métodos `translate`, `scale` e `rotate`. Estes afetarão todas as operações de desenho subsequentes. Um estado de transformação pode ser salvo com o método `save` e restaurado com o método `restore`.

Ao mostrar uma animação em um canvas, o método `clearRect` pode ser usado para limpar parte do canvas antes de redesenhá-lo.

## Exercícios

### Formas

{{index "shapes (exercise)"}}

Escreva um programa que desenha as seguintes ((forma))s em um ((canvas)):

{{index rotation}}

1. Um ((trapézio)) (um ((retângulo)) que é mais largo de um lado)

2. Um ((losango)) vermelho (um retângulo rotacionado 45 graus ou ¼π radianos)

3. Uma ((linha)) em zigzag

4. Uma ((espiral)) composta de 100 segmentos de linha reta

5. Uma ((estrela)) amarela

{{figure {url: "img/exercise_shapes.png", alt: "Picture showing the shapes you are asked to draw", width: "8cm"}}}

Ao desenhar as duas últimas formas, você pode querer consultar a explicação de `Math.cos` e `Math.sin` no [Capítulo ?](dom#sin_cos), que descreve como obter coordenadas em um círculo usando essas funções.

{{index readability, "hardcoding"}}

Eu recomendo criar uma função para cada forma. Passe a posição, e opcionalmente outras propriedades como o tamanho ou o número de pontos, como parâmetros. A alternativa, que é colocar números fixos por todo o código, tende a tornar o código desnecessariamente difícil de ler e modificar.

{{if interactive

```{lang: html, test: no}
<canvas width="600" height="200"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");

  // Seu código aqui.
</script>
```

if}}

{{hint

{{index [path, canvas], "shapes (exercise)"}}

O ((trapézio)) (1) é mais fácil de desenhar usando um caminho. Escolha coordenadas centrais adequadas e adicione cada um dos quatro cantos ao redor do centro.

{{index "flipHorizontally function", rotation}}

O ((losango)) (2) pode ser desenhado da forma direta, com um caminho, ou da forma interessante, com uma ((transformação)) `rotate`. Para usar rotação, você terá que aplicar um truque semelhante ao que fizemos na função `flipHorizontally`. Como você quer rotacionar ao redor do centro do seu retângulo e não ao redor do ponto (0, 0), você deve primeiro `translate` para lá, depois rotacionar, e então transladar de volta.

Certifique-se de redefinir a transformação depois de desenhar qualquer forma que crie uma.

{{index "remainder operator", "% operator"}}

Para o ((zigzag)) (3) torna-se impraticável escrever uma nova chamada a `lineTo` para cada segmento de linha. Em vez disso, você deve usar um ((loop)). Você pode fazer cada iteração desenhar dois segmentos de ((linha)) (direita e depois esquerda novamente) ou um, caso em que você deve usar a paridade (`% 2`) do índice do loop para determinar se vai para a esquerda ou direita.

Você também precisará de um loop para a ((espiral)) (4). Se você desenhar uma série de pontos, com cada ponto se movendo mais ao longo de um círculo ao redor do centro da espiral, você obtém um círculo. Se, durante o loop, você variar o raio do círculo no qual está colocando o ponto atual e percorrer mais de uma volta, o resultado é uma espiral.

{{index "quadraticCurveTo method"}}

A ((estrela)) (5) representada é construída com linhas `quadraticCurveTo`. Você também poderia desenhar uma com linhas retas. Divida um círculo em oito pedaços para uma estrela com oito pontas, ou quantos pedaços quiser. Desenhe linhas entre esses pontos, fazendo-as curvar em direção ao centro da estrela. Com `quadraticCurveTo`, você pode usar o centro como ponto de controle.

hint}}

{{id exercise_pie_chart}}

### O gráfico de pizza

{{index label, text, "pie chart example"}}

[Anteriormente](canvas#pie_chart) no capítulo, vimos um programa de exemplo que desenhava um gráfico de pizza. Modifique este programa para que o nome de cada categoria seja mostrado ao lado da fatia que a representa. Tente encontrar uma forma visualmente agradável de posicionar automaticamente este texto que funcionaria para outros conjuntos de dados também. Você pode assumir que as categorias são grandes o suficiente para deixar espaço suficiente para seus rótulos.

Você pode precisar de `Math.sin` e `Math.cos` novamente, que são descritos no [Capítulo ?](dom#sin_cos).

{{if interactive

```{lang: html, test: no}
<canvas width="600" height="300"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let total = results
    .reduce((sum, {count}) => sum + count, 0);
  let currentAngle = -0.5 * Math.PI;
  let centerX = 300, centerY = 150;

  // Adicione código para desenhar os rótulos das fatias neste loop.
  for (let result of results) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.beginPath();
    cx.arc(centerX, centerY, 100,
           currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    cx.lineTo(centerX, centerY);
    cx.fillStyle = result.color;
    cx.fill();
  }
</script>
```

if}}

{{hint

{{index "fillText method", "textAlign property", "textBaseline property", "pie chart example"}}

Você precisará chamar `fillText` e definir as propriedades `textAlign` e `textBaseline` do contexto de tal forma que o texto termine onde você quer.

Uma forma sensata de posicionar os rótulos seria colocar o texto na linha que vai do centro da pizza através do meio da fatia. Você não quer colocar o texto diretamente contra o lado da pizza, mas sim mover o texto para fora do lado da pizza por um determinado número de pixels.

O ((ângulo)) desta linha é `currentAngle + 0.5 * sliceAngle`. O código a seguir encontra uma posição nesta linha 120 pixels a partir do centro:

```{test: no}
let middleAngle = currentAngle + 0.5 * sliceAngle;
let textX = Math.cos(middleAngle) * 120 + centerX;
let textY = Math.sin(middleAngle) * 120 + centerY;
```

Para `textBaseline`, o valor `"middle"` é provavelmente apropriado ao usar esta abordagem. O que usar para `textAlign` depende de qual lado do círculo estamos. No lado esquerdo, deve ser `"right"`, e no lado direito, deve ser `"left"`, para que o texto seja posicionado longe da pizza.

{{index "Math.cos function"}}

Se você não tem certeza de como descobrir de qual lado do círculo um determinado ângulo está, consulte a explicação de `Math.cos` no [Capítulo ?](dom#sin_cos). O cosseno de um ângulo nos diz qual coordenada x ele corresponde, o que por sua vez nos diz exatamente de qual lado do círculo estamos.

hint}}

### Uma bola quicando

{{index [animation, "bouncing ball"], "requestAnimationFrame function", bouncing}}

Use a técnica `requestAnimationFrame` que vimos no [Capítulo ?](dom#animationFrame) e no [Capítulo ?](game#runAnimation) para desenhar uma ((caixa)) com uma ((bola)) quicando dentro dela. A bola se move a uma ((velocidade)) constante e quica nas laterais da caixa quando as atinge.

{{if interactive

```{lang: html, test: no}
<canvas width="400" height="400"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");

  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      updateAnimation(Math.min(100, time - lastTime) / 1000);
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function updateAnimation(step) {
    // Seu código aqui.
  }
</script>
```

if}}

{{hint

{{index "strokeRect method", animation, "arc method"}}

Uma ((caixa)) é fácil de desenhar com `strokeRect`. Defina uma variável que contenha seu tamanho, ou defina duas variáveis se a largura e altura da sua caixa forem diferentes. Para criar uma ((bola)) redonda, comece um caminho e chame `arc(x, y, raio, 0, 7)`, que cria um arco indo de zero a mais de um círculo completo. Depois preencha o caminho.

{{index "collision detection", "Vec class"}}

Para modelar a posição e ((velocidade)) da bola, você pode usar a classe `Vec` do [Capítulo ?](game#vector)[ (que está disponível nesta página)]{if interactive}. Dê a ela uma velocidade inicial, de preferência uma que não seja puramente vertical ou horizontal, e para cada ((quadro)) multiplique essa velocidade pelo tempo decorrido. Quando a bola chegar muito perto de uma parede vertical, inverta o componente _x_ de sua velocidade. Da mesma forma, inverta o componente _y_ quando ela atingir uma parede horizontal.

{{index "clearRect method", clearing}}

Depois de encontrar a nova posição e velocidade da bola, use `clearRect` para apagar a cena e redesenhá-la usando a nova posição.

hint}}

### Espelhamento pré-computado

{{index optimization, "bitmap graphics", mirror}}

Uma coisa infeliz sobre ((transformação))s é que elas tornam mais lento o desenho de bitmaps. A posição e tamanho de cada ((pixel)) precisam ser transformados, e embora seja possível que os ((navegadores)) fiquem mais inteligentes sobre transformação no ((futuro)), elas atualmente causam um aumento mensurável no tempo que leva para desenhar um bitmap.

Em um jogo como o nosso, onde estamos desenhando apenas um único sprite transformado, isso não é um problema. Mas imagine que precisássemos desenhar centenas de personagens ou milhares de partículas rotacionando de uma explosão.

Pense em uma forma de desenhar um personagem invertido sem carregar arquivos de imagem adicionais e sem ter que fazer chamadas `drawImage` transformadas a cada quadro.

{{hint

{{index mirror, scaling, "drawImage method"}}

A chave da solução é o fato de que podemos usar um elemento ((canvas)) como imagem fonte ao usar `drawImage`. É possível criar um elemento `<canvas>` extra, sem adicioná-lo ao documento, e desenhar nossos sprites invertidos nele, uma vez. Ao desenhar um quadro real, apenas copiamos os sprites já invertidos para o canvas principal.

{{index "load event"}}

Algum cuidado seria necessário porque as imagens não carregam instantaneamente. Fazemos o desenho invertido apenas uma vez, e se fizermos antes da imagem carregar, não desenhará nada. Um manipulador `"load"` na imagem pode ser usado para desenhar as imagens invertidas no canvas extra. Este canvas pode ser usado como fonte de desenho imediatamente (ele simplesmente ficará em branco até desenharmos o personagem nele).

hint}}
