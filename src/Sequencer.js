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
  constructor(props) {
    super(props)

    const note = {
      active: false,
      id: null,
    }

    this.state = {
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

  incrementActiveRow() {
    this.setState({
      activeRow: this.state.activeRow >= 15 ? 0 : this.state.activeRow + 1,
      sequencer: this.state.sequencer.map((row, idx) => {
        row.active = idx === this.state.activeRow ? true : false
        return row
      })
    })

    this.props.playNotes(this.state.sequencer[this.state.activeRow])
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.incrementActiveRow()
    }, this.props.tempo / 60 * 100)
  }

  handleRowChange(row, column, active) {
    const sequencer = this.state.sequencer.slice()
    sequencer[row].columns[column].active = active
    this.setState({ sequencer })
  }

  render() {
    const sequencerRows = this.state.sequencer.map((row, idx) => {
      return (
        <SequencerRow
          active={row.active}
          columns={row.columns}
          key={row.id}
          onChange={(col, active) => this.handleRowChange(idx, col, active)}
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
