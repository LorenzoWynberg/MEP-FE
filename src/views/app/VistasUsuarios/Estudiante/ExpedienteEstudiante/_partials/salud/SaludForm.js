import React from 'react'

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

import { EditButton } from 'components/EditButton'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const SaludForm = (props) => {
  const { t } = useTranslation()

  const { handleSubmit } = useForm()
  return (
    <>
      <h4>{t('estudiantes>expediente>salud>titulo', 'Información de salud')}</h4>
      <br />
      <Row>
        <Col md='6' sm='12'>
          <Form onSubmit={handleSubmit(props.sendData)}>
            <Card>
              <CardBody>
                <CardTitle>Valoración nutricional</CardTitle>
                <Row>
                  <Col sm='12'>
                    <FormGroup>
                      <Label>Número de seguro social</Label>
                      <Input
                        type='text'
                        name='seguroSocial'
                        value={props.data.seguroSocial}
                        disabled={!props.editable}
                        onChange={(e) => {
                          props.handleChange(e)
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm='12'>
                    <Row>
                      <Col sm='4'>
                        <FormGroup>
                          <Label>Peso (kg)</Label>
                          <Input
                            type='number'
                            name='peso'
                            value={props.data.peso ? props.data.peso : ''}
                            disabled={!props.editable}
                            pattern='^\d*(\.\d{0,1})?$'
                            placeholder='Peso'
                            max={250}
                            min={0}
                            step='.1'
                            onChange={(e) => {
                            props.handleChange(e)
                          }}

                            invalid={props.fields.Peso}
                          />
                          <FormFeedback>{props.messages.Peso}</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col sm='4'>
                        <FormGroup>
                          <Label>Talla (cm)</Label>
                          <Input
                            type='number'
                            name='talla'
                            value={props.data.talla ? props.data.talla : ''}
                            disabled={!props.editable}
                            min={1}
                            placeholder='Talla'
                            max={250}
                            step='1'
                            pattern='[0-9]'
                            onChange={(e) => {
                            const newValue = parseInt(e.target.value)
                            props.handleChange({ target: { name: e.target.name, value: Math.floor(newValue) } })
                          }}
                            invalid={props.fields.Talla}
                          />
                          <FormFeedback>{props.messages.Talla}</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col sm='4'>
                        <FormGroup>
                          <Label>Índice de masa corporal (imc)</Label>
                          <Input
                            type='number'
                            name='imc'
                            value={props.data.imc ? props.data.imc : ''}
                            disabled
                            readOnly
                            onChange={(e) => {
                            props.handleChange(e)
                          }}
                            invalid={props.fields.IMC}
                          />
                          <FormFeedback>{props.messages.IMC}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <div className='container-center my-5 mb-3'>
              <EditButton
                editable={props.editable}
                setEditable={props.setEditable}
                loading={props.loading}
              />
            </div>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default SaludForm
