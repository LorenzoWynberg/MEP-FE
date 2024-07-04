import React from 'react'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import { CustomInput, Badge, Button } from 'reactstrap'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Fade from '@material-ui/core/Fade'
import IntlMessages from 'Helpers/IntlMessages'
import { StyledTr } from './styles'

import colors from 'Assets/js/colors'

const Item = ({
  cols,
  item,
  actionRow,
  onCheckItem,
  columnsToShow,
  hideMultipleOptions,
  isSelect,
  showMenu,
  toggleEditModal,
  thumblist,
  startIcon,
  showCursor,
  showLastRow,
  selectedBgColor
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
    <>
      <StyledTr
        className={`whitout-bg-white__radius ${
          showCursor ? 'cursor-pointer' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation()
          e.stopPropagation()
          !anchorEl && toggleEditModal && toggleEditModal(item)
        }}
      >
        {startIcon && (
          <td
            style={{
              borderRadius: 'calc(0.85rem - 1px) 0 0 calc(0.85rem - 1px)',
              padding: 0,
              background: item.itemSelected
                ? selectedBgColor || 'rgba(0,0,0,0.1)'
                : 'white'
            }}
          >
            <StyledStartIcon>
              <div className='iconsContainer'>
                <i
                  className={'far ' + item.faIcon + ' icon-3-fs'}
                  aria-hidden='true'
                />
              </div>
            </StyledStartIcon>
          </td>
        )}
        {thumblist && (
          <td
            style={{
              borderRadius: 'calc(0.85rem - 1px) 0 0 calc(0.85rem - 1px)',
              padding: 0,
              background: item.itemSelected
                ? selectedBgColor || 'rgba(0,0,0,0.1)'
                : 'white'
            }}
          >
            <img
              alt='itemPhoto'
              src={item.img || '/assets/img/profile-pic-generic.png'}
              className='list-thumbnail responsive border-0 card-img-left'
              style={{ height: '5.6rem' }}
            />
          </td>
        )}
        {cols.map((column, i) => {
          if (!columnsToShow.includes(column.column)) return null
          return (
            <td
              key={i}
              style={
                (i === 0 &&
                  !thumblist && {
                  borderRadius: 'calc(0.85rem - 1px) 0 0 calc(0.85rem - 1px)',
                  background: item.itemSelected
                    ? selectedBgColor || 'rgba(0,0,0,0.1)'
                    : 'white'
                }) || {
                  background: item.itemSelected
                    ? selectedBgColor || 'rgba(0,0,0,0.1)'
                    : 'white'
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
                  ? (
                    <Button color={column.color}>{column.placeholder}</Button>
                    )
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
            background: item.itemSelected
              ? selectedBgColor || 'rgba(0,0,0,0.1)'
              : 'white',
            minHeight: '5.6rem',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
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
            {actionRow &&
              actionRow.length > 0 &&
              (!showMenu || (showMenu && showMenu(item))) && (
                <div className='mr-3 mb-2 d-inline-block float-md-left'>
                  <IconButton
                    aria-label='delete'
                    size='medium'
                    onClick={handleClick}
                  >
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
                        maxHeight: 48 * 4.5,
                        width: 200
                      }
                    }}
                  >
                    {actionRow.map((el, i) => {
                      const _visible = el.actionDisplay(item)
                      return _visible
                        ? (
                          <MenuItem
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation()
                              el.actionFunction(item)
                              handleClose()
                            }}
                          >
                            <IntlMessages id={el.actionName} />
                          </MenuItem>
                          )
                        : null
                    })}
                  </Menu>
                </div>
            )}
          </div>
        </td>
      </StyledTr>
      {showLastRow && (
        <StyledTr className='whitout-bg-white__radius'>
          <td
            style={
              (!thumblist && {
                borderRadius: 'calc(0.85rem - 1px) 0 0 calc(0.85rem - 1px)',
                background: item.itemSelected
                  ? selectedBgColor || 'rgba(0,0,0,0.1)'
                  : 'white'
              }) || {
                background: item.itemSelected
                  ? selectedBgColor || 'rgba(0,0,0,0.1)'
                  : 'white'
              }
            }
            colSpan={
              columnsToShow.length +
              (!hideMultipleOptions || (actionRow && actionRow.length) ? 1 : 0)
            }
            align='center'
          >
            Los datos no están completos, por favor mejore su búsqueda.
          </td>
        </StyledTr>
      )}
    </>
  )
}

const StyledStartIcon = styled.div`
  .iconsContainer {
    min-width: 80px;
    margin-right: 1rem;
    color: white;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 90.4px;
    border-radius: 10px 0px 0px 10px;
    background-color: ${colors.primary};
  }
`

export default Item
