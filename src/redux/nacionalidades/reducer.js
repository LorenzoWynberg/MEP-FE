import { NACIONALIDADES_LOAD, NACIONALIDADES_LOADING, NACIONALIDADES_ERROR } from './nacionalidadesTypes'

const INITIAL_STATE = {
  nacionalidades: [],
  loadingNacionalidades: false,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NACIONALIDADES_LOAD:
      return {
        ...state,
        nacionalidades: action.payload,
        loadingNacionalidades: false,
        error: ''
      }

    case NACIONALIDADES_LOADING:
      return { ...state, loadingNacionalidades: true, error: '' }

    case NACIONALIDADES_ERROR:
      return { ...state, error: action.payload, loadingNacionalidades: false }

    default: return state
  }
}
