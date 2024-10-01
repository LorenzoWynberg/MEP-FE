import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import { connect } from 'react-redux'
import { getCantonesByProvincia } from '../../../../../redux/cantones/actions'
import { getDistritosByCanton } from '../../../../../redux/distritos/actions'
import { getPobladosByDistrito } from '../../../../../redux/poblados/actions'
import { WebMapView } from './MapView'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { mapOption } from '../../../../../utils/mapeoCatalogos'
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2)
  },
  labelCheck: { color: '#145388', fontWeight: 'bold' }
}))

const InformacionResidenciaFormSaber = (props) => {
  const { titulo, temporal, setValue } = props

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
    props.getCatalogs(catalogsEnumObj.TERRITORIOINDIGENA.id)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (ubicacion.provincia && editable) {
        // [provincia, canton, distrito, poblado, ...]
        const _direccionArray = [
          ubicacion.provincia,
          ubicacion.canton,
          ubicacion.distrito,
          ubicacion.poblado
        ]
        setDireccionArray(_direccionArray)
        setLoadLocation(true)
        const _province = props.provinces.provincias.find(
          (provincia) => provincia.nombre == _direccionArray[0].trim()
        )
        const provinceResponse = await props.getCantonesByProvincia(
          _province.id,
          props.temporal
        )
        if (provinceResponse.error) {
          return handleError()
        }
        setCurrentProvince({ label: _province.nombre, value: _province.id })
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
      const item = props.matricula.direcciones.find(
        (item) => item.temporal === props.temporal
      )
      if (item) {
        // [provincia, canton, distrito, poblado, ...]
        const _direccionArray = item.direccionExacta.split(',')
        setDireccionArray([item.provinciasId, item.cantonesId, item.distritosId, item.pobladoId])
        setLoadLocation(true)
        const _province = props.provinces.provincias.find(
          (el) => el.id == item.provinciasId
        )
        if (_province) {
          const provinceResponse = await props.getCantonesByProvincia(
            _province.id,
            props.temporal
          )

          if (provinceResponse.error) {
            return handleError()
          }
          setEditDirection(item)
          setCurrentProvince({ label: _province.nombre, value: _province.id })
          setDirection(item.direccionExacta)
          setLocation({
            latitude: item.latitud,
            longitude: item.longitud
          })
          setRazon(item.razon)
          const territory = props.selects.territoriosIndigenas.find(
            (element) => element.id === item.territorioIndigenaId
          )
          territory &&
            setCurrentTerritory({
              ...territory,
              value: territory.id,
              label: territory.nombre
            })
        } else {
          setLoading(false)
        }
      } else {
        setLoading(false)
        setInitiaState()
      }
    }
    if (props.matricula.direcciones && props.matricula.direcciones.length > 0) {
      loadData()
    } else {
      setLoading(false)
      setInitiaState()
    }

    const idType = mapOption(
      props.state.matricula.data.datos,
      props.state.selects,
      catalogsEnumObj.IDENTIFICATION.id,
      catalogsEnumObj.IDENTIFICATION.name
    )

    //     idType.codigo == "01" && setEditable(false)
  }, [props.matricula.direcciones, editable])

  useEffect(() => {
    const loadData = async () => {
      let _canton = { nombre: '', id: null }
      if (props.temporal) {
        _canton = props.cantones.cantonesTemporales.find(
          (item) => {
            if (isNaN(direccionArray[1])) {
              return item.nombre === direccionArray[1].trim()
            } else {
              return item.id === direccionArray[1]
            }
          }
        )
      } else {
        _canton = props.cantones.cantones.find(
          (item) => {
            if (isNaN(direccionArray[1])) {
              return item.nombre === direccionArray[1].trim()
            } else {
              return item.id === direccionArray[1]
            }
          }
        )
      }
      _canton
        ? setCurrentCanton({ label: _canton.nombre, value: _canton.id })
        : setCurrentCanton({ label: '', value: null })

      setCantonesData(
        props.cantones.cantones || props.cantones.cantonesTemporales
      )

      if (_canton) {
        const cantonResponse = await props.getDistritosByCanton(
          _canton.id,
          props.temporal
        )
        if (cantonResponse.error) {
          return handleError()
        }
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
          (item) => {
            if (isNaN(direccionArray[2])) {
              return item.nombre === direccionArray[2].trim()
            } else {
              return item.id === direccionArray[2]
            }
          }
        )
      } else {
        _distrito = props.distritos.distritos.find(
          (item) => {
            if (isNaN(direccionArray[2])) {
              return item.nombre === direccionArray[2].trim()
            } else {
              return item.id === direccionArray[2]
            }
          }
        )
      }
      setDistritosData(
        props.distritos.distritos || props.distritos.distritosTemporales
      )
      _distrito
        ? setCurrentDistrito({ label: _distrito.nombre, value: _distrito.id })
        : setCurrentDistrito({ label: '', value: null })

      if (_distrito) {
        const distritoResponse = await props.getPobladosByDistrito(
          _distrito.id,
          props.temporal
        )
        if (distritoResponse.error) {
          return handleError()
        }
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

            (item) => {
              if (isNaN(direccionArray[3])) {
                return item.nombre === direccionArray[3].trim()
              } else {
                return item.id === direccionArray[3]
              }
            }
          )
        } else {
          _poblado = props.poblados.poblados.find(
            (item) => {
              if (isNaN(direccionArray[3])) {
                return item.nombre === direccionArray[3].trim()
              } else {
                return item.id === direccionArray[3]
              }
            }
          )
        }
        _poblado
          ? setCurrentPoblado({ label: _poblado.nombre, value: _poblado.id })
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
    if (props.selects.territoriosIndigenas[0] && editDirection.id) {
      const territory = props.selects.territoriosIndigenas.find(
        (element) => element.id === editDirection.territorioIndigenaId
      )
      territory &&
        setCurrentTerritory({
          ...territory,
          value: territory.id,
          label: territory.nombre
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
    setDirection(e.target.value)
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
        _newDirection = `${currentProvince.label}, ${currentCanton.label}, ${currentDistrito.label}`
        break
      default:
        return null
    }
    setDirection("")
    search.searchTerm = _newDirection
    search.search(`${_newDirection}, CRI`)
    // search.suggest()
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
    if (props.temporal) {
      if (currentProvince.value !== null) {
        props.setValue('provinciaTemp', currentProvince)
      } else {

      }

      if (currentCanton.value !== null) {
        props.setValue('cantonTemp', currentCanton)
      } else {

      }

      if (currentDistrito.value !== null) {
        props.setValue('distritoTemp', currentDistrito)
      }

      if (currentPoblado.value !== null) {
        props.setValue('pobladoTemp', currentPoblado)
      }

      if (currentTerritory !== null) {
        props.setValue('indigenaTemp', currentTerritory)
      }

      if (razon !== null) {
        props.setValue('razon', razon)
      }

      if (location.latitude !== null) {
        if (location.latitude === 'No seleccionado') {
          props.setValue('latitudTemp', undefined)
          /* props.setError("latitudTemp",{
            type: "manual",
            message: "Campo requerido"
          }) */
        } else {
          props.setValue('latitudTemp', location.latitude)
        }
      } else {
        props.setValue('latitudTemp', undefined)
        /*  props.setError("latitudTemp",{
            type: "manual",
            message: "Campo requerido"
          }) */
      }

      if (location.longitude !== null) {
        if (location.longitude === 'No seleccionado') {
          props.setValue('longitudTemp', undefined)
        } else {
          props.setValue('longitudTemp', location.longitude)
        }
      } else {
        props.setValue('longitudTemp', undefined)
      }
    } else {
      if (currentProvince.value !== null) {
        props.setValue('provincia', currentProvince)
      } else {

      }

      if (currentCanton.value !== null) {
        props.setValue('canton', currentCanton)
      }

      if (currentDistrito.value !== null) {
        props.setValue('distrito', currentDistrito)
      }

      if (currentPoblado.value !== null) {
        props.setValue('poblado', currentPoblado)
      }

      if (currentTerritory !== null) {
        props.setValue('indigena', currentTerritory)
      }

      if (location.latitude !== null) {
        if (location.latitude === 'No seleccionado') {
          props.setValue('latitud', '')
        } else {
          props.setValue('latitud', location.latitude)
        }
      } else {
        props.setValue('latitud', '')
      }

      if (location.longitude !== null) {
        if (location.longitude === 'No seleccionado') {
          props.setValue('longitud', '')
        } else {
          props.setValue('longitud', location.longitude)
        }
      } else {
        props.setValue('longitud', '')
      }
    }
  }, [
    props.temporal,
    currentProvince,
    currentCanton,
    currentDistrito,
    currentPoblado,
    currentTerritory,
    location
  ])

  return (
    <Grid container className={classes.root} spacing={2}>
      {sanackBar(snackbarVariant, snackbarMsg)}
      <Grid item xs={12}>
        <Paper className={classes.control}>
          <Grid container>
            {loading ? (
              <LoaderContainer>
                <Loader />
              </LoaderContainer>
            ) : (
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
                        (!props.temporal && props.errors.provincia && props.errors.provincia.message) ||
                        (props.temporal && props.errors.provinciaTemp && props.errors.provinciaTemp.message)
                          ? 'react-select is-invalid'
                          : 'react-select'
                      }
                      classNamePrefix='react-select'
                      name={`provincia${props.temporal ? 'Temp' : ''}`}
                      id={`provincia${props.temporal ? 'Temp' : ''}`}
                      isDisabled={!editable}
                      onChange={(data) => {
                        props.getCantonesByProvincia(
                          data.value,
                          props.temporal
                        )
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
                        label: item.nombre,
                        value: item.id
                      }))}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='canton'>*Cantón</Label>
                    <Select
                      components={{
                        Input: CustomSelectInput,
                        LoadingIndicator: LoadingIndicator,
                        LoadingMessage
                      }}
                      className={
                        (!props.temporal && props.errors.canton && props.errors.canton.message) ||
                         (props.temporal && props.errors.cantonTemp && props.errors.cantonTemp.message)
                          ? 'react-select is-invalid'
                          : 'react-select'
                      }
                      classNamePrefix='react-select'
                      name={`canton${props.temporal ? 'Temp' : ''}`}
                      id={`canton${props.temporal ? 'Temp' : ''}`}
                      isDisabled={!currentProvince.value || !editable}
                      onChange={async (data) => {
                        await props.getDistritosByCanton(data.value, props.temporal)
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
                        label: item.nombre,
                        value: item.id
                      }))}
                      isLoading={props.cantones.loadingCantones}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='distrito'>*Distrito</Label>
                    <Select
                      components={{
                        Input: CustomSelectInput,
                        LoadingIndicator: LoadingIndicator,
                        LoadingMessage
                      }}
                      className={
                        (!props.temporal && props.errors.distrito && props.errors.distrito.message) ||
                        (props.temporal && props.errors.distritoTemp && props.errors.distritoTemp.message)
                          ? 'react-select is-invalid'
                          : 'react-select'
                      }
                      classNamePrefix='react-select'
                      id={`distrito${props.temporal ? 'Temp' : ''}`}
                      name={`distrito${props.temporal ? 'Temp' : ''}`}
                      isDisabled={!currentCanton.value || !editable}
                      value={currentDistrito}
                      onChange={async (data) => {
                        await props.getPobladosByDistrito(data.value, props.temporal)
                        handleSearchBySelects(data, 'distrito')
                        props.temporal
                          ? props.setValue('distritoTemp', data)
                          : props.setValue('distrito', data)
                        setCurrentPoblado(initialSelectOption)
                      }}
                      placeholder='Seleccionar'
                      isLoading={props.distritos.loadingDistritos}
                      options={getCatalogs('distritos').map((item) => ({
                        label: item.nombre,
                        value: item.id
                      }))}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='poblado'>*Poblado</Label>
                    <Select
                      components={{
                        Input: CustomSelectInput,
                        LoadingIndicator: LoadingIndicator,
                        LoadingMessage
                      }}
                      className={
                        (!props.temporal && props.errors.poblado && props.errors.poblado.message) ||
                        (props.temporal && props.errors.pobladoTemp && props.errors.pobladoTemp.message)
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
                        label: item.nombre,
                        value: item.id
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
                        (props.errors.dirExacta && props.errors.dirExacta.message) ||
                         (props.temporal && props.errors.dirExactaTemp && props.errors.dirExactaTemp.message)
                      }
                      innerRef={props.register({
                        required: props.temporal ? false : 'Requerido'
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
                        LoadingIndicator: LoadingIndicator,
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
                          label: item.nombre,
                          value: item.id
                        })
                      )}
                      onChange={(data) => {
                        setCurrentTerritory(data)
                        props.temporal
                          ? props.setValue('indigenaTemp', data)
                          : props.setValue('indigena', data)
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
                            (!props.temporal && props.errors.latitud && props.errors.latitud.message) || (props.temporal && props.errors.latitudTemp && props.errors.latitudTemp.message)
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
                      </FormGroup>
                    </Grid>
                    <Grid item xs={6} style={{ paddingLeft: 10 }}>
                      <FormGroup>
                        <Label for='longitud'>*Longitud</Label>
                        <Input
                          invalid={

                            (!props.temporal && props.errors.longitud && props.errors.longitud.message) || (props.temporal && props.errorslongitudTemp && props.errors.longitudTemp.message)
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
                      </FormGroup>
                    </Grid>
                  </Grid>
                  {props.temporal && (
                    <FormGroup>
                      <Label>
                        *Detalle la razón del domicilio temporal
                      </Label>
                      <Input
                        type='textarea'
                        style={{ resize: 'none', height: 80 }}
                        id='razon'
                        name='razon'
                        invalid={
                          props.errors.razon && props.errors.razon.message

                        }
                        placeholder='Razón'
                        disabled={!editable}
                        onChange={(e) => {
                          handleChange(e)
                        }}
                        value={razon}
                        innerRef={props.register({
                          required: props.temporal ? 'Requerido' : false
                        })}
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
        </Paper>
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

InformacionResidenciaFormSaber.defaultProps = {
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
)(InformacionResidenciaFormSaber)