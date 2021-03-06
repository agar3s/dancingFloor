
import DancingFloor from '../dancingFloor'
import BeatMaster from '../beatMaster'

const STATUS = {
  PLAY_CARD: 0,
  PLACING_CARD: 1,
  GAME_OVER: 2
}

const PLAYER = {
  P1: 'P1',
  P2: 'P2'
}

const CONFIG_COLORS = {
  P1: {
    danceTint: 0x96F044,
    danceFrame: 5,
    beat: 1
  },
  P2: {
    danceTint: 0xdd76dd,
    danceFrame: 2,
    beat: -1
  }
}

const AUTOPLAY = true

class GameScene extends Phaser.Scene {
  constructor() {
    super({key: 'gameScene'})
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

    this.currentPlayer = PLAYER.P1

    this.cont = 0
    this.turns = 0
    this.detune = 0
  }

  preload () {
    this.load.spritesheet('cell', '../assets/CellFloor.png', { frameWidth: 100, frameHeight: 100 })
    
    this.load.spritesheet('Card01', '../assets/card01.png', { frameWidth: this.cardWidth, frameHeight: this.cardHeight })
    this.load.spritesheet('minion1', '../assets/discoCat.png', { frameWidth: 60, frameHeight: 80 })
    
    this.load.spritesheet('Card02', '../assets/card02.png', { frameWidth: this.cardWidth, frameHeight: this.cardHeight })
    this.load.spritesheet('minion2', '../assets/lawCat.png', { frameWidth: 60, frameHeight: 80 })
    
    this.load.spritesheet('Card03', '../assets/card03.png', { frameWidth: this.cardWidth, frameHeight: this.cardHeight })
    this.load.spritesheet('minion3', '../assets/thrillerCat.png', { frameWidth: 60, frameHeight: 80 })
    
    this.load.spritesheet('Card04', '../assets/card04.png', { frameWidth: this.cardWidth, frameHeight: this.cardHeight })
    this.load.spritesheet('minion4', '../assets/powersCat.png', { frameWidth: 60, frameHeight: 80 })
    

    // ball
    this.load.spritesheet('beatBall', '../assets/beatBall.png', { frameWidth: 40, frameHeight: 40 })
    this.load.audio('beatAudio1', '../assets/beat1.ogg')

    // sounds
    this.load.audio('bad1', '../assets/bad1.ogg')
    this.load.audio('bad2', '../assets/bad2.ogg')
    this.load.audio('good1', '../assets/good1.ogg')

    // font
    this.load.bitmapFont('defaultFont', '../assets/font_0.png', '../assets/font.xml')
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
    this.minionOnHand = this.add.sprite(0, 0, 'minion1')

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
      let randomIndex = (~~(Math.random()*4)) + 1
      let card = this.add.sprite(i*100 + 200, 700, `Card0${randomIndex}`)
      card.setInteractive()
      card.setData('index', i)
      card.setData('type', randomIndex)
      this.cards.push(card)
    }

    // beat master
    this.beatBalls = []
    this.beatIndex = 0
    this.previousBeatIndex = 0
    for (var i = 0; i < 8; i++) {
      this.beatBalls.push(this.add.sprite(750, 40 + 60*i, 'beatBall'))
    }

    this.beatSound = this.sound.add('beatAudio1')
    this.badSound1 = this.sound.add('bad1')
    this.badSound2 = this.sound.add('bad2')
    this.goodSound1 = this.sound.add('good1')

    console.log('asddas')
    console.log(this.beatSound, 'asddas')
    this.beatSound.volume = 0.1
    this.goodSound1.volume = 0.1

