import React, { useState, useEffect } from 'react'
import withRouter from 'react-router-dom/withRouter'
import MensajeView from './recibidos/MensajeView'
import { useActions } from 'Hooks/useActions'
import ModalView from './ModalView'
import { useSelector } from 'react-redux'
import {
  GetBandejaCorreoPaginados,
  GetBandejaCorreoPaginadosFavoritos,
  CambiarEstadoComunicado,
  AgregarFavoritos,
  changeEntityList,
  GetTotalPorEstado
} from '../../../../redux/comunicados/actions'
import Bandeja from '../Bandeja'
import ItemBadejaList from './recibidos/ItemBadejaList'

const Favoritos = (props) => {
  const [data, setData] = useState({
    entityList: [],
    totalCount: 0
  })

  const [openModalView, setOpenModalView] = useState(false)
  const [pagina, setPagina] = useState(0)
  const [propsModalView, setPropsModalView] = useState({
    title: '',
    size: '',
    icon: '',
    textAceptar: '',
    action: () => {},
    children: ''
  })

  const actions = useActions({
    GetBandejaCorreoPaginados,
    CambiarEstadoComunicado,
    AgregarFavoritos,
    GetBandejaCorreoPaginadosFavoritos,
    changeEntityList,
    GetTotalPorEstado
  })

  const state = useSelector((store) => {
    return {
      ...store.comunicados
    }
  })

  useEffect(() => {
    props.setItemSelected({})
  }, [])

  useEffect(() => {
    handleLoadData(0)
  }, [props.textoFiltro])

  const handleLoadData = (page) => {
    let _codigoEtiqueta = '0'

    switch (props.match.params.submenu) {
      case 'circulares':
        _codigoEtiqueta = '1'
        break
      case 'oficios':
        _codigoEtiqueta = '2'
        break
      case 'resoluciones':
        _codigoEtiqueta = '3'
        break
      case 'boletines':
        _codigoEtiqueta = '4'
        break
    }
    cargarDatosbandeja(_codigoEtiqueta, page)
  }

  const cargarDatosbandeja = async (codigoEtiqueta, page) => {
    const _response = await actions.GetBandejaCorreoPaginadosFavoritos(
      "'1','2'", // Nuevos, Leidos
      codigoEtiqueta,
      page,
      20,
      'favoritos',
      props.textoFiltro
    )
    props.setItemSelected({})
  }

  const marcarComoRecibido = async (id) => {
    const _Estados = state.estados
    const _estadoRecibido = _Estados.find((x) => x.codigo === '2')

    if (_estadoRecibido !== undefined) {
      const _response = await actions.CambiarEstadoComunicado(
        id,
        _estadoRecibido.id
      )
      if (!_response.error) {
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
        actions.changeEntityList('favoritos', _data)
        actions.GetTotalPorEstado("'1'", 'recibidos')
      }
    }
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
        <p style={{ paddingTop: 20, width: '100%', padding: 0, textAlign: 'center' }}>
          ¿Está seguro que desea enviar a Papelera el comunicado?
        </p>
      )
    })

    setOpenModalView(true)
  }

  const actionMarcarFavorito = async (id, estado) => {
    enviarFavorito(id, estado)
  }

  const enviarFavorito = async (id, estado) => {
    const _response = await actions.AgregarFavoritos(id, estado)
    if (!_response.error) {
      setOpenModalView(false)
    }
    handleLoadData(0)
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
          'El comunicado ha sido enviado a la Papelera.',
          'success'
        )
        const _data = state.favoritos.entityList.filter((item) => {
          return item.bandejaCorreoId !== id
        })
        actions.changeEntityList('favoritos', _data)
        actions.GetTotalPorEstado("'1'", 'recibidos')
        props.setItemSelected({})
      }
    }
  }

  const marcarComoNoLeido = async (id) => {
    const _Estados = state.estados
    const _estadoNuevo = _Estados.find((x) => x.codigo === '1')

    if (_estadoNuevo !== undefined) {
      const _response = await actions.CambiarEstadoComunicado(
        id,
        _estadoNuevo.id
      )
      if (!_response.error) {
        const _data = state.favoritos.entityList.map((item) => {
          if (item.bandejaCorreoId === id) {
            return {
              ...item,
              estadoCodigo: '1'
            }
          } else {
            return item
          }
        })
        actions.changeEntityList('favoritos', _data)
        actions.GetTotalPorEstado("'1'", 'recibidos')
      }
    }
  }

  return (
    <>
      <Bandeja
        data={state.favoritos.entityList}
        itemSelected={props.itemSelected}
        setItemSelected={props.setItemSelected}
        marcarComoRecibido={marcarComoRecibido}
        marcarComoNoLeido={marcarComoNoLeido}
        fetchMoreData={() => {
          setPagina(pagina + 1)
          handleLoadData(pagina + 1)
        }}
        enviarPapelera={actionEnviarPapelera}
        marcarFavorito={actionMarcarFavorito}
        ItemBandeja={ItemBadejaList}
        selectedItems={props.selectedItems}
        handleSelectItems={props.handleSelectItems}
      />
      {props.itemSelected?.comunicadoId !== undefined && (
        <MensajeView
          data={props.itemSelected}
          snackBarShow={props.snackBarShow}
          marcarFavorito={actionMarcarFavorito}
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

export default withRouter(Favoritos)
