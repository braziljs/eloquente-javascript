{{meta {load_files: ["code/chapter/16_game.js", "code/levels.js", "code/chapter/17_canvas.js"], zip: "html include=[\"img/player.png\", \"img/sprites.png\"]"}}}

# Desenhando em Canvas

{{quote {author: "M.C. Escher", title: "citado por Bruno Ernst em The Magic Mirror de M.C. Escher", chapter: true}

Desenhar é uma decepção.

quote}}

{{index "Escher, M.C."}}

{{figure {url: "img/chapter_picture_17.jpg", alt: "Imagem de um braço robótico desenhando no papel", chapter: "framed"}}}

{{index CSS, "transform (CSS)", [DOM, graphics]}}

Os navegadores nos dão várias formas de posicionar ((gráficos)). A forma mais fácil é usar estilos para posicionar e colorir elementos comuns do DOM. Isso pode te levar bem longe, como o jogo do [capítulo anterior](jogo) mostra. Adicionando ((image))ns de fundo parcialmente transparentes aos nós, podemos fazê-las parecer exatamente da forma que quisermos. É possivel até rotacionar ou inclinar nós com o estilo `transform`.

Mas estaríamos usando o DOM para algo que não foi criado originalmente. Algumas tarefas, como desenhar uma ((linha)) entre pontos arbitrários, são extremamente estranhas de serem feitas com elementos comuns do HTML.

{{index SVG, "img (HTML tag)"}}

Existe duas alternativas. A primeira é baseada no DOM, mas utiliza _Vetores Gráficos Escaláveis_ (SVG) no lugar do HTML. Pense no SVG como uma forma de marcação de ((documento))s que foca nas ((forma))s ao invés do texto. Você pode incorporar um documento SVG diretamente em um documento HTML ou inclui-lo com uma tag `<img>`.

{{index clearing, [DOM graphics], [interface, canvas]}}

A segunda alternativa é chamada de _((canvas))_. Um canvas é somente um elemento DOM que encapsula uma ((figura)). Ela fornece uma interface de programação para desenhar ((forma))s no espaço ocupado pelo nó. A principal diferença entre um canvas e uma figura SVG é que no SVG a descrição original das formas é preservada para que elas possam ser movidas ou redimensionadas a qualquer momento. Um canvas, por outro lado, converte as formas para ((pixel))s (pontos coloridos rasterizados) assim que são desenhadas e não se lembra do que esses pixels representam. A única forma de mover uma forma em um canvas é limpar o canvas (ou parte do canvas ao redor da forma) e redesenhá-lo com a forma em uma posição nova.

## SVG

