import React from 'react'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from '../../components/common/CustomBootstrap'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Fade from '@material-ui/core/Fade'
import IntlMessages from 'Helpers/IntlMessages'

import {
  Badge,
  Card,
  CustomInput
} from 'reactstrap'
const DataListView = ({ actionRow, product, isSelect, collect, showMenu, onCheckItem, columns, toggleModal, hideMultipleOptions, index }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const currentUser = localStorage.getItem('persist:auth-username')
  const open = Boolean(anchorEl)

  const handleClick = event => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Colxx xxs='12' className='mb-3'>
      <ContextMenuTrigger id='menu_id' data={product} collect={collect}>
        <Card
          className={classnames('d-flex flex-row', {
            active: isSelect
          })}

        >
          <div className='w-100'>
            <div className='pl-2 d-flex flex-grow-1 min-width-zero'>
              <div
                onClick={() => toggleModal(product)}
                className='card-body align-self-center d-flex flex-column flex-lg-row min-width-zero align-items-lg-center cursor-pointer'
              >
                {columns[0] && <PropsBox columns={columns} width={columns[0].width} height={columns[0].height} itemHeading sum={columns[0].sum}>
                  {product[columns[0].column]}
                </PropsBox>}
                {columns[1] &&
                  (columns[1].isBadge
                    ? (<PropsBox columns={columns} width={columns[1].width} height={columns[1].height} sum={columns[1].sum}>
                      <Badge color={`${product.statusColor}`} pill>
                        {product[columns[1].column]}
                      </Badge>
                       </PropsBox>)
                    : (
                      <PropsBox columns={columns} width={columns[1].width} height={columns[1].height} sum={columns[1].sum}>
                        {product[columns[1].column]}
                      </PropsBox>))}
                {columns[2] &&
                  (columns[2].isBadge
                    ? (<PropsBox columns={columns} width={columns[2].width} height={columns[2].height} sum={columns[2].sum}>
                      <Badge color={`${product.statusColor}`} pill>
                        {product[columns[2].column]}
                      </Badge>
                       </PropsBox>)
                    : (
                      <PropsBox columns={columns} width={columns[2].width} height={columns[2].height} sum={columns[2].sum}>
                        {product[columns[2].column]}
                      </PropsBox>))}
                {columns[3] &&
                  (columns[3].isBadge
                    ? (<PropsBox columns={columns} width={columns[3].width} height={columns[3].height} sum={columns[3].sum}>
                      <Badge color={`${product.statusColor}`} pill>
                        {product[columns[3].column]}
                      </Badge>
                       </PropsBox>)
                    : (
                      <PropsBox columns={columns} width={columns[3].width} height={columns[3].height} sum={columns[3].sum}>
                        {product[columns[3].column]}
                      </PropsBox>))}
                {columns[4] &&
                  (columns[4].isBadge
                    ? (<PropsBox columns={columns} width={columns[4].width} height={columns[4].height} sum={columns[4].sum}>
                      <Badge color={`${product.statusColor}`} pill>
                        {product[columns[4].column]}
                      </Badge>
                       </PropsBox>)
                    : (
                      <PropsBox columns={columns} width={columns[4].width} height={columns[4].height} sum={columns[4].sum}>
                        {product[columns[4].column]}
                      </PropsBox>))}
                {columns[5] &&
                  (columns[5].isBadge
                    ? (<PropsBox columns={columns} width={columns[5].width} height={columns[5].height} sum={columns[5].sum}>
                      <Badge color={`${product.statusColor}`} pill>
                        {product[columns[5].column]}
                      </Badge>
                       </PropsBox>)
                    : (
                      <PropsBox columns={columns} width={columns[5].width} height={columns[5].height} sum={columns[5].sum}>
                        {product[columns[5].column]}
                      </PropsBox>))}
                <div className=' align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center custom-control custom-checkbox pl-1 pr-4'>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {
                    !hideMultipleOptions &&
                      <div
                        className='mb-2 d-inline-block float-md-left cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation()
                          onCheckItem(product.id)
                        }}
                      >
                        <CustomInput
                          className='item-check mb-0 '
                          type='checkbox'
                          checked={isSelect}
                          id={`check_${product.id}`}
                          onChange={() => { }}
                          label=''
                        />
                      </div>
                  }
                    {
                    actionRow && actionRow.length > 0 && (!showMenu || showMenu && showMenu(product)) &&
                      <div className='mr-3 mb-2 d-inline-block float-md-left'>
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
                            const _visible = item.actionDisplay(product, index)
                            return (_visible
                              ? <MenuItem
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    item.actionFunction(product)
                                    handleClose()
                                  }}
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
              </div>
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  )
}

const PropsBox = styled.p`
    padding-top: 1rem;
    height: ${props => props.height};
    ${props => !props.restW ? `width: ${props.width ? props.width + (props.sum ? props.sum : 0) : 100 / props.columns.length + 1}%` : ''};
    font-size: ${props => props.itemHeading ? '18px' : '14px'};
    text-align: left;
    @media (max-width: 992px) {
      width: '100%';
      text-align: 'left';
    }
  `
const PropsDiv = styled.div`
  padding-top: 1rem;
  height: ${props => props.height || '100%'};
  ${props => !props.restW ? `width: ${props.width ? props.width + (props.sum ? props.sum : 0) : 100 / props.columns.length + 1}%` : ''};
  font-size: ${props => props.itemHeading ? '18px' : '14px'};
  text-align: left;
  @media (max-width: 992px) {
    width: '100%';
    text-align: 'left';
  }
`

export default React.memo(DataListView)
