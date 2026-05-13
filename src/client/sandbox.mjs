import {parse} from "acorn"
import * as walk from "acorn-walk"

function parseStack(stack) {
  let found = [], m
  let re = /([\w$]*)@(.*?):(\d+)|\bat (?:([^\s(]+) \()?(.*?):(\d+)/g
  while (m = re.exec(stack)) {
    let fn = m[1] || m[4] || null
    let file = m[2] || m[5] || null
    if (fn && /sandbox/i.test(fn)) break
    found.push({fn, file, line: m[3] || m[6]})
  }
  return found
}
function frameString(frame) {
  return "line " + frame.line + (frame.fn ? " in function " + frame.fn : "")
}

export class Sandbox {
  static async create(options) {
    this.emptyPath = options.emptyPath || "./"
    let frame = document.createElement("iframe")
    frame.src = this.emptyPath + "empty.html"
    if (options.place) {
      options.place(frame)
    } else {
      frame.style.height = "0px"
      frame.style.border = "none"
      document.body.appendChild(frame)
    }
    await awaitEvent(frame, "load")

    let box = new Sandbox(frame)
    let scripts = (options.loadFiles || []).map(file => {
      let script = box.win.document.createElement("script")
      script.src = file
      box.win.document.body.appendChild(script)
      return awaitEvent(script, "load")
    })
    await Promise.all(scripts)
    return box
  }

  constructor(frame) {
    this.startedAt = null
    this.extraSecs = 2
    this.output = null
    this.handleDeps = true

    this.callbacks = {}
    // Used to cancel existing events when new code is loaded
    this.timeouts = []; this.intervals = []; this.frames = []
    this.framePos = 0

    // Loaded CommonJS modules
    this.loaded = new Cached(name => resolved.compute(name).then(({name, code}) => this.evalModule(name, code)))

    this.frame = frame
    this.win = frame.contentWindow
    this.setupEnv()

    const resize = () => {
      if (this.frame.style.display != "none") this.resizeFrame()
    }
    this.frame.addEventListener("load", resize)
    let resizeTimeout = null
    const scheduleResize = () => {
      this.win.clearTimeout(resizeTimeout)
      this.win.__setTimeout(resize, 200)
    }
    this.win.addEventListener("keydown", scheduleResize)
    this.win.addEventListener("mousedown", scheduleResize)
  }

  async run(code, output) {
    if (output) this.output = output
    this.startedAt = Date.now()
    this.extraSecs = typeof code == "string" && /promtDirection/.test(code) ? 0.1 : 2
    this.win.__c = 0
    return this.prepare(code).then(code => this.sandbox_run(code)).catch(err => this.error(err))
  }

  // Should be above all user-run code, so that the stack trace can be
  // cut off at this point.
  sandbox_run(code) {
    return code instanceof Function ? code() : this.win.eval(code)
  }

  prepare(text) {
    let {code, dependencies} = preprocess(text, this)
    return (this.handleDeps ? Promise.all(dependencies.map(dep => this.loaded.compute(dep))) : Promise.resolve([]))
      .then(() => code)
  }

  evalModule(name, code) {
    if (/\.json$/.test(name))
      return this.loaded.store(name, {exports: JSON.parse(code)})

    let work = findDeps(code).map(dep => this.loaded.compute(resolveRelative(name, dep)))
    return Promise.all(work).then(() => {
      let f = new this.win.Function("require, exports, module, __dirname, __filename",
                                    code + "\n//# sourceURL=code" + randomID())
      let module = this.loaded.store(name, {exports: {}})
      f(dep => this.require(resolveRelative(name, dep)), module.exports, module, name, name)
      return module
    })
  }

  require(name) {
    let found = resolved.get(name)
    if (!found) throw new Error(`Could not load module '${name}'`)
    return this.loaded.get(found.name).exports
  }

  async setHTML(code, output) {
    this.clearEvents()
    let loc = String(this.win.document.location)
    if (loc != String(document.location) && !/\/empty\.html$/.test(loc)) {
      this.frame.src = this.emptyPath + "empty.html"
      await avaitEvent(this.frame, "load")
      this.setupEnv()
      return this.setHTML(code, output)
    }

    let scriptTags = [], sandbox = this, doc = this.win.document
    this.frame.style.display = "block"
    let scriptRE = /<script\b[^>]*?(?:\bsrc\s*=\s*('[^']+'|"[^"]+"|[^\s>]+)[^>]*)?>([\s\S]*?)<\/script>/g
    doc.documentElement.innerHTML = code.replace(scriptRE, function(_, src, content) {
      let tag = doc.createElement("script")
      if (src) {
        if (/["']/.test(src.charAt(0))) src = src.slice(1, src.length - 1)
        tag.src = src
      } else {
        tag.text = preprocess(content, sandbox).code
      }
      scriptTags.push(tag)
      return ""
    })

    this.frame.style.height = "80px"
    this.resizeFrame()
    if (output) this.output = output

    for (let tag of scriptTags) {
      sandbox.startedAt = Date.now()
      sandbox.extraSecs = 2
      sandbox.win.__c = 0
      if (tag.src) {
        doc.body.appendChild(tag)
        await awaitEvent(tag, "load")
      } else {
        await new Promise(ok => {
          let id = randomID()
          sandbox.callbacks[id] = () => { delete sandbox.callbacks[id]; ok() }
          tag.text += "\n;__sandbox.callbacks['" + id + "']();"
          doc.body.appendChild(tag)
        })
      }
    }

    if (scriptTags.length || doc.querySelector("img")) setTimeout(() => sandbox.resizeFrame(), 100)
  }

  setupEnv() {
    let win = this.win
    win.__sandbox = this

    win.onerror = (e, _file, line) => {
      if (!this.output) return
      this.output.out("error", [e + (line != null ? " (line " + line + ")" : "")])
      return true
    }
    win.console = {
      log: (...args) => this.out("log", args),
      error: (...args) => this.out("error", args),
      warn: (...args) => this.out("warn", args),
      info: (...args) => this.out("log", args)
    }
    win.setInterval(() => {
      this.startedAt = null
    }, 1000)

    win.__setTimeout = win.setTimeout
    win.__setInterval = win.setInterval
    win.setTimeout = (code, time, ...args) => {
      if (args.length && typeof code != "string") {
        let f = code
        code = () => f(...args)
      }
      let val = win.__setTimeout(() => this.run(code), time)
      this.timeouts.push(val)
      return val
    }
    win.setInterval = (code, time, ...args) => {
      if (args.length && typeof code != "string") {
        let f = code
        code = () => f(...args)
      }
      let val = win.__setInterval(() => this.run(code), time)
      this.intervals.push(val)
      return val
    }
    let reqAnimFrame = win.requestAnimationFrame
    win.requestAnimationFrame = f => {
      let val = reqAnimFrame.call(win, f)
      if (this.frames.length > 50)
        this.frames[this.framePos++ % 50] = val
      else
        this.frames.push(val)
      return val
    }

    win.addEventListener("unhandledrejection", e => this.error(e.reason))

    win.require = name => this.require(name)
    win.require.preload = (name, code) => resolved.store(name, {name, code})
    win.module = {exports: {}}
    win.exports = win.module.exports
  }

  resizeFrame() {
    this.frame.style.height = Math.max(80, Math.min(this.win.document.documentElement.offsetHeight + 2, 500)) + "px"
    let box = this.frame.getBoundingClientRect()
    if (box.bottom > box.top && box.top >= 0 && box.top < window.innerHeight && box.bottom > window.innerHeight) {
      window.scrollBy(0, Math.min(box.top, box.bottom - window.innerHeight))
    }
  }

  tick() {
    let now = Date.now()
    if (this.startedAt == null) this.startedAt = now
    if (now < this.startedAt + this.extraSecs * 1000) return
    let bail = confirm("This code has been running for " + this.extraSecs + " seconds. Abort it?")
    this.startedAt += Date.now() - now
    this.extraSecs += Math.max(this.extraSecs, 8)
    if (bail) throw new Error("Aborted")
  }

  out(type, args) {
    if (this.output) this.output.out(type, args)
    else console[type].apply(console, args)
  }

  error(exception) {
    if (!this.output) throw exception
    let stack = parseStack(exception.stack)
    this.output.out("error", [String(exception) + (stack.length ? " (" + frameString(stack[0]) + ")" : "")])
    if (stack.length > 1) {
      this.output.div.lastChild.appendChild(document.createTextNode(" "))
      let mark = this.output.div.lastChild.appendChild(document.createElement("span"))
      mark.innerHTML = "…"
      mark.className = "sandbox-output-etc"
      mark.addEventListener("click", () => {
        mark.className = ""
        mark.innerHTML = "\n called from " + stack.slice(1).map(frameString).join("\n called from ")
      })
    }
  }

  clearEvents() {
    while (this.timeouts.length) this.win.clearTimeout(this.timeouts.pop())
    while (this.intervals.length) this.win.clearInterval(this.intervals.pop())
    while (this.frames.length) this.win.cancelAnimationFrame(this.frames.pop())
    this.timeouts.length = this.intervals.length = this.frames.length = this.framePos = 0
  }
}

function preprocess(code, sandbox) {
  if (typeof code != "string") {
    if (code.apply) {
      let orig = code
      code = (...args) => {
        try { return orig.apply(null, args) }
        catch(e) { sandbox.error(e) }
      }
    }
    return {code, dependencies: []}
  }

  if (!/\n$/.test(code)) code += "\n"
  let strict = /^(\s|\/\/.*)*["']use strict['"]/.test(code), ast
  try { ast = parse(code, {sourceType: detectSourceType(code), ecmaVersion: "latest"}) }
  catch(e) { return {code, dependencies: []} }
  let patches = []
  let backJump = ";if (++__c % 1000 === 0) __sandbox.tick();"
  function loop(node) {
    if (node.body.type == "BlockStatement") {
      patches.push({from: node.body.end - 1, text: backJump})
    } else {
      patches.push({from: node.body.start, text: "{"},
                   {from: node.body.end, text: backJump + "}"})
    }
  }
  let dependencies = []

  walk.simple(ast, {
    ForStatement: loop,
    ForInStatement: loop,
    WhileStatement: loop,
    DoWhileStatement: loop,
    CallExpression(node) {
      if (node.callee.type == "Identifier" && node.callee.name == "require" &&
          node.arguments.length == 1 && node.arguments[0].type == "Literal" &&
          typeof node.arguments[0].value == "string" && !dependencies.includes(node.arguments[0].value))
        dependencies.push(node.arguments[0].value)
    },
    ImportDeclaration(node) {
      dependencies.push(node.source.value)
      let req = "require(" + node.source.raw + ")", text
      if (node.specifiers.length == 0) {
        text = req
      } else if (node.specifiers.length > 1 || node.specifiers[0].type == "ImportDefaultSpecifier") {
        let name = "m_" + node.source.value.replace(/\W+/g, "_") + "__"
        text = "var " + name + " = " + req
        node.specifiers.forEach(spec => {
          if (spec.type == "ImportDefaultSpecifier")
            text += ", " + spec.local.name + " = " + name + ".default || " + name
          else if (name != null)
            text += ", " + spec.local.name + " = " + name + "." + spec.imported.name
        })
      } else {
        text = "var "
        node.specifiers.forEach(spec => {
          if (spec.type == "ImportNamespaceSpecifier")
            text += spec.local.name + " = " + req
          else
            text += spec.local.name + " = " + req + "." + spec.imported.name
        })
      }
      patches.push({from: node.start, to: node.end, text: text + ";"})
    },
    ExportNamedDeclaration(node) {
      if (node.source || !node.declaration)
        patches.push({from: node.start, to: node.end, text: ""})
      else
        patches.push({from: node.start, to: node.declaration.start, text: ""})
    },
    ExportDefaultDeclaration(node) {
      if (/Declaration/.test(node.declaration.type)) {
        patches.push({from: node.start, to: node.declaration.start, text: ""})
      } else {
        patches.push({from: node.start, to: node.declaration.start, text: ";("},
                     {from: node.declaration.end, text: ")"})
      }
    },
    ExportAllDeclaration: function(node) {
      patches.push({from: node.start, to: node.end, text: ""})
    }
  })

  let tryPos = 0, catchPos = ast.end
  for (let i = strict ? 1 : 0; i < ast.body.length; i++) {
    let stat = ast.body[i]
    if (stat.type != "FunctionDeclaration") {
      if (tryPos == 0) tryPos = stat.start
      catchPos = stat.end
    }
    if (stat.type == "VariableDeclaration" && stat.kind != "var") {
      if (stat.kind == "const") {
        let found = findAssignmentsTo(stat.declarations, ast)
        if (found) patches.push({from: 0, text: `throw new TypeError("invalid assignment to const '${found}'");`})
      }
      patches.push({from: stat.start, to: stat.start + stat.kind.length, text: "var"})
    }
    if (stat.type == "ClassDeclaration")
      patches.push({from: stat.start, text: "var " + stat.id.name + " = "})
  }

  patches.push({from: tryPos, text: "try{", priority: 10})
  patches.push({from: catchPos, text: "}catch(e){__sandbox.error(e);}", priority: -10})
  patches.sort((a, b) => a.from - b.from || (a.to || a.from) - (b.to || b.from) || (b.priority || 0) - (a.priority || 0))
  let out = "", pos = 0
  for (let i = 0; i < patches.length; ++i) {
    let patch = patches[i]
    out += code.slice(pos, patch.from) + patch.text
    pos = patch.to || patch.from
  }
  out += code.slice(pos, code.length)
  out += "\n//# sourceURL=code" + randomID()
  return {code: (strict ? '"use strict";' : "") + out, dependencies}
}

function findAssignmentsTo(decls, ast) {
  let found = null
  for (let i = 0; i < decls.length; i++)
    walk.simple(decls[i].id, {
      VariablePattern(node) { if (findAssignments(node.name, ast)) found = node.name }
    }, null, null, "Pattern")
  return found
}

function findAssignments(name, ast) {
  let found = false
  walk.ancestor(ast, {
    AssignmentExpression(node, ancestors) {
      if (node.left.type != "Identifier" || node.left.name != name) return
      for (let i = 2; i < ancestors.length; i++) if (/Statement|Declaration/.test(ancestors[i].type)) return
      found = true
    }
  })
  return found
}

function detectSourceType(code) {
  return /(^|\n)\s*(im|ex)port\b/.test(code) ? "module" : "script"
}

function randomID() {
  return Math.floor(Math.random() * 0xffffffff).toString(16)
}

function findDeps(code) {
  let deps = [], ast
  try { ast = parse(code) }
  catch(e) { return deps }
  walk.simple(ast, {
    CallExpression(node) {
      if (node.callee.type == "Identifier" && node.callee.name == "require" &&
          node.arguments.length == 1 && node.arguments[0].type == "Literal" &&
          typeof node.arguments[0].value == "string" && !deps.includes(node.arguments[0].value))
        deps.push(node.arguments[0].value)
    }
  })
  return deps
}

function resolveRelative(base, path) {
  if (!/\.\.?\//.test(path)) return path
  base = base.replace(/[^\/]+$/, "")
  let m
  while (m = /^\.(\.)?\//.exec(path)) {
    if (m[1]) base = base.replace(/\/[^\/]+\/$/, "/")
    path = path.slice(m[0].length)
  }
  return base + path
}

class Cached {
  constructor(mapping) {
    this.mapping = mapping
    this.work = Object.create(null)
    this.done = Object.create(null)
  }

  compute(value) {
    return this.work[value] || (this.work[value] = this.mapping(value).then(result => this.done[value] = result))
  }

  store(value, result) {
    this.work[value] = Promise.resolve(result)
    return this.done[value] = result
  }

  get(value) {
    return this.done[value]
  }
}

// Cache for loaded code and resolved unpkg redirects
const resolved = new Cached(name => fetch("https://unpkg.com/" + name.replace(/\/$/, "")).then(resp => {
  if (resp.status >= 400) throw new Error(`Failed to resolve package '${name}'`)
  let found = resp.url.replace(/.*unpkg\.com\//, "")
  let known = resolved.get(found)
  return known || resp.text().then(code => resolved.store(found, {name: found, code}))
}))

Sandbox.Output = class {
  constructor(div) { this.div = div }

  clear() {
    let clone = this.div.cloneNode(false)
    this.div.parentNode.replaceChild(clone, this.div)
    this.div = clone
  }

  get empty() {
    return !this.div.firstChild
  }

  out(type, args) {
    let wrap = document.createElement("pre")
    wrap.className = "sandbox-output-" + type
    for (let i = 0; i < args.length; ++i) {
      let arg = args[i]
      if (i) wrap.appendChild(document.createTextNode(" "))
      if (typeof arg == "string")
        wrap.appendChild(document.createTextNode(arg))
      else
        wrap.appendChild(represent(arg, 58))
    }
    this.div.appendChild(wrap)
  }
}

function span(type, text) {
  let sp = document.createElement("span")
  sp.className = "sandbox-output-" + type
  sp.appendChild(document.createTextNode(text))
  return sp
}

function eltSize(elt) {
  return elt.textContent.length
}

function represent(val, space) {
  if (typeof val == "boolean") return span("bool", String(val))
  if (typeof val == "number") return span("number", String(val))
  if (typeof val == "string") return span("string", JSON.stringify(val))
  if (typeof val == "symbol") return span("symbol", String(val))
  if (val == null) return span("null", String(val))
  if (Array.isArray(val)) return representArray(val, space)
  else return representObj(val, space)
}

function representArray(val, space) {
  space -= 2
  let wrap = document.createElement("span")
  wrap.appendChild(document.createTextNode("["))
  for (let i = 0; i < val.length; ++i) {
    if (i) {
      wrap.appendChild(document.createTextNode(", "))
      space -= 2
    }
    let next = space > 0 && represent(val[i], space)
    let nextSize = next ? eltSize(next) : 0
    if (space - nextSize <= 0) {
      wrap.appendChild(span("etc", "…")).addEventListener("click", () => expandObj(wrap, "array", val))
      break
    }
    space -= nextSize
    wrap.appendChild(next)
  }
  wrap.appendChild(document.createTextNode("]"))
  return wrap
}

function representObj(val, space) {
  let string = typeof val.toString == "function" && val.toString(), m
  if (!string || /^\[object .*\]$/.test(string))
    return representSimpleObj(val, space)
  if (val.call && (m = string.match(/^\s*(function[^(]*\([^)]*\))/)))
    return span("fun", m[1] + "{…}")
  let elt = span("etc", string)
  elt.addEventListener("click", () => expandObj(elt, "obj", val))
  return elt
}

function constructorName(obj) {
  if (!obj.constructor) return null
  let m = String(obj.constructor).match(/^function\s*([^\s(]+)/)
  if (m && m[1] != "Object") return m[1]
}

function hop(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function representSimpleObj(val, space) {
  space -= 2
  let wrap = document.createElement("span")
  let name = constructorName(val)
  if (name) {
    space -= name.length
    wrap.appendChild(document.createTextNode(name))
  }
  wrap.appendChild(document.createTextNode("{"))
  try {
    let first = true
    for (let prop in val) if (hop(val, prop)) {
      if (first) {
        first = false
      } else {
        space -= 2
        wrap.appendChild(document.createTextNode(", "))
      }
      let next = space > 0 && represent(val[prop], space)
      let nextSize = next ? prop.length + 2 + eltSize(next) : 0
      if (space - nextSize <= 0) {
        wrap.appendChild(span("etc", "…")).addEventListener("click", () => expandObj(wrap, "obj", val))
        break
      }
      space -= nextSize
      wrap.appendChild(span("prop", prop + ": "))
      wrap.appendChild(next)
    }
  } catch (e) {
    wrap.appendChild(document.createTextNode("…"))
  }
  wrap.appendChild(document.createTextNode("}"))
  return wrap
}

function expandObj(node, type, val) {
  let wrap = document.createElement("span")
  let opening = type == "array" ? "[" : "{", cname
  if (opening == "{" && (cname = constructorName(val))) opening = cname + " {"
  wrap.appendChild(document.createTextNode(opening))
  let block = wrap.appendChild(document.createElement("div"))
  block.className = "sandbox-output-etc-block"
  let table = block.appendChild(document.createElement("table"))
  function addProp(name) {
    let row = table.appendChild(document.createElement("tr"))
    row.appendChild(document.createElement("td")).appendChild(span("prop", name + ":"))
    row.appendChild(document.createElement("td")).appendChild(represent(val[name], 40))
  }
  if (type == "array") {
    for (let i = 0; i < val.length; ++i) addProp(i)
  } else {
    for (let prop in val) if (hop(val, prop)) addProp(prop)
  }
  wrap.appendChild(document.createTextNode(type == "array" ? "]" : "}"))
  node.parentNode.replaceChild(wrap, node)
}

function awaitEvent(target, event) {
  return new Promise(accept => {
    let done = () => {
      target.removeEventListener(event, done)
      accept()
    }
    target.addEventListener(event, done)
  })
}
