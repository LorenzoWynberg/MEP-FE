import React, { useEffect, useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import Regional from '../Regional'
import ReporteGeografico from '../Geografico'
import Circuital from '../Circuital'
import Institucional from '../Institucional'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'


const removeFromArray = (arr, str) => {
	const index = arr.findIndex(el => el === str)
	if (index !== -1) {
		arr.splice(index, 1)
	}
}
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
	switch (accessRole.nivelAccesoId) {
		case 1: // Institucion
			removeFromArray(options, 'Regional')
			removeFromArray(options, 'Circuital')
			removeFromArray(options, 'Geográfico')
			break
		case 2: // Circuito
			removeFromArray(options, 'Geográfico')
			removeFromArray(options, 'Regional')
			break
		case 3: // Regional
			break
		case 4: // Global
			break
	}

	props.props.tipo == 'matricula' && removeFromArray(options, 'Geográfico')


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
 
					{accessRole?.nivelAccesoId === 4 && (
						<>
							{
								props.props.tipo != 'matricula' ? {
									0: <ReporteGeografico props={props.props} />,
									1: <Regional props={props.props} />,
									2: <Circuital props={props.props} />,
									3: <Institucional props={props.props} />
								}[activeTab] : {

									0: <Regional props={props.props} />,
									1: <Circuital props={props.props} />,
									2: <Institucional props={props.props} />
								}[activeTab]
							}
						</>
					)}
					{accessRole?.nivelAccesoId === 3 && (
						<>
							{
								{
									0: <ReporteGeografico props={props.props} />,
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
		</div >
	)
}

export default Reportes
