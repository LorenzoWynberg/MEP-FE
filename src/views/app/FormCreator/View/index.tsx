import React, { useEffect, useState } from 'react'
import HTMLTable from 'Components/HTMLTable'
import {
  getForms,
  loadCurrentForm,
  duplicateForm,
  getCategorias,
  saveCategories,
  deleteCategories,
  editCategories,
  deleteForm
} from '../../../../redux/FormCreatorV2/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import withRouter from 'react-router-dom/withRouter'
import moment from 'moment'
import AddBoxIcon from '@material-ui/icons/AddBox'
import '../../../../assets/css/sass/containerStyles/Carpetas.scss'
import useNotification from 'Hooks/useNotification'
// Nuevo para tabs
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Row,
  Col,
  Input
} from 'reactstrap'
import DropCarpeta from './_partials/DropDownCarpeta/Carpeta'
import classnames from 'classnames'
import ListaForm from './_partials/ListaFormsCarpeta/Lista'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { Typography, Tooltip } from '@material-ui/core'
import swal from 'sweetalert'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { Edit, Delete, FileCopy, FormatListBulleted } from '@material-ui/icons'

import BackIcon from '@material-ui/icons/ArrowBackIos'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { useTranslation } from 'react-i18next'
import creadorDeFormulariosItems from 'Constants/creadorDeFormulariosItems'

