import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ reportData, innerRef, loader = false }) => {
	const tableMetadata = React.useMemo(() => {
		const columns = [
			{
				Header: 'ID',
				accessor: 'identificacion',
				label: '',
				column: ''
			},
			{
				Header: 'Nombre',
				accessor: 'nombreEstudiante',
				label: '',
				column: ''
			},
			{
				Header: 'Nivel',
				accessor: 'nombreNivel',
				label: '',
				column: ''
			}
		]
		const mapeador = item => {
			return {
				nivel: item?.nombreNivel,
				grupo: item?.nombreGrupo,
				persona: item?.nombreEstudiante,
				tipoId: item?.tipoIdentificacion,
				numeroId: item?.identificacion
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
				<h3>
					Resumen de cantidad de estudiantes de último nivel que no han concluido el Servicio
					Comunal Estudiantil
				</h3>
				{!loader && (
					<TableReactImplementation avoidSearch columns={tableMetadata.columns} data={tableMetadata.data} />
				)}
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
