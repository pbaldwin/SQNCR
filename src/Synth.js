const C_MAJOR = [130.8, 146.8, 164.8, 174.6, 196.0, 220.0, 246.9, 261.6]

class Synth {
  constructor(scale = C_MAJOR) {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()

    this.outputBuss = this.ctx.createGain()
    this.filter = this.ctx.createBiquadFilter()
    this.masterVolume = this.ctx.createGain()

    this.outputBuss.gain.value = 1

    this.filter.type = 'highpass'
    this.filter.frequency.value = 300

    this.masterVolume.gain.value = .5

    this.outputBuss.connect(this.filter)
    this.filter.connect(this.masterVolume)
    this.masterVolume.connect(this.ctx.destination)

    this.scale = this.newScale(scale)
  }

  newScale(scale) {
    this.soundNodes = scale.map((note) => {
      const oscillator = this.ctx.createOscillator()
      const gainNode = this.ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.outputBuss)

      gainNode.gain.value = 0
      oscillator.type = 'sawtooth'
      oscillator.frequency.value = note
      oscillator.start()

      return {
        gainNode,
        oscillator,
        release: null
      }
    })
  }

  trigger(node, value) {
    clearInterval(node.release)
    node.gainNode.gain.value = value
    node.release = setInterval(() => {
      node.gainNode.gain.value -= .02
      if (node.gainNode.gain.value <= 0) {
        node.gainNode.gain.value = 0
        clearInterval(node.release)
      }
    }, 15)
  }

  playNotes(noteArray) {
    noteArray.forEach((value, idx) => {
      if (value > 0) {
        this.trigger(this.soundNodes[idx], value)
      }
    })
  }

  stop() {
    this.soundNodes.forEach((node) => node.gainNode.gain.value = 0)
  }
}

export default Synth
