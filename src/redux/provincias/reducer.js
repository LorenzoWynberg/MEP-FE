import { PROVINCIAS_LOAD, PROVINCIAS_ERROR, PROVINCIAS_LOADING } from './types'

const INITIAL_STATE = {
  provincias: [],
  loadingProvincias: false,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROVINCIAS_LOAD:
      return {
        ...state,
        provincias: action.payload,
        loadingProvincias: false,
        error: ''
      }

    case PROVINCIAS_LOADING:
      return { ...state, loadingRoles: true, error: '', provincias: [] }

    case PROVINCIAS_ERROR:
      return { ...state, error: action.payload, loadingProvincias: false }

    default: return state
  }
}
