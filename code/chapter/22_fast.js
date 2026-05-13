var Graph = class Graph {
  #nodes = [];

  get size() {
    return this.#nodes.length;
  }

  addNode() {
    let id = this.#nodes.length;
    this.#nodes.push(new Set());
    return id;
  }

  addEdge(nodeA, nodeB) {
    this.#nodes[nodeA].add(nodeB);
    this.#nodes[nodeB].add(nodeA);
  }

  neighbors(node) {
    return this.#nodes[node];
  }
}

function randomLayout(graph) {
  let layout = [];
  for (let i = 0; i < graph.size; i++) {
    layout.push(new Vec(Math.random() * 1000,
                        Math.random() * 1000));
  }
  return layout;
}

function gridGraph(size) {
  let grid = new Graph();
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let id = grid.addNode();
      if (x > 0) grid.addEdge(id, id - 1);
      if (y > 0) grid.addEdge(id, id - size);
    }
  }
  return grid;
}

var springLength = 20;
var springStrength = 0.1;
var repulsionStrength = 1500;

function forceSize(distance, connected) {
  let repulse = -repulsionStrength / (distance * distance);
  let spring = 0;
  if (connected) {
    spring = (distance - springLength) * springStrength;
  }
  return spring + repulse;
}

function forceDirected_simple(layout, graph) {
  for (let a = 0; a < graph.size; a++) {
    for (let b = 0; b < graph.size; b++) {
      if (a == b) continue;
      let apart = layout[b].minus(layout[a]);
      let distance = Math.max(1, apart.length);
      let connected = graph.neighbors(a).has(b);
      let size = forceSize(distance, connected);
      let force = apart.times(1 / distance).times(size);
      layout[a] = layout[a].plus(force);
    }
  }
}

function pause() {
  return new Promise(done => setTimeout(done, 0))
}

async function runLayout(implementation, graph) {
  let time = 0, iterations = 0;
  let layout = randomLayout(graph);
  while (time < 3000) {
    let start = Date.now();
    for (let i = 0; i < 100; i++) {
      implementation(layout, graph);
      iterations++;
    }
    time += Date.now() - start;
    drawGraph(graph, layout);
    await pause();
  }
  let perSecond = Math.round(iterations / (time / 1000));
  console.log(`${perSecond} iterations per second`);
}

function forceDirected_noRepeat(layout, graph) {
  for (let a = 0; a < graph.size; a++) {
    for (let b = a + 1; b < graph.size; b++) {
      let apart = layout[b].minus(layout[a]);
      let distance = Math.max(1, apart.length);
      let connected = graph.neighbors(a).has(b);
      let size = forceSize(distance, connected);
      let force = apart.times(1 / distance).times(size);
      layout[a] = layout[a].plus(force);
      layout[b] = layout[b].minus(force);
    }
  }
}

var skipDistance = 175;

function forceDirected_skip(layout, graph) {
  for (let a = 0; a < graph.size; a++) {
    for (let b = a + 1; b < graph.size; b++) {
      let apart = layout[b].minus(layout[a]);
      let distance = Math.max(1, apart.length);
      let connected = graph.neighbors(a).has(b);
      if (distance > skipDistance && !connected) continue;
      let size = forceSize(distance, connected);
      let force = apart.times(1 / distance).times(size);
      layout[a] = layout[a].plus(force);
      layout[b] = layout[b].minus(force);
    }
  }
}

function forceDirected_noVector(layout, graph) {
  for (let a = 0; a < graph.size; a++) {
    let posA = layout[a];
    for (let b = a + 1; b < graph.size; b++) {
      let posB = layout[b];
      let apartX = posB.x - posA.x
      let apartY = posB.y - posA.y;
      let distance = Math.sqrt(apartX * apartX +
                               apartY * apartY);
      let connected = graph.neighbors(a).has(b);
      if (distance > skipDistance && !connected) continue;
      let size = forceSize(distance, connected);
      let forceX = (apartX / distance) * size;
      let forceY = (apartY / distance) * size;
      posA.x += forceX;
      posA.y += forceY;
      posB.x -= forceX;
      posB.y -= forceY;
    }
  }
}
