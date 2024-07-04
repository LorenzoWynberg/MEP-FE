import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import './general.css'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Row,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Col,
  Input
} from 'reactstrap'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { generatePassword } from 'Utils/utils'
import { useActions } from 'Hooks/useActions'
import {
  graphApi,
  getMotivos,
  getTemplatesModulo,
  updateIdentityEmail
} from 'Redux/office365/actions.js'
import { updateCuentaCorreoProfesorInstitucion } from 'Redux/ProfesoresInstitucion/actions'
import useNotification from 'Hooks/useNotification'
import {
  getFuncionarios
} from 'Redux/RecursosHumanos/actions'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Mustache from 'mustache'
import MensajeModal from '../../../../ExpedienteEstudiante/_partials/cuentaCorreo/MensajeModal.js'
import { getCatalogsByCode } from 'Redux/selects/actions.js'
import { useTranslation } from 'react-i18next'

const CuentaCorreo = ({ funcionario }) => {
  const { t } = useTranslation()
  const [inputValues, setInputValues] = useState({
    type: null,
    option: '',
    mail: ''
  })
  const [templates, setTemplates] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [emailOptions, setEmailOptions] = useState([])
  const [snackbar, handleClick] = useNotification()
  const [typeAction, setTypeAction] = useState<'' | 'asociar' | 'update' | 'create' | 'updateAccount' | 'resetPassword' | 'blockAccount' | 'activateAccount'>('')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [snackbarContent, setSnackbarContent] = useState({ msg: '', variant: '' })
  const { currentInstitution } = useSelector((state) => state.authUser)
  const [updateName, setUpdateName] = useState(false)
  const [bitacoraData, setBitacoraData] = useState([])
  const [confirmModalData, setConfirmModalData] = useState(null)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const { catalogos } = useSelector((state) => state.funcionarios)
  const [tipoCorreos, setTiposCorreos] = useState([])
  const [data, setData] = useState({
    id: null,
    displayName: '',
    userPrincipalName: '',
    accountEnabled: false
  })

  useEffect(() => {
    if (funcionario) {
      setEmailOptions([
        {
          value: `${funcionario?.nombre?.split(' ')[0]}.${funcionario?.primerApellido}${funcionario?.segundoApellido}@mep.go.cr`.toLowerCase(),
          id: 0
        },
        {
          value: `${funcionario?.nombre?.split(' ')[1] || funcionario?.nombre?.split(' ')[0]}.${funcionario?.primerApellido}${funcionario?.segundoApellido}@mep.go.cr`.toLowerCase(),
          id: 1
        },
        {
          value: `${funcionario?.nombre?.split(' ')[0]}1.${funcionario?.primerApellido}${funcionario?.segundoApellido}@mep.go.cr`.toLowerCase(),
          id: 2
        },
        {
          value: `${funcionario?.nombre?.split(' ')[1] || funcionario?.nombre?.split(' ')[0]}1.${funcionario?.primerApellido}${funcionario?.segundoApellido}@mep.go.cr`.toLowerCase(),
          id: 3
        }
      ])
    }
  }, [funcionario])
  const actions = useActions({
    graphApi,
    updateCuentaCorreoProfesorInstitucion,
    getFuncionarios,
    getTemplatesModulo,
    getCatalogsByCode
  })

  const getTipoCorreos = async () => {
    const res = await actions.getCatalogsByCode(45)
    setTiposCorreos(res?.data)
  }

  useEffect(() => {
    getTipoCorreos()
  }, [])

  const getBitacora = async () => {
    const _data = {
      accion: 'GetBitacora',
      identidadId: funcionario.identidadId,
      modulo: 'func'
    }

    const response = await actions.graphApi(_data)

    if (!response.error) {
      setBitacoraData(response.data)
    }
  }
  const GetUser = async (id) => {
    const _data = {
      username: id,
      accion: 'GetUser',
      modulo: 'func'
    }

    const response = await actions.graphApi(_data)
    if (!response.error) {
      const respJSON = response.data

      setData(respJSON)
    }
  }
  const getPlantillaTexto = (codigo) => {
    const _template = templates.find((x) => x.codigo === codigo)
    if (_template !== undefined) {
      return _template
    } else {
      return ''
    }
  }

  useEffect(() => {
    if (funcionario.identidadId > 0) {
      const fetchData = async () => {
        const respTemplates = await actions.getTemplatesModulo(3)
        if (!respTemplates.error) {
          setTemplates(respTemplates.data)

          const _plantilla = respTemplates.data.find(
            (x) => x.codigo === 'O365-TEXTO-NO-POSSEE-CUENTA'
          )
          if (_plantilla !== undefined) {
            const rendered = Mustache.render(_plantilla.plantilla_HTML, {
              identificacion: funcionario.identificacion
            })
            // setTextoNoCuenta(rendered)
          }
        }
      }

      fetchData()
    }
  }, [funcionario.identidadId])

  useEffect(() => {
    if (funcionario.identidadId) {
      const fetchData = async () => {
        await getBitacora()
      }

      // setIdCuentaOffice365(state.data.idCuentaOffice365)
      setData({ ...data, id: funcionario.idCuentaOffice365 })

      fetchData()
    } else {
      setData({
        id: null,
        displayName: '',
        userPrincipalName: '',
        accountEnabled: false
      })
    }
  }, [funcionario.identidadId])

  // AL ENTRAR A LA SECCIÓN CARGA LOS DATOS DE LA CUENTA...SI TIENE
  useEffect(() => {
    const fetchData = async (_data) => {
      const response = await actions.graphApi(_data)

      if (!response.error) {
        const respJSON = response.data
        if (respJSON.id !== undefined) {
          if (funcionario.nombreCompleto !== respJSON.displayName) {
            setUpdateName(true)
          }

          setData(respJSON)
        }
      } else {
        return {}
      }
    }

    if (funcionario.idCuentaOffice365 !== null) {
      fetchData({
        username: funcionario.idCuentaOffice365,
        accion: 'GetUser',
        modulo: 'func'
      })
    }
  }, [funcionario, funcionario.idCuentaOffice365])

  const createAccount = async () => {
    const password = generatePassword()
    const _body = {
      accountEnabled: true,
      displayName: funcionario.nombreCompleto,
      mailNickname: funcionario.identificacion,
      userPrincipalName: emailOptions[inputValues?.option]?.value,
      mail: emailOptions[inputValues?.option]?.value,
      city: funcionario.identificacion,
      givenName: funcionario.nombre,
      surname: `${funcionario.primerApellido} ${funcionario.segundoApellido}`,
      department: 'Funcionarios',
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password
      },
      usageLocation: 'CR'
    }
    const data = {
      accion: 'CreateUser',
      identidadId: funcionario.identidadId,
      name: funcionario.nombreCompleto,
      id: funcionario.identificacion,
      idCuenta: '',
      email1: emailOptions[inputValues?.option]?.value,
      username: emailOptions[inputValues?.option]?.value,
      password,
      body: JSON.stringify(_body),
      modulo: 'func',
      tipoCuentaCorreo: inputValues?.type?.value?.id,
      tipoLicencia: 'A1'
    }
    const response = await actions.graphApi(data)
    if (!response.error) {
      await actions.updateCuentaCorreoProfesorInstitucion({
        id: funcionario?.id,
        cuentaCorreoOffice: true,
        idCuentaOffice365: response.data?.id,
        cuentaCorreo: response?.data?.mail
      })
      const respJSON = response.data

      if (respJSON.id === undefined) {
        // Si no trae los datos de la cuenta, hay un error.
        setSnackbarContent({
          variant: 'error',
          msg: t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>msj_error', 'Ha ocurrido un error al crear la cuenta de correo.')
        })
        handleClick()
        // hideProgress()
        // setLoading(false)
        return
      }
      const _data = {
        accion: 'GetReceivers',
        identidadId: funcionario?.identidadId,
        modulo: 'func'
      }
      const res = await actions.graphApi(_data)
      if (res.data) {
        let _mensaje = ''
        const _plantilla = getPlantillaTexto('O365-TEXTO-CREAR-CUENTA-EXITO-FUNC')
        if (_plantilla !== undefined) {
          _mensaje = Mustache.render(_plantilla.plantilla_HTML, {
            password
          })
        }

        setConfirmModalData({
          title: 'Creación de cuentas de correo',
          icon: 'check',
          mensaje: _mensaje,
          cancelButton: false,
          correos: [
            // { label: 'Padre', email: res.data.emailPadre },
            // { label: 'Madre', email: res.data.emailMadre },
            { label: 'Funcionarios', email: res.data.emailEstudiante },
            { label: 'Director', email: res.data.emailCurrentUser }
          ]
        })

        setOpenConfirmModal(true)
      }

      await GetUser(respJSON.id)

      // await GetUser(respJSON.id)
      // await getBitacora()
    } else {
      setSnackbarContent({
        variant: 'error',
        msg: 'Ha ocurrido un error al crear la cuenta de correo.'
      })
      handleClick()
    }
    actions.getFuncionarios(currentInstitution?.id)
  }
  const onAsociarCuenta = async () => {
    if (!inputValues?.mail || inputValues?.mail === '') {
      // setErrorAsociar('Campo Requerido')
      // setLoadingAsociarCorreo(false)
      setSnackbarContent({
        variant: 'error',
        msg: 'El correo es requerido.'
      })
      handleClick()
      return
    }
    if (
      !/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@mep.go.cr$/i.test(inputValues?.mail)
    ) {
      setSnackbarContent({
        variant: 'error',
        msg: 'Introduzca una dirección de correo valida.'
      })
      handleClick()
      return
    }
    const passwordPropuesto = generatePassword()
    const _body = {
      accountEnabled: true,
      displayName: funcionario.nombreCompleto,
      mailNickname: funcionario.identificacion,
      userPrincipalName: inputValues?.mail,
      mail: inputValues?.mail,
      city: funcionario.identificacion,
      givenName: funcionario.nombre,
      surname: `${funcionario.primerApellido} ${funcionario.segundoApellido}`,
      department: 'Funcionarios',
      // tipoDeLicencia: 'A1',
      usageLocation: 'CR'
    }
    const _data = {
      accion: typeAction === 'asociar' ? 'SetCorreoUser' : 'UpdateCorreoUser',
      identidadId: funcionario.identidadId,
      idCuenta: funcionario?.idCuentaOffice365,
      id: funcionario.identificacion,
      username: inputValues?.mail,
      password: passwordPropuesto,
      body: JSON.stringify(_body),
      modulo: 'func'
    }

    const response = await actions.graphApi(_data)
    if (!response.error) {
      await actions.updateCuentaCorreoProfesorInstitucion({
        id: funcionario?.id,
        cuentaCorreoOffice: true,
        idCuentaOffice365: response.data?.id,
        cuentaCorreo: response?.data?.mail
      })

      getBitacora()
      // await getBitacora()
      setSnackbarContent({
        variant: 'success',
        msg: 'Se ha asignado correctamente el correo al usuario.'
      })
      handleClick()
    } else {
      setSnackbarContent({
        variant: 'error',
        msg: 'Ha ocurrido un error al asociar la cuenta.'
      })
      handleClick()
    }
    actions.getFuncionarios(currentInstitution?.id)
  }

  const handleUpdateAccount = async () => {
    const _body = {
      displayName: funcionario.nombreCompleto,
      givenName: funcionario.nombre,
      surname: `${funcionario.primerApellido} ${funcionario.segundoApellido}`
    }

    const _data = {
      idCuenta: funcionario.idCuentaOffice365,
      identidadId: funcionario.identidadId,
      username: data.userPrincipalName,
      email1: data.userPrincipalName,
      accion: 'UpdateUserAndEmail',
      id: funcionario.identificacion,
      body: JSON.stringify(_body),
      modulo: 'func'
    }

    const response = await actions.graphApi(_data)
    if (!response.error) {
      await actions.updateCuentaCorreoProfesorInstitucion({
        id: funcionario?.id,
        cuentaCorreoOffice: true,
        idCuentaOffice365: funcionario.idCuentaOffice365,
        cuentaCorreo: funcionario.cuentaCorreo
      })
      if (response.data === '') {
        GetUser(data.id)

        let _mensaje = ''
        const _plantilla = getPlantillaTexto('O365-TEXTO-ACTUALIZAR-NOMBRE-EXITO-FUNC')
        if (_plantilla !== undefined) {
          _mensaje = Mustache.render(_plantilla.plantilla_HTML, {})
        }

        setConfirmModalData({
          title: 'Actualizar datos',
          icon: 'check',
          mensaje: _mensaje,
          cancelButton: false
        })
        setOpenConfirmModal(true)

        await getBitacora()
      } else {
        setSnackbarContent({
          variant: 'error',
          msg: 'Ha ocurrido un error al intentar actualizar el nombre de la cuenta de correo.'
        })

        handleClick()
      }
      getBitacora()
      actions.getFuncionarios(currentInstitution?.id)
    }
  }

  const handleResetPassword = async (pass) => {
    const passwordPropuesto = pass
    const _data = {
      idCuenta: data.id,
      identidadId: funcionario.identidadId,
      username: data.userPrincipalName,
      email1: data.userPrincipalName,
      password: passwordPropuesto,
      accion: 'UpdatePass',
      name: data.displayName,
      modulo: 'func'
    }
    const response = await actions.graphApi(_data)

    if (response.data === '') {
      const _data2 = {
        accion: 'GetReceivers',
        identidadId: funcionario.identidadId
      }

      const response2 = await actions.graphApi(_data2)
      if (response2.data) {
        let _mensaje = ''
        const _plantilla = getPlantillaTexto('O365-TEXTO-RESETEAR-CONTRA-EXITO-FUNC')
        if (_plantilla !== undefined) {
          _mensaje = Mustache.render(_plantilla.plantilla_HTML, {
            password: passwordPropuesto
          })
        }

        setConfirmModalData({
          title: 'Resetear la contraseña',
          icon: 'check',
          mensaje: _mensaje,
          cancelButton: false,
          correos: [
            // { label: 'Padre', email: response2.data.emailPadre },
            // { label: 'Madre', email: response2.data.emailMadre },
            { label: 'Funcionario', email: response2.data.emailEstudiante },
            { label: 'Director', email: response2.data.emailCurrentUser }
          ]
        })

        setOpenConfirmModal(true)

        await getBitacora()
      }
    } else {
      if (
        response.data.indexOf(
          'No puede resetear la contraseña en estos momentos'
        ) !== -1
      ) {
        setSnackbarContent({ variant: 'error', msg: response.data })
        handleClick()
      } else {
        setSnackbarContent({
          variant: 'error',
          msg: 'Ha ocurrido un error al resetear la contraseña de la cuenta de correo.'
        })
        handleClick()
      }
    }
  }
  return (
    <Box>
      {snackbar(snackbarContent?.variant, snackbarContent?.msg)}
      <Modal isOpen={openModal} toggle={() => setOpenModal(false)}>
        <ModalHeader>
          {typeAction === 'asociar' && t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>asociar_cuenta_correo', 'Asociar cuenta de correo')}
          {typeAction === 'create' && t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>creacion_cuenta_correo', 'Creación de cuenta de correo')}
          {typeAction === 'resetPassword' && 'Resetear contraseña'}
        </ModalHeader>
        <ModalBody>
          {
            typeAction === 'create' && (
              <Col sm='12' lg='12'>
                <Label style={{ fontSize: '0.75rem' }}>{t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>tipo_cuenta', 'Tipo de cuenta de correo')}</Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  classNamePrefix='react-select'
                  placeholder=''
                  options={tipoCorreos.map((el) => ({
                    label: el?.nombre,
                    value: el
                  }))}
                  onChange={(value) => {
                    setInputValues({
                      ...inputValues,
                      type: value
                    })
                  }}
                  value={inputValues.type}
                />

                <Label style={{ margin: '1rem 0', fontSize: '0.75rem' }}>{t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>seleccione_correo', 'Seleccione el correo electrónico deseado')}:</Label>
                <ul style={{ margin: 0, padding: 0 }}>
                  {emailOptions.map((el) => (
                    <li
                      key={el?.value}
                      className='d-flex align-items-center mb-3'
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setInputValues({
                          ...inputValues,
                          option: el?.id
                        })
                      }}
                    >
                      <input
                        type='checkbox'
                        className='mr-3'
                        checked={inputValues?.option === el?.id}
                        style={{
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setInputValues({
                            ...inputValues,
                            option: el?.id
                          })
                        }}
                      />
                      <div>{el?.value}</div>
                    </li>
                  ))}
                </ul>
                <div className='' />
              </Col>
            )
          }
          {
            typeAction === 'asociar' && (
              <>
                <div>
                  {t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>asociar_cuenta_msj', 'Esta funcionalidad, permite asociar al funcionario un correo electrónico que ya posee, con el fin de registrarlo adecuadamente. Esta funcionalidad es irreversible, asegure de realizarlo correctamente, si está de acuerdo registre el correo actual del estudiante y presione aceptar, de lo contrario presione sobre cancelar.')}
                </div>
                <Label style={{ margin: '1rem 0', fontSize: '0.75rem' }}>{t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_correo', 'Correo')}:</Label>
                <Input
                  type='email'
                  value={inputValues?.mail}
                  onChange={(e) => {
                    setInputValues({
                      ...inputValues,
                      mail: e.target.value
                    })
                  }}
                />
              </>
            )
          }
          {
            typeAction === 'update' && (
              <>
                <div>
                  {t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>act_cuenta_msj', 'Se actualizarán los datos de la cuenta de correo con la información del funcionario.')}
                </div>
              </>
            )
          }
        </ModalBody>
        <ModalFooter>
          <div className='d-flex justify-content-center w-100 align-items-center'>
            <Button
              color='primary'
              outline
              className='mr-3'
              onClick={() => {
                setOpenModal(false)
                setInputValues({
                  type: null,
                  option: null,
                  mail: null
                })
              }}
            >
              {t('general>cancelar', 'Cancelar')}
            </Button>
            <Button
              color='primary'
              onClick={() => {
                if (typeAction === 'create') {
                  createAccount().then((res) => {
                    setOpenModal(false)
                    setInputValues({
                      type: null,
                      option: null,
                      mail: null
                    })
                  })
                }

                if (typeAction === 'asociar') {
                  onAsociarCuenta().then((res) => {
                    setOpenModal(false)
                    setInputValues({
                      type: null,
                      option: null,
                      mail: null
                    })
                  })
                }

                if (typeAction === 'update') {
                  handleUpdateAccount().then((res) => {
                    setOpenModal(false)
                    setInputValues({
                      type: null,
                      option: null,
                      mail: null
                    })
                  })
                }
              }}
            >
              {t('general>guardar', 'Guardar')}
            </Button>'
          </div>
        </ModalFooter>
      </Modal>
      {
        !funcionario?.cuentaCorreoOffice ? (
          <Card>
            <CardBody>
              <div>
                <h5>{t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>titulo', 'Datos de la cuenta')}</h5>
                <p>
                  {t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>msj', 'Señor director, este funcionario no posee una cuenta de correo asociada a la identificación, si quiere crear una nueva cuenta, presione el botón "Crear cuenta de correo"')}
                </p>
                <Button
                  color='primary'
                  onClick={() => {
                    setOpenModal(true)
                    setTypeAction('create')
                  }}
                >
                  {t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>crear_cuenta', 'Crear cuenta de correo')}
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Row>
            <Col xs='12' lg='6'>
              <Card>
                <CardBody>
                  <Form>
                    <Row>
                      <Col sm='12'>
                        <FormGroup>
                          <Label style={{ fontSize: '0.75rem' }}> {t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>nombre_cuenta', 'Nombre de la cuenta')} </Label>
                          <Input
                            type='text'
                            name='nombre'
                            value={data.displayName}
                            onChange={() => { }}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col sm='12'>
                        <FormGroup>
                          <Label style={{ fontSize: '0.75rem' }}> {t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>correo_electronico_asociado', 'Correo electrónico asociado')} </Label>
                          <Input
                            type='text'
                            name='email'
                            value={data.userPrincipalName}
                            onChange={() => { }}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col xs='12' className='d-flex flex-wrap'>
                        <Button
                          color='primary'
                          className='mr-3'
                          onClick={() => {
                            setOpenModal(true)
                            setTypeAction('asociar')
                          }}
                        >
                          {t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>editar_correo', 'Editar correo')}
                        </Button>
                        <Button
                          color='primary'
                          className='mr-3'
                          onClick={() => {
                            setOpenModal(true)
                            setTypeAction('update')
                          }}
                          // disabled={!updateName}
                        >
                          {t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>act_cuenta', 'Actualizar cuenta')}
                        </Button>
                        <Button
                          color='primary'
                          className='mr-3'
                          onClick={() => {
                            // setOpenModal(true)
                            // setTypeAction('resetPassword')
                            const passwordPropuesto = generatePassword()

                            let _mensaje = 'LA PLANTILLA DEL MENSAJE NO ESTA DISPONIBLE'
                            const _plantilla = getPlantillaTexto('O365-TEXTO-RESETEAR-CONTRA-CONFIRMA-FUNC')

                            if (_plantilla !== undefined) {
                              _mensaje = Mustache.render(_plantilla.plantilla_HTML, {
                                password: passwordPropuesto
                              })
                            }

                            setConfirmModalData({
                              title: 'Resetear la contraseña',
                              mensaje: _mensaje,
                              cancelButton: true,
                              action: () => {
                                handleResetPassword(passwordPropuesto)
                              },
                              textoAceptar: 'Aceptar'
                            })
                            setOpenConfirmModal(true)
                          }}
                          disabled={false}
                        >
                          {t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>resetar_contra', 'Resetear contraseña')}
                        </Button>
                        {
                            data.accountEnabled ? (
                              <>
                                {/* <Button
                                color="primary"
                                className="mr-3"
                                onClick={() => { }}
                                disabled={false}
                              >
                                Bloquear cuenta
                              </Button> */}
                              </>
                            ) : (
                              <Button
                                color='primary'
                                className='mr-3'
                                onClick={() => { }}
                                disabled={false}
                              >
                                {t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>habilitar_cuenta', 'Habilitar cuenta')}
                              </Button>
                            )
                          }
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col xs='12' lg='6'>
              <Card>
                <CardBody>
                  <CardTitle tag='h4'>{t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>historial_title', 'Historial de cambios de la cuenta')}</CardTitle>

                  <div
                    className='table-responsive'
                    style={{ height: '10.5rem', overflowY: 'auto' }}
                  >
                    <table className='table'>
                      <thead style={{ background: '#145388', color: 'white' }}>
                        <tr>
                          <th>{t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>fecha', 'Fecha')}</th>
                          <th>{t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>hora', 'Hora')}</th>
                          <th>{t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>accion', 'Acción')}</th>
                          <th>{t('expediente_ce>recurso_humano>fun_ce>cuenta_correo>usuario', 'Usuario')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bitacoraData.map((item) => {
                          const objectJson =
                            item.json !== '' ? JSON.parse(item.json) : {}
                          return (
                            <tr style={{ fontSize: 11 }}>
                              <td>
                                {moment(item.fechaHora).format('DD/MM/YYYY')}
                              </td>
                              <td>
                                {moment(item.fechaHora).format('hh:mm:ss A')}{' '}
                              </td>
                              <td>{objectJson.Accion}</td>
                              <td>{item.usuario}</td>
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
        )
      }
      {openConfirmModal && (
        <MensajeModal
          openDialog={openConfirmModal}
          onClose={() => {
            setOpenConfirmModal(false)
            setConfirmModalData({ title: '', mensaje: '', cancelButton: false })
          }}
          title={confirmModalData?.title}
          texto={confirmModalData?.mensaje}
          pregunta={confirmModalData?.pregunta}
          txtBtn='Aceptar'
          colorBtn='Primary'
          // loading={loading}
          action={confirmModalData?.action}
          btnCancel={confirmModalData?.cancelButton}
          textoAceptar={
            confirmModalData?.textoAceptar || 'Aceptar'
          }
          password={confirmModalData?.password ? confirmModalData?.password : ''}
          icon={
            confirmModalData?.icon ? confirmModalData?.icon : 'exclamation-circle'
          }
          correos={confirmModalData?.correos ? confirmModalData?.correos : []}
        />
      )}
    </Box>
  )
}

export default CuentaCorreo

const Box = styled.div`
  width: 100%;
  // max-width: ;
  // min-height: 10rem;
  // max-height: 100%;
  background: transparent;
  // border-radius: 10px;
  // box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
  margin-top: 1%;
  margin-right: 1%;
  margin-bottom: 2%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  
`
