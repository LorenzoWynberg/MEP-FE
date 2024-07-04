import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { CustomInput, Badge, Button } from 'reactstrap'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Fade from '@material-ui/core/Fade'
import IntlMessages from 'Helpers/IntlMessages'
import { StyledTr } from './styles'

const Item = ({
  cols,
  item,
  actionRow,
  onCheckItem,
  columnsToShow,
  hideMultipleOptions,
  isSelect,
  toggleEditModal,
  handleSingleButton
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <StyledTr
      className='whitout-bg-white__radius cursor-pointer'
      onClick={(e) => {
        e.stopPropagation()
        e.stopPropagation()
        !anchorEl && toggleEditModal(item)
      }}
    >
      {cols.map((column, i) => {
        if (!columnsToShow.includes(column.column)) return null
        return (
          <td
            style={
              (i === 0 && {
                borderRadius: 'calc(0.85rem - 1px) 0 0 calc(0.85rem - 1px)',
                background: item.itemSelected ? 'rgba(0,0,0,0.1)' : 'white'
              }) || {
                background: item.itemSelected ? 'rgba(0,0,0,0.1)' : 'white'
              }
            }
          >
            {column.isBadge
              ? (
                <Badge
                  color={`${
                  column.color ? column.color(item) : item.statusColor
                }`}
                  pill
                  style={{ color: 'white !important' }}
                >
                  {item[column.column]}
                </Badge>
                )
              : column.isButton
                ? <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSingleButton(item)
                    }}
                    color={column.color} size='sm'
                  >{column.placehoder}
                  </Button>
                : (
                    item[column.column]
                  )}
          </td>
        )
      })}

      <td
        className='htmltable_item--actions'
        style={{
          borderRadius: '0 calc(0.85rem - 1px) calc(0.85rem - 1px) 0',
          background: item.itemSelected ? 'rgba(0,0,0,0.1)' : 'white',
          minHeight: '47.78px'
        }}
      >
        {!hideMultipleOptions && (
          <div
            className='mb-2 d-inline-block float-md-left cursor-pointer'
            onClick={(e) => {
              e.stopPropagation()
              onCheckItem(item.id)
            }}
          >
            <CustomInput
              className='item-check mb-0 '
              type='checkbox'
              checked={isSelect}
              id={`check_${item.id}`}
              onChange={() => {}}
              label=''
            />
          </div>
        )}
        {actionRow && actionRow.length > 0 && (
          <div className='d-inline-block float-md-left'>
            <IconButton aria-label='delete' size='small' onClick={handleClick}>
              <MoreVertIcon id='Actions' />
            </IconButton>
            <Menu
              id='long-menu'
              anchorEl={anchorEl}
              keepMounted
              open={open}
              TransitionComponent={Fade}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5

                }
              }}
            >
              {actionRow.map((el, i) => {
                const _visible = el.actionDisplay(item)
                return _visible ? (
                  <MenuItem
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation()
                      el.actionFunction(item)
                      handleClose()
                    }}
                    dense
                  >
                    {/* <IntlMessages id={el.actionName} /> */}
                    {el.actionName}
                  </MenuItem>
                ) : null
              })}
            </Menu>
          </div>
        )}
      </td>
    </StyledTr>
  )
}

export default Item
