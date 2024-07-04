import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, Button, InputGroupAddon } from 'reactstrap'
import styled from 'styled-components'

import { TableReactImplementation } from 'Components/TableReactImplementation'
import colors from 'Assets/js/colors'
import FormUserComponent from './FormUserComponent'
import useFormComponent from './useFormComponent'
import { EditButton } from 'Components/EditButton.js'
import {
  createUserByRegionalId,
  getUsersByRegionalId,
  updateActivaInactivaUsuarioRegional,
  resetUserPassword,
  deleteUsuarioRegional,
  createUsuario,
  updateUsuarioCatalogo,
  updateUserByRegionalId
} from 'Redux/UsuarioCatalogos/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { CurrentRegional } from 'types/configuracion'
import { IState } from 'Redux/UsuarioCatalogos/reducer'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import LockIcon from '@material-ui/icons/Lock'
import Tooltip from '@mui/material/Tooltip'
import { getRolesByTipo } from 'Redux/roles/actions.js'
import useNotification from 'Hooks/useNotification'
import swal from 'sweetalert'
import { BiBlock } from 'react-icons/bi'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import { useTranslation } from 'react-i18next'

interface ILocaleState {
  configuracion: {
    currentRegional: CurrentRegional
    expedienteRegional: CurrentRegional
  }
  usuarioCatalogos: IState
  roles: {
    roles: Array<{
      id: number
      nombre: string
      nombreArchivo: any
      sB_Recursos_id: number
      sB_TipoRolId: number
      estado: boolean
      urlimg: string
      color: any
    }>
  }
}

