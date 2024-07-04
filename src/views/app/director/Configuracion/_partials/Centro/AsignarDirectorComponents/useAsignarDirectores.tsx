import React, { useReducer } from 'react'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import swal from 'sweetalert'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'

enum TYPES {
	SET_DIRECTOR_ACTIVO_ROW_DATA,
	SET_DIRECTORES_INACTIVOS_ROW_DATA,
	SET_LOADING,
	SET_SHOW_FORM,
	SET_EDITING,
	SET_TIPO_IDENTIFICACION,
	SET_NUMERO_IDENTIFICACION,
	SET_FULLNAME,
	SET_EMAIL,
	SET_ROL_VALUE,
	SET_SHOW_REGISTER_MODAL,
	SET_USUARIO_ID,
	SET_IDENTIDAD_ID
}

const initialState = {
  identidadId: null,
  loading: false,
  directorActivoRows: [],
  directoresInactivosRows: [],
  showForm: false,
  isEditing: false,
  tipoIdentificacion: null,
  identificacion: '',
  usuarioId: null,
  fullName: '',
  email: '',
  rolId: null,
  showRegisterModal: false
}

const reducer = (state, action): typeof initialState => {
  const { type, payload } = action
  switch (type) {
    case TYPES.SET_LOADING: {
      return { ...state, loading: payload }
    }
    case TYPES.SET_DIRECTOR_ACTIVO_ROW_DATA: {
      return { ...state, directorActivoRows: payload }
    }
    case TYPES.SET_DIRECTORES_INACTIVOS_ROW_DATA: {
      return { ...state, directoresInactivosRows: payload }
    }
    case TYPES.SET_SHOW_FORM: {
      return { ...state, showForm: payload }
    }
    case TYPES.SET_EDITING: {
      return { ...state, isEditing: payload }
    }
    case TYPES.SET_TIPO_IDENTIFICACION: {
      return { ...state, tipoIdentificacion: payload }
    }
    case TYPES.SET_NUMERO_IDENTIFICACION: {
      return { ...state, identificacion: payload }
    }
    case TYPES.SET_FULLNAME: {
      return { ...state, fullName: payload }
    }
    case TYPES.SET_EMAIL: {
      return { ...state, email: payload }
    }
    case TYPES.SET_ROL_VALUE: {
      return { ...state, rolId: payload }
    }
    case TYPES.SET_SHOW_REGISTER_MODAL: {
      return { ...state, showRegisterModal: payload }
    }
    case TYPES.SET_USUARIO_ID: {
      return { ...state, usuarioId: payload }
    }
    case TYPES.SET_IDENTIDAD_ID: {
      return { ...state, identidadId: payload }
    }
  }
}

const useAsignarDirectores = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { t } = useTranslation()
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
          text: props.cancelText || t('general>cancelar', 'Cancelar'),
          value: false,
          className: 'btn-gray-color'
        },
        aceptar: {
          text: props.okText || t('general>si_seguro', 'Sí, seguro'),
          value: true,
          className: 'btn-alert-color'
        }
      }
    })
  }

  const fetchDirectorActual = async (institucionId) => {
    const url = `${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetDirectorByInstitucionId?institucionId=${institucionId}`
    try {
      const response = await axios.get<any>(url)
      const { data: responseData } = response
      return responseData.data
    } catch (e) {
      console.log(e)
    }
  }
  const fetchDirectoresAnteriores = async (institucionId) => {
    const url = `${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetPreviusDirectorByInstitucionId?institucionId=${institucionId}`
    try {
      const response = await axios.get<any>(url)
      const { data: responseData } = response
      return responseData.data
    } catch (e) {
      console.log(e)
    }
  }
  const buildRolComponent = (key, color, nombre, fullRowItem, onRolClick) => {
    return (
      <span
        onClick={(e) => onRolClick(e, fullRowItem)}
        key={key}
        style={{
				  padding: '3px',
				  borderRadius: '5px',
				  margin: '2px',
				  background: color || 'lightgray',
				  cursor: 'pointer'
        }}
      >
        {nombre}
      </span>
    )
  }
  const buildRolColumn = (arr, fullRowItem, onRolClick) => {
    if (typeof arr === 'string') arr = JSON.parse(arr)
    arr = arr.filter((i) => i.estado === true)
    return (
      <div style={{ display: 'flex' }}>
        {arr.map((i, index) => {
				  return buildRolComponent(
				    index,
				    i.color,
				    i.nombre,
				    fullRowItem,
				    onRolClick
				  )
        })}
      </div>
    )
  }
  const fetchIdentidad = async (tipoId, identificacion) => {
    try {
      const url = `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByTipoIdAndId/${tipoId}_${identificacion}`
      const response = await axios.get<any>(url)
      if (response.data && response.data.id > 0) {
        return response.data
      }
    } catch (e) {
      console.log(e)
    }
  }
  const postAsignarDirector = async (
    usuarioId,
    institucionId,
    observaciones = null
  ) => {
    try {
      const url = `${envVariables.BACKEND_URL}/api/Admin/Institucion/Directores/Asignar`
      const body = {
        institucionId,
        usuarioId,
        observaciones
      }
      const response = await axios.post<any>(url, body)

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
  const validatorCreateUsuarioRequest = (body) => {
    const schema = yup.object({
      NombreUsuario: yup.string().required('Nombre de usuario no válido'),
      Email: yup.string().email('Ingrese un email válido'),
      IdentidadId: yup.number().positive().integer(),
      RolId: yup.number().positive().integer(),
      NivelAccesoId: yup.number().positive().integer(),
      AlcanceId: yup.array().of(yup.number())
    })
    try {
      const validated = schema.validateSync(body)
      return { error: false, object: validated }
    } catch (e) {
      return { error: true, object: e }
    }
  }
  const postCrearUsuario = async (email, identidadId, identificacion) => {
    try {
      const body = {
        Email: email,
        IdentidadId: identidadId,
        AlcanceId: [],
        NivelAccesoId: 1,
        NombreUsuario: identificacion,
        RolId: 2
      }

      const { error, object } = validatorCreateUsuarioRequest(body)
      if (error == true) {
        console.log(object)
        return
      }
      toggleLoading(true)

      const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/CrearUsuario`
      const response = await axios.post(url, object)
      toggleLoading(false)

      return response.data
      /* successMessage('Usuario creado correctamente')
			toggleForm(false) */
    } catch (e) {
      /* errorMessage('Error al crear el usuario')
			console.error(e) */
      return e
    }
  }
  const putActualizarUsuario = async (usuarioId, email, institucionId) => {
    try {
      const body = {
        Email: email,
        UserId: usuarioId,
        Roles: []
      }
      body.Roles = [
        {
          RoleId: 2,
          AlcanceId: institucionId,
          NivelAccesoId: 1
        }
      ]
      toggleLoading(true)
      const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/Actualizar`
      const response: any = await axios.put(url, body)
      toggleLoading(false)

      return response.data
      /* if (!response.data.error) {
				successMessage('Usuario actualizado correctamente')
				clearFormData()

				toggleForm(false)
			} else {
				errorMessage('Error al actualizar el usuario')
			} */
    } catch (e) {
      // errorMessage('Error al actualizar el usuario')
      // console.error(e)
      return e
    }
  }

  const setDirectorActivoRows = (rows) => {
    dispatch({
      type: TYPES.SET_DIRECTOR_ACTIVO_ROW_DATA,
      payload: rows || []
    })
  }
  const setDirectoresInactivosRows = (rows) => {
    dispatch({
      type: TYPES.SET_DIRECTORES_INACTIVOS_ROW_DATA,
      payload: rows || []
    })
  }
  const toggleLoading = (loading?) => {
    dispatch({
      type: TYPES.SET_LOADING,
      payload: loading != undefined ? loading : !state.loading
    })
  }
  const toggleRegisterModal = (show?) => {
    dispatch({
      type: TYPES.SET_SHOW_REGISTER_MODAL,
      payload: show != undefined ? show : !state.showRegisterModal
    })
  }
  const toggleForm = (show?) => {
    dispatch({
      type: TYPES.SET_SHOW_FORM,
      payload: show != undefined ? show : !state.showForm
    })
  }
  const setEditing = (editing) => {
    dispatch({ type: TYPES.SET_EDITING, payload: editing })
  }
  const setTipoIdentificacion = (tipoId) => {
    dispatch({ type: TYPES.SET_TIPO_IDENTIFICACION, payload: tipoId })
  }
  const setNumeroIdentificacion = (numeroIdentificacion) => {
    dispatch({
      type: TYPES.SET_NUMERO_IDENTIFICACION,
      payload: numeroIdentificacion
    })
  }
  const setFullname = (fullName) => {
    dispatch({ type: TYPES.SET_FULLNAME, payload: fullName })
  }
  const setEmail = (email) => {
    dispatch({ type: TYPES.SET_EMAIL, payload: email })
  }
  const setRol = (rol) => {
    dispatch({ type: TYPES.SET_ROL_VALUE, payload: rol })
  }
  const setUsuarioId = (usuarioId) => {
    dispatch({ type: TYPES.SET_USUARIO_ID, payload: usuarioId })
  }
  const setIdentidadId = (identidadId) => {
    dispatch({ type: TYPES.SET_IDENTIDAD_ID, payload: identidadId })
  }
  const limpiarForm = () => {
    setTipoIdentificacion(null)
    setNumeroIdentificacion(null)
    setFullname('')
    setEmail(null)
    setUsuarioId(null)
    setIdentidadId(null)
  }
  return {
    fetchDirectorActual,
    fetchDirectoresAnteriores,
    buildRolColumn,
    buildRolComponent,
    state,
    fetchIdentidad,
    postAsignarDirector,
    updateActivaInactivaUsuario,
    resetContrasenia,
    deleteUsuario,
    questionAlert,
    postCrearUsuario,
    putActualizarUsuario,
    stateManage: {
      setDirectorActivoRows,
      setDirectoresInactivosRows,
      toggleLoading,
      toggleForm,
      setEditing,
      setTipoIdentificacion,
      setNumeroIdentificacion,
      setIdentidadId,
      setFullname,
      setEmail,
      setRol,
      toggleRegisterModal,
      setUsuarioId,
      limpiarForm
    }
  }
}

export default useAsignarDirectores
