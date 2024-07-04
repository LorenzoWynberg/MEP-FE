import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from '../../../../layout/AppLayout'

import adminItems from '../../../../constants/adminMenu'

import Invitaciones from './Invitaciones/main.tsx'

type IProps = { active: number }

type IState = {}

const TempComponent = (title: any) => (
	<div>
		<h3>{title}</h3>
	</div>
)

const AlertaTemprana: React.FC<IProps> = props => {
	return (
		<AppLayout items={adminItems}>
			<Container>
				<Row>
					<Col xs={12}>
						{
							{
								0: <TempComponent title='Administradores' />,
								1: <TempComponent title='Gestores' />,
								2: <TempComponent title='Directores Regionales' />,
								3: <TempComponent title='Supervisores' />,
								4: <TempComponent title='Directores de instituciones' />,
								5: <Invitaciones />
							}[props.active]
						}
					</Col>
				</Row>
			</Container>
		</AppLayout>
	)
}

export default AlertaTemprana
