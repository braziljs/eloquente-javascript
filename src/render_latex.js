let fs = require("fs")
let {transformTokens} = require("./transform")

let file, noStarch = false
for (let arg of process.argv.slice(2)) {
  if (arg == "--nostarch") noStarch = true
  else if (file) throw new Error("Multiple input files")
  else file = arg == "-" ? "/dev/stdin" : arg
}
if (!file) throw new Error("No input file")
let chapter = /^\d{2}_([^\.]+)/.exec(file) || [null, "hints"]

let {tokens} = transformTokens(require("./markdown").parse(fs.readFileSync(file, "utf8"), {}), {
  defined: ["book", "tex"].concat(noStarch ? ["commercial"] : []),
  strip: "hints",
  texQuotes: true,
  moveQuotes: noStarch,
  capitalizeTitles: noStarch,
  index: true
})

let chapters = fs.readdirSync(__dirname + "/..")
    .filter(file => /^\d{2}_\w+\.md$/.test(file))
    .sort()
    .map(file => /^\d{2}_(\w+)\.md$/.exec(file)[1])
    .concat(['hints'])

function escapeChar(ch) {
  switch (ch) {
    case "~": return "\\textasciitilde "
    case "^": return "\\textasciicircum "
    case "\\": return "\\textbackslash "
    case "/": return "\\slash "
    case '"': return "\\textquotedbl{}"
    default: return "\\" + ch
  }
}
function escape(str) {
  return String(str).replace(/[&%$#_{}~^\\"]|\w(\/)\w/g, (match, group) => {
    if (group) return match[0] + escapeChar(group) + match[2]
    return escapeChar(match)
  })
}
function miniEscape(str) { return str.replace(/[`]/g, escapeChar) }

function escapeIndexChar(ch) {
  switch (ch) {
    case "~": return "\\textasciitilde "
    case "^": return "\\textasciicircum "
    case "\\": return "\\textbackslash "
    case "|": return "\\textbar{} "
    case "@": return "\"@"
    case "!": return "\"!"
    case "- ": return "-@− "
    case "--": return "--@−−"
    case "-=": return "-=@−="
    default: return "\\" + ch
  }
}
function escapeIndex(value) {
  if (Array.isArray(value)) return value.map(escapeIndex).join("!")
  return String(value).replace(/[&%$#_{}~^\\|!@]|-[ -=]/g, escapeIndexChar)
}

function escapeComplexScripts(string) {
  return string.replace(/[^\u0000-\u0600→“”—…←‘’]+/g, m => {
    if (/[\u0600-\u06ff]/.test(m)) m = "\\textarab{" + m + "}"
    else if (/[\u4E00-\u9FA5]/.test(m)) m = "\\cjkfont{" + m + "}"
    return `$<${m}>$`
  })
}

function id(token) {
  let id = token.attrGet("id")
  return id ? `\\label{${chapter[1] + "." + id}}` : ''
}

let linkedChapter = null, raw = false, quote = false

let renderer = {
  fence(token) {
    if (/\bhidden:\s*true/.test(token.info)) return ""
    if (noStarch)
      return `\n\n${id(token)}\\begin{Code}\n${token.content.trimRight()}\n\\end{Code}\n`
    else
      return `\n\n${id(token)}\\begin{lstlisting}\n${escapeComplexScripts(token.content.trimRight())}\n\\end{lstlisting}\n\\noindent`
  },

  hardbreak() { return "\\break\n" },
  softbreak() { return " " },

  text(token) {
    let {content} = token
    if (linkedChapter != null) content = content.replace(/\?/g, linkedChapter)
    return raw ? content : escape(content)
  },

  paragraph_open(token) {
    let nl = "\n\n";
    if (quote) { nl = ""; quote = false }
    return nl + id(token)
  },
  paragraph_close() { return "" },

  heading_open(token) {
    if (token.tag == "h1") return `\\${!["hints", "intro"].includes(chapter[1]) ? "chapter" : noStarch ? "chapter*" : "addchap"}{`
    if (token.tag == "h2") return `\n\n${id(token)}\\section{`
    if (token.tag == "h3") return `\n\n${id(token)}\\subsection{`
    if (token.tag == "h4") return `\n\n${id(token)}\\subsubsection{`
    throw new Error("Can't handle heading tag " + token.tag)
  },
  heading_close(token) { 
    if (token.tag == "h1") return `}\\label{${chapter[1]}}`
    return `}` 
  },

  bullet_list_open() { return `\n\n\\begin{itemize}` },
  bullet_list_close() { return `\n\\end{itemize}` },

  ordered_list_open() { return `\n\n\\begin{enumerate}` },
  ordered_list_close() { return `\n\\end{enumerate}` },

  list_item_open() { return `\n\\item ` },
  list_item_close() { return "" },

  table_open() { return `\n\n\\noindent\\begin{tabular}{ll}` },
  table_close() { return `\n\\end{tabular}` },
  tbody_open() { return "" },
  tbody_close() { return "" },
  tr_open() { return "" },
  tr_close() { return "\n\\tabularnewline" },
  td_open() { return "\n" },
  td_close(_, next) { return next && next.type == "td_open" ? " &" : "" },

  code_inline(token) {
    if (noStarch)
      return `\\texttt{${escape(token.content)}}`
    else
      return `\\lstinline\`${miniEscape(token.content)}\``
  },

  strong_open() { return "\\textbf{" },
  strong_close() { return "}" },

  em_open() { return "\\emph{" },
  em_close() { return "}" },

  sub_open() { return "\\textsubscript{" },
  sub_close() { return "}" },

  sup_open() { return "\\textsuperscript{" },
  sup_close() { return "}" },

  meta_indexsee(token) {
    return `\\index{${escapeIndex(token.args[0])}|see{${escapeIndex(token.args[1])}}}`
  },
  meta_index(token) {
    return token.args.map(term => `\\index{${escapeIndex(term)}}`).join("")
  },

  meta_latex_open() { raw = true; return "" },
  meta_latex_close() { raw = false; return "" },

  meta_keyname_open() { return "\\textsc{" },
  meta_keyname_close() { return "}" },

  link_open(token) {
    let href= token.attrGet("href")
    let maybeChapter = /^(\w+)(?:#(.*))?$/.exec(href)
    if (!maybeChapter || !chapters.includes(maybeChapter[1])) return `\\href{${href}}{`
    linkedChapter = chapters.indexOf(maybeChapter[1])
    return `\\hyperref[${maybeChapter[1] + (maybeChapter[2] ? "." + maybeChapter[2] : "")}]{`
  },
  link_close() { linkedChapter = null; return "}" },

  inline(token) { return renderArray(token.children) },

  meta_figure(token) {
    let {url, width, chapter} = token.args[0]
    if (chapter) return "" // FIXME
    if (/\.svg$/.test(url)) url = url.replace(/^img\//, "img/generated/").replace(/\.svg$/, ".pdf")
    return `\n\n\\vskip 1.5ex\n\\includegraphics[width=${width || "10cm"}]{${url}}\n\\vskip 1.5ex`
  },

  meta_quote_open(token) {
    if (token.args[0] && token.args[0].chapter) {
      quote = true
      return `\n\n\\epigraphhead[30]{\n\\epigraph{\\hspace*{-.1cm}\\itshape\`\``
    } else {
      return `\n\n\\begin{quote}`
    }
  },
  meta_quote_close(token) {
    quote = false
    let {author, title, chapter} = token.args[0] || {}
    let attribution = author ? `\n{---${escape(author)}${title ? `, ${escape(title)}` : ""}}` : ""
    if (chapter)
      return `''}%${attribution}\n}`
    else
      return `${attribution ? "\n" + attribution : ""}\n\\end{quote}`
  },

  meta_hint_open() { return "" }, // FIXME filter out entirely
  meta_hint_close() { return "" }
}

function renderArray(tokens) {
  let result = ""
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i], f = renderer[token.type]
    if (!f) throw new Error("No render function for " + token.type)
    result += f(token, tokens[i + 1])
  }
  return result
}

console.log(renderArray(tokens))
