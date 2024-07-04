import React, { useState, useEffect, useMemo } from 'react'
import AppLayoutComunicados from 'Layout/AppLayoutComunicados'
import withRouter from 'react-router-dom/withRouter'
import { Row, Container, Input, Label } from 'reactstrap'
import ModalView from './_partials/ModalView'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import Recibidos from './_partials/Recibidos'
import Redactar from './_partials/Redactar'
import Enviados from './_partials/Enviados'
import Borradores from './_partials/Borradores'
import Papelera from './_partials/Papelera'
import Programados from './_partials/Programados'
import useNotification from 'Hooks/useNotification'
import Favoritos from './_partials/Favoritos'
import Etiquetas from './_partials/Etiquetas'
import Toolbar from './_partials/Toolbar'
import ModalEtiquetas from './_partials/ModalEtiquetas'
import { useParams } from 'react-router-dom'

import {
  GetBandejaCorreoPaginados,
  GetComunicadosPaginados,
  getEstadosComunicados,
  getEtiquetasComunicados,
  GetTotalPorEstado,
  GetSent,
  GetDataEtiquetasPersonalizadas,
  GetEtiquetasPersonalizadas,
  SaveEtiquetaPersonalizada,
  DeleteEtiquetaPersonalizada,
  DestacarMultiples,
  UpdateEtiquetasMultiple,
  UpdateEstadoMultiples,
  GetBandejaCorreoPaginadosFavoritos,
  eliminarMultiples
} from '../../../redux/comunicados/actions'
import './styles.scss'
import ListasDifusion from './_partials/ListasDifusion'
import { getListasDifusionByUser } from '../../../redux/ListasDifusion/actions'
import { useTranslation } from 'react-i18next'

import COLORES from 'Constants/ColorList'

