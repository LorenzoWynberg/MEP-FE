import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import withRouter from 'react-router-dom/withRouter'
import { useActions } from '../../../../hooks/useActions'
import Bandeja from '../Bandeja'
import ItemBandejaEnviado from './enviados/ItemBandejaEnviado'
import MensajeViewEnviados from './enviados/MensajeViewEnviados'
import ModalView from './ModalView'
import {
  GetBandejaCorreoPaginados,
  CambiarEstadoComunicado,
  AgregarFavoritos,
  changeEntityList
} from '../../../../redux/comunicados/actions'

const Enviados = (props) => {
  const state = useSelector((store) => store.comunicados)
  const actions = useActions({
    GetBandejaCorreoPaginados,
    CambiarEstadoComunicado,
    AgregarFavoritos,
    changeEntityList
  })
  const [pagina, setPagina] = useState(0)
  const [cantidadPorPagina, setCantidadPorPagina] = useState(10)
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

  useEffect(() => {
    props.setItemSelected({})
  }, [])

  useEffect(() => {
    cargarComunicadosPorEstado(0)
  }, [props.textoFiltro])

  const cargarComunicadosPorEstado = async (page) => {
    const _response = await actions.GetBandejaCorreoPaginados(
      "'6'",
      '0',
      page,
      20,
      'enviados',
      props.textoFiltro
    )
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
        <p style={{ paddingTop: 20, width: '100%', textAlign: 'center' }}>
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
      const _response = await actions.CambiarEstadoComunicado(
        id,
        _estadoPapelera.id
      )
      setOpenModalView(false)
      if (!_response.error) {
        props.snackBarShow(
          'El comunicado ha sido enviado a la Papelera.',
          'success'
        )
        const _data = state.enviados.entityList.filter((item) => {
          return item.bandejaCorreoId !== id
        })
        props.setItemSelected({})
        actions.changeEntityList('enviados', _data)
      }
    }
  }

  const actionMarcarFavorito = async (id, estado) => {
    enviarFavorito(id, estado)
  }

  const enviarFavorito = async (id, estado) => {
    const _response = await actions.AgregarFavoritos(id, estado)

    if (!_response.error) {
      const _data = state.enviados.entityList.map((item) => {
        if (item.bandejaCorreoId === id) {
          return {
            ...item,
            esFavorito: true
          }
        } else {
          return item
        }
      })

      actions.changeEntityList('enviados', _data)
    }
  }

  return (
    <>
      <Bandeja
        data={state.enviados.entityList}
        fetchMoreData={() => {
          setPagina(pagina + 1)
          cargarComunicadosPorEstado(pagina + 1)
        }}
        itemSelected={props.itemSelected}
        setItemSelected={props.setItemSelected}
        ItemBandeja={ItemBandejaEnviado}
        selectedItems={props.selectedItems}
        handleSelectItems={props.handleSelectItems}
        enviarPapelera={actionEnviarPapelera}
        marcarFavorito={actionMarcarFavorito}
      />
      {props.itemSelected?.bandejaCorreoId !== undefined && (
        <>
          <MensajeViewEnviados
            {...props}
            data={props.itemSelected}
            enviarPapelera={actionEnviarPapelera}
            marcarFavorito={actionMarcarFavorito}
          />
        </>
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

export default withRouter(Enviados)
