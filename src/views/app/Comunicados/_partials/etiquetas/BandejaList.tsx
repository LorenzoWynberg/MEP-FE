import React from 'react'

import 'moment/locale/es'
import { Colxx } from 'Components/common/CustomBootstrap'
import ItemBandejaList from './ItemBadejaList'

const BandejaList = (props) => {
  return (
    <Colxx xxs='3' style={{ minHeight: 800, padding: 0 }}>
      {props.data.map((item) => {
        if (item.estadoCodigo === '1') {
          item.state = 'new'
        } else {
          item.state = 'opened'
        }
        return (
          <ItemBandejaList
            {...props}
            data={item}
            marcarComoRecibido={props.marcarComoRecibido}
            enviarPapelera={props.enviarPapelera}
            marcarFavorito={props.marcarFavorito}
          />
        )
      })}
    </Colxx>
  )
}

export default BandejaList
