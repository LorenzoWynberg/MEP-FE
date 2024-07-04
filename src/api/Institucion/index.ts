import axios from 'axios'
import { envVariables } from '../../constants/enviroment'

export const getUbicacionJson = async (id) => {
  try {
    const response = await axios.get<any>(`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetUbicacionJson/${id}`)
    const { data } = response
    if (data.error) {
      throw new Error(data.errorMessage)
    }
    if (data.data) {
      const jsonObj = JSON.parse(data.data)
      return jsonObj
    }
    return {}
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const setUbicacionJson = async (id, json) => {
  try {
    const response = await axios.post<any>(`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/SetUbicacionJson`, {
      institucionId: id,
      json
    }
    )
    const { data } = response
    if (data.error) {
      throw new Error(data.errorMessage)
    }
    return data.data
  } catch (e) {
    console.log(e)
    throw e
  }
}
