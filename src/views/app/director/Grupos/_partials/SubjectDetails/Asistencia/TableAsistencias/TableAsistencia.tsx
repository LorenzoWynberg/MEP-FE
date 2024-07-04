import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import styled from 'styled-components'
import {
	Dropdown,
	DropdownToggle,
	DropdownItem,
	DropdownMenu
} from 'reactstrap'
import Table from './Table'
import DetailTable from './DetailTable'
import AsistenciasLanding from '../AsistenciasLanding'
import ModalHistorial from '../Historial'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'
import colors from 'Assets/js/colors'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import {
	createMultipleAssistance,
	getAssistanceByIdentidadId,
	getAssistanceByIdentidadIdsAndLectionId
} from 'Redux/Asistencias/actions'
import { getCatalogs } from 'Redux/selects/actions'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import getEstadoAsignatura from '../../../../../../../../utils/getEstadoAsignatura'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import { useTranslation } from 'react-i18next'

const TableAsistencia = ({
	days,
	onLastWeek,
	onNextWeek,
	date,
	selectedLection,
	setSelectedLection,
	currentSubject,
	setCurrentSubject,
	selectedPeriod,
	setEditable
}) => {
	const { t } = useTranslation()
	const [openModal, setOpenModal] = useState<
		'' | 'add-incident' | 'edit-assis' | 'see-assis' | 'dropdown-masiva'
	>('')
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [modalOpen, setModalOpen] = useState(false)
	const { lections } = useSelector((state) => state.lecciones)
	const { lectionsSubjectGroup } = useSelector(
		(state) => state.leccionAsignaturaGrupo
	)
	const { membersBySubjectGroup } = useSelector((state) => state.grupos)
	const {
		assistancesByIdentidadId: assistances,
		currentAssistances,
		types
	} = useSelector((state) => state.asistencias)
	const { estadoAsistencia } = useSelector((state) => state.selects)
	const [daysFilter, setDaysFilter] = useState([])
	const [selectedDayFilter, setSelectedDayFilter] = useState(
		currentSubject?.diaSemana - 1 || 0
	)

	const toggle = (student) => {
		setModalOpen(!modalOpen)
	}

	const actions = useActions({
		getCatalogs,
		getAssistanceByIdentidadIdsAndLectionId,
		createMultipleAssistance,
		getAssistanceByIdentidadId
	})

	useEffect(() => {
		actions.getCatalogs(catalogsEnumObj.ESTADOASISTENCIA.id)
	}, [])

	useEffect(() => {
		if (membersBySubjectGroup.length > 0) {
			actions.getAssistanceByIdentidadIdsAndLectionId(
				membersBySubjectGroup.map((item) => item?.identidadesId),
				currentSubject?.leccionAsignaturaGrupoId
			)
		}
	}, [membersBySubjectGroup, currentSubject, daysFilter])

	const calculateCurrentDay = (currentDay) => {
		const date = new Date()
		date.setDate(date.getDate() - date.getDay() + 1)
		date.setDate(date.getDate() + currentDay)

		return date
	}

	useEffect(() => {
		if (selectedStudent?.identidadesId) {
			// actions.getAssistanceByIdentidadIdsAndLectionId([selectedStudent?.identidadesId], currentSubject?.leccionAsignaturaGrupoId)
			actions.getAssistanceByIdentidadId([selectedStudent?.identidadesId])
		}
	}, [selectedStudent])

	useEffect(() => {
		if (lections.length > 0) {
			const aux = []
			lections.forEach((lection, index) => {
				lectionsSubjectGroup[lection.id] &&
					lectionsSubjectGroup[lection.id].forEach((item) => {
						if (!aux.includes(item.diaSemana)) {
							aux.push(item.diaSemana)
						}
					})
			})
			setDaysFilter(aux.map((item) => calculateCurrentDay(item - 1)))
		}
	}, [lectionsSubjectGroup])

	useEffect(() => {
		if (
			currentSubject?.diaSemana !== selectedDayFilter + 1 ||
			currentSubject?.leccion_id !== lections[selectedLection]?.id
		) {
			if (lectionsSubjectGroup[lections[selectedLection]?.id]) {
				const item = lectionsSubjectGroup[
					lections[selectedLection]?.id
				].find(
					(el) =>
						el.diaSemana === selectedDayFilter + 1 &&
						el.leccion_id === lections[selectedLection]?.id
				)
				setCurrentSubject(item)
			} else {
				setCurrentSubject(null)
			}
			// lections.forEach((lection) => {

			// })
		}
	}, [selectedLection, selectedDayFilter])

	const onSelected = (student) => {
		setSelectedStudent(student)
	}

	const massiveActions = (typeId) => {
		const assis = membersBySubjectGroup.map((student) => {
			if (assistances && assistances[student.identidadesId]) {
				return {
					id: assistances[student.identidadesId]?.id,
					observacion:
						assistances[student.identidadesId]?.observacion,
					tipoRegistroAsistencia_id: typeId,
					fechaPeriodoCalendario_id:
						selectedPeriod.fechaPeriodoCalendarioId,
					estadoasistencia_id: getEstadoAsignatura(typeId),
					leccionAsignaturaGrupo_id:
						assistances[student.identidadesId]
							?.leccionAsignaturaGrupo_id,
					asignaturaGrupoEstudianteMatriculado_id:
						assistances[student.identidadesId]
							.asignaturaGrupoEstudianteMatriculado_id,
					notificarEncargados:
						assistances[student.identidadesId].notificarEncargados,
					fechaAsistencia: new Date(
						date.setDate(
							Number(
								days[selectedDayFilter].split(' ')[2] ||
									date.getDate()
							)
						)
					).toISOString(),
					estado: true
				}
			}

			return {
				observacion: '',
				tipoRegistroAsistencia_id: typeId,
				fechaPeriodoCalendario_id:
					selectedPeriod.fechaPeriodoCalendarioId,
				estadoasistencia_id: getEstadoAsignatura(typeId),
				leccionAsignaturaGrupo_id:
					currentSubject?.leccionAsignaturaGrupoId,
				asignaturaGrupoEstudianteMatriculado_id: student?.Id,
				notificarEncargados: true,
				fechaAsistencia: new Date(
					date.setDate(
						Number(
							days[selectedDayFilter].split(' ')[2] ||
								date.getDate()
						)
					)
				).toISOString()
			}
		})
		actions.createMultipleAssistance(assis)
	}

	return (
		<>
			<Grid container spacing={1} className="mb-5">
				<Grid
					item
					xs
					component={Card}
					style={{
						margin: 16
					}}
				>
					<CardContent>
						<CardHeader>
							<CardHeaderLabel>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column'
									}}
								>
									<div
										style={{ marginBottom: '15px' }}
										className="div-buttons-date2"
									>
										<button
											onClick={onLastWeek}
											className="btn-date"
										>
											{selectedDayFilter > 0 && (
												<FaArrowAltCircleLeft
													style={{
														color: `${colors.primary}`,
														fontSize: '0.8rem',
														marginBottom: '4px',
														cursor: 'pointer'
													}}
													onClick={() => {
														setSelectedDayFilter(
															(prevState) =>
																prevState - 1
														)
													}}
												/>
											)}
										</button>
										<h5
											style={{
												fontWeight: 'bolder',
												textAlign: 'center',
												fontSize: 'small'
											}}
										>
											{moment(
												daysFilter[selectedDayFilter]
											).format('D')}{' '}
											de{' '}
											{moment(date)
												.lang('es')
												.format('MMMM YYYY')}{' '}
										</h5>
										<button
											onClick={onNextWeek}
											className="btn-date"
										>
											{selectedDayFilter <
												daysFilter.length - 1 && (
												<FaArrowAltCircleRight
													style={{
														color: `${colors.primary}`,
														fontSize: '0.8rem',
														marginBottom: '4px',
														cursor: 'pointer'
													}}
													onClick={() => {
														setSelectedDayFilter(
															(prevState) =>
																prevState + 1
														)
													}}
												/>
											)}
										</button>
									</div>
									<div className="div-buttons-date2">
										<button
											onClick={() => {}}
											className="btn-date"
										>
											{selectedLection > 0 && (
												<FaArrowAltCircleLeft
													style={{
														color: `${colors.primary}`,
														fontSize: '0.8rem',
														marginBottom: '4px',
														cursor: 'pointer'
													}}
													onClick={() => {
														setSelectedLection(
															(prevState) =>
																prevState - 1
														)
													}}
												/>
											)}
										</button>
										<h5
											style={{
												fontWeight: 'bolder',
												textAlign: 'center',
												fontSize: 'small',
												cursor: 'pointer'
											}}
										>
											{lections[selectedLection]?.nombre}
										</h5>
										<button
											onClick={() => {}}
											className="btn-date"
										>
											{selectedLection <
												lections.length - 1 && (
												<FaArrowAltCircleRight
													style={{
														color: `${colors.primary}`,
														fontSize: '0.8rem',
														marginBottom: '4px'
													}}
													onClick={() => {
														setSelectedLection(
															(prevState) =>
																prevState + 1
														)
													}}
												/>
											)}
										</button>
									</div>
								</div>
							</CardHeaderLabel>
							<Dropdown
								isOpen={openModal === 'dropdown-masiva'}
								toggle={() =>
									setOpenModal((prevState) =>
										prevState === 'dropdown-masiva'
											? ''
											: 'dropdown-masiva'
									)
								}
							>
								<DropdownToggle
									style={{
										height: '25px',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										alignContent: 'center'
									}}
									caret
									color="primary"
									outline
								>
									{t(
										'gestion_grupo>asistencia>accion_masiva',
										'Acción masiva'
									)}
								</DropdownToggle>
								<DropdownMenu>
									{types
										.filter((type) => {
											if (
												type?.nombre?.toLowerCase() ===
													'presente' ||
												type?.nombre?.toLowerCase() ===
													'no impartida'
											) {
												return type
											}
										})
										.map((type) => (
											<DropdownItem
												onClick={() =>
													massiveActions(type?.id)
												}
												key={type?.id}
											>
												{type?.nombre}
											</DropdownItem>
										))}
								</DropdownMenu>
							</Dropdown>
						</CardHeader>
						<Table
							subject={currentSubject}
							toggle={toggle}
							modalOpen={modalOpen}
							openModal={openModal}
							period={selectedPeriod}
							onSelected={onSelected}
							date={date.setDate(
								Number(
									days[selectedDayFilter].split(' ')[2] ||
										date.getDate()
								)
							)}
							days={days}
							students={membersBySubjectGroup}
						/>
					</CardContent>
				</Grid>
				<Grid
					item
					xs
					component={Card}
					style={{
						margin: 16
					}}
				>
					<CardContent>
						<CardHeader>
							<CardHeaderLabel className="igualar2">
								{t(
									'gestion_grupos>asistencia>historial_asistencia',
									'Historial de asistencia del estudiante'
								)}
								<ModalHistorial subject={currentSubject} />
							</CardHeaderLabel>
						</CardHeader>
						{selectedStudent ? (
							<DetailTable
								data={currentAssistances}
								selectedStudent={selectedStudent}
								selectedPeriod={selectedPeriod}
								toggle={toggle}
								subject={currentSubject}
							/>
						) : (
							<AsistenciasLanding
								txt={t(
									'gestion_grupos>asistencia>msg_estudiante',
									'Selecciona un estudiante para ver sus incidencias'
								)}
							/>
						)}
					</CardContent>
				</Grid>
			</Grid>
		</>
	)
}

export default TableAsistencia

const CardHeader = styled.div`
	padding: 10px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
`
const CardHeaderLabel = styled.h4`
	margin: 0;
	span {
		width: 100%;
		position: relative;
		float: left;
		font-size: 12px;
		color: #908a8a;
		font-weight: 600;
	}
`

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
