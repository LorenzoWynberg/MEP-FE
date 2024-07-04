import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import colors from 'Assets/js/colors'
import {
	Button,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	InputGroupAddon,
	DropdownToggle,
	Col,
	Card,
	CardBody
} from 'reactstrap'
import {
	getScoresBySubjectGroup,
	qualifyStudent,
	updateJSON
} from 'Redux/Calificaciones/actions'
import styled from 'styled-components'
import search from 'Utils/search'
import ModalHistorial from './Historial'
import { FormativeComponents } from './FormativeComponents'
import { useActions } from 'Hooks/useActions'
import RubricaModal from './RubricaModal'
import ComponentsGrade from './ScoreComponents'
import ScoreComponentsConsolidado from './ScoreComponentsConsolidado'
import ScoreSettings from './ScoreSettings'
import { getComponenteCalificacionByListIds } from 'Redux/componentesEvaluacion/actions'
import swal from 'sweetalert'
import { getAcumuladoAsistenciaByAsignaturaGrupo } from 'Redux/Asistencias/actions'
import { useTranslation } from 'react-i18next'
import { Calificacion } from '../../../../../../../api'
import { GenerateExcelObject, SendWorkbookToDownload } from 'Utils/excel'
interface IProps {
	students: any[]
	subject: any
}

