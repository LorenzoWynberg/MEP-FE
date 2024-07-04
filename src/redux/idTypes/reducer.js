import { ID_TYPES_LOAD, ID_TYPES_ERROR, ID_TYPES_LOADING } from './types'

const INITIAL_STATE = {
  idTypes: [],
  loadingIdTypes: false,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ID_TYPES_LOAD:
      return {
        ...state,
        idTypes: action.payload,
        loadingEstadosCiviles: false,
        error: ''
      }

    case ID_TYPES_LOADING:
      return { ...state, loadingRoles: true, error: '' }

    case ID_TYPES_ERROR:
      return { ...state, error: action.payload, loadingIdTypes: false }

    default: return state
  }
}
