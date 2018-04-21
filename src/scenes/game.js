

class GameScene extends Phaser.Scene {
  constructor() {
    super({key: 'gameScene'})
    console.log('load game')
    this.rows = 6
    this.cols = 6
    this.padding = {
      top: 20,
      bottom: 20,
      left: 100,
      right: 20
    }
    this.cellWidth = 100
    this.cellHeight = 100
  }

  preload () {
    this.load.spritesheet('cell', '../assets/CellFloor.png', { frameWidth: 100, frameHeight: 100 })
    this.load.spritesheet('minion', '../assets/minion.png', { frameWidth: 80, frameHeight: 80 })
  }

  create () {

    // setup a dancing floor of 6x6 cells with a fixed size
    let offsetX = this.padding.left + this.cellWidth/2
    let offsetY = this.padding.top + this.cellHeight/2

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        this.add.sprite(i*this.cellWidth + offsetX, j*this.cellHeight + offsetY, 'cell')
      }
    }

    // adds a miniom on a random place
    let i = ~~(Math.random()*6)
    let j = ~~(Math.random()*6)
    let minionOffsetX = this.padding.left + 40
    let minionOffsetY = this.padding.top + 40
    this.add.sprite(i*this.cellWidth + minionOffsetX, j*this.cellHeight + minionOffsetY, 'minion')
  }

  update (time, dt) {
  }
}

export {
  GameScene
}