Esse livro não irá se aprofundar no ((SVG)), mas vou explicar brevemente como isso funciona. No [final do capítulo](canvas#graphics_tradeoffs), vou voltar às diferenças que você deve considerar quando estiver se decidindo sobre qual mecanismo de ((desenho)) é apropriado para tal aplicação.

Esse é um documento HTML que contém uma ((figura)) SVG simples:

```{lang: "text/html", sandbox: "svg"}
<p>Um HTML normal aqui.</p>
<svg xmlns="http://www.w3.org/2000/svg">
  <circle r="50" cx="50" cy="50" fill="red"/>
  <rect x="120" y="5" width="90" height="90"
        stroke="blue" fill="none"/>
</svg>
```

{{index "circle (SVG tag)", "rect (SVG tag)", "XML namespace", XML, "xmlns attribute"}}

O atributo `xmlns` muda um elemento (e seus filhos) para um namespace _XML diferente_. Esse namespace, identificado por uma ((URL)), especifica a forma que estamos usando atualmente. As tags `<circle>` e `<rect>`, que não existem no HTML, têm significado no SVG – elas desenham formas usando o estilo e a posição especificados por seus atributos.

{{if book

O documento é mostrado dessa forma:

{{figure {url: "img/svg-demo.png", alt: "Uma imagem SVG incorporada",width: "4.5cm"}}}

if}}

{{index [DOM, graphics]}}

Essas tags criam elementos DOM, assim como as tags HTML, com quem os scripts interagem. Por exemplo, essa linha de código muda o elemento `<circle>` para ter a ((cor)) ciano:

```{sandbox: "svg"}
let circle = document.querySelector("circle");
circle.setAttribute("fill", "cyan");
```

## O elemento canvas

{{index [canvas, size], "canvas (HTML tag)"}}

((Gráficos)) canvas podem ser desenhados dentro de um elemento `<canvas>`. Você pode dar os atributos de `width` (largura) e `height` (altura) a um elemento para determinar seu tamanho em pixels.

Um novo canvas está vazio, o que significa que está completamente ((transparente)) e, portanto, aparece como um espaço vazio no documento.

{{index "2d (canvas context)", "webgl (canvas context)", OpenGL, [canvas, context], dimensions, [interface, canvas]}}

A tag `<canvas>` serve para permitir estilos diferentes de desenho. Para de fato acessar uma interface de desenho, primeiro precisamos criar um context (contexto), um objeto cujos métodos fornecem a interface de desenho. Atualmente existem dois estilos de desenho com grande suporte: `"2d"`  para gráficos de duas dimensões e `"webgl"` para gráficos com três dimensões através da interface OpenGL.

{{index rendering, graphics, efficiency}}

Esse livro não vai falar sobre WebGL – vamos focar em duas dimensões. Mas se estiver interessado nos gráficos de três dimensões, te encorajo a dar uma olhada no WebGL. Ele dá uma interface bem direta aos gráficos no hardware e permite que você renderize cenas bem complicadas de forma eficiente, usando JavaScript.

{{index "getContext method", [canvas, context]}}

Você cria um ((contexto)) com o método `getContext` no elemento DOM `<canvas>`.

```{lang: "text/html"}
<p>Antes do canvas.</p>
<canvas width="120" height="60"></canvas>
<p>Após o canvas.</p>
<script>
  let canvas = document.querySelector("canvas");
  let context = canvas.getContext("2d");
  context.fillStyle = "red";
  context.fillRect(10, 10, 100, 50);
</script>
```

Após criar o objeto de contexto, o exemplo desenha um ((retângulo)) vermelho de 100 pixels de largura e 50 ((pixel))s de altura, com seu canto superior esquerdo nas coordenadas (10,10).

{{if book

{{figure {url: "img/canvas_fill.png", alt: "Um canvas com um retângulo",width: "2.5cm"}}}

if}}

{{index SVG, coordinates}}

Assim como no HTML (e no SVG), o sistema de coordenadas que o canvas usa posiciona (0,0) no canto superior esquerdo, e o ((eixo)) y positivo começa dali. Logo, (10,10) fica 10 pixels abaixo e à direita do canto superior esquerdo.

{{id fill_stroke}}

## Linhas e superfícies

{{index filling, stroking, drawing, SVG}}

Na interface do ((canvas)), uma forma pode ser _preenchida_, o que significa que é dada uma certa cor à sua área, ou pode ser _contornada_, o que significa que uma ((linha)) é desenhada junto de sua borda. A mesma terminologia é usada pelo SVG.

{{index "fillRect method", "strokeRect method"}}

O método `fillRect` preenche um ((retângulo)). Ele pega primeiro as ((coordenadas)) em x e y do canto superior esquerdo do retângulo, e então sua largura, e depois sua altura. Um método similar, `strokeRect`, desenha o ((contorno)) de um retângulo.

{{index [state, "of canvas"]}}

Nenhum método precisa de outros parâmetros. A cor de preenchimento, a espessura do contorno e aí em diante não são determinados por um argumento no método (como já era de se esperar), mas por propriedades do contexto do objeto.

{{index filling, "fillStyle property"}}

A propriedade `fillStyle` controla a maneira em que as formas são preenchidas. Ela pode ser definida em um texto que especifica uma ((cor)), usando a notação de cor usada pelo ((CSS)).

{{index stroking, "line width", "strokeStyle property", "lineWidth property", canvas}}

A propriedade `strokeStyle` funciona de forma semelhante, mas determina a cor usada por uma linha de contorno. A largura dessa linha é determinada pela propriedade `lineWidth`, que pode conter qualquer número positivo.

```{lang: "text/html"}
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

Esse código mostra dois quadrados azuis, usando uma linha mais fina para o segundo.

{{figure {url: "img/canvas_stroke.png", alt: "Dois quadrados contornados",width: "5cm"}}}

if}}

{{index "default value", [canvas, size]}}

Quando nenhum atributo de `width` (largura) ou `height` (altura) é especificado, como no exemplo, um elemento do canvas adquire uma largura padrão de 300 pixels e altura de 150 pixels.

## Caminhos

{{index [path, canvas], [interface, design], [canvas, path]}}

Um caminho é uma sequência de ((linha))s. Uma interface canvas 2D usa uma abordagem peculiar para descrever tal caminho. É feita inteiramente através de ((efeitos colaterais)). Caminhos não são valores que podem ser armazenados e passados para a frente. Ao invés disso, se quiser fazer algo com um caminho, você usa uma sequência de chamadas de método para descrever sua forma.

```{lang: "text/html"}
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

Esse exemplo cria um caminho com um número de segmentos de ((linha))s horizontais e então contorna usando o método `stroke`. Cada segmento criado com o `lineTo` começa na posição _atual_ do caminho. Essa posição geralmente está no final do último segmento, a não ser que a `moveTo` tenha sido chamada. Nesse caso, o próximo segmento teria início na posição passada para a `moveTo`.

{{if book

O caminho descrito pelo programa anterior é mais ou menos assim:

{{figure {url: "img/canvas_path.png", alt: "Contornando um número de linhas",width: "2.1cm"}}}

if}}

{{index [path, canvas], filling, [path, closing], "fill method"}}

Quando estiver preenchendo um caminho (usando o método `fill`), cada forma é preenchida separadamente. Um caminho pode conter várias formas – cada movimento do método `moveTo` inicia uma nova. Mas o caminho precisa ser _fechado_ (o que quer dizer que seu início e fim estão na mesma posição) antes de ser preenchido. Se o caminho já não e fechado, uma linha é adicionada do seu final para seu começo, e a forma concluída pelo caminho completado é preenchida.

```{lang: "text/html"}
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

Esse exemplo desenha um triângulo preenchido. Note que somente dois dos lados do triângulo são desenhados de forma explícita. O terceiro, do canto inferior direito ao superior, está implícito e não estaria lá quando você contornasse o caminho.

{{if book

{{figure {url: "img/canvas_triangle.png", alt: "Preenchendo um caminho",width: "2.2cm"}}}

if}}

{{index "stroke method", "closePath method", [path, closing], canvas}}

Você também pode usar o método `closePath` para fechar um caminho de forma explícita adicionando uma ((linha)) de segmento de volta ao início do caminho. Esse segmento _é_ desenhado quando estiver contornando o caminho.

## Curvas

{{index [path, canvas], canvas, drawing}}

Um caminho também pode conter ((linha))s ((curvada))s. Esses são, infelizmente, mais complicadas de desenhar.

{{index "quadraticCurveTo method"}}

O método `quadraticCurveTo` desenha uma curva em determinado ponto. Para determinar a curvatura da linha, o método gera um ((ponto de controle)), assim como um ponto de destino. Imagine que esse ponto de controle está _atraindo_ a linha, dando a ela sua curva. A linha não vai atravessar o ponto de controle, mas sua direção nos pontos de início e final agirá de forma que uma reta nessa direção apontaria para o ponto de controle. O exemplo a seguir ilustra isso:

```{lang: "text/html"}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(10, 90);
  // control=(60,10) goal=(90,90)
  cx.quadraticCurveTo(60, 10, 90, 90);
  cx.lineTo(60, 10);
  cx.closePath();
  cx.stroke();
</script>
```

{{if book

Ela faz um caminho mais ou menos assim:

{{figure {url: "img/canvas_quadraticcurve.png", alt: "Uma curva quadrática",width: "2.3cm"}}}

if}}

{{index "stroke method"}}

Desenhamos uma (((curva quadrática))) da esquerda para a direita, com (60,10) como ponto de controle, e então desenhamos dois segmentos de ((linha)) atravessando esse ponto de controle e voltando ao início da linha. O resultado lembra a insígnia de _((Star Trek))_ de certa forma. Você pode ver o efeito do ponto de controle: as linhas deixando os cantos inferiores começam na direção do ponto de controle e então se ((curva))m em direção ao seu alvo.

{{index canvas, "bezierCurveTo method"}}

O método `bezierCurveTo` desenha uma curva semelhante. Ao invés de apenas um ((ponto de controle)), ele tem dois – um para cada um dos pontos de extremidade da ((linha)). Aqui está um rascunho semelhante para ilustrar o comportamento de tal curva:

```{lang: "text/html"}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(10, 90);
  // control1=(10,10) control2=(90,10) goal=(50,90)
  cx.bezierCurveTo(10, 10, 90, 10, 50, 90);
  cx.lineTo(90, 10);
  cx.lineTo(10, 10);
  cx.closePath();
  cx.stroke();
</script>
```

Os dois pontos de controle especificam a direção em ambos os finais da curva. Quanto mais longe eles forem de seu ponto correspondente, mais a curva vai “pender” naquela direção.

{{if book

{{figure {url: "img/canvas_beziercurve.png", alt: "Uma curva de bezier",width: "2.2cm"}}}

if}}

{{index "trial and error"}}

Pode ser difícil trabalhar com tais ((curva))s – nem sempre é claro como encontrar os ((pontos de controle)) que gerem a ((forma)) que você está procurando. Às vezes, você pode computá-los, e às vezes você só terá que encontrar um valor que se encaixe por tentativa e erro.

{{index "arc method", arc}}

O método `arc` é uma forma de desenhar uma linha que curve junto da borda de um círculo. Ele leva um par de ((coordenadas)) para o centro do arco, um raio, e então um ângulo de início e final.

{{index pi, "Math.PI constant"}}

Esses últimos dois parâmetros tornam possível desenhar apenas parte do círculo. Os ((ângulo))s são medidos em ((radiano))s, não ((grau))s. Isso significa que um círculo completo tem um ângulo de 2π, ou `2 * Math.PI`, o que dá cerca de 6,28. O ângulo começa contando no ponto à direita do centro do círculo e segue o sentido horário dali. Você pode usar o começo como 0 e terminar maior que 2π (digamos que 7) para desenhar um círculo completo.

```{lang: "text/html"}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  // center=(50,50) radius=40 angle=0 to 7
  cx.arc(50, 50, 40, 0, 7);
  // center=(150,50) radius=40 angle=0 to ½π
  cx.arc(150, 50, 40, 0, 0.5 * Math.PI);
  cx.stroke();
</script>
```

{{index "moveTo method", "arc method", [path, " canvas"]}}

O resultado contém uma ((linha)) da direita do círculo completo (primeira chamada do `arc`) para a direita de um quarto do ((círculo)) (segunda chamada). Como outros métodos de desenho de caminho, uma linha desenhada com um `arc` é conectada ao segmento de caminho anterior. Você pode chamar o `moveTo` ou começar um novo caminho para evitar isso.

{{if book

{{figure {url: "img/canvas_circle.png", alt: "Desenhando um círculo",width: "4.9cm"}}}

if}}

{{id pie_chart}}

## Desenhando um gráfico de pizza

{{index "pie chart example"}}

Imagine que você acabou de conseguir um ((emprego)) na EconomiCorp, Inc., e sua primeira tarefa é desenhar um gráfico de pizza de seus resultados da pesquisa de satisfação do consumidor.

A variável `results` contém um array de objetos que representa as respostas da pesquisa.

```{sandbox: "pie", includeCode: true}
const results = [
  {name: "Satisfatorio", count: 1043, color: "lightblue"},
  {name: "Neutro", count: 563, color: "lightgreen"},
  {name: "Insatisfatorio", count: 510, color: "pink"},
  {name: "Sem comentario", count: 175, color: "silver"}
];
```

{{index "pie chart example"}}

Para desenhar um gráfico de piza, desenhamos um número de fatias de pizza, cada um feito de um ((arco)) e um par de ((linha))s até o centro desse arquivo. Podemos computar o ((ângulo)) usado em cada arco dividindo um círculo inteiro (2π) pelo total do número de respostas e então multiplicando esse número (o ângulo por resposta) pelo número de pessoas que escolheram determinada opção.

```{lang: "text/html", sandbox: "pie"}
<canvas width="200" height="200"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let total = results
    .reduce((sum, {count}) => sum + count, 0);
  // começa por cima
  let currentAngle = -0.5 * Math.PI;
  for (let result of results) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.beginPath();
    // centro=100,100, raio=100
    // do ângulo atual, sentido horário do ângulo da fatia
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

{{figure {url: "img/canvas_pie_chart.png", alt: "Um gráfico de pizza",width: "5cm"}}}

if}}

