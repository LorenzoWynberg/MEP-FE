import React, { useEffect, useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import Regional from '../Regional'
import ReporteGeografico from '../Geografico'
import Circuital from '../Circuital'
import Institucional from '../Institucional'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'


const Reportes = props => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState<number>(0)
	const { accessRole } = useSelector((state: any) => state.authUser?.currentRoleOrganizacion)
	const [options, setOptions] = useState([
		t('reportes>geografico', 'Geográfico'),
		t('gestion_usuario>usuarios>regional', 'Regional'),
		t('reportes>circuital', 'Circuital'),
		t('reportes>institucional', 'Institucional')
	])
	useEffect(() => {

		let optionsCopy = [...options]
		switch (accessRole.nivelAccesoId) {
			case 1: // Institucion
				optionsCopy.filter((item) => item !== 'Geográfico' && item !== 'Circuital' && item !== 'Regional')
				setOptions(optionsCopy)
				break
			case 2: // Circuito 
				optionsCopy.filter((item) => item !== 'Geográfico' && item !== 'Regional')
				setOptions(optionsCopy)
				break
			case 3: // Regional
				break
			case 4: // Global
				break
		}

		console.log('options UE optionsCopy', optionsCopy)
		console.log('options UE props.props.tipo', props.props.tipo)
		if (props.props.tipo == 'matricula') {

			setOptions(optionsCopy.filter((item) => item !== 'Geográfico'))
		}

	}, [accessRole, props.props.tipo])
	if (accessRole.rolId === 11) {
		// Si el rol es Docente(11)  se oculta la seccion
		return <></>
	}

	return (
		<div>
			<div>
				<HeaderTab options={options} activeTab={activeTab} setActiveTab={setActiveTab} />
				<div>
					{/* activeTab === 0 && <Nacional/> */}
					{accessRole?.nivelAccesoId === 4 || accessRole?.nivelAccesoId === 3 && (

						<>
							{
								{
									0: props.props.tipo === 'matricula' ? <ReporteGeografico props={props.props} /> : <></>,
									1: <Regional props={props.props} />,
									2: <Circuital props={props.props.props} />,
									3: <Institucional props={props.props} />
								}[activeTab]
							}
						</>
					)}

					{accessRole?.nivelAccesoId === 2 && (
						<>
							{
								{
									0: <Circuital props={props.props} />,
									1: <Institucional props={props.props} />
								}[activeTab]
							}
						</>
					)}
					{accessRole?.nivelAccesoId === 1 && (
						<>
							{
								{
									0: <Institucional props={props.props} />
								}[activeTab]
							}
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default Reportes
