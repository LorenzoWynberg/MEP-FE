import React from 'react'
import { Row, Col, FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import IntlMessages from '../../../../../../helpers/IntlMessages'
import ReactInputMask from 'react-input-mask'
import { useTranslation } from 'react-i18next'

const InformacionContacto = (props) => {
  const { t } = useTranslation()
  return (
    <Row>
      <Col sm='12' md='12' />
      <Col sm='12' md='12'>
        <FormGroup>
          <Label>
            {t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>tel_principal', '*Teléfono principal')}
          </Label>
          <ReactInputMask
            mask='9999-9999'
            value={props.personalData.telefono}
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
      </Col>
      <Col sm='12' md='12'>
        <FormGroup>
          <Label>
            {t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>tel_alternativo', 'Teléfono alternativo')}
          </Label>
          <ReactInputMask
            type='text'
            mask='9999-9999'
            name='telefonoSecundario'
            value={props.personalData.telefonoSecundario}
            disabled={!props.editable}
            invalid={props.fields.TelefonoSecundario}
            onChange={(e) => {
              props.handleChange(e)
            }}
          >
            {(inputProps) => (
              <Input {...inputProps} disabled={!props.editable} />
            )}
          </ReactInputMask>
          <FormFeedback>
            {props.fields.TelefonoSecundario &&
              props.errors.TelefonoSecundario}
          </FormFeedback>
        </FormGroup>
      </Col>
      <Col sm='12' md='12'>
        <FormGroup>
          <Label>
            {t('estudiantes>matricula_estudiantil>matricular_estudiante>encargados>agregar>correo', '*Correo electrónico')}
          </Label>
          <Input
            type='email'
            name='email'
            value={props.personalData.email}
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
      </Col>
    </Row>
  )
}
export default InformacionContacto