Só que um gráfico não nos dizer o que cada fatia significa não é muito útil. Precisamos de uma forma de desenhar texto no ((canvas)).

## Texto

{{index stroking, filling, "fillStyle property", "fillText method", "strokeText method"}}

Um canvas desenhado em contexto 2D contém os métodos `fillText` e `strokeText`. O segundo pode ser útil para delinear letras, mas geralmente o `fillText` é o que você precisa. Ele vai preencher o delineado de determinado texto com a `fillColor` atual.

```{lang: "text/html"}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.font = "28px Georgia";
  cx.fillStyle = "fuchsia";
  cx.fillText("Também consigo desenhar texto!", 10, 50);
</script>
```

Você pode especificar o tamanho, estilo e ((fonte)) do texto com a propriedade `font`. Esse exemplo dá um tamanho e tipo para a fonte. Também é possível adicionar `italic` ou `bold` no início da string para selecionar um estilo.

{{index "fillText method", "strokeText method", "textAlign property", "textBaseline property"}}

Os últimos dois argumentos para `fillText` e `strokeText` determinam a posição que a fonte é desenhada. Por padrão, eles indicam a posição do início da linha de base alfabética do texto, que é a linha que as letras se “apoiam”, sem contar as partes suspensas em letras como _j_ ou _p_. Você pode mudar a posição horizontal definindo a propriedade `textAlign` para `"end"` ou `"center"` e a posição vertical definindo a `textBaseline` para `"top"`, `"middle"` ou `"bottom"`.

