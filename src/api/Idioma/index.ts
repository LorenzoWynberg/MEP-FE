import axios from 'axios'
import { envVariables } from '../../constants/enviroment'

export const getIdiomaList = async () => {
  try {
    const response = await axios.get<any>(`${envVariables.BACKEND_URL}/api/idioma/list`)
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

export const getIdiomaFromS3 = async (url) => {
  try {
    return await fetch(url).then(r => r.json())
    /* const response = await axios.get<any>(url)
        const {data} =response
        return data */
  } catch (e) {
    console.log(e)
  }
}

export const uploadS3File = async (key, nombre, json) => {
  try {
    const response = await axios.post<any>(`${envVariables.BACKEND_URL}/api/idioma/upload`, {
      nombre,
      codigo: key,
      Diccionario: JSON.stringify(json)
    })
    const { data } = response
    if (data.error) { throw new Error(data.errorMessage) }
    return data
  } catch (e) {
    console.log(e)
  }
}

export const deleteS3File = async (key) => {
  try {
    const response = await axios.delete<any>(`${envVariables.BACKEND_URL}/api/idioma/${key}`)
    const { data } = response
    if (data.error) { throw new Error(data.errorMessage) }
    return data
  } catch (e) {
    console.log(e)
  }
}
