import React, { useState } from 'react'
import styled from 'styled-components'
import { CgSandClock } from 'react-icons/cg'
import DetailAssistence from './DetailAsis'
import { useSelector } from 'react-redux'
import { t } from 'i18next'

const Table = ({
	days,
	toggle,
	modalOpen,
	openModal,
	onSelected,
	subject,
	students,
	period,
	date
}) => {
	const { assistancesByIdentidadId: assistances } = useSelector(
		(state: any) => state.asistencias
	)
	const [selectedAssis, setSelectedAssis] = useState(null)
	const [selectedStudent, setSelectedStudent] = useState(null)
	return (
		<>
			<DetailAssistence
				toggle={toggle}
				modalOpen={modalOpen}
				openModal={openModal}
				subject={subject}
				selectedStudent={selectedStudent}
				selectedAssis={selectedAssis}
				period={period}
				date={date}
				days={days}
			/>
			<table>
				<thead>
					<Th style={{ borderRight: '1px solid #fff' }}>
						{' '}
						{t(
							'gestion_grupo>asistencia>estudiante',
							'Estudiante'
						)}{' '}
					</Th>
					<Th style={{ width: '200px', textAlign: 'center' }}>
						{' '}
						{t('gestion_grupos>tab>asistencia', 'Asistencia')}{' '}
					</Th>
				</thead>
				<tbody>
					{students.map((student, i) => (
						<tr
							className={`${i % 2 !== 0 ? 'row-odd' : ''}`}
							key={i}
						>
							<Td>
								<button
									onClick={() => onSelected(student)}
									style={{
										border: 'none',
										background: 'none',
										color: '#145388',
										textDecoration: 'underline',
										cursor: 'pointer'
									}}
								>
									{student.nombreCompleto}
								</button>
							</Td>
							<Td>
								<Td1>
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignContent: 'center',
											alignItems: 'center'
										}}
									>
										{assistances &&
										assistances[student.identidadesId] ? (
											<button
												onClick={() => {
													setSelectedAssis(
														assistances[
															student
																.identidadesId
														]
													)
													setSelectedStudent(student)
													toggle(student)
												}}
												className={
													assistances[
														student.identidadesId
													]
														?.datosTipoRegistroAsistencia
														?.nombre === 'Presente'
														? 'btn-present'
														: null ||
														  assistances[
																student
																	.identidadesId
														  ]
																?.datosTipoRegistroAsistencia
																?.nombre ===
																'Tardía Justificada'
														? 'btn-tard'
														: null ||
														  assistances[
																student
																	.identidadesId
														  ]
																?.datosTipoRegistroAsistencia
																?.nombre ===
																'No Impartida'
														? 'btn-noimpartida'
														: 'btn-aus'
												}
											>
												{
													assistances[
														student.identidadesId
													]
														?.datosTipoRegistroAsistencia
														?.nombre
												}
											</button>
										) : (
											<button
												onClick={() => {
													toggle(student)
													setSelectedStudent(student)
												}}
												style={{
													border: 'none',
													background: 'none',
													cursor: 'pointer'
												}}
											>
												<CgSandClock
													style={{
														fontSize: '23px'
													}}
												/>
											</button>
										)}
									</div>
								</Td1>
							</Td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}

export default Table

const Th = styled.th`
	background: #145388;
	color: #fff;
	min-height: 30px;
	width: 300px;
	text-align: start;
	padding: 2.5%;
	font-size: 14px;
`

const Td = styled.td`
	padding: 2%;
	border-left: 1px solid black;
	border-right: 1px solid black;
`

const Td1 = styled.td`
	width: 200px;
`