{{index "pie chart example"}}

Vamos voltar ao gráfico de pizza e ao problema de ((rotular)) as fatias nos [exercícios](canvas#exercise_pie_chart) ao final do capítulo.

## Imagens

{{index "vector graphics", "bitmap graphics"}}

Nos ((gráficos)) computacionais, uma distinção costuma ser feita entre gráficos tipo _vector_ e _bitmap_. O primeiro é o que estivemos fazendo até então nesse capítulo – especificando uma figura dando uma descrição lógica de ((forma))s. Gráficos bitmap, por outro lado, não especificam as formas reais, mas trabalham com ((pixel))s (grupos de pontos coloridos) ao invés disso.

{{index "load event", "event handling", "img (HTML tag)", "drawImage method"}}

O método `drawImage` nos permite desenhar ((pixel))s dentro de um canvas. Esses pixels podem se originar de um elemento `<img>` ou de outro canvas. O exemplo em seguida cria um elemento `<img>` desanexado e carrega um arquivo de imagem dentro dela. Mas isso não pode começar a desenhar imediatamente a partir dessa figura porque o browser pode não ter carregado ainda. Para lidar com isso, registramos um event handler `"load"` e desenhamos após a imagem ter carregado.

```{lang: "text/html"}
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

Por padrão, o `drawImage` desenhará a imagem em seu tamanho original. Você também pode usar dois argumentos adicionais para definir larguras e alturas diferentes.

Quando o `drawImage` tiver _nove_ argumentos, pode ser usado para desenhar apenas um fragmento de uma imagem. Do segundo ao quinto argumento indicamos o retângulo (x, y, largura e altura) na imagem fonte que deve ser copiada, e do sexto ao nono argumento definimos o retângulo (no canvas) para o qual ele deve ser copiado.

{{index "player", "pixel art"}}

Ele pode ser usado para agrupar diversos _((sprites))_ (elementos de imagem) dentro de uma única imagem e então desenhar só a parte que você precisa. Por exemplo, temos essa imagem contendo um personagem de jogo em várias ((posições)):

{{figure {url: "img/player_big.png", alt: "Várias poses de um personagem",width: "6cm", [animation, "platform game"]}}}

Alternando a pose em que desenhamos, podemos mostrar uma animação que parece um personagem caminhando.

{{index "fillRect method", "clearRect method", clearing}}

Para animar uma figura em um canvas, o método `clearRect` é útil. Ele lembra o `fillRect`, mas ao invés de colorir o retângulo, ele o torna ((transparente)), removendo os pixels desenhados anteriormente.

{{index "setInterval function", "img (HTML tag)"}}

Sabemos que cada _((sprite))_, cada subfigura, tem 24 ((pixel))s de largura e 30 pixels de altura. O código a seguir carrega a imagem e então define um intervalo (temporizador repetitivo) para desenhar o próximo ((quadro)):

```{lang: "text/html"}
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
                   // retângulo original
                   cycle * spriteW, 0, spriteW, spriteH,
                   // retângulo de destino
                   0,               0, spriteW, spriteH);
      cycle = (cycle + 1) % 8;
    }, 120);
  });
</script>
```

O `cycle` conecta nossa posição na animação. A cada ((quadro)), ele é incrementado e então resetado entre 0 e 7 através  do operador restante. Essa conexão é então usada para computar a coordenada x que o sprite da posição atual tem na figura.

## Transformação

{{index transformation, mirroring}}

{{indexsee flipping, mirroring}}

Mas e se quisermos que nosso personagem ande a partir da esquerda ao invés da direita? Podemos desenhar outro conjunto de sprites, é claro. Mas podemos também instruir o ((canvas)) a desenhar a figura na ordem inversa.

{{index "scale method", scaling}}

Chamar o método `scale` vai mudar a escala de tudo o que for desenhado. Esse método leva dois parâmetros, um para definir uma escala horizontal e outra para definir uma escala vertical.

```{lang: "text/html"}
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

Porque chamamos o `scale`, o círculo é desenhado três vezes na largura e metade na altura.

{{figure {url: "img/canvas_scale.png", alt: "Um círculo com escala",width: "6.6cm"}}}

if}}

{{index mirroring}}

Escalar mudará tudo em relação à imagem, incluindo a ((espessura da linha)), a ser esticado ou espremido como especificado. Escalar em um número negativo vai inverter a imagem. A inversão acontece em torno do ponto (0,0), o que significa que também vai inverter a direção do sistema de coordenadas. Quando uma escala horizontal de -1 é aplicada, uma forma desenhada em x na posição 100 vai acabar no que costumava ser a posição -100.

{{index "drawImage method"}}

Então, para inverter a figura, não podemos simplesmente usar `cx.scale(-1, 1)` antes de chamar o `drawImage`, já que poderíamos acabar tirando a figura do ((canvas)), onde não é mais visível. Você poderia ajustar as ((coordenadas)) dadas ao `drawImage` para compensar isso desenhando a imagem em x na posição -50 ao invés disso. Outra solução, que não requer que o código que desenha precise saber sobre a mudança de escala, é ajustar o ((eixo)) no qual a escala é alterada.

{{index "rotate method", "translate method", transformation}}

Existem várias outras formas além do `scale` que influenciam o sistema de coordenadas de um ((canvas)). Você pode rotacionar formas desenhadas com o métodos `rotate` e movê-las com o método `translate`. O interessante – e confuso – é que essas transformações são _empilhadas_, o que significa que cada um acontece em relação às transformações anteriores.

{{index "rotate method", "translate method"}}

Então, se transladarmos por 10 pixels na horizontal duas vezes, todos serão desenhados 20 pixels à direita. Se movermos primeiro o centro do sistema de coordenadas para (50,50) e então rotacionarmos em 20 ((grau))s (0.1π em ((radiano))s), essa rotação vai acontecer _ao redor_ do ponto (50,50).

