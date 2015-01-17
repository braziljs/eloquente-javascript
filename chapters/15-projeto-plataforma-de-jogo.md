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

 ## Tarefa de encapsulamento

A maior parte do código neste capítulo não ira se preocupar com o encapsulamento. Isto tem duas razões. Em primeiro lugar o encapsulamento exige esforço extra. 
Em programas maiores isso requer conceitos  adicionais de interfaces a serem introduzidas. Como só há código para você enviar ao leitor que esta jogando com seus olhos vidrados, fiz um esforço para manter o programa pequeno.

Em segundo lugar, os vários elementos neste jogo estão estreitamente ligados que se o comportamento de um deles mudar é improvável que qualquer um dos outros seriam capazes de ficar na mesma ordem. A interfaces e os elementos acaba codificando uma série de suposições sobre a forma de como o jogo funciona. Isso os torna muito menos eficaz sempre que você altera uma parte do sistema, você ainda tem que se preocupar com a forma como ela afeta as outras partes isto porque suas interfaces não cobririam a nova situação.

Alguns pontos de corte em um sistema existe bem a separação através de interfaces rigorosas mas outros não. Tentar encapsular algo que não é um limite adequado é uma maneira de desperdiçar uma grande quantidade de energia. Quando você está fazendo este erro normalmente você vai perceber que suas interfaces estaram ficando sem jeito amplo e detalhado e que eles precisam serem modificados muitas vezes, assim quando como o programa evolui.

Há uma coisa que vamos encapsular neste capítulo que é o subsistema de desenho. A razão para isso é que nós vamos mostrar o mesmo jogo de uma maneira diferente no próximo capítulo. Ao colocar o desenho atrás de uma interface podemos simplesmente carregar o mesmo programa de jogo lá e ligar um novo módulo de exibir.

## Desenho

O encapsulamento do código de desenho é feito através da definição de um objeto de exibição que exibe um determinado nível. O tipo de exibição que definimos neste capítulo é chamado `DOMDisplay` isto porque usamos elementos simples do DOM para mostrar o nível.

Nós estaremos usando uma folha de estilo para definir as cores reais e outras propriedades fixas dos elementos que faram parte do jogo. Também seria possível atribuir diretamente o estilo de propriedade dos elementos quando criá-los, mas queremos produzir programas mais detalhados.

A seguinte função auxiliar fornece uma maneira curta para criar um elemento e dar-lhe uma classe:

````js
function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}
````

O modo de exibição é criado dando-lhe um elemento pai a que se deve acrescentar-se e um nível de objeto.

````js
function DOMDisplay(parent, level) {
  this.wrap = parent.appendChild(elt("div", "game"));
  this.level = level;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null;
  this.drawFrame();
}
````

Levando em consideração que o fato de que `appendChild` retorna o elemento acrescentado ao criar o conteúdo do elemento e armazená-lo na suas propriedade com apenas uma única instrução.

O fundo do nível nunca muda, é desenhada apenas uma vez. Os atores são redesenhadas cada vez que o `display` for atualizado. A propriedade `actorLayer` será utilizado para controlar o elemento que contém os agentes de modo que eles podem ser facilmente removidos e substituídos.

Nossas coordenadas e tamanhos são rastreados em unidades relativas ao tamanho da `grid`, onde o tamanho ou distância de 1 significa uma unidade da `grid`. Ao definir os tamanhos de pixel vamos ter que escalar essas coordenadas, tudo no jogo seria ridiculamente pequeno em um único pixel por metro quadrado. A variável de escala indica o número de pixels que uma única unidade ocupa na tela.

````js
var scale = 20;

DOMDisplay.prototype.drawBackground = function() {
  var table = elt("table", "background");
  table.style.width = this.level.width * scale + "px";
  this.level.grid.forEach(function(row) {
    var rowElt = table.appendChild(elt("tr"));
    rowElt.style.height = scale + "px";
    row.forEach(function(type) {
      rowElt.appendChild(elt("td", type));
    });
  });
  return table;
};
````

Como mencionado anteriormente o fundo é desenhado com um elemento `<table>`. Este corresponde à estrutura da propriedade `grid` onde cada linha é transformado em uma linha da tabela(elemento `<tr>`). As cordas na grade são usados ​​como nomes de classe para a célula da tabela(elemento `<td>`). O seguinte CSS ajuda a olhar o quadro resultante como o fundo que queremos:

````css
.background    { background: rgb(52, 166, 251);
                 table-layout: fixed;
                 border-spacing: 0;              }
