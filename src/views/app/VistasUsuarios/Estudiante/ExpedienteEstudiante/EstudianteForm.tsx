import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
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
import useExpedienteEstudiante from './useExpedienteEstudiante'
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
  const { datosEducativos } = useExpedienteEstudiante()
  useEffect(() => {
    const direction = props.user.direcciones.find((el) => !el.temporal)
    const loadData = async () => {
      try {
        const province = await axios.get(
          `${envVariables.BACKEND_URL}/api/Provincia/GetById/${direction.provinciasId}`
        )
        const canton = await axios.get(
          `${envVariables.BACKEND_URL}/api/Canton/GetById/${direction.cantonesId}`
        )
        const distrito = await axios.get(
          `${envVariables.BACKEND_URL}/api/Distrito/GetById/${direction.provinciasId}`
        )
        const datosEducaivos = datosEducativos // await axios.get(`${envVariables.BACKEND_URL}/api/Matricula/GetDatosEducativos/${props.user.id}`)

        setDatos(datosEducaivos.data[datosEducaivos.data.length - 1] || {})

        setDireccionData([
          province.data.nombre,
          canton.data.nombre,
          distrito.data.nombre
        ])
      } catch (err) {
        setDireccionData(['Sin definir', 'Sin definir', 'Sin definir'])
      }
    }

    if (direction) {
      loadData()
    }
  }, [props.user])

  const currentUser = props.user
  const adicionales = props.user.datos

  const { register, control, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      nombre: `${props.user.nombre} ${props.user.primerApellido} ${props.user.segundoApellido}`,
      primerApellido: props.user.primerApellido,
      segundoApellido: props.user.segundoApellido,
      conocidoComo: props.user.conocidoComo || '',
      fechaNacimiento: moment(props.user.fechaNacimiento).toDate(),
      sexo: currentUser.sexo,
      edad: calculateAge(props.user.fechaNacimiento)
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

  // const direccionData = direccion[0] ? direccion[0].direccionExacta.split(",") : []

  return (
    <Wrapper>
      <Helmet>Ficha informativa</Helmet>

      <Card className='bg-white__radius'>
        <Row>
          <Col md={6} xs='12'>
            <CardTitle>La persona</CardTitle>
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
                    <Label>Tipo de identificación</Label>
                    <Input
                      name='nationality'
                      value={selects.idTypes[0].nombre}
                      readOnly
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Número de identificación</Label>
                    <Input
                      name='identificacion'
                      ref={register({ required: false })}
                      readOnly
                      value={props.user.identificacion}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Nacionalidad</Label>
                    <Input
                      name='nationality'
                      readOnly
                      value={nacionalidad.nombre}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label>Nombre completo</Label>
                <Input
                  name='nombre'
                  autoComplete='off'
                  ref={register({ required: false })}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <Label>Conocido como</Label>
                <Input
                  name='conocidoComo'
                  autoComplete='off'
                  ref={register({ required: false })}
                  readOnly
                />
              </FormGroup>
              <Row>
                <Col md={6}>
                  <Label>Fecha de nacimiento</Label>
                  <Controller
                    control={control}
                    name='fechaNacimiento'
                    rules={{ required: false }}
                    onChange={([selected]) =>
                      setValue('fechaNacimiento', selected)}
                    placeholderText=''
                    render={({ onChange, onBlur, value }) => (
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
                  <Label>Edad</Label>
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
                  <Label>Estado civil</Label>
                  <Input
                    name='estadoCivil'
                    autoComplete='off'
                    readOnly
                    value={estadoCivil.nombre}
                  />
                </Col>
                <Col md={6}>
                  <Label>Género</Label>
                  <Input
                    name='sexo'
                    autoComplete='off'
                    readOnly
                    value={gender.nombre}
                  />
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col md={12}>
                  <CardTitle>Ubicación</CardTitle>
                  <Description>
                    Los datos que permitan ubicar a una persona, se consideran
                    datos privados, sólo los usuarios que tengan privilegios
                    pueden ver esta información desde el expediente completo.
                  </Description>
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col md={6}>
                  <Label>Provincia</Label>
                  <Input
                    autoComplete='off'
                    readOnly
                    value={direccionData[0]}
                  />
                </Col>
                <Col md={6}>
                  <Label>Cantón</Label>
                  <Input
                    autoComplete='off'
                    readOnly
                    value={direccionData[1]}
                  />
                </Col>
                <Col md={6} className='mt-2'>
                  <Label>Distrito</Label>
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
            <CardTitle>Estado actual</CardTitle>
            <Row className='mt-3'>
              <Col md={6}>
                <Label>Estado como estudiante</Label>
                <Input
                  name='edad'
                  autoComplete='off'
                  readOnly
                  value={datos.condicion}
                />
              </Col>
              <Col md={6}>
                <FormRadio>
                  <Label>Se encuentra fallecido</Label>
                  <CustomInput
                    type='radio'
                    label='Si'
                    inline
                    checked={props.user.esFallecido}
                  />
                  <CustomInput
                    type='radio'
                    label='No'
                    inline
                    checked={!props.user.esFallecido}
                  />
                </FormRadio>
              </Col>
            </Row>
            <CardTitle>Otros datos</CardTitle>
            <FormGroup>
              <Label>Etnia indígena</Label>
              <Input autoComplete='off' readOnly value={etnia.nombre} />
            </FormGroup>
            <FormGroup>
              <Label>Lengua indígena</Label>
              <Input
                autoComplete='off'
                readOnly
                value={lenguaIndigena.nombre}
              />
            </FormGroup>
            <FormGroup>
              <Label>Lengua de señas costarricenses (LESCO)</Label>
              <CustomInput
                type='radio'
                name='esFallecido'
                label='Si'
                inline
                checked={props.user.lesco}
              />
              <CustomInput
                type='radio'
                name='esFallecido'
                label='No'
                inline
                checked={!props.user.lesco}
              />
            </FormGroup>
            <FormGroup>
              <Label>Lengua materna</Label>
              <Input
                autoComplete='off'
                readOnly
                value={lenguaMaterna.nombre}
              />
            </FormGroup>
            <FormGroup>
              <Label>Condición de discapacidad</Label>
              <StyledMultiSelect
                selectedOptions={props.discapacidades.map(
                  (item) => item.elementosCatalogosId
                )}
                stagedOptions={[]}
                options={selects[catalogsEnumObj.DISCAPACIDADES.name]}
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