{{figure {url: "img/transform.svg", alt: "Transformações empilhadas",width: "9cm"}}}

{{index coordinates}}

Mas se rotacionarmos _primeiro_ em 20 graus e _depois_ transladarmos em (50,50), a translação acontecerá no sistema de coordenadas rotacionado, e então vai produzir uma orientação diferente. A ordem na qual as transformações são aplicadas importa.

{{index axis, mirroring}}

Para inveter uma imagem ao retor da linha vertical de uma determinada posição x, podemos fazer o seguinte:

```{includeCode: true}
function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}
```

{{index "flipHorizontally method"}}

Movemos o ((eixo)) y para onde queremos que nosso ((espelho)) esteja, aplicando a espelhagem, e finalmente movemos o eixo x de volta ao lugar apropriado no universe espelhado. A figura a seguir explica por que isso funciona:

{{figure {url: "img/mirror.svg", alt: "Espelhando em torno de uma linha vertical",width: "8cm"}}}

{{index "translate method", "scale method", transformation, canvas}}

A imagem acima mostra o sistema de coordenadas antes e depois da espelhagem na linha central. Os triângulos são numerados para ilustrar cada etapa. Se desenhássemos um triângulo em uma posição x positiva, iria, por padrão, estar no lugar onde o triângulo 1 está. Chamar o `flipHorizontally` primeiro faz a translação para a direita, que nos leva para o triângulo 2. Ela então escala, invertendo o triângulo para a posição 3. Não era para ele estar ali, se tivéssemos espelhado em determinada linha. O segundo `translate` conserta isso – ele “cancela” a translação inicial e faz  o triângulo 4 aparecer exatamente onde deveria.
Agora podemos desenhar um personagem espelhado na posição (100,0) invertendo o mundo ao redor do centro vertical do personagem.

```{lang: "text/html"}
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

Transformações não vão embora. Tudo o que desenhamos após ((desenhar)) aquele personagem espelhado também pode acabar ficando espelhado. Isso pode ser inconveniente.

É possível salvar a transformação atual, desenhar e transformar um pouco, e então restaurar a transformação antiga. Isso geralmente é algo apropriado de se fazer para uma função que precisa ter o sistema de coordenadas temporariamente transformados. Primeiro, salvamos o código da função de determinada transformação. Depois, a função faz o que tem que fazer (por cima da transformação existente), possivelmente adicionando mais transformações. E finalmente, revertemos para a transformação com que começamos.

{{index "save method", "restore method", [state, "of canvas"]}}

Os métodos `save` e `restore` no contexto de ((canvas)) 2D fazem esse gerenciamento da ((transformação)). Eles conceitualmente mantém uma pilha de estados de transformação. Quando você chama o `save`, o estado atual é colocado na pilha, e quando você chama `restore`, o estado no topo da pilha é tirado e usado como contexto da transformação atual. Você também pode usar o `resetTransform` para resetar a transformação completamente.

{{index "branching recursion", "fractal example", recursion}}

A função `branch` no exemplo a seguir ilustra o que você pode fazer com uma função que muda a transformação e então chama outra função (nesse caso, ela mesma), que continua desenhando com essa determinada transformação.

Essa função desenha uma forma semelhante a uma àrvore desenhando uma linha, movendo o centro do sistema de coordenadas para o fim da linha, e chamando a si mesma duas vezes – primeiro rotacionando para a esquerda e então rotacionando para a direita. Toda chamada reduz o comprimento do galho desenhado, e a recurão pára quando o comprimento for menor que 8.

```{lang: "text/html"}
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

O resultado é uma fractal simples.

{{figure {url: "img/canvas_tree.png", alt: "Uma figura recursiva",width: "5cm"}}}

if}}

{{index "save method", "restore method", canvas, "rotate method"}}

Se as chamadas de `save` e `restore` não estivessem ali, a segunda chamada recursiva para `branch` acabaria com a posição e rotação criada pela primeira chamada. Ela não estaria conectada com o galho atual, mas ao galho mais interno e mais à direita desenhado pela primeira chamada. A forma resultante poderia ser interessante, mas definitivamente não seria uma árvore.

{{id canvasdisplay}}

## De volta ao jogo

{{index "drawImage method"}}

Agora sabemos o suficiente sobre desenho em ((canvas)) para começar a trabalhar em um ((canvas))-based display system para o jogo do [capítulo anterior](game). O novo display mostrará apenas mais caixas coloridas. Ao invés disso, vamos usar o `drawImage` para desenhar figuras que representam os elementos dos jogos.

{{index "CanvasDisplay class", "DOMDisplay class", [interface, object]}}

