import 'react-datepicker/dist/react-datepicker.css'

import { useActions } from 'Hooks/useActions'
import moment from 'moment'
import React from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { Button, Col, CustomInput, Input, Row } from 'reactstrap'
import { getCatalogs } from 'Redux/selects/actions'
import styled from 'styled-components'
import { getYearsOld } from 'Utils/years'

import { UsuarioRegistro } from '../../../../types/usuario'
import { useTranslation } from 'react-i18next'

interface FormProps {
  title: string
  subtitle?: string
  user?: UsuarioRegistro
  disabled?: boolean
  toggleEdit?: Function
  toggleIdentificacion?: Function
  toggleFallecimiento?: Function
  identificacionDisabled?: boolean
}

type IState = {
  selects: any
}

const defValues = {
  typeId: {} as any,
  nacionalidadId: {} as any,
  userDate: new Date(Date.now()),
  sexoId: {} as any,
  userAge: {} as any,
  genero: {} as any,
  tipoDimex: {} as any,
  tipoYisro: {} as any
}

const IdentidadForm: React.FC<FormProps> = (props) => {
  const [t] = useTranslation()

  const [type, setType] = React.useState<string>('')
  const [formState, setFormState] = React.useState(defValues)

  const selects = useSelector((state: IState) => state.selects)
  const actions = useActions({
    getCatalogs
  })

  React.useEffect(() => {
    const fetch = async () => {
      await actions.getCatalogs(40)
    }
    fetch()
  }, [])

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value)
  }

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {}

  React.useEffect(() => {
    const userDatos = props.user.datos && props.user.datos.length > 0
    if (!userDatos) return

    const userDate: any =
      props.user.fechaNacimiento !== null
        ? moment(props.user.fechaNacimiento).toDate()
        : ''
    const userAge: any = props.user.fechaNacimiento == null ? '' : getYearsOld(props.user.fechaNacimiento)
    const typeId =
      userDatos &&
      props.user.datos.find(
        (item: any) => item.nombreCatalogo === 'Tipo de Identificación'
      )
    const nacionalidadId =
      userDatos &&
      props.user.datos.find(
        (item: any) => item.nombreCatalogo === 'Nacionalidad'
      )
    const sexoId =
      userDatos &&
      props.user.datos.find((item: any) => item.nombreCatalogo === 'Sexo')
    const genero =
      userDatos &&
      props.user.datos.find((item: any) => item.codigoCatalogo === 4)
    let tipoDimex: any = {}
    let tipoYisro: any = {}

    if (userAge<0)
    {

    }

    if (typeId.elementoId === 3) {
      tipoDimex =
        userDatos &&
        props.user.datos.find((item: any) => item.codigoCatalogo === 40)
    }
    if (typeId.elementoId === 4) {
      tipoYisro =
        userDatos &&
        props.user.datos.find((item: any) => item.codigoCatalogo === 41)
    }
    setFormState({
      userDate,
      userAge,
      typeId,
      nacionalidadId,
      sexoId,
      genero,
      tipoYisro,
      tipoDimex
    })
  }, [props.user.datos])

  return (
    <Card className='bg-white__radius'>
      <CardTitle>
        {props.title}{' '}
        {props.subtitle !== undefined ? `(${props.subtitle})` : null}
      </CardTitle>
      <Form>
        <Row className='mb-2'>
          <Col
            md={5}
            className='d-flex align-items-center justify-content-center'
          >
            <Avatar
              src={
                props.user.imagen === null || props.user.imagen === ''
                  ? '/assets/img/profile-pic-generic.png'
                  : props.user.imagen
              }
              alt='Profile picture'
            />
          </Col>
          <Col md={7}>
            <FormGroup>
              <Label>{t('estudiantes>indentidad_per>aplicar_camb>tipo_id', 'Tipo de identificación')}</Label>
              <Select
                type='select'
                className='react-select'
                classNamePrefix='react-select'
                name='type_identification'
                onChange={handleTypeChange}
                options={selects.idTypes}
                getOptionLabel={(option: any) => option.nombre}
                getOptionValue={(option: any) => option.id}
                placeholder=''
                value={
                  formState.typeId !== undefined
                    ? selects.idTypes.find(
                      (item: any) => item.id === formState.typeId.elementoId
                    )
                    : ''
                }
                isDisabled={props.disabled}
              />
            </FormGroup>
            {formState.typeId.elementoId === 3 && (
              <FormGroup>
                <Label>{t('estudiantes>indentidad_per>aplicar_camb>tipo_dimex', 'Tipo de DIMEX')}</Label>
                <Select
                  type='select'
                  className='react-select'
                  classNamePrefix='react-select'
                  name='tipoDimex'
                  onChange={handleTypeChange}
                  options={selects.tipoDimex}
                  getOptionLabel={(option: any) => option.nombre}
                  getOptionValue={(option: any) => option.id}
                  placeholder=''
                  value={
                    formState.tipoDimex !== undefined
                      ? selects.tipoDimex.find(
                        (item: any) =>
                          item.id === formState.tipoDimex.elementoId
                      )
                      : ''
                  }
                  isDisabled={props.disabled}
                />
              </FormGroup>
            )}
            {formState.typeId.elementoId === 4 && (
              <FormGroup>
                <Label>Tipo de YÍS RÖ</Label>
                <Select
                  type='select'
                  className='react-select'
                  classNamePrefix='react-select'
                  name='tipoDimex'
                  onChange={handleTypeChange}
                  options={selects.tipoYisro}
                  getOptionLabel={(option: any) => option.nombre}
                  getOptionValue={(option: any) => option.id}
                  placeholder=''
                  value={
                    formState.tipoYisro !== undefined
                      ? selects.tipoYisro.find(
                        (item: any) =>
                          item.id === formState.tipoYisro.elementoId
                      )
                      : ''
                  }
                  isDisabled={props.disabled}
                />
              </FormGroup>
            )}
            <FormGroup>
              <Label>{t('estudiantes>indentidad_per>aplicar_camb>num_id', 'Número de identificación')}</Label>
              <Input
                name='identificacion'
                value={props.user?.identificacion}
                disabled={props.disabled || props.identificacionDisabled}
              />
            </FormGroup>
            {formState.typeId.elementoId === 1 && (
              <FormGroup>
                <Label>Nacionalidad</Label>
                <Select
                  type='select'
                  className='react-select'
                  classNamePrefix='react-select'
                  name='nationality'
                  onChange={(e) => {}}
                  value={
                    formState.nacionalidadId !== undefined
                      ? selects.nationalities.find(
                        (item: any) =>
                          item.id === formState.nacionalidadId.elementoId
                      )
                      : ''
                  }
                  options={selects.nationalities}
                  getOptionLabel={(option: any) => option.nombre}
                  getOptionValue={(option: any) => option.id}
                  isDisabled={props.disabled}
                />
              </FormGroup>
            )}
          </Col>
        </Row>
        {formState.typeId.elementoId !== 1 && (
          <FormGroup>
            <Label>{t('estudiantes>indentidad_per>aplicar_camb>nacionalidad', 'Nacionalidad')}</Label>
            <Select
              type='select'
              className='react-select'
              classNamePrefix='react-select'
              name='nationality'
              onChange={(e) => {}}
              value={
                formState.nacionalidadId !== undefined
                  ? selects.nationalities.find(
                    (item: any) =>
                      item.id === formState.nacionalidadId.elementoId
                  )
                  : ''
              }
              options={selects.nationalities}
              getOptionLabel={(option: any) => option.nombre}
              getOptionValue={(option: any) => option.id}
              isDisabled={props.disabled}
            />
          </FormGroup>
        )}
        <FormGroup>
          <Label>{t('estudiantes>indentidad_per>aplicar_camb>nombre', 'Nombre')}</Label>
          <Input
            name='nombre'
            autoComplete='off'
            value={props.user?.nombre}
            readOnly={props.disabled}
          />
        </FormGroup>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>{t('estudiantes>indentidad_per>aplicar_camb>apellido_1', 'Primer apellido')}</Label>
              <Input
                name='primerApellido'
                autoComplete='off'
                value={props.user?.primerApellido}
                readOnly={props.disabled}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>{t('estudiantes>indentidad_per>aplicar_camb>apellido_2', 'Segundo apellido')}</Label>
              <Input
                name='segundoApellido'
                autoComplete='off'
                value={props.user?.segundoApellido}
                readOnly={props.disabled}
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label>{t('estudiantes>indentidad_per>aplicar_camb>conocido', 'Conocido como')}</Label>
          <Input
            name='conocidoComo'
            autoComplete='off'
            value={props.user?.conocidoComo}
            readOnly={props.disabled}
          />
        </FormGroup>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>{t('estudiantes>indentidad_per>aplicar_camb>fecha_naci', 'Fecha de nacimiento')}</Label>
              <DatePicker
                dateFormat='dd/MM/yyyy'
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                minDate={new Date(1940, 0, 1)}
                maxDate={new Date(2002, 0, 1)}
                dropdownMode='select'
                // placeholderText="Seleccione fecha de nacimiento"
                locale='es'
                onChange={onDateChange}
                selected={formState.userDate}
                disabled={props.disabled}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('estudiantes>indentidad_per>aplicar_camb>sexo', 'Sexo')}</Label>
              <Select
                type='select'
                className='react-select'
                classNamePrefix='react-select'
                name='nationality'
                onChange={(e) => {}}
                placeholder=''
                value={
                  formState.sexoId != undefined
                    ? selects.sexoTypes.find(
                      (item: any) => item.id === formState.sexoId.elementoId
                    )
                    : ''
                }
                options={selects.sexoTypes}
                getOptionLabel={(option: any) => option.nombre}
                getOptionValue={(option: any) => option.id}
                isDisabled={props.disabled}
              />
            </FormGroup>
            <FormRadio>
              <Label>{t('estudiantes>indentidad_per>aplicar_camb>fallecido', 'Se encuentra fallecido')}</Label>
              <CustomInput
                type='radio'
                name='esFallecido'
                label={t('general>si', 'Si')}
                inline
                checked={props.user.esFallecido}
              />
              <CustomInput
                type='radio'
                name='esFallecido'
                label={t('general>no', 'No')}
                inline
                checked={!props.user.esFallecido}
              />
            </FormRadio>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>{t('estudiantes>indentidad_per>aplicar_camb>edad', 'Edad cumplida')}</Label>
              <Input
                name='edad'
                autoComplete='off'
                value={formState.userAge}
                readOnly={props.disabled}
                
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('estudiantes>indentidad_per>aplicar_camb>identidad', 'Identidad de género')}</Label>
              <Select
                type='select'
                className='react-select'
                classNamePrefix='react-select'
                name='nationality'
                onChange={(e) => {}}
                placeholder=''
                value={
                  formState.genero != undefined
                    ? selects.genderTypes.find(
                      (item: any) => item.id === formState.genero.elementoId
                    )
                    : ''
                }
                options={selects.genderTypes}
                getOptionLabel={(option: any) => option.nombre}
                getOptionValue={(option: any) => option.id}
                isDisabled={props.disabled}
              />
            </FormGroup>
          </Col>
        </Row>
      </Form>
      <Actions>
        <ActionButton
          onClick={props.toggleEdit}
          color='primary'
          disabled={props.user.esFallecido}
        >
          {t('general>editar', 'Editar')}
        </ActionButton>
        <ActionButton
          onClick={props.toggleIdentificacion}
          color='primary'
          disabled={props.user.esFallecido}
        >
          {t('estudiantes>indentidad_per>aplicar_camb>cambiar_id', 'Cambiar identificación')}
        </ActionButton>
        <ActionButton
          onClick={props.toggleFallecimiento}
          disabled={props.user.esFallecido}
          color='primary'
        >
          {t('estudiantes>indentidad_per>aplicar_camb>registrar_falle', 'Registrar fallecimiento')}
        </ActionButton>
      </Actions>
    </Card>
  )
}

const Card = styled.div`
  background: #fff;
  margin-top: 30px;
  position: relative;
  height: 100%;
`

const CardTitle = styled.h5`
  color: #000;
  margin-bottom: 10px;
`

const Form = styled.form`
  margin-bottom: 20px;
`

const Avatar = styled.img`
  width: 100%;
  height: auto;
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

const Actions = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 0 auto;
`

const ActionButton = styled(Button)``

export default IdentidadForm
