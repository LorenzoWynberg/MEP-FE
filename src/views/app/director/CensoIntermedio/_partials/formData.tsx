import 'react-datepicker/dist/react-datepicker.css'

import { makeStyles } from '@material-ui/core/styles'
import colors from 'Assets/js/colors'
import { Colxx } from 'Components/common/CustomBootstrap'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Loader from 'Components/LoaderContainer'
import SimpleModal from 'Components/Modal/simple'
import InputWrapper from 'Components/wrappers/InputWrapper'
import { format, parseISO } from 'date-fns'
import IntlMessages from 'Helpers/IntlMessages'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import InputMask from 'react-input-mask'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { useActions } from 'Hooks/useActions'
import { clearCurrentDiscapacidades } from 'Redux/matricula/apoyos/actions'

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  CustomInput,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row
} from 'reactstrap'
import styled from 'styled-components'
import { catalogsEnum, catalogsEnumObj } from 'Utils/catalogsEnum'
import { getYearsOld } from 'Utils/years'

const useStyles = makeStyles((theme) => ({
  inputTags: {
    minHeight: '8rem',
    border: '1px solid #eaeaea',
    padding: '0.35rem',
    color: 'white'
  },
  input: {
    display: 'none'
  }
}))

interface IProps {
  data: any
  onMatricular: Function
  hasAddAccess: boolean
}

const parseDatosToSelectValue = (datos, selects) => {
  let _data = {}

  datos.forEach((item) => {
    const typeCat = catalogsEnum.find((x) => x.id === item.catalogoId)
    const selected = selects[typeCat.name].find((x) => x.id === item.elementoId)
    let _obj = {}

    switch (typeCat.name) {
      case 'nationalities':
        _obj = {
          nationality: selected
        }
        break
      case 'genderTypes':
        _obj = {
          genero: selected
        }
        break
      case 'sexoTypes':
        _obj = {
          sexo: selected
        }
        break
      case 'tipoDimex':
        _obj = {
          tipoDimex: selected
        }
        break
      case 'tipoYisro':
        _obj = {
          tipoYisro: selected
        }
        break
      case 'migrationTypes':
        _obj = {
          migrationTypes: selected
        }
        break
      case 'idTypes':
        _obj = {
          type_identification: selected.nombre
        }
        break
    }
    _data = { ..._data, ..._obj }
  })
  return _data
}

const optionsAdditionalData = [
  { label: 'SI', value: 1 },
  { label: 'NO', value: 2 },
  { label: 'No logré contacto con el hogar', value: 3 }
]

const optionsAdditionalDataAyuda = [
  { label: 'Reportar el teléfono', value: 1 },
  { label: 'No logré contacto con el hogar', value: 2 }
]

const FormData: React.FC<IProps> = (props) => {
  const { data, onMatricular, hasAddAccess = true } = props
  const [estudiante, setEstudiante] = useState<any>({})
  const [openOptions, setOpenOptions] = useState({ open: false })
  const [modalOptions, setModalOptions] = useState([])
  const [discapacidades, setDiscapacidades] = useState([])
  const [isRefugiado, setIsRefugiado] = useState(false)
  const [isRepitente, setIsRepitente] = useState(false)
  const classes = useStyles()

  const [conectividad, setConectividad] = useState(null)
  const [tieneDispositivo, setTieneDispositivo] = useState(null)

  const [ayudaConectividad, setAyudaConectividad] = useState(null)
  const [numeroAyudaConectividad, setNumeroAyudaConectividad] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const state = useSelector((store: any) => {
    return {
      apoyos: store.apoyos,
      selects: store.selects
    }
  })
  const actions = useActions({
    clearCurrentDiscapacidades
  })

  const discapacidadesStore = state.selects[catalogsEnumObj.DISCAPACIDADES.name]

  useEffect(() => {
    const fetch = async () => {
      await actions.clearCurrentDiscapacidades()
    }
    if (data) {
      setEstudiante(mapper(data))
      setIsRepitente(data.esRepitente)
      setIsRefugiado(data.esRefugiado)
      setConectividad(
        data.conectividad
          ? optionsAdditionalData.find(
            (x) => x.value === Number(data.conectividad)
          )
          : null
      )
      setTieneDispositivo(
        data.tieneDispositivo
          ? optionsAdditionalData.find(
            (x) => x.value === Number(data.tieneDispositivo)
          )
          : null
      )
      setAyudaConectividad(
        data.ayudaConectividad
          ? optionsAdditionalDataAyuda.find(
            (x) => x.value === Number(data.ayudaConectividad)
          )
          : null
      )
      setNumeroAyudaConectividad(data.numeroAyudaConectividad)
    } else {
      fetch()
      resetData()
      setErrors({})
    }
  }, [data])

  useEffect(() => {
    const _discapacidades = []

    if (state.apoyos.discapacidadesIdentidad) {
      const _discapacidadesIdentidad =
        state.apoyos.discapacidadesIdentidad.map(
          (discapacidad) => discapacidad.elementosCatalogosId
        ) || []
      discapacidadesStore.forEach((discapacidad) => {
        if (_discapacidadesIdentidad.includes(discapacidad.id)) {
          _discapacidades.push(discapacidad)
        }
      })
    }

    setDiscapacidades(_discapacidades)
  }, [state.apoyos.discapacidadesIdentidad])

  const mapper = (data) => {
    const datos = parseDatosToSelectValue(data.datos, state.selects)

    return {
      ...data,
      ...datos,
      edad: getYearsOld(data.fechaNacimiento),
      fechaNacimientoP: format(parseISO(data.fechaNacimiento), 'dd/MM/yyyy')
    }
  }
  const handleOpenOptions = () => {
    let _options = []
    const mappedDiscapacidades = discapacidades.map((item) => item.id)

    _options = discapacidadesStore.map((discapacidad) => {
      if (mappedDiscapacidades.includes(discapacidad.id)) {
        return { ...discapacidad, checked: true }
      } else {
        return { ...discapacidad, checked: false }
      }
    })
    setModalOptions(_options)
    setOpenOptions({ open: true })
  }

  const toggleModal = (saveData = false) => {
    let options = []
    if (saveData) {
      options = []
      modalOptions.forEach((discapacidad) => {
        if (discapacidad.checked) options.push(discapacidad)
      })
      setDiscapacidades(options)
    }
    setOpenOptions({ open: false })
  }
  const handleChangeItem = (item) => {
    const newItems = modalOptions.map((element) => {
      if (element.id === item.id) { return { ...element, checked: !element.checked } }
      return element
    })
    setModalOptions(newItems)
  }
  const resetData = () => {
    setDiscapacidades([])
    setModalOptions([])
    setEstudiante({
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimientoP: '',
      edad: '',
      conocidoComo: '',
      nationality: { nombre: '' },
      sexo: { nombre: '' },
      genero: { nombre: '' }
    })
    setIsRefugiado(false)
    setIsRefugiado(false)
    setConectividad(null)
    setTieneDispositivo(null)
    setAyudaConectividad(null)
    setNumeroAyudaConectividad('')
  }
  const _onMatricular = async () => {
    let errors = {}
    let error = false
    if (!conectividad) {
      errors = { ...errors, accesoInternet: true }
      error = true
    }
    if (!tieneDispositivo) {
      errors = { ...errors, tieneDispositivo: true }
      error = true
    }
    if (!ayudaConectividad) {
      errors = { ...errors, ayudaConectividad: true }
      error = true
    }

    if (
      ayudaConectividad &&
      ayudaConectividad.value === 1 &&
      !numeroAyudaConectividad
    ) {
      errors = { ...errors, numeroAyudaConectividad: true }
      error = true
    }
    if (error) {
      setErrors(errors)
      return
    }
    const data = {
      esRepitente: isRepitente,
      esRefugiado: isRefugiado,
      discapacidades: discapacidades.map((x) => x.id),

      conectividad: conectividad.value,
      tieneDispositivo: tieneDispositivo.value,
      ayudaConectividad: ayudaConectividad.value,
      numeroAyudaConectividad
    }
    setLoading(true)
    const response = await onMatricular(data)
    if (response) {
      resetData()
    }
    setLoading(false)
  }

  return (
    <Colxx className='mb-5' sm='12' lg='12' xl='12'>
      {loading && <Loader />}
      <Card>
        <CardBody>
          <Form>
            <FormGroup row>
              <Colxx sm='12' lg='3'>
                <Label className='form-group has-top-label'>
                  <Input
                    type='text'
                    disabled
                    name='name'
                    readOnly
                    value={estudiante?.nombre}
                    className='requerido'
                  />
                  <IntlMessages id='label.name' />
                </Label>
              </Colxx>
              <Colxx sm='12' lg='3'>
                <Label className='form-group has-top-label'>
                  <Input
                    type='text'
                    name='lastName'
                    className='requerido'
                    value={estudiante?.primerApellido}
                    readOnly
                  />
                  <IntlMessages id='label.lastName' />
                </Label>
              </Colxx>
              <Colxx sm='12' lg='2'>
                <Label className='form-group has-top-label'>
                  <Input
                    type='text'
                    name='secondLastName'
                    readOnly
                    value={estudiante?.segundoApellido}
                    className='requerido'
                  />
                  <IntlMessages id='label.secondSurname' />
                </Label>
              </Colxx>
              <Colxx sm='12' lg='2'>
                <div className='form-group has-top-label'>
                  <DatePicker
                    className='requerido'
                    value={estudiante?.fechaNacimientoP}
                    shouldCloseOnSelect
                    dateFormat='dd/MM/yyyy'
                    maxDate={moment().toDate()}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    minDate={new Date(1940, 0, 1)}
                    dropdownMode='select'
                    locale='es'
                  />
                  <IntlMessages id='label.birthDate' />
                </div>
              </Colxx>
              <Colxx sm='6' lg='2'>
                <Label className='form-group has-top-label'>
                  <Input
                    invalid={false}
                    readOnly
                    value={estudiante?.edad}
                  />
                  <span>Edad</span>
                </Label>
              </Colxx>
              <Colxx sm='12' lg='3'>
                <Label className='form-group has-top-label'>
                  <Input
                    type='text'
                    name='conocidoComo'
                    value={estudiante?.conocidoComo}
                    readOnly
                  />
                  <IntlMessages id='Conocido como (TSE)' />
                </Label>
              </Colxx>
              <Colxx sm='12' lg='3'>
                <Label className='form-group has-top-label'>
                  <Input
                    type='text'
                    name='nacionalidad'
                    value={estudiante?.nationality?.nombre}
                    readOnly
                  />
                  <span>Nacionalidad</span>
                </Label>
              </Colxx>
              <Colxx sm='12' lg='2'>
                <Label className='form-group has-top-label'>
                  <Input
                    type='text'
                    name='sexo'
                    value={estudiante?.sexo?.nombre}
                    readOnly
                  />
                  <span>Sexo</span>
                </Label>
              </Colxx>
              <Colxx sm='12' lg='2'>
                <Label className='form-group has-top-label'>
                  <Input
                    type='text'
                    name='sexo'
                    value={estudiante?.genero?.nombre}
                    readOnly
                  />
                  <span>Identidad de género</span>
                </Label>
              </Colxx>

              <Colxx sm='6' lg='2'>
                <h3>
                  <span>Condición</span>
                </h3>
                <div />
                <InputGroup>
                  <CustomInput
                    type='checkbox'
                    label={<IntlMessages id='label.refugee' />}
                    name='refugee'
                    id='refugiado'
                    checked={isRefugiado}
                    onClick={() => {
                      setIsRefugiado(!isRefugiado)
                    }}
                    inline
                  />
                  <CustomInput
                    type='checkbox'
                    label={<IntlMessages id='label.repeating' />}
                    name='repeating'
                    checked={isRepitente}
                    onClick={() => setIsRepitente(!isRepitente)}
                    inline
                  />
                </InputGroup>
              </Colxx>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>

      <div style={{ marginBottom: '2.0rem' }} />
      <Row>
        <Colxx sm='12' md='6'>
          <Card className='h-100'>
            <CardBody>
              <CardTitle tag='h5'>
                <b>CONDICIÓN DE DISCAPACIDAD</b>
              </CardTitle>
              <StyledMultiSelect
                className={classes.inputTags}
                onClick={() => {
                  handleOpenOptions()
                }}
              >
                {discapacidades.map((discapacidad) => {
                  return <ItemSpan>{discapacidad.nombre}</ItemSpan>
                })}
              </StyledMultiSelect>
            </CardBody>{' '}
          </Card>
        </Colxx>

        <Colxx sm='12' md='6'>
          <Card>
            <CardBody>
              <CardTitle tag='h5'>
                <b>DATOS ADICIONALES REQUERIDOS</b>
              </CardTitle>

              <Form>
                <div className='row col-md-12 '>
                  <Label className='form-group has-top-label'>
                    El estudiante tiene acceso a conectividad de internet en su
                    hogar
                  </Label>
                </div>
                <FormGroup row>
                  <Colxx sm='12' lg='4' xl='4'>
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className={
                        errors.accesoInternet
                          ? 'react-select Mui-error'
                          : 'react-select'
                      }
                      classNamePrefix='react-select'
                      name='accesoInternet'
                      value={conectividad}
                      onChange={(e) => {
                        delete errors.accesoInternet

                        setConectividad(e)
                      }}
                      isDisabled={!data}
                      options={optionsAdditionalData}
                      placeholder=''
                    />
                  </Colxx>

                  <Colxx sm='12' lg='5' xl='5'>
                    <div className='form-group has-top-label'>
                      <p
                        style={{
                          color: 'red',
                          fontSize: 12,
                          textAlign: 'left'
                        }}
                      />
                    </div>
                  </Colxx>
                </FormGroup>

                <div className='row col-md-12'>
                  <Label className='form-group has-top-label'>
                    El estudiante tiene acceso a un dispositivo que le permita
                    recibir clases
                  </Label>
                </div>
                <FormGroup row>
                  <Colxx sm='12' lg='4' xl='4'>
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className={
                        errors.tieneDispositivo
                          ? 'react-select Mui-error'
                          : 'react-select'
                      }
                      isDisabled={!data}
                      classNamePrefix='react-select'
                      value={tieneDispositivo}
                      onChange={(e) => {
                        delete errors.tieneDispositivo

                        setTieneDispositivo(e)
                      }}
                      options={optionsAdditionalData}
                      placeholder=''
                    />
                  </Colxx>
                </FormGroup>
                <FormGroup row>
                  <Colxx sm='12' lg='4'>
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className={
                        errors.ayudaConectividad
                          ? 'react-select Mui-error'
                          : 'react-select'
                      }
                      isDisabled={!data}
                      classNamePrefix='react-select'
                      name='actualizaNumeroContacto'
                      value={ayudaConectividad}
                      onChange={(e) => {
                        delete errors.ayudaConectividad
                        delete errors.numeroAyudaConectividad
                        setAyudaConectividad(e)
                      }}
                      options={optionsAdditionalDataAyuda}
                      placeholder=''
                    />
                  </Colxx>

                  <Colxx sm='12' lg='4'>
                    <InputMask
                      value={numeroAyudaConectividad}
                      mask='9999-9999'
                      name='numeroContacto'
                      onChange={(e) => {
                        delete errors.numeroAyudaConectividad
                        setNumeroAyudaConectividad(e.target.value)
                      }}
                      invalid={errors.numeroAyudaConectividad}
                      disabled={!data}
                    >
                      {(inputProps) => (
                        <Input
                          {...inputProps}
                          name='numeroContacto'
                          type='text'
                        />
                      )}
                    </InputMask>
                  </Colxx>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Colxx>
        <Colxx sm='12' className='my-3'>
          <InputWrapper>
            <CenterDiv>
              {hasAddAccess && (
                <Button
                  onClick={() => {
                    _onMatricular()
                  }}
                  color='primary'
                  size='lg'
                >
                  <IntlMessages id='Matricular' />
                </Button>
              )}
            </CenterDiv>
          </InputWrapper>
        </Colxx>
      </Row>
      <SimpleModal
        openDialog={openOptions.open}
        onClose={() => {
          toggleModal()
        }}
        title='Condición de discapacidad'
        actions={false}
      >
        <Container className='modal-detalle-subsidio'>
          <Row>
            <Col xs={12}>
              {modalOptions.map((item) => {
                return (
                  <Row
                    style={{
                      borderBottom: '1px solid',
                      marginTop: '10px',
                      paddingBottom: '10px'
                    }}
                  >
                    <Col xs={3} className='modal-detalle-subsidio-col'>
                      <OnlyVert>
                        <CustomInput
                          type='checkbox'
                          label={item.nombre}
                          inline
                          onClick={() => handleChangeItem(item)}
                          checked={item.checked}
                        />
                      </OnlyVert>
                    </Col>
                    <Col xs={9} className='modal-detalle-subsidio-col'>
                      <OnlyVert>
                        {item.descripcion
                          ? item.descripcion
                          : item.detalle
                            ? item.detalle
                            : 'Elemento sin detalle actualmente'}
                      </OnlyVert>
                    </Col>
                  </Row>
                )
              })}
            </Col>
          </Row>
          <Row>
            <CenteredRow xs='12'>
              <Button
                onClick={() => {
                  toggleModal()
                }}
                color='primary'
                outline
                className='mr-3'
              >
                Cancelar
              </Button>
              <Button
                color='primary'
                onClick={() => {
                  toggleModal(true)
                }}
              >
                Guardar
              </Button>
            </CenteredRow>
          </Row>
        </Container>
      </SimpleModal>
    </Colxx>
  )
}
const CenterDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`
const OnlyVert = styled(CenterDiv)`
  display: flex;
  width: 100%;
  justify-content: left !important;
  align-items: center;
`
const CenteredRow = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledMultiSelect = styled.div`
  &[disabled] {
    background-color: #eaeaea;
  }
`
const ItemSpan = styled.span`
  background-color: ${colors.primary};
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 15px;
`
export default FormData
