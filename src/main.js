import 'phaser'
import {BootScene} from './scenes/boot'
import {GameScene} from './scenes/game'

var config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 800,
  scaleMode: 1,
  pixelArt: true,
  canvas: document.getElementById('game'),
  scene: [
    GameScene,
    BootScene
  ]
}

let game = new Phaser.Game(config)


document.getElementById('game').focus()
window.focus()