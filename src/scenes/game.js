

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
      top: 20
    }
    this.cellWidth = 100
    this.cellHeight = 100
  }

  preload () {
    this.load.spritesheet('cell', '../assets/CellFloor.png', { frameWidth: 100, frameHeight: 100 })

  }

  create () {
    let offsetX = this.padding.left + this.cellWidth/2
    let offsetY = this.padding.top + this.cellHeight/2

    for (var j = 0; j < this.rows; j++) {
      for (var i = 0; i < this.cols; i++) {
        this.add.sprite(i*this.cellWidth + offsetX, j*this.cellHeight + offsetY, 'cell')
      }
    }
  }

  update (time, dt) {
  }
}

export {
  GameScene
}