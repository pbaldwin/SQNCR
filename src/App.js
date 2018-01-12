import localforage from 'localforage'
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

    this.state = {
      tempo: 120,
      playing: false,
      activeRow: 0,
      sequencer: this.createEmptySequence(),
      storedSequences: Array(8).fill().map(() => {
        return {
          name: '------------',
          sequence: this.createEmptySequence(),
        }
      })
    }
  }

  componentDidMount() {
    localforage
      .getItem('lastSequence')
      .then((sequence) => {
        if (sequence) {
          this.setState({
            sequencer: sequence
          })
        }
      })
      .catch(console.log.bind(console))

    localforage
      .getItem('storedSequences')
      .then((storedSequences) => {
        if (storedSequences) {
          this.setState({
            storedSequences
          })
        }
      })
      .catch(console.log.bind(console))
  }

  createEmptySequence() {
    const note = {
      active: false,
      id: null,
    }

    return Array(16)
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

  togglePlaying() {
    const playing = !this.state.playing

    if (playing) {
      this.timerID = setInterval(() => {
        this.incrementActiveRow()
      }, this.state.tempo / 60 * 100)
    } else if (this.timerID) {
      clearInterval(this.timerID)
    }

    this.setState({
      playing
    })
  }

  handleRowChange(row, column, active) {
    const sequencer = this.state.sequencer.slice()
    sequencer[row].columns[column].active = active
    this.setState({ sequencer })
    localforage.setItem('lastSequence', sequencer)
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

  saveSequence() {
    const storedSequences = this.state.storedSequences.slice(0, this.state.storedSequences.length - 1)
    storedSequences.unshift({
      name: 'Stored Sequence',
      sequence: this.state.sequencer.slice()
    })
    this.setState({
      storedSequences
    })
    localforage.setItem('storedSequences', storedSequences)
  }

  loadSequence(idx) {
    console.log(idx)
    this.setState({
      sequencer: this.state.storedSequences[idx].sequence.slice()
    })
  }

  render() {
    const playText = this.state.playing ? 'Pause' : 'Play'
    const storedSequences = this.state.storedSequences.map((sequence, idx) => {
      return (
        <option value={idx} key={sequence.name + idx}>{sequence.name}</option>
      )
    })

    return (
      <div className="App">
        <SequencerGrid
          sequencer={this.state.sequencer}
          onRowChange={(row, col, active) => this.handleRowChange(row, col, active)}
        />
        <div className="SynthControls">
          <button className='playToggle' onClick={() => this.togglePlaying() }>{playText}</button>
          <button onClick={() => this.saveSequence()}>Save</button>
          <select className="sequenceSelector" onChange={(e) => this.loadSequence(e.target.value)}>
            {storedSequences}
          </select>
        </div>
      </div>
    );
  }
}

export default App;
