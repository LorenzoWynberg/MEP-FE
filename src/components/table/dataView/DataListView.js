import React from 'react'
import { Card, Badge, UncontrolledTooltip } from 'reactstrap'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from 'Components/common/CustomBootstrap'

import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'

const DataListView = ({ multiSelect, onSelectRow, onSelectRowDelete, product, isSelect, collect, onCheckItem, columns, toggleModal }) => {
  return (
    <Colxx xxs='12' className='mb-3'>
      <ContextMenuTrigger id='menu_id' data={product} collect={collect}>
        <Card
          onDoubleClick={() => {
            multiSelect &&
              onCheckItem(product.id)
          }}
          className={classnames('d-flex flex-row', {
            active: isSelect
          })}
        >
          <div className='w-100'>
            <div className='pl-2 d-flex flex-grow-1 min-width-zero'>
              <div className='align-self-center pr-2'>
                {
                  multiSelect &&
                    <Checkbox
                      color='primary'
                      id={`check_${product.id}`}
                      checked={isSelect}
                      onChange={() => {
                        onCheckItem(product.id)
                      }}
                    />
                }

              </div>
              <div className='card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center'>
                <p className='list-item-heading mb-1 truncate w-40 w-sm-100'>
                  {columns[0] && product[columns[0].column]}
                </p>

                <p className='mb-1 text-muted text-small w-15 w-sm-100'>
                  {columns[1] && product[columns[1].column]}
                </p>
                <p className='mb-1 text-muted text-small w-15 w-sm-100'>
                  {columns[2] && product[columns[2].column]}
                </p>
                <p className='mb-1 text-muted text-small w-15 w-sm-100'>
                  {columns[3] && product[columns[3].column]}
                </p>
                <div className='w-15 w-sm-100'>
                  {product.status && <Badge color={product.statusColor} pill>
                    {product.status}
                  </Badge>}
                </div>
              </div>
              <div className=' align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center custom-control custom-checkbox pl-1 pr-4'>
                <div className='mr-3 mb-2 d-inline-block float-md-left'>
                  <IconButton
                    aria-label='view' color='primary' className='mr-2 view-icon' size='small'
                    onClick={() => {
                      onCheckItem(product.id)
                      onSelectRow(product.id)
                      toggleModal()
                    }}
                  >
                    <i className='simple-icon-eye' id='view' />
                    <UncontrolledTooltip placement='bottom' target='view'>
                      Ver
                    </UncontrolledTooltip>
                  </IconButton>
                  <IconButton
                    aria-label='edit' color='primary' className='mr-2' size='small'
                    onClick={() => {
                      onSelectRow(product.id)
                      onCheckItem(product.id)
                      toggleModal()
                    }}
                  >
                    <i className='simple-icon-pencil' id='edit' />
                    <UncontrolledTooltip placement='bottom' target='edit'>
                      Editar
                    </UncontrolledTooltip>
                  </IconButton>
                  <IconButton
                    aria-label='delete' color='primary' className='mr-2' size='small'
                    onClick={() => {
                      onSelectRowDelete(product.id)
                    }}
                  >
                    <i className='simple-icon-trash' id='delete' />
                    <UncontrolledTooltip placement='bottom' target='delete'>
                      Eliminar
                    </UncontrolledTooltip>
                  </IconButton>

                </div>
              </div>
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  )
}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(DataListView)
