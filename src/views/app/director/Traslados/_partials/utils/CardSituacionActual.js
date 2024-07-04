import React from 'react'
import { Row, Col } from 'reactstrap'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: theme.spacing(2)
  }
}))

const CardSituacionActual = (props) => {
  const classes = useStyles()
  const { oferta, modalidad, servicio, especialidad, nivel } = props.estudiante

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
    }
  }

  return (
    <div>
      <Row>
        <Col md={12}>
          <h4>Situación educativa actual:</h4>
          <p className='studentInfo'>
            Oferta: <span>{oferta}</span>
            <br />
            Modalidad: <span>{modalidad}</span>
            <br />
            Servicio: <span>{getValidText(servicio, 2)}</span>
            <br />
            Especialidad: <span>{getValidText(especialidad, 1)}</span>
            <br />
            Nivel: <span>{nivel}</span>
          </p>
        </Col>
      </Row>
      <br />
      <br />
    </div>
  )
}

export default CardSituacionActual
