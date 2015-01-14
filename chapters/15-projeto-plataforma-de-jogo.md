## Plataforma de jogo

> Toda realidade é um jogo.

> `Iain Banks, The Player of Games`

Meu fascínio inicial com computadores como o de muitas crianças originou-se com jogos. Fui convocado para o pequeno mundo simulado por computador que eu poderia manipular as histórias(mais ou menos) que iam se desenrolando-se, mas suponho por causa da maneira que eu poderia projetar a minha imaginação para eles do que pelas possibilidades que eles realmente tenha sido oferecido.

Eu não desejo uma carreira na programação com jogos a ninguém. Assim como a indústria da música a discrepância entre os muitos jovens ansiosos que querem trabalhar nela e a demanda real para essas pessoas cria um ambiente não muito saudável. Mas escrever jogos para se divertir é muito legal.

?????????
Este capítulo vai falar sobre da implementação de um jogo de plataforma simples. Jogos de Plataforma(ou jogos de "saltar e correr") são os jogos que esperam o jogador para mover uma figura através de um mundo, que muitas vezes é bidimensional e visto de lado , e fazer muitas saltar para e sobre as coisas.

#### O jogo

Nosso jogo será mais ou menos baseado em azul escuro por Thomas Palef. Eu escolhi este jogo porque é divertido e minimalista e porque pode ser construído sem muito código. Observe:

