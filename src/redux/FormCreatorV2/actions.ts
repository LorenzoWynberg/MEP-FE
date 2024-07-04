import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
  FORM_SAVE,
  FORM_LOAD_CATEGORIES,
  FORM_LOAD_FORMS,
  FORM_LOAD,
  FORM_RESPONSE_SAVE,
  FORM_LOAD_DUPLICATED,
  FORM_RESPONSES_PAGINATED,
  FORM_STATISTICS,
  FORM_SAVE_CATEGORIE,
  FORM_DELETE_CATEGORIE,
  FORM_GET_USER_CATEGORIES,
  FORM_EDIT_CATEGORIE,
  FORM_RESPONSES,
  FORM_ADMINS_LOAD,
  FORM_GET_EMAIL,
  FORM_ADMIN_SEARCH,
  FORM_GET_URL_BY_FORM,
  FORM_CURRENT_THEME_LOAD,
  FORM_DELETE,
  LOADING_CURRENT_THEME,
  FORM_CREATE_INVITACION,
  FORM_VALIDATE_INVITATION

} from './types'

const createInvitacion = (payload) => ({
  type: FORM_CREATE_INVITACION,
  payload
})

const getUrlByForms = (payload) => ({
  type: FORM_GET_URL_BY_FORM,
  payload
})

const getEmails = (payload) => ({
  type: FORM_GET_EMAIL,
  payload
})
const loadForm = (payload) => ({
  type: FORM_SAVE,
  payload
})

const loadDuplicatedForm = (payload) => ({
  type: FORM_LOAD_DUPLICATED,
  payload
})

const loadFormCategories = (payload) => ({
  type: FORM_LOAD_CATEGORIES,
  payload
})

const loadForms = (payload) => ({
  type: FORM_LOAD_FORMS,
  payload
})

const loadFormToState = (payload) => ({
  type: FORM_LOAD,
  payload
})

const loadResponseForm = (payload) => ({
  type: FORM_RESPONSE_SAVE,
  payload
})

const loadResponsesPaginatedForm = (payload) => ({
  type: FORM_RESPONSES_PAGINATED,
  payload
})

const loadResponsesForm = (payload) => ({
  type: FORM_RESPONSES,
  payload
})

const loadStatisticsForm = (payload) => ({
  type: FORM_STATISTICS,
  payload
})

const getUserCategories = (payload) => ({
  type: FORM_GET_USER_CATEGORIES,
  payload
})
const saveCategorie = (payload) => ({
  type: FORM_SAVE_CATEGORIE,
  payload
})
const deleteCategorie = (payload) => ({
  type: FORM_DELETE_CATEGORIE,
  payload
})
const editCategorie = (payload) => ({
  type: FORM_EDIT_CATEGORIE,
  payload
})

export const getUrlByForm = (FormId) => async (dispatch, getState) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario/FormRespuesta/${FormId}`)
    dispatch(loadFormToState(response.data))
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

const loadCurrentTheme = (payload) => ({
  type: FORM_CURRENT_THEME_LOAD,
  payload
})

const deleteFormDispatch = (payload) => ({
  type: FORM_DELETE,
  payload
})

const loadValidateInvitation = (payload) => ({
  type: FORM_VALIDATE_INVITATION,
  payload
})

export const getEmail = (searchKeyWord) => async (dispatch) => {
  try {
    const response = await axios.get(
            `${envVariables.BACKEND_URL}/api/Comunicado/Emails/${searchKeyWord}`)
    dispatch(getEmails(response.data))
    return { error: false, data: response.data }
  } catch (err) {
    return { error: err.message, message: err.response.data.error }
  }
}
export const clearEmails = () => async (dispatch) => {
  dispatch(getEmails([]))
}

export const saveCategories = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/CategoriaBaseFormulario/Create`, data)
    dispatch(saveCategorie(response.data))
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const createInvitation = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/InvitacionBaseFormulario/Multiple`, data)
    dispatch(createInvitacion(response.data))
    return { error: false, data: response.data }
  } catch (err) {
    return { error: err.message }
  }
}

export const deleteCategories = (Id) => async (dispatch) => {
  try {
    await axios.delete(`${envVariables.BACKEND_URL}/api/CategoriaBaseFormulario/${Id}/Delete`)
    dispatch(deleteCategorie(Id))
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const editCategories = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/CategoriaBaseFormulario/${data.id}`, data)
    dispatch(editCategorie(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

const loadAdmins = (payload) => ({
  type: FORM_ADMINS_LOAD,
  payload
})

const loadFoundAdmins = (payload) => ({
  type: FORM_ADMIN_SEARCH,
  payload
})

export const cleanCurrentTheme = () => (dispatch) => {
  dispatch(loadCurrentTheme({}))
}

export const saveForm = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/GestorFormulario`,
            data
    )
    dispatch(loadForm(response.data))
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const updateForm = (autoSave, data) => async (dispatch) => {
  try {
    let response
    if (autoSave) {
      response = await axios.put(
                `${envVariables.BACKEND_URL}/api/GestionControlFormulario/autoSave`,
                data
      )
      // dispatch(loadForm({ ...response.data, formulario: response.data.autoguardadoFormulario }))
    } else {
      response = await axios.put(
                `${envVariables.BACKEND_URL}/api/GestionControlFormulario`,
                data
      )
      dispatch(loadForm({ ...response.data }))
    }
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const getCategorias = () => async (dispatch, getState) => {
  const { categorias } = getState().creadorFormularios
  try {
    if (categorias.length < 1) {
      const response = await axios.get(`${envVariables.BACKEND_URL}/api/CategoriaBaseFormulario`)
      dispatch(loadFormCategories(response.data))
    }
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const getForms = () => async (dispatch, getState) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario`)
    dispatch(loadForms(response.data))
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const getFormsByCategory = (id) => async (dispatch, getState) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario/categoria/${id}`)
    dispatch(loadForms(response.data))
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const duplicateForm = (formId, name) => async (dispatch, getState) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}/duplicate`, { name })
    const responseall = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario`)
    dispatch(loadForms(responseall.data))
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const getForm = (formId, manual) => async (dispatch, getState) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}`)
    if (manual) {
      dispatch(loadFormToState(response.data))
    } else {
      dispatch(loadFormToState({ ...response.data, formulario: response.data.autoguardadoFormulario }))
    }
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const getFormByHash = (formHashId, manual) => async (dispatch, getState) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario/FormRespuesta/${formHashId}`)
    if (manual) {
      dispatch(loadFormToState(response.data))
    } else {
      dispatch(loadFormToState({ ...response.data, formulario: response.data.autoguardadoFormulario }))
    }
    return { error: false, data: response.data }
  } catch (err) {
    return { error: err.message }
  }
}

export const exportForm = (formId, formName) => async (dispatch) => {
  try {
    const response = await axios.get(
            `${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}/Export`,
            {
              responseType: 'blob'
            }
    )
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${formName}-${formId}-${new Date().toISOString()}.json`)
    document.body.appendChild(link)
    link.click()

    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const importForm = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/GestorFormulario/Import`, data
    )
    dispatch(loadForm(response.data))
    return { error: false }
  } catch (err) {
    return { error: err.message, message: err.response.data.error }
  }
}

export const saveResponseForm = (hashFormId, data) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/GestorFormulario/FormRespuesta/${hashFormId}/Respuesta`, data
    )
    dispatch(loadResponseForm(response.data))
    return { error: false, data: response.data }
  } catch (err) {
    return { error: err.message, message: err.response.data.error }
  }
}

