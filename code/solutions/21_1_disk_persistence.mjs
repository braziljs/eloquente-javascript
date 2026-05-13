// This isn't a stand-alone file, only a redefinition of a few
// fragments from skillsharing/skillsharing_server.js

import {readFileSync, writeFile} from "node:fs";

const fileName = "./talks.json";

SkillShareServer.prototype.updated = function() {
  this.version++;
  let response = this.talkResponse();
  this.waiting.forEach(resolve => resolve(response));
  this.waiting = [];

  writeFile(fileName, JSON.stringify(this.talks), e => {
    if (e) throw e;
  });
};

function loadTalks() {
  try {
    return JSON.parse(readFileSync(fileName, "utf8"));
  } catch (e) {
    return {};
  }
}

// The line that starts the server must be changed to
new SkillShareServer(loadTalks()).start(8000);
