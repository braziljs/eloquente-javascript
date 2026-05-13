var readTextFile = function() {
  let min = 60 * 1000, hour = min * 60, day = hour * 24

  let logs = [], year = 2023, start = new Date(year, 8, 21).getTime()
  for (let i = 21; i <= 30; i++) {
    if (i != 27) logs.push({name: "activity-" + year + "-09-" + i + ".log", time: start + i * day, day: (i - 17) % 7})
  }

  let rState = 81782
  function r1() {
    rState ^= rState << 13
    rState ^= rState << 17
    rState ^= rState << 5
    return (rState & 0xffffff) / 0xffffff
  }
  function r(n) {
    return Math.floor(r1() * n)
  }

  let weekday = [1, 1, 1, 1, 1, 3, 8, 20, 10, 15, 15, 20, 25, 12, 15, 20, 18, 16, 10, 8, 8, 7, 4, 2]
  let saturday = [1, 1, 1, 1, 1, 2, 3, 5, 3, 2, 2, 5, 8, 7, 9, 5, 5, 3, 3, 3, 4, 2, 2, 2]
  let sunday = [2, 2, 1, 1, 1, 1, 1, 2, 2, 3, 6, 6, 2, 1, 1, 1, 1, 4, 4, 4, 3, 2, 1, 1]

  let activity = (day, base) => {
    let schedule = day == 0 ? sunday : day == 6 ? saturday : weekday
    let events = []
    for (let h = 0; h < 24; h++) {
      let n = schedule[h] * 2 + r(5) - 2
      for (let i = 0; i < n; i++) {
        let t = base + h * hour + r(hour)
        let j = events.length
        while (j > 0 && events[j - 1] > t) --j
        events.splice(j, 0, t)
      }
    }
    return events
  }

  let generated = false
  function generateLogs() {
    if (generated) return
    generated = true
    for (let log of logs) {
      files[log.name] = activity(log.day, log.time).join("\n")
    }
  }

  let files = {
    __proto__: null,
    "shopping_list.txt": "Peanut butter\nBananas",
    "old_shopping_list.txt": "Peanut butter\nJelly",
    "package.json": '{"name":"test project","author":"cāāw-krö","version":"1.1.2"}',
    "plans.txt": "* Write a book\n  * Figure out asynchronous chapter\n  * Find an artist for the cover\n  * Write the rest of the book\n\n* Don't be sad\n  * Sit under tree\n  * Study bugs\n",
    "camera_logs.txt": logs.map(l => l.name).join("\n")
  }

  return function readTextFile(filename, callback) {
    if (/^activity/.test(filename)) generateLogs()
    let file = filename == "files.list" ? Object.keys(files).join("\n") : files[filename]
    Promise.resolve().then(() => {
      if (file == null) callback(null, "File " + filename + " does not exist")
      else callback(file)
    })
  }
}()

var activityGraph = table => {
  let widest = Math.max(50, Math.max(...table))
  return table.map((n, i) => {
    let width = (n / widest) * 20
    let full = Math.floor(width), rest = " ▏▎▍▌▋▊▉"[Math.floor((width - full) * 8)]
    return String(i).padStart(2, " ") + " " + "█".repeat(full) + rest
  }).join("\n")
}

var joinWifi = function(networkID, code) {
  return new Promise((accept, reject) => {
    setTimeout(() => {
      if (networkID != "HANGAR 2") return reject(new Error("Network not found"))
      let correct = "555555"
      if (code == correct) return accept(null)
      if (!correct.startsWith(code)) return reject(new Error("Invalid passcode"))
    }, 20)
  })
}

