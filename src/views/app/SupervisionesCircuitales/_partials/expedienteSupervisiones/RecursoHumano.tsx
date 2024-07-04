import React, { useState, useMemo, useEffect } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import Tooltip from '@mui/material/Tooltip'
import BarLoader from 'Components/barLoader/barLoader'
import colors from 'Assets/js/colors'
import { Col, Row, Container, CustomInput, Button } from 'reactstrap'
import moment from 'moment'
import { Edit, Delete, Lock } from '@material-ui/icons'
import useFormComponent from './useFormComponent'
import RegisterUserComponent from './RegisterUserComponent'
import styled from 'styled-components'

import { BiBlock } from 'react-icons/bi'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import swal from 'sweetalert'
import useNotification from 'Hooks/useNotification'
import {
  getUserByCircuitoId,
  editUser,
  resetUserPassword,
  removeUser,
  createUserRegionalCircuital,
  updateActivaInactivaUsuarioCircuito,
  editUserRegionalCircuital
} from 'Redux/UsuarioCatalogos/actions'
import GoBack from 'Components/goBack'
import { getRolesByTipo } from 'Redux/roles/actions.js'
import { useTranslation } from 'react-i18next'
interface IState {
	usuarioCatalogos: {
		userCircuito: {
			id: number
			nombreUsuario: string
			identificacion: string
			nombreCompleto: string
			email: string
			ultimoInicioSesion: string
			estado: boolean
			nivelAcceso: string
			nivelAccesoId: string
			rolAsignadoNombre: string
			rolAsignadoId: string
		}
	}
	configuracion: {
		currentCircuito: {
			id: number
			codigo: string
			codigoPresupuestario: string
			nombre: string
			esActivo: boolean
			fechaInsercion: string
			fechaActualizacion: string
			telefono: any
			correoElectronico: any
			codigoDgsc2: number
			conocidoComo: any
			imagenUrl: string
			nombreDirector: any
			ubicacionGeograficaJson: any
		}
	}
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
const RecursoHumano = () => {
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [registerBox, setRegisterBox] = useState(false)
  const [snackbar, handleClickNotification] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({
    msg: '',
    variant: ''
  })
  const [isEditing, setIsEditing] = useState<any>(false)
  const [circuitoOptions, setCircuitoOptions] = useState<any>([])
  const [circuitoValue, setCircuitoValue] = useState<any>()
  const [stateUser, setStateUser] = useState(null)
  const [rolesActivos, setRolesActivos] = useState([])
  const [buttonEdit, setButtonEdit] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const actions = useActions({
    getUserByCircuitoId,
    editUser,
    resetUserPassword,
    getRolesByTipo,
    removeUser,
    createUserRegionalCircuital,
    updateActivaInactivaUsuarioCircuito,
    editUserRegionalCircuital
  })
  const state = useSelector((state: IState) => ({
    userCircuito: state.usuarioCatalogos?.userCircuito,
    currentCircuito: state.configuracion?.expedienteSupervision || state.configuracion?.currentCircuito,
    expedienteSupervision: state.configuracion?.expedienteSupervision,
    roles: state.roles.roles
  }))

  useEffect(() => {
    actions.getRolesByTipo(11)
  }, [])

  useEffect(() => {
    if (state.currentCircuito) {
      actions.getUserByCircuitoId(state.currentCircuito.id)
    }
  }, [state.currentCircuito])

  useEffect(() => {
    if (state.userCircuito) {
      setData(state.userCircuito)
    }
  }, [state.userCircuito])

  useEffect(() => {
    if (!state.currentCircuito.id) return
    const obj = {
      label: state.currentCircuito.nombre,
      value: state.currentCircuito.id
    }
    setCircuitoOptions([obj])
    setCircuitoValue(obj)
  }, [state.currentCircuito.id])

  const convertDate = (str) => {
    if (str == null || str == '0001-01-01T00:00:00') { return 'No ha iniciado sesión' } else return moment(str).format('DD/MM/YYYY h:mm:ss a')
  }

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
    }).then(async (res) => {
      if (res) {
        const response = await actions.removeUser(data.id)

        if (!response.error) {
          await actions.getUserByCircuitoId(state.currentCircuito.id)
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
    }).then(async (res) => {
      if (res) {
        const response = await actions.resetUserPassword(data.id)

        if (!response.error) {
          await actions.getUserByCircuitoId(state.currentCircuito.id)
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
      title: 'Bloquear usuario',
      text: '¿Está seguro de realizar el bloqueo?',
      icon: 'warning',
      className: 'text-alert-modal',
      buttons: {
        cancel: 'Cancelar',
        ok: {
          text: 'Si bloquear',
          value: true,
          className: 'btn-primary'
        }
      }
    }).then(async (res) => {
      if (res) {
        const response = await actions.updateActivaInactivaUsuarioCircuito(data.id, 0)
        await actions.getUserByCircuitoId(state.currentCircuito.id)
        if (!response.error) {
          swal({
            title: 'Usuario bloqueado',
            text: 'El usuario ha sido bloqueado con éxito',
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
          addButton(false)
        }
      }
    })
  }

  const onUnBlockUser = async (data) => {
    swal({
      title: 'Desbloquear usuario',
      text: '¿Está seguro de realizar el desbloqueo?',
      icon: 'warning',
      className: 'text-alert-modal',
      buttons: {
        cancel: 'Cancelar',
        ok: {
          text: 'Si desbloquear',
          value: true,
          className: 'btn-primary'
        }
      }
    }).then(async (res) => {
      if (res) {
        const response = await actions.updateActivaInactivaUsuarioCircuito(data.id, 1)
        await actions.getUserByCircuitoId(state.currentCircuito.id)
        if (!response.error) {
          swal({
            title: 'Usuario desbloqueado',
            text: 'El usuario ha sido desbloqueado con éxito',
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
          addButton(false)
        }
      }
    })
  }
  /* useEffect(() => {
        if (selectedUser) {
            onChangeInputEmail({ target: { value: selectedUser?.email } })
            const rol = rolesActivos.find((el) => el?.CircuitalId === state.currentCircuito?.id)
            onChangeSelectRol({ label: rol?.rolAsignado, value: rol?.sb_rolesId })
            onChangeInputNumeroIdentificacion({ target: { value: selectedUser.identificacion }})

        }
    }, [selectedUser]) */

  const columns = useMemo(() => {
    return [
      {
        Header: t('supervision_circ>expediente>recurso_hum>col_nom_user', 'Nombre de usuario'),
        column: 'nombreUsuario',
        accessor: 'nombreUsuario',
        label: ''
      },
      {
        Header: t('supervision_circ>expediente>recurso_hum>col_id', 'Identificación'),
        column: 'identificacion',
        accessor: 'identificacion',
        label: ''
      },
      {
        Header: t('supervision_circ>expediente>recurso_hum>col_nom', 'Nombre completo'),
        column: 'nombreCompleto',
        accessor: 'nombreCompleto',
        label: ''
      },
      {
        Header: t('supervision_circ>expediente>recurso_hum>col_correo', 'Correo electrónico'),
        column: 'email',
        accessor: 'email',
        label: ''
      },
      {
        Header: t('supervision_circ>expediente>recurso_hum>col_ultimo_inicio', 'Último inicio de sesión'),
        column: 'sesion',
        accessor: 'ultimoInicioSesion',
        label: '',
        Cell: ({ _, row, data }) => {
          const fullRow = data[row.index]
          return <>{convertDate(fullRow.ultimoInicioSesion)}</>
        }
      },
      {
        Header: t('general>estado', 'Estado'),
        column: 'activo',
        accessor: 'activo',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          return (
            <p
              style={{
							  background: colors.primary,
							  color: '#fff',
							  textAlign: 'center',
							  borderRadius: ' 20px'
              }}
            >
              {fullRow.activo ? 'ACTIVO' : 'INACTIVO'}
            </p>
          )
        }
      },
      {
        Header: t('general>estado', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ _, row, data }) => {
          const fullRow = data[row.index]
          return (
            <div
              style={{
							  display: 'flex',
							  justifyContent: 'center',
							  alignItems: 'center',
							  alignContent: 'center',
							  gap: '1rem'
              }}
            >
              <Tooltip title={t('supervision_circ>expediente>recurso_hum>col_acciones>rest_contra>hover', 'Restablecer contraseña')}>
                <Lock
                  onClick={() => {
									  onResetUser(fullRow)
                  }}
                  style={{
									  fontSize: 25,
									  color: colors.darkGray,
									  cursor: 'pointer'
                  }}
                />
              </Tooltip>
              <Tooltip title={t('supervision_circ>expediente>recurso_hum>col_editar>hover', 'Editar')}>
                <Edit
                  onClick={() => {
									  addButton(true)
									  setIsEditing(true)
									  const type = tipoIdentificacionOptions.find(i => i.value == JSON.parse(fullRow?.tipoIdentificacion)[0]?.id)
									  reloadUserInfo(fullRow.identificacion, type)
									  setSelectedUser(fullRow)
									  setStateUser(fullRow.activo)
									  setRolesActivos(JSON.parse(fullRow.rolesAsignados))
									  onChangeInputEmail({ target: { value: fullRow?.email } })
									  /* onChangeInputNumeroIdentificacion({ target: { value: fullRow.identificacion }})
        								onChangeSelectTipoIdentificacion(type)
										const rol = JSON.parse(fullRow.rolesAsignados).find((el) => el?.CircuitalId === state.currentCircuito?.id)
										onChangeSelectRol({ label: rol?.rolAsignado, value: rol?.sb_rolesId }) */
                  }}
                  style={{
									  fontSize: 25,
									  color: colors.darkGray,
									  cursor: 'pointer'
                  }}
                />
              </Tooltip>
              <Tooltip title={t('supervision_circ>expediente>recurso_hum>col_eliminar>eliminar', 'Eliminar')}>
                <Delete
                  onClick={() => {
									  setSelectedUser(fullRow)
									  onDeleteUser(fullRow)
                  }}
                  style={{
									  fontSize: 25,
									  color: colors.darkGray,
									  cursor: 'pointer'
                  }}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ]
  }, [data, t])

  useEffect(() => {
    console.clear()
    console.log(data, 'DATA')
  }, [data])

  const columnsHistory = useMemo(() => {
    return [
      {
        Header: 'Número de identificación',
        column: 'numero',
        accessor: 'numero',
        label: ''
      },
      {
        Header: 'Nombre completo',
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: 'Correo electrónico',
        column: 'correo',
        accessor: 'correo',
        label: ''
      },
      {
        Header: 'Último inicio de sesión con rol supervisor en ese circuito',
        column: 'sesion',
        accessor: 'ultimoInicioSesion',
        label: '',
        Cell: ({ _, row, data }) => {
          const fullRow = data[row.index]
          return <>{convertDate(fullRow.ultimoInicioSesion)}</>
        }
      },
      {
        Header: 'Regionales asociados',
        column: 'regionalesAsociados',
        accessor: 'regionalesAsociados',
        label: ''
      }
    ]
  }, [])

  const {
    fetchIdentidad,
    onChangeInputEmail,
    onChangeInputNumeroIdentificacion,
    onChangeSelectRol,
    onChangeSelectTipoIdentificacion,
    tipoIdentificacionId,
    tipoIdentificacionOptions,
    numeroIdentificacion,
    encontrado,
    fullname,
    toggleRegisterModal,
    showRegisterModal,
    rolesOptions,
    rolId,
    email,
    identidadId,
    reloadUserInfo,
    // circuitos,
    // circuitoId,
    // onChangeCircuito,
    onConfirmRegisterModalCallback,
    // onChangeMultiselectCircuitos,
    usuarioId
  } = useFormComponent()

  const addButton = (bool) => {
    setRegisterBox(bool)
  }

  const onAsignarDirectorEvent = async () => {
    let response = null
    response = await actions.createUserRegionalCircuital({
      nombreUsuario: fullname,
      email,
      identidadId,
      roles: [
			   {
          roleId: rolId.value,
          nivelAccesoId: 2,
          alcanceId:	circuitoValue?.value
        }
      ]
    })
    if (response.response.error) {
      setSnackbarContent({
        variant:
					'error',
        msg: response.response.mensajeError
      })
      handleClickNotification()
      return
    }

    if (response.error) {
      setSnackbarContent({
        variant:
					'error',
        msg: 'Ha ocurrido un error al crear el usuario'
      })
      handleClickNotification()
    } else {
      setSnackbarContent({
        variant:
					'success',
        msg: 'Se ha creado exitosamente el usuario'
      })
      handleClickNotification()
      onRegresarEvent()
    }
  }

  const onRegresarEvent = () => {
    addButton(false)
    setSelectedUser(null)
    setIsEditing(false)
    onChangeInputNumeroIdentificacion({ target: { value: '' } })
    setButtonEdit(false)
  }

  return (
    <div className='dashboard-wrapper'>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      {loading && <BarLoader />}
      <Container>
        <Row>
          <Col xs={12}>
            {registerBox ? (
              <div>
                <GoBack onClick={onRegresarEvent} />
                <Div1>
                  <Box>
                    <RegisterUserComponent
                      multiselectCircuitosValue={circuitoValue}
                      multiselectCircuitoOptions={circuitoOptions}
											// onChangeMultiselectCircuitos={onChangeMultiselectCircuitos}
											// onChangeCircuito={onChangeCircuito}
                      onChangeSelectTipoIdentificacion={
												onChangeSelectTipoIdentificacion
											}
                      isEditing={isEditing}
                      onRegresarEvent={onRegresarEvent}
                      onSaveButtonClickEvent={onAsignarDirectorEvent}
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
                      identificacion={
												numeroIdentificacion
											}
                      onChangeInputEmail={
												onChangeInputEmail
											}
                      email={email}
                      fullName={fullname}
                      toggleRegisterModal={
												toggleRegisterModal
											}
                      edit={buttonEdit}
                      showRegisterModal={
												showRegisterModal
											}
                      rolOptions={state.roles.map((el) => ({
											  value: el?.id,
											  label: el?.nombre
                      }))}
                      onChangeSelectRol={
												onChangeSelectRol
											}
                      rolId={rolId}
                      onConfirmRegisterModalCallback={
												onConfirmRegisterModalCallback
											}
                    />
                    {
											buttonEdit && (
  <div
    style={{
												  display: 'flex',
												  paddingTop: '1rem',
												  gap: '0.5rem',
												  justifyContent: 'center'
    }}
  >
    <ButtonCss
      color='primary'
      outline
      onClick={() => {
													  setButtonEdit(false)
													  setIsEditing(true)
      }}
    >
      Cancelar
    </ButtonCss>
    <ButtonCss
      color='primary'
      onClick={async () => {
													  const res = await actions.editUserRegionalCircuital({
													    email,
													    userId: selectedUser.id,
													    Roles: [
													      ...rolesActivos.filter(el => el?.sb_rolesId !== rolId?.value).map((el) => ({
													        roleId: el?.sb_rolesId,
													        nivelAccesoId: el?.nivelAccessoId,
													        alcanceId: el?.CircuitalId
            })),
													      {
													        roleId: rolId?.value,
													        nivelAccesoId: 3,
													        alcanceId: circuitoValue?.value
            }
													    ]
													  }, circuitoValue?.value)
													  if (!res.error) {
													    swal({
													      title: 'Actualizar usuario',
													      text: 'Se ha actualizado el usuario con éxito.',
													      icon: 'success',
													      className: 'text-alert-modal',
													      buttons: {
													        ok: {
													          text: 'Cerrar',
													          value: true,
													          className: 'btn-primary'
													        }
													      }
													    }).then(async () => {
													      await actions.getUserByCircuitoId(state.currentCircuito.id)
													      setIsEditing(false)
													      setButtonEdit(false)
													      addButton(false)
													      onChangeInputNumeroIdentificacion({ target: { value: '' } })
													    })
													  } else {
													    setSnackbarContent({
													      variant: 'error',
													      msg: res?.message || 'Ha ocurrido un error al actualizar el usuario'
													    })
													    handleClickNotification()
													  }
      }}
    >
      Guardar usuario
    </ButtonCss>
  </div>
											)
											}
                    {selectedUser || buttonEdit ? (
                      <div
                        style={{
												  display: 'flex',
												  paddingTop: '1rem',
												  gap: '0.5rem'
                        }}
                      >
                        <ButtonCss
                          style={{
													  background: '#ec8180',
													  color: 'black',
													  borderColor: '#fff'
                          }}
                          onClick={() => {
													  onDeleteUser({ id: selectedUser?.id })
                          }}
                        >
                          <Delete
                            style={{
														  fontSize: 17
                            }}
                          />
                          Eliminar
                        </ButtonCss>
                        <ButtonCss
                          onClick={() => {
													  if (stateUser === true) {
													    onBlockUser({ id: selectedUser?.id })
													  } else { onUnBlockUser({ id: selectedUser?.id }) }
                          }}
                          outline
                        >
                          <BiBlock
                            style={{
														  fontSize: 17
                            }}
                          />
                          {stateUser === true ? 'Bloquear' : 'Desbloquear'}
                        </ButtonCss>
                        <ButtonCss
                          onClick={() => {
													  onResetUser({ id: selectedUser?.id })
                          }}
                          outline
                        >
                          <AutorenewIcon
                            style={{
														  fontSize: 17
                            }}
                          />
                          Resetear
                        </ButtonCss>
                        <div
                          style={{
													  width: '50%',
													  display: 'flex',
													  justifyContent:
															'flex-end'
                          }}
                        >
                          <ButtonCss
                            onClick={() => {
														  setIsEditing(false)
														  setButtonEdit(true)
                            }}
                            color='primary'
                            style={{
														  left: '0'
                            }}
                          >
                            <Edit
                              style={{
															  fontSize: 17
                              }}
                            />
                            Editar
                          </ButtonCss>
                        </div>
                      </div>
                    ) : <div className='d-flex justify-content-center my-3'>
                      <>
                        <Button
                          color='primary'
                          outline
                          onClick={() => {
                            onRegresarEvent()
                          }}
                        >
                          {t('general>cancelar', 'Cancelar')}
                        </Button>
                        {
                                                encontrado && (
                                                  <Button
                                                    color='primary'
                                                    onClick={async () => {
                                                      let res = null
                                                      /* if (usuarioId) {
																res = await actions.editUserRegionalCircuital({
																	userId: usuarioId,
																	email,
																	Roles: [
																		{
																			"roleId": rolId?.value,
																			"nivelAccesoId": 2,
																			"alcanceId": circuitoValue?.value,
																		}
																	]
																}, circuitoValue?.value)
															} else { */
                                                      res = await actions.createUserRegionalCircuital({
                                                        nombreUsuario: numeroIdentificacion,
                                                        identidadId,
                                                        email,
                                                        userId: usuarioId,
                                                        roles: [{
                                                          roleId: rolId?.value,
                                                          nivelAccesoId: 2,
                                                          alcanceId: circuitoValue?.value
                                                        }]
                                                      }, circuitoValue?.value)
                                                      console.log(res, 'RESPONSEE')
                                                      /* } */
                                                      if (!res.error) {
                                                        swal({
                                                          title: t('supervision_circ>expediente>recurso_hum>add>success>titulo', 'Crear usuario'),
                                                          text: t('supervision_circ>expediente>recurso_hum>add>success>msj', 'Se ha creado el usuario con éxito.'),
                                                          icon: 'success',
                                                          className: 'text-alert-modal',
                                                          buttons: {
                                                            ok: {
                                                              text: t('general>cerrar', 'Cerrar'),
                                                              value: true,
                                                              className: 'btn-primary'
                                                            }
                                                          }
                                                        }).then(async () => {
                                                          await actions.getUserByCircuitoId(state.currentCircuito.id)
                                                          setIsEditing(false)
                                                          addButton(false)
                                                          onChangeInputNumeroIdentificacion({ target: { value: '' } })
                                                        })
                                                      } else {
                                                        setSnackbarContent({
                                                          variant: 'error',
                                                          msg: res?.response.mensajeError || 'Ha ocurrido un error al crear el usuario'
                                                        })
                                                        handleClickNotification()
                                                      }
                                                    }}
                                                  >
                                                    {t('general>crear_user', 'Crear usuario')}
                                                  </Button>
                                                )
                                            }
                      </>
                    </div>}
                  </Box>
                  {selectedUser || buttonEdit
                    ? (
                      <Box>
                        <Titulo>Roles activos</Titulo>{' '}
                        <table>
                          <thead>
                            <Th
                              style={{
														  borderTopLeftRadius:
																'5px',
														  borderRight:
																'1px solid #fff',
														  width: '20rem'
                              }}
                            >
                              Rol
                            </Th>
                            <Th
                              style={{
														  borderTopRightRadius:
																'5px',
														  width: '80rem'
                              }}
                            >
                              Institución educativa
                            </Th>
                          </thead>
                          <tbody>
                            {rolesActivos.map((item, i) => (
                              <tr>
                                <Td>{item.rolAsignado}</Td>
                                <Td>{item.Circuital}</Td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                      )
                    : <></>}
                </Div1>
                {/* {openModal === 'create-user' && (
									<Box style={{ width: '100%' }}>
										<Titulo>
											Historial de supervisiones
											circuitales en los circuitos
											asociados al supervisor
										</Titulo>
										<TableReactImplementation
											data={[]}
											handleGetData={() => {}}
											columns={columnsHistory}
											orderOptions={[]}
											avoidSearch
										/>
									</Box>
								)} */}
              </div>
            ) : (
              <TableReactImplementation
                data={Array.isArray(data) ? data : []}
                columns={columns}
                orderOptions={[]}
                showAddButton
                onSubmitAddButton={() => addButton(true)}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default RecursoHumano

const Div1 = styled.div`
	display: flex;
	gap: 1rem;
	@media (max-width: 768px) {
		display: flex;
		flex-direction: column;
	}
`

const ButtonCss = styled(Button)`
	display: flex;
	justify-content: center;
	align-items: center;
	align-content: center;
`

const Box = styled.div`
	border-radius: calc(0.85rem - 1px);
	box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
	background: #fff;
	padding: 1rem;
	margin-top: 10px;
	width: 50%;
	position: relative;
	@media (max-width: 768px) {
		width: 100%;
	}
`
const Titulo = styled.p`
	font-size: 15px;
	font-weight: bold;
	margin: 0;
`

const Th = styled.th`
	text-align: center;
	background: #145388;
	color: #fff;
	height: 2.5rem;
	font-size: 12px;
	width: 100%;
`
const Td = styled.td`
	text-align: center;
	padding: 2%;
	border: 1px solid #eaeaea;
`
