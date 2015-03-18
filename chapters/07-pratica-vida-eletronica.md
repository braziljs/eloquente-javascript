# Projeto - Vida eletrônica

> [...] A questão da máquinas poder pensar [...] é tão relevante quanto a questão dos submarinos poderem nadar.
>
> - Edsger Dijkstra, The Threats to Computing Science

Nos capítulo "Projeto" irei apresentar uma nova teoria por um breve momento e trabalhar através de um programa com você. A teoria é indispensável quando estamos aprendendo a programar mas deve ser acompanhada da leitura para entender os programas não triviais.

Nosso projeto neste capítulo é construir um ecossistema virtual, um mundo pequeno povoado com criaturas que se movem e luta pela sobrevivência.

## Definição

Para tornar esta tarefa gerenciável, vamos simplificar radicalmente o conceito de um mundo. Ou seja, um mundo será uma `grid` bidimensional onde cada entidade ocupa um quadrado da `grid`. Em cada turno os bichos todos tem a chance de tomar alguma ação.

Utilizaremos o tempo e o espaço com um tamanho fixo como unidades. Os quadrados sera os espaços e as voltas o tempo. É claro que as aproximações seram imprecisas. Mas nossa simulação pretende ser divertida para que possamos livremente cortar as sobras.

Podemos definir um mundo com uma matriz de `Strings` que estabelece uma `grid` do mundo usando um personagem por metro quadrado.

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

Os caracteres `"#"` representam as paredes e rochas, e os personagens `"O"` representam os bichos. Os espaços como você ja deve ter pensado é o espaço vazio.

Um plano de matriz pode ser usada para criar um objeto de mundo. Tal objeto mantém o controle do tamanho e do conteúdo do mundo. Ele tem um método `toString`, que converte o mundo de volta para uma seqüência de impressão(similar ao plano que foi baseado) para que possamos ver o que está acontecendo lá dentro. O objeto do mundo também tem um método por sua vez que permite que todos os bichos podem darem uma volta e atualizar o mundo para terem suas ações.

## Representando o espaço

A `grid` modela o mundo com uma largura e altura fixa. Os quadrados são identificados pelas suas coordenadas x e y. Nós usamos um tipo simples, Vector(como visto nos exercícios do capítulo anterior) para representar esses pares de coordenadas.

```js
function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
```

Em seguida, temos um tipo de objeto que é o modelo da `grid`. A `grid` é uma parte do mundo, e tornamos ela um objeto separado(que será uma propriedade de um objeto do mundo) para manter o objeto bem simples. O mundo deve preocupar-se com as coisas relacionadas com o mundo e a `grid` deve preocupar-se com as coisas relacionadas da `grid`.

Para armazenar um valor a `grid` temos várias opções. Podemos usar um `array` de `arrays` tendo duas propriedades de acessos para chegar a um quadrado específico como este:

```js
var grid = [["top left",    "top middle",    "top right"],
            ["bottom left", "bottom middle", "bottom right"]];
console.log(grid[1][2]);
// → bottom right
```

Ou podemos usar uma única matriz com largura x altura e decidir que o elemento`(x, y)` é encontrado na posição `x + (y * largura)` na matriz.

```js
var grid = ["top left",    "top middle",    "top right",
            "bottom left", "bottom middle", "bottom right"];
console.log(grid[2 + (1 * 3)]);
// → bottom right
```

Uma vez que o acesso real a essa matriz esta envolto em métodos de tipo do objeto da `grid`, não importa o código que adotamos para abordagem. Eu escolhi a segunda representação pois torna muito mais fácil para criar a matriz. Ao chamar o construtor de `Array` com um único argumento, ele cria uma nova matriz vazia com o comprimento que foi passado de parâmetro.

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

## A interface da programação dos bichos

Antes de começarmos nosso construtor global, devemos específicar quais os objetos bichos que estarão vivendo em nosso mundo. Eu mencionei que o mundo vai especificar os bichos e as ações que eles teram. Isso funciona da seguinte forma: cada bicho é um objeto e tem um método de ação que quando chamado retorna uma ação. Uma ação é um objeto com uma propriedade de tipo, que dá nome a ação que o bicho terá, por exemplo `"move"`. A ação pode também conter informação extra de alguma direção que o bicho possa se mover.

