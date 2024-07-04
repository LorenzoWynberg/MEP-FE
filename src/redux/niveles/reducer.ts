import {
  LOAD_LEVELS,
  CREATE_LEVELS,
  DELETE_LEVELS,
  EDIT_LEVEL,
  GET_LEVELS_BY_MODEL_OFFER
} from './types'

const INITIAL_STATE = {
  niveles: [],
  nivelesByModelOffer: [],
  loading: false,
  loaded: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_LEVELS_BY_MODEL_OFFER:
      return {
        ...state,
        nivelesByModelOffer: action.payload,
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case CREATE_LEVELS:
      return {
        ...state,
        niveles: [...state.niveles, action.payload],
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case EDIT_LEVEL:
      return {
        ...state,
        niveles: state.niveles.map(mdlt => {
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
    case DELETE_LEVELS:
      return {
        ...state,
        niveles: state.niveles.map(mdlt => {
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
    case LOAD_LEVELS:
      return {
        ...state,
        niveles: action.payload,
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    default: return state
  }
}
