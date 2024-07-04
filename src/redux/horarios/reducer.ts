import types from './types'

const INITIAL_STATE = {
  schedules: [],
  loading: false,
  error: '',
  currentSchedule: {}
}

export default (state = INITIAL_STATE, { type, payload }) => {
  const _state = JSON.parse(JSON.stringify(state))
  switch (type) {
    case types.LOADING_SCHEDULES:
      return {
        ...state,
        loading: true
      }
    case types.GET_ALL_SCHEDULES:
      return {
        ...state,
        schedules: payload,
        loading: false,
        error: ''
      }
    case types.ADD_SCHEDULE:
    case types.UPDATE_SCHEDULE:
    case types.GET_SINGLE_SCHEDULE:
    case types.SET_CURRENT_SCHEDULE:
      return {
        ..._state,
        loading: false,
        error: '',
        currentSchedule: payload
      }
    case types.DELETE_SCHEDULE:
      _state.shcedules.filter((schedule) => schedule.id !== payload?.id)
      return {
        ..._state,
        loading: false,
        error: '',
        currentSchedule: null
      }
    default: return state
  }
}
