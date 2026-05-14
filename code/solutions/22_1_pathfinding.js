function findPath(a, b) {
  let work = [[a]];
  for (let path of work) {
    let end = path[path.length - 1];
    if (end == b) return path;
    for (let next of end.edges) {
      if (!work.some(path => path[path.length - 1] == next)) {
        work.push(path.concat([next]));
      }
    }
  }
}

let graph = treeGraph(4, 4);
let root = graph[0], leaf = graph[graph.length - 1];
console.log(findPath(root, leaf).length);
// → 4

leaf.connect(root);
console.log(findPath(root, leaf).length);
// → 2
