import React, { useState, useEffect } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { Colxx } from 'Components/common/CustomBootstrap'

interface IProps {
	data: Array<any>
	columns: Array<any>
}

const TableStudentsSCE: React.FC<IProps> = props => {
	const { data, columns } = props
	const [students, setStudents] = useState([])

	useEffect(() => {
		setStudents(data.map(mapper))
	}, [data])

	const mapper = el => {
		return {
			...el,
			id: el.matriculaId,
			image: el.img,
			edad: el.fechaNacimiento,
			fechaNacimiento: el.fechaNacimiento,
			nacionalidad: el.nacionalidad ? el.nacionalidad : '',
			genero: el.genero ? el.genero : '',
			cuentaCorreoOffice: el.cuentaCorreoOffice ? 'Sí' : 'No'
		}
	}
	return (
		<Colxx
			className={props.noMargin ? 'mb-0' : 'mb-5'}
			style={props.noMargin ? { margin: 0, padding: 0 } : {}}
			sm='12'
			lg='12'
			xl='12'
		>
			<TableReactImplementation
				avoidSearch={props.avoidSearch}
				orderOptions={[]}
				columns={columns}
				data={students}
			/>
		</Colxx>
	)
}

export default TableStudentsSCE
