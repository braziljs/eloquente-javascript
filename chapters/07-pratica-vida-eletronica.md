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