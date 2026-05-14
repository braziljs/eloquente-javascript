{{meta {load_files: ["code/chapter/07_robot.js", "code/animatevillage.js"], zip: html}}}

# Projeto: Um Robô

{{quote {author: "Edsger Dijkstra", title: "The Threats to Computing Science", chapter: true}

A questão de se Máquinas Podem Pensar [...] é tão relevante quanto a questão de se Submarinos Podem Nadar.

quote}}

{{index "artificial intelligence", "Dijkstra, Edsger"}}

{{figure {url: "img/chapter_picture_7.jpg", alt: "Illustration of a robot holding a stack of packages", chapter: framed}}}

{{index "project chapter", "reading code", "writing code"}}

Nos capítulos de "projeto", vou parar de bombardeá-lo com teoria nova por um breve momento e, em vez disso, trabalharemos em um programa juntos. A teoria é necessária para aprender a programar, mas ler e entender programas reais é igualmente importante.

Nosso projeto neste capítulo é construir um ((autômato)), um pequeno programa que realiza uma tarefa em um ((mundo virtual)). Nosso autômato será um ((robô)) de entrega de correspondências que pega e entrega encomendas.

## Meadowfield

{{index "roads array"}}

A vila de ((Meadowfield)) não é muito grande. Ela consiste em 11 lugares com 14 estradas entre eles. Pode ser descrita com este *array* de estradas:

```{includeCode: true}
const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];
```

{{figure {url: "img/village2x.png", alt: "Pixel art illustration of a small village with 11 locations, labeled with letters, and roads going being them"}}}

A rede de estradas na vila forma um _((grafo))_. Um grafo é uma coleção de pontos (lugares na vila) com linhas entre eles (estradas). Esse grafo será o mundo por onde nosso robô se move.

{{index "roadGraph object"}}

O *array* de *strings* não é muito fácil de trabalhar. O que nos interessa são os destinos que podemos alcançar a partir de um dado lugar. Vamos converter a lista de estradas em uma estrutura de dados que, para cada lugar, nos diga o que pode ser alcançado a partir dali.

```{includeCode: true}
function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (from in graph) {
      graph[from].push(to);
    } else {
      graph[from] = [to];
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);
```

{{index "split method"}}

Dado um *array* de arestas, `buildGraph` cria um objeto map que, para cada nó, armazena um *array* de nós conectados. Ele usa o método `split` para ir das *strings* de estrada — que possuem a forma `"Início-Fim"` — para *arrays* de dois elementos contendo o início e o fim como *strings* separadas.

## A tarefa

Nosso ((robô)) estará se movendo pela vila. Há encomendas em vários lugares, cada uma endereçada a algum outro lugar. O robô pega encomendas quando as encontra e as entrega quando chega ao destino delas.

O autômato deve decidir, a cada ponto, para onde ir em seguida. Ele termina sua tarefa quando todas as encomendas foram entregues.

{{index simulation, "virtual world"}}

Para podermos simular esse processo, precisamos definir um mundo virtual que possa descrevê-lo. Esse modelo nos diz onde o robô está e onde estão as encomendas. Quando o robô decide se mover para algum lugar, precisamos atualizar o modelo para refletir a nova situação.

{{index [state, in objects]}}

Se você está pensando em termos de ((programação orientada a objetos)), seu primeiro impulso pode ser começar a definir objetos para os vários elementos do mundo: uma ((classe)) para o robô, uma para uma encomenda, talvez uma para lugares. Esses poderiam então armazenar propriedades que descrevem seu ((estado)) atual, como a pilha de encomendas em um local, que poderíamos alterar ao atualizar o mundo.

Isso está errado. Pelo menos, geralmente está. O fato de que algo parece um objeto não significa automaticamente que deve ser um objeto no seu programa. Escrever classes reflexivamente para cada conceito em sua aplicação tende a deixá-lo com uma coleção de objetos interconectados que possuem seu próprio estado interno mutável. Tais programas são frequentemente difíceis de entender e, portanto, fáceis de quebrar.

{{index [state, in objects]}}

Em vez disso, vamos condensar o estado da vila no conjunto mínimo de valores que o define. Há a localização atual do robô e a coleção de encomendas não entregues, cada uma com uma localização atual e um endereço de destino. É isso.

{{index "VillageState class", "persistent data structure"}}

E enquanto estamos nisso, vamos fazer de modo que não _alteremos_ esse estado quando o robô se move, mas sim calculemos um _novo_ estado para a situação após o movimento.

```{includeCode: true}
class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) return p;
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}
```

O método `move` é onde a ação acontece. Ele primeiro verifica se há uma estrada indo do lugar atual ao destino e, se não houver, retorna o estado antigo, pois esse não é um movimento válido.

{{index "map method", "filter method"}}

Em seguida, o método cria um novo estado com o destino como o novo lugar do robô. Ele também precisa criar um novo conjunto de encomendas — encomendas que o robô está carregando (que estão no lugar atual do robô) precisam ser movidas para o novo lugar. E encomendas endereçadas ao novo lugar precisam ser entregues — ou seja, precisam ser removidas do conjunto de encomendas não entregues. A chamada a `map` cuida do movimento, e a chamada a `filter` faz a entrega.

Objetos de encomenda não são alterados quando movidos, mas sim recriados. O método `move` nos dá um novo estado de vila, mas deixa o antigo completamente intacto.

```
let first = new VillageState(
  "Post Office",
  [{place: "Post Office", address: "Alice's House"}]
);
let next = first.move("Alice's House");

console.log(next.place);
// → Alice's House
console.log(next.parcels);
// → []
console.log(first.place);
// → Post Office
```

O movimento faz com que a encomenda seja entregue, o que se reflete no próximo estado. Mas o estado inicial ainda descreve a situação onde o robô está no correio e a encomenda não foi entregue.

## Dados persistentes

{{index "persistent data structure", mutability, ["data structure", immutable]}}

Estruturas de dados que não mudam são chamadas de _((imutáveis))_ ou _persistentes_. Elas se comportam de maneira semelhante a *strings* e números, no sentido de que são o que são e permanecem assim, em vez de conter coisas diferentes em momentos diferentes.

Em JavaScript, praticamente tudo _pode_ ser alterado, então trabalhar com valores que devem ser persistentes requer alguma contenção. Existe uma função chamada `Object.freeze` que altera um objeto de modo que escrever em suas propriedades seja ignorado. Você poderia usá-la para garantir que seus objetos não sejam alterados, se quiser ser cuidadoso. O congelamento exige que o computador faça algum trabalho extra, e ter atualizações ignoradas é tão provável de confundir alguém quanto tê-las fazendo a coisa errada. Eu geralmente prefiro simplesmente dizer às pessoas que um dado objeto não deve ser mexido e esperar que elas se lembrem disso.

```
let object = Object.freeze({value: 5});
object.value = 10;
console.log(object.value);
// → 5
```

Por que estou me esforçando tanto para não alterar objetos quando a linguagem está obviamente esperando que eu faça isso? Porque isso me ajuda a entender meus programas. Isto é sobre gerenciamento de complexidade novamente. Quando os objetos no meu sistema são coisas fixas e estáveis, posso considerar operações sobre eles isoladamente — mover para a casa de Alice a partir de um dado estado inicial sempre produz o mesmo novo estado. Quando objetos mudam ao longo do tempo, isso adiciona toda uma nova dimensão de complexidade a esse tipo de raciocínio.

Para um sistema pequeno como o que estamos construindo neste capítulo, poderíamos lidar com esse pouco de complexidade extra. Mas o limite mais importante sobre que tipo de sistemas podemos construir é quanto conseguimos entender. Qualquer coisa que torne seu código mais fácil de entender torna possível construir um sistema mais ambicioso.

Infelizmente, embora entender um sistema construído sobre estruturas de dados persistentes seja mais fácil, _projetar_ um, especialmente quando sua linguagem de programação não está ajudando, pode ser um pouco mais difícil. Procuraremos oportunidades de usar estruturas de dados persistentes neste livro, mas também usaremos as mutáveis.

## Simulação

{{index simulation, "virtual world"}}

Um ((robô)) de entrega olha para o mundo e decide em qual direção quer se mover. Portanto, poderíamos dizer que um robô é uma função que recebe um objeto `VillageState` e retorna o nome de um lugar próximo.

{{index "runRobot function"}}

Como queremos que robôs possam lembrar coisas para fazer e executar planos, também passamos a eles sua memória e permitimos que retornem uma nova memória. Assim, o que um robô retorna é um objeto contendo tanto a direção para a qual quer se mover quanto um valor de memória que será devolvido a ele na próxima vez que for chamado.

```{includeCode: true}
function runRobot(state, robot, memory) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}
```

Considere o que um robô precisa fazer para "resolver" um dado estado. Ele deve pegar todas as encomendas visitando cada local que tem uma encomenda e entregá-las visitando cada local para o qual uma encomenda é endereçada, mas apenas depois de pegar a encomenda.

