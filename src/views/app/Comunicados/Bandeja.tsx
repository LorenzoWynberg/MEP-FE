import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import 'moment/locale/es'
import { Colxx } from 'Components/common/CustomBootstrap'
import '../../../assets/css/sass/containerStyles/Comunicado.scss'
import { useTranslation } from 'react-i18next'

const Bandeja = (props) => {
  const [selected, setSelected] = useState(null)
  const getIndexSelected = (idx) => setSelected(idx)

  const { t } = useTranslation()

  return (
    <Colxx xxs={props.itemSelected?.bandejaCorreoId ? '3' : '12'} style={{ minHeight: 800, padding: 0 }}>
      <div className='w-100'>
        {!props.data?.length
          ? <div className='w-100'>
            <h4 className='w-100 mt-5 bandejaDiv'>
              {t('comunicados>bandeja_vacia','La bandeja se encuentra vacía')}
            </h4>
          </div>
          : <InfiniteScroll
              dataLength={props.data?.length || 0}
              next={props.fetchMoreData}
              hasMore
              height='88.3vh'
            >
            {props.data?.map((item, index) => {
              return (
                <props.ItemBandeja
                  {...props}
                  handleIndexSelected={(idx) => getIndexSelected(idx)}
                  index={index}
                  enable={selected === index}
                  item={item}
                  selected={
                  (props.itemSelected.id &&
                    item.id === props.itemSelected.id) ||
                  (props.itemSelected.bandejaCorreoId &&
                    props.itemSelected.bandejaCorreoId === item.bandejaCorreoId)
                    ? 'selected'
                    : ''
                }
                  itemSelected={props.itemSelected}
                  state={item.estadoCodigo === '1' ? 'new' : ''}
                  handleItemSelected={props.setItemSelected}
                  restaurarMensaje={props.restaurarMensaje}
                  marcarComoNoLeido={props.marcarComoNoLeido}
                  handleSelectItems={props.handleSelectItems}
                  checked={
                  props.selectedItems?.find(
                    (x) => x.bandejaCorreoId === item.bandejaCorreoId
                  ) !== undefined
                }
                />
              )
            })}
          </InfiniteScroll>}
      </div>
    </Colxx>

  )
}

export default Bandeja
