import React from 'react'
import { Card, CustomInput, Badge } from 'reactstrap'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from '../../components/common/CustomBootstrap'

const DataListView = ({ product, isSelect, collect, onCheckItem, columns, toggleModal }) => {
  return (
    <Colxx xxs='12' className='mb-3'>
      <ContextMenuTrigger id='menu_id' data={product} collect={collect}>
        <Card
          onClick={() => {
            onCheckItem(product.id)
            toggleModal()
          }}
          className={classnames('d-flex flex-row', {
            active: isSelect
          })}
        >
          <div className='w-100'>
            <div className='pl-2 d-flex flex-grow-1 min-width-zero'>
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
              <div className='custom-control custom-checkbox pl-1 align-self-center pr-4'>
                <CustomInput
                  className='item-check mb-0'
                  type='checkbox'
                  id={`check_${product.id}`}
                  checked={isSelect}
                  onChange={() => {}}
                  label=''
                />
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
