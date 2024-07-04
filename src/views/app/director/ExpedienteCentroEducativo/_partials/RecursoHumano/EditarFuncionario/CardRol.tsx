import React from 'react'
import { IoPersonCircleSharp } from 'react-icons/io5'
import { IoMdTrash } from 'react-icons/io'
import './general.css'

const CardRol = ({ rol, onClick, onDelete }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div onClick={onClick} className='div-figura'>
        <div className='figura'>
          <IoPersonCircleSharp
            style={{ fontSize: 70, background: '#145388', color: '#fff' }}
          />
        </div>
        <h5 className='titulo'>{rol}</h5>
      </div>
      <div onClick={onDelete} className='trash'>
        <IoMdTrash style={{ fontSize: 50, color: '#145388' }} />
      </div>
    </div>
  )
}

export default CardRol
