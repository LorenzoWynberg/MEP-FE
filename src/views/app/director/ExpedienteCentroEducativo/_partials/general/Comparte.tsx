import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useWindowSize } from 'react-use'
import {
  Card,
  CardBody,
  Row,
  Form,
  Col,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  CustomInput,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroupAddon,
  Button,
  ButtonDropdown
  , FormGroup
} from 'reactstrap'
import { Container } from '@material-ui/core'

import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { maxLengthString } from '../../../../../../utils/maxLengthString'
import { TooltipSimple } from '../../../../../../utils/tooltip.tsx'
import colors from '../../../../../../assets/js/colors'
import SearchIcon from '@material-ui/icons/Search'
import {
  updateSaredResource,
  clearInstitutions,
  deleteSharedResources,
  findByCodeOrName,
  selectSharedResource,
  getSharedResources,
  saveSharedResource,
  getSharedResource
} from '../../../../../../redux/institucion/actions'
import { useActions } from 'Hooks/useActions'
import { getCatalogs } from 'Redux/selects/actions'
import { catalogsEnumObj } from '../../../../../../utils/catalogsEnum'
import { useForm } from 'react-hook-form'
import { EditButton } from '../../../../../../components/EditButton'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import IntlMessages from 'Helpers/IntlMessages'
import swal from 'sweetalert'
import HTMLTable from 'Components/HTMLTable'
import Pagination from '../../../../../../components/table/Pagination'
import Select from 'react-select'
import search from 'Utils/search'
import { Edit, Delete } from '@material-ui/icons'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  inputTags: {
    minHeight: '3rem',
    border: '1px solid #d7d7d7;',
    padding: '0.35rem',
    color: 'white',
    marginBottom: '0.5rem'
  },
  input: {
    display: 'none'
  }
}))

type modalTypes = null | 'multi' | 'search'

interface createModal {
	open: boolean
	type: modalTypes
}