const Score: React.FC<IProps> = (props) => {
	const { t } = useTranslation()
	const { bloques, componentesCalificacionByIds: componentesEvaluacion } =
		useSelector((state) => ({
			...state.grupos,
			...state.componentesEvaluacion
		}))
	const { membersBySubjectGroup: students } = useSelector(
		(state) => state.grupos
	)
	const { acumulados } = useSelector((state) => state.asistencias)
	const { currentInstitution } = useSelector((state) => state.authUser)
	const { scores } = useSelector((state) => state?.calificaciones)
	const [searchValue, setSearchValue] = useState('')
	const [openModal, setOpenModal] = useState<
		| ''
		| 'dropdown-period'
		| 'score-settings'
		| 'rubrica-Modal-edit'
		| 'rubrica-modal-calificar'
		| 'rubrica-modal-consolidado'
	>('')
	const [currentContenidos, setCurrentContenidos] = useState<any | null>(null)
	const [selectedPeriod, setSelectedPeriod] = useState(null)
	const [items, setItems] = useState([])
	const [scoreType, setScoreType] = useState<
		'' | 'open' | 'highschool' | 'formative' | 'summative'
	>('summative')
	const [grades, setGrades] = useState<Array<Array<any>>>([])
	const [dataRubrica, setDataRubrica] = useState<object>({ student: {} })
	const [rubricaModalData, setRubricaModalData] = useState<object>({})
	const [currentContenido, setCurrentContenido] = useState<object>({})
	const [components, setComponents] = useState([])
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [currentComponents, setCurrentComponents] = useState([])
	const [currentStudent, setCurrentStudent] = useState({})
	const [idx, setIdx] = useState<number>(null)
	const [subjectComponents, setSubjectComponent] = useState([])
	const [parsedScores, setParsedScores] = useState<any[]>([])
	const [scoresByPeriod, setScoresByPeriod] = useState([])
	const [shouldUpdate, setShouldUpdate] = useState(false)
	const anioEducativo = useSelector(store => store.authUser.selectedActiveYear)
	const actions = useActions({
		qualifyStudent,
		getScoresBySubjectGroup,
		getComponenteCalificacionByListIds,
		getAcumuladoAsistenciaByAsignaturaGrupo,
		updateJSON
	})
	const scoreTypes = {
		1: 'formative',
		2: 'summative',
		3: 'open',
		4: 'highschool'
	}

	const configuracion = props?.subject?.configuracionCalificacion
		? JSON.parse(props?.subject?.configuracionCalificacion)
		: {}

	useEffect(() => {
		setScoresByPeriod(
			scores.filter(
				(el) =>
					el?.fechaPeriodoCalendario_id ===
					selectedPeriod?.fechaPeriodoCalendarioId
			)
		)
	}, [scores, scores.length])

	useEffect(() => {
		if (scoreType === 'open' && !configuracion?.tipoEvaluacionId) {
			setOpenModal('score-settings')
		}
	}, [scoreType])

	useEffect(() => {
		actions.updateJSON(
			'ConfiguracionCalificacion',
			{},
			props.subject,
			selectedPeriod
		)
	}, [])

	useEffect(() => {
		setParsedScores(
			scoresByPeriod?.map((el) => {
				return {
					...el,
					calificacionParsed: el.calificaciones
						? JSON.parse(el.calificaciones)
						: {}
				}
			}) || []
		)
	}, [scoresByPeriod])

	useEffect(() => {
		const selectedComponents = props.subject.componentesCalificacion
			? JSON.parse(props.subject.componentesCalificacion)
			: []
		if (
			componentesEvaluacion?.length > 0 &&
			selectedPeriod?.fechaPeriodoCalendarioId &&
			selectedComponents?.findIndex &&
			selectedComponents?.findIndex(
				(el) =>
					el.fechaPeriodoCalendarioId ===
					selectedPeriod?.fechaPeriodoCalendarioId
			) === -1
		) {
			const copy = JSON.parse(JSON.stringify(components))
			const newComponents = copy.map((item) => {
				const index = componentesEvaluacion.findIndex(
					(el) => el?.id === item?.sb_componenteCalificacionId
				)
				if (index !== -1) {
					const rubricaAprendizaje = componentesEvaluacion[index]
						?.rubricaAprendizaje
						? JSON.parse(
							componentesEvaluacion[index]?.rubricaAprendizaje
						)
						: ''
					return {
						...item,
						nombre: componentesEvaluacion[index]?.nombre,
						descripcion:
							item[index]?.descripcion ||
							componentesEvaluacion[index]?.descripcion,
						esAsistencia:
							componentesEvaluacion[index]?.esAsistencia,
						noRequiereInstrumentos:
							componentesEvaluacion[index]
								?.noRequiereInstrumentos,
						rubricaAprendizaje:
							rubricaAprendizaje?.length > 0
								? {
									...rubricaAprendizaje.map((el) => ({
										...el,
										contenidos: JSON.parse(el?.json)
											?.Contenidos
									}))[0],
									selectedIds: []
								}
								: ''
					}
				}

				return item
			})
			setComponents(newComponents)
		}
	}, [componentesEvaluacion, selectedPeriod])

	useEffect(() => {
		// console.clear()
		console.log(props.subject)
		const selectedComponents = props.subject.componentesCalificacion
			? JSON.parse(props.subject.componentesCalificacion)
			: []
		const mallaComponents = props.subject
			?.datosMallaCurricularAsignaturaInstitucion?.componenteclasificacion
			? JSON.parse(
				props.subject?.datosMallaCurricularAsignaturaInstitucion
					?.componenteclasificacion
			)
			: []
		if (mallaComponents.length > 0) {
			actions.getComponenteCalificacionByListIds(
				props.subject?.datosMallaCurricularAsignaturaInstitucion
					?.sb_mallaCurricularesInstitucionId,
				props.subject?.datosMallaCurricularAsignaturaInstitucion
					?.sb_asignaturaId,
				mallaComponents
					? mallaComponents.map(
						(el) => el?.sb_componenteCalificacionId
					)
					: []
			)
		}

		if (selectedPeriod) {
			const newComponents =
				selectedComponents &&
					selectedComponents?.findIndex &&
					selectedComponents?.findIndex(
						(el) =>
							el.fechaPeriodoCalendarioId ===
							selectedPeriod?.fechaPeriodoCalendarioId
					) !== -1
					? selectedComponents.filter(
						(item) =>
							item.fechaPeriodoCalendarioId ===
							selectedPeriod?.fechaPeriodoCalendarioId
					)
					: mallaComponents
			if (newComponents) {
				const aux = newComponents.map((el) => {
					return { ...el, instrumentos: el?.instrumentos || [] }
				})
				setComponents(aux)
			}
		}
		if (
			props?.subject?.datosMallaCurricularAsignaturaInstitucion
				?.sb_tipoEvaluacionId
		) {
			setScoreType(
				scoreTypes[
				props?.subject?.datosMallaCurricularAsignaturaInstitucion
					?.sb_tipoEvaluacionId
				]
			)
		}
		actions.getScoresBySubjectGroup(props.subject.id)
		if (selectedPeriod) {
			actions.getAcumuladoAsistenciaByAsignaturaGrupo(
				props.subject.id,
				currentInstitution?.id,
				selectedPeriod?.fechaPeriodoCalendarioId
			)
		}
	}, [props.subject, selectedPeriod])

	useEffect(() => {
		if (components.length > 0) {
			const newComponents = [
				...components
					.filter((el) => !el.matriculasId)
					.map((el) => ({
						header: el?.nombre || el?.id,
						instrumento: '',
						puntos: el.puntos,
						porcentaje: el?.valor,
						value: el,
						esAsistencia: el?.esAsistencia ? true : undefined,
						totalPorcentajeInstrumentos:
							el.instrumentos?.length > 0
								? el.instrumentos?.reduce(
									(acc, cur) =>
										(acc += Number(cur?.valor) || 0),
									0
								)
								: 0,
						columns:
							el.instrumentos?.length > 0
								? el.instrumentos.map((item) => ({
									instrumento: item?.nombre,
									puntos: item?.puntos,
									porcentaje: item?.valor,
									parent: el,
									rubricaAprendizaje:
										item.rubricaAprendizaje,
									value: item,
									total: el.instrumentos?.reduce(
										(acc, cur) =>
										(acc +=
											Number(cur?.valor) || 0),
										0
									)
								}))
								: null
					}))
			]
			setSubjectComponent(newComponents)
		}
	}, [components])

	useEffect(() => {
		if (bloques.length > 0) {
			setSelectedPeriod(bloques[0])
		}
	}, [bloques])

	const onSearchKey = async (e) => {
		const { value } = e.target
		setSearchValue(value)
		if (
			((e.charCode === 13 || e.keyCode === 13 || e.key === 'Enter') &&
				value.length >= 3) ||
			value.length === 0
		) {
			setItems(
				search(value).in(
					students.map((student) => ({
						...student,
						nombre: student?.datosIdentidadEstudiante?.nombre
					})),
					['nombre']
				)
			)
		}
	}

	const findScore = (
		parentIndex,
		childIndex,
		index,
		parent,
		child,
		calificaciones = []
	) => {
		const idxs = []
		if (Array.isArray(calificaciones)) {
			calificaciones.forEach((calificacion, idx) => {
				if (
					childIndex !== null &&
					calificacion.componenteId ===
					subjectComponents[parentIndex]?.value?.id &&
					calificacion.instrumentoId ===
					subjectComponents[parentIndex]?.columns[childIndex]
						?.value?.id
				) {
					idxs.push(idx)
				}
				if (
					calificacion.componenteId ===
					subjectComponents[parentIndex]?.value?.id &&
					subjectComponents[parentIndex]?.value?.instrumentos
						.length === 0 &&
					!calificacion.instrumentoId
				) {
					idxs.push(idx)
				}
			})
		}
		if (idxs[0] !== undefined) {
			return {
				...child,
				component: parent,
				score: { ...scoresByPeriod[index] },
				calificaciones,
				nota: { ...calificaciones[idxs[0]], index: idxs[0] }
			}
		}
		return false
	}

	useEffect(() => {
		if (items && scoreType !== 'formative') {
			const total = subjectComponents.reduce((acc, cur) => {
				return cur?.columns ? acc + cur.columns.length : acc + 1
			}, 0)

			const newGrades = new Array(total).fill(
				new Array(items.length).fill(0)
			)
			let skippedCount = 0
			subjectComponents.forEach((el, parentIndex) => {
				if (el?.columns) {
					el.columns.forEach((item, childIndex) => {
						const count =
							parentIndex > 0
								? parentIndex + childIndex + skippedCount
								: parentIndex + childIndex
						newGrades[count] = newGrades[count].map((e, i) => {
							const index = scoresByPeriod
								? scoresByPeriod.findIndex(
									(score) =>
										score.matriculasId ===
										items[i]?.matriculasId
								)
								: -1
							if (index !== -1) {
								const calificaciones = JSON.parse(
									scoresByPeriod[index].calificaciones
								)
								const res = findScore(
									parentIndex,
									childIndex,
									index,
									item,
									e,
									calificaciones || []
								)
								// NOTE: Retorna la nota
								if (res) {
									const auxComponentId = components.findIndex(
										(com) =>
											com.id ===
											res.component?.parent?.id &&
											com.matriculasId ===
											items[i]?.matriculasId
									)
									let auxInstrumentId = -1
									if (
										auxComponentId !== -1 &&
										components[auxComponentId].instrumentos
									) {
										auxInstrumentId = components[
											auxComponentId
										].instrumentos?.findIndex(
											(instrument) =>
												instrument.id ===
												item?.value?.id
										)
									}
									const component =
										auxComponentId !== -1 &&
											auxInstrumentId !== -1
											? {
												...components[
													auxComponentId
												]?.instrumentos[
												auxInstrumentId
												],
												value: {
													...components[
														auxComponentId
													]?.instrumentos[
													auxInstrumentId
													]
												},
												parent: {
													...el,
													id: el?.value?.id
												}
											}
											: res.component
									return {
										...JSON.parse(
											JSON.stringify({
												...res,
												component: {
													...component,
													componentIndex: count
												}
											})
										)
									}
								}
								// NOTE: Retorna el objeto calificacion entero
								const componentIndex = components.findIndex(
									(com) =>
										com.id === el?.value?.id &&
										com.matriculasId ===
										items[i]?.matriculasId
								)
								let instrumentIndex = -1
								if (
									componentIndex !== -1 &&
									components[componentIndex].instrumentos
								) {
									instrumentIndex = components[
										componentIndex
									].instrumentos?.findIndex(
										(instrument) =>
											instrument.id === item?.value?.id
									)
								}
								const component =
									componentIndex !== -1 &&
										instrumentIndex !== -1
										? {
											...components[componentIndex]
												?.instrumentos[
											instrumentIndex
											],
											value: {
												...components[
													componentIndex
												]?.instrumentos[
												instrumentIndex
												]
											},
											parent: {
												...el,
												id: el?.value?.id
											}
										}
										: item
								return {
									...e,
									component: {
										...component,
										componentIndex: count
									},
									score: { ...scoresByPeriod[index] },
									calificaciones
								}
							}
							const studentComponentIndex = components.findIndex(
								(com) => {
									if (
										com.id === el?.value?.id &&
										com.matriculasId ===
										items[i]?.matriculasId
									) {
										return true
									}
									return false
								}
							)
							let studentInstrumentIndex = -1
							if (
								studentComponentIndex !== -1 &&
								components[studentComponentIndex].instrumentos
							) {
								studentInstrumentIndex = components[
									studentComponentIndex
								].instrumentos?.findIndex(
									(instrument) =>
										instrument.id === item?.value?.id
								)
							}
							const component =
								studentComponentIndex !== -1 &&
									studentInstrumentIndex !== -1
									? {
										...components[studentComponentIndex]
											?.instrumentos[
										studentInstrumentIndex
										],
										value: {
											...components[
												studentComponentIndex
											]?.instrumentos[
											studentInstrumentIndex
											]
										},
										parent: { ...el, id: el?.value?.id }
									}
									: item
							return {
								...e,
								component: {
									...component,
									componentIndex: count
								},
								score: null
							}
						})
						if (childIndex > 0) skippedCount++
					})
					return
				}

				newGrades[parentIndex + skippedCount] = newGrades[
					parentIndex + skippedCount
				].map((e, i) => {
					const index = scoresByPeriod
						? scoresByPeriod.findIndex(
							(score) =>
								score.matriculasId ===
								items[i]?.matriculasId
						)
						: -1
					if (e.esAsistencia) {
						const i = acumulados.findIndex(
							(acumulado) =>
								acumulado.asignaturaGrupoEstudianteMatriculado_Id ===
								items[i]?.id
						)
						if (i !== -1) {
							return {
								...acumulados[i],
								nota: {
									valor:
										(acumulados[i]?.asistenciaTotal *
											e?.porcentaje) /
										100
								}
							}
						}
					}
					if (index !== -1) {
						const calificaciones = JSON.parse(
							scoresByPeriod[index].calificaciones
						)
						const res = findScore(
							parentIndex,
							null,
							index,
							el,
							e,
							calificaciones || []
						)
						// NOTE: Retorna la nota
						if (res) {
							const studentComponentIndex = components.findIndex(
								(com) =>
									com.id === res.component?.value?.id &&
									com.matriculasId === items[i]?.matriculasId
							)
							const component =
								studentComponentIndex !== -1
									? {
										...components[
										studentComponentIndex
										],
										value: {
											...components[
											studentComponentIndex
											]
										}
									}
									: res.component
							return {
								...res,
								component: {
									...component,
									componentIndex: parentIndex + skippedCount,
									rubricaAprendizaje:
										el?.value?.rubricaAprendizaje
								}
							}
						}
						// NOTE: Retorna el objeto calificacion entero
						const studentComponentIndex = components.findIndex(
							(com) =>
								com.id === el?.value?.id &&
								com.matriculasId === items[i]?.matriculasId
						)
						const component =
							studentComponentIndex !== -1
								? {
									...components[studentComponentIndex],
									value: {
										...components[studentComponentIndex]
									}
								}
								: el
						return {
							...e,
							component: {
								...component,
								componentIndex: parentIndex + skippedCount,
								rubricaAprendizaje:
									el?.value?.rubricaAprendizaje
							},
							score: { ...scoresByPeriod[index] },
							calificaciones,
							componentIndex: parentIndex + skippedCount
						}
					}
					const studentComponentIndex = components.findIndex(
						(com) =>
							com.id === el?.value?.id &&
							com.matriculasId === items[i]?.matriculasId
					)
					const component =
						studentComponentIndex !== -1
							? {
								...components[studentComponentIndex],
								value: {
									...components[studentComponentIndex]
								}
							}
							: el
					return {
						...e,
						component: {
							...component,
							componentIndex: parentIndex + skippedCount,
							rubricaAprendizaje: el?.value?.rubricaAprendizaje
						},
						score: null
					}
				})
			})
			setGrades(newGrades)
		}
	}, [items, subjectComponents, scoresByPeriod, scoresByPeriod.length])

	useEffect(() => {
		if (students?.length > 0) {
			setItems(students)
		}
	}, [students])

	useEffect(() => {
		if (bloques?.length > 0) {
			setSelectedPeriod(bloques[0])
		}
	}, [bloques])

	useEffect(() => {
		let jsonData = JSON.parse(
			props.subject.datosMallaCurricularAsignaturaInstitucion
				?.rubricaAprendizaje
		)
		if (Array.isArray(jsonData)) {
			jsonData = jsonData[0]
		}

		const jsonDataParsed = jsonData?.json
			? JSON.parse(jsonData.json)
			: typeof jsonData === 'string'
				? JSON.parse(jsonData)
				: {}
		let rubrica = props.subject.rubricaAprendizaje
			? JSON.parse(props.subject.rubricaAprendizaje).contenidos
			: jsonDataParsed?.Contenidos
		if (Array.isArray(rubrica)) {
			rubrica = rubrica[0]
		}

		setRubricaModalData({
			...jsonData,
			...jsonDataParsed,
			Contenidos: Array.isArray(rubrica) ? rubrica : [rubrica]
		})
	}, [props.subject])

	const handleRubricaModal = (el) => {
		setDataRubrica(el)
		setCurrentContenido(el)
		setOpenModal('rubrica-modal-calificar')
	}

	const handleRubricaModalConsolidado = (el) => {
		setDataRubrica(el)
		setCurrentContenido(el)
		setOpenModal('rubrica-modal-consolidado')
	}

	const tableComponents = [
		{
			header: t('gestion_grupo>asistencia>instrumentos', 'Instrumentos'),
			accessor: 'instrumento'
		},
		{
			header: t('expediente_ce>normativa_interna>puntos', 'Puntos'),
			accessor: 'puntos'
		},
		{
			header: t(
				'configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>agregar>porcentaje',
				'Porcentaje'
			),
			accessor: 'porcentaje'
		}
	]

	useEffect(() => {
		if (components.length > 0) {
			setCurrentComponents(
				components.filter(
					(el) => el?.matriculasId === selectedStudent?.matriculasId
				).length > 0
					? components.filter(
						(el) =>
							el?.matriculasId ===
							selectedStudent?.matriculasId
					)
					: components.filter((el) => !el.matriculasId)
			)
		}
	}, [selectedStudent])

	useEffect(() => {
		if (currentComponents.length > 0 && selectedStudent) {
			const newComponents = [...JSON.parse(JSON.stringify(components))]
			currentComponents.forEach((component, index) => {
				const componentIndex = components.findIndex((el) => {
					if (
						el?.id === component.id &&
						el?.matriculasId === selectedStudent?.matriculasId
					) {
						return true
					}
					return false
				})
				if (componentIndex !== -1) {
					newComponents[componentIndex] = shouldUpdate
						? {
							...newComponents[componentIndex],
							...component
						}
						: {
							...component,
							...newComponents[componentIndex]
						}
				} else {
					if (
						components.filter(
							(item) =>
								item.matriculasId ===
								selectedStudent?.matriculasId
						).length === 0
					) {
						newComponents.push({
							...component,
							matriculasId: selectedStudent?.matriculasId
						})
					}
				}
			})
			const updateComponents = async () => {
				await actions.updateJSON(
					'Componentes',
					newComponents,
					props.subject,
					selectedPeriod
				)
				await setComponents(newComponents)
				// setShouldUpdate(!shouldUpdate)
				// setMount(true);
			}
			updateComponents()
		}
	}, [currentComponents, selectedStudent])

	if (openModal === 'score-settings') {
		return (
			<>
				<ScoreSettings
					scoreType={scoreType}
					showAtinencias
					open={openModal}
					setOpen={setOpenModal}
					components={components}
					setComponents={setComponents as any}
					subject={props.subject}
					selectedPeriod={selectedPeriod}
					setSelectedPeriod={setSelectedPeriod as any}
					configuracion={
						props?.subject?.configuracionCalificacion
							? JSON.parse(
								props?.subject?.configuracionCalificacion
							)
							: {}
					}
					selectedStudent={selectedStudent}
					setSelectedStudent={setSelectedStudent}
					currentComponents={currentComponents}
					setCurrentComponents={setCurrentComponents}
					setShouldUpdate={setShouldUpdate}
				/>
			</>
		)
	}

	const handleQualifyStudent = async (data) => {
		const _data = {
			id: data.asignaturaGrupoEstudianteCalificaciones_Id || data.id,
			fechaPeriodoCalendarioId: selectedPeriod.fechaPeriodoCalendarioId,
			asignaturaGrupoEstudianteMatriculadoId:
				currentStudent.id || currentStudent.Id,
			rubricasAprendizaje:
				props.subject.datosMallaCurricularAsignaturaInstitucion
					?.rubricaAprendizaje || '',
			componentesCalificacion:
				props.subject.datosMallaCurricularAsignaturaInstitucion
					?.componenteclasificacion || '',
			calificaciones: JSON.stringify(data),
			notaFinalPeriodoOriginal: 0,
			notaFinal: 0,
			estado: true,
			apoyoCurricular: false
		}

		let response
		if (_data.id) {
			response = await actions.qualifyStudent(_data)
		} else {
			response = await actions.qualifyStudent(_data)
		}
		if (!response.error) {
			actions.getScoresBySubjectGroup(props.subject.id)
			return false
		}
		return true
	}

	const onExportExcelClick = () => {
		Calificacion.fetchCalificacionesByPeriodoGrupoAnio(
			selectedPeriod?.fechaPeriodoCalendarioId?.periodoId ? selectedPeriod?.fechaPeriodoCalendarioId.periodoId : null,
			props.subject.sb_gruposId,
			anioEducativo.id
		)
			.then(r => {
				const { data } = r
				let componenteCalificacionArr = null
				const _estudiantes = data.estudiantes.filter(
					x => x.calificaciones[0].asignatura.asignaturaGrupoId === props.subject.id
				)
				const json = _estudiantes.map(e => {
					const obj: any = {}
					const { calificaciones } = e
					obj.Estudiante = e.nombre
					const _calificaciones = calificaciones.filter(
						x => x.asignatura.asignaturaGrupoId === props.subject.id
					)
					_calificaciones.forEach(calification => {
						const { componenteCalificacion, calificacion } = calification
						componenteCalificacionArr = componenteCalificacion
							? JSON.parse(componenteCalificacion)
							: componenteCalificacionArr
						const calificacionArr = calificacion ? JSON.parse(calificacion) : []
						componenteCalificacionArr.forEach(comp => {
							const c = calificacionArr.find(i => i.componenteId == comp.id)
							obj[comp.nombre] = c ? c.valor : 'N/E'
						})
						obj['Nota Final'] = calification.notaFinal
					})
					return obj
				})

				const workBook = GenerateExcelObject(json)
				SendWorkbookToDownload(workBook, 'Reporte.xlsx')
			}).catch(e => console.log(e))
	}
	return (
		<Col>
			<div className="d-flex my-5 justify-content-between">
				<div style={{ width: '40%' }}>
					<div className="search-sm--rounded">
						<input
							type="text"
							name="keyword"
							id="search"
							onInput={(e) => onSearchKey(e)}
							onKeyPress={(e) => onSearchKey(e)}
							autoComplete="off"
							placeholder={t(
								'general>buscador_estudiante>placeholder',
								'Buscar estudiante'
							)}
						/>
						<StyledInputGroupAddon addonType="append">
							<Button
								color="primary"
								className="buscador-table-btn-search"
								onClick={() => {
									setItems(
										search(searchValue).in(
											students.map((student) => ({
												...student,
												nombre: student
													?.datosIdentidadEstudiante
													?.nombre
											})),
											['nombre']
										)
									)
								}}
							>
								{t('general>buscar', 'Buscar')}
							</Button>
						</StyledInputGroupAddon>
					</div>
				</div>
				<div className="">
					<Dropdown
						isOpen={openModal === 'dropdown-period'}
						toggle={() =>
							setOpenModal((prevState) =>
								prevState === 'dropdown-period'
									? ''
									: 'dropdown-period'
							)
						}
					>
						<CustomDropdownToggle caret color="primary">
							{selectedPeriod?.nombre ||
								t(
									'gestion_grupos>escoge_periodo',
									'Escoge un periodo'
								)}
						</CustomDropdownToggle>
						<DropdownMenu>
							{[
								...bloques,
								{
									nombre: t(
										'gestion_grupos>consolidado',
										'Consolidado'
									),
									id: 0
								}
							].map((period) => (
								<DropdownItem
									onClick={() => setSelectedPeriod(period)}
									key={period.id}
								>
									{period.nombre}
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
			<Card>
				<CardBody style={{ overflow: 'auto' }}>
					<div className="d-flex justify-content-between align-items-center">
						<h4>
							{t(
								'gestion_grupos>tab>calificaciones',
								'Calificaciones'
							)}
						</h4>
						<div className="d-flex align-items-center">
							<div className="mr-2">
								<Button
									style={{ backgroundColor: `${colors.primary}` }}
									onClick={onExportExcelClick}
								>
									Exportar a Excel
								</Button>
							</div>
							<div className="mr-2">
								<ModalHistorial subject={props.subject} />
							</div>
							{selectedPeriod?.nombre !== 'Consolidado' && (
								<Button
									color="primary"
									onClick={() =>
										setOpenModal('score-settings')
									}
								>
									{t(
										'menu>configuracion>configuracion',
										'Configuración'
									)}
								</Button>
							)}
						</div>
					</div>
					{(scoreType === 'summative' ||
						scoreType === 'highschool' ||
						(scoreType === 'open' &&
							(configuracion?.tipoEvaluacionId === 2 ||
								configuracion?.tipoEvaluacionId === 4))) &&
						selectedPeriod?.nombre !== 'Consolidado' && (
							<ComponentsGrade
								grades={grades}
								subjectComponents={subjectComponents}
								tableComponents={tableComponents}
								students={items}
								selectedPeriod={selectedPeriod}
								components={components}
								scoreType={scoreType}
								subject={props.subject}
							/>
						)}
					{scoreType === 'formative' && (
						<FormativeComponents
							students={students}
							objectives={rubricaModalData.Contenidos}
							handleModal={handleRubricaModal}
							handleRubricaModalConsolidado={
								handleRubricaModalConsolidado
							}
							setCurrentStudent={setCurrentStudent}
							selectedPeriod={selectedPeriod}
							setCurrentContenidos={setCurrentContenidos}
							scores={parsedScores}
							setIdx={setIdx}
						/>
					)}
					{scoreType === 'summative' &&
						selectedPeriod?.nombre === 'Consolidado' && (
							<ScoreComponentsConsolidado
								students={items}
								subject={props.subject}
								subjectComponents={
									props.subject.componentesCalificacion
								}
								mallaComponents={componentesEvaluacion}
								scoreType={scoreType}
								configuracion={
									props?.subject?.configuracionCalificacion
										? JSON.parse(
											props?.subject
												?.configuracionCalificacion
										)
										: {}
								}
							/>
						)}
				</CardBody>
			</Card>
			<RubricaModal
				sendData={async (data, student = undefined) => {
					if (openModal === 'rubrica-modal-consolidado') {
						setOpenModal(null)
					} else {
						const response = await handleQualifyStudent({
							id: data.id,
							selectedIds: data.selectedIds,
							observaciones: data.observaciones,
							objectiveIdx: data.objectiveIdx
						})
						if (student !== undefined) {
							const qualified = parsedScores?.find((el) => {
								return (
									el.asignaturaGrupoEstudianteMatriculado_Id ===
									students[idx + student].id &&
									el.calificacionParsed.objectiveIdx ===
									data.objectiveIdx
								)
							})
							setCurrentStudent(students[idx + student])
							setIdx(idx + student)
							if (qualified) {
								handleRubricaModal({
									...dataRubrica,
									id:
										qualified.asignaturaGrupoEstudianteCalificaciones_Id ||
										qualified.id,
									jsonData: qualified.calificaciones,
									student: students[idx + student]
								})
							} else {
								handleRubricaModal({
									...dataRubrica,
									id: null,
									jsonData:
										'{"selectedIds":[],"observaciones":{}}',
									student: students[idx + student]
								})
							}
						}
					}
				}}
				handleCerrar={(data) => {
					if (openModal === 'rubrica-modal-consolidado') {
						setOpenModal(null)
					} else {
						swal({
							title: t(
								'gestion_grupo>asistencia>cambios_realizados',
								'Cambios realizados'
							),
							text: t(
								'gestion_grupos>calificacion>modal_msg',
								'Se han detectado cambios en la calificación del indicador de aprendizaje esperado'
							),
							icon: 'warning',
							className: 'text-alert-modal',
							buttons: {
								ok: {
									text: t('general>aceptar', 'Aceptar'),
									value: true,
									className: 'btn-alert-color'
								},
								cancel: t('boton>general>cancelar', 'Cancelar')
							}
						}).then((result) => {
							if (result) {
								handleQualifyStudent({
									id: data.id,
									selectedIds: data.selectedIds,
									observaciones: data.observaciones,
									objectiveIdx: data.objectiveIdx
								})
							}
							setOpenModal(null)
						})
					}
				}}
				contenido={currentContenido}
				contenidos={
					openModal == 'rubrica-modal-consolidado'
						? currentContenidos
						: null
				}
				data={dataRubrica}
				consolidado={openModal === 'rubrica-modal-consolidado'}
				hasMore={!!students[idx + 1]}
				hasLess={!!students[idx - 1]}
				noEdit={openModal === 'rubrica-modal-consolidado'}
				open={
					openModal === 'rubrica-Modal-edit' ||
					openModal === 'rubrica-modal-calificar' ||
					openModal === 'rubrica-modal-consolidado'
				}
			/>
		</Col>
	)
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  }
`

const CustomDropdownToggle = styled(DropdownToggle)`
	text-overflow: ellipsis;
	overflow-x: hidden;
	&:hover,
	&:active,
	&:focus {
		background-color: #145388 !important;
		color: #fff !important;
	}
`

export default Score
