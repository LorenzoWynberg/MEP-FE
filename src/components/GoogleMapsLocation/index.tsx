import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Label, Input } from 'reactstrap'

const KEY = 'AIzaSyCc5vT2moSVDMlF1l9lKLXDD4F9mSSgkpo' // AIzaSyBB0BqVH09AEZc2q78GYT0bm8iJKL_S7-0
interface IProps {
    id?: string
    GmapsOptions?: any
    onMapLoad?: (map) => void
    onMarkerDrag?: (marker) => void
    width?: string|number
    height?: string|number
    markerDraggable?: Boolean
    lat?: number,
    lng?: number,
    isLoaded?: (loaded)=>void
    address?: string,
    setAddress?: (val: string) => {}
    validateAddress?: (longlat, geocoder) => {}
    readOnly: boolean
}

declare global {
  interface Window { google: any }
}

const defaultOptions = {
  center: { lat: 11.9646818, lng: -86.0835405 },
  zoom: 10
}

const getLocPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (geoLocPos) => {
        resolve(geoLocPos)
      },
      (e) => {
        reject(e)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  })

const GoogleMapsLocation = (props) => {
  const { t } = useTranslation()

  const ref = React.useRef()
  const {
    address = '',
    setAddress = () => {},
    validateAddress = () => true,
    readOnly = false
  } = props
  const [loaded, setLoaded] = React.useState(false)
  const [state, setState] = React.useState<any>({ map: null, marker: null })
  const [position, setPosition] = React.useState<{lat?:any, lng?:any}>({
    lat: props?.lat || 'Seleccionar',
    lng: props?.lng || 'Seleccionar'
  })
  const [googleGeocoder, setGoogleGeocoder] = React.useState(null)
  const [dragData, setDragData] = React.useState(null)
  const [mount, setMount] = React.useState(false)

  useEffect(() => {
    if (address && googleGeocoder && state.map) {
      googleGeocoder.geocode({ address }, function (results, status) {
        if (status == 'OK') {
          const lat = results[0].geometry.location?.lat()
          const lng = results[0].geometry.location?.lng()
          state.map.setCenter(results[0].geometry.location)
          state.map.setZoom(12)
          setPosition({ lat, lng })
          state.marker.setPosition({ lat, lng })
        }
      })
    }
  }, [address, googleGeocoder, state.map])

  useEffect(() => {
    if (dragData) {
      validateAddress({ lat: dragData?.lat, lng: dragData?.lng }, googleGeocoder).then((res) => {
        if (res) {
          setPosition({
            lat: dragData?.lat, lng: dragData?.lng
          })
          if (props.onMarkerDrag) {
            props.onMarkerDrag({
              lat: dragData?.lat, lng: dragData?.lng
            })
          }
        } else {
          state.marker.setPosition({ lat: position?.lat, lng: position?.lng })
        }
      })
    }
  }, [dragData])

  const defaultMapLoad = async (map, geocoder) => {
    const marker = new window.google.maps.Marker({
      // position: { lat: 11.9646818, lng: -86.0835405 },
      map,
      title: 'Seleccione una Ubicación',
      draggable: props.markerDraggable != null && props.markerDraggable != undefined ? props.markerDraggable : true,
      optimized: false
    })

    const dragEnd = async (event) => {
      setDragData({ lat: event.latLng.lat(), lng: event.latLng.lng() })
    }
    const addEventDrag = (mark) => {
      window.google.maps.event.addListener(
        mark,
        'dragend',
        dragEnd
      )
      setState(s => ({ ...s, marker: mark }))
      if (props.lat && props.lng) {
        setPosition({ lat: props.lat, lng: props.lng })
        marker.setPosition({ lat: props.lat, lng: props.lng })
        map.setOptions({ center: { lat: props.lat, lng: props.lng } })
      }
    }
    if (props.lat && props.lng) {
      marker.setPosition({
        lat: props.lat,
        lng: props.lng
      })
      setPosition({
        lat: props.lat,
        lng: props.lng
      })
      addEventDrag(marker)
    } else {
      getLocPosition()
        .then((geoLocPos: any) => {
          marker.setPosition({
            lat: geoLocPos.coords.latitude,
            lng: geoLocPos.coords.longitude
          })
          // setPosition({
          // 	lat: geoLocPos.coords.latitude,
          // 	lng: geoLocPos.coords.longitude
          // })
          addEventDrag(marker)
        })
        .catch((_) => {
          marker.setPosition({ lat: '', lng: '' })
          setPosition({
            lat: '', lng: ''
          })
          addEventDrag(marker)
        })
    }
  }

  const onScriptLoad = () => {
    const loadMap = (geoLocPos) => {
      let geocoder = null
      const options = {
        center: defaultOptions.center,
        zoom: defaultOptions.zoom,
        disableDefaultUI: props.markerDraggable == null || props.markerDraggable == undefined ? true : !props.markerDraggable,
        gestureHandling: props.markerDraggable == true ? 'greedy' : 'none'
      }
      if (geoLocPos.coords) {
        options.center = {
          lat: geoLocPos.coords.latitude,
          lng: geoLocPos.coords.longitude
        }
        options.zoom = defaultOptions.zoom
      }
      const map = new window.google.maps.Map(
        ref.current,
        // document.getElementById("lakey"),
        props.GmapsOptions ? props.GmapsOptions : options
      )
      geocoder = new window.google.maps.Geocoder()
      setGoogleGeocoder(geocoder)
      props.onMapLoad ? props.onMapLoad(map) : defaultMapLoad(map, geocoder)
      setState((s) => ({ ...s, map }))
      return map
    }
    getLocPosition()
      .then((geoLocPos: any) => {
        loadMap(geoLocPos)
      })
      .catch(() => {
        const geoLocPos = {
          coords: {
            latitude: defaultOptions.center.lat,
            longitude: defaultOptions.center.lng
          }
        }
        loadMap(geoLocPos)
      })
  }
  const loadApi = () => {
    let exists = document.getElementById('gmaps')
    if (!window.google && !exists) {
      const s = document.createElement('script')
      s.id = 'gmaps'
      s.type = 'text/javascript'
      s.src = `https://maps.google.com/maps/api/js?key=${KEY}&v=3.50`
      const x = document.getElementsByTagName('script')[0]
      x.parentNode.insertBefore(s, x)
      exists = s
    } else {
      setLoaded(true)
      onScriptLoad()
    }
    // Below is important.
    // We cannot access google.maps until it's finished loading
    exists.addEventListener('load', (e) => {
      setLoaded(true)
      onScriptLoad()
    })
  }
  React.useEffect(() => {
    loadApi()
  }, [])
  React.useEffect(() => {
    if (state.marker) {
      state.marker.setDraggable(props.markerDraggable)
      state.map.setOptions({
        gestureHandling: props.markerDraggable ? 'greedy' : 'none',
        disableDefaultUI: !props.markerDraggable
      })
    }
  }, [props.markerDraggable])
  React.useEffect(() => {
    if (!mount && state.marker && state.map) {
      state.marker.setPosition({ lat: props.lat, lng: props.lng })
      setPosition({ lat: props.lat, lng: props.lng })
      state.map.setOptions({ center: { lat: props.lat, lng: props.lng } })
      state.map.setZoom(12)
      setMount(true)
    }
  }, [state.marker, state.map, mount])
  if (loaded) {
    return (
      <>
        <DivCont width={props.width} height={props.height} ref={ref} />
        {state.marker && <section style={{ display: 'flex', placeContent: 'space-between' }}>
          <section>
            <Label>{t('google_maps_location>latitud', 'Latitud')} {!readOnly && '*'}</Label>
            <Input
              type='text'
              value={position.lat}
              disabled
            />
          </section>
          <section>
            <Label>{t('google_maps_location>Longitud', 'Longitud')} {!readOnly && '*'}</Label>
            <Input
              text='text'
              value={position.lng}
              disabled
            />
          </section>
        </section>}
      </>
    )
  } else return <>Loading...</>
}
const DivCont = styled.div`
	width: ${(props) => props.width || '400px'};
	height: ${(props) => props.height || '400px'};
`

export default GoogleMapsLocation
