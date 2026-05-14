window.addEventListener("keydown", e => {
  if (/Arrow|Home|End|Page/.test(e.key)) e.preventDefault()
})