Definimos outro tipo de objeto de display chamado `CanvasDisplay`, que suporta a mesma interface que o `DOMDisplay` do [Capítulo 16](game#domdisplay), ou seja, os métodos `setState` e `clear`.

{{index [state, "in objects"]}}

Esse objeto retém um pouco mais de informação que o `DOMDisplay`. Ao invés de usar a posição de rolagem de seu elemento DOM, ele rastreia sua própria viewport, o que nos diz que parte do nível estamos procurando. E finalmente, ele mantém uma propriedade `flipPlayer` para que mesmo quando o jogador estiver parado, continue olhando para a direção que se moveu por último.

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

O método `setState` primeiro computa um novo viewport e depois desenha a cena do jogo na posição apropriada.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.setState = function(state) {
  this.updateViewport(state);
  this.clearDisplay(state.status);
  this.drawBackground(state.level);
  this.drawActors(state.actors);
};
```

{{index scrolling, clearing}}

Ao contrário do `DOMDisplay`, esse estilo de display _precisa_ redesenhar o plano de fundo a cada atualização. Pelas formas de um canvas serem apenas ((pixels)), após desenhá-los, não existem boas formas de movê-las (ou removê-las). A única forma de atualizar o display do canvas é limpá-lo e redesenhar a cena. Também podemos ter rolado para baixo ou para cima, o que requer que o plano de fundo esteja em uma posição diferente.

{{index "CanvasDisplay class"}}

O método `updateViewport` é parecido com o método `scrollPlayerIntoView` do `DOMDisplay`. Ele verifica se um jogador está próximo demais da borda da tela e move o ((viewport)) quando esse for o caso.

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

As chamadas para `Math.max` e `Math.min` certificam que o viewport não acabe mostrando espaço de fora do nível. O `Math.max(x, 0)` certifica de que o número resultante não seja menor que zero. `Math.min`, de forma semelhante, garante que o valor fique abaixo de determinado limite.

Quando ((limpamos)) o display, vamos usar uma ((cor)) levemente diferente dependendo se o jogo tiver sido vencido (mais claro) ou perdido (mais escuro).

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

Para desenharmos o plano de fundo, percorremos os tiles (ladrilhos) que são visíveis no viewport atual, usando o mesmo truque usado no método `touches` do [capítulo anterior](game#touches).

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

Tiles que não estão vazios são desenhados com o `drawImage`. A imagem `otherSprites` contém as figuras usadas para elementos que não sejam o jogador. Ela contém, da esquerda para a direita, a tile da parede, da lava, e o sprite para uma moeda.

{{figure {url: "img/sprites_big.png", alt: "Sprites for our game",width: "1.4cm"}}}

{{index scaling}}

Os tiles do plano de fundo são 20 pixels por 20 pixels, já que vamos usar a mesma escala que usamos no `DOMDisplay`. Além disso, o deslocamento para os tiles da lava é 20 (o valor do `scale`), e o deslocamento para as paredes é 0.

{{index drawing, "load event", "drawImage method"}}

Não nos importamos em esperar a imagem da sprite carregar. Chamar o `drawImage` com uma imagem que não foi carregada ainda simplesmente  não fará nada. Além disso, podemos acabar falhando em desenhar o jogo apropriadamente nos primeiros ((quadro))s, enquanto a imagem ainda estiver carregando, mas esse não é um problema sério. Já que continuamos atualizando a tela, a cena correta aparecerá assim que o carregamento terminar.

{{index "player", [animation, "platform game"], drawing}}

O personagem ((caminhando)) mostrado mais cedo será usado para representar o jogador.  O código que o desenha precisa escolher a ((sprite)) correta e direcioná-la baseando-se no movimento atual do jogador. As primeiras oito sprites contêm uma animação caminhando. Quando o jogador estiver se movendo junto ao chão, vamos passar por elas baseando-se no tempo atual. Queremos trocar os quadros a cada 60 milissegundos, então o ((tempo)) precisa ser dividido por 60 primeiro. Quando o jogador estiver parado, desenhamos o novo sprite. Durante os pulos, que são reconhecidos pelo fato de que a velocidade vertical não é zero, usamos o décimo, que é a sprite mais à direita.

{{index "flipHorizontally function", "CanvasDisplay class"}}

Pelas ((sprite))s serem levemente maiores que o objeto do jogador – 24 ao invés de 16 pixels, para permitir espaço para os pés e braços – o método tem que ajustar a coordenada em x e largura em uma certa quantidade (`playerXOverlap`).

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

O método `drawPlayer` é chamado pelo `drawActors`, que é responsável por desenhar todos os atores no jogo.

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

Quando ((desenhamos)) algo que não seja o ((jogador)), verificamos seu tipo para encontrar o deslocamento da sprite correta. O tile de ((lava)) tem o deslocamento de 20, o sprite da ((moeda)) tem deslocamento de 40 (duas vezes a `scale`).

{{index viewport}}

Temos que subtrair a posição do viewport quando computamos a posição do ator desde (0,0) no nosso ((canvas)) correspondente do canto superior esquerdo do viewport, não do canto superior esquerdo do nível. Poderíamos também ter usado `translate` para isso. Ambas as formas funcionam.

{{if interactive

Esse documento conecta o novo display em `runGame`:

```{lang: "text/html", sandbox: game, focus: yes, startCode: true}
<body>
  <script>
    runGame(GAME_LEVELS, CanvasDisplay);
  </script>
</body>
```

if}}

{{if book

{{index [game, screenshot], [game, "with canvas"]}}

Isso conclui o novo sistema de ((display)). O jogo resultante fica mais ou menos assim:

{{figure {url: "img/canvas_game.png", alt: "O jogo mostrado no canvas",width: "8cm"}}}

if}}

{{id graphics_tradeoffs}}

## Escolhendo uma interface gráfica

Então, quando precisar gerar gráficos no navegador, você pode escolher entre plain HTML, ((SVG)) e ((canvas)). Não há uma _melhor_ abordagem que funciona em todas as situações. Cada opção tem seus pontos fortes e fracos.

{{index "text wrapping"}}

Plain HTML tem a vantagem de ser simples. Ele também integra bem com ((texto)). Tanto o SVG quanto o canvas permite que você desenhe texto, mas não vão te ajudar a posicionar esse texto ou agrupá-lo quando ele tiver mais de uma linha. Em uma figura baseada em HTML, é muito mais fácil incluir blocos de texto.

{{index zooming, SVG}}

Os SVG podem ser usados para produzir ((gráficos)) ((nítidos)) que ficam bons em qualquer nível de zoom. Ao contrário do HTML, ele é feito para desenho e, portanto, é mais adequado para esse propósito.

{{index [DOM, graphics], SVG, "event handling", ["data structure", tree]}}

Tanto o SVG quanto o HTML criam uma estrutura de dados (o DOM) que representa sua figura. Isso faz com que seja possível modificar os elementos após serem desenhados. Se precisar mudar uma forma pequena de uma ((figura)) grande várias vezes em resposta ao que o usário estiver fazendo ou como parte de uma ((animação)), fazer isso em um canvas pode ser desnecessariamente pesado. O DOM também nos permite registrar event handlers do mouse em todo elemento da figura (mesmo em formas desenhadas com o SVG). Você não pode fazer isso com o canvas.

{{index performance, optimization}}

Mas a abordagem orientada a ((pixel)) do ((canvas)) pode ser uma vantagem quando desenhamos uma quantidade enorme de elementos pequenos. O fato de que uma estrutura de dados não é criada, mas é apenas desenhada repetidamente na mesma superfície de pixel, dá ao canvas um custo baixo por forma.

{{index "ray tracer"}}

Também existem eventos, como renderizar uma cena um pixel por vez (usando um ray tracer, que é um algoritmo de computação gráfica usado para renderização de imagens tridimencionais, por exemplo) ou pós-processar uma imagem com JavaScript (desfocando ou distorcendo a imagem), que só podem ser lidadas realisticamente por uma abordagem baseada em ((pixel))s.

Em alguns casos, você pode querer combinar várias dessas técnicas. Por exemplo, você pode querer desenhar um ((grafo)) com ((SVG)) ou ((canvas)), mas mostrar informações em ((texto)) posicionando um elemento HTML em cima da figura.

{{index display}}

Para aplicações que não exijam tanto, não importa qual interface você escolhe. O display que criamos para nosso jogo nesse capítulo poderia ter sido implementado usando qualquer uma dessas três tecnologias ((gráficas)), já que não precisamos desenhar texto, lidar com interação do mouse ou trabalhar com uma quantidade extraordinariamente grande de elementos.

## Sumário

Nesse capítulo discutimos técnicas para desenhar gráficos no navegador, focando no elemento `<canvas>`.

Um nó do canvas representa uma área em um documento que nosso programa possa desenhar. Esse desenho é feito através de um objeto de contexto de desenho, criado com um método `getContext`.

A interface de desenho 2D nos permite preencher e delinear várias formas. A propriedade `fillStyle` do contexto determina como as formas são preenchidas. As propriedades `strokeStyle` e `lineWidth` controlam as formas que as linhas são desenhadas.

Retângulos e pedaços de texto podem ser desenhados com apenas uma chamada de método. Os métodos `fillRect` e `strokeRect` desenham retângulos, e os métodos `fillText` e `strokeText` desenham texto. Para criar formas customizadas, precisamos desenhar um caminho primeiro.

{{index stroking, filling}}

Chamar o `beginPath` inicia um novo caminho. Vários outros métodos adicionam linhas e curvas ao caminho atual. Por exemplo, lineTo pode adicionar uma linha reta. Quando um caminho é finalizado, ele pode ser preenchido com o método `fill` ou delineado com o método `stroke`.

Mover pixels para uma imagem ou de um canvas para outro canvas pode ser feito com o método `drawImage`. Por padrão, esse método desenha uma imagem fonte por completo, mas dar mais parâmetros ao método te permite copiar uma área específica da imagem. Usamos isso para nosso jogo copiando poses individuais de um personagem de jogo de uma imagem que continha tais poses.

Transformações de permitem desenhar uma forma em várias orientações. Um desenho de contexto 2D tem uma transformação atual que pode ser mudada com os métodos `translate`, `scale` e `rotate`. Eles vão afetar todas as operações de desenho subsequentes. Um estado de transformação pode ser salvo com o método `save` e restaurado com o método `restore`.

Quando mostrar uma animação em um canvas, o método `clearRect` pode ser usado para limpar o canvas antes de redesenhá-lo.

## Exercícios

### Forças

{{index "shapes (exercise)"}}

Escreva um programa que desenhe as ((forma))s a seguir em um ((canvas)):

{{index rotation}}

1. Um ((trapézio)) (um ((retângulo)) que é maior de um lado)

2. Um ((diamante)) vermelho (um retângulo rotacionado em 45 graus ou ¼π radianos)

3. Uma ((linha)) em zigue-zague

4. Uma ((espiral)) feita de 10 segmentos de linha retos

5. Uma ((estrela)) amarela

{{figure {url: "img/exercise_shapes.png", alt: "Formas a serem desenhados",width: "8cm"}}}

Quando desenhar os dois últimos, pode querer dar uma olhada na explicação de `Math.cos` e `Math.sin` no [Capítulo 14](dom#sin_cos), que descreve como obter coordenadas de um círculo usando essas funções.

{{index readability, "hard-coding"}}

Recomendo criar uma função para cada forma. Passe a posição, e de forma opcional outras propriedades como o tamanho ou número de pontos, como parâmetros. A alternativa, que é apenas definir os números por todo o seu código, tende a torná-lo difícil de ler e modificar sem necessidade.

{{if interactive

```{lang: "text/html", test: no}
<canvas width="600" height="200"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");

  // Seu código aqui.
</script>
```

if}}

{{hint

{{index [path, canvas], "shapes (exercise)"}}

O ((trapézio)) (1) é o mais fácil de desenhar usando um caminho. Escolha coordenadas de centro adequadas e adicione cada um dos quatro cantos ao redor do centro.

{{index "flipHorizontally function", rotation}}

O ((diamante)) (2) pode ser desenhado de forma bem direta, com um caminho, ou de forma interessante, com uma ((transformação)) `rotate`. Para usar a rotação, você terá que aplicar um truque parecido com o que fizemos na função `flipHorizontally`. Porque, se quiser rotacionar ao redor do centro do seu retângulo, e não ao redor do ponto (0,0), você deve primeiro `translate` para lá, e então rotacionar, e depois transladar de volta.

Lembre-se de resetar a transformação após desenhar qualquer forma que cria uma.

{{index "remainder operator", "% operator"}}

Para o ((zigue-zague)) (3) não é prático chamar a função `lineTo` para cada segmento de linha. Ao invés disso, você deve usar um ((loop)). Você pode ter cada iteração desenhada a cada dois segmentos de ((linha)) (da direita e depois da esquerda) ou uma, e nesse caso precisa usar a uniformidade (`% 2`) do índice do loop para determinar se é necessário ir para a esquerda ou para a direita.

Você também precisará de um loop para a ((espiral)) (4). Se desenhar uma série de pontos, com cada ponto se movendo junto de um círculo ao redor do centro da espiral, você criará um círculo. Se, durante o loop, você variar o raio do círculo pelo qual você está definindo o ponto atual e circular mais do que uma vez, o resultado é uma espiral.

{{index "quadraticCurveTo method"}}

A ((estrela)) (5) retratada é criada com as linhas do método `quadraticCurveTo`. Você também pode desenhar uma com linhas retas. Divida um círculo em oito peças para uma estrela de oito pontos, ou a quantidade de peças que queira. Desenhe linhas entre esses pontos, fazendo-as curvar na direção do centro da estrela. Com o método `quadraticCurveTo`, você pode usar o centro como ponto de controle.

hint}}

{{id exercise_pie_chart}}

### O gráfico de pizza

{{index label, text, "pie chart example"}}

[Antes](canvas#pie_chart), nesse capítulo, vimos um programa de exemplo que desenhava um gráfico de pizza. Modifique esse programa para que o nome de cada categoria seja mostrado próximo à fatia que o representa. Tente encontrar uma forma bonita de automaticamente posicionar esse texto que poderia funcionar também pra outros conjuntos de dados. Você pode presumir que as categorias são grandes o suficiente para deixar bastante espaço para seus rótulos.

Você pode precisar do `Math.sin` e `Math.cos` novamente, que estão descritos no [Capítulo 14](dom#sin_cos).

{{if interactive

```{lang: "text/html", test: no}
<canvas width="600" height="300"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let total = results
    .reduce((sum, {count}) => sum + count, 0);
  let currentAngle = -0.5 * Math.PI;
  let centerX = 300, centerY = 150;

  // Coloque o código para desenhar os rótulos das fatias nesse loop.
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

Você vai precisar chamar o `fillText` e definer as propriedades `textAlign` e `textBaseline` do contexto de forma que faça o texto acabar onde você quer.

Uma forma sensível de posicionar os rótulos seria colocar o texto na linha que vem do centro da pizza até o meio da fatia. Você não quer colocar o texto diretamente do lado da pizza, mas sim mover o texto para o lado dela com alguns pixels de distância.

O ((ângulo)) dessa linha é `currentAngle + 0.5 * sliceAngle`. O código a seguir encontra uma posição nessa linha de 120 pixels a partir do centro:

```{test: no}
let middleAngle = currentAngle + 0.5 * sliceAngle;
let textX = Math.cos(middleAngle) * 120 + centerX;
let textY = Math.sin(middleAngle) * 120 + centerY;
```

Para o `textBaseline`, o valor `"middle"` provavelmente é apropriado quando usamos essa abordagem. O que usar no `textAlign` depende de qual lado do círculo estamos. Se estivermos na esquerda, ela deve ser `"right"`, e se for na direita, deve ser `"left"`, para que o texto seja posicionado do lado correto da pizza.

{{index "Math.cos function"}}

Se não tiver certeza sobre como descobrir em qual lado do círculo determinado ângulo está, veja a explicação de `Math.cos` no [Capítulo 14](dom#sin_cos). O cosseno de um ângulo nos diz qual a qual coordenada x ele corresponde, o que nos diz exatamente de qual lado do círculo estamos.

hint}}

