import React from 'react'
import { loadModules } from 'esri-loader'
import styled from 'styled-components'

export class WebMapView extends React.Component {
  constructor (props) {
    super(props)
    this.mapRef = React.createRef()
  }

  componentDidMount () {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    const self = this
    loadModules(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/widgets/Search',
        'esri/layers/FeatureLayer'
      ],
      {
        css: true
      }
    ).then(([ArcGISMap, MapView, Search, FeatureLayer]) => {
      const pobladosLayer = new FeatureLayer({
        url: 'https://sig.mep.go.cr/server/rest/services/Hosted/Poblados_CR/FeatureServer/0',
        outFields: ['*'],
        visible: false
      })
      const distritosLayer = new FeatureLayer({
        url: 'https://sig.mep.go.cr/server/rest/services/Hosted/Distritos_CR/FeatureServer/0',
        outFields: ['*'],
        visible: false
      })
      const map = new ArcGISMap({
        basemap: 'hybrid'
      })
      map.add(pobladosLayer, 1)
      map.add(distritosLayer, 0)

      this.view = new MapView({
        container: this.mapRef.current,
        map,
        center: [-84, 9],
        zoom: 8
      })

      const search = new Search({
        view: this.view
      })

      this.view.ui.add(search, 'top-right')
      this.search = search
      this.props.setSearch(search)

      const view = this.view
      async function queryFeatureLayer (
        point,
        distance,
        spatialRelationship,
        featureL
      ) {
        const query = {
          geometry: point,
          distance,
          spatialRelationship,
          outFields: ['*'],
          returnGeometry: true
        }

        const response = await featureL.queryFeatures(query)
        return response.features
      }
      const props = this.props
      this.view.on('click', async function (evt) {
        search.clear()
        view.popup.clear()
        let ubicacionResponse = await queryFeatureLayer(
          evt.mapPoint,
          1500,
          'intersects',
          distritosLayer
        )
        ubicacionResponse = ubicacionResponse[0].attributes
        if (search.activeSource) {
          const geocoder = search.activeSource.locator // World geocode service
          const params = {
            location: evt.mapPoint
          }
          geocoder.locationToAddress(params).then(
            function (response) {
              // Show the address found
              const address = response.address
              self.showPopup(address, evt.mapPoint, ubicacionResponse)
            },
            function (err) {
              // Show no address found
              self.showPopup(
                'No address found.',
                evt.mapPoint,
                ubicacionResponse
              )
            }
          )
        }
      })
    })
  }

  showPopup (address, pt, attributes) {
    this.view.popup.open({
      title: +pt.longitude + ',' + pt.latitude,
      content: address,
      location: pt
    })
    this.props.setLocation({
      latitude: pt.latitude.toFixed(6),
      longitude: pt.longitude.toFixed(6)
    })
    this.props.setUbicacion({
      canton: attributes?.NCANTON,
      provincia: attributes?.PROVINCIA,
      distrito: attributes?.NDISTRITO
    })
  }

  showPopup = this.showPopup.bind(this)

  componentWillUnmount () {
    if (this.view) {
      // destroy the map view
      this.view.container = null
    }
  }

  render () {
    return <Map className='webmap' ref={this.mapRef} />
  }
}

const Map = styled.div`
  height: 100%;
  width: 100%;
`
