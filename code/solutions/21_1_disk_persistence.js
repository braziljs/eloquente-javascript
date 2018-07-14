// This isn't a stand-alone file, only a redefinition of a few
// fragments from skillsharing/skillsharing_server.js

const {readFileSync, writeFile} = require("fs");

const fileName = "./talks.json";

function loadTalks() {
  let json;
  try {
    json = JSON.parse(readFileSync(fileName, "utf8"));
  } catch (e) {
    json = {};
  }
  return Object.assign(Object.create(null), json);
}

SkillShareServer.prototype.updated = function() {
  this.version++;
  let response = this.talkResponse();
  this.waiting.forEach(resolve => resolve(response));
  this.waiting = [];

  writeFile(fileName, JSON.stringify(this.talks));
};

// The line that starts the server must be changed to
new SkillShareServer(loadTalks()).start(8000);
