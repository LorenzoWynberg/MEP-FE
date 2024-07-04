import React, { useEffect } from 'react'

import { Row, Col } from 'reactstrap'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { CardContent, Card, DropDownToggle } from './styles'
import { uniqBy } from 'lodash'
import Loader from 'Components/Loader'
import { useTranslation } from 'react-i18next'
import { verificarAcceso } from 'Hoc/verificarAcceso'

const GroupsContent = ({
	activeMdlt,
	setActiveMdlt,
	activeLvl,
	setActiveLvl,
	niveles,
	groups,
	modelOffers,
	activeGroup,
	setActiveGroup,
	loading,
	verificarAcceso
}) => {
	const { t } = useTranslation()
	useEffect(() => {
		if (!modelOffers || modelOffers?.length === 0) return
		const ofertas = uniqBy(modelOffers, 'modeloOfertaId')
		setActiveMdlt(ofertas[0])
	}, [modelOffers])

	if (loading) {
		return <Loader />
	}

	if (!verificarAcceso('grupospornivel', 'leer')) {
		return <></>
	}

	return (
		<Row style={{ width: '100%' }}>
			{!activeLvl.nivelId ? (
				uniqBy(modelOffers, 'modeloOfertaId').map(mdlOffr => {
					return (
						<>
							<Col
								xs={12}
								style={{
									margin: '0.5rem',
									marginBottom: '2.5rem'
								}}
							>
								<div style={{ display: 'flex' }}>
									<h3 style={{ fontWeight: 'bold' }}>
										{mdlOffr.modeloOfertaNombre}
									</h3>
									<DropDownToggle
										onClick={() => {
											if (
												activeMdlt.modeloOfertaId ===
												mdlOffr.modeloOfertaId
											) {
												setActiveMdlt({})
											} else {
												setActiveMdlt(mdlOffr)
											}
										}}
										active={
											activeMdlt.modeloOfertaId ===
											mdlOffr.modeloOfertaId
										}
									>
										<ExpandMoreIcon />
									</DropDownToggle>
								</div>
							</Col>
							{activeMdlt.modeloOfertaId ===
								mdlOffr.modeloOfertaId && (
								<>
									{modelOffers
										.filter(
											lvl =>
												lvl.modeloOfertaId ===
												mdlOffr.modeloOfertaId
										)
										.map(lvl => {
											return (
												<Col xs={12} md={3}>
													<Card
														onClick={() => {
															setActiveLvl(lvl)
														}}
													>
														<div className='img_overlay' />
														<div
															style={{
																backgroundColor:
																	lvl.color,
																height: '58%',
																color: 'white',
																padding:
																	'0.2rem'
															}}
														>
															<p>
																<strong>
																	{
																		mdlOffr.ofertaNombre
																	}
																</strong>
															</p>
															<p>
																<strong>
																	{
																		mdlOffr.modalidadNombre
																	}
																</strong>
															</p>
															<p>
																<strong>
																	{
																		lvl.especialidadNombre
																	}
																</strong>
															</p>
															<p>
																<strong>
																	{
																		mdlOffr.servicioNombre
																	}{' '}
																	||{' '}
																	{t(
																		'general>no_servicio',
																		'Sin servicio'
																	)}
																</strong>
															</p>
														</div>
														<CardContent>
															<h6>
																{
																	lvl.nivelNombre
																}
															</h6>
															<h6>
																{lvl.grupos !==
																1
																	? `${
																			lvl.grupos >
																			0
																				? lvl.grupos
																				: 'Sin'
																	  } grupos`
																	: '1 grupo'}
															</h6>
															<div className='card_footer'>
																<p>
																	{lvl.mujeres +
																		lvl.hombres}{' '}
																	{t(
																		'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados',
																		'Estudiantes matriculados'
																	)}
																</p>
																<div className='d-flex'>
																	<i className='icon-Female' />
																	<p className='pink'>
																		{
																			lvl.mujeres
																		}
																	</p>
																	<i className='icon-Male' />
																	<p className='blue'>
																		{
																			lvl.hombres
																		}
																	</p>
																</div>
															</div>
														</CardContent>
													</Card>
												</Col>
											)
										})}
								</>
							)}
						</>
					)
				})
			) : (
				<>
					<Col xs='12'>
						<h3>
							<strong>
								{t(
									'gestion_grupos>gruposNivel',
									'Todos los grupos del nivel'
								)}
								: {activeLvl.nivelNombre}
							</strong>
						</h3>
					</Col>
					{[
						{ grupoId: 'levelMembers', id: 'levelMembers' },
						{ grupoId: 0, id: 0 },
						...groups
					].map(grp => {
						return (
							<Col xs={12} md={3}>
								<Card
									onClick={() => {
										setActiveGroup(grp)
									}}
								>
									<div className='img_overlay' />
									<div
										style={{
											backgroundImage: `url(${
												grp.imagen
													? `"${grp.imagen}"`
													: grp.grupoId === 0
													? 'assets/img/gruposUnassigned.png'
													: grp.grupoId ===
													  'levelMembers'
													? 'assets/img/gruposLevel.png'
													: 'assets/img/grupos.png'
											})`,
											backgroundPosition: 'center',
											height: '58%',
											backgroundSize: grp.imagen
												? 'cover'
												: 'auto',
											backgroundRepeat: 'no-repeat'
										}}
									/>
									<CardContent>
										{grp.grupoId !== 0 &&
										grp.grupoId !== 'levelMembers' ? (
											<>
												<h6
													style={{
														marginTop: '1rem'
													}}
												>
													{grp.grupo}
												</h6>
												{/* <p>
                                                    Profesor guía: {grp.profesor}
                                                </p> */}
												<br />
												<div className='card_footer'>
													<p>
														{
															grp.estudiantesMatriculados
														}{' '}
														{t(
															'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados',
															'Estudiantes matriculados'
														)}
													</p>
													<div className='d-flex'>
														<i className='icon-Female pink' />
														<p className='pink'>
															{grp.mujeres}
														</p>
														<i className='icon-Male blue' />
														<p className='blue'>
															{grp.hombres}
														</p>
													</div>
												</div>
											</>
										) : grp.grupoId === 'levelMembers' ? (
											<>
												<h6
													style={{
														marginTop: '1rem'
													}}
												>
													{t(
														'gestion_grupos>en_nivel',
														'Estudiantes en nivel'
													)}
												</h6>
												<br />
												<div className='card_footer'>
													<p>
														{activeLvl.hombres +
															activeLvl.mujeres}{' '}
														{t(
															'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados',
															'Estudiantes matriculados'
														)}
													</p>
													<div className='d-flex'>
														<i className='icon-Female pink' />
														<p className='pink'>
															{activeLvl.mujeres}
														</p>
														<i className='icon-Male blue' />
														<p className='blue'>
															{activeLvl.hombres}
														</p>
													</div>
												</div>
											</>
										) : (
											<>
												<h6
													style={{
														marginTop: '1rem'
													}}
												>
													{t(
														'gestion_grupos>sin_grupos',
														'Estudiantes sin grupo'
													)}
												</h6>
												<br />
												<div className='card_footer'>
													<p>
														{activeLvl.hombres +
															activeLvl.mujeres -
															groups
																.map(
																	el =>
																		el.estudiantesMatriculados ||
																		0
																)
																.reduce(
																	(
																		accumulator,
																		currentValue
																	) => {
																		return (
																			accumulator +
																			currentValue
																		)
																	},
																	0
																)}{' '}
														{t(
															'gestion_grupos>sin_grupos',
															'Estudiantes sin grupo'
														)}
													</p>
													<div className='d-flex'>
														<i className='icon-Female pink' />
														<p className='pink'>
															{activeLvl.mujeres -
																groups
																	.map(
																		el =>
																			el.mujeres ||
																			0
																	)
																	.reduce(
																		(
																			accumulator,
																			currentValue
																		) => {
																			return (
																				accumulator +
																				currentValue
																			)
																		},
																		0
																	)}
														</p>
														<i className='icon-Male blue' />
														<p className='blue'>
															{activeLvl.hombres -
																groups
																	.map(
																		el =>
																			el.hombres ||
																			0
																	)
																	.reduce(
																		(
																			accumulator,
																			currentValue
																		) => {
																			return (
																				accumulator +
																				currentValue
																			)
																		},
																		0
																	)}
														</p>
													</div>
												</div>
											</>
										)}
									</CardContent>
								</Card>
							</Col>
						)
					})}
				</>
			)}
		</Row>
	)
}

export default verificarAcceso(GroupsContent)
