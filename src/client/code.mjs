import {EditorView, keymap} from "@codemirror/view"
import {language} from "@codemirror/language"
import {EditorState, Facet} from "@codemirror/state"
import {createState, updateLanguage} from "./editor.mjs"
import {Sandbox} from "./sandbox.mjs"

const contextFacet = Facet.define({combine: vs => vs[0]})

function guessType(doc) {
  let scan
  if (typeof doc == "string") {
    scan = doc
  } else {
    for (let i = 1; i <= doc.lines; i++) {
      let line = doc.line(i).text
      if (/\S/.test(line)) { scan = line; break }
    }
  }
  return /^[\s\w]*</.test(scan) ? "html" : "javascript"
}

const modeGuesser = EditorState.transactionExtender.of(tr => {
  let guessed
  if (tr.docChanged && tr.startState.facet(contextFacet).type == null &&
      (guessed = guessType(tr.newDoc)) != tr.startState.facet(language).name)
    return {effects: updateLanguage(guessed)}
  return null
})

class CodeSandbox {
  constructor() {
    this.extensions = [
      keymap.of([
        {key: "Ctrl-Enter", run: () => { this.runCode(); return true }},
        {key: "Cmd-Enter", run: () => { this.runCode(); return true }}
      ]),
      modeGuesser
    ]
    this.editor = new EditorView({
      state: createState("", "javascript", [
        this.extensions,
        contextFacet.of({include: [], mode: null})
      ]),
      parent: document.querySelector("#editor")
    })

    this.output = new Sandbox.Output(document.querySelector(".sandbox-output"))
    this.sandbox = null

    this.chapters = document.querySelector("#chapters")
    chapterData.forEach(chapter => {
      this.chapters.appendChild(opt(chapter.number, chapter.number + ". " + chapter.title))
      chapter.exercises.forEach(exercise => {
        exercise.chapter = chapter
      })
    })
    this.chapters.addEventListener("change", () => {
      this.selectChapter(this.chapters.value)
      document.location.hash = "#" + this.chapters.value
    })

    this.per = document.querySelector("#per_chapter")
    this.per.addEventListener("change", () => {
      this.selectContext(this.per.value)
      document.location.hash = "#" + (this.per.value == "box" ? this.chapters.value : this.per.value)
    })
    this.fileList = document.querySelector("#files")
    this.fileInfo = document.querySelector("#fileInfo")
    this.runLocally = document.querySelector("#runLocally")
    this.localFileList = document.querySelector("#local-files")

    document.querySelector("#run").addEventListener("click", () => this.runCode())

    document.querySelector("#solution").addEventListener("click", () => {
      let context = this.editor.state.facet(contextFacet)
      this.setEditorState(context.solution, context)
    })

    this.parseFragment() || this.selectChapter(0, "box")
    addEventListener("hashchange", () => this.parseFragment())
  }

  setEditorState(code, context) {
    this.editor.setState(createState(code, context.type || guessType(code), [this.extensions, contextFacet.of(context)]))
  }

  selectContext(value) {
    this.output.clear()
    this.clearSandbox()
    let chapter = getChapter(this.chapters.value), visible
    if (value == "box") {
      let code = (this.chapters.value < 20 || this.chapters.value > 21)
          ? "Run code here in the context of Chapter " + chapter.number
          : "Code from Node.js chapters can't be run in the browser"
      let guessed = guessType(chapter.start_code)
      if (guessed == "javascript")
        code = "// " + code
      else
        code = "<!-- " + code + " -->"
      if (chapter.start_code) code += "\n\n" + chapter.start_code
      this.setEditorState(code, {include: chapter.include})
      visible = "box"
    } else {
      let exercise = findExercise(value, chapter)
      if (exercise.goto) {
        document.location = exercise.goto
        return
      }
      this.setEditorState(exercise.code, {
        include: chapter.include,
        solution: exercise.solution,
        type: exercise.type
      })
      visible = "exercise"
      let link = document.querySelector("#download")
      link.setAttribute("download", "solution" + value + ".js")
      if (/\.zip$/.test(exercise.file))
        link.href = "../" + exercise.file
      else
        link.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(exercise.solution)
    }
    ["box", "exercise"].forEach(id => {
      document.querySelector("#" + id + "_info").style.display =
        (id == visible ? "" : "none")
    })
  }

