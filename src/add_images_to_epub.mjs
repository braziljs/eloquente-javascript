import {readdirSync, lstatSync, readFileSync, writeFileSync} from "fs"
import * as path from "path"

let images = []
function scanDir(dir) {
  for (let file of readdirSync(dir)) {
    let full = path.resolve(dir, file), type
    if (lstatSync(full).isDirectory())
      return scanDir(full)
    if (/\.svg$/.test(file))
      type = "image/svg+xml"
    else if (/\.png$/.test(file))
      type = "image/png"
    else if (/\.jpg$/.test(file))
      type = "image/jpeg"
    else
      throw new Error("Unknown image type: " + full)
    let local = full.slice(full.indexOf("/img/") + 1)
    images.push(`    <item id="image.${file}" href="${local}" media-type="${type}"/>`)
  }
}
scanDir("epub/img")

let out = readFileSync("epub/content.opf.src", "utf8").replace("{{images}}", images.join("\n"))
writeFileSync("epub/content.opf", out)
