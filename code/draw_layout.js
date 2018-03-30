// The familiar Vec type.

class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  minus(other) {
    return new Vec(this.x - other.x, this.y - other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

// Since we will want to inspect the layouts our code produces, let's
// first write code to draw a graph onto a canvas. Since we don't know
// in advance how big the graph is, the `Scale` object computes a
// scale and offset so that all nodes fit onto the given canvas.

const nodeSize = 8;

function drawGraph(graph) {
  let canvas = document.querySelector("canvas");
  if (!canvas) {
    canvas = document.body.appendChild(document.createElement("canvas"));
    canvas.width = canvas.height = 400;
  }
  let cx = canvas.getContext("2d");

  cx.clearRect(0, 0, canvas.width, canvas.height);
  let scale = new Scale(graph, canvas.width, canvas.height);

  // Draw the edges.
  cx.strokeStyle = "orange";
  cx.lineWidth = 3;
  for (let i = 0; i < graph.length; i++) {
    let origin = graph[i];
    for (let target of origin.edges) {
      if (graph.indexOf(target) <= i) continue;
      cx.beginPath();
      cx.moveTo(scale.x(origin.pos.x), scale.y(origin.pos.y));
      cx.lineTo(scale.x(target.pos.x), scale.y(target.pos.y));
      cx.stroke();
    }
  }

  // Draw the nodes.
  cx.fillStyle = "purple";
  for (let node of graph) {
    cx.beginPath();
    cx.arc(scale.x(node.pos.x), scale.y(node.pos.y), nodeSize, 0, 7);
    cx.fill();
  }
}

// The function starts by drawing the edges, so that they appear
// behind the nodes. Since the nodes on _both_ side of an edge refer
// to each other, and we don't want to draw every edge twice, edges
// are only drawn then the target comes _after_ the current node in
// the `graph` array.

// When the edges have been drawn, the nodes are drawn on top of them
// as purple discs. Remember that the last argument to `arc` gives the
// rotation, and we have to pass something bigger than 2π to get a
// full circle.

// Finding a scale at which to draw the graph is done by finding the
// top left and bottom right corners of the area taken up by the
// nodes. The offset at which nodes are drawn is based on the top left
// corner, and the scale is based on the size of the canvas divided by
// the distance between those corners. The function reserves space
// along the sides of the canvas based on the `nodeSize` variable, so
// that the circles drawn around nodes’ center points don't get cut off.

class Scale {
  constructor(graph, width, height) {
    let xs = graph.map(node => node.pos.x);
    let ys = graph.map(node => node.pos.y);
    let minX = Math.min(...xs);
    let minY = Math.min(...ys);
    let maxX = Math.max(...xs);
    let maxY = Math.max(...ys);

    this.offsetX = minX; this.offsetY = minY;
    this.scaleX = (width - 2 * nodeSize) / (maxX - minX);
    this.scaleY = (height - 2 * nodeSize) / (maxY - minY);
  }

  // The `x` and `y` methods convert from graph coordinates into
  // canvas coordinates.
  x(x) {
    return this.scaleX * (x - this.offsetX) + nodeSize;
  }
  y(y) {
    return this.scaleY * (y - this.offsetY) + nodeSize;
  }
}