.background td { padding: 0;                     }
.lava          { background: rgb(255, 100, 100); }
.wall          { background: white;              }
````

Alguns deles(`table-layout`, `border-spacing` , e `padding`) são simplesmente usados ​​para suprimir o comportamento padrão indesejado. Nós não queremos que o layout da tabela dependa de suas células de conteúdos, e nós não queremos espaço entre as células da tabela ou `padding` dentro deles.

A regra de `background` define a cor de fundo. Em CSS é permitido que as cores a serem especificados tanto como palavras(`write`), com um formato tal como RGB(`R, G, B`) onde as componentes vermelha, verde e azul da cor são separados em três números de 0 a 255. Assim em `rgb(52, 166, 251)`, o componente vermelho é de 52 o verde é 166 e azul é 251. Como o componente azul é o maior a cor resultante será azulada. Você pode ver que na regra lava o primeiro número(vermelho) é o maior.

Chamamos a cada ator criando um elemento no DOM para ele e definindo a posição e o tamanho desse elemento com base nas propriedades do ator. Os valores devem ser multiplicadas por escala para converter para unidades de pixels do jogo.

````js
DOMDisplay.prototype.drawActors = function() {
  var wrap = elt("div");
  this.level.actors.forEach(function(actor) {
    var rect = wrap.appendChild(elt("div",
                                    "actor " + actor.type));
    rect.style.width = actor.size.x * scale + "px";
    rect.style.height = actor.size.y * scale + "px";
    rect.style.left = actor.pos.x * scale + "px";
    rect.style.top = actor.pos.y * scale + "px";
  });
  return wrap;
};
````

Para dar mais classe ao elemento separamos os nomes de classe por espaços. No código CSS abaixo mostramos a classe ator que nos dá os atores com sua posição absoluta. O seu nome de tipo é usado como uma classe extra para dar-lhes uma cor. Não temos para definir a classe lava novamente porque vamos reutilizar a classe para os quadradrinhos de lava que nós definimos anteriormente.

````css
.actor  { position: absolute;            }
.coin   { background: rgb(241, 229, 89); }
.player { background: rgb(64, 64, 64);   }
````

Quando se atualiza a exibição o método que foi passado primeiro remove os velhos ator gráficos se houver e em seguida redesenha-os em suas novas posições. Pode ser tentador para tentar reutilizar os elementos DOM para os atores, mas para fazer esse trabalho seria preciso uma grande quantidade de fluxo de informação adicional entre o código de exibição e o código de simulação. Precisaríamos de associar os atores com os elementos do DOM e o código de desenho deve remover elementos quando seus atores desaparecem. Uma vez que não será tipicamente apenas um punhado de atores no jogo, redesenhar todos eles não custa caro.

````js
DOMDisplay.prototype.drawFrame = function() {
  if (this.actorLayer)
    this.wrap.removeChild(this.actorLayer);
  this.actorLayer = this.wrap.appendChild(this.drawActors());
  this.wrap.className = "game " + (this.level.status || "");
  this.scrollPlayerIntoView();
};
````

Ao adicionar o estado atual do nível com um nome de classe para o `wrapper` podemos denominar que o ator do jogador esta ligeiramente diferente quando o jogo está ganho ou perdido, para isso basta adicionar uma regra no CSS que tem efeito apenas quando o jogador tem um elemento ancestral com uma determinada classe.

````css
.lost .player {
  background: rgb(160, 64, 64);
}

.won .player {
  box-shadow: -4px -7px 8px white, 4px -7px 8px white;
}
````

Depois de tocar em lava a cor do jogador ficara vermelho escuro sugerindo escaldante. Quando a última moeda foi coletada nós usamos duas caixa branca com sombras borradas, um para o canto superior esquerdo e um para o canto superior direito para criar um efeito de halo branco.

Não podemos assumir que os níveis de sempre se encaixam na janela de exibição. É por isso que a chamada `scrollPlayerIntoView` é necessária e  garante que se o nível está saindo fora do visor nós podemos rolar o `viewport` para garantir que o jogador está perto de seu centro. O seguinte CSS dá ao elemento DOM o embrulho do jogo com um tamanho máximo e garante que qualquer coisa que não se destaca da caixa do elemento não é visível. Também se obter o elemento exterior numa posição relativa, de modo que os atores estão posicionados no seu interior em relação ao canto superior esquerdo do nível.

````css
.game {
  overflow: hidden;
  max-width: 600px;
  max-height: 450px;
  position: relative;
}
````

