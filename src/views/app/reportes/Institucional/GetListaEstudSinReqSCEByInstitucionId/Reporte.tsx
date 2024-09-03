import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ innerRef, reportData, reportParameters }) => {
	const tableMetadata = React.useMemo(() => {
		const mapeador = item => {
			return {
				cantidad: item.cantidad,
				componente: item.aula ? item.aula : '-',
				descripcion: item.descripcion
			}
		}
		const data = reportData ? reportData.map(mapeador) : []
		return {
			columns,
			data
		}
	}, [])
	return (
		<div ref={innerRef}>
			<Card>
				<h3>Reporte Historico Servicio Comunal Estudiantil</h3>
				<p>AÑO EDUCATIVO: {new Date().getFullYear()}</p>
				<TableReactImplementation columns={tableMetadata.columns} data={reportData} />
			</Card>
		</div>
	)
}

const Card = styled.div`
	border-radius: 15px;
	min-width: 100%;
	min-height: 100%;
	border-color: gray;
	background: white;
	padding: 15px;
`

export default Reporte
