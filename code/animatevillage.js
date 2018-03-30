// test: no

(function() {
  "use strict"

  let active = null

  const places = {
    "Alice's House": {x: 279, y: 100},
    "Bob's House": {x: 295, y: 203},
    "Cabin": {x: 372, y: 67},
    "Daria's House": {x: 183, y: 285},
    "Ernie's House": {x: 50, y: 283},
    "Farm": {x: 36, y: 118},
    "Grete's House": {x: 35, y: 187},
    "Marketplace": {x: 162, y: 110},
    "Post Office": {x: 205, y: 57},
    "Shop": {x: 137, y: 212},
    "Town Hall": {x: 202, y: 213}
  }
  const placeKeys = Object.keys(places)

  const speed = 2

  class Animation {
    constructor(worldState, robot, robotState) {
      this.worldState = worldState
      this.robot = robot
      this.robotState = robotState
      this.turn = 0

      let outer = (window.__sandbox ? window.__sandbox.output.div : document.body), doc = outer.ownerDocument
      this.node = outer.appendChild(doc.createElement("div"))
      this.node.style.cssText = "position: relative; line-height: 0.1; margin-left: 10px"
      this.map = this.node.appendChild(doc.createElement("img"))
      this.map.src = "img/village2x.png"
      this.map.style.cssText = "vertical-align: -8px"
      this.robotElt = this.node.appendChild(doc.createElement("div"))
      this.robotElt.style.cssText = `position: absolute; transition: left ${0.8 / speed}s, top ${0.8 / speed}s;`
      let robotPic = this.robotElt.appendChild(doc.createElement("img"))
      robotPic.src = "img/robot_moving2x.gif"
      this.parcels = []

      this.text = this.node.appendChild(doc.createElement("span"))
      this.button = this.node.appendChild(doc.createElement("button"))
      this.button.style.cssText = "color: white; background: #28b; border: none; border-radius: 2px; padding: 2px 5px; line-height: 1.1; font-family: sans-serif; font-size: 80%"
      this.button.textContent = "Stop"

      this.button.addEventListener("click", () => this.clicked())
      this.schedule()

      this.updateView()
      this.updateParcels()

      this.robotElt.addEventListener("transitionend", () => this.updateParcels())
    }


    updateView() {
      let pos = places[this.worldState.place]
      this.robotElt.style.top = (pos.y - 38) + "px"
      this.robotElt.style.left = (pos.x - 16) + "px"

      this.text.textContent = ` Turn ${this.turn} `
    }

    updateParcels() {
      while (this.parcels.length) this.parcels.pop().remove()
      let heights = {}
      for (let {place, address} of this.worldState.parcels) {
        let height = heights[place] || (heights[place] = 0)
        heights[place] += 14
        let node = document.createElement("div")
        let offset = placeKeys.indexOf(address) * 16
        node.style.cssText = "position: absolute; height: 16px; width: 16px; background-image: url(img/parcel2x.png); background-position: 0 -" + offset + "px";
        if (place == this.worldState.place) {
          node.style.left = "25px"
          node.style.bottom = (20 + height) + "px"
          this.robotElt.appendChild(node)
        } else {
          let pos = places[place]
          node.style.left = (pos.x - 5) + "px"
          node.style.top = (pos.y - 10 - height) + "px"
          this.node.appendChild(node)
        }
        this.parcels.push(node)
      }
    }

    tick() {
      let {direction, memory} = this.robot(this.worldState, this.robotState)
      this.worldState = this.worldState.move(direction)
      this.robotState = memory
      this.turn++
      this.updateView()
      if (this.worldState.parcels.length == 0) {
        this.button.remove()
        this.text.textContent = ` Finished after ${this.turn} turns`
        this.robotElt.firstChild.src = "img/robot_idle2x.png"
      } else {
        this.schedule()
      }
    }

    schedule() {
      this.timeout = setTimeout(() => this.tick(), 1000 / speed)
    }

    clicked() {
      if (this.timeout == null) {
        this.schedule()
        this.button.textContent = "Stop"
        this.robotElt.firstChild.src = "img/robot_moving2x.gif"
      } else {
        clearTimeout(this.timeout)
        this.timeout = null
        this.button.textContent = "Start"
        this.robotElt.firstChild.src = "img/robot_idle2x.png"
      }
    }
  }

  window.runRobotAnimation = function(worldState, robot, robotState) {
    if (active && active.timeout != null)
      clearTimeout(active.timeout)
    active = new Animation(worldState, robot, robotState)
  }
})()
