import React, { useState, useEffect } from 'react'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { Helmet } from 'react-helmet'
import { Container } from 'reactstrap'
import HeaderTab from 'components/Tab/Header'
import styled from 'styled-components'
import GestorTable from './GestorTable'
import { Edit, Delete, Lock } from '@material-ui/icons'
import { Tooltip } from '@material-ui/core'
import colors from 'Assets/js/colors'
import swal from 'sweetalert'
import { useSelector } from 'react-redux'
import {
  getAllUsuarioCatalogosByRolId,
  editUser,
  resetPassword,
  removeUser,
  updateActivaInactivaUsuario
} from 'Redux/UsuarioCatalogos/actions'
import { getCatalogs } from 'Redux/identificacion/actions'
import { useActions } from 'Hooks/useActions'
import search from 'Utils/search'
import moment from 'moment'
import useNotification from 'Hooks/useNotification'
import { useTranslation } from 'react-i18next'
import { FaUserLock, FaUserCheck } from 'react-icons/fa'

const roles = [
  {
    id: 2,
    nombre: 'DIRECTOR',
    nivelAccessoId: 1
  },
  {
    id: 5,
    nombre: 'SUPERVISOR CIRCUITAL',
    nivelAccessoId: 2
  },
  {
    id: 6,
    nombre: 'DIRECTOR REGIONAL',
    nivelAccessoId: 3
  },
  {
    id: 3,
    nombre: 'GESTOR RECTOR',
    nivelAccessoId: 4
  },
  {
    id: 7,
    nombre: 'GESTOR CONSULTA',
    nivelAccessoId: 4
  },
  {
    id: 4,
    nombre: 'GESTOR APOYO',
    nivelAccessoId: 4
  },
  {
    id: 1,
    nombre: 'ADMIN',
    nivelAccessoId: 4
  }
]

