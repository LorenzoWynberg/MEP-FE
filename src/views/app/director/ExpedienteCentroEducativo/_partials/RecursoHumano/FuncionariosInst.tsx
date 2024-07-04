import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import VisibilityIcon from '@material-ui/icons/Visibility'
import Tooltip from '@mui/material/Tooltip'
import BookDisabled from 'Assets/icons/bookDisabled'
import colors from 'Assets/js/colors'
import Loader from 'Components/LoaderContainer'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import SimpleModal from 'Components/Modal/simple'
import ContentTab from 'Components/Tab/Content'
import HeaderTab from 'Components/Tab/Header'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  createFuncionario,
  deleteFuncionario,
  getFuncionarios,
  getFuncionariosByTipoIdAndId,
  getFuncionariosIdentificacion,
  getGetAllRolesProfesorByUsuarioId,
  getRolInfoByIdentificacion
} from '../../../../../../redux/RecursosHumanos/actions'

import WizardRegisterIdentityModal from '../../../../configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import FormUserComponent from './_partials/FormUserComponent'
import useFormComponent from './_partials/useFormComponent'
import Contacto from './EditarFuncionario/Contacto'
import CuentaCorreo from './EditarFuncionario/CuentaCorreo'
import General from './EditarFuncionario/General'
import Lecciones from './EditarFuncionario/Lecciones'
import PerfilesAsociados from './EditarFuncionario/PerfilesAsociados'
import { useTranslation } from 'react-i18next'

type SnackbarConfig = {
	variant: string
	msg: string
}

const FuncionariosInst = (props) => {
  const { t } = useTranslation()
  const state = useSelector((store: any) => {
    return {
      funcionarios: store.funcionarios.funcionarios,
      institution: store.authUser.currentInstitution,
      lstIdTypes: store.selects.idTypes
    }
  })

  const actions = useActions({
    deleteFuncionario,
    getFuncionarios,
    getFuncionariosIdentificacion,
    getFuncionariosByTipoIdAndId,
    createFuncionario,
    getRolInfoByIdentificacion,
    getGetAllRolesProfesorByUsuarioId
  })

  const [activeTab, setActiveTab] = useState(0)
  const [edit, setEdit] = useState(false)
  const [data, setData] = useState({})
  const [listData, setListData] = useState([])

  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const [enableModal, setEnableModal] = useState<boolean>(false)

  // Modal register
  const [registerServantModal, setRegisterServantModal] =
		useState<boolean>(false)
  const [registerIdentityModal, setRegisterIdentityModal] =
		useState<boolean>(false)

  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)

  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})

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
    clearState,
    showRegisterModal,
    rolesOptions,
    rolId,
    email,
    identidadId,
    loading: formLoading,
    onConfirmRegisterModalCallback
  } = useFormComponent()

  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }
  useEffect(() => {
    const fetch = async () => {
      setLoadingTable(true)
      await actions.getFuncionarios(state.institution.id)
      setLoadingTable(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    if (state.funcionarios) {
      const data = state.funcionarios.map((item) => {
        const arrRoles = item.roles ? JSON.parse(item.roles) : []
        const rolesStr = arrRoles.reduce((a, b, index, arr) => {
          if (index == 0 && arr.length > 1) { a = a + b.rolNombre + ' | ' } else a = a + b.rolNombre

          return a
        }, '')
        item.nombreCompleto =
					item.nombre +
					' ' +
					item.primerApellido +
					' ' +
					item.segundoApellido
        item.rol = rolesStr
        item.img = item.fotografiaUrl
        return item
      })
      setListData(data)
    }
  }, [state.funcionarios])

  const optionsTab = [
    t('configuracion>superviciones_circuitales>agregar>informacion_general', 'Información general'),
    t('configuracion>superviciones_circuitales>agregar>contacto', 'Contacto'),
    t('expediente_ce>recurso_humano>fun_ce>roles', 'Roles asociados'),
    t('expediente_ce>recurso_humano>fun_ce>lecciones', 'Lecciones'),
    t('expediente_ce>recurso_humano>fun_ce>cuenta_correo', 'Cuenta de correo')
  ]

  const toggleEdit = () => {
    setEdit(!edit)
  }

  const closeConfirmModal = () => {
    setConfirmModal(false)
  }
  const closeEnableModal = () => {
    setEnableModal(false)
  }

  const openMsj = () => {
    setConfirmModal(!confirmModal)
  }

  const handleLoadFuncionarios = async () => {
    setLoadingTable(true)
    await actions.getFuncionarios(state.institution.id)
    setLoadingTable(false)
  }

  const deleteFunc = async (obj) => {
    let response = null
    if (!obj.id) return
    response = await actions.deleteFuncionario(obj)
    if (!response.error) {
      handleLoadFuncionarios()
      setConfirmModal(false)
    }
  }

  const fetchRolInfo = async (identidad) => {
    const data = await actions.getRolInfoByIdentificacion(identidad)
    return data
  }

  const onCloseModalRegister = () => {
    setRegisterServantModal(false)
    clearState()
  }
  const onCloseModalIdentity = () => {
    setRegisterIdentityModal(false)
    setRegisterServantModal(false)
  }

  const enableServant = async () => {
    if (!encontrado) {
      showNotification('error', t('expediente_ce>recurso_humano>fun_ce>msj_ingresar_id', 'Debe ingresar una identificación'))
      return
    }
    if (!email || email == '') {
      showNotification('error', t('expediente_ce>recurso_humano>fun_ce>msj_ingresar_email_valido', 'Debe ingresar un email válido'))
      return
    }

    const _data = {
      estado: true,
      sb_institucionesId: state.institution.id,
      sb_identidadesId: identidadId, // servantFounded.id,
      email,
      rolId: rolId.value
    }

    const response = await actions.createFuncionario(_data)

    if (!response.error) {
      handleLoadFuncionarios()
      setConfirmModal(false)
      setEnableModal(false)
      setRegisterServantModal(false)
      setRegisterServantModal(false)
    } else {
      showNotification('error', response.error)
    }
  }
  const openRegisterIdentity = () => {
    setRegisterIdentityModal(true)
    setRegisterServantModal(false)
  }

  const onSaveIdentity = (person) => {
    if (person) {
      setRegisterIdentityModal(false)
      setEnableModal(true)
    }
  }

  const columns = useMemo(
    () => [
      {
        label: 'Nombre completo',
        column: 'nombreCompleto',
        Header: t('buscador_ce>ver_centro>datos_director>nombre', 'Nombre completo'),
        accessor: 'nombreCompleto'
      },
      {
        label: 'Identificación',
        column: 'identificacion',
        Header: t('buscador_ce>ver_centro>datos_director>identificacion', 'Identificación'),
        accessor: 'identificacion'
      },
      {
        label: 'Correo electrónico',
        column: 'email',
        Header: t('buscador_ce>ver_centro>datos_contacto>correo', 'Correo electrónico'),
        accessor: 'email'
      },
      {
        label: 'Rol(es)',
        column: 'rol',
        Header: t('estudiantes>buscador_per>info_gen>roles', 'Rol(es)'),
        accessor: 'rol'
      },
      {
        label: 'Acciones',
        column: 'actions',
        Header: t('general>acciones', 'Acciones'),
        accessor: 'actions',
        Cell: ({ row }) => {
          return (
            <>
              <div className='d-flex justify-content-center align-items-center'>
                <Tooltip title={t('general>ver', 'Ver')}>
                  <VisibilityIcon
                    style={{
										  cursor: 'pointer',
										  color: colors.darkGray
                    }}
                    onClick={() => {
										  setData(row.original)
										  toggleEdit()
                    }}
                  />
                </Tooltip>
                <Tooltip title={t('general>deshabilitar', 'Deshabilitar')}>
                  <button
                    style={{
										  cursor: 'pointer',
										  color: colors.darkGray,
										  border: 'none',
										  outline: 'none',
										  background: 'none'
                    }}
                    onClick={() => {
										  setData(row.original)
										  openMsj()
                    }}
                  >
                    <BookDisabled />
                  </button>
                </Tooltip>
              </div>
            </>
          )
        }
      }
    ],
    [t]
  )

  return (
    <>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      {(formLoading || loading) && <Loader />}
      <ConfirmModal
        openDialog={confirmModal}
        onClose={closeConfirmModal}
        onConfirm={() => {
				  deleteFunc(data)
        }}
        colorBtn='primary'
        msg={t('expediente_ce>recurso_humano>fun_ce>msj_seguro_deshabilitar', '¿Estás seguro que deseas deshabilitar el funcionario?')}
        title={t('expediente_ce>recurso_humano>fun_ce>desh_funcionario', 'Deshabilitar funcionario')}
      />
      {!edit && (
        <div style={{ marginTop: '10px' }}>
          <TableReactImplementation
            msjButton
            columns={columns}
            data={listData}
            showAddButton
            onSubmitAddButton={() => {
						  setRegisterServantModal(true)
            }}
          />
        </div>
      )}
      {edit && (
        <div>
          <div style={{ display: 'flex', marginTop: '5px' }}>
            <ArrowBackIosIcon
              onClick={toggleEdit}
              style={{ cursor: 'pointer' }}
            />
            <h3
              style={{ cursor: 'pointer' }}
              onClick={() => {
							  toggleEdit()
							  setData({})
							  setActiveTab(0)
              }}
            >
              {t('general>regresar', 'REGRESAR')}
            </h3>
          </div>
          <div className='div-conteiner'>
            <div className='horizontal-conteiner'>
              <div style={{ marginTop: '10px' }}>
                <h3>{t('general>editar', 'Editar')}</h3>
              </div>
            </div>
            <HeaderTab
              options={optionsTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <ContentTab activeTab={activeTab} numberId={activeTab}>
              {activeTab === 0 && (
                <General data={data} setLoading={setLoading} />
              )}
              {activeTab === 1 && <Contacto data={data} />}
              {activeTab === 2 && (
                <PerfilesAsociados setLoading={setLoading} />
              )}
              {activeTab === 3 && (
                <Lecciones funcionarioData={data} />
              )}
              {activeTab === 4 && (
                <CuentaCorreo funcionario={data} />
              )}
            </ContentTab>
          </div>
        </div>
      )}
      <SimpleModal
        openDialog={registerServantModal}
        onClose={onCloseModalRegister}
        onConfirm={notFound ? openRegisterIdentity : enableServant}
        colorBtnConfim='primary'
        txtBtn={notFound ? t('general>registrar', 'Registrar') : t('general>habilitar', 'Habilitar')}
        txtBtnCancel={t('general>regresar', 'Regresar')}
        title={t('expediente_ce>recurso_humano>fun_ce>reg_funcionario', 'Registrar funcionario')}
        stylesContent={{
				  minWidth: '30rem'
        }}
      >
        <>
          <FormUserComponent
            onChangeSelectTipoIdentificacion={
							onChangeSelectTipoIdentificacion
						}
            tipoIdentificacionOptions={tipoIdentificacionOptions}
            tipoIdentificacionValue={tipoIdentificacionId}
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
            rolOptions={rolesOptions}
            onChangeSelectRol={onChangeSelectRol}
            rolId={rolId}
            onConfirmRegisterModalCallback={
							onConfirmRegisterModalCallback
						}
          />
        </>
      </SimpleModal>
      <SimpleModal
        openDialog={registerIdentityModal}
        onClose={onCloseModalIdentity}
        actions={false}
        title='Registrar persona'
      >
        <>
          <WizardRegisterIdentityModal onConfirm={onSaveIdentity} />
        </>
      </SimpleModal>
      <ConfirmModal
        openDialog={enableModal}
        onClose={closeEnableModal}
        onConfirm={enableServant}
        txtBtn='Si, habilitar'
        colorBtn='primary'
        msg='¿Desea habilitar al funcionario en el centro educativo?'
        title='Habilitar funcionario'
      />
    </>
  )
}

export default FuncionariosInst
