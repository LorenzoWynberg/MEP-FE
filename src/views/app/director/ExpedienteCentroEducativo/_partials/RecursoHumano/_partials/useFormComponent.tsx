import React, { useReducer } from 'react'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const defaultTipoIdentificacion = [
  { value: 1, label: 'CÉDULA' },
  { value: 3, label: 'DIMEX' },
  { value: 4, label: 'YÍS RÖ - IDENTIFICACIÓN MEP' }
]

const defaultRoles = [
  { value: 11, label: 'DOCENTE' },
  { value: 12, label: 'ADMINISTRATIVO' }
]

enum TYPES {
	SET_FULLNAME,
	SET_TIPO_IDENTIFICACION_ID,
	SET_NUMERO_IDENTIFICACION,
	SET_EMAIL,
	SET_ROL_ID,
	SET_LOADING,
	SET_SHOW_REGISTER_MODAL,
	CLEAR_STATE
}

const initialState = {
  identidadId: null,
  tipoIdentificacionId: defaultTipoIdentificacion[0],
  numeroIdentificacion: null,
  fullname: '',
  email: null,
  tipoIdentificacionOptions: defaultTipoIdentificacion,
  rolesOptions: defaultRoles,
  rolId: defaultRoles[0],
  loading: false,
  encontrado: null,
  showRegisterModal: false
}

const reducer = (state = initialState, action): typeof initialState => {
  const { type, payload } = action
  switch (type) {
    case TYPES.SET_FULLNAME: {
      const { identidadId, nombre, encontrado, email } = payload
      return {
        ...state,
        identidadId,
        fullname: nombre,
        encontrado,
        email
      }
    }
    case TYPES.SET_NUMERO_IDENTIFICACION: {
      return { ...state, numeroIdentificacion: payload }
    }
    case TYPES.SET_TIPO_IDENTIFICACION_ID: {
      return { ...state, tipoIdentificacionId: payload }
    }
    case TYPES.SET_LOADING: {
      return { ...state, loading: payload }
    }
    case TYPES.SET_SHOW_REGISTER_MODAL: {
      return { ...state, showRegisterModal: payload }
    }
    case TYPES.SET_EMAIL: {
      return { ...state, email: payload }
    }
    case TYPES.SET_ROL_ID: {
      return { ...state, rolId: payload }
    }
    case TYPES.CLEAR_STATE: {
      return { ...initialState }
    }
    default: {
      throw new Error('Error no existe el tipo ' + type)
    }
  }
}

const useFormComponent = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const toggleLoading = (loading?: boolean) => {
    dispatch({
      type: TYPES.SET_LOADING,
      payload:
				loading == undefined || loading == null
				  ? !state.loading
				  : loading
    })
  }

  const toggleRegisterModal = (show?: boolean) => {
    dispatch({
      type: TYPES.SET_SHOW_REGISTER_MODAL,
      payload:
				show == undefined || show == null
				  ? !state.showRegisterModal
				  : show
    })
  }
  const fetchIdentidad = async (tipoId, identificacion) => {
    try {
      const url = `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByTipoIdAndId/${tipoId}_${identificacion}`
      const response = await axios.get<any>(url)
      if (response.data && response.data.id > 0) {
        const { id, nombre, primerApellido, segundoApellido } =
					response.data
        const email = response.data?.identidadDatos?.email
        dispatch({
          type: TYPES.SET_FULLNAME,
          payload: {
            email,
            identidadId: id,
            nombre: `${nombre} ${primerApellido} ${segundoApellido}`,
            encontrado: true
          }
        })

        return response.data
      } else {
        dispatch({
          type: TYPES.SET_FULLNAME,
          payload: {
            email: null,
            identidadId: null,
            nombre: null,
            encontrado: false
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
  const onChangeSelectTipoIdentificacion = (obj) => {
    // const { value } = obj
    dispatch({ type: TYPES.SET_TIPO_IDENTIFICACION_ID, payload: obj })
  }
  const onChangeInputNumeroIdentificacion = (e) => {
    const value = e.target.value
    dispatch({ type: TYPES.SET_NUMERO_IDENTIFICACION, payload: value })

    if (value && value.length > 8 && state?.tipoIdentificacionId?.value) {
      toggleLoading(true)
      fetchIdentidad(state.tipoIdentificacionId.value, value).then((_) =>
        toggleLoading(false)
      )
    } else {
      dispatch({
        type: TYPES.SET_FULLNAME,
        payload: { nombre: '', encontrado: null }
      })
    }
  }
  const clearState = () => {
    dispatch({ type: TYPES.CLEAR_STATE })
  }
  const onChangeInputEmail = (e) => {
    const value = e.target.value
    dispatch({ type: TYPES.SET_EMAIL, payload: value })
  }
  const onChangeSelectRol = (obj) => {
    // const { value } = obj
    dispatch({ type: TYPES.SET_ROL_ID, payload: obj })
    // setViewState(value)
  }
  const onConfirmRegisterModalCallback = (response) => {
    if (!response) return
    const tipoIdObject = response.datos.find((i) => i.catalogoId == 1)
    const tipoIdLocalObject = state.tipoIdentificacionOptions.find(
      (i) => i.value == tipoIdObject.elementoId
    )

    onChangeSelectTipoIdentificacion(tipoIdLocalObject)
    dispatch({
      type: TYPES.SET_NUMERO_IDENTIFICACION,
      payload: response.identificacion
    })
    fetchIdentidad(tipoIdObject.elementoId, response.identificacion)
    toggleRegisterModal(false)
  }
  return {
    onChangeSelectTipoIdentificacion,
    onChangeInputNumeroIdentificacion,
    onChangeInputEmail,
    onChangeSelectRol,
    toggleRegisterModal,
    onConfirmRegisterModalCallback,
    clearState,
    loading: state.loading,
    identidadId: state.identidadId,
    email: state.email,
    rolId: state.rolId,
    tipoIdentificacionOptions: state.tipoIdentificacionOptions,
    rolesOptions: state.rolesOptions,
    tipoIdentificacionId: state.tipoIdentificacionId,
    numeroIdentificacion: state.numeroIdentificacion,
    encontrado: state.encontrado,
    fullname: state.fullname,
    showRegisterModal: state.showRegisterModal,
    fetchIdentidad
  }
}

export default useFormComponent
