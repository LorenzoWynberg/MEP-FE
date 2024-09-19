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
} from 'reactstrap'
import styled from 'styled-components'
import { Colxx } from '../../../../../components/common/CustomBootstrap'
// import RolesMenu from "../../../admin/_partials/Roles/Menu";
import MenuPlantillas from '../_partials/MenuPlantillas/Menu'
import Froala from '../../../../../components/Froala'
import MailIcon from '@material-ui/icons/Mail'
import colors from '../../../../../assets/js/colors'
import { useForm } from 'react-hook-form'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../../hooks/useActions'
import {
  getPlantillas,
  savePlantillas,
  updatePlantillas
} from '../../../../../redux/plantillas/actions'
import { ProfileFormGroup } from '../../../admin/_partials/Roles/ProfileFormGroup'
import { cloneDeep } from 'lodash'
import SearchIcon from '@material-ui/icons/Search'
import { Paginationtype } from '../../../../../types/pagination'
import { envVariables } from '../../../../../constants/enviroment'
import AddIcon from '@material-ui/icons/Add'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import search from 'Utils/search'

const PlantillasList: React.FunctionComponent = (props) => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openCreateForm, setOpenCreateForm] = useState(false)
  const [visibleForm, setVisibleForm] = React.useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [textAccion, setTextAccion] = useState('')
  const [textFroala, setTextFroala] = useState('')
  const [currentPlantilla, setCurrentPlantilla] = useState({})
  const [profiles, setProfiles] = useState([])
  const { handleSubmit, register, reset, errors } = useForm()
  const [filterText, setFilterText] = useState('')
  const [pagination, setPagination] = React.useState<Paginationtype>({
    pagina: 1,
    cantidad: 10
  })
  const [filteredData, setFilteredData] = useState([])
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [form, setForm] = useState({ questionContainers: [], questions: {} })

  type IState = {
    plantillas: any
  }

  const state = useSelector((store: IState) => {
    return {
      plantillas: store.plantillas
    }
  })
  const [disable, setDisable] = React.useState<boolean>(false)

  const actions = useActions({
    getPlantillas,
    savePlantillas,
    updatePlantillas
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setFilteredData(state.plantillas.plantillas)
  }, [state.plantillas.plantillas])

  const loadData = async () => {
    await actions.getPlantillas()
  }

  const onSend = async (data) => {
    let response = null
    data.contenido = textFroala
    if (data.id) {
      response = await actions.updatePlantillas(data) // menu contextual al guardar en el form (agregar)
    } else {
      response = await actions.savePlantillas(data) // menu contextual al guardar en el form (actualizar)
    }

    if (!response.error) {
      setData({})
      setTextFroala('')
      loadData()
      closeForm()
    }
  }

  const closeModal = () => {
    reset()
    setOpenCreateModal(false)
  }

  const closeForm = () => {
    reset()
    setOpenCreateForm(false)
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
      search(filterText).in(state.plantillas.plantillas, ['nombre'])
    )
    setLoading(false)
  }

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
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
          <Title>Plantillas de correo</Title>
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
                  value={filterText}
                  onChange={(e) => {
                    setFilteredData(
                      search(e.target.value).in(state.plantillas.plantillas, [
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
                      setTextAccion('Crear')
                      setTextFroala('')
                      setData({})
                    }}
                  >
                    <CatalogoIconBox style={{ width: '20px', margin: '2px' }}>
                      <AddIcon fontSize='small' style={{ color: 'white' }} />
                    </CatalogoIconBox>
                    <Label style={{ width: '140px', margin: '2px' }}>
                      Crear plantilla de correo
                    </Label>
                  </Button>
                </StyledButtonCol>
              </InputGroup>
              )
            : null}
          {openCreateForm ? <h6>{textAccion} plantilla de correo</h6> : null}
          <br />
          <br />
        </Colxx>
      </Row>
      {!openCreateForm ? (
        <Row>
          {filteredData.map((plantilla) => {
            return (
              <Col xs={12} sm={6} md={6} lg={3}>
                <CatalogoCard style={{ justifyContent: 'space-between' }}>
                  <CatalogoIconBox style={{ width: '60px' }}>
                    <MailIcon fontSize='large' color='primary' />
                  </CatalogoIconBox>
                  <CatalogoInfo
                    style={{
                      width: '70%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignContent: 'center'
                    }}
                  >
                    {plantilla.nombre.toUpperCase()}
                    <MenuPlantillas
                      handleSelectPlantillas={(item) => {
                        // Menu de los botones
                        setData(plantilla)
                        setTextAccion('Editar')
                        setTextFroala(plantilla.contenido)
                        setOpenCreateForm(true)
                      }}
                      handleDeleteRole={() => {
                        actions.deleteRoles(plantilla.id)
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

          {openCreateForm
            ? (
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
                        value={data.codigo}
                        name='codigo'
                        onChange={onChange}
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
                        value={data.nombre}
                        name='nombre'
                        onChange={onChange}
                        innerRef={register({ required: true })}
                        invalid={Boolean(errors.nombre)}
                      />
                      {errors.nombre && (
                        <ErrorFeedback>Campo requerido</ErrorFeedback>
                      )}
                    </FormGroup>
                    <br />
                    <Label>Contenido *</Label>
                    <Froala
                      uploadUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                      resourcesUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                      deleteResourceUrl={`${envVariables.BACKEND_URL}/api/GestorFormulario/${form.id}/Recurso`}
                      value={textFroala}
                      name='contenido'
                      zIndex={100}
                      onChange={(e) => setTextFroala(e)}
                      innerRef={register({ required: true })}
                      invalid={Boolean(errors.contenido)}
                    />
                    {errors.contenido && (
                      <ErrorFeedback>Campo requerido</ErrorFeedback>
                    )}
                    <FormGroup>
                      <Label>Estado</Label>
                      <Input
                        type='select'
                        value={data.estado}
                        name='estado'
                        onChange={onChange}
                        innerRef={register({ required: true })}
                        invalid={Boolean(errors.estado)}
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
              )
            : null}
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

const ErrorFeedback = styled.span`
  position: absolute;
  color: #bd0505;
  left: 0;
  font-weight: bold;
  font-size: 10px;
  bottom: -19px;
`

export default PlantillasList
