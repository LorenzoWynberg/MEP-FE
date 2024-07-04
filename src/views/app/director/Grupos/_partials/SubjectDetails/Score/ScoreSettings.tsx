import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import HeaderTab from 'Components/Tab/Header'
import { Card, CardBody, Col } from 'reactstrap'
import Select from 'react-select'
import colors from 'Assets/js/colors'
import ComponentsSettings from './ComponentsSettings'
import StudentComponentsSettings from './StudentComponentsSettings'
import { useActions } from 'Hooks/useActions'
import { getTiposEvaluacion } from 'Redux/asignaturas/actions'
import { useSelector } from 'react-redux'
import { TableReactImplementation } from 'Components/TableReactImplementation/index'
import { updateJSON } from 'Redux/Calificaciones/actions'
import { Input } from '@material-ui/core'
import RubricaModal from './RubricaModal'
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next'

interface IProps {
	scoreType: '' | 'open' | 'highschool' | 'formative' | 'summative'
	setOpen: (type: '') => void
	open: string
	showAtinencias: boolean
	components: Array<any>
	setComponents: (state: any) => void
	subject: any
	selectedPeriod: any
	setSelectedPeriod: () => void
	selectedStudent
	currentComponents
	setSelectedStudent: (state) => void
	setCurrentComponents: (state) => void
	setShouldUpdate: (state) => void
	configuracion: {
		tipoEvaluacionId: number
		notadepromocion: number
		codigoEvaluacionAdicional: string
		elementoCatalogoId: number
		nombreEvaluacionAdicional: string
	}
}

