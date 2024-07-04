import {
  LOAD_SPECIALITIES,
  CREATE_SPECIALITIES,
  DELETE_SPECIALITIES,
  EDIT_SPECIALITY
} from './types.ts'

const INITIAL_STATE = {
  especialidades: [],
  loading: false,
  loaded: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_SPECIALITIES:
      return {
        ...state,
        especialidades: [...state.especialidades, action.payload],
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case EDIT_SPECIALITY:
      return {
        ...state,
        especialidades: state.especialidades.map(mdlt => {
          if (mdlt.id === action.payload.id) {
            return { ...action.payload }
          }
          return mdlt
        }),
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case DELETE_SPECIALITIES:
      return {
        ...state,
        especialidades: state.especialidades.map(mdlt => {
          if (action.payload.includes(mdlt.id)) {
            return { ...mdlt, estado: false }
          }
          return mdlt
        }),
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case LOAD_SPECIALITIES:
      return {
        ...state,
        especialidades: action.payload,
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    default: return state
  }
}
