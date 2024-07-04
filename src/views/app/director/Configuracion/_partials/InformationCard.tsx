import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'

import { ReactComponent as InstImg } from 'Assets/images/front_institution.svg'
import { useTranslation } from 'react-i18next'

import colors from 'Assets/js/colors'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { LOAD_LOCATION } from '../../../../../redux/configuracion/types'
import {
  getlocationElementById, GetResponseByInstitutionAndFormNameUsingRedux
} from '../../../../../redux/formularioCentroResponse/actions'
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
    background: colors.getColor(),
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

enum idParsed {
	province = '75bdf8ac-c36e-e47e-a007-37cdadbf954b',
	canton = 'cd492ff2-eebd-3976-163e-5b88bc3684a0',
	distrito = '66f130cc-0656-ff48-8710-708f230a9f9b',
	poblado = '9905c516-75b5-6c94-4703-507b2dfc00d0'
}

const InformationCard = ({ data }) => {
  const { t } = useTranslation()

  const [locationInfo, setLocationInfo] = useState({})
  const actions = useActions({
    GetResponseByInstitutionAndFormNameUsingRedux
  })
  const state = useSelector((store) => {
    return {
      institucion: store.configuracion.currentInstitution,
      location: store.configuracion.location
    }
  })

  useEffect(() => {
    actions.GetResponseByInstitutionAndFormNameUsingRedux(
      state.institucion.id,
      'ubicacionGeografica',
      LOAD_LOCATION
    )
  }, [state.institucion.id])

  useEffect(() => {
    const loadData = async () => {
      const provinceRes = await getlocationElementById(
        'Provincia',
        state.location[idParsed.province]
      )
      const cantonRes = await getlocationElementById(
        'Canton',
        state.location[idParsed.canton]
      )
      const distritoRes = await getlocationElementById(
        'Distrito',
        state.location[idParsed.distrito]
      )

      setLocationInfo({
        provincia: provinceRes.nombre,
        canton: cantonRes.nombre,
        distrito: distritoRes.nombre
      })
    }

    if (state.location[idParsed.province]) {
      loadData()
    }
  }, [state.location])

  const classes = useStyles()
  return (
    <Col xs='12'>
      <Row className={`${classes.informationCard} mb-4 p-1`}>
        <Col
          className='p-0 d-flex align-items-center pl-sm-2'
          xs='auto'
          sm='auto'
        >

          <InstImg width='56px' height='56px' viewBox='0 0 71 71' fill={colors.getColor()} />

          {/* <Avatar
						alt="Remy Sharp"
						src={
							data?.fotografiaUrl
								? data.fotografiaUrl
								: '/assets/img/centro-educativo.png'
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
                {t('configuracion>centro_educativo>ver_centro_educativo>centro_educativo', 'Centro educativo')}: {state.institucion.nombre}
              </span>
              <span className={`${classes.information}`}>
                {t('configuracion>centro_educativo>ver_centro_educativo>codigo', 'Código')}: {state.institucion.codigo}
              </span>
              <span className={`${classes.information}`}>
                {t('configuracion>centro_educativo>ver_centro_educativo>codigo_presupuestario', 'Código presupuestario')}:{' '}
                {state.institucion.codigoPresupuestario}
              </span>
            </Col>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-sm-max-none`}
            >
              <span className={`${classes.information}`}>
                {t('configuracion>centro_educativo>ver_centro_educativo>direccion_regional', 'Dirección regional')}:{' '}
                {state.institucion.regionNombre}
              </span>
              <span className={`${classes.information}`}>
                {t('configuracion>centro_educativo>ver_centro_educativo>circuito', 'Circuito')}: {state.institucion.circuitoNombre}
              </span>
              <span className={`${classes.information}`}>
                {t('configuracion>centro_educativo>ver_centro_educativo>tipo_de_centro_educativo', 'Tipo de centro educativo')}:{' '}
                {state.institucion.esPrivado
								  ? t('configuracion>centro_educativo>ver_centro_educativo>privado', 'Privado')
								  : t('configuracion>centro_educativo>ver_centro_educativo>publico', 'Público')}
              </span>
            </Col>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-md-max-none`}
            >
              <span className={`${classes.information}`}>
                {t('configuracion>centro_educativo>ver_centro_educativo>provincia', 'Provincia')}: {locationInfo.provincia}
              </span>
              <span className={`${classes.information}`}>
                {t('configuracion>centro_educativo>ver_centro_educativo>canton', 'Cantón')}: {locationInfo.canton}
              </span>
              <span className={`${classes.information}`}>
                {t('configuracion>centro_educativo>ver_centro_educativo>distrito', 'Distrito')}x: {locationInfo.distrito}
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  )
}
export default InformationCard
