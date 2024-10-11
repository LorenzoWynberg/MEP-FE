import React, { useState, useEffect } from 'react'
import FormProgenitor from './FormProgenitor'
import { Row, Col } from 'reactstrap'
import { envVariables } from '../../../../../../constants/enviroment'
import withAuthorization from 'Hoc/withAuthorization'
import { withIdentification } from 'Hoc/Identification'
import BarLoader from 'Components/barLoader/barLoader'
import axios from 'axios'
import { isEmpty } from 'lodash'
import colors from 'assets/js/colors'
import { useTranslation } from 'react-i18next'

const DatosRegistrales = props => {
	const { t } = useTranslation()
	const [estudiante, setEstudiante] = useState({})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (props.identificacion) {
			axios
				.get(
					`${envVariables.BACKEND_URL}/api/TSEIdentidad/GetOneByCedula/${props.identificacion}`
				)
				.catch(e => {
					props.toggleSnackbar(
						'error',
						'Error: Problema de conexión con el TSE'
					)
				})
				.then(r => {
					if (!isEmpty(r?.data)) {
						setEstudiante(r.data)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [props.identificacion])

	if (loading) {
		return <BarLoader />
	}

	if (isEmpty(estudiante)) {
		return (
			<>
				<h1 style={{ color: colors.error }}>
					<i className="fas fa-exclamation-triangle"></i>
					{' Problema de conexión con el TSE'}
				</h1>
			</>
		)
	}

	return (
		<Row className="mb-3">
			<Col xs={12}>
				<p className="mb-3">
					<i className="fas fa-info-circle"></i> En esta pantalla muestra la
					información de los progenitores de la persona estudiante, suministrada
					por el Tribunal Supremo de Elecciones (T.S.E):
				</p>
			</Col>

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
