import React from 'react'
import { loadModules } from 'esri-loader'
import styled from 'styled-components'

export class WebMapView extends React.Component {
  constructor(props) {
    super(props)
    this.mapRef = React.createRef()
  }

  componentDidMount() {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    const self = this
    loadModules(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/widgets/Search',
        'esri/layers/FeatureLayer',
        'esri/config',
      ],
      {
        css: true
      }
    ).then(
      ([ArcGISMap, MapView, Search, FeatureLayer, esriConfig]) => {

        const props = this.props
        esriConfig.request.interceptors.push({
          before(params) {
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
          zoom: 8,
          popupEnabled: false, 
        })
        this.view.popup = null;

        const search = new Search({
          view: this.view,
          handleAs: 'json',
          content: { f: 'json' }
        })

        this.search = search
        props.setSearch(search)
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


        })
        if (props.onMount) {
          props.onMount()
        }
      }
    )
  }

  async queryFeatureLayer(point, distance, spatialRelationship, featureL) {
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

  disableMap(event, cb = () => { }) {
    if (!this.props.editable) {
      event.stopPropagation()
    } else {
      cb()
      return true
    }
  }

  disableMap = this.disableMap.bind(this)

  showPopup(address, pt, attributes) {
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

    this.props.setUbicacion({
      canton: attributes?.NCANTON,
      provincia: attributes?.PROVINCIA,
      distrito: attributes?.NDISTRITO
    })

  }

  showPopup = this.showPopup.bind(this)

  componentWillUnmount() {
    if (this.view) {
      // destroy the map view
      this.view.container = null
    }
  }

  render() {
    return <Map className='webmap' ref={this.mapRef} />
  }
}

const Map = styled.div`
	height: 100%;
	width: 100%;
`
