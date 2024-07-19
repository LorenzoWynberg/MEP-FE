
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const formCentroUrl = `${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/FormularioCentro/`

// guarda una nueva respuesta de formulario
// data={solucion:json, institucionId:int, formularioCategoriaId:int}
export const CreateNewFormResponse = async (data) => {
  try {
    const response = await axios.post(
      formCentroUrl,
      data
    )
    return { error: false, data: response.data }
  } catch (e) {
    return { error: true }
  }
}

export const CreateNewFormResponseAction = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
      formCentroUrl,
      data
    )
    return { error: false, data: response.data }
  } catch (e) {
    const errors = Object.values(e?.response?.data?.errors) || []
    const message = errors[0][0] || 'Ha ocurrido un error'
    return { error: true, message }
  }
}

// Actualiza el resultado del form
// data={id:int,solucion:json}
export const UpdateFormResponse = async (data) => {
  try {
    const response = await axios.put(
      formCentroUrl,
      data
    )
    return { error: false, data: response.data }
  } catch (e) {
    return { error: true }
  }
}

// Obtiene resultados de formulario
export const GetFormResponseById = async (id) => {
  const response = await axios.get(
    `${formCentroUrl}GetById/${id}`
  )

  return response.data
}

export const ObtenerInfoCatalogos = async () => {
  const response = await axios.get(
    `${envVariables.BACKEND_URL}/api/ServicioComunal/ObtenerInfoCatalogos`
  )

  return response.data
}

// Obtiene el resultado de un determinado form e insittucion {para forms con respuesta unica}
export const GetResponseByInstitutionAndFormName = async (institutionId, formName, first = true) => {
  const response = await axios.get(
    `${formCentroUrl}GetAllByInstitucionAndFormName/${institutionId}/${formName}`
  )

  if (first) {
    return response.data[0] || {}
  }
  return response.data
}

// Obtiene el resultado de un determinado form e insittucion {para forms con respuesta unica}
export const GetServicioComunalInfoById = (idServicioComunal) => async (dispatch) => {
  try {
    const response = await axios.get(
     `${envVariables.BACKEND_URL}/api/ServicioComunal/GetServicioComunalInfoById/${idServicioComunal}`
    )
 
    return response.data
  } catch (e) {
    return { error: e.message }
  }
}

// Obtiene el resultado de un determinado form e insittucion {para forms con respuesta unica}
export const GetServicioComunalInfoByStudentId = (idStudent) => async (dispatch) => {
  try {
    const response = await axios.get(
     `${envVariables.BACKEND_URL}/api/ServicioComunal/GetServicioComunalByStudentId/${idStudent}`
    )
 
    return response.data
  } catch (e) {
    return { error: e.message }
  }
}
// Obtiene el resultado de un determinado form e insittucion {para forms con respuesta unica}
export const GetResponseByInstitutionAndFormNameUsingRedux = (institutionId, formName, reducerAction, first = true) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${formCentroUrl}GetAllByInstitucionAndFormName/${institutionId}/${formName}`
    )

    if (first) {
      dispatch({
        type: reducerAction,
        payload: response.data[0] || {}
      })
      return response.data[response.data.length] || {}
    }
    return response.data
  } catch (e) {
    return { error: e.message }
  }
}

export const getlocationElementById = async (type, id) => {
  const response = await axios.get(
    `${envVariables.BACKEND_URL}/api/${type}/GetById/${id}`
  )
  return response.data || {}
}

// Obtiene todos los resultados de un determinado form e insittucion {para tabla}
export const GetFormResponsesByInstitutionAndFormName = async (institutionId, formName) => {
  const response = await axios.get(
    `${formCentroUrl}GetAllByInstitucionAndFormName/${institutionId}/${formName}`
  )

  return response.data
}

// Elimina uno o mas resultados
// ids: Los ids de las soluciones a eliminar []
export const DeleteFormResponses = async (ids) => {
  const response = await axios.delete(
    formCentroUrl,
    { data: ids }
  )
  return response.data
}

// Lista de las soluciones paginadas
export const GetFormResponsesByInstitutionAndFormNamePaginated = async (institutionId, formName, page = 1, itemsByPage = 10) => {
  const response = await axios.get(
    `${formCentroUrl}paginated/${institutionId}/${formName}/${page}/${itemsByPage}`
  )

  return response.data
}
