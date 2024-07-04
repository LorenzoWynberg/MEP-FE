import React, { useReducer } from 'react'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import swal from 'sweetalert'
enum TYPES {
	LOAD_ROLES_INFO,
	SET_EMAIL,
	SET_IDENTIFICACION,
	SET_USUARIO_ID,
	SET_IDENTIFICACION_ID,
	SET_SHOW_FORM,
	SET_EDITING,
	SET_ENCONTRADO,
	SET_TIPO_ID,
	SET_FULLNAME,
	SET_IDENTIDAD_ID,
	SET_ROLES_OPTIONS,
	SET_ROLE_ID,
	SET_ROLES_ACTIVOS_DATA,
	SET_HAS_USER,
	SET_FILAS
}

const initialState = {
  email: null,
  identidadId: null,
  identificacion: null,
  usuarioId: null,
  identificacionId: null,
  tipoId: null,
  showForm: false,
  isEditing: false,
  encontrado: null,
  fullName: null,
  rolesOptions: [],
  roleId: null,
  rolesActivos: [],
  hasUser: false,
  filas: []
}
const reducer = (state = initialState, action): typeof initialState => {
  const { type, payload } = action
  switch (type) {
    case TYPES.SET_EMAIL: {
      return { ...state, email: payload }
    }
    case TYPES.SET_IDENTIFICACION: {
      return { ...state, identificacion: payload }
    }
    case TYPES.SET_IDENTIFICACION_ID: {
      return { ...state, identificacionId: payload }
    }
    case TYPES.SET_USUARIO_ID: {
      return { ...state, usuarioId: payload }
    }
    case TYPES.SET_EDITING: {
      return { ...state, isEditing: payload }
    }
    case TYPES.SET_SHOW_FORM: {
      return { ...state, showForm: payload }
    }
    case TYPES.SET_ENCONTRADO: {
      return { ...state, encontrado: payload }
    }
    case TYPES.SET_TIPO_ID: {
      return { ...state, tipoId: payload }
    }
    case TYPES.SET_FULLNAME: {
      return { ...state, fullName: payload }
    }
    case TYPES.SET_IDENTIDAD_ID: {
      return { ...state, identidadId: payload }
    }
    case TYPES.SET_ROLES_OPTIONS: {
      return { ...state, rolesOptions: payload }
    }
    case TYPES.SET_ROLE_ID: {
      return { ...state, roleId: payload }
    }
    case TYPES.SET_ROLES_ACTIVOS_DATA: {
      return { ...state, rolesActivos: payload }
    }
    case TYPES.SET_HAS_USER: {
      return { ...state, hasUser: payload }
    }
    case TYPES.SET_FILAS: {
      return { ...state, filas: payload }
    }
    default:
      return state
  }
}

