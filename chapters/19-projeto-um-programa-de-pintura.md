# Um programa de pintura

> "Eu olho para muitas cores antes de mim. Eu olho para minha tela em branco. Então, eu tento aplicar cores como palavras que moldam poemas, como as notas que formam a música."
> `Joan Miro`

O material do capítulo anterior dá para você todo os elementos que você precisa para construir uma aplicação web simples. Nesse capítulo, vamos fazer exatamente isso.

Nosso aplicativo será um programa de desenho baseado na web, aos moldes do Microsoft Paint. Você poderá usá-lo para abrir arquivos de imagem, rabiscar sobre ela com o mouse e salvá-la. Isso é como vai se parecer:

![paint](http://eloquentjavascript.net/img/paint.png)

Pintar pelo computador é ótimo. Você não precisa se preocupar com materiais, habilidades ou talento. Você apenas precisa começar a manchar.

## Implementação

A interface para o programa de pintura mostra um grande elemento `<canvas>` na parte superior, com os campos do formulário abaixo dele. O usuário desenha na imagem ao selecionar uma ferramenta de um campo `<select>` e em seguida clicando ou arrastando em toda a tela. Existem ferramentas para desenhar linhas, apagar partes da imagem, adicionar texto e assim por diante.

Clicando na tela, será delegado o evento `mousedown` para a ferramenta selecionada no momento, que poderá manipulá-lo em qualquer maneira que escolher. A ferramenta de desenhar linha, por exemplo, vai ouvir os eventos de `mousemove` até que o botão do mouse seja liberado e desenhará linhas através do caminho do mouse usando a cor atual e o tamanho do pincel.

Cor e o tamanho do pincel são selecionados com campos adicionais no formulário. Esses são ativados para atualizar a tela desenhando o conteúdo `fillStyle`, `strokeStyle` e `lineWidth` toda hora que eles forem alterados.

Você pode carregar uma imagem no programa de duas formas. A primeira usa um campo de arquivo, onde o usuário pode selecionar um arquivo no seu computador. A segunda pede uma URL e vai pegar a imagem na internet.

Imagens são salvas em um lugar atípico. O link de salvar está no canto direito da imagem ao lado do tamanho do pincel. Ele pode ser seguido, compartilhado ou salvo. Eu vou explicar como isso é possível em um momento.

## Construindo o DOM

A interface do nosso programa é criado a partir de mais de 30 elementos DOM. Nós precisamos construir esses de alguma maneira.

HTML é o formato mais óbvio para definir estrutura complexas do DOM. Mas, separando o programa em pedaços de HTML e um script é dificultada pelo fato de muitos elementos do DOM precisar de manipuladores de eventos ou ser tocado por outro script de alguma outra forma. Assim, nosso script precisa fazer muitas chamadas de `querySelector` (ou similar), afim de encontrar algum elemento DOM que ele precise para agir.

Seria bom se a estrutura DOM para cada parte da nossa interface fosse definida perto do código JavaScript que vai interagir com ela. Assim, eu escolhi por fazer toda a criação dos nós do DOM no JavaScript. Como nós vimos no [Capítulo 13](http://eloquentjavascript.net/13_dom.html#standard), a interface integrada para a criação da estrutura DOM é terrivelmente verbosa. Se vamos fazer um monte de construções DOM, precisamos de uma função auxiliar.

Essa função auxiliar é uma função estendida da função `elt` a partir do [Capítulo 13](http://eloquentjavascript.net/13_dom.html#elt). Ela cria um elemento com o nome e os atributos dado e acrescenta todos os argumentos que ela recebe como nós filho, automaticamente convertendo strings em nós de texto.

```javascript
function elt(name, attributes) {
  var node = document.createElement(name);
  if (attributes) {
    for (var attr in attributes)
      if (attributes.hasOwnProperty(attr))
        node.setAttribute(attr, attributes[attr]);
  }
  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];
    if (typeof child == "string")
      child = document.createTextNode(child);
    node.appendChild(child);
  }
  return node;
}
```

Isso nos permite criar elementos facilmente, sem fazer nosso código fonte tão longo e maçante quanto um contrato de usuário final corporativo.

## A fundação

O núcleo do nosso programa é a função `createPaint`, que acrescenta a interface de pintura em um elemento do DOM que é dado como argumento. Porque nós queremos construir nosso programa pedaço por pedaço, definimos um objeto chamado `controls`, que realizará funções para inicializar vários controles abaixo da imagem.

```javascript
var controls = Object.create(null);

function createPaint(parent) {
  var canvas = elt("canvas", {width: 500, height: 300});
  var cx = canvas.getContext("2d");
  var toolbar = elt("div", {class: "toolbar"});
  for (var name in controls)
    toolbar.appendChild(controls[name](cx));

  var panel = elt("div", {class: "picturepanel"}, canvas);
  parent.appendChild(elt("div", null, panel, toolbar));
}
```

Cada controle tem acesso ao contexto da tela de desenho e, através da propriedade tela desse contexto, para o elemento `<canvas>`. A maior parte do estado do programa vive nesta tela - que contém a imagem atual bem como a cor selecionada (em sua propriedade `fillStyle`) e o tamanho do pincel (em sua propriedade `lineWidth`).

Nós envolvemos a tela e os controles em elementos `<div>` com classes que seja possível adicionar um pouco de estilo, como uma borda cinza envolta da imagem.

## Ferramenta de seleção

O primeiro controle que nós adicionamos é o elemento `<select>` que permite o usuário a selecionar uma ferramenta de desenho. Tal como com os controles, vamos usar um objeto para coletar as várias ferramentas de modo que não temos que codificá-las em um só lugar e nós podemos adicionar ferramentas novas mais tarde. Esse objeto associa os nomes das ferramentas com a função que deverá ser chamada quando ela for selecionada e quando for clicado na tela.

```javascript
var tools = Object.create(null);

controls.tool = function(cx) {
  var select = elt("select");
  for (var name in tools)
    select.appendChild(elt("option", null, name));

  cx.canvas.addEventListener("mousedown", function(event) {
    if (event.which == 1) {
      tools[select.value](event, cx);
      event.preventDefault();
    }
  });

  return elt("span", null, "Tool: ", select);
};
```

O campo de ferramenta é preenchida com elementos `<option>` para todas as ferramentas que foram definidas e um manipulador `mousedown` no elemento `canvas` cuida de chamar a função para a ferramenta atual, passando tanto o objeto do evento quanto o contexto do desenho como argumentos. E também chama `preventDefault` para que segurando o botão do mouse e arrastando não cause uma seleção do navegador em qualquer parte da página.

A ferramenta mais básica é a ferramenta de linha, o qual permite o usuário a desenhar linhas com o mouse. Para colocar o final da linha no lugar certo, temos que ser capazes de encontrar as coordenadas relativas do canvas que um determinado evento do mouse corresponde. O método `getBoundingClientRect`, brevemente mencionado no [Capítulo 13](http://eloquentjavascript.net/13_dom.html#boundingRect), pode nos ajudar aqui. Nos diz que um elemento é exibido, relativo ao canto `top-left` da tela. As propriedades `clientX` e `clientY` dos eventos do mouse também são relativas a esse canto, então podemos subtrair o canto `top-left` da tela a partir deles para obter uma posição em relação a esse canto.

```javascript
function relativePos(event, element) {
  var rect = element.getBoundingClientRect();
  return {x: Math.floor(event.clientX - rect.left),
          y: Math.floor(event.clientY - rect.top)};
}
```

Várias das ferramentas de desenho precisam ouvir os eventos `mousemove` até que o botão do mouse mantiver pressionado. A função `trackDrag` cuida de registrar e cancelar o registro de eventos para essas situações.


```javascript
function trackDrag(onMove, onEnd) {
  function end(event) {
    removeEventListener("mousemove", onMove);
    removeEventListener("mouseup", end);
    if (onEnd)
      onEnd(event);
  }
  addEventListener("mousemove", onMove);
  addEventListener("mouseup", end);
}
```

Essa função recebe dois argumentos. Um é a função para chamar a cada evento `mousemove` e o outro é uma função para chamar quando o botão do mouse deixa de ser pressionado. Qualquer argumento pode ser omitido quando não for necessário.

A ferramenta de linha usa esses dois métodos auxiliares para fazer o desenho real.

```javascript
tools.Line = function(event, cx, onEnd) {
  cx.lineCap = "round";

  var pos = relativePos(event, cx.canvas);
  trackDrag(function(event) {
    cx.beginPath();
    cx.moveTo(pos.x, pos.y);
    pos = relativePos(event, cx.canvas);
    cx.lineTo(pos.x, pos.y);
    cx.stroke();
  }, onEnd);
};
```

A função inicia por definir a propriedade do contexto de desenho `lineCap` para `round`, que faz com que ambas as extremidades de um caminho traçado,  fique arredondada e não na forma padrão quadrada. Esse é o truque para se certificar de que várias linhas separadas, desenhadas em resposta a eventos separados, pareçam a mesma, coerente. Com larguras maiores de linhas, você vai ver as lacunas nos cantos se você usar as linhas planas padrão.

Então, para cada evento `mousemove` que ocorre enquanto o botão do mouse está pressionado, um simples segmento de linha entre o botão do mouse apertado e a nova posição, usando qualquer `strokeStyle` e `lineWidth` começa a ser desenhado no momento.

O argumento `onEnd` para a ferramenta de linha é simplesmente passado através do `trackDrag`. O caminho normal para executar as ferramentas não vai passar o terceiro argumento, portando, quando usar a ferramenta linha, esse argumento mantém `undefined` e nada acontece no final do movimento do mouse. O argumento está lá para nos permitir implementar a ferramenta de `apagar` na parte superior da ferramenta da linha com muito pouco código adicional.

```javascript
tools.Erase = function(event, cx) {
  cx.globalCompositeOperation = "destination-out";
  tools.Line(event, cx, function() {
    cx.globalCompositeOperation = "source-over";
  });
};
```

A propriedade `globalCompositeOperation` influencia o modo como as operações de desenhar em uma tela de desenho altera a cor dos pixels que tocam. Por padrão, o valor da propriedade é `source-over`, o que significa que a cor do desenho é sobreposta sobre a cor já existente naquele ponto. Se a cor é opaca, vai apenas substituir a cor antiga, mas, se é parcialmente transparente, as duas serão misturadas.

A ferramenta `apagar` define `globalCompositeOperation` para `destination-out`, que tem o efeito de apagar os pixels que tocamos, tornando-os transparentes novamente.

Isso nos dá duas ferramentas para nosso programa de pintura. Nós podemos desenhar linhas pretas em um único pixel de largura (o padrão `strokeStyle` e `lineWidth` para uma tela) e apagá-los novamente. É um trabalho, mesmo que ainda bastante limitado, programa de pintura.

### Cor e tamanho do pincel

Partindo do princípio que os usuários vão querer desenhar em cores diferentes do preto e usar tamanhos diferentes de pincéis, vamos adicionar controles para essas duas definições.

No [Capítulo 8](http://eloquentjavascript.net/18_forms.html#forms), eu discuti um número de diferentes campos de formulário. Campo de cor não estava entre aqueles. Tradicionalmente, os navegadores não tem suporte embutido para seletores de cores, mas nos últimos anos, uma série de tipos de campos foram padronizados. Uma delas é `<input type='color'>`. Outros incluem `date`, `email`, `url` e `number`. Nem todos os navegadores suportam eles ainda - no momento da escrita, nenhuma versão do Internet Explorer suporta campos de cor. O tipo padrão de uma tag `<input>` é `text`, e quando um tipo não suportado é usado, os navegadores irão tratá-lo como um campo de texto. Isso significa que usuários do Internet Explorer executando o nosso programa de pintura vão ter que digitar o nome da cor que quiser, ao invés de selecioná-la a partir de um componente conveniente.

```javascript
controls.color = function(cx) {
  var input = elt("input", {type: "color"});
  input.addEventListener("change", function() {
    cx.fillStyle = input.value;
    cx.strokeStyle = input.value;
  });
  return elt("span", null, "Color: ", input);
};
```

Sempre que o valor do campo cor muda, o `fillStyle` e `strokeStyle` do contexto são atualizados para manter o novo.

O campo para configurar o tamanho do pincel funciona de forma semelhante.

```javascript
controls.brushSize = function(cx) {
  var select = elt("select");
  var sizes = [1, 2, 3, 5, 8, 12, 25, 35, 50, 75, 100];
  sizes.forEach(function(size) {
    select.appendChild(elt("option", {value: size},
                           size + " pixels"));
  });
  select.addEventListener("change", function() {
    cx.lineWidth = select.value;
  });
  return elt("span", null, "Brush size: ", select);
};
```

O código gera opções a partir de uma `array` de tamanhos de pincel e, novamente, garante que o `lineWidth` seja atualizado quando um tamanho de pincel é escolhido.

### Salvando

Para explicar a implementação do link salvar, eu preciso falar sobre `data URLs`. Um `data URL` é uma URL com dados: como seu protocolo. Ao contrário de `http`: normal e `https`: URLS, URLs de dados não apontam para algum recurso mas sim, contém todo o recurso em si. Esta é uma URL de dados contendo um simples documento HTML.

```html
data:text/html,<h1 style="color:red">Hello!</h1>
```

Essas URLs são úteis para várias tarefas, tais como a inclusão de pequenas imagens diretamente em um arquivo de folha de estilo. Eles também nos permitem linkar para arquivos que nós criamos no lado do cliente, no navegador, sem antes mover para algum servidor.

Elementos `canvas` tem um método conveniente, chamado `toDataURL`, que irá retornar a URL de dados que contém a imagem no `canvas` como um arquivo de imagem. Nós não queremos para atualizar nosso link de salvar toda vez que a imagem for alterada. Para imagens grandes, que envolve a transferência de um monte de dados em um link, seria visivelmente lento. Em vez disso, nós atualizaremos o atributo `href` do link sempre que o foco do teclado estiver sobre ele ou o mouse é movido sobre ele.

```javascript
controls.save = function(cx) {
  var link = elt("a", {href: "/"}, "Save");
  function update() {
    try {
      link.href = cx.canvas.toDataURL();
    } catch (e) {
      if (e instanceof SecurityError)
        link.href = "javascript:alert(" +
          JSON.stringify("Can't save: " + e.toString()) + ")";
      else
        throw e;
    }
  }
  link.addEventListener("mouseover", update);
  link.addEventListener("focus", update);
  return link;
};
```

Assim, o link fica calmamente ali sentado, apontando para a coisa errada, mas quando o usuário se aproxima, ele magicamente se atualiza para apontar para a imagem atual.

Se você carregar uma imagem grande, alguns navegadores vão ter problemas com as URLs de dados gigantes que essa produz. Para imagens pequenas, essa abordagem funciona sem problemas.

Mas aqui estamos, mais uma vez para correr para as sutilezas do navegador sandboxing. Quando uma imagem é carregada a partir de uma URL para outro domínio, se a resposta do servidor não incluir o header que diz ao navegador que o recurso pode ser usado para outro domínio (ver o [Capítulo 17](http://eloquentjavascript.net/17_http.html#http_sandbox)), a tela irá conter as informações que o `usuário` pode olhar, mas que o script não pode.

Podemos ter solicitado uma imagem que contenha informações privadas (por exemplo, um gráfico que mostre o saldo da conta bancária do usuário) usando a sessão do usuário. Se os scripts puderem obter as informações dessa imagem, eles podem espionar o usuário de formas indesejáveis.

Para evitar esse tipo vazamento de informações, os navegadores irá deixar a tela tão `manchada` quando se trada de uma imagem que o script não pode ver. Dados de pixel, incluindo URLs de dados, não podem ser extraídos de uma tela manchada. Você pode escrever para ele, mas você não pode mais ler.

É por isso que precisamos das instruções `try/catch` na função `update` para o link salvar. Quando o `canvas` ficou corrompido, chamando `toDataURL` irá lançar uma exceção que é uma instância do `SecurityError`. Quando isso acontece, nós definimos o link para apontar para outro tipo de URL, usando o `javascript`: protocolo. Esses links simplesmente executam o script dado após os dois pontos para que o link irá mostrar uma janela de `alert` informando o usuário do problema quando é clicado.

### Carregando arquivos de imagem

Os dois controles finais são usados para carregar arquivos de imagens locais e a partir de URLs. Vamos precisar da seguinte função auxiliar, que tenta carregar um arquivo de imagem a partir de uma URL e substitui o conteúdo do `canvas` por ela.

```javascript
function loadImageURL(cx, url) {
  var image = document.createElement("img");
  image.addEventListener("load", function() {
    var color = cx.fillStyle, size = cx.lineWidth;
    cx.canvas.width = image.width;
    cx.canvas.height = image.height;
    cx.drawImage(image, 0, 0);
    cx.fillStyle = color;
    cx.strokeStyle = color;
    cx.lineWidth = size;
  });
  image.src = url;
}
```

Nós queremos alterar o tamanho do `canvas` para ajustar precisamente a imagem. Por alguma razão, alterar o tamanho do `canvas` vai causar perca das configurações do contexto do desenho como `fillStyle` e `lineWidth`, então a função salva elas e restaura depois de ter atualizado o tamanho do `canvas`.

O controle para o carregamento de um arquivo local utiliza a técnica `FileReader` a partir do [Capítulo 18](http://eloquentjavascript.net/18_forms.html#filereader). Além do método `readAsText` que nós usamos lá, tais objetos de leitura também tem um método chamado `readAsDataURL`, que é exatamente o que precisamos aqui. Nós carregamos o arquivo que o usuário escolheu como URL de dados e passaremos para `loadImageURL` para colocá-lo no `canvas`.

```javascript
controls.openFile = function(cx) {
  var input = elt("input", {type: "file"});
  input.addEventListener("change", function() {
    if (input.files.length == 0) return;
    var reader = new FileReader();
    reader.addEventListener("load", function() {
      loadImageURL(cx, reader.result);
    });
    reader.readAsDataURL(input.files[0]);
  });
  return elt("div", null, "Open file: ", input);
};
```

Carregando um arquivo através de uma URL é ainda mais simples. Mas, com o campo de texto, é menos limpo quando o usuário termina de escrever a URL, por isso nós não podemos simplesmente ouvir pelos eventos `change`. Ao invés disso, vamos envolver o campo de um formulário e responder quando o formulário for enviado, seja porque o usuário pressionou `Enter` ou porque clicou no botão de carregar.

```javascript
controls.openURL = function(cx) {
  var input = elt("input", {type: "text"});
  var form = elt("form", null,
                 "Open URL: ", input,
                 elt("button", {type: "submit"}, "load"));
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    loadImageURL(cx, form.querySelector("input").value);
  });
  return form;
};
```

Nós temos agora definidos todos os controles que o nosso simples programa de pintura precisa, mas isso ainda poderia usar mais algumas ferramentas.

### Finalizando

Nós podemos facilmente adicionar uma ferramenta de texto que peça para o usuário qual é o texto que deve desenhar.

```javascript
tools.Text = function(event, cx) {
  var text = prompt("Text:", "");
  if (text) {
    var pos = relativePos(event, cx.canvas);
    cx.font = Math.max(7, cx.lineWidth) + "px sans-serif";
    cx.fillText(text, pos.x, pos.y);
  }
};
```

Você pode adicionar campos extras para o tamanho da fonte, mas para simplificar, sempre use uma fonte `sans-serif` e baseie o tamanho da fonte com o tamanho atual do pincel. O tamanho mínimo é de 7 pixels porque texto menor do que isso, é ilegível.

Outra ferramenta indispensável para a desenhos de computação amadores é a ferramenta tinta spray. Este desenha pontos em locais aleatórios sobre o pincel, desde que o mouse é pressionado, criando mais denso ou salpicado menos densa com base em quão rápido ou lento os movimentos do mouse são.

```javascript
tools.Spray = function(event, cx) {
  var radius = cx.lineWidth / 2;
  var area = radius * radius * Math.PI;
  var dotsPerTick = Math.ceil(area / 30);

  var currentPos = relativePos(event, cx.canvas);
  var spray = setInterval(function() {
    for (var i = 0; i < dotsPerTick; i++) {
      var offset = randomPointInRadius(radius);
      cx.fillRect(currentPos.x + offset.x,
                  currentPos.y + offset.y, 1, 1);
    }
  }, 25);
  trackDrag(function(event) {
    currentPos = relativePos(event, cx.canvas);
  }, function() {
    clearInterval(spray);
  });
};
```

A ferramenta spray usa `setInterval` para cuspir pontos coloridos a cada 25 milissegundos enquanto o botão do mouse é pressionado. A função `trackDrag` é usada para manter o `currentPos` apontando para a posição atual do mouse e para desligar o intervalo quando o mouse é liberado.

Para determinar quantos pontos serão desenhados a cada intervalo de cliques, a função calcula a área do pincel e divide por 30. Para encontrar uma posição aleatória sob o pincel, é usada a função `randomPointLnRadius`.

```javascript
function randomPointInRadius(radius) {
  for (;;) {
    var x = Math.random() * 2 - 1;
    var y = Math.random() * 2 - 1;
    if (x * x + y * y <= 1)
      return {x: x * radius, y: y * radius};
  }
}
```

A função gera pontos no quadrado entre (-1,-1) e (1,1). Usando o teorema de Pitágoras, ele testa se o ponto gerado encontra-se dentro de um círculo de raio 1. Logo que a função encontrar esse ponto, ele retorna o ponto multiplicado pelo argumento de raio.

O círculo é necessário para a distribuição uniforme dos pontos. A maneira simples de gerar um ponto aleatório dentro de um círculo seria a utilização de um ângulo e distância aleatória e chamar `Math.sin` e `Math.cos` para criar o ponto correspondente. Mas com esse método, os pontos são mais prováveis de aparecerem perto do centro do círculo. Existem outras maneiras de contornar isso, mas elas são mais complicadas do que o ciclo anterior.

Nós agora temos um programa de pintura funcionando. Execute o código abaixo para experimentá-lo.

```html
<link rel="stylesheet" href="css/paint.css">

<body>
  <script>createPaint(document.body);</script>
</body>
```

## Exercícios

Ainda há muito espaço para melhorias nesse programa. Vamos adicionar mais algumas funcionalidades como exercício.

### Retângulos

Definir uma ferramenta chamada `Retângulo` que preenche um retângulo (veja o método `fillRect` a partir do [Capítulo 16](http://eloquentjavascript.net/16_canvas.html#fill_stroke)) com a cor atual. O retângulo deve espalhar a partir do ponto onde o usuário pressionar o botão do mouse para o ponto onde ele é liberado. Note-se que este último pode estar acima ou a esquerda do primeiro.

Uma vez que ele funcionar, você vai perceber que é um pouco chocante não ver o retângulo como você está arrastando o mouse para definir o seu tamanho. Você pode chegar a uma maneira de mostrar algum tipo de retângulo durante o movimento do mouse, sem realmente ir desenhando no `canvas` até que o botão do mouse seja liberado?

Se nada lhe vem a mente, relembre `position: absolute` discutido no [Capítulo 13](http://eloquentjavascript.net/13_dom.html#animation), que pode ser usado para sobrepor um nó no resto do documento. As propriedades `pagex` e `pageY` de um evento de mouse pode ser usada para a posicionar um elemento precisamente sob o mouse, definindo os estilos `left`, `top`, `width` e `height` para os valores corretos de pixel.

```html
<script>
  tools.Rectangle = function(event, cx) {
    // Your code here.
  };
</script>

<link rel="stylesheet" href="css/paint.css">
<body>
  <script>createPaint(document.body);</script>
</body>
```

**Dicas**

Você pode utilizar `relativePos` para encontrar o canto correspondente ao início do arrasto do mouse. Descobrir aonde as extremidades de arrasto termina pode ser com `trackDrag` ou registrando seu próprio manipulador de eventos.

Quando você tem dois cantos do retângulo, você deve de alguma forma traduzi-los em argumentos que o `fillRect` espera: O canto `top-lef`, `width` e `height` do retângulo. `Math.min` pode ser usado para encontrar a coordenada mais a esquerda X e a coordenada superior Y. Para obter o `width` e `height`, você pode chamar `Math.abs` (o valor absoluto) sobre a diferença entre os dois lados.

Mostrando o retângulo durante o arrastar do mouse requer um conjunto semelhante de números, mas no contexto de toda a página em vez de em relação ao `canvas`. Considere escrever um `findRect`, que converte dois pontos em um objeto com propriedades `top`, `left`, `width` e `height`, de modo que você não tenha que escrever a mesma lógica duas vezes.

Você pode, então, criar uma `<div>` e definir seu `style.position` como `absolute`. Ao definir os estilos de posicionamento, não se esqueça de acrescentar `px` para os números. O nó deve ser adicionado ao documento (você pode acrescentá-la à `document.body`) e também remover novamente quando o arrasto do mouse terminar e o retângulo real for desenhado na tela.

### Seletor de cores

Outra ferramenta que é comumente encontrada em programas gráficos é um seletor de cores, o que permite que o usuário clique na imagem e seleciona a cor sob o ponteiro do mouse. Construa este.

Para esta ferramenta, precisamos de uma maneira para acessar o conteúdo do `canvas`. O método `toDataURL` mais ou menos faz isso, mas recebendo informações de pixel para fora de tal URL de dados é difícil. Em vez disso, vamos usar o método `getImageData` no contexto do desenho, que retorna um pedaço retangular da imagem como um objeto com propriedades `width`, `height` e dados. A propriedade de dados contém um array de números de 0 a 255, com quatro números para representar, componentes de cada pixel vermelho, verde, azul e opacidade.

Este exemplo recupera os números para um único pixel de uma tela de uma vez, quando o `canvas` está em branco (todos os pixels são preto transparente) e uma vez quando o pixel foi colorido de vermelho.

```javascript
function pixelAt(cx, x, y) {
  var data = cx.getImageData(x, y, 1, 1);
  console.log(data.data);
}

var canvas = document.createElement("canvas");
var cx = canvas.getContext("2d");
pixelAt(cx, 10, 10);
// → [0, 0, 0, 0]

cx.fillStyle = "red";
cx.fillRect(10, 10, 1, 1);
pixelAt(cx, 10, 10);
// → [255, 0, 0, 255]
```

Os argumentos para `getImageData` indica o início das coordenadas x e y do retângulo que queremos recuperar, seguido por `width` e `height`.

Ignore transparência durante este exercício e se importe apenas com os três primeiros valores para um determinado pixel. Além disso, não se preocupe com a atualização do campo de cor quando o usuário escolher uma cor. Apenas certifique-se de que `fillStyle` do contexto do desenho e `strokeStyle` foram definidos com a cor sob o cursor do mouse.

Lembre-se que essas propriedades aceita qualquer cor que o CSS entende, que inclui o `rgb (R, G, B)` estilo que você viu no [Capítulo 15.](http://eloquentjavascript.net/15_game.html#game_css).

O método `getImageData` está sujeito as mesmas restrições como `toDataURL` irá gerar um erro quando a tela conter pixels que se originam a partir de outro domínio. Use um `try/catch` para relatar tais erros com um diálogo de alerta.

```html
<script>
  tools["Pick color"] = function(event, cx) {
    // Your code here.
  };
</script>

<link rel="stylesheet" href="css/paint.css">
<body>
  <script>createPaint(document.body);</script>
</body>
```
#### Exibir dicas

Você de novo vai precisar usar `relativePos` para descobrir qual pixel foi clicado. A função `pixelAt` no exemplo demonstra como obter os valores para um determinado pixel. Colocar eles em uma `string rgb` exige apenas algumas concatenações.

Certifique-se de verificar se a exceção que você pegar é uma instância de `SecurityError` de modo que você não trate acidentalmente o tipo errado de exceção.

### Preenchimento

Este é um exercício mais avançado do que os dois anteriores, e isso vai exigir que você projete uma solução não trivial para um problema complicado. Certifique-se de que você tem bastante tempo e paciência antes de começar a trabalhar neste exercício e não desanime por falhas iniciais.

A ferramenta preenchimento de cores do pixel sob o mouse e todo o grupo de pixels em torno dele que têm a mesma cor. Para efeitos deste exercício, vamos considerar esse grupo para incluir todos os pixels que podem ser alcançadas a partir de nosso pixel inicial movendo em um único pixel de medidas horizontais e verticais (não diagonal), sem nunca tocar um pixel que tenha uma cor diferente a partir do pixel de partida.

A imagem a seguir ilustra o conjunto de pixels coloridos quando a ferramenta de preenchimento é usada no pixel marcado:

![food_fill](http://eloquentjavascript.net/img/flood-grid.svg)

O preenchimento não vaza através de aberturas diagonais e não toca pixels que não são acessíveis, mesmo que tenham a mesma cor que o pixel alvo.

Você vai precisar mais uma vez do `getImageData` para descobrir a cor para cada pixel. É provavelmente uma boa ideia para buscar a imagem inteira de uma só vez e, em seguida, selecionar os dados de pixel do array resultante. Os pixels são organizados nesse array de uma forma semelhante aos elementos de rede, no [Capítulo 7](http://eloquentjavascript.net/07_elife.html#grid), uma linha de cada vez, exceto que cada pixel é representado por quatro valores. O primeiro valor para o pixel em (x, y) é a posição (x + y x width) x 4.

Não incluam o quarto valor (alpha) desta vez, já que queremos ser capazes de dizer a diferença entre pixels pretos e vazios.

Encontrar todos os pixels adjacentes com a mesma cor exige que você "ande" sobre a superfície do pixel, um pixel para cima, baixo, esquerda ou direita, até que os novos pixels da mesma cor possam ser encontrados. Mas você não vai encontrar todos os pixels em um grupo na primeira caminhada. Em vez disso, você tem que fazer algo semelhante para o retrocesso feito pela expressão de correspondência regular, descrito no [Capítulo 9](http://eloquentjavascript.net/09_regexp.html#backtracking). Sempre que for possível proceder por mais de uma direção for possível, você deve armazenar todas as instruções que você não tomar imediatamente e voltar para elas mais tarde, quando terminar a sua caminhada atual.

Em uma imagem de tamanho normal, há um grande número de pixels. Assim, você deve ter o cuidado de fazer a quantidade mínima de trabalho necessário ou o seu programa vai levar muito tempo para ser executado. Por exemplo, todos os passos devem ignorar pixels vistos por caminhadas anteriores, de modo que ele não refaça o trabalho que já foi feito.

Eu recomendo chamando `fillRect` para pixels individuais quando um pixel que deve ser colorido é encontrado e manter alguma estrutura de dados que informe sobre todos os pixels que já foram analisados.

```html
<script>
  tools["Flood fill"] = function(event, cx) {
    // Your code here.
  };
</script>

<link rel="stylesheet" href="css/paint.css">
<body>
  <script>createPaint(document.body);</script>
</body>
```

#### Exibir dicas

Dado um par de coordenadas de partida e os dados da imagem para todo o canvas, esta abordagem deve funcionar:

- Criar uma array para armazenar informações sobre coordenadas já coloridas.
- Criar uma array de lista de trabalho para segurar coordenadas que devem ser analisadas. Coloque a posição inicial na mesma.
- Quando a lista de trabalho estiver vazia, estamos prontos.
- Remova um par de coordenadas a partir da lista de trabalho.
- Se essas coordenadas já estão em nosso array de pixels coloridos, volte para o passo 3.
- Colorir o pixel nas coordenadas atuais e adicionar as coordenadas para o array de pixels coloridos.
- Adicionar as coordenadas de cada pixel adjacente cuja cor é a mesma que a cor original do pixel inicial para a lista de trabalho.
- Retorne ao passo 3.

A lista de trabalho pode ser simplesmente um array de objetos vetoriais. A estrutura de dados que rastreia pixels coloridos serão consultados com muita freqüência. Buscar por toda a coisa toda vez que um novo pixel é visitado vai custar muito tempo. Você poderia, ao invés de criar um array que tenha um valor nele para cada pixel, usando novamente x + y × esquema de largura para a associação de posições com pixels. Ao verificar se um pixel já foi colorido, você pode acessar diretamente o campo correspondente ao pixel atual.

Você pode comparar cores, executando sobre a parte relevante do array de dados, comparando um campo de cada vez. Ou você pode "condensar" uma cor a um único número ou o texto e comparar aqueles. Ao fazer isso, certifique-se de que cada cor produza um valor único. Por exemplo, a simples adição de componentes da cor não é segura, pois várias cores terá a mesma soma.

Ao enumerar os vizinhos de um determinado ponto, tenha o cuidado de excluir os vizinhos que não estão dentro da tela ou o seu programa poderá correr em uma direção para sempre.
