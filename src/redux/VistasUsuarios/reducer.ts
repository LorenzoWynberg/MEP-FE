import * as TYPES from './types'

const INITIAL_STATE = {
  // info_academica:[],
  info_general: [],
  horario: [],
  estudiantesEncargado: [],
  estudiantesEncargadoIndex: 0,
  estudianteSeleccionado: { info_academica: [], academiaSeleccionada: {} },
  incidencias: [],
  asistencias: [],
  calificaciones: [],
  usuarioActual: {},
  info_malla: []
}
type ACTION_TYPE = {
    type: string,
    payload: any
}

const tryParse = (stringToParse:string) => {
  try {
    return JSON.parse(stringToParse)
  } catch (ex) {
    console.error('No pudo parsear el campo a JSON')
  }
}

const reducer = (state = INITIAL_STATE, action:ACTION_TYPE) => {
  const { type, payload } = action
  switch (type) {
    case TYPES.SET_HORARIO:{
      return { ...state, horario: payload }
    }
    case TYPES.SET_ALL_INFO_ACADEMICA:{
      const { index, data } = payload
      const newEstudiantesEncargado = [...state.estudiantesEncargado]
      newEstudiantesEncargado[index] = { ...newEstudiantesEncargado[index], info_academica: data }
      return { ...state, estudiantesEncargado: newEstudiantesEncargado }
    }
    case TYPES.SET_SELECTED_ESTUDIANTE_INFO_ACADEMICA:{
      const estudianteSeleccionado = { ...state.estudianteSeleccionado }
      estudianteSeleccionado.info_academica = payload
      return { ...state, estudianteSeleccionado }
    }
    case TYPES.SET_SELECTED_INSTITUTION:{
      const estudianteSeleccionado = { ...state.estudianteSeleccionado }
      estudianteSeleccionado.academiaSeleccionada = payload
      return { ...state, estudianteSeleccionado }
    }
    case TYPES.SET_INFO_GENERAL:{
      return { ...state, info_general: payload }
    }
    case TYPES.SET_ESTUDIANTES_ENCARAGADO:{
      return { ...state, estudiantesEncargado: payload }
    }
    case TYPES.SET_INCIDENCIAS_ESTUDIANTE :{
      return { ...state, incidencias: payload }
    }
    case TYPES.SET_ASISTENCIA_ESTUDIANTE: {
      return { ...state, asistencias: payload }
    }
    case TYPES.SET_CALIFICACIONES_ESTUDIANTE:{
      const calificacion = payload.map(item => {
        if (item.rubricaAprendizaje) { item.rubricaAprendizaje = tryParse(item.rubricaAprendizaje) }

        if (item.componenteclasificacion) { item.componenteclasificacion = tryParse(item.componenteclasificacion) }

        return item
      })
      return { ...state, calificaciones: calificacion }
    }
    case TYPES.SET_USUARIO_ACTUAL:{
      return { ...state, usuarioActual: payload }
    }
    case TYPES.SET_ESTUDIANTE_INDEX:{
      return { ...state, estudiantesEncargadoIndex: payload }
    }
    case TYPES.SET_INFO_MALLA: {
      return {
        ...state, info_malla: payload
      }
    }
    case TYPES.SET_SELECTED_ESTUDIANTE:{
      return {
        ...state, estudianteSeleccionado: { ...state.estudianteSeleccionado, ...payload }
      }
    }
  }
  return state
}

export default reducer
