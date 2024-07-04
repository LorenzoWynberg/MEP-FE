import React from 'react'
import ClipBoardSaber from './ClipboardSaber'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
interface IProps {
    students: any[]
    objectives: any[]
    selectedPeriod: any
    handleModal: (data: object) => void
    handleRubricaModalConsolidado: (value: object) => void
    setCurrentStudent: (value: any) => void
    setIdx: (value: number) => void
    setCurrentContenidos: (value: array) => void
    scores: any[]
}

export const FormativeComponents: React.FC<IProps> = (props) => {
  return (
    <table className='mallasTable'>
      <col />
      <colgroup span='1' />
      <colgroup span='2' />
      <thead>
        <tr className='textCenter'>
          <th colspan='1' scope='colgroup' />
          <th colspan={props.objectives?.length} scope='colgroup'>Indicadores de aprendizaje esperado</th>
        </tr>
        <tr className='grayBackground textCenter'>
          <th scope='col'>Estudiante</th>
          {props.objectives?.map(objective => {
            return (
              <th scope='col'>{objective.nombre}</th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {
                    props.students.map((student, idx) => {
                      return (
                        <tr className='textCenter'>
                          <td
                            scope='row' className='cursor-pointer' onClick={() => {
                              const qualified = props.scores?.filter(el => el.asignaturaGrupoEstudianteMatriculado_Id === student.id && el.fechaPeriodoCalendarioId === props.selectedPeriod.id)
                              const parsedjsonData = { selectedIds: [], observaciones: {} }
                              qualified.forEach(el => {
                                parsedjsonData.selectedIds = [...parsedjsonData.selectedIds, el.calificacionParsed.selectedIds]
                                parsedjsonData.observaciones = { ...parsedjsonData.observaciones, ...el.calificacionParsed.observaciones }
                              })
                              props.handleRubricaModalConsolidado({ jsonData: JSON.stringify(parsedjsonData), student, objectiveIdx: null, id: null })
                              props.setCurrentStudent(student)
                              props.setCurrentContenidos(props.objectives)
                            }}
                          >
                            {`${student.datosIdentidadEstudiante.nombre} ${student.datosIdentidadEstudiante.primerApellido} ${student.datosIdentidadEstudiante.segundoApellido}`}
                          </td>
                          {
                                    props.objectives?.map((objective: any) => {
                                      const qualified = props.scores?.find(el => el.asignaturaGrupoEstudianteMatriculado_Id === student.Id && el.calificacionParsed.objectiveIdx === objective.id)
                                      return (
                                        <td onClick={() => {
                                          if (qualified) {
                                            props.handleModal({ ...objective, jsonData: qualified.calificaciones, student, objectiveIdx: objective.id, id: qualified.asignaturaGrupoEstudianteCalificaciones_Id })
                                            props.setCurrentStudent(student)
                                            props.setIdx(idx)
                                          } else {
                                            props.handleModal({ ...objective, student, objectiveIdx: objective.id, id: null })
                                            props.setCurrentStudent(student)
                                            props.setIdx(idx)
                                          }
                                        }}
                                        >{qualified && qualified?.calificacionParsed?.selectedIds && qualified?.calificacionParsed?.selectedIds.length > 0 ? <ClipBoardSaber style={{ backgroundColor: 'white' }} /> : <HourglassEmptyIcon color='primary' />}
                                        </td>
                                      )
                                    })
                                }
                        </tr>
                      )
                    })
                }
      </tbody>
    </table>
  )
}
