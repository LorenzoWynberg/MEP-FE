import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Container, Row } from 'reactstrap'

export const RequiredInstitution = () => {
	const { t } = useTranslation()

	return (
		<section>
			<Container>
				<Row>
					<Col xs={12}>
						<h3>
							{t(
								'estudiantes>traslados>gestion_traslados>seleccionar',
								'Debe seleccionar un centro educativo en el buscador de centros educativos.'
							)}
						</h3>
					</Col>
				</Row>
			</Container>
		</section>
	)
}
export default RequiredInstitution
