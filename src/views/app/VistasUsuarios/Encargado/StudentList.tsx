import React, { useEffect } from 'react'
import { CardContainer, Card } from '../Componentes'
import { useHistory } from 'react-router-dom'
import { useSelector, connect } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { setEstudiantesDeEncargado, setUsuarioActual } from 'Redux/VistasUsuarios/actions'
import { useVistasUsuarios } from '../Hooks'
const FirstScreen = (props) => {
  const history = useHistory()
  const actions = useActions({
    setEstudiantesDeEncargado,
    setUsuarioActual
  })
  const state = useSelector((store:any) => {
    return {
      usuarioActual: store.VistasUsuarios.usuarioActual,
      estudiantesEncargado: store.VistasUsuarios.estudiantesEncargado
    }
  })

  const { setEstudianteIndex, loadEncargadoData, setEstudianteSeleccionadoEvent } = useVistasUsuarios()

  useEffect(() => {
    const fetch = async () => {
      await actions.setUsuarioActual()
      await loadEncargadoData()
    }
    fetch()
  }, [])
  useEffect(() => {
    if (!state?.usuarioActual?.id) return

    const fetch = async () => {
      await actions.setEstudiantesDeEncargado(state.usuarioActual.id)
    }

    fetch()
  }, [state.usuarioActual])

  const onCardClickEvent = async (index) => {
    // setEstudianteIndex(index)
    setEstudianteSeleccionadoEvent(state.estudiantesEncargado[index])
    history.push(`/view/estudiante/${index}`)
  }

  return (
    <>
      <h2>
        <b>Expediente Estudiantil</b>
      </h2>
      <CardContainer>
        {props.estudiantesEncargado.map((item, index) => {
          return <Card key={index} institutos={item.info_academica?.map(item => item.nombreCentroEducativo)} image={item.fotografiaUrl || null} onClick={() => onCardClickEvent(index)} name={item.nombre} />
        })}

      </CardContainer>
    </>
  )
}
const mapStateToProps = store => {
  return {
    estudiantesEncargado: store.VistasUsuarios.estudiantesEncargado,
    usuarioActual: store.VistasUsuarios.usuarioActual,
    estudiantesEncargadoIndex: store.VistasUsuarios.estudiantesEncargadoIndex,
    info_academica: store.VistasUsuarios.info_academica
  }
}
export default connect(mapStateToProps)(FirstScreen)
