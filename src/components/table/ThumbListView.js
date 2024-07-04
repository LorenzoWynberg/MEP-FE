import React from 'react'
import { Card, CustomInput, Badge } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from '../../components/common/CustomBootstrap'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Fade from '@material-ui/core/Fade'
import IntlMessages from 'Helpers/IntlMessages'
import Avatar from '@material-ui/core/Avatar'

const ThumbListView = ({ actionRow, product, isSelect, collect, onCheckItem, columns }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick = event => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  return (
    <Colxx xxs='12' key={product.id} className='mb-3'>
      <ContextMenuTrigger id='menu_id' data={product.id} collect={collect}>
        <Card
          onClick={() => onCheckItem(product.id)}
          className={classnames('d-flex flex-row align-items-center', {
            active: isSelect
          })}
        >
          {
            product.img &&
              <NavLink to={`?p=${product.id}`} className='d-flex '>
                <img
                  alt={product[columns[0].column]}
                  src={product.img}
                  className='list-thumbnail responsive border-0 card-img-left'
                />
              </NavLink>
          }
          {
            product.icon &&
              <Avatar
                variant='rounded'
                className='list-thumbnail icon responsive border-0 card-img-left'
              >
                <i className={product.icon} />
              </Avatar>
          }
          <div className='d-flex flex-grow-1 min-width-zero'>
            <div className='card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center px-0 p-sm-0 pl-sm-2 pr-sm-2'>
              {
                columns.map((column, i) => {
                  const _width = column.width
                  if (column.isBadge) {
                    return (
                      <div className='d-flex justify-content-center w-sm-100 ' style={{ width: `${_width}%` }}>
                        <Badge color={product.statusColor} pill>
                          {product[columns[i].column]}
                        </Badge>
                      </div>
                    )
                  }
                  return (
                    <div className='w-sm-100 thumb-column-row' style={{ width: `${_width}%` }}>
                      <p className='thumb-name-column-row'>
                        {columns[i].label}
                      </p>
                      <p className='mb-1  font-weight-medium text-center'>
                        {product[columns[i].column]}
                      </p>
                    </div>
                  )
                })
              }

            </div>
            <div className='custom-control custom-checkbox pl-1 pr-3 container-center'>
              <CustomInput
                className='item-check  thumb-checkbox-row'
                type='checkbox'
                id={`check_${product.id}`}
                checked={isSelect}
              />
              {
                actionRow && actionRow.length > 0 &&
                  <div className='thumb-options-row'>
                    <IconButton
                      aria-label='delete' size='medium'
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
                      {
                      actionRow.map((item, i) => {
                        const _visible = item.actionDisplay(product)
                        return (_visible
                          ? <MenuItem
                              key={i}
                              onClick={(e) => { item.actionFunction(product); handleClose() }}
                            >
                            <IntlMessages id={item.actionName} />
                            </MenuItem>
                          : null
                        )
                      }
                      )
                    }
                    </Menu>
                  </div>

              }
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  )
}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ThumbListView)