const GestorUsuarios = (props) => {
  const { t } = useTranslation()
  const { accessRole } = useSelector((state:any) => state.authUser.currentRoleOrganizacion)
  const { usuarios, loading } = useSelector((state:any) => state.usuarioCatalogos)
  const [users, setUsers] = useState(usuarios)
  const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props

  let optionsTab: Array<string> = [
    t('gestion_usuarios>directores','Directores'),
    t('gestion_usuarios>supervisores_circuito','Supervisores de circuito'),
    t('gestion_usuarios>directores_regionales','Directores regionales'),
    t('gestion_usuarios>gestores_rectores','Gestores rectores'),
    t('gestion_usuarios>gestores_consulta','Gestores consulta'),
    t('gestion_usuarios>gestores_apoyo','Gestores apoyo'),
    t('gestion_usuarios>administradores','Administradores')
  ]

  if (accessRole?.rolId != 1 && accessRole?.rolId != 19) {
    optionsTab = [
      t('gestion_usuarios>directores','Directores'),
      t('gestion_usuarios>supervisores_circuito','Supervisores de circuito'),
      t('gestion_usuarios>directores_regionales','Directores regionales')
    ]
  }

  const [items, setItems] = useState<Array<{
    nombreUsuario: string;
    identificacion: string;
    nombreCompleto: string;
    email: string;
    ultimoInicioSesion: string;
    instituciones: string;
    regionales: string;
    circuitos: string;
    nivelAcceso: string;
  }>>([])

  const [activeTab, setActiveTab] = useState(0)
  const [openModal, setOpenModal] = useState<'' | 'add-user' | 'add-user-form' | 'edit-user-form' | 'register-person'>('')
  const [searchValue, setSearchValue] = useState('')
  const [snackbar, handleClickNotification] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({
    msg: '',
    variant: ''
  })

  const actions = useActions({
    getAllUsuarioCatalogosByRolId,
    getCatalogs,
    editUser,
    resetPassword,
    removeUser,
    updateActivaInactivaUsuario
  })

  useEffect(() => {
    if (searchValue === '') {
      actions.getAllUsuarioCatalogosByRolId(roles[activeTab]?.id, 1, 100, 'NULL')
    }
  }, [searchValue, activeTab])

  const onSearchKey = async (e) => {
    const { value } = e.target
    setSearchValue(value)
    const results = search(value).in(users[roles[activeTab]?.id]?.data || [], ['nombreUsuario', 'nombreCompleto', 'identificacion', 'email', 'ultimoInicioSesion', 'instituciones', 'regionales', 'circuitos', 'nivelAcceso'])
    setItems(results)
    if (results.length === 0) {
      actions.getAllUsuarioCatalogosByRolId(roles[activeTab]?.id, 1, 10, value || 'NULL')
    }
    if (value === '') {
      actions.getAllUsuarioCatalogosByRolId(roles[activeTab]?.id, 1, 10, 'NULL')
    }
  }

  useEffect(() => {
    setUsers(usuarios)
  }, [loading])

  useEffect(() => {
    setItems(users[roles[activeTab]?.id]?.data || [])
  }, [users, activeTab])

  useEffect(() => {
    actions.getCatalogs(1)
  }, [])

  const handleSearch = () => {
    actions.getAllUsuarioCatalogosByRolId(roles[activeTab]?.id, 1, 10, searchValue || 'NULL')
  }

  const [inputValues, setInputValues] = useState({
    numeroDeIdentificacion: null,
    usuarioEncontrado: null,
    nombreDeUsuario: null,
    email: null,
    password: null,
    passwordConfirm: null,
    instituciones: [],
    circuitos: [],
    regionales: [],
    userId: '',
    nombreCompleto: ''
  })

  const data = React.useMemo(() => (items.map((el) => ({
    ...el,
    acciones: true
  }))), [items,t])

  const options = {
    0: {
      Header: t('gestion_usuario>usuarios>directores>instituciones', 'Instituciones asociadas'),
      accessor: 'instituciones',
      Cell: ({ row }) => (
        <div>
          {row.original.instituciones?.map(el => el.nombre)?.join(', ')}
        </div>
      )
    },
    1: {
      Header: t('gestion_usuario>usuarios>supervisores_circuito>circuito', 'Circuitos asociados'),
      accessor: 'circuitos',
      Cell: ({ row }) => (
        <div>
          {row.original.circuitos?.map(el => el.nombre)?.join(', ')}
        </div>
      )
    },
    2: {
      Header: t('gestion_usuario>usuarios>directores_regionales>regionales', 'Regiones asociadas'),
      accessor: 'regionales',
      Cell: ({ row }) => (
        <div>
          {row.original.regionales?.map(el => el.nombre)?.join(', ')}
        </div>
      )
    },
    3: {
      Header: t('gestion_usuario>usuarios>gestores_rectores>rol', 'Rol asociado'),
      accessor: 'rolAsignadoNombre'
    },
    4: {
      Header: t('gestion_usuario>usuarios>gestores_consulta>rol', 'Rol asociado'),
      accessor: 'rolAsignadoNombre'
    },
    5: {
      Header: t('gestion_usuario>usuarios>gestores_apoyo>rol', 'Rol asociado'),
      accessor: 'rolAsignadoNombre'
    },
    6: {
      Header: t('gestion_usuario>usuarios>administradores>rol', 'Rol asociado'),
      accessor: 'rolAsignadoNombre'
    }
  }

  const columns = React.useMemo(() => [
    {
      Header: t('gestion_usuario>usuarios>nombre_usuario', 'Nombre de usuario'),
      accessor: 'nombreUsuario'
    },
    {
      Header: t('gestion_usuario>usuarios>identificacion', 'Identificación'),
      accessor: 'identificacion'
    },
    {
      Header: t('gestion_usuario>usuarios>nombre_completo', 'Nombre Completo'),
      accessor: 'nombreCompleto'
    },
    {
      Header: t('gestion_usuario>usuarios>correo_electronico', 'Correo electrónico'),
      accessor: 'email'
    },
    {
      Header: t('gestion_usuario>usuarios>ultimo_inicio', 'Último inicio de sesión'),
      accessor: 'ultimoInicioSesion',
      Cell: ({ row }) => (

        <div>
          {
      row.original?.ultimoInicioSesion.indexOf('0001-01-01T00') != -1 ? 'No ha iniciado sesión' : moment(row.original?.ultimoInicioSesion).format('DD/MM/yyyy HH:mm A')

          }
        </div>
      )
    },
    {
      ...options[activeTab]
    },
    {
      Header: t('gestion_usuario>usuarios>acciones', 'Acciones'),
      accessor: 'acciones',
      Cell: ({ row }) => {
        if (row.original.acciones) {
          return (
            <div className='d-flex justify-content-center align-items-center'>
              {
                hasEditAccess && (
                  <>
                    {
                    row.original.activo
                      ? (
                        <>
                          <FaUserCheck
                            style={{ cursor: 'pointer', color: colors.darkGray }}
                            className='mr-2'
                            title={t("configuracion>centro_educativo>ver_centro_educativo>asignar_director>hover>bloquear_usuario", "Bloquear usuario")}
                            size={24}
                            onClick={async (e) => {
                              swal({
                                title: t("configuracion>centro_educativo>ver_centro_educativo>asignar_director>hover>bloquear_usuario", "Bloquear usuario"),
                                text: t('general>msj_bloquear_usuario','¿Está seguro que desea bloquear el usuario?'),
                                icon: 'warning',
                                className: 'text-alert-modal',
                                buttons: {
                                  cancel: t("boton>general>cancelar", "Cancelar"),
                                  ok: {
                                    text: t("boton>general>si_seguro", "Sí, seguro"),
                                    value: true,
                                    className: 'btn-alert-color'
                                  }
                                }
                              }).then(async (res) => {
                                if (res) {
                                  const response = await actions.updateActivaInactivaUsuario(row.original.id, 0)
                                  actions.getAllUsuarioCatalogosByRolId(roles[activeTab]?.id, 1, 100, 'NULL')
                                  if (!response.error) {
                                    setSnackbarContent({
                                      variant: 'success',
                                      msg: t("configuracion>centro_educativo>ver_centro_educativo>asignar_director>bloquear_usuario>usuario_bloqueado_correctamente", "Usuario bloqueado correctamente")
                                    })
                                    handleClickNotification()
                                  } else {
                                    setSnackbarContent({
                                      variant: 'error',
                                      msg: response.mensajeError
                                    })
                                    handleClickNotification()
                                  }
                                }
                              })
                            }}
                          />
                        </>
                        )
                      : (
                        <>
                          <FaUserLock
                            style={{ cursor: 'pointer', color: colors.darkGray }}
                            title={t("configuracion>centro_educativo>ver_centro_educativo>asignar_director>hover>desbloquear_usuario", "Desbloquear usuario")}
                            className='mr-2'
                            size={24}
                            onClick={async (e) => {
                              swal({
                                title: t("configuracion>centro_educativo>ver_centro_educativo>asignar_director>hover>desbloquear_usuario", "Desbloquear usuario"),
                                text: t('general>msj_desbloquear_usuario','¿Está seguro que desea desbloquear el usuario?'),
                                icon: 'warning',
                                className: 'text-alert-modal',
                                buttons: {
                                  cancel: t("boton>general>cancelar", "Cancelar"),
                                  ok: {
                                    text: t("boton>general>si_seguro", "Sí, seguro"),
                                    value: true,
                                    className: 'btn-alert-color'
                                  }
                                }
                              }).then(async (res) => {
                                if (res) {
                                  const response = await actions.updateActivaInactivaUsuario(row.original.id, 1)
                                  actions.getAllUsuarioCatalogosByRolId(roles[activeTab]?.id, 1, 100, 'NULL')
                                  if (!response.error) {
                                    setSnackbarContent({
                                      variant: 'success',
                                      msg: t("configuracion>centro_educativo>ver_centro_educativo>asignar_director>desbloquear_usuario>usuario_desbloqueado_correctamente", "Usuario desbloqueado correctamente")
                                    })
                                    handleClickNotification()
                                  } else {
                                    setSnackbarContent({
                                      variant: 'error',
                                      msg: response.mensajeError
                                    })
                                    handleClickNotification()
                                  }
                                }
                              })
                            }}
                          />
                        </>
                        )
                  }
                    <Tooltip title={t("estudiantes>buscador_per>info_cuenta>restaurar_contrasena", "Resetear contraseña")}>
                      <Lock
                        className='mr-2'
                        style={{ cursor: 'pointer', color: colors.darkGray }}
                        onClick={() => {
                          swal({
                            title: t("estudiantes>buscador_per>info_cuenta>restaurar_contrasena", "Resetear contraseña"),
                            text: t('general>msj_resetear_contraseña','¿Está seguro que desea resetear la contraseña?'),
                            icon: 'warning',
                            className: 'text-alert-modal',
                            buttons: {
                              cancel: t("boton>general>cancelar", "Cancelar"),
                              ok: {
                                text: t("boton>general>si_seguro", "Sí, seguro"),
                                value: true,
                                className: 'btn-alert-color'
                              }
                            }
                          }).then(async (res) => {
                            if (res) {
                              const response = await actions.resetPassword(row.original.id)
                              if (!response.error) {
                                setSnackbarContent({
                                  variant: 'success',
                                  msg: t('general>msj_reseteado','Se ha reseteado exitosamente su contraseña')
                                })
                                handleClickNotification()
                              } else {
                                setSnackbarContent({
                                  variant: 'error',
                                  msg: response.mensajeError
                                })
                                handleClickNotification()
                              }
                            }
                          })
                        }}
                      />
                    </Tooltip>
                    <Tooltip title={t("boton>general>editar", "Editar")}>
                      <Edit
                        className='mr-2'
                        style={{ cursor: 'pointer', color: colors.darkGray }}
                        onClick={() => {
                          setOpenModal('edit-user-form')
                          setInputValues({
                            ...inputValues,
                            numeroDeIdentificacion: row.original.cedula,
                            usuarioEncontrado: true,
                            nombreDeUsuario: row.original.nombreUsuario,
                            email: row.original.email,
                            instituciones: row.original?.instituciones ? row.original?.instituciones : null,
                            circuitos: row.original?.circuitos ? row.original?.circuitos : null,
                            regionales: row.original?.regionales ? row.original?.regionales : null,
                            userId: row.original.id,
                            nombreCompleto: row.original.nombreCompleto
                          })
                        }}
                      />
                    </Tooltip>
                  </>
                )
              }
              {
                hasDeleteAccess && (
                  <Tooltip title={t("boton>general>eliminar", "Eliminar")}>
                    <Delete
                      style={{ cursor: 'pointer', color: colors.darkGray }}
                      onClick={() => {
                        swal({
                          title: t('general>modal>eliminar_usuario','Eliminar usuario'),
                          text: t('general>msj_eliminar_usuario','¿Estás seguro de que deseas eliminar el usuario?'),
                          icon: 'warning',
                          className: 'text-alert-modal',
                          buttons: {
                            cancel: t("boton>general>cancelar", "Cancelar"),
                            ok: {
                              text: t("boton>general>si_seguro", "Sí, seguro"),
                              value: true,
                              className: 'btn-alert-color'
                            }
                          }
                        }).then(async (res) => {
                          if (res) {
                            const response = {
                              error: false
                            }

                            actions.removeUser(row.original.id).then(r => {
                              if (!r.error) {
                                setSnackbarContent({
                                  variant: 'success',
                                  msg: t('general>msj_eliminado','Se ha eliminado exitosamente el usuario')
                                })
                                handleClickNotification()
                                actions.getAllUsuarioCatalogosByRolId(roles[activeTab]?.id, 1, 100, 'NULL')
                              }
                            })
                          }
                        })
                      }}
                    />
                  </Tooltip>
                )
              }
            </div>
          )
        }
      }
    }
  ], [activeTab,t])

  return (
    <AppLayout items={directorItems}>
      <Helmet>
        <title>Gestión de usuarios</title>
      </Helmet>
      <Container>
        {snackbar(snackbarContent.variant, snackbarContent.msg)}
        <TitleBread>{t("gestion_usuario>usuarios>title_gestion_usuarios", "Gestión de Usuarios")}</TitleBread>
        <h3 className='mt-5 mb-3'>{t("gestion_usuario>usuarios>subtitle_usuarios", "Usuarios")}</h3>
        <HeaderTab
          options={optionsTab}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <GestorTable
          hasAddAccess={hasAddAccess}
          columns={columns}
          data={data}
          openModal={openModal}
          setOpenModal={setOpenModal}
          inputValues={inputValues}
          setInputValues={setInputValues}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleSearch={handleSearch}
          onSearchKey={onSearchKey}
          rol={roles[activeTab]}
        />
      </Container>
    </AppLayout>
  )
}

const TitleBread = styled.h2`
    color: #000;
    margin-bottom: 15px;
`

export default GestorUsuarios
