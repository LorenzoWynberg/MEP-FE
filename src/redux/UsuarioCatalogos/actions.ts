import axios from 'axios'

import types from './types'
import { envVariables } from 'Constants/enviroment'

export const getAllUsuarioCatalogosByRolId =
	(rolId, page = 1, size = 10, filter = 'NULL') =>
	  async (dispatch, getState) => {
	    try {
	      dispatch({
	        type: types.LOADING_USUARIO_CATALOGOS
	      })
	      const response = await axios.get<Array<any>>(
					`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllUsuarioCatalogosbyRolId/${rolId},${filter},${page},${size}`
	      )

	      const fomattedData = response.data.map((el) => {
	        const institucionesId = el?.institucionesId?.split(',')
	        const circuitosId = el?.circuitosId?.split(',')
	        const regionalesId = el?.regionalesId?.split(',')
	        const instituciones = el?.instituciones
	          .split(',')
	          .map((item, institucionIndex) => ({
	            nombre: item,
	            id: institucionesId[institucionIndex]
	          }))
	        const circuitos = el?.circuitos
	          ?.split(',')
	          .map((item, circuitoIndex) => ({
	            nombre: item,
	            id: circuitosId[circuitoIndex]
	          }))
	        const regionales = el?.regionales
	          ?.split(',')
	          .map((item, regionalIndex) => ({
	            nombre: item,
	            id: regionalesId[regionalIndex]
	          }))
	        return {
	          ...el,
	          instituciones,
	          circuitos,
	          regionales
	        }
	      })

	      dispatch({
	        type: types.GET_ALL_USUARIO_CATALOGOS_BY_ROL_ID,
	        payload: {
	          data: fomattedData,
	          rolId,
	          size: fomattedData[0]?.pageSize,
	          page: fomattedData[0]?.pageNumber,
	          total: fomattedData[0]?.totalPages,
	          count: fomattedData[0]?.totalCount
	        }
	      })
	      return { error: false }
	    } catch (error) {
	      return { error: true }
	    }
	  }

interface IUser {
	nombreUsuario: string
	identidadId: number
	email: string
	instituciones: Array<any>
	circuitos: Array<any>
	regionales: Array<any>
	userId?: number
	roles: [
		{
			roleId: number
			nivelAccesoId: number
			alcanceId: number
		}
	]
}

