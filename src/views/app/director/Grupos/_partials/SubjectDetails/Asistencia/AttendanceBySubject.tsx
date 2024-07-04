import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
	Button,
	InputGroupAddon,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap'
import search from 'Utils/search'
import {
	getAllAsignaturas,
	getAllAsignaturasByGroup
} from 'Redux/asignaturas/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import AttendanceDetailsBySubject from './AttendanceDetailsBySubject'
import Consolidado from './Consolidado/Consolidado'
import { getBloquesByOffer } from 'Redux/grupos/actions'
import { getAllAssistanceByIdentidadIds } from 'Redux/Asistencias/actions'
import { getAcumuladosByMatricula } from '../../../../../../../redux/Asistencias/actions'
import { useTranslation } from 'react-i18next'

const AttendanceBySubject = ({ students, grupoId, currentOffer }) => {
	const { t } = useTranslation()
	const [items, setItems] = useState<Array<any>>(students || [])
	const [searchValue, setSearchValue] = useState('')
	const [openModal, setOpenModal] = useState<'' | 'dropdown-period'>('')
	const { asignaturas } = useSelector((state) => state.asignaturas)
	const { bloques } = useSelector((state) => state.grupos)
	const { currentInstitution } = useSelector((state) => state.authUser)
	const { assistancesByIdentidadId, acumuladosMatricula } = useSelector(
		(state) => state.asistencias
	)
	const [tableRef, setTableRef] = useState(null)
	const [attendanceTable, setAttendanceTable] = useState<Array<Array<any>>>(
		[]
	)
	const [currentStudent, setCurrentStudent] = useState(null)
	const [currentSubject, setCurrentSubject] = useState(0)

	const [selectedPeriod, setSelectedPeriod] = useState(bloques[0])

	const actions = useActions({
		getAllAsignaturas,
		getAcumuladosByMatricula,
		getBloquesByOffer,
		getAllAssistanceByIdentidadIds,
		getAllAsignaturasByGroup
	})

	const onSearchKey = async (e) => {
		const { value } = e.target
		setSearchValue(value)

		if (
			((e.charCode === 13 || e.keyCode === 13 || e.key === 'Enter') &&
				value.length >= 3) ||
			value.length === 0
		) {
			setItems(search(searchValue).in(students, ['nombreCompleto']))
		}
	}

	useEffect(() => {
		const fetch = async () => {
			await actions.getAllAsignaturasByGroup(grupoId)
			await actions.getAllAssistanceByIdentidadIds(
				students.map((el) => el.identidadId)
			)
		}
		fetch()
	}, [])

	useEffect(() => {
		if (bloques.length > 0) {
			setSelectedPeriod(bloques[0])
		}
	}, [bloques])

	useEffect(() => {
		if (students.length > 0) {
			const newAssistances = []
			students.forEach((student) => {
				if (
					assistancesByIdentidadId[student?.identidadId]?.datosPeriodo
						?.id === selectedPeriod?.id
				) {
					newAssistances.push(
						assistancesByIdentidadId[student?.identidadId]
					)
				}
			})
		}
	}, [assistancesByIdentidadId, students])

	useEffect(() => {
		if (students.length > 0 && asignaturas.length > 0) {
			const newAttendanceTable = new Array(items.length).fill(
				new Array(asignaturas.length).fill(0)
			)
			actions.getAcumuladosByMatricula(
				items.map((el) => el?.matriculaId),
				grupoId
			)
			setAttendanceTable(newAttendanceTable)
		}
	}, [students, asignaturas, items])

	return (
		<>
			{currentStudent === null && (
				<div className="my-3">
					<h4>
						{t(
							'gestion_grupos>registro_asistencia',
							'Registro de asistencia'
						)}
					</h4>
					<div className="d-flex justify-content-between align-items-center my-3">
						<SearchContainer>
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
													students,
													['nombreCompleto']
												)
											)
										}}
									>
										{t('general>buscar', 'Buscar')}
									</Button>
								</StyledInputGroupAddon>
							</div>
						</SearchContainer>
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
									{bloques.map((period) => (
										<DropdownItem
											onClick={() =>
												setSelectedPeriod(period)
											}
											key={period.id}
										>
											{period?.nombre}
										</DropdownItem>
									))}
									<DropdownItem
										onClick={() =>
											setSelectedPeriod({
												nombre: 'Consolidado'
											})
										}
									>
										{t(
											'gestion_grupos>consolidado',
											'Consolidado'
										)}
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</div>
					</div>
				</div>
			)}
			{selectedPeriod?.nombre === 'Consolidado' && (
				<Consolidado groupId={grupoId} students={items} type="group" />
			)}
			{(currentStudent === 0 || currentStudent > 0) &&
				selectedPeriod?.nombre !== 'Consolidado' && (
					<AttendanceDetailsBySubject
						student={students[currentStudent]}
						subject={asignaturas[currentSubject]}
						period={selectedPeriod}
						setCurrentStudent={setCurrentStudent}
						setCurrentSubject={setCurrentSubject}
						currentStudent={currentStudent}
						currentSubject={currentSubject}
						subjects={asignaturas}
						students={students}
					/>
				)}
			{selectedPeriod?.id !== 2 &&
				selectedPeriod?.nombre !== 'Consolidado' &&
				currentStudent === null && (
					<div>
						<Container>
							{selectedPeriod?.nombre || 'Seleccione un periodo'}
							<div className="d-flex justify-content-start">
								<div className="">
									<div
										className="generic-schedule__column-header"
										style={{
											width: '20rem',
											padding: '1.75rem 0',
											border: '1px solid #8f8f8f'
										}}
									/>
									<div
										className="generic-schedule__row-content"
										style={{
											width: '20rem',
											backgroundColor: '#eaeaea',
											borderTop: '1px solid #8f8f8f',
											borderLeft: '1px solid #8f8f8f',
											padding: '0 2rem'
											// height: '4.9rem'
										}}
									>
										<div className="">
											{t(
												'gestion_grupo>asistencia>estudiante',
												'Estudiante'
											)}
											s
										</div>
									</div>
									{items.map((student, index) => (
										<div
											className="generic-schedule__row-content"
											key={student.id}
											style={{
												width: '20rem',
												color: '#145388',
												cursor: 'pointer',
												textDecoration: 'underline',
												borderTop: '1px solid #8f8f8f',
												borderLeft: '1px solid #8f8f8f',
												borderBottom:
													index ===
													students.length - 1
														? '1px solid #8f8f8f'
														: '',
												backgroundColor:
													index % 2 !== 0
														? '#eaeaea'
														: ''
											}}
											onClick={() => {
												setCurrentStudent(index)
											}}
										>
											{student?.nombreCompleto}
										</div>
									))}
								</div>

								<div
									className="w-100"
									style={{ overflowX: 'scroll' }}
								>
									<div
										className="generic-schedule__column-header"
										style={{
											width: tableRef?.clientWidth
												? `${tableRef?.clientWidth}px`
												: `${
														asignaturas.length * 10
												  }rem`,
											fontSize: '1rem',
											border: '1px solid #8f8f8f'
										}}
									>
										{t(
											'configuracion>mallas_curriculares>asignatura/figura_afin>asignatura/figura_afin',
											'Asignatura/figura afín'
										)}
									</div>
									<div>
										<table
											ref={(ref) => setTableRef(ref)}
											id="table-attendance"
										>
											<thead>
												<tr>
													{asignaturas &&
														asignaturas.map(
															(subject) => (
																<th
																	className="generic-schedule__row-content"
																	key={
																		subject
																			?.datosMallaCurricularAsignaturaInstitucion
																			?.id
																	}
																	style={{
																		display:
																			'table-cell',
																		padding:
																			'0 2rem',
																		backgroundColor:
																			'#eaeaea',
																		border: '1px solid #8f8f8f'
																		// height: '4.9rem'
																	}}
																>
																	<div
																		style={{
																			textOverflow:
																				'ellipsis',
																			width: '10rem'
																		}}
																	>
																		{subject
																			?.datosMallaCurricularAsignaturaInstitucion
																			?.nombreAsignatura ||
																			''}
																	</div>
																</th>
															)
														)}
												</tr>
											</thead>
											<tbody>
												{attendanceTable.map(
													(row, index) => {
														return (
															<tr key={index}>
																{row.map(
																	(
																		item,
																		i
																	) => {
																		const acumulado =
																			acumuladosMatricula.find(
																				(
																					el
																				) =>
																					el?.matriculaId ===
																						items[
																							index
																						]
																							?.matriculaId &&
																					asignaturas[
																						i
																					]
																						.sb_mallaCurricularasignaturaInstitucionId ===
																						el.mallacurricularAsignaturaId
																			)
																		// console.log("********")
																		// console.log(acumulado)
																		// console.log(items[index])
																		// console.log(asignaturas[i])
																		// console.log("********")
																		return (
																			<td
																				key={`${index}-${i}`}
																				className="generic-schedule__row-content"
																				style={{
																					display:
																						'table-cell',
																					padding:
																						'0 2rem',
																					backgroundColor:
																						index %
																							2 !==
																						0
																							? '#eaeaea'
																							: '',
																					border: '1px solid #8f8f8f'
																				}}
																			>
																				<div
																					style={{
																						textOverflow:
																							'ellipsis',
																						width: '10rem',
																						color: acumulado?.asistenciaTotal
																							? acumulado.asistenciaTotal
																							: item <
																							  70
																							? 'red'
																							: 'unset'
																					}}
																				>
																					{`${
																						acumulado?.asistenciaTotal
																							? acumulado.asistenciaTotal
																							: item
																					}%` ||
																						''}
																				</div>
																			</td>
																		)
																	}
																)}
															</tr>
														)
													}
												)}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</Container>
					</div>
				)}
		</>
	)
}

const Container = styled.div`
	width: 100%;
	margin: 0 auto;
	height: auto;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	border-radius: 10px;
	padding: 1rem;
	overflow: hidden;
`

const SearchContainer = styled.div`
	width: 32vw;
`

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

export default AttendanceBySubject
