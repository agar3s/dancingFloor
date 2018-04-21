

class BootScene extends Phaser.Scene {
  constructor() {
    super({key: 'bootScene'})
    console.log('load boot')
    console.log(this.scene)
  }

  preload () {

  }

  create () {

  }

  update (time, dt) {
    console.log('update boot')
    // how to change to another scene
    // this.scene.manager.switch('bootScene', 'gameScene')
  }
}

export {
  BootScene
}