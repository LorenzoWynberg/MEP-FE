import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon
  , FormFeedback
} from 'reactstrap'
import styled from 'styled-components'
import { Colxx } from '../../../../../components/common/CustomBootstrap'
// import RolesMenu from "../../../admin/_partials/Roles/Menu";
import MenuMensajes from '../_partials/MenuMensajes/Menu'
import Comment from '@material-ui/icons/Comment'
import AddIcon from '@material-ui/icons/Add'
import colors from '../../../../../assets/js/colors'
import { useForm } from 'react-hook-form'
import FormGroup from '@material-ui/core/FormGroup'

import FormLabel from '@material-ui/core/FormLabel'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../../hooks/useActions'
import {
  getMensajes,
  saveMensajes,
  updateMensajes
} from '../../../../../redux/mensajes/actions'
import { ProfileFormGroup } from '../../_partials/Roles/ProfileFormGroup'
import { cloneDeep } from 'lodash'
import SearchIcon from '@material-ui/icons/Search'
import { Paginationtype } from '../../../../../types/pagination'
import { envVariables } from '../../../../../constants/enviroment'
import Froala from '../../../../../components/Froala'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import RequiredLabel from '../../../../../components/common/RequeredLabel'
import search from 'Utils/search'

const MensajesList: React.FunctionComponent = (props) => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openCreateForm, setOpenCreateForm] = useState(false)
  const [visibleForm, setVisibleForm] = React.useState<boolean>(false)
  const [elementos, setElementos] = React.useState<Array<any>>([])
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [textAccion, setTextAccion] = useState('')
  const [currentPlantilla, setCurrentPlantilla] = useState({})
  const [currentType, setCurrentType] = useState({})
  const [currentSection, setCurrentSection] = useState({})
  const [profiles, setProfiles] = useState([])
  const { handleSubmit, register, reset, errors } = useForm()
  const [currentAlert, setCurrentAlert] = React.useState<any>(null)
  const [filterText, setFilterText] = useState('')
  const [pagination, setPagination] = React.useState<Paginationtype>({
    pagina: 1,
    cantidad: 10
  })
  const [form, setForm] = useState({ questionContainers: [], questions: {} })
  const [questionChangeInterval, setQuestionChangeInterval] = useState(null)
  const [autoSaveInteractionsInterval, setAutoSaveInteractionsInterval] =
    useState(null)
  const [textFroalaPlantillaTexto, setTextFroalaPlantillaTexto] = useState('')
  const [textFroalaPlantillaHTML, setTextFroalaPlantillaHTML] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [autoSaveLoading, setAutoSaveLoading] = useState(false)
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })

  type IState = {
    mensajes: any
  }

  const state = useSelector((store: IState) => {
    return {
      mensajes: store.mensajes
      // elementos: store.templates.elementos
    }
  })
  const [disable, setDisable] = React.useState<boolean>(false)

  const getNumbersOrder = () => {
    const content = []
    for (let i = 1; i <= 50; i++) {
      content.push(<option value={i}>{i}</option>)
    }
    return content
  }

  const actions = useActions({
    saveMensajes,
    updateMensajes,
    getMensajes
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setFilteredData(state.mensajes.mensajes)
  }, [state.mensajes.mensajes])

  const loadData = async () => {
    await actions.getMensajes()
  }

  const closeForm = () => {
    reset()
    setOpenCreateForm(false)
  }

  const onSend = async (data) => {
    let response = null
    data.plantilla_Texto = textFroalaPlantillaTexto
    data.plantilla_HTML = textFroalaPlantillaHTML
    if (data.id) {
      response = await actions.updateMensajes(data) // menu contextual al guardar en el form (agregar)
    } else {
      data.id = 0
      response = await actions.saveMensajes(data) // menu contextual al guardar en el form (actualizar)
    }
    console.log('data', data)
    if (!response.error) {
      setData({})
      setTextFroalaPlantillaTexto('')
      setTextFroalaPlantillaHTML('')
      loadData()
      closeForm()
    }
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
    setFilteredData(search(filterText).in(state.mensajes.mensajes, ['nombre']))
    setLoading(false)
  }

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const RequiredField = (props) => (
    <FormFeedback>Este campo es requerido {props.extraMsg}</FormFeedback>
  )

  const handleSendForm = async (autoSave = false, autoSaveForm?) => {
    const _form = autoSaveForm || form
    const sendData = {
      id: state.currentForm.id,
      titulo: _form.titulo,
      encabezado: _form.encabezado,
      formulario: JSON.stringify(_form),
      categoriaId: _form.categoria,
      descripcion: _form.descripcion,
      configuracion: JSON.stringify(dataConfiguracion)
    }
    if (autoSave) {
      setAutoSaveLoading(true)
    }
    const response = await actions.updateForm(autoSave, sendData)
    if (response.error) {
      setSnacbarContent({
        variant: 'error',
        msg: 'Hubo un error y el formulario no pudo ser guardado.'
      })
      handleSnackBarClick()
    }
    if (autoSave) {
      setAutoSaveLoading(false)
    }
  }

  return (
    <Container>
      <Row>
        <Colxx xs='12' md={12}>
          {openCreateForm
            ? (
              <>
                <Back
                  onClick={() => {
                    closeForm()
                  }}
                >
                  <BackIcon />
                  <BackTitle>Regresar</BackTitle>
                </Back>
              </>
              )
            : null}
        </Colxx>
      </Row>
      <Row>
        <Colxx xs='12' md={12}>
          <Title>Mensajes</Title>
          {!openCreateForm
            ? (
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
                      search(e.target.value).in(state.mensajes.mensajes, [
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
                      setOpenCreateForm(true)
                      setTextFroalaPlantillaTexto('')
                      setTextFroalaPlantillaHTML('')
                      setTextAccion('Crear')
                      setData({})
                    }}
                  >
                    <CatalogoIconBox style={{ width: '20px', margin: '2px' }}>
                      <AddIcon fontSize='small' style={{ color: 'white' }} />
                    </CatalogoIconBox>
                    <Label style={{ width: '150px', margin: '2px' }}>
                      Crear plantilla de mensaje
                    </Label>
                  </Button>
                </StyledButtonCol>
              </InputGroup>
              )
            : null}
          {openCreateForm ? <h6>{textAccion} Mensaje</h6> : null}
          <br />
        </Colxx>
      </Row>
      {!openCreateForm ? (
        <Row>
          {filteredData.map((mensaje) => {
            return (
              <Col xs={12} sm={6} md={6} lg={3}>
                <CatalogoCard style={{ justifyContent: 'space-between' }}>
                  <CatalogoIconBox style={{ width: '60px' }}>
                    <Comment fontSize='large' color='primary' />
                  </CatalogoIconBox>
                  <CatalogoInfo
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {mensaje.nombre.toUpperCase()}
                    <MenuMensajes
                      handleSelectMensajes={(item) => {
                        // Menu de los botones
                        setTextAccion('Editar')
                        setData(mensaje)
                        setTextFroalaPlantillaTexto(mensaje.plantilla_Texto)
                        setTextFroalaPlantillaHTML(mensaje.plantilla_HTML)
                        setOpenCreateForm(true)
                      }}
                      handleDeleteRole={() => {
                        actions.deleteRoles(mensaje.id)
                      }}
                    />
                  </CatalogoInfo>
                </CatalogoCard>
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
                  currentPlantilla={currentPlantilla}
                  sectionName={sectionName}
                  perfil={perfil}
                  handleChange={handleChange}
                />
              </Col>
            )
          })}
          {openCreateForm !== null ? (
            <div
              style={{
                borderRadius: '5px',
                padding: '10px',
                backgroundColor: 'white',
                border: '1px solid #ECECEC',
                padding: '2rem'
              }}
            >
              <Row>
                <Col xs={12} md={12}>
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
                    <Label>Codigo *</Label>
                    <Input
                      name='codigo'
                      onChange={onChange}
                      value={data.codigo}
                      innerRef={register({ required: true })}
                      invalid={Boolean(errors.codigo)}
                    />
                    {errors.codigo && (
                      <ErrorFeedback>Campo requerido</ErrorFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>Nombre *</Label>
                    <Input
                      name='nombre'
                      type='text'
                      onChange={onChange}
                      value={data.nombre}
                      innerRef={register}
                      innerRef={register({ required: true })}
                      invalid={Boolean(errors.nombre)}
                    />
                    {errors.nombre && (
                      <ErrorFeedback>Campo requerido</ErrorFeedback>
                    )}
                  </FormGroup>
                  <br />
                  <FormGroup>
                    <Label>Asunto *</Label>
                    <Input
                      name='asunto'
                      type='text'
                      onChange={onChange}
                      value={data.asunto}
                      innerRef={register({ required: true })}
                      invalid={Boolean(errors.asunto)}
                    />
                    {errors.asunto && (
                      <ErrorFeedback>Campo requerido</ErrorFeedback>
                    )}
                  </FormGroup>
                  <br />
                  <Label>Plantilla Texto *</Label>
                  <Froala
                    uploadUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${currentPlantilla.id}/Recurso`}
                    resourcesUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${currentPlantilla.id}/Recurso`}
                    deleteResourceUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${currentPlantilla.id}/Recurso`}
                    value={textFroalaPlantillaTexto}
                    zIndex={100}
                    name='plantillaTexto'
                    onChange={(e) => setTextFroalaPlantillaTexto(e)}
                    innerRef={register({ required: true })}
                    invalid={Boolean(errors.plantillaTexto)}
                  />
                  {errors.plantillaTexto && (
                    <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                  <br />
                  <Label>Plantilla Html *</Label>
                  <Froala
                    uploadUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${currentPlantilla.id}/Recurso`}
                    resourcesUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${currentPlantilla.id}/Recurso`}
                    deleteResourceUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${currentPlantilla.id}/Recurso`}
                    value={textFroalaPlantillaHTML}
                    zIndex={100}
                    onChange={(e) => setTextFroalaPlantillaHTML(e)}
                    name='plantillaHTML'
                    innerRef={register({ required: true })}
                    invalid={Boolean(errors.plantillaHTML)}
                  />
                  {errors.plantillaHTML && (
                    <ErrorFeedback>Campo requerido</ErrorFeedback>
                  )}
                  <br />
                  <FormGroup>
                    <Label>Tipo</Label>
                    <Input
                      type='select'
                      value={data.tipo}
                      name='tipo'
                      onChange={onChange}
                      innerRef={register({ required: true })}
                      invalid={Boolean(errors.tipo)}
                    >
                      <option value={1}>Email</option>
                      <option value={2}>Mensaje en Modal</option>
                    </Input>
                    {errors.tipo && (
                      <ErrorFeedback>Campo requerido</ErrorFeedback>
                    )}
                    <br />
                  </FormGroup>
                  <FormGroup>
                    <RequiredLabel for='modulo'>Modulo</RequiredLabel>
                    <Input
                      type='select'
                      // invalid={errors["modulo"]}
                      name='modulo'
                      value={data.modulo}
                      innerRef={register({
                        min: 1,
                        valueAsNumber: true,
                        required: true,
                        validate: {
                          moreThanOne: (value) => parseInt(value, 0) > 0
                        }
                      })}
                      invalid={Boolean(errors.modulo)}
                    >
                      {getNumbersOrder()}
                    </Input>
                    {errors.modulo && (
                      <ErrorFeedback>Campo requerido</ErrorFeedback>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label>Estado</Label>
                    <Input
                      type='select'
                      value={data.estado}
                      name='estado'
                      innerRef={register({ required: true })}
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
                </Col>
              </Row>
            </div>
          ) : null}
          <ButtonsContainer xs={12}>
            <ButtonBox>
              <Button
                className='mr-2'
                color='primary'
                outline
                onClick={() => closeForm()}
              >
                Cancelar
              </Button>
              <Button color='primary' onClick={handleSubmit(onSend)}>
                Guardar
              </Button>
            </ButtonBox>
          </ButtonsContainer>
        </StyledRow>
      )}
    </Container>
  )
}

const StyledButtonCol = styled(Col)`
  justify-content: flex-end;
  align-items: flex-end;
  display: flex;
`

const StyledRow = styled(Row)`
  margin: 1rem;
`

const CatalogoCard = styled.div`
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
  width: 15%;
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

export default MensajesList
