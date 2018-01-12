import deepCopy from 'deep-copy'
import emptySequence from './utils/emptySequence'
import localforage from 'localforage'
import React, { Component } from 'react';
import { Icon } from  'rmwc/Icon'
import SequencerGrid from './Sequencer'
import StoredSequences from './StoredSequences'
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
      sequencer: emptySequence(),
      storedSequences: Array(8).fill().map(() => {
        return {
          name: '------------',
          sequence: emptySequence(),
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
      .then((sequences) => {
        if (sequences) {
          const storedSequences = this.state.storedSequences
                                    .map((sequence, i) => {
                                      return sequences[i] ? sequences[i] : sequence
                                    })
          this.setState({
            storedSequences
          })
        }
      })
      .catch(console.log.bind(console))
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
    const sequencer = deepCopy(this.state.sequencer)
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

  saveSequence(idx) {
    const storedSequences = deepCopy(this.state.storedSequences)
    storedSequences[idx] = {
      name: 'Stored Sequence',
      sequence: this.state.sequencer.slice()
    }
    this.setState({
      storedSequences
    })
    localforage.setItem('storedSequences', storedSequences)
  }

  loadSequence(idx) {
    this.setState({
      sequencer: deepCopy(this.state.storedSequences[idx].sequence)
    })
  }

  render() {
    return (
      <div className="App">
        <SequencerGrid
          sequencer={this.state.sequencer}
          onRowChange={(row, col, active) => this.handleRowChange(row, col, active)}
        />
        <div className="SynthControls">
          <button className='playToggle' onClick={() => this.togglePlaying() }>
            {this.state.playing ? <Icon use="pause" /> : <Icon use="play_arrow" />}
          </button>
          <StoredSequences
            options={this.state.storedSequences}
            onLoad={(idx) => this.loadSequence(idx)}
            onSave={(idx) => this.saveSequence(idx)}
          />
        </div>
      </div>
    );
  }
}

export default App;
