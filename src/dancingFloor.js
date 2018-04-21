
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

    // setup a dancing floor of 6x6 cells with a fixed size
    let offsetX = this.x + this.cellWidth/2
    let offsetY = this.y + this.cellHeight/2

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        this.add.sprite(i*this.cellWidth + offsetX, j*this.cellHeight + offsetY, 'cell')
      }
    }
  }

  addsMinion (i, j) { 
    let minionOffsetX = this.x + 40
    let minionOffsetY = this.y + 40
    this.add.sprite(i*this.cellWidth + minionOffsetX, j*this.cellHeight + minionOffsetY, 'minion')
  }
}