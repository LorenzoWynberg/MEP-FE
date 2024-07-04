import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { IconButton } from '@material-ui/core'

const CatalogosMenu = props => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          props.handleUpdateCatalogo()
          handleClose()
        }}
        >Editar
        </MenuItem>

        <MenuItem onClick={() =>
          props.handleSelectElementos()}
        >Editar contenido
        </MenuItem>
      </Menu>
    </div>
  )
}

/* Temporalmente inhabilitado
<MenuItem onClick={() => {
                    props.handleUpdateEstadoCatalogo()
                    handleClose()
}}>Cambiar estado</MenuItem>

<MenuItem onClick={() => {
                    props.handleSelectElementos()
                    handleClose()
                }}>Editar estructura</MenuItem>
 */
export default CatalogosMenu
