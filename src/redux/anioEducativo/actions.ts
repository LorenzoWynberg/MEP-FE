import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
  LOAD_EDUCATIONAL_YEARS,
  CHANGE_VIEW,
  YEAR_ERROR,
  LOAD_LEVEL_OFFERS_CONFIG,
  LOAD_OFFER_MODAL_SERV,
  SET_SELECTED_ANIO_EDUCATIVO,
  SET_SELECTED_NIVEL_OFERTA,
  DELETE_OFFER_MODAL
} from './types'
import { handleErrors } from '../../utils/handleErrors'

const loadYears = (payload) => ({
  type: LOAD_EDUCATIONAL_YEARS,
  payload
})

const setSelected = (payload) => ({
  type: SET_SELECTED_ANIO_EDUCATIVO,
  payload
})
const setSelectedNivelOferta = (payload) => ({
  type: SET_SELECTED_NIVEL_OFERTA,
  payload
})
const yearError = (payload) => ({
  type: YEAR_ERROR,
  payload
})

const clearError = () => ({
  type: 'CLEAR_ERROR'
})
const postNivelOferta = (payload) => ({
  type: 'CREATE_NIVEL_OFERTA',
  payload
})
const postMultipleNivelOferta = (payload) => ({
  type: 'CREATE_MULTIPLE_NIVEL_OFERTA',
  payload
})

const clearNivelesOfertas = () => ({
  type: 'CLEAR_NIVELES_OFERTAS'
})

const changeViewDispatch = () => ({
  type: CHANGE_VIEW
})

const loadCurrentLevelOffers = (payload) => ({
  type: LOAD_LEVEL_OFFERS_CONFIG,
  payload
})

const loadModelOffers = (payload) => ({
  type: LOAD_OFFER_MODAL_SERV,
  payload
})
const deleteNivelOferta = (payload) => ({
  type: DELETE_OFFER_MODAL,
  payload
})
const cloneYear = (payload) => ({
  type: 'YEAR_CLONED',
  payload
})
export const duplicateYear = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/AnioEducativo/duplicateYear/${id}`
    )
    dispatch(cloneYear(response.data))
    return { error: false, data: response.data }
  } catch (error) {
    return { error: error.message }
  }
}

export const getOfferModalServ = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/OfertaModalServ`
    )
    dispatch(loadModelOffers(response.data))
    return { error: false, data: response.data }
  } catch (error) {
    return { error: error.message }
  }
}

export const GetNivelesOferta = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/NivelOfertas`
    )
    dispatch(loadCurrentLevelOffers(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const GetNivelesOfertaByCalendario =
	(calendarId) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/NivelOfertas/GetByCalendario/${calendarId}`
	    )
	    dispatch(loadCurrentLevelOffers(response.data))
	    return { error: false }
	  } catch (error) {
	    return { error: error.message }
	  }
	}

