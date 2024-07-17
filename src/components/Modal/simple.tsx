import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
// import { Button } from 'reactstrap'
import styled from 'styled-components'
import Loader from 'Components/LoaderContainer'
import { Button } from 'Components/CommonComponents'
import { useTranslation } from 'react-i18next'

interface IProps {
	title: string
	subTitle?: string
	icon?: boolean
	msg?: string
	id?: string
	txtBtn?: string
	actions?: boolean
	txtBtnCancel?: string
	colorBtnConfim?: string
	iconLabel?: string
	alignButton?: string
	openDialog: boolean
	btnCancel?: boolean
	onConfirm?: Function
	children?: React.ReactNode
	onClose: () => void
	stylesContent?: any
	btnSubmit?: boolean
}
const SimpleModal: React.FC<IProps> = props => {
	const {
		msg,
		txtBtn,
		id,
		title,
		subTitle,
		txtBtnCancel,
		colorBtnConfim,
		btnCancel,
		onClose,
		onConfirm,
		openDialog,
		children,
		icon,
		iconLabel,
		actions,
		alignButton,
		btnSubmit = true,
		addMarginTitle = false
	} = props

	const { t } = useTranslation()

	const [loading, setLoading] = useState<boolean>(false)
	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	document.body.removeAttribute('style')

	const onConfirmModal = async (): Promise<void> => {
		setLoading(true)
		await onConfirm()
		setLoading(false)
	}
	const _id = id || Math.random().toString(36)
	return (
		<DialogStyled
			id={_id}
			disableEnforceFocus
			disablePortal
			fullScreen={fullScreen}
			open={openDialog}
			onClose={onClose}
			maxWidth='md'
			aria-labelledby='responsive-dialog-title'
		>
			<DialogTitleStyled>
				{icon && <Icon color={theme.palette.primary.main} className={'fas fa-' + iconLabel} />}
				<Titles>
					<div style={addMarginTitle ? {marginLeft:28}:{}}><TitleH2>{title}</TitleH2></div>
					<SubTitle>{subTitle}</SubTitle>
				</Titles>

				<IconButton onClick={onClose} aria-label='Add' component='span'>
					<CloseIcon fontSize='small' />
				</IconButton>
			</DialogTitleStyled>

			<DialogContentStyled style={props.stylesContent ? { ...props.stylesContent } : {}}>
				{children || <DialogContentText>{msg}</DialogContentText>}
			</DialogContentStyled>

			{actions && (
				<DialogActionsStyled align={alignButton}>
					{btnCancel && (
						<Button outline className={'cursor-pointer'} onClick={onClose}>
							{txtBtnCancel ? t(txtBtnCancel, txtBtnCancel) : 'Cancelar'}
						</Button>
					)}
					{btnSubmit && (
						<Button className={'cursor-pointer'} onClick={onConfirmModal} color={colorBtnConfim}>
							{txtBtn ? t(txtBtn, txtBtn) : 'Aceptar'}
						</Button>
					)}
				</DialogActionsStyled>
			)}

			{loading && <Loader />}
		</DialogStyled>
	)
}

SimpleModal.defaultProps = {
	title: '',
	subTitle: '',
	txtBtn: 'general>aceptar',
	alignButton: 'center',
	txtBtnCancel: 'boton>general>cancelar',
	colorBtnConfim: 'primary',
	icon: false,
	iconLabel: 'exclamation-circle',
	btnCancel: true,
	actions: true,
	openDialog: false,
	onConfirm: () => {},
	onClose: () => {}
}

const DialogStyled = styled(Dialog)`
	.loader-container {
		background: rgb(255 255 255 / 42%) !important;
		z-index: 9999;
	}
`
const Titles = styled.div`
	margin: 0;
	flex: auto;
`
const TitleH2 = styled.h2`
	margin: 0;
`
const SubTitle = styled.p`
	margin: 0;
`
const Icon = styled.i<{ color: string }>`
	color: ${props => props.color};
	padding-right: 20px;
	font-size: 20px;
	flex: 0;
`
const DialogTitleStyled = styled.div`
	
	padding: 10px;
	display: flex;
	align-items: center;
	width: 100%;
`
const DialogContentStyled = styled(DialogContent)`
	padding: 20px;
`
const DialogActionsStyled = styled(DialogActions)<{ align: string }>`
	display: flex;
	justify-content: ${props => props.align}!important;
	align-items: center !important;
	margin-bottom: 15px;
`
export default SimpleModal
