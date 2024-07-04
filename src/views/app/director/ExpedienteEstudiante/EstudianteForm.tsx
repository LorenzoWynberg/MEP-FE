import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, CustomInput } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

import { UsuarioRegistro } from '../../../../types/usuario'
import { calculateAge } from '../../../../utils/years'
import { mapOption } from 'Utils/mapeoCatalogos'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import StyledMultiSelect from '../../../../components/styles/StyledMultiSelect'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useTranslation } from 'react-i18next'
//import { getVerApoyosRecibidos,getVerApoyosNoRecibidos} from 'Redux/matricula/apoyos/actions'


type FormProps = {
	title: string
	subtitle?: string
	user?: UsuarioRegistro
	disabled?: boolean
	toggleEdit?: Function
	handleUpdate?: Function
}

type IState = {
	selects: any
}

const EstudianteForm: React.FC<FormProps> = (props) => {
  
  const [direccionData, setDireccionData] = useState([])
  const [datos, setDatos] = useState({})
  const [t] = useTranslation()
  const [datosMatricula, setDatosMatricula] = useState({})

  useEffect(() => {
    debugger
    const direction = props.user.direcciones.find((el) => !el.temporal)
    const loadData = async () => {
      try {
        debugger
        const province = await axios.get(
					`${envVariables.BACKEND_URL}/api/Provincia/GetById/${direction.provinciasId}`
        )
        const canton = await axios.get(
					`${envVariables.BACKEND_URL}/api/Canton/GetById/${direction.cantonesId}`
        )
        const distrito = await axios.get(
					`${envVariables.BACKEND_URL}/api/Distrito/GetById/${direction.provinciasId}`
        )
        const datosEducaivos = await axios.get(
					`${envVariables.BACKEND_URL}/api/Matricula/GetDatosEducativos/${props.user.id}`
        )
       
        // actions.getRolesByUserId(props.match.params.studentId)
        setDatos(
          datosEducaivos.data[datosEducaivos.data.length - 1] || {}
        )
        
        setDireccionData([
          province.data?.nombre,
          canton.data?.nombre,
          distrito.data?.nombre
        ])
      } catch (err) {
        setDireccionData(['Sin definir', 'Sin definir', 'Sin definir'])
      }
    }

    if (direction) {
      loadData()
    }
  }, [props.user])
  useEffect(() => {
    
    const loadData = async () => {
      try {
                
        const datosAdicionales = await axios.get(
					`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Expediente/GetDatosAdicionalesMatricula/${props.user.id}`
        )
        
        setDatosMatricula([
          datosAdicionales.data?.esIndigena,
          datosAdicionales.data?.estadoMatricula
          
        ])
       
      } catch (err) {
        setDireccionData(['Sin definir', 'Sin definir', 'Sin definir'])
      }
    }

     {
      loadData()
    }
  }, [props.user])
  const currentUser = props.user
  const adicionales = props.user.datos

  const { register, control, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      nombre: `${props.user?.nombre} ${props.user.primerApellido} ${props.user.segundoApellido}`,
      primerApellido: props.user.primerApellido,
      segundoApellido: props.user.segundoApellido,
      conocidoComo: props.user.conocidoComo || '',
      fechaNacimiento: props.user.fechaNacimiento
        ? moment(props.user.fechaNacimiento).toDate()
        : new Date(),
      sexo: currentUser.sexo,
      edad: calculateAge(
        props.user.fechaNacimiento
          ? props.user.fechaNacimiento
          : new Date()
      )
    }
  })

  const selects = useSelector((state: IState) => state.selects)

  const typeId = adicionales
    ? mapOption(
      adicionales,
      selects,
      catalogsEnumObj.IDENTIFICATION.id,
      catalogsEnumObj.IDENTIFICATION.name
		  )
    : {}
  const nacionalidad = adicionales
    ? mapOption(
      adicionales,
      selects,
      catalogsEnumObj.NATIONALITIES.id,
      catalogsEnumObj.NATIONALITIES.name
		  )
    : {}
  const gender = adicionales
    ? mapOption(
      adicionales,
      selects,
      catalogsEnumObj.GENERO.id,
      catalogsEnumObj.GENERO.name
		  )
    : 0

  const estadoCivil = mapOption(
    adicionales,
    selects,
    catalogsEnumObj.ESTADOCIVIL.id,
    catalogsEnumObj.ESTADOCIVIL.name
  )

  const etnia = mapOption(
    adicionales,
    selects,
    catalogsEnumObj.ETNIAS.id,
    catalogsEnumObj.ETNIAS.name
  )

  const lenguaIndigena = mapOption(
    adicionales,
    selects,
    catalogsEnumObj.LENGUASINDIGENAS.id,
    catalogsEnumObj.LENGUASINDIGENAS.name
  )

  const lenguaMaterna = mapOption(
    adicionales,
    selects,
    catalogsEnumObj.LENGUAMATERNA.id,
    catalogsEnumObj.LENGUAMATERNA.name
  )


  

  var tipoId = props.user?.datos?.find(el=>el.catalogoId == 1)
  const TIPO_IDENTIFICACION =  selects.idTypes.find(x=>x.id == tipoId?.elementoId);
  debugger
  return (
    <Wrapper>
      <Helmet>Ficha informativa</Helmet>

      <Card className='bg-white__radius'>
        <Row>
          <Col md={6} xs='12'>
            <CardTitle>{t('estudiantes>buscador_per>info_gen>la_persona', 'La persona')}</CardTitle>
            <Form>
              <Row>
                <Col
                  md={5}
                  className='d-flex align-items-center justify-content-center'
                >
                  <Avatar
                    src={
											!props.user.fotografiaUrl
											  ? '/assets/img/profile-pic-generic.png'
											  : props.user.fotografiaUrl
										}
                    alt='Profile picture'
                  />
                </Col>
                <Col md={7}>
                  <FormGroup>
                    <Label>{t('estudiantes>buscador_per>info_gen>tipo_id', 'Tipo de identificación')}</Label>

                    <Input
                    name='idTypes'
                    value={TIPO_IDENTIFICACION?.nombre}
                    readOnly
                  />
                  </FormGroup>
                  <FormGroup>
                    <Label>{t('estudiantes>buscador_per>info_gen>num_id', 'Número de identificación')}</Label>
                    <Input
                    name='identificacion'
                    ref={register({ required: false })}
                    readOnly
                    value={props.user.identificacion}
                  />
                  </FormGroup>
                  <FormGroup>
                    <Label>{t('estudiantes>buscador_per>info_gen>nacionalidad', 'Nacionalidad')}</Label>

                    <Input
                    name='nationality'
                    readOnly
                    value={nacionalidad?.nombre}
                  />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label>{t('estudiantes>buscador_per>info_gen>nombre_completo', 'Nombre completo')}</Label>
                <Input
                  name='nombre'
                  autoComplete='off'
                  ref={register({ required: false })}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <Label>{t('estudiantes>buscador_per>info_gen>conocido', 'Conocido como')}</Label>
                <Input
                  name='conocidoComo'
                  autoComplete='off'
                  ref={register({ required: false })}
                  readOnly
                />
              </FormGroup>
              <Row>
                <Col md={6}>
                  <Label>{t('estudiantes>buscador_per>info_gen>fecha_naci', 'Fecha de nacimiento')}</Label>
                  <Controller
                    control={control}
                    name='fechaNacimiento'
                    rules={{ required: false }}
                    onChange={([selected]) =>
										  setValue(
										    'fechaNacimiento',
										    selected
										  )}
                    placeholderText=''
                    render={({
										  onChange,
										  onBlur,
										  value
                  }) => (
                  <DatePicker
                  dateFormat='dd/MM/yyyy'
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  minDate={new Date(1940, 0, 1)}
                  maxDate={new Date(2002, 0, 1)}
                  dropdownMode='select'
                  placeholderText='Seleccione fecha de nacimiento'
                  locale='es'
                  onChange={onChange}
                  onBlur={onBlur}
                  selected={value}
                  disabled
                />
                  )}
                  />
                </Col>
                <Col md={6}>
                  <Label>{t('estudiantes>buscador_per>info_gen>edad', 'Edad')}</Label>
                  <Input
                    name='edad'
                    autoComplete='off'
                    ref={register({ required: false })}
                    readOnly
                  />
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col md={6}>
                  <Label>{t('estudiantes>buscador_per>info_gen>estado_civil', 'Estado civil')}</Label>
                  <Input
                    name='estadoCivil'
                    autoComplete='off'
                    readOnly
                    value={estadoCivil?.nombre}
                  />
                </Col>
                <Col md={6}>
                  <Label>{t('estudiantes>buscador_per>info_gen>genero', 'Género')}</Label>

                  <Input
                    name='sexo'
                    autoComplete='off'
                    readOnly
                    value={gender?.nombre}
                  />
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col md={12}>
                  <CardTitle>{t('estudiantes>buscador_per>info_gen>ubi', 'Ubicación')}</CardTitle>
                  <Description>
                    {t('estudiantes>buscador_per>info_gen>ubi_msj', 'Los datos que permitan ubicar a una persona, se consideran datos privados, sólo los usuarios que tengan privilegios pueden ver esta información desde el expediente completo.')}
                  </Description>
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col md={6}>
                  <Label>{t('estudiantes>buscador_per>info_gen>provincia', 'Provincia')}</Label>
                  <Input
                    autoComplete='off'
                    readOnly
                    value={direccionData[0]}
                  />
                </Col>
                <Col md={6}>
                  <Label>{t('estudiantes>buscador_per>info_gen>canton', 'Cantón')}</Label>
                  <Input
                    autoComplete='off'
                    readOnly
                    value={direccionData[1]}
                  />
                </Col>
                <Col md={6} className='mt-2'>
                  <Label>{t('estudiantes>buscador_per>info_gen>distrito', 'Distrito')}</Label>
                  <Input
                    autoComplete='off'
                    readOnly
                    value={direccionData[2]}
                  />
                </Col>
              </Row>
            </Form>
          </Col>
          <Col md={6} xs='12'>
            <CardTitle>{t('estudiantes>buscador_per>info_gen>est_actual', 'Condición de matrícula')}</CardTitle>
            <Row className='mt-3'>
              <Col md={6}>
                <Label>{t('estudiantes>buscador_per>info_gen>est_est', 'En el curso lectivo actual el estudiante se encuentra')}</Label>
                <Input
                  name='estadoMatricula'
                  autoComplete='off'
                  readOnly
                  value={datosMatricula[1]}                 
                />                
              </Col>
              <Col md={6}>
                <FormRadio>
                  <Label>{t('estudiantes>buscador_per>info_gen>fallecido', 'Se encuentra fallecido')}</Label>
                  <CustomInput
                    type='radio'
                    label={t('general>si', 'Si')}
                    inline
                    checked={props.user.esFallecido}
                  />
                  <CustomInput
                    type='radio'
                    label={t('general>no', 'No')}
                    inline
                    checked={!props.user.esFallecido}
                  />
                </FormRadio>
              </Col>
            </Row>
            <br />
            <CardTitle>{t('estudiantes>buscador_per>info_gen>otros_datos', 'Otros datos')}</CardTitle>
            {/* <FormGroup>
              <Label>{t('estudiantes>buscador_per>info_gen>etnia_ind', 'Etnia indígena')}</Label>
              <Input
                autoComplete='off'
                readOnly
                value={etnia?.nombre}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('estudiantes>buscador_per>info_gen>lengua_ind', 'Lengua indígena')}</Label>
              <Input
                autoComplete='off'
                readOnly
                value={lenguaIndigena?.nombre}
              />
            </FormGroup> */}
            <FormGroup>
              <Label>
                {t('estudiantes>buscador_per>info_gen>lengua_senias', 'Lengua de señas costarricenses (LESCO)')}
              </Label>
              <CustomInput
                type='radio'
                name='esFallecido'
                label={t('general>si', 'Si')}
                inline
                checked={props.user.lesco}
              />
              <CustomInput
                type='radio'
                name='esFallecido'
                label={t('general>no', 'No')}
                inline
                checked={!props.user.lesco}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('estudiantes>buscador_per>info_gen>lengua_mater', 'Lengua materna')}</Label>
              <Input
                autoComplete='off'
                readOnly
                value={lenguaMaterna?.nombre}
              />
            </FormGroup>
           {/*  <FormGroup>
            <CustomInput
                type='checkbox'
                name='esindigena'
                label={t('estudiantes>buscador_per>info_gen>esindigena', 'La persona estudiante es indígena')}
                inline
                checked={props.user.lesco}
              />
              </FormGroup> */}
            <FormGroup>
            <FormRadio>
                  <Label>{t('estudiantes>buscador_per>info_gen>esindigena', 'La persona estudiante es indígena')}</Label>
                  <CustomInput
                    type='radio'
                    label={t('general>si', 'Si')}
                    inline
                    checked={datosMatricula[0]}
                  />
                  <CustomInput
                    type='radio'
                    label={t('general>no', 'No')}
                    inline
                    checked={!datosMatricula[0]}
                  />
                </FormRadio>
              <Label>{t('estudiantes>buscador_per>info_gen>cond_discapacidad', 'Condición de discapacidad')}</Label>
              <StyledMultiSelect
                selectedOptions={props.discapacidades.map(
								  (item) => item.elementosCatalogosId
                )}
                stagedOptions={[]}
                options={
									selects[catalogsEnumObj.DISCAPACIDADES.name]
								}
                editable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('estudiantes>buscador_per>info_gen>apoyos_rec', 'Servicio de apoyo que recibe')}</Label>
              <StyledMultiSelect
                selectedOptions={props.apoyosRecibidos.map(
								  (item) => item.elementosCatalogoId
                )}
                stagedOptions={[]}
                options={
									selects[catalogsEnumObj.TIPOSAPOYOS.name]
								}
                editable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('estudiantes>buscador_per>info_gen>apoyos_no_rec', 'Servicio de apoyo que requiere (Pero no los recibe)')}</Label>
              <StyledMultiSelect
                selectedOptions={props.apoyosNoRecibidos.map(
								  (item) => item.elementosCatalogoId
                )}
                stagedOptions={[]}
                options={
									selects[catalogsEnumObj.TIPOSAPOYOS.name]
								}
                editable={false}
              />
            </FormGroup>
          </Col>
        </Row>
      </Card>
    </Wrapper>
  )
}

const Wrapper = styled.div`
	margin-top: 20px;
	margin-bottom: 20px;
`

const Card = styled.div`
	background: #fff;
	position: relative;
`

const CardTitle = styled.h5`
	color: #000;
	margin-bottom: 10px;
`

const Description = styled.p`
	color: #000;
	margin: 0;
`

const Form = styled.form`
	margin-bottom: 20px;
`

const Avatar = styled.img`
	width: 120px;
	height: 120px;
	border-radius: 50%;
`

const FormGroup = styled.div`
	margin-bottom: 10px;
`

const FormRadio = styled.div`
	display: block;
	margin-top: 18px;
	margin-bottom: 15px;
`

const Label = styled.label`
	color: #000;
	display: block;
`

const Input = styled.input`
	padding: 10px;
	width: 100%;
	border: 1px solid #d7d7d7;
	background-color: #e9ecef;
	outline: 0;
	&:focus {
		background: #fff;
	}
`

export default EstudianteForm
