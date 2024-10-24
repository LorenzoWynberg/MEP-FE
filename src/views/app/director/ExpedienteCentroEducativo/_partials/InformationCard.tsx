import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'

import { Row, Col } from 'reactstrap'
import colors from 'Assets/js/colors'
import { useSelector } from 'react-redux'
import {
	GetResponseByInstitutionAndFormNameUsingRedux,
	getlocationElementById
} from '../../../../../redux/formularioCentroResponse/actions'
import { useActions } from 'Hooks/useActions'
import { LOAD_LOCATION } from '../../../../../redux/configuracion/types'

import styled from 'styled-components'
import { ReactComponent as InstImg } from 'Assets/images/front_institution.svg'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
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

enum idParsed {
	province = '75bdf8ac-c36e-e47e-a007-37cdadbf954b',
	canton = 'cd492ff2-eebd-3976-163e-5b88bc3684a0',
	distrito = '66f130cc-0656-ff48-8710-708f230a9f9b',
	poblado = '9905c516-75b5-6c94-4703-507b2dfc00d0'
}

const InformationCard = ({ data }) => {
	const { t } = useTranslation()
	const [locationInfo, setLocationInfo] = useState<any>({})
	const actions = useActions({ GetResponseByInstitutionAndFormNameUsingRedux })
	const state = useSelector((store: any) => {
		return {
			institucion: store.authUser?.currentInstitution,
			location: store.configuracion?.location
		}
	})

	useEffect(() => {
		actions.GetResponseByInstitutionAndFormNameUsingRedux(
			state.institucion.id,
			'ubicacionGeografica',
			LOAD_LOCATION
		)
	}, [state?.institucion?.id])

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
	/* return (
    <Col xs="12">
      <Row className={`${classes.informationCard} mb-4 p-1`}>
        <Col
          className={`p-0 d-flex align-items-center pl-sm-2`}
          xs="auto"
          sm="auto"
        >
          <Avatar
            alt="Remy Sharp"
            src={
              data?.fotografiaUrl
                ? data.fotografiaUrl
                : '/assets/img/centro-educativo.png'
            }
            className={classes.large}
          />
        </Col>
        <Col xs="8" sm="8" md="10">
          <Row>
            <Col
              xs="12"
              sm="6"
              lg="4"
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center`}
            >
              <span className={`${classes.information}`}>
                Centro educativo: {state.institucion.nombre}
              </span>
              <span className={`${classes.information}`}>
                Código: {state.institucion.codigo}
              </span>
              <span className={`${classes.information}`}>
                Código presupuestario: {state.institucion.codigoPresupuestario}
              </span>
            </Col>
            <Col
              xs="12"
              sm="6"
              lg="4"
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-sm-max-none`}
            >
              <span className={`${classes.information}`}>
                Dirección regional: {state.institucion?.regionNombre}
              </span>
              <span className={`${classes.information}`}>
                Circuito: {state.institucion.circuitoNombre}
              </span>
              <span className={`${classes.information}`}>
                Tipo de centro educativo: {state.institucion?.esPrivado ? 'Privada' : 'Pública'}
              </span>
            </Col>
            <Col
              xs="12"
              sm="6"
              lg="4"
              className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-md-max-none`}
            >
              <span className={`${classes.information}`}>
                Provincia: {locationInfo.provincia}
              </span>
              <span className={`${classes.information}`}>
                Cantón: {locationInfo.canton}
              </span>
              <span className={`${classes.information}`}>
                Distrito: {locationInfo.distrito}
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  ) */

	return (
		<DivContainer>
			<Columna>
				<InstImg
					width="56px"
					height="56px"
					viewBox="0 0 71 71"
					fill={colors.getColor()}
				/>
			</Columna>
			<Columna>
				<span>
					{t('informationcard>institucion', 'Institución')}:{' '}
					{state.institucion.nombre}
				</span>
				<span>
					{t('informationcard>codigo', 'Código')}: {state.institucion.codigo}
				</span>
				<span>
					{t('informationcard>codigopresupuestario', 'Código presupuestario')}:{' '}
					{state.institucion.codigoPresupuestario}
				</span>
			</Columna>
			<Columna>
				<span>
					{t('informationcard>direccionregional', 'Dirección regional')}:{' '}
					{state.institucion?.regionNombre}
				</span>
				<span>
					{t('informationcard>circuito', 'Circuito')}:{' '}
					{state.institucion.circuitoNombre}
				</span>
				<span>
					{t('informationcard>tipoinstitucion', 'Tipo de institución')}:{' '}
					{state.institucion?.esPrivado ? 'Privada' : 'Pública'}
				</span>
			</Columna>
			<Columna>
				<span>
					{t('informationcard>provincia', 'Provincia')}:{' '}
					{locationInfo.provincia}
				</span>
				<span>
					{t('informationcard>canton', 'Cantón')}: {locationInfo.canton}
				</span>
				<span>
					{t('informationcard>distrito', 'Distrito')}: {locationInfo.distrito}
				</span>
			</Columna>
		</DivContainer>
	)
}
const Img = styled.img`
	width: 64px;
	height: 64px;
`
const DivContainer = styled.div`
	display: grid;
	grid-template-columns: 80px 1fr 1fr 1fr;
	background: ${props => props.theme.primary};
	border-radius: 50px;
	width: 100%;
	padding: 5px 10px;
	color: ${props => props.theme.primaryText};
	align-items: center;
`
const Columna = styled.div`
	display: flex;
	flex-direction: column;
`

export default InformationCard
