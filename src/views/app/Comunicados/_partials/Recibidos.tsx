import React, { useState, useEffect, useTransition } from 'react'
import withRouter from 'react-router-dom/withRouter'
import MensajeView from './recibidos/MensajeView'
import { useActions } from 'Hooks/useActions'
import ModalView from './ModalView'
import { useSelector } from 'react-redux'
import {
  GetBandejaCorreoPaginados,
  CambiarEstadoComunicado,
  changeEntityList,
  AgregarFavoritos,
  GetTotalPorEstado
} from '../../../../redux/comunicados/actions'
import Bandeja from '../Bandeja'
import ItemBadejaList from './recibidos/ItemBadejaList'
import { useTranslation } from 'react-i18next'

const Recibidos = (props) => {
  const [pagina, setPagina] = useState(0)
  const [data, setData] = useState({
    entityList: [],
    totalCount: 0
  })
  const { t } = useTranslation()
  const [openModalView, setOpenModalView] = useState(false)
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
    changeEntityList,
    AgregarFavoritos,
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
  }, [props.match.params.menu, props.match.params.submenu, props.textoFiltro])

  const handleLoadData = async (page) => {
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

    await cargarDatosbandeja(_codigoEtiqueta, page)
    await actions.GetTotalPorEstado("'1'", 'recibidos')
  }

  const cargarDatosbandeja = async (codigoEtiqueta, page) => {
    const _response = await actions.GetBandejaCorreoPaginados(
      "'1','2'", // Nuevos, Leidos
      codigoEtiqueta,
      page,
      20,
      'recibidos',
      props.textoFiltro
    )

    if (!_response.error) {
      setData(_response.data)
    }
  }

  useEffect(() => {
    if (data.entityList !== undefined) {
      props.setItemSelected({})
    }
  }, [data, props.match.params.menu])

  const marcarComoNoLeido = async (id) => {
    const _Estados = state.estados
    const _estadoNuevo = _Estados.find((x) => x.codigo === '1')

    if (_estadoNuevo !== undefined) {
      const _response = await actions.CambiarEstadoComunicado(id, _estadoNuevo.id)
      if (!_response.error) {
        const _data = state.recibidos.entityList.map((item) => {
          if (item.bandejaCorreoId === id) {
            return {
              ...item,
              estadoCodigo: '1'
            }
          } else {
            return item
          }
        })
        actions.changeEntityList('recibidos', _data)
        actions.GetTotalPorEstado("'1'", 'recibidos')
      }
    }
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
        const _data = state.recibidos.entityList.map((item) => {
          if (item.bandejaCorreoId === id) {
            return {
              ...item,
              estadoCodigo: '2'
            }
          } else {
            return item
          }
        })
        actions.changeEntityList('recibidos', _data)
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
      // Si ya cargó los estados
      const _response = await actions.CambiarEstadoComunicado(
        id,
        _estadoPapelera.id
      )
      setOpenModalView(false)
      if (!_response.error) {
        props.snackBarShow(
          t('comunicados>recibidos>enviar_papelera' ,'El comunicado ha sido enviado a la Papelera.'),
          'success'
        )
        const _data = state.recibidos.entityList.filter((item) => {
          return item.bandejaCorreoId !== id
        })
        props.setItemSelected({})
        actions.changeEntityList('recibidos', _data)
        actions.GetTotalPorEstado("'1'", 'recibidos')
      }
    }
  }

  const actionMarcarFavorito = async (id, estado) => {
    enviarFavorito(id, estado)
  }

  const enviarFavorito = async (id, estado) => {
    const _response = await actions.AgregarFavoritos(id, estado)

    if (!_response.error) {
      setOpenModalView(false)
    }
  }

  return (
    <>
      <Bandeja
        data={state.recibidos.entityList}
        fetchMoreData={() => {
          setPagina(pagina + 1)
          handleLoadData(pagina + 1)
        }}
        itemSelected={props.itemSelected}
        setItemSelected={props.setItemSelected}
        marcarComoRecibido={marcarComoRecibido}
        marcarComoNoLeido={marcarComoNoLeido}
        enviarPapelera={actionEnviarPapelera}
        ItemBandeja={ItemBadejaList}
        marcarFavorito={actionMarcarFavorito}
        selectedItems={props.selectedItems}
        handleSelectItems={props.handleSelectItems}
      />
      {props.itemSelected?.bandejaCorreoId !== undefined && (
        <MensajeView
          data={props.itemSelected}
          snackBarShow={props.snackBarShow}
          marcarFavorito={actionMarcarFavorito}
          enviarPapelera={actionEnviarPapelera}
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

export default withRouter(Recibidos)
