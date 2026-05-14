// Fragile, hacky script that finds exercises in chapters, extracts
// their starting code, and collects it into a big JSON object
// together with the solution code.

import * as PJSON from "./pseudo_json.mjs"
import * as fs from "fs"
import * as path from "path"
import jszip from "jszip"

let output = [], failed = false;

for (let file of fs.readdirSync(".").sort()) {
  let match = /^((\d+).*).md$/.exec(file), chapNum = match && match[2];
  if (!match || chapNum == 22) continue;
  let text = fs.readFileSync(file, "utf8");

  let meta = (/{{meta (.*)}}/.exec(text) || {1: "{}"})[1]
  let includes = /\bload_files: (\[.*?\])/.exec(meta)
  if (includes) includes = JSON.parse(includes[1]);
  let chapter = {number: +chapNum,
                 id: match[1],
                 title: text.match(/(?:^|\n)# (.*?)\n/)[1],
                 start_code: getStartCode(text, includes),
                 exercises: [],
                 include: includes};
  let zip = chapterZipFile(meta, chapter);
  let extraLinks = meta.match(/\bcode_links: (\[.*?\])/);
  if (extraLinks) extraLinks = JSON.parse(extraLinks[1]);
  if (extraLinks || zip)
    chapter.links = (zip ? [zip] : []).concat(extraLinks || []);

  function addSolution(name, file, type, num, startCode) {
    let solution, extra
    try {
      solution = fs.readFileSync("code/solutions/" + file, "utf8");
      extra = /^\s*<!doctype html>\s*(<base .*\n(<script src=.*\n)*)?/.exec(solution);
      if (extra) solution = solution.slice(extra[0].length);
    } catch(e) {
      console.error("File ", file, " does not exist.", e);
      failed = true;
    }
    chapter.exercises.push({
      name,
      file: "code/solutions/" + file,
      number: num,
      type: type,
      code: type == "html" ? prepareHTML(startCode, includes) : startCode,
      solution: type == "html" ? prepareHTML(solution.trim(), includes) : solution.trim()
    });
  }

  let exerciseSection = text.indexOf("\n## Exercises\n");
  let exerciseBlock = exerciseSection >= 0 ? text.slice(exerciseSection) : "";
  let header = /\n### (.*?)\n/g, nextHeader = /\n##+ \w/g;
  let num = 1;

  while (match = header.exec(exerciseBlock)) {
    nextHeader.lastIndex = header.lastIndex
    let foundNext = nextHeader.exec(exerciseBlock)
    let nextsection = foundNext ? foundNext.index : -1
    for (let pos = header.lastIndex;;) {
      let ifdef = exerciseBlock.indexOf("{{if interactive", pos);
      if (ifdef == -1 || nextsection > 0 && nextsection < ifdef) break;
      let indef = exerciseBlock.slice(pos = ifdef + 15, exerciseBlock.indexOf("if}}", ifdef));
      let sourceBlock = indef.match(/```(.*)\n([^]+?)\n```/);
      if (!sourceBlock || sourceBlock[1].indexOf("null") > -1) continue;
      let type = sourceBlock[1].indexOf("html") > -1 ? "html" : "js";
      let file = chapNum + "_" + num + "_" + match[1].toLowerCase().replace(/[^\-\s\w]/g, "").replace(/\s/g, "_") + "." + type;
      addSolution(match[1], file, type, num, sourceBlock[2]);
    }
    ++num;
  }

  let nodeInfo = "// Node exercises can not be ran in the browser,\n// but you can look at their solution here.\n";
  if (chapter.number == 6) chapter.exercises.push({
    name: "Borrowing a method [3rd ed]",
    file: "code/solutions/06_4_borrowing_a_method.js",
    number: "4[3]",
    type: "js",
    code: "let map = {one: true, two: true, hasOwnProperty: true};\n\n// Fix this call\nconsole.log(map.hasOwnProperty(\"one\"));\n// → true",
    solution: "let map = {one: true, two: true, hasOwnProperty: true};\n\nconsole.log(Object.prototype.hasOwnProperty.call(map, \"one\"));\n// → true"
  })
  if (chapter.number == 11) chapter.exercises.push({
    name: "Tracking the scalpel [3rd ed]",
    file: "code/solutions/11_1_tracking_the_scalpel.js",
    number: "1[3]",
    type: "js",
    code: "async function locateScalpel(nest) {\n  // Your code here.\n}\n\nfunction locateScalpel2(nest) {\n  // Your code here.\n}\n\nlocateScalpel(bigOak).then(console.log);\n// → Butcher Shop",
    solution: "async function locateScalpel(nest) {\n  let current = nest.name;\n  for (;;) {\n    let next = await anyStorage(nest, current, \"scalpel\");\n    if (next == current) return current;\n    current = next;\n  }\n}\n\nfunction locateScalpel2(nest) {\n  function loop(current) {\n    return anyStorage(nest, current, \"scalpel\").then(next => {\n      if (next == current) return current;\n      else return loop(next);\n    });\n  }\n  return loop(nest.name);\n}\n\nlocateScalpel(bigOak).then(console.log);\n// → Butcher's Shop\nlocateScalpel2(bigOak).then(console.log);\n// → Butcher's Shop",
    goto: "https://eloquentjavascript.net/3rd_edition/code/#11.1"
  })
  if (chapter.number == 20) chapter.exercises = [
    {name: "Search tool",
     file: "code/solutions/20_1_search_tool.mjs",
     number: 1,
     type: "js",
     code: nodeInfo,
     solution: fs.readFileSync("code/solutions/20_1_search_tool.mjs", "utf8")
    },
    {name: "Directory creation",
     file: "code/solutions/20_2_directory_creation.mjs",
     number: 2,
     type: "js",
     code: nodeInfo,
     solution: fs.readFileSync("code/solutions/20_2_directory_creation.mjs", "utf8")
    },
    {name: "A public space on the web",
     file: "code/solutions/20_3_a_public_space_on_the_web.zip",
     number: 3,
     type: "js",
     code: nodeInfo,
     solution: "// This solutions consists of multiple files. Download it\n// though the link below.\n"
    }
  ];
  if (chapter.number == 21) chapter.exercises = [
    {name: "Disk persistence",
     file: "code/solutions/21_1_disk_persistence.mjs",
     number: 1,
     type: "js",
     code: nodeInfo,
     solution: fs.readFileSync("code/solutions/21_1_disk_persistence.mjs", "utf8")
    },
    {name: "Comment field resets",
     file: "code/solutions/21_2_comment_field_resets.mjs",
     number: 2,
     type: "js",
     code: nodeInfo,
     solution: fs.readFileSync("code/solutions/21_2_comment_field_resets.mjs", "utf8")
    }
  ];

  output.push(chapter);
}

output.push({
  title: "JavaScript and Performance",
  number: 22,
  start_code: "<!-- This chapter exists in the paper book, not in the online version -->\n\n<script>\n  runLayout(forceDirected_simple, gridGraph(12));\n</script>\n",
  include: ["code/draw_layout.js", "code/chapter/22_fast.js"],
  exercises: [
    {name: "Prime numbers",
     file: "code/solutions/22_1_prime_numbers.js",
     number: 1,
     type: "js",
     code: "function* primes() {\n  for (let n = 2;; n++) {\n    // ...\n  }\n}\n\nfunction measurePrimes() {\n  // ...\n}\n\nmeasurePrimes();\n",
     solution: fs.readFileSync("code/solutions/22_1_prime_numbers.js", "utf8")
    },
    {name: "Faster prime numbers",
     file: "code/solutions/22_2_faster_prime_numbers.js",
     number: 2,
     type: "js",
     code: "function* primes() {\n  for (let n = 2;; n++) {\n    // ...\n  }\n}\n\nfunction measurePrimes() {\n  // ...\n}\n\nmeasurePrimes();\n",
     solution: fs.readFileSync("code/solutions/22_2_faster_prime_numbers.js", "utf8"),
    },
    {name: "Pathfinding [3rd ed]",
     file: "code/solutions/22_1_pathfinding.js",
     number: "1[3]",
     type: "js",
     code: "function findPath(a, b) {\n  // Your code here...\n}\n\nlet graph = treeGraph(4, 4);\nlet root = graph[0], leaf = graph[graph.length - 1];\nconsole.log(findPath(root, leaf).length);\n// → 4\n\nleaf.connect(root);\nconsole.log(findPath(root, leaf).length);\n// → 2\n",
     solution: fs.readFileSync("code/solutions/22_1_pathfinding.js", "utf8"),
     goto: "https://eloquentjavascript.net/3rd_edition/code/#22.1"
    },
    {name: "Timing [3rd ed]",
     file: "code/solutions/22_2_timing.js",
     number: "2[3]",
     type: "js",
     code: "",
     solution: fs.readFileSync("code/solutions/22_2_timing.js", "utf8"),
     goto: "https://eloquentjavascript.net/3rd_edition/code/#22.2"
    },
    {name: "Optimizing [3rd ed]",
     file: "code/solutions/22_3_optimizing.js",
     number: "3[3]",
     type: "js",
     code: "",
     solution: fs.readFileSync("code/solutions/22_3_optimizing.js", "utf8"),
     goto: "https://eloquentjavascript.net/3rd_edition/code/#22.3"
    }
  ]
});

let usedSolutions = new Set()
for (let ch of output) for (let ex of ch.exercises) usedSolutions.add(path.basename(ex.file).replace(/\..*/, ""))
for (let file of fs.readdirSync("code/solutions/")) if (!usedSolutions.has(file.replace(/\..*/, ""))) {
  console.error("Solution file " + file + " was not used.");
  failed = true;
}

if (!failed)
  console.log("var chapterData = " + JSON.stringify(output, null, 2) + ";");
else
  process.exit(1);

function prepareHTML(code, include) {
  return "<!doctype html>\n" + (include || []).map(s => "<script src=\"" + s + "\"></script>\n").join("") + "\n" + code;
}

function guessType(code) {
  return /^[\s\w\n:]*</.test(code) ? "html" : "js";
}

function getStartCode(text, includes) {
  let found = /\n```(.*?\bstartCode:.*)\n([^]*?\n)```/.exec(text);
  if (!found) return ""

  let snippet = found[2].replace(/(\n|^)\s*\/\/ →.*\n/g, "$1");
  let directive = String(PJSON.parse(found[1]).startCode), m;
  if (m = directive.match(/top_lines:\s*(\d+)/))
    snippet = snippet.split("\n").slice(0, Number(m[1])).join("\n") + "\n";
  if (m = directive.match(/bottom_lines:\s*(\d+)/)) {
    let lines = snippet.trimRight().split("\n");
    snippet = lines.slice(lines.length - Number(m[1])).join("\n") + "\n";
  }
  if (guessType(snippet) == "html")
    return prepareHTML(snippet, includes);
  else
    return snippet;
}

function chapterZipFile(meta, chapter) {
  let spec = meta.match(/\bzip: ("(?:\\.|[^"\\])*")/);
  if (!spec) return null;
  if (!chapter.start_code) throw new Error("zip but no start code");
  let data = /(\S+)(?:\s+include=(.*))?/.exec(JSON.parse(spec[1]))
  let name = "code/chapter/" + chapter.id + ".zip";
  let files = (chapter.include || []).concat(data[2] ? JSON.parse(data[2]) : []).filter(f => !/(^|\/)_/.test(f));
  let exists = fs.existsSync(name) && fs.statSync(name).mtime;
  if (exists && files.every(file => fs.statSync("html/" + file).mtime < exists))
    return name;

  let zip = new jszip;
  for (let file of files) {
    zip.file(chapter.id + "/" + file, fs.readFileSync("html/" + file));
  }
  if (data[1].indexOf("html") != -1) {
    let html = chapter.start_code;
    if (guessType(html) != "html")
      html = prepareHTML("<body><script>\n" + html.trim() + "\n</script></body>", chapter.include);
    zip.file(chapter.id + "/index.html", html);
  }
  if (data[1].indexOf("node") != -1) {
    zip.file(chapter.id + "/code/load.js", fs.readFileSync("code/load.js", "utf8"));
    let js = chapter.start_code;
    if (chapter.include) js = "// load dependencies\nrequire(\"./code/load\")(" + chapter.include.map(JSON.stringify).join(", ") + ");\n\n" + js;
    zip.file(chapter.id + "/run_with_node.js", js);
  }
  zip.generateAsync({type: "uint8array"}).then(content => fs.writeFileSync(name, content));
  return name;
}
