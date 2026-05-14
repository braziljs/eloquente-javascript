class Stream {
  constructor(str) {
    this.str = str
    this.pos = 0
  }

  err(msg) {
    throw new SyntaxError(msg + " at " + this.pos + " in " + JSON.stringify(this.str))
  }

  space() {
    for (;;) {
      let next = this.next
      if (next == 32 || next == 9 || next == 10 || next == 13) this.pos++
      else break
    }
  }

  get next() {
    return this.str.charCodeAt(this.pos)
  }

  ahead(n) {
    this.pos += n
    this.space()
  }
}

export function parse(str) {
  let stream = new Stream(str)
  stream.space()
  let value = parseValue(stream)
  if (stream.pos != stream.str.length) stream.err("Extra characters at end of input")
  return value
}

function parseValue(stream) {
  let next = stream.next
  if (next == 123) return parseObj(stream)
  if (next == 91) return parseArr(stream)
  if (next == 34) return parseStr(stream)
  return parseWord(stream)
}

function parseObj(stream) {
  stream.ahead(1)
  let obj = {}
  for (;;) {
    if (stream.next == 125) break
    let prop = parseWord(stream, true)
    if (stream.next != 58) stream.err("Expected ':'")
    stream.ahead(1)
    obj[prop] = parseValue(stream)
    if (stream.next == 44) stream.ahead(1)
  }
  stream.ahead(1)
  return obj
}

function parseArr(stream) {
  stream.ahead(1)
  let arr = []
  for (;;) {
    if (stream.next == 93) break
    arr.push(parseValue(stream))
    if (stream.next == 44) stream.ahead(1)
  }
  stream.ahead(1)
  return arr
}

function parseStr(stream) {
  let start = stream.pos
  stream.pos++
  for (let escaped = false;;) {
    let next = stream.next
    stream.pos++
    if (next == 34 && !escaped) break
    else if (isNaN(next)) stream.err("Unterminated string")
    escaped = next == 92
  }
  stream.space()
  return JSON.parse(stream.str.slice(start, stream.pos))
}

function parseWord(stream, prop) {
  let start = stream.pos
  for (;;) {
    let next = stream.next
    if ((next >= 97 && next <= 122) || (next >= 65 && next <= 90) || next == 95 || (next >= 48 && next <= 57)) stream.pos++
    else break
  }
  let word = stream.str.slice(start, stream.pos)
  if (!word) stream.err("Expected word")
  stream.space()
  if (/^(?:0x[\da-f]+|\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?)$/i.test(word)) return JSON.parse(word)
  if (!prop) {
    if (word == "true") return true
    if (word == "false") return false
  }
  return word
}
