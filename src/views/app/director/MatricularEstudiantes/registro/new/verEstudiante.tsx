import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Col,
  CustomInput,
  Input,
  InputGroup,
  Row,
  Button,
  Container
} from 'reactstrap'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { getCatalogs } from 'Redux/selects/actions'
import { useActions } from 'Hooks/useActions'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import { calculateAge } from 'Utils/years'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'
import colors from 'Assets/js/colors'
import InputMask from 'react-input-mask'
import Loader from 'Components/LoaderContainer'
import { updateMatriculaWithAdditionalData } from 'Redux/matricula/actions'
import SimpleModal from 'Components/Modal/simple'
import { useTranslation } from 'react-i18next'
import {  getTiposApoyosRecibidos,getTiposApoyosNoRecibidos,getVerApoyosRecibidos,getVerApoyosNoRecibidos} from 'Redux/matricula/apoyos/actions'
import { AnyAction } from 'redux'

type FormProps = {
	data: any
	editable: any
	onEdit: any
	closeVerEstudianteModal: any
}

const optionsAdditionalData = [
  { label: 'No se ha registrado', value: 0 },
  { label: 'SI', value: 1 },
  { label: 'NO', value: 2 },
  { label: 'No logré contacto con el hogar', value: 3 }
]

const optionsAdditionalDataAyuda = [
  { label: 'No se ha registrado', value: 0 },
  { label: 'Reportar el teléfono', value: 1 },
  { label: 'No logré contacto con el hogar', value: 2 }
]
const RegistroFormPreview: React.FC<FormProps> = (props) => {
  const { t } = useTranslation()
  const {
    data,
    onEdit,
    closeVerEstudianteModal,
    hasEditAccess = true
  } = props
  const [dataForm, setDataForm] = useState<any>({})
  const [discapacidades, setDiscapacidades] = useState([])
  const [tiposApoyos, setTiposapoyos] = useState([])
	const [tiposApoyosNoRecibidos, setTiposApoyosNoRecibido] = useState([])
  const [isRefugiado, setIsRefugiado] = useState(false)
  const [isRepitente, setIsRepitente] = useState(false)
  const [isIndigena, setIsIndigena] = useState(false)
  const [conectividad, setConectividad] = useState(optionsAdditionalData[0])
  const [tieneDispositivo, setTieneDispositivo] = useState(
    optionsAdditionalData[0]
  )
  const [ayudaConectividad, setAyudaConectividad] = useState(
    optionsAdditionalDataAyuda[0]
  )
  const [numeroAyudaConectividad, setNumeroAyudaConectividad] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [openOptions, setOpenOptions] = useState(false)
  const [modalOptions, setModalOptions] = useState([])
  const [openModalApoyo, setOpenModalApoyo] = useState({ open: false })
  const [modalApoyo, setModalApoyo] = useState([])
	const [openModalApoyoNoRecibido, setOpenModalApoyoNoRecibido] = useState({ open: false })
  const [modalApoyoNoRecibido, setModalApoyoNoRecibido] = useState([])

  const actions = useActions({
    getCatalogs,
    updateMatriculaWithAdditionalData,
    getTiposApoyosRecibidos,
		getTiposApoyosNoRecibidos,
    getVerApoyosRecibidos,
    getVerApoyosNoRecibidos,
  })

  const state = useSelector((store: any) => {
    
    return {
      selects: store.selects,
      data: store.matricula.studentMatricula,
      matriculaApoyos: store.matriculaApoyos,
    }
  })
  
  const discapacidadesStore =
		state.selects[catalogsEnumObj.DISCAPACIDADES.name]
  const tiposApoyosStore = state.selects[catalogsEnumObj.TIPOSAPOYOS.name]
  const tiposApoyosNoRecibidosStore = state.selects[catalogsEnumObj.TIPOSAPOYOS.name]
  const matriculaApoyosStore = state.selects[catalogsEnumObj.TIPOSAPOYOS.name]

  React.useEffect(() => {
    const fetch = async () => {
      await actions.getCatalogs(40)
    }
    fetch()
  }, [])

  useEffect(() => {
   
    if (state.data) {
      dataParse(state.data,state.matriculaApoyos)
    }
  }, [state.data, state.matriculaApoyos])

   useEffect(() => {
		const fetch = async () => {
			debugger
			if (data) {
				await actions.getVerApoyosRecibidos(data.identidadId)
			} else {
				await actions.clearCurrentApoyosRecibidos()
			}
		}
		fetch()
	}, [data])

	useEffect(() => {
		const fetch = async () => {
			debugger
			if (data) {
				await actions.getVerApoyosNoRecibidos(data.identidadId)
			} else {
				await actions.clearCurrentApoyosNoRecibidos()
			}
		}
		fetch()
	}, [data]) 
  
  useEffect(() => {
		const _tiposApoyos = []
debugger
		if (state.matriculaApoyos.verApoyosRecibidosIdentidad) {
			const _verApoyosRecibidosIdentidad =
				state.matriculaApoyos.verApoyosRecibidosIdentidad.map(
					tipos => tipos.id
				) || []
				matriculaApoyosStore.forEach(tipos => {
				if ( _verApoyosRecibidosIdentidad.includes(tipos.id)) {
					_tiposApoyos.push(tipos)
				}
			})
		}

		setTiposapoyos(_tiposApoyos)
	}, [state.matriculaApoyos.verApoyosRecibidosIdentidad])

  
	useEffect(() => {
		const _ApoyosNoRecibidos = []

		if (state.matriculaApoyos.verApoyosNoRecibidosIdentidad) {
			const _verApoyosRecibidosNoIdentidad =
				state.matriculaApoyos.verApoyosNoRecibidosIdentidad.map(
					tipos => tipos.id
				) || []
				matriculaApoyosStore.forEach(tipos => {
				if ( _verApoyosRecibidosNoIdentidad.includes(tipos.id)) {
					_ApoyosNoRecibidos.push(tipos)
				}
			})
		}

		setTiposApoyosNoRecibido(_ApoyosNoRecibidos)
	}, [state.matriculaApoyos.verApoyosNoRecibidosIdentidad])

  const _onEdit = async () => {
    debugger
    const data = {
      id: dataForm.matriculaId,
      IdentidadesId: dataForm.id,
      esRepitente: isRepitente,
      esRefugiado: isRefugiado,
      esIndigena: isIndigena,
      DiscapacidadesId: discapacidades.map((x) => x.id),
      TiposApoyosId: tiposApoyos.map((x) => x.id),
			TiposApoyosNoRecibidosId:tiposApoyosNoRecibidos.map((x) => x.id),
      conectividad: conectividad.value,
      tieneDispositivo: tieneDispositivo.value,
      ayudaConectividad: ayudaConectividad.value,
      numeroAyudaConectividad
    }
    setLoading(true)
    const response = await onEdit(data)
    setLoading(false)
    if (response) {
      setIsEditing(false)
    }
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
    setOpenOptions(false)
  }

  const handleChangeItem = (item) => {
    const newItems = modalOptions.map((element) => {
      if (element.id === item.id) { return { ...element, checked: !element.checked } }
      return element
    })
    setModalOptions(newItems)
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
    setOpenOptions(true)
  }
// se agrega para manejar el modal Apoyos recibidos
const toggleModalTiposApoyos = (saveData = false) => {
  debugger
  let apoyos = []
  if (saveData) {
    apoyos = []
    modalApoyo.forEach(TiposApoyos => {
      if (TiposApoyos.checked) apoyos.push(TiposApoyos)
    })
    setTiposapoyos(apoyos)
  }
  setOpenModalApoyo({ open: false })
}
const handleChangeItemApoyos = item => {
  const newItemsApoyos = modalApoyo.map(element => {
    if (element.id === item.id) {
      return { ...element, checked: !element.checked }
    }
    return element
  })
  setModalApoyo(newItemsApoyos)
}
// se agrega para visualizar el modal de tipos de apoyo
const handleOpenOptionsTiposApoyos = () => {
  let _apoyos = []
  const mappedTiposApoyos = tiposApoyos.map(item => item.id)

  _apoyos = tiposApoyosStore.map(TiposApoyos => {
    if (mappedTiposApoyos.includes(TiposApoyos.id)) {
      return { ...TiposApoyos, checked: true }
    } else {
      return { ...TiposApoyos, checked: false }
    }
  })
  setModalApoyo(_apoyos)
  setOpenModalApoyo({ open: true })
}
// se agrega para manejar el modal Apoyos no recibidos
const toggleModalApoyosNoRecibidos = (saveData = false) => {
  let apoyosnorecibidos = []
  if (saveData) {
    apoyosnorecibidos = []
    modalApoyoNoRecibido.forEach(TiposApoyosNoRecibidos => {
      if (TiposApoyosNoRecibidos.checked) apoyosnorecibidos.push(TiposApoyosNoRecibidos)
    })
    setTiposApoyosNoRecibido(apoyosnorecibidos)
  }
  setOpenModalApoyoNoRecibido({ open: false })
}
const handleChangeItemApoyosNoRecibidos = item => {
  const newItems = modalApoyoNoRecibido.map(element => {
    if (element.id === item.id) {
      return { ...element, checked: !element.checked }
    }
    return element
  })
  setModalApoyoNoRecibido(newItems)
}
// se agrega para visualizar el modal de tipos de apoyo
const handleOpenOptionsApoyosNoRecibidos = () => {
  let _apoyosnorecibidos = []
  const mappedTiposApoyos = tiposApoyosNoRecibidos.map(item => item.id)

  _apoyosnorecibidos = tiposApoyosNoRecibidosStore.map(tiposApoyosNoRecibido => {
    if (mappedTiposApoyos.includes(tiposApoyosNoRecibido.id)) {
      return { ...tiposApoyosNoRecibido, checked: true }
    } else {
      return { ...tiposApoyosNoRecibido, checked: false }
    }
  })
  setModalApoyoNoRecibido(_apoyosnorecibidos)
  setOpenModalApoyoNoRecibido({ open: true })
}

  const dataParse = (data,matriculaApoyos) => {
    try {
      debugger
      const _data = {
        ...data,
        ...matriculaApoyos,
        edad: calculateAge(data.fechaNacimiento)
      }
      const datos = JSON.parse(_data.datosAdicionales)
      const _obj = {
        genero: datos.find((x) => x.CodigoCatalogo === 4),
        sexo: datos.find((x) => x.CodigoCatalogo === 3),
        tipoIdentificacion: datos.find((x) => x.CodigoCatalogo === 1),
        nacionalidad: datos.find((x) => x.CodigoCatalogo === 2)
      }
      const _discapacidades = []

      if (_data.discapacidades) {
        const _discapacidadesIdentidad = JSON.parse(
          _data.discapacidades
        ).map((discapacidad) => discapacidad.sb_elementosCatalogoId)

        discapacidadesStore.forEach((discapacidad) => {
          if (_discapacidadesIdentidad.includes(discapacidad.id)) {
            _discapacidades.push(discapacidad)
          }
        })
      }
      const _tiposApoyos = []
debugger
      if (_data.apoyosRecibidos) {
        const _tiposApoyos = JSON.parse(
          _data.apoyosRecibidos
        ).map((apoyos) => apoyos.id)

        matriculaApoyosStore.forEach((apoyos) => {
          if (_tiposApoyos.includes(apoyos.id)) {
            _tiposApoyos.push(apoyos)
          }
        })
      }
      const _tiposApoyosNoRecibidos = []

      if (_data.tiposApoyosNoRecibidos) {
        const _tiposApoyosNoRecibidos = JSON.parse(
          _data.tiposApoyosNoRecibidos
        ).map((apoyos) => apoyos.sb_elementosCatalogoId)

        tiposApoyosNoRecibidosStore.forEach((apoyos) => {
          if (_tiposApoyosNoRecibidos.includes(apoyos.id)) {
            _tiposApoyosNoRecibidos.push(apoyos)
          }
        })
      }
      setDiscapacidades(_discapacidades)
     // setTiposapoyos(_tiposApoyos)
		 // setTiposApoyosNoRecibido(_tiposApoyosNoRecibidos)
      setIsRepitente(_data.esRepitente)
      setIsRefugiado(_data.esRefugiado)
      setIsIndigena(_data.esIndigena)
      setConectividad(
        _data.conectividad
          ? optionsAdditionalData.find(
            (x) => x.value === Number(_data.conectividad)
					  )
          : optionsAdditionalData[0]
      )
      setTieneDispositivo(
        _data.tieneDispositivo
          ? optionsAdditionalData.find(
            (x) => x.value === Number(_data.tieneDispositivo)
					  )
          : optionsAdditionalData[0]
      )
      setAyudaConectividad(
        _data.ayudaConectividad
          ? optionsAdditionalDataAyuda.find(
            (x) => x.value === Number(_data.ayudaConectividad)
					  )
          : optionsAdditionalDataAyuda[0]
      )
      setNumeroAyudaConectividad(data.numeroAyudaConectividad)
      setDataForm({ ..._data, ..._obj })
    } catch (e) {
      setDataForm({})
    }
  }
  return (
    <div>
      <Form>
        {loading && <Loader />}
        <Row>
          <Col md={9}>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>tipo_id', 'Tipo de identificación')}</Label>
                  <Input
                    name='type_identification'
                    autoComplete='off'
                    readOnly
                    value={
											dataForm?.tipoIdentificacion?.Valor
										}
                  />
                </FormGroup>
              </Col>

              {dataForm?.tipoIdentificacionId === 3 && (
                <Col md={6}>
                  <FormGroup>
                    <Label>Tipo DIMEX</Label>
                    <Input
                    name='tipoDimex'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.tipoDimex?.Valor}
                  />
                  </FormGroup>
                </Col>
              )}
              {dataForm.tipoIdentificacionId != 4
                ? (
                  <Col md={6}>
                    <FormGroup>
                    <Label>
                    {t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>num_id', 'Número de identificación')}
                    {dataForm?.tipoIdentificacionId ===
												3 && ' de DIMEX'}
                  </Label>
                    <Input
                    name='identificacion'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.identificacion}
                  />
                  </FormGroup>
                  </Col>
                  )
                : (
                  <Col md={6}>
                    <FormGroup>
                    <Label>Tipo de YísRö</Label>
                    <Input
                    name='tipoYisro'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.tipoYisro?.Valor}
                  />
                  </FormGroup>
                  </Col>
                  )}
              <Col
                md={
									dataForm?.tipoIdentificacionId === 3
									  ? 12
									  : 6
								}
              >
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>nacionalidad', 'Nacionalidad')}</Label>
                  <Input
                    name='nationality'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.nacionalidad?.Valor}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>nombre', 'Nombre')}</Label>
                  <Input
                    name='nombre'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.nombre}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>primer_ap', 'Primer apellido')}</Label>
                  <Input
                    name='primerApellido'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.primerApellido}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>segundo_ap', 'Segundo apellido')}</Label>
                  <Input
                    name='segundoApellido'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.segundoApellido}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>correo_electronico', 'Correo electrónico')}</Label>
                  <Input
                    name='email'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.email}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>conocido_como', 'Conocido como')}</Label>
                  <Input
                    name='conocidoComo'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.conocidoComo}
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>sexo', 'Sexo')}</Label>
                  <Input
                    name='sexo'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.sexo?.Valor}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>identidad_genero', 'Identidad de género')}</Label>
                  <Input
                    name='genero'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.genero?.Valor}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            <Row>
              <Col md={12}>
                <PhotoContainer className='mb-3'>
                  <img
                    src={
											dataForm?.imagen
											  ? data.imagen
											  : '/assets/img/profile-pic-generic.png'
										}
                    alt='Identity register'
                  />
                </PhotoContainer>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>fecha_nacimiento', 'Fecha de nacimiento')}</Label>
                  <Input
                    name='fechaNacimiento'
                    autoComplete='off'
                    readOnly
                    value={moment(
										  dataForm?.fechaNacimiento
                  ).format('DD/MM/YYYY')}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>edad', 'Edad')}</Label>
                  <Input
                    name='edad'
                    autoComplete='off'
                    readOnly
                    value={dataForm?.edad}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col md={12}>
            <Row>
              <Col md={6}>
                <h3>
                  <span>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>condicion_discap', 'Condición de discapacidad')}</span>
                </h3>
                <StyledMultiSelect
                  isDisabled={!isEditing}
                  onClick={() => {
									  isEditing && handleOpenOptions()
                  }}
                >
                  {discapacidades.map((discapacidad) => {
									  return (
  // eslint-disable-next-line react/jsx-key
  <ItemSpan>
    {discapacidad.nombre}
  </ItemSpan>
									  )
                  })}
                </StyledMultiSelect>
              </Col>
              <Col md={6}>
                <h3>
                  <span>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>Apoyos_Rec', 'Servicio de Apoyo que recibe')}</span>
                </h3>
                <StyledMultiSelect
                  isDisabled={!isEditing}
                  onClick={() => {
									  isEditing && handleOpenOptionsTiposApoyos()
                  }}
                >
                  {tiposApoyos.map((tiposApoyos) => {
									  return (
  // eslint-disable-next-line react/jsx-key
  <ItemSpan>
    {tiposApoyos.nombre}
  </ItemSpan>
									  )
                  })}
                </StyledMultiSelect>
              </Col>
              <Col md={6}>
                <h3>
                  <span>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>Apoyos_no_rec', 'Servicio de apoyo que requiere (Pero no los recibe)')}</span>
                </h3>
                <StyledMultiSelect
                  isDisabled={!isEditing}
                  onClick={() => {
									  isEditing && handleOpenOptionsApoyosNoRecibidos()
                  }}
                >
                  {tiposApoyosNoRecibidos.map((tiposApoyosNoRecibidos) => {
									  return (
  // eslint-disable-next-line react/jsx-key
  <ItemSpan>
    {tiposApoyosNoRecibidos.nombre}
  </ItemSpan>
									  )
                  })}
                </StyledMultiSelect>
              </Col>
              <Col md={6}>
                <h3>
                  <span>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>condicion', 'Condición')}</span>
                </h3>
                <div />
                <InputGroup>
                  <CustomInput
                    type='checkbox'
                    label={t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>condicion>refugiado', 'Refugiado')}
                    name='refugee'
                    id='refugiado'
                    checked={isRefugiado}
                    onClick={() => {
										  isEditing &&
												setIsRefugiado(!isRefugiado)
                  }}
                    inline
                  />
                  <CustomInput
                    type='checkbox'
                    label={t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>condicion>repitente', 'Repitente')}
                    name='repeating'
                    checked={isRepitente}
                    onClick={() =>
										  isEditing &&
											setIsRepitente(!isRepitente)}
                    inline
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row className='mt-2'>
              <Col md={6}>
                <h3>
                  <span>{t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>datos_adic_req', 'Datos adicionales requerido')}</span>
                </h3>
                <Row>
                  <Col md={12}>
                    <Label className='form-group has-top-label'>
                    {t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>datos_adic_req>texto', 'El estudiante tiene acceso a conectividad de internet en su hogar')}
                  </Label>
                    <Select
                    components={{
											  Input: CustomSelectInput
                  }}
                    className='react-select'
                    classNamePrefix='react-select'
                    name='accesoInternet'
                    value={conectividad}
                    onChange={(e) => {
											  setConectividad(e)
                  }}
                    isDisabled={!isEditing}
                    options={optionsAdditionalData.filter(
											  (x) => x.value > 0
                  )}
                    placeholder=''
                  />
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Label className='form-group has-top-label'>
                    {t('estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>datos_adic_req>texto2', 'El estudiante tiene acceso a un dispositivo que le permita recibir clases')}
                  </Label>
                    <Select
                    components={{
											  Input: CustomSelectInput
                  }}
                    className='react-select'
                    classNamePrefix='react-select'
                    value={tieneDispositivo}
                    onChange={(e) => {
											  setTieneDispositivo(e)
                  }}
                    isDisabled={!isEditing}
                    options={optionsAdditionalData.filter(
											  (x) => x.value > 0
                  )}
                    placeholder=''
                  />
                  </Col>
                </Row>
                
              </Col>
              <Col md={6}>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className='react-select mb-2'
                  classNamePrefix='react-select'
                  name='actualizaNumeroContacto'
                  value={ayudaConectividad}
                  onChange={(e) => {
									  setAyudaConectividad(e)
                  }}
                  isDisabled={!isEditing}
                  options={optionsAdditionalDataAyuda.filter(
									  (x) => x.value > 0
                  )}
                  placeholder=''
                />
                <InputMask
                  value={numeroAyudaConectividad}
                  mask='9999-9999'
                  name='numeroContacto'
                  disabled={
										!isEditing ||
										ayudaConectividad.value === 2
									}
                  onChange={(e) => {
									  setNumeroAyudaConectividad(
									    e.target.value
									  )
                  }}
                >
                  {(inputProps) => (
                    <Input
                    {...inputProps}
                    disabled={
												!isEditing ||
												ayudaConectividad.value === 2
											}
                    name='numeroContacto'
                    type='text'
                  />
                  )}
                </InputMask>
                <br />                
                
								<InputGroup>
									<CustomInput
										type='checkbox'
										label={t(
                      'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>datos_adic_req>texto3',
											'La persona estudiante es indígena'
										)}
										name='indigenous'
										id='indigena'
										checked={isIndigena}
										onClick={() => {
                      isEditing &&
											setIsIndigena(!isIndigena)
										}}
										inline
									/>															
								</InputGroup>
              </Col>
            </Row>  
          </Col>
        </Row>
        <Row className='mt-3'>
          <CenteredCol md='12'>
            <Button
              onClick={() => closeVerEstudianteModal()}
              color='primary'
              outline
              className='mr-3'
            >
              {t('boton>general>cancelar', 'Cancelar')}
            </Button>
            {hasEditAccess && (
              <Button
                color='primary'
                onClick={() =>
								  isEditing ? _onEdit() : setIsEditing(true)}
                disabled={loading}
              >
                {!isEditing ? t('boton>general>editar', 'Editar') : 'Guardar'}
              </Button>
            )}
          </CenteredCol>
        </Row>
      </Form>
      <SimpleModal
        openDialog={openOptions}
        onClose={() => toggleModal()}
        actions={false}
        title='Tipos de discapacidades'
      >
        <Container className='modal-detalle-subsidio'>
          <Row>
            <Col xs={12}>
              {modalOptions.map((item) => {
							  return (           
                  
                  <Row>
                  <Col
                    xs={3}
                    className='modal-detalle-subsidio-col'
                  >
                    <div>
                      <CustomInput
                        type='checkbox'
                        label={item.nombre}
                        inline
                        onClick={() =>
                                          handleChangeItem(item)}
                        checked={item.checked}
                      />
                    </div>
                  </Col>
                  <Col
                    xs={9}
                    className='modal-detalle-subsidio-col'
                  >
                    <div>
                      <p>
                        {item.descripcion
                                          ? item.descripcion
                                          : item.detalle
                                            ? item.detalle
                                            : 'Elemento sin detalle actualmente'}
                      </p>
                    </div>
                  </Col>
                </Row>)
              })}
            </Col>
          </Row>
          <Row>
            <CenteredCol xs='12'>
              <Button
                onClick={() => {
								  toggleModal()
                }}
                color='primary'
                outline
                className='mr-3'
              >
                {t('boton>general>cancelar', 'Cancelar')}
              </Button>
              <Button
                color='primary'
                onClick={() => {
								  toggleModal(true)
                }}
              >
                {t('boton>general>guardar', 'Guardar')}
              </Button>
            </CenteredCol>
          </Row>
        </Container>
      </SimpleModal>

      <SimpleModal
        openDialog={openModalApoyo.open}
        onClose={() => toggleModalTiposApoyos()}
        actions={false}
        title='Servicio de apoyo que recibe'
      >
        <Container className='modal-detalle-subsidio'>
          <Row>
            <Col xs={12}>
              {modalApoyo.map((item) => {
							  return (           
            <Row>
              <Col
                xs={3}
                className='modal-detalle-subsidio-col'
              >
                <div>
                  <CustomInput
                    type='checkbox'
                    label={item.nombre}
                    inline
                    onClick={() =>
                                      handleChangeItemApoyos(item)}
                    checked={item.checked}
                  />
                </div>
              </Col>
              <Col
                xs={9}
                className='modal-detalle-subsidio-col'
              >
                <div>
                  <p>
                    {item.descripcion
                                      ? item.descripcion
                                      : item.detalle
                                        ? item.detalle
                                        : 'Elemento sin detalle actualmente'}
                  </p>
                </div>
              </Col>
            </Row>
							  )
              })}
            </Col>
          </Row>
          <Row>
            <CenteredCol xs='12'>
              <Button
                onClick={() => {
								  toggleModalTiposApoyos()
                }}
                color='primary'
                outline
                className='mr-3'
              >
                {t('boton>general>cancelar', 'Cancelar')}
              </Button>
              <Button
                color='primary'
                onClick={() => {
								  toggleModalTiposApoyos(true)
                }}
              >
                {t('boton>general>guardar', 'Guardar')}
              </Button>
            </CenteredCol>
          </Row>
        </Container>
      </SimpleModal>

      <SimpleModal
        openDialog={openModalApoyoNoRecibido.open}
        onClose={() => toggleModalApoyosNoRecibidos()}
        actions={false}
        title='Servicio de apoyo que requiere (Pero no lo recibe)'
      >
        <Container className='modal-detalle-subsidio'>
          <Row>
            <Col xs={12}>
              {modalApoyoNoRecibido.map((item) => {
							  return (
            
            <Row>
              <Col
                xs={3}
                className='modal-detalle-subsidio-col'
              >
                <div>
                  <CustomInput
                    type='checkbox'
                    label={item.nombre}
                    inline
                    onClick={() =>
                                      handleChangeItemApoyosNoRecibidos(item)}
                    checked={item.checked}
                  />
                </div>
              </Col>
              <Col
                xs={9}
                className='modal-detalle-subsidio-col'
              >
                <div>
                  <p>
                    {item.descripcion
                                      ? item.descripcion
                                      : item.detalle
                                        ? item.detalle
                                        : 'Elemento sin detalle actualmente'}
                  </p>
                </div>
              </Col>
            </Row>
							  )
              })}
            </Col>
          </Row>
          <Row>
            <CenteredCol xs='12'>
              <Button
                onClick={() => {
								  toggleModalApoyosNoRecibidos()
                }}
                color='primary'
                outline
                className='mr-3'
              >
                {t('boton>general>cancelar', 'Cancelar')}
              </Button>
              <Button
                color='primary'
                onClick={() => {
								  toggleModalApoyosNoRecibidos(true)
                }}
              >
                {t('boton>general>guardar', 'Guardar')}
              </Button>
            </CenteredCol>
          </Row>
        </Container>
      </SimpleModal>
    </div>
  )
}
const StyledMultiSelect = styled.div<{ isDisabled }>`
	min-height: 100px;
	border: 1px solid #eaeaea;
	padding: 0.35rem;
	color: #fff;
	${(props) => props.isDisabled && 'background-color: #eaeaea;'}
`
const CenteredCol = styled(Col)`
	display: flex;
	justify-content: center;
	align-items: center;
`
const PhotoContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 200px;
	min-width: 200px;
	height: 200px;
	border-radius: 100px;
	background: #c3c3c3;
	overflow: hidden;
	img {
		width: 100%;
	}
`
const Form = styled.form`
	margin-bottom: 20px;
`
const FormGroup = styled.div`
	margin-bottom: 10px;
	position: relative;
`
const Label = styled.label`
	color: #000;
	display: block;
`
const ItemSpan = styled.span`
	background-color: ${colors.primary};
	padding-left: 8px;
	padding-right: 8px;
	border-radius: 15px;
`
export default RegistroFormPreview