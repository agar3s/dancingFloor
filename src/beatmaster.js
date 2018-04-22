
const TEMPO = [80, 100, 120, 140, 160, 180]

export default class BeatMaster {
  constructor (config) {
    this.tempo = TEMPO[0]

    this.lastTime = 0
    this.status = 0
    this.listener = config.listener
  }

  setTempo (tempo = 2) {
    this.tempo = TEMPO[tempo]
    this.timeInterval = 60*1000 / this.tempo
  }

  update (time, dt) {
    if (this.status == 0) return
    this.lastTime += dt
    if (this.lastTime >= this.timeInterval) {
      this.lastTime = -(this.timeInterval - this.lastTime)
      this.notifyBeat(time)
    }
  }

  start () {
    console.log('start the beat!')
    this.status = 1
    this.lastTime = 0
    this.setTempo()
  }

  notifyBeat (time) {
    this.listener.notifyBeat()
  }
}