import React, { useEffect } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import styled from 'styled-components'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import temaObj from 'Assets/js/colors'

interface IProps {
	options: any[]
	row: any
	close?: boolean
}
const colors =  temaObj.color
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

  const _colors = {
    1: colors.primary,
    3: colors.yellow,
    4: colors.orange
  }

  const getColorCenso = (row): string => {
    return _colors[row.estadoCensoId] || colors.darkGray
  }

  return (
    <div className='w-100'>
      <ButtonStyled
        aria-label='more'
        id={'long-menu' + row.IdentidadId}
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
        variant='contained'
        colors={getColorCenso(row)}
        endIcon={!open ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      >
        {row.estadoCensoId ? row.estadoCensoNombre : 'Pendiente'}
      </ButtonStyled>
      <Menu
        id={'long-menu' + row.IdentidadId}
        MenuListProps={{
				  'aria-labelledby': 'long-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
				  style: {
				    maxHeight: ITEM_HEIGHT * 4.5
				  }
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            style={{ paddingLeft: '2%', minWidth: '100px' }}
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

const ButtonStyled = styled(Button)<{ colors: string }>`
	background: ${(props) => props.colors}!important;
	width: 100% !important;
	font-size: 12px !important;
`

export default ContextualMenu
