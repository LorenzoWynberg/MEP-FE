import types from './types'

interface IState {
  loading: boolean;
  error: string;
  professors: Array<any>;
  professorsInstitution: Array<any>;
  professorsWithoutSchedule: Array<any>;
}

const INITIAL_STATE: IState = {
  loading: false,
  error: '',
  professors: [],
  professorsInstitution: [],
  professorsWithoutSchedule: []
}

export default (state: IState = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.LOADING_PROFESSORS:
      return {
        ...state,
        loading: true
      }
    case types.GET_ALL_PROFESSORS:
      return {
        ...state,
        professors: payload,
        loading: false
      }
    case types.GET_PAGINATE_PROFESSORS:
      return {
        ...state,
        professors: [...state.professors, payload],
        loading: false
      }
    case types.GET_PROFESSORS_BY_INSTITUTION_ID:
      return {
        ...state,
        loading: false,
        error: '',
        professorsInstitution: payload
      }
    case types.GET_PROFESSORS_WITHOUT_SCHEDULE:
      return {
        ...state,
        loading: false,
        error: '',
        professorsWithoutSchedule: payload
      }
    default: return state
  }
}
