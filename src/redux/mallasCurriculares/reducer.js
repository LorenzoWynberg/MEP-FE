import {
  LOAD_MALLA,
  LOAD_MALLAS_PAGINATED,
  LOAD_MALLA_ASIGNATURA,
  LOAD_MALLA_NIVELES_OFERTA,
  LOAD_MALLA_NIVELES_EDITED,
  LOAD_MALLA_EDITED,
  LOAD_MALLA_PERIODO_BLOQUES,
  LOAD_MALLA_COMPONENTS,
  MALLA_REMOVE_MALLA_ASIGNATURA,
  MALLAS_CLEAN_BLOQUES,
  MALLA_LOAD_MALLAS_INSTITUCION,
  MALLA_LOAD_MALLAS_ASIGNATURAS_INSTITUCION,
  MALLA_LOAD_CURRENT_MALLAS_ASIGNATURAS_INSTITUCION
} from './types'

const INITIAL_STATE = {
  currentMalla: {
    mallaCurricularAsignatura: []
  },
  currenNivelesOferta: [],
  currentMallaAsignatura: {},
  mallasInstitucion: [],
  bloquesPeriodos: [],
  mallasAsignaturasInstitucion: [],
  currentMallaAsignaturaInstitucion: {},
  mallas: {
    entityList: []
  }
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MALLA_LOAD_CURRENT_MALLAS_ASIGNATURAS_INSTITUCION:
      return { ...state, currentMallaAsignaturaInstitucion: action.payload }
    case MALLA_LOAD_MALLAS_ASIGNATURAS_INSTITUCION:
      // const newMallasAsignaturasInstitucion = [...state.mallasAsignaturasInstitucion]
      // const index = newMallasAsignaturasInstitucion.findIndex((el) => el?.id === action.payload?.id)
      // if (index !== -1) {
      //     newMallasAsignaturasInstitucion[index] = action.payload;
      // }
      return { ...state, mallasAsignaturasInstitucion: action.payload }
    case MALLA_LOAD_MALLAS_INSTITUCION:
      return { ...state, mallasInstitucion: action.payload }
    case MALLAS_CLEAN_BLOQUES:
      return { ...state, bloquesPeriodos: [] }
    case MALLA_REMOVE_MALLA_ASIGNATURA:
      return { ...state, currentMalla: { ...state.currentMalla, mallaCurricularAsignatura: state.currentMalla.mallaCurricularAsignatura.filter(el => !action.payload.includes(el.id)) } }
    case LOAD_MALLA_PERIODO_BLOQUES:
      return { ...state, bloquesPeriodos: action.payload }
    case LOAD_MALLA_COMPONENTS:
      return { ...state, currentMallaAsignatura: { ...state.currentMallaAsignatura, asignaturaMallaComponenteCalificacion: action.payload } }
    case LOAD_MALLA_EDITED:
      return { ...state, currentMalla: { ...state.currentMalla, ...action.payload } }
    case LOAD_MALLA_NIVELES_EDITED:
      const mallaCurricularAsignatura = []
      state.currentMalla.mallaCurricularAsignatura.forEach((item) => {
        if (item.id === action.payload.id) {
          mallaCurricularAsignatura.push({ ...item, ...action.payload })
        } else {
          mallaCurricularAsignatura.push({ ...item })
        }
      })
      return { ...state, currentMalla: { ...state.currentMalla, mallaCurricularAsignatura }, currentMallaAsignatura: action.payload }
    case LOAD_MALLA_NIVELES_OFERTA:
      return { ...state, currenNivelesOferta: action.payload }
    case LOAD_MALLA_ASIGNATURA:
      const aux = state.currentMalla.mallaCurricularAsignatura ? [...state.currentMalla.mallaCurricularAsignatura, action.payload] : [action.payload]
      return { ...state, currentMalla: { ...state.currentMalla, mallaCurricularAsignatura: aux }, currentMallaAsignatura: action.payload }
    case LOAD_MALLAS_PAGINATED:
      return { ...state, mallas: action.payload }
    case LOAD_MALLA:
      return { ...state, currentMalla: action.payload }
    default:
      return state
  }
}
