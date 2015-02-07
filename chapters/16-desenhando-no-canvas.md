## Desenhando no canvas

> O desenhar é uma decepção.

> M.C. Escher, citado por Bruno Ernst em The Magic Mirror of M.C. Escher.

Os Browsers permitem de várias maneiras mostrarem gráficos. A maneira mais simples é usar um estilos para a posição e cor de elementos regulares  do DOM. Isso pode ser impraticável, como ficou claro no jogo do capítulo anterior. Podemos adicionar parcialmente uma transparencia no fundo das imagens e ainda girar ou inclinar algum nó usando o estilo de `transform`.

Mas estaríamos usando o DOM para algo que não foi originalmente projetado. Algumas tarefas, tais como desenhar uma linha entre pontos arbitrários são extremamente difíceis de fazer com elementos regulares em HTML.

Existem duas alternativas. O primeiro é baseado em DOM mas utiliza Scalable Vector Graphics(`SVG`) ao invés de elementos HTML. Pense em SVG como um dialeto para descrever documentos que se concentra em formas ao invéz de texto. Você pode embutir um documento SVG em um documento HTML ou você pode incluí-lo através de uma tag <img>.

A segunda alternativa é chamado de `canvas`. A tela é um único elemento DOM que encapsula uma imagem. Ele fornece uma interface de programação para desenhar formas para o espaço ocupado pelo nó. A principal diferença entre um `canvas` e uma imagem de `SVG`, é que em `SVG` a descrição original das formas é preservada de modo que eles podem ser movidos ou redimensionados em qualquer momento. O  `canvas` por outro lado, converte as formas para pixels(pontos coloridos em um raster), logo que eles são desenhados e não guarda informações do que estes pixels representam. A única maneira de mover uma forma em `canvas` é limpar a tela(ou a parte da tela em torno) e redesenhar uma forma em uma nova posição.

#### SVG

Este livro não vai entrar no assunto `SVG` em detalhes, mas vou explicar brevemente como ele funciona. No final do capítulo eu vou voltar para os `trade-offs` que você deve considerar ao decidir qual mecanismo de desenho é adequado para uma determinada aplicação.

Este é um documento HTML com uma imagem SVG simples:

````html
<p>Normal HTML here.</p>
<svg xmlns="http://www.w3.org/2000/svg">
  <circle r="50" cx="50" cy="50" fill="red"/>
  <rect x="120" y="5" width="90" height="90"
        stroke="blue" fill="none"/>
</svg>
````

O atributo `xmlns` muda um elemento(e seus filhos) a um namespace diferente de XML. Este namespace é identificado por um URL, especificando o dialeto que estamos falando no momento. As *tags* `<circle>` e `<rect>` que não existem em HTML não têm um significado em SVG se desenhar formas usando o estilo e posição especificada para seus atributos.

Essas *tags* criam elementos no DOM assim como as *tags* em HTML. Por exemplo, isso muda a cor para ciano do elemento `<circle>`:

````js
var circle = document.querySelector("circle");
circle.setAttribute("fill", "cyan");
````

#### O elemento canvas

Gráfico em *canvas* pode ser desenhado em um elemento `<canvas>`. Você pode dar a um elemento a largura e altura em pixel para determinar o seu tamanho em pixels.

A nova tela esta vazia, o que significa que é totalmente transparente e portanto simplesmente mostra-se como um espaço vazio no documento.

A *tag* `<canvas>` destina-se a apoiar os diferentes estilos de desenho. Para ter acesso a uma verdadeira interface de desenho, primeiro precisamos criar um contexto que é um objeto cujos métodos fornecem a interface de desenho. Existem atualmente dois estilos de desenho amplamente suportados: *"2d"* para gráficos bidimensionais e *"WebGL"* para gráficos tridimensionais através da interface `OpenGL`.

Este livro não vai discutir *WebGL*. Nós esturemos as duas dimensões. Mas se você estiver interessado em gráficos tridimensionais eu encorajo-vos a olhar para *WebGL*. Ele fornece uma interface muito direta com o hardware com gráfico moderno e permite que você processe cenas eficientemente complicadas utilizando JavaScript.

