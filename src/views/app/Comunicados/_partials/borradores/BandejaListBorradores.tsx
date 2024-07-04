import React, { useState } from 'react'
import '../../../../../assets/css/sass/containerStyles/Comunicado.scss'
import { Colxx } from 'Components/common/CustomBootstrap'
import ItemBandeja from './ItemBandejaBorrador'

const BandejaListBorradores = (props) => {
  const [selected, setSelected] = useState(null)
  const getIndexSelected = (idx) => setSelected(idx)

  return (
    <Colxx xxs='3' style={{ minHeight: 800, padding: 0 }}>
      {props.data.map((item, index) => {
        const _selected =
          item.bandejaCorreoId === props.itemSelected.bandejaCorreoId
            ? 'selected'
            : ''

        if (item.estadoCodigo === '1') {
          item.state = 'new'
        } else {
          item.state = 'opened'
        }
        return (
          <ItemBandeja
            handleIndexSelected={(idx) => getIndexSelected(idx)}
            index={index}
            enable={selected === index}
            item={item}
            _selected={_selected}
            handleItemSelected={props.setItemSelected}
          />
        )
      })}
    </Colxx>
  )
}

export default BandejaListBorradores