export const getUsersByRegionalId = (regionalId) => async (dispatch) => {
  try {
    const res = await axios.get(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllUsuarioCatalogobyRegionalId/${regionalId}`)
    dispatch({
      type: types.GET_USERS_BY_REGIONAL_ID,
      payload: res.data
    })
    return { error: false }
  } catch (error) {
    return { error: true }
  }
}

export const resetUserPassword = (userId) => async (dispatch) => {
  try {
    const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ResetPassword/${userId}`
    const response = await axios.put<any>(url)
    return response.data
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const deleteUsuarioRegional = (userId, regionalId) => async (dispatch) => {
  try {
    await axios.delete<any>(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/Eliminar/${userId}`)
    const res = await axios.get(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllUsuarioCatalogobyRegionalId/${regionalId}`)
    dispatch({
      type: types.GET_USERS_BY_REGIONAL_ID,
      payload: res.data
    })
    return { error: false }
  } catch (e) {
    return { error: true }
  }
}

export const updateActivaInactivaUsuario = (usuarioId, estado, regionalId) => async (dispatch) => {
  try {
    const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ActivareInactivarUsuario/${usuarioId}/${estado}`
    await axios.put<any>(url)
    return { error: false }
  } catch (e) {
    return { error: true }
  }
}

export const updateActivaInactivaUsuarioRegional = (usuarioId, estado, regionalId) => async (dispatch) => {
  try {
    const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ActivareInactivarUsuario/${usuarioId}/${estado}`
    await axios.put<any>(url)
    const resUsers = await axios.get(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllUsuarioCatalogobyRegionalId/${regionalId}`)
    dispatch({
      type: types.GET_USERS_BY_REGIONAL_ID,
      payload: resUsers.data
    })
    return { error: false }
  } catch (e) {
    return { error: true }
  }
}

export const updateActivaInactivaUsuarioCircuito = (usuarioId, estado) => async (dispatch) => {
  try {
    const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ActivareInactivarUsuario/${usuarioId}/${estado}`
    const response = await axios.put<any>(url)
    /* dispatch({
			type: types.GET_USER_BY_CIRCUITO_ID,
			payload: response.data
		}) */
    return { error: false }
  } catch (e) {
    return { error: true }
  }
}

export const createUserByRegionalId = (data: {
	nombreUsuario: string
	email: string
	identidadId: number,
	rolId: number,
	nivelAccesoId: number,
	alcanceId: number
}, regionalId) => async (dispatch) => {
  try {
    const res = await axios.post(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/CrearUsuarioRegionaloCircuital`, data)
    if (res?.data?.error) {
      return {
        error: true,
        message: res?.data?.mensajeError
      }
    }
    const resUsers = await axios.get(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllUsuarioCatalogobyRegionalId/${regionalId}`)
    dispatch({
      type: types.GET_USERS_BY_REGIONAL_ID,
      payload: resUsers.data
    })
    return { error: false }
  } catch (error) {
    return { error: true }
  }
}

export const updateUserByRegionalId = (data: {
	nombreUsuario: string
	email: string
	identidadId: number,
	roles: Array<{
		rolId: number,
		nivelAccesoId: number,
		alcanceId: number,
	}>
}, regionalId) => async (dispatch) => {
  try {
    const res = await axios.put(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ActualizarUsuarioRegionaloCircuital`, data)
    if (res?.data?.error) {
      return {
        error: true,
        message: res?.data?.mensajeError
      }
    }
    const resUsers = await axios.get(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllUsuarioCatalogobyRegionalId/${regionalId}`)
    dispatch({
      type: types.GET_USERS_BY_REGIONAL_ID,
      payload: resUsers.data
    })
    return { error: false }
  } catch (error) {
    return { error: true }
  }
}

export const createUsuario = (data: IUser) => async (dispatch) => {
  try {
    dispatch({
      type: types.LOADING_USUARIO_CATALOGOS
    })
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/Crear`,
			data
    )

    return {
      error: response.data.error,
      mensajeError: response.data.mensajeError
    }
  } catch (error) {
    return {
      error: true,
      mensajeError: 'Ha ocurrido un error al crear el usuario.'
    }
  }
}

export const createUsuarioCatalogo =
	(data: {
		Email: string
		IdentidadId: string
		AlcanceId: Array<number>
		NivelAccesoId: number
		NombreUsuario: string
		RolId: number
	}) =>
	  async (dispatch) => {
	    try {
	      // data.NivelAccesoId = 4
	      dispatch({
	        type: types.LOADING_USUARIO_CATALOGOS
	      })
	      const response = await axios.post(
					`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/CrearUsuario`,
					data
	      )

	      return {
	        error: response.data.error,
	        mensajeError: response.data.mensajeError
	      }
	    } catch (error) {
	      return {
	        error: true,
	        mensajeError: 'Ha ocurrido un error al crear el usuario.'
	      }
	    }
	  }

export const updateUsuarioCatalogo =
	(data: {
		userId: string
		email: string
		Roles: Array<{
			roleId: number
			nivelAccesoId: number
			alcanceId: number
		}>
	}) =>
	  async (dispatch) => {
	    try {
	      // data.NivelAccesoId = 4
	      dispatch({
	        type: types.LOADING_USUARIO_CATALOGOS
	      })
	      const response = await axios.put(
					`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/Actualizar`,
					{
					  userId: data.userId,
					  email: data.email,
					  roles: data.Roles
					}
	      )

	      return {
	        error: response.data.error,
	        mensajeError: response.data.mensajeError
	      }
	    } catch (error) {
	      return {
	        error: true,
	        mensajeError: 'Ha ocurrido un error al crear el usuario.'
	      }
	    }
	  }

export const resetPassword = (userId: number) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ResetPassword/${userId}`
    )

    if (response.data > 0) {
      return { error: false, mensajeError: '' }
    } else {
      return {
        error: true,
        mensajeError:
					'Ha ocurrido un error al intentar resetear la contraseña.'
      }
    }
  } catch (e) {
    if (e.response) {
      return {
        error: true,
        message: e.response.data.error
      }
    } else {
      return {
        error: true,
        message:
					'Ha ocurrido un error al intentar resetear la contraseña.'
      }
    }
  }
}

export const resetPasswordByUsernameOrEmail =
	({ username }: { username: string }) =>
	  async (dispatch) => {
	    try {
	      const res = await axios.put(
					`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ResetPasswordByUsernameOrEmail/${username}`
	      )
	      return res
	    } catch (e) {
	      if (e.response) {
	        return {
	          error: true,
	          message: e.response.data.error
	        }
	      } else {
	        return {
	          error: true,
	          message:
							'Ha ocurrido un error al intentar resetear la contraseña.'
	        }
	      }
	    }
	  }

export const editUser = (data: IUser) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/Actualizar`,
			data
    )

    if (response.data.error != undefined) {
      return { error: true, mensajeError: response.data.mensajeError }
    } else {
      dispatch({
        type: types.EDIT_USUARIO_CATALOGO,
        payload: response.data.usuario
      })

      return { error: false, mensajeError: '' }
    }
  } catch (error) {
    return {
      error: true,
      mensajeError: 'Ha ocurrido un error al editar el usuario. '
    }
  }
}

export const removeUser = (userId: number) => async (dispatch) => {
  try {
    const response = await axios.delete(
			`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/Eliminar/${userId}`
    )
    dispatch({
      type: types.REMOVE_USUARIO_CATALOGO,
      payload: userId
    })
    return { error: false }
  } catch (error) {
    return { error: true }
  }
}

export const getRolesByUserId =
	(userId: number, page = -1, size = -1) =>
	  async (dispatch) => {
	    try {
	      const res: any = await axios.get(
					`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllRolsbyUserId/${userId},${page},${size}`
	      )
	      // const fomattedData = res.data.map((el) => {
	      //   const institucionesId = el?.institucionesId?.split(',');
	      //   const circuitosId = el?.circuitosId?.split(',');
	      //   const regionalesId = el?.regionalesId?.split(',');
	      //   const instituciones = el?.instituciones.split(',').map((item, institucionIndex) => ({ nombre: item, id: institucionesId[institucionIndex] }))
	      //   const circuitos = el?.circuitos?.split(',').map((item, circuitoIndex) => ({ nombre: item, id: circuitosId[circuitoIndex] }));
	      //   const regionales = el?.regionales?.split(',').map((item, regionalIndex) => ({ nombre: item, id: regionalesId[regionalIndex] }));
	      //   return {
	      //     ...el,
	      //     instituciones,
	      //     circuitos,
	      //     regionales,
	      //   }
	      // })
	      dispatch({
	        type: types.GET_ROLES_BY_USER_ID,
	        payload: res.data
	      })

	      return { error: false }
	    } catch (error) {
	      return { error: true }
	    }
	  }

export const getUserByCircuitoId = (circuitoId) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllUsuarioCatalogobyCircuitalId/${circuitoId}`)
    dispatch({
      type: types.GET_USER_BY_CIRCUITO_ID,
      payload: response.data
    })
    return { error: false }
  } catch (error) {
    return { error: true }
  }
}

export const createUserRegionalCircuital = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/CrearUsuarioRegionaloCircuital`, data)

    /* dispatch({
			type: types.GET_USER_BY_CIRCUITO_ID,
			payload: response.data
		}) */
    return { error: response.data.error || false, response: response.data }
  } catch (error) {
    return { error: true }
  }
}

export const editUserRegionalCircuital = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ActualizarUsuarioRegionaloCircuital`, data)
    /* dispatch({
			type: types.GET_USER_BY_CIRCUITO_ID,
			payload: response.data
		}) */
    return { error: false, response: response.data }
  } catch (error) {
    return { error: true }
  }
}