No método `scrollPlayerIntoView` encontramos a posição do jogador e atualizamos a posição de rolagem do elemento conforme seu envolvimento. Vamos mudar a posição de rolagem através da manipulação das propriedades desses elementos com os enventos de `scrollLeft` e `scrollTop` para quando o jogador está muito perto do canto.

````js
DOMDisplay.prototype.scrollPlayerIntoView = function() {
  var width = this.wrap.clientWidth;
  var height = this.wrap.clientHeight;
  var margin = width / 3;

  // The viewport
  var left = this.wrap.scrollLeft, right = left + width;
  var top = this.wrap.scrollTop, bottom = top + height;

  var player = this.level.player;
  var center = player.pos.plus(player.size.times(0.5))
                 .times(scale);

  if (center.x < left + margin)
    this.wrap.scrollLeft = center.x - margin;
  else if (center.x > right - margin)
    this.wrap.scrollLeft = center.x + margin - width;
  if (center.y < top + margin)
    this.wrap.scrollTop = center.y - margin;
  else if (center.y > bottom - margin)
    this.wrap.scrollTop = center.y + margin - height;
};
````

A forma como centro do jogador é encontrado mostra como os métodos em nosso tipo `Vector` permite calcular os objetos a serem escritos de forma legível. Para encontrar o centro do ator nós adicionamos a sua posição(o canto superior esquerdo) e a metade do seu tamanho. Esse é o centro em coordenadas de nível mas precisamos dele em coordenadas de pixel, por isso em seguida vamos multiplicar o vetor resultante de nossa escala de exibição.

Em seguida uma série de verificações são feitas para verificar qual a posição do jogador dentro e fora do intervalo permitido. Note-se que, por as vezes, isto irá definir as coordenadas absolutas de rolagem, abaixo de zero ou fora da área de rolagem do elemento. Isso é bom pois o DOM vai obrigá-los a terem valores verdadeiros. Definir `scrollLeft` para `-10` fará com que ele torne `0`.

Ele teria sido um pouco mais simples tentar se sempre deslocarmos o jogador para o centro da janela. Mas isso cria um efeito bastante chocante. Como você está pulando a visão vai mudar constantemente de cima e para baixo. É mais agradável ter uma área `"neutra"` no meio da tela onde você pode se mover sem causar qualquer rolagem.

Finalmente, vamos precisar de uma maneira de limpar um nível apresentado para ser usado quando o jogo se move para o próximo nível ou redefine um nível.

 ````js
DOMDisplay.prototype.clear = function() {
  this.wrap.parentNode.removeChild(this.wrap);
};
 ````

Estamos agora em condições de apresentar o nosso melhor nível atualmente.

````html
<link rel="stylesheet" href="css/game.css">

<script>
  var simpleLevel = new Level(simpleLevelPlan);
  var display = new DOMDisplay(document.body, simpleLevel);
</script>
````

A tag `<link>`quando usado com `rel="stylesheet"` torna-se uma maneira de carregar um arquivo CSS em uma página. O `game.css` arquivo contém os estilos necessários para o nosso jogo.

## Movimento e colisão

Agora estamos no ponto em que podemos começar a adicionar movimento que é um aspecto mais interessante do jogo. A abordagem básica tomada pela maioria dos jogos como este consiste em dividir o tempo em pequenos passos, e para cada etapa move os atores por uma distância correspondente a sua velocidade(distância percorrida por segundo) multiplicada pelo tamanho do passo em tempo(em segundos).

Isto é fácil. A parte difícil é lidar com as interações entre os elementos. Quando o jogador atinge uma parede ou o chão eles não devem simplesmente se mover através deles. O jogo deve notar quando um determinado movimento faz com que um objeto bata sobre outro objeto e responder adequadamente. Para paredes o movimento deve ser interrompido. As moedas devem serem recolhidas e assim por diante.

Resolver este problema para o caso geral é uma grande tarefa. Você pode encontrar as bibliotecas, geralmente chamados de motores de física que simulam a interação entre os objetos físicos em duas ou três dimensões. Nós vamos ter uma abordagem mais modesta neste capítulo apenas manipularemos as colisões entre objetos retangulares e manusearemos de uma forma bastante simplista.

Antes de mover o jogador ou um bloco de lava, testamos se o movimento iria levá-la para dentro de uma parte não vazio de fundo. Se isso acontecer, nós simplesmente cancelamos o movimento por completo. A resposta a tal colisão depende do tipo de ator - o jogador vai parar, enquanto um bloco de lava vai se recuperar.

