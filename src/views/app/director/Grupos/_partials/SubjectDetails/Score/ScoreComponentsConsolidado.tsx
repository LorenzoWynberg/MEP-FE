import React, { useEffect, useState } from 'react'
import { TableReactImplementation as Table } from 'Components/TableReactImplementation'
import { useSelector } from 'react-redux'
import {
	Button,
	Modal,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Input
} from 'reactstrap'
import colors from 'Assets/js/colors'
import styled from 'styled-components'
import { useActions } from 'Hooks/useActions'
import { updateQualify } from 'Redux/Calificaciones/actions'
import { useTranslation } from 'react-i18next'
const ScoreComponentsConsolidado = ({
	students,
	subject,
	subjectComponents,
	mallaComponents,
	scoreType,
	configuracion
}) => {
	const { t } = useTranslation()
	const { bloques, componentesCalificacionByIds: componentesEvaluacion } =
		useSelector((state) => ({
			...state.grupos,
			...state.componentesEvaluacion
		}))
	const { scores } = useSelector((state) => state?.calificaciones)
	const [openModal, setOpenModal] = useState<
		| ''
		| 'qualify-extension-test'
		| 'see-extension-test'
		| 'qualify-recovery-activity'
		| 'see-recovery-activity'
	>('')
	const [selectedRow, setSelectedRow] = useState(null)
	const [settings, setSettings] = useState<{
		tipoEvaluacionId: number
		notadepromocion: number
		elementoCatalogoId: number
		codigoEvaluacionAdicional: string
	}>(configuracion || null)
	const [totalComponentes, setTotalComponentes] = useState<{
		[key: string]: number
	}>({
		total: 0
	})
	const [inputValues, setInputValues] = useState({
		recomendacion: '',
		porcentaje: null
	})
	const actions = useActions({
		updateQualify
	})
	const onChange = (e) => {
		const { name, value } = e.target
		setInputValues((prevState) => ({
			...prevState,
			[name]: value
		}))
	}

	useEffect(() => {
		if (subjectComponents || mallaComponents) {
			const parsedComponents = subjectComponents
				? JSON.parse(subjectComponents)
				: []
			const componentes: Array<any> = []
			bloques.forEach((el) => {
				const aux: Array<any> = parsedComponents.filter(
					(item) =>
						item.fechaPeriodoCalendarioId ===
						el.fechaPeriodoCalendarioId
				)
				if (aux.length === 0) {
					if (mallaComponents && Array.isArray(mallaComponents)) {
						const copy = mallaComponents
						const newComponents = copy.map((item) => {
							const index = componentesEvaluacion.findIndex(
								(el) =>
									el?.id === item?.sb_componenteCalificacionId
							)
							if (index !== -1) {
								return {
									...item,
									nombre: componentesEvaluacion[index]
										?.nombre,
									descripcion:
										item[index]?.descripcion ||
										componentesEvaluacion[index]
											?.descripcion,
									esAsistencia:
										componentesEvaluacion[index]
											?.esAsistencia
								}
							}

							return item
						})
						componentes.splice(
							componentes.length,
							0,
							...newComponents
						)
					}
				} else {
					componentes.splice(componentes.length, 0, ...aux)
				}
			})
			const count = {
				total: 0
			}
			componentes.forEach((el) => {
				if (
					(!el.instrumentos || el.instrumentos?.length === 0) &&
					!el.esAsistencia
				) {
					count.total += 1
					if (el?.fechaPeriodoCalendarioId) {
						count[el?.fechaPeriodoCalendarioId] = count[
							el?.fechaPeriodoCalendarioId
						]
							? count[el?.fechaPeriodoCalendarioId] + 1
							: 1
					}
				} else {
					if (!el.esAsistencia) {
						count.total += el.instrumentos.length
						if (el?.fechaPeriodoCalendarioId) {
							count[el?.fechaPeriodoCalendarioId] = count[
								el?.fechaPeriodoCalendarioId
							]
								? count[el?.fechaPeriodoCalendarioId] +
								  el.instrumentos.length
								: el.instrumentos.length
						}
					}
				}
			})
			setTotalComponentes(count)
		}
	}, [subjectComponents, mallaComponents])

	const columns = React.useMemo(
		() => [
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>estudiantes',
					'Estudiantes'
				),
				accessor: 'nombre',
				Cell: ({ row }) => (
					<div style={{ textAlign: 'left' }}>
						{row?.original?.nombre}
					</div>
				)
			},
			...bloques.map((bloque) => ({
				Header: bloque?.nombre,
				accessor: String(bloque?.fechaPeriodoCalendarioId) || '',
				Cell: (props) => {
					const { row } = props
					const calificacionesTotales = []
					scores.forEach((el, i) => {
						if (
							el.matriculasId === row?.original?.matriculasId &&
							el?.fechaPeriodoCalendario_id ===
								bloque?.fechaPeriodoCalendarioId
						) {
							calificacionesTotales.splice(
								calificacionesTotales?.length,
								0,
								...JSON.parse(el.calificaciones)
							)
						}
					})
					let total = 0
					if (
						!totalComponentes[bloque?.fechaPeriodoCalendarioId] &&
						mallaComponents
					) {
						total = mallaComponents.filter(
							(el) => !el.esAsistencia
						).length
					} else {
						total =
							totalComponentes[bloque?.fechaPeriodoCalendarioId]
					}
					if (
						row.original[bloque?.fechaPeriodoCalendarioId] &&
						total === calificacionesTotales.length &&
						(subject.datosMallaCurricularAsignaturaInstitucion
							?.codigoEvaluacionAdicional === '1001' ||
							settings?.codigoEvaluacionAdicional === '1001')
					) {
						return (
							<div
								className="d-flex justify-content-center align-items-start cursor-pointer"
								onClick={() => {
									if (
										(row.original[
											bloque?.fechaPeriodoCalendarioId
										] <
											subject
												?.datosMallaCurricularAsignaturaInstitucion
												?.notadepromocion ||
											row.original[
												bloque?.fechaPeriodoCalendarioId
											] < settings?.notadepromocion) &&
										row.original[
											`currentScore${bloque?.fechaPeriodoCalendarioId}`
										]?.notaFinal ===
											row.original[
												`currentScore${bloque?.fechaPeriodoCalendarioId}`
											]?.notaFinalPeriodoOriginal
									) {
										setOpenModal(
											'qualify-recovery-activity'
										)
									} else {
										setOpenModal('see-recovery-activity')
									}
									setSelectedRow({
										...row.original,
										currentScore:
											row.original[
												`currentScore${bloque?.fechaPeriodoCalendarioId}`
											],
										value: props.cell.value
									})
									setInputValues({
										recomendacion:
											row.original?.pruebasDeAmpliacion1
												?.recomendacion || '',
										porcentaje:
											row.original?.pruebasDeAmpliacion1
												?.valor || null
									})
								}}
							>
								<img
									src="/assets/img/alert.svg"
									alt="Asignar nota de recuperación"
								/>
								<div>
									{row.original[
										bloque?.fechaPeriodoCalendarioId
									]
										? `${
												row.original[
													bloque
														?.fechaPeriodoCalendarioId
												]
										  }%`
										: '-'}
								</div>
							</div>
						)
					}
					return (
						<div>
							{row.original[bloque?.fechaPeriodoCalendarioId]
								? `${
										row.original[
											bloque?.fechaPeriodoCalendarioId
										]
								  }%`
								: '-'}
						</div>
					)
				}
			})),
			{
				Header: t(
					'gestion_grupo>calificacion>nota_promedio_anual',
					'Nota promedio anual'
				),
				accessor: 'score'
			},
			{
				Header: t(
					'gestion_grupo>calificacion>estado_final',
					'Estado final'
				),
				accessor: 'status',
				Cell: ({ row }) => {
					if (row.original?.status === 'APROBADO') {
						return (
							<Button color="primary">
								{row.original?.status}
							</Button>
						)
					}

					if (row.original?.status !== 'APROBADO') {
						return (
							<Button color="danger">
								{row.original?.status}
							</Button>
						)
					}
					return <div />
				}
			}
		],
		[bloques, totalComponentes, t]
	)

	const data = React.useMemo(
		() => [
			...students.map((student) => {
				const periodsValue = []
				const temp: any = {}
				const scoreIndex = scores.findIndex(
					(el) => el.matriculasId === student.matriculasId
				)
				const pruebasDeAmpliacion = []
				const calificacionesTotales = []
				const aux = {}
				scores.forEach((el, i) => {
					if (el.matriculasId === student.matriculasId) {
						calificacionesTotales.splice(
							calificacionesTotales?.length,
							0,
							...JSON.parse(el.calificaciones)
						)
						periodsValue[el.fechaPeriodoCalendario_id] =
							Number(el.notaFinal) || '-'
						aux[
							`notaFinalPeriodoOriginal${el.fechaPeriodoCalendario_id}`
						] = Number(el.notaFinalPeriodoOriginal)
						aux[`notaFinal${el.fechaPeriodoCalendario_id}`] =
							Number(el.notaFinal)
						aux[`currentScore${el.fechaPeriodoCalendario_id}`] = el
					} else {
						periodsValue[i] = periodsValue[i]
							? periodsValue[i]
							: '-'
						aux[
							`notaFinalPeriodoOriginal${el.fechaPeriodoCalendario_id}`
						] =
							aux[
								`notaFinalPeriodoOriginal${el.fechaPeriodoCalendario_id}`
							] ?? '-'
						aux[`notaFinal${el.fechaPeriodoCalendario_id}`] =
							aux[`notaFinal${el.fechaPeriodoCalendario_id}`] ??
							'-'
						aux[`currentScore${el.fechaPeriodoCalendario_id}`] =
							aux[
								`currentScore${el.fechaPeriodoCalendario_id}`
							] ?? '-'
					}
				})
				const notaFinal =
					periodsValue.length > 0
						? periodsValue.reduce((acc, cur, i) => {
								if (typeof cur === 'number') {
									aux[i] = cur
									const index = bloques.findIndex(
										(el) =>
											el?.fechaPeriodoCalendarioId === i
									)
									if (index !== -1) {
										const sum =
											(cur * bloques[index].porcentaje) /
											100
										return acc + sum
									}
									return acc
								}
								return acc
						  }, 0)
						: 0

				const calificaciones = scores[scoreIndex]
					? JSON.parse(scores[scoreIndex]?.calificaciones)
					: []
				const evaluacionAdicional = calificaciones.filter(
					(el) =>
						el?.evaluacionAdicional &&
						el?.valor >=
							subject.datosMallaCurricularAsignaturaInstitucion
								.notadepromocion
				)

				calificaciones.forEach((el) => {
					if (el?.evaluacionAdicional && el?.id === 1) {
						pruebasDeAmpliacion[0] = el
					}
					if (el?.evaluacionAdicional && el?.id === 2) {
						pruebasDeAmpliacion[1] = el
					}
					if (el?.evaluacionAdicional && el?.id === 3) {
						pruebasDeAmpliacion[2] = el
					}
				})
				let status =
					scores[scoreIndex]?.notaFinalPeriodoOriginal >=
						subject.datosMallaCurricularAsignaturaInstitucion
							.notadepromocion || evaluacionAdicional.length > 0
						? 'APROBADO'
						: 'APLAZADO'
				if (scoreType === 'open') {
					status =
						scores[scoreIndex]?.notaFinalPeriodoOriginal >=
						settings.notadepromocion
							? 'APROBADO'
							: 'APLAZADO'
				}
				temp.nombre = `${student?.datosIdentidadEstudiante?.nombre} ${student?.datosIdentidadEstudiante?.primerApellido} ${student?.datosIdentidadEstudiante?.segundoApellido}`
				temp.score = notaFinal > 0 ? `${notaFinal.toFixed(2)}%` : '-'
				temp.status = status
				temp.currentScore =
					scoreIndex !== -1 ? scores[scoreIndex] : null
				if (
					subject.datosMallaCurricularAsignaturaInstitucion
						?.codigoEvaluacionAdicional === '1002' ||
					settings?.codigoEvaluacionAdicional === '1002'
				) {
					temp.calificaciones = calificacionesTotales
					temp.pruebasDeAmpliacion1 = pruebasDeAmpliacion[0]
					temp.pruebasDeAmpliacion2 = pruebasDeAmpliacion[1]
					temp.pruebasDeAmpliacion3 = pruebasDeAmpliacion[2]

					return {
						...student,
						...temp,
						...aux,
						style: {
							textAlign: 'center'
						}
					}
				}
				return {
					...student,
					...temp,
					...aux,
					style: {
						textAlign: 'center'
					}
				}
			})
		],
		[students, bloques, scores, totalComponentes]
	)

	if (
		subject.datosMallaCurricularAsignaturaInstitucion
			?.codigoEvaluacionAdicional === '1002' ||
		settings?.codigoEvaluacionAdicional === '1002'
	) {
		columns.splice(
			columns.length,
			0,
			{
				Header: t(
					'gestion_grupo>calificaciones>prueba_ampliacion',
					'Prueba de ampliación',
					'1'
				),
				accessor: 'pruebasDeAmpliacion1',
				Cell: ({ row }) => {
					if (
						row?.original?.calificaciones?.filter(
							(el) => !el.evaluacionAdicional
						)?.length !== totalComponentes.total
					) {
						return <div />
					}
					if (row.original?.pruebasDeAmpliacion1) {
						return (
							<div
								onClick={() => {
									setOpenModal('see-extension-test')
									setSelectedRow(row.original)
									setInputValues({
										recomendacion:
											row.original?.pruebasDeAmpliacion1
												?.recomendacion || '',
										porcentaje:
											row.original?.pruebasDeAmpliacion1
												?.valor || null
									})
								}}
							>
								{row.original?.pruebasDeAmpliacion1?.valor}%
							</div>
						)
					}
					if (!row.original?.pruebasDeAmpliacion1) {
						return (
							<div
								onClick={() => {
									setSelectedRow(row.original)
									setOpenModal('qualify-extension-test')
								}}
								style={{
									cursor: 'pointer',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<img
									src="/assets/img/clipboard-plus.svg"
									alt="Agregar nota de ampliación"
								/>
							</div>
						)
					}
				}
			},
			{
				Header: t(
					'gestion_grupo>calificaciones>prueba_ampliacion',
					'Prueba de ampliación',
					'2'
				),
				accessor: 'pruebasDeAmpliacion2',
				Cell: ({ row }) => {
					if (
						row?.original?.calificaciones?.filter(
							(el) => !el.evaluacionAdicional
						)?.length !== totalComponentes.total ||
						!row.original?.pruebasDeAmpliacion1
					) {
						return <div />
					}
					if (row.original?.pruebasDeAmpliacion2) {
						return (
							<div
								onClick={() => {
									setOpenModal('see-extension-test')
									setSelectedRow(row.original)
									setInputValues({
										recomendacion:
											row.original?.pruebasDeAmpliacion2
												?.recomendacion || '',
										porcentaje:
											row.original?.pruebasDeAmpliacion2
												?.valor || null
									})
								}}
							>
								{row.original?.pruebasDeAmpliacion2?.valor}%
							</div>
						)
					}
					if (
						!row.original?.pruebasDeAmpliacion2 &&
						row.original?.pruebasDeAmpliacion1?.valor <
							subject.datosMallaCurricularAsignaturaInstitucion
								?.notadepromocion
					) {
						return (
							<div
								onClick={() => {
									setSelectedRow(row.original)
									setOpenModal('qualify-extension-test')
								}}
								style={{ cursor: 'pointer' }}
							>
								<img
									src="/assets/img/clipboard-plus.svg"
									alt="Agregar nota de ampliación"
								/>
							</div>
						)
					}
					return <div />
				}
			},
			{
				Header: t(
					'gestion_grupo>calificaciones>estrategia',
					'Estrategia de promoción'
				),
				accessor: 'pruebasDeAmpliacion3',
				Cell: ({ row }) => {
					if (
						row?.original?.calificaciones?.filter(
							(el) => !el.evaluacionAdicional
						)?.length !== totalComponentes.total ||
						!row.original?.pruebasDeAmpliacion1 ||
						!row.original?.pruebasDeAmpliacion2
					) {
						return <div />
					}
					if (row.original?.pruebasDeAmpliacion3) {
						return (
							<div
								onClick={() => {
									setOpenModal('see-extension-test')
									setSelectedRow(row.original)
									setInputValues({
										recomendacion:
											row.original?.pruebasDeAmpliacion3
												?.recomendacion || '',
										porcentaje:
											row.original?.pruebasDeAmpliacion3
												?.valor || null
									})
								}}
							>
								{row.original?.pruebasDeAmpliacion3?.valor}%
							</div>
						)
					}
					if (!row.original?.pruebasDeAmpliacion3) {
						return (
							<div
								onClick={() => {
									setSelectedRow(row.original)
									setOpenModal('qualify-extension-test')
								}}
								style={{ cursor: 'pointer' }}
							>
								<img
									src="/assets/img/clipboard-plus.svg"
									alt="Agregar nota de ampliación"
								/>
							</div>
						)
					}
				}
			}
		)
	}

	const modals = {
		'see-extension-test': {
			title: t(
				'gestion_grupo>calificaciones>ver_nota_prueba',
				'Ver nota de prueba de ampliación'
			),
			notShowCancelBtn: true,
			btnSubmitText: t('general>cerrar', 'Cerrar'),
			handleClick: () => setOpenModal(''),
			body: (
				<div>
					<div className="my-2">
						<p style={{ margin: 0 }}>
							{t(
								'gestion_grupo>asistencia>estudiante',
								'Estudiante'
							)}
							:
						</p>
						<p style={{ margin: 0, fontWeight: 'bold' }}>
							{selectedRow?.nombre}
						</p>
					</div>
					<div className="my-2">
						<p style={{ margin: 0 }}>
							{t(
								'gestion_grupo>calificaciones>calificacion_original',
								'Calificación original'
							)}
							:
						</p>
						<p style={{ margin: 0, fontWeight: 'bold' }}>
							{selectedRow?.score} / 100%
						</p>
					</div>
					<div className="my-2">
						<p style={{ margin: 0 }}>
							{t(
								'gestion_grupo>calificaciones>calificacion_obtenida',
								'Calificación obtenida en la prueba'
							)}
							:
						</p>
						<p style={{ margin: 0, fontWeight: 'bold' }}>
							{inputValues?.porcentaje} / 100%
						</p>
					</div>
					<div className="my-2">
						<p style={{ margin: 0 }}>
							{t(
								'gestion_grupo>calificacion>recomendacion_pedagogica',
								'Recomendación pedagógica de la calificación'
							)}
						</p>
						<textarea
							name=""
							id=""
							rows="5"
							style={{ resize: 'none', width: '100%' }}
							value={inputValues.recomendacion}
							disabled
						/>
					</div>
				</div>
			)
		},
		'qualify-extension-test': {
			title: t(
				'gestion_grupo>calificacion>nota_prueba',
				'Nota de prueba de ampliación'
			),
			btnSubmitText: t('boton>general>guardar', 'Guardar'),
			handleClick: () => {
				let id = 1

				if (
					selectedRow?.pruebasDeAmpliacion1 &&
					!selectedRow?.pruebasDeAmpliacion2
				) {
					id = 2
				}

				if (
					selectedRow?.pruebasDeAmpliacion1 &&
					selectedRow?.pruebasDeAmpliacion2 &&
					!selectedRow?.pruebasDeAmpliacion3
				) {
					id = 3
				}
				const newScores = selectedRow?.currentScore
					? JSON.parse(selectedRow?.currentScore?.calificaciones)
					: []
				newScores.push({
					id,
					valor:
						inputValues.porcentaje >
						subject?.datosMallaCurricularAsignaturaInstitucion
							?.notadepromocion
							? subject?.datosMallaCurricularAsignaturaInstitucion
									?.notadepromocion
							: inputValues.porcentaje,
					componenteId: null,
					recomendacion: inputValues?.recomendacion,
					evaluacionAdicional: true
					// estrategiaDePromcion
				})
				actions.updateQualify({
					...selectedRow?.currentScore,
					calificaciones: JSON.stringify(newScores),
					id: selectedRow?.currentScore
						?.asignaturaGrupoEstudianteCalificaciones_Id,
					rubricasAprendizaje: '',
					notaFinalPeriodoOriginal:
						selectedRow?.currentScore?.notaFinalPeriodoOriginal,
					notaFinal: selectedRow?.currentScore?.notaFinal,
					asignaturaGrupoEstudianteMatriculadoId:
						selectedRow?.currentScore
							?.asignaturaGrupoEstudianteMatriculado_Id,
					fechaPeriodoCalendarioId:
						selectedRow?.currentScore?.fechaPeriodoCalendario_id
				})
				setOpenModal('')
				setInputValues({
					recomendacion: '',
					porcentaje: null
				})
			},
			body: (
				<div>
					<div className="d-flex justify-content-between align-items-center">
						<div>
							<p style={{ margin: 0 }}>
								{t(
									'gestion_grupo>asistencia>estudiante',
									'Estudiante'
								)}
								:
							</p>
							<p style={{ margin: 0, fontWeight: 'bold' }}>
								{selectedRow?.nombre}
							</p>
						</div>
						<div>
							<p style={{ margin: 0 }}>
								{t(
									'gestion_grupo>calificaciones>calificacion_original',
									'Calificación original'
								)}
								:
							</p>
							<p style={{ margin: 0, fontWeight: 'bold' }}>
								{selectedRow?.score !== '-'
									? selectedRow?.score
									: '?'}
								/ 100%
							</p>
						</div>
					</div>
					<p className="my-2">
						{t(
							'gestion_grupo>calificacion>calificacion_obtenida',
							'Calificación obtenida en la prueba de ampliación'
						)}
					</p>
					<div className="d-flex align-items-center">
						<InputStyled
							type="number"
							min={0}
							name="porcentaje"
							value={inputValues.porcentaje}
							onChange={(e) => {
								if (
									Number(e.target.value) > 0 &&
									Number(e.target.value) <= 100
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
							/ 100%
						</p>
					</div>
					<div className="my-2">
						<p>
							{t(
								'gestion_grupo>calificacion>recomendacion_pedagogica',
								'Recomendación pedagógica de la calificación'
							)}
						</p>
						<textarea
							name="recomendacion"
							id="recomendacion"
							rows="5"
							style={{ resize: 'none', width: '100%' }}
							value={inputValues.recomendacion}
							onChange={onChange}
						/>
					</div>
				</div>
			)
		},
		'qualify-recovery-activity': {
			title: t(
				'gestion_grupo>calificacion>actividad_recuperacion',
				'Calificación de actividad de recuperación'
			),
			btnSubmitText: t('boton>general>guardar', 'Guardar'),
			handleClick: async () => {
				if (
					inputValues.porcentaje !==
					subject?.datosMallaCurricularAsignaturaInstitucion
						?.notadepromocion
				) {
					// Show meesage
				}
				actions.updateQualify({
					...selectedRow?.currentScore,
					id: selectedRow?.currentScore
						?.asignaturaGrupoEstudianteCalificaciones_Id,
					rubricasAprendizaje: '',
					notaFinalPeriodoOriginal:
						selectedRow?.currentScore?.notaFinalPeriodoOriginal,
					notaFinal:
						inputValues.porcentaje >
						subject?.datosMallaCurricularAsignaturaInstitucion
							?.notadepromocion
							? subject?.datosMallaCurricularAsignaturaInstitucion
									?.notadepromocion
							: inputValues.porcentaje,
					asignaturaGrupoEstudianteMatriculadoId:
						selectedRow?.currentScore
							?.asignaturaGrupoEstudianteMatriculado_Id,
					fechaPeriodoCalendarioId:
						selectedRow?.currentScore?.fechaPeriodoCalendario_id
				})

				setOpenModal('')
				setSelectedRow(null)
				setInputValues({
					recomendacion: '',
					porcentaje: null
				})
			},
			body: (
				<div>
					<div>
						<div>
							<p style={{ margin: 0 }}>
								{t(
									'gestion_grupo>asistencia>estudiante',
									'Estudiante'
								)}
								:
							</p>
							<p style={{ margin: 0, fontWeight: 'bold' }}>
								{selectedRow?.nombre}
							</p>
						</div>
						<div>
							<p style={{ margin: 0 }}>
								{t(
									'gestion_grupo>calificaciones>calificacion_original',
									'Calificación original'
								)}
								:
							</p>
							<p style={{ margin: 0, fontWeight: 'bold' }}>
								{selectedRow?.score !== '-'
									? selectedRow?.value
									: '?'}
								/ 100%
							</p>
						</div>
					</div>
					<p className="my-2">
						{t(
							'gestion_grupo>calificacion>calificacion_actividad_recuperacion',
							'Calificación obtenida en la actividad de recuperación'
						)}
					</p>
					<div className="d-flex align-items-center">
						<InputStyled
							type="number"
							min={0}
							name="porcentaje"
							value={inputValues.porcentaje}
							onChange={(e) => {
								if (
									Number(e.target.value) > 0 &&
									Number(e.target.value) <= 100
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
							/ 100%
						</p>
					</div>
				</div>
			)
		},
		'see-recovery-activity': {
			title: t(
				'gestion_grupo>calificaciones>ver_nota_prueba',
				'Ver nota de prueba de ampliación'
			),
			notShowCancelBtn: true,
			btnSubmitText: t('general>cerrar', 'Cerrar'),
			handleClick: () => setOpenModal(''),
			body: (
				<div>
					<div className="my-2">
						<p style={{ margin: 0 }}>
							{t(
								'gestion_grupo>asistencia>estudiante',
								'Estudiante'
							)}
							:
						</p>
						<p style={{ margin: 0, fontWeight: 'bold' }}>
							{selectedRow?.nombre}
						</p>
					</div>
					<div className="my-2">
						<p style={{ margin: 0 }}>
							{t(
								'gestion_grupo>calificaciones>calificacion_original',
								'Calificación original'
							)}
							:
						</p>
						<p style={{ margin: 0, fontWeight: 'bold' }}>
							{
								selectedRow?.currentScore
									?.notaFinalPeriodoOriginal
							}{' '}
							/ 100%
						</p>
					</div>
					<div className="my-2">
						<p style={{ margin: 0 }}>
							{t(
								'gestion_grupo>calificaciones>calificacion_obtenida',
								'Calificación obtenida en la prueba'
							)}
							:
						</p>
						<p style={{ margin: 0, fontWeight: 'bold' }}>
							{selectedRow?.currentScore?.notaFinal} / 100%
						</p>
					</div>
				</div>
			)
		}
	}

	return (
		<div style={{ width: '100%', overflowX: 'scroll' }}>
			<CustomModal
				isOpen={openModal.length > 0}
				toggle={() => setOpenModal('')}
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
								onClick={() => {
									setOpenModal('')
									setInputValues({
										recomendacion: '',
										porcentaje: null
									})
								}}
							>
								{modals[openModal]?.btnCancelText ||
									t('general>cancelar', 'Cancelar')}
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
			<div>
				<Table
					data={data}
					columns={columns as any}
					orderOptions={[]}
					avoidSearch
				/>
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

export default ScoreComponentsConsolidado
