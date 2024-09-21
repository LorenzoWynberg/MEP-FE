import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import { Row, Col } from 'reactstrap'
import colors from '../../../../../assets/js/colors'
import { getYearsOld } from '../../../../../utils/years'
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
		borderRadius: '0 0 30px 30px',
		top: '70px',
		'@media (min-width: 768px)': {
			top: '80px'
		},
		'@media (min-width: 1200px)': {
			top: '120px',
			marginBottom: '3rem !important'
		},
		'@media (min-width: 1440px)': {
			top: '100px'
		}
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

const EstudianteInformationCard = ({ data, fixed }) => {
	const { t } = useTranslation()
	const classes = useStyles()

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
		),
		tipoIdentificacion: t(
			'estudiantes>expediente>header>tipo_id',
			'Tipo de identificación'
		),
		edadCumplida: t('estudiantes>expediente>header>edad', 'Edad cumplida'),
		identidadGenero: t(
			'estudiantes>expediente>header>identidad_genero',
			'Identidad de género'
		),
		nacionalidad: t(
			'estudiantes>expediente>header>nacionalidad',
			'Nacionalidad'
		),
		matriculaActiva: t(
			'estudiantes>expediente>header>matricula_activa',
			'Estado de matrícula'
		),
		condicionDiscapacidad: t(
			'estudiantes>expediente>header>condicion_discapacidad',
			'Condición de discapacidad'
		),
		indigena: t('estudiantes>expediente>header>indigena', 'Indígena')
	}

	return (
		<Row
			id="estudianteInformationCard"
			className={`${classes.informationCard} p-3 mb-5`}
			style={
				fixed
					? {
							position: 'sticky',
							zIndex: 3,
							marginTop: '-64px'
					  }
					: {}
			}
		>
			<Col
				className="p-0 d-flex align-items-center pl-sm-2"
				xs="auto"
				sm="auto"
			>
				{/*<InstImg width='56px' height='56px' viewBox='0 0 71 71' fill={colors.getColor()} />*/}
				<Avatar
					alt="Remy Sharp"
					src={
						data.fotografiaUrl
							? data.fotografiaUrl
							: '/assets/img/profile-pic-generic.png'
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
							<strong>
								{t('estudiantes>expediente>header>nombre', 'Nombre')}:
							</strong>{' '}
							{data.nombreEstudiante}
						</span>
						<span className={`${classes.information}`}>
							<strong>
								{t('estudiantes>expediente>header>is', 'Identificación')}:
							</strong>{' '}
							{data.identificacion}
						</span>
						<span className={`${classes.information}`}>
							<strong>
								{t(
									'estudiantes>expediente>header>tipo_id',
									'Tipo de identificación'
								)}
								:
							</strong>{' '}
							{data.tipoIdentificacion == 'YÍS RÖ - IDENTIFICACIÓN MEP'
								? 'YÍS RÖ'
								: data.tipoIdentificacion}
						</span>
					</Col>
					<Col
						xs="12"
						sm="6"
						lg="4"
						className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-sm-max-none`}
					>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.edadCumplida}:</strong>{' '}
							{data.fechaNacimiento
								? getYearsOld(data.fechaNacimiento).toUpperCase()
								: ''}
						</span>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.identidadGenero}:</strong> {data.genero}
						</span>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.nacionalidad}:</strong> {data.nacionalidad}
						</span>
					</Col>
					<Col
						xs="12"
						sm="6"
						lg="4"
						className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-md-max-none`}
					>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.matriculaActiva}:</strong>{' '}
							{data.estadoMatricula}
						</span>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.condicionDiscapacidad}:</strong>{' '}
							{data.tieneDiscapacidades}
						</span>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.indigena}:</strong> {data.esIndigena}
						</span>
					</Col>
				</Row>
			</Col>
		</Row>
	)
}
export default EstudianteInformationCard
