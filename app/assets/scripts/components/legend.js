'use strict'
import React from 'react'
import { getFetcher } from '../utils/fetchFunctions'

class Legend extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      view: props.view
    }
    this.setView = this.setView.bind(this)
  }

  setView (view, color, data) {
    this.setState({
      view: view
    })
  }

  componentWillReceiveProps (next) {
    if (next.view !== this.props.view) {
      this.setView(next.view)
    }
  }

  getLegendInfo (view) {
    var legendKey = getFetcher(view)
    var legendDescriptions = []

    for (var i = legendKey.length - 1; i >= 0; i--) {
      var legendBoxColor = 'legendBox legend-' + i
      legendDescriptions.push(<li><div className={legendBoxColor}></div><div className='legendText' key={i}>{legendKey[i]}</div></li>)
    }

    return (
      <div>
        <h2 className='legendTitle'>{view}</h2>
        <ul>{legendDescriptions}</ul>
      </div>
    )
  }

  render () {
    var textStuff = this.getLegendInfo(this.state.view)
    return (
      <div className='legend__content'>
        <h2>{textStuff}</h2>
      </div>
    )
  }
}

module.exports = Legend