export const createNivelesOferta = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/NivelOfertas`,
			data
    )
    dispatch(postNivelOferta(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const createMultipleNivelesOferta = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/NivelOfertas/createMultiple`,
			data
    )
    dispatch(postMultipleNivelOferta(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const updateMultipleNivelesOferta =
	(data, calendarId) => async (dispatch) => {
	  try {
	    await axios.put(
				`${envVariables.BACKEND_URL}/api/NivelOfertas/updateMultiple`,
				data
	    )
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/NivelOfertas/GetByCalendario/${calendarId}`
	    )
	    dispatch(loadCurrentLevelOffers(response.data))
	    return { error: false }
	  } catch (error) {
	    return { error: error.message }
	  }
	}

export const deleteNivelOfertaByCalendarId =
	(id, calendarId) => async (dispatch) => {
	  try {
	    await axios.delete(
				`${envVariables.BACKEND_URL}/api/NivelOfertas/delete/${id}/${calendarId}`
	    )
	    dispatch(deleteNivelOferta(id))
	    return { error: false }
	  } catch (error) {
	    return { error: error.message }
	  }
	}

export const clearNivelesOferta = () => async (dispatch) => {
  try {
    dispatch(clearNivelesOfertas())
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const addCalendar =
	(data, calendarId, cl) => async (dispatch, getState) => {
	  const { educationalYear, cursoLectivo } = getState()
	  try {
	    const response = await axios.put(
				`${envVariables.BACKEND_URL}/api/NivelOfertas/vincularalendario/${calendarId}`,
				data
	    )

	    const _data = educationalYear.nivelesOferta.map((el) => {
	      if (data.includes(el.id)) {
	        return {
	          ...el,
	          calendarioId: calendarId,
	          calendarioNombre: cursoLectivo.calendarios[cl].find(
	            (el) => el.id == calendarId
	          ).nombre
	        }
	      }
	      return {
	        ...el
	      }
	    })

	    dispatch(loadCurrentLevelOffers(_data))
	    return { error: false }
	  } catch (error) {
	    const _e = error.message
	    return { error: error.message }
	  }
	}

export const getEducationalYears = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/AnioEducativo`
    )
    dispatch(loadYears(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const createEducationalYears =
	(data: object) => async (dispatch, getState) => {
	  const { educationalYear } = getState()
	  try {
	    const response = await axios.post(
				`${envVariables.BACKEND_URL}/api/AnioEducativo`,
				data
	    )
	    dispatch(
	      loadYears([...educationalYear.aniosEducativos, response.data])
	    )
	    return { error: false }
	  } catch (e) {
	    dispatch(yearError(handleErrors(e)))
	    return { error: e.message }
	  }
	}

export const editEducationalYears =
	(data: object) => async (dispatch, getState) => {
	  const { educationalYear } = getState()
	  try {
	    const response = await axios.put(
				`${envVariables.BACKEND_URL}/api/AnioEducativo`,
				data
	    )
	    dispatch(
	      loadYears(
	        educationalYear.aniosEducativos.map((item) => {
	          if (item.id === response.data.id) {
	            return response.data
	          }
	          return item
	        })
	      )
	    )
	    return { error: false }
	  } catch (e) {
	    dispatch(yearError(handleErrors(e)))
	    return { error: e.message }
	  }
	}

export const deleteEducationalYear =
	(id: number) => async (dispatch, getState) => {
	  const { educationalYear } = getState()
	  try {
	    const response = await axios.delete(
				`${envVariables.BACKEND_URL}/api/AnioEducativo/${id}`
	    )
	    const _newData = educationalYear.aniosEducativos.filter(
	      (item) => Number(item.id) !== Number(id)
	    )
	    dispatch(loadYears(_newData))

	    return { error: false }
	  } catch (e) {
	    dispatch(yearError(handleErrors(e)))
	    return { error: e.response.data.error }
	  }
	}

export const toDisabledEducationalYear =
	(id: number) => async (dispatch, getState) => {
	  const { educationalYear } = getState()
	  try {
	    const response = await axios.put(
				`${envVariables.BACKEND_URL}/api/AnioEducativo/disabled/${id}`
	    )

	    dispatch(
	      loadYears(
	        educationalYear.aniosEducativos.map((item) => {
	          if (item.id === id) {
	            return { ...item, esActivo: 0 }
	          }
	          return item
	        })
	      )
	    )
	    return { error: false }
	  } catch (e) {
	    dispatch(yearError(handleErrors(e)))
	    return { error: e.response.data.error }
	  }
	}

export const changeView = () => async (dispatch) => {
  dispatch(changeViewDispatch())
}

export const setAnioEducativoSelected = (item) => async (dispatch) => {
  try {
    dispatch(setSelected(item))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const setNivelOfertaSelected = (item) => async (dispatch) => {
  try {
    dispatch(setSelectedNivelOferta(item))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const cleanError = () => async (dispatch) => {
  dispatch(clearError())
}
