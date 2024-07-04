import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
  Button
} from 'reactstrap'

const SessionExpired = (props) => {
  const { onConfirm, type, openDialog, duration } = props
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const session = moment.duration(duration).seconds()
  const [time, setTime] = useState(session)

  React.useEffect(() => {
    setTime(session)
  }, [session])

  React.useEffect(() => {
    function progress() {
      setTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0))
    }
    const timer = setInterval(progress, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>
          {
            type === 401 &&
            <div className='d-flex justify-content-center align-items-center'>
              Sesión expirada
            </div>
          }
        </DialogTitle>
        <DialogContent>
          {
            type === 401 &&
            <div className='d-flex justify-content-center align-items-center'>
              Su sesión ha expirado.
              Deberá acceder nuevamete al sistema
            </div>
          }
        </DialogContent>
        <DialogActions className='d-flex justify-content-center align-items-center'>
          <Button onClick={onConfirm} className='cursor-pointer' size='lg' color='primary'>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
SessionExpired.propTypes = {
  openDialog: PropTypes.bool,
  onConfirm: PropTypes.func,
  duration: PropTypes.number,
  type: PropTypes.number
}
SessionExpired.defaultProps = {
  openDialog: true,
  type: 401,
  duration: 0,
  onConfirm: () => { }
}
export default SessionExpired