const View = (props) => {
  const [modalItem, setModalItem] = useState(null)
  const actions = useActions({
    getForms,
    loadCurrentForm,
    duplicateForm,
    deleteForm
  })
  const carpetaAction = useActions({
    getCategorias,
    saveCategories,
    deleteCategories,
    editCategories
  })
  const state = useSelector((store) => store.creadorFormularios)
  const { t } = useTranslation()
  const [inputName, setInputName] = useState(null)
  const [botonCaperta, setBotonCarpeta] = useState([])
  const [editando, setEditando] = useState(false)
  const [openDuplicated, setOpenDuplicated] = useState(false)
  const [snackBar, handleSnackBarClick] = useNotification()
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [forms, setForms] = useState([])
  const [selectedFolder, setSelectedFolder] = useState('')
  const [listaEstado, setListaEstado] = useState(false)
  const [duplicateName, setDuplicateName] = useState('')

  const [activeTab, setActiveTab] = useState('1')
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }
  const [modals, setModals] = useState(false)
  const toggles = () => setModals(!modals)
  const [currentCarpeta, setCurrentCarpeta] = useState({})
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    carpetaAction.getCategorias()
  }, [])
  useEffect(() => {
    setForms(
      state.forms.map((el) => {
        return {
          ...el,
          carpeta: el?.sB_CategoriaFormularioId
            ? state?.categorias?.find(
              (item) => item?.id == el?.sB_CategoriaFormularioId
						  )?.nombre
            : t('formularios>listado_formularios>sin_categoria', 'Sin categoría'),
          estado: el.envios > 0 ? t('formularios>listado_formularios>enviado', 'Enviado') : t('formularios>listado_formularios>borrador', 'Borrador'),
          fechaCreacion: moment(el.fechaInsercion).format(
            'DD/MM/YYYY'
          )
        }
      })
    )
  }, [state.forms, state.categorias])

  const onChangeValue = () => {
    const values = JSON.stringify(inputName)

    if (editando && !currentCarpeta) {
      handleSnackBarShow(
        t('formularios>listado_formularios>completar_campo', 'favor completar el campo si desea guardar'),
        'error'
      )
    }
    if (values == 'null' && !editando) {
      handleSnackBarShow(
        t('formularios>listado_formularios>completar_campo', 'favor completar el campo si desea guardar'),
        'error'
      )
    } else {
      if (!editando) {
        carpetaAction.saveCategories({ nombre: inputName })
      } else {
        let carpeta = state.categorias.filter(
          (cat) => cat.id === currentCarpeta.id
        )[0]
        carpeta = { ...carpeta, nombre: editValue.trim() }
        carpetaAction.editCategories(carpeta)
      }
      setModals(!modals)
      setInputName(null)
      setCurrentCarpeta(null)
      setEditando(false)
    }
  }
  const onCancelValue = () => {
    setModals(!modals)
    setModals(!modals)
    setInputName(null)
    setCurrentCarpeta(null)
    setEditando(false)
  }

  const handleSnackBarShow = (msg: string, variant: string) => {
    setSnacbarContent({
      variant,
      msg
    })
    handleSnackBarClick()
  }

  const handleDelete = (id) => {
    swal({
      title: t('formularios>listado_formularios>eliminar_categoria', '¿Está seguro que quiere eliminar la categoria?'),
      icon: 'warning',
      buttons: {
        ok: {
          text: t('general>editar', 'Aceptar'),
          value: true
        },
        cancel: t('general>editar', 'Cancelar')
      }
    }).then((result) => {
      if (result) {
        carpetaAction.deleteCategories(id)
      }
    })
  }

  const handleEdit = (id) => {
    setEditando(true)
    const item = state.categorias.filter((carpeta) => carpeta.id === id)[0]
    setCurrentCarpeta(item)
    setEditValue(item.nombre)
    toggles()
  }

  const onEditValueChange = (value) => {
    setEditValue(value)
  }

  useEffect(() => {
    if (activeTab === '1') {
      actions.getForms()
    }
  }, [activeTab])

  const toggleModal = () => {
    setModalItem(null)
  }

  const toggleDuplicateModal = () => {
    setOpenDuplicated(null)
  }
  const tableMetadata = React.useMemo(() => {
    const buildActions = (row) => {
      const onEditarEvent = (rowValue) => {
        actions.loadCurrentForm({
          ...rowValue,
          formulario: rowValue.autoguardadoFormulario
        })
        props.history.push(`/forms/edit/${rowValue.id}`)
      }
      const onRespuestaEvent = (rowValue) => {
        props.history.push(`/forms/responses/${rowValue.id}`)
      }
      const onDuplicarEvent = (rowValue) => {
        swal({
          title: t('formularios>listado_formularios>duplicar_formulario', '¿Está seguro que quiere duplicar el formulario?'),
          icon: 'warning',
          buttons: {
            ok: {
              text: t('general>editar', 'Aceptar'),
              value: true
            },
            cancel: t('general>editar', 'Cancelar')
          }
        }).then((result) => {
          if (result) {
            setOpenDuplicated(rowValue.id)
          }
        })
      }
      const onEliminarEvent = (rowValue) => {
        swal({
          title: t('formularios>listado_formularios>eliminar_respuestas_asociadas', '¿Está seguro que quiere eliminar el formulario y todas las respuestas asociadas?'),
          icon: 'warning',
          buttons: {
            ok: {
              text: t('general>editar', 'Aceptar'),
              value: true
            },
            cancel:  t('general>editar', 'Cancelar')
          }
        }).then((result) => {
          if (result) {
            actions.deleteForm(rowValue.id)
          }
        })
      }
      return (
        <IconContainer>
          <Tooltip title={t('general>editar', 'Editar')}>
            <Edit onClick={() => onEditarEvent(row)} />
          </Tooltip>
          <Tooltip title={t('general>eliminar', 'Eliminar')}>
            <Delete onClick={() => onEliminarEvent(row)} />
          </Tooltip>
          <Tooltip title={t('formularios>listado_formularios>copiar', 'Copiar')}>
            <FileCopy onClick={() => onDuplicarEvent(row)} />
          </Tooltip>
          <Tooltip title={t('formularios>listado_formularios>respuestas', 'Respuestas')}>
            <FormatListBulleted
              onClick={() => onRespuestaEvent(row)}
            />
          </Tooltip>
        </IconContainer>
      )
    }

    const columns = [
      {
        accessor: 'titulo',
        Header: t('formularios>listado_formularios>nombre_del_formulario', 'Nombre del formulario')
      },
      {
        accessor: 'cantidadRespuestas',
        Header: t('formularios>listado_formularios>formularios_completados', 'Formularios completados')
      },
      {
        accessor: 'carpeta',
        Header: t('formularios>listado_formularios>categoria', 'Categoría')
      },
      {
        accessor: 'estado',
        Header: t('formularios>listado_formularios>estado', 'Estado')
      },
      {
        accessor: 'fechaCreacion',
        Header: t('formularios>listado_formularios>fecha_creacion', 'Fecha de Creación')
      },
      {
        accessor: 'acciones',
        Header: t('general>acciones', 'Acciones')
      }
    ]

    const data =
			forms && forms.length > 0
			  ? forms?.map((i) => {
			    return {
			      ...i,
			      acciones: buildActions(i)
			    }
				  })
			  : []
    return {
      columns,
      data
    }
  }, [forms])
  const newMenus = creadorDeFormulariosItems.map((el) => ({
    ...el,
    label: t(`formularios>navigation>${el?.id}`, el?.label)
  }))
  return (
    <AppLayout items={newMenus}>
      <div>
        <button
          onClick={() => {
					  props.history.push('/forms')
          }}
          style={{
					  padding: '0',
					  margin: '0',
					  background: 'unset',
					  border: 'none'
          }}
        >
          <Back
            style={{ cursor: 'pointer' }}
            onClick={() => {
						  props.history.push('/forms')
            }}
          >
            <BackIcon />
            <BackTitle>Regresar</BackTitle>
          </Back>
        </button>
        {listaEstado && (
          <div>
            <Button
              className='btnVolver'
              size='lg'
              onClick={() => {
							  setListaEstado(false)
							  setSelectedFolder({})
              }}
            >
              <div
                style={{
								  display: 'flex',
								  alignItems: 'center',
								  justifyContent: 'center',
								  margin: '-1px',
								  width: '100%'
                }}
              >
                <ArrowBackIcon className='arrowClass' /> {t('formulario>enviar_formulario>volver', 'Volver')}
              </div>
            </Button>
          </div>
        )}
        <Typography variant='h5'>{t('formularios>listado_formularios>titulo', 'Listado de Formularios')}</Typography>
        <br />
        {!selectedFolder.id && (
          <Nav className='separator-tabs ml-0 mb-1 nav nav-tabs no_border'>
            <NavItem>
              {!listaEstado && (
                <div>
                  <NavLink
                    className={classnames({
										  active: activeTab === '1'
                  })}
                    onClick={() => {
										  toggle('1')
                  }}
                  >
            {t('formularios>listado_formularios>listado','Listado')}
                  </NavLink>
                </div>
              )}
              {listaEstado && (
                <div>
                  <NavLink>{t('formularios>listado_formularios>listado','Listado')}</NavLink>
                </div>
              )}
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
								  active: activeTab === '2'
                })}
                onClick={() => {
								  toggle('2')
                }}
              >
                
                {t('formularios>listado_formularios>categoria','Categoría')}
              </NavLink>
            </NavItem>
          </Nav>
        )}
        <br />
        <TabContent activeTab={activeTab}>
          <TabPane tabId='1'>
            <TableReactImplementation
              pageSize={10}
              data={tableMetadata.data}
              columns={tableMetadata.columns}
            />
            <Modal
              isOpen={Boolean(modalItem)}
              size='lg'
              toggle={toggleModal}
            >
              <ModalHeader toggle={toggleModal}>
                Versiones
              </ModalHeader>
              <ModalBody>
                <div>
                  {Boolean(modalItem) && (
                    <HTMLTable
                    columns={[
											  {
											    column: 'tipoGuardado',
											    label: t('formularios>listado_formularios>tipo_guardado', 'Tipo de guardado')
											  },
											  {
											    column: 'fehaModificacion',
											    label: t('formularios>listado_formularios>fecha_modificacion', 'Fecha de modificación')
											  },
											  {
											    column: 'horaModificacion',
											    label: t('formularios>listado_formularios>hora_modificacion', 'Hora de modificación')
											  }
                  ]}
                    selectDisplayMode='datalist'
                    data={[
											  {
											    id: 1,
											    itemId: modalItem.id,
											    tipoGuardado: 'Manual',
											    formulario:
														modalItem.formulario,
											    fehaModificacion: moment(
											      modalItem.fechaActualizacion
											    ).format('DD/MM/YYYY'),
											    horaModificacion: moment(
											      modalItem.fechaActualizacion
											    ).format('HH:mm')
											  },
											  {
											    id: 2,
											    itemId: modalItem.id,
											    tipoGuardado: 'Automático',
											    formulario:
														modalItem.autoguardadoFormulario,
											    fehaModificacion: moment(
											      modalItem.fechaActualizado
											    ).format('DD/MM/YYYY'),
											    horaModificacion: moment(
											      modalItem.fechaActualizado
											    ).format('HH:mm')
											  }
                  ]}
                    tableName='label.buscador'
                    showHeaders
                    hidePageSizes
                    loading={false}
                    toggleEditModal={(el) => {
											  if (
											    el.tipoGuardado === 'Manual'
											  ) {
											    actions.loadCurrentForm({
											      ...modalItem,
											      id: modalItem.id,
											      formulario:
															el.formulario
											    })
											    props.history.push(
														`/forms/edit/${el.itemId}/manual`
											    )
											  } else {
											    actions.loadCurrentForm({
											      ...modalItem,
											      id: modalItem.id,
											      formulario:
															el.formulario
											    })
											    props.history.push(
														`/forms/edit/${el.itemId}`
											    )
											  }
                  }}
                    PageHeading={false}
                    hideMultipleOptions
                    showHeadersCenter={false}
                  />
                  )}
                </div>
              </ModalBody>
            </Modal>
          </TabPane>
          <TabPane tabId='2'>
            {snackBar(snackbarContent.variant, snackbarContent.msg)}
            <Row>
              <Col sm='12'>
                {!listaEstado && (
                  <div
                    style={{
										  display: 'grid',
										  gridTemplateColumns:
												'25% 25% 25% 25%'
                  }}
                  >
                    <StyledButton onClick={toggles}>
                    <AddBoxIcon className='iconCrearCarpeta' />{' '}
                    {t('formularios>listado_formularios>crear_categoria', 'Crear categoría')}
										</StyledButton>
                    {state?.categorias?.map((item, i) => (
                    <DropCarpeta
                    key={i}
                    categoria={item}
                    delete={(id) =>
												  handleDelete(id)}
                    index={i}
                    edit={(id) => handleEdit(id)}
                    estado={setListaEstado}
                    parentTest={(value) =>
												  setSelectedFolder(value)}
                  />
                  ))}
                    <Modal
                    isOpen={modals}
                    className='modelPrincipal'
                  >
                    {editando && (
                    <div>
                    <ModalHeader
                    toggle={toggles}
                    style={{
														  fontfamily:
																'sans-serif',
														  color: '#000000'
                  }}
                  >
  {t('formularios>listado_formularios>editar_categori', 'Editar categoría')}
                  </ModalHeader>
                  </div>
                  )}
                    {!editando && (
                    <div>
                    <ModalHeader
                    toggle={toggles}
                    style={{
														  fontfamily:
																'sans-serif',
														  color: '#000000'
                  }}
                  >
  {t('formularios>listado_formularios>crear_categoria', 'Crear categoría')}
                  </ModalHeader>
                  </div>
                  )}
                    <ModalBody>
                    <span
                    style={{ color: '#000000' }}
                  >
  {t('formularios>listado_formularios>nombre_categoria', 'Nombre de categoría')}
                  </span>
                    <Input
                    type='text'
                    required
                    value={
														editando
														  ? editValue
														  : inputName
													}
                    onChange={(e) =>
													  editando
													    ? onEditValueChange(
													      e.target
													        .value
															  )
													    : setInputName(
													      e.target
													        .value
															  )}
                  />
                  </ModalBody>
                    <div className='ModalBtn'>
                    <Button
                    onClick={() =>
													  onCancelValue()}
                    className='btnCancelCarpeta'
                  >
  {t('general>cancelar', 'Cancelar')}
                  </Button>{' '}
                    <Button
                    onClick={() =>
													  onChangeValue()}
                    className='btnGuardarCarpeta'
                  >
  {t('general>guardar', 'Guardar')}
                  </Button>
                  </div>
                  </Modal>
                  </div>
                )}
                {listaEstado && (
                  <div>
                    <ListaForm
                    category={selectedFolder.id}
                    categoryName={selectedFolder.nombre}
                    setOpenDuplicated={(id) =>
											  setOpenDuplicated(id)}
                  />
                  </div>
                )}
              </Col>
            </Row>
          </TabPane>
        </TabContent>
        <Modal
          isOpen={Boolean(openDuplicated)}
          size='lg'
          toggle={toggleDuplicateModal}
        >
          <ModalHeader toggle={toggleDuplicateModal}>
            {t('formularios>listado_formularios>asignar_nombre', 'Asigne un nombre al formulario nuevo')}
          </ModalHeader>
          <ModalBody>
            <div>
              {Boolean(openDuplicated) && (
                <div>
                  <Input
                    value={duplicateName}
                    onChange={(e) =>
										  setDuplicateName(e.target.value)}
                  />
                </div>
              )}
            </div>
          </ModalBody>
          <div className='ModalBtn'>
            <Button
              onClick={() => {
							  toggleDuplicateModal()
							  setDuplicateName('')
              }}
              className='btnCancelCarpeta'
            >
              {t('general>cancelar', 'Cancelar')}
            </Button>{' '}
            <Button
              onClick={() => {
							  if (duplicateName !== '') {
							    actions.duplicateForm(
							      openDuplicated,
							      duplicateName
							    )
							    setDuplicateName('')
							    toggleDuplicateModal()
							  }
              }}
              className='btnGuardarCarpeta'
            >
              {t('general>guardar', 'Guardar')}
            </Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  )
}

const StyledButton = styled.button<{ optionMenu? }>`
	display: grid;
	grid-template-columns: 0.5fr 1fr 0.5fr;
	align-items: center;
	text-align: left;
	&:first-child {
		text-align: left;
	}
	&:last-child {
		text-align: ${(props) => (props.optionMenu ? 'right' : 'left')};
		align-items: ${(props) => (props.optionMenu ? 'right' : 'left')};
	}
	color: #423e3e;

	margin: 14px;
	background-color: #fff;
	border-radius: 40px;
	border: 1px solid #1a1c1f;
	max-width: 300px;
	min-height: 67px;

	line-height: 1.5;
	font-weight: 700;
	letter-spacing: 0.05rem;
	padding: 0.5rem 1rem;
`
const IconContainer = styled.div`
	color: #575757;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 5px;
`
const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`
export default withRouter(View)
