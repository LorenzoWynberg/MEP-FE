import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { format, parseISO, compareAsc, parse } from 'date-fns'
import moment from 'moment'

import {
	Row,
	Col,
	FormGroup,
	Label,
	Input,
	CardBody,
	CardTitle,
	FormFeedback,
	Form
} from 'reactstrap'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'

import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { EditButton } from 'Components/EditButton'
import { Checkbox } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

import {
	createCalendar,
	editCalendar
} from '../../../../../../redux/cursoLectivo/actions'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'

const Calendario = (props) => {
	const { t } = useTranslation()

	const [editable, setEditable] = useState(true)
	const [preMatricula, setPreMatricula] = useState(false)
	const [primeraConv, setPrimeraConv] = useState(false)
	const [matricula, setMatricula] = useState(false)

	const [segundaConv, setSegundaConv] = useState(false)
	const actions = useActions({ createCalendar, editCalendar })
	const [snackbar, handleClick] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: ''
	})
	const {
		register,
		// errors,
		reset,
		handleSubmit,
		clearErrors,
		setValue,
		watch,
		formState: { errors }
	} = useForm({ mode: 'onChange' })

	const state = useSelector((store: any) => {
		const currentYear = store.educationalYear.aniosEducativos.find(
			(e) => e.id === store.educationalYear.anioEducativoSeleccionado
		)
		return {
			currentCalendar: store.cursoLectivo.calendarioActivo,
			currentCursoElectivo: store.cursoLectivo.cursoLectivoActivo,
			currentYear
		}
	})

	const handleEditable = (value) => {
		if (!value) {
			props.goBack()
		}
		setEditable(true)
	}

	const handleSnackbar = (msg, variant) => {
		setSnackbarContent({ msg, variant })
		handleClick()
	}

	const FeedBack = ({ message = '' }) => {
		return (
			<span style={{ color: 'red' }}>
				{
					message?.length > 0 ? <>{message}</> : (
						<>
						Este campo requerido y los rangos de fechas deben iniciar
						después de la fecha de inicio del año educativo y culminar antes
						de la fecha de finalización del año educativo
						</>
					)
				}
			</span>
		)
	}

	useEffect(() => {
		clearErrors()
	}, [editable])

	const sendData = async (data) => {
		let response
		const _data = {
			...state.currentCalendar,
			...data,
			fechaInicio: data.inicioPeriodoLectivo,
			fechaFinal: data.finPeriodoLectivo,
			prematricula: preMatricula,
			convocatoria: primeraConv,
			matricula,
			segundaConvocatoria: segundaConv,
			cursoLectivoId: state.currentCursoElectivo.id,
			estado: true
		}
		if (_data.id) {
			response = await actions.editCalendar(
				_data,
				state.currentCursoElectivo.id
			)
		} else {
			response = await actions.createCalendar(
				_data,
				state.currentCursoElectivo.id
			)
		}

		if (response.error) {
			handleSnackbar(response.error, 'error')
		} else {
			if (_data.id) {
				handleSnackbar(
					'El calendario se ha actualizado correctamente',
					'success'
				)
			} else {
				handleSnackbar(
					'El calendario se ha creado con éxito',
					'success'
				)
			}
		}
	}

	useEffect(() => {
		state.currentCalendar
			? Object.keys(state.currentCalendar).forEach((key) => {
				if (
					(key.search('inicio') >= 0 || key.search('fin') >= 0) &&
					state.currentCalendar[key]
				) {
					return setValue(
						key,
						format(
							parseISO(state.currentCalendar[key]),
							'yyyy-MM-dd'
						)
					)
				}
				setValue(key, state.currentCalendar[key])
				if (key == 'matricula') {
					setMatricula(state.currentCalendar[key])
				}
				if (key == 'segundaConvicatoria') {
					setSegundaConv(state.currentCalendar[key])
				}

				if (key == 'convocatoria') {
					setPrimeraConv(state.currentCalendar[key])
				}

				if (key == 'prematricula') {
					setPreMatricula(state.currentCalendar[key])
				}
			})
			: reset()
	}, [state.currentCalendar])

	return (
		<div>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}

			<Form onSubmit={handleSubmit(sendData)}>
				<Grid
					container
					direction='row'
					justifyContent='space-between'
					spacing={3}
					className='mb-5'
				>
					<Grid item xs={6}>
						<StyledGrid
							item
							xs={12}
							component={Card}
							style={{ overflow: 'visible' }}
						>
							<CardBody>
								<h3>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>calendario', 'Calendario')} *</h3>
								<FormGroup>
									<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>calendario>nombre_calendario', 'Nombre del calendario')}</Label>
									<Input
										readOnly={!editable}
										type='text'
										name='nombre'
										innerRef={register({ required: true })}
										invalid={Boolean(errors.nombre)}
									/>
									{errors.nombre && (
										<FormFeedback>
											El nombre es requerido
										</FormFeedback>
									)}
								</FormGroup>
								<FormGroup>
									<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>calendario>descripcion', 'Descripción')}</Label>
									<Input
										readOnly={!editable}
										type='textarea'
										rows='4'
										cols='50'
										name='descripcion'
										innerRef={register({ required: true })}
										invalid={Boolean(errors.descripcion)}
									/>
									{errors.descripcion && (
										<FormFeedback>
											La descripción es requerida
										</FormFeedback>
									)}
								</FormGroup>
							</CardBody>
						</StyledGrid>
					</Grid>
					<Grid item xs={6}>
						<Grid container spacing={3} xs={12}>
							<Grid item xs={12}>
								<Card style={{ overflow: 'visible' }}>
									<CardBody>
										<StyledCardTitle>
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>periodo_lectivo', 'Periodo lectivo')} *
										</StyledCardTitle>
										<p>
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>periodo_lectivo>mensaje', 'Periodo en que los estudiantes reciben lecciones')}
										</p>

										<Row>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>periodo_lectivo>fehca_inicio', 'Fecha inicio')}</Label>
													<Input
														readOnly={!editable}
														type='date'
														name='inicioPeriodoLectivo'
														innerRef={register({
															required: true,
															validate: {
																positive: (
																	value
																) =>
																	moment(
																		value
																	).isBetween(
																		state
																			.currentYear
																			.fechaInicio,
																		state
																			.currentYear
																			.fechaFin
																	)
															}
														})}
														invalid={Boolean(
															errors.inicioPeriodoLectivo
														)}
													/>
													{errors.inicioPeriodoLectivo && <FeedBack />}
												</FormGroup>
											</Col>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>periodo_lectivo>fecha_fin', 'Fecha fin')}</Label>
													<Input
														readOnly={!editable}
														type='date'
														name='finPeriodoLectivo'
														innerRef={register({
															required: true,
															validate: {
																positive: (
																	value
																) => {
																	return moment(
																		value
																	).isBetween(
																		parse(
																			watch(
																				'inicioPeriodoLectivo'
																			),
																			'yyyy-MM-dd',
																			new Date()
																		),
																		state
																			.currentYear
																			.fechaFin
																	)
																}
															}
														})}
														invalid={Boolean(
															errors.finPeriodoLectivo
														)}
													/>
													{errors.finPeriodoLectivo && (
														<span
															style={{
																color: 'red'
															}}
														>
															Este campo requerido y los rangos de fechas deben iniciar después de la fecha de inicio del periodo lectivo y culminar antes de la fecha de finalización del año educativo
														</span>
													)}
												</FormGroup>
											</Col>
										</Row>
									</CardBody>
								</Card>
							</Grid>
							<Grid item xs={12}>
								<Card style={{ overflow: 'visible' }}>
									<CardBody>
										<StyledCardTitle>
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>promocion', 'Promoción')} *
										</StyledCardTitle>
										<p>
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>promocion>mensaje', 'Periodo de apertura y cierre que se permitirá realizar la promoción de estudiantes.')}
										</p>
										<Row>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>promocion>fecha_inicio', 'Fecha inicio')}</Label>
													<Input
														readOnly={!editable}
														name='inicioPromocion'
														type='date'
														innerRef={register({
															required: true,
															validate: {
																positive: (
																	value
																) =>
																	moment(
																		value
																	).isSame(
																		parse(
																			watch(
																				'finPeriodoLectivo'
																			),
																			'yyyy-MM-dd',
																			new Date()
																		)
																	)
															}
														})}
														invalid={Boolean(
															errors.inicioPromocion
														)}
													/>
													{errors.inicioPromocion && (
														<span
															style={{
																color: 'red'
															}}
														>
															La fecha de inicio
															debe de ser la misma
															fecha en que
															finaliza el periodo
															lectivo
														</span>
													)}
												</FormGroup>
											</Col>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>promocion>fecha_fin', 'Fecha fin')}</Label>
													<Input
														readOnly={!editable}
														name='finPromocion'
														type='date'
														innerRef={register({
															required: true,

															validate: {
																positive: (
																	value
																) => {
																	return moment(
																		value
																	).isBetween(
																		parse(
																			watch(
																				'inicioPromocion'
																			),
																			'yyyy-MM-dd',
																			new Date()
																		),
																		state
																			.currentYear
																			.fechaFin
																	)
																}
															}
														})}
														invalid={Boolean(
															errors.finPromocion
														)}
													/>
													{errors.finPromocion && (
														<span
															style={{
																color: 'red'
															}}
														>
															La fecha final no puede ser mayor a la fecha final del año educativo
														</span>
													)}
												</FormGroup>
											</Col>
											<Span>
												{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>promocion>alerta', 'La fecha final de promoción no debe ser mayor a la fecha final del año educativo')}
											</Span>
										</Row>
									</CardBody>
								</Card>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={6}>
						<Grid container spacing={3} xs={12}>
							<Grid item xs={12}>
								<Card style={{ overflow: 'visible' }}>
									<CardBody>
										<StyledCardTitle>
											<Checkbox
												color='primary'
												checked={preMatricula}
												onClick={() =>
													setPreMatricula(
														!preMatricula
													)}
												disabled={!editable}
											/>{' '}
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>pre-matricula', 'Pre-matrícula')}
										</StyledCardTitle>
										<p>
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>pre-matricula>mensaje', 'Periodo de apertura y cierre del proceso')}
										</p>
										<Row>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>pre-matricula>fecha_inicio', 'Fecha inicio')}</Label>
													<Input
														readOnly={!editable}
														name='inicioPrematricula'
														disabled={!preMatricula}
														type='date'
														innerRef={register({
															required:
																preMatricula,
															validate: {
																validEnd: (value) => {
																	if (preMatricula) {
																		return (
																			compareAsc(parseISO(state.currentYear.fechaFin),
																			parse(
																				value,
																				'yyyy-MM-dd',
																				new Date()
																			)) > 0
																		)
																	}
																	return true
																},
																validStart: (value) => {
																	if (preMatricula) {

																		return (
																			compareAsc(
																				parse(value, 'yyyy-MM-dd', new Date()),
																				parseISO(state.currentYear.fechaInicio)
																			) > 0
																		)
																	}
																	return true
																},
																validateInicioConvocatoria: (value) => {
																	const val = watch('inicioConvocatoria')
																	const parse1 = parse(watch('inicioConvocatoria'), 'yyyy-MM-dd', new Date())
																	const test =  parse1 !== 'Invalid Date'
																	return Boolean(val)
																},
																conflictsWithFirstDate:
																	(value) => {
																		if (preMatricula) {
																			return (
																				compareAsc(
																					parse(watch('inicioConvocatoria'), 'yyyy-MM-dd', new Date()),
																					parse(value, 'yyyy-MM-dd', new Date())
																				) < 0
																			)
																		}
																		return true
																	},
															}
														})}
														invalid={Boolean(
															errors.inicioPrematricula
														)}
													/>
													{errors.inicioPrematricula && (
														 <FeedBack
														 	message={
																errors.inicioPrematricula?.type === 'validateInicioConvocatoria'
																	? 'No ha ingresado la fecha de inicio de primera convocatoria'
																	: errors.inicioPrematricula?.type
																		? 'La fecha es menor al inicio de la primera convocatoria'
																		: ''
															}
														/>
													)}
												</FormGroup>
											</Col>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>pre-matricula>fecha_fin', 'Fecha fin')}</Label>
													<Input
														readOnly={!editable}
														name='finPrematricula'
														disabled={!preMatricula}
														type='date'
														innerRef={register({
															required:
																preMatricula,
															validate: {
																validEnd: (
																	value
																) => {
																	if (
																		preMatricula
																	) {
																		return (
																			compareAsc(
																				parseISO(
																					state
																						.currentYear
																						.fechaFin
																				),
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																validStart: (
																	value
																) => {
																	if (
																		preMatricula
																	) {
																		return (
																			compareAsc(
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				),
																				parseISO(
																					state
																						.currentYear
																						.fechaInicio
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																conflictsWithFirstDate:
																	(value) => {
																		if (
																			preMatricula
																		) {
																			return (
																				compareAsc(
																					parse(
																						watch(
																							'inicioPrematricula'
																						),
																						'yyyy-MM-dd',
																						new Date()
																					),
																					parse(
																						value,
																						'yyyy-MM-dd',
																						new Date()
																					)
																				) <
																				0
																			)
																		}
																		return true
																	}
															}
														})}
														invalid={Boolean(
															errors.finPrematricula
														)}
													/>
													{errors.finPrematricula && <FeedBack />}
												</FormGroup>
											</Col>
										</Row>
									</CardBody>
								</Card>
							</Grid>
							<Grid item xs={12}>
								<Card style={{ overflow: 'visible' }}>
									<CardBody>
										<StyledCardTitle>
											<Checkbox
												color='primary'
												checked={matricula}
												onClick={() =>
													setMatricula(!matricula)}
												disabled={!editable}
											/>{' '}
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>matricula', 'Matrícula')}
										</StyledCardTitle>
										<p>
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>matricula>mensaje', 'Periodo de apertura y cierre del proceso')}
										</p>
										<Row>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>matricula>fecha_inicio', 'Fecha inicio')}</Label>
													<Input
														readOnly={!editable}
														name='inicioMatricula'
														type='date'
														disabled={!matricula}
														innerRef={register({
															required: matricula,
															validate: {
																validEnd: (
																	value
																) => {
																	if (
																		matricula
																	) {
																		return (
																			compareAsc(
																				parseISO(
																					state
																						.currentYear
																						.fechaFin
																				),
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																validStart: (
																	value
																) => {
																	if (
																		matricula
																	) {
																		return (
																			compareAsc(
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				),
																				parseISO(
																					state
																						.currentYear
																						.fechaInicio
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																conflictsWithFirstDate:
																	(value) => {
																		if (
																			matricula
																		) {
																			return (
																				compareAsc(
																					parse(
																						watch(
																							'inicioMatricula'
																						),
																						'yyyy-MM-dd',
																						new Date()
																					),
																					parse(
																						value,
																						'yyyy-MM-dd',
																						new Date()
																					)
																				) <
																				0
																			)
																		}
																		return true
																	}
															}
														})}
														invalid={Boolean(
															errors.inicioMatricula
														)}
													/>
													{errors.inicioMatricula && <FeedBack />}
												</FormGroup>
											</Col>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>matricula>fecha_final', 'Fecha fin')}</Label>
													<Input
														readOnly={!editable}
														disabled={!matricula}
														name='finMatricula'
														type='date'
														innerRef={register({
															required: matricula,
															validate: {
																validEnd: (
																	value
																) => {
																	if (
																		matricula
																	) {
																		return (
																			compareAsc(
																				parseISO(
																					state
																						.currentYear
																						.fechaFin
																				),
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																validStart: (
																	value
																) => {
																	if (
																		matricula
																	) {
																		return (
																			compareAsc(
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				),
																				parseISO(
																					state
																						.currentYear
																						.fechaInicio
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																conflictsWithFirstDate:
																	(value) => {
																		if (
																			matricula
																		) {
																			return (
																				compareAsc(
																					parse(
																						watch(
																							'inicioMatricula'
																						),
																						'yyyy-MM-dd',
																						new Date()
																					),
																					parse(
																						value,
																						'yyyy-MM-dd',
																						new Date()
																					)
																				) <
																				0
																			)
																		}
																		return true
																	}
															}
														})}
														invalid={Boolean(
															errors.finMatricula
														)}
													/>
													{errors.finMatricula && (
														<FeedBack />
													)}
												</FormGroup>
											</Col>
										</Row>
									</CardBody>
								</Card>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={6}>
						<Grid container spacing={3} xs={12}>
							<Grid item xs={12}>
								<Card style={{ overflow: 'visible' }}>
									<CardBody>
										<StyledCardTitle>
											<Checkbox
												color='primary'
												checked={primeraConv}
												onClick={() =>
													setPrimeraConv(!primeraConv)}
												disabled={!editable}
											/>{' '}
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>primera_convocatoria', 'Primera convocatoria')}
										</StyledCardTitle>
										<p>
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>primera_convocatoria>mensaje', 'Periodo en que los centros educativos deben realizar la convocatoria')}
										</p>
										<Row>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>primera_convocatoria>fecha_inicio', 'Fecha inicio')}</Label>
													<Input
														readOnly={!editable}
														name='inicioConvocatoria'
														disabled={!primeraConv}
														type='date'
														innerRef={register({
															required:
																primeraConv,
															validate: {
																validEnd: (
																	value
																) => {
																	if (
																		primeraConv
																	) {
																		return (
																			compareAsc(
																				parseISO(
																					state
																						.currentYear
																						.fechaFin
																				),
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																validStart: (
																	value
																) => {
																	if (
																		primeraConv
																	) {
																		return (
																			compareAsc(
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				),
																				parseISO(
																					state
																						.currentYear
																						.fechaInicio
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																// conflictsWithFirstDate:
																// 	(value) => {
																// 		if (primeraConv) {
																// 			const parse1 = parse(watch('inicioConvocatoria'), 'yyyy-MM-dd', new Date()) 
																// 			const parse2 = parse(value, 'yyyy-MM-dd', new Date()) 
																// 			const test = compareAsc(
																// 				parse(watch('inicioConvocatoria'), 'yyyy-MM-dd', new Date()),
																// 				parse(value, 'yyyy-MM-dd', new Date())
																// 			)
																// 			debugger
																// 			return (
																// 				compareAsc(
																// 					parse(watch('inicioConvocatoria'), 'yyyy-MM-dd', new Date()),
																// 					parse(value, 'yyyy-MM-dd', new Date())
																// 				) < 0
																// 			)
																// 		}
																// 		return true
																// 	}
															}
														})}
														invalid={Boolean(
															errors.inicioConvocatoria
														)}
													/>
													{errors.inicioConvocatoria && <FeedBack />}
												</FormGroup>
											</Col>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>primera_convocatoria>fecha_fin', 'Fecha fin')}</Label>
													<Input
														readOnly={!editable}
														name='finConvocatoria'
														disabled={!primeraConv}
														type='date'
														innerRef={register({
															required:
																primeraConv,
															validate: {
																validEnd: (
																	value
																) => {
																	if (
																		primeraConv
																	) {
																		return (
																			compareAsc(
																				parseISO(
																					state
																						.currentYear
																						.fechaFin
																				),
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																validStart: (
																	value
																) => {
																	if (
																		primeraConv
																	) {
																		return (
																			compareAsc(
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				),
																				parseISO(
																					state
																						.currentYear
																						.fechaInicio
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																conflictsWithFirstDate:
																	(value) => {
																		if (
																			primeraConv
																		) {
																			return (
																				compareAsc(
																					parse(
																						watch(
																							'inicioConvocatoria'
																						),
																						'yyyy-MM-dd',
																						new Date()
																					),
																					parse(
																						value,
																						'yyyy-MM-dd',
																						new Date()
																					)
																				) <
																				0
																			)
																		}
																		return true
																	}
															}
														})}
														invalid={Boolean(
															errors.finConvocatoria
														)}
													/>
													{errors.finConvocatoria && <FeedBack />}
												</FormGroup>
											</Col>
											<Span>
												{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>primera_convocatoria>alerta', 'La fecha final de promoción no debe ser mayor a la fecha final del año educativo')}
											</Span>
										</Row>
									</CardBody>
								</Card>
							</Grid>
							<Grid item xs={12}>
								<Card style={{ overflow: 'visible' }}>
									<CardBody>
										<StyledCardTitle>
											<Checkbox
												color='primary'
												checked={segundaConv}
												onClick={() =>
													setSegundaConv(!segundaConv)}
												disabled={!editable}
											/>{' '}
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>segunda_convocatoria', 'Segunda convocatoria')}
										</StyledCardTitle>
										<p>
											{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>segunda_convocatoria>mensaje', 'Periodo en que los centros educativos deben realizar la convocatoria')}
										</p>
										<Row>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>segunda_convocatoria>fecha_inicio', 'Fecha inicio')}</Label>
													<Input
														readOnly={!editable}
														disabled={!segundaConv}
														name='inicioSegundaConvocatoria'
														type='date'
														innerRef={register({
															required:
																segundaConv,
															validate: {
																validEnd: (
																	value
																) => {
																	if (
																		segundaConv
																	) {
																		return (
																			compareAsc(
																				parseISO(
																					state
																						.currentYear
																						.fechaFin
																				),
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																validStart: (
																	value
																) => {
																	if (
																		segundaConv
																	) {
																		return (
																			compareAsc(
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				),
																				parseISO(
																					state
																						.currentYear
																						.fechaInicio
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																conflictsWithFirstDate:
																	(value) => {
																		if (
																			segundaConv
																		) {
																			return (
																				compareAsc(
																					parse(
																						watch(
																							'inicioSegundaConvocatoria'
																						),
																						'yyyy-MM-dd',
																						new Date()
																					),
																					parse(
																						value,
																						'yyyy-MM-dd',
																						new Date()
																					)
																				) <
																				0
																			)
																		}
																		return true
																	}
															}
														})}
														invalid={Boolean(
															errors.inicioSegundaConvocatoria
														)}
													/>
													{errors.inicioSegundaConvocatoria && <FeedBack />}
												</FormGroup>
											</Col>
											<Col xs={12} md={6}>
												<FormGroup>
													<Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>segunda_convocatoria>fecha_fin', 'Fecha fin')}</Label>
													<Input
														readOnly={!editable}
														name='finSegundaConvocatoria'
														type='date'
														disabled={!segundaConv}
														innerRef={register({
															required:
																segundaConv,
															validate: {
																validEnd: (
																	value
																) => {
																	if (
																		segundaConv
																	) {
																		return (
																			compareAsc(
																				parseISO(
																					state
																						.currentYear
																						.fechaFin
																				),
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																validStart: (
																	value
																) => {
																	if (
																		segundaConv
																	) {
																		return (
																			compareAsc(
																				parse(
																					value,
																					'yyyy-MM-dd',
																					new Date()
																				),
																				parseISO(
																					state
																						.currentYear
																						.fechaInicio
																				)
																			) >
																			0
																		)
																	}
																	return true
																},
																conflictsWithFirstDate:
																	(value) => {
																		if (
																			segundaConv
																		) {
																			return (
																				compareAsc(
																					parse(
																						watch(
																							'inicioSegundaConvocatoria'
																						),
																						'yyyy-MM-dd',
																						new Date()
																					),
																					parse(
																						value,
																						'yyyy-MM-dd',
																						new Date()
																					)
																				) <
																				0
																			)
																		}
																		return true
																	}
															}
														})}
														invalid={Boolean(
															errors.finSegundaConvocatoria
														)}
													/>
													{errors.finSegundaConvocatoria && <FeedBack />}
												</FormGroup>
											</Col>
											<Span>
												{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales>segunda_convocatoria>alerta', 'La fecha final de promoción no debe ser mayor a la fecha final del año educativo')}
											</Span>
										</Row>
									</CardBody>
								</Card>
							</Grid>
						</Grid>
					</Grid>
					<Grid
						container
						direction='row'
						justifyContent='center'
						alignItems='center'
						item
						xs={12}
					>
						<EditButton
							setEditable={handleEditable}
							loading={false}
							editable
						/>
					</Grid>
				</Grid>
			</Form>
		</div>
	)
}

const StyledCardTitle = styled(CardTitle)`
	margin-bottom: 0.2rem !important;
`
const StyledGrid = styled(Grid)`
	height: 100%;
`
const Span = styled.span`
	margin-left: 1rem;
`

export default Calendario
