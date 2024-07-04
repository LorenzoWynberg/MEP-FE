import { LOAD_FALTAS, SET_TIPOS_FALTAS } from './types'

const INITIAL_STATE = {
  faltas: [],
  tiposFalta: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_FALTAS: {
      return {
        ...state,
        faltas: action.payload
      }
    }
    case SET_TIPOS_FALTAS:{
      return {
        ...state,
        tiposFalta: action.payload
      }
    }
    default:
      return state
  }
}
