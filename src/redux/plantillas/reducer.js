import { PLANTILLAS_CREATE, PLANTILLAS_DELETE, PLANTILLAS_LOAD, PLANTILLAS_ERROR, PLANTILLAS_LOADING, PLANTILLAS_PROFILES_LOAD, PLANTILLAS_SECTIONS_LOAD } from './plantillasTypes'

const INITIAL_STATE = {
  plantillas: [],
  loadingPlantillas: false,
  perfiles: [],
  secciones: [],
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PLANTILLAS_LOAD:
      return {
        ...state,
        plantillas: action.payload,
        loadingPlantillas: false,
        error: ''
      }

    case PLANTILLAS_CREATE:
      return {
        ...state,
        plantillas: [...state.plantillas, { ...action.payload, id: action.payload.plantillaId }],
        loadingPlantillas: false,
        error: ''
      }
    case PLANTILLAS_DELETE:
      return {
        ...state,
        plantillas: state.plantillas.filter(plantilla => plantilla.id !== action.payload),
        loadingPlantillas: false,
        error: ''
      }

    case PLANTILLAS_SECTIONS_LOAD:
      return { ...state, loadingPlantillas: false, error: '', secciones: action.payload }

    case PLANTILLAS_LOADING:
      return { ...state, loadingPlantillas: true, error: '' }

    case PLANTILLAS_PROFILES_LOAD:
      return { ...state, perfiles: action.payload, error: '', loadingPlantillas: false }

    case PLANTILLAS_ERROR:
      return { ...state, error: action.payload, loadingPlantillas: false }

    default: return state
  }
}
