{{meta {load_files: ["code/chapter/16_game.js", "code/levels.js", "code/_stop_keys.js"], zip: "html include=[\"css/game.css\"]"}}}

# Projeto: Um Jogo de Plataforma

{{quote {author: "Iain Banks", title: "The Player of Games", chapter: true}

All reality is a game.

quote}}

{{index "Banks, Iain", "project chapter", simulation}}

{{figure {url: "img/chapter_picture_16.jpg", alt: "Illustration showing a computer game character jumping over lava in a two dimensional world", chapter: "framed"}}}

Muito do meu fascínio inicial com computadores, como o de muitas crianças nerds, tinha a ver com ((jogo))s de computador. Eu era atraído pelos minúsculos ((mundo))s simulados que eu podia manipular e nos quais histórias (mais ou menos) se desenrolavam — mais, suponho, por causa da forma como eu projetava minha ((imaginação)) neles do que por causa das possibilidades que eles realmente ofereciam.

Não desejo uma ((carreira)) em programação de jogos a ninguém. Assim como na indústria da ((música)), a discrepância entre o número de jovens ávidos querendo trabalhar nela e a demanda real por tais pessoas cria um ambiente bastante insalubre. Mas escrever jogos por diversão é divertido.

{{index "jump-and-run game", dimensions}}

Este capítulo vai percorrer a implementação de um pequeno ((jogo de plataforma)). Jogos de plataforma (ou jogos de "pular e correr") são jogos que esperam que o ((jogador)) mova uma figura através de um ((mundo)), que geralmente é bidimensional e visto de lado, enquanto pula sobre e em cima de coisas.

## O jogo

{{index minimalism, "Palef, Thomas", "Dark Blue (game)"}}

