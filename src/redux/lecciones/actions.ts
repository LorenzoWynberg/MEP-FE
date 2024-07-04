import types, { Lection } from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loading = () => ({
  type: types.LOADING_LECTIONS
})

const add = (payload) => ({
  type: types.ADD_LECTION,
  payload
})

const update = (payload) => ({
  type: types.UPDATE_LECTION,
  payload
})

const remove = (payload) => ({
  type: types.DELETE_LECTION,
  payload
})

const getLection = (payload) => ({
  type: types.GET_SINGLE_LECTION,
  payload
})

const getAll = (payload) => ({
  type: types.GET_ALL_LECTIONS,
  payload
})

const setCurrent = (payload) => ({
  type: types.SET_CURRENT_LECTION,
  payload
})

export const getLectionsByOfertaInstitucionalidadId =
	(id: string) => async (dispatch) => {
	  dispatch(loading())
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Leccion/GetAllByOfertaByInstitucionalidadId/${id}`
	    )
	    dispatch(getAll(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const getLectionsByModelOfferIdAndInstitutionId =
	(modelOfferId: number, institutionId: number) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Leccion/GetAllByOfertaAndInstitutionId/${institutionId}/${modelOfferId}`
	    )
	    dispatch(getAll(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const getSingleLection = (id: string) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Leccion/${id}`
    )
    dispatch(getLection(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const addLection = (lection: Lection) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Leccion/`,
			lection
    )
    dispatch(add(response.data))
    return { error: false, response: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const updateLection = (lection) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Leccion/${lection.id}`,
			lection
    )
    dispatch(update(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteLection = (id: string) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.delete(
			`${envVariables.BACKEND_URL}/api/Leccion/${id}`
    )
    dispatch(remove(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAllLections = () => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.delete(
			`${envVariables.BACKEND_URL}/api/Leccion/getAll`
    )
    dispatch(getAll(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const setCurrentLection = (lection) => async (dispatch) => {
  dispatch(setCurrent(lection))
}
