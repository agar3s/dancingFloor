
export default class DancingFloor {
  constructor(config) {
    this.add = config.scene.add
    this.tweens = config.scene.tweens

    this.cols = config.cols
    this.rows = config.rows
    this.x = config.x
    this.y = config.y

    // should be calculated based on cols and rows
    this.cellWidth = 100
    this.cellHeight = 100

    // cell matrix
    this.cells = []


    // setup a dancing floor of 6x6 cells with a fixed size
    let offsetX = this.x + this.cellWidth/2
    let offsetY = this.y + this.cellHeight/2

    for (let j = 0; j < this.rows; j++) {
      this.cells.push([])
      for (let i = 0; i < this.cols; i++) {
        let cell = new Cell({
          sprite: this.add.sprite(i*this.cellWidth + offsetX, j*this.cellHeight + offsetY, 'cell'),
          text: this.add.bitmapText(
            i*this.cellWidth + this.x + 5,
            j*this.cellHeight + this.y - 15, 'defaultFont', 96)
        })
        this.cells[j].push(cell)
      }
    }

    this.globalBeat = 0
    this.globalBeatText = this.add.bitmapText(
      10,
      10,
      'defaultFont',
      'X',
      40
    )
  }

  addMinion (i, j, properties, type) {
    //let minionOffsetX = this.x + this.cellWidth/2
    //let minionOffsetY = this.y + this.cellHeight/2

    // check available space
    if(!this.cells[j][i].addMinion(properties)) return false
    let minionOffsetX = this.x + 50
    let minionOffsetY = this.y + 50

    // minion 
    const spaceTypes = {
      1:[
        [0,1,1],
        [0,1,0],
        [1,1,0]
      ],
      2:[
        [1,1,0],
        [0,1,0],
        [0,1,1]
      ],
      3:[
        [0,1,0],
        [1,1,1],
        [0,1,0]
      ],
      4:[
        [1,0,1],
        [0,1,0],
        [1,0,1]
      ]
    }
    let danceSpace = spaceTypes[type]
    // add minion
    let minionSprite = this.add.sprite(
      i*this.cellWidth + minionOffsetX,
      j*this.cellHeight + minionOffsetY - 30,
      `minion${type}`
    )
    //minionSprite.tint = properties.danceTint
    this.cells[j][i].setMinion(minionSprite)

    // get dance radius
    let radiusX = (danceSpace[0].length - 1) / 2
    let radiusY = (danceSpace.length - 1) / 2

    // find dance limits in the floor
    let lowerLimitX = ((i-radiusX) < 0) ? 0 : i-radiusX
    let lowerLimitY = ((j-radiusY) < 0) ? 0 : j-radiusY
    let upperLimitX = (i + radiusX >= this.cols) ? this.cols - 1 : i + radiusX
    let upperLimitY = (j + radiusY >= this.rows) ? this.rows - 1 : j + radiusY

    // update cells with the dancing space
    for (var lj = lowerLimitY; lj <= upperLimitY; lj++) {
      let localRow = danceSpace[lj - (j - radiusY)]
      for (var li = lowerLimitX; li <= upperLimitX; li++) {
        let value = localRow[li - (i - radiusX)]
        if (value !== 0) {
          this.cells[lj][li].affects(properties.beat, properties)
        }
      }
    }

    this.calculateCurrentPoints()
    
    return true
  }

  getDanceCoordsFor (x, y) {
    let coords = {i: -1, j: -1}

    if (x >= 0 && x < this.rows*this.cellWidth) {
      coords.i = ~~(x / this.cellWidth)
    }

    if (coords.i != -1 && y >= 0 && y < this.cols*this.cellHeight) {
      coords.j = ~~(y / this.cellHeight)
    }
    return coords
  }

  calculateCurrentPoints () {
    this.globalBeat = 0
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        let beat = this.cells[j][i].beat
        if (beat != 'X') this.globalBeat += beat
      }
    }
    this.globalBeatText.setText('' + this.globalBeat)
  }

  getRandomAvailableLocation (beat) {
    let availableLocations = []
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        let cell = this.cells[j][i]
        if (!cell.empty) continue
        let cellbeat = cell.beat
        if ((cellbeat == 'X') || (cellbeat != 0 && cellbeat/beat > 0)) {
          availableLocations.push([i, j])
        }
      }
    }
    let possibleCells = availableLocations.length
    if (possibleCells == 0) return {i: -1, j: -1}
    let randomIndex = ~~(Math.random()*possibleCells)
    return {
      i: availableLocations[randomIndex][0],
      j: availableLocations[randomIndex][1]
    }
  }

  isFull () {
    let random = this.getRandomAvailableLocation(1)
    if (random.i != -1) return false
    random = this.getRandomAvailableLocation(-1)
    if (random.i != -1) return false
    return true
  }

  notifyBeat (timeInterval) {
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        this.cells[j][i].notifyBeat(this.tweens, timeInterval)
      }
    }  
  }
}

// helper class
class Cell {
  constructor (config) {
    this.sprite = config.sprite
    this.sprite.setFrame(4)
    this.displayText = config.text
    this.displayText.fontSize = 52
    this.empty = true
    this.beat = 'X'
    this.minionSprite

    this.beatState = 0
    //this.sprite.tint = 0x333333
    this.baseIndexFrame = 4
  }

  addMinion (minion) {
    if (!this.empty) return false
    if (this.beat != 'X') {
      // if the beat is different than minion
      
      if (this.beat==0 || minion.beat/this.beat < 0) return false
    } else {
      if (!this.beatState) return false
    }
    
    this.baseIndexFrame = minion.danceFrame
    //this.sprite.tint = minion.danceTint
    this.sprite.setFrame(minion.danceFrame)

    this.empty = false
    return true
  }

  setMinion(minionSprite) {
    this.minionSprite = minionSprite
  }

  affects (beat, properties) {
    //if(!this.empty) return false
    if (this.beat == 'X') {
      this.beat = 0
    }
    this.beat += beat

    if (this.beat === 0) {
      this.baseIndexFrame = 0
      //this.sprite.tint = 0xFDE437
      this.sprite.setFrame(0)
    }

    if (this.beat === beat) {
      //this.sprite.tint = color
      this.sprite.setFrame(properties.danceFrame)
      this.baseIndexFrame = properties.danceFrame
    }

    this.displayText.setText(''+this.beat)

  }

  notifyBeat (tweenManager, timeInterval, beat = 0) {
    if (this.minionSprite) {
      this.minionSprite.scaleX *= -1
    }
    //this.sprite.scaleX *= -1
    this.beatState ^= Math.random()>0.5?0:1
    let randomColor = this.baseIndexFrame
    if(this.baseIndexFrame == 4) {
      randomColor = 1
    }

    if(this.beatState) {
      this.sprite.setFrame(randomColor)
    } else {
      this.sprite.setFrame(this.baseIndexFrame)
    }
    //this.sprite.tint = this.beatState?randomColor:this.baseIndexFrame

    this.sprite.alpha = 1

    tweenManager.add({
      targets: this.sprite,
      alpha: 0.4,
      ease: 'Expo.easeIn',
      duration: timeInterval - 100 - 80,
      delay: 80,
      repeat: 0
    })
  }
}