var request = function(){
  function error(device) {
    return (req, resolve, reject) => reject(new Error(device + ": malformed request"))
  }

  let hosts = {
    "10.0.0.1": error("ROUTER772"),
    "10.0.0.2": () => {},
    "10.0.0.4": () => {},
    "10.0.0.20": error("Puxel 7"),
    "10.0.0.33": error("jPhone[K]"),
  }

  function screen(n) {
    return (req, resolve, reject) => {
      if (!req || req.command !== "display") {
        reject(new Error("LedTec SIG-5030: INVALID REQUEST " + req?.type))
      } else if (!Array.isArray(req.data) || req.data.length !== 1500) {
        reject(new Error("LedTec SIG-5030: INVALID DISPLAY DATA"))
      } else {
        if (!screens) {
          if (typeof window != "object" || !window.document) return
          screens = new Screens
        }
        setTimeout(() => {
          screens.update(n, req.data)
          resolve({status: "ok"})
        }, 3 + Math.floor(Math.random() * 20))
      }
    }
  }

  ;["10.0.0.44", "10.0.0.45", "10.0.0.41",
    "10.0.0.31", "10.0.0.40", "10.0.0.42",
    "10.0.0.48", "10.0.0.47", "10.0.0.46"].forEach((addr, i) => hosts[addr] = screen(i))

  class Screens {
    constructor() {
      this.getParent()
      let doc = this.parent.ownerDocument
      this.dom = this.parent.appendChild(doc.createElement("div"))
      this.dom.style.cssText = "position: relative; max-width: 500px"
      let inner = this.dom.appendChild(doc.createElement("div"))
      inner.style.cssText = "position: relative; width: 100%; padding-bottom: 60%"
      this.screens = []
      for (let i = 0; i < 9; i++) {
        let screen = inner.appendChild(doc.createElement("div"))
        let row = Math.floor(i / 3), col = i % 3
        screen.style.cssText = "border: 1px solid #222; background: black; position: absolute; width: 33.3%; height: 33.3%; left: " + (col * 33.3) + "%; top: " + (row * 33.3) + "%"
        let canvas = screen.appendChild(doc.createElement("canvas"))
        canvas.style.cssText = "width: 100%; height: 100%"
        this.screens.push(canvas)
      }
      this.screens.forEach(c => { c.width = c.offsetWidth; c.height = c.offsetHeight })
    }

    getParent() {
      this.parent = window.__sandbox ? window.__sandbox.output.div : document.body
    }

    update(n, data) {
      this.getParent()
      if (!this.parent.ownerDocument.body.contains(this.dom)) this.parent.appendChild(this.dom)

      let canvas = this.screens[n], cx = canvas.getContext("2d")
      cx.clearRect(0, 0, canvas.width, canvas.height)
      let gapX = (canvas.width * 0.4) / 51, sizeX = (canvas.width * 0.6) / 50, skipX = gapX + sizeX
      let gapY = (canvas.height * 0.4) / 31, sizeY = (canvas.height * 0.6) / 30, skipY = gapY + sizeY
      for (let i = 0, col = 0, row = 0; i < 1500; i++) {
        let pixel = data[i]
        if (pixel) {
          cx.fillStyle = pixel == 3 ? "#fd4" : pixel == 2 ? "#a82" : "#741"
          cx.fillRect(gapX + col * skipX, gapY + row * skipY, sizeX, sizeY)
        }
        if (col == 49) { col = 0; row++ }
        else { col++ }
      }
    }
  }
  let screens = null

  return function request(address, content) {
    return new Promise((resolve, reject) => {
      let host = hosts[address]
      if (!host) reject(new Error("No route to host " + address))
      else host(JSON.parse(JSON.stringify(content)), resolve, reject)
    })
  }
}()

