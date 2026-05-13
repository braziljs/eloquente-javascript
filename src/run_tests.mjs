// A collection of hacks that attempts to do as much sanity checking
// of the code in the source for a chapter as possible, without
// requiring excessive annotation.

import * as PJSON from "./pseudo_json.mjs"
import varify from "./varify.mjs"
import * as fs from "fs"
import * as acorn from "acorn"
import {request} from "http"
import require from "./require.js"

let file = process.argv[2]
let chapNum = Number(file.match(/^\d*/)[0])
let doRun = ![10, 11, 20, 21].includes(chapNum)
let input = fs.readFileSync(file, "utf8")

let baseCode = "let alert = function() {}, prompt = function() { return 'x' }, confirm = function() { return true }; window = this; requestAnimationFrame = setTimeout = clearTimeout = setInterval = clearInterval = Math.min; let localStorage = {setItem: function(a, b) { this[a] = b;}, getItem: function(a) { return this[a] || null }, removeItem: function(a) { delete this[a] }};\n"

let meta = /\{\{meta (.*?)\}\}\n/.exec(input)
let include = /\bload_files: (\[[^\]]+\])/.exec(meta ? meta[1] : "")
if (include) JSON.parse(include[1]).forEach(function(fileName) {
  if (fileName == "code/chapter/" + file.replace(/md/, "js")) return
  let text = fs.readFileSync("html/" + fileName)
  if (!/\/\/ test: no/.test(text))
    baseCode += text
})

function wrapTestOutput(snippet, config) {
  let output = "", m, re = /\/\/ → (.*\n)((?:\/\/   .*\n)*)/g
  while (m = re.exec(snippet)) {
    output += m[1]
    if (m[2]) output += m[2].replace(/\/\/   /g, "")
  }
  return "console.clear();\n" + snippet + "console.verify(" + JSON.stringify(output) + ", " + JSON.stringify(config) + ");\n"
}

function wrapForError(snippet, message) {
  return "try { (function() {\n" + snippet + "})();\n" +
    "console.missingErr()\n} catch (_e) { console.compareErr(_e, " +
    JSON.stringify(message) + ") }\n"
}

function pos(index) {
  return "line " + (input.slice(0, index).split("\n").length + 1)
}

let sandboxes = {}, anonId = 0

let re = /\n```(.*)\n([^]*?\n)```/g, m
while (m = re.exec(input)) {
  let [_, params, snippet] = m
  params = /\S/.test(params) ? PJSON.parse(params) : {}
  let config = params.test || "", type = params.lang || "javascript"
  let sandboxId = params.sandbox || (type == "javascript" ? "null" : "box" + (++anonId))
  let where = pos(m.index)

  if (type != "javascript" && type != "html") continue

  let sandbox = sandboxes[sandboxId]
  if (!sandbox)
    sandbox = sandboxes[sandboxId] = {code: ""}

  if (/\bnever\b/.test(config)) continue
  let stripped
  if (type == "html") {
    stripped = stripHTML(snippet)
    snippet = stripped.javascript
  }
  let onSemi = chapNum == 1 || /\bnosemi/.test(config) ? null : () => { throw new Error("Missing semicolon") }
  try {
    acorn.parse(snippet, {onInsertedSemicolon: onSemi,
                          sourceType: "module",
                          ecmaVersion: 2022})
  } catch(e) {
    console.log("parse error at " + where + ": " + e.toString())
  }
  snippet = varify(snippet)
  if (/\bno\b/.test(config)) continue
  if (m = config.match(/\berror "([^"]+)"/)) snippet = wrapForError(snippet, m[1])
  else if (/\/\/ →/.test(snippet)) snippet = wrapTestOutput(snippet, config)
  if (/\bwrap\b/.test(config)) snippet = "(function(){\n" + snippet + "}());\n"

  if (type == "html") {
    if (sandbox.html) console.log("Double HTML for box " + sandboxId)
    sandbox.html = stripped.html
    sandbox.code = stripped.included + "console.pos = " + JSON.stringify(where) + ";\n" + snippet + sandbox.code
  } else {
    sandbox.code += "console.pos = " + JSON.stringify(where) + ";\n"
    sandbox.code += snippet
  }
}

