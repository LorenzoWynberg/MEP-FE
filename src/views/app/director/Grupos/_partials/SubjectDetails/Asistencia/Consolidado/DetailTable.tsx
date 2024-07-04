import React, { useEffect, useState } from 'react'
import { BiCalendar } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useActions } from 'Hooks/useActions'
import { getAssistanceByIdentidadId } from 'Redux/Asistencias/actions'

const DetailTable = ({ selectedPeriod, selectedStudent }) => {
  const { types, currentAssistances } = useSelector(
    (state) => state?.asistencias
  )
  const [assistances, setAssistances] = useState({})
  const actions = useActions({
    getAssistanceByIdentidadId
  })

  useEffect(() => {
    if (selectedStudent?.identidadesId) {
      actions.getAssistanceByIdentidadId([selectedStudent?.identidadesId])
    }
  }, [selectedStudent])

  useEffect(() => {
    if (types.length > 0) {
      const assistancesFormatted = {}
      types.forEach((type) => {
        assistancesFormatted[type?.nombre] = []
      })

      currentAssistances.forEach((el) => {
        assistancesFormatted[el?.datosTipoRegistroAsistencia?.nombre].push(el)
      })
      setAssistances(assistancesFormatted)
    }
  }, [types, currentAssistances])
  return (
    <>
      <div className='espaciado'>
        <span>
          {selectedStudent.nombreCompleto} - {selectedPeriod.nombre}
        </span>
        <div className='fondo'>
          <BiCalendar style={{ fontSize: '18px' }} />
          Total de lecciones impartidas: 20
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <Th style={{ paddingLeft: '5px', borderTopLeftRadius: '5px' }}>
              Tipo de incidencia
            </Th>
            <Th
              style={{
                width: '120px',
                textAlign: 'center',
                paddingLeft: '5px',
                paddingRight: '5px'
              }}
            >
              Cantidad
            </Th>
          </tr>
        </thead>
        <tbody>
          {types.map((type, index) => (
            <tr
              key={type?.nombre}
              style={{
                backgroundColor:
                  index % 2 !== 0 ? 'rgba(236, 236, 236, 0.932)' : ''
              }}
            >
              <Td style={{ paddingLeft: '5px' }}>{type?.nombre}</Td>
              <Td style={{ width: '120px', textAlign: 'center' }}>
                {assistances[type?.nombre]?.length || '-'}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='div-column'>
        <Span>Promedio de asistencias: 83.33%</Span>
        <Span>Promedio de inasistencias: 16.67%</Span>
      </div>
    </>
  )
}

export default DetailTable

const Th = styled.th`
  width: 100%;
  height: 40px;
  max-height: 120px;
  background: #145388;
  color: white;
  border-right: 1px solid #fff;
  border: 1px solid #fff 
  font-weight: lighter;
`
const Td = styled.td`
  height: 40px;
  border: 1px solid lightgrey;
`

const Span = styled.span`
  font-weight: bolder;
  margin-bottom: 3%;
`
