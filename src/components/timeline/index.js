import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'

import './style.scss'

import {
  Container
} from 'reactstrap'

import ScrollMenu from 'react-horizontal-scrolling-menu'

const getItemsSorted = (items) => {
  const itemsSorted = items.sort((a, b) => {
    return new Date(a.fecha) - new Date(b.fecha)
  })

  return itemsSorted
}

const TimeLineItem = ({ item, idx, nitems, selected }) => {
  return (
    <div
      className={`menu-item ${(idx % 2 === 0) ? 'bottom' : 'top'} ${(idx === (nitems - 1)) ? 'last' : ''} ${selected || idx === (nitems - 1) ? 'active' : ''}`}
    >
      <Typography
        variant='h6'
        noWrap
      >
        {item.institucion.toUpperCase()}
      </Typography>
      <p>{item.nivel}</p>
      <p>{item.anioEducativo}</p>
      <p>{item.grupo}</p>
      <div className='timeline-circle' />
    </div>

  )
}

const TimelineList = (list, selected) =>
  list.map((item, idx) => {
    return <TimeLineItem key={'item' + idx} item={item} idx={idx} nitems={list.length} selected={selected} />
  })

// Arrow left
// arrow right
const Arrow = ({ side, className }) => {
  return (
    <div
      className={className}
    >
      <div className={`timeline-arrow timeline-arrow-${side}`}>
        <div className={`arrow arrow-${side}`} />
      </div>
    </div>
  )
}

const ArrowLeft = Arrow({ side: 'left', className: 'arrow-prev' })
const ArrowRight = Arrow({ side: 'right', className: 'arrow-next' })

const Timeline = (props) => {
  // Debe recibir la propiedad items para su uso
  const [items, setItems] = useState(getItemsSorted(props.items)) // Or para tomar data de prueba,
  const [selected, setSelected] = useState('item0')

  const timeLine = TimelineList(items, selected)

  const onSelect = key => {
    setSelected(key)

    const idx = parseInt(key.substring(4, key.length))

    props.handleClick(items[idx])
  }

  return (
    <Container>
      <div className='timeline-container'>
        <ScrollMenu
          data={timeLine}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          selected={selected}
          onSelect={onSelect}
        />
      </div>
    </Container>
  )
}

export default Timeline