function stripHTML(code) {
  let included = "", script = ""
  code = code.replace(/<script\b[^>]*?(?:\bsrc\s*=\s*('[^']+'|"[^"]+"|[^\s>]+)[^>]*)?>([\s\S]*?)<\/script>/, function(m, src, content) {
    if (!src) {
      script += content
    } else if (doRun) {
      if (/["']/.test(src.charAt(0))) src = src.slice(1, src.length - 1)
      included += fs.readFileSync("html/" + src, "utf8")
    }
    return ""
  })
  return {html: code, included: included, javascript: script}
}

function represent(val) {
  if (typeof val == "boolean") return String(val)
  if (typeof val == "number") return String(val)
  if (typeof val == "string") return JSON.stringify(val)
  if (val == null) return String(val)
  if (Array.isArray(val)) return representArray(val)
  else return representObj(val)
}

function representArray(val) {
  let out = "["
  for (let i = 0; i < val.length; ++i) {
    if (i) out += ", "
    out += represent(val[i])
    if (out.length > 80) return out
  }
  return out + "]"
}

function representObj(val) {
  let string = val.toString(), m, elt
  if (/^\[object .*\]$/.test(string))
    return representSimpleObj(val)
  if (val.call && (m = string.match(/^\s*(function[^(]*\([^)]*\))/)))
    return m[1] + "{…}"
  return string
}

function constructorName(obj) {
  if (!obj.constructor) return null
  let m = String(obj.constructor).match(/^function\s*([^\s(]+)/)
  if (m && m[1] != "Object") return m[1]
}

function hop(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function representSimpleObj(val) {
  let out = "{", name = constructorName(val)
  if (name) out = name + " " + out
  let first = true
  for (let prop in val) if (hop(val, prop)) {
    if (out.length > 80) return out
    if (first) first = false
    else out += ", "
    out += prop + ": " + represent(val[prop])
  }
  return out + "}"
}

function compareClipped(a, b) {
  a = a.split("\n")
  b = b.split("\n")
  if (a.length != b.length) return false
  for (let i = 0; i < a.length; ++i) {
    let len = Math.max(0, a[i].length - 1)
    if (a[i].slice(0, len) != b[i].slice(0, len)) return false
  }
  return true
}

function compareJoined(a, b) {
  return a.replace(/\n\s*/g, " ").trim() == b.replace(/\n\s*/g, " ").trim()
}

let accum = "", _console = {
  clear: function() { accum = "" },
  log: function() {
    for (let i = 0; i < arguments.length; i++) {
      if (i) accum += " "
      if (typeof arguments[i] == "string")
        accum += arguments[i]
      else
        accum += represent(arguments[i])
    }
    accum += "\n"
  },
  verify: function(string, config) {
    let clip = string.indexOf("…"), ok = false
    accum = accum.replace(/\(Central European Standard Time\)/g, "(CET)")
    if (/\btrailing\b/.test(config)) accum = accum.replace(/\s+(\n|$)/g, "$1")
    if (/\btrim\b/.test(config)) { accum = accum.trim(); string = string.trim() }
    if (/\bnonumbers\b/.test(config)) { accum = accum.replace(/\d/g, ""); string = string.replace(/\d/g, "") }
    if (/\bclip\b/.test(config)) ok = compareClipped(string, accum)
    else if (/\bjoin\b/.test(config)) ok = compareJoined(string, accum)
    else if (clip > -1) ok = string.slice(0, clip) == accum.slice(0, clip)
    else ok = string == accum
    if (!ok)
      console.log("mismatch at " + this.pos + ". got:\n" + accum + "\nexpected:\n" + string)
  },
  missingErr: function() {
    console.log("expected error not raised at " + this.pos)
  },
  compareErr: function(err, string) {
    if (err.toString() != string)
      console.log("wrong error raised at " + this.pos + ": " + err.toString())
  },
  pos: null,
  console: console
}

function report(err) {
  let msg = err.toString()
  if (/^\[object/.test(msg) && err.message) msg = err.message
  console.log("error raised (" + _console.pos + "): " + msg, err.stack)
}

// Gruesome kludgery to make the node chapter tests run

let fakeFS = {}
for (let prop in fs) fakeFS[prop] = function() {
  let lastArg = arguments[arguments.length - 1]
  if (lastArg && lastArg.call) lastArg(null, "hi")
  return "ok"
}

let fakeHTTP = {
  request,
  createServer: function() { return {listen: Math.min} }
}

function fakeRequire(str) {
  if (str == "./garble") return function(string) {
    return string.split("").map(function(ch) {
      return String.fromCharCode(ch.charCodeAt(0) + 5)
    }).join("")
  }
  if (str == "./router") return require("../code/skillsharing/router")
  if (str == "serve-static") return Math.min
  if (str == "fs") return fakeFS
  if (str == "http") return fakeHTTP

  return require(str)
}

let i = 0, boxes = Object.keys(sandboxes).map(k => sandboxes[k])
function nextSandbox() {
  if (i == boxes.length) return
  let sandbox = boxes[i]
  i++
  if (chapNum < 13 || chapNum >= 20 && chapNum < 22) { // Language-only
    try {
      ;(new Function("console, require, module", baseCode + sandbox.code))(_console, chapNum >= 20 && fakeRequire, {})
      nextSandbox()
    } catch(e) {
      report(e)
    }
  } else {
    let {JSDOM} = require("jsdom")
    new JSDOM({
      url: "https://eloquentjavascript.net/" + file + "#" + i,
      html: sandbox.html || "<!doctype html><body></body>",
      src: [baseCode],
      done: function(err, window) {
        if (err) report(err[0])
        window.console = _console
        window.Element.prototype.innerText = "abc"
        try {
          window.run(sandbox.code, file + "#" + i)
        } catch (e) {
          report(e)
        }
        nextSandbox()
      }
    })
  }
}
if (doRun) nextSandbox()
