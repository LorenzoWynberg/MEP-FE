import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Subsidio from '../../_modals/beneficio'
import Tabla from './TablaMep'
import PropTypes from 'prop-types'
import IntlMessages from '../../../../../../../helpers/IntlMessages'
import styled from 'styled-components'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

import {
  FormGroup,
  Label,
  Input,
  CustomInput,
  Form,
  FormFeedback
} from 'reactstrap'
import { EditButton } from 'components/EditButton'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../../../../hooks/useActions'
import {
  addSubsidio,
  deleteSubsidio
} from '../../../../../../../redux/beneficios/actions'
import useNotification from '../../../../../../../hooks/useNotification'
import RequiredLabel from 'components/common/RequeredLabel'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  control: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  periodo: {
    paddingLeft: theme.spacing(2)
  },
  paper: {
    minHeight: 475,
    padding: 20,
    marginLeft: 10,
    marginBottom: 20,
    marginTop: 20
  }
}))

const BeneficiosMEP = (props) => {
  const {
    data,
    tipos,
    loading,
    dependencias,
    handleSearch,
    handlePagination,
    totalRegistros
  } = props
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(false)
  const [editable, setEditable] = useState(true)
  const [currentSubsidio, setCurrentSubsidio] = useState({})
  const [prevSubsidio, setPrevSubsidio] = useState({})
  const [verificated, setVerificated] = useState(false)
  const [dependencia, setDependencia] = useState({})
  const [orderedTypes, setOrderedTypes] = useState(tipos)
  const [snackbarContent, setSnackbarContent] = useState({ msg: '', type: '' })
  const [disabledRadio, setDisabledRadio] = useState(false)
  const [currentBeneficio, setCurrentBeneficio] = useState({})
  const [visualizing, setVisualizing] = useState(false)
  const [showButtons, setShowButtons] = useState(true)
  const [snackbar, handleClick] = useNotification()

  const { register, handleSubmit, reset, watch, setValue } = useForm()

  const state = useSelector((store) => {
    return {
      identification: store.identification,
      beneficios: store.beneficios
    }
  })
  const actions = useActions({ addSubsidio, deleteSubsidio })
  const fromDate = watch('dateFrom')
  const toDate = watch('dateTo')
  const toDateInvalid =
    fromDate && toDate && moment(toDate, 'YYYY-MM-DD').isBefore(fromDate)

  useEffect(() => {
    setOrderedTypes(tipos)
  }, [tipos])

  useEffect(() => {
    setOrderedTypes(tipos)
  }, [currentBeneficio])

  useEffect(() => {
    if (!editable) {
      clearData()
    }
  }, [editable])

  useEffect(() => {
    if (fromDate) {
      const fromDateParsed = moment(fromDate)
      if (moment().isSameOrBefore(fromDateParsed)) {
        setVerificated(false)
        setDisabledRadio(true)
      } else {
        setDisabledRadio(false)
      }
    }
  }, [fromDate])

  const handleSubsidio = () => {
    setOpen(!open)
  }

  const handleChangeSubsidio = (item) => {
    setCurrentSubsidio(item)
  }

  const toggleModal = (saveData = false) => {
    if (saveData) {
      setPrevSubsidio(currentSubsidio)
    }
    setOpen(!open)
    setCurrentSubsidio({})
  }

  const sendData = async (data) => {
    if (toDateInvalid) {
      return
    }
    let _data = {}
    if (props.item) {
      _data = {
        id: props.item,
        identidadesId: state.identification.data.id,
        tipoSubsidioId: prevSubsidio.id,
        detalle: data.detSubsidio,
        recepcionVerificada: verificated,
        fechaInicio: moment(data.dateFrom).toDate(),
        fechaFinal: moment(data.dateTo).toDate()
      }
    } else {
      _data = {
        id: 0,
        identidadesId: state.identification.data.id,
        tipoSubsidioId: prevSubsidio.id,
        detalle: data.detSubsidio,
        recepcionVerificada: verificated,
        fechaInicio: moment(data.dateFrom).toDate(),
        fechaFinal: moment(data.dateTo).toDate()
      }
    }
    const response = await actions.addSubsidio(_data)
    if (response.error) {
      setSnackbarContent({
        msg: 'Hubo un error',
        type: 'error'
      })
      handleClick()
    } else {
      setSnackbarContent({
        msg: 'Se ha creado el registro',
        type: 'success'
      })
      handleClick()
      setView(false)
      clearData()
    }
  }

  const clearData = () => {
    reset()
    setCurrentSubsidio({})
    setPrevSubsidio({})
    setDependencia({})
    setVerificated(false)
  }

  const handleDeleteSubsidio = async (ids) => {
    const response = await actions.deleteSubsidio(
      ids,
      state.identification.data.id
    )
    return response
  }

  const handleViewSubsidio = async (e) => {
    await setView(true)
    setDependencia({ label: e.nombreDependecia, value: null })
    setValue('dateFrom', moment(e.fechaInicio).format('YYYY-MM-DD'))
    setValue('dateTo', moment(e.fechaFinal).format('YYYY-MM-DD'))
    setValue('detSubsidio', e.detalle)
    setVerificated(e.recepcionVerificada == 'Si')
    setPrevSubsidio(tipos.find(tipo => tipo.nombre == e.nombreTipoSubsidio))
    setVisualizing(true)
    setShowButtons(false)
  }

  const handleCreateToggle = () => {
    clearData()
    setView(true)
    setShowButtons(true)
    setVisualizing(false)
    setEditable(true)
  }

  const toggleSnackbar = (type, msg) => {
    setSnackbarContent({
      msg,
      type
    })
    handleClick()
  }

  return (
    <>
      {snackbar(snackbarContent.type, snackbarContent.msg)}
      {!view && (
        <div>
          <h5>Por parte del MEP</h5>
          <Tabla
            handlePagination={handlePagination}
            toggleSnackbar={toggleSnackbar}
            handleSearch={handleSearch}
            totalRegistros={totalRegistros}
            data={data}
            authHandler={props.authHandler}
            handleViewSubsidio={handleViewSubsidio}
            tipos={tipos}
            match={props.match}
            loading={loading}
            handleCreateToggle={handleCreateToggle}
            handleDeleteSubsidio={handleDeleteSubsidio}
          />
        </div>
      )}
      {view && (
        <>
          <NavigationContainer
            onClick={(e) => {
              setView(false)
            }}
          >
            <ArrowBackIosIcon />
            <h4>
              <IntlMessages id='pages.go-back-home' />
            </h4>
          </NavigationContainer>
          <Subsidio
            open={open}
            tipos={orderedTypes}
            currentSubsidio={currentSubsidio}
            handleChangeSubsidio={handleChangeSubsidio}
            toggleModal={toggleModal}
          />
          <Form onSubmit={handleSubmit((data) => props.authHandler('modificar', () => sendData(data)))}>
            <Grid container className={classes.root} spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Grid container>
                    <Grid item xs={12} className={classes.control}>
                      <h4>Por parte del MEP</h4>
                    </Grid>
                    <Grid item xs={12} className={classes.control}>
                      <FormGroup>
                        <RequiredLabel>Dependencia</RequiredLabel>
                        <Select
                          name='dependencia'
                          className='react-select'
                          classNamePrefix='react-select'
                          value={dependencia}
                          options={dependencias.map((item) => ({
                            ...item,
                            value: item.id,
                            label: item.nombre
                          }))}
                          isDisabled={!editable || visualizing}
                          noOptionsMessage={() => 'No hay opciones'}
                          onChange={(data) => {
                            setDependencia(data)
                            setOrderedTypes(
                              tipos.filter(
                                (item) =>
                                  item.dependeciasSubsidioId === data.value
                              )
                            )
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <RequiredLabel>Tipo de subsidio MEP</RequiredLabel>
                        <Input
                          name='tiposubsidio'
                          onClick={() => {
                            handleSubsidio()
                          }}
                          value={prevSubsidio.nombre}
                          disabled={!editable || !dependencia.value}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for='detSubsidio'>
                          Detalle del subsidio MEP
                        </Label>
                        <Input
                          type='textarea'
                          style={{ resize: 'none', height: 80 }}
                          name='detSubsidio'
                          id='detSubsidio'
                          disabled={!editable || visualizing}
                          innerRef={register}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Verificación de la recepción del apoyo</Label>
                        <div>
                          <CustomInput
                            type='radio'
                            label='Si'
                            inline
                            disabled={!editable || disabledRadio || visualizing}
                            checked={verificated}
                            onClick={() => {
                              setVerificated(true)
                            }}
                          />
                          <CustomInput
                            type='radio'
                            label='No'
                            inline
                            disabled={!editable || disabledRadio || visualizing}
                            checked={!verificated}
                            onClick={() => {
                              setVerificated(false)
                            }}
                          />
                        </div>
                      </FormGroup>
                    </Grid>
                    <Grid container>
                      <Grid item xs={12} className={classes.periodo}>
                        <Label>Periodo activo</Label>
                      </Grid>
                      <Grid item xs={5} className={classes.control}>
                        <FormGroup>
                          <RequiredLabel />
                          <Input
                            type='date'
                            name='dateFrom'
                            style={{ paddingRight: '12%' }}
                            invalid={
                              toDateInvalid ||
                              state.beneficios.fields.fechaInicio
                            }
                            disabled={!editable || visualizing}
                            innerRef={register}
                          />
                        </FormGroup>
                        <FormFeedback>
                          {toDateInvalid &&
                            'la fecha de inicio debe ser antes de la fecha de final'}
                          {state.beneficios.fields.fechaInicio &&
                            state.beneficios.errors.fechaInicio}
                        </FormFeedback>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        style={{ textAlign: 'center', paddingTop: 40 }}
                        className={classes.control}
                      >
                        <FormGroup>
                          <Label> al </Label>
                        </FormGroup>
                      </Grid>
                      <Grid item xs={5} className={classes.control}>
                        <FormGroup>
                          <RequiredLabel />
                          <Input
                            type='date'
                            name='dateTo'
                            style={{ paddingRight: '12%' }}
                            invalid={
                              toDateInvalid ||
                              state.beneficios.fields.fechaFinal
                            }
                            disabled={!editable || visualizing}
                            innerRef={register}
                          />
                          <FormFeedback>
                            {toDateInvalid &&
                              'la fecha de inicio debe ser antes de la fecha de final'}
                            {state.beneficios.fields.fechaFinal &&
                              state.beneficios.errors.fechaFinal}
                          </FormFeedback>
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
                <Grid
                  item
                  xs={12}
                  style={{ textAlign: 'center' }}
                  className={classes.control}
                >
                  {showButtons && <FormGroup check row>
                    <EditButton
                      editable={editable}
                      setEditable={(value) => props.authHandler('modificar', () => setEditable(value), toggleSnackbar)}
                      sendData={() => {}}
                      loading={state.beneficios.loading}
                    />
                  </FormGroup>}
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </>
      )}
    </>
  )
}

const NavigationContainer = styled.span`
  display: flex;
  cursor: pointer;
`

BeneficiosMEP.prototype = {
  data: PropTypes.array,
  tipos: PropTypes.array,
  loading: PropTypes.bool
}
BeneficiosMEP.defaultProps = {
  data: [],
  tipos: [],
  loading: false
}

export default BeneficiosMEP
