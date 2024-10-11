import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Colxx, Separator } from 'Components/common/CustomBootstrap'
import Breadcrumb from 'Containers/navs/Breadcrumb'
import { cleanIdentity } from '../../../../../redux/identificacion/actions'
import {
	cleanStudentsFilter,
	getStudentDataFilter,
	changeColumn,
	changeFilterOption,
	loadStudent
} from '../../../../../redux/expedienteEstudiantil/actions'
import BuscadorTable from 'Components/buscador-table'

const Buscador = props => {
	const { estudiantes, cleanIdentity, cleanStudentsFilter, buscador, changeColumn, changeFilterOption, loadStudent } =
		props
	const [dataestudiantes, setDataestudiantes] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		cleanIdentity()
		setDataestudiantes(estudiantes)
	}, [cleanIdentity, estudiantes])

	useEffect(() => {
		return () => {
			cleanStudentsFilter()
		}
	}, [cleanStudentsFilter])

	const getDataFilter = async (filterText, filterType) => {
		setLoading(true)
		await props.getStudentDataFilter(filterText, filterType)
		setLoading(false)
	}

	const onSelectRow = async data => {
		await loadStudent(data)
		props.history.push('/view/expediente-estudiante/inicio')
	}

	return (
		<div>
			<Colxx xxs='12'>
				<Breadcrumb heading='Expediente estudiantil' match={props.match} hidePath />
				<br />
				<Separator className='mb-4' />
			</Colxx>
			<BuscadorTable
				rows={dataestudiantes}
				columns={buscador.columns}
				filters={buscador.filters}
				changeColumn={changeColumn}
				changeFilterOption={changeFilterOption}
				getDataFilter={getDataFilter}
				cleanIdentity={cleanIdentity}
				cleanFilter={cleanStudentsFilter}
				onSelectRow={onSelectRow}
			/>
		</div>
	)
}

const mapStateToProps = reducers => {
	return {
		...reducers.expedienteEstudiantil
	}
}

const mapActionsToProps = {
	getStudentDataFilter,
	cleanIdentity,
	cleanStudentsFilter,
	changeColumn,
	changeFilterOption,
	loadStudent
}

export default connect(mapStateToProps, mapActionsToProps)(Buscador)
