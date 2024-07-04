import TYPES from './types'
import { Idioma } from '../../api'

const setIdiomas = (idiomasArr) => {
  return { type: TYPES.SET_IDIOMA_LIST, payload: idiomasArr }
}

const requestIdiomaList = () => async (dispatch, _getState) => {
  const idiomas = await Idioma.getIdiomaList()
  dispatch(setIdiomas(idiomas))
  return idiomas
}

export {
  requestIdiomaList,
  setIdiomas
}
