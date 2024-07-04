import types from './types'

interface IState {
  loading: boolean;
  error: string;
  professors: Array<any>;
  professorsInstitution: Array<any>;
}

const INITIAL_STATE: IState = {
  loading: false,
  error: '',
  professors: [],
  professorsInstitution: []
}

export default (state: IState = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.LOADING_PROFESSORS:
      return {
        ...state,
        loading: true
      }
    case types.GET_PAGINATE_PROFESSORS:
      return {
        ...state,
        professors: payload
      }
    case types.GET_PROFESSORS_BY_INSTITUTION_ID:
      return {
        ...state,
        professorsInstitution: payload
      }
    default: return state
  }
}
