// Since the code for most chapter in Eloquent JavaScript isn't
// written with node's module system in mind, this kludge is used to
// load dependency files into the global namespace, so that the
// examples can run on node.

module.exports = function(...args) {
  for (let arg of args)
    (1,eval)(require("fs").readFileSync(__dirname + "/../" + arg, "utf8"))
}
