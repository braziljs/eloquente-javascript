import {readdirSync, readFileSync} from "fs"

process.stdout.write("# Exercise Hints\n\nThe hints below might help when you are stuck with one of the exercises in this book. They don't give away the entire solution, but rather try to help you find it yourself.\n\n");

for (let name of readdirSync(".")) {
  if (!/^\d\d.*\.md$/.test(name)) continue

  let file = readFileSync(name, "utf8")
  let title = file.match(/(?:\n|^)# (.*?)\n/)[1], titleWritten = false

  let curSubsection
  let re = /\n### (.*?)\n|\{\{hint\n([^]+?)\nhint\}\}/g, m
  while (m = re.exec(file)) {
    if (m[1]) {
      curSubsection = m[1]
    } else {
      if (!titleWritten) {
        process.stdout.write(`## ${title}\n\n`)
        titleWritten = true
      }
      process.stdout.write(`### ${curSubsection}\n\n${m[2].trim()}\n\n`)
    }
  }
}
