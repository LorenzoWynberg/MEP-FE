import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import '../Asistencia.css'
import { FiInfo } from 'react-icons/fi'
import Tooltip from '@mui/material/Tooltip'
import colors from 'Assets/js/colors'

interface IProps {
  students: any[]
  periods: any[]
  dataPeriods: any[]
  onSelected: any
}

const TableEstudiantes: React.FC<IProps> = (props) => {
  const { students, dataPeriods, periods, onSelected } = props
  const [data, setData] = useState<any[any]>([])

  useEffect(() => {
    setData(dataPeriods)
  }, [dataPeriods])

  const dataParse = () => {
    const _periods = []
    const rows = []
    periods.map((period, i) => {
      const _cantLectionByPeriod = dataPeriods.filter(
        (x) => x.datosPeriodo
      ).length
    })
    students.forEach((student) => {
      dataPeriods.forEach((dataPeriod) => {
        if (dataPeriod.identidadEstudianteId === student.id) {
          rows.push({
            nombreCompleto: student.nombreCompleto,
            periods: [periods]
          })
        }
      })
    })
  }
  return (
    <>
      <Table>
        <SectionStudents>
          <TableHeader style={{ paddingLeft: '10px' }}>Estudiantes</TableHeader>
          <Rows>
            {data.map((student, i) => (
              <Row key={i}>{student.nombreCompleto}</Row>
            ))}
          </Rows>
        </SectionStudents>
        <SectionPeriods>
          <TableHeader
            style={{
              height: '56px',
              marginBottom: '1.5px'
            }}
          >
            <Tooltip title='Se muestran la cantidad de ausencias y tardías versus la cantidad de lecciones impartidas'>
              <TableSubHeader>
                <FiInfo
                  style={{
                    height: '2rem',
                    marginRight: '3px',
                    fontSize: '22px'
                  }}
                />
                Cantidad de ausencias y tardías
              </TableSubHeader>
            </Tooltip>
          </TableHeader>
          <ContentPeriods>
            <Periods style={{ height: '2rem' }}>
              {periods.map((periodo, i) => (
                <Period key={i}>{periodo.nombre}</Period>
              ))}
            </Periods>
            <Rows>
              {data.map((periodoData, i) => (
                <Row key={i}>
                  {' '}
                  {periods.map((periodo, i) => (
                    <Period key={i}>
                      <button
                        onClick={() => onSelected(student, periodo)}
                        style={{ fontWeight: 'bolder' }}
                        className='btn-green'
                      >
                        2.5 / {data.length}
                      </button>

                      {periodoData.periodo.Id}
                    </Period>
                  ))}
                </Row>
              ))}
            </Rows>
          </ContentPeriods>
        </SectionPeriods>
        {!data.length && <div>No se ha registrado asistencias </div>}
      </Table>
    </>
  )
}

export default TableEstudiantes

const Table = styled.div`
  display: grid;
  grid-template-columns: 65% 35%;
  grid-column-gap: 1px;
  margin-top: 1.5rem;
`
const SectionStudents = styled.div`
  width: 100%;
  overflow: hidden;
`
const SectionPeriods = styled.div`
  width: 100%;
`
const TableHeader = styled.div`
  color: #fff;
  width: 100%;
  align-items: center;
  display: flex;
  flex-flow: wrap;
  flex-direction: row;
  gap: 2px;
  height: 90px;
  margin-bottom: 5px;
  background: ${colors.primary};
`
const TableSubHeader = styled.div`
  display: flex;
  flex-flow: row;
  width: 100%;
  padding: 5px;
  position: -webkit-sticky;
  position: sticky;
`
const ContentPeriods = styled.div`
  overflow-x: scroll;
  width: 100%;
`
const Periods = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 2px;
  text-align: center;
`
const Period = styled.div`
  background: ${colors.primary};
  color: #fff;
  padding: 5px;
  min-width: 130px;
`
const Row = styled.div`
  height: 30px;
  width: 100%;
  display: flex;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  align-items: center;
`
const Rows = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  > ${Row}:nth-child(2n) {
    background: ${colors.gray};
  }
`