const HumanResource = () => {
  const { t } = useTranslation()
  const [editable, setEditable] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [snackbar, handleClick] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({
    variant: null,
    msg: null
  })
  const state = useSelector((store: ILocaleState) => ({
    currentRegional: store.configuracion.currentRegional || store.configuracion.currentRegional,
    usuarios: store.usuarioCatalogos.usuariosByRegional,
    roles: store.roles.roles
  }))

  useEffect(() => {
    actions.getRolesByTipo(12)
  }, [])

  const actions = useActions({
    getUsersByRegionalId,
    createUserByRegionalId,
    getRolesByTipo,
    updateActivaInactivaUsuarioRegional,
    resetUserPassword,
    deleteUsuarioRegional,
    createUsuario,
    updateUsuarioCatalogo,
    updateUserByRegionalId
  })

  const data = useMemo(() => {
    return (
      state?.usuarios?.map((el) => ({
        ...el,
        tipoIdentificacionId: JSON.parse(el?.tipoIdentificacion)[0]?.id,
        roles: JSON.parse(el?.rolesAsignados)
      })) || []
    )
  }, [state.usuarios])

  useEffect(() => {
    if (selectedUser) {
      onChangeInputEmail({ target: { value: selectedUser?.email } })
      const rol = selectedUser.roles.find(
        (el) => el?.RegionalId === state.currentRegional?.id
      )
      onChangeSelectRol({
        label: rol?.rolAsignado,
        value: rol?.sb_rolesId
      })
      onChangeInputNumeroIdentificacion({
        target: { value: selectedUser.identificacion }
      })
    }
  }, [selectedUser])

  const onDeleteUser = async (data) => {
    swal({
      title: 'Eliminar usuario',
      text: '¿Está seguro de eliminar el usuario?',
      icon: 'warning',
      className: 'text-alert-modal',
      buttons: {
        cancel: 'Cancelar',
        ok: {
          text: 'Si, eliminar',
          value: true,
          className: 'btn-primary'
        }
      }
    }).then((res) => {
      if (res) {
        const response = actions.deleteUsuarioRegional(data.id)
        if (!response.error) {
          swal({
            title: 'Usuario eliminado',
            text: 'El usuario ha sido eliminado con éxito',
            icon: 'success',
            className: 'text-alert-modal',
            buttons: {
              ok: {
                text: 'Cerrrar',
                value: true,
                className: 'btn-primary'
              }
            }
          })
        } else {
          actions.getUsersByRegionalId(state.currentRegional.id)
          swal({
            title: 'Usuario eliminado',
            text: 'Ha ocurrido un error',
            icon: 'error',
            className: 'text-alert-modal',
            buttons: {
              ok: {
                text: 'Cerrar',
                value: true,
                className: 'btn-primary'
              }
            }
          })
        }
      }
    })
  }

  const onResetUser = async (data) => {
    swal({
      title: 'Resetear usuario',
      text: '¿Está seguro de resetear la clave del usuario? \n Se le enviará un correo al usuario para el cambio de clave',
      icon: 'warning',
      className: 'text-alert-modal',
      buttons: {
        cancel: 'Cancelar',
        ok: {
          text: 'Si, resetear',
          value: true,
          className: 'btn-primary'
        }
      }
    }).then((res) => {
      if (res) {
        const response = actions.resetUserPassword(data.id)
        if (!response.error) {
          swal({
            title: 'Resetear usuario',
            text: 'Se le ha enviado un correo al usuario para que pueda cambiar su clave',
            icon: 'success',
            className: 'text-alert-modal',
            buttons: {
              ok: {
                text: 'Cerrrar',
                value: true,
                className: 'btn-primary'
              }
            }
          })
        } else {
          swal({
            title: 'Resetear usuario',
            text: 'Ha ocurrido un error',
            icon: 'error',
            className: 'text-alert-modal',
            buttons: {
              ok: {
                text: 'Cerrar',
                value: true,
                className: 'btn-primary'
              }
            }
          })
        }
      }
    })
  }
  const onBlockUser = async (data) => {
    swal({
      title: `${data.activo ? 'Bloquear' : 'Desbloquear'} usuario`,
      text: '¿Está seguro de realizar el bloqueo?',
      icon: 'warning',
      className: 'text-alert-modal',
      buttons: {
        cancel: 'Cancelar',
        ok: {
          text: `Si, ${data.activo ? 'bloquear' : 'desbloquear'}`,
          value: true,
          className: 'btn-primary'
        }
      }
    }).then(async (res) => {
      if (res) {
        const response =
          await actions.updateActivaInactivaUsuarioRegional(
            data.id,
            data.activo ? 0 : 1
          )
        await actions.getUsersByRegionalId(state.currentRegional.id)
        if (!response.error) {
          swal({
            title: `Usuario ${data.activo ? 'bloqueado' : 'desbloqueado'
              }`,
            text: `El usuario ha sido ${data.activo ? 'bloqueado' : 'desbloqueado'
              } con éxito`,
            icon: 'success',
            className: 'text-alert-modal',
            buttons: {
              ok: {
                text: 'Cerrrar',
                value: true,
                className: 'btn-primary'
              }
            }
          }).then((res) => {
            setEditable(false)
            setShowForm(false)
            onChangeInputNumeroIdentificacion({
              target: { value: '' }
            })
          })
        } else {
          swal({
            title: `Usuario ${data.activo ? 'bloqueado' : 'desbloqueado'
              }`,
            text: 'Ha ocurrido un error',
            icon: 'error',
            className: 'text-alert-modal',
            buttons: {
              ok: {
                text: 'Cerrar',
                value: true,
                className: 'btn-primary'
              }
            }
          })
        }
      }
    })
  }
  const columns = useMemo(() => {
    return [
      {
        Header: 'Nombre de usuario',
        label: 'Nombre de usuario',
        accessor: 'nombreUsuario',
        column: 'nombreUsuario'
      },
      {
        Header: 'Identificación',
        label: 'Identificación',
        accessor: 'identificacion',
        column: 'identificacion'
      },
      {
        Header: 'Nombre completo',
        label: 'Nombre completo',
        accessor: 'nombreCompleto',
        column: 'nombreCompleto'
      },
      {
        Header: 'Correo electrónico',
        label: 'Correo electrónico',
        accessor: 'email',
        column: 'email'
      },
      {
        Header: 'Ultimo inicio de sesión',
        label: 'Ultimo inicio de sesión',
        accessor: 'ultimoInicioSesion',
        column: 'ultimoInicioSesion'
      },
      {
        Header: 'Estado',
        label: 'Estado',
        accessor: 'activo',
        column: 'activo',
        Cell: ({ row }) => {
          return (
            <div
              style={{
                padding: '.5rem 1rem',
                background: row.original.activo
                  ? colors.primary
                  : 'red',
                borderRadius: '16rem',
                color: '#FFF'
              }}
            >
              {row.original.activo ? 'ACTIVO' : 'INACTIVO'}
            </div>
          )
        }
      },
      {
        Header: 'Acciones',
        label: 'Acciones',
        accessor: 'actions',
        column: 'actions',
        Cell: ({ row }) => {
          return (
            <div className='d-flex justify-content-center align-items-center'>
              <Tooltip
                title='Resetear contraseña'
                className='mr-2'
              >
                <LockIcon
                  onClick={() => onResetUser(row.original)}
                  style={{
                    fontSize: 25,
                    cursor: 'pointer',
                    color: colors.darkGray
                  }}
                />
              </Tooltip>
              <Tooltip title='Editar usuario' className='mr-2'>
                <EditIcon
                  onClick={() => {
                    const type =
                      tipoIdentificacionOptions.find(
                        (i) =>
                          i.value ==
                          row.original
                            ?.tipoIdentificacionId
                      )
                    onChangeSelectTipoIdentificacion(type)
                    setShowForm(true)
                    setSelectedUser(row.original)
                  }}
                  style={{
                    fontSize: 25,
                    cursor: 'pointer',
                    color: colors.darkGray
                  }}
                />
              </Tooltip>
              <Tooltip title='Eliminar usuario' className='mr-2'>
                <DeleteIcon
                  onClick={() => onDeleteUser(row.original)}
                  style={{
                    fontSize: 25,
                    cursor: 'pointer',
                    color: colors.darkGray
                  }}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [data])
  const {
    onChangeInputNumeroIdentificacion,
    onChangeInputEmail,
    onChangeSelectTipoIdentificacion,
    onChangeSelectRol,
    onConfirmRegisterModalCallback,
    tipoIdentificacionId,
    tipoIdentificacionOptions,
    numeroIdentificacion,
    encontrado,
    fullname,
    toggleRegisterModal,
    showRegisterModal,
    rolId,
    email,
    identidadId,
    loading: formLoading,
    regionales,
    regionalId,
    onChangeRegional,
    usuarioId
  } = useFormComponent()

  useEffect(() => {
    if (state.currentRegional) {
      actions.getUsersByRegionalId(state.currentRegional.id)
    }
  }, [state.currentRegional])

  const dataRoles = useMemo(() => {
    if (selectedUser?.roles) {
      return selectedUser?.roles || []
    }
    return []
  }, [selectedUser])

  const columnsRoles = useMemo(() => {
    return [
      {
        Header: 'Roles activos',
        column: 'rolAsignado',
        accessor: 'rolAsignado',
        label: 'Roles activos'
      },
      {
        Header: 'Institución educativa',
        column: 'Regional',
        accessor: 'Regional',
        label: 'Institución educativa'
      }
    ]
  }, [dataRoles])

  return (
    <div>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      {!showForm && (
        <div className='my-5 d-flex justify-content-between'>
          <SearchContainer className='mr-4'>
            <div className='search-sm--rounded'>
              <input
                type='text'
                name='keyword'
                id='search'
                value=''
                onKeyPress={(e) => { }}
                onChange={(e) => { }}
                placeholder='Escriba aquí las palabras claves que desea buscar...'
              />
              <StyledInputGroupAddon
                style={{ zIndex: 2 }}
                addonType='append'
              >
                <Button
                  color='primary'
                  className='buscador-table-btn-search'
                  onClick={() => { }}
                  id='buttonSearchTable'
                >
                  Buscar
                </Button>
              </StyledInputGroupAddon>
            </div>
          </SearchContainer>
          <Button
            color='primary'
            onClick={() => {
              setShowForm(true)
              // setEditable(true)
            }}
          >
            Agregar
          </Button>
        </div>
      )}
      {!showForm
        ? (
          <Card>
            <CardBody
              style={{
                overflow: 'scroll'
              }}
            >
              <TableReactImplementation
                columns={columns}
                data={data}
                avoidSearch
              />
            </CardBody>
          </Card>
        )
        : (
          <>
            <Back
              onClick={() => {
                setShowForm(false)
                setEditable(false)
                setSelectedUser(null)
                onChangeInputEmail({ target: { value: '' } })
              }}
            >
              <BackIcon />
              <BackTitle>Regresar</BackTitle>
            </Back>
            <div className='d-flex justify-content-between align-items-start'>
              <Card style={{ width: '49%' }} className='mb-5'>
                <CardBody>
                  <h6>Buscar persona</h6>
                  <div>
                    Busca la persona a la cual se la creará el
                    usuario. Si no está registrada podrás
                    registrala
                  </div>
                  <FormUserComponent
                    regionalId={regionalId}
                    onChangeRegional={onChangeRegional}
                    regionales={regionales}
                    isEditing={selectedUser}
                    onChangeSelectTipoIdentificacion={
                      onChangeSelectTipoIdentificacion
                    }
                    tipoIdentificacionOptions={
                      tipoIdentificacionOptions
                    }
                    tipoIdentificacionValue={
                      tipoIdentificacionId
                    }
                    encontrado={encontrado}
                    onChangeInputNumIdentificacion={
                      onChangeInputNumeroIdentificacion
                    }
                    identificacion={numeroIdentificacion}
                    onChangeInputEmail={onChangeInputEmail}
                    email={email}
                    fullName={fullname}
                    toggleRegisterModal={toggleRegisterModal}
                    showRegisterModal={showRegisterModal}
                    rolOptions={state.roles.map((el) => ({
                      value: el?.id,
                      label: el?.nombre
                    }))}
                    onChangeSelectRol={onChangeSelectRol}
                    rolId={rolId}
                    onConfirmRegisterModalCallback={
                      onConfirmRegisterModalCallback
                    }
                  />
                  {selectedUser
                    ? (
                      <div className='d-flex justify-content-between align-items-center my-3'>
                        <div>
                          <Button
                            color='danger'
                            className='mr-2'
                            onClick={() => {
                              onDeleteUser({
                                id: selectedUser?.id
                              })
                            }}
                          >
                            <div className='d-flex justify-content-center align-items-center'>
                              <DeleteIcon
                                className='mr-2'
                                style={{
                                  fontSize: 20
                                }}
                              />
                              <span>Eliminar</span>
                            </div>
                          </Button>
                          <Button
                            color='primary'
                            outline
                            className='mr-2'
                            onClick={() => {
                              onBlockUser({
                                id: selectedUser?.id,
                                activo: selectedUser?.activo
                              })
                            }}
                          >
                            <div className='d-flex justify-content-center align-items-center'>
                              <BiBlock
                                className='mr-2'
                                style={{
                                  fontSize: 20
                                }}
                              />
                              <span>Bloquear</span>
                            </div>
                          </Button>
                          <Button
                            color='primary'
                            outline
                            onClick={() => {
                              onResetUser({
                                id: selectedUser?.id
                              })
                            }}
                          >
                            <div className='d-flex justify-content-center align-items-center'>
                              <AutorenewIcon
                                className='mr-2'
                                style={{
                                  fontSize: 20
                                }}
                              />
                              <span>Resetear</span>
                            </div>
                          </Button>
                        </div>
                        <div>
                          {!editable
                            ? (
                              <Button
                                color='primary'
                                onClick={() => {
                                  setEditable(true)
                                }}
                              >
                                <div className='d-flex justify-content-center align-items-center'>
                                  <EditIcon
                                    className='mr-2'
                                    style={{
                                      fontSize: 20
                                    }}
                                  />
                                  <span>Editar</span>
                                </div>
                              </Button>
                            )
                            : (
                              <div className='d-flex justify-content-center my-3'>
                                <>
                                  <Button
                                    color='primary'
                                    outline
                                    onClick={() => {
                                      setEditable(
                                        false
                                      )
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    color='primary'
                                    onClick={async () => {
                                      const roles = [
                                        ...selectedUser?.roles
                                          .filter((el) => el?.sb_rolesId !== rolId?.value)
                                          .map((el) => ({
                                            roleId: el?.sb_rolesId,
                                            nivelAccesoId: el?.nivelAccessoId || el?.nivelAccesoId,
                                            alcanceId: el?.RegionalId
                                          })),
                                        {
                                          roleId: rolId?.value,
                                          nivelAccesoId: 3,
                                          alcanceId: regionalId?.value
                                        }
                                      ]
                                      const res = await actions.updateUserByRegionalId(
                                        {
                                          userId: usuarioId,
                                          email,
                                          Roles: roles
                                        },
                                        regionalId?.value
                                      )
                                      if (
                                        !res.error
                                      ) {
                                        swal({
                                          title: 'Actualizar usuario',
                                          text: 'Se ha actualizado el usuario con éxito.',
                                          icon: 'success',
                                          className:
                                            'text-alert-modal',
                                          buttons:
                                          {
                                            ok: {
                                              text: 'Cerrar',
                                              value: true,
                                              className:
                                                'btn-primary'
                                            }
                                          }
                                        }).then(
                                          () => {
                                            setEditable(
                                              false
                                            )
                                            setShowForm(
                                              false
                                            )
                                            onChangeInputNumeroIdentificacion(
                                              {
                                                target: {
                                                  value: ''
                                                }
                                              }
                                            )
                                          }
                                        )
                                      } else {
                                        setSnackbarContent(
                                          {
                                            variant:
                                              'error',
                                            msg:
                                              res?.message ||
                                              'Ha ocurrido un error al actualizar el usuario'
                                          }
                                        )
                                        handleClick()
                                      }
                                    }}
                                  >
                                    Guardar
                                  </Button>
                                </>
                              </div>
                            )}
                        </div>
                      </div>
                    )
                    : (
                      <div className='d-flex justify-content-center my-3'>
                        <>
                          <Button
                            color='primary'
                            outline
                            onClick={() => {
                              setEditable(false)
                              setShowForm(false)
                              onChangeInputNumeroIdentificacion(
                                {
                                  target: {
                                    value: ''
                                  }
                                }
                              )
                            }}
                          >
                            Cancelar
                          </Button>
                          {encontrado && (
                            <Button
                              color='primary'
                              onClick={async () => {
                                let res = null
                                if (usuarioId) {
                                  res =
                                    await actions.updateUserByRegionalId(
                                      {
                                        userId: usuarioId,
                                        email,
                                        Roles: [
                                          {
                                            roleId: rolId?.value,
                                            nivelAccesoId: 3,
                                            alcanceId:
                                              regionalId?.value
                                          }
                                        ]
                                      },
                                      regionalId?.value
                                    )
                                } else {
                                  res =
                                    await actions.createUserByRegionalId(
                                      {
                                        nombreUsuario:
                                          numeroIdentificacion,
                                        identidadId,
                                        email,
                                        userId: usuarioId,
                                        roles: [
                                          {
                                            roleId: rolId?.value,
                                            nivelAccesoId: 3,
                                            alcanceId:
                                              regionalId?.value
                                          }
                                        ]
                                      },
                                      regionalId?.value
                                    )
                                }
                                if (!res.error) {
                                  swal({
                                    title: 'Crear usuario',
                                    text: 'Se ha creado el usuario con éxito.',
                                    icon: 'success',
                                    className:
                                      'text-alert-modal',
                                    buttons: {
                                      ok: {
                                        text: 'Cerrar',
                                        value: true,
                                        className:
                                          'btn-primary'
                                      }
                                    }
                                  }).then(() => {
                                    setEditable(
                                      false
                                    )
                                    setShowForm(
                                      false
                                    )
                                    onChangeInputNumeroIdentificacion(
                                      {
                                        target: {
                                          value: ''
                                        }
                                      }
                                    )
                                  })
                                } else {
                                  setSnackbarContent({
                                    variant:
                                      'error',
                                    msg:
                                      res?.message ||
                                      'Ha ocurrido un error al crear el usuario'
                                  })
                                  handleClick()
                                }
                              }}
                            >
                              Guardar
                            </Button>
                          )}
                        </>
                      </div>
                    )}
                </CardBody>
              </Card>
              {selectedUser && (
                <Card style={{ width: '49%' }}>
                  <CardBody>
                    <h3>Roles activos</h3>{' '}
                    <TableReactImplementation
                      avoidSearch
                      columns={columnsRoles}
                      data={dataRoles}
                    />
                  </CardBody>
                </Card>
              )}
            </div>
          </>
        )}
    </div>
  )
}

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`
const SearchContainer = styled.div`
	width: 32vw;
	min-width: 16rem;
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

export default HumanResource
