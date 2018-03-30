window.addEventListener("load", () => {
  // If there's no ecmascript 5 support, don't try to initialize
  if (!Object.create || !window.JSON) return

  let sandboxHint = null
  if (window.chapNum && window.chapNum < 20 && window.localStorage && !localStorage.getItem("usedSandbox")) {
    let pres = document.getElementsByTagName("pre")
    for (let i = 0; i < pres.length; i++) {
      let pre = pres[i]
      if (!/^(text\/)?(javascript|html)$/.test(pre.getAttribute("data-language")) ||
          chapNum == 1 && !/console\.log/.test(pre.textContent)) continue
      sandboxHint = elt("div", {"class": "sandboxhint"},
                        "edit & run code by clicking it")
      pre.insertBefore(sandboxHint, pre.firstChild)
      break
    }
  }

  document.body.addEventListener("click", e => {
    for (let n = e.target; n; n = n.parentNode) {
      if (n.className == "c_ident") return
      let lang = n.nodeName == "PRE" && n.getAttribute("data-language")
      if (/^(text\/)?(javascript|html)$/.test(lang))
        return activateCode(n, e, lang)
      if (n.nodeName == "DIV" && n.className == "solution")
        n.className = "solution open"
    }
  })

  function elt(type, attrs) {
    let firstChild = 1
    let node = document.createElement(type)
    if (attrs && typeof attrs == "object" && attrs.nodeType == null) {
      for (let attr in attrs) if (attrs.hasOwnProperty(attr)) {
        if (attr == "css") node.style.cssText = attrs[attr]
        else node.setAttribute(attr, attrs[attr])
      }
      firstChild = 2
    }
    for (let i = firstChild; i < arguments.length; ++i) {
      let child = arguments[i]
      if (typeof child == "string") child = document.createTextNode(child)
      node.appendChild(child)
    }
    return node
  }

  CodeMirror.commands[CodeMirror.keyMap.default.Down = "lineDownEscape"] = cm => {
    let cur = cm.getCursor()
    if (cur.line == cm.lastLine()) {
      document.activeElement.blur()
      return CodeMirror.Pass
    } else {
      cm.moveV(1, "line")
    }
  }
  CodeMirror.commands[CodeMirror.keyMap.default.Up = "lineUpEscape"] = cm => {
    let cur = cm.getCursor()
    if (cur.line == cm.firstLine()) {
      document.activeElement.blur()
      return CodeMirror.Pass
    } else {
      cm.moveV(-1, "line")
    }
  }

  let keyMap = {
    Esc(cm) { cm.display.input.blur() },
    "Ctrl-Enter"(cm) { runCode(cm.state.context) },
    "Cmd-Enter"(cm) { runCode(cm.state.context) },
    "Ctrl-`"(cm) { closeCode(cm.state.context) },
    "Ctrl-Q": resetSandbox
  }

  let nextID = 0
  let article = document.getElementsByTagName("article")[0]

  function activateCode(node, e, lang) {
    if (sandboxHint) {
      sandboxHint.parentNode.removeChild(sandboxHint)
      sandboxHint = null
      localStorage.setItem("usedSandbox", "true")
    }

    let code = node.textContent
    let wrap = node.parentNode.insertBefore(elt("div", {"class": "editor-wrap"}), node)
    let editor = CodeMirror(div => wrap.insertBefore(div, wrap.firstChild), {
      value: code,
      mode: lang,
      extraKeys: keyMap,
      matchBrackets: true,
      lineNumbers: true
    })
    let pollingScroll = null
    function pollScroll() {
      if (document.activeElement != editor.getInputField()) return
      let rect = editor.getWrapperElement().getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > innerHeight) editor.getInputField().blur()
      else pollingScroll = setTimeout(pollScroll, 500)
    }
    editor.on("focus", () => {
      clearTimeout(pollingScroll)
      pollingScroll = setTimeout(pollScroll, 500)
    })
    wrap.style.marginLeft = wrap.style.marginRight = -Math.min(article.offsetLeft, 100) + "px"
    setTimeout(() => editor.refresh(), 600)
    if (e) {
      editor.setCursor(editor.coordsChar({left: e.clientX, top: e.clientY}, "client"))
      editor.focus()
    }
    let out = wrap.appendChild(elt("div", {"class": "sandbox-output"}))
    let menu = wrap.appendChild(elt("div", {"class": "sandbox-menu", title: "Sandbox menu..."}))
    let sandbox = node.getAttribute("data-sandbox")
    if (lang == "text/html" && !sandbox) {
      sandbox = "html" + nextID++
      node.setAttribute("data-sandbox", sandbox)
      sandboxSnippets[sandbox] = node
    }
    node.style.display = "none"

    let data = editor.state.context = {editor: editor,
                                       wrap: wrap,
                                       orig: node,
                                       isHTML: lang == "text/html",
                                       sandbox: sandbox,
                                       meta: node.getAttribute("data-meta")}
    data.output = new SandBox.Output(out)
    menu.addEventListener("click", () => openMenu(data, menu))
  }

  function openMenu(data, node) {
    let menu = elt("div", {"class": "sandbox-open-menu"})
    let items = [["Run code (ctrl-enter)", () => runCode(data)],
                 ["Revert to original code", () => revertCode(data)],
                 ["Reset sandbox (ctrl-q)", () => resetSandbox(data.sandbox)]]
    if (!data.isHTML || !data.sandbox)
      items.push(["Deactivate editor (ctrl-`)", () => { closeCode(data) }])
    items.forEach(choice => menu.appendChild(elt("div", choice[0])))
    function click(e) {
      let target = e.target
      if (e.target.parentNode == menu) {
        for (let i = 0; i < menu.childNodes.length; ++i)
          if (target == menu.childNodes[i])
            items[i][1]()
      }
      menu.parentNode.removeChild(menu)
      window.removeEventListener("click", click)
    }
    setTimeout(() => window.addEventListener("click", click), 20)
    node.offsetParent.appendChild(menu)
  }

  function runCode(data) {
    data.output.clear()
    let val = data.editor.getValue()
    getSandbox(data.sandbox, data.isHTML, box => {
      if (data.isHTML)
        box.setHTML(val, data.output, () => {
          if (data.orig.getAttribute("data-focus")) {
            box.win.focus()
            box.win.document.body.focus()
          }
        })
      else
        box.run(val, data.output, data.meta)
    })
  }

  function closeCode(data) {
    if (data.isHTML && data.sandbox) return
    data.wrap.parentNode.removeChild(data.wrap)
    data.orig.style.display = ""
  }

  function revertCode(data) {
    data.editor.setValue(data.orig.textContent)
  }

  let sandboxSnippets = {}
  {
    let snippets = document.getElementsByClassName("snippet")
    for (let i = 0; i < snippets.length; i++) {
      let snippet = snippets[i]
      if (snippet.getAttribute("data-language") == "text/html" &&
          snippet.getAttribute("data-sandbox"))
        sandboxSnippets[snippet.getAttribute("data-sandbox")] = snippet
    }
  }

  let sandboxes = {}
  function getSandbox(name, forHTML, callback) {
    name = name || "null"
    if (sandboxes.hasOwnProperty(name)) return callback(sandboxes[name])
    let options = {loadFiles: window.sandboxLoadFiles}, html
    if (sandboxSnippets.hasOwnProperty(name)) {
      let snippet = sandboxSnippets[name]
      options.place = node => placeFrame(node, snippet)
      if (!forHTML) html = snippet.textContent
    }
    SandBox.create(options).then(box => {
      if (html != null)
        box.win.document.documentElement.innerHTML = html
      sandboxes[name] = box
      callback(box)
    })
  }

  function resetSandbox(name) {
    name = name || "null"
    if (!sandboxes.hasOwnProperty(name)) return
    let frame = sandboxes[name].frame
    frame.parentNode.removeChild(frame)
    delete sandboxes[name]
  }

  function placeFrame(frame, snippet) {
    let wrap = snippet.previousSibling, bot
    if (!wrap || wrap.className != "editor-wrap") {
      bot = snippet.getBoundingClientRect().bottom
      activateCode(snippet, null, "text/html")
      wrap = snippet.previousSibling
    } else {
      bot = wrap.getBoundingClientRect().bottom
    }
    wrap.insertBefore(frame, wrap.childNodes[1])
    if (bot < 50) {
      let newBot = wrap.getBoundingClientRect().bottom
      window.scrollBy(0, newBot - bot)
    }
  }
})
