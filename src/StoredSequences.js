import React, { Component } from 'react';
import './StoredSequences.css'
import { Icon } from  'rmwc/Icon'

function SequenceOptionButton(props) {
  return (
    <button onClick={props.onClick} className="SequenceOption__button">
      <Icon use={props.icon} />
      <div>{props.label}</div>
    </button>
  )
}

function SequenceOption(props) {
  return (
    <div className="SequenceOption">
      <div className="SequenceOption__label">
        {props.name}
      </div>

      <SequenceOptionButton onClick={props.onLoad} icon="file_upload" label="Load" />
      <SequenceOptionButton onClick={props.onSave} icon="file_download" label="Store" />
    </div>
  );
}

class StoredSequences extends Component {
  constructor(props) {
    super(props)

    this.state = {
      drawerOpen: false
    }
  }

  toggleDrawer() {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    })
  }

  render() {
    const sequenceOptions = (() => {
      if (this.state.drawerOpen) {
        const optionsList = this.props.options.map((option, idx) => {
          return (
              <SequenceOption
                name={option.name}
                key={option.name+idx}
                onLoad={() => this.props.onLoad(idx)}
                onSave={() => this.props.onSave(idx)}
              />
          );
        })

        return (
          <div className="SequenceOptionsList">
            {optionsList}
          </div>
        )
      }
      return null
    })()

    const toggleClassName = `StoredSequences__toggle${this.state.drawerOpen ? ' StoredSequences__toggle--active' : ''}`

    return (
      <div className="StoredSequences">
        { sequenceOptions }
        <div className="StoredSequences__label">
          Stored Sequences
        </div>
        <button
          className={toggleClassName}
          onClick={() => this.toggleDrawer()}>
          <Icon use="add_circle_outline" />
        </button>
      </div>
    );
  }
}

export default StoredSequences
