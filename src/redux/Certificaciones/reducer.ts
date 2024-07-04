const INITIAL_STATE = {
  students: [],
  courses: [],
  groups: [],
  studentSelected: {},
  groupSelected: {},
  courseSelected: {},
  asignaturasNotas: {},
  asignaturasLogros: [],
  loading: false
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case 'CERTIFICADO_GET_STUDENTS':
      return {
        ...state,
        students: payload,
        loading: false,
        error: ''
      }
    case 'CERTIFICADO_GET_GROUPS':
      return {
        ...state,
        groups: payload,
        loading: false,
        error: ''
      }
    case 'CERTIFICADO_GET_COURSES':
      return {
        ...state,
        courses: payload,
        loading: false,
        error: ''
      }
    case 'CERTIFICADO_SET_GROUP_SELECTED':
      return {
        ...state,
        groupSelected: payload,
        loading: false,
        error: ''
      }
    case 'CERTIFICADO_SET_STUDENT_SELECTED':
      return {
        ...state,
        studentSelected: payload,
        loading: false,
        error: ''
      }
    case 'CERTIFICADO_SET_COURSE_SELECTED':
      return {
        ...state,
        courseSelected: payload,
        loading: false,
        error: ''
      }
    case 'CERTIFICADO_GET_INFO_NOTES':
      return {
        ...state,
        asignaturasNotas: payload,
        loading: false,
        error: ''
      }
    case 'CERTIFICADO_GET_INFO_LOGROS':
      let asignaturasLogros = payload.filter(
        (x) => !!x.rubricasAprendizaje.length
      )
      asignaturasLogros = asignaturasLogros.map((asg) => {
        const _rubrica = JSON.parse(asg.rubricasAprendizaje)

        if (asg.rubricasAprendizaje.length) {
          return {
            ...asg,
            rubricas: {
              ..._rubrica,
              indicadores: _rubrica.json.length
                ? JSON.parse(_rubrica.json).Contenidos
                : []
            }
          }
        }
      })
      return {
        ...state,
        asignaturasLogros,
        loading: false,
        error: ''
      }
    default:
      return state
  }
}
