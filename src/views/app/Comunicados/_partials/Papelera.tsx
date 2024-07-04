import React, { useState, useEffect } from 'react'
import withRouter from 'react-router-dom/withRouter'
import ItemBandejaListPapelera from './papelera/ItemBandejaListPapelera'
import MensajeView from './papelera/MensajeViewPapelera'
import ModalView from './ModalView'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'

import {
  GetComunicadosPaginados,
  CambiarEstadoComunicado,
  eliminarComunicado,
  GetBandejaCorreoPaginados
} from '../../../../redux/comunicados/actions'
import Bandeja from '../Bandeja'

const Papelera = (props) => {
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
  const [cantidadPorPagina, setCantidadPorPagina] = useState(10)

  const { itemSelected, setItemSelected } = props

  const state = useSelector((store) => {
    return {
      ...store.comunicados
    }
  })

  const actions = useActions({
    GetComunicadosPaginados,
    CambiarEstadoComunicado,
    eliminarComunicado,
    GetBandejaCorreoPaginados
  })

  useEffect(() => {
    props.setItemSelected({})
  }, [])

  useEffect(() => {
    cargarComunicadosPorEstado(0)
  }, [props.textoFiltro])

  useEffect(() => {
    if (props.data !== undefined) {
      setData(props.data)
      props.setItemSelected({})
    }
  }, [props.data])

  const cargarComunicadosPorEstado = async (page) => {
    const _response = await actions.GetBandejaCorreoPaginados(
      "'4'",
      '0',
      page,
      20,
      'papelera',
      props.textoFiltro
    )
    props.setItemSelected({})
  }

  const actionEliminarPermanente = async (id) => {
    setPropsModalView({
      title: 'Eliminar definitivamente',
      action: () => {
        eliminarPermanente(id)
      },
      textAceptar: 'Sí',
      size: 'md',
      children: (
        <p style={{ paddingTop: 20, width: '100%' }}>
          ¿Está seguro que desea eliminar definitivamente el comunicado?
        </p>
      )
    })

    setOpenModalView(true)
  }

  const eliminarPermanente = async (id) => {
    const _response = await actions.eliminarComunicado(
      id
    )
    if (!_response.error) {
      setOpenModalView(false)
      props.snackBarShow(
        'El comunicado se ha eliminado correctamente.',
        'success'
      )

      cargarComunicadosPorEstado(0)
      setPagina(0)
    }
  }

  const restaurarMensaje = async (item) => {
    const _Estados = state.estados
    const _estadoAnt = _Estados.find(
      (x) => x.id === item.estadoAnteriorId
    )

    const _response = await actions.CambiarEstadoComunicado(
      item.bandejaCorreoId,
      item.estadoAnteriorId
    )
    if (!_response.error) {
      setOpenModalView(false)
      props.snackBarShow(
        'El comunicado se ha restaurando correctamente.',
        'success'
      )

      cargarComunicadosPorEstado(0)
      setPagina(0)
    }
  }

  return (
    <>
      <Bandeja
        data={state.papelera.entityList}
        itemSelected={itemSelected}
        setItemSelected={setItemSelected}
        actionEliminarPermanente={actionEliminarPermanente}
        restaurarMensaje={restaurarMensaje}
        fetchMoreData={() => {
          setPagina(pagina + 1)
          cargarComunicadosPorEstado(pagina + 1)
        }}
        ItemBandeja={ItemBandejaListPapelera}
        selectedItems={props.selectedItems}
        handleSelectItems={props.handleSelectItems}
      />
      {itemSelected?.bandejaCorreoId !== undefined && (
        <MensajeView
          data={itemSelected}
          actionEliminarPermanente={actionEliminarPermanente}
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

export default withRouter(Papelera)
