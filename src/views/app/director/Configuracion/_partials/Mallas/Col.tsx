import React, { useState } from 'react'
import { Input } from 'reactstrap'
import { IoMdTrash } from 'react-icons/io'
import { ChromePicker } from 'react-color'

const Column = (props) => {
  const {
    name,
    onChange,
    color,
    setColor,
    onDelete2,
    id,
    show,
    inputFormColumn
  } = props
  const [showColor, setShowColor] = useState<boolean>(false)

  return (
    <div className='itm4' style={{ backgroundColor: color }}>
      <Input
        className='inputs'
        value={name}
        id={id}
        placeholder='Inciail'
        onChange={onChange}
      />
      <div
        className={
          show ? 'div-conteiner-puntaje' : 'div-conteiner-puntaje-simple'
        }
      >
        <div className={show ? 'div-oculto' : 'div-oculto2'}>
          <Input
            className='input-oculto'
            placeholder='10'
            type='number'
            onChange={inputFormColumn}
          />
          <div style={{ marginLeft: '5px' }}>pts</div>
        </div>
        <div className='div-colum'>
          <button onClick={onDelete2} className='button-inv'>
            {' '}
            <IoMdTrash style={{ fontSize: '40px', color: '#fff' }} />{' '}
          </button>
          <button
            className='btn-color'
            onClick={() => {
              setShowColor(!showColor)
            }}
          />
          <h6 style={{ margin: '5px' }}>Color</h6>
        </div>
      </div>
      {showColor && (
        <ChromePicker
          color={color}
          onChange={(color) => {
            setColor(id, color.hex)
          }}
        />
      )}
    </div>
  )
}

export default Column
