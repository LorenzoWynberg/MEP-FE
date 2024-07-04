
const getEstadoAsignatura = (registroAsignatura: number | null) => {
  switch (registroAsignatura) {
    case 1:
    case 7:
      return 1
    case 4:
    case 2:
      return 2
    case 5:
    case 3:
      return 4
    default:
      return 1
  }
}

export default getEstadoAsignatura
