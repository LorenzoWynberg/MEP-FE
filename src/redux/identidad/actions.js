import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
  IDENTIDAD_LOAD_STUDENT,
  IDENTIDAD_STUDENT_ERROR,
  IDENTIDAD_STUDENT_LOADING,
  IDENTIDAD_CLEAR_STUDENT,
  IDENTIDAD_UPDATE_IDENTIDAD,
  IDENTIDAD_UPDATE_RESIDENCIA,
  IDENTIDAD_SET_WIZARD_ID,
  IDENTIDAD_SET_WIZARD_STEPS,
  IDENTIDAD_SET_WIZARD_ID_DATOS,
  IDENTIDAD_BITACORAS_LOAD,
  IDENTIDAD_BITACORAS_ERROR,
  IDENTIDAD_WIZARD_SET_DATA,
  IDENTIDAD_WIZARD_SET_NAV,
  IDENTIDAD_WIZARD_CLEAR_DATA,
  IDENTIDAD_WIZARD_CLEAR_NAV
} from './types'
import { handleErrors } from '../../utils/handleErrors'
import { uploadProfileImage } from '../identificacion/actions'

const loading = () => ({
  type: IDENTIDAD_STUDENT_LOADING
})

const loadStudent = (payload) => ({
  type: IDENTIDAD_LOAD_STUDENT,
  payload
})
const setWizardData = (payload) => ({
  type: IDENTIDAD_WIZARD_SET_DATA,
  payload
})
const setWizardNavData = (payload) => ({
  type: IDENTIDAD_WIZARD_SET_NAV,
  payload
})
const clearWizardData = (payload) => ({
  type: IDENTIDAD_WIZARD_CLEAR_DATA,
  payload
})
const clearWizardNavData = (payload) => ({
  type: IDENTIDAD_WIZARD_CLEAR_NAV,
  payload
})

const failIdentidad = (payload) => ({
  type: IDENTIDAD_STUDENT_ERROR,
  payload
})

const loadBitacoras = (payload) => ({
  type: IDENTIDAD_BITACORAS_LOAD,
  payload
})

const errorBitacoras = (payload) => ({
  type: IDENTIDAD_BITACORAS_ERROR,
  payload
})

const clearStudent = () => ({
  type: IDENTIDAD_CLEAR_STUDENT
})

const updateIdentidad = (payload) => ({
  type: IDENTIDAD_UPDATE_IDENTIDAD,
  payload
})

const updateResidencia = (payload) => ({
  type: IDENTIDAD_UPDATE_RESIDENCIA,
  payload
})

const setId = (payload) => ({
  type: IDENTIDAD_SET_WIZARD_ID,
  payload
})

const setIdDatos = (payload) => ({
  type: IDENTIDAD_SET_WIZARD_ID_DATOS,
  payload
})

const setPasosIdentidadWizard = (payload, step) => ({
  type: IDENTIDAD_SET_WIZARD_STEPS,
  step,
  payload
})

export const crearIdentidad = (identidad) => async (dispatch) => {
  const data = {
    ...identidad
  }

  dispatch(loading())
  try {
    if (identidad.profilePic.length) {
      const profileImage = await uploadProfileImage(identidad.profilePic[0])
      if (profileImage.error) {
        throw new Error(profileImage.message)
      }
      data.fotografiaUrl = profileImage
    }
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Identidad`,
      data
    )

    dispatch(loadStudent(response.data))
    return { data: { message: '', error: false } }
  } catch (e) {
    return { data: { message: e.message, error: true } }
  }
}

export const updateDataIdentidad = (data) => (dispatch) => {
  dispatch(updateIdentidad(data))
}

export const updateDataResidencia = (data) => (dispatch) => {
  dispatch(updateResidencia(data))
}
export const getPersonaByIdentificacion =
  (id) =>
    async () => {
      try {
        const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByIdentification/${id}`
        )

        return { error: false, data: response.data }
      } catch (e) {
        return { error: true }
      }
    }

export const getIdentificacionPersona =
  (id, checkExistingid = false) =>
    async (dispatch) => {
      try {
        const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByIdentification/${id}`
        )
        if (checkExistingid) {
          return {
            exists: !!response.data
          }
        } else if (response.data && !checkExistingid) {
          dispatch(loadStudent(response.data))
        } else {
          dispatch(clearStudent())
        }
        return { error: false, data: response.data }
      } catch (e) {
        return { error: true }
      }
    }

export const getEstadoFallecido =
  (id, checkExistingid = false) =>
    async (dispatch) => {
      try {
        const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByIdentification/${id}`
        )
        if (checkExistingid) {
          return {
            data: response.data.esFallecido
          }
        } else if (response.data && !checkExistingid) {
          dispatch(loadStudent(response.data))
        } else {
          dispatch(clearStudent())
        }
        return { error: false, data: response.data }
      } catch (e) {
        return { error: true }
      }
    }