  clearSandbox() {
    if (this.sandbox) {
      this.sandbox.frame.remove()
      this.sandbox = null
    }
  }

  runCode() {
    this.clearSandbox()
    let val = this.editor.state.doc.toString(), type = this.editor.state.facet(language).name
    let context = this.editor.state.facet(contextFacet)
    Sandbox.create({
      loadFiles: hasIncludes(val, context.include) ? [] : context.include,
      emptyPath: "../",
      place: type == "html" &&
        function(node) {
          let out = document.querySelector(".sandbox-output")
          out.parentNode.insertBefore(node, out)
        }
    }).then(box => {
      this.sandbox = box
      this.output.clear()
      if (type == "html")
        box.setHTML(val, this.output)
      else
        box.run(val, this.output)
    })
  }

  selectChapter(number, context) {
    this.per.textContent = ""
    let chapter = getChapter(number)
    if (chapter.exercises.length) {
      this.per.appendChild(opt("box", "Select an exercise"))
      chapter.exercises.forEach(exercise => {
        let num = chapter.number + "." + exercise.number
        this.per.appendChild(opt(num, num + " " + exercise.name))
      })
    } else {
      this.per.appendChild(opt("box", "This chapter has no exercises"))
    }
    this.fileInfo.style.display = this.runLocally.style.display = "none"
    this.fileList.textContent = this.localFileList.textContent = ""
    if (chapter.links) chapter.links.forEach((file, i) => {
      if (!i) this.runLocally.style.display = ""
      addItem(this.localFileList, file)
    })
    if (chapter.include) chapter.include.forEach((file, i) => {
      if (!i) this.fileInfo.style.display = ""
      if (!/(^|\/)_/.test(file)) addItem(this.fileList, file)
    })
    this.selectContext(context || "box")
  }

  parseFragment() {
    let hash = document.location.hash.slice(1)
    let valid = /^(\d+)(?:\.(\d+.*))?$/.exec(hash)
    let chapter, exercise
    if (valid) {
      chapter = getChapter(Number(valid[1]))
      exercise = chapter && valid[2] && findExercise(hash, chapter)
      if (!chapter || valid[2] && !exercise) valid = null
    }
    if (valid) {
      let perValue = exercise ? hash : "box", setPer = false
      if (this.chapters.value != valid[1]) {
        this.chapters.value = valid[1]
        this.selectChapter(Number(valid[1]), perValue)
        setPer = true
      }
      if (this.per.value != perValue) {
        this.per.value = perValue
        if (!setPer) this.selectContext(perValue)
      }
      return true
    }
  }
}

function hasIncludes(code, include) {
  if (!include) return code

  let re = /(?:\s|<!--.*?-->)*<script src="([^"]*)"><\/script>/g, m
  let found = []
  while (m = re.exec(code)) found.push(m[1])
  return include.every(s => found.indexOf(s) > -1)
}

function opt(value, label) {
  let node = document.createElement("option")
  node.value = value
  node.textContent = label || value
  return node
}

function getChapter(number) {
  for (let i = 0; i < chapterData.length; i++)
    if (chapterData[i].number == number)
      return chapterData[i]
}

function addItem(container, link) {
  let li = container.appendChild(document.createElement("li"))
  let a = li.appendChild(document.createElement("a"))
  a.href = "../" + link
  a.textContent = link.replace(/^code\//, "")
}

function findExercise(id, chapter) {
  let parts = id.split(".")
  if (!chapter) chapter = getChapter(parts[0])
  for (let i = 0; i < chapter.exercises.length; i++)
    if (chapter.exercises[i].number == parts[1])
      return chapter.exercises[i]
}

if (window.page && window.page.type == "code")
  window.codeSandbox = new CodeSandbox
