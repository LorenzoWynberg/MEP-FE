import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
  LOAD_LEVEL_OFFERS,
  LOAD_MODEL_LEVELS,
  LOAD_MODEL_SPECIALTIES,
  CLEAN_CURRENT_MODEL,
  LOAD_CURRENT_MODEL,
  LOAD_EDITED_MODEL,
  LOAD_MODEL_OFFERS,
  DELETE_MODELS,
  CREATE_MODEL_OFFER,
  LOAD_LAST_ID,
  CLEAN_STATE_LEVELS_ESP,
  UPDATE_OFFER,
  ENABLE_AND_DISABLE
} from './types'

const loadLevelOffers = (payload) => ({
  type: LOAD_LEVEL_OFFERS,
  payload
})

const deleteModelsFromState = (payload) => ({
  type: DELETE_MODELS,
  payload
})

const loadCurrentLevels = (payload) => ({
  type: LOAD_MODEL_LEVELS,
  payload
})

const loadEditedOffer = (payload) => ({
  type: LOAD_EDITED_MODEL,
  payload
})

const loadCurrentSpecialties = (payload) => ({
  type: LOAD_MODEL_SPECIALTIES,
  payload
})

const loadCurrentModel = (payload) => ({
  type: LOAD_CURRENT_MODEL,
  payload
})

const loadModelOffers = (payload) => ({
  type: LOAD_MODEL_OFFERS,
  payload
})

const loadCreatedOffer = (payload) => ({
  type: CREATE_MODEL_OFFER,
  payload
})

const cleanOffer = () => ({
  type: CLEAN_CURRENT_MODEL
})

const loadLastId = (payload) => ({
  type: LOAD_LAST_ID,
  payload
})

const cleanStateLevelsSpecilities = () => ({
  type: CLEAN_STATE_LEVELS_ESP
})

const updateOffer = (payload) => ({
  type: UPDATE_OFFER,
  payload
})

export const getLevelsByModel = (id: number) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Nivel/ByOfertaModalServ/${id}`
    )
    dispatch(loadCurrentLevels(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const cleanLvlsState = () => (dispatch) => {
  dispatch(cleanStateLevelsSpecilities())
}

export const cleanCurrentOffer = () => (dispatch) => {
  dispatch(cleanOffer())
}

export const getSpecialtiesByModel = (id: number) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Especialidad/GetByModelEspeServ/${id}`
    )
    dispatch(loadCurrentSpecialties(response.data))
    return { error: false, data: response.data }
  } catch (error) {
    return { error: error.message }
  }
}

export const createOffer = (data: object) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/OfertaModalServ`,
      data
    )
    dispatch(loadCreatedOffer(response.data))
    return { error: false }
  } catch (e) {
    let error = e.response.data.error
    if (e.response?.data?.errors) {
      error = Object.values(e.response.data.errors)[0]
      if (Array.isArray(error)) {
        error = error[0]
      }
    }
    return { error: true, msj: error }
  }
}

export const loadCurrentOffer = (item: object) => async (dispatch) => {
  dispatch(loadCurrentModel(item))
}

export const getOfferModels = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/OfertaModalServ`
    )
    dispatch(loadModelOffers(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const editOffer = (data: object) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/OfertaModalServ`,
      data
    )
    dispatch(loadEditedOffer(response.data))
    return { error: false }
  } catch (e) {
    
    return { error: true, msj: e.response.data.error }
  }
}

export const deleteModels = (data: object) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/OfertaModalServ/deleteMultiple`,
      data
    )
    if (response.data === 418) return { error: 418 }
    else {
      dispatch(deleteModelsFromState(data))
    }
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const getLvlOfferByCursoLectivoAndInst =
  (cursoLId: number, instId: number) => async (dispatch) => {
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/NivelOfertas/GetNivelesOfertaByInstitucionAndCursoLectivo/${instId}/${cursoLId}`
      )
      dispatch(loadLevelOffers(response.data))
      return { error: false }
    } catch (e) {}
  }

export const loadLastOfferId =
  (fromBackend = true, localLastId = null) =>
    async (dispatch) => {
      if (fromBackend) {
        try {
          const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/OfertaModalServ/getLastOfferId`
          )
          dispatch(loadLastId(response.data))
          return { error: false }
        } catch (e) {}
      } else {
        dispatch(loadLastId(localLastId ? localLastId + 1 : 1))
      }
    }
export const updateOferta = (ids) => async (dispatch) => {
  try {
    const response = await axios.put(
        `${envVariables.BACKEND_URL}/api/OfertaModalServ/ActivareInactivar`, ids
    )

    dispatch(updateOffer(ids))

    return { error: false }
  } catch (e) {
    return e.response
  }
}

export const enableAndDisable = (
  type: 'Modalidad' | 'Nivel' | 'Oferta' | 'OfertaModalServ' | 'Servicio' | 'Especialidad',
  ids: Array<number>
) => async (dispatch) => {
  try {
    const res = await axios.put(`${envVariables.BACKEND_URL}/api/${type}/ActivareInactivar`, ids)
    dispatch({
      type: ENABLE_AND_DISABLE,
      payload: res.data.data
    })
    return { error: false }
  } catch (error) {
    return { error: error?.response?.error || error?.response?.data?.error || error.message }
  }
}