const Comparte = (props) => {
  const { t } = useTranslation()
  const { register, handleSubmit, setValue, errors, reset, watch } = useForm()
  const classes = useStyles()
  const [data, setData] = useState([])
  const [editingData, setEditingData] = useState(false)
  const [openCreateItem, setOpenCreateItem] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(null)
  const [editable, setEditable] = useState(false)
  const [createModals, setCreateModals] = useState<createModal>({
    open: false,
    type: null
  })
  const [stagedOptions, setStagedOptions] = useState([])
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(0)
  const [searchText, setSearchText] = useState('')
  const { width } = useWindowSize()
  const [currentItem, setCurrentItem] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [cachedData, setCachedData] = useState({})
  const [blockSaveButton, setBlockSaveButton] = useState(false)
  const [items, setItems] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [infraestructura, setInfraestructura] = useState([])
  const [selectedDR, setSelectedDR] = React.useState([])
  const [dropdownSplitOpen, setDropdownSplitOpen] = React.useState(false)
  const toggleSplit = () => {
    setDropdownSplitOpen(!dropdownSplitOpen)
  }
  useEffect(() => {
    setBlockSaveButton(false)
  }, [currentItem])

  const actions = useActions({
    clearInstitutions,
    getCatalogs,
    findByCodeOrName,
    selectSharedResource,
    getSharedResources,
    getSharedResource,
    saveSharedResource,
    deleteSharedResources,
    updateSaredResource
  })
  const state = useSelector((store) => {
    return {
      sharedResources: store.institucion.sharedResources,
      tipoInfraestructura:
				store.selects[catalogsEnumObj.TIPOINFRAESTRUCTURA.name],
      tipoServicios: store.selects[catalogsEnumObj.TIPOSERVICIO.name],
      currentSharedResource: store.institucion.currentSharedResource,
      currentInstitution: store.authUser.currentInstitution,
      institutions: store.institucion.institutions
    }
  })

  useEffect(() => {
    const loadData = async () => {
      setOpenCreateItem(false)
      const responseI = await actions.getCatalogs(
        catalogsEnumObj.TIPOINFRAESTRUCTURA.id
      )
      const responseS = await actions.getCatalogs(
        catalogsEnumObj.TIPOSERVICIO.id
      )
      const response = await actions.getSharedResources()
      setSelectedOption(0)
      setCurrentItem({})
    }
    loadData()
  }, [])

  const renderDataWithDelay = () => {
    state.currentSharedResource.datos
      ? setOptions(
        state.currentSharedResource.datos
          .filter((d) => d.codigoCatalogo == 22)
          .map((d) => d?.elementoId)
			  )
      : setOptions([])
    state.currentSharedResource.datos
      ? setInfraestructura(
        state.currentSharedResource.datos
          .filter((d) => d.codigoCatalogo == 21)
          .map((d) => d?.elementoId)
			  )
      : setInfraestructura([])
    setTimeout(() => {
      setValue(
        'infraestructura',
        state.currentSharedResource.datos
          ? state.currentSharedResource.datos.find(
            (d) => d.codigoCatalogo == 21
					  )?.elementoId
          : ''
      )
      setValue('observaciones', state.currentSharedResource.observaciones)
    }, 200)
  }

  useEffect(() => {
    setCurrentItem({ ...state.currentSharedResource })
    if (editingData) {
      renderDataWithDelay()
    } else {
      setCachedData({ ...state.currentSharedResource })
      if (state.currentSharedResource.datos) {
        renderDataWithDelay()
      }
    }
  }, [state.currentSharedResource])

  useEffect(() => {
    if (editingData) {
      setCurrentItem({ ...cachedData })
      cachedData.datos
        ? setOptions(
          cachedData.datos
            .filter((d) => d.codigoCatalogo == 22)
            .map((d) => d?.elementoId)
				  )
        : setOptions([])
      cachedData.datos
        ? setInfraestructura(
          cachedData.datos
            .filter((d) => d.codigoCatalogo == 21)
            .map((d) => d?.elementoId)
				  )
        : setInfraestructura([])
      setValue(
        'infraestructura',
        cachedData.datos
          ? cachedData.datos.find((d) => d.codigoCatalogo == 21)
            ?.elementoId
          : ''
      )
      setValue('observaciones', cachedData.observaciones)
    } else {
      reset()
      setCurrentItem({})
      setOptions([])
      setInfraestructura([])
    }
  }, [editable])

  const columns1 = [
    { column: 'codigo', label: 'Código', width: 22, sum: 4 },
    { column: 'nombre', label: 'Nombre' },
    { column: 'infraestructura', label: 'Infraestructura que comparte' },
    { column: 'servicios', label: 'Servicios que comparte' }
  ]

  const tableActions = [
    {
      actionName: 'button.remove',
      actionFunction: (e) => {
        swal({
          title: 'Atención',
          text: '¿Está seguro que quiere eliminar estas relaciones de servicios compartidos?',
          dangerMode: true,
          icon: 'warning',
          buttons: ['Cancelar', 'Aceptar']
        }).then((val) => {
          if (val) {
            actions.deleteSharedResources(e)
          }
        })
      },
      actionDisplay: () => true
    }
  ]
  const actionRow = [
    {
      actionName: 'button.remove',
      actionFunction: (e) => {
        swal({
          title: 'Atención',
          text: '¿Está seguro que quiere eliminar esta relación de servicio compartido? ',
          dangerMode: true,
          icon: 'warning',
          buttons: ['Cancelar', 'Aceptar']
        }).then(async (val) => {
          if (val) {
            const response = await actions.deleteSharedResources([
              e.id
            ])
            if (response.error) {
              props.showSnackbar(response.error, 'error')
            } else {
              props.showSnackbar(
                'Se ha eliminado correctamente',
                'success'
              )
            }
          }
        })
      },
      actionDisplay: () => true
    },
    {
      actionName: 'label.edit',
      actionFunction: async (e) => {
        await actions.getSharedResource(e.id)
        await setEditingData(true)
        setOpenCreateItem(true)
      },
      actionDisplay: () => true
    }
  ]

  const toggleAddNewModal = () => {
    setOpenCreateItem(!openCreateItem)
    setEditable(!editable)
  }

  const toggle = (e: EventHandlerNonNull, type: modalTypes, cb = null) => {
    cb && cb()
    if (type === createModals.type) {
      return setCreateModals({ open: false, type: null })
    }
    if (type) {
      return setCreateModals({ open: !createModals.open, type })
    }
    return setCreateModals({ open: false, type: null })
  }

  const handleChangeItem = (item) => {
    let _options = [...stagedOptions]
    if (_options.includes(item.id)) {
      _options = _options.filter((option) => option !== item.id)
    } else {
      _options.push(item.id)
    }

    setStagedOptions(_options)
  }

  const resetState = () => {
    setOpenCreateItem(false)
    setOptions([])
    setInfraestructura([])
    setCurrentItem({})
    setStagedOptions([])
    setEditingData(false)
  }

  const sendData = async (data) => {
    let _data
    let response
    if (!data.infraestructura) {
      data.infraestructura = []
    }
    if (!editingData) {
      _data = {
        institucionId: state.currentInstitution.id,
        institucionComparteId: currentItem.id,
        observaciones: data.observaciones,
        elementosCatalogosIds: [...options, ...infraestructura]
      }
      console.log({
        institucionId: state.currentInstitution.id,
        institucionComparteId: currentItem.id,
        observaciones: data.observaciones,
        elementosCatalogosIds: [...options, ...infraestructura]
      })
      response = await actions.saveSharedResource(_data)

      if (
        response?.errors?.InstitucionComparteId &&
				response?.errors?.InstitucionComparteId[0] ===
					'El centro educativo ya comparte con este centro educativo'
      ) {
        setBlockSaveButton(true)
      }
    } else {
      _data = {
        id: currentItem.id,
        institucionId: currentItem.institucionId,
        institucionComparteId: currentItem.institucionComparteId,
        observaciones: data.observaciones,
        elementosCatalogosIds: [...options, ...infraestructura]
      }
      response = await actions.updateSaredResource(_data)
    }
    if (!response.error) {
      resetState()
    } else {
      const errors = []
      for (const fieldName in response.errors) {
        if (response.errors.hasOwnProperty(fieldName)) {
          errors.push(response.errors[fieldName])
        }
      }
      if (errors.length > 0) {
        errors.map((x) => {
          props.showSnackbar(x, 'error')
        })
      } else {
        props.showSnackbar(
          response.error !== true
            ? response.error
            : 'Las validaciones fallaron',
          'error'
        )
      }
    }
  }

  const endIndex = currentPage * 10
  const startIndex = endIndex - 10
  const currentElements = () => {
    return state.institutions.slice(startIndex, endIndex)
  }
  const columns = useMemo(() => {
    return [
      {
        label: '',
        column: 'id',
        accessor: 'id',
        Header: '',
        Cell: ({ row }) => {
          return (
            <div
              style={{
							  textAlign: 'center',
							  display: 'flex',
							  justifyContent: 'center',
							  alignItems: 'center'
              }}
            >
              <input
                className='custom-checkbox mb-0 d-inline-block'
                type='checkbox'
                id='checki'
                style={{
								  width: '1rem',
								  height: '1rem',
								  marginRight: '1rem'
                }}
                onClick={(e) => {
								  e.stopPropagation()
								  if (selectedDR.includes(row.original.id)) {
								    const i = selectedDR.indexOf(
								      row.original.id
								    )
								    selectedDR.splice(i, 1)

								    setSelectedDR([...selectedDR])
								  } else {
								    selectedDR.push(row.original.id)
								    setSelectedDR([...selectedDR])
								  }
                }}
                checked={
									(selectedDR?.length === row?.length &&
										row?.length > 0) ||
									selectedDR?.includes(row.original.id)
								}
              />
            </div>
          )
        }
      },
      {
        Header: t("expediente_ce>infraestructura>comparte_columna_codigo", "Código"),
        column: 'codigo',
        accessor: 'codigo',
        label: ''
      },
      {
        Header: t("expediente_ce>infraestructura>comparte_columna_nombre", "Nombre"),
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: t("expediente_ce>infraestructura>comparte_columna_infraestructura_comparte", "Infraestructura que comparte"),
        column: 'infraestructura',
        accessor: 'infraestructura',
        label: ''
      },
      {
        Header: t("expediente_ce>infraestructura>comparte_columna_servicios_comparte","Servicios que comparte"),
        column: 'servicios',
        accessor: 'servicios',
        label: ''
      },
      {
        Header: t("expediente_ce>infraestructura>comparte_columna_acciones", "Acciones"),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Tooltip title='Editar'>
                <Edit
                  className='mr-2'
                  style={{
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                  onClick={async () => {
									  {
									    await actions.getSharedResource(
									      fullRow.id
									    )
									    await setEditingData(true)
									    setOpenCreateItem(true)
									  }
                  }}
                />
              </Tooltip>

              <Tooltip title='Eliminar'>
                <Delete
                  style={{
									  cursor: 'pointer',
									  color: colors.darkGray
                  }}
                  onClick={() => {
									  swal({
									    title: 'Atención',
									    text: '¿Está seguro que quiere eliminar esta relación de servicio compartido? ',
									    dangerMode: true,
									    icon: 'warning',
									    buttons: ['Cancelar', 'Aceptar']
									  }).then(async (val) => {
									    if (val) {
									      const response =
													await actions.deleteSharedResources(
													  [fullRow.id]
													)
									      if (response.error) {
									        props.showSnackbar(
									          response.error,
									          'error'
									        )
									      } else {
									        props.showSnackbar(
									          'Se ha eliminado correctamente',
									          'success'
									        )
									      }
									    }
									  })
                  }}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [selectedDR,t])
  const handleDelete = async (ids) => {
    swal({
      title: 'Atención',
      text: '¿Está seguro que quiere eliminar esta relación de servicio compartido? ',
      dangerMode: true,
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar']
    }).then(async (result) => {
      if (result) {
        ids.forEach(async (value) => {
          const response = await actions.deleteSharedResources([
            value
          ])
          if (response.error) {
            props.showSnackbar(response.error, 'error')
          } else {
            props.showSnackbar(
              'Se ha eliminado correctamente',
              'success'
            )
          }
        })
        selectedDR.splice(0, selectedDR.length)
        setSelectedDR([...selectedDR])
      }
    })
  }
  return (
    <div>
      <h4 style={{ marginTop: 30, marginBottom: 10 }}>
        {t("expediente_ce>infraestructura>agregar_comparte>comparte_centro", "Comparte con otros centros educativos")}
      </h4>
      {!openCreateItem && (
        <div
          style={{
					  display: 'flex',
					  justifyContent: 'flex-end'
          }}
        >
          <Button color='primary' onClick={toggleAddNewModal}>
            {' '}
           {t("boton>general>agregrar", "Agregar")}{' '}
          </Button>

          <StyledButtonDropdown
            isOpen={dropdownSplitOpen}
            toggle={toggleSplit}
            disabled={!editable}
          >
            <div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
              <CustomInput
                className='custom-checkbox mb-0 d-inline-block'
                type='checkbox'
                id='checkAll'
                onClick={(e) => {
								  e.stopPropagation()

								  if (
								    selectedDR?.length ===
										state.sharedResources.map((el) => ({
										  ...el,
										  servicios:
												el.servicios || 'No aplica'
										}))?.length
								  ) {
								    selectedDR.splice(0, selectedDR.length)
								    setSelectedDR([...selectedDR])
								  } else {
								    state.sharedResources
								      .map((el) => ({
								        ...el,
								        servicios:
													el.servicios || 'No aplica'
								      }))
								      .forEach(function (row, index) {
								        if (
								          !selectedDR.includes(row.id)
								        ) {
								          selectedDR.push(row.id)
								          setSelectedDR([
								            ...selectedDR
								          ])
								        }
								      })
								  }
                }}
                checked={
									selectedDR?.length ===
										state.sharedResources.map((el) => ({
										  ...el,
										  servicios:
												el.servicios || 'No aplica'
										}))?.length &&
									state.sharedResources.map((el) => ({
									  ...el,
									  servicios: el.servicios || 'No aplica'
									}))?.length > 0
								}
              />
            </div>
            <DropdownToggle
              caret
              color='primary'
              className='dropdown-toggle-split btn-lg'
            />
            <DropdownMenu right>
              <DropdownItem
                onClick={() => {
								  if (selectedDR?.length > 0) { handleDelete(selectedDR) }
                }}
              >
                {t("boton>general>eliminar", "Eliminar")}
              </DropdownItem>
            </DropdownMenu>
          </StyledButtonDropdown>
        </div>
      )}
      {!openCreateItem && (
        <TableReactImplementation
          data={state.sharedResources.map((el) => ({
					  ...el,
					  servicios: el.servicios || 'No aplica'
          }))}
          handleGetData={() => {}}
          columns={columns}
          orderOptions={[]}
          avoidSearch
        />
      )}
      {/* <HTMLTable
				columns={columns}
				data={state.sharedResources.map((el) => ({
					...el,
					servicios: el.servicios || 'No aplica'
				}))}
				isBreadcrumb={false}
				actions={tableActions}
				actionRow={actionRow}
				match={props.match}
				tableName="label.informacionGeneral"
				selectDisplayMode="datalist"
				toggleModal={toggleAddNewModal}
				modalOpen={false}
				editModalOpen={false}
				selectedOrderOption={{
					column: 'nombre',
					label: 'Nombre Completo'
				}}
				showHeaders={true}
				showHeadersCenter={false}
				modalfooter={true}
				loading={false}
				orderBy={false}
				labelSearch={false}
				totalRegistro={0}
				listView={false}
				dataListView={true}
				imageListView={false}
				customThumbList={false}
				listPageHeading={false}
				disableSearch={true}
			/> */}
      {openCreateItem && (
        <>
          <NavigationContainer
            onClick={(e) => {
						  resetState()
						  toggleAddNewModal()
            }}
          >
            <ArrowBackIosIcon />
            <h4>
              <IntlMessages id='pages.go-back-home' />
            </h4>
          </NavigationContainer>
          <Container>
            <Form onSubmit={handleSubmit(sendData)}>
              <Row>
                <Col xs={12} md={6}>
                  <Card>
                    <CardBody>
                    <Row>
                    <Col>
                    <Label className='d-flex justify-content-start align-items-center'>
                    <span className='mr-2' style={{ fontSize: '0.75rem' }}>
                    {t("expediente_ce>infraestructura>agregar_comparte>seleccionar_centro", "Seleccionar centro educativo")}
														</span>{' '}
                    <SearchIcon />
                  </Label>
                    <Input
                    type='text'
                    disabled={!editable}
                    value={
															currentItem.nombre
														}
                    onClick={(e) => {
														  toggle(
														    e,
														    'search',
														    () => {
														      actions.clearInstitutions()
														      setSelectedOption(
														        1
														      )
														    }
														  )
                  }}
                  />
                  </Col>

                    <Col xs={12}>
                    <FormGroup>
                    <Label style={{ fontSize: '0.75rem' }}>
                    {t("expediente_ce>infraestructura>agregar_comparte>infraestructura_compartida", "Infraestructura compartida")}
														</Label>
                    <Select
                    options={state.tipoInfraestructura.map(
															  (el) => ({
															    label: el?.nombre,
															    value: el
															  })
                  )}
                    onChange={(
															  value
                  ) => {
															  setInfraestructura(
															    value?.map(
															      (el) =>
															        el
															          ?.value
															          ?.id
															    )
															  )
                  }}
                    isMulti
                    defaultValue={state.tipoInfraestructura
															  ?.filter((el) =>
															    infraestructura?.includes(
															      el?.id
															    )
															  )
															  .map((el) => ({
															    label: el?.nombre,
															    value: el
															  }))}
                  />
                  </FormGroup>
                    <FormGroup>
                    <Label style={{ fontSize: '0.75rem' }}>
                    {t("expediente_ce>infraestructura>agregar_comparte>servicio_compartido", "Servicio compartido")}
														</Label>
                    <StyledMultiSelect
                    className={
																classes.inputTags
															}
                    disabled={!editable}
                    onClick={(e) => {
															  toggle(
															    e,
															    'multi',
															    () => {
															      setStagedOptions(
															        options
															      )
															    }
															  )
                  }}
                  >
                    {options.map(
                      (option) => {
                        const item =
                          state.tipoServicios.find(
                            (
                              s
                            ) =>
                              s.id ===
                              option
                          )
                        return (
                        <SelectItem
                          item={
                              item
                            }
                          />
                        )
                      }
                  )}
                  </StyledMultiSelect>
                  </FormGroup>
                    <FormGroup>
                    <Label style={{ fontSize: '0.75rem' }}>
                    {t("expediente_ce>infraestructura>agregar_comparte>observaciones", "Observaciones")}
														</Label>
                    <Input
                    type='textarea'
                    disabled={!editable}
                    name='observaciones'
                    rows={8}
                    innerRef={register}
                  />
                  </FormGroup>
                  </Col>
                  </Row>
                  </CardBody>
                  </Card>
                </Col>
              </Row>
              <br />
              <Row>
                <CenteredCol xs={12} md={6}>
                  <EditButton
                    editable={editable}
                    setEditable={setEditable}
                    disabledSubmit={blockSaveButton}
                  />
                </CenteredCol>
              </Row>
            </Form>
            <Modal
              isOpen={
								createModals.open &&
								createModals.type === 'search'
							}
              toggle={toggle}
              size='lg'
            >
              <ModalHeader toggle={toggle}>
                {t("expediente_ce>infraestructura>agregar_comparte>buscar_inst", "Buscar institución")}
              </ModalHeader>
              <ModalBody>
                <div
                  className='search-sm--rounded mb-3'
                  style={{
									  width: '100%'
                  }}
                >
                  <input
                    type='text'
                    name='keyword'
                    id='search'
                    onKeyPress={(e) => {
										  if (
										    e.key === 'Enter' ||
												e.keyCode === 13
										  ) {
										    actions.findByCodeOrName(
										      e.target.value
										    )
										  }
                  }}
                    value={searchValue}
                    onChange={(e) =>
										  setSearchValue(e.target.value)}
                    placeholder='Buscar'
                  />
                  <StyledInputGroupAddon
                    style={{ zIndex: 2 }}
                    addonType='append'
                  >
                    <Button
                    color='primary'
                    className='buscador-table-btn-search'
                    onClick={() => {
											  actions.findByCodeOrName(
											    searchValue
											  )
                  }}
                    id='buttonSearchTable'
                  >
                   {t("general>buscar", "Buscar")}
                  </Button>
                  </StyledInputGroupAddon>
                </div>
                <SearchOptionsContainer>
                  <tr>
                    <th />
                    <th />
                  </tr>
                  {currentElements().map((item) => {
									  return (
                  <Item
                    className='cursor-pointer'
                    onClick={() => {
												  actions.selectSharedResource(
												    item
												  )
												  toggle()
                    }}
                  >
                    <td
                      style={{
													  textAlign: 'center'
                      }}
                    >
                      <p>{item.codigo}</p>
                    </td>
                    <td>
                      <p>{item.nombre}</p>
                    </td>
                  </Item>
									  )
                  })}
                  <Pagination
                    currentPage={currentPage}
                    totalPage={Math.ceil(
										  state.institutions.length / 10
                  )}
                    onChangePage={(i) => setCurrentPage(i)}
                  />
                </SearchOptionsContainer>
              </ModalBody>
            </Modal>
            <Modal
              isOpen={
								createModals.open &&
								createModals.type === 'multi'
							}
              toggle={toggle}
              size='lg'
            >
              <ModalHeader toggle={toggle}>
                {t("expediente_ce>infraestructura>agregar_comparte>seleccionar_opt", "Seleccione las opciones que apliquen")}
              </ModalHeader>
              <ModalBody>
                <Container className='modal-detalle-subsidio'>
                  <Row>
                    <Col xs={12}>
                    {state.tipoServicios.map((item) => {
											  return (
                  <Row>
                    <Col
                      xs={3}
                      className='modal-detalle-subsidio-col'
                    >
                      <div>
                        <CustomInput
                          type='checkbox'
                          label={
                            item.nombre
                          }
                            inline
                            onClick={() =>
                            handleChangeItem(
                              item
                            )}
                            checked={
                            stagedOptions.includes(
                              item.id
                            ) ||
                            stagedOptions.includes(
                              item?.elementoId
                            )
                          }
                      />
                    </div>
                  </Col>
                  <Col
                    xs={9}
                    className='modal-detalle-subsidio-col'
                  >
                    <div>
                      <p>
                        {item.descripcion
																	  ? item.descripcion
																	  : item.detalle
																	    ? item.detalle
																	    : 'Elemento sin detalle actualmente'}
                          </p>
                        </div>
                      </Col>
                    </Row>
											  )
                  })}
                  </Col>
                  </Row>
                  <Row>
                    <CenteredCol xs='12'>
                    <Button
                    onClick={(e) => {
												  toggle(e, 'multi', () => {
												    setStagedOptions([])
												  })
                  }}
                    color='primary'
                    outline
                  >
                  {t("boton>general>cancelar", "Cancelar")}
                  </Button>
                    <Button
                    color='primary'
                    onClick={(e) => {
												  toggle(e, 'multi', () => {
												    setOptions(
												      stagedOptions
												    )
												    setStagedOptions([])
												  })
                  }}
                  >
                  {t("boton>general>guardar", "Guardar")}
                  </Button>
                  </CenteredCol>
                  </Row>
                </Container>
              </ModalBody>
            </Modal>
          </Container>
        </>
      )}
    </div>
  )
}

const SelectItem = (props) => {
  if (props.item) {
    return (
      <TooltipSimple
        element={
          <ItemSpan>{maxLengthString(props.item.nombre)}</ItemSpan>
				}
        title={props.item.nombre}
      />
    )
  } else {
    return null
  }
}

const NavigationContainer = styled.span`
	display: flex;
	cursor: pointer;
`

const ItemSpan = styled.span`
	background-color: ${colors.primary};
	padding-left: 8px;
	padding-right: 8px;
	border-radius: 15px;
	height: 1.45rem;
	margin: 2px;
`

const Item = styled.tr`
	width: 100%;
	display: grid;
	grid-template-columns: 30% 70%;
	border-radius: 15px;
	box-shadow: 0px 0px 9px 0px rgba(189, 185, 189, 1);
	height: 4rem;
	padding: 25px;
	margin-bottom: 20px;
`

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`

const StyledMultiSelect = styled.div`
	display: grid;
	grid-template-columns: 50% 50%;

	position: relative;

	&::after {
		content: '+';
		color: white;
		position: absolute;
		right: 10px;
		top: 30%;
		background-color: ${colors.primary};
		border-radius: 50%;
		height: 1.5rem;
		width: 1.5rem;
		font-weight: bold;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 21px;
	}

	&[disabled] {
		background-color: #eaeaea;
	}
`

const SearchOptionsContainer = styled.table`
	width: 100%;
	height: 25rem;
	overflow-y: auto;
	padding: 20px;
	/* width */
	&::-webkit-scrollbar {
		width: 10px;
		border-radius: 30%;
	}

	/* Track */
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/* Handle */
	&::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 15px;
	}

	/* Handle on hover */
	&::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`

const StyledInput = styled(Input)`
	width: 60%;
	height: 40px;
	border-radius: 42px;
	position: relative;
	text-align: center;
`
const StyledButtonDropdown = styled(ButtonDropdown)`
	margin-left: 10px;
	margin-right: 10px;
`

const StyledInputIcon = styled.div`
	font-size: 14px;
	border-radius: 50px;
	color: white;
	position: absolute;
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	cursor: pointer;
	top: 3px;
	bottom: 2px;
	left: 2px;
	background-color: ${colors.primary};
	color: white;
`

const SearchBox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
`

const CenteredCol = styled(Col)`
	display: flex;
	justify-content: center;
	align-items: center;
`

export default Comparte
