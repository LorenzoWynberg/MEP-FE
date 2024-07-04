import React from 'react'
import { FormGroup, Input, Form, FormFeedback } from 'reactstrap'
import Datetime from 'react-datetime'
import styled from 'styled-components'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useTranslation } from 'react-i18next'

registerLocale('es', es)

interface IProps {
	editable: boolean
	editing: boolean
	errors: any
	state: {
		eFields: any
		errors: any
	}
	setValue: (name: string, value: any, config?: any) => void
	getValues: any
	watch: any
	register
	onchangeNombre: (el: any) => void
}

const FormAnioEducativo: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  const {
    editable,
    errors,
    watch,
    setValue,
    state,
    onchangeNombre,
    register
  } = props
  const fechaInicio = watch('fechaInicio')
  const fechaFin = watch('fechaFin')
  return (
    <FormStyled>
      <FormGroup>
        <RequiredSpan>{t('configuracion>anio_educativo>agregar>anio_educativo', 'Año educativo')} *</RequiredSpan>
        <Datetime
          closeOnSelect
          onChange={onchangeNombre}
          inputProps={{
					  className: `${
							(state.eFields.nombre || errors.nombre) &&
							'is-invalid'
						} form-control`,
					  disabled: !editable
          }}
          dateFormat='YYYY'
          timeFormat={false}
          value={watch('nombre')}
        />
        {(state.eFields.nombre || errors.nombre) && (
          <span style={{ color: '#c43d4b' }}>
            {state.errors.nombre || errors.nombre.message}
          </span>
        )}
      </FormGroup>
      <FormGroup>
        <RequiredSpan>{t('configuracion>anio_educativo>agregar>fecha_inicio', 'Fecha inicio')} *</RequiredSpan>
        <Input
          name='fechaInicio'
          type='date'
          readOnly={!editable}
          invalid={
						errors.fechaInicio ||
						state?.feedbackErrors?.fields.fechaInicio
					}
					// innerRef={register}
          value={fechaInicio}
          onChange={(e) => {
					  //
					  setValue('fechaInicio', e.target.value)
          }}
        />
        {/* <DatePickerStyled
          name={'fechaInicio'}
          selected={watch('fechaInicio')}
          disabled={!editable}
          locale={'es'}
          onChange={(date) => setValue('fechaInicio', date)}
          dateFormat="dd/MM/yyyy"
        /> */}
      </FormGroup>
      <FormGroup>
        <RequiredSpan>{t('configuracion>anio_educativo>agregar>fecha_final', 'Fecha final')} *</RequiredSpan>
        <Input
          name='fechaFin'
          type='date'
          readOnly={!editable}
          invalid={
						errors.fechaFin ||
						state?.feedbackErrors?.fields.fechaFin
					}
					// innerRef={register}
          value={fechaFin}
          onChange={(e) => setValue('fechaFin', e.target.value)}
        />
        {/* <DatePickerStyled
          minDate={watch('fechaInicio')}
          style={{ padding: 'none!important' }}
          name={'fechaFin'}
          locale={'es'}
          selected={watch('fechaFin')}
          disabled={!editable}
          onChange={(date) => setValue('fechaFin', date)}
          dateFormat="dd/MM/yyyy"
        /> */}
      </FormGroup>
      <FormGroup>
        <RequiredSpan>
          {t('configuracion>anio_educativo>agregar>anio_educativo_plantilla', 'Año educativo que se utilizará como plantilla')} *
        </RequiredSpan>
        <Select
          className='react-select'
          classNamePrefix='react-select'
          placeholder=''
          invalid={Boolean(
					  state.eFields.plantilla || errors.plantilla
          )}
					/* options={} */
          isDisabled={!editable}
          readOnly
          noOptionsMessage={() => t("general>no_opt", "Sin opciones")}
          getOptionLabel={(option: any) => option.nombre}
          getOptionValue={(option: any) => option.id}
          components={{ Input: CustomSelectInput }}
        />
        {(state.eFields.plantilla || errors.plantilla) && (
          <FormFeedback>
            {state.errors.plantilla || t('configuracion>anio_educativo>agregar>campo_requerido', 'Este campo es requerido')}
          </FormFeedback>
        )}
      </FormGroup>
      <FormGroup>
        <RequiredSpan>{t('configuracion>anio_educativo>agregar>estado', 'Estado')} *</RequiredSpan>
        <Input
          onChange={(e) => setValue('estado', e.target.value)}
          invalid={Boolean(
					  state.eFields.estado || errors.estado
          )}
          type='select'
          value={watch('estado')}
          disabled={!editable}
        >
          <option value='1' disabled={!editable}>
            {t('configuracion>anio_educativo>agregar>estado>activo', 'Activo')}
          </option>
          <option value='0' disabled={!editable}>
            {t('configuracion>anio_educativo>agregar>estado>pasivo', 'Pasivo')}
          </option>
        </Input>
        {(state.eFields.estado || errors.estado) && (
          <FormFeedback>
            {state.errors.estado || t('configuracion>anio_educativo>agregar>campo_requerido', 'Este campo es requerido')}
          </FormFeedback>
        )}
      </FormGroup>
    </FormStyled>
  )
}
const RequiredSpan = styled.span`
	font-size: 12px;
	color: #000;
`
const FormStyled = styled(Form)`
	min-width: 450px;
`
const DatePickerStyled = styled(DatePicker)`
	padding: 0.75rem !important;
`
export default FormAnioEducativo
