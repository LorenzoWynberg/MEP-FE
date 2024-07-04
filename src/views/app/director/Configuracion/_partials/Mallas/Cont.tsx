import React from 'react'
import { IoMdTrash } from 'react-icons/io'
import { Input } from 'reactstrap'
import colors from 'Assets/js/colors'
import Column from './Col'
import Row from './Row'
import { BsPlusCircleFill } from 'react-icons/bs'

const Cont = ({ columns, changeColor, onDelete, show, addLevel, rows, addIndicator, onChange, onChange2, onDelete2 }) => {
  return (
    <div>
      <div>
        <div
          className='conteiner1'
          style={{ backgroundColor: `${colors.primary}` }}
        >
          <div className='cont-subarea'>
            <h6 className='subarea-text'>Contenido / Subárea</h6>
            <div className='cont-input'>
              <Input className='input' placeholder='Lateralidad' onChange={onChange} />
              <button className='button-inv' onClick={onDelete}>
                {' '}
                <IoMdTrash
                  style={{ fontSize: '40px', color: '#fff' }}
                />{' '}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='conteiner-general'>
        <div className='conteiner2'>
          <div
            className='itm1'
            style={{ backgroundColor: `${colors.primary}` }}
          >
            <h4 style={{ textAlign: 'center' }}>
              Indicador de Aprendizaje
            </h4>
          </div>
          {columns.map((e, i) => {
            return (
              <Column
                key={i}
                id={e.id}
                name={e.label}
                onChange2={onChange}
                color={e.color}
                setColor={changeColor}
                onDelete={onDelete}
                show={show}
                onDelete2={onDelete2}
              />
            )
          })}
          <div
            className='itm5'
            style={{ backgroundColor: `${colors.primary}` }}
          >
            <div onClick={addLevel} className='final-colum'>
              <button className='button-inv'>
                <BsPlusCircleFill
                  style={{ fontSize: '40px', color: '#fff' }}
                />
              </button>
              <h4 style={{ textAlign: 'center' }}>Agregar nivel de aprendizaje</h4>
            </div>
          </div>
        </div>
        {rows.map((e) => {
          return <Row data={e} columns={columns} onDelete={onDelete2} onChange={onChange} />
        })}

        <div className='add-indicador'>
          <button
            onClick={addIndicator}
            className='button-inv'
            style={{ color: `${colors.primary}` }}
          >
            <BsPlusCircleFill
              style={{
                fontSize: '20px',
                color: `${colors.primary}`,
                marginRight: '5px'
              }}
            />
            Agregar indicador de aprendizaje
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cont
