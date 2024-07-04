import React, { useState } from 'react'
import useNotification from 'Hooks/useNotification'

const Notification = (props) => {
  const [snackbar, handleClick] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({ msg: '', variant: '' })

  const showSnackbar = (msg, variant) => {
    setSnackbarContent({ msg, variant })
    handleClick()
  }
  return (
    <>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      {props.children(showSnackbar)}
    </>
  )
}

export default Notification
