
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const formUrl = `${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Formulario/`

// Obtiene un formulario basado en su nombre
export const GetByName = async (formName) => {
  const response = await axios.get(
        `${formUrl}GetByName/${formName}`
  )
  return { ...response.data, formulario: JSON.parse(response.data.formulario) }
}

// Obtiene un formulario basado en su id
export const GetById = async (id) => {
  const response = axios.get(
        `${formUrl}GetById/${id}`
  )
  return { ...response.data, formulario: JSON.parse(response.data.formulario) }
}

// Obtiene n formularios correspontiente a la categoria requerida (codigo de categoria)
export const GetByCodigoCategory = async (codigoCategoria) => {
  const response = await axios.get(
        `${formUrl}GetByCodigoCategory/${codigoCategoria}`
  )

  return (response.data || []).map(item => { return { ...item, formulario: JSON.parse(item.formulario) } })
}
