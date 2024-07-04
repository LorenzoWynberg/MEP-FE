import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'

import { Row, Col } from 'reactstrap'
import colors from 'Assets/js/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  informationCard: {
    background: colors.primary,
    borderRadius: '50px'
  },
  information: {
    width: '100%',
    float: 'left',
    color: '#fff'
  },
  flexFlowColum: {
    flexFlow: 'column'
  }
}))

const InformaCard = ({ student }) => {
  const classes = useStyles()
  return (
    <Col xs='12'>
      <Row className={`${classes.informationCard} mb-4 p-1`}>
        <Col
          className='p-0 d-flex align-items-center pl-sm-2'
          xs='auto'
          sm='auto'
        >
          <Avatar
            alt='Remy Sharp'
            src='/assets/img/profile-pic-generic.png'
            className={classes.large}
          />
        </Col>
        <Col xs='8' sm='8' md='10'>
          <Row>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center`}
            >
              <span className={`${classes.information}`}>[Nombre completo] {student.nombreCompleto}</span>
              <span className={`${classes.information}`}>
                [Identificación] {student.identificacion}
              </span>
              <span className={`${classes.information}`}>
                [Grupo] {student.grupo}
              </span>
            </Col>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-sm-max-none`}
            >
              <span className={`${classes.information}`}>
                [Oferta educativa] {student.oferta}
              </span>
              <span className={`${classes.information}`}>
                [Modalidad] {student.modalidad}
              </span>
              <span className={`${classes.information}`}>
                [Nivel] {student.nivel}
              </span>
            </Col>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-md-max-none`}
            >
              <span className={`${classes.information}`}>
                [Identificador del centro educativo] {student.centroCodigo}
              </span>
              <span className={`${classes.information}`}>
                [Nombre del centro educativo] {student.centro}
              </span>
              <span className={`${classes.information}`}>
                [Estado del estudiante en el curso lectivo] {student.estadoCursoLectivo ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  )
}
export default InformaCard
