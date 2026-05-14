// Get a reference to the DOM nodes we need
let filelist = document.querySelector("#filelist");
let textarea = document.querySelector("#file");

// This loads the initial file list from the server
fetch("/").then(resp => resp.text()).then(files => {
  for (let file of files.split("\n")) {
    let option = document.createElement("option");
    option.textContent = file;
    filelist.appendChild(option);
  }
  // Now that we have a list of files, make sure the textarea contains
  // the currently selected one.
  loadCurrentFile();
});

// Fetch a file from the server and put it in the textarea.
function loadCurrentFile() {
  fetch(filelist.value).then(resp => resp.text()).then(file => {
    textarea.value = file;
  });
}

filelist.addEventListener("change", loadCurrentFile);

// Called by the button on the page. Makes a request to save the
// currently selected file.
function saveFile() {
  fetch(filelist.value, {method: "PUT",
                         body: textarea.value});
}