const Comunicados = (props) => {
  const state = useSelector((store) => {
    return {
      ...store.comunicados
    }
  })
  const { menu, submenu } = useParams<any>()

  const [menuItems, setMenuItems] = useState([])
  const [openModalView, setOpenModalView] = useState(false)
  const [openModalViewEtiqueta, setOpenModalViewEtiqueta] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalProgramados, setTotalProgramados] = useState(0)
  const [totalBorradores, setTotalBorradores] = useState(0)
  const [totalEnviados, setTotalEnviados] = useState(0)
  const [nombreEtiqueta, setNombreEtiqueta] = useState('')
  const [propsModalView, setPropsModalView] = useState({
    title: '',
    size: '',
    icon: '',
    action: () => {},
    children: null
  })

  const [selectedItems, setSelectedItems] = useState([])
  const { currentInstitution } = useSelector((state) => state.authUser)
  const [propsModalViewEtiqueta, setPropsModalViewEtiqueta] = useState({
    title: '',
    size: '',
    icon: '',
    action: () => {},
    children: null
  })

  const [textoFiltro, setTextoFiltro] = useState('-')
  const [inputSearchValue, setInputSearchValue] = useState('')
  const { t } = useTranslation()

  const [snackbarContent, setSnackbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [snackBar, handleSnackBarClick] = useNotification()

  const [itemSelected, setItemSelected] = useState({})
  const [etiquetaId, setEtiquetaId] = useState(0)

  const [selectedTag, setSelectedTag] = useState(null)
  const [tipoTag, setTipoTag] = useState(0)
  const [openModalViewEtiquetas, setOpenModalViewEtiquetas] = useState(false)

  const actions = useActions({
    GetBandejaCorreoPaginados,
    GetBandejaCorreoPaginadosFavoritos,
    GetComunicadosPaginados,
    getEstadosComunicados,
    getEtiquetasComunicados,
    GetTotalPorEstado,
    GetSent,
    GetDataEtiquetasPersonalizadas,
    GetEtiquetasPersonalizadas,
    SaveEtiquetaPersonalizada,
    DeleteEtiquetaPersonalizada,
    getListasDifusionByUser,
    DestacarMultiples,
    UpdateEtiquetasMultiple,
    UpdateEstadoMultiples,
    eliminarMultiples
  })

  useEffect(() => {
    cargarCatalogos()
    cargarTotales()
    cargarDatosbandejaRecibidos()
    cargarDatosBorradores()
    actions.getListasDifusionByUser()
  }, [])

  useEffect(() => {
    cargarTotales()
  }, [state.borradores, state.programados])

  useEffect(() => {
    cargarDatosbandejaRecibidos()
    cargarDatosBorradores()
  }, [menu])

  const cargarDatosbandejaRecibidos = async () => {
    await actions.GetBandejaCorreoPaginados(
      "'1','2'", // Nuevos, Leidos
      '0',
      0,
      20,
      'recibidos',
      textoFiltro
    )
    await actions.GetTotalPorEstado("'1'", 'recibidos') // Solamente los No Leidos()
  }

  const cargarTotales = async () => {
    const _responseBorradores = await actions.GetTotalPorEstado("'3'")
    if (!_responseBorradores.error) {
      // setTotalBorradores(_responseBorradores.data)
    }

    const _responseProgramados = await actions.GetTotalPorEstado("'5'")
    if (!_responseProgramados.error) {
      setTotalProgramados(_responseProgramados.data)
    }

    const _responseEnviados = await actions.GetTotalPorEstado("'6'")
    if (!_responseEnviados.error) {
      setTotalEnviados(_responseEnviados.data)
    }
  }

  const cargarCatalogos = async () => {
    await actions.getEstadosComunicados(37)
    await actions.getEtiquetasComunicados(36)
    await actions.GetEtiquetasPersonalizadas()
  }

  const cargarDatosBorradores = async () => {
    const res = await actions.GetBandejaCorreoPaginados(
      "'3'",
      '0',
      0,
      20,
      'borradores',
      textoFiltro
    )
    setTotalBorradores(res?.data?.totalCount)
  }

  const eliminarEtiqueta = async (id) => {
    if (id > 0) {
      const _resp = await actions.DeleteEtiquetaPersonalizada(id)
      if (!_resp.error) {
        setEtiquetaId(0)
        setOpenModalView(false)
        setPropsModalView({
          title: '',
          size: '',
          icon: '',
          action: () => {},
          children: null
        })

        snackBarShow('La etiqueta ha sido eliminada.', 'success')
        await actions.GetEtiquetasPersonalizadas()
      } else {
        snackBarShow(
          'Ha ocurrido un error al eliminar la etiqueta.',
          'error'
        )
      }
    } else {
      snackBarShow(
        'Debe seleccionar una etiqueta personalizada.',
        'warning'
      )
    }
  }

  useEffect(() => {
    const _menuSelected = menu || 'recibidos'
    const _submenuSelected = submenu

    const _etiquetasPersonalizadas = state.etiquetasPersonalizadas.map(
      (item) => {
        return {
          id: 'etiqueta-' + item.id,
          icon: 'fas fa-tag',
          label: item.nombre,
          to: '/comunicados/etiqueta-' + item.id,
          submenu: [],
          isSelected: _menuSelected === 'etiqueta-' + item.id,
          itemsLength: 0,
          onDelete: (e) => {
            const _a = e.currentTarget.id.split('-')
            setEtiquetaId(_a[1])
            setPropsModalView({
              title: t('comunicados>etiquetas>eliminar_etiquetas', 'Eliminar Etiqueta'),
              size: 'md',
              children: (
                <p
                  style={{
                    paddingTop: 20,
                    width: '100%',
                    textAlign: 'center'
                  }}
                >
                  {t('comunicados>etiquetas>confirmacion_eliminar', '¿Está seguro que desea eliminar la etiqueta?')}
                </p>
              ),
              action: () => {
                eliminarEtiqueta(_a[1])
              }
            })
            setOpenModalView(true)
          }
        }
      }
    )

    const _menu = [
      {
        id: 'redactar',
        icon: 'fas fa-pen',
        label: t('comunicados>menu>redactar' ,'Redactar'),
        to: '/comunicados/redactar',
        submenu: [],
        isSelected: _menuSelected === 'redactar',
        itemsLength: -1
      },
      {
        id: 'recibidos',
        icon: 'fas fa-inbox',
        label: t('comunicados>menu>recibidos' ,'Recibidos'),
        to: '/comunicados/recibidos',
        isSelected: _menuSelected === 'recibidos',
        itemsLength: state.totalRecibidos,
        submenu: [
          {
            id: 'circulares',
            icon: 'fas fa-exclamation-triangle',
            label: t('comunicados>menu>circulares', 'Circulares'),
            to: '/comunicados/recibidos/circulares',
            isSelected: _submenuSelected === 'circulares',
            itemsLength: -1
          },
          {
            id: 'oficios',
            icon: 'fas fa-file-alt',
            label: t('comunicados>menu>oficios' ,'Oficios'),
            to: '/comunicados/recibidos/oficios',
            isSelected: _submenuSelected === 'oficios',
            itemsLength: -1
          },
          {
            id: 'resoluciones',
            icon: 'fas fa-clipboard-check',
            label: t('comunicados>menu>resoluciones' ,'Resoluciones'),
            to: '/comunicados/recibidos/resoluciones',
            isSelected: _submenuSelected === 'resoluciones',
            itemsLength: -1
          },
          {
            id: 'boletines',
            icon: 'fas fa-folder-open',
            label: t('comunicados>menu>boletines' ,'Boletines'),
            to: '/comunicados/recibidos/boletines',
            isSelected: _submenuSelected === 'boletines',
            itemsLength: -1
          }
        ]
      },
      {
        id: 'favoritos',
        icon: 'fas fa-star',
        label: t('comunicados>menu>favoritos' ,'Favoritos'),
        to: '/comunicados/favoritos',
        submenu: [],
        isSelected: _menuSelected === 'favoritos',
        itemsLength: -1
      },
      {
        id: 'enviados',
        icon: 'fas fa-paper-plane',
        label: t('comunicados>menu>enviados', 'Enviados'),
        to: '/comunicados/enviados',
        submenu: [],
        isSelected: _menuSelected === 'enviados',
        itemsLength: 0
      },
      {
        id: 'programados',
        icon: 'fas fa-clock',
        label: t('comunicados>menu>programados', 'Programados'),
        to: '/comunicados/programados',
        submenu: [],
        isSelected: _menuSelected === 'programados',
        itemsLength: totalProgramados
      },
      {
        id: 'borradores',
        icon: 'fas fa-file-alt',
        label: t('comunicados>menu>borradores', 'Borradores'),
        to: '/comunicados/borradores',
        submenu: [],
        isSelected: _menuSelected === 'borradores',
        itemsLength: totalBorradores
      },

      ..._etiquetasPersonalizadas,
      {
        id: 'papelera',
        icon: 'fas fa-trash',
        label: t('comunicados>menu>papelera', 'Papelera'),
        to: '/comunicados/papelera',
        submenu: [],
        isSelected: _menuSelected === 'papelera',
        itemsLength: -1
      },
      {
        id: 'listaDifusion',
        icon: 'fas fa-list',
        label: t('comunicados>menu>listas_difusion', 'Listas de difusión'),
        to: '/comunicados/listas-difusion',
        submenu: [],
        isSelected: _menuSelected === 'listas-difusion',
        itemsLength: 0
      },
      {
        id: 'nuevaEtiqueta',
        icon: 'fas fa-plus',
        label: t('comunicados>menu>nueva_etiqueta', 'Nueva etiqueta'),
        to: '',
        onClick: () => {
          showFormEtiquetaPersonalizada()
        },
        submenu: [],
        isSelected: false,
        itemsLength: 0
      }
    ]

    setMenuItems(_menu)

    setTextoFiltro('-')
    setSelectedItems([])
    const _checkAll = document.getElementById('check-select-all')
    if (_checkAll) {
      _checkAll.checked = false
    }

    setInputSearchValue('')
  }, [
    totalBorradores,
    totalProgramados,
    menu,
    submenu,
    state.etiquetasPersonalizadas,
    state.totalRecibidos,
    t
  ])

  const color = COLORES.find(i => i.id == currentInstitution.color) || COLORES[1]
  const renderContent = (pText) => {
    if (menu?.indexOf('etiqueta') !== -1) {
      return (
        <Etiquetas
          {...props}
          menu={menu || 'recibidos'}
          itemSelected={itemSelected}
          setItemSelected={setItemSelected}
          snackBarShow={snackBarShow}
          textoFiltro={inputSearchValue}
          selectedItems={selectedItems}
          handleSelectItems={handleSelectItems}
        />
      )
    }

    switch (menu) {
      case 'redactar':
        return (
          <Redactar
            {...props}
            openModal
            snackBarShow={snackBarShow}
          />
        )
      case 'recibidos':
        return (
          <Recibidos
            {...props}
            itemSelected={itemSelected}
            setItemSelected={setItemSelected}
            snackBarShow={snackBarShow}
            textoFiltro={pText}
            selectedItems={selectedItems}
            handleSelectItems={handleSelectItems}
          />
        )
      case 'favoritos':
        return (
          <Favoritos
            {...props}
            itemSelected={itemSelected}
            setItemSelected={setItemSelected}
            snackBarShow={snackBarShow}
            textoFiltro={pText}
            selectedItems={selectedItems}
            handleSelectItems={handleSelectItems}
          />
        )
      case 'enviados':
        return (
          <Enviados
            {...props}
            itemSelected={itemSelected}
            setItemSelected={setItemSelected}
            textoFiltro={pText}
            selectedItems={selectedItems}
            handleSelectItems={handleSelectItems}
            snackBarShow={snackBarShow}
          />
        )
      case 'programados':
        return (
          <Programados
            {...props}
            itemSelected={itemSelected}
            setItemSelected={setItemSelected}
            snackBarShow={snackBarShow}
            textoFiltro={pText}
            selectedItems={selectedItems}
            handleSelectItems={handleSelectItems}
          />
        )
      case 'borradores':
        return (
          <Borradores
            {...props}
            itemSelected={itemSelected}
            setItemSelected={setItemSelected}
            snackBarShow={snackBarShow}
            textoFiltro={pText}
            selectedItems={selectedItems}
            handleSelectItems={handleSelectItems}
            onDelete={(res) => {
              setTotalBorradores(res?.data?.totalCount)
            }}
          />
        )
      case 'papelera':
        return (
          <Papelera
            {...props}
            snackBarShow={snackBarShow}
            textoFiltro={pText}
            itemSelected={itemSelected}
            setItemSelected={setItemSelected}
            selectedItems={selectedItems}
            handleSelectItems={handleSelectItems}
          />
        )
      case 'listas-difusion':
        return <ListasDifusion />
      default:
        return (
          <Recibidos
            {...props}
            itemSelected={itemSelected}
            setItemSelected={setItemSelected}
            snackBarShow={snackBarShow}
            textoFiltro={pText}
            selectedItems={selectedItems}
            handleSelectItems={handleSelectItems}
          />
        )
    }
  }

  const snackBarShow = (msg: string, variant: string) => {
    setSnackbarContent({
      variant,
      msg
    })
    handleSnackBarClick()
  }

  const onChangeInput = (e) => {
    const value = e.target.value
    setInputSearchValue(value)
    if (value == '') {
      setTextoFiltro('-')
    }
  }

  const onKeyPress = (e) => {
    const name = e.target.name
    const value = e.target.value

    switch (name) {
      case 'txtSearch':
        if (e.which === 13) {
          if (value.length > 2) {
            setTextoFiltro(value)
          } else {
            if (value == '') {
              setTextoFiltro('-')
            } else {
              snackBarShow(
                'Debe ingresar al menos 3 caracteres para realizar la búsqueda',
                'warning'
              )
            }
          }
        }

        break

      default:
        break
    }
  }

  const onChange = (e) => {
    setNombreEtiqueta(e.target.value)
  }

  const showFormEtiquetaPersonalizada = () => {
    setPropsModalViewEtiqueta({
      title: 'Etiqueta Nueva',
      icon: 'fas fa-tag',
      size: 'sm'
    })
    setOpenModalViewEtiqueta(true)
  }

  const crearEtiqueta = async () => {
    let cont = false
    if (nombreEtiqueta.trim().length === 0) {
      snackBarShow(
        'Debe ingresar el nombre de la nueva etiqueta',
        'warning'
      )
      return
    }
    state.etiquetasPersonalizadas.map((item) => {
      if (item.nombre === nombreEtiqueta.trim()) {
        snackBarShow('La etiqueta ya existe actualmente', 'warning')
        cont = true
      }
    })
    setOpenModalViewEtiqueta(false)
    setNombreEtiqueta('')

    if (!cont) {
      const response = await actions.SaveEtiquetaPersonalizada(
        nombreEtiqueta.trim()
      )
      if (!response.error) {
        snackBarShow('Etiqueta guardada correctamente', 'success')
        await actions.GetEtiquetasPersonalizadas()
      }
    }
  }

  const handleSelectItems = (checked, isAll, item, bandeja) => {
    if (bandeja.indexOf('etiqueta-') > -1) {
      bandeja = 'dataEtiquetasPersonalizadas'
    }

    if (isAll) {
      if (checked) {
        setSelectedItems(state[bandeja].entityList)
      } else {
        setSelectedItems([])
      }
    } else {
      if (!checked) {
        const _newList = [...selectedItems, item]
        setSelectedItems(_newList)
      } else {
        const _removeItemList = selectedItems.filter(
          (el) => el.bandejaCorreoId !== item.bandejaCorreoId
        )
        setSelectedItems(_removeItemList)
      }
    }
  }

  const handleToolbarItem = async (accion, bandeja) => {
    const _ids = selectedItems.map((el) => {
      return el.bandejaCorreoId
    })

    if (_ids.length === 0 && accion !== 'Actualizar') {
      snackBarShow('Debe seleccionar al menos un registro.', 'warning')
      return
    }

    switch (accion) {
      case 'Actualizar':
        actualizarBandeja(bandeja)
        break
      case 'Eliminar':
        actionUpdateEstadoMultiples(accion, bandeja, _ids)
        break
      case 'EliminarDefinitivamente':
        actionEliminarDefinitivamente(bandeja, _ids)
        break
      case 'MarcarNoLeido':
        actionUpdateEstadoMultiples(accion, bandeja, _ids)
        break
      case 'Etiquetas':
        setOpenModalViewEtiquetas(true)
        break
      case 'Destacar':
        actionDestacarMultiples(bandeja, _ids)
        break
      default:
        break
    }
  }

  const actualizarBandeja = async (bandeja) => {
    switch (bandeja) {
      case 'recibidos':
        cargarDatosbandejaRecibidos()
        break
      case 'enviados':
        await actions.GetBandejaCorreoPaginados(
          "'6'",
          '0',
          0,
          20,
          'enviados',
          textoFiltro
        )
        break
      case 'programados':
        await actions.GetBandejaCorreoPaginados(
          "'5'",
          '0',
          0,
          20,
          'programados',
          textoFiltro
        )
        break
      case 'favoritos':
        await actions.GetBandejaCorreoPaginadosFavoritos(
          "'1','2'",
          '0',
          0,
          20,
          'favoritos',
          textoFiltro
        )
        break
      case 'borradores':
        await actions.GetBandejaCorreoPaginados(
          "'3'",
          '0',
          0,
          20,
          'borradores',
          textoFiltro
        )
        break
      case 'papelera':
        await actions.GetBandejaCorreoPaginados(
          "'4'",
          '0',
          0,
          20,
          'papelera',
          textoFiltro
        )
        break
      default:
        cargarDatosbandejaEtiquetasPersonalizadas()
        break
    }
  }

  const cargarDatosbandejaEtiquetasPersonalizadas = async () => {
    const _menu = menu || 'recibidos'
    const _aMenu = _menu.split('-')
    const _etiquetaId = _aMenu[1]

    await actions.GetDataEtiquetasPersonalizadas(
      '0',
      '0',
      0,
      20,
      'dataEtiquetasPersonalizadas',
      textoFiltro,
      _etiquetaId
    )
  }

  const actionDestacarMultiples = async (bandeja, _ids) => {
    const _resp = await actions.DestacarMultiples({
      ids: _ids,
      esFavorito: true
    })

    if (!_resp.error) {
      setSelectedItems([])
      const _checkAll = document.getElementById('check-select-all')
      if (_checkAll) {
        _checkAll.checked = false
      }
      actualizarBandeja(bandeja)
    }
  }

  const actionUpdateEtiquetasMultiple = async () => {
    const _ids = selectedItems.map((el) => {
      return el.comunicadoId
    })

    if (selectedTag != null) {
      const _resp = await actions.UpdateEtiquetasMultiple({
        ids: _ids,
        etiquetaId: selectedTag?.id,
        esPersonalizada: tipoTag === 1
      })
      if (!_resp.error) {
        setSelectedTag(null)
        setTipoTag(0)
        actualizarBandeja(menu)
        setSelectedItems([])
        const _checkAll = document.getElementById('check-select-all')
        if (_checkAll) {
          _checkAll.checked = false
        }

        snackBarShow(
          'Se han etiquetado ' +
						_ids.length +
						' comunicados como ' +
						selectedTag.nombre,
          'success'
        )
        setOpenModalViewEtiquetas(false)
      }
    } else {
      snackBarShow('Debe seleccionar una etiqueta.', 'warning')
    }
  }

  const actionEliminarDefinitivamente = async (bandeja, _ids) => {
    const _resp = await actions.eliminarMultiples(_ids)
    if (!_resp.error) {
      actualizarBandeja(bandeja)
      setSelectedItems([])
      const _checkAll = document.getElementById('check-select-all')
      if (_checkAll) {
        _checkAll.checked = false
      }

      snackBarShow(
        'Se han eliminado ' +
					_ids.length +
					' comunicados definitivamente.',
        'success'
      )
    }
  }

  const actionUpdateEstadoMultiples = async (accion, bandeja, _ids) => {
    const _Estados = state.estados
    let _estadoPapelera = { id: 0 }
    let _esEliminar = false

    switch (accion) {
      case 'Eliminar':
        _estadoPapelera = _Estados.find((x) => x.codigo === '4')
        _esEliminar = true
        break
      case 'MarcarNoLeido':
        _estadoPapelera = _Estados.find((x) => x.codigo === '1')
        break

      default:
        break
    }

    if (_estadoPapelera !== undefined) {
      const _resp = await actions.UpdateEstadoMultiples({
        ids: _ids,
        estadoId: _estadoPapelera.id,
        esEliminar: _esEliminar
      })
      if (!_resp.error) {
        actualizarBandeja(bandeja)
        setSelectedItems([])
        const _checkAll = document.getElementById('check-select-all')
        if (_checkAll) {
          _checkAll.checked = false
        }

        if (_esEliminar) {
          snackBarShow(
            'Se han enviado ' +
							_ids.length +
							' comunicados a la Papelera.',
            'success'
          )
        }
      }
    }
  }

  return (
    <>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}
      <AppLayoutComunicados
        items={menuItems}
        style={{ background: '#ffffff' }}
        menuBackground={color?.color}
        onKeyPress={onKeyPress}
        onChangeInput={onChangeInput}
        textoFiltro={inputSearchValue}
      >
        <Container
          id='container-comunicados'
          className='navbar-chill-container'
          style={{
            marginTop: currentInstitution?.id > 0 ? '171px' : '152px'
          }}
        >
          {menu !== 'redactar' && menu !== 'listas-difusion' && (
            <Toolbar
              handleSelectItems={handleSelectItems}
              selectedItems={selectedItems}
              handleToolbarItem={handleToolbarItem}
              bandeja={menu}
            />
          )}
          <Row>{renderContent(textoFiltro)}</Row>
        </Container>
      </AppLayoutComunicados>

      {openModalView && (
        <ModalView
          open={openModalView}
          {...propsModalView}
          onClose={() => {
					  setOpenModalView(false)
          }}
        >
          {propsModalView.children}
        </ModalView>
      )}

      {openModalViewEtiqueta && (
        <ModalView
          open={openModalViewEtiqueta}
          {...propsModalViewEtiqueta}
          onClose={() => {
					  setOpenModalViewEtiqueta(false)
          }}
          action={() => {
					  crearEtiqueta()
          }}
        >
          <Label>Introduce el nombre de la nueva etiqueta:</Label>
          <Input onChange={onChange} />
        </ModalView>
      )}

      {openModalViewEtiquetas && (
        <ModalEtiquetas
          openModalView={openModalViewEtiquetas}
          setOpenModalView={setOpenModalViewEtiquetas}
          tags={state.etiquetas}
          tipoTag={tipoTag}
          selectedTag={selectedTag}
          setTipoTag={setTipoTag}
          setSelectedTag={setSelectedTag}
          customTags={state.etiquetasPersonalizadas}
          action={actionUpdateEtiquetasMultiple}
        />
      )}
    </>
  )
}

export default withRouter(Comunicados)
