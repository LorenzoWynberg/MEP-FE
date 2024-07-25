import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import Regional from '../Regional'
import ReporteGeografico from '../Geografico'
import Circuital from '../Circuital'
import Institucional from '../Institucional'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
// const options = ["Nacional", "Regional", "Circuital", "Institucional"]

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
	const options = [t("gestion_usuario>usuarios>regional", "Regional"), t('reportes>circuital', 'Circuital'), t('reportes>institucional', 'Institucional'), t('reportes>geografico', 'Geográfico')]

	switch (accessRole.nivelAccesoId) {
		case 1: // Institucion
			removeFromArray(options, 'Regional')
			removeFromArray(options, 'Circuital')
			break
		case 2: // Circuito
			removeFromArray(options, 'Regional')
			break
		case 3: // Regional
			break
		case 4: // Global
			break
	}

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
					{accessRole?.nivelAccesoId !== 2 && accessRole?.nivelAccesoId !== 1 && (
						<>
							{
								{
									0: <Regional />,
									1: <Circuital />,
									2: <Institucional />,
									3: <ReporteGeografico />
								}[activeTab]
							}
						</>
					)}
					{accessRole?.nivelAccesoId === 2 && (
						<>
							{
								{
									0: <Circuital />,
									1: <Institucional />
								}[activeTab]
							}
						</>
					)}
					{accessRole?.nivelAccesoId === 1 && (
						<>
							{
								{
									0: <Institucional />
								}[activeTab]
							}
						</>
					)}
				</div>
			</div>
		</div>
	)
}

const Container = styled.div`
	display: grid;
	justify-content: center;
	width: 100%;
`

export default Reportes