Essa abordagem requer alguns passos para termos uma forma reduzida, uma vez que o objeto esta em movimento e para antes dos objetos se tocarem. Se os intervalos de tempo(os movimentos dos passos) são muito grandes, o jogador iria acabar em uma distância perceptível acima do solo. Outra abordagem indiscutivelmente melhor mas é mais complicado, seria a de encontrar o local exato da colisão e se mudar para lá. Tomaremos a abordagem simples de esconder os seus problemas, garantindo que a animação prossegue em pequenos passos.

Este método nos diz se e um retângulo(especificado por uma posição e um tamanho) coincide com qualquer espaço não vazio na `grid` de fundo:

````js
Level.prototype.obstacleAt = function(pos, size) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);

  if (xStart < 0 || xEnd > this.width || yStart < 0)
    return "wall";
  if (yEnd > this.height)
    return "lava";
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};
````

Este método calcula o conjunto de quadradros que o `body` se sobrepõe a usando `Math.floor` e `Math.ceil` nas coordenadas do `body`. Lembre-se que a unidades de tamanho dos quadrados são 1 por 1. Arredondando os lados de uma caixa de cima e para baixo temos o quadrados da gama de fundo que tem os toques nas caixas.

Se o corpo se sobressai do nível, sempre voltamos "parede" para os lados e na parte superior e "lava" para o fundo. Isso garante que o jogador morra ao cair para fora do mundo . Quando o corpo esta totalmente no interior da `grid`, que laço sobre o bloco de quadrículas encontrado arredondando as coordenadas e retornar o conteúdo do primeiro quadrado nonempty encontramos .

Colisões entre o jogador e outros atores dinâmicos(moedas, lava em movimento) são tratadas depois de o jogador se mudou. Quando o movimento tomou o jogador para outro outro ator, uma moeda ou a recolha de efeito apropriado para morter. Isoo é ativado.

Este método analisa o conjunto de atores, procurando um ator que se sobrepõe a um dado como um argumento:

````js
Level.prototype.actorAt = function(actor) {
  for (var i = 0; i < this.actors.length; i++) {
    var other = this.actors[i];
    if (other != actor &&
        actor.pos.x + actor.size.x > other.pos.x &&
        actor.pos.x < other.pos.x + other.size.x &&
        actor.pos.y + actor.size.y > other.pos.y &&
        actor.pos.y < other.pos.y + other.size.y)
      return other;
  }
};
````

## Atores e ações

O método `animate` do tipo `Level` dá a todos os atores do `level` a chance de se mover. Seu argumento `step` traz o tempo do passo em segundos. O objeto `key` contém informações sobre as teclas que o jogador pressionou.

````js
var maxStep = 0.05;

