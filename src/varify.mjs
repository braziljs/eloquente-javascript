import {parse} from "acorn"

export default function(code) {
  let ast
  try { ast = parse(code, {sourceType: "module", ecmaVersion: 2022}) }
  catch(_) { return code }

  let patches = []
  ast.body.forEach(node => {
    if (node.type == "VariableDeclaration" && node.kind != "var") {
      patches.push({from: node.start, to: node.start + node.kind.length, text: "var"})
    } else if (node.type == "ClassDeclaration") {
      patches.push({from: node.start, to: node.start, text: "var " + node.id.name + " = "})
    } else if (node.type == "ImportDeclaration") {
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
    } else if (node.type == "ExportNamedDeclaration") {
      if (node.source || !node.declaration)
        patches.push({from: node.start, to: node.end, text: ""})
      else
        patches.push({from: node.start, to: node.declaration.start, text: ""})
    } else if (node.type == "ExportDefaultDeclaration") {
      if (/Declaration/.test(node.declaration.type)) {
        patches.push({from: node.start, to: node.declaration.start, text: ""})
      } else {
        patches.push({from: node.start, to: node.declaration.start, text: ";("},
                     {from: node.declaration.end, text: ")"})
      }
    } else if (node.type == "ExportAllDeclaration") {
      patches.push({from: node.start, to: node.end, text: ""})
    }
  })

  patches.sort((a, b) => a.from - b.from || (a.to || a.from) - (b.to || b.from))
  let out = "", pos = 0
  patches.forEach(({from, to, text}) => {
    out += code.slice(pos, from) + text
    pos = to
  })
  out += code.slice(pos)
  return out
}