const ScoreSettings = ({
	scoreType,
	setOpen,
	open,
	components,
	setComponents,
	subject,
	selectedPeriod,
	setSelectedPeriod,
	configuracion,
	selectedStudent,
	setSelectedStudent,
	setShouldUpdate,
	currentComponents,
	setCurrentComponents
}: IProps) => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState<number>(0)
	const { tiposEvaluacion } = useSelector((state) => state.asignaturas)
	const [evaluationType, setEvaluationType] = useState(null)
	const [contenidos, setContenidos] = useState<any>([])

	const [settings, setSettings] = useState<{
		tipoEvaluacionId: number
		notadepromocion: number
		codigoEvaluacionAdicional: string
		elementoCatalogoId: number
		nombreEvaluacionAdicional: string
	}>(configuracion || null)

	const data = subject?.datosMallaCurricularAsignaturaInstitucion

	const actions = useActions({
		getTiposEvaluacion,
		updateJSON
	})

	useEffect(() => {
		actions.getTiposEvaluacion()
	}, [])

	useEffect(() => {
		if (settings?.tipoEvaluacionId) {
			const index = tiposEvaluacion?.findIndex(
				(el) => el?.id === settings?.tipoEvaluacionId
			)
			if (index !== -1) {
				setEvaluationType(tiposEvaluacion[index])
			}
		}
	}, [tiposEvaluacion])

	useEffect(() => {
		if (settings) {
			actions.updateJSON(
				'ConfiguracionCalificacion',
				{ ...settings },
				subject,
				selectedPeriod
			)
		}
	}, [settings])

	useEffect(() => {
		if (scoreType === 'formative') {
			let rubrica = subject.rubricaAprendizaje
				? JSON.parse(subject.rubricaAprendizaje).contenidos
				: JSON.parse(
						subject.datosMallaCurricularAsignaturaInstitucion
							.rubricaAprendizaje
				  )
			if (Array.isArray(rubrica)) {
				rubrica = rubrica[0]
			}

			setContenidos(
				subject.rubricaAprendizaje
					? rubrica
					: JSON.parse(rubrica.json).Contenidos
			)
		}
	}, [subject])

	let options = [
		t(
			'configuracion>superviciones_circuitales>agregar>informacion_general',
			'Información general'
		),
		scoreType === 'formative'
			? t(
					'configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>indicadores_de _aprendizaje',
					'Indicadores de aprendizaje'
			  )
			: t(
					'gestion_grupo>calificacion>tab>componente_evaluacion',
					'Componentes de la evaluación'
			  ),
		scoreType !== 'formative'
			? t(
					'gestion_grupo>calificacion>tab>apoyo_curricular',
					'Apoyo Curricular'
			  )
			: null
	]

	if (scoreType === 'open' && !settings?.tipoEvaluacionId) {
		options = [
			t(
				'configuracion>superviciones_circuitales>agregar>informacion_general',
				'Información general'
			)
		]
	}

	if (scoreType === 'open' && settings?.tipoEvaluacionId) {
		options = [
			t(
				'configuracion>superviciones_circuitales>agregar>informacion_general',
				'Información general'
			),
			settings?.tipoEvaluacionId === 1
				? t(
						'configuracion>mallas_curriculares>indicadores_aprendizaje>boton>previsualizar>indicadores_de _aprendizaje',
						'Indicadores de aprendizaje'
				  )
				: t(
						'gestion_grupo>calificacion>tab>componente_evaluacion',
						'Componentes de la evaluación'
				  ),
			settings?.tipoEvaluacionId !== 1
				? t(
						'gestion_grupo>calificacion>tab>apoyo_curricular',
						'Apoyo Curricular'
				  )
				: null
		]
	}

	return (
		<Col className="mt-3">
			{scoreType === 'open' && !settings?.tipoEvaluacionId ? null : (
				<Back onClick={() => setOpen('')}>
					<BackIcon />
					<BackTitle>
						{t('edit_button>regresar', 'Regresar')}
					</BackTitle>
				</Back>
			)}
			<div className="">
				<HeaderTab
					options={options}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					style={{
						borderBottom: 'unset'
					}}
				/>
				<div className="d-flex justify-content-between align-items-start">
					{activeTab === 0 && (
						<Card style={{ width: '45%', marginTop: '1rem' }}>
							<CardBody>
								<h5 style={{ fontWeight: 'bold' }}>
									{t(
										'configuracion>superviciones_circuitales>agregar>informacion_general',
										'Información general'
									)}
								</h5>
								<div className="d-flex justify-content-between w-100 my-3">
									<div>
										{t(
											'buscador_ce>ver_centro>ofertas educativas>año_educativo',
											'Año educativo'
										)}
										:{' '}
										<span style={{ fontWeight: 'bold' }}>
											2021
										</span>
									</div>
									<div>
										{t(
											'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>deshabilitar>periodo',
											'Periodo'
										)}
										:{' '}
										<span style={{ fontWeight: 'bold' }}>
											1er semestre
										</span>
									</div>
								</div>
								{data.notadepromocion ||
								data.cantidadcreditos ? (
									<div className="d-flex justify-content-between w-100 my-3">
										{data?.notadepromocion ? (
											<div>
												{t(
													'gestion_grupo>asistencia>nota_promocion',
													'Nota de promoción'
												)}
												:{' '}
												<span
													style={{
														fontWeight: 'bold'
													}}
												>
													{data.notadepromocion}
												</span>
											</div>
										) : null}
										{data?.cantidadcreditos ? (
											<div>
												{t(
													'gestion_grupo>asistencia>credito',
													'Créditos'
												)}
												:{' '}
												<span
													style={{
														fontWeight: 'bold'
													}}
												>
													{data?.cantidadcreditos}
												</span>
											</div>
										) : null}
									</div>
								) : null}
								<div className="d-flex justify-content-between w-100 my-3">
									{data?.cantidadLecciones ? (
										<div>
											{t(
												'expediente_ce>recurso_humano>fun_ce>lecciones>cantidad_lecciones_semanales',
												'Cantidad de lecciones semanales'
											)}
											:{' '}
											<span
												style={{ fontWeight: 'bold' }}
											>
												{data?.cantidadLecciones}
											</span>
										</div>
									) : null}
									{data?.redondeo ? (
										<div>
											{t(
												'gestion_grupo>asistencia>tipo_redondeo',
												'Tipo de redondeo'
											)}
											:{' '}
											<span
												style={{ fontWeight: 'bold' }}
											>
												{t(
													'gestion_grupo>asistencia>igual_mayor',
													'igual o mayor a 0'
												)}
												,{data?.redondeo}
											</span>
										</div>
									) : null}
								</div>
								<div className="">
									{data?.nombreEvaluacionAdicional ? (
										<div className="">
											{t(
												'gestion_grupo>asistencia>tipo_evaluacion',
												'Tipo de evaluación adicional'
											)}
											:{' '}
											<span
												style={{ fontWeight: 'bold' }}
											>
												{
													data?.nombreEvaluacionAdicional
												}
											</span>
										</div>
									) : null}
								</div>
								{subject?.atinencias && (
									<div>
										<p>
											{t(
												'configuracion>mallas_curriculares>asignatura/figura_afin>agregar>atinencia_curricular',
												'Atinencia curricular'
											)}
										</p>
										<div className="d-flex">
											{subject?.atinencias
												? JSON.parse(
														subject?.atinencias
												  ).map((el) => {
														return el.at.map(
															(item) => (
																<div
																	style={{
																		color: '#fff',
																		backgroundColor:
																			colors.primary,
																		padding:
																			'.5rem 1rem',
																		borderRadius:
																			'15px',
																		marginRight:
																			'5px'
																	}}
																	key={
																		item?.Id
																	}
																>
																	{
																		item?.nombre
																	}
																</div>
															)
														)
												  })
												: null}
										</div>
									</div>
								)}
								{scoreType !== 'open' && (
									<div>
										<p
											className="my-2"
											style={{
												margin: 0,
												fontSize: '1rem'
											}}
										>
											{t(
												'gestion_grupo>asistencia>evaluacion',
												'Tipo de evaluación'
											)}
										</p>
										<div
											style={{
												width: '100%',
												border: '1px solid #808080',
												borderRadius: '5px',
												padding: '.5rem'
											}}
										>
											{
												tiposEvaluacion.filter(
													(el) =>
														el?.id ===
														subject
															?.datosMallaCurricularAsignaturaInstitucion
															?.sb_tipoEvaluacionId
												)[0]?.nombre
											}
										</div>
									</div>
								)}
								{scoreType === 'open' && (
									<>
										<p
											className="my-2"
											style={{
												margin: 0,
												fontSize: '1rem'
											}}
										>
											{t(
												'gestion_grupo>asistencia>evaluacion',
												'Tipo de evaluación'
											)}
										</p>
										<Select
											placeholder={t(
												'gestion_grupo>asistencia>evaluacion>placeholder',
												'Seleccione un tipo de evaluación'
											)}
											value={{
												label: evaluationType?.nombre,
												value: evaluationType
											}}
											options={tiposEvaluacion
												.filter((el) => el?.id !== 3)
												.map((el) => ({
													value: el,
													label: el?.nombre
												}))}
											onChange={async ({ value }) => {
												const values: any = {
													...settings,
													tipoEvaluacionId: value?.id
												}
												if (
													value?.id === 2 ||
													value?.id === 4
												) {
													values.notadepromocion = 70
												}

												setSettings(values)
												setEvaluationType(value)
											}}
										/>
									</>
								)}
							</CardBody>
						</Card>
					)}
					{activeTab === 1 &&
						(scoreType === 'summative' ||
							scoreType === 'highschool') && (
							<>
								<ComponentsSettings
									components={components}
									setComponents={setComponents}
									subject={subject}
									selectedPeriod={selectedPeriod}
									setSelectedPeriod={setSelectedPeriod}
									scoreType={scoreType}
								/>
							</>
						)}
					{activeTab === 1 && scoreType === 'formative' && (
						<RubricaModal
							sendData={async (data, student = undefined) => {}}
							handleCerrar={(data) => {
								swal({
									title: t(
										'gestion_grupo>asistencia>cambios_realizados',
										'Cambios realizados'
									),
									text: t(
										'gestion_grupo>asistencia>text_indicadores',
										'Se han detectado cambios en los indicadores de aprendizaje esperado'
									),
									icon: 'warning',
									className: 'text-alert-modal',
									buttons: {
										ok: {
											text: t(
												'configuracion>ofertas_educativas>modelo_de_ofertas>eliminar>aceptar',
												'Aceptar'
											),
											value: true,
											className: 'btn-alert-color'
										},
										cancel: t(
											'boton>general>cancelar',
											'Cancelar'
										)
									}
								}).then(async (result) => {
									if (result) {
										actions.updateJSON(
											'Rubrica',
											data,
											subject,
											selectedPeriod
										)
									}
								})
							}}
							isEdit
							initialData={{}}
							avoidModal
							contenidos={
								Array.isArray(contenidos)
									? contenidos
									: [contenidos]
							}
						/>
					)}
					{activeTab === 2 &&
						(scoreType === 'summative' ||
							scoreType === 'highschool') && (
							<>
								<StudentComponentsSettings
									components={components}
									setComponents={setComponents}
									subject={subject}
									selectedPeriod={selectedPeriod}
									setSelectedPeriod={setSelectedPeriod}
									scoreType={scoreType}
									apoyoCurricular
									currentComponents={currentComponents}
									setCurrentComponents={setCurrentComponents}
									selectedStudent={selectedStudent}
									setSelectedStudent={setSelectedStudent}
									setShouldUpdate={setShouldUpdate}
								/>
							</>
						)}
					{scoreType === 'open' &&
						(settings?.tipoEvaluacionId === 2 ||
							settings?.tipoEvaluacionId === 4) && (
							<Card style={{ width: '50%' }}>
								<CardBody>
									<h6>
										{t(
											'gestion_grupo>asistencia>nota_promocion',
											'Nota de promoción'
										)}
									</h6>
									<Input
										type="number"
										name="notadepromocion"
										style={{
											width: '100%',
											border: '1px solid #eee',
											marginTop: '1rem'
										}}
										value={settings?.notadepromocion}
										onChange={(e) => {
											const { name, value } = e.target
											setSettings((prevState) => ({
												...prevState,
												[name]: Number(value)
											}))
										}}
									/>
									<div className="my-3">
										<h6>
											{t(
												'gestion_grupo>asistencia>tipo_evaluacion',
												'Tipo de evaluación adicional'
											)}
										</h6>
										<Select
											placeholder={t(
												'gestion_grupo>asistencia>evaluacion>placeholder',
												'Seleccione un tipo de evaluación'
											)}
											value={
												settings
													? {
															label: evaluationType?.nombre,
															value: evaluationType
													  }
													: null
											}
											options={[]}
											//   onChange={async ({value}) => {
											//     const values: any =  {
											//       ...settings,
											//       elementoCatalogoId: value?.id,
											//       nombreEvaluacionAdicional: value?.nombre,
											//       codigoEvaluacionAdicional: value?.codigo,
											//     }

											//     setSettings(values)
											//     setEvaluationType(value)
											//   }}
										/>
									</div>
								</CardBody>
							</Card>
						)}
					{activeTab === 0 &&
						scoreType === 'highschool' &&
						subject.datosMallaCurricularAsignaturaInstitucion
							.escalaCalificacion && (
							<>
								<Card
									style={{ width: '45%', marginTop: '1rem' }}
								>
									<CardBody>
										<h6>
											{t(
												'gestion_grupo>asistencia>escala_calificacion',
												'Escala de calificación'
											)}
										</h6>
										<TableReactImplementation
											columns={
												[
													{
														Header: t(
															'gestion_grupo>asistencia>calificacion',
															'Calificación'
														),
														accessor:
															'calificacion',
														style: {
															textAlign: 'center'
														}
													},
													{
														Header: t(
															'gestion_grupo>asistencia>cantidad',
															'Cantidad'
														),
														accessor: 'rango',
														style: {
															textAlign: 'center'
														},
														Cell: ({ row }) => {
															return (
																<div>
																	<span>
																		{
																			row
																				.original
																				.rango
																				.inferior
																		}
																	</span>{' '}
																	-{' '}
																	<span>
																		{
																			row
																				.original
																				.rango
																				.superior
																		}
																	</span>
																</div>
															)
														}
													}
												] as any
											}
											data={JSON.parse(
												subject
													.datosMallaCurricularAsignaturaInstitucion
													.escalaCalificacion
											).map((el, i) => ({
												...el,
												style: {
													textAlign: 'center',
													backgroundColor:
														i % 2 !== 0
															? colors.opaqueGray
															: 'unset'
												}
											}))}
											avoidSearch
											orderOptions={[]}
										/>
									</CardBody>
								</Card>
							</>
						)}
				</div>
			</div>
		</Col>
	)
}

const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`

export default ScoreSettings
