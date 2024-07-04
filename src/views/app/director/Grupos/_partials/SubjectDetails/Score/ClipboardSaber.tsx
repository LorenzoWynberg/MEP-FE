import React from 'react'

interface IProps {
  style?: object
}

const ClipBoardSaber:React.FC<IProps> = (props) => {
  return (
    <svg id='MDI_clipboard-check' data-name='MDI / clipboard-check' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style={props.style || {}}>
      <g id='Boundary' fill='#264f7b' stroke='rgba(0,0,0,0)' stroke-width='1' opacity='0'>
        <rect width='24' height='24' stroke='none' />
        <rect x='0.5' y='0.5' width='23' height='23' fill='none' />
      </g>
      <path id='Path_clipboard-check' data-name='Path / clipboard-check' d='M10,17,6,13l1.41-1.41L10,14.17l6.59-6.59L18,9M12,3a1,1,0,1,1-1,1,1,1,0,0,1,1-1m7,0H14.82A2.988,2.988,0,0,0,9.18,3H5A2,2,0,0,0,3,5V19a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V5A2,2,0,0,0,19,3Z' transform='translate(0 1)' fill='#264f7b' />
    </svg>
  )
}

export default ClipBoardSaber
