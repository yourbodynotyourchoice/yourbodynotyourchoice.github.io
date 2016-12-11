'use strict'
import React from 'react'
import mapboxgl from 'mapbox-gl'
import { makeColorScale, makeDescriptions } from '../utils/color-scale'

class Map extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      view: props.view
    }
  }

  componentDidMount () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZG1vcmlhcnR5IiwiYSI6Ikd3T29EOWMifQ.-DKJ4ernht84AZmc6Bk51Q'

    this.map = new mapboxgl.Map({
      container: this.container,
      center: [0, 0],
      zoom: 2.2,
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
      }
    })

    // this.map.addControl(new mapboxgl.NavigationControl({position: 'bottom-right'}))
    this.map.dragRotate.disable()
    this.map.scrollZoom.disable()
    this.map.touchZoomRotate.disableRotation()

    this.updatePopup()

    this.map.on('load', () => {
    })
  }

  updatePopup (descrip) {
    var self = this
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
        .remove(self.map)
        .setHTML(description)
        .addTo(self.map)
    })
  }

  componentWillReceiveProps (next) {
    if (next.view !== this.props.view) {
      var colorScale = makeColorScale(next.view)
      var descrScale = makeDescriptions(next.view)

      this.updatePopup(descrScale)

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
      <div style={Object.assign({
        height: '100%'
      }, this.props.style)}>
        <div className='main-map'
          ref={(el) => { this.container = el }}>
        </div>
      </div>
    )
  }
}

module.exports = Map