Bichos são terrivelmente míope e pode ver apenas os quadrados em torno da `grid`. Mas essa visão limitada pode ser útil ao decidir que ação tomar. Quando o método `act` é chamado o objeto de verificação permite que o bicho inspecione seus arredores. Nós vamos nomear oito quadrados vizinhos para ser as coordenadas: `"n"` para norte, `"ne"` para nordeste e assim por diante. Aqui está o objeto, vamos utilizar para mapear os nomes das direções para coordenar os  `offsets`:

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

O objeto de exibição tem um método que observa em qual direção o bicho esta indo e retorna um personagem por exemplo, um "#" quando há uma parede na direção ou um "" (espaço) quando não há nada. O objeto também fornece os métodos `find` e `findAll`. Ambos tomam um mapa de caráter como um argumento. O primeiro retorna a direção em que o personagem pode ser encontrado ao lado do bicho ou retorna nulo se não existir nenhum sentido. O segundo retorna um `array` contendo todas as direções possíveis para o personagem. Por exemplo, uma criatura sentada à esquerda(oeste) de um muro vai ter ["ne", "e", "se"] ao chamar `findAll` passando o  caractere "#" como argumento.

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

Para escolher uma direção aleatória o construtor de `BouncingCritter` chama `randomElement` em uma matriz de nomes de direção. Nós também poderiamos termos usado `Object.keys` para obter essa matriz de direções que definimos anteriormente, mas não é garantido a ordem em que as propriedades seram listadas. Na maioria das situações os motores modernos de JavaScript retornam as propriedades na ordem em que foram definidos, mas eles não são obrigados a terem tais comportamentos.

O `“|| "s"”` no método de ação serve para impedir que `this.direction` obtenha um valor nulo para o bicho que está preso em um espaço vazio em torno dele(por exemplo, quando um canto esta lotado de outros bichos).

## O objeto do mundo

Agora podemos começar a fazer o objeto mundo. O construtor tem um plano(a matriz de `Strings` que representa a `grid` do mundo como descrito anteriormente) e uma legenda como argumentos. A legenda é um objeto que nos diz o que cada personagem no mapa significa. Ela contém um construtor para cada personagem, exceto para o caracter de espaço que sempre se refere como `null` sendo este o valor que vamos usar para representar o espaço vazio.

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

Em `elementFromChar` primeiro criamos uma instância do tipo correto, observando o construtor do caráter aplicando um novo para ele. Em seguida é adicionado uma propriedade `originChar` tornando mais fácil de descobrir em qual personagem o elemento foi originalmente criado.

Precisamos da propriedade `originChar` quando implementarmos o método `toString` no mundo. Este método constrói uma seqüência de mapeamento de estado atual do mundo através da realização de um ciclo de duas dimensões sobre os quadrados na `grid`.

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

A parede é um objeto simples que é usado apenas para ocupar espaço e não tem nenhum método de ação.

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

## `This` e seu escopo

O construtor do mundo contém uma chamada de `forEach`. Uma coisa interessante que podemos notar é que dentro da função do `forEach` não estamos mais no escopo da função do construtor. Cada chamada de função recebe o seu próprio escopo de modo que o escopo presente na função interna não se refere ao objeto externo recém-construído. Na verdade quando a função não é chamada como um método isso refere ao objeto global.

Isso significa que não podemos escrever `this.grid` para acessar nada de fora de dentro do `loop`. Podemos criar uma variável local na função exterior da `grid`, onde a função interna tera acesso a ela.

Isso é um erro de `design` no JavaScript. Felizmente a próxima versão da linguagem irá fornecer uma solução para este problema. Enquanto isso existem soluções alternativas. Um padrão comum é dizer `var auto = this` uma variável local que guarda sua referencia.

Outra solução é usar o método de `bind` que nos permite oferecer uma chamada explícita para o objeto.

```js
var test = {
  prop: 10,
  addPropTo: function(array) {
    return array.map(function(elt) {
      return this.prop + elt;
    }.bind(this));
  }
};
console.log(test.addPropTo([5]));
// → [15]
```

A função mapeia um `array` e retorna o valor do `prop` que esta dentro do objeto  `test` somado ao resultado do valor de um elemento do `array`.

A maioria dos métodos que mapeam matrizes tais como `forEach` e `map`, tem um segundo argumento opcional que pode ser usado para fornecer um escopo para dentro do bloco de interação(segundo argumento do interador). Assim, você poderá expressar o exemplo anterior de uma forma um pouco mais simples.

