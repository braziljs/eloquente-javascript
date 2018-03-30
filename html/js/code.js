addEventListener("load", () => {
  let editor = CodeMirror.fromTextArea(document.querySelector("#editor"), {
    mode: "javascript",
    extraKeys: {
      "Ctrl-Enter": runCode,
      "Cmd-Enter": runCode
    },
    matchBrackets: true,
    lineNumbers: true
  })
  function guessType(code) {
    return /^[\s\w\n:]*</.test(code) ? "html" : "js"
  }
  let reGuess
  editor.on("change", () => {
    clearTimeout(reGuess)
    reGuess = setTimeout(() => {
      if (context.type == null) {
        let mode = guessType(editor.getValue()) == "html" ? "text/html" : "javascript"
        if (mode != editor.getOption("mode"))
          editor.setOption("mode", mode)
      }
    }, 500)
  })

  function hasIncludes(code, include) {
    if (!include) return code

    let re = /(?:\s|<!--.*?-->)*<script src="([^"]*)"><\/script>/g, m
    let found = []
    while (m = re.exec(code)) found.push(m[1])
    return include.every(s => found.indexOf(s) > -1)
  }

  function setEditorCode(code, type) {
    editor.setValue(code)
    editor.setOption("mode", (type || guessType(code)) == "html" ? "text/html" : "javascript")
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

  let per = document.querySelector("#per_chapter")
  per.addEventListener("change", () => {
    selectContext(per.value)
    document.location.hash = "#" + (per.value == "box" ? chapters.value : per.value)
  })
  let fileList = document.querySelector("#files")
  let fileInfo = document.querySelector("#fileInfo")
  let runLocally = document.querySelector("#runLocally")
  let localFileList = document.querySelector("#local-files")

  function addItem(container, link) {
    let li = container.appendChild(document.createElement("li"))
    let a = li.appendChild(document.createElement("a"))
    a.href = link
    a.textContent = link.replace(/^code\//, "")
  }

  function selectChapter(number, context) {
    per.textContent = ""
    let chapter = getChapter(number)
    if (chapter.exercises.length) {
      per.appendChild(opt("box", "Select an exercise"))
      chapter.exercises.forEach(exercise => {
        let num = chapter.number + "." + exercise.number
        per.appendChild(opt(num, num + " " + exercise.name))
      })
    } else {
      per.appendChild(opt("box", "This chapter has no exercises"))
    }
    fileInfo.style.display = runLocally.style.display = "none"
    fileList.textContent = localFileList.textContent = ""
    if (chapter.links) chapter.links.forEach((file, i) => {
      if (!i) runLocally.style.display = ""
      addItem(localFileList, file)
    })
    if (chapter.include) chapter.include.forEach((file, i) => {
      if (!i) fileInfo.style.display = ""
      addItem(fileList, file)
    })
    selectContext(context || "box")
  }

  function findExercise(id, chapter) {
    let parts = id.split(".")
    if (!chapter) chapter = getChapter(parts[0])
    for (let i = 0; i < chapter.exercises.length; i++)
      if (chapter.exercises[i].number == +parts[1])
        return chapter.exercises[i]
  }

  let context = {include: []}

  function selectContext(value) {
    output.clear()
    clearSandbox()
    let chapter = getChapter(chapters.value), visible
    if (value == "box") {
      let code = (chapters.value < 20 || chapters.value > 21)
       ? "Run code here in the context of Chapter " + chapter.number
       : "Code from Node.js chapters can't be run in the browser"
      let guessed = guessType(chapter.start_code)
      if (guessed == "js")
        code = "// " + code
      else
        code = "<!-- " + code + "-->"
      if (chapter.start_code) code += "\n\n" + chapter.start_code
      context = {include: chapter.include}
      setEditorCode(code, guessed)
      visible = "box"
    } else {
      let exercise = findExercise(value, chapter)
      context = {include: chapter.include,
                 solution: exercise.solution,
                 type: exercise.type}
      setEditorCode(exercise.code, exercise.type)
      visible = "exercise"
      let link = document.querySelector("#download")
      if (/\.zip$/.test(exercise.file))
        link.href = exercise.file
      else
        link.href = "data:text/plain;charset=UTF-8," + exercise.solution
    }
    ["box", "exercise"].forEach(id => {
      document.querySelector("#" + id + "_info").style.display =
        (id == visible ? "" : "none")
    })
  }

  let outnode = document.querySelector(".sandbox-output")
  let output = new SandBox.Output(outnode)

  document.querySelector("#run").addEventListener("click", runCode)

  let sandbox
  function clearSandbox() {
    if (sandbox) {
      sandbox.frame.parentNode.removeChild(sandbox.frame)
      sandbox = null
    }
  }

  function runCode() {
    clearSandbox()
    let val = editor.getValue(), type = context.type || guessType(val)
    SandBox.create({
      loadFiles: hasIncludes(val, context.include) ? [] : context.include,
      place: type == "html" &&
        function(node) {
          let out = document.querySelector(".sandbox-output")
          out.parentNode.insertBefore(node, out)
        }
    }).then(box => {
      sandbox = box
      output.clear()
      if (type == "html")
        box.setHTML(val, output)
      else
        box.run(val, output)
    })
  }

  document.querySelector("#solution").addEventListener("click", () => {
    setEditorCode(context.solution, context.type)
  })

  let chapters = document.querySelector("#chapters")
  chapterData.forEach(chapter => {
    chapters.appendChild(opt(chapter.number, chapter.number + ". " + chapter.title))
    chapter.exercises.forEach(exercise => {
      exercise.chapter = chapter
    })
  })
  chapters.addEventListener("change", () => {
    selectChapter(chapters.value)
    document.location.hash = "#" + chapters.value
  })

  function parseFragment() {
    let hash = document.location.hash.slice(1)
    let valid = /^(\d+)(?:\.(\d+))?$/.exec(hash)
    let chapter, exercise
    if (valid) {
      chapter = getChapter(Number(valid[1]))
      exercise = chapter && valid[2] && findExercise(hash, chapter)
      if (!chapter || valid[2] && !exercise) valid = null
    }
    if (valid) {
      let perValue = exercise ? hash : "box", setPer = false
      if (chapters.value != valid[1]) {
        chapters.value = valid[1]
        selectChapter(Number(valid[1]), perValue)
        setPer = true
      }
      if (per.value != perValue) {
        per.value = perValue
        if (!setPer) selectContext(perValue)
      }
      return true
    }
  }

  parseFragment() || selectChapter(0, "box")
  addEventListener("hashchange", parseFragment)
})
