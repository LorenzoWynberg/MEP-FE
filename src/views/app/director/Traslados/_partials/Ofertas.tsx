import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Colxx } from 'Components/common/CustomBootstrap'
import InputWrapper from 'Components/wrappers/InputWrapper'
import React, { useEffect, useState } from 'react'
import { Row } from 'reactstrap'
import { groupBy, uniqBy } from 'lodash'
import GoBack from 'Components/goBack'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import Loader from 'Components/LoaderContainer'
import {
	getOfferForSpecialtyWithLevelsByInstitution,
	cleanCenterOffer,
	cleanCenterOfferSpecialty,
	getOfferForSpecialtyByInstitution
} from 'Redux/grupos/actions'
import { useTranslation } from 'react-i18next'

interface IProps {
	data: Array<any>
	institutionId: number
	setTitle: Function
	setSelectedLvl: Function
	selectedLvl?: any
}

const TrasladosInternosOfertas: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const { data, setTitle, institutionId, selectedLvl } = props
	const [modeloOferta, setModeloOferta] = useState<any>([])
	const [selectedNivel, setSelectedNivel] = useState<any>({})
	const [especialidades, setEspecialidades] = useState<any>([])
	const [loading, setLoading] = useState(false)
	const [view, setView] = useState('niveles')

	const state = useSelector((store: any) => {
		return {
			centerOffersSpecialty: store.grupos.centerOffersSpecialtyGrouped
		}
	})
	const actions = useActions({
		getOfferForSpecialtyWithLevelsByInstitution,
		cleanCenterOffer,
		cleanCenterOfferSpecialty,
		getOfferForSpecialtyByInstitution
	})

	useEffect(() => {
		const _modeloOfertas = groupBy(data, x => x.modeloOfertaId)
		setModeloOferta(Object.keys(_modeloOfertas))
	}, [data])

	useEffect(() => {
		let _data = state.centerOffersSpecialty
		
		if (selectedLvl) {
			_data = state.centerOffersSpecialty?.filter(x => x.especialidadId)
			//_data = state.centerOffersSpecialty?.filter(x => x.especialidadId !== selectedLvl?.especialidadId) se cambia la validacion para que cargue todas las especialidades correspondientes al nivel y no solamente las que son diferentes a la seleccionada
			//Dolores y Yair 20/03/2024
		}
		setEspecialidades(_data)
	}, [state.centerOffersSpecialty])

	let number = 0
	const colors = ['blue', 'purple', 'green', 'orange', 'red']

	const goTo = (nivelOferta, nivel) => {
		props.setSelectedLvl(nivelOferta, nivel)
	}

	const onClickOffer = async nivel => {
		if (!institutionId) {
			return
		}
		setLoading(true)
		await actions.getOfferForSpecialtyByInstitution(institutionId, Number(nivel.modeloOfertaId), nivel.nivelId)
		setLoading(false)
		setView('especialidad')
		setSelectedNivel(nivel)
		setTitle('- Seleccione la especialidad')
	}

	const goBack = async () => {
		await actions.cleanCenterOfferSpecialty()
		setView('niveles')
		setSelectedNivel(null)
		setTitle('- Seleccione el nivel')
	}

	return (
		<Row>
			{loading && <Loader />}

			{view === 'niveles' && !!modeloOferta.length && (
				<div>
					{modeloOferta.map((item, indexMO) => {
						if (number === 5) {
							number = 1
						} else {
							number += 1
						}
						let _modeloOfertas = data.filter(x => Number(x.modeloOfertaId) === Number(item))

						_modeloOfertas = uniqBy(_modeloOfertas, x => x.nivelId)
						const tieneEspecialidad = _modeloOfertas.filter(x => x.especialidadId).length > 0
						return (
							<Row key={`${indexMO}`}>
								{_modeloOfertas.map((nivel, indexN) => {
									return (
										<Colxx lg='4' md='6' sm='12' key={`${indexN}`} className='mb-3'>
											<InputWrapper
												classNames={` backgroundCard backgroundCard-${colors[number - 1]}`}
											>
												<div
													onClick={
														tieneEspecialidad
															? () => onClickOffer(nivel)
															: () => goTo(nivel, nivel)
													}
													style={{
														height: '100%',
														cursor: 'pointer'
													}}
												>
													<Grid xs={12} container>
														<Grid xs={12} container direction='column'>
															<Grid item xs>
																<Typography gutterBottom variant='subtitle1'>
																	{nivel.nivelNombre}
																</Typography>
																<Typography variant='body2'>
																	{nivel.ofertaNombre}
																</Typography>
																<Typography variant='body2'>
																	{nivel.modalidadNombre}
																</Typography>
																<Typography variant='body2'>
																	{nivel.servicioNombre}
																</Typography>
															</Grid>
														</Grid>

														<Grid xs={12} direction='row' className='mt-3' container>
															<Grid item xs={8}>
																<Typography variant='body2'>
																	{nivel.hombres + nivel.mujeres}{' '}
																	{t(
																		'gestion_traslados>estudiantes_registrados',
																		'Estudiantes Registrados'
																	)}
																</Typography>
															</Grid>
															<Grid item xs={4} container>
																<Typography variant='body2' className='mr-1'>
																	<i className='simple-icon-user-female' />{' '}
																	{nivel.mujeres}
																</Typography>
																<Typography variant='body2'>
																	<i className='simple-icon-user' /> {nivel.hombres}
																</Typography>
															</Grid>
														</Grid>
													</Grid>
												</div>
											</InputWrapper>
										</Colxx>
									)
								})}
							</Row>
						)
					})}
				</div>
			)}
			{view === 'especialidad' && (
				<div>
					<GoBack onClick={() => goBack()} />
					{!loading && (
						<Row>
							{especialidades.map((especialidad, indexN) => {
								return (
									<Colxx lg='4' md='6' sm='12' key={`${indexN}`} className='mb-3'>
										<InputWrapper classNames={` backgroundCard backgroundCard-${colors[0]}`}>
											<div
												onClick={() => {
													goTo(especialidad, selectedNivel)
												}}
												style={{
													height: '100%',
													cursor: 'pointer'
												}}
											>
												<Grid
													xs={12}
													container
													style={{
														height: '100%',
														display: 'flex',
														justifyContent: 'space-between'
													}}
												>
													<Grid xs={12} container direction='column'>
														<Grid item xs>
															<Typography gutterBottom variant='subtitle1'>
																{especialidad.especialidadNombre}
															</Typography>
															<Typography variant='body2'>
																{especialidad.ofertaNombre}
															</Typography>
															<Typography variant='body2'>
																{especialidad.modalidadNombre}
															</Typography>
															<Typography variant='body2'>
																{especialidad.servicioNombre}
															</Typography>
														</Grid>
													</Grid>

													<Grid xs={12} direction='row' className='mt-3' container>
														<Grid item xs={8}>
															<Typography variant='body2'>
																{especialidad.hombres + especialidad.mujeres}{' '}
																{t(
																	'gestion_traslados>estudiantes_registrados',
																	'Estudiantes Registrados'
																)}
															</Typography>
														</Grid>
														<Grid item xs={4} container>
															<Typography variant='body2' className='mr-1'>
																<i className='simple-icon-user-female' />{' '}
																{especialidad.mujeres}
															</Typography>
															<Typography variant='body2'>
																<i className='simple-icon-user' />{' '}
																{especialidad.hombres}
															</Typography>
														</Grid>
													</Grid>
												</Grid>
											</div>
										</InputWrapper>
									</Colxx>
								)
							})}
						</Row>
					)}
				</div>
			)}
			{!modeloOferta.length && (
				<div className='my-5 text-center'>
					<h4>{t('common>no_se_encontraron_registros', 'No se encontraron registros')}</h4>
				</div>
			)}
		</Row>
	)
}

export default TrasladosInternosOfertas
