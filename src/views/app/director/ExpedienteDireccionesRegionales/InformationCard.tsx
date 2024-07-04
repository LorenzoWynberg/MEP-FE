import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'

import { Row, Col } from 'reactstrap'
import colors from 'Assets/js/colors'
import { useSelector } from 'react-redux'
import {
  GetResponseByInstitutionAndFormNameUsingRedux,
  getlocationElementById
} from 'Redux/formularioCentroResponse/actions'
import { useActions } from 'Hooks/useActions'
import { LOAD_LOCATION } from 'Redux/configuracion/types'
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

interface IState {
  configuracion: {
    currentRegional: {
      id: number
      codigo: string
      codigoPresupuestario: string
      nombre: string
      esActivo: boolean
      fechaInsercion: string
      fechaActualizacion: string
      telefono: any
      correoElectronico: any
      codigoDgsc2: number
      conocidoComo: any
      imagenUrl: string
      nombreDirector: string
      ubicacionGeograficaJson: string
    }
  }
}

enum idParsed {
  provincia = 'provinciaId',
  canton = 'cantonId',
  distrito = 'distritoId',
  poblado = 'pobladoId',
  direccionExacta = 'direccionExacta',
  longitude = 'longitud',
  latitude = 'latitud',
}

const InformationCard = () => {
  const { t } = useTranslation()
  const [locationInfo, setLocationInfo] = useState<{
    provincia: string,
    canton: string,
    distrito: string,
  }>(null)
  const actions = useActions({ GetResponseByInstitutionAndFormNameUsingRedux })
  const state = useSelector((store: IState) => {
    return {
      currentRegional: store.configuracion?.expedienteRegional || store.configuracion?.currentRegional
    }
  })

  useEffect(() => {
    const loadData = async () => {
      const location = JSON.parse(state.currentRegional.ubicacionGeograficaJson)
      const provinceRes = await getlocationElementById(
        'Provincia',
        location[idParsed.provincia]
      )
      const cantonRes = await getlocationElementById(
        'Canton',
        location[idParsed.canton]
      )
      const distritoRes = await getlocationElementById(
        'Distrito',
        location[idParsed.distrito]
      )

      setLocationInfo({
        provincia: provinceRes.nombre,
        canton: cantonRes.nombre,
        distrito: distritoRes.nombre
      })
    }

    if (state.currentRegional.ubicacionGeograficaJson) {
      loadData()
    }
  }, [state.currentRegional])

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
            src='/assets/img/centro-educativo.png'
            className={classes.large}
          />
        </Col>
        <Col xs='8' sm='8' md='10'>
          <Row>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-sm-max-none`}
            >
              <span className={`${classes.information}`}>
                {t('supervision_circ>expediente>dir_reg', 'Dirección regional')}: {state?.currentRegional?.nombre}
              </span>
              <span className={`${classes.information}`}>
                {t('supervision_circ>expediente>codigo_mep', 'Código MEP')}: {state?.currentRegional?.codigo}
              </span>
              <span className={`${classes.information}`}>
                {t('supervision_circ>expediente>codigo_presupuestario', 'Código presupuestario')}: {state?.currentRegional?.codigoPresupuestario}
              </span>
            </Col>
            <Col
              xs='12'
              sm='6'
              lg='4'
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-md-max-none`}
            >
              <span className={`${classes.information}`}>
                {t('supervision_circ>ver>provincia', 'Provincia')}: {locationInfo?.provincia}
              </span>
              <span className={`${classes.information}`}>
                {t('supervision_circ>ver>canton', 'Cantón')}: {locationInfo?.canton}
              </span>
              <span className={`${classes.information}`}>
                {t('supervision_circ>ver>distrito', 'Distrito')}: {locationInfo?.distrito}
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  )
}
export default InformationCard
