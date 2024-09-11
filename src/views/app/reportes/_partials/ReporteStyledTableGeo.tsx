import React from 'react'
import styled from 'styled-components'
import ReportHeader from './ReportHeader'
import { getYearsOld } from '../../../../../utils/years'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { GenerateExcelObject, SendWorkbookToDownload } from 'utils/excel'

const formatter = Intl.DateTimeFormat('es-ES', {
	dateStyle: 'full',
	timeStyle: 'short',
	hour12: true
})
const ReporteStyledTableGeo = ({
	innerRef,
	data,
	columns,
	title,
	headerValues
}) => {
	const state = useSelector<any, any>(store => {
		return {
			user: store.authUser.authObject.user,
			anioSelected: store.authUser.selectedActiveYear
		}
	})

	const Row = (item, index) => {
		return (
			<tr key={index}>
				{Object.keys(item).map((key, index) => (
					<td>{item[key]}</td>
				))}
			</tr>
		)
	}

	return (
		<div ref={innerRef}>
			<Card style={{ overflow: 'auto' }}>
				<ReportHeader geoValues={headerValues} />
				<Seccion style={{ marginTop: '1rem' }}>
					<p>
						<b>{title}</b>
					</p>
				</Seccion>
				<p>
					<Table>
						<thead>
							{columns && columns.map((item, index) => <th>{item.Header}</th>)}
						</thead>
						<tbody>{data && data.map((item, index) => Row(item, index))}</tbody>
					</Table>
				</p>
				<p>
					<Linea />
				</p>
				<Seccion>
					<p>
						Reporte emitido por el usuario: {state.user.userName}, el{' '}
						{formatter.format(new Date(Date.now()))}
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

export default ReporteStyledTableGeo
