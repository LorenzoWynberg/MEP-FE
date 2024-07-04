import React, { useState, useEffect } from 'react'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { Helmet } from 'react-helmet'
import Styled from 'styled-components'
import {
  Button, Col, Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import Card from './CardRol'
import Modal from './ModalAddRole'
import { useParams, useHistory } from 'react-router-dom'
import Loader from 'Components/LoaderContainer'
import useNotification from 'Hooks/useNotification'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { progressInCard } from 'Utils/progress'
import colors from 'Assets/js/colors'
import Rol from './Rol'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import {
  getRoles,
  saveRoles,
  deleteRoles,
  editRoles,
  duplicarRoles,
  getTipoRoles,
  getRolesByTipo
} from 'Redux/roles/actions'

const Roles = (props) => {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const [rolSelected, setRolSelected] = useState<any>(null)
  const [tipoRolSelected, setTipoRolSelected] = useState<any>(null)

  const history = useHistory()
  const [snackbar, handleClick] = useNotification()
  const [msg, setMsg] = useState('nbsp')
  const [variant, setVariant] = useState('info')
  const { rolId } = useParams<any>()

  const actions = useActions({
    getRoles,
    saveRoles,
    editRoles,
    deleteRoles,
    duplicarRoles,
    getTipoRoles,
    getRolesByTipo
  })

  const snackBarController = (variant, msg, change = false) => {
    setVariant(variant)
    setMsg(msg)
    handleClick()
  }
  const state = useSelector((store: any) => {
    return {
      roles: store.roles.roles,
      tipoRoles: store.roles.tipoRoles
    }
  })

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      await actions.getRoles()
      await actions.getTipoRoles()
      setLoading(false)
    }
    fetch()
  }, [])

  const onCreateRol = async (data) => {
    progressInCard(true)
    const response = await actions.saveRoles(data)
    progressInCard(false)
    const rolRepeat = state.roles.find((el) => el.nombre === data.Nombre)
    /* 		if(rolRepeat.nombre){
			return snackBarController(
				'error',
				'El nombre del rol ya existe '
			)
		} */
    if (!response.error) {
      await actions.getRoles()
      snackBarController(
        'info',
        'El registro se ha guardado correctamente'
      )
      setOpenModal(false)
      return true
    } else if (rolRepeat.nombre) {
      return snackBarController('error', 'El nombre del rol ya existe ')
    } else {
      snackBarController(
        'error',
        'Ha ocurrido un error al intentar guardar'
      )
      return false
    }
  }
  const onEditRol = async (data) => {
    progressInCard(true)
    const response = await actions.editRoles(data)
    progressInCard(false)

    if (!response.error) {
      await actions.getRoles()
      snackBarController(
        'info',
        'El registro se ha editado correctamente'
      )
      setOpenModal(false)
      return true
    } else {
      snackBarController(
        'error',
        'Ha ocurrido un error al intentar editar'
      )
      return false
    }
  }

  const onFilterByTipoRol = async (tRol) => {
    progressInCard(true)
    setLoading(true)
    let response = null
    if (tRol.id) {
      response = await actions.getRolesByTipo(tRol.id)
    } else {
      response = await actions.getRoles()
    }
    progressInCard(false)
    setLoading(false)

    if (response.error) {
      snackBarController(
        'error',
        'Ha ocurrido un error al intentar filtrar'
      )
    } else {
      setTipoRolSelected(tRol)
    }
  }

  const handleEditPermisos = (rol) => {
    history.push(`/director/usuarios/roles/${rol.id}`)
  }
  const handleEditRol = (rol) => {
    setOpenModal(true)
    setRolSelected(rol)
  }
  const handleDeleteRol = (rol) => {
    setConfirmModal(true)
    setRolSelected(rol)
  }
  const handleDuplicateRol = async (rol) => {
    progressInCard(true)

    const response = await actions.duplicarRoles(rol.id)
    progressInCard(false)
    if (!response.error) {
      await actions.getRoles()
      snackBarController(
        'info',
        'El registro se ha duplicado correctamente'
      )
    } else {
      snackBarController(
        'error',
        'Ha ocurrido un error al intentar duplicar'
      )
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setRolSelected(null)
  }

  const options = [
    {
      name: 'Editar',
      action: (_row) => {
        handleEditRol(_row)
      }
    },
    {
      name: 'Permisos',
      action: (_row) => {
        handleEditPermisos(_row)
      }
    },
    {
      name: 'Duplicar',
      action: (_row) => {
        handleDuplicateRol(_row)
      }
    },
    {
      name: 'Eliminar',
      action: (_row) => {
        handleDeleteRol(_row)
      }
    }
  ]

  const closeConfirmModal = async (): Promise<void> => {
    setConfirmModal(false)
    setRolSelected(null)
  }

  const onConfirmDelete = async (): Promise<void> => {
    progressInCard(true)
    const response = await actions.deleteRoles(rolSelected?.id)
    progressInCard(false)

    closeConfirmModal()
    if (!response.error) {
      await actions.getRoles()
      snackBarController(
        'info',
        'El registro se ha eliminado correctamente'
      )
    } else {
      snackBarController(
        'error',
        'Ha ocurrido un error al intentar eliminar'
      )
    }
  }

  return (
    <AppLayout items={directorItems}>
      <Helmet>
        <title>Gestión de roles</title>
      </Helmet>
      {snackbar(variant, msg)}

      {!rolId
        ? (
          <Container>
            <Header>
              <h3 className=''>Roles</h3>
              <Button
                onClick={() => {
							  setOpenModal(!openModal)
							  setRolSelected(null)
                }}
                color='primary'
              >
                Agregar
              </Button>
            </Header>
            <Filter>
              <UncontrolledDropdown size='md' className='mb-4'>
                <DropdownToggle
                  caret
                  color='light'
                  className='language-button'
                >
                  <span className='name'>
                    {tipoRolSelected?.nombre ||
										'Filtrar por tipo de rol'}
                  </span>
                </DropdownToggle>
                <DropdownMenu
                  className='mt-3'
                  modifiers={{
								  setMaxHeight: {
								    enabled: true,
								    order: 890,
								    fn: (data) => {
								      return {
								        ...data,
								        styles: {
								          ...data.styles,
								          overflow: 'auto',
								          maxHeight: 300,
								          minHeight: 300
								        }
								      }
								    }
								  }
                  }}
                >
                  <DropdownItem
                    onClick={() => {
									  onFilterByTipoRol({ id: null })
                  }}
                  >
            Todos
                  </DropdownItem>
                  {state.tipoRoles.map((tRol, i) => {
								  return (
  <DropdownItem
    onClick={() => {
											  onFilterByTipoRol(tRol)
    }}
    key={i}
  >
    {tRol.nombre}
  </DropdownItem>
								  )
                  })}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Filter>
            <Content>
              {loading && <Loader />}
              <Row>
                {state.roles.map((rol, i) => {
							  return (
  <Col sm={12} md={6} lg={3}>
    <Card
      key={i}
      rol={rol}
      options={options}
      edit={handleEditPermisos}
    />
  </Col>
							  )
                })}
              </Row>
            </Content>
          </Container>
          )
        : (
          <Rol rolId={rolId} />
          )}
      <Modal
        openDialog={openModal}
        setOpenDialog={setOpenModal}
        save={onCreateRol}
        edit={onEditRol}
        rol={rolSelected}
        close={handleCloseModal}
      />
      <ConfirmModal
        openDialog={confirmModal}
        onClose={closeConfirmModal}
        onConfirm={() => onConfirmDelete()}
        colorBtn='primary'
        txtBtn='Eliminar'
        msg={`¿Está seguro que desea eliminar el rol: ${rolSelected?.nombre} ?`}
        title='Eliminar Rol'
      />
    </AppLayout>
  )
}

const Container = Styled.div`
    width: 100%;
    height: 100%;
    margin-bottom: 30px;
`
const Content = Styled.div`
    margin-top: 10px;
    width: 100%;
`
const Filter = Styled.div`
  .dropdown-toggle {
      min-width: 200px!important;
      display: flex!important;
      align-items: center!important;
      border: 1px solid ${colors.gray}!important;
      justify-content: space-between!important;
  }
`

const Header = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
`

export default Roles
