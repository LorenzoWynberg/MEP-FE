import React, { useEffect, useState } from 'react'
import colors from 'Assets/js/colors'
import {
	Button,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap'
import styled from 'styled-components'
import { HourglassEmpty, ErrorOutline } from '@material-ui/icons'
import { qualifyStudent, updateQualify } from 'Redux/Calificaciones/actions'
import { useActions } from 'Hooks/useActions'
import swal from 'sweetalert'
import RubricaModal from './RubricaModal'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@material-ui/core'
import useNotification from 'Hooks/useNotification'

const ScoreComponents = ({
	students,
	tableComponents,
	grades,
	subjectComponents,
	selectedPeriod,
	components,
	scoreType,
	subject
}) => {
	const { t } = useTranslation()
	const [openModal, setOpenModal] = useState<
		'' | 'qualify' | 'updateScore' | 'seeScore' | 'qualify-rubrica'
	>('')
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [selectedComponent, setSelectedComponent] = useState<any>(null)
	const [selectedInstrument, setSelectedInstrument] = useState<any>(null)
	const [averageScore, setAverageScore] = useState([])
	const [inputValues, setInputValues] = useState({
		puntos: null,
		porcentaje: null,
		excepcion: null,
		tieneExcepcion: false,
		recomendaciones: null,
		porcentajeAutoCalculado: null
	})
	const [currentScore, setCurrentScore] = useState<any>(null)
	const actions = useActions({
		qualifyStudent,
		updateQualify
	})
	const [snackbar, handleClick] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: ''
	})

	useEffect(() => {
		if (students.length === 0) {
			setAverageScore([])
		}
		if (students.length > 0 && grades.length > 0) {
			const newAverage = []
			students.forEach((student, i) => {
				const average =
					grades[0][i]?.calificaciones &&
					Array.isArray(grades[0][i]?.calificaciones)
						? grades[0][i]?.calificaciones.reduce((acc, cur) => {
								if (
									cur.tieneExcepcion ||
									cur.evaluacionAdicional
								) {
									return acc
								}
								return acc + (Number(cur.valor) || 0)
						  }, 0)
						: 0

				let aux = average === 0 ? 0 : Number(Number(average).toFixed(2))
				if (scoreType === 'highschool') {
					const escalaFinal =
						grades[0][i]?.score?.escalaFinal ||
						grades[0][i]?.score?.escalafinal ||
						''
					aux =
						average === 0
							? 0
							: `${escalaFinal} - ${Number(
									Number(average).toFixed(2)
							  )}`
				}

				newAverage.push(aux)
			})
			setAverageScore(newAverage)
		}
	}, [students, grades])

	useEffect(() => {
		if (inputValues?.puntos) {
			const porcentaje = inputValues.puntos
				? (Number(inputValues?.puntos) * selectedInstrument?.valor) /
				  selectedInstrument?.puntos
				: null

			// if (scoreType === 'highschool') {
			//   porcentaje = inputValues.puntos
			//   ? Number(inputValues?.puntos) * selectedInstrument?.valor / selectedInstrument?.puntos
			//   : null
			// }
			setInputValues((prevState) => ({
				...prevState,
				porcentajeAutoCalculado:
					porcentaje % 1 === 0
						? porcentaje
						: Number(porcentaje).toFixed(2),
				porcentaje:
					porcentaje % 1 === 0
						? porcentaje
						: Number(porcentaje).toFixed(2)
			}))
		}
	}, [inputValues?.puntos])

	const onChange = (e) => {
		const { name, value } = e.target
		setInputValues((prevState) => ({
			...prevState,
			[name]: value
		}))
	}

	const qualify = (closeModal = true, type = '', rubrica = null) => {
		if (
			selectedInstrument?.puntos &&
			(inputValues?.puntos < 0 ||
				inputValues?.puntos > Number(selectedInstrument?.puntos))
		) {
			setSnackbarContent({
				variant: 'error',
				msg: t('general>msj>valor_incorrecto', 'Valor incorrecto')
			})
			handleClick()
			return
		}

		if (
			!selectedInstrument?.puntos &&
			(inputValues?.porcentaje < 0 ||
				inputValues?.porcentaje > Number(selectedInstrument?.valor))
		) {
			setSnackbarContent({
				variant: 'error',
				msg: t('general>msj>valor_incorrecto', 'Valor incorrecto')
			})
			handleClick()
			return
		}
		const newQualify: any = {
			puntos: inputValues?.puntos,
			valor:
				inputValues.porcentaje % 1 === 0
					? inputValues.porcentaje
					: Number(inputValues.porcentaje).toFixed(2),
			componenteId: selectedComponent?.id,
			instrumentoId:
				selectedInstrument?.instrumentos?.length === 0
					? undefined
					: selectedInstrument?.id
		}
		if (inputValues.tieneExcepcion) {
			newQualify.excepcion = inputValues?.excepcion
			newQualify.tieneExcepcion = true
		}

		if (!inputValues.tieneExcepcion) {
			newQualify.recomendaciones = inputValues?.recomendaciones
		}

		if (
			scoreType === 'highschool' &&
			(selectedInstrument?.escalaCalificacion ||
				selectedComponent?.escalaCalificacion)
		) {
			const escalaCalificacion =
				selectedInstrument?.escalaCalificacion ||
				selectedComponent?.escalaCalificacion
			escalaCalificacion.forEach((el) => {
				if (
					inputValues?.puntos >= el?.rango?.inferior &&
					inputValues?.puntos <= el?.rango?.superior
				) {
					newQualify.escalaAsignada = el?.calificacion
				}
			})
		}

		if (type === 'rubrica') {
			let cells: Array<any> = rubrica.contenidos.map((contenido) =>
				contenido.filas.map((fila) => fila.celdas)
			)
			cells = cells.flat(2)
			const selectedCells = cells.filter(
				(el) =>
					rubrica.selectedIds.includes(el.id) ||
					rubrica.selectedIds.includes(el.guid)
			)
			const puntos = selectedCells.reduce((acc, cur) => {
				return acc + Number(cur?.puntos)
			}, 0)

			newQualify.puntos = puntos
			newQualify.valor = Number(
				(Number(puntos) * selectedInstrument?.valor) /
					selectedInstrument?.puntos
			).toFixed(2)
			newQualify.rubricaAprendizaje = { ...rubrica, puntos }
		}

		const escalaCalificacion = subject
			?.datosMallaCurricularAsignaturaInstitucion?.escalaCalificacion
			? JSON.parse(
					subject?.datosMallaCurricularAsignaturaInstitucion
						?.escalaCalificacion
			  )
			: []
		let escalaFinal = 0
		escalaCalificacion.forEach((el) => {
			if (
				Number(newQualify.valor) >= el?.rango?.inferior ||
				Number(newQualify.valor) <= el?.rango?.superior
			) {
				escalaFinal = el?.calificacion
			}
		})
		if (!currentScore?.score) {
			if (
				newQualify?.rubricaAprendizaje?.selectedIds &&
				newQualify?.rubricaAprendizaje?.selectedIds?.length === 0
			) {
				return
			}
			 	actions.qualifyStudent({
				fechaPeriodoCalendarioId:
					selectedPeriod?.fechaPeriodoCalendarioId,
				asignaturaGrupoEstudianteMatriculadoId:
					students[selectedStudent]?.id,
				rubricasAprendizaje: '',
				componentesCalificacion: JSON.stringify(components),
				calificaciones: JSON.stringify([newQualify]),
				notaFinalPeriodoOriginal:
					averageScore[selectedStudent] || Number(newQualify.valor),
				notaFinal:
					averageScore[selectedStudent] || Number(newQualify.valor),
				apoyoCurricular: false,
				escalafinal:
					scoreType === 'highschool' && escalaFinal ? escalaFinal : ''
			})
		} else {
			const newScores = currentScore?.calificaciones || []
			if (currentScore?.nota?.index !== undefined) {
				newScores[currentScore?.nota?.index] = newQualify
				if (
					newQualify?.rubricaAprendizaje?.selectedIds &&
					newQualify?.rubricaAprendizaje?.selectedIds?.length === 0
				) {
					newScores.splice(currentScore?.nota?.index, 1)
				}
			} else {
				if (
					newQualify?.rubricaAprendizaje?.selectedIds &&
					newQualify?.rubricaAprendizaje?.selectedIds?.length === 0
				) {
					return
				}
				if (
					!newQualify?.rubricaAprendizaje?.selectedIds ||
					(newQualify?.rubricaAprendizaje?.selectedIds &&
						newQualify?.rubricaAprendizaje?.selectedIds?.length > 0)
				) {
					newScores.push(newQualify)
				}
			}

			const notaFinal = Number(
				Number(
					newScores.reduce((acc, cur) => {
						if (cur?.evaluacionAdicional) {
							return acc
						}
						return acc + Number(cur.valor || 0)
					}, 0)
				).toFixed(2)
			)

			const escalaCalificacion = subject
				?.datosMallaCurricularAsignaturaInstitucion?.escalaCalificacion
				? JSON.parse(
						subject?.datosMallaCurricularAsignaturaInstitucion
							?.escalaCalificacion
				  )
				: []
			let escalaFinal = 0
			escalaCalificacion.forEach((el) => {
				if (
					notaFinal >= el?.rango?.inferior &&
					notaFinal <= el?.rango?.superior
				) {
					escalaFinal = el?.calificacion
				}
			})

			actions.updateQualify({
				...currentScore?.score,
				calificaciones: JSON.stringify(newScores),
				id: currentScore?.score
					?.asignaturaGrupoEstudianteCalificaciones_Id,
				rubricasAprendizaje: '',
				notaFinalPeriodoOriginal: notaFinal,
				notaFinal,
				asignaturaGrupoEstudianteMatriculadoId:
					currentScore?.score
						?.asignaturaGrupoEstudianteMatriculado_Id,
				fechaPeriodoCalendarioId:
					currentScore?.score?.fechaPeriodoCalendario_id,
				escalafinal:
					scoreType === 'highschool' && escalaFinal ? escalaFinal : ''
			})
		}
		setInputValues({
			puntos: null,
			porcentaje: null,
			excepcion: null,
			tieneExcepcion: false,
			recomendaciones: null,
			porcentajeAutoCalculado: null
		})
		if (closeModal) {
			setOpenModal('')
			setSelectedComponent(null)
			setSelectedInstrument(null)
			setCurrentScore(null)
		}
	}

	useEffect(() => {
		if (selectedStudent !== null && selectedInstrument) {
			const el =
				grades[selectedInstrument?.componentIndex || 0][selectedStudent]
			setInputValues({
				...inputValues,
				recomendaciones: el?.nota?.recomendaciones || '',
				tieneExcepcion: el?.nota?.tieneExcepcion || false,
				excepcion: el?.nota?.excepcion || '',
				puntos: el?.nota?.puntos || 0,
				porcentaje: el?.nota?.valor || 0,
				porcentajeAutoCalculado: 0
			})
			setCurrentScore({
				score: el?.score,
				nota: el?.nota,
				calificaciones: el?.calificaciones
			})
		}
	}, [selectedStudent, selectedInstrument])

	useEffect(() => {
		if (selectedStudent !== null) {
			const el =
				grades[selectedInstrument?.componentIndex || 0][selectedStudent]
			setSelectedComponent(el.component.parent || el.component.value)
			setSelectedInstrument(
				JSON.parse(
					JSON.stringify({
						...el.component.value,
						value: el.component.value,
						componentIndex: el?.component?.componentIndex
					})
				)
			)
		}
	}, [selectedStudent])

	const handleCerrar = (closeModal = true, type = '', rubrica = null) => {
		if (
			(openModal === 'qualify' || openModal === 'qualify-rubrica') &&
			(inputValues?.puntos || inputValues?.porcentaje) &&
			(currentScore?.puntos !== inputValues?.puntos ||
				currentScore?.valor !== inputValues?.porcentaje ||
				currentScore?.recomendaciones !==
					inputValues?.recomendaciones ||
				currentScore?.excepcion !== inputValues?.excepcion ||
				currentScore?.tieneExcepcion !== inputValues?.tieneExcepcion)
		) {
			qualify(closeModal, type, rubrica)
			setOpenModal('')
			setSelectedComponent(null)
			setSelectedInstrument(null)
			setCurrentScore(null)
		}
	}

	const modals = {
		qualify: {
			title: 'Calificar',
			btnSubmitText: 'Guardar',
			btnCancelText: 'Cerrar',
			notShowCancelBtn: false,
			handleClick: () => {
				handleCerrar()
			},
			body: (
				<>
					<div className="d-flex w-100 justify-content-between align-items-center">
						<Button
							color="primary"
							disabled={selectedStudent === 0}
							onClick={async () => {
								await qualify(false)
								setSelectedStudent((prevState) => prevState - 1)
							}}
						>
							<i className="fas fa-arrow-circle-left" />{' '}
							{t('general>anterior', 'Anterior')}
						</Button>
						<div className="text-center">
							<p style={{ margin: 0, fontWeight: 'bold' }}>
								{t(
									'gestion_grupo>asistencia>estudiante',
									'Estudiante'
								)}
								:
							</p>
							<p style={{ margin: 0 }}>
								{students[selectedStudent]?.nombreCompleto}
							</p>
						</div>
						<Button
							color="primary"
							onClick={async () => {
								await qualify(false)
								setSelectedStudent((prevState) => prevState + 1)
							}}
							disabled={selectedStudent === students.length - 1}
						>
							{t('general>siguiente', 'Siguiente')}{' '}
							<i className="fas fa-arrow-circle-right" />
						</Button>
					</div>
					<div className="my-3">
						<p style={{ margin: 0 }}>
							{t(
								'gestion_grupo>calificacion>componente',
								'Componente'
							)}
						</p>
						<p style={{ margin: 0, fontWeight: 'bold' }}>
							{selectedComponent?.nombre}
						</p>
					</div>
					<div className="mb-3">
						<p style={{ margin: 0 }}>
							{t(
								'gestion_grupo>asistencia>estudiante',
								'Estudiante'
							)}
						</p>
						<p style={{ margin: 0, fontWeight: 'bold' }}>
							{students[selectedStudent]?.nombreCompleto}
						</p>
					</div>
					{selectedInstrument?.puntos && (
						<div className="d-flex justify-content-between w-75 mb-3">
							<div className="">
								<p style={{ margin: 0 }}>
									{t(
										'expediente_ce>normativa_interna>puntos',
										'Puntos'
									)}
								</p>
								<div className="d-flex align-items-center">
									<InputStyled
										type="number"
										min={0}
										value={inputValues?.puntos}
										disabled={openModal === 'seeScore'}
										name="puntos"
										onChange={(e) => {
											if (
												Number(e?.target.value) >= 0 &&
												Number(e?.target.value) <=
													Number(
														selectedInstrument?.puntos
													)
											) {
												onChange(e)
											}
										}}
									/>
									<p
										style={{
											margin: 0,
											backgroundColor: colors?.opaqueGray,
											padding: '.5rem',
											textAlign: 'center',
											border: `1px solid ${colors.opaqueGray}`
										}}
									>
										/ {selectedInstrument?.puntos}
									</p>
								</div>
							</div>
							{currentScore?.nota && (
								<div
									style={{
										alignSelf: currentScore?.nota
											? 'flex-end'
											: 'unset'
									}}
								>
									<Button
										color="primary"
										onClick={async () => {
											const newScores =
												currentScore?.calificaciones?.filter(
													(_, i) =>
														i !==
														currentScore?.nota
															?.index
												)
											const notaFinal = Number(
												Number(
													newScores.reduce(
														(acc, cur) => {
															if (
																cur?.evaluacionAdicional
															) {
																return acc
															}
															return (
																acc +
																Number(
																	cur.valor ||
																		0
																)
															)
														},
														0
													)
												).toFixed(2)
											)
											const escalaCalificacion =
												subject?.escalaCalificacion
													? JSON.parse(
															subject?.escalaCalificacion
													  )
													: []
											let escalaFinal = 0
											escalaCalificacion.forEach((el) => {
												if (
													notaFinal >=
														el?.rango?.inferior ||
													notaFinal <=
														el?.rango?.superior
												) {
													escalaFinal =
														el?.calificacion
												}
											})
											actions.updateQualify({
												...currentScore?.score,
												calificaciones:
													JSON.stringify(newScores),
												id: currentScore?.score
													?.asignaturaGrupoEstudianteCalificaciones_Id,
												rubricasAprendizaje: '',
												notaFinalPeriodoOriginal:
													notaFinal,
												notaFinal,
												asignaturaGrupoEstudianteMatriculadoId:
													currentScore?.score
														?.asignaturaGrupoEstudianteMatriculado_Id,
												fechaPeriodoCalendarioId:
													currentScore?.score
														?.fechaPeriodoCalendario_id,
												escalafinal:
													scoreType ===
														'highschool' &&
													escalaFinal
														? escalaFinal
														: ''
											})
											setCurrentScore(null)
											setOpenModal('')
										}}
									>
										Restablecer
									</Button>
								</div>
							)}
							<div
								style={{
									alignSelf: currentScore?.nota
										? 'flex-end'
										: 'unset'
								}}
							>
								<p style={{ margin: 0 }}>Porcentaje</p>
								<p style={{ margin: 0, fontWeight: 'bold' }}>
									{inputValues?.porcentajeAutoCalculado ||
										inputValues.porcentaje}{' '}
									/ {selectedInstrument?.valor}%
								</p>
							</div>
						</div>
					)}
					{!selectedInstrument?.puntos && (
						<div className="d-flex justify-content-between w-75 mb-3">
							<div className="">
								<p style={{ margin: 0 }}>Porcentaje</p>
								<div className="d-flex align-items-center">
									<InputStyled
										type="number"
										min={0}
										onChange={(e) => {
											if (
												Number(e.target.value) >= 0 &&
												Number(e.target.value) <=
													Number(
														selectedInstrument?.valor
													)
											) {
												onChange(e)
											}
										}}
										name="porcentaje"
										disabled={openModal === 'seeScore'}
										value={inputValues?.porcentaje}
									/>
									<p
										style={{
											margin: 0,
											backgroundColor: colors?.opaqueGray,
											padding: '.5rem',
											textAlign: 'center',
											border: `1px solid ${colors.opaqueGray}`
										}}
									>
										/ {selectedInstrument?.valor}%
									</p>
								</div>
							</div>
							{currentScore?.nota && (
								<div
									style={{
										alignSelf: currentScore?.nota
											? 'flex-end'
											: 'unset'
									}}
								>
									<Button
										color="primary"
										onClick={async () => {
											const newScores =
												currentScore?.calificaciones?.filter(
													(_, i) =>
														i !==
														currentScore?.nota
															?.index
												)
											const notaFinal = Number(
												Number(
													newScores.reduce(
														(acc, cur) => {
															if (
																cur?.evaluacionAdicional
															) {
																return acc
															}
															return (
																acc +
																Number(
																	cur.valor ||
																		0
																)
															)
														},
														0
													)
												).toFixed(2)
											)
											const escalaCalificacion = subject
												?.datosMallaCurricularAsignaturaInstitucion
												?.escalaCalificacion
												? JSON.parse(
														ssubject
															?.datosMallaCurricularAsignaturaInstitucion
															?.escalaCalificacion
												  )
												: []
											let escalaFinal = 0
											escalaCalificacion.forEach((el) => {
												if (
													notaFinal >=
														el?.rango?.inferior ||
													notaFinal <=
														el?.rango?.superior
												) {
													escalaFinal =
														el?.calificacion
												}
											})
											actions.updateQualify({
												...currentScore?.score,
												calificaciones:
													JSON.stringify(newScores),
												id: currentScore?.score
													?.asignaturaGrupoEstudianteCalificaciones_Id,
												rubricasAprendizaje: '',
												notaFinalPeriodoOriginal:
													notaFinal,
												notaFinal,
												asignaturaGrupoEstudianteMatriculadoId:
													currentScore?.score
														?.asignaturaGrupoEstudianteMatriculado_Id,
												fechaPeriodoCalendarioId:
													currentScore?.score
														?.fechaPeriodoCalendario_id,
												escalafinal:
													scoreType ===
														'highschool' &&
													escalaFinal
														? escalaFinal
														: ''
											})
											setCurrentScore(null)
											setOpenModal('')
										}}
									>
										{t(
											'gestion_grupo>calificacion>restablecer',
											'Restablecer'
										)}
									</Button>
								</div>
							)}
						</div>
					)}
					{!inputValues?.tieneExcepcion && (
						<div>
							<p style={{ margin: 0 }}>
								{t(
									'gestion_grupo>calificacion>recomendacion_pedagogica',
									'Recomendación pedagógica de la calificación'
								)}
							</p>
							<Input
								type="textarea"
								rows={3}
								style={{ resize: 'none' }}
								value={inputValues?.recomendaciones}
								disabled={openModal === 'seeScore'}
								onChange={onChange}
								name="recomendaciones"
							/>
						</div>
					)}
					{/* <div className="">
            <CustomInput
              className="custom-checkbox d-inline-block mt-3"
              type="checkbox"
              checked={inputValues?.tieneExcepcion}
              onClick={() => setInputValues((prevState) => ({...prevState, tieneExcepcion: !inputValues?.tieneExcepcion}))}
            /> Excepciones
          </div>
          {
            inputValues?.tieneExcepcion && (
              <div className="">
                <p style={{ margin: 0 }}>Detalle de la excepción</p>
                <Input
                  type="textarea"
                  rows={3}
                  style={{ resize: 'none' }}
                  value={inputValues?.excepcion}
                  disabled={openModal === 'seeScore'}
                  onChange={onChange}
                  name="excepcion"
                />
              </div>
            )
          } */}
				</>
			)
		}
	}
	return (
		<div>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			<CustomModal
				isOpen={openModal.length > 0 && openModal !== 'qualify-rubrica'}
				toggle={() => handleCerrar()}
				size={modals[openModal]?.size || 'md'}
				style={{ borderRadius: '10px' }}
				centered="static"
			>
				<ModalHeader>{modals[openModal]?.title}</ModalHeader>
				<ModalBody>{modals[openModal]?.body}</ModalBody>
				<ModalFooter>
					<div className="d-flex justify-content-center align-items-center w-100">
						{!modals[openModal]?.notShowCancelBtn && (
							<Button
								color="outline-primary"
								className="mr-3"
								onClick={() => setOpenModal('')}
							>
								{modals[openModal]?.btnCancelText ||
									t('boton>general>cancelar', 'Cancelar')}
							</Button>
						)}
						<Button
							color="primary"
							onClick={() => {
								modals[openModal]?.handleClick()
								setOpenModal('')
							}}
						>
							{modals[openModal]?.btnSubmitText ||
								t('boton>general>confirmar', 'Confirmar')}
						</Button>
					</div>
				</ModalFooter>
			</CustomModal>
			<RubricaModal
				initialData={{}}
				hasMore={!!students[selectedStudent + 1]}
				hasLess={!!students[selectedStudent - 1]}
				headerData={currentScore?.nota?.rubricaAprendizaje?.contenidos.map(
					(contenido) => {
						const cells = contenido.filas.map((row) => row.celdas)
						const flattedCells = cells.flat(2)
						const selectedCells = flattedCells.filter(
							(el) =>
								currentScore?.nota?.rubricaAprendizaje.selectedIds.findIndex(
									(item) =>
										item === el?.id || item === el?.guid
								) !== -1
						)
						const puntos = selectedCells.reduce((acc, cur) => {
							return acc + Number(cur?.puntos)
						}, 0)
						const indicadoresEvaluados = contenido.filas.filter(
							(row) =>
								row.celdas.findIndex(
									(cell) =>
										currentScore?.nota?.rubricaAprendizaje.selectedIds.includes(
											cell.id
										) ||
										currentScore?.nota?.rubricaAprendizaje.selectedIds.includes(
											cell.guid
										)
								) !== -1
						)
						const porcentaje =
							(puntos * inputValues.porcentaje) /
							inputValues?.puntos
						return {
							puntos,
							porcentaje,
							indicadoresEvaluados: indicadoresEvaluados.length,
							indicadoresTotales: contenido.filas.filter(
								(row) => !row.inactiva
							).length,
							valor: selectedInstrument?.valor
						}
					}
				)}
				sendData={(data, student = 0) => {
					qualify(false, 'rubrica', data)
					setSelectedStudent((prevState) => prevState + student)
				}}
				handleCerrar={(data) => {
					handleCerrar(true, 'rubrica', data)
				}}
				data={{
					student: students[selectedStudent],
					...currentScore?.nota?.rubricaAprendizaje
				}}
				contenidos={selectedInstrument?.rubricaAprendizaje?.contenidos}
				open={openModal === 'qualify-rubrica'}
			/>
			<div className="d-flex" style={{ marginTop: '1rem' }}>
				<div style={{ width: '50%' }}>
					<div
						style={{
							height: '15.5rem',
							width: '100%',
							backgroundColor: '#eaeaea',
							borderTop: '1px solid #dbdbdb',
							borderLeft: '1px solid #dbdbdb'
						}}
					/>
					<div
						style={{
							borderRight: `1px solid ${colors.darkGray}`,
							borderLeft: `1px solid ${colors.darkGray}`
						}}
					>
						<div
							className="generic-schedule__row-content"
							style={{
								width: '100%',
								backgroundColor: '#eaeaea',
								borderTop: `1px solid ${colors.darkGray}`,
								borderBottom: `1px solid ${colors.darkGray}`
							}}
						>
							{t('menu>estudiantes>estudiantes', 'Estudiantes')}
						</div>
						{students &&
							students.map((student, index) => (
								<div
									className="generic-schedule__row-content"
									style={{
										width: '100%',
										textOverflow: 'ellipsis',
										border: 'none',
										backgroundColor:
											index % 2 !== 0
												? '#eaeaea'
												: 'unset',
										borderBottom:
											index === students.length - 1
												? `1px solid ${colors.darkGray}`
												: 'unset'
									}}
									key={index}
								>
									{student?.nombreCompleto}
								</div>
							))}
						{students.length === 0 && (
							<div
								className="generic-schedule__row-content"
								style={{
									width: '100%',
									textOverflow: 'ellipsis',
									border: 'none',
									borderBottom: `1px solid ${colors.darkGray}`
								}}
							/>
						)}
					</div>
				</div>
				<div>
					<div
						className="generic-schedule__column-header"
						style={{
							width: '10rem',
							height: '5rem',
							textAlign: 'center',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						{t(
							'gestion_grupo>calificacion>componentes',
							'Componentes'
						)}
					</div>
					{tableComponents.map((item) => (
						<div>
							<div className="">
								<div
									className="generic-schedule__row-content"
									key={item.accessor}
									style={{
										justifyContent: 'flex-start',
										fontWeight: 'bold',
										padding: '0 .5rem',
										width: '10rem'
									}}
								>
									{item.header}
								</div>
							</div>
						</div>
					))}
					<div
						style={{
							borderRight: `1px solid ${colors.darkGray}`
						}}
					>
						<div
							className="generic-schedule__row-content"
							style={{
								width: '10rem',
								backgroundColor: '#eaeaea',
								borderTop: `1px solid ${colors.darkGray}`,
								borderBottom: `1px solid ${colors.darkGray}`
							}}
						>
							{t(
								'gestion_grupo>calificaciones>historia>nota_final',
								'Nota final'
							)}
						</div>
						{averageScore.map((el, index) => (
							<div
								className="generic-schedule__row-content"
								style={{
									width: '10rem',
									backgroundColor:
										index % 2 !== 0 ? '#eaeaea' : 'unset',
									border: 'none',
									borderBottom:
										index === students.length - 1
											? `1px solid ${colors.darkGray}`
											: 'unset'
								}}
								key={index}
							>
								{el === 0 ? '-' : `${el}%`}
							</div>
						))}
						{averageScore.length === 0 && (
							<div
								className="generic-schedule__row-content"
								style={{
									width: '10rem',
									border: 'none',
									borderBottom: `1px solid ${colors.darkGray}`
								}}
							/>
						)}
					</div>
				</div>
				<div style={{ width: '100%', overflowX: 'scroll' }}>
					<>
						<div className="d-flex">
							{subjectComponents.map((item, index) => (
								<div key={index}>
									<div
										className="generic-schedule__column-header"
										style={{
											width: item?.columns
												? `calc(8rem * ${item.columns.length})`
												: '8rem',
											height: '5rem'
										}}
									>
										<div
											style={{ margin: 0, height: '80%' }}
											className="d-flex justify-content-center align-items-center"
										>
											<span className="mr-1">
												{item.header}
											</span>
											{item?.totalPorcentajeInstrumentos >
												0 &&
												item?.totalPorcentajeInstrumentos !==
													item.porcentaje && (
													<Tooltip
														title={t(
															'general>tooltip>valor_corresponde',
															'El valor de los instrumentos no corresponde con el valor del componente'
														)}
													>
														<span
															style={{
																color: '#d63031',
																cursor: 'pointer'
															}}
														>
															<ErrorOutline />
														</span>
													</Tooltip>
												)}
										</div>
										<div
											style={{
												margin: 0,
												borderTop: '1px solid gray',
												height: '20%'
											}}
										>
											{item?.porcentaje
												? `${item?.porcentaje}%`
												: ''}
										</div>
									</div>
									{!item.columns ? (
										<>
											{tableComponents.map((el) => (
												<div
													className="generic-schedule__row-content"
													style={{ width: '8rem' }}
												>
													{el.accessor ===
													'porcentaje'
														? `${
																item[
																	el.accessor
																]
														  }%`
														: item[el.accessor] ||
														  '-'}
												</div>
											))}
										</>
									) : (
										<div className="d-flex">
											{item.columns.map((el) => (
												<div>
													{tableComponents.map(
														(e) => (
															<div
																className="generic-schedule__row-content"
																style={{
																	width: '8rem'
																}}
															>
																{e.accessor ===
																'porcentaje'
																	? `${
																			el[
																				e
																					.accessor
																			]
																	  }%`
																	: el[
																			e
																				.accessor
																	  ] || '-'}
															</div>
														)
													)}
												</div>
											))}
										</div>
									)}
								</div>
							))}
						</div>
						<div className="d-flex">
							{grades.length > 0 && (
								<>
									{grades?.map((_, index) => (
										<div
											className="generic-schedule__row-content"
											style={{
												width: '8rem',
												padding: '0 3.9rem',
												backgroundColor: '#eaeaea',
												borderTop: `1px solid ${colors.darkGray}`,
												borderRight: `1px solid ${colors.darkGray}`,
												borderBottom: `1px solid ${colors.darkGray}`
											}}
											key={index}
										>
											{t(
												'gestion_grupo>asistencia>calificacion',
												'Calificación'
											)}
										</div>
									))}
								</>
							)}
						</div>
						<div className="d-flex">
							{students.length > 0 &&
								grades.map((item, index) => (
									<div
										key={index}
										style={{
											borderRight: `1px solid ${colors.darkGray}`,
											minWidth: '8rem'
										}}
									>
										{item.map((el, i) => (
											<>
												<div
													className="generic-schedule__row-content"
													style={{
														width: '7.90rem',
														backgroundColor:
															i % 2 !== 0
																? '#eaeaea'
																: 'unset',
														border: '1px solid transparent',
														cursor: 'pointer',
														borderBottom:
															i ===
															students.length - 1
																? `1px solid ${colors.darkGray}`
																: 'unset'
													}}
													onClick={() => {
														if (
															!el?.component
																?.value
																?.esAsistencia
														) {
															if (el?.score) {
																setInputValues({
																	...inputValues,
																	recomendaciones:
																		el?.nota
																			?.recomendaciones,
																	tieneExcepcion:
																		el?.nota
																			?.tieneExcepcion,
																	excepcion:
																		el?.nota
																			?.excepcion,
																	puntos: el
																		?.nota
																		?.puntos,
																	porcentaje:
																		el?.nota
																			?.valor
																})
																setCurrentScore(
																	{
																		score: el?.score,
																		nota: el?.nota,
																		calificaciones:
																			el?.calificaciones
																	}
																)
															}
															setSelectedStudent(
																i
															)
															setOpenModal(
																el.component
																	?.rubricaAprendizaje
																	? 'qualify-rubrica'
																	: 'qualify'
															)
															setSelectedComponent(
																el.component
																	.parent ||
																	el.component
																		.value
															)
															setSelectedInstrument(
																JSON.parse(
																	JSON.stringify(
																		{
																			...el
																				.component
																				.value,
																			value: el
																				.component
																				.value,
																			componentIndex:
																				el
																					?.component
																					?.componentIndex
																		}
																	)
																)
															)
														}
													}}
												>
													{(el?.nota?.valor &&
														`${
															el?.nota
																?.escalaAsignada
																? el?.nota
																		?.escalaAsignada +
																  ' - '
																: ''
														}${
															el?.nota?.valor
														}%`) || (
														<HourglassEmpty
															style={{
																color: colors.primary
															}}
														/>
													)}
												</div>
											</>
										))}
									</div>
								))}
							{students.length === 0 &&
								grades.map((item) => (
									<div
										className="generic-schedule__row-content"
										style={{
											width: '8rem',
											cursor: 'pointer'
										}}
									>
										<div
											className="generic-schedule__row-content"
											style={{
												width: '7.90rem',
												border: '1px solid transparent',
												cursor: 'pointer',
												borderBottom: `1px solid ${colors.darkGray}`
											}}
										/>
									</div>
								))}
						</div>
					</>
				</div>
			</div>
		</div>
	)
}

const CustomModal = styled(Modal)`
	&.modal-dialog {
		box-shadow: unset !important;
	}
	& > div.modal-content {
		border-radius: 10px !important;
	}
`

const InputStyled = styled(Input)`
	border-radius: 0px !important;
	margin: 0;
	text-align: center;
	border: 1px solid ${colors.opaqueGray};
	width: 3.5rem;
	height: 2.4rem;
`

export default ScoreComponents
