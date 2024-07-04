import React, { useState } from 'react'
import RegistroFormPreview from '../_partials/formPreviewSaveData'
import styled from 'styled-components'
import SimpleModal from 'Components/Modal/simple'
import { Button } from 'reactstrap'
import Loader from 'Components/LoaderContainer'
import useNotification from 'Hooks/useNotification'
import { useTranslation } from 'react-i18next'

type SnackbarConfig = {
	variant: string
	msg: string
}
interface IProps {
	data: any
	photo: string
	openModal: boolean
	isVerify: boolean
	areChange: boolean
	isAplicar: boolean
	identificationChange: boolean
	closeModal: () => void
	onConfirm: () => void
	onCancel: () => void
}

const PreviewRegister: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const {
		openModal,
		closeModal,
		onCancel,
		onConfirm,
		data,
		photo,
		isVerify,
		isAplicar,
		areChange,
		identificationChange
	} = props
	const [loading, setLoading] = useState(false)
	const [snackbar, handleClick] = useNotification()
	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})

	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	const onConfirmModal = async () => {
		setLoading(true)

		const _response: any = await onConfirm()
		setLoading(false)

		if (_response && _response.error) {
			showNotification('error', _response.message)
		}
	}

	return (
		<SimpleModal
			openDialog={openModal}
			onClose={closeModal}
			title={`${
				isVerify
					? t(
							'estudiantes>identidad_persona>persona_ya_registrada',
							'Persona ya registrada'
					  )
					: t('general>title>confirmacion_datos', 'Confirmación de datos')
			}`}
			actions={false}
		>
			<Container>
				{snackbar(snackBarContent.variant, snackBarContent.msg)}

				{isVerify ? (
					<h5>
						{t(
							'estudiantes>identidad_persona>persona_ya_registrada>texto',
							'La persona que usted está tratando de registrar ya existe en el sistema. Esta es su información:'
						)}
					</h5>
				) : (
					<h5>
						{t(
							'estudiantes>identidad_persona>persona_ya_registrada>texto2',
							'Por favor revise que todos los datos concuerden con la persona'
						)}
					</h5>
				)}

				<Content>
					<RegistroFormPreview data={data} isVerify={isVerify} />
					<PhotoContainer>
						<img
							src={
								isVerify
									? data?.imagen
										? data.imagen
										: '/assets/img/profile-pic-generic.png'
									: photo || '/assets/img/profile-pic-generic.png'
							}
							alt='Identity register'
						/>
					</PhotoContainer>
				</Content>
				{isVerify && (
					<h5>
						*
						{t(
							'general>mesa_servicio',
							'Si usted cree que esto es un error comuníquese con la mesa de servicio.'
						)}
					</h5>
				)}
				<Actions>
					{isVerify ? (
						<Button onClick={onConfirmModal} color='primary'>
							{t('general>cerrar', 'Cerrar')}
						</Button>
					) : (
						<>
							{isAplicar && !areChange && !identificationChange ? (
								<Button onClick={onConfirmModal} color='primary'>
									{t('general>cerrar', 'Cerrar')}
								</Button>
							) : (
								<>
									<Button
										outline
										onClick={onCancel}
										color='secondary'
										className='mr-5'
									>
										{t('general>cancelar', 'Cancelar')}
									</Button>
									<Button onClick={onConfirmModal} color='primary'>
										{t('boton>general>confirmar', 'Confirmar')}
									</Button>
								</>
							)}
						</>
					)}
				</Actions>
				{loading && <Loader />}
			</Container>
		</SimpleModal>
	)
}

const Container = styled.div`
	display: flex;
	flex-flow: row;
	flex-wrap: wrap;
	gap: 20px;
`
const Content = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 20px;
`
const PhotoContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 200px;
	min-width: 200px;
	height: 200px;
	border-radius: 100px;
	background: #c3c3c3;
	overflow: hidden;
	img {
		width: 100%;
	}
`
const Actions = styled.div`
	display: flex;
	text-align: center;
	align-items: center;
	justify-content: center;
	width: 100%;
`

export default PreviewRegister
