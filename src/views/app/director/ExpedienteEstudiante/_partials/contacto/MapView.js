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
        'esri/layers/FeatureLayer',
        'esri/config',
        'esri/rest/locator'
      ],
      {
        css: true
      }
    ).then(
      ([
        ArcGISMap,
        MapView,
        Search,
        FeatureLayer,
        esriConfig,
        EsriLocator
      ]) => {
        esriConfig.request.interceptors.push({
          before (params) {
            if (params.url.includes('query')) {
              params.requestOptions.query.f = 'json'
            }
          }
        })
        const pobladosLayer = new FeatureLayer({
          url: 'https://sig.mep.go.cr/server/rest/services/Hosted/Poblados_CR/FeatureServer/0',
          outFields: ['*'],
          visible: false
          // f: 'json'
        })

        const distritosLayer = new FeatureLayer({
          url: 'https://sig.mep.go.cr/server/rest/services/Hosted/Distritos_CR/FeatureServer/0',
          outFields: ['*'],
          visible: false
        })
        this.distritosLayer = distritosLayer
        this.pobladosLayer = pobladosLayer
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
          view: this.view,
          handleAs: 'json',
          content: { f: 'json' }
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
        this.view.on('mouse-wheel', function (event) {
          self.disableMap(event)
        })
        this.view.on('double-click', function (event) {
          self.disableMap(event)
        })
        this.view.on('double-click', ['Control'], function (event) {
          self.disableMap(event)
        })
        this.view.on('drag', function (event) {
          self.disableMap(event)
        })
        this.view.on('drag', ['Shift'], function (event) {
          self.disableMap(event)
        })

        this.view.on('drag', ['Shift', 'Control'], function (event) {
          self.disableMap(event)
        })
        this.view.on('drag', ['Shift', 'Control'], function (event) {
          self.disableMap(event)
        })
        this.view.on('click', async function (evt) {
          self.disableMap(evt, async () => {
            self.search.clear()
            self.view.popup.clear()

            let ubicacionResponse = await self.queryFeatureLayer(
              evt.mapPoint,
              1500,
              'intersects',
              self.distritosLayer
            )

            ubicacionResponse = ubicacionResponse[0].attributes

            if (self.search.activeSource) {
              const params = {
                location: evt.mapPoint
              }
              const locatorUrl =
								'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
              EsriLocator.locationToAddress(
                locatorUrl,
                params
              ).then(
                function (response) {
                  // Show the address found
                  
                  const address = response.address
                  self.showPopup(
                    address,
                    evt.mapPoint,
                    ubicacionResponse
                  )
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
        if (props.onMount) {
          props.onMount()
        }
      }
    )
  }

  async queryFeatureLayer (point, distance, spatialRelationship, featureL) {
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

  disableMap (event, cb = () => {}) {
    if (!this.props.editable) {
      event.stopPropagation()
    } else {
      cb()
      return true
    }
  }

  disableMap = this.disableMap.bind(this)

  showPopup (address, pt, attributes) {
    const test = {
      title: +pt.longitude + ',' + pt.latitude,
      content: address,
      location: pt
    }

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
