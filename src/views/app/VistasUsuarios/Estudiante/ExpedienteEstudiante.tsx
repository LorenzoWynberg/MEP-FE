import React, { useEffect } from 'react'
import { CardContainer, Card } from '../Componentes'
import { useHistory, useParams } from 'react-router-dom'
import { useVistasUsuarios } from '../Hooks'

import { connect } from 'react-redux'
const ExpedienteEstudiante = props => {
	const history = useHistory()
	const { id } = useParams<any>()
	const { setSelectedAcademiaEvent, loadEstudianteData } = useVistasUsuarios()
	useEffect(() => {
		loadEstudianteData()
	}, [])
	const onAcademiaCardClickEvent = item => {
		history.push('/view/areacurricular/')
		setSelectedAcademiaEvent(item)
	}
	const onExpedienteEstudianteCardClickEvent = () => {
		history.push('/view/expediente-estudiante/inicio')
	}
	return (
		<div>
			<span>{'< Regresar'}</span>
			<section>
				<h2>Expediente estudiantil</h2>
				<span>Aquí podrá encontrar la información general relacionada con la persona estudiante</span>
				<CardContainer>
					{props?.estudianteSeleccionado ? (
						<Card
							onClick={() => onExpedienteEstudianteCardClickEvent()}
							institutos={props?.estudianteSeleccionado?.info_academica?.map(
								item => item.nombreCentroEducativo
							)}
							image={props?.estudianteSeleccionado?.fotografiaUrl || undefined}
							name={props?.estudianteSeleccionado?.nombre}
						/>
					) : (
						''
					)}
				</CardContainer>
			</section>
			<section>
				<h2>Área curricular de {props?.estudianteSeleccionado?.nombre}</h2>
				<span>
					Aquí podrá encontrar la información de los horarios, calificaciones y demás de cada centro educativo
					donde se encuentra matriculada la persona estudiante
				</span>
				<CardContainer>
					{props?.estudianteSeleccionado?.info_academica?.map((item, index) => {
						return (
							<Card
								key={index}
								onClick={() => onAcademiaCardClickEvent(item)}
								name={item.nombreCentroEducativo}
							/>
						)
					})}
					{/* <Card
                        onClick={() => history.push('/view/areacurricular/')}
                        name="Prueba"
                    />
                    <Card
                        onClick={() => history.push('/view/areacurricular/')}
                        name="Prueba"
                    /> */}
				</CardContainer>
			</section>
		</div>
	)
}

const mapStateToProps = store => {
	return {
		estudianteSeleccionado: store.VistasUsuarios.estudianteSeleccionado,
		estudiantesEncargado: store.VistasUsuarios.estudiantesEncargado,
		usuarioActual: store.VistasUsuarios.usuarioActual,
		estudiantesEncargadoIndex: store.VistasUsuarios.estudiantesEncargadoIndex,
		info_academica: store.VistasUsuarios.info_academica
	}
}

export default connect(mapStateToProps)(ExpedienteEstudiante)