Qual é a estratégia mais burra que poderia funcionar? O robô poderia simplesmente andar em uma direção aleatória a cada turno. Isso significa que, com grande probabilidade, ele eventualmente encontrará todas as encomendas e, em algum momento, alcançará o lugar onde elas devem ser entregues.

{{index "randomPick function", "randomRobot function"}}

Veja como isso poderia parecer:

```{includeCode: true}
function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}
```

{{index "Math.random function", "Math.floor function", [array, "random element"]}}

Lembre-se de que `Math.random()` retorna um número entre 0 e 1 — mas sempre abaixo de 1. Multiplicar esse número pelo comprimento de um *array* e depois aplicar `Math.floor` nos dá um índice aleatório para o *array*.

Como este robô não precisa lembrar de nada, ele ignora seu segundo argumento (lembre-se de que funções JavaScript podem ser chamadas com argumentos extras sem problemas) e omite a propriedade `memory` em seu objeto retornado.

Para colocar esse robô sofisticado para trabalhar, primeiro precisaremos de uma maneira de criar um novo estado com algumas encomendas. Um método estático (escrito aqui adicionando diretamente uma propriedade ao construtor) é um bom lugar para colocar essa funcionalidade.

```{includeCode: true}
VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({place, address});
  }
  return new VillageState("Post Office", parcels);
};
```

{{index "do loop"}}

Não queremos que nenhuma encomenda seja enviada do mesmo lugar para o qual é endereçada. Por essa razão, o *loop* `do` continua escolhendo novos lugares quando obtém um que é igual ao endereço.

Vamos iniciar um mundo virtual.

```{test: no}
runRobot(VillageState.random(), randomRobot);
// → Moved to Marketplace
// → Moved to Town Hall
// → …
// → Done in 63 turns
```

O robô leva muitos turnos para entregar as encomendas porque não está planejando com antecedência. Vamos abordar isso em breve.

