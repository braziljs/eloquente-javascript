import {EditorView, keymap} from "@codemirror/view"
import {Facet} from "@codemirror/state"
import {createState} from "./editor.mjs"
import {Sandbox} from "./sandbox.mjs"

function chapterInteraction() {
  document.querySelectorAll("button.help").forEach(button => {
    button.style.display = "inline"
    button.addEventListener("click", showHelp)
  })
  document.body.addEventListener("keydown", e => {
    let active = document.activeElement
    if (e.key == "?" && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (!active || (active.contentEditable != "true" && active.nodeName != "INPUT")) {
        e.preventDefault()
        showHelp()
      }
    }
    if (e.key == "Enter" && !e.ctrlKey && !e.altKey && !e.metaKey) {
      let editor = active && maybeActivateCode(active)
      if (editor) {
        e.preventDefault()
        editor.focus()
      }
    }
  })

  let modName = /Mac/.test(navigator.platform) ? "Cmd-" : "Ctrl-"

  function showHelp() {
    let popup = document.body.appendChild(document.createElement("div"))
    popup.className = "popup"
    popup.appendChild(document.createElement("h2")).textContent = "Instructions"
    popup.appendChild(document.createElement("p")).textContent = `Code snippets on this page can be edited and run by clicking them or moving focus to them and pressing Enter. Executed snippets share their environment with other snippets ran on the page, and some pre-defined code for the chapter. When inside the code editor, the following keyboard shortcuts are available:`
    for (let [key, desc] of [
      [modName + "Enter", "Run code"],
      [modName + "j", "Revert code"],
      [modName + "↓", "Deactivate editor"],
      [modName + "Escape", "Reset environment"],
    ]) {
      let b = popup.appendChild(document.createElement("div"))
      b.appendChild(document.createElement("kbd")).textContent = key
      b.appendChild(document.createTextNode(": " + desc))
    }
    popup.tabIndex = 0
    popup.addEventListener("blur", () => popup.remove())
    popup.addEventListener("keydown", e => {
      if (e.key == "Escape") { e.preventDefault(); popup.remove() }
    })
    popup.focus()
  }

  document.body.addEventListener("mousedown", e => {
    for (let n = e.target; n; n = n.parentNode) {
      if (n.className == "c_ident") return
      let editor = maybeActivateCode(n)
      if (editor) {
        e.preventDefault()
        setTimeout(() => {
          let pos = editor.posAtCoords({x: e.clientX, y: e.clientY}, false)
          editor.dispatch({selection: {anchor: pos}})
          editor.focus()
        }, 20)
        return
      }
    }
  })

  function elt(type, attrs) {
    let firstChild = 1
    let node = document.createElement(type)
    if (attrs && typeof attrs == "object" && attrs.nodeType == null) {
      for (let attr in attrs) if (attrs.hasOwnProperty(attr)) {
        let value = attrs[attr]
        if (attr == "css") node.style.cssText = value
        else if (typeof value !== "string") node[attr] = value
        else node.setAttribute(attr, value)
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

  const contextFacet = Facet.define({
    combine(vs) { return vs[0] }
  })


  const extraKeys = keymap.of([
    {key: "ArrowDown", run(cm) {
      let {main} = cm.state.selection
      if (!main.empty || main.head < cm.state.doc.length) return false
      document.activeElement.blur()
      return true
    }},
    {key: "ArrowUp", run(cm) {
      let {main} = cm.state.selection
      if (!main.empty || main.head > 0) return false
      document.activeElement.blur()
      return true
    }},
    {key: "Escape", run(cm) {
      cm.contentDOM.blur()
      return true
    }},
    {key: "Mod-Enter", run(cm) {
      runCode(cm)
      return true
    }},
    {key: "Mod-j", run(cm) {
      revertCode(cm)
      return true
    }},
    {key: "Mod-ArrowDown", run(cm) {
      closeCode(cm)
      return true
    }},
    {key: "Mod-Escape", run(cm) {
      resetSandbox(cm.state.facet(contextFacet).sandbox)
      return true
    }}
  ])

  function maybeActivateCode(element) {
    if (element.nodeName == "PRE") {
      let lang = element.getAttribute("data-language")
      if (/^(javascript|html)$/.test(lang))
        return activateCode(element, lang)
    }
  }

  let nextID = 0
  let article = document.getElementsByTagName("article")[0]

  function activateCode(node, lang) {
    let scrollPos = pageYOffset, rect = node.getBoundingClientRect()
    if (rect.top < 0 && rect.height > 500) scrollPos -= Math.min(-rect.top, rect.height - 500)
    let codeId = node.querySelector("a").id
    let code = (window.localStorage && localStorage.getItem(codeId)) || node.textContent
    let wrap = node.parentNode.insertBefore(elt("div", {"class": "editor-wrap"}), node)
    let pollingScroll = null
    function pollScroll() {
      if (document.activeElement != editor.contentDOM) return
      let rect = editor.dom.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > innerHeight) editor.contentDOM.blur()
      else pollingScroll = setTimeout(pollScroll, 500)
    }
    let sandbox = node.getAttribute("data-sandbox")
    let context = {
      wrap: wrap,
      orig: node,
      isHTML: lang == "html",
      sandbox,
      meta: node.getAttribute("data-meta")
    }
    let editorState = createState(code, lang, [
      extraKeys,
      EditorView.domEventHandlers({
        focus: (e, view) => {
          clearTimeout(pollingScroll)
          pollingScroll = setTimeout(pollScroll, 500)
          showEditorControls(view)
        },
        blur: (e, view) => {
          setTimeout(() => {
            if (!view.hasFocus) hideEditorControls(view)
          }, 100)
        }
      }),
      EditorView.updateListener.of(debounce(update => {
        if (update.docChanged && window.localStorage)
          localStorage.setItem(codeId, editor.state.doc.toString())
      }, 250)),
      contextFacet.of(context)
    ])
    let editor = new EditorView({state: editorState, parent: wrap})
    let out = wrap.appendChild(elt("div", {"class": "sandbox-output", "aria-live": "polite"}))
    context.output = new Sandbox.Output(out)
    if (lang == "html" && !sandbox) {
      sandbox = context.sandbox = "html" + nextID++
      node.setAttribute("data-sandbox", sandbox)
      sandboxSnippets[sandbox] = node
    }
    node.style.display = "none"
    // Cancel weird scroll stabilization magic from brower (which
    // doesn't work at all for this)
    window.scrollTo(pageXOffset, scrollPos)
    setTimeout(() => window.scrollTo(pageXOffset, scrollPos), 20)
    return editor
  }

  function openMenu(editor, node) {
    let menu = elt("div", {"class": "sandbox-open-menu"})
    let context = editor.state.facet(contextFacet)
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

  function runCode(editor) {
    let context = editor.state.facet(contextFacet)
    context.output.clear()
    let val = editor.state.doc.toString()
    getSandbox(context.sandbox, context.isHTML).then(box => {
      if (context.isHTML)
        box.setHTML(val, context.output).then(() => {
          if (context.orig.getAttribute("data-focus")) {
            box.win.focus()
            box.win.document.body.focus()
          }
        })
      else
        box.run(val, context.output).then(value => {
          if (value != null && context.meta && /\bexpr\b/.test(context.meta) && context.output.empty)
            box.out("log", [value])
        })
    })
  }

  function closeCode(editor) {
    let context = editor.state.facet(contextFacet)
    if (context.isHTML && context.sandbox) return
    context.wrap.remove()
    context.orig.style.display = ""
  }

  function revertCode(editor) {
    let context = editor.state.facet(contextFacet)
    editor.dispatch({
      selection: {anchor: 0},
      changes: {from: 0, to: editor.state.doc.length, insert: context.orig.textContent}
    })
  }

  function showEditorControls(editor) {
    if (editor.dom.parentNode.querySelector(".editor-controls")) return
    editor.dom.parentNode.appendChild(elt("div", {
      class: "editor-controls"
    }, elt("button", {
      onmousedown: e => {
        runCode(editor)
        e.preventDefault()
      },
      title: `Run code (${modName}Enter)`,
      "aria-label": "Run code"
    }, "▸"), elt("button", {
      onmousedown: e => {
        revertCode(editor)
        e.preventDefault()
      },
      title: `Revert code (${modName}j)`,
      "aria-label": "Revert code"
    }, "▫"), elt("button", {
      onmousedown: e => {
        resetSandbox(editor.state.facet(contextFacet).sandbox)
        e.preventDefault()
      },
      title: `Reset sandbox (${modName}Escape)`,
      "aria-label": "Reset sandbox"
    }, "ø")))
  }

  function hideEditorControls(editor) {
    let controls = editor.dom.parentNode.querySelector(".editor-controls")
    if (controls) controls.remove()
  }

  let sandboxSnippets = {}
  {
    let snippets = document.getElementsByClassName("snippet")
    for (let i = 0; i < snippets.length; i++) {
      let snippet = snippets[i]
      if (snippet.getAttribute("data-language") == "html" &&
          snippet.getAttribute("data-sandbox"))
        sandboxSnippets[snippet.getAttribute("data-sandbox")] = snippet
    }
  }

  let sandboxes = {}
  async function getSandbox(name, forHTML) {
    name = name || "null"
    if (sandboxes.hasOwnProperty(name)) return sandboxes[name]
    let options = {loadFiles: window.page.load_files}, html
    if (sandboxSnippets.hasOwnProperty(name)) {
      let snippet = sandboxSnippets[name]
      options.place = node => placeFrame(node, snippet)
      if (!forHTML) html = snippet.textContent
    }
    let box = await Sandbox.create(options)
    if (html != null)
      box.win.document.documentElement.innerHTML = html
    sandboxes[name] = box
    return box
  }

  function resetSandbox(name) {
    if (!sandboxes.hasOwnProperty(name)) return
    let frame = sandboxes[name].frame
    frame.parentNode.removeChild(frame)
    delete sandboxes[name]
  }

  function placeFrame(frame, snippet) {
    let wrap = snippet.previousSibling, bot
    if (!wrap || wrap.className != "editor-wrap") {
      bot = snippet.getBoundingClientRect().bottom
      activateCode(snippet, "html")
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
}

function debounce(fn, delay = 50) {
  let timeout
  return arg => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(arg), delay)
  }
}

if (window.page && /^chapter|hints$/.test(window.page.type)) {
  chapterInteraction()
  // 3rd-edition-style anchor
  let {hash} = document.location
  if (/^#[phic]_./.test(hash)) {
    let exists = document.getElementById(hash.replace(/_/, "-"))
    if (exists) {
      document.location.hash = hash.replace(/_/, "-")
    } else {
      let chapter = /\/[^\/]+\.html/.exec(document.location)
      if (chapter) document.location = `https://eloquentjavascript.net/3rd_edition${chapter[0]}${hash}`
    }
  }
}
