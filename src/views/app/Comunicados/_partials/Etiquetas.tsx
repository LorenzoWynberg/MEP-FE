import React, { useState, useEffect } from 'react'
import withRouter from 'react-router-dom/withRouter'

import { useActions } from 'Hooks/useActions'
import ModalView from './ModalView'
import { useSelector } from 'react-redux'
import {
  GetDataEtiquetasPersonalizadas,
  CambiarEstadoComunicado,
  changeEntityList,
  AgregarFavoritos
} from '../../../../redux/comunicados/actions'
import Bandeja from '../Bandeja'
import ItemBadejaList from './etiquetas/ItemBadejaList'
import MensajeView from './etiquetas/MensajeView'

const Etiquetas = (props) => {
  const {
    menu,
    textoFiltro,
    setItemSelected,
    data,
    itemSelected,
    snackBarShow
  } = props
  const [pagina, setPagina] = useState(0)

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
    GetDataEtiquetasPersonalizadas,
    CambiarEstadoComunicado,
    changeEntityList,
    AgregarFavoritos
  })

  const state = useSelector((store) => {
    return {
      ...store.comunicados
    }
  })

  useEffect(() => {
    setItemSelected({})
  }, [])

  useEffect(() => {
    handleLoadData(0)
    setItemSelected({})
  }, [menu, textoFiltro])

  const handleLoadData = (page) => {
    const _menu = menu
    const _aMenu = _menu.split('-')
    const _etiquetaId = _aMenu[1]
    cargarDatosbandeja(_etiquetaId, page)
  }

  const cargarDatosbandeja = async (etiquetaId, page) => {
    try {
      const _response = await actions.GetDataEtiquetasPersonalizadas(
        '0',
        '0',
        page,
        20,
        'dataEtiquetasPersonalizadas',
        textoFiltro,
        etiquetaId
      )

      if (!_response.error) {
        if (_response.data?.length > 0) {
          const _first = _response.data[0]
          setItemSelected(_first)
        } else {
          setItemSelected({})
        }
      }
    } catch (e) {
      alert('error')
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
        const _data = state.dataEtiquetasPersonalizadas.entityList.map(
          (item) => {
            if (item.bandejaCorreoId === id) {
              return {
                ...item,
                estadoCodigo: '2'
              }
            } else {
              return item
            }
          }
        )
        actions.changeEntityList('dataEtiquetasPersonalizadas', _data)
      }
    }
  }

  useEffect(() => {
    if (data !== undefined) {
      setItemSelected({})

      if (data.entityList.length > 0) {
        const _first = data.entityList[0]
        setItemSelected(_first)
        marcarComoRecibido(_first.bandejaCorreoId)
      } else {
        setItemSelected({})
      }
    }
  }, [data])

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
      setOpenModalView(false)
      if (!_response.error) {
        snackBarShow(
          'El comunicado ha sido enviado a la Papelera.',
          'success'
        )
        const _data = state.dataEtiquetasPersonalizadas.entityList.filter((item) => {
          return item.bandejaCorreoId !== id
        })
        setItemSelected({})
        actions.changeEntityList('dataEtiquetasPersonalizadas', _data)
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
        data={state.dataEtiquetasPersonalizadas.entityList}
        fetchMoreData={() => {
				  setPagina(pagina + 1)
				  handleLoadData(pagina + 1)
        }}
        itemSelected={itemSelected}
        setItemSelected={setItemSelected}
        marcarComoRecibido={marcarComoRecibido}
        enviarPapelera={actionEnviarPapelera}
        ItemBandeja={ItemBadejaList}
        marcarFavorito={actionMarcarFavorito}
        selectedItems={props.selectedItems}
        handleSelectItems={props.handleSelectItems}
      />
      {itemSelected?.bandejaCorreoId !== undefined && (
        <MensajeView
          data={itemSelected}
          snackBarShow={snackBarShow}
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

export default withRouter(Etiquetas)
