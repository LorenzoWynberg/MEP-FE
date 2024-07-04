import types from './types';

export interface IState {
    lessons: Array<{
        id: number
        estado: boolean
        cantidadLecciones: number
        rige: Date | string
        vence: Date | string
        sB_ProfesoresInstitucion_Id: number
        esActivo: boolean
        pageNumber: number
        pageSize: number
        totalCount: number
        totalPages: number
    }>
}

const INITIAL_STATE: IState = {
    lessons: []
};

export default (state = INITIAL_STATE, action) => {
    const { payload, type } = action
    switch (type) {
        case types.GET_PROFESSOR_LESSONS:
            return {
                ...state,
                lessons: payload,
            }
        default:
            return state
    }
}