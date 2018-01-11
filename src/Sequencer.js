import React, { Component } from 'react';
import './Sequencer.css'

function SequencerRow(props) {
  const sequencerColumns = props.columns.map((col, idx) => {
    const cls = `SequencerColumn${col.active ? ' SequencerColumn--active' : ''}`
    return (
      <label className={cls} key={col.id}>
        <input
          type="checkbox"
          checked={col.active}
          onChange={(e) => props.onChange(idx, e.target.checked)}
        />
      </label>
    )
  })

  const cls = `SequencerRow${props.active ? ' SequencerRow--active' : ''}`

  return (
    <div className={cls}>
      {sequencerColumns}
    </div>
  );
}

class SequencerGrid extends Component {
  render() {
    const sequencerRows = this.props.sequencer.map((row, idx) => {
      return (
        <SequencerRow
          active={row.active}
          columns={row.columns}
          key={row.id}
          onChange={(col, active) => this.props.onRowChange(idx, col, active)}
        />
      )
    })
    return (
      <div className="SequencerGrid">
        {sequencerRows}
      </div>
    );
  }
}

export default SequencerGrid
