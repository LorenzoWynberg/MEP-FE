import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ innerRef, reportData, reportParameters }) => {
	const tableMetadata = React.useMemo(() => {
		const columns = [
			{
				Header: 'Nombre Oferta',
				accessor: 'nombreOferta',
				label: '',
				column: ''
			},
			{
				Header: 'Área del proyecto',
				accessor: 'nombreAreaProyecto',
				label: '',
				column: ''
			},
			{
				Header: 'Descripción',
				accessor: 'descripcion',
				label: '',
				column: ''
			},
			{
				Header: 'Nombre del proyecto',
				accessor: 'nombreProyecto',
				label: '',
				column: ''
			},
			{
				Header: 'Tipo de proyecto',
				accessor: 'nombreModalidad',
				label: '',
				column: ''
			},
			{
				Header: 'Organización contraparte',
				accessor: 'nombreOrgContraparte',
				label: '',
				column: ''
			},
			{
				Header: 'Cantidad de cédulas',
				accessor: 'cedulaCount',
				label: '',
				column: ''
			},
			{
				Header: 'Cantidad de DIMEX',
				accessor: 'dimexCount',
				label: '',
				column: ''
			},
			{
				Header: 'Cantidad de YISRO',
				accessor: 'yisRoCount',
				label: '',
				column: ''
			},
			{
				Header: 'Personas con discapacidad',
				accessor: 'discapacidadCount',
				label: '',
				column: ''
			},
			{
				Header: 'Hombres',
				accessor: 'hombreCount',
				label: '',
				column: ''
			},
			{
				Header: 'Mujeres',
				accessor: 'mujerCount',
				label: '',
				column: ''
			},
			{
				Header: 'Indígenas',
				accessor: 'indigenaCount',
				label: '',
				column: ''
			},
			{
				Header: 'Refugiados',
				accessor: 'refugiadoCount',
				label: '',
				column: ''
			},
			{
				Header: 'Total de estudiantes',
				accessor: 'totalEstudiantes',
				label: '',
				column: ''
			}
		]
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
				<h3>Reporte de SCE Historico por Division Geografica</h3>
				<p>AÑO EDUCATIVO: {new Date().getFullYear()}</p>
				<TableReactImplementation avoidSearch columns={tableMetadata.columns} data={reportData} />
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
