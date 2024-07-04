import React, { useState } from 'react'
import useNotification from 'Hooks/useNotification'
// returns component with showNotification inside the props element
// showNotification(msg, variant)

type SnackbarConfig = {
	variant: string
	msg: string
}

const withNotification = (Component) => {
  return (props) => {
    const [snackbar, handleClick] = useNotification()
    const [snackbarContent, setSnackbarContent] = useState({
      msg: '',
      variant: ''
    })

    const showSnackbar = (msg, variant) => {
      setSnackbarContent({ msg, variant })
      handleClick()
    }
    return (
      <>
        {snackbar(snackbarContent.variant, snackbarContent.msg)}
        <Component showSnackbar={showSnackbar} {...props} />
      </>
    )
  }
}

export default withNotification
