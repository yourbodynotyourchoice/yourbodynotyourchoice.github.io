'use strict'
import React from 'react'
import mapboxgl from 'mapbox-gl'
import { makeColorScale, makeDescriptions } from '../utils/fetchFunctions'
import Legend from './legend'

class Map extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      view: props.view
    }
    this.setView = this.setView.bind(this)
  }

  setView (waffle) {
    this.setState({
      view: waffle
    })
  }

  componentDidMount () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZG1vcmlhcnR5IiwiYSI6Ikd3T29EOWMifQ.-DKJ4ernht84AZmc6Bk51Q'

    this.map = new mapboxgl.Map({
      container: this.container,
      center: [0, 0],
      zoom: 2.5,
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
        }]
      },
      interactive: false
    })

    var self = this
    var descrip = makeDescriptions(this.state.view)
    var descriptions

    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    })

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

      var description = '<div><p>' + feature.properties.name + '</p><p>' + descriptions + '</div>'

      popup.setLngLat(e.lngLat)
        .setHTML(description)
        .addTo(self.map)
    })

    this.map.on('load', () => {
    })
  }

  componentWillReceiveProps (next) {
    if (next.view !== this.props.view) {
      this.setView(next.view)

      var colorScale = makeColorScale(next.view)
      var descrScale = makeDescriptions(next.view)

      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })

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
      })
    }
  }

  render () {
    return (
      <section className='Map-content'>

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

// updatePopup (popup, descrip) {
//   // var self = this
//   // var descriptions

//   // this.map.on('mousemove', function (e) {
//   //   var features = self.map.queryRenderedFeatures(e.point, { layers: ['usa'] })
//   //   self.map.getCanvas().style.cursor = (features.length) ? 'pointer' : ''

//   //   if (!features.length) {
//   //     popup.remove()
//   //     return
//   //   }

//   //   var feature = features[0]

//   //   if (descrip) {
//   //     descriptions = descrip[feature.properties.statefp]
//   //   }

//   //   var description = '<div><p>' + feature.properties.name + '</p><p>' + descriptions + '</div>'

//   //   popup.setLngLat(e.lngLat).setHTML(description)
//   // })
// }

// descriptions={this.state.descriptions}
//          <Legend view={this.state.view} />

module.exports = Map