### Uma bola quicando

{{index [animation, "bouncing ball"], "requestAnimationFrame function", bouncing}}

Use a técnica `requestAnimationFrame` que vimos no [Capítulo 14](dom#animationFrame) e no [Capítulo 16](game#runAnimation) para desenhar uma ((caixa)) com uma ((bola)) quicando nela. A bola se move a uma ((velocidade)) constante e se afasta de cada lado da caixa quando toca nelas.

{{if interactive

```{lang: "text/html", test: no}
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

É fácil desenhar uma ((caixa)) com o `strokeRect`. Defina um valor que seja seu tamanho ou defina dois valores se a largura e altura da caixa forem diferentes. Para criar uma ((bola)) redonda, faça um caminho e use `arc(x, y, radius, 0, 7)`, que cria um arco indo de zero a mais do que um círculo completo. E então preencha o caminho.

{{index "collision detection", "Vec class"}}

Para modelar a posição e a ((velocidade)) da bola, você pode usar a classe `Vec` do [Capítulo 16](game#vector) [(que está disponível nessa página)]{if interactive}. Dê uma velocidade inicial, preferivelmente uma que não seja puramente vertical ou horizontal, e para cada ((quadro)) multiplique essa velocidade pela quantidade de tempo percorrido. Quando a bola chegar perdo demais de uma parede vertical, inverta o componente x em sua velocidade. Da mesma forma, inverta o componente y quando chegar a uma parede horizontal.

{{index "clearRect method", clearing}}

Após descobrir a nova posição e velocidade da bola, use `clearRect` para deletar a cena e redesenhá-la usando a nova posição.

hint}}

### Espelhamento pré-computacionada

{{index optimization, "bitmap graphics", mirror}}

Algo infeliz sobre ((transformações)) é que elas desaceleram o desenho de bitmaps. A posição e tamanho de cada ((pixel)) tem que ser transformado, e apesar de ser possível que os ((navegador))es fiquem mais inteligentes sobre essa transformação no futuro, eles atualmente causam um aumento mensurável no tempo que leva para desenhar um bitmap.

Em um jogo como o nosso, onde estamos desenhando apesar uma sprite transformada, isso não é problema. Mas imagine que precisamos desenhar centenas de personagens ou milhares de partículas rotacionando a partir de uma explosão.

Pense em uma forma que permita que desenhamos um personagem invertido sem carregar arquivos de imagem adicionais e sem ter que usar o método `drawImage` transformado em cada imagem.

{{hint

{{index mirror, scaling, "drawImage method"}}

A chave para a solução é o fato de que podemos usar um element de ((canvas)) como imagem fonte quando usamos o `drawImage`. É possível criar um elemento `<canvas>` a mais, sem adicioná-lo ao documento, e desenhar nossas sprites invertidas uma vez. Quando desenharmos um quadro de verdade, só copiamos os sprites já invertidos para o canvas principal.

{{index "load event"}}

Teríamos que tomar cuidado porque imagens não carregam instantaneamente. Temos que inverter a imagem apenas uma vez, e se fizermos isso antes da imagem carregar, ela não vai desenhar nada.
Um handler `"load"` na imagem pode ser usado para desenhar as imagens invertidas no canvas extra. Esse canvas pode ser usado como uma forma de desenhá-lo imediatamente (ele será simplesmente branco até desenharmos o personagem nele).

hint}}