var clipImages = [
  [
    " 5dc",
    " e9.2 2b.3 .3 2b.o.3o. 2b.o.3o. 27.2 2.o2.o2. 27.o. .Oo.oO. . 25.o. .Oo.oO.4 20.2 2.Oo .Oo.oO.2o. 20.o 2.Oo.2Oo.oO.2o. 20.O. .O2.2Oo2O2o3. 20.O2 2oOo.O2oO2o3. 20.oOo oO2oO2oO2oOo. 1e.o2O3o2O8oOo 1f.O6oOao 1e.oO11o 1eoO12o. 1c.O13o. 6. 14.O14o. 1boO15. 1bO15o. 1aoO15o 1a.O16. 18. .O15o 1boO15. 1a.O15o 1b.O15. f",
    " 57e.2 5c",
    " 12d.2 1f0. 30.O 2f.oO 2foO2 2eoO3 2d.O4 2c.oO4 2b.O5o 2b.oOo.2 2d.2 fe",
    " b.oO15. 1aO16o 1b.oO14. 1a.oO14. 1boO15. 1b.O14o 1c.O14o 1b.O15. 1a.O16. 1a.O16. 1aoO16o.3 16.O1bo. 14oO1e. 11.O20o a.6oO22. 8O2b. 6O2c. 5O29o.3 5O25o2. aO23o. dO1fo.2 10O5o2O11o3.3 14o.4 2.5oO7o.3 27.3oO3 2fo2. 30. e7",
    " 33c.2 b7.4 7a.2 31. 135",
    " 370.3 31. 237",
    " 4c1.2 119",
    " 5dc"
  ],
  [
    " 5dc",
    " 1e3.2 30.3 .3 2a.o2. .o. 26.3 .o2.2o2. 26.o. .Oo.2o2. 26.O. .Oo.oOo. 22. 3.Oo oOo.oO.5 1e.o2 2oOo.oOo2O2.5 1foO. .O2.oOo2O2.2o2. 1d. oOo .O2.oOo2Oo.o3. 1c.o3O2o.O3oO2oOo4. 1c.2O6oO8o2Oo 1c.oO13. 1b.oO13o. c.2 c.O15o. 1aoO16. 18.oO17. 6.3 f.O17o. 18oO17. 18oO17o 19oO16o. b",
    " 5dc",
    " 2edo 30.O 2f.O2 2e.O3 2d.oO3 2c.oO4 2coO3o. 2co3. 192",
    " c.oO16o 19oO16o 1a.oO14o. 19.O15o. 1a.O14o. 1b.oO13o 1b.O15o 1b.O15. 1b.O15o 1boO17o. 17.O1bo 14.O1do. b.2o3.oO20o. 8.O29o. 6O2c. 5O2ao2. 5O26o2.2 8O24o. cO5o3Oo2O15o2.2 eOo.3 3. 2.o2O6o6.5 13. c.3O3o 2e.o2. 2b.2 181",
    " 29f. 36. 81.2 30.4 7a.2 1d2",
    " 304.4 6.2 2cc",
    " 5dc",
    " 5dc"
  ],
  [
    " 47a. 132.2 2d",
    " 345.2 2.2 2c.o. .3 26. 3.o2.2o2. 26.2 2.o2.2o2. 25.o2 .oOo.o2. 22o2 2.O2.2O2o2Oo.3 20oO. .O2.oOo2O2o.3 1d.o.oOo .O2.oOo2O2o.2o. 1a.2oO5.oO2o2O2oO2o.o2 19.2oO8oO8o4. 18.O14oO2o. 17.O17o. 17oO18o. 16.oO18o. 6",
    " 5dc",
    " 2ba.o 30oO 2e.oO2 2eoO3 2d.O4 2c.O3o. 2coOo. 2e.2 1c6",
    " f.O1ao 15.oO19o. 14.O1ao. 14.o2O17o.2 15oO16o2. 17.oO14o.2 19oO14o 1b.O15. 1a.oO17o. 16.oO1ao. f.4oO1eo. boO26. 9oO29o. 6O2bo. 5O29o3. 5O26o2. 9O2o4.2o.2oO18o. a.2o.2 9.2oO13o. 1doO2o. .d 1f.o.2 213",
    " 265.2 3. b5.2 7a.2 23e",
    " 29a. 31.2 7. 2e5. 20",
    " 5dc",
    " 5dc"
  ],
  [
    " 5dc",
    " 5dc",
    " 5a1.2 39",
    " 1a1. 83. 30.o 2f.oO 2e.oO2 2c.oO2o. 2b.oOo.2 2b.2o.2 2e.2 25d",
    " 28.3 2. 27.2 2.7 21.2 3.6o2.4 16.co. 2.o2.2oO2o3.2 e.o5O7o6Oo.2oOo.oO4o2.2 c.oO14o.oO2o2O6o.2 a.oO18oO2oO6o2.3 8.O24o3.2 5.2oO26o2. 3.oO2ao.2 3oO2ao. 5O2ao. 6O2ao. 6o5.2oO20o3. 6. 6oO1do.2 10.oO1ao2.2 12.oO17o2. 16.oO15. 1b.o6Oo2Oc. 1e.3o4Oco 21.o3Oo2O9o 22.o2O2oOa. . 20.o2Oco.3 20.2o5O2oO4o3. 22.5o.2o4O3o.2 24.3 .4oO3o. 2b.3o3. 2e.3 73",
    " 5dc",
    " 259.4 6.2 2f.4 344",
    " 5dc",
    " 5dc"
  ],
  [
    " 433. 1a8",
    " 5dc",
    " 598.3 41",
    " 256.o 2f.oO 2d.o3. 2b.2o2. 2c.o2. 2f. 290",
    " a3.5 29.o2O7o3.2 21.oO10o2. 1c.O15o.4 16.oO1ao. 13.O1eo. e.2oO21o c.oO24o. aO28o.7 2o2.o4O23o.4 3. 7.oO1do4.4 9.oO1do2.o4.3 9oO1bo6O3o3. 9oO18o. 3.o2O5o2. 9.oO14.3 6.2oO5o. 9oO15 a.2oO3o2. 9.oO14. a.2o3.3 9.O15o c.4 b.O16. 1b.oO14. 1c.oO13. 1d.o5Oe. 1f.2o3Odo 21oOfo 21oO4oOb. 20.3oOd. 22.oOdo 13",
    " 5dc",
    " 28b.5 34c",
    " f.o2Oco 22.2oO2oO9o. 23.o2.oO2o2O2o3.3 21.3 .Oo.2o2.2o.2o. 20.2 2.o.5 .4o.2 23.3 2. 3.5 4bf",
    " 443.3 196"
  ],
  [
    " 5dc",
    " 48a. 151",
    " 4b8.2 d6.2 31.2 17",
    " 256.o 2e.o3 2c.2o.2 2c.3 2e.2 37. 28a",
    " a2.6 29.oO9o.3 21.oO10o. 1d.O15o.3 17.O1bo. 12.oO1eo. e.oO22o c.O25o. aO28o. 8.6oO23o e.oO1fo2. e.oO1co. 11oO1c. 7. 6.4 2oO1bo 15oO1c. 13.o2O1bo 14oO1d. 13O1e. 13.oO1co 13.oO15oO2oO4. 12.O16o3.oO3o 12.oO15o. .2o4. 12.O15o 3.d coO14o 3.e b.O14o 9.4o2.2 coO13o 9.3o4. doO2oOfo b.6 3",
    " 5dc",
    " 3fe.2 1dc",
    " a.o2.o3Oco c.3 10. oO10 20.O11. 1f.O11. 1f.o3Oeo 21.2oOdo 22oOeo. 20.Ofo. 21o3Oco. 21.2oO2o2O8o. 23oOo.oO2oO2oOo.2 23oO. oOo.O2o3.2 23o2 2oOo.oO.5 23.2 2oOo o2.8 24.o. .o. . 2.3 24.o. .2 6. 26.2 2. 2a1",
    " 43b.3 19e"
  ],
  [
    " 5dc",
    " 4b8.2 122",
    " 4e6.3 d5.3 1b",
    " 257. 2f.o2 2d.2o. 2c.4 2d.3 66.3 258",
    " d3.2o5.3 26.oObo2.2 1f.O13o. 1boO16o3.2 15oO1co. 11oO21. c.o2O23o bO28. 9o6O24. d.oO23. e.O1eo.3 d.oO1co.2 11oO1bo 5.2 eoO1bo 15.O1c. 14oO1co 14.oO1bo 14oO1d 14o2O1c. 14.O1c. 13.O1do 14O1e. 13.O1do 14oO16oO5o. 13oO15o.oO5. 13.oO6oOd.2oO2oOo. b",
    " 16. 4ca. 30.2 c8",
    " 42d. 1ae",
    " 9oO14 2.o2.o2.5 11oO12o 2.d f.O2o5Oc 2.2 .3 .7 e.o2.o3Od. 9.6 10.oO10. 9.6 10.O5oOb. 1f.O11o 1f.o3Of 21.2oOe. 21oOeo. 20.Ofo. 20.Ofo.2 1f.o3Oco. 21.2oO2.oO7o2. 22.oOo.O3oO2oOo2. 22.O2 .O2o.O2.o2.2 22.o2 .O2.2Oo.o2.2 22.o. .O2.2Oo.2o.2 23. 2.oO.2o2.4 28o2 2.o. .2 28.o 2.3 2b.2 3. 114.3 90",
    " 469.3 170"
  ],
  [
    " 5dc",
    " 53b.3 9e",
    " 5dc",
    " 225. 2e.oO2 2b.2o4. 2a.2o. 2e. ba.7 234",
    " 104.5o3.3 25.oOeo2.2 1c.oO15o.4 14.oO1do. f.oO21o coO26. aO28o. 8.2o2O26o. b.oO25. b.O21o.3 c.O1eo.2 10.O1bo.2 13.O1b 16.O1b 16.O1b. 15.O1b. 16oO1a. 16oO1a. 16oO1a. 16.O1a. 17oO19. 17oO19o 17.O19o 17.O1a 17.O1a. e",
    " 4.2 32. 4fa.5 a4",
    " 5dc",
    " 9oO19. 17oO19o 17oOo5O13o 17.o2O18 18.oO17o. 17.O5oO11o2. 17oO4o2O12. 18.O4oO13. 18.o3O14o. 19.2oO13o2. 19.oO11o2Oo2.2 18.O12o5.2 18oO3oOeo3.4 18.O3oOeo3.4 18.2oOo2Oco4.2 1b.oOo3Obo.5 1b.o2.2oOo2O7o.6 1boOo.2O2o2O7o.5 1b.o2.2oOo.oOo2Oo2Oo.3 1d.o2 .oOo.oOo2Oo2O. 20.o. .Oo.2O2o2Oo2O. 21. 2oOo.oOo.O2.oO. 23.oO.2oOo.O2.2o. 23.o2.2oO.2Oo.2o. 23.o2 .o2.2o2. .2 23.o. .o2.2o2. .2 24.2 .o2 .o2. 27. 2.o. .o2. 2a.3 2.3 2b.2 2.2 19",
    " 48b.2 14f"
  ],
  [
    " 3c7.3 212",
    " 563.2 77",
    " 59f.2 3b",
    " 255.2o 2c.o2O3 2boOo3.2 10b.6 2c.5 1de",
    " 90.2 f.3 c3.2o5O5o9.2 19.oO17o3.2 12.oO1eo. d.2oO22. aoO27o 9O2ao. 6.3oO28o 8.2o2O24o2 coO20o. 10oO1co. 13.O19o. 16.O17o. 18.O17. 1aoO16. 1aoO16. 1aoO16 1boO15o 1boO15o 1boO15o 1boO15o 1boO15o 1boO15. 1boO14o. 12",
    " 516. 44.3 7e",
    " 494. d9. 6d",
    " 9oO14o. 1boO13o.2 1boO12o.2 1coO12.3 1b.oO11o. 1e.oO10o. 1e.oO10.2 1e.oOoOdo. 1f.o3Odo. 1e.o4Oao3.2 1e.o.2oOao3. 1f.4o4O6o.4 1f.3o5O6o.4 20.2o5O5o.2 23.2o5O2oO2o. 24.4o3Oo2Oo.2 24.4o8. 25.4o7.2 26.4o3.5 27.a 29.6 2d.4 30.2 17f",
    " 3bf. f2.2 128"
  ],
  [
    " 420.2 1ba",
    " 5ba.3 1f",
    " 8c.2 30.3 51b",
    " 2e6. 3.2o2 2b.oO5 2b.oO2o2. 2d.2 9e.7 140.2 74",
    " b6. 43.2 21.3 26.o6. 27.2oO7. 25.oOa. 1f.4o2Obo.3 18.o3O16o. 14.O1e. f.2oO20o a.2oO26. 7O2co. 4O2oO2ao 4. .oO26o.3 8.2o3O1eo. 12oO1ao. 15oO18o. 16.O16o. 19.Ofo4.2 1coOoO9o2.2 21.o3Oo2O2o2Oo2. 23.3oa.2 8.2 19.3o9.2 24.7o4.3 25.7o2.3 26.b 26.b 20",
    " 1b.3 563.3 58",
    " 595. 46",
    " 8. .8 29.8 29.8 2a.8 29.7 2b.6 2b.7 2c.4 2f. 2b0.3 bf. d0",
    " 5dc"
  ],
  [
    " 41a. 1c1",
    " 5b2.4 26",
    " b6.3 523",
    " 124.3 1e9.2 c.2 2c.2o2O2 29. .oO2o2. 2c.2 68.3 2f.3 110. 7c",
    " b4.2 2b.4o4. 27.2o2O6. 25.2o2O7o 23.3oO9o. 22.2oObo 21.o2Odo .2 1c.oO11oO3o. 17.oO19o. 13oO1e. f.oO21o. 9.2o2O25o. 5oO2c. 4O2ao.3 4.3oO23o.2 c.2oO1eo. 10.2oO1bo 12.2o9O11o. 13.3oOo3.2 2oOeo. 14.3o4.5 .oOo.3o3.4 17.2o4.4 5. 22.2o3.3 d. 1c.2o2.4 29.8 2b.6 2d.4 5d",
    " 13.3 564. 31.2 2e",
    " 4e5. da. 1b",
    " 441.3 198",
    " 5dc"
  ],
  [
    " 351. 31. 31. 30.2 30.2 30.2 30.2 30.2 30.2 30.2 31. 26.3 8. 31. 31.",
    " 25f.3 2b.a 26.e 23.7o4.7 20.2ob.7 1e.o7O5o5.3 1d.o2Ofo2.2 1c.oO12o2. 1boO15o.2 19oO16o2. 18oO17o2. 17oO19o. 16oO1ao. 15o2O1b. 14oO1co. 13o2O1co 13.oO1d. 12.2oO1co 12",
    " 3e. 59d",
    " 265. 30.3 b7.2 2c.6 2b.5 228",
    ".3o2O1b 12.4o3O18o 15.3oO18o 16.3oO17. 18.2O17. 1aoO16 1boO16 1boO15o 1boO16.4 17oO1bo. 14oO1do. 12oO1eo. 11.O20o. foO22o. a.oO24o. 7.2oO22o2.2 7o2O23o. b.2oO20o. 10.oO1co. 15.o2O16o. 1a.2oO10o2.2 1f.2oO8o2.3 24.oOo.5 2a.2 14c",
    " 2e6.3 2f3",
    " 5dc",
    " 3c8.2 212",
    " 575.2 31.2 32"
  ],
  [
    " 565. 31.2 43",
    " ce. 2e.9 29.2o6.2 28.oO6o.2 27.oO7o.2 24.3oO8o.2 23.3o2O8o.2 22.2o3O9o2.3 20.o2Oco.3 1e.2o2Odo3. 1c.3o2O10o. 1b.2o2O11o. 1b.2o2O12o. 1b.2oO13o 1b.2oO14. 1a.2oO14o 1b.oO15. 1a.2oO14o. 1a.oO15o 1a.2oO15. 1a.2O15o 1b.oO15o 1boO16. 1a.O17 1a.O17. 1aoO16o 13",
    " 5dc",
    " 28e.3 30.2 bf.2 2e.oO2 2b.3o2.2 2b.3 94. 131",
    " 7.O17. 19.O17. 19.O17. 19.O16o 1a.O16o 1a.O16o 1a.oO15. 1b.O15. 1boO15. 1boO15o.o3. 16oO1bo. 14oO1do 13.O1f. 12oO1fo. 10oO21o. c.oO21o2. 9.oO21o.2 8o3O21o2. boO21o. f.oO1do. 14.oO19.2 18.oO12o3. 1c.4oO9o2.2 26.O3o.3 2b.o. 119",
    " 2dd.3 2fc",
    " 5dc",
    " 3c0.2 30.2 1e8",
    " 59e.4 3a"
  ],
  [
    " 58b. 31.2 1d",
    " 71.2 2d.6 1a. 10.9 29.5o2.3 26. 2.4o4.2 24.5o2.o6. 23.2o.2o4O4o. 24.o2.2o4O4o. 24.Oo.oO2oO5. 21.3 oOo.oO7o. 20.o2.2O2o2O7o.2 20oOo3Obo. 20.oOfo. 1f.O11. 1f.O11o. 1e.O12. 1e.oO11o. 1eO13. 1eoO12o 1eoO12o. 1dO14. 1doO13. 1d.O13o 1c.oO13o 1c.O14o 1c.O15. 1boO15o 1b.O15o. 14",
    " 5dc",
    " f2.3 321.oO2 2c.2oO3 2b.o3.2 2c.2 131",
    " 7oO15. 1aoO16o 1aO17o 1a.O16o 14.2 4.O16o 1aoO16o 1aoO16o 1a.O16o 1a.O16o 1a.O16o 1b.O15o 1b.O15o.o4. 15.O1co. 13.O1eo. 12oO1f. 11.O21. 10oO21o. d.O20o3. a.2oO1eo2. 9. .2oO1fo. cO21o. fO1fo. 12oO1bo. 15.2oO15o.2 1a.oOo2Oco2. 24.4oO3o.2 2co3 b5",
    " 5e.3 289.2 17.3 16.2 12b.3 190",
    " 418. 31.2 1a.3 173",
    " 5dc",
    " 5c4.3 15"
  ],
  [
    " 583.3 56",
    " 85.2 23.2 2d.2 .3 2b.7 2b.7 27.2 2.o.3o.4 23.4 .o.3o2.4 23.o. .Oo.oO2o2. 24.o.3O3oO2o2. 24.o2.2oO6o2 21.2 2oOo.oO7o. 20.o. .O2.2O7o. 20.oOo.oOo.oO6o.3 1f.O2o.O2o2O7.3 1e.2oOeo.3 1doO10o2.2 1d.O11o2. 1d.O11o2. 1doOoO10o. 1doO12o. 1d.O12o. 1c.o2O11o2. 1a.O2o2O11o. 1boO14o. 1boO15o. 19oO16o. 19oO16. 1aoO16. 13",
    " 3b5. 226",
    " 449o2O 2c.2oOo2 2b.o2.2 2c.2 100",
    " 7oO16. 1a.O16. 19oO17. 19oO17. 1aoO16. 19.O17. 19oO17. 19.O17 1a.O16o 1a.O16o 1boO16 1boO16.2o3. 15oO1co. 13.O1eo. 12oO1f. 11.O20o. 10oO22. eoO20o2. coO1fo. d.oO1eo.2 b.3oO1eo. eOo3O1bo. 11.o2O1ao. 14oO18o.2 18.3O10o2. 1f.3 .3o.oO4o. 2c.o2. b4",
    " 57.2 270. 17.3 17.3 111.2 30.3 198",
    " 410.2 30.2 1a.2 17c",
    " 5dc",
    " 58a.2 31.2 1d"
  ]
].map(frame => frame.map(s => {
  let result = [], re = /([ .oO])([\da-f]*)/g, m
  while (m = re.exec(s)) {
    let v = " .oO".indexOf(m[1]), c = parseInt(m[2] || "1", 16)
    for (let i = 0; i < c; i++) result.push(v)
  }
  return result
}))
