import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  TableDirectoresAnteriores,
  useAsignarDirectores,
  TableDirectorActivo
} from './AsignarDirectorComponents'

import { ActionsButtonsComponent } from 'Components/UserCreateForm'
import useNotification from 'Hooks/useNotification'
import { useSelector } from 'react-redux'
import BarLoader from 'Components/barLoader/barLoader'
import { getDiffDates } from 'Utils/years'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const defaultTipoIdentificacion = [
  { value: 1, label: 'CÉDULA' },
  { value: 3, label: 'DIMEX' },
  { value: 4, label: 'YÍS RÖ - IDENTIFICACIÓN MEP' }
  
]



const defaultRoles = [{ value: 2, label: 'DIRECTOR' }]

const AsignarDirector = () => {
  const { t } = useTranslation()

  const [snackbar, handleClick] = useNotification()
  const successMessage = (msg) => {
    setSnackbarData({ variant: 'success', msg })
    handleClick()
  }

  const errorMessage = (msg) => {
    setSnackbarData({ variant: 'error', msg })
    handleClick()
  }

  const [snackbarData, setSnackbarData] = useState<any>({})

  const {
    fetchDirectorActual,
    fetchDirectoresAnteriores,
    updateActivaInactivaUsuario,
    questionAlert,
    resetContrasenia,
    deleteUsuario,
    state,
    stateManage,
    buildRolComponent
  } = useAsignarDirectores()

  const { currentInstitution } = useSelector((store: any) => {
    return {
      currentInstitution: store.configuracion.currentInstitution
    }
  })

  const loadGridInformation = (institucionId) => {
    const onResetPasswordEvent = (userId, e) => {
      e.preventDefault()
      questionAlert({
        dangerMode: true,
        icon: 'warning',
        msg: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>resetear_contrasena>mensaje', '¿Desea restaurar la contraseña de este usuario?'),
        title: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>resetear_contrasena>gestion_usuario', 'defaultValue')
      }).then((response) => {
        if (response == true) {
          resetContrasenia(userId)
            .then((r) => {
              successMessage(
                t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>resetear_contrasena>contrasena_restablecida', 'Se ha restablecido la contraseña del usuario')
              )
            })
            .catch((e) => {
              errorMessage(e.message)
            })
        }
      })
    }
    const onBloquearUsuarioEvent = (userId, e) => {
      e.preventDefault()
      questionAlert({
        dangerMode: true,
        icon: 'warning',
        msg: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>bloquear_usuario>mensaje', '¿Desea bloquear el usuario seleccionado?'),
        title: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>bloquear_usuario>gestion_usuarios', 'Gestión de Usuarios')
      }).then((response) => {
        if (response == true) {
          stateManage.toggleLoading(true)
          updateActivaInactivaUsuario(userId, 0)
            .then((_) => {
              loadGridInformation(currentInstitution.id)
              successMessage(t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>bloquear_usuario>usuario_bloqueado_correctamente', 'Usuario bloqueado correctamente'))
              stateManage.toggleLoading(false)
            })
            .catch((e) => {
              errorMessage(e.message)
              stateManage.toggleLoading(false)
            })
        }
      })
    }
    const onDesbloquearUsuarioEvent = (userId, e) => {
      e.preventDefault()
      questionAlert({
        dangerMode: true,
        icon: 'warning',
        msg: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>desbloquear_usuario>mensaje', '¿Desea desbloquear el usuario seleccionado?'),
        title: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>desbloquear_usuario>gestion_usuarios', 'Gestión de Usuarios')
      }).then((response) => {
        if (response == true) {
          stateManage.toggleLoading(true)
          updateActivaInactivaUsuario(userId, 1)
            .then((_) => {
              loadGridInformation(currentInstitution.id)
              successMessage(t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>desbloquear_usuario>usuario_desbloqueado_correctamente', 'Usuario desbloqueado correctamente'))
              stateManage.toggleLoading(false)
            })
            .catch((e) => {
              errorMessage(e.message)
              stateManage.toggleLoading(false)
            })
        }
      })
    }
    const onDeleteUsuarioEvent = (userId, e) => {
      e.preventDefault()
      questionAlert({
        dangerMode: true,
        icon: 'warning',
        msg: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>eliminar>mensaje', '¿Está seguro que desea eliminar el usuario seleccionado?'),
        title: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>eliminar>gestion_usuarios', 'Gestión de Usuarios')
      }).then((response) => {
        if (response == true) {
          stateManage.toggleLoading(true)
          deleteUsuario(userId)
            .then((_) => {
              loadGridInformation(currentInstitution.id)
              successMessage(t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>eliminar>usuario_eliminado_correctamente', 'Usuario eliminado correctamente'))
              stateManage.toggleLoading(false)
              loadGridInformation(currentInstitution.id)
            })
            .catch((e) => {
              errorMessage(e.message)
              stateManage.toggleLoading(false)
            })
        }
      })
    }

    stateManage.toggleLoading(true)
    fetchDirectorActual(institucionId).then((obj) => {
      stateManage.toggleLoading(false)

      if (!obj) {
        stateManage.setDirectorActivoRows([])
        return
      }

      obj.estado = obj.activo == true ? 'Activo' : 'Inactivo'
      obj.roles = buildRolComponent(1, obj.color, obj.rol, obj, null)
      obj.acciones = (
        <ActionsButtonsComponent
          UserId={obj.usuarioId}
          isActive={obj.activo}
          DeleteEvent={onDeleteUsuarioEvent}
          LockEvent={onBloquearUsuarioEvent}
          ResetPasswordEvent={onResetPasswordEvent}
          UnlockEvent={onDesbloquearUsuarioEvent}
        />
      )
      stateManage.setDirectorActivoRows([obj])
    })
    fetchDirectoresAnteriores(institucionId).then((directores) => {
      const rows = directores.map((director) => {
        if (!director) {
          stateManage.toggleLoading(false)
          return
        }
        const rolesArr = JSON.parse(director.roles)
        const rolComponents = rolesArr.map((r, index) => {
          return buildRolComponent(
            index,
            r.color,
            r.nombre,
            director,
            () => {
              alert('Hizo click en row')
            }
          )
        })
        const rige = moment(director.fechaInsercion).format(
          'DD/MM/YYYY'
        )
        const vence = moment(director.fechaActualizacion).format(
          'DD/MM/YYYY'
        )
        const tiempoFuncion = getDiffDates(rige, vence)
        return {
          ...director,
          rol: <>{rolComponents}</>,
          rige,
          vence,
          tiempoFuncion
        }
      })
      stateManage.setDirectoresInactivosRows(rows)
      stateManage.toggleLoading(false)
    })
  }

  React.useEffect(() => {
    if (!currentInstitution.id) return
    loadGridInformation(currentInstitution.id)
    const obj = {
      label: currentInstitution.nombre,
      value: currentInstitution.id
    }
    stateManage.setRol(defaultRoles[0])
  }, [currentInstitution.id])

  return (
    <>
      {snackbar(snackbarData.variant, snackbarData.msg)}
      {state.loading == true ? <BarLoader /> : ''}
      <Contenedor>
        <Card>
          <Label>{t("configuracion>centro_educativo>ver_centro_educativo>asignar_director>director_activo", "Director(a) activo(a)")}</Label>
          <TableDirectorActivo data={state.directorActivoRows} />
        </Card>
        <Card>
          <Label>{t("configuracion>centro_educativo>ver_centro_educativo>asignar_director>directores_anteriores", "Directores anteriores")}</Label>
          <TableDirectoresAnteriores
            data={state.directoresInactivosRows}
          />
        </Card>
      </Contenedor>
    </>
  )
}

const Label = styled.label`
	font-size: 1rem;
`

const Contenedor = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
`

const Card = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 15px;
	border-color: gray;
	background: white;
	padding: 15px;
	box-shadow: 0 0 10px 5px lightgrey;
`

export default AsignarDirector
