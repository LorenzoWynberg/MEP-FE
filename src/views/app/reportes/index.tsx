import React, { useState } from 'react'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { Container } from 'reactstrap'
import Reportes from './_partials/Reportes'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const Index = (props) => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState<number>(props.activeTab)
	const options = [
		t('reportes>tab>tablero_datos', 'Tablero de datos'),
		t('menu>reportes>reportes', 'Reportes'),
		t('reportes>tab>certificaciones', 'Certificaciones')
	]
	const activeYear = useSelector(store=>{
		return store.authUser.selectedActiveYear
	})
      
	return (
		<AppLayout items={directorItems}>
			<div className="dashboard-wrapper">
				<Container>
					<h1>
						{/* {
              {
                0: 'Tablero de datos',
                1: 'Reportes',
                2: 'Certificaciones',
              }[activeTab]
            } */}
						{t('menu>reportes>reportes', 'Reportes')}
					</h1>
					{/* <HeaderTab
            options={options}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          /> */}
					<br />
					{/* {
            {
              0: <Tablero />,
              1: <Reportes />,
              2: <Certificaciones />,
            }[activeTab]
          } */}
					<Reportes />
				</Container>
			</div>
		</AppLayout>
	)
}

export default Index
