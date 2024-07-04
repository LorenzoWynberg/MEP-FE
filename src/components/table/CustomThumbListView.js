import React from 'react'
import { Card, CustomInput, Badge, Row, Col } from 'reactstrap'
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

const ThumbListView = ({ actionRow, product, isSelect, hideMultipleOptions, collect, onCheckItem, columns, handleCardClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick = event => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  return (
    <Colxx xxs='12' key={product.id} className='mb-3 p-0'>
      <ContextMenuTrigger id='menu_id' data={product.id} collect={collect}>
        <Card
          className={classnames('d-flex flex-row align-items-center cursor-pointer', {
            active: isSelect
          })}
          onClick={() => {
            handleCardClick(product)
          }}
        >
          <Row style={{ width: '100%' }}>
            <Col className='d-flex '>
              {
            product.img
              ? <img
                  onClick={() => {
                    handleCardClick(product)
                  }}
                  alt={product[columns[0].column]}
                  src={product.img}
                  className='list-thumbnail responsive border-0 card-img-left cursor-pointer'
                />
              : product.icon
                ? (
                  <Avatar
                    variant='rounded'
                    className='list-thumbnail icon responsive border-0 card-img-left cursor-pointer'
                    onClick={() => {
                      handleCardClick(product)
                    }}
                  >
                    <i className={product.icon} />
                  </Avatar>
                  )
                : null
          }
            </Col>
            {
                columns.map((column, i) => {
                  const _width = column.width
                  if (column.isBadge) {
                    return (
                      <Col className='d-flex justify-content-start align-items-center w-sm-100 ' style={{ width: `${_width}%` }}>
                        <Badge color={product.statusColor} pill>
                          {product[columns[i].column]}
                        </Badge>
                      </Col>
                    )
                  }
                  return (
                    <Col className='w-sm-100 thumb-column-row' style={{ width: `${_width}%` }}>
                      <p className='thumb-name-column-row'>
                        {columns[i].label}
                      </p>
                      <p className='mb-1  font-weight-medium text-center'>
                        {product[columns[i].column]}
                      </p>
                    </Col>
                  )
                })
              }
            <Col
              className='custom-control custom-checkbox pl-1 pr-3 container-center' onClick={(e) => {
                e.stopPropagation()
                onCheckItem(product.id)
              }}
            >
              {!hideMultipleOptions && <CustomInput
                className='item-check  thumb-checkbox-row'
                type='checkbox'
                id={`check_${product.id}`}
                checked={isSelect}
                                       />}
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
            </Col>
          </Row>

        </Card>
      </ContextMenuTrigger>
    </Colxx>
  )
}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ThumbListView)
