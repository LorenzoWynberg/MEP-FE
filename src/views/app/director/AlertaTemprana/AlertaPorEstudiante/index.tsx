import React from 'react'
import styled from 'styled-components'
import { Container } from 'reactstrap'
import { getDetailStudent } from '../../../../../redux/alertaTemprana/actionStudent'
import { useActions } from 'Hooks/useActions'

import BuscarEstudiante from './BuscarEstudiante'

type AlertaProps = {
	estudiantes: any
	cleanIdentity: any
	cleanAlertFilter: any
	buscador: any
	changeColumn: any
	changeFilterOption: any
	loadStudent: any
	history: any
	getAlertDataFilter: any
	match: any
}

const AlertaPorEstudiante: React.FC<AlertaProps> = props => {
	const [currentStudent, setCurrentStudent] = React.useState<any>(null)

	const actions = useActions({ getDetailStudent })

	const handleSetStudent = async (student: any) => {
		await actions.getDetailStudent(student.identidadId)
		setCurrentStudent(student)
	}

	return (
		<Container>
			<Sections>
				<BuscarEstudiante
					{...props}
					currentStudent={currentStudent}
					handleSetStudent={handleSetStudent}
					updateIndex={updateIndex}
				/>
			</Sections>
		</Container>
	)
}

const Sections = styled.div`
	margin-top: 20px;
`

export default AlertaPorEstudiante