const useCuentaSaber = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const questionAlert = (props: {
		title: string
		msg: string
		cancelText?: string
		okText?: string
		icon: 'warning' | 'error' | 'success' | 'info'
		dangerMode: boolean
	}) => {
    return swal({
      title: props.title,
      icon: props.icon,
      text: props.msg,
      className: 'text-alert-modal',
      buttons: {
        cancelar: {
          text: props.cancelText || 'Cancelar',
          value: false,
          className: 'btn-gray-color'
        },
        aceptar: {
          text: props.okText || 'Sí, seguro',
          value: true,
          className: 'btn-alert-color'
        }
      }
    })
  }
  const setEmail = (text) => {
    dispatch({ type: TYPES.SET_EMAIL, payload: text })
  }
  const setIdentificacion = (text) => {
    dispatch({ type: TYPES.SET_IDENTIFICACION, payload: text })
  }
  const setUsuarioId = (id) => {
    dispatch({ type: TYPES.SET_USUARIO_ID, payload: id })
  }
  const toggleForm = (show) => {
    dispatch({ type: TYPES.SET_SHOW_FORM, payload: show })
  }
  const toggleEditing = (editing) => {
    dispatch({ type: TYPES.SET_EDITING, payload: editing })
  }
  const setEncontado = (found) => {
    dispatch({ type: TYPES.SET_ENCONTRADO, payload: found })
  }
  const setTipoIdentificacion = (obj) => {
    dispatch({ type: TYPES.SET_TIPO_ID, payload: obj })
  }
  const setFullName = (text) => {
    dispatch({ type: TYPES.SET_FULLNAME, payload: text })
  }
  const setIdentidadId = (id) => {
    dispatch({ type: TYPES.SET_IDENTIDAD_ID, payload: id })
  }
  const setRolesOptions = (arr) => {
    dispatch({ type: TYPES.SET_ROLES_OPTIONS, payload: arr })
  }
  const setRoleId = (obj) => {
    dispatch({ type: TYPES.SET_ROLE_ID, payload: obj })
  }
  const setRolesActivos = (arr) => {
    dispatch({ type: TYPES.SET_ROLES_ACTIVOS_DATA, payload: arr })
  }
  const setHasUser = (has) => {
    dispatch({ type: TYPES.SET_HAS_USER, payload: has })
  }
  const setFilas = (arr) => {
    dispatch({ type: TYPES.SET_FILAS, payload: arr })
  }
  const fetchIdentidad = async (tipoId, identificacion) => {
    try {
      const url = `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByTipoIdAndId/${tipoId}_${identificacion}`
      const response = await axios.get<any>(url)
      if (response.data && response.data.id > 0) {
        const { id, nombre, primerApellido, segundoApellido } =
					response.data

        return response.data
      }
    } catch (e) {
      console.log(e)
    }
  }
  const fetchFullRolInfoByUsuarioId = async (usuarioId) => {
    try {
      const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetFullRolInfoByUsuarioId?usuarioId=${usuarioId}`
      const response = await axios.get<any>(url)
      return response.data
    } catch (e) {
      console.log(e)
    }
  }
  const createUsuario = async (
    correo,
    identidadId,
    identificacion,
    institucionId,
    rolId
  ) => {
    try {
      const body = {
        Email: correo,
        IdentidadId: identidadId,
        AlcanceId: [institucionId],
        NivelAccesoId: 1,
        NombreUsuario: identificacion,
        RolId: rolId
      }
      const response = await axios.post(
				`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/CrearUsuario`,
				body
      )

      return response.data
    } catch (e) {
      console.log(e)
    }
  }
  const updateUsuario = async (correo, rolId, userId, institucionId) => {
    try {
      const body = {
        Email: correo,
        UserId: userId,
        Roles: [
          /* {
						RoleId: rolId,
						AlcanceId: institucionId,
						NivelAccesoId: 1
					} */
        ]
      }
      const response = await axios.put(
				`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/Actualizar`,
				body
      )

      return response.data
    } catch (e) {
      console.log(e)
    }
  }
  const getRolesInfoByUserId = async (userId) => {
    try {
      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetRolesInfoByUserId?userId=${userId}`
      )
      return response.data
    } catch (e) {
      console.log(e)
    }
  }
  const updateActivaInactivaUsuario = async (usuarioId, estado) => {
    // api/Areas/GestorCatalogos/UsuarioCatalogo/ActivareInactivarUsuario/{userId}/{activo}
    try {
      const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ActivareInactivarUsuario/${usuarioId}/${estado}`
      const response = await axios.put<any>(url)
      return response.data
    } catch (e) {
      console.log(e)
      throw e
    }
  }
  const resetContrasenia = async (userId) => {
    //
    try {
      const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ResetPassword/${userId}`
      const response = await axios.put<any>(url)
      return response.data
    } catch (e) {
      console.log(e)
      throw e
    }
  }
  const deleteUsuario = async (userId) => {
    //
    try {
      const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/Eliminar/${userId}`
      const response = await axios.delete<any>(url)
      return response.data
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  return {
    questionAlert,
    createUsuario,
    updateUsuario,
    fetchIdentidad,
    getRolesInfoByUserId,
    fetchFullRolInfoByUsuarioId,
    state,
    updateActivaInactivaUsuario,
    resetContrasenia,
    deleteUsuario,
    stateManage: {
      setEmail,
      setIdentificacion,
      setUsuarioId,
      toggleForm,
      toggleEditing,
      setEncontado,
      setTipoIdentificacion,
      setFullName,
      setIdentidadId,
      setRolesOptions,
      setRoleId,
      setRolesActivos,
      setHasUser,
      setFilas
    }
  }
}

export default useCuentaSaber
