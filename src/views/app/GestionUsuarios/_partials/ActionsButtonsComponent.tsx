import React from 'react'
import { FaUserLock, FaUserCheck } from 'react-icons/fa'
import styled from 'styled-components'
import { Tooltip } from '@material-ui/core'
import { Edit, Delete, Lock } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
interface IProps {
	UserId: String | Number
	LockEvent: (userId, e) => void
	ResetPasswordEvent: (userId, e) => void
	EditEvent: (userId, e) => void
	DeleteEvent: (userId, e) => void
	UnlockEvent: (userId, e) => void
	isActive: boolean
}
const ICON_SIZE = '24px'
const ICON_STYLE = {
  cursor: 'pointer'
}
const ActionsButtonsComponent: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Contenedor>
      {props.isActive == true
        ? (
          <FaUserLock
            style={ICON_STYLE}
            size={ICON_SIZE}
            title={t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>hover>bloquear_usuario', 'Bloquear Usuario')}
            onClick={(e) => props.LockEvent(props.UserId, e)}
          />
          )
        : (
          <FaUserCheck 
            style={ICON_STYLE}
            size={ICON_SIZE}
            title={t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>hover>desbloquear_usuario', 'Desbloquear Usuario')}
            onClick={(e) => props.UnlockEvent(props.UserId, e)}
          />
          )}
      <Tooltip title={t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>hover>resetar_contrasena', 'Resetear contraseña')}>
        <Lock
          onClick={(e) => props.ResetPasswordEvent(props.UserId, e)}
        />
      </Tooltip>
      <Tooltip title={t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>hover>editar', 'Editar')}>
        <Edit
          onClick={(e) => props.EditEvent(props.UserId, e)}
        />
      </Tooltip>
      <Tooltip title={t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>hover>eliminar', 'Eliminar')}>
        <Delete
          onClick={(e) => props.DeleteEvent(props.UserId, e)}
        />
      </Tooltip>
    </Contenedor>
  )
}

const Contenedor = styled.div`
	color: #575757;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 5px;
`

export default ActionsButtonsComponent
