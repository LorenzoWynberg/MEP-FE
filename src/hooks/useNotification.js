import React, { useState } from 'react'
import Notification from '../notifications'

const useNotification = () => {
  const [open, setOpen] = useState(false)
  const snackbar = (variant, msg, timeToHide = 3000) => (
    <Notification
      open={open}
      handleClose={handleClose}
      msg={msg}
      variant={variant || 'success'}
      timeToHide={timeToHide}
    />
  )

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return [snackbar, handleClick, handleClose]
}

export default useNotification
