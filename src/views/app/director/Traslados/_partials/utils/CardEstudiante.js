import React from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { calculateAge } from 'Utils/years'
import { makeStyles } from '@material-ui/core/styles'

import { Avatar } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: theme.spacing(2)
  }
}))

const CardEstudiante = (props) => {
  const classes = useStyles()
  const {
    identificacion,
    nombre,
    tipoIdentificacion,
    fechaNacimiento
  } = props.estudiante

  return (
    <div>
      <Row>
        <Col md={2} className='d-flex justify-content-center'>
          <Avatar className={classes.large} />
        </Col>
        <Col md={10}>
          <h4>
            <strong>Datos del estudiante:</strong>
          </h4>
          <p className='studentInfo'>
            Tipo de identificación: <span>{tipoIdentificacion}</span>
            <br />
            Identificación: <span>{identificacion}</span>
            <br />
            Nombre completo: <span>{nombre}</span>
            <br />
            Fecha de nacimiento:{' '}
            <span>
              {moment(fechaNacimiento).format('DD/MM/YYYY')} (
              {calculateAge(fechaNacimiento)})
            </span>
          </p>

          {props.traslado
            ? (
              <>
                <h4>
                  <strong>Datos de la solicitud:</strong>
                </h4>
                <p className='studentInfo'>
                  Fecha de confección:{' '}
                  <span>
                    {moment(props.traslado.fechaHoraSolicitud).format(
                      'DD/MM/YYYY h:mm'
                    )}
                  </span>
                  <br />
                  Fecha de resolución:{' '}
                  <span>
                    {props.traslado.estado
                      ? moment(props.traslado.fechaHoraRevision).format(
                        'DD/MM/YYYY h:mm'
                      )
                      : '--'}
                  </span>
                </p>
              </>
              )
            : null}
        </Col>
      </Row>
      <br />
      <br />
    </div>
  )
}

export default CardEstudiante
