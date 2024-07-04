import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Label,
  ModalFooter,
  Input,
  FormGroup
} from 'reactstrap'
import { showProgress, hideProgress } from 'Utils/progress'
import Mustache from 'mustache'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../../hooks/useActions'
import useNotification from '../../../../../hooks/useNotification'

import { graphApiTeam, getTemplatesModulo } from 'Redux/office365/actions'

const ModalGrupoTeams = (props) => {
  const { isOpen, onClose } = props

  const [snackBar, handleClick] = useNotification()
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [propietarios, setPropietarios] = useState([])
  const [propietariosSelected, setPropietariosSelected] = useState([])
  const [templates, setTemplates] = useState([])
  const [teamNombre, setTeamNombre] = useState('')
  const [tenantDomain, setTenantDomain] = useState('')
  const [miembros, setMiembros] = useState([])
  const [loading, setLoading] = useState(false)
  const [textoModal, setTextoModal] = useState('')
  const [miembrosGuardados, setMiembrosGuardados] = useState([])
  const [propietariosGuardados, setPropietariosGuardados] = useState([])

  const actions = useActions({
    graphApiTeam,
    getTemplatesModulo
  })

  const state = useSelector((store) => {
    return {
      currentInstitution: store.authUser.currentInstitution
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      const respTemplates = await actions.getTemplatesModulo(2)
      if (!respTemplates.error) {
        setTemplates(respTemplates.data)
        const _codigoTemplate =
          props.activeGroup.teamId === null
            ? 'O365-TEXTO-MODAL-CREAR-GRUPO'
            : 'O365-TEXTO-MODAL-VER-GRUPO'
        const _plantilla = respTemplates.data.find(
          (x) => x.codigo === _codigoTemplate
        )
        if (_plantilla !== undefined) {
          const rendered = Mustache.render(_plantilla.plantilla_HTML, {})

          setTextoModal(rendered)
        }
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (props.activeGroup.teamId !== null) {
      const fetchData = async () => {
        showProgress()
        setLoading(true)

        // Propietarios/Funcionarios
        const _dataP = {
          institucionId: state.currentInstitution.id,
          accion: 'GetOwnersList'
        }
        const responseP = await actions.graphApiTeam(_dataP)
        if (!responseP.error) {
          const _dataPropietarios = responseP.data.map((item) => {
            return {
              label: item.nombre,
              value: item.email,
              idCuenta: item.idCuenta
            }
          })

          setPropietarios(_dataPropietarios)
        }

        // Información del Team y miembros
        const _data = {
          teamId: props.activeGroup.teamId,
          accion: 'GetTeam'
        }

        const response = await actions.graphApiTeam(_data)

        // Se cargan los miembros del grupo del sistema como prioridad
        await cargarMiembros()

        if (!response.error) {
          if (!response.data.error) {
            const _team = JSON.parse(response.data.response.team)
            setTeamNombre(_team.displayName)

            const _members = JSON.parse(response.data.response.members)

            const _owners = _members.value.filter((x) =>
              x.roles.find((x) => (x === 'owner') !== undefined)
            )

            const _propietariosSelected = _owners.map((item) => {
              return {
                label: item.displayName,
                value: item.email,
                idCuenta: item.userId
              }
            })

            setPropietariosGuardados(_propietariosSelected)

            setPropietariosSelected(_propietariosSelected)

            const _notOwners = _members.value.filter((x) => x.roles.length === 0)

            const _membersTeam = _notOwners.map((item) => {
              const _finded = props.data.find(
                (x) => x.idCuentaOffice365 === item.userId
              )
              return {
                identificacion:
                  _finded !== undefined ? _finded.identificacion : '',
                nombreCompleto: item.displayName,
                cuentaCorreo: item.email,
                idCuenta: item.userId
              }
            })

            setMiembrosGuardados(_membersTeam)
          } else {
            toggleSnackbar(
              'error',
              'Ha ocurrido un error al obtener la información del grupo de TEAMS.'
            )
          }
        }

        hideProgress()
        setLoading(false)
      }

      fetchData()
    }
  }, [props.activeGroup])

  useEffect(() => {
    if (props.activeGroup && props.activeGroup.teamId == null) {
      const _nombreTeam =
        'DO-' + state.currentInstitution.codigo + '-' + props.activeGroup.grupo
      setTeamNombre(_nombreTeam)
    }
  }, [props.activeGroup])

  useEffect(() => {
    if (state.currentInstitution.id && props.activeGroup.teamId == null) {
      const _data = {
        institucionId: state.currentInstitution.id,
        accion: 'GetOwnersList'
      }
      const fetchData = async () => {
        showProgress()
        setLoading(true)
        const response = await actions.graphApiTeam(_data)
        if (!response.error) {
          const _dataPropietarios = response.data.map((item) => {
            return {
              label: item.nombre,
              value: item.email,
              idCuenta: item.idCuenta
            }
          })

          setPropietarios(_dataPropietarios)
        }

        await cargarMiembros()

        hideProgress()
        setLoading(false)
      }

      fetchData()
    }
  }, [props.data])

  const cargarMiembros = async () => {
    const response2 = await actions.graphApiTeam({
      accion: 'GetTenantDomain'
    })

    if (!response2.error) {
      setTenantDomain(response2.data)

      const _miembros = props.data
        .filter(
          (x) =>
            x.cuentaCorreoOffice &&
             x.idCuentaOffice365 !== null &&
             x.idCuentaOffice365 !== ''
        )
        .map((item) => {
          return {
            ...item,
            cuentaCorreo: item.identificacion + response2.data,
            idCuenta: item.idCuentaOffice365
          }
        })

      setMiembros(_miembros)
    }
  }

  const onChangeMultiSelect = (selectedItems) => {
    setPropietariosSelected(selectedItems)
  }

  const toggleSnackbar = (variant, msg) => {
    setSnacbarContent({
      variant,
      msg
    })
    handleClick()
  }

  const handleCrear = async () => {
    if (propietariosSelected.length <= 0) {
      toggleSnackbar(
        'warning',
        'Debe seleccionar al menos un propietario para el grupo de TEAMS'
      )
      return
    }
    if (miembros.length <= 0) {
      toggleSnackbar(
        'warning',
        'No hay miembros disponibles para crear el grupo de TEAMS'
      )
      return
    }

    const _miembros = miembros.map((m) => {
      return {
        Id: m.idCuentaOffice365,
        roles: []
      }
    })

    const _propietarios = propietariosSelected.map((m) => {
      return {
        Id: m.idCuenta,
        roles: ['owner']
      }
    })

    const _teamMembers = [..._propietarios, ..._miembros]

    const _first = _propietarios[0]

    // Propietario del TEAM
    const owner = {
      '@odata.type': '#microsoft.graph.aadUserConversationMember',
      roles: ['owner'],
      'user@odata.bind':
        "https://graph.microsoft.com/v1.0/users('" + _first.Id + "')"
    }

    // Se agregarán uno a uno en el backend, api no permite guardar todos a la vez.
    const _miembrosAdicionales = _teamMembers.filter((x) => x.Id !== _first.Id)

    const _body = {
      'template@odata.bind':
        "https://graph.microsoft.com/v1.0/teamsTemplates('standard')",
      displayName: teamNombre,
      description: '',
      members: [owner], // Obligado enviar un propietario
      memberSettings: {
        allowCreateUpdateChannels: false,
        allowDeleteChannels: false,
        allowAddRemoveApps: false,
        allowCreateUpdateRemoveTabs: false,
        allowCreateUpdateRemoveConnectors: false
      }
    }

    const _data = {
      accion: 'CreateTeam',
      grupoId: props.activeGroup.grupoId,
      body: _body,
      miembros: _miembrosAdicionales
    }

    showProgress()
    setLoading(true)
    const response = await actions.graphApiTeam(_data)

    if (!response.error) {
      if (!response.data.error) {
        props.setActiveGroup({
          ...props.activeGroup,
          teamId: response.data.response.teamId
        })

        props.handleCrear()
        props.getGroupsReload()
        onClose()
      } else {
        toggleSnackbar(
          'error',
          'Ha ocurrido un error al crear el grupo de TEAMS.'
        )
      }
    } else {
      toggleSnackbar('error', response.data)
    }

    hideProgress()
    setLoading(false)
  }

  const handleActualizar = () => {
    const _selectedOwners = propietariosSelected
    const _savedOwners = propietariosGuardados
    const _savedMembers = miembrosGuardados
    const _selectedMembers = miembros

    const _OwnersSend = []
    const _MembersSend = []

    _selectedOwners.map((item) => {
      const _saved = _savedOwners.find((x) => x.idCuenta === item.idCuenta)
      if (_saved === undefined) {
        _OwnersSend.push({
          Id: item.idCuenta,
          Nombre: item.label,
          Roles: ['owner'],
          Email: item.value,
          Accion: 'Agregar'
        })
      }
    })

    _selectedMembers.map((item) => {
      const _saved = _savedMembers.find((x) => x.idCuenta === item.idCuenta)
      if (_saved === undefined) {
        _MembersSend.push({
          Id: item.idCuenta,
          Nombre: item.nombreCompleto,
          Roles: [],
          Email: item.cuentaCorreo,
          Accion: 'Agregar'
        })
      }
    })

    _savedOwners.map((item) => {
      const _selected = _selectedOwners.find((x) => x.idCuenta === item.idCuenta)
      if (_selected === undefined) {
        _OwnersSend.push({
          Id: item.idCuenta,
          Nombre: item.label,
          Email: item.value,
          Roles: ['owner'],
          Accion: 'Remover'
        })
      }
    })

    _savedMembers.map((item) => {
      const _selected = _selectedMembers.find((x) => x.idCuenta === item.idCuenta)
      if (_selected === undefined) {
        _MembersSend.push({
          Id: item.idCuenta,
          Nombre: item.nombreCompleto,
          Email: item.cuentaCorreo,
          Roles: [],
          Accion: 'Remover'
        })
      }
    })

    const _newMembersOwners = [..._OwnersSend, ..._MembersSend]

    if (_newMembersOwners.length > 0) {
      props.handleActualizar(props.activeGroup.teamId, _newMembersOwners)
    } else {
      toggleSnackbar(
        'warning',
        'No hay cambios en los miembros y propietarios del grupo.'
      )
    }
  }

  return (
    <>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}
      <Modal isOpen={isOpen} size='lg'>
        <ModalHeader toggle={onClose}>
          <b>
            {props.activeGroup.teamId == null
              ? 'Crear grupo de TEAMS'
              : 'Ver grupo de TEAMS'}
          </b>
        </ModalHeader>
        <ModalBody>
          <div className='row'>
            <div className='col-md-12'>
              <p>{textoModal}</p>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <FormGroup>
                <Label>Nombre del grupo</Label>
                <Input type='text' disabled value={teamNombre} />
              </FormGroup>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <FormGroup>
                <Label>Propietarios</Label>
                <Select
                  isMulti
                  options={propietarios}
                  value={propietariosSelected}
                  onChange={(data) => onChangeMultiSelect(data)}
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  classNamePrefix='react-select'
                  placeholder=''
                  style={{ width: '100%' }}
                  closeMenuOnSelect={false}
                />
              </FormGroup>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12'>
              <p>
                Miembros del grupo (<b>{miembros.length}</b>)
              </p>
            </div>
          </div>

          <div>
            <div>
              <div className='table-responsive' style={{ borderRadius: 4 }}>
                <table className='table table-striped table-bordered'>
                  <thead style={{ background: '#145388', color: 'white' }}>
                    <tr>
                      <th>Identificación</th>
                      <th>Nombre Completo</th>
                      <th>Cuenta de Correo electrónico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {miembros.map((item) => {
                      return (
                        <tr style={{ fontSize: 12 }}>
                          <td>{item.identificacion}</td>
                          <td>{item.nombreCompleto}</td>
                          <td>{item.cuentaCorreo}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className='container-center w-100 p-3 border-none'>
          {!loading && props.activeGroup.teamId != null && (
            <Button
              className='mr-3 cursor-pointer'
              onClick={() => { onClose(); props.handleEliminar(props.activeGroup.teamId) }}
              color='danger'
            >
              Eliminar
            </Button>
          )}
          <Button
            outline
            className='mr-3 cursor-pointer'
            onClick={onClose}
            color='primary'
          >
            Cancelar
          </Button>

          {loading && <div className='loading loading-form ml-4' />}
          {!loading && (
            <Button
              className='mr-3 cursor-pointer'
              onClick={() => {
                if (props.activeGroup.teamId == null) {
                  handleCrear()
                } else {
                  handleActualizar()
                }
              }}
              color='primary'
            >
              {props.activeGroup.teamId == null ? 'Crear' : 'Actualizar'}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </>
  )
}

export default ModalGrupoTeams