![image](http://i.imgur.com/JNqX4Y0.png)

A caixa escura representa o jogador cuja a tarefa é coletar as caixas amarelas(moedas) evitando o material vermelho(lava). Um nível é concluído quando todas as moedas forem recolhidos.

O jogador pode andar por aí com as setas do teclado para movimentar para esquerda, para a direita ou pular com a seta para cima. `Jumping` é uma especialidade deste personagem do jogo. Ela pode atingir várias vezes sua própria altura e é capaz de mudar de direção em pleno ar. Isto pode não ser inteiramente realista mas ajuda a dar ao jogador a sensação de estar no controle direto do avatar na tela.

O jogo consiste em um fundo fixo como uma grade e com os elementos que se deslocam sobreposta ao fundo. Cada campo na grade pode estar vazio, sólido ou ser uma lava. Os elementos móveis são os jogadores, moedas e alguns pedaços de lava. Ao contrário da simulação de vida artificial a partir do Capítulo 7 as posições destes elementos não são limitados à `grid` de suas coordenadas e pode ser fracionada permitindo movimento suave.

## A tecnologia

Nós vamos usar o DOM e o navegador para exibir o jogo e iremos ler a entrada do usuário por manipulação de eventos de tecla.

O código de triagem e relacionadas com o teclado é apenas uma pequena parte do trabalho que precisamos fazer para construir este jogo. A parte do desenho é simples uma vez que tudo parece colorido: criamos elementos no DOM e usamos `styling` para dar-lhes uma cor de fundo, tamanho e posição.

Podemos representar o fundo como uma tabela uma vez que é uma grade imutável de quadrados. Os elementos de movimento livre pode ser coberto em cima disso utilizando-se de posicionamentos absolutos.

Em jogos e outros programas que têm que animar gráficos e responder à entrada do usuário sem demora notável a eficiência é importante. Embora o DOM não foi originalmente projetado para gráficos de alto desempenho mas é o melhor que podemos esperar. Você viu algumas animações no capítulo 13. Em uma máquina moderna um jogo simples como este tem um bom desempenho mesmo se não estivermos pensando sobre otimização.

No próximo capítulo vamos explorar uma outra tecnologia de navegador a tag `<canvas>` o que proporciona uma forma mais tradicional para desenhar gráficos trabalhando em termos de formas e pixels em vez de elementos no DOM.

## Níveis

No Capítulo 7 usamos matrizes de seqüências para descrever uma grade bidimensional. Nós podemos fazer o mesmo aqui. Ele nos permitirá projetar níveis sem antes construir um editor de níveis.

A nível simples isto ficaria assim:

````js
var simpleLevelPlan = [
  "                      ",
  "                      ",
  "  x              = x  ",
  "  x         o o    x  ",
  "  x @      xxxxx   x  ",
  "  xxxxx            x  ",
  "      x!!!!!!!!!!!!x  ",
  "      xxxxxxxxxxxxxx  ",
  "                      "
];
````

Tanto a `grid` fixa e os elementos móveis são incluídos no plano. Os caracteres `x` representam paredes, os caracteres de espaço são para o `espaço vazio` e os `!` representam algo fixo(nonmoving) telhas de lava.

O `@` define o local onde o jogador começa. Todo `o` é uma moeda e o sinal de igual `=` representa um bloco de lava que se move para trás e para a frente na horizontal. Note-se que a grade para essas regras será definido para conter o espaço vazio e outra estrutura de dados é usado para rastrear a posição de tais elementos em movimento.

Vamos apoiar dois outros tipos de lava em movimento: O personagem pipe(`|`) para blocos que se deslocam verticalmente e `v` por gotejamento de lava verticalmente lava que não salta para trás e nem para a frente só se move para baixo pulando de volta à sua posição inicial quando atinge o chão.

Um jogo inteiro é composto por vários níveis que o jogador deve completar. Um nível é concluído quando todas as moedas foram recolhidos. Se o jogador toca a lava o nível atual é restaurado à sua posição inicial e o jogador pode tentar novamente.

## A leitura de um level

O construtor a seguir cria um objeto de nível. Seu argumento deve ser uma matriz de seqüências que define o nível.

````js
function Level(plan) {
  this.width = plan[0].length;
  this.height = plan.length;
  this.grid = [];
  this.actors = [];

  for (var y = 0; y < this.height; y++) {
    var line = plan[y], gridLine = [];
    for (var x = 0; x < this.width; x++) {
      var ch = line[x], fieldType = null;
      var Actor = actorChars[ch];
      if (Actor)
        this.actors.push(new Actor(new Vector(x, y), ch));
      else if (ch == "x")
        fieldType = "wall";
      else if (ch == "!")
        fieldType = "lava";
      gridLine.push(fieldType);
    }
    this.grid.push(gridLine);
  }

  this.player = this.actors.filter(function(actor) {
    return actor.type == "player";
  })[0];
  this.status = this.finishDelay = null;
}
````

Para deixar o código pequeno não verificamos entrada erradas. Ele assume que você sempre entregue um plano de level adequado, completo, com a posição de início do jogador e com outros itens essenciais.

Um level armazena a sua largura e altura juntamente com duas matrizes, uma para a grade e um para os agentes que são os elementos dinâmicos. A grade é representado como uma matriz de matrizes onde cada uma das séries internas representa uma linha horizontal e cada quadrado contém algo ou é nulo; para as casas vazias ou uma string indicaremos o tipo do quadrado("muro" ou "lava").

A matriz contém objetos que rastreiam a posição atual e estado dos elementos dinâmicos no level. Cada um deles deverá ter uma propriedade para indicar sua posição(as coordenadas do seu canto superior esquerdo), uma propriedade `size` dando o seu tamanho e uma propriedade do tipo que mantém uma cadeia que identifica o elemento("lava", "dinheiro" ou "jogador").

Depois de construir a `grid` usamos o método de filtro para encontrar o objeto jogador que nós armazenamos em uma propriedade do level. A propriedade `status` controla se o jogador ganhou ou perdeu. Quando isto acontece  `finishDelay` é usado para manter o nível ativo durante um curto período de tempo de modo que uma animação simples pode ser mostrado(Repor imediatamente ou avançar o nível ficaria mais fácil). Este método pode ser usado para descobrir se um nível foi concluído.

````js
Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};
````

## Atores

