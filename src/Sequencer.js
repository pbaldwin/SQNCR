import React, { Component } from 'react';

function SequencerRow(props) {
  const sequencerColumns = props.columns.map((col, idx) => {
    return (
      <div className="SequencerColumn" key={col.id}>
        <input
          type="checkbox"
          checked={col.active}
          onChange={(e) => props.onChange(idx, e.target.checked)}
        />
      </div>
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
