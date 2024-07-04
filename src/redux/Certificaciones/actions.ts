import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const getInfoNotas = (payload) => ({
  type: 'CERTIFICADO_GET_INFO_NOTES',
  payload
})

const getInfoLogros = (payload) => ({
  type: 'CERTIFICADO_GET_INFO_LOGROS',
  payload
})

export const getCertInfoLogros =
  (grupoId: number, student: number, asignaturaId: number) =>
    async (dispatch) => {
      try {
        const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/Areas/Reportes/Certificaciones/GenerarCertificadoLogrosNotasResponse?GrupoId=${grupoId}&IdentidadId=${student}&AsignaturaId=${asignaturaId}`
        )
        dispatch(getInfoLogros(response.data))
        return { error: false }
      } catch (e) {
        return { error: e.message }
      }
    }
export const getCertInfoNotas =
  (grupoId: number, student: number, asignaturaId: number) =>
    async (dispatch) => {
      try {
        const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/Areas/Reportes/Certificaciones/GetDatosCertificaciondeNotas?GrupoId=${grupoId}&IdentidadId=${student}&AsignaturaId=${asignaturaId}`
        )
        dispatch(getInfoNotas(response.data))
        return { error: false }
      } catch (e) {
        return { error: e.message }
      }
    }
