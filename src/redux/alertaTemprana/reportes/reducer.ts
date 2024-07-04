import * as types from './types'

const INITIAL_STATE = {
  reports: {
    entityList: []
  },
  errors: [],
  fields: [],
  loading: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ALERTS_REPORTS_LOADING:
      return {
        ...state,
        loading: false
      }
    case types.ALERTS_REPORTS_LOAD:
      return {
        ...state,
        reports: action.payload,
        loading: false
      }
    case types.ALERTS_REPORTS_FAIL:
      return {
        ...state,
        errors: action.payload,
        loading: false
      }
    default: return state
  }
}