{{if interactive

Para uma perspectiva mais agradável da simulação, você pode usar a função `runRobotAnimation` que está disponível no [ambiente de programação deste capítulo](https://eloquentjavascript.net/code/#7). Ela executa a simulação, mas em vez de exibir texto, mostra o robô se movendo pelo mapa da vila.

```{test: no}
runRobotAnimation(VillageState.random(), randomRobot);
```

A maneira como `runRobotAnimation` é implementada permanecerá um mistério por enquanto, mas depois de ler os [capítulos posteriores](dom) deste livro, que discutem a integração do JavaScript em *browsers*, você será capaz de adivinhar como funciona.

if}}

## A rota do caminhão de correspondência

{{index "mailRoute array"}}

Deveríamos ser capazes de fazer muito melhor do que o ((robô)) aleatório. Uma melhoria fácil seria se inspirar na maneira como a entrega de correspondência do mundo real funciona. Se encontrarmos uma rota que passe por todos os lugares da vila, o robô poderia percorrer essa rota duas vezes, e nesse ponto estaria garantido que terminou. Aqui está uma dessas rotas (começando pelo correio):

```{includeCode: true}
const mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];
```

{{index "routeRobot function"}}

Para implementar o robô seguidor de rota, precisaremos usar a memória do robô. O robô mantém o restante de sua rota na memória e descarta o primeiro elemento a cada turno.

```{includeCode: true}
function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return {direction: memory[0], memory: memory.slice(1)};
}
```

Este robô já é muito mais rápido. Ele levará no máximo 26 turnos (duas vezes a rota de 13 passos), mas geralmente menos.

{{if interactive

```{test: no}
runRobotAnimation(VillageState.random(), routeRobot, []);
```

if}}

## Busca de caminho

Ainda assim, eu não chamaria realmente de comportamento inteligente seguir cegamente uma rota fixa. O ((robô)) poderia trabalhar mais eficientemente se ajustasse seu comportamento ao trabalho real que precisa ser feito.

{{index pathfinding}}

Para isso, ele precisa ser capaz de se mover deliberadamente em direção a uma dada encomenda ou em direção ao local onde uma encomenda precisa ser entregue. Fazer isso, mesmo quando o objetivo está a mais de um movimento de distância, exigirá algum tipo de função de busca de caminho.

O problema de encontrar uma rota através de um ((grafo)) é um típico _((problema de busca))_. Podemos dizer se uma dada solução (uma rota) é válida, mas não podemos calcular diretamente a solução como faríamos para 2 + 2. Em vez disso, temos que continuar criando soluções potenciais até encontrar uma que funcione.

O número de rotas possíveis através de um grafo é infinito. Mas ao procurar uma rota de _A_ para _B_, estamos interessados apenas naquelas que começam em _A_. Também não nos importamos com rotas que visitam o mesmo lugar duas vezes — essas definitivamente não são a rota mais eficiente para lugar nenhum. Isso reduz o número de rotas que o buscador precisa considerar.

Na verdade, como estamos interessados principalmente na rota _mais curta_, queremos ter certeza de que olhamos para rotas curtas antes de olhar para as mais longas. Uma boa abordagem seria "crescer" rotas a partir do ponto de partida, explorando cada lugar acessível que ainda não foi visitado, até que uma rota alcance o objetivo. Dessa forma, exploraremos apenas rotas potencialmente interessantes, e sabemos que a primeira rota que encontrarmos é a mais curta (ou uma das mais curtas, se houver mais de uma).

{{index "findRoute function"}}

{{id findRoute}}

Aqui está uma função que faz isso:

```{includeCode: true}
function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some(w => w.at == place)) {
        work.push({at: place, route: route.concat(place)});
      }
    }
  }
}
```

A exploração precisa ser feita na ordem correta — os lugares que foram alcançados primeiro precisam ser explorados primeiro. Não podemos explorar imediatamente um lugar assim que o alcançamos, porque isso significaria que lugares alcançados _a partir de lá_ também seriam explorados imediatamente, e assim por diante, mesmo que possam existir outros caminhos mais curtos que ainda não foram explorados.

Portanto, a função mantém uma _((lista de trabalho))_. Este é um *array* de lugares que devem ser explorados em seguida, juntamente com a rota que nos levou até lá. Ela começa apenas com a posição inicial e uma rota vazia.

A busca então opera pegando o próximo item da lista e explorando-o, o que significa que examina todas as estradas saindo daquele lugar. Se uma delas é o objetivo, uma rota finalizada pode ser retornada. Caso contrário, se ainda não olhamos para esse lugar, um novo item é adicionado à lista. Se já olhamos para ele antes, como estamos olhando para rotas curtas primeiro, encontramos uma rota mais longa para aquele lugar ou uma exatamente tão longa quanto a existente, e não precisamos explorá-lo.

Você pode visualizar isso como uma teia de rotas conhecidas se espalhando a partir do local de início, crescendo uniformemente por todos os lados (mas nunca se emaranhando consigo mesma). Assim que o primeiro fio alcança o local de destino, esse fio é rastreado de volta ao início, nos dando nossa rota.

{{index "connected graph"}}

Nosso código não lida com a situação em que não há mais itens de trabalho na lista de trabalho porque sabemos que nosso grafo é _conectado_, o que significa que cada local pode ser alcançado a partir de todos os outros locais. Sempre seremos capazes de encontrar uma rota entre dois pontos, e a busca não pode falhar.

```{includeCode: true}
function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}
```

{{index "goalOrientedRobot function"}}

Este robô usa seu valor de memória como uma lista de direções para se mover, assim como o robô seguidor de rota. Sempre que essa lista está vazia, ele precisa descobrir o que fazer em seguida. Ele pega a primeira encomenda não entregue do conjunto e, se essa encomenda ainda não foi coletada, traça uma rota até ela. Se a encomenda _já_ foi coletada, ela ainda precisa ser entregue, então o robô cria uma rota até o endereço de entrega.

{{if interactive

Vamos ver como ele se sai.

```{test: no, startCode: true}
runRobotAnimation(VillageState.random(),
                  goalOrientedRobot, []);
```

if}}

Este robô geralmente termina a tarefa de entregar 5 encomendas em cerca de 16 turnos. Isso é um pouco melhor que `routeRobot`, mas ainda definitivamente não é ótimo. Continuaremos refinando-o nos exercícios.

## Exercícios

### Medindo um robô

{{index "measuring a robot (exercise)", testing, automation, "compareRobots function"}}

É difícil comparar ((robô))s objetivamente apenas deixando-os resolver alguns cenários. Talvez um robô tenha recebido tarefas mais fáceis ou o tipo de tarefa em que é bom, enquanto o outro não.

Escreva uma função `compareRobots` que recebe dois robôs (e suas memórias iniciais). Ela deve gerar 100 tarefas e deixar ambos os robôs resolverem cada uma dessas tarefas. Quando terminar, deve exibir o número médio de passos que cada robô levou por tarefa.

Para fins de justiça, certifique-se de dar cada tarefa a ambos os robôs, em vez de gerar tarefas diferentes por robô.

{{if interactive

```{test: no}
function compareRobots(robot1, memory1, robot2, memory2) {
  // Seu código aqui
}

compareRobots(routeRobot, [], goalOrientedRobot, []);
```
if}}

{{hint

{{index "measuring a robot (exercise)", "runRobot function"}}

Você precisará escrever uma variante da função `runRobot` que, em vez de registrar os eventos no console, retorne o número de passos que o robô levou para completar a tarefa.

Sua função de medição pode então, em um *loop*, gerar novos estados e contar os passos que cada um dos robôs leva. Quando tiver gerado medições suficientes, pode usar `console.log` para exibir a média de cada robô, que é o número total de passos dividido pelo número de medições.

hint}}

### Eficiência do robô

{{index "robot efficiency (exercise)"}}

Você consegue escrever um robô que termine a tarefa de entrega mais rápido que `goalOrientedRobot`? Se observar o comportamento desse robô, quais coisas obviamente estúpidas ele faz? Como elas poderiam ser melhoradas?

Se você resolveu o exercício anterior, pode usar sua função `compareRobots` para verificar se melhorou o robô.

{{if interactive

```{test: no}
// Seu código aqui

runRobotAnimation(VillageState.random(), yourRobot, memory);
```

if}}

{{hint

{{index "robot efficiency (exercise)"}}

A principal limitação de `goalOrientedRobot` é que ele considera apenas uma encomenda por vez. Ele frequentemente andará de um lado ao outro da vila porque a encomenda que está olhando por acaso está do outro lado do mapa, mesmo que haja outras muito mais perto.

Uma solução possível seria calcular rotas para todas as encomendas e então pegar a mais curta. Resultados ainda melhores podem ser obtidos, se houver múltiplas rotas mais curtas, preferindo aquelas que vão buscar uma encomenda em vez de entregar uma.

hint}}

### Grupo persistente

{{index "persistent group (exercise)", "persistent data structure", "Set class", "set (data structure)", "Group class", "PGroup class"}}

A maioria das estruturas de dados fornecidas no ambiente padrão do JavaScript não é muito adequada para uso persistente. *Arrays* têm os métodos `slice` e `concat`, que nos permitem criar novos *arrays* facilmente sem danificar o antigo. Mas `Set`, por exemplo, não tem métodos para criar um novo conjunto com um item adicionado ou removido.

Escreva uma nova classe `PGroup`, semelhante à classe `Group` do [Capítulo ?](object#groups), que armazena um conjunto de valores. Como `Group`, ela tem métodos `add`, `delete` e `has`. Seu método `add`, porém, deve retornar uma _nova_ instância de `PGroup` com o membro dado adicionado e deixar a antiga inalterada. Da mesma forma, `delete` deve criar uma nova instância sem um dado membro.

A classe deve funcionar para valores de qualquer tipo, não apenas *strings*. Ela _não_ precisa ser eficiente quando usada com grandes números de valores.

{{index [interface, object]}}

O ((construtor)) não deve fazer parte da interface da classe (embora você definitivamente vá querer usá-lo internamente). Em vez disso, existe uma instância vazia, `PGroup.empty`, que pode ser usada como valor inicial.

{{index singleton}}

Por que você precisa de apenas um valor `PGroup.empty` em vez de ter uma função que cria um novo map vazio toda vez?

{{if interactive

```{test: no}
class PGroup {
  // Seu código aqui
}

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
```

if}}

{{hint

{{index "persistent map (exercise)", "Set class", [array, creation], "PGroup class"}}

A maneira mais conveniente de representar o conjunto de valores membros é ainda como um *array*, já que *arrays* são fáceis de copiar.

{{index "concat method", "filter method"}}

Quando um valor é adicionado ao grupo, você pode criar um novo grupo com uma cópia do *array* original que tem o valor adicionado (por exemplo, usando `concat`). Quando um valor é deletado, você o filtra do *array*.

O ((construtor)) da classe pode receber esse *array* como argumento e armazená-lo como a (única) propriedade da instância. Esse *array* nunca é atualizado.

{{index "static property"}}

Para adicionar a propriedade `empty` ao construtor, você pode declará-la como uma propriedade estática.

Você precisa de apenas uma instância `empty` porque todos os grupos vazios são iguais e instâncias da classe não mudam. Você pode criar muitos grupos diferentes a partir desse único grupo vazio sem afetá-lo.

hint}}
