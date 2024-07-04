import React from 'react'
import ReactPlayer from 'react-player'
import { Container, Row } from 'reactstrap'
import { Colxx } from '../../../../components/common/CustomBootstrap'
import { useTranslation } from 'react-i18next'

const Ayuda = props => {
	const { t } = useTranslation()
	return (
		<Container>
			<Row>
				<Colxx lg='12'>
					<h2>{t('ayuda>opcion2>titulo', 'Registro de personas')}</h2>
				</Colxx>
				<Colxx md='6' sm='12' className='mb-5'>
					<ReactPlayer
						controls
						url='https://youtu.be/99K-b_9NqnA'
						width='100%'
						config={{
							youtube: {
								playerVars: {
									showinfo: 1,
									modestbranding: 1
								}
							}
						}}
					/>
				</Colxx>
				<Colxx md='6' sm='12' className='mb-5'>
					<ReactPlayer
						controls
						url='https://youtu.be/Ww0GzKR0v2o'
						width='100%'
						config={{
							youtube: {
								playerVars: {
									showinfo: 1,
									modestbranding: 1
								}
							}
						}}
					/>
				</Colxx>
				<Colxx md='6' sm='12' className='mb-5'>
					<ReactPlayer
						controls
						url='https://youtu.be/3Swv0-9nMLw'
						width='100%'
						config={{
							youtube: {
								playerVars: {
									showinfo: 1,
									modestbranding: 1
								}
							}
						}}
					/>
				</Colxx>
			</Row>

			<Row>
				<Colxx lg='12'>
					<h2>Registro de matrícula</h2>
				</Colxx>
				<Colxx md='6' sm='12' className='mb-5'>
					<ReactPlayer
						controls
						url='https://youtu.be/2_CiJwS9jwQ'
						width='100%'
						config={{
							youtube: {
								playerVars: {
									showinfo: 1,
									modestbranding: 1
								}
							}
						}}
					/>
				</Colxx>
				<Colxx md='6' sm='12' className='mb-5'>
					<ReactPlayer
						controls
						url='https://youtu.be/798kpw3LY9E'
						width='100%'
						config={{
							youtube: {
								playerVars: {
									showinfo: 1,
									modestbranding: 1
								}
							}
						}}
					/>
				</Colxx>
			</Row>
			<Row>
				<Colxx lg='12'>
					<h2>Traslados</h2>
				</Colxx>
				<Colxx md='6' sm='12' className='mb-5'>
					<ReactPlayer
						controls
						url='https://youtu.be/LX2b_rKBJj0'
						width='100%'
						config={{
							youtube: {
								playerVars: {
									showinfo: 1,
									modestbranding: 1
								}
							}
						}}
					/>
				</Colxx>
				<Colxx md='6' sm='12'>
					<ReactPlayer
						controls
						url='https://youtu.be/NEwOlv95i5Y'
						width='100%'
						config={{
							youtube: {
								playerVars: {
									showinfo: 1,
									modestbranding: 1
								}
							}
						}}
					/>
				</Colxx>
				<Colxx md='6' sm='12' className='mb-5'>
					<ReactPlayer
						controls
						url='https://youtu.be/anfiN2-1OsU'
						width='100%'
						config={{
							youtube: {
								playerVars: {
									showinfo: 1,
									modestbranding: 1
								}
							}
						}}
					/>
				</Colxx>
				<Colxx md='6' sm='12' className='mb-5'>
					<ReactPlayer
						controls
						url='https://youtu.be/k9TENrucrPE'
						width='100%'
						config={{
							youtube: {
								playerVars: {
									showinfo: 1,
									modestbranding: 1
								}
							}
						}}
					/>
				</Colxx>
			</Row>
		</Container>
	)
}

export default Ayuda
