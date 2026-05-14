function time(findPath) {
  let graph = treeGraph(6, 6);
  let startTime = Date.now();
  let result = findPath(graph[0], graph[graph.length - 1]);
  console.log(`Path with length ${result.length} found in ${Date.now() - startTime}ms`);
}

function findPath_set(a, b) {
  let work = [[a]];
  let reached = new Set([a]);
  for (let path of work) {
    let end = path[path.length - 1];
    if (end == b) return path;
    for (let next of end.edges) {
      if (!reached.has(next)) {
        reached.add(next);
        work.push(path.concat([next]));
      }
    }
  }
}

time(findPath_set);

function pathToArray(path) {
  let result = [];
  for (; path; path = path.via) result.unshift(path.at);
  return result;
}

function findPath_list(a, b) {
  let work = [{at: a, via: null}];
  let reached = new Set([a]);
  for (let path of work) {
    if (path.at == b) return pathToArray(path);
    for (let next of path.at.edges) {
      if (!reached.has(next)) {
        reached.add(next);
        work.push({at: next, via: path});
      }
    }
  }
}

time(findPath_list);
