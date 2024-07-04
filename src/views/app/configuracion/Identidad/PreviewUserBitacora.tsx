import React from 'react'
import styled from 'styled-components'
import { Row, Col, CustomInput } from 'reactstrap'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

import { UsuarioRegistro } from '../../../../types/usuario'
import { calculateAge } from '../../../../utils/years'
import { useTranslation } from 'react-i18next'

type FormProps = {
    title: string;
    subtitle?: string;
    user?: UsuarioRegistro,
    disabled?: boolean,
    toggleEdit?: Function,
    handleUpdate?: Function,
}

type IState = {
    selects: any
}

const PreviewUserBitacora: React.FC<FormProps> = (props) => {
  const [t] = useTranslation()

  const currentUser = props.user.DatosBasicos[0]
  const adicionales = props.user.DatosAdicionales
  const {
    register,
    control,
    setValue
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      nombre: currentUser.nombre || '',
      primerApellido: currentUser.primerApellido,
      segundoApellido: currentUser.segundoApellido,
      conocidoComo: currentUser.conocidoComo,
      fechaNacimiento: moment(currentUser.fechaNacimiento).toDate(),
      sexo: currentUser.sexo,
      edad: calculateAge(currentUser.fechaNacimiento)
    }
  })

  const selects = useSelector((state: IState) => state.selects)

  const typeId = adicionales ? adicionales.find((item: any) => item.catalogo == 'Tipo de Identificación') : 0
  const nacionalidadId = adicionales ? adicionales.find((item: any) => item.catalogo == 'Nacionalidad') : 0
  const sexId = adicionales ? adicionales.find((item: any) => item.catalogo == 'Sexo') : 0
  const genero = adicionales ? adicionales.find((item: any) => item.codigoCatalogo == 4) : {}

  return (
    <Wrapper>
      <Card className='bg-white__radius'>
        <CardTitle>{props.title} {props.subtitle !== undefined ? `(${props.subtitle})` : null}</CardTitle>
        <Form>
          <Row>
            <Col md={5} className='d-flex align-items-center justify-content-center'>
              <Avatar src={currentUser.fotografiaUrl === null || currentUser.fotografiaUrl === '' ? '/assets/img/profile-pic-generic.png' : currentUser.fotografiaUrl} alt='Profile picture' />
            </Col>
            <Col md={7}>
              <FormGroup>
                <Label>{t('estudiantes>indentidad_per>aplicar_camb>camb_id>tipo_id', 'Tipo de identificación')}</Label>
                <Select
                  type='select'
                  className='react-select'
                  classNamePrefix='react-select'
                  name='nationality'
                  options={selects.idTypes}
                  getOptionLabel={(option: any) => option.nombre}
                  getOptionValue={(option: any) => option.id}
                  placeholder=''
                  value={selects.idTypes.find((item: any) => item.id === typeId.id)}
                  isDisabled
                />
              </FormGroup>
              <FormGroup>
                <Label>{t('estudiantes>indentidad_per>aplicar_camb>num_id', 'Número de identificación')}</Label>
                <Input name='identificacion' value={currentUser.identificacion} disabled />
              </FormGroup>
              <FormGroup>
                <Label>{t('estudiantes>indentidad_per>aplicar_camb>nacionalidad', 'Nacionalidad')}</Label>
                <Select
                  type='select'
                  className='react-select'
                  classNamePrefix='react-select'
                  name='nationality'
                  onChange={(e) => {
                    }}
                  value={selects.nationalities.find((item: any) => item.id === nacionalidadId.id)}
                  options={selects.nationalities}
                  getOptionLabel={(option: any) => option.nombre}
                  getOptionValue={(option: any) => option.id}
                  isDisabled
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>{t('estudiantes>indentidad_per>aplicar_camb>nombre', 'Nombre')}</Label>
            <Input name='nombre' autoComplete='off' ref={register({ required: false })} disabled />
          </FormGroup>
          <FormGroup>
            <Label>{t('estudiantes>indentidad_per>aplicar_camb>apellido_1', 'Primer apellido')}</Label>
            <Input name='primerApellido' autoComplete='off' ref={register({ required: false })} disabled />
          </FormGroup>
          <FormGroup>
            <Label>{t('estudiantes>indentidad_per>aplicar_camb>apellido_2', 'Segundo apellido')}</Label>
            <Input name='segundoApellido' autoComplete='off' ref={register({ required: false })} disabled />
          </FormGroup>
          <FormGroup>
            <Label>{t('estudiantes>indentidad_per>aplicar_camb>conocido', 'Conocido como')}</Label>
            <Input name='conocidoComo' autoComplete='off' ref={register({ required: false })} disabled />
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>{t('estudiantes>indentidad_per>aplicar_camb>fecha_naci', 'Fecha de nacimiento')}</Label>
                <Controller
                  control={control}
                  name='fechaNacimiento'
                  rules={{ required: false }}
                  onChange={([selected]) => setValue('fechaNacimiento', selected)}
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
              </FormGroup>
              <FormGroup>
                <Label>{t('estudiantes>indentidad_per>aplicar_camb>sexo', 'Sexo')}</Label>
                <Select
                  type='select'
                  className='react-select'
                  classNamePrefix='react-select'
                  name='sexo'
                  onChange={(e) => {
                    }}
                  value={selects.sexoTypes.find((item: any) => item.id === sexId.id)}
                  options={selects.sexoTypes}
                  getOptionLabel={(option: any) => option.nombre}
                  getOptionValue={(option: any) => option.id}
                  isDisabled
                />
              </FormGroup>
              <FormRadio>
                <Label>{t('estudiantes>indentidad_per>aplicar_camb>fallecido', 'Se encuentra fallecido')}</Label>
                <CustomInput type='radio' name='esFallecido' disabled label={t('general>si', 'Si')} inline checked={currentUser.esFallecido} />
                <CustomInput type='radio' name='esFallecido' disabled label={t('general>no', 'No')} inline checked={!currentUser.esFallecido} />
              </FormRadio>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>{t('estudiantes>indentidad_per>aplicar_camb>edad', 'Edad cumplida')}</Label>
                <Input name='edad' autoComplete='off' ref={register({ required: false })} disabled />
              </FormGroup>
              <FormGroup>
                <Label>{t('estudiantes>indentidad_per>aplicar_camb>identidad', 'Identidad de género')}</Label>
                <Select
                  type='select'
                  className='react-select'
                  classNamePrefix='react-select'
                  name='sexo'
                  onChange={(e) => {
                    }}
                  value={{ label: genero?.valor, value: genero?.valor }}
                  options={selects.sexoTypes}
                  isDisabled
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
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

const FormRadio = styled.div`
    display: block;
    margin-top: 18px;
    margin-bottom: 15px;
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

export default PreviewUserBitacora
