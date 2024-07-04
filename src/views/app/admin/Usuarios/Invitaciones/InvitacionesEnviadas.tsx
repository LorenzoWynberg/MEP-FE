import React from 'react'
import { useSelector } from 'react-redux'
import {
  GetInvitaciones,
  GetInvitacionesFiltro,
  UpdateInvitacion,
  DeleteInvitation,
  ResendInvitation,
  CreateInvitation
} from '../../../../../redux/Admin/Invitaciones/actions.ts'
import useNotification from '../../../../../hooks/useNotification'
import { useActions } from '../../../../../hooks/useActions'
import { intersection } from 'lodash'

import Tabla from './TablaInvitaciones.tsx'

import ModalAgregarInvitacion from './ModalAgregarInvitacion.tsx'
import ModalActualizarInvitacion from './ModalActualizarInvitacion.tsx'

type InvitacionesProps = {}

interface InvitacionesReduxState {
  invitaciones: any
  loading: boolean
  handleSearch: Function
  handlePagination: Function
  totalRegistros: number
}

enum SnackbarVariants {
  Error = 'error',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
}

interface SnackbarConfig {
  variant: SnackbarVariants
  msg: string
}

const InvitacionesEnviadas: React.FC<InvitacionesProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [requesting, setRequesting] = React.useState<boolean>(false)
  const [editModal, setEditModal] = React.useState<boolean>(false)
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false)
  const [currentInvitation, setCurrentInvitation] = React.useState<object>(null)
  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
    variant: SnackbarVariants.Error,
    msg: ''
  })
  const [errorsValidation, setErrosValidation] = React.useState<object>(null)
  const [data, setData] = React.useState<Array<string>>([])
  const [keysErrors, setKeysErros] = React.useState<Array<string>>([])
  const [globalError, setGlobalError] = React.useState<string>('')

  const showsnackBar = (variant, msg) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const state: InvitacionesReduxState = useSelector((store) => {
    return {
      invitaciones: store.adminInvitaciones
    }
  })

  const actions = useActions({
    GetInvitaciones,
    CreateInvitation,
    GetInvitacionesFiltro,
    UpdateInvitacion,
    DeleteInvitation,
    ResendInvitation
  })

  const handlePagination = async (pagina, cantidadPagina) => {
    await GetInvitaciones({ pagina, cantidad: cantidadPagina })
  }

  const handleSearch = async (filterText, cantidadPagina, pagina) => {
    return await actions.GetInvitacionesFiltro({
      pagina,
      cantidad: cantidadPagina,
      searchTerm: filterText
    })
  }

  const handleDeleteMultipleInvitations = (invitationIds: string[]) => {
    invitationIds.forEach(async (invitation) => {
      const { error } = await actions.DeleteInvitation(invitation)
      if (error) {
        showsnackBar('error', 'Algo ha salido mal, Por favor intentelo luego')
      } else {
        showsnackBar('success', 'Invitaciones eliminadas correctamente')
      }
    })
  }

  const handleResendMultipleInvitations = (emails: string[]) => {
    emails.forEach(async (email) => {
      const { error } = await actions.ResendInvitation(email)
      if (error) {
        showsnackBar('error', 'Algo ha salido mal, Por favor intentelo luego')
      } else {
        showsnackBar('success', 'Invitaciones enviadas correctamente')
      }
    })
  }

  const handleViewInvitation = (item: any) => {
    setCurrentInvitation(item)
    setEditModal(!editModal)
  }

  const handleDeleteInvitation = async (invitacionId: number) => {
    try {
      setLoading(true)
      await actions.DeleteInvitation(invitacionId)
      setLoading(false)
      showsnackBar('success', 'Invitación eliminada correctamente')
    } catch (error) {
      showsnackBar('error', 'Algo ha salido mal, Por favor intentelo luego')
    }
  }

  const handleResendInvitation = async (email: string) => {
    try {
      setLoading(true)
      await actions.ResendInvitation(email)
      setLoading(false)
      showsnackBar('success', 'Invitación reenviada correctamente')
    } catch (error) {
      showsnackBar('error', 'Algo ha salido mal, Por favor intentelo luego')
    }
  }

  const handleCreateInvitationToggle = () => {}

  const handleModal = () => setVisibleModal(!visibleModal)

  const handleSubmit = async (data: any) => {
    try {
      const formData = {
        nombre: data.nombre,
        apellido: data.primerApellido,
        segundoApellido: data.segundoApellido,
        nacionalidadId: data.nationality.id,
        tipoIdentificacionId: data.type_identification.id,
        identificacion: data.identification,
        fechaNacimiento: data.fechaNacimiento,
        email: data.email
      }
      setRequesting(true)
      const res = await actions.CreateInvitation(formData)
      if (res.error) {
        setGlobalError(res.errors[''][0])
        setErrosValidation(res.errors)
        const errorKeys = Object.keys(res.errors)
        const step1Rule = [
          'TipoIdentificacionId',
          'Identificacion',
          'NacionalidadId',
          'Email',
          'FechaNacimiento',
          'Nombre',
          'Apellido',
          'SegundoApellido'
        ]
        const result = intersection(errorKeys, step1Rule)
        setKeysErros(errorKeys)
        setRequesting(false)
        showsnackBar('error', 'Algo ha salido mal, Por favor intentelo luego')
      } else {
        setRequesting(false)
        setVisibleModal(false)
        showsnackBar('success', 'Invitación creada correctamente')
      }
    } catch (error) {
      setRequesting(false)
      showsnackBar('error', 'Algo ha salido mal, Por favor intentelo luego')
    }
  }

  const handleUpdateInvitation = async (data: any, invitationId: string) => {
    try {
      const formData = {
        invitacionId: invitationId,
        nombre: data.nombre,
        apellido: data.primerApellido,
        segundoApellido: data.segundoApellido,
        nacionalidadId: data.nationality.id,
        tipoIdentificacionId: data.type_identification.id,
        identificacion: data.identification,
        fechaNacimiento: data.fechaNacimiento,
        email: data.email
      }
      setRequesting(true)
      const res = await actions.UpdateInvitacion(formData)
      if (res.error) {
        setGlobalError(res.errors[''][0])
        setErrosValidation(res.errors)
        setRequesting(false)
        showsnackBar('error', 'Algo ha salido mal, Por favor intentelo luego')
      } else {
        setEditModal(false)
        showsnackBar('success', 'Invitación actualizada correctamente')
      }
    } catch (error) {
      showsnackBar('error', 'Algo ha salido mal, Por favor intentelo luego')
    }
  }

  return (
    <div>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <Tabla
        layout='circles'
        data={state.invitaciones.data}
        loading={loading}
        handlePagination={handlePagination}
        handleSearch={handleSearch}
        handleDeleteInvitation={handleDeleteInvitation}
        handleDeleteMultipleInvitations={handleDeleteMultipleInvitations}
        handleViewInvitation={handleViewInvitation}
        handleResendInvitation={handleResendInvitation}
        handleResendMultipleInvitation={handleResendMultipleInvitations}
        handleCreateInvitationToggle={handleCreateInvitationToggle}
        totalRegistros={state.totalRegistros}
        handleModal={handleModal}
      />
      <ModalAgregarInvitacion
        visible={visibleModal}
        globalError={globalError}
        errorsValidation={errorsValidation}
        keysErrors={keysErrors}
        title='Agregar nueva invitación'
        closeModal={handleModal}
        requesting={requesting}
        handleSubmit={handleSubmit}
      />
      {currentInvitation !== null
        ? (
          <ModalActualizarInvitacion
            title='Actualizar Invitacion'
            globalError={globalError}
            visible={editModal}
            currentInvitation={currentInvitation}
            handleSubmit={handleUpdateInvitation}
            closeModal={() => setEditModal(false)}
          />
          )
        : null}
    </div>
  )
}

export default InvitacionesEnviadas
