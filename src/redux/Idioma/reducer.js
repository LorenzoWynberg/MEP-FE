import TYPES from './types'
const intialState = []

const reducer = (state = intialState, action) => {
  const { type, payload } = action
  switch (type) {
    case TYPES.SET_IDIOMA_LIST:{
      return payload
    }
    default:
      return state
  }
}

export default reducer
