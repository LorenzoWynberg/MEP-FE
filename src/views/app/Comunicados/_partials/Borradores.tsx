import React, { useState, useEffect } from 'react'
import withRouter from 'react-router-dom/withRouter'
import { useActions } from '../../../../hooks/useActions'
import {
  GetBandejaCorreoPaginados,
  eliminarComunicado
} from '../../../../redux/comunicados/actions'
import Bandeja from '../Bandeja'
import ItemBandeja from './borradores/ItemBandejaBorrador'
import { useSelector } from 'react-redux'
import ModalView from './ModalView'
import MensajeEdit from './MensajeEdit'

const Borradores = (props) => {
  const [pagina, setPagina] = useState(0)
  const actions = useActions({ GetBandejaCorreoPaginados, eliminarComunicado })
  const state = useSelector((store) => store.comunicados)
  const [openModalView, setOpenModalView] = useState(false)
  const [propsModalView, setPropsModalView] = useState({
    title: '',
    size: '',
    icon: '',
    textAceptar: '',
    action: () => {},
    children: ''
  })
  useEffect(() => {
    props.setItemSelected({})
  }, [])

  const cargarComunicadosPorEstado = async (page) => {
    const _response = await actions.GetBandejaCorreoPaginados(
      "'3'",
      '0',
      page,
      20,
      'borradores',
      props.textoFiltro
    )
    props.onDelete(_response)
  }

  const actionEliminarPermanente = async (id) => {
    setPropsModalView({
      title: 'Eliminar definitivamente',
      action: () => {
        eliminarPermanente(id)
        props.setItemSelected({})
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
    const _response = await actions.eliminarComunicado(id)
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

  return (
    <div style={{ display: 'flex' }}>
      <Bandeja
        data={state.borradores.entityList}
        actionEliminarPermanente={actionEliminarPermanente}
        fetchMoreData={() => {
          setPagina(pagina + 1)
          cargarComunicadosPorEstado(pagina + 1)
        }}
        itemSelected={props.itemSelected}
        setItemSelected={props.setItemSelected}
        ItemBandeja={ItemBandeja}
        selectedItems={props.selectedItems}
        handleSelectItems={props.handleSelectItems}
      />
      {props.itemSelected?.bandejaCorreoId && (
        <MensajeEdit
          {...props}
          template={{}}
          data={props.itemSelected}
          onDeleteMensaje={() => {
            actionEliminarPermanente(props.itemSelected.bandejaCorreoId)
          }}
          onSendMensaje={() => {}}
          onSendMensajeBorrador={() => {}}
          minHeight={300}
          isDraft
          setSelectedTemplate={() => {}}
          redactar
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
    </div>
  )
}

export default withRouter(Borradores)
