# Projeto - Vida eletrônica

> [...] A questão da máquinas poder pensar [...] é tão relevante quanto a questão dos submarinos poderem nadar.
>
> - Edsger Dijkstra, The Threats to Computing Science

Nos capítulo "Projeto", eu vou apresentar uma nova teoria por um breve momento e trabalhar através de um programa com você. A teoria é indispensável quando aprender a programar, mas deve ser acompanhada da leitura para entender os programas não triviais.

Nosso projeto neste capítulo é construir um ecossistema virtual, um mundo pequeno povoado com criaturas que se movem e luta pela sobrevivência.

## Definição

Para tornar esta tarefa gerenciável, vamos simplificar radicalmente o conceito de um mundo. Ou seja, um mundo será uma grade bidimensional onde cada entidade ocupa um quadrado da grade. Em cada turno os bichos todos tem a chance de tomar algumas medidas.

Utilizaremos o tempo e o espaço em unidades com um tamanho fixo: quadrados para o espaço e voltas para o tempo. É claro que as aproximações seram imprecisas. Mas nossa simulação pretende ser divertida, para que possamos livremente cortar esses cantos.

Podemos definir um mundo com um plano, uma matriz de strings que estabelece uma grade do mundo usando um personagem por metro quadrado.

```js
var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];
```

Os caracteres `"#"` representam as paredes e rochas, e os personagens de `"O"` representam os bichos . Os espaços, como você ja deve ter pensado, é o espaço vazio.

Um plano de matriz pode ser usada para criar um objecto de mundo. Tal objeto mantém o controle do tamanho e do conteúdo do mundo. Ele tem um método toString, que converte o mundo de volta para uma seqüência de impressão(similar ao plano que foi baseado) para que possamos ver o que está acontecendo lá dentro. O objeto do mundo também tem um método por sua vez que permite que todos os bichos podem darem uma volta e atualizar o mundo para refletir suas ações.

## Representando o espaço

A `grid` modela o mundo com uma largura e altura fixa. Os quadrados são identificados pelas suas coordenadas x e y. Nós usamos um tipo simples, Vector (como visto nos exercícios para o capítulo anterior), para representar esses pares de coordenadas.

```js
function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
```

Em seguida, temos um tipo de objeto que é o modelos da grid. A `grid` é uma parte do mundo, e tornamos ela um objeto separado(que será uma propriedade de um objeto do mundo) para manter o objeto de mundo simples. O mundo deve preocupar-se com as coisas relacionadas com o mundo e a `grid` deve preocupar-se com as coisas relacionadas com a `grid`.

Para armazenar um valor a `grid` temos várias opções. Podemos usar um `array` de `arrays` de linhas e usar duas propriedades de acessos para chegar a um quadrado específico como este:

```js
var grid = [["top left",    "top middle",    "top right"],
            ["bottom left", "bottom middle", "bottom right"]];
console.log(grid[1][2]);
// → bottom right
```

Ou podemos usar uma única matriz com largura x altura, e decidir que o elemento`(x, y)` é encontrado na posição `x + (y * largura)` na matriz.

```js
var grid = ["top left",    "top middle",    "top right",
            "bottom left", "bottom middle", "bottom right"];
console.log(grid[2 + (1 * 3)]);
// → bottom right
```

Uma vez que o acesso real a essa matriz esta envolto em métodos de tipo do objeto da `grid`, não importa o código que adotamos para abordagem. Eu escolhi a segunda representação pois torna muito mais fácil para criar a matriz. Ao chamar o construtor de `Array` com um único número como argumento, ele cria uma nova matriz vazia com o comprimento enviado.

Esse código define o objeto `grid`, com alguns métodos básicos:

```js
function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}
Grid.prototype.isInside = function(vector) {
  return vector.x >= 0 && vector.x < this.width &&
         vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function(vector) {
  return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function(vector, value) {
  this.space[vector.x + this.width * vector.y] = value;
};
```

Aqui esta um exemplo trivial do teste:

```js
var grid = new Grid(5, 5);
console.log(grid.get(new Vector(1, 1)));
// → undefined
grid.set(new Vector(1, 1), "X");
console.log(grid.get(new Vector(1, 1)));
// → X
```

## A interface de programação dos bichos

Antes de começarmos nosso construtor global, devemos específicar quais os objetos de bichos estarão vivendo em nosso mundo. Eu mencionei que o mundo vai especificar os bichos e as ações que eles teram. Isso funciona da seguinte forma: cada bicho é um objeto e tem um método de ação que quando chamado retorna uma ação. Uma ação é um objeto com uma propriedade de tipo, que dá nome a ação que o bicho terá, por exemplo `"move"`. A ação pode também conter informação extra de como a direção que o bicho vai se mover.

