import React from 'react'
import { Container, Row } from 'reactstrap'
import { Colxx } from '../../../../components/common/CustomBootstrap'
import { useTranslation } from 'react-i18next'

const ManualTab = props => {
	const { t } = useTranslation()
	return (
		<Container style={{ margin: 0 }}>
			<Row>
				<Colxx lg='12'>
					<h2>{t('ayuda>manuales>descargables', 'Descargables')}</h2>
				</Colxx>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(5,1fr)'
					}}
				>
					<div className='download-container' style={{ paddingLeft: '1rem' }}>
						 <a href='SABER- Manual de usuario v3.1.pdf' target='_blank'>
							 <i className='simple-icon-cloud-download' />
						 </a>
						<p>{t('ayuda>manuales>manual_usuario', 'Manual de usuario')}</p>
					</div>
					
					<div className='download-container' style={{ paddingLeft: '1rem' }}>
						 <a href='SABER-Guia rapida registro matricula estudiante-Censo Inicial 2024.pdf' target='_blank'>
							 <i className='simple-icon-cloud-download' />
						 </a>
						<p>{t('ayuda>manuales>manual_usuario_guia', 'Guia Rapida Censo inicial 2024')}</p>
					</div>
					<div className='download-container' style={{ paddingLeft: '1rem' }}>
						<a href='Lineamientos Censo Inicial 2024- Saber.pdf' target='_blank'>
							<i className='simple-icon-cloud-download' />
						</a>
						<p>{t('ayuda>manuales>lineamientos', 'Lineamientos del censo inicial 2024')}</p>
					</div>
					
				</div>
			</Row>
		</Container>
	)
}

export default ManualTab
