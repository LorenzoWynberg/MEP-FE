import React from 'react'

const LineLoader = (props) => {
  return (
    <svg
      height='30'
      width='250'
    >
      <line className='progress__meter' x1='0' y1='5' x2='240' y2='5' strokeWidth='1' />
      <line x1='0' y1='5' x2={props.progress} y2='5' stroke='#339AD3' strokeWidth='2' />
    </svg>
  )
}

export default LineLoader
