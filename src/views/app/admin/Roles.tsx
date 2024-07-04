import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Label, ModalBody, Input, Form, ModalHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import styled from 'styled-components'
import RolesMenu from './_partials/Roles/Menu.tsx'
import AssignmentIcon from '@material-ui/icons/Assignment'
import colors from '../../../assets/js/colors'
import { useForm } from 'react-hook-form'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { getSections, getRoleProfiles, saveRoles, getRoles, deleteRoles, updateRole } from '../../../redux/roles/actions'
import { ProfileFormGroup } from './_partials/Roles/ProfileFormGroup.tsx'
import { cloneDeep } from 'lodash'

const RoleList: React.FunctionComponent = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [currentRole, setCurrentRole] = useState({})
  const [currentSection, setCurrentSection] = useState({})
  const [profiles, setProfiles] = useState([])
  const { handleSubmit, register, reset } = useForm()
  const state = useSelector((store) => {
    return {
      roles: store.roles
    }
  })

  const actions = useActions({
    getRoleProfiles,
    getSections,
    saveRoles,
    deleteRoles,
    getRoles,
    updateRole
  })

  useEffect(() => {
    const loadData = async () => {
      await actions.getRoles()
      await actions.getSections()
    }
    loadData()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      const response = await actions.getRoleProfiles(currentRole.id)
    }
    if (currentRole.id) {
      loadData()
    }
  }, [currentRole])

  useEffect(() => {
    if (currentSection.id) {
      const sectionsIds = state.roles.secciones.filter(item => item.modulo === currentSection.modulo).map(item => item.id)
      const foo = state.roles.perfiles.filter((item) => sectionsIds.includes(item.seccionId))
      setProfiles(foo)
      const _data = {}
      state.roles.perfiles.forEach(perfil => {
        const section = state.roles.secciones.find(seccion => seccion.id === perfil.seccionId)
        let name: string
        if (section.apartado == section.seccion) {
          name = section.apartado
        } else {
          name = section.seccion
        }
        _data[name] = perfil
      })
      setData(_data)
    }
  }, [currentSection])

  const removeDuplicates = (sections) => {
    const unique = {}
    const uniquesArray = []
    sections.forEach((item) => {
      if (!unique[item.modulo]) {
        unique[item.modulo] = true
        uniquesArray.push(item)
      }
    })
    return (uniquesArray)
  }

  const onSubmit = (data) => {
    const response = actions.saveRoles(data)
    !response.error && closeModal()
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

  return (
    <Container>
      <StyledRow>
        <Col xs={6}>
          <h4>
            Roles
          </h4>
        </Col>
        {!currentRole.id &&
          <StyledButtonCol xs={6}>
            <Button
              color='primary' onClick={() => {
                setOpenCreateModal(true)
              }}
            >
              Agregar
            </Button>
          </StyledButtonCol>}
        {currentRole.id && <Col xs={12}>
          <UncontrolledDropdown className='ml-2'>
            <DropdownToggle
              caret
              color='light'
              size='sm'
              className='language-button'
              style={{
                minWidth: '170px',
                whiteSpace: 'unset'
              }}
            >
              <span className='name'>{currentSection.modulo}</span>
            </DropdownToggle>
            <DropdownMenu className='mt-3' right>
              {removeDuplicates(state.roles.secciones).map(seccion => {
                return (
                  <DropdownItem
                    onClick={() => {
                        setCurrentSection(seccion)
                      }}
                    key={seccion.id}
                  >
                    {seccion.modulo}
                  </DropdownItem>
                )
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Col>}
      </StyledRow>
      {!currentRole.id

        ? <StyledRow>
          {state.roles.roles.map(role => {
            return (
              <Col xs={12} sm={6} md={6} lg={3}>
                <RoleCard>
                  <RoleIconBox><AssignmentIcon fontSize='large' style={{ color: 'white' }} /></RoleIconBox>
                  <RolesInfo>
                    {role.nombre}
                    <RolesMenu
                        handleSelectRole={(item) => {
                            setCurrentRole(role)
                          }}
                        handleDeleteRole={() => {
                            actions.deleteRoles(role.id)
                          }}
                      />
                  </RolesInfo>
                </RoleCard>
              </Col>
            )
          })}
        </StyledRow>
        : <StyledRow className='bg-white__radius'>
          {profiles.map(perfil => {
            const section = state.roles.secciones.find(seccion => seccion.id === perfil.seccionId)

            let sectionName:string
            if (section.apartado === section.seccion) {
              sectionName = section.apartado
            } else {
              sectionName = section.seccion
            }

            return (
              <Col md={6} xs={12}>
                <FormLabel component='legend' color='primary'>{sectionName}</FormLabel>
                <ProfileFormGroup data={data} updateRole={actions.updateRole} currentRole={currentRole} sectionName={sectionName} perfil={perfil} handleChange={handleChange} />
              </Col>
            )
          })}
          <ButtonsContainer xs={12}>
            <Button
              color='primary'
              outline
              onClick={() => {
                setCurrentRole({})
                setCurrentSection({})
                setData({})
                setProfiles([])
              }}
            >
              Regresar
            </Button>
          </ButtonsContainer>
        </StyledRow>}
      <Modal toggle={closeModal} isOpen={openCreateModal}>
        <ModalHeader toggle={closeModal}>Crear rol</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label>
                Nombre del rol
              </Label>
              <Input name='nombre' type='text' style={{ marginBottom: '1rem' }} innerRef={register} />
            </FormGroup>
            <ButtonBox>
              <Button color='primary' outline onClick={() => closeModal()}>
                Cancelar
              </Button>
              <Button color='primary' onClick={handleSubmit(onSubmit)}>
                Guardar
              </Button>
            </ButtonBox>
          </Form>
        </ModalBody>
      </Modal>
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

const RoleCard = styled.div`
    border-radius: 15px;
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

const RolesInfo = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-weight: bold;
`

const ButtonsContainer = styled(Col)`
    display:flex;
    align-items: center;
    justify-content: center;
`

const RoleIconBox = styled.div`
    left: 0;
    top: 0;
    background-color: ${colors.primary};
    justify-content: flex-end;
    width: 25%;
    height: 100%;
    margin-right: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 1600px) {
        margin-right: 1rem;    
    }
`

export default RoleList
