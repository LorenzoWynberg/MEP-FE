import { useMemo } from 'react'
import { getIdentification } from 'Redux/identificacion/actions'
import { useActions } from '../../../../../hooks/useActions'
import {
  loadStudent,
  getStudentDataFilter
} from 'Redux/expedienteEstudiantil/actions'
import { getStudentByIdentification } from 'Redux/matricula/actions'
import { useSelector } from 'react-redux'

const useExpedienteEstudiante = () => {
  const actions = useActions({
    getStudentDataFilter,
    loadStudent,
    getStudentByIdentification,
    getIdentification
  })

  const reduxState = useSelector((store: any) => {
    return {
      identification: store.identification.data,
      expedienteEstudiantil: store.expedienteEstudiantil
    }
  })

  const loadEstudianteInfo = async () => {
    const { data } = await actions.getStudentDataFilter(reduxState.identification.id, 'id')
    if (data.length > 0) loadStudent(data[0])

    await actions.getIdentification(reduxState.identification.id)
  }

  const loadEncargadoInfo = async () => {

  }

  useMemo(async () => {
    if (!reduxState.identification) return

    await loadEstudianteInfo()
    console.log(
      '%c Entro al useMemo!',
      'color:red;font-family:system-ui;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold'
    )
  }, [reduxState.identification.id])

  return {
    expedienteEstudiantil: reduxState.expedienteEstudiantil
  }
}

export default useExpedienteEstudiante
