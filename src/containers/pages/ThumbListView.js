import React from 'react'
import { Card, CustomInput, Badge } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { ContextMenuTrigger } from 'react-contextmenu'
import { Colxx } from '../../components/common/CustomBootstrap'

const ThumbListView = ({ product, isSelect, collect, onCheckItem, columns }) => {
  return (
    <Colxx xxs='12' key={product.id} className='mb-3'>
      <ContextMenuTrigger id='menu_id' data={product.id} collect={collect}>
        <Card
          onClick={() => onCheckItem(product.id)}
          className={classnames('d-flex flex-row', {
            active: isSelect
          })}
        >
          <NavLink to={`?p=${product.id}`} className='d-flex'>
            <img
              alt={product[columns[0].column]}
              src={product.img}
              className='list-thumbnail responsive border-0 card-img-left'
            />
          </NavLink>
          <div className='pl-2 d-flex flex-grow-1 min-width-zero'>
            <div className='card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center'>
              <NavLink to={`?p=${product.id}`} className='w-40 w-sm-100'>
                <p className='list-item-heading mb-1 truncate'>
                  {product[columns[0].column]}
                </p>
              </NavLink>
              <p className='mb-1 text-muted text-small w-15 w-sm-100'>
                {product[columns[1].column]}
              </p>
              <p className='mb-1 text-muted text-small w-15 w-sm-100'>
                {product.date}
              </p>
              <div className='w-15 w-sm-100'>
                <Badge color={product.statusColor} pill>
                  {product.status}
                </Badge>
              </div>
            </div>
            <div className='custom-control custom-checkbox pl-1 align-self-center pr-4'>
              <CustomInput
                className='item-check mb-0'
                type='checkbox'
                id={`check_${product.id}`}
                checked={isSelect}
              />
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  )
}

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ThumbListView)
