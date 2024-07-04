import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'

import { Row, Col } from 'reactstrap'

import colors from 'assets/js/colors'
import { getHistorialMatriculaEstudiante } from '../../../../../../redux/identificacion/actions'
import { useActions } from '../../../../../../hooks/useActions'
import { useSelector } from 'react-redux'

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
// this should be removed when the other services are ready
const hardCodedData = {
  grupo: 'Grupo',
  ofertaEducativa: 'Oferta educativa',
  Modalidad: 'Modalidad',
  nivel: 'Nivel',
  idCentroEducativo: 'Identificador del centro educativo',
  nombreCentroEducativo: 'Nombre del centro educativo',
  estadoPeriodo: 'Estado del estudiante en el periodo'
}

const InformationCard = ({ data }) => {
  const [datos, setDatos] = useState([])
  const classes = useStyles()
  const actions = useActions({ getHistorialMatriculaEstudiante })

  const state = useSelector((store) => {
    return {
      historialMatricula: store.identification.matriculaHistory
    }
  })

  /* useEffect(() => {
    actions.getHistorialMatriculaEstudiante(data.idEstudiante)
  }, [data]) */

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
            src={data.fotografiaUrl ? data.fotografiaUrl : '/assets/img/profile-pic-generic.png'}
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
              <span className={`${classes.information}`}>Nombre: {data.nombreEstudiante}</span>
              <span className={`${classes.information}`}>
                Identificación: {data.identificacion}
              </span>
              <span className={`${classes.information}`}>Grupo: {state.historialMatricula[state.historialMatricula.length - 1]?.grupo}</span>
            </Col>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-sm-max-none`}
            >
              <span className={`${classes.information}`}>
                {hardCodedData.ofertaEducativa}:{state.historialMatricula[state.historialMatricula.length - 1]?.oferta}
              </span>
              <span className={`${classes.information}`}>
                {hardCodedData.Modalidad}:{state.historialMatricula[state.historialMatricula.length - 1]?.modalidad}
              </span>
              <span className={`${classes.information}`}>{hardCodedData.nivel}:{state.historialMatricula[state.historialMatricula.length - 1]?.nivel}</span>
            </Col>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-md-max-none`}
            >
              <span className={`${classes.information}`}>
                {hardCodedData.idCentroEducativo}:{state.historialMatricula[state.historialMatricula.length - 1]?.codigoInstitucion}
              </span>
              <span className={`${classes.information}`}>
                {hardCodedData.nombreCentroEducativo}:{state.historialMatricula[state.historialMatricula.length - 1]?.institucion}
              </span>
              <span className={`${classes.information}`}>
                {hardCodedData.estadoPeriodo}:{' '}
                <strong style={{ color: state.historialMatricula[state.historialMatricula.length - 1]?.estadoMatricula == 'Activo' ? '#54ff2c' : 'red' }}> {state.historialMatricula[state.historialMatricula.length - 1]?.condicion.toUpperCase()}</strong>
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  )
}
export default InformationCard
