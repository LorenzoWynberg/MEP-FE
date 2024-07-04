import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Colxx } from 'Components/common/CustomBootstrap'
import InputWrapper from 'Components/wrappers/InputWrapper'
import React, { useEffect, useState } from 'react'
import { Container, Row } from 'reactstrap'
import { groupBy, uniqBy } from 'lodash'
import GoBack from 'Components/goBack'
import Loader from 'Components/Loader'

interface IProps {
	data: Array<any>
	setActiveLvl: Function
}

const StudentRegister: React.FC<IProps> = (props) => {
	const { data, setActiveLvl } = props
	const [modeloOferta, setModeloOferta] = useState<any>([])
	const [especialidades, setEspecialidades] = useState<any>([])
	const [loading, setLoading] = useState(false)

	const [view, setView] = useState('niveles')

	useEffect(() => {
		let _modeloOfertas = groupBy(data, (x) => x.modeloOfertaId)
		setModeloOferta(Object.keys(_modeloOfertas))
	}, [data])

	let number = 0
	const colors = ['blue', 'purple', 'green', 'orange', 'red']

	const onClickOffer = async (nivel) => {
		setLoading(true)

		let _modeloOfertas = data.filter(
			(x) =>
				x.nivelId === nivel.nivelId &&
				x.modeloOfertaId === nivel.modeloOfertaId
		)
		setEspecialidades(_modeloOfertas)
		setLoading(false)
		setView('especialidad')
	}

	const goBack = async () => {
		setView('niveles')
	}

	return (
		<Container>
			<Row>
				{view === 'niveles' && !!modeloOferta.length && (
					<Colxx sm="12">
						{modeloOferta.map((item, indexMO) => {
							if (number === 5) {
								number = 1
							} else {
								number += 1
							}
							let _modeloOfertas = data.filter(
								(x) => Number(x.modeloOfertaId) === Number(item)
							)

							_modeloOfertas = uniqBy(
								_modeloOfertas,
								(x) => x.nivelId
							)
							let tieneEspecialidad =
								_modeloOfertas.filter((x) => x.especialidadId)
									.length > 0
							return (
								<Row key={`${indexMO}`}>
									{_modeloOfertas.map((nivel, indexN) => {
										return (
											<Colxx
												lg="4"
												md="6"
												sm="12"
												key={`${indexN}`}
												className="mb-3"
											>
												<InputWrapper
													classNames={` backgroundCard backgroundCard-${
														colors[number - 1]
													}`}
												>
													<div
														onClick={
															tieneEspecialidad
																? () =>
																		onClickOffer(
																			nivel
																		)
																: () =>
																		setActiveLvl(
																			nivel
																		)
														}
														style={{
															height: '100%',
															cursor: 'pointer'
														}}
													>
														<Grid xs={12} container>
															<Grid
																xs={12}
																container
																direction="column"
															>
																<Grid item xs>
																	<Typography
																		gutterBottom
																		variant="subtitle1"
																	>
																		{
																			nivel.nivelNombre
																		}
																	</Typography>
																	<Typography variant="body2">
																		{
																			nivel.ofertaNombre
																		}
																	</Typography>
																	<Typography variant="body2">
																		{
																			nivel.modalidadNombre
																		}
																	</Typography>
																	<Typography variant="body2">
																		{
																			nivel.servicioNombre
																		}
																	</Typography>
																</Grid>
															</Grid>

															<Grid
																xs={12}
																direction="row"
																className={
																	'mt-3'
																}
																container
															>
																<Grid
																	item
																	xs={12}
																>
																	<Typography variant="body2">
																		{nivel.grupos !==
																		1
																			? `${
																					nivel.grupos >
																					0
																						? nivel.grupos
																						: 'Sin'
																			  } grupos`
																			: '1 grupo'}
																	</Typography>
																</Grid>
																<Grid
																	item
																	xs={8}
																>
																	<Typography variant="body2">
																		{nivel.hombres +
																			nivel.mujeres}{' '}
																		Estudiantes
																		Registrados
																	</Typography>
																</Grid>
																<Grid
																	item
																	xs={4}
																	container
																>
																	<Typography
																		variant="body2"
																		className={
																			'mr-1'
																		}
																	>
																		<i className="simple-icon-user-female"></i>{' '}
																		{
																			nivel.mujeres
																		}
																	</Typography>
																	<Typography variant="body2">
																		<i className="simple-icon-user"></i>{' '}
																		{
																			nivel.hombres
																		}
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
					</Colxx>
				)}
				{view === 'especialidad' && (
					<Colxx sm="12">
						<GoBack onClick={() => goBack()} />
						{loading && <Loader />}
						{!loading && (
							<Row>
								{especialidades.map((especialidad, indexN) => {
									return (
										<Colxx
											lg="4"
											md="6"
											sm="12"
											key={`${indexN}`}
											className="mb-3"
										>
											<InputWrapper
												classNames={` backgroundCard backgroundCard-${colors[0]}`}
											>
												<div
													onClick={() => {
														setActiveLvl(
															especialidad
														)
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
															justifyContent:
																'space-between'
														}}
													>
														<Grid
															xs={12}
															container
															direction="column"
														>
															<Grid item xs>
																<Typography
																	gutterBottom
																	variant="subtitle1"
																>
																	{
																		especialidad.especialidadNombre
																	}
																</Typography>
																<Typography variant="body2">
																	{
																		especialidad.ofertaNombre
																	}
																</Typography>
																<Typography variant="body2">
																	{
																		especialidad.modalidadNombre
																	}
																</Typography>
																<Typography variant="body2">
																	{
																		especialidad.servicioNombre
																	}
																</Typography>
															</Grid>
														</Grid>

														<Grid
															xs={12}
															direction="row"
															className={'mt-3'}
															container
														>
															<Grid item xs={12}>
																<Typography variant="body2">
																	{especialidad.grupos !==
																	1
																		? `${
																				especialidad.grupos >
																				0
																					? especialidad.grupos
																					: 'Sin'
																		  } grupos`
																		: '1 grupo'}
																</Typography>
															</Grid>
															<Grid item xs={8}>
																<Typography variant="body2">
																	{especialidad.hombres +
																		especialidad.mujeres}{' '}
																	Estudiantes
																	Registrados
																</Typography>
															</Grid>
															<Grid
																item
																xs={4}
																container
															>
																<Typography
																	variant="body2"
																	className={
																		'mr-1'
																	}
																>
																	<i className="simple-icon-user-female"></i>{' '}
																	{
																		especialidad.mujeres
																	}
																</Typography>
																<Typography variant="body2">
																	<i className="simple-icon-user"></i>{' '}
																	{
																		especialidad.hombres
																	}
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
					</Colxx>
				)}
				{!modeloOferta.length && (
					<Colxx sm="12" className="my-5 text-center">
						<h4>No se encontraron registros</h4>
					</Colxx>
				)}
			</Row>
		</Container>
	)
}

export default StudentRegister