Um contexto é criado através do método `getContext` sobre o elemento `<canvas>`.

````html
<p>Before canvas.</p>
<canvas width="120" height="60"></canvas>
<p>After canvas.</p>
<script>
  var canvas = document.querySelector("canvas");
  var context = canvas.getContext("2d");
  context.fillStyle = "red";
  context.fillRect(10, 10, 100, 50);
</script>
````

Depois de criar o objeto de contexto o exemplo desenha um retângulo vermelho de 100 pixels de largura e 50 pixels de altura com o seu canto superior esquerdo nas coordenadas (10,10).

Assim como em HTML e SVG o sistema que a tela usa puts(0,0) no canto superior esquerdo de coordenadas, e o eixo y positivo vai para baixo. Então (10,10) é de 10 pixels abaixo e à direita do canto superior esquerdo.

#### Preenchimento e traçado

Preenchimento e traçado

Na interface uma forma pode ser cheia ou seja, a sua área é dada uma determinada cor padrão ou pode ser riscada o que significa que uma linha é desenhada ao longo de sua borda. A mesma terminologia é utilizada por SVG.

O método `fillRect` preenche um retângulo. É preciso ter as coordenadas `x` e `y` do canto superior esquerdo do retângulo, em seguida a sua largura e a sua altura. Um método semelhante `strokeRect` desenha o contorno de um retângulo.

Nenhum dos métodos tem parâmetros. A cor do preenchimento da espessura do traçadonão são determinados por argumento do método(como você espera), mas sim pelas propriedades do contexto do objecto.

As definições de `fillStyle` podem alterar o jeito que as formas são preenchidas. Ele pode ser definido como uma `string` que especifica uma cor, qualquer cor compreendido por CSS podem serem usados aqui.

A propriedade `strokeStyle` funciona de forma semelhante, mas determina a cor usada para uma linha. A largura da linha é determinada pela propriedade `lineWidth` que pode conter qualquer número positivo.

```html
<canvas></canvas>
<script>
  var cx = document.querySelector("canvas").getContext("2d");
  cx.strokeStyle = "blue";
  cx.strokeRect(5, 5, 50, 50);
  cx.lineWidth = 5;
  cx.strokeRect(135, 5, 50, 50);
</script>
```

Quando nenhuma largura ou altura é especificado como atributo, como no exemplo anterior um elemento de tela adquire uma largura padrão de 300 pixels e altura de 150 pixels.

#### Paths

Um `path` é uma seqüência de linhas. A interface de uma tela 2D tem uma abordagem peculiar de descrever esse `path`. Isso é feito inteiramente através de efeitos colaterais. Os `paths` não constituem valores que podem ser armazenados ou repassados. Se você deseja fazer algo com um `path`, você faz uma seqüência de chamadas de método para descrever sua forma.

```html
<canvas></canvas>
<script>
  var cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  for (var y = 10; y < 100; y += 10) {
    cx.moveTo(10, y);
    cx.lineTo(90, y);
  }
  cx.stroke();
</script>
```

Este exemplo cria um `path` com um número de segmentos de linha horizontal e em seguida faz traços usando o método `stroke`. Cada segmento criado com `lineTo` começa na posição atual do `path`. Esta posição é normalmente o fim do último segmento a não ser que `moveTo` for chamado. Nesse caso, o próximo segmento começara na posição passada para `moveTo`.

Ao preencher um `path`(usando o método de `fill`) cada forma é preenchido separadamente. Um `path` pode conter várias formas, cada movimento com `moveTo` inicia um novo. Mas o `path` tem de ser fechado(ou seja o seu início e fim estão na mesma posição) antes de ser preenchido. 
Se o `path` não estiver fechado a linha é adicionada a partir de sua extremidade para o começo ou forma delimitada pelo `path` completado é preenchido.

```html
<canvas></canvas>
<script>
  var cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(50, 10);
  cx.lineTo(10, 70);
  cx.lineTo(90, 70);
  cx.fill();
</script>
```

Este exemplo estabelece um triângulo a cheio. Note-se que apenas dois dos lados do triângulo são explicitamente desenhado. A terceira é a partir do canto inferior direito ate o topo; é implícito e não estará lá quando você traçar o `path`.

Você também pode usar o método `closePath` para fechar explicitamente um `path` através da adição de um segmento da linha atual de volta ao início do `path`. Este segmento é desenhado traçando o `path`.

#### Curvas

Um `path` também pode conter linhas com curvas. Estes infelizmente é um pouco mais complexo do que desenhar linhas retas.
O método `quadraticCurveTo` desenha uma curva ate um ponto considerado. Para determinar a curvatura da linha é dado no método um ponto de controle e um ponto de destino. Imagine o seguinte, ponto de controle é uma atração a linha, o que da a ela sua curvatura. A linha não vai passar pelo ponto de controle. Ao contrário disso a direcção da linha nos seus pontos de início e fim fica alinhado com a linha de lá para o ponto de controle. O exemplo a seguir ilustra isso:

```html
<canvas></canvas>
<script>
  var cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(10, 90);
  // control=(60,10) goal=(90,90)
  cx.quadraticCurveTo(60, 10, 90, 90);
  cx.lineTo(60, 10);
  cx.closePath();
  cx.stroke();
</script>
```

Nós desenharemos uma curva quadrática a partir da esquerda para a direita com (60,10) no ponto de controle e depois tirar dois segmentos da linha passando por esse ponto de controle e de volta para o início da linha. O resultado lembra um pouco uma insígnia do Star Trek. Você pode ver o efeito do ponto de controle: as linhas que saem dos cantos inferiores começam na direção do ponto de controle e em seguida curva em direção a seu alvo.

O método `bezierCurve` desenha um tipo semelhante de curva. Em vez de um único ponto de controle este tem dois, um para cada um dos pontos das extremidades da linha. Aqui é um esboço semelhante para ilustrar o comportamento de uma tal curva:

```html
<canvas></canvas>
<script>
  var cx = document.querySelector("canvas").getContext("2d");
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

Os dois pontos de controle especificam a direção em ambas as extremidades da curva. Quanto mais eles estão longe de seu ponto correspondente maior a curva que vai nesse sentido.

Tais curvas pode ser difícil de trabalhar, nem sempre é evidente encontrar a forma dos pontos de controle que proporcionam a forma que você está procurando. Às vezes você pode calcular e às vezes você apenas tem que encontrar um valor apropriado por tentativa e erro.

Fragmentos `arcs` de um círculo são mais fáceis de se trabalhar. O método `arcTo` não leva menos de cinco argumentos. Os quatro primeiros argumentos agem um pouco como os argumentos para `quadraticCurveTo`. O primeiro par fornece uma espécie de ponto de controle e o segundo par dá destino a linha. O quinto argumento fornece o raio do arco. O método vai conceitualmente projetar um canto da linha que vai para o ponto de controle e em seguida de volta ao ponto de destino para que ele faça parte de um círculo com o raio dado. O método `arcTo` chega então a uma parte arredondada bem como uma linha a partir da posição de partida ate o início de uma parte arredondada.

```html
<canvas></canvas>
<script>
  var cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(10, 10);
  // control=(90,10) goal=(90,90) radius=20
  cx.arcTo(90, 10, 90, 90, 20);
  cx.moveTo(10, 10);
  // control=(90,10) goal=(90,90) radius=80
  cx.arcTo(90, 10, 90, 90, 80);
  cx.stroke();