```js
var test = {
  prop: 10,
  addPropTo: function(array) {
    return array.map(function(elt) {
      return this.prop + elt;
    }, this); // ← no bind
  }
};
console.log(test.addPropTo([5]));
// → [15]
```

Isso funciona apenas para as funções de interações que suportam tal parâmetro de contexto. Quando algum método não suporta receber um contexto você irá precisar usar as outras abordagens.

Em nossas próprias funções de interações podemos apoiar tal parâmetro de contexto enviando um segundo argumento no bloco. Por exemplo, aqui no método `forEach` para o nosso tipo de `grid`, chamaremos uma determinada função para cada elemento da `grid` que não seja nulo ou indefinido:

```js
Grid.prototype.forEach = function(f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null)
        f.call(context, value, new Vector(x, y));
    }
  }
};
```

## Dando vida

O próximo passo é escrever um método para o objeto mundo que dá aos bichos a chance de movimento. Ele vai passar por cima da `grid` usando o método `forEach` que acabamos de definir a procura de objetos com um método `act`. Quando ele encontra um ele chama o método para obter uma ação e realiza a ação quando ela for válida. Por enquanto apenas as ações `"move"` serão compreendidas.

Existe um problema com esta abordagem. Você consegue identificar? Se deixarmos as criaturas se mover livremente, eles podem se mover para um quadrado que não existe, e nós vamos permitir que eles se mova novamente quando estiver dentro do quadrado vázio. Assim temos que ficar mantendo uma variedade de criaturas que já sumiram ao invés de apenas ignorarmos.

```js
World.prototype.turn = function() {
  var acted = [];
  this.grid.forEach(function(critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
};
```

Nós usamos o contexto como segundo parâmetro no método `forEach` para ser a referência da `grid` para conseguirmos acessar corretamente as funções internas. O método `letAct` contém a lógica real que permite que os bichos se movam.

```js
World.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  if (action && action.type == "move") {
    var dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) == null) {
      this.grid.set(vector, null);
      this.grid.set(dest, critter);
    }
  }
};

World.prototype.checkDestination = function(action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest))
      return dest;
  }
};
```

Em primeiro lugar, nós simplesmente pedimos para o bicho se mover, passando um objeto de exibição que tem informações sobre o mundo e a posição atual do bicho naquele mundo(vamos definir a tela em algum momento). O método retorna alguma tipo de ação.

Se o tipo de ação não é um `"move"` ele será ignorado. Se é `"move"` ele terá uma propriedade de direção que se refere a um sentido válido caso o `quadrado` na direção referida estiver vazio(`null`). Iremos definir o bicho para o `quadrado` de destino e ao se mover novamente vamos definir `null` para este quadrado visitado e armazenar o bicho na próximo `quadrado`.

Perceba que `letAct` não ignora coisas que não fazem sentidos como, se a propriedade direção é válida ou se a propriedade do tipo faz sentido. Este tipo de programação defensiva faz sentido em algumas situações. A principal razão para fazê-la é validar alguma fonte proveniente que não seja de controle(como alguma entrada de valores definidas por usuários), mas também pode ser útil para isolar outros subsistemas. Neste caso a intenção é que os bichos podem serem programados de forma não cuidadosa, eles não têm de verificar se suas ações de destinado faz sentido. Eles podem simplesmente solicitar uma ação e o mundo que vai permitir a ação.

Estes dois métodos não fazem a parte da interface externa de um objeto do mundo. Eles são um detalhe interno. Algumas línguas fornece maneiras de declarar explicitamente certos métodos e propriedades privadas e sinalizar um erro quando você tenta usá-los de fora do objeto. JavaScript não faz isso então você vai ter que confiar em alguma outra forma de comunicação para descrever o que faz ou não parte da interface de um objeto. Às vezes ele pode ajudar a usar um esquema de nomes para distinguir entre as propriedades externas e internas, por exemplo, prefixando todas as propriedades internas com um caractere sublinhado(`_`). Isso fará com que os usos acidentais de propriedades que não fazem parte da interface de um objeto fique mais fácil de detectar.

A única parte que falta para a tela se parece com isso:

