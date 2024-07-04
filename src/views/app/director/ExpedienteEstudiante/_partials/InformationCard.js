import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'

import { Row, Col } from 'reactstrap'

import colors from '../../../../../assets/js/colors'
import { getHistorialMatriculaEstudiante } from '../../../../../redux/identificacion/actions'
import { useActions } from '../../../../../hooks/useActions'
import { useSelector } from 'react-redux'
import { ReactComponent as InstImg } from 'Assets/images/front_institution.svg'
import { useTranslation } from 'react-i18next'

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

const InformationCard = ({ data }) => {
  const { t } = useTranslation()

  const [datos, setDatos] = useState([])
  const classes = useStyles()
  const actions = useActions({ getHistorialMatriculaEstudiante })

  // this should be removed when the other services are ready
  const hardCodedData = {
    grupo: t('estudiantes>expediente>header>grupo', 'Grupo'),
    ofertaEducativa: t(
      'estudiantes>expediente>header>oferta_edu',
      'Oferta educativa'
    ),
    Modalidad: t('estudiantes>expediente>header>modalidad', 'Modalidad'),
    nivel: t('estudiantes>expediente>header>nivel', 'Nivel'),
    idCentroEducativo: t('estudiantes>expediente>header>codigo', 'Código'),
    nombreCentroEducativo: t(
      'estudiantes>expediente>header>nombre_ce',
      'Nombre del centro educativo'
    ),
    estadoPeriodo: t(
      'estudiantes>expediente>header>estado_est',
      'Estado del estudiante en el periodo'
    )
  }

  const state = useSelector((store) => {
    return {
      historialMatricula: store.identification.matriculaHistory
    }
  })

  useEffect(() => {
    actions.getHistorialMatriculaEstudiante(data.idEstudiante)
  }, [data])

  return (
    <Col xs='12'>
      <Row className={`${classes.informationCard} mb-4 p-1`}>
        <Col
          className='p-0 d-flex align-items-center pl-sm-2'
          xs='auto'
          sm='auto'
        >
          <InstImg
            width='56px'
            height='56px'
            viewBox='0 0 71 71'
            fill={colors.getColor()}
          />
          {/* <Avatar
						alt="Remy Sharp"
						src={
							data.fotografiaUrl
								? data.fotografiaUrl
								: '/assets/img/profile-pic-generic.png'
						}
						className={classes.large}
					/> */}
        </Col>
        <Col xs='8' sm='8' md='10'>
          <Row>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center`}
            >
              <span className={`${classes.information}`}>
                {t(
								  'estudiantes>expediente>header>nombre',
								  'Nombre'
                )}
                : {data.nombreEstudiante}
              </span>
              <span className={`${classes.information}`}>
                {t(
								  'estudiantes>expediente>header>is',
								  'Identificación'
                )}
                : {data.identificacion}
              </span>
              <span className={`${classes.information}`}>
                {t(
								  'estudiantes>expediente>header>grupo',
								  'Grupo'
                )}
                :{' '}
                {
									state.historialMatricula[
									  state.historialMatricula.length - 1
									]?.grupo
								}
              </span>
            </Col>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-sm-max-none`}
            >
              <span className={`${classes.information}`}>
                {hardCodedData.ofertaEducativa}:
                {
									state.historialMatricula[
									  state.historialMatricula.length - 1
									]?.oferta
								}
              </span>
              <span className={`${classes.information}`}>
                {hardCodedData.Modalidad}:
                {
									state.historialMatricula[
									  state.historialMatricula.length - 1
									]?.modalidad
								}
              </span>
              <span className={`${classes.information}`}>
                {hardCodedData.nivel}:
                {
									state.historialMatricula[
									  state.historialMatricula.length - 1
									]?.nivel
								}
              </span>
            </Col>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-md-max-none`}
            >
              <span className={`${classes.information}`}>
                {hardCodedData.idCentroEducativo}:
                {
									state.historialMatricula[
									  state.historialMatricula.length - 1
									]?.codigoInstitucion
								}
              </span>
              <span className={`${classes.information}`}>
                {hardCodedData.nombreCentroEducativo}:
                {
									state.historialMatricula[
									  state.historialMatricula.length - 1
									]?.institucion
								}
              </span>
              <span className={`${classes.information}`}>
                {hardCodedData.estadoPeriodo}:{' '}
                <strong
                  style={{
									  color:
											state.historialMatricula[
											  state.historialMatricula
											    .length - 1
											]?.estadoMatricula == 'Activo'
											  ? '#54ff2c'
											  : '#fff'
                  }}
                >
                  {' '}
                  {state.historialMatricula[
									  state.historialMatricula.length - 1
                  ]?.condicion.toUpperCase()}
                </strong>
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  )
}
export default InformationCard