Nosso ((jogo)) será vagamente baseado em [Dark Blue](http://www.lessmilk.com/games/10)[ (_www.lessmilk.com/games/10_)]{if book} de Thomas Palef. Escolhi esse jogo porque é tanto divertido quanto minimalista e porque pode ser construído sem muito ((código)). Ele se parece com isto:

{{figure {url: "img/darkblue.png", alt: "Screenshot of the 'Dark Blue' game, showing a world made out of colored boxes. There's a black box representing the player, standing on lines of white against a blue background. Small yellow coins float in the air, and some parts of the background are red, representing lava."}}}

{{index coin, lava}}

A ((caixa)) escura representa o ((jogador)), cuja tarefa é coletar as caixas amarelas (moedas) enquanto evita o material vermelho (lava). Um ((nível)) é completado quando todas as moedas são coletadas.

{{index keyboard, jumping}}

O jogador pode andar com as teclas de seta esquerda e direita e pode pular com a seta para cima. Pular é a especialidade desse personagem de jogo. Ele pode alcançar várias vezes sua própria altura e pode mudar de direção no ar. Isso pode não ser totalmente realista, mas ajuda a dar ao jogador a sensação de estar no controle direto do ((avatar)) na tela.

{{index "fractional number", discretization, "artificial life", "electronic life"}}

O ((jogo)) consiste em um ((fundo)) estático, disposto como uma ((grade)), com os elementos móveis sobrepostos nesse fundo. Cada campo na grade é vazio, sólido ou ((lava)). Os elementos móveis são o jogador, moedas e certos pedaços de lava. As posições desses elementos não são restritas à grade — suas coordenadas podem ser fracionárias, permitindo ((movimentação)) suave.

## A tecnologia

{{index "event handling", keyboard, [DOM, graphics]}}

Usaremos o ((DOM)) do ((navegador)) para exibir o jogo, e leremos a entrada do usuário manipulando eventos de tecla.

{{index rectangle, "background (CSS)", "position (CSS)", graphics}}

O código relacionado à tela e ao teclado é apenas uma pequena parte do trabalho que precisamos fazer para construir este ((jogo)). Como tudo parece ((caixa))s coloridas, desenhar é descomplicado: criamos elementos DOM e usamos estilos para dar a eles uma cor de fundo, tamanho e posição.

{{index "table (HTML tag)"}}

Podemos representar o fundo como uma tabela, já que é uma ((grade)) imutável de quadrados. Os elementos de movimento livre podem ser sobrepostos usando elementos posicionados absolutamente.

{{index performance, [DOM, graphics]}}

Em jogos e outros programas que devem animar ((gráficos)) e responder à ((entrada)) do usuário sem atraso perceptível, ((eficiência)) é importante. Embora o DOM não tenha sido originalmente projetado para gráficos de alto desempenho, ele é na verdade melhor nisso do que você esperaria. Você viu algumas ((animação))ões no [Capítulo ?](dom#animation). Em uma máquina moderna, um jogo simples como este funciona bem, mesmo que não nos preocupemos muito com ((otimização)).

{{index canvas, [DOM, graphics]}}

No [próximo capítulo](canvas), exploraremos outra tecnologia de ((navegador)), a tag `<canvas>`, que fornece uma forma mais tradicional de desenhar gráficos, trabalhando em termos de formas e ((pixel))s em vez de elementos DOM.

## Níveis

{{index dimensions}}

Vamos querer uma forma legível por humanos e editável por humanos de especificar níveis. Como está tudo bem que tudo comece em uma grade, poderíamos usar strings grandes nas quais cada caractere representa um elemento — ou uma parte da grade de fundo ou um elemento móvel.

O plano para um nível pequeno pode se parecer com isto:

```{includeCode: true}
let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;
```

{{index level}}

Pontos são espaço vazio, caracteres cerquilha (`#`) são paredes e sinais de mais são lava. A posição inicial do ((jogador)) é o ((arroba)) (`@`). Cada caractere O é uma moeda, e o sinal de igual (`=`) no topo é um bloco de lava que se move horizontalmente para frente e para trás.

{{index bouncing}}

Suportaremos dois tipos adicionais de ((lava)) móvel: o caractere de barra vertical (`|`) cria bolhas que se movem verticalmente, e `v` indica lava _gotejante_ — lava que se move verticalmente e não quica para frente e para trás, mas apenas se move para baixo, voltando à sua posição inicial quando atinge o chão.

Um ((jogo)) inteiro consiste em múltiplos ((nível))eis que o ((jogador)) deve completar. Um nível é completado quando todas as ((moeda))s são coletadas. Se o jogador tocar a ((lava)), o nível atual é restaurado à sua posição inicial, e o jogador pode tentar novamente.

{{id level}}

## Lendo um nível

{{index "Level class"}}

A ((classe)) a seguir armazena um objeto de ((nível)). Seu argumento deve ser a string que define o nível.

```{includeCode: true}
class Level {
  constructor(plan) {
    let rows = plan.trim().split("\n").map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type != "string") {
          let pos = new Vec(x, y);
          this.startActors.push(type.create(pos, ch));
          type = "empty";
        }
        return type;
      });
    });
  }
}
```

{{index "trim method", "split method", [whitespace, trimming]}}

O método `trim` é usado para remover espaço em branco no início e no final da string do plano. Isso permite que nosso plano de exemplo comece com uma nova linha para que todas as linhas fiquem diretamente abaixo umas das outras. A string restante é dividida em caracteres de ((nova linha)), e cada linha é espalhada em um array, produzindo arrays de caracteres.

{{index [array, "as matrix"]}}

Então `rows` contém um array de arrays de caracteres, as linhas do plano. Podemos derivar a largura e altura do nível a partir deles. Mas ainda precisamos separar os elementos móveis da grade de fundo. Chamaremos os elementos móveis de _atores_. Eles serão armazenados em um array de objetos. O fundo será um array de arrays de strings, contendo tipos de campo como `"empty"`, `"wall"` ou `"lava"`.

{{index "map method"}}

Para criar esses arrays, mapeamos sobre as linhas e depois sobre seu conteúdo. Lembre-se que `map` passa o índice do array como segundo argumento para a função de mapeamento, que nos diz as coordenadas x e y de um dado caractere. Posições no jogo serão armazenadas como pares de coordenadas, com o canto superior esquerdo sendo 0,0 e cada quadrado de fundo tendo 1 unidade de altura e largura.

{{index "static method"}}

Para interpretar os caracteres no plano, o construtor de `Level` usa o objeto `levelChars`, que, para cada caractere usado nas descrições de nível, contém uma string se é um tipo de fundo, e uma classe se produz um ator. Quando `type` é uma classe de ator, seu método estático `create` é usado para criar um objeto, que é adicionado a `startActors`, e a função de mapeamento retorna `"empty"` para esse quadrado de fundo.

{{index "Vec class"}}

A posição do ator é armazenada como um objeto `Vec`. Este é um vetor bidimensional, um objeto com propriedades `x` e `y`, como visto nos exercícios do [Capítulo ?](object#exercise_vector).

{{index [state, in objects]}}

Conforme o jogo roda, atores acabarão em posições diferentes ou até desaparecerão completamente (como moedas ao serem coletadas). Usaremos uma classe `State` para rastrear o estado de um jogo em execução.

```{includeCode: true}
class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find(a => a.type == "player");
  }
}
```

A propriedade `status` mudará para `"lost"` ou `"won"` quando o jogo terminar.

Esta é novamente uma estrutura de dados persistente — atualizar o estado do jogo cria um novo estado e deixa o antigo intacto.

## Atores

{{index actor, "Vec class", [interface, object]}}

Objetos de ator representam a posição atual e o estado de um dado elemento móvel (jogador, moeda ou lava móvel) em nosso jogo. Todos os objetos de ator se conformam à mesma interface. Eles têm propriedades `size` e `pos` contendo o tamanho e as coordenadas do canto superior esquerdo do retângulo representando esse ator, e um método `update`.

Esse método `update` é usado para calcular o novo estado e posição deles após um dado passo de tempo. Ele simula a coisa que o ator faz — mover em resposta às teclas de seta para o jogador e quicar para frente e para trás para a lava — e retorna um novo objeto de ator atualizado.

Uma propriedade `type` contém uma string que identifica o tipo do ator — `"player"`, `"coin"` ou `"lava"`. Isso é útil ao desenhar o jogo — a aparência do retângulo desenhado para um ator é baseada em seu tipo.

Classes de ator têm um método estático `create` que é usado pelo construtor de `Level` para criar um ator a partir de um caractere no plano do nível. Recebe as coordenadas do caractere e o próprio caractere, o que é necessário porque a classe `Lava` lida com vários caracteres diferentes.

{{id vector}}

Esta é a classe `Vec` que usaremos para nossos valores bidimensionais, como a posição e o tamanho dos atores.

```{includeCode: true}
class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}
```

{{index "times method", multiplication}}

O método `times` escala um vetor por um dado número. Será útil quando precisarmos multiplicar um vetor de velocidade por um intervalo de tempo para obter a distância percorrida durante esse tempo.

Os diferentes tipos de atores têm suas próprias classes, já que seus comportamentos são muito diferentes. Vamos definir essas classes. Chegaremos aos seus métodos `update` mais tarde.

{{index simulation, "Player class"}}

A classe do jogador tem uma propriedade `speed` que armazena sua velocidade atual para simular momentum e gravidade.

```{includeCode: true}
class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() { return "player"; }

  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)),
                      new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(0.8, 1.5);
```

Como um jogador tem um quadrado e meio de altura, sua posição inicial é definida para ficar meio quadrado acima da posição onde o caractere `@` apareceu. Dessa forma, sua parte inferior se alinha com o fundo do quadrado onde apareceu.

A propriedade `size` é a mesma para todas as instâncias de `Player`, então a armazenamos no protótipo em vez das instâncias. Poderíamos ter usado um ((getter)) como `type`, mas isso criaria e retornaria um novo objeto `Vec` toda vez que a propriedade fosse lida, o que seria desperdício. (Strings, sendo ((imutáveis)), não precisam ser recriadas toda vez que são avaliadas.)

{{index "Lava class", bouncing}}

Ao construir um ator `Lava`, precisamos inicializar o objeto de forma diferente dependendo do caractere no qual ele se baseia. Lava dinâmica se move à sua velocidade atual até atingir um obstáculo. Nesse ponto, se tiver uma propriedade `reset`, ela voltará à sua posição inicial (gotejante). Se não tiver, ela inverterá sua velocidade e continuará na outra direção (quicante).

O método `create` observa o caractere que o construtor de `Level` passa e cria o ator de lava apropriado.

```{includeCode: true}
class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() { return "lava"; }

  static create(pos, ch) {
    if (ch == "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}

Lava.prototype.size = new Vec(1, 1);
```

{{index "Coin class", animation}}

Atores `Coin` são relativamente simples. Eles na maior parte apenas ficam em seu lugar. Mas para animar um pouco o jogo, eles recebem uma "oscilação", um leve movimento vertical para frente e para trás. Para rastrear isso, um objeto de moeda armazena uma posição base assim como uma propriedade `wobble` que rastreia a ((fase)) do movimento de oscilação. Juntas, estas determinam a posição real da moeda (armazenada na propriedade `pos`).

```{includeCode: true}
class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type() { return "coin"; }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos,
                    Math.random() * Math.PI * 2);
  }
}

Coin.prototype.size = new Vec(0.6, 0.6);
```

{{index "Math.random function", "random number", "Math.sin function", sine, wave}}

No [Capítulo ?](dom#sin_cos), vimos que `Math.sin` nos dá a coordenada y de um ponto em um círculo. Essa coordenada vai para frente e para trás em uma forma de onda suave conforme nos movemos pelo círculo, o que torna a função seno útil para modelar um movimento ondulatório.

{{index pi}}

Para evitar uma situação em que todas as moedas se movam para cima e para baixo sincronizadamente, a fase inicial de cada moeda é aleatória. O período da onda de `Math.sin`, a largura de uma onda que ela produz, é 2π. Multiplicamos o valor retornado por `Math.random` por esse número para dar à moeda uma posição inicial aleatória na onda.

{{index map, [object, "as map"]}}

Agora podemos definir o objeto `levelChars` que mapeia caracteres do plano para tipos de grade de fundo ou classes de ator.

```{includeCode: true}
const levelChars = {
  ".": "empty", "#": "wall", "+": "lava",
  "@": Player, "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};
```

Isso nos dá todas as partes necessárias para criar uma instância de `Level`.

```{includeCode: strip_log}
let simpleLevel = new Level(simpleLevelPlan);
console.log(`${simpleLevel.width} by ${simpleLevel.height}`);
// → 22 by 9
```

A tarefa à frente é exibir tais níveis na tela e modelar tempo e movimento dentro deles.

{{id domdisplay}}

## Desenhando

{{index graphics, encapsulation, "DOMDisplay class", [DOM, graphics]}}

No [próximo capítulo](canvas#canvasdisplay), vamos ((exibir)) o mesmo jogo de forma diferente. Para tornar isso possível, colocamos a lógica de desenho atrás de uma interface e a passamos ao jogo como argumento. Dessa forma, podemos usar o mesmo programa de jogo com diferentes ((módulo))s de exibição novos.

Um objeto de exibição do jogo desenha um dado ((nível)) e estado. Passamos seu construtor ao jogo para permitir que ele seja substituído. A classe de exibição que definimos neste capítulo é chamada `DOMDisplay` porque usa elementos DOM para mostrar o nível.

{{index "style attribute", CSS}}

Usaremos uma folha de estilo para definir as cores reais e outras propriedades fixas dos elementos que compõem o jogo. Também seria possível atribuir diretamente à propriedade `style` dos elementos quando os criamos, mas isso produziria programas mais verbosos.

{{index "class attribute"}}

A função auxiliar a seguir fornece uma forma sucinta de criar um elemento e dar a ele alguns atributos e nós filhos:

```{includeCode: true}
function elt(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}
```

Uma exibição é criada dando a ela um elemento pai ao qual deve se anexar e um objeto de ((nível)).

```{includeCode: true}
class DOMDisplay {
  constructor(parent, level) {
    this.dom = elt("div", {class: "game"}, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() { this.dom.remove(); }
}
```

{{index level}}

A grade de ((fundo)) do nível, que nunca muda, é desenhada uma vez. Atores são redesenhados toda vez que a exibição é atualizada com um dado estado. A propriedade `actorLayer` será usada para rastrear o elemento que contém os atores para que possam ser facilmente removidos e substituídos.

{{index scaling, "DOMDisplay class"}}

Nossas ((coordenadas)) e tamanhos são rastreados em unidades de ((grade)), onde um tamanho ou distância de 1 significa um bloco de grade. Ao definir tamanhos em ((pixel))s, teremos que escalar essas coordenadas — tudo no jogo seria ridiculamente pequeno com um único pixel por quadrado. A constante `scale` dá o número de pixels que uma única unidade ocupa na tela.

```{includeCode: true}
const scale = 20;

function drawGrid(level) {
  return elt("table", {
    class: "background",
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    elt("tr", {style: `height: ${scale}px`},
        ...row.map(type => elt("td", {class: type})))
  ));
}
```

{{index "table (HTML tag)", "tr (HTML tag)", "td (HTML tag)", "spread operator"}}

A forma do elemento `<table>` corresponde bem à estrutura da propriedade `rows` do nível — cada linha da grade é transformada em uma linha de tabela (elemento `<tr>`). As strings na grade são usadas como nomes de classe para os elementos de célula de tabela (`<td>`). O código usa o operador spread (três pontos) para passar arrays de nós filhos para `elt` como argumentos separados.

{{id game_css}}

O seguinte ((CSS)) faz a tabela parecer com o fundo que queremos:

```{lang: "css"}
.background    { background: rgb(52, 166, 251);
                 table-layout: fixed;
                 border-spacing: 0;              }
.background td { padding: 0;                     }
.lava          { background: rgb(255, 100, 100); }
.wall          { background: white;              }
```

{{index "padding (CSS)"}}

Alguns desses (`table-layout`, `border-spacing` e `padding`) são usados para suprimir comportamento padrão indesejado. Não queremos que o layout da ((tabela)) dependa do conteúdo de suas células, e não queremos espaço entre as células da ((tabela)) ou padding dentro delas.

{{index "background (CSS)", "rgb (CSS)", CSS}}

A regra `background` define a cor de fundo. CSS permite que cores sejam especificadas tanto como palavras (`white`) ou com um formato como `rgb(R, G, B)`, onde os componentes vermelho, verde e azul da cor são separados em três números de 0 a 255. Em `rgb(52, 166, 251)`, o componente vermelho é 52, verde é 166 e azul é 251. Como o componente azul é o maior, a cor resultante será azulada. Na regra `.lava`, o primeiro número (vermelho) é o maior.

{{index [DOM, graphics]}}

Desenhamos cada ((ator)) criando um elemento DOM para ele e definindo a posição e tamanho desse elemento com base nas propriedades do ator. Os valores devem ser multiplicados por `scale` para ir de unidades de jogo para pixels.

```{includeCode: true}
function drawActors(actors) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", {class: `actor ${actor.type}`});
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}
```

{{index "position (CSS)", "class attribute"}}

Para dar a um elemento mais de uma classe, separamos os nomes das classes por espaços. No código ((CSS)) a seguir, a classe `actor` dá aos atores sua posição absoluta. O nome do tipo é usado como classe extra para dar a eles uma cor. Não precisamos definir a classe `lava` novamente porque estamos reutilizando a classe para os quadrados de lava na grade que definimos anteriormente.

```{lang: "css"}
.actor  { position: absolute;            }
.coin   { background: rgb(241, 229, 89); }
.player { background: rgb(64, 64, 64);   }
```

{{index graphics, optimization, efficiency, [state, "of application"], [DOM, graphics]}}

O método `syncState` é usado para fazer a exibição mostrar um dado estado. Ele primeiro remove os gráficos antigos dos atores, se houver, e depois redesenha os atores em suas novas posições. Pode ser tentador tentar reutilizar os elementos DOM para atores, mas para fazer isso funcionar, precisaríamos de muita contabilidade adicional para associar atores a elementos DOM e garantir que removemos elementos quando seus atores desaparecem. Como tipicamente haverá apenas um punhado de atores no jogo, redesenhar todos eles não é custoso.

```{includeCode: true}
DOMDisplay.prototype.syncState = function(state) {
  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};
```

{{index level, "class attribute"}}

Ao adicionar o status atual do nível como nome de classe ao wrapper, podemos estilizar o ator do jogador de forma ligeiramente diferente quando o jogo é vencido ou perdido adicionando uma regra ((CSS)) que tem efeito apenas quando o jogador tem um ((elemento ancestral)) com uma dada classe.

```{lang: "css"}
.lost .player {
  background: rgb(160, 64, 64);
}
.won .player {
  box-shadow: -4px -7px 8px white, 4px -7px 8px white;
}
```

{{index player, "box shadow (CSS)"}}

Após tocar ((lava)), o jogador fica vermelho escuro, sugerindo que foi chamuscado. Quando a última moeda é coletada, adicionamos duas sombras brancas borradas — uma para o canto superior esquerdo e outra para o superior direito — para criar um efeito de halo branco.

{{id viewport}}

{{index "position (CSS)", "max-width (CSS)", "overflow (CSS)", "max-height (CSS)", viewport, scrolling, [DOM, graphics]}}

Não podemos assumir que o nível sempre cabe no _viewport_, o elemento no qual desenhamos o jogo. É por isso que precisamos da chamada `scrollPlayerIntoView`: ela garante que se o nível está transbordando para fora do viewport, rolamos esse viewport para garantir que o jogador esteja perto de seu centro. O ((CSS)) a seguir dá ao elemento DOM wrapper do jogo um tamanho máximo e garante que qualquer coisa que saia da caixa do elemento não seja visível. Também damos a ele uma posição relativa para que os atores dentro dele sejam posicionados em relação ao canto superior esquerdo do nível.

```{lang: css}
.game {
  overflow: hidden;
  max-width: 600px;
  max-height: 450px;
  position: relative;
}
```

{{index scrolling}}

No método `scrollPlayerIntoView`, encontramos a posição do jogador e atualizamos a posição de rolagem do elemento wrapper. Mudamos a posição de rolagem manipulando as propriedades `scrollLeft` e `scrollTop` desse elemento quando o jogador está muito perto da borda.

```{includeCode: true}
DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;

  // O viewport
  let left = this.dom.scrollLeft, right = left + width;
  let top = this.dom.scrollTop, bottom = top + height;

  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5))
                         .times(scale);

  if (center.x < left + margin) {
    this.dom.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width;
  }
  if (center.y < top + margin) {
    this.dom.scrollTop = center.y - margin;
  } else if (center.y > bottom - margin) {
    this.dom.scrollTop = center.y + margin - height;
  }
};
```

{{index center, coordinates, readability}}

A forma como o centro do jogador é encontrado mostra como os métodos em nosso tipo `Vec` permitem que cálculos com objetos sejam escritos de forma relativamente legível. Para encontrar o centro do ator, adicionamos sua posição (seu canto superior esquerdo) e metade de seu tamanho. Esse é o centro em coordenadas de nível, mas precisamos dele em coordenadas de pixel, então multiplicamos o vetor resultante pela escala de exibição.

{{index validation}}

Em seguida, uma série de verificações confirma que a posição do jogador não está fora da faixa permitida. Note que às vezes isso definirá coordenadas de rolagem sem sentido que estão abaixo de zero ou além da área rolável do elemento. Isso é aceitável — o DOM as restringirá a valores aceitáveis. Definir `scrollLeft` como `-10` fará com que se torne `0`.

Embora fosse ligeiramente mais simples sempre tentar rolar o jogador para o centro do ((viewport)), isso cria um efeito bastante brusco. Conforme você pula, a visão constantemente se desloca para cima e para baixo. É mais agradável ter uma área "neutra" no meio da tela onde você pode se mover sem causar rolagem.

{{index [game, screenshot]}}

Agora podemos exibir nosso pequeno nível.

```{lang: html}
<link rel="stylesheet" href="css/game.css">

<script>
  let simpleLevel = new Level(simpleLevelPlan);
  let display = new DOMDisplay(document.body, simpleLevel);
  display.syncState(State.start(simpleLevel));
</script>
```

{{if book

{{figure {url: "img/game_simpleLevel.png", alt: "Screenshot of the rendered level", width: "7cm"}}}

if}}

{{index "link (HTML tag)", CSS}}

A tag `<link>`, quando usada com `rel="stylesheet"`, é uma forma de carregar um arquivo CSS em uma página. O arquivo `game.css` contém os estilos necessários para nosso jogo.

## Movimento e colisão

{{index physics, [animation, "platform game"]}}

Agora estamos no ponto em que podemos começar a adicionar movimento. A abordagem básica adotada pela maioria dos jogos como este é dividir o ((tempo)) em pequenos passos e, para cada passo, mover os atores por uma distância correspondente à sua velocidade multiplicada pelo tamanho do passo de tempo. Mediremos o tempo em segundos, então velocidades são expressas em unidades por segundo.

{{index obstacle, "collision detection"}}

Mover coisas é fácil. A parte difícil é lidar com as interações entre os elementos. Quando o jogador atinge uma parede ou chão, ele não deve simplesmente passar através dela. O jogo deve notar quando um dado movimento faz um objeto atingir outro objeto e responder de acordo. Para paredes, o movimento deve ser interrompido. Ao atingir uma moeda, essa moeda deve ser coletada. Ao tocar lava, o jogo deve ser perdido.

Resolver isso para o caso geral é uma tarefa importante. Você pode encontrar bibliotecas, geralmente chamadas de _((motor de física))_, que simulam interação entre objetos físicos em duas ou três ((dimensões)). Adotaremos uma abordagem mais modesta neste capítulo, lidando apenas com colisões entre objetos retangulares e de forma bastante simplista.

{{index bouncing, "collision detection", [animation, "platform game"]}}

Antes de mover o ((jogador)) ou um bloco de ((lava)), testamos se o movimento o levaria para dentro de uma parede. Se levar, simplesmente cancelamos o movimento por completo. A resposta a tal colisão depende do tipo de ator — o jogador irá parar, enquanto um bloco de lava quicará para trás.

{{index discretization}}

Essa abordagem requer que nossos passos de ((tempo)) sejam bastante pequenos, já que fará o movimento parar antes que os objetos realmente se toquem. Se os passos de tempo (e portanto os passos de movimento) forem muito grandes, o jogador acabaria pairando a uma distância perceptível acima do chão. Outra abordagem, possivelmente melhor mas mais complicada, seria encontrar o ponto exato de colisão e mover até lá. Adotaremos a abordagem simples e esconderemos seus problemas garantindo que a animação proceda em passos pequenos.

{{index obstacle, "touches method", "collision detection"}}

{{id touches}}

Este método nos diz se um ((retângulo)) (especificado por uma posição e um tamanho) toca um elemento da grade do tipo dado.

```{includeCode: true}
Level.prototype.touches = function(pos, size, type) {
  let xStart = Math.floor(pos.x);
  let xEnd = Math.ceil(pos.x + size.x);
  let yStart = Math.floor(pos.y);
  let yEnd = Math.ceil(pos.y + size.y);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width ||
                      y < 0 || y >= this.height;
      let here = isOutside ? "wall" : this.rows[y][x];
      if (here == type) return true;
    }
  }
  return false;
};
```

{{index "Math.floor function", "Math.ceil function"}}

O método calcula o conjunto de quadrados da grade que o corpo ((sobrepõe)) usando `Math.floor` e `Math.ceil` em suas ((coordenadas)). Lembre-se que quadrados da ((grade)) têm 1 por 1 unidade de tamanho. Ao ((arredondar)) os lados de uma caixa para cima e para baixo, obtemos a faixa de quadrados de ((fundo)) que a caixa toca.

{{figure {url: "img/game-grid.svg", alt: "Diagram showing a grid with a black box overlaid on it. All of the grid squares that are partially covered by the block are marked.", width: "3cm"}}}

Percorremos o bloco de quadrados da ((grade)) encontrado pelo ((arredondamento)) das ((coordenadas)) e retornamos `true` quando um quadrado correspondente é encontrado. Quadrados fora do nível são sempre tratados como `"wall"` para garantir que o jogador não possa sair do mundo e que não tentaremos acidentalmente ler fora dos limites do nosso array `rows`.

O método `update` do estado usa `touches` para descobrir se o jogador está tocando lava.

```{includeCode: true}
State.prototype.update = function(time, keys) {
  let actors = this.actors
    .map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status != "playing") return newState;

  let player = newState.player;
  if (this.level.touches(player.pos, player.size, "lava")) {
    return new State(this.level, actors, "lost");
  }

  for (let actor of actors) {
    if (actor != player && overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
};
```

O método recebe um passo de tempo e uma estrutura de dados que informa quais teclas estão sendo pressionadas. A primeira coisa que faz é chamar o método `update` em todos os atores, produzindo um array de atores atualizados. Os atores também recebem o passo de tempo, as teclas e o estado para que possam basear sua atualização neles. Apenas o jogador realmente lerá as teclas, já que é o único ator controlado pelo teclado.

Se o jogo já acabou, nenhum processamento adicional precisa ser feito (o jogo não pode ser vencido depois de ser perdido, ou vice-versa). Caso contrário, o método testa se o jogador está tocando lava de fundo. Se estiver, o jogo está perdido e terminamos. Finalmente, se o jogo realmente ainda está em andamento, ele verifica se algum outro ator se sobrepõe ao jogador.

A sobreposição entre atores é detectada com a função `overlap`. Ela recebe dois objetos de ator e retorna `true` quando eles se tocam — o que é o caso quando se sobrepõem tanto ao longo do eixo x quanto do eixo y.

```{includeCode: true}
function overlap(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
         actor1.pos.x < actor2.pos.x + actor2.size.x &&
         actor1.pos.y + actor1.size.y > actor2.pos.y &&
         actor1.pos.y < actor2.pos.y + actor2.size.y;
}
```

Se algum ator se sobrepõe, seu método `collide` tem a chance de atualizar o estado. Tocar um ator de lava define o status do jogo como `"lost"`. Moedas desaparecem quando você as toca e definem o status como `"won"` quando são a última moeda do nível.

```{includeCode: true}
Lava.prototype.collide = function(state) {
  return new State(state.level, state.actors, "lost");
};

Coin.prototype.collide = function(state) {
  let filtered = state.actors.filter(a => a != this);
  let status = state.status;
  if (!filtered.some(a => a.type == "coin")) status = "won";
  return new State(state.level, filtered, status);
};
```

{{id actors}}

## Atualizações dos atores

{{index actor, "Lava class", lava}}

Os métodos `update` dos objetos de ator recebem como argumentos o passo de tempo, o objeto de estado e um objeto `keys`. O do tipo de ator `Lava` ignora o objeto `keys`.

```{includeCode: true}
Lava.prototype.update = function(time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "wall")) {
    return new Lava(newPos, this.speed, this.reset);
  } else if (this.reset) {
    return new Lava(this.reset, this.speed, this.reset);
  } else {
    return new Lava(this.pos, this.speed.times(-1));
  }
};
```

{{index bouncing, multiplication, "Vec class", "collision detection"}}

Este método `update` calcula uma nova posição adicionando o produto do passo de ((tempo)) e a velocidade atual à sua posição antiga. Se nenhum obstáculo bloqueia essa nova posição, ele se move para lá. Se houver um obstáculo, o comportamento depende do tipo do bloco de ((lava)) — lava gotejante tem uma posição `reset`, para a qual ela volta quando atinge algo. Lava quicante inverte sua velocidade multiplicando-a por `-1` para que comece a se mover na direção oposta.

{{index "Coin class", coin, wave}}

Moedas usam seu método `update` para oscilar. Elas ignoram colisões com a grade, já que estão simplesmente oscilando dentro de seu próprio quadrado.

```{includeCode: true}
const wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.update = function(time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
                  this.basePos, wobble);
};
```

{{index "Math.sin function", sine, phase}}

A propriedade `wobble` é incrementada para rastrear o tempo e depois usada como argumento para `Math.sin` para encontrar a nova posição na ((onda)). A posição atual da moeda é então calculada a partir de sua posição base e um deslocamento baseado nessa onda.

{{index "collision detection", "Player class"}}

Isso deixa o próprio ((jogador)). O movimento do jogador é tratado separadamente por ((eixo)) porque atingir o chão não deve impedir o movimento horizontal, e atingir uma parede não deve parar o movimento de queda ou salto.

```{includeCode: true}
const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.update = function(time, state, keys) {
  let xSpeed = 0;
  if (keys.ArrowLeft) xSpeed -= playerXSpeed;
  if (keys.ArrowRight) xSpeed += playerXSpeed;
  let pos = this.pos;
  let movedX = pos.plus(new Vec(xSpeed * time, 0));
  if (!state.level.touches(movedX, this.size, "wall")) {
    pos = movedX;
  }

  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vec(0, ySpeed * time));
  if (!state.level.touches(movedY, this.size, "wall")) {
    pos = movedY;
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -jumpSpeed;
  } else {
    ySpeed = 0;
  }
  return new Player(pos, new Vec(xSpeed, ySpeed));
};
```

{{index [animation, "platform game"], keyboard}}

O movimento horizontal é calculado com base no estado das teclas de seta esquerda e direita. Quando não há parede bloqueando a nova posição criada por esse movimento, ela é usada. Caso contrário, a posição antiga é mantida.

{{index acceleration, physics}}

O movimento vertical funciona de forma similar, mas precisa simular ((salto)) e ((gravidade)). A velocidade vertical do jogador (`ySpeed`) é primeiro acelerada para levar em conta a ((gravidade)).

{{index "collision detection", keyboard, jumping}}

Verificamos paredes novamente. Se não atingimos nenhuma, a nova posição é usada. Se _houver_ uma parede, existem dois resultados possíveis. Quando a seta para cima está pressionada _e_ estamos nos movendo para baixo (significando que a coisa que atingimos está abaixo de nós), a velocidade é definida como um valor relativamente grande e negativo. Isso faz o jogador pular. Se não for o caso, o jogador simplesmente bateu em algo, e a velocidade é definida como zero.

A força da gravidade, velocidade de ((salto)) e outras ((constante))s no jogo foram determinadas simplesmente tentando alguns números e vendo quais pareciam corretos. Você pode experimentar com eles.

## Rastreando teclas

{{index keyboard}}

Para um ((jogo)) como este, não queremos que teclas tenham efeito uma vez por pressionamento. Em vez disso, queremos que seu efeito (mover a figura do jogador) permaneça ativo enquanto elas estiverem pressionadas.

{{index "preventDefault method"}}

Precisamos configurar um manipulador de tecla que armazena o estado atual das teclas de seta esquerda, direita e para cima. Também queremos chamar `preventDefault` para essas teclas para que não acabem ((rolando)) a página.

{{index "trackKeys function", "key code", "event handling", "addEventListener method"}}

A função a seguir, quando recebe um array de nomes de teclas, retornará um objeto que rastreia a posição atual dessas teclas. Ela registra manipuladores de evento para eventos `"keydown"` e `"keyup"` e, quando o código de tecla no evento está presente no conjunto de códigos que está rastreando, atualiza o objeto.

```{includeCode: true}
function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

const arrowKeys =
  trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);
```

{{index "keydown event", "keyup event"}}

A mesma função manipuladora é usada para ambos os tipos de evento. Ela olha a propriedade `type` do objeto de evento para determinar se o estado da tecla deve ser atualizado para true (`"keydown"`) ou false (`"keyup"`).

{{id runAnimation}}

## Executando o jogo

{{index "requestAnimationFrame function", [animation, "platform game"]}}

A função `requestAnimationFrame`, que vimos no [Capítulo ?](dom#animationFrame), fornece uma boa forma de animar um jogo. Mas sua interface é bastante primitiva — usá-la requer que rastreemos o tempo em que nossa função foi chamada da última vez e chamemos `requestAnimationFrame` novamente após cada frame.

{{index "runAnimation function", "callback function", [function, "as value"], [function, "higher-order"], [animation, "platform game"]}}

Vamos definir uma função auxiliar que encapsula tudo isso em uma interface conveniente e nos permite simplesmente chamar `runAnimation`, dando a ela uma função que espera uma diferença de tempo como argumento e desenha um único frame. Quando a função de frame retorna o valor `false`, a animação para.

```{includeCode: true}
function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
```

{{index time, discretization}}

Defini um passo de frame máximo de 100 milissegundos (um décimo de segundo). Quando a aba ou janela do navegador com nossa página está oculta, chamadas a `requestAnimationFrame` serão suspensas até que a aba ou janela seja mostrada novamente. Nesse caso, a diferença entre `lastTime` e `time` será o tempo inteiro em que a página ficou oculta. Avançar o jogo por tanto tempo em um único passo pareceria bobo e poderia causar efeitos colaterais estranhos, como o jogador caindo através do chão.

A função também converte os passos de tempo para segundos, que são uma quantidade mais fácil de pensar do que milissegundos.

{{index "callback function", "runLevel function", [animation, "platform game"]}}

A função `runLevel` recebe um objeto `Level` e um construtor de ((exibição)) e retorna uma promise. Ela exibe o nível (em `document.body`) e permite que o usuário jogue através dele. Quando o nível termina (perdido ou vencido), `runLevel` espera mais um segundo (para deixar o usuário ver o que acontece) e depois limpa a exibição, para a animação e resolve a promise com o status final do jogo.

```{includeCode: true}
function runLevel(level, Display) {
  let display = new Display(document.body, level);
  let state = State.start(level);
  let ending = 1;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}
```

{{index "runGame function"}}

Um jogo é uma sequência de ((nível))eis. Sempre que o ((jogador)) morre, o nível atual é reiniciado. Quando um nível é completado, avançamos para o próximo nível. Isso pode ser expresso pela seguinte função, que recebe um array de planos de nível (strings) e um construtor de ((exibição)):

```{includeCode: true}
async function runGame(plans, Display) {
  for (let level = 0; level < plans.length;) {
    let status = await runLevel(new Level(plans[level]),
                                Display);
    if (status == "won") level++;
  }
  console.log("You've won!");
}
```

{{index "asynchronous programming", "event handling"}}

Como fizemos `runLevel` retornar uma promise, `runGame` pode ser escrita usando uma função `async`, como mostrado no [Capítulo ?](async). Ela retorna outra promise, que resolve quando o jogador termina o jogo.

{{index game, "GAME_LEVELS dataset"}}

Existe um conjunto de planos de ((nível)) disponível na vinculação `GAME_LEVELS` na [sandbox deste capítulo](https://eloquentjavascript.net/code#16)[ ([_https://eloquentjavascript.net/code#16_](https://eloquentjavascript.net/code#16))]{if book}. Esta página os alimenta para `runGame`, iniciando um jogo real.

```{sandbox: null, focus: yes, lang: html, startCode: true}
<link rel="stylesheet" href="css/game.css">

<body>
  <script>
    runGame(GAME_LEVELS, DOMDisplay);
  </script>
</body>
```

{{if interactive

Veja se você consegue vencê-los. Me diverti construindo-os.

if}}

## Exercícios

### Game over

{{index "lives (exercise)", game}}

É tradicional em ((jogos de plataforma)) que o jogador comece com um número limitado de _vidas_ e subtraia uma vida cada vez que morre. Quando o jogador fica sem vidas, o jogo recomeça desde o início.

{{index "runGame function"}}

Ajuste `runGame` para implementar vidas. Faça o jogador começar com três. Imprima o número atual de vidas (usando `console.log`) toda vez que um nível começar.

{{if interactive

```{lang: html, test: no, focus: yes}
<link rel="stylesheet" href="css/game.css">

<body>
<script>
  // A função runGame antiga. Modifique-a...
  async function runGame(plans, Display) {
    for (let level = 0; level < plans.length;) {
      let status = await runLevel(new Level(plans[level]),
                                  Display);
      if (status == "won") level++;
    }
    console.log("You've won!");
  }
  runGame(GAME_LEVELS, DOMDisplay);
</script>
</body>
```

if}}

### Pausando o jogo

{{index "pausing (exercise)", "escape key", keyboard, "runLevel function", "event handling"}}

Torne possível pausar (suspender) e despausar o jogo pressionando [esc]{keyname}. Você pode fazer isso alterando a função `runLevel` para configurar um manipulador de evento de teclado que interrompe ou retoma a animação sempre que [esc]{keyname} é pressionado.

{{index "runAnimation function"}}

A interface de `runAnimation` pode não parecer adequada para isso à primeira vista, mas é se você reorganizar a forma como `runLevel` a chama.

{{index [binding, global], "trackKeys function"}}

Quando tiver isso funcionando, há outra coisa que pode tentar. A forma como registramos manipuladores de evento de teclado é um tanto problemática. O objeto `arrowKeys` é atualmente uma vinculação global, e seus manipuladores de evento são mantidos mesmo quando nenhum jogo está rodando. Pode-se dizer que eles _((vazam))_ do nosso sistema. Estenda `trackKeys` para fornecer uma forma de cancelar o registro de seus manipuladores, e então altere `runLevel` para registrar seus manipuladores quando começa e cancelar o registro quando termina.

{{if interactive

```{lang: html, focus: yes, test: no}
<link rel="stylesheet" href="css/game.css">

<body>
<script>
  // A função runLevel antiga. Modifique-a...
  function runLevel(level, Display) {
    let display = new Display(document.body, level);
    let state = State.start(level);
    let ending = 1;
    return new Promise(resolve => {
      runAnimation(time => {
        state = state.update(time, arrowKeys);
        display.syncState(state);
        if (state.status == "playing") {
          return true;
        } else if (ending > 0) {
          ending -= time;
          return true;
        } else {
          display.clear();
          resolve(state.status);
          return false;
        }
      });
    });
  }
  runGame(GAME_LEVELS, DOMDisplay);
</script>
</body>
```

if}}

{{hint

{{index "pausing (exercise)", [animation, "platform game"]}}

Uma animação pode ser interrompida retornando `false` da função dada a `runAnimation`. Ela pode ser continuada chamando `runAnimation` novamente.

{{index closure}}

Então precisamos comunicar o fato de que estamos pausando o jogo para a função dada a `runAnimation`. Para isso, você pode usar uma vinculação à qual tanto o manipulador de evento quanto aquela função tenham acesso.

{{index "event handling", "removeEventListener method", [function, "as value"]}}

Ao encontrar uma forma de cancelar o registro dos manipuladores registrados por `trackKeys`, lembre-se de que o _exato_ mesmo valor de função que foi passado para `addEventListener` deve ser passado para `removeEventListener` para remover um manipulador com sucesso. Assim, o valor da função `handler` criado em `trackKeys` deve estar disponível para o código que cancela o registro dos manipuladores.

Você pode adicionar uma propriedade ao objeto retornado por `trackKeys`, contendo ou aquele valor de função ou um método que lide com o cancelamento do registro diretamente.

hint}}

### Um monstro

{{index "monster (exercise)"}}

É tradicional em jogos de plataforma ter inimigos que você pode derrotar pulando em cima deles. Este exercício pede que você adicione tal tipo de ator ao jogo.

Chamaremos esse ator de monstro. Monstros se movem apenas horizontalmente. Você pode fazê-los se mover na direção do jogador, quicar para frente e para trás como lava horizontal, ou ter qualquer outro padrão de movimento que quiser. A classe não precisa lidar com queda, mas deve garantir que o monstro não ande através de paredes.

Quando um monstro toca o jogador, o efeito depende de se o jogador está pulando em cima dele ou não. Você pode aproximar isso verificando se a parte inferior do jogador está perto do topo do monstro. Se esse for o caso, o monstro desaparece. Se não, o jogo é perdido.

{{if interactive

```{test: no, lang: html, focus: yes}
<link rel="stylesheet" href="css/game.css">
<style>.monster { background: purple }</style>

<body>
  <script>
    // Complete o construtor, os métodos update e collide
    class Monster {
      constructor(pos, /* ... */) {}

      get type() { return "monster"; }

      static create(pos) {
        return new Monster(pos.plus(new Vec(0, -1)));
      }

      update(time, state) {}

      collide(state) {}
    }

    Monster.prototype.size = new Vec(1.2, 2);

    levelChars["M"] = Monster;

    runLevel(new Level(`
..................................
.################################.
.#..............................#.
.#..............................#.
.#..............................#.
.#...........................o..#.
.#..@...........................#.
.##########..............########.
..........#..o..o..o..o..#........
..........#...........M..#........
..........################........
..................................
`), DOMDisplay);
  </script>
</body>
```

if}}

{{hint

{{index "monster (exercise)", "persistent data structure"}}

Se você quiser implementar um tipo de movimento que é baseado em estado, como quicar, certifique-se de armazenar o estado necessário no objeto do ator — inclua-o como argumento do construtor e adicione-o como propriedade.

Lembre-se que `update` retorna um _novo_ objeto em vez de mudar o antigo.

{{index "collision detection"}}

Ao lidar com colisão, encontre o jogador em `state.actors` e compare sua posição com a posição do monstro. Para obter a _parte inferior_ do jogador, você precisa adicionar seu tamanho vertical à sua posição vertical. A criação de um estado atualizado será semelhante ao método `collide` de `Coin` (removendo o ator) ou de `Lava` (mudando o status para `"lost"`), dependendo da posição do jogador.

hint}}
