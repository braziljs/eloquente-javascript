import * as fs from "fs"
import {dirname} from "path"
import {fileURLToPath} from "url"
import {transformTokens} from "./transform.mjs"
import markdown from "./markdown.mjs"

let file, noStarch = false
for (let arg of process.argv.slice(2)) {
  if (arg == "--nostarch") noStarch = true
  else if (file) throw new Error("Multiple input files")
  else file = arg == "-" ? "/dev/stdin" : arg
}
if (!file) throw new Error("No input file")
let chapter = /^\d{2}_([^\.]+)/.exec(file) || [null, "hints"]

let {tokens} = transformTokens(markdown.parse(fs.readFileSync(file, "utf8"), {}), {
  defined: ["book", "tex"].concat(noStarch ? ["commercial"] : []),
  strip: "hints",
  texQuotes: true,
  moveQuotes: noStarch,
  capitalizeTitles: noStarch,
  index: true
})

const dir = dirname(fileURLToPath(import.meta.url))
let chapters = fs.readdirSync(dir + "/..")
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
  return string.replace(/[^\u0000-\u0600→“”…←‘’]+/g, m => {
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
  fence(token, _i, _t, newlines) {
    if (/\bhidden:\s*true/.test(token.info)) return ""
    let esc = escapeComplexScripts(token.content.trimRight())
    if (noStarch) esc = esc.replace(/[“”]/g, '"').replace(/…/g, "...")
    return `${paraBreak(newlines)}${id(token)}\\begin{lstlisting}\n${esc}\n\\end{lstlisting}\n`
  },

  hardbreak() { return "\\break\n" },
  softbreak() { return " " },

  text(token) {
    let {content} = token
    if (linkedChapter != null) content = content.replace(/\?/g, linkedChapter)
    return raw ? content : escape(content)
  },

  paragraph_open(token, i, tokens, newlines) {
    let noIndent = ""
    if (!noStarch) for (i--; i >= 0; i--) {
      let prev = tokens[i]
      if (prev.type == "fence") noIndent = "\\noindent "
      if (!/^meta_index/.test(prev.type)) break
    }
    let nl = paraBreak(newlines)
    if (quote) { nl = ""; quote = false }
    return nl + noIndent + id(token)
  },
  paragraph_close() { return "" },

  heading_open(token, _i, _t, newlines) {
    let breaks = paraBreak(newlines)
    if (token.tag == "h1") return `\\${!["hints", "intro"].includes(chapter[1]) ? "chapter" : noStarch ? "chapter*" : "addchap"}{`
    if (token.tag == "h2") return `${breaks}${id(token)}\\section{`
    if (token.tag == "h3") return `${breaks}${id(token)}\\subsection{`
    if (token.tag == "h4") return `${breaks}${id(token)}\\subsubsection{`
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
  td_close(_, i, tokens) { return tokens[i + 1] && tokens[i + 1].type == "td_open" ? " &" : "" },

  code_inline(token) {
    if (noStarch)
      return `\\texttt{${escape(token.content)}}`
    else if (token.content.indexOf("`") > -1)
      return `\\lstinline|${token.content}|`
    else
      return `\\lstinline\`${token.content}\``
  },

  strong_open() { return "\\textbf{" },
  strong_close() { return "}" },

  em_open() { return "\\emph{" },
  em_close() { return "}" },

  sub_open() { return "\\textsubscript{" },
  sub_close() { return "}" },

  sup_open() { return "\\textsuperscript{" },
  sup_close() { return "}" },

  meta_indexsee(token, _i, _t, newlines) {
    return paraBreak(newlines) +
      `\\index{${escapeIndex(token.args[0])}|see{${escapeIndex(token.args[1])}}}`
  },
  meta_index(token, _, _t, newlines) {
    return (token.inline ? "" : paraBreak(newlines)) +
      token.args.map(term => `\\index{${escapeIndex(term)}}`).join("")
  },

  meta_latex_open() { raw = true; return "" },
  meta_latex_close() { raw = false; return "" },

  meta_keyname_open() { return noStarch ? "\\keycap{" : "\\textsc{" },
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

  meta_figure(token, _i, _t, newlines) {
    let {url, width, chapter} = token.args[0]
    if (chapter) return "" // FIXME
    if (/\.svg$/.test(url)) url = url.replace(/^img\//, "img/generated/").replace(/\.svg$/, ".pdf")
    let graphics = `\\includegraphics[width=${width || "10cm"}]{${url}}`
    if (noStarch) return `${paraBreak(newlines)}\\begin{figure}[H]\n${graphics}\n\\end{figure}\n`
    return `${paraBreak(newlines)}\\vskip 1.5ex\n${graphics}\n\\vskip 1.5ex\n`
  },

  meta_quote_open(token) {
    if (token.args[0] && token.args[0].chapter) {
      quote = true
      if (!noStarch) return `\n\n\\epigraphhead[30]{\n\\epigraph{\\hspace*{-.1cm}\\itshape\`\``
      return `\\epigraphskip
\\thispagestyle{empty}
\\vspace*{\\fill}
\\begin{center} 
\\begin{minipage}{\\epigraphwidth}
\\centering
\\setlength{\\epigraphrule}{0pt}
\\renewcommand{\\sourceflush}{center}
\\epigraph{\\centering{\`\``
    } else {
      return `\n\n\\begin{quote}`
    }
  },
  meta_quote_close(token) {
    quote = false
    let {author, title, chapter, image} = token.args[0] || {}
    let attribution = author ? `\n{---${escape(author)}${title ? `, ${escape(title)}` : ""}}` : ""
    if (!chapter) return `${attribution ? "\n" + attribution : ""}\n\\end{quote}`
    if (!noStarch) return `''}%${attribution}\n}`
    return `}}%${attribution}
${image ? `\\includegraphics[width=\\linewidth]{${image}}` : ''}
\\end{minipage}
\\end{center}
\\vspace*{\\fill}
\\clearpage

`
  },

  meta_hint_open() { return "" }, // FIXME filter out entirely
  meta_hint_close() { return "" }
}

function paraBreak(newlines) {
  return "\n".repeat(Math.max(0, 2 - newlines))
}

function renderArray(tokens) {
  let result = ""
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i], f = renderer[token.type]
    if (!f) throw new Error("No render function for " + token.type)
    result += f(token, i, tokens, /\n*$/.exec(result)[0].length)
  }
  return result
}

// Move epigraph to the front
if (noStarch) {
  let epiStart = tokens.findIndex(t => t.type == "meta_quote_open" && t.args[0]?.chapter)
  if (epiStart > -1) {
    let epiEnd = tokens.findIndex((t, i) => t.type == "meta_quote_close" && i > epiStart)
    let range = tokens.slice(epiStart, epiEnd + 1)
    tokens.splice(epiStart, epiEnd + 1 - epiStart)
    tokens.splice(0, 0, ...range)
    let image = tokens.findIndex(t => t.type == "meta_figure" && t.args[0]?.chapter)
    if (image) {
      tokens[0].args[0].image = tokens[image].args[0].url
      tokens.splice(image, 1)
    }
  }
}

console.log(renderArray(tokens))
