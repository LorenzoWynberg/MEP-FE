import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import {
  getAllAttendanceByGroup,
  getAllAttendanceBySubjectGroup,
  getAssistanceTypes
} from 'Redux/Asistencias/actions'
import { useActions } from 'Hooks/useActions'
import { uniqBy } from 'lodash'
import LoaderContainer from 'Components/LoaderContainer'

import AsistenciasLanding from '../AsistenciasLanding'
import ModalHistorial from '../Historial'
import DetailTable from './DetailTable'
import TableEstudiantes from './TableEstudiantes'

interface IProps {
  groupId: number
  students: any[]
  type: 'group' | 'subjectGroup'
}

const Consolidado: React.FC<IProps> = (props) => {
  const { groupId, students, type } = props
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const periodosBloques = useSelector((state: any) => state.grupos.bloques)

  const asistencias = useSelector((state: any) => state.asistencias.consolidado)

  const onSelected = (student, period) => {
    const filtrarS = data.find((e) => e.id === student.id)
    setSelectedStudent(filtrarS)
    setSelectedPeriod(period)
  }

  const actions = useActions({
    getAllAttendanceByGroup,
    getAssistanceTypes,
    getAllAttendanceBySubjectGroup
  })

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      if (type === 'group') {
        await actions.getAllAttendanceByGroup(groupId)
      } else {
        await actions.getAllAttendanceBySubjectGroup(groupId)
      }
      setLoading(false)
    }
    fetch()
  }, [groupId])

  useEffect(() => {
    if (asistencias.length > 0) {
      const _data = asistencias.map((item) => {
        return {
          ...item,
          nombreCompleto:
            item.datosIdentidadEstudiante?.nombre +
            ' ' +
            item.datosIdentidadEstudiante?.primerApellido +
            ' ' +
            item.datosIdentidadEstudiante?.segundoApellido,
          periodos: item.datosPeriodo
        }
      })

      const _dataGroup = uniqBy(_data, 'identidadesId')

      setData(_dataGroup)
    }
  }, [asistencias])

  useEffect(() => {
    actions.getAssistanceTypes()
  }, [])

  return (
    <>
      <Grid container spacing={1} className='mb-5'>
        <Grid
          item
          component={Card}
          style={{
            margin: 16
          }}
        >
          <CardContent style={{ marginTop: '1.7rem' }}>
            <CardHeader>
              <CardHeaderLabel>Consolidado</CardHeaderLabel>
            </CardHeader>
            <TableEstudiantes
              onSelected={onSelected}
              periods={periodosBloques || []}
              dataPeriods={data || []}
              students={students || []}
            />
            {loading && <LoaderContainer />}
          </CardContent>
        </Grid>
        <Grid
          item
          xs
          component={Card}
          style={{
            margin: 16
          }}
        >
          <CardContent>
            <CardHeader>
              <CardHeaderLabel>
                Historial de asistencia del estudiante
              </CardHeaderLabel>
              <ModalHistorial />
            </CardHeader>

            {selectedStudent
              ? (
                <DetailTable
                  selectedPeriod={selectedPeriod}
                  selectedStudent={selectedStudent}
                />
                )
              : (
                <AsistenciasLanding
                  txt='Selecciona un estudiante para ver sus incidencias'
                />
                )}
          </CardContent>
        </Grid>
      </Grid>
    </>
  )
}
Consolidado.defaultProps = {
  type: 'group'
}

export default Consolidado

const CardHeader = styled.div`
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const CardHeaderLabel = styled.h4`
  margin: 0;
  span {
    width: 100%;
    position: relative;
    float: left;
    font-size: 12px;
    color: #908a8a;
    font-weight: 600;
  }
`