```js
function View(world, vector) {
  this.world = world;
  this.vector = vector;
}
View.prototype.look = function(dir) {
  var target = this.vector.plus(directions[dir]);
  if (this.world.grid.isInside(target))
    return charFromElement(this.world.grid.get(target));
  else
    return "#";
};
View.prototype.findAll = function(ch) {
  var found = [];
  for (var dir in directions)
    if (this.look(dir) == ch)
      found.push(dir);
  return found;
};
View.prototype.find = function(ch) {
  var found = this.findAll(ch);
  if (found.length == 0) return null;
  return randomElement(found);
};
```

O método observa e descobre se as coordenadas que estamos visitando esta dentro da `grid` e se o personagem correspondente ao elemento. Para coordenadas fora da `grid` podemos simplesmente fingir que há uma paredes no modo que podemos definir um mundo que não é murado mas os bichos não podera caminhar fora das bordas.

## O movimento

Nós instanciamos o objeto mundo antes. Agora que nós adicionamos todos os métodos necessários, devemos fazer os movimentos dos elementos no mundo.

```js
for (var i = 0; i < 5; i++) {
  world.turn();
  console.log(world.toString());
}
// → … five turns of moving critters
```

Imprimir várias cópias do mundo é uma forma bastante desagradável para movimentar um mundo. É por isso que o `sandbox` oferece uma função `animateWorld` que executa uma animação, movendo o mundo com três voltas por segundo até que você aperte o botão de `stop`.

```js
 animateWorld(world);
// → … life!
```

 A implementação do `animateWorld` parece algo mistérioso agora, mas depois que você ler os capítulos deste livro que discutem a integração JavaScript em navegadores web, ele não sera tão mágico.

 ## Mais formas de vida

O destaque dramático do nosso mundo é quando duas criaturas saltam para fora. Você consegue pensar em outra forma interessante de comportamento?

O bicho que se move ao longo das paredes. Conceitualmente o bicho mantém a sua mão esquerda(pata, tentáculo ou o que for) para a parede e segue junto a ela. Este jeito acaba sendo não muito trivial de implementar.

Precisamos ser capazes de calcular as direções com a bússola. As direções são modelados por um conjunto de `String`, precisamos definir nossa própria operação(`dirPlus`) para calcular as direções relativas. Então `dirPlus("n", 1)` significa 45 graus no sentido horário para norte quando retornar "ne". Da mesma forma `dirPlus("s", -2)` significa 90 graus para a esquerda ao sul retornando leste.

```js
function dirPlus(dir, n) {
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}

function WallFollower() {
  this.dir = "s";
}

WallFollower.prototype.act = function(view) {
  var start = this.dir;
  if (view.look(dirPlus(this.dir, -3)) != " ")
    start = this.dir = dirPlus(this.dir, -2);
  while (view.look(this.dir) != " ") {
    this.dir = dirPlus(this.dir, 1);
    if (this.dir == start) break;
  }
  return {type: "move", direction: this.dir};
};
```

O método `act` só `"varre"` os arredores do bicho a partir do seu lado esquerdo no sentido horário até encontrar um quadrado vazio. Em seguida ele se move na direção do quadrado vazia.

O que complica é que um bicho pode acabar no meio de um espaço vazio, quer como a sua posição de partida ou como um resultado de caminhar em torno de um outro bicho. Se aplicarmos a abordagem que acabei de descrever no espaço vazio o bicho vai apenas virar à esquerda a cada passo correndo em círculos.

Portanto, há uma verificação extra(instrução `if`) no inicio da digitalização para a esquerda para analisar se o bicho acaba de passar algum tipo de obstáculo, no caso, se o espaço atrás e à esquerda do bicho não estiver vazio. Caso contrário, o bicho começa a digitalizar diretamente à frente de modo que ele vai andar em linha reta ate um espaço vazio.

E finalmente há um teste comparando `this.dir` para começar após cada passagem do laço para se certificar de que o circuito não vai correr para sempre quando o bicho está no muro ou quando o mundo esta lotados de outros bichos não podendo achar quadrados vazios.

Este pequeno mundo demonstra as criaturas na parede:

```js
animateWorld(new World(
  ["############",
   "#     #    #",
   "#   ~    ~ #",
   "#  ##      #",
   "#  ##  o####",
   "#          #",
   "############"],
  {"#": Wall,
   "~": WallFollower,
   "o": BouncingCritter}
));
```