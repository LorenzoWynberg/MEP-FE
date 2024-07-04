import React from 'react'

import 'moment/locale/es'
import { Colxx } from 'Components/common/CustomBootstrap'
import ItemBadejaListProgramado from './ItemBadejaListProgramado'

const BandejaListProgramado = (props) => {
  return (
    <Colxx xxs='3' style={{ minHeight: 800, padding: 0 }}>
      {props.data.map((item) => {
        if (item.estadoCodigo === '1') {
          item.state = 'new'
        } else {
          item.state = 'opened'
        }
        return <ItemBadejaListProgramado {...props} data={item} />
      })}
    </Colxx>
  )
}

export default BandejaListProgramado
