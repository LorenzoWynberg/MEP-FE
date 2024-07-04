import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const PeriodTable = ({ students, setSelectedStudent, onClick }) => {
	const { t } = useTranslation()
	return (
		<div>
			<Table>
				<thead>
					<tr>
						<th style={{ width: '60%' }}>
							{t(
								'gestion_grupo>asistencia>estudiante',
								'Estudiante'
							)}
						</th>
						<th style={{ textAlign: 'center' }}>
							{t(
								'gestion_grupo>asistencia>calificacion',
								'Calificación'
							)}
						</th>
						<th style={{ width: '20%', textAlign: 'center' }}>
							{t(
								'gestion_grupo>conducta>agregar_incidencia',
								'Agregar incidencia'
							)}
						</th>
					</tr>
				</thead>
				<tbody>
					{students.map((item, i) => {
						return (
							<tr
								className={`${i % 2 === 0 ? 'row-odd' : ''}`}
								key={i}
							>
								<td style={{ width: '60%' }}>
									<div
										style={{
											textDecoration: 'underline',
											color: '#145388',
											cursor: 'pointer'
										}}
										onClick={() => {
											setSelectedStudent(item)
										}}
									>
										{item?.nombreCompleto}
									</div>
								</td>
								<td style={{ textAlign: 'center' }}>
									{`${
										100 -
										item?.rating?.reduce(
											(acc, curr) =>
												acc + curr.puntajeRatificado,
											0
										)
									}%`}
								</td>
								<td
									style={{
										width: '20%',
										textAlign: 'center'
									}}
								>
									<img
										src="/assets/img/agregar_incidencia_saber.svg"
										alt="Agregar Incidencia"
										style={{ cursor: 'pointer' }}
										onClick={() => onClick(item)}
									/>
								</td>
							</tr>
						)
					})}
				</tbody>
			</Table>
		</div>
	)
}

const Table = styled.table`
  width: 100%;

  thead th {
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

export default PeriodTable