export const getBitacorasIdentidad = (data) => async (dispatch) => {
  try {
    const { pagina, cantidad, identidadId } = data
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Identidad/Persona/Bitacora/paginated/${pagina}/${cantidad}/${identidadId}`
    )
    dispatch(loadBitacoras(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    dispatch(errorBitacoras(e.message))
    return { error: e.message }
  }
}

export const getBitacorasFilter = (data) => async (dispatch) => {
  try {
    const { pagina, cantidad, filter, identidadId } = data
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Identidad/Persona/Bitacora?Pagina=${pagina}&Cantidad=${cantidad}&Filtro=${filter}&IdentidadId=${identidadId}`
    )
    dispatch(loadBitacoras(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    dispatch(errorBitacoras(e.message))
    return { error: e.message }
  }
}

export const identificacionTSE =
  (id, changeState = true) =>
    async (dispatch) => {
      try {
        const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/TSEIdentidad/GetOneByCedula/${id}`
        )
        if (changeState) {
          if (response.data) {
            dispatch(loadStudent(response.data))
          } else {
            dispatch(clearStudent())
          }
        }
        return { error: false, data: response.data }
      } catch (e) {
        return { error: true }
      }
    }

export const actualizarTSE = async (id) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/TSEIdentidad/GetOneByCedula/${id}`
    )
    return { error: false, data: response.data }
  } catch (e) {
    return { error: true }
  }
}

export const crearIdentidadPersona = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/Identidad/Persona/CreateAndUploadImage`,
      data
    )
    if (response.data?.error) {
      return { error: true, message: response.data.message }
    }
    if (response.data) {
      dispatch(loadStudent(response.data))
    } else {
      dispatch(clearStudent())
    }
    return { error: false, message: '', data: response.data }
  } catch (e) {
    dispatch(failIdentidad(handleErrors(e)))
    return { error: true, message: e.response.data.error }
  }
}

export const verificarPhoto = (image) => async (dispatch) => {
  const dta = {
    imageBase64: image
  }

  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/Identidad/Persona/VerifyPicture`,
      dta
    )
    if (response.data) {
      dispatch(loadStudent(response.data))
    } else {
      dispatch(clearStudent())
    }
    return { error: false, message: '', data: response.data }
  } catch (e) {
    dispatch(failIdentidad(handleErrors(e)))
    return { error: true, message: e.response.data.error }
  }
}

export const actualizarIdentidad = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/Identidad/Persona/UpdateAndUploadImage`,
      data
    )
    if (response.data) {
      dispatch(loadStudent(response.data))
    } else {
      dispatch(clearStudent())
    }
    return { error: false, data: response.data }
  } catch (e) {
    dispatch(failIdentidad(handleErrors(e)))
    return { error: true, message: e.response.data.error }
  }
}

export const cambiarIdentificacion = (data) => async (dispatch) => {
  try {
    const valID = await axios.get(
      `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByIdentification/${data.identificacion}`
    )

    if (valID.data) {
      return {
        exists: true
      }
    } else {
      const response = await axios.put(
        `${envVariables.BACKEND_URL}/api/Identidad/Persona/CambiarIdentificacion`,
        data
      )
      if (response.data) {
        // dispatch(loadStudent(response.data))
      } else {
        dispatch(clearStudent())
      }
      return { error: false, data: response.data }
    }
  } catch (e) {
    return { error: true }
  }
}

export const cambiarEstadoFallecido = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/Identidad/Persona/CambiarEstadoFallecido`,
      data
    )
    if (response.data) {
      dispatch(loadStudent(response.data))
    } else {
      dispatch(clearStudent())
    }
    return { error: false, data: response.data }
  } catch (e) {
    return { error: true, data: e.response.data }
  }
}

export const cleanStudent = (id) => async (dispatch) => {
  dispatch(clearStudent())
}

export const setIdentidadWizard = (data) => async (dispatch) => {
  dispatch(setId(data))
}
export const setIdentidadWizardDatos = (data) => async (dispatch) => {
  dispatch(setIdDatos(data))
}

export const setIdentidadWizardPasos = (data, step) => async (dispatch) => {
  dispatch(setPasosIdentidadWizard(data, step))
}

export const setWizardNavDataStore = (data) => (dispatch) => {
  dispatch(setWizardNavData(data))
}
export const setWizardDataStore = (data) => (dispatch) => {
  dispatch(setWizardData(data))
}
export const clearWizardDataStore = () => (dispatch) => {
  dispatch(clearWizardData())
}
export const clearWizardNavDataStore = () => (dispatch) => {
  dispatch(clearWizardNavData())
}