Para armazenar a posição e o tamanho de um ator vamos voltar para o nosso tipo Vector que agrupa uma coordenada `x` e `y` para coordenar um objeto.

````js
function Vector(x, y) {
  this.x = x; this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};
````

O método de escalas temporais de um vector por uma determinada quantidade . Isso será útil para quando precisarmos de multiplicar um vetor de velocidade por um intervalo de tempo para obter a distância percorrida durante esse tempo.

Na seção anterior o objeto `actorChars` foi usado pelo construtor `Level` para associar personagens com as funções do construtor. O objeto parece com isso:

````js
var actorChars = {
  "@": Player,
  "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};
````

Três personagens estão sendo mapeados para o objeto `Lava`. O construtor `Level` passa o caráter fonte do ator como o segundo argumento para o construtor e o construtor de `Lava` usa isso para ajustar o seu comportamento(saltando horizontalmente, saltando verticalmente ou gotejamento).

O tipo de jogador é construído da seguinte forma. A velocidade esta sendo armazenada como velocidade atual, que vai ajudar a simular movimento e gravidade.

````js
function Player(pos) {
  this.pos = pos.plus(new Vector(0, -0.5));
  this.size = new Vector(0.8, 1.5);
  this.speed = new Vector(0, 0);
}
Player.prototype.type = "player";
````

Como um jogador é quadrados elevados one-and-a-half, a sua posição inicial está sendo definida para ser a metade de um quadrado acima da posição em que o @ personagem apareceu. Desta forma a sua parte inferior fica alinhada com a parte inferior do quadrado que apareceu.

Ao construir um objeto `Lava` dinâmicamente é preciso inicializar o objeto de uma forma diferente dependendo do personagem que se baseia. `Lava Dinâmica` se move longitudinalmente em sua velocidade dada até atingir um obstáculo. Nesse ponto se ele tem uma propriedade `repeatPos` ele vai pular de volta à sua posição inicial(`gotejamento`) . Se isso não acontecer, ele irá inverter a sua velocidade e continuar no outro sentido(pular). O construtor só configura as propriedades necessárias. O método que faz o movimento real será escrito mais tarde.

````js
function Lava(pos, ch) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  if (ch == "=") {
    this.speed = new Vector(2, 0);
  } else if (ch == "|") {
    this.speed = new Vector(0, 2);
  } else if (ch == "v") {
    this.speed = new Vector(0, 3);
    this.repeatPos = pos;
  }
}
Lava.prototype.type = "lava";
````

Coin são atores simples. A maioria dos blocos simplesmente esperam em seus lugarares. Mas para animar o jogo um pouco eles recebem uma "oscilação", um ligeiro movimento para vertical e para trás. Para controlar isto um objecto `coin` armazena uma posição de base bem como uma propriedade que controla a oscilação de fase do movimento no salto. Juntos esses determinam a posição real da moeda(armazenado na propriedade pos).


````js
function Coin(pos) {
  this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
  this.size = new Vector(0.6, 0.6);
  this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";
````

No capítulo 13 vimos que `Math.sin` nos dá a coordenada y de um ponto em um círculo. Isso para coordenar um vai e volta em forma de onda suave à medida que avançamos o círculo, a função `seno` se torna útil para a modelagem de um movimento ondulatório .

Para evitar uma situação em que todas as moedas se movem para cima ou para baixo de forma síncrona, a fase inicial de cada moeda é aleatória. A fase da onda de `Math.Sin` a largura de uma onda que produz é de 2π. Multiplicamos o valor retornado pelo `Math.random` por esse número para dar a posição inicial de uma moeda de forma aleatória.

Vamos agora ter escrito todas as peças necessárias para representar o nível do estado.

 ````js
var simpleLevel = new Level(simpleLevelPlan);
console.log(simpleLevel.width, "by", simpleLevel.height);
// → 22 by 9
 ````

 A tarefa à frente deve exibir tais níveis na tela, e assim modelar o tempo do movimento dentre deles.