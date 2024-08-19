import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'

import { Row, Col } from 'reactstrap'

import colors from '../../../../../assets/js/colors'
import { useActions } from '../../../../../hooks/useActions'
import { useSelector } from 'react-redux'
import { ReactComponent as InstImg } from 'Assets/images/front_institution.svg'
import { getYearsOld } from '../../../../../utils/years'
import { catalogsEnumObj } from '../../../../../utils/catalogsEnum'
import { getCatalogs, getCatalogsSet } from '../../../../../redux/selects/actions'
import { useTranslation } from 'react-i18next'
import { mapOption } from '../../../../../utils/mapeoCatalogos'
import { validateSelectsData } from '../../../../../utils/ValidateSelectsData'
import { isEmpty } from 'lodash'

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

const EstudianteInformationCard = ({ data, fixed }) => {
	console.log('JP Estudiante: ', data)
	const { t } = useTranslation()

	const [datosCatalogo, setDatosCatalogo] = useState({})
	const classes = useStyles()
	const actions = useActions({ getCatalogsSet, getCatalogs })

	// this should be removed when the other services are ready
	const hardCodedData = {
		grupo: t('estudiantes>expediente>header>grupo', 'Grupo'),
		ofertaEducativa: t('estudiantes>expediente>header>oferta_edu', 'Oferta educativa'),
		Modalidad: t('estudiantes>expediente>header>modalidad', 'Modalidad'),
		nivel: t('estudiantes>expediente>header>nivel', 'Nivel'),
		idCentroEducativo: t('estudiantes>expediente>header>codigo', 'Código'),
		nombreCentroEducativo: t('estudiantes>expediente>header>nombre_ce', 'Nombre del centro educativo'),
		estadoPeriodo: t('estudiantes>expediente>header>estado_est', 'Estado del estudiante en el periodo'),
		tipoIdentificacion: t('estudiantes>expediente>header>tipo_id', 'Tipo de identificación'),
		edadCumplida: t('estudiantes>expediente>header>edad', 'Edad cumplida'),
		identidadGenero: t('estudiantes>expediente>header>identidad_genero', 'Identidad de género'),
		nacionalidad: t('estudiantes>expediente>header>nacionalidad', 'Nacionalidad'),
		matriculaActiva: t('estudiantes>expediente>header>matricula_activa', 'Matrícula activa'),
		condicionDiscapacidad: t('estudiantes>expediente>header>condicion_discapacidad', 'Condición de discapacidad'),
		indigena: t('estudiantes>expediente>header>indigena', 'Indígena')
	}

	const state = useSelector(store => {
		return {
			historialMatricula: store.identification.matriculaHistory,
			selects: store.selects
		}
	})

	console.log('JP selects', state.selects)

	// useEffect(() => {
	// 	const loadData = async () => {
	// 		const catalogsArray = [

	// 			catalogsEnumObj.GENERO,
	// 		]
	// 		const response = await actions.getCatalogsSet(catalogsArray)
	// 		if (response.error) {
	// 			setSnacbarContent({
	// 				variant: 'error',
	// 				msg: 'Hubo un error al tratar de conseguir los datos del servidor'
	// 			})
	// 			handleClick()
	// 		}
	// 	}
	// 	loadData()
	// }, [])

	useEffect(() => {
		const catalogsNamesArray = [catalogsEnumObj.GENERO.name, catalogsEnumObj.NATIONALITIES.name]
		debugger
		if (validateSelectsData(state.selects, catalogsNamesArray)) {
			const _item = {
				nacionalidad: mapOption(
					data.datos,
					state.selects,
					catalogsEnumObj.NATIONALITIES.id,
					catalogsEnumObj.NATIONALITIES.name
				),
				genero: mapOption(data.datos, state.selects, catalogsEnumObj.GENERO.id, catalogsEnumObj.GENERO.name)
			}

			setDatosCatalogo(_item)
		}
	}, [data])

	return (
		<Row
			className={`${classes.informationCard} mb-4 p-3 `}
			style={
				fixed
					? {
							position: 'fixed',
							borderBottom: '1px solid #ddd',
							zIndex: 3,
							width: '80vw'
					  }
					: {}
			}
		>
			<Col className='p-0 d-flex align-items-center pl-sm-2' xs='auto' sm='auto'>
				{/*<InstImg width='56px' height='56px' viewBox='0 0 71 71' fill={colors.getColor()} />*/}
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
						<span className={`${classes.information}`}>
							<strong>{t('estudiantes>expediente>header>nombre', 'Nombre')}:</strong>{' '}
							{data.nombreEstudiante}
						</span>
						<span className={`${classes.information}`}>
							<strong>{t('estudiantes>expediente>header>is', 'Identificación')}:</strong>{' '}
							{data.identificacion}
						</span>
						<span className={`${classes.information}`}>
							<strong>{t('estudiantes>expediente>header>tipo_id', 'Tipo de Identificación')}:</strong>{' '}
							{data.tipoIdentificacion}
						</span>
					</Col>
					<Col
						xs='12'
						sm='6'
						lg='4'
						className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-sm-max-none`}
					>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.edadCumplida}:</strong>{' '}
							{data.fechaNacimiento ? getYearsOld(data.fechaNacimiento).toUpperCase() : ''}
						</span>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.identidadGenero}:</strong>{' '}
							{!isEmpty(datosCatalogo.genero) ? datosCatalogo.genero.label : ''}
						</span>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.nacionalidad}:</strong>{' '}
							{!isEmpty(datosCatalogo.nacionalidad) ? datosCatalogo.nacionalidad.label : ''}
						</span>
					</Col>
					<Col
						xs='12'
						sm='6'
						lg='4'
						className={`${classes.flexFlowColum} d-flex align-items-center justify-content-center d-md-max-none`}
					>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.matriculaActiva}:</strong>{' '}
							{data.estadoMatricula === 'Regular' ? 'SI' : 'NO'}
						</span>
						<span className={`${classes.information}`}>
							<strong>{hardCodedData.condicionDiscapacidad}:</strong> {data.tieneDiscapacidades}
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