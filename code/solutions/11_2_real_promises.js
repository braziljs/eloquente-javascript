function activityTable(day) {
  let table = [];
  for (let i = 0; i < 24; i++) table[i] = 0;

  return textFile("camera_logs.txt").then(files => {
    return Promise.all(files.split("\n").map(name => {
      return textFile(name).then(log => {
        for (let timestamp of log.split("\n")) {
          let date = new Date(Number(timestamp));
          if (date.getDay() == day) {
            table[date.getHours()]++;
          }
        }
      });
    }));
  }).then(() => table);
}

activityTable(6)
  .then(table => console.log(activityGraph(table)));
