import React, { useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface IProps {
	options: any[]
	row: any
	close?: boolean
}

const ITEM_HEIGHT = 48

const ContextualMenu: React.FC<IProps> = (props) => {
  const { options, row, close = false } = props
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (close) {
      handleClose()
    }
  }, [close])

  return (
    <div>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
				  'aria-labelledby': 'long-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
				  style: {
				    maxHeight: ITEM_HEIGHT * 4.5,
				    width: '20ch'
				  }
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            style={{ paddingLeft: '2%' }}
            key={index}
            onClick={() => {
						  option.action(row)
						  setAnchorEl(null)
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default ContextualMenu
