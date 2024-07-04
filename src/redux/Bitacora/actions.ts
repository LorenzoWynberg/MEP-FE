import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const loading = () => ({
  type: 'LOADING_BITACORA'
})

const getAllPaginatedBitacoraAyuda = (payload) => ({
  payload,
  type: 'GET_PAGINATED_BITACORA_AYUDA'
})
const getAllBitacoraAyuda = (payload) => ({
  payload,
  type: 'GET_All_BITACORA_AYUDA'
})

const saveBitacoraAyuda = (payload) => ({
  payload,
  type: 'SAVE_BITACORA_AYUDA'
})
const clearBitacoraAyuda = () => ({
  type: 'CLEAR_BITACORA_AYUDA'
})

export const createBitacoraAyuda = (data: any) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(
			`${envVariables?.BACKEND_URL}/api/Bitacora/createBitacoraAyuda`,
			data
    )
    dispatch(saveBitacoraAyuda(response.data))
    return { error: false, data: response.data }
  } catch (error) {
    return { error: error?.message }
  }
}

export const getBitacoraAyudaPaginated = (data: any) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(
			`${envVariables?.BACKEND_URL}/api/Bitacora/getBitacoraAyuda`,
			{ params: data }
    )
    dispatch(getAllPaginatedBitacoraAyuda(response.data))
    return { error: false }
  } catch (error) {
    return { error: error?.message }
  }
}
export const getBitacoraAyudaInstitution =
	(institutionId: any) => async (dispatch) => {
	  dispatch(loading())
	  try {
	    const response = await axios.get(
				`${envVariables?.BACKEND_URL}/api/Bitacora/getBitacoraAyuda/${institutionId}`
	    )
	    dispatch(getAllBitacoraAyuda(response.data))
	    return { error: false }
	  } catch (error) {
	    return { error: error?.message }
	  }
	}
export const clearDataBitacoraAyuda = () => async (dispatch) => {
  dispatch(loading())
  try {
    dispatch(clearBitacoraAyuda())
    return { error: false }
  } catch (error) {
    return { error: error?.message }
  }
}

export const createBitacoraResidenciaEstudiantil =
	(data: { identidadId: number; tipo: number; json: 'string' }) =>
	  async (dispatch) => {
	    try {
	      await axios.post(
				`${envVariables?.BACKEND_URL}/api/BitacoraResidenciasEstudiantes/create`,
				data
	      )
	      const res = await axios.get(
				`${envVariables?.BACKEND_URL}/api/BitacoraResidenciasEstudiantes/getbyidentidadId/${data.identidadId}`
	      )
	      dispatch({
	        type: 'CREATE_BITACORA_RESIDENCIA_ESTUDIANTIL',
	        payload: res.data
	      })
	      return { error: false }
	    } catch (err) {
	      return { error: err?.message }
	    }
	  }

export const getBitacoraResidenciaByIdentidad =
	(identidadId) => async (dispatch) => {
	  try {
	    const res = await axios.get(
				`${envVariables?.BACKEND_URL}/api/BitacoraResidenciasEstudiantes/getbyidentidadId/${identidadId}`
	    )
	    dispatch({
	      type: 'GET_BITACORA_RESIDENCIA_ESTUDIANTIL_BY_IDENTIDAD_ID',
	      payload: res.data
	    })
	    return { error: false }
	  } catch (err) {
	    return { error: err?.message }
	  }
	}

export const getBitacoraResidenciaById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(
			`${envVariables?.BACKEND_URL}/api/BitacoraResidenciasEstudiantes/getbyId/${id}`
    )
    dispatch({
      type: 'GET_BITACORA_RESIDENCIA_ESTUDIANTIL_BY_ID',
      payload: res.data
    })
    return { error: false }
  } catch (err) {
    return { error: err?.message }
  }
}
