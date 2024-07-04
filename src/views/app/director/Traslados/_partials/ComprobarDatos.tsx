import React, { useEffect } from 'react'
import {
  Row,
  Col,
  Card as ReactstrapCard,
  CardBody,
  FormGroup,
  Input,
  Label,
  CardTitle
} from 'reactstrap'

import styled from 'styled-components'
import CardEstudiante from './utils/CardEstudiante'

import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { setMotivoSolicitudText } from 'Redux/traslado/actions'
import LoaderContainer from 'Components/LoaderContainer'

const ComprobarDatos = (props) => {
  const state = useSelector((store) => {
    return {
      centroData: store.traslado.centroData,
      nivelData: store.traslado.nivelData,
      estudianteData: store.traslado.estudianteData,
      nombreInstitucion: store.authUser.currentInstitution.nombre,
      motivoSolicitud: store.traslado.motivoSolicitud,
      loading: store.traslado.loading
    }
  })
  const actions = useActions({
    setMotivoSolicitudText
  })

  useEffect(() => {
    actions.setMotivoSolicitudText('')
  }, [])

  const getValidText = (text, type) => {
    // type=1, Especialidad, 2 servicio

    if (text != null && text != undefined && text != '') {
      return text
    }

    switch (type) {
      case 1:
        return 'SIN ESPECIALIDAD'

      case 2:
        return 'SIN SERVICIO'
      case 3:
        return 'SIN DIRECCIÓN REGIONAL'
      case 4:
        return 'SIN DIRECTOR'
      case 5:
        return 'SIN UBICACIÓN'
    }
  }

  return (
    <Row>
      <Col xs={12} md={6}>
        <h2>Verificar los datos del estudiante a trasladar:</h2>
        <br />
        <CardEstudiante estudiante={state.estudianteData} />
      </Col>
      <Col xs={12} md={6}>
        <Card>
          <CardBody>
            <CardTitle>Motivo del traslado</CardTitle>
            <FormGroup>
              <Label>
                Por favor indique el motivo por el que se
                realiza el traslado *
              </Label>
              <Input
                type='textArea'
                required
                value={state.motivoSolicitud}
                onChange={(e) => {
								  const { value } = e.target
								  actions.setMotivoSolicitudText(value)
                }}
              />
            </FormGroup>
          </CardBody>
        </Card>
      </Col>
      <Col xs={12} md={6}>
        <Card>
          <CardBody>
            <CardTitle>Condición actual</CardTitle>
            <FormGroup>
              <Label>Centro educativo</Label>
              <Input
                readOnly
                value={state.estudianteData.centro}
              />
            </FormGroup>
            <FormGroup>
              <Label>Oferta educativa</Label>
              <Input
                readOnly
                value={state.estudianteData.oferta}
              />
            </FormGroup>
            <FormGroup>
              <Label>Modalidad</Label>
              <Input
                readOnly
                value={state.estudianteData.modalidad}
              />
            </FormGroup>
            <FormGroup>
              <Label>Especialidad</Label>
              <Input
                readOnly
                value={getValidText(
								  state.estudianteData.especialidad,
								  1
                )}
              />
            </FormGroup>
            <FormGroup>
              <Label>Servicio</Label>
              <Input
                readOnly
                value={getValidText(
								  state.estudianteData.servicio,
								  2
                )}
              />
            </FormGroup>
            <FormGroup>
              <Label>Nivel</Label>
              <Input
                readOnly
                value={state.estudianteData.nivel}
              />
            </FormGroup>
          </CardBody>
        </Card>
      </Col>

      <Col xs={12} md={6}>
        {props.tipoTraslado == 1
          ? (
            <Card>
              <CardBody>
                <CardTitle>Condición propuesta</CardTitle>
                <FormGroup>
                  <Label>Código</Label>
                  <Input readOnly value={state.centroData.codigo} />
                </FormGroup>
                <FormGroup>
                  <Label>Centro educativo</Label>
                  <Input readOnly value={state.centroData.nombre} />
                </FormGroup>
                <FormGroup>
                  <Label>Tipo de centro educativo</Label>
                  <Input readOnly value={state.centroData.tipo} />
                </FormGroup>
                <FormGroup>
                  <Label>Dirección Regional de Educación - Circuito</Label>
                  <Input
                    readOnly
                    value={getValidText(state.centroData.direccionRegional, 3)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Director</Label>
                  <Input
                    readOnly
                    value={getValidText(state.centroData.director, 4)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Provincia / Cantón / Distrito</Label>
                  <Input
                    readOnly
                    value={getValidText(state.centroData.locacion, 5)}
                  />
                </FormGroup>
              </CardBody>
            </Card>
            )
          : (
            <Card>
              <CardBody>
                <CardTitle>Condición propuesta</CardTitle>
                <FormGroup>
                  <Label>Institución</Label>
                  <Input readOnly value={state.nombreInstitucion} />
                </FormGroup>
                <FormGroup>
                  <Label>Oferta educativa</Label>
                  <Input readOnly value={state.nivelData.ofertaNombre} />
                </FormGroup>
                <FormGroup>
                  <Label>Modalidad</Label>
                  <Input readOnly value={state.nivelData.modalidadNombre} />
                </FormGroup>
                <FormGroup>
                  <Label>Especialidad</Label>
                  <Input
                    readOnly
                    value={getValidText(state.nivelData.especialidadNombre, 1)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Servicio</Label>
                  <Input
                    readOnly
                    value={getValidText(state.nivelData.servicioNombre, 2)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Nivel</Label>
                  <Input readOnly value={state.nivelData.nivelNombre} />
                </FormGroup>
              </CardBody>
            </Card>
            )}
      </Col>
      {state.loading && <LoaderContainer />}
    </Row>
  )
}

const Card = styled(ReactstrapCard)`
	margin: 0.5rem;
`

export default ComprobarDatos
