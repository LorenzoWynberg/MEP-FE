import types from './types'

export interface IState {
  usuarios: {
    [key: number]: {
      data: Array<{
        nombreUsuario: string;
        identificacion: string;
        nombreCompleto: string;
        email: string;
        ultimoInicioSesion: string;
        instituciones: string;
        regionales: string;
        circuitos: string;
        nivelAcceso: string;
      }>
      size: number
      page: number
      total: number
      count: number
    }
  }
  usuariosByRegional: Array<any>
  loading: boolean;
  userRoles: Array<{
    rolAsignadoId: number;
    rolAsignadoNombre: string
    usuarioId: string;
    instituciones: string,
    institucionesId: string,
    regionales: string,
    regionalesId: string,
    circuitos: string,
    circuitosId: string,
    nivelAcceso: string,
    nivelAccesoId: string,
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    totalPages: number
  }>;
  userCircuito: Array<{
    id: number,
    nombreUsuario: string,
    identificacion: string,
    nombreCompleto: string,
    email: string,
    ultimoInicioSesion: string,
    estado: boolean,
    nivelAcceso: string,
    nivelAccesoId: string,
    rolAsignadoNombre: string,
    rolAsignadoId: string
  }>
}

const INITIAL_STATE: IState = {
  usuarios: {},
  loading: false,
  userRoles: [],
  userCircuito: [],
  usuariosByRegional: []
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case types.LOADING_USUARIO_CATALOGOS:
      return {
        ...state,
        loading: true
      }
    case types.GET_ALL_USUARIO_CATALOGOS_BY_ROL_ID:
      const newUsuarios = JSON.parse(JSON.stringify(state.usuarios))
      newUsuarios[payload.rolId] = {
        ...payload
      }
      return {
        ...state,
        loading: false,
        usuarios: JSON.parse(JSON.stringify(newUsuarios))
      }
    case types.GET_USERS_BY_REGIONAL_ID:
      return {
        ...state,
        usuariosByRegional: payload
      }
    case types.GET_ROLES_BY_USER_ID:
      return {
        ...state,
        userRoles: payload
      }
    case types.GET_USER_BY_CIRCUITO_ID:
      return {
        ...state,
        userCircuito: payload
      }
    default: return state
  }
}