</script>
```

O método `arcTo` não vai desenhar a linha a partir da parte final do arredondamento para a posição do objetivo embora a palavra no seu nome poderia sugerir o que ele faz. Você pode acompanhar com uma chamada de `lineTo` com o mesmo objetivo de coordena e acrescentar uma parte da linha.

Para desenhar um círculo você poderia usar quatro chamadas para `arcTo`(cada um que giram 90 graus). Mas o método de arco fornece uma maneira mais simples. É preciso um par de coordenadas para o centro do arco, um raio, e em seguida um ângulo de início e fim.

Esses dois últimos parâmetros tornam possível desenhar apenas uma parte do círculo. Os ângulos são medidos em radianos não em graus. Isso significa que um círculo completo tem um ângulo de `2π` ou `2 * Math.PI` que é de cerca de `6,28`. O ângulo começa a contar no ponto a partir da direita do centro do círculo e vai no sentido horário a partir daí. Você pode usar um começo de `0` e um fim maior do que `2π`(digamos 7) para desenhar um círculo completo.

```html
<canvas></canvas>
<script>
  var cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  // center=(50,50) radius=40 angle=0 to 7
  cx.arc(50, 50, 40, 0, 7);
  // center=(150,50) radius=40 angle=0 to ½π
  cx.arc(150, 50, 40, 0, 0.5 * Math.PI);
  cx.stroke();
</script>
```

A imagem resultante contém uma linha na esquerda do círculo completo(primeira chamada de `ARC`) a esquerda do quarto de círculo(segunda chamada). Como outros métodos de desenho de `path` uma linha traçada com arco é ligado ao segmento do `path` anterior por padrão. Se você quiser evitar isso teria que chamar `moveTo` ou iniciar um novo `path`.

#### Desenho de um gráfico de pizza

Imagine que você acabou de conseguir um emprego na EconomiCorp Inc. e sua primeira missão é desenhar um gráfico de pizza dos resultados da pesquisa de satisfação do cliente.

A variável dos resultados contém uma matriz de objetos que representam as respostas da pesquisa.

```js
var results = [
  {name: "Satisfied", count: 1043, color: "lightblue"},
  {name: "Neutral", count: 563, color: "lightgreen"},
  {name: "Unsatisfied", count: 510, color: "pink"},
  {name: "No comment", count: 175, color: "silver"}
];
```

Para desenhar um gráfico de pizza, traçamos um número de fatias, cada um é composto por um arco e um par de linhas para o centro desse arco. Podemos calcular o ângulo ocupado por cada arco dividindo um círculo completo(2π) pelo número total de respostas, em seguida multiplicamos esse número(o ângulo por resposta) pelo número de pessoas que fizeram determinadas escolhas.

```html
<canvas width="200" height="200"></canvas>
<script>
  var cx = document.querySelector("canvas").getContext("2d");
  var total = results.reduce(function(sum, choice) {
    return sum + choice.count;
  }, 0);
  // Start at the top
  var currentAngle = -0.5 * Math.PI;
  results.forEach(function(result) {
    var sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.beginPath();
    // center=100,100, radius=100
    // from current angle, clockwise by slice's angle
    cx.arc(100, 100, 100,
           currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    cx.lineTo(100, 100);
    cx.fillStyle = result.color;
    cx.fill();
  });
</script>
```

Mas um gráfico que não nos diz o que significa não é útil. Nós precisamos de uma maneira para desenhar o texto na tela.

#### Texto

Um contexto de desenho canvas 2D fornece os métodos `fillText` e `strokeText`. Este último pode ser útil para delinear as letras mas geralmente `fillText` é o que você precisa. Ele vai encher o texto com a cor atual de `fillColor`.

```html
<canvas></canvas>
<script>
  var cx = document.querySelector("canvas").getContext("2d");
  cx.font = "28px Georgia";
  cx.fillStyle = "fuchsia";
  cx.fillText("I can draw text, too!", 10, 50);
</script>
```

Você pode especificar o tamanho, estilo e tipo da letra do texto com a propriedade `font`. Este exemplo apenas dá um tamanho de fonte e nome da família. Você pode adicionar o itálico ou negrito para o início de uma seqüência de caracteres.

Os dois últimos argumentos para `fillText`(e `strokeText`) fornecem a posição em que a fonte é desenhado. Por padrão indica a posição do início da linha na base alfabética do texto, que é a linha que as letras ficam não tendo partes penduradas; em letras como `j` ou `p` você pode mudar a posição horizontal definindo a propriedade `textAlign` para `end` ou `center` e a posição vertical definindo `TextBaseline` para `top`, `middle` ou `bottom`.

Vamos voltar ao nosso gráfico de pizza para corrigir o problema de rotular as fatias nos exercícios no final do capítulo.