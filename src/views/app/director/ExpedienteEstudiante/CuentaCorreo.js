import React, { useState, useEffect } from 'react'
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
import styled from 'styled-components'
import Loader from 'Components/LoaderContainer'

import moment from 'moment'
import MensajeModal from './_partials/cuentaCorreo/MensajeModal'
import { showProgress, hideProgress } from 'Utils/progress'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../hooks/useActions'
import useNotification from '../../../../hooks/useNotification'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Mustache from 'mustache'
import { generatePassword } from 'Utils/utils'
import SimpleModal from 'Components/Modal/simple'
import {
  graphApi,
  getMotivos,
  getTemplatesModulo,
  updateIdentityEmail
} from 'Redux/office365/actions'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { useTranslation } from 'react-i18next'

const DOMAIN = '@est.mep.go.cr'

let MotivoSeleccionado = { label: '', value: null, codigo: '' }

const CuentaCorreo = (props) => {
  const [t] = useTranslation()
  const [snackBar, handleClick] = useNotification()
  const [openMensajeModal, setOpenMensajeModal] = useState(false)
  const [loadingAsociarCorreo, setLoadingAsociarCorreo] = useState(false)
  const [correoAsociarModal, setCorreoAsociarModal] = useState(null)
  const [dataAsociarModal, setDataAsociarModal] = useState(null)
  const [confirmModal, setConfirmModal] = useState(false)

  const [dataMensajeModal, setDataMensajeModal] = useState({
    title: '',
    mensaje: '',
    cancelButton: false
  })
  const [loading, setLoading] = useState(false)
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [motivoCuentaBloqueo, setMotivoCuentaBloqueo] = useState('')
  const [actualizarNombre, setActualizarNombre] = useState(false)
  const [errorAsociar, setErrorAsociar] = useState(null)
  const [modalEditarCorreo, setModalEditarCorreo] = useState(false)
  const [typeAsociar, setTypeAsociar] = useState('asociar')
  const [bitacoraData, setBitacoraData] = useState([])
  const [motivos, setMotivos] = useState([])
  const [templates, setTemplates] = useState([])
  const [passwordAsociar, setPasswordAsociar] = useState('')
  const [motivoSelected, setMotivoSelected] = useState({
    label: '',
    value: null,
    codigo: ''
  })
  const [textoNoCuenta, setTextoNoCuenta] = useState('')
  const [idCuentaOffice365, setIdCuentaOffice365] = useState(null)
  const [datos, setDatos] = useState({
    id: null,
    displayName: '',
    userPrincipalName: '',
    accountEnabled: false
  })

  const toggleSnackbar = (variant, msg) => {
    setSnacbarContent({
      variant,
      msg
    })
    handleClick()
  }

  const actions = useActions({
    graphApi,
    getMotivos,
    getTemplatesModulo,
    updateIdentityEmail
  })

  const state = useSelector((store) => {
    return {
      data: store.identification.data
    }
  })

  // AL ENTRAR A LA VENTANA CARGA LA BITACORA
  useEffect(() => {
    if (state.data.id > 0) {
      const fetchData = async () => {
        await getBitacora()
      }

      setIdCuentaOffice365(state.data.idCuentaOffice365)
      setDatos({ ...datos, id: state.data.idCuentaOffice365 })

      fetchData()
    } else {
      setDatos({
        id: null,
        displayName: '',
        userPrincipalName: '',
        accountEnabled: false
      })
    }
  }, [state.data.id])

  // CARGA REGISTROS INICIALES (MOTIVOS, PLANTILLAS)
  useEffect(() => {
    if (state.data.id > 0) {
      const fetchData = async () => {
        const resp = await actions.getMotivos('motivosBloqueoCuentaoffice365')

        if (!resp.error) {
          const _dataMotivos = resp.data.map((item) => {
            return { label: item.nombre, value: item.id, codigo: item.codigo }
          })
          setMotivos(_dataMotivos)
        }

        const respTemplates = await actions.getTemplatesModulo(2)
        if (!respTemplates.error) {
          setTemplates(respTemplates.data)

          const _plantilla = respTemplates.data.find(
            (x) => x.codigo === 'O365-TEXTO-NO-POSSEE-CUENTA'
          )
          if (_plantilla !== undefined) {
            const rendered = Mustache.render(_plantilla.plantilla_HTML, {
              identificacion: state.data.identificacion
            })

            setTextoNoCuenta(rendered)
          }
        }
      }

      fetchData()
    }
  }, [state.data.id])

  // AL ENTRAR A LA SECCIÓN CARGA LOS DATOS DE LA CUENTA...SI TIENE
  useEffect(() => {
    const fetchData = async (_data) => {
      showProgress()
      setLoading(true)
      const response = await actions.graphApi(_data)

      if (!idCuentaOffice365) {
        if (response?.data?.mail?.indexOf('@est') > -1) {
          // Si el correo del tentant pertenece a un estudiante.
          // Se actualiza el email en la base de datos
          actions.updateIdentityEmail(
            response.data.id,
            state.data.id,
            _data.username
          )
        }
      }

      if (!response.error) {
        const respJSON = response.data
        if (respJSON.id !== undefined) {
          const nombreCompleto =
            state.data.nombre.trim() +
            ' ' +
            state.data.primerApellido.trim() +
            ' ' +
            state.data.segundoApellido.trim()
          if (nombreCompleto !== respJSON.displayName) {
            setActualizarNombre(true)
          }

          setDatos(respJSON)
        }
        hideProgress()
        setLoading(false)
      } else {
        toggleSnackbar('error', response.data)
        return {}
      }
    }

    if (idCuentaOffice365 !== null) {
      fetchData({
        username: idCuentaOffice365,
        accion: 'GetUser'
      })
    } else {
      const username = state.data.identificacion + DOMAIN
      fetchData({
        username,
        accion: 'GetUser'
      })
    }
  }, [state.data, idCuentaOffice365])

  const onChangeMotivoBloqueo = (e) => {
    setMotivoCuentaBloqueo(e.target.value)
  }

  const getPlantillaTexto = (codigo) => {
    const _template = templates.find((x) => x.codigo === codigo)
    if (_template !== undefined) {
      return _template
    } else {
      return ''
    }
  }

  // OBTIENE LA BITACORA DE LA CUENTA
  const getBitacora = async (e) => {
    const _data = {
      accion: 'GetBitacora',
      identidadId: state.data.id
    }

    const response = await actions.graphApi(_data)

    if (!response.error) {
      setBitacoraData(response.data)
    }
  }

  // MUESTRA MODAL CUANDO AL SELECCIONAR BLOQUEAR
  const handleBloquearCuenta = (estado) => {
    let _mensaje = 'LA PLANTILLA DEL MENSAJE NO ESTA DISPONIBLE'
    let _titulo = ''
    if (!estado) {
      _titulo = 'Bloquear cuenta de correo'
      const _plantilla = getPlantillaTexto('O365-TEXTO-BLOQUEAR-CUENTA-CONFIRMA')
      if (_plantilla !== undefined) {
        _mensaje = Mustache.render(_plantilla.plantilla_HTML, {
          identificacion: state.data.identificacion,
          nombreEstudiante: datos.displayName,
          email: datos.userPrincipalName
        })
      }
    } else {
      _titulo = 'Habilitar cuenta de correo'
      const _plantilla = getPlantillaTexto('O365-TEXTO-HABILITA-CUENTA-CONFIRMA')
      if (_plantilla !== undefined) {
        _mensaje = Mustache.render(_plantilla.plantilla_HTML, {
          identificacion: state.data.identificacion,
          nombreEstudiante: datos.displayName,
          email: datos.userPrincipalName
        })
      }
    }

    setDataMensajeModal({
      title: _titulo,
      mensaje: _mensaje,
      cancelButton: true,
      action: () => {
        handleBloquearCuentaConfirm(estado)
      },
      showMotivo: !estado,
      textoAceptar: t('general>aceptar', 'Aceptar')
    })
    setOpenMensajeModal(true)
  }

  // CONFIRMA BLOQUEAR LA CUENTA
  const handleBloquearCuentaConfirm = async (enabled) => {
    let motivo = ''
    if (!enabled) {
      if (MotivoSeleccionado.value === null) {
        toggleSnackbar(
          'error',
          'Debe seleccionar el motivo de bloqueo de cuenta de correo.'
        )
        return
      }

      if (MotivoSeleccionado.codigo === 'OTRO') {
        motivo = document.getElementById('motivoBloqueCuenta')?.value
        if (motivo.trim() === '') {
          toggleSnackbar(
            'error',
            'Debe escribir el motivo de bloqueo de la cuenta de correo.'
          )
          return
        }
      }
    }
    showProgress()
    setLoading(true)
    const _body = {
      accountEnabled: enabled
    }

    const _data = {
      accion: 'EnableAccount',
      accountEnabled: enabled,
      idCuenta: datos.id,
      identidadId: state.data.id,
      username: datos.userPrincipalName,
      name: datos.displayName,
      body: JSON.stringify(_body),
      motivo: motivo || '',
      tipoMotivoId: !enabled ? MotivoSeleccionado?.value : 0
    }

    const response = await actions.graphApi(_data)

    if (!response.error) {
      let _text = 'La cuenta de correo ha sido habilitada.'
      if (!enabled) {
        _text = 'La cuenta de correo ha sido bloqueada.'
      }
      setDataMensajeModal({
        title: enabled
          ? 'Habilitar cuenta de correo'
          : 'Bloquear cuenta de correo',
        icon: 'check',
        mensaje: _text,
        cancelButton: false
      })
      setOpenMensajeModal(true)
      await GetUser(datos.id)
      await getBitacora()
    } else {
      toggleSnackbar(
        'error',
        'Ha ocurrido un error al tratar de cambiar el estado de la cuenta.'
      )
    }

    setMotivoCuentaBloqueo('')
    hideProgress()
    setLoading(false)
  }

  // OBTIENE LOS DATOS DE LA CUENTA
  const GetUser = async (id) => {
    const _data = {
      username: id,
      accion: 'GetUser'
    }

    const response = await actions.graphApi(_data)
    if (!response.error) {
      const respJSON = response.data

      const nombreCompleto =
        state.data.nombre.trim() +
        ' ' +
        state.data.primerApellido.trim() +
        ' ' +
        state.data.segundoApellido.trim()
      if (nombreCompleto !== respJSON.displayName) {
        setActualizarNombre(true)
      }

      setDatos(respJSON)
    }
  }
  // MUESTRA MODAL PARA ASOCIAR  LA CUENTA
  const handleModalAsociarCuenta = (type) => {
    if (props.avoidChanges) return
    setTypeAsociar(type)
    setModalEditarCorreo(true)
  }

  // CIERRA MODAL PARA ASOCIAR  LA CUENTA
  const closeModalAsociarCuenta = () => {
    setTypeAsociar('')
    setCorreoAsociarModal('')
    setModalEditarCorreo(false)
    setErrorAsociar(null)
    setDataAsociarModal(null)
    setPasswordAsociar('')
  }

  // ENVIAR CORREO PARA ASOCIAR  LA CUENTA
  const onAsociarCuenta = async () => {
    if (!correoAsociarModal || correoAsociarModal === '') {
      setErrorAsociar('Campo Requerido')
      setLoadingAsociarCorreo(false)
      return
    }
    if (
      !/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@est.mep.go.cr$/i.test(
        correoAsociarModal
      )
    ) {
      setErrorAsociart('estudiantes>buscador_per>info_cuenta>editar_correo>modal_error', 'Introduzca una dirección de correo estudiantil')
      setLoadingAsociarCorreo(false)
      return
    }
    const identificacion = state.data.identificacion
    const nombreCompleto =
      state.data.nombre.trim() +
      ' ' +
      state.data.primerApellido.trim() +
      ' ' +
      state.data.segundoApellido.trim()

    setErrorAsociar(null)
    setLoadingAsociarCorreo(true)
    const passwordPropuesto = generatePassword()

    const _body = {
      accountEnabled: true,
      displayName: state.data.conocidoComo
        ? state.data.conocidoComo
        : nombreCompleto,
      mailNickname: identificacion,
      userPrincipalName: correoAsociarModal,
      mail: correoAsociarModal,
      city: identificacion,
      givenName: state.data.nombre.trim(),
      surname:
        state.data.primerApellido.trim() +
        ' ' +
        state.data.segundoApellido.trim(),
      department: 'Estudiante',
      usageLocation: 'CR'
    }

    const _data2 = {
      accion: typeAsociar === 'asociar' ? 'SetCorreoUser' : 'UpdateCorreoUser',
      identidadId: state.data.id,
      idCuenta: datos.id,
      id: identificacion,
      username: correoAsociarModal,
      password: passwordPropuesto,
      body: JSON.stringify(_body)
    }

    const response = await actions.graphApi(_data2)
    setLoadingAsociarCorreo(false)

    if (!response.error) {
      setPasswordAsociar(passwordPropuesto)
      const respJSON = response.data
      const _data = response.data
      setDataAsociarModal(_data)
      await GetUser(respJSON.id)
      await getBitacora()
      toggleSnackbar(
        'success',
        'Se ha asignado correctamente el correo al usuario.'
      )
    } else {
      setErrorAsociar(response.data)
    }
  }

  // MUESTRA MODAL PARA CONFIRMAR CREAR LA CUENTA
  const handleCrearCuenta = () => {
    if (props.avoidChanges) return
    let _mensaje = ''
    const _plantilla = getPlantillaTexto('O365-TEXTO-CREAR-CUENTA-CONFIRMA')
    if (_plantilla !== undefined) {
      _mensaje = Mustache.render(_plantilla.plantilla_HTML, {
        identificacion: state.data.identificacion,
        nombreEstudiante: datos.displayName,
        email: datos.userPrincipalName
      })
    }

    setDataMensajeModal({
      title: 'Creación de cuentas de correo',
      mensaje: _mensaje,
      cancelButton: true,
      action: handleCrearCuentaConfirm,
      textoAceptar: 'Crear'
    })
    setOpenMensajeModal(true)
  }

  // FUNCIÓN PARA CREAR LA CUENTA
  const handleCrearCuentaConfirm = async () => {
    showProgress()
    setLoading(true)
    if (props.avoidChanges) return

    const nombreCompleto =
      state.data.nombre.trim() +
      ' ' +
      state.data.primerApellido.trim() +
      ' ' +
      state.data.segundoApellido.trim()

    const passwordPropuesto = generatePassword()

    const emailPropuesto = state.data.identificacion + DOMAIN
    const identificacion = state.data.identificacion

    const _body = {
      accountEnabled: true,
      displayName: state.data.conocidoComo
        ? state.data.conocidoComo
        : nombreCompleto,
      mailNickname: identificacion,
      userPrincipalName: emailPropuesto,
      mail: emailPropuesto,
      city: identificacion,
      givenName: state.data.nombre.trim(),
      surname:
        state.data.primerApellido.trim() +
        ' ' +
        state.data.segundoApellido.trim(),
      department: 'Estudiante',
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: passwordPropuesto
      },
      usageLocation: 'CR'
    }

    const _data = {
      accion: 'CreateUser',
      identidadId: state.data.id,
      name: nombreCompleto,
      id: identificacion,
      idCuenta: '',
      email1: emailPropuesto,
      username: emailPropuesto,
      password: passwordPropuesto,
      body: JSON.stringify(_body)
    }

    const response = await actions.graphApi(_data)

    if (!response.error) {
      const respJSON = response.data

      if (respJSON.id === undefined) {
        // Si no trae los datos de la cuenta, hay un error.

        toggleSnackbar(
          'error',
          'Ha ocurrido un error al crear la cuenta de correo.'
        )
        hideProgress()
        setLoading(false)
        return
      }

      const _data2 = {
        accion: 'GetReceivers',
        identidadId: state.data.id
      }
      const response2 = await actions.graphApi(_data2)
      if (response2.data) {
        let _mensaje = ''
        const _plantilla = getPlantillaTexto('O365-TEXTO-CREAR-CUENTA-EXITO')
        if (_plantilla !== undefined) {
          _mensaje = Mustache.render(_plantilla.plantilla_HTML, {
            password: passwordPropuesto
          })
        }

        setDataMensajeModal({
          title: 'Creación de cuentas de correo',
          icon: 'check',
          mensaje: _mensaje,
          cancelButton: false,
          correos: [
            { label: 'Padre', email: response2.data.emailPadre },
            { label: 'Madre', email: response2.data.emailMadre },
            { label: 'Estudiante', email: response2.data.emailEstudiante },
            { label: 'Director', email: response2.data.emailCurrentUser }
          ]
        })

        setOpenMensajeModal(true)
      }

      await GetUser(respJSON.id)
      await getBitacora()
    } else {
      toggleSnackbar(
        'error',
        'Ha ocurrido un error al crear la cuenta de correo.'
      )
    }

    hideProgress()
    setLoading(false)
  }

  // MUESTRA MODAL PARA CONFIRMAR RESETEAR EL PASSWORD
  const handleResetContresenia = async () => {
    if (props.avoidChanges) return

    const passwordPropuesto = generatePassword()

    let _mensaje = 'LA PLANTILLA DEL MENSAJE NO ESTA DISPONIBLE'
    const _plantilla = getPlantillaTexto('O365-TEXTO-RESETEAR-CONTRA-CONFIRMA')

    if (_plantilla !== undefined) {
      _mensaje = Mustache.render(_plantilla.plantilla_HTML, {
        password: passwordPropuesto
      })
    }

    setDataMensajeModal({
      title: t('estudiantes>buscador_per>info_cuenta>resetear', 'Resetear la contraseña'),
      mensaje: _mensaje,
      cancelButton: true,
      action: () => {
        handleResetContreseniaConfirmar(passwordPropuesto)
      },
      textoAceptar: t('general>aceptar', 'Aceptar')
    })
    setOpenMensajeModal(true)
  }

  // CONFIRMA RESETEAR EL PASSWORD
  const handleResetContreseniaConfirmar = async (pass) => {
    if (props.avoidChanges) return
    showProgress()
    setLoading(true)

    const passwordPropuesto = pass
    const _data = {
      idCuenta: datos.id,
      identidadId: state.data.id,
      username: datos.userPrincipalName,
      email1: datos.userPrincipalName,
      password: passwordPropuesto,
      accion: 'UpdatePass',
      name: datos.displayName
    }
    const response = await actions.graphApi(_data)

    if (response.data === '') {
      const _data2 = {
        accion: 'GetReceivers',
        identidadId: state.data.id
      }

      const response2 = await actions.graphApi(_data2)

      if (response2.data) {
        let _mensaje = ''
        const _plantilla = getPlantillaTexto('O365-TEXTO-RESETEAR-CONTRA-EXITO')
        if (_plantilla !== undefined) {
          _mensaje = Mustache.render(_plantilla.plantilla_HTML, {
            password: passwordPropuesto
          })
        }

        setDataMensajeModal({
          title: 'Resetear la contraseña',
          icon: 'check',
          mensaje: _mensaje,
          cancelButton: false,
          correos: [
            { label: 'Padre', email: response2.data.emailPadre },
            { label: 'Madre', email: response2.data.emailMadre },
            { label: 'Estudiante', email: response2.data.emailEstudiante },
            { label: 'Director', email: response2.data.emailCurrentUser }
          ]
        })

        setOpenMensajeModal(true)

        await getBitacora()
      }
    } else {
      if (
        response.data.indexOf(
          'No puede resetear la contraseña en estos momentos'
        ) !== -1
      ) {
        toggleSnackbar('error', response.data)
      } else {
        toggleSnackbar(
          'error',
          'Ha ocurrido un error al resetear la contraseña de la cuenta de correo.'
        )
      }
    }

    hideProgress()
    setLoading(false)
  }

  // ACTUALIZA EL NOMBRE DE LA CUENTA
  const handleSincronizarCambios = async () => {
    setConfirmModal(false)
    showProgress()
    setLoading(true)

    const nombreCompleto =
      state.data.nombre.trim() +
      ' ' +
      state.data.primerApellido.trim() +
      ' ' +
      state.data.segundoApellido
    const identificacion = state.data.identificacion

    const _body = {
      displayName: state.data.conocidoComo
        ? state.data.conocidoComo
        : nombreCompleto,
      givenName: state.data.nombre.trim(),
      surname:
        state.data.primerApellido.trim() +
        ' ' +
        state.data.segundoApellido.trim()
    }

    const _data = {
      idCuenta: datos.id,
      identidadId: state.data.id,
      username: datos.userPrincipalName,
      email1: datos.userPrincipalName,
      accion: 'UpdateUserAndEmail',
      id: identificacion,
      body: JSON.stringify(_body)
    }

    const response = await actions.graphApi(_data)
    if (!response.error) {
      if (response.data === '') {
        GetUser(datos.id)

        let _mensaje = ''
        const _plantilla = getPlantillaTexto('O365-TEXTO-ACTUALIZAR-NOMBRE-EXITO')
        if (_plantilla !== undefined) {
          _mensaje = Mustache.render(_plantilla.plantilla_HTML, {})
        }

        setDataMensajeModal({
          title: 'Actualizar datos',
          icon: 'check',
          mensaje: _mensaje,
          cancelButton: false
        })
        setOpenMensajeModal(true)
        setActualizarNombre(false)

        await getBitacora()
      } else {
        toggleSnackbar(
          'error',
          'Ha ocurrido un error al intentar actualizar el nombre de la cuenta de correo.'
        )
      }
    }

    hideProgress()
    setLoading(false)
  }

  // EL MOTIVO DE BLOQUEO DE CUENTA NO ADMITE MAS DE 255S CARACTERES
  const onKeyPress = (e) => {
    const value = e.target.value
    if (value.length > 254) {
      e.preventDefault()
      return false
    }
  }
  const closeConfirmModal = () => {
    setConfirmModal(false)
  }

  if (props.esPrivado) return null

  return (
    <>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}

      <Row>
        <Col xs='12' lg='6'>
          <h4>{t('estudiantes>buscador_per>info_cuenta>info_cuenta', 'Información de la cuenta de correo del estudiante - TEAMS')}</h4>

          <Card>
            <CardBody>
              <CardTitle>{t('estudiantes>buscador_per>info_cuenta>datos_cuenta', 'Datos de la cuenta')}</CardTitle>

              {!loading && datos.id != null && datos.id !== '' && (
                <Form>
                  <Row>
                    <Col sm='12'>
                      <FormGroup>
                        <Label>{t('estudiantes>buscador_per>info_cuenta>nombre_cuenta', ' Nombre de la cuenta ')}</Label>
                        <Input
                          type='text'
                          name='nombre'
                          value={datos.displayName}
                          onChange={() => {}}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col sm='12'>
                      <FormGroup>
                        <Label>{t('estudiantes>buscador_per>info_cuenta>correo_asociado', 'Correo electrónico asociado')}</Label>
                        <Input
                          type='text'
                          name='email'
                          value={datos.userPrincipalName}
                          onChange={() => {}}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col xs='12' className='d-flex flex-wrap'>
                      {!props.avoidChanges && (
                        <Button
                          color='primary'
                          className='mr-3'
                          onClick={() => handleModalAsociarCuenta('editar')}
                        >
                          {t('estudiantes>buscador_per>info_cuenta>editar_correo', 'Editar correo')}
                        </Button>
                      )}
                      {!props.avoidChanges && (
                        <Button
                          color='primary'
                          className='mr-3'
                          onClick={() => setConfirmModal(true)}
                          disabled={false}
                          // disabled={!actualizarNombre}
                        >
                          {t('estudiantes>buscador_per>info_cuenta>actualizar_correo', 'Actualizar cuenta')}
                        </Button>
                      )}
                      {!props.avoidChanges && (
                        <Button
                          color='primary'
                          className='mr-3'
                          onClick={() => handleResetContresenia()}
                          disabled={false}
                        >
                          {t('estudiantes>buscador_per>info_cuenta>restaurar_contrasena', 'Resetear contraseña')}
                        </Button>
                      )}
                      {false && (
                        <Button
                          style={{ float: 'right' }}
                          color='danger'
                          onClick={() => handleBloquearCuenta(false)}
                          disabled={false}
                        >
                          Bloquear cuenta
                        </Button>
                      )}
                      {!datos.accountEnabled && !props.avoidChanges && (
                        <Button
                          style={{ float: 'right' }}
                          color='success'
                          onClick={() => handleBloquearCuenta(true)}
                          disabled={false}
                        >
                          Habilitar cuenta
                        </Button>
                      )}
                    </Col>
                  </Row>

                  <Row />
                </Form>
              )}

              {!loading && datos.id === null && (
                <Row>
                  <Col sm='12' id='O365-TEXT-NO-POSEE-CUENTA'>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: textoNoCuenta
                      }}
                    />
                  </Col>

                  {!props.avoidChanges && (
                    <Col
                      sm='12'
                      md='6'
                      className='d-flex align-items-center justify-content-center'
                    >
                      <Button
                        color='primary'
                        className='mr-3'
                        onClick={() => handleCrearCuenta()}
                        disabled={false}
                      >
                        Crear cuenta de correo
                      </Button>
                    </Col>
                  )}
                  {!props.avoidChanges && (
                    <Col
                      sm='12'
                      md='6'
                      className='d-flex align-items-center justify-content-center'
                    >
                      <Button
                        color='primary'
                        className='mr-3'
                        onClick={() => handleModalAsociarCuenta('asociar')}
                        disabled={false}
                      >
                        Asociar cuenta de correo
                      </Button>
                    </Col>
                  )}
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>

        {!loading && datos.id != null && datos.id !== '' && (
          <Col xs='12' lg='6' style={{ marginTop: 20 }}>
            <h4>{'  '}</h4>
            <Card>
              <CardBody>
                <CardTitle>{t('estudiantes>buscador_per>info_cuenta>historial_cambios', 'Historial de cambios de la cuenta')}</CardTitle>

                <div
                  className='table-responsive'
                  style={{ height: '10.5rem', overflowY: 'auto' }}
                >
                  <table className='table'>
                    <thead style={{ background: '#145388', color: 'white' }}>
                      <tr>
                        <th>{t('estudiantes>buscador_per>info_cuenta>historial_cambios>colum_fecha', 'Fecha')}</th>
                        <th>{t('estudiantes>buscador_per>info_cuenta>historial_cambios>colum_hora', 'Hora')} </th>
                        <th>{t('estudiantes>buscador_per>info_cuenta>historial_cambios>colum_accion', 'Acción')}</th>
                        <th>{t('estudiantes>buscador_per>info_cuenta>historial_cambios>colum_usuario', 'Usuario')} </th>
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
        )}
      </Row>
      <SimpleModal
        openDialog={modalEditarCorreo}
        onClose={() => closeModalAsociarCuenta()}
        title={t('estudiantes>buscador_per>info_cuenta>editar_correo>modal_titulo', 'Asociar correo')}
        txtBtn={dataAsociarModal ? 'Cerrar' : 'Guardar'}
        txtCancel='Cancelar'
        btnCancel={!dataAsociarModal}
        onCancel={() => closeModalAsociarCuenta()}
        onConfirm={() =>
          dataAsociarModal ? closeModalAsociarCuenta() : onAsociarCuenta()}
      >
        {!dataAsociarModal
          ? (
            <div
              style={{ width: '400px' }}
              className='d-flex align-items-center justify-content-center'
            >
              {loadingAsociarCorreo && <Loader />}

              <Row>
                <Col sm='12'>
                  <p>
                    {t('estudiantes>buscador_per>info_cuenta>editar_correo>modal_texto', 'Esta funcionalidad, permite asociar a la persona estudiante un correo electrónico que ya posee, con el fin de registrarlo adecuadamente en el expediente del estudiante. Esta funcionalidad es irreversible, asegure de realizarlo correctamente, si está de acuerdo registre el correo actual del estudiante y presione aceptar, de lo contrario presione sobre cancelar.')}
                  </p>
                </Col>
                <Col sm='12'>
                  <FormGroup className='mb-0'>
                    <Label>{t('estudiantes>buscador_per>info_cuenta>editar_correo>modal_correo', 'Correo electrónico asociado')} </Label>
                    <Input
                      invalid={errorAsociar}
                      type='text'
                      name='email'
                      value={correoAsociarModal}
                      onKeyPress={(e) => {
                        if (e.charCode == 13 || e.keyCode == 13) {
                          onAsociarCuenta()
                        }
                      }}
                      onChange={(e) => setCorreoAsociarModal(e.target.value)}
                    />
                  </FormGroup>
                  {errorAsociar && (
                    <ErrorFeedback className='mb-1'>{errorAsociar}</ErrorFeedback>
                  )}
                </Col>
              </Row>
            </div>
            )
          : (
            <Row>
              <Col sm='12'>
                <p>
                  {t('estudiantes>buscador_per>info_cuenta>editar_correo>modal_cambio', 'Se ha creado, cambiado o ajustado datos de una cuenta de correo electrónico que se detalla a continuación:')}
                </p>
              </Col>
              <Col sm='12'>
                <p className='w-100'>
                  <strong>{t('estudiantes>buscador_per>info_cuenta>editar_correo>modal_id', 'Identificación:')}  </strong>
                  {dataAsociarModal.mailNickname}
                </p>
                <p className='w-100'>
                  <strong>{t('estudiantes>buscador_per>info_cuenta>editar_correo>modal_nombre', 'Nombre:')} </strong> {dataAsociarModal.displayName}
                </p>
                <p className='w-100'>
                  <strong>{t('estudiantes>buscador_per>info_cuenta>editar_correo>modal_cuenta', 'Cuenta de correo:')} </strong>
                  {dataAsociarModal.mail}
                </p>
                <p className='w-100'>
                  <strong>{t('estudiantes>buscador_per>info_cuenta>editar_correo>modal_clave', 'Clave temporal:')} </strong>
                  {passwordAsociar}
                </p>
              </Col>

              <Col sm='12' className='mt-2'>
                <span>
                  Recuerde que es su responsabilidad hacer llegar estos datos a la
                  persona estudiante, de lo contrario, ésta no podrá hacer uso del
                  correo electrónico oficial del MEP.
                </span>
              </Col>
            </Row>
            )}
      </SimpleModal>

      {openMensajeModal && (
        <MensajeModal
          openDialog={openMensajeModal}
          onClose={() => {
            setOpenMensajeModal(false)
            setDataMensajeModal({ title: '', mensaje: '', cancelButton: false })
            setMotivoCuentaBloqueo('')
            setMotivoSelected({ label: '', value: null, codigo: '' })
            MotivoSeleccionado = { label: '', value: null, codigo: '' }
          }}
          title={dataMensajeModal.title}
          texto={dataMensajeModal.mensaje}
          pregunta={dataMensajeModal.pregunta}
          txtBtn={t('general>aceptar', 'Aceptar')}
          colorBtn='Primary'
          loading={loading}
          action={dataMensajeModal.action}
          btnCancel={dataMensajeModal.cancelButton}
          textoAceptar={
            dataMensajeModal.textoAceptar
              ? dataMensajeModal.textoAceptar
              : t('general>aceptar', 'Aceptar')
          }
          password={dataMensajeModal.password ? dataMensajeModal.password : ''}
          icon={
            dataMensajeModal.icon ? dataMensajeModal.icon : 'exclamation-circle'
          }
          correos={dataMensajeModal.correos ? dataMensajeModal.correos : []}
        >
          {dataMensajeModal.showMotivo && (
            <div>
              <FormGroup>
                <Label for='provincia'>
                  Seleccione un motivo de bloqueo de cuenta de correo
                </Label>
                <Select
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  classNamePrefix='react-select'
                  name='motivoselect'
                  inputId='motivoselect'
                  isDisabled={false}
                  onChange={(data) => {
                    setMotivoSelected(data)
                    MotivoSeleccionado = data
                  }}
                  value={MotivoSeleccionado}
                  placeholder='Seleccionar'
                  options={motivos}
                />
              </FormGroup>
            </div>
          )}

          {dataMensajeModal.showMotivo && motivoSelected.codigo === 'OTRO' && (
            <FormGroup>
              <Label for='provincia'>
                Motivo de bloqueo de cuenta de correo
              </Label>
              <Input
                placeholder='Escriba el motivo de bloqueo de la cuenta.'
                type='textarea'
                onKeyPress={onKeyPress}
                name='motivoBloqueCuenta'
                id='motivoBloqueCuenta'
                onChange={onChangeMotivoBloqueo}
                value={motivoCuentaBloqueo}
              />
            </FormGroup>
          )}
        </MensajeModal>
      )}
      <ConfirmModal
        openDialog={confirmModal}
        onClose={closeConfirmModal}
        onConfirm={() => handleSincronizarCambios()}
        colorBtn='primary'
        txtBtn='Actualizar'
        msg={t('estudiantes>buscador_per>info_cuenta>actualizar_info>texto', 'Se actualizarán los datos de la cuenta de correo con la información del estudiante.')}
        title={t('estudiantes>buscador_per>info_cuenta>actualizar_info', 'Actualizar información')}
      />
    </>
  )
}

const ErrorFeedback = styled.span`
  display: flex;
  color: #bd0505;
  left: 0;
  font-weight: bold;
  font-size: 12px;
  bottom: -19px;
`

// const CustomRow = styled(Row)`
//   display: flex;
//   justify-content:
// `

export default CuentaCorreo
