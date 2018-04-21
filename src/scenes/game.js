
import DancingFloor from '../dancingFloor'

const STATUS = {
  PLAY_CARD: 0,
  PLACING_CARD: 1
}

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

    this.cardWidth = 80
    this.cardHeight = 120

    this.status = STATUS.PLAY_CARD
  }

  preload () {
    this.load.spritesheet('cell', '../assets/CellFloor.png', { frameWidth: 100, frameHeight: 100 })
    this.load.spritesheet('minion', '../assets/minion.png', { frameWidth: 60, frameHeight: 60 })
    this.load.spritesheet('baseCard', '../assets/baseCard.png', { frameWidth: this.cardWidth, frameHeight: this.cardHeight })
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

    this.minionOnHand.alpha = 0
    this.cursor = {
      boardCoords: {i:0, j:0}
    }
    this.input.on('pointermove', this.onMouseMove, this)
    this.input.on('pointerdown', this.onMouseClick, this)
    this.input.on('pointerover', this.onPointerHover, this)
    this.input.on('pointerout', this.onPointerOut, this)


    // displays the hand
    this.indexCardSelected = -1
    this.cards = []
    for (var i = 0; i < 5; i++) {
      let card = this.add.sprite(i*100 + 200, 700, 'baseCard')
      card.setInteractive()
      card.setData('index', i)
      this.cards.push(card)
    }
  }

  update (time, dt) {
  }

  addMinion (i, j) {
    if (!this.dancing.addMinion(i, j)) {
      console.log('Error!!')
    }
  }

  onMouseMove (pointer) {
    let coords = {x: pointer.position.x, y: pointer.position.y}

    let nextPosition = {x: coords.x, y: coords.y}

    if (this.status === STATUS.PLAY_CARD) {


    } else if (this.status === STATUS.PLACING_CARD) {
      this.cursor.validPosition = false
      
      if (coords.x >= this.padding.left && 
          coords.x < this.padding.left + this.dancing.rows*this.cellWidth) {
        this.cursor.i = (~~((coords.x-this.padding.left) / this.cellWidth))
        this.cursor.validPosition = true
      }

      if ( this.cursor.validPosition && 
        coords.y >= this.padding.top && 
          coords.y < this.padding.top + this.dancing.cols*this.cellHeight) {
        this.cursor.j = (~~((coords.y-this.padding.top) / this.cellHeight))
      } else {
        this.cursor.validPosition = false
      }
      
      if (this.cursor.validPosition) {
        this.minionOnHand.alpha = 0.6
        this.minionOnHand.x = this.cursor.i * this.cellWidth + this.padding.left + this.cellWidth/2
        this.minionOnHand.y = this.cursor.j * this.cellHeight + this.padding.top + this.cellHeight/2
        this.minionOnHand.tint = 0xffffff
      } else {
        this.minionOnHand.x = nextPosition.x
        this.minionOnHand.y = nextPosition.y
        this.minionOnHand.tint = 0xff9999
      }
    }
  }

  onMouseClick (pointer) {
    let coords = {x: pointer.position.x, y: pointer.position.y}

    // creates a new minion on position
    if (this.status === STATUS.PLACING_CARD) {
      // only allows to add a card if there is a valid position in the dancing floor
      if ( this.cursor.validPosition ) {
        this.addMinion(this.cursor.i, this.cursor.j)
        this.minionOnHand.alpha = 0
        this.status = STATUS.PLAY_CARD
      }
    } else if (this.status === STATUS.PLAY_CARD) {
      
      if (this.indexCardSelected != -1) {
        this.status = STATUS.PLACING_CARD
        this.cards[this.indexCardSelected].alpha = 0
        this.minionOnHand.alpha = 0.6
        this.minionOnHand.x = coords.x
        this.minionOnHand.y = coords.y
      }
    }
  }

  onPointerHover (event, gameObject) {
    let card = gameObject[0]
    if (card) {
      card.y -= 15
      this.indexCardSelected = card.getData('index')
    }
  }

  onPointerOut (event, gameObject) {
    let card = gameObject[0]
    if (card) {
      card.y += 15
      this.indexCardSelected = -1
    }
  }
}

export {
  GameScene
}