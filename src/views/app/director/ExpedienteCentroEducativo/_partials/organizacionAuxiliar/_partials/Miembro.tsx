import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { EditButton } from 'Components/EditButton'
import LoaderContainer from 'Components/LoaderContainer'
import { compareAsc, parse } from 'date-fns'
import IntlMessages from 'Helpers/IntlMessages'
import { useActions } from 'Hooks/useActions'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Button,
  Row
} from 'reactstrap'
import { getCatalogsByCode } from 'Redux/selects/actions'
import styled from 'styled-components'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'
import RequiredLabel from '../../../../../../../components/common/RequeredLabel'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import SimpleModal from 'Components/Modal/simple'
import {
  getMemberData,
  setMemberData
} from '../../../../../../../redux/institucion/actions'
import { catalogsEnumObj } from '../../../../../../../utils/catalogsEnum'
import Loader from 'Components/LoaderContainer'

import ReactInputMask from 'react-input-mask'

const MiembroOrganizacionAuxiliar = (props) => {
  const { t } = useTranslation()

  const { onlyView } = props
  const state = useSelector((store: any) => {
    return {
      selects: store.selects,
      currentMember: store.institucion.currentMember
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    errors,
    reset,
    clearErrors,
    watch,
    control
  } = useForm()

  const actions = useActions({
    getMemberData,
    setMemberData,
    getCatalogsByCode
  })
  const lstTypeId = state.selects[catalogsEnumObj.IDENTIFICATION.name]

  const lstNacionalidadesId =
		state.selects[catalogsEnumObj.NATIONALITIES.name]

  const lstPuestos = state.selects[catalogsEnumObj.PUESTOS.name]

  const lstEstados =
		state.selects[catalogsEnumObj.ESTADOSORGANIZACIONAUXILIAR.name]
  console.log(lstEstados, 'LSTESTADOS')
  const [modal, setModal] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [loader, setLoader] = useState(false)
  const [typeId, setTypeId] = useState(lstTypeId[0])
  const [isDead, setIsDead] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const [identification, setIdentification] = useState(null)

  const [nationalitiesOptions, setNationalitiesOptions] = useState(
    state.selects[catalogsEnumObj.NATIONALITIES.name].filter(
      (n) => n.codigo != 15
    )
  )
  const tipoIdentification = watch('tipoIdentificacionId')

  useEffect(() => {
    const fetchData = async () => {
      await actions.getCatalogsByCode(
        catalogsEnumObj?.ESTADOSORGANIZACIONAUXILIAR?.type
      )
    }
    fetchData()
    // register('estadoMiembroId')
  }, [])

  useEffect(() => {
    if (tipoIdentification == 1) {
      const _lstNacionalidadesId = lstNacionalidadesId.filter(
        (n) => n.codigo == 15
      )
      setNationalitiesOptions(_lstNacionalidadesId)
      setValue('nacionalidadId', _lstNacionalidadesId[0]) // nacionalidadId
    } else {
      const _lstNacionalidadesId = lstNacionalidadesId.filter(
        (n) => n.codigo != 15
      )
      setNationalitiesOptions(_lstNacionalidadesId)
    }
  }, [tipoIdentification])

  useEffect(() => {
    if (state.currentMember?.identidadId) {
      const _typeId = lstTypeId.find(
        (x) => x.id == state.currentMember.tipoIdentificacionId
      )
      const _nacionalidad = lstNacionalidadesId.find(
        (x) => x.id == state.currentMember.nacionalidadId
      )
      const _puesto = lstPuestos.find(
        (x) => x.id == state.currentMember.puestoId
      )
      const _estadoMiembro = lstEstados.find(
        (x) => x.id == state.currentMember.estadoMiembroId
      )

      setValue('identificacion', state.currentMember.identificacion)
      setValue('tipoIdentificacionId', _typeId)
      setValue('nacionalidadId', _nacionalidad) // nacionalidadId
      setValue('estadoMiembro', _estadoMiembro) // nacionalidadId
      setValue('puestoId', _puesto)

      setValue('nombre', state.currentMember.nombre)
      setValue('primerApellido', state.currentMember.primerApellido)
      setValue('segundoApellido', state.currentMember.segundoApellido)
      setValue('rige', state.currentMember.rige)
      setValue('vence', state.currentMember.vence)
    } else {
      reset()
    }

    clearErrors()
  }, [state.currentMember, props.editableMiembro])

  const findPerson = async (value) => {
    setIdentification(value)
    setLoader(true)
    let response = null
    if (value && typeId) {
      const idType = lstTypeId.find((item) => {
        return item.id == typeId.id
      })

      if (idType.codigo == '01' && value.length == 9) {
        response = await actions.getMemberData(value)
      }
      if (idType.codigo == '03' && value.length == 12) {
        response = await actions.getMemberData(value)
      }
      if (idType.codigo == '04' && value.length >= 12) {
        response = await actions.getMemberData(value)
      }
      setLoader(false)

      if (!response.error) {
        setIsDead(response.data.esFallecido)
        setNotFound(!response.data.identificacion)
      }
    }
  }

  const toInputUppercase = (e) => {
    e.target.value = ('' + e.target.value).toUpperCase()
  }

  const guardarNuevaPersona = async (user) => {
    await actions.setMemberData(user)
    setModal(false)
  }

  return (
    <>
      <Form onSubmit={handleSubmit(props.sendMemberData, (data) => alert('FORM LANZA ERROR'))}>
        <NavigationContainer
          onClick={(e) => {
					  props.toggleAddNewModal()
          }}
        >
          <ArrowBackIosIcon />
          <h4>
            <IntlMessages id='pages.go-back-home' />
          </h4>
        </NavigationContainer>
        <Row>
          {!state.currentMember?.identidadId && (
            <Col md={6} xs={12}>
              <Card>
                <CardBody>
                  <FormGroup>
                    <p style={{ margin: 0 }}>
                    Busca persona
											<br />
                    Busca la persona a la cual se le
                    creara el usuario.
											<br />
                    Si no está registrada. podrás
                    registrarla
										</p>
                    <RequiredLabel>
                    Tipo de identificación
										</RequiredLabel>
                    <Select
                    className='react-select'
                    classNamePrefix='react-select'
                    options={lstTypeId}
                    onChange={(value) => {
											  setTypeId(value)
                  }}
                    value={typeId}
                    getOptionLabel={(option: any) =>
											  option.nombre}
                    getOptionValue={(option: any) =>
											  option.id}
                    components={{
											  Input: CustomSelectInput
                  }}
                    styles={{
											  menuPortal: (base) => ({
											    ...base,
											    position: 'relative',
											    zIndex: 999
											  })
                  }}
                  />
                  </FormGroup>
                  <FormGroup>
                    <RequiredLabel>
                    Identificación
										</RequiredLabel>
                    <ReactInputMask
                    mask={
												typeId?.id === 1
												  ? '999999999' // 9
												  : typeId?.id === 3
												    ? '999999999999' // 12
												    : typeId?.id === 4?'YR9999-99999':'99999999999999999999'
											}
                    type='text'
                    maskChar={null}
                    value={identification}
                    onChange={(e) => {
											  const { value } = e.target
											  findPerson(value)
                  }}
                  >
                    {(inputProps) => (
                    <Input {...inputProps} />
                  )}
                  </ReactInputMask>
                  </FormGroup>

                  {notFound && (
                    <ServantNotFound>
                    <Label>
                    No se ha encontrado un
                    funcionario con el número de
                    identificación ingresado.
											</Label>
                    <Label>
                    Puede registrarlo en SABER
                    haciendo click en registrar.
											</Label>
                    <div
                    style={{ textAlign: 'center' }}
                  >
                    <Button
                    color='primary'
                    onClick={() =>
													  setModal(true)}
                  >
  Registrar
                  </Button>
                  </div>
                  </ServantNotFound>
                  )}
                  {isDead && (
                    <ServantNotFound>
                    <Label>
                    La persona se encuentra
                    registrado como fallecida.
											</Label>
                  </ServantNotFound>
                  )}
                  {loader && <Loader />}
                </CardBody>
              </Card>
            </Col>
          )}
          {state.currentMember?.identidadId && (
            <Col md={6} xs={12}>
              <Card>
                <CardBody>
                  <CardTitle tag='h4'>
                    {props.esPrivado
										  ? 'Representante legal'
										  : 'Miembros de la junta'}
                  </CardTitle>
                  <Row>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel>
                    Tipo de identificación
												</RequiredLabel>
                    <Controller
                    control={control}
                    name='tipoIdentificacionId'
                    rules={{ required: true }}
                    styles={{
													  menuPortal: (base) => ({
													    ...base,
													    position:
																'relative',
													    zIndex: 999
													  })
                  }}
                    as={
                    <Select
                    className='react-select'
                    classNamePrefix='react-select'
                    options={lstTypeId}
                    getOptionLabel={(
															  option: any
                  ) => option.nombre}
                    getOptionValue={(
															  option: any
                  ) => option.id}
                    components={{
															  Input: CustomSelectInput
                  }}
                    isDisabled
                  />
													}
                  />
                    {errors.tipoIdentificacionId && (
                    <FormFeedback>
                    Este campo es requerido
													</FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel>
                    Identificación
												</RequiredLabel>
                    <Input
                    invalid={
														errors.identificacion
													}
                    disabled
                    type='text'
                    name='identificacion'
                    innerRef={register({
													  required: true
                  })}
                  />
                    {errors.identificacion && (
                    <FormFeedback>
                    Este campo es requerido
													</FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                  </Row>
                  <Row>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel>
                    Nacionalidad
												</RequiredLabel>
                    <Controller
                    control={control}
                    name='nacionalidadId'
                    rules={{ required: true }}
                    styles={{
													  menuPortal: (base) => ({
													    ...base,
													    position:
																'relative',
													    zIndex: 999
													  })
                  }}
                    as={
                    <Select
                    className='react-select'
                    classNamePrefix='react-select'
                    components={{
															  Input: CustomSelectInput
                  }}
                    isDisabled
                    options={
																nationalitiesOptions
															}
                    getOptionLabel={(
															  option: any
                  ) => option.nombre}
                    getOptionValue={(
															  option: any
                  ) => option.id}
                  />
													}
                  />

                    {errors.nacionalidadId && (
                    <FormFeedback>
                    Este campo es requerido
													</FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel for='estadoMiembro'>
                    Estado
												</RequiredLabel>
                    <Controller
                    control={control}
                    name='estadoMiembro'
                    rules={{ required: true }}
                    styles={{
													  menuPortal: (base) => ({
													    ...base,
													    position:
																'relative',
													    zIndex: 999
													  })
                  }}
                    as={
                    <Select
                    className='react-select'
                    classNamePrefix='react-select'
                    components={{
															  Input: CustomSelectInput
                  }}
                    isDisabled={
																!props.editableMiembro
															}
                    options={lstEstados}
                    getOptionLabel={(
															  option: any
                  ) => option.nombre}
                    getOptionValue={(
															  option: any
                  ) => option.id}
                  />
													}
                  />
                    {errors.miembroActivo && (
                    <FormFeedback>
                    Este campo es requerido
													</FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                  </Row>
                  <Row>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel for='tipoIdentificacionId'>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>tipo_identificacion', 'Tipo de identificación')}
                  </RequiredLabel>
                    <Input
                    type='select'
                    invalid={
												errors.tipoIdentificacionId
											}
                    readOnly={
												!props.editableMiembro ||
												state.currentMember.id
											}
                    name='tipoIdentificacionId'
                    value={data.tipoIdentificacionId}
                    onChange={handleChange}
                    innerRef={register({
											  required: true
                  })}
                  >
                    <option>{t('general>seleccionar', 'Seleccionar')}</option>
                    {state.selects[
											  catalogsEnumObj.IDENTIFICATION
											    .name
                  ].map((item) => {
											  if (item.codigo !== '04') {
											    return (
  <option value={item.id}>
    {item.nombre}
  </option>
											    )
											  }
                  })}
                  </Input>
                    {errors.tipoIdentificacionId && (
                    <FormFeedback>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>requerido', 'Este campo es requerido')}
                  </FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel for='nacionalidadId'>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>nacionalidad', 'Nacionalidad')}
                  </RequiredLabel>
                    <Input
                    type='select'
                    invalid={errors.nacionalidadId}
                    readOnly={
												!props.editableMiembro ||
												state.currentMember.id
											}
                    name='nacionalidadId'
                    value={data.nacionalidadId}
                    onChange={handleChange}
                    innerRef={register({
											  required: true
                  })}
                  >
                    <option>{t('general>seleccionar', 'Seleccionar')}</option>
                    {nationalitiesOptions.map(
											  (item) => {
											    return (
  <option value={item.id}>
    {item.nombre}
  </option>
											    )
											  }
                  )}
                  </Input>
                    {errors.nacionalidadId && (
                    <FormFeedback>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>requerido', 'Este campo es requerido')}
                  </FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                  </Row>
                  <Row>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel for='identificacion'>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>identificacion', 'Identificación')}
                  </RequiredLabel>
                    <Input
                    invalid={errors.identificacion}
                    type='text'
                    name='identificacion'
                    readOnly={
												(!props.editableMiembro &&
													data.identificacion) ||
												state.currentMember.id ||
												!data.nacionalidadId ||
												!data.tipoIdentificacionId
											}
                    value={data.identificacion}
                    onChange={(e) => {
											  const { value } = e.target
											  handleIdChange(value)
                  }}
                    innerRef={register({
											  required: true
                  })}
                  />
                    {errors.identificacion && (
                    <FormFeedback>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>requerido', 'Este campo es requerido')}
                  </FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel for='estadoMiembro'>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>estado', 'Estado')}
                  </RequiredLabel>
                    <Input
                    type='select'
                    invalid={errors.estadoMiembro}
                    name='estadoMiembro'
                    onChange={handleChange}
                    value={data.estadoMiembro}
                    readOnly={!state.currentMember.id}
                    innerRef={register({
											  required: true
                  })}
                  >
                    {state.selects[
											  catalogsEnumObj
											    .ESTADOSORGANIZACIONAUXILIAR
											    .name
                  ]?.map((el) => (
                  <option
                  value={el?.nombre}
                  disabled={
														!state.currentMember.id
													}
                  key={el?.codigo}
                >
                  {el?.nombre}
                </option>
                  ))}
                  </Input>
                    {errors.miembroActivo && (
                    <FormFeedback>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>requerido', 'Este campo es requerido')}
                  </FormFeedback>
                  )}
                    {errors.estadoMiembro && (
                    <FormFeedback>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>requerido', 'Este campo es requerido')}
                  </FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                  </Row>
                  <Row>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel for='nombre'>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>nombre', 'Nombre')}
                  </RequiredLabel>

                    <Input
                    type='text'
                    name='nombre'
                    readOnly={isNational}
                    invalid={errors.nombre}
                    value={data.nombre}
                    onChange={handleChange}
                    onInput={toInputUppercase}
                    innerRef={register({
											  required: true
                  })}
                  />
                    {errors.nombre && (
                    <FormFeedback>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>requerido', 'Este campo es requerido')}
                  </FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel for='primerApellido'>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>primer_apellido', 'Primer apellido')}
                  </RequiredLabel>
                    <Input
                    type='text'
                    name='primerApellido'
                    readOnly={isNational}
                    invalid={errors.primerApellido}
                    value={data.primerApellido}
                    onChange={handleChange}
                    onInput={toInputUppercase}
                    innerRef={register({
											  required: true
                  })}
                  />
                    {errors.primerApellido && (
                    <FormFeedback>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>requerido', 'Este campo es requerido')}
                  </FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                  </Row>
                  <Row>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <br />
                    <Label>{t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>segundo_apellido', 'Segundo apellido')}</Label>

                    <Input
                    type='text'
                    name='segundoApellido'
                    readOnly={isNational}
                    value={data.segundoApellido}
                    onInput={toInputUppercase}
                    onChange={handleChange}
                    innerRef={register}
                  />
                  </FormGroup>
                  </Col>
                    <Col md={6} xs={12}>
                    {!props.esPrivado
                    ? (
                    <FormGroup>
                    <RequiredLabel for='puestoId'>
                    {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>puesto', 'Puesto')}
                  </RequiredLabel>
                    <Input
                    type='select'
                    name='puestoId'
                    invalid={errors.puestoId}
                    readOnly={
													!props.editableMiembro
												}
                    value={data.puestoId}
                    onChange={handleChange}
                    innerRef={register({
												  required: true
                  })}
                  >
                    <option
                    disabled={
														!props.editableMiembro
													}
                  />
                    {state.selects[
												  catalogsEnumObj.PUESTOS.name
                  ].map((item) => {
												  return (
  <option
    disabled={
																!props.editableMiembro
															}
    value={item.id}
  >
    {item.nombre}
  </option>
												  )
                  })}
                  </Input>
                    {errors.puestoId && (
                    <FormFeedback>
                    Este campo es requerido
      </FormFeedback>
                  )}
                  </FormGroup>
                      )
                    : null}
                  </Col>
                  </Row>
                  {!props.esPrivado
                    ? (
                    <Row>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel for='rige'>
                    Rige
        </RequiredLabel>
                    <Input
                    type='date'
                    invalid={errors.rige}
                    readOnly={
															!props.editableMiembro
														}
                    name='rige'
                    innerRef={register({
														  required: true
                  })}
                  />
                    {errors.rige && (
                    <FormFeedback>
                    Este campo es
                    requerido
          </FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                    <Col md={6} xs={12}>
                    <FormGroup>
                    <RequiredLabel for='vence'>
                    Vence
        </RequiredLabel>
                    <Input
                    type='date'
                    invalid={
															errors.vence
														}
                    readOnly={
															!props.editableMiembro
														}
                    name='vence'
                    innerRef={register({
														  required: true,
														  validate: {
														    validDate: (
														      value
														    ) => {
														      return (
														        compareAsc(
														          parse(
														            value,
														            'yyyy-MM-dd',
														            new Date()
														          ),
														          parse(
														            watch(
														              'rige'
														            ),
														            'yyyy-MM-dd',
														            new Date()
														          )
														        ) > 0
														      )
														    }
														  }
                  })}
                  />
                    {errors.vence &&
														errors.vence
														  ?.type ===
															'required' && (
  <FormFeedback>
    Este campo es
    requerido
  </FormFeedback>
                  )}
                    {errors.vence &&
														errors.vence
														  ?.type ===
															'validDate' && (
  <FormFeedback>
    La fecha Vence
    no puede ser
    menor a la fecha
    Rige, favor
    corregir
  </FormFeedback>
                  )}
                  </FormGroup>
                  </Col>
                    <br />
                  </Row>
                      )
                    : null}
                  {!onlyView &&
										props.editableMiembro !== undefined && (
  <Row>
    <Col
      xs={12}
      md={12}
      style={{
													  textAlign: 'center'
      }}
    >
      <EditButton
        editable={
															props?.editableMiembro
														}
        setEditable={
															props?.setEditableMiembro
														}
      />
    </Col>
  </Row>
                  )}
                  <br />
                </CardBody>
                {props.loadingMiembro
                  ? (
                    <LoaderContainer />
                    )
                  : null}
              </Card>
            </Col>
          )}
        </Row>
      </Form>
      <SimpleModal
        openDialog={modal}
        onClose={() => setModal(false)}
        actions={false}
        title='Registrar persona'
      >
        <WizardRegisterIdentityModal onConfirm={guardarNuevaPersona} />
      </SimpleModal>
    </>
  )
}

const NavigationContainer = styled.span`
	display: flex;
	margin-top: 5px;
	margin-bottom: 5px;
	cursor: pointer;
`
const ServantNotFound = styled.div`
	background: rgba(16, 158, 257, 0.3);
	padding: 1rem;
	border-radius: 10px;
	margin-top: 1rem;
`

export default MiembroOrganizacionAuxiliar
