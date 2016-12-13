'use strict'
import React from 'react'
import mapboxgl from 'mapbox-gl'
import { makeColorScale, makeDescriptions } from '../utils/fetchFunctions'
import Legend from './legend'

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
})
var newYear = 2013
// const CPC = require('../data/ne_110m_land.json')

class Map extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      view: props.view,
      year: props.year
    }
    this.setView = this.setView.bind(this)
    this.setYear = this.setYear.bind(this)
  }

  setView (waffle) {
    this.setState({
      view: waffle
    })
  }

  setYear (waffle) {
    this.setState({
      year: waffle
    })
  }

  componentDidMount () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZG1vcmlhcnR5IiwiYSI6Ikd3T29EOWMifQ.-DKJ4ernht84AZmc6Bk51Q'

    this.map = new mapboxgl.Map({
      container: this.container,
      center: [0, 0],
      zoom: 3,
      style: {
        version: 8,
        sources: {
          usa: {
            type: 'vector',
            url: 'mapbox://dmoriarty.2hk6s8h1'
          }
        },
        layers: [{
          id: 'bg',
          type: 'background',
          paint: {
            'background-color': 'rgba(0,0,0,0)'
          }
        },
        {
          id: 'usa',
          type: 'fill',
          source: 'usa',
          'source-layer': 'usa-simple-0m5fzt',
          paint: {
            'fill-color': {
              property: 'statefp',
              stops: makeColorScale(this.state.view)
            }
          }
        },
        {
          id: 'usa-outline',
          type: 'line',
          source: 'usa',
          'source-layer': 'usa-simple-0m5fzt',
          paint: {
            'line-color': '#000',
            'line-width': 0.25
          }
        },
        {
          id: 'usa-outline-hover',
          type: 'line',
          source: 'usa',
          'source-layer': 'usa-simple-0m5fzt',
          paint: {
            'line-color': '#4E282D',
            'line-width': 2.5
          },
          'filter': ['==', 'statefp', '']
        }]
      },
      interactive: false
    })

    this.updatePopup(this.state.view)

    var self = this

    this.map.on('mousemove', function (e) {
      var features = self.map.queryRenderedFeatures(e.point, { layers: ['usa'] })
      if (features.length) {
        self.map.setFilter('usa-outline-hover', ['==', 'statefp', features[0].properties.statefp])
      } else {
        self.map.setFilter('usa-outline-hover', ['==', 'statefp', ''])
      }
    })

    // Reset the state-fills-hover layer's filter when the mouse leaves the map
    this.map.on('mouseout', function () {
      self.map.setFilter('usa-outline-hover', ['==', 'statepfp', ''])
    })

    this.map.on('load', () => {
    })
  }

  updatePopup (view, year) {
    var self = this
    var descrip = makeDescriptions(view, year)
    var descriptions

    this.map.on('mousemove', function (e) {
      var features = self.map.queryRenderedFeatures(e.point, { layers: ['usa'] })
      self.map.getCanvas().style.cursor = (features.length) ? 'pointer' : ''

      if (!features.length) {
        popup.remove()
        return
      }

      var feature = features[0]

      if (descrip) {
        descriptions = descrip[feature.properties.statefp]
      }

      var description = '<div><p class="popupState">' + feature.properties.name + '</p><p>' + descriptions + '</div>'

      popup.setLngLat(e.lngLat)
        .setHTML(description)
        .addTo(self.map)
    })
  }

  beginTimeline (ths) {
    console.log('click click')
    if (this.state.view !== 'overview' && this.state.view !== 'crisis') {
      var myDelay = 1400
      var thisDelay = 1400
      var start = Date.now()
      var yearCount = 1973

      this.startTimer(myDelay, thisDelay, start, yearCount)
    }
  }

  startTimer (myDelay, thisDelay, start, yearCount) {
    var self = this
    setTimeout(function () {
      yearCount++
      console.log(yearCount)
      popup.remove()
      self.updatePopup(self.state.view, yearCount)
      self.updateMapColors(makeColorScale(self.state.view, yearCount))
      var actual = Date.now() - start
      // subtract any extra ms from the delay for the next cycle
      thisDelay = myDelay - (actual - myDelay)
      start = Date.now()
      // start the timer again
      if (yearCount < 2014) {
        self.startTimer(myDelay, thisDelay, start, yearCount)
      }
    }, thisDelay)
  }

  componentWillReceiveProps (next) {
    console.log(this.state.year)
    if (next.view !== this.props.view) {
      this.setView(next.view)

      this.updateMapColors(makeColorScale(next.view, 2013))

      popup.remove()
      this.updatePopup(next.view, 2013)
    }
  }

  updateMapColors (colorScale) {
    this.map.removeLayer('usa')
    this.map.addLayer({
      'id': 'usa',
      'type': 'fill',
      'source': 'usa',
      'source-layer': 'usa-simple-0m5fzt',
      'paint': {
        'fill-color': {
          property: 'statefp',
          stops: colorScale
        }
      }
    }, 'usa-outline')
  }

  render () {
    return (
      <section className='Map-content'>
        <div className='testing-box' onClick={() => this.beginTimeline(this)}></div>

        <div className='main-map'
          ref={(el) => { this.container = el }}>
        </div>
        <div className='map-legend'>
          <Legend view={this.state.view} />
        </div>
      </section>
    )
  }
}

module.exports = Map
