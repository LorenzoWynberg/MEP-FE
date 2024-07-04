import * as types from './types'

const INITIAL_STATE = {
  data: {},
  loading: false,
  offers: [],
  levelsExpediente: [],
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CLEAN_CENTER_OFFERS_BY_EDYEAR:
      return {
        ...state,
        offers: []

      }
    case types.CENTRO_LOADING:
      return {
        ...state,
        loading: true,
        error: false
      }
    case types.CENTRO_LOAD:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: false
      }
    case types.LOAD_CENTER_OFFERS_BY_EDYEAR:
      return {
        ...state,
        levelsExpediente: action.payload
      }
    case types.LOAD_CENTER_OFFERS:
      return {
        ...state,
        offers: action.payload || []
      }
    case types.CENTRO_FAILED:
      return {
        ...state,
        error: true,
        loading: false,
        errors: action.payload.errors || [],
        fields: action.payload.fields || []
      }
    default:
      return state
  }
}