    this.beatMaster = new BeatMaster({listener: this})
    // start the beat after 1 second to check async behaviour
    setTimeout(() => {
      this.beatMaster.start()
    }, 1200)
  }

  update (time, dt) {
    if (AUTOPLAY && this.staus != STATUS.GAME_OVER) {
      if(this.cont==30) {
        this.cont = 0
        this.autoPlay()
      }
      this.cont++
    }

    // update the beat
    this.beatMaster.update(time, dt)
  }

  addMinion (i, j) {
    let card = this.cards[this.indexCardSelected]
    let emojis = ['Dance','Yeah!','Good!','Perfect','Nice','Right‍', 'Oh yeah!‍', 'Meowww‍', 'WooW', 'AND THE BEAT GOES ON!', 'Rasputin!', 'FEVER', 'ITS SATURDAY\nFEVER NIGHT!']
    let good = true
    if (this.dancing.addMinion(i, j, CONFIG_COLORS[this.currentPlayer], this.minionOnHand.getData('type'))) {
      this.badSound2.play()
      this.goodSound1.play()
    } else {
      console.log('lose the turn')
      good = false
      this.badSound2.play()
      this.cameras.main.shake(400, 0.005)
      this.cameras.main.flash(300)

      emojis = ['BAD!', 'NOOOO', 'OH DUDE!', 'FAIL', 'MISS', 'BEAT LOST']
    }

    let alert = this.add.bitmapText(
      (i+0.5)*this.cellWidth + this.padding.left,
      j*this.cellHeight + this.padding.top,
      'defaultFont',
      `!${emojis[~~(Math.random()*emojis.length)]}!`,
      96
    )
    alert.tint = good?0x00ff00:0xff0000

    alert.setOrigin(0.5, 0.5)
    alert.rotation = -0.4 + 0.8 * Math.random()
    this.tweens.add({
      targets: alert,
      alpha: 0,
      ease: 'Expo.easeIn',
      duration: 500,
      delay: 100,
      repeat: 0,
      onComplete: () => {
        alert.destroy()
      }
    })

    this.endsTurn()
  }

  autoPlay () {
    this.indexCardSelected = ~~(Math.random()*5)
    let cardType = this.cards[this.indexCardSelected].getData('type')
    this.minionOnHand.setData('type', cardType)
    let coords = this.dancing.getRandomAvailableLocation(CONFIG_COLORS[this.currentPlayer].beat)
    if (coords.i == -1) return this.status = STATUS.GAME_OVER
    this.addMinion(coords.i, coords.j)
  }

  onMouseMove (pointer) {
    let coords = {x: pointer.position.x, y: pointer.position.y}

    let nextPosition = {x: coords.x, y: coords.y}

    if (this.status === STATUS.PLAY_CARD) {


    } else if (this.status === STATUS.PLACING_CARD) {
      this.updatePreviewMinionState(pointer.position.x, pointer.position.y, 0xff9999)
      
      // get dancing coords
      coords = this.dancing.getDanceCoordsFor(
        coords.x - this.padding.left,
        coords.y - this.padding.top
      )
      // update cursor with coords
      this.cursor.i = coords.i
      this.cursor.j = coords.j

      this.cursor.validPosition = coords.i != -1 && coords.j != -1
      
      // if cursor is valid
      if (this.cursor.validPosition) {
        this.updatePreviewMinionState(
          this.cursor.i * this.cellWidth + this.padding.left + this.cellWidth/2,
          this.cursor.j * this.cellHeight + this.padding.top + this.cellHeight/2
        )
      }
    }
  }

  onMouseClick (pointer) {
    let coords = {x: pointer.position.x, y: pointer.position.y}

    // creates a new minion on position
    if (this.status === STATUS.PLACING_CARD) {
      // only allows to add a card if there is a valid position in the dancing floor
      if ( this.cursor.validPosition ) {
        // play a card
        this.addMinion(this.cursor.i, this.cursor.j)
        this.removeCard(this.indexCardSelected)
      }
    } else if (this.status === STATUS.PLAY_CARD) {
      
      if (this.indexCardSelected != -1) {
        this.status = STATUS.PLACING_CARD
        let card = this.cards[this.indexCardSelected]
        card.alpha = 0
        this.minionOnHand.destroy()
        this.minionOnHand = this.add.sprite(0, 0, `minion${card.getData('type')}`)
        this.minionOnHand.setData('type', card.getData('type'))
        card.destroy()

        let randomIndex = (~~(Math.random()*4)) + 1
        let newcard = this.add.sprite(this.indexCardSelected*100 + 200, 700, `Card0${randomIndex}`)
        newcard.setInteractive()
        newcard.setData('index', this.indexCardSelected)
        newcard.setData('type', randomIndex)
        newcard.alpha = 0
        
        this.cards[this.indexCardSelected] = newcard


        this.updatePreviewMinionState(coords.x, coords.y)
      }
    }
  }

  onPointerHover (event, gameObject) {
    if (this.status != STATUS.PLAY_CARD) return
    let card = gameObject[0]
    if (card) {
      card.y -= 15
      this.indexCardSelected = card.getData('index')
    }
  }

  onPointerOut (event, gameObject) {
    if (this.status != STATUS.PLAY_CARD) return
    let card = gameObject[0]
    if (card) {
      this.drawCard(card)
    }
  }

  endsTurn () {
    this.turns += 1

    // restore cards
    let card = this.cards[this.indexCardSelected]
    this.status = STATUS.PLAY_CARD
    if (card) {
      card.alpha = 0.8
      card.scaleX = 2
      card.scaleY = 2
      this.tweens.add({
        targets: card,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        ease: 'Expo.easeIn',
        duration: 300,
        delay: 50,
        repeat: 0
      })
    }
    this.minionOnHand.alpha = 0

    // check no more space?
    if (this.dancing.isFull()) {
      this.status == STATUS.GAME_OVER
      if(this.dancing.globalBeat>0) console.log('player1 wins')
      else if(this.dancing.globalBeat<0) console.log('player2 wins')
      else console.log('draw!')
      console.log('game over!!!!', this.turns, 'turns taken')
      return
    }
    if (this.currentPlayer === PLAYER.P1) {
      this.currentPlayer = PLAYER.P2
      // this player can play?
    } else {
      this.currentPlayer = PLAYER.P1
    }
    for (var i = 0; i < this.beatBalls.length; i++) {
      this.beatBalls[i].tint = CONFIG_COLORS[this.currentPlayer].danceTint
    }
    let coords = this.dancing.getRandomAvailableLocation(CONFIG_COLORS[this.currentPlayer].beat)
    if (coords.i == -1) {
      this.turns -= 1
      console.log('player ', this.currentPlayer, 'loses. in the ', this.turns, 'th turn')
      this.endsTurn()
    }
  }

  updatePreviewMinionState (x, y, tint=0xffffff, alpha=0.6) {
    this.minionOnHand.x = x
    this.minionOnHand.y = y
    // apply tint
    this.minionOnHand.alpha = 0.6
    this.minionOnHand.tint = tint
  }

  drawCard (card) {
    card.y += 15
    this.indexCardSelected = -1
  }

  removeCard (index) {

  }

  notifyBeat () {
    this.detune++

    if (this.previousBeatIndex == 7) {
      //this.endsTurn()
      // not ready
    }

    this.beatBalls[this.previousBeatIndex].alpha = 1

    this.beatBalls[this.beatIndex].alpha = 1
    let tween = this.tweens.add({
      targets: this.beatBalls[this.beatIndex],
      alpha: 0,
      ease: 'Expo.easeIn',
      duration: this.beatMaster.timeInterval- 100,
      delay: 32,
      repeat: 0
    })


    this.previousBeatIndex = this.beatIndex
    this.beatIndex++
    if(this.beatIndex==8) this.beatIndex = 0
  
    this.beatSound.play()
    //this.beatSound.setDetune(this.detune*100)
    //console.log(this.detune)

    this.dancing.notifyBeat(this.beatMaster.timeInterval)
  }
}

export {
  GameScene
}