import * as PJSON from "./pseudo_json.mjs"
import markdownIt from "markdown-it"

function parseData(str) {
  let tag = /^\s*(\w+)\s*?/.exec(str), args
  if (!tag) return null
  if (tag[0].length == str.length) {
    args = []
  } else {
    try { args = PJSON.parse("[" + str.slice(tag[0].length) + "]") }
    catch(_) { return null }
  }
  return {tag: tag[1], args}
}

function parseBlockMeta(state, startLine, endLine) {
  let pos = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]
  // Check for code block indentation or end of input
  if (state.sCount[startLine] - state.blkIndent >= 4 || pos + 4 > max) return false

  // Test for `{{` opening marker
  if (state.src.charCodeAt(pos) != 123 || state.src.charCodeAt(pos + 1) != 123) return false

  let content = state.src.slice(pos + 2, max), single

  if (single = /\}\}\s*$/.exec(content)) {
    let data = parseData(content.slice(0, single.index))
    if (!data) return false
    let token = state.push("meta_" + data.tag, null, 0)
    token.map = [startLine, startLine + 1]
    token.args = data.args
    state.line++
    return true
  }

  let data = parseData(content)
  if (!data) return false

  let line = startLine + 1, close = data.tag + "}}", open = new RegExp("^\\{\\{" + data.tag + "(\\s|$)"), depth = 0
  for (; line < endLine; line++) {
    if (line == endLine) throw new SyntaxError("Unterminated meta block")
    let start = state.bMarks[line] + state.tShift[line]
    let lineText = state.src.slice(start, state.eMarks[line])
    if (open.test(lineText)) {
      depth++
    } else if (lineText ==  close) {
      if (depth) depth--
      else break
    }
  }

  let token = state.push("meta_" + data.tag + "_open", null, 1)
  token.map = [startLine, line + 1]
  token.args = data.args
  state.md.block.tokenize(state, startLine + 1, line)
  state.push("meta_" + data.tag + "_close", null, -1).args = data.args
  state.line = line + 1

  return true
}

function parseBlockTable(state, startLine, endLine) {
  if (state.sCount[startLine] - state.blkIndent >= 4) return false

  let line = startLine, lines = []
  for (; line < endLine; line++) {
    let start = state.bMarks[line] + state.tShift[line]
    let lineText = state.src.slice(start, state.eMarks[line])
    if (!/\S/.test(lineText)) break
    if (lineText[0] != "|") return false
    lines.push(lineText.slice(1))
  }

  if (!lines.length) return false

  state.push("table_open", "table", 1).map = [startLine, line]
  for (let i = 0; i < lines.length; i++) {
    state.push("tr_open", "tr", 1).map = [startLine + i, startLine + i + 1]
    let m, content = /((?:[^`|]|`.*?`)+)\|?/g
    while (m = content.exec(lines[i])) {
      state.push("td_open", "td", 1).map = [startLine + i, startLine + i + 1]
      let inline = state.push("inline", "", 0)
      inline.content = m[1].trim()
      inline.map = [startLine + i, startLine + i + 1]
      inline.children = []
      state.push("td_close", "td", -1)
    }
    state.push("tr_close", "tr", -1)
  }
  state.push("table_close", "table", -1)
  state.line = line + 1

  return true
}

function parseInlineMeta(state, silent) {
  if (state.src.charCodeAt(state.pos) != 91) return false // '['

  let max = state.posMax
  let end = state.md.helpers.parseLinkLabel(state, state.pos, false)
  if (end < 0) return false

  let pos = end + 1
  if (pos >= max || state.src.charCodeAt(pos) != 123) return false // '{'

  let metaEnd = pos + 1, depth = 0
  for (;; metaEnd++) {
    if (metaEnd == max) return false
    let code = state.src.charCodeAt(metaEnd)
    if (code == 125) { // '}'
      if (depth) depth--
      else break
    } else if (code == 123) {
      depth++
    }
  }

  let data = parseData(state.src.slice(pos + 1, metaEnd))
  if (!data) return false

  state.pos++
  state.posMax = end
  if (!silent) {
    state.push("meta_" + data.tag + "_open", null, 1).args = data.args
    state.md.inline.tokenize(state)
    state.push("meta_" + data.tag + "_close", null, -1).args = data.args
  }
  state.pos = metaEnd + 1
  state.posMax = max

  return true
}

function parseIndexTerm(state, silent) {
  let max = state.posMax
  // Check for opening '(('
  if (state.pos >= max + 4 || state.src.charCodeAt(state.pos) != 40 || state.src.charCodeAt(state.pos + 1) != 40 ||
      state.src.charCodeAt(state.pos + 2) == 40) return false

  let start = state.pos + 2, end = start
  for (;; end++) {
    if (end >= max - 1) return false
    if (state.src.charCodeAt(end) == 41 && state.src.charCodeAt(end + 1)) break
  }

  let term = state.src.slice(start, end)

  if (!silent) {
    let token = state.push("meta_index", null, 0)
    token.args = [term]
    token.inline = true
  }
  state.pending += term
  state.pos = end + 2
  return true
}

let TERMINATOR_RE = /[\n!#$%&*+\-:<=>@\[\\\]^_`{}~]|\(\(/

function newText(state, silent) {
  let len = state.src.slice(state.pos, state.posMax).search(TERMINATOR_RE)
  if (len == 0) return false
  if (len == -1) len = state.posMax - state.pos
  if (!silent) state.pending += state.src.slice(state.pos, state.pos + len)
  state.pos += len
  return true
}

function plugin(md) {
  md.block.ruler.before("code", "meta", parseBlockMeta)
  md.block.ruler.before("code", "table", parseBlockTable)
  md.inline.ruler.before("link", "meta", parseInlineMeta)
  md.inline.ruler.at("text", newText)
  md.inline.ruler.before("strikethrough", "index_term", parseIndexTerm)
}

import sup from "markdown-it-sup"
import sub from "markdown-it-sub"

export default markdownIt({html: true}).use(plugin).use(sup).use(sub)
