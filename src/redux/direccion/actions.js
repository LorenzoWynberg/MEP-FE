import { DIRECCION_LOAD, DIRECCION_ERROR, DIRECCION_LOADING } from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { getIdentification } from '../identificacion/actions'
import { createBitacoraResidenciaEstudiantil } from '../Bitacora/actions.ts'

const loadDirection = (payload) => ({
  type: DIRECCION_LOAD,
  payload
})

const loading = () => ({
  type: DIRECCION_LOADING
})

const directionError = (payload) => ({
  type: DIRECCION_ERROR,
  payload
})

export const createDirection = (data, residenciaData) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DireccionIdentidad`,
			data
    )
    if (residenciaData) {
      await dispatch(
        createBitacoraResidenciaEstudiantil({
          ...residenciaData,
          json: JSON.stringify(residenciaData.json)
        })
      )
    }
    dispatch(getIdentification(data.identidadId, false))
    dispatch(loadDirection(response.data))
    return { error: false, response: response.data }
  } catch (error) {
    dispatch(directionError(error.message))
    return { error: true }
  }
}

export const updateDirection = (data, residenciaData) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DireccionIdentidad/${data.id}`,
			data
    )

    if (residenciaData) {
      await dispatch(
        createBitacoraResidenciaEstudiantil({
          ...residenciaData,
          json: JSON.stringify(residenciaData.json)
        })
      )
    }
    dispatch(getIdentification(data.identidadId, false))
    dispatch(loadDirection(response.data))
    return { error: false }
  } catch (error) {
    dispatch(directionError(error.message))
    return { error: true }
  }
}

export const deleteDirection = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DireccionIdentidad/softDelete/${data}`
    )
    return { error: false, response }
  } catch (error) {
    dispatch(directionError(error.message))
    return { error: true, response: error }
  }
}
