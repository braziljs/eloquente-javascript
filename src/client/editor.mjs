import {EditorView, keymap, lineNumbers} from "@codemirror/view"
import {EditorState, Compartment} from "@codemirror/state"
import {minimalSetup} from "codemirror"
import {html} from "@codemirror/lang-html"
import {javascript} from "@codemirror/lang-javascript"
import {bracketMatching, syntaxHighlighting} from "@codemirror/language"
import {classHighlighter} from "@lezer/highlight"

let modeCompartment = new Compartment

export function createState(code, mode, extensions = []) {
  return EditorState.create({
    doc: code,
    extensions: [
      extensions,
      modeCompartment.of(mode == "html" ? html() : javascript()),
      minimalSetup,
      syntaxHighlighting(classHighlighter),
      bracketMatching(),
      lineNumbers(),
      EditorView.contentAttributes.of({"aria-label": "Code editor"})
    ]
  })
}

export function updateLanguage(mode) {
  return modeCompartment.reconfigure(mode == "html" ? html() : javascript())
}
