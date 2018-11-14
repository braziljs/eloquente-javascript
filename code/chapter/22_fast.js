var GraphNode = class GraphNode {
  constructor() {
    this.pos = new Vec(Math.random() * 1000,
                       Math.random() * 1000);
    this.edges = [];
  }
  connect(other) {
    this.edges.push(other);
    other.edges.push(this);
  }
  hasEdge(other) {
    return this.edges.includes(other);
  }
}

function treeGraph(depth, branches) {
  let graph = [new GraphNode()];
  if (depth > 1) {
    for (let i = 0; i < branches; i++) {
      let subGraph = treeGraph(depth - 1, branches);
      graph[0].connect(subGraph[0]);
      graph = graph.concat(subGraph);
    }
  }
  return graph;
}

var springLength = 40;
var springStrength = 0.1;

var repulsionStrength = 1500;

function forceDirected_simple(graph) {
  for (let node of graph) {
    for (let other of graph) {
      if (other == node) continue;
      let apart = other.pos.minus(node.pos);
      let distance = Math.max(1, apart.length);
      let forceSize = -repulsionStrength / (distance * distance);
      if (node.hasEdge(other)) {
        forceSize += (distance - springLength) * springStrength;
      }
      let normalized = apart.times(1 / distance);
      node.pos = node.pos.plus(normalized.times(forceSize));
    }
  }
}

function runLayout(implementation, graph) {
  function run(steps, time) {
    let startTime = Date.now();
    for (let i = 0; i < 100; i++) {
      implementation(graph);
    }
    time += Date.now() - startTime;
    drawGraph(graph);

    if (steps == 0) console.log(time);
    else requestAnimationFrame(() => run(steps - 100, time));
  }
  run(4000, 0);
}

function forceDirected_noRepeat(graph) {
  for (let i = 0; i < graph.length; i++) {
    let node = graph[i];
    for (let j = i + 1; j < graph.length; j++) {
      let other = graph[j];
      let apart = other.pos.minus(node.pos);
      let distance = Math.max(1, apart.length);
      let forceSize = -repulsionStrength / (distance * distance);
      if (node.hasEdge(other)) {
        forceSize += (distance - springLength) * springStrength;
      }
      let applied = apart.times(forceSize / distance);
      node.pos = node.pos.plus(applied);
      other.pos = other.pos.minus(applied);
    }
  }
}

var skipDistance = 175;

function forceDirected_skip(graph) {
  for (let i = 0; i < graph.length; i++) {
    let node = graph[i];
    for (let j = i + 1; j < graph.length; j++) {
      let other = graph[j];
      let apart = other.pos.minus(node.pos);
      let distance = Math.max(1, apart.length);
      let hasEdge = node.hasEdge(other);
      if (!hasEdge && distance > skipDistance) continue;
      let forceSize = -repulsionStrength / (distance * distance);
      if (hasEdge) {
        forceSize += (distance - springLength) * springStrength;
      }
      let applied = apart.times(forceSize / distance);
      node.pos = node.pos.plus(applied);
      other.pos = other.pos.minus(applied);
    }
  }
}

GraphNode.prototype.hasEdgeFast = function(other) {
  for (let i = 0; i < this.edges.length; i++) {
    if (this.edges[i] === other) return true;
  }
  return false;
};

function forceDirected_hasEdgeFast(graph) {
  for (let i = 0; i < graph.length; i++) {
    let node = graph[i];
    for (let j = i + 1; j < graph.length; j++) {
      let other = graph[j];
      let apart = other.pos.minus(node.pos);
      let distance = Math.max(1, apart.length);
      let hasEdge = node.hasEdgeFast(other);
      if (!hasEdge && distance > skipDistance) continue;
      let forceSize = -repulsionStrength / (distance * distance);
      if (hasEdge) {
        forceSize += (distance - springLength) * springStrength;
      }
      let applied = apart.times(forceSize / distance);
      node.pos = node.pos.plus(applied);
      other.pos = other.pos.minus(applied);
    }
  }
}

function forceDirected_noVector(graph) {
  for (let i = 0; i < graph.length; i++) {
    let node = graph[i];
    for (let j = i + 1; j < graph.length; j++) {
      let other = graph[j];
      let apartX = other.pos.x - node.pos.x;
      let apartY = other.pos.y - node.pos.y;
      let distance = Math.max(1, Math.sqrt(apartX * apartX + apartY * apartY));
      let hasEdge = node.hasEdgeFast(other);
      if (!hasEdge && distance > skipDistance) continue;
      let forceSize = -repulsionStrength / (distance * distance);
      if (hasEdge) {
        forceSize += (distance - springLength) * springStrength;
      }
      let forceX = apartX * forceSize / distance;
      let forceY = apartY * forceSize / distance;
      node.pos.x += forceX; node.pos.y += forceY;
      other.pos.x -= forceX; other.pos.y -= forceY;
    }
  }
}

var mangledGraph = treeGraph(4, 4);
for (let node of mangledGraph) {
  node[`p${Math.floor(Math.random() * 999)}`] = true;
}
