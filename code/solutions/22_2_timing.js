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

function time(findPath) {
  let graph = treeGraph(6, 6);
  let startTime = Date.now();
  let result = findPath(graph[0], graph[graph.length - 1]);
  console.log(`Path with length ${result.length} found in ${Date.now() - startTime}ms`);
}
time(findPath);
