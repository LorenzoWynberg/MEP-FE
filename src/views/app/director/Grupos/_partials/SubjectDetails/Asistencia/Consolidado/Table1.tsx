import React from 'react'
import styled from 'styled-components'
import '../Asistencia.css'
import { FiInfo } from 'react-icons/fi'
import Tooltip from '@mui/material/Tooltip'

interface IProps {
  periodos: any[]
  student: any[]
  setSelectedStudents: Function
}

const Tabla1 = ({ periodos, students, onSelected }) => {
  return (
    <>
      <div style={{ overflowX: 'scroll' }}>
        <table>
          <thead>
            <tr
              style={{
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <Th>Estudiante</Th>

              <table style={{ display: 'flex', flexDirection: 'column' }}>
                <Th0>
                  <Tooltip title='Se muestran la cantidad de ausencias y tardías versus la cantidad de lecciones impartidas'>
                    <button
                      style={{ color: '#fff', padding: '0' }}
                      className='btn-void'
                    >
                      <FiInfo style={{ marginRight: '5px' }} />
                      Cantidad de ausencias y tardias
                    </button>
                  </Tooltip>
                </Th0>

                <tr style={{ display: 'flex', flexDirection: 'row' }}>
                  {students[0]?.periodos.fechaPeriodoCalendario.map(
                    (periodo, i) => (
                      <Th1 style={{ borderRight: '1px solid #fff' }} key={i}>
                        {periodo.nombre}
                      </Th1>
                    )
                  )}
                </tr>
              </table>
            </tr>
          </thead>
          <tbody />
        </table>
        {students.map((student, i) => (
          <tr>
            <td
              style={{
                borderRight: '2px solid lightgrey',
                borderLeft: '2px solid lightgrey',
                minWidth: '300px',
                width: '300px',
                paddingLeft: '18px'
              }}
            >
              {student.nombreCompleto}
            </td>
            <div>
              <table>
                <tr>
                  {student.periodos.fechaPeriodoCalendario.map((periodo, i) => (
                    <td
                      style={{
                        padding: '10px',
                        borderRight: '2px solid lightgrey'
                      }}
                      key={i}
                    >
                      <button
                        onClick={() => onSelected(student, periodo)}
                        style={{ fontWeight: 'bolder' }}
                        className='btn-green'
                      >
                        2.5 / 20
                      </button>
                    </td>
                  ))}
                </tr>
              </table>
            </div>
          </tr>
        ))}
      </div>
    </>
  )
}

export default Tabla1

const Th0 = styled.th`
  background: #145388;
  color: #fff;
  min-height: 30px;
  min-width: 150px;
  max-width: 100%;
  font-weight: lighter;
  text-align: center;
  padding: 2%;
  font-size: 12px;
`
const Th = styled.th`
  min-width: 300px;
  width: 300px;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  background: #145388;
  color: #fff;
  border-right: 1px solid #fff;
  padding-left: 4%;
`

const Th1 = styled.th`
  background: #145388;
  color: #fff;
  height: 30px;
  min-width: 100px;
  max-width: 150px;
  text-align: center;
  padding: 2%;
  font-weight: lighter;
  font-size: 12px;
  border-top: 1px solid #fff;
`