Level.prototype.animate = function(step, keys) {
  if (this.status != null)
    this.finishDelay -= step;

  while (step > 0) {
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};
````

Quando a propriedade `status` do `level` tem um valor não nulo(que é o caso de quando o jogador ganhou ou perdeu) devemos contar para baixo a propriedade `finishDelay` que controla o tempo entre o ponto onde o jogador ganhou ou perdeu e o ponto onde nós paramos de mostrar o `Level`.

O `loop` `while` corta o passo de tempo onde estamos animando em pedaços pequenos. Ele garante que nenhum passo maior do que `maxStep` é tomado. Por exemplo um passo de 0,12 segundo iria ser cortado em dois passos de 0,05 e um segundo passo de 0,02.

Objetos ator tem um método `act` que toma como argumentos o tempo do passo, o objeto do `level` e as chaves de objeto. Aqui está um para o tipo de ator(Lava) que ignora as teclas de objeto:

````js
Lava.prototype.act = function(step, level) {
  var newPos = this.pos.plus(this.speed.times(step));
  if (!level.obstacleAt(newPos, this.size))
    this.pos = newPos;
  else if (this.repeatPos)
    this.pos = this.repeatPos;
  else
    this.speed = this.speed.times(-1);
};
````

Ele calcula uma nova posição através da adição do produto do tempo do passo e a sua velocidade atual para definir sua posição. Se nenhum bloco de obstáculos é a nova posição ele se move para lá. Se houver um obstáculo o comportamento depende do tipo da lava: lava e bloco de gotejamento tem uma propriedade `repeatPos` para ele poder saltar para trás quando bater em algo. Saltando a lava simplesmente inverte sua velocidade(multiplica por -1) a fim de começar a se mover em outra direção.

Coins usa seu método `act` para se mover. Eles ignoram colisões uma vez que são simplesmente oscilando em torno de dentro de sua própria quadrado e colisões com o jogador será tratado pelo método `act` do jogador.

````js
var wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.act = function(step) {
  this.wobble += step * wobbleSpeed;
  var wobblePos = Math.sin(this.wobble) * wobbleDist;
  this.pos = this.basePos.plus(new Vector(0, wobblePos));
};
````

A propriedade `wobble` é atualizada para controlar o tempo e em seguida utilizado como um argumento para `math.sin` para criar uma onda que é usado para calcular sua nova posição.

Isso deixa o próprio jogador. Movimento do jogador é tratado separadamente para cada eixo, porque bater no chão não deve impedir o movimento horizontal, e batendo na parede não deve parar de cair ou saltar movimento. Este método implementa a parte horizontal:

````js
var playerXSpeed = 7;

Player.prototype.moveX = function(step, level, keys) {
  this.speed.x = 0;
  if (keys.left) this.speed.x -= playerXSpeed;
  if (keys.right) this.speed.x += playerXSpeed;

  var motion = new Vector(this.speed.x * step, 0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle)
    level.playerTouched(obstacle);
  else
    this.pos = newPos;
};
````

O movimento é calculado com base no estado das teclas de seta esquerda e direita. Quando um movimento faz com que o jogador bata em alguma coisa é o método `playerTouched` que é chamado no `level` que lida com coisas como morrer na lava ou coletar moedas. Caso contrário o objecto atualiza a sua posição.

Movimento vertical funciona de forma semelhante, mas tem que simular salto e gravidade.

````js
var gravity = 30;
var jumpSpeed = 17;

Player.prototype.moveY = function(step, level, keys) {
  this.speed.y += step * gravity;
  var motion = new Vector(0, this.speed.y * step);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle) {
    level.playerTouched(obstacle);
    if (keys.up && this.speed.y > 0)
      this.speed.y = -jumpSpeed;
    else
      this.speed.y = 0;
  } else {
    this.pos = newPos;
  }
};
````

No início do método o jogador é acelerado verticalmente para ter em conta a gravidade. Ao saltar a velocidade da gravidade é praticamente igual a todas as outras constantes neste jogo que foram criadas por tentativa e erro. Eu testei vários valores até encontrar uma combinação agradável.

Em seguida é feito um verificação para identificar se há obstáculos novamente. Se bater em um obstáculo há dois resultados possíveis. Quando a seta para cima é pressionado e estamos nos movendo para baixo(ou seja, a coisa que bater é abaixo de nós) a velocidade é definida como um valor relativamente grande e negativo. Isso faz com que o jogador salte. Se esse não for o caso, nós simplesmente esbarrou em alguma coisa e a velocidade é zerada.

O método atual parece com isso:

````js
Player.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);

  var otherActor = level.actorAt(this);
  if (otherActor)
    level.playerTouched(otherActor.type, otherActor);

  // Losing animation
  if (level.status == "lost") {
    this.pos.y += step;
    this.size.y -= step;
  }
};
````

Depois de se mover o método verifica para outros atores que o jogador está colidindo com ele novamente e é chamado o  `playerTouched` quando encontra um. Desta vez ele passa o objeto ator como o segundo argumento isto é porque se o outro ator é uma moeda `playerTouched` precisa saber qual moeda está sendo coletado.

Finalmente quando o jogador morre(toca lava), montamos uma pequena animação que faz com que ele se "encolha" ou "afunde" reduzindo a altura do objeto jogador.

E aqui é o método que manipula as colisões entre o jogador e outros objetos:

````js
Level.prototype.playerTouched = function(type, actor) {
  if (type == "lava" && this.status == null) {
    this.status = "lost";
    this.finishDelay = 1;
  } else if (type == "coin") {
    this.actors = this.actors.filter(function(other) {
      return other != actor;
    });
    if (!this.actors.some(function(actor) {
      return actor.type == "coin";
    })) {
      this.status = "won";
      this.finishDelay = 1;
    }
  }
};
````

Quando lava é tocado, o status do jogo é definido como `"lost"`. Quando uma moeda é tocada essa moeda é removida do conjunto de atores e se fosse o último o estado do jogo é definido como "ganhou".

Isso nos dá um nível que pode realmente ser animado. Tudo o que está faltando agora é o código que aciona a animação.