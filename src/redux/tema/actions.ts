import TYPES from './types'
export const setTemaValue = (obj) => {
  return { type: TYPES.SET_ALL_COLORS, payload: obj }
}
