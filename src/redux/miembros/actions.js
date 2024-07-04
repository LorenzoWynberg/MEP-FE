import {
  MEMBER_LOAD,
  MEMBER_CLEAN,
  MEMBER_ADD,
  MEMBER_LOADING,
  MEMBERS_LOAD,
  MEMBERS_LOADING,
  MEMBER_EDIT,
  MEMBERS_DELETE,
  MEMBER_ERROR
} from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import { handleErrors } from '../../utils/handleErrors'
import { loadDiscapacidades } from '../apoyos/actions'

const createMember = (payload) => ({
  type: MEMBER_ADD,
  payload
})
const alertsErrors = (payload) => ({
  type: types.ALERTS_ERRROS,
  payload
})
const editMember = (payload) => ({
  type: MEMBER_EDIT,
  payload
})

const deleteMembersFromState = (payload) => ({
  type: MEMBERS_DELETE,
  payload
})

const loadMembers = (payload) => ({
  type: MEMBERS_LOAD,
  payload
})
const loadingMembers = () => ({
  type: MEMBERS_LOADING
})

const loadMember = (payload) => ({
  type: MEMBER_LOAD,
  payload
})

const loading = () => ({
  type: MEMBER_LOADING
})

const errorDipatch = (payload) => ({
  type: MEMBER_ERROR,
  payload
})

const cleanMember = () => ({
  type: MEMBER_CLEAN
})

export const addMember = (
  data
) => async (dispatch) => {
  dispatch(loadingMembers())
  const _data = { ...data }
  _data.condicionLaboralId = _data.condicionLaboralId || 0
  _data.escolaridadId = _data.escolaridadId || 0
  _data.parentescoId = _data.parentescoId || 0
  _data.sexoId = _data.sexoId || 0
  _data.relacionId = _data.parentescoId
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/${
        !data.identificacion ? 'undocumented' : ''
      }`,
      _data
    )

    const DiscapacidadesResponse = await axios.post(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/CreateMultiple/${response.data.idIdentidad}`,
      data.discapacidades?.map((discapacidad) => {
        return {
          id: 0,
          ElementosCatalogoId: discapacidad.ElementosCatalogoId,
          identidadesId: response.data.idIdentidad,
          estado: true
        }
      })
    )
    dispatch(loadDiscapacidades(DiscapacidadesResponse.data))
    dispatch(getFamilyMembers(data?.estudianteId))
    dispatch(loadMember(response?.data))
    return { error: false, data: response?.data }
  } catch (error) {
    if (error.response?.status === 400) {
      dispatch(errorDipatch(handleErrors(error)))
    }

    return { error: error.response?.data?.error || 'Faltan rellenar campos obligatorios' }
  }
}

export const updateMember = (isValid, data, image, cb) => async (dispatch) => {
  const config = {
    onUploadProgress: cb
  }

  dispatch(loadingMembers())
  const _data = { ...data }
  try {
    if (image && isValid) {
      const profileImage = await uploadProfileImage(image, config)
      if (profileImage.error) {
        throw new Error(profileImage.message)
      }
      _data.foto = profileImage
    }
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/`,
      _data
    )
    const DiscapacidadesResponse = await axios.post(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/CreateMultiple/${data.idIdentidad}`,
      data.discapacidades?.map((discapacidad) => {
        return {
          id: 0,
          ElementosCatalogoId: discapacidad.ElementosCatalogoId,
          identidadesId: data.idIdentidad,
          estado: true
        }
      })
    )
    dispatch(loadDiscapacidades(DiscapacidadesResponse.data))
    dispatch(getFamilyMembers(data?.estudianteId))
    dispatch(loadMember(response.data))
    return { error: false }
  } catch (error) {
    if (error.response?.status === 400) {
      dispatch(errorDipatch(handleErrors(error)))
    }
    return { error: error.response?.data.error || 'Faltan rellenar campos obligatorios' }
  }
}

export const deleteMembers = (ids) => async (dispatch) => {
  dispatch(loadingMembers())
  try {
    const response = await axios.delete(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/`,
      { data: ids }
    )
    if (response.data === ids.length) {
      dispatch(deleteMembersFromState(ids))
    } else {
      throw new Error('Something happend')
    }
    return { error: false }
  } catch (error) {
    dispatch(errorDipatch())
    return { error: error.message }
  }
}

export const updateMemberResources = (
  file,
  miembroId,
  codigoElemento,
  cb
) => async (dispatch) => {
  dispatch(loadingMembers())
  const config = {
    onUploadProgress: cb
  }
  const data = new FormData()
  data.append('file', file)
  data.append('miembroId', miembroId)
  data.append('codigoElemento', codigoElemento)
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/resource`,
      data,
      config
    )
    dispatch(loadingMembers())
    return response.data
  } catch (e) {
    return { message: e.message, error: true }
  }
}

export const deleteMemberResources = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/resource?id=${id}`
    )

    return response.data
  } catch (e) {
    return { message: e.message, error: true }
  }
}

export const getFamilyMembers = (user) => async (dispatch) => {
  dispatch(loadingMembers())
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/GetMiembrosByStudent/${user}`
    )
    dispatch(loadMembers(response.data))
    return { data: response.data, error: false }
  } catch (error) {
    dispatch(errorDipatch())
    return { error: 'Uno o mas errores han ocurrido' }
  }
}

export const getFamilyMember = (memberId) => async (dispatch) => {
  dispatch(loadingMembers())
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/GetById/${memberId}`
    )
    dispatch(loadMember(response.data))
    return { error: false }
  } catch (error) {
    dispatch(errorDipatch())
    return { error: error.message }
  }
}

export const loadCurrentMember = (data) => (dispatch) => { // ----------------------------AQUII
  dispatch(loadMember(data))
}

export const cleanCurrentMember = () => (dispatch) => {
  dispatch(cleanMember())
}

const uploadProfileImage = async (file, config) => {
  const data = new FormData()
  data.append('files', file)
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/File`,
      data,
      config
    )
    return response.data[0]
  } catch (e) {
    return { message: e.message, error: true }
  }
}

const uploadresources = async (files, config) => {
  const data = new FormData()
  files.forEach((file) => {
    data.append('files', file)
  })
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/File/resources`,
      data,
      config
    )
    return response.data
  } catch (e) {
    return { message: e.message, error: true }
  }
}
