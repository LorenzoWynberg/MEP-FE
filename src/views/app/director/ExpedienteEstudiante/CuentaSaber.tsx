import React, { useState, useMemo, useEffect } from 'react'
import {
  Input,
  Label,
  Form,
  Row,
  Col,
  FormGroup,
  Card,
  CardBody,
  CardTitle,
  Button
} from 'reactstrap'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import SimpleModal from 'Components/Modal/ConfirmModal'
import { getRolesByTipo } from '../../../../redux/roles/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import useNotification from 'Hooks/useNotification'
import UserPicAndName from '../../GestionUsuarios/_partials/UserPicAndName'
import moment from 'moment'
import useCuentaSaber from './useCuentaSaber'
import {
  getIdentification,
  getFichaPersona
} from '../../../../redux/identificacion/actions'
import { ActionsButtonsComponent } from 'Components/UserCreateForm'

const defaultTipoIdentificacion = [
  { value: 1, label: 'CÉDULA' },
  { value: 3, label: 'DIMEX' },
  { value: 4, label: 'YÍS RÖ - IDENTIFICACIÓN MEP' }
  
]

const TIPO_ROL_ESTUDIANTE = 8
const CuentaSaber = (props) => {
  const [edit, setEdit] = useState<'' | 'create' | 'create-user'>('')
  const [modal, setModal] = useState(false)
  const [snackbar, handleClick] = useNotification()
  const [snackbarData, setSnackbarData] = React.useState<{
		variant: 'success' | 'error'
		msg: string
	}>({ variant: 'success', msg: '' })
  const {
    createUsuario,
    fetchIdentidad,
    fetchFullRolInfoByUsuarioId,
    getRolesInfoByUserId,
    deleteUsuario,
    resetContrasenia,
    updateActivaInactivaUsuario,
    questionAlert,
    state,
    stateManage,
    updateUsuario
  } = useCuentaSaber()
  const reduxState = useSelector((store: any) => {
    return {
      roles: store.roles.roles,
      tipoRoles: store.roles.tipoRoles,
      identification: store.identification,
      expedienteEstudiantil: store.expedienteEstudiantil,
      currentInstitution: store.authUser.currentInstitution
    }
  })
  const convertDate = (str) => {
    if (str == null || str == '0001-01-01T00:00:00') { return 'No ha iniciado sesión' } else return moment(str).format('DD/MM/YYYY h:mm:ss a')
  }
  const closeModal = () => {
    setModal(false)
  }

  const actions = useActions({
    getRolesByTipo
  })

  const loadRolesActivos = (usuarioId) => {
    getRolesInfoByUserId(usuarioId).then((response) => {
      stateManage.setRolesActivos(response)
    })
  }
  const loadGridRows = (usuarioId) => {
    const buildColumnRol = (index, nombre, color, fullRow, onClick) => {
      return (
        <span
          onClick={(e) => (onClick ? onClick(e, fullRow) : null)}
          key={index}
          style={{
					  padding: '3px',
					  borderRadius: '5px',
					  margin: '2px',
					  background: color || 'lightgray',
					  cursor: 'pointer'
          }}
        >
          {nombre}
        </span>
      )
    }
    const buildColumnInstituciones = (index, nombre) => {
      return <label key={index}>{nombre}</label>
    }
    const buildActionColumn = (userId, isActive, fullRow) => {
      const deleteEvent = () => {
        questionAlert({
          dangerMode: true,
          icon: 'warning',
          msg: '¿Está seguro que desea eliminar el usuario seleccionado?',
          title: 'Gestión de Usuarios'
        }).then((response) => {
          if (response) {
            deleteUsuario(userId).then(() =>
              stateManage.setHasUser(false)
            )
          }
        })
      }
      const lockEvent = () => {
        questionAlert({
          dangerMode: true,
          icon: 'warning',
          msg: '¿Desea bloquear el usuario seleccionado?',
          title: 'Gestión de Usuarios'
        }).then((response) => {
          if (response == true) updateActivaInactivaUsuario(userId, 0)
        })
      }
      const unlockEvent = () => {
        questionAlert({
          dangerMode: true,
          icon: 'warning',
          msg: '¿Desea desbloquear el usuario seleccionado?',
          title: 'Gestión de Usuarios'
        }).then((response) => {
          if (response == true) updateActivaInactivaUsuario(userId, 1)
        })
      }
      const editEvent = () => {
        stateManage.toggleForm(true)
        stateManage.toggleEditing(true)
        stateManage.setEmail(fullRow.email)
        const roles = JSON.parse(fullRow.roles) || []
        if (roles.length > 0) {
          stateManage.setRoleId({
            label: roles[0].rolNombre,
            value: roles[0].rolId
          })
        }
      }
      const resetPasswordEvent = () => {
        questionAlert({
          dangerMode: true,
          icon: 'warning',
          msg: '¿Desea restaurar la contraseña de este usuario?',
          title: 'Gestión de Usuarios'
        }).then((response) => {
          if (response == true) resetContrasenia(userId)
        })
      }
      return (
        <ActionsButtonsComponent
          DeleteEvent={deleteEvent}
          EditEvent={editEvent}
          LockEvent={lockEvent}
          UnlockEvent={unlockEvent}
          ResetPasswordEvent={resetPasswordEvent}
          isActive={isActive}
          UserId={userId}
        />
      )
    }
    fetchFullRolInfoByUsuarioId(usuarioId).then((response) => {
      const { data } = response
      const roles = JSON.parse(data.roles || '[]')
      const rolesComponents = roles.map((i, index) =>
        buildColumnRol(index, i.rolNombre, i.color, data, null)
      )
      const instituciones = JSON.parse(data.instituciones) || []
      const institucionesComponents = instituciones.map((i, index) =>
        buildColumnInstituciones(index, i.institucionNombre)
      )
      data.rol = <>{rolesComponents}</>
      data.institucion = <>{institucionesComponents}</>
      data.acciones = buildActionColumn(usuarioId, data.activo, data)
      stateManage.setFilas([data])
    })
  }
  const loadUserInterface = () => {
    const usuarioId = reduxState.identification.data.usuarioId
    if (usuarioId) {
      loadRolesActivos(usuarioId)
      stateManage.setHasUser(true)
      loadGridRows(usuarioId)
      // stateManage.toggleForm(true)
    } else {
      stateManage.setHasUser(false)
      // stateManage.toggleForm(false)
    }
    actions.getRolesByTipo(TIPO_ROL_ESTUDIANTE).then((response) => {
      const { data } = response
      const roles = data.map((i) => {
        return {
          label: i.nombre,
          value: i.id
        }
      })
      stateManage.setRolesOptions(roles)
      stateManage.setRoleId(roles[0])
    })

    const identidadId = reduxState.identification.data.id
    const identificacion = reduxState.identification.data.identificacion
    const tipoId = reduxState.identification.data.datos.find(
      (i) => i.catalogoId == 1
    ).elementoId
    const nombre = `${reduxState.identification.data.nombre} ${reduxState.identification.data.primerApellido} ${reduxState.identification.data.segundoApellido}`
    const email = reduxState.identification.data.email
    stateManage.setFullName(nombre)
    stateManage.setIdentificacion(identificacion)
    stateManage.setTipoIdentificacion(
      defaultTipoIdentificacion.find((i) => i.value == tipoId)
    )
    stateManage.setEmail(email)
    stateManage.setIdentidadId(identidadId)
  }
  const errorMessage = (msg: string) => {
    setSnackbarData({ variant: 'error', msg })
    handleClick()
  }
  const successMessage = (msg: string) => {
    setSnackbarData({ variant: 'success', msg })
    handleClick()
  }
  useEffect(() => {
    loadUserInterface()
  }, [])

  const TableData = useMemo(() => {
    const columns = [
      {
        Header: 'Identificación',
        column: 'identificacion',
        accessor: 'identificacion',
        label: ''
      },
      {
        Header: 'Nombre completo',
        column: 'nombre',
        accessor: 'nombreCompleto',
        label: ''
      },
      {
        Header: 'Correo electrónico',
        column: 'correo',
        accessor: 'email',
        label: ''
      },
      {
        Header: 'Último inicio de sesión',
        column: 'sesion',
        accessor: 'ultimoInicioSesion',
        label: '',
        Cell: ({ _, row, data }) => {
          const fullRow = data[row.index]
          return <>{convertDate(fullRow.ultimoInicioSesion)}</>
        }
      },
      {
        Header: 'Rol(es)',
        column: 'rol',
        accessor: 'rol',
        label: ''
      },
      {
        Header: 'Centro educativo',
        column: 'institucion',
        accessor: 'institucion',
        label: ''
      },
      {
        Header: 'Estado',
        column: 'activo',
        accessor: 'activo',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          if (fullRow.estado) return <>Activo</>
          else return <>Inactivo</>
        }
      },
      {
        Header: 'Acciones',
        column: 'acciones',
        accessor: 'acciones',
        label: ''
      }
    ]

    return { columns }
  }, [])
  const onChangeInputEmail = (e) => {
    e.preventDefault()
    stateManage.setEmail(e.target.value)
  }
  const onChangeInputRol = (e) => {
    stateManage.setRoleId(e)
  }
  const onCrearCuentaSABERevent = (e) => {
    e.preventDefault()
    stateManage.toggleForm(true)
    stateManage.toggleEditing(true)
  }
  const onCrearUsuarioEvent = (e) => {
    e.preventDefault()
    if (!state.email) return
    if (
      !reduxState.currentInstitution?.id ||
			reduxState.currentInstitution.id == -1
    ) {
      errorMessage('No se ha seleccionado una centro educativo')
      return
    }

    createUsuario(
      state.email,
      state.identidadId,
      state.identificacion,
      reduxState.currentInstitution.id,
      state.roleId.value
    )
      .then((response: any) => {
        if (response.mensajeError) { throw new Error(response.mensajeError) }
        successMessage('Usuario creado correctamente')
        loadGridRows(response.id)
        stateManage.setHasUser(true)
        onRegresarEvent()
      })
      .catch((e) => {
        errorMessage('Error al crear el usuario ' + e.message)
      })
  }
  const onActualizarUsuarioEvent = (e) => {
    e.preventDefault()
    /* if (
			!reduxState.currentInstitution.id ||
			reduxState.currentInstitution.id == -1
		)
			return */
    updateUsuario(
      state.email,
      state.roleId.value,
      reduxState.identification.data.usuarioId,
      reduxState.currentInstitution.id
    )
      .then((response: any) => {
        successMessage('Usuario actualizado correctamente')
        loadGridRows(response.id)
        onRegresarEvent()
      })
      .catch((e) => {
        errorMessage('Error al actualizar el usuario')
      })
  }
  const onRegresarEvent = () => {
    stateManage.toggleForm(false)
    stateManage.toggleEditing(false)
  }
  return (
    <>
      {snackbar(snackbarData.variant, snackbarData.msg)}
      {!state.hasUser && !state.showForm && (
        <div>
          <h4>Cuentas de SABER</h4>
          <Card>
            <CardBody>
              <span>
                {' '}
                Aún no se ha creado una cuenta de SABER para el
                estudiante seleccionado, puede crearla dando
                click en el botón de "Crear cuenta de SABER"
              </span>
              <br />
              <Button
                style={{ marginTop: 20 }}
                color='primary'
                className='mr-3'
                onClick={onCrearCuentaSABERevent}
              >
                Crear cuenta de SABER}
              </Button>
            </CardBody>
          </Card>
        </div>
      )}
      {state.showForm && (
        <Row>
          <Col xs='6'>
            <div style={{ display: 'flex' }}>
              <ArrowBackIosIcon
                style={{ cursor: 'pointer' }}
                onClick={onRegresarEvent}
              />
              <h3
                style={{ cursor: 'pointer' }}
                onClick={onRegresarEvent}
              >
                Regresar
              </h3>
            </div>
            <h4 style={{ marginTop: 20 }}>Crear cuenta de SABER</h4>
            <Card>
              <CardBody>
                <div style={{ marginBottom: 20 }}>
                  <CardTitle style={{ marginBottom: 0 }}>
                    Buscar personas
									</CardTitle>
                  <span>
                    Busca la persona a la cual se le creará
                    el usuario. Si no está registrada podrás
                    registrarla.
									</span>
                </div>
                <Form>
                  <Row>
                    <Col sm='12'>
                    <FormGroup>
                    <Label>
                    {' '}
                    Tipo de identificación{' '}
                  </Label>
                    <Select
                    isDisabled
                    placeholder=''
                    className='react-select'
                    classNamePrefix='react-select'
                    noOptionsMessage={() =>
													  'Sin opciones'}
                    components={{
													  Input: CustomSelectInput
                  }}
                    options={
														defaultTipoIdentificacion
													}
                    value={state.tipoId}
                  />
                  </FormGroup>
                  </Col>
                    <Col sm='12'>
                    <FormGroup>
                    <Label>
                    {' '}
                    Número de identificación
												</Label>
                    <Input
                    disabled
                    value={state.identificacion}
                  />
                  </FormGroup>
                  </Col>
                    <Col sm='12'>
                    <Label>Persona encontrada</Label>
                    <UserPicAndName
                    fullname={state.fullName}
                  />
                  </Col>
                    <Col sm='12'>
                    <FormGroup>
                    <Label
                    style={{
													  marginTop: 15
                  }}
                  >
                    {' '}
                    Correo electrónico
												</Label>
                    <Input
                    value={state.email}
                    onChange={
														onChangeInputEmail
													}
                    disabled={!state.isEditing}
                  />
                  </FormGroup>
                  </Col>
                    <Col sm='12'>
                    <FormGroup>
                    <Label>Rol</Label>
                    <Select
                    placeholder=''
                    components={{
													  Input: CustomSelectInput
                  }}
                    className='react-select'
                    classNamePrefix='react-select'
                    value={state.roleId}
                    onChange={onChangeInputRol}
                    options={state.rolesOptions}
                    isDisabled={
														!state.isEditing
													}
                    noOptionsMessage={() =>
													  'No hay opciones'}
                  />
                  </FormGroup>
                  </Col>
                  </Row>
                </Form>
                {!state.hasUser
                  ? (
                    <div
                    style={{
										  display: 'flex',
										  justifyContent: 'center',
										  gap: '15px'
                  }}
                  >
                    <Button
                    onClick={() => {
											  stateManage.toggleForm(false)
                  }}
                    outline
                  >
      Cancelar
                  </Button>
                    <Button
                    onClick={onCrearUsuarioEvent}
                    color='primary'
                  >
      Crear Usuario
                  </Button>
                  </div>
                    )
                  : (
                    <div
                    style={{
										  display: 'flex',
										  justifyContent: 'center',
										  gap: '15px'
                  }}
                  >
                    <Button
                    onClick={onRegresarEvent}
                    outline
                  >
      Cancelar
                  </Button>
                    <Button
                    onClick={onActualizarUsuarioEvent}
                    color='primary'
                  >
      Guardar usuario
                  </Button>
                  </div>
                    )}
              </CardBody>
            </Card>
          </Col>
          <Col xs='6' style={{ marginTop: 70 }}>
            <h4> </h4>
            <Card
              style={{
							  minHeight: '35rem',
							  maxHeight: '100%'
              }}
            >
              <CardBody>
                <CardTitle>Roles activos</CardTitle>
                <div
                  style={{
									  height: '10.5rem',
									  overflowY: 'auto'
                  }}
                >
                  <table>
                    <thead
                    style={{
											  background: '#145388',
											  color: 'white'
                  }}
                  >
                    <tr>
                    <th
                    style={{
													  borderTopLeftRadius:
															'3px',
													  width: '20rem',
													  height: '2.5rem',
													  textAlign: 'center',
													  borderRight:
															'1px solid lightgrey'
                  }}
                  >
  Rol
                  </th>
                    <th
                    style={{
													  borderTopRightRadius:
															'3px',
													  width: '50rem',
													  textAlign: 'center',
													  height: '2.5rem'
                  }}
                  >
  Centro educativo
                  </th>
                  </tr>
                  </thead>
                    <tbody>
                    {state.rolesActivos.map((item) => {
											  return (
  <tr>
    <td
      style={{
															  height: '2.5rem',
															  textAlign:
																	'center',
															  border: '1px solid lightgrey'
      }}
    >
      {item.rolNombre}
    </td>
    <td
      style={{
															  height: '2.5rem',
															  textAlign:
																	'center',
															  border: '1px solid lightgrey'
      }}
    >
      {
																item.nombreInstitucion
															}
    </td>
  </tr>
											  )
                  })}
                  </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {state.hasUser && !state.showForm && !state.isEditing
        ? (
          <div>
            <h4>Cuentas de SABER</h4>
            <TableReactImplementation
              data={state.filas}
              handleGetData={() => {}}
              columns={TableData.columns}
              orderOptions={[]}
              avoidSearch
            />
          </div>
          )
        : null}
      <div style={{ height: '5rem' }} />
      <SimpleModal
        openDialog={modal}
        onClose={closeModal}
        onConfirm={() => {
				  closeModal()
				  setEdit('create-user')
        }}
        txtBtn='Continuar'
        msg='Se ha creado el usuario con éxito'
        title='Crear usuario'
        btnCancel={false}
      />
    </>
  )
}

export default CuentaSaber
