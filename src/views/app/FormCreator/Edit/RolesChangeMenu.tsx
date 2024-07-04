import React from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const RolesChangeMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    props.setOpenMenu()
  }

  const handleClose = () => {
    setAnchorEl(null)
    props.closeMenu()
  }

  return (
    <div>
      <Button aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick}>
        {props.role} <ExpandMoreIcon />
      </Button>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(props.open)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          props.handleChangeRole('lector')
          handleClose()
        }}
        >Lector
        </MenuItem>
        <MenuItem onClick={() => {
          props.handleChangeRole('Editor')
          handleClose()
        }}
        >Editor
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          props.handleDelete()
          handleClose()
        }}
        >Eliminar
        </MenuItem>
      </Menu>
    </div>
  )
}

export default RolesChangeMenu
