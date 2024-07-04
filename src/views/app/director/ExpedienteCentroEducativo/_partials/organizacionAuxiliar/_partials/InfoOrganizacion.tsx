import React from 'react'
import { Card, CardBody, Row, Form, Col, Input, Label, FormFeedback, FormGroup } from 'reactstrap'

import { useForm } from 'react-hook-form'
import ReactInputMask from 'react-input-mask'
import LoaderContainer from 'Components/LoaderContainer'
import { useTranslation } from 'react-i18next'

import { EditButton } from 'Components/EditButton'

const InfoOrganizacion = (props) => {
  const { t } = useTranslation()

  const { register, handleSubmit, setValue, errors, reset } = useForm()

  return (
    <Card>
      <Form onSubmit={handleSubmit(props.sendData)}>
        <CardBody style={{ margin: 20 }}>
          <Row>
            <Col md={12} xs={12}>
              <br />
              <h4>{props.titulo}</h4>
              <br />
            </Col>
            <Col md={6} xs={12}>
              <FormGroup>
                <Label>
                  {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>personeria_juridica', 'Personería jurídica')} {props.readOnly ? '' : '*'}
                </Label>
                <Input
                  name='personeriaJuridica'
                  type='text'
                  disabled={!props.editableOrganizacion}
                  max={25}
                  invalid={errors.personeriaJuridica}
                  value={props.data.personeriaJuridica}
                  onInput={(e) => {
                    if (e.target.value.length > 25) {
                      e.target.value = e.target.value.substr(0, 25)
                    }
                  }}
                  onChange={props.handleDataChange} innerRef={register({
                    required: !props.readOnly,
                    maxLength: 25
                  })}
                />
                {errors.personeriaJuridica &&
                  <FormFeedback>
                    <p>
                        {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>mensaje_error', 'Este campo es requerido y debe ser menor a 25 caracteres')}
                      </p>
                  </FormFeedback>}
              </FormGroup>
            </Col>
            <Col md={6} xs={12}>
              <FormGroup>
                <Label>
                  {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>razon_social', 'Razón social')} {props.readOnly ? '' : '*'}
                </Label>
                <Input
                  name='razonSocial' type='text' invalid={errors.razonSocial} max={100} disabled={!props.editableOrganizacion} onInput={(e) => {
                    if (e.target.value.length > 100) {
                      e.target.value = e.target.value.substr(0, 100)
                    }
                  }} value={props.data.razonSocial} onChange={props.handleDataChange} innerRef={register({
                    required: !props.readOnly,
                    maxLength: 100
                  })}
                />
                {errors.razonSocial &&
                  <FormFeedback>
                    <p>
                        {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>mensaje_error', 'Este campo es requerido y debe ser menor a 25 caracteres')}
                      </p>

                  </FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6} xs={12}>
              <FormGroup>
                <Label>
                  {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>telefono_oficial', 'Teléfono oficial')} {props.readOnly ? '' : '*'}
                </Label>
                <ReactInputMask
                  mask='9999-9999'
                  type='text'
                  name='telefono'
                  id='telefono'
                                    // placeholder="8888-8888"
                  value={props.data.telefono}
                  disabled={!props.editableOrganizacion}
                  onChange={props.handleDataChange}
                  invalid={errors.telefono}
                  innerRef={register({
                    required: !props.readOnly,
                    maxLength: 25
                  })}
                >
                  {(inputProps) => (
                    <Input {...inputProps} disabled={!props.editableOrganizacion} />
                  )}
                </ReactInputMask>

                {errors.telefono &&
                  <FormFeedback>
                    <p>
                        {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>mensaje_error', 'Este campo es requerido y debe ser menor a 25 caracteres')}
                      </p>
                  </FormFeedback>}
              </FormGroup>
            </Col>
            <Col md={6} xs={12}>
              <FormGroup>
                <Label>
                  {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>correo_oficial', 'Correo oficial')} {props.readOnly ? '' : '*'}
                </Label>
                <Input
                  name='email' type='email' invalid={errors.email} max={25} disabled={!props.editableOrganizacion} value={props.data.email} onChange={props.handleDataChange} innerRef={register({
                    required: !props.readOnly,
                    maxLength: 25
                  })}
                />
                {errors.email &&
                  <FormFeedback>
                    <p>
                        {t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>mensaje_error', 'Este campo es requerido y debe ser menor a 25 caracteres')}
                      </p>
                  </FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <br />
          {props.editableOrganizacion !== undefined && <Row>
            <Col xs={12} md={12} style={{ textAlign: 'center' }}>
              <EditButton editable={props.editableOrganizacion} setEditable={props.setEditableOrganizacion} />
            </Col>
                                                       </Row>}
        </CardBody>
      </Form>
      {props.loadingOrganization ? <LoaderContainer /> : null}
    </Card>

  )
}

export default InfoOrganizacion
