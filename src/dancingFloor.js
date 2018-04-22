
export default class DancingFloor {
  constructor(config) {
    this.add = config.scene.add

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
          text: this.add.text(i*this.cellWidth + this.x + 5, j*this.cellHeight + this.y + 5, '', {fontSize: 25, color: '#f33'})
        })
        this.cells[j].push(cell)
      }
    }

    this.globalBeatText = this.add.text(10, 10, 'X', {fontSize: 40, color: '#fff'})
  }

  addMinion (i, j, properties) { 
    //let minionOffsetX = this.x + this.cellWidth/2
    //let minionOffsetY = this.y + this.cellHeight/2

    // check available space
    if(!this.cells[j][i].addMinion(properties)) return false
    let minionOffsetX = this.x + 50
    let minionOffsetY = this.y + 50

    // minion 
    let danceSpace = [
      [0,1,0],
      [1,1,1],
      [0,1,0]
    ]
    // add minion
    this.add.sprite(i*this.cellWidth + minionOffsetX, j*this.cellHeight + minionOffsetY, 'minion')

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
          this.cells[lj][li].affects(properties.beat, properties.danceTint)
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
    let totalBeat = 0
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        let beat = this.cells[j][i].beat
        if (beat != 'X') totalBeat += beat
      }
    }
    this.globalBeatText.setText('' + totalBeat)
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
}

// helper class
class Cell {
  constructor (config) {
    this.sprite = config.sprite
    this.displayText = config.text
    this.empty = true
    this.beat = 'X'

  }

  addMinion (minion) {
    if (!this.empty) return false
    if (this.beat != 'X') {
      // if the beat is different than minion
      
      if (this.beat==0 || minion.beat/this.beat < 0) return false
    }
    this.sprite.tint = minion.danceTint
    this.empty = false
    return true
  }

  affects (beat, color) {
    //if(!this.empty) return false
    if (this.beat == 'X') {
      this.beat = 0
    }
    this.beat += beat

    if (this.beat === 0) {
      this.sprite.tint = 0x66ffff
    }

    if (this.beat === beat) {
      this.sprite.tint = color
    }

    this.displayText.setText(''+this.beat)

  }
}