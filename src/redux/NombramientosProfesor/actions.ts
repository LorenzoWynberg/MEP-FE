import axios from "axios"
import { envVariables } from 'Constants/enviroment'
import types from './types'

export const getProfessorLessons = (professorId, page = 1, size = 10) => async (dispatch) => {
    try {
        const res = await axios.get(`${envVariables.BACKEND_URL}/api/NombramientosProfesor/GetAllNombramientosbyProfesorId/${professorId}/${page}/${size}`)
        dispatch({
            type: types.GET_PROFESSOR_LESSONS,
            payload: res.data,
        })
        return { error: false }
    } catch (error) {
       return { error: true }
    }
}

export const createProfessorLesson = (data: { 
    cantidadLecciones: number
    rige: string | Date
    vence: string | Date
    profesoresInstitucion_Id: number
}) => async (dispatch) => {
    try {
        const res = await axios.post(`${envVariables.BACKEND_URL}/api/NombramientosProfesor`, data)
        dispatch({
            type: types.CREATE_PROFESOR_LESSON,
            payload: res.data,
        })
        return { error: false }
    } catch (error) {
       return { error: true }
    }
}

export const updateProfessorLesson = (data: {  "id": 0,
    cantidadLecciones: number
    rige: string | Date
    vence: string | Date
    profesoresInstitucion_Id: number
}) => async (dispatch) => {
    try {
        const res = await axios.put(`${envVariables.BACKEND_URL}/api/NombramientosProfesor`)
        dispatch({
            type: types.UPDATE_PROFESOR_LESSON,
            payload: res.data,
        })
        return { error: false }
    } catch (error) {
       return { error: true }
    }
}
export const deleteProfessorLesson = (nombramientosProfesorId) => async (dispatch) => {
    try {
        const res = await axios.delete(`${envVariables.BACKEND_URL}/api/NombramientosProfesor/${nombramientosProfesorId}`)
        dispatch({
            type: types.DELETE_PROFESOR_LESSON,
            payload: res.data,
        })
        return { error: false }
    } catch (error) {
       return { error: true }
    }
}