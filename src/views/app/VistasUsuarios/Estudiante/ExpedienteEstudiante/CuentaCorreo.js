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

import moment from 'moment'
import MensajeModal from './_partials/cuentaCorreo/MensajeModal'
import { showProgress, hideProgress } from 'Utils/progress'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../../hooks/useActions'
import useNotification from '../../../../../hooks/useNotification'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Mustache from 'mustache'
import { generatePassword } from 'Utils/utils'

import {
  graphApi,
  getMotivos,
  getTemplatesModulo
} from 'Redux/office365/actions'

const DOMAIN = '@est.mep.go.cr'

const MotivoSeleccionado = { label: '', value: null, codigo: '' }

const CuentaCorreo = (props) => {
  const [snackBar, handleClick] = useNotification()
  const [openMensajeModal, setOpenMensajeModal] = useState(false)
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
  const [bitacoraData, setBitacoraData] = useState([])
  const [motivos, setMotivos] = useState([])
  const [templates, setTemplates] = useState([])
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
    getTemplatesModulo
  })

  const state = useSelector((store) => {
    return {
      data: store.identification.data
    }
  })

  // AL ENNTRAR A LA VENTANA CARGA LA BITACORA
  useEffect(() => {
    if (state.data.id > 0) {
      const fetchData = async () => {
        await getBitacora()
      }

      setIdCuentaOffice365(state.data.idCuentaOffice365)
      setDatos({ ...datos, id: state.data.idCuentaOffice365 })

      fetchData()
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
  }, [])

  // AL ENTRAR A LA SECCION CARGA LOS DATOS DE LA CUENTA...SI TIENE
  useEffect(() => {
    if (idCuentaOffice365 !== null) {
      const _data = {
        username: idCuentaOffice365,
        accion: 'GetUser'
      }

      const fetchData = async () => {
        showProgress()
        setLoading(true)
        const response = await actions.graphApi(_data)
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
        } else {
          toggleSnackbar('error', response.data)
        }

        hideProgress()
        setLoading(false)
      }

      fetchData()
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
      textoAceptar: 'Aceptar'
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

  // MUESTRA MODAL PARA CONFIRMAR CREAR LA CUENTA
  const handleCrearCuenta = () => {
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

  // FUNCION PARA CREAR LA CUENTA
  const handleCrearCuentaConfirm = async () => {
    showProgress()
    setLoading(true)

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
    const passwordPropuesto = generatePassword()

    let _mensaje = 'LA PLANTILLA DEL MENSAJE NO ESTA DISPONIBLE'
    const _plantilla = getPlantillaTexto('O365-TEXTO-RESETEAR-CONTRA-CONFIRMA')

    if (_plantilla !== undefined) {
      _mensaje = Mustache.render(_plantilla.plantilla_HTML, {
        password: passwordPropuesto
      })
    }

    setDataMensajeModal({
      title: 'Resetear la contraseña',
      mensaje: _mensaje,
      cancelButton: true,
      action: () => {
        handleResetContreseniaConfirmar(passwordPropuesto)
      },
      textoAceptar: 'Aceptar'
    })
    setOpenMensajeModal(true)
  }

  // CONFIRMA RESETEAR EL PASSWORD
  const handleResetContreseniaConfirmar = async (pass) => {
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
    showProgress()
    setLoading(true)

    const nombreCompleto =
      state.data.nombre.trim() +
      ' ' +
      state.data.primerApellido.trim() +
      ' ' +
      state.data.segundoApellido

    const _body = {
      displayName: nombreCompleto,
      givenName: state.data.conocidoComo
        ? state.data.conocidoComo
        : state.data.nombre.trim(),
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
      accion: 'UpdateUser',
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

  return <></>
}

export default CuentaCorreo

/* export default withAuthorization({
  id: 14,
  Modulo: "Expediente Estudiantil",
  Apartado: "Cuenta de Correo",
  Seccion: "Cuenta de Correo"
})(withIdentification(withRouter(CuentaCorreo))); */
