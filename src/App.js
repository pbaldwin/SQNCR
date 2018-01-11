import React, { Component } from 'react';
import SequencerGrid from './Sequencer'
import './App.css';

function playNotes(notes) {
  console.log(notes.columns.map((col) => col.active ? 1 : 0))
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <SequencerGrid playNotes={playNotes} tempo={ 120 } />
      </div>
    );
  }
}

export default App;
