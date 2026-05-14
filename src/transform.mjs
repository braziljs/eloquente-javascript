function childrenText(token) {
  let text = ""
  for (let i = 0; i < token.children.length; i++) {
    let child = token.children[i];
    if (child.type == "text" || child.type == "code_inlin") text += child.content
  }
  return text
}

import {createHash} from "crypto"

function hash(text) {
  let sum = createHash("sha1")
  sum.update(text)
  return sum.digest("base64").slice(0, 10)
}

function startAndEnd(text) {
  var words = text.split(/\W+/);
  if (!words[0]) words.shift();
  if (!words[words.length - 1]) words.pop();
  if (words.length <= 6) return words.join(" ");
  return words.slice(0, 3).concat(words.slice(words.length - 3)).join(" ");
}

function tokenText(token) {
  if (token.type == "text" || token.type == "code_inline") return token.content
  else if (token.type == "softbreak") return " "
  else return ""
}

function smartQuotes(tokens, i, tex, moveQuotes) {
  let text = tokens[i].content, from = 0
  for (let j = i - 1, tt; j >= 0; j--) if (tt = tokenText(tokens[j])) {
    text = tt + text
    from = tt.length
    break
  }
  let to = text.length
  for (let j = i + 1, tt; j < tokens.length; j++) if (tt = tokenText(tokens[j])) {
    text += tt
    break
  }

  let quoted = text
    .replace(/([\w\.,!?\)])'/g, "$1’")
    .replace(/'(\w|\(\()/g, "‘$1")
    .replace(/([\w\.,!?\)])"/g, "$1”")
    .replace(/"(\w|\(\()/g, "“$1")
    .slice(from, to)
  if (moveQuotes) quoted = quoted.replace(/”([.!?:;,]+)/g, "$1”")
  return tex ? quoted.replace(/‘/g, "`").replace(/’/g, "'").replace(/“/g, "``").replace(/”/g, "''") : quoted
}

function handleIf(tokens, i, options) {
  let tag = tokens[i].args[0]
  if (options.defined.indexOf(tag) > -1) return i
  for (let j = i + 1; j < tokens.length; j++) if (tokens[j].type == "meta_if_close" && tokens[j].args[0] == tag)
    return j
}

const titleCaseSmallWords = "a an the at by for in of on to up and as but with or nor if console.log".split(" ");

function capitalizeTitle(text) {
  return text.split(" ")
    .map(word => titleCaseSmallWords.includes(word) ? word : word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

function transformInline(tokens, options, prevType) {
  let capitalize = options.capitalizeTitles && prevType == "heading_open"
  let result = []
  for (let i = 0; i < tokens.length; i++) {
    let tok = tokens[i], type = tok.type
    if (type == "meta_if_close" || (options.index === false && type == "meta_index")) {
      // Drop
    } else if (type == "meta_if_open") {
      i = handleIf(tokens, i, options)
    } else {
      if (type == "text" && /[\'\"]/.test(tok.content)) tok.content = smartQuotes(tokens, i, options.texQuotes, options.moveQuotes)
      if (capitalize) tok.content = capitalizeTitle(tok.content)
      result.push(tok)
    }
  }
  return result
}

function nextTag(tokens, i) {
  for (let j = i + 1; j < tokens.length; j++) if (tokens[j].tag) return tokens[j];
}

export function transformTokens(tokens, options) {
  let meta = {}, result = []
  for (let i = 0; i < tokens.length; i++) {
    let tok = tokens[i], type = tok.type
    if (type == "meta_meta") {
      for (let prop in tok.args[0]) meta[prop] = tok.args[0][prop]
    } else if (type == "meta_id") {
      let next = nextTag(tokens, i)
      ;(next.attrs || (next.attrs = [])).push(["id", tok.args[0]])
    } else if (type == "meta_table") {
      nextTag(tokens, i).tableData = tok.args[0]
    } else if (type == "meta_if_open") {
      i = handleIf(tokens, i, options)
    } else if (type == "meta_hint_open" && options.strip === "hints") {
      do { i++ } while (tokens[i].type != "meta_hint_close")
    } else if (type == "meta_if_close" || (options.index === false && (type == "meta_indexsee" || type == "meta_index"))) {
      // Drop
    } else if (tok.tag == "h1" && options.takeTitle) {
      if (tokens[i + 1].children.length != 1) throw new Error("Complex H1 not supported")
      meta.title = tokens[i + 1].children[0].content
      i += 2
    } else {
      if (type == "paragraph_open")
        tok.hashID = "p-" + hash(startAndEnd(childrenText(tokens[i + 1])))
      else if (type == "heading_open")
        tok.hashID = (tok.tag == "h2" ? "h-" : "i-") + hash(childrenText(tokens[i + 1]))
      else if (type == "fence")
        tok.hashID = "c-" + hash(tok.content)

      if (tok.children) tok.children = transformInline(tok.children, options, tokens[i - 1].type)

      result.push(tok)
    }
  }
  return {tokens: result, metadata: meta}
}
