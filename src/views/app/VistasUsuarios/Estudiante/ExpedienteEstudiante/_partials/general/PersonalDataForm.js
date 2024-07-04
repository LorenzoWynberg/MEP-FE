import React, { useState, useEffect } from 'react'
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
import styled from 'styled-components'
import RequiredLabel from 'components/common/RequeredLabel'

const PersonalDataForm = (props) => {
  const [errorFields, setErrorFields] = useState(
    props.identification.errorFields
  )
  const [errorMessages, setErrorMessages] = useState(
    props.identification.errorMessages
  )

  useEffect(() => {
    setErrorFields(props.identification.errorFields)
    setErrorMessages(props.identification.errorMessages)
  }, [props.identification])

  return (
    <Card>
      <CardBody>
        <CardTitle>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>titulo','Datos personales')}</CardTitle>
        <Form>
          <Row>
            <Col sm='12'>
              <FormGroup>
                <RequiredLabel>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>nombre','Nombre')}</RequiredLabel>
                <Input
                  type='text'
                  name='nombre'
                  value={props.personalData.nombre}
                  disabled={props.disabled}
                  invalid={errorFields.Nombre}
                  onChange={props.handleChange}
                />
                <FormFeedback>{errorMessages.Nombre}</FormFeedback>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <RequiredLabel>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>apellido_1','Primer apellido')}</RequiredLabel>
                <Input
                  type='text'
                  name='primerApellido'
                  value={props.personalData.primerApellido}
                  disabled={props.disabled}
                  invalid={errorFields.PrimerApellido}
                  onChange={props.handleChange}
                />
                <FormFeedback>{errorMessages.PrimerApellido}</FormFeedback>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>apellido_2','Segundo apellido')}</Label>
                <Input
                  type='text'
                  name='segundoApellido'
                  value={props.personalData.segundoApellido}
                  onChange={props.handleChange}
                  disabled={props.disabled}
                />
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>sexo','Sexo')}</Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  classNamePrefix='react-select'
                  options={props.selects.sexoTypes.map(item => ({ ...item, label: item.nombre, value: item.id }))}
                  placeholder=''
                  value={props.personalData.sexo}
                  onChange={(data) => {
                    props.handleChange(data, 'sexo')
                  }}
                  isDisabled={props.disabled}
                />
                <FormFeedbackSpan>{errorMessages.SexoId}</FormFeedbackSpan>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <RequiredLabel>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>nacimiento','Fecha de nacimiento')}</RequiredLabel>
                <Input
                  type='text'
                  name='fechaDeNacimiento'
                  value={props.personalData.fechaDeNacimiento}
                  disabled={props.disabled}
                  onChange={(data) => {
                    props.handleChange(data, 'sexo')
                  }}
                  invalid={errorFields.FechaDeNacimiento}
                />
                <FormFeedback>
                  {errorMessages.FechaDeNacimiento}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label>{t('estudiantes>expediente>info_gen>info_gen>datos_personales>edad','Edad')}</Label>
                <Input
                  type='number'
                  name='id'
                  value={props.personalData.edad}
                  disabled={props.disabled}
                  invalid={errorFields.Edad}
                />
                <FormFeedback>{errorMessages.Edad}</FormFeedback>
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
export default PersonalDataForm
