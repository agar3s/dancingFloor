
import DancingFloor from '../dancingFloor'

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
    this.dancing = new DancingFloor({
      scene: this,
      cols: 6,
      rows: 6,
      x: this.padding.left,
      y: this.padding.top
    })

    // adds a miniom on a random place
    //this.addMinion(~~(Math.random()*6), ~~(Math.random()*6))
    //this.addMinion(~~(Math.random()*6), ~~(Math.random()*6))

    // register a basic mouse listener
    this.minionOnHand = this.add.sprite(0, 0, 'minion')
    this.minionOnHand.alpha = 0.6
    this.cursor = {
      boardCoords: {i:0, j:0}
    }
    this.input.on('pointermove', this.onMouseMove, this)
    this.input.on('pointerdown', this.onMouseClick, this)
  }

  update (time, dt) {
  }

  addMinion (i, j) {
    if (!this.dancing.addMinion(i, j)) {
      console.log('Error!!')
    }
  }

  onMouseMove (pointer) {
    if (pointer.position.x >= this.padding.left && 
        pointer.position.x < this.padding.left + this.dancing.rows*this.cellWidth) {
      this.cursor.i = (~~((pointer.position.x-this.padding.left) / this.cellWidth))
      this.minionOnHand.x = this.cursor.i * this.cellWidth + this.padding.left + this.cellWidth/2
    }

    if (pointer.position.y >= this.padding.top && 
        pointer.position.y < this.padding.top + this.dancing.cols*this.cellHeight) {
      this.cursor.j = (~~((pointer.position.y-this.padding.top) / this.cellHeight))
      this.minionOnHand.y = this.cursor.j * this.cellHeight + this.padding.top + this.cellHeight/2
    }
  }

  onMouseClick (pointer) {
    // creates a new minion on position
    this.addMinion(this.cursor.i, this.cursor.j)
  }
}

export {
  GameScene
}