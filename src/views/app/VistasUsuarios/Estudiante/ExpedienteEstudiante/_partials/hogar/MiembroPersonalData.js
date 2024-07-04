import React from 'react'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'

import {
  Input,
  Label,
  Form,
  Row,
  Col,
  FormGroup,
  Card,
  CardBody,
  CardTitle,
  FormFeedback
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import styled from 'styled-components'
import RequiredLabel from 'components/common/RequeredLabel'

const MiembroPersonalDataForm = props => {
  const currentDate = moment()
  const threeMonthsBefore = moment(currentDate).subtract(3, 'M')
  return (
    <Card>
      <CardBody>
        <CardTitle>Información general</CardTitle>
        <Form>
          <Row>
            <Col sm='12'>
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
                  invalid={props.fields.Nombre}
                />
                <FormFeedback>
                  {props.fields.Nombre && props.errors.Nombre}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm='12'>
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
                  invalid={props.fields.PrimerApellido}
                />
                <FormFeedback>
                  {props.fields.PrimerApellido && props.errors.PrimerApellido}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm='12'>
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
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>Sexo</Label>
                <Select

                  components={{ Input: CustomSelectInput }}
                  className={`react-select ${props.fields.SexoId && 'has-error'}`}
                  classNamePrefix='react-select'
                  options={props.selects.sexoTypes.map(item => { return ({ ...item, label: item.nombre, value: item.id }) })}
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
            </Col>
            <Col sm='12'>
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
                  selected={props.memberData.fechaNacimiento ? moment(props.memberData.fechaNacimiento).toDate() : null}
                  onChange={(e) => {
                      props.handleChange(e, 'fechaNacimiento')
                    }}
                />
                <FormFeedbackSpan>
                  {props.fields.FechaNacimiento && props.errors.FechaNacimiento}
                </FormFeedbackSpan>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>Conocido como</Label>
                <Input
                  type='text'
                  name='conocidoComo'
                  value={props.memberData.conocidoComo}
                  disabled={props.disabled || !props.editable}
                  onChange={(e) => {
                      props.handleChange(e)
                    }}
                />
                <FormFeedbackSpan>
                  {props.fields.conocidoComo && props.errors.conocidoComo}
                </FormFeedbackSpan>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>Género</Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  classNamePrefix='react-select'
                  options={props.selects.genderTypes.map(item => { return ({ ...item, label: item.nombre, value: item.id }) })}
                  placeholder=''
                  value={props.memberData.genero}
                  isDisabled={!props.editable}
                  onChange={(data) => {
                      props.handleChange(data, 'genero')
                    }}
                />
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <RequiredLabel>Escolaridad</RequiredLabel>
                <Select

                  components={{ Input: CustomSelectInput }}
                  className={`react-select ${props.fields.EscolaridadId && 'has-error'}`}
                  classNamePrefix='react-select'
                  options={props.selects.escolaridades.map(item => { return ({ ...item, label: item.nombre, value: item.id }) })}
                  placeholder=''
                  value={props.memberData.escolaridad}
                  onChange={(data) => {
                      props.handleChange(data, 'escolaridad')
                    }}
                  isDisabled={!props.editable}
                />
                <FormFeedbackSpan>
                  {props.fields.EscolaridadId && props.errors.EscolaridadId}
                </FormFeedbackSpan>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <RequiredLabel>Condición laboral</RequiredLabel>
                <Select

                  components={{ Input: CustomSelectInput }}
                  className={`react-select ${props.fields.CondicionLaboralId && 'has-error'}`}
                  classNamePrefix='react-select'
                  options={props.selects.condicionLaboral.map(item => { return ({ ...item, label: item.nombre, value: item.id }) })}
                  placeholder=''
                  value={props.memberData.condicionTrabajo}
                  isDisabled={!props.editable}
                  onChange={(data) => {
                      props.handleChange(data, 'condicionTrabajo')
                    }}
                />
                <FormFeedbackSpan>
                  {props.fields.CondicionLaboralId && 'La condición laboral es requerida'}
                  {props.fields.condicionLaboralId && 'La condición laboral es requerida'}
                </FormFeedbackSpan>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>Condición de discapacidad</Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  classNamePrefix='react-select'
                  options={props.selects.discapacidades.map(item => { return ({ ...item, label: item.nombre, value: item.id }) })}
                  placeholder=''
                  value={props.memberData.discapacidades}
                  isDisabled={!props.editable}
                  onChange={(data) => {
                      if (data) {
                        props.handleChange(data, 'discapacidades')
                      } else {
                        props.handleChange({}, 'discapacidades')
                      }
                    }}
                  isMulti
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}

const FormFeedbackSpan = styled.span`
    color: red;
`
export default MiembroPersonalDataForm
