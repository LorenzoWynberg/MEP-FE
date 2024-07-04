import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import colors from '../assets/js/colors'

export const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1)
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: colors.primary,
        opacity: 1,
        border: 'none'
      }
    },
    '&$focusVisible $thumb': {
      color: colors.primary,
      border: '6px solid #fff'
    }
  },
  thumb: {
    width: 24,
    height: 24
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border'])
  },
  checked: {},
  focusVisible: {}
}))((props) => {
  const { classes } = props
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      disabled={props.disabled}
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      {...props}
    />
  )
})
