import {readFileSync} from "fs"
import {basename} from "path"

let [template, ...chapters] = process.argv.slice(2)

function esc(str) {
  return str.replace(/[<>&"]/g, ch => ch == "<" ? "&lt;" : ch == ">" ? "&gt;" : ch == "&" ? "&amp;" : "&quot;")
}

let toc = ""
const section = /<h2\b[^>]*><a [^>]*?id="(h_.*?)".*?><\/a>(.*?)<\/h2>/g

for (let chapter of chapters) {
  let text = readFileSync(chapter, "utf8")
  let base = basename(chapter)
  let title = /<h1.*?>(.*?)<\/h1>/.exec(text)[1]
  toc += `        <li><a href="${base}">${esc(title)}</a>
          <ol>\n`
  for (let match; match = section.exec(text);)
    toc += `            <li><a href="${base}#${match[1]}">${esc(match[2])}</a></li>\n`
  toc += `         </ol>
        </li>\n`
}

console.log(readFileSync(template, "utf8").replace("{{full_toc}}", toc))