export const updateResponseForm = (responseId, data) => async (dispatch) => {
  try {
    const response = await axios.put(
            `${envVariables.BACKEND_URL}/api/RespuestaBaseFormulario/${responseId}`, data
    )
    dispatch(loadResponseForm(response.data))
    return { error: false, data: response.data }
  } catch (err) {
    return { error: err.message, message: err.response.data.error }
  }
}

export const autoSaveResponseForm = (responseId, data) => async (dispatch) => {
  try {
    const response = await axios.put(
            `${envVariables.BACKEND_URL}/api/RespuestaBaseFormulario/${responseId}/AutoSave`, data
    )
    // dispatch(loadResponseForm(response.data))
    return { error: false, data: response.data }
  } catch (err) {
    return { error: err.message, message: err.response.data.error }
  }
}

export const loadCurrentForm = (form) => async (dispatch, getState) => {
  dispatch(loadFormToState(form))
}

export const getResponsesFormPaginated = (formId: number, pagina: number = 1, cantidad: number = 6, type: string = null, search: string = null) => async (dispatch) => {
  try {
    const filter = type != null && type != '' ? `&FiltrarPor=${type}&Filtro=${search}` : ''
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}/Respuestas/Paginated?Pagina=${pagina}&Cantidad=${cantidad}${filter}`)
    dispatch(loadResponsesPaginatedForm(response.data))
    return { error: false }
  } catch (error) {
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const getUsersByEmail = (email) => async (dispatch, getState) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Admin/Users/ByEmail/${email}`)
    dispatch(loadFoundAdmins(response.data))
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const clearSearch = () => async (dispatch, getState) => {
  dispatch(loadFoundAdmins([]))
}

export const getStatisticsForm = (formId) => async (dispatch, getState) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}/Estadisticas`)
    dispatch(loadStatisticsForm(response.data))
    return { error: false }
  } catch (err) {
    return { error: err.message }
  }
}

export const getResponsesForm = (formId: number) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}/Respuestas`)
    dispatch(loadResponsesForm(response.data))
    return { error: false }
  } catch (error) {
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const getAdmins = (formId, admins) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}/Admins`)
    dispatch(loadAdmins(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const saveAdmins = (formId, data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}/Admins`, data)
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteAdmins = (formId, admins) => async (dispatch) => {
  try {
    const response = axios.post(`${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}/AdminsDelete`, admins)
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteForm = (formId) => async (dispatch) => {
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}`)
    dispatch(deleteFormDispatch(formId))
    return { error: false }
  } catch (e) {
    const foo = e.message

    return { error: e.message }
  }
}

export const getAnalizeForm = (formId) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestorFormulario/${formId}/Analizar`)
    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const getFormTheme = (id) => async (dispatch) => {
  dispatch({ type: LOADING_CURRENT_THEME })
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Temas/${id}`)
    dispatch(loadCurrentTheme(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const validateInvitation = (invitationId) => async (dispatch) => {
  dispatch({ type: LOADING_CURRENT_THEME })
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/InvitacionBaseFormulario/${invitationId}/Validate`)
    dispatch(loadValidateInvitation(response.data))
    return { error: false, data: response.data }
  } catch (error) {
    return { error: error.message }
  }
}

export const downloadZip = (data, NProgress) => async (dispatch) => {
  NProgress.start()
  try {
    axios({
      url: `${envVariables.BACKEND_URL}/api/file/downloadZip`,
      method: 'POST',
      responseType: 'blob',
      data
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Archivos.zip')
      document.body.appendChild(link)
      link.click()

      NProgress.done()
    })
  } catch (error) {
    NProgress.done()
    return {
      error: true
    }
  }
}

export const setFormTheme = (data) => async (dispatch) => {
  dispatch(loadCurrentTheme(data))
}
