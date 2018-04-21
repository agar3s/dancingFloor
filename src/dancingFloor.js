
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
          sprite: this.add.sprite(i*this.cellWidth + offsetX, j*this.cellHeight + offsetY, 'cell')
        })
        this.cells[j].push(cell)
      }
    }
  }

  addsMinion (i, j) { 
    let minionOffsetX = this.x + 40
    let minionOffsetY = this.y + 40
    this.add.sprite(i*this.cellWidth + minionOffsetX, j*this.cellHeight + minionOffsetY, 'minion')

    let affectEffect = [
      [0,1,0],
      [1,0,1],
      [0,1,0]
    ]

    this.cells[j][i].addMinion()

    let radiusX = (affectEffect[0].length - 1) / 2
    let radiusY = (affectEffect.length - 1) / 2

    let lowerLimitX = ((i-radiusX) < 0) ? 0 : i-radiusX
    let lowerLimitY = ((j-radiusY) < 0) ? 0 : j-radiusY
    let upperLimitX = (i + radiusX >= this.cols) ? this.cols - 1 : i + radiusX
    let upperLimitY = (j + radiusY >= this.rows) ? this.rows - 1 : j + radiusY

    for (var lj = lowerLimitY; lj <= upperLimitY; lj++) {
      let localRow = affectEffect[lj - (j - radiusY)]
      for (var li = lowerLimitX; li <= upperLimitX; li++) {
        let value = localRow[li - (i - radiusX)]
        if(value!=0) {
          this.cells[lj][li].affects()
        }
      }
    }
  }
}

// helper class
class Cell {
  constructor (config) {
    this.sprite = config.sprite
  }

  addMinion (minion) {
    this.sprite.tint = 0xff0000
  }
  affects () {
    this.sprite.tint = 0x00ff00
  }
}