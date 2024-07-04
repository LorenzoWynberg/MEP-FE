import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import IntlMessages from 'Helpers/IntlMessages'
import PropTypes from 'prop-types'
import {
  Button
} from 'reactstrap'

const CofirmModal = (props) => {
  const { msg, txtBtn, title, colorBtn, btnCancel, onClose, onConfirm, openDialog } = props
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={onClose}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>
          <IntlMessages id={title} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <IntlMessages id={msg} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
                        btnCancel &&
                          <Button outline className='mr-3 cursor-pointer' onClick={onClose} color='secondary'>
                            <IntlMessages id='button.cancel' />
                          </Button>
                    }
          <Button className='mr-3 cursor-pointer' onClick={onConfirm} color={colorBtn}>
            <IntlMessages id={txtBtn} />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
CofirmModal.propTypes = {
  msg: PropTypes.string,
  title: PropTypes.string,
  txtBtn: PropTypes.string,
  colorBtn: PropTypes.string,
  openDialog: PropTypes.bool,
  btnCancel: PropTypes.bool,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func
}
CofirmModal.defaultProps = {
  msg: 'dialog.deleteInfo',
  title: 'dialog.deleteTitle',
  txtBtn: 'button.remove',
  colorBtn: 'danger',
  btnCancel: true,
  openDialog: false,
  onConfirm: () => { },
  onClose: () => { }
}
export default CofirmModal
