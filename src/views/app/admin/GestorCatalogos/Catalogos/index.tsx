import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Label,
  ModalBody,
  Input,
  Form,
  ModalHeader,
  FormFeedback,
  InputGroup,
  InputGroupText,
  InputGroupAddon
} from 'reactstrap'
import styled from 'styled-components'
import { Colxx } from '../../../../../components/common/CustomBootstrap'
import MenuCatalogo from '../_partials/MenuCatalogo/Menu'
import BallotIcon from '@material-ui/icons/Ballot'
import colors from '../../../../../assets/js/colors'
import { useForm } from 'react-hook-form'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../../hooks/useActions'
import {
  canDeactivateTipoCatalogo,
  getCatalogos,
  saveCatalogos,
  updateCatalogos,
  updateStateCatalogos,
  setCatalogoActive
} from '../../../../../redux/catalogos/actions'
import {
  getElementos,
  saveElementos,
  updateElementos,
  updateStateElementos,
  setElementosActive
  , getElementosEstructura
} from '../../../../../redux/elementos/actions'

import { getEstructuraCatalogo } from '../../../../../redux/estructuraCatalogos/actions'
import { ProfileFormGroup } from '../../_partials/Roles/ProfileFormGroup'
import { cloneDeep } from 'lodash'
import HTMLTable from '../../../../../components/HTMLTable/single'
import SearchIcon from '@material-ui/icons/Search'
import { Paginationtype } from '../../../../../types/pagination'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import SimpleModal from 'Components/Modal/simple'
import FormElementosCatalogos from '../_partials/MenuCatalogo/formElementosCatalogos'
import AddIcon from '@material-ui/icons/Add'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import useNotification from 'Hooks/useNotification'
import BookDisabled from 'Assets/icons/bookDisabled'
import BookAvailable from 'Assets/icons/bookAvailable'
import search from 'Utils/search'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'

type catalogoProps = {
  type: string
  key: number
  setKey: Function
  setType: Function
  // currentCatalogo: Function,
  // setCurrentCatalogo: Function,
  elementos: any
  detalle: any
  setDetalle: any
}

