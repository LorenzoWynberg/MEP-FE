import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { getLeccionesByProfesorID } from '../../../../../../../../redux/RecursosHumanos/actions'

const useLecciones = ({ idProfesor }) => {
  const state = useSelector(store => ({
    funcionarios: store.funcionarios.funcionarios,
    lecciones: store.funcionarios.lecciones,
    institution: store.authUser.currentInstitution
  }))
  const [leccionesAAsignar, setLeccionesAAsignar] = useState(40)
  const [leccionesAsignadas, setLeccionesAsignadas] = useState(0)
  const [leccionesDisponibles, setLeccionesDisponibles] = useState(0)

  useMemo(() => {
    if (state.lecciones.length == 0) {
      setLeccionesAsignadas(0)
      setLeccionesDisponibles(leccionesAAsignar)
      return
    }
    const { leccionesCantidad } = state.lecciones?.reduce((p, c) => ({ leccionesCantidad: p.leccionesCantidad + c.leccionesCantidad }))

    setLeccionesAsignadas(leccionesCantidad)
    setLeccionesDisponibles(leccionesAAsignar - leccionesCantidad)
  }, [leccionesAAsignar, state.lecciones])

  const actions = useActions({ getLeccionesByProfesorID })

  const getLeccionesByProfesorId = (profesorId) => {
    actions.getLeccionesByProfesorID(profesorId)
  }
  useEffect(() => {
    if (idProfesor) { getLeccionesByProfesorId(idProfesor) }
  }, [])

  return {
    lecciones: state.lecciones,
    leccionesAAsignar,
    leccionesAsignadas,
    leccionesDisponibles
  }
}

export default useLecciones
