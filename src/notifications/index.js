import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'
import { makeStyles } from '@material-ui/core/styles'

import colors from '../assets/js/colors'

/** ****************************************************
Tipos de variants (variantes):
    * success
    * info
    * error
    * warning

    props que recibe MySnackbarContentWrapper:
    * variant="success" """Un tipo de variante para el snackbar"""
    * message="This is a success message!" """Mensaje del snackbar"""
*********************************************************/

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
}

const useStyles1 = makeStyles((theme) => ({
  success: {
    backgroundColor: '#28A745'
  },
  error: {
    backgroundColor: '#DC3545'
  },
  info: {
    backgroundColor: colors.primary
  },
  warning: {
    backgroundColor: '#B69329'
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}))

function MySnackbarContentWrapper (props) {
  const classes = useStyles1()
  const { className, message, onClose, variant, ...other } = props
  const Icon = variantIcon[variant]

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby='client-snackbar'
      message={
        <span id='client-snackbar' className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key='close'
          aria-label='close'
          color='inherit'
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  )
}

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
  duration: PropTypes.number
}
MySnackbarContentWrapper.defaultProps = {
  duration: 6000
}
export default function CustomizedSnackbars (props) {
  const { open, variant, msg, timeToHide, handleClose } = props
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={open}
      autoHideDuration={timeToHide}
      onClose={handleClose}
    >
      <MySnackbarContentWrapper
        onClose={handleClose}
        variant={variant}
        message={msg}
      />
    </Snackbar>
  )
}
