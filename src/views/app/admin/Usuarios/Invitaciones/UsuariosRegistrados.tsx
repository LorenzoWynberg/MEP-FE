import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useNotification from '../../../../../hooks/useNotification'
import Tabla from './Table.tsx'
import {
  getUsersByFilter,
  updateUser
} from '../../../../../redux/Admin/Usuarios/actions.ts'

import ModalActualizarUsuario from './ModalActualizarUsuario.tsx'

type UsuariosProps = {
	estudiantes: any
	cleanIdentity: any
	cleanAlertFilter: any
	buscador: any
	changeColumn: any
	changeFilterOption: any
	loadStudent: any
	history: any
	getAlertDataFilter: any
	match: any
}

type IState = {
	usuarios: any
}

type SnackbarConfig = {
	variant: string
	msg: string
}

const UsuariosRegistrados: React.FC<UsuariosProps> = (props) => {
  const [users, setUsers] = React.useState<Array<any>>([])
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false)
  const [requesting, setRequesting] = React.useState<boolean>(false)
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const [globalError, setGlobalError] = React.useState<string>('')
  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({ variant: '', msg: '' })
  const usuarios = useSelector((state: IState) => state.usuarios)
  const dispatch = useDispatch()

  const showsnackBar = (variant, msg) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  React.useEffect(() => {
    if (usuarios.users && usuarios.users.entityList) {
      setUsers(
        usuarios.users.entityList.map((item: any) => {
          if (item.datosAdicionalesJson == null) {
            return {
              ...item,
              nombreCompleto: `${item.nombre} ${item.apellido} ${item.segundoApellido}`,
              tipoIdentificacion: 'Incompleto',
              nacionalidad: 'Incompleto',
              estado: 'Inactivo',
              statusColor: 'danger'
            }
          } else {
            return {
              ...item,
              nombreCompleto: `${item.nombre} ${item.apellido} ${item.segundoApellido}`,
              tipoIdentificacion:
								item.datosAdicionalesJson[1].nombreElemento,
              nacionalidad:
								item.datosAdicionalesJson[0].nombreElemento,
              estado: item.estato ? 'Activo' : 'Inactivo',
              statusColor: item.estato ? 'primary' : 'danger'
            }
          }
        })
      )
    }
  }, [usuarios.users])

  const getDataFilter = async (filterText: string, filterType: string) => {
    await dispatch(getUsersByFilter(1, 10, filterText))
  }

  const onSelectRow = async (data: any) => {
    // await loadAlert(data);
    props.history.push('/director/expediente-estudiante/inicio')
  }

  const handlePagination = async () => {
    // await dispatch() props.GetSubsidiosMEP(data.id, pagina, cantidadPagina);
  }

  const handleSearch = async (
    filterText: string,
    cantidadPagina: number,
    pagina: number
  ) => {
    await dispatch(getUsersByFilter(pagina, cantidadPagina, filterText))
  }

  const handleEdit = (user: any) => {
    setCurrentUser(user)
    setVisibleModal(true)
  }

  const handleSubmit = async (data) => {
    try {
      const formData = {
        tipoIdentificacionId: data.type_identification.id,
        nacionalidadId: data.nationality.id,
        sexoId: data.sexo.id,
        identificacion: data.identification,
        nombre: data.nombre,
        apellido: data.primerApellido,
        segundoApellido: data.segundoApellido,
        usuarioId: currentUser.usuarioId,
        fechaNacimiento: data.fechaNacimiento
      }
      setRequesting(true)
      const res = await dispatch(updateUser(formData))

      if (res.error) {
        showsnackBar(
          'error',
          'Algo ha salido mal, Por favor intentelo luego'
        )
        setRequesting(false)
        setGlobalError(res.errors[''][0])
        setVisibleModal(true)
      } else {
        setRequesting(false)
        setCurrentUser(null)
        setVisibleModal(false)
        showsnackBar('success', 'Usuario actualizado correctamente')
      }
    } catch (error) {
      setRequesting(false)
      showsnackBar(
        'error',
        'Algo ha salido mal, Por favor intentelo luego'
      )
    }
  }

  const closeModal = () => {
    setCurrentUser(null)
    setVisibleModal(!visibleModal)
  }

  return (
    <div>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <Tabla
        layout='circles'
        handlePagination={handlePagination}
        handleSearch={handleSearch}
        totalRegistros={usuarios.users.totalPages}
        data={users}
        match={props.match}
        handleEdit={handleEdit}
      />
      {currentUser !== null
        ? (
          <ModalActualizarUsuario
            title='Actualizar Usuario'
            visible={visibleModal}
            usuario={currentUser}
            handleSubmit={handleSubmit}
            closeModal={closeModal}
            requesting={requesting}
            globalError={globalError}
          />
          )
        : null}
    </div>
  )
}

export default UsuariosRegistrados
