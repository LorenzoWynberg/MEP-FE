import { useState } from 'react'
import {
  setUsuarioActual,
  getInfoAcademica,
  setEstudiantesDeEncargado,
  getIdentidadById,
  setEstudianteSeleccionado,
  getSelectedEstudianteInfoAcademica,
  setSelectedAcademia,
  setHorario
} from 'Redux/VistasUsuarios/actions'

import { useSelector, useDispatch } from 'react-redux'
import { useActions } from 'Hooks/useActions'

import {
  getIdentification,
  getHistorialMatriculaEstudiante
} from 'Redux/identificacion/actions'

import {
  loadStudent,
  getStudentDataFilter
} from 'Redux/expedienteEstudiantil/actions'

const useVistasUsuarios = () => {
  const dispatch = useDispatch()
  const actions = useActions({
    setUsuarioActual,
    getInfoAcademica,
    setEstudiantesDeEncargado,
    getIdentidadById,
    loadStudent,
    getIdentification,
    getStudentDataFilter,
    getHistorialMatriculaEstudiante,
    getSelectedEstudianteInfoAcademica,
    setHorario
  })

  const [estudianteIndex, setEstudianteIndex] = useState<number>(0)
  const reduxState = useSelector((store: any) => {
    return {
      accessRole: store.authUser.currentRoleOrganizacion.accessRole,
      estudiantesEncargadoIndex:
				store.VistasUsuarios.estudiantesEncargadoIndex
    }
  })

  const loadEncargadoData = async () => {
    const usuarioActual = await actions.setUsuarioActual()
    const estudiantesEncargado = await actions.setEstudiantesDeEncargado(
      usuarioActual.id
    )
    estudiantesEncargado.forEach((e, index) => {
      actions.getInfoAcademica(e.id, index)
    })
  }

  const loadEstudianteData = async () => {
    if (reduxState?.accessRole?.rolNombre !== 'ESTUDIANTE') return

    const usuarioActual = await actions.setUsuarioActual()
    const identidad = await actions.getIdentidadById(usuarioActual.id)
    setEstudianteSeleccionadoEvent(identidad)
  }
  const setEstudianteSeleccionadoEvent = (data: any) => {
    dispatch(setEstudianteSeleccionado(data))

    const fetch = async () => {
      await actions.getInfoAcademica(data?.id, 1, 100)
      await actions.getIdentification(data?.id)
      await actions.getIdentidadById(data?.id)
      await actions.getHistorialMatriculaEstudiante(data?.id)
      if (!data.info_academica) { await actions.getSelectedEstudianteInfoAcademica(data?.id) }

      const { data: dataResponse } = await actions.getStudentDataFilter(
        data?.id,
        'id'
      )
      console.log(dataResponse, 'DATA RESPONSE')
      if (dataResponse.length > 0) await loadStudent(dataResponse[0])
    }
    fetch()
  }
  const setSelectedAcademiaEvent = (data: any) => {
    dispatch(setSelectedAcademia(data))
  }
  const setHorarioEvent = (idEstudiante, idInstitucion) => {
    actions.setHorario(idEstudiante, idInstitucion)
  }

  return {
    estudianteIndex,
    setEstudianteIndex,
    loadEncargadoData,
    loadEstudianteData,
    setEstudianteSeleccionadoEvent,
    setSelectedAcademiaEvent,
    setHorarioEvent
  }
}

export default useVistasUsuarios
