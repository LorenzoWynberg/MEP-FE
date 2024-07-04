import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { handleErrors } from '../../utils/handleErrors'
import {
  OFFERS_GET,
  OFFERS_LOADING,
  OFFERS_LOAD_OPTIONS,
  OFFERS_SAVE,
  OFFERS_ERROR,
  OFFERS_DELETE,
  OFFERS_EDIT,
  OFFERS_ASSIGNED_GET,
  OFFERS_ACTIVATE
} from './types.ts'

const loadOptions = (payload) => ({
  type: OFFERS_LOAD_OPTIONS,
  payload
})

const save = (payload) => ({
  type: OFFERS_SAVE,
  payload
})

const edit = (payload) => ({
  type: OFFERS_EDIT,
  payload
})

const loading = () => ({
  type: OFFERS_LOADING
})

const error = (payload) => ({
  type: OFFERS_ERROR,
  payload
})

const loadOffers = (payload) => ({
  type: OFFERS_GET,
  payload
})

const deleteOffer = (payload) => ({
  type: OFFERS_DELETE,
  payload
})

const activate = (payload) => ({
  type: OFFERS_ACTIVATE,
  payload
})

const loadOffersAssigned = (payload) => ({
  type: OFFERS_ASSIGNED_GET,
  payload
})

export const getOffers = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/OfertasPorInstitucionalidad/GetAllByInstitucion/${id}`
    )
    dispatch(loadOffers(response.data))
  } catch (e) {}
}

export const getModelosOfertasOptions = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Nivel/NivelesEspecialidades/All`
    )
    dispatch(loadOptions({ name: 'modelOffers', options: response.data }))
  } catch (e) {}
}

export const getEspecialidadesOptions = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Especialidad`
    )
    dispatch(
      loadOptions({ name: 'especialidades', options: response.data })
    )
  } catch (e) {}
}

export const getModalidadesOptions = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Modalidad`
    )
    dispatch(loadOptions({ name: 'modalidades', options: response.data }))
  } catch (e) {}
}

export const getServiciosOptions = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Servicio`
    )
    dispatch(
      loadOptions({
        name: 'servicios',
        options: [{ id: 0, nombre: 'SIN SERVICIO' }, ...response.data]
      })
    )
  } catch (e) {}
}

export const getNivelesOptions = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Nivel`
    )
    dispatch(loadOptions({ name: 'niveles', options: response.data }))
  } catch (e) {}
}

export const saveInstitutionOffer = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/OfertasPorInstitucionalidad`,
			data
    )
    dispatch(save(response.data))
    return { error: false }
  } catch (e) {
    if (e.response.status === 400) {
      dispatch(error(handleErrors(e)))
      return { error: e.response.data.error }
    }

    if (e.response.status === 500) {
      dispatch(error(handleErrors(e)))
      return { error: e.response.data.error }
    }
    return { error: e.message }
  }
}

export const updateInstitutionOffer = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response: any = await axios.put(
			`${envVariables.BACKEND_URL}/api/OfertasPorInstitucionalidad`,
			data
    )

    if (response.data.error) {
      dispatch(error(handleErrors(response.data.mensaje)))
      return { error: response.data.mensaje }
    } else {
      dispatch(edit(response.data))
      return { error: false }
    }
  } catch (e) {
    if (e?.response?.status === 400) {
      dispatch(error(handleErrors(e)))
    }
    if (e?.response?.status === 500) {
      dispatch(error(handleErrors(e)))
      return { error: e.response.data.error }
    }
    return { error: e.message }
  }
}

export const deleteInstitutionOffer = (ids) => async (dispatch) => {
  dispatch(loading())
  try {
    await axios.delete(
			`${envVariables.BACKEND_URL}/api/OfertasPorInstitucionalidad/DeleteMultiple`,
			{ data: ids }
    )
    dispatch(deleteOffer(ids))
    return { error: false }
  } catch (e) {
    console.error(e)
    if (e?.response?.data) {
      dispatch(error(handleErrors(e)))
      return {
        error: true,
        mensaje: e?.response?.data.error
      }
    }
    if (e?.response?.status === 400) {
      dispatch(error(handleErrors(e)))
    }
    return {
      error: true,
      mensaje: 'Ha ocurrido un problema al intentar desactivar la oferta.'
    }
  }
}

export const activarMultiples = (ids) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/OfertasPorInstitucionalidad/ActivateMultiple`,
			ids
    )
    dispatch(activate(ids))
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const getModelosOfertasAssigned =
	(institucionId: string) => async (dispatch) => {
	  dispatch(loading())
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/OfertasPorInstitucionalidad/GetModelosOfertasJoin/${institucionId}`
	    )
	    dispatch(loadOffersAssigned(response.data))
	    return { error: false }
	  } catch (e) {
	    if (e.response.status === 400) {
	      dispatch(error(handleErrors(e)))
	    }
	    return { error: e.message }
	  }
	}
