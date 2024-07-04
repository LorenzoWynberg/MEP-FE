import axios from 'axios'
import { envVariables } from '../../constants/enviroment'

const fetchCalificacionesByPeriodoGrupoAnio = (periodoId, grupoId, anio) => {
    const url = `${envVariables.BACKEND_URL}/api/AsignaturaGrupoEstudianteMatriculado/GetCalificacionesByGrupoIdAndPeriodoId`

    return axios.get(url,{
        params:{periodoId,grupoId,anio}
    }).then((r) => {
        const { data } = r
        return data
    })
}

export {fetchCalificacionesByPeriodoGrupoAnio}