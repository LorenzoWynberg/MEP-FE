import React, { useState, useEffect } from 'react'
import withRouter from 'react-router-dom/withRouter'
import MensajeViewProgramado from './programados/MensajeViewProgramado'
import ModalView from './ModalView'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import {
  GetComunicadosPaginados,
  CambiarEstadoComunicado,
  GetBandejaCorreoPaginados,
  changeEntityList
} from '../../../../redux/comunicados/actions'
import Bandeja from '../Bandeja'
import ItemBadejaListProgramado from './programados/ItemBadejaListProgramado'

const Programados = (props) => {
  const { itemSelected, setItemSelected } = props

  const [openModalView, setOpenModalView] = useState(false)
  const [propsModalView, setPropsModalView] = useState({
    title: '',
    size: '',
    icon: '',
    textAceptar: '',
    action: () => {},
    children: ''
  })
  const [data, setData] = useState({
    entityList: [],
    totalCount: 0
  })

  const [pagina, setPagina] = useState(0)
  const [cantidadPorPagina, setCantidadPorPagina] = useState(20)

  const state = useSelector((store) => {
    return {
      ...store.comunicados
    }
  })

  const actions = useActions({
    GetComunicadosPaginados,
    CambiarEstadoComunicado,
    GetBandejaCorreoPaginados,
    changeEntityList
  })

  useEffect(() => {
    props.setItemSelected({})
  }, [])

  useEffect(() => {
    cargarComunicadosPorEstado(0)
  }, [props.textoFiltro])

  const cargarComunicadosPorEstado = async (page) => {
    const _response = await actions.GetBandejaCorreoPaginados(
      "'5'", // Programados
      '0',
      page,
      cantidadPorPagina,
      'programados',
      props.textoFiltro
    )
    props.setItemSelected({})
  }

  const actionEnviarPapelera = async (id) => {
    setPropsModalView({
      title: 'Enviar a papelera',
      action: () => {
        enviarPapelera(id)
      },
      textAceptar: 'Sí, enviar',
      size: 'md',
      children: (
        <p
          style={{
					  paddingTop: 20,
					  width: '100%',
					  padding: 0,
					  textAlign: 'center'
          }}
        >
          ¿Está seguro que desea enviar a Papelera el comunicado?
        </p>
      )
    })

    setOpenModalView(true)
  }

  const enviarPapelera = async (id) => {
    const _Estados = state.estados
    const _estadoPapelera = _Estados.find((x) => x.codigo === '4')

    if (_estadoPapelera !== undefined) {
      // Si ya cargó los estados

      const _response = await actions.CambiarEstadoComunicado(
        id,
        _estadoPapelera.id
      )
      if (!_response.error) {
        setOpenModalView(false)
        props.snackBarShow(
          'Se ha enviado a la Papelera y se ha cancelado el envío programado.',
          'success'
        )

        const _data = data.entityList.map((item) => {
          if (item.bandejaCorreoId === id) {
            return {
              ...item,
              estadoCodigo: '2'
            }
          } else {
            return item
          }
        })
        cargarComunicadosPorEstado(pagina)
        actions.changeEntityList('favoritos', _data)
      }
    }
  }

  const actionCancelarEnvio = async (id) => {
    setPropsModalView({
      title: 'Cancelar envío',
      action: () => {
        cancelarEnvio(id)
      },
      textAceptar: 'Sí, cancelar',
      size: 'md',
      children: (
        <p style={{ paddingTop: 20, width: '100%' }}>
          ¿Está seguro que desea cancelar el envío?
        </p>
      )
    })

    setOpenModalView(true)
  }

  const cancelarEnvio = async (id) => {
    const _Estados = state.estados
    const _estadoPapelera = _Estados.find((x) => x.codigo === '3')

    if (_estadoPapelera !== undefined) {
      // Si ya cargó los estados
      const _response = await actions.CambiarEstadoComunicado(
        id,
        _estadoPapelera.id
      )
      if (!_response.error) {
        setOpenModalView(false)
        props.snackBarShow(
          'El comunicado se ha movido a la Borradores.',
          'success'
        )
        const _data = data.entityList.map((item) => {
          if (item.bandejaCorreoId === id) {
            return {
              ...item,
              estadoCodigo: '2'
            }
          } else {
            return item
          }
        })
        cargarComunicadosPorEstado(pagina)
        actions.changeEntityList('favoritos', _data)
      }
    }
  }

  return (
    <>
      <Bandeja
        data={state.programados.entityList}
        itemSelected={itemSelected}
        setItemSelected={setItemSelected}
        enviarPapelera={actionEnviarPapelera}
        snackBarShow={props.snackBarShow}
        ItemBandeja={ItemBadejaListProgramado}
        selectedItems={props.selectedItems}
        handleSelectItems={props.handleSelectItems}
        fetchMoreData={() => {
				  setPagina(pagina + 1)
				  cargarComunicadosPorEstado(pagina + 1)
        }}
      />
      {itemSelected?.bandejaCorreoId !== undefined && (
        <MensajeViewProgramado
          data={itemSelected}
          cancelarEnvio={actionCancelarEnvio}
          snackBarShow={props.snackBarShow}
        />
      )}

      {openModalView && (
        <ModalView
          open={openModalView}
          onClose={() => {
					  setOpenModalView(false)
          }}
          {...propsModalView}
        >
          {propsModalView.children}
        </ModalView>
      )}
    </>
  )
}

export default withRouter(Programados)
