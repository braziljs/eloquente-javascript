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