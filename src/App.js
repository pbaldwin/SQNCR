import React, { Component } from 'react';
import SequencerGrid from './Sequencer'
import Synth from './Synth'
import './App.css';

const synth = new Synth()

function playNotes(notes) {
  synth.playNotes(notes.columns.map((col) => col.active ? 1 : 0))
}

class App extends Component {
  constructor(props) {
    super(props)

    const note = {
      active: false,
      id: null,
    }

    this.state = {
      tempo: 120,
      playing: false,
      activeRow: 0,
      sequencer: Array(16)
                  .fill()
                  .map((_, idx) => {
                    return {
                      active: false,
                      id: `row-${idx}`,
                      columns: Array(8)
                                .fill()
                                .map((_, jdx) => {
                                  return Object.assign({}, note, { id: `${idx}-${jdx}`})
                                })
                    }
                  })
    }
  }

  togglePlaying() {
    const playing = !this.state.playing

    if (playing) {
      this.timerID = setInterval(() => {
        this.incrementActiveRow()
      }, this.state.tempo / 60 * 100)
    } else if (this.timerID) {
      clearInterval(this.timerID)
      // synth.stop()
    }

    this.setState({
      playing
    })
  }

  handleRowChange(row, column, active) {
    const sequencer = this.state.sequencer.slice()
    sequencer[row].columns[column].active = active
    this.setState({ sequencer })
  }

  incrementActiveRow() {
    this.setState({
      activeRow: this.state.activeRow >= 15 ? 0 : this.state.activeRow + 1,
      sequencer: this.state.sequencer.map((row, idx) => {
        row.active = idx === this.state.activeRow ? true : false
        return row
      })
    })

    playNotes(this.state.sequencer[this.state.activeRow])
  }

  render() {
    const playText = this.state.playing ? 'Pause' : 'Play'

    return (
      <div className="App">
        <SequencerGrid
          sequencer={this.state.sequencer}
          onRowChange={(row, col, active) => this.handleRowChange(row, col, active)}
        />
        <div className="SynthControls">
          <button className='playToggle' onClick={() => this.togglePlaying() }>{playText}</button>
        </div>
      </div>
    );
  }
}

export default App;
