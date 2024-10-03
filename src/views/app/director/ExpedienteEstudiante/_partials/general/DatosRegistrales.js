import React, { useState, useEffect } from 'react'
import FormProgenitor from './FormProgenitor'
import { Row, Col } from 'reactstrap'
import { envVariables } from '../../../../../../constants/enviroment'
import withAuthorization from 'Hoc/withAuthorization'
import { withIdentification } from 'Hoc/Identification'
import BarLoader from 'Components/barLoader/barLoader'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const DatosRegistrales = props => {
	const { t } = useTranslation()
	const [estudiante, setEstudiante] = useState({})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		axios
			.get(
				`${envVariables.BACKEND_URL}/api/TSEIdentidad/GetOneByCedula/${props.identification.data.identificacion}`
			)
			.then(r => {
				setEstudiante(r.data)
				setLoading(false)
			})
	}, [props.identificacion])

	if (loading) {
		return <BarLoader />
	}

	return (
		<Row className="mb-3">
			<Col lg={6}>
				<FormProgenitor
					nombre={estudiante.nombreMadrePadreRegistral1}
					cedula={estudiante.idMadrePadreRegistral1}
					title={t(
						'estudiantes>expediente>info_gen>info_gen>datos_padre>titulo',
						'Datos del padre'
					)}
				/>
			</Col>
			<Col lg={6}>
				<FormProgenitor
					nombre={estudiante.nombreMadrePadreRegistral2}
					cedula={estudiante.idMadrePadreRegistral2}
					title={t(
						'estudiantes>expediente>info_gen>info_gen>datos_madre>titulo',
						'Datos de la madre'
					)}
				/>
			</Col>
		</Row>
	)
}

export default withAuthorization({
	id: 101,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion General',
	Seccion: 'Datos registrales'
})(withIdentification(DatosRegistrales))
