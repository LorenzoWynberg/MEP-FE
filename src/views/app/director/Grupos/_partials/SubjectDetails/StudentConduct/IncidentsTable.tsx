import React from 'react'
import moment from 'moment'
import { Edit } from '@material-ui/icons'
import styled from 'styled-components'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import WarningIcon from '@material-ui/icons/Warning'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'

const IncidentsTable = ({
	data,
	fouls,
	onClickEdit,
	onClickSeeIncident,
	director,
	onClickDesestimar
}) => {
	const { t } = useTranslation()
	return (
		<div>
			<Table>
				<thead>
					<tr>
						<th>
							{t(
								'expediente_ce>recurso_humano>fun_ce>cuenta_correo>fecha',
								'Fecha'
							)}
						</th>
						<th>
							{t(
								'expediente_ce>normativa_interna>agregar_falta>tipo_falta',
								'Tipo de falta'
							)}
						</th>
						<th>
							{t('gestion_grupo>conducta>docente', 'Docente')}
						</th>
						<th>
							{t(
								'gestion_grupo>conducta>puntaje_ratificado',
								'Puntaje ratificado'
							)}
						</th>
						<th style={{ textAlign: 'center' }}>
							{t(
								'buscador_ce>buscador>columna_acciones',
								'Acciones'
							)}
						</th>
					</tr>
				</thead>
				<tbody>
					{data.map((item, i) => (
						<tr
							className={`${i % 2 !== 0 ? 'row-odd' : ''}`}
							key={i}
						>
							<td>
								{item.fechaIncidencia
									? moment(item.fechaIncidencia).format(
											'DD/MM/yyyy'
									  )
									: t(
											'gestion_grupo>conducta>fecha_incorrecta',
											'Fecha incorrecta'
									  )}
							</td>
							<td style={{ textAlign: 'center' }}>
								{item.nivel}
							</td>
							<td>{item.docente}</td>
							<td style={{ textAlign: 'center', width: '10%' }}>
								{item.ratificadoPor ? (
									item.puntajeRatificado
								) : (
									<Tooltip
										title={t(
											'gestion_grupo>conducta>espera_ratificacion',
											'En espera de ratificación'
										)}
									>
										<IconButton>
											<HourglassEmptyIcon />
										</IconButton>
									</Tooltip>
								)}
							</td>
							<td style={{ textAlign: 'center' }}>
								{!director ? (
									<div
										style={{
											display: 'flex',
											cursor: 'pointer'
										}}
									>
										<CheckCircleIcon
											onClick={() => onClickEdit(item)}
										/>
										<WarningIcon
											onClick={() =>
												onClickDesestimar(item)
											}
										/>
									</div>
								) : item.edit ? (
									<Edit
										style={{
											cursor: 'pointer',
											padding: 0
										}}
										onClick={() => onClickEdit(item)}
									/>
								) : (
									<Tooltip
										title={t(
											'configuracion>anio_educativo>columna_acciones>hover>ver',
											'Ver'
										)}
									>
										<IconButton>
											<img
												src="/assets/img/ver_saber.svg"
												alt="Ver Incidencia"
												style={{
													cursor: 'pointer'
												}}
												onClick={() => {
													onClickSeeIncident(item)
												}}
											/>
										</IconButton>
									</Tooltip>
								)}
							</td>
						</tr>
					))}
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

export default IncidentsTable
