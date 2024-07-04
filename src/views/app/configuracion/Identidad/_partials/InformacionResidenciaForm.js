import React, { useState, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { FormGroup, Label, Input, FormFeedback, Card, CardBody } from 'reactstrap'
import { connect } from 'react-redux'
import { getCantonesByProvincia } from '../../../../../redux/cantones/actions'
import { getDistritosByCanton } from '../../../../../redux/distritos/actions'
import { getPobladosByDistrito } from '../../../../../redux/poblados/actions'
import { WebMapView } from './MapView'
import CustomSelectInput from 'Components/common/CustomSelectInput'

import Select from 'react-select'
import styled from 'styled-components'
import useNotification from '../../../../../hooks/useNotification'
import {
  createDirection,
  updateDirection
} from '../../../../../redux/direccion/actions'
import { getCatalogs } from '../../../../../redux/selects/actions'
import { getProvincias } from '../../../../../redux/provincias/actions'
import { catalogsEnumObj } from '../../../../../utils/catalogsEnum'
import Loader from '../../../../../components/Loader'
import Selectors from 'Components/GoogleMapsLocation/Selectors.tsx'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2)
  },
  labelCheck: { color: '#145388', fontWeight: 'bold' }
}))

const InformacionResidenciaForm = (props) => {
  const { titulo, temporal, setValue, validationErrors } = props

  const initialSelectOption = {
    value: null,
    label: 'seleccionar'
  }
  const initialLocationCoordinates = {
    latitude: 'No seleccionado',
    longitude: 'No seleccionado'
  }
  const [currentProvince, setCurrentProvince] = useState(initialSelectOption)
  const [currentCanton, setCurrentCanton] = useState(initialSelectOption)
  const [currentDistrito, setCurrentDistrito] = useState(initialSelectOption)
  const [currentPoblado, setCurrentPoblado] = useState(initialSelectOption)
  const [currentTerritory, setCurrentTerritory] = useState(initialSelectOption)
  const [errors, setErrors] = useState(initialSelectOption)
  const [search, setSearch] = useState(null)
  const [loadLocation, setLoadLocation] = useState(false)
  const [direccionArray, setDireccionArray] = useState([])
  const [direction, setDirection] = useState('')
  const [razon, setRazon] = useState('')
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [snackbarVariant, setSnackbarVariant] = useState('')
  const [location, setLocation] = useState(initialLocationCoordinates)
  const [editDirection, setEditDirection] = useState({})
  const [editable, setEditable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [ubicacion, setUbicacion] = useState({})
  const [distritosData, setDistritosData] = useState([])
  const [cantonesData, setCantonesData] = useState([])
  const [pobladosData, setPobladosData] = useState([])
  const [data, setData] = useState(null)
  let timeOut
  const time = 300
  const classes = useStyles()
  const [sanackBar, handleClick] = useNotification()

  const handleError = () => {
    setSnackbarMsg('Hubo un error en la carga de la informacion')
    setSnackbarVariant('error')
    handleClick()
  }

  const setInitiaState = () => {
    setCurrentProvince(initialSelectOption)
    setCurrentCanton(initialSelectOption)
    setCurrentDistrito(initialSelectOption)
    setCurrentPoblado(initialSelectOption)
    setCurrentTerritory(initialSelectOption)
    setDirection('')
    setLocation(initialLocationCoordinates)
  }

  useEffect(() => {
    props.getProvincias()
    props.getCatalogs(catalogsEnumObj.TERRITORIOINDIGENA?.id)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (ubicacion.provincia && editable) {
        // [provincia, canton, distrito, poblado, ...]
        const _direccionArray = [
          ubicacion.provincia,
          ubicacion.canton,
          ubicacion.distrito
        ]
        setDireccionArray(_direccionArray)
        setLoadLocation(true)
        const _province = props.provinces.provincias.find(
          (provincia) => provincia?.nombre == _direccionArray[0].trim()
        )
        const provinceResponse = await props.getCantonesByProvincia(
          _province?.id,
          props.temporal
        )
        if (provinceResponse.error) {
          return handleError()
        }
        setCurrentProvince({ label: _province?.nombre, value: _province?.id })
        setDirection(
          `${ubicacion.provincia}, ${ubicacion.canton}, ${ubicacion.distrito}`
        )
        setLocation({
          latitude: location.latitude,
          longitude: location.longitude
        })
      }
    }
    loadData()
  }, [ubicacion])

  // this effects parse the data when comes from the backend
  useEffect(() => {
    const loadData = async () => {
      const item = props?.identidad.direcciones.find(
        (item) => item.temporal === props.temporal
      )
      if (item) {
        // [provincia, canton, distrito, poblado, ...]
        const _direccionArray = item.direccionExacta.split(',')
        setDireccionArray(_direccionArray)
        setLoadLocation(true)
        const _province = props.provinces.provincias.find(
          (item) => item?.nombre == _direccionArray[0].trim()
        )
        const provinceResponse = await props.getCantonesByProvincia(
          _province?.id,
          props.temporal
        )

        if (provinceResponse.error) {
          return handleError()
        }
        setEditDirection(item)
        setCurrentProvince({ label: _province?.nombre, value: _province?.id })
        setDirection(item.direccionExacta)
        setLocation({
          latitude: item.latitud,
          longitude: item.longitud
        })
        setRazon(item.razon)
        const territory = props.selects.territoriosIndigenas.find(
          (element) => element?.id === item.territorioIndigenaId
        )
        territory &&
          setCurrentTerritory({
            ...territory,
            value: territory?.id,
            label: territory?.nombre
          })
      } else {
        setLoading(false)
        setInitiaState()
      }
    }
    if (props?.identidad.direcciones && props?.identidad.direcciones.length > 0) {
      loadData()
    } else {
      setLoading(false)
      setInitiaState()
    }
  }, [props?.identidad.direcciones, editable])

  useEffect(() => {
    const loadData = async () => {
      let _canton = { nombre: '', id: null }

      if (props.temporal) {
        _canton = props.cantones.cantonesTemporales.find(
          (item) => item?.nombre === direccionArray[1].trim()
        )
      } else {
        _canton = props.cantones.cantones.find(
          (item) => item?.nombre === direccionArray[1].trim()
        )
      }
      _canton
        ? setCurrentCanton({ label: _canton?.nombre, value: _canton?.id })
        : setCurrentCanton({ label: '', value: null })

      setCantonesData(
        props.cantones.cantones || props.cantones.cantonesTemporales
      )
      const cantonResponse = await props.getDistritosByCanton(
        _canton?.id,
        props.temporal
      )

      if (cantonResponse.error) {
        return handleError()
      }
    }
    if (
      loadLocation &&
      ((!props.temporal && props.cantones.cantones.length > 0) ||
        (props.temporal && props.cantones.cantonesTemporales.length > 0))
    ) {
      loadData()
    }
  }, [props.cantones.cantones, props.cantones.cantonesTemporales])

  useEffect(() => {
    const loadData = async () => {
      let _distrito = { nombre: '', id: null }
      if (props.temporal) {
        _distrito = props.distritos.distritosTemporales.find(
          (item) => item?.nombre === direccionArray[2].trim()
        )
      } else {
        _distrito = props.distritos.distritos.find(
          (item) => item?.nombre === direccionArray[2].trim()
        )
      }
      setDistritosData(
        props.distritos.distritos || props.distritos.distritosTemporales
      )
      _distrito
        ? setCurrentDistrito({ label: _distrito?.nombre, value: _distrito?.id })
        : setCurrentDistrito({ label: '', value: null })

      const distritoResponse = await props.getPobladosByDistrito(
        _distrito?.id,
        props.temporal
      )
      if (distritoResponse.error) {
        return handleError()
      }
    }
    if (
      loadLocation &&
      ((!props.temporal && props.distritos.distritos.length > 1) ||
        (props.temporal && props.distritos.distritosTemporales.length > 1))
    ) {
      loadData()
    }
  }, [props.distritos.distritos, props.distritos.distritosTemporales])

  useEffect(() => {
    const loadData = async () => {
      let _poblado = { nombre: '', id: null }
      if (direccionArray[3]) {
        setPobladosData(
          props.poblados.poblados || props.poblados.pobladosTemporales
        )
        if (props.temporal) {
          _poblado = props.poblados.pobladosTemporales.find(
            (item) => item?.nombre === direccionArray[3].trim()
          )
        } else {
          _poblado = props.poblados.poblados.find(
            (item) => item?.nombre === direccionArray[3].trim()
          )
        }
        _poblado
          ? setCurrentPoblado({ label: _poblado?.nombre, value: _poblado?.id })
          : setCurrentPoblado({ label: '', value: null })
      }
      setLoadLocation(false)
    }
    if (
      loadLocation &&
      ((!props.temporal && props.poblados.poblados.length > 1) ||
        (props.temporal && props.poblados.pobladosTemporales.length > 1))
    ) {
      loadData()
      setLoading(false)
    }
  }, [props.poblados.poblados, props.poblados.pobladosTemporales])

  useEffect(() => {
    if (
      location.latitude !== 'No seleccionado' &&
      location.longitude !== 'No seleccionado' &&
      search
    ) {
      search.searchTerm = 'CRI'
      search
        .search([location.longitude, location.latitude])
        .then((response) => {
          search.suggest().then((res) => {
            const result = res?.results[0].results[0]
            if (result) {
              const firstResultArray = result.text.split(',')
              if (!(firstResultArray[firstResultArray.length - 1] === ' CRI')) {
                setSnackbarVariant('error')
                setSnackbarMsg(
                  'La ubicacion debe de estar dentro de costa rica'
                )
                handleClick()
                setLocation(initialLocationCoordinates)
              }
            }
          })
        })
    }
  }, [location.latitude, location.longitude, search])

  useEffect(() => {
    if (props.selects.territoriosIndigenas[0] && editDirection?.id) {
      const territory = props.selects.territoriosIndigenas.find(
        (element) => element?.id === editDirection.territorioIndigenaId
      )
      territory &&
        setCurrentTerritory({
          ...territory,
          value: territory?.id,
          label: territory?.nombre
        })
    }
  }, [
    props.selects.territoriosIndigenas,
    editDirection.territorioIndigenaId,
    editable
  ])

  useEffect(() => {
    if (!editable) {
      setErrors([])
    }
  }, [editable])

  const handleSearchDirection = (e) => {
    e.persist()
    if (
      e.target.value &&
      e.target.value.search(
        `${currentProvince.label}, ${currentCanton.label}, ${currentDistrito.label}, ${currentPoblado.label},`
      ) > -1
    ) {
      setDirection(e.target.value)
      timeOut = setTimeout(() => {
        search.searchTerm = e.target.value
        search.search(`${e.target.value}, CRI`)
        search.suggest()
      }, time)
    } else {
      const newDirection = `${currentProvince.label}, ${currentCanton.label}, ${currentDistrito.label}, ${currentPoblado.label},`
      setDirection(newDirection)
      timeOut = setTimeout(() => {
        search.searchTerm = newDirection
        search.search(`${newDirection}, CRI`)
        search.suggest()
      }, time)
    }
  }

  const handleSearchBySelects = (data, name) => {
    search.clear()
    let _newDirection = ''
    switch (name) {
      case 'provincia':
        setCurrentProvince(data)
        setLocation(initialLocationCoordinates)
        _newDirection = `${data.label}`
        break
      case 'canton':
        setCurrentCanton(data)
        setLocation(initialLocationCoordinates)
        _newDirection = `${currentProvince.label}, ${data.label}`
        break
      case 'distrito':
        setCurrentDistrito(data)
        setLocation(initialLocationCoordinates)
        _newDirection = `${currentProvince.label}, ${currentCanton.label}, ${data.label}`
        break
      case 'poblado':
        setCurrentPoblado(data)
        _newDirection = `${currentProvince.label}, ${currentCanton.label}, ${currentDistrito.label}, ${data.label},`
        break
      default:
        return null
    }
    setDirection(_newDirection)
    search.searchTerm = _newDirection
    search.search(`${_newDirection}, CRI`)
    search.suggest()
  }

  const handleChange = (e) => {
    setRazon(e.target.value)
  }

  const showSnackbar = (variant, msg) => {
    setSnackbarVariant(variant)
    setSnackbarMsg(msg)
    handleClick()
  }

  const setLocationIfEditable = (value) => {
    if (editable) {
      setLocation(value)
    }
  }

  const LoadingIndicator = () => {
    return <LoadingInput className='loadingInput' />
  }

  const LoadingMessage = () => {
    return <LoadingLabel>Cargando...</LoadingLabel>
  }

  const getCatalogs = (type) => {
    let options
    switch (type) {
      case 'poblados':
        options = props.temporal
          ? props.poblados.pobladosTemporales
          : props.poblados.poblados
        break
      case 'cantones':
        options = props.temporal
          ? props.cantones.cantonesTemporales
          : props.cantones.cantones
        break
      case 'distritos':
        options = props.temporal
          ? props.distritos.distritosTemporales
          : props.distritos.distritos
        break
    }
    return options || []
  }

  useEffect(() => {
    props.register({ name: 'provincia' }, { required: 'Requerido' })
    if (currentProvince.value !== null) {
      props.setValue('provincia', currentProvince)
    }

    props.register({ name: 'canton' }, { required: 'Requerido' })
    if (currentCanton.value !== null) {
      props.setValue('canton', currentCanton)
    }

    props.register({ name: 'distrito' }, { required: 'Requerido' })
    if (currentDistrito.value !== null) {
      props.setValue('distrito', currentDistrito)
    }

    props.register({ name: 'poblado' }, { required: 'Requerido' })
    if (currentPoblado.value !== null) {
      props.setValue('pobladoTemp', currentPoblado)
    }
    props.register({ name: 'indigena' }, { required: false })
    if (currentTerritory !== null) {
      props.setValue('indigena', currentTerritory)
    }
    props.register({ name: 'latitud' })
    if (location.latitude !== null) {
      props.setValue('latitud', location.latitude)
    }
    props.register({ name: 'longitud' })
    if (location.longitude !== null) {
      props.setValue('longitud', location.longitude)
    }
    if (props.temporal) {
      props.register({ name: 'provinciaTemp' }, { required: 'Requerido' })
      if (currentProvince.value !== null) {
        props.setValue('provinciaTemp', currentProvince)
      }

      props.register({ name: 'cantonTemp' }, { required: 'Requerido' })
      if (currentCanton.value !== null) {
        props.setValue('cantonTemp', currentCanton)
      }
      props.register({ name: 'distritoTemp' }, { required: 'Requerido' })
      if (currentDistrito.value !== null) {
        props.setValue('distritoTemp', currentDistrito)
      }
      props.register({ name: 'pobladoTemp' }, { required: 'Requerido' })
      if (currentPoblado.value !== null) {
        props.setValue('pobladoTemp', currentPoblado)
      }
      props.register({ name: 'indigenaTemp' })
      if (currentTerritory !== null) {
        props.setValue('indigenaTemp', currentTerritory)
      }
      props.register({ name: 'razon' })
      if (razon !== null) {
        props.setValue('razon', razon)
      }
      props.register({ name: 'latitudTemp' })
      if (location.latitude !== null) {
        props.setValue('latitudTemp', location.latitude)
      }
      props.register({ name: 'longitudTemp' })
      if (location.longitude !== null) {
        props.setValue('longitudTemp', location.longitude)
      }
    }
  }, [
    props.temporal,
    currentProvince,
    currentCanton,
    currentDistrito,
    currentPoblado
  ])
  const values = useMemo(() => {
    return null
  }, [])
  return (
    <Grid container className={classes.root} spacing={2}>
      {sanackBar(snackbarVariant, snackbarMsg)}
      <Grid item xs={12}>
        <Card>
          <CardBody>
            <h4 className='my-3'>{titulo}</h4>
            <Selectors
              editable={editable}
              readOnly={false}
              initialValues={values}
              onChange={(e, _errors) => {
                setErrors(_errors)
                setData({
                  countryId: e?.country?.id,
                  administrativeAreaLevel1: e?.administrative_area_level_1?.id,
                  administrativeAreaLevel2: e?.administrative_area_level_2?.id,
                  direction: e?.street,
                  longitude: e.longitude,
                  latitude: e.latitude,
                  country: e?.country,
                  administrativeAreaLevel1: e?.administrativeAreaLevel1,
                  administrativeAreaLevel2: e?.administrativeAreaLevel2
                })
              }}
            />
          </CardBody>
        </Card>
        {/* <Paper className={classes.control}>
          <Grid container>
            {loading
              ? (
                <LoaderContainer>
                  <Loader />
                </LoaderContainer>
                )
              : (
                <>
                  <Grid item xs={12} className={classes.control}>
                    <h4>{titulo}</h4>
                  </Grid>
                  <Grid item xs={12} md={6} className={classes.control}>
                    <FormGroup>
                      <Label for='provincia'>*Provincia</Label>
                      <Select
                        components={{ Input: CustomSelectInput }}
                        className={
                        props.errors.provincia && props.errors.provincia.message
                          ? 'react-select is-invalid'
                          : 'react-select'
                      }
                        classNamePrefix='react-select'
                        name={`provincia${props.temporal ? 'Temp' : ''}`}
                        id={`provincia${props.temporal ? 'Temp' : ''}`}
                        isDisabled={!editable}
                        onChange={(data) => {
                          props.getCantonesByProvincia(data.value, props.temporal)
                          handleSearchBySelects(data, 'provincia')
                          setCurrentCanton(initialSelectOption)
                          setCurrentDistrito(initialSelectOption)
                          setCurrentPoblado(initialSelectOption)
                          props.temporal
                            ? props.setValue('provinciaTemp', data)
                            : props.setValue('provincia', data)
                        }}
                        value={currentProvince}
                        placeholder='Seleccionar'
                        options={props.provinces.provincias.map((item) => ({
                          label: item?.nombre,
                          value: item?.id
                        }))}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for='canton'>*Cantón</Label>
                      <Select
                        components={{
                          Input: CustomSelectInput,
                          LoadingIndicator,
                          LoadingMessage
                        }}
                        className={
                        props.errors.canton && props.errors.canton.message
                          ? 'react-select is-invalid'
                          : 'react-select'
                      }
                        classNamePrefix='react-select'
                        name={`canton${props.temporal ? 'Temp' : ''}`}
                        id={`canton${props.temporal ? 'Temp' : ''}`}
                        isDisabled={!currentProvince.value || !editable}
                        onChange={(data) => {
                          props.getDistritosByCanton(data.value, props.temporal)
                          handleSearchBySelects(data, 'canton')
                          props.temporal
                            ? props.setValue('cantonTemp', data)
                            : props.setValue('canton', data)
                          setCurrentDistrito(initialSelectOption)
                          setCurrentPoblado(initialSelectOption)
                        }}
                        value={currentCanton}
                        placeholder='Seleccionar'
                        options={getCatalogs('cantones').map((item) => ({
                          label: item?.nombre,
                          value: item?.id
                        }))}
                        isLoading={props.cantones.loadingCantones}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for='distrito'>*Distrito</Label>
                      <Select
                        components={{
                          Input: CustomSelectInput,
                          LoadingIndicator,
                          LoadingMessage
                        }}
                        className={
                        props.errors.distrito && props.errors.distrito.message
                          ? 'react-select is-invalid'
                          : 'react-select'
                      }
                        classNamePrefix='react-select'
                        id={`distrito${props.temporal ? 'Temp' : ''}`}
                        name={`distrito${props.temporal ? 'Temp' : ''}`}
                        isDisabled={!currentCanton.value || !editable}
                        value={currentDistrito}
                        onChange={(data) => {
                          props.getPobladosByDistrito(data.value, props.temporal)
                          handleSearchBySelects(data, 'distrito')
                          props.temporal
                            ? props.setValue('distritoTemp', data)
                            : props.setValue('distrito', data)
                          setCurrentPoblado(initialSelectOption)
                        }}
                        placeholder='Seleccionar'
                        isLoading={props.distritos.loadingDistritos}
                        options={getCatalogs('distritos').map((item) => ({
                          label: item?.nombre,
                          value: item?.id
                        }))}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for='poblado'>*Poblado</Label>
                      <Select
                        components={{
                          Input: CustomSelectInput,
                          LoadingIndicator,
                          LoadingMessage
                        }}
                        className={
                        props.errors.poblado && props.errors.poblado.message
                          ? 'react-select is-invalid'
                          : 'react-select'
                      }
                        classNamePrefix='react-select'
                        id={`poblado${props.temporal ? 'Temp' : ''}`}
                        name={`poblado${props.temporal ? 'Temp' : ''}`}
                        isDisabled={!currentDistrito.value || !editable}
                        value={currentPoblado}
                        onChange={(data) => {
                          handleSearchBySelects(data, 'poblado')
                          props.temporal
                            ? props.setValue('pobladoTemp', data)
                            : props.setValue('poblado', data)
                        }}
                        placeholder='Seleccionar'
                        isLoading={props.poblados.loadingPoblados}
                        options={getCatalogs('poblados').map((item) => ({
                          label: item?.nombre,
                          value: item?.id
                        }))}
                      />
                      <FormSpan>{errors.poblado}</FormSpan>
                    </FormGroup>
                    <FormGroup>
                      <Label for='dirExacta'>*Dirección exacta</Label>
                      <Input
                        type='textarea'
                        style={{ resize: 'none', height: 80 }}
                        id={`dirExacta${props.temporal ? 'Temp' : ''}`}
                        name={`dirExacta${props.temporal ? 'Temp' : ''}`}
                        disabled={!currentPoblado.value || !editable}
                        onChange={(e) => {
                          clearTimeout(timeOut)
                          handleSearchDirection(e)
                        }}
                        value={direction}
                        invalid={
                        props.errors.dirExacta && props.errors.dirExacta.message
                      }
                        innerRef={props.register({
                          required: 'Requerido'
                        })}
                      />
                      <FormFeedback>
                        {' '}
                        {props.errors.dirExacta && props.errors.dirExacta.message}
                      </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <Label for='indigena'>Territorio indígena</Label>
                      <Select
                        components={{
                          Input: CustomSelectInput,
                          LoadingIndicator,
                          LoadingMessage
                        }}
                        className='react-select'
                        classNamePrefix='react-select'
                        id={`indigena${props.temporal ? 'Temp' : ''}`}
                        name={`indigena${props.temporal ? 'Temp' : ''}`}
                        isDisabled={!editable}
                        value={currentTerritory}
                        options={props.selects.territoriosIndigenas.map(
                          (item) => ({
                            ...item,
                            label: item?.nombre,
                            value: item?.id
                          })
                        )}
                        onChange={(data) => {
                          setCurrentTerritory(data)
                        }}
                      />
                    </FormGroup>
                    <Grid container>
                      <Grid item xs={12} style={{ paddingRight: 10 }}>
                        <FormSpan>{errors.location}</FormSpan>
                      </Grid>
                      <Grid item xs={6} style={{ paddingRight: 10 }}>
                        <FormGroup>
                          <Label for='latitud'>*Latitud</Label>
                          <Input
                            invalid={
                            (props.errors.latitud &&
                              props.errors.latitud.message) ||
                            validationErrors.latitud
                          }
                            type='text'
                            id={`latitud${props.temporal ? 'Temp' : ''}`}
                            name={`latitud${props.temporal ? 'Temp' : ''}`}
                            disabled
                            value={location.latitude}
                          />
                          <FormFeedback>
                            {' '}
                            {props.errors.latitud && props.errors.latitud.message}
                          </FormFeedback>
                          <ErrorFeedback>
                            {validationErrors.latitud && 'Requerido'}
                          </ErrorFeedback>
                        </FormGroup>
                      </Grid>
                      <Grid item xs={6} style={{ paddingLeft: 10 }}>
                        <FormGroup>
                          <Label for='longitud'>*Longitud</Label>
                          <Input
                            invalid={
                            (props.errors.longitud &&
                              props.errors.longitud.message) ||
                            validationErrors.longitud
                          }
                            type='text'
                            id={`longitud${props.temporal ? 'Temp' : ''}`}
                            name={`longitud${props.temporal ? 'Temp' : ''}`}
                            disabled
                            value={location.longitude}
                          />
                          <FormFeedback>
                            {' '}
                            {props.errors.longitud &&
                            props.errors.longitud.message}
                          </FormFeedback>
                          <ErrorFeedback>
                            {validationErrors.longitud && 'Requerido'}
                          </ErrorFeedback>
                        </FormGroup>
                      </Grid>
                    </Grid>
                    {props.temporal && (
                      <FormGroup>
                        <Input
                          type='textarea'
                          style={{ resize: 'none', height: 80 }}
                          id={`razon${props.temporal ? 'Temp' : ''}`}
                          name={`razon${props.temporal ? 'Temp' : ''}`}
                          invalid={
                          props.errors.razon && props.errors.razon.message
                        }
                          placeholder='Razón'
                          disabled={!editable}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                          value={razon}
                        />
                        <FormFeedback>
                          {' '}
                          {props.errors.razon && props.errors.razon.message}
                        </FormFeedback>
                      </FormGroup>
                    )}
                  </Grid>
                </>
                )}
            <MapContainer item md={6} xs={12} className={classes.control}>
              <WebMapView
                setLocation={setLocationIfEditable}
                setSearch={setSearch}
                setUbicacion={setUbicacion}
                editable={editable}
              />
            </MapContainer>
          </Grid>
        </Paper> */}
      </Grid>
    </Grid>
  )
}

const LoadingLabel = styled.div`
  text-align: center;
  color: grey;
`
const LoadingInput = styled.span`
  position: unset;
`
const LoaderContainer = styled.div`
  height: 10vh;
  width: 100%;
`

InformacionResidenciaForm.defaultProps = {
  temporal: false
}

const MapContainer = styled(Grid)`
  @media (max-width: 870px) {
    height: 29rem;
  }
`

const FormSpan = styled.span`
  color: red;
`
const ErrorFeedback = styled.span`
  position: absolute;
  color: #bd0505;
  right: 0;
  font-weight: bold;
  font-size: 10px;
  bottom: -19px;
`

const mapStateToProps = (state) => {
  return {
    provinces: state.provincias,
    cantones: state.cantones,
    distritos: state.distritos,
    poblados: state.poblados,
    selects: state.selects,
    direccion: state.direccion
  }
}

const mapDispatchToProps = {
  getCantonesByProvincia,
  getDistritosByCanton,
  getPobladosByDistrito,
  createDirection,
  updateDirection,
  getCatalogs,
  getProvincias
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InformacionResidenciaForm)
