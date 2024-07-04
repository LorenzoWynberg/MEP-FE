import React from 'react'
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from 'reactstrap'
import IntlMessages from '../../../../../../../helpers/IntlMessages'
import ReactInputMask from 'react-input-mask'
import RequiredLabel from 'components/common/RequeredLabel'

const InformacionContacto = props => {
  return (
    <Card className='mt-5'>
      <CardBody>
        <Row>
          <Col sm='12' md='12'>
            <IntlMessages id='menu.info-contacto' />
          </Col>
          <Col sm='12' md='12'>
            <FormGroup>
              <RequiredLabel>
                <IntlMessages id='form.phoneNumber' />
              </RequiredLabel>
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
                {(inputProps) =>
                  <Input
                      {...inputProps}
                      disabled={!props.editable}
                    />}
              </ReactInputMask>
              <FormFeedback>
                {props.fields.Telefono && props.errors.Telefono.replace("'Telefono'", 'Telefóno')}
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col sm='12' md='12'>
            <FormGroup>
              <Label>
                <IntlMessages id='form.secondPhoneNumber' />
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
                {(inputProps) =>
                  <Input
                      {...inputProps}
                      disabled={!props.editable}
                    />}
              </ReactInputMask>
              <FormFeedback>
                {props.fields.TelefonoSecundario && props.errors.TelefonoSecundario}
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col sm='12' md='12'>
            <FormGroup>
              <RequiredLabel>
                <IntlMessages id='form.email' />
              </RequiredLabel>
              <Input
                type='email' name='email' value={props.personalData.email} disabled={!props.editable} onChange={(e) => {
                  props.handleChange(e)
                }} invalid={props.fields.Email}
              />
              <FormFeedback>
                {props.fields.Email && props.errors.Email.replace("'Email'", 'Correo electrónico')}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}
export default InformacionContacto
