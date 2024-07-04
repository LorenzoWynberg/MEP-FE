import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CloseIcon from '@material-ui/icons/Close'
import Loader from 'Components/LoaderContainer'
import React, { useState } from 'react'
import { Button } from 'reactstrap'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import THEME from 'Assets/js/colors'

interface IProps {
	msg?: string
	actions?: boolean
	title: string
	txtBtn?: string
	txtBtnCancel?: string
	colorBtn?: string
	icon?: string
	openDialog: boolean
	btnCancel?: boolean
	onConfirm?: Function
	children?: React.ReactNode
	onClose: () => void
}
const ConfirmModal: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const {
    msg,
    txtBtn,
    title,
    txtBtnCancel,
    colorBtn,
    btnCancel,
    onClose,
    onConfirm,
    openDialog,
    children,
    icon,
    actions
  } = props

  const [loading, setLoading] = useState<boolean>(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  document.body.removeAttribute('style')

  const onConfirmModal = async (): Promise<void> => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <DialogStyled
      fullScreen={fullScreen}
      open={openDialog}
      onClose={onClose}
      aria-labelledby='responsive-dialog-title'
    >
      <DialogTitleStyled id='responsive-dialog-title'>
        {icon && (
          <Icon
            color={THEME.primary}
            className={'fas fa-solid fa-' + icon}
          />
        )}
        <TitleH2>{title}</TitleH2>
        <IconButton onClick={onClose} aria-label='Add' component='span'>
          <CloseIcon fontSize='small' />
        </IconButton>
      </DialogTitleStyled>

      <DialogContentStyled>
        {children || <Txt>{msg}</Txt>}
      </DialogContentStyled>

      {actions && (
        <DialogActionsStyled>
          {btnCancel && (
            <Button
              outline
              className='mr-3 cursor-pointer'
              onClick={onClose}
              color='secondary'
            >
              {t('boton>general>cancelar', 'Cancelar')}
            </Button>
          )}
          <Button
            className='cursor-pointer'
            onClick={onConfirmModal}
            color={colorBtn}
          >
            {t('general>aceptar', 'Aceptar')}
          </Button>
        </DialogActionsStyled>
      )}

      {loading && <Loader />}
    </DialogStyled>
  )
}

ConfirmModal.defaultProps = {
  msg: '',
  title: '',
  txtBtn: 'Aceptar',
  txtBtnCancel: 'Cancelar',
  colorBtn: 'primary',
  icon: 'exclamation-circle',
  btnCancel: true,
  openDialog: false,
  actions: true,
  onConfirm: () => {},
  onClose: () => {}
}
const TitleH2 = styled.h2`
	margin: 0;
	flex: auto;
`

const DialogStyled = styled(Dialog)`
	.loader-container {
		background: rgb(255 255 255 / 42%) !important;
		z-index: 9999;
	}
`
const Icon = styled.i<{ color: string }>`
	color: ${(props) => props.color};
	padding-right: 20px;
	font-size: 20px;
	flex: 0;
`
const Txt = styled.div`
	padding: 20px;
	font-size: 15px;
	width: 400px;
	text-align: center;
	margin: 20px 0;
`
const DialogTitleStyled = styled.div`
	border-bottom: 1px solid #000;
	padding: 10px;
	display: flex;
	align-items: center;
	width: 100%;
`
const DialogContentStyled = styled(DialogContent)`
	padding: 20px;
	min-width: 100%;
`
const DialogActionsStyled = styled(DialogActions)`
	display: flex;
	justify-content: center !important;
	align-items: center !important;
	margin-bottom: 15px;
`
export default ConfirmModal
