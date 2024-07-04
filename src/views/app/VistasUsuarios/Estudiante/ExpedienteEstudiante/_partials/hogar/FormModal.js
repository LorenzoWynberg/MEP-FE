import React from 'react'
import { injectIntl } from 'react-intl'

import { Colxx } from 'Components/common/CustomBootstrap'
import IntlMessages from 'Helpers/IntlMessages'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import moment from 'moment'
import ReactInputMask from 'react-input-mask'

import {
  Row,
  Input,
  Label,
  Form,
  FormGroup,
  FormFeedback
} from 'reactstrap'
import { IdentificationInputs } from '../../../../../../../Hoc/Identification'
import RequiredLabel from '../../../../../../../components/common/RequeredLabel'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'

const FormModal = (props) => {
  const {
    register,
    control,
    errors,
    dataSelectCircuit,
    data,
    idRolAdmin,
    institutionTypesSelect,
    setValue,
    dataSelectRegional,
    onChangeRegional
  } = props
  const currentDate = moment()
  const threeMonthsBefore = moment(currentDate).subtract(3, 'M')
  return (
    <Form>
      <Row>
        <Colxx sm='12' lg='12'>
          <IdentificationInputs
            {...props}
            handleChange={props.handleChange}
            nacionalidad={props.memberData.nationalityId}
            storeAction={props.handleLoadMember}
            idType={props.memberData.idType}
            identificacion={props.memberData.identificacion}
            setLoading={props.setLoading}
            loading={props.loading}
            editable={props.editable}
            disableFields={props.disableFields}
            avoidSearch={props.disableFields}
            errors={props.errors}
            fields={props.fields}
          />
          <FormGroup>
            <RequiredLabel>Nombre</RequiredLabel>
            <Input
              type='text'
              name='nombre'
              value={props.memberData.nombre}
              disabled={props.disabled || !props.editable}
              onChange={(e) => {
                props.handleChange(e)
              }}
              invalid={props.fields.nombre}
            />
            <FormFeedback>
              {props.fields.nombre && props.errors.nombre}
            </FormFeedback>
          </FormGroup>
          <FormGroup>
            <RequiredLabel>Primer apellido</RequiredLabel>
            <Input
              type='text'
              name='primerApellido'
              value={props.memberData.primerApellido}
              disabled={props.disabled || !props.editable}
              onChange={(e) => {
                props.handleChange(e)
              }}
              invalid={props.fields.primerApellido}
            />
            <FormFeedback>
              {props.fields.primerApellido && props.errors.PrimerApellido}
            </FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Segundo apellido</Label>
            <Input
              type='text'
              name='segundoApellido'
              value={props.memberData.segundoApellido}
              disabled={props.disabled || !props.editable}
              onChange={(e) => {
                props.handleChange(e)
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Sexo</Label>
            <Select
              components={{ Input: CustomSelectInput }}
              className={`react-select ${
                props.fields.SexoId && 'has-error'
              }`}
              classNamePrefix='react-select'
              options={props.selects.sexoTypes.map((item) => {
                return { ...item, label: item.nombre, value: item.id }
              })}
              placeholder=''
              value={props.memberData.sexo}
              isDisabled={props.disabled || !props.editable}
              onChange={(data) => {
                props.handleChange(data, 'sexo')
              }}
            />
            <FormFeedbackSpan>
              {props.fields.SexoId && props.errors.SexoId}
            </FormFeedbackSpan>
          </FormGroup>
          <FormGroup>
            <RequiredLabel>Fecha de nacimiento</RequiredLabel>
            <DatePicker
              dateFormat='dd/MM/yyyy'
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              selectsStart
              maxDate={threeMonthsBefore.toDate()}
              disabled={props.disabled || !props.editable}
              selected={
                props.memberData.fechaNacimiento
                  ? moment(props.memberData.fechaNacimiento).toDate()
                  : null
              }
              onChange={(e) => {
                props.handleChange(e, 'fechaNacimiento')
              }}
            />
            <FormFeedbackSpan>
              {props.fields.fechaNacimiento &&
                props.errors.fechaNacimiento}
            </FormFeedbackSpan>
          </FormGroup>
          <FormGroup>
            <Label>Conocido como</Label>
            <Input
              type='text'
              name='conocidoComo'
              value={props.memberData.conocidoComo}
              disabled={props.disabled || !props.editable}
              onChange={(e) => {
                props.handleChange(e, 'conocidoComo')
              }}
            />
            <FormFeedbackSpan>
              {props.fields.conocidoComo && props.errors.conocidoComo}
            </FormFeedbackSpan>
          </FormGroup>
          <FormGroup>
            <RequiredLabel>Escolaridad</RequiredLabel>
            <Select
              components={{ Input: CustomSelectInput }}
              className={`react-select ${
                props.fields.escolaridadId && 'has-error'
              }`}
              classNamePrefix='react-select'
              options={props.selects.escolaridades.map((item) => {
                return { ...item, label: item.nombre, value: item.id }
              })}
              placeholder=''
              value={props.memberData.escolaridad}
              onChange={(data) => {
                props.handleChange(data, 'escolaridad')
              }}
              isDisabled={!props.editable}
            />
            <FormFeedbackSpan>
              {props.fields.escolaridadId && props.errors.escolaridadId}
            </FormFeedbackSpan>
          </FormGroup>
          <FormGroup>
            <RequiredLabel>Condición laboral</RequiredLabel>
            <Select
              components={{ Input: CustomSelectInput }}
              className={`react-select ${
                props.fields.condicionLaboralId && 'has-error'
              }`}
              classNamePrefix='react-select'
              options={props.selects.condicionLaboral.map((item) => {
                return { ...item, label: item.nombre, value: item.id }
              })}
              placeholder=''
              value={props.memberData.condicionTrabajo}
              isDisabled={!props.editable}
              onChange={(data) => {
                props.handleChange(data, 'condicionTrabajo')
              }}
            />
            <FormFeedbackSpan>
              {props.fields.condicionLaboralId &&
                'La condición laboral es requerida'}
            </FormFeedbackSpan>
          </FormGroup>
          <FormGroup>
            <RequiredLabel>
              <IntlMessages id='family.relationship' />
            </RequiredLabel>
            <Select
              className='react-select'
              classNamePrefix='react-select'
              components={{ Input: CustomSelectInput }}
              isDisabled={!props.editable}
              value={props.memberData.relacion}
              onChange={(data) => {
                props.handleChange(data, 'relacion')
              }}
              options={props.selects.relacionEstudiante.map((item) => {
                return { ...item, label: item.nombre, value: item.id }
              })}
            />
            <span style={{ color: 'red' }}>
              {props.fields.parentescoId && props.errors.parentescoId}
            </span>
          </FormGroup>
          <FormGroup>
            <RequiredLabel>
              <IntlMessages id='form.phoneNumber' />
            </RequiredLabel>
            <ReactInputMask
              mask='9999-9999'
              value={props.memberData.telefono}
              disabled={!props.editable}
              type='text'
              name='telefono'
              onChange={(e) => {
                props.handleChange(e)
              }}
              invalid={props.fields.Telefono}
            >
              {(inputProps) => (
                <Input {...inputProps} disabled={!props.editable} />
              )}
            </ReactInputMask>
            <FormFeedback>
              {props.fields.Telefono && props.errors.Telefono}
            </FormFeedback>
          </FormGroup>
          <FormGroup>
            <RequiredLabel>
              <IntlMessages id='form.email' />
            </RequiredLabel>
            <Input
              type='email'
              name='email'
              value={props.memberData.email}
              disabled={!props.editable}
              onChange={(e) => {
                props.handleChange(e)
              }}
              invalid={props.fields.Email}
            />
            <FormFeedback>
              {props.fields.Email && props.errors.Email}
            </FormFeedback>
          </FormGroup>
        </Colxx>
      </Row>
    </Form>
  )
}

const FormFeedbackSpan = styled.span`
  color: red;
`
export default injectIntl(FormModal)
