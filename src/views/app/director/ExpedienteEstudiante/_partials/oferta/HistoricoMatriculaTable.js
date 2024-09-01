import { TableReactImplementation } from 'Components/TableReactImplementation'
import React, { useState, useEffect, useMemo } from 'react'
import BarLoader from 'Components/barLoader/barLoader'
import { envVariables } from 'Constants/enviroment'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'reactstrap'
import axios from 'axios'

const HistoricoMatriculaTable = props => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])
	const idEstudiante = JSON.parse(localStorage.getItem('currentStudent')).idEstudiante
	const { t } = useTranslation()

	const fetch = async () => {
		try {
			setLoading(true)
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Traslado/GetHistorialMatriculaByIdEstudiante/${idEstudiante}`
			)
			setData(response.data)
			setLoading(false)
		} catch (e) {
			return { error: e.message, options: [] }
		}
	}

	useEffect(() => {
		fetch()
	}, [])

	const columns = useMemo(() => {
		// TODO: Translate the headers
		return [
			{
				// Header: t('expediente_estudiantil>area_proyecto', 'Año lectivo'),
				Header: 'Año lectivo',
				column: 'annoEducativo',
				accessor: 'annoEducativo',
				label: 'Año lectivo'
			},
			{
				// Header: t('expediente_estudiantil>nombre', 'Nivel'),
				Header: 'Nivel',
				column: 'nivel',
				accessor: 'nivel',
				label: 'Nivel'
			},
			{
				// Header: t('expediente_estudiantil>modalidad', 'Fecha de cambio'),
				Header: 'Fecha de cambio',
				column: 'fechaCambio',
				accessor: 'fechaCambio',
				label: 'Fecha de cambio'
			},
			{
				// Header: t('expediente_estudiantil>area_proyecto', 'Nombre de institución'),
				Header: 'Nombre de institución',
				column: 'institucion',
				accessor: 'institucion',
				label: 'Nombre de institución'
			},
			{
				// Header: t('expediente_estudiantil>modalidad', 'Condición de matrícula'),
				Header: 'Condición de matrícula',
				column: 'condicion',
				accessor: 'condicion',
				label: 'Condición de matrícula'
			}
		]
	}, [t])

	return (
		<div>
			{loading && <BarLoader />}
			<Row>
				<Col xs={12}>
					<TableReactImplementation
						data={data}
						avoidSearch
						showAddButton={false}
						columns={columns}
						orderOptions={[]}
						pageSize={10}
					/>
				</Col>
			</Row>
		</div>
	)
}

export default HistoricoMatriculaTable
