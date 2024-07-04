import React from 'react'
import { IoMdTrash } from 'react-icons/io'
import { Input } from 'reactstrap'
import colors from 'Assets/js/colors'

const Row = ({ onDelete, columns, data, onChange }) => {
  return (
    <div className='itm-indicador'>
      <div className='itm12-0'>
        <Input
          className='size-input'
          type='textarea'
          name='text'
          id={data.id}
          value={data.name}
          placeholder='Introducción a la etapada de configuración'
          onChange={(event) => onChange(event, 'name')}
        />
      </div>
      {columns.map((e) => {
        return (
          <div className='itm22-0'>
            <Input
              className='size-input'
              type='textarea'
              name='text'
              id={data.id}
              value={data[e.name]}
              placeholder='Incluye conexión a nuestro tema actual de semestre'
              onChange={(event) => onChange(event, e.name)}
            />
          </div>
        )
      })}
      <div className='itm52-0'>
        <button onClick={onDelete} className='button-inv'>
          {' '}
          <IoMdTrash
            style={{ fontSize: '40px', color: `${colors.primary}` }}
          />{' '}
        </button>
      </div>
    </div>
  )
}

export default Row