const CatalogoList: React.FunctionComponent<catalogoProps> = (props) => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [visibleForm, setVisibleForm] = React.useState<boolean>(false)
  const [visibleFormElementoCatalogo, setVisibleFormElementoCatalogo] =
    React.useState<boolean>(false)
  const [editingForElementoCatalogo, setEditingFormElementoCatalogo] =
    React.useState<boolean>(false)
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const [loading, setLoading] = useState(false)
  // const [data, setData] = React.useState<Array<any>>([]);
  const [data, setData] = useState({})
  const [dataElementosCatalogos, setDataElementosCatalogos] = useState({})
  const [element, setElement] = React.useState<Array<any>>([])
  const [currentElementoCatalogo, setCurrentElementoCatalogo] = React.useState<
    Array<any>
  >([])
  const [currentCatalogo, setCurrentCatalogo] = React.useState<Array<any>>([])
  const [currentType, setCurrentType] = useState({})
  const [currentSection, setCurrentSection] = useState({})
  const [profiles, setProfiles] = useState([])
  const { handleSubmit, register, reset, errors, watch, setValue, control } =
    useForm()
  const [currentAlert, setCurrentAlert] = React.useState<any>(null)
  const [filterText, setFilterText] = useState('')
  const [filterTextElementoCatalogo, setFilterTextElementoCatalogo] =
    useState('')
  const [pagination, setPagination] = React.useState<Paginationtype>({
    pagina: 1,
    cantidad: 10
  })
  const [editing, setEditing] = useState<boolean>(false)
  const [confirmModalCatalogo, setConfirmModalCatalogo] =
    useState<boolean>(false)
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const [confirmModalTipoCatalogo, setConfirmModalTipoCatalogo] =
    useState<boolean>(false)
  const [confirmModalElementoCatalogo, setConfirmModalElementoCatalogo] =
    useState<boolean>(false)
  const [snackbar, handleClick] = useNotification()
  const [filteredData, setFilteredData] = useState([])
  const [filteredDataElementoCatalogo, setFilteredDataElementoCatalogo] =
    useState([])
  const [isEditingTipoCatalogo, setEditingTipoCatalogo] = useState(false)
  type IState = {
    catalogos: any
    elementos: any
    estructuraCatalogos: any
    elementoActivo: any
  }

  const [snackbarContent, setSnackbarContent] = useState({
    msg: '',
    variant: ''
  })

  const state = useSelector((store: IState) => {
    return {
      catalogos: store.catalogos,
      elementos: store.elementos.elementos,
      estructura: store.estructuraCatalogos.estructura,
      elementoActivo: store.elementos.elementoActivo,
      catalogoActivo: store.catalogos.catalogoActivo
    }
  })

  const [disable, setDisable] = React.useState<boolean>(false)

  const actions = useActions({
    getCatalogos,
    getElementos,
    getElementosEstructura,
    getEstructuraCatalogo,
    saveCatalogos,
    updateCatalogos,
    saveElementos,
    updateElementos,
    updateStateElementos,
    setElementosActive,
    updateStateCatalogos,
    setCatalogoActive
  })

  React.useEffect(() => {
    loadDataEstructura()
    loadData()
  }, [])

  React.useEffect(() => {
    const filtered = state.catalogos.catalogos.filter(
      (i) => i.esOculto == false
    )
    setFilteredData(filtered)
  }, [state.catalogos.catalogos])

  React.useEffect(() => {
    setFilteredDataElementoCatalogo(state.elementos.entityList)
  }, [state.elementos.entityList])

  const openConfirmModalTipoCatalogo = async (item): Promise<void> => {
    setConfirmModalTipoCatalogo(true)
    await actions.setCatalogoActive(item)
  }

  const closeConfirmModalTipoCatalogo = async (): Promise<void> => {
    setConfirmModalTipoCatalogo(false)
    await actions.setCatalogoActive(null)
  }

  const closeConfimModal = async (): Promise<void> => {
    setConfirmModal(false)
    await actions.setElementosActive(null)
  }

  const openConfimModal = async (item): Promise<void> => {
    setConfirmModal(true)
    await actions.setElementosActive(item)
  }

  const openConfimModalCatalogo = () => {
    setConfirmModalCatalogo(true)
  }

  const closeConfimModalCatalogo = () => {
    setConfirmModalCatalogo(false)
  }

  const openConfimModalElementoCatalogo = () => {
    setConfirmModalElementoCatalogo(true)
  }

  const closeConfimModalElementoCatalogo = () => {
    setConfirmModalElementoCatalogo(false)
  }

  const loadData = async () => {
    await actions.getCatalogos()
  }

  const loadDataEstructura = async () => {
    await actions.getEstructuraCatalogo()
  }

  const fetchElementos = async (catalogo) => {
    setLoading(true)
    await actions.getElementosEstructura(
      pagination.pagina,
      pagination.cantidad,
      catalogo.id
    )
    setLoading(false)
  }

  const sendData = async () => {
    let response = null

    if (isEditingTipoCatalogo) {
      const itCan = await canDeactivateTipoCatalogo(data.id)

      if (itCan == false && data.estado == 'false') {
        setOpenModalWarningDesactivacionTipoCatalogo(true)
        closeConfimModalCatalogo()
        return
      }
    }
    if (data.id) {
      response = await actions.updateCatalogos(data)
    } else {
      data.Estado = true
      response = await actions.saveCatalogos(data) // menu contextual al guardar en el modal (agregar)
    }
    if (!response.error) {
      setData({})
      loadData()
      closeConfimModalCatalogo()
      closeModal()
    }
  }

  const sendDataElementoCatalogo = async (dataElementosCatalogos) => {
    let response = null
    dataElementosCatalogos.tiposCatalogo = currentCatalogo.id
    if (dataElementosCatalogos.id) {
      response = await actions.updateElementos(dataElementosCatalogos) // menu contextual al guardar en el modal (agregar)
    } else {
      dataElementosCatalogos.id = 0
      response = await actions.saveElementos(dataElementosCatalogos) // menu contextual al guardar en el modal (agregar)
    }

    if (!response.error) {
      setDataElementosCatalogos({})
      setVisibleFormElementoCatalogo(false)
      setConfirmModalElementoCatalogo(false)
      openConfimModalElementoCatalogo()
      // closeConfimModalElementoCatalogo()
      // handleLoadAsginaturas()
    }
  }

  const openModalElementoCatalogo = () => {
    setDataElementosCatalogos({})
    setEditingFormElementoCatalogo(false)
    setVisibleFormElementoCatalogo(true)
  }

  const closeModalElementoCatalogo = () => {
    setVisibleFormElementoCatalogo(false)
  }

  const closeModal = () => {
    reset()
    setOpenCreateModal(false)
  }

  const handleChange = (item, permission) => {
    const _data = cloneDeep(data)
    if (_data[item.nombre]) {
      _data[item.nombre][permission] = !_data[item.nombre][permission]
    } else {
      _data[item.nombre] = {
        [permission]: true
      }
    }
    setData(_data)
  }

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      onSearch()
      return false
    }
  }

  const onSearch = async () => {
    setLoading(true)
    setFilteredData(
      search(filterText).in(state.catalogos.catalogos, ['nombre'])
    )
    setLoading(false)
  }

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  /* const onSearchElementoCatalogo = async () => {
        setLoading(true);
        setFilteredData(search(filterTextElementoCatalogo).in(state.elementos.entityList, [
            'nombre',
          ]));
        setLoading(false);
    } */

  const changeState = async () => {
    const estado = state.elementoActivo.estado
    const id = state.elementoActivo.id

    const response = await actions.updateStateElementos(id, estado ? 0 : 1)

    if (response.error) {
      setSnackbarContent({
        variant: 'error',
        msg: response.error
      })
    } else {
      fetchElementos(currentCatalogo)
      setSnackbarContent({
        variant: 'success',
        msg: `Registro ${
          state.elementoActivo.estado ? 'inactivado' : 'activado'
        } con exito`
      })
    }
    // progressInCard(true)
    // progressInCard(false)

    handleClick()
    closeConfimModal()
  }

  const changeStateTipoCatalogo = async () => {
    const estado = state.catalogoActivo.estado
    const id = state.catalogoActivo.id

    const response = await actions.updateStateCatalogos(id, estado ? 0 : 1)

    if (response.error) {
      setSnackbarContent({
        variant: 'error',
        msg: response.error
      })
    } else {
      // fetchElementos(currentCatalogo);
      setSnackbarContent({
        variant: 'success',
        msg: `Registro ${
          state.catalogoActivo.estado ? 'inactivado' : 'activado'
        } con exito`
      })
    }
    handleClick()
    closeConfirmModalTipoCatalogo()
  }

  const columns = [
    {
      column: 'id',
      label: 'Identificador'
    },
    {
      column: 'nombreCatalogo',
      label: 'Nombre del catálogo'
    },
    {
      column: 'orden',
      label: 'Orden'
    },
    {
      column: 'codigo',
      label: 'Código'
    },
    {
      column: 'nombre',
      label: 'Nombre del elemento'
    },
    {
      column: 'sb_tiposCatalogo_id',
      label: 'Id del catálogo'
    },
    {
      column: 'strEstado',
      label: 'Estado'
    }
  ]

  const actionRow = [
    {
      actionName: 'Activar',
      actionFunction: async (el) => openConfimModal(el),
      actionDisplay: (el) => !el.estado,
      icon: <BookAvailable />
    },
    {
      actionName: 'Inactivar',
      actionFunction: async (el) => openConfimModal(el),
      actionDisplay: (el) => el.estado,
      icon: <BookDisabled />
    },
    {
      actionName: 'Editar',
      actionFunction: (item: any) => {
        setEditingFormElementoCatalogo(true)
        setVisibleFormElementoCatalogo(true)
        setDataElementosCatalogos(item)
      },
      actionDisplay: () => true
    }
  ]

  const RequiredField = (props) => (
    <FormFeedback>Este campo es requerido {props.extraMsg}</FormFeedback>
  )
  const [
    isOpenModalWarningDesactivacionTipoCatalogo,
    setOpenModalWarningDesactivacionTipoCatalogo
  ] = useState(false)
  const ModalMensajeDesactivacion = () => {
    return (
      <ConfirmModal
        openDialog={isOpenModalWarningDesactivacionTipoCatalogo}
        onClose={() => setOpenModalWarningDesactivacionTipoCatalogo(false)}
        onConfirm={() => setOpenModalWarningDesactivacionTipoCatalogo(false)}
        colorBtn='primary'
        btnCancel={false}
        txtBtn='Aceptar'
        msg='No puede desactivar un Tipo de Catalogo cuyos elementos catalogo estan asociados'
        title='Gestor de Catálogos'
      />
    )
  }

  const options = [
    { value: 1, label: 'Activo' },
    { value: 0, label: 'Inactivo' }
  ]

  return (
    <Container style={{ margin: '0px' }}>
      {ModalMensajeDesactivacion()}
      <Title>
        Catálogos {currentCatalogo.id ? ' > ' + currentCatalogo.nombre : null}
      </Title>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      {!currentCatalogo.id
        ? (
          <Row style={{ width: '100%' }}>
            <Colxx xs='12' md={12}>
              <h2 />
              <InputGroup size='lg'>
                <InputGroupAddon addonType='prepend' className='prepend-search'>
                  <InputGroupText className='icon-buscador-expediente-before'>
                    <SearchIcon />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  className='input-main-search'
                  placeholder='Escriba aquí las palabras claves que desea buscar...'
                  onChange={(e) => {
                    setFilteredData(
                      search(e.target.value).in(state.catalogos.catalogos, [
                        'nombre'
                      ])
                    )
                    setFilterText(e.target.value)
                  }}
                />
                {loading && <span className='loadingInput' />}
                <InputGroupAddon addonType='append'>
                  <Button
                    color='primary'
                    className='buscador-table-btn-search'
                    onClick={onSearch}
                  >
                    Buscar
                  </Button>
                </InputGroupAddon>
                <StyledButtonCol xs={6}>
                  <Button
                    style={{ display: 'flex' }}
                    color='primary'
                    onClick={() => {
                      setData({})
                      setOpenCreateModal(true)
                      setEditingTipoCatalogo(false)
                    }}
                  >
                    <CatalogoIconBox style={{ width: '20px', margin: '2px' }}>
                      <AddIcon fontSize='small' style={{ color: 'white' }} />
                    </CatalogoIconBox>
                    <Label style={{ width: '100px', margin: '2px' }}>
                      Agregar catálogo
                    </Label>
                  </Button>
                </StyledButtonCol>
              </InputGroup>
              <br />
              <br />
            </Colxx>
          </Row>
          )
        : null}
      {currentCatalogo.id
        ? (
          <>
            <Back
              onClick={() => {
                setCurrentCatalogo({})
              }}
            >
              <BackIcon />
              <BackTitle>Regresar</BackTitle>
            </Back>
          </>
          )
        : null}
      {!currentCatalogo.id ? (
        <Row style={{ width: '100%' }}>
          {filteredData.map((catalogo) => {
            return (
              <Col xs={12} sm={6} md={6} lg={3}>
                <CatologoCard style={{ justifyContent: 'space-between' }}>
                  <CatalogoIconBox style={{ width: '60px' }}>
                    <BallotIcon fontSize='large' color='primary' />
                  </CatalogoIconBox>
                  <CatalogoInfo
                    style={{
                      width: '70%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignContent: 'center'
                    }}
                  >
                    {catalogo.nombre.toUpperCase()}
                  </CatalogoInfo>
                  <MenuCatalogo
                    handleUpdateCatalogo={(item) => {
                      // Menu de los botones
                      setData(catalogo)
                      setOpenCreateModal(true)
                      setEditingTipoCatalogo(true)
                    }}
                    handleUpdateEstadoCatalogo={async (item) => {
                      // Menu de los botones
                      openConfirmModalTipoCatalogo(catalogo)
                      // setData(catalogo)
                      // setOpenCreateModal(true)
                    }}
                    handleSelectElementos={(item) => {
                      // Menu de los botones
                      setCurrentCatalogo(catalogo)
                      fetchElementos(catalogo)
                    }}
                    handleDeleteRole={() => {
                      actions.deleteRoles(catalogo.id)
                    }}
                  />
                </CatologoCard>
              </Col>
            )
          })}
        </Row>
      ) : (
        <StyledRow className='bg-white__radius'>
          {profiles.map((perfil) => {
            const section = state.catalogos.secciones.find(
              (seccion) => seccion.id === perfil.seccionId
            )
            let sectionName: string
            if (section.apartado === section.seccion) {
              sectionName = section.apartado
            } else {
              sectionName = section.seccion
            }
            return (
              <Col md={6} xs={12}>
                <FormLabel component='legend' color='primary'>
                  {sectionName}
                </FormLabel>
                <ProfileFormGroup
                  data={data}
                  updateRole={actions.updateRole}
                  currentCatalogo={currentCatalogo}
                  sectionName={sectionName}
                  perfil={perfil}
                  handleChange={handleChange}
                />
              </Col>
            )
          })}

          {currentCatalogo !== null ? (
            <ContentTable style={{ width: '100%' }}>
              <HTMLTable
                key={props.key}
                columns={columns}
                showHeaders
                data={state.elementos.entityList || []}
                actions={[]}
                actionRow={actionRow}
                match={props.match}
                tableName='label.catalogs'
                toggleEditModal={(el: any) => {
                  if (currentCatalogo === null) {
                    setCurrentCatalogo(el)
                    setVisibleForm(!visibleForm)
                  }
                }}
                modalOpen={false}
                // totalRegistro={state.elementos.totalCount}
                editModalOpen
                modalfooter
                loading={loading}
                roundedStyle
                // filterdSearch
                orderOptions={columns}
                readOnly
                hideMultipleOptions
                preferences
                esBuscador
                newResource
                resourceTitle='Agregar elemento'
                toggleModal={async () => await openModalElementoCatalogo()}
              />
            </ContentTable>
          ) : (
            <ButtonsContainer xs={12}>
              <Button
                color='primary'
                outline
                onClick={() => {
                  setCurrentCatalogo({})
                  actions.getElementosEstructura(
                    -1,
                    -1,
                    pagination.cantidad,
                    '',
                    ''
                  )
                  setData({})
                  // setCurrentSection({})
                  // setProfiles([])
                }}
              >
                Regresar
              </Button>
            </ButtonsContainer>
          )}
        </StyledRow>
      )}
      <Modal toggle={closeModal} isOpen={openCreateModal}>
        <ModalHeader toggle={closeModal}>
          {isEditingTipoCatalogo ? 'Editar ' : 'Crear '}catálogo
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(openConfimModalCatalogo)}>
            <FormGroup>
              <Input
                hidden
                name='id'
                value={data.id}
                type='text'
                style={{ marginBottom: '1rem' }}
                onChange={onChange}
                innerRef={register}
              />
            </FormGroup>
            <FormGroup>
              <Label>Nombre del catálogo</Label>
              <Input
                name='nombre'
                value={data.nombre}
                type='text'
                style={{ marginBottom: '1rem' }}
                onChange={(e) =>
                  onChange({
                    ...e,
                    target: {
                      ...e.target,
                      value: e.target.value.toUpperCase(),
                      name: e.target.name
                    }
                  })}
                innerRef={register({
                  required: true
                })}
                invalid={Boolean(errors.nombre)}
              />
              {errors.nombre && (
                <ErrorFeedback>Campo requerido</ErrorFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Estado</Label>
              <Input
                type='select'
                value={data.estado}
                name='estado'
                innerRef={register({
                  required: true
                })}
                invalid={Boolean(errors.estado)}
                onChange={onChange}
              >
                <option value>Activo</option>
                <option value={false}>Inactivo</option>
              </Input>
              {errors.estado && (
                <ErrorFeedback>Campo requerido</ErrorFeedback>
              )}
              <br />
            </FormGroup>
            <FormGroup>
              <Label>Código del catálogo</Label>
              <Input
                name='codigo'
                value={data.codigo}
                type='text'
                style={{ marginBottom: '1rem' }}
                innerRef={register({
                  required: true
                })}
                invalid={Boolean(errors.codigo)}
                onChange={onChange}
              />
              {errors.codigo && (
                <ErrorFeedback>Campo requerido</ErrorFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Estructura catálogo</Label>
              <Select
                className='react-select'
                classNamePrefix='react-select'
                placeholder='Seleccione la estructura de catálogo'
                invalid={Boolean(errors.estructuraCatalogoId)}
                value={{
                  id: data.estructuraCatalogoId
                    ? state.estructura.find(
                      (item) => item.id == data.estructuraCatalogoId
                    )?.id
                    : null
                }}
                options={state.estructura.map((estructura) => ({
                  ...estructura,
                  label: estructura.id,
                  value: estructura.id
                }))}
                noOptionsMessage={() => 'Sin opciones '}
                getOptionLabel={(option: any) => option.id}
                getOptionValue={(option: any) => option.id}
                components={{ Input: CustomSelectInput }}
                onChange={(e) =>
                  setData({ ...data, estructuraCatalogoId: e.id })}
              />
              {errors.estructuraCatalogoId && (
                <ErrorFeedback>Campo requerido</ErrorFeedback>
              )}
              <br />
            </FormGroup>
            <ButtonBox>
              <Button color='primary' outline onClick={() => closeModal()}>
                Cancelar
              </Button>
              <Button color='primary' type='submit'>
                Guardar
              </Button>
            </ButtonBox>
          </Form>
        </ModalBody>
      </Modal>

      <SimpleModal
        openDialog={visibleFormElementoCatalogo}
        onClose={closeModalElementoCatalogo}
        onConfirm={handleSubmit(sendDataElementoCatalogo)}
        txtBtn={editingForElementoCatalogo ? 'Actualizar' : 'Agregar'}
        title={`${editingForElementoCatalogo ? 'Editar' : 'Agregar'} elemento`}
      >
        <FormElementosCatalogos
          editing={editing}
          errors={errors}
          register={register}
          watch={watch}
          setValue={setValue}
          control={control}
          dataElementosCatalogos={dataElementosCatalogos}
          dataTipoCatalogo={state.catalogos.catalogos}
          currentCatalogo={currentCatalogo}
        />
      </SimpleModal>

      <ConfirmModal
        openDialog={confirmModal}
        onClose={closeConfimModal}
        onConfirm={changeState}
        colorBtn='primary'
        txtBtn={state.elementoActivo?.estado ? 'Inactivar' : 'Activar'}
        msg={`¿Está seguro que desea ${
          state.elementoActivo?.estado ? 'inactivar' : 'activar'
        }  el elemento: ${state.elementoActivo?.nombre} ?`}
        title={`${
          state.elementoActivo?.estado ? 'Inactivar' : 'Activar'
        } catálogo`}
      />

      <ConfirmModal
        openDialog={confirmModalTipoCatalogo}
        onClose={closeConfirmModalTipoCatalogo}
        onConfirm={changeStateTipoCatalogo}
        colorBtn='primary'
        txtBtn={state.catalogoActivo?.estado ? 'Inactivar' : 'Activar'}
        msg={`¿Está seguro que desea ${
          state.catalogoActivo?.estado ? 'inactivar' : 'activar'
        }  el tipo catalogo: ${state.catalogoActivo?.nombre} ?`}
        title={`${
          state.catalogoActivo?.estado ? 'Inactivar' : 'Activar'
        } catálogo`}
      />

      <ConfirmModal
        openDialog={confirmModalElementoCatalogo}
        onClose={closeConfimModalElementoCatalogo}
        onConfirm={() => {
          handleSubmit(sendDataElementoCatalogo)
          fetchElementos(currentCatalogo)
          closeConfimModalElementoCatalogo()
        }}
        colorBtn='primary'
        msg={`¿Está seguro que desea ${
          editingForElementoCatalogo ? 'modificar' : 'crear'
        }  el elemento?`}
        txtBtn={editingForElementoCatalogo ? 'Sí, modificar' : 'Guardar'}
        title={`${editingForElementoCatalogo ? 'Modificar' : 'Crear'} elemento`}
      />

      <ConfirmModal
        openDialog={confirmModalCatalogo}
        onClose={closeConfimModalCatalogo}
        onConfirm={sendData}
        colorBtn='primary'
        msg={`¿Está seguro que desea ${
          data.id ? 'modificar' : 'crear'
        }  el catalogo?`}
        txtBtn={data.id ? 'Sí, modificar' : 'Guardar'}
        title={`${data.id ? 'Modificar' : 'Crear'} catálogo`}
      />
    </Container>
  )
}

const StyledButtonCol = styled(Col)`
  justify-content: flex-end;
  align-items: flex-end;
  display: flex;
`

const StyledRow = styled(Row)`
  margin: 0rem;
`

const CatologoCard = styled.div`
  border-radius: 30px;
  border-style: solid;
  border-width: 1px;
  border-color: ${colors.primary};
  background-color: white;
  width: 100%;
  margin: 0.5rem;
  display: flex;
  overflow: hidden;
  height: 4rem;
  align-items: center;
`

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const CatalogoInfo = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: left;
  font-weight: bold;
`

const ButtonsContainer = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const CatalogoIconBox = styled.div`
  left: 0;
  top: 0;
  justify-content: flex-end;
  width: 25%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1600px) {
    margin-right: 1rem;
  }
`

const TitleBread = styled.h2`
  color: #000;
  margin-bottom: 15px;
`

const ContentTable = styled.div`
  margin-bottom: 20px;
`

const Title = styled.strong`
  color: #000;
  font-size: 17px;
  margin: 15px 0px 20px;
  display: block;
`

const SectionTable = styled.div`
  margin-top: 15px;
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

const ErrorFeedback = styled.span`
  position: absolute;
  color: #bd0505;
  left: 0;
  font-weight: bold;
  font-size: 10px;
  bottom: -19px;
`

export default CatalogoList