Bichos são terrivelmente míope e pode ver apenas os quadrados em torno da `grid`. Mas essa visão limitada pode ser útil ao decidir que ação tomar. Quando o método ato é chamado o objeto de exibição permite que o bicho inspecione seus arredores. Nós vamos nomear oito quadrados vizinhos para ser as coordenadas: `"n"` para norte, `"ne"` para nordeste e assim por diante. Aqui está o objeto, vamos utilizar para mapear nomes de direções para coordenar os  `offsets`:

```js
var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};
```

O objeto de exibição tem um método que observa em qual  direção o bicho esta indo e retorna um personagem por exemplo, um "#" quando há uma parede na direção ou um "" (espaço) quando não há nada. O objeto também fornece os métodos `find` e `findAll`. Ambos tomam um mapa de caráter como um argumento. O primeiro retorna a direção em que o personagem pode ser encontrado ao lado do bicho ou retorna nulo se não existir tal sentido. O segundo retorna um `array` contendo todas as direções com esse personagem. Por exemplo, uma criatura sentada à esquerda(oeste) de um muro vai ter ["ne", "e", "se"] ao chamar `findAll` passando o  caractere "#" como argumento.

Aqui é um bicho simples e estúpido que segue apenas seu nariz até que ela atinja um obstáculo e depois salta para fora em uma direção aleatória:

```js
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var directionNames = "n ne e se s sw w nw".split(" ");

function BouncingCritter() {
  this.direction = randomElement(directionNames);
};

BouncingCritter.prototype.act = function(view) {
  if (view.look(this.direction) != " ")
    this.direction = view.find(" ") || "s";
  return {type: "move", direction: this.direction};
};
```

A função auxiliar `randomElement` simplesmente pega um elemento aleatório de uma matriz usando `Math.random` para obter um índice aleatório. Vamos usar isso de novo mais tarde porque a aleatoriedade pode ser útil em simulações.

Para escolher uma direção aleatória o construtor de `BouncingCritter` chama `randomElement` em uma matriz de nomes de direção. Nós também poderia ter usado `Object.keys` para obter essa matriz de direções que definimos anteriormente, mas não é garantido a ordem em que as propriedades seram listadas. Na maioria das situações os motores modernos de JavaScript retornam as propriedades na ordem em que foram definidos, mas eles não são obrigados a terem tais comportamentos.

O `“|| "s"”` no método de ação serve para impedir `this.direction` de obter um valor nulo para o bicho que está preso em um espaço vazio em torno dele(por exemplo, quando um canto esta lotado de outros bichos).

## O objeto do mundo

Agora podemos começar a fazer o objeto mundo. O construtor tem um plano(a matriz de strings que representa a grade do mundo como descrito anteriormente) e uma legenda como argumentos. A legenda é um objeto que nos diz o que cada personagem no mapa significa. Ela contém um construtor para cada personagem, exceto para o caractere de espaço que sempre se refere como `null` sendo este o valor que vamos usar para representar o espaço vazio.

```js
function elementFromChar(legend, ch) {
  if (ch == " ")
    return null;
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function(line, y) {
    for (var x = 0; x < line.length; x++)
      grid.set(new Vector(x, y),
               elementFromChar(legend, line[x]));
  });
}
```

Em `elementFromChar` primeiro criamos uma instância do tipo correto, observando o construtor do caráter aplicando novo para ele. Em seguida é adicionado uma propriedade `originChar` tornando mais fácil de descobrir em qual personagem o elemento foi originalmente criado.

Precisamos da propriedade `originChar` quando implementarmos o método `toString` no mundo. Este método constrói uma seqüência de mapeamento de estado atual do mundo através da realização de um ciclo de duas dimensões sobre os quadrados na grid.

```js
function charFromElement(element) {
  if (element == null)
    return " ";
  else
    return element.originChar;
}

World.prototype.toString = function() {
  var output = "";
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get(new Vector(x, y));
      output += charFromElement(element);
    }
    output += "\n";
  }
  return output;
};
```

A parede é um objeto simples que é usado apenas para ocupar espaço e não tem nenhum método ação.

```js
function Wall() {}
```

Vamos criar um objeto Mundo com base no plano passado no início do capítulo, em seguida iremos chamar `toString` sobre ele.

```js
var world = new World(plan, {"#": Wall,
                             "o": BouncingCritter});
console.log(world.toString());
// → ############################
//   #      #    #      o      ##
//   #                          #
//   #          #####           #
//   ##         #   #    ##     #
//   ###           ##     #     #
//   #           ###      #     #
//   #   ####                   #
//   #   ##       o             #
//   # o  #         o       ### #
//   #    #                     #
//   ############################
```