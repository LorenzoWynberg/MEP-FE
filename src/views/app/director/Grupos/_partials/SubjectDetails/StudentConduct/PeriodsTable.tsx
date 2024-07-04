import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const PeriodsTable = ({ periods, students, onClick }) => {
	const { t } = useTranslation()
	return (
		<div
			className="d-flex justify-content-center"
			style={{ width: '100%' }}
		>
			<Table>
				<tr>
					<th
						colSpan={periods.length - 1}
						style={{
							borderBottom: '1px solid #8f8f8f',
							textAlign: 'center'
						}}
					>
						{t(
							'gestion_grupo>conducta>promedio_conducta',
							'Promedio de conducta'
						)}
					</th>
				</tr>
				<Table>
					<thead>
						<tr>
							<th
								colSpan={periods.length - 1}
								style={{
									borderBottom: '1px solid #8f8f8f',
									textAlign: 'center'
								}}
							>
								{t(
									'gestion_grupo>asistencia>estudiante',
									'Estudiante'
								)}
							</th>
							{periods
								.filter(
									(period) => period.name !== 'Consolidado'
								)
								.map((period, i) => (
									<th
										key={`period-${i}`}
										style={{ minWidth: '6rem' }}
									>
										{period.nombre}
									</th>
								))}
						</tr>
					</thead>
					<tbody>
						{students.map((student, i) => {
							return (
								<tr
									key={student.id}
									className={`${
										i % 2 !== 0 ? 'row-odd' : ''
									}`}
								>
									<td>{student.nombreCompleto}</td>
									{periods.map((period, i) => (
										<td
											key={i}
											style={{ textAlign: 'center' }}
										>
											<div
												style={{
													textDecoration: 'underline',
													cursor: 'pointer',
													color: ' #145388',
													margin: 0
												}}
												onClick={() =>
													onClick(
														student?.ratings[
															period.id
														] || []
													)
												}
											>
												{student?.ratings[
													period
														.fechaPeriodoCalendarioId
												]
													? `${
															100 -
															student?.ratings[
																period
																	.fechaPeriodoCalendarioId
															].reduce(
																(acc, curr) =>
																	acc +
																	curr?.puntajeRatificado,
																0
															)
													  }%`
													: '100%'}
											</div>
										</td>
									))}
								</tr>
							)
						})}
					</tbody>
				</Table>
			</Table>
		</div>
	)
}

const Table = styled.table`
  width: 100%;

  th {
    padding: .5rem;
    background-color #145388;
    border-right: 1px solid #8f8f8f;
    border-left: 1px solid #8f8f8f;
    color: #fff;
  }

  tbody tr {
    &.row-odd {
      background-color: #eaeaea;
    }

    &:last-child {
      border-bottom: 1px solid #8f8f8f;
    }

    td {
      padding: 1rem .5rem;
      border-right: 1px solid #8f8f8f;
      border-left: 1px solid #8f8f8f;
    }
  }
`

export default PeriodsTable
