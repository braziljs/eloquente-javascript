import {readdirSync, readFileSync} from "fs"

let files = Object.create(null)
for (let name of readdirSync(".")) {
  let m = /^\d\d_(.*?)\.md$/.exec(name)
  if (m) files[m[1]] = readFileSync(name, "utf8")
}
files.fast = files.hints = ""

let fail = 0
function error(file, msg) {
  console.error(file + ": " + msg)
  fail = 1
}

let link = /\]\(([\w_]+)(?:#([\w_]+))?\)/g, m
for (let file in files) {
  while (m = link.exec(files[file])) {
    let [_, file, anchor] = m
    let target = files[file]
    if (target == null)
      error(file, "Unknown target file: " + file)
    else if (anchor && target.indexOf("{{id " + anchor + "}}") == -1)
      error(file, "Non-existing anchor: " + file + "#" + anchor)
  }
}

process.exit(fail)
