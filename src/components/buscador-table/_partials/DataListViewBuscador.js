import React from 'react'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from 'Components/common/CustomBootstrap'
import styled from 'styled-components'

import {
  Badge,
  Card,
  CustomInput
} from 'reactstrap'
const DataListViewBuscador = ({ actionRow, product, isSelect, collect, onCheckItem, columns, toggleModal, hideMultipleOptions, esBuscador }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const PropsBox = styled.p`
    padding-left:${props => props.paddingLeft ? props.paddingLeft : '0px'}; 
    width:${props => props.width + '%'};
    padding-top: 1rem;
    height: ${props => props.height};
    font-size: ${props => props.itemHeading ? '18px' : '14px'};
    text-align: left;
    @media (max-width: 992px) {
      width: '100%';
      text-align: 'left';
    }
  `

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Colxx xxs='12' className='mb-3'>
      <ContextMenuTrigger id='menu_id' data={product} collect={collect}>
        <Card
          className={classnames('d-flex flex-row row-hover-table', {
            active: isSelect
          })}

          onClick={() => {
            const _action = actionRow[0]
            _action.actionFunction(product)
          }}
        >

          <div className='w-100'>
            <div className='pl-2 d-flex flex-grow-1 min-width-zero'>
              <div
                className='card-body align-self-center d-flex flex-column flex-lg-row  min-width-zero align-items-lg-center cursor-pointer'
                onClick={() => toggleModal(product)}
              >
                {columns[0] && <PropsBox width={columns[0].width} height={columns[0].height} itemHeading={false} sum={columns[0].sum}>
                  {product[columns[0].column]}
                </PropsBox>}
                {columns[1] &&
                                    (columns[1].isBadge
                                      ? (<div
                                          className='w-15 w-sm-100' style={{
                                            width: `${columns[1].width + columns[1].sum}%`
                                          }}
                                         >
                                        <Badge color={`${product.statusColor}`} pill>
                                          {product[columns[1].column]}
                                        </Badge>
                                      </div>)
                                      : (
                                        <PropsBox width={columns[1].width} height={columns[1].height} sum={columns[1].sum}>
                                          {product[columns[1].column]}
                                        </PropsBox>))}
                {columns[2] &&
                                    (columns[2].isBadge
                                      ? (<div
                                          className='w-15 w-sm-100' style={{
                                            width: `${columns[2].width + columns[2].sum}%`
                                          }}
                                         >
                                        <Badge color={`${product.statusColor}`} pill>
                                          {product[columns[2].column]}
                                        </Badge>
                                      </div>)
                                      : (
                                        <PropsBox width={columns[2].width} height={columns[2].height} sum={columns[2].sum}>
                                          {product[columns[2].column]}
                                        </PropsBox>))}
                {columns[3] &&
                                    (columns[3].isBadge
                                      ? (<div
                                          className='w-15 w-sm-100' style={{
                                            width: `${columns[3].width + columns[3].sum}%`
                                          }}
                                         >
                                        <Badge color={`${product.statusColor}`} pill>
                                          {product[columns[3].column]}
                                        </Badge>
                                      </div>)
                                      : (
                                        <PropsBox width={columns[3].width} height={columns[3].height} sum={columns[3].sum}>
                                          {product[columns[3].column]}
                                        </PropsBox>))}
                {columns[4] &&
                                    (columns[4].isBadge
                                      ? (<div
                                          className='w-15 w-sm-100' style={{
                                            width: `${columns[4].width + columns[4].sum}%`
                                          }}
                                         >
                                        <Badge color={`${product.statusColor}`} pill>
                                          {product[columns[4].column]}
                                        </Badge>
                                      </div>)
                                      : (
                                        <PropsBox width={columns[4].width} height={columns[4].height} sum={columns[4].sum}>
                                          {product[columns[4].column]}
                                        </PropsBox>))}
                {columns[5] &&
                                    (columns[5].isBadge
                                      ? (<div
                                          className='w-15 w-sm-100' style={{
                                            width: `${columns[5].width + columns[5].sum}%`
                                          }}
                                         >
                                        <Badge color={`${product.statusColor}`} pill>
                                          {product[columns[5].column]}
                                        </Badge>
                                      </div>)
                                      : (
                                        <PropsBox width={columns[5].width} height={columns[5].height} sum={columns[5].sum}>
                                          {product[columns[5].column]}
                                        </PropsBox>))}
              </div>
              <div className=' align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center custom-control custom-checkbox pl-1 pr-4'>
                {
                                    !hideMultipleOptions &&
                                      <div
                                        className='mr-3 mb-2 d-inline-block float-md-left cursor-pointer'
                                        onClick={() => onCheckItem(product.id)}
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

              </div>
            </div>
          </div>

        </Card>
      </ContextMenuTrigger>
    </Colxx>
  )
}

export default React.memo(DataListViewBuscador)
