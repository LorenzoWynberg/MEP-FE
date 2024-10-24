import React from 'react'
import styled from 'styled-components'
import ReportHeader from '../_partials/ReportHeader'
import { useSelector } from 'react-redux'
import { uniqBy } from 'lodash'

const formatter = Intl.DateTimeFormat('es-ES', {
	dateStyle: 'full',
	timeStyle: 'short',
	hour12: true
})

const ReporteRegistroEstudiantes = ({ reportData, innerRef }) => {
	const state = useSelector<any, any>((store) => {
		return {
			user: store.authUser.authObject.user
		}
	})
	const tableData = React.useMemo(() => {
		const data = reportData || []
		return {
			data
		}
	}, [])

	const Row = (key, item) => {
		return (
			<tr key={key}>
				<td>{key + 1}</td>
				<td>{item.identificacion}</td>
				<td>{item.nombre}</td>
				<td>{item.roles}</td>
				<td>{item.estado}</td>
			</tr>
		)
	}

	return (
		<div ref={innerRef}>
			<Card>
				<ReportHeader mostrarContactoInstitucion />

				<SeccionCentrada>
					<p>
						<b>Reporte de usuarios </b>
					</p>
				</SeccionCentrada>

				<p>
					<Table>
						<thead>
							<th className="py-1">N°</th>
							<th>Número de identificación</th>
							<th>Nombre completo</th>
							<th>Roles</th>
							<th>Estado</th>
						</thead>
						<tbody>
							{tableData.data.map((item, index) =>
								Row(index, item)
							)}
						</tbody>
					</Table>
				</p>
				<p>
					<Linea />
				</p>
				<Seccion>
					<p>
						Reporte emitido por el usuario: {state.user.userName},
						el {formatter.format(new Date(Date.now()))}
					</p>
				</Seccion>
			</Card>
		</div>
	)
}

const Table = styled.div`
	border-collapse: collapse;
	thead {
		font-width: bold;
		text-align: center;
	}
	th {
		border: solid 1px;
		padding: 2px;
	}
	td {
		text-align: center;
		border: solid 1px;
		padding: 2px;
	}
`

const Card = styled.div`
	border-radius: 15px;
	min-width: 100%;
	min-height: 100%;
	border-color: gray;
	background: white;
	padding: 15px;
`
const Linea = styled.hr`
	width: 100%;
	background-color: black;
	height: 1px;
	border: none;
	margin: 0;
`
const Seccion = styled.section`
	text-align: center;
`
const SeccionCentrada = styled.section`
	font-weight: bold;
	text-align: center;
	margin-top: 1rem;
`
export default ReporteRegistroEstudiantes